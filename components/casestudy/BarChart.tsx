'use client';

import type { CaseStudyBars } from '@/lib/caseStudyData';
import { useInViewOnce, usePrefersReducedMotion } from './motion';

/**
 * Small horizontal bar chart. Each bar is a list item so the label and the
 * displayed value are real text; the drawn bar is decorative. Bar length is
 * value / max of the series, and the bars grow from the left with scaleX the
 * first time the chart is scrolled into view.
 */
export default function BarChart({ data }: { data: CaseStudyBars }) {
  const [ref, seen] = useInViewOnce<HTMLElement>(0.3);
  const reduced = usePrefersReducedMotion();
  const max = Math.max(...data.items.map((i) => i.value), 0) || 1;
  return (
    <figure ref={ref} className={`cs-bars${seen || reduced ? ' is-grown' : ''}`}>
      <h3 className="cs-bars-title">{data.title}</h3>
      <ul className="cs-bars-list">
        {data.items.map((it, i) => (
          <li className="cs-bars-row" key={it.label}>
            <span className="cs-bars-label">{it.label}</span>
            <span className="cs-bars-track" aria-hidden="true">
              <span
                className="cs-bars-fill"
                style={{
                  width: `${Math.max((it.value / max) * 100, 0.8)}%`,
                  transitionDelay: reduced ? undefined : `${i * 0.08}s`,
                }}
              />
            </span>
            <span className="cs-bars-val">{it.display}</span>
          </li>
        ))}
      </ul>
      <figcaption className="cs-caption">{data.caption}</figcaption>
    </figure>
  );
}
