import Image from 'next/image';
import Link from 'next/link';
import { icps } from '@/lib/icpData';
import { wallClips, type WallClip } from '@/lib/videos';

/**
 * Who we work with: one plain card per niche in lib/icpData.ts, in that order,
 * each with a real poster from one of that niche's sample clips. No badges,
 * icon tiles or gradients. Sentences describe only what lib/pricing.ts offers.
 */
const DESC: Record<string, string> = {
  'real-estate': 'Listing reels and agent videos edited from the footage you shoot on your phone at a showing.',
  founders: 'Short videos and posts cut from the calls, talks and podcasts you already record.',
  coaches: 'Short clips from your podcast, workshops and client calls, with captions, ready to post.',
  dtc: 'Short founder and product videos for your feed, plus ad creatives on the Growth plan.',
  'business-owners': 'Videos, posts and website updates for a local or service business, from footage you shoot yourself.',
};

const PICKS: Record<string, string> = {
  'real-estate': '2426_fn',
  founders: '17_feb',
  coaches: 'Clip_2_',
  dtc: 'patern_intrupt',
  'business-owners': 'Untitled_video',
};

function pickPosters(): Record<string, WallClip | undefined> {
  const clips = wallClips();
  const used = new Set<string>();
  const out: Record<string, WallClip | undefined> = {};
  for (const icp of icps) {
    // Hand-picked posters (checked by eye); the filter below is the fallback.
    const chosen = PICKS[icp.key] ? clips.find((c) => c.id.includes(PICKS[icp.key]) && c.icps.includes(icp.key)) : undefined;
    if (chosen) { used.add(chosen.id); out[icp.key] = chosen; continue; }
    const pool = clips.filter((c) => c.icps.includes(icp.key) && !used.has(c.id));
    const best =
      pool.find((c) => c.orientation === 'vertical' && !c.types.includes('longform')) ??
      pool.find((c) => c.orientation !== 'horizontal' && !c.types.includes('longform')) ??
      pool[0];
    if (best) used.add(best.id);
    out[icp.key] = best;
  }
  return out;
}

export default function WhoWeWorkWith() {
  const posters = pickPosters();
  return (
    <section className="ww-section" aria-labelledby="ww-heading">
      <style>{`
        .ww-section { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; padding: 72px 24px; border-top: 1px solid rgba(12,12,11,0.08); }
        .ww-wrap { max-width: 1120px; margin: 0 auto; }
        .ww-h2 { font-size: clamp(30px, 4.2vw, 48px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; margin: 0 0 32px; max-width: 20ch; }
        .ww-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
        .ww-card { background: #FBF9F5; border: 1px solid rgba(12,12,11,0.1); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; height: 100%; }
        .ww-poster { position: relative; aspect-ratio: 4 / 5; background: #0C0C0B; flex-shrink: 0; }
        .ww-poster img { object-fit: cover; }
        .ww-body { padding: 20px 20px 12px; display: flex; flex-direction: column; flex: 1; }
        .ww-name { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25; margin: 0 0 8px; }
        .ww-desc { font-size: 15px; line-height: 1.55; color: #2E2C28; margin: 0 0 12px; }
        .ww-link { margin-top: auto; display: inline-flex; align-items: center; min-height: 44px; font-size: 14px; font-weight: 700; color: #0C0C0B; text-decoration: underline; text-decoration-color: #E8541A; text-decoration-thickness: 2px; text-underline-offset: 4px; }
        .ww-link:hover { color: #B23A0C; }
        .ww-link:focus-visible, .ww-more a:focus-visible { outline: 3px solid #E8541A; outline-offset: 3px; border-radius: 4px; }
        .ww-more { margin: 16px 0 0; font-size: 17px; line-height: 1.5; color: #2E2C28; }
        .ww-more a { display: inline-flex; align-items: center; min-height: 44px; font-weight: 700; color: #0C0C0B; text-decoration: underline; text-decoration-color: #E8541A; text-decoration-thickness: 2px; text-underline-offset: 4px; }
        @media (max-width: 1100px) { .ww-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 760px) {
          .ww-section { padding: 56px 16px; }
          .ww-h2 { margin-bottom: 28px; }
          .ww-grid { grid-template-columns: 1fr; gap: 12px; }
          .ww-card { flex-direction: row; }
          .ww-poster { width: 112px; aspect-ratio: auto; align-self: stretch; min-height: 168px; }
          .ww-body { padding: 16px 16px 4px; }
          .ww-name { font-size: 17px; }
        }
      `}</style>
      <div className="ww-wrap">
        <h2 id="ww-heading" className="ww-h2">Built for people who have a business to run.</h2>
        <ul className="ww-grid">
          {icps.map((icp) => {
            const clip = posters[icp.key];
            return (
              <li key={icp.key}>
                <article className="ww-card">
                  {clip && (
                    <div className="ww-poster">
                      <Image
                        src={clip.poster}
                        alt={`A frame from a ${icp.name.toLowerCase()} sample edit`}
                        fill
                        sizes="(max-width: 760px) 112px, (max-width: 1100px) 33vw, 224px"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="ww-body">
                    <h3 className="ww-name">{icp.name}</h3>
                    <p className="ww-desc">{DESC[icp.key]}</p>
                    <Link href={`/${icp.key}`} className="ww-link">
                      See {icp.name} work and pricing
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        <p className="ww-more">
          Not on this list? <Link href="/free-edits">Send footage and see.</Link>
        </p>
      </div>
    </section>
  );
}
