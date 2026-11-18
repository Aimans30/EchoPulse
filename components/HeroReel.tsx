"use client";

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { wallClips, type WallClip } from '@/lib/videos';

/**
 * Hero visual: the studio's own edits, cutting fast, in the two shapes the
 * work actually ships in.
 *
 * Three frames in one aligned block: a wide frame on top for horizontal edits
 * (podcasts, long-form) and two tall frames underneath for vertical ones
 * (reels, shorts). Each frame swaps to its next clip every SLOT_MS with a
 * quick cross-fade, and the three are a third of a slot out of step, so
 * something on screen changes about once a second. A visitor sees six or
 * seven different edits in the time it takes to read the headline.
 *
 * Each frame keeps only the playing clip and the next one in the DOM (the
 * next one is preloaded so the cut is instant), and both use the small silent
 * preview rendition, so the hero never downloads a full-size video. Rotation
 * stops while the pointer is over the frames, while the tab is hidden, while
 * the hero is scrolled out of view, and for visitors who ask for reduced
 * motion (they get the first clip of each, looping).
 *
 * The whole block is one link to /work. Nothing sits on top of the video
 * except a small label naming the kind of edit.
 *
 * Hidden on phones by the existing `.hero-right` rule, where the mobile hero
 * shows its own trust strip instead.
 */

/** How long each clip stays up in a frame, in milliseconds. */
const SLOT_MS = 3000;
const FADE_MS = 380;

/** Plain-language label for each clip type. */
const TYPE_LABEL: Record<string, string> = {
  realestate: 'Listing reel',
  talking: 'Founder reel',
  podcast: 'Podcast clip',
  longform: 'Brand film',
};

/** Interleave by type so consecutive clips come from different niches. */
function interleave(clips: WallClip[], max: number): WallClip[] {
  const order = ['realestate', 'talking', 'podcast', 'longform'];
  const buckets = order.map((t) => clips.filter((c) => c.types[0] === t));
  const out: WallClip[] = [];
  for (let round = 0; out.length < max && round < 6; round++) {
    for (const bkt of buckets) if (bkt[round] && out.length < max) out.push(bkt[round]);
  }
  return out;
}

const ALL = wallClips();
const TALL = interleave(ALL.filter((c) => c.orientation !== 'horizontal'), 8);
const WIDE = interleave(ALL.filter((c) => c.orientation === 'horizontal'), 6);
// Two tall frames, each with its own half of the vertical clips.
const TALL_A = TALL.filter((_, i) => i % 2 === 0);
const TALL_B = TALL.filter((_, i) => i % 2 === 1);

// One aligned block: a wide frame on top, two tall frames underneath.
const W = 384;
const GAP = 12;
const WIDE_H = Math.round((W * 9) / 16);
const TALL_W = (W - GAP) / 2;
const TALL_H = Math.round(TALL_W * 1.62);


function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}

/**
 * The hero hides this whole column at 640px and below. Hidden <video> elements
 * still download, so on a phone the clips are simply not rendered.
 */
function useIsWide(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(min-width: 641px)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia('(min-width: 641px)').matches,
    () => false,
  );
}

/**
 * One frame that cycles through `clips`. `offset` delays its first cut so two
 * frames never change on the same beat.
 */
