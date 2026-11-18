/**
 * Internal-link wiring between the blog and the money pages.
 *
 * Two directions:
 *   1. money page -> posts: "Guides for real estate agents" blocks on every
 *      ICP page and service page (`getGuidesFor`).
 *   2. post -> money pages: every article gets one ICP page and one service
 *      page to point at (`audienceForPost`), used by the in-post CTA.
 *
 * Before this existed (Nov 2026 audit) the 5 ICP pages and 7 service pages
 * linked to zero posts and 93 of 130 posts had no inbound contextual link.
 *
 * Matching is by keywords in the slug + title. It is deliberately simple:
 * a post can only be reached from a money page if a word in its slug says
 * who it is for, which is also a decent test of whether the post should
 * exist at all.
 */
import { getAllPosts, type BlogPostSummary } from '@/lib/blog';
import { NICHE_INDEX } from '@/lib/nicheIndex';
import { BOOK_CALL_URL } from '@/lib/links';
import { FREE_SAMPLE, PILOT, PRESENCE, GROWTH } from '@/lib/pricing';

export type IcpKey = 'real-estate' | 'founders' | 'coaches' | 'dtc' | 'business-owners';
export type ServiceSlug =
  | 'video-editing'
  | 'linkedin-ghostwriting'
  | 'blog-production'
  | 'ad-creatives'
  | 'websites-funnels'
  | 'automations'
  | 'apps-software';

export const ICP_LABEL: Record<IcpKey, string> = {
  'real-estate': 'real estate agents',
  founders: 'founders',
  coaches: 'coaches and course creators',
  dtc: 'DTC brands',
  'business-owners': 'business owners',
};

export const SERVICE_LABEL: Record<ServiceSlug, string> = {
  'video-editing': 'video editing',
  'linkedin-ghostwriting': 'LinkedIn ghostwriting',
  'blog-production': 'blog production',
  'ad-creatives': 'ad creatives',
  'websites-funnels': 'websites and funnels',
  automations: 'automations',
  'apps-software': 'apps and software',
};

/** Keywords (lowercase, matched against slug + title) per ICP, most specific first. */
const ICP_RULES: Array<[IcpKey, string[]]> = [
  ['real-estate', ['real-estate', 'real estate', 'realtor', 'listing', 'mls', 'zillow', 'fair-housing', 'agent', 'property', 'airbnb', 'short-term-rental']],
  ['coaches', ['coach', 'course', 'cohort', 'webinar', 'discovery-call', 'therapist', 'lead-magnet', 'evergreen', 'community-manager', 'testimonial-request', 'presell']],
  ['dtc', ['ugc', 'dtc', 'ecommerce', 'e-commerce', 'shopify', 'ad-creative', 'meta-ad', 'static-vs-video', 'creative-fatigue', 'ad-naming', 'klaviyo', 'product']],
  ['business-owners', ['local-seo', 'google-business', 'small-business', 'reviews', 'service-business', 'contractor', 'hvac', 'plumb', 'roof', 'social-media-manager', 'what-to-automate']],
  ['founders', ['founder', 'saas', 'startup', 'b2b', 'linkedin', 'personal-brand', 'ghostwrit', 'thought-leadership', 'demo', 'pipeline', 'authority']],
];

/** Keywords per service, most specific first. */
const SERVICE_RULES: Array<[ServiceSlug, string[]]> = [
  ['linkedin-ghostwriting', ['linkedin', 'ghostwrit', 'personal-brand', 'personal branding', 'thought-leadership', 'post-opener', 'headline']],
  ['ad-creatives', ['ad-creative', 'ugc', 'meta-ad', 'static-vs-video', 'creative-fatigue', 'ad-naming', 'ads', 'paid-media']],
  ['websites-funnels', ['website', 'landing-page', 'funnel', 'sales-page', 'course-platform', 'redesign', 'local-seo', 'google-business', 'seo']],
  ['automations', ['automation', 'manychat', 'zapier', 'make-vs', 'crm', 'email-sequence', 'webinar-show-up', 'reviews-scripts', 'what-to-automate']],
  ['blog-production', ['blog', 'content-agency', 'content-marketing', 'ai-written', 'does-ai', 'content-ideas', 'inbound']],
  ['video-editing', ['video', 'editing', 'editor', 'clip', 'podcast', 'reels', 'shorts', 'b-roll', 'talking-head', 'turnaround', 'film', 'captions', 'export-settings', 'safe-zones', 'hook']],
];

function haystack(p: Pick<BlogPostSummary, 'title' | 'slug'>): string {
  return `${p.slug ?? ''} ${p.title ?? ''}`.toLowerCase();
}

function firstMatch<K extends string>(rules: Array<[K, string[]]>, text: string): K | null {
  for (const [key, words] of rules) {
    if (words.some((w) => text.includes(w))) return key;
  }
  return null;
}

