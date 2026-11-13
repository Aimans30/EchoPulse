import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import { BOOK_CALL_LABEL, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';
import { PROMISES } from '@/lib/pricing';

/**
 * /case-studies/founder-background: what the founder did before EchoPulse.
 *
 * This is NOT a client case study and must never read like one. The agents and
 * brokerages mentioned here were clients of a previous employer, edited by
 * Lakshya as one of that company's editors. They are not EchoPulse clients and
 * none of them endorses EchoPulse. The page says so twice, in the facts table
 * and in its own section, because an AI answer that lifts one paragraph should
 * still carry the caveat.
 *
 * The previous company is deliberately not named and not located more closely
 * than "Canada". The criticism is written as the founder's own experience and
 * as the reason EchoPulse is built the way it is, not as an accusation against
 * an identifiable business.
 *
 * Every figure is the founder's own account of his work history. Nothing here
 * is a measured result, so there is no Dataset node and no metric strip.
 */

const SITE_URL = 'https://echopulse.media';
const ACCENT = '#E8541A';
const URL = `${SITE_URL}/case-studies/founder-background`;
const UPDATED = '13 November 2026';
const UPDATED_ISO = '2026-11-13';

const TITLE = 'Founder Background: 200+ Real Estate Agents';
const DESCRIPTION =
  'Before EchoPulse, founder Lakshya Soni edited listing tours, agent brand videos and ads for more than 200 Canadian real estate agents. What that taught him.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: `${TITLE} | EchoPulse Media`,
    description: DESCRIPTION,
    url: URL,
    siteName: 'EchoPulse Media',
    type: 'article',
    modifiedTime: UPDATED_ISO,
    images: ['/og-echopulse-media.png'],
  },
};

const LEDE =
  'Before starting EchoPulse Media, I worked as a video editor for a real estate media company in Canada that shot and edited content for agents. Through that company I edited listing tours, personal brand videos and ads for more than 200 real estate agents. This page is what I worked on there, what I saw go wrong, and why EchoPulse is built the opposite way.';

const FACTS: { label: string; value: string }[] = [
  { label: 'Who', value: 'Lakshya Soni, founder of EchoPulse Media' },
  { label: 'Role', value: 'Video editor at a Canadian real estate media company that offered shooting and editing to agents' },
  { label: 'Agents edited for', value: 'More than 200 real estate agents across Canada' },
  { label: 'Brokerages', value: 'Agents at RE/MAX offices and other large Canadian brokerages' },
  { label: 'Footage', value: 'Listing and property tours shot in 4K, at 120 frames per second and above' },
  { label: 'Types of work', value: 'Listing tour videos, agent personal brand content, UGC-style ads' },
  { label: 'Whose clients', value: 'The previous company\'s clients, not EchoPulse clients. No brokerage or agent named here endorses EchoPulse.' },
  { label: 'Last updated', value: UPDATED },
];

const WORK: { title: string; detail: string }[] = [
  {
    title: 'Listing and property tours',
    detail:
      'The core of the job. High-resolution walk-throughs shot in 4K at 120 frames per second or more, which means smooth slow motion and a lot of footage per property. The edit decides whether a buyer watches twelve seconds or the whole home: the opening shot, the order of the rooms, the pace, the colour.',
  },
  {
    title: 'Agent personal brand content',
    detail:
      'Talking-head videos, market updates, neighbourhood guides and day-in-the-life pieces. This is the content that gets an agent recognised before the listing appointment, and it is edited very differently from a tour: tighter cuts, captions, a hook in the first two seconds.',
  },
  {
    title: 'UGC-style ads',
    detail:
      'Short ads cut to look native in a feed, for agents and for other businesses. Several versions of the same idea with different openings, because the first three seconds decide whether the rest is ever seen.',
  },
];

