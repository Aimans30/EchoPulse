import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/blog';
import { urlFor } from '@/lib/sanity';
import { BLOG_REDIRECTS } from '@/lib/redirects';

/**
 * "From the blog": the three newest published posts, for the homepage.
 * Same fetch helper (and 60 second revalidation) as the /blog index, and the
 * same BLOG_REDIRECTS guard so no card links to a slug that redirects away.
 * Fails soft, but never to nothing. The page is static with a 60 second
 * revalidate, so if the Sanity fetch fails while the page is built or
 * revalidated, an empty result is what gets cached and the whole section
 * disappears at every width until the next successful revalidation. That is
 * the likeliest cause of "From the blog" being missing on a phone check: no
 * CSS or animation rule hides it (it renders at 360, 390 and 430). On a failed
 * or empty fetch we now keep the heading and a link to /blog instead.
 */
function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * "Most useful guides": the posts buyers and Google already rely on (most
 * Search Console impressions, Nov 2026). Linked from the homepage so they get
 * more than the 3-newest-posts share of internal links. Each slug only shows
 * if it is live and not redirected, so a retired post drops out on its own.
 */
const GUIDE_SLUGS = [
  'video-editing-turnaround-time',
  'short-form-video-editing-cost-per-video',
  'best-personal-branding-agencies',
  'best-video-editing-services-for-founders',
  'social-media-manager-cost',
  'ugc-creator-rates-vs-agency-cost',
  'best-content-agency-for-startups-2026',
  'local-seo-ranking-factors-evidence',
];

export default async function HomeLatestPosts() {
  let all: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    all = (await getAllPosts()).filter((p) => !(p.slug in BLOG_REDIRECTS));
  } catch {
    all = [];
  }
  const posts = all.slice(0, 3);
  const newest = new Set(posts.map((p) => p.slug));
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const guides = GUIDE_SLUGS.filter((s) => !newest.has(s))
    .map((s) => bySlug.get(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="hlp" aria-labelledby="hlp-heading">
      <div className="hlp-inner">
        <p className="hlp-eyebrow">Blog</p>
        <h2 id="hlp-heading" className="hlp-h2">From the blog</h2>
        {posts.length > 0 && (
        <ul className="hlp-grid">
          {posts.map((post) => {
            const img = post.mainImage?.asset
              ? urlFor(post.mainImage).width(800).height(420).fit("crop").auto('format').url()
              : null;
            const date = formatDate(post.publishedAt);
            return (
              <li key={post._id} className="hlp-card">
                <Link href={`/blog/${post.slug}`} className="hlp-link">
                  {img && (
                    <Image className="hlp-img" src={img} alt={`Cover image for ${post.title}`} width={800} height={420} sizes="(max-width: 760px) 100vw, 360px" loading="lazy" />
                  )}
                  <span className="hlp-body">
                    {date && <span className="hlp-date">{date}</span>}
                    <span className="hlp-title">{post.title}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        )}
        {guides.length > 0 && (
          <div className="hlp-guides">
            <h3 className="hlp-h3">Most useful guides</h3>
            <ul className="hlp-glist">
              {guides.map((g) => (
                <li key={g._id}>
                  <Link href={`/blog/${g.slug}`} className="hlp-glink">{g.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link href="/blog" className="hlp-all">See all posts</Link>
      </div>
      <style>{`
        .hlp { background: #F2EEE7; color: #0C0C0B; padding: 80px 24px; }
        .hlp-inner { max-width: 1100px; margin: 0 auto; }
        .hlp-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6E6B63; margin: 0 0 12px; }
        .hlp-h2 { font-size: clamp(26px, 3.4vw, 40px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; margin: 0 0 28px; }
        .hlp-grid { list-style: none; margin: 0 0 28px; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
        .hlp-card { background: #fff; border: 1px solid rgba(12,12,11,0.1); border-radius: 16px; overflow: hidden; min-width: 0; }
        .hlp-link { display: flex; flex-direction: column; height: 100%; color: inherit; text-decoration: none; }
        .hlp-img { width: 100%; height: auto; aspect-ratio: 1200 / 630; object-fit: cover; display: block; }
        .hlp-body { display: flex; flex-direction: column; gap: 8px; padding: 18px 20px 22px; }
        .hlp-date { font-size: 12px; color: #6E6B63; }
        .hlp-title { font-size: 18px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; overflow-wrap: anywhere; }
        .hlp-link:hover .hlp-title { color: #E8541A; }
        .hlp-all { display: inline-flex; align-items: center; min-height: 44px; color: #C9440F; font-weight: 700; font-size: 15px; text-decoration: none; }
        .hlp-all:hover { text-decoration: underline; }
        .hlp-guides { margin: 4px 0 20px; }
        .hlp-h3 { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 12px; }
        .hlp-glist { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 28px; }
        .hlp-glist li { border-top: 1px solid rgba(12,12,11,0.12); }
        .hlp-glink { display: flex; align-items: center; min-height: 48px; padding: 8px 0; color: #0C0C0B; font-size: 15px; font-weight: 600; line-height: 1.35; text-decoration: none; overflow-wrap: anywhere; }
        .hlp-glink:hover { color: #C9440F; text-decoration: underline; }
        @media (max-width: 760px) { .hlp-glist { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .hlp-grid { grid-template-columns: 1fr; } }
        @media (max-width: 760px) { .hlp { padding: 56px 20px; } }
      `}</style>
    </section>
  );
}
