import 'server-only';

/**
 * Lightweight in-memory rate limiter.
 *
 * Use to protect public POST endpoints (Pune inquiry, lead capture, checkout,
 * onboarding) from curl loops that would spam Asana + Slack + your email
 * provider. Per-IP token bucket; resets after the configured window.
 *
 * Production-realistic limits:
 *   - 6 hits / 60s for form endpoints (a human won't trigger this; a bot will)
 *   - 30 hits / 60s for the Razorpay flow (cards retry, network blips, etc.)
 *
 * Edge note: This uses a module-level Map, so on Vercel serverless each cold
 * function instance starts fresh — counts don't sync across instances. For
 * 1M+ req/day scale, swap to @upstash/ratelimit (Redis-backed). For an early
 * site with a few hundred submissions/day, in-memory is plenty.
 *
 * Returns true if the request is ALLOWED, false if it should be rejected.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const HARD_CAP_KEYS = 5000; // prevent unbounded Map growth from DDoS

/**
 * Pull the caller IP from common Vercel / Netlify / Cloudflare headers,
 * with a safe fallback so we never return null and bypass the limiter.
 */
function ipFromRequest(req: Request): string {
  const headers = req.headers;
  // Vercel + most proxies forward the real IP here, comma-separated chain
  // with the closest client first.
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    'unknown'
  );
}

/**
 * Allow `max` hits per `windowMs` per IP for the given namespace.
 *
 * Pass a unique `namespace` per endpoint so a noisy /api/lead user doesn't
 * starve /api/checkout from the same IP.
 *
 * Example:
 *   if (!rateLimit(req, 'pune-inquiry', 6, 60_000)) {
 *     return NextResponse.json({ ok:false, error:'too_many' }, { status:429 });
 *   }
 */
export function rateLimit(
  req: Request,
  namespace: string,
  max: number = 10,
  windowMs: number = 60_000,
): boolean {
  const ip = ipFromRequest(req);
  const key = `${namespace}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    // Periodic GC so memory doesn't grow unbounded under attack.
    if (buckets.size > HARD_CAP_KEYS) {
      for (const [k, b] of buckets.entries()) {
        if (now > b.resetAt) buckets.delete(k);
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
}
