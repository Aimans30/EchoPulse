'use client';

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { EASE } from '@/lib/motion';

/**
 * Shared shell for the service page hero visuals.
 *
 * Every service mock sits in the same window: one chrome bar, one radius, one
 * border, one surface and one type scale, at a fixed height so the hero never
 * moves while a loop plays. Each visual supplies only its body.
 *
 * Scale (8px grid):
 *   body 13px, secondary 12px, labels 10.5px uppercase with 0.08em tracking
 *   radius 16 (window), 12 (panels), 8 (rows and chips)
 */

export const FRAME_HEIGHT = 440;

/** Loop driver: steps through `durations` (ms) while the frame is on screen. */
export function useVisual(durations: readonly number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = !!useReducedMotion();
  const [pageVisible, setPageVisible] = useState(true);
  const [loop, setLoop] = useState({ step: 0, cycle: 0 });
  const active = inView && pageVisible && !reduce;

  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => {
      setLoop((p) => (p.step + 1 >= durations.length ? { step: 0, cycle: p.cycle + 1 } : { step: p.step + 1, cycle: p.cycle }));
    }, durations[loop.step]);
    return () => clearTimeout(id);
  }, [active, loop, durations]);

  // Reduced motion shows the finished state of the loop and holds it.
  const step = reduce ? durations.length - 1 : loop.step;
  return { ref, reduce, active: inView && pageVisible, step, cycle: reduce ? 0 : loop.cycle };
}

type FrameProps = {
  accent: string;
  frameRef: RefObject<HTMLDivElement | null>;
  /** Short name of the document or screen shown in the chrome bar. */
  title: string;
  icon?: ReactNode;
  /** Live state shown at the right of the chrome bar. */
  status: string;
  statusDone?: boolean;
  /** Body without padding, for full-bleed screens. */
  flush?: boolean;
  label: string;
  children: ReactNode;
};

export function VisualFrame({ accent, frameRef, title, icon, status, statusDone, flush, label, children }: FrameProps) {
  return (
    <div ref={frameRef} className="sv" style={{ ['--acc' as string]: accent }} role="img" aria-label={label}>
      <div className="sv-glow" aria-hidden="true" />
      <div className="sv-win" aria-hidden="true">
        <div className="sv-chrome">
          <span className="sv-dots"><i /><i /><i /></span>
          <span className="sv-title">
            {icon}
            <span className="sv-title-text">{title}</span>
          </span>
          <span className={statusDone ? 'sv-status sv-status-done' : 'sv-status'}>
            <span className="sv-status-dot" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={status}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE.out }}
              >
                {status}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
        <div className={flush ? 'sv-body sv-body-flush' : 'sv-body'}>{children}</div>
      </div>
      <style>{FRAME_CSS}</style>
    </div>
  );
}

/** Small round status mark: waiting, working or done. */
export function StepMark({ state }: { state: 'idle' | 'busy' | 'done' }) {
  return (
    <span className={`sv-mark sv-mark-${state}`}>
      {state === 'done' && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      )}
    </span>
  );
}

/**
 * Text that types itself in without moving anything around it: the full text
 * is laid out invisibly to hold the space, and the typed part sits on top.
 * Remount with a new `key` to start again.
 */
export function TypeText({
  text,
  run,
  full,
  cps = 45,
  caret = true,
  className,
  suffix,
}: {
  text: string;
  run: boolean;
  full?: boolean;
  cps?: number;
  caret?: boolean;
  className?: string;
  /** Inline mark after the text, such as a citation, shown once typing ends. */
  suffix?: ReactNode;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run || full) return;
    const id = setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 1000 / cps);
    return () => clearInterval(id);
  }, [run, full, text, cps]);

  const shown = full ? text : text.slice(0, n);
  const typing = !full && run && n < text.length;
  return (
    <span className={`sv-type ${className ?? ''}`}>
      <span className="sv-type-ghost">{text}{suffix}</span>
      <span className="sv-type-live">
        {shown}
        {caret && typing && <span className="sv-caret" />}
        {!typing && shown.length === text.length && suffix}
      </span>
    </span>
  );
}

/**
 * Muted, inline, looping clip. Shows the poster first and only fetches the
 * video once the frame is on screen; never fetches it for reduced motion or
 * Save-Data, which keep the poster as the finished state.
 */
