'use client';
import { useState } from 'react';

export default function PinButton({ processId, processTitle }: { processId: string, processTitle: string }) {
    // In a real app, this would check global state/context to see if it's pinned
    const [isPinned, setIsPinned] = useState(false);

    const togglePin = () => {
        setIsPinned(!isPinned);
    };

    return (
        <button
            onClick={togglePin}
            title={isPinned ? "Unpin from sidebar" : "Pin to sidebar"}
            style={{
                background: isPinned ? 'rgba(200, 6, 81, 0.1)' : 'transparent',
                border: isPinned ? '1px solid rgba(200, 6, 81, 0.3)' : '1px solid var(--border)',
                color: isPinned ? '#c80651' : 'var(--text-3)',
                padding: '6px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
                if (!isPinned) e.currentTarget.style.background = 'var(--surface-0)';
            }}
            onMouseLeave={e => {
                if (!isPinned) e.currentTarget.style.background = 'transparent';
            }}
        >
            <span style={{ fontSize: '14px' }}>📌</span>
            {isPinned ? 'Pinned' : 'Pin to sidebar'}
        </button>
    );
}
