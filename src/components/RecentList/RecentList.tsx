import Link from 'next/link';
import { Process } from '@/lib/types';

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
    'sourcing-step-1-2': '12 min',
    'contract-management': '8 min',
    'spm-jbp': '10 min',
    'p2p': '6 min',
    'category-strategy': '15 min',
    'risk-vcrm': '9 min',
    'competition-antitrust': '11 min',
    'systems-tools': '5 min',
};

export default function RecentList({ items }: { items: Process[] }) {
    if (!items.length) return null;
    return (
        <div className="flex flex-col gap-1.5">
            {items.map(p => {
                const complexity = COMPLEXITY[p.id];
                const readTime = READ_TIME[p.id] ?? '7 min';
                const blockColor = BLOCK_COLORS[p.block] ?? '#64748b';

                return (
                    <Link key={p.id} href={`/process/${p.id}`}
                        className="group relative flex items-center justify-between py-3 px-4 -mx-4 rounded-xl hover:bg-slate-50/80 hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-200 border-b border-transparent hover:border-slate-100"
                    >
                        {/* Main Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0 pr-6">
                            {/* Accent Dot */}
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: blockColor }} />

                            {/* Text Container */}
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-[15px] font-bold text-slate-900 truncate group-hover:text-[color:var(--brand)] transition-colors">
                                        {p.title}
                                    </h3>
                                    {p.status === 'Draft' && (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 tracking-wide shrink-0">
                                            DRAFT
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold tracking-widest uppercase shrink-0" style={{ color: blockColor }}>
                                        {p.block} {complexity && `· ${complexity.label}`}
                                    </span>
                                    <span className="text-slate-300 shrink-0">•</span>
                                    <span className="text-[13px] text-slate-500 truncate">
                                        {p.summary}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Meta Data on the Right */}
                        <div className="flex items-center gap-6 shrink-0 text-[13px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1.5 w-[70px]">
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                {readTime}
                            </span>
                            {p.lastModified && (
                                <span className="w-[80px] text-right flex items-center justify-end gap-1.5">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    {new Date(p.lastModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                </span>
                            )}
                            <span className="text-[16px] text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0">
                                →
                            </span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
