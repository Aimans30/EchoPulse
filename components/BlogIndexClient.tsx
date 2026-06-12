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
      {/* Category filter pills */}
      <div className="blogx-filters" role="tablist" aria-label="Filter posts by category">
        <button
          type="button"
          role="tab"
          aria-selected={active === ALL}
          className={`blogx-pill${active === ALL ? ' active' : ''}`}
          onClick={() => setActive(ALL)}
          data-cursor-hover
        >
          All <span className="blogx-pill-count">{posts.length}</span>
        </button>
        {categories.map(([cat, count]) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            className={`blogx-pill${active === cat ? ' active' : ''}`}
            onClick={() => setActive(cat)}
            data-cursor-hover
          >
            {cat} <span className="blogx-pill-count">{count}</span>
          </button>
        ))}
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
        /* ── Filter pills ── */
        .blogx-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 48px;
        }
        .blogx-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border-radius: 100px;
          border: 1px solid rgba(12,12,11,0.10);
          background: rgba(255,255,255,0.5);
          font-family: Inter, sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #3E3D3A;
          cursor: none;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .blogx-pill:hover { background: #fff; border-color: rgba(12,12,11,0.2); }
        .blogx-pill.active {
          background: #0C0C0B;
          border-color: #0C0C0B;
          color: #F2EEE7;
        }
        .blogx-pill-count {
          font-size: 11px;
          font-weight: 700;
          opacity: 0.55;
        }
        .blogx-pill.active .blogx-pill-count { opacity: 0.7; }

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
          .blogx-filters { margin-bottom: 32px; }
          .blogx-featured { margin-bottom: 40px; }
        }
      `}</style>
    </>
  );
}
