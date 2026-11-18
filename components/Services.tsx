import Link from 'next/link';
import { PRESENCE, GROWTH } from '@/lib/pricing';

/**
 * Seven services as a plain list. The "Included from" line states only what
 * lib/pricing.ts supports: video, posts and website tune-ups are in
 * PRESENCE.scope; blogs and ad creatives are in GROWTH.scope; automations and
 * apps are not listed in any plan, so they are "scoped on a call" (Custom).
 */
const services = [
  { name: 'Video Editing', slug: 'video-editing', desc: 'Short-form videos, podcast clips and long-form edits from footage you already have, with captions, hooks and music.', from: `Included from Presence Engine, ${PRESENCE.priceLabel} a month` },
  { name: 'LinkedIn & Social', slug: 'linkedin-ghostwriting', desc: 'Posts and carousels written for your business, with captions ready to publish.', from: `Included from Presence Engine, ${PRESENCE.priceLabel} a month` },
  { name: 'Blog Production', slug: 'blog-production', desc: 'Long blog posts with a working source link for every statistic, edited by a person before you see them.', from: `Included from Growth, ${GROWTH.priceLabel} a month` },
  { name: 'Ad Creatives', slug: 'ad-creatives', desc: 'Static and video ads, with new ones every month so your campaigns do not run on the same creative.', from: `Included from Growth, ${GROWTH.priceLabel} a month` },
  { name: 'Websites & Funnels', slug: 'websites-funnels', desc: 'Tune-ups to your current site, or a new site and funnel built from scratch.', from: `Tune-ups from Presence Engine, ${PRESENCE.priceLabel} a month. New builds are scoped on a call` },
  { name: 'Automations', slug: 'automations', desc: 'DM flows, email sequences and CRM connections that answer new leads when you are busy.', from: 'Scoped on a call' },
  { name: 'Apps & Software', slug: 'apps-software', desc: 'Custom MVPs, AI tools and client portals at a fixed price, with code you own.', from: 'Scoped on a call. 20% off on the Growth plan' },
];

export default function Services() {
  return (
    <section id="services" data-dark-bg="true" className="sv-section" aria-labelledby="sv-heading">
      <style>{`
        .sv-section { background: #0C0C0B; color: #F2EEE7; font-family: Inter, sans-serif; padding: 72px 24px; }
        .sv-wrap { max-width: 1120px; margin: 0 auto; }
        .sv-h2 { font-size: clamp(30px, 4.2vw, 48px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; margin: 0 0 32px; max-width: 20ch; }
        .sv-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(242,238,231,0.18); }
        .sv-row { display: grid; grid-template-columns: 48px minmax(0, 1fr) minmax(0, 1.6fr) minmax(0, 1.2fr); gap: 24px; align-items: start; padding: 16px 8px; border-bottom: 1px solid rgba(242,238,231,0.18); color: inherit; text-decoration: none; transition: background 0.2s ease; }
        .sv-row:hover { background: rgba(242,238,231,0.05); }
        .sv-row:focus-visible { outline: 3px solid #E8541A; outline-offset: -3px; }
        .sv-num { font-size: 13px; font-weight: 700; letter-spacing: 0.04em; color: #F08A5D; padding-top: 4px; }
        .sv-name { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25; margin: 0; }
        .sv-desc { font-size: 15.5px; line-height: 1.6; color: #D9D4CA; margin: 0; max-width: 62ch; }
        .sv-from { font-size: 14px; line-height: 1.5; color: #B8B2A6; margin: 0; }
        @media (max-width: 900px) {
          .sv-row { grid-template-columns: 40px minmax(0, 1fr); gap: 4px 12px; padding: 20px 0; min-height: 44px; }
          .sv-name, .sv-desc, .sv-from { grid-column: 2; }
          .sv-desc { margin-top: 4px; }
          .sv-from { margin-top: 8px; }
          .sv-num { grid-row: 1; }
        }
        @media (max-width: 640px) { .sv-section { padding: 56px 16px; } .sv-h2 { margin-bottom: 28px; } }
      `}</style>
      <div className="sv-wrap">
        <h2 id="sv-heading" className="sv-h2">Seven services, one small team.</h2>
        <ul className="sv-list">
          {services.map((s, i) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="sv-row">
                <span className="sv-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sv-name">{s.name}</h3>
                <p className="sv-desc">{s.desc}</p>
                <p className="sv-from">{s.from}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
