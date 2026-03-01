import { Process, ProcessDetail, HubTool } from './types';

export const MOCK_PROCESSES: Process[] = [
    {
        id: 'sourcing-step-1-2',
        title: 'Sourcing Step 1/2',
        block: 'Execution',
        section: 'Sourcing',
        domain: 'Sourcing',
        status: 'Published',
        summary: 'Approval thresholds, competition checks, RFx build, scoring, award decision, and CLM handoff.',
        links: [
            { label: 'Approval matrix', url: '#' },
            { label: 'RFx templates', url: '#' },
            { label: 'Competition guidance', url: '#' },
        ],
        related: ['contract-management', 'spm-jbp'],
        lastModified: '2025-03-12',
    },
    {
        id: 'contract-management',
        title: 'Contract Management',
        block: 'Execution',
        section: 'Contracting',
        domain: 'Contract',
        status: 'Published',
        summary: 'When to use contracts vs PO-only, CLM steps, privacy and competition checks.',
        links: [
            { label: 'Trigger matrix', url: '#' },
            { label: 'Clause library', url: '#' },
            { label: 'Repository', url: '#' },
        ],
        related: ['sourcing-step-1-2', 'p2p'],
        lastModified: '2025-02-20',
    },
    {
        id: 'spm-jbp',
        title: 'Supplier Performance & JBP',
        block: 'Execution',
        section: 'SPM & JBP',
        domain: 'SPM & JBP',
        status: 'Published',
        summary: 'Cadence and JBP requirements by segment and region. KPI setting, scorecard cycles, escalation.',
        links: [
            { label: 'Cadence guide', url: '#' },
            { label: 'Scorecard template', url: '#' },
            { label: 'JBP template', url: '#' },
        ],
        related: ['sourcing-step-1-2'],
        lastModified: '2025-02-27',
    },
    {
        id: 'p2p',
        title: 'Procure to Pay (P2P)',
        block: 'Execution',
        section: 'P2P',
        domain: 'P2P',
        status: 'Published',
        summary: 'Buying channels, PR/PO creation, approval matrix, goods receipt, and 3-way match.',
        links: [
            { label: 'Channel guide', url: '#' },
            { label: 'Approval matrix', url: '#' },
            { label: '3WM guide', url: '#' },
        ],
        related: ['contract-management'],
        lastModified: '2025-02-02',
    },
    {
        id: 'category-strategy',
        title: 'Category Strategy',
        block: 'Planning',
        section: 'Category Planning',
        domain: 'Category',
        status: 'Published',
        summary: 'How to develop and maintain a category strategy — market analysis, segmentation, AOP alignment.',
        links: [
            { label: 'Category strategy template', url: '#' },
            { label: 'Market analysis guide', url: '#' },
        ],
        related: ['sourcing-step-1-2'],
        lastModified: '2025-01-15',
    },
    {
        id: 'risk-vcrm',
        title: 'Risk & VCRM',
        block: 'Risk & Gov',
        section: 'Risk Management',
        domain: 'Risk',
        status: 'Published',
        summary: 'Vendor and commodity risk management (VCRM) process, risk scoring, escalation triggers.',
        links: [
            { label: 'VCRM tool', url: '#' },
            { label: 'Risk register template', url: '#' },
        ],
        related: ['spm-jbp'],
        lastModified: '2025-01-30',
    },
    {
        id: 'competition-antitrust',
        title: 'Competition & Antitrust',
        block: 'Risk & Gov',
        section: 'Compliance',
        domain: 'Competition',
        status: 'Published',
        summary: 'Competition law obligations, information barriers, what to do if a supplier raises concerns.',
        links: [
            { label: 'Competition policy', url: '#' },
            { label: 'Legal escalation contacts', url: '#' },
        ],
        related: ['sourcing-step-1-2'],
        lastModified: '2025-02-10',
    },
    {
        id: 'systems-tools',
        title: 'Systems & Tools',
        block: 'Enablers',
        section: 'Systems',
        domain: 'Enablers',
        status: 'Published',
        summary: 'Guide to procurement systems: Ariba, CLM, P2P platforms, self-service portals.',
        links: [
            { label: 'System login guide', url: '#' },
            { label: 'Training materials', url: '#' },
        ],
        related: ['p2p', 'contract-management'],
        lastModified: '2025-01-20',
    },
];

