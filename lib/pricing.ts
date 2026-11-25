/**
 * THE price ladder. One file, imported everywhere a price or a scope line is
 * shown: the pricing section, the hero stat strip, the pilot popup, the FAQ,
 * the Organization schema, /pricing, the ICP and service pages, llms.txt
 * (hand-synced, see the note at the top of that file) and the outreach skills.
 *
 * Decided by Lakshya on 10 Nov 2026 after the site, the outreach emails and
 * llms.txt were each telling a different price story:
 *
 *   Free sample  ->  $299 Pilot (14 days)  ->  $399/mo Presence Engine  ->  $1,997/mo Growth
 *
 * The fourth card is "Custom" with no number (the old $4,997 Full System
 * promised staffing the studio does not have).
 *
 * Prices are flat USD worldwide (see lib/useGeoPrice.ts for why). If a number
 * here changes, also update public/llms.txt and the pricing lines in the two
 * echopulse-* outreach skills.
 */

export type PlanKey = 'free' | 'pilot' | 'presence' | 'growth' | 'full';

export interface Plan {
  key: PlanKey;
  name: string;
  /** USD, no decimals. 0 for the free sample. */
  priceUsd: number;
  /** Formatted for display, e.g. "$399". "Free" for the sample. */
  priceLabel: string;
  /** Billing cadence shown next to the price. */
  per: string;
  /** One line under the name. */
  tagline: string;
  /** Short badge above the card. */
  badge: string;
  /** What the client gets. Keep each line checkable; no adjectives. */
  scope: string[];
  /** Call-to-action label. */
  cta: string;
  /** True for the card that gets the dark/featured treatment. */
  featured?: boolean;
  /** Hidden plans are never rendered. */
  hidden?: boolean;
}

export const FREE_SAMPLE: Plan = {
  key: 'free',
  name: 'Free sample',
  priceUsd: 0,
  priceLabel: 'Free',
  per: 'no card, no call required',
  tagline: 'Send raw footage. Get 2 edited videos back within 48 hours.',
  badge: 'Start here',
  scope: [
    '2 short-form videos edited from footage you already have (a talk, a podcast, a listing tour, a job-site clip)',
    'Captions, hooks, pacing and music, ready to post',
    'Back within 48 hours of receiving the footage',
    'You keep the files whether or not you hire us',
  ],
  cta: 'Get 2 free edits',
};

export const PILOT: Plan = {
  key: 'pilot',
  name: 'Pilot',
  priceUsd: 299,
  priceLabel: '$299',
  per: 'one-off, 14 days',
  tagline: 'See real work on your brand in 14 days before any monthly plan.',
  badge: 'Try us out',
  scope: [
    'Onboarding strategy session (60 min, recorded) + brand brief',
    '6 short-form video edits',
    '2 static or carousel posts, captions ready',
    '1 long-form SEO blog (1,500 words, sourced)',
    'Content audit + 30-day plan',
    '48-hour turnaround on short-form edits, revised until you are happy',
    'No retainer commitment. You keep everything made.',
  ],
  cta: 'Start the $299 Pilot',
};

export const PRESENCE: Plan = {
  key: 'presence',
  name: 'Presence Engine',
  priceUsd: 399,
  priceLabel: '$399',
  per: '/month, month-to-month',
  tagline: 'Your content and your website, run every week by one person you can call.',
  badge: 'Monthly',
  scope: [
    'A 20 to 30 minute call every week: plan the week, go over the numbers, decide what to improve',
    'Monthly content calendar, weekly shot list and help filming',
    '8 to 9 short-form videos a month, edited to perform',
    '8 photo or carousel posts a month, captions ready',
    'Up to 5 extra clips a month cut from footage you already have, free',
    'A posting plan, and we schedule and post every approved piece for you',
    'Free website tune-up in month one, then ongoing upgrades',
    'Pages, Google Business Profile and structured data so you show up on Google and ChatGPT',
    'Replies within 3 hours in the workday',
  ],
  cta: 'Book a free 15-minute call',
  featured: true,
};

export const GROWTH: Plan = {
  key: 'growth',
  name: 'Growth',
  priceUsd: 1997,
  priceLabel: '$1,997',
  per: '/month, month-to-month',
  tagline: 'Every channel handled by one team, every month.',
  badge: 'Full coverage',
  scope: [
    'Onboarding strategy session + quarterly brand-brief refresh',
    '20 social posts a month across the platforms your buyers use',
    '4 long-form SEO blogs a month (1,500 to 2,500 words, sourced)',
    '12 short-form video edits + 12 clips + 2 long-form edits (YouTube or podcast)',
    '6 ad creatives a month (4 static, 2 video)',
    'Website rebuilt in month one, tuned every month after',
    'Funnel optimization with conversion tracking',
    'Monthly strategy call with a 30-day content calendar',
    'Monthly performance review',
    '20% off any custom app or software build',
  ],
  cta: 'Book a free 15-minute call',
};

export const FULL_SYSTEM: Plan = {
  key: 'full',
  name: 'Custom',
  priceUsd: 0,
  priceLabel: 'Custom',
  per: 'scoped on a call',
  tagline: 'More volume than Growth, a launch, or a build. Scoped in writing before any money moves.',
  badge: 'Talk to me',
  scope: [
    'Podcast or YouTube editing at volume',
    'Course modules and launch content',
    'A website, funnel or app build alongside the content',
    'Written scope, fixed price and a delivery date before you pay',
  ],
  cta: 'Book a free 15-minute call',
  // The old "Full System" at $4,997 promised a dedicated account lead and a
  // quarterly app build, which an owner-operated studio cannot staff. It is
  // now a custom card with no number; the number is set on the call.
};

/** Every plan, in ladder order, including hidden ones. */
export const ALL_PLANS: Plan[] = [FREE_SAMPLE, PILOT, PRESENCE, GROWTH, FULL_SYSTEM];

/** Plans that may be rendered on the site. */
export const VISIBLE_PLANS: Plan[] = ALL_PLANS.filter((p) => !p.hidden);

/** The plans shown as pricing cards (the free sample is a CTA, not a card). */
export const PRICING_CARDS: Plan[] = VISIBLE_PLANS.filter((p) => p.key !== 'free');

/** One-line ladder for FAQs, llms.txt and outreach. */
export const PRICE_LADDER_SENTENCE =
  'Start with 2 free edited videos. Then a $299 14-day Pilot, a $399-a-month Presence Engine, or the $1,997-a-month Growth plan. Bigger scopes are quoted on a call. Everything is month-to-month.';

/** Promises that appear next to prices. Use these words, not variants. */
export const PROMISES = {
  replies: 'Replies within 3 hours in the workday',
  turnaround: '48-hour turnaround on short-form edits',
  revisions: 'Re-done until you would ship it under your own name',
  ownership: 'You keep everything made, whether or not you continue',
  noContract: 'Month-to-month. No contract.',
} as const;

/** schema.org Offer nodes for the Organization. Hidden plans are excluded. */
export function pricingOffers() {
  return PRICING_CARDS.filter((p) => p.priceUsd > 0).map((p) => ({
    '@type': 'Offer',
    name: p.name,
    price: String(p.priceUsd),
    priceCurrency: 'USD',
    description: `${p.per}. ${p.scope.join('; ')}.`,
  }));
}
