'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { Target } from 'framer-motion';

/**
 * Apps & Software hero: "from brief to software you own".
 * One product window builds itself in four stages (Scope, Design, Build,
 * Handover) and loops, showing a different app type each loop. Decorative only.
 */

type Ease = [number, number, number, number];
const EASE: Ease = [0.16, 1, 0.3, 1];
const TEXT = '#F2EEE7';
const GREEN = '#22c55e';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/* Stage lengths in ms: Scope, Design, Build, Handover (includes the 1.2s hold). */
const STAGE_MS = [3000, 3000, 5000, 3400];
const STEPS = ['Scope', 'Design', 'Build', 'Handover'];
const CHIPS = ['Scoping', 'Designing', 'Building', 'Shipped'];

interface AppType {
  label: string;
  rows: [string, string, string];
  mode: 'chart' | 'chat';
}

const APPS: AppType[] = [
  { label: 'Client portal', rows: ['Login and client accounts', 'Booking and payments', 'Status updates'], mode: 'chart' },
  { label: 'Internal tool', rows: ['Team dashboard', 'Roles and permissions', 'Reports export'], mode: 'chart' },
  { label: 'AI assistant', rows: ['Answers from your documents', 'Hands off to a human', 'Usage log'], mode: 'chat' },
  { label: 'MVP', rows: ['Core user flow', 'Payments', 'Admin panel'], mode: 'chart' },
];