export function Clip({
  src,
  poster,
  play,
  reduce,
  className,
  onTime,
}: {
  src: string;
  poster: string;
  play: boolean;
  reduce: boolean;
  className?: string;
  onTime?: (t: number, d: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const saveData =
    typeof navigator !== 'undefined' &&
    !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const allowed = !reduce && !saveData;

  useEffect(() => {
    if (play && allowed && !armed) {
      const id = setTimeout(() => setArmed(true), 0);
      return () => clearTimeout(id);
    }
  }, [play, allowed, armed]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !armed) return;
    if (play) v.play().catch(() => {});
    else v.pause();
  }, [play, armed]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !armed || !onTime) return;
    let raf = 0;
    const tick = () => {
      if (v.duration) onTime(v.currentTime, v.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, onTime]);

  return (
    <video
      ref={ref}
      className={className}
      src={armed ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={armed}
      preload="none"
      disablePictureInPicture
      tabIndex={-1}
    />
  );
}

const FRAME_CSS = `
.sv {
  --ink: #F2EEE7;
  --muted: rgba(242,238,231,0.62);
  --faint: rgba(242,238,231,0.46);
  --line: rgba(255,255,255,0.06);
  --border: rgba(255,255,255,0.08);
  --raised: rgba(255,255,255,0.03);
  --raised-2: rgba(255,255,255,0.05);
  position: relative;
  width: 100%;
  height: ${FRAME_HEIGHT}px;
  font-family: var(--font-inter), Inter, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
.sv *, .sv *::before, .sv *::after { box-sizing: border-box; }
.sv-glow {
  position: absolute;
  inset: 6% 2% -4% 2%;
  background: radial-gradient(60% 55% at 50% 45%, color-mix(in srgb, var(--acc) 22%, transparent) 0%, transparent 72%);
  filter: blur(48px);
  pointer-events: none;
}
.sv-win {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: #161513;
  box-shadow: 0 32px 72px -16px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);
  overflow: hidden;
}
.sv-chrome {
  flex: none;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  border-bottom: 1px solid var(--line);
  background: rgba(255,255,255,0.015);
}
.sv-dots { display: flex; gap: 6px; flex: none; }
.sv-dots i { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.1); }
.sv-title {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
}
.sv-title svg { flex: none; color: var(--faint); }
.sv-title-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sv-status {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--raised);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}
.sv-status-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--acc);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--acc) 22%, transparent);
  animation: sv-pulse 1.6s ease-in-out infinite;
}
.sv-status-done { color: var(--ink); border-color: color-mix(in srgb, var(--acc) 40%, transparent); }
.sv-status-done .sv-status-dot { animation: none; }
.sv-body { position: relative; flex: 1; min-height: 0; padding: 16px; overflow: hidden; }
.sv-body-flush { padding: 0; }

.sv-label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--faint);
  line-height: 16px;
}
.sv-panel {
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--raised);
}

.sv-mark {
  flex: none;
  width: 16px; height: 16px;
  display: inline-grid;
  place-items: center;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.16);
  color: #0C0C0B;
  transition: background-color 0.3s, border-color 0.3s;
}
.sv-mark-busy {
  border-color: color-mix(in srgb, var(--acc) 30%, transparent);
  border-top-color: var(--acc);
  animation: sv-spin 0.8s linear infinite;
}
.sv-mark-done { background: var(--acc); border-color: var(--acc); }

.sv-type { position: relative; display: block; }
.sv-type-ghost { visibility: hidden; display: block; white-space: pre-wrap; }
.sv-type-live { position: absolute; inset: 0; white-space: pre-wrap; }
.sv-caret {
  display: inline-block;
  width: 1.5px;
  height: 1.05em;
  margin-left: 1px;
  vertical-align: -0.18em;
  background: var(--acc);
  animation: sv-blink 0.9s steps(2) infinite;
}

@keyframes sv-spin { to { transform: rotate(360deg); } }
@keyframes sv-blink { 50% { opacity: 0; } }
@keyframes sv-pulse { 50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--acc) 0%, transparent); } }
@media (prefers-reduced-motion: reduce) {
  .sv *, .sv *::before, .sv *::after { animation: none !important; transition: none !important; }
}
`;
