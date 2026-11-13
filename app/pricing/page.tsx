import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import { icps } from '@/lib/icpData';
import { getCaseStudy } from '@/lib/caseStudyData';
import { BOOK_CALL_LABEL, BOOK_CALL_REASSURANCE } from '@/lib/links';
import {
  FREE_SAMPLE,
  PILOT,
  PRESENCE,
  GROWTH,
  PRICING_CARDS,
  PROMISES,
  PRICE_LADDER_SENTENCE,
  pricingOffers,
  type Plan,
} from '@/lib/pricing';

/**
 * /pricing: the full price page.
 *
 * The homepage has a pricing section, but a section cannot rank for "echopulse
 * media pricing" or be linked from an email as the place the numbers live. This
 * page exists so there is one URL that states every price, what each buys,
 * what is left out, and how billing works. Every number comes from
 * lib/pricing.ts; nothing is typed here that would drift when the ladder
 * changes.
 *
 * Server component, plain CSS. The FAQ renders every answer in the HTML, so
 * the FAQPage schema below describes what the page actually contains.
 */

const SITE_URL = 'https://echopulse.media';
const ACCENT = '#E8541A';

export const metadata: Metadata = {
  title: { absolute: 'EchoPulse Media Pricing: $299 Pilot, $399 and $1,997 a Month' },
  // 147 chars.
  description:
    'Every EchoPulse Media price on one page. Free sample, $299 14-day Pilot, $399 a month Presence Engine, $1,997 a month Growth. Month-to-month, USD.',
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: 'EchoPulse Media Pricing: $299 Pilot, $399 and $1,997 a Month',
    description:
      'Free sample, $299 Pilot, $399 a month Presence Engine, $1,997 a month Growth. What each includes, what it does not, and how billing works.',
    url: `${SITE_URL}/pricing`,
    type: 'website',
  },
};

/**
 * Comparison rows. The cell text is written to match each plan's `scope` in
 * lib/pricing.ts line for line. If a scope line changes there, change the
 * matching cell here; the plan column order is FREE, PILOT, PRESENCE, GROWTH.
 */
const COMPARE: { label: string; cells: [string, string, string, string] }[] = [
  { label: 'Price', cells: [FREE_SAMPLE.priceLabel, PILOT.priceLabel, PRESENCE.priceLabel, GROWTH.priceLabel] },
  { label: 'Billing', cells: ['No card, no call', 'One-off, 14 days', 'Monthly, cancel with 14 days notice', 'Monthly, cancel with 14 days notice'] },
  { label: 'Strategy calls', cells: ['None', '60-minute onboarding session, recorded', '20 to 30 minutes every week', 'Onboarding session, then monthly, plus a quarterly brief refresh'] },
  { label: 'Short-form video edits', cells: ['2', '5', '8 to 9 a month, plus up to 5 extra clips from existing footage', '12 edits plus 12 clips a month'] },
  { label: 'Long-form video edits', cells: ['None', 'None', 'None', '2 a month (YouTube, podcast, listing tours)'] },
  { label: 'Photo and carousel posts', cells: ['None', '3', '8 a month', '20 social posts a month across platforms'] },
  { label: 'Long-form SEO blogs', cells: ['None', '1 (1,500 words, sourced)', 'None', '4 a month (1,500 to 2,500 words, sourced)'] },
  { label: 'Ad creatives', cells: ['None', 'None', 'None', '6 a month (4 static, 2 video)'] },
  { label: 'Website', cells: ['None', 'None', 'Free tune-up in month one, then ongoing upgrades', 'Rebuilt in month one, tuned every month after'] },
  { label: 'Search and AI visibility', cells: ['None', 'Content audit and 30-day plan', 'Pages, Google Business Profile and structured data', 'Funnel optimization with conversion tracking'] },
  { label: 'Planning', cells: ['None', '30-day plan', 'Monthly calendar, weekly shot list, posting plan', '30-day content calendar, monthly performance review'] },
  { label: 'Turnaround', cells: ['48 hours', '48 hours per deliverable', '48 hours per deliverable', '48 hours per deliverable'] },
  { label: 'Replies', cells: ['Email', 'Within 3 hours in the workday', 'Within 3 hours in the workday', 'Within 3 hours in the workday'] },
  { label: 'You keep the files', cells: ['Yes', 'Yes', 'Yes', 'Yes'] },
  { label: 'Extras', cells: ['None', 'None', 'None', '20% off any custom app or software build'] },
];

