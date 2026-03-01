'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ChatPanel from '@/components/ChatPanel/ChatPanel';

const NAV = [
    { href: '/', label: 'Home', emoji: '⊡', hoverColor: '#DBA11C' },
    { href: '/playbook', label: 'Playbook', emoji: '◫', hoverColor: '#C80651' },
    { href: '/buying', label: 'Buying', emoji: '🛒', hoverColor: '#10B981' },
    { href: '/learning', label: 'Learning', emoji: '🎓', hoverColor: '#3B82F6' },
    { href: '/ideas', label: 'Ideas', emoji: '💡', hoverColor: '#EAB308' },
    { href: '/faq', label: 'Help & FAQ', emoji: '?', hoverColor: '#9333EA' },
    { href: '/templates', label: 'Templates', emoji: '☐', hoverColor: '#F97316' },
];

const BOOKMARKS = [
    { id: 'b1', label: 'Sourcing Step 1/2', href: '/process/sourcing-step-1-2' },
    { id: 'b2', label: 'Competition & Antitrust', href: '/process/competition-antitrust' },
    { id: 'b3', label: 'Category Strategy', href: '/process/category-strategy' },
];

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [chatOpen, setChatOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleOpenChat = () => setChatOpen(true);
        window.addEventListener('open-chat', handleOpenChat);
        return () => window.removeEventListener('open-chat', handleOpenChat);
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <style>{`
                @keyframes ai-pulse {
                    0%, 100% { border-color: #333; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
                    50% { border-color: #C80651; box-shadow: 0 0 16px rgba(200,6,81,0.4), inset 0 0 8px rgba(200,6,81,0.2); }
                }
                @keyframes ai-spin {
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            {/* Mobile Nav Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* ── Sidebar ─── */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{
                    width: '260px', flexShrink: 0,
                    display: 'flex', flexDirection: 'column',
                    background: 'var(--sidebar-bg)',
                    borderRight: '1px solid var(--sidebar-border)',
                    height: '100%', overflowY: 'auto', overflowX: 'hidden',
                }}>
                {/* Top Spacer */}
                <div style={{ padding: '32px 0 16px' }} />

                {/* Nav items */}
                <nav style={{ padding: '4px 10px', flex: 0 }}>
                    {NAV.map(({ href, label, emoji, hoverColor }) => {
                        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
                        return (
                            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 12px', borderRadius: '10px',
                                marginBottom: '2px',
                                fontSize: '13.5px', fontWeight: active ? 600 : 500,
                                color: active ? '#fff' : '#a3a3a3',
                                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                                position: 'relative',
                            }}
                                onMouseEnter={e => {
                                    if (!active) e.currentTarget.style.color = '#ffffff';
                                    const icon = e.currentTarget.querySelector('.nav-icon') as HTMLElement;
                                    if (icon) icon.style.color = hoverColor;
                                }}
                                onMouseLeave={e => {
                                    if (!active) e.currentTarget.style.color = '#a3a3a3';
                                    const icon = e.currentTarget.querySelector('.nav-icon') as HTMLElement;
                                    if (icon) icon.style.color = active ? hoverColor : 'inherit';
                                }}>
                                {active && (
                                    <span style={{
                                        position: 'absolute', left: 0, top: '25%', bottom: '25%',
                                        width: '3px', borderRadius: '2px', background: hoverColor,
                                    }} />
                                )}
                                <span className="nav-icon" style={{
                                    fontSize: '15px',
                                    transition: 'color 0.15s ease',
                                    color: active ? hoverColor : 'inherit',
                                }}>{emoji}</span>
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div style={{ margin: '12px 20px', height: '1px', background: 'var(--sidebar-border)' }} />

                {/* Pinned Items */}
                <div style={{ padding: '0 20px', flex: 0 }}>
                    <p style={{
                        fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px',
                    }}>Pinned items</p>
                    {BOOKMARKS.map(b => (
                        <Link key={b.id} href={b.href} onClick={() => setMobileMenuOpen(false)} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '6px 0', fontSize: '13px', color: '#888888',
                            textDecoration: 'none', transition: 'color 0.15s ease', fontWeight: 500,
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#888888')}>
                            <span style={{ fontSize: '12px', opacity: 0.7 }}>📌</span>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.label}</span>
                        </Link>
                    ))}
                    <div style={{ height: '12px' }} />
                    <a href="https://diageo.my.salesforce-sites.com/procurement/s/create-case"
                        target="_blank" rel="noopener noreferrer" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '8px 12px', fontSize: '12.5px', color: '#888888',
                            textDecoration: 'none', background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
                            transition: 'all 0.15s ease', fontWeight: 500, border: '1px solid rgba(255,255,255,0.05)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#888888'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                        <span>Raise a Help Request</span>
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
                        animation: 'ai-pulse 3s infinite',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.animation = 'none'; e.currentTarget.style.borderColor = '#C80651'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.animation = 'ai-pulse 3s infinite'; }}>
                        <span style={{ fontSize: '14px', display: 'inline-block', animation: 'ai-spin 8s linear infinite' }}>✦</span>
                        Ask Playbook AI
                    </button>
                    <p style={{ textAlign: 'center', color: '#2a2838', fontSize: '10px', marginTop: '8px' }}>
                        Powered by your content
                    </p>
                </div>
            </aside>

            {/* ── Right Content Area (Header + Main) ─── */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
                background: 'url("/LiquidMagicPurple05_1_13.png") center top / cover no-repeat fixed',
                backgroundColor: 'var(--bg)',
                position: 'relative',
            }}>
                {/* Viewport Vignette (Fixed Edge Glow) - Adds immersive depth */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    pointerEvents: 'none', zIndex: 10,
                    boxShadow: 'inset 0 0 200px rgba(15, 0, 30, 0.65)',
                }} />
                {/* GLOBAL TOP BANNER (Black) */}
                <header style={{
                    background: '#0a0a0a',
                    padding: '16px 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    position: 'relative',
                    flexShrink: 0,
                    zIndex: 30, // Lower than mobile menu overlay
                }}>
                    {/* Mobile Hamburger Button */}
                    <button className="md:hidden mr-4 text-white" onClick={() => setMobileMenuOpen(true)}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Wordmark Center */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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

                {/* ── Main content ─── */}
                <main style={{ flex: 1, overflow: 'auto' }}>
                    {children}
                </main>
            </div>

            <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}
