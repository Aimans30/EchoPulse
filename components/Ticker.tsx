'use client';

const items = [
  'Video Editing',
  'LinkedIn Ghostwriting',
  'Blog Production',
  'Ad Creatives',
  'Websites & Funnels',
  'Automations',
  'Voice Foundation',
  'Short-Form Content',
];

export default function Ticker() {
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: '1px solid rgba(12,12,11,0.09)',
        borderBottom: '1px solid rgba(12,12,11,0.09)',
        background: '#0C0C0B',
        padding: '14px 0',
      }}
    >
      <div className="ticker-animate" style={{ display: 'flex', width: 'max-content' }}>
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              whiteSpace: 'nowrap',
              padding: '0 36px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'rgba(242,238,231,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <span
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#E8541A',
                flexShrink: 0,
                display: 'block',
              }}
            />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
