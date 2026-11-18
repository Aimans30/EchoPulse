'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { WallClip, IcpKey } from '@/lib/videos';
import { staticBookingUrl, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';
import { trackWorkVideoOpen } from '@/lib/analytics';

/**
 * The /work wall: a full-screen bento of every edit, shot like a camera move.
 *
 * - Layout: a pinwheel bento. Each 8x8-cell module holds two tall tiles
 *   (3x5, vertical edits), two wide tiles (5x3, horizontal edits) and one
 *   small square in the middle, with no holes. Modules repeat in both
 *   directions and wrap, so the screen is always full. Clips are dealt into
 *   the slot that matches their shape; adding clips to lib/videos.ts just
 *   makes repeats rarer.
 * - Navigation (mouse): no dragging. The wall glides opposite to the cursor
 *   and stops when the mouse stops. Wheel / trackpad scroll pans too.
 * - Navigation (touch): swipe pans with inertia; focus sits mid-screen.
 * - Camera: the whole wall tilts a few degrees toward the cursor in real
 *   perspective, pulls back slightly while it is moving and settles forward
 *   when it stops, tiles brighten near the cursor and fall off into the dark
 *   away from it, and a vignette plus fine grain sit over everything.
 * - Cursor: a soft light and a small label follow the pointer on a spring,
 *   naming the edit under it. The tile under the cursor lifts and plays;
 *   its nearest neighbours play too.
 *
 * Every per-frame value is written straight to the DOM from one rAF loop.
 * React state only changes for the filter, the viewport size and the
 * lightbox, so moving the mouse never re-renders anything.
 */

const MAX_LIVE = 5;
const MAX_LIVE_TOUCH = 3;

const ICP_CHIPS: Array<{ key: IcpKey | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'real-estate', label: 'Real estate' },
  { key: 'founders', label: 'Founders' },
  { key: 'coaches', label: 'Coaches' },
  { key: 'business-owners', label: 'Business owners' },
  { key: 'dtc', label: 'DTC' },
];

const TYPE_LABEL: Record<string, string> = {
  longform: 'Long-form',
  podcast: 'Podcast',
  talking: 'Talking head',
  realestate: 'Listing',
};

/** The pinwheel: [col, row, cols, rows, shape] inside an 8x8 module. */
const SLOTS: Array<[number, number, number, number, 'tall' | 'wide' | 'square']> = [
  [0, 0, 3, 5, 'tall'],
  [3, 0, 5, 3, 'wide'],
  [5, 3, 3, 5, 'tall'],
  [0, 5, 5, 3, 'wide'],
  [3, 3, 2, 2, 'square'],
];

type Tile = { key: string; x: number; y: number; w: number; h: number; clip: WallClip; first: boolean };
type Grid = { tiles: Tile[]; w: number; h: number; vw: number; vh: number; gain: number; mod: number };

function makeGrid(vw: number, vh: number, clips: WallClip[]): Grid | null {
  if (!clips.length) return null;
  const pitch = Math.round(Math.max(38, Math.min(78, vw / 19)));
  const gap = Math.round(pitch * 0.16);
  const mod = pitch * 8;
  const tall = clips.filter((c) => c.orientation !== 'horizontal');
  const wide = clips.filter((c) => c.orientation === 'horizontal');
  const tallPool = tall.length ? tall : clips;
  const widePool = wide.length ? wide : clips;

  let mc = Math.ceil(vw / mod) + 2;
  let mr = Math.ceil(vh / mod) + 2;
  // Enough modules that every clip gets at least one slot of its own shape.
  while (mc * mr * 2 < tallPool.length || mc * mr * 2 < widePool.length) {
    if (mc <= mr * 1.6) mc++; else mr++;
  }

  const seen = new Set<string>();
  const tiles: Tile[] = [];
  let ti = 0, wi = 0, si = 0;
  // A stride through each pool keeps the same clip from sitting next to itself.
  const stride = (n: number) => {
    let st = Math.max(1, Math.round(n * 0.618));
    const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : x);
    while (gcd(st, n) !== 1) st++;
    return st;
  };
  const ts = stride(tallPool.length), ws = stride(widePool.length), ss = stride(clips.length);
  for (let r = 0; r < mr; r++) {
    for (let c = 0; c < mc; c++) {
      SLOTS.forEach(([sc, sr, cw, ch, shape], k) => {
        const clip =
          shape === 'tall' ? tallPool[(ti++ * ts) % tallPool.length]
          : shape === 'wide' ? widePool[(wi++ * ws) % widePool.length]
          : clips[(si++ * ss + 3) % clips.length];
        const first = !seen.has(clip.id);
        seen.add(clip.id);
        tiles.push({
          key: `${r}-${c}-${k}`,
          x: c * mod + sc * pitch,
          y: r * mod + sr * pitch,
          w: cw * pitch - gap,
          h: ch * pitch - gap,
          clip,
          first,
        });
      });
    }
  }
  const w = mc * mod;
  const h = mr * mod;
  const gain = Math.max(0.9, Math.min(2.2, Math.max(w / vw, h / vh) - 1));
  return { tiles, w, h, vw, vh, gain, mod };
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mod = (v: number, m: number) => ((v % m) + m) % m;

