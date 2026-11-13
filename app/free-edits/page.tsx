import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FreeEditsForm from '@/components/FreeEditsForm';
import { FREE_SAMPLE } from '@/lib/pricing';

const canonical = 'https://echopulse.media/free-edits';
const DESCRIPTION =
  'Send raw footage and get 2 edited short-form videos back within 48 hours. No card, no call, and you keep the files.';

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
  return (
    <>
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
          </div>
          <FreeEditsForm />
        </div>
      </main>
      <Footer />

      <style>{`
        .fe-page { max-width: 1080px; margin: 0 auto; padding: 150px 24px 96px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 480px); gap: 48px; align-items: start; font-family: Inter, sans-serif; }
        .fe-copy { min-width: 0; }
        .fe-eyebrow { font: 700 11px Inter, sans-serif; letter-spacing: 3px; text-transform: uppercase; color: #E8541A; margin: 0 0 14px; }
        .fe-copy h1 { font: 900 clamp(38px, 6vw, 68px)/1.02 Inter, sans-serif; letter-spacing: -2px; margin: 0 0 18px; }
        .fe-lead { font-size: 19px; line-height: 1.55; color: #3E3D3A; margin: 0 0 22px; }
        .fe-copy ul { margin: 0 0 18px; padding: 0 0 0 20px; display: grid; gap: 10px; font-size: 16px; line-height: 1.55; color: #0C0C0B; }
        .fe-small { font-size: 14px; color: #6E6B63; margin: 0; }
        @media (max-width: 900px) { .fe-page { grid-template-columns: minmax(0, 1fr); gap: 32px; padding-top: 110px; } }
        @media (max-width: 480px) { .fe-page { padding-left: 18px; padding-right: 18px; padding-bottom: 72px; } }
      `}</style>
    </>
  );
}
