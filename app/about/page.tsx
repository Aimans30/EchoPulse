import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { services } from '@/lib/serviceData';

/**
 * /about — the founder entity page.
 *
 * ─── Why this page exists ────────────────────────────────────────────────────
 *
 * Until now, /about did not exist at all. There was no app/about/page.tsx, and
 * the [icp] dynamic route calls notFound() on any slug it doesn't recognise, so
 * echopulse.media/about returned a 404.
 *
 * Meanwhile GSC shows /about as the SECOND most-shown page on the whole domain:
 * 365 impressions at average position ~4. Google has been ranking a page that
 * isn't there, and every person who clicked it hit a dead end. Three clicks out
 * of 365 impressions is not a CTR problem, it's a broken-page problem.
 *
 * ─── Why it's built like this ────────────────────────────────────────────────
 *
 * This is a SERVER component with no 'use client', no animation library, no
 * IntersectionObserver. The rest of the site leans on client-side motion, which
 * is why the crawler saw an empty shell. An entity page's entire job is to be
 * read by machines: Google's raters, and the LLMs deciding whether EchoPulse is
 * a real company worth recommending. Every word here is in the initial HTML.
 *
 * The E-E-A-T chain it completes:
 *   Person (Lakshya) -> sameAs LinkedIn/X -> worksFor Organization -> this page
 * Blog author boxes link here; the root layout's Person schema names this page
 * as its mainEntityOfPage. That's what makes "Lakshya Soni" a resolvable entity
 * rather than a string.
 */

const SITE_URL = 'https://echopulse.media';

export const metadata: Metadata = {
  // `absolute` opts out of the root "%s | EchoPulse Media" template so the brand
  // isn't duplicated. Leads with the person, because that's the query.
  title: { absolute: 'About EchoPulse Media: Lakshya Soni, Founder & Content Studio' },
  description:
    'EchoPulse Media is a done-for-you content studio for founders, coaches, and business owners. Meet Lakshya Soni, the founder, and see how the studio actually runs.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About EchoPulse Media: Lakshya Soni, Founder',
    description:
      'A done-for-you content studio for founders, coaches, and business owners. Video editing, LinkedIn, blogs, and ads under one team.',
    url: `${SITE_URL}/about`,
    type: 'profile',
  },
};

/** What the studio actually does, in the founder's own sequence. */
const TIMELINE: { period: string; title: string; body: string }[] = [
  {
    period: 'Before EchoPulse',
    title: 'Editing, motion, marketing, code',
    body: 'Years cutting video across formats at a Canadian production studio. Freelance motion design on the side. Then marketing lead at a Canadian SaaS company, where the job was not making content look good but making it produce pipeline. Somewhere in there, enough frontend engineering to ship production code, which is why this site and every client funnel gets built in-house rather than farmed out.',
  },
  {
    period: 'The problem worth solving',
    title: 'Founders were managing five vendors',
    body: 'The same pattern kept showing up. A founder with a real offer and a real audience hires an editor, a writer, a designer, and an ads person. None of them talk to each other. The founder becomes the project manager for their own marketing, which is the exact job they were trying to outsource. The work is not bad. The coordination is what kills it.',
  },
  {
    period: 'What EchoPulse is',
    title: 'One team, one bill, every channel',
    body: 'You hit record. We do the rest: the edit, the LinkedIn post, the blog, the ad creative, the funnel it all points at. Senior review on every deliverable, because this is owner-operated rather than account-managed. No lock-in contracts. If the work is not worth staying for, you should not be contractually trapped into staying.',
  },
];

/** Things stated plainly, because AI systems quote plain statements. */
const FACTS: { label: string; value: string }[] = [
  { label: 'Founded', value: '2025' },
  { label: 'Founder', value: 'Lakshya Soni' },
  { label: 'Model', value: 'Done-for-you content studio' },
  { label: 'Serves', value: 'Founders, coaches, course creators, business owners, real estate agents' },
  { label: 'Markets', value: 'United States, United Kingdom, Canada, Australia, Western Europe' },
  { label: 'Starts at', value: '$299 for a 14-day paid Pilot, no contract' },
  { label: 'Commitment', value: 'Month to month after the Pilot, 30 days notice to cancel' },
];

