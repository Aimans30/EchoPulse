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
    title: 'Best Personal Branding Agencies 2026: Real Prices',
    description:
      '10 personal branding agencies compared on price, scope and fit. See who charges $1,000 one-off vs $50,000 a month, and which 6 hide their prices.',
  },
  'online-course-completion-rates-real-data': {
    title: 'Online Course Completion Rates: The Real Data (2026)',
    description:
      'The "3% completion" stat is from a LinkedIn post, not a study. What 4 real studies show: a 12.6% median across 221 MOOCs, and 46% for paid learners.',
  },
  'video-editing-turnaround-time': {
    title: 'How Long Does Video Editing Take? 9 Services Compared',
    description:
      'Most video editing services quote 1 to 3 business days. Real turnaround times from 9 services, from same day to 5 weeks, and what actually starts the clock.',
  },
  'local-seo-ranking-factors-evidence': {
    title: 'Local SEO Ranking Factors: What Google Actually Confirms',
    description:
      'Google confirms just 3 local ranking factors. What is proven, what is expert guesswork, and which famous local SEO statistics trace back to a tweet.',
  },
  'ugc-ad-hook-scripts-by-product-category': {
    title: '20 UGC Ad Hooks You Can Copy (Scripts by Product)',
    description:
      'Ready-to-shoot UGC ad hooks with the opening shot, spoken line and on-screen text, for skincare, supplements, apparel, home, tech, food and pets.',
  },
  'best-content-agency-for-startups-2026': {
    title: 'Best Content Agencies for Startups (2026 Prices)',
    description:
      'Startup content agencies cost $5,000 to $40,000 a month. Prices for 8 named agencies, who each one fits, and when a startup should not hire one yet.',
  },
  'ugc-creator-rates-vs-agency-cost': {
    title: 'UGC Creator Rates 2026: $100 a Video vs Agency Cost',
    description:
      'Direct UGC creators charge $100 to $300 a video; agencies start near $2,000 a month. The real math, and why published UGC rates contradict each other.',
  },
  'course-platform-pricing-compared-2026': {
    title: 'Kajabi vs Teachable vs Thinkific vs Podia Pricing 2026',
    description:
      'Thinkific from $40 a month, Teachable $39, Podia $42, Kajabi $179. All 12 plans side by side, plus the transaction fees that change what you really pay.',
  },
  'best-video-editing-services-for-founders': {
    title: 'Best Video Editing Services for Founders (15 Compared)',
    description:
      '15 video editing services compared on real price, output per month and hidden terms. Why "unlimited editing" is never unlimited, and which to pick.',
  },
  'short-form-video-editing-cost-per-video': {
    title: 'Short Form Video Editing Cost: $30 to $200 a Video',
    description:
      'What reels, shorts and TikTok editing really costs in 2026: $30 to $200 a clip, or $200 to $500 with a senior editor, and what each quote leaves out.',
  },
};
