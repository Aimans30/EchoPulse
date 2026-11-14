import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { urlFor } from '@/lib/sanity';
import { slugifyHeading, blockToPlainText } from '@/lib/toc';

/**
 * Intrinsic size of a Sanity asset, read off the id it is already carrying.
 *
 * A Sanity asset `_ref` is `image-<hash>-1200x630-png`, and a Sanity CDN
 * filename is `<hash>-1200x630.png`. Both state the original dimensions, which
 * is the one thing next/image needs and the one thing these blocks never
 * passed. Without it the phone reserved no box, so every article image shoved
 * the paragraph the reader was mid-sentence on down the page as it decoded.
 *
 * Only the RATIO matters to next/image, so handing it the original numbers is
 * correct even when the rendered image is a 1400px-wide derivative.
 */
function sanityDims(idOrUrl?: string): { w: number; h: number } | null {
  if (!idOrUrl) return null;
  const m = idOrUrl.match(/-(\d{2,5})x(\d{2,5})(?:[-.]|$)/);
  if (!m) return null;
  const w = Number(m[1]);
  const h = Number(m[2]);
  return w > 0 && h > 0 ? { w, h } : null;
}

/**
 * next.config.ts only whitelists specific remote hosts, and `imageUrl` blocks
 * are free-form strings authored in Sanity: older posts point at hosts that
 * were never whitelisted. Passing one of those to next/image throws at render
 * and takes the whole article down, so anything that is not a known-good host
 * keeps the plain <img> path.
 */
function isOptimizableHost(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('/') || url.startsWith('https://cdn.sanity.io/');
}

// The article column is capped at 760px, so past that breakpoint the browser
// never needs more than 760 CSS px of image regardless of screen width.
const ARTICLE_SIZES = '(max-width: 900px) 100vw, 760px';

/**
 * Renderer for the rich-text `content` field on a Sanity blog post.
 *
 * Handles:
 *   • Block text (paragraphs, headings, lists, blockquotes)
 *   • Inline Sanity images (the `image` type with hotspot)
 *   • Image-from-URL blocks (the custom `imageUrl` type in the schema)
 *   • Video embeds (the custom `video` type — renders the URL as a player
 *     when it's YouTube, Vimeo, or a Loom; otherwise falls back to a link)
 *
 * Styling follows the EchoPulse cream/black/orange palette.
 */

