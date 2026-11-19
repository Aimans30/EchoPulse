import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import { BOOK_CALL_LABEL } from '@/lib/links';
import { FAQ_GROUPS, ALL_FAQS } from '@/lib/faqData';

/**
 * /faq: the full FAQ page.
 *
 * The homepage has a FAQ section with ten questions. A section cannot rank for
 * "echopulse media faq" or be linked from an email, and it cannot carry the
 * buyer questions that only fit a page of their own ("is EchoPulse Media
 * legit", "what happens on the call"). This page shows every question in
 * lib/faqData.ts, grouped under plain headings. The homepage section reads the
 * same file, so the two cannot drift, and every price and Pilot scope line in
 * the answers is built from lib/pricing.ts.
 *
 * Server component, plain CSS, modelled on /what-is-echopulse-media. Every
 * answer is in the served HTML (a <dl>, nothing collapsed), so the FAQPage
 * schema below describes what the page actually contains.
 */

const SITE_URL = 'https://echopulse.media';
const ACCENT = '#E8541A';

export const metadata: Metadata = {
  title: { absolute: 'EchoPulse Media FAQ' },
  // 153 chars.
  description:
    'Straight answers on EchoPulse Media pricing, the free sample and $299 Pilot, how the work happens, who runs the studio and what results it has published.',
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: 'EchoPulse Media FAQ',
    description:
      'Pricing, the free sample and Pilot, how the work happens, who runs EchoPulse Media and what results it has published.',
    url: `${SITE_URL}/faq`,
    type: 'website',
  },
};

export default function FaqPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/faq#webpage`,
        url: `${SITE_URL}/faq`,
        name: 'EchoPulse Media FAQ',
        description: metadata.description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/faq#faq`,
        mainEntity: ALL_FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/faq#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE_URL}/faq` },
        ],
      },
    ],
  };

  return (
    <>
      <Nav />

      <main id="main" className="fq-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="fq-hero">
          <nav aria-label="Breadcrumb" className="fq-crumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>FAQ</span>
          </nav>
          <p className="fq-eyebrow">Questions</p>
          <h1 className="fq-h1">EchoPulse Media FAQ</h1>
          <p className="fq-lede">
            Answers for founders, coaches, real estate agents and business owners deciding whether to
            hire EchoPulse Media, a done-for-you content and website studio, taken from our real prices
            and terms. If yours is not here, book a free 15-minute call and ask it straight.
          </p>
          <ul className="fq-jump" aria-label="Jump to a topic">
            {FAQ_GROUPS.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`}>{g.heading}</a>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Question groups ────────────────────────────────────────────── */}
        {FAQ_GROUPS.map((g) => (
          <section key={g.id} id={g.id} className="fq-faq" aria-labelledby={`${g.id}-heading`}>
            <p className="fq-eyebrow">{g.heading}</p>
            <h2 id={`${g.id}-heading`} className="fq-h2">{g.heading}</h2>
            <dl className="fq-faq-list">
              {g.items.map((f) => (
                <div key={f.q}>
                  <dt>{f.q}</dt>
                  <dd>
                    {f.a}
                    {f.link && (
                      <>
                        {' '}
                        <Link href={f.link.href}>{f.link.label}</Link>.
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <section className="fq-cta">
          <h2 className="fq-h2">Still have a question?</h2>
          <p>Book a free 15-minute call, or send two clips and get them back edited within 48 hours. Either way you keep what we make.</p>
          <div className="fq-cta-row">
            <ICPBookButton label={BOOK_CALL_LABEL} location="faq_page" accent={ACCENT} size="lg" fullWidthMobile />
            <Link href="/pricing" className="fq-cta-alt">See pricing</Link>
          </div>
        </section>

        <style>{`
          .fq-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; }
          .fq-page > section { max-width: 900px; margin: 0 auto; padding: 56px 24px; border-top: 1px solid rgba(12,12,11,0.08); }
          .fq-page p, .fq-page li, .fq-page dd, .fq-page td { line-height: 1.7; color: #4A4740; font-size: 16px; }
          .fq-page a { color: #0C0C0B; font-weight: 600; text-decoration: underline; text-decoration-color: ${ACCENT}; text-underline-offset: 3px; overflow-wrap: anywhere; }
          .fq-page a:hover { color: ${ACCENT}; }

          .fq-eyebrow { font-size: 10px !important; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #A8A49B !important; margin: 0 0 12px; }
          .fq-h1 { font-size: clamp(36px, 5.4vw, 62px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.02; margin: 0 0 24px; }
          .fq-h2 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; margin: 0 0 24px; }

          .fq-hero { padding-top: 140px !important; border-top: none !important; }
          .fq-crumb { display: flex; gap: 10px; font-size: 13px; color: #A8A49B; margin-bottom: 32px; }
          .fq-crumb a { color: #6E6B63; text-decoration: none; font-weight: 500; }
          .fq-lede { font-size: 19px !important; color: #2E2C28 !important; max-width: 760px; margin: 0 0 24px; }

          .fq-jump { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 10px; }
          .fq-jump a { display: inline-flex; align-items: center; min-height: 44px; padding: 8px 18px; border: 1px solid rgba(12,12,11,0.12); border-radius: 999px; font-size: 14.5px; text-decoration: none; }
          .fq-jump a:hover { background: #0C0C0B; color: #F2EEE7; border-color: #0C0C0B; }

          .fq-faq { scroll-margin-top: 80px; }
          .fq-faq-list { margin: 0; }
          .fq-faq-list > div { padding: 22px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
          .fq-faq-list > div:last-child { border-bottom: none; }
          .fq-faq-list dt { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; }
          .fq-faq-list dd { margin: 0; }

          .fq-cta { padding-bottom: 128px !important; }
          .fq-cta p { max-width: 640px; }
          .fq-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; margin-top: 24px; }
          .fq-cta-alt { font-size: 14.5px; }

          @media (max-width: 760px) {
            .fq-page > section { padding: 44px 20px; }
            .fq-hero { padding-top: 110px !important; }
            .fq-cta-row { align-items: stretch; flex-direction: column; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
