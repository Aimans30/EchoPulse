'use client';

import { motion } from 'framer-motion';

const lines = [
  { parts: [{ text: 'We handle your content.', muted: true }, { text: ' Marketing and post-production.', accent: true }], arrow: true },
  { parts: [{ text: 'Built around your offer.' }, { text: ' Not a template.', accent: true }] },
  { parts: [{ text: 'Done-for-you marketing.', accent: true }, { text: ' Run by operators.' }], arrow: true },
  { parts: [{ text: 'Get your time back.' }, { text: ' Hours', accent: true }, { text: ' every week.', accent: true }] },
];

export default function Manifesto() {
  // Note: previous GSAP + ScrollTrigger intro was replaced with Framer Motion
  // whileInView. The old setup interacted badly with the Lenis smooth-scroll
  // wrapper inside this dynamic-imported chunk, occasionally locking page
  // scroll. Framer Motion's IntersectionObserver-based whileInView is the
  // safer pattern here and renders identically.

  return (
    <section
      data-dark-bg="true"
      className="manifesto-section"
      style={{
        padding: '128px 56px',
        background: '#0C0C0B',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        className="manifesto-glow"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 80% 50%, rgba(232,84,26,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="manifesto-eyebrow"
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: 'rgba(242,238,231,0.28)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
        How we work
      </div>

      <div style={{ maxWidth: '1080px' }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              overflow: 'hidden',
              borderBottom: i < lines.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
          >
            <motion.div
              className="manifesto-line"
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              // Tight bottom margin so EACH line waits until it's clearly
              // entering the viewport before animating — no more "all four
              // lines pop in together" on mobile, where the section is tall
              // relative to the screen. Each line gets its own scroll moment.
              viewport={{ once: true, margin: '0px 0px -25% 0px' }}
              // No per-line delay — each line is gated by its own scroll
              // trigger now, so a stacked delay would compound the wait.
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(34px, 5.2vw, 80px)',
                fontWeight: 900,
                letterSpacing: '-2px',
                lineHeight: 1.06,
                display: 'flex',
                alignItems: 'baseline',
                gap: '18px',
                flexWrap: 'wrap',
                padding: '24px 0',
                color: '#F2EEE7',
              }}
            >
              {line.parts.map((part, j) => (
                <span
                  key={j}
                  style={{
                    color: part.accent ? '#E8541A' : (part as { muted?: boolean }).muted ? 'rgba(242,238,231,0.18)' : '#F2EEE7',
                  }}
                >
                  {part.text}
                </span>
              ))}
              {line.arrow && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E8541A"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    width: '0.55em',
                    height: '0.55em',
                    marginLeft: 'auto',
                    opacity: 0.85,
                    flexShrink: 0,
                  }}
                >
                  <path d="M7 17L17 7M17 7H8M17 7V16" />
                </svg>
              )}
            </motion.div>
          </div>
        ))}
      </div>

      <style>{`
        /* ── Mobile polish for Manifesto ──
           Pulls in the section padding and tones down the ambient gradient
           on phones. Typography for .manifesto-line is handled in
           globals.css (display:block + clamp font-size) so words flow as
           a natural sentence instead of wrapping word-by-word. */
        /* ── Mobile app-UI tightening ──
           Goal: full manifesto + CTA fit ~one viewport on a 375×800 phone.
           Section padding cut nearly in half, line spacing tightened,
           eyebrow margin reduced. */
        @media (max-width: 900px) {
          .manifesto-section { padding: 64px 28px !important; }
        }
        @media (max-width: 640px) {
          .manifesto-section { padding: 48px 20px !important; }
          .manifesto-eyebrow {
            margin-bottom: 10px !important;
            /* 9px + 3px tracking on a dark background is at the edge of
               legible on a phone. 10.5px costs no vertical space. */
            font-size: 10.5px !important;
            letter-spacing: 2.5px !important;
          }
          /* Arrow icon: don't shove right on mobile, nest tight to text. */
          .manifesto-line > svg {
            margin-left: 4px !important;
            opacity: 0.7 !important;
          }
          /* Soften the ambient orange glow — cheap paint on small screens. */
          .manifesto-glow { opacity: 0.55 !important; }
        }
        @media (max-width: 380px) {
          .manifesto-section { padding: 40px 16px !important; }
          .manifesto-eyebrow { margin-bottom: 8px !important; }
        }
      `}</style>
    </section>
  );
}
