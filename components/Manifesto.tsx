'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { parts: [{ text: 'Most content online', muted: true }, { text: ' sounds the same.', accent: true }], arrow: true },
  { parts: [{ text: 'AI wrote it.' }, { text: ' Nobody', muted: true }, { text: ' reads it.', accent: true }] },
  { parts: [{ text: 'Your ' }, { text: 'voice', accent: true }, { text: ' is your ' }, { text: 'edge.', accent: true }], arrow: true },
  { parts: [{ text: 'We make sure it sounds like ' }, { text: 'you.', accent: true }] },
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '128px 56px',
        background: '#0C0C0B',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 80% 50%, rgba(232,84,26,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div
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
        What We Believe
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
            <div
              ref={(el) => { lineRefs.current[i] = el; }}
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
                    color: part.accent ? '#E8541A' : part.muted ? 'rgba(242,238,231,0.18)' : '#F2EEE7',
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
