import Link from 'next/link';

const JOURNEY = [
    {
        id: 'category-strategy',
        label: 'Category Strategy',
        icon: '📐',
        color: '#2563eb',
        bg: '#eff6ff',
        desc: 'Plan & segment',
    },
    {
        id: 'sourcing-step-1-2',
        label: 'Sourcing',
        icon: '⚡',
        color: '#059669',
        bg: '#f0fdf4',
        desc: 'RFx & award',
    },
    {
        id: 'contract-management',
        label: 'Contract',
        icon: '📄',
        color: '#7c3aed',
        bg: '#faf5ff',
        desc: 'CLM & sign',
    },
    {
        id: 'spm-jbp',
        label: 'SPM & JBP',
        icon: '📊',
        color: '#C80651',
        bg: '#fdf2f6',
        desc: 'Performance',
    },
    {
        id: 'p2p',
        label: 'Procure to Pay',
        icon: '🛒',
        color: '#d97706',
        bg: '#fffbeb',
        desc: 'PO & pay',
    },
];

export default function ProcessJourney() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="font-bold text-base text-slate-900">Procurement journey</h2>
                    <p className="text-xs text-slate-400 mt-0.5">How the core processes connect end-to-end</p>
                </div>
                <Link href="/explore"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all">
                    View all →
                </Link>
            </div>

            {/* Flow */}
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
                {JOURNEY.map((step, i) => (
                    <div key={step.id} className="flex items-center">
                        <Link href={`/process/${step.id}`}
                            className="flex flex-col items-center gap-2 group shrink-0 w-28 px-2">
                            {/* Node */}
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white card-hover group-hover:scale-110 transition-transform"
                                style={{ background: step.bg, borderColor: step.color + '33' }}>
                                {step.icon}
                            </div>
                            {/* Labels */}
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-slate-800 leading-tight group-hover:underline"
                                    style={{ textDecorationColor: step.color }}>
                                    {step.label}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                            </div>
                            {/* Step number */}
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                                style={{ background: step.color }}>
                                {i + 1}
                            </span>
                        </Link>

                        {/* Connector */}
                        {i < JOURNEY.length - 1 && (
                            <div className="flex flex-col items-center shrink-0 w-6 -mt-8">
                                <div className="h-0.5 w-5 relative" style={{ background: 'linear-gradient(90deg, #e2e8f0, #c4b5fd)' }}>
                                    <span className="absolute -right-1 -top-[5px] text-violet-300 text-[9px]">▶</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
