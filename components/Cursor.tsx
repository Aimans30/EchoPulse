'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current!;
    const ring = ringRef.current!;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let animId: number;
    let frame = 0;
    let isDark = false;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    function checkDark() {
      const el = document.elementFromPoint(mx, my);
      if (!el) return;
      let node: Element | null = el;
      while (node && node !== document.documentElement) {
        // Explicit dark-section marker wins immediately
        if ((node as HTMLElement).dataset?.darkBg === 'true') { setDark(true); return; }

        const bg = window.getComputedStyle(node).backgroundColor;
        const m  = bg.match(/[\d.]+/g);
        if (m && m.length >= 3) {
          const alpha = m.length >= 4 ? parseFloat(m[3]) : 1;
          if (alpha > 0.3) {
            const lum = (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
            if (lum < 0.40) { setDark(true);  return; }
            if (lum > 0.40) { setDark(false); return; }
          }
        }
        node = (node as HTMLElement).parentElement;
      }
    }

    function setDark(val: boolean) {
      if (val === isDark) return;
      isDark = val;
      dot.classList.toggle('on-dark', val);
      ring.classList.toggle('on-dark', val);
    }

    const animate = () => {
      // Check every 3 frames for snappier dark/light switching
      frame++;
      if (frame % 3 === 0) checkDark();

      dot.style.transform  = `translate3d(${mx - 4}px,${my - 4}px,0)`;

      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.transform = `translate3d(${rx - 19}px,${ry - 19}px,0)`;

      animId = requestAnimationFrame(animate);
    };

    animate();
    document.addEventListener('mousemove', onMove, { passive: true });

    // Hover state via event delegation
    const onEnter = () => { dot.classList.add('hovered'); ring.classList.add('hovered'); };
    const onLeave = () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); };

    const attach = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();
    const t = setTimeout(attach, 800);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <style>{`
        .cursor-dot {
          position: fixed; top: 0; left: 0;
          width: 8px; height: 8px; border-radius: 50%;
          background: #0C0C0B;
          pointer-events: none; z-index: 9999;
          will-change: transform;
          transition: background 0.25s, transform 0.15s;
        }
        .cursor-ring {
          position: fixed; top: 0; left: 0;
          width: 38px; height: 38px; border-radius: 50%;
          border: 1.5px solid rgba(12,12,11,0.38);
          pointer-events: none; z-index: 9998;
          will-change: transform;
          transition: width 0.35s cubic-bezier(0.16,1,0.3,1),
                      height 0.35s cubic-bezier(0.16,1,0.3,1),
                      border-color 0.25s,
                      background 0.3s;
        }

        /* Dark section — go white */
        .cursor-dot.on-dark  { background: #F2EEE7; }
        .cursor-ring.on-dark { border-color: rgba(242,238,231,0.55); }

        /* Hover state */
        .cursor-dot.hovered  { background: #E8541A; transform: scale(1.5); }
        .cursor-ring.hovered { width: 64px; height: 64px; border-color: #E8541A; background: rgba(232,84,26,0.08); }

        /* Hover on dark */
        .cursor-dot.hovered.on-dark  { background: #E8541A; }
        .cursor-ring.hovered.on-dark { border-color: #E8541A; }

        @media (max-width: 768px) { .cursor-dot, .cursor-ring { display: none; } }
      `}</style>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
