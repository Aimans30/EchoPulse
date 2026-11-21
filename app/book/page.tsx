import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BookPageEmbed from '@/components/BookPageEmbed';
import { BOOK_CALL_LABEL, BOOK_CALL_REASSURANCE } from '@/lib/links';
import { ogImages } from '@/lib/ogImages';

/**
 * /book: the booking calendar as a page of its own.
 *
 * Why it exists: a direct cal.com link unfurls on LinkedIn, WhatsApp and Slack
 * with Cal.com's own preview, which we cannot style. This page has our preview
 * image and the same calendar inline, so it is the link to share. Booking
 * buttons elsewhere on the site still open the on-site modal.
 *
 * Server component; the only client code is the calendar embed.
 */

const SITE_URL = 'https://echopulse.media';
const canonical = `${SITE_URL}/book`;
const TITLE = BOOK_CALL_LABEL;
const DESCRIPTION =
  'Book a free 15-minute call with Lakshya Soni, founder of EchoPulse Media. Tell him how your business runs and get the first three things he would fix. No pitch.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${TITLE} | EchoPulse Media`,
    description: DESCRIPTION,
    url: canonical,
    siteName: 'EchoPulse Media',
    type: 'website',
    images: ogImages('book'),
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | EchoPulse Media`,
    description: DESCRIPTION,
    images: ogImages('book'),
  },
};

export default function BookPage() {
  return (
    <>
      <Nav />
      <main id="main" className="bk-main">
        <div className="bk-wrap">
          <header className="bk-head">
            <p className="bk-eyebrow">Book a call</p>
            <h1 className="bk-h1">{BOOK_CALL_LABEL}</h1>
            <p className="bk-lead">{BOOK_CALL_REASSURANCE}</p>
          </header>
          <BookPageEmbed />
        </div>
      </main>
      <Footer />
      <style>{`
        .bk-main { background: #F2EEE7; font-family: Inter, sans-serif; color: #0C0C0B; }
        .bk-wrap { width: 100%; max-width: 1040px; margin: 0 auto; padding: 184px 56px 112px; }
        .bk-head { margin-bottom: 36px; }
        .bk-eyebrow { margin: 0 0 16px; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #E8541A; }
        .bk-h1 { margin: 0 0 16px; font-size: clamp(36px, 4.2vw, 56px); font-weight: 900; letter-spacing: -0.035em; line-height: 1.04; text-wrap: balance; }
        .bk-lead { margin: 0; font-size: 19px; line-height: 1.6; color: #3E3D3A; max-width: 60ch; }
        @media (max-width: 900px) {
          .bk-wrap { padding: 140px 16px 80px; }
          .bk-head { margin-bottom: 24px; }
          .bk-lead { font-size: 17px; }
        }
      `}</style>
    </>
  );
}
