'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { WallClip, IcpKey } from '@/lib/videos';
import { BOOK_CALL_URL, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';

/**
 * The /work wall: a full-screen honeycomb of every edit, navigated the way
 * the Apple Watch home screen is, but with the cursor instead of a finger.
 *
 * - Layout: circular tiles on a hex grid that wraps in both directions, so
 *   the screen is always full no matter how few clips a filter leaves. Clips
 *   repeat to fill the grid; adding clips to lib/videos.ts just makes the
 *   repeats rarer.
 * - Navigation (mouse): no dragging. The wall glides opposite to the cursor,
 *   so sweeping the mouse across the screen sweeps you across the wall, and
 *   it stops the moment the mouse stops. Wheel / trackpad scroll pans too.
 * - Navigation (touch): there is no cursor, so a swipe pans with inertia and
 *   the lens sits in the middle of the screen, exactly like the watch.
 * - Lens: tiles swell toward the cursor and neighbours are pushed outward by
 *   the integral of that swell, so nothing ever overlaps. Tiles also shrink
 *   toward the screen edges, which gives the domed look.
 * - Playback: the few tiles nearest the lens play a small muted preview;
 *   everything else is a still poster. Click a tile for the full video.
 *
 * Every per-frame value is written straight to the DOM from one rAF loop.
 * React state only changes for the filter, the viewport size and the
 * lightbox, so moving the mouse never re-renders anything.
 */

const LENS = 1.25;          // extra scale at the lens centre (1 + LENS = 2.25x)
const MAX_LIVE = 7;         // centre tile + its six neighbours
const MAX_LIVE_TOUCH = 4;

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

type Grid = {
  d: number; lay: number; dx: number; dy: number; cols: number; rows: number;
  w: number; h: number; vw: number; vh: number; gain: number;
};

/** Hex grid big enough to cover the screen and to show every clip once. */
function makeGrid(vw: number, vh: number, n: number): Grid {
  const d = Math.round(Math.max(78, Math.min(168, vw < 700 ? vw / 4.6 : vw / 9.5)));
  const dx = Math.round(d * 1.06);
  const dy = dx * 0.866;
  let cols = Math.ceil(vw / dx) + 3;
  let rows = Math.ceil(vh / dy) + 3;
  if (rows % 2) rows++;
  while (cols * rows < n) { cols++; if (cols * rows < n) rows += 2; }
  // Keep the clip pattern from lining up into columns of the same video.
  if (n > 3) while (cols % n === 0 || cols % n === 1 || cols % n === n - 1) cols++;
  const w = cols * dx;
  const h = rows * dy;
  // How far one full sweep of the mouse travels: enough to cross one period.
  const gain = Math.max(0.9, Math.min(2.4, Math.max(w / vw, h / vh) - 1));
  return { d, lay: Math.round(d * 1.5), dx, dy, cols, rows, w, h, vw, vh, gain };
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
  const captionRef = useRef<HTMLDivElement>(null);

  // Viewport size drives the grid. Measured after mount (the server has no
  // window), then on resize.
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

  const grid = useMemo(() => (view ? makeGrid(view.vw, view.vh, visible.length) : null), [view, visible.length]);

  // One tile per grid cell; clips are dealt out with a stride so the same
  // video is never next to itself.
  const tiles = useMemo(() => {
    if (!grid || !visible.length) return [];
    const n = visible.length;
    let step = Math.max(1, Math.round(n * 0.618));
    const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
    while (gcd(step, n) !== 1) step++;
    const seen = new Set<string>();
    const out: Array<{ key: string; col: number; row: number; clip: WallClip; first: boolean }> = [];
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const clip = visible[((r * grid.cols + c) * step) % n];
        const first = !seen.has(clip.id);
        seen.add(clip.id);
        out.push({ key: `${r}-${c}`, col: c, row: r, clip, first });
      }
    }
    return out;
  }, [grid, visible]);

  const tileEls = useRef<Array<HTMLButtonElement | null>>([]);
  const videoEls = useRef<Array<HTMLVideoElement | null>>([]);

  // Mutable interaction state, kept out of React on purpose.
  const s = useRef({
    mx: 0, my: 0, hover: false,           // raw pointer, stage coords
    fx: 0, fy: 0,                         // smoothed lens position
    ox: 0, oy: 0,                         // smoothed wall offset
    bx: 0, by: 0, vx: 0, vy: 0,           // base offset (wheel / touch) + inertia
    touching: false, moved: false, sx: 0, sy: 0, lx: 0, ly: 0, lt: 0,
    live: new Set<number>(), born: 0, last: 0, settled: false, init: false,
    caption: '',
  });

  // Restart the intro and force a repaint whenever the tile set changes.
  useEffect(() => {
    const st = s.current;
    st.born = performance.now();
    st.settled = false;
    st.live = new Set();
    if (grid && !st.init) {
      st.init = true;
      st.fx = grid.vw / 2;
      st.fy = grid.vh / 2;
    }
  }, [tiles, grid]);

  // The frame loop.
  useEffect(() => {
    if (!grid || !tiles.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const g = grid;
    const cx = g.vw / 2;
    const cy = g.vh / 2;
    const sigma = g.d * 1.2;
    const k0 = g.d / g.lay;
    const half = g.lay / 2;
    const hidden = new Uint8Array(tiles.length);
    let raf = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const st = s.current;
      const dt = Math.min(0.05, st.last ? (now - st.last) / 1000 : 0.016);
      st.last = now;

      // Touch inertia on the base offset.
      if (!st.touching && (Math.abs(st.vx) > 4 || Math.abs(st.vy) > 4)) {
        st.bx += st.vx * dt;
        st.by += st.vy * dt;
        const decay = Math.exp(-dt / 0.38);
        st.vx *= decay;
        st.vy *= decay;
      }

      // Targets: the lens follows the cursor, the wall runs opposite to it.
      const tfx = st.hover ? st.mx : cx;
      const tfy = st.hover ? st.my : cy;
      const tox = st.bx + (st.hover ? -(st.mx - cx) * g.gain : 0);
      const toy = st.by + (st.hover ? -(st.my - cy) * g.gain : 0);
      const aF = reduce ? 1 : 1 - Math.exp(-dt / 0.085);
      const aO = reduce ? 1 : 1 - Math.exp(-dt / 0.17);
      const pfx = st.fx, pfy = st.fy, pox = st.ox, poy = st.oy;
      st.fx += (tfx - st.fx) * aF;
      st.fy += (tfy - st.fy) * aF;
      st.ox += (tox - st.ox) * aO;
      st.oy += (toy - st.oy) * aO;

      const age = (now - st.born) / 1000;
      const intro = !reduce && age < 1.6;
      const moving =
        Math.abs(st.fx - pfx) + Math.abs(st.fy - pfy) + Math.abs(st.ox - pox) + Math.abs(st.oy - poy) > 0.02;
      if (!moving && !intro && st.settled) return;
      st.settled = !moving && !intro;

      const maxLive = st.hover ? MAX_LIVE : MAX_LIVE_TOUCH;
      const nearI: number[] = [];
      const nearD: number[] = [];

      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        const el = tileEls.current[i];
        if (!el) continue;
        // Grid position, wrapped around the middle of the screen.
        const x = mod(t.col * g.dx + (t.row & 1 ? g.dx / 2 : 0) + st.ox - cx + g.w / 2, g.w) - g.w / 2 + cx;
        const y = mod(t.row * g.dy + st.oy - cy + g.h / 2, g.h) - g.h / 2 + cy;
        // Lens: swell by a Lorentzian, push out by its integral.
        const ddx = x - st.fx;
        const ddy = y - st.fy;
        const d = Math.hypot(ddx, ddy);
        const u = d / sigma;
        const swell = 1 + LENS / (1 + u * u);
        const push = d > 0.01 ? (d + LENS * sigma * Math.atan(u)) / d : 1;
        // The push spreads tiles a little more around the lens than along
        // it; growing them by a fraction of that difference closes the gaps
        // without ever letting two tiles touch.
        const fill = Math.pow(push / swell, 0.25);
        const X = st.fx + ddx * push;
        const Y = st.fy + ddy * push;

        const off = X < -g.lay || X > g.vw + g.lay || Y < -g.lay || Y > g.vh + g.lay;
        if (off) {
          if (!hidden[i]) { hidden[i] = 1; el.style.visibility = 'hidden'; }
          continue;
        }
        if (hidden[i]) { hidden[i] = 0; el.style.visibility = ''; }

        // Dome: shrink toward the screen edges.
        const edge = 1 - 0.36 * smooth(0.7, 1.4, Math.hypot((X - cx) / cx, (Y - cy) / cy));
        let k = swell * fill * edge;
        if (intro) {
          const p = smooth(0, 0.55, age - Math.hypot(x - cx, y - cy) / 1500);
          k *= 1 - (1 - p) * (1 - p) * (1 - p);
        }
        el.style.transform = `translate3d(${(X - half).toFixed(1)}px,${(Y - half).toFixed(1)}px,0) scale(${(k * k0).toFixed(4)})`;

        // Keep the few tiles nearest the lens, sorted.
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

      const top = nearI.length ? tiles[nearI[0]].clip : null;
      const text = top ? `${top.brand} · ${top.label}` : '';
      if (text !== st.caption && captionRef.current) {
        st.caption = text;
        captionRef.current.textContent = text;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [grid, tiles]);

  // Wheel / trackpad pans the wall. Needs a non-passive listener to stop the
  // browser's back-swipe and page bounce.
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
  const onPointerMove = (e: React.PointerEvent) => {
    const st = s.current;
    const p = local(e);
    if (e.pointerType === 'mouse') {
      st.mx = p.x;
      st.my = p.y;
      st.hover = true;
      st.settled = false;
      if (!hinted) setHinted(true);
      return;
    }
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
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    s.current.hover = false;
    s.current.settled = false;
  };

  // Lightbox: Escape closes, wall previews pause while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    videoEls.current.forEach((v) => v?.pause());
    return () => { window.removeEventListener('keydown', onKey); s.current.live = new Set(); s.current.settled = false; };
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
        onPointerLeave={onLeave}
      >
        {grid &&
          tiles.map((t, i) => (
            <button
              key={t.key}
              type="button"
              className="ww-tile"
              ref={(el) => { tileEls.current[i] = el; }}
              style={{ width: grid.lay, height: grid.lay, transform: 'translate3d(-999px,-999px,0) scale(0)' }}
              tabIndex={t.first ? 0 : -1}
              aria-hidden={t.first ? undefined : true}
              aria-label={`${t.clip.brand}: ${t.clip.label}. Open video.`}
              onClick={() => { if (!s.current.moved) setOpen(t.clip); }}
              onFocus={(e) => {
                // Keyboard: bring the focused tile under the lens.
                if (!e.currentTarget.matches(':focus-visible')) return;
                const st = s.current;
                st.hover = false;
                st.bx = grid.vw / 2 - (t.col * grid.dx + (t.row & 1 ? grid.dx / 2 : 0));
                st.by = grid.vh / 2 - t.row * grid.dy;
                st.settled = false;
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.clip.poster} alt="" decoding="async" draggable={false} />
              <video
                ref={(el) => { videoEls.current[i] = el; }}
                data-src={t.clip.preview}
                muted
                loop
                playsInline
                preload="none"
                tabIndex={-1}
                aria-hidden="true"
              />
            </button>
          ))}

        <div className="ww-vignette" aria-hidden="true" />
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

      <div ref={captionRef} className="ww-caption" aria-hidden="true" />
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
                <a href={FREE_EDITS_URL} className="ww-btn ww-btn-primary">{FREE_EDITS_LABEL}</a>
                <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="ww-btn">Book a call</a>
                <button type="button" className="ww-btn" onClick={() => setOpen(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}


      <style>{`
        .ww { position: fixed; inset: 0; background: #0A0A09; overflow: hidden; }
        .ww-stage {
          position: absolute; inset: 0; overflow: hidden; cursor: pointer;
          touch-action: none; user-select: none; -webkit-user-select: none;
        }
        .ww-tile {
          position: absolute; left: 0; top: 0; padding: 0; border: 0; border-radius: 50%;
          background: #1a1917; cursor: pointer; overflow: hidden;
          clip-path: circle(50%); will-change: transform; transform-origin: 50% 50%;
          contain: layout paint; outline: none;
        }
        .ww-tile img, .ww-tile video {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
          pointer-events: none;
        }
        .ww-tile video { opacity: 0; transition: opacity .3s ease; }
        .ww-tile.is-live video { opacity: 1; }
        .ww-tile::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.08); pointer-events: none;
        }
        .ww-tile:focus-visible::after { box-shadow: inset 0 0 0 5px #E8541A; }
        .ww-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 55%, rgba(10,10,9,0.55) 100%);
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
        .ww-chip:focus-visible, .ww-home:focus-visible { outline: 2px solid #E8541A; outline-offset: 2px; }

        .ww-caption {
          position: absolute; left: 18px; bottom: 18px; z-index: 5; pointer-events: none;
          font: 600 12.5px Inter, sans-serif; color: rgba(242,238,231,0.78);
          text-shadow: 0 1px 12px rgba(0,0,0,0.9);
        }
        .ww-hint {
          position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); z-index: 5;
          padding: 8px 14px; border-radius: 100px; background: rgba(12,12,11,0.72);
          border: 1px solid rgba(255,255,255,0.14); color: #F2EEE7;
          font: 600 12px Inter, sans-serif; white-space: nowrap; pointer-events: none;
          transition: opacity .5s ease;
        }
        .ww-hint.is-gone { opacity: 0; }
        .ww-hint-touch { display: none; }
        @media (hover: none) {
          .ww-hint-mouse { display: none; }
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


        @media (max-width: 640px) {
          .ww-top { padding: 12px; gap: 8px; }
          .ww-home span { display: none; }
          .ww-home { padding: 6px; }
          .ww-chips { margin: 0; min-width: 0; flex: 0 1 auto; }
          .ww-caption { display: none; }
          .ww-hint { font-size: 11px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ww-tile video, .ww-hint { transition: none; }
        }
      `}</style>
    </div>
  );
}
