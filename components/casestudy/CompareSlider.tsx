'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { CaseStudyMedia } from '@/lib/caseStudyData';
import { useInViewOnce, usePrefersReducedMotion } from './motion';

/**
 * Before and after, as a drag slider in one browser frame.
 *
 * Both homepages are cropped to the same 16:10 first screen, so the reader is
 * comparing like with like. The old page sits on the left of the seam.
 *
 * Interaction:
 *   - drag anywhere on the picture (mouse or touch). The frame sets
 *     touch-action: pan-y, so a vertical swipe still scrolls the page on a
 *     phone and only a sideways drag moves the seam;
 *   - the handle is a focusable role="slider": arrow keys move 5 percent,
 *     Page Up/Down 20, Home/End jump to either side;
 *   - the first time the slider is scrolled into view it sweeps once to show
 *     that it moves, then stops for good. Skipped under reduced motion and as
 *     soon as the reader touches it.
 *
 * Rendering: the seam is two opposing translateX transforms on the old page
 * (its window slides left, the picture inside slides right by the same
 * amount), so dragging never triggers layout or paint of the image.
 */
export default function CompareSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  url,
}: {
  before: CaseStudyMedia;
  after: CaseStudyMedia;
  beforeLabel: string;
  afterLabel: string;
  url: string;
}) {
  const [pos, setPos] = useState(50);
  const [hinted, setHinted] = useState(false);
  const touched = useRef(false);
  const frame = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const [viewRef, seen] = useInViewOnce<HTMLDivElement>(0.5);
  const reduced = usePrefersReducedMotion();

  const fromClientX = useCallback((x: number) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  }, []);

  // One sweep, once: 50 -> 28 -> 72 -> 50 over about 1.8s.
  useEffect(() => {
    if (!seen || reduced || hinted) return;
    let raf = 0;
    const t0 = performance.now() + 350;
    const keys = [50, 28, 72, 50];
    const seg = 600;
    const ease = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;
    const tick = (t: number) => {
      if (touched.current) return;
      const e = t - t0;
      if (e < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const i = Math.floor(e / seg);
      if (i >= keys.length - 1) {
        setPos(50);
        setHinted(true);
        return;
      }
      const p = ease((e - i * seg) / seg);
      setPos(keys[i] + (keys[i + 1] - keys[i]) * p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduced, hinted]);

  const stopHint = () => {
    touched.current = true;
    if (!hinted) setHinted(true);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === 'PageUp' || e.key === 'PageDown' ? 20 : 5;
    let next: number | null = null;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'PageDown') next = pos - step;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'PageUp') next = pos + step;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = 100;
    if (next === null) return;
    e.preventDefault();
    stopHint();
    setPos(Math.min(100, Math.max(0, next)));
  };

  const hidden = 100 - pos;

  return (
    <div ref={viewRef} className="cs-cmp">
      <div className="cs-browser cs-browser-dark">
        <div className="cs-browser-bar" aria-hidden="true">
          <span className="cs-browser-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="cs-browser-url cs-cmp-urls">
            <span style={{ opacity: pos > 55 ? 1 : 0.45 }}>reframedreality.com</span>
            <span aria-hidden="true">/</span>
            <span style={{ opacity: pos < 45 ? 1 : 0.45 }}>{url}</span>
          </span>
        </div>
        <div
          ref={frame}
          className="cs-cmp-frame"
          onPointerDown={(e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            stopHint();
            dragging.current = true;
            if (e.pointerType === 'mouse') {
              e.currentTarget.setPointerCapture(e.pointerId);
              fromClientX(e.clientX);
            }
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            fromClientX(e.clientX);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          onClick={(e) => fromClientX(e.clientX)}
        >
          <Image
            src={after.src}
            alt={after.alt}
            width={after.width}
            height={after.height}
            sizes="(max-width: 1000px) 100vw, 620px"
            className="cs-cmp-img"
            loading="eager"
            fetchPriority="high"
            draggable={false}
          />
          <div className="cs-cmp-before" style={{ transform: `translate3d(${-hidden}%,0,0)` }}>
            <div className="cs-cmp-before-inner" style={{ transform: `translate3d(${hidden}%,0,0)` }}>
              <Image
                src={before.src}
                alt={before.alt}
                width={before.width}
                height={before.height}
                sizes="(max-width: 1000px) 100vw, 620px"
                className="cs-cmp-img"
                loading="eager"
                draggable={false}
              />
            </div>
          </div>
          <span className="cs-cmp-tag cs-cmp-tag-before" style={{ opacity: pos > 34 ? 1 : 0 }} aria-hidden="true">
            <span className="cs-cmp-long">{beforeLabel}</span>
            <span className="cs-cmp-short">Before</span>
          </span>
          <span className="cs-cmp-tag cs-cmp-tag-after" style={{ opacity: pos < 66 ? 1 : 0 }} aria-hidden="true">
            <span className="cs-cmp-long">{afterLabel}</span>
            <span className="cs-cmp-short">After</span>
          </span>
          <div className="cs-cmp-seam" style={{ transform: `translate3d(${pos}cqw,0,0)` }}>
            <div
              className="cs-cmp-handle"
              role="slider"
              tabIndex={0}
              aria-label="Drag to compare the old homepage with the new one"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${Math.round(pos)} percent of the old homepage showing`}
              onKeyDown={onKey}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