const LESSONS: { title: string; saw: string; now: string }[] = [
  {
    title: 'Price',
    saw: 'Agents paid premium prices. The people doing the editing were paid a small share of it, and the client had no way to see what the money bought.',
    now: 'Every price is published on the pricing page, with the exact scope next to it. The person you pay is the person doing the work.',
  },
  {
    title: 'Quality',
    saw: 'Volume came first. Edits went out that I would not have signed, because there was always another batch behind them.',
    now: `${PROMISES.revisions}. A small client list is a deliberate limit, not a growth problem.`,
  },
  {
    title: 'How people are treated',
    saw: 'Editors were treated as replaceable, the culture was poor, and it showed in the work.',
    now: 'Three named people, the same three every month. Nobody on a client account is a stranger to the client.',
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Has EchoPulse Media worked with RE/MAX?',
    a: 'No. EchoPulse Media has no brokerage as a client. Before founding EchoPulse, Lakshya Soni edited videos for agents at RE/MAX offices and other Canadian brokerages as an editor at a previous company. Those agents were that company\'s clients.',
  },
  {
    q: 'What real estate video experience does the EchoPulse founder have?',
    a: 'Lakshya Soni edited listing tours, agent personal brand videos and UGC-style ads for more than 200 Canadian real estate agents while working as an editor for a Canadian real estate media company, including tours shot in 4K at 120 frames per second and above.',
  },
  {
    q: 'Why is the previous company not named?',
    a: 'Because this page is about the work and what it taught the founder, not about that company. The criticism here is one editor\'s own experience of working there.',
  },
  {
    q: 'Can I see real estate edits from EchoPulse?',
    a: 'Yes. The work page has sample edits you can filter by niche, and any agent can send footage from a listing and get two edited videos back free within 48 hours.',
  },
];

