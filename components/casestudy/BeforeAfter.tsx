'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import type { CaseStudyComparison } from '@/lib/caseStudyData';

/**
 * Before and after, as a draggable wipe.
 *
 * On a rebuild there is no chart, so this is the proof. Both screens sit in the
 * same box at the same scale and the handle wipes between them, which is the
 * only presentation that makes the two genuinely comparable: side-by-side
 * thumbnails let a reader assume the new one was cropped or zoomed
 * flatteringly, and a wipe cannot hide anything because the reader controls
 * where the seam falls.
 *
 * ACCESSIBILITY
 *
 * The handle is a real range input, not a div with pointer handlers. That gets
 * keyboard control, arrow keys, screen reader announcement and touch support
 * from the platform instead of from code, and it means the whole thing still
 * works before hydration. The visual handle is drawn underneath and the input
 * is laid transparently over it.
 *
 * Both images are always in the DOM and both are readable by assistive tech,
 * so a reader who cannot use the wipe still gets both descriptions and the
 * caption. The live URL is next to it either way, because the "after" is a real
 * site anyone can open rather than an image we are asking them to believe.
 */
export default function BeforeAfter({ data }: { data: CaseStudyComparison }) {
  const [pos, setPos] = useState(50);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const hasAfter = Boolean(data.afterSrc && data.afterWidth && data.afterHeight);

  // Dragging anywhere on the frame moves the seam, which is what people try
  // first. The range input still owns the value, so keyboard and screen reader
  // behaviour is unchanged by this.
  const pointerMove = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  if (!hasAfter) {
    /**
     * No capture of the new site yet. Rather than render half a slider, show
     * the old screen on its own and send the reader to the live site, which is
     * the better evidence anyway. Drops away automatically once `afterSrc` is
     * filled in.
     */
    return (
      <figure className="ba">
        <div className="ba-solo">
          <span className="ba-tag ba-tag-before">{data.beforeLabel}</span>
          <Image
            src={data.beforeSrc}
            alt={data.beforeAlt}
            width={data.beforeWidth}
            height={data.beforeHeight}
            sizes="(max-width: 860px) 100vw, 860px"
          />
        </div>
        <a className="ba-live" href={data.liveUrl} target="_blank" rel="noopener">
          See what replaced it at {data.liveUrl.replace('https://', '').replace(/\/$/, '')}
          <span aria-hidden="true"> &rarr;</span>
        </a>
        <figcaption>{data.caption}</figcaption>
        <style>{BA_CSS}</style>
      </figure>
    );
  }

  return (
    <figure className="ba">
      <div
        className="ba-frame"
        ref={frameRef}
        style={{ aspectRatio: `${data.beforeWidth} / ${data.beforeHeight}` }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          pointerMove(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) pointerMove(e.clientX);
        }}
      >
        {/* After sits underneath and is fully painted. The before layer is
            clipped over the top of it, so the wipe reveals rather than hides. */}
        <div className="ba-layer">
          <Image
            src={data.afterSrc as string}
            alt={data.afterAlt ?? ''}
            width={data.afterWidth as number}
            height={data.afterHeight as number}
            sizes="(max-width: 860px) 100vw, 860px"
            priority={false}
          />
        </div>

        <div className="ba-layer ba-layer-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src={data.beforeSrc}
            alt={data.beforeAlt}
            width={data.beforeWidth}
            height={data.beforeHeight}
            sizes="(max-width: 860px) 100vw, 860px"
          />
        </div>

        <span className="ba-tag ba-tag-before" style={{ opacity: pos > 12 ? 1 : 0 }}>
          {data.beforeLabel}
        </span>
        <span className="ba-tag ba-tag-after" style={{ opacity: pos < 88 ? 1 : 0 }}>
          {data.afterLabel}
        </span>

        <div className="ba-seam" style={{ left: `${pos}%` }} aria-hidden="true">
          <span className="ba-knob" />
        </div>

        <input
          className="ba-range"
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Reveal slider. Drag left for the old site, right for the new one. Currently showing ${Math.round(pos)} percent of the old site.`}
        />
      </div>

      <a className="ba-live" href={data.liveUrl} target="_blank" rel="noopener">
        Open the live site at {data.liveUrl.replace('https://', '').replace(/\/$/, '')}
        <span aria-hidden="true"> &rarr;</span>
      </a>
      <figcaption>{data.caption}</figcaption>
      <style>{BA_CSS}</style>
    </figure>
  );
}

const BA_CSS = `
  .ba { margin: 0; }
  .ba-frame { position: relative; width: 100%; overflow: hidden; border-radius: 16px; border: 1px solid rgba(242,238,231,0.16); background: #0C0C0B; touch-action: pan-y; cursor: ew-resize; user-select: none; }
  .ba-layer { position: absolute; inset: 0; }
  .ba-layer img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
  .ba-layer-before { will-change: clip-path; }

  .ba-tag { position: absolute; top: 14px; font-family: Inter, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; padding: 6px 12px; border-radius: 100px; backdrop-filter: blur(6px); transition: opacity 0.2s ease; pointer-events: none; }
  .ba-tag-before { left: 14px; background: rgba(12,12,11,0.72); color: rgba(242,238,231,0.9); border: 1px solid rgba(242,238,231,0.2); }
  .ba-tag-after { right: 14px; background: rgba(232,84,26,0.92); color: #fff; border: 1px solid rgba(255,255,255,0.25); }

  .ba-seam { position: absolute; top: 0; bottom: 0; width: 2px; margin-left: -1px; background: #F2EEE7; box-shadow: 0 0 0 1px rgba(12,12,11,0.25); pointer-events: none; }
  .ba-knob { position: absolute; top: 50%; left: 50%; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%; background: #F2EEE7; box-shadow: 0 4px 18px rgba(12,12,11,0.4); }
  .ba-knob::before, .ba-knob::after { content: ""; position: absolute; top: 50%; width: 0; height: 0; margin-top: -5px; border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
  .ba-knob::before { left: 11px; border-right: 6px solid #0C0C0B; }
  .ba-knob::after { right: 11px; border-left: 6px solid #0C0C0B; }

  /* The real control, laid transparently over the whole frame. Opacity 0 would
     remove it from the accessibility tree in some browsers, so it is kept
     paintable and its thumb is sized to match the drawn knob. */
  .ba-range { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; padding: 0; background: transparent; appearance: none; -webkit-appearance: none; cursor: ew-resize; }
  .ba-range:focus-visible { outline: 3px solid #E8541A; outline-offset: 3px; border-radius: 16px; }
  .ba-range::-webkit-slider-thumb { -webkit-appearance: none; width: 44px; height: 44px; border-radius: 50%; background: transparent; cursor: ew-resize; }
  .ba-range::-moz-range-thumb { width: 44px; height: 44px; border: none; border-radius: 50%; background: transparent; cursor: ew-resize; }
  .ba-range::-moz-range-track { background: transparent; }

  .ba-solo { position: relative; border-radius: 16px; overflow: hidden; border: 1px solid rgba(242,238,231,0.16); background: #0C0C0B; }
  .ba-solo img { width: 100%; height: auto; display: block; }

  .ba-live { display: inline-block; margin-top: 18px; font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; color: #E8541A; text-decoration: none; border-bottom: 1px solid rgba(232,84,26,0.4); padding-bottom: 2px; }
  .ba-live:hover { border-bottom-color: #E8541A; }
  .ba figcaption { font-size: 13px; line-height: 1.65; color: rgba(242,238,231,0.5); margin-top: 14px; max-width: 78ch; }

  @media (max-width: 760px) {
    .ba-knob { width: 38px; height: 38px; margin: -19px 0 0 -19px; }
    .ba-tag { font-size: 10px; padding: 5px 10px; top: 10px; }
    .ba-tag-before { left: 10px; }
    .ba-tag-after { right: 10px; }
  }
`;
