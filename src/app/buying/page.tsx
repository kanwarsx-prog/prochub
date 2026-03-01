'use client';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper/PageWrapper';
import SearchBar from '@/components/SearchBar/SearchBar';
import ChatTriggerButton from '@/components/ChatTriggerButton/ChatTriggerButton';

export default function BuyingPage() {
    return (
        <PageWrapper>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-3)', marginBottom: '20px' }}>
                <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</Link>
                <span>/</span>
                <span>Buying at Diageo</span>
            </div>

            {/* Header */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-1)', marginBottom: '8px', textAlign: 'center' }}>
                    Buying at Diageo
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.6, textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                    Your guide to purchasing goods and services. Learn about sourcing routes, spot buys via Fairmarkit, and how to raise a PO.
                </p>
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                    <SearchBar width="100%" maxWidth="480px" placeholder="Search buying policies, Fairmarkit…" />
                    <ChatTriggerButton />
                </div>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                {/* Fairmarkit Card - Highlighted */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(200,6,81,0.03), rgba(109,40,145,0.08))',
                    border: '1px solid var(--brand)',
                    borderRadius: '16px', padding: '24px',
                    gridColumn: '1 / -1',
                    display: 'flex', gap: '24px', alignItems: 'flex-start'
                }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '12px', background: 'var(--brand)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px',
                        flexShrink: 0, boxShadow: '0 4px 12px rgba(200,6,81,0.25)'
                    }}>⚡</div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '8px' }}>Fairmarkit (Spot Buys & Tail Spend)</h2>
                        <p style={{ fontSize: '13.5px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '16px' }}>
                            Fairmarkit is the approved, mandatory tool for tail spend and spot buys that fall below your market's Step 1 threshold.
                            It automates supplier selection and bidding for low-value, routine purchases, saving time and ensuring competitive pricing without a full RFx process.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <a href="https://app.fairmarkit.com" target="_blank" rel="noopener noreferrer" style={{
                                padding: '8px 16px', borderRadius: '8px', background: 'var(--brand)', color: '#fff', fontSize: '13px', fontWeight: 600, textDecoration: 'none'
                            }}>Launch Fairmarkit ↗</a>
                            <Link href="/faq" style={{ fontSize: '13px', color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Read Fairmarkit FAQs →</Link>
                        </div>
                    </div>
                </div>

                {/* Sourcing Routes */}
                <div style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '16px' }}>
                        ⚖️
                    </div>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>Sourcing Routes</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: '16px' }}>
                        Need to run a tender above the spot buy threshold? Understand the difference between Step 1 (simplified) and Step 2 (full RFx) processes.
                    </p>
                    <Link href="/process/sourcing-step-1-2" style={{ fontSize: '13px', color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}>View Sourcing Process →</Link>
                </div>

                {/* Procure to Pay */}
                <div style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '16px' }}>
                        🛒
                    </div>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>Raise a Purchase Order</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: '16px' }}>
                        All POs must be raised in Coupa. Ensure you have a valid cost centre, GL code, and budget approval before initiating a purchase.
                    </p>
                    <Link href="/process/p2p" style={{ fontSize: '13px', color: '#d97706', fontWeight: 600, textDecoration: 'none' }}>View P2P Process →</Link>
                </div>

                {/* Contracts */}
                <div style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '16px' }}>
                        📄
                    </div>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>When is a contract needed?</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: '16px' }}>
                        Contracts are required for spend above your PO-only threshold, or when specific IP, data sharing, or liability terms must be established.
                    </p>
                    <Link href="/process/contract-management" style={{ fontSize: '13px', color: '#059669', fontWeight: 600, textDecoration: 'none' }}>Contract Guidelines →</Link>
                </div>

            </div>
        </PageWrapper>
    );
}
