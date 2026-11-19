import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FreeEditsForm from '@/components/FreeEditsForm';
import { FREE_SAMPLE } from '@/lib/pricing';

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
    images: ['/og-echopulse-media.png'],
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
      {
        '@type': 'CommunicateAction',
        name: 'Request 2 free edits by email',
        target: 'mailto:lakshya@echopulse.media?subject=2%20free%20edits',
        description: 'Email a share link to the raw footage with your name and type of business.',
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerLd) }} />
      <Nav />
      <main id="main" style={{ background: '#F2EEE7', color: '#0C0C0B' }}>
        <div className="fe-page">
          <div className="fe-copy">
            <p className="fe-eyebrow">{FREE_SAMPLE.name}</p>
            <h1>Get 2 free edits</h1>
            <p className="fe-lead">{FREE_SAMPLE.tagline}</p>
            <ul>
              {FREE_SAMPLE.scope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="fe-small">{FREE_SAMPLE.per}.</p>
            <p className="fe-alt">
              Prefer email? Send a link to your footage to{' '}
              <a href="mailto:lakshya@echopulse.media?subject=2%20free%20edits">lakshya@echopulse.media</a> with your
              name and what kind of business you run. Same offer, same 48 hours.
            </p>
          </div>
          <FreeEditsForm />
        </div>
      </main>
      <Footer />

      <style>{`
        .fe-page { max-width: 1080px; margin: 0 auto; padding: 150px 24px 96px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 560px); gap: 56px; align-items: start; font-family: Inter, sans-serif; }
        .fe-copy { min-width: 0; }
        .fe-eyebrow { font: 700 11px Inter, sans-serif; letter-spacing: 3px; text-transform: uppercase; color: #E8541A; margin: 0 0 14px; }
        .fe-copy h1 { font: 900 clamp(38px, 6vw, 68px)/1.02 Inter, sans-serif; letter-spacing: -2px; margin: 0 0 18px; }
        .fe-lead { font-size: 19px; line-height: 1.55; color: #3E3D3A; margin: 0 0 22px; }
        .fe-copy ul { margin: 0 0 18px; padding: 0 0 0 20px; display: grid; gap: 10px; font-size: 16px; line-height: 1.55; color: #0C0C0B; }
        .fe-small { font-size: 14px; color: #6E6B63; margin: 0; }
        .fe-alt { margin: 22px 0 0; padding-top: 18px; border-top: 1px solid rgba(12,12,11,0.12); font-size: 14.5px; line-height: 1.6; color: #4A4740; max-width: 46ch; }
        .fe-alt a { color: #0C0C0B; font-weight: 700; text-underline-offset: 3px; }
        @media (min-width: 901px) { .fe-copy { position: sticky; top: 120px; } }
        @media (max-width: 900px) { .fe-page { grid-template-columns: minmax(0, 1fr); gap: 32px; padding-top: 110px; } }
        @media (max-width: 480px) { .fe-page { padding-left: 18px; padding-right: 18px; padding-bottom: 72px; } }
      `}</style>
    </>
  );
}
