/**
 * IndexNow: tells Bing (and Yandex, Seznam, Naver) that a URL changed, so the
 * new post is crawled in minutes instead of days. Bing's index is what
 * Copilot and ChatGPT search draw on, so this is the fastest route from
 * "published" to "citable".
 *
 * The key is not a secret. IndexNow proves ownership by fetching
 * https://echopulse.media/<key>.txt and checking it contains the key, so the
 * file in public/ and this constant must match. Google does not use IndexNow;
 * it reads the sitemap, which is rendered per request.
 */
export const INDEXNOW_KEY = '51b5233bccc8313b62c781e4d56e2753';
const HOST = 'echopulse.media';

export async function pingIndexNow(urls: string[]): Promise<number | null> {
  if (urls.length === 0) return null;
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(5000),
    });
    return res.status;
  } catch {
    return null;
  }
}