/** Which money pages a post should link to. Falls back to founders + video. */
export function audienceForPost(p: Pick<BlogPostSummary, 'title' | 'slug'>): { icp: IcpKey; service: ServiceSlug } {
  const text = haystack(p);
  return {
    icp: firstMatch(ICP_RULES, text) ?? 'founders',
    service: firstMatch(SERVICE_RULES, text) ?? 'video-editing',
  };
}

const ICP_KEYS = Object.keys(ICP_LABEL) as IcpKey[];
const SERVICE_SLUGS = Object.keys(SERVICE_LABEL) as ServiceSlug[];
/** Publisher keys that have no page of their own, mapped to the page that serves them. */
const ICP_ALIAS: Record<string, IcpKey> = { saas: 'founders', 'home-services': 'business-owners' };

/**
 * The post's audience, from the `icp` and `service` the publisher stored on
 * the Sanity document (scripts/publish-blog.mjs). Each field falls back to the
 * keyword guess on its own, so posts written before those fields existed, or
 * carrying a value this site has no page for, behave exactly as before.
 *
 * Why: the guess reads the slug and title, so an automation post with no
 * automation keyword in its title fell through to video-editing and asked the
 * reader to send footage.
 */
export function audienceFor(
  p: Pick<BlogPostSummary, 'title' | 'slug'>,
  stored?: { icp?: string | null; service?: string | null } | null,
): { icp: IcpKey; service: ServiceSlug } {
  const guess = audienceForPost(p);
  const icp = stored?.icp ? (ICP_ALIAS[stored.icp] ?? stored.icp) : null;
  return {
    icp: ICP_KEYS.find((k) => k === icp) ?? guess.icp,
    service: SERVICE_SLUGS.find((s) => s === stored?.service) ?? guess.service,
  };
}

/**
 * The most specific money page for a post: the niche-plus-service page when
 * that pair is one of the 12 that exist (lib/nicheIndex.ts, the same list
 * NICHE_PAGES is built from), otherwise the audience page.
 */
export function nichePageFor(icp: string, service: string): string {
  return NICHE_INDEX.some((e) => e.icp === icp && e.service === service) ? `/${icp}/${service}` : `/${icp}`;
}

/** Link text to go with nichePageFor: the niche page's own H1, or the audience. */
export function nicheLinkLabel(icp: IcpKey, service: string): string {
  const hit = NICHE_INDEX.find((e) => e.icp === icp && e.service === service);
  if (!hit) return `how we work with ${ICP_LABEL[icp]}`;
  // Sentence-internal: lower the first letter unless the H1 opens with a name.
  return /^(LinkedIn|DTC)/.test(hit.h1) ? hit.h1 : hit.h1.charAt(0).toLowerCase() + hit.h1.slice(1);
}

/** The 14-day Pilot page (app/pilot). */
export const PILOT_URL = '/pilot';
export const BLOG_CALL_LABEL = 'Book a free 15-minute call';
export const BLOG_SAMPLE_LABEL = 'Get my 2 free edits';

/** Booking link tagged with where in the post it was clicked and which post. */
export function blogBookUrl(medium: string, slug: string): string {
  const sep = BOOK_CALL_URL.includes('?') ? '&' : '?';
  return `${BOOK_CALL_URL}${sep}utm_source=blog&utm_medium=${medium}&utm_campaign=${encodeURIComponent(slug)}`;
}

/**
 * What a blog post asks the reader to do, keyed off the post's service.
 *
 * Video and ad-creative readers have footage, so they get the free sample.
 * Everyone else gets the 15-minute call as the button and one text link that
 * fits what they came to read about. A post about blog writing or websites
 * never mentions footage. Plain serialisable data, so server components can
 * hand it to the client ones (footer card, phone bar) as props.
 */
export type BlogAsk = {
  kind: 'sample' | 'call';
  /** The one button. */
  buttonLabel: string;
  /** The one text link beside it. For `sample` posts this is the call. */
  linkLabel: string;
  linkHref: string;
  /** True when linkHref is the booking link (needs the per-post UTM). */
  linkIsCall: boolean;
  /** Lead line of the first in-article card. */
  lead: string;
  /** One line for the compact card further down. */
  short: string;
  /** Closing card. */
  closeHead: string;
  closeSub: string;
};

const CALL_SUB =
  '15 minutes with Lakshya, the founder. He looks at your site and tells you the first three things he would fix. No pitch.';