const mix = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`;

/* Canvas is a 400 x 300 design space; HTML blocks are placed by percentage. */
const P = (x: number, y: number, w: number, h: number): CSSProperties => ({
  position: 'absolute',
  left: `${x / 4}%`,
  top: `${y / 3}%`,
  width: `${w / 4}%`,
  height: `${h / 3}%`,
});

const RM_QUERY = '(prefers-reduced-motion: reduce)';
function subscribeReduced(cb: () => void) {
  const m = window.matchMedia(RM_QUERY);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
}
function useReduced() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(RM_QUERY).matches,
    () => false,
  );
}

export default function AppsSoftwareVisual({ accent }: { accent: string }) {
  const reduced = useReduced();
  const rootRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [loop, setLoop] = useState(0);
  const [active, setActive] = useState(false);
  const started = useRef(false);

  /* Pointer tilt, max 4deg, spring smoothed. */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 16, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 90, damping: 16, mass: 0.6 });
  const rotateY = useTransform(sx, (v) => v * 4);
  const rotateX = useTransform(sy, (v) => v * -4);

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      mx.set(Math.max(-1, Math.min(1, (e.clientX / window.innerWidth - 0.5) * 2)));
      my.set(Math.max(-1, Math.min(1, (e.clientY / window.innerHeight - 0.5) * 2)));
    };
    const leave = () => {
      mx.set(0);
      my.set(0);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [reduced, mx, my]);

  /* Pause when off screen or when the tab is hidden; restart cleanly on return. */
  useEffect(() => {
    const el = rootRef.current;
    if (reduced || !el) return;
    let inView = false;
    let tabVisible = !document.hidden;
    let wasActive = false;
    const update = () => {
      const next = inView && tabVisible;
      if (next === wasActive) return;
      wasActive = next;
      setActive(next);
      if (next && started.current) {
        setStage(0);
        setLoop((l) => l + 1);
      }
      if (next) started.current = true;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    const onVis = () => {
      tabVisible = !document.hidden;
      update();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);

  /* The one timeline: a timer per stage advances stage, then loop. */
  useEffect(() => {
    if (reduced || !active) return;
    const id = setTimeout(() => {
      if (stage < 3) {
        setStage(stage + 1);
      } else {
        setStage(0);
        setLoop((l) => l + 1);
      }
    }, STAGE_MS[stage]);
    return () => clearTimeout(id);
  }, [reduced, active, stage]);

  const app = reduced ? APPS[0] : APPS[loop % APPS.length];
  const railStage = reduced ? 4 : stage;
  const chipIdx = reduced ? 3 : stage;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        aspectRatio: '10 / 11',
        minHeight: '440px',
        perspective: '1200px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Soft accent glow behind the window */}
      <div
        style={{
          position: 'absolute',
          inset: '-8%',
          background: `radial-gradient(closest-side, ${mix(accent, 18)}, transparent)`,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        style={{ position: 'absolute', inset: 0, rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '24px',
            background: '#0C0C0B',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              pointerEvents: 'none',
            }}
          />
          <TopBar accent={accent} label={app.label} chip={CHIPS[chipIdx]} shipped={chipIdx === 3} />

          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '400 / 300' }}>
              {reduced ? (
                <UiLayer stage={2} accent={accent} app={app} reduced />
              ) : (
                <AnimatePresence mode="wait">
                  {stage === 0 ? (
                    <ScopeCard key={`scope-${loop}`} app={app} accent={accent} />
                  ) : (
                    <UiLayer key={`ui-${loop}`} stage={stage} accent={accent} app={app} reduced={false} />
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>

          <Rail stage={railStage} loop={loop} accent={accent} />
        </div>
      </motion.div>
    </div>
  );
}

/* ───────────── Top bar ───────────── */

function TopBar({ accent, label, chip, shipped }: { accent: string; label: string; chip: string; shipped: boolean }) {
  return (
    <div
      style={{
        position: 'relative',
        height: '46px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />
      ))}
      <div
        style={{
          marginLeft: '12px',
          minWidth: '108px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 12px',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(242,238,231,0.8)', whiteSpace: 'nowrap' }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={chip}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 600,
              color: shipped ? GREEN : 'rgba(242,238,231,0.8)',
              border: `1px solid ${shipped ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.12)'}`,
              background: shipped ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
            }}
          >
            {shipped ? (
              <Check size={10} color={GREEN} />
            ) : (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent }} />
            )}
            {chip}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Check({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/* ───────────── Bottom rail ───────────── */

function Rail({ stage, loop, accent }: { stage: number; loop: number; accent: string }) {
  return (
    <div
      style={{
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        padding: '12px 20px 14px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.2)',
      }}
    >
      {STEPS.map((name, i) => {
        const state = i < stage ? 'done' : i === stage ? 'active' : 'todo';
        return (
          <div key={name} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: '6px', height: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <motion.div
                key={`${loop}-${i}-${state}`}
                initial={state === 'done' ? false : { scaleX: 0 }}
                animate={{ scaleX: state === 'todo' ? 0 : 1 }}
                transition={{ duration: state === 'active' ? STAGE_MS[i] / 1000 : 0, ease: 'linear' }}
                style={{ height: '100%', background: accent, transformOrigin: '0% 50%', opacity: state === 'done' ? 0.55 : 1 }}
              />
            </div>
            <div
              style={{
                position: 'relative',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: state === 'active' ? accent : state === 'done' ? mix(accent, 22) : '#0C0C0B',
                border: `1.5px solid ${state === 'todo' ? 'rgba(255,255,255,0.2)' : accent}`,
                boxShadow: state === 'active' ? `0 0 0 3px ${mix(accent, 22)}` : 'none',
                transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
              }}
            >
              {state === 'done' && <Check size={8} color={accent} />}
            </div>
            <div
              style={{
                marginTop: '8px',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: state === 'todo' ? 'rgba(242,238,231,0.4)' : 'rgba(242,238,231,0.85)',
                transition: 'color 0.3s',
              }}
            >
              {name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────── Stage 1: Scope ───────────── */

function ScopeCard({ app, accent }: { app: AppType; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.22, x: '-12%', y: '-16%', transition: { duration: 0.45, ease: EASE } }}
      transition={{ duration: 0.7, ease: EASE }}
      style={{
        position: 'absolute',
        left: '4%',
        right: '4%',
        top: '8%',
        transformOrigin: '0% 0%',
        padding: '16px 20px 18px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
        <span style={{ fontSize: '13px', fontWeight: 600, color: TEXT }}>Project brief</span>
      </div>
      {app.rows.map((row, i) => {
        const d = 0.8 + i * 0.5;
        return (
          <div
            key={row}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span
              style={{
                position: 'relative',
                width: '18px',
                height: '18px',
                flexShrink: 0,
                borderRadius: '6px',
                border: '1.5px solid rgba(255,255,255,0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: d, type: 'spring', stiffness: 500, damping: 30 }}
                style={{ position: 'absolute', inset: '-1.5px', borderRadius: '6px', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0C0C0B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: d + 0.05, duration: 0.3, ease: EASE }}
                  />
                </svg>
              </motion.span>
            </span>
            <motion.span
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ delay: d, duration: 0.3 }}
              style={{ fontSize: '12px', color: TEXT }}
            >
              {row}
            </motion.span>
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <motion.span
          initial={{ opacity: 0, scale: 1.5, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ delay: 2.4, type: 'spring', stiffness: 380, damping: 24, opacity: { duration: 0.15, delay: 2.4 } }}
          style={{
            display: 'inline-block',
            padding: '5px 12px',
            borderRadius: '6px',
            border: `1.5px solid ${accent}`,
            color: accent,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          Fixed price
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ───────────── Stages 2 to 4: wireframe, build, handover ───────────── */

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
const SIDEBAR: Box = { x: 1, y: 1, w: 68, h: 298 };
const HEADER: Box = { x: 80, y: 1, w: 210, h: 27 };
const CARDS: Box[] = [
  { x: 80, y: 40, w: 62, h: 62 },
  { x: 154, y: 40, w: 62, h: 62 },
  { x: 228, y: 40, w: 62, h: 62 },
];
const PANEL: Box = { x: 80, y: 114, w: 210, h: 185 };
const SKELETONS: Box[] = [
  { x: 12, y: 42, w: 40, h: 4 },
  { x: 12, y: 66, w: 32, h: 4 },
  { x: 12, y: 90, w: 38, h: 4 },
  { x: 12, y: 114, w: 28, h: 4 },
  { x: 92, y: 12, w: 70, h: 4 },
  { x: 88, y: 54, w: 28, h: 4 },
  { x: 88, y: 68, w: 40, h: 4 },
  { x: 162, y: 54, w: 28, h: 4 },
  { x: 162, y: 68, w: 40, h: 4 },
  { x: 236, y: 54, w: 28, h: 4 },
  { x: 236, y: 68, w: 40, h: 4 },
  { x: 94, y: 130, w: 64, h: 4 },
  { x: 94, y: 146, w: 110, h: 4 },
  { x: 94, y: 162, w: 90, h: 4 },
];
const CHART_LINE =
  'M92 262 C112 258, 120 236, 140 238 S168 214, 188 206 S220 196, 236 176 S262 160, 278 144';
const CODE_LINES: [string, string][][] = [
  [['const ', 'k'], ['booking =', 't']],
  [['  await ', 'k'], ['create(', 't']],
  [['    data)', 't']],
  [['import ', 'k'], ['{ db }', 't']],
  [['if ', 'k'], ['(!user) {', 't']],
  [['  return ', 'k'], ['401', 't']],
  [['}', 't']],
  [['export ', 'k'], ['default', 't']],
];
const STATS: [string, number][] = [
  ['Active', 128],
  ['Today', 24],
  ['Open', 7],
];

function UiLayer({ stage, accent, app, reduced }: { stage: number; accent: string; app: AppType; reduced: boolean }) {
  const built = stage >= 2;
  const gid = useId().replace(/:/g, '');
  const ini = (v: Target) => (reduced ? false : v);
  const fillStyle: CSSProperties = { background: 'rgba(255,255,255,0.035)', borderRadius: '8px' };

  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ position: 'absolute', inset: 0 }}>
      {/* Built interface: fills cross-fade in block by block, under the outlines */}
      {built && (
        <>
          <motion.div initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ ...P(0, 0, 70, 300), ...fillStyle, padding: '12px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 4px', marginBottom: '16px' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: accent }} />
              <span style={{ width: '22px', height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.2)' }} />
            </div>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={ini({ opacity: 0, x: -6 })}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: EASE }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '24px',
                  padding: '0 6px',
                  marginBottom: '6px',
                  borderRadius: '6px',
                  background: i === 0 ? mix(accent, 20) : 'transparent',
                }}
              >
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', flexShrink: 0, background: i === 0 ? accent : 'rgba(255,255,255,0.22)' }} />
                <span style={{ width: i === 0 ? '60%' : `${44 + i * 6}%`, height: '5px', borderRadius: '3px', background: i === 0 ? mix(accent, 70) : 'rgba(255,255,255,0.16)' }} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={ini({ opacity: 0 })}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ ...P(80, 0, 210, 28), ...fillStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}
          >
            <span style={{ width: '38%', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent }} />
              <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            </span>
          </motion.div>

          {CARDS.map((c, i) => (
            <motion.div
              key={i}
              initial={ini({ opacity: 0, y: 8 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.3, duration: 0.6, ease: EASE }}
              style={{ ...P(c.x, c.y, c.w, c.h), ...fillStyle, padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <span style={{ fontSize: '10px', color: 'rgba(242,238,231,0.5)' }}>{STATS[i][0]}</span>
              <span style={{ fontSize: '19px', fontWeight: 700, color: TEXT, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                <CountUp to={STATS[i][1]} delay={0.6 + i * 0.3} reduced={reduced} />
              </span>
              <span style={{ width: '60%', height: '3px', borderRadius: '2px', background: mix(accent, 60) }} />
            </motion.div>
          ))}

          <motion.div initial={ini({ opacity: 0 })} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }} style={{ ...P(80, 114, 210, 186), ...fillStyle }}>
            {app.mode === 'chat' && <ChatPanel accent={accent} reduced={reduced} />}
          </motion.div>

          <motion.div
            initial={ini({ opacity: 0 })}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              ...P(300, 0, 100, 300),
              overflow: 'hidden',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.07)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent), linear-gradient(to right, #000 78%, transparent)',
              maskImage: 'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent), linear-gradient(to right, #000 78%, transparent)',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect',
            }}
          >
            <motion.div
              animate={reduced ? undefined : { y: [0, -160] }}
              transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
              style={{ padding: '4px 8px', fontFamily: MONO, fontSize: '10px', lineHeight: '20px', whiteSpace: 'pre' }}
            >
              {[0, 1, 2, 3].flatMap((rep) =>
                CODE_LINES.map((segs, li) => (
                  <div key={`${rep}-${li}`} style={{ height: '20px' }}>
                    {segs.map(([text, kind], si) => (
                      <span key={si} style={{ color: kind === 'k' ? accent : 'rgba(255,255,255,0.5)' }}>
                        {text}
                      </span>
                    ))}
                  </div>
                )),
              )}
            </motion.div>
          </motion.div>
        </>
      )}

      {/* Vector layer: outlines, skeletons, chart, cursor */}
      <svg viewBox="0 0 400 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`${gid}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.g animate={{ opacity: built ? 0.5 : 1 }} transition={{ duration: 0.6 }} initial={false}>
          {[SIDEBAR, HEADER, CARDS[0], CARDS[1], PANEL].map((b, i) => (
            <Outline key={i} box={b} index={i} reduced={reduced} />
          ))}
          <motion.g initial={ini({ x: 16, y: -8 })} animate={{ x: 0, y: 0 }} transition={{ delay: 1.65, duration: 0.45, ease: EASE }}>
            <Outline box={CARDS[2]} index={5} reduced={reduced} />
          </motion.g>
        </motion.g>

        {SKELETONS.map((s, i) => (
          <motion.rect
            key={i}
            x={s.x}
            y={s.y}
            width={s.w}
            height={s.h}
            rx={2}
            fill="#fff"
            initial={ini({ opacity: 0 })}
            animate={built ? { opacity: 0 } : { opacity: [0.06, 0.2, 0.06] }}
            transition={built ? { duration: 0.4 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 + (i % 6) * 0.15 }}
          />
        ))}

        {built && app.mode === 'chart' && (
          <g>
            {[180, 220, 260].map((y, i) => (
              <motion.line
                key={y}
                x1={92}
                x2={278}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
                initial={ini({ opacity: 0 })}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + i * 0.1, duration: 0.5 }}
              />
            ))}
            <motion.path
              d={`${CHART_LINE} L278 284 L92 284 Z`}
              fill={`url(#${gid}-area)`}
              initial={ini({ opacity: 0 })}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 1 }}
            />
            <motion.path
              d={CHART_LINE}
              fill="none"
              stroke={accent}
              strokeWidth={2}
              strokeLinecap="round"
              initial={ini({ pathLength: 0 })}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.3, duration: 1.6, ease: EASE }}
            />
            <motion.circle
              cx={278}
              cy={144}
              r={3.5}
              fill={accent}
              initial={ini({ opacity: 0, scale: 0 })}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.8, type: 'spring', stiffness: 300, damping: 24 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          </g>
        )}

        {!reduced && !built && (
          <motion.g
            initial={{ x: 190, y: 220, opacity: 0 }}
            animate={{ x: [190, 278, 278, 262, 262], y: [220, 63, 63, 71, 71], opacity: [0, 1, 1, 1, 0] }}
            transition={{ delay: 0.9, duration: 1.5, times: [0, 0.4, 0.5, 0.8, 1], ease: EASE }}
          >
            <path d="M0 0 L0 15 L4 11.5 L7 18 L9.5 17 L6.5 10.5 L12 10.5 Z" fill={TEXT} stroke="#0C0C0B" strokeWidth={1} strokeLinejoin="round" />
          </motion.g>
        )}
      </svg>

      {stage >= 3 && <Handover accent={accent} />}
    </motion.div>
  );
}

function Outline({ box, index, reduced }: { box: Box; index: number; reduced: boolean }) {
  return (
    <motion.rect
      x={box.x}
      y={box.y}
      width={box.w}
      height={box.h}
      rx={8}
      fill="none"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth={1.25}
      initial={reduced ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: 0.1 + index * 0.14, duration: 0.8, ease: EASE }}
    />
  );
}

function CountUp({ to, delay, reduced }: { to: number; delay: number; reduced: boolean }) {
  const mv = useMotionValue(reduced ? to : 0);
  const text = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    if (reduced) return;
    const controls = animate(mv, to, { duration: 1.4, delay, ease: EASE });
    return () => controls.stop();
  }, [mv, to, delay, reduced]);
  return <motion.span>{text}</motion.span>;
}

