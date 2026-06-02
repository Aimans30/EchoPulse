import { sanityClient } from './sanity';
import type { PortableTextBlock } from '@portabletext/types';

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
  excerpt?: string;
  author?: string;
  readTime?: number;
  mainImage?: SanityImageRef;
  mainImageUrl?: string;
  content?: PortableTextBlock[];
};

export type BlogPostSummary = Pick<
  BlogPost,
  '_id' | 'title' | 'slug' | 'publishedAt' | 'excerpt' | 'author' | 'readTime' | 'mainImage' | 'mainImageUrl'
>;

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
    excerpt,
    author,
    readTime,
    mainImage,
    mainImageUrl
  }`;
  return sanityClient.fetch(query, {}, { next: { revalidate: 60 } });
}

/**
 * Fetch one blog post by slug. Used by /blog/[slug].
 * Returns null if not found.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = `*[_type == "blog" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    author,
    readTime,
    mainImage,
    mainImageUrl,
    content
  }`;
  const post = await sanityClient.fetch<BlogPost | null>(
    query,
    { slug },
    { next: { revalidate: 60 } },
  );
  return post ?? null;
}

/**
 * Return only the slugs — used by generateStaticParams() at build time
 * so each post becomes a pre-rendered static page.
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const query = `*[_type == "blog" && defined(slug.current)].slug.current`;
  return sanityClient.fetch<string[]>(query);
}
