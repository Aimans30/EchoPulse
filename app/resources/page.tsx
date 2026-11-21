import type { Metadata } from 'next';
import { ogImages } from '@/lib/ogImages';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const SITE_URL = 'https://echopulse.media';
const canonical = `${SITE_URL}/resources`;
const DESCRIPTION =
  'Free, complete resources for small businesses that make their own video: shot lists and checklists you can use today, with no sign-up needed to read them.';

export const metadata: Metadata = {
  title: 'Free Video Resources for Small Businesses',
  description: DESCRIPTION,
  alternates: { canonical },
  openGraph: {
    title: 'Free Video Resources | EchoPulse Media',
    description: DESCRIPTION,
    url: canonical,
    siteName: 'EchoPulse Media',
    type: 'website',
    images: ogImages(),
  },
};

const RESOURCES = [
  {
    href: '/resources/listing-video-shot-list',
    title: 'Listing video shot list: 24 shots to film on your phone',
    forWho: 'Real estate agents',
    blurb: 'A room-by-room list with phone height, movement, length in seconds and the reason for each shot.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${canonical}#page`,
      url: canonical,
      name: 'Free video resources',
      description: DESCRIPTION,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Resources', item: canonical },
      ],
    },
  ],
};

export default function ResourcesPage() {
  return (
    <>
      <Nav />
      <main id="main" className="rs-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <section className="rs-wrap">
          <p className="rs-eyebrow">Resources</p>
          <h1 className="rs-h1">Free resources</h1>
          <p className="rs-lede">
            Shot lists and checklists for people who film their own video. Each one is complete on the page, with no sign-up needed. More are planned.
          </p>
          <ul className="rs-list">
            {RESOURCES.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="rs-card">
                  <span className="rs-for">{r.forWho}</span>
                  <span className="rs-title">{r.title}</span>
                  <span className="rs-blurb">{r.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
      <style>{`
        .rs-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; }
        .rs-wrap { max-width: 860px; margin: 0 auto; padding: 140px 24px 96px; }
        .rs-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #E8541A; margin: 0 0 14px; }
        .rs-h1 { font-size: clamp(38px, 6vw, 64px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.02; margin: 0 0 18px; }
        .rs-lede { font-size: 19px; line-height: 1.6; color: #3E3D3A; max-width: 620px; margin: 0 0 40px; }
        .rs-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
        .rs-card { display: flex; flex-direction: column; gap: 8px; padding: 24px; border: 1px solid rgba(12,12,11,0.12); border-radius: 18px; background: rgba(255,255,255,0.5); color: inherit; text-decoration: none; min-height: 44px; }
        .rs-card:hover { border-color: #E8541A; }
        .rs-card:focus-visible { outline: 3px solid #E8541A; outline-offset: 2px; }
        .rs-for { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #6E6B63; }
        .rs-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; overflow-wrap: break-word; }
        .rs-blurb { font-size: 15.5px; line-height: 1.6; color: #3E3D3A; }
        /* padding-top needs !important here: globals.css forces a 56px top padding on every section under 768px, which pulled this hero's first line up underneath the fixed nav pill (nav bottom edge is at 84px). */
        @media (max-width: 768px) { .rs-wrap { padding-top: 110px !important; } }
        @media (max-width: 640px) { .rs-wrap { padding: 110px 18px 72px; } .rs-card { padding: 20px; } }
      `}</style>
    </>
  );
}
