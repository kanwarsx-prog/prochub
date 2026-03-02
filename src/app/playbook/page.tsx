import FrameworkGrid from '@/components/FrameworkGrid/FrameworkGrid';
import RecentList from '@/components/RecentList/RecentList';
import { getProcesses, getRecentProcesses } from '@/lib/graph';
import { Process } from '@/lib/types';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar/SearchBar';
import ChatTriggerButton from '@/components/ChatTriggerButton/ChatTriggerButton';

export const revalidate = 900;

const FRAMEWORK_META: Record<string, { summary: string; icon: string; color: string }> = {
    'Planning': { summary: 'Category strategy, segmentation, AOP alignment', icon: '📐', color: '#2563eb' },
    'Execution': { summary: 'Sourcing, contracting, SPM & JBP, P2P', icon: '⚙️', color: '#059669' },
    'Risk & Gov': { summary: 'Risk, VCRM, competition, data & cyber', icon: '🛡️', color: '#d97706' },
    'Enablers': { summary: 'Policies, RASCI, systems, templates', icon: '🔧', color: '#7c3aed' },
};

function groupByBlock(processes: Process[]) {
    const order = ['Planning', 'Execution', 'Risk & Gov', 'Enablers'];
    const map: Record<string, { id: string; label: string }[]> = {};
    processes.forEach(p => {
        if (!map[p.block]) map[p.block] = [];
        map[p.block].push({ id: p.id, label: p.title });
    });
    return order.filter(b => map[b]).map(b => ({
        id: b.toLowerCase().replace(/\s+/g, '-').replace(/&/g, ''),
        title: b,
        summary: FRAMEWORK_META[b]?.summary ?? '',
        icon: FRAMEWORK_META[b]?.icon ?? '📄',
        color: FRAMEWORK_META[b]?.color ?? '#64748b',
        links: map[b] ?? [],
    }));
}

export default async function PlaybookPage() {
    const [allProcesses, recent] = await Promise.all([getProcesses(), getRecentProcesses()]);
    const frameworks = groupByBlock(allProcesses);

    return (
        <div style={{ padding: '32px 48px', maxWidth: '960px', margin: '0 auto' }}>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-3)', marginBottom: '20px' }}>
                <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>
                    Home
                </Link>
                <span>/</span>
                <span>Playbook</span>
            </div>

            {/* Page heading */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontSize: '28px', fontWeight: 800, letterSpacing: '-0.025em',
                    color: 'var(--text-1)', marginBottom: '6px', textAlign: 'center',
                }}>
                    Procurement Playbook
                </h1>
                <p style={{
                    fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.5, textAlign: 'center',
                }}>
                    Process guidance by framework area — sourcing, contracting, supplier management, and more.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
                    <SearchBar width="100%" maxWidth="480px" />
                    <ChatTriggerButton />
                </div>
            </div>

            {/* Framework grid */}
            <section style={{ marginBottom: '40px' }}>
                <h2 style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: '16px',
                }}>
                    By framework area
                </h2>
                <FrameworkGrid frameworks={frameworks} />
            </section>

            {/* Recently updated */}
            <section>
                <h2 style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: '16px',
                }}>
                    Recently updated
                </h2>
                <RecentList items={recent} />
            </section>
        </div>
    );
}
