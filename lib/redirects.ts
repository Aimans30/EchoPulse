/**
 * Blog consolidation redirect map — July 2026.
 *
 * Context: the blog had ~108 published posts, but ~65 of them were near-duplicate
 * variants of just four topics (AI marketing stack, batch production, high-ticket
 * funnel, founder authority) plus a handful of off-topic posts. Google's scaled
 * content abuse policy treats that pattern as spam and demotes the whole domain,
 * which is why only 8 of 60+ posts ever earned a single impression.
 *
 * Fix: keep ONE strong survivor per cluster, 301 every variant to it so the link
 * equity consolidates instead of evaporating. Unpublishing alone would produce
 * 404s; the redirects are what make the cleanup safe.
 *
 * These slugs are unpublished in Sanity, so the [slug] route would 404 without
 * the entries below. Do not remove an entry unless you have re-published the post.
 */

/**
 * The cluster survivors. Every dead variant points at one of these.
 *
 * INVARIANT: every slug in here must be PUBLISHED in Sanity. A redirect whose
 * destination is unpublished is worse than the 404 it was meant to prevent —
 * it spends a 301 hop and then 404s anyway, so the equity is lost AND the
 * crawler pays twice for it.
 *
 * Two entries broke that invariant and were repaired in September 2026. A GROQ
 * check against the published dataset showed `post-production-system-high-volume-b2b-video-2026`
 * and `the-10-best-social-media-strategies-for-real-estate-agents-to-generate-20-50-clients-in-2025`
 * are both absent (108 posts published; neither slug among them), so the two
 * redirects below that pointed at them were 301-into-404. They now point at
 * live posts in the same topic cluster. Both former keys (`postProduction`,
 * `realEstate`) are deleted rather than repointed, so the key name cannot
 * quietly stop describing its value.
 *
 * To re-verify after any Sanity unpublish:
 *   *[_type=="blog" && slug.current in [<every value below>]]{ "s": slug.current }
 * must return one row per entry.
 */
export const SURVIVORS = {
  aiPipeline: "how-to-build-ai-content-pipeline-measurable-roi-2026",
  thoughtLeadership: "how-to-build-thought-leadership-system-high-ticket-clients-2026",
  paidMediaFunnel: "ad-creative-agency-pricing",
  batchProduction: "batch-production-blueprint-b2b-video-content-system-2026",
  realEstateSocial: "real-estate-social-media-marketing-cost",
} as const;

/**
 * dead slug -> destination path.
 * Destination is a full path so off-topic posts can point at "/" rather than a post.
 */
/**
 * Slug renames in flight: new slug -> the slug Sanity may still hold. The post
 * page looks up both, so the new URL works before and after the Sanity slug is
 * changed, and the old URL can 301 at deploy time with no 404 window. Remove an
 * entry once Sanity holds the new slug.
 */
export const SLUG_ALIASES: Record<string, string> = {
  "ad-creative-agency-pricing": "why-paid-media-roi-is-declining-funnel-architecture-fix-2026",
};

