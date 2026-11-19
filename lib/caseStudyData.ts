/**
 * Case studies.
 *
 * WHY THIS IS A TYPED FILE AND NOT A SANITY DOCUMENT
 *
 * A case study is not an article. It is a structured record: a fixed set of
 * measured values, a date window, a named source instrument, a list of open
 * problems. Authoring that as portable text means retyping the same shape by
 * hand every time and hoping nobody drops a field, and it makes the results
 * table and the Dataset JSON-LD impossible to generate reliably. Holding it as
 * typed data means the page, the summary table and the structured data are all
 * generated from one source that the compiler checks.
 *
 * HOW TO ADD THE NEXT ONE
 *
 * Copy the whole object below, change the values, and add it to the array. The
 * type will tell you what is missing. Two rules that are not enforceable by the
 * compiler and matter more than anything the compiler does check:
 *
 *   1. Every number traces to a named, dated export you still have a copy of.
 *      No estimates, no "roughly", no client-reported figures you cannot see.
 *   2. `openProblems` is never empty. A case study that reports only wins is an
 *      advertisement, and a reader who has been sold to before can tell the
 *      difference in about four seconds. The open list is the reason the rest
 *      of the page is believable.
 *
 * Client consent is required before publishing. `clientUrl` must be a live site
 * the reader can open and check, because the entire persuasive mechanism here
 * is that the claims are verifiable rather than trusted.
 */

export type CaseStudyMetric = {
  /** Big number. Keep the unit attached: "2,398", "203%", "199". */
  value: string;
  label: string;
  /** Optional qualifier printed small underneath. Use for date context. */
  note?: string;
};

/** One labelled bar in a small horizontal bar chart. */
export type CaseStudyBarItem = { label: string; value: number; display: string };

/** A small horizontal bar chart. Values are real, sourced in `caption`. */
export type CaseStudyBars = {
  title: string;
  caption: string;
  items: CaseStudyBarItem[];
};

/** A still image shown next to a workstream or in the hero. */
export type CaseStudyMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type CaseStudyWorkstream = {
  name: string;
  /** One number that sums the workstream up, shown as a chip on the card. */
  stat?: { value: string; label: string };
  /** Optional stills shown with the workstream (max 3). */
  media?: CaseStudyMedia[];
  /** Slug in lib/serviceData.ts, so the page can link the service. */
  serviceSlug?: string;
  summary: string;
  points: string[];
};

export type CaseStudyMonth = {
  month: string;
  impressions: string;
  perDay: string;
  note: string;
};

export type CaseStudyFunnelRow = {
  label: string;
  before: string;
  after: string;
  change: string;
  /** 'up' and 'down' colour the change. 'down' is not hidden or spun. */
  direction: 'up' | 'down';
};

export type CaseStudyOpenProblem = {
  title: string;
  detail: string;
  status: string;
};

export type CaseStudyProof = {
  src: string;
  alt: string;
  /** Intrinsic pixel size of the file, so next/image reserves the right box. */
  width: number;
  height: number;
  /** Names the property, the window and the export date. Non-negotiable. */
  caption: string;
};

/**
 * Before and after, for engagements whose result is visible rather than
 * measured.
 *
 * A rebuild has no impressions curve. Pretending otherwise, by reaching for a
 * traffic number nobody exported, is the exact failure this whole section
 * exists to avoid. What a rebuild does have is a thing you can look at, so the
 * evidence here is the two screens side by side and a live URL the reader can
 * open in the next tab and check against.
 *
 * `after` is optional. Until a capture of the new site exists, the component
 * renders the before image on its own next to the live link rather than
 * shipping a broken slider.
 */
/** The daily series behind a measured engagement. See `CaseStudy['chart']`. */
export type CaseStudyChart = {
  /** One value per day across the window. */
  daily: number[];
  /** Index of the day the change shipped. Drawn as the marker line. */
  launchIndex: number;
  launchLabel: string;
  beforeLabel: string;
  monthTicks: { index: number; label: string }[];
  yTicks: { frac: number; label: string }[];
  ariaLabel: string;
  caption: string;
};

export type CaseStudyComparison = {
  beforeSrc: string;
  beforeAlt: string;
  beforeWidth: number;
  beforeHeight: number;
  beforeLabel: string;
  afterSrc?: string;
  afterAlt?: string;
  afterWidth?: number;
  afterHeight?: number;
  afterLabel: string;
  /** Live URL so the "after" can be verified rather than taken on trust. */
  liveUrl: string;
  caption: string;
};

/** One row of the "Key facts" table. `href` links the value when it is a URL. */
export type CaseStudyFact = { label: string; value: string; href?: string };

/**
 * How the figures on a study were produced. Four fixed rows so no study can
 * skip "what is not counted". Where nothing was measured, the rows say so.
 */
export type CaseStudyMeasurement = {
  tool: string;
  dateRanges: string;
  counted: string;
  notCounted: string;
};

/**
 * The tracking system section. `rows` is the capability table: one row per
 * source, what is tracked, and the decision it drives. `screens` is optional:
 * real dashboard captures render as a captioned gallery, and an empty or
 * missing array renders nothing. Never add placeholder images.
 */
export type CaseStudyTracking = {
  heading: string;
  claim: string;
  body: string[];
  rows: { source: string; tracked: string; decision: string }[];
  whyHeading: string;
  why: { title: string; detail: string }[];
  clientGets: string[];
  examples: { title: string; detail: string }[];
  notPublished: string;
  screens?: CaseStudyMedia[];
};

export type CaseStudy = {
  slug: string;
  /** Short name used in question headings: "What did EchoPulse do for X?" */
  shortName: string;
  /**
   * The answer block at the top of the page: two or three sentences that name
   * the client, what EchoPulse did, the result with number, unit and dates,
   * and the data source. Each must make sense quoted alone, and every figure
   * must already exist elsewhere in this object.
   */
  answer: string[];
  /** Rows of the "Key facts" table. Numbers as text, with units and dates. */
  keyFacts: CaseStudyFact[];
  /** One sentence for the index card and the ItemList: result, number, date. */
  indexResult: string;
  measurement: CaseStudyMeasurement;
  /** Direct answer printed under "How long did it take?". Measured work only. */
  timelineAnswer?: string;
  /** The service page this study is the proof for. */
  relatedService?: { slug: string; label: string };
  /** The result in one line, printed bold at the top of the answer block. */
  resultLine: string;
  /**
   * "Is this right for you?" Who the work suits. Who it does not suit defaults
   * to the titles in `notApplicable`; set `notFor` only where those titles do
   * not read as a list of bad fits.
   */
  fit: { suits: string[]; notFor?: string[] };
  /** The tracking system behind the engagement. Only where one was built. */
  tracking?: CaseStudyTracking;
  /**
   * 'client' (default) is work done for a named client. 'founder' is the
   * founder's own background: it renders through the same template but the
   * labels change (no "open the client site and check", no "still broken"),
   * and the schema `about` node is the founder Person, not an Organization.
   */
  kind?: 'client' | 'founder';
  /** Three short lines for the summary box under the hero: result, how, catch. */
  tldr?: string[];
  /** Picture for the hero when there is no chart or before/after to show. */
  heroMedia?: CaseStudyMedia;
  /** Small bar charts shown in the numbers section. */
  bars?: CaseStudyBars[];
  /** Overrides for section headings. Every key is optional. */
  labels?: {
    eyebrowIndex?: string;
    situationKicker?: string;
    workKicker?: string;
    workHeading?: string;
    openProblemsKicker?: string;
    openProblemsHeading?: string;
    limitsKicker?: string;
    limitsHeading?: string;
    clientLinkLabel?: string;
  };
  /** Client name as they write it themselves. */
  client: string;
  /**
   * The client organisation's own name, for the schema.org `about` node, when
   * `client` also carries a person's name. Defaults to `client`.
   */
  organizationName?: string;
  /** Live, checkable URL. Emitted as Organization.sameAs. */
  clientUrl: string;
  clientTagline: string;
  industry: string;
  /** Key in lib/icpData.ts, so the page links the matching landing page. */
  icpKey: string;

  metaTitle: string;
  metaDescription: string;

  eyebrow: string;
  headline: string;
  headlineAccent: string;
  /** Two or three sentences. Sits under the H1 and carries the whole result. */
  summary: string;

  /** Human label, plus ISO bounds for Dataset.temporalCoverage. */
  windowLabel: string;
  windowStartISO: string;
  windowEndISO: string;
  publishedISO: string;
  /** Set when the figures are refreshed. Drives Article.dateModified. */
  updatedISO?: string;

  services: string[];
  heroMetrics: CaseStudyMetric[];
  atAGlance: { label: string; value: string }[];

  /**
   * EVERYTHING FROM HERE TO `openProblems` IS OPTIONAL.
   *
   * The first case study in this file was a search engagement, so the type was
   * originally written around one: a daily series, a month table, a funnel
   * comparison, a Dataset to declare. The second was a site rebuild with none
   * of those, and the honest options were to loosen the type or to invent
   * numbers to fill it. A required field is a standing invitation to make
   * something up to satisfy it, so the analytics-shaped parts are now opt-in
   * and a study renders whichever ones it genuinely has.
   *
   * What stays mandatory is the part that makes a case study trustworthy: who
   * the client is, a live URL, what was done, and what is still broken.
   */
  chart?: CaseStudyChart;

  /** Before and after screens. Used instead of `chart` on visible-result work. */
  comparison?: CaseStudyComparison;

  situation: {
    headline: string;
    body: string[];
    failures: { title: string; detail: string }[];
  };

  workstreams: CaseStudyWorkstream[];
  months?: CaseStudyMonth[];
  funnel?: {
    intro: string;
    /** Column headings. Default to the original 31 and 30 day comparison. */
    beforeLabel?: string;
    afterLabel?: string;
    /** Bold lead-in for the reading paragraph. */
    readingLabel?: string;
    rows: CaseStudyFunnelRow[];
    reading: string;
  };

  /** Measurement screenshots. Empty on engagements with nothing to export. */
  proof: CaseStudyProof[];
  /**
   * Page-by-page before and after. Each pair shows the old page and the page
   * that replaced it, top-aligned in equal frames, with one line on what
   * changed. Only for rebuilds, where the evidence is something you look at.
   */
  pairs?: {
    heading: string;
    intro: string;
    items: { label: string; note: string; before: CaseStudyMedia; after: CaseStudyMedia; afterUrl: string }[];
  };
  /** Extra supporting screens, rendered as a grid under the comparison. */
  gallery?: { heading: string; intro: string; items: CaseStudyProof[] };

  /** Copy for the mid-page CTA. Written per study so the ask refers to the
   *  work this reader has just been reading about. */
  midCtaText: string;
  /** Accent half of the open-problems heading, after "What is still broken,". */
  openProblemsAccent: string;

  openProblems: CaseStudyOpenProblem[];
  notApplicable: { title: string; detail: string }[];

  /** Drives the Dataset JSON-LD block. Only where a real export exists. */
  dataset?: {
    name: string;
    description: string;
    measurementTechnique: string;
    variableMeasured: string[];
  };
};

