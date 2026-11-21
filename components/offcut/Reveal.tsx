'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/**
 * Scroll reveal for the Offcut pages. Adds `is-in` once the element enters the
 * viewport (and keeps it), so CSS can fade and lift it in. With `track`, it
 * also toggles `is-visible` while on screen, so looping effects such as the
 * skeleton shimmer only run when someone can see them.
 *
 * Opacity and transform only, so nothing shifts layout. Reduced motion shows
 * the final state at once. A <noscript> rule on the page shows everything
 * when JavaScript is off.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  track = false,
  style,
}: {
  children: ReactNode;
  className?: string;
  /** Stagger in ms. */
  delay?: number;
  track?: boolean;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in', 'is-visible');
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('is-in');
            if (track) el.classList.add('is-visible');
            else obs.disconnect();
          } else if (track) {
            el.classList.remove('is-visible');
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [track]);

  return (
    <div ref={ref} className={className ? `rv ${className}` : 'rv'} style={delay ? { ...style, ['--rv-delay' as string]: `${delay}ms` } : style}>
      {children}
      <style href="offcut-reveal" precedence="default">{`
        .rv { opacity: 0; transform: translate3d(0, 16px, 0); transition: opacity .7s cubic-bezier(0.16, 1, 0.3, 1), transform .7s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: var(--rv-delay, 0ms); }
        .rv.is-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .rv, .rv.is-in { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </div>
  );
}
