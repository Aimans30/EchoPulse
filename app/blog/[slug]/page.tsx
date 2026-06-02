import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BlogContent from '@/components/BlogContent';
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog';
import { urlFor } from '@/lib/sanity';

const SITE_URL = 'https://echopulse.media';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const ogImage = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').auto('format').url()
    : post.mainImageUrl || undefined;

  return {
    title: post.title,
    description: post.excerpt || `Read "${post.title}" on the EchoPulse blog.`,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      url: `${SITE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

// Revalidate individual posts every 60s so edits in Sanity Studio appear quickly.
export const revalidate = 60;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const headerImageSrc = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1600).height(900).fit('crop').auto('format').url()
    : post.mainImageUrl || null;

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Article schema for AI agents + search engines
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.publishedAt || undefined,
    author: post.author
      ? { '@type': 'Person', name: post.author }
      : { '@id': `${SITE_URL}/#founder` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slug}` },
    image: headerImageSrc ? [headerImageSrc] : undefined,
  };

  // Breadcrumb schema — Home → Blog → This Post for rich-snippet eligibility.
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Nav />
      <main
        className="blog-post-main"
        style={{
          background: '#F2EEE7',
          minHeight: '100vh',
          paddingTop: '140px',
          paddingBottom: '120px',
        }}
      >
        <article className="blog-post-article" style={{ maxWidth: '760px', margin: '0 auto', padding: '0 56px' }}>
          {/* Back link */}
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#6E6B63',
              textDecoration: 'none',
              marginBottom: '32px',
            }}
            data-cursor-hover
          >
            <span aria-hidden="true">←</span> Back to all posts
          </Link>

          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              fontSize: '11px',
              letterSpacing: '0.4px',
              color: '#6E6B63',
              marginBottom: '14px',
              fontWeight: 600,
            }}
          >
            {dateLabel && <span>{dateLabel}</span>}
            {dateLabel && post.readTime && <span style={{ opacity: 0.4 }}>·</span>}
            {post.readTime && <span>{post.readTime} min read</span>}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(34px, 5vw, 56px)',
              fontWeight: 900,
              letterSpacing: 'clamp(-1.4px, -0.04em, -2.5px)',
              lineHeight: 1.05,
              margin: '0 0 18px',
              color: '#0C0C0B',
            }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              style={{
                fontSize: '19px',
                lineHeight: 1.55,
                color: '#3E3D3A',
                margin: '0 0 32px',
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Author */}
          {post.author && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '40px',
                paddingBottom: '24px',
                borderBottom: '1px solid rgba(12,12,11,0.08)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E8541A, #d94a14)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '14px',
                }}
              >
                {post.author.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0C0C0B' }}>
                {post.author}
              </div>
            </div>
          )}

          {/* Hero image */}
          {headerImageSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={headerImageSrc}
              alt={post.title}
              loading="eager"
              decoding="async"
              style={{
                width: '100%',
                aspectRatio: '16/9',
                objectFit: 'cover',
                borderRadius: '18px',
                marginBottom: '40px',
                display: 'block',
                boxShadow: '0 16px 40px rgba(12,12,11,0.10)',
              }}
            />
          )}

          {/* Body content */}
          {post.content && post.content.length > 0 ? (
            <BlogContent value={post.content} />
          ) : (
            <p style={{ color: '#6E6B63', fontStyle: 'italic' }}>
              This post is being written. Check back soon.
            </p>
          )}

          {/* Footer CTA */}
          <div
            className="blog-post-footer-cta"
            style={{
              marginTop: '72px',
              padding: '36px',
              borderRadius: '18px',
              background: '#0C0C0B',
              color: '#F2EEE7',
              textAlign: 'center',
            }}
            data-dark-bg="true"
          >
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '22px',
                fontWeight: 800,
                marginBottom: '10px',
              }}
            >
              Want your content to sound like this?
            </div>
            <p style={{ color: 'rgba(242,238,231,0.65)', margin: '0 0 22px', fontSize: '15px' }}>
              The EchoPulse Pilot is $299 for 14 days. See the work before you commit to anything monthly.
            </p>
            <Link
              href="/#pricing"
              style={{
                display: 'inline-block',
                background: '#E8541A',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: '100px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
              }}
              data-cursor-hover
            >
              See the Pilot →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
