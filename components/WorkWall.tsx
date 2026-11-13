'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { WallClip, IcpKey } from '@/lib/videos';
import { BOOK_CALL_URL, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';

/**
 * The /work wall: every edit in one tight bento mosaic you drag around.
 *
 * - Layout: vertical clips are 3x5 cells, horizontal 5x3, packed first-fit
 *   into a wide grid. Holes the packer leaves are filled with small brand
 *   tiles so the wall is a solid rectangle with no ragged gaps.
 * - Navigation: drag (or swipe) the whole wall in any direction; it keeps
 *   gliding after you let go and rubber-bands at the edges. Arrow keys pan.
 * - Cursor radius: tiles within RADIUS px of the pointer play a small muted
 *   preview; everything else is a still poster. At most MAX_LIVE play at once,
 *   nearest first, so a wall of 200 clips costs the same as a wall of 20.
 *   With no hover (touch), the tiles nearest the centre of the view play.
 * - Click a tile (without dragging) to open the full video with sound.
 *
 * Positions and the per-frame proximity pass are written straight to the DOM
 * through refs; React state only changes for filters, orientation fixes and
 * the lightbox, so dragging never re-renders the tree.
 */

const CELL = 64;
const GAP = 8;
const PITCH = CELL + GAP;
const RADIUS = 260;
const MAX_LIVE = 5;
const MAX_LIVE_TOUCH = 3;

const ICP_CHIPS: Array<{ key: IcpKey | 'all'; label: string }> = [
  { key: 'all', label: 'All work' },
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

type Placed =
  | { kind: 'clip'; clip: WallClip; x: number; y: number; w: number; h: number }
  | { kind: 'fill'; id: string; x: number; y: number; w: number; h: number; cw: number; ch: number; n: number };

const px = (cells: number) => cells * CELL + (cells - 1) * GAP;

/** First-fit bento packing, then fill the holes. Coordinates in pixels. */
function pack(clips: WallClip[], horizontal: (c: WallClip) => boolean): { items: Placed[]; width: number; height: number } {
  const area = clips.reduce((a) => a + 15, 0);
  // Aim for a wall roughly twice as wide as it is tall, never narrower than
  // a laptop screen, so there is somewhere to drag to in both directions.
  const cols = Math.max(22, Math.ceil(Math.sqrt(area * 2.1)));
  const grid: boolean[][] = [];
  const free = (r: number, c: number) => !(grid[r]?.[c]);
  const fits = (r: number, c: number, w: number, h: number) => {
    if (c + w > cols) return false;
    for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) if (!free(r + i, c + j)) return false;
    return true;
  };
  const mark = (r: number, c: number, w: number, h: number) => {
    for (let i = 0; i < h; i++) {
      grid[r + i] ??= [];
      for (let j = 0; j < w; j++) grid[r + i][c + j] = true;
    }
  };

  const items: Placed[] = [];
  let rows = 0;
  for (const clip of clips) {
    const [w, h] = horizontal(clip) ? [5, 3] : [3, 5];
    let placed = false;
    for (let r = 0; !placed; r++) {
      for (let c = 0; c + w <= cols; c++) {
        if (fits(r, c, w, h)) {
          mark(r, c, w, h);
          items.push({ kind: 'clip', clip, x: c * PITCH, y: r * PITCH, w: px(w), h: px(h) });
          rows = Math.max(rows, r + h);
          placed = true;
          break;
        }
      }
    }
  }

  // Fill what is left inside the bounding rectangle with brand tiles, taking
  // the widest run available (capped at 5x5) at each empty cell.
  let n = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!free(r, c)) continue;
      let w = 1;
      while (w < 5 && c + w < cols && free(r, c + w)) w++;
      let h = 1;
      while (h < 5 && r + h < rows && fits(r + h, c, w, 1)) h++;
      mark(r, c, w, h);
      items.push({ kind: 'fill', id: `f-${r}-${c}`, x: c * PITCH, y: r * PITCH, w: px(w), h: px(h), cw: w, ch: h, n: n++ });
    }
  }
  return { items, width: cols * PITCH - GAP, height: rows * PITCH - GAP };
}

const FILL_TEXT = ['48h turnaround', 'Cut by Lakshya', 'Your footage next', 'Re-done until right', 'First 2 edits free'];