/* Reveals text one character at a time; keeps the final width reserved. */
function useTyped(text: string, delay: number, speed: number, reduced: boolean) {
  const [n, setN] = useState(reduced ? text.length : 0);
  useEffect(() => {
    if (reduced) return;
    let iv: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      let k = 0;
      iv = setInterval(() => {
        k += 1;
        setN(k);
        if (k >= text.length && iv) clearInterval(iv);
      }, speed);
    }, delay);
    return () => {
      clearTimeout(t);
      if (iv) clearInterval(iv);
    };
  }, [text, delay, speed, reduced]);
  return n;
}

function Typed({ text, n }: { text: string; n: number }) {
  return (
    <>
      {text.slice(0, n)}
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </>
  );
}

const USER_MSG = 'What changed today?';
const REPLY_MSG = '3 new bookings. 1 needs your reply.';

function ChatPanel({ accent, reduced }: { accent: string; reduced: boolean }) {
  const un = useTyped(USER_MSG, 1400, 45, reduced);
  const rn = useTyped(REPLY_MSG, 2700, 32, reduced);
  const ini = (v: Target) => (reduced ? false : v);
  const bubble: CSSProperties = { maxWidth: '86%', padding: '8px 10px', borderRadius: '10px', fontSize: '11px', lineHeight: 1.4, color: TEXT };
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', padding: '12px' }}>
      <motion.div
        initial={ini({ opacity: 0, y: 8 })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5, ease: EASE }}
        style={{ ...bubble, alignSelf: 'flex-end', background: mix(accent, 18), border: `1px solid ${mix(accent, 40)}`, borderBottomRightRadius: '3px' }}
      >
        <Typed text={USER_MSG} n={un} />
      </motion.div>
      <motion.div
        initial={ini({ opacity: 0, y: 8 })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 0.5, ease: EASE }}
        style={{ ...bubble, alignSelf: 'flex-start', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderBottomLeftRadius: '3px' }}
      >
        <Typed text={REPLY_MSG} n={rn} />
      </motion.div>
    </div>
  );
}

