'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: '01', title: 'Strategy Call',     desc: 'We learn your goals, audience, and current content situation in a free 45-min call.',                icon: '📞', iconBg: 'rgba(59,130,246,0.12)',  iconColor: '#3b82f6' },
  { num: '02', title: 'Content Blueprint', desc: 'We build your custom content strategy, platform plan, and production schedule.',                     icon: '🗺️', iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6' },
  { num: '03', title: 'We Produce',        desc: 'Your team gets to work. Edits, funnels, automations — delivered to your timeline.',                  icon: '🎬', iconBg: 'rgba(232,84,26,0.12)',  iconColor: '#E8541A' },
  { num: '04', title: 'Review & Refine',   desc: 'You give feedback, we refine. Two rounds included, final versions optimised per platform.',           icon: '✅', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  { num: '05', title: 'Scale & Grow',      desc: 'Monthly reporting, performance analysis, and strategy updates to compound growth.',                  icon: '📈', iconBg: 'rgba(245,158,11,0.12)', iconColor: '#f59e0b' },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

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
          if (p < 0.04) { setActiveStep(-1); return; }
          setActiveStep(Math.min(4, Math.floor(p * 5.15)));
        },
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: '128px 56px 140px', position: 'relative', overflow: 'hidden', background: 'var(--cream)' }}>
      {/* Single soft orange bloom — EchoPulse brand color */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(232,84,26,0.09) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <style>{`
        .process-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          align-items: start;
        }
        @media(max-width:1100px){ .process-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media(max-width:700px) { .process-grid { grid-template-columns: 1fr 1fr !important; } }
        @media(max-width:480px) { .process-grid { grid-template-columns: 1fr !important; } }
        @media(max-width:700px) { .process-connector { display:none !important; } }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#6E6B63', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}
      >
        <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
        How It Works
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(36px, 4.5vw, 72px)', fontWeight: 900, letterSpacing: '-3px', maxWidth: '580px', margin: '0 0 72px', lineHeight: 1.05 }}
      >
        Simple process.<br />
        <span style={{ color: '#E8541A' }}>Serious</span> results.
      </motion.h2>

      {/* Step number row + animated connector */}
      <div className="process-connector" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '18px' }}>
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
                width:  i === activeStep ? 44 : 36,
                height: i === activeStep ? 44 : 36,
                background: i <= activeStep ? '#E8541A' : '#F2EEE7',
                boxShadow: i === activeStep
                  ? '0 0 0 8px rgba(232,84,26,0.12), 0 0 24px rgba(232,84,26,0.35)'
                  : '0 0 0 0px rgba(232,84,26,0)',
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderRadius: '50%',
                border: `2px solid ${i <= activeStep ? '#E8541A' : 'rgba(232,84,26,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: i === activeStep ? '14px' : '11px',
                fontWeight: 800,
                color: i <= activeStep ? '#fff' : 'rgba(232,84,26,0.6)',
                fontFamily: 'Inter, sans-serif',
                flexShrink: 0,
                transition: 'border-color 0.4s, color 0.4s, font-size 0.4s',
              }}
            >
              {i + 1}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="process-grid">
        {steps.map((step, i) => {
          const isActive = i === activeStep;
          const isPast   = i < activeStep;
          const isFuture = activeStep >= 0 && i > activeStep;

          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              animate={{
                scale:   isActive ? 1.04 : 1,
                opacity: activeStep === -1 ? 1 : isActive ? 1 : isPast ? 0.7 : 0.45,
                y:       isActive ? -6 : 0,
              }}
              style={{
                background: isActive
                  ? 'rgba(255,255,255,0.92)'
                  : isPast
                  ? 'rgba(255,255,255,0.60)'
                  : 'rgba(255,255,255,0.38)',
                backdropFilter: 'blur(28px) saturate(160%)',
                WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                border: isActive
                  ? '1px solid rgba(232,84,26,0.20)'
                  : '1px solid rgba(255,255,255,0.80)',
                borderRadius: '18px',
                padding: '32px 24px 28px',
                boxShadow: isActive
                  ? '0 20px 60px rgba(12,12,11,0.12), 0 0 0 1px rgba(232,84,26,0.07), inset 0 1px 0 rgba(255,255,255,1)'
                  : '0 2px 16px rgba(12,12,11,0.04), inset 0 1px 0 rgba(255,255,255,0.85)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                zIndex: isActive ? 3 : 1,
                transition: 'background 0.45s, border-color 0.45s, box-shadow 0.45s',
              }}
            >
              {/* Top accent bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: `linear-gradient(90deg, ${step.iconColor}, ${step.iconColor}88)`,
                transformOrigin: 'left',
                transform: i <= activeStep ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                borderRadius: '18px 18px 0 0',
              }} />

              {/* Step number */}
              <div style={{
                fontSize: '9px', fontWeight: 700, letterSpacing: '3px',
                color: isActive ? step.iconColor : '#E8541A',
                marginBottom: '18px', textTransform: 'uppercase',
                transition: 'color 0.4s',
              }}>
                {step.num}
              </div>

              {/* Icon with colored bg */}
              <div style={{
                width: isActive ? '52px' : '44px',
                height: isActive ? '52px' : '44px',
                borderRadius: '14px',
                background: isActive ? step.iconBg : 'rgba(12,12,11,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isActive ? '26px' : '22px',
                marginBottom: '18px',
                transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: isActive ? `0 4px 16px ${step.iconColor}22` : 'none',
              }}>
                {step.icon}
              </div>

              {/* Title */}
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: isActive ? '17px' : '15px',
                fontWeight: 800,
                marginBottom: '10px',
                letterSpacing: '-0.3px',
                color: '#0C0C0B',
                transition: 'font-size 0.4s',
              }}>
                {step.title}
              </div>

              {/* Desc */}
              <div style={{
                fontSize: '12px',
                color: isActive ? '#4a4a46' : '#6E6B63',
                lineHeight: 1.7,
                transition: 'color 0.4s',
              }}>
                {step.desc}
              </div>

              {/* Active glow overlay */}
              {isActive && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '18px',
                  background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${step.iconColor}08 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
              )}

              {/* Watermark number */}
              <div style={{
                position: 'absolute', bottom: '10px', right: '16px',
                fontFamily: 'Inter', fontSize: '52px', fontWeight: 900,
                color: isActive ? `${step.iconColor}12` : 'rgba(12,12,11,0.04)',
                letterSpacing: '-3px', lineHeight: 1,
                pointerEvents: 'none', userSelect: 'none',
                transition: 'color 0.4s',
              }}>
                {i + 1}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ marginTop: '64px', display: 'flex', justifyContent: 'center' }}
      >
        <a
          href="https://echopulse.media"
          target="_blank" rel="noopener noreferrer"
          style={{ background: '#E8541A', color: '#fff', padding: '16px 36px', borderRadius: '100px', fontSize: '14px', fontWeight: 700, cursor: 'none', transition: 'all 0.3s', textDecoration: 'none', fontFamily: 'Inter, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 32px rgba(232,84,26,0.3)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#d94a14'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#E8541A'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        >
          Start with a Free Strategy Call
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </motion.div>
    </section>
  );
}
