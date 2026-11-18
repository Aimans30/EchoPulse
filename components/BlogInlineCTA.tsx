import Link from 'next/link';
import { FREE_EDITS_URL } from '@/lib/links';
import {
  BLOG_PRICE_LINE,
  blogAskFor,
  blogBookUrl,
  isPricingPost,
  nicheLinkLabel,
  nichePageFor,
  type IcpKey,
  type ServiceSlug,
} from '@/lib/blogLinks';

/**
 * The in-article call to action. Plain anchors, no JS, so it works for every
 * reader and every crawler.
 *
 * Variant "intro" sits directly after the answer paragraph (the first
 * paragraph of the body, see app/blog/[slug]) on every screen size, because
 * these posts answer the question up top and a reader who got the answer
 * leaves. Variant "mid" is the compact repeat about two thirds of the way down.
 *
 * The offer follows the post's service (blogAskFor in lib/blogLinks.ts): video
 * and ad posts get the free sample, everything else gets the 15-minute call
 * plus one text link. One button and one text link, never more.
 */
export default function BlogInlineCTA({
  icp,
  service,
  variant = 'intro',
  slug,
}: {
  icp: IcpKey;
  service: ServiceSlug;
  variant?: 'intro' | 'mid';
  slug: string;
}) {
  const ask = blogAskFor(service);
  const bookUrl = blogBookUrl(`inline_${variant}`, slug);
  const compact = variant === 'mid';
  const linkStyle: React.CSSProperties = {
    color: '#F2EEE7',
    fontWeight: 600,
    fontSize: 13.5,
    textDecoration: 'underline',
    textUnderlineOffset: 3,
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 44,
  };
  const quiet: React.CSSProperties = { color: '#F2EEE7', fontWeight: 600 };
  return (
    <aside
      className="blog-inline-cta"
      data-ask={ask.kind}
      aria-label="Work with EchoPulse"
      style={{
        margin: compact ? '28px 0' : '28px 0 36px',
        padding: compact ? '16px 18px' : '22px 22px 20px',
        borderRadius: 18,
        background: '#0C0C0B',
        color: '#F2EEE7',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <p style={{ margin: 0, fontSize: compact ? 14.5 : 16, fontWeight: 700, lineHeight: 1.35 }}>
        {compact ? ask.short : ask.lead}
      </p>
      {!compact && isPricingPost(slug) ? (
        <p className="blog-inline-cta-prices" style={{ margin: '10px 0 0', fontSize: 13.5, color: 'rgba(242,238,231,0.78)', lineHeight: 1.5 }}>
          {BLOG_PRICE_LINE}
        </p>
      ) : null}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px', marginTop: 14, alignItems: 'center' }}>
        <a
          href={ask.kind === 'sample' ? FREE_EDITS_URL : bookUrl}
          {...(ask.kind === 'call' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="blog-inline-cta-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 44,
            boxSizing: 'border-box',
            padding: '10px 18px',
            borderRadius: 100,
            background: '#E8541A',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13.5,
            textDecoration: 'none',
          }}
        >
          {ask.buttonLabel}
        </a>
        {ask.linkIsCall ? (
          <a href={bookUrl} target="_blank" rel="noopener noreferrer" className="blog-inline-cta-link" style={linkStyle}>
            {ask.linkLabel}
          </a>
        ) : (
          <Link href={ask.linkHref} className="blog-inline-cta-link" style={linkStyle}>
            {ask.linkLabel}
          </Link>
        )}
      </div>
      {!compact ? (
        <p className="blog-inline-cta-more" style={{ margin: '10px 0 0', fontSize: 12.5, color: 'rgba(242,238,231,0.62)', lineHeight: 1.5 }}>
          More on{' '}
          <Link href={nichePageFor(icp, service)} style={quiet}>
            {nicheLinkLabel(icp, service)}
          </Link>
          .
        </p>
      ) : null}
      <style>{`
        .blog-inline-cta { max-width: 100%; box-sizing: border-box; overflow-wrap: break-word; }
        @media (max-width: 480px) {
          .blog-inline-cta { padding: 18px 16px !important; }
          .blog-inline-cta-btn { width: 100%; }
          .blog-inline-cta-link { width: 100%; justify-content: center; }
          .blog-inline-cta-more a { display: inline-block; padding: 8px 0; }
        }
      `}</style>
    </aside>
  );
}
