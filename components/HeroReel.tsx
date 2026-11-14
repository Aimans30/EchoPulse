"use client";

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { wallClips, type WallClip } from '@/lib/videos';

/**
 * Hero visual: the studio's own edits playing one after another, plus the one
 * number the studio can prove.
 *
 * Buyers asked the same thing in every review: "show me the work". The right
 * column of the hero is a phone-shaped frame that plays a short preview of one
 * edit, then cross-fades to the next, like stories. The segments along the top
 * show which clip is playing and how long is left; clicking one jumps to it.
 * The label says what kind of edit it is, so a real estate agent, a coach and
 * a founder each see their own niche within a few seconds.
 *
 * Only the playing clip and the next one are ever in the DOM, and each is the
 * 12-second, 480px, silent preview rendition from lib/videos.ts, so the hero
 * never downloads a full-size video. Rotation pauses while the pointer is over
 * the frame or the tab is hidden, and does not run at all for visitors who ask
 * for reduced motion (they get the first clip, looping).
 *
 * Hidden on phones by the existing `.hero-right` rule, where the mobile hero
 * shows its own trust strip instead.
 */

/** How long each clip stays up, in milliseconds. */
const SLOT_MS = 6500;
const MAX_CLIPS = 6;

/** Plain-language label for each clip type. */
const TYPE_LABEL: Record<string, string> = {
  realestate: 'Listing reel',
  talking: 'Founder reel',
  podcast: 'Podcast clip',
  longform: 'Brand film',
};

/**
 * Vertical clips, interleaved by type so consecutive clips come from
 * different niches: listing, founder, podcast, listing, founder, ...
 */
function pickReel(): WallClip[] {
  const vertical = wallClips().filter((c) => c.orientation !== 'horizontal');
  const order = ['realestate', 'talking', 'podcast', 'longform'];
  const buckets = order.map((t) => vertical.filter((c) => c.types[0] === t));
  const out: WallClip[] = [];
  for (let round = 0; out.length < MAX_CLIPS && round < 4; round++) {
    for (const b of buckets) {
      if (b[round] && out.length < MAX_CLIPS) out.push(b[round]);
    }
  }
  return out.length > 0 ? out : vertical.slice(0, 1);
}

const REEL = pickReel();

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

export default function HeroReel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const startedAt = useRef(0);
  const remaining = useRef(SLOT_MS);

  const count = REEL.length;
  const rotate = count > 1 && !reduced;

  // Advance after the slot elapses. Pausing keeps the time already spent.
  useEffect(() => {
    if (!rotate || paused) return;
    startedAt.current = performance.now();
    let fired = false;
    const t = window.setTimeout(() => {
      fired = true;
      remaining.current = SLOT_MS;
      setIndex((i) => (i + 1) % count);
    }, remaining.current);
    return () => {
      window.clearTimeout(t);
      // Only a pause (the timer was cancelled) keeps the time already spent.
      // After the timer fires the next clip gets a full slot.
      if (!fired) {
        remaining.current = Math.max(400, remaining.current - (performance.now() - startedAt.current));
      }
    };
  }, [index, paused, rotate, count]);

  // Do not burn through clips in a background tab.
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const jump = (i: number) => {
    remaining.current = SLOT_MS;
    setIndex(i);
  };

  const current = REEL[index];
  const next = rotate ? REEL[(index + 1) % count] : null;
  const label = current ? TYPE_LABEL[current.types[0]] ?? current.brand : '';

  return (
    <div className="hero-reel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div
        className="hero-reel-frame"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          width: 250,
          aspectRatio: '9 / 16',
          borderRadius: 28,
          overflow: 'hidden',
          background: '#0C0C0B',
          border: '1px solid rgba(12,12,11,0.12)',
          boxShadow: '0 30px 80px rgba(12,12,11,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
          position: 'relative',
        }}
      >
        {REEL.map((clip, i) => {
          const isCurrent = i === index;
          const isNext = next !== null && clip.id === next.id && !isCurrent;
          if (!isCurrent && !isNext) return null;
          return (
            <video
              key={clip.id}
              className="hero-reel-video"
              src={clip.preview}
              poster={clip.poster}
              autoPlay={isCurrent}
              muted
              loop
              playsInline
              preload={isCurrent ? 'auto' : 'metadata'}
              aria-hidden={!isCurrent}
              aria-label={isCurrent ? `${label}: a short-form edit by EchoPulse` : undefined}
              ref={(el) => {
                if (!el) return;
                if (isCurrent) {
                  el.play().catch(() => {});
                } else {
                  el.pause();
                  el.currentTime = 0;
                }
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                opacity: isCurrent ? 1 : 0,
                transition: reduced ? 'none' : 'opacity 0.6s ease',
              }}
            />
          );
        })}

        {/* Story segments: which clip is playing, and how long is left. */}
        {rotate && (
          <div
            role="tablist"
            aria-label="Sample edits"
            style={{ position: 'absolute', left: 12, right: 12, top: 10, display: 'flex', gap: 4, zIndex: 2 }}
          >
            {REEL.map((clip, i) => (
              <button
                key={clip.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Play sample ${i + 1} of ${count}`}
                onClick={() => jump(i)}
                className="hero-reel-seg"
                style={{
                  flex: 1,
                  height: 16,
                  padding: '6px 0',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    height: 3,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.32)',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    key={i === index ? `on-${index}` : 'off'}
                    className={i === index ? 'hero-reel-fill' : undefined}
                    style={{
                      display: 'block',
                      height: '100%',
                      width: i < index ? '100%' : i === index ? undefined : '0%',
                      background: '#fff',
                      animationPlayState: paused ? 'paused' : 'running',
                    }}
                  />
                </span>
              </button>
            ))}
          </div>
        )}

        <span
          style={{
            position: 'absolute',
            left: 12,
            top: rotate ? 32 : 12,
            padding: '4px 9px',
            borderRadius: 100,
            background: 'rgba(12,12,11,0.65)',
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

        <Link
          href="/work"
          data-cursor-hover
          style={{
            position: 'absolute',
            right: 12,
            bottom: 12,
            padding: '7px 12px',
            borderRadius: 100,
            background: 'rgba(242,238,231,0.92)',
            color: '#0C0C0B',
            fontSize: 11,
            fontWeight: 700,
            textDecoration: 'none',
            zIndex: 2,
          }}
        >
          See all work &rarr;
        </Link>

        <style>{`
          .hero-reel-fill { width: 0%; animation: heroReelFill ${SLOT_MS}ms linear forwards; }
          @keyframes heroReelFill { from { width: 0%; } to { width: 100%; } }
          .hero-reel-seg:focus-visible { outline: 2px solid #E8541A; outline-offset: 2px; border-radius: 4px; }
        `}</style>
      </div>

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
