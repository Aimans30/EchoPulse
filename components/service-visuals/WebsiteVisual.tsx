'use client';

import { motion } from 'framer-motion';
import { Lock, CalendarCheck, UserRound, Receipt } from 'lucide-react';
import { EASE } from '@/lib/motion';
import { VisualFrame, useVisual } from './VisualFrame';

/**
 * Websites and funnels: a clinic landing page assembles section by section in
 * the browser, then a Lighthouse-style check runs. The scores are labelled as
 * an example and belong to this mock page, not to any client site.
 */

const FEATURES = [
  { icon: CalendarCheck, label: 'Same-week slots' },
  { icon: UserRound, label: 'One named physio' },
  { icon: Receipt, label: 'Prices up front' },
];
const SCORES = [
  { label: 'Performance', value: 98 },
  { label: 'Accessibility', value: 100 },
  { label: 'Best practices', value: 100 },
  { label: 'SEO', value: 100 },
];

// 0 nav, 1 hero, 2 features, 3 speed check, 4 ready
const DURATIONS = [900, 1100, 1300, 2400, 4000] as const;
const STATUS = ['Building', 'Building', 'Building', 'Page check', 'Ready to launch'];

export default function WebsiteVisual({ accent }: { accent: string }) {
  const v = useVisual(DURATIONS);
  const { step } = v;
  const show = (at: number) => ({
    initial: v.reduce ? false : ({ opacity: 0, y: 10 } as const),
    animate: step >= at ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    transition: { duration: 0.5, ease: EASE.out },
  });

  return (
    <VisualFrame
      accent={accent}
      frameRef={v.ref}
      title="yourclinic.com"
      icon={<Lock size={13} strokeWidth={2.2} />}
      status={STATUS[step]}
      statusDone={step === 4}
      flush
      label="A clinic landing page assembling section by section in a browser, followed by an example speed and quality check."
    >
      <div className="wb">
        <div className="wb-page" key={v.cycle}>
          <motion.div className="wb-nav" {...show(0)}>
            <span className="wb-logo"><i />Your Clinic</span>
            <span className="wb-links"><i /><i /><i /></span>
            <span className="wb-nav-btn">Book</span>
          </motion.div>

          <motion.div className="wb-hero" {...show(1)}>
            <span className="wb-eyebrow">Sports and back pain physio</span>
            <span className="wb-h1">Same-week physio, booked in two minutes.</span>
            <span className="wb-sub"><i style={{ width: '88%' }} /><i style={{ width: '64%' }} /></span>
            <span className="wb-ctas">
              <span className="wb-btn">Book a visit</span>
              <span className="wb-btn wb-btn-ghost">See prices</span>
            </span>
          </motion.div>

          <motion.div className="wb-features" {...show(2)}>
            {FEATURES.map((f) => (
              <span key={f.label} className="wb-feature">
                <f.icon size={14} strokeWidth={2} />
                <span>{f.label}</span>
              </span>
            ))}
          </motion.div>

        </div>

        <motion.div
          className="wb-check"
          initial={v.reduce ? false : { opacity: 0, y: 16 }}
          animate={step >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: EASE.out }}
        >
          <div className="wb-check-head">
            <span className="sv-label">Page check</span>
            <span className="wb-example">Example run</span>
          </div>
          <div className="wb-rings">
            {SCORES.map((s, i) => (
              <Ring key={`${v.cycle}-${s.label}`} label={s.label} value={s.value} run={step >= 3} reduce={v.reduce} delay={i * 0.15} />
            ))}
          </div>
        </motion.div>
      </div>
      <style>{CSS}</style>
    </VisualFrame>
  );
}

function Ring({ label, value, run, reduce, delay }: { label: string; value: number; run: boolean; reduce: boolean; delay: number }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const on = run || reduce;
  return (
    <span className="wb-ring">
      <span className="wb-ring-dial">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <motion.circle
            cx="20" cy="20" r={r}
            fill="none" stroke="var(--acc)" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={c}
            initial={reduce ? false : { strokeDashoffset: c }}
            animate={{ strokeDashoffset: on ? c * (1 - value / 100) : c }}
            transition={{ duration: 1.1, delay, ease: EASE.out }}
            transform="rotate(-90 20 20)"
          />
        </svg>
        <motion.span
          className="wb-ring-n"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: 0.3, delay: delay + 0.6 }}
        >
          {value}
        </motion.span>
      </span>
      <span className="wb-ring-l">{label}</span>
    </span>
  );
}

const CSS = `
.wb { position: relative; height: 100%; background: #1B1A17; color: var(--ink); overflow: hidden; }
.wb-page { padding: 12px 20px; display: flex; flex-direction: column; gap: 14px; }
.wb-nav { display: flex; align-items: center; gap: 16px; height: 28px; }
.wb-logo { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; }
.wb-logo i { width: 16px; height: 16px; border-radius: 5px; background: var(--acc); }
.wb-links { flex: 1; display: flex; justify-content: flex-end; gap: 12px; min-width: 0; }
.wb-links i { width: 32px; height: 5px; border-radius: 3px; background: rgba(242,238,231,0.14); }
.wb-nav-btn { flex: none; height: 26px; padding: 0 12px; display: grid; place-items: center; border-radius: 999px; font-size: 11.5px; font-weight: 600; color: #0C0C0B; background: var(--ink); }
.wb-hero { display: flex; flex-direction: column; gap: 8px; padding: 4px 0 0; }
.wb-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--acc); }
.wb-h1 { font-size: 20px; font-weight: 800; line-height: 1.15; letter-spacing: -0.025em; max-width: 15em; }
.wb-sub { display: flex; flex-direction: column; gap: 7px; margin-top: 2px; }
.wb-sub i { display: block; height: 6px; border-radius: 3px; background: rgba(242,238,231,0.12); }
.wb-ctas { display: flex; gap: 8px; margin-top: 6px; }
.wb-btn { height: 30px; padding: 0 14px; display: grid; place-items: center; border-radius: 999px; font-size: 12px; font-weight: 600; color: #0C0C0B; background: var(--acc); white-space: nowrap; }
.wb-btn-ghost { color: var(--ink); background: transparent; box-shadow: inset 0 0 0 1px rgba(242,238,231,0.2); }
.wb-features { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.wb-feature {
  display: flex; flex-direction: column; gap: 8px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  box-shadow: inset 0 0 0 1px var(--border);
  font-size: 11.5px; font-weight: 600; line-height: 1.25;
}
.wb-feature svg { color: var(--acc); }
.wb-check {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 10px 20px 12px;
  background: #121210;
  border-top: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 -12px 32px rgba(0,0,0,0.35);
  color: var(--ink);
}
.wb-check-head { display: flex; align-items: center; justify-content: space-between; }
.wb-example { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--faint); }
.wb-rings { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; margin-top: 6px; }
.wb-ring { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 0; }
.wb-ring-dial { position: relative; width: 40px; height: 40px; }
.wb-ring-n { position: absolute; inset: 0; display: grid; place-items: center; font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; }
.wb-ring-l { font-size: 10.5px; color: var(--muted); text-align: center; line-height: 1.25; white-space: nowrap; }
`;
