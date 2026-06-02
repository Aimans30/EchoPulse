'use client';
import { useEffect, useRef } from 'react';

// Cursor — dot + trailing ring, dark-bg aware, 60fps via direct transform writes.
export default function Cursor() {
  const d = useRef<HTMLDivElement>(null);
  const r = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = d.current;
    const ring = r.current;
    if (!dot || !ring) return;
    if (window.matchMedia('(pointer:coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

    let mx = innerWidth / 2, my = innerHeight / 2;
    let dx = mx, dy = my, rx = mx, ry = my;
    let dark = false, hover = false, fc = 0, lx = -9, ly = -9, moved = false, snap = false;

    const set = (cls: string, on: boolean, el: HTMLElement) => el.classList.toggle(cls, on);

    const probe = () => {
      if (!moved || (Math.abs(mx - lx) < 8 && Math.abs(my - ly) < 8)) return;
      lx = mx; ly = my; moved = false;
      const el = document.elementFromPoint(mx, my);
      if (!el) { if (dark) { dark = false; set('on-dark', false, dot); set('on-dark', false, ring); } return; }
      let n: Element | null = el, depth = 0, next = false;
      while (n && n !== document.documentElement && depth < 12) {
        if ((n as HTMLElement).dataset?.darkBg === 'true') { next = true; break; }
        n = (n as HTMLElement).parentElement; depth++;
      }
      if (!next) {
        n = el; depth = 0;
        while (n && n !== document.documentElement && depth < 4) {
          const bg = getComputedStyle(n).backgroundColor;
          const m = bg.match(/[\d.]+/g);
          if (m && m.length >= 3) {
            const a = m.length >= 4 ? +m[3] : 1;
            if (a > 0.5) {
              const lum = (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
              if (lum < 0.35) { next = true; break; }
              if (lum > 0.5) break;
            }
          }
          n = (n as HTMLElement).parentElement; depth++;
        }
      }
      if (next !== dark) { dark = next; set('on-dark', dark, dot); set('on-dark', dark, ring); }
    };

    const tick = () => {
      dx += (mx - dx) * 0.20; dy += (my - dy) * 0.20;
      rx += (mx - rx) * 0.10; ry += (my - ry) * 0.10;
      dot.style.transform = `translate3d(${dx - 4}px,${dy - 4}px,0)`;
      const rs = hover ? 44 : 28;
      ring.style.transform = `translate3d(${rx - rs / 2}px,${ry - rs / 2}px,0)`;
      if (++fc % 6 === 0) probe();
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);

    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY; moved = true;
      if (snap) { snap = false; dx = mx; dy = my; rx = mx; ry = my; dot.style.opacity = ''; ring.style.opacity = ''; }
    };
    const INTERACTIVE = 'a,button,[data-cursor-hover]';
    const TEXT_INPUT  = 'input,textarea,select,[contenteditable="true"]';

    const over = (e: MouseEvent) => {
      const target = e.target as Element;
      // Over a text input → hide the custom cursor entirely so the native
      // I-beam shows. Users see exactly where they'll type.
      if (target?.closest?.(TEXT_INPUT)) {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        return;
      }
      // Over a button/link/[data-cursor-hover] → enlarge the ring
      if (target?.closest?.(INTERACTIVE)) {
        if (!hover) { hover = true; set('hovered', true, ring); }
      }
    };
    const out = (e: MouseEvent) => {
      const target = e.target as Element;
      const inText = !!target?.closest?.(TEXT_INPUT);
      const inHover = !!target?.closest?.(INTERACTIVE);
      const rt = (e as unknown as { relatedTarget?: Element | null }).relatedTarget ?? null;
      const stillInText = !!rt?.closest?.(TEXT_INPUT);
      const stillInHover = !!rt?.closest?.(INTERACTIVE);

      // Leaving a text input — restore the custom cursor
      if (inText && !stillInText) {
        dot.style.opacity = '';
        ring.style.opacity = '';
      }
      // Leaving an interactive element — collapse the ring
      if (inHover && !stillInHover) {
        if (hover) { hover = false; set('hovered', false, ring); }
      }
    };
    const hide = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; snap = true; };
    const vis = () => { if (document.hidden) hide(); };

    addEventListener('mousemove', move, { passive: true });
    addEventListener('mouseover', over, { passive: true });
    addEventListener('mouseout', out, { passive: true });
    addEventListener('blur', hide);
    document.addEventListener('visibilitychange', vis);

    return () => {
      removeEventListener('mousemove', move);
      removeEventListener('mouseover', over);
      removeEventListener('mouseout', out);
      removeEventListener('blur', hide);
      document.removeEventListener('visibilitychange', vis);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <style>{`
        .ep-cur-d, .ep-cur-r { position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999; border-radius: 50%; will-change: transform; contain: layout style paint; }
        .ep-cur-d { width: 8px; height: 8px; background: rgba(12,12,11,.95); transition: background-color .18s ease; }
        .ep-cur-d.on-dark { background: #F2EEE7; }
        .ep-cur-r { width: 28px; height: 28px; border: 1px solid rgba(12,12,11,.7); z-index: 9998; transition: width .28s cubic-bezier(.16,1,.3,1), height .28s cubic-bezier(.16,1,.3,1), border-color .18s ease; }
        .ep-cur-r.on-dark { border-color: rgba(242,238,231,.85); }
        .ep-cur-r.hovered { width: 44px; height: 44px; border-color: #E8541A; }
        @media (max-width: 768px), (pointer: coarse) { .ep-cur-d, .ep-cur-r { display: none !important; } }
      `}</style>
      <div ref={d} className="ep-cur-d" aria-hidden="true" />
      <div ref={r} className="ep-cur-r" aria-hidden="true" />
    </>
  );
}
