import { getAllPosts, resolveAuthor, resolveCategory } from '@/lib/blog';

/**
 * RSS 2.0 feed for the EchoPulse blog — served at /blog/rss.xml
 *
 * Why this exists: the blog had no feed at all. A feed is the cheapest
 * discovery channel there is. Google Reader is long dead, but feeds are still
 * consumed by:
 *   • news/aggregator crawlers and Bing (which feeds ChatGPT search)
 *   • AI crawlers looking for a machine-readable index of a site's content
 *   • newsletter tools (Beehiiv, Kit, Mailchimp RSS-to-email campaigns)
 *   • readers who actually follow via Feedly/Inoreader
 *
 * Regenerated every 10 minutes so newly published Sanity posts appear without
 * a redeploy, matching the sitemap's revalidate window.
 */

const SITE_URL = 'https://echopulse.media';

export const revalidate = 600;

/** XML-escape a string so titles/excerpts with & or quotes cannot break the feed. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch {
    // Sanity unreachable: serve a valid but empty feed rather than a 500.
  }

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const date = post.publishedAt ? new Date(post.publishedAt) : new Date();
      return `    <item>
      <title>${esc(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date.toUTCString()}</pubDate>
      <description>${esc(post.excerpt ?? '')}</description>
      <category>${esc(resolveCategory(post))}</category>
      <dc:creator>${esc(resolveAuthor(post.author))}</dc:creator>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>EchoPulse Media Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Guides and insights on founder-led content: video editing, LinkedIn, blogs, funnels, and the systems behind them.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, must-revalidate',
    },
  });
}