function ReelFrame({
  clips, offset, running, reduced, render, style, labelAt,
}: {
  clips: WallClip[];
  offset: number;
  running: boolean;
  reduced: boolean;
  render: boolean;
  style: React.CSSProperties;
  labelAt: 'top' | 'bottom';
}) {
  const [index, setIndex] = useState(0);
  const first = useRef(true);
  const count = clips.length;
  const rotate = count > 1 && !reduced;

  useEffect(() => {
    if (!rotate || !running) return;
    const wait = first.current ? SLOT_MS + offset : SLOT_MS;
    const t = window.setTimeout(() => {
      first.current = false;
      setIndex((i) => (i + 1) % count);
    }, wait);
    return () => window.clearTimeout(t);
  }, [index, running, rotate, count, offset]);

  const current = clips[index];
  const next = rotate ? clips[(index + 1) % count] : null;
  const label = current ? TYPE_LABEL[current.types[0]] ?? current.brand : '';

  return (
    <div
      style={{
        position: 'absolute',
        overflow: 'hidden',
        background: '#0C0C0B',
        boxShadow: '0 24px 60px rgba(12,12,11,0.16), 0 0 0 1px rgba(12,12,11,0.06)',
        ...style,
      }}
    >
      {render &&
        clips.map((clip, i) => {
          const isCurrent = i === index;
          const isNext = next !== null && clip.id === next.id && !isCurrent;
          if (!isCurrent && !isNext) return null;
          return (
            <video
              key={clip.id}
              src={clip.preview}
              poster={clip.poster}
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              ref={(el) => {
                if (!el) return;
                if (isCurrent) el.play().catch(() => {});
                else { el.pause(); el.currentTime = 0; }
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                opacity: isCurrent ? 1 : 0,
                transform: isCurrent ? 'scale(1)' : 'scale(1.04)',
                transition: reduced ? 'none' : `opacity ${FADE_MS}ms ease, transform ${FADE_MS + 200}ms ease`,
              }}
            />
          );
        })}
      <span
        style={{
          position: 'absolute',
          left: 10,
          ...(labelAt === 'top' ? { top: 10 } : { bottom: 10 }),
          padding: '4px 9px',
          borderRadius: 100,
          background: 'rgba(12,12,11,0.66)',
          color: '#F2EEE7',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          zIndex: 2,
        }}
      >
        {label || 'Cut by Lakshya'}
      </span>
    </div>
  );
}

