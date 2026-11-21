import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BookPageEmbed from '@/components/BookPageEmbed';
import Link from 'next/link';
import { BOOK_CALL_LABEL } from '@/lib/links';
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

const STEPS = [
  { t: 'Your business, in your words', d: 'What you sell, who buys it and what is working or stuck right now.' },
  { t: 'What Lakshya sees', d: 'He looks at your site and your last few posts before the call and tells you the first three things he would fix.' },
  { t: 'Your next step', d: 'If we are a fit, the simplest way to start. If we are not, he will tell you so.' },
];

const FAQ = [
  { q: 'Is it really free?', a: 'Yes. 15 minutes, no card and no obligation. You keep the notes whether or not you hire us.' },
  { q: 'Is this a sales call?', a: 'No pitch. You get an honest read of your content, website and setup. If there is a fit, we tell you how to start, and you decide.' },
  { q: 'Which time zone are the slots in?', a: 'The calendar shows times in your own time zone automatically. We work with clients in the US, UK, Canada, Australia, Western Europe and India.' },
  { q: 'What should I have ready?', a: 'Nothing to prepare. If you want more out of the 15 minutes, have your website or main social profile open and one goal for the next 90 days.' },
  { q: 'No time that works?', a: 'Email lakshyasoni2703@gmail.com with two or three times that suit you, or start with 2 free edited videos instead.' },
];

export default function BookPage() {
  return (
    <>
      <Nav />
      <main id="main" className="bk-main">
        <div className="bk-wrap">
          <header className="bk-head">
            <h1 className="bk-h1">{BOOK_CALL_LABEL}</h1>
            <p className="bk-lead">
              A quick, practical call with Lakshya Soni, founder of EchoPulse Media. Pick a time below. You get a calendar invite and a video link straight away.
            </p>
          </header>

          <ol className="bk-steps" aria-label="What happens on the call">
            {STEPS.map((s, i) => (
              <li key={s.t}>
                <span className="bk-n" aria-hidden="true">{i + 1}</span>
                <div>
                  <p className="bk-st">{s.t}</p>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <BookPageEmbed />

          <section className="bk-more" aria-labelledby="bk-faq-h">
            <div className="bk-who">
              <h2 id="bk-who-h">Who you will talk to</h2>
              <p>
                <Link href="/about/lakshya-soni">Lakshya Soni</Link>, the founder. He runs every first call himself and reviews every piece of work before a client sees it. EchoPulse Media is a growth partner for founders and businesses: content, websites, custom software, AI and automation, and search.
              </p>
              <p className="bk-links">
                <Link href="/case-studies">See the case studies</Link>
                <Link href="/pricing">See the prices</Link>
              </p>
            </div>
            <div className="bk-faq">
              <h2 id="bk-faq-h">Before you book</h2>
              <dl>
                {FAQ.map((f) => (
                  <div key={f.q}>
                    <dt>{f.q}</dt>
                    <dd>
                      {f.q === 'No time that works?' ? (
                        <>
                          Email <a href="mailto:lakshyasoni2703@gmail.com">lakshyasoni2703@gmail.com</a> with two or three times that suit you, or <Link href="/free-edits">start with 2 free edited videos</Link> instead.
                        </>
                      ) : f.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <style>{`
        .bk-main { background: #F2EEE7; font-family: Inter, sans-serif; color: #0C0C0B; }
        .bk-wrap { width: 100%; max-width: 1040px; margin: 0 auto; padding: 168px 56px 112px; }
        .bk-head { margin-bottom: 40px; max-width: 720px; }
        .bk-h1 { margin: 0 0 16px; font-size: clamp(36px, 4.2vw, 56px); font-weight: 900; letter-spacing: -0.035em; line-height: 1.04; text-wrap: balance; }
        .bk-lead { margin: 0; font-size: 19px; line-height: 1.6; color: #3E3D3A; }
        .bk-steps { list-style: none; margin: 0 0 40px; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .bk-steps li { display: grid; grid-template-columns: 32px minmax(0, 1fr); gap: 16px; padding: 24px; background: #FBF9F5; border: 1px solid rgba(12,12,11,0.08); border-radius: 16px; }
        .bk-n { width: 32px; height: 32px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .bk-steps .bk-st { margin: 4px 0 8px !important; font-size: 17px !important; color: #0C0C0B !important; font-weight: 800; letter-spacing: -0.01em; line-height: 1.3; }
        .bk-steps p:not(.bk-st) { margin: 0; font-size: 15px; line-height: 1.55; color: #4A4740; }
        .bk-more { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 64px; margin-top: 80px; padding-top: 48px; border-top: 1px solid rgba(12,12,11,0.12); }
        .bk-more h2 { margin: 0 0 16px; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
        .bk-who p { margin: 0 0 16px; font-size: 16px; line-height: 1.65; color: #3E3D3A; }
        .bk-more a { color: #0C0C0B; font-weight: 700; text-decoration: underline; text-decoration-color: #E8541A; text-underline-offset: 4px; }
        .bk-links { display: flex; flex-wrap: wrap; gap: 24px; }
        .bk-faq dl { margin: 0; }
        .bk-faq dl > div { padding: 20px 0; border-bottom: 1px solid rgba(12,12,11,0.1); }
        .bk-faq dl > div:first-child { padding-top: 0; }
        .bk-faq dt { margin: 0 0 8px; font-size: 16px; font-weight: 800; }
        .bk-faq dd { margin: 0; font-size: 15px; line-height: 1.6; color: #4A4740; }
        @media (max-width: 900px) {
          .bk-wrap { padding: 128px 16px 80px; }
          .bk-head { margin-bottom: 24px; }
          .bk-lead { font-size: 17px; }
          .bk-steps { grid-template-columns: 1fr; gap: 8px; margin-bottom: 24px; }
          .bk-steps li { padding: 16px; gap: 12px; }
          .bk-steps .bk-st { font-size: 16px !important; margin-top: 5px !important; }
          .bk-more { grid-template-columns: 1fr; gap: 40px; margin-top: 56px; padding-top: 40px; }
        }
      `}</style>
    </>
  );
}
