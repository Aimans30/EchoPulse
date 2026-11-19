import Link from 'next/link';
import { nicheEntriesForIcp, nicheEntriesForService } from '@/lib/nicheIndex';

/**
 * A small row of links from an ICP page ("By service") or a service page
 * ("For your niche") to the matching /[icp]/[service] pages. Plain links in
 * the server HTML so crawlers and AI tools follow them. Imports the lean index
 * (lib/nicheIndex.ts), not the page copy, so the service page's client bundle
 * does not grow. Renders nothing when no page exists for the key.
 */
export default function NicheLinks({
  mode,
  value,
}: {
  mode: 'icp' | 'service';
  value: string;
}) {
  const entries = mode === 'icp' ? nicheEntriesForIcp(value) : nicheEntriesForService(value);
  if (!entries.length) return null;

  const eyebrow = mode === 'icp' ? 'By service' : 'For your niche';
  const lead =
    mode === 'icp'
      ? 'The same studio, written up for the one thing you came to buy.'
      : 'This service, written up for one kind of buyer.';

  return (
    <section className="nl-wrap" aria-labelledby={`nl-${mode}-heading`}>
      <div className="nl-inner">
        <div>
          <p className="nl-eyebrow">{eyebrow}</p>
          <h2 id={`nl-${mode}-heading`} className="nl-h">{lead}</h2>
        </div>
        <ul className="nl-list">
          {entries.map((e) => (
            <li key={`${e.icp}/${e.service}`}>
              <Link href={`/${e.icp}/${e.service}`} className="nl-link">
                <span>{e.h1}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Same container, gutter and 8px rhythm as the funnel pages it sits on
          (components/icp/funnelStyles.ts). Restated here so the block also
          holds its shape on a page that does not inject that stylesheet. */}
      <style>{`
        .nl-wrap { background: #F8F5EF; color: #0C0C0B; padding: 96px 0; font-family: Inter, sans-serif; }
        .nl-inner { max-width: 1200px; margin: 0 auto; padding: 0 56px; display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 32px 80px; align-items: start; }
        .nl-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #E8541A; margin: 0 0 16px; }
        .nl-h { font-size: clamp(24px, 2.4vw, 32px); font-weight: 900; letter-spacing: -0.025em; line-height: 1.15; margin: 0; max-width: 18ch; text-wrap: balance; }
        .nl-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(12,12,11,0.12); }
        .nl-list li { border-bottom: 1px solid rgba(12,12,11,0.12); }
        .nl-link { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 64px; padding: 16px 0; font-size: 17px; font-weight: 700; color: #0C0C0B; text-decoration: none; }
        .nl-link svg { flex-shrink: 0; transition: transform .25s cubic-bezier(.16,1,.3,1); }
        .nl-link:hover { color: #E8541A; }
        @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) { .nl-link:hover svg { transform: translateX(4px); } }
        @media (max-width: 1024px) { .nl-inner { grid-template-columns: minmax(0, 1fr); padding: 0 40px; } }
        @media (max-width: 768px) {
          .nl-wrap { padding: 72px 0 !important; }
          .nl-inner { padding: 0 24px; }
          .nl-link { font-size: 16px; }
        }
        @media (max-width: 374px) { .nl-inner { padding: 0 16px; } }
      `}</style>
    </section>
  );
}