export const BLOG_REDIRECTS: Record<string, string> = {
  // 25 Nov 2026: the opinion post on AI Overviews is replaced by the sourced
  // guide on the same question.
  "ai-overviews-dominate-google-searches-content-framework-get-cited-2026": "/blog/how-to-get-cited-by-chatgpt",
  // Nov 24 2026 audit: the post at this slug was rewritten as "Ad Creative
  // Agency Pricing 2026", so the URL now matches the topic.
  "why-paid-media-roi-is-declining-funnel-architecture-fix-2026": "/blog/ad-creative-agency-pricing",
  // Dead slug that outside pages still link to (Nov 2026 audit). Same title
  // as the live post, which sits at the longer slug.
  "linkedin-ghostwriting-pricing": "/blog/how-much-does-linkedin-ghostwriting-cost-2026",

  // ── Cluster 1: AI marketing stack / ROI (18 variants) ──────────────────────
  "why-ai-marketing-agents-fail-2026-governance-gap": `/blog/${SURVIVORS.aiPipeline}`,
  "why-most-ai-marketing-pilots-burn-budget-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "ai-content-pipeline-framework-marketing-roi-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "ai-marketing-pipelines-cost-per-lead-scaling-brands-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "why-ai-marketing-stacks-fail-at-scale-architecture-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "why-ai-marketing-initiatives-fail-to-scale": `/blog/${SURVIVORS.aiPipeline}`,
  "why-81-percent-marketing-teams-get-zero-roi-from-ai": `/blog/${SURVIVORS.aiPipeline}`,
  "why-most-ai-marketing-stacks-fail-3-layer-infrastructure-cmos-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "ai-marketing-stack-activity-not-revenue-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "why-ai-marketing-stacks-fail-roi-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "ai-content-pipeline-gap-brands-roi-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "why-ai-marketing-stacks-cannot-prove-roi-architecture-fix-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "why-ai-marketing-stack-not-delivering-roi-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "why-ai-marketing-stacks-losing-money-2026-framework": `/blog/${SURVIVORS.aiPipeline}`,
  "ai-content-pipeline-architecture-high-growth-brands-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "why-your-ai-marketing-stack-is-not-converting-architecture-errors-2026": `/blog/${SURVIVORS.aiPipeline}`,
  "why-your-ai-marketing-stack-is-not-delivering-roi-orchestration-problem": `/blog/${SURVIVORS.aiPipeline}`,
  "agentic-marketing-stack-ai-agent-systems-2026": `/blog/${SURVIVORS.aiPipeline}`,

  // ── Cluster 2: Batch production / "1 video -> 30 assets" (14 variants) ─────
  "batch-production-system-video-shoot-90-days-content": `/blog/${SURVIVORS.batchProduction}`,
  "batch-content-production-system-ship-30-assets-month": `/blog/${SURVIVORS.batchProduction}`,
  "one-video-thirty-content-assets-batch-production-system": `/blog/${SURVIVORS.batchProduction}`,
  "batch-production-blueprint-cut-content-costs-2026": `/blog/${SURVIVORS.batchProduction}`,
  "how-to-turn-one-video-into-30-content-assets": `/blog/${SURVIVORS.batchProduction}`,
  "how-to-build-content-repurposing-engine-that-scales": `/blog/${SURVIVORS.batchProduction}`,
  "how-to-scale-video-content-production-without-sacrificing-quality": `/blog/${SURVIVORS.batchProduction}`,
  "batch-content-production-system-one-shoot-30-assets-2026": `/blog/${SURVIVORS.batchProduction}`,
  "batch-video-production-system-scaling-brands-2026": `/blog/${SURVIVORS.batchProduction}`,
  "how-to-build-batch-video-production-system-30-pieces-content": `/blog/${SURVIVORS.batchProduction}`,
  "video-content-workflow-batch-production-system-2026": `/blog/${SURVIVORS.batchProduction}`,
  "video-content-pipeline-batch-production-system": `/blog/${SURVIVORS.batchProduction}`,
  "per-project-video-production-dead-always-on-content-engine-2026": `/blog/${SURVIVORS.batchProduction}`,
  // Was pointing at `post-production-system-high-volume-b2b-video-2026`, which
  // is NOT published, so this 301'd straight into a 404. Repointed to the batch
  // production survivor — the nearest live post on the same subject (building a
  // repeatable high-volume B2B video production system).
  "post-production-infrastructure-gap-enterprise-brands": `/blog/${SURVIVORS.batchProduction}`,

  // ── Cluster 3: High-ticket funnel architecture (16 variants) ───────────────
  "why-your-real-cac-keeps-rising-in-2026-and-how-to-lower-it": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "high-ticket-coaching-funnel-conversion-mistakes": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "stop-blaming-your-ad-spend-high-ticket-funnel-structural-problem": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "why-paid-media-funnel-stops-scaling-high-ticket-fix-2026": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "coaching-funnel-leaking-revenue-high-ticket-growth-2026": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "funnel-architecture-high-ticket-service-business-2026": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "5-stage-funnel-architecture-high-ticket-coaches-2026": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "why-high-ticket-funnel-leaking-revenue-5-stage-fix-2026": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "funnel-architecture-high-ticket-clients-2026": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "why-paid-media-roas-keeps-declining-funnel-architecture-fix": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "high-ticket-funnel-architecture-coaching-clients-2026": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "funnel-architecture-fix-high-ticket-coaching-conversions": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "funnel-architecture-mistakes-high-ticket-brands-2026": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "why-paid-media-roi-is-declining-for-premium-brands-in-2026-the-ai-first-funnel-architecture": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "why-your-paid-media-funnel-stops-scaling-at-20k-per-month-2026-framework": `/blog/${SURVIVORS.paidMediaFunnel}`,
  "lead-generation-system-coaching-business-without-ads": `/blog/${SURVIVORS.paidMediaFunnel}`,

  // ── Cluster 4: Founder authority / premium clients (13 variants) ───────────
  "why-high-ticket-founders-lose-deals-to-competitors": `/blog/${SURVIVORS.thoughtLeadership}`,
  "why-founder-brands-fail-to-attract-premium-clients": `/blog/${SURVIVORS.thoughtLeadership}`,
  "founder-brand-authority-premium-prices-2026": `/blog/${SURVIVORS.thoughtLeadership}`,
  "why-founder-brands-fail-to-convert-premium-positioning-fix": `/blog/${SURVIVORS.thoughtLeadership}`,
  "the-founder-authority-system-premium-brands-thought-leadership-2026": `/blog/${SURVIVORS.thoughtLeadership}`,
  "why-personal-brand-authority-fails-to-close-high-ticket-clients-2026": `/blog/${SURVIVORS.thoughtLeadership}`,
  "brand-authority-high-ticket-clients-2026": `/blog/${SURVIVORS.thoughtLeadership}`,
  "why-founder-personal-brands-fail-premium-positioning": `/blog/${SURVIVORS.thoughtLeadership}`,
  "founder-authority-system-premium-clients-2026": `/blog/${SURVIVORS.thoughtLeadership}`,
  "how-founders-build-premium-brand-authority-high-ticket-clients-2026": `/blog/${SURVIVORS.thoughtLeadership}`,
  "4-layer-authority-system-premium-clients-sales-call": `/blog/${SURVIVORS.thoughtLeadership}`,
  "brand-authority-system-high-ticket-deals-founders": `/blog/${SURVIVORS.thoughtLeadership}`,
  "why-high-ticket-buyers-pay-premium-for-thought-leaders-2026": `/blog/${SURVIVORS.thoughtLeadership}`,

  // ── Off-topic: no path back to a buyer, send to the homepage ───────────────
  "short-term-rental-market-trends-2026": "/",
  "airbnb-profit-margin-true-profitability-hosts": "/",
  "fitness-coaches-10-clients-instagram-reels-2026": "/",

  // ── Duplicate real-estate post -> the stronger original ────────────────────
  // Was pointing at `the-10-best-social-media-strategies-for-real-estate-agents-...-2025`,
  // which is NOT published, so this 301'd into a 404. Repointed to the live
  // real-estate social post.
  "real-estate-social-media-strategy-2026": `/blog/${SURVIVORS.realEstateSocial}`,

  // ── Section move, September 2026: case study out of /blog ──────────────────
  // This is NOT a consolidation like everything above it. The post is good and
  // still published in Sanity. It moved because /blog/ classifies a page as
  // commentary, to a crawler and to a language model alike, and this is the
  // only proof asset on the domain. It now lives under /case-studies/ as an
  // Article whose `about` is the client Organization, with the Search Console
  // export declared as a Dataset. Neither is expressible from a BlogPosting.
  //
  // Two consequences of putting it in this map, both wanted: the sitemap
  // already filters every slug listed here, and lib/blog.ts now filters them
  // out of the index too, so nothing links at a URL that 301s.
  //
  // The Sanity document should be unpublished once this deploys. Until then
  // the redirect shadows it, so there is no duplicate-content window.
  "magicbnb-seo-aeo-case-study-2026": "/case-studies/magicbnb-seo-aeo",

  // ── Search Console 404 sweep, November 2026 ────────────────────────────────
  // Every URL in the 10 Nov 2026 GSC "Pages" export was fetched against the
  // live site. The ones below returned 404 (after following any /blogs/ -> /blog/
  // and www -> apex hops). Each is pointed at the closest LIVE post, confirmed
  // against the published dataset and the live sitemap on the same day.

  // Brand query. The old "definitive guide" post is unpublished and the slug
  // still earns impressions for "what is echopulse media". The answer now lives
  // on a real page, not a blog post, so both /blog/ and /blogs/ land there.
  // NOTE: `the-official-guide-to-echopulse-media-founder-vision-and-architecture-2026`
  // is NOT here on purpose. It is still published in Sanity (checked 10 Nov
  // 2026, _updatedAt 2026-07-28) and returns 200, so redirecting it would
  // shadow a live post. Add it here only after unpublishing it.
  "what-is-echopulse-media-the-definitive-guide-to-retention-engineering-and-growth-architecture": "/what-is-echopulse-media",

  // Two destinations that earlier entries used to point at. Both are
  // unpublished (see the SURVIVORS note), both still get crawled, and until now
  // neither had an entry of its own, so they 404ed directly.
  "post-production-system-high-volume-b2b-video-2026": `/blog/${SURVIVORS.batchProduction}`,
  "the-10-best-social-media-strategies-for-real-estate-agents-to-generate-20-50-clients-in-2025": `/blog/${SURVIVORS.realEstateSocial}`,

  // Renamed or retired posts whose live replacement covers the same topic.
  // "...before-your-waste-3-months" is the old slug of the live
  // "...before-you-build-it" post (same title in Sanity).
  "validate-your-offer-before-your-waste-3-months": "/blog/validate-your-offer-before-you-build-it",
  // Old short slug of the live retainer-cost post.
  "video-editing-retainer-cost": "/blog/video-editing-retainer-cost-per-month",
  // Podcast audience-growth opinion piece, unpublished. Nearest live post on
  // podcasts is the clip-workflow guide.
  "the-joe-rogan-fallacy-why-your-podcast-has-12-listeners-and-how-to-fix-it": "/blog/turn-podcast-episode-into-clips",

  // ── Legacy post removal, 18 November 2026 ─────────────────────────────────
  // 19 pre-July posts unpublished after a content audit (off-topic, thin, or
  // carrying unverifiable client claims). Each points at the closest live page.
  // The audit list is the owner's; do not re-publish without re-checking claims.
  "the-roi-war-gemini-pro-vs-chatgpt-5-2-in-high-ticket-marketing": "/blog/does-ai-written-content-rank",
  "the-2026-instagram-algorithm-why-saves-are-the-new-likes-the-utility-shift": "/blog/how-to-add-captions-reels-shorts-tiktok",
  "beyond-chatgpt-why-world-models-are-the-end-of-generative-ai": "/blog/does-ai-written-content-rank",
  "the-official-guide-to-echopulse-media-founder-vision-and-architecture-2026": "/what-is-echopulse-media",
  "the-silent-vetting-why-you-lost-the-usd25k-contract-before-the-phone-rang": "/blog/linkedin-personal-profile-vs-company-page-2026",
  "the-death-of-resilience-why-somatic-leadership-is-the-next-billion-dollar-niche": "/blog/marketing-for-coaches-and-therapists-cost",
  "the-ghost-network-why-your-5-000-linkedin-connections-are-worthles": "/blog/linkedin-personal-profile-vs-company-page-2026",
  "saving-usd1-000-to-lose-usd100-000-the-math-of-a-bad-business-decision": "/pricing",
  "stop-uploading-to-the-graveyard-why-your-content-isn-t-converting": "/blog/turn-podcast-episode-into-clips",
  "visual-density-101-why-your-45-minute-keynote-is-boring-on-linkedin": "/blog/turn-podcast-episode-into-clips",
  "it-s-official-echopulse-named-certified-manychat-partner-and-what-this-means-for-your-growth": "/services/automations",
  "the-great-social-media-reset-6-trends-that-will-define-b2b-marketing-in-2026": "/blog/what-does-a-social-media-manager-do",
  "the-creator-s-stack-the-definitive-guide-to-how-boris-anthropic-actually-uses-claude-code": "/blog",
  "beyond-gemini-3-the-complete-whisk-to-flow-architecture-for-high-retention-landing-pages": "/blog/what-to-prepare-before-website-redesign",
  "the-2026-youtube-state-of-the-union-why-your-website-is-obsolete": "/services/video-editing",
  "the-product-market-fit-protocol-how-to-bridge-the-gap-between-customer-dreams-and-scalable": "/blog/validate-your-offer-before-you-build-it",
  "why-the-best-businesses-don-t-chase-customers": "/blog/inbound-leads-without-cold-outreach",
  "the-architecture-of-scalability-why-your-business-systems-are-failing-and-how-to-fix-them": "/blog/what-to-automate-first-small-business",
  "operational-mastery-the-exact-framework-used-by-8-figure-founders": "/blog/what-to-automate-first-small-business",

  // ── Legacy post merges, 18 November 2026 ──────────────────────────────────
  // 5 pre-July posts from the same audit, marked "merge": each duplicated a
  // live post and added nothing the live post lacks, so they are unpublished
  // and pointed at the post that covers the topic. Drafts are kept in Sanity.
  "the-3-second-war-the-ultimate-guide-to-scripting-viral-short-form-content": "/blog/short-form-video-hooks-for-founders",
  "the-vertical-video-monopoly-how-to-build-a-revenue-generating-content-engine-in-2026": `/blog/${SURVIVORS.batchProduction}`,
  "building-a-digital-presence-for-business-growth": "/blog/posting-content-vs-digital-presence",
  "what-90-of-founders-get-wrong-about-content": "/blog/why-founders-get-brand-positioning-wrong-2026",
  "entity-based-seo-the-secret-to-dominating-ai-search-queries-in-2026": "/blog/how-to-get-cited-by-chatgpt",
};

/** Slugs that are still live. Used to avoid redirect chains from /blogs/*. */
// A renamed post's old slug redirects but is not dead: its Sanity document is
// the live post (SLUG_ALIASES), so queries must still return it.
const RENAMED_FROM = new Set(Object.values(SLUG_ALIASES));
export const DEAD_SLUGS = Object.keys(BLOG_REDIRECTS).filter((s) => !RENAMED_FROM.has(s));
