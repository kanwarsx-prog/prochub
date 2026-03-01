/**
 * PageWrapper — consistent inner-page layout used by Explore, FAQ, Playbook, Process.
 * Provides: padding, max-width centering within the content column, and page background.
 */
export default function PageWrapper({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
    return (
        <div style={{
            padding: '48px 48px 64px',
            maxWidth: wide ? '1100px' : '860px',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '100%',
        }}>
            {children}
        </div>
    );
}
