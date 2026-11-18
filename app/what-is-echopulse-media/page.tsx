import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import { services } from '@/lib/serviceData';
import { icps } from '@/lib/icpData';
import { getCaseStudy } from '@/lib/caseStudyData';
import { BOOK_CALL_LABEL, BOOK_CALL_URL, staticBookingUrl } from '@/lib/links';
import { FREE_SAMPLE, PILOT, PRESENCE, GROWTH, PRICE_LADDER_SENTENCE, PROMISES } from '@/lib/pricing';

/**
 * /what-is-echopulse-media: the brand entity page.
 *
 * Why this is a page and not a blog post. The old post at
 * /blog/what-is-echopulse-media-the-definitive-guide-... was unpublished in
 * the July 2026 cleanup, but Search Console kept showing the URL for the
 * queries "what is echopulse media" and "echopulse media" at position ~5
 * and every click landed on a 404. A query about what a company IS wants a
 * factual page, not an opinion piece under /blog/, and a page can carry
 * AboutPage schema tied to the Organization node while a BlogPosting cannot.
 * lib/redirects.ts now 301s the old slug here.
 *
 * A second reason it has to be plain: "Echopulse" is also the name of a
 * medical ultrasound device made by Theraclion. Some of the brand query is
 * people looking for that. The page says so near the top, so they leave fast
 * and the ones looking for the studio stay.
 *
 * Server component, no client code beyond the booking button. Every fact here
 * must match components/FAQ.tsx, app/about/page.tsx, app/terms/page.tsx and
 * lib/pricing.ts. If one of those changes, change this.
 */

const SITE_URL = 'https://echopulse.media';
const ACCENT = '#E8541A';
const LAST_VERIFIED = '18 November 2026';
const LAST_VERIFIED_ISO = '2026-11-18';

export const metadata: Metadata = {
  title: { absolute: 'What Is EchoPulse Media? Facts, Team, Pricing and Proof' },
  // 152 chars.
  description:
    'EchoPulse Media is a done-for-you content studio for founders, founded in 2025 by Lakshya Soni. What it does, who runs it, what it costs, and real results.',
  alternates: { canonical: `${SITE_URL}/what-is-echopulse-media` },
  openGraph: {
    title: 'What Is EchoPulse Media?',
    description:
      'A done-for-you content studio for founders, coaches, business owners and real estate agents. Founded 2025 by Lakshya Soni. Facts, pricing and proof.',
    url: `${SITE_URL}/what-is-echopulse-media`,
    type: 'website',
  },
};

const DEFINITION =
  'EchoPulse Media is a done-for-you content studio for founders, coaches, course creators, business owners and real estate agents. You record; the studio edits the video, writes the LinkedIn posts and blogs, makes the ad creative, and builds the website and funnel they point at. It was founded in 2025 by Lakshya Soni, is run from Bhopal, India, and serves clients in the United States, the United Kingdom, Canada, Australia and Western Europe. Work starts with a free sample, then a $299 Pilot, then a monthly plan from $399.';

