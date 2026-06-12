import type { MetadataRoute } from 'next';
import { services } from '@/lib/serviceData';
import { getAllPosts } from '@/lib/blog';

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

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Blog posts from Sanity — wrapped in try so a Sanity outage never breaks
  // the build. If Sanity is down, the sitemap drops the post URLs gracefully.
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts();
    blogPosts = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }));
  } catch {
    // Sanity unreachable — sitemap continues without blog posts.
  }

  return [home, blogIndex, ...serviceRoutes, ...blogPosts];
}
