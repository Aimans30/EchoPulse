import { sanityClient } from './sanity';
import type { PortableTextBlock } from '@portabletext/types';
import { DEAD_SLUGS, SLUG_ALIASES } from './redirects';

/**
 * Shape of a blog post returned by the GROQ queries below. Matches the
 * `blog` schema in blog-for-echopulse/schemaTypes/blog.ts.
 */
export type SanityImageRef = {
  asset?: { _ref?: string; _id?: string };
  hotspot?: unknown;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  _updatedAt?: string;
  category?: string;
  excerpt?: string;
  author?: string;
  readTime?: number;
  mainImage?: SanityImageRef;
  mainImageUrl?: string;
  content?: PortableTextBlock[];
};

/**
 * The site runs as an owner-operated studio, so every post is authored by the
 * founder unless Sanity explicitly names someone else. Named, human authorship
 * is a strong E-E-A-T / AI-citation signal — far stronger than a faceless
 * "EchoPulse Team" byline, which we treat as "no real author set".
 */
export const DEFAULT_AUTHOR = 'Lakshya Soni';

/**
 * Resolve the human author to display + put in structured data. A real,
 * specific author set in Sanity wins; the generic "EchoPulse Team" placeholder
 * (or an empty field) resolves to the founder so no post is left faceless.
 */
export function resolveAuthor(author?: string): string {
  const a = author?.trim();
  if (!a || /^echopulse(\s+team)?$/i.test(a) || /^team$/i.test(a)) {
    return DEFAULT_AUTHOR;
  }
  return a;
}

export type BlogPostSummary = Pick<
  BlogPost,
  '_id' | 'title' | 'slug' | 'publishedAt' | 'category' | 'excerpt' | 'author' | 'readTime' | 'mainImage' | 'mainImageUrl'
>;

/**
 * Keyword → category rules, checked in order. First match wins, so put more
 * specific topics before broad ones. Each entry: [category label, keywords].
 * Keywords are matched case-insensitively against the post title.
 */
const CATEGORY_RULES: Array<[string, string[]]> = [
  ['Real Estate', ['airbnb', 'real estate', 'realtor', 'agent', 'property', 'host', 'str ', 'short-term rental']],
  ['AI Marketing', ['ai marketing', 'ai content', 'ai stack', 'ai agent', 'agentic', 'world model', 'chatgpt', 'gemini', 'llm', 'ai search', 'ai overview']],
  ['Funnels', ['funnel', 'cac', 'roas', 'paid media', 'conversion', 'lead gen', 'lead generation']],
  ['Video', ['video', 'short-form', 'youtube', 'reels', 'editing', 'retention', '4k', '1080p', 'vertical video', 'podcast']],
  ['Authority', ['authority', 'founder brand', 'personal brand', 'positioning', 'thought leadership', 'premium', 'high-ticket', 'high ticket']],
  ['Content Ops', ['batch production', 'content pipeline', 'repurpos', 'content engine', 'production system', 'workflow', 'content assets']],
  ['SEO', ['seo', 'entity-based', 'google search', 'rank']],
  ['Social', ['social media', 'linkedin', 'instagram', 'algorithm', 'b2b marketing']],
  ['Automation', ['automation', 'manychat', 'crm', 'pipeline']],
  ['Strategy', ['business', 'scale', 'scaling', 'systems', 'operational', 'growth', 'roi', 'framework']],
  ['Company', ['echopulse', 'partner', 'certified']],
];

/**
 * Resolve the category to display for a post. A real `category` set in Sanity
 * always wins; otherwise we derive one from the title via CATEGORY_RULES so
 * every post gets a sensible pill without manual data entry. Falls back to
 * "Insights" if nothing matches.
 */
export function resolveCategory(post: Pick<BlogPostSummary, 'category' | 'title'>): string {
  if (post.category && post.category.trim()) return post.category.trim();
  const title = post.title.toLowerCase();
  for (const [label, keywords] of CATEGORY_RULES) {
    if (keywords.some((kw) => title.includes(kw))) return label;
  }
  return 'Insights';
}

/**
 * Fetch every published blog post, newest first.
 * Used by the /blog index page.
 */
export async function getAllPosts(): Promise<BlogPostSummary[]> {
  const query = `*[_type == "blog" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    excerpt,
    author,
    readTime,
    mainImage,
    mainImageUrl
  }`;
  return sanityClient.fetch(query, {}, { next: { revalidate: 60 } });
}

/**
 * Fetch up to `limit` other posts to show as "Related Articles" at the bottom
 * of a post. Prefers same-category posts, then fills with the most recent
 * others. Excludes the post being viewed.
 */
export async function getRelatedPosts(
  currentSlug: string,
  category: string | undefined,
  limit = 3,
): Promise<BlogPostSummary[]> {
  const query = `*[
    _type == "blog" &&
    defined(slug.current) &&
    slug.current != $currentSlug &&
    !(slug.current in $dead)
  ] | order(
    select(category == $category => 0, 1),
    coalesce(publishedAt, _createdAt) desc
  )[0...$limit]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    excerpt,
    author,
    readTime,
    mainImage,
    mainImageUrl
  }`;
  // Redirected slugs are dropped in GROQ and again here, so a stale cached
  // response can never put a link that 308s into the Related strip.
  const dead = new Set(DEAD_SLUGS);
  const rows = await sanityClient.fetch<BlogPostSummary[]>(
    query,
    { currentSlug, category: category ?? null, limit: limit + 5, dead: DEAD_SLUGS },
    { next: { revalidate: 60 } },
  );
  return rows.filter((r) => !dead.has(r.slug)).slice(0, limit);
}

/**
 * Fetch one blog post by slug. Used by /blog/[slug].
 * Returns null if not found.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // A renamed post may still sit at its old slug in Sanity (SLUG_ALIASES).
  const slugs = SLUG_ALIASES[slug] ? [slug, SLUG_ALIASES[slug]] : [slug];
  const query = `*[_type == "blog" && slug.current in $slugs] | order(select(slug.current == $slug => 0, 1) asc)[0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    category,
    excerpt,
    author,
    readTime,
    mainImage,
    mainImageUrl,
    content
  }`;
  let post: BlogPost | null;
  try {
    post = await sanityClient.fetch<BlogPost | null>(query, { slug, slugs }, { next: { revalidate: 60 } });
  } catch {
    // One retry, against Sanity's live API instead of its CDN (a different
    // host), for a transient network or CDN failure. A second failure is
    // rethrown on purpose: during a background revalidation Next keeps serving
    // the last good copy of the page when the render throws, whereas returning
    // null here would replace a live article with a cached 404.
    post = await sanityClient
      .withConfig({ useCdn: false })
      .fetch<BlogPost | null>(query, { slug, slugs }, { next: { revalidate: 60 } });
  }
  return post ? { ...post, slug } : null;
}

/**
 * Return only the slugs — used by generateStaticParams() at build time
 * so each post becomes a pre-rendered static page.
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const query = `*[_type == "blog" && defined(slug.current)].slug.current`;
  return sanityClient.fetch<string[]>(query);
}
