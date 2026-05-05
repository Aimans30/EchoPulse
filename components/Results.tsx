'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const statGroups = [
  [
    { num: 4.2, dec: 1, prefix: '$', suffix: 'M+', label: 'Revenue Generated for Clients', sub: 'Across all campaigns, 2024–2025' },
    { num: 312, dec: 0, suffix: '%', label: 'Average Client ROI in 90 Days', sub: 'Measured from onboarding date' },
    { num: 80, dec: 0, prefix: '$', suffix: 'K+', label: 'Average Course Launch Revenue', sub: 'With our pre-launch content system' },
  ],
  [
    { num: 50, dec: 0, suffix: 'M+', label: 'Total Content Views Generated', sub: 'Across TikTok, IG & YouTube' },
    { num: 500, dec: 0, suffix: '+', label: 'Videos Produced', sub: 'Short-form, long-form & branded' },
    { num: 340, dec: 0, suffix: '%', label: 'Average Engagement Increase', sub: 'Within first 60 days' },
  ],
  [
    { num: 94, dec: 0, suffix: '%', label: 'Client Retention Rate', sub: 'Month-over-month average' },
    { num: 98, dec: 0, suffix: '%', label: 'Satisfaction Score', sub: 'Based on post-project surveys' },
    { num: 4.9, dec: 1, suffix: '★', label: 'Average Client Rating', sub: 'Across all service lines' },
  ],
  [
    { num: 200, dec: 0, suffix: '+', label: 'Clients Served Globally', sub: 'Coaches, brands & creators' },
    { num: 12, dec: 0, suffix: '', label: 'Countries Reached', sub: 'From USA to Singapore' },
    { num: 22, dec: 0, suffix: ' days', label: 'Average Time to First Results', sub: 'From kickoff to measurable growth' },
  ],
];

const caseStudies = [
  { num: '10x', title: 'Follower Growth in 90 Days', desc: 'A personal brand coach grew from 2K to 22K Instagram followers after 3 months with EchoPulse.' },
  { num: '$80K', title: 'Course Launch Revenue in 7 Days', desc: 'Online educator used our pre-launch content system to generate $80K in their biggest launch ever.' },
  { num: '47%', title: 'Lower Client Acquisition Cost', desc: 'Replaced paid ads with content-led lead gen — saving $4,000/month while booking more strategy calls.' },
];

const CYCLE_MS = 3600;

function StatCard({ group, entryDelay, cycleOffset }: {
  group: typeof statGroups[0];
  entryDelay: number;
  cycleOffset: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [activeIdx, setActiveIdx] = useState(0);
  const [displayVal, setDisplayVal] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const entryDoneRef = useRef(false);

  const countTo = useCallback((target: number, fast = false) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const duration = fast ? 0 : 1300;
    if (duration === 0) { setDisplayVal(target); return; }
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayVal(target * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Count up only on first entry
  useEffect(() => {
    if (!inView || entryDoneRef.current) return;
    entryDoneRef.current = true;
    const t = setTimeout(() => countTo(group[0].num), entryDelay);
    return () => clearTimeout(t);
  }, [inView, countTo, group, entryDelay]);

  // Cycle stats — just swap the number instantly, let crossfade handle the transition
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      const id = setInterval(() => {
        setActiveIdx(prev => {
          const next = (prev + 1) % group.length;
          setDisplayVal(group[next].num);
          return next;
        });
      }, CYCLE_MS);
      return () => clearInterval(id);
    }, entryDelay + cycleOffset + 800);
    return () => clearTimeout(t);
  }, [inView, group, entryDelay, cycleOffset]);

  const current = group[activeIdx];

  const fmt = (val: number) => {
    const n = current.dec > 0 ? val.toFixed(current.dec) : Math.round(val).toString();
    return `${current.prefix ?? ''}${n}${current.suffix ?? ''}`;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: entryDelay / 1000, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '18px',
        padding: '40px 36px 36px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'background 0.3s',
      }}
      whileHover={{ background: 'rgba(255,255,255,0.065)' as any }}
    >
      {/* Subtle corner glow */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle at top right, rgba(232,84,26,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Progress segments */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '36px' }}>
        {group.map((_, i) => (
          <div
            key={i}
            style={{
              height: '2px',
              flex: 1,
              borderRadius: '2px',
              background: i === activeIdx ? '#E8541A' : 'rgba(255,255,255,0.1)',
              transition: 'background 0.4s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {i === activeIdx && (
              <motion.div
                key={`${activeIdx}-${i}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                style={{
                  position: 'absolute', inset: 0,
                  background: '#ff7a4a',
                  transformOrigin: 'left',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Cycling content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          {/* Big number */}
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(46px, 5.5vw, 82px)',
            fontWeight: 900,
            letterSpacing: '-3px',
            color: '#F2EEE7',
            lineHeight: 1,
            marginBottom: '18px',
          }}>
            {fmt(displayVal)}
          </div>

          {/* Label */}
          <div style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'rgba(242,238,231,0.65)',
            letterSpacing: '-0.1px',
            lineHeight: 1.4,
            marginBottom: '6px',
          }}>
            {current.label}
          </div>

          {/* Sub-label */}
          <div style={{
            fontSize: '10px',
            color: 'rgba(242,238,231,0.22)',
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}>
            {current.sub}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot nav */}
      <div style={{ display: 'flex', gap: '5px', marginTop: '28px' }}>
        {group.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIdx ? '16px' : '5px',
              height: '5px',
              borderRadius: '3px',
              background: i === activeIdx ? '#E8541A' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function Results() {
  return (
    <section id="results" data-dark-bg="true" style={{ padding: '128px 56px', background: '#0C0C0B' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.28)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}
      >
        <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
        Results
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(40px, 5.5vw, 80px)', fontWeight: 900, letterSpacing: '-3px', color: '#F2EEE7', maxWidth: '620px', margin: '0 0 72px', lineHeight: 1.05 }}
      >
        Numbers that<br />
        actually <span style={{ color: '#E8541A' }}>matter.</span>
      </motion.h2>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }} className="results-grid">
        {statGroups.map((group, i) => (
          <StatCard
            key={i}
            group={group}
            entryDelay={i * 120}
            cycleOffset={i * 900}
          />
        ))}
      </div>

      {/* Case study rows */}
      <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {caseStudies.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ x: 6, background: 'rgba(255,255,255,0.06)' as any }}
            className="case-row"
            style={{ display: 'flex', alignItems: 'center', gap: '48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '32px 44px', transition: 'background 0.3s, transform 0.3s', cursor: 'default' }}
          >
            <div className="case-num" style={{ fontFamily: 'Inter, sans-serif', fontSize: '42px', fontWeight: 800, letterSpacing: '-2px', color: '#E8541A', minWidth: '130px' }}>
              {c.num}
            </div>
            <div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 700, color: '#F2EEE7', marginBottom: '5px', letterSpacing: '-0.3px' }}>
                {c.title}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(242,238,231,0.38)', lineHeight: 1.5 }}>
                {c.desc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1200px) { .results-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px) { .results-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px) { .case-row { flex-direction: column !important; gap: 12px !important; padding: 24px 20px !important; } }
        @media (max-width: 640px) { .case-num { font-size: 32px !important; min-width: unset !important; } }
      `}</style>
    </section>
  );
}
