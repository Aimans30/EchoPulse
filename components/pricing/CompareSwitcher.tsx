'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { DUR, EASE } from '@/lib/motion';

export interface SwitcherPlan {
  key: string;
  name: string;
  /** Segment label. Short enough for four segments at 360px. */
  short: string;
  price: string;
}

export interface SwitcherRow {
  label: string;
  cells: string[];
}

/**
 * The comparison table for phones: a segmented control picks one plan and
 * the panel lists every row for that plan. Nothing is squeezed and nothing
 * scrolls sideways. Same rows as the desktop table (passed in from the page).
 *
 * WAI-ARIA tabs: arrow keys, Home and End move between plans.
 */
export default function CompareSwitcher({
  plans,
  rows,
  initial = 1,
}: {
  plans: SwitcherPlan[];
  rows: SwitcherRow[];
  initial?: number;
}) {
  const [active, setActive] = useState(initial);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (to: number) => {
    const n = (to + plans.length) % plans.length;
    setActive(n);
    tabs.current[n]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(active + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); move(active - 1); }
    else if (e.key === 'Home') { e.preventDefault(); move(0); }
    else if (e.key === 'End') { e.preventDefault(); move(plans.length - 1); }
  };

  const plan = plans[active];

  return (
    <MotionConfig reducedMotion="user">
      <div className="ppg-sw">
        <div className="ppg-sw-tabs" role="tablist" aria-label="Choose a plan to compare" onKeyDown={onKey}>
          {plans.map((p, i) => (
            <button
              key={p.key}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`${base}-tab-${p.key}`}
              aria-selected={i === active}
              aria-controls={`${base}-panel`}
              aria-label={`${p.name}, ${p.price}`}
              tabIndex={i === active ? 0 : -1}
              className="ppg-sw-tab"
              onClick={() => setActive(i)}
            >
              {i === active && (
                <motion.span
                  layoutId={`${base}-pill`}
                  className="ppg-sw-pill"
                  transition={{ duration: DUR.sm, ease: EASE.out }}
                  aria-hidden="true"
                />
              )}
              <span className="ppg-sw-name">{p.short}</span>
              <span className="ppg-sw-price">{p.price}</span>
            </button>
          ))}
        </div>

        <div
          className="ppg-sw-panel"
          role="tabpanel"
          id={`${base}-panel`}
          aria-labelledby={`${base}-tab-${plan.key}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.dl
              key={plan.key}
              className="ppg-sw-list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.xs, ease: EASE.out }}
            >
              {rows.map((r) => {
                const value = r.cells[active];
                return (
                  <div key={r.label} className="ppg-sw-row" data-none={value === 'None' ? '' : undefined}>
                    <dt>{r.label}</dt>
                    <dd>{value}</dd>
                  </div>
                );
              })}
            </motion.dl>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
