'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ChatPanel from '@/components/ChatPanel/ChatPanel';

const NAV = [
    { href: '/', label: 'Home', emoji: '⊡' },
    { href: '/playbook', label: 'Playbook', emoji: '◫' },
    { href: '/buying', label: 'Buying', emoji: '🛒' },
    { href: '/learning', label: 'Learning', emoji: '🎓' },
    { href: '/ideas', label: 'Ideas', emoji: '💡' },
    { href: '/faq', label: 'Help & FAQ', emoji: '?' },
    { href: '/templates', label: 'Templates', emoji: '☐' },
];

const QUICK_TOOLS = [
    { id: 'coupa', label: 'Coupa', href: 'https://diageo.coupahost.com' },
    { id: 'icertis', label: 'iCertis', href: 'https://diageo.icertis.com' },
    { id: 'fairmarkit', label: 'Fairmarkit', href: 'https://app.fairmarkit.com' },
    { id: 'sievo', label: 'Sievo', href: 'https://app.sievo.com' },
];

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        const handleOpenChat = () => setChatOpen(true);
        window.addEventListener('open-chat', handleOpenChat);
        return () => window.removeEventListener('open-chat', handleOpenChat);
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>

            {/* ── Sidebar ─── */}
            <aside style={{
                width: '220px', flexShrink: 0,
                display: 'flex', flexDirection: 'column',
                background: 'var(--sidebar-bg)',
                borderRight: '1px solid var(--sidebar-border)',
                position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
            }}>

                {/* Brand mark */}
                <div style={{ padding: '24px 20px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '30px', height: '30px', borderRadius: '9px',
                            background: '#ffffff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 10px rgba(255,255,255,0.1)',
                            flexShrink: 0,
                        }}>
                            <span style={{ color: '#000000', fontWeight: 900, fontSize: '13px', letterSpacing: '-0.03em' }}>P</span>
                        </div>
                        <div>
                            <p style={{ color: '#fff', fontWeight: 700, fontSize: '13px', lineHeight: 1.2 }}>Procurement</p>
                            <p style={{ color: '#4a4860', fontSize: '10px', marginTop: '1px' }}>Hub · Diageo</p>
                        </div>
                    </div>
                </div>

                {/* Nav items */}
                <nav style={{ padding: '4px 10px', flex: 0 }}>
                    {NAV.map(({ href, label }) => {
                        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
                        return (
                            <Link key={href} href={href} style={{
                                display: 'flex', alignItems: 'center', gap: '0',
                                padding: '8px 12px', borderRadius: '10px',
                                marginBottom: '2px',
                                fontSize: '13.5px', fontWeight: active ? 600 : 500,
                                color: active ? '#fff' : '#a3a3a3',
                                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                                position: 'relative',
                            }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#ffffff'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#a3a3a3'; }}>
                                {active && (
                                    <span style={{
                                        position: 'absolute', left: 0, top: '25%', bottom: '25%',
                                        width: '3px', borderRadius: '2px', background: '#ffffff',
                                    }} />
                                )}
                                <span style={{ paddingLeft: active ? '8px' : '0', transition: 'padding 0.15s' }}>{label}</span>
                                {active && (
                                    <span style={{
                                        marginLeft: 'auto', width: '6px', height: '6px',
                                        borderRadius: '50%', background: '#ffffff',
                                        boxShadow: '0 0 8px rgba(255,255,255,0.6)',
                                    }} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div style={{ margin: '12px 20px', height: '1px', background: 'var(--sidebar-border)' }} />

                {/* Quick tools */}
                <div style={{ padding: '0 20px', flex: 0 }}>
                    <p style={{
                        fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: '#2e2c3d', marginBottom: '8px',
                    }}>Quick access</p>
                    {QUICK_TOOLS.map(t => (
                        <a key={t.id} href={t.href} target="_blank" rel="noopener noreferrer" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '6px 0', fontSize: '12.5px', color: '#888888',
                            textDecoration: 'none', transition: 'color 0.15s ease', fontWeight: 500,
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#888888')}>
                            <span>{t.label}</span>
                            <span style={{ fontSize: '10px', opacity: 0.6 }}>↗</span>
                        </a>
                    ))}
                    <a href="https://diageo.my.salesforce-sites.com/procurement/s/create-case"
                        target="_blank" rel="noopener noreferrer" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '6px 0', fontSize: '12.5px', color: '#888888',
                            textDecoration: 'none',
                            borderTop: '1px solid var(--sidebar-border)', marginTop: '6px', paddingTop: '10px',
                            transition: 'color 0.15s ease', fontWeight: 500,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#888888')}>
                        <span>Raise a request</span>
                        <span style={{ fontSize: '10px', opacity: 0.6 }}>↗</span>
                    </a>
                </div>

                <div style={{ flex: 1 }} />

                {/* AI button */}
                <div style={{ padding: '16px 14px 20px' }}>
                    <button onClick={() => setChatOpen(true)} style={{
                        width: '100%', padding: '11px 16px', borderRadius: '12px', border: '1px solid #333',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        background: '#1a1a1a',
                        color: '#fff', fontSize: '13px', fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s ease',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.borderColor = '#444'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = '#333'; }}>
                        <span style={{ fontSize: '14px' }}>✦</span>
                        Ask Playbook AI
                    </button>
                    <p style={{ textAlign: 'center', color: '#2a2838', fontSize: '10px', marginTop: '8px' }}>
                        Powered by your content
                    </p>
                </div>
            </aside>

            {/* ── Main content ─── */}
            <main style={{
                flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
                background: 'url("/wave-bg.png") center top / 100% auto no-repeat',
                backgroundColor: 'var(--bg)'
            }}>
                {/* GLOBAL TOP BANNER (Black & White) */}
                <header style={{
                    background: '#0a0a0a',
                    padding: '16px 48px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    flexShrink: 0,
                }}>
                    {/* Wordmark Center */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                            fontWeight: 900, fontSize: '13px', letterSpacing: '0.16em', textTransform: 'uppercase',
                            color: '#ffffff',
                        }}>DIAGEO</span>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px', fontWeight: 200 }}>|</span>
                        <span style={{
                            fontWeight: 500, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.7)',
                        }}>Procurement Hub</span>
                    </div>

                    {/* Profile Button Right */}
                    <button style={{
                        position: 'absolute', right: '48px',
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>
                </header>

                <div style={{ flex: 1, overflow: 'auto' }}>
                    {children}
                </div>
            </main>

            <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}
