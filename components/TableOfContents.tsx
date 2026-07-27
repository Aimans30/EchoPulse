'use client';

import { useEffect, useState } from 'react';
import type { TocHeading } from '@/lib/toc';

/**
 * Sticky "Quick Navigation" sidebar for blog posts.
 *
 * - Lists every H2/H3 heading as an anchor link (H3 indented under its H2).
 * - Scroll-spy: an IntersectionObserver highlights whichever section is
 *   currently in view, mirroring the reader's position.
 * - Smooth-scrolls on click and reflects the active state immediately.
 * - Hidden on mobile (the two-column layout collapses to one column there);
 *   the `.blog-toc` wrapper is display:none under 1024px via the page CSS.
 *
 * `variant="mobile"` renders the same links as a COLLAPSED <details> placed in
 * the article flow instead. Under 1024px the sidebar disappears entirely, so
 * phone readers, who are most of the organic traffic, previously had no way to
 * jump between sections of a 2,500-word post at all. Collapsed by default so
 * it costs roughly one line of the first screen rather than eating it, and
 * <details> means the open/close behaviour is native (works before hydration,
 * keyboard-operable, and announced correctly).
 */
export default function TableOfContents({
  headings,
  variant = 'sidebar',
}: {
  headings: TocHeading[];
  variant?: 'sidebar' | 'mobile';
}) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '');

  useEffect(() => {
    // Scroll-spy is a sidebar affordance: the mobile list is closed almost all
    // of the time, so observing every heading there would be pure overhead on
    // the device with the least to spare.
    if (variant === 'mobile') return;
    if (headings.length === 0) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Track which headings are currently intersecting; the topmost one wins.
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Pick the first heading (in document order) that's currently visible.
        const firstVisible = headings.find((h) => visible.has(h.id));
        if (firstVisible) setActiveId(firstVisible.id);
      },
      {
        // Trigger when a heading is in the upper portion of the viewport — the
        // band between the fixed nav (~120px) and the vertical midpoint.
        rootMargin: '-120px 0px -55% 0px',
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, variant]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Update the URL hash without a jump (scrollIntoView already handled it).
    history.replaceState(null, '', `#${id}`);
  };

  if (headings.length === 0) return null;

  if (variant === 'mobile') {
    // Jumping to a section and leaving the whole index expanded on top of it
    // wastes the screen the reader just asked to see, so the panel closes
    // itself on selection.
    const closeAfterJump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      handleClick(e, id);
      e.currentTarget.closest('details')?.removeAttribute('open');
    };

    return (
      <nav className="blog-toc-m" aria-label="Table of contents">
        <details>
          <summary className="blog-toc-m-summary">
            <span className="blog-toc-m-label">Quick Navigation</span>
            <span className="blog-toc-m-chev" aria-hidden="true" />
          </summary>
          <ul className="blog-toc-m-list">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? 'blog-toc-m-sub' : undefined}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => closeAfterJump(e, h.id)}
                  className="blog-toc-m-link"
                >
                  {h.level === 2 && <span className="blog-toc-m-dot" aria-hidden="true" />}
                  <span>{h.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </details>

        {/* Deliberately self-contained rather than reusing the sidebar's
            classes: the sidebar is display:none at this width, and inheriting
            styles from a hidden sibling is the kind of coupling that breaks
            silently the next time either one is touched. */}
        <style>{`
          /* Only exists where the sticky sidebar does not. */
          .blog-toc-m { display: none; }
          @media (max-width: 1024px) {
            .blog-toc-m {
              display: block;
              margin: 0 0 32px;
              background: rgba(255,255,255,0.55);
              border: 1px solid rgba(12,12,11,0.08);
              border-radius: 14px;
              overflow: hidden;
            }
          }
          .blog-toc-m-summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            /* 16px block padding around a 10px label still clears a 48px row,
               so the toggle is a comfortable thumb target, not a hairline. */
            padding: 16px 18px;
            min-height: 48px;
            cursor: pointer;
            list-style: none;
            user-select: none;
            touch-action: manipulation;
          }
          .blog-toc-m-summary::-webkit-details-marker { display: none; }
          .blog-toc-m-label {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.8px;
            text-transform: uppercase;
            color: #9a958c;
          }
          .blog-toc-m-chev {
            width: 9px;
            height: 9px;
            flex-shrink: 0;
            border-right: 1.8px solid #9a958c;
            border-bottom: 1.8px solid #9a958c;
            transform: rotate(45deg) translate(-2px, -2px);
            transition: transform 0.22s ease;
          }
          .blog-toc-m details[open] .blog-toc-m-chev {
            transform: rotate(-135deg) translate(-2px, -2px);
          }
          .blog-toc-m-list {
            list-style: none;
            margin: 0;
            padding: 0 8px 10px;
          }
          .blog-toc-m-sub { margin-left: 14px; }
          .blog-toc-m-link {
            display: flex;
            align-items: center;
            gap: 9px;
            /* Full-width 44px rows: a mis-tap here drops the reader into the
               wrong section of a 2,500-word article. */
            padding: 12px 10px;
            min-height: 44px;
            border-radius: 9px;
            font-size: 14px;
            line-height: 1.35;
            font-weight: 500;
            color: #6E6B63;
            text-decoration: none;
            touch-action: manipulation;
          }
          .blog-toc-m-sub .blog-toc-m-link { font-size: 13.5px; color: #8a857c; }
          .blog-toc-m-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: currentColor;
            flex-shrink: 0;
            opacity: 0.55;
          }
        `}</style>
      </nav>
    );
  }

  return (
    <nav className="blog-toc" aria-label="Table of contents">
      <div className="blog-toc-inner">
        <div className="blog-toc-label">Quick Navigation</div>
        <ul className="blog-toc-list">
          {headings.map((h) => {
            const isActive = h.id === activeId;
            return (
              <li key={h.id} className={`blog-toc-item${h.level === 3 ? ' blog-toc-item-sub' : ''}`}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => handleClick(e, h.id)}
                  className={`blog-toc-link${isActive ? ' active' : ''}`}
                  data-cursor-hover
                >
                  {h.level === 2 && <span className="blog-toc-dot" aria-hidden="true" />}
                  <span>{h.text}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        .blog-toc {
          position: sticky;
          top: 120px;
          align-self: start;
          max-height: calc(100vh - 160px);
          overflow-y: auto;
          /* Scrollable but no visible scrollbar — Firefox, IE, then WebKit */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .blog-toc::-webkit-scrollbar { display: none; }
        .blog-toc-inner {
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(12,12,11,0.07);
          border-radius: 16px;
          padding: 20px 18px;
        }
        .blog-toc-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: #9a958c;
          margin-bottom: 14px;
        }
        .blog-toc-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .blog-toc-item-sub { margin-left: 16px; }
        .blog-toc-link {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 9px;
          font-size: 13px;
          line-height: 1.4;
          font-weight: 500;
          color: #6E6B63;
          text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease;
          cursor: pointer;
        }
        /* The custom dot cursor only exists where a pointer does. An
           unqualified cursor:none leaves a touch or hybrid user with no
           visible affordance at all on a link. */
        @media (hover: hover) and (pointer: fine) {
          .blog-toc-link { cursor: none; }
        }
        .blog-toc-item-sub .blog-toc-link {
          font-size: 12.5px;
          color: #8a857c;
        }
        .blog-toc-link:hover {
          background: rgba(12,12,11,0.04);
          color: #0C0C0B;
        }
        .blog-toc-link.active {
          background: rgba(232,84,26,0.10);
          color: #E8541A;
          font-weight: 700;
        }
        .blog-toc-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          flex-shrink: 0;
          margin-top: 7px;
          opacity: 0.55;
        }
        .blog-toc-link.active .blog-toc-dot { opacity: 1; }
      `}</style>
    </nav>
  );
}