export default function WorkWall({ clips }: { clips: WallClip[] }) {
  const [icp, setIcp] = useState<IcpKey | 'all'>('all');
  const [orient, setOrient] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<WallClip | null>(null);
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

  const isHorizontal = useCallback(
    (c: WallClip) => orient[c.id] ?? c.orientation === 'horizontal',
    [orient],
  );
  const visible = useMemo(() => (icp === 'all' ? clips : clips.filter((c) => c.icps.includes(icp))), [clips, icp]);
  const layout = useMemo(() => pack(visible, isHorizontal), [visible, isHorizontal]);

  // Mutable interaction state, kept out of React on purpose.
  const s = useRef({
    x: 0, y: 0, vx: 0, vy: 0,
    dragging: false, moved: false, startX: 0, startY: 0, lastX: 0, lastY: 0, lastT: 0,
    px: -1, py: -1, hover: false, dirty: true, live: new Set<string>(),
  });

  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const tileEls = useRef(new Map<string, HTMLElement>());
  const videoEls = useRef(new Map<string, HTMLVideoElement>());
  const layoutRef = useRef(layout);
  useEffect(() => { layoutRef.current = layout; s.current.dirty = true; }, [layout]);

  const bounds = useCallback(() => {
    const st = stageRef.current;
    const { width, height } = layoutRef.current;
    const vw = st?.clientWidth ?? 0;
    const vh = st?.clientHeight ?? 0;
    const pad = 28;
    return {
      vw, vh,
      minX: width + pad * 2 <= vw ? (vw - width) / 2 : vw - width - pad,
      maxX: width + pad * 2 <= vw ? (vw - width) / 2 : pad,
      minY: height + pad * 2 <= vh ? (vh - height) / 2 : vh - height - pad,
      maxY: height + pad * 2 <= vh ? (vh - height) / 2 : pad,
    };
  }, []);

  // Centre the wall whenever the layout changes (first paint, filter change).
  useEffect(() => {
    const b = bounds();
    s.current.x = (b.minX + b.maxX) / 2;
    s.current.y = (b.minY + b.maxY) / 2;
    s.current.vx = s.current.vy = 0;
    s.current.dirty = true;
  }, [layout.width, layout.height, bounds]);

  // The frame loop: inertia, edge spring, transform, proximity playback.
  useEffect(() => {
    let raf = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = () => {
      const st = s.current;
      const b = bounds();
      if (!st.dragging) {
        if (Math.abs(st.vx) > 0.02 || Math.abs(st.vy) > 0.02) {
          st.x += st.vx * 16;
          st.y += st.vy * 16;
          st.vx *= reduce ? 0 : 0.94;
          st.vy *= reduce ? 0 : 0.94;
          st.dirty = true;
        }
        // Spring back inside the bounds.
        const tx = Math.min(b.maxX, Math.max(b.minX, st.x));
        const ty = Math.min(b.maxY, Math.max(b.minY, st.y));
        if (Math.abs(tx - st.x) > 0.3 || Math.abs(ty - st.y) > 0.3) {
          st.x += (tx - st.x) * 0.18;
          st.y += (ty - st.y) * 0.18;
          st.vx *= 0.6;
          st.vy *= 0.6;
          st.dirty = true;
        }
      }
      if (st.dirty && worldRef.current) {
        st.dirty = false;
        worldRef.current.style.transform = `translate3d(${st.x.toFixed(1)}px, ${st.y.toFixed(1)}px, 0)`;

        // Proximity: distance from the probe point to each clip's rectangle.
        const probeX = st.hover ? st.px : b.vw / 2;
        const probeY = st.hover ? st.py : b.vh / 2;
        const radius = st.hover ? RADIUS : Math.min(b.vw, b.vh) * 0.45;
        const near: Array<{ id: string; d: number }> = [];
        for (const it of layoutRef.current.items) {
          if (it.kind !== 'clip') continue;
          const left = it.x + st.x;
          const top = it.y + st.y;
          const dx = Math.max(left - probeX, 0, probeX - (left + it.w));
          const dy = Math.max(top - probeY, 0, probeY - (top + it.h));
          const d = Math.hypot(dx, dy);
          const el = tileEls.current.get(it.clip.id);
          if (el) {
            // Soft falloff toward the edges of the view, like the watch grid.
            const cx = left + it.w / 2 - b.vw / 2;
            const cy = top + it.h / 2 - b.vh / 2;
            const edge = Math.min(1, Math.hypot(cx / (b.vw / 2 + it.w), cy / (b.vh / 2 + it.h)));
            el.style.opacity = reduce ? '1' : (1 - edge * edge * 0.45).toFixed(3);
          }
          if (d <= radius) near.push({ id: it.clip.id, d });
        }
        near.sort((a, z) => a.d - z.d);
        const want = new Set(near.slice(0, st.hover ? MAX_LIVE : MAX_LIVE_TOUCH).map((n) => n.id));
        for (const id of st.live) {
          if (want.has(id)) continue;
          videoEls.current.get(id)?.pause();
          tileEls.current.get(id)?.classList.remove('is-live');
        }
        for (const id of want) {
          const v = videoEls.current.get(id);
          if (!v) continue;
          if (!v.src) v.src = v.dataset.src ?? '';
          if (v.paused) v.play().catch(() => {});
          tileEls.current.get(id)?.classList.add('is-live');
        }
        st.live = want;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onResize = () => { s.current.dirty = true; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [bounds]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const st = s.current;
    st.dragging = true;
    st.moved = false;
    st.startX = st.lastX = e.clientX;
    st.startY = st.lastY = e.clientY;
    st.lastT = performance.now();
    st.vx = st.vy = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const st = s.current;
    const rect = stageRef.current?.getBoundingClientRect();
    if (rect) {
      st.px = e.clientX - rect.left;
      st.py = e.clientY - rect.top;
      st.hover = e.pointerType === 'mouse';
    }
    if (st.dragging) {
      const dx = e.clientX - st.lastX;
      const dy = e.clientY - st.lastY;
      if (!st.moved && Math.hypot(e.clientX - st.startX, e.clientY - st.startY) > 6) {
        st.moved = true;
        stageRef.current?.setPointerCapture(e.pointerId);
        stageRef.current?.classList.add('is-dragging');
        if (!hinted) setHinted(true);
      }
      if (st.moved) {
        const b = bounds();
        // Resist past the edge instead of stopping dead.
        const over = (v: number, lo: number, hi: number) => (v < lo || v > hi ? 0.35 : 1);
        st.x += dx * over(st.x, b.minX, b.maxX);
        st.y += dy * over(st.y, b.minY, b.maxY);
        const now = performance.now();
        const dt = Math.max(1, now - st.lastT);
        st.vx = dx / dt;
        st.vy = dy / dt;
        st.lastT = now;
      }
      st.lastX = e.clientX;
      st.lastY = e.clientY;
    }
    st.dirty = true;
  };
  const endDrag = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    stageRef.current?.classList.remove('is-dragging');
    if (st.moved) stageRef.current?.releasePointerCapture?.(e.pointerId);
    // A stale velocity (pointer held still before release) should not fling.
    if (performance.now() - st.lastT > 80) st.vx = st.vy = 0;
  };
  const onLeave = () => { s.current.hover = false; s.current.dirty = true; };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 160;
    const st = s.current;
    if (e.key === 'ArrowLeft') st.x += step;
    else if (e.key === 'ArrowRight') st.x -= step;
    else if (e.key === 'ArrowUp') st.y += step;
    else if (e.key === 'ArrowDown') st.y -= step;
    else return;
    e.preventDefault();
    st.dirty = true;
  };

  // Lightbox: Escape closes, body scroll locked while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: clips.length };
    for (const c of clips) for (const k of c.icps) m[k] = (m[k] ?? 0) + 1;
    return m;
  }, [clips]);

  return (
    <div className="ww">
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
            {c.label} <span>{counts[c.key]}</span>
          </button>
        ))}
      </div>

      <div
        ref={stageRef}
        className="ww-stage"
        tabIndex={0}
        role="application"
        aria-label="Video wall. Drag or use the arrow keys to move around; press Enter on a video to open it."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={onLeave}
        onKeyDown={onKeyDown}
      >
        <div ref={worldRef} className="ww-world" style={{ width: layout.width, height: layout.height }}>
          {layout.items.map((it) =>
            it.kind === 'clip' ? (
              <button
                key={it.clip.id}
                type="button"
                className="ww-tile"
                ref={(el) => { if (el) tileEls.current.set(it.clip.id, el); else tileEls.current.delete(it.clip.id); }}
                style={{ width: it.w, height: it.h, transform: `translate3d(${it.x}px, ${it.y}px, 0)` }}
                aria-label={`${it.clip.brand}: ${it.clip.label}. Open video.`}
                onClick={() => { if (!s.current.moved) setOpen(it.clip); }}
                onFocus={() => {
                  // Bring a keyboard-focused tile to the middle of the view.
                  const b = bounds();
                  s.current.x = b.vw / 2 - (it.x + it.w / 2);
                  s.current.y = b.vh / 2 - (it.y + it.h / 2);
                  s.current.dirty = true;
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.clip.poster}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    const h = img.naturalWidth > img.naturalHeight;
                    if (h !== (orient[it.clip.id] ?? it.clip.orientation === 'horizontal')) {
                      setOrient((o) => ({ ...o, [it.clip.id]: h }));
                    }
                  }}
                />
                <video
                  ref={(el) => { if (el) videoEls.current.set(it.clip.id, el); else videoEls.current.delete(it.clip.id); }}
                  data-src={it.clip.preview}
                  muted
                  loop
                  playsInline
                  preload="none"
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <span className="ww-meta">
                  <strong>{it.clip.brand}</strong>
                  <em>{it.clip.label}</em>
                </span>
              </button>
            ) : (
              <div
                key={it.id}
                className={`ww-fill ww-fill-${it.n % 3}`}
                style={{ width: it.w, height: it.h, transform: `translate3d(${it.x}px, ${it.y}px, 0)` }}
                aria-hidden="true"
              >
                {it.cw >= 3 && it.ch >= 2 ? <span>{FILL_TEXT[it.n % FILL_TEXT.length]}</span> : null}
              </div>
            ),
          )}
        </div>
        <div className={`ww-hint${hinted ? ' is-gone' : ''}`} aria-hidden="true">Drag to explore · hover to play · click to open</div>
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
        .ww-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; padding: 0 20px 22px; }
        .ww-chip {
          font: 600 13px Inter, sans-serif; color: #0C0C0B; cursor: pointer;
          padding: 9px 14px; border-radius: 100px;
          background: rgba(255,255,255,0.6); border: 1px solid rgba(12,12,11,0.1);
          transition: background .2s, color .2s, border-color .2s;
        }
        .ww-chip span { color: #6E6B63; font-weight: 500; margin-left: 4px; }
        .ww-chip.is-on { background: #0C0C0B; color: #F2EEE7; border-color: #0C0C0B; }
        .ww-chip.is-on span { color: rgba(242,238,231,0.6); }
        .ww-chip:focus-visible { outline: 2px solid #E8541A; outline-offset: 2px; }

        .ww-stage {
          position: relative; height: min(78vh, 760px); min-height: 460px;
          overflow: hidden; background: #0C0C0B;
          cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none;
          outline: none;
        }
        .ww-stage.is-dragging { cursor: grabbing; }
        .ww-stage:focus-visible { box-shadow: inset 0 0 0 2px #E8541A; }
        .ww-world { position: absolute; left: 0; top: 0; will-change: transform; }

        .ww-tile, .ww-fill {
          position: absolute; left: 0; top: 0; border-radius: 16px; overflow: hidden;
          transition: transform .55s cubic-bezier(.16,1,.3,1), width .55s cubic-bezier(.16,1,.3,1), height .55s cubic-bezier(.16,1,.3,1);
        }
        .ww-tile {
          padding: 0; border: 0; background: #1a1917; cursor: inherit; color: #fff;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
        }
        .ww-tile img, .ww-tile video {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
          pointer-events: none;
        }
        .ww-tile video { opacity: 0; transition: opacity .35s ease; }
        .ww-tile.is-live video { opacity: 1; }
        .ww-tile.is-live { box-shadow: 0 0 0 2px #E8541A, 0 18px 40px rgba(0,0,0,0.5); z-index: 2; }
        .ww-tile:focus-visible { outline: 2px solid #E8541A; outline-offset: 2px; z-index: 3; }
        .ww-meta {
          position: absolute; left: 0; right: 0; bottom: 0; padding: 26px 12px 10px; text-align: left;
          background: linear-gradient(transparent, rgba(0,0,0,0.72));
          font-family: Inter, sans-serif; opacity: 0; transition: opacity .25s ease; pointer-events: none;
        }
        .ww-tile.is-live .ww-meta, .ww-tile:focus-visible .ww-meta { opacity: 1; }
        .ww-meta strong { display: block; font-size: 12.5px; font-weight: 800; }
        .ww-meta em { display: block; font-size: 11px; font-style: normal; color: rgba(255,255,255,0.72); }

        .ww-fill { display: flex; align-items: center; justify-content: center; text-align: center; padding: 8px; }
        .ww-fill span { font: 800 12px Inter, sans-serif; letter-spacing: 1.2px; text-transform: uppercase; }
        .ww-fill-0 { background: #E8541A; color: #fff; }
        .ww-fill-1 { background: #1f1d1a; color: rgba(242,238,231,0.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05); }
        .ww-fill-2 { background: #F2EEE7; color: #0C0C0B; }

        .ww-hint {
          position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%);
          padding: 8px 14px; border-radius: 100px; background: rgba(12,12,11,0.72);
          border: 1px solid rgba(255,255,255,0.14); color: #F2EEE7;
          font: 600 12px Inter, sans-serif; white-space: nowrap; pointer-events: none;
          transition: opacity .4s ease;
        }
        .ww-hint.is-gone { opacity: 0; }

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
          .ww-stage { height: 72vh; }
          .ww-hint { font-size: 11px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ww-tile, .ww-fill, .ww-tile video { transition: none; }
        }
      `}</style>
    </div>
  );
}