export function blogAskFor(service: ServiceSlug): BlogAsk {
  if (service === 'video-editing' || service === 'ad-creatives') {
    return {
      kind: 'sample',
      buttonLabel: BLOG_SAMPLE_LABEL,
      linkLabel: BLOG_CALL_LABEL,
      linkHref: BOOK_CALL_URL,
      linkIsCall: true,
      lead: 'Reading this because you need it done? Send raw footage and get 2 edited videos back free within 48 hours. No card, no call.',
      short: 'Want this done for you? Send footage, get 2 edited videos back free within 48 hours.',
      closeHead: 'Send footage. Get 2 edited videos back, free.',
      closeSub: 'Back within 48 hours. No card and no call. You keep the files whether or not you hire us.',
    };
  }
  const call = { kind: 'call' as const, buttonLabel: BLOG_CALL_LABEL, linkIsCall: false, closeSub: CALL_SUB };
  if (service === 'blog-production') {
    return {
      ...call,
      linkLabel: 'See what this did for MagicBNB',
      linkHref: '/case-studies/magicbnb-seo-aeo',
      lead: 'Want posts like this on your own site? Book 15 minutes with Lakshya. He will look at your site and tell you the first three things he would fix.',
      short: 'Want posts like this on your own site? Book 15 minutes and get the first three things to fix.',
      closeHead: 'Want the first three fixes for your own site?',
    };
  }
  if (service === 'linkedin-ghostwriting') {
    return {
      ...call,
      linkLabel: `See the ${PILOT.priceLabel} Pilot`,
      linkHref: PILOT_URL,
      lead: `Want this done for you, in your own voice? Book 15 minutes with Lakshya, or look at the ${PILOT.priceLabel} Pilot: 14 days of real work before any monthly plan.`,
      short: `Want this done for you, in your own voice? Book 15 minutes, or look at the ${PILOT.priceLabel} Pilot.`,
      closeHead: 'Want this done for you, in your own voice?',
      closeSub:
        '15 minutes with Lakshya, the founder. He looks at your profile and your last few posts and tells you the first three things he would fix. No pitch.',
    };
  }
  // Websites, automations, apps: builds, quoted in writing before any payment.
  const website = service === 'websites-funnels';
  return {
    ...call,
    linkLabel: 'See prices',
    linkHref: '/pricing',
    lead: `${website ? 'Pricing a website?' : 'Want this built for you?'} Book 15 minutes with Lakshya. You get a written scope and a fixed price before you pay anything.`,
    short: `${website ? 'Pricing a website?' : 'Want this built for you?'} Book 15 minutes. Written scope and a fixed price before you pay anything.`,
    closeHead: website ? 'Want a fixed price for your own site?' : 'Want a fixed price for your own build?',
    closeSub:
      '15 minutes with Lakshya, the founder. You get a written scope and a fixed price before you pay anything. No pitch.',
  };
}

/** True for posts about what something costs. They get the price line. */
export function isPricingPost(slug: string): boolean {
  return /cost|price|pricing|rates/.test(slug.toLowerCase());
}

/** Where EchoPulse sits in a price range, built from lib/pricing.ts. */
export const BLOG_PRICE_LINE = `Where EchoPulse sits in this range: ${FREE_SAMPLE.cta.replace(/^Get /, '')}, ${PILOT.priceLabel} Pilot, ${PRESENCE.priceLabel} a month, ${GROWTH.priceLabel} a month. Month-to-month.`;

export type Guide = { title: string; slug: string; excerpt?: string };

/**
 * Posts to list on a money page. Scores by keyword hits for the ICP and/or
 * service, prefers posts whose slug names a price or a comparison (those are
 * the ones buyers read), newest first on ties.
 */
export async function getGuidesFor(
  target: { icp?: IcpKey; service?: ServiceSlug },
  limit = 6,
): Promise<Guide[]> {
  let posts: BlogPostSummary[] = [];
  try {
    posts = await getAllPosts();
  } catch {
    return [];
  }
  const icpWords = target.icp ? (ICP_RULES.find(([k]) => k === target.icp)?.[1] ?? []) : [];
  const svcWords = target.service ? (SERVICE_RULES.find(([k]) => k === target.service)?.[1] ?? []) : [];
  const BUYER_WORDS = ['cost', 'price', 'pricing', 'best', 'vs', 'rates', 'how-much', 'how-to-choose', 'specs', 'template', 'checklist'];

  const scored = posts
    .map((p) => {
      const text = haystack(p);
      const icpHits = icpWords.filter((w) => text.includes(w)).length;
      const svcHits = svcWords.filter((w) => text.includes(w)).length;
      const buyer = BUYER_WORDS.some((w) => text.includes(w)) ? 1 : 0;
      // A post must match the ICP when one is given, and the service when
      // only a service is given; otherwise it is not "for" this page.
      const qualifies = target.icp ? icpHits > 0 : svcHits > 0;
      return { p, score: icpHits * 3 + svcHits * 2 + buyer, qualifies };
    })
    .filter((x) => x.qualifies)
    .sort((a, b) => b.score - a.score || (b.p.publishedAt ?? '').localeCompare(a.p.publishedAt ?? ''));

  return scored.slice(0, limit).map(({ p }) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
  }));
}
