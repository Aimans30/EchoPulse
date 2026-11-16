import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { pingIndexNow } from '@/lib/indexnow';

/**
 * On-demand refresh for the blog. Called by a Sanity webhook every time a
 * blog post is published, updated or deleted, whether it came from the daily
 * blog engine or from someone editing in Studio.
 *
 * What it does:
 *   1. Marks the post page, the blog index, the homepage (which lists the
 *      newest posts) and the sitemap as stale, so the next visit, including
 *      Google's next fetch of the sitemap, gets fresh content.
 *   2. Pings IndexNow so Bing recrawls the post within minutes.
 *
 * SETUP (one-time, both values must match):
 *   1. Vercel > Project > Settings > Environment Variables:
 *        REVALIDATE_SECRET = a long random string you generate
 *      then redeploy.
 *   2. sanity.io/manage > project qkz53g2a > API > Webhooks > Create:
 *        URL:        https://echopulse.media/api/revalidate
 *        Dataset:    production
 *        Trigger on: Create, Update, Delete
 *        Filter:     _type == "blog"
 *        Projection: {"slug": slug.current}
 *        HTTP method: POST
 *        HTTP headers: Authorization = Bearer <the same secret>
 *        Leave "Trigger webhook when drafts are modified" off.
 *
 * Without REVALIDATE_SECRET set, the route refuses every request.
 */

function authorised(req: Request): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  const header = req.headers.get('authorization') ?? '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(req: Request) {
  if (!authorised(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorised' }, { status: 401 });
  }

  let slug: string | undefined;
  try {
    const body = (await req.json()) as { slug?: unknown };
    if (typeof body.slug === 'string' && SLUG_RE.test(body.slug)) slug = body.slug;
  } catch {
    // An empty or malformed body still refreshes the index and sitemap.
  }

  const paths = ['/blog', '/', '/sitemap.xml'];
  if (slug) paths.push(`/blog/${slug}`);
  for (const p of paths) revalidatePath(p);

  const urls = ['https://echopulse.media/blog', 'https://echopulse.media/sitemap.xml'];
  if (slug) urls.unshift(`https://echopulse.media/blog/${slug}`);
  const indexnow = await pingIndexNow(urls);

  return NextResponse.json({ ok: true, revalidated: paths, indexnow });
}
