import type { Metadata } from 'next';
import { ogImages } from '@/lib/ogImages';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BlogIndexClient, { type IndexPost } from '@/components/BlogIndexClient';
import { getAllPosts, resolveCategory } from '@/lib/blog';
import { urlFor } from '@/lib/sanity';
import { BLOG_REDIRECTS } from '@/lib/redirects';

export const metadata: Metadata = {
  // Titled for the search query, not for the nav label. "Blog" ranks for
  // nothing; "content agency pricing and guides" is closer to what the people
  // we want are actually typing.
  title: { absolute: 'Content Agency Pricing, Guides & Comparisons | EchoPulse' },
  description:
    'Real agency pricing, honest comparisons, and the systems behind founder-led content. Every number sourced, written by the team doing the work.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Content Agency Pricing, Guides & Comparisons | EchoPulse',
    description:
      'Real agency pricing, honest comparisons, and the systems behind founder-led content. Every number sourced.',
    url: 'https://echopulse.media/blog',
    siteName: 'EchoPulse Media',
    type: 'website',
    images: ogImages('blog'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Content Agency Pricing, Guides & Comparisons | EchoPulse',
    images: ogImages('blog'),
  },
};

// Revalidate the blog index once a minute. Long enough to keep CDN hits cheap,
// short enough that new posts appear without a redeploy.
export const revalidate = 60;

export default async function BlogIndexPage() {
  // A slug carrying a BLOG_REDIRECTS entry 301s away, so listing it here would
  // hand every reader a card that bounces them to a different URL. Until Sept
  // 2026 this filter was a no-op, because all 65 redirected slugs were also
  // unpublished in Sanity and getAllPosts never returned them. That stopped
  // being true when the MagicBNB case study moved to /case-studies: it is still
  // published, so without this line the index would keep advertising the old
  // path. Same guard the sitemap already applies, for the same reason.
  const posts = (await getAllPosts()).filter((post) => !(post.slug in BLOG_REDIRECTS));

  // Enrich server-side so the client component carries no server-only imports
  // (Sanity client / image builder): resolved category + ready-to-use image URL.
  const indexPosts: IndexPost[] = posts.map((post) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    author: post.author,
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    resolvedCategory: resolveCategory(post),
    imageSrc: post.mainImage?.asset
      ? urlFor(post.mainImage).width(1200).height(630).fit('crop').auto('format').url()
      : post.mainImageUrl || null,
  }));

  return (
    <>
      <Nav />
      {/* id="main" — target of the layout's skip-to-content link. */}
      <main
        id="main"
        className="blog-main"
        style={{
          background: '#F2EEE7',
          minHeight: '100vh',
          paddingTop: '124px',
          paddingBottom: '120px',
        }}
      >
        <div className="blog-inner" style={{ maxWidth: '1212px', margin: '0 auto', padding: '0 56px' }}>
          {/* Header: same 1100px column as the nav, the filter and the grid. */}
          <header className="blog-header" style={{ marginBottom: '28px' }}>
            <h1
              className="blog-h1"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(30px, 3.2vw, 42px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                margin: 0,
                color: '#0C0C0B',
              }}
            >
              Content pricing, comparisons and guides
            </h1>
            <p
              className="blog-intro"
              style={{
                margin: '12px 0 0',
                fontSize: '17px',
                lineHeight: 1.55,
                color: '#55524B',
                maxWidth: '680px',
              }}
            >
              Real prices, side-by-side comparisons and how-to guides on content, video, LinkedIn,
              websites and AI search, written for small businesses.
            </p>
          </header>

          {/* Filters + featured + list (interactive) */}
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <BlogIndexClient posts={indexPosts} />
          )}
        </div>

        <style>{`
          @media (max-width: 1100px) {
            .blog-inner { padding: 0 32px !important; }
          }
          @media (max-width: 900px) {
            .blog-main { padding-top: 116px !important; padding-bottom: 80px !important; }
          }
          @media (max-width: 640px) {
            .blog-main { padding-top: 108px !important; padding-bottom: 64px !important; }
            .blog-inner { padding: 0 20px !important; }
            .blog-header { margin-bottom: 24px !important; }
            .blog-h1 { font-size: 28px !important; letter-spacing: -0.025em !important; line-height: 1.15 !important; }
            .blog-intro { font-size: 16px !important; }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}

// ── Empty state ──────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.55)',
        border: '1px solid rgba(12,12,11,0.06)',
        borderRadius: '20px',
        padding: '64px 48px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '40px', marginBottom: '14px' }}>📝</div>
      <h2
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '22px',
          fontWeight: 800,
          color: '#0C0C0B',
          margin: '0 0 8px',
        }}
      >
        First posts coming soon.
      </h2>
      <p
        style={{
          fontSize: '15px',
          color: '#6E6B63',
          margin: 0,
          maxWidth: '420px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6,
        }}
      >
        We&apos;re writing them now. Check back this week, or follow Lakshya on LinkedIn for early drops.
      </p>
    </div>
  );
}
