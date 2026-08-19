import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BlogContent from '@/components/BlogContent';
import BlogFooterCTA from '@/components/BlogFooterCTA';
import TableOfContents from '@/components/TableOfContents';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts, resolveCategory, resolveAuthor, type BlogPostSummary } from '@/lib/blog';
import { urlFor } from '@/lib/sanity';
import { extractHeadings } from '@/lib/toc';

const SITE_URL = 'https://echopulse.media';

/**
 * next.config.ts whitelists a fixed list of remote image hosts. `mainImageUrl`
 * is a free-form string field in Sanity and older posts point at hosts that
 * were never on that list, so an unguarded <Image> would throw at render and
 * 500 the article. Anything not known-good keeps the plain <img> path.
 */
function isOptimizableHost(url?: string | null): boolean {
  if (!url) return false;
  return url.startsWith('/') || url.startsWith('https://cdn.sanity.io/');
}

/**
 * Sanity CDN filenames carry their intrinsic size (`<hash>-1200x630.png`).
 * next/image needs a width and height to reserve the box before the bytes
 * land, and reading it off the URL is what removes the layout shift the
 * covers were causing partway down the article on every phone load.
 */
function sanityDims(url?: string | null): { w: number; h: number } | null {
  if (!url) return null;
  const m = url.match(/-(\d{2,5})x(\d{2,5})(?:[-.]|$)/);
  if (!m) return null;
  const w = Number(m[1]);
  const h = Number(m[2]);
  return w > 0 && h > 0 ? { w, h } : null;
}

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
      modifiedTime: post._updatedAt,
      authors: [resolveAuthor(post.author)],
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

  // The cover is the article's LCP element on a phone. It was requested at a
  // flat 1600px wide with no width/height attributes, so a 390px handset
  // downloaded a desktop-sized file AND reflowed the byline when it decoded.
  // 16/9 when we cropped it ourselves; parsed from the filename otherwise.
  const headerImageDims = post.mainImage?.asset
    ? { w: 1600, h: 900 }
    : sanityDims(post.mainImageUrl);
  const headerImageOptimizable = isOptimizableHost(headerImageSrc) && !!headerImageDims;
  // The article column tops out at 760px, so nothing wider is ever painted.
  const HEADER_SIZES = '(max-width: 900px) 100vw, 760px';

  // Word count for BlogPosting schema. Walks the portable-text blocks and sums
  // the spans; depth signals matter to answer engines deciding whether a page
  // is substantive enough to quote.
  const wordCount = Array.isArray(post.content)
    ? post.content.reduce((total: number, block: unknown) => {
        const b = block as { _type?: string; children?: { text?: string }[] };
        if (b?._type !== 'block' || !Array.isArray(b.children)) return total;
        const text = b.children.map((c) => c?.text ?? '').join(' ').trim();
        return total + (text ? text.split(/\s+/).length : 0);
      }, 0)
    : 0;

  const fmtDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : null;

  const dateLabel = fmtDate(post.publishedAt);
  // Show an "Updated" date only when the post was meaningfully revised after
  // publishing (more than a day later), so recency is visible to readers and
  // answer engines without showing a redundant "updated = published" line.
  const showUpdated =
    post._updatedAt &&
    post.publishedAt &&
    new Date(post._updatedAt).getTime() - new Date(post.publishedAt).getTime() >
      24 * 60 * 60 * 1000;
  const updatedLabel = showUpdated ? fmtDate(post._updatedAt) : null;

  // Named, human author — strongest E-E-A-T / AI-citation signal we have.
  const authorName = resolveAuthor(post.author);

  // Article schema for AI agents + search engines. datePublished +
  // dateModified + a named Person author are the recency/authorship signals
  // answer engines weight most heavily.
  const articleLd = {
    '@context': 'https://schema.org',
    // BlogPosting is a narrower subtype of Article. Being specific helps
    // answer engines classify the page instead of guessing.
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post._updatedAt || post.publishedAt || undefined,
    // @id reference wires the byline into the Person node declared once in the
    // root layout, so "Lakshya Soni" resolves to a single entity across the
    // whole site rather than a bare string repeated on 43 pages.
    author:
      authorName === 'Lakshya Soni'
        ? { '@id': `${SITE_URL}/#founder` }
        : { '@type': 'Person', name: authorName },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slug}` },
    // Full ImageObject rather than a bare URL string: gives the cover image a
    // caption and creator, which is what makes it eligible for image search
    // and lets AI attribute the visual when it summarises the post.
    image: headerImageSrc
      ? {
          '@type': 'ImageObject',
          url: headerImageSrc,
          caption: post.title,
          creditText: 'EchoPulse Media',
          creator: { '@id': `${SITE_URL}/#organization` },
        }
      : undefined,
    // articleSection maps to the category taxonomy, so a crawler can see this
    // post belongs to a topical cluster rather than sitting on its own.
    articleSection: resolveCategory(post) || undefined,
    inLanguage: 'en',
    isAccessibleForFree: true,
    wordCount: wordCount || undefined,
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
      {/* id="main" — target of the layout's skip-to-content link. */}
      <main
        id="main"
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
            {/* Meta row — category pill + published date + updated date + read time */}
            <div className="blog-post-meta">
              <span className="blog-post-category">{resolveCategory(post)}</span>
              {dateLabel && <span className="blog-post-meta-text">{dateLabel}</span>}
              {updatedLabel && <span className="blog-post-meta-dot" aria-hidden="true">·</span>}
              {updatedLabel && (
                <span className="blog-post-meta-text">Updated {updatedLabel}</span>
              )}
              {(dateLabel || updatedLabel) && post.readTime && <span className="blog-post-meta-dot" aria-hidden="true">·</span>}
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

            {/* Author byline — always shown with a named human author. Falls
                back to the founder (Lakshya) when Sanity has no real author, so
                no post is left faceless. Named authorship + a real headshot is
                one of the strongest E-E-A-T / AI-citation trust signals. */}
            {(() => {
              const isFounder = authorName === 'Lakshya Soni';
              // founder-avatar.jpg, not founder.jpg. The byline renders a ~44px
              // circle, so the 150x150 avatar crop is the right source here and
              // saves shipping a 789KB 1487x1594 portrait to every reader.
              // /about keeps the full-resolution founder.jpg for its 420x520
              // portrait, which this crop is far too small to serve.
              const avatarSrc = isFounder ? '/founder-avatar.jpg' : '/logo.png';
              return (
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
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: '#0C0C0B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* 44px on screen, so 44px is all any device should ever
                        download. The raw tag was shipping the full-resolution
                        founder headshot to every phone for a thumbnail. */}
                    <Image
                      src={avatarSrc}
                      alt={isFounder ? authorName : ''}
                      aria-hidden={isFounder ? undefined : true}
                      width={44}
                      height={44}
                      sizes="44px"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0C0C0B' }}>
                      {isFounder ? (
                        <a
                          href="https://www.linkedin.com/in/lakshyasoni/"
                          target="_blank"
                          rel="author noopener noreferrer"
                          style={{ color: '#0C0C0B', textDecoration: 'none' }}
                          data-cursor-hover
                        >
                          {authorName}
                        </a>
                      ) : (
                        authorName
                      )}
                    </div>
                    {isFounder && (
                      <div style={{ fontSize: '12.5px', color: '#6E6B63', marginTop: '2px', lineHeight: 1.4 }}>
                        Founder, EchoPulse Media · writes about content, video & AEO
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Hero image */}
            {headerImageSrc && (
              headerImageOptimizable && headerImageDims ? (
                <Image
                  src={headerImageSrc}
                  alt={post.title}
                  width={headerImageDims.w}
                  height={headerImageDims.h}
                  sizes={HEADER_SIZES}
                  priority
                  style={{
                    width: '100%',
                    height: 'auto',
                    // Full 1200x630 cover, never cropped: the headline is
                    // typeset into the left half of the image itself.
                    aspectRatio: '1200 / 630',
                    objectFit: 'contain',
                    borderRadius: '18px',
                    marginBottom: '40px',
                    display: 'block',
                    boxShadow: '0 16px 40px rgba(12,12,11,0.10)',
                  }}
                />
              ) : (
                // Legacy posts point mainImageUrl at hosts next.config.ts does
                // not whitelist. aspect-ratio still reserves the box, so the
                // shift is fixed even where the byte saving is not available.
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={headerImageSrc}
                  alt={post.title}
                  width={1600}
                  height={900}
                  loading="eager"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: 'auto',
                    // Full 1200x630 cover, never cropped: the headline is
                    // typeset into the left half of the image itself.
                    aspectRatio: '1200 / 630',
                    objectFit: 'contain',
                    borderRadius: '18px',
                    marginBottom: '40px',
                    display: 'block',
                    boxShadow: '0 16px 40px rgba(12,12,11,0.10)',
                  }}
                />
              )
            )}

            {/* Collapsed section index. The sticky sidebar is display:none
                under 1024px, so without this a phone reader had no way to move
                around a long post other than scrolling it end to end. */}
            <TableOfContents headings={headings} variant="mobile" />

            {/* Body content */}
            {post.content && post.content.length > 0 ? (
              <BlogContent value={post.content} />
            ) : (
              <p style={{ color: '#6E6B63', fontStyle: 'italic' }}>
                This post is being written. Check back soon.
              </p>
            )}

            {/* Footer CTA — topic-aware chip, price-anchored, split into a
                primary checkout path and a lower-commitment call option.
                See components/BlogFooterCTA.tsx for why. */}
            <BlogFooterCTA category={resolveCategory(post)} />
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
            cursor: pointer;
          }
          /* Hide the system cursor only where the custom dot cursor replaces
             it. On touch, cursor:none just removes an affordance. */
          @media (hover: hover) and (pointer: fine) {
            .blog-post-crumb-link { cursor: none; }
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

          /* The sticky sidebar.
             This has to live on .blog-post-sidebar, the direct grid child, not
             on the .blog-toc nav inside it. A sticky element can only travel
             within its containing block, and because this grid sets
             align-items: start, the aside collapsed to exactly its content
             height. The nav inside was therefore already flush against the
             bottom of its container and had nowhere to move, so it read as a
             plain static box no matter that it declared position: sticky.
             Moving the stickiness one level up makes the containing block the
             full-height grid area instead, which is the travel room it needs.
             top matches the fixed nav height so it parks just below it. */
          .blog-post-sidebar {
            position: sticky;
            top: 120px;
            align-self: start;
          }
          /* No max-height and no overflow here on purpose. An earlier version
             capped the height and scrolled the index internally, which meant
             the sidebar had its own scrollbar and its own scroll position
             fighting the page's. The whole index is shown at once and simply
             rides along with the page, which is how the MagicBnB sidebar this
             was modelled on behaves. */

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
            .blog-post-layout, .blog-post-breadcrumb, .blog-post-related { padding: 0 18px !important; }
          }

          /* globals.css carries a blanket mobile rule, \`main article {
             padding-left: 18px !important; padding-right: 18px !important }\`.
             It stacks ON TOP of the 18-20px this layout already applies, so a
             360px phone was reading a ~284px measure (roughly 38 characters a
             line, well under the 45-75 comfortable range) and every related
             card had its flush cover image inset by 18px on both sides.
             A single-class selector out-specifies the two-element one, so the
             double padding is cancelled here without touching a global sheet
             that other pages depend on. */
          @media (max-width: 900px) {
            .blog-post-article,
            .blog-related-card {
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
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

  // Three cards on desktop, one full-width card on a phone. The card is never
  // wider than ~350px on the widest layout, so a 700px source was two to three
  // times more pixels than any screen resolves.
  const dims = post.mainImage?.asset ? { w: 700, h: 420 } : sanityDims(post.mainImageUrl);
  const optimizable = isOptimizableHost(imageSrc) && !!dims;
  // Covers are a designed 1200x630 composition (title left, illustration
  // right). Cropping to 16/9 cut the start of the headline on every related
  // card, so the full frame is shown instead.
  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    aspectRatio: '1200 / 630',
    objectFit: 'contain',
    display: 'block',
  };

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
          optimizable && dims ? (
            <Image
              src={imageSrc}
              alt={post.title}
              width={dims.w}
              height={dims.h}
              sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 350px"
              style={imgStyle}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageSrc}
              alt={post.title}
              width={700}
              height={420}
              loading="lazy"
              decoding="async"
              style={imgStyle}
            />
          )
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
