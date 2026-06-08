/**
 * Route-level loading state for /services/[slug].
 *
 * Next.js renders this instantly the moment the user clicks a service card,
 * while the heavy ServicePageClient + ServiceHeroVisual chunks finish
 * fetching + parsing. Replaces the "stuck on the previous page" feel with
 * a fast-paint shell that signals "we heard you, the page is coming."
 *
 * Server component, ~0KB JS — paints on the first frame.
 */
export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0C0C0B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        color: '#F2EEE7',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Pulsing brand dot — same accent that's used everywhere else on the site */}
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#E8541A',
          boxShadow: '0 0 0 0 rgba(232,84,26,0.6)',
          animation: 'svc-load-pulse 1.2s ease-in-out infinite',
        }}
      />
      <div
        style={{
          fontSize: '11px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: 'rgba(242,238,231,0.55)',
        }}
      >
        Loading
      </div>

      <style>{`
        @keyframes svc-load-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(232,84,26,0.45); }
          50%      { transform: scale(1.25); box-shadow: 0 0 0 14px rgba(232,84,26,0); }
        }
        @keyframes svc-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