export default function AboutPage() {
  /**
   * AboutPage + ProfilePage schema, wired by @id into the Organization and
   * Person nodes already declared in the root layout. Using @id references
   * rather than redeclaring the entities avoids two competing definitions of
   * the same thing, which is a common way to get schema quietly ignored.
   */
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/about#webpage`,
        url: `${SITE_URL}/about`,
        name: 'About EchoPulse Media',
        description:
          'EchoPulse Media is a done-for-you content studio for founders, coaches, and business owners, founded by Lakshya Soni.',
        about: { '@id': `${SITE_URL}/#organization` },
        mainEntity: { '@id': `${SITE_URL}/#founder` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/about#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` },
        ],
      },
    ],
  };

  return (
    <>
      {/* The About page rendered as a bare <main> with no chrome, so it looked
          like a detached page. Nav + Footer bring it in line with the rest of
          the site. Nav uses the default homepage links (/#services, etc.). */}
      <Nav />

      <main className="about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="about-hero">
        <nav aria-label="Breadcrumb" className="about-crumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>About</span>
        </nav>

        <h1 className="about-h1">
          We are the content team you would have hired,{' '}
          <span className="accent">if you had time to hire one.</span>
        </h1>

        {/*
          Answer-first paragraph. The opening 60 words are what Google lifts for
          a featured snippet and what an LLM quotes when asked "what is EchoPulse
          Media". So it says what we are, who it's for, and what it costs —
          before any storytelling.
        */}
        <p className="about-lede">
          EchoPulse Media is a done-for-you content studio for founders, coaches, and
          business owners. You record; we handle the video editing, LinkedIn posts,
          blogs, ad creative, and the funnel they point at. One team, one bill, every
          channel. It was founded in 2025 by Lakshya Soni and starts with a $299,
          14-day paid Pilot with no contract.
        </p>
      </section>

      {/* ── Founder ───────────────────────────────────────────────────────── */}
      <section className="about-founder" aria-labelledby="founder-heading">
        <div className="about-founder-photo">
          <Image
            src="/founder.jpg"
            alt="Lakshya Soni, founder of EchoPulse Media"
            width={420}
            height={520}
            className="about-photo"
            priority
          />
        </div>

        <div className="about-founder-copy">
          <p className="about-eyebrow">The founder</p>
          <h2 id="founder-heading" className="about-h2">Lakshya Soni</h2>
          <p className="about-role">Founder, EchoPulse Media</p>

          <p>
            I edit, I write, I run the marketing, and I ship the code. That combination
            is unusual, and it is the entire reason EchoPulse works the way it does.
            Most agencies are one discipline wearing a suit: an edit shop that outsources
            copy, or a copy shop that outsources video. I have done every seat, so I know
            where the handoffs break, and I built the studio to remove them.
          </p>

          <p>
            What that means for you in practice: the person reviewing your deliverable
            has actually cut the footage, written the hook, and run the ad. You are not
            explaining your business to an account manager who will relay it, imperfectly,
            to someone you never meet.
          </p>

          {/* The sameAs chain, made visible. Schema declares these; humans and
              raters want to click them. Both matter. */}
          <ul className="about-links">
            <li>
              <a
                href="https://www.linkedin.com/in/lakshyasoni/"
                rel="me noopener noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://x.com/Lakshya_Creates"
                rel="me noopener noreferrer"
                target="_blank"
              >
                X / Twitter
              </a>
            </li>
            <li>
              <a href="mailto:lakshya@echopulse.media">lakshya@echopulse.media</a>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <section className="about-timeline" aria-labelledby="story-heading">
        <p className="about-eyebrow">The story</p>
        <h2 id="story-heading" className="about-h2">How the studio got here</h2>

        <ol className="about-steps">
          {TIMELINE.map((item) => (
            <li key={item.period}>
              <p className="about-step-period">{item.period}</p>
              <h3 className="about-step-title">{item.title}</h3>
              <p className="about-step-body">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Facts table ───────────────────────────────────────────────────────
          A literal table of plain facts. This is the single most citable format
          for AI answer engines: structured, unambiguous, quotable without
          interpretation. If ChatGPT is asked "what does EchoPulse charge", this
          is the block it lifts. */}
      <section className="about-facts" aria-labelledby="facts-heading">
        <p className="about-eyebrow">The short version</p>
        <h2 id="facts-heading" className="about-h2">EchoPulse Media at a glance</h2>

        <table className="about-table">
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

      {/* ── Services: real internal links to the money pages ──────────────── */}
      <section className="about-services" aria-labelledby="services-heading">
        <p className="about-eyebrow">What we do</p>
        <h2 id="services-heading" className="about-h2">Seven services, one team</h2>

        <ul className="about-service-list">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`}>{s.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="about-cta">
        <h2 className="about-h2">Want to see the work before you commit?</h2>
        <p>
          That is what the Pilot is for. Fourteen days, $299, real deliverables on your
          brand, and you keep everything whether you continue or not.
        </p>
        <Link href="/order" className="about-cta-btn">
          Start the Pilot
        </Link>
        <p className="about-cta-alt">
          Or <Link href="/blog">read the blog</Link> to see how we think first.
        </p>
      </section>

      {/* Plain CSS, no JS. Everything above renders on the server. */}
      <style>{`
        .about-page {
          background: #F2EEE7;
          color: #0C0C0B;
          font-family: Inter, sans-serif;
        }
        .about-page section {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .about-page p { line-height: 1.75; color: #4A4740; font-size: 16.5px; }
        .accent { color: #E8541A; }

        .about-eyebrow {
          font-size: 10px !important; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; color: #A8A49B !important; margin: 0 0 12px;
        }
        .about-h1 {
          font-size: clamp(34px, 5vw, 58px); font-weight: 900;
          letter-spacing: -0.04em; line-height: 1.05; margin: 0 0 28px;
        }
        .about-h2 {
          font-size: clamp(26px, 3.4vw, 38px); font-weight: 800;
          letter-spacing: -0.03em; line-height: 1.15; margin: 0 0 24px;
        }

        /* Hero */
        .about-hero { padding-top: 140px !important; padding-bottom: 64px !important; }
        .about-crumb {
          display: flex; gap: 10px; font-size: 13px;
          color: #A8A49B; margin-bottom: 32px;
        }
        .about-crumb a { color: #6E6B63; text-decoration: none; }
        .about-crumb a:hover { color: #E8541A; }
        .about-lede {
          font-size: 19px !important; line-height: 1.7 !important;
          color: #2E2C28 !important; max-width: 700px;
        }

        /* Founder */
        .about-founder {
          display: grid; grid-template-columns: 300px 1fr; gap: 48px;
          align-items: start;
          padding-top: 64px !important; padding-bottom: 64px !important;
          border-top: 1px solid rgba(12,12,11,0.08);
        }
        .about-photo {
          width: 100%; height: auto; border-radius: 18px;
          object-fit: cover; display: block;
        }
        .about-role {
          font-size: 14px !important; color: #A8A49B !important;
          margin: -14px 0 24px !important;
        }
        .about-founder-copy p + p { margin-top: 18px; }
        .about-links {
          list-style: none; padding: 0; margin: 28px 0 0;
          display: flex; flex-wrap: wrap; gap: 20px;
        }
        .about-links a {
          font-size: 14px; font-weight: 600; color: #0C0C0B;
          text-decoration: none; border-bottom: 1.5px solid #E8541A;
          padding-bottom: 2px;
        }
        .about-links a:hover { color: #E8541A; }

        /* Timeline */
        .about-timeline {
          padding-top: 64px !important; padding-bottom: 64px !important;
          border-top: 1px solid rgba(12,12,11,0.08);
        }
        .about-steps { list-style: none; padding: 0; margin: 0; }
        .about-steps li {
          padding: 28px 0;
          border-bottom: 1px solid rgba(12,12,11,0.07);
        }
        .about-steps li:last-child { border-bottom: none; }
        .about-step-period {
          font-size: 11px !important; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #E8541A !important; margin: 0 0 8px;
        }
        .about-step-title {
          font-size: 20px; font-weight: 700; letter-spacing: -0.02em;
          margin: 0 0 10px; color: #0C0C0B;
        }
        .about-step-body { margin: 0; }

        /* Facts table */
        .about-facts {
          padding-top: 64px !important; padding-bottom: 64px !important;
          border-top: 1px solid rgba(12,12,11,0.08);
        }
        .about-table {
          width: 100%; border-collapse: collapse; text-align: left;
        }
        .about-table th, .about-table td {
          padding: 16px 0; border-bottom: 1px solid rgba(12,12,11,0.07);
          font-size: 15.5px; vertical-align: top;
        }
        .about-table th {
          font-weight: 700; color: #0C0C0B; width: 150px; padding-right: 24px;
        }
        .about-table td { color: #4A4740; line-height: 1.6; }

        /* Services */
        .about-services {
          padding-top: 64px !important; padding-bottom: 64px !important;
          border-top: 1px solid rgba(12,12,11,0.08);
        }
        .about-service-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-wrap: wrap; gap: 10px;
        }
        .about-service-list a {
          display: inline-block; padding: 10px 18px;
          border: 1px solid rgba(12,12,11,0.12); border-radius: 999px;
          font-size: 14.5px; font-weight: 600; color: #0C0C0B;
          text-decoration: none; transition: all 0.2s ease;
        }
        .about-service-list a:hover {
          background: #0C0C0B; color: #F2EEE7; border-color: #0C0C0B;
        }

        /* CTA */
        .about-cta {
          padding-top: 64px !important; padding-bottom: 128px !important;
          border-top: 1px solid rgba(12,12,11,0.08);
        }
        .about-cta-btn {
          display: inline-block; margin-top: 24px;
          background: #E8541A; color: #fff; text-decoration: none;
          font-weight: 700; font-size: 15px;
          padding: 15px 32px; border-radius: 999px;
        }
        .about-cta-btn:hover { background: #0C0C0B; }
        .about-cta-alt {
          margin-top: 20px !important; font-size: 14.5px !important;
        }
        .about-cta-alt a { color: #E8541A; font-weight: 600; }

        @media (max-width: 760px) {
          .about-hero { padding-top: 110px !important; }
          .about-founder { grid-template-columns: 1fr; gap: 32px; }
          .about-founder-photo { max-width: 240px; }
          .about-table th { width: 120px; font-size: 14.5px; }
          .about-table td { font-size: 14.5px; }
        }
      `}</style>
      </main>

      <Footer />
    </>
  );
}
