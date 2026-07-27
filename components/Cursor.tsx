'use client';
import { useEffect, useRef, useState } from 'react';

// Cursor — dot + trailing ring, dark-bg aware, 60fps via direct transform writes.
export default function Cursor() {
  const d = useRef<HTMLDivElement>(null);
  const r = useRef<HTMLDivElement>(null);

  // Nothing here renders until we have confirmed a fine pointer.
  //
  // The effect below already bailed on touch, but the MARKUP shipped
  // regardless: this component sits inside the root layout, so every phone
  // was parsing the <style> block and building two fixed-position elements
  // for a cursor that can never exist on a touchscreen. Starting at `false`
  // on both the server and the first client render keeps hydration
  // byte-identical (the server cannot know the pointer type), then the
  // effect promotes desktop to the real thing one tick later. Desktop ends
  // up in exactly the same state; the dot simply stops being painted at
  // 0,0 in the corner during the pre-hydration window.
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer:coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    setFinePointer(true);
  }, []);

  useEffect(() => {
    const dot = d.current;
    const ring = r.current;
    if (!dot || !ring) return;
    if (window.matchMedia('(pointer:coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

    // Signal CSS that the custom cursor is live, so `cursor: none` activates.
    // Removed in cleanup — if this component ever unmounts or the effect bails,
    // the native cursor comes back instead of leaving the user with nothing.
    const html = document.documentElement;
    html.classList.add('ep-cursor-ready');

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
      // Re-schedule FIRST so a throw inside probe()/style writes can never kill
      // the loop. A dead loop = frozen cursor that only a reload would fix.
      raf = requestAnimationFrame(tick);
      try {
        dx += (mx - dx) * 0.20; dy += (my - dy) * 0.20;
        rx += (mx - rx) * 0.10; ry += (my - ry) * 0.10;
        dot.style.transform = `translate3d(${dx - 4}px,${dy - 4}px,0)`;
        const rs = hover ? 44 : 28;
        ring.style.transform = `translate3d(${rx - rs / 2}px,${ry - rs / 2}px,0)`;
        if (++fc % 6 === 0) probe();
      } catch {
        /* one bad frame shouldn't stop the cursor — keep ticking */
      }
    };
    let raf = requestAnimationFrame(tick);

    const INTERACTIVE = 'a,button,[data-cursor-hover]';
    const TEXT_INPUT  = 'input,textarea,select,[contenteditable="true"]';

    // Restore visibility unless the pointer is genuinely over a text input.
    // Centralized so every "I'm back" path (mousemove, mouseenter, focus,
    // pageshow) reuses the same correct logic and the cursor can't get
    // permanently stuck invisible.
    const reveal = (clientX?: number, clientY?: number) => {
      const x = clientX ?? mx, y = clientY ?? my;
      const el = (x >= 0 && y >= 0) ? document.elementFromPoint(x, y) : null;
      const overText = !!(el && (el as Element).closest?.(TEXT_INPUT));
      if (!overText) {
        dot.style.opacity = '';
        ring.style.opacity = '';
      }
    };

    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY; moved = true;
      if (snap) { snap = false; dx = mx; dy = my; rx = mx; ry = my; }
      // Defensive: any real movement that isn't over a text input restores
      // the cursor. Cheap (string compares only when opacity is actually 0).
      if (dot.style.opacity === '0') reveal(mx, my);
    };

    // Pointer re-enters the window → make sure the cursor is shown again. This
    // is the key fix for "cursor gone after alt-tabbing back": visibilitychange
    // hides it, but only a mousemove used to bring it back.
    const enter = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      snap = true;
      reveal(mx, my);
    };

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
    // On tab re-focus / becoming visible, proactively restore — don't wait for
    // a mousemove that may never come if the pointer is already stationary.
    const vis = () => { if (document.hidden) hide(); else reveal(); };
    const wake = () => { snap = true; reveal(); };

    // RAF watchdog: if the loop ever dies (throw, throttle, bfcache restore),
    // this restarts it so the cursor never freezes permanently. Cheap — one
    // check per second.
    let lastFc = -1;
    const watchdog = setInterval(() => {
      if (fc === lastFc) {
        // tick() hasn't advanced since last check → loop is dead, revive it.
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
      lastFc = fc;
    }, 1000);

    addEventListener('mousemove', move, { passive: true });
    addEventListener('mouseover', over, { passive: true });
    addEventListener('mouseout', out, { passive: true });
    addEventListener('mouseenter', enter, { passive: true });
    addEventListener('blur', hide);
    addEventListener('focus', wake);
    addEventListener('pageshow', wake);
    document.addEventListener('visibilitychange', vis);
    document.documentElement.addEventListener('mouseenter', enter, { passive: true });

    return () => {
      removeEventListener('mousemove', move);
      removeEventListener('mouseover', over);
      removeEventListener('mouseout', out);
      removeEventListener('mouseenter', enter);
      removeEventListener('blur', hide);
      removeEventListener('focus', wake);
      removeEventListener('pageshow', wake);
      document.removeEventListener('visibilitychange', vis);
      document.documentElement.removeEventListener('mouseenter', enter);
      clearInterval(watchdog);
      cancelAnimationFrame(raf);
      // Restore the native cursor — the custom one is no longer running.
      html.classList.remove('ep-cursor-ready');
    };
    // Depends on `finePointer` because the dot/ring refs do not exist until
    // that flips true and the elements are actually rendered.
  }, [finePointer]);

  // Touch device (or reduced motion): render nothing at all. No style block,
  // no elements, no listeners, no rAF loop.
  if (!finePointer) return null;

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
