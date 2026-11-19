'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Reveal — lightweight scroll-in wrapper for the ICP pages.
 *
 * Fades + lifts its children once, when they scroll into view, via a single
 * IntersectionObserver (no framer-motion dependency per node, so it stays cheap
 * across a long page). Respects prefers-reduced-motion: those users get the
 * content immediately with no transform. This is the ONLY client bit in the
 * otherwise server-rendered sections, so the copy is always in the raw HTML.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'span';
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);
  // Read during render (server snapshot: false), so reduced-motion visitors
  // get the content immediately without a state update inside an effect.
  const reduced = useSyncExternalStore(noopSubscribe, reducedMotion, () => false);
  const shown = seen || reduced;

  useEffect(() => {
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
      // threshold 0 with a bottom inset, not a ratio: a ratio of 0.15 can
      // never be reached by a block taller than about six viewports, which
      // left long lists invisible on phones.
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  const T = Tag as React.ElementType;
  return (
    <T
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown || reduced ? 'none' : 'translateY(16px)',
        transition: reduced ? 'none' : `opacity 0.5s ease ${delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: shown ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </T>
  );
}