export const MOCK_PROCESS_DETAILS: Record<string, ProcessDetail> = {
    'sourcing-step-1-2': {
        ...MOCK_PROCESSES[0],
        steps: [
            { order: 1, title: 'Intake', summary: 'Capture spend, category, market, competition flag, and stakeholder requirements.' },
            { order: 2, title: 'Competition check', summary: 'Antitrust clearance: determine if competition rules affect your route.' },
            { order: 3, title: 'Step 1/2 thresholds', summary: 'Apply approval thresholds by market. Collect evidence and sign-offs.' },
            { order: 4, title: 'RFx build', summary: 'Prepare the pack: commercial clauses, scoring model, Q&A schedule.' },
            { order: 5, title: 'Evaluation', summary: 'Score responses, apply risk and ESG overlays, prepare recommendation.' },
            { order: 6, title: 'Award decision', summary: 'Get approvals, document mitigations, issue award notice.' },
            { order: 7, title: 'CLM handoff', summary: 'Push award context into CLM. Initiate contracting if required.' },
        ],
        articleBody: `
      <h2>Overview</h2>
      <p>The Diageo sourcing process applies to all spend above relevant thresholds. The level of competition and number of approval stages (Step 1 vs Step 2) depends on spend value, market, and risk classification.</p>
      <h2>When to apply this process</h2>
      <ul>
        <li>New supplier engagements above threshold</li>
        <li>Contract renewals requiring re-competition</li>
        <li>Significant scope changes to existing agreements</li>
      </ul>
      <h2>Key contacts</h2>
      <p>Contact your Category Manager or the Supplier Excellence team for guidance on thresholds and approval routes.</p>
    `,
    },
    'contract-management': {
        ...MOCK_PROCESSES[1],
        steps: [
            { order: 1, title: 'Decide route', summary: 'Check triggers: spend level, term, data, IP, and risk flags to determine if a contract is required.' },
            { order: 2, title: 'Draft & review', summary: 'Use the clause library. Handle redlines and legal approvals.' },
            { order: 3, title: 'Sign & store', summary: 'e-sign, upload to repository, set renewal reminders, handoff to business owner.' },
        ],
        articleBody: `
      <h2>Contract vs PO-only</h2>
      <p>Not every purchase requires a formal contract. Use the trigger matrix to determine the right route. A PO may suffice for low-risk, low-spend transactions with existing suppliers.</p>
      <h2>Triggers requiring a contract</h2>
      <ul>
        <li>Spend above £100k (or local equivalent)</li>
        <li>Data processing or IP transfer</li>
        <li>Term exceeding 12 months</li>
        <li>High risk/strategic supplier classification</li>
      </ul>
    `,
    },
};

// Helper to get a process detail, filling in defaults for those without full mock
export function getMockProcessDetail(id: string): ProcessDetail | null {
    if (MOCK_PROCESS_DETAILS[id]) return MOCK_PROCESS_DETAILS[id];
    const base = MOCK_PROCESSES.find(p => p.id === id);
    if (!base) return null;
    return {
        ...base,
        steps: [
            { order: 1, title: 'Initiate', summary: 'Identify need and gather requirements.' },
            { order: 2, title: 'Execute', summary: 'Follow the process steps and engage stakeholders.' },
            { order: 3, title: 'Close', summary: 'Document outcome and hand off to next stage.' },
        ],
        articleBody: `<p>${base.summary}</p><p>Full guidance coming soon. Contact your procurement lead for interim support.</p>`,
    };
}

// ---------------------------------------------------------------------------
// Hub Tool Tiles — mirrors the 'Procurement Hub Tools' SharePoint List
// Group values control how tiles are grouped on the hub home page:
//   'Apps'    → core procurement systems (Coupa, iCertis, etc.)
//   'Reports' → analytics and reporting tools (Sievo, embedded reports)
//   'Support' → helpdesk and support links
// ---------------------------------------------------------------------------

export const MOCK_HUB_TOOLS: HubTool[] = [
    {
        id: 'coupa',
        name: 'Coupa',
        description: 'Purchase orders & invoicing',
        url: 'https://diageo.coupahost.com',
        icon: '🛒',
        color: '#e05a2b',
        bg: '#fff5f0',
        category: 'P2P',
        group: 'Apps',
        sortOrder: 1,
        openInNewTab: true,
    },
    {
        id: 'fairmarkit',
        name: 'Fairmarkit',
        description: 'Spot buy & tail spend sourcing',
        url: 'https://app.fairmarkit.com',
        icon: '⚡',
        color: '#7c3aed',
        bg: '#faf5ff',
        category: 'Sourcing',
        group: 'Apps',
        sortOrder: 2,
        openInNewTab: true,
    },
    {
        id: 'icertis',
        name: 'iCertis',
        description: 'Contract lifecycle management',
        url: 'https://diageo.icertis.com',
        icon: '📄',
        color: '#2563eb',
        bg: '#eff6ff',
        category: 'Contracting',
        group: 'Apps',
        sortOrder: 3,
        openInNewTab: true,
    },
    {
        id: 'onetrust',
        name: 'OneTrust',
        description: 'Compliance & privacy management',
        url: 'https://diageo.onetrust.com',
        icon: '🛡️',
        color: '#059669',
        bg: '#f0fdf4',
        category: 'Compliance',
        group: 'Apps',
        sortOrder: 4,
        openInNewTab: true,
    },
    {
        id: 'sedex',
        name: 'Sedex',
        description: 'Supplier ethical trade data',
        url: 'https://www.sedex.com',
        icon: '🤝',
        color: '#0891b2',
        bg: '#ecfeff',
        category: 'Sustainability',
        group: 'Apps',
        sortOrder: 5,
        openInNewTab: true,
    },
    {
        id: 'sievo',
        name: 'Sievo',
        description: 'Procurement analytics & savings',
        url: 'https://app.sievo.com',
        icon: '📊',
        color: '#d97706',
        bg: '#fffbeb',
        category: 'Analytics',
        group: 'Reports',
        sortOrder: 6,
        openInNewTab: true,
    },
    {
        id: 'spm',
        name: 'SPM Workspace',
        description: 'Supplier performance management',
        url: 'https://diageo.my.salesforce-sites.com/procurement',
        icon: '🎯',
        color: '#C80651',
        bg: '#fdf2f6',
        category: 'SPM',
        group: 'Apps',
        sortOrder: 7,
        openInNewTab: true,
    },
    {
        id: 'raise-case',
        name: 'Raise a Request',
        description: 'Get help from the Procurement Hub',
        url: 'https://diageo.my.salesforce-sites.com/procurement/s/create-case',
        icon: '📬',
        color: '#64748b',
        bg: '#f8fafc',
        category: 'Support',
        group: 'Support',
        sortOrder: 8,
        openInNewTab: true,
    },
];
