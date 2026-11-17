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
        <p className="nl-eyebrow">{eyebrow}</p>
        <h2 id={`nl-${mode}-heading`} className="nl-h">{lead}</h2>
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
      <style>{`
        .nl-wrap { background: #F2EEE7; color: #0C0C0B; padding: 56px 56px 64px; font-family: Inter, sans-serif; }
        .nl-inner { max-width: 900px; margin: 0 auto; }
        .nl-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #E8541A; margin: 0 0 10px; }
        .nl-h { font-size: clamp(20px, 2.4vw, 26px); font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; margin: 0 0 18px; max-width: 560px; }
        .nl-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(12,12,11,0.12); }
        .nl-list li { border-bottom: 1px solid rgba(12,12,11,0.12); }
        .nl-link { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 52px; padding: 12px 0; font-size: 16px; font-weight: 600; color: #0C0C0B; text-decoration: none; }
        .nl-link:hover { color: #E8541A; }
        @media (max-width: 760px) { .nl-wrap { padding: 40px 20px 48px; } }
      `}</style>
    </section>
  );
}
