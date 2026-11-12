import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WorkWall from '@/components/WorkWall';
import { wallClips } from '@/lib/videos';
import { FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';

const SITE_URL = 'https://echopulse.media';
const canonical = `${SITE_URL}/work`;
const DESCRIPTION =
  'Every edit in one wall: listing reels, founder videos, podcast clips and brand films cut by EchoPulse Media. Drag to explore, hover to play.';

export const metadata: Metadata = {
  title: 'Work: Video Edits by EchoPulse Media',
  description: DESCRIPTION,
  alternates: { canonical },
  openGraph: {
    title: 'Work | EchoPulse Media',
    description: DESCRIPTION,
    url: canonical,
    siteName: 'EchoPulse Media',
    type: 'website',
    images: ['/og-echopulse-media.png'],
  },
};

const TYPE_LABEL: Record<string, string> = {
  longform: 'Long-form',
  podcast: 'Podcast',
  talking: 'Talking head',
  realestate: 'Real estate listing',
};

export default function WorkPage() {
  const clips = wallClips();

  // The wall is canvas-like and useless to a crawler, so the same clips are
  // declared as VideoObjects and listed as plain links underneath it.
  const listLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonical}#collection`,
    name: 'Video edits by EchoPulse Media',
    description: DESCRIPTION,
    url: canonical,
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: clips.length,
      itemListElement: clips.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'VideoObject',
          name: `${c.brand}: ${c.label}`,
          description: `${c.brand} (${c.types.map((t) => TYPE_LABEL[t] ?? t).join(', ')}) edited by EchoPulse Media.`,
          thumbnailUrl: c.poster,
          contentUrl: c.full,
          uploadDate: '2026-11-12',
        },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <Nav />
      <main id="main" style={{ background: '#F2EEE7', color: '#0C0C0B' }}>
        <header className="work-head">
          <p className="work-eyebrow">Work</p>
          <h1>
            {clips.length} edits. <span>Move around.</span>
          </h1>
          <p className="work-sub">
            Listing reels, founder videos, podcast clips and brand films. Drag the wall in any direction, hover to
            play, click to watch with sound. Yours could be on it in 48 hours.
          </p>
          <a href={FREE_EDITS_URL} className="work-cta">{FREE_EDITS_LABEL}</a>
        </header>

        <WorkWall clips={clips} />

        <section className="work-list" aria-labelledby="work-list-heading">
          <details>
            <summary id="work-list-heading">All {clips.length} videos as a list</summary>
            <ul>
              {clips.map((c) => (
                <li key={c.id}>
                  <a href={c.full}>
                    {c.brand}: {c.label}
                  </a>{' '}
                  <span>{c.types.map((t) => TYPE_LABEL[t] ?? t).join(', ')}</span>
                </li>
              ))}
            </ul>
          </details>
        </section>
      </main>
      <Footer />

      <style>{`
        .work-head { max-width: 860px; margin: 0 auto; padding: 150px 24px 36px; text-align: center; }
        .work-eyebrow { font: 700 11px Inter, sans-serif; letter-spacing: 3px; text-transform: uppercase; color: #E8541A; margin: 0 0 14px; }
        .work-head h1 { font: 900 clamp(38px, 6vw, 76px)/1.02 Inter, sans-serif; letter-spacing: -2.4px; margin: 0 0 18px; }
        .work-head h1 span { color: #E8541A; font-style: italic; }
        .work-sub { font: 400 17px/1.65 Inter, sans-serif; color: #6E6B63; max-width: 600px; margin: 0 auto 24px; }
        .work-cta {
          display: inline-block; padding: 13px 24px; border-radius: 100px; background: #0C0C0B; color: #F2EEE7;
          font: 700 14px Inter, sans-serif; text-decoration: none;
        }
        .work-list { max-width: 860px; margin: 0 auto; padding: 36px 24px 96px; font-family: Inter, sans-serif; }
        .work-list summary { cursor: pointer; font-weight: 700; font-size: 14px; color: #0C0C0B; }
        .work-list ul { list-style: none; padding: 0; margin: 16px 0 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 8px 20px; }
        .work-list li { font-size: 13.5px; }
        .work-list a { color: #0C0C0B; font-weight: 600; }
        .work-list span { color: #6E6B63; }
        @media (max-width: 640px) { .work-head { padding-top: 110px; } }
      `}</style>
    </>
  );
}
