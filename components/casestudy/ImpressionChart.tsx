'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import type { CaseStudyChart } from '@/lib/caseStudyData';

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * prefers-reduced-motion as an external store rather than as state written
 * from inside an effect.
 *
 * The obvious version of this reads matchMedia in a useEffect and calls
 * setState, which is what components/icp/Reveal.tsx does and what the
 * react-hooks/set-state-in-effect rule flags: it forces a second render pass on
 * every mount, and it also misses the case where someone changes the setting
 * while the page is open. useSyncExternalStore subscribes to the query
 * properly, and its third argument is the server snapshot, which has to be
 * false so the markup React renders on the server matches the first client
 * render and hydration does not warn.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCE_QUERY);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false,
  );
}

/**
 * The daily impressions chart.
 *
 * This is the most persuasive element on a case study page, so it is built to
 * be trustworthy rather than impressive: one value per day straight from the
 * export, no smoothing, no truncated axis, no window cropped to start at a
 * convenient low point. The flat stretch on the left is left flat.
 *
 * WHY THE TEXT IS HTML AND NOT SVG
 *
 * The plot needs to stretch to fill whatever width it is given while keeping a
 * usable height, which means preserveAspectRatio="none" and non-uniform
 * scaling. That is fine for a path and ruinous for type: on a 320px phone the
 * horizontal scale factor is about 0.3 against a vertical factor of 0.8, so any
 * <text> inside the same SVG gets squashed to roughly a third of its width and
 * turns into a smear. So the SVG carries geometry only, and every label is an
 * absolutely positioned HTML element sharing the same percentage coordinate
 * space. Labels stay crisp and correctly proportioned at every viewport, and
 * they are selectable and readable by a screen reader as real text.
 *
 * The whole thing is server-rendered. The only client-side work is the reveal
 * animation, skipped entirely under reduced motion.
 */

// Plot-area geometry, in viewBox units. Only the path lives in here.
const W = 1000;
const H = 300;

