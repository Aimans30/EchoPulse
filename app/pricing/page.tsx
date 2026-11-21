import type { Metadata } from 'next';
import { ogImages } from '@/lib/ogImages';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import PlanButton from '@/components/PlanButton';
import Rise from '@/components/pricing/Rise';
import CompareSwitcher from '@/components/pricing/CompareSwitcher';
import BookCallButton from '@/components/pricing/BookCallButton';
import { icps } from '@/lib/icpData';
import { getCaseStudy } from '@/lib/caseStudyData';
import { BOOK_CALL_LABEL, BOOK_CALL_REASSURANCE, FREE_EDITS_URL, type BookablePlanKey } from '@/lib/links';
import {
  FREE_SAMPLE,
  PILOT,
  PRESENCE,
  GROWTH,
  PRICING_CARDS,
  VISIBLE_PLANS,
  PROMISES,
  PRICE_LADDER_SENTENCE,
  pricingOffers,
  type Plan,
  type PlanKey,
} from '@/lib/pricing';
import './pricing.css';

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
 * Reading order is the price ladder itself: free sample, Pilot, the two
 * monthly plans, then Custom. The ladder at the top, the free band, the cards
 * and the "what happens next" strip all follow that order.
 *
 * Server component. Client islands: the plan buttons (intake modal), the
 * phone comparison switcher, the reveal wrapper and the closing call button.
 * Styles live in ./pricing.css under the `ppg-` prefix. The FAQ renders every
 * answer in the HTML (native <details>), so the FAQPage schema below describes
 * what the page actually contains.
 */

const SITE_URL = 'https://echopulse.media';

export const metadata: Metadata = {
  title: { absolute: 'EchoPulse Media Pricing: $299 Pilot, $399 or $1,997 a Month' },
  description:
    'Every EchoPulse Media price for founders, coaches and business owners: 2 free edits, a $299 14-day Pilot, $399 a month Presence Engine, $1,997 a month Growth.',
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: 'EchoPulse Media Pricing: $299 Pilot, $399 and $1,997 a Month',
    description:
      'Free sample, $299 Pilot, $399 a month Presence Engine, $1,997 a month Growth. What each includes, what it does not, and how billing works.',
    url: `${SITE_URL}/pricing`,
    siteName: 'EchoPulse Media',
    type: 'website',
    images: ogImages('pricing'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EchoPulse Media Pricing: $299 Pilot, $399 and $1,997 a Month',
    description:
      'Free sample, $299 Pilot, $399 a month Presence Engine, $1,997 a month Growth. What each includes, what it does not, and how billing works.',
    images: ogImages('pricing'),
  },
};

/** The plans in the comparison table, in column order. */
const COMPARE_PLANS: Plan[] = [FREE_SAMPLE, PILOT, PRESENCE, GROWTH];

/**
 * Comparison rows. The cell text is written to match each plan's `scope` in
 * lib/pricing.ts line for line. If a scope line changes there, change the
 * matching cell here; the plan column order is COMPARE_PLANS above.
 */