/**
 * MagicBNB. Short-term rental portfolio analytics.
 *
 * Every figure below comes from the Search Console property for magicbnb.io
 * and the matching GA4 property, exported 18 August 2026. The daily series in
 * `chart.daily` is the raw impressions export, one value per day, 19 February
 * to 17 August 2026 inclusive. It was previously rendered only inside a blog
 * post, where the proof was buried in prose and the page was typed as a
 * BlogPosting, which classified the single strongest trust asset on the domain
 * as an opinion piece.
 */
const magicbnb: CaseStudy = {
  slug: 'magicbnb-seo-aeo',
  shortName: 'MagicBNB',
  resultLine:
    'Result: 5.8 Google impressions a day in April 2026 to 4,803 a day in 1 to 16 November 2026. Source: Google Search Console.',
  answer: [
    'EchoPulse Media runs the marketing for MagicBNB (magicbnb.io), a portfolio analytics product for short-term rental operators, including the site rebuild, content planning, 227 articles, answer-engine content, the founder brand on Instagram and LinkedIn, ad creative and analytics.',
    'Average daily Google search impressions for magicbnb.io went from 5.8 in April 2026 to 4,803 in 1 to 16 November 2026, with 380,327 impressions and 1,624 clicks in total between 19 February and 16 November 2026.',
    'The figures come from Google Search Console for the magicbnb.io property, read on 19 November 2026 through a custom dashboard and MCP server that EchoPulse built for the account; this is one client, not a typical result, and the click-through rate was still 0.44 percent from 18 August to 16 November 2026.',
  ],
  keyFacts: [
    { label: 'Client', value: 'MagicBNB (magicbnb.io)', href: 'https://magicbnb.io' },
    { label: 'Industry', value: 'B2B SaaS, short-term rental portfolio analytics' },
    { label: 'Service', value: 'Full marketing: site, content planning, SEO and AEO content, Instagram and LinkedIn founder brand, ad creative, analytics' },
    { label: 'Period', value: '19 February to 16 November 2026, 271 days. The rebuilt site went live on 5 May 2026.' },
    { label: 'Starting point', value: '5.8 Google impressions a day in April 2026 (175 impressions in the month), declining' },
    { label: 'Result', value: '4,803 Google impressions a day on average in 1 to 16 November 2026 (76,846 impressions in 16 days). 380,327 impressions and 1,624 clicks across the full period. Click-through rate 0.44 percent from 18 August to 16 November 2026.' },
    { label: 'Tracking', value: 'Custom dashboard and MCP server built by EchoPulse. Search, analytics, ads, Instagram and site behaviour are collected daily into one place.' },
    { label: 'Data source', value: 'Google Search Console and GA4 for magicbnb.io, plus Instagram and Meta Ads data. First export 18 August 2026. Search and session figures refreshed 19 November 2026, with Search Console data complete to 16 November 2026.' },
    { label: 'Last updated', value: '19 November 2026' },
  ],
  indexResult:
    'Google search impressions for magicbnb.io went from an average of 5.8 a day in April 2026 to 4,803 a day in 1 to 16 November 2026, measured in Google Search Console.',
  measurement: {
    tool: 'Google Search Console for the magicbnb.io property (impressions, clicks, average position, click-through rate) and GA4 for the same site (sessions, users, channels, conversions), plus Instagram insights and Meta Ads data. All of it is collected daily into the dashboard EchoPulse built for the account, and the 19 November 2026 refresh was read from that dashboard. The August figures came from a direct Search Console export.',
    dateRanges:
      'Daily impressions and total clicks: 19 February to 16 November 2026, 271 days, of which the first 75 are before the 5 May 2026 relaunch. November average: 1 to 16 November 2026. Sessions, users, clicks and impressions growth: 19 August to 16 November 2026 against 21 May to 18 August 2026, 90 days each. Average position: the same two windows, as the dashboard computed them on 16 November 2026. Click-through rate: 18 August to 16 November 2026. Channels, countries, AI assistant sessions, bot sessions, Instagram, ad spend and conversions: 12 August to 9 November 2026, not refreshed on 19 November.',
    counted:
      'An impression is one time magicbnb.io was shown in Google search results. Daily averages are the month total divided by the days counted in that month; November covers the 1st to the 16th only. Articles are the blog URLs in the magicbnb.io sitemap, counted on 19 November 2026. Sessions and conversions are as GA4 recorded them.',
    notCounted:
      'Impressions are not clicks or sign-ups: clicks and conversions are reported separately. AI visibility is reported only as sessions arriving from AI assistants (86 in 90 days), not as a count of AI answers that named the product. Keyword cannibalisation was not re-measured for this update. Search Console revises its most recent days, so 14 to 16 November 2026 may still change; five earlier days (14 to 17 August and 11 November) were revised upward by Google after they were first published here. The Search Console screenshot covers a shorter window (17 May to 16 November 2026) with rounded totals, so it does not match the headline figures to the digit.',
  },
  timelineAnswer:
    'The rebuilt site went live on 5 May 2026, 75 days into the window. Impressions went from 13 on 4 May to 209 on 5 May. The daily average was 496.6 in May, 1,199.4 in June, and 4,802.9 in the first 16 days of November 2026, about six months after launch.',
  relatedService: { slug: 'seo-aeo', label: 'How the SEO and AEO service works' },
  fit: {
    suits: [
      'You can give search months to work. The first two months here produced nothing visible.',
      'Buyers in your category already search for comparisons, pricing and alternatives.',
      'You can publish at volume, or want a team that does it for you.',
      'You want one team across the site, content, social, ads and tracking.',
    ],
  },
  tracking: {
    heading: 'How does EchoPulse track what is working?',
    claim: 'One dashboard, built for this account, and an AI assistant that can be asked about it.',
    body: [
      'Lakshya Soni designed and built a marketing dashboard for MagicBNB, and a custom MCP server on top of it. MCP is the Model Context Protocol, which lets an AI assistant query the data directly instead of someone exporting spreadsheets.',
      'A collector pulls Google Analytics 4, Google Search Console, Meta Ads, Microsoft Clarity and Instagram every day and stores its own permanent history, so a number can be checked against any earlier day. That matters most for Clarity, whose export only returns the last one to three days: a missed day is gone. The dashboard has a tab per source, an overview with period-on-period changes, date ranges of 7, 30 and 90 days or custom, a CSV export, and a freshness strip that shows when each source last ran.',
      'Beyond the source tabs there are views for keywords and rank history, pages losing traffic, ad campaigns and which ad sent people to which landing page, audience, Instagram, the content calendar, the free calculators, the sales video, product activation, and a log of every question an AI assistant has asked of the data.',
      'Landing pages are tested against each other with two statistical checks that must agree before a winner is called, a minimum sample, and at least a full week of traffic. A health check runs first: if visitors are not splitting between pages the way the test says they should, the result is marked broken instead of reported, and rage clicks and dead clicks are watched so a page cannot win while frustrating people. The free calculators and the sales video each have their own funnel, from first view to trial click, so a drop at one step shows up as that step.',
      'The MCP server gives an AI assistant a set of read tools: a daily briefing, period comparisons, an explanation of why a metric changed, search, ads, landing page and calculator reports, and a check of whether the pipeline ran. Each person gets their own access key with its own permissions, keys can expire or be revoked, every call is logged, and date ranges and inputs are checked before any query runs.',
      'It is the eyes and the backbone of the engagement. Every search and session figure refreshed on this page on 19 November 2026 was read from it.',
    ],
    rows: [
      {
        source: 'Google Search Console',
        tracked: 'Queries, pages, daily rank history per keyword, index status, published posts',
        decision: 'Which pages get the next round of edits (queries at positions 8 to 20), what to write next, which pages are not indexed',
      },
      {
        source: 'Google Analytics 4',
        tracked: 'Sessions, users, channels, countries, devices, landing pages, events, error pages',
        decision: 'Where visitors come from, which market to write for, which broken links to fix',
      },
      {
        source: 'Meta Ads',
        tracked: 'Delivery by campaign, ad set and ad, split by platform, age and gender',
        decision: 'Which message to keep, and which ad to point at which landing page',
      },
      {
        source: 'Microsoft Clarity',
        tracked: 'Session behaviour, rage clicks, dead clicks, bot sessions',
        decision: 'Which page to fix next, and which sessions to remove before anything is reported',
      },
      {
        source: 'Instagram',
        tracked: 'Followers, reach and engagement per post, audience by country and age',
        decision: 'Which formats get the editing hours',
      },
      {
        source: 'Landing-page A/B tests',
        tracked: 'Visitors, engaged time, bounce and each step to a trial, with a check that the traffic split is not broken',
        decision: 'Which landing page wins, and whether the test can be trusted yet',
      },
      {
        source: 'Sales video',
        tracked: 'Retention for every 5 percent of the video, drop-offs and rewatches',
        decision: 'Where the video loses people and needs a recut',
      },
      {
        source: 'Free calculators',
        tracked: 'The funnel and Google Search performance of each calculator',
        decision: 'Which calculator to improve or build next',
      },
      {
        source: 'Product and revenue feed',
        tracked: 'Trial funnel, activation, churn and revenue, with accounts kept anonymous',
        decision: 'Whether traffic turns into trials and paying accounts',
      },
      {
        source: 'Blog publishing',
        tracked: 'Every post passes a lint check and a preview, publishes in stages, and can be rolled back',
        decision: 'Content ships from the same place the results are read, with a way to undo it',
      },
    ],
    whyHeading: 'Why it matters',
    why: [
      {
        title: 'One source of truth',
        detail: 'Search, analytics, ads, social and site behaviour sit in one place with the same date ranges, so nobody argues about which export is right.',
      },
      {
        title: 'Decisions the same day',
        detail: 'The data refreshes daily, so the weekly plan is built from this week and not from last month.',
      },
      {
        title: 'Leads traced to a source',
        detail: 'Every page on the blog carries a tracked call to action, so a sign-up can be traced back to the article, ad or page that earned it.',
      },
      {
        title: 'Problems caught automatically',
        detail: 'A broken traffic split in an A/B test, a tracking gap, a page that dropped out of the index and a broken inbound link are all flagged by the system, not found by luck.',
      },
      {
        title: 'Questions answered in seconds',
        detail: 'Through the MCP server an AI assistant can be asked what changed this week and why, and it answers from the live data.',
      },
    ],
    clientGets: [
      'A private dashboard with every channel on one screen.',
      'A daily briefing of what moved, what broke and what to do next.',
      'Numbers that have been checked: bots are separated from people before anything is reported, and the pipeline was audited for double counting and truncated data.',
      'Safety rails on anything that writes: blog posts are linted, previewed and published in stages, with a rollback.',
      'Privacy rails: product accounts appear to the AI tools as anonymous references, and any access to lead contact details is logged.',
    ],
    examples: [
      {
        title: 'Singapore got its own market report',
        detail: 'Singapore surfaced in the analytics as the second largest source of sessions, ahead of Canada. Nobody had planned for it. A dedicated market report was shipped, and Singapore has stayed second.',
      },
      {
        title: 'Editing hours moved to Reels',
        detail: 'In 90 days Reels reached 8,009 accounts and feed posts reached 270. That split, read from the Instagram data, decides where the editing hours go.',
      },
      {
        title: 'The broken link stayed on the list',
        detail: 'The dashboard flags a broken inbound link that still sends visitors to a 404. It was on the August list as being fixed, the system kept reporting it, and so it is still printed in the open problems below.',
      },
    ],
    notPublished:
      'The dashboard also tracks ad spend detail, trials, sign-ups and revenue. Those are the client\'s private numbers and are not published on this page.',
    screens: [],
  },
  client: 'MagicBNB',
  clientUrl: 'https://magicbnb.io',
  clientTagline: 'Portfolio analytics for short-term rental operators. Connects the property management system to the bank and reconciles the two every night.',
  industry: 'B2B SaaS, short-term rental analytics',
  icpKey: 'founders',

  // Title stays short because the root layout appends the brand suffix for the
  // document title. Description is held to the 140 to 160 band the rest of the
  // site uses, since it is the second half of the click decision.
  metaTitle: 'MagicBNB Case Study: 5.8 to 4,803 Impressions a Day',
  metaDescription:
    'How EchoPulse runs MagicBNB marketing end to end: site, 227 articles, AI search, Instagram, ads. 5.8 to 4,803 daily Google impressions. Real export.',

  eyebrow: 'Case study',
  headline: '5.8 impressions a day to 4,803',
  headlineAccent: 'in seven months.',
  summary:
    'In April 2026 magicbnb.io was shown in Google search results an average of 5.8 times a day. In the first 16 days of November 2026 the average was 4,803, and the best single day hit 5,522. Same company, same product, same market. EchoPulse runs the whole marketing function: the site, the content plan, 227 articles, answer-engine work, the founder brand on Instagram and LinkedIn, the ad creative and the measurement. Here is every part of that system, the real Search Console export, and the parts that are still broken.',

  tldr: [
    'Result: Google impressions went from 5.8 a day in April 2026 to 4,803 a day in 1 to 16 November 2026. Sessions are up 220 percent in the 90 days to 16 November.',
    'How: one team runs the site, the content plan, 227 articles, answer-engine content, Instagram, LinkedIn, ads and tracking from the same research.',
    'The catch: click-through rate is still under half a percent, and only 18 conversions were recorded in the 90 days to 9 November.',
  ],

  bars: [
    {
      title: 'Where visitors came from, last 90 days',
      caption: 'GA4 sessions by channel, 12 August to 9 November 2026.',
      items: [
        { label: 'Direct', value: 3441, display: '3,441' },
        { label: 'Organic search', value: 1546, display: '1,546' },
        { label: 'Paid social', value: 524, display: '524' },
        { label: 'AI assistants', value: 86, display: '86' },
        { label: 'Organic Instagram', value: 56, display: '56' },
      ],
    },
    {
      title: 'Instagram reach by format, last 90 days',
      caption: 'Accounts reached, Instagram insights, 12 August to 9 November 2026. 69 Reels against 6 feed posts.',
      items: [
        { label: 'Reels', value: 8009, display: '8,009' },
        { label: 'Feed posts', value: 270, display: '270' },
      ],
    },
    {
      title: 'Average daily impressions by month',
      caption: 'Average daily Google search impressions per month, Google Search Console, magicbnb.io, read 19 November 2026. February is the 19th to the 28th; November is the 1st to the 16th (4,802.9, shown as 4,803 elsewhere on this page). February 33.7 and March 18.0 are in the month table below.',
      items: [
        { label: 'Apr', value: 5.8, display: '5.8' },
        { label: 'May', value: 496.6, display: '496.6' },
        { label: 'Jun', value: 1199.4, display: '1,199.4' },
        { label: 'Jul', value: 1296, display: '1,296.0' },
        { label: 'Aug', value: 1646.3, display: '1,646.3' },
        { label: 'Sep', value: 2504.3, display: '2,504.3' },
        { label: 'Oct', value: 2732.1, display: '2,732.1' },
        { label: 'Nov', value: 4802.9, display: '4,802.9' },
      ],
    },
  ],

  windowLabel: '19 February to 16 November 2026',
  windowStartISO: '2026-02-19',
  windowEndISO: '2026-11-16',
  publishedISO: '2026-08-20',
  updatedISO: '2026-11-19',

  services: [
    'Site rebuild and development',
    'Content planning',
    'SEO and answer-engine content',
    'Blog production',
    'Founder brand: Instagram and LinkedIn',
    'Paid social and ad creative',
    'Analytics and conversion tracking',
  ],

  heroMetrics: [
    { value: '5.8 to 4,803', label: 'average daily Google impressions, April 2026 against 1 to 16 November 2026', note: 'Google Search Console, magicbnb.io' },
    { value: '380,327', label: 'total impressions across the window', note: '271 days to 16 November, 1,624 clicks' },
    { value: '227', label: 'articles live in the architecture', note: '199 by August, counted from the sitemap on 19 November' },
    { value: '+220%', label: 'sessions, 90 days to 16 November against the prior 90', note: '6,819 against 2,129' },
  ],

  atAGlance: [
    { label: 'Client', value: 'MagicBNB (magicbnb.io)' },
    { label: 'Industry', value: 'B2B SaaS, short-term rental portfolio analytics' },
    { label: 'Starting point', value: '5.8 Google impressions a day, declining' },
    { label: 'Engagement', value: 'Full marketing: site, content planning, SEO and AEO content, Instagram and LinkedIn founder brand, ad creative, analytics' },
    { label: 'Date window', value: '19 February to 16 November 2026' },
    { label: 'Change shipped', value: '5 May 2026, rebuilt site live' },
    { label: 'Measured result', value: '380,327 impressions and 1,624 clicks; 1 to 16 November averaging 4,803 impressions a day' },
    { label: 'How measured', value: 'Google Search Console and GA4 for magicbnb.io, plus Instagram and Meta Ads data. First export 18 August 2026, refreshed 13 November and 19 November 2026' },
    { label: 'Last updated', value: '19 November 2026' },
  ],

  chart: {
    daily: [
      46, 37, 52, 33, 28, 37, 28, 26, 35, 15, 26, 76, 22, 16, 20, 31, 14, 13, 21, 18,
      27, 24, 16, 16, 9, 14, 18, 8, 44, 10, 22, 13, 13, 10, 7, 10, 6, 12, 12, 5,
      4, 1, 4, 3, 4, 4, 3, 8, 3, 3, 3, 1, 3, 5, 2, 4, 4, 12, 3, 12,
      5, 5, 13, 20, 5, 6, 2, 6, 12, 10, 9, 22, 11, 6, 13, 209, 496, 416, 369, 313,
      352, 347, 355, 376, 488, 537, 502, 570, 594, 350, 293, 324, 581, 639, 716, 604, 602, 801, 835, 913,
      1293, 1467, 1011, 697, 720, 778, 559, 553, 635, 896, 969, 1122, 1245, 1188, 1271, 1794, 1620, 1920, 1742, 1625,
      1621, 1303, 1283, 1415, 1122, 1043, 1126, 1190, 1308, 1354, 1421, 1452, 1433, 1384, 1486, 1818, 2087, 2209, 2074, 2018,
      2015, 1469, 1617, 1724, 1307, 1301, 1133, 959, 978, 811, 1131, 878, 903, 876, 919, 960, 806, 828, 1065, 980,
      1026, 1131, 851, 1063, 1479, 1380, 1651, 1619, 1479, 1080, 1280, 1594, 1704, 1451, 1349, 1402, 1861, 1867, 2239, 2429,
      2784, 2139, 1705, 1689, 1635, 1555, 1509, 1675, 1606, 1501, 1510, 1380, 1597, 1823, 2085, 2599, 2485, 2311, 2414, 2621,
      2852, 2792, 3080, 3491, 2610, 2737, 2662, 3007, 3160, 3275, 2740, 2219, 2127, 2000, 2189, 2466, 2321, 2470, 2205, 2028,
      1906, 2233, 2025, 2018, 2037, 1895, 1693, 1937, 2224, 2683, 2391, 2412, 2174, 2139, 2356, 2518, 2157, 2119, 2380, 2075,
      1814, 2092, 2298, 2311, 2498, 3252, 2957, 2595, 2939, 3755, 3363, 5126, 5286, 5140, 4079, 4370, 4973, 5259, 5522, 4366,
      4954, 4080, 4596, 5086, 4932, 5348, 5241, 5119, 4595, 4430, 3975,
    ],
    launchIndex: 75,
    launchLabel: '5 May: rebuilt site ships',
    beforeLabel: 'before',
    monthTicks: [
      { index: 0, label: 'Feb' },
      { index: 10, label: 'Mar' },
      { index: 41, label: 'Apr' },
      { index: 71, label: 'May' },
      { index: 102, label: 'Jun' },
      { index: 132, label: 'Jul' },
      { index: 163, label: 'Aug' },
      { index: 194, label: 'Sep' },
      { index: 224, label: 'Oct' },
      { index: 255, label: 'Nov' },
    ],
    yTicks: [
      { frac: 0, label: '0' },
      { frac: 0.25, label: '1.4K' },
      { frac: 0.5, label: '2.8K' },
      { frac: 0.75, label: '4.1K' },
      { frac: 1, label: '5.5K' },
    ],
    ariaLabel:
      'Chart of MagicBNB daily Google search impressions, 19 February to 16 November 2026. Near zero until the 5 May relaunch: 13 impressions on 4 May, 209 on 5 May. The daily average was 1,646.3 in August and 4,802.9 in 1 to 16 November. The best single day is 4 November at 5,522.',
    caption:
      'Daily impressions, Google Search Console property for magicbnb.io, 19 February to 16 November 2026, 271 days. The dashed line is 5 May, the day the rebuilt site went live. On 4 May the site earned 13 impressions. On 5 May it earned 209. The best day so far is 4 November at 5,522.',
  },

  situation: {
    headline: 'The old site was not underperforming. It was structurally incapable of performing.',
    body: [
      'Before 5 May 2026, across 75 days, the site earned 1,121 impressions in total. An average of 14.9 a day, trending down. April was the floor at 5.8 a day. That is not a site losing a ranking fight. That is what Google shows you when it has concluded there is nothing on the domain worth surfacing.',
      'Four things were missing, and none of them could be fixed by publishing more.',
    ],
    failures: [
      {
        title: 'No content surface',
        detail: 'A handful of marketing pages, no blog architecture, and no reason for a crawler to ever come back.',
      },
      {
        title: 'No entity definition',
        detail: 'Nothing stated plainly what MagicBNB is, who it serves, or how it differs from a property management system. Search engines and language models had nothing to learn from.',
      },
      {
        title: 'No extraction structure',
        detail: 'No question-shaped headings, no comparison tables, no definition sentences, no FAQ schema. Nothing an AI Overview could lift and quote.',
      },
      {
        title: 'A buried conversion path',
        detail: 'The free trial was hard to find, and the product was described in feature language instead of the language of the problem it solves.',
      },
    ],
  },

  workstreams: [
    {
      name: 'Site rebuild and development',
      stat: { value: '13 to 209', label: 'impressions, the day before launch against launch day' },
      serviceSlug: 'websites-funnels',
      summary:
        'A full rebuild on Next.js, designed around three jobs: explain the product to a human in ten seconds, prove it to a sceptic in ninety, and give a machine something unambiguous to quote.',
      points: [
        'A problem-first homepage that opens on the question the buyer already has, whether they actually know which of their properties make money, then quantifies the cost of not knowing.',
        'Live product surfaces rendered as working interface on the page rather than static screenshots: portfolio dashboard, per-property profit and loss, owner statements, bank reconciliation.',
        'A three-step onboarding narrative carrying the real timings, 60 seconds to connect the property management system and 90 for the bank, instead of vague promises.',
        'Clean crawl paths, canonical discipline, structured metadata, verified search and social properties, and a performance budget that holds Core Web Vitals green as content weight grows.',
        'A trial-first conversion path with pricing published openly and no request-a-demo wall.',
      ],
    },
    {
      name: 'Content planning: what gets written, and why',
      stat: { value: '11.5 to 9.2', label: 'average position, 90 days to 16 November' },
      serviceSlug: 'seo-aeo',
      summary:
        'Nothing is written because it is Tuesday. Every article comes out of one of four inputs, and the plan is rebuilt from the data every week.',
      points: [
        'Input one, the Search Console export. Queries sitting between positions 8 and 20 are the cheapest wins on the site, so they are read every week and the pages behind them get the next round of edits. Site-wide average position moved from 11.5 to 9.2 across the 90 days to 16 November 2026.',
        'Input two, platform news. When Airbnb changes a policy, hosts search for it the same day. The plan keeps room for that: the November 2026 house rules change, the holiday pricing window and the 1099 threshold for cleaners each had an article live while the question was still being asked.',
        'Input three, the buyer next to the buyer. Hosts are not the only people who open the product. Articles for real estate agents sizing up short-term rental potential and for accountants handling rental clients at year end bring in the people who recommend software to hosts.',
        'Input four, what the data says that nobody planned. Singapore surfaced as the second largest source of sessions, ahead of Canada. We read it in the analytics, shipped a dedicated market report, and it has stayed second: 1,613 sessions in the last 90 days against 2,676 from the United States.',
        'Each planned piece is assigned a layer, a target query, the pages it must link to and the pages that must link back, before a word is written. That is what stops article 227 from competing with article 40.',
      ],
    },
    {
      name: 'Content architecture, shipped before the content',
      stat: { value: '227', label: 'articles live' },
      serviceSlug: 'seo-aeo',
      summary:
        'The sequencing is the part most teams get wrong. Publishing 199 articles onto a site that cannot cluster, link or surface them produces 199 orphan pages.',
      points: [
        'Blog architecture built to carry hundreds of posts, with category routing, cross-linking slots and related-post surfaces, built and shipped before the first article landed.',
        'Every article sits in one of three layers. Competitive displacement: head-to-head comparisons where the buyer is already shopping. Operator economics: the maths hosts search at 11pm, which builds the topical authority that makes layer one rankable. Market and regulation reports: city-level and regulatory coverage, which is what earns links.',
        'The reason the impression curve goes near vertical from the day of the relaunch, rather than creeping up over a year, is that the first wave of writing landed into a structure already built to hold it.',
        '199 articles were live by 17 August. The sitemap listed 219 on 13 November and 227 on 19 November. The pace dropped on purpose after August: the work moved from adding pages to improving the ones already ranking.',
        'Nine of the top ten pages by impressions are editorial. The brand page stopped being the only door into the business.',
      ],
    },
    {
      name: 'Choosing what to rank for',
      stat: { value: '52,793', label: 'impressions from one article, May to mid August' },
      serviceSlug: 'seo-aeo',
      summary:
        'The single highest-leverage decision was refusing to fight for head terms. Phrases like short term rental software are owned by companies with a decade of domain authority and budgets a young SaaS does not have.',
      points: [
        'We mapped the category frustration instead. The best known name in short-term rental data is expensive and estimates market averages rather than reporting your actual numbers. That combination produces a very specific, very high-intent search behaviour: people looking for a way out.',
        'The flagship article on alternatives to the category leader earned 52,793 impressions on its own between May and mid August, against 1,121 for the entire site in the 75 days before the relaunch.',
        'The same pattern was then repeated across the category. Pricing and alternatives pages for the property management systems hosts already pay for are now among the most shown pages on the site, next to the original displacement article.',
        'Pricing queries turned out to be the sharpest version of the idea. A host searching what a tool costs is one step from choosing one, and the site now holds first-page positions on several of those queries.',
      ],
    },
    {
      name: 'Answer engines and AI presence',
      stat: { value: '86', label: 'visits from AI assistants in 90 days' },
      serviceSlug: 'seo-aeo',
      summary:
        'Most of these searches end without a click, because Google answers in place. Most agencies would bury that. It is the centre of the strategy.',
      points: [
        'When someone searches what a good occupancy rate is, Google increasingly answers in place using text lifted from pages it trusts. The user never clicks. The impression still registers. If the answer being read out is yours, carrying your framing and your brand name, you have been cited to a buyer who never visited the site.',
        'Question-shaped H2 headings phrased the way people actually type them, because that is the retrieval unit an answer engine matches against.',
        'A clean definition sentence near the top of every page, at least one comparison table per piece, FAQ answers sized between 40 and 60 words, and key takeaway bullets at the end. These are the four most frequently extracted blocks.',
        'Entity consistency: the same description of what the company is and who it serves, repeated in consistent language across every article, the metadata and the off-site profiles, including a claimed Trustpilot page. Models learn entities by repetition across sources.',
        'The honest read on whether it is working. In the last 90 days GA4 recorded 86 sessions from AI assistants, about 1 percent of traffic: 54 from ChatGPT and 11 from Gemini among them. That is small, and any agency claiming large AI citation numbers in 2026 is measuring badly or making it up. It is also not zero: people are now arriving from a chat window where the product was named in the answer.',
      ],
    },
    {
      name: 'Founder brand: Instagram and LinkedIn',
      stat: { value: '8,009', label: 'accounts reached by Reels in 90 days' },
      serviceSlug: 'video-editing',
      summary:
        'Software in this category is bought on trust, and trust attaches to a person before it attaches to a logo. The founder is a working host, so the content is a host talking to hosts.',
      points: [
        'Instagram is run as short video first. In the last 90 days the account published 69 Reels and 6 feed posts. Reels reached 8,009 accounts between them; the feed posts reached 270. That split decides where the editing hours go.',
        'Three kinds of Reel carry the plan. Fast reactions to Airbnb changes hosts are worried about. The founder building in public, including a numbered series on building the product. And operator stories from a real portfolio, such as opening a 25th property.',
        'The audience is the buyer. Of the followers Instagram reports a country for, 83 percent are in the United States and 12 percent in Canada, and two thirds are aged 25 to 54.',
        'The account is small and we print that: 573 followers on 9 November 2026. Reach is uneven. One Reel on 23 October reached 766 accounts; most reach under 200. The job at this size is finding the formats that travel, then repeating them.',
        'LinkedIn runs on the same research. A market report becomes a post about what operators in that city are actually earning, so the research cost is paid once and used three times: article, Reel, post.',
      ],
    },
    {
      name: 'Paid social and ad creative',
      stat: { value: '$2,211.87', label: 'ad spend in 90 days' },
      serviceSlug: 'ad-creatives',
      summary:
        'Creative produced in house across static, video and carousel, iterated against delivery data rather than opinion.',
      points: [
        'Spend in the last 90 days was $2,211.87, against $870.83 in the 90 days before. That is still a learning budget, and it is treated as one.',
        'The job of paid here is not volume. It is to buy fast feedback on which messages land, then feed the winners back into the organic content and the site copy.',
        'Paid clicks go to dedicated landing pages, each built around one message, and the pages are tested against each other rather than sending everything to the homepage.',
        'Ad creative and organic content are produced by the same team from the same research, so a message that wins in paid is in the blog and on Instagram the same week.',
      ],
    },
    {
      name: 'Site visitors, tracking and reporting',
      stat: { value: '18', label: 'conversions recorded, from zero tracked' },
      serviceSlug: 'automations',
      summary:
        'Traffic nobody can read is decoration. Search, analytics, Instagram, ads and session recordings are pulled into one dashboard every day, and that dashboard is what the weekly plan is built from.',
      points: [
        'Where visitors came from in the last 90 days: 3,441 sessions direct, 1,546 from organic search, 524 from paid social. Direct is largely brand recall, people who met the company on social or in a search result and typed the domain in later.',
        'Conversions are now measured. The August version of this page reported that sign-ups were not instrumented. They are: GA4 recorded 18 conversions in the last 90 days, against none recorded before.',
        'Bots are separated from people before anything is reported. The filter classed 5,309 sessions as bot and 4,244 as real in the same window, which is why raw session counts are never quoted on their own.',
        'Session recordings show where people stall on a page, which feeds the next round of landing page and homepage edits.',
        'Every page on the blog carries a tracked call to action, so a sign-up can be traced back to the article that earned it.',
      ],
    },
  ],

  months: [
    { month: 'February 2026', impressions: '337', perDay: '33.7', note: 'Legacy site, declining' },
    { month: 'March 2026', impressions: '557', perDay: '18.0', note: 'Audit and architecture work, nothing shipped' },
    { month: 'April 2026', impressions: '175', perDay: '5.8', note: 'The floor. Build in progress' },
    { month: 'May 2026', impressions: '15,394', perDay: '496.6', note: 'Rebuild ships on the 5th' },
    { month: 'June 2026', impressions: '35,983', perDay: '1,199.4', note: 'The comparison cluster starts ranking' },
    { month: 'July 2026', impressions: '40,177', perDay: '1,296.0', note: 'Steady compounding' },
    { month: 'August 2026', impressions: '51,035', perDay: '1,646.3', note: 'First version of this page published on the 20th' },
    { month: 'September 2026', impressions: '75,128', perDay: '2,504.3', note: 'Pricing and alternatives pages take over' },
    { month: 'October 2026', impressions: '84,695', perDay: '2,732.1', note: 'A step up in the last week, past 5,000 a day' },
    { month: 'November 2026, to the 16th', impressions: '76,846', perDay: '4,802.9', note: 'Highest daily average so far' },
  ],

  funnel: {
    intro:
      'Impressions on their own are a vanity number. Here are the 90 days from 19 August to 16 November 2026 against the 90 before, 21 May to 18 August 2026, from the same Search Console and GA4 properties. Conversions were not refreshed and keep their earlier window.',
    beforeLabel: '21 May to 18 Aug',
    afterLabel: '19 Aug to 16 Nov',
    rows: [
      { label: 'Sessions', before: '2,129', after: '6,819', change: '+220%', direction: 'up' },
      { label: 'Users', before: '1,959', after: '6,347', change: '+224%', direction: 'up' },
      { label: 'Organic search clicks', before: '420', after: '1,144', change: '+172%', direction: 'up' },
      { label: 'Impressions', before: '114,646', after: '257,993', change: '+125%', direction: 'up' },
      { label: 'Average position', before: '11.5', after: '9.2', change: '2.3 better', direction: 'up' },
      { label: 'Conversions recorded, 90 days to 9 Nov', before: '0', after: '18', change: 'now tracked', direction: 'up' },
    ],
    readingLabel: 'Reading it honestly.',
    reading:
      'Every row moved the right way, which was not true in August, when impressions and average position both slipped while the new pages matured. The growth rates are lower than the ones printed here on 13 November (sessions were +248 percent then) because the earlier 90 days they are compared against are now higher (2,129 sessions against 1,848). Two cautions still apply. Clicks grew more slowly than impressions, so the click-through problem below is still the biggest one on the site. And 18 conversions is a start, not a result: it proves the tracking works, not that the funnel does.',
  },

  midCtaText:
    'Want to know whether this would work for your site? The audit call opens by looking at your Search Console the same way we looked at this one.',
  openProblemsAccent: 'taken from the same export.',

  proof: [
    {
      src: '/case-studies/magicbnb-gsc-proof.png',
      alt: 'Google Search Console performance report for magicbnb.io, web search, 19 February to mid August 2026: 477 total clicks, 122K total impressions, 0.4% average click-through rate, average position 11.7. The impressions line stays near zero until early May 2026 and climbs past 2,000 a day in July and August.',
      width: 1893,
      height: 895,
      caption:
        'Google Search Console, property magicbnb.io, performance report for 19 February to 17 August 2026, exported 18 August 2026, the first export behind this page. Totals as the console rounds them: 477 clicks, 122K impressions, 0.4% click-through rate, average position 11.7. Google has since revised 14 to 17 August upward, so the chart above is slightly higher for those four days. Published with the client written consent.',
    },    {
      src: '/case-studies/magicbnb-gsc-6mo-nov18.png',
      alt: 'Google Search Console performance report for magicbnb.io over six months, 17 May to 16 November 2026: 1.57K total clicks, 374K total impressions, 0.4% average click-through rate, average position 9.9. The impressions line climbs from near zero in May to between four and six thousand a day in November.',
      width: 1536,
      height: 757,
      caption:
        'Google Search Console, property magicbnb.io, web search, last 6 months (17 May to 16 November 2026), captured 18 November 2026. Totals as the console rounds them: 1.57K clicks, 374K impressions, 0.4% click-through rate, average position 9.9. This is a shorter window than the headline figures above, and the console rounds, which is why the two do not match to the digit.',
    },
  ],

  openProblems: [
    {
      title: 'Click-through rate is still under half a percent',
      detail:
        'From 18 August to 16 November 2026, 260,777 impressions produced 1,150 clicks, a rate of 0.44 percent, barely up from 0.4. Titles and descriptions are not earning the click the ranking already won. At current volume, moving the rate to a still-modest 2 percent is roughly 2,000 extra clicks a month without publishing a single new page. This was the highest value work available in August and it still is.',
      status: 'In progress',
    },
    {
      title: 'Conversions are tracked, and the number is small',
      detail:
        '18 recorded conversions in the 90 days to 9 November 2026, from 6,435 sessions in that window. The tracking gap from August is closed. The gap between traffic and trials is not, and that is now the main job of the landing page tests.',
      status: 'In progress',
    },
    {
      title: 'A broken inbound link is still sending visitors to a 404',
      detail:
        'This was on the August list as being fixed. It was not finished: the error page took 54 visits in the last 90 days. It is printed here again rather than quietly dropped.',
      status: 'Overdue',
    },
    {
      title: 'Two articles are not indexed',
      detail: 'Three in August, one on 13 November, two when the dashboard was read on 19 November. Both are flagged in the dashboard and being monitored.',
      status: 'Monitoring',
    },
    {
      title: 'Keyword cannibalisation',
      detail:
        'In August the brand query was split across 23 pages and the flagship comparison query across 14. That is the cost of shipping 199 articles quickly. Consolidation and canonical work is under way and has not been re-measured for this update.',
      status: 'Not re-measured',
    },
    {
      title: 'More than half of sessions are bots',
      detail:
        '5,309 bot against 4,244 real in the last 90 days. Normal for a site with a large content surface, but it means raw session counts need filtering before anyone celebrates them.',
      status: 'Filtered in reporting',
    },
    {
      title: 'The Instagram account is small',
      detail:
        '573 followers, and organic Instagram sent 56 sessions to the site in 90 days. The audience is the right one. The reach is not there yet.',
      status: 'In progress',
    },
  ],

  notApplicable: [
    {
      title: 'You need leads this month',
      detail:
        'The curve above took months to bend and the first two produced nothing visible. If the business needs pipeline inside 30 days, paid and outbound are the honest answer, and this programme runs behind them rather than instead of them.',
    },
    {
      title: 'Your category has no comparison behaviour',
      detail:
        'This worked because there is an expensive, well known incumbent that buyers actively search for alternatives to. If nobody is shopping around in your category yet, the displacement layer has nothing to displace and the whole plan changes.',
    },
    {
      title: 'You cannot publish at volume',
      detail:
        '199 articles in the first four months was the input. At a tenth of that volume the architecture still helps, but you should expect a tenth of the surface and a much longer curve, and you should plan for that rather than be surprised by it.',
    },
    {
      title: 'Your product cannot be described honestly',
      detail:
        'Every page here was straightforward to write because the product does what it says. Content cannot fix a product that does not, and a large indexed content surface makes that discoverable faster, not slower.',
    },
  ],

  dataset: {
    name: 'MagicBNB Google Search Console daily impressions, 19 February to 16 November 2026',
    description:
      'Daily Google Search impression counts for the magicbnb.io Search Console property, 19 February to 16 November 2026 inclusive, 271 daily observations totalling 380,327 impressions. First exported 18 August 2026, refreshed 19 November 2026, and published with the site owner consent.',
    measurementTechnique: 'Google Search Console performance report export',
    variableMeasured: ['Search impressions', 'Search clicks', 'Average position', 'Click-through rate'],
  },
};

