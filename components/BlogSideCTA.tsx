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
    borderRadius: 14,
    padding: '14px 14px 13px',
    marginBottom: 10,
    background: 'rgba(255,255,255,0.55)',
    border: '1px solid rgba(12,12,11,0.08)',
    color: '#0C0C0B',
  };
  const eyebrow: React.CSSProperties = { margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: '#8A867D' };
  const title: React.CSSProperties = { margin: '5px 0 4px', fontSize: 14.5, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.2px' };
  const sub: React.CSSProperties = { margin: '0 0 10px', fontSize: 12, lineHeight: 1.45, color: '#6E6B63' };
  const link: React.CSSProperties = { display: 'inline-block', fontSize: 12.5, fontWeight: 800, textDecoration: 'none' };
  return (
    <div className="blog-side-cta">
      <div style={{ ...card, borderLeft: '3px solid #E8541A' }}>
        <p style={{ ...eyebrow, color: '#E8541A' }}>Free, no card</p>
        <p style={title}>2 edited videos back in 48 hours.</p>
        <p style={sub}>Send any footage. You keep the edits either way.</p>
        <a href={FREE_EDITS_URL} style={{ ...link, padding: '7px 13px', borderRadius: 100, background: '#0C0C0B', color: '#fff' }}>
          Get my 2 free edits
        </a>
      </div>

      <div style={card}>
        <p style={eyebrow}>15 minutes, free</p>
        <p style={title}>The first 3 things I&apos;d fix on your site.</p>
        <p style={sub}>
          No pitch. For {ICP_LABEL[icp]}. Plans from {PRESENCE.priceLabel} a month.
        </p>
        <a href={`${BOOK_CALL_URL}${utm}`} target="_blank" rel="noopener noreferrer" style={{ ...link, color: '#0C0C0B', borderBottom: '1.5px solid #E8541A', paddingBottom: 1 }}>
          Pick a time &rarr;
        </a>
        <Link
          href="/case-studies/magicbnb-seo-aeo"
          style={{ display: 'block', marginTop: 10, paddingTop: 9, borderTop: '1px solid rgba(12,12,11,0.08)', fontSize: 11.5, lineHeight: 1.4, color: '#6E6B63', textDecoration: 'none' }}
        >
          <strong style={{ color: '#0C0C0B' }}>5.8 &rarr; 4,859</strong> daily Google impressions. <span style={{ color: '#E8541A', fontWeight: 700 }}>See proof &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
