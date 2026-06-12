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
 */
export default function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '');

  useEffect(() => {
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
  }, [headings]);

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
          cursor: none;
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
