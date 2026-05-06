'use client';

import { useEffect, useRef } from 'react';

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
      if (!el) return;

      let node: Element | null = el;
      let depth = 0;
      while (node && node !== document.documentElement && depth < 6) {
        if ((node as HTMLElement).dataset?.darkBg === 'true') {
          setDark(true);
          return;
        }

        if (depth < 2) {
          const bg = window.getComputedStyle(node).backgroundColor;
          const m = bg.match(/[\d.]+/g);
          if (m && m.length >= 3) {
            const alpha = m.length >= 4 ? parseFloat(m[3]) : 1;
            if (alpha > 0.5) {
              const lum = (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
              if (lum < 0.4) {
                setDark(true);
                return;
              }
              if (lum > 0.55) {
                setDark(false);
                return;
              }
            }
          }
        }

        node = (node as HTMLElement).parentElement;
        depth++;
      }
    }

    // rAF loop: ONLY does cheap transform writes — no layout reads
    // Wrappers carry only translate3d, scale lives on inner elements via CSS transitions
    const animate = () => {
      // Snap dot fast (lerp 0.5 = near-instant) for crisp tracking
      dx += (mx - dx) * 0.5;
      dy += (my - dy) * 0.5;
      dot!.style.transform = `translate3d(${dx - 4}px,${dy - 4}px,0)`;

      // Ring trails smoothly (lerp 0.22 — snappier than 0.18)
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      ring!.style.transform = `translate3d(${rx - 19}px,${ry - 19}px,0)`;

      // Dark check at ~6th frame (~100ms) — interleaved into rAF, no separate timer
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

    // Use event delegation on document — cheaper than attaching N listeners
    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest?.('a, button, [data-cursor-hover]');
      if (target) onEnter();
    };
    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest?.('a, button, [data-cursor-hover]');
      if (target) {
        const related = (e as any).relatedTarget as Element | null;
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
        .cursor-dot { width: 8px; height: 8px; }
        .cursor-ring { width: 38px; height: 38px; z-index: 9998; }

        .cursor-dot-inner, .cursor-ring-inner {
          width: 100%; height: 100%;
          border-radius: 50%;
          will-change: transform, background-color;
          transition: transform 0.22s cubic-bezier(0.16,1,0.3,1),
                      background-color 0.18s,
                      border-color 0.18s;
        }
        .cursor-dot-inner  { background: #0C0C0B; }
        .cursor-ring-inner { border: 1.5px solid rgba(12,12,11,0.38); box-sizing: border-box; }

        .cursor-dot-inner.on-dark  { background: #F2EEE7; }
        .cursor-ring-inner.on-dark { border-color: rgba(242,238,231,0.55); }

        .cursor-dot-inner.hovered  { background: #E8541A; transform: scale(1.5); }
        .cursor-ring-inner.hovered { transform: scale(1.7); border-color: #E8541A; background: rgba(232,84,26,0.08); }
        .cursor-dot-inner.hovered.on-dark  { background: #E8541A; }
        .cursor-ring-inner.hovered.on-dark { border-color: #E8541A; }

        @media (max-width: 768px), (pointer: coarse) {
          .cursor-dot, .cursor-ring { display: none !important; }
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot"><div ref={dotInnerRef} className="cursor-dot-inner" /></div>
      <div ref={ringRef} className="cursor-ring"><div ref={ringInnerRef} className="cursor-ring-inner" /></div>
    </>
  );
}