const COMPARE: { label: string; cells: [string, string, string, string] }[] = [
  { label: 'Price', cells: [FREE_SAMPLE.priceLabel, PILOT.priceLabel, PRESENCE.priceLabel, GROWTH.priceLabel] },
  { label: 'Billing', cells: ['No card, no call', 'One-off, 14 days', 'Monthly, cancel with 14 days notice', 'Monthly, cancel with 14 days notice'] },
  { label: 'Strategy calls', cells: ['None', '60-minute onboarding session, recorded', '20 to 30 minutes every week', 'Onboarding session, then monthly, plus a quarterly brief refresh'] },
  { label: 'Short-form video edits', cells: ['2', '6', '8 to 9 a month, plus up to 5 extra clips from existing footage', '12 edits plus 12 clips a month'] },
  { label: 'Long-form video edits', cells: ['None', 'None', 'None', '2 a month (YouTube, podcast, listing tours)'] },
  { label: 'Photo and carousel posts', cells: ['None', '2', '8 a month', '20 social posts a month across platforms'] },
  { label: 'Long-form SEO blogs', cells: ['None', '1 (1,500 words, sourced)', 'None', '4 a month (1,500 to 2,500 words, sourced)'] },
  { label: 'Ad creatives', cells: ['None', 'None', 'None', '6 a month (4 static, 2 video)'] },
  { label: 'Website', cells: ['None', 'None', 'Free tune-up in month one, then ongoing upgrades', 'Rebuilt in month one, tuned every month after'] },
  { label: 'Search and AI visibility', cells: ['None', 'Content audit and 30-day plan', 'Pages, Google Business Profile and structured data', 'Funnel optimization with conversion tracking'] },
  { label: 'Planning', cells: ['None', '30-day plan', 'Monthly calendar, weekly shot list, posting plan', '30-day content calendar, monthly performance review'] },
  { label: 'Turnaround', cells: ['48 hours', '48 hours on short-form edits', '48 hours on short-form edits', '48 hours on short-form edits'] },
  { label: 'Replies', cells: ['Email', 'Within 3 hours in the workday', 'Within 3 hours in the workday', 'Within 3 hours in the workday'] },
  { label: 'You keep the files', cells: ['Yes', 'Yes', 'Yes', 'Yes'] },
  { label: 'Extras', cells: ['None', 'None', 'None', '20% off any custom app or software build'] },
];

const NOT_INCLUDED: { title: string; body: string }[] = [
  { title: 'Ad spend', body: 'We make the creative. The media budget is paid by you, directly to Meta, Google or TikTok. We never hold or mark up ad money.' },
  { title: 'Filming on location', body: 'We send shot lists and get on a call while you film. We do not fly a crew to you. If you need one, we can recommend local videographers and we will brief them.' },
  { title: 'Paid tools and licences', body: 'Your domain, hosting, email platform, CRM, scheduling tool, premium fonts and any stock footage beyond the standard libraries are billed to you at cost by the vendor.' },
  { title: 'Community management', body: 'Replying to comments and DMs on your behalf is not in any plan. Automations that route them to you are scoped separately on a call.' },
  { title: 'Long-form editing on Pilot and Presence', body: 'Those plans cover short-form. Long-form edits are in Growth, or can be ordered one at a time from the order page.' },
  { title: 'Custom software', body: 'Apps and software builds are quoted separately after a scoping call. Growth clients get 20% off the quote.' },
  { title: 'Results', body: 'We guarantee the output, the turnaround and the revisions. We do not guarantee leads, followers or sales, because too much of that sits with your offer and your market. Anyone who guarantees those is guessing.' },
];

