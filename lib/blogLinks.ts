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
