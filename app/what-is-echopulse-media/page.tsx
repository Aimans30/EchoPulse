import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import { icps } from '@/lib/icpData';
import { getCaseStudy } from '@/lib/caseStudyData';
import { BOOK_CALL_LABEL, BOOK_CALL_REASSURANCE, staticBookingUrl } from '@/lib/links';
import { FREE_SAMPLE, PILOT, PRESENCE, GROWTH, FULL_SYSTEM, PRICE_LADDER_SENTENCE, PROMISES } from '@/lib/pricing';

/**
 * /what-is-echopulse-media: the brand entity page.
 *
 * Why this is a page and not a blog post. The old post at
 * /blog/what-is-echopulse-media-the-definitive-guide-... was unpublished in
 * the July 2026 cleanup, but Search Console kept showing the URL for the
 * queries "what is echopulse media" and "echopulse media" at position ~5
 * and every click landed on a 404. A query about what a company IS wants a
 * factual page, not an opinion piece under /blog/, and a page can carry
 * AboutPage schema tied to the Organization node while a BlogPosting cannot.
 * lib/redirects.ts now 301s the old slug here.
 *
 * November 2026 rewrite: the owner repositioned EchoPulse as a growth partner
 * (content, websites, custom software and CRMs, AI and automation, search),
 * open to businesses of every kind, with five audiences that have their own
 * pages. The first sentence of DEFINITION is the one AI answer engines lift;
 * keep it self-contained.
 *
 * A second reason it has to be plain: "Echopulse" is also the name of a
 * medical ultrasound device made by Theraclion. Some of the brand query is
 * people looking for that. The page says so near the top and in the FAQ.
 *
 * Server component, no client code beyond the booking button. Every fact here
 * must match lib/pricing.ts, lib/serviceData.ts, lib/caseStudyData.ts,
 * app/about/page.tsx and public/llms.txt. If one of those changes, change this.
 * Prices come from lib/pricing.ts only; custom build prices are quoted on a
 * call and are deliberately not printed here.
 */

const SITE_URL = 'https://echopulse.media';
const PAGE_URL = `${SITE_URL}/what-is-echopulse-media`;
const ACCENT = '#E8541A';
const LAST_VERIFIED = '20 November 2026';
const LAST_VERIFIED_ISO = '2026-11-20';
// The one contact email shown on this page. It is the address the site footer
// shows (components/Footer.tsx). Keep the two in step.
const CONTACT_EMAIL = 'lakshyasoni2703@gmail.com';

