'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  PhoneCall,
  Mic,
  Clapperboard,
  CheckCircle2,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type Step = {
  num: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const steps: Step[] = [
  { num: '01', title: 'Strategy Call',    desc: 'Free 45-minute call. We learn your goals, audience, current content situation, and which services fit your stage.',                                Icon: PhoneCall,     iconBg: 'rgba(59,130,246,0.12)', iconColor: '#3b82f6' },
  { num: '02', title: 'Onboarding',       desc: '90-minute recorded session covers your offer, your buyers, your competitors, and the way you already talk about your business. Becomes a brief the whole team works from.', Icon: Mic,           iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6' },
  { num: '03', title: 'We Produce',       desc: 'Editors, writers, designers, and engineers ship video, social posts, blogs, ad creative, websites, and custom software — all to your brand brief.',  Icon: Clapperboard,  iconBg: 'rgba(232,84,26,0.12)', iconColor: '#E8541A' },
  { num: '04', title: 'Review & Refine',  desc: 'You see every deliverable before it ships. Revisions until you are satisfied, no round caps. Every piece scored against your brand brief.',          Icon: CheckCircle2,  iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  { num: '05', title: 'Scale & Iterate',  desc: 'Monthly performance review across every channel. Brand brief refreshed quarterly. Calendar tuned to what is actually working for your business.',     Icon: TrendingUp,    iconBg: 'rgba(245,158,11,0.12)', iconColor: '#f59e0b' },
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
    <section ref={sectionRef} className="process-section" style={{ padding: '96px 56px 100px', position: 'relative', overflow: 'hidden', background: 'var(--cream)' }}>
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
        @media(max-width:700px) { .process-connector { display:none !important; } }

        /* ── Mobile: 2-col compact — all 5 steps visible on one screen ── */
        /* ── Mobile app-UI tightening ──
           Goal: process title + carousel + CTA fit ~one viewport.
           Padding cut by ~30%, headline margin tightened. */
        @media (max-width: 900px) {
          .process-section { padding: 56px 24px 56px !important; }
          .process-eyebrow { margin-bottom: 10px !important; }
          .process-title { font-size: 34px !important; letter-spacing: -1.3px !important; margin-bottom: 24px !important; }
        }
        @media (max-width: 640px) {
          .process-section { padding: 40px 0 44px !important; }
          .process-wrap { padding: 0 18px !important; }
          .process-title { font-size: 28px !important; letter-spacing: -1px !important; margin-bottom: 20px !important; max-width: none !important; }

          /* MOBILE: horizontal scroll-snap carousel.
             5 process steps in a single swipeable strip — ~1.5 cards visible.
             Replaces the 2-col 3-row grid for a more compact, scannable feel. */
          .process-grid {
            display: grid !important;
            grid-auto-flow: column !important;
            grid-template-columns: none !important;
            grid-auto-columns: 64% !important;
            grid-template-rows: 1fr !important;
            gap: 10px !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            padding: 4px 18px 16px !important;
            margin: 0 -18px !important;
          }
          .process-grid::-webkit-scrollbar { display: none !important; }
          .process-grid > * { scroll-snap-align: start !important; min-width: 0 !important; height: auto !important; }

          .process-card {
            padding: 16px 14px 16px !important;
            border-radius: 14px !important;
            height: 100%;
          }
          /* Restore desc — carousel has room for it now */
          .process-card-desc { display: block !important; font-size: 11.5px !important; line-height: 1.55 !important; }
          /* Slightly bigger icon box in the swipe view */
          .process-card .process-icon-box { width: 38px !important; height: 38px !important; border-radius: 10px !important; margin-bottom: 10px !important; }
          .process-card-title { font-size: 14px !important; letter-spacing: -0.2px !important; margin-bottom: 6px !important; }
          .process-cta-wrap { margin-top: 22px !important; padding: 0 18px !important; }
          .process-cta { padding: 12px 22px !important; font-size: 12px !important; min-height: 44px; }

          .process-swipe-cue { display: flex !important; }
        }
        @media (max-width: 380px) {
          .process-title { font-size: 25px !important; }
          .process-card { padding: 14px 12px !important; }
          .process-card-title { font-size: 13px !important; }
          .process-grid { grid-auto-columns: 70% !important; }
        }

        /* Swipe cue — mobile only */
        .process-swipe-cue {
          display: none;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(110,107,99,0.55);
          font-weight: 700;
        }
        .process-swipe-cue .dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(232,84,26,0.55);
          animation: pcue 1.6s ease-in-out infinite;
        }
        .process-swipe-cue .dot:nth-child(2) { animation-delay: 0.2s; }
        .process-swipe-cue .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pcue { 0%,100% { opacity: 0.3 } 50% { opacity: 1 } }
      `}</style>

      <div className="process-wrap">
        <motion.div
          className="process-eyebrow"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#6E6B63', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
          How It Works
        </motion.div>

        <motion.h2
          className="process-title"
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
                <div className="process-icon-box" style={{
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
                  <step.Icon size={20} strokeWidth={1.75} color={step.iconColor} aria-hidden="true" />
                </div>

                {/* Title — fixed size always */}
                <div className="process-card-title" style={{
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
                <div className="process-card-desc" style={{
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

        {/* Swipe hint — mobile only via CSS */}
        <div className="process-swipe-cue" aria-hidden="true">
          <span className="dot" /><span className="dot" /><span className="dot" />
          <span style={{ marginLeft: 6 }}>Swipe steps</span>
        </div>

        {/* CTA */}
        <motion.div
          className="process-cta-wrap"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}
        >
          <button
            type="button"
            data-cursor-hover
            className="process-cta"
            style={{ background: '#E8541A', color: '#fff', padding: '15px 32px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, cursor: 'none', transition: 'all 0.3s', textDecoration: 'none', fontFamily: 'Inter, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 32px rgba(232,84,26,0.3)', border: 'none' }}
            onClick={() => {
              (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#d94a14'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#E8541A'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            Start with a Free Strategy Call
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
