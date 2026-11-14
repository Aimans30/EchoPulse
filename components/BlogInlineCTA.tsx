import Link from 'next/link';
import { FREE_EDITS_LABEL, FREE_EDITS_URL, BOOK_CALL_URL } from '@/lib/links';
import { ICP_LABEL, SERVICE_LABEL, type IcpKey, type ServiceSlug } from '@/lib/blogLinks';

/**
 * The in-article call to action. Plain anchors, no JS, so it works for every
 * reader and every crawler. Placed after the intro (see app/blog/[slug]) so a
 * reader who already knows what they want does not have to scroll past
 * Related Articles to find a way to act.
 *
 * One ask leads (the free sample), with the booking link and the matching
 * money pages as quieter alternatives. Variant "mid" is the compact version.
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
  const utm = `?utm_source=blog&utm_medium=inline_${variant}&utm_campaign=${encodeURIComponent(slug)}`;
  const compact = variant === 'mid';
  return (
    <aside
      className="blog-inline-cta"
      aria-label="Work with EchoPulse"
      style={{
        margin: compact ? '28px 0' : '32px 0 36px',
        padding: compact ? '16px 18px' : '22px 22px 20px',
        borderRadius: 18,
        background: '#0C0C0B',
        color: '#F2EEE7',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <p style={{ margin: 0, fontSize: compact ? 14.5 : 16, fontWeight: 700, lineHeight: 1.35 }}>
        {compact
          ? 'Want this done for you? Send footage, get 2 edited videos back free within 48 hours.'
          : 'Reading this because you need it done? Send raw footage and get 2 edited videos back free within 48 hours. No card, no call.'}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14, alignItems: 'center' }}>
        <a
          href={FREE_EDITS_URL}
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
          {FREE_EDITS_LABEL}
        </a>
        <a
          href={`${BOOK_CALL_URL}${utm}`}
          target="_blank"
          rel="noopener noreferrer"
          className="blog-inline-cta-link"
          style={{ color: '#F2EEE7', fontWeight: 600, fontSize: 13.5, textDecoration: 'underline', textUnderlineOffset: 3, display: 'inline-flex', alignItems: 'center', minHeight: 44 }}
        >
          Book a free 15-minute call
        </a>
      </div>
      {!compact ? (
        <p style={{ margin: '12px 0 0', fontSize: 12.5, color: 'rgba(242,238,231,0.62)', lineHeight: 1.5 }}>
          See how we work with{' '}
          <Link href={`/${icp}`} style={{ color: '#F2EEE7', fontWeight: 600 }}>
            {ICP_LABEL[icp]}
          </Link>{' '}
          and what{' '}
          <Link href={`/services/${service}`} style={{ color: '#F2EEE7', fontWeight: 600 }}>
            {SERVICE_LABEL[service]}
          </Link>{' '}
          costs on our <Link href="/pricing" style={{ color: '#F2EEE7', fontWeight: 600 }}>pricing page</Link>.
        </p>
      ) : null}
      <style>{`
        .blog-inline-cta { max-width: 100%; box-sizing: border-box; overflow-wrap: break-word; }
        @media (max-width: 480px) {
          .blog-inline-cta { padding: 18px 16px !important; }
          .blog-inline-cta-btn { width: 100%; }
          .blog-inline-cta-link { width: 100%; justify-content: center; }
          .blog-inline-cta p a { display: inline-block; padding: 8px 0; }
        }
      `}</style>
    </aside>
  );
}
