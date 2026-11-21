import type { Metadata } from 'next';
import { ogImages } from '@/lib/ogImages';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FreeEditsForm from '@/components/FreeEditsForm';
import { FREE_SAMPLE } from '@/lib/pricing';
import { FUNNEL_CSS, CHECK_PATH } from '@/components/icp/funnelStyles';

const canonical = 'https://echopulse.media/free-edits';
const DESCRIPTION =
  'A free EchoPulse Media sample for business owners and creators: send raw footage and get 2 edited short-form videos back within 48 hours. No card, no call.';

export const metadata: Metadata = {
  title: 'Get 2 Free Edits',
  description: DESCRIPTION,
  alternates: { canonical },
  openGraph: {
    title: 'Get 2 Free Edits | EchoPulse Media',
    description: DESCRIPTION,
    url: canonical,
    siteName: 'EchoPulse Media',
    type: 'website',
    images: ogImages('free-edits'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get 2 Free Edits | EchoPulse Media',
    description: DESCRIPTION,
    images: ogImages('free-edits'),
  },
};

export default function FreeEditsPage() {
  // Plain facts about the offer for crawlers and AI assistants: what it is,
  // that it costs nothing, and the two ways to ask for it.
  const offerLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}#page`,
    url: canonical,
    name: 'Get 2 free edits',
    description: DESCRIPTION,
    mainEntity: {
      '@type': 'Offer',
      name: '2 free edited short-form videos',
      description:
        'EchoPulse Media edits 2 short-form videos from footage you already have and returns them within 48 hours of receiving the footage. No card and no call are required, and you keep the files whether or not you hire the studio.',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      offeredBy: { '@id': 'https://echopulse.media/#organization' },
      url: canonical,
    },
    potentialAction: [
      {
        '@type': 'CommunicateAction',
        name: 'Request 2 free edits by form',
        target: canonical,
        description:
          'Fill in name, email, type of business and a share link to the raw footage (Google Drive, Dropbox or WeTransfer). Editing style, captions, music, a reference video and brand details are optional.',
      },
    ],
  };

  // How it works, in the order it happens. Every line is a fact already
  // stated in FREE_SAMPLE (lib/pricing.ts) or in the form itself.
  const steps = [
    { t: 'Tell us who you are', d: 'Name, email and the kind of business you run.' },
    { t: 'Share a link to your footage', d: 'Google Drive, Dropbox or WeTransfer. Add an editing style if you have one in mind.' },
    { t: 'Get 2 edited videos back', d: 'Within 48 hours of receiving the footage. You keep the files whether or not you hire us.' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerLd) }} />
      <Nav />
      <main id="main" className="fn fe-main">
        <div className="fn-container fe-page">
          <header className="fe-head">
            <p className="fn-eyebrow" style={{ color: '#E8541A' }}>{FREE_SAMPLE.name}</p>
            <h1 className="fn-h1 fe-h1">Get 2 free edits</h1>
            <p className="fn-lead">{FREE_SAMPLE.tagline}</p>
            <ul className="fn-proof" aria-label="The terms">
              <li><Check />No card</li>
              <li><Check />No call</li>
              <li><Check />You keep the files</li>
            </ul>
          </header>

          <div className="fe-form">
            <FreeEditsForm />
          </div>

          <div className="fe-info">
            <div aria-labelledby="fe-get" role="group">
              <h2 id="fe-get" className="fe-h2">What you get</h2>
              <ul className="fe-list">
                {FREE_SAMPLE.scope.map((item) => (
                  <li key={item}><Check />{item}</li>
                ))}
              </ul>
            </div>

            <div aria-labelledby="fe-how" role="group">
              <h2 id="fe-how" className="fe-h2">How it works</h2>
              <ol className="fe-steps">
                {steps.map((s, i) => (
                  <li key={s.t}>
                    <span className="fe-step-n" aria-hidden="true">{i + 1}</span>
                    <div>
                      <h3>{s.t}</h3>
                      <p>{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

          </div>
        </div>
      </main>
      <Footer />

      <style>{FUNNEL_CSS}</style>
      <style>{`
        /* The form is the page. Desktop: what you get and how it works on the
           left, the form on the right, both starting on the same top line.
           Phones: the headline, then straight into the form, then the detail. */
        .fe-main { background: #F2EEE7; }
        .fe-page { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); grid-template-areas: "head form" "info form"; column-gap: 80px; row-gap: 48px; align-items: start; padding-top: 144px; padding-bottom: 128px; }
        .fe-head { grid-area: head; }
        .fe-form { grid-area: form; min-width: 0; }
        .fe-info { grid-area: info; min-width: 0; display: flex; flex-direction: column; gap: 40px; }
        .fe-h1 { margin-bottom: 16px; }
        .fe-head .fn-proof { margin-top: 24px; }
        .fe-h2 { font-size: 12px !important; line-height: 1.4 !important; font-weight: 800; letter-spacing: 0.12em !important; text-transform: uppercase; color: #6E6B63; margin: 0 0 16px; }
        .fe-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
        .fe-list li { display: flex; gap: 12px; align-items: flex-start; font-size: 16px; line-height: 1.55; color: #0C0C0B; }
        .fe-list svg { flex-shrink: 0; margin-top: 4px; color: #E8541A; }
        .fe-steps { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(12,12,11,0.12); }
        .fe-steps li { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 16px; padding: 16px 0; border-bottom: 1px solid rgba(12,12,11,0.12); }
        .fe-step-n { width: 32px; height: 32px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; font-size: 14px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
        .fe-steps h3 { margin: 4px 0 4px; font-size: 16px !important; line-height: 1.4 !important; font-weight: 800; letter-spacing: -0.01em; color: #0C0C0B; }
        .fe-steps p { margin: 0; font-size: 15px; line-height: 1.55; color: #6E6B63; }
        @media (max-width: 1024px) {
          .fe-page { column-gap: 48px; }
        }
        @media (max-width: 900px) {
          .fe-page { grid-template-columns: minmax(0, 1fr); grid-template-areas: "head" "form" "info"; row-gap: 32px; padding-top: 112px; padding-bottom: 96px; }
          .fe-h1 { font-size: 36px; }
          .fe-info { gap: 32px; }
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
