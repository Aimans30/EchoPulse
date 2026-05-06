'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BOOK_CALL_URL } from '@/lib/links';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: '01', title: 'Strategy Call',      desc: 'Free 45-minute call. We learn your goals, audience, current content situation, and which services fit your stage.',                       icon: '📞', iconBg: 'rgba(59,130,246,0.12)',  iconColor: '#3b82f6' },
  { num: '02', title: 'Voice Foundation',   desc: '90-minute recorded interview captures your stories, beliefs, and signature voice. Encoded into a doc every writer references on every brief.', icon: '🎙️', iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6' },
  { num: '03', title: 'We Produce',         desc: 'Editors, writers, designers, and automation specialists ship video, LinkedIn posts, blogs, ad creative, and websites in your voice.',         icon: '🎬', iconBg: 'rgba(232,84,26,0.12)',  iconColor: '#E8541A' },
  { num: '04', title: 'Review & Refine',    desc: 'You see every deliverable before it ships. Revisions until you are satisfied, no round caps. Voice fidelity scored against your Voice DNA on every piece.',       icon: '✅', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  { num: '05', title: 'Scale & Iterate',    desc: 'Monthly performance review across every channel. Voice Foundation refreshed quarterly. Calendar tuned to what is actually working.',           icon: '📈', iconBg: 'rgba(245,158,11,0.12)', iconColor: '#f59e0b' },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  // scroll-driven step (controlled by ScrollTrigger)
  const [scrollStep, setScrollStep] = useState(-1);
  // hover-driven step (cursor on a card)
  const [hoverStep, setHoverStep] = useState<number | null>(null);

  // The step actually displayed: hover overrides scroll, but only when user is hovering
  const activeStep = hoverStep !== null ? hoverStep : scrollStep;

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    gsap.fromTo(line, { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 58%',
        end: 'bottom 62%',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.04) { setScrollStep(-1); return; }
          setScrollStep(Math.min(4, Math.floor(p * 5.15)));
        },
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  // When hover changes, drive the orange line to fill up to that step
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    if (hoverStep !== null) {
      // Map hover step to a fill ratio: 0 → 0.1, 1 → 0.3, 2 → 0.5, 3 → 0.7, 4 → 0.95
      const target = (hoverStep + 1) / steps.length - 0.05;
      gsap.to(line, { scaleX: Math.max(0.05, target), duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    }
    // When hover clears, ScrollTrigger reasserts itself naturally as the user scrolls
  }, [hoverStep]);

  return (
    <section ref={sectionRef} style={{ padding: '96px 56px 100px', position: 'relative', overflow: 'hidden', background: 'var(--cream)' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '360px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(232,84,26,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <style>{`
        .process-wrap { max-width: 1180px; margin: 0 auto; position: relative; z-index: 1; }
        .process-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          align-items: start;
        }
        @media(max-width:1100px){ .process-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media(max-width:700px) { .process-grid { grid-template-columns: 1fr 1fr !important; } }
        @media(max-width:480px) { .process-grid { grid-template-columns: 1fr !important; } }
        @media(max-width:700px) { .process-connector { display:none !important; } }
      `}</style>

      <div className="process-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#6E6B63', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
          How It Works
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(34px, 4.4vw, 64px)', fontWeight: 900, letterSpacing: '-2.5px', maxWidth: '560px', margin: '0 0 56px', lineHeight: 1 }}
        >
          Simple process.<br />
          <span style={{ color: '#E8541A' }}>Serious</span> results.
        </motion.h2>

        {/* Step number row + animated connector */}
        <div className="process-connector" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
          {/* Grey track */}
          <div style={{ position: 'absolute', inset: 0, top: '50%', transform: 'translateY(-50%)', height: '2px', background: 'rgba(12,12,11,0.07)', borderRadius: '2px' }} />

          {/* Orange fill */}
          <div
            ref={lineRef}
            style={{
              position: 'absolute', inset: 0, top: '50%',
              transform: 'translateY(-50%) scaleX(0)',
              transformOrigin: 'left', height: '2px',
              background: 'linear-gradient(90deg, #E8541A 0%, #ff8c5a 100%)',
              borderRadius: '2px', zIndex: 1,
              boxShadow: '0 0 10px rgba(232,84,26,0.45)',
            }}
          />

          {/* Step circles */}
          {steps.map((step, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
              <motion.div
                animate={{
                  background: i <= activeStep ? '#E8541A' : '#F2EEE7',
                  boxShadow: i === activeStep
                    ? '0 0 0 6px rgba(232,84,26,0.12), 0 0 16px rgba(232,84,26,0.30)'
                    : '0 0 0 0px rgba(232,84,26,0)',
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: `2px solid ${i <= activeStep ? '#E8541A' : 'rgba(232,84,26,0.3)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: i <= activeStep ? '#fff' : 'rgba(232,84,26,0.6)',
                  fontFamily: 'Inter, sans-serif',
                  flexShrink: 0,
                  transition: 'border-color 0.6s cubic-bezier(0.16,1,0.3,1), color 0.6s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {i + 1}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Cards — hover any to advance the timeline. Smooth, no jitter. */}
        <div
          className="process-grid"
          onMouseLeave={() => setHoverStep(null)}
        >
          {steps.map((step, i) => {
            const isActive = i === activeStep;

            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoverStep(i)}
                onFocus={() => setHoverStep(i)}
                tabIndex={0}
                className="process-card"
                style={{
                  background: isActive
                    ? 'rgba(255,255,255,0.96)'
                    : 'rgba(255,255,255,0.62)',
                  backdropFilter: 'blur(28px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                  border: isActive
                    ? `1px solid ${step.iconColor}40`
                    : '1px solid rgba(255,255,255,0.8)',
                  borderRadius: '16px',
                  padding: '22px 18px 20px',
                  boxShadow: isActive
                    ? `0 12px 36px rgba(12,12,11,0.08), inset 0 1px 0 rgba(255,255,255,1)`
                    : '0 2px 12px rgba(12,12,11,0.03), inset 0 1px 0 rgba(255,255,255,0.85)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'none',
                  transition: 'background 0.6s cubic-bezier(0.16,1,0.3,1), border-color 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {/* Top accent bar — fills as step becomes active */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: `linear-gradient(90deg, ${step.iconColor}, ${step.iconColor}88)`,
                  transformOrigin: 'left',
                  transform: i <= activeStep ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                  borderRadius: '16px 16px 0 0',
                }} />

                {/* Step number eyebrow */}
                <div style={{
                  fontSize: '9px', fontWeight: 700, letterSpacing: '3px',
                  color: isActive ? step.iconColor : 'rgba(232,84,26,0.7)',
                  marginBottom: '14px', textTransform: 'uppercase',
                  transition: 'color 0.6s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  {step.num}
                </div>

                {/* Icon — fixed size, only color background changes */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: isActive ? step.iconBg : 'rgba(12,12,11,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  marginBottom: '14px',
                  transition: 'background 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow: isActive ? `0 4px 14px ${step.iconColor}25` : '0 0 0 transparent',
                }}>
                  {step.icon}
                </div>

                {/* Title — fixed size always */}
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  fontWeight: 800,
                  marginBottom: '8px',
                  letterSpacing: '-0.2px',
                  color: '#0C0C0B',
                  lineHeight: 1.2,
                }}>
                  {step.title}
                </div>

                {/* Desc */}
                <div style={{
                  fontSize: '11.5px',
                  color: isActive ? '#4a4a46' : '#6E6B63',
                  lineHeight: 1.6,
                  transition: 'color 0.6s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  {step.desc}
                </div>

                {/* Subtle ambient glow on active — no layout shift */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '16px',
                  background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${step.iconColor}10 0%, transparent 70%)`,
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1)',
                  pointerEvents: 'none',
                }} />
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}
        >
          <a
            href={BOOK_CALL_URL}
            target="_blank" rel="noopener noreferrer"
            data-cursor-hover
            style={{ background: '#E8541A', color: '#fff', padding: '15px 32px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, cursor: 'none', transition: 'all 0.3s', textDecoration: 'none', fontFamily: 'Inter, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 32px rgba(232,84,26,0.3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#d94a14'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#E8541A'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            Start with a Free Strategy Call
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