/** Which ICP each plan usually suits, with a link to that audience page. */
const FIT: { icpKey: string; plan: string; why: string }[] = [
  { icpKey: 'founders', plan: `${PRESENCE.name} or ${GROWTH.name}`, why: 'Presence Engine covers a weekly video and post cadence. Growth adds blogs and ad creative when those need to run alongside.' },
  { icpKey: 'coaches', plan: `${PILOT.name}, then ${PRESENCE.name}`, why: 'Coaches have recorded sessions and workshops already. The Pilot turns one into six edited clips in 14 days, and Presence keeps that going every week.' },
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
    a: 'All prices are in US dollars and are the same everywhere. Clients in the UK, Canada, Australia and Western Europe pay the USD amount; your card issuer converts it at its rate. Prices shown do not include any sales tax or VAT that your country requires you to self-account for.',
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

/** What each rung of the ladder is for, in the visitor's words. */
const LADDER_ROLE: Record<PlanKey, string> = {
  free: 'Start free',
  pilot: 'Try it for 14 days',
  presence: 'Go monthly',
  growth: 'Every channel',
  full: 'Bigger scopes',
};

/** The plan card that carries the quiet "starting point" label. */
const STARTING_PLAN: PlanKey = 'pilot';

/**
 * What happens after a plan button is pressed. Every line restates something
 * the site already says: the intake modal (components/PlanIntakeModal.tsx),
 * the booking reassurance (lib/links.ts), the onboarding session in the plan
 * scopes and the billing terms below.
 */
const NEXT_STEPS: { title: string; body: string }[] = [
  { title: 'A short intake', body: 'Pick a plan and answer a few quick questions. No card is needed to book.' },
  { title: 'A free 15-minute call', body: `${BOOK_CALL_REASSURANCE} Nothing is charged to book it.` },
  { title: 'Onboarding', body: 'A strategy session sets your brief and plan. Work starts when payment clears.' },
  { title: 'First edits', body: `${PROMISES.turnaround}, counted from when we have the footage.` },
];

/** "$399" + "/month" + "month-to-month", or "$299" + "" + "one-off, 14 days". */
function priceParts(p: Plan): { amount: string; unit: string; note: string } {
  if (p.per.startsWith('/')) {
    const [unit, ...rest] = p.per.split(', ');
    return { amount: p.priceLabel, unit, note: rest.join(', ') };
  }
  return { amount: p.priceLabel, unit: '', note: p.per };
}

function Check() {
  return (
    <svg className="ppg-check" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.25 6.5 11.25 12.5 4.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function stepOf(key: PlanKey): number {
  return VISIBLE_PLANS.findIndex((p) => p.key === key) + 1;
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const start = plan.key === STARTING_PLAN;
  const { amount, unit, note } = priceParts(plan);
  return (
    <Rise
      as="article"
      lift
      delay={index * 0.06}
      id={`plan-${plan.key}`}
      labelledBy={`plan-${plan.key}-name`}
      className={`ppg-card${start ? ' ppg-card-start' : ''}`}
    >
      <p className="ppg-card-top">
        <span className="ppg-step-tag">Step {stepOf(plan.key)}</span>
        {start && <span className="ppg-start">First paid step</span>}
      </p>
      <h3 id={`plan-${plan.key}-name`} className="ppg-card-name">{plan.name}</h3>
      <p className="ppg-card-price">
        <span className="ppg-amount">{amount}</span>
        {unit && <span className="ppg-unit">{unit}</span>}
      </p>
      <p className="ppg-card-note">{note}</p>
      <p className="ppg-card-for">{plan.tagline}</p>
      <ul className="ppg-checks" aria-label={`${plan.name} includes`}>
        {plan.scope.map((line) => (
          <li key={line}><Check />{line}</li>
        ))}
      </ul>
      <div className="ppg-card-cta">
        <PlanButton planKey={plan.key as BookablePlanKey} variant={start ? 'primary' : 'secondary'} />
      </div>
    </Rise>
  );
}

/**
 * Full-width band for the two ends of the ladder: the free sample (step 1)
 * and Custom (step 5). Same parts as a card, laid out across the row.
 */
function PlanBand({ plan, action, priceText }: { plan: Plan; action: ReactNode; priceText?: string }) {
  const { amount, note } = priceParts(plan);
  const id = plan.key === 'free' ? 'free-sample' : `plan-${plan.key}`;
  return (
    <Rise className="ppg-band" id={id} labelledBy={`${id}-name`}>
      <div className="ppg-band-head">
        <p className="ppg-card-top"><span className="ppg-step-tag">Step {stepOf(plan.key)}</span></p>
        <h3 id={`${id}-name`} className="ppg-card-name">{plan.name}</h3>
        {priceText ? (
          <p className="ppg-card-price ppg-card-price-text">
            <span className="ppg-sr">{plan.priceLabel}, </span>{priceText}
          </p>
        ) : (
          <p className="ppg-card-price"><span className="ppg-amount">{amount}</span></p>
        )}
        {!priceText && <p className="ppg-card-note">{note}</p>}
        <p className="ppg-card-for">{plan.tagline}</p>
      </div>
      <div className="ppg-band-body">
        <ul className="ppg-checks ppg-checks-2" aria-label={`${plan.name} includes`}>
          {plan.scope.map((line) => (
            <li key={line}><Check />{line}</li>
          ))}
        </ul>
        <div className="ppg-band-cta">{action}</div>
      </div>
    </Rise>
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

  const proofMetrics = (getCaseStudy('magicbnb-seo-aeo')?.heroMetrics ?? []).slice(0, 3);
  const pricedCards = PRICING_CARDS.filter((p) => p.priceUsd > 0);
  const customPlan = PRICING_CARDS.find((p) => p.priceUsd <= 0);

  const switcherPlans = COMPARE_PLANS.map((p) => {
    const { amount, unit } = priceParts(p);
    return { key: p.key, name: p.name, short: p.key === 'free' ? 'Free' : p.name.split(' ')[0], price: `${amount}${unit.replace('/month', '/mo')}` };
  });

  return (
    <>
      <Nav />

      <main id="main" className="ppg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* ── Hero + ladder ─────────────────────────────────────────────── */}
        <section className="ppg-hero" aria-labelledby="ppg-title">
          <div className="ppg-wrap">
            <nav aria-label="Breadcrumb" className="ppg-crumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li aria-current="page">Pricing</li>
              </ol>
            </nav>
            <h1 id="ppg-title" className="ppg-h1">Start free. Step up when you are ready.</h1>
            <p className="ppg-lede">
              EchoPulse Media is a growth partner for founders and businesses of every kind: content,
              websites, custom software and AI automation. Every price is below, in US dollars, with what it buys
              and what it leaves out.
            </p>

            <ol className="ppg-ladder" aria-label="The price ladder, in order">
              {VISIBLE_PLANS.map((p, i) => {
                const { amount, unit } = priceParts(p);
                // Custom has no number; "Custom" under the name "Custom" read twice.
                const shown = p.key !== 'free' && p.priceUsd <= 0 ? 'On a call' : amount;
                return (
                  <li key={p.key} className="ppg-rung">
                    <a href={p.key === 'free' ? '#free-sample' : `#plan-${p.key}`} className="ppg-rung-link">
                      <span className="ppg-rung-num" aria-hidden="true">{i + 1}</span>
                      <span className="ppg-rung-body">
                        <span className="ppg-rung-role">{LADDER_ROLE[p.key]}</span>
                        <span className="ppg-rung-name">{p.name}</span>
                        <span className="ppg-rung-price">
                          {shown}
                          {unit && <span className="ppg-rung-unit">{unit}</span>}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ── Step 1: free sample ───────────────────────────────────────── */}
        <section className="ppg-sec ppg-sec-tight" aria-label={`Step 1: ${FREE_SAMPLE.name}`}>
          <div className="ppg-wrap">
            <PlanBand
              plan={FREE_SAMPLE}
              action={
                <Link href={FREE_EDITS_URL} data-track-location="pricing_page_free_card" className="ppg-btn-ink">
                  <span>{FREE_SAMPLE.cta}</span><Arrow />
                </Link>
              }
            />
          </div>
        </section>

        {/* ── Steps 2 to 5: plan cards ──────────────────────────────────── */}
        <section className="ppg-sec ppg-sec-tight" aria-labelledby="plans-heading">
          <div className="ppg-wrap">
            <header className="ppg-head">
              <p className="ppg-eyebrow">Paid plans</p>
              <h2 id="plans-heading" className="ppg-h2">Then a Pilot, a monthly plan, or a custom scope</h2>
            </header>
            <div className="ppg-cards">
              {pricedCards.map((plan, i) => (
                <PlanCard key={plan.key} plan={plan} index={i} />
              ))}
            </div>

            {customPlan && (
              <PlanBand
                plan={customPlan}
                priceText={customPlan.per.charAt(0).toUpperCase() + customPlan.per.slice(1)}
                action={<PlanButton planKey={customPlan.key as BookablePlanKey} variant="secondary" />}
              />
            )}

            <ul className="ppg-promises" aria-label="Every plan includes">
              {[PROMISES.replies, PROMISES.turnaround, PROMISES.revisions, PROMISES.ownership].map((p) => (
                <li key={p}><Check />{p}</li>
              ))}
            </ul>

            {proofMetrics.length > 0 && (
              <aside className="ppg-proof" aria-label="Proof from a client engagement">
                <p className="ppg-proof-title">From the MagicBNB engagement</p>
                <ul className="ppg-proof-list">
                  {proofMetrics.map((m) => (
                    <li key={m.label}>
                      <span className="ppg-proof-val">{m.value}</span>
                      <span className="ppg-proof-label">{m.label}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/case-studies/magicbnb-seo-aeo" className="ppg-textlink">See the MagicBNB case study</Link>
              </aside>
            )}
          </div>
        </section>

        {/* ── What happens next ─────────────────────────────────────────── */}
        <section className="ppg-sec" aria-labelledby="next-heading">
          <div className="ppg-wrap">
            <header className="ppg-head">
              <p className="ppg-eyebrow">After you pick a plan</p>
              <h2 id="next-heading" className="ppg-h2">What happens next</h2>
            </header>
            <ol className="ppg-next">
              {NEXT_STEPS.map((s, i) => (
                <Rise as="li" key={s.title} delay={i * 0.06} className="ppg-next-step">
                  <span className="ppg-next-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="ppg-next-title">{s.title}</h3>
                  <p className="ppg-next-body">{s.body}</p>
                </Rise>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Comparison ────────────────────────────────────────────────── */}
        <section className="ppg-sec" aria-labelledby="compare-heading">
          <div className="ppg-wrap">
            <header className="ppg-head">
              <p className="ppg-eyebrow">Side by side</p>
              <h2 id="compare-heading" className="ppg-h2">Compare plans</h2>
            </header>

            <div className="ppg-table-wrap">
              <table className="ppg-table">
                <caption className="ppg-sr">What each plan includes, from the free sample to Growth</caption>
                <thead>
                  <tr>
                    <th scope="col" className="ppg-th-corner">What you get</th>
                    {COMPARE_PLANS.map((p) => {
                      const { amount, unit } = priceParts(p);
                      return (
                        <th scope="col" key={p.key}>
                          <span className="ppg-th-name">{p.name}</span>
                          <span className="ppg-th-price">{amount}{unit}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {row.cells.map((cell, i) => (
                        <td key={COMPARE_PLANS[i].key} data-none={cell === 'None' ? '' : undefined}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ppg-switch">
              <CompareSwitcher plans={switcherPlans} rows={COMPARE} initial={1} />
            </div>

            <p className="ppg-after-table">
              Need more than Growth? <a href="#plan-full" className="ppg-textlink">Custom scopes</a> are quoted on a call.
            </p>
          </div>
        </section>

        {/* ── Not included ──────────────────────────────────────────────── */}
        <section className="ppg-sec" aria-labelledby="not-heading">
          <div className="ppg-wrap ppg-split">
            <header className="ppg-split-head">
              <p className="ppg-eyebrow">Read this before you buy</p>
              <h2 id="not-heading" className="ppg-h2">What is not included</h2>
            </header>
            <dl className="ppg-rows">
              {NOT_INCLUDED.map((item) => (
                <div key={item.title} className="ppg-row">
                  <dt>{item.title}</dt>
                  <dd>{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Billing ───────────────────────────────────────────────────── */}
        <section className="ppg-sec" aria-labelledby="billing-heading">
          <div className="ppg-wrap ppg-split">
            <header className="ppg-split-head">
              <p className="ppg-eyebrow">Billing</p>
              <h2 id="billing-heading" className="ppg-h2">How billing works</h2>
            </header>
            <div>
              <dl className="ppg-rows">
                <div className="ppg-row"><dt>Month-to-month</dt><dd>{PROMISES.noContract} Monthly plans are charged in advance on the same date each month.</dd></div>
                <div className="ppg-row"><dt>14 days notice</dt><dd>To cancel, send written notice 14 days before the next billing date. The current month is not refunded, and the work for it is finished.</dd></div>
                <div className="ppg-row"><dt>Card, through Razorpay or Dodo Payments</dt><dd>Your card details go to the processor. We never see them. Bank transfer is available on request for monthly plans.</dd></div>
                <div className="ppg-row"><dt>USD, worldwide</dt><dd>One price everywhere, in US dollars. Your bank converts at its rate. Taxes your country requires you to self-account for are not included.</dd></div>
                <div className="ppg-row"><dt>Work starts when payment clears</dt><dd>The 48-hour turnaround on short-form edits starts when we have the footage.</dd></div>
                <div className="ppg-row"><dt>The Pilot is one payment</dt><dd>Nothing recurs after it unless you choose a monthly plan.</dd></div>
              </dl>
              <p className="ppg-small">
                The binding version of all of this is in the <Link href="/terms" className="ppg-textlink">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* ── Who each plan fits ────────────────────────────────────────── */}
        <section className="ppg-sec" aria-labelledby="fit-heading">
          <div className="ppg-wrap ppg-split">
            <header className="ppg-split-head">
              <p className="ppg-eyebrow">Which plan</p>
              <h2 id="fit-heading" className="ppg-h2">Who each plan fits</h2>
            </header>
            <ul className="ppg-rows ppg-fit">
              {FIT.map((f) => {
                const icp = icps.find((i) => i.key === f.icpKey);
                if (!icp) return null;
                return (
                  <li key={f.icpKey} className="ppg-row">
                    <h3 className="ppg-fit-who">
                      <Link href={`/${icp.key}`} className="ppg-fit-link">
                        <span>{icp.name}</span><Arrow />
                      </Link>
                    </h3>
                    <div>
                      <p className="ppg-fit-plan">{f.plan}</p>
                      <p className="ppg-fit-why">{f.why}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="ppg-sec" aria-labelledby="faq-heading">
          <div className="ppg-wrap ppg-split">
            <header className="ppg-split-head">
              <p className="ppg-eyebrow">Questions</p>
              <h2 id="faq-heading" className="ppg-h2">Pricing questions, answered</h2>
            </header>
            <div className="ppg-faq">
              {FAQ.map((f, i) => (
                <details key={f.q} className="ppg-faq-item" open={i === 0}>
                  <summary className="ppg-faq-q">
                    <span>{f.q}</span>
                    <span className="ppg-faq-icon" aria-hidden="true" />
                  </summary>
                  <div className="ppg-faq-a">
                    <p>
                      {f.a}
                      {f.q.startsWith('Can I buy a single edit') && (
                        <>
                          {' '}
                          Ask on the call and we will quote it.
                        </>
                      )}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing ask ───────────────────────────────────────────────── */}
        <section className="ppg-sec ppg-sec-last" aria-labelledby="cta-heading">
          <div className="ppg-wrap">
            <Rise className="ppg-cta">
              <h2 id="cta-heading" className="ppg-cta-title">Not sure which one? Ask.</h2>
              <p className="ppg-cta-body">
                A free 15-minute call. We look at what you already have, tell you which step makes sense,
                and if the answer is &quot;none of them yet&quot; we say so.
              </p>
              <div className="ppg-cta-actions">
                <BookCallButton label={BOOK_CALL_LABEL} location="pricing_page_final" />
                <p className="ppg-cta-reassure">{BOOK_CALL_REASSURANCE}</p>
                <Link href={FREE_EDITS_URL} data-track-location="pricing_page_final_free" className="ppg-cta-alt">
                  Or start with 2 free edits
                </Link>
              </div>
            </Rise>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
