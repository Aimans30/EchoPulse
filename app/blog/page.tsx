import Link from 'next/link';
import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getAllPosts, type BlogPostSummary } from '@/lib/blog';
import { urlFor } from '@/lib/sanity';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    "EchoPulse's blog — long-form notes on content strategy, voice work, video editing, and the AI-as-infrastructure approach behind everything we ship.",
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | EchoPulse',
    description:
      'Long-form notes on content strategy, voice work, and the AI-as-infrastructure approach behind everything EchoPulse ships.',
    url: 'https://echopulse.media/blog',
    type: 'website',
  },
};

// Revalidate the blog index once a minute. Long enough to keep CDN hits cheap,
// short enough that new posts appear without a redeploy.
export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Nav />
      <main
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
          <div className="blog-header" style={{ marginBottom: '64px' }}>
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
              The EchoPulse Blog
            </div>
            <h1
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(44px, 6vw, 88px)',
                fontWeight: 900,
                letterSpacing: 'clamp(-2px, -0.05em, -4px)',
                lineHeight: 0.98,
                margin: 0,
                color: '#0C0C0B',
              }}
            >
              Notes on craft, <span style={{ color: '#E8541A' }}>voice,</span> and shipping content that lands.
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
              Long-form thinking from EchoPulse on content strategy, voice work, video editing, and the AI-as-infrastructure approach behind everything we ship.
            </p>
          </div>

          {/* Posts grid */}
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>

        <style>{`
          /* CSS-only hover lift for blog cards — avoids JS handlers on a
             Server Component child. */
          .blog-card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 36px rgba(12,12,11,0.10);
          }
          .blog-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 28px;
          }
          @media (max-width: 900px) {
            .blog-main { padding-top: 100px !important; padding-bottom: 80px !important; }
            .blog-inner { padding: 0 32px !important; }
          }
          @media (max-width: 720px) {
            .blog-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
            .blog-main { padding-top: 80px !important; padding-bottom: 64px !important; }
            .blog-inner { padding: 0 20px !important; }
            .blog-header { margin-bottom: 40px !important; }
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

// ── Single post card ────────────────────────────────────────────────
function BlogCard({ post }: { post: BlogPostSummary }) {
  const imageSrc = post.mainImage?.asset
    ? urlFor(post.mainImage).width(900).height(540).fit('crop').auto('format').url()
    : post.mainImageUrl || null;

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      data-cursor-hover
    >
      <article
        // CSS-only hover so this Server Component can render us without
        // tripping the "Event handlers can't be passed to Client Component
        // props" error. The `.blog-card-hover` class hosts the lift effect.
        className="blog-card-hover"
        style={{
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(12,12,11,0.06)',
          borderRadius: '18px',
          overflow: 'hidden',
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={post.title}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              aspectRatio: '16/9',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        )}
        <div style={{ padding: '24px 26px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              fontSize: '11px',
              letterSpacing: '0.4px',
              color: '#6E6B63',
              marginBottom: '10px',
              fontWeight: 600,
            }}
          >
            {dateLabel && <span>{dateLabel}</span>}
            {dateLabel && post.readTime && <span style={{ opacity: 0.4 }}>·</span>}
            {post.readTime && <span>{post.readTime} min read</span>}
          </div>
          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '-0.6px',
              lineHeight: 1.2,
              margin: '0 0 12px',
              color: '#0C0C0B',
            }}
          >
            {post.title}
          </h2>
          {post.excerpt && (
            <p
              style={{
                fontSize: '14.5px',
                lineHeight: 1.65,
                color: '#6E6B63',
                margin: 0,
                flex: 1,
              }}
            >
              {post.excerpt}
            </p>
          )}
          {post.author && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(12,12,11,0.06)',
                fontSize: '12.5px',
                color: '#A8A49B',
                fontWeight: 500,
              }}
            >
              By {post.author}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
