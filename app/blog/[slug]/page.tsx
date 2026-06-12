import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BlogContent from '@/components/BlogContent';
import TableOfContents from '@/components/TableOfContents';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts, resolveCategory, type BlogPostSummary } from '@/lib/blog';
import { urlFor } from '@/lib/sanity';
import { extractHeadings } from '@/lib/toc';

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

  // Headings for the sticky sidebar TOC — derived from the post body so it
  // stays in sync with whatever the author writes in Sanity. Same slug logic
  // that BlogContent uses to stamp heading ids, so the anchors line up.
  const headings = extractHeadings(post.content);

  // Related posts for the bottom strip — prefer same category, fill with recent.
  const related = await getRelatedPosts(slug, post.category, 3);

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
        {/* Breadcrumb — sits above the two-column layout, full content width */}
        <div className="blog-post-breadcrumb">
          <Link href="/blog" className="blog-post-crumb-link" data-cursor-hover>
            <span aria-hidden="true">‹</span> All Articles
          </Link>
          <span className="blog-post-crumb-sep" aria-hidden="true">/</span>
          <span className="blog-post-crumb-current">{post.title}</span>
        </div>

        {/* Two-column: sticky TOC sidebar + article. Collapses to one column
            under 1024px (the .blog-toc sidebar hides via CSS). */}
        <div className="blog-post-layout">
          <aside className="blog-post-sidebar">
            <TableOfContents headings={headings} />
          </aside>

          <article className="blog-post-article">
            {/* Meta row — category pill + date + read time */}
            <div className="blog-post-meta">
              <span className="blog-post-category">{resolveCategory(post)}</span>
              {dateLabel && <span className="blog-post-meta-text">{dateLabel}</span>}
              {dateLabel && post.readTime && <span className="blog-post-meta-dot" aria-hidden="true">·</span>}
              {post.readTime && <span className="blog-post-meta-text">{post.readTime} min read</span>}
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
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: '#0C0C0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt=""
                    aria-hidden="true"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
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
        </div>

        {/* Related posts — full content width below the two-column layout */}
        {related.length > 0 && (
          <section className="blog-post-related">
            <h2 className="blog-post-related-title">Related Articles</h2>
            <div className="blog-post-related-grid">
              {related.map((rp) => (
                <RelatedCard key={rp._id} post={rp} />
              ))}
            </div>
          </section>
        )}

        <style>{`
          .blog-post-breadcrumb {
            max-width: 1180px;
            margin: 0 auto 32px;
            padding: 0 56px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            font-weight: 600;
          }
          .blog-post-crumb-link {
            color: #E8541A;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            cursor: none;
          }
          .blog-post-crumb-link:hover { text-decoration: underline; }
          .blog-post-crumb-sep { color: #C4BFB6; }
          .blog-post-crumb-current {
            color: #9a958c;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 50vw;
          }

          .blog-post-layout {
            max-width: 1180px;
            margin: 0 auto;
            padding: 0 56px;
            display: grid;
            grid-template-columns: 260px minmax(0, 1fr);
            gap: 56px;
            align-items: start;
          }
          .blog-post-article { max-width: 760px; min-width: 0; }

          .blog-post-meta {
            display: flex;
            gap: 12px;
            align-items: center;
            margin-bottom: 18px;
            flex-wrap: wrap;
          }
          .blog-post-category {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.2px;
            text-transform: uppercase;
            color: #E8541A;
            background: rgba(232,84,26,0.10);
            padding: 5px 12px;
            border-radius: 100px;
          }
          .blog-post-meta-text { font-size: 13px; font-weight: 600; color: #6E6B63; }
          .blog-post-meta-dot { color: #C4BFB6; }

          .blog-post-related {
            max-width: 1180px;
            margin: 96px auto 0;
            padding: 0 56px;
          }
          .blog-post-related-title {
            font-family: Inter, sans-serif;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.6px;
            color: #0C0C0B;
            margin: 0 0 28px;
          }
          .blog-post-related-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          .blog-related-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 36px rgba(12,12,11,0.10);
          }

          /* Below 1024px: drop the sidebar, single column */
          @media (max-width: 1024px) {
            .blog-post-layout { grid-template-columns: 1fr; gap: 0; }
            .blog-post-sidebar { display: none; }
            .blog-post-related-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 900px) {
            .blog-post-main { padding-top: 100px !important; }
            .blog-post-layout, .blog-post-breadcrumb, .blog-post-related { padding: 0 32px !important; }
          }
          @media (max-width: 720px) {
            .blog-post-main { padding-top: 84px !important; padding-bottom: 72px !important; }
            .blog-post-layout, .blog-post-breadcrumb, .blog-post-related { padding: 0 20px !important; }
            .blog-post-related { margin-top: 64px !important; }
            .blog-post-related-grid { grid-template-columns: 1fr !important; }
            .blog-post-crumb-current { max-width: 60vw; }
          }
          @media (max-width: 480px) {
            .blog-post-layout, .blog-post-breadcrumb, .blog-post-related { padding: 0 16px !important; }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}

// ── Related post card — compact version of the /blog index card ──────────
function RelatedCard({ post }: { post: BlogPostSummary }) {
  const imageSrc = post.mainImage?.asset
    ? urlFor(post.mainImage).width(700).height(420).fit('crop').auto('format').url()
    : post.mainImageUrl || null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      data-cursor-hover
    >
      <article
        className="blog-related-card"
        style={{
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(12,12,11,0.06)',
          borderRadius: '16px',
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
            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
          />
        )}
        <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span
            style={{
              fontSize: '9.5px',
              fontWeight: 800,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#E8541A',
              marginBottom: '10px',
            }}
          >
            {resolveCategory(post)}
          </span>
          <h3
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '17px',
              fontWeight: 800,
              letterSpacing: '-0.4px',
              lineHeight: 1.25,
              margin: '0 0 12px',
              color: '#0C0C0B',
              flex: 1,
            }}
          >
            {post.title}
          </h3>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#E8541A' }}>
            Read →
          </span>
        </div>
      </article>
    </Link>
  );
}
