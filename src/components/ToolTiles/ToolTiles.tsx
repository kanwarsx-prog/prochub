import { HubTool } from '@/lib/types';

interface Props { tools: HubTool[] }

export default function ToolTiles({ tools }: Props) {
    // Group tools by their 'group' field
    const groups = tools.reduce<Record<string, HubTool[]>>((acc, t) => {
        (acc[t.group] ??= []).push(t);
        return acc;
    }, {});

    const groupOrder = ['Apps', 'Reports', 'Support'];
    const sorted = groupOrder.filter(g => groups[g]);

    return (
        <div className="space-y-5">
            {sorted.map(groupName => (
                <div key={groupName}>
                    {sorted.length > 1 && (
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                            {groupName}
                        </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {groups[groupName].map(tool => (
                            <a
                                key={tool.id}
                                href={tool.url}
                                target={tool.openInNewTab ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                className="group flex flex-col gap-2 p-4 rounded-2xl border border-slate-200/80 card-hover bg-white relative overflow-hidden"
                            >
                                {/* Category badge — visible on hover */}
                                <span
                                    className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ background: tool.color + '18', color: tool.color }}
                                >
                                    {tool.category}
                                </span>

                                {/* Icon */}
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                                    style={{ background: tool.bg }}
                                >
                                    {tool.icon}
                                </div>

                                {/* Name + description */}
                                <div>
                                    <p className="font-bold text-sm text-slate-900 group-hover:text-[var(--brand)] transition-colors">
                                        {tool.name}
                                    </p>
                                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{tool.description}</p>
                                </div>

                                {/* Bottom accent line */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                                    style={{ background: tool.color }}
                                />
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
