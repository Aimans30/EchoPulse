import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: 'qkz53g2a',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Set to false to avoid CORS issues in development
  perspective: 'published',
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  author?: string;
  readTime?: number;
  mainImage?: any;
  mainImageUrl?: string;
  content?: any[];
}
