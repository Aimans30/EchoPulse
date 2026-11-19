import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import { BOOK_CALL_LABEL } from '@/lib/links';
import { FREE_SAMPLE, PILOT, PRESENCE, GROWTH, PROMISES } from '@/lib/pricing';

/**
 * /pilot: one screen for the $299 Pilot, built to be sent in a DM.
 * Every price and scope line comes from lib/pricing.ts. Server component.
 */

const SITE_URL = 'https://echopulse.media';
const ACCENT = '#E8541A';

export const metadata: Metadata = {
  title: 'The $299 14-Day Content Pilot',
  description:
    'The $299 Pilot is 14 days of real work on your brand: a recorded strategy session, 6 video edits, 2 posts, 1 sourced blog, an audit and a 30-day plan.',
  alternates: { canonical: `${SITE_URL}/pilot` },
  openGraph: {
    title: `The ${PILOT.priceLabel} Pilot`,
    description: PILOT.tagline,
    url: `${SITE_URL}/pilot`,
    type: 'website',
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: `What do I get for ${PILOT.priceLabel}?`,
    a: `${PILOT.scope.join('. ')}.`,
  },
  {
    q: 'Do I have to sign up for a monthly plan afterwards?',
    a: `No. The Pilot is ${PILOT.per} with no retainer commitment, and you keep everything made. If you continue, the monthly plans are ${PRESENCE.name} at ${PRESENCE.priceLabel} a month and ${GROWTH.name} at ${GROWTH.priceLabel} a month. ${PROMISES.noContract} Cancel with 14 days notice.`,
  },
  {
    q: 'How fast is each deliverable, and what if I do not like it?',
    a: `${PROMISES.turnaround}. ${PROMISES.revisions}. ${PROMISES.replies}.`,
  },
  {
    q: 'Can I try something before paying?',
    a: `Yes. ${FREE_SAMPLE.tagline} It is ${FREE_SAMPLE.per}, and ${FREE_SAMPLE.scope[3].charAt(0).toLowerCase() + FREE_SAMPLE.scope[3].slice(1)}.`,
  },
];

