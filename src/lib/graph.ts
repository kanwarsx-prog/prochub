/**
 * Microsoft Graph API data layer.
 *
 * MODES:
 *  - USE_MOCK_DATA=true  → returns mock data (no SharePoint needed, for local dev)
 *  - USE_MOCK_DATA=false → calls Microsoft Graph API with client credentials flow
 *
 * Auth: App-only (client credentials) using MSAL.
 * The app's Azure AD service principal must have:
 *   Sites.Read.All  (for reading SharePoint lists and pages)
 *   Sites.ReadWrite.All  (for writing to the Favorites list)
 */

import { Process, ProcessDetail, ProcessLink, ProcessStep, SearchResult, Favorite, HubTool } from './types';
import { MOCK_PROCESSES, getMockProcessDetail, MOCK_HUB_TOOLS } from './mock-data';

const MOCK = process.env.USE_MOCK_DATA !== 'false';

// ---------------------------------------------------------------------------
// MSAL token acquisition (server-side, client credentials flow)
// ---------------------------------------------------------------------------

let _cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
    const now = Date.now();
    if (_cachedToken && _cachedToken.expiresAt > now + 60_000) {
        return _cachedToken.token;
    }

    const tenantId = process.env.AZURE_AD_TENANT_ID!;
    const clientId = process.env.AZURE_AD_CLIENT_ID!;
    const clientSecret = process.env.AZURE_AD_CLIENT_SECRET!;

    const res = await fetch(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
                scope: 'https://graph.microsoft.com/.default',
            }),
            cache: 'no-store',
        }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`MSAL token error: ${res.status} ${err}`);
    }

    const data = await res.json();
    _cachedToken = {
        token: data.access_token,
        expiresAt: now + data.expires_in * 1000,
    };
    return _cachedToken.token;
}

async function graphFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const token = await getAccessToken();
    return fetch(`https://graph.microsoft.com/v1.0${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
        next: { revalidate: 900 }, // ISR cache — 15 minutes
    });
}

// ---------------------------------------------------------------------------
// SharePoint config
// ---------------------------------------------------------------------------

const SITE_ID = process.env.SHAREPOINT_SITE_ID!;
const LIST_ID = process.env.SHAREPOINT_PROCESS_LIST_ID!;
const FAV_LIST = process.env.SHAREPOINT_FAVORITES_LIST_ID!;

// ---------------------------------------------------------------------------
// Mappers — SharePoint field names → app types
// ---------------------------------------------------------------------------

/**
 * Maps a raw SharePoint List item (from Graph) to a Process object.
 *
 * Expected SharePoint column names:
 *   Title, Block, Section, Domain, Summary, Status,
 *   ArticlePageUrl, Links (plain text: "Label|url\nLabel|url"),
 *   SortOrder, RelatedProcesses (lookup multi, returns comma-separated IDs)
 *
 * The item's SharePoint ID is used as the process ID (slugified title also acceptable).
 */
function mapSpItemToProcess(item: Record<string, unknown>): Process {
    const f = item.fields as Record<string, unknown>;

    // Parse "Label|/url" lines into ProcessLink[]
    const rawLinks = ((f.Links as string) ?? '').trim();
    const links: ProcessLink[] = rawLinks
        ? rawLinks.split('\n').map(line => {
            const [label, url] = line.split('|');
            return { label: label?.trim() ?? line, url: url?.trim() ?? '#' };
        })
        : [];

    // Related processes — stored as comma-separated item IDs
    const related = ((f.RelatedProcesses as string) ?? '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    return {
        id: item.id as string,
        title: (f.Title as string) ?? '',
        block: (f.Block as string) ?? '',
        section: (f.Section as string) ?? '',
        domain: (f.Domain as string) ?? '',
        summary: (f.Summary as string) ?? '',
        status: ((f.Status as string) === 'Draft' ? 'Draft' : 'Published') as Process['status'],
        articlePageUrl: (f.ArticlePageUrl as string) ?? undefined,
        links,
        related,
        lastModified: (item.lastModifiedDateTime as string)?.split('T')[0],
    };
}

/**
 * Fetches the rich text body of a SharePoint Modern Page.
 * Pages are identified by the URL stored in ArticlePageUrl.
 *
 * Graph path: /sites/{siteId}/pages?$filter=webUrl eq '{url}'&$select=canvasLayout
 */
async function fetchPageBody(articlePageUrl?: string): Promise<string> {
    if (!articlePageUrl) return '';
    try {
        // Extract relative server path from full URL
        const encoded = encodeURIComponent(articlePageUrl);
        const res = await graphFetch(
            `/sites/${SITE_ID}/pages?$filter=webUrl eq '${encoded}'&$select=canvasLayout`
        );
        if (!res.ok) return '';
        const data = await res.json();
        const page = data.value?.[0];
        if (!page) return '';

        // Extract HTML from text web parts in the canvas layout
        const html: string[] = [];
        for (const section of page.canvasLayout?.horizontalSections ?? []) {
            for (const col of section.columns ?? []) {
                for (const wp of col.webparts ?? []) {
                    if (wp.innerHtml) html.push(wp.innerHtml);
                    if (wp.data?.bodyHtml) html.push(wp.data.bodyHtml);
                }
            }
        }
        return html.join('\n');
    } catch {
        return '';
    }
}

/**
 * Parses numbered steps from the article page HTML.
 * Looks for <ol> list items in the page and converts them to ProcessStep[].
 * Falls back to empty array if no ordered list found.
 */
function extractStepsFromHtml(html: string): ProcessStep[] {
    // Regex to find <li> items inside <ol> blocks
    const listMatch = html.match(/<ol[^>]*>([\s\S]*?)<\/ol>/i);
    if (!listMatch) return [];
    const liMatches = [...listMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    return liMatches.map((m, i) => {
        const raw = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const [title, ...rest] = raw.split(/[.–—-]/, 2);
        return {
            order: i + 1,
            title: title?.trim() ?? `Step ${i + 1}`,
            summary: rest.join('').trim() || raw,
        };
    });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getProcesses(block?: string, section?: string): Promise<Process[]> {
    if (MOCK) {
        let results = [...MOCK_PROCESSES];
        if (block) results = results.filter(p => p.block === block);
        if (section) results = results.filter(p => p.section === section);
        return results;
    }

    const filters: string[] = ['fields/Status ne \'Draft\''];
    if (block) filters.push(`fields/Block eq '${block}'`);
    if (section) filters.push(`fields/Section eq '${section}'`);

    const filter = filters.join(' and ');
    const res = await graphFetch(
        `/sites/${SITE_ID}/lists/${LIST_ID}/items` +
        `?$expand=fields($select=Title,Block,Section,Domain,Summary,Status,ArticlePageUrl,Links,RelatedProcesses,SortOrder)` +
        `&$filter=${encodeURIComponent(filter)}` +
        `&$orderby=fields/SortOrder asc` +
        `&$top=200`
    );

    if (!res.ok) throw new Error(`Graph getProcesses error: ${res.status}`);
    const data = await res.json();
    return (data.value as Record<string, unknown>[]).map(mapSpItemToProcess);
}

export async function getProcess(id: string): Promise<ProcessDetail | null> {
    if (MOCK) return getMockProcessDetail(id);

    const res = await graphFetch(
        `/sites/${SITE_ID}/lists/${LIST_ID}/items/${id}` +
        `?$expand=fields($select=Title,Block,Section,Domain,Summary,Status,ArticlePageUrl,Links,RelatedProcesses)`
    );

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Graph getProcess error: ${res.status}`);

    const item = await res.json() as Record<string, unknown>;
    const base = mapSpItemToProcess(item);

    // Fetch the linked SharePoint page for rich content + steps
    const articleBody = await fetchPageBody(base.articlePageUrl);
    const steps = extractStepsFromHtml(articleBody);

    return { ...base, steps, articleBody };
}