export default function HeroReel() {
  const wide = useIsWide();
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  // Do not burn through clips in a background tab or below the fold.
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    const el = rootRef.current;
    const io = el ? new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.15 }) : null;
    if (el && io) io.observe(el);
    return () => { document.removeEventListener('visibilitychange', onVis); io?.disconnect(); };
  }, []);

  const running = !hover && !hidden && onScreen;
  const hasWide = WIDE.length > 0;

  return (
    <div
      ref={rootRef}
      className="hero-reel"
      style={{ position: 'relative', width: W, height: hasWide ? WIDE_H + GAP + TALL_H : TALL_H }}
    >
      <Link
        href="/work"
        data-cursor-hover
        aria-label={`See all ${ALL.length} edits on the work wall`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ position: 'absolute', inset: 0, display: 'block', textDecoration: 'none' }}
      >
        {hasWide && (
          <ReelFrame
            clips={WIDE}
            offset={0}
            running={running}
            reduced={reduced}
            render={wide}
            labelAt="bottom"
            style={{ left: 0, top: 0, width: W, height: WIDE_H, borderRadius: 24 }}
          />
        )}
        <ReelFrame
          clips={TALL_A}
          offset={SLOT_MS / 3}
          running={running}
          reduced={reduced}
          render={wide}
          labelAt="bottom"
          style={{ left: 0, bottom: 0, width: TALL_W, height: TALL_H, borderRadius: 24 }}
        />
        <ReelFrame
          clips={TALL_B}
          offset={(SLOT_MS * 2) / 3}
          running={running}
          reduced={reduced}
          render={wide}
          labelAt="bottom"
          style={{ right: 0, bottom: 0, width: TALL_W, height: TALL_H, borderRadius: 24 }}
        />
      </Link>

      {/* What sits around the edits: the plan before them, the path after
          them, and the one result we can prove. Decorative for assistive
          tech (the same facts are in the page copy), and click-through. */}
      <div className="hr-float hr-plan" aria-hidden="true">
        <span className="hr-kicker">This week, planned for you</span>
        <ul>
          {['Content plan', 'Scripts and hooks', 'Shot list', 'Edits and posts'].map((t, i) => (
            <li key={t} style={{ ['--i' as string]: i }}>
              <i />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="hr-float hr-funnel" aria-hidden="true">
        <span className="hr-kicker">Where the views go</span>
        <div className="hr-steps">
          <b>Video</b>
          <b>Website</b>
          <b>Booked call</b>
          <em />
        </div>
      </div>

      <div className="hr-float hr-growth" aria-hidden="true">
        <span className="hr-kicker">MagicBNB, daily Google impressions</span>
        <div className="hr-growth-row">
          <strong>5.8 &rarr; 4,859</strong>
          <svg viewBox="0 0 96 34" width="96" height="34">
            <path d="M2 31 C 18 30, 26 28, 36 25 S 54 20, 62 15 S 80 8, 94 3" fill="none" stroke="#E8541A" strokeWidth="2.5" strokeLinecap="round" pathLength="1" />
          </svg>
        </div>
        <span className="hr-note">April to November 2026, from Search Console</span>
      </div>

      <style>{`
        .hr-float {
          position: absolute; z-index: 3; pointer-events: none; font-family: Inter, sans-serif; color: #0C0C0B;
          padding: 11px 13px; border-radius: 16px; background: rgba(255,255,255,0.86);
          border: 1px solid rgba(255,255,255,0.95);
          -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
          box-shadow: 0 16px 40px rgba(12,12,11,0.14), 0 2px 6px rgba(12,12,11,0.06);
          animation: hrBob 7s ease-in-out infinite;
        }
        .hr-kicker { display: block; font-size: 9.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #6E6B63; margin-bottom: 7px; white-space: nowrap; }
        @keyframes hrBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

        .hr-plan { left: -58px; top: 34px; animation-duration: 8s; }
        .hr-plan ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
        .hr-plan li { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; white-space: nowrap; }
        .hr-plan i {
          position: relative; flex: 0 0 auto; width: 15px; height: 15px; border-radius: 50%;
          border: 1.5px solid rgba(12,12,11,0.25);
          animation: hrTick 8s calc(var(--i) * 0.9s) infinite both;
        }
        .hr-plan i::after {
          content: ''; position: absolute; left: 4px; top: 1.5px; width: 3.5px; height: 7px;
          border: solid #fff; border-width: 0 1.8px 1.8px 0; transform: rotate(45deg);
        }
        @keyframes hrTick {
          0%, 6% { background: transparent; border-color: rgba(12,12,11,0.25); transform: scale(1); }
          10% { background: #E8541A; border-color: #E8541A; transform: scale(1.25); }
          14%, 92% { background: #E8541A; border-color: #E8541A; transform: scale(1); }
          100% { background: transparent; border-color: rgba(12,12,11,0.25); }
        }

        .hr-funnel { right: -46px; top: ${Math.round(WIDE_H * 0.78)}px; animation-duration: 9s; animation-delay: -3s; }
        .hr-steps { position: relative; display: flex; align-items: center; gap: 18px; }
        .hr-steps b { position: relative; z-index: 1; font-size: 11.5px; font-weight: 700; padding: 5px 9px; border-radius: 100px; background: #0C0C0B; color: #F2EEE7; white-space: nowrap; }
        .hr-steps b:last-of-type { background: #E8541A; color: #fff; }
        .hr-steps::before { content: ''; position: absolute; left: 8px; right: 8px; top: 50%; height: 1.5px; background: rgba(12,12,11,0.18); }
        .hr-steps em {
          position: absolute; top: 50%; left: 0; width: 7px; height: 7px; margin-top: -3.5px; border-radius: 50%;
          background: #E8541A; box-shadow: 0 0 0 4px rgba(232,84,26,0.18); z-index: 0;
          animation: hrFlow 3.2s cubic-bezier(.45,0,.2,1) infinite;
        }
        @keyframes hrFlow { 0% { left: 4%; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: 94%; opacity: 0; } }

        .hr-growth { left: -40px; bottom: 54px; animation-duration: 7.5s; animation-delay: -1.5s; }
        .hr-growth-row { display: flex; align-items: center; gap: 12px; }
        .hr-growth strong { font-size: 19px; font-weight: 900; letter-spacing: -0.5px; white-space: nowrap; }
        .hr-growth path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: hrDraw 6s ease-out infinite; }
        @keyframes hrDraw { 0% { stroke-dashoffset: 1; } 35%, 92% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 0; opacity: 0; } }
        .hr-note { display: block; font-size: 10.5px; color: #6E6B63; margin-top: 4px; white-space: nowrap; }

        @media (max-width: 1180px) {
          .hr-plan { left: -12px; }
          .hr-growth { left: -8px; }
          .hr-funnel { right: -10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hr-float, .hr-plan i, .hr-steps em, .hr-growth path { animation: none; }
          .hr-plan i { background: #E8541A; border-color: #E8541A; }
          .hr-growth path { stroke-dashoffset: 0; }
          .hr-steps em { left: 94%; }
        }
      `}</style>
    </div>
  );
}
