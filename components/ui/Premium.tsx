'use client';

/**
 * Premium micro-interaction primitives.
 *
 * These are hand-ported from the patterns KokonutUI popularised (shimmer text,
 * glass surface, animated gradient border, magnetic button) rather than
 * installed from its registry. KokonutUI ships through the shadcn CLI and is
 * written in Tailwind utility classes; this codebase has no shadcn scaffolding
 * (no components.json, no lib/utils, no components/ui registry) and styles
 * almost everything with inline styles plus scoped <style> blocks. Bolting a
 * second styling paradigm onto the site to get four effects would cost far
 * more than it returns, so the effects are rebuilt natively here.
 *
 * Everything below reads its timing from lib/motion.ts, so these stay in sync
 * with the rest of the site rather than becoming another island of ad-hoc
 * durations.
 *
 * All four respect prefers-reduced-motion.
 */

import { useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { DUR, EASE, EASE_CSS } from '@/lib/motion';

const BRAND = '#E8541A';

/* ────────────────────────────────────────────────────────────────────────
   ShimmerText
   A slow highlight sweep across a line of text. Used for a single high-value
   phrase, never for body copy: the effect works because it is rare.
   ──────────────────────────────────────────────────────────────────────── */
export function ShimmerText({
  children,
  className,
  base = 'rgba(242,238,231,0.55)',
  highlight = '#F2EEE7',
  duration = 3.2,
}: {
  children: ReactNode;
  className?: string;
  /** Resting colour of the text. */
  base?: string;
  /** Colour of the travelling highlight. */
  highlight?: string;
  /** Seconds for one full sweep. Slow on purpose. */
  duration?: number;
}) {
  return (
    <span className={`ep-shimmer${className ? ` ${className}` : ''}`}>
      {children}
      <style>{`
        .ep-shimmer {
          background: linear-gradient(
            100deg,
            ${base} 0%,
            ${base} 40%,
            ${highlight} 50%,
            ${base} 60%,
            ${base} 100%
          );
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ep-shimmer-sweep ${duration}s linear infinite;
        }
        @keyframes ep-shimmer-sweep {
          from { background-position: 180% 0; }
          to   { background-position: -80% 0; }
        }
        /* A permanently looping animation is exactly the kind of thing that
           makes reduced-motion users feel unwell. Fall back to a flat colour. */
        @media (prefers-reduced-motion: reduce) {
          .ep-shimmer {
            animation: none;
            background: none;
            -webkit-background-clip: initial;
            background-clip: initial;
            color: ${highlight};
          }
        }
      `}</style>
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   GlassCard
   Frosted surface with a light top edge. The inset highlight on the top
   border is what sells the "pane of glass" read; without it this is just a
   blurred box.
   ──────────────────────────────────────────────────────────────────────── */
export function GlassCard({
  children,
  className,
  style,
  dark = false,
  padding = '28px',
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Tuned for a dark section rather than the cream background. */
  dark?: boolean;
  padding?: string;
}) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius: '18px',
        padding,
        background: dark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.55)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.80)'}`,
        // The inset top highlight is the whole trick. It mimics light catching
        // the top edge of a physical panel.
        boxShadow: dark
          ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 20px 50px -18px rgba(0,0,0,0.55)'
          : 'inset 0 1px 0 rgba(255,255,255,0.90), 0 16px 40px -18px rgba(12,12,11,0.22)',
        backdropFilter: 'blur(18px) saturate(150%)',
        WebkitBackdropFilter: 'blur(18px) saturate(150%)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   GradientBorder
   A conic gradient rotating behind the element, masked so only a 1px ring
   shows. Genuine animated border, not a static gradient pretending to be one.
   ──────────────────────────────────────────────────────────────────────── */
export function GradientBorder({
  children,
  radius = 18,
  className,
  style,
  duration = 6,
}: {
  children: ReactNode;
  radius?: number;
  className?: string;
  style?: CSSProperties;
  /** Seconds per rotation. Slow reads as expensive; fast reads as a gimmick. */
  duration?: number;
}) {
  return (
    <div
      className={`ep-gborder${className ? ` ${className}` : ''}`}
      style={{ borderRadius: `${radius}px`, ...style }}
    >
      <div className="ep-gborder-content" style={{ borderRadius: `${radius - 1}px` }}>
        {children}
      </div>
      <style>{`
        .ep-gborder {
          position: relative;
          padding: 1px;
          overflow: hidden;
          isolation: isolate;
        }
        .ep-gborder::before {
          content: '';
          position: absolute;
          /* Oversized and centred so the rotating square always covers the
             element's corners. At exactly 100% the corners clip as it spins. */
          inset: -150%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            ${BRAND} 60deg,
            rgba(232,84,26,0.35) 110deg,
            transparent 180deg,
            transparent 360deg
          );
          animation: ep-gborder-spin ${duration}s linear infinite;
          z-index: -1;
        }
        .ep-gborder-content {
          position: relative;
          height: 100%;
          background: #0C0C0B;
        }
        @keyframes ep-gborder-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ep-gborder::before {
            animation: none;
            background: rgba(232,84,26,0.45);
          }
        }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   MagneticButton
   The button drifts a few pixels toward the cursor. Subtle enough that most
   people never consciously notice it, which is the point: it registers as
   the interface being responsive rather than as an effect.
   ──────────────────────────────────────────────────────────────────────── */
export function MagneticButton({
  children,
  onClick,
  href,
  className,
  style,
  strength = 0.28,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  style?: CSSProperties;
  /** Fraction of cursor offset the button follows. Above ~0.4 it looks silly. */
  strength?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    // Pointer-coarse devices have no cursor to be attracted to, and running
    // this on touch just costs work for nothing.
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const shared = {
    onMouseMove: handleMove,
    onMouseLeave: reset,
    className,
    style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style },
    animate: { x: offset.x, y: offset.y },
    // Spring rather than a duration: the button should feel like it has weight
    // and settle, not run a fixed-length animation.
    transition: { type: 'spring' as const, stiffness: 260, damping: 18, mass: 0.6 },
  };

  if (href) {
    return <motion.a href={href} {...shared}>{children}</motion.a>;
  }
  return <motion.button type="button" onClick={onClick} {...shared}>{children}</motion.button>;
}

/* ────────────────────────────────────────────────────────────────────────
   AnimatedNumber
   Counts up when scrolled into view. For stat blocks, where a number that
   simply appears reads as static but one that resolves reads as live data.
   ──────────────────────────────────────────────────────────────────────── */
export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  duration = DUR.xl,
  className,
  style,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  const run = () => {
    if (started.current) return;
    started.current = true;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // Ease-out cubic so it decelerates into the final value instead of
      // stopping dead, which is what makes a counter feel mechanical.
      setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <motion.span
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums', ...style }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: DUR.sm, ease: EASE.out }}
      onViewportEnter={run}
    >
      {prefix}{display.toLocaleString()}{suffix}
    </motion.span>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Reusable CSS snippets for <style> blocks elsewhere, so hand-written CSS
   transitions use the same curve as the JS animations instead of drifting.
   ──────────────────────────────────────────────────────────────────────── */
export const CSS_EASE = EASE_CSS;
