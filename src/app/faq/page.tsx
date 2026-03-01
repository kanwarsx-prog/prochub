'use client';
import Link from 'next/link';
import { useState } from 'react';
import PageWrapper from '@/components/PageWrapper/PageWrapper';
import SearchBar from '@/components/SearchBar/SearchBar';
import ChatTriggerButton from '@/components/ChatTriggerButton/ChatTriggerButton';

interface FAQItem {
    q: string;
    a: string;
    link?: { label: string; href: string };
    href?: string;
    linkLabel?: string;
}

interface FAQSection {
    category: string;
    icon: string;
    color: string;
    items: FAQItem[];
}

const FAQ_DATA: FAQSection[] = [
    {
        category: 'Sourcing & Procurement',
        icon: '⚡',
        color: '#059669',
        items: [
            { q: 'When do I need to run a competitive tender?', a: 'A competitive tender (RFx) is required for any new or renewed spend above the relevant Step 1/2 threshold for your market. Check the Sourcing Step 1/2 process for your market-specific approval thresholds. Exceptions require documented justification and sign-off.', link: { label: 'Sourcing Step 1/2 process', href: '/process/sourcing-step-1-2' } },
            { q: 'What is the difference between Step 1 and Step 2 sourcing?', a: 'Step 1 is a simplified sourcing route for lower-spend or lower-risk categories — fewer suppliers, lighter scoring. Step 2 is the full RFx process with competition checks, RFx build, evaluation panel, and CLM handoff.', link: { label: 'See full process', href: '/process/sourcing-step-1-2' } },
            { q: 'Can I use Fairmarkit instead of a full RFx?', a: 'Yes — Fairmarkit is the approved tool for tail spend and spot buys below your Step 1 threshold. It automates supplier selection and bidding for low-value, routine purchases. Anything above the threshold must follow the full sourcing process.' },
            { q: 'What is an antitrust / competition check and when is it required?', a: 'A competition check verifies that there are no antitrust restrictions preventing you from approaching certain suppliers. It is mandatory before issuing any RFx. The check is logged in the sourcing record.', link: { label: 'Competition & Antitrust process', href: '/process/competition-antitrust' } },
        ],
    },
    {
        category: 'Contracts',
        icon: '📄',
        color: '#2563eb',
        items: [
            { q: 'When do I need a contract vs a PO?', a: 'A contract is required when spend is above the PO-only threshold for your market, when specific IP, data, or liability terms are needed, or when the supplier relationship is strategic. A PO is sufficient for simple, transactional, low-risk purchases within threshold.', link: { label: 'Contract Management process', href: '/process/contract-management' } },
            { q: 'Who owns the contract negotiation?', a: 'Procurement is the primary negotiator for commercial terms. Legal own the legal terms and must be engaged for any non-standard clauses. The business sponsor owns the service scope.' },
            { q: 'Where do I store signed contracts?', a: 'All signed contracts must be loaded into iCertis (CLM). Contracts stored only in email or SharePoint do not count as executed for audit purposes. iCertis sends renewal and expiry alerts automatically.' },
        ],
    },
    {
        category: 'Supplier Performance',
        icon: '📊',
        color: '#C80651',
        items: [
            { q: 'How often should I review strategic suppliers?', a: 'Strategic suppliers (Tier 1) should be reviewed quarterly with a formal scorecard. Key suppliers (Tier 2) are reviewed bi-annually. Tactical suppliers are reviewed annually or ad hoc.', link: { label: 'SPM & JBP process', href: '/process/spm-jbp' } },
            { q: 'What is a JBP and who needs one?', a: 'A Joint Business Plan (JBP) is a co-created annual plan with strategic suppliers, aligning Diageo growth priorities with supplier capabilities. Required for all Tier 1 suppliers.' },
            { q: 'What happens if a supplier fails a KPI?', a: 'Log the failure in the SPM Workspace action plan. Agree a remediation plan with the supplier within 30 days. Escalate to procurement leadership if two consecutive KPI periods are missed.', link: { label: 'Risk & VCRM process', href: '/process/risk-vcrm' } },
        ],
    },
    {
        category: 'Procure to Pay',
        icon: '🛒',
        color: '#d97706',
        items: [
            { q: 'How do I raise a purchase order?', a: 'All POs must be raised in Coupa. You need a valid cost centre, GL code, and budget approval before raising a PO. Non-PO spend requires a retrospective PO or exception approval.', link: { label: 'Procure to Pay process', href: '/process/p2p' } },
            { q: 'Why is my invoice on hold?', a: 'Common causes: PO not raised before goods receipt, invoice amount exceeds PO value (3-way match failure), or missing GRN. Check Coupa for the specific hold reason.' },
        ],
    },
    {
        category: 'Getting Help',
        icon: '📬',
        color: '#7c3aed',
        items: [
            { q: 'Who do I contact for procurement support?', a: 'Raise a support request via the Procurement Hub. Your request is routed to the right team based on category and region. For urgent issues, contact your regional Category Manager directly.', href: 'https://diageo.my.salesforce-sites.com/procurement/s/create-case', linkLabel: 'Raise a request →' },
            { q: 'Where do I find templates and checklists?', a: 'All standard templates (RFx pack, supplier onboarding, contract review checklist, JBP template) are available in the Templates & Checklists section of this hub.', link: { label: 'Go to Templates', href: '/templates' } },
        ],
    },
];

