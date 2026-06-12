import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { urlFor } from '@/lib/sanity';
import { slugifyHeading, blockToPlainText } from '@/lib/toc';

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
      return (
        <figure style={{ margin: '32px 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={value.alt || ''}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '14px',
              display: 'block',
              boxShadow: '0 12px 36px rgba(12,12,11,0.08)',
            }}
          />
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
      return (
        <figure style={{ margin: '32px 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.url}
            alt={value.alt || ''}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '14px',
              display: 'block',
              boxShadow: '0 12px 36px rgba(12,12,11,0.08)',
            }}
          />
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
  },
  block: {
    h1: ({ children }) => (
      <h1 style={blogH1Style}>{children}</h1>
    ),
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
        }}
      >
        {children}
      </code>
    ),
  },
  };

  return components;
}

export default function BlogContent({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={buildComponents()} />;
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