export default function WorkWall({ clips }: { clips: WallClip[] }) {
  const [icp, setIcp] = useState<IcpKey | 'all'>('all');
  const [open, setOpen] = useState<WallClip | null>(null);
  const [view, setView] = useState<{ vw: number; vh: number } | null>(null);
  const [hinted, setHinted] = useState(false);

  // ?niche=real-estate preselects that filter. Read from the URL on mount so
  // /work stays statically rendered; unknown values keep the default.
  useEffect(() => {
    try {
      const n = new URLSearchParams(window.location.search).get('niche');
      if (n && ICP_CHIPS.some((c) => c.key === n && c.key !== 'all')) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIcp(n as IcpKey);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const chipTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const measure = () => {
      const el = stageRef.current;
      if (el) setView({ vw: el.clientWidth, vh: el.clientHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const visible = useMemo(() => (icp === 'all' ? clips : clips.filter((c) => c.icps.includes(icp))), [clips, icp]);
  const grid = useMemo(() => (view ? makeGrid(view.vw, view.vh, visible) : null), [view, visible]);
  const tiles = grid?.tiles;

  const gridRef = useRef<Grid | null>(null);
  useEffect(() => { gridRef.current = grid; }, [grid]);

  const tileEls = useRef<Array<HTMLButtonElement | null>>([]);
  const videoEls = useRef<Array<HTMLVideoElement | null>>([]);

  // Mutable interaction state, kept out of React on purpose.
  const s = useRef({
    mx: 0, my: 0, hover: false,           // raw pointer, stage coords
    fx: 0, fy: 0,                         // smoothed focus point
    cx: 0, cy: 0,                         // smoothed cursor label position
    ox: 0, oy: 0,                         // smoothed wall offset
    bx: 0, by: 0, vx: 0, vy: 0,           // base offset (wheel / touch) + inertia
    tx: 0, ty: 0, dolly: 0,               // smoothed tilt and pull-back
    touching: false, moved: false, sx: 0, sy: 0, lx: 0, ly: 0, lt: 0,
    live: new Set<number>(), focus: -1, born: 0, last: 0, settled: false, init: false,
  });

  useEffect(() => {
    const st = s.current;
    st.born = performance.now();
    st.settled = false;
    st.live = new Set();
    st.focus = -1;
    if (grid && !st.init) {
      st.init = true;
      st.fx = st.cx = grid.vw / 2;
      st.fy = st.cy = grid.vh / 2;
    }
  }, [grid]);

  // The frame loop.
  useEffect(() => {
    if (!grid) return;
    const g = grid;
    const list = g.tiles;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cx = g.vw / 2;
    const cy = g.vh / 2;
    const reach = g.mod * 0.62;           // how far the lift and the light reach
    const hidden = new Uint8Array(list.length);
    const padX = g.vw * 0.08 + 40;        // the tilt exposes a little past the edges
    const padY = g.vh * 0.08 + 40;
    let raf = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const st = s.current;
      const dt = Math.min(0.05, st.last ? (now - st.last) / 1000 : 0.016);
      st.last = now;

      if (!st.touching && (Math.abs(st.vx) > 4 || Math.abs(st.vy) > 4)) {
        st.bx += st.vx * dt;
        st.by += st.vy * dt;
        const decay = Math.exp(-dt / 0.38);
        st.vx *= decay;
        st.vy *= decay;
      }

      const nx = st.hover ? (st.mx - cx) / cx : 0;
      const ny = st.hover ? (st.my - cy) / cy : 0;
      const seen = st.hover || st.mx !== 0 || st.my !== 0; // a mouse has been here
      const tfx = seen ? st.mx : cx;
      const tfy = seen ? st.my : cy;
      const tox = st.bx - nx * cx * g.gain;
      const toy = st.by - ny * cy * g.gain;
      const ease = (tau: number) => (reduce ? 1 : 1 - Math.exp(-dt / tau));
      const pox = st.ox, poy = st.oy, pfx = st.fx, pfy = st.fy, pcx = st.cx, pcy = st.cy, ptx = st.tx, pty = st.ty;
      st.fx += (tfx - st.fx) * ease(0.1);
      st.fy += (tfy - st.fy) * ease(0.1);
      st.cx += (tfx - st.cx) * ease(0.16);
      st.cy += (tfy - st.cy) * ease(0.16);
      st.ox += (tox - st.ox) * ease(0.22);
      st.oy += (toy - st.oy) * ease(0.22);
      st.tx += ((reduce ? 0 : nx) - st.tx) * ease(0.3);
      st.ty += ((reduce ? 0 : ny) - st.ty) * ease(0.3);
      // Pull the camera back a touch while the wall is travelling.
      const speed = Math.hypot(st.ox - pox, st.oy - poy) / dt;
      st.dolly += ((reduce ? 0 : Math.min(1, speed / 2600)) - st.dolly) * ease(0.28);

      const age = (now - st.born) / 1000;
      const intro = !reduce && age < 1.5;
      const moving =
        Math.abs(st.fx - pfx) + Math.abs(st.fy - pfy) + Math.abs(st.ox - pox) + Math.abs(st.oy - poy) +
        Math.abs(st.cx - pcx) + Math.abs(st.cy - pcy) + (Math.abs(st.tx - ptx) + Math.abs(st.ty - pty)) * 200 > 0.02;
      if (!moving && !intro && st.settled) return;
      st.settled = !moving && !intro;

      if (worldRef.current) {
        worldRef.current.style.transform =
          `rotateX(${(-st.ty * 3.2).toFixed(3)}deg) rotateY(${(st.tx * 4.2).toFixed(3)}deg) scale(${(1.07 - st.dolly * 0.045).toFixed(4)})`;
      }
      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${(st.cx - 380).toFixed(1)}px,${(st.cy - 380).toFixed(1)}px,0)`;
        lightRef.current.style.opacity = st.hover ? '1' : '0.55';
      }
      if (chipRef.current) {
        chipRef.current.style.transform = `translate3d(${(st.cx + 20).toFixed(1)}px,${(st.cy + 22).toFixed(1)}px,0)`;
      }

      const maxLive = st.hover ? MAX_LIVE : MAX_LIVE_TOUCH;
      const nearI: number[] = [];
      const nearD: number[] = [];
      let focus = -1;

      for (let i = 0; i < list.length; i++) {
        const t = list[i];
        const el = tileEls.current[i];
        if (!el) continue;
        const X = mod(t.x + t.w / 2 + st.ox - cx + g.w / 2, g.w) - g.w / 2 + cx;
        const Y = mod(t.y + t.h / 2 + st.oy - cy + g.h / 2, g.h) - g.h / 2 + cy;
        const hw = t.w / 2, hh = t.h / 2;
        const off = X + hw < -padX || X - hw > g.vw + padX || Y + hh < -padY || Y - hh > g.vh + padY;
        if (off) {
          if (!hidden[i]) { hidden[i] = 1; el.style.visibility = 'hidden'; }
          continue;
        }
        if (hidden[i]) { hidden[i] = 0; el.style.visibility = ''; }

        // Distance from the focus point to the tile's rectangle (0 inside it).
        const d = Math.hypot(Math.max(Math.abs(X - st.fx) - hw, 0), Math.max(Math.abs(Y - st.fy) - hh, 0));
        const near = 1 / (1 + (d / reach) * (d / reach));
        let k = 1 + 0.035 * near;
        let light = 0.56 + 0.44 * near;
        if (intro) {
          const p = smooth(0, 0.6, age - Math.hypot(X - cx, Y - cy) / 1700);
          const e = 1 - (1 - p) * (1 - p) * (1 - p);
          k *= 0.86 + 0.14 * e;
          light *= e;
        }
        el.style.transform = `translate3d(${(X - hw).toFixed(1)}px,${(Y - hh).toFixed(1)}px,0) scale(${k.toFixed(4)})`;
        el.style.opacity = light.toFixed(3);

        if (d === 0 && st.hover) focus = i;
        if (nearI.length < maxLive || d < nearD[nearD.length - 1]) {
          let j = nearD.length;
          while (j > 0 && nearD[j - 1] > d) j--;
          nearD.splice(j, 0, d);
          nearI.splice(j, 0, i);
          if (nearD.length > maxLive) { nearD.pop(); nearI.pop(); }
        }
      }

      const want = new Set(nearI);
      for (const i of st.live) {
        if (want.has(i)) continue;
        videoEls.current[i]?.pause();
        tileEls.current[i]?.classList.remove('is-live');
      }
      if (!intro) {
        for (const i of want) {
          const v = videoEls.current[i];
          if (!v) continue;
          if (!v.getAttribute('src')) v.src = v.dataset.src ?? '';
          if (v.paused) v.play().catch(() => {});
          tileEls.current[i]?.classList.add('is-live');
        }
        st.live = want;
      }

      if (focus !== st.focus) {
        tileEls.current[st.focus]?.classList.remove('is-focus');
        tileEls.current[focus]?.classList.add('is-focus');
        st.focus = focus;
        const c = focus >= 0 ? list[focus].clip : null;
        if (chipTextRef.current && c) chipTextRef.current.textContent = `${c.brand} · ${c.label}`;
        chipRef.current?.classList.toggle('is-on', focus >= 0);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [grid]);

  // Wheel / trackpad pans the wall.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 32 : 1;
      s.current.bx -= e.deltaX * unit;
      s.current.by -= e.deltaY * unit;
      s.current.settled = false;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const local = (e: React.PointerEvent) => {
    const r = stageRef.current?.getBoundingClientRect();
    return { x: e.clientX - (r?.left ?? 0), y: e.clientY - (r?.top ?? 0) };
  };
  // The mouse is tracked on the whole window, not the stage, so moving onto
  // the filter pills or the booking bar is not mistaken for leaving. Whenever
  // the cursor stops steering (it left the window, or it is over a control),
  // the wall's current position is kept as its resting position, and when
  // steering resumes it carries on from exactly there. Nothing snaps back.
  useEffect(() => {
    const st = s.current;
    const park = () => {
      if (!st.hover) return;
      st.hover = false;
      st.bx = st.ox;
      st.by = st.oy;
      st.settled = false;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const g = gridRef.current;
      const r = stageRef.current?.getBoundingClientRect();
      if (!g || !r) return;
      const overUi = !!(e.target as Element | null)?.closest?.('.ww-top, .ww-cta, .ww-lightbox');
      if (overUi) { park(); return; }
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (!st.hover) {
        // Resume from where the wall is resting.
        st.bx = st.ox + (x - g.vw / 2) * g.gain;
        st.by = st.oy + (y - g.vh / 2) * g.gain;
        st.hover = true;
      }
      st.mx = x;
      st.my = y;
      st.settled = false;
      setHinted(true);
    };
    const onOut = (e: MouseEvent) => { if (!e.relatedTarget) park(); };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('mouseout', onOut);
    window.addEventListener('blur', park);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('blur', park);
    };
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    const st = s.current;
    if (e.pointerType === 'mouse') return;
    const p = local(e);
    if (!st.touching) return;
    const dx = p.x - st.lx;
    const dy = p.y - st.ly;
    if (!st.moved && Math.hypot(p.x - st.sx, p.y - st.sy) > 8) {
      st.moved = true;
      if (!hinted) setHinted(true);
    }
    if (st.moved) {
      st.bx += dx;
      st.by += dy;
      const now = performance.now();
      const dt = Math.max(1, now - st.lt) / 1000;
      st.vx = dx / dt;
      st.vy = dy / dt;
      st.lt = now;
      st.settled = false;
    }
    st.lx = p.x;
    st.ly = p.y;
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return; // no dragging with a mouse
    const st = s.current;
    const p = local(e);
    st.touching = true;
    st.moved = false;
    st.hover = false;
    st.sx = st.lx = p.x;
    st.sy = st.ly = p.y;
    st.lt = performance.now();
    st.vx = st.vy = 0;
  };
  const endTouch = () => {
    const st = s.current;
    if (!st.touching) return;
    st.touching = false;
    if (performance.now() - st.lt > 80) st.vx = st.vy = 0;
  };
  // Lightbox: Escape closes, wall previews pause while it is open.
  useEffect(() => {
    if (!open) return;
    const st = s.current;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    videoEls.current.forEach((v) => v?.pause());
    return () => { window.removeEventListener('keydown', onKey); st.live = new Set(); st.settled = false; };
  }, [open]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: clips.length };
    for (const c of clips) for (const k of c.icps) m[k] = (m[k] ?? 0) + 1;
    return m;
  }, [clips]);

  return (
    <div className="ww">
      <div
        ref={stageRef}
        className="ww-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endTouch}
        onPointerCancel={endTouch}
      >
        <div ref={worldRef} className="ww-world">
          {grid &&
            tiles?.map((t, i) => (
              <button
                key={t.key}
                type="button"
                className="ww-tile"
                ref={(el) => { tileEls.current[i] = el; }}
                style={{ width: t.w, height: t.h, opacity: 0 }}
                tabIndex={t.first ? 0 : -1}
                aria-hidden={t.first ? undefined : true}
                aria-label={`${t.clip.brand}: ${t.clip.label}. Open video.`}
                onClick={() => {
                  if (s.current.moved) return;
                  // The main proof asset: which clip, for which brand. No visitor data.
                  trackWorkVideoOpen(t.clip.label, t.clip.brand);
                  setOpen(t.clip);
                }}
                onFocus={(e) => {
                  // Keyboard: bring the focused tile to the middle of the screen.
                  if (!e.currentTarget.matches(':focus-visible')) return;
                  const st = s.current;
                  st.hover = false;
                  st.bx = grid.vw / 2 - (t.x + t.w / 2);
                  st.by = grid.vh / 2 - (t.y + t.h / 2);
                  st.settled = false;
                }}
              >
                <span className="ww-in">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.clip.poster} alt="" decoding="async" draggable={false} />
                  <video
                    ref={(el) => { videoEls.current[i] = el; }}
                    data-src={t.clip.preview}
                    muted
                    loop
                    playsInline
                    preload="none"
                    onPlaying={(e) => { e.currentTarget.dataset.ready = '1'; }}
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                </span>
              </button>
            ))}
        </div>

        <div ref={lightRef} className="ww-light" aria-hidden="true" />
        <div className="ww-vignette" aria-hidden="true" />
        <div className="ww-grain" aria-hidden="true" />
        <div ref={chipRef} className="ww-cursor" aria-hidden="true">
          <i />
          <span ref={chipTextRef} />
        </div>
      </div>

      <div className="ww-top">
        <Link href="/" className="ww-home" aria-label="EchoPulse Media home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-128.png" alt="" width={28} height={28} />
          <span>EchoPulse</span>
        </Link>
        <div className="ww-chips" role="tablist" aria-label="Filter work by audience">
          {ICP_CHIPS.filter((c) => counts[c.key]).map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={icp === c.key}
              className={`ww-chip${icp === c.key ? ' is-on' : ''}`}
              onClick={() => setIcp(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ww-cta">
        <p>
          <strong>Want edits like these?</strong>
          <span>Free 15-minute call. Your first 2 edits are free.</span>
        </p>
        <a
          href={staticBookingUrl('work_wall_bar')}
          data-track="work_wall_cta_click"
          data-track-location="work_wall_bar"
          target="_blank"
          rel="noopener noreferrer"
          className="ww-book"
        >
          <i className="ww-book-dot" aria-hidden="true" />
          Book a call <span className="ww-book-arrow" aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className={`ww-hint${hinted ? ' is-gone' : ''}`} aria-hidden="true">
        <span className="ww-hint-mouse">Move your mouse to explore · click a video to open it</span>
        <span className="ww-hint-touch">Swipe to explore · tap a video to open it</span>
      </div>

      {open && (
        <div className="ww-lightbox" role="dialog" aria-modal="true" aria-label={`${open.brand}: ${open.label}`} onClick={() => setOpen(null)}>
          <div className="ww-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <video src={open.full} poster={open.poster} controls autoPlay playsInline className="ww-lightbox-video" />
            <div className="ww-lightbox-bar">
              <div>
                <strong>{open.brand}</strong>
                <span>{[open.label, ...open.types.map((t) => TYPE_LABEL[t] ?? t)].filter((v, i, a) => a.indexOf(v) === i).join(' · ')}</span>
              </div>
              <div className="ww-lightbox-actions">
                <a href={FREE_EDITS_URL} data-track="work_wall_cta_click" data-track-location="work_wall_lightbox_free_edits" className="ww-btn ww-btn-primary">{FREE_EDITS_LABEL}</a>
                <a href={staticBookingUrl('work_wall_lightbox')} data-track="work_wall_cta_click" data-track-location="work_wall_lightbox" target="_blank" rel="noopener noreferrer" className="ww-btn">Book a call</a>
                <button type="button" className="ww-btn" onClick={() => setOpen(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}



      <style>{`
        .ww { position: fixed; inset: 0; background: #070706; overflow: hidden; }
        .ww-stage {
          position: absolute; inset: 0; overflow: hidden; cursor: pointer; perspective: 1500px;
          touch-action: none; user-select: none; -webkit-user-select: none;
        }
        .ww-world { position: absolute; inset: 0; transform-origin: 50% 50%; will-change: transform; }
        .ww-tile {
          position: absolute; left: 0; top: 0; padding: 0; border: 0; background: none;
          cursor: pointer; will-change: transform; transform-origin: 50% 50%; outline: none;
        }
        .ww-in {
          position: absolute; inset: 0; display: block; overflow: hidden; border-radius: 18px;
          background: #161513; box-shadow: 0 0 0 1px rgba(255,255,255,0.07);
          transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s cubic-bezier(.16,1,.3,1), border-radius .45s;
        }
        .ww-in img, .ww-in video {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
          pointer-events: none;
        }
        .ww-in video { opacity: 0; transition: opacity .35s ease; }
        .ww-tile.is-live .ww-in video[data-ready] { opacity: 1; }
        .ww-tile.is-focus { z-index: 3; }
        .ww-tile.is-focus .ww-in {
          transform: scale(1.055);
          box-shadow: 0 0 0 1.5px rgba(255,255,255,0.55), 0 30px 70px rgba(0,0,0,0.7), 0 0 60px rgba(232,84,26,0.18);
        }
        .ww-tile:focus-visible .ww-in { box-shadow: 0 0 0 3px #E8541A; }

        .ww-light {
          position: absolute; left: 0; top: 0; width: 760px; height: 760px; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(255,214,170,0.13) 0%, rgba(255,170,110,0.05) 38%, transparent 68%);
          will-change: transform; transition: opacity .6s ease;
        }
        .ww-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 78% 72% at 50% 50%, transparent 46%, rgba(7,7,6,0.62) 82%, rgba(7,7,6,0.94) 100%),
            linear-gradient(to bottom, rgba(7,7,6,0.5), transparent 16%, transparent 84%, rgba(7,7,6,0.5));
        }
        .ww-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>");
        }
        .ww-cursor {
          position: absolute; left: 0; top: 0; z-index: 4; pointer-events: none; will-change: transform;
          display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px 7px 8px; border-radius: 100px;
          background: rgba(12,12,11,0.7); border: 1px solid rgba(255,255,255,0.16);
          -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
          color: #F2EEE7; font: 600 12px Inter, sans-serif; white-space: nowrap;
          opacity: 0; transition: opacity .25s ease;
        }
        .ww-cursor.is-on { opacity: 1; }
        .ww-cursor i {
          width: 20px; height: 20px; border-radius: 50%; background: #E8541A; flex: 0 0 auto; position: relative;
        }
        .ww-cursor i::after {
          content: ''; position: absolute; left: 8px; top: 5.5px;
          border-left: 7px solid #fff; border-top: 4.5px solid transparent; border-bottom: 4.5px solid transparent;
        }

        .ww-top {
          position: absolute; left: 0; right: 0; top: 0; z-index: 5; pointer-events: none;
          display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        }
        .ww-home, .ww-chips { pointer-events: auto; }
        .ww-home {
          display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px 6px 6px; border-radius: 100px;
          background: rgba(12,12,11,0.62); border: 1px solid rgba(255,255,255,0.12);
          -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
          color: #F2EEE7; text-decoration: none; font: 800 13px Inter, sans-serif; letter-spacing: -0.01em;
        }
        .ww-home img { border-radius: 50%; display: block; }
        .ww-chips {
          margin: 0 auto; display: flex; gap: 2px; padding: 4px; border-radius: 100px; max-width: 100%;
          background: rgba(12,12,11,0.62); border: 1px solid rgba(255,255,255,0.12);
          -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
          overflow-x: auto; scrollbar-width: none;
        }
        .ww-chips::-webkit-scrollbar { display: none; }
        .ww-chip {
          font: 600 13px Inter, sans-serif; color: rgba(242,238,231,0.72); cursor: pointer; white-space: nowrap;
          padding: 8px 14px; border-radius: 100px; background: transparent; border: 0; flex: 0 0 auto;
          transition: background .2s, color .2s;
        }
        .ww-chip:hover { color: #F2EEE7; }
        .ww-chip.is-on { background: #F2EEE7; color: #0C0C0B; }
        .ww-cta {
          position: absolute; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 5;
          display: flex; align-items: center; gap: 18px; padding: 8px 8px 8px 22px; border-radius: 100px; max-width: calc(100% - 24px);
          background: rgba(12,12,11,0.72); border: 1px solid rgba(255,255,255,0.14);
          -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.55);
        }
        .ww-cta p { margin: 0; display: flex; flex-direction: column; gap: 1px; font-family: Inter, sans-serif; min-width: 0; }
        .ww-cta strong { font-size: 14px; font-weight: 800; color: #F2EEE7; letter-spacing: -0.01em; white-space: nowrap; }
        .ww-cta p span { font-size: 12px; color: rgba(242,238,231,0.66); white-space: nowrap; }
        .ww-book {
          display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 18px; border-radius: 100px;
          background: #E8541A; color: #fff; text-decoration: none; font: 800 14px Inter, sans-serif; white-space: nowrap; min-height: 46px; padding: 0 22px; flex: 0 0 auto;
          box-shadow: 0 10px 30px rgba(232,84,26,0.35); transition: background .2s, transform .2s;
        }
        .ww-book { position: relative; overflow: hidden; isolation: isolate; animation: ww-glow 2.8s ease-in-out infinite; }
        .ww-book::before {
          content: ''; position: absolute; top: 0; bottom: 0; left: -60%; width: 45%; z-index: -1;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.42), transparent);
          transform: skewX(-18deg); animation: ww-shine 3.6s cubic-bezier(.4,0,.2,1) infinite;
        }
        .ww-book-dot { width: 7px; height: 7px; border-radius: 50%; background: #fff; flex: 0 0 auto; animation: ww-dot 1.6s ease-in-out infinite; }
        .ww-book-arrow { display: inline-block; animation: ww-arrow 1.8s ease-in-out infinite; }
        .ww-book:hover { background: #FF6A2B; transform: translateY(-1px) scale(1.03); }
        .ww-book:active { transform: scale(0.96); }
        .ww-cta { animation: ww-rise .7s cubic-bezier(.16,1,.3,1) .5s both; }
        @keyframes ww-rise { from { opacity: 0; transform: translate(-50%, 26px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes ww-shine { 0%, 55% { left: -60%; } 100% { left: 130%; } }
        @keyframes ww-glow {
          0%, 100% { box-shadow: 0 10px 30px rgba(232,84,26,0.35), 0 0 0 0 rgba(232,84,26,0.5); }
          50% { box-shadow: 0 10px 34px rgba(232,84,26,0.5), 0 0 0 9px rgba(232,84,26,0); }
        }
        @keyframes ww-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .45; transform: scale(.7); } }
        @keyframes ww-arrow { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
        .ww-chip:focus-visible, .ww-home:focus-visible, .ww-book:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

        .ww-hint {
          position: absolute; left: 50%; bottom: 96px; transform: translateX(-50%); z-index: 5;
          padding: 8px 14px; border-radius: 100px; background: rgba(12,12,11,0.72);
          border: 1px solid rgba(255,255,255,0.14); color: #F2EEE7;
          font: 600 12px Inter, sans-serif; white-space: nowrap; pointer-events: none;
          transition: opacity .5s ease;
        }
        .ww-hint.is-gone { opacity: 0; }
        .ww-hint-touch { display: none; }
        @media (hover: none) {
          .ww-hint-mouse, .ww-cursor, .ww-light { display: none; }
          .ww-hint-touch { display: inline; }
        }

        .ww-lightbox {
          position: fixed; inset: 0; z-index: 10000; background: rgba(8,8,7,0.94);
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .ww-lightbox-inner { max-width: min(1100px, 100%); max-height: 100%; display: flex; flex-direction: column; gap: 12px; }
        .ww-lightbox-video { max-width: 100%; max-height: calc(100vh - 150px); border-radius: 14px; background: #000; align-self: center; }
        .ww-lightbox-bar {
          display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between;
          color: #F2EEE7; font-family: Inter, sans-serif;
        }
        .ww-lightbox-bar strong { display: block; font-size: 15px; }
        .ww-lightbox-bar span { font-size: 12.5px; color: rgba(242,238,231,0.66); }
        .ww-lightbox-actions { display: flex; flex-wrap: wrap; gap: 8px; }
        .ww-btn {
          font: 700 13px Inter, sans-serif; padding: 10px 16px; border-radius: 100px; cursor: pointer;
          color: #F2EEE7; background: transparent; border: 1px solid rgba(242,238,231,0.3); text-decoration: none;
        }
        .ww-btn-primary { background: #E8541A; border-color: #E8541A; color: #fff; }
        .ww-btn:focus-visible { outline: 2px solid #E8541A; outline-offset: 2px; }



        @media (max-width: 350px) {
          .ww-cta strong { font-size: 12px !important; }
          .ww-book { padding: 0 13px !important; font-size: 13px; }
        }
        @media (max-width: 640px) {
          .ww-top { padding: max(10px, env(safe-area-inset-top)) 10px 10px; gap: 8px; }
          .ww-chips {
            -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
            mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
            padding-right: 22px; scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch; overscroll-behavior: contain;
          }
          .ww-chip { padding: 9px 13px; scroll-snap-align: start; }
          .ww-home img { width: 32px; height: 32px; }
          .ww-home span { display: none; }
          .ww-home { padding: 6px; }
          .ww-chips { margin: 0; min-width: 0; flex: 1 1 auto; }
          .ww-cta {
            gap: 10px; padding: 6px 6px 6px 16px; bottom: max(14px, env(safe-area-inset-bottom));
            width: calc(100% - 20px); max-width: 420px; justify-content: space-between;
          }
          .ww-cta strong { overflow: hidden; text-overflow: ellipsis; }
          .ww-lightbox { padding: 12px; }
          .ww-lightbox-actions, .ww-lightbox-actions .ww-btn { width: 100%; text-align: center; }
          .ww-lightbox-actions .ww-btn { flex: 1 1 0; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; }
          .ww-lightbox-video { max-height: calc(100dvh - 190px); }
          .ww-cta p span { display: none; }
          .ww-cta strong { font-size: 13px; }
          .ww-book { padding: 0 16px; min-height: 42px; }
          .ww-hint { bottom: 80px; }
          .ww-in { border-radius: 12px; }
          .ww-hint { font-size: 11px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ww-in, .ww-in video, .ww-hint, .ww-cursor { transition: none; }
          .ww-book, .ww-book::before, .ww-book-dot, .ww-book-arrow, .ww-cta { animation: none; }
        }
      `}</style>
    </div>
  );
}
