'use client';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        const text = input.trim();
        if (!text || loading) return;

        const userMsg: ChatMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: messages }),
            });
            const data = await res.json();
            const assistantMsg: ChatMessage = {
                role: 'assistant',
                content: data.answer ?? 'Sorry, I couldn\'t generate a response.',
                sources: data.sources ?? [],
            };
            setMessages(prev => [...prev, assistantMsg]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Something went wrong. Please try again.',
            }]);
        } finally {
            setLoading(false);
        }
    }

    if (!open) return null;

    return (
        <>
            <style>{`
                @keyframes chatSlideUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>

            {/* Backdrop - completely transparent map background overlay */}
            <div className="fixed inset-0 z-40 bg-transparent transition-opacity" onClick={onClose} />

            {/* Floating Panel: Separated from the literal screen edge with exact margins */}
            <div className="fixed bottom-[24px] right-[24px] w-[420px] max-w-[calc(100vw-48px)] h-[650px] max-h-[calc(100vh-48px)] bg-white shadow-[0_12px_44px_rgba(0,0,0,0.15)] rounded-2xl z-50 flex flex-col overflow-hidden border border-slate-200"
                style={{ animation: 'chatSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10"
                    style={{ background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)' }}>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">✨</span>
                        <div>
                            <p className="text-white font-semibold text-sm">Playbook AI</p>
                            <p className="text-purple-300 text-xs">Powered by your Playbook content</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white text-xl leading-none">✕</button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-white">
                    {messages.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            <p className="text-3xl mb-3">💬</p>
                            <p className="font-semibold text-slate-600 text-sm mb-1">Ask anything about procurement</p>
                            <p className="text-xs">e.g. "What approvals do I need for a £500k sourcing?"</p>
                            <div className="mt-5 flex flex-col gap-2">
                                {[
                                    'Walk me through the sourcing process',
                                    'When do I need a contract?',
                                    'What are the P2P buying channels?',
                                ].map(q => (
                                    <button key={q} onClick={() => { setInput(q); }}
                                        className="text-xs px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-left transition-colors">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-[20px] px-5 py-4 text-[14px] shadow-sm ${msg.role === 'user'
                                ? 'text-white rounded-br-[4px]'
                                : 'bg-[#f4f6f8] text-slate-800 rounded-bl-[4px] border border-slate-100'
                                }`} style={msg.role === 'user' ? { background: 'var(--brand)' } : {}}>
                                {msg.role === 'user' ? (
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                ) : (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                            ul: ({ ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
                                            ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                                            li: ({ ...props }) => <li className="mb-1" {...props} />,
                                            strong: ({ ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                                            a: ({ ...props }) => <a className="text-[color:var(--brand)] hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                )}
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-slate-200 space-y-1">
                                        {msg.sources.map((s, si) => (
                                            <Link key={si} href={s.url}
                                                className="flex items-center gap-1 text-xs text-[color:var(--brand)] hover:underline">
                                                <span>→</span> {s.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-[#f4f6f8] rounded-[20px] rounded-bl-[4px] px-5 py-4 border border-slate-100 shadow-sm">
                                <div className="flex gap-1 items-center h-4">
                                    {[0, 1, 2].map(i => (
                                        <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="px-6 py-5 border-t border-slate-100 flex gap-3 bg-white">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask about any process…"
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 bg-slate-50 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-5 py-3 rounded-xl text-[14px] font-semibold text-white disabled:opacity-40 transition-all hover:shadow-[0_4px_12px_rgba(124,58,237,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                    >
                        Send
                    </button>
                </form>
            </div>
        </>
    );
}