function youtubeId(url: string): string | null {
  // Matches https://www.youtube.com/watch?v=XXXX, https://youtu.be/XXXX, embed URLs, etc.
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

function loomId(url: string): string | null {
  const m = url.match(/loom\.com\/share\/([a-f0-9]+)/i);
  return m ? m[1] : null;
}

function VideoEmbed({ url, caption }: { url: string; caption?: string }) {
  const yt = youtubeId(url);
  const vm = vimeoId(url);
  const lm = loomId(url);

  let embedSrc: string | null = null;
  if (yt) embedSrc = `https://www.youtube.com/embed/${yt}`;
  else if (vm) embedSrc = `https://player.vimeo.com/video/${vm}`;
  else if (lm) embedSrc = `https://www.loom.com/embed/${lm}`;

  return (
    <figure style={{ margin: '32px 0' }}>
      {embedSrc ? (
        <div
          style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: '14px',
            background: '#0C0C0B',
            boxShadow: '0 12px 36px rgba(12,12,11,0.10)',
          }}
        >
          <iframe
            src={embedSrc}
            title={caption || 'Embedded video'}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
          />
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '14px 18px',
            border: '1px solid rgba(12,12,11,0.12)',
            borderRadius: '12px',
            color: '#E8541A',
            textDecoration: 'none',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          ▶ Watch video → {url}
        </a>
      )}
      {caption && (
        <figcaption
          style={{
            marginTop: '10px',
            fontSize: '13px',
            color: '#6E6B63',
            textAlign: 'center',
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Build the Portable Text renderer config. Created per-render so the heading
 * de-dupe counter (`headingSeen`) starts fresh each time and stays in lockstep
 * with lib/toc.ts extractHeadings — both walk the same blocks in order and
 * apply the same slug + numeric-suffix rule, so sidebar links resolve.
 */
function buildComponents(): PortableTextComponents {
  const headingSeen = new Map<string, number>();
  const headingId = (text: string): string => {
    let id = slugifyHeading(text);
    const count = headingSeen.get(id) ?? 0;
    headingSeen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;
    return id;
  };

  const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).width(1400).fit('max').auto('format').url();
      const dims = sanityDims(value.asset?._ref);
      const imgStyle: React.CSSProperties = {
        width: '100%',
        height: 'auto',
        borderRadius: '14px',
        display: 'block',
        boxShadow: '0 12px 36px rgba(12,12,11,0.08)',
      };
      return (
        <figure style={{ margin: '32px 0' }}>
          {dims ? (
            <Image
              src={url}
              alt={value.alt || ''}
              width={dims.w}
              height={dims.h}
              sizes={ARTICLE_SIZES}
              style={imgStyle}
            />
          ) : (
            // No parsable ref: keep the original tag rather than risk a throw.
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={url}
              alt={value.alt || ''}
              loading="lazy"
              decoding="async"
              style={imgStyle}
            />
          )}
          {value.caption && (
            <figcaption
              style={{
                marginTop: '10px',
                fontSize: '13px',
                color: '#6E6B63',
                textAlign: 'center',
              }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    imageUrl: ({ value }) => {
      if (!value?.url) return null;
      const dims = isOptimizableHost(value.url) ? sanityDims(value.url) : null;
      const imgStyle: React.CSSProperties = {
        width: '100%',
        height: 'auto',
        borderRadius: '14px',
        display: 'block',
        boxShadow: '0 12px 36px rgba(12,12,11,0.08)',
      };
      return (
        <figure style={{ margin: '32px 0' }}>
          {dims ? (
            <Image
              src={value.url}
              alt={value.alt || ''}
              width={dims.w}
              height={dims.h}
              sizes={ARTICLE_SIZES}
              style={imgStyle}
            />
          ) : (
            // Unknown host or unknown size: a raw <img> is the only safe render.
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={value.url}
              alt={value.alt || ''}
              loading="lazy"
              decoding="async"
              style={imgStyle}
            />
          )}
          {value.caption && (
            <figcaption
              style={{
                marginTop: '10px',
                fontSize: '13px',
                color: '#6E6B63',
                textAlign: 'center',
              }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    video: ({ value }) => {
      if (!value?.url) return null;
      return <VideoEmbed url={value.url} caption={value.caption} />;
    },
    table: ({ value }) => {
      const rows: TableRow[] = Array.isArray(value?.rows) ? value.rows : [];
      if (!rows.length) return null;
      return <BlogTable rows={rows} hasHeader={value?.hasHeader !== false} />;
    },
  },
  block: {
    // Rendered as an <h2>, not an <h1>, on purpose.
    //
    // The page already emits the post title as the single <h1>. Several older
    // Sanity documents also open their body with an h1 block, which produced
    // TWO h1s on the same page and duplicated the title visibly under the
    // author box. Downgrading here fixes every existing post at once, with no
    // content migration, and keeps the heading hierarchy legal for crawlers.
    // The h1 visual style is retained so nothing looks different.
    h1: ({ children, value }) => {
      const id = headingId(blockToPlainText(value as PortableTextBlock));
      return (
        <h2 id={id} style={{ ...blogH1Style, scrollMarginTop: '120px' }}>
          {children}
        </h2>
      );
    },
    h2: ({ children, value }) => {
      const id = headingId(blockToPlainText(value as PortableTextBlock));
      // scroll-margin-top keeps the heading clear of the fixed nav when an
      // anchor link jumps to it.
      return (
        <h2 id={id} style={{ ...blogH2Style, scrollMarginTop: '120px' }}>
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const id = headingId(blockToPlainText(value as PortableTextBlock));
      return (
        <h3 id={id} style={{ ...blogH3Style, scrollMarginTop: '120px' }}>
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4 style={blogH4Style}>{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote style={blogQuoteStyle}>{children}</blockquote>
    ),
    normal: ({ children }) => (
      <p style={blogParagraphStyle}>{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => <ul style={blogListStyle}>{children}</ul>,
    number: ({ children }) => <ol style={blogListStyle}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li style={blogListItemStyle}>{children}</li>,
    number: ({ children }) => <li style={blogListItemStyle}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong style={{ fontWeight: 700, color: '#0C0C0B' }}>{children}</strong>
    ),
    em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#E8541A',
          textDecoration: 'underline',
          textDecorationColor: 'rgba(232,84,26,0.5)',
          textUnderlineOffset: '3px',
        }}
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code
        style={{
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: '0.92em',
          padding: '2px 6px',
          background: 'rgba(12,12,11,0.06)',
          borderRadius: '4px',
          // A single unbroken token (an API key, a long URL) is otherwise wider
          // than a 360px phone and pushes the whole article sideways.
          overflowWrap: 'anywhere',
        }}
      >
        {children}
      </code>
    ),
  },
  };

  return components;
}

/**
 * Older posts were written with markdown pipe tables before the schema had a
 * table block, so Sanity holds them as a run of plain paragraphs:
 *
 *   "Route | First year cost | What you give up"
 *   "Systeme.io Webinar plan | About $564 | Your own time"
 *
 * and the site printed them as literal text with pipes. This folds any run of
 * two or more consecutive plain paragraphs that share the same number of
 * " | " separators into one synthetic `table` block (first row = header), so
 * every existing post is fixed at render time with no content migration.
 * Markdown separator rows ("--- | ---") are dropped.
 */
function foldPipeTables(blocks: PortableTextBlock[]): PortableTextBlock[] {
  const textOf = (b: PortableTextBlock): string | null => {
    const blk = b as { _type?: string; style?: string; listItem?: string; children?: Array<{ text?: string }> };
    if (blk._type !== 'block' || blk.listItem || (blk.style && blk.style !== 'normal')) return null;
    return (blk.children ?? []).map((c) => c.text ?? '').join('').trim();
  };
  const cellsOf = (t: string): string[] =>
    t.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
  const isSeparator = (cells: string[]) => cells.every((c) => /^:?-{2,}:?$/.test(c));

  const out: PortableTextBlock[] = [];
  let run: string[][] = [];
  let runKey = '';
  const flush = () => {
    if (run.length >= 2) {
      out.push({
        _type: 'table',
        _key: `pipe-${runKey}`,
        hasHeader: true,
        rows: run.map((cells, i) => ({ _type: 'tableRow', _key: `${runKey}-${i}`, cells })),
      } as unknown as PortableTextBlock);
    } else if (run.length === 1) {
      out.push(held[0]);
    }
    run = [];
    held = [];
  };
  let held: PortableTextBlock[] = [];
  for (const b of blocks) {
    const t = textOf(b);
    const cells = t && t.includes('|') ? cellsOf(t) : null;
    if (cells && cells.length >= 2 && (run.length === 0 || cells.length === run[0].length)) {
      if (run.length === 0) runKey = (b as { _key?: string })._key ?? String(out.length);
      if (!isSeparator(cells)) run.push(cells);
      held.push(b);
      continue;
    }
    flush();
    if (cells && cells.length >= 2) {
      runKey = (b as { _key?: string })._key ?? String(out.length);
      if (!isSeparator(cells)) run.push(cells);
      held.push(b);
    } else {
      out.push(b);
    }
  }
  flush();
  return out;
}

export default function BlogContent({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="blog-prose">
      <PortableText value={foldPipeTables(value)} components={buildComponents()} />
      <style>{`
        /* Anything wide that an author can put in a post has to scroll inside
           its own box rather than widen the article. On a phone a single
           overflowing table or code fence makes the ENTIRE page pannable
           sideways, which reads as broken and is very hard to recover from
           mid-article. Every rule here is a containment rule, not a restyle. */
        .blog-prose pre {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          max-width: 100%;
        }
        /* Raw tables pasted into Sanity (not ours) scroll in place. */
        .blog-prose table:not(.bt) {
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          max-width: 100%;
        }

        /* ── Tables ──────────────────────────────────────────────────────
           Up to 6 columns must fit the article column with no scrollbar:
           auto layout so columns size to content, cells wrap on word
           boundaries (overflow-wrap: break-word does not shrink min-content,
           so words are never chopped mid-word; only links, the usual long
           unbroken strings, may break anywhere), and padding + type shrink as
           the column count rises. 7+ columns scroll inside their own box with
           a right-edge fade as the hint. */
        .bt-wrap {
          position: relative;
          margin: 28px 0 32px;
          max-width: 100%;
          border: 1px solid rgba(12,12,11,0.12);
          border-radius: 12px;
          background: #FFFFFF;
          overflow: hidden;
        }
        .bt-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; }
        .bt {
          display: table;
          width: 100%;
          table-layout: auto;
          border-collapse: collapse;
          font-family: Inter, sans-serif;
          font-size: 15px;
          line-height: 1.45;
          color: #3E3D3A;
        }
        .bt th, .bt td {
          text-align: left;
          padding: 12px 14px;
          word-break: normal;
          overflow-wrap: break-word;
          hyphens: manual;
        }
        .bt th {
          vertical-align: bottom;
          font-weight: 700;
          font-size: 12.5px;
          line-height: 1.25;
          letter-spacing: 0.2px;
          text-transform: uppercase;
          color: #0C0C0B;
          background: #F2EEE7;
          border-bottom: 2px solid #E8541A;
          white-space: normal;
        }
        .bt td { vertical-align: top; border-bottom: 1px solid rgba(12,12,11,0.08); }
        .bt tbody tr:nth-child(even) td { background: rgba(12,12,11,0.025); }
        .bt tbody tr:last-child td { border-bottom: 0; }
        .bt td a, .bt th a { overflow-wrap: anywhere; }
        .bt[data-cols="4"] th, .bt[data-cols="4"] td { padding: 11px 12px; font-size: 14.5px; }
        .bt[data-cols="4"] th { font-size: 12px; }
        .bt[data-cols="5"] th, .bt[data-cols="5"] td { padding: 10px 10px; font-size: 14px; }
        .bt[data-cols="5"] th { font-size: 11.5px; }
        .bt[data-cols="6"] th, .bt[data-cols="6"] td { padding: 9px 8px; font-size: 13px; line-height: 1.4; }
        .bt[data-cols="6"] th { font-size: 11px; letter-spacing: 0.1px; }
        .bt[data-cols="7+"] { min-width: 820px; }
        .bt[data-cols="7+"] th, .bt[data-cols="7+"] td { padding: 9px 10px; font-size: 13px; line-height: 1.4; }
        .bt[data-cols="7+"] th { font-size: 11px; }
        .bt-wrap-wide::after {
          content: "";
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 40px;
          pointer-events: none;
          background: linear-gradient(to left, #FFFFFF 10%, rgba(255,255,255,0));
        }

        /* Phone: 2 and 3 column tables stay tables, just tighter. */
        @media (max-width: 759.98px) {
          .bt[data-cols="2"] th, .bt[data-cols="2"] td,
          .bt[data-cols="3"] th, .bt[data-cols="3"] td { padding: 10px 10px; font-size: 14px; }
          .bt[data-cols="2"] th, .bt[data-cols="3"] th { font-size: 11.5px; }

          /* 4+ columns: each row becomes a card. The DOM is untouched, so
             crawlers still read a real table with a header row. */
          .bt-wrap-cards { border: 0; background: transparent; border-radius: 0; overflow: visible; }
          .bt-wrap-cards::after { display: none; }
          .bt-wrap-cards .bt-scroll { overflow: visible; }
          .bt-cards, .bt-cards tbody, .bt-cards tr, .bt-cards td { display: block; width: 100%; min-width: 0 !important; }
          .bt-cards thead {
            position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
            overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
          }
          .bt-cards tr {
            margin: 0 0 14px;
            background: #FFFFFF;
            border: 1px solid rgba(12,12,11,0.12);
            border-radius: 12px;
            overflow: hidden;
          }
          .bt-cards tbody tr:nth-child(even) td { background: transparent; }
          .bt-cards td, .bt-cards[data-cols] td {
            padding: 10px 14px;
            font-size: 15px;
            line-height: 1.5;
            border-bottom: 1px solid rgba(12,12,11,0.06);
          }
          .bt-cards tbody tr:last-child td { border-bottom: 1px solid rgba(12,12,11,0.06); }
          .bt-cards tr td:last-child { border-bottom: 0 !important; }
          .bt-cards td:first-child {
            font-weight: 800;
            font-size: 16px;
            color: #0C0C0B;
            background: #F2EEE7 !important;
            border-bottom: 2px solid #E8541A;
          }
          .bt-cards td[data-label]:not([data-label=""])::before {
            content: attr(data-label);
            display: block;
            margin-bottom: 2px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            color: #6E6B63;
          }
          .bt-cards td:first-child::before { display: none !important; }
        }

        .blog-prose img,
        .blog-prose video,
        .blog-prose iframe { max-width: 100%; height: auto; }
        .blog-prose iframe { height: 100%; }
        .blog-prose p, .blog-prose li, .blog-prose blockquote { overflow-wrap: break-word; }
        /* Long unbroken URLs pasted as link text are the other common cause. */
        .blog-prose a { overflow-wrap: anywhere; }

        /* Phone reading floor. 17px/1.78 already clears the 16px minimum, so
           this only guards the two places the type dips: list items inherit
           fine, but blockquotes were set at 20px with a 20px rule inset that
           eats a chunk of a 328px content column. */
        @media (max-width: 640px) {
          .blog-prose p, .blog-prose li { font-size: 17px !important; line-height: 1.7 !important; }
          .blog-prose blockquote {
            font-size: 18px !important;
            padding-left: 16px !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .blog-prose ul,
          .blog-prose ol { padding-left: 20px !important; }
        }
      `}</style>
    </div>
  );
}

// ── inline style objects ──────────────────────────────────────────────
const blogH1Style: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 'clamp(32px, 4vw, 48px)',
  fontWeight: 900,
  letterSpacing: '-1.4px',
  lineHeight: 1.1,
  margin: '52px 0 18px',
  color: '#0C0C0B',
};
const blogH2Style: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 'clamp(26px, 3vw, 36px)',
  fontWeight: 800,
  letterSpacing: '-0.8px',
  lineHeight: 1.15,
  margin: '44px 0 14px',
  color: '#0C0C0B',
};
const blogH3Style: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 'clamp(20px, 2.2vw, 26px)',
  fontWeight: 700,
  letterSpacing: '-0.4px',
  lineHeight: 1.2,
  margin: '32px 0 10px',
  color: '#0C0C0B',
};
const blogH4Style: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '18px',
  fontWeight: 700,
  margin: '24px 0 8px',
  color: '#0C0C0B',
};
const blogParagraphStyle: React.CSSProperties = {
  fontSize: '17px',
  lineHeight: 1.78,
  color: '#3E3D3A',
  margin: '0 0 20px',
};
const blogQuoteStyle: React.CSSProperties = {
  margin: '36px 0',
  paddingLeft: '20px',
  borderLeft: '3px solid #E8541A',
  fontSize: '20px',
  lineHeight: 1.55,
  fontStyle: 'italic',
  color: '#0C0C0B',
};
const blogListStyle: React.CSSProperties = {
  paddingLeft: '24px',
  margin: '0 0 22px',
  fontSize: '17px',
  lineHeight: 1.78,
  color: '#3E3D3A',
};
const blogListItemStyle: React.CSSProperties = {
  marginBottom: '8px',
};

// ── table block (the custom `table` type written by scripts/publish-blog.mjs,
// and the synthetic ones foldPipeTables builds). Both go through BlogTable. ──
type TableRow = { _key?: string; cells?: string[] };

/**
 * One renderer for every table, so Sanity table blocks and folded pipe tables
 * behave identically. Real <table>/<thead>/<tbody>/<th scope> semantics stay in
 * the DOM at every width; on a phone, tables with 4+ columns are restyled by CSS
 * into stacked cards (each td carries data-label, shown by td::before).
 * Layout is driven by data-cols; see the <style> block in BlogContent.
 */
function BlogTable({ rows, hasHeader }: { rows: TableRow[]; hasHeader: boolean }) {
  const cellsOf = (r: TableRow | null | undefined): string[] => (Array.isArray(r?.cells) ? (r?.cells as string[]) : []);
  const head: TableRow | null = hasHeader ? rows[0] : null;
  const body: TableRow[] = hasHeader ? rows.slice(1) : rows;
  const headCells = cellsOf(head);
  const cols = Math.max(0, ...rows.map((r) => cellsOf(r).length));
  const colsAttr = cols >= 7 ? '7+' : String(cols);
  return (
    <div className={`bt-wrap${cols >= 4 ? ' bt-wrap-cards' : ''}${cols >= 7 ? ' bt-wrap-wide' : ''}`}>
      <div className="bt-scroll">
        <table className={`bt${cols >= 4 ? ' bt-cards' : ''}`} data-cols={colsAttr}>
          {head && (
            <thead>
              <tr>
                {headCells.map((c, i) => (
                  <th key={i} scope="col">{c}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {body.map((r, ri) => (
              <tr key={r?._key ?? ri}>
                {cellsOf(r).map((c, ci) => (
                  <td key={ci} data-label={headCells[ci] ?? ''}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
