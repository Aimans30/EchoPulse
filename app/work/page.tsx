import type { Metadata } from 'next';
import WorkWall from '@/components/WorkWall';
import { wallClips } from '@/lib/videos';

const SITE_URL = 'https://echopulse.media';
const canonical = `${SITE_URL}/work`;
const DESCRIPTION =
  'Every edit in one wall: listing reels, founder videos, podcast clips and brand films cut by EchoPulse Media. Move your mouse to explore, click to watch.';

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
      <main id="main">
        {/* The page is nothing but the wall. The heading and the plain list
            of the same clips stay in the markup for screen readers and
            crawlers, which cannot use a canvas-like wall. */}
        <h1 className="work-sr">Work: {clips.length} video edits by EchoPulse Media</h1>
        <WorkWall clips={clips} />
        <nav className="work-sr" aria-label="All videos as a list">
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
        </nav>
      </main>

      <style>{`
        html, body { overflow: hidden; background: #0A0A09; }
        .work-sr {
          position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
          overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
        }
      `}</style>
    </>
  );
}
