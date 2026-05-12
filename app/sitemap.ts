import type { MetadataRoute } from 'next';
import { services } from '@/lib/serviceData';

/**
 * Sitemap — generated at build time. Lists the homepage + every service
 * detail page so search engines and AI crawlers can discover the full
 * site without crawling JS-rendered links.
 *
 * Update SITE_URL via env or replace the constant if the production
 * domain ever changes.
 */
const SITE_URL = 'https://echopulse.media';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  };

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [home, ...serviceRoutes];
}
