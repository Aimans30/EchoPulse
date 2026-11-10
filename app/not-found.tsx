import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import { icps } from '@/lib/icpData';
import { services } from '@/lib/serviceData';
import { BOOK_CALL_LABEL } from '@/lib/links';

/**
 * app/not-found.tsx: the site-wide 404.
 *
 * Before this file existed, an unknown URL fell through to Next's default
 * 404, a black screen with no nav, no links and no way back. Search Console
 * showed real traffic hitting dead URLs (/privacy, retired blog slugs), so
 * every one of those visits ended on a page that did not look like the site.
 *
 * Server component, no motion library. Renders the normal Nav and Footer on
 * the cream background so it reads as "wrong address" rather than "site down",
 * and links every section a lost visitor is likely to have wanted.
 */

export const metadata: Metadata = {
  title: { absolute: 'Page not found | EchoPulse Media' },
  description: 'That page does not exist. Pick a section below or book a free strategy call.',
  robots: { index: false, follow: true },
};

const ACCENT = '#E8541A';

export default function NotFound() {
  return (
    <>
      <Nav />

      <main id="main" className="nf-page">
        <section className="nf-hero">
          <p className="nf-eyebrow">404</p>
          <h1 className="nf-h1">
            That page is not here.
            <span className="accent"> The rest of the site is.</span>
          </h1>
          <p className="nf-lede">
            The link you followed is old, mistyped, or points at a post we retired.
            Nothing is broken on your end. Pick where you wanted to go.
          </p>

          <div className="nf-cta">
            <ICPBookButton label={BOOK_CALL_LABEL} location="404" accent={ACCENT} size="lg" />
            <Link href="/" className="nf-home">Back to the homepage</Link>
          </div>
        </section>

        <section className="nf-grid" aria-label="Site sections">
          <div className="nf-col">
            <h2 className="nf-h2">Start here</h2>
            <ul className="nf-list">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/case-studies">Case studies</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/what-is-echopulse-media">What is EchoPulse Media</Link></li>
            </ul>
          </div>

          <div className="nf-col">
            <h2 className="nf-h2">Who we work with</h2>
            <ul className="nf-list">
              {icps.map((icp) => (
                <li key={icp.key}>
                  <Link href={`/${icp.key}`}>{icp.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="nf-col">
            <h2 className="nf-h2">Services</h2>
            <ul className="nf-list">
              {/* There is no /services index page. The homepage section is the
                  services overview, so that is where "all services" goes. */}
              <li><Link href="/#services">All services</Link></li>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <style>{`
          .nf-page {
            background: #F2EEE7;
            color: #0C0C0B;
            font-family: Inter, sans-serif;
            min-height: 70vh;
          }
          .nf-page section { max-width: 960px; margin: 0 auto; padding: 0 24px; }
          .nf-page p { line-height: 1.75; color: #4A4740; font-size: 16.5px; }
          .accent { color: ${ACCENT}; }

          .nf-hero { padding-top: 150px !important; padding-bottom: 56px !important; }
          .nf-eyebrow {
            font-size: 11px !important; font-weight: 700; letter-spacing: 3px;
            text-transform: uppercase; color: ${ACCENT} !important; margin: 0 0 14px;
          }
          .nf-h1 {
            font-size: clamp(34px, 5vw, 58px); font-weight: 900;
            letter-spacing: -0.04em; line-height: 1.05; margin: 0 0 22px; max-width: 760px;
          }
          .nf-lede { font-size: 18px !important; max-width: 620px; margin: 0 0 32px; }
          .nf-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; }
          .nf-home {
            font-size: 14.5px; font-weight: 600; color: #0C0C0B; text-decoration: none;
            border-bottom: 1.5px solid ${ACCENT}; padding-bottom: 2px;
          }
          .nf-home:hover { color: ${ACCENT}; }

          .nf-grid {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;
            padding-top: 48px !important; padding-bottom: 120px !important;
            border-top: 1px solid rgba(12,12,11,0.08);
          }
          .nf-h2 {
            font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
            color: #A8A49B; margin: 0 0 16px;
          }
          .nf-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
          .nf-list a {
            font-size: 15.5px; font-weight: 600; color: #0C0C0B; text-decoration: none;
            display: inline-flex; align-items: center; min-height: 32px;
          }
          .nf-list a:hover { color: ${ACCENT}; }

          @media (max-width: 760px) {
            .nf-hero { padding-top: 110px !important; }
            .nf-grid { grid-template-columns: 1fr; gap: 32px; }
            .nf-list a { min-height: 44px; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
