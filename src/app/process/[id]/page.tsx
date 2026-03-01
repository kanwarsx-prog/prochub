import { getProcess, getProcesses } from '@/lib/graph';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper/PageWrapper';

export const revalidate = 900;

const BLOCK_COLORS: Record<string, string> = {
    'Planning': '#2563eb',
    'Execution': '#059669',
    'Risk & Gov': '#d97706',
    'Enablers': '#7c3aed',
};

const COMPLEXITY: Record<string, { label: string; color: string }> = {
    'sourcing-step-1-2': { label: 'Advanced', color: '#ef4444' },
    'contract-management': { label: 'Intermediate', color: '#f59e0b' },
    'spm-jbp': { label: 'Intermediate', color: '#f59e0b' },
    'p2p': { label: 'Beginner', color: '#10b981' },
    'category-strategy': { label: 'Advanced', color: '#ef4444' },
    'risk-vcrm': { label: 'Intermediate', color: '#f59e0b' },
    'competition-antitrust': { label: 'Advanced', color: '#ef4444' },
    'systems-tools': { label: 'Beginner', color: '#10b981' },
};

const READ_TIME: Record<string, string> = {
    'sourcing-step-1-2': '12 min', 'contract-management': '8 min',
    'spm-jbp': '10 min', 'p2p': '6 min', 'category-strategy': '15 min',
    'risk-vcrm': '9 min', 'competition-antitrust': '11 min', 'systems-tools': '5 min',
};

const BLOCK_ICON: Record<string, string> = {
    'Planning': '📐', 'Execution': '⚙️', 'Risk & Gov': '🛡️', 'Enablers': '🔧',
};

export async function generateStaticParams() {
    const processes = await getProcesses();
    return processes.map(p => ({ id: p.id }));
}