export default function FounderBackgroundPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${URL}#article`,
        headline: 'Before EchoPulse: editing for more than 200 Canadian real estate agents',
        description: DESCRIPTION,
        dateModified: UPDATED_ISO,
        author: { '@id': `${SITE_URL}/#founder` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        about: { '@id': `${SITE_URL}/#founder` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
        url: URL,
      },
      {
        '@type': 'FAQPage',
        '@id': `${URL}#faq`,
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${URL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Case studies', item: `${SITE_URL}/case-studies` },
          { '@type': 'ListItem', position: 3, name: 'Founder background', item: URL },
        ],
      },
    ],
  };

  return (
    <>
      <Nav />

      <main id="main" className="fb-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

        <section className="fb-hero">
          <nav aria-label="Breadcrumb" className="fb-crumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/case-studies">Case studies</Link>
            <span aria-hidden="true">/</span>
            <span>Founder background</span>
          </nav>
          <p className="fb-eyebrow">Founder background, not a client case study</p>
          <h1 className="fb-h1">Before EchoPulse: editing for more than 200 Canadian real estate agents.</h1>
          <p className="fb-lede">{LEDE}</p>
          <p className="fb-meta">
            Written by <Link href="/about">Lakshya Soni</Link>. Last updated {UPDATED}. This is my own account of my work
            before EchoPulse.
          </p>
        </section>

        <section aria-labelledby="fb-facts">
          <p className="fb-eyebrow">The facts</p>
          <h2 id="fb-facts" className="fb-h2">The background in one table</h2>
          <table className="fb-table">
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

        <section aria-labelledby="fb-work">
          <p className="fb-eyebrow">The work</p>
          <h2 id="fb-work" className="fb-h2">What I edited</h2>
          <ol className="fb-steps">
            {WORK.map((w, i) => (
              <li key={w.title}>
                <span className="fb-step-num">{i + 1}</span>
                <div>
                  <h3>{w.title}</h3>
                  <p>{w.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="fb-lessons">
          <p className="fb-eyebrow">Why EchoPulse exists</p>
          <h2 id="fb-lessons" className="fb-h2">What I saw go wrong, and what EchoPulse does instead</h2>
          <p>
            The company was well known and busy. From the editing desk it looked different. I am not naming it, and
            this is one editor&apos;s experience, not an investigation. But these three things are the reason
            EchoPulse works the way it does.
          </p>
          <div className="fb-table-scroll">
            <table className="fb-table fb-compare">
              <thead>
                <tr>
                  <th scope="col">Area</th>
                  <th scope="col">What I saw there</th>
                  <th scope="col">What EchoPulse does</th>
                </tr>
              </thead>
              <tbody>
                {LESSONS.map((l) => (
                  <tr key={l.title}>
                    <th scope="row">{l.title}</th>
                    <td>{l.saw}</td>
                    <td>{l.now}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="fb-not">
          <p className="fb-eyebrow">To be clear</p>
          <h2 id="fb-not" className="fb-h2">What this page does not claim</h2>
          <dl className="fb-not-list">
            <div>
              <dt>These were not EchoPulse clients</dt>
              <dd>The agents and brokerages were clients of the company I worked for. EchoPulse Media has no brokerage as a client and does not claim one.</dd>
            </div>
            <div>
              <dt>Nobody here endorses EchoPulse</dt>
              <dd>No agent or brokerage mentioned on this page has reviewed or recommended EchoPulse Media. When a client is willing to speak on the record, we will introduce them.</dd>
            </div>
            <div>
              <dt>No results are claimed</dt>
              <dd>I edited the videos. I did not run those agents&apos; marketing and I do not have their numbers, so there are none on this page.</dd>
            </div>
            <div>
              <dt>The measured proof is elsewhere</dt>
              <dd>The <Link href="/case-studies/magicbnb-seo-aeo">MagicBNB case study</Link> is the one with a real export behind it. The <Link href="/work">work page</Link> has edits you can watch.</dd>
            </div>
          </dl>
        </section>

        <section className="fb-faq" aria-labelledby="fb-faq">
          <p className="fb-eyebrow">Questions</p>
          <h2 id="fb-faq" className="fb-h2">Questions about the founder&apos;s real estate background</h2>
          <dl className="fb-faq-list">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="fb-cta">
          <h2 className="fb-h2">An agent? Send one listing and see the edit.</h2>
          <p>Send footage from a listing or a talking-head clip and get two edited videos back within 48 hours, free. You keep the files either way.</p>
          <div className="fb-cta-row">
            <a href={FREE_EDITS_URL} className="fb-cta-alt">{FREE_EDITS_LABEL}</a>
            <ICPBookButton label={BOOK_CALL_LABEL} location="founder_background" accent={ACCENT} size="lg" fullWidthMobile />
            <Link href="/real-estate" className="fb-cta-alt">Content for real estate agents</Link>
          </div>
        </section>

        <style>{`
          .fb-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; }
          .fb-page > section { max-width: 900px; margin: 0 auto; padding: 56px 24px; border-top: 1px solid rgba(12,12,11,0.08); }
          .fb-page p, .fb-page li, .fb-page dd, .fb-page td { line-height: 1.7; color: #4A4740; font-size: 16px; }
          .fb-page a { color: #0C0C0B; font-weight: 600; text-decoration: underline; text-decoration-color: ${ACCENT}; text-underline-offset: 3px; overflow-wrap: anywhere; }
          .fb-page a:hover { color: ${ACCENT}; }

          .fb-eyebrow { font-size: 10px !important; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #A8A49B !important; margin: 0 0 12px; }
          .fb-h1 { font-size: clamp(36px, 5.4vw, 62px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.02; margin: 0 0 24px; }
          .fb-h2 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; margin: 0 0 24px; }

          .fb-hero { padding-top: 140px !important; border-top: none !important; }
          .fb-crumb { display: flex; gap: 10px; font-size: 13px; color: #A8A49B; margin-bottom: 32px; }
          .fb-crumb a { color: #6E6B63; text-decoration: none; font-weight: 500; }
          .fb-lede { font-size: 19px !important; color: #2E2C28 !important; max-width: 760px; margin: 0 0 18px; }
          .fb-meta { font-size: 13.5px !important; color: #A8A49B !important; margin: 0; }

          .fb-table { width: 100%; border-collapse: collapse; text-align: left; }
          .fb-table th, .fb-table td { padding: 14px 0; border-bottom: 1px solid rgba(12,12,11,0.08); font-size: 15.5px; vertical-align: top; }
          .fb-table th { font-weight: 700; color: #0C0C0B; width: 150px; padding-right: 24px; }

          .fb-not-list { margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px 36px; }
          .fb-not-list dt { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 6px; }
          .fb-not-list dd { margin: 0; font-size: 15px !important; }

          .fb-steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
          .fb-steps li { display: flex; gap: 16px; padding: 22px; border: 1px solid rgba(12,12,11,0.1); border-radius: 18px; background: rgba(255,255,255,0.45); }
          .fb-steps h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 6px; color: #0C0C0B; }
          .fb-steps p { margin: 0; font-size: 15px !important; }
          .fb-step-num { flex: 0 0 36px; width: 36px; height: 36px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; font-weight: 800; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }

          .fb-proof-intro { max-width: 720px; margin: 0 0 24px; }
          .fb-metrics { list-style: none; padding: 0; margin: 0 0 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .fb-metrics li { display: flex; flex-direction: column; gap: 4px; padding: 20px; border-radius: 18px; background: #0C0C0B; color: #F2EEE7; }
          .fb-metric-value { font-size: 26px; font-weight: 900; letter-spacing: -0.03em; color: #F2EEE7; line-height: 1.1; }
          .fb-metric-label { font-size: 13px; color: rgba(242,238,231,0.8); line-height: 1.4; }
          .fb-metric-note { font-size: 12px; color: rgba(242,238,231,0.5); line-height: 1.4; }

          .fb-who-list { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-wrap: wrap; gap: 10px; }
          .fb-who-list a { display: inline-flex; align-items: center; min-height: 44px; padding: 8px 18px; border: 1px solid rgba(12,12,11,0.12); border-radius: 999px; font-size: 14.5px; text-decoration: none; }
          .fb-who-list a:hover { background: #0C0C0B; color: #F2EEE7; border-color: #0C0C0B; }

          .fb-faq-list { margin: 0; }
          .fb-faq-list > div { padding: 22px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
          .fb-faq-list > div:last-child { border-bottom: none; }
          .fb-faq-list dt { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; }
          .fb-faq-list dd { margin: 0; }

          .fb-cta { padding-bottom: 128px !important; }
          .fb-cta p { max-width: 640px; }
          .fb-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; margin-top: 24px; }
          .fb-cta-alt { font-size: 14.5px; }

          @media (max-width: 760px) {
            .fb-page > section { padding: 44px 20px; }
            .fb-hero { padding-top: 110px !important; }
            .fb-not-list { grid-template-columns: 1fr; }
            .fb-metrics { grid-template-columns: 1fr 1fr; }
            .fb-table, .fb-table tbody, .fb-table tr, .fb-table th, .fb-table td { display: block; width: auto; }
            .fb-table tr { padding: 12px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
            .fb-table th { padding: 0 0 4px; border-bottom: none; font-size: 12px; letter-spacing: 0.4px; text-transform: uppercase; color: #A8A49B; }
            .fb-table td { padding: 0; border-bottom: none; font-size: 16px; }
            .fb-cta-row { align-items: stretch; flex-direction: column; }
          }
        
          .fb-crumb a + span { color: #A8A49B; }
          .fb-table-scroll { overflow-x: auto; margin-top: 24px; }
          .fb-compare th[scope="col"] { width: auto; font-size: 12px; letter-spacing: 0.4px; text-transform: uppercase; color: #A8A49B; }
          .fb-compare td { padding-right: 20px; }
          @media (max-width: 760px) {
            .fb-compare thead { display: none; }
            .fb-compare td { margin-top: 8px; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