function FAQAccordionItem({ item, color }: { item: FAQItem; color: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{
            background: 'var(--surface-0)', border: `1px solid ${open ? color + '33' : 'var(--border)'}`,
            borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.15s ease',
        }}>
            <button onClick={() => setOpen(o => !o)} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', textAlign: 'left', background: 'none', border: 'none',
                cursor: 'pointer', gap: '12px',
            }}>
                <span style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-1)', lineHeight: 1.4 }}>{item.q}</span>
                <span style={{
                    color: open ? color : 'var(--text-4)', fontSize: '16px', flexShrink: 0,
                    transition: 'transform 0.2s ease, color 0.15s',
                    transform: open ? 'rotate(90deg)' : 'none', display: 'inline-block',
                }}>›</span>
            </button>
            {open && (
                <div style={{ padding: '0 18px 16px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7 }}>{item.a}</p>
                    {item.link && (
                        <Link href={item.link.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '10px', fontSize: '12px', fontWeight: 600, color, textDecoration: 'none' }}>
                            {item.link.label} →
                        </Link>
                    )}
                    {item.href && (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '10px', fontSize: '12px', fontWeight: 600, color, textDecoration: 'none' }}>
                            {item.linkLabel ?? 'Learn more →'}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    return (
        <PageWrapper>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-3)', marginBottom: '20px' }}>
                <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</Link>
                <span>/</span>
                <span>Help & FAQ</span>
            </div>

            {/* Header */}
            <div style={{ marginBottom: '36px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-1)', marginBottom: '8px', textAlign: 'center' }}>Help & FAQ</h1>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.6, textAlign: 'center' }}>
                    Common questions answered. If you can&apos;t find what you need,{' '}
                    <a href="https://diageo.my.salesforce-sites.com/procurement/s/create-case"
                        target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'underline' }}>
                        raise a request
                    </a>.
                </p>
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                    <SearchBar width="100%" maxWidth="480px" placeholder="Search FAQs, processes, policies…" />
                    <ChatTriggerButton />
                </div>
            </div>

            {/* FAQ sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                {FAQ_DATA.map(section => (
                    <div key={section.category}>
                        {/* Section header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: section.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                                {section.icon}
                            </div>
                            <h2 style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-1)' }}>{section.category}</h2>
                            <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${section.color}33, transparent)` }} />
                        </div>
                        {/* Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {section.items.map((item, i) => (
                                <FAQAccordionItem key={i} item={item} color={section.color} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Still need help */}
            <div style={{
                marginTop: '48px', padding: '24px 28px', borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
                background: 'linear-gradient(135deg, rgba(200,6,81,0.05), rgba(109,40,145,0.05))',
                border: '1px solid var(--border)',
            }}>
                <div>
                    <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', marginBottom: '4px' }}>Still need help?</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Raise a support request and the Procurement Hub team will get back to you.</p>
                </div>
                <a href="https://diageo.my.salesforce-sites.com/procurement/s/create-case"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                        flexShrink: 0, padding: '10px 20px', borderRadius: '10px',
                        background: 'var(--brand)', color: '#fff', fontSize: '13px',
                        fontWeight: 700, textDecoration: 'none',
                        boxShadow: '0 2px 12px rgba(200,6,81,0.25)',
                        whiteSpace: 'nowrap',
                    }}>
                    Raise a request
                </a>
            </div>
        </PageWrapper>
    );
}
