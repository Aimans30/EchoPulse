'use client';

import { useEffect, useRef } from 'react';

/**
 * Dot + ring cursor.
 *
 *  • Small dot snaps to the mouse (fast lerp, near-instant)
 *  • Larger ring trails behind on a softer lerp
 *  • Both flip to orange on hover (anchors, buttons, [data-cursor-hover])
 *  • Both invert color on dark sections (detected via data-dark-bg + luma scan)
 *
 * Fix vs. the previous build: every visual layer locks `aspect-ratio: 1 / 1`
 * and `border-radius: 50%` belt-and-braces, so the small dot can't render as
 * a square at sub-pixel scales or under transform scaling.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const dotInner = dotInnerRef.current;
    const ringInner = ringInnerRef.current;
    if (!dot || !ring || !dotInner || !ringInner) return;

    // Skip on touch / coarse-pointer devices entirely
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let dx = mx;
    let dy = my;
    let animId = 0;
    let isDark = false;
    let lastCheckX = -9999;
    let lastCheckY = -9999;
    let frameCount = 0;
    let movedSinceCheck = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      movedSinceCheck = true;
    };

    function setDark(val: boolean) {
      if (val === isDark) return;
      isDark = val;
      dotInner!.classList.toggle('on-dark', val);
      ringInner!.classList.toggle('on-dark', val);
    }

    function checkDark() {
      if (!movedSinceCheck) return;
      if (Math.abs(mx - lastCheckX) < 8 && Math.abs(my - lastCheckY) < 8) return;
      lastCheckX = mx;
      lastCheckY = my;
      movedSinceCheck = false;

      const el = document.elementFromPoint(mx, my);
      if (!el) { setDark(false); return; }

      // Primary: explicit data-dark-bg="true" marker (highest confidence)
      let node: Element | null = el;
      let depth = 0;
      while (node && node !== document.documentElement && depth < 12) {
        if ((node as HTMLElement).dataset?.darkBg === 'true') { setDark(true); return; }
        node = (node as HTMLElement).parentElement;
        depth++;
      }

      // Secondary: scan computed backgrounds up the tree
      node = el;
      depth = 0;
      while (node && node !== document.documentElement && depth < 4) {
        const bg = window.getComputedStyle(node).backgroundColor;
        const m = bg.match(/[\d.]+/g);
        if (m && m.length >= 3) {
          const alpha = m.length >= 4 ? parseFloat(m[3]) : 1;
          if (alpha > 0.5) {
            const lum = (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
            if (lum < 0.35) { setDark(true); return; }
            if (lum > 0.5)  { setDark(false); return; }
          }
        }
        node = (node as HTMLElement).parentElement;
        depth++;
      }

      // Fallback: assume light bg
      setDark(false);
    }

    // rAF loop: only cheap transform writes
    const animate = () => {
      // Dot snaps fast (lerp 0.5) for crisp tracking
      dx += (mx - dx) * 0.5;
      dy += (my - dy) * 0.5;
      // 12px dot — center is 6,6
      dot!.style.transform = `translate3d(${dx - 6}px,${dy - 6}px,0)`;

      // Ring trails smoothly (lerp 0.22)
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      // 38px ring — center is 19,19
      ring!.style.transform = `translate3d(${rx - 19}px,${ry - 19}px,0)`;

      frameCount++;
      if (frameCount % 6 === 0) checkDark();

      animId = requestAnimationFrame(animate);
    };

    animate();
    document.addEventListener('mousemove', onMove, { passive: true });

    const onEnter = () => {
      dotInner!.classList.add('hovered');
      ringInner!.classList.add('hovered');
    };
    const onLeave = () => {
      dotInner!.classList.remove('hovered');
      ringInner!.classList.remove('hovered');
    };

    // Event delegation on document — cheaper than attaching N listeners
    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest?.('a, button, [data-cursor-hover]');
      if (target) onEnter();
    };
    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest?.('a, button, [data-cursor-hover]');
      if (target) {
        const related = (e as unknown as { relatedTarget?: Element | null }).relatedTarget ?? null;
        if (!related || !related.closest?.('a, button, [data-cursor-hover]')) {
          onLeave();
        }
      }
    };
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <style>{`
        .cursor-dot, .cursor-ring {
          position: fixed; top: 0; left: 0;
          pointer-events: none; z-index: 9999;
          will-change: transform;
          contain: layout style paint;
        }
        /* Both wrappers locked square via aspect-ratio so transforms can't
           skew the inner circle into a rounded-rectangle / square at scale.
           !important is belt-and-braces — nothing in the codebase should
           override these, but if Shery.js or any other library ever touches
           the cursor it can't squash the shape. */
        .cursor-dot  { width: 12px !important; height: 12px !important; aspect-ratio: 1 / 1 !important; }
        .cursor-ring { width: 38px; height: 38px; aspect-ratio: 1 / 1; z-index: 9998; }

        .cursor-dot-inner, .cursor-ring-inner {
          width: 100% !important;
          height: 100% !important;
          aspect-ratio: 1 / 1 !important;
          border-radius: 50% !important;
          box-sizing: border-box;
          will-change: transform, background-color;
          transition: transform 0.22s cubic-bezier(0.16,1,0.3,1),
                      background-color 0.18s,
                      border-color 0.18s;
        }
        .cursor-dot-inner  { background: #0C0C0B; }
        /* Slightly punchier border on the ring so it stays legible on every
           background — old 38% alpha got washed out on cream pages. */
        .cursor-ring-inner { border: 1.5px solid rgba(12,12,11,0.45); background: transparent; }

        .cursor-dot-inner.on-dark  { background: #F2EEE7; }
        /* Bumped from 0.55 → 0.7 so the ring is unmistakably visible on every
           dark section (Manifesto, Services, Founder, LeadMagnet, CTA). */
        .cursor-ring-inner.on-dark { border-color: rgba(242,238,231,0.7); }

        .cursor-dot-inner.hovered  { background: #E8541A; transform: scale(1.4); }
        /* Ring stays transparent on hover — only the border tints + scales.
           Removing the translucent orange fill kills the "square box" read
           that the alpha-filled ring produced at small zoom levels. */
        .cursor-ring-inner.hovered { transform: scale(1.7); border-color: #E8541A; background: transparent; }
        /* On dark sections we keep the cursor cream/white at ALL times —
           including hover. Orange-on-dark made the cursor hard to track
           against the orange accents in the copy itself. Cream stays
           readable on every dark surface and never fights with the type. */
        .cursor-dot-inner.hovered.on-dark  { background: #F2EEE7; }
        .cursor-ring-inner.hovered.on-dark { border-color: #F2EEE7; background: transparent; }

        @media (max-width: 768px), (pointer: coarse) {
          .cursor-dot, .cursor-ring { display: none !important; }
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot"><div ref={dotInnerRef} className="cursor-dot-inner" /></div>
      <div ref={ringRef} className="cursor-ring"><div ref={ringInnerRef} className="cursor-ring-inner" /></div>
    </>
  );
}