export default function ImpressionChart({ chart }: { chart: CaseStudyChart }) {
  const { daily, launchIndex, launchLabel, beforeLabel, monthTicks, yTicks, ariaLabel } = chart;

  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [seen, setSeen] = useState(false);
  // SVG ids are document-global. Two charts on one page (the hub will have
  // that the moment a second study lands) would otherwise both define a
  // gradient called csFill and the second would silently win.
  const fillId = `csFill-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    // Nothing to observe when motion is off: the chart is drawn on first paint
    // via `drawn` below, so there is no state to set here at all.
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  // Derived, not stored.
  const drawn = seen || reduced;

  const n = daily.length;
  const mx = Math.max(...daily);

  const x = (i: number) => (i / (n - 1)) * W;
  const y = (v: number) => H - (v / mx) * H;

  const line = daily.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${W},${H} L0,${H} Z`;

  /** Horizontal position of a day index, as a percentage of the plot width. */
  const pct = (i: number) => `${((i / (n - 1)) * 100).toFixed(3)}%`;
  const launchPct = pct(launchIndex);

  // The launch label flips to the left of the marker when the marker sits in
  // the right half, so it can never run off the edge of the plot.
  const launchOnRight = launchIndex / (n - 1) > 0.5;

  return (
    <div className="cs-ch" ref={ref}>
      <div className="cs-ch-plot" role="img" aria-label={ariaLabel}>
        {/* Gridlines. HTML rather than SVG so the 1px rule stays 1px instead
            of being scaled by the same non-uniform transform as the path. */}
        {yTicks.map((t) => (
          <div className="cs-ch-grid" key={t.label} style={{ bottom: `${t.frac * 100}%` }}>
            <span className="cs-ch-ytick">{t.label}</span>
          </div>
        ))}

        {/* Shaded "before" band. The axis and the scale are identical either
            side of the marker; only the background changes. */}
        <div className="cs-ch-before" style={{ width: launchPct }} />

        <div className={drawn ? 'cs-ch-wipe is-in' : 'cs-ch-wipe'} aria-hidden="true">
          <div className="cs-ch-wipe-inner">
            <svg
              className="cs-ch-svg"
              viewBox={`0 0 ${W} ${H}`}
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8541A" stopOpacity="0.42" />
                  <stop offset="100%" stopColor="#E8541A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill={`url(#${fillId})`} />
              <path
                d={line}
                fill="none"
                stroke="#E8541A"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                // Keeps the stroke 2px regardless of the non-uniform scale.
                // Without it the line thins out as the chart gets narrower.
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>

        <div className="cs-ch-marker" style={{ left: launchPct }} aria-hidden="true" />
        <span
          className={`cs-ch-launch ${launchOnRight ? 'is-left' : 'is-right'}`}
          style={{ left: launchPct }}
        >
          {launchLabel}
        </span>
        <span
          className={`cs-ch-before-label ${launchOnRight ? 'is-right' : 'is-left'}`}
          style={{ left: launchPct }}
        >
          {beforeLabel}
        </span>
      </div>

      <div className="cs-ch-axis" aria-hidden="true">
        {monthTicks.map((m) => (
          <span key={m.label} style={{ left: pct(m.index) }}>
            {m.label}
          </span>
        ))}
      </div>

      <style>{`
        .cs-ch { width: 100%; }
        .cs-ch-plot { position: relative; height: 300px; width: 100%; }
        .cs-ch-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; overflow: visible; }

        .cs-ch-grid { position: absolute; left: 0; right: 0; height: 1px; background: rgba(242,238,231,0.10); }
        .cs-ch-ytick { position: absolute; left: 4px; bottom: 4px; font-family: ui-monospace, monospace; font-size: 11px; line-height: 1; color: rgba(242,238,231,0.42); }

        .cs-ch-before { position: absolute; top: 0; bottom: 0; left: 0; background: rgba(242,238,231,0.03); }

        .cs-ch-marker { position: absolute; top: 0; bottom: 0; width: 0; border-left: 1.5px dashed rgba(242,238,231,0.75); }
        .cs-ch-marker::before { content: ""; position: absolute; top: -4px; left: -4.5px; width: 8px; height: 8px; border-radius: 50%; background: #F2EEE7; }

        .cs-ch-launch { position: absolute; top: 2px; font-family: Inter, sans-serif; font-size: 12.5px; font-weight: 700; line-height: 1.2; color: #F2EEE7; white-space: nowrap; }
        .cs-ch-launch.is-right { transform: translateX(10px); }
        .cs-ch-launch.is-left { transform: translateX(calc(-100% - 10px)); }

        .cs-ch-before-label { position: absolute; top: 2px; font-family: Inter, sans-serif; font-size: 12.5px; line-height: 1.2; color: rgba(242,238,231,0.5); white-space: nowrap; }
        .cs-ch-before-label.is-left { transform: translateX(calc(-100% - 10px)); }
        .cs-ch-before-label.is-right { transform: translateX(10px); }

        .cs-ch-axis { position: relative; height: 18px; margin-top: 6px; }
        .cs-ch-axis span { position: absolute; top: 0; font-family: ui-monospace, monospace; font-size: 11px; line-height: 1; color: rgba(242,238,231,0.42); }

        /* Reveal. A left-to-right wipe so the curve builds in date order,
           which is the order the story happened in. Two opposing transforms:
           the window slides in from the left while the plot inside slides the
           other way, so only transform animates. */
        .cs-ch-wipe { position: absolute; inset: 0; overflow: hidden; transform: translate3d(-100%,0,0); }
        .cs-ch-wipe-inner { position: absolute; inset: 0; transform: translate3d(100%,0,0); }
        .cs-ch-wipe.is-in, .cs-ch-wipe.is-in .cs-ch-wipe-inner { transform: none; transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1); }

        @media (prefers-reduced-motion: reduce) {
          .cs-ch-wipe, .cs-ch-wipe-inner { transform: none !important; transition: none !important; }
        }

        @media (max-width: 720px) {
          .cs-ch-plot { height: 220px; }
          .cs-ch-launch, .cs-ch-before-label, .cs-ch-axis span, .cs-ch-ytick { font-size: 12px; }
          /* On a narrow screen the full marker label does not fit beside the
             line, so it drops to the short form and the "before" caption is
             hidden rather than allowed to collide with it. */
          .cs-ch-before-label { display: none; }
        }
      `}</style>
    </div>
  );
}
