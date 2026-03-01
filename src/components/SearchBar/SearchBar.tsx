'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SearchBarProps {
    width?: string;
    placeholder?: string;
    style?: React.CSSProperties;
}

export default function SearchBar({ width = '100%', maxWidth = '540px', placeholder = 'Search processes, policies, templates…', style }: SearchBarProps & { maxWidth?: string }) {
    const router = useRouter();
    const [term, setTerm] = useState('');
    const [focused, setFocused] = useState(false);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (term.trim()) router.push(`/search?q=${encodeURIComponent(term.trim())}`);
    }

    return (
        <form onSubmit={handleSearch} className="fade-up" style={{
            display: 'flex', gap: '8px', width, maxWidth,
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${focused ? 'var(--brand)' : 'var(--border-strong)'}`,
            borderRadius: '16px',
            padding: '6px',
            boxShadow: focused
                ? '0 8px 32px rgba(200,6,81,0.12), 0 0 0 4px rgba(200,6,81,0.05)'
                : '0 8px 24px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)',
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transform: focused ? 'translateY(-2px)' : 'none',
            ...style
        }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '0 14px' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                    style={{ color: focused ? 'var(--brand)' : 'var(--text-4)', flexShrink: 0, transition: 'color 0.2s' }}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" value={term} onChange={e => setTerm(e.target.value)}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        fontSize: '15px', color: 'var(--text-1)', padding: '12px 0',
                        fontWeight: 500,
                    }} />

                {!term && !focused && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '4px 6px', borderRadius: '6px', background: 'var(--surface-1)',
                        border: '1px solid var(--border)', fontSize: '10px', fontWeight: 600, color: 'var(--text-4)'
                    }}>
                        <span style={{ fontSize: '12px' }}>⌘</span> K
                    </div>
                )}
                {term && (
                    <button type="button" onClick={() => setTerm('')}
                        style={{
                            width: '24px', height: '24px', borderRadius: '12px', background: 'var(--surface-1)',
                            border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        ×
                    </button>
                )}
            </div>
            <button type="submit" style={{
                padding: '0 24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: term ? 'var(--brand)' : 'var(--text-1)', color: '#fff', fontSize: '14px', fontWeight: 700,
                letterSpacing: '-0.01em',
                transition: 'all 0.2s ease',
            }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.opacity = '1'; }}>
                Search
            </button>
        </form>
    );
}
