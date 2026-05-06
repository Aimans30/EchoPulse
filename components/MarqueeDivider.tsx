'use client';

export default function MarqueeDivider({ text = 'Our Work' }: { text?: string }) {
  // 8 copies of the text, then doubled for a seamless loop (16 spans total).
  // Animation translates exactly -50% so the second half lands where the first half started.
  const words = Array(8).fill(text);
  const doubled = [...words, ...words];

  return (
    <div
      style={{
        overflow: 'hidden',
        padding: '64px 0',
        borderTop: '1px solid rgba(12,12,11,0.09)',
        borderBottom: '1px solid rgba(12,12,11,0.09)',
        background: 'var(--cream)',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: 'mq-scroll 40s linear infinite',
          willChange: 'transform',
        }}
      >
        {doubled.map((word, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(48px, 7vw, 108px)',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              whiteSpace: 'nowrap',
              padding: '0 28px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              color: i % 2 === 0 ? '#0C0C0B' : 'transparent',
              WebkitTextStroke: i % 2 !== 0 ? '2px #0C0C0B' : 'none',
              flexShrink: 0,
            }}
          >
            {word}
            <span
              aria-hidden
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#E8541A',
                flexShrink: 0,
                display: 'block',
              }}
            />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes mq-scroll {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
}