export default async function ProcessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const process = await getProcess(id);
    if (!process) return notFound();

    const all = await getProcesses();
    const relatedProcesses = all.filter(p => process.related.includes(p.id));
    const blockColor = BLOCK_COLORS[process.block] ?? '#64748b';
    const complexity = COMPLEXITY[id];
    const readTime = READ_TIME[id] ?? '7 min';

    return (
        <div>
            {/* Page header band */}
            <div style={{
                background: `linear-gradient(135deg, ${blockColor}0d, ${blockColor}06)`,
                borderBottom: `1px solid ${blockColor}33`,
            }}>
                <PageWrapper wide>
                    {/* Breadcrumb */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-3)', marginBottom: '20px' }}>
                        <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</Link>
                        <span>/</span>
                        <Link href="/playbook" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Playbook</Link>
                        <span>/</span>
                        <Link href={`/playbook/${process.block.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`} style={{ color: 'var(--text-3)', textDecoration: 'none' }}>
                            {process.block}
                        </Link>
                        <span>/</span>
                        <span style={{ color: blockColor, fontWeight: 600 }}>{process.title}</span>
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
                        <div style={{ flex: 1 }}>
                            {/* Badges */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', background: blockColor, color: '#fff', letterSpacing: '0.02em' }}>
                                    {process.block}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>›</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: 500 }}>{process.section}</span>
                                {complexity && (
                                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px', background: complexity.color + '18', color: complexity.color }}>
                                        {complexity.label}
                                    </span>
                                )}
                            </div>

                            <h1 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: '10px', lineHeight: 1.1 }}>
                                {process.title}
                            </h1>
                            <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6, maxWidth: '560px', marginBottom: '16px' }}>
                                {process.summary}
                            </p>

                            {/* Meta strip */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-3)' }}>
                                <span>⏱ {readTime} read</span>
                                <span style={{ width: '1px', height: '12px', background: 'var(--border)' }} />
                                <span>📎 {process.links.length} resources</span>
                                {process.lastModified && (
                                    <>
                                        <span style={{ width: '1px', height: '12px', background: 'var(--border)' }} />
                                        <span>Updated {new Date(process.lastModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Domain icon */}
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '20px', flexShrink: 0,
                            background: `linear-gradient(135deg, ${blockColor}22, ${blockColor}0d)`,
                            border: `1px solid ${blockColor}33`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
                        }}>
                            {BLOCK_ICON[process.block] ?? '📄'}
                        </div>
                    </div>
                </PageWrapper>
            </div>

            {/* Content */}
            <PageWrapper wide>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '28px', alignItems: 'start' }}>

                    {/* Main column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Steps */}
                        {process.steps && process.steps.length > 0 && (
                            <div style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <h2 style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ width: '3px', height: '16px', borderRadius: '2px', background: blockColor, display: 'inline-block' }} />
                                        Process steps
                                    </h2>
                                    <span style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: 500 }}>{process.steps.length} steps</span>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    {/* Connector line */}
                                    <div style={{
                                        position: 'absolute', left: '14px', top: '20px', bottom: '20px', width: '1px',
                                        background: `linear-gradient(to bottom, ${blockColor}44, transparent)`,
                                    }} />
                                    <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {process.steps.map(step => (
                                            <li key={step.order} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                                {/* Step number — small, refined */}
                                                <div style={{
                                                    width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                                                    border: `1.5px solid ${blockColor}44`,
                                                    background: `${blockColor}0d`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '11px', fontWeight: 800, color: blockColor,
                                                    position: 'relative', zIndex: 1,
                                                }}>
                                                    {step.order}
                                                </div>
                                                <div style={{ flex: 1, paddingTop: '4px' }}>
                                                    <p style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-1)', marginBottom: '3px' }}>{step.title}</p>
                                                    <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6 }}>{step.summary}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        )}

                        {/* Article body */}
                        {process.articleBody && (
                            <div style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                                <h2 style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                    <span style={{ width: '3px', height: '16px', borderRadius: '2px', background: blockColor, display: 'inline-block' }} />
                                    Detailed guidance
                                </h2>
                                <div className="article-body" style={{ fontSize: '14px' }}
                                    dangerouslySetInnerHTML={{ __html: process.articleBody }} />
                            </div>
                        )}
                    </div>

                    {/* Right sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>

                        {/* Resources */}
                        {process.links.length > 0 && (
                            <div style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-1)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>📎</span> Resources
                                </h3>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {process.links.map((link, i) => (
                                        <li key={i}>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                fontSize: '13px', color: blockColor, fontWeight: 500, textDecoration: 'none',
                                            }}>
                                                <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: blockColor + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>↗</span>
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Related processes */}
                        {relatedProcesses.length > 0 && (
                            <div style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-1)', marginBottom: '14px' }}>Related processes</h3>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {relatedProcesses.map(p => (
                                        <li key={p.id}>
                                            <Link href={`/process/${p.id}`} style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                fontSize: '13px', color: 'var(--text-2)', fontWeight: 500, textDecoration: 'none',
                                                padding: '6px 8px', borderRadius: '8px', margin: '0 -8px',
                                            }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: BLOCK_COLORS[p.block] ?? '#64748b', flexShrink: 0 }} />
                                                <span>{p.title}</span>
                                                <span style={{ marginLeft: 'auto', color: 'var(--text-4)', fontSize: '11px' }}>→</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Meta */}
                        <div style={{
                            borderRadius: '16px', padding: '16px 20px',
                            background: `linear-gradient(135deg, ${blockColor}08, ${blockColor}04)`,
                            border: `1px solid ${blockColor}22`,
                            display: 'flex', flexDirection: 'column', gap: '10px',
                        }}>
                            {[
                                { label: 'Domain', value: process.domain, color: 'var(--text-1)' },
                                { label: 'Complexity', value: complexity?.label ?? 'Standard', color: complexity?.color ?? 'var(--text-1)' },
                                { label: 'Read time', value: readTime, color: 'var(--text-1)' },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <span style={{ color: 'var(--text-3)' }}>{row.label}</span>
                                    <span style={{ fontWeight: 700, color: row.color }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
}
