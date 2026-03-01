'use client';
import PageWrapper from '@/components/PageWrapper/PageWrapper';
import { useState } from 'react';

const INITIAL_IDEAS = [
    {
        id: 1,
        title: 'Automate PO Generation for low-value recurring services',
        description: 'We spend too much time manually creating POs for monthly subscriptions under $500. Can we implement an auto-PO rule in Coupa?',
        author: 'Sarah Jenkins',
        department: 'Operations',
        votes: 42,
        status: 'Under Review',
        tags: ['Efficiency', 'Coupa'],
    },
    {
        id: 2,
        title: 'Consolidate travel agencies globally',
        description: 'Currently using 4 different agencies across regions. Consolidating to a single global partner could save 12% annually.',
        author: 'Michael Chang',
        department: 'Travel & Events',
        votes: 38,
        status: 'Planned',
        tags: ['Cost Savings', 'Sourcing'],
    },
    {
        id: 3,
        title: 'Supplier Diversity Dashboard in Sievo',
        description: 'Add a dedicated view in our Sievo instance to track our progress against the 2030 supplier diversity targets.',
        author: 'Elena Rodriguez',
        department: 'Sustainability',
        votes: 27,
        status: 'Open',
        tags: ['Analytics', 'ESG'],
    },
    {
        id: 4,
        title: 'Standardize NDA templates in iCertis',
        description: 'We have too many variations of NDAs. Moving to a standard fallback clause library in iCertis will speed up contracting.',
        author: 'David Smith',
        department: 'Legal Ops',
        votes: 15,
        status: 'Implemented',
        tags: ['Legal', 'iCertis'],
    }
];

export default function IdeasPage() {
    const [ideas, setIdeas] = useState(INITIAL_IDEAS);
    const [votedIds, setVotedIds] = useState<Set<number>>(new Set());

    const handleVote = (id: number) => {
        if (votedIds.has(id)) {
            setVotedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
            setIdeas(ideas.map(idea => idea.id === id ? { ...idea, votes: idea.votes - 1 } : idea));
        } else {
            setVotedIds(prev => new Set(prev).add(id));
            setIdeas(ideas.map(idea => idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Implemented': return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
            case 'Planned': return { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' };
            case 'Under Review': return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
            default: return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
        }
    };

    return (
        <PageWrapper>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: '8px' }}>
                        Idea Management
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--text-3)', lineHeight: 1.5, maxWidth: '640px' }}>
                        Submit, vote, and track the best ideas from the team to improve our procurement processes and systems.
                    </p>
                </div>
                <button style={{
                    padding: '10px 20px', borderRadius: '10px', border: 'none',
                    background: 'var(--brand)', color: '#fff', fontSize: '14px', fontWeight: 600,
                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(200,6,81,0.25)',
                    transition: 'all 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    + Submit Idea
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {ideas.sort((a, b) => b.votes - a.votes).map(idea => {
                    const statusStyle = getStatusColor(idea.status);
                    const isVoted = votedIds.has(idea.id);

                    return (
                        <div key={idea.id} style={{
                            background: '#ffffff',
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderRadius: '16px',
                            padding: '24px',
                            display: 'flex',
                            gap: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s ease',
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'}>

                            {/* Upvote Widget */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '48px' }}>
                                <button
                                    onClick={() => handleVote(idea.id)}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '10px',
                                        background: isVoted ? 'var(--brand)' : '#f8fafc',
                                        border: `1px solid ${isVoted ? 'var(--brand)' : '#e2e8f0'}`,
                                        color: isVoted ? '#fff' : '#64748b',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        fontSize: '18px'
                                    }}
                                >
                                    ▲
                                </button>
                                <span style={{ fontSize: '15px', fontWeight: 700, color: isVoted ? 'var(--text-1)' : 'var(--text-2)' }}>
                                    {idea.votes}
                                </span>
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
                                        {idea.title}
                                    </h3>
                                    <span style={{
                                        fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                                        padding: '4px 10px', borderRadius: '20px',
                                        background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}`
                                    }}>
                                        {idea.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: '16px', maxWidth: '800px' }}>
                                    {idea.description}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#475569' }}>
                                            {idea.author.charAt(0)}
                                        </div>
                                        <span style={{ fontSize: '12.5px', color: 'var(--text-2)', fontWeight: 500 }}>
                                            {idea.author} <span style={{ color: 'var(--text-4)' }}>({idea.department})</span>
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                                        {idea.tags.map(tag => (
                                            <span key={tag} style={{
                                                fontSize: '11px', fontWeight: 600, color: 'var(--text-3)',
                                                background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px',
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </PageWrapper>
    );
}
