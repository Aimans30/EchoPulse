/**
 * Search-result title and meta description overrides for blog posts, keyed by
 * slug. The on-page H1 still comes from Sanity; only <title>, the meta
 * description and the social cards use these.
 *
 * Why: the 18 Nov 2026 Search Console export showed the top posts earning
 * thousands of impressions at 0 to 0.5% CTR (best-personal-branding-agencies:
 * 5,133 impressions, 8 clicks). These rewrites lead with the searcher's
 * question and the payoff (a number, a price range, a named comparison),
 * keep titles under about 60 characters so Google does not cut them, and keep
 * descriptions under about 155.
 *
 * Re-check CTR in Search Console 4 weeks after deploy; keep what wins.
 */
export const BLOG_SEO: Record<string, { title: string; description: string }> = {
  'best-personal-branding-agencies': {
    title: '10 Best Personal Branding Agencies 2026 (With Real Prices)',
    description:
      'Most personal branding agencies hide their prices. We found them: $1,000 one-off to $50,000 a month. Compare all 10 on price, scope and who each fits.',
  },
  'online-course-completion-rates-real-data': {
    title: 'Online Course Completion Rates: Why the 3% Stat Is Wrong',
    description:
      'The famous 3% completion rate traces to a LinkedIn post, not a study. 4 real studies show 12.6% for MOOCs and 46% for paid learners. See the data.',
  },
  'video-editing-turnaround-time': {
    title: 'Video Editing Turnaround Time: How Long 9 Services Take',
    description:
      'Most editors promise 1 to 3 business days, but the real range is same day to 5 weeks. See each service\'s published turnaround and what starts the clock.',
  },
  'local-seo-ranking-factors-evidence': {
    title: 'Local SEO Ranking Factors: Only 3 Are Confirmed by Google',
    description:
      'Google confirms just 3 local ranking factors: relevance, distance and prominence. What is proven, what is guesswork, and which famous stats are myths.',
  },
  'ugc-ad-hook-scripts-by-product-category': {
    title: '20 UGC Ad Hooks That Stop the Scroll (Copy-Paste Scripts)',
    description:
      'Copy-paste UGC hooks with the first shot, the spoken line and the on-screen text. Ready for skincare, supplements, apparel, home, tech, food and pets.',
  },
  'best-content-agency-for-startups-2026': {
    title: 'Best Content Agencies for Startups 2026: 8 Compared + Prices',
    description:
      'Startup content agencies charge $5,000 to $40,000 a month. Compare 8 agencies on price and fit, and see when a startup should not hire one yet.',
  },
  'ugc-creator-rates-vs-agency-cost': {
    title: 'UGC Creator Rates 2026: What Creators vs Agencies Charge',
    description:
      'UGC creators charge $100 to $300 a video; agencies start near $2,000 a month. See the real math, and why the rates you find online disagree.',
  },
  'course-platform-pricing-compared-2026': {
    title: 'Kajabi vs Teachable vs Thinkific vs Podia: True Cost 2026',
    description:
      'Teachable starts at $39, Thinkific $40, Podia $42 and Kajabi $179 a month, but transaction fees change what you really pay. All 12 plans side by side.',
  },
  'best-video-editing-services-for-founders': {
    title: '15 Best Video Editing Services for Founders (2026 Prices)',
    description:
      'We compared 15 video editing services on real price, monthly output and hidden terms. See why "unlimited" never means unlimited, and which fits you.',
  },
  'short-form-video-editing-cost-per-video': {
    title: 'Short Form Video Editing Cost 2026: $30 to $200 per Video',
    description:
      'Reels, Shorts and TikTok editing costs $30 to $200 a clip, or $200 to $500 with a senior editor. See real rate cards and what cheap quotes leave out.',
  },
};
