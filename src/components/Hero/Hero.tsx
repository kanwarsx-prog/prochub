'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar/SearchBar';

const QUICK_PATHS = [
    { label: 'Run a sourcing event', href: '/process/sourcing-step-1-2' },
    { label: 'Set up a contract', href: '/process/contract-management' },
    { label: 'Manage a supplier', href: '/process/spm-jbp' },
    { label: 'Raise a PO', href: '/process/p2p' },
];

function getGreeting() {
    const h = new Date().getHours();
    const name = "Alex"; // Placeholder for logged-in user
    if (h < 12) return `Good morning, ${name}.`;
    if (h < 17) return `Good afternoon, ${name}.`;
    return `Good evening, ${name}.`;
}

export default function Hero() {
    const router = useRouter();
    const [greeting, setGreeting] = useState('Good morning.');

    useEffect(() => { setGreeting(getGreeting()); }, []);

    return (
        <div style={{ position: 'relative' }}>
            {/* LIGHT SECTION (White/Transparent over Wave) */}
            <div style={{
                position: 'relative', zIndex: 1, width: '100%', padding: '48px 48px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
                /* Removed black background so it appears light/transparent, or we can make it explicitly white if it's not transparent enough */
                background: 'rgba(255,255,255,0.75)', /* Ensures text is readable over the wave or plain background */
                WebkitBackdropFilter: 'blur(20px)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border)',
            }}>
                {/* Headline - Now Dark Text */}
                <h1 className="fade-up" style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-1)',
                    marginBottom: '8px',
                    textShadow: '0 4px 24px rgba(255,255,255,0.8)',
                }}>
                    {greeting.replace('.', '')}<span style={{ color: 'var(--brand)' }}>.</span>
                </h1>

                <p className="fade-up" style={{
                    fontSize: '15px', lineHeight: 1.5, color: 'var(--text-3)',
                    marginBottom: '28px',
                    animationDelay: '0.08s', opacity: 0,
                }}>
                    Processes, tools and AI-powered guidance in one place.
                </p>

                <SearchBar style={{ marginBottom: '20px', animationDelay: '0.14s', opacity: 0 }} />

                {/* Quick paths */}
                <div className="fade-up" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px', animationDelay: '0.20s', opacity: 0 }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-4)', fontWeight: 500, marginRight: '4px' }}>I need to</span>
                    {QUICK_PATHS.map(p => (
                        <button key={p.href} onClick={() => router.push(p.href)} style={{
                            padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border)',
                            background: 'rgba(255,255,255,0.6)', color: 'var(--text-2)', fontSize: '12px',
                            fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease',
                            backdropFilter: 'blur(8px)',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.background = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; }}>
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