export default function PilotPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/pilot#webpage`,
        url: `${SITE_URL}/pilot`,
        name: `The ${PILOT.priceLabel} Pilot`,
        description: PILOT.tagline,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: 'en',
        mainEntity: { '@id': `${SITE_URL}/pilot#offer` },
      },
      {
        '@type': 'Offer',
        '@id': `${SITE_URL}/pilot#offer`,
        name: PILOT.name,
        url: `${SITE_URL}/pilot`,
        price: String(PILOT.priceUsd),
        priceCurrency: 'USD',
        description: `${PILOT.per}. ${PILOT.scope.join('; ')}.`,
        seller: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/pilot#faq`,
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/pilot#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Pilot', item: `${SITE_URL}/pilot` },
        ],
      },
    ],
  };

  return (
    <>
      <Nav />

      <main id="main" className="pl-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <section className="pl-hero">
          <nav aria-label="Breadcrumb" className="pl-crumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Pilot</span>
          </nav>
          <p className="pl-eyebrow">{PILOT.name}, {PILOT.per}</p>
          <h1 className="pl-h1">The {PILOT.priceLabel} Pilot: 14 days of real work on your brand</h1>
          <p className="pl-lede">
            The {PILOT.priceLabel} Pilot is a one-off, 14-day trial of EchoPulse Media for founders,
            coaches, real estate agents and business owners who want to see real work on their brand
            before any monthly plan.
          </p>
          <div className="pl-cta-row">
            <ICPBookButton label={BOOK_CALL_LABEL} location="pilot_page" accent={ACCENT} size="lg" fullWidthMobile />
            <Link href="/free-edits" className="pl-cta-alt">Or get 2 free edits first</Link>
          </div>
        </section>

        <section aria-labelledby="get-heading">
          <p className="pl-eyebrow">What you get</p>
          <h2 id="get-heading" className="pl-h2">{PILOT.priceLabel}, {PILOT.per}</h2>
          <ul className="pl-list">
            {PILOT.scope.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how-heading">
          <p className="pl-eyebrow">How the 14 days go</p>
          <h2 id="how-heading" className="pl-h2">Brief first, work next, plan last</h2>
          <ol className="pl-steps">
            <li>
              <span className="pl-step-num">1</span>
              <div>
                <h3>Onboarding session and brief</h3>
                <p>{PILOT.scope[0]}.</p>
              </div>
            </li>
            <li>
              <span className="pl-step-num">2</span>
              <div>
                <h3>Deliverables</h3>
                <p>{PILOT.scope[1]}, {PILOT.scope[2]} and {PILOT.scope[3]}. {PROMISES.turnaround}, and {PROMISES.revisions.charAt(0).toLowerCase() + PROMISES.revisions.slice(1)}.</p>
              </div>
            </li>
            <li>
              <span className="pl-step-num">3</span>
              <div>
                <h3>Audit and 30-day plan</h3>
                <p>{PILOT.scope[4]} at the end, so you know what to do next with or without us.</p>
              </div>
            </li>
          </ol>
        </section>

        <section aria-labelledby="after-heading">
          <p className="pl-eyebrow">What happens after</p>
          <h2 id="after-heading" className="pl-h2">Stop, or go month to month</h2>
          <p>{PILOT.scope[6]} If you want to keep going, there are two monthly plans. {PROMISES.noContract} Cancel with 14 days notice.</p>
          <ul className="pl-list">
            <li><strong>{PRESENCE.name}, {PRESENCE.priceLabel}{PRESENCE.per.split(',')[0]}.</strong> {PRESENCE.tagline}</li>
            <li><strong>{GROWTH.name}, {GROWTH.priceLabel}{GROWTH.per.split(',')[0]}.</strong> {GROWTH.tagline}</li>
          </ul>
          <p><Link href="/pricing">See what each plan includes</Link>.</p>
        </section>

        <section aria-labelledby="sure-heading">
          <p className="pl-eyebrow">Not sure yet</p>
          <h2 id="sure-heading" className="pl-h2">Try the free sample first</h2>
          <p>{FREE_SAMPLE.tagline} {FREE_SAMPLE.per.charAt(0).toUpperCase() + FREE_SAMPLE.per.slice(1)}. <Link href="/free-edits">Get 2 free edits</Link>.</p>
        </section>

        <section className="pl-faq" aria-labelledby="faq-heading">
          <p className="pl-eyebrow">Questions</p>
          <h2 id="faq-heading" className="pl-h2">Pilot questions</h2>
          <dl className="pl-faq-list">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="pl-cta">
          <h2 className="pl-h2">Ready to see real work on your brand?</h2>
          <p>Book a free 15-minute call to start the Pilot, or send footage for the free sample first. Either way you keep what we make.</p>
          <div className="pl-cta-row">
            <ICPBookButton label={BOOK_CALL_LABEL} location="pilot_page" accent={ACCENT} size="lg" fullWidthMobile />
            <Link href="/free-edits" className="pl-cta-alt">Get 2 free edits</Link>
          </div>
        </section>

        <style>{`
          .pl-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; }
          .pl-page > section { max-width: 900px; margin: 0 auto; padding: 56px 24px; border-top: 1px solid rgba(12,12,11,0.08); }
          .pl-page p, .pl-page li, .pl-page dd, .pl-page td { line-height: 1.7; color: #4A4740; font-size: 16px; }
          .pl-page a { color: #0C0C0B; font-weight: 600; text-decoration: underline; text-decoration-color: ${ACCENT}; text-underline-offset: 3px; overflow-wrap: anywhere; }
          .pl-page a:hover { color: ${ACCENT}; }

          .pl-eyebrow { font-size: 10px !important; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #A8A49B !important; margin: 0 0 12px; }
          .pl-h1 { font-size: clamp(36px, 5.4vw, 62px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.02; margin: 0 0 24px; }
          .pl-h2 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; margin: 0 0 24px; }

          .pl-hero { padding-top: 140px !important; border-top: none !important; }
          .pl-crumb { display: flex; gap: 10px; font-size: 13px; color: #A8A49B; margin-bottom: 32px; }
          .pl-crumb a { color: #6E6B63; text-decoration: none; font-weight: 500; }
          .pl-lede { font-size: 19px !important; color: #2E2C28 !important; max-width: 760px; margin: 0 0 18px; }
          .pl-meta { font-size: 13.5px !important; color: #A8A49B !important; margin: 0; }

          .pl-table { width: 100%; border-collapse: collapse; text-align: left; }
          .pl-table th, .pl-table td { padding: 14px 0; border-bottom: 1px solid rgba(12,12,11,0.08); font-size: 15.5px; vertical-align: top; }
          .pl-table th { font-weight: 700; color: #0C0C0B; width: 150px; padding-right: 24px; }

          .pl-not-list { margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px 36px; }
          .pl-not-list dt { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 6px; }
          .pl-not-list dd { margin: 0; font-size: 15px !important; }

          .pl-steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
          .pl-steps li { display: flex; gap: 16px; padding: 22px; border: 1px solid rgba(12,12,11,0.1); border-radius: 18px; background: rgba(255,255,255,0.45); }
          .pl-steps h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 6px; color: #0C0C0B; }
          .pl-steps p { margin: 0; font-size: 15px !important; }
          .pl-step-num { flex: 0 0 36px; width: 36px; height: 36px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; font-weight: 800; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }

          .pl-proof-intro { max-width: 720px; margin: 0 0 24px; }
          .pl-metrics { list-style: none; padding: 0; margin: 0 0 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .pl-metrics li { display: flex; flex-direction: column; gap: 4px; padding: 20px; border-radius: 18px; background: #0C0C0B; color: #F2EEE7; }
          .pl-metric-value { font-size: 26px; font-weight: 900; letter-spacing: -0.03em; color: #F2EEE7; line-height: 1.1; }
          .pl-metric-label { font-size: 13px; color: rgba(242,238,231,0.8); line-height: 1.4; }
          .pl-metric-note { font-size: 12px; color: rgba(242,238,231,0.5); line-height: 1.4; }

          .pl-who-list { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-wrap: wrap; gap: 10px; }
          .pl-who-list a { display: inline-flex; align-items: center; min-height: 44px; padding: 8px 18px; border: 1px solid rgba(12,12,11,0.12); border-radius: 999px; font-size: 14.5px; text-decoration: none; }
          .pl-who-list a:hover { background: #0C0C0B; color: #F2EEE7; border-color: #0C0C0B; }

          .pl-faq-list { margin: 0; }
          .pl-faq-list > div { padding: 22px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
          .pl-faq-list > div:last-child { border-bottom: none; }
          .pl-faq-list dt { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; }
          .pl-faq-list dd { margin: 0; }

          .pl-cta { padding-bottom: 128px !important; }
          .pl-cta p { max-width: 640px; }
          .pl-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; margin-top: 24px; }
          .pl-cta-alt { font-size: 14.5px; }

          @media (max-width: 760px) {
            .pl-page > section { padding: 44px 20px; }
            .pl-hero { padding-top: 110px !important; }
            .pl-not-list { grid-template-columns: 1fr; }
            .pl-metrics { grid-template-columns: 1fr 1fr; }
            .pl-table, .pl-table tbody, .pl-table tr, .pl-table th, .pl-table td { display: block; width: auto; }
            .pl-table tr { padding: 12px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
            .pl-table th { padding: 0 0 4px; border-bottom: none; font-size: 12px; letter-spacing: 0.4px; text-transform: uppercase; color: #A8A49B; }
            .pl-table td { padding: 0; border-bottom: none; font-size: 16px; }
            .pl-cta-row { align-items: stretch; flex-direction: column; }
          }
          .pl-list { margin: 0 0 16px; padding-left: 22px; }
          .pl-list li { margin-bottom: 8px; }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
