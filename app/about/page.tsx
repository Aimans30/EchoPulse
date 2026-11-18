import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { services } from '@/lib/serviceData';
import { BOOK_CALL_URL, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';

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
  // Was 61 chars (title) and 162 (description), both just over the limits, and
  // the description was a flat restatement of what the company is. At position
  // ~4 this page converts at 0.78% when that slot should do far better, so the
  // snippet is the thing to fix: lead with what the reader gets from opening
  // it, not with a definition of the company they already searched for.
  title: { absolute: 'About EchoPulse Media, a Content Studio for Founders' },
  description:
    'Who runs EchoPulse Media, how the work actually gets done, and what to expect if you hire us. Written by founder Lakshya Soni.',
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
  // 14 days, not 30. app/terms/page.tsx section 3 is the binding document and
  // states "fourteen (14) calendar days written notice"; public/llms.txt also
  // already said 14. Three marketing pages had drifted to 30, which both
  // contradicted the Terms and understated the offer, since a shorter notice
  // period is the better deal for the client.
  { label: 'Commitment', value: 'Month to month after the Pilot, 14 days notice to cancel' },
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

      {/* id="main" is the target of the skip-to-content link in app/layout.tsx.
          That link renders on every page, but only the homepage carried the id,
          so it was a dead anchor everywhere else. */}
      <main id="main" className="about-page">
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

          {/* Same ask as the closing block, where the reader has just met
              the person: one button, one text link. */}
          <div className="about-ask">
            <Link href={FREE_EDITS_URL} className="about-cta-btn">{FREE_EDITS_LABEL}</Link>
            <a href={BOOK_CALL_URL} className="about-ask-link" target="_blank" rel="noopener noreferrer">
              Or book a free 15-minute call with Lakshya
            </a>
          </div>
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

      {/* ── Team: names and roles only ────────────────────────────────────── */}
      <section className="about-team" aria-labelledby="team-heading">
        <p className="about-eyebrow">The team</p>
        <h2 id="team-heading" className="about-h2">Three people, no account managers</h2>
        <ul className="about-team-list">
          <li>
            <strong><Link href="/about/lakshya-soni">Lakshya Soni</Link></strong>
            <span>Founder. Strategy, editing, writing and code.</span>
          </li>
          <li>
            <strong>Shaurya</strong>
            <span>Design.</span>
          </li>
          <li>
            <strong>Aiman</strong>
            <span>Delivery.</span>
          </li>
        </ul>
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
        <h2 id="services-heading" className="about-h2">Eight services, one team</h2>

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
          Send footage you already have and get 2 edited videos back within 48 hours,
          free. No card, no call, and the files are yours to keep.
        </p>
        {/* Was "Start the Pilot" linking to /#pricing, a paid step as the only
            ask on the page buyers open to check who is behind the studio. The
            free sample is the lower-commitment first step; the call is the
            text link. */}
        <div className="about-ask">
          <Link href={FREE_EDITS_URL} className="about-cta-btn">{FREE_EDITS_LABEL}</Link>
          <a href={BOOK_CALL_URL} className="about-ask-link" target="_blank" rel="noopener noreferrer">
            Or book a free 15-minute call with Lakshya
          </a>
        </div>
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

        /* Team */
        .about-team {
          padding-top: 64px !important; padding-bottom: 64px !important;
          border-top: 1px solid rgba(12,12,11,0.08);
        }
        .about-team-list {
          list-style: none; padding: 0; margin: 0;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
        }
        .about-team-list li {
          display: flex; flex-direction: column; gap: 6px;
          padding: 20px; border: 1px solid rgba(12,12,11,0.1);
          border-radius: 18px; background: rgba(255,255,255,0.45);
          color: #4A4740; line-height: 1.6; font-size: 15.5px;
        }
        .about-team-list strong { font-size: 17px; font-weight: 800; color: #0C0C0B; }
        .about-team-list a { color: #0C0C0B; text-decoration: underline; text-decoration-color: #E8541A; text-underline-offset: 3px; }

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
        .about-ask {
          display: flex; flex-direction: column; align-items: flex-start;
          gap: 14px; margin-top: 24px;
        }
        .about-ask-link {
          display: inline-flex; align-items: center; min-height: 44px;
          color: #0C0C0B; font-size: 15px; font-weight: 600;
          text-decoration: underline; text-decoration-color: #E8541A;
          text-underline-offset: 3px;
        }
        .about-ask-link:hover { color: #E8541A; }
        .about-cta-btn {
          display: inline-block;
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
          .about-team-list { grid-template-columns: 1fr; }
          .about-hero { padding-top: 110px !important; }
          .about-founder { grid-template-columns: 1fr; gap: 32px; }
          .about-founder-photo { max-width: 240px; }

          /* Two-column rows do not survive a 360px screen. A 120px label
             column left ~170px for the value, so "Founders, coaches, course
             creators, business owners, real estate agents" rendered as a
             six-line sliver, and 14.5px is under the 16px reading floor.
             Stacking label over value gives the value the full width back and
             lets the type go up rather than down. The markup stays a real
             <table> with <th scope="row">, which is what makes this block the
             most quotable thing on the page for answer engines. */
          .about-table,
          .about-table tbody,
          .about-table tr,
          .about-table th,
          .about-table td { display: block; width: auto; }
          .about-table tr {
            padding: 14px 0;
            border-bottom: 1px solid rgba(12,12,11,0.07);
          }
          .about-table tr:last-child { border-bottom: none; }
          .about-table th {
            padding: 0 0 4px;
            border-bottom: none;
            font-size: 12px;
            letter-spacing: 0.4px;
            text-transform: uppercase;
            color: #A8A49B;
          }
          .about-table td {
            padding: 0;
            border-bottom: none;
            font-size: 16px;
            line-height: 1.55;
            color: #2E2C28;
          }

          /* globals.css enforces a 44px touch target on links, then exempts
             li a so that inline links inside prose lists are not inflated.
             Both link rows below ARE list items, so they inherited the
             exemption while being standalone buttons: a 37px pill and a 20px
             text link. Restoring a real target for the two that are actually
             tapped. */
          .about-service-list a {
            min-height: 44px;
            display: inline-flex;
            align-items: center;
            padding: 10px 18px;
          }
          /* The orange underline has to keep hugging the text, so this one
             grows its hit area with a pseudo-element instead of its box.
             Horizontal expansion stays under the 20px flex gap so neighbouring
             targets cannot overlap. */
          .about-links a { position: relative; }
          .about-links a::before {
            content: "";
            position: absolute;
            top: -13px;
            right: -8px;
            bottom: -13px;
            left: -8px;
          }
        }
      `}</style>
      </main>

      <Footer />
    </>
  );
}
