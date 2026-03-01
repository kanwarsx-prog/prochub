'use client';
import PageWrapper from '@/components/PageWrapper/PageWrapper';

const PATHWAYS = [
    {
        title: 'Procurement Onboarding',
        description: 'Mandatory training for all new joiners in the Procurement Hub.',
        progress: 100,
        status: 'Completed',
        color: '#6d2891', // brand
        icon: '👋',
    },
    {
        title: 'Negotiation Masterclass',
        description: 'Advanced negotiation strategies, behavioral psychology, and mock scenarios.',
        progress: 45,
        status: 'In Progress',
        color: '#2d9cdb',
        icon: '🤝',
    },
    {
        title: 'Supplier Relationship Management',
        description: 'Frameworks for building long-term strategic capabilities with key supplier partners.',
        progress: 0,
        status: 'Not Started',
        color: '#f2994a',
        icon: '📈',
    },
    {
        title: 'Sustainable Sourcing Basics',
        description: 'Introduction to Scope 3 emissions, supplier diversity, and ethical trade data.',
        progress: 0,
        status: 'Not Started',
        color: '#27ae60',
        icon: '🌱',
    }
];

export default function LearningPage() {
    return (
        <PageWrapper>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: '8px' }}>
                    Learning &amp; Development
                </h1>
                <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.5, maxWidth: '640px' }}>
                    Upskill your capabilities, complete mandatory compliance training, and explore advanced procurement pathways.
                </p>
            </div>

            <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-4)' }}>
                        My Pathways
                    </h2>
                    <button style={{
                        background: 'none', border: 'none', color: 'var(--brand)', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}>
                        Browse catalog →
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '20px',
                }}>
                    {PATHWAYS.map(path => (
                        <div key={path.title} style={{
                            background: '#ffffff',
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderRadius: '16px',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                            cursor: 'pointer',
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = `0 12px 28px ${path.color}15, 0 4px 16px rgba(0,0,0,0.04)`;
                                e.currentTarget.style.borderColor = `${path.color}33`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                            }}>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '14px',
                                    background: `linear-gradient(135deg, ${path.color}15, transparent)`,
                                    border: `1px solid ${path.color}22`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '26px', flexShrink: 0,
                                }}>
                                    {path.icon}
                                </div>
                                <div style={{ paddingTop: '2px' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-1)', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: '6px' }}>
                                        {path.title}
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.45 }}>
                                        {path.description}
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        {path.status}
                                    </span>
                                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>
                                        {path.progress}%
                                    </span>
                                </div>
                                {/* Progress bar track */}
                                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--surface-1)', overflow: 'hidden' }}>
                                    {/* Progress bar fill */}
                                    <div style={{
                                        width: `${path.progress}%`, height: '100%',
                                        background: `linear-gradient(90deg, ${path.color}, ${path.color}cc)`,
                                        borderRadius: '4px',
                                        transition: 'width 1s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                    }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </PageWrapper>
    );
}
