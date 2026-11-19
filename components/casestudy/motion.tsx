'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

/**
 * Motion primitives for the case study pages.
 *
 * Rules every one of these follows:
 *   - transform and opacity only, so nothing reflows while it animates;
 *   - each plays once, the first time it is scrolled into view;
 *   - prefers-reduced-motion renders the finished state with no movement;
 *   - the final text is always in the server HTML, so crawlers, answer
 *     engines and readers without JavaScript get the real values.
 */

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion() {
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

/** True once the element has crossed into view. Never goes back to false. */
export function useInViewOnce<T extends Element>(threshold = 0.2, rootMargin = '0px 0px -8% 0px') {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === 'undefined') {
      const t = window.setTimeout(() => setSeen(true), 0);
      return () => window.clearTimeout(t);
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [seen, threshold, rootMargin]);
  return [ref, seen] as const;
}

/**
 * Fade and rise into place. `delay` is in seconds so staggered lists read
 * naturally at the call site. Under reduced motion it renders as a plain
 * wrapper.
 */
export function Rise({
  children,
  delay = 0,
  as = 'div',
  className,
  id,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'figure';
  className?: string;
  id?: string;
}) {
  const [ref, seen] = useInViewOnce<HTMLElement>(0.12);
  const reduced = usePrefersReducedMotion();
  const Tag = as as React.ElementType;
  const shown = seen || reduced;
  return (
    <Tag
      ref={ref}
      id={id}
      className={`cs-rise${shown ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={delay && !reduced ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Counts the largest number in a value string up from zero, keeping every
 * other character (units, commas, signs) exactly as written. "380,327",
 * "+220%", "5.8 to 4,803", "$0" and "4K, 120fps+" all work.
 *
 * Layout: an invisible copy of the final string sizes the box, and the
 * animated copy sits on top of it, so the tile never changes width.
 * Accessibility: the animated copy is aria-hidden and the final value is
 * printed once more for assistive tech.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const [ref, seen] = useInViewOnce<HTMLSpanElement>(0.4);
  const live = useRef<HTMLSpanElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!seen || reduced) return;
    const el = live.current;
    if (!el) return;
    const matches = [...value.matchAll(/\d[\d,]*(?:\.\d+)?/g)];
    if (matches.length === 0) return;
    const target = matches.reduce((a, b) =>
      parseFloat(b[0].replace(/,/g, '')) > parseFloat(a[0].replace(/,/g, '')) ? b : a,
    );
    const raw = target[0];
    const end = parseFloat(raw.replace(/,/g, ''));
    if (!Number.isFinite(end) || end === 0) return;
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
    const commas = raw.includes(',');
    const before = value.slice(0, target.index);
    const after = value.slice((target.index ?? 0) + raw.length);
    const fmt = (n: number) => {
      const fixed = n.toFixed(decimals);
      if (!commas) return fixed;
      const [i, d] = fixed.split('.');
      return i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? `.${d}` : '');
    };
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = p >= 1 ? value : before + fmt(end * eased) + after;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    el.textContent = before + fmt(0) + after;
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [seen, reduced, value, duration]);

  return (
    <span ref={ref} className="cs-count">
      <span className="cs-count-ghost" aria-hidden="true">
        {value}
      </span>
      <span className="cs-count-live" aria-hidden="true" ref={live}>
        {value}
      </span>
      <span className="cs-sr">{value}</span>
    </span>
  );
}
