import type { MetadataRoute } from 'next';

const SITE_URL = 'https://echopulse.media';

/**
 * robots.txt — served at /robots.txt. This file did not exist before, which
 * meant nothing on the domain told crawlers where the sitemap lives, and
 * every AI crawler's access was whatever its own default happens to be
 * (some default to allow, some to a conservative "unclear, so skip it").
 * Given the goal is AI assistants recommending EchoPulse, leaving that
 * ambiguous was working against the site, not neutrally.
 *
 * Two deliberate choices below that are easy to get backwards:
 *
 * 1. /onboard and /pricing-matrix are NOT disallowed here, even though both
 *    are private. They already carry `robots: { index: false, follow: false }`
 *    in their own page metadata, and Google's own guidance is explicit: don't
 *    combine robots.txt disallow with a noindex tag. Disallow stops the page
 *    from ever being crawled at all, which means Google can never SEE the
 *    noindex tag — so if the URL is ever discovered another way (a stray
 *    link, someone pasting it), it can surface in results as a bare URL with
 *    no description, which is worse than what noindex alone prevents. The
 *    meta tag is the correct single source of truth for these two.
 *
 * 2. /api/ IS disallowed. Those routes aren't pages — no HTML, no meta tags,
 *    nothing for a noindex directive to live on — so blocking crawl is the
 *    only mechanism available, and there's no legitimate reason any crawler
 *    needs to fetch a webhook or an internal test endpoint.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },

      // --- AI crawlers, explicitly allowed -----------------------------
      // Each vendor runs several bots split by job (train / index-for-search
      // / fetch-on-user-request), and a block on one does NOT imply a block
      // on the others — each needs its own explicit line. Source: Anthropic,
      // OpenAI and Perplexity crawler documentation, current as of mid-2026.

      // OpenAI — GPTBot trains future models, OAI-SearchBot is what makes a
      // page eligible to appear in ChatGPT search answers, ChatGPT-User
      // fetches a page the moment someone asks about it directly.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },

      // Anthropic — same three-way split as OpenAI.
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },

      // Perplexity — PerplexityBot is what lets a page get cited in a
      // Perplexity answer; this is the one most worth keeping open.
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },

      // Google-Extended governs Gemini/AI-training use of the content —
      // separate from Googlebot, so this has zero effect on normal Google
      // Search ranking either way.
      { userAgent: 'Google-Extended', allow: '/' },

      // Other AI/answer-engine crawlers worth keeping open for the same
      // reason: Apple Intelligence, Meta AI, ByteDance's assistants, Amazon's
      // Rufus/Alexa+, and Common Crawl (whose dataset feeds a long list of
      // smaller AI labs that don't run their own crawler at all).
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'meta-externalagent', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
