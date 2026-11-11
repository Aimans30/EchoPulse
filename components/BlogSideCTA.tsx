import Link from 'next/link';
import { FREE_EDITS_URL, BOOK_CALL_URL } from '@/lib/links';
import { ICP_LABEL, type IcpKey } from '@/lib/blogLinks';
import { PRESENCE } from '@/lib/pricing';

/**
 * Sticky right-rail offer on blog posts (desktop only).
 *
 * Two cards, in the order a cold reader is willing to act:
 *   1. The free sample: no card, no call, a concrete thing back in 48 hours.
 *      This is the click a stranger will actually make.
 *   2. The 15-minute call, sold as an outcome ("the first 3 things I'd fix")
 *      rather than a "strategy call", with the one proof number and the price
 *      so nobody books expecting something else.
 *
 * Plain links, server-rendered, UTM-tagged per post so bookings can be traced
 * to the article that earned them.
 */
export default function BlogSideCTA({ icp, slug }: { icp: IcpKey; slug: string }) {
  const utm = `?utm_source=blog&utm_medium=side_rail&utm_campaign=${encodeURIComponent(slug)}`;
  const card: React.CSSProperties = {
    borderRadius: 18,
    padding: '20px 18px 18px',
    marginBottom: 14,
  };
  return (
    <div className="blog-side-cta">
      <div style={{ ...card, background: '#0C0C0B', color: '#F2EEE7', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ margin: 0, fontSize: 10.5, fontWeight: 800, letterSpacing: 1.6, textTransform: 'uppercase', color: '#E8541A' }}>Free, no card</p>
        <p style={{ margin: '8px 0 6px', fontSize: 19, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.4px' }}>
          Send footage. Get 2 edited videos back in 48 hours.
        </p>
        <p style={{ margin: '0 0 14px', fontSize: 13, lineHeight: 1.5, color: 'rgba(242,238,231,0.66)' }}>
          A talk, a podcast clip, a listing tour, a job-site video. You keep the edits either way.
        </p>
        <a
          href={FREE_EDITS_URL}
          style={{ display: 'block', textAlign: 'center', padding: '11px 14px', borderRadius: 100, background: '#E8541A', color: '#fff', fontWeight: 800, fontSize: 13.5, textDecoration: 'none' }}
        >
          Get my 2 free edits
        </a>
      </div>

      <div style={{ ...card, background: 'rgba(255,255,255,0.62)', border: '1px solid rgba(12,12,11,0.08)', color: '#0C0C0B' }}>
        <p style={{ margin: 0, fontSize: 10.5, fontWeight: 800, letterSpacing: 1.6, textTransform: 'uppercase', color: '#6E6B63' }}>15 minutes, free</p>
        <p style={{ margin: '8px 0 6px', fontSize: 17, fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.3px' }}>
          Show me your site. I&apos;ll tell you the first 3 things I&apos;d fix.
        </p>
        <p style={{ margin: '0 0 12px', fontSize: 12.5, lineHeight: 1.5, color: '#6E6B63' }}>
          No pitch. For {ICP_LABEL[icp]}. Plans start at {PRESENCE.priceLabel} a month, month-to-month.
        </p>
        <a
          href={`${BOOK_CALL_URL}${utm}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', textAlign: 'center', padding: '10px 14px', borderRadius: 100, border: '1.5px solid #0C0C0B', color: '#0C0C0B', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}
        >
          Pick a time
        </a>
        <Link
          href="/case-studies/magicbnb-seo-aeo"
          style={{ display: 'block', marginTop: 12, fontSize: 12, lineHeight: 1.45, color: '#6E6B63', textDecoration: 'none' }}
        >
          <strong style={{ color: '#0C0C0B' }}>5.8 &rarr; 1,574</strong> daily Google impressions in four months. <span style={{ color: '#E8541A', fontWeight: 700 }}>See the export &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
