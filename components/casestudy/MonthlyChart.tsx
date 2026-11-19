'use client';

import { useState } from 'react';
import type { CaseStudyMonth } from '@/lib/caseStudyData';
import { useInViewOnce, usePrefersReducedMotion } from './motion';

/**
 * Average daily impressions per month, as columns. Every column is a real
 * button: hover, tap or focus shows that month's total, daily average and
 * what was happening, read straight from the month table. The latest month
 * is selected by default so a phone reader sees a filled tooltip without
 * having to discover the interaction.
 *
 * Columns grow with scaleY from the baseline, once, when scrolled into view.
 */

const parse = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export default function MonthlyChart({ months, caption }: { months: CaseStudyMonth[]; caption: string }) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>(0.25);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(months.length - 1);
  const values = months.map((m) => parse(m.perDay));
  const max = Math.max(...values, 1);
  const grown = seen || reduced;
  const m = months[active];
  const n = months.length;
  // Keep the tooltip inside the chart: anchor left, centre or right by column.
  const align = active < 2 ? 'start' : active > n - 3 ? 'end' : 'center';

  return (
    <figure className="cs-mc">
      <div ref={ref} className={`cs-mc-chart${grown ? ' is-grown' : ''}`}>
        <div
          className={`cs-mc-tip cs-mc-tip-${align}`}
          style={{ left: `${((active + 0.5) / n) * 100}%` }}
          aria-live="polite"
        >
          <span className="cs-mc-tip-month">{m.month}</span>
          <span className="cs-mc-tip-value">
            {m.perDay} <small>a day</small>
          </span>
          <span className="cs-mc-tip-total">{m.impressions} impressions in the month</span>
          <span className="cs-mc-tip-note">{m.note}</span>
        </div>
        <ol className="cs-mc-cols">
          {months.map((mo, i) => {
            const h = Math.max((values[i] / max) * 100, 0.6);
            return (
              <li key={mo.month}>
                <button
                  type="button"
                  className={`cs-mc-col${i === active ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  aria-label={`${mo.month}: ${mo.perDay} impressions a day, ${mo.impressions} in the month. ${mo.note}.`}
                >
                  <span className="cs-mc-bar-wrap" aria-hidden="true">
                    <span
                      className="cs-mc-bar"
                      style={{ height: `${h}%`, transitionDelay: reduced ? undefined : `${i * 0.06}s` }}
                    />
                  </span>
                  <span className="cs-mc-label" aria-hidden="true">
                    {mo.month.slice(0, 3)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption className="cs-caption">{caption}</figcaption>
    </figure>
  );
}
