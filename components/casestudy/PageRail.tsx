'use client';

import { useRef } from 'react';
import Image from 'next/image';
import type { CaseStudyMedia } from '@/lib/caseStudyData';

export type RailPair = {
  label: string;
  note: string;
  before: CaseStudyMedia;
  after: CaseStudyMedia;
  afterUrl: string;
};

/**
 * Page-by-page before and after, as a horizontal rail.
 *
 * Each slide leads with the new page, large, in a browser frame; the old page
 * it replaced sits small and dimmed in the corner. Native horizontal scroll
 * with scroll-snap, so it swipes on a phone with no script at all; the arrow
 * buttons are a convenience for mouse users. Hovering or focusing a frame
 * scrolls the page inside it (a transform on the image), so the whole capture
 * can be seen without leaving the slide.
 */
export default function PageRail({ items }: { items: RailPair[] }) {
  const rail = useRef<HTMLOListElement | null>(null);
  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const first = el.querySelector('li');
    const step = first ? first.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="cs-rail-wrap">
      <div className="cs-rail-ctrl">
        <p className="cs-rail-hint">
          {items.length} pages. Swipe or use the arrows. Hover a page to scroll it.
        </p>
        <div className="cs-rail-btns">
          <button type="button" className="cs-rail-btn" onClick={() => nudge(-1)} aria-label="Previous page">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="cs-rail-btn" onClick={() => nudge(1)} aria-label="Next page">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <ol className="cs-rail" ref={rail}>
        {items.map((p, i) => (
          <li key={p.label} className="cs-rail-slide">
            <figure className="cs-pg">
              <div className="cs-pg-stage">
                <div className="cs-browser cs-browser-light">
                  <div className="cs-browser-bar" aria-hidden="true">
                    <span className="cs-browser-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="cs-browser-url">{p.afterUrl.replace('https://', '')}</span>
                  </div>
                  <div className="cs-pg-view" tabIndex={0} aria-label={`${p.label}, new page. Hover or focus to scroll the capture.`}>
                    <Image
                      src={p.after.src}
                      alt={p.after.alt}
                      width={p.after.width}
                      height={p.after.height}
                      sizes="(max-width: 760px) 86vw, 620px"
                      className="cs-pg-img"
                    />
                  </div>
                </div>
                <div className="cs-pg-old">
                  <span className="cs-pg-old-tag">Before</span>
                  <Image
                    src={p.before.src}
                    alt={p.before.alt}
                    width={p.before.width}
                    height={p.before.height}
                    sizes="160px"
                  />
                </div>
              </div>
              <figcaption className="cs-pg-cap">
                <span className="cs-pg-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="cs-pg-text">
                  <strong>{p.label}.</strong> {p.note}
                </span>
                <a className="cs-pg-link" href={p.afterUrl} target="_blank" rel="noopener noreferrer">
                  Open the live page <span aria-hidden="true">&rarr;</span>
                </a>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </div>
  );
}
