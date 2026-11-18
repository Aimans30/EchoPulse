"use client";

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { wallClips, type WallClip } from '@/lib/videos';

/**
 * Hero visual: the studio's own edits, cutting fast, in the two shapes the
 * work actually ships in.
 *
 * Two frames sit together like a desk of screens: a tall phone frame for
 * vertical edits (reels, shorts) and a wide frame for horizontal ones
 * (podcasts, long-form). Each frame swaps to its next clip every SLOT_MS with
 * a quick cross-fade, and the two are half a slot out of step, so something
 * on screen changes roughly every second and a half. A visitor sees six or
 * seven different edits in the time it takes to read the headline.
 *
 * Each frame keeps only the playing clip and the next one in the DOM (the
 * next one is preloaded so the cut is instant), and both use the small silent
 * preview rendition, so the hero never downloads a full-size video. Rotation
 * stops while the pointer is over the frames, while the tab is hidden, while
 * the hero is scrolled out of view, and for visitors who ask for reduced
 * motion (they get the first clip of each, looping).
 *
 * The whole composition is one link to /work. There is no button on top of
 * the video: the label underneath says where a click goes.
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
        boxShadow: '0 26px 70px rgba(12,12,11,0.22)',
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
    <div ref={rootRef} className="hero-reel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <Link
        href="/work"
        data-cursor-hover
        aria-label={`See all ${ALL.length} edits on the work wall`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="hero-reel-stage"
        style={{ position: 'relative', display: 'block', width: 380, height: hasWide ? 452 : 430, textDecoration: 'none' }}
      >
        <ReelFrame
          clips={TALL}
          offset={0}
          running={running}
          reduced={reduced}
          render={wide}
          labelAt="top"
          style={{ right: 0, top: 0, width: 236, aspectRatio: '9 / 16', borderRadius: 26, border: '1px solid rgba(12,12,11,0.12)' }}
        />
        {hasWide && (
          <ReelFrame
            clips={WIDE}
            offset={SLOT_MS / 2}
            running={running}
            reduced={reduced}
            render={wide}
            labelAt="bottom"
            style={{ left: 0, bottom: 0, width: 268, aspectRatio: '16 / 9', borderRadius: 18, border: '4px solid #F2EEE7' }}
          />
        )}
      </Link>
      <p style={{ margin: 0, fontSize: 12.5, color: '#6E6B63', fontFamily: 'Inter, sans-serif' }}>
        {ALL.length} edits on the wall.{' '}
        <Link href="/work" style={{ color: '#0C0C0B', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
          Watch them all
        </Link>
      </p>

      <Link
        href="/case-studies/magicbnb-seo-aeo"
        data-cursor-hover
        style={{
          display: 'block',
          width: 300,
          padding: '12px 14px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.85)',
          boxShadow: '0 8px 30px rgba(12,12,11,0.06)',
          textDecoration: 'none',
          color: '#0C0C0B',
        }}
      >
        <span style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: '#6E6B63', marginBottom: 4 }}>
          Case study: MagicBNB
        </span>
        <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 900, letterSpacing: '-0.6px', lineHeight: 1.1 }}>
          5.8 <span aria-hidden="true">&rarr;</span> 4,859 <span style={{ fontSize: 13, fontWeight: 600, color: '#6E6B63' }}>daily Google impressions</span>
        </span>
        <span style={{ display: 'block', fontSize: 12, color: '#6E6B63', marginTop: 3 }}>
          April to November 2026 average, best day 5,522. Real export inside <span style={{ color: '#E8541A', fontWeight: 700 }}>&rarr;</span>
        </span>
      </Link>
    </div>
  );
}
