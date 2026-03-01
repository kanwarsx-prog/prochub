'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchResult } from '@/lib/types';

export default function SearchClient() {
    const searchParams = useSearchParams();
    const initialQ = searchParams.get('q') ?? '';
    const [term, setTerm] = useState(initialQ);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (!initialQ) return;
        doSearch(initialQ);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function doSearch(q: string) {
        if (!q.trim()) { setResults([]); setSearched(false); return; }
        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        doSearch(term);
        history.replaceState(null, '', `/search?q=${encodeURIComponent(term)}`);
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold mb-6">Search</h1>

            <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
                <input
                    type="text"
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                    placeholder="Search processes, policies, templates…"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                    type="submit"
                    className="px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: 'var(--brand)' }}
                >
                    Search
                </button>
            </form>

            {loading && (
                <div className="text-center py-12 text-slate-400 text-sm">Searching…</div>
            )}

            {!loading && results.length > 0 && (
                <div>
                    <p className="text-sm text-slate-500 mb-4">
                        {results.length} result{results.length !== 1 ? 's' : ''} for <strong>&ldquo;{term}&rdquo;</strong>
                    </p>
                    <div className="space-y-3">
                        {results.map(r => (
                            <Link
                                key={r.id}
                                href={`/process/${r.id}`}
                                className="block bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all group"
                            >
                                <p className="font-semibold text-sm mb-1 group-hover:text-[color:var(--brand)] transition-colors">
                                    {r.title}
                                </p>
                                <p className="text-xs text-slate-500 line-clamp-2">{r.summary}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {!loading && searched && results.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="font-semibold text-slate-600 mb-1">No results for &ldquo;{term}&rdquo;</p>
                    <p className="text-sm">
                        Try a different keyword or browse the{' '}
                        <Link href="/explore" className="underline text-[color:var(--brand)]">Explore</Link> section.
                    </p>
                </div>
            )}
        </div>
    );
}
