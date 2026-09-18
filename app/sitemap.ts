import type { MetadataRoute } from 'next';
import { services } from '@/lib/serviceData';
import { icps } from '@/lib/icpData';
import { getAllPosts } from '@/lib/blog';
import { urlFor } from '@/lib/sanity';
import { BLOG_REDIRECTS } from '@/lib/redirects';
import { caseStudies, heroImageFor } from '@/lib/caseStudyData';

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  };

  const blogIndex: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/blog`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  };

  // /about — the founder entity page. High priority: it's the #2 page on the
  // domain by impressions and it anchors the Person/Organization schema chain
  // that both Google's raters and AI assistants use to decide we're a real firm.
  const about: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/about`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  };

  // /order was indexable but missing from the sitemap, so Google had no path to
  // it except the nav. It's a conversion page; it belongs here.
  const order: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/order`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  };

  const terms: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/terms`,
    lastModified: now,
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
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  };

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((study) => {
    const hero = heroImageFor(study);
    return {
      url: `${SITE_URL}/case-studies/${study.slug}`,
      lastModified: new Date(study.publishedISO),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      ...(hero ? { images: [`${SITE_URL}${hero.src}`] } : {}),
    };
  });

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // ICP / audience landing pages (/real-estate, /founders, etc.) — high
  // priority since they're the primary outbound conversion destinations.
  const icpRoutes: MetadataRoute.Sitemap = icps.map((icp) => ({
    url: `${SITE_URL}/${icp.key}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
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
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts();
    blogPosts = posts
      .filter((post) => !(post.slug in BLOG_REDIRECTS))
      .map((post) => {
        const image = post.mainImage?.asset
          ? urlFor(post.mainImage).width(1200).height(630).fit('crop').auto('format').url()
          : post.mainImageUrl || undefined;
        return {
          url: `${SITE_URL}/blog/${post.slug}`,
          lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
          changeFrequency: 'monthly' as const,
          priority: 0.75,
          ...(image ? { images: [image] } : {}),
        };
      });
  } catch {
    // Sanity unreachable — sitemap continues without blog posts.
  }

  return [
    home,
    about,
    caseStudyIndex,
    ...caseStudyRoutes,
    blogIndex,
    ...icpRoutes,
    ...serviceRoutes,
    ...blogPosts,
    order,
    terms,
  ];
}
