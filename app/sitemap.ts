import type { MetadataRoute } from 'next';
import { services } from '@/lib/serviceData';
import { icps } from '@/lib/icpData';
import { urlFor, sanityClient } from '@/lib/sanity';
import { BLOG_REDIRECTS, DEAD_SLUGS, SLUG_ALIASES } from '@/lib/redirects';
import { caseStudies, heroImageFor } from '@/lib/caseStudyData';
import { NICHE_PAGES } from '@/lib/nicheServiceData';
import { NICHE_PAGES_UPDATED_ISO } from '@/lib/siteMeta';

/**
 * Sitemap — generated at build time. Lists the homepage + every service
 * detail page + every published blog post so search engines and AI crawlers
 * can discover the full site without crawling JS-rendered links.
 */
const SITE_URL = 'https://echopulse.media';

/**
 * Revalidate the sitemap every 10 minutes. Without this, Next.js renders
 * sitemap.xml once at build time and caches it forever — new blog posts
 * published in Sanity would never appear until the next deploy. With ISR,
 * the first request after the 10-minute window triggers a fresh Sanity
 * fetch and the new post's URL shows up automatically. No redeploy needed.
 */
export const revalidate = 600;

/**
 * Rendered per request, not as a cached static file. In November 2026 the
 * live sitemap was found 58 hours old (x-vercel-cache: HIT, age 211154) and
 * missing the two newest posts, so the 10-minute ISR window was not being
 * honoured in production. The Sanity query below still caches for 10 minutes
 * through the fetch cache, so this costs one cheap render per crawl, and a new
 * post appears in the sitemap within 10 minutes of publishing.
 */
export const dynamic = 'force-dynamic';

/** Fixed dates for pages that change by hand. Bump when the page changes. */
const TERMS_UPDATED = new Date('2026-05-28');
const PRIVACY_UPDATED = new Date('2026-11-10');
const PRICING_UPDATED = new Date('2026-11-10');
/**
 * The rest of the static pages. Only the homepage keeps `new Date()`: it is
 * the one page whose sections genuinely move with every deploy. Everything
 * else gets this date, bumped when a release touches those pages, so the
 * sitemap stops claiming a change on every fetch.
 */
const STATIC_PAGES_UPDATED = new Date('2026-11-10');
const BRAND_PAGE_UPDATED = new Date('2026-11-10');

type SitemapPost = {
  slug: string;
  publishedAt?: string;
  lastChecked?: string | null;
  mainImage?: { asset?: { _ref?: string } };
  mainImageUrl?: string;
};

/**
 * Slug, dates and cover only. Dead slugs are excluded in the query itself so
 * a re-published duplicate never reaches the map; the in-code filter below
 * stays as a second guard.
 */