const NOT_INCLUDED: { title: string; body: string }[] = [
  { title: 'Ad spend', body: 'We make the creative. The media budget is paid by you, directly to Meta, Google or TikTok. We never hold or mark up ad money.' },
  { title: 'Filming on location', body: 'We send shot lists and get on a call while you film. We do not fly a crew to you. If you need one, we can recommend local videographers and we will brief them.' },
  { title: 'Paid tools and licences', body: 'Your domain, hosting, email platform, CRM, scheduling tool, premium fonts and any stock footage beyond the standard libraries are billed to you at cost by the vendor.' },
  { title: 'Community management', body: 'Replying to comments and DMs on your behalf is not in any plan. Automations that route them to you are, on Growth.' },
  { title: 'Long-form editing on Pilot and Presence', body: 'Those plans cover short-form. Long-form edits are in Growth, or can be ordered one at a time from the order page.' },
  { title: 'Custom software', body: 'Apps and software builds are quoted separately after a scoping call. Growth clients get 20% off the quote.' },
  { title: 'Results', body: 'We guarantee the output, the turnaround and the revisions. We do not guarantee leads, followers or sales, because too much of that sits with your offer and your market. Anyone who guarantees those is guessing.' },
];

/** Which ICP each plan usually suits, with a link to that audience page. */
const FIT: { icpKey: string; plan: string; why: string }[] = [
  { icpKey: 'founders', plan: `${PRESENCE.name} or ${GROWTH.name}`, why: 'Founders usually start on Presence Engine for a weekly video and post cadence, and move to Growth when blogs and ad creative need to run alongside.' },
  { icpKey: 'coaches', plan: `${PILOT.name}, then ${PRESENCE.name}`, why: 'Coaches have recorded sessions and workshops already. The Pilot turns one into five clips in 14 days, and Presence keeps that going every week.' },
  { icpKey: 'real-estate', plan: PRESENCE.name, why: 'Listing tours, walkthroughs and agent intros on a weekly rhythm, plus the Google Business Profile and site work that gets you found locally.' },
  { icpKey: 'business-owners', plan: PRESENCE.name, why: 'One person you can call every week who runs your content and keeps your website current, at a price that does not need a marketing budget line.' },
  { icpKey: 'dtc', plan: GROWTH.name, why: 'Ad creative volume is what DTC needs. Growth is the only plan with ad creatives in it, and the website and funnel work protects the click you paid for.' },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'What does EchoPulse Media cost?',
    a: PRICE_LADDER_SENTENCE,
  },
  {
    q: 'Do I have to start with the Pilot?',
    a: `No. The free sample is the lowest-risk way in: you send footage, we send back 2 edited videos within 48 hours, no card and no call. The ${PILOT.priceLabel} Pilot is for seeing real work across video, posts and a blog on your brand over 14 days before any monthly plan. You can also go straight to ${PRESENCE.name} or ${GROWTH.name} after a strategy call.`,
  },
  {
    q: 'Is there a contract or a minimum term?',
    a: `${PROMISES.noContract} Both monthly plans are billed in advance each month. To cancel, send written notice 14 days before your next billing date and the plan ends there. The Pilot is a one-off payment with nothing recurring behind it.`,
  },
  {
    q: 'What currency are prices in, and do they change by country?',
    a: 'All prices are in US dollars and are the same everywhere. Clients in the UK, Canada, Australia and the EU pay the USD amount; your card issuer converts it at its rate. Prices shown do not include any sales tax or VAT that your country requires you to self-account for.',
  },
  {
    q: 'How do I pay?',
    a: 'By card, through Razorpay or Dodo Payments depending on how you check out. Card details go to the processor, never to us. Monthly plans are charged on the same date each month. We can invoice for bank transfer on request.',
  },
  {
    q: 'What if I do not like an edit?',
    a: `${PROMISES.revisions}. Revisions within the scope of the plan are unlimited; we keep working on a deliverable until you would publish it. Changing the brief after the edit is done, or adding new footage, is a new deliverable rather than a revision.`,
  },
  {
    q: 'Who owns the content you make?',
    a: `${PROMISES.ownership}. Once an invoice is paid, the finished files are yours to use anywhere, forever. We keep the right to show the work in our portfolio unless you ask us not to.`,
  },
  {
    q: 'Can I buy a single edit without a plan?',
    a: 'Yes. The order page sells one-off edits: reels, long-form YouTube, podcast episodes and repurposing, each at a fixed price with no retainer. It is the right option if you have one project rather than a monthly need.',
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  const dark = plan.featured === true;
  return (
    <article className={`pr-card${dark ? ' pr-card-dark' : ''}`} aria-labelledby={`plan-${plan.key}`}>
      <p className="pr-badge">{plan.badge}</p>
      <h3 id={`plan-${plan.key}`} className="pr-card-name">{plan.name}</h3>
      <p className="pr-price">
        <span className="pr-price-num">{plan.priceLabel}</span>
        <span className="pr-price-per">{plan.per}</span>
      </p>
      <p className="pr-tagline">{plan.tagline}</p>
      <ul className="pr-scope">
        {plan.scope.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="pr-card-cta">
        <ICPBookButton
          label={plan.key === 'pilot' ? plan.cta : BOOK_CALL_LABEL}
          location={`pricing_page_${plan.key}`}
          accent={ACCENT}
          variant={dark ? 'light' : 'solid'}
          fullWidthMobile
        />
      </div>
    </article>
  );
}

export default function PricingPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/pricing#webpage`,
        url: `${SITE_URL}/pricing`,
        name: 'EchoPulse Media Pricing',
        description: metadata.description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        mainEntity: { '@id': `${SITE_URL}/pricing#catalog` },
        inLanguage: 'en',
      },
      {
        '@type': 'OfferCatalog',
        '@id': `${SITE_URL}/pricing#catalog`,
        name: 'EchoPulse Media plans',
        url: `${SITE_URL}/pricing`,
        itemListElement: pricingOffers().map((offer) => ({
          ...offer,
          url: `${SITE_URL}/pricing`,
          offeredBy: { '@id': `${SITE_URL}/#organization` },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/pricing#faq`,
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/pricing#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${SITE_URL}/pricing` },
        ],
      },
    ],
  };

  const plans = [FREE_SAMPLE, ...PRICING_CARDS];
  const proofMetrics = (getCaseStudy('magicbnb-seo-aeo')?.heroMetrics ?? []).slice(0, 3);

  return (
    <>
      <Nav />

      <main id="main" className="pr-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="pr-hero">
          <nav aria-label="Breadcrumb" className="pr-crumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Pricing</span>
          </nav>
          <p className="pr-eyebrow">Pricing</p>
          <h1 className="pr-h1">
            Four steps, one price each.
            <span className="accent"> Nothing hidden.</span>
          </h1>
          <p className="pr-lede">{PRICE_LADDER_SENTENCE}</p>
          <ul className="pr-promises" aria-label="What every plan includes">
            <li>{PROMISES.replies}</li>
            <li>{PROMISES.turnaround}</li>
            <li>{PROMISES.revisions}</li>
            <li>{PROMISES.ownership}</li>
          </ul>
        </section>

        {/* ── The ladder ─────────────────────────────────────────────────── */}
        <section className="pr-ladder" aria-labelledby="ladder-heading">
          <p className="pr-eyebrow">How it works</p>
          <h2 id="ladder-heading" className="pr-h2">Start free. Then a Pilot. Then monthly.</h2>
          <ol className="pr-steps">
            <li>
              <span className="pr-step-num">1</span>
              <div>
                <h3>{FREE_SAMPLE.name}: {FREE_SAMPLE.priceLabel}</h3>
                <p>{FREE_SAMPLE.tagline} You see how we cut before anyone talks about money.</p>
              </div>
            </li>
            <li>
              <span className="pr-step-num">2</span>
              <div>
                <h3>{PILOT.name}: {PILOT.priceLabel}, {PILOT.per}</h3>
                <p>{PILOT.tagline} One payment, a strategy session, real deliverables, and a 30-day plan you keep either way.</p>
              </div>
            </li>
            <li>
              <span className="pr-step-num">3</span>
              <div>
                <h3>{PRESENCE.name}: {PRESENCE.priceLabel}{PRESENCE.per}</h3>
                <p>{PRESENCE.tagline} The plan most clients run on.</p>
              </div>
            </li>
            <li>
              <span className="pr-step-num">4</span>
              <div>
                <h3>{GROWTH.name}: {GROWTH.priceLabel}{GROWTH.per}</h3>
                <p>{GROWTH.tagline} Video, posts, blogs, ads, website and funnel, one team.</p>
              </div>
            </li>
          </ol>
        </section>

        {/* ── Free sample block ──────────────────────────────────────────── */}
        <section className="pr-free" aria-labelledby="free-heading">
          <div className="pr-free-inner">
            <p className="pr-badge">{FREE_SAMPLE.badge}</p>
            <h2 id="free-heading" className="pr-h2">{FREE_SAMPLE.name}. {FREE_SAMPLE.priceLabel}, {FREE_SAMPLE.per}.</h2>
            <p className="pr-free-tag">{FREE_SAMPLE.tagline}</p>
            <ul className="pr-scope">
              {FREE_SAMPLE.scope.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="pr-card-cta">
              <ICPBookButton label={FREE_SAMPLE.cta} location="pricing_page_free" accent={ACCENT} size="lg" fullWidthMobile />
              <p className="pr-reassure">Tell us on the call where the footage is, or email it. No card is asked for at any point.</p>
            </div>
          </div>
        </section>

        {/* ── Plan cards ─────────────────────────────────────────────────── */}
        <section className="pr-plans" aria-labelledby="plans-heading">
          <p className="pr-eyebrow">Paid plans</p>
          <h2 id="plans-heading" className="pr-h2">What each plan buys</h2>
          <div className="pr-cards">
            {PRICING_CARDS.map((plan) => (
              <PlanCard key={plan.key} plan={plan} />
            ))}
          </div>
        </section>

        {/* ── Proof strip: figures read from the case study data ─────────── */}
        {proofMetrics.length > 0 && (
          <section className="pr-proof" aria-label="Proof from a client engagement">
            <ul className="pr-proof-list">
              {proofMetrics.map((m) => (
                <li key={m.label} className="pr-proof-item">
                  <span className="pr-proof-val">{m.value}</span>
                  <span className="pr-proof-label">{m.label}</span>
                </li>
              ))}
            </ul>
            <Link href="/case-studies/magicbnb-seo-aeo" className="pr-proof-link">See the MagicBNB case study</Link>
          </section>
        )}

        {/* ── Comparison table ───────────────────────────────────────────── */}
        <section className="pr-compare" aria-labelledby="compare-heading">
          <p className="pr-eyebrow">Side by side</p>
          <h2 id="compare-heading" className="pr-h2">Plan by plan</h2>
          <div className="pr-table-wrap">
            <table className="pr-table">
              <thead>
                <tr>
                  <th scope="col">What you get</th>
                  {plans.map((p) => (
                    <th scope="col" key={p.key}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.cells.map((cell, i) => (
                      <td key={plans[i].key} data-plan={plans[i].name}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Not included ───────────────────────────────────────────────── */}
        <section className="pr-not" aria-labelledby="not-heading">
          <p className="pr-eyebrow">Read this before you buy</p>
          <h2 id="not-heading" className="pr-h2">What is not included</h2>
          <dl className="pr-not-list">
            {NOT_INCLUDED.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Billing ────────────────────────────────────────────────────── */}
        <section className="pr-billing" aria-labelledby="billing-heading">
          <p className="pr-eyebrow">Billing</p>
          <h2 id="billing-heading" className="pr-h2">How billing works</h2>
          <ul className="pr-billing-list">
            <li><strong>Month-to-month.</strong> {PROMISES.noContract} Monthly plans are charged in advance on the same date each month.</li>
            <li><strong>14 days notice.</strong> To cancel, send written notice 14 days before the next billing date. The current month is not refunded, and the work for it is finished.</li>
            <li><strong>Card, through Razorpay or Dodo Payments.</strong> Your card details go to the processor. We never see them. Bank transfer is available on request for monthly plans.</li>
            <li><strong>USD, worldwide.</strong> One price everywhere, in US dollars. Your bank converts at its rate. Taxes your country requires you to self-account for are not included.</li>
            <li><strong>Work starts when payment clears.</strong> The 48-hour turnaround on each deliverable starts when we have the footage or brief it needs.</li>
            <li><strong>The Pilot is one payment.</strong> Nothing recurs after it unless you choose a monthly plan.</li>
          </ul>
          <p className="pr-terms-note">
            The binding version of all of this is in the <Link href="/terms">Terms of Service</Link>.
          </p>
        </section>

        {/* ── Who each plan fits ─────────────────────────────────────────── */}
        <section className="pr-fit" aria-labelledby="fit-heading">
          <p className="pr-eyebrow">Which plan</p>
          <h2 id="fit-heading" className="pr-h2">Who each plan fits</h2>
          <ul className="pr-fit-list">
            {FIT.map((f) => {
              const icp = icps.find((i) => i.key === f.icpKey);
              if (!icp) return null;
              return (
                <li key={f.icpKey}>
                  <h3><Link href={`/${icp.key}`}>{icp.name}</Link></h3>
                  <p className="pr-fit-plan">{f.plan}</p>
                  <p>{f.why}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────────── */}
        <section className="pr-faq" aria-labelledby="faq-heading">
          <p className="pr-eyebrow">Questions</p>
          <h2 id="faq-heading" className="pr-h2">Pricing questions, answered</h2>
          <dl className="pr-faq-list">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>
                  {f.a}
                  {f.q.startsWith('Can I buy a single edit') && (
                    <>
                      {' '}
                      Ask on the call and we will quote it.
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <section className="pr-cta">
          <h2 className="pr-h2">Not sure which one? Ask.</h2>
          <p>
            Thirty minutes. We look at what you already have, tell you which step makes sense,
            and if the answer is &quot;none of them yet&quot; we say so.
          </p>
          <div className="pr-card-cta">
            <ICPBookButton label={BOOK_CALL_LABEL} location="pricing_page_final" accent={ACCENT} size="lg" fullWidthMobile />
            <p className="pr-reassure">{BOOK_CALL_REASSURANCE}</p>
          </div>
        </section>

        <style>{`
          .pr-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; }
          .pr-page > section { max-width: 1040px; margin: 0 auto; padding: 64px 24px; border-top: 1px solid rgba(12,12,11,0.08); }
          .pr-page p, .pr-page li, .pr-page dd { line-height: 1.7; color: #4A4740; font-size: 16px; }
          .pr-page a { color: #0C0C0B; font-weight: 600; text-decoration: underline; text-decoration-color: ${ACCENT}; text-underline-offset: 3px; }
          .pr-page a:hover { color: ${ACCENT}; }
          .pr-page strong { color: #0C0C0B; }
          .accent { color: ${ACCENT}; }

          .pr-eyebrow { font-size: 10px !important; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #A8A49B !important; margin: 0 0 12px; }
          .pr-h1 { font-size: clamp(36px, 5.4vw, 64px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.02; margin: 0 0 24px; max-width: 820px; }
          .pr-h2 { font-size: clamp(26px, 3.4vw, 40px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; margin: 0 0 28px; }
          .pr-badge { font-size: 11px !important; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${ACCENT} !important; margin: 0 0 10px; }

          /* Hero */
          .pr-hero { padding-top: 140px !important; border-top: none !important; }
          .pr-crumb { display: flex; gap: 10px; font-size: 13px; color: #A8A49B; margin-bottom: 32px; }
          .pr-crumb a { color: #6E6B63; text-decoration: none; font-weight: 500; }
          .pr-lede { font-size: 19px !important; color: #2E2C28 !important; max-width: 720px; margin: 0 0 28px; }
          .pr-promises { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 10px; }
          .pr-promises li { font-size: 13.5px !important; font-weight: 600; color: #0C0C0B; padding: 8px 14px; border: 1px solid rgba(12,12,11,0.14); border-radius: 999px; background: rgba(255,255,255,0.5); }

          /* Ladder */
          .pr-steps { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .pr-steps li { display: flex; gap: 16px; padding: 22px; border: 1px solid rgba(12,12,11,0.1); border-radius: 18px; background: rgba(255,255,255,0.45); }
          .pr-steps h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 6px; color: #0C0C0B; }
          .pr-steps p { margin: 0; font-size: 15px !important; }
          .pr-step-num { flex: 0 0 36px; width: 36px; height: 36px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; font-weight: 800; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }

          /* Free block */
          .pr-free-inner { background: #0C0C0B; color: #F2EEE7; border-radius: 24px; padding: 48px; }
          .pr-free-inner .pr-h2 { color: #F2EEE7; }
          .pr-free-inner p, .pr-free-inner li { color: rgba(242,238,231,0.78); }
          .pr-free-tag { font-size: 18px !important; margin: 0 0 20px; }
          .pr-free-inner .pr-scope li::before { color: ${ACCENT}; }

          /* Cards */
          .pr-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: stretch; }
          .pr-card { display: flex; flex-direction: column; padding: 30px 28px; border-radius: 22px; border: 1px solid rgba(12,12,11,0.12); background: rgba(255,255,255,0.55); }
          .pr-card-dark { background: #0C0C0B; color: #F2EEE7; border-color: #0C0C0B; }
          .pr-card-dark p, .pr-card-dark li { color: rgba(242,238,231,0.8); }
          .pr-card-name { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; }
          .pr-card-dark .pr-card-name { color: #F2EEE7; }
          .pr-price { margin: 0 0 12px; display: flex; flex-direction: column; gap: 2px; }
          .pr-price-num { font-size: 40px; font-weight: 900; letter-spacing: -0.04em; color: #0C0C0B; line-height: 1; }
          .pr-card-dark .pr-price-num { color: #F2EEE7; }
          .pr-price-per { font-size: 13px; color: #A8A49B; }
          .pr-tagline { font-size: 15px !important; margin: 0 0 18px; }
          .pr-scope { list-style: none; padding: 0; margin: 0 0 24px; display: flex; flex-direction: column; gap: 9px; }
          .pr-scope li { position: relative; padding-left: 22px; font-size: 14.5px !important; line-height: 1.55; }
          .pr-scope li::before { content: "\\2713"; position: absolute; left: 0; top: 0; color: ${ACCENT}; font-weight: 800; }
          .pr-card-cta { margin-top: auto; display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
          .pr-reassure { font-size: 13.5px !important; margin: 0; }
          .pr-order-note { margin: 28px 0 0; font-size: 15px !important; }

          /* Table */
          .pr-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .pr-table { width: 100%; min-width: 760px; border-collapse: collapse; text-align: left; font-size: 14.5px; }
          .pr-table th, .pr-table td { padding: 12px 14px 12px 0; border-bottom: 1px solid rgba(12,12,11,0.08); vertical-align: top; line-height: 1.5; color: #4A4740; }
          .pr-table thead th { font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: #0C0C0B; font-weight: 800; }
          .pr-table tbody th { color: #0C0C0B; font-weight: 700; width: 170px; }

          /* Not included */
          .pr-not-list { margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px 36px; }
          .pr-not-list dt { font-size: 16.5px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 6px; }
          .pr-not-list dd { margin: 0; font-size: 15px !important; }

          /* Billing */
          .pr-billing-list { padding-left: 20px; margin: 0 0 20px; display: flex; flex-direction: column; gap: 10px; max-width: 760px; }
          .pr-terms-note { font-size: 14.5px !important; margin: 0; }

          /* Fit */
          .pr-fit-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .pr-fit-list li { padding: 22px; border: 1px solid rgba(12,12,11,0.1); border-radius: 18px; background: rgba(255,255,255,0.45); }
          .pr-fit-list h3 { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 4px; }
          .pr-fit-list h3 a { text-decoration: none; }
          .pr-fit-plan { font-size: 13px !important; font-weight: 700; color: ${ACCENT} !important; margin: 0 0 10px; }
          .pr-fit-list p { margin: 0; font-size: 15px !important; }

          /* FAQ */
          .pr-faq-list { margin: 0; max-width: 820px; }
          .pr-faq-list > div { padding: 22px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
          .pr-faq-list > div:last-child { border-bottom: none; }
          .pr-faq-list dt { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; }
          .pr-faq-list dd { margin: 0; }

          /* Proof strip */
          .pr-proof { padding-top: 0 !important; border-top: none !important; }
          .pr-proof-list { list-style: none; margin: 0 0 16px; padding: 20px 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; border: 1px solid rgba(12,12,11,0.12); border-radius: 16px; background: #F2EEE7; }
          .pr-proof-item { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
          .pr-proof-val { font-size: clamp(20px, 2.6vw, 28px); font-weight: 800; letter-spacing: -0.03em; color: #0C0C0B; overflow-wrap: anywhere; }
          .pr-proof-label { font-size: 13px; color: #6E6B63; line-height: 1.4; }
          .pr-proof-link { color: ${ACCENT}; font-weight: 700; font-size: 14px; text-decoration: none; }
          .pr-proof-link:hover { text-decoration: underline; }

          /* CTA */
          .pr-cta { padding-bottom: 128px !important; }
          .pr-cta p { max-width: 640px; }
          .pr-cta .pr-card-cta { margin-top: 24px; }

          @media (max-width: 900px) {
            .pr-cards { grid-template-columns: 1fr; }
            .pr-proof-list { grid-template-columns: 1fr; }
          }
          @media (max-width: 760px) {
            .pr-page > section { padding: 48px 20px; }
            .pr-hero { padding-top: 110px !important; }
            .pr-steps, .pr-not-list, .pr-fit-list { grid-template-columns: 1fr; }
            .pr-free-inner { padding: 32px 22px; }
            .pr-card-cta { align-items: stretch; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
