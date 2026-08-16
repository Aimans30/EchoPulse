import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BlogIndexClient, { type IndexPost } from '@/components/BlogIndexClient';
import { getAllPosts, resolveCategory } from '@/lib/blog';
import { urlFor } from '@/lib/sanity';

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
    type: 'website',
  },
};

// Revalidate the blog index once a minute. Long enough to keep CDN hits cheap,
// short enough that new posts appear without a redeploy.
export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

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
      ? urlFor(post.mainImage).width(900).height(560).fit('crop').auto('format').url()
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
          paddingTop: '140px',
          paddingBottom: '120px',
        }}
      >
        <div className="blog-inner" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 56px' }}>
          {/* Header */}
          <div className="blog-header" style={{ marginBottom: '48px' }}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: '#6E6B63',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
              Guides &amp; Insights
            </div>
            <h1
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(40px, 5.4vw, 76px)',
                fontWeight: 900,
                letterSpacing: 'clamp(-2px, -0.05em, -3.6px)',
                lineHeight: 1.0,
                margin: 0,
                color: '#0C0C0B',
                maxWidth: '880px',
              }}
            >
              What content actually costs, and what it{' '}
              <span style={{ color: '#E8541A' }}>actually returns.</span>
            </h1>
            <p
              style={{
                marginTop: '20px',
                fontSize: '16px',
                lineHeight: 1.7,
                color: '#6E6B63',
                maxWidth: '620px',
              }}
            >
              Real pricing, honest comparisons, and the systems behind founder-led content.
              Written by the people doing the work, with every number sourced.
            </p>
          </div>

          {/* Filters + featured + list (interactive) */}
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <BlogIndexClient posts={indexPosts} />
          )}
        </div>

        <style>{`
          @media (max-width: 900px) {
            .blog-main { padding-top: 100px !important; padding-bottom: 80px !important; }
            .blog-inner { padding: 0 32px !important; }
          }
          @media (max-width: 720px) {
            .blog-main { padding-top: 80px !important; padding-bottom: 64px !important; }
            .blog-inner { padding: 0 20px !important; }
            .blog-header { margin-bottom: 32px !important; }
          }
          @media (max-width: 480px) {
            .blog-main { padding-top: 72px !important; padding-bottom: 56px !important; }
            .blog-inner { padding: 0 16px !important; }
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
