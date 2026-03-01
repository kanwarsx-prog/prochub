'use client';
import Link from 'next/link';

interface Framework {
    id: string;
    title: string;
    summary: string;
    icon: string;
    color: string;
    links: { id: string; label: string }[];
}

const BG_GRADIENTS: Record<string, string> = {
    'Planning': 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    'Execution': 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
    'Risk & Gov': 'linear-gradient(135deg, #fffbeb, #fef3c7)',
    'Enablers': 'linear-gradient(135deg, #faf5ff, #ede9fe)',
};

export default function FrameworkGrid({ frameworks }: { frameworks: Framework[] }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
        }}>
            {frameworks.map((fw) => (
                <Link key={fw.id} href={`/playbook/${fw.id}`}
                    style={{
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                        transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 12px 24px ${fw.color}15, 0 4px 12px rgba(0,0,0,0.03)`;
                        e.currentTarget.style.borderColor = `${fw.color}33`;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                    }}
                >
                    {/* Glowing Top Border Accent */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                        background: `linear-gradient(90deg, ${fw.color}, ${fw.color}88)`,
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px',
                    }} />

                    {/* Icon + title */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: 'auto' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                            background: `linear-gradient(135deg, ${fw.color}15, transparent)`,
                            border: `1px solid ${fw.color}22`,
                            color: fw.color
                        }}>
                            {fw.icon}
                        </div>
                        <div style={{ paddingTop: '2px' }}>
                            <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: '4px' }}>
                                {fw.title}
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.4, paddingRight: '8px' }}>
                                {fw.summary}
                            </p>
                        </div>
                    </div>

                    {/* Layer 1 Call To Action */}
                    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                            fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                            padding: '6px 12px', borderRadius: '20px',
                            background: fw.color + '12', color: fw.color,
                        }}>
                            {fw.links.length} process{fw.links.length !== 1 ? 'es' : ''}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)' }}>Explore block →</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
