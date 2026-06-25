'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

/**
 * Post shape the index client needs. The server precomputes `resolvedCategory`
 * (real Sanity category, else keyword-derived) and `imageSrc` so this client
 * component stays free of server-only imports (Sanity client, image builder).
 */
export type IndexPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  readTime?: number;
  publishedAt?: string;
  resolvedCategory: string;
  imageSrc: string | null;
};

const ALL = 'All';

// Accent color + icon per category. Cycled in order for categories not
// explicitly listed, so a new Sanity category never renders unstyled.
const CATEGORY_STYLES: Record<string, { color: string; bg: string; icon: string }> = {
  'All': { color: '#0C0C0B', bg: 'rgba(12,12,11,0.08)', icon: 'M4 6h16M4 12h16M4 18h16' },
  'AI Marketing': { color: '#7C5CFC', bg: 'rgba(124,92,252,0.12)', icon: 'M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7zM9 21h6' },
  'Funnels': { color: '#2E9E6B', bg: 'rgba(46,158,107,0.12)', icon: 'M4 4h16l-6 8v6l-4 2v-8z' },
  'Video': { color: '#E8541A', bg: 'rgba(232,84,26,0.12)', icon: 'M4 5h12v14H4zM16 9l5-3v12l-5-3' },
  'Authority': { color: '#C9881E', bg: 'rgba(201,136,30,0.12)', icon: 'M12 2l3 6 7 1-5 5 1.5 7L12 17l-6.5 4L7 14 2 9l7-1z' },
  'Insights': { color: '#2D7DD2', bg: 'rgba(45,125,210,0.12)', icon: 'M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8' },
  'Real Estate': { color: '#B5483D', bg: 'rgba(181,72,61,0.12)', icon: 'M3 11l9-7 9 7M5 10v10h14V10' },
  'Strategy': { color: '#1F8A8A', bg: 'rgba(31,138,138,0.12)', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7zM4 13h7v7H4z' },
  'Content Ops': { color: '#8857B0', bg: 'rgba(136,87,176,0.12)', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2' },
  'Social': { color: '#D24E8C', bg: 'rgba(210,78,140,0.12)', icon: 'M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .17 6L8.91 13.5a3 3 0 1 0 0 3l6.26 3.5A3 3 0 1 0 18 16a3 3 0 0 0-2.83 2L8.91 14.5' },
  'Automation': { color: '#3E8FB0', bg: 'rgba(62,143,176,0.12)', icon: 'M12 2v4M12 18v4M4.2 7l3.5 2M16.3 15l3.5 2M4.2 17l3.5-2M16.3 9l3.5-2M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0z' },
  'Company': { color: '#6E6B63', bg: 'rgba(110,107,99,0.12)', icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6' },
};
const FALLBACK_COLORS = ['#7C5CFC', '#2E9E6B', '#E8541A', '#2D7DD2', '#C9881E', '#B5483D'];
const FALLBACK_ICON = 'M4 6h16M4 12h16M4 18h16';

function getCategoryStyle(cat: string, index: number) {
  if (CATEGORY_STYLES[cat]) return CATEGORY_STYLES[cat];
  const color = FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  return { color, bg: `${color}1F`, icon: FALLBACK_ICON };
}

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BlogIndexClient({ posts }: { posts: IndexPost[] }) {
  const [active, setActive] = useState<string>(ALL);

  // Category → count, sorted by count desc. Drives the filter pills.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) {
      counts.set(p.resolvedCategory, (counts.get(p.resolvedCategory) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filtered = useMemo(
    () => (active === ALL ? posts : posts.filter((p) => p.resolvedCategory === active)),
    [posts, active],
  );

  // The newest post is the hero — only when viewing "All" (so a filtered view
  // is a clean uniform list).
  const featured = active === ALL ? filtered[0] : null;
  const rest = featured ? filtered.slice(1) : filtered;

  return (
    <>
      {/* Category filter cards */}
      <div className="blogx-filters" role="tablist" aria-label="Filter posts by category">
        {(() => {
          const allStyle = getCategoryStyle(ALL, -1);
          return (
            <button
              type="button"
              role="tab"
              aria-selected={active === ALL}
              className={`blogx-pill${active === ALL ? ' active' : ''}`}
              onClick={() => setActive(ALL)}
              data-cursor-hover
            >
              <span className="blogx-pill-icon" style={{ background: allStyle.bg, color: allStyle.color }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={allStyle.icon} />
                </svg>
              </span>
              <span className="blogx-pill-text">
                <span className="blogx-pill-label">All</span>
                <span className="blogx-pill-count">{posts.length} posts</span>
              </span>
            </button>
          );
        })()}
        {categories.map(([cat, count], i) => {
          const style = getCategoryStyle(cat, i);
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active === cat}
              className={`blogx-pill${active === cat ? ' active' : ''}`}
              onClick={() => setActive(cat)}
              data-cursor-hover
            >
              <span className="blogx-pill-icon" style={{ background: style.bg, color: style.color }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={style.icon} />
                </svg>
              </span>
              <span className="blogx-pill-text">
                <span className="blogx-pill-label">{cat}</span>
                <span className="blogx-pill-count">{count} posts</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Featured hero card */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="blogx-featured" data-cursor-hover>
          {featured.imageSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="blogx-featured-img" src={featured.imageSrc} alt={featured.title} loading="eager" decoding="async" />
          )}
          <div className="blogx-featured-body">
            <div className="blogx-featured-tags">
              <span className="blogx-badge">Featured</span>
              <span className="blogx-cat">{featured.resolvedCategory}</span>
            </div>
            <h2 className="blogx-featured-title">{featured.title}</h2>
            {featured.excerpt && <p className="blogx-featured-excerpt">{featured.excerpt}</p>}
            <div className="blogx-meta">
              {featured.author && <span>{featured.author}</span>}
              {featured.author && formatDate(featured.publishedAt) && <span className="blogx-dot">·</span>}
              {formatDate(featured.publishedAt) && <span>{formatDate(featured.publishedAt)}</span>}
              {featured.readTime && <span className="blogx-dot">·</span>}
              {featured.readTime && <span>{featured.readTime} min read</span>}
            </div>
          </div>
        </Link>
      )}

      {/* All Articles list */}
      <div className="blogx-section-label">
        {active === ALL ? 'All Articles' : `${active} · ${filtered.length}`}
      </div>

      <div className="blogx-grid">
        {rest.map((post) => (
          <Link key={post._id} href={`/blog/${post.slug}`} className="blogx-card" data-cursor-hover>
            {post.imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="blogx-card-img" src={post.imageSrc} alt={post.title} loading="lazy" decoding="async" />
            )}
            <div className="blogx-card-body">
              <span className="blogx-cat">{post.resolvedCategory}</span>
              <h3 className="blogx-card-title">{post.title}</h3>
              {post.excerpt && <p className="blogx-card-excerpt">{post.excerpt}</p>}
              <div className="blogx-card-foot">
                <div className="blogx-meta">
                  {formatDate(post.publishedAt) && <span>{formatDate(post.publishedAt)}</span>}
                  {post.readTime && <span className="blogx-dot">·</span>}
                  {post.readTime && <span>{post.readTime} min read</span>}
                </div>
                <span className="blogx-card-read" aria-hidden="true">Read →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        /* ── Filter cards ── */
        .blogx-filters {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
          gap: 12px;
          margin-bottom: 48px;
        }
        .blogx-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid rgba(12,12,11,0.08);
          background: rgba(255,255,255,0.6);
          font-family: Inter, sans-serif;
          text-align: left;
          cursor: none;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .blogx-pill:hover {
          background: #fff;
          border-color: rgba(12,12,11,0.16);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(12,12,11,0.08);
        }
        .blogx-pill.active {
          background: #0C0C0B;
          border-color: #0C0C0B;
        }
        .blogx-pill-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }
        .blogx-pill-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .blogx-pill-label {
          font-size: 13.5px;
          font-weight: 700;
          color: #0C0C0B;
          letter-spacing: -0.1px;
          white-space: nowrap;
        }
        .blogx-pill-count {
          font-size: 11.5px;
          font-weight: 500;
          color: #9a958c;
        }
        .blogx-pill.active .blogx-pill-label { color: #F2EEE7; }
        .blogx-pill.active .blogx-pill-count { color: rgba(242,238,231,0.55); }

        /* ── Featured hero card ── */
        .blogx-featured {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 0;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(12,12,11,0.07);
          border-radius: 22px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          margin-bottom: 56px;
          cursor: none;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
        }
        .blogx-featured:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(12,12,11,0.12);
        }
        .blogx-featured-img {
          width: 100%;
          height: 100%;
          min-height: 320px;
          object-fit: cover;
          display: block;
        }
        .blogx-featured-body {
          padding: 40px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .blogx-featured-tags { display: flex; gap: 8px; align-items: center; margin-bottom: 18px; }
        .blogx-badge {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #fff;
          background: #E8541A;
          padding: 5px 12px;
          border-radius: 100px;
        }
        .blogx-featured-title {
          font-family: Inter, sans-serif;
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 900;
          letter-spacing: -1px;
          line-height: 1.12;
          margin: 0 0 16px;
          color: #0C0C0B;
        }
        .blogx-featured-excerpt {
          font-size: 15px;
          line-height: 1.65;
          color: #6E6B63;
          margin: 0 0 22px;
        }

        /* ── Category pill (orange text label) ── */
        .blogx-cat {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #E8541A;
          background: rgba(232,84,26,0.10);
          padding: 5px 11px;
          border-radius: 100px;
          align-self: flex-start;
        }

        /* ── Meta row ── */
        .blogx-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 500;
          color: #A8A49B;
        }
        .blogx-dot { opacity: 0.5; }

        /* ── Section label ── */
        .blogx-section-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #9a958c;
          margin-bottom: 22px;
        }

        /* ── Article grid (image-top cards, 3 columns) ── */
        .blogx-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .blogx-card {
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(12,12,11,0.06);
          border-radius: 18px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          cursor: none;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, background 0.2s;
        }
        .blogx-card:hover {
          transform: translateY(-4px);
          background: #fff;
          box-shadow: 0 16px 36px rgba(12,12,11,0.10);
        }
        .blogx-card-img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
        }
        .blogx-card-body {
          padding: 20px 22px 22px;
          display: flex;
          flex-direction: column;
          gap: 11px;
          flex: 1;
        }
        .blogx-card-title {
          font-family: Inter, sans-serif;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.4px;
          line-height: 1.25;
          margin: 0;
          color: #0C0C0B;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blogx-card-excerpt {
          font-size: 13.5px;
          line-height: 1.6;
          color: #6E6B63;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .blogx-card-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 6px;
          padding-top: 14px;
          border-top: 1px solid rgba(12,12,11,0.06);
        }
        .blogx-card-read {
          font-size: 13px;
          font-weight: 700;
          color: #E8541A;
          white-space: nowrap;
          transition: transform 0.3s ease;
        }
        .blogx-card:hover .blogx-card-read { transform: translateX(3px); }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .blogx-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 860px) {
          .blogx-featured { grid-template-columns: 1fr; }
          .blogx-featured-img { min-height: 220px; aspect-ratio: 16/9; height: auto; }
          .blogx-featured-body { padding: 28px 26px; }
        }
        @media (max-width: 620px) {
          .blogx-grid { grid-template-columns: 1fr; gap: 18px; }
          .blogx-filters {
            grid-template-columns: repeat(2, 1fr);
            margin-bottom: 32px;
          }
          .blogx-featured { margin-bottom: 40px; }
        }
      `}</style>
    </>
  );
}
