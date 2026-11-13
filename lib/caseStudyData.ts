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

export type CaseStudyWorkstream = {
  name: string;
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

export type CaseStudy = {
  slug: string;
  /** Client name as they write it themselves. */
  client: string;
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
  client: 'MagicBNB',
  clientUrl: 'https://magicbnb.io',
  clientTagline: 'Portfolio analytics for short-term rental operators. Connects the property management system to the bank and reconciles the two every night.',
  industry: 'B2B SaaS, short-term rental analytics',
  icpKey: 'founders',

  // Title stays short because the root layout appends the brand suffix for the
  // document title. Description is held to the 140 to 160 band the rest of the
  // site uses, since it is the second half of the click decision.
  metaTitle: 'MagicBNB Case Study: 5.8 to 4,859 Impressions a Day',
  metaDescription:
    'How EchoPulse runs MagicBNB marketing end to end: site, 219 articles, AI search, Instagram, ads. 5.8 to 4,859 daily Google impressions. Real export.',

  eyebrow: 'Case study',
  headline: '5.8 impressions a day to 4,859',
  headlineAccent: 'in seven months.',
  summary:
    'In April 2026 magicbnb.io was shown in Google search results an average of 5.8 times a day. In the first 11 days of November 2026 the average was 4,859, and the best single day hit 5,522. Same company, same product, same market. EchoPulse runs the whole marketing function: the site, the content plan, 219 articles, answer-engine work, the founder brand on Instagram and LinkedIn, the ad creative and the measurement. Here is every part of that system, the real Search Console export, and the parts that are still broken.',

  windowLabel: '19 February to 11 November 2026',
  windowStartISO: '2026-02-19',
  windowEndISO: '2026-11-11',
  publishedISO: '2026-08-20',
  updatedISO: '2026-11-13',

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
    { value: '5.8 to 4,859', label: 'daily impressions, April against November', note: 'Daily averages, November is 1 to 11' },
    { value: '356,765', label: 'total impressions across the window', note: '266 days, 1,568 clicks' },
    { value: '219', label: 'articles live in the architecture', note: '199 by August, counted from the sitemap on 13 November' },
    { value: '+248%', label: 'sessions, last 90 days against the prior 90', note: '6,435 against 1,848' },
  ],

  atAGlance: [
    { label: 'Client', value: 'MagicBNB (magicbnb.io)' },
    { label: 'Industry', value: 'B2B SaaS, short-term rental portfolio analytics' },
    { label: 'Starting point', value: '5.8 Google impressions a day, declining' },
    { label: 'Engagement', value: 'Full marketing: site, content planning, SEO and AEO content, Instagram and LinkedIn founder brand, ad creative, analytics' },
    { label: 'Date window', value: '19 February to 11 November 2026' },
    { label: 'Change shipped', value: '5 May 2026, rebuilt site live' },
    { label: 'Measured result', value: '356,765 impressions and 1,568 clicks; November averaging 4,859 impressions a day' },
    { label: 'How measured', value: 'Google Search Console and GA4 for magicbnb.io, plus Instagram and Meta Ads data. First export 18 August 2026, refreshed 13 November 2026' },
    { label: 'Last updated', value: '13 November 2026' },
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
      1026, 1131, 851, 1063, 1479, 1380, 1651, 1619, 1479, 1080, 1280, 1594, 1704, 1451, 1349, 1402, 1808, 1827, 2200, 2398,
      2784, 2139, 1705, 1689, 1635, 1555, 1509, 1675, 1606, 1501, 1510, 1380, 1597, 1823, 2085, 2599, 2485, 2311, 2414, 2621,
      2852, 2792, 3080, 3491, 2610, 2737, 2662, 3007, 3160, 3275, 2740, 2219, 2127, 2000, 2189, 2466, 2321, 2470, 2205, 2028,
      1906, 2233, 2025, 2018, 2037, 1895, 1693, 1937, 2224, 2683, 2391, 2412, 2174, 2139, 2356, 2518, 2157, 2119, 2380, 2075,
      1814, 2092, 2298, 2311, 2498, 3252, 2957, 2595, 2939, 3755, 3363, 5126, 5286, 5140, 4079, 4370, 4973, 5259, 5522, 4366,
      4954, 4080, 4596, 5086, 4932, 5309,
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
      'MagicBNB daily Google search impressions, February to November 2026. Flat near zero until the 5 May relaunch, climbing to about 2,400 a day by August and above 5,000 a day by November.',
    caption:
      'Daily impressions, Google Search Console property for magicbnb.io, 19 February to 11 November 2026, 266 days. The dashed line is 5 May, the day the rebuilt site went live. On 4 May the site earned 13 impressions. On 5 May it earned 209. The best day so far is 4 November at 5,522.',
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
      serviceSlug: 'blog-production',
      summary:
        'Nothing is written because it is Tuesday. Every article comes out of one of four inputs, and the plan is rebuilt from the data every week.',
      points: [
        'Input one, the Search Console export. Queries sitting between positions 8 and 20 are the cheapest wins on the site, so they are read every week and the pages behind them get the next round of edits. Site-wide average position moved from 11.7 to 9.5 across the last 90 days.',
        'Input two, platform news. When Airbnb changes a policy, hosts search for it the same day. The plan keeps room for that: the November 2026 house rules change, the holiday pricing window and the 1099 threshold for cleaners each had an article live while the question was still being asked.',
        'Input three, the buyer next to the buyer. Hosts are not the only people who open the product. Articles for real estate agents sizing up short-term rental potential and for accountants handling rental clients at year end bring in the people who recommend software to hosts.',
        'Input four, what the data says that nobody planned. Singapore surfaced as the second largest source of sessions, ahead of Canada. We read it in the analytics, shipped a dedicated market report, and it has stayed second: 1,613 sessions in the last 90 days against 2,676 from the United States.',
        'Each planned piece is assigned a layer, a target query, the pages it must link to and the pages that must link back, before a word is written. That is what stops article 219 from competing with article 40.',
      ],
    },
    {
      name: 'Content architecture, shipped before the content',
      serviceSlug: 'blog-production',
      summary:
        'The sequencing is the part most teams get wrong. Publishing 199 articles onto a site that cannot cluster, link or surface them produces 199 orphan pages.',
      points: [
        'Blog architecture built to carry hundreds of posts, with category routing, cross-linking slots and related-post surfaces, built and shipped before the first article landed.',
        'Every article sits in one of three layers. Competitive displacement: head-to-head comparisons where the buyer is already shopping. Operator economics: the maths hosts search at 11pm, which builds the topical authority that makes layer one rankable. Market and regulation reports: city-level and regulatory coverage, which is what earns links.',
        'The reason the impression curve goes near vertical from the day of the relaunch, rather than creeping up over a year, is that the first wave of writing landed into a structure already built to hold it.',
        '199 articles were live by 17 August. The sitemap listed 219 on 13 November. The pace dropped on purpose after August: the work moved from adding pages to improving the ones already ranking.',
        'Nine of the top ten pages by impressions are editorial. The brand page stopped being the only door into the business.',
      ],
    },
    {
      name: 'Choosing what to rank for',
      serviceSlug: 'blog-production',
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
      serviceSlug: 'blog-production',
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
    { month: 'August 2026', impressions: '50,872', perDay: '1,641.0', note: 'First version of this page published on the 20th' },
    { month: 'September 2026', impressions: '75,128', perDay: '2,504.3', note: 'Pricing and alternatives pages take over' },
    { month: 'October 2026', impressions: '84,695', perDay: '2,732.1', note: 'A step up in the last week, past 5,000 a day' },
    { month: 'November 2026, to the 11th', impressions: '53,447', perDay: '4,858.8', note: 'Highest daily average so far' },
  ],

  funnel: {
    intro:
      'Impressions on their own are a vanity number. Here is the last 90 days against the 90 before, 12 August to 9 November 2026, from the same Search Console and GA4 properties.',
    beforeLabel: 'Prior 90 days',
    afterLabel: 'Last 90 days',
    rows: [
      { label: 'Sessions', before: '1,848', after: '6,435', change: '+248%', direction: 'up' },
      { label: 'Users', before: '1,699', after: '5,987', change: '+252%', direction: 'up' },
      { label: 'Organic search clicks', before: '380', after: '1,077', change: '+183%', direction: 'up' },
      { label: 'Impressions', before: '104,049', after: '228,602', change: '+120%', direction: 'up' },
      { label: 'Average position', before: '11.7', after: '9.5', change: '2.2 better', direction: 'up' },
      { label: 'Conversions recorded', before: '0', after: '18', change: 'now tracked', direction: 'up' },
    ],
    readingLabel: 'Reading it honestly.',
    reading:
      'Every row moved the right way this time, which was not true in August, when impressions and average position both slipped while the new pages matured. Two cautions still apply. Clicks grew more slowly than impressions, so the click-through problem below is still the biggest one on the site. And 18 conversions is a start, not a result: it proves the tracking works, not that the funnel does.',
  },

  midCtaText:
    'Want to know whether this would work for your site? The audit call opens by looking at your Search Console the same way we looked at this one.',
  openProblemsAccent: 'taken from the same export.',

  proof: [
    {
      src: '/case-studies/magicbnb-gsc-proof.png',
      alt: 'Google Search Console performance report for magicbnb.io showing total impressions climbing from near zero in February 2026 to a peak above 2,000 a day in August 2026.',
      width: 1893,
      height: 895,
      caption:
        'Google Search Console, property magicbnb.io, performance report for 19 February to 17 August 2026. Exported 18 August 2026, the first export behind this page. Published with the client written consent.',
    },
  ],

  openProblems: [
    {
      title: 'Click-through rate is still under half a percent',
      detail:
        'From 18 August to 11 November, 237,378 impressions produced 1,091 clicks, a rate of 0.46 percent, barely up from 0.4. Titles and descriptions are not earning the click the ranking already won. At current volume, moving the rate to a still-modest 2 percent is roughly 2,000 extra clicks a month without publishing a single new page. This was the highest value work available in August and it still is.',
      status: 'In progress',
    },
    {
      title: 'Conversions are tracked, and the number is small',
      detail:
        '18 recorded conversions in 90 days from 6,435 sessions. The tracking gap from August is closed. The gap between traffic and trials is not, and that is now the main job of the landing page tests.',
      status: 'In progress',
    },
    {
      title: 'A broken inbound link is still sending visitors to a 404',
      detail:
        'This was on the August list as being fixed. It was not finished: the error page took 54 visits in the last 90 days. It is printed here again rather than quietly dropped.',
      status: 'Overdue',
    },
    {
      title: 'One article is not indexed',
      detail: 'Down from three in August. Resubmitted and being monitored.',
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
    name: 'MagicBNB Google Search Console daily impressions, February to November 2026',
    description:
      'Daily Google Search impression counts for the magicbnb.io Search Console property, 19 February to 11 November 2026 inclusive, 266 daily observations totalling 356,765 impressions. First exported 18 August 2026, refreshed 13 November 2026, and published with the site owner consent.',
    measurementTechnique: 'Google Search Console performance report export',
    variableMeasured: ['Search impressions', 'Search clicks', 'Average position', 'Click-through rate'],
  },
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
  client: 'Working With God, Dr. Eliyahu Lotzar',
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
    'Dr. Eliyahu Lotzar runs an organizational consulting practice and a faith-based leadership practice. Both lived on the same GoDaddy Airo site, so a Christian executive looking for coaching landed on a page about five-factor organizational health frameworks and revenue targets. We split the two, gave the coaching practice its own site, and took the monthly platform bill to nothing.',

  windowLabel: 'Rebuilt and launched 2026',
  windowStartISO: '2026-01-01',
  windowEndISO: '2026-09-19',
  publishedISO: '2026-09-19',

  services: [
    'Positioning and brand split',
    'Conversion copywriting',
    'Website design',
    'Website development',
    'Technical SEO and metadata',
    'Launch and handover',
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
      value: 'Full handover',
      label: 'code and content, editable without a developer',
      note: 'No vendor lock-in and nothing to renew',
    },
  ],

  atAGlance: [
    { label: 'Client', value: 'Dr. Eliyahu Lotzar, Ed.D., MSW. Reframed Reality and Working With God' },
    { label: 'Industry', value: 'Faith-based executive coaching and leadership development' },
    { label: 'Starting point', value: 'reframedreality.com on GoDaddy Airo, two businesses sharing one site' },
    { label: 'Engagement', value: 'Full site replacement: positioning, copy, design, build, launch, handover' },
    { label: 'What was built', value: 'workingwithgod.live, now live and replacing the old site' },
    { label: 'Stack', value: 'Static build on Netlify, media on Cloudinary, booking on Calendly, events on Meetup' },
    { label: 'Cost change', value: '$50 to $60 a month in plugins and add-ons, down to no monthly platform bill. One time $599 for the redesign.' },
    {
      label: 'What is NOT measured',
      value: 'No analytics baseline carried over from the old platform, so this page makes no traffic or conversion claims. Measurement starts at launch.',
    },
  ],

  comparison: {
    beforeSrc: '/case-studies/wwg-before-home.png',
    beforeAlt:
      'The old Reframed Reality homepage on GoDaddy Airo: a green and white template with a stock bridge photo, a "Got Growth?" headline, a wall of body copy, and a broken right-hand column where an image is followed by a white gap and a stray sliver of a second image.',
    beforeWidth: 850,
    beforeHeight: 1600,
    beforeLabel: 'Before, on GoDaddy',
    // afterSrc is intentionally absent until a full-page capture of the new
    // homepage is saved to /public/case-studies/wwg-after-home.png. Until then
    // BeforeAfter renders the old screen on its own beside the live link, which
    // is stronger evidence than a screenshot anyway.
    afterLabel: 'After, workingwithgod.live',
    liveUrl: 'https://workingwithgod.live',
    caption:
      'Left, the old reframedreality.com homepage on GoDaddy Airo, captured before replacement. Right, workingwithgod.live as it stands today. The new site is live, so you can open it and check it against this rather than take the screenshot for it.',
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

  gallery: {
    heading: 'What the old site asked a visitor to work through.',
    intro:
      'Captured from reframedreality.com before it was replaced. These are the pages a Christian executive looking for coaching had to navigate to find out whether the practice was for them.',
    items: [
      {
        src: '/case-studies/wwg-before-org.png',
        alt: 'The old Organization-Level Services page: four dense paragraphs of body copy under small-caps headings, with no calls to action.',
        width: 1067,
        height: 1600,
        caption: 'Organization-Level Services. Four paragraphs, no call to action, framework names and revenue targets in the opening lines.',
      },
      {
        src: '/case-studies/wwg-before-wwg.png',
        alt: 'The old Working With God page, one section within the wider consulting site.',
        width: 604,
        height: 1600,
        caption: 'Working With God, as one page inside a consulting site rather than a practice with its own home.',
      },
      {
        src: '/case-studies/wwg-before-about.png',
        alt: 'The old About page: a very long single column of certifications, publications and organizations served, as unbroken bullet lists.',
        width: 427,
        height: 1600,
        caption: 'About. Thirty years of credentials, real and impressive, delivered as bullet lists most visitors never reached.',
      },
      {
        src: '/case-studies/wwg-before-individual.png',
        alt: 'The old Individual-Level Services page, with two columns of centred body copy.',
        width: 1132,
        height: 1600,
        caption: 'Individual-Level Services. Two columns of centred text, which is the hardest layout to read at length.',
      },
      {
        src: '/case-studies/wwg-before-team.png',
        alt: 'The old Team-Level Services page: eight stacked sections of dense copy.',
        width: 588,
        height: 1600,
        caption: 'Team-Level Services. Eight stacked sections, each one a wall, competing for the same visitor.',
      },
      {
        src: '/case-studies/wwg-before-contact.png',
        alt: 'The old Contact Us page: a bare form with the instruction to specify your interest in the message section.',
        width: 1600,
        height: 1480,
        caption: 'Contact Us. "Please specify your interest in the message section." The visitor had to supply the offer themselves.',
      },
    ],
  },

  midCtaText:
    'If your site is doing two jobs badly, or you are paying a builder every month for something you have outgrown, that is the conversation. We will tell you on the call if a rebuild is not what you actually need.',
  openProblemsAccent: 'including what this page cannot prove.',

  openProblems: [
    {
      title: 'There is no before and after in the numbers, and there will not be',
      detail:
        'No analytics baseline came across from the old platform, so there is no honest traffic or conversion comparison to publish and this page does not attempt one. Everything above is either a confirmed fact about the engagement or something you can check by opening the site. Measurement starts from launch.',
      status: 'Structural',
    },
    {
      title: 'The booking link still carries the old company name',
      detail:
        'Every "Book a call" on the new site hands off to a Calendly URL ending reframedreality, so a visitor who has just been reading about Working With God lands on a page branded with the other practice. It is a small inconsistency in exactly the place where hesitation is highest.',
      status: 'Next up',
    },
    {
      title: 'The booking handoff is not instrumented',
      detail:
        'Bookings complete on Calendly, off the site, so as it stands the site cannot tell which page produced a call. Until that is wired, any judgement about which section is working is guesswork. Worth fixing before a penny goes into promoting the site.',
      status: 'Next up',
    },
    {
      title: 'Redirects from the retired domain need confirming',
      detail:
        'The old site is being replaced, and its pages should 301 to their closest match on the new one so that years of accumulated links and any existing rankings are not dropped. This needs verifying against the live configuration rather than assumed.',
      status: 'To verify',
    },
    {
      title: 'One testimonial on the whole site',
      detail:
        'The new site carries a single named quote. A coaching practice is bought on social proof more than almost any other kind of business, and collecting three or four more is the single biggest available lift. That one is on the client, and we have said so.',
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

export const caseStudies: CaseStudy[] = [magicbnb, workingWithGod];

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
  return null;
}
