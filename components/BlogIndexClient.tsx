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

const PAGE_SIZE = 12;
// A category needs at least this many posts to sit in the main filter row.
// Anything smaller goes behind "More topics" so a one-post category does not
// get the same weight as one with sixty.
const MIN_PRIMARY_COUNT = 3;

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function Meta({ post }: { post: IndexPost }) {
  const date = formatDate(post.publishedAt);
  return (
    <div className="blogx-meta">
      {date && <time dateTime={post.publishedAt}>{date}</time>}
      {date && post.readTime ? <span aria-hidden="true">·</span> : null}
      {post.readTime ? <span>{post.readTime} min read</span> : null}
    </div>
  );
}

export default function BlogIndexClient({ posts }: { posts: IndexPost[] }) {
  const [active, setActive] = useState<string>(ALL);
  const [moreOpen, setMoreOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Category → count, sorted by count desc, split into the main row and the
  // long tail.
  const { primary, tail } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) {
      counts.set(p.resolvedCategory, (counts.get(p.resolvedCategory) ?? 0) + 1);
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    let main = sorted.filter(([, n]) => n >= MIN_PRIMARY_COUNT);
    let rest = sorted.filter(([, n]) => n < MIN_PRIMARY_COUNT);
    // Not worth a disclosure for one leftover, or when nothing qualifies.
    if (main.length === 0 || rest.length < 2) {
      main = sorted;
      rest = [];
    }
    return { primary: main, tail: rest };
  }, [posts]);

  const filtered = useMemo(
    () => (active === ALL ? posts : posts.filter((p) => p.resolvedCategory === active)),
    [posts, active],
  );

  // The newest post leads the page, only when viewing "All" (a filtered view
  // is a plain uniform list).
  const featured = active === ALL ? filtered[0] : null;
  const rest = featured ? filtered.slice(1) : filtered;
  const shown = Math.min(visible, rest.length);
  const remaining = rest.length - shown;

  // The tail stays open while one of its categories is the active filter, so
  // the pressed chip can never be hidden.
  const tailOpen = moreOpen || tail.some(([cat]) => cat === active);

  function select(cat: string) {
    setActive(cat);
    setVisible(PAGE_SIZE);
  }

  const chip = (cat: string, count: number, small?: boolean) => (
    <button
      key={cat}
      type="button"
      aria-pressed={active === cat}
      className={`blogx-chip${small ? ' blogx-chip-sm' : ''}`}
      onClick={() => select(cat)}
      data-cursor-hover
    >
      <span>{cat}</span>
      <span className="blogx-chip-count">
        {count}
        <span className="blogx-sr"> {count === 1 ? 'post' : 'posts'}</span>
      </span>
    </button>
  );

  return (
    <>
      {/* Category filter */}
      <div className="blogx-filters" role="group" aria-label="Filter posts by topic">
        {chip(ALL, posts.length)}
        {primary.map(([cat, count]) => chip(cat, count))}
        {tail.length > 0 && (
          <button
            type="button"
            className="blogx-more"
            aria-expanded={tailOpen}
            aria-controls="blogx-tail"
            onClick={() => setMoreOpen(!tailOpen)}
            data-cursor-hover
          >
            {tailOpen ? 'Fewer topics' : 'More topics'}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={tailOpen ? 'M2.5 7.5 6 4l3.5 3.5' : 'M2.5 4.5 6 8l3.5-3.5'} />
            </svg>
          </button>
        )}
        {tail.length > 0 && (
          <div id="blogx-tail" className="blogx-tail" data-open={tailOpen}>
            {tail.map(([cat, count]) => chip(cat, count, true))}
          </div>
        )}
      </div>

      {/* Latest post */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="blogx-featured" data-cursor-hover>
          {/* The LCP element on /blog for most visitors, hence `priority`. */}
          {featured.imageSrc && (
            <CoverImage
              className="blogx-featured-img"
              src={featured.imageSrc}
              alt={featured.title}
              sizes="(max-width: 860px) 100vw, 620px"
              priority
            />
          )}
          <div className="blogx-featured-body">
            <div className="blogx-kicker">
              <span className="blogx-kicker-new">Latest</span>
              <span aria-hidden="true">·</span>
              <span>{featured.resolvedCategory}</span>
            </div>
            <h2 className="blogx-featured-title">{featured.title}</h2>
            {featured.excerpt && <p className="blogx-featured-excerpt">{featured.excerpt}</p>}
            <div className="blogx-featured-foot">
              <Meta post={featured} />
              <span className="blogx-read" aria-hidden="true">
                Read the post
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Post list */}
      <div className="blogx-section-head">
        <h2 className="blogx-section-title">{active === ALL ? 'All posts' : active}</h2>
        <span className="blogx-section-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      {/* Every post link is rendered into the HTML. Cards past the current
          page carry "hidden" rather than being left out, so crawlers and
          in-page search still reach all of them. */}
      <div className="blogx-grid">
        {rest.map((post, i) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="blogx-card"
            hidden={i >= shown}
            data-cursor-hover
          >
            {post.imageSrc && (
              <CoverImage
                className="blogx-card-img"
                src={post.imageSrc}
                alt={post.title}
                sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 360px"
              />
            )}
            <div className="blogx-card-body">
              <span className="blogx-cat">{post.resolvedCategory}</span>
              <h3 className="blogx-card-title">{post.title}</h3>
              {post.excerpt && <p className="blogx-card-excerpt">{post.excerpt}</p>}
              <Meta post={post} />
            </div>
          </Link>
        ))}
      </div>

      {remaining > 0 && (
        <div className="blogx-more-wrap">
          <button
            type="button"
            className="blogx-load"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            data-cursor-hover
          >
            Show {Math.min(PAGE_SIZE, remaining)} more
          </button>
          <span className="blogx-load-note">
            Showing {shown} of {rest.length}
          </span>
        </div>
      )}

      <style>{`
        .blogx-sr {
          position: absolute; width: 1px; height: 1px; overflow: hidden;
          clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
        }

        /* ── Filter ──────────────────────────────────────────────────────
           Plain chips that wrap inside the content column. Nothing scrolls
           sideways and nothing can be wider than its container. */
        .blogx-filters {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
        }
        .blogx-chip, .blogx-more, .blogx-load {
          font-family: Inter, sans-serif;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .blogx-chip {
          /* Containing block for the visually hidden "posts" label. */
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          border-radius: 999px;
          border: 1px solid rgba(12,12,11,0.12);
          background: rgba(255,255,255,0.7);
          color: #0C0C0B;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.1px;
          white-space: nowrap;
          transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }
        .blogx-chip-count {
          font-size: 13px;
          font-weight: 500;
          color: #6E6B63;
          font-variant-numeric: tabular-nums;
        }
        .blogx-chip:hover { background: #fff; border-color: rgba(12,12,11,0.28); }
        .blogx-chip[aria-pressed="true"] {
          background: #0C0C0B;
          border-color: #0C0C0B;
          color: #fff;
        }
        .blogx-chip[aria-pressed="true"] .blogx-chip-count { color: rgba(255,255,255,0.7); }
        .blogx-chip-sm {
          height: 34px;
          padding: 0 13px;
          font-size: 13px;
          font-weight: 500;
          background: transparent;
        }
        .blogx-chip-sm .blogx-chip-count { font-size: 12px; }
        .blogx-more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 40px;
          padding: 0 10px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #55524B;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          transition: color 0.15s ease;
        }
        .blogx-more:hover { color: #0C0C0B; }
        .blogx-tail {
          flex-basis: 100%;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-top: 2px;
        }
        /* A data attribute, not "hidden": the CSS reset forces [hidden] to
           display:none from a cascade layer, which the narrow-screen rule
           below could not undo. */
        .blogx-tail[data-open="false"] { display: none; }
        .blogx-chip:focus-visible, .blogx-more:focus-visible, .blogx-load:focus-visible,
        .blogx-featured:focus-visible, .blogx-card:focus-visible {
          outline: 2px solid #E8541A;
          outline-offset: 3px;
        }

        /* ── Latest post ─────────────────────────────────────────────────
           One card, one link. The cover already carries a headline, so the
           text title beside it is set at reading size, not display size.
           Covers are 1200x630 and are never cropped: the box has exactly the
           source ratio. "!important" because next/image emits inline sizing. */
        .blogx-featured {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #fff;
          border: 1px solid rgba(12,12,11,0.08);
          border-radius: 22px;
          box-shadow: 0 1px 2px rgba(12,12,11,0.04);
          text-decoration: none;
          color: inherit;
          margin-bottom: 56px;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .blogx-featured:hover {
          border-color: rgba(12,12,11,0.16);
          box-shadow: 0 10px 30px rgba(12,12,11,0.08);
        }
        .blogx-featured-img {
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 1200 / 630;
          object-fit: cover !important;
          display: block;
          border-radius: 12px;
          background: #0C0C0B;
        }
        .blogx-featured-body {
          min-width: 0;
          padding: 16px 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .blogx-kicker {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #6E6B63;
        }
        .blogx-kicker-new { color: #E8541A; }
        .blogx-featured-title {
          font-family: Inter, sans-serif;
          /* !important here and on the other headings: globals.css forces
             display-size h2/h3 rules with !important below 1024px. */
          font-size: clamp(21px, 1.9vw, 26px) !important;
          font-weight: 800;
          letter-spacing: -0.02em !important;
          line-height: 1.2 !important;
          margin: 0;
          color: #0C0C0B;
          text-wrap: balance;
        }
        .blogx-featured-excerpt {
          font-size: 15.5px;
          line-height: 1.6;
          color: #55524B;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blogx-featured-foot {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px 16px;
          margin-top: 6px;
        }
        .blogx-read {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
          color: #E8541A;
          white-space: nowrap;
        }
        .blogx-read svg { transition: transform 0.2s ease; }
        .blogx-featured:hover .blogx-read svg { transform: translateX(3px); }

        .blogx-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #6E6B63;
        }

        /* ── Section head ── */
        .blogx-section-head {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-bottom: 14px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(12,12,11,0.1);
        }
        .blogx-section-title {
          font-family: Inter, sans-serif;
          font-size: 20px !important;
          font-weight: 800;
          letter-spacing: -0.02em !important;
          line-height: 1.2 !important;
          margin: 0;
          color: #0C0C0B;
        }
        .blogx-section-count { font-size: 14px; color: #6E6B63; font-variant-numeric: tabular-nums; }

        /* ── Grid ── */
        .blogx-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px 24px;
        }
        .blogx-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1px solid rgba(12,12,11,0.08);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .blogx-card[hidden] { display: none; }
        .blogx-card:hover {
          transform: translateY(-2px);
          border-color: rgba(12,12,11,0.16);
          box-shadow: 0 10px 28px rgba(12,12,11,0.08);
        }
        .blogx-card-img {
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 1200 / 630;
          object-fit: cover !important;
          display: block;
          background: #0C0C0B;
        }
        .blogx-card-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .blogx-cat {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #C2410C;
        }
        .blogx-card-title {
          font-family: Inter, sans-serif;
          font-size: 18px !important;
          font-weight: 700;
          letter-spacing: -0.015em !important;
          line-height: 1.3 !important;
          margin: 0;
          color: #0C0C0B;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blogx-card-excerpt {
          font-size: 14.5px;
          line-height: 1.55;
          color: #55524B;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blogx-card-body .blogx-meta { margin-top: auto; padding-top: 8px; }

        /* ── Show more ── */
        .blogx-more-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: 44px;
        }
        .blogx-load {
          height: 48px;
          padding: 0 28px;
          border-radius: 999px;
          border: 1px solid #0C0C0B;
          background: transparent;
          color: #0C0C0B;
          font-size: 15px;
          font-weight: 600;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .blogx-load:hover { background: #0C0C0B; color: #fff; }
        .blogx-load-note { font-size: 13px; color: #6E6B63; font-variant-numeric: tabular-nums; }

        /* The site's custom dot cursor replaces the system one on these
           surfaces. Behind a pointer query, because on a touchscreen
           \`cursor: none\` cannot summon a dot cursor that never mounts (see
           Cursor.tsx, which bails on coarse pointers). */
        @media (hover: hover) and (pointer: fine) {
          .blogx-chip, .blogx-more, .blogx-load, .blogx-featured, .blogx-card { cursor: none; }
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .blogx-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 20px; }
          .blogx-featured-body { padding: 12px 20px; }
        }
        @media (max-width: 860px) {
          .blogx-featured { grid-template-columns: minmax(0, 1fr); gap: 0; margin-bottom: 44px; }
          .blogx-featured-body { padding: 20px 12px 12px; }
          .blogx-featured-title { font-size: 22px !important; }
          /* Touch widths: every control is at least 44px tall. */
          .blogx-chip, .blogx-chip-sm, .blogx-more { height: 44px; }
          .blogx-chip { font-size: 15px; }
          .blogx-chip-sm { font-size: 14px; padding: 0 15px; }
          .blogx-chip-sm .blogx-chip-count { font-size: 13px; }
          .blogx-chip { padding: 0 14px; }
          .blogx-filters { gap: 6px; }
        }
        @media (pointer: coarse) {
          .blogx-chip, .blogx-chip-sm, .blogx-more { height: 44px; }
        }
        /* Narrow screens: one row that scrolls sideways inside the column,
           with snap points and a fade on the right edge as the hint. Every
           topic is in the row, so the "More" control is not needed here. */
        @media (max-width: 860px) {
          .blogx-filters {
            flex-wrap: nowrap;
            overflow-x: auto;
            overscroll-behavior-x: contain;
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: x proximity;
            scroll-padding-left: 4px;
            scrollbar-width: none;
            gap: 8px;
            /* Room for the focus ring, which overflow would otherwise clip. */
            padding: 5px 44px 5px 4px;
            margin-left: -4px;
            margin-top: -5px;
            -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 48px), transparent);
            mask-image: linear-gradient(to right, #000 calc(100% - 48px), transparent);
          }
          .blogx-filters::-webkit-scrollbar { display: none; }
          .blogx-chip { flex: 0 0 auto; scroll-snap-align: start; }
          .blogx-more { display: none; }
          .blogx-tail, .blogx-tail[data-open="false"] { display: contents; }
        }
        @media (max-width: 640px) {
          .blogx-filters { margin-bottom: 19px; }
          .blogx-grid { grid-template-columns: minmax(0, 1fr); gap: 20px; }
          .blogx-featured { padding: 8px; border-radius: 18px; }
          .blogx-featured-img { border-radius: 11px; }
          .blogx-featured-excerpt, .blogx-card-excerpt { font-size: 16px; }
          .blogx-card-title { font-size: 19px !important; }
          .blogx-meta { font-size: 14px; }
          .blogx-load { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .blogx-chip, .blogx-more, .blogx-load, .blogx-featured, .blogx-card, .blogx-read svg { transition: none; }
          .blogx-card:hover, .blogx-featured:hover .blogx-read svg { transform: none; }
        }
      `}</style>
    </>
  );
}
