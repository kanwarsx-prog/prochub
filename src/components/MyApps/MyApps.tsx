'use client';
import { useState, useEffect, useCallback } from 'react';
import { HubTool } from '@/lib/types';

const STORAGE_KEY = 'ph_pinned_apps';

// ─── App Tile ─────────────────────────────────────────────────────────────────
function AppTile({ tool, index }: { tool: HubTool; index: number }) {
    return (
        <a
            href={tool.url}
            target={tool.openInNewTab ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="app-tile"
            style={{
                animationDelay: `${index * 0.05}s`,
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            }}
            onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-3px)';
                el.style.boxShadow = `0 12px 28px ${tool.color}15, 0 4px 12px rgba(0,0,0,0.04)`;
                el.style.borderColor = `${tool.color}33`;
                const bar = el.querySelector('.tile-accent-bar') as HTMLElement;
                if (bar) bar.style.transform = 'scaleX(1)';
            }}
            onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                el.style.borderColor = 'rgba(0,0,0,0.06)';
                const bar = el.querySelector('.tile-accent-bar') as HTMLElement;
                if (bar) bar.style.transform = 'scaleX(0)';
            }}
        >
            {/* Minimal icon zone */}
            <div style={{
                padding: '24px 20px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>
                <div style={{
                    width: '44px', height: '44px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${tool.bg}, #ffffff)`,
                    border: `1px solid ${tool.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px',
                    boxShadow: `0 4px 12px ${tool.color}15, inset 0 2px 4px rgba(255,255,255,0.5)`,
                }}>
                    {tool.icon}
                </div>
            </div>

            {/* Label zone */}
            <div style={{ padding: '0px 20px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{
                    fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em',
                    color: 'var(--text-1)', lineHeight: 1.2, marginBottom: '6px',
                }}>
                    {tool.name}
                </p>
                <p style={{
                    fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.4,
                    flex: 1,
                }}>
                    {tool.description}
                </p>
                <div style={{
                    marginTop: '16px',
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: tool.color, opacity: 0.9,
                }}>
                    {tool.category}
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                        style={{ marginLeft: '2px', opacity: 0.6 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5M13.5 6l7.5 7.5M13.5 6H21v7.5" />
                    </svg>
                </div>
            </div>

            {/* Hover accent bar */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
                background: `linear-gradient(90deg, ${tool.color}, ${tool.color}aa)`,
                transformOrigin: 'left',
                transform: 'scaleX(0)',
                transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }} className="tile-accent-bar" />
        </a>
    );
}

// ─── App Picker ───────────────────────────────────────────────────────────────
function AppPicker({
    allTools, pinned, onSave, onClose,
}: {
    allTools: HubTool[];
    pinned: Set<string>;
    onSave: (ids: Set<string>) => void;
    onClose: () => void;
}) {
    const [selected, setSelected] = useState(new Set(pinned));

    function toggle(id: string) {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    const groups = allTools.reduce<Record<string, HubTool[]>>((acc, t) => {
        (acc[t.group] ??= []).push(t);
        return acc;
    }, {});

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
            background: 'rgba(13,12,18,0.5)', backdropFilter: 'blur(8px)',
        }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

            <div style={{
                width: '100%', maxWidth: '480px',
                background: 'var(--surface-0)',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                boxShadow: '0 24px 80px rgba(13,12,18,0.2)',
                overflow: 'hidden',
                animation: 'fadeUp 0.2s ease',
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px 24px 20px',
                    borderBottom: '1px solid var(--border)',
                    background: 'linear-gradient(135deg, rgba(200,6,81,0.03) 0%, transparent 60%)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <h2 style={{ fontWeight: 800, fontSize: '17px', letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
                                Customise My Apps
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>
                                Choose which tools appear on your home page.
                            </p>
                        </div>
                        <button onClick={onClose} style={{
                            width: '30px', height: '30px', borderRadius: '8px', border: '1px solid var(--border)',
                            background: 'var(--surface-1)', cursor: 'pointer', fontSize: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)',
                        }}>×</button>
                    </div>
                </div>

                {/* List */}
                <div style={{ padding: '16px 20px', maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {['Apps', 'Reports', 'Support'].filter(g => groups[g]).map(group => (
                        <div key={group}>
                            <p style={{
                                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                                color: 'var(--text-4)', marginBottom: '8px',
                            }}>{group}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {groups[group].map(tool => {
                                    const on = selected.has(tool.id);
                                    return (
                                        <button key={tool.id} onClick={() => toggle(tool.id)} style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                                            border: `1.5px solid ${on ? tool.color + '44' : 'var(--border)'}`,
                                            background: on ? tool.bg : 'var(--surface-1)',
                                            transition: 'all 0.15s ease',
                                        }}>
                                            <div style={{
                                                width: '34px', height: '34px', borderRadius: '10px',
                                                background: tool.bg, display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                                            }}>{tool.icon}</div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-1)' }}>{tool.name}</p>
                                                <p style={{ fontSize: '11px', color: 'var(--text-3)' }}>{tool.description}</p>
                                            </div>
                                            {/* Toggle */}
                                            <div style={{
                                                width: '38px', height: '22px', borderRadius: '11px', flexShrink: 0,
                                                background: on ? tool.color : 'var(--border)',
                                                display: 'flex', alignItems: 'center', padding: '2px',
                                                transition: 'background 0.2s ease',
                                            }}>
                                                <div style={{
                                                    width: '18px', height: '18px', borderRadius: '9px', background: '#fff',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                    transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
                                                    transform: on ? 'translateX(16px)' : 'translateX(0)',
                                                }} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px', borderTop: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                }}>
                    <button onClick={() => setSelected(new Set(allTools.map(t => t.id)))} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '12px', fontWeight: 500, color: 'var(--text-3)',
                    }}>Select all</button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={onClose} style={{
                            padding: '9px 18px', borderRadius: '10px',
                            border: '1.5px solid var(--border)', background: 'var(--surface-1)',
                            fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer',
                        }}>Cancel</button>
                        <button onClick={() => { onSave(selected); onClose(); }} style={{
                            padding: '9px 20px', borderRadius: '10px', border: 'none',
                            background: 'var(--brand)', color: '#fff', fontSize: '13px',
                            fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 2px 12px rgba(200,6,81,0.3)',
                        }}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── MyApps — main export ─────────────────────────────────────────────────────
export default function MyApps({ allTools }: { allTools: HubTool[] }) {
    const defaultPinned = allTools.slice(0, 6).map(t => t.id);
    const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set(defaultPinned));
    const [pickerOpen, setPickerOpen] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setPinnedIds(new Set(JSON.parse(raw)));
        } catch { /* ignore */ }
        setReady(true);
    }, []);

    const savePinned = useCallback((ids: Set<string>) => {
        setPinnedIds(ids);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids])); } catch { /* ignore */ }
    }, []);

    const visible = allTools.filter(t => pinnedIds.has(t.id));

    return (
        <div>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
                <h2 style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--text-4)',
                }}>My Apps &amp; Reports</h2>
                <button onClick={() => setPickerOpen(true)} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 14px', borderRadius: '20px',
                    border: '1.5px solid var(--border)', background: 'var(--surface-0)',
                    fontSize: '12px', fontWeight: 600, color: 'var(--text-2)',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
                    <span style={{ fontSize: '14px', lineHeight: 1 }}>⊕</span> Customise
                </button>
            </div>

            {/* Tiles */}
            {!ready ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 190px))', gap: '12px', justifyContent: 'center' }}>
                    {defaultPinned.map(id => (
                        <div key={id} className="shimmer" style={{ height: '160px', borderRadius: '18px' }} />
                    ))}
                </div>
            ) : visible.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '60px 24px', borderRadius: '20px',
                    border: '2px dashed var(--border)', background: 'var(--surface-1)',
                }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-2)', marginBottom: '6px' }}>No apps pinned</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '20px' }}>Add apps to your home page.</p>
                    <button onClick={() => setPickerOpen(true)} style={{
                        padding: '10px 20px', borderRadius: '10px', border: 'none',
                        background: 'var(--brand)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                    }}>Customise My Apps</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 190px))', gap: '12px', justifyContent: 'center' }}>
                    {visible.map((tool, i) => <AppTile key={tool.id} tool={tool} index={i} />)}
                    {/* Add tile */}
                    <button onClick={() => setPickerOpen(true)} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', padding: '24px', borderRadius: '18px', border: '2px dashed var(--border)',
                        background: 'transparent', cursor: 'pointer', minHeight: '160px', transition: 'all 0.15s ease',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.background = 'rgba(200,6,81,0.02)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            border: '2px dashed var(--border-strong)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '20px', color: 'var(--text-4)',
                        }}>+</div>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-4)' }}>Add app</span>
                    </button>
                </div>
            )}

            {pickerOpen && (
                <AppPicker allTools={allTools} pinned={pinnedIds} onSave={savePinned} onClose={() => setPickerOpen(false)} />
            )}
        </div>
    );
}