function Handover({ accent }: { accent: string }): ReactNode {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        style={{ position: 'absolute', inset: 0, borderRadius: '8px', background: 'rgba(12,12,11,0.62)' }}
      />
      <div style={{ position: 'absolute', top: '3%', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 600,
            color: GREEN,
            background: 'rgba(14,34,22,0.95)',
            border: '1px solid rgba(34,197,94,0.45)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          }}
        >
          <Check size={12} color={GREEN} />
          Deployed
        </motion.div>
      </div>
      <div style={{ position: 'absolute', left: '7%', right: '7%', bottom: '6%' }}>
        <motion.div
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 1.12 }}
          transition={{ delay: 1.5, duration: 1.2, ease: EASE }}
          style={{ position: 'absolute', inset: 0, borderRadius: '14px', border: `1.5px solid ${accent}`, pointerEvents: 'none' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            borderRadius: '14px',
            background: '#141413',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ width: '32px', height: '32px', flexShrink: 0, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: mix(accent, 16), border: `1px solid ${mix(accent, 35)}` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v15H7.5A2.5 2.5 0 0 0 5 19.5z" />
              <path d="M5 19.5A2.5 2.5 0 0 0 7.5 22H19v-5" />
            </svg>
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: TEXT }}>Code transferred to you</span>
            <span style={{ display: 'block', marginTop: '3px', fontSize: '11px', color: 'rgba(242,238,231,0.6)' }}>You own it. No lock-in.</span>
          </span>
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ delay: 1.7, duration: 1, ease: EASE }}
            style={{ flexShrink: 0 }}
          >
            <circle cx="8" cy="15" r="4" />
            <path d="M11 12l8-8M16 7l3 3M14 9l2 2" />
          </motion.svg>
        </motion.div>
      </div>
    </>
  );
}