const FAQ: { q: string; a: string }[] = [
  {
    q: 'What is EchoPulse Media?',
    a: DEFINITION,
  },
  {
    q: 'Who owns and runs EchoPulse Media?',
    a: 'Lakshya Soni founded it in 2025 and runs it as a sole proprietor from Bhopal, India. Shaurya handles design and Aiman handles delivery. There are no account managers; the person reviewing your work is one of those three.',
  },
  {
    q: 'Is EchoPulse Media the same as the Echopulse medical device?',
    a: 'No. Echopulse is also the name of a focused-ultrasound treatment device made by Theraclion, a French medical technology company. That device has no connection to EchoPulse Media, which is a content studio. If you were looking for the device, you are on the wrong site. EchoPulse Media is also not affiliated with echopulse.in or any other company, app or tool that uses the name EchoPulse. The only official site is echopulse.media.',
  },
  {
    q: 'What does EchoPulse Media cost?',
    a: PRICE_LADDER_SENTENCE,
  },
  {
    q: 'Where is EchoPulse Media based, and does it work with clients in the US and UK?',
    a: 'The team works from Bhopal, India. Most clients are in the United States, the United Kingdom and Canada, with some in Australia and Western Europe. The working day overlaps with UK and European mornings and US East Coast mornings. Replies come within 3 hours in the workday and turnaround is measured in calendar hours, so a 48-hour deliverable is 48 hours regardless of the time difference.',
  },
  {
    q: 'What proof is there that the work gets results?',
    a: 'The MagicBNB case study is the one with a real export behind it. EchoPulse runs that client\'s marketing end to end. Between 19 February and 11 November 2026 the site went from an average of 5.8 Google impressions a day in April to an average of 4,859 a day in the first 11 days of November, with 356,765 impressions and 1,568 clicks across the window, after a site rebuild and more than 200 articles. The Search Console export is on the case study page, along with what is still not working.',
  },
];

