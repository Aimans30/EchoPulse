'use client';

export default function MarqueeDivider({ text = 'Our Work' }: { text?: string }) {
  const words = Array(10).fill(text);

  return (
    <div
      style={{
        overflow: 'hidden',
        padding: '64px 0',
        borderTop: '1px solid rgba(12,12,11,0.09)',
        borderBottom: '1px solid rgba(12,12,11,0.09)',
      }}
    >
      <div className="marquee-animate" style={{ display: 'flex', width: 'max-content' }}>
        {words.map((word, i) => (
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
            }}
          >
            {word}
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#E8541A',
                flexShrink: 0,
                display: 'block',
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
