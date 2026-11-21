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
  /** True when the monthly impressions chart already draws this series. */
  replacedByMonthly?: boolean;
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
  /** Short when-or-where label for the timeline marker. Facts only. */
  when?: string;
  /** Icon key for the timeline marker. See components/casestudy/WorkTimeline. */
  icon?: string;
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

/** A real capture of a live page, shown in a browser or phone frame. */
export type CaseStudyShot = CaseStudyMedia & { url: string };

export type CaseStudyComparison = {
  /** Matching 16:10 crops of the two homepages for the drag slider. */
  slider?: { before: CaseStudyMedia; after: CaseStudyMedia };
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
  /** Extra rows after the four fixed ones, e.g. the basis of a stated estimate. */
  extra?: { label: string; value: string }[];
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

/**
 * SOFTWARE BUILDS
 *
 * A product engagement has no traffic curve and no before and after page. Its
 * evidence is the product itself: the screens, what each one does, and where
 * the client operates. These types carry that, and the page renders the
 * product sections only when `product` is set, so the other studies are
 * untouched.
 */

/** One product screen in the tour, with two to four short benefit lines. */
export type CaseStudyScreen = CaseStudyMedia & { title: string; points: string[] };

/** One outlet, as the client publishes it, plotted on the static map. */
export type CaseStudyOutlet = {
  name: string;
  address: string;
  hours: string;
  /** The client's own Google Maps link for the outlet. */
  mapsUrl: string;
  /** Pin position on the map image, in percent of its width and height. */
  x: number;
  y: number;
  /** True when the pin is placed by area rather than by listed coordinates. */
  approximate?: boolean;
  /** Which side of the pin the label sits on, so close pins do not collide. */
  labelSide?: 'left' | 'right';
};

/**
 * Verified enquiry figures for the client's website. Stays null until the
 * owner sends dated evidence; the page renders nothing for it until then.
 */
export type CaseStudyEnquiryProof = {
  figure: string;
  period: string;
  source: string;
  screenshot?: CaseStudyProof;
};

export type CaseStudyProduct = {
  /** Phone capture that overlaps the hero browser frame. */
  heroPhone: CaseStudyMedia;
  /** "The client and the challenge", as three short cards. */
  challenge: { title: string; body: string }[];
  outlets: {
    heading: string;
    intro: string;
    map: CaseStudyMedia;
    attribution: { label: string; href: string };
    items: CaseStudyOutlet[];
    /** A non-outlet landmark for orientation, drawn muted. */
    reference?: { name: string; x: number; y: number };
    note: string;
  };
  system: {
    intro: string;
    columns: { name: string; panel: 'store' | 'hq'; items: string[] }[];
    assistant: { name: string; body: string };
  };
  tour: {
    intro: string;
    groups: { name: string; summary: string; screens: CaseStudyScreen[] }[];
  };
  assistant: {
    name: string;
    claim: string;
    intro: string;
    queries: { q: string; what: string; shot: CaseStudyMedia }[];
    more: (CaseStudyMedia & { title: string })[];
    capabilities: { title: string; detail: string }[];
    counter: CaseStudyScreen;
    noBill: { title: string; body: string[] };
  };
  hq: { intro: string; screens: CaseStudyScreen[] };
  phone: { intro: string; points: { title: string; detail: string }[]; shots: CaseStudyMedia[] };
  website: {
    url: string;
    heading: string;
    intro: string;
    hero: CaseStudyShot;
    phone: CaseStudyShot;
    more: CaseStudyShot[];
    built: { title: string; detail: string }[];
    /** Printed under the list: what this section does and does not claim. */
    note: string;
  };
  /** Verified enquiry figures. null renders nothing. */
  enquiryProof: CaseStudyEnquiryProof | null;
  stack: { group: string; items: { name: string; detail: string }[] }[];
  approach: { heading: string; intro: string };
  benefits: { title: string; detail: string }[];
  /** Optional lead under the benefits heading. */
  benefitsLead?: string;
  /** The marketing EchoPulse runs for the client. Optional, additive. */
  marketing?: CaseStudyMarketing;
  /** How the software was built, step by step. Optional, additive. */
  build?: CaseStudyBuild;
  /** "Could this work for your business?" Optional, additive. */
  buyerFit?: {
    heading: string;
    intro: string;
    businesses: { title: string; detail: string }[];
    signs: string[];
  };
  /** "What working with EchoPulse is like." Optional, additive. */
  working?: {
    heading: string;
    intro: string;
    steps: { title: string; detail: string }[];
    risks: { title: string; detail: string }[];
    /** Where the promises in `steps` are written down. */
    source: { label: string; href: string };
  };
  /** A short FAQ, rendered open (no accordion). */
  faq?: { q: string; a: string }[];
  /**
   * "About the client": public facts, each tied to the sources listed under
   * it by id. Optional, additive. Only facts readable on a public page.
   */
  about?: CaseStudyAbout;
  /** The headline result with its basis, plus short qualitative lines. */
  result?: { figure: string; label: string; basis: string; lines: string[] };
  /** "What we are building next": plans, clearly framed as plans. */
  next?: { heading: string; intro: string; areas: { title: string; detail: string }[]; note: string };
};

export type CaseStudySource = { id: string; label: string; href: string; read: string };

export type CaseStudyAbout = {
  heading: string;
  intro: string;
  facts: { label: string; value: string; sources: string[] }[];
  /** The client's own business line, shown only when it is clearly that. */
  contact?: { label: string; href: string }[];
  sources: CaseStudySource[];
  note?: string;
};

/** A public social post, shown as a captured still in a phone frame. */
export type CaseStudyCreative = CaseStudyMedia & {
  /** Public URL of the post. */
  href: string;
  /** 'reel' gets a play badge; 'post' is a still image. */
  kind: 'reel' | 'post';
  platform: string;
  title: string;
  /** One or two plain sentences: format, subject, style. */
  detail: string;
  /** The opening line of the caption, as posted. */
  hook?: string;
  hookLang?: string;
  posted: string;
};

export type CaseStudyMarketing = {
  heading: string;
  intro: string;
  pipeline: { title: string; detail: string }[];
  creatives: CaseStudyCreative[];
  creativesNote: string;
  profiles: { label: string; href: string }[];
  cards: { title: string; detail: string }[];
  loop: { intro: string; items: { title: string; detail: string }[] };
};

export type CaseStudyBuild = {
  heading: string;
  intro: string;
  steps: { title: string; detail: string; points: string[] }[];
  gets: { title: string; detail: string }[];
};

/**
 * A customer-facing mobile app study (the Whites & Brights Android app).
 * Rendered by AppStory when `study.app` is set, in place of the generic
 * situation and work sections. Every line carries the ids of the sources it
 * comes from, listed with read dates in `sources`.
 */
export type CaseStudyAppScreen = CaseStudyMedia & {
  title: string;
  /** What the customer sees and does on this screen. */
  customer: string;
  /** What it triggers in the business behind the screen. */
  behind: string;
  sources: string[];
};

export type CaseStudyApp = {
  /** The real store listing. */
  storeUrl: string;
  storeLabel: string;
  icon: CaseStudyMedia;
  /** Two or three screens for the overlapping phones in the hero. */
  heroScreens: CaseStudyMedia[];
  heroCaption: string;
  flow: {
    heading: string;
    intro: string;
    steps: { where: string; title: string; detail: string; sources: string[] }[];
    hq: { title: string; detail: string; sources: string[] };
    catalogue: { title: string; detail: string; sources: string[] };
  };
  tour: {
    intro: string;
    /** The first-open screens, shown small in a row. */
    intro3: CaseStudyAppScreen[];
    screens: CaseStudyAppScreen[];
  };
  listing: {
    heading: string;
    intro: string;
    name: string;
    developer: string;
    facts: { label: string; value: string }[];
    whatsNew: string;
    dataSafety: string[];
    features: string[];
    read: string;
    note: string;
  };
  gains: {
    customer: { title: string; detail: string; sources: string[] }[];
    business: { title: string; detail: string; sources: string[] }[];
  };
  build: {
    heading: string;
    intro: string;
    steps: { title: string; detail: string }[];
    facts: { name: string; detail: string }[];
    note: string;
  };
  buyerFit: NonNullable<CaseStudyProduct['buyerFit']> & { note: string };
  working: NonNullable<CaseStudyProduct['working']>;
  faq: { q: string; a: string }[];
  sources: CaseStudySource[];
  sourcesNote: string;
};

export type CaseStudy = {
  slug: string;
  /** Software builds only. See `CaseStudyProduct`. */
  product?: CaseStudyProduct;
  /** Customer mobile app builds only. See `CaseStudyApp`. */
  app?: CaseStudyApp;
  /**
   * Two studies that describe one system link to each other with a
   * prominent "Part of one system" card under the answer block.
   */
  partOf?: {
    heading: string;
    body: string;
    href: string;
    linkLabel: string;
    /** The two halves, in reading order: this page first. */
    here: { name: string; detail: string };
    there: { name: string; detail: string };
  };
  /** Visible breadcrumb and BreadcrumbList name, when `client` alone is ambiguous. */
  crumbLabel?: string;
  /** Index card headline in place of the first hero metric. */
  indexLead?: CaseStudyMetric;
  /** Overrides the paragraph under the closing heading. */
  closeText?: string;
  /** Short name used in question headings: "What did EchoPulse do for X?" */
  shortName: string;
  /** Replaces the line under the booking button. Defaults to BOOK_CALL_REASSURANCE. */
  callLine?: string;
  /**
   * Who built and ran the work, printed as a "Built by" block under the
   * answer byline. The page author stays CASE_STUDY_AUTHOR; anyone else here
   * is emitted as a schema.org contributor Person.
   */
  credits?: { name: string; role: string; href?: string; isAuthor?: boolean }[];
  /** Article JSON-LD `mentions`: the categories of thing the work produced. */
  schemaMentions?: string[];
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
  /** One or two plain sentences printed under the H1. No caveats here. */
  heroLede?: string;
  /** One short honest line under the hero, for pages that need it. */
  heroNote?: string;
  /** Three or four short service tags for the index card. */
  indexTags?: string[];
  /** Real capture of the live site, shown in a browser frame in the hero. */
  heroShot?: CaseStudyShot;
  /** Real captures of the live site, shown in device frames. */
  siteShots?: { heading: string; intro: string; desktop: CaseStudyShot[]; phone?: CaseStudyShot };
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
  heroLede:
    'Average daily Google impressions for magicbnb.io, April 2026 against 1 to 16 November 2026. One team runs the site, the content, social, ads and tracking.',
  indexTags: ['Site rebuild', 'SEO and AEO content', 'Founder brand', 'Ads and analytics'],
  heroShot: {
    src: '/case-studies/mbnb-live-home-desktop.webp',
    alt: 'The magicbnb.io homepage: a deal, close and run product walkthrough above the headline "Do You Actually Know Which Properties Are Making Money?" and a Start Free Trial button.',
    width: 1600,
    height: 1000,
    url: 'magicbnb.io',
    caption: 'magicbnb.io, captured from the live site on 19 November 2026.',
  },
  siteShots: {
    heading: 'The site we rebuilt, as it stands today.',
    intro: 'Captured from the live site on 19 November 2026. Open magicbnb.io and check it against these.',
    desktop: [
      {
        src: '/case-studies/mbnb-live-features-desktop.webp',
        alt: 'A magicbnb.io section titled "Every property. Every dollar. One screen." with a portfolio dashboard drawn as working interface.',
        width: 1600,
        height: 1000,
        url: 'magicbnb.io',
        caption: 'Product surfaces drawn as working interface on the page, not static screenshots.',
      },
      {
        src: '/case-studies/mbnb-live-reconcile-desktop.webp',
        alt: 'A dark magicbnb.io section: "Your bank says one number. Your PMS says another. We reconcile them automatically."',
        width: 1600,
        height: 778,
        url: 'magicbnb.io',
        caption: 'The product described in the language of the problem it solves, not in feature language.',
      },
      {
        src: '/case-studies/mbnb-live-statements-desktop.webp',
        alt: 'A magicbnb.io section for property managers: "Run owner statements in minutes, not weekends."',
        width: 1600,
        height: 963,
        url: 'magicbnb.io',
        caption: 'A section per buyer: owner statements for property managers.',
      },
    ],
    phone: {
      src: '/case-studies/mbnb-live-home-phone.webp',
      alt: 'The magicbnb.io homepage on a phone.',
      width: 780,
      height: 1688,
      url: 'magicbnb.io',
      caption: 'The homepage on a phone.',
    },
  },
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
      replacedByMonthly: true,
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
      name: 'Site rebuild and development', when: 'Live 5 May 2026', icon: 'layout',
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
      name: 'Content planning: what gets written, and why', when: 'Rebuilt every week', icon: 'compass',
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
      name: 'Content architecture, shipped before the content', when: 'Before the first article', icon: 'layers',
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
      name: 'Choosing what to rank for', when: 'May to mid August 2026', icon: 'target',
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
      name: 'Answer engines and AI presence', when: 'In every article', icon: 'sparkles',
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
      name: 'Founder brand: Instagram and LinkedIn', when: '12 Aug to 9 Nov 2026', icon: 'user',
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
      name: 'Paid social and ad creative', when: '12 Aug to 9 Nov 2026', icon: 'megaphone',
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
      name: 'Site visitors, tracking and reporting', when: 'Collected daily', icon: 'activity',
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
  heroLede:
    'Listing tours, agent brand videos and UGC-style ads for more than 200 agents across Canada. What I saw from the editing desk, and why EchoPulse is built the opposite way.',
  heroNote: 'These agents were clients of the company I worked for, not EchoPulse clients.',
  indexTags: ['Listing tours in 4K', 'Agent brand content', 'UGC-style ads'],
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
    'Lakshya Soni founded EchoPulse Media after working as a video editor at a Canadian real estate media company, where he edited listing tours, agent personal brand videos and UGC-style ads for more than 200 real estate agents across Canada.',
    'This page is his account of that work, what he saw from the editing desk, and why EchoPulse publishes its prices and keeps the person who hears the brief on the edit.',
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
    notCounted: 'Any result for those agents. The founder edited the videos, did not run those agents\' marketing and does not have their numbers, so none are printed. This is a founder background page, not a client case study: those agents were the previous company\'s clients, not EchoPulse clients, and no agent or brokerage mentioned on the page endorses EchoPulse. The figure of more than 200 agents is the founder\'s own account of his work history, with no dated period.',
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
      name: 'Listing and property tours', icon: 'film',
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
      name: 'Agent personal brand content', icon: 'user',
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
      name: 'UGC-style ads', icon: 'clapperboard',
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
  heroLede:
    'A coaching practice was one bullet on a shared GoDaddy site. We gave it a site of its own, and took the monthly platform bill from $50 to $60 down to $0 for a one-time $599.',
  indexTags: ['Positioning', 'Copy and design', 'Build and launch', 'Tracking'],
  siteShots: {
    heading: 'workingwithgod.live, as it stands today.',
    intro: 'Captured from the live site on 19 November 2026. Every page is public, so you can open it and check.',
    desktop: [
      {
        src: '/case-studies/wwg-live-offers-desktop.webp',
        alt: 'The "Bring God into your next decision" section of workingwithgod.live: five numbered ways to begin, two marked free, each with its own link.',
        width: 1600,
        height: 1000,
        url: 'workingwithgod.live',
        caption: 'Five ways to begin, two of them free, each with its own button. This replaced one contact form.',
      },
    ],
    phone: {
      src: '/case-studies/wwg-live-home-phone.webp',
      alt: 'The workingwithgod.live homepage on a phone: the headline about perspective and a booking button.',
      width: 780,
      height: 1688,
      url: 'workingwithgod.live',
      caption: 'The homepage on a phone.',
    },
  },
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
    slider: {
      before: { src: '/case-studies/wwg-slider-before.jpg', alt: 'Top of the old Reframed Reality homepage on GoDaddy Airo: a green and white template, a stock bridge photo, "Got Growth?" and "Grow Well" above a list of challenges.', width: 1280, height: 800 },
      after: { src: '/case-studies/wwg-live-home-desktop.webp', alt: 'Top of the new workingwithgod.live homepage: a deep navy hero, the headline "Leaders don\'t plateau for lack of effort. They plateau for lack of perspective.", "Coaching for Christian Professionals", one booking button and the credential strip.', width: 1600, height: 1000 },
    },
    caption:
      'The old reframedreality.com homepage on GoDaddy Airo, captured before replacement, against workingwithgod.live, captured November 18, 2026 for the page pairs and again on November 19, 2026 for the slider. The new site is live, so you can open it and check it against this rather than take the screenshot for it.',
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
      name: 'Split the two businesses', when: 'The first decision', icon: 'split',
      summary:
        'The first decision was not a design decision. One site cannot introduce two practices to two different buyers without weakening both, so the coaching practice was given its own domain, its own name and its own audience.',
      points: [
        'workingwithgod.live now speaks to exactly one person: a Christian professional weighing a real decision at work. Nothing on it has to hedge toward a second audience.',
        'The homepage states the audience in the first line under the headline, "Coaching for Christian Professionals", so nobody has to read three sections to find out whether they are in the right place.',
        'The organizational consulting work keeps its own identity rather than being diluted by faith-based positioning it was never asking for.',
      ],
    },
    {
      name: 'Build an offer ladder instead of a contact form', when: 'Five ways in', icon: 'list',
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
      name: 'Put the credentials where the doubt is', when: 'Under the headline', icon: 'badge',
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
      name: 'Design and build', when: 'Static build', icon: 'code',
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
      name: 'Tracking that actually reports', when: 'Confirmed 18 Nov 2026', icon: 'gauge',
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
      name: 'Still here after launch', when: 'After launch', icon: 'lifebuoy',
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
      name: 'Hand it over completely', when: 'On launch', icon: 'key',
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

/**
 * Whites & Brights. A complete operating system for a multi-outlet laundry
 * and dry-cleaning chain in Patna, India, plus the public website.
 *
 * SOURCES, AND WHAT IS DELIBERATELY NOT HERE
 *
 * The software facts come from the product walkthrough EchoPulse wrote for
 * the owner (19 pages). Its screens use sample data. The screenshots below are
 * the originals embedded in that document, with every sample customer name,
 * phone number and street locality blurred, because sample data that looks
 * like a real person's details should not be published as if it were.
 * Numbers visible inside the screens (takings, orders, Brighty usage) are
 * sample data and are never quoted as results.
 *
 * The outlets and the website section come from whitesandbrights.com, opened
 * and captured on 19 November 2026. The pins use the coordinates in each
 * outlet's Google Maps listing, which the client's own site links to.
 *
 * The marketing section comes from two places. The method (catalogue to
 * script to AI video, animated explainers, captions, posting, WhatsApp) is
 * EchoPulse's process for this client, as the owner describes it. The
 * creatives shown are public posts on the brand's Instagram, captured as
 * stills on 19 November 2026; only posts that can be opened publicly are
 * described. No public YouTube videos were found, so nothing is embedded.
 * No view, follower or enquiry counts are printed anywhere on the page.
 */
const whitesBrights: CaseStudy = {
  slug: 'whites-and-brights-operating-system',
  shortName: 'Whites & Brights',
  partOf: {
    heading: 'The customer app that feeds this system has its own case study.',
    body: 'Orders placed in the Whites & Brights Android app land in the store panel described below, in App orders, ready to be assigned a pickup driver. The app\'s case study walks through it screen by screen, from the Google Play listing.',
    href: '/case-studies/whites-and-brights-customer-app',
    linkLabel: 'Read the customer app case study',
    here: { name: 'Operating system', detail: 'Counter, orders, drivers, HQ and Brighty' },
    there: { name: 'Customer app', detail: 'Android, on Google Play: book, track, pay' },
  },
  callLine: 'Tell Lakshya how your business runs today; he will tell you what he would build first.',
  credits: [
    { name: 'Lakshya Soni', role: 'Founder, EchoPulse Media. Product and engineering lead.', href: '/about/lakshya-soni', isAuthor: true },
    { name: 'Shaurya', role: 'Partner and design lead, EchoPulse Media. Design and marketing creative. Later made a director of WNB Cleantech, the company behind Whites & Brights, in recognition of his work on the business.' },
  ],
  schemaMentions: [
    'Point of sale software',
    'Customer relationship management (CRM)',
    'Multi-branch dashboard',
    'AI assistant',
    'Website',
    'AI-generated video marketing',
  ],
  heroLede:
    'Counter billing, orders, delivery, customers, reports, monthly plans, a customer app channel and a head-office command centre, with Brighty, an assistant that answers staff in Hindi, Hinglish or English, built in. EchoPulse also runs the website and the brand\'s AI-led marketing.',
  indexTags: ['Custom software', 'POS and multi-outlet HQ', 'AI video and social', 'Website'],
  indexLead: { value: '$3,400+', label: 'saved in running costs and losses, by EchoPulse\'s estimate with the client' },
  heroShot: {
    src: '/case-studies/wb-hq.webp',
    alt: 'The Whites & Brights HQ Command Centre: outlets, collections, outstanding money and orders for the month, an alerts list per outlet, and a side-by-side outlet comparison. Sample data.',
    width: 1600,
    height: 1000,
    url: 'HQ panel · Command Centre',
    caption: 'The HQ Command Centre, from the delivered product. Sample data.',
  },
  resultLine:
    'Result: more than US$3,400 saved in running costs and losses since launch, by EchoPulse\'s estimate with the client.',
  answer: [
    'EchoPulse Media built and runs the technology and marketing behind Whites & Brights, a premium laundry and dry-cleaning chain in Patna, India, run by WNB Cleantech Pvt Ltd: one operating system for every outlet, the public website, and an AI-led content programme on Instagram and Facebook. Lakshya Soni, EchoPulse\'s founder, led the product and engineering; his partner Shaurya, EchoPulse\'s design lead, led the design and marketing creative.',
    'The result: more than US$3,400 saved in running costs and losses since launch, by EchoPulse\'s estimate with the client. Managing the outlets is no longer a daily headache for the owners, and ordering at the counter and between shops is simpler.',
    'The operating system has 13 store screens across 2 panels (store and head office), a price list of more than 240 items per outlet, and Brighty, an in-browser assistant that answers staff in Hindi, Hinglish and English at 0 monthly AI fees. The website is live at whitesandbrights.com, and the reels and posts are public on Instagram, @whitesandbrights.in.',
  ],
  keyFacts: [
    { label: 'Client', value: 'Whites & Brights (whitesandbrights.com), WNB Cleantech Pvt Ltd', href: 'https://whitesandbrights.com' },
    { label: 'Company', value: 'WNB Cleantech Pvt Ltd, a private company incorporated on 2 July 2025 and registered with the Registrar of Companies, Patna (CIN U96010BR2025PTC077191). Source: IndiaFilings company record and the client\'s site footer, read 19 November 2026.' },
    { label: 'Built and run by', value: 'Lakshya Soni, founder of EchoPulse Media (product and engineering lead), with his partner Shaurya, EchoPulse\'s design lead (design and marketing creative). Disclosure: Shaurya, EchoPulse\'s design partner, was later made a director of WNB Cleantech, the company behind Whites & Brights, in recognition of his work on the business.' },
    { label: 'Industry', value: 'Premium laundry and dry cleaning, a multi-outlet chain with a head office, pickup and delivery riders, monthly plans and business (B2B) customers' },
    { label: 'Location', value: 'Patna, Bihar, India. Three outlets on the client\'s site: Sona Market (Danapur), Anandmai Colony (Phulwari Sharif) and R.K. Puram (Danapur)' },
    { label: 'Services', value: 'Laundry by the kilo, dry cleaning, steam ironing, shoe care, household items such as bedding, curtains and sofa covers, same-day express and monthly plans, with free doorstep pickup and delivery across Danapur and Phulwari Sharif and a 48-hour standard turnaround. Source: whitesandbrights.com, read 19 November 2026.' },
    { label: 'Hours and ratings', value: 'Outlets open at 9 am and close at 7 pm (Sona Market) or 9 pm (R.K. Puram, Anandmai Colony). Google ratings: 4.9 Sona Market, 4.8 R.K. Puram, 5.0 Anandmai Colony. Source: each outlet\'s Google Business Profile and whitesandbrights.com, read 19 November 2026.' },
    { label: 'Franchise', value: 'A franchise programme in three formats (Smart Point, Prime Franchise and a Signature laundry hub with collection centres) and an associate programme for new areas. The franchise page lists the brand\'s own POS and management software among the support. Source: whitesandbrights.com/franchise, read 19 November 2026.', href: 'https://whitesandbrights.com/franchise' },
    { label: 'What was built', value: 'One operating system: 13 store screens (POS, sales and orders, order status board, delivery list, customers, reports, expenses, monthly plans, supplies, app orders and more), an HQ panel with a command centre, and Brighty, an in-browser assistant with garment photo recognition. Also the public website, whitesandbrights.com.' },
    { label: 'Marketing', value: 'Run by EchoPulse with AI: AI-generated video reels, animated explainers, Hindi and English campaign posters, festival and seasonal content, branch and franchise launch content, all pointing to WhatsApp and the website. Public on Instagram (@whitesandbrights.in) and Facebook.', href: 'https://www.instagram.com/whitesandbrights.in/' },
    { label: 'Stack', value: 'React and Vite web app for PC and phone. Supabase: Postgres, sign-in, file storage, real-time updates and row-level security per outlet. Netlify, deployed from GitHub. An on-device vision model in the browser.' },
    { label: 'Period', value: 'Delivered in 2026, with marketing running alongside. Product screens, the live site and the public social posts were read on 19 November 2026.' },
    { label: 'Result', value: 'More than US$3,400 saved in running costs and losses since launch, by EchoPulse\'s estimate with the client. Managing the outlets is no longer a daily headache for the owners, and ordering at the counter and between shops is simpler. Also delivered: one system for every outlet (13 store screens, an HQ panel and Brighty at 0 monthly AI fees), a live website with a booking path on every page, and a running content programme on Instagram and Facebook.' },
    { label: 'Data source', value: 'The delivered product (EchoPulse\'s walkthrough for the owner, with screens on sample data), the savings estimate shared by the founder, the client\'s live site whitesandbrights.com, the outlets\' Google Business Profiles, the app\'s Google Play listing, the IndiaFilings company record, and the brand\'s public Instagram and Facebook posts, read 19 November 2026.' },
    { label: 'Last updated', value: '19 November 2026' },
  ],
  indexResult:
    'For Whites & Brights, a laundry chain in Patna, EchoPulse built one operating system for every outlet and runs the website and AI-led marketing: more than US$3,400 saved in running costs and losses, by EchoPulse\'s estimate with the client.',
  measurement: {
    tool: 'The delivered product, from the walkthrough document EchoPulse wrote for the owner and the screenshots inside it; the savings estimate shared by Lakshya Soni, EchoPulse\'s founder, on 19 November 2026; the client\'s live website, crawled and captured on 19 November 2026; and the outlets\' Google Business Profiles, the app\'s Google Play listing, the IndiaFilings company record and the brand\'s public Instagram and Facebook pages, read the same day.',
    dateRanges:
      'Product screens: sample data dated 19 November 2026. Live site: thirteen public pages captured on 19 November 2026. Social: public posts from 15 to 19 November 2026, captured as stills on 19 November 2026.',
    counted:
      'The counts describe the product: 13 store screens, 2 panels, more than 240 items in each outlet\'s price list, 3 languages Brighty reads, 0 monthly AI fees. The outlets are the three listed on whitesandbrights.com, pinned from the coordinates in each one\'s Google Maps listing. The creatives are public posts, each linked to the original.',
    notCounted:
      'Figures visible inside the product screenshots (takings, orders, Brighty usage) are sample data and are not quoted. Sample names, phone numbers and localities are blurred. The savings estimate is not broken down by line item, and no other result figure is published.',
    extra: [
      { label: 'Savings figure', value: 'More than US$3,400 saved in running costs and losses, by EchoPulse\'s estimate with the client. Basis: estimate of operating costs and losses avoided since launch, shared by the founder; the breakdown is not published.' },
      { label: 'Disclosure', value: 'An EchoPulse partner is a director of the client company. Shaurya, EchoPulse\'s design partner, was later made a director of WNB Cleantech, the company behind Whites & Brights, in recognition of his work on the business.' },
      { label: 'Public facts about the client', value: 'Company record, services, hours, ratings, the app and the franchise programme are each taken from a public page, listed with its read date under "About Whites & Brights". Ratings are as shown on each outlet\'s Google Business Profile on 19 November 2026 and will change.' },
    ],
  },
  relatedService: { slug: 'apps-software', label: 'How the apps and software service works' },
  fit: {
    suits: [
      'You run more than one counter, branch or outlet, and cannot see them all in one place.',
      'Your staff phone the owner or head office to ask what something costs.',
      'Your price list is long, and your team speaks Hindi or Hinglish at the counter.',
      'You have pickups, deliveries, monthly plans or business customers to keep track of.',
      'You want the software and the marketing run by one team, so offers, reels and the counter say the same thing.',
    ],
  },
  client: 'Whites & Brights',
  organizationName: 'Whites & Brights',
  clientUrl: 'https://whitesandbrights.com',
  clientTagline:
    'Premium laundry and dry cleaning in Patna, India, run by WNB Cleantech Pvt Ltd. Outlets in Danapur and Phulwari Sharif, free doorstep pickup, monthly plans, business customers and a franchise programme.',
  industry: 'Laundry and dry cleaning, multi-outlet',
  icpKey: 'business-owners',

  metaTitle: 'Whites & Brights: One System for Every Outlet',
  metaDescription:
    'How EchoPulse built one operating system for a Patna laundry chain, saving over US$3,400 by its estimate with the client, and runs its website and AI-led marketing.',

  eyebrow: 'Case study',
  headline: 'One operating system',
  headlineAccent: 'for every outlet.',
  summary:
    'Whites & Brights is a premium laundry and dry-cleaning chain in Patna with more than one outlet, a head office, pickup and delivery riders, monthly plans and business customers. Bills were slow, prices varied between counters, staff phoned head office for every unusual item, and each outlet was a black box to the owners until month-end. EchoPulse built one system for all of it: a store panel for every outlet, an HQ panel that sees them all live, and Brighty, an assistant that answers staff in the language they type in and runs on the shop\'s own PC. EchoPulse also built the public website, whitesandbrights.com, and runs the brand\'s marketing with AI: AI-generated video, animated explainers, Hindi and English posts and content for new branches. By EchoPulse\'s estimate with the client, the system has saved more than US$3,400 in running costs and losses since launch.',
  tldr: [
    'The result: more than US$3,400 saved in running costs and losses, by EchoPulse\'s estimate with the client. Managing the outlets is no longer a daily headache for the owners.',
    'The problem: slow bills, prices that varied by counter, staff phoning head office, and no single view of what was due, overdue or unpaid.',
    'What we built: a store panel with 13 screens, an HQ command centre, and Brighty, an assistant in Hindi, Hinglish and English with photo recognition.',
    'What it costs to run: no monthly AI bill. Brighty runs in the browser on the shop\'s PC, and garment photos never leave the shop.',
    'Marketing: AI-generated reels, animated explainers and Hindi campaign posts on Instagram and Facebook, every one ending on WhatsApp and the website.',
  ],

  windowLabel: 'Delivered 2026',
  windowStartISO: '2026-11-19',
  windowEndISO: '2026-11-19',
  publishedISO: '2026-11-19',

  services: [
    'Custom software',
    'Point of sale and billing',
    'Multi-outlet HQ dashboard',
    'In-app assistant in Hindi and English',
    'On-device photo recognition',
    'Price list and catalogue clean-up',
    'Website',
    'AI video and animated explainers',
    'Social content in Hindi and English',
    'Local search and WhatsApp enquiries',
  ],

  heroMetrics: [
    { value: '$3,400+', label: 'saved in running costs and losses', note: 'by EchoPulse\'s estimate with the client' },
    { value: '13', label: 'store screens', note: 'From the dashboard to app orders' },
    { value: '2', label: 'panels: store and HQ', note: 'Each outlet in its own store panel' },
    { value: '240+', label: 'items in each outlet\'s price list', note: 'Searchable by name, nickname or Hindi word' },
    { value: '3', label: 'languages Brighty reads', note: 'English, Hindi and Hinglish' },
    { value: '0', label: 'monthly AI fees', note: 'Brighty runs on the shop\'s own PC' },
  ],

  atAGlance: [
    { label: 'Panels', value: 'Store panel for each outlet; HQ panel that sees every outlet live' },
    { label: 'Assistant', value: 'Brighty: prices, offers, rules, how-tos, today\'s numbers, a customer\'s orders and garment photos, answered from the live catalogue, HQ rules and past bills' },
    { label: 'Access', value: 'Counter staff, outlet managers and super admins each get the right screens. Each outlet reads and changes only its own data.' },
    { label: 'Alongside the software', value: 'The price list, the team guide and the catalogue clean-up, so the launch came with correct data' },
    { label: 'Website', value: 'whitesandbrights.com, captured 19 November 2026' },
  ],

  situation: {
    headline: 'Every outlet ran on memory, phone calls and month-end totals.',
    body: [
      'Whites & Brights runs a menu of hundreds of items, from a shirt press to a bridal lehenga or a sofa cover, across more than one outlet, with riders on the road and customers on monthly plans.',
    ],
    failures: [
      { title: 'Slow bills', detail: 'Billing at the counter took too long for a busy shop.' },
      { title: 'Prices varied between counters', detail: 'The same item could be billed differently at different outlets.' },
      { title: 'Staff phoned head office', detail: 'Every unusual item meant a call to ask the price.' },
      { title: 'No single view of the money', detail: 'Nobody could see, in one place, what was due today, what was overdue or who still owed money.' },
      { title: 'Each outlet was a black box', detail: 'The owners saw how an outlet was doing only at month-end.' },
    ],
  },

  /* The short-cycle approach, rendered as the timeline. Facts from the
     delivery document only: no dates are given there, so none are printed. */
  workstreams: [
    {
      name: 'Build one screen with the owners',
      when: 'Each cycle',
      icon: 'layout',
      serviceSlug: 'apps-software',
      summary: 'Work ran in short cycles with the owners. Each one started from a single screen of the store or HQ panel.',
      points: [
        'Short cycles with the owners: build a screen, put it in front of counter staff, fix what slowed them down, repeat.',
        'Every change went live automatically from GitHub to Netlify, so a fixed screen reached the shop without a manual release.',
      ],
    },
    {
      name: 'Put it in front of counter staff',
      when: 'Each cycle',
      icon: 'user',
      summary: 'The test was a busy counter, not a demo. Keyboard shortcuts, one-tap chips and large touch targets came out of that.',
      points: [
        'Keyboard first at the counter: / to search, F2 to pay, F4 to save unpaid.',
        'On the phone: large tap targets, a slide-out menu and a full-screen assistant.',
      ],
    },
    {
      name: 'Fix what slowed them down, and repeat',
      when: 'Each cycle',
      icon: 'activity',
      summary: 'What staff stumbled on went into the next cycle. When the POS search finds nothing, for example, Brighty opens with the same words already typed.',
      points: [
        '"No item called sofa cum bed" becomes "Ask Brighty the price of sofa cum bed".',
        'Ctrl + J opens the assistant from any screen without losing the bill in progress.',
      ],
    },
    {
      name: 'Clean the data alongside the code',
      when: 'Alongside',
      icon: 'layers',
      summary: 'The price list, the team guide and the catalogue clean-up were done alongside the software, so the launch came with correct data, not just correct code.',
      points: [
        'Catalogue changes ship as reviewed SQL scripts with a backup taken first.',
        'HQ edits prices and rules in one place; the counter and Brighty update instantly.',
      ],
    },
  ],

  proof: [],

  midCtaText:
    'Running branches on spreadsheets, phone calls and WhatsApp? Tell Lakshya how your business runs today; he will tell you what he would build first.',
  closeText:
    'Tell Lakshya how your counters, branches and staff work today. He will tell you which of the problems above you share, what he would build first, and say plainly when off-the-shelf software would do.',
  openProblemsAccent: 'and what comes next.',

  /* Nothing open to list on this page. CaseStudyPage hides the section and
     its nav link when this is empty. */
  openProblems: [],

  notApplicable: [
    {
      title: 'You have one counter and a short price list',
      detail:
        'An off-the-shelf billing app is cheaper and will do the job. A system like this earns its cost when there are several outlets, a long menu and staff who need answers without phoning anyone.',
    },
    {
      title: 'The owners cannot give time to the cycles',
      detail:
        'This was built screen by screen with the owners and counter staff. Without someone from the business to try each screen and say what slowed them down, the short cycles do not work.',
    },
    {
      title: 'You want an assistant that answers anything',
      detail:
        'Brighty answers only from the live catalogue, head-office rules and real past bills, and asks when it is not sure. That is deliberate. If you want open-ended chat, this is not it.',
    },
    {
      title: 'Your data cannot be cleaned first',
      detail:
        'The price list and catalogue were cleaned alongside the software. Software built on a price list nobody agrees on gives wrong answers faster.',
    },
  ],

  product: {
    heroPhone: {
      src: '/case-studies/wb-hero-phone.webp',
      alt: 'The store dashboard on a phone: a needs-attention list with orders to hand over, overdue orders, unpaid money, app orders awaiting pickup and supplies to approve. Sample data.',
      width: 780,
      height: 1688,
    },
    challenge: [
      {
        title: 'The client',
        body: 'A premium laundry and dry-cleaning brand in Patna with more than one outlet, a head office, pickup and delivery riders, monthly plans and business (B2B) customers. The menu runs to hundreds of items, from a shirt press to a bridal lehenga or a sofa cover.',
      },
      {
        title: 'What was hurting',
        body: 'Bills were slow and prices varied between counters. Staff phoned head office for every unusual item. Nobody could see, in one place, what was due today, what was overdue or who still owed money. Each outlet was a black box to the owners until month-end.',
      },
      {
        title: 'What they asked for',
        body: 'One system for every outlet, simple enough for counter staff on day one, that works on the shop PC and on a phone. Owners wanted live numbers across all outlets; staff wanted fast, correct answers to "how much for this?" without calling anyone.',
      },
    ],
    outlets: {
      heading: 'Where Whites & Brights operates',
      intro:
        'Three outlets in west Patna, as the client lists them on whitesandbrights.com. Every outlet runs its own store panel; head office sees all three live.',
      map: {
        src: '/case-studies/wb-map-patna.webp',
        alt: 'A dark map of west and central Patna from Danapur to Patna Junction, with the Ganga along the top.',
        width: 1600,
        height: 1055,
      },
      attribution: { label: 'Map data © OpenStreetMap contributors', href: 'https://www.openstreetmap.org/copyright' },
      items: [
        {
          name: 'Sona Market, Danapur',
          address: 'Sona Market, Cant Road, in front of Danapur Club, Danapur, Patna 801105',
          hours: 'Open till 7 pm',
          mapsUrl: 'https://maps.app.goo.gl/Q2hPJ1jRe2eEW4D66',
          x: 23.56,
          y: 45.71,
          labelSide: 'right',
        },
        {
          name: 'R.K. Puram, Danapur',
          address: 'Kalawati Complex, Ward 2, R.K. Puram, Khagaul Road, Danapur 801503',
          hours: 'Open till 9 pm',
          mapsUrl: 'https://maps.app.goo.gl/1zTQ136dYz3fJzeLA',
          x: 25.31,
          y: 37.46,
          labelSide: 'right',
        },
        {
          name: 'Anandmai Colony, Phulwari Sharif',
          address: 'Anandmai Colony, beside Canara Bank, Phulwari Sharif, Patna',
          hours: 'Open till 9 pm',
          mapsUrl: 'https://maps.app.goo.gl/Bpq5nYxFDE7kg3Vy8',
          x: 41.25,
          y: 76.54,
          labelSide: 'right',
        },
      ],
      reference: { name: 'Patna Junction', x: 79.06, y: 48.7 },
      note:
        'Names, addresses and hours as published on whitesandbrights.com on 19 November 2026. Pins use the coordinates in each outlet\'s Google Maps listing, linked from the client\'s site. Patna Junction is shown only for orientation.',
    },
    system: {
      intro:
        'Every outlet works in its own store panel. Head office sees all of them live in the HQ panel. Brighty sits on top of both, one keystroke away.',
      columns: [
        { name: 'Counter', panel: 'store', items: ['Point of Sale', 'Sales and orders', 'Order status board', 'Delivery list'] },
        { name: 'Customers', panel: 'store', items: ['Customer directory', 'Birthday and anniversary wishes', 'Monthly plans', 'Customer app orders and live tracking'] },
        { name: 'Back office', panel: 'store', items: ['Reports', 'Expenses', 'Supplies and reorder stock', 'Catalogue and prices'] },
        { name: 'Head office', panel: 'hq', items: ['Command centre', 'Outlet comparison', 'Alerts', 'Brighty training and usage'] },
      ],
      assistant: {
        name: 'Brighty, the built-in assistant',
        body: 'Prices, offers, rules, "how do I", today\'s numbers, a customer\'s orders, and photos of garments. It reads the same live catalogue the counter bills from, learns from every bill and every head-office answer, and runs entirely inside the browser.',
      },
    },
    tour: {
      intro:
        'The store panel, screen by screen, from the delivered product. Screens use sample data; sample names and phone numbers are blurred.',
      groups: [
        {
          name: 'Counter',
          summary: 'Bills were slow and prices changed by counter. Now one price list, a search box and F2 to pay.',
          screens: [
            {
              title: 'Dashboard',
              src: '/case-studies/wb-dashboard.webp',
              alt: 'The store dashboard: a needs-attention row with orders to hand over today, overdue orders, unpaid money, app orders awaiting pickup, a supply order to approve, birthdays and a plan expiring, then today\'s billed, collected and to-hand-over totals. Sample data.',
              width: 1600,
              height: 1000,
              points: [
                'Needs attention first: orders to hand over today, overdue orders, unpaid money, app orders waiting for a driver, supplies to approve, plans expiring this week.',
                'Birthdays and anniversaries with a one-tap WhatsApp wish that carries a ready-made offer.',
                'Counter and Owner views: staff see the work; the owner view adds takings, trends and comparisons.',
                'Every card is a shortcut to the filtered list behind it.',
              ],
            },
            {
              title: 'Point of Sale',
              src: '/case-studies/wb-pos.webp',
              alt: 'The Point of Sale screen: a product search, frequent items as one-tap chips, category filters, a grid of priced garments, and a cart with discount, total and keyboard shortcuts. Sample data.',
              width: 1600,
              height: 1000,
              points: [
                'Find any of 240+ items by name, nickname or Hindi word; frequent items sit on top as one-tap chips.',
                'Type a phone number and a returning customer\'s name and address fill in by themselves.',
                'The delivery-date picker shows how full the plant already is that day.',
                'Keyboard first: / to search, F2 to pay, F4 to save unpaid.',
              ],
            },
          ],
        },
        {
          name: 'Orders and delivery',
          summary: 'Nobody could say what was ready, due or overdue. Now every order carries its status on every screen.',
          screens: [
            {
              title: 'Sales list',
              src: '/case-studies/wb-sales.webp',
              alt: 'The Sales list with filter chips for unpaid, partial, overdue, not delivered, app orders and cancelled, and a day header showing billed, collected and due. Sample data, client names blurred.',
              width: 1600,
              height: 1000,
              points: [
                'Filters that match real questions: unpaid, partial, overdue, not delivered, app orders, each with a live count.',
                'Each outlet gets its own order series (RKP-1216, PSF-113), so staff never mix them up.',
              ],
            },
            {
              title: 'Order drawer',
              src: '/case-studies/wb-order-drawer.webp',
              alt: 'An order drawer over the sales list: total, paid and balance due, status, billed and pickup dates, outlet, channel, pieces, buttons for a WhatsApp ready message, a payment reminder and a call, and the items. Sample data, customer details blurred.',
              width: 1600,
              height: 1000,
              points: [
                'Total, paid, balance, status, items, pickup date, channel and customer in one side drawer.',
                '"Ready for pickup" and payment reminders open WhatsApp with the message already written.',
              ],
            },
            {
              title: 'Order status board',
              src: '/case-studies/wb-status-board.webp',
              alt: 'The Order Status board with a barcode scan box, app orders in columns from pending pickup to at outlet, and walk-in orders from order placed to received at plant. Sample data, names blurred.',
              width: 1600,
              height: 1000,
              points: [
                'A board for the plant: orders move from placed to processing to ready, so the counter knows what is done.',
                'A change on one PC shows on every other screen instantly.',
              ],
            },
            {
              title: 'Delivery list',
              src: '/case-studies/wb-delivery.webp',
              alt: 'The Delivery List for today: pickup-at-store and home-delivery cards with outlet, order number, status, pieces, amount to collect, and Collect and Handed over buttons, plus overdue and upcoming tabs. Sample data, customer details blurred.',
              width: 1600,
              height: 1000,
              points: [
                'Today\'s pickups and drop-offs for riders, with addresses and amounts to collect.',
                'Overdue orders stay highlighted until they are handed over.',
              ],
            },
          ],
        },
        {
          name: 'Customers and reports',
          summary: 'The owner saw the numbers at month-end. Now any outlet, or the whole chain, is one click away.',
          screens: [
            {
              title: 'Customer directory',
              src: '/case-studies/wb-customers.webp',
              alt: 'The Customers list with filters for owes money, has plan, inactive, new this month and birthdays, and columns for outlet, visits, last visit, billed, due and plan. Sample data, names and phones blurred.',
              width: 1600,
              height: 1000,
              points: [
                'Every order, total spend, balance and important dates for each customer.',
                'Each outlet only sees its own customers; HQ sees all.',
              ],
            },
            {
              title: 'Reports',
              src: '/case-studies/wb-reports.webp',
              alt: 'The Reports screen for a month: collected, expenses and supplies, net and orders billed, a money in versus out bar chart by day, and where the money went. Sample data.',
              width: 1600,
              height: 1000,
              points: [
                'Sales, collections, outstanding and expenses by day, month and outlet.',
                'Switch between a single outlet and the whole chain in one click.',
              ],
            },
          ],
        },
        {
          name: 'Money and plans',
          summary: 'Expenses on paper and plans renewed from memory. Now both feed the reports and the dashboard.',
          screens: [
            {
              title: 'Expenses',
              src: '/case-studies/wb-expenses.webp',
              alt: 'The Expenses screen: a reminder of monthly costs not yet added, totals for rent, salary, utilities, maintenance and general, and a list of expenses by date and outlet. Sample data.',
              width: 1600,
              height: 1000,
              points: [
                'Rent, wages, chemicals and electricity, logged at the outlet and visible to HQ.',
                'Expenses and supplies feed straight into the reports, so profit is real.',
              ],
            },
            {
              title: 'Monthly plans',
              src: '/case-studies/wb-plans.webp',
              alt: 'The Subscriptions screen with four weight-based monthly plans and a list of customer subscriptions with balance in kilos, expiry date and a renew message button. Sample data, names blurred.',
              width: 1600,
              height: 1000,
              points: [
                'Monthly laundry plans with usage tracking and expiry reminders.',
                'Plans expiring this week appear on the dashboard with a renewal offer.',
              ],
            },
          ],
        },
        {
          name: 'Supplies and the app channel',
          summary: 'Stock requests and app orders came in by phone. Now both arrive as lists to approve and assign.',
          screens: [
            {
              title: 'Reorder stock',
              src: '/case-studies/wb-supplies.webp',
              alt: 'The Reorder Stock screen: chemicals and packaging with prices and minimum order quantities, a reorder cart with a note for HQ, and a Send order to HQ button. Sample data.',
              width: 1600,
              height: 1000,
              points: [
                'Outlets request supplies; HQ approves them in its own panel.',
              ],
            },
            {
              title: 'App orders',
              src: '/case-studies/wb-app-orders.webp',
              alt: 'The App Orders screen, live: awaiting pickup, in progress and delivered counts, and a list of app orders with status and an Assign pickup button. Sample data, customer details blurred.',
              width: 1600,
              height: 1000,
              points: [
                'Orders placed in the customer app land here, ready to be assigned a pickup driver.',
                'Staff and customers can follow the rider on a map.',
                'The app, the counter and Brighty all read the same prices.',
              ],
            },
          ],
        },
      ],
    },
    assistant: {
      name: 'Brighty',
      claim: 'Answers that never leave staff stuck.',
      intro:
        'Before, an unusual item meant a call to the owner. Now counter staff ask the way they would on WhatsApp, and Brighty answers with the price, where it comes from, and a button to add it to the bill.',
      queries: [
        {
          q: 'lehnga bhari kitna lagega',
          what: 'Hinglish, misspelt. Brighty finds the heavy bridal lehenga, shows the price and its sources, and offers Add to bill.',
          shot: {
            src: '/case-studies/wb-brighty-lehenga.webp',
            alt: 'Brighty on a phone answering "lehnga bhari kitna lagega" with Lehenga, heavy bridal, dry clean, ₹549 a set, where the price comes from, and Add to bill, Copy quote, WhatsApp and Ask HQ buttons. Sample data.',
            width: 780,
            height: 1578,
          },
        },
        {
          q: 'pikup rule',
          what: 'A rule, not a price. Brighty returns the free pickup and delivery rule, next to a step-by-step answer on how to make a bill.',
          shot: {
            src: '/case-studies/wb-brighty-howto.webp',
            alt: 'Brighty answering "bill kaise banaye" with steps to make a bill and an Open Point of Sale button, then "pikup rule" with the free pickup and delivery rule. Sample data.',
            width: 780,
            height: 1578,
          },
        },
        {
          q: 'aaj ka sale',
          what: 'Today\'s numbers: bills made, collected, due today and overdue, with a button that opens the dashboard.',
          shot: {
            src: '/case-studies/wb-brighty-today.webp',
            alt: 'Brighty answering "aaj ka sale" with today so far: bills made, collected, due today and overdue, and an Open Dashboard button. Sample data.',
            width: 780,
            height: 1578,
          },
        },
      ],
      more: [
        { title: 'New-customer offer applied', src: '/case-studies/wb-brighty-offer.webp', alt: 'Brighty quoting two heavy sarees for a new customer with the first-order offer applied. Sample data.', width: 780, height: 1578 },
        { title: 'Asks: for whom?', src: '/case-studies/wb-brighty-forwhom.webp', alt: 'Brighty answering "3 piece suit" with a question, for whom, and both prices for men and women. Sample data.', width: 780, height: 1578 },
        { title: 'Bulk quote with express', src: '/case-studies/wb-brighty-bulk.webp', alt: 'Brighty quoting 120 shirts and 60 trousers for steam press with an express note. Sample data.', width: 780, height: 1578 },
        { title: 'Kids rate card', src: '/case-studies/wb-brighty-kids.webp', alt: 'Brighty listing the kids dry-clean rate card. Sample data.', width: 780, height: 1578 },
        { title: 'Hindi (Devanagari)', src: '/case-studies/wb-brighty-hindi.webp', alt: 'Brighty answering a question typed in Hindi script with the heavy lehenga price. Sample data.', width: 780, height: 1578 },
        { title: 'From past bills', src: '/case-studies/wb-brighty-pastbills.webp', alt: 'Brighty pricing a car seat cover that is not on the list, from a past bill, marked likely. Sample data.', width: 780, height: 1578 },
      ],
      capabilities: [
        { title: 'Speaks like the staff do', detail: 'English, Hindi in Devanagari, and Hinglish with spelling mistakes.' },
        { title: 'Shows its working', detail: 'Every price shows its source: the approved price list, the billing catalogue and what past bills actually charged.' },
        { title: 'Asks instead of guessing', detail: '"3 piece suit" gets a quick "for whom?" with both prices, not a wrong answer.' },
        { title: 'Quotes, offers and lists', detail: 'Bulk quotes with express charges, first-order and birthday discounts, and full rate cards by category.' },
        { title: 'Knows the shop', detail: 'Today\'s sales, what is due, what is unpaid, a customer\'s orders, the outlet\'s address, and how-tos that open the right screen.' },
        { title: 'Recognises photos', detail: 'Snap a garment and Brighty suggests the item. The image model runs inside the browser.' },
        { title: 'Learns by itself', detail: 'Every bill and every head-office answer teaches it. A question it cannot answer goes to HQ once, and is answered automatically next time.' },
      ],
      counter: {
        title: 'Built into the counter',
        src: '/case-studies/wb-pos-brighty.webp',
        alt: 'The Point of Sale with "sofa cum bed" typed in the search, the message "No item called sofa cum bed here" and a button "Ask Brighty the price of sofa cum bed", next to the billing form with a plant load bar. Sample data.',
        width: 1600,
        height: 1000,
        points: [
          '"No item called sofa cum bed" becomes "Ask Brighty the price of sofa cum bed".',
          'Ctrl + J opens the assistant from any screen without losing the bill in progress.',
          'Brighty\'s answer has an Add to bill button that drops the item into the cart.',
        ],
      },
      noBill: {
        title: 'No monthly AI bill',
        body: [
          'Brighty runs on the shop\'s own PC, inside the browser. There is no per-question charge from an AI provider, so asking a hundred questions costs the same as asking one.',
          'Garment photos are read by a compact image model in the browser, so they never leave the shop.',
          'It answers only from the live catalogue, head-office rules and real past bills, never made up.',
        ],
      },
    },
    hq: {
      intro: 'Each outlet was a black box until month-end. Now every outlet\'s takings, orders and problems sit on one screen, and head office teaches Brighty from here.',
      screens: [
        {
          title: 'HQ Command Centre',
          src: '/case-studies/wb-hq.webp',
          alt: 'The HQ Command Centre: outlets, collected, outstanding and orders for the month, alerts per outlet for orders past due, old unpaid balances and app orders waiting for a driver, and an outlet comparison table. Sample data.',
          width: 1600,
          height: 1000,
          points: [
            'Outlets, collections, outstanding money and order counts for any month.',
            'Alerts per outlet: overdue orders, unpaid balances older than 30 days, app orders waiting for a driver.',
            'Side-by-side collections, expenses and supplies, so owners spot the weak outlet early.',
            'Add outlets, run offers, manage app customers and approve supply orders.',
          ],
        },
        {
          title: 'Questions from outlets',
          src: '/case-studies/wb-training.webp',
          alt: 'The Brighty training screen in the HQ panel: a question from an outlet about a bridal lehenga with the assistant\'s best guess, and fields for HQ to set the price and answer once. Sample data.',
          width: 1600,
          height: 1000,
          points: [
            'When Brighty cannot answer, the question lands at HQ with the staff\'s guess; HQ\'s answer is remembered.',
            'HQ edits prices and rules in one place; the counter and Brighty update instantly.',
          ],
        },
        {
          title: 'Usage over 30 days',
          src: '/case-studies/wb-usage.webp',
          alt: 'The Brighty usage screen: questions asked over 30 days, the share answered by Brighty itself, questions by outlet, what Brighty could not answer and the most asked items. Sample data.',
          width: 1600,
          height: 1000,
          points: [
            'Questions per outlet, the share Brighty answered by itself, and the most-asked items.',
            '"What Brighty couldn\'t answer" shows exactly which items to add to the price list.',
          ],
        },
      ],
    },
    phone: {
      intro: 'The owner is rarely at the counter. The same app opens on a phone, so the day can be checked from anywhere, and riders and staff use it on the move.',
      points: [
        { title: 'One app, every screen size', detail: 'Nothing separate to install or keep updated: it opens in the browser and can be added to the home screen.' },
        { title: 'Owner on the go', detail: 'The needs-attention list, collections and alerts are the first thing on the phone.' },
        { title: 'Brighty in the pocket', detail: 'Staff can snap a garment with the phone camera and get the price.' },
        { title: 'Touch-friendly', detail: 'Large tap targets, a slide-out menu and a full-screen assistant.' },
      ],
      shots: [
        { src: '/case-studies/wb-phone-dashboard.webp', alt: 'The store dashboard on a phone with the needs-attention list first. Sample data.', width: 780, height: 1688, caption: 'Dashboard' },
        { src: '/case-studies/wb-phone-brighty.webp', alt: 'Brighty full screen on a phone answering "lehenga heavy kitna". Sample data.', width: 780, height: 1688, caption: 'Brighty' },
        { src: '/case-studies/wb-brighty-welcome.webp', alt: 'Brighty\'s welcome message on a phone with suggested questions in Hinglish and English. Sample data.', width: 780, height: 1578, caption: 'Suggested questions' },
      ],
    },
    website: {
      url: 'https://whitesandbrights.com',
      heading: 'The website, as it stands today.',
      intro:
        'EchoPulse also built the public website. Everything below is what anyone can see on whitesandbrights.com, captured on 19 November 2026.',
      hero: {
        src: '/case-studies/wb-live-home-desktop.webp',
        alt: 'The whitesandbrights.com homepage: "Fresh clothes, without the chores", free doorstep pickup across Danapur and Phulwari Sharif, Book a free pickup and WhatsApp us buttons, and a strip with Google rating, three outlets and a first-order offer.',
        width: 1600,
        height: 1000,
        url: 'whitesandbrights.com',
        caption: 'The homepage, captured 19 November 2026.',
      },
      phone: {
        src: '/case-studies/wb-live-home-phone.webp',
        alt: 'The whitesandbrights.com homepage on a phone, with Book a free pickup and WhatsApp us buttons and a floating WhatsApp button.',
        width: 780,
        height: 1688,
        url: 'whitesandbrights.com',
        caption: 'The homepage on a phone.',
      },
      more: [
        {
          src: '/case-studies/wb-live-outlets-desktop.webp',
          alt: 'The outlets section of whitesandbrights.com: "Three outlets. One standard." with each outlet\'s name, rating, opening hours, full address and a map link.',
          width: 1600,
          height: 1000,
          url: 'whitesandbrights.com',
          caption: 'Every outlet with its address, hours and a Google Maps link.',
        },
        {
          src: '/case-studies/wb-live-services-desktop.webp',
          alt: 'The Services and Prices page of whitesandbrights.com with tabs for laundry by kilo, dry cleaning, steam ironing, household and shoes, express and subscriptions, and a per-kilogram price table with turnaround times.',
          width: 1600,
          height: 1000,
          url: 'whitesandbrights.com/services',
          caption: 'The full price list, with turnaround times, by service.',
        },
        {
          src: '/case-studies/wb-live-contact-desktop.webp',
          alt: 'The Contact page of whitesandbrights.com: WhatsApp, call and email, and a form that asks what the enquiry is about.',
          width: 1600,
          height: 1000,
          url: 'whitesandbrights.com/contact',
          caption: 'Contact: WhatsApp, call, email, and a form that sorts enquiries by type.',
        },
      ],
      built: [
        { title: 'Thirteen public pages', detail: 'Home, services and full price list, franchise, about, CSR, associate, careers, contact, help centre, FAQ, terms, privacy and account deletion.' },
        { title: 'Local by default', detail: 'Patna, Danapur and Phulwari Sharif in the page titles, descriptions and copy, and every outlet with its full address, hours and a Google Maps link.' },
        { title: 'A booking path on every page', detail: 'Book a pickup, a WhatsApp button that opens a pre-written booking message, a click-to-call number and a floating WhatsApp button.' },
        { title: 'Enquiries sorted at the source', detail: 'The contact form asks what the enquiry is about: a pickup, a service question, business or bulk laundry, franchise or a job.' },
        { title: 'Pages for partners', detail: 'Franchise and associate pages with their own application forms, kept apart from the customer booking path.' },
        { title: 'The app, linked', detail: 'Get the app links to the Android app on Google Play from the header and the homepage.' },
      ],
      note:
        'Everything above is on the live site today. Open whitesandbrights.com to check any of it, from the price list to the WhatsApp booking button.',
    },
    enquiryProof: null,
    stack: [
      {
        group: 'Stack',
        items: [
          { name: 'Front end', detail: 'React with Vite: one responsive web app for PC and phone.' },
          { name: 'Back end', detail: 'Supabase: Postgres database, sign-in, file storage and real-time updates.' },
          { name: 'Hosting', detail: 'Netlify, with every change going live automatically from GitHub.' },
        ],
      },
      {
        group: 'Data and security',
        items: [
          { name: 'Row-level security', detail: 'Each outlet can only read and change its own data; HQ sees all.' },
          { name: 'Roles', detail: 'Counter staff, outlet managers and super admins each get the right screens.' },
          { name: 'Audit-friendly', detail: 'Catalogue changes ship as reviewed SQL scripts with a backup taken first.' },
        ],
      },
      {
        group: 'Brighty\'s engine',
        items: [
          { name: 'Language', detail: 'Spelling-tolerant matching, Hindi and Hinglish words, sound-alike words and number words.' },
          { name: 'Grounded answers', detail: 'Only from the live catalogue, HQ rules and real past bills, never made up.' },
          { name: 'On-device vision', detail: 'A compact image model runs in the browser for garment photos.' },
        ],
      },
    ],
    approach: {
      heading: 'Short cycles, with the data cleaned alongside.',
      intro: 'Build a screen, put it in front of counter staff, fix what slowed them down, repeat. The launch came with correct data, not just correct code.',
    },
    benefits: [
      { title: 'One price, everywhere', detail: 'The app, the counter and Brighty all read the same prices, and HQ edits them in one place.' },
      { title: 'Fewer calls to head office', detail: 'Staff ask Brighty. A question it cannot answer goes to HQ once, and is answered automatically next time.' },
      { title: 'Due, overdue and unpaid in one place', detail: 'The dashboard opens on what needs attention, and every card leads to the list behind it.' },
      { title: 'No outlet is a black box', detail: 'HQ sees every outlet live, with alerts and a side-by-side comparison, not a month-end total.' },
      { title: 'Live across screens', detail: 'A change on one PC shows on every other screen instantly.' },
      { title: 'Each outlet sees only its own data', detail: 'Row-level security per outlet; head office sees all.' },
      { title: 'No monthly AI bill', detail: 'Brighty runs in the browser on the shop\'s PC, with no per-question charge, and photos never leave the shop.' },
      { title: 'Regular money, tracked', detail: 'Monthly plans with usage, expiry reminders and renewal offers, and expenses that feed straight into the reports.' },
    ],
    benefitsLead: 'From the delivered product, outlet by outlet.',
    marketing: {
      heading: 'One team runs the reels, the website and the counter.',
      intro:
        'EchoPulse runs Whites & Brights\' marketing with AI: AI-generated video, animated explainers, campaign posts, the website and content for new branches. Every piece starts from the same catalogue the counter bills from, and every piece ends on WhatsApp.',
      pipeline: [
        { title: 'Catalogue and offers', detail: 'Services, prices and offers come from the HQ panel, the same catalogue the counter and Brighty read. A promo never quotes a price the shop does not charge.' },
        { title: 'Script', detail: 'One idea per piece, written Hindi first with English where customers use it: the hook, the voiceover, the on-screen lines and the call to action.' },
        { title: 'AI video and animation', detail: 'AI video generation for cinematic promos and festival films. Animated explainers for how pickup, delivery, monthly plans and the app work. Designed posters for franchise and training.' },
        { title: 'Edit and caption', detail: 'Short-form cuts for Reels, vertical and landscape versions, and captions in Hindi and English with the phone number and website on every one.' },
        { title: 'Post', detail: 'Instagram and Facebook, on a calendar set by the season and the festivals: winter woollens, wedding wear, Chhath. Each theme goes out as a reel and a matching poster.' },
        { title: 'WhatsApp and the counter', detail: 'Enquiries land on WhatsApp. The order is billed in the operating system, and the customer\'s birthday, plan and app orders take over from there.' },
      ],
      creatives: [
        {
          title: 'Winter care',
          kind: 'reel',
          platform: 'Instagram reel',
          href: 'https://www.instagram.com/reel/Df7OIA0h9Jo/',
          src: '/case-studies/wb-ig-winter.webp',
          alt: 'A still from the Whites & Brights winter care reel: a woman in a warm-lit wardrobe reaching for a row of coats and jackets.',
          width: 640,
          height: 360,
          detail: 'An AI-generated cinematic clip, a woman choosing coats in a softly lit wardrobe, for dry cleaning of jackets, sweaters, blazers and woollens, with free pickup and delivery.',
          hook: 'Winter is Here! कपड़ों की देखभाल का समय आ गया है!',
          hookLang: 'hi',
          posted: 'November 2026',
        },
        {
          title: 'Wedding wear',
          kind: 'reel',
          platform: 'Instagram reel',
          href: 'https://www.instagram.com/reel/Df7MmPShnAg/',
          src: '/case-studies/wb-ig-wedding.webp',
          alt: 'A still from the Whites & Brights wedding wear reel: a woman in a red bridal saree touching the embroidered fabric.',
          width: 640,
          height: 360,
          detail: 'An AI-generated clip of a bride with her red saree, selling premium care for wedding sarees and designer lehengas as the keepers of a family\'s memories.',
          hook: 'कुछ कपड़े सिर्फ कपड़े नहीं, हमारी जिंदगी की अनमोल यादें होते हैं!',
          hookLang: 'hi',
          posted: 'November 2026',
        },
        {
          title: 'International Men\'s Day',
          kind: 'reel',
          platform: 'Instagram reel',
          href: 'https://www.instagram.com/reel/Df6nPe5B8XR/',
          src: '/case-studies/wb-ig-mensday.webp',
          alt: 'A still from the Whites & Brights Men\'s Day reel: a man buttoning a crisp white shirt.',
          width: 640,
          height: 1136,
          detail: 'A vertical AI-generated clip of a man buttoning a crisp white shirt: a day-of greeting that keeps the product, a pressed shirt, in the frame.',
          hook: 'हर जिम्मेदारी निभाने वाले हर पुरुष को सलाम!',
          hookLang: 'hi',
          posted: 'November 2026',
        },
        {
          title: 'Careers in laundry',
          kind: 'reel',
          platform: 'Instagram reel',
          href: 'https://www.instagram.com/reel/DfwzYbFsoxb/',
          src: '/case-studies/wb-ig-career.webp',
          alt: 'A still from the Whites & Brights careers reel: staff in branded aprons in a laundry plant lined with industrial washers.',
          width: 640,
          height: 1136,
          detail: 'A vertical AI-generated clip of a modern plant, staff in branded aprons beside industrial washers, launching the foundation and advanced training programmes.',
          hook: 'अब लॉन्ड्री इंडस्ट्री में बनाएं अपना करियर!',
          hookLang: 'hi',
          posted: 'November 2026',
        },
        {
          title: 'Learn the laundry business',
          kind: 'reel',
          platform: 'Instagram reel',
          href: 'https://www.instagram.com/reel/Dfwkbs4s34E/',
          src: '/case-studies/wb-ig-plant.webp',
          alt: 'A still from the Whites & Brights training reel: a row of steel front-loading washers in a bright laundry plant.',
          width: 640,
          height: 360,
          detail: 'A landscape AI-generated clip of a row of steel washers in a bright plant, for the training programme that teaches how to run a laundry and dry-cleaning business.',
          hook: 'सीखिए लॉन्ड्री बिजनेस की हर बारीकी!',
          hookLang: 'hi',
          posted: 'November 2026',
        },
        {
          title: 'Chhath Puja',
          kind: 'reel',
          platform: 'Instagram reel',
          href: 'https://www.instagram.com/reel/DfvqUGsBPZd/',
          src: '/case-studies/wb-ig-chhath.webp',
          alt: 'A still from the Whites & Brights Chhath Puja reel: a woman standing in the river at sunrise holding an offering.',
          width: 640,
          height: 360,
          detail: 'An AI-generated festival film: a woman in the river at sunrise holding an offering, posted alongside a matching greeting poster for Patna\'s biggest festival.',
          hook: 'Happy Chhath Puja!',
          hookLang: 'en',
          posted: 'November 2026',
        },
        {
          title: 'Franchise launch',
          kind: 'post',
          platform: 'Instagram post',
          href: 'https://www.instagram.com/p/Df7boNhBuAV/',
          src: '/case-studies/wb-ig-franchise.webp',
          alt: 'The Whites & Brights franchise poster in Hindi: own a premium laundry and dry-cleaning franchise, with investment, store size, AI-enabled software and customer app, and the WhatsApp number.',
          width: 1080,
          height: 1080,
          detail: 'A Hindi poster for the pan-India franchise. Among the reasons to join it lists the AI-enabled software and customer app: the operating system on this page.',
          hook: 'नौकरी नहीं, अब अपना ब्रांड बनाने का समय है!',
          hookLang: 'hi',
          posted: 'November 2026',
        },
        {
          title: 'Training programme',
          kind: 'post',
          platform: 'Instagram post',
          href: 'https://www.instagram.com/p/DfwkRBkMo4N/',
          src: '/case-studies/wb-ig-training.webp',
          alt: 'The Whites & Brights laundry training programme poster in Hindi, with a trainer and two students at a pressing table.',
          width: 1080,
          height: 1080,
          detail: 'The poster that pairs with the training reel: a trainer and students at a pressing table, the four things the course teaches, and the website and number.',
          hook: 'Learn Today, Lead Tomorrow!',
          hookLang: 'en',
          posted: 'November 2026',
        },
      ],
      creativesNote:
        'Stills captured from the public posts on @whitesandbrights.in on 19 November 2026. Tap any one to open the original on Instagram.',
      profiles: [
        { label: 'Instagram: @whitesandbrights.in', href: 'https://www.instagram.com/whitesandbrights.in/' },
        { label: 'Facebook: Whites & Brights', href: 'https://www.facebook.com/people/Whites-Brights/61577860892128/' },
        { label: 'Website: whitesandbrights.com', href: 'https://whitesandbrights.com' },
      ],
      cards: [
        { title: 'AI video for promos', detail: 'Cinematic clips made with AI video generation: the wardrobe, the bridal saree, the plant floor. No shoot, no studio, and a new film for every season and festival.' },
        { title: 'Animated explainers', detail: 'Short animations that show how free pickup and delivery work, how a monthly plan works, and how to order from the app.' },
        { title: 'Hindi first, English where it fits', detail: 'Captions and on-screen lines are written the way Patna customers talk, with the phone number and website on every post.' },
        { title: 'Branch and franchise launches', detail: 'Each new outlet gets its own launch content, and the franchise and training programmes have their own reels and posters.' },
        { title: 'The website and landing pages', detail: 'whitesandbrights.com carries the full price list, every outlet with its map link, franchise and associate pages, and a booking path on every page.' },
        { title: 'Local search basics', detail: 'A Google Business Profile for each outlet, linked from the site, with the same name, address, hours and number everywhere.' },
        { title: 'WhatsApp as the front door', detail: 'Every reel, poster and page ends on one WhatsApp number, and the site\'s WhatsApp button opens with a booking message already written.' },
      ],
      loop: {
        intro: 'The marketing and the operating system run on the same data, so a customer who arrives from a reel stays in the loop at the counter.',
        items: [
          { title: 'Offers made in HQ', detail: 'Head office creates an offer once. The counter, Brighty and the app apply it, and the next post announces it.' },
          { title: 'Birthday and anniversary wishes', detail: 'The dashboard lists upcoming dates with a one-tap WhatsApp wish that carries a ready-made offer.' },
          { title: 'Monthly plan renewals', detail: 'Plans expiring this week appear on the dashboard with a renewal offer to send on WhatsApp.' },
          { title: 'App orders', detail: 'Orders placed in the customer app land in the store panel, ready to assign a pickup rider.' },
        ],
      },
    },
    build: {
      heading: 'Discovery at the counter, then one screen at a time.',
      intro:
        'Whites & Brights is the worked example of how EchoPulse builds custom software: start from how the shop really works, map it to screens, and ship in short cycles that are tested at a real counter.',
      steps: [
        {
          title: 'Discovery with the owners and counter staff',
          detail: 'We started at the counter, not in a spec. How a bill was made, how prices were decided, how an order moved to the plant and back, and where the phone calls to head office came from.',
          points: ['Bills were slow, and prices varied between counters.', 'Staff phoned head office for every unusual item.', 'Owners saw each outlet only at month-end.'],
        },
        {
          title: 'Every workflow mapped to a screen',
          detail: 'Each job in the shop became a screen. That produced 13 store screens in four groups (counter, customers, back office, the app channel) and an HQ panel above them.',
          points: ['Dashboard, POS, sales list, status board, delivery list.', 'Customers, reports, expenses, monthly plans, supplies, app orders.', 'HQ: command centre, outlet comparison, alerts, Brighty training.'],
        },
        {
          title: 'Data model and roles',
          detail: 'Outlets, staff, customers, orders, plans and the catalogue, with three roles: counter staff, outlet managers and super admins. Row-level security means each outlet reads and changes only its own data.',
          points: ['Each outlet gets its own order series, like RKP-1216 and PSF-113.', 'Head office sees every outlet; an outlet sees only itself.'],
        },
        {
          title: 'The catalogue cleaned alongside the code',
          detail: 'The price list was rebuilt while the software was being built: more than 240 items per outlet, each findable by name, nickname or Hindi word. The team guide was written at the same time.',
          points: ['Catalogue changes ship as reviewed SQL scripts.', 'A backup is taken before every change.'],
        },
        {
          title: 'Short cycles, tested at the counter',
          detail: 'Build a screen, put it in front of counter staff, fix what slowed them down, repeat. The keyboard shortcuts and one-tap chips came from watching a busy counter.',
          points: ['/ to search, F2 to pay, F4 to save unpaid.', 'An empty POS search opens Brighty with the same words typed.'],
        },
        {
          title: 'An assistant grounded in the shop\'s own data',
          detail: 'Brighty answers only from the live catalogue, head-office rules and real past bills. It reads Hinglish with spelling mistakes, sound-alike words and number words, and recognises garment photos with a model that runs in the browser.',
          points: ['A question it cannot answer goes to HQ once.', 'HQ\'s answer is remembered for every outlet.'],
        },
        {
          title: 'Real-time across PCs and phones',
          detail: 'One responsive web app for the shop PC and the phone. A change on one screen shows on every other screen at once, and the app can be added to a phone\'s home screen.',
          points: ['Owners get the needs-attention list first on the phone.', 'Riders and staff use it on the move.'],
        },
        {
          title: 'Deployment and handover',
          detail: 'Every change goes live automatically from GitHub to Netlify. The launch came with the team guide and a clean price list, and head office runs prices, rules, offers and Brighty\'s answers from its own panel.',
          points: ['Code changes: GitHub to Netlify, no manual release.', 'Data changes: reviewed SQL scripts, backup first.'],
        },
      ],
      gets: [
        { title: 'One system instead of spreadsheets, phone calls and WhatsApp', detail: 'Billing, orders, delivery, customers, plans, stock and reports in one place, for every outlet.' },
        { title: 'Owners see every outlet live', detail: 'The HQ command centre shows collections, outstanding money, orders and alerts for each outlet, side by side.' },
        { title: 'Staff answer prices without calling HQ', detail: 'Brighty gives the price, its source and an Add to bill button, in the language the staff typed in.' },
        { title: 'No monthly AI fees', detail: 'The assistant and the photo recognition run in the browser on the shop\'s own PC, with no per-question charge.' },
      ],
    },
    buyerFit: {
      heading: 'If you run branches, counters and repeat customers, this is your shape.',
      intro:
        'Whites & Brights is a laundry, but the problem is common. Any business with more than one counter, staff in the field and customers who come back runs into the same walls.',
      businesses: [
        { title: 'Laundries and dry cleaners', detail: 'Long price lists, pickups, deliveries and monthly plans.' },
        { title: 'Salons and clinics', detail: 'Appointments, packages, repeat visits and staff at several branches.' },
        { title: 'Repair and service centres', detail: 'Job cards, parts, status updates and technicians on the road.' },
        { title: 'Rental shops', detail: 'What is out, what is due back, deposits and who still owes money.' },
        { title: 'Tuition and coaching centres', detail: 'Batches, fees, renewals and more than one centre.' },
        { title: 'Retail chains and distributors', detail: 'One price list for every counter, stock requests and a view of every branch.' },
      ],
      signs: [
        'The business runs on spreadsheets, phone calls and WhatsApp.',
        'Prices live in staff heads, so the same item costs different amounts at different counters.',
        'Staff phone the owner whenever something is not on the list.',
        'You chase the numbers at month-end instead of seeing them today.',
        'There are branches you cannot see without going there.',
      ],
    },
    working: {
      heading: 'Founder-led, scoped in writing, tested with your staff.',
      intro: 'Lakshya Soni, EchoPulse\'s founder, leads the build. This is the path every apps and software project follows.',
      steps: [
        { title: 'A free 15-minute call', detail: 'Tell Lakshya how your business runs today. He tells you what he would build first, and whether custom software is the right move at all.' },
        { title: 'A written scope before any work', detail: 'You get a written scope, a fixed price and a delivery date. If off-the-shelf software would do the job, we say so.' },
        { title: 'Short cycles with your staff', detail: 'Working screens every week, tried by the people who will use them, with what slowed them down fixed in the next cycle.' },
        { title: 'Launch with clean data', detail: 'The price list, the catalogue and the team guide are done alongside the code, so day one runs on correct data.' },
        { title: 'Handover and support', detail: 'The code moves to your GitHub with documentation and team training, and every build includes 14 days of free fixes. After that, hire us per change, keep us on a small retainer, or use any developer.' },
      ],
      risks: [
        { title: 'Standard, well-known tools', detail: 'React, Supabase and Netlify. Any competent developer can pick the code up.' },
        { title: 'Each branch\'s data kept apart', detail: 'Row-level security in the database: an outlet reads and changes only its own data.' },
        { title: 'No monthly AI fees', detail: 'The assistant runs in the browser, so there is no per-question bill from an AI provider.' },
        { title: 'You own the code', detail: 'On every apps and software build, the code lives in your GitHub and is yours once paid.' },
      ],
      source: { label: 'How the apps and software service works', href: '/services/apps-software' },
    },
    result: {
      figure: '$3,400+',
      label: 'saved in running costs and losses since launch, by EchoPulse\'s estimate with the client',
      basis: 'Estimate of operating costs and losses avoided since launch, shared by the founder; the breakdown is not published.',
      lines: [
        'Managing the outlets is no longer a daily headache for the owners.',
        'Ordering at the counter and between shops is simpler.',
      ],
    },
    about: {
      heading: 'About Whites & Brights',
      intro: 'What anyone can check about the client today, each line tied to the public page it comes from.',
      facts: [
        { label: 'Company', value: 'WNB Cleantech Pvt Ltd, a private company incorporated on 2 July 2025, registered with the Registrar of Companies, Patna.', sources: ['indiafilings', 'site'] },
        { label: 'Services', value: 'Laundry by the kilo, dry cleaning, steam ironing, shoe care, household items such as bedding, curtains and sofa covers, same-day express and monthly plans.', sources: ['services', 'play'] },
        { label: 'Pickup and delivery', value: 'Free doorstep pickup and delivery across Danapur and Phulwari Sharif, with a 48-hour standard turnaround.', sources: ['site'] },
        { label: 'Outlets and hours', value: 'Three outlets: Sona Market and R.K. Puram in Danapur, and Anandmai Colony in Phulwari Sharif. Each opens at 9 am; Sona Market closes at 7 pm, the other two at 9 pm.', sources: ['site', 'gbp', 'gbp2', 'gbp3'] },
        { label: 'Google ratings', value: '4.9 at Sona Market, 4.8 at R.K. Puram and 5.0 at Anandmai Colony, as shown on each outlet\'s Google Business Profile.', sources: ['gbp', 'gbp2', 'gbp3'] },
        { label: 'Customer app', value: 'An Android app on Google Play, published by WNB Cleantech, to book a pickup and track orders. The listing describes a brand serving customers through its own and franchise outlets.', sources: ['play'] },
        { label: 'Franchise and associates', value: 'A franchise programme in three formats (Smart Point, Prime Franchise and a Signature laundry hub with collection centres), with the brand\'s own POS and management software listed among the support, and an associate programme for new areas.', sources: ['franchise', 'associate'] },
        { label: 'Community', value: 'Do Roti, the brand\'s CSR initiative: weekly food drives for homeless and hungry people in Patna.', sources: ['csr'] },
      ],
      contact: [
        { label: 'Call the business line', href: 'tel:+918709319450' },
        { label: 'WhatsApp Whites & Brights', href: 'https://wa.me/918709319450' },
      ],
      sources: [
        { id: 'site', label: 'whitesandbrights.com', href: 'https://whitesandbrights.com', read: '19 November 2026' },
        { id: 'services', label: 'whitesandbrights.com: Services and prices', href: 'https://whitesandbrights.com/services', read: '19 November 2026' },
        { id: 'franchise', label: 'whitesandbrights.com: Franchise', href: 'https://whitesandbrights.com/franchise', read: '19 November 2026' },
        { id: 'associate', label: 'whitesandbrights.com: Become an associate', href: 'https://whitesandbrights.com/associate', read: '19 November 2026' },
        { id: 'csr', label: 'whitesandbrights.com: CSR, Do Roti', href: 'https://whitesandbrights.com/csr', read: '19 November 2026' },
        { id: 'gbp', label: 'Google Maps: Sona Market listing', href: 'https://maps.app.goo.gl/Q2hPJ1jRe2eEW4D66', read: '19 November 2026' },
        { id: 'gbp2', label: 'Google Maps: R.K. Puram listing', href: 'https://maps.app.goo.gl/1zTQ136dYz3fJzeLA', read: '19 November 2026' },
        { id: 'gbp3', label: 'Google Maps: Anandmai Colony listing', href: 'https://maps.app.goo.gl/Bpq5nYxFDE7kg3Vy8', read: '19 November 2026' },
        { id: 'play', label: 'Google Play: Whites and Brights app', href: 'https://play.google.com/store/apps/details?id=com.whitesandbrights.app', read: '19 November 2026' },
        { id: 'indiafilings', label: 'IndiaFilings: WNB Cleantech Private Limited', href: 'https://www.indiafilings.com/search/wnb-cleantech-private-limited-cin-U96010BR2025PTC077191', read: '19 November 2026' },
      ],
      note: 'whitesandbrights.com is built by EchoPulse; the facts quoted from it are the client\'s own. The phone and WhatsApp links are the business line printed on the client\'s site and Google listings.',
    },
    next: {
      heading: 'More builds and optimisation are planned with the client.',
      intro: 'EchoPulse is planning further builds and optimisation for Whites & Brights. Below are the areas we are working on with the client. They are plans, not delivered work, and no dates are promised.',
      areas: [
        { title: 'Growing the customer app', detail: 'More customers booking and tracking through the app that is already live on Google Play and already feeds the store panel.' },
        { title: 'More outlets on one system', detail: 'Each new outlet gets its own store panel and joins the same HQ view, so growth does not bring back the black box.' },
        { title: 'Onboarding franchise stores', detail: 'The franchise page offers franchisees the brand\'s own POS and management software. The work is making a new franchise store quick to bring onto it.' },
        { title: 'Tuning what is live', detail: 'Screens, Brighty and the marketing, adjusted to how staff and customers actually use them.' },
      ],
      note: 'Plans as of 19 November 2026. This section will be updated as work ships.',
    },
    faq: [
      { q: 'Who built the Whites & Brights system?', a: 'EchoPulse Media built it: Lakshya Soni, EchoPulse\'s founder, as product and engineering lead, with his partner Shaurya, EchoPulse\'s design lead, on design and marketing creative. The system has 13 store screens, an HQ panel and Brighty, an in-browser assistant in Hindi, Hinglish and English. EchoPulse also built the website, whitesandbrights.com, and runs the brand\'s AI-led marketing. Shaurya, EchoPulse\'s design partner, was later made a director of WNB Cleantech, the company behind Whites & Brights, in recognition of his work on the business.' },
      { q: 'What did the system save Whites & Brights?', a: 'More than US$3,400 in running costs and losses since launch, by EchoPulse\'s estimate with the client. The figure is an estimate of operating costs and losses avoided, shared by EchoPulse\'s founder; the breakdown is not published. The owners also say managing the outlets is no longer a daily headache, and ordering at the counter and between shops is simpler.' },
      { q: 'Can EchoPulse build a custom POS or CRM for my business?', a: 'Yes. The Whites & Brights system includes a point of sale, a customer directory with history and important dates, monthly plans, delivery lists and reports. EchoPulse builds the same kind of system around how your counters and branches work.' },
      { q: 'Does it work on phones?', a: 'Yes. It is one responsive web app for the shop PC and the phone. It opens in the browser, can be added to the home screen, and has large tap targets and a full-screen assistant.' },
      { q: 'Does the assistant cost money every month?', a: 'No. Brighty and its garment photo recognition run inside the browser on the shop\'s own PC, so there is no per-question charge from an AI provider.' },
      { q: 'Can it handle multiple branches?', a: 'Yes. Every outlet works in its own store panel with its own order series, and row-level security keeps each outlet\'s data separate. Head office sees every outlet live in the HQ panel, with alerts and a side-by-side comparison.' },
      { q: 'Can EchoPulse run the marketing too?', a: 'Yes. For Whites & Brights, EchoPulse runs AI-generated video, animated explainers, Hindi and English posts, the website and branch launch content, all built from the same catalogue the counter uses and all pointing to WhatsApp.' },
      { q: 'What is EchoPulse building next for Whites & Brights?', a: 'Further builds and optimisation are planned with the client. The areas are growth of the customer app, more outlets on the same system, and onboarding franchise stores, which the brand\'s franchise page already offers with its own POS and management software. These are plans, not delivered work.' },
      { q: 'Is there a customer app?', a: 'Yes. EchoPulse also built the Whites & Brights Android app on Google Play. Orders placed in it land in the store panel\'s App orders screen, ready to be assigned a pickup driver, and it reads the same catalogue and prices as the counter. It has its own case study: the Whites & Brights customer app.' },
      { q: 'How do I start?', a: 'Book a free 15-minute call. Tell Lakshya how your business runs today; he will tell you what he would build first. You then get a written scope, a fixed price and a delivery date before any work starts.' },
    ],
  },
};

/**
 * Whites & Brights customer app. The Android app EchoPulse built, and the
 * customer side of the operating system above.
 *
 * Sources, all read 19 November 2026: the Google Play listing and its data
 * safety page (com.whitesandbrights.app), the client's live site (homepage
 * app section, FAQ, account deletion page), the brand's public Instagram
 * franchise post, an App Store search, and the operating system study above,
 * which carries the facts from EchoPulse's walkthrough document for the
 * owner. No usage, order or revenue figure is claimed: the listing's
 * downloads bracket is the only usage number and it is quoted as shown.
 * The developer contact email, phone and address on the listing are not
 * reproduced anywhere on the page.
 */
const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.whitesandbrights.app';
const PLAY_READ = '19 November 2026';

const whitesBrightsApp: CaseStudy = {
  slug: 'whites-and-brights-customer-app',
  shortName: 'Whites & Brights app',
  crumbLabel: 'Whites & Brights customer app',
  callLine: 'Tell Lakshya how your customers order today; he will tell you whether an app is the right next step.',
  credits: [
    { name: 'Lakshya Soni', role: 'Founder, EchoPulse Media. Engineering lead.', href: '/about/lakshya-soni', isAuthor: true },
    { name: 'Shaurya', role: 'Partner and design lead, EchoPulse Media. App design. Later made a director of WNB Cleantech, the company behind Whites & Brights, in recognition of his work on the business.' },
  ],
  schemaMentions: ['Mobile app', 'Android', 'Google Play', 'Online ordering', 'Pickup and delivery booking', 'Live order tracking'],
  partOf: {
    heading: 'This app is the customer side of one system.',
    body: 'Every order placed in the app lands in the store panel EchoPulse built for Whites & Brights, ready to be assigned a pickup driver. The operating system case study covers that side: the counter, the HQ panel, Brighty, and the savings estimate made with the client.',
    href: '/case-studies/whites-and-brights-operating-system',
    linkLabel: 'Read the operating system case study',
    here: { name: 'Customer app', detail: 'Android, on Google Play: book, track, pay' },
    there: { name: 'Operating system', detail: 'Counter, orders, drivers, HQ and Brighty' },
  },
  heroLede:
    'The Android app Whites & Brights customers use to book a doorstep pickup, follow their order and see the bill before it is collected. EchoPulse built it and wired it into the store system the outlets already run.',
  indexTags: ['Android app', 'Google Play', 'Live tracking', 'Linked to the store panel'],
  indexLead: { value: 'Live', label: 'on Google Play since 1 October 2026, with every order landing in the store panel' },
  heroMedia: {
    src: '/case-studies/wba-home.webp',
    alt: 'The Whites & Brights app home screen: next free pickup tomorrow 8 to 10 AM, a search box, an "Expert care for every fabric" banner, service tiles and popular items.',
    width: 720,
    height: 1440,
    caption: 'The Whites & Brights app home screen, from the Google Play listing, read 19 November 2026.',
  },
  resultLine:
    'Result: a customer app live on Google Play whose orders land in the store panel ready for a pickup driver, on the same price list as the counter.',
  answer: [
    'EchoPulse Media built the Android customer app for Whites & Brights, a premium laundry and dry-cleaning chain in Patna, India, run by WNB Cleantech Pvt Ltd. Customers sign in with a WhatsApp code, choose items and a pickup slot, place the request and follow the order to their door; the app is live on Google Play as "Whites and Brights", version 1.3.1, updated 18 October 2026.',
    'Each app order lands in the store panel of the operating system EchoPulse built for the chain, ready to be assigned a pickup driver, and the app, the counter and Brighty read the same catalogue and prices. Lakshya Soni, EchoPulse\'s founder, led the engineering; his partner Shaurya, EchoPulse\'s design lead, led the design.',
    'The app was released on Google Play on 1 October 2026 and updated on 18 October 2026, and it is the customer channel of the same system the counters and head office run on.',
  ],
  keyFacts: [
    { label: 'Client', value: 'Whites & Brights (whitesandbrights.com), WNB Cleantech Pvt Ltd, Patna, India', href: 'https://whitesandbrights.com' },
    { label: 'The app', value: 'Whites and Brights, an Android app on Google Play (package com.whitesandbrights.app). Free, Android 7.0 and up.', href: PLAY_URL },
    { label: 'Built by', value: 'EchoPulse Media: Lakshya Soni, founder (engineering lead), with his partner Shaurya, EchoPulse\'s design lead (app design). Disclosure: Shaurya, EchoPulse\'s design partner, was later made a director of WNB Cleantech, the company behind Whites & Brights, in recognition of his work on the business.' },
    { label: 'Listing', value: `Offered by Whites and Brights; developer account WNB Cleantech Private Limited, Patna, Bihar. Category Lifestyle, rated for 3+. Released 1 October 2026, updated 18 October 2026, version 1.3.1. Source: Google Play, read ${PLAY_READ}.` },
    { label: 'What customers do in it', value: 'Sign in with a phone number and a 6-digit WhatsApp code, choose a service and a pickup slot, save home and work addresses, track orders in real time, see past orders and invoices, apply offers and coupon codes, and pay cash on delivery.' },
    { label: 'How it connects', value: 'App orders land in the store panel\'s App orders screen, ready to be assigned a pickup driver. Staff and customers can follow the rider on a map. The app, the counter and Brighty read the same catalogue and prices. HQ manages app customers and runs offers.' },
    { label: 'Data safety', value: `As declared by the developer: no data shared with third parties; collects precise location and name, address and phone number; data encrypted in transit; deletion on request. Source: Google Play data safety, read ${PLAY_READ}.` },
    { label: 'iPhone', value: `No App Store listing found for the brand or the developer on ${PLAY_READ}. The app is Android only.` },
    { label: 'Stack', value: 'The app\'s own framework is not published here. It is connected to the same real-time back end as the store system (Supabase, with real-time updates), so an order shows in the store panel as it is placed.' },
    { label: 'Result', value: 'A live customer app whose orders arrive in the store panel, structured and ready for a driver, on one price list shared with the counter.' },
    { label: 'Data source', value: `The Google Play listing and data safety page, the client's live site (homepage, FAQ and account deletion page), the brand's public Instagram, an App Store search, and the operating system case study, all read ${PLAY_READ}.` },
    { label: 'Last updated', value: PLAY_READ },
  ],
  indexResult:
    'For Whites & Brights, a laundry chain in Patna, EchoPulse built the Android customer app on Google Play: customers book a pickup and track it, and every order lands in the store panel ready for a driver.',
  measurement: {
    tool: `The Google Play listing for com.whitesandbrights.app and its data safety page, loaded in a browser on ${PLAY_READ}; the client's live site, whitesandbrights.com (homepage app section, FAQ and account deletion page), read the same day; an App Store search for the brand and the developer; the brand's public Instagram posts; and the operating system case study, which carries the facts from EchoPulse's walkthrough document for the owner.`,
    dateRanges: `Everything on this page was read on ${PLAY_READ}. The listing showed version 1.3.1, updated 18 October 2026, released 1 October 2026.`,
    counted: 'Listing values exactly as Google Play showed them: version, dates, Android requirement, category, content rating, the data safety summary and the "What\'s new" text. The eight screenshots are the official listing screenshots, downloaded full size from Google Play and converted to WebP.',
    notCounted: 'Prices visible inside the listing screenshots are the client\'s own as shown there.',
    extra: [
      { label: 'Disclosure', value: 'An EchoPulse partner is a director of the client company. Shaurya, EchoPulse\'s design partner, was later made a director of WNB Cleantech, the company behind Whites & Brights, in recognition of his work on the business.' },
    ],
  },
  relatedService: { slug: 'apps-software', label: 'How the apps and software service works' },
  fit: {
    suits: [
      'Customers book you by phone or WhatsApp, and someone types each order in again.',
      'You collect from customers\' doors or deliver to them, and they ask where their order is.',
      'You already run a store or order system, or plan one, and want app orders to land in it.',
      'Your prices must match at the counter, in the app and in what staff quote.',
    ],
  },
  client: 'Whites & Brights',
  organizationName: 'Whites & Brights',
  clientUrl: 'https://whitesandbrights.com',
  clientTagline:
    'Premium laundry and dry cleaning in Patna, India, run by WNB Cleantech Pvt Ltd. Three outlets, free doorstep pickup and delivery, and an Android customer app on Google Play.',
  industry: 'Laundry and dry cleaning, customer app',
  icpKey: 'business-owners',

  metaTitle: 'Whites & Brights: The Customer App',
  metaDescription:
    'How EchoPulse built the Whites & Brights Android app: book a pickup, track it live, and every order lands in the store panel ready for a driver.',

  eyebrow: 'Case study',
  headline: 'Book a pickup in a tap.',
  headlineAccent: 'The store already knows.',
  summary:
    'Whites & Brights is a premium laundry and dry-cleaning chain in Patna that collects from customers\' doors and delivers back. EchoPulse built its Android customer app, live on Google Play since 1 October 2026. A customer signs in with a WhatsApp code, picks items by the piece or by the kilo, chooses a pickup slot and places the request. The order lands in the store panel of the operating system EchoPulse also built, ready to be assigned a pickup driver, and staff and the customer can follow the rider on a map. The app, the counter and Brighty read the same catalogue and prices, and head office runs the offers the app applies.',
  tldr: [
    'What it is: the Whites & Brights Android app on Google Play, built by EchoPulse, version 1.3.1, updated 18 October 2026.',
    'For the customer: sign in with WhatsApp, pick items and a pickup slot, track the order live, pay cash on delivery.',
    'For the business: orders land in the store panel ready for a pickup driver, on the same price list as the counter and Brighty.',
    'Platform: Android, on Google Play since 1 October 2026. Orders flow straight into the store panel the outlets already use.',
  ],

  windowLabel: 'Released 1 October 2026',
  windowStartISO: '2026-10-01',
  windowEndISO: '2026-11-19',
  publishedISO: '2026-11-19',

  services: ['Android app', 'App design', 'Ordering and pickup booking', 'Live order tracking', 'Store panel integration', 'Google Play release'],

  heroMetrics: [
    { value: '5', label: 'steps from sign-in to delivery', note: 'As the Google Play listing sets them out' },
    { value: '2-hour', label: 'pickup slots, chosen in the app', note: 'From the listing screenshots' },
    { value: '1', label: 'price list for the app, the counter and Brighty', note: 'From the operating system case study' },
  ],

  atAGlance: [
    { label: 'Platform', value: 'Android 7.0 and up, on Google Play. No iPhone version.' },
    { label: 'Linked to', value: 'The Whites & Brights store panel and HQ panel, built by EchoPulse' },
  ],

  situation: {
    headline: 'Pickup orders came in by phone.',
    body: ['Before the app channel, orders for a pickup came in by phone and had to be put into the system by hand.'],
    failures: [
      { title: 'Orders by phone', detail: 'App orders and stock requests came in by phone; now both arrive as lists to approve and assign.' },
    ],
  },

  workstreams: [],
  proof: [],

  midCtaText:
    'Taking orders on calls and WhatsApp and typing them in again? Tell Lakshya how your customers order today; he will tell you whether an app, a booking page or neither is the right next step.',
  closeText:
    'Tell Lakshya how your customers order and how the order reaches your team today. He will tell you what he would build first, and say plainly when WhatsApp and a booking page are enough.',
  openProblemsAccent: 'and what comes next.',
  openProblems: [],

  notApplicable: [
    {
      title: 'There is no system behind the app',
      detail: 'An app that only sends a message to staff brings back the re-typing it was meant to remove. This one works because its orders land in a store panel with drivers, statuses and one price list.',
    },
    {
      title: 'You need iPhone on day one',
      detail: 'This build is Android only, on Google Play. If most of your customers are on iPhone, plan for that from the start.',
    },
    {
      title: 'A handful of orders a week',
      detail: 'A WhatsApp number and a booking page may be all you need. We would say so on the call.',
    },
    {
      title: 'Nobody to assign the pickups',
      detail: 'The app puts the order in front of the store; someone still has to assign a driver. Without that person, the app makes a promise the shop cannot keep.',
    },
  ],

  app: {
    storeUrl: PLAY_URL,
    storeLabel: 'Get it on Google Play',
    icon: { src: '/case-studies/wba-icon.webp', alt: 'The Whites and Brights app icon.', width: 256, height: 256 },
    heroScreens: [
      {
        src: '/case-studies/wba-schedule.webp',
        alt: 'Schedule a pickup: a searchable list of items by the piece or by the kilo, with service filters, Express 1.6x tags, quantity steppers and a bar showing 2 items, ₹358 estimated total.',
        width: 720,
        height: 1440,
      },
      {
        src: '/case-studies/wba-home.webp',
        alt: 'The app home screen: next free pickup tomorrow 8 to 10 AM at the R.K. Puram outlet, a search box, a banner, service tiles and popular items.',
        width: 720,
        height: 1440,
      },
      {
        src: '/case-studies/wba-review.webp',
        alt: 'Review and schedule: the items, offers and savings with a coupon field, a bill summary with free pickup and delivery and cash on delivery, and a Place request button.',
        width: 720,
        height: 1440,
      },
    ],
    heroCaption: `Official screenshots from the Google Play listing, read ${PLAY_READ}.`,
    flow: {
      heading: 'One order, from the customer\'s phone to the store and back to the door.',
      intro:
        'The app is not a separate shop window. It is the customer\'s side of the same system the outlets run, so an order placed on a phone is already in front of the store.',
      steps: [
        { where: 'Customer app', title: 'Request placed', detail: 'The customer picks items, a pickup slot and a saved address, and taps Place request.', sources: ['play', 'shots'] },
        { where: 'Store panel', title: 'Lands in App orders', detail: 'The order appears in the store panel, ready to be assigned a pickup driver.', sources: ['os'] },
        { where: 'Pickup driver', title: 'Driver assigned, rider on the map', detail: 'Staff assign a driver from one list. Staff and the customer can follow the rider on a map.', sources: ['os'] },
        { where: 'Outlet and plant', title: 'Cleaned and tracked', detail: 'The order moves across the status board until it is ready, and the customer follows its status in the app.', sources: ['os', 'faq'] },
        { where: 'Doorstep', title: 'Delivered back', detail: 'Fresh clothes come back to the door. Payment is cash on delivery, and past orders and invoices stay in the app.', sources: ['play', 'shots'] },
      ],
      hq: {
        title: 'Head office, flowing back to the customer',
        detail: 'HQ runs offers once and the app applies them through its Offers tab and coupon field. HQ also manages app customers, and sees app orders waiting for a driver as an alert for each outlet.',
        sources: ['os', 'shots'],
      },
      catalogue: {
        title: 'One catalogue and one price list, everywhere',
        detail: 'The app, the counter and Brighty all read the same catalogue and prices. HQ edits a price once, in one place.',
        sources: ['os'],
      },
    },
    tour: {
      intro: `The eight official screenshots from the Google Play listing, read ${PLAY_READ}, in the order a new customer meets them. For each: what the customer does, and what it triggers behind the scenes.`,
      intro3: [
        {
          title: 'We come to your door',
          src: '/case-studies/wba-onboard-pickup.webp',
          alt: 'Onboarding screen one, Free pickup: "We come to your door", with an illustrated rider on a scooter. Pick a 2-hour slot and our rider collects your clothes.',
          width: 720,
          height: 1440,
          customer: 'The first promise: pick a 2-hour slot and a rider collects the clothes.',
          behind: 'That slot is what the store sees when the order lands, waiting for a driver.',
          sources: ['shots', 'os'],
        },
        {
          title: 'Cleaned right, every fabric',
          src: '/case-studies/wba-onboard-care.webp',
          alt: 'Onboarding screen two, Expert care: "Cleaned right, every fabric", with an illustrated washing machine. Wash and fold, dry clean, steam press, shoes and more, handled by the outlet team.',
          width: 720,
          height: 1440,
          customer: 'Wash and fold, dry cleaning, steam press and shoes, handled by the outlet team.',
          behind: 'The work is done by the same outlets that bill walk-in customers.',
          sources: ['shots'],
        },
        {
          title: 'Track it live',
          src: '/case-studies/wba-onboard-tracking.webp',
          alt: 'Onboarding screen three, Live tracking: "Track it live, get it fresh", with an illustrated map and route. Follow every step from pickup to delivery in the app.',
          width: 720,
          height: 1440,
          customer: 'Follow every step from pickup to delivery, in the app.',
          behind: 'Staff and the customer can follow the rider on a map.',
          sources: ['shots', 'os'],
        },
      ],
      screens: [
        {
          title: 'Sign in with WhatsApp',
          src: '/case-studies/wba-login.webp',
          alt: 'The sign-in screen: "Fresh clothes, delivered." A mobile number field with +91, a Continue button and the note that a 6-digit code is sent on WhatsApp.',
          width: 720,
          height: 1440,
          customer: 'A mobile number and a 6-digit code sent on WhatsApp. No password to remember.',
          behind: 'The phone number is the customer\'s account. HQ manages app customers from its own panel, and the account can be deleted from Profile in the app.',
          sources: ['play', 'shots', 'os', 'delete'],
        },
        {
          title: 'Home',
          src: '/case-studies/wba-home.webp',
          alt: 'The home screen: next free pickup tomorrow 8 to 10 AM at the R.K. Puram outlet, search, an "Expert care for every fabric" banner, service tiles, popular items and a round assistant button.',
          width: 720,
          height: 1440,
          customer: 'The next free pickup slot sits at the top, with the nearest outlet. Search, services and popular items below.',
          behind: 'The round button is Brighty. Version 1.3.1 made the Brighty assistant button always visible.',
          sources: ['shots', 'play'],
        },
        {
          title: 'Shop by service',
          src: '/case-studies/wba-services.webp',
          alt: 'Shop by service: eight tiles for wash and fold, wash and iron, dry clean, steam press, shoe care, home and linen, premium care and more services, then popular items priced per piece and an Express banner.',
          width: 720,
          height: 1440,
          customer: 'Eight service tiles, popular items priced per piece, and an Express option for when it is needed tomorrow.',
          behind: 'Every item and price comes from the same catalogue the counter bills from. HQ edits it once.',
          sources: ['shots', 'os'],
        },
        {
          title: 'Schedule a pickup',
          src: '/case-studies/wba-schedule.webp',
          alt: 'Schedule a pickup: items such as kurta, wash and iron per kg, wash and fold per kg and steam iron, with customer favourite tags, Express 1.6x labels, quantity and weight steppers, and a running total.',
          width: 720,
          height: 1440,
          customer: 'Add items by the piece or by the kilo, filter by service, mark Express, and watch the running total.',
          behind: 'The order arrives itemised, so nobody in the store re-types it from a phone call.',
          sources: ['shots', 'os'],
        },
        {
          title: 'Review and place the request',
          src: '/case-studies/wba-review.webp',
          alt: 'Review and schedule: your items, offers and savings with one discount per order, coins and a coupon code field, a bill summary with free pickup and delivery, cash on delivery, and a Place request button. The final price is confirmed at pickup.',
          width: 720,
          height: 1440,
          customer: 'Items, one offer per order, coins and a coupon code, then a clear estimate. Pickup and delivery are free; payment is cash on delivery.',
          behind: 'Place request sends the order to the store panel, ready for a pickup driver. The final price is confirmed at pickup after the team checks the items.',
          sources: ['shots', 'os'],
        },
      ],
    },
    listing: {
      heading: 'What the Google Play listing says',
      intro: `Read on ${PLAY_READ}. Values exactly as Google Play showed them.`,
      name: 'Whites and Brights',
      developer: 'Whites and Brights · WNB Cleantech Private Limited, Patna',
      facts: [
        { label: 'Version', value: '1.3.1' },
        { label: 'Updated', value: '18 Oct 2026' },
        { label: 'Released', value: '1 Oct 2026' },
        { label: 'Requires', value: 'Android 7.0 and up' },
        { label: 'Rating', value: 'None shown' },
        { label: 'Category', value: 'Lifestyle' },
        { label: 'Content rating', value: 'Rated for 3+' },
      ],
      whatsNew: 'Fresh look and fixes: new logo, aligned buttons, and the Brighty assistant button is now always visible.',
      dataSafety: [
        'No data shared with third parties',
        'Collects precise location, and name, address and phone number',
        'Data is encrypted in transit',
        'You can request that data be deleted',
      ],
      features: [
        'Doorstep pickup and delivery at a time that suits the customer',
        'Wash and fold, wash and iron, dry cleaning, steam ironing and household items',
        'Log in with a phone number and a WhatsApp code',
        'Save several addresses for home and work',
        'Track orders in real time',
        'View past orders and invoices',
        'Updates on pickups and deliveries',
      ],
      read: PLAY_READ,
      note: 'The listing describes Whites & Brights as a growing laundry brand serving customers through its own and franchise outlets. The developer\'s contact details on the listing are not reproduced here.',
    },
    gains: {
      customer: [
        { title: 'Ordering in a few taps', detail: 'Pick items by the piece or the kilo, choose a slot, place the request.', sources: ['play', 'shots'] },
        { title: 'Pickup at the door, free', detail: 'A rider collects in the chosen 2-hour slot and brings it back; pickup and delivery show as free on the bill.', sources: ['shots'] },
        { title: 'Tracking from pickup to delivery', detail: 'Order status live in the app, and the rider on a map.', sources: ['play', 'site', 'faq', 'os'] },
        { title: 'Offers in the app', detail: 'An Offers tab, one discount per order, coins and coupon codes, applied at review.', sources: ['shots'] },
        { title: 'The price before the pickup', detail: 'An estimate before placing the request, confirmed at pickup once the team checks the items. Past orders and invoices stay in the app.', sources: ['shots', 'play'] },
      ],
      business: [
        { title: 'Orders arrive structured', detail: 'Items, quantities, slot and address come in together, in the store panel\'s App orders list.', sources: ['os', 'shots'] },
        { title: 'No phone-call orders to re-type', detail: 'App orders used to come in by phone. Now they arrive as a list to assign.', sources: ['os'] },
        { title: 'Drivers assigned from one list', detail: 'Each app order waits for a pickup driver in one place, and HQ sees any left waiting as an alert.', sources: ['os'] },
        { title: 'One price list', detail: 'The app, the counter and Brighty read the same catalogue, so a customer sees the price the counter charges.', sources: ['os'] },
        { title: 'Offers run from HQ', detail: 'Head office creates an offer once; the counter, Brighty and the app apply it.', sources: ['os'] },
        { title: 'Part of the franchise offer', detail: 'The brand\'s franchise post lists the AI-enabled software and customer app among what a franchisee gets.', sources: ['ig'] },
      ],
    },
    build: {
      heading: 'Built as the customer side of the store system, not beside it.',
      intro:
        'The app was designed around what the store needs to receive, then made simple enough for a first-time customer to finish an order.',
      steps: [
        { title: 'Two ends of one flow', detail: 'The app and the store panel\'s App orders screen were built as two ends of the same order: the app sends what the store needs to act on, itemised, with a slot and an address, and the store assigns a pickup driver.' },
        { title: 'Design for a first order', detail: 'Shaurya led the design: three illustrated welcome screens, a WhatsApp code instead of a password, service tiles, and a review screen that shows the estimate and how the final price is set.' },
        { title: 'One back end with the counter', detail: 'Lakshya led the engineering. The app is connected to the same real-time back end as the store system, so it reads the same catalogue and prices and its orders show in the store panel as they are placed.' },
        { title: 'Tried with the client', detail: 'The app was tested with the client before release, the same short-cycle way the store system was built with the owners.' },
        { title: 'Released and kept current', detail: 'Released on Google Play on 1 October 2026, with a data safety declaration and an account deletion path in the app and on the client\'s site. Version 1.3.1 followed on 18 October 2026.' },
      ],
      facts: [
        { name: 'Platform', detail: 'Android 7.0 and up, distributed on Google Play.' },
        { name: 'Sign-in', detail: 'Phone number with a 6-digit code on WhatsApp.' },
        { name: 'Back end', detail: 'The same real-time back end as the store system (Supabase, with real-time updates).' },
        { name: 'Privacy', detail: 'No data shared with third parties, encrypted in transit, deletion on request, as declared on the listing.' },
      ],
      note: 'The app\'s own framework and libraries are not published on this page. What is stated is what the listing, the client\'s site and the store system\'s documentation support.',
    },
    buyerFit: {
      heading: 'If customers book you by phone or WhatsApp, an app can be the front door.',
      intro:
        'Whites & Brights is a laundry, but the shape is common: a customer asks for something to be collected, delivered or done at a time, and a team has to pick it up from there.',
      businesses: [
        { title: 'Laundries and dry cleaners', detail: 'Pickup slots, items by the piece or the kilo, delivery back.' },
        { title: 'Repair and service centres', detail: 'Pickups, job status and technicians on the road.' },
        { title: 'Salons and clinics', detail: 'Bookings by slot, repeat customers and several branches.' },
        { title: 'Home services', detail: 'A visit booked for a slot, someone assigned, the customer kept informed.' },
        { title: 'Rental shops', detail: 'What is booked, when it goes out and when it comes back.' },
        { title: 'Local food and grocery', detail: 'Orders for pickup or delivery from more than one outlet.' },
      ],
      signs: [
        'Orders come in on calls and WhatsApp, and someone types them in again.',
        'Customers ask "where is my order?" more than once a day.',
        'Drivers or staff are assigned from memory or a group chat.',
        'The price a customer is told is not always the price the counter charges.',
        'You already run a store system, or are about to, and want orders to land in it.',
      ],
      note: 'Store app or installable web app? EchoPulse has shipped both for this client: the store system opens in the browser and installs to the home screen, and this customer app is on Google Play. Which one fits you is a question for the call.',
    },
    working: {
      heading: 'Founder-led, scoped in writing, tested with your team.',
      intro: 'Lakshya Soni, EchoPulse\'s founder, leads the build. This is the path every apps and software project follows.',
      steps: [
        { title: 'A free 15-minute call', detail: 'Tell Lakshya how your customers order today. He tells you what he would build first, and whether custom software is the right move at all.' },
        { title: 'A written scope before any work', detail: 'You get a written scope, a fixed price and a delivery date. If off-the-shelf software would do the job, we say so.' },
        { title: 'Working screens every week', detail: 'Real screens you can click through, tried by the people who will use them, with what slowed them down fixed in the next cycle.' },
        { title: 'Launch with clean data', detail: 'The catalogue and prices are done alongside the code, so day one runs on correct data.' },
        { title: 'Handover and support', detail: 'The code moves to your GitHub with documentation and team training, and every build includes 14 days of free fixes. After that, hire us per change, keep us on a small retainer, or use any developer.' },
      ],
      risks: [
        { title: 'One back end, not two', detail: 'The app and the counter share one catalogue and one order list, so nothing is copied across by hand.' },
        { title: 'Privacy declared', detail: 'For this app: no data shared with third parties, encrypted in transit, and a deletion path in the app and on the site.' },
        { title: 'You own the code', detail: 'On every apps and software build, the code lives in your GitHub and is yours once paid.' },
        { title: 'Fixed price, in writing', detail: 'A written scope, a fixed price and a delivery date before any work starts.' },
      ],
      source: { label: 'How the apps and software service works', href: '/services/apps-software' },
    },
    faq: [
      { q: 'Who built the Whites & Brights app?', a: 'EchoPulse Media built it: Lakshya Soni, EchoPulse\'s founder, led the engineering, and his partner Shaurya, EchoPulse\'s design lead, led the design. EchoPulse also built the operating system the app\'s orders land in, and the website, whitesandbrights.com. Shaurya, EchoPulse\'s design partner, was later made a director of WNB Cleantech, the company behind Whites & Brights, in recognition of his work on the business.' },
      { q: 'Where can customers download it?', a: 'On Google Play, as "Whites and Brights", for Android 7.0 and up. The client\'s site links to it from every page. No App Store listing was found on 19 November 2026, so there is no iPhone version.' },
      { q: 'How does an app order reach the store?', a: 'It lands in the store panel\'s App orders screen, ready to be assigned a pickup driver. The app is connected to the same real-time back end as the store system, so nobody re-types it from a call.' },
      { q: 'Can customers track the rider?', a: 'Yes. The listing says orders can be tracked in real time, the client\'s FAQ says every order can be followed live in the app, and in the store system staff and customers can follow the rider on a map.' },
      { q: 'Does the app use the same prices as the counter?', a: 'Yes. The app, the counter and Brighty read the same catalogue and prices, and head office edits them in one place. In the app, the total is an estimate until the team checks the items at pickup.' },
      { q: 'How do customers sign in?', a: 'With their mobile number and a 6-digit code sent on WhatsApp. They can delete the account from Profile in the app, or ask on WhatsApp after uninstalling.' },
      { q: 'What data does the app collect?', a: 'As declared on Google Play: precise location, and name, address and phone number. No data is shared with third parties, data is encrypted in transit, and customers can request deletion.' },
      { q: 'Can EchoPulse build an app like this for my business?', a: 'Yes, where it fits. The app works because its orders land in a store system with drivers, statuses and one price list. On the call, Lakshya will tell you whether a store app, an installable web app or just a booking page is the right first step.' },
      { q: 'How do I start?', a: 'Book a free 15-minute call. Tell Lakshya how your customers order today; you then get a written scope, a fixed price and a delivery date before any work starts.' },
    ],
    sources: [
      { id: 'play', label: 'Google Play: Whites and Brights (com.whitesandbrights.app)', href: PLAY_URL, read: PLAY_READ },
      { id: 'shots', label: 'Google Play: the eight official listing screenshots', href: PLAY_URL, read: PLAY_READ },
      { id: 'safety', label: 'Google Play: data safety for Whites and Brights', href: 'https://play.google.com/store/apps/datasafety?id=com.whitesandbrights.app', read: PLAY_READ },
      { id: 'site', label: 'whitesandbrights.com: homepage, "The app, now live"', href: 'https://whitesandbrights.com', read: PLAY_READ },
      { id: 'faq', label: 'whitesandbrights.com: FAQ, "How do I track my order?"', href: 'https://whitesandbrights.com/faq', read: PLAY_READ },
      { id: 'delete', label: 'whitesandbrights.com: Delete your account', href: 'https://whitesandbrights.com/delete-account', read: PLAY_READ },
      { id: 'ig', label: 'Instagram: franchise post listing the AI-enabled software and customer app', href: 'https://www.instagram.com/p/Df7boNhBuAV/', read: PLAY_READ },
      { id: 'os', label: 'EchoPulse: the Whites & Brights operating system case study, from the walkthrough written for the owner', href: '/case-studies/whites-and-brights-operating-system', read: PLAY_READ },
    ],
    sourcesNote: 'Disclosure: an EchoPulse partner is a director of the client company. App Store: a search for the brand and for WNB Cleantech returned no listing on 19 November 2026. Of the brand\'s recent public Instagram posts, only the franchise post mentions the app.',
  },
};

export const caseStudies: CaseStudy[] = [magicbnb, whitesBrights, whitesBrightsApp, workingWithGod, founderStory];

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
  // A software build has no export or before screen: its main product screen
  // is the image that carries the argument.
  if (study.heroShot) return { src: study.heroShot.src, caption: study.heroShot.caption ?? study.heroShot.alt };
  return null;
}
