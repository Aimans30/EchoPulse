import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import Reveal from '@/components/icp/Reveal';
import { FUNNEL_CSS, CHECK_PATH } from '@/components/icp/funnelStyles';
import { BOOK_CALL_LABEL, BOOK_CALL_REASSURANCE, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';
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
    a: `${PILOT.scope.map((x) => x.replace(/\.$/, '')).join('. ')}.`,
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

  // The 14 days, in order. Each step quotes PILOT.scope and PROMISES.
  const steps = [
    { t: 'Onboarding session and brief', d: `${PILOT.scope[0]}.` },
    { t: 'Deliverables', d: `${PILOT.scope[1]}, ${PILOT.scope[2]} and ${PILOT.scope[3]}. ${PROMISES.turnaround}, and ${PROMISES.revisions.charAt(0).toLowerCase() + PROMISES.revisions.slice(1)}.` },
    { t: 'Audit and 30-day plan', d: `${PILOT.scope[4]} at the end, so you know what to do next with or without us.` },
  ];

  return (
    <>
      <Nav />

      <main id="main" className="fn pl-page" style={{ ['--fn-accent' as string]: ACCENT }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* ── Hero (cream): the offer left, what you get and the price right ── */}
        <section className="pl-hero">
          <div className="fn-container pl-hero-grid">
            <div>
              <nav aria-label="Breadcrumb" className="pl-crumb">
                <Link href="/">Home</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">Pilot</span>
              </nav>
              <p className="fn-eyebrow" style={{ color: ACCENT }}>{PILOT.name}, {PILOT.per}</p>
              <h1 className="fn-h1 pl-h1">The {PILOT.priceLabel} Pilot: 14 days of real work on your brand</h1>
              <p className="fn-lead pl-lede">
                A one-off, 14-day trial of EchoPulse Media for founders, coaches, real estate agents and business
                owners who want to see real work on their brand before any monthly plan.
              </p>
              <div className="fn-actions">
                <ICPBookButton label={BOOK_CALL_LABEL} location="pilot_page" accent={ACCENT} className="fn-btn" />
              </div>
              <p className="fn-alt-ask">
                Not sure yet? <Link href={FREE_EDITS_URL}>{FREE_EDITS_LABEL}</Link> first, {FREE_SAMPLE.per}.
              </p>
            </div>

            <aside className="pl-card" aria-labelledby="get-heading">
              <p className="pl-card-label">{PILOT.name}</p>
              <p className="pl-price">{PILOT.priceLabel}<span>{PILOT.per}</span></p>
              <h2 id="get-heading" className="pl-card-h">What you get</h2>
              <ul className="pl-checks">
                {PILOT.scope.map((x) => (
                  <li key={x}><Check />{x}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* ── Timeline (paper) ── */}
        <section className="fn-section fn-paper" aria-labelledby="how-heading">
          <div className="fn-container">
            <Reveal className="fn-head">
              <p className="fn-eyebrow" style={{ color: ACCENT }}>How the 14 days go</p>
              <h2 id="how-heading" className="fn-h2">Brief first, work next, plan last</h2>
            </Reveal>
            <ol className="fn-grid fn-grid-3 pl-steps">
              {steps.map((st, i) => (
                <Reveal as="li" key={st.t} delay={i * 0.06}>
                  <div className="fn-card">
                    <span className="pl-step-n" aria-hidden="true">{i + 1}</span>
                    <h3 className="fn-h3">{st.t}</h3>
                    <p>{st.d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── After (cream) ── */}
        <section className="fn-section fn-cream" aria-labelledby="after-heading">
          <div className="fn-container fn-split">
            <Reveal>
              <p className="fn-eyebrow" style={{ color: ACCENT }}>What happens after</p>
              <h2 id="after-heading" className="fn-h2">Stop, or go month to month</h2>
              <p className="fn-body pl-after-p">
                {PILOT.scope[6]} If you want to keep going, there are two monthly plans. {PROMISES.noContract} Cancel with 14 days notice.
              </p>
            </Reveal>
            <div>
              <div className="fn-grid fn-grid-2">
                {[PRESENCE, GROWTH].map((plan, i) => (
                  <Reveal key={plan.key} delay={i * 0.06}>
                    <div className="fn-card">
                      <h3 className="fn-h3">{plan.name}</h3>
                      <p className="pl-plan-price">{plan.priceLabel}<span>{plan.per.split(',')[0]}</span></p>
                      <p>{plan.tagline}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <p className="pl-plans-link"><Link href="/pricing" className="fn-textlink">See what each plan includes</Link></p>
            </div>
          </div>
        </section>

        {/* ── FAQ (paper) ── */}
        <section className="fn-section fn-paper" aria-labelledby="faq-heading">
          <div className="fn-container fn-split">
            <Reveal>
              <p className="fn-eyebrow" style={{ color: ACCENT }}>Questions</p>
              <h2 id="faq-heading" className="fn-h2">Pilot questions</h2>
            </Reveal>
            <div className="fn-faq">
              {FAQ.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>{f.q}</summary>
                  <div><p>{f.a}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final ask (ink) ── */}
        <section className="fn-section fn-ink" data-dark-bg="true">
          <div className="fn-container fn-final">
            <Reveal>
              <h2 className="fn-h2">Ready to see real work on your brand?</h2>
              <p className="fn-lead">
                Book a free 15-minute call to start the Pilot. Either way you keep what we make.
              </p>
              <div className="fn-actions">
                <ICPBookButton label={BOOK_CALL_LABEL} location="pilot_page" accent={ACCENT} className="fn-btn" />
              </div>
              <p className="fn-alt-ask">
                {BOOK_CALL_REASSURANCE} Or send footage for the free sample first: <Link href={FREE_EDITS_URL}>{FREE_EDITS_LABEL}</Link>.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />

      <style>{FUNNEL_CSS}</style>
      <style>{`
        .pl-hero { background: #F2EEE7; padding: 144px 0 128px; }
        .pl-hero-grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 64px; align-items: start; }
        .pl-crumb { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #8B8780; margin-bottom: 32px; }
        .pl-crumb a { color: #6E6B63; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; min-height: 32px; }
        .pl-crumb a:hover { color: ${ACCENT}; }
        .pl-h1 { max-width: 16ch; }
        .pl-lede { margin-bottom: 40px; }
        .pl-page .fn-alt-ask a { color: #0C0C0B; }
        .pl-page .fn-ink .fn-alt-ask a { color: #F2EEE7; }

        .pl-card { background: #0C0C0B; color: #F2EEE7; border-radius: 16px; padding: 40px; box-shadow: 0 24px 64px rgba(12,12,11,0.16); }
        .pl-card-label { margin: 0; font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${ACCENT}; }
        .pl-price { margin: 8px 0 0; font-size: 64px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; }
        .pl-price span { display: block; margin-top: 8px; font-size: 15px; font-weight: 500; letter-spacing: 0; color: rgba(242,238,231,0.6); }
        .pl-card-h { margin: 32px 0 16px; padding-top: 24px; border-top: 1px solid rgba(242,238,231,0.14); font-size: 12px !important; line-height: 1.4 !important; letter-spacing: 0.12em !important; font-weight: 800; text-transform: uppercase; color: rgba(242,238,231,0.6); }
        .pl-checks { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
        .pl-checks li { display: flex; gap: 12px; align-items: flex-start; font-size: 16px; line-height: 1.5; color: rgba(242,238,231,0.88); }
        .pl-checks svg { flex-shrink: 0; margin-top: 3px; color: ${ACCENT}; }

        .pl-steps { list-style: none; margin: 0; padding: 0; }
        .pl-step-n { width: 40px; height: 40px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; font-size: 16px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px; }
        .pl-after-p { margin: 24px 0 0; max-width: 44ch; }
        .pl-plan-price { margin: 0 0 16px !important; font-size: 32px !important; font-weight: 900; letter-spacing: -0.03em; color: #0C0C0B !important; line-height: 1.1 !important; }
        .pl-plan-price span { font-size: 15px; font-weight: 500; letter-spacing: 0; color: #6E6B63; }
        .pl-plans-link { margin: 16px 0 0; }

        @media (max-width: 1024px) {
          .pl-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 48px; }
          .pl-card { max-width: 560px; }
        }
        @media (max-width: 768px) {
          .pl-hero { padding: 112px 0 72px !important; }
          .pl-h1 { font-size: 36px; }
          .pl-lede { margin-bottom: 32px; }
          .pl-crumb { margin-bottom: 16px; }
          .pl-crumb a { min-height: 44px; }
          .pl-card { padding: 32px 24px; }
          .pl-price { font-size: 56px; }
        }
      `}</style>
    </>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={CHECK_PATH} />
    </svg>
  );
}