const META_TITLE = 'What Is EchoPulse Media? Founder, Services, Facts';
const META_DESCRIPTION =
  'EchoPulse Media is a growth partner founded in 2025 by Lakshya Soni in Bhopal, India: content, websites, custom software, AI automation and SEO. Not a device.';

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: PAGE_URL,
    type: 'website',
    siteName: 'EchoPulse Media',
    images: [{ url: '/og-echopulse-media.png', width: 1200, height: 630, alt: 'EchoPulse Media' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
};

const SHORT_DEFINITION =
  'EchoPulse Media is a growth partner for founders and businesses, founded in 2025 by Lakshya Soni and based in Bhopal, India.';

const DEFINITION = `${SHORT_DEFINITION} It makes the content that builds the founder and the brand, builds websites, funnels and custom software such as CRMs, sets up AI and automation, and gets businesses found on Google and in AI answers. Clients are in the United States, the United Kingdom, Canada, Australia, Western Europe and India, and work starts with 2 free edits or a ${PILOT.priceLabel} Pilot, then monthly plans from ${PRESENCE.priceLabel}.`;

const AREAS: {
  key: string;
  title: string;
  line: string;
  examples: string[];
  links: { href: string; label: string }[];
}[] = [
  {
    key: 'content',
    title: 'Content and personal brand',
    line: 'A social media presence for the founder and for the business, made from footage and ideas you already have.',
    examples: [
      'Short-form video for Reels, TikTok and Shorts, edited from your raw footage and back in 48 hours',
      'LinkedIn posts and carousels written in the founder’s own voice',
      'Sourced long-form blogs and static or video ad creative for Meta, TikTok, YouTube and Google',
    ],
    links: [
      { href: '/services/video-editing', label: 'Video editing' },
      { href: '/services/linkedin-ghostwriting', label: 'LinkedIn and social' },
      { href: '/services/blog-production', label: 'Blogs' },
      { href: '/services/ad-creatives', label: 'Ad creatives' },
    ],
  },
  {
    key: 'web',
    title: 'Websites and funnels',
    line: 'Sites built around the one action you want a visitor to take, with the copy written alongside the design.',
    examples: [
      'Brand sites, landing pages, sales funnels and online stores',
      'Booking, payments and your CRM wired in (Stripe, Calendly, Shopify, HubSpot, GoHighLevel)',
      'GA4 and conversion tracking, so you can see which pages bring enquiries. You own the code and the domain.',
    ],
    links: [{ href: '/services/websites-funnels', label: 'Websites and funnels' }],
  },
  {
    key: 'software',
    title: 'Custom software and CRMs',
    line: 'Software shaped around how your team already works, at a fixed price agreed before the build starts.',
    examples: [
      'A custom CRM or internal dashboard that holds the data your team needs in one place',
      'A client portal with onboarding, deliverables, billing, project status and files behind one login',
      'An MVP with logins and payments. The code moves to your GitHub on launch day.',
    ],
    links: [{ href: '/services/apps-software', label: 'Apps and software' }],
  },
  {
    key: 'ai',
    title: 'AI and automation',
    line: 'Systems that take repeat work off the team, built on the tools you already pay for wherever possible.',
    examples: [
      'Lead follow-up: every DM, form and enquiry gets an instant reply and a follow-up sequence',
      'Intake and qualification forms that put only serious buyers on your calendar',
      'Reports that assemble themselves, and AI that drafts email replies your team edits and sends',
    ],
    links: [
      { href: '/services/automations', label: 'Automations' },
      { href: '/services/apps-software', label: 'AI tools' },
    ],
  },
  {
    key: 'search',
    title: 'Search and AI visibility',
    line: 'SEO and AEO: the work of being shown in Google and quoted in answers from tools like ChatGPT.',
    examples: [
      'Pages, titles and structured data fixed first, plus a Google Business Profile that matches the site',
      'Sourced blogs that answer the questions your buyers type into Google',
      'A monthly read of Search Console to decide what to edit and write next',
    ],
    links: [{ href: '/services/seo-aeo', label: 'SEO and AI search' }],
  },
];

const STEPS: { price: string; name: string; detail: string }[] = [
  {
    price: FREE_SAMPLE.priceLabel,
    name: FREE_SAMPLE.name,
    detail: `${FREE_SAMPLE.tagline} No card, no call required, and you keep the files.`,
  },
  {
    price: PILOT.priceLabel,
    name: `${PILOT.name}, ${PILOT.per}`,
    detail: 'A recorded strategy session, 6 video edits, 2 posts, 1 sourced blog, a content audit and a 30-day plan. No retainer.',
  },
  {
    price: `${PRESENCE.priceLabel} or ${GROWTH.priceLabel} a month`,
    name: `Monthly: ${PRESENCE.name} or ${GROWTH.name}`,
    detail: `${PRESENCE.name} is a weekly call, video, posts and your website kept current. ${GROWTH.name} covers every channel, rebuilds the website in month one and takes 20% off any custom build. ${PROMISES.noContract}`,
  },
  {
    price: FULL_SYSTEM.priceLabel,
    name: 'Custom builds',
    detail: 'Software, CRMs, client portals, automations, launches or more volume than Growth. Written scope, fixed price and a delivery date before you pay.',
  },
];

const FOR_TYPES = [
  'Service businesses',
  'Local businesses',
  'B2B and SaaS companies',
  'E-commerce brands',
  'Coaches and course creators',
  'Agencies',
  'Professional firms',
];

const NOT_FOR: { title: string; body: string }[] = [
  { title: 'A one-off logo or a single graphic', body: 'EchoPulse works on the systems that bring in and serve customers. A logo on its own is better bought from a designer who does only that.' },
  { title: 'Replacing a large in-house team', body: 'Three people do the work. A company that needs a department’s worth of headcount should hire one.' },
  { title: 'Customers from search this month', body: 'Search takes months to show results. If you need sales this month, start with content or a funnel instead.' },
  { title: 'Guaranteed leads, rankings or revenue', body: 'EchoPulse commits to the work, the turnaround and the revisions. It does not guarantee outcomes it does not control, and says so before month one.' },
];

const CASES: { slug: string; figure: string; text: string; label: string }[] = [
  {
    slug: 'whites-and-brights-operating-system',
    figure: '$3,400+',
    text: 'Whites & Brights, a laundry chain in Patna: one operating system for every outlet. More than US$3,400 (\u20B93 lakh+) saved in running costs and losses since launch, by EchoPulse\'s estimate with the client. Disclosure: Shaurya, EchoPulse\'s design partner, was later made a director of WNB Cleantech, the company behind Whites & Brights.',
    label: 'Read the Whites & Brights system case study',
  },
  {
    slug: 'whites-and-brights-customer-app',
    figure: 'Live on Google Play',
    text: 'Whites & Brights customer app: an Android app whose orders land in the store panel, ready for a pickup driver. Same disclosure applies.',
    label: 'Read the Whites & Brights app case study',
  },
  {
    slug: 'magicbnb-seo-aeo',
    figure: '5.8 to 4,803',
    text: 'MagicBNB: average daily Google impressions, April 2026 against 1 to 16 November 2026 (Google Search Console). One client, not a typical result.',
    label: 'Read the MagicBNB case study',
  },
  {
    slug: 'working-with-god-rebuild',
    figure: '$50 to $60 a month to $0',
    text: 'Working With God: a coaching site rebuilt for a one-time $599, with no monthly platform bill. No traffic result is claimed.',
    label: 'Read the Working With God case study',
  },
  {
    slug: 'founder-200-real-estate-agents',
    figure: '200+ agents',
    text: 'Founder story: Lakshya edited for more than 200 Canadian real estate agents at a previous employer. They were that company\'s clients, not EchoPulse clients, and no result is claimed.',
    label: 'Read the founder story',
  },
];

const FAQ: { q: string; a: string }[] = [
  { q: 'What is EchoPulse Media?', a: DEFINITION },
  {
    q: 'Is EchoPulse Media legit?',
    a: 'Yes. EchoPulse Media is a real business, founded in 2025 and run by Lakshya Soni from Bhopal, India. You can check its work: magicbnb.io, whitesandbrights.com and workingwithgod.live are live client sites, the Whites and Brights app is on Google Play, and the MagicBNB case study shows the Search Console screenshots behind its numbers. It publishes no client counts and no results it cannot show.',
  },
  {
    q: 'Who owns EchoPulse Media?',
    a: 'Lakshya Soni. He founded it in 2025 and owns it as a sole proprietor, trading as EchoPulse Media. Shaurya is a partner and the design lead. Aiman leads delivery.',
  },
  {
    q: 'Where is EchoPulse based?',
    a: 'Bhopal, Madhya Pradesh, India. The team works remotely with clients in the United States, the United Kingdom, Canada, Australia, Western Europe and India. Any listing that puts EchoPulse Media in another city is out of date.',
  },
  {
    q: 'Is EchoPulse the same as the Echopulse medical device?',
    a: 'No. Echopulse is also the name of an ultrasound device made by Theraclion, a French medical technology company, used to treat thyroid nodules. EchoPulse Media has no connection to it, and no connection to the ECHOPulse echocardiogram research model or the EchoPulse heart diagnosis device from IIT (ISM) Dhanbad.',
  },
  {
    q: 'Is EchoPulse Media connected to echopulse.in or other companies called EchoPulse?',
    a: 'No. EchoPulse Media is not affiliated with echopulse.in, Rezono\'s EchoPulse BI, EcoPulse in Austin, or any other company, app or tool with a similar name. Its only website is echopulse.media.',
  },
  {
    q: 'Are there reviews of EchoPulse Media?',
    a: 'EchoPulse Media does not show star ratings or quotes on its site. Each case study names the client, links to the live work and explains how every figure was measured, so you can check it directly. When a client agrees to speak on the record, EchoPulse introduces you on a call.',
  },
  {
    q: 'Is EchoPulse Media an agency?',
    a: 'It is a three-person, owner-operated team, not an agency with account managers. Lakshya Soni leads every account and reviews every deliverable before it reaches you. Shaurya handles design and Aiman handles delivery.',
  },
  { q: 'What does EchoPulse Media cost?', a: PRICE_LADDER_SENTENCE },
  {
    q: 'Is EchoPulse Media taking new clients?',
    a: `Yes. As of ${LAST_VERIFIED}, EchoPulse is taking on new clients. Start with 2 free edits, the $299 Pilot, or a free 15-minute call with Lakshya.`,
  },
  {
    q: 'How do I contact EchoPulse Media?',
    a: `Email ${CONTACT_EMAIL} or book a free 15-minute call with Lakshya from this page. Replies come within 3 hours in the workday.`,
  },
  {
    q: 'Do you build custom CRMs?',
    a: 'Yes. EchoPulse builds custom CRMs, client portals and internal dashboards around how your team already works. Each build has a written scope, a fixed price and a delivery date before you pay, and the code moves to your GitHub at launch with documentation and 14 days of free fixes. If an existing CRM such as HubSpot or GoHighLevel fits, the work is setting it up and connecting it instead.',
  },
  {
    q: 'Can you add AI to our existing tools?',
    a: 'Usually, yes. Automations are built on Make, Zapier, ManyChat and the CRM you already use. Typical jobs are instant replies and follow-up for new leads, intake and qualification forms, reports that assemble themselves, and AI that drafts email replies for your team to edit. A typical automation stack is live in 10 to 14 business days.',
  },
  {
    q: 'Which time zones do you work in?',
    a: 'The working day in India overlaps UK and Western European mornings and US East Coast mornings. Replies come within 3 hours in the workday, and turnaround is counted in calendar hours, so a 48-hour edit is 48 hours whatever the time difference.',
  },
];

export default function WhatIsEchoPulseMediaPage() {
  const cases = CASES.map((c) => ({ ...c, study: getCaseStudy(c.slug) })).filter((c) => c.study);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'What Is EchoPulse Media?',
        description: DEFINITION,
        dateModified: LAST_VERIFIED_ISO,
        about: { '@id': `${SITE_URL}/#organization` },
        mainEntity: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: 'en',
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
        primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}/og-echopulse-media.png` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${PAGE_URL}#faq`,
        isPartOf: { '@id': `${PAGE_URL}#webpage` },
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'What is EchoPulse Media', item: PAGE_URL },
        ],
      },
    ],
  };

  return (
    <>
      <Nav />

      <main id="main" className="wi-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* ── 1. Definition first ───────────────────────────────────────── */}
        <section className="wi-hero">
          <nav aria-label="Breadcrumb" className="wi-crumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>What is EchoPulse Media</span>
          </nav>
          <p className="wi-eyebrow">Plain answer</p>
          <h1 className="wi-h1">What is EchoPulse Media?</h1>
          <p className="wi-lede">{DEFINITION}</p>
          <p className="wi-disambig">
            Not to be confused with the Echopulse thyroid treatment device made by Theraclion, the ECHOPulse
            echocardiogram research model, the EchoPulse heart diagnosis device from IIT (ISM) Dhanbad, the
            website echopulse.in, Rezono&apos;s EchoPulse BI tool, or EcoPulse in Austin, Texas. EchoPulse Media has
            no connection to any of them. Its only website is echopulse.media.
          </p>

          <div className="wi-status" role="status">
            <span className="wi-status-dot" aria-hidden="true" />
            <span><strong>Taking on new clients</strong> as of {LAST_VERIFIED}. {PROMISES.replies}.</span>
          </div>
          <div className="wi-cta-row">
            <ICPBookButton label={BOOK_CALL_LABEL} location="what_is_hero" accent={ACCENT} size="lg" fullWidthMobile />
            <Link href="/pricing" className="wi-text-link">See prices</Link>
          </div>
          <p className="wi-reassure">{BOOK_CALL_REASSURANCE}</p>

          <p className="wi-meta">Last verified: {LAST_VERIFIED}.</p>
        </section>

        {/* ── Facts ──────────────────────────────────────────────────────── */}
        <section className="wi-facts-sec" id="facts" aria-labelledby="facts-heading">
          <p className="wi-eyebrow">Facts</p>
          <h2 id="facts-heading" className="wi-h2">EchoPulse Media at a glance</h2>
          <table className="wi-table">
            <tbody>
              <tr><th scope="row">Name</th><td>EchoPulse Media</td></tr>
              <tr><th scope="row">Also written as</th><td>EchoPulse, Echo Pulse, Echo Pulse Media</td></tr>
              <tr><th scope="row">Legal form</th><td>Sole proprietorship. EchoPulse Media is the trading name of Lakshya Soni.</td></tr>
              <tr><th scope="row">Founder and owner</th><td><Link href="/about/lakshya-soni">Lakshya Soni</Link></td></tr>
              <tr><th scope="row">Founded</th><td>2025</td></tr>
              <tr><th scope="row">Based in</th><td>Bhopal, Madhya Pradesh, India. The team works remotely.</td></tr>
              <tr><th scope="row">Clients in</th><td>United States, United Kingdom, Canada, Australia, Western Europe and India</td></tr>
              <tr><th scope="row">Team</th><td>Lakshya Soni, founder. Shaurya, partner and design lead. Aiman, delivery.</td></tr>
              <tr><th scope="row">Services</th><td>Content and personal brand. Websites and funnels. Custom software and CRMs. AI and automation. Search and AI visibility.</td></tr>
              <tr>
                <th scope="row">Prices start at</th>
                <td>
                  {FREE_SAMPLE.priceLabel}: 2 edited videos. Then the {PILOT.priceLabel} Pilot, or monthly plans from {PRESENCE.priceLabel}. Custom builds are quoted on a call.{' '}
                  <Link href="/pricing">See prices</Link>
                </td>
              </tr>
              <tr><th scope="row">Status</th><td>Taking on new clients as of {LAST_VERIFIED}.</td></tr>
              <tr>
                <th scope="row">Book a call</th>
                <td>
                  <a href={staticBookingUrl('what_is_facts')} data-track-location="what_is_facts" target="_blank" rel="noopener noreferrer">Free 15-minute call with Lakshya</a>
                </td>
              </tr>
              <tr><th scope="row">Email</th><td><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></td></tr>
              <tr><th scope="row">Official website</th><td>echopulse.media. No other domain belongs to EchoPulse Media.</td></tr>
              <tr>
                <th scope="row">Official profiles</th>
                <td>
                  <a href="https://www.linkedin.com/in/lakshyasoni/" rel="me noopener noreferrer">Lakshya Soni on LinkedIn</a>,{' '}
                  <a href="https://x.com/Lakshya_Creates" rel="me noopener noreferrer">Lakshya Soni on X</a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ── 2. What we do ──────────────────────────────────────────────── */}
        <section className="wi-do" aria-labelledby="do-heading">
          <p className="wi-eyebrow">What we do</p>
          <h2 id="do-heading" className="wi-h2">Five areas, one team</h2>
          <p className="wi-intro">
            One team covers the work a growing business would otherwise split between a video editor, a web
            developer, an automation freelancer and an SEO contractor. You can start with one area and add the others.
          </p>
          <div className="wi-areas">
            {AREAS.map((a, i) => (
              <article key={a.key} className="wi-area">
                <span className="wi-area-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{a.title}</h3>
                <p className="wi-area-line">{a.line}</p>
                <ul>
                  {a.examples.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
                <div className="wi-area-links">
                  {a.links.map((l) => (
                    <Link key={l.href + l.label} href={l.href}>{l.label} <span aria-hidden="true">&rarr;</span></Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 5. Proof ───────────────────────────────────────────────────── */}
        <section className="wi-proof" aria-labelledby="proof-heading">
          <p className="wi-eyebrow">Proof</p>
          <h2 id="proof-heading" className="wi-h2">Five case studies you can check</h2>
          <p className="wi-intro">Each one names the client and says how the figure was measured. One client is never a typical result.</p>
          <ul className="wi-cases">
            {cases.map((c) => (
              <li key={c.slug}>
                <span className="wi-case-figure">{c.figure}</span>
                <span className="wi-case-text">{c.text}</span>
                <Link href={`/case-studies/${c.slug}`}>{c.label}</Link>
              </li>
            ))}
          </ul>
          <p className="wi-tools">
            <strong>An example of the custom tools EchoPulse builds:</strong> for the MagicBNB account, EchoPulse
            built a tracking dashboard that collects search, analytics, ads, Instagram and site behaviour data
            every day into one place, and an MCP server that lets an AI assistant read those numbers directly.
            The same approach applies to reporting and internal tools for other businesses.
          </p>
          <p className="wi-after-steps">
            All case studies are at <Link href="/case-studies">/case-studies</Link>, including what is still not working.
          </p>
        </section>

        {/* ── Verify ─────────────────────────────────────────────────────── */}
        <section className="wi-verify" id="verify" aria-labelledby="verify-heading">
          <p className="wi-eyebrow">Check it yourself</p>
          <h2 id="verify-heading" className="wi-h2">How to verify EchoPulse Media</h2>
          <p className="wi-intro">You do not have to take our word for it. Each item below is public.</p>
          <ol className="wi-verify-list">
            <li>
              Open the client sites:{' '}
              <a href="https://magicbnb.io" target="_blank" rel="noopener noreferrer">magicbnb.io</a>,{' '}
              <a href="https://whitesandbrights.com" target="_blank" rel="noopener noreferrer">whitesandbrights.com</a> and{' '}
              <a href="https://workingwithgod.live" target="_blank" rel="noopener noreferrer">workingwithgod.live</a>.
              Each one is live and matches its case study.
            </li>
            <li>
              <a href="https://play.google.com/store/apps/details?id=com.whitesandbrights.app" target="_blank" rel="noopener noreferrer">Install the Whites and Brights app from Google Play.</a>{' '}
              EchoPulse built it.
            </li>
            <li>
              <Link href="/case-studies/magicbnb-seo-aeo#export">See the Google Search Console screenshots behind the MagicBNB numbers.</Link>
            </li>
            <li>
              Check the founder: <Link href="/about/lakshya-soni">Lakshya Soni&apos;s page</Link> lists his background and his LinkedIn.
            </li>
            <li>
              <a href={staticBookingUrl('what_is_verify')} data-track-location="what_is_verify" target="_blank" rel="noopener noreferrer">Book a free 15-minute call</a>{' '}
              and ask anything. When a client agrees to speak on the record, we introduce you.
            </li>
          </ol>
        </section>

        {/* ── 3. How we work with you ────────────────────────────────────── */}
        <section className="wi-how" aria-labelledby="how-heading">
          <p className="wi-eyebrow">How we work with you</p>
          <h2 id="how-heading" className="wi-h2">Start small, then go monthly or build</h2>
          <ol className="wi-steps">
            {STEPS.map((s, i) => (
              <li key={s.name}>
                <span className="wi-step-num" aria-hidden="true">{i + 1}</span>
                <div>
                  <p className="wi-step-price">{s.price}</p>
                  <h3>{s.name}</h3>
                  <p>{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="wi-after-steps">
            Prices are flat USD worldwide. <Link href="/pricing">See what each plan includes</Link>.
          </p>

          <div className="wi-call">
            <h3>What happens on the 15-minute call</h3>
            <ul>
              <li>You talk to Lakshya, the founder, not a sales rep.</li>
              <li>He looks at your site and your last few posts and tells you the first three things he would fix.</li>
              <li>If a build or automation fits, you get a written scope, a fixed price and a delivery date afterwards. If it does not fit your stage, he says so.</li>
              <li>No pitch, and no obligation to buy anything.</li>
            </ul>
          </div>
        </section>

        {/* ── 4. Who it is for, and not for ──────────────────────────────── */}
        <section className="wi-who" aria-labelledby="who-heading">
          <p className="wi-eyebrow">Who it is for</p>
          <h2 id="who-heading" className="wi-h2">Founders and businesses of every kind</h2>
          <ul className="wi-tags" aria-label="Kinds of business EchoPulse works with">
            {FOR_TYPES.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p>
            The common thread: a business with a real offer that wants to grow, has no time to run the
            marketing and systems itself, and would rather have one team than four vendors. Five audiences
            have their own pages with plans and examples:
          </p>
          <ul className="wi-who-list">
            {icps.map((icp) => (
              <li key={icp.key}>
                <Link href={`/${icp.key}`}>{icp.name}</Link>
              </li>
            ))}
          </ul>

          <h3 className="wi-h3">Who it is not for</h3>
          <dl className="wi-not-list">
            {NOT_FOR.map((n) => (
              <div key={n.title}>
                <dt>{n.title}</dt>
                <dd>{n.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── 6. The team ────────────────────────────────────────────────── */}
        <section className="wi-team" aria-labelledby="team-heading">
          <p className="wi-eyebrow">The team</p>
          <h2 id="team-heading" className="wi-h2">Three people, no account managers</h2>
          <ul className="wi-people">
            <li>
              <span className="wi-person-name"><Link href="/about/lakshya-soni">Lakshya Soni</Link></span>
              <span className="wi-person-role">Founder. Strategy, editing, writing and code.</span>
              <span className="wi-person-note">Leads every account and reviews every deliverable before you see it.</span>
            </li>
            <li>
              <span className="wi-person-name">Shaurya</span>
              <span className="wi-person-role">Partner and design lead</span>
              <span className="wi-person-note">Leads design across content, websites and builds. Also a director of WNB Cleantech, the company behind Whites &amp; Brights, which is disclosed on those case studies.</span>
            </li>
            <li>
              <span className="wi-person-name">Aiman</span>
              <span className="wi-person-role">Delivery</span>
              <span className="wi-person-note">Leads delivery across every account.</span>
            </li>
          </ul>
        </section>

        {/* ── 7. FAQ ─────────────────────────────────────────────────────── */}
        <section className="wi-faq" aria-labelledby="faq-heading">
          <p className="wi-eyebrow">Questions</p>
          <h2 id="faq-heading" className="wi-h2">Questions about EchoPulse Media</h2>
          <dl className="wi-faq-list">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── 8. CTA ─────────────────────────────────────────────────────── */}
        <section className="wi-cta">
          <div className="wi-status wi-status-dark">
            <span className="wi-status-dot" aria-hidden="true" />
            <span><strong>Taking on new clients</strong></span>
          </div>
          <h2 className="wi-h2">Tell us where the business is stuck</h2>
          <p>Book a free 15-minute call and Lakshya will tell you the first three things he would fix, whether that is content, the website, a manual process or search.</p>
          <div className="wi-cta-row">
            <ICPBookButton label={BOOK_CALL_LABEL} location="what_is_page" accent={ACCENT} size="lg" fullWidthMobile />
            <Link href="/pricing" className="wi-text-link wi-text-link-dark">See prices</Link>
          </div>
          <p className="wi-reassure wi-reassure-dark">
            Prefer a direct link?{' '}
            <a href={staticBookingUrl('what_is_cta_link')} data-track-location="what_is_cta_link" rel="noopener noreferrer" target="_blank">Open the booking page</a>.
          </p>
        </section>

        <style>{`
          .wi-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; overflow-x: clip; }
          .wi-page > section { max-width: 960px; margin: 0 auto; padding: 64px 24px; border-top: 1px solid rgba(12,12,11,0.08); }
          .wi-page p, .wi-page li, .wi-page dd { line-height: 1.7; color: #4A4740; font-size: 16px; }
          .wi-page a { color: #0C0C0B; font-weight: 600; text-decoration: underline; text-decoration-color: ${ACCENT}; text-underline-offset: 3px; overflow-wrap: anywhere; }
          .wi-page a:hover { color: ${ACCENT}; }

          .wi-eyebrow { font-size: 10px !important; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #8A867D !important; margin: 0 0 12px; }
          .wi-h1 { font-size: clamp(36px, 5.4vw, 62px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.02; margin: 0 0 24px; }
          .wi-h2 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; margin: 0 0 20px; }
          .wi-h3 { font-size: 21px; font-weight: 800; letter-spacing: -0.02em; margin: 44px 0 16px; }
          .wi-intro { max-width: 700px; margin: 0 0 28px; }

          .wi-hero { padding-top: 140px !important; border-top: none !important; }
          .wi-crumb { display: flex; flex-wrap: wrap; gap: 10px; font-size: 13px; color: #8A867D; margin-bottom: 32px; }
          .wi-crumb { align-items: center; }
          .wi-crumb a { color: #6E6B63; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; min-height: 44px; margin: -12px 0; }
          .wi-lede { font-size: 19px !important; color: #2E2C28 !important; max-width: 780px; margin: 0 0 28px; }
          .wi-disambig { max-width: 780px; margin: 0 0 24px; padding-left: 14px; border-left: 3px solid ${ACCENT}; font-size: 14.5px !important; color: #4A4740 !important; line-height: 1.65; }
          .wi-meta { font-size: 13.5px !important; color: #8A867D !important; margin: 28px 0 0; }
          .wi-meta a { font-weight: 500; color: #6E6B63; }

          .wi-status { display: inline-flex; align-items: center; gap: 10px; padding: 9px 16px; border-radius: 999px; background: rgba(22,163,74,0.1); border: 1px solid rgba(22,163,74,0.28); font-size: 14px; color: #14532D; line-height: 1.45; margin: 0 0 20px; }
          .wi-status strong { color: #14532D; font-weight: 800; }
          .wi-status-dot { flex: 0 0 9px; width: 9px; height: 9px; border-radius: 50%; background: #16A34A; box-shadow: 0 0 0 4px rgba(22,163,74,0.18); }
          .wi-status-dark { background: rgba(74,222,128,0.12); border-color: rgba(74,222,128,0.35); color: #BBF7D0; }
          .wi-status-dark strong { color: #BBF7D0; }
          .wi-status-dark .wi-status-dot { background: #4ADE80; }

          .wi-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 26px; }
          .wi-text-link { display: inline-flex; align-items: center; min-height: 44px; font-size: 15px; }
          .wi-reassure { font-size: 14px !important; color: #6E6B63 !important; margin: 12px 0 0; }

          .wi-areas { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
          .wi-area { position: relative; padding: 26px 24px 18px; border: 1px solid rgba(12,12,11,0.1); border-radius: 20px; background: rgba(255,255,255,0.5); display: flex; flex-direction: column; }
          .wi-area:last-child:nth-child(odd) { grid-column: 1 / -1; }
          .wi-area-num { font-size: 12px; font-weight: 800; letter-spacing: 1.5px; color: ${ACCENT}; }
          .wi-area h3 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin: 6px 0 8px; color: #0C0C0B; }
          .wi-area-line { margin: 0 0 12px; font-size: 15px !important; color: #2E2C28 !important; }
          .wi-area ul { margin: 0 0 14px; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
          .wi-area li { position: relative; padding-left: 18px; font-size: 15px; line-height: 1.55; }
          .wi-area li::before { content: ''; position: absolute; left: 0; top: 0.6em; width: 7px; height: 7px; border-radius: 2px; background: ${ACCENT}; }
          .wi-area-links { margin-top: auto; display: flex; flex-wrap: wrap; gap: 0 20px; border-top: 1px solid rgba(12,12,11,0.08); padding-top: 4px; }
          .wi-area-links a { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; font-size: 14.5px; text-decoration: none; }

          .wi-steps { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; counter-reset: none; }
          .wi-steps li { position: relative; display: flex; flex-direction: column; gap: 14px; padding: 22px 20px; border: 1px solid rgba(12,12,11,0.1); border-radius: 18px; background: rgba(255,255,255,0.45); }
          .wi-steps li:last-child { background: #0C0C0B; border-color: #0C0C0B; }
          .wi-steps li:last-child h3, .wi-steps li:last-child .wi-step-price { color: #F2EEE7 !important; }
          .wi-steps li:last-child p:not(.wi-step-price) { color: rgba(242,238,231,0.75); }
          .wi-steps li:last-child .wi-step-num { background: ${ACCENT}; }
          .wi-steps h3 { font-size: 16px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 6px; color: #0C0C0B; line-height: 1.3; }
          .wi-steps p { margin: 0; font-size: 14.5px !important; line-height: 1.6; }
          .wi-step-price { font-size: 22px !important; font-weight: 900; letter-spacing: -0.03em; color: #0C0C0B !important; line-height: 1.15 !important; margin: 0 0 6px !important; }
          .wi-step-num { width: 32px; height: 32px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; }
          .wi-after-steps { margin: 18px 0 0; font-size: 15px !important; }

          .wi-call { margin-top: 32px; padding: 24px; border-radius: 18px; border-left: 4px solid ${ACCENT}; background: rgba(255,255,255,0.6); }
          .wi-call h3 { font-size: 18px; font-weight: 800; margin: 0 0 10px; color: #0C0C0B; }
          .wi-call ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
          .wi-call li { position: relative; padding-left: 18px; font-size: 15.5px; }
          .wi-call li::before { content: ''; position: absolute; left: 0; top: 0.7em; width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT}; }

          .wi-tags { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-wrap: wrap; gap: 8px; }
          .wi-tags li { padding: 7px 14px; border-radius: 999px; background: #0C0C0B; color: #F2EEE7; font-size: 14px; font-weight: 600; line-height: 1.4; }
          .wi-who-list { list-style: none; padding: 0; margin: 4px 0 0; display: flex; flex-wrap: wrap; gap: 10px; }
          .wi-who-list a { display: inline-flex; align-items: center; min-height: 44px; padding: 8px 18px; border: 1px solid rgba(12,12,11,0.14); border-radius: 999px; font-size: 14.5px; text-decoration: none; background: rgba(255,255,255,0.5); }
          .wi-who-list a:hover { background: #0C0C0B; color: #F2EEE7; border-color: #0C0C0B; }

          .wi-not-list { margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 36px; }
          .wi-not-list > div { padding-left: 16px; border-left: 2px solid rgba(12,12,11,0.15); }
          .wi-not-list dt { font-size: 16.5px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 4px; }
          .wi-not-list dd { margin: 0; font-size: 15px !important; }

          .wi-cases { list-style: none; padding: 0; margin: 0 0 20px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
          .wi-cases li:last-child:nth-child(odd) { grid-column: 1 / -1; }
          .wi-cases li { display: flex; flex-direction: column; gap: 10px; padding: 24px; border-radius: 20px; background: #0C0C0B; }
          .wi-case-figure { font-size: clamp(26px, 3.2vw, 34px); font-weight: 900; letter-spacing: -0.03em; color: #F2EEE7; line-height: 1.1; }
          .wi-case-text { font-size: 14.5px; color: rgba(242,238,231,0.78); line-height: 1.6; }
          .wi-page .wi-cases a { color: #F2EEE7; display: inline-flex; align-items: center; min-height: 44px; margin-top: auto; font-size: 14.5px; }
          .wi-page .wi-cases a:hover { color: ${ACCENT}; }
          .wi-tools { max-width: 780px; padding: 18px 20px; border-radius: 16px; background: rgba(255,255,255,0.55); border: 1px solid rgba(12,12,11,0.08); margin: 0 0 4px; font-size: 15.5px !important; }
          .wi-tools strong { color: #0C0C0B; }

          .wi-people { list-style: none; padding: 0; margin: 0 0 28px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
          .wi-people li { display: flex; flex-direction: column; gap: 4px; padding: 22px; border: 1px solid rgba(12,12,11,0.1); border-radius: 18px; background: rgba(255,255,255,0.5); }
          .wi-person-name { font-size: 19px; font-weight: 800; color: #0C0C0B; letter-spacing: -0.02em; }
          .wi-person-name a { display: inline-flex; align-items: center; min-height: 44px; margin: -10px 0; }
          .wi-person-role { font-size: 14.5px; font-weight: 600; color: #2E2C28; }
          .wi-person-note { font-size: 14.5px; color: #4A4740; line-height: 1.55; }
          .wi-table { width: 100%; border-collapse: collapse; border-top: 1px solid rgba(12,12,11,0.12); }
          .wi-table th, .wi-table td { text-align: left; vertical-align: top; padding: 14px 0; border-bottom: 1px solid rgba(12,12,11,0.08); font-size: 15.5px; line-height: 1.65; }
          .wi-table th { width: 190px; padding-right: 24px; font-weight: 700; color: #0C0C0B; }
          .wi-table td { color: #4A4740; overflow-wrap: anywhere; }

          .wi-verify-list { margin: 0; padding: 0; list-style: none; counter-reset: verify; display: flex; flex-direction: column; gap: 10px; max-width: 780px; }
          .wi-verify-list li { counter-increment: verify; position: relative; padding: 16px 18px 16px 62px; border: 1px solid rgba(12,12,11,0.1); border-radius: 16px; background: rgba(255,255,255,0.5); font-size: 15.5px; }
          .wi-verify-list li::before { content: counter(verify); position: absolute; left: 18px; top: 16px; width: 30px; height: 30px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; }

          .wi-faq-list { margin: 0; }
          .wi-faq-list > div { padding: 20px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
          .wi-faq-list > div:last-child { border-bottom: none; }
          .wi-faq-list dt { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 6px; }
          .wi-faq-list dd { margin: 0; }

          .wi-page > .wi-cta { max-width: none; background: #0C0C0B; border-top: none; padding: 80px max(24px, calc((100% - 912px) / 2)) 120px; }
          .wi-cta .wi-h2 { color: #F2EEE7; }
          .wi-cta p { max-width: 640px; color: rgba(242,238,231,0.75); margin: 0 0 24px; }
          .wi-page .wi-text-link-dark, .wi-page .wi-reassure-dark a { color: #F2EEE7; }
          .wi-page .wi-reassure-dark { color: rgba(242,238,231,0.6) !important; margin: 16px 0 0; }

          @media (max-width: 860px) {
            .wi-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .wi-people { grid-template-columns: 1fr; }
          }
          @media (max-width: 760px) {
            .wi-page > section { padding: 48px 16px; }
            .wi-hero { padding-top: 110px !important; }
            .wi-lede { font-size: 17.5px !important; }
            .wi-areas, .wi-not-list, .wi-cases, .wi-steps { grid-template-columns: 1fr; }
            .wi-area:last-child:nth-child(odd) { grid-column: auto; }
            .wi-steps li { flex-direction: row; align-items: flex-start; }
            .wi-step-num { flex: 0 0 32px; }
            .wi-status { border-radius: 16px; align-items: flex-start; }
            .wi-status-dot { margin-top: 6px; }
            .wi-table, .wi-table tbody, .wi-table tr, .wi-table th, .wi-table td { display: block; width: 100%; }
            .wi-table tr { padding: 14px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
            .wi-table th, .wi-table td { padding: 0; border-bottom: none; }
            .wi-table th { font-size: 12px; letter-spacing: 0.6px; text-transform: uppercase; color: #8A867D; margin-bottom: 2px; }
            .wi-table td { padding-bottom: 0; }
            .wi-table a { display: inline-block; padding: 10px 0; margin: -10px 0; }
            .wi-verify-list li { padding: 14px 14px 14px 56px; }
            .wi-verify-list li::before { left: 14px; top: 14px; }
            .wi-cases li:last-child:nth-child(odd) { grid-column: auto; }
            .wi-cta-row { align-items: stretch; flex-direction: column; gap: 6px; }
            .wi-text-link { justify-content: center; }
            .wi-page > .wi-cta { padding: 56px 16px 112px; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
