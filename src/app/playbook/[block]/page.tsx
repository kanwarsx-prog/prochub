import { getProcesses } from '@/lib/graph';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper/PageWrapper';
import SearchBar from '@/components/SearchBar/SearchBar';
import ChatTriggerButton from '@/components/ChatTriggerButton/ChatTriggerButton';

export const revalidate = 900;

const FRAMEWORK_META: Record<string, { title: string; summary: string; icon: string; color: string }> = {
    'planning': { title: 'Planning', summary: 'Category strategy, segmentation, AOP alignment', icon: '📐', color: '#2563eb' },
    'execution': { title: 'Execution', summary: 'Sourcing, contracting, SPM & JBP, P2P', icon: '⚙️', color: '#059669' },
    'risk-gov': { title: 'Risk & Gov', summary: 'Risk, VCRM, competition, data & cyber', icon: '🛡️', color: '#d97706' },
    'enablers': { title: 'Enablers', summary: 'Policies, RASCI, systems, templates', icon: '🔧', color: '#7c3aed' },
};

export async function generateStaticParams() {
    return Object.keys(FRAMEWORK_META).map(block => ({ block }));
}

export default async function BlockPage({ params }: { params: Promise<{ block: string }> }) {
    const { block } = await params;

    const meta = FRAMEWORK_META[block];
    if (!meta) return notFound();

    const allProcesses = await getProcesses();
    const blockProcesses = allProcesses.filter(p => p.block === meta.title);

    return (
        <div>
            {/* Header Area */}
            <div style={{
                background: `linear-gradient(135deg, ${meta.color}0d, ${meta.color}03)`,
                borderBottom: `1px solid ${meta.color}22`,
                paddingTop: '32px', paddingBottom: '32px'
            }}>
                <PageWrapper wide>
                    {/* Breadcrumbs */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-3)', marginBottom: '24px' }}>
                        <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</Link>
                        <span>/</span>
                        <Link href="/playbook" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Playbook</Link>
                        <span>/</span>
                        <span style={{ color: meta.color, fontWeight: 600 }}>{meta.title}</span>
                    </nav>

                    {/* Block Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '16px', flexShrink: 0,
                                background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}0d)`,
                                border: `1px solid ${meta.color}33`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
                            }}>
                                {meta.icon}
                            </div>
                            <div>
                                <h1 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-1)', lineHeight: 1.1, marginBottom: '6px' }}>
                                    {meta.title}
                                </h1>
                                <p style={{ fontSize: '16px', color: 'var(--text-3)', maxWidth: '600px', lineHeight: 1.5 }}>
                                    {meta.summary}
                                </p>
                            </div>
                        </div>

                        {/* Search & Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <SearchBar width="100%" maxWidth="420px" />
                            <ChatTriggerButton />
                        </div>
                    </div>
                </PageWrapper>
            </div>

            {/* Process Grid (Layer 2) */}
            <PageWrapper wide>
                <div style={{ marginTop: '40px', marginBottom: '60px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-4)' }}>
                            {blockProcesses.length} Assigned Processes
                        </h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px'
                    }}>
                        {blockProcesses.map(process => (
                            <Link key={process.id} href={`/process/${process.id}`} style={{
                                background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px',
                                padding: '24px', display: 'flex', flexDirection: 'column',
                                textDecoration: 'none', transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            }} className="process-card">
                                <style>{`
                                    .process-card:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02); border-color: ${meta.color}44; }
                                    .process-card:hover .process-arrow { transform: translateX(4px); color: ${meta.color}; }
                                `}</style>

                                {/* Process Section marker */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <span style={{
                                        width: '8px', height: '8px', borderRadius: '50%', background: meta.color,
                                    }} />
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        {process.section}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '8px', lineHeight: 1.3 }}>
                                    {process.title}
                                </h3>

                                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
                                    {process.summary.length > 100 ? process.summary.substring(0, 100) + '...' : process.summary}
                                </p>

                                {/* Footer info */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-4)' }}>
                                        {process.links?.length ?? 0} resources
                                    </span>
                                    <span className="process-arrow" style={{ fontSize: '16px', color: 'var(--text-4)', transition: 'transform 0.2s, color 0.2s' }}>
                                        →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
}