export default function WhatIsEchoPulseMediaPage() {
  const magicbnb = getCaseStudy('magicbnb-seo-aeo');

  const FACTS: { label: string; value: React.ReactNode }[] = [
    { label: 'Name', value: 'EchoPulse Media (trading name of Lakshya Soni, sole proprietor). Also written EchoPulse or Echo Pulse Media.' },
    { label: 'What it is', value: 'A done-for-you content studio. Owner-operated, not an agency with account managers.' },
    { label: 'Founded', value: '2025' },
    { label: 'Founder', value: <Link href="/about">Lakshya Soni</Link> },
    { label: 'Team', value: 'Lakshya Soni (founder, editing, writing, code), Shaurya (design), Aiman (delivery)' },
    { label: 'Based in', value: 'Bhopal, Madhya Pradesh, India. Remote-first.' },
    { label: 'Serves', value: 'United States, United Kingdom, Canada, Australia, Western Europe' },
    {
      label: 'Services',
      value: (
        <span className="wi-inline-links">
          {services.map((s, i) => (
            <span key={s.slug}>
              <Link href={`/services/${s.slug}`}>{s.name}</Link>
              {i < services.length - 1 ? ', ' : ''}
            </span>
          ))}
        </span>
      ),
    },
    {
      label: 'Clients',
      value: (
        <span className="wi-inline-links">
          {icps.map((icp, i) => (
            <span key={icp.key}>
              <Link href={`/${icp.key}`}>{icp.name}</Link>
              {i < icps.length - 1 ? ', ' : ''}
            </span>
          ))}
        </span>
      ),
    },
    {
      label: 'Pricing',
      value: (
        <>
          {FREE_SAMPLE.name} ({FREE_SAMPLE.priceLabel}), then {PILOT.name} ({PILOT.priceLabel}, {PILOT.per}), then{' '}
          {PRESENCE.name} ({PRESENCE.priceLabel} a month) or {GROWTH.name} ({GROWTH.priceLabel} a month). Month-to-month, USD.{' '}
          <Link href="/pricing">Full pricing</Link>.
        </>
      ),
    },
    { label: 'Promises', value: `${PROMISES.replies}. ${PROMISES.turnaround}. ${PROMISES.revisions}. ${PROMISES.ownership}.` },
    { label: 'Book a call', value: <a href={staticBookingUrl('what_is_facts')} data-track-location="what_is_facts" rel="noopener noreferrer" target="_blank">{BOOK_CALL_URL}</a> },
    { label: 'Website', value: <a href={SITE_URL}>{SITE_URL}</a> },
    { label: 'Email', value: <a href="mailto:lakshya@echopulse.media">lakshya@echopulse.media</a> },
    { label: 'Last verified', value: LAST_VERIFIED },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/what-is-echopulse-media#webpage`,
        url: `${SITE_URL}/what-is-echopulse-media`,
        name: 'What Is EchoPulse Media?',
        description: DEFINITION,
        dateModified: LAST_VERIFIED_ISO,
        about: { '@id': `${SITE_URL}/#organization` },
        mainEntity: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: 'en',
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/what-is-echopulse-media#faq`,
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/what-is-echopulse-media#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'What is EchoPulse Media', item: `${SITE_URL}/what-is-echopulse-media` },
        ],
      },
    ],
  };

  return (
    <>
      <Nav />

      <main id="main" className="wi-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* ── Definition first ───────────────────────────────────────────── */}
        <section className="wi-hero">
          <nav aria-label="Breadcrumb" className="wi-crumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>What is EchoPulse Media</span>
          </nav>
          <p className="wi-eyebrow">Plain answer</p>
          <h1 className="wi-h1">What is EchoPulse Media?</h1>
          <p className="wi-lede">{DEFINITION}</p>
          <p className="wi-meta">Last verified: {LAST_VERIFIED}. Facts on this page match the <Link href="/about">About page</Link> and the <Link href="/terms">Terms</Link>.</p>
        </section>

        {/* ── Facts table ────────────────────────────────────────────────── */}
        <section className="wi-facts" aria-labelledby="facts-heading">
          <p className="wi-eyebrow">The facts</p>
          <h2 id="facts-heading" className="wi-h2">EchoPulse Media in one table</h2>
          <table className="wi-table">
            <tbody>
              {FACTS.map((f) => (
                <tr key={f.label}>
                  <th scope="row">{f.label}</th>
                  <td>{f.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── What it is not ─────────────────────────────────────────────── */}
        <section className="wi-not" aria-labelledby="not-heading">
          <p className="wi-eyebrow">To be clear</p>
          <h2 id="not-heading" className="wi-h2">What EchoPulse Media is not</h2>
          <dl className="wi-not-list">
            <div>
              <dt>Not an agency with account managers</dt>
              <dd>Three people do the work and talk to you. There is no layer between the person who hears the brief and the person who cuts the footage. That is also why the studio is small on purpose and why the biggest plan is hidden until it can be staffed properly.</dd>
            </div>
            <div>
              <dt>Not a freelancer marketplace</dt>
              <dd>You are not matched with a stranger and left to manage them. Every deliverable is reviewed by the founder before it reaches you, and the same people stay on your account month to month.</dd>
            </div>
            <div>
              <dt>Not a medical device</dt>
              <dd>&quot;Echopulse&quot; is also the brand name of a focused-ultrasound treatment system made by Theraclion, a French medical technology company. The two are unrelated. If you searched for the device, this is not it.</dd>
            </div>
            <div>
              <dt>Not a results guarantee</dt>
              <dd>The studio guarantees output, turnaround and revisions. It does not guarantee leads, followers or revenue, and says so in writing before month one.</dd>
            </div>
          </dl>
        </section>

        {/* ── How an engagement works ────────────────────────────────────── */}
        <section className="wi-how" aria-labelledby="how-heading">
          <p className="wi-eyebrow">How it works</p>
          <h2 id="how-heading" className="wi-h2">Free sample, then Pilot, then monthly</h2>
          <ol className="wi-steps">
            <li>
              <span className="wi-step-num">1</span>
              <div>
                <h3>{FREE_SAMPLE.name}, {FREE_SAMPLE.priceLabel}</h3>
                <p>{FREE_SAMPLE.tagline} {FREE_SAMPLE.per.charAt(0).toUpperCase() + FREE_SAMPLE.per.slice(1)}.</p>
              </div>
            </li>
            <li>
              <span className="wi-step-num">2</span>
              <div>
                <h3>{PILOT.name}, {PILOT.priceLabel}, {PILOT.per}</h3>
                <p>{PILOT.tagline} A recorded strategy session, 6 video edits, 2 posts, 1 sourced blog, a content audit and a 30-day plan. You keep all of it.</p>
              </div>
            </li>
            <li>
              <span className="wi-step-num">3</span>
              <div>
                <h3>Monthly: {PRESENCE.name} at {PRESENCE.priceLabel} or {GROWTH.name} at {GROWTH.priceLabel}</h3>
                <p>{PROMISES.noContract} 14 days notice to cancel. A weekly call on Presence Engine; every channel on Growth. <Link href="/pricing">See what each includes</Link>.</p>
              </div>
            </li>
          </ol>
        </section>

        {/* ── Proof ──────────────────────────────────────────────────────── */}
        {magicbnb && (
          <section className="wi-proof" aria-labelledby="proof-heading">
            <p className="wi-eyebrow">Proof</p>
            <h2 id="proof-heading" className="wi-h2">One case study with a real export behind it</h2>
            <p className="wi-proof-intro">
              {magicbnb.client}, a short-term rental analytics SaaS. Window: {magicbnb.windowLabel}.
              Every figure comes from the client&apos;s Search Console and GA4 properties, exported 18 August 2026.
            </p>
            <ul className="wi-metrics">
              {magicbnb.heroMetrics.map((m) => (
                <li key={m.label}>
                  <span className="wi-metric-value">{m.value}</span>
                  <span className="wi-metric-label">{m.label}</span>
                  {m.note && <span className="wi-metric-note">{m.note}</span>}
                </li>
              ))}
            </ul>
            <p>
              <Link href={`/case-studies/${magicbnb.slug}`}>Read the MagicBNB case study</Link>, including the parts that are still broken.
              The other case studies are at <Link href="/case-studies">/case-studies</Link>.
            </p>
          </section>
        )}

        {/* ── Who it is for ──────────────────────────────────────────────── */}
        <section className="wi-who" aria-labelledby="who-heading">
          <p className="wi-eyebrow">Who it is for</p>
          <h2 id="who-heading" className="wi-h2">Five kinds of client</h2>
          <ul className="wi-who-list">
            {icps.map((icp) => (
              <li key={icp.key}>
                <Link href={`/${icp.key}`}>{icp.name}</Link>
              </li>
            ))}
          </ul>
          <p>
            The common thread: a person with a real offer who is on camera or could be, has no time to run
            content, and does not want to manage four vendors to get it done. If that is not you, the Pilot
            will tell you fast and cheaply.
          </p>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────────── */}
        <section className="wi-faq" aria-labelledby="faq-heading">
          <p className="wi-eyebrow">Questions</p>
          <h2 id="faq-heading" className="wi-h2">Questions people ask about EchoPulse Media</h2>
          <dl className="wi-faq-list">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <section className="wi-cta">
          <h2 className="wi-h2">Want to see it on your own footage?</h2>
          <p>Book a free 15-minute call, or send two clips and get them back edited within 48 hours. Either way you keep what we make.</p>
          <div className="wi-cta-row">
            <ICPBookButton label={BOOK_CALL_LABEL} location="what_is_page" accent={ACCENT} size="lg" fullWidthMobile />
            <Link href="/pricing" className="wi-cta-alt">See pricing</Link>
          </div>
        </section>

        <style>{`
          .wi-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; }
          .wi-page > section { max-width: 900px; margin: 0 auto; padding: 56px 24px; border-top: 1px solid rgba(12,12,11,0.08); }
          .wi-page p, .wi-page li, .wi-page dd, .wi-page td { line-height: 1.7; color: #4A4740; font-size: 16px; }
          .wi-page a { color: #0C0C0B; font-weight: 600; text-decoration: underline; text-decoration-color: ${ACCENT}; text-underline-offset: 3px; overflow-wrap: anywhere; }
          .wi-page a:hover { color: ${ACCENT}; }

          .wi-eyebrow { font-size: 10px !important; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #A8A49B !important; margin: 0 0 12px; }
          .wi-h1 { font-size: clamp(36px, 5.4vw, 62px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.02; margin: 0 0 24px; }
          .wi-h2 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; margin: 0 0 24px; }

          .wi-hero { padding-top: 140px !important; border-top: none !important; }
          .wi-crumb { display: flex; gap: 10px; font-size: 13px; color: #A8A49B; margin-bottom: 32px; }
          .wi-crumb a { color: #6E6B63; text-decoration: none; font-weight: 500; }
          .wi-lede { font-size: 19px !important; color: #2E2C28 !important; max-width: 760px; margin: 0 0 18px; }
          .wi-meta { font-size: 13.5px !important; color: #A8A49B !important; margin: 0; }

          .wi-table { width: 100%; border-collapse: collapse; text-align: left; }
          .wi-table th, .wi-table td { padding: 14px 0; border-bottom: 1px solid rgba(12,12,11,0.08); font-size: 15.5px; vertical-align: top; }
          .wi-table th { font-weight: 700; color: #0C0C0B; width: 150px; padding-right: 24px; }

          .wi-not-list { margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px 36px; }
          .wi-not-list dt { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 6px; }
          .wi-not-list dd { margin: 0; font-size: 15px !important; }

          .wi-steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
          .wi-steps li { display: flex; gap: 16px; padding: 22px; border: 1px solid rgba(12,12,11,0.1); border-radius: 18px; background: rgba(255,255,255,0.45); }
          .wi-steps h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 6px; color: #0C0C0B; }
          .wi-steps p { margin: 0; font-size: 15px !important; }
          .wi-step-num { flex: 0 0 36px; width: 36px; height: 36px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; font-weight: 800; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }

          .wi-proof-intro { max-width: 720px; margin: 0 0 24px; }
          .wi-metrics { list-style: none; padding: 0; margin: 0 0 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .wi-metrics li { display: flex; flex-direction: column; gap: 4px; padding: 20px; border-radius: 18px; background: #0C0C0B; color: #F2EEE7; }
          .wi-metric-value { font-size: 26px; font-weight: 900; letter-spacing: -0.03em; color: #F2EEE7; line-height: 1.1; }
          .wi-metric-label { font-size: 13px; color: rgba(242,238,231,0.8); line-height: 1.4; }
          .wi-metric-note { font-size: 12px; color: rgba(242,238,231,0.5); line-height: 1.4; }

          .wi-who-list { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-wrap: wrap; gap: 10px; }
          .wi-who-list a { display: inline-flex; align-items: center; min-height: 44px; padding: 8px 18px; border: 1px solid rgba(12,12,11,0.12); border-radius: 999px; font-size: 14.5px; text-decoration: none; }
          .wi-who-list a:hover { background: #0C0C0B; color: #F2EEE7; border-color: #0C0C0B; }

          .wi-faq-list { margin: 0; }
          .wi-faq-list > div { padding: 22px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
          .wi-faq-list > div:last-child { border-bottom: none; }
          .wi-faq-list dt { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; }
          .wi-faq-list dd { margin: 0; }

          .wi-cta { padding-bottom: 128px !important; }
          .wi-cta p { max-width: 640px; }
          .wi-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; margin-top: 24px; }
          .wi-cta-alt { font-size: 14.5px; }

          @media (max-width: 760px) {
            .wi-page > section { padding: 44px 20px; }
            .wi-hero { padding-top: 110px !important; }
            .wi-not-list { grid-template-columns: 1fr; }
            .wi-metrics { grid-template-columns: 1fr 1fr; }
            .wi-table, .wi-table tbody, .wi-table tr, .wi-table th, .wi-table td { display: block; width: auto; }
            .wi-table tr { padding: 12px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
            .wi-table th { padding: 0 0 4px; border-bottom: none; font-size: 12px; letter-spacing: 0.4px; text-transform: uppercase; color: #A8A49B; }
            .wi-table td { padding: 0; border-bottom: none; font-size: 16px; }
            .wi-cta-row { align-items: stretch; flex-direction: column; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
