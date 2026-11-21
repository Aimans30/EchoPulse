import pages from '../scripts/og/pages.json';

/**
 * Link preview images (Open Graph and Twitter cards).
 *
 * One static PNG per key page in public/og/<name>.png, 1200 x 627: a real
 * screenshot of the top of that page, taken from the dev server by
 * scripts/og/screenshot.mjs (pages and alt text in scripts/og/pages.json):
 *
 *   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node scripts/og/screenshot.mjs [name ...]
 *
 * Re-run it after a page's hero changes. pages.json is also where the alt
 * text lives, so update the alt when the screenshot changes. A page that has
 * no image of its own uses OG_DEFAULT.
 *
 * Next.js replaces a segment's whole `openGraph` / `twitter` object when a page
 * defines its own, so every page that sets `openGraph` must also set `images`
 * (spread `ogImages('name')`), or its link preview has no image at all.
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 627;

type OgPage = { name: string; alt: string };
const BY_NAME = new Map((pages as OgPage[]).map((p) => [p.name, p]));

export type OgImageKey = string;

export function ogImage(name: OgImageKey = 'default') {
  const page = BY_NAME.get(name) ?? BY_NAME.get('default')!;
  const file = BY_NAME.has(name) ? name : 'default';
  return { url: `/og/${file}.png`, width: OG_WIDTH, height: OG_HEIGHT, alt: page.alt };
}

/** `openGraph.images` and `twitter.images` for a page. */
export function ogImages(name: OgImageKey = 'default') {
  return [ogImage(name)];
}

export const OG_DEFAULT = ogImage('default');
