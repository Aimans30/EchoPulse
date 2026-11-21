import type { Metadata } from 'next';
import { ogImages } from '@/lib/ogImages';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import { BOOK_CALL_LABEL } from '@/lib/links';

/**
 * /about/lakshya-soni: the founder's author page. Server component.
 * Facts only from app/about/page.tsx, public/llms.txt and the founderStory
 * entry in lib/caseStudyData.ts. The Person node lives in app/layout.tsx and
 * is referenced here by @id.
 */

const SITE_URL = 'https://echopulse.media';
const ACCENT = '#E8541A';
const LINKEDIN = 'https://www.linkedin.com/in/lakshyasoni/';

export const metadata: Metadata = {
  title: { absolute: 'Lakshya Soni, Founder of EchoPulse Media' },
  description:
    'Lakshya Soni is the founder and owner of EchoPulse Media, a growth partner for founders and businesses in Bhopal, India. Background, facts, work and contact.',
  alternates: { canonical: `${SITE_URL}/about/lakshya-soni` },
  openGraph: {
    title: 'Lakshya Soni, Founder of EchoPulse Media',
    description:
      'Founder and operator of EchoPulse Media: strategy, editing, writing and code. Based in Bhopal, India.',
    url: `${SITE_URL}/about/lakshya-soni`,
    siteName: 'EchoPulse Media',
    type: 'profile',
    images: ogImages('about-lakshya-soni'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lakshya Soni, Founder of EchoPulse Media',
    images: ogImages('about-lakshya-soni'),
  },
};

const DEFINITION =
  'Lakshya Soni is the founder and owner of EchoPulse Media, a growth partner for founders and businesses based in Bhopal, India.';

export default function LakshyaSoniPage() {
  const FACTS: { label: string; value: React.ReactNode }[] = [
    { label: 'Name', value: 'Lakshya Soni' },
    { label: 'Role', value: 'Founder and operator of EchoPulse Media: strategy, editing, writing and code' },
    { label: 'Based in', value: 'Bhopal, India' },
    { label: 'Founded EchoPulse', value: '2025' },
    { label: 'Team', value: 'Shaurya (design), Aiman (delivery)' },
    {
      label: 'Background',
      value:
        'Before EchoPulse, an editor at a Canadian real estate media company, where he edited listing tours, agent brand videos and ads for more than 200 Canadian real estate agents. Those agents were that company\'s clients, not EchoPulse clients.',
    },
    { label: 'Email', value: <a href="mailto:lakshyasoni2703@gmail.com">lakshyasoni2703@gmail.com</a> },
    { label: 'LinkedIn', value: <a href={LINKEDIN} rel="noopener noreferrer" target="_blank">{LINKEDIN}</a> },
    { label: 'Company', value: <Link href="/what-is-echopulse-media">EchoPulse Media</Link> },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/about/lakshya-soni#webpage`,
        url: `${SITE_URL}/about/lakshya-soni`,
        name: 'Lakshya Soni, Founder of EchoPulse Media',
        description: DEFINITION,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: 'en',
        mainEntity: {
          '@id': `${SITE_URL}/about/lakshya-soni#person`,
          '@type': 'Person',
          name: 'Lakshya Soni',
          jobTitle: 'Founder',
          sameAs: [LINKEDIN],
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/about/lakshya-soni#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` },
          { '@type': 'ListItem', position: 3, name: 'Lakshya Soni', item: `${SITE_URL}/about/lakshya-soni` },
        ],
      },
    ],
  };

  return (
    <>
      <Nav />

      <main id="main" className="au-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <section className="au-hero">
          <nav aria-label="Breadcrumb" className="au-crumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/about">About</Link>
            <span aria-hidden="true">/</span>
            <span>Lakshya Soni</span>
          </nav>
          <div className="au-hero-grid">
            <div>
              <p className="au-eyebrow">The founder</p>
              <h1 className="au-h1">Lakshya Soni</h1>
              <p className="au-lede">{DEFINITION}</p>
            </div>
            <Image
              src="/founder.jpg"
              alt="Lakshya Soni, founder of EchoPulse Media"
              width={1487}
              height={1594}
              className="au-photo"
              sizes="(max-width: 760px) 100vw, 300px"
              priority
            />
          </div>
        </section>

        <section aria-labelledby="facts-heading">
          <p className="au-eyebrow">The facts</p>
          <h2 id="facts-heading" className="au-h2">Lakshya Soni at a glance</h2>
          <table className="au-table">
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

        <section aria-labelledby="not-heading">
          <p className="au-eyebrow">To be clear</p>
          <h2 id="not-heading" className="au-h2">Not to be confused with</h2>
          <p>
            This is the Lakshya Soni who founded EchoPulse Media. He is not connected to other people or
            companies of the same name. For the company, see{' '}
            <Link href="/what-is-echopulse-media">what EchoPulse Media is</Link>.
          </p>
        </section>

        <section aria-labelledby="writes-heading">
          <p className="au-eyebrow">Writing</p>
          <h2 id="writes-heading" className="au-h2">What he writes about</h2>
          <p>
            Pricing guides, comparisons and how-tos about content, video editing and websites for founders,
            coaches, business owners and real estate agents. <Link href="/blog">Read the blog</Link>.
          </p>
        </section>

        <section aria-labelledby="work-heading">
          <p className="au-eyebrow">Work</p>
          <h2 id="work-heading" className="au-h2">Where to see it</h2>
          <ul className="au-list">
            <li><Link href="/case-studies/founder-200-real-estate-agents">Founder story: editing for 200+ Canadian real estate agents</Link></li>
            <li><Link href="/case-studies/magicbnb-seo-aeo">MagicBNB case study: marketing run end to end</Link></li>
            <li><Link href="/work">The video work</Link></li>
          </ul>
        </section>

        <section className="au-cta">
          <h2 className="au-h2">Talk to the person who runs it</h2>
          <p>Email <a href="mailto:lakshyasoni2703@gmail.com">lakshyasoni2703@gmail.com</a> or book a call.</p>
          <div className="au-cta-row">
            <ICPBookButton label={BOOK_CALL_LABEL} location="author_page" accent={ACCENT} size="lg" fullWidthMobile />
            <Link href="/about" className="au-cta-alt">About EchoPulse Media</Link>
          </div>
        </section>

        <style>{`
          .au-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; }
          .au-page > section { max-width: 900px; margin: 0 auto; padding: 56px 24px; border-top: 1px solid rgba(12,12,11,0.08); }
          .au-page p, .au-page li, .au-page dd, .au-page td { line-height: 1.7; color: #4A4740; font-size: 16px; }
          .au-page a { color: #0C0C0B; font-weight: 600; text-decoration: underline; text-decoration-color: ${ACCENT}; text-underline-offset: 3px; overflow-wrap: anywhere; }
          .au-page a:hover { color: ${ACCENT}; }

          .au-eyebrow { font-size: 10px !important; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #A8A49B !important; margin: 0 0 12px; }
          .au-h1 { font-size: clamp(36px, 5.4vw, 62px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.02; margin: 0 0 24px; }
          .au-h2 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; margin: 0 0 24px; }

          .au-hero { padding-top: 140px !important; border-top: none !important; }
          .au-crumb { display: flex; gap: 10px; font-size: 13px; color: #A8A49B; margin-bottom: 32px; }
          .au-crumb a { color: #6E6B63; text-decoration: none; font-weight: 500; }
          .au-lede { font-size: 19px !important; color: #2E2C28 !important; max-width: 760px; margin: 0 0 18px; }
          .au-meta { font-size: 13.5px !important; color: #A8A49B !important; margin: 0; }

          .au-table { width: 100%; border-collapse: collapse; text-align: left; }
          .au-table th, .au-table td { padding: 14px 0; border-bottom: 1px solid rgba(12,12,11,0.08); font-size: 15.5px; vertical-align: top; }
          .au-table th { font-weight: 700; color: #0C0C0B; width: 150px; padding-right: 24px; }

          .au-not-list { margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px 36px; }
          .au-not-list dt { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 6px; }
          .au-not-list dd { margin: 0; font-size: 15px !important; }

          .au-steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
          .au-steps li { display: flex; gap: 16px; padding: 22px; border: 1px solid rgba(12,12,11,0.1); border-radius: 18px; background: rgba(255,255,255,0.45); }
          .au-steps h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 6px; color: #0C0C0B; }
          .au-steps p { margin: 0; font-size: 15px !important; }
          .au-step-num { flex: 0 0 36px; width: 36px; height: 36px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; font-weight: 800; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }

          .au-proof-intro { max-width: 720px; margin: 0 0 24px; }
          .au-metrics { list-style: none; padding: 0; margin: 0 0 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .au-metrics li { display: flex; flex-direction: column; gap: 4px; padding: 20px; border-radius: 18px; background: #0C0C0B; color: #F2EEE7; }
          .au-metric-value { font-size: 26px; font-weight: 900; letter-spacing: -0.03em; color: #F2EEE7; line-height: 1.1; }
          .au-metric-label { font-size: 13px; color: rgba(242,238,231,0.8); line-height: 1.4; }
          .au-metric-note { font-size: 12px; color: rgba(242,238,231,0.5); line-height: 1.4; }

          .au-who-list { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-wrap: wrap; gap: 10px; }
          .au-who-list a { display: inline-flex; align-items: center; min-height: 44px; padding: 8px 18px; border: 1px solid rgba(12,12,11,0.12); border-radius: 999px; font-size: 14.5px; text-decoration: none; }
          .au-who-list a:hover { background: #0C0C0B; color: #F2EEE7; border-color: #0C0C0B; }

          .au-faq-list { margin: 0; }
          .au-faq-list > div { padding: 22px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
          .au-faq-list > div:last-child { border-bottom: none; }
          .au-faq-list dt { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; }
          .au-faq-list dd { margin: 0; }

          .au-cta { padding-bottom: 128px !important; }
          .au-cta p { max-width: 640px; }
          .au-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; margin-top: 24px; }
          .au-cta-alt { font-size: 14.5px; }

          @media (max-width: 760px) {
            .au-page > section { padding: 44px 20px; }
            .au-hero { padding-top: 110px !important; }
            .au-not-list { grid-template-columns: 1fr; }
            .au-metrics { grid-template-columns: 1fr 1fr; }
            .au-table, .au-table tbody, .au-table tr, .au-table th, .au-table td { display: block; width: auto; }
            .au-table tr { padding: 12px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
            .au-table th { padding: 0 0 4px; border-bottom: none; font-size: 12px; letter-spacing: 0.4px; text-transform: uppercase; color: #A8A49B; }
            .au-table td { padding: 0; border-bottom: none; font-size: 16px; }
            .au-cta-row { align-items: stretch; flex-direction: column; }
          }
          .au-list { margin: 0 0 16px; padding-left: 22px; }
          .au-hero-grid { display: grid; grid-template-columns: 1fr 260px; gap: 40px; align-items: center; }
          .au-photo { width: 100%; height: auto; border-radius: 18px; }
          @media (max-width: 760px) { .au-hero-grid { grid-template-columns: 1fr; } .au-photo { max-width: 260px; } }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
