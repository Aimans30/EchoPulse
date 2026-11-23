import map from './media-map.json';

/**
 * Preview clips and posters are served from echopulse.media (public/media)
 * instead of Cloudinary, so homepage and carousel views stop spending the
 * Cloudinary accounts' monthly credits. lib/media-map.json maps each exact
 * Cloudinary preview URL the site renders to its local copy; anything not in
 * the map (full videos in the lightbox, new clips) still loads from
 * Cloudinary. Regenerate the map after adding clips: scripts/media/sync.py.
 */
const MAP = map as Record<string, string>;

export function localMedia<T extends string | null | undefined>(url: T): T {
  if (!url) return url;
  return (MAP[url] ?? url) as T;
}
