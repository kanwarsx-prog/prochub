'use client';

export default function ChatTriggerButton() {
    return (
        <button
            onClick={() => window.dispatchEvent(new Event('open-chat'))}
            style={{
                width: '44px', height: '44px', borderRadius: '16px',
                border: '1px solid var(--border-strong)', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', flexShrink: 0,
                color: 'var(--text-1)'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--brand)';
                e.currentTarget.style.color = 'var(--brand)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(200,6,81,0.12), 0 0 0 4px rgba(200,6,81,0.05)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.color = 'var(--text-1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)';
            }}
            title="Ask Playbook AI"
        >
            <span style={{ fontSize: '20px' }}>✦</span>
        </button>
    );
}
