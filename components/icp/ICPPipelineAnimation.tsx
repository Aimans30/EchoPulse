'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * The ICP hero animation — one shared component, configured per audience.
 *
 * ─── The story it tells, in one continuous loop ──────────────────────────────
 *
 *   1. You record once            (the single input)
 *   2. EchoPulse produces         (the studio, working)
 *   3. Four real artifacts appear (mini-previews of the actual deliverables)
 *   4. Those compound into results (a rising chart, labelled with the outcome
 *      chain for this audience)
 *
 * The last stage is the point of the whole thing. Naming a deliverable is
 * abstract; showing it turn into a rising result curve is not. The bars carry
 * NO numbers — they show direction and compounding, never a fabricated metric,
 * because we have real work but no published client results yet and a made-up
 * "+312%" dies on the first call. The per-channel counts ARE real (Growth
 * retainer commitments); the result curve is honestly unlabelled.
 *
 * ─── Motion language (Apple-clean) ───────────────────────────────────────────
 *
 * One flat cubic curve, no overshoot, no bounce. Everything overlaps slightly
 * so the eye is always led forward rather than watching discrete steps. Only
 * opacity / transform / width animate — the frame never reflows or resizes.
 * A signal packet physically travels input → studio → outputs so the viewer
 * follows the flow of value, not just a list lighting up.
 */

export type ArtifactKind = 'post' | 'reel' | 'video' | 'doc' | 'ad' | 'funnel' | 'mail' | 'site';

export interface PipelineConfig {
  input: { label: string; detail: string };
  outputs: { label: string; benefit: string; count: string; kind: ArtifactKind }[];
  outcomes: [string, string, string];
}

// Timeline (each ~= one beat):
//  0 input · 1 studio · 2-5 outputs cascade · 6 result rises · 7 result peak · 8 hold
const STAGES = 9;
const STAGE_MS = 780;
// Typed as a MUTABLE 4-tuple on purpose. `as const` would make it
// `readonly [...]`, which framer-motion's `ease` (BezierDefinition =
// [number, number, number, number]) will not accept — that fails the
// production type-check at every usage even though dev mode is fine.
const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

