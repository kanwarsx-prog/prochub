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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(p => {
                const complexity = COMPLEXITY[p.id];
                const readTime = READ_TIME[p.id] ?? '7 min';
                const blockColor = BLOCK_COLORS[p.block] ?? '#64748b';

                return (
                    <Link key={p.id} href={`/process/${p.id}`}
                        className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden card-hover flex flex-col">

                        {/* Colour strip at top */}
                        <div className="h-1" style={{ background: `linear-gradient(90deg, ${blockColor}, ${blockColor}66)` }} />

                        <div className="p-5 flex flex-col flex-1">
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white"
                                    style={{ background: blockColor }}>
                                    {p.block}
                                </span>
                                {complexity && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                        style={{ background: complexity.color + '18', color: complexity.color }}>
                                        {complexity.label}
                                    </span>
                                )}
                                {p.status === 'Draft' && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 ml-auto">
                                        Draft
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <p className="font-bold text-sm text-slate-900 mb-1.5 group-hover:text-[color:var(--brand)] transition-colors leading-snug">
                                {p.title}
                            </p>

                            {/* Summary */}
                            <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                                {p.summary}
                            </p>

                            {/* Footer meta */}
                            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                                <span className="flex items-center gap-1">
                                    <span>⏱</span> {readTime} read
                                </span>
                                {p.lastModified && (
                                    <span>
                                        {new Date(p.lastModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