/**
 * Founder background. NOT a client case study, and it must never read like one.
 *
 * The agents and brokerages mentioned here were clients of a previous employer,
 * edited by Lakshya as one of that company's editors. They are not EchoPulse
 * clients and none of them endorses EchoPulse. The page says so in the summary
 * table and again in the "does not claim" section, because an AI answer that
 * lifts one paragraph should still carry the caveat.
 *
 * The previous company is deliberately not named. The criticism is written as
 * the founder's own experience and as the reason EchoPulse is built the way it
 * is, not as an accusation against an identifiable business.
 *
 * Every figure is the founder's own account of his work history. Nothing here
 * is a measured result, so there is no chart, no funnel and no Dataset node.
 * The stills are frames from listing reels already shown on /work.
 */
const founderStory: CaseStudy = {
  slug: 'founder-200-real-estate-agents',
  kind: 'founder',
  shortName: 'Lakshya Soni',
  resultLine: 'No client result is claimed on this page. It is the founder\'s work history, in his own account.',
  fit: {
    suits: [
      'You are a real estate agent with listing footage that needs editing.',
      'You want the person who hears the brief to be the person who cuts the footage.',
      'You want the price on the page before you get on a call.',
    ],
    notFor: [
      'You want measured results before anything else. This page has none; the MagicBNB case study does.',
      'You want a brokerage reference. EchoPulse Media has no brokerage as a client and does not claim one.',
    ],
  },
  answer: [
    'This is a founder background page, not a client case study: before starting EchoPulse Media, Lakshya Soni worked as a video editor at a Canadian real estate media company, where he edited listing tours, agent personal brand videos and UGC-style ads for more than 200 real estate agents across Canada.',
    'Those agents were the previous company\'s clients, not EchoPulse clients, and no agent or brokerage mentioned on the page endorses EchoPulse.',
    'The figure of more than 200 agents is the founder\'s own account of his work history, with no dated period and no measured result claimed.',
  ],
  keyFacts: [
    { label: 'Who', value: 'Lakshya Soni, founder of EchoPulse Media', href: 'https://echopulse.media/about/lakshya-soni' },
    { label: 'Industry', value: 'Real estate video' },
    { label: 'Type of work', value: 'Listing tour videos, agent personal brand content, UGC-style ads' },
    { label: 'Period', value: 'Before EchoPulse. No dated window is claimed.' },
    { label: 'Starting point', value: 'Video editor at a Canadian real estate media company that offered shooting and editing to agents' },
    { label: 'Result', value: 'No measured result is claimed. Edited for more than 200 real estate agents across Canada, as an editor at the previous company.' },
    { label: 'Data source', value: 'The founder\'s own account of his work history. There is no export, and no numbers from those agents.' },
    { label: 'Last updated', value: '13 November 2026' },
  ],
  indexResult:
    'Founder background, not a client result: before EchoPulse, Lakshya Soni edited videos for more than 200 Canadian real estate agents as an editor at a previous company. No results are claimed. Published 13 November 2026.',
  measurement: {
    tool: 'None. This page is the founder\'s own account of his work history, not a measured result.',
    dateRanges: 'No dated window is claimed. The work was done before EchoPulse Media. This page was published on 13 November 2026.',
    counted: 'The number of agents edited for (more than 200, across Canada), the footage format (4K, at 120 frames per second and above) and the three kinds of work.',
    notCounted: 'Any result for those agents. The founder edited the videos, did not run those agents\' marketing and does not have their numbers, so none are printed.',
  },
  client: 'Lakshya Soni, founder',
  clientUrl: 'https://echopulse.media/about',
  clientTagline:
    'Founder of EchoPulse Media. Editor, writer and developer. Before EchoPulse, an editor at a Canadian real estate media company.',
  industry: 'Founder story, real estate video',
  icpKey: 'real-estate',

  metaTitle: 'Founder Story: 200+ Real Estate Agents Edited',
  metaDescription:
    'Before EchoPulse, founder Lakshya Soni edited listing tours, agent brand videos and ads for 200+ Canadian real estate agents. What he saw, and what he built.',

  eyebrow: 'Founder story',
  headline: 'I edited for 200+ Canadian real estate agents.',
  headlineAccent: 'Then I built the studio I wished they had hired.',
  summary:
    'Before starting EchoPulse Media, I worked as a video editor for a real estate media company in Canada that shot and edited content for agents. Through that company I edited listing tours, personal brand videos and ads for more than 200 agents. This is what I worked on, what I saw go wrong from the editing desk, and why EchoPulse is built the opposite way.',

  tldr: [
    'The work: listing tours in 4K at 120 frames per second and above, agent personal brand content and UGC-style ads, for more than 200 Canadian agents.',
    'What I saw: agents paying premium prices for average edits, and the editors doing the work treated as replaceable.',
    'What I built: a studio where the price is on the page, the person who hears the brief cuts the footage, and nothing ships until you would post it under your own name.',
  ],

  windowLabel: 'Before EchoPulse',
  // No dated window is claimed. These only feed the Dataset node, which this
  // study does not emit, so they are set to the publish date.
  windowStartISO: '2026-11-13',
  windowEndISO: '2026-11-13',
  publishedISO: '2026-11-13',

  heroMedia: {
    src: '/founder.jpg',
    alt: 'Lakshya Soni, founder of EchoPulse Media.',
    width: 1487,
    height: 1594,
    caption: 'Lakshya Soni, founder of EchoPulse Media.',
  },

  labels: {
    eyebrowIndex: 'Founder story, not a client case study',
    situationKicker: 'Where I started',
    workKicker: 'What I edited',
    workHeading: 'Three kinds of work, one editing desk.',
    openProblemsKicker: 'To be clear',
    openProblemsHeading: 'What this page does not claim.',
    limitsKicker: 'What changed',
    limitsHeading: 'What I saw there, and what EchoPulse does instead.',
    clientLinkLabel: 'About Lakshya',
  },

  services: ['Listing tours in 4K', 'Agent personal brand content', 'UGC-style ads'],

  heroMetrics: [
    { value: '200+', label: 'Canadian real estate agents edited for', note: 'As an editor at a previous company' },
    { value: '4K, 120fps+', label: 'listing and property tour footage', note: 'Smooth slow motion, a lot of footage per home' },
    { value: '3', label: 'kinds of work', note: 'Listing tours, agent brand content, UGC-style ads' },
  ],

  atAGlance: [
    { label: 'Who', value: 'Lakshya Soni, founder of EchoPulse Media' },
    { label: 'Role', value: 'Video editor at a Canadian real estate media company that offered shooting and editing to agents' },
    { label: 'Agents edited for', value: 'More than 200 real estate agents across Canada' },
    { label: 'Brokerages', value: 'Agents at RE/MAX offices and other large Canadian brokerages' },
    { label: 'Footage', value: 'Listing and property tours shot in 4K, at 120 frames per second and above' },
    { label: 'Types of work', value: 'Listing tour videos, agent personal brand content, UGC-style ads' },
    { label: 'Whose clients', value: 'The previous company\'s clients, not EchoPulse clients. No brokerage or agent mentioned here endorses EchoPulse.' },
    { label: 'Last updated', value: '13 November 2026' },
  ],

  situation: {
    headline: 'The company was well known and busy. From the editing desk it looked different.',
    body: [
      'I am not naming the company, and this is one editor\'s experience, not an investigation. I cut the footage, so I saw two things the agents never did: what the edit could have been, and what was actually sent.',
      'Three things stayed with me, and each one became a rule at EchoPulse.',
    ],
    failures: [
      {
        title: 'The price did not match the work',
        detail: 'Agents paid premium prices. The people doing the editing were paid a small share of it, and the client had no way to see what the money bought.',
      },
      {
        title: 'Volume came before quality',
        detail: 'Edits went out that I would not have signed, because there was always another batch behind them.',
      },
      {
        title: 'Editors were treated as replaceable',
        detail: 'The culture was poor, and it showed in the work. People who are treated as interchangeable produce interchangeable edits.',
      },
    ],
  },

  workstreams: [
    {
      name: 'Listing and property tours',
      serviceSlug: 'video-editing',
      stat: { value: '4K, 120fps+', label: 'source footage' },
      summary:
        'The core of the job. High-resolution walk-throughs with smooth slow motion and a lot of footage per property.',
      points: [
        'The edit decides whether a buyer watches twelve seconds or the whole home: the opening shot, the order of the rooms, the pace, the colour.',
        'Aerial openers, address titles and room-by-room sequencing, cut for vertical feeds as well as widescreen.',
        'High frame rate footage is heavy and slow to work with. Handling it well is most of what separates a clean tour from a choppy one.',
      ],
      media: [
        { src: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/so_3,c_scale,w_900,q_auto,f_jpg/v1782371049/2426_fn_e4yyrc.jpg', alt: 'Aerial opening frame from a listing reel, a detached home on a residential street with the address as a title.', width: 900, height: 1600, caption: 'Opening frame from a listing reel.' },
        { src: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/so_3,c_scale,w_900,q_auto,f_jpg/v1782371126/2458_fn_uphhrb.jpg', alt: 'Frame from a real estate listing reel.', width: 900, height: 1600, caption: 'Frame from a listing reel.' },
        { src: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/so_3,c_scale,w_900,q_auto,f_jpg/v1782372139/2438_fn_z6wry7.jpg', alt: 'Frame from a real estate listing reel.', width: 900, height: 1600, caption: 'Frame from a listing reel.' },
      ],
    },
    {
      name: 'Agent personal brand content',
      serviceSlug: 'video-editing',
      stat: { value: '2 seconds', label: 'to earn the watch' },
      summary:
        'Talking-head videos, market updates, neighbourhood guides and day-in-the-life pieces: the content that gets an agent recognised before the listing appointment.',
      points: [
        'Edited very differently from a tour: tighter cuts, captions on screen, a hook in the first two seconds.',
        'The agent is the product here, so the edit has to sound like them and not like a template.',
      ],
    },
    {
      name: 'UGC-style ads',
      serviceSlug: 'ad-creatives',
      stat: { value: '3 seconds', label: 'decide if the rest is seen' },
      summary: 'Short ads cut to look native in a feed, for agents and for other businesses.',
      points: [
        'Several versions of the same idea with different openings, because the first three seconds decide whether the rest is ever seen.',
        'Made to be tested against each other, not to win an award.',
      ],
    },
  ],

  proof: [],

  midCtaText:
    'An agent? Book a short call, or send footage from one listing and get two edited videos back within 48 hours, free. You keep the files either way.',
  openProblemsAccent: 'said plainly.',

  openProblems: [
    {
      title: 'These were not EchoPulse clients',
      detail: 'The agents and brokerages were clients of the company I worked for. EchoPulse Media has no brokerage as a client and does not claim one.',
      status: 'Previous employer',
    },
    {
      title: 'Nobody here endorses EchoPulse',
      detail: 'No agent or brokerage mentioned on this page has reviewed or recommended EchoPulse Media. When a client is willing to speak on the record, we will introduce them.',
      status: 'No endorsement',
    },
    {
      title: 'No results are claimed',
      detail: 'I edited the videos. I did not run those agents\' marketing and I do not have their numbers, so there are none on this page.',
      status: 'No numbers',
    },
    {
      title: 'The measured proof is elsewhere',
      detail: 'The MagicBNB case study is the one with a real export behind it, and the work page has edits you can watch.',
      status: 'See MagicBNB',
    },
  ],

  notApplicable: [
    {
      title: 'Price',
      detail: 'There: premium prices, with no way for the client to see what the money bought. Here: every price is published with its exact scope, and the person you pay is the person doing the work.',
    },
    {
      title: 'Quality',
      detail: 'There: volume first. Here: every piece is re-done until you would ship it under your own name, and the client list is kept small on purpose.',
    },
    {
      title: 'People',
      detail: 'There: editors treated as replaceable. Here: three named people, the same three every month.',
    },
    {
      title: 'Ownership',
      detail: 'You keep everything made, whether or not you continue. Month to month, no contract.',
    },
  ],
};

/**
 * Working With God. Site replacement for Dr. Eliyahu Lotzar.
 *
 * This study deliberately carries NO traffic numbers. The old site ran on
 * GoDaddy Airo and no analytics baseline came across from it, so there is
 * nothing honest to compare against, and the page says so in the summary table
 * and again in the open problems rather than quietly leaving the reader to
 * assume there was a lift. Everything asserted here is either a fact the client
 * confirmed (the old monthly cost, the one-time build fee, the handover) or
 * something a reader can verify by opening workingwithgod.live.
 *
 * Published with Dr. Lotzar's consent to be named and linked.
 */
const workingWithGod: CaseStudy = {
  slug: 'working-with-god-rebuild',
  shortName: 'Working With God',
  resultLine:
    'Result: monthly platform bill from $50 to $60 down to $0, for a one-time $599. No traffic or conversion result is claimed.',
  fit: {
    suits: [
      'Your site is trying to speak to two audiences at once.',
      'You pay a site builder every month for something you have outgrown.',
      'You want to own the code and the content, with no monthly platform bill.',
      'You want the team to stay reachable after launch.',
    ],
  },
  answer: [
    'EchoPulse Media replaced the website for Working With God, the faith-based executive coaching practice of Dr. Eliyahu Lotzar, moving it in 2026 from a GoDaddy Airo site (reframedreality.com) shared with his organizational consulting practice to its own site, workingwithgod.live.',
    'The monthly platform bill for the coaching practice went from $50 to $60 a month to $0, for a one-time fee of $599, and the code and content were handed over to the client.',
    'The cost figures are confirmed facts about the engagement, and no traffic or conversion result is claimed because no analytics baseline carried over from the old platform; Google Analytics 4 and Microsoft Clarity were confirmed sending data on the new site on 18 November 2026.',
  ],
  keyFacts: [
    { label: 'Client', value: 'Dr. Eliyahu Lotzar, Ed.D., MSW. Working With God (workingwithgod.live)', href: 'https://workingwithgod.live' },
    { label: 'Industry', value: 'Faith-based executive coaching and leadership development' },
    { label: 'Service', value: 'Full site replacement: positioning, copy, design, build, launch, handover' },
    { label: 'Period', value: 'Rebuilt and launched in 2026. Tracking confirmed on 18 November 2026.' },
    { label: 'Starting point', value: 'reframedreality.com on GoDaddy Airo, two businesses sharing one site, at $50 to $60 a month in plugins and add-ons' },
    { label: 'Result', value: 'workingwithgod.live is live as the coaching practice\'s own site. Monthly platform bill: $0, down from $50 to $60 a month. One-time fee: $599. No traffic or conversion figures are published.' },
    { label: 'Data source', value: 'Confirmed facts about the engagement, and the live site at workingwithgod.live. Google Analytics 4 and Microsoft Clarity were confirmed sending data on 18 November 2026. No analytics baseline exists from the old platform.' },
    { label: 'Last updated', value: '18 November 2026' },
  ],
  indexResult:
    'Working With God, Dr. Eliyahu Lotzar\'s coaching practice, moved from a shared GoDaddy site to its own site in 2026, and its monthly platform bill went from $50 to $60 a month to $0 for a one-time $599; no traffic or conversion figures are claimed.',
  measurement: {
    tool: 'Google Analytics 4 (page views, scroll depth, and a "Book a call" click event that records the page it came from) and Microsoft Clarity (session recordings and heatmaps). Both went live with the site.',
    dateRanges:
      'Both tools were checked on the live site and confirmed sending data on 18 November 2026. The screens of the new site were captured on 18 November 2026. No dated before and after window exists.',
    counted:
      'Confirmed facts about the engagement: the old cost of $50 to $60 a month in plugins and add-ons, the one-time $599 fee, no monthly platform bill, and the handover of code and content. Everything else can be checked by opening workingwithgod.live.',
    notCounted:
      'Traffic and conversion figures. No analytics baseline carried over from the old platform, so there is no comparison and none is printed. Completed bookings are not tied back to Analytics yet: the site records who clicked "Book a call", not who finished booking.',
  },
  relatedService: { slug: 'websites-funnels', label: 'How the websites and funnels service works' },
  client: 'Working With God, Dr. Eliyahu Lotzar',
  organizationName: 'Working With God',
  clientUrl: 'https://workingwithgod.live',
  clientTagline:
    'Faith-based executive coaching for Christian professionals. Dr. Eliyahu Lotzar, Ed.D., MSW, author of Working With God: The Ten Modes of Elevated Leadership.',
  industry: 'Executive coaching and leadership development',
  icpKey: 'coaches',

  metaTitle: 'Working With God: A GoDaddy Site Replaced',
  metaDescription:
    'Two businesses shared one cluttered GoDaddy site. We split them, rebuilt the coaching practice its own home, and cut the monthly platform bill to zero.',

  eyebrow: 'Case study',
  headline: 'Two businesses were sharing one website.',
  headlineAccent: 'Neither was winning.',
  summary:
    'Dr. Eliyahu Lotzar runs an organizational consulting practice and a faith-based leadership practice. Both lived on the same GoDaddy Airo site, so a Christian executive looking for coaching landed on a page about five-factor organizational health frameworks and revenue targets. We split the two, gave the coaching practice its own site, took the monthly platform bill to nothing, and wired up tracking so the practice can see for the first time which pages people read and where they click to book. The site is live, the client is happy with it, and we still look after it.',

  tldr: [
    'The problem: two businesses on one GoDaddy site. The coaching practice was one bullet in a list of seven services, and the only way in was a blank contact form.',
    'What we did: gave Working With God its own site with its own audience, five ways to start (two free), the credentials under the headline, and a booking page of its own.',
    'What it runs on: a static build with no monthly platform bill, down from $50 to $60 a month. One-time $599. Code and content handed over.',
    'Tracking: Google Analytics 4 and Microsoft Clarity went live with the site. Page views, scroll depth and every "Book a call" click are recorded, where the old site recorded nothing we could use.',
    'After launch: we did not hand over and disappear. If something breaks or needs changing, the client messages us and we fix it.',
  ],

  windowLabel: 'Rebuilt and launched 2026',
  windowStartISO: '2026-01-01',
  windowEndISO: '2026-11-18',
  publishedISO: '2026-09-19',
  updatedISO: '2026-11-18',

  services: [
    'Positioning and brand split',
    'Conversion copywriting',
    'Website design',
    'Website development',
    'Technical SEO and metadata',
    'Analytics and session recording',
    'Launch and handover',
    'Support after launch',
  ],

  heroMetrics: [
    {
      value: '$0',
      label: 'monthly platform bill, down from $50 to $60',
      note: 'One time $599 for the redesign. No retainer.',
    },
    {
      value: '1 of 7',
      label: 'how much of the old site the coaching practice got',
      note: 'One bullet in a service list. Now it has its own site.',
    },
    {
      value: '5 ways in',
      label: 'two of them free, replacing one generic contact form',
      note: 'Webinar, Roundtable, coaching, Masters Class, the book',
    },
    {
      value: '2 tools',
      label: 'tracking the site from day one, where there were none',
      note: 'Google Analytics 4 and Microsoft Clarity, both checked live',
    },
  ],

  atAGlance: [
    { label: 'Client', value: 'Dr. Eliyahu Lotzar, Ed.D., MSW. Reframed Reality and Working With God' },
    { label: 'Industry', value: 'Faith-based executive coaching and leadership development' },
    { label: 'Starting point', value: 'reframedreality.com on GoDaddy Airo, two businesses sharing one site' },
    { label: 'Engagement', value: 'Full site replacement: positioning, copy, design, build, launch, handover' },
    { label: 'What was built', value: 'workingwithgod.live, now live and replacing the old site' },
    { label: 'Stack', value: 'Static build on Netlify, media on Cloudinary, booking on Calendly, events on Meetup' },
    { label: 'Tracking', value: 'Google Analytics 4 (page views, scroll depth, a "Book a call" click event that records which page it came from) and Microsoft Clarity session recordings. Both confirmed sending data on November 18, 2026.' },
    { label: 'After launch', value: 'Ongoing. Fixes and small changes are handled by message, at no monthly fee.' },
    { label: 'Handover', value: 'Code and content both transferred. Editable without a developer, nothing to renew.' },
    { label: 'Cost change', value: '$50 to $60 a month in plugins and add-ons, down to no monthly platform bill. One time $599 for the redesign.' },
    {
      label: 'What is NOT measured',
      value: 'No analytics baseline carried over from the old platform, so there is nothing honest to compare the new numbers against and this page publishes no traffic or conversion figures. The tracking is live and collecting; the comparison does not exist.',
    },
  ],

  comparison: {
    beforeSrc: '/case-studies/wwg-before-home.png',
    beforeAlt:
      'The old Reframed Reality homepage on GoDaddy Airo: a green and white template with a stock bridge photo, a "Got Growth?" headline, a wall of body copy, and a broken right-hand column where an image is followed by a white gap and a stray sliver of a second image.',
    beforeWidth: 850,
    beforeHeight: 1600,
    beforeLabel: 'Before, on GoDaddy',
    afterSrc: '/case-studies/wwg-after-home.jpg',
    afterAlt:
      'The new workingwithgod.live homepage: a deep navy hero with a headline about leaders plateauing for lack of perspective, the line "Coaching for Christian Professionals", one "Book a discovery call" button, and a four-part credential strip directly underneath.',
    afterWidth: 1200,
    afterHeight: 2500,
    afterLabel: 'After, workingwithgod.live',
    liveUrl: 'https://workingwithgod.live',
    caption:
      'Left, the old reframedreality.com homepage on GoDaddy Airo, captured before replacement. Right, workingwithgod.live, captured November 18, 2026. The new site is live, so you can open it and check it against this rather than take the screenshot for it.',
  },

  situation: {
    headline: 'The site was not dated. It was doing two jobs and failing both.',
    body: [
      'Dr. Lotzar has been coaching, counselling, consulting and facilitating for over thirty years. He holds an Ed.D. in Executive Leadership and an MSW, he is certified through Adizes, Arbinger and Wiley DiSC, and he wrote the book the coaching method is built on. None of that was the problem.',
      'The problem was that a visitor could not tell which business they had arrived at, and the site gave them no obvious thing to do next.',
    ],
    failures: [
      {
        title: 'One site, two audiences',
        detail:
          'An operations director hunting for a change-management consultant and a Christian executive looking for faith-based coaching landed on the same navigation. The organizational health page opened on a five-factor framework and revenue targets from $10M to $100M. Working With God was one bullet in a list of seven services.',
      },
      {
        title: 'Old and new stacked on top of each other',
        detail:
          'Rounds of edits had been layered onto the template without anything being taken away. On the homepage the right column carried an image, then a white gap, then a stray sliver of a second image. That is what accumulated edits look like by the time they reach a visitor.',
      },
      {
        title: 'No way in',
        detail:
          'The single conversion path was a contact form headed "Please specify your interest in the message section." A visitor who was genuinely interested had to invent their own reason to write, decide what to ask for, and hope. Most people close the tab instead.',
      },
      {
        title: 'Paying rent on the problem',
        detail:
          '$50 to $60 a month in plugins and add-ons to keep a site builder doing things it was never quite built to do, with the builder badge on every page footer. That is roughly $700 a year spent maintaining the thing that needed replacing.',
      },
    ],
  },

  workstreams: [
    {
      name: 'Split the two businesses',
      summary:
        'The first decision was not a design decision. One site cannot introduce two practices to two different buyers without weakening both, so the coaching practice was given its own domain, its own name and its own audience.',
      points: [
        'workingwithgod.live now speaks to exactly one person: a Christian professional weighing a real decision at work. Nothing on it has to hedge toward a second audience.',
        'The homepage states the audience in the first line under the headline, "Coaching for Christian Professionals", so nobody has to read three sections to find out whether they are in the right place.',
        'The organizational consulting work keeps its own identity rather than being diluted by faith-based positioning it was never asking for.',
      ],
    },
    {
      name: 'Build an offer ladder instead of a contact form',
      serviceSlug: 'websites-funnels',
      summary:
        'A single contact form asks the visitor to commit before they have any reason to. The new site gives five ways to begin, ordered by how much they cost the visitor, and two of them are free.',
      points: [
        'A free 60-minute introductory webinar on the method, run through Meetup.',
        'A free in-person Roundtable on the third Wednesday of the month in Northern Virginia.',
        'Executive coaching, the two-day Masters Class immersion, and the book, for people ready to go further.',
        'Every one of them has its own destination and its own button. The reader picks their own depth rather than being funnelled into the one ask the site knows how to make.',
      ],
    },
    {
      name: 'Put the credentials where the doubt is',
      serviceSlug: 'websites-funnels',
      summary:
        'Thirty years of practice, a doctorate, a clinical qualification and three certifications were spread across a long About page nobody scrolled. They now sit directly under the headline.',
      points: [
        'A four-part credential strip immediately below the hero: Author, Ed.D. in Executive Leadership, MSW Therapist, certified by Adizes, Arbinger and DiSC.',
        'A named client quote from Sylvia Palmer, Chief Impact Officer at Amplify, placed early rather than on a separate testimonials page.',
        'A six-question FAQ that answers the objections people actually raise, including whether this is about being more religious at work, which is the question that stops the most people.',
      ],
    },
    {
      name: 'Design and build',
      serviceSlug: 'websites-funnels',
      summary:
        'A static build on Netlify, with media on Cloudinary. No plugin stack, no monthly platform bill, nothing to keep patched.',
      points: [
        'Booking runs through Calendly and events through Meetup, so the tools the practice already used stayed in place rather than being replaced for the sake of it.',
        'Full metadata: canonical URL, Open Graph and Twitter cards with a real preview image, and robots directives set to allow large image previews and full-length snippets.',
        'A skip-to-content link and a honeypot field on the newsletter signup, which are the two small things almost every small-business build skips.',
        'Separate pages for the book, services, events, speaking, the Roundtable and about, so each has a URL that can be linked and found on its own.',
      ],
    },
    {
      name: 'Tracking that actually reports',
      stat: { value: '3 signals', label: 'page views, scroll depth, booking clicks' },
      media: [
        {
          src: '/case-studies/wwg-after-book-a-call.jpg',
          alt: 'The new Book a call page on workingwithgod.live, with its own headline and the booking calendar on the page.',
          width: 1200,
          height: 1625,
          caption: 'The booking page. Every button that leads here sends an event naming the page it was clicked on.',
        },
      ],
      summary:
        'The old site gave the practice nothing to learn from. The new one went live with Google Analytics 4 and Microsoft Clarity already running, so from the first visitor there has been a record of what people read and what they click.',
      points: [
        'Google Analytics 4 records a page view on every page, including when a visitor moves between pages without a full reload, which is the part that quietly breaks on most modern builds.',
        'Scroll depth is recorded, so it is possible to see whether people reach the offers further down a page or leave before them.',
        'Every "Book a call" button sends its own event with the page it was clicked on. That answers the question the old site never could: which page makes people want to talk.',
        'Microsoft Clarity records sessions and heatmaps, so when a page underperforms the answer comes from watching what visitors did rather than guessing.',
        'We checked this on the live site on November 18, 2026, not from memory: page view and scroll events reached Google Analytics and Clarity was collecting. It has been reporting cleanly since launch.',
      ],
    },
    {
      name: 'Still here after launch',
      stat: { value: '$0 a month', label: 'for fixes and small changes' },
      summary:
        'Most small-business sites are built, invoiced and abandoned. This one was handed over in full and is still looked after, because a site that nobody answers for goes stale within a year.',
      points: [
        'If something breaks, looks wrong on a device, or stops working after a third-party change, the client messages us and we fix it. There is no ticket queue and no hourly meter running.',
        'Small changes to copy, dates, events and images are done on request, on top of the client being able to make them himself.',
        'Because the build is static, there is no plugin stack to keep patched and nothing that silently expires, which is most of what goes wrong with a site after launch.',
        'Dr. Lotzar has told us he is happy with the site. We are saying that in our own words because we have not asked him for a quote to print, and we would rather under-claim than put words in a client\'s mouth.',
      ],
    },
    {
      name: 'Hand it over completely',
      summary:
        'The point of leaving a site builder is not paying less. It is owning the thing. Everything transferred on launch.',
      points: [
        'Code and content both handed over. No vendor lock-in, nothing that stops working if we stop answering the phone.',
        'Set up so the owner, who is not a developer, can change copy and content himself without opening a support ticket or paying for a plugin.',
        'The $599 was a one-time fee for the redesign. There is no retainer attached to this engagement and no monthly platform bill replacing the old one.',
      ],
    },
  ],

  proof: [],

  pairs: {
    heading: 'The same four jobs, before and after.',
    intro:
      'Each row is one job a visitor comes to the site to do. Left is the page that did it on reframedreality.com. Right is the page that does it now, captured from the live site on November 18, 2026. Every right-hand page is linked, so you can open it and check.',
    items: [
      {
        label: 'Homepage',
        note: 'From a "Got Growth?" template speaking to two audiences, to one line that says who it is for, one button, and the credentials directly under the headline.',
        before: { src: '/case-studies/wwg-before-home.png', alt: 'Old homepage on GoDaddy Airo: green and white template, stock bridge photo, a wall of body copy and a broken right-hand column.', width: 850, height: 1600 },
        after: { src: '/case-studies/wwg-after-home.jpg', alt: 'New homepage: navy hero, the headline about perspective, "Coaching for Christian Professionals", one booking button, credential strip, a client quote and a welcome video.', width: 1200, height: 2500 },
        afterUrl: 'https://workingwithgod.live',
      },
      {
        label: 'About',
        note: 'From unbroken bullet lists of certifications most visitors never scrolled through, to a page that tells the thirty-year story in order and keeps the credentials readable.',
        before: { src: '/case-studies/wwg-before-about.png', alt: 'Old About page: one very long column of certifications, publications and organizations as unbroken bullet lists.', width: 427, height: 1600 },
        after: { src: '/case-studies/wwg-after-about.jpg', alt: 'New About page for Dr. Eliyahu Lotzar, with a portrait, a short narrative and the credentials broken into sections.', width: 1200, height: 2500 },
        afterUrl: 'https://workingwithgod.live/about',
      },
      {
        label: 'Services',
        note: 'From two columns of centred body copy with no next step, to a page of named ways to engage, each with its own button and its own depth of commitment.',
        before: { src: '/case-studies/wwg-before-individual.png', alt: 'Old Individual-Level Services page: two columns of centred body text and no call to action.', width: 1132, height: 1600 },
        after: { src: '/case-studies/wwg-after-services.jpg', alt: 'New Ways to Engage page: coaching, the Masters Class and speaking laid out as separate offers with their own buttons.', width: 1200, height: 2500 },
        afterUrl: 'https://workingwithgod.live/services',
      },
      {
        label: 'Getting in touch',
        note: 'From a bare form telling the visitor to "specify your interest in the message section", to a booking page that says what the call is for and puts the calendar on the page.',
        before: { src: '/case-studies/wwg-before-contact.png', alt: 'Old Contact Us page: an empty form with the instruction to specify your interest in the message section.', width: 1600, height: 1480 },
        after: { src: '/case-studies/wwg-after-book-a-call.jpg', alt: 'New Book a call page: a headline about the decision you are stuck on, above an embedded booking calendar.', width: 1200, height: 1625 },
        afterUrl: 'https://workingwithgod.live/book-a-call',
      },
    ],
  },

  gallery: {
    heading: 'Pages that did not exist before.',
    intro:
      'The old site had no page for the book, none for the Roundtable and no direct contact page for the coaching practice. These are new, captured from workingwithgod.live on November 18, 2026.',
    items: [
      {
        src: '/case-studies/wwg-after-the-book.jpg',
        alt: 'The Book page on workingwithgod.live, for Working With God: The Ten Modes of Elevated Leadership.',
        width: 1200,
        height: 2500,
        caption: 'The Book. The method the coaching is built on finally has a page of its own that can be linked and found.',
      },
      {
        src: '/case-studies/wwg-after-roundtable.jpg',
        alt: 'The Roundtable registration page on workingwithgod.live.',
        width: 1200,
        height: 2500,
        caption: 'The Roundtable. A free, in-person way to start, with its own registration page instead of a line in a list.',
      },
      {
        src: '/case-studies/wwg-after-contact.jpg',
        alt: 'The Contact page on workingwithgod.live.',
        width: 1200,
        height: 1683,
        caption: 'Contact. For the people who want to write rather than book, without having to invent the reason.',
      },
    ],
  },

  midCtaText:
    'If your site is doing two jobs badly, or you are paying a builder every month for something you have outgrown, that is the conversation. We will tell you on the call if a rebuild is not what you actually need, and if we do build it, we stay around after it launches.',
  openProblemsAccent: 'including what this page cannot prove.',

  openProblems: [
    {
      title: 'There is no before and after in the numbers, and there will not be',
      detail:
        'No analytics baseline came across from the old platform, so there is no honest traffic or conversion comparison to publish and this page does not attempt one. The new site has been tracked since launch, but numbers with nothing to compare them to prove very little, so they are not printed here. Everything above is either a confirmed fact about the engagement or something you can check by opening the site.',
      status: 'Structural',
    },
    {
      title: 'The booking link still carries the old company name',
      detail:
        'The booking calendar now sits on the site\'s own Book a call page, which is an improvement, but the Calendly account behind it is still named after reframedreality. A visitor who has just been reading about Working With God can still see the other practice\'s name at the moment of booking. It is a small inconsistency in exactly the place where hesitation is highest.',
      status: 'Next up',
    },
    {
      title: 'Booking clicks are tracked. Completed bookings are not tied back yet',
      detail:
        'The site now records every "Book a call" click and the page it came from, which was the missing half when this page was first published. The booking itself still completes inside Calendly, so the site knows who clicked but not who finished. Passing the completed booking back to Analytics is the next piece, and worth doing before any money goes into promoting the site.',
      status: 'Half done',
    },
    {
      title: 'Redirects from the retired domain need confirming',
      detail:
        'The old site is being replaced, and its pages should 301 to their closest match on the new one so that years of accumulated links and any existing rankings are not dropped. This needs verifying against the live configuration rather than assumed.',
      status: 'To verify',
    },
    {
      title: 'Two named quotes on the whole site',
      detail:
        'The new site carries two named client quotes, up from one at launch. A coaching practice is bought on social proof more than almost any other kind of business, and collecting three or four more is still the single biggest available lift. That one is on the client, and we have said so.',
      status: 'With the client',
    },
  ],

  notApplicable: [
    {
      title: 'Your site is fine and what you need is demand',
      detail:
        'A rebuild does not create an audience. If traffic is already arriving and simply not converting, that is a copy and offer problem and it is cheaper to fix. If nothing is arriving at all, a new site will change nothing on its own.',
    },
    {
      title: 'You genuinely serve two audiences equally',
      detail:
        'Splitting a brand in two costs a second domain, a second content plan and twice the upkeep. It was right here because one practice was clearly being smothered by the other. Where two lines of business are both healthy and share buyers, keeping them together is usually correct.',
    },
    {
      title: 'You need to restructure pages every week',
      detail:
        'The handover covers copy and content, which the owner edits himself. Changing layout and adding new page types still means a developer. If your team genuinely rebuilds page structure constantly, a page builder earns its monthly fee and you should keep it.',
    },
    {
      title: 'You want the numbers before you commit',
      detail:
        'Fair, and this page cannot give them to you. If proof by measurement is what you need before hiring anyone, read the MagicBNB case study instead. It carries a real Search Console export, and it is on this site for exactly that reason.',
    },
  ],
};

export const caseStudies: CaseStudy[] = [magicbnb, workingWithGod, founderStory];

const SITE_ORIGIN = 'https://echopulse.media';
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** '2026-08-20' becomes '20 August 2026'. Pure string work, no time zones. */
export function formatISODate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

export const CASE_STUDY_AUTHOR = {
  name: 'Lakshya Soni',
  url: `${SITE_ORIGIN}/about/lakshya-soni`,
  path: '/about/lakshya-soni',
};
export const CASE_STUDY_PUBLISHER = 'EchoPulse Media';

export function canonicalFor(study: CaseStudy): string {
  return `${SITE_ORIGIN}/case-studies/${study.slug}`;
}

/**
 * The one-line citation printed in the "Cite this case study" block. Built
 * here so the page text and anything else that quotes it cannot drift apart.
 */
export function citationFor(study: CaseStudy): string {
  const published = formatISODate(study.publishedISO);
  const dates =
    study.updatedISO && study.updatedISO !== study.publishedISO
      ? `Published ${published}, updated ${formatISODate(study.updatedISO)}.`
      : `Published ${published}.`;
  return `${CASE_STUDY_AUTHOR.name}. "${study.metaTitle}." ${CASE_STUDY_PUBLISHER}. ${dates} ${canonicalFor(study)}`;
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

/**
 * The one image that represents a study, for OG cards, the sitemap and the
 * Article JSON-LD.
 *
 * A measured engagement leads with its export screenshot. A rebuild has no
 * export, so it leads with the "before" screen, which is the image carrying
 * the argument anyway. Falling back to the generic site OG card instead would
 * put an EchoPulse logo on a link about someone else's business.
 */
export function heroImageFor(study: CaseStudy): { src: string; caption: string } | null {
  if (study.proof[0]) return { src: study.proof[0].src, caption: study.proof[0].caption };
  if (study.comparison) return { src: study.comparison.beforeSrc, caption: study.comparison.caption };
  if (study.heroMedia) return { src: study.heroMedia.src, caption: study.heroMedia.caption ?? study.heroMedia.alt };
  return null;
}
