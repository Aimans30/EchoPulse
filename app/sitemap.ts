import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://echopulse.media';

  const blogPosts = await client.fetch<Array<{ slug: { current: string }; publishedAt: string }>>(
    `*[_type == "blog" && defined(slug.current)] {
      slug,
      publishedAt
    }`
  );

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
  ];
}
