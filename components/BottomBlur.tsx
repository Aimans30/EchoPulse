'use client';

import { useEffect, useState } from 'react';

/**
 * Permanent frosted-glass blur pinned to the bottom edge of the viewport.
 *
 * It sits `position: fixed` so it stays put while the page scrolls, and
 * `backdrop-filter: blur()` frosts whatever section content passes underneath
 * it — the same progressive-blur fade used on premium SaaS landing pages.
 *
 * The blur HIDES once the footer scrolls into view, so footer text/links are
 * never frosted out (an IntersectionObserver watches #site-footer). It also
 * stays out of the tap path via pointer-events:none.
 */
export default function BottomBlur() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      // Fire as soon as the footer's top edge reaches the bottom 200px of
      // the viewport — that's where the blur bar lives.
      { rootMargin: '0px 0px -0px 0px', threshold: 0 }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '110px',
        pointerEvents: 'none',
        zIndex: 40,
        opacity: hidden ? 0 : 1,
        transition: 'opacity 0.35s ease',
      }}
    >
      {/* Progressive blur — strongest at the bottom, fades to none at the top
          via a mask so the transition into clear content is seamless. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
        }}
      />
      {/* Second, lighter blur layer higher up for a smoother gradient of blur */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          maskImage: 'linear-gradient(to top, black 0%, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
