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

/** The four cluster survivors. Every dead variant points at one of these. */
export const SURVIVORS = {
  aiPipeline: "how-to-build-ai-content-pipeline-measurable-roi-2026",
  thoughtLeadership: "how-to-build-thought-leadership-system-high-ticket-clients-2026",
  paidMediaFunnel: "why-paid-media-roi-is-declining-funnel-architecture-fix-2026",
  batchProduction: "batch-production-blueprint-b2b-video-content-system-2026",
  postProduction: "post-production-system-high-volume-b2b-video-2026",
  realEstate:
    "the-10-best-social-media-strategies-for-real-estate-agents-to-generate-20-50-clients-in-2025",
} as const;

/**
 * dead slug -> destination path.
 * Destination is a full path so off-topic posts can point at "/" rather than a post.
 */
export const BLOG_REDIRECTS: Record<string, string> = {
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
  // Post-production is its own survivor, so this one points there instead.
  "post-production-infrastructure-gap-enterprise-brands": `/blog/${SURVIVORS.postProduction}`,

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
  "real-estate-social-media-strategy-2026": `/blog/${SURVIVORS.realEstate}`,
};

/** Slugs that are still live. Used to avoid redirect chains from /blogs/*. */
export const DEAD_SLUGS = Object.keys(BLOG_REDIRECTS);
