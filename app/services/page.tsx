import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import { services } from '@/lib/serviceData';
import { icps } from '@/lib/icpData';
import { FREE_SAMPLE, PILOT, PRESENCE, GROWTH } from '@/lib/pricing';
import { BOOK_CALL_LABEL, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';
import { ogImages } from '@/lib/ogImages';

/**
 * /services overview. It used to 404 (nothing lived at the folder root), and
 * the eight service pages had no hub linking them together.
 *
 * The matrix and the "Where it is included" lines are built ONLY from the
 * scope lines in lib/pricing.ts, plus the apps tier floor stated on the
 * apps-software service page itself. Change a plan there, then here.
 */

const SITE_URL = 'https://echopulse.media';
const TITLE = 'Services: Video, Social, Websites, SEO and Software';
const DESCRIPTION = `Every EchoPulse service in one place: video editing, LinkedIn and social, blogs, ad creative, websites, automations, apps and SEO. Plans from ${PRESENCE.priceLabel} a month, start with 2 free edits.`;

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | EchoPulse Media` },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: { title: `${TITLE} | EchoPulse Media`, description: DESCRIPTION, url: `${SITE_URL}/services`, siteName: 'EchoPulse Media', type: 'website', images: ogImages() },
  twitter: { card: 'summary_large_image', title: `${TITLE} | EchoPulse Media`, description: DESCRIPTION, images: ogImages() },
};

const P = PRESENCE.priceLabel;
const G = GROWTH.priceLabel;
const PI = PILOT.priceLabel;

/** Where each service sits in the plans, in plain words. */
const INCLUDED: Record<string, string> = {
  'video-editing': `2 free edits to start. ${P} a month: 8 to 9 short videos. ${G} a month: 12 edits, 12 clips and 2 long-form edits.`,
  'linkedin-ghostwriting': `${P} a month: 8 photo or carousel posts, scheduled and posted for you. ${G} a month: 20 social posts.`,
  'blog-production': `1 sourced blog in the ${PI} Pilot. ${G} a month: 4 long-form blogs.`,
  'ad-creatives': `${G} a month: 6 ad creatives, 4 static and 2 video.`,
  'websites-funnels': `${P} a month: tune-up in month one, then upgrades. ${G} a month: rebuilt in month one. New builds scoped on a call.`,
  automations: 'Scoped and priced on a call, in writing before you pay.',
  'apps-software': `Fixed-price builds from $4,997. 20% off on ${G} a month.`,
  'seo-aeo': `${P} a month: pages, Google Business Profile, structured data. ${G} a month adds 4 blogs and funnel tracking.`,
};

const PLANS = [
  { name: FREE_SAMPLE.name, price: FREE_SAMPLE.priceLabel },
  { name: PILOT.name, price: `${PI}, 14 days` },
  { name: PRESENCE.name, price: `${P} a month` },
  { name: GROWTH.name, price: `${G} a month` },
];

const MATRIX: { what: string; cells: [string, string, string, string] }[] = [
  { what: 'Short-form video edits', cells: ['2', '6', '8 to 9 a month', '12 a month, plus 12 clips'] },
  { what: 'Long-form edits (YouTube or podcast)', cells: ['', '', '', '2 a month'] },
  { what: 'Extra clips from footage you have', cells: ['', '', 'Up to 5 a month', ''] },
  { what: 'Photo, carousel or social posts', cells: ['', '2', '8 a month', '20 a month'] },
  { what: 'Long-form SEO blogs', cells: ['', '1', '', '4 a month'] },
  { what: 'Ad creatives', cells: ['', '', '', '6 a month'] },
  { what: 'Website', cells: ['', '', 'Tune-up, then upgrades', 'Rebuilt in month one'] },
  { what: 'Google Business Profile and structured data', cells: ['', '', 'Yes', 'Yes'] },
  { what: 'Strategy call', cells: ['', '60 min onboarding', 'Every week, 20 to 30 min', 'Monthly'] },
];

export default function ServicesPage() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/services#page`,
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/services`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/services/${s.slug}`,
            name: s.name,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <style>{CSS}</style>
      <Nav />
      <main id="main" className="sv">
        <section className="sv-hero">
          <div className="sv-wrap">
            <nav className="sv-crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Services</span>
            </nav>
            <h1 className="sv-h1">Everything a founder needs to be seen, <span>run by one team.</span></h1>
            <p className="sv-lede">
              Video, posts, blogs, ads, your website, the systems behind it and the search work that gets it found.
              Each service below has its own page. Most clients get several of them in one plan from {P} a month, month to month.
            </p>
            <div className="sv-asks">
              <ICPBookButton label={BOOK_CALL_LABEL} location="services_hero_book" accent="#E8541A" className="sv-btn" />
              <a href={FREE_EDITS_URL} className="sv-btn-o" data-track-location="services_hero_free_edits">{FREE_EDITS_LABEL}</a>
            </div>
          </div>
        </section>

        <section className="sv-sec" aria-labelledby="sv-list-h">
          <div className="sv-wrap">
            <h2 id="sv-list-h" className="sv-h2">The services</h2>
            <ul className="sv-grid">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="sv-card" data-track-location={`services_card_${s.slug}`}>
                    <span className="sv-name">{s.name}</span>
                    <span className="sv-tag">{s.tagline}</span>
                    <span className="sv-desc">{s.metaDescription}</span>
                    <span className="sv-inc"><strong>Where it is included:</strong> {INCLUDED[s.slug] ?? 'Scoped on a call.'}</span>
                    <span className="sv-more" aria-hidden="true">See the service →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sv-sec" aria-labelledby="sv-matrix-h">
          <div className="sv-wrap">
            <h2 id="sv-matrix-h" className="sv-h2">What each plan includes</h2>
            <p className="sv-p">The same numbers as the <Link href="/pricing">pricing page</Link>. Blank means not included in that plan.</p>
            <div className="sv-table-wrap" role="region" aria-labelledby="sv-matrix-h" tabIndex={0}>
              <table className="sv-table">
                <thead>
                  <tr>
                    <th scope="col">Service</th>
                    {PLANS.map((p) => (
                      <th scope="col" key={p.name}>{p.name}<span>{p.price}</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((r) => (
                    <tr key={r.what}>
                      <th scope="row">{r.what}</th>
                      {r.cells.map((c, i) => (
                        <td key={i} data-label={PLANS[i].name}>{c || <span className="sv-dash" aria-label="Not included">·</span>}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sv-small">Automations, apps and bigger builds are scoped on a call, with a written scope, a fixed price and a delivery date before you pay.</p>
          </div>
        </section>

        <section className="sv-sec" aria-labelledby="sv-who-h">
          <div className="sv-wrap">
            <h2 id="sv-who-h" className="sv-h2">Who we do it for</h2>
            <ul className="sv-who">
              {icps.map((i) => (
                <li key={i.key}>
                  <Link href={`/${i.key}`} className="sv-who-link" data-track-location={`services_icp_${i.key}`}>
                    <span className="sv-name">{i.name}</span>
                    <span className="sv-tag">{i.metaTitle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sv-sec sv-end">
          <div className="sv-wrap sv-end-in">
            <h2 className="sv-h2">Not sure which you need?</h2>
            <p className="sv-p">Tell us what you sell and who buys it. In 15 minutes you will know which of these matters first, and what it costs.</p>
            <div className="sv-asks">
              <ICPBookButton label={BOOK_CALL_LABEL} location="services_end_book" accent="#E8541A" className="sv-btn" />
              <a href={FREE_EDITS_URL} className="sv-btn-o" data-track-location="services_end_free_edits">{FREE_EDITS_LABEL}</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const CSS = `
.sv { background: #F2EEE7; color: #0C0C0B; }
.sv-wrap { max-width: 1168px; margin: 0 auto; }
.sv-hero { padding: 150px 56px 56px; background-image: linear-gradient(rgba(12,12,11,0.03) 1px,transparent 1px), linear-gradient(90deg,rgba(12,12,11,0.03) 1px,transparent 1px); background-size: 68px 68px; }
.sv-crumbs { display: flex; gap: 8px; font-size: 13px; color: #6E6B63; margin-bottom: 22px; }
.sv-crumbs a { color: #6E6B63; text-decoration: underline; text-underline-offset: 3px; }
.sv-h1 { font-size: clamp(34px, 4.6vw, 62px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.04; margin: 0 0 22px; max-width: 900px; }
.sv-h1 span { color: #E8541A; font-style: italic; }
.sv-lede { font-size: 17px; line-height: 1.7; color: #4A4740; max-width: 680px; margin: 0; }
.sv-asks { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 30px; }
.sv-btn { background: #0C0C0B; color: #F2EEE7 !important; border: none; padding: 15px 28px; border-radius: 100px; font: 700 14px Inter, sans-serif; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; min-height: 48px; transition: background .25s; }
.sv-btn:hover { background: #E8541A; }
.sv-btn-o { display: inline-flex; align-items: center; min-height: 48px; padding: 0 26px; border-radius: 100px; border: 1px solid rgba(12,12,11,0.16); color: #0C0C0B; font: 700 14px Inter, sans-serif; text-decoration: none; }
.sv-btn-o:hover { background: #0C0C0B; color: #F2EEE7; }
.sv-sec { padding: 56px 56px; }
.sv-h2 { font-size: clamp(26px, 3vw, 38px); font-weight: 900; letter-spacing: -0.03em; margin: 0 0 22px; }
.sv-p { font-size: 15.5px; line-height: 1.65; color: #4A4740; margin: 0 0 22px; max-width: 720px; }
.sv-p a { color: #0C0C0B; text-decoration-color: #E8541A; text-underline-offset: 3px; }
.sv-small { font-size: 13px; color: #6E6B63; margin-top: 16px; }
.sv-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.sv-card { display: flex; flex-direction: column; gap: 10px; height: 100%; box-sizing: border-box; padding: 28px; border-radius: 22px; background: rgba(255,255,255,0.62); border: 1px solid rgba(12,12,11,0.08); box-shadow: 0 6px 24px rgba(12,12,11,0.04); color: inherit; text-decoration: none; transition: transform .25s, border-color .25s, box-shadow .25s; }
.sv-card:hover { transform: translateY(-2px); border-color: rgba(232,84,26,0.35); box-shadow: 0 14px 40px rgba(12,12,11,0.08); }
.sv-name { font-size: 21px; font-weight: 900; letter-spacing: -0.02em; }
.sv-tag { font-size: 14.5px; font-weight: 600; color: #C9440F; }
.sv-desc { font-size: 15px; line-height: 1.6; color: #4A4740; }
.sv-inc { font-size: 14px; line-height: 1.55; color: #2C2A26; background: rgba(12,12,11,0.04); border-radius: 12px; padding: 10px 12px; }
.sv-more { margin-top: auto; font-weight: 800; font-size: 14px; }
.sv-table-wrap { overflow-x: auto; border-radius: 22px; border: 1px solid rgba(12,12,11,0.1); background: rgba(255,255,255,0.7); }
.sv-table { width: 100%; border-collapse: collapse; min-width: 760px; font-size: 14.5px; }
.sv-table th, .sv-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid rgba(12,12,11,0.08); vertical-align: top; }
.sv-table thead th { font-size: 12px; font-weight: 800; background: rgba(12,12,11,0.03); }
.sv-table thead th span { display: block; font-weight: 600; color: #6E6B63; margin-top: 2px; }
.sv-table tbody th { font-weight: 700; }
.sv-table tbody tr:last-child th, .sv-table tbody tr:last-child td { border-bottom: none; }
.sv-dash { color: #B8B3A9; }
.sv-who { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
.sv-who-link { display: flex; flex-direction: column; gap: 6px; height: 100%; box-sizing: border-box; padding: 20px; border-radius: 18px; border: 1px solid rgba(12,12,11,0.1); color: inherit; text-decoration: none; background: rgba(255,255,255,0.5); }
.sv-who-link:hover { border-color: #E8541A; }
.sv-who-link .sv-name { font-size: 16px; }
.sv-who-link .sv-tag { font-size: 13px; color: #6E6B63; font-weight: 500; }
.sv-end { padding-bottom: 110px; }
.sv-end-in { background: #0C0C0B; color: #F2EEE7; border-radius: 28px; padding: 48px; }
.sv-end-in .sv-p { color: rgba(242,238,231,0.75); }
.sv-end-in .sv-btn { background: #E8541A; }
.sv-end-in .sv-btn-o { color: #F2EEE7; border-color: rgba(242,238,231,0.3); }
@media (max-width: 1000px) { .sv-who { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 760px) {
  .sv-hero { padding: 120px 16px 40px; }
  .sv-sec { padding: 40px 16px; }
  .sv-grid, .sv-who { grid-template-columns: 1fr; }
  .sv-asks { flex-direction: column; align-items: stretch; }
  .sv-btn, .sv-btn-o { justify-content: center; }
  .sv-end-in { padding: 32px 22px; }
  .sv-table-wrap { overflow: visible; border: none; background: none; }
  .sv-table { min-width: 0; }
  .sv-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .sv-table, .sv-table tbody, .sv-table tr, .sv-table th, .sv-table td { display: block; width: 100%; box-sizing: border-box; }
  .sv-table tr { background: rgba(255,255,255,0.7); border: 1px solid rgba(12,12,11,0.1); border-radius: 16px; margin-bottom: 10px; padding: 6px 0; }
  .sv-table tbody th { border: none; padding: 12px 16px 6px; font-size: 15.5px; }
  .sv-table td { border: none; padding: 4px 16px; display: flex; justify-content: space-between; gap: 12px; }
  .sv-table td::before { content: attr(data-label); font-weight: 700; color: #6E6B63; font-size: 13px; }
  .sv-table td:last-child { padding-bottom: 12px; }
}
`;
