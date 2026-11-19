'use client';

import { useId } from 'react';
import type { CaseStudyMonth } from '@/lib/caseStudyData';
import { useInViewOnce, usePrefersReducedMotion } from './motion';

/**
 * The hero chart for a measured engagement: average daily impressions per
 * month, drawn straight from the month table. The flat months on the left
 * stay flat, the y axis starts at zero, and the first and last values are
 * printed on the chart so the claim can be read without hovering anything.
 *
 * The draw-in is a wipe built from two opposing translateX transforms (the
 * window slides right while the plot inside it slides left by the same
 * amount), so it animates on the compositor and never touches layout.
 */

const W = 1000;
const H = 400;
const TOP = 30;

const parse = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/** Monotone cubic through the points: smooth, but never overshoots the data. */
function monotonePath(pts: [number, number][]) {
  const n = pts.length;
  if (n < 2) return '';
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0]);
    m.push((pts[i + 1][1] - pts[i][1]) / dx[i]);
  }
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${pts[i][0] + h},${pts[i][1] + t[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - t[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

export default function HeroCurve({
  months,
  startIndex,
  launchIndex,
  launchLabel,
  startValue,
  endValue,
  startCaption,
  endCaption,
  ariaLabel,
}: {
  startValue: string;
  endValue: string;
  months: CaseStudyMonth[];
  /** The month labelled as the starting point (the floor). */
  startIndex: number;
  /** The month the change shipped in; a marker is drawn at its start. */
  launchIndex: number;
  launchLabel: string;
  startCaption: string;
  endCaption: string;
  ariaLabel: string;
}) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>(0.1, '0px');
  const reduced = usePrefersReducedMotion();
  const drawn = seen || reduced;
  const gid = `hc-${useId().replace(/:/g, '')}`;

  const values = months.map((m) => parse(m.perDay));
  const max = Math.max(...values, 1);
  const yMax = Math.ceil(max / 1000) * 1000;
  const n = values.length;
  const xs = values.map((_, i) => (i / (n - 1)) * W);
  const ys = values.map((v) => H - (v / yMax) * (H - TOP));
  const pts = values.map((_, i) => [xs[i], ys[i]] as [number, number]);
  const line = monotonePath(pts);
  const area = `${line} L${W},${H} L0,${H} Z`;
  const launchX = (xs[launchIndex - 1] + xs[launchIndex]) / 2 + (xs[launchIndex] - xs[launchIndex - 1]) * 0.08;

  const pct = (x: number) => `${(x / W) * 100}%`;
  const pcty = (y: number) => `${(y / H) * 100}%`;
  const last = n - 1;
  const short = (m: string) => m.slice(0, 3);
  const ticks = [0, 0.5, 1].map((f) => ({ f, label: f === 0 ? '0' : `${((yMax * f) / 1000).toLocaleString('en-US')}K` }));

  return (
    <div ref={ref} className={`cs-hc${drawn ? ' is-drawn' : ''}${reduced ? ' is-static' : ''}`} role="img" aria-label={ariaLabel}>
      <div className="cs-hc-plot">
        {ticks.map((t) => (
          <span key={t.f} className="cs-hc-grid" style={{ top: pcty(H - t.f * (H - TOP)) }} aria-hidden="true">
            <em>{t.label}</em>
          </span>
        ))}
        <div className="cs-hc-wipe" aria-hidden="true">
          <div className="cs-hc-inner">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="cs-hc-svg">
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#E8541A" stopOpacity="0.42" />
                  <stop offset="1" stopColor="#E8541A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill={`url(#${gid})`} />
              <path d={line} fill="none" stroke="#E8541A" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <span className="cs-hc-launch" style={{ left: pct(launchX) }} aria-hidden="true">
          <em>{launchLabel}</em>
        </span>
        {values.map((v, i) => (
          <span
            key={months[i].month}
            className={`cs-hc-dot${i === startIndex || i === last ? ' is-key' : ''}`}
            style={{ left: pct(xs[i]), top: pcty(ys[i]), transitionDelay: reduced ? undefined : `${0.9 + (i / n) * 0.9}s` }}
            aria-hidden="true"
          />
        ))}
        <span className="cs-hc-label cs-hc-label-start" style={{ left: pct(xs[startIndex]), top: pcty(ys[startIndex]) }} aria-hidden="true">
          <strong>{startValue}</strong>
          <small>{startCaption}</small>
        </span>
        <span className="cs-hc-label cs-hc-label-end" style={{ left: pct(xs[last]), top: pcty(ys[last]) }} aria-hidden="true">
          <strong>{endValue}</strong>
          <small>{endCaption}</small>
        </span>
      </div>
      <div className="cs-hc-axis" aria-hidden="true">
        {months.map((m, i) => (
          <span key={m.month} style={{ left: pct(xs[i]) }}>
            {short(m.month)}
          </span>
        ))}
      </div>
    </div>
  );
}
