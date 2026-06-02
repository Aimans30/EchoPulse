import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Sanity client for EchoPulse blog.
 *
 * Project + dataset are set in the Sanity Studio (blog-for-echopulse/sanity.config.ts).
 * We mirror them here so the main Next.js app can query the same content.
 *
 * Env vars (set in .env.local for dev, in Vercel/Netlify dashboard for prod):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=qkz53g2a
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *
 * Defaults are fine for now — the project is public-readable.
 */
export const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qkz53g2a';
export const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const SANITY_API_VERSION = '2024-01-01';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true, // CDN reads are free + cached. Disable only if you need real-time previews.
  perspective: 'published',
});

const builder = imageUrlBuilder(sanityClient);

/**
 * Use to build URLs for any Sanity image asset (the `mainImage` field, inline
 * block images, etc.). Example:
 *
 *   <img src={urlFor(post.mainImage).width(1200).height(630).url()} />
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
