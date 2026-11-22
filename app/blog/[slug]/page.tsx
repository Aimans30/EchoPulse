import { cache } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BlogContent from '@/components/BlogContent';
import BlogFooterCTA from '@/components/BlogFooterCTA';
import BlogInlineCTA from '@/components/BlogInlineCTA';
import BlogSideCTA from '@/components/BlogSideCTA';
import BlogEmailCapture from '@/components/BlogEmailCapture';
import BlogStickyBar from '@/components/BlogStickyBar';
import { audienceFor, blogAskFor, blogBookUrl } from '@/lib/blogLinks';
import { FREE_EDITS_URL } from '@/lib/links';
import TableOfContents from '@/components/TableOfContents';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts, resolveCategory, resolveAuthor, type BlogPostSummary } from '@/lib/blog';
import { BLOG_SEO } from '@/lib/seoOverrides';
import { sanityClient, urlFor } from '@/lib/sanity';
import { extractHeadings } from '@/lib/toc';
import { extractFaqPairs, buildFaqPageLd } from '@/lib/faqSchema';

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

/**
 * One Sanity fetch per request, shared by generateMetadata and the page, so
 * the two can never disagree about whether the post loaded.
 */
const loadPost = cache((slug: string) => getPostBySlug(slug));

export async function generateStaticParams() {
  // If Sanity is unreachable at build time, build anyway: posts are then
  // rendered on first request instead of failing the whole deploy.
  const slugs = await getAllPostSlugs().catch(() => [] as string[]);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  // A failed fetch is not handled here: the page makes the same (shared) call
  // and throws, which is what shows app/blog/[slug]/error.tsx.
  const post = await loadPost(slug).catch(() => null);
  if (!post) return {};
  const seo = BLOG_SEO[slug];

  const ogImage = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').auto('format').url()
    : post.mainImageUrl || undefined;

  return {
    // `absolute`, not a bare string. The root layout sets
    // `template: "%s | EchoPulse Media"`, which silently wraps any plain-string
    // title from a child route. Every one of the ~43 posts was therefore
    // shipping as "<full post title> | EchoPulse Media" — and these titles are
    // already written as standalone SEO titles at 60 to 80 characters, so the
    // suffix pushed them well past Google's truncation point and the tail of
    // the actual headline was being cut off in the SERP.
    //
    // This is the same bug already fixed on /about, /services/* and /[icp];
    // blog posts were the one route type missed.
    title: { absolute: seo?.title || post.title },
    description: seo?.description || post.excerpt || `Read "${post.title}" on the EchoPulse blog.`,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title: seo?.title || post.title,
      description: seo?.description || post.excerpt || '',
      url: `${SITE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      // No modifiedTime: _updatedAt moves on every bulk edit, which would
      // claim false freshness. The real re-check date is in the JSON-LD.
      authors: [resolveAuthor(post.author)],
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title || post.title,
      description: seo?.description || post.excerpt || '',
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

// Revalidate individual posts every 60s so edits in Sanity Studio appear quickly.
export const revalidate = 60;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  // Headings for the sticky sidebar TOC — derived from the post body so it
  // stays in sync with whatever the author writes in Sanity. Same slug logic
  // that BlogContent uses to stamp heading ids, so the anchors line up.
  const headings = extractHeadings(post.content);

  // Related posts for the bottom strip — prefer same category, fill with recent.
  // Related posts are a nice-to-have: a failed fetch must not take the article down.
  const related = await getRelatedPosts(slug, post.category, 3).catch(() => [] as BlogPostSummary[]);
  // Which ICP + service page this article should send readers to. The `icp`
  // and `service` the publisher stored on the document decide it; the keyword
  // guess from the slug and title is only the fallback for older posts that
  // have neither. A failed read falls back the same way, never a 500.
  const stored = await sanityClient
    .fetch<{ icp?: string | null; service?: string | null; lastChecked?: string | null } | null>(
      `*[_type == "blog" && slug.current == $slug][0]{ icp, service, lastChecked }`,
      { slug },
      { next: { revalidate: 60 } },
    )
    .catch(() => null);
  const audience = audienceFor(post, stored);
  // What the post asks for (free sample or the call), keyed off its service.
  const ask = blogAskFor(audience.service);

  const headerImageSrc = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').auto('format').url()
    : post.mainImageUrl || null;

  // The cover is the article's LCP element on a phone. It was requested at a
  // flat 1600px wide with no width/height attributes, so a 390px handset
  // downloaded a desktop-sized file AND reflowed the byline when it decoded.
  // 1200x630 (the cover's own ratio) when we sized it ourselves; parsed from the filename otherwise.
  const headerImageDims = post.mainImage?.asset
    ? { w: 1200, h: 630 }
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
  // Uses the stored "Last checked" date, never _updatedAt (bulk field edits
  // bump _updatedAt on every post, which would be a false freshness signal).
  const checkedAt = stored?.lastChecked ?? null;
  const showUpdated =
    checkedAt &&
    post.publishedAt &&
    new Date(checkedAt).getTime() - new Date(post.publishedAt).getTime() >
      24 * 60 * 60 * 1000;
  const updatedLabel = showUpdated ? fmtDate(checkedAt) : null;

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
    // The date the post's content was last re-checked (the publisher stores
    // `lastChecked` from the "Last checked:" line), never _updatedAt: bulk
    // field edits bump _updatedAt on every post, and claiming those as
    // modifications is the fake freshness Google's guidance warns about.
    dateModified:
      stored?.lastChecked && post.publishedAt && stored.lastChecked > post.publishedAt.slice(0, 10)
        ? stored.lastChecked
        : post.publishedAt || undefined,
    // Typed and named in place, with the same @id as the Person and
    // Organization nodes in the root layout, so a parser that does not
    // resolve @id references still sees who wrote and who published it.
    author:
      authorName === 'Lakshya Soni'
        ? {
            '@type': 'Person',
            '@id': `${SITE_URL}/about/lakshya-soni#person`,
            name: 'Lakshya Soni',
            url: `${SITE_URL}/about/lakshya-soni`,
          }
        : { '@type': 'Person', name: authorName },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'EchoPulse Media',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-512.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slug}` },
    // Full ImageObject rather than a bare URL string: gives the cover image a
    // caption and creator, which is what makes it eligible for image search
    // and lets AI attribute the visual when it summarises the post.
    image: headerImageSrc
      ? {
          '@type': 'ImageObject',
          url: headerImageSrc,
          ...(headerImageDims ? { width: headerImageDims.w, height: headerImageDims.h } : {}),
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

  // FAQPage schema — only for posts that genuinely have a visible FAQ section.
  //
  // Derived from `post.content`, the exact array BlogContent renders below, so
  // the markup cannot claim a question the reader cannot see. extractFaqPairs
  // returns [] whenever the post has no FAQ section or the section does not
  // parse cleanly, and then nothing is emitted; see lib/faqSchema.ts for the
  // heading rules and the validity gates, and for why a loose "contains the
  // word questions" test would have fabricated Q&A on several posts.
  //
  // This is safe here in a way it was NOT safe in components/FAQ.tsx: that
  // accordion once unmounted collapsed answers, so the served HTML held one
  // answer while the schema claimed all eight. Article bodies collapse nothing.
  const faqPairs = extractFaqPairs(post.content);
  const faqLd = buildFaqPageLd(faqPairs, `${SITE_URL}/blog/${slug}`);

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
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
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
              className="blog-post-h1"
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
                className="blog-post-excerpt"
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
              const avatarSrc = isFounder ? '/founder-avatar.jpg' : '/logo-128.png';
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
                    objectFit: 'cover',
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
                  width={1200}
                  height={630}
                  loading="eager"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: 'auto',
                    // Full 1200x630 cover, never cropped: the headline is
                    // typeset into the left half of the image itself.
                    aspectRatio: '1200 / 630',
                    objectFit: 'cover',
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

            {/* Body content. The first ask sits directly after the answer
                paragraph (the first paragraph of the body) on every screen
                size: these posts answer the question up top, and on a phone
                the old slot before the second H2 was seven screens down. A
                compact repeat sits about two thirds of the way down. Both are
                plain links; see components/BlogInlineCTA. */}
            {post.content && post.content.length > 0 ? (
              (() => {
                const blocks = post.content;
                const h2s = blocks
                  .map((b, i) => (b._type === 'block' && (b as { style?: string }).style === 'h2' ? i : -1))
                  .filter((i) => i > 0);
                const firstPara = blocks.findIndex((b) => {
                  const blk = b as { _type?: string; style?: string; listItem?: string };
                  return blk._type === 'block' && (blk.style ?? 'normal') === 'normal' && !blk.listItem;
                });
                const introEnd = firstPara >= 0 ? firstPara + 1 : Math.min(1, blocks.length);
                const midIdx = h2s.length >= 4 ? h2s[Math.floor(h2s.length * 0.66)] : -1;
                const parts: Array<{ key: string; value: typeof blocks; after?: 'intro' | 'mid' }> = [];
                if (midIdx > introEnd) {
                  parts.push({ key: 'a', value: blocks.slice(0, introEnd), after: 'intro' });
                  parts.push({ key: 'b', value: blocks.slice(introEnd, midIdx), after: 'mid' });
                  parts.push({ key: 'c', value: blocks.slice(midIdx) });
                } else {
                  parts.push({ key: 'a', value: blocks.slice(0, introEnd), after: 'intro' });
                  parts.push({ key: 'b', value: blocks.slice(introEnd) });
                }
                return parts.map((part) => (
                  <div key={part.key}>
                    {part.value.length > 0 ? <BlogContent value={part.value} /> : null}
                    {part.after ? <BlogInlineCTA icp={audience.icp} service={audience.service} variant={part.after} slug={slug} /> : null}
                  </div>
                ));
              })()
            ) : (
              <p style={{ color: '#6E6B63', fontStyle: 'italic' }}>
                This post is being written. Check back soon.
              </p>
            )}

            {/* Closing card: one offer, above the newsletter form and Related
                Articles. See components/BlogFooterCTA. */}
            <BlogFooterCTA ask={ask} bookUrl={blogBookUrl('blog_footer', slug)} category={resolveCategory(post)} />

            <BlogEmailCapture />
          </article>

          {/* Right rail: sticky offer cards, desktop only (hidden under 1280px,
              where the inline CTAs in the article do the same job). */}
          <aside className="blog-post-rail">
            <BlogSideCTA icp={audience.icp} service={audience.service} slug={slug} />
          </aside>
        </div>

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

        {/* Phone only: one-line bar with the same single button as the first
            in-article card, shown after 50% scroll. See BlogStickyBar. */}
        <BlogStickyBar
          kind={ask.kind}
          label={ask.buttonLabel}
          href={ask.kind === 'sample' ? FREE_EDITS_URL : blogBookUrl('sticky_bar', slug)}
        />

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
            min-height: 44px;
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
          .blog-post-rail { display: none; }
          @media (min-width: 1280px) {
            .blog-post-layout {
              max-width: 1400px;
              grid-template-columns: 240px minmax(0, 760px) 280px;
              gap: 44px;
              justify-content: center;
            }
            .blog-post-rail {
              display: block;
              position: sticky;
              top: 120px;
              align-self: start;
            }
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
            /* Matches MagicBnB: sticky, self-start, whole index visible at
               once, riding along with the page. No internal scrollbar in the
               normal case.

               The max-height is a safety net, not the default behaviour. A
               sticky element taller than the space under its own top offset
               sticks with its bottom hanging below the fold, so on a long post
               the last few entries become permanently unreachable and the
               sidebar reads as frozen. MagicBnB never hits this because its
               posts carry fewer headings in a narrower column. Ours do not: the
               AI-tools-vs-ghostwriter post has sixteen.

               So the cap engages ONLY when the index genuinely cannot fit, and
               the scrollbar is hidden when it does, which is the part that was
               objectionable last time. Identical to MagicBnB whenever MagicBnB's
               own sidebar would also have fitted. */
            /* The scroll moved off this element and onto .blog-toc-list (see
               TableOfContents). When the whole aside scrolled, following the
               active heading pushed the card's rounded top and its "Quick
               navigation" label out of view, so the index looked sliced off
               under the nav with no way to tell it was scrollable. The card
               now stays whole and only the list inside it scrolls. */
          }

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
            .blog-post-h1 { font-size: 30px !important; letter-spacing: -1px !important; line-height: 1.1 !important; overflow-wrap: break-word; }
            .blog-post-excerpt { font-size: 17px !important; line-height: 1.6 !important; margin-bottom: 24px !important; }
            .blog-post-crumb-link { min-height: 44px; }
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
    ? urlFor(post.mainImage).width(840).height(441).fit('crop').auto('format').url()
    : post.mainImageUrl || null;

  // Three cards on desktop, one full-width card on a phone. The card is never
  // wider than ~350px on the widest layout, so a 700px source was two to three
  // times more pixels than any screen resolves.
  const dims = post.mainImage?.asset ? { w: 840, h: 441 } : sanityDims(post.mainImageUrl);
  const optimizable = isOptimizableHost(imageSrc) && !!dims;
  // Covers are a designed 1200x630 composition (title left, illustration
  // right). Cropping to 16/9 cut the start of the headline on every related
  // card, so the full frame is shown instead.
  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    aspectRatio: '1200 / 630',
    objectFit: 'cover',
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
              width={840}
              height={441}
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