export default function ICPPipelineAnimation({
  accent,
  config,
  alt,
}: {
  accent: string;
  config: PipelineConfig;
  alt: string;
}) {
  const [stage, setStage] = useState(0);
  const [reduced, setReduced] = useState(false);
  // Starts true so the very first frames animate identically to before even
  // if the observer has not reported yet.
  const [inView, setInView] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);

  /**
   * The stage clock only runs while the animation is actually on screen.
   *
   * This lives in the hero of five outreach pages, so it scrolls out of view
   * within a second or two and never comes back. Left alone, the interval kept
   * firing a React state update every 780ms for the rest of the session, and
   * each one re-rendered roughly twenty framer-motion nodes. On a mid-range
   * phone that is continuous main-thread work competing with the scroll the
   * visitor is actually doing. Nothing visual changes: an animation nobody can
   * see is the only thing that stops.
   */
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReduced(true);
      setStage(STAGES - 1);
      return;
    }
    if (!inView) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES), STAGE_MS);
    return () => clearInterval(id);
  }, [inView]);

  const on = (from: number) => reduced || stage >= from;
  const shownOutputs = reduced ? 4 : Math.max(0, Math.min(4, stage - 1));
  const producing = !reduced && stage >= 1 && stage <= 5;
  const resultLevel = reduced ? 1 : stage >= 7 ? 1 : stage >= 6 ? 0.62 : 0;

  return (
    <div className="pa-frame" ref={frameRef} role="img" aria-label={alt}>
      {/* soft ambient glow that breathes with production */}
      <motion.div
        className="pa-glow"
        aria-hidden="true"
        style={{ background: `radial-gradient(ellipse 60% 45% at 50% 22%, ${accent}22, transparent 70%)` }}
        animate={reduced ? {} : { opacity: producing ? [0.5, 0.9, 0.5] : 0.4 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── 1. Input ──────────────────────────────────────────────────── */}
      <motion.div
        className="pa-input"
        initial={false}
        animate={{ opacity: on(0) ? 1 : 0.3 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <motion.span
          className="pa-input-dot"
          style={{ background: accent }}
          animate={reduced ? {} : { boxShadow: [`0 0 0 0 ${accent}66`, `0 0 0 8px ${accent}00`] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
        <span className="pa-input-copy">
          <strong>{config.input.label}</strong>
          <em>{config.input.detail}</em>
        </span>
      </motion.div>

      <Rail active={on(1)} accent={accent} sending={producing} reduced={reduced} />

      {/* ── 2. The studio ────────────────────────────────────────────── */}
      <motion.div
        className="pa-hub"
        initial={false}
        animate={{
          opacity: on(1) ? 1 : 0.25,
          borderColor: on(1) ? `${accent}66` : 'rgba(255,255,255,0.10)',
        }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className="pa-hub-mark">
          <motion.span
            className="pa-hub-ring"
            style={{ borderTopColor: accent }}
            animate={producing ? { rotate: 360 } : { rotate: 0 }}
            transition={producing ? { duration: 1.05, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
          />
          <span className="pa-hub-core" style={{ background: accent }} />
        </span>
        EchoPulse produces everything
      </motion.div>

      <Rail active={shownOutputs > 0} accent={accent} sending={producing} reduced={reduced} fan />

      {/* ── 3. Four real artifacts ───────────────────────────────────── */}
      <div className="pa-outputs">
        {config.outputs.map((o, i) => {
          const live = i < shownOutputs;
          return (
            <motion.div
              key={o.label}
              className="pa-out"
              initial={false}
              animate={{
                opacity: live ? 1 : 0,
                x: live ? 0 : -10,
                borderColor: live ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0)',
              }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Artifact kind={o.kind} accent={accent} live={live} />
              <span className="pa-out-copy">
                <strong>{o.label}</strong>
                <em>{o.benefit}</em>
              </span>
              <Count value={o.count} live={live} accent={accent} reduced={reduced} />
            </motion.div>
          );
        })}
      </div>

      {/* ── 4. Compounding result ────────────────────────────────────────
          A small rising chart: three bars stepping up, a trend line sweeping
          over them, labelled with this audience's outcome chain. Shows that the
          output turns into growth — without printing a single fake number. */}
      <ResultChart
        outcomes={config.outcomes}
        accent={accent}
        level={resultLevel}
        reduced={reduced}
      />

      <style>{`
        .pa-frame {
          position: relative;
          width: 100%; max-width: 380px; margin: 0 auto;
          background: #131110;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          padding: 22px 20px 20px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.45);
          font-family: Inter, sans-serif;
          display: flex; flex-direction: column;
          overflow: hidden;
        }
        .pa-glow { position: absolute; inset: 0; pointer-events: none; }
        .pa-frame > *:not(.pa-glow) { position: relative; z-index: 1; }

        .pa-input {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 14px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
        }
        .pa-input-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .pa-input-copy { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .pa-input-copy strong {
          font-size: 14px; font-weight: 650; color: #F5F2ED;
          letter-spacing: -0.24px; line-height: 1.2;
        }
        .pa-input-copy em {
          font-style: normal; font-size: 11.5px; line-height: 1.35;
          color: rgba(245,242,237,0.45);
        }

        .pa-hub {
          align-self: center;
          display: inline-flex; align-items: center; gap: 9px;
          padding: 8px 15px;
          background: rgba(255,255,255,0.04);
          border: 1px solid; border-radius: 100px;
          font-size: 12px; font-weight: 650; letter-spacing: -0.1px;
          color: #F5F2ED; white-space: nowrap;
        }
        .pa-hub-mark {
          position: relative; width: 12px; height: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .pa-hub-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.12);
          border-top-color: currentColor;
        }
        .pa-hub-core { width: 4px; height: 4px; border-radius: 50%; }

        .pa-outputs { display: flex; flex-direction: column; gap: 6px; }
        .pa-out {
          display: flex; align-items: center; gap: 11px;
          padding: 9px 12px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          min-height: 54px;
        }
        .pa-out-copy { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
        .pa-out-copy strong {
          font-size: 12.5px; font-weight: 650; color: #F5F2ED;
          letter-spacing: -0.2px; line-height: 1.2;
        }
        .pa-out-copy em {
          font-style: normal; font-size: 10.5px; line-height: 1.3;
          color: rgba(245,242,237,0.45);
        }
        .pa-out-count {
          font-size: 12px; font-weight: 700; letter-spacing: -0.3px;
          flex-shrink: 0; font-variant-numeric: tabular-nums;
        }

        .pa-art {
          width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .pa-art-line { height: 2px; border-radius: 2px; background: rgba(245,242,237,0.34); display: block; }

        @media (max-width: 480px) {
          .pa-frame { max-width: 340px; padding: 18px 16px 16px; }
        }
      `}</style>
    </div>
  );
}

/* ── Rail with a packet travelling down it ─────────────────────────────────── */
function Rail({
  active, accent, sending, reduced, fan = false,
}: { active: boolean; accent: string; sending: boolean; reduced: boolean; fan?: boolean }) {
  return (
    <div className="pa-rail" aria-hidden="true">
      <motion.span
        className="pa-rail-line"
        initial={false}
        animate={{ background: active ? `${accent}88` : 'rgba(255,255,255,0.12)' }}
        transition={{ duration: 0.45, ease: EASE }}
      />
      {!reduced && sending && (
        <motion.span
          className="pa-packet"
          style={{ background: accent, boxShadow: `0 0 8px 1px ${accent}` }}
          animate={{ y: [-9, 9], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.8, 1] }}
        />
      )}
      {fan && (
        <motion.span
          className="pa-fan"
          initial={false}
          animate={{ opacity: active ? 1 : 0, background: accent }}
          transition={{ duration: 0.4 }}
        />
      )}
      <style>{`
        .pa-rail { display: flex; justify-content: center; padding: 8px 0; position: relative; }
        .pa-rail-line { width: 1.5px; height: 16px; border-radius: 2px; display: block; }
        .pa-packet {
          position: absolute; top: 50%; left: 50%; margin-left: -2px;
          width: 4px; height: 4px; border-radius: 50%; display: block;
        }
        .pa-fan {
          position: absolute; bottom: 4px; left: 50%; margin-left: -2.5px;
          width: 5px; height: 5px; border-radius: 50%; display: block;
        }
      `}</style>
    </div>
  );
}

/* ── Result chart: rising bars + trend line + outcome labels ────────────────── */
function ResultChart({
  outcomes, accent, level, reduced,
}: { outcomes: [string, string, string]; accent: string; level: number; reduced: boolean }) {
  // Three bars step up to show compounding. Heights are relative, never a metric.
  const heights = [42, 66, 96];
  // Trend line points across the three bars (in a 100x100 viewbox).
  const linePoints = '6,74 50,50 94,20';

  return (
    <div className="pa-result">
      <div className="pa-result-plot" aria-hidden="true">
        {/* trend line sweeping up over the bars */}
        <svg className="pa-result-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.polyline
            points={linePoints}
            fill="none"
            stroke={accent}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: level > 0 ? 1 : 0, opacity: level > 0 ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
            style={{ filter: `drop-shadow(0 0 4px ${accent}66)` }}
          />
        </svg>
        {/* the bars */}
        <div className="pa-result-bars">
          {heights.map((h, i) => (
            <div key={i} className="pa-result-col">
              <motion.span
                className="pa-result-bar"
                style={{
                  background: i === 2
                    ? `linear-gradient(180deg, ${accent}, ${accent}aa)`
                    : 'rgba(245,242,237,0.16)',
                }}
                initial={false}
                animate={{ height: `${level * h}%`, opacity: level > 0 ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.7, ease: EASE, delay: reduced ? 0 : i * 0.12 }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* outcome chain as the x-axis labels */}
      <div className="pa-result-labels">
        {outcomes.map((label, i) => (
          <motion.span
            key={label}
            className="pa-result-label"
            initial={false}
            animate={{ opacity: level > 0 ? 1 : 0.25, y: level > 0 ? 0 : 3 }}
            transition={{ duration: 0.45, ease: EASE, delay: reduced ? 0 : 0.2 + i * 0.14 }}
            style={{ color: i === 2 ? accent : 'rgba(245,242,237,0.55)', fontWeight: i === 2 ? 700 : 500 }}
          >
            {label}
          </motion.span>
        ))}
      </div>

      <style>{`
        .pa-result {
          margin-top: 15px; padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .pa-result-plot { position: relative; height: 54px; }
        .pa-result-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .pa-result-bars {
          position: absolute; inset: 0;
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 10px; padding: 0 6px;
        }
        .pa-result-col { flex: 1; height: 100%; display: flex; align-items: flex-end; }
        .pa-result-bar { width: 100%; border-radius: 4px 4px 0 0; display: block; min-height: 2px; }
        .pa-result-labels {
          display: flex; justify-content: space-between; gap: 8px;
          margin-top: 9px; padding: 0 2px;
        }
        .pa-result-label {
          flex: 1; text-align: center; font-size: 10.5px;
          letter-spacing: -0.1px; line-height: 1.2;
        }
        .pa-result-label:first-child { text-align: left; }
        .pa-result-label:last-child { text-align: right; }
      `}</style>
    </div>
  );
}

/* ── Counting number ───────────────────────────────────────────────────────── */
function Count({
  value, live, accent, reduced,
}: { value: string; live: boolean; accent: string; reduced: boolean }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';
  const [n, setN] = useState(target ?? 0);
  const raf = useRef(0);

  useEffect(() => {
    if (target === null || reduced) return;
    if (!live) { setN(0); return; }
    const start = performance.now();
    const dur = 520;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [live, target, reduced]);

  return (
    <span className="pa-out-count" style={{ color: accent }}>
      {target === null ? value : `${n}${suffix}`}
    </span>
  );
}

/* ── Artifact miniatures ───────────────────────────────────────────────────── */
function Artifact({ kind, accent, live }: { kind: ArtifactKind; accent: string; live: boolean }) {
  const grow = (delay: number, w: string) => ({
    initial: false as const,
    animate: { width: live ? w : '0%', opacity: live ? 1 : 0 },
    transition: { duration: 0.45, ease: EASE, delay: live ? delay : 0 },
  });

  return (
    <span className="pa-art">
      {kind === 'post' && (
        <span style={{ width: '100%', padding: '6px 7px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />
            <motion.span className="pa-art-line" {...grow(0.1, '70%')} />
          </span>
          <motion.span className="pa-art-line" {...grow(0.18, '100%')} />
          <motion.span className="pa-art-line" {...grow(0.26, '85%')} />
        </span>
      )}

      {kind === 'reel' && (
        <span style={{ position: 'relative', width: 20, height: 30, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <motion.span
            initial={false}
            animate={{ opacity: live ? 1 : 0, scale: live ? 1 : 0.7 }}
            transition={{ duration: 0.4, ease: EASE, delay: live ? 0.15 : 0 }}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 0, height: 0, borderLeft: `6px solid ${accent}`, borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }}
          />
          <motion.span
            initial={false}
            animate={{ width: live ? '75%' : '0%' }}
            transition={{ duration: 1.1, ease: 'linear', delay: live ? 0.25 : 0 }}
            style={{ position: 'absolute', bottom: 3, left: 3, height: 2, borderRadius: 2, background: accent }}
          />
        </span>
      )}

      {kind === 'video' && (
        <span style={{ position: 'relative', width: 28, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <motion.span
            initial={false}
            animate={{ opacity: live ? 1 : 0, scale: live ? 1 : 0.7 }}
            transition={{ duration: 0.4, ease: EASE, delay: live ? 0.15 : 0 }}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 0, height: 0, borderLeft: `6px solid ${accent}`, borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }}
          />
          <motion.span
            initial={false}
            animate={{ width: live ? '80%' : '0%' }}
            transition={{ duration: 1.1, ease: 'linear', delay: live ? 0.25 : 0 }}
            style={{ position: 'absolute', bottom: 3, left: 3, height: 2, borderRadius: 2, background: accent }}
          />
        </span>
      )}

      {kind === 'doc' && (
        <span style={{ width: '100%', padding: '6px 7px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <motion.span className="pa-art-line" style={{ background: accent, height: 3 }} {...grow(0.1, '55%')} />
          <motion.span className="pa-art-line" {...grow(0.18, '100%')} />
          <motion.span className="pa-art-line" {...grow(0.26, '90%')} />
          <motion.span className="pa-art-line" {...grow(0.34, '65%')} />
        </span>
      )}

      {kind === 'ad' && (
        <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 24, height: 24 }}>
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{ opacity: live ? 1 : 0, scale: live ? 1 : 0.6 }}
              transition={{ duration: 0.35, ease: EASE, delay: live ? 0.1 + i * 0.07 : 0 }}
              style={{ borderRadius: 2, background: i === 1 ? accent : 'rgba(245,242,237,0.26)' }}
            />
          ))}
        </span>
      )}

      {kind === 'funnel' && (
        <span style={{ width: '100%', padding: '7px', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
          {['100%', '70%', '42%'].map((w, i) => (
            <motion.span
              key={w}
              initial={false}
              animate={{ width: live ? w : '0%', opacity: live ? 1 : 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: live ? 0.1 + i * 0.1 : 0 }}
              style={{ height: 5, borderRadius: 2, background: i === 2 ? accent : 'rgba(245,242,237,0.28)' }}
            />
          ))}
        </span>
      )}

      {kind === 'mail' && (
        <span style={{ position: 'relative', width: 24, height: 18, borderRadius: 3, border: `1.5px solid rgba(245,242,237,0.3)`, overflow: 'hidden' }}>
          <motion.span
            initial={false}
            animate={{ opacity: live ? 1 : 0 }}
            transition={{ duration: 0.4, delay: live ? 0.12 : 0 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderTop: `1.5px solid ${accent}`, clipPath: 'polygon(0 0, 50% 55%, 100% 0)' }}
          />
        </span>
      )}

      {kind === 'site' && (
        <span style={{ width: 28, height: 22, borderRadius: 3, border: '1px solid rgba(245,242,237,0.22)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <span style={{ height: 5, background: 'rgba(245,242,237,0.16)', display: 'flex', alignItems: 'center', gap: 2, padding: '0 3px' }}>
            <span style={{ width: 2, height: 2, borderRadius: '50%', background: accent }} />
          </span>
          <span style={{ flex: 1, padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <motion.span className="pa-art-line" {...grow(0.14, '80%')} />
            <motion.span
              initial={false}
              animate={{ width: live ? '45%' : '0%', opacity: live ? 1 : 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: live ? 0.24 : 0 }}
              style={{ height: 4, borderRadius: 2, background: accent }}
            />
          </span>
        </span>
      )}
    </span>
  );
}