export async function getRecentProcesses(limit = 6): Promise<Process[]> {
    if (MOCK) {
        return [...MOCK_PROCESSES]
            .sort((a, b) => new Date(b.lastModified ?? 0).getTime() - new Date(a.lastModified ?? 0).getTime())
            .slice(0, limit);
    }

    const res = await graphFetch(
        `/sites/${SITE_ID}/lists/${LIST_ID}/items` +
        `?$expand=fields($select=Title,Block,Section,Domain,Summary,Status,ArticlePageUrl,Links,RelatedProcesses)` +
        `&$orderby=lastModifiedDateTime desc` +
        `&$top=${limit}`
    );

    if (!res.ok) throw new Error(`Graph getRecentProcesses error: ${res.status}`);
    const data = await res.json();
    return (data.value as Record<string, unknown>[]).map(mapSpItemToProcess);
}

// ---------------------------------------------------------------------------
// Microsoft Search
// ---------------------------------------------------------------------------

export async function searchContent(term: string): Promise<SearchResult[]> {
    if (MOCK) {
        const q = term.toLowerCase();
        return MOCK_PROCESSES
            .filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.summary.toLowerCase().includes(q) ||
                p.section.toLowerCase().includes(q) ||
                p.domain.toLowerCase().includes(q)
            )
            .map(p => ({ id: p.id, title: p.title, summary: p.summary, url: `/process/${p.id}`, type: 'process' as const }));
    }

    const body = {
        requests: [{
            entityTypes: ['listItem', 'sitePage'],
            query: { queryString: `${term} site:${process.env.SHAREPOINT_SITE_URL}` },
            fields: ['id', 'title', 'summary', 'webUrl', 'listId'],
            from: 0,
            size: 20,
        }],
    };

    const res = await graphFetch('/search/query', {
        method: 'POST',
        body: JSON.stringify(body),
        next: { revalidate: 0 }, // search always fresh
    });

    if (!res.ok) throw new Error(`Microsoft Search error: ${res.status}`);
    const data = await res.json();

    const hits = data.value?.[0]?.hitsContainers?.[0]?.hits ?? [];
    return hits.map((h: Record<string, unknown>) => {
        const resource = h.resource as Record<string, unknown>;
        const fields = resource.fields as Record<string, unknown> | undefined;
        return {
            id: (resource.id ?? h.hitId) as string,
            title: (fields?.title ?? resource.name ?? 'Untitled') as string,
            summary: (h.summary ?? '') as string,
            url: `/process/${resource.id as string}`,
            type: 'process' as const,
        };
    });
}

