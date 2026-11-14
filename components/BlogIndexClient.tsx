'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

/**
 * `imageSrc` is either a URL this app built from a Sanity asset or the raw
 * `mainImageUrl` string an author typed into Sanity, which on older posts
 * points at hosts next.config.ts never whitelisted. next/image throws on an
 * un-whitelisted host, and this is the index page, so one bad row would take
 * the whole listing down. Anything not known-good keeps the plain <img>.
 */
function isOptimizableHost(url?: string | null): boolean {
  if (!url) return false;
  return url.startsWith('/') || url.startsWith('https://cdn.sanity.io/');
}

/**
 * Sanity CDN filenames state their intrinsic size (`<hash>-1200x630.png`).
 * Reading it back is what lets next/image reserve the card's image box, so
 * the grid stops re-flowing under the reader's thumb as covers stream in.
 */
function sanityDims(url?: string | null): { w: number; h: number } | null {
  if (!url) return null;
  const m = url.match(/-(\d{2,5})x(\d{2,5})(?:[-.]|$)/);
  if (!m) return null;
  const w = Number(m[1]);
  const h = Number(m[2]);
  return w > 0 && h > 0 ? { w, h } : null;
}

// The server requests every index cover at exactly 1200x630 (see app/blog/page.tsx),
// so that is the ratio when the URL came from the image builder. When it came
// from a raw mainImageUrl we read the ratio out of the filename instead.
function cardDims(src: string): { w: number; h: number } | null {
  if (src.includes('cdn.sanity.io') && src.includes('w=1200') && src.includes('h=630')) return { w: 1200, h: 630 };
  return sanityDims(src);
}

/**
 * One cover, rendered through next/image where the host allows it.
 *
 * Every card on this page was a raw <img> pointed at a single fixed 900px
 * Sanity render with no width/height, so a phone downloaded a desktop-sized
 * file for a ~330px card and the grid re-flowed as each one decoded. `sizes`
 * is what makes the browser pick a width that matches the slot it is filling.
 */
function CoverImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  const dims = cardDims(src);
  if (!isOptimizableHost(src) || !dims) {
    // Un-whitelisted host or unreadable size: explicit width/height still
    // reserves the box, which is the layout-shift half of the problem.
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        className={className}
        src={src}
        alt={alt}
        width={1200}
        height={630}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }
  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={dims.w}
      height={dims.h}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
    />
  );
}

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
      <div className="blogx-filters-wrap" data-fit={categories.length + 1 <= 8 ? 'grid' : 'scroll'}>
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
              // The category colour is handed to CSS as a custom property so
              // the active tint, border and glow can all be derived from it
              // without writing seven hard-coded rules.
              style={{ '--cat': allStyle.color, '--cat-bg': allStyle.bg } as React.CSSProperties}
            >
              <span className="blogx-pill-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={allStyle.icon} />
                </svg>
              </span>
              <span className="blogx-pill-text">
                <span className="blogx-pill-label">All</span>
                <span className="blogx-pill-count">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
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
              style={{ '--cat': style.color, '--cat-bg': style.bg } as React.CSSProperties}
            >
              <span className="blogx-pill-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={style.icon} />
                </svg>
              </span>
              <span className="blogx-pill-text">
                <span className="blogx-pill-label">{cat}</span>
                <span className="blogx-pill-count">{count} {count === 1 ? 'post' : 'posts'}</span>
              </span>
            </button>
          );
        })}
      </div>
      </div>

      {/* Featured hero card */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="blogx-featured" data-cursor-hover>
          {/* The LCP element on /blog for most visitors, hence `priority`. It
              is one column of a 1.15/1 split on desktop and full-bleed below
              860px, which is what `sizes` has to say. */}
          {featured.imageSrc && (
            <CoverImage
              className="blogx-featured-img"
              src={featured.imageSrc}
              alt={featured.title}
              sizes="(max-width: 860px) 100vw, 600px"
              priority
            />
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
            {/* Three columns at desktop width, two at 1024, one on a phone.
                A ~330px card was being handed a 900px file on every screen. */}
            {post.imageSrc && (
              <CoverImage
                className="blogx-card-img"
                src={post.imageSrc}
                alt={post.title}
                sizes="(max-width: 620px) 100vw, (max-width: 1024px) 50vw, 330px"
              />
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
        /* ── Category filter cards ───────────────────────────────────────
           Ported from the MagicBnB blog index: a row of glass cards, icon
           chip stacked above the label and the count, lifting on hover and
           tinting to the category's own colour when selected.

           Two deliberate differences from the original. First the palette is
           EchoPulse's, so the tint is derived from --cat (set per button in
           the markup) instead of MagicBnB's purple. Second, and this is the
           part that actually makes glass look like glass: MagicBnB sits on a
           lavender gradient with a radial white wash, so a translucent card
           has something to refract. This page was flat #F2EEE7, where
           backdrop-filter is a no-op and a translucent card is just a slightly
           paler rectangle. The wash behind .blogx-filters below supplies the
           depth the effect needs. */
        /* One row, always. With 8 tiles or fewer (data-fit="grid") they share
           the width equally on desktop; otherwise, and below 861px, the row
           scrolls sideways with snap points, a hidden scrollbar and a fade on
           the right edge as the hint. It never wraps to a second row. */
        .blogx-filters-wrap { position: relative; margin-bottom: 48px; }
        .blogx-filters {
          position: relative;
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(0, 1fr);
          gap: 10px;
        }
        .blogx-filters-wrap[data-fit="scroll"] .blogx-filters { grid-auto-columns: minmax(132px, 1fr); }
        @media (min-width: 861px) {
          .blogx-filters-wrap[data-fit="scroll"] .blogx-filters,
          .blogx-filters-wrap[data-fit="grid"] .blogx-filters { display: grid; }
        }
        /* The thing the cards refract. Sits behind them, bleeds past the grid
           on both sides, and is purely decorative. */
        .blogx-filters::before {
          content: "";
          position: absolute;
          inset: -28px -40px;
          z-index: 0;
          pointer-events: none;
          border-radius: 32px;
          background:
            radial-gradient(ellipse 60% 70% at 25% 30%, rgba(232,84,26,0.08) 0%, transparent 68%),
            radial-gradient(ellipse 55% 70% at 80% 60%, rgba(255,255,255,0.75) 0%, transparent 70%),
            linear-gradient(140deg, rgba(255,255,255,0.55) 0%, rgba(242,238,231,0) 60%);
        }
        .blogx-pill {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          padding: 12px;
          min-height: 44px;
          min-width: 0;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.85);
          /* 0.68, not MagicBnB's 0.52. Theirs sits on a lavender gradient so a
             half-transparent white card separates cleanly. Ours sits on cream,
             where white at 52% is nearly the same value as the background and
             the cards dissolve into it. Checked side by side in the browser. */
          background: rgba(255,255,255,0.68);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 4px 24px rgba(12,12,11,0.06);
          font-family: Inter, sans-serif;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease;
        }
        .blogx-pill:hover {
          background: rgba(255,255,255,0.72);
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(12,12,11,0.10);
        }
        .blogx-pill:focus-visible {
          outline: 2px solid var(--cat, #E8541A);
          outline-offset: 3px;
        }
        /* Selected: tinted in the category's own colour and lifted, rather
           than the old solid-black fill. Black read as "disabled" next to the
           pale cards around it and threw away the colour coding the icons
           already establish. */
        .blogx-pill.active {
          background: color-mix(in srgb, var(--cat, #E8541A) 12%, rgba(255,255,255,0.72));
          border: 1.5px solid color-mix(in srgb, var(--cat, #E8541A) 42%, transparent);
          box-shadow: 0 10px 32px color-mix(in srgb, var(--cat, #E8541A) 22%, transparent);
          transform: translateY(-4px);
        }
        /* Icon chip colours come from the custom properties on the button, not
           from an inline style, specifically so the selected rule below can
           override them. Inline styles beat stylesheets, so with the colours
           set on the element the chip could never change on selection without
           a pile of !important. */
        .blogx-pill-icon {
          flex-shrink: 0;
          width: 30px;
          height: 30px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cat-bg, rgba(12,12,11,0.08));
          color: var(--cat, #0C0C0B);
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        /* Selection has to be unmistakable at a glance, because this row is
           the only control on the page and a reader who cannot tell whether
           their click registered will click again and bounce. The tint and
           lift alone were too quiet against cream, so the chip flips to a
           solid fill in the category colour with a white glyph. That is the
           one change nobody can miss. */
        .blogx-pill.active .blogx-pill-icon {
          background: var(--cat, #E8541A);
          color: #fff;
          transform: scale(1.06);
        }
        .blogx-pill-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .blogx-pill-label {
          font-size: 13px;
          font-weight: 700;
          color: #0C0C0B;
          letter-spacing: -0.1px;
          line-height: 1.2;
          overflow-wrap: break-word;
        }
        .blogx-pill-count {
          font-size: 11.5px;
          font-weight: 600;
          color: #9a958c;
        }
        /* The count takes the category colour, which is what gives the
           MagicBnB row its liveliness. */
        .blogx-pill.active .blogx-pill-count { color: var(--cat, #E8541A); }

        /* Tablet and phone, or any time there are too many tiles: a single
           swipeable row. Padding top/bottom leaves room for the hover lift and
           shadow, which overflow-x would otherwise clip. */
        @media (max-width: 860px) {
          .blogx-filters-wrap { margin-bottom: 32px; }
          .blogx-filters-wrap::after {
            content: "";
            position: absolute;
            top: 0; right: 0; bottom: 0;
            width: 36px;
            pointer-events: none;
            z-index: 2;
            background: linear-gradient(to left, #F2EEE7 15%, rgba(242,238,231,0));
          }
          .blogx-filters {
            display: flex !important;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: x proximity;
            scrollbar-width: none;
            padding: 6px 36px 12px 2px;
            margin: -6px 0 -12px;
          }
          .blogx-filters::-webkit-scrollbar { display: none; }
          .blogx-filters::before { display: none; }
          .blogx-pill { flex: 0 0 auto; scroll-snap-align: start; box-shadow: 0 2px 8px rgba(12,12,11,0.06); }
          .blogx-pill:hover { box-shadow: 0 2px 8px rgba(12,12,11,0.06); }
          /* Soft shadows would be sliced into a visible box by the scroller. */
          .blogx-pill.active { box-shadow: 0 3px 8px color-mix(in srgb, var(--cat, #E8541A) 20%, transparent); }
        }
        @media (max-width: 620px) {
          /* Compact pill: icon, name and count on ONE line. */
          .blogx-pill { flex-direction: row; align-items: center; gap: 8px; padding: 6px 14px 6px 8px; min-height: 44px; border-radius: 100px; }
          .blogx-pill:hover, .blogx-pill.active { transform: none; }
          .blogx-pill-icon { width: 28px; height: 28px; border-radius: 50%; }
          .blogx-pill-text { flex-direction: row; align-items: baseline; gap: 6px; }
          .blogx-pill-label { font-size: 14px; white-space: nowrap; }
          .blogx-pill-count { font-size: 12px; white-space: nowrap; }
        }
        @media (prefers-reduced-motion: reduce) {
          .blogx-pill, .blogx-pill-icon { transition: none; }
          .blogx-pill:hover, .blogx-pill.active { transform: none; }
        }

        /* ── Featured hero card ── */
        .blogx-featured {
          display: grid;
          grid-template-columns: 55fr 45fr;
          align-items: center;
          gap: 40px;
          text-decoration: none;
          color: inherit;
          margin-bottom: 56px;
        }
        /* Covers are a designed 1200x630 composition with the headline typeset
           inside the image, so they are NEVER cropped: the box has exactly the
           source ratio, the image fills it, and the card has no inner inset.
           "!important" because next/image emits its own inline sizing. */
        .blogx-featured-img {
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 1200 / 630;
          object-fit: cover !important;
          display: block;
          border-radius: 18px;
          box-shadow: 0 14px 40px rgba(12,12,11,0.12);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
        }
        .blogx-featured:hover .blogx-featured-img {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(12,12,11,0.18);
        }
        .blogx-featured-body {
          padding: 0;
          min-width: 0;
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
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, background 0.2s;
        }
        .blogx-card:hover {
          transform: translateY(-4px);
          background: #fff;
          box-shadow: 0 16px 36px rgba(12,12,11,0.10);
        }
        /* Same reasoning as the featured card: 16/9 cropped a 1200x630 cover,
           losing the start of the headline on every tile in the grid. */
        .blogx-card-img {
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 1200 / 630;
          object-fit: cover !important;
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

        /* The site's custom dot cursor replaces the system one, so these three
           surfaces hid it. Behind a pointer query, because on a touchscreen
           \`cursor: none\` cannot summon a dot cursor that never mounts (see
           Cursor.tsx, which bails on coarse pointers), it only strips the
           affordance a hybrid touch laptop would otherwise show. */
        @media (hover: hover) and (pointer: fine) {
          .blogx-pill, .blogx-featured, .blogx-card { cursor: none; }
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .blogx-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 860px) {
          .blogx-featured { grid-template-columns: 1fr; gap: 22px; }
          .blogx-featured-body { padding: 0; }
        }
        @media (max-width: 620px) {
          .blogx-grid { grid-template-columns: 1fr; gap: 18px; }
          .blogx-featured { margin-bottom: 40px; }
          .blogx-featured-title { font-size: 24px; }
          .blogx-card-body { padding: 18px 18px 20px; }
        }
      `}</style>
    </>
  );
}