const SITEMAP_POSTS_QUERY = `*[_type == "blog" && defined(slug.current) && !(slug.current in $dead)]{
  "slug": slug.current,
  publishedAt,
  lastChecked,
  mainImage,
  mainImageUrl
}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  };

  // Set to the newest post's date once the posts have loaded, below.
  const blogIndex: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/blog`,
    lastModified: STATIC_PAGES_UPDATED,
    changeFrequency: 'weekly',
    priority: 0.85,
  };

  // /about — the founder entity page. High priority: it's the #2 page on the
  // domain by impressions and it anchors the Person/Organization schema chain
  // that both Google's raters and AI assistants use to decide we're a real firm.
  const about: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/about`,
    lastModified: STATIC_PAGES_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.9,
  };


  // /pricing is the full price page built from lib/pricing.ts. It answers the
  // query the homepage pricing section cannot rank for on its own.
  const pricing: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/pricing`,
    lastModified: PRICING_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.9,
  };

  // /what-is-echopulse-media is the brand entity page. It replaces a dead blog
  // slug that still earns impressions for the brand query.
  const whatIs: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/what-is-echopulse-media`,
    lastModified: BRAND_PAGE_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.8,
  };

  // /faq is the full FAQ page, built from lib/faqData.ts (shared with the
  // homepage FAQ section).
  const faq: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/faq`,
    lastModified: BRAND_PAGE_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.8,
  };

  // /pilot is the one-screen $299 Pilot page sent in DMs; /free-edits is the
  // free sample form; /about/lakshya-soni is the founder's author page.
  const pilot: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/pilot`,
    lastModified: PRICING_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.8,
  };

  // /book is the booking calendar inline. It exists so there is a link with
  // our own preview image to share; a direct cal.com link unfurls as Cal.com's.
  const book: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/book`,
    lastModified: STATIC_PAGES_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.7,
  };

  const freeEdits: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/free-edits`,
    lastModified: STATIC_PAGES_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.7,
  };

  // Free resources (lead magnets). Each is complete on the page, with an
  // email box for the printable version.
  const resourcePages: MetadataRoute.Sitemap = ['/resources', '/resources/listing-video-shot-list', '/resources/offcut', '/resources/offcut/extension'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date('2026-11-17'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const founderPage: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/about/lakshya-soni`,
    lastModified: BRAND_PAGE_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.7,
  };

  // Legal pages carry a fixed date. `now` on a page that has not changed tells
  // the crawler it changed on every fetch, which is a lie it learns to ignore.
  const terms: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/terms`,
    lastModified: TERMS_UPDATED,
    changeFrequency: 'yearly',
    priority: 0.2,
  };

  const privacy: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/privacy`,
    lastModified: PRIVACY_UPDATED,
    changeFrequency: 'yearly',
    priority: 0.2,
  };

  // Case studies. Priority 0.9, the same as the ICP pages and above the
  // service pages, because these are the only pages on the domain carrying
  // first-party measured data. Each detail page also declares its underlying
  // export as a Dataset, which is the node most likely to be cited by an
  // answer engine, so they need a direct crawl path rather than discovery
  // through the nav.
  const caseStudyIndex: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/case-studies`,
    lastModified: STATIC_PAGES_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.9,
  };

  // The video wall. Carries a VideoObject ItemList for every clip.
  const workPage: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/work`,
    lastModified: STATIC_PAGES_UPDATED,
    changeFrequency: 'weekly',
    priority: 0.9,
  };

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((study) => {
    const hero = heroImageFor(study);
    return {
      url: `${SITE_URL}/case-studies/${study.slug}`,
      lastModified: new Date(study.updatedISO ?? study.publishedISO),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      ...(hero ? { images: [`${SITE_URL}${hero.src}`] } : {}),
    };
  });

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: STATIC_PAGES_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // ICP / audience landing pages (/real-estate, /founders, etc.) — high
  // priority since they're the primary outbound conversion destinations.
  const icpRoutes: MetadataRoute.Sitemap = icps.map((icp) => ({
    url: `${SITE_URL}/${icp.key}`,
    lastModified: STATIC_PAGES_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // Niche-plus-service pages (/real-estate/video-editing and 11 more). Only the
  // combinations listed in lib/nicheServiceData.ts exist; every other
  // /[icp]/[service] path 404s.
  const nicheRoutes: MetadataRoute.Sitemap = NICHE_PAGES.map((p) => ({
    url: `${SITE_URL}/${p.icp}/${p.service}`,
    lastModified: new Date(NICHE_PAGES_UPDATED_ISO),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Blog posts from Sanity — wrapped in try so a Sanity outage never breaks
  // the build. If Sanity is down, the sitemap drops the post URLs gracefully.
  //
  // Each entry also carries `images`, which makes this an image sitemap for
  // the blog: Google indexes the cover separately for Image Search instead of
  // only discovering it as an <img> inside the crawled page. Same source the
  // OG image and the blog index card use — no separate asset, just declaring
  // the one that already exists.
  //
  // A sitemap must list only canonical, indexable URLs. Any slug carrying a
  // BLOG_REDIRECTS entry 301s away, so listing it would advertise a URL that
  // never returns 200 — wasted crawl budget and a contradictory signal (the
  // sitemap says "index this", the response says "go elsewhere").
  //
  // As verified Sept 2026 this filter removes nothing: all 65 redirected slugs
  // are unpublished in Sanity, so getAllPosts() does not return them. It is
  // here because that is a property of the DATA, not of the code — the moment
  // anyone re-publishes one of those posts without removing its redirect entry,
  // the redirect shadows the page and the sitemap starts advertising a 301.
  // Cheap guard against a failure mode that is invisible until Search Console
  // reports it months later.
  //
  // lastModified is the post's real content date (see below). The query is
  // local to this file because the index does not need `lastChecked`.
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts = await sanityClient.fetch<SitemapPost[]>(
      SITEMAP_POSTS_QUERY,
      { dead: DEAD_SLUGS },
      { next: { revalidate: 600 } },
    );
    // A post still at its old slug in Sanity is listed under its new one.
    const renamed = Object.fromEntries(Object.entries(SLUG_ALIASES).map(([n, o]) => [o, n]));
    blogPosts = posts
      .map((post) => (renamed[post.slug] ? { ...post, slug: renamed[post.slug] } : post))
      .filter((post) => !(post.slug in BLOG_REDIRECTS))
      .map((post) => {
        const image = post.mainImage?.asset
          ? urlFor(post.mainImage).width(1200).height(630).fit('crop').auto('format').url()
          : post.mainImageUrl || undefined;
        // Same rule as the post's dateModified schema: the stored "Last
        // checked" date when it is newer than the publish date, else the
        // publish date. Never _updatedAt: a bulk field edit on 18 Nov 2026
        // stamped 97 of 159 URLs with the same day, a false freshness signal.
        const checked = post.lastChecked || '';
        const published = post.publishedAt || '';
        const modified =
          checked && published && checked > published.slice(0, 10) ? checked : published || checked;
        return {
          url: `${SITE_URL}/blog/${post.slug}`,
          lastModified: modified ? new Date(modified) : now,
          changeFrequency: 'monthly' as const,
          priority: 0.75,
          // Next writes image URLs into the XML without escaping, so a raw
          // "&" in the Sanity query string made the whole sitemap unreadable
          // to Google ("not well-formed", 21 Nov 2026). Escape it here.
          ...(image ? { images: [image.replace(/&/g, '&amp;')] } : {}),
        };
      });
  } catch {
    // Sanity unreachable — sitemap continues without blog posts.
  }

  // The index changes exactly when a post is published or edited.
  const newest = blogPosts
    .map((p) => (p.lastModified instanceof Date ? p.lastModified.getTime() : 0))
    .reduce((a, b) => Math.max(a, b), 0);
  if (newest > 0) blogIndex.lastModified = new Date(newest);

  return [
    home,
    about,
    workPage,
    caseStudyIndex,
    ...caseStudyRoutes,
    blogIndex,
    ...icpRoutes,
    ...nicheRoutes,
    ...serviceRoutes,
    ...blogPosts,
    pricing,
    whatIs,
    faq,
    pilot,
    freeEdits,
    book,
    founderPage,
    ...resourcePages,
    terms,
    privacy,
  ];
}
