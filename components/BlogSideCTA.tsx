import Link from 'next/link';
import { FREE_EDITS_URL } from '@/lib/links';
import { ICP_LABEL, blogAskFor, blogBookUrl, nichePageFor, type IcpKey, type ServiceSlug } from '@/lib/blogLinks';
import { PILOT, PRESENCE } from '@/lib/pricing';

/**
 * Sticky right-rail offer on blog posts (desktop only).
 *
 * Two slim cards. Which one leads follows the post's service, the same rule
 * the in-article card uses (blogAskFor in lib/blogLinks.ts):
 *   - Video and ad posts: the free sample first (no card, no call, a concrete
 *     thing back in 48 hours), then the 15-minute call with the proof number.
 *   - Every other post: the 15-minute call first, sold as an outcome ("the
 *     first 3 things I'd fix"), then one quiet card for the matching text
 *     link (the MagicBNB case study, prices, or the Pilot). No footage copy.
 *
 * Plain links, server-rendered, UTM-tagged per post so bookings can be traced
 * to the article that earned them.
 */
export default function BlogSideCTA({ icp, service, slug }: { icp: IcpKey; service: ServiceSlug; slug: string }) {
  const ask = blogAskFor(service);
  const bookUrl = blogBookUrl('side_rail', slug);
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
  const pill: React.CSSProperties = { ...link, padding: '7px 13px', borderRadius: 100, background: '#0C0C0B', color: '#fff' };
  const underlined: React.CSSProperties = { ...link, color: '#0C0C0B', borderBottom: '1.5px solid #E8541A', paddingBottom: 1 };
  const lead: React.CSSProperties = { ...card, borderLeft: '3px solid #E8541A' };
  const callSub = (
    <p style={sub}>
      No pitch. For{' '}
      <Link href={nichePageFor(icp, service)} style={{ color: '#6E6B63', textDecoration: 'underline', textUnderlineOffset: 2 }}>
        {ICP_LABEL[icp]}
      </Link>
      . Plans from {PRESENCE.priceLabel} a month.
    </p>
  );
  const proof = (
    <>
      <strong style={{ color: '#0C0C0B' }}>5.8 &rarr; 4,803</strong> daily Google impressions.
    </>
  );

  if (ask.kind === 'sample') {
    return (
      <div className="blog-side-cta">
        <div style={lead}>
          <p style={{ ...eyebrow, color: '#E8541A' }}>Free, no card</p>
          <p style={title}>2 edited videos back in 48 hours.</p>
          <p style={sub}>Send any footage. You keep the edits either way.</p>
          <a href={FREE_EDITS_URL} style={pill}>
            {ask.buttonLabel}
          </a>
        </div>

        <div style={card}>
          <p style={eyebrow}>15 minutes, free</p>
          <p style={title}>The first 3 things I&apos;d fix on your site.</p>
          {callSub}
          <a href={bookUrl} target="_blank" rel="noopener noreferrer" style={underlined}>
            Pick a time &rarr;
          </a>
          <Link
            href="/case-studies/magicbnb-seo-aeo"
            style={{ display: 'block', marginTop: 10, paddingTop: 9, borderTop: '1px solid rgba(12,12,11,0.08)', fontSize: 11.5, lineHeight: 1.4, color: '#6E6B63', textDecoration: 'none' }}
          >
            {proof} <span style={{ color: '#E8541A', fontWeight: 700 }}>See proof &rarr;</span>
          </Link>
        </div>
      </div>
    );
  }

  const second =
    service === 'blog-production'
      ? { eyebrow: 'Case study', title: proof, sub: 'The Search Console numbers for one client, including what is still not working.' }
      : service === 'linkedin-ghostwriting'
        ? { eyebrow: `${PILOT.priceLabel}, one-off`, title: 'The 14-day Pilot.', sub: PILOT.tagline }
        : { eyebrow: 'Prices', title: `Plans from ${PRESENCE.priceLabel} a month.`, sub: 'Month-to-month. Builds get a written scope and a fixed price first.' };

  return (
    <div className="blog-side-cta">
      <div style={lead}>
        <p style={{ ...eyebrow, color: '#E8541A' }}>15 minutes, free</p>
        <p style={title}>The first 3 things I&apos;d fix on your site.</p>
        {callSub}
        <a href={bookUrl} target="_blank" rel="noopener noreferrer" style={pill}>
          {ask.buttonLabel}
        </a>
      </div>

      <div style={card}>
        <p style={eyebrow}>{second.eyebrow}</p>
        <p style={title}>{second.title}</p>
        <p style={sub}>{second.sub}</p>
        <Link href={ask.linkHref} style={underlined}>
          {`${ask.linkLabel} \u2192`}
        </Link>
      </div>
    </div>
  );
}
