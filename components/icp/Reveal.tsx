'use client';

import { useEffect, useRef, useState } from 'react';

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
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const T = Tag as React.ElementType;
  return (
    <T
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown || reduced ? 'none' : 'translateY(20px)',
        transition: reduced ? 'none' : `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: shown ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </T>
  );
}