// ---------------------------------------------------------------------------
// Favourites — stored in a dedicated SharePoint List
// ---------------------------------------------------------------------------

const _mockFavorites: Favorite[] = [];

export async function getFavorites(userId: string): Promise<Favorite[]> {
    if (MOCK) return _mockFavorites;

    const res = await graphFetch(
        `/sites/${SITE_ID}/lists/${FAV_LIST}/items` +
        `?$expand=fields($select=ProcessId,ProcessTitle,Block,UserId)` +
        `&$filter=fields/UserId eq '${userId}'`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.value as Record<string, unknown>[]).map(item => {
        const f = (item as Record<string, unknown>).fields as Record<string, unknown>;
        return {
            id: item.id as string,
            processId: f.ProcessId as string,
            title: f.ProcessTitle as string,
            block: f.Block as string,
        };
    });
}

export async function saveFavorite(userId: string, fav: Omit<Favorite, 'id'>): Promise<void> {
    if (MOCK) {
        const exists = _mockFavorites.some(f => f.processId === fav.processId);
        if (!exists) _mockFavorites.push({ ...fav, id: Date.now().toString() });
        return;
    }

    await graphFetch(`/sites/${SITE_ID}/lists/${FAV_LIST}/items`, {
        method: 'POST',
        body: JSON.stringify({
            fields: {
                UserId: userId,
                ProcessId: fav.processId,
                ProcessTitle: fav.title,
                Block: fav.block,
            },
        }),
        next: { revalidate: 0 },
    });
}

export async function removeFavorite(userId: string, processId: string): Promise<void> {
    if (MOCK) {
        const idx = _mockFavorites.findIndex(f => f.processId === processId);
        if (idx > -1) _mockFavorites.splice(idx, 1);
        return;
    }

    // Find the list item ID for this user + processId
    const res = await graphFetch(
        `/sites/${SITE_ID}/lists/${FAV_LIST}/items` +
        `?$filter=fields/UserId eq '${userId}' and fields/ProcessId eq '${processId}'` +
        `&$select=id`
    );
    const data = await res.json();
    const itemId = data.value?.[0]?.id;
    if (!itemId) return;

    await graphFetch(`/sites/${SITE_ID}/lists/${FAV_LIST}/items/${itemId}`, {
        method: 'DELETE',
        next: { revalidate: 0 },
    });
}

// ---------------------------------------------------------------------------
// Hub Tools — 'Procurement Hub Tools' SharePoint List
// ---------------------------------------------------------------------------

const TOOLS_LIST = process.env.SHAREPOINT_TOOLS_LIST_ID!;

function mapSpItemToTool(item: Record<string, unknown>): HubTool {
    const f = item.fields as Record<string, unknown>;
    return {
        id: item.id as string,
        name: (f.Title as string) ?? '',
        description: (f.Description as string) ?? '',
        url: (f.URL as string) ?? '#',
        icon: (f.Icon as string) ?? '🔗',
        color: (f.Color as string) ?? '#64748b',
        bg: (f.Background as string) ?? '#f8fafc',
        category: (f.Category as string) ?? '',
        group: (f.Group as string) ?? 'Apps',
        sortOrder: Number(f.SortOrder ?? 99),
        openInNewTab: (f.OpenInNewTab as boolean) ?? true,
    };
}

/**
 * Fetches all active tools from the 'Procurement Hub Tools' SharePoint List.
 * Content admins manage this list directly — no code change required to
 * add, remove, or reorder tools.
 *
 * SharePoint List columns:
 *   Title (text), Description (text), URL (text), Icon (text),
 *   Color (text, hex), Background (text, hex), Category (text),
 *   Group (choice: Apps | Reports | Support), SortOrder (number),
 *   OpenInNewTab (boolean), Status (choice: Active | Inactive)
 */
export async function getTools(): Promise<HubTool[]> {
    if (MOCK) return [...MOCK_HUB_TOOLS].sort((a, b) => a.sortOrder - b.sortOrder);

    const res = await graphFetch(
        `/sites/${SITE_ID}/lists/${TOOLS_LIST}/items` +
        `?$expand=fields($select=Title,Description,URL,Icon,Color,Background,Category,Group,SortOrder,OpenInNewTab,Status)` +
        `&$filter=fields/Status eq 'Active'` +
        `&$orderby=fields/SortOrder asc` +
        `&$top=100`
    );

    if (!res.ok) throw new Error(`Graph getTools error: ${res.status}`);
    const data = await res.json();
    return (data.value as Record<string, unknown>[]).map(mapSpItemToTool);
}
