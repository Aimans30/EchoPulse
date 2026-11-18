import type { IcpKey } from './videos';
import { nicheH1, type NicheServiceSlug } from './nicheIndex';
import { FREE_SAMPLE, PILOT, PRESENCE, GROWTH, FULL_SYSTEM, PROMISES, type Plan } from './pricing';

/**
 * Niche-plus-service landing pages: /[icp]/[service].
 *
 * These match how buyers search Google and ask ChatGPT ("video editor for real
 * estate agents", "LinkedIn ghostwriter for coaches"). Each entry is written by
 * hand for that buyer. Nothing here is a template with the niche name swapped:
 * the deliverables, steps, price-table wording, proof and FAQ differ per page.
 *
 * Facts come from lib/pricing.ts (every price and plan), lib/icpData.ts,
 * lib/serviceData.ts, lib/caseStudyData.ts, lib/videos.ts and public/llms.txt.
 * Prices are never typed as numbers in the price table: the table reads the
 * Plan objects. Where a sentence quotes a price it interpolates the constant.
 *
 * Only the 13 combinations in NICHE_PAGES exist. app/[icp]/[service]/page.tsx
 * sets dynamicParams = false, so every other combination 404s.
 *
 * Source conflicts found while writing: serviceData used to say ad creatives
 * were 8 to 12 a month and LinkedIn 16 to 20 posts. Both were corrected to the
 * ladder in lib/pricing.ts (6 ad creatives on Growth, 4 static and 2 video; 8
 * photo or carousel posts on Presence Engine, 20 social posts on Growth).
 *   - The LinkedIn onboarding interview is 90 minutes on the service page and
 *     the Pilot strategy session is 60 minutes. The ghostwriting pages give no
 *     minutes for the interview so they never contradict the Pilot line.
 */

export type { NicheServiceSlug };

export interface NicheFaq {
  q: string;
  a: string;
}

export interface NicheStep {
  title: string;
  body: string;
}

export interface NicheLadder {
  free: string;
  pilot: string;
  presence: string;
  growth: string;
  custom: string;
}

export interface NicheProof {
  /** Short heading above the proof block. */
  heading: string;
  /** What is true, in plain sentences. Never a client result we do not have. */
  paragraphs: string[];
  /** Links shown under the paragraphs. */
  links: { href: string; label: string }[];
  /** Show sample clip posters for this icp (from lib/videos.ts wallClips). */
  showClips: boolean;
  /** One line under the clip row saying what the clips are and are not. */
  clipsNote?: string;
}

export interface NicheBlogPost {
  slug: string;
  title: string;
}

export interface NichePage {
  icp: IcpKey;
  service: NicheServiceSlug;
  /** The buyer in the words they search: "real estate agents". */
  buyer: string;
  /** Capitalised service name used in breadcrumbs and schema. */
  serviceName: string;
  h1: string;
  /** Under 60 characters. */
  metaTitle: string;
  /** 140 to 160 characters. */
  metaDescription: string;
  /** Answer capsule, 2 to 3 sentences. This is the paragraph AI tools quote. */
  capsule: string;
  /** Heading for the deliverables section. */
  getHeading: string;
  deliverables: { title: string; body: string }[];
  steps: NicheStep[];
  ladder: NicheLadder;
  /** Optional plain sentence under the price table. */
  ladderNote?: string;
  proof: NicheProof;
  notFit: string[];
  faq: NicheFaq[];
  posts: NicheBlogPost[];
  /** Replaces the default link to /services/{service} when no page of that slug exists. */
  serviceLink?: { href: string; label: string };
  /** Extra links under "On this site". */
  extraLinks?: { href: string; label: string }[];
}

// Short handles so the copy below reads naturally and every number stays tied
// to lib/pricing.ts.
const PILOT_P = PILOT.priceLabel;
const PRES_P = PRESENCE.priceLabel;
const GROW_P = GROWTH.priceLabel;
const T48 = '48 hours';

export const NICHE_PLAN_ROWS: { plan: Plan; key: keyof NicheLadder }[] = [
  { plan: FREE_SAMPLE, key: 'free' },
  { plan: PILOT, key: 'pilot' },
  { plan: PRESENCE, key: 'presence' },
  { plan: GROWTH, key: 'growth' },
  { plan: FULL_SYSTEM, key: 'custom' },
];

/** Promise lines shown near the price table. Taken from lib/pricing.ts. */
export const NICHE_PROMISES = [
  PROMISES.turnaround,
  PROMISES.revisions,
  PROMISES.ownership,
  PROMISES.noContract,
];

type NichePageRaw = Omit<NichePage, 'h1'>;

const RAW_PAGES: NichePageRaw[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. real-estate / video-editing
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'real-estate',
    service: 'video-editing',
    buyer: 'real estate agents',
    serviceName: 'Video editing',
    metaTitle: 'Video Editing for Real Estate Agents',
    metaDescription: `Listing reels, agent clips and market updates cut from your phone footage in 48 hours. The first 2 edits are free, then ${PRES_P} a month for 8 to 9 videos.`,
    capsule: `EchoPulse edits a real estate agent's phone footage into listing reels, agent talking-head clips and market update shorts, each back within ${T48}. The first 2 edits are free, with no card. After that, Presence Engine is ${PRES_P} a month for 8 to 9 videos, and the ${PILOT_P} Pilot is a 14-day trial first if you want one.`,
    getHeading: 'What you get back from a listing shoot',
    deliverables: [
      {
        title: 'Listing tour reels',
        body: 'Your walkthrough, cut for a vertical feed. We choose the opening shot, set the room order and the pace, then add music and captions. Most agents ask for this first.',
      },
      {
        title: 'Longer walkthroughs and portal files',
        body: 'A horizontal cut for YouTube and your own site, plus MP4s sized for MLS and portal uploads. Tell us which portal you list on when you send the footage.',
      },
      {
        title: 'Agent intro and neighborhood clips',
        body: 'An intro, a short answer to something buyers keep asking, a walk through the area you farm. Cut so a seller scrolling at night sees someone they could call.',
      },
      {
        title: 'Market update shorts',
        body: 'What sold, what is listed and what you are seeing, captioned and ready to post. You record it on your phone and we cut it.',
      },
    ],
    steps: [
      {
        title: 'Send a listing tour you already have',
        body: `Drop a tour or an agent clip in the shared folder. Two short videos come back within ${T48}, free, with no card and no call. The files are yours either way.`,
      },
      {
        title: `Try the ${PILOT_P} Pilot`,
        body: `One payment, 14 days. You get 6 listing or agent-brand reels, 2 posts such as a just listed or a just sold, a recorded onboarding session, a content audit and a 30-day plan. No retainer.`,
      },
      {
        title: `Move to ${PRES_P} a month`,
        body: 'Over four weeks, 8 to 9 videos is about two a week. You also get a 20 to 30 minute call each week, a shot list before your next listing, and up to 5 extra clips cut free from tours you already have.',
      },
      {
        title: 'Stay or leave',
        body: `Month-to-month, cancel with 14 days notice. Growth is ${GROW_P} a month if you also want ads, blogs and a rebuilt site.`,
      },
    ],
    ladder: {
      free: '2 short videos cut from a listing tour or an agent clip you already have. Captions, hooks, pacing and music, ready to post.',
      pilot: '6 listing or agent-brand reels, 2 posts, 1 blog, a content audit and a 30-day plan, with a recorded onboarding session.',
      presence: '8 to 9 listing, neighborhood and market update videos a month, up to 5 extra clips from tours you already have, a weekly call and a shot list for the next listing.',
      growth: '12 listing cuts, 12 clips, 2 long-form tours, 6 ad creatives, 20 social posts, 4 blogs and an agent site rebuilt in month one.',
      custom: 'More volume than Growth, or a site or app build next to the edits. Written scope, fixed price and a delivery date before you pay.',
    },
    proof: {
      heading: 'Where the listing editing comes from',
      paragraphs: [
        'Before EchoPulse, the founder, Lakshya Soni, edited listing tours, agent brand videos and UGC-style ads for more than 200 Canadian real estate agents at a real estate media company. The tours were shot in 4K at 120 frames per second and above.',
        `Those agents were that company's clients, not EchoPulse clients, and none of them endorse us. We publish no client count and no listing results. The free sample is how you judge the work on your own footage.`,
      ],
      links: [
        { href: '/case-studies/founder-200-real-estate-agents', label: 'Read the founder story' },
        { href: '/resources/listing-video-shot-list', label: 'Use the listing video shot list' },
      ],
      showClips: true,
      clipsNote: 'Listing and agent clips from our work page. They show the edit, not a result.',
    },
    notFit: [
      'You list one or two homes a quarter. The free edits will show you the quality, but a monthly plan would sit idle. One-off edits are sold on the order page.',
      'You want someone on site with a camera. We edit footage and write the shot list. You, or a videographer you hire, film it.',
      'A listing goes live today. Standard is 48 hours. A 24-hour rush is sometimes possible at 30 percent more, agreed before you send the footage.',
    ],
    faq: [
      {
        q: 'Do I have to film the listing myself?',
        a: 'You or a videographer you hire. With a phone and a steady hand, shoot the walkthrough from the shot list we send. We do the edit, captions, music and exports.',
      },
      {
        q: 'How much does video editing cost for a real estate agent?',
        a: `The first 2 edits are free. The Pilot is ${PILOT_P} once, for 14 days. Presence Engine is ${PRES_P} a month for 8 to 9 videos, month-to-month. Our guide to real estate video editing cost lists what other editors charge per video.`,
      },
      {
        q: 'How fast do I get a listing reel back?',
        a: `Within ${T48} per deliverable. If the listing goes live on a Saturday, say so when you send the footage and we will tell you whether 24 hours is possible that week. A rush adds 30 percent.`,
      },
      {
        q: 'What file formats do you deliver?',
        a: 'Vertical for Instagram Reels, TikTok and YouTube Shorts, horizontal for YouTube and your site, and MP4s sized for MLS and portal uploads. Portals differ on limits, so name yours at the start.',
      },
      {
        q: 'How much of my time does this take?',
        a: 'About 2 to 3 hours a month after onboarding. You film on walkthroughs you already do, we send a short shot list, and the rest is approving edits in batches.',
      },
    ],
    posts: [
      { slug: 'real-estate-video-editing-cost', title: 'Real Estate Video Editing Cost: $10 to $327 Per Video' },
      { slug: 'film-listing-video-on-iphone', title: 'How to Film a Listing Video on an iPhone: 2026 Setup' },
      { slug: 'listing-video-shot-list-room-by-room', title: 'Listing Video Shot List: 42 Shots, Room by Room' },
      { slug: 'real-estate-video-specs-mls-zillow-instagram', title: 'Real Estate Video Specs for MLS, Zillow and Instagram' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. real-estate / websites-funnels
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'real-estate',
    service: 'websites-funnels',
    buyer: 'real estate agents',
    serviceName: 'Websites and funnels',
    metaTitle: 'Real Estate Agent Websites and Lead Pages',
    metaDescription:
      'Agent websites, listing pages and lead pages with copy written by a person. Landing pages take 1 to 2 weeks, brand sites 3 to 4. Start with 2 free video edits.',
    capsule: `EchoPulse builds agent websites, listing pages and lead pages that book showings, with the copy written by a person. A landing page takes 1 to 2 weeks and a brand site 3 to 4. The first 2 video edits are free, back within ${T48}, and Presence Engine at ${PRES_P} a month includes a free website tune-up in month one.`,
    getHeading: 'What gets built for an agent',
    deliverables: [
      {
        title: 'An agent site about you',
        body: 'Home, about and the neighborhoods you work, written for the buyer or seller you want to hear from, not a brokerage template. Built to load in under 2 seconds on mobile.',
      },
      {
        title: 'Listing pages',
        body: 'One page per home with the video, the photos and one clear way to book a showing.',
      },
      {
        title: 'A lead page with a short form',
        body: 'One action per page. The form asks for what you need to call someone back and nothing else.',
      },
      {
        title: 'Calendar, CRM and tracking',
        body: 'Your booking calendar and CRM connected, with GA4 and Meta Pixel events so you can see which pages produce enquiries.',
      },
      {
        title: 'Google Business Profile and structured data',
        body: 'Part of Presence Engine. The profile and markup that help sellers find you on Google and in ChatGPT answers.',
      },
    ],
    steps: [
      {
        title: 'A 15-minute call about your current site',
        body: 'We go through it together, name what is costing you enquiries, and put a scope and a fixed price in writing. You keep that plan either way.',
      },
      {
        title: 'Copy and design together',
        body: 'The copywriter and the designer work on the same page at the same time, so the headline and the layout agree.',
      },
      {
        title: 'Build, test, launch',
        body: 'A landing page takes 1 to 2 weeks, a brand site 3 to 4, a custom Next.js build 4 to 6. We test on real phones before launch and watch the numbers for 30 days.',
      },
      {
        title: 'Feed it',
        body: `A site with no new listing video goes stale. Presence Engine is ${PRES_P} a month with a free tune-up in month one. Growth is ${GROW_P} a month and rebuilds the site in month one.`,
      },
    ],
    ladder: {
      free: 'Not a site. 2 free video edits from a listing tour, ready to go on your new pages.',
      pilot: 'No site build. 6 short-form edits, 2 posts, 1 blog, a content audit and a 30-day plan.',
      presence: 'A free website tune-up in month one, then ongoing upgrades. Neighborhood and bio pages, Google Business Profile and structured data, plus 8 to 9 videos a month for the pages.',
      growth: 'An agent or listing site rebuilt in month one and tuned every month, funnel optimization with lead tracking, plus video, posts, blogs and ads.',
      custom: 'A stand-alone site or funnel build, with a written scope and fixed price before you pay. There is no published price for a stand-alone build.',
    },
    ladderNote: 'A stand-alone site is quoted on a call. The plans above suit agents who also want video and posts every month.',
    proof: {
      heading: 'What we can and cannot show',
      paragraphs: [
        'EchoPulse has no published agent-site result, so none appears here. The founder, Lakshya Soni, edited listing tours for more than 200 Canadian agents at a previous company. That was video, not websites, and those agents were that company\'s clients, not ours.',
        'The one published rebuild is MagicBNB, a software company. Its new site went live on 5 May 2026. On 4 May it earned 13 Google impressions and on 5 May, 209. Daily impressions averaged 5.8 in April and 4,859 in early November, but that covers 219 articles and ads too, so the site alone does not explain it.',
      ],
      links: [
        { href: '/case-studies/founder-200-real-estate-agents', label: 'Read the founder story' },
        { href: '/case-studies/magicbnb-seo-aeo', label: 'Read the MagicBNB case study' },
      ],
      showClips: true,
      clipsNote: 'Listing videos we have edited, the kind that sit on a listing page.',
    },
    notFit: [
      'You need live MLS search on the site. IDX tools are custom builds, outside the standard scope, and quoted on a call.',
      'You have no footage and no plan to film. A site without video and fresh posts is a brochure, and the plans assume you send us material.',
      'You need a site live this week. Landing pages take 1 to 2 weeks and a full site longer.',
    ],
    faq: [
      {
        q: 'How long does an agent website take?',
        a: 'A landing page takes 1 to 2 weeks and a brand website 3 to 4. A custom Next.js build takes 4 to 6. The scope and the date go in writing before you pay.',
      },
      {
        q: 'Do you write the copy?',
        a: 'Yes. A person writes every page, and the design is built around that copy. We do not design around placeholder text.',
      },
      {
        q: 'Who owns the site?',
        a: 'You do. You own the code and the domain.',
      },
      {
        q: 'What does a real estate agent website cost?',
        a: `A stand-alone build is quoted on a call, with a fixed price in writing. Presence Engine at ${PRES_P} a month includes a free website tune-up in month one, and Growth at ${GROW_P} a month rebuilds the site in month one. Our agent website cost guide lists 10 prices from other providers.`,
      },
      {
        q: 'Can you redo the site I have now?',
        a: 'Yes. We check what is producing enquiries first, keep that and replace the rest.',
      },
    ],
    posts: [
      { slug: 'real-estate-agent-website-cost-2026', title: 'Real Estate Agent Website Cost 2026: 10 Real Prices' },
      { slug: 'real-estate-marketing-budget-2026', title: 'Real Estate Marketing Budget: What Agents Actually Spend in 2026' },
      { slug: 'google-business-profile-setup-checklist', title: 'Google Business Profile Setup Checklist (Official Rules)' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. real-estate / ad-creatives
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'real-estate',
    service: 'ad-creatives',
    buyer: 'real estate agents',
    serviceName: 'Ad creatives',
    metaTitle: 'Ad Creatives for Real Estate Agents',
    metaDescription: `Meta and Instagram listing ads cut from your reels, with a hook in the first 2 seconds. 6 a month on Growth, back in 48 hours. Start with 2 free edits.`,
    capsule: `EchoPulse cuts an agent's listing reels into Meta and Instagram ads with a hook in the first two seconds and one call to action. Growth at ${GROW_P} a month includes 6 ad creatives, 4 static and 2 video, each back within ${T48}. The first 2 edits are free, and Presence Engine at ${PRES_P} a month gives you 8 to 9 edited videos you can run as ads yourself.`,
    getHeading: 'What an agent gets for ads',
    deliverables: [
      {
        title: 'Video ads from listing footage',
        body: 'The reel recut as a 15 to 60 second ad. A hook in the first two seconds, the right ratio for the placement, and one call to action such as booking a showing.',
      },
      {
        title: 'Static ads from listing photos',
        body: 'Single-image and carousel ads from your photos and brand assets, for a just listed or a just sold.',
      },
      {
        title: 'How the 6 a month split',
        body: 'On Growth, 4 are static and 2 are video. Video is cut from your listing footage and static from your listing photos.',
      },
      {
        title: 'New openings on the ads that work',
        body: 'When an ad earns clicks, we cut new hooks of it so you are not running one version until it wears out.',
      },
    ],
    steps: [
      {
        title: 'Send a listing tour',
        body: `The free sample is 2 short videos back within ${T48}. Run them as organic posts or upload them as video ads. The cut is the same job.`,
      },
      {
        title: `Start the ${PILOT_P} Pilot`,
        body: '6 short-form edits you can run as video ads, 2 static or carousel posts, a content audit and a 30-day plan.',
      },
      {
        title: `Choose Growth at ${GROW_P} a month`,
        body: 'It includes the ad creatives. Each month starts with a look at last month\'s top ads and ends with a performance review.',
      },
      {
        title: 'You run the ads, we make the next batch',
        body: 'We do not run your ad account. You or your media buyer upload the creative and share the Meta numbers. Winners get new variations and losers shape the next month.',
      },
    ],
    ladder: {
      free: '2 short videos cut from a listing tour. Run them as organic posts or as video ads.',
      pilot: '6 short-form edits you can run as video ads, 2 static or carousel posts, a content audit and a 30-day plan.',
      presence: 'No ad creatives in this plan. 8 to 9 edited videos a month that you can upload as video ads yourself, plus a weekly call about what is working.',
      growth: '6 ad creatives a month, 4 static and 2 video, plus 12 listing cuts, 12 clips, 20 social posts and 4 blogs.',
      custom: 'A larger ad engine across more channels, scoped in writing with a fixed price and a delivery date before you pay.',
    },
    ladderNote: 'Static ads are only in Growth. Below that, your ads are video.',
    proof: {
      heading: 'What we can and cannot show',
      paragraphs: [
        'EchoPulse has no ad results for agents, so there is no cost-per-lead figure on this page.',
        'The founder, Lakshya Soni, cut listing tours, agent brand videos and UGC-style ads for more than 200 Canadian agents at a previous company. Those were that company\'s clients, not ours.',
      ],
      links: [
        { href: '/case-studies/founder-200-real-estate-agents', label: 'Read the founder story' },
      ],
      showClips: true,
      clipsNote: 'Listing reels we have edited. They are raw material for ads, not ads with results.',
    },
    notFit: [
      'You want someone to run the ad account. We make the creative. You or your media buyer set budgets and targeting.',
      'You have no footage. Video ads are cut from footage you send and static ads from your listing photos. We do not shoot the property.',
      'You run a large campaign. Six ads a month will not feed 15 or more live variants. Growth suits an agent with one or two listing campaigns at a time.',
    ],
    faq: [
      {
        q: 'Which platforms do you make ads for?',
        a: 'Meta (Facebook and Instagram), TikTok, Google Display, LinkedIn and Pinterest, each exported in the right specs and ratios. Most agents start with Meta.',
      },
      {
        q: 'Do you run my ads?',
        a: 'No. We make the creative and work from the numbers you share. The ad account, the budget and the targeting stay with you or your media buyer.',
      },
      {
        q: 'How many ads do I get, and is that enough?',
        a: 'Growth includes 6 a month, 4 static and 2 video. Performance campaigns often run 15 to 25 live variants, so 6 will not match that. For one listing campaign at a time it is a workable batch.',
      },
      {
        q: 'Can I get ad creative without Growth?',
        a: `Not as a separate line. Presence Engine at ${PRES_P} a month gives you 8 to 9 edited videos to upload as video ads yourself. Static ads come with Growth at ${GROW_P} a month.`,
      },
      {
        q: 'How fast does each ad come back?',
        a: `Within ${T48} per ad. The monthly kickoff picks the angles first, so the batch is not waiting on a brief.`,
      },
    ],
    posts: [
      { slug: 'static-vs-video-ads-how-to-decide', title: 'Static vs Video Ads: How to Decide What to Make' },
      { slug: 'meta-ad-specs-2026-sources-disagree', title: 'Meta Ad Specs 2026: Where 4 Spec Sheets Disagree' },
      { slug: 'fair-housing-words-to-avoid-listing-videos', title: 'Fair Housing Words to Avoid in Listing Videos' },
      { slug: 'real-estate-marketing-budget-2026', title: 'Real Estate Marketing Budget: What Agents Actually Spend in 2026' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. coaches / video-editing
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'coaches',
    service: 'video-editing',
    buyer: 'coaches',
    serviceName: 'Video editing',
    metaTitle: 'Video Editing for Coaches and Course Creators',
    metaDescription: `Clips from your sessions, podcast episodes with highlights and course modules for Kajabi, Teachable and Skool in 48 hours. 2 free edits, then ${PRES_P} a month.`,
    capsule: `Coaches and course creators send EchoPulse a recorded session, workshop, podcast episode or course module and get captioned clips or a finished edit back within ${T48}. The first 2 edits are free. After that, Presence Engine is ${PRES_P} a month for 8 to 9 short-form videos, and the ${PILOT_P} Pilot is a 14-day trial first.`,
    getHeading: 'What a coach gets back',
    deliverables: [
      {
        title: 'Clips from sessions and workshops',
        body: 'A recorded cohort workshop holds several clips. We find the moments that stand alone, cut them tight, add captions and a hook, and format them for Reels, TikTok and Shorts.',
      },
      {
        title: 'Podcast episodes and highlight clips',
        body: 'A full episode polished, with cuts, levels and music, plus 8 to 12 short highlight clips per episode.',
      },
      {
        title: 'Course modules',
        body: 'Lecture cuts, lower thirds, chapter markers and branded intros for Kajabi, Teachable, Thinkific and Skool.',
      },
      {
        title: 'Webinar replays and promos',
        body: 'A recorded webinar cut into a replay and a promo. Growth includes 2 long-form pieces a month for this.',
      },
    ],
    steps: [
      {
        title: 'Send a workshop or an episode',
        body: `Put a workshop, a client call you have permission to use, or a podcast episode in the shared folder. 2 clips come back within ${T48}, free, with no card and no call.`,
      },
      {
        title: `Do the ${PILOT_P} Pilot`,
        body: '14 days, 6 short-form edits from your talks, sessions or episodes, 2 posts or carousels, a content audit and a 30-day plan. You keep it all.',
      },
      {
        title: `Go monthly at ${PRES_P}`,
        body: 'A weekly call, 8 to 9 short-form videos a month and up to 5 extra clips cut free from talks and episodes you already have. Course modules at volume are scoped on a call.',
      },
      {
        title: 'Leave when you want',
        body: 'Month-to-month with 14 days notice. Everything we made stays yours.',
      },
    ],
    ladder: {
      free: '2 short videos cut from a talk, session or episode you already have. Captions, hooks and pacing, ready to post.',
      pilot: '6 short-form edits from your talks, sessions or episodes, 2 posts, 1 blog, a content audit and a 30-day plan.',
      presence: '8 to 9 short-form videos a month from your talks, episodes and sessions, plus up to 5 extra clips cut free. Weekly call and shot list.',
      growth: '12 short-form edits, 12 clips and 2 long-form pieces (program promo, webinar and session cuts), plus 20 posts, 4 blogs, 6 ad creatives and a rebuilt funnel.',
      custom: 'Course module libraries, webinar replays and masterclass cuts at volume, with a written scope and fixed price before you pay.',
    },
    proof: {
      heading: 'What the free sample is for',
      paragraphs: [
        `EchoPulse has no coach case study and no client list, so there are no enrolment numbers here. Results depend on the offer and the audience, and we have no number we could attach a name to.`,
        'The clips below are podcast and talking-head edits from our work. Send two of your own and compare them with what you post now.',
      ],
      links: [{ href: '/work?niche=coaches', label: 'See more coach clips' }],
      showClips: true,
      clipsNote: 'Podcast and talking-head edits from our work page.',
    },
    notFit: [
      'You do not record anything yet. Every plan starts from footage. Record one session, even on a phone, and come back.',
      'You need a funnel or lead magnet built. That is a separate service, covered on the websites and funnels page for coaches.',
      'You have hundreds of hours of course content to edit at once. That is Custom, scoped on a call with a date and a fixed price in writing.',
    ],
    faq: [
      {
        q: 'Can you edit course modules as well as marketing clips?',
        a: 'Yes. Module editing covers lecture cuts, lower thirds, chapter markers and branded intros, for Kajabi, Teachable, Thinkific and Skool.',
      },
      {
        q: 'How many clips come from one podcast episode?',
        a: 'A full episode edit includes 8 to 12 short highlight clips. On Presence Engine you also get up to 5 extra clips a month cut free from footage you already have.',
      },
      {
        q: 'How do I send long recordings?',
        a: 'We set up a shared Google Drive or Dropbox folder. Upload the raw files with a two-line note on the goal, and we take it from there.',
      },
      {
        q: 'I run a rolling-enrolment program, not launches. Does this fit?',
        a: 'Yes. Clips and episode edits do not depend on a cart-open date, so the same plan works for a program that enrols all year.',
      },
      {
        q: 'How fast is a course module?',
        a: `Within ${T48} per deliverable. If a launch date depends on a batch of modules, say so on the call and we will tell you what we can hit.`,
      },
    ],
    posts: [
      { slug: 'course-video-editing-cost-2026', title: 'Course Video Editing Cost in 2026: Per Video and Monthly' },
      { slug: 'turn-podcast-episode-into-clips', title: 'Turn One Podcast Episode Into 12 Clips: 2026 Workflow' },
      { slug: 'course-editor-handoff-brief-template', title: 'Course Editor Handoff Brief: A Fill-In Template' },
      { slug: 'how-to-film-an-online-course-at-home', title: 'How to Film an Online Course at Home Without a Studio' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. coaches / linkedin-ghostwriting
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'coaches',
    service: 'linkedin-ghostwriting',
    buyer: 'coaches',
    serviceName: 'LinkedIn ghostwriting',
    metaTitle: 'LinkedIn Ghostwriting for Coaches',
    metaDescription: `LinkedIn posts and carousels in your voice, written from a recorded interview. You approve every post. Drafts in 48 hours, from a ${PILOT_P} Pilot.`,
    capsule: `EchoPulse writes LinkedIn posts and carousels for coaches from a recorded onboarding interview, with each draft back within ${T48} and nothing posted until you approve it. Presence Engine is ${PRES_P} a month for 8 photo or carousel posts, and the ${PILOT_P} Pilot lets you test the writing first with 2 posts. The 2 free edits are for video, not writing.`,
    getHeading: 'What a coach gets written',
    deliverables: [
      {
        title: 'Authority posts in your voice',
        body: 'The opinions you hold about your field, the questions you answer on every discovery call, the stories you already tell clients. Written for a cohort that opens on a date or a program that enrols all year.',
      },
      {
        title: 'Carousels',
        body: 'A method you teach, laid out in slides with the caption ready.',
      },
      {
        title: 'The voice brief',
        body: 'The interview becomes a written brief covering your offer, your buyer, your stories and the phrases you never use. Every writer works from it, and it is yours if you cancel.',
      },
      {
        title: 'A weekly look at the numbers',
        body: 'On Presence Engine, the 20 to 30 minute weekly call covers what the posts earned and what to write next.',
      },
    ],
    steps: [
      {
        title: 'Want a free test? Send two clips',
        body: `The free sample is 2 video edits within ${T48}, not writing. It shows you the team's standard on your own footage.`,
      },
      {
        title: `Test the writing with the ${PILOT_P} Pilot`,
        body: 'A recorded onboarding session and brand brief, then 2 posts or carousels written from it. Mark what does not sound like you and we rewrite.',
      },
      {
        title: `Run it monthly at ${PRES_P}`,
        body: `8 photo or carousel posts a month, a content calendar you approve first and a weekly call. Growth at ${GROW_P} a month raises that to 20 social posts.`,
      },
      {
        title: 'You approve every post',
        body: 'Nothing publishes without your yes, and revisions run until you are satisfied. Cancel with 14 days notice.',
      },
    ],
    ladder: {
      free: 'Not writing. The sample is 2 video edits from your footage, so you can judge the team before you spend anything.',
      pilot: '2 posts or carousels from a recorded onboarding session and brand brief, plus 6 short-form edits, 1 blog and a 30-day plan.',
      presence: '8 photo or carousel posts a month in your voice, with a content calendar and a weekly call.',
      growth: '20 social posts a month, plus 4 blogs, 12 short-form edits, 6 ad creatives and a funnel built to convert.',
      custom: 'A higher volume of posts alongside long-form, podcast or course work, with a written scope and fixed price before you pay.',
    },
    proof: {
      heading: 'What we can and cannot show',
      paragraphs: [
        'EchoPulse has no published LinkedIn result for a coach, and this page has no client quotes or logos.',
        'The only case study is MagicBNB, a software company, where LinkedIn is one workstream next to a site rebuild, 219 articles and ads. It prints no LinkedIn figures, so it cannot tell you what posts alone would do for a coach.',
        'To judge the writing, take the Pilot. You get 2 posts in your voice and you can walk away with them.',
      ],
      links: [{ href: '/case-studies/magicbnb-seo-aeo', label: 'Read the MagicBNB case study' }],
      showClips: false,
    },
    notFit: [
      'Your clients are not on LinkedIn. If you sell to parents or other consumers, they may be on Instagram instead.',
      'You will not read drafts. Every post needs your approval, and a calendar nobody approves goes nowhere.',
      'You cannot yet say who your program is for or what they get. The interview will be thin, so sort out the offer first.',
    ],
    faq: [
      {
        q: 'Will the posts sound like me?',
        a: 'They are built from a recorded interview about your offer, your clients and how you already talk about your work, then checked by a human editor against that brief. You approve each draft, and revisions run until you are satisfied.',
      },
      {
        q: 'How many posts do I get?',
        a: `The ${PILOT_P} Pilot has 2 posts or carousels. Presence Engine at ${PRES_P} a month has 8 photo or carousel posts. Growth at ${GROW_P} a month has 20 social posts.`,
      },
      {
        q: 'Do you use AI to write them?',
        a: 'AI helps with research, transcription and first-pass outlines. A person writes and reviews the final voice of every post against your brief. We do not sell AI-generated content as finished work.',
      },
      {
        q: 'Will you reply to comments and DMs for me?',
        a: 'No. We write posts and do not reply as you. DM flows are a separate automations service, and personal replies to clients stay with you.',
      },
      {
        q: 'How is this different from a cheap writer or an AI tool?',
        a: 'A cheap writer works from a template. We work from a brief built from your own words. Our guide to AI LinkedIn tools against a ghostwriter compares what each costs.',
      },
    ],
    posts: [
      { slug: 'how-much-does-linkedin-ghostwriting-cost-2026', title: 'LinkedIn Ghostwriting Pricing: $500 to $15,000 a Month' },
      { slug: 'linkedin-post-does-not-read-as-ai', title: 'How to Write a LinkedIn Post That Does Not Read as AI' },
      { slug: 'content-ideas-for-coaches-not-quotes', title: '20 Content Ideas for Coaches That Are Not Quotes' },
      { slug: 'ai-linkedin-tools-vs-ghostwriter-cost', title: 'AI LinkedIn Tools vs a Ghostwriter: 2026 Cost Compared' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. coaches / websites-funnels
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'coaches',
    service: 'websites-funnels',
    buyer: 'coaches',
    serviceName: 'Websites and funnels',
    metaTitle: 'Websites and Funnels for Coaches',
    metaDescription:
      'A lead magnet, opt-in page and booking or sales page that feed Kajabi, Teachable or Skool, with copy by a person. A funnel takes 1 to 2 weeks.',
    capsule: `A coach's content needs somewhere to send people, and EchoPulse builds it: a lead magnet, an opt-in page and a booking or sales page that feed the platform you already use, with the copy written by a person. A funnel takes 1 to 2 weeks. The first 2 video edits are free, back within ${T48}, and Presence Engine at ${PRES_P} a month includes a free website tune-up in month one.`,
    getHeading: 'What a coach gets built',
    deliverables: [
      {
        title: 'A lead magnet funnel',
        body: 'The magnet, the opt-in page and the booking or sales page, built as one path. People who watch your clips end up on an email list you own.',
      },
      {
        title: 'Pages for your offer',
        body: 'Sales pages, webinar pages, launch pages and checkout flows. Every section has a job and every button one action.',
      },
      {
        title: 'Connected to your platform',
        body: 'Stripe, Calendly, Kajabi, Teachable, GoHighLevel and ActiveCampaign. We build the funnel that feeds your platform and leave the platform alone.',
      },
      {
        title: 'Tracking you can read',
        body: 'GA4, Meta Pixel and conversion events in one dashboard, so you can see where people drop off between the clip and the discovery call.',
      },
    ],
    steps: [
      {
        title: 'A 15-minute call about your funnel',
        body: 'We go through what you have now, name what is costing you sign-ups, and write down a scope and fixed price. It is yours either way.',
      },
      {
        title: 'Magnet, copy and design together',
        body: 'The lead magnet idea, the page copy and the layout are built side by side, so the promise in your clip matches the promise on the page.',
      },
      {
        title: 'Build, connect, test',
        body: 'A funnel takes 1 to 2 weeks. We connect it to your platform, test it on real phones and watch conversion for 30 days after launch.',
      },
      {
        title: 'Fill it with content',
        body: `A funnel needs people to send through it. Presence Engine at ${PRES_P} a month adds a free website tune-up in month one and 8 to 9 videos a month. Growth at ${GROW_P} a month rebuilds the funnel and site in month one.`,
      },
    ],
    ladder: {
      free: 'Not a funnel. The free sample is 2 video edits, which can become the clips that feed your opt-in page.',
      pilot: 'No funnel build. 6 short-form edits, 2 posts, 1 blog that feeds your funnel, a content audit and a 30-day plan.',
      presence: 'A free website tune-up in month one, then ongoing upgrades. Program and topic pages plus structured data, with 8 to 9 videos a month.',
      growth: 'Funnel and site rebuilt in month one and tuned every month, with nurture funnel optimization, conversion tracking and A/B testing.',
      custom: 'A stand-alone funnel or membership site build, with a written scope and fixed price before you pay. No published price for a stand-alone build.',
    },
    ladderNote: 'The email nurture that runs after the opt-in is our automations service, separate from this page.',
    proof: {
      heading: 'What we can and cannot show',
      paragraphs: [
        'EchoPulse has no published coach funnel result, so there is no opt-in rate here.',
        'The one published build is MagicBNB, a software company: a site rebuild on Next.js, then conversion tracking. GA4 recorded 18 conversions in 90 days from 6,435 sessions. The study treats that as proof the tracking works, and says the gap between traffic and trials is still open.',
      ],
      links: [{ href: '/case-studies/magicbnb-seo-aeo', label: 'Read the MagicBNB case study' }],
      showClips: false,
    },
    notFit: [
      'You do not have an offer yet. A funnel sends people to something, so work out who it is for and what they get first.',
      'You want a course or membership platform built from scratch. That is an app build, quoted on a call.',
      'You need the funnel live this week. Funnels take 1 to 2 weeks.',
    ],
    faq: [
      {
        q: 'I already use Kajabi, Teachable or Skool. Do you replace it?',
        a: 'No. We build the lead magnet, opt-in and booking or sales pages that feed the platform you already run on, whether it holds a cohort, an ongoing program or a membership.',
      },
      {
        q: 'Do you write the page copy?',
        a: 'Yes. A person writes every page alongside the design. You never get a designed page with placeholder text.',
      },
      {
        q: 'How long does a funnel take?',
        a: 'A funnel or landing page takes 1 to 2 weeks and a full brand website 3 to 4. The date goes in writing before you pay.',
      },
      {
        q: 'What does a coaching website and funnel cost?',
        a: `A stand-alone build is quoted on a call, with a fixed price in writing. Presence Engine at ${PRES_P} a month includes a free website tune-up in month one. Our guide to coaching website cost lists what other providers charge.`,
      },
      {
        q: 'Who owns the pages?',
        a: 'You do. You own the code and the domain.',
      },
    ],
    posts: [
      { slug: 'coaching-website-and-funnel-cost-2026', title: 'Coaching Website Cost in 2026: $600 to $30,000' },
      { slug: 'lead-magnet-formats-for-coaches-ranked', title: 'Lead Magnets for Coaches: 12 Formats, Ranked' },
      { slug: 'mistakes-coaches-make-with-their-website-2026', title: '8 Mistakes Coaches Make With Their Website in 2026' },
      { slug: 'every-sales-funnel-explained-2026-coaching-edition', title: 'Sales Funnels for Coaches: How to Pick the Right One' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7. founders / linkedin-ghostwriting
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'founders',
    service: 'linkedin-ghostwriting',
    buyer: 'founders',
    serviceName: 'LinkedIn ghostwriting',
    metaTitle: 'LinkedIn Ghostwriting for Founders',
    metaDescription: `LinkedIn posts and carousels for SaaS, agency and consulting founders, written from a recorded voice interview. You approve each draft. From a ${PILOT_P} Pilot.`,
    capsule: `EchoPulse writes a founder's LinkedIn posts and carousels from a recorded voice interview and a brand brief every writer reads, with each draft back within ${T48} and nothing posted until you approve it. Presence Engine is ${PRES_P} a month for 8 photo or carousel posts, and Growth is ${GROW_P} a month for 20 social posts. The 2 free edits are video, so to test the writing start with the ${PILOT_P} Pilot, which includes 2 posts.`,
    getHeading: 'What a founder gets written',
    deliverables: [
      {
        title: 'Posts in your voice',
        body: 'How your market works, what you got wrong building the company, what you tell a buyer weighing you against others. Written so an investor, a candidate or a buyer who looks you up before a call finds a person with a view.',
      },
      {
        title: 'Carousels',
        body: 'A framework you use, a teardown or a process, laid out in slides with captions ready.',
      },
      {
        title: 'A brief from your voice interview',
        body: 'Your offer, your buyers, your stories and a banned-phrase list, read by every writer before a draft. It is yours if you cancel.',
      },
      {
        title: 'Posts pulled from talks and podcasts',
        body: 'Give the talk or the podcast once and we pull the posts out of it.',
      },
    ],
    steps: [
      {
        title: 'Free first: 2 video edits',
        body: `Send footage you already have and 2 short videos come back within ${T48}. It is video, not writing, but it shows the standard before you pay.`,
      },
      {
        title: `${PILOT_P} Pilot for the writing`,
        body: 'A recorded onboarding session, a brand brief and 2 LinkedIn posts or carousels. Mark what does not sound like you and we redo it.',
      },
      {
        title: `${PRES_P} a month`,
        body: '8 photo or carousel posts a month, a calendar you approve, a weekly call, and 8 to 9 founder videos if you want video too.',
      },
      {
        title: `${GROW_P} a month`,
        body: '20 social posts, 4 SEO blogs, short-form video, 6 ad creatives and a site tuned every month.',
      },
    ],
    ladder: {
      free: 'Not writing. The sample is 2 video edits from footage you have, so you can judge the team first.',
      pilot: '2 LinkedIn posts or carousels in your voice, 6 founder short-form edits, 1 SEO blog, a content audit and a 30-day plan.',
      presence: '8 photo or carousel posts a month in your voice, 8 to 9 founder videos, a weekly call and a free website tune-up in month one.',
      growth: '20 social posts a month, 4 SEO blogs, 12 founder short-form edits, 6 ad creatives and a site tuned monthly.',
      custom: 'Higher volume, podcast or YouTube editing at scale, or a site or app build alongside, scoped in writing with a fixed price.',
    },
    proof: {
      heading: 'What we can and cannot show',
      paragraphs: [
        'EchoPulse runs marketing for MagicBNB, a software company, including the founder brand on Instagram and LinkedIn. Its published result is Google search impressions, which averaged 5.8 a day in April 2026 and 4,859 in the first 11 days of November.',
        'That comes from the whole system, 219 articles and a rebuilt site included. The case study prints no LinkedIn numbers, so we claim none, and it lists what is still not working.',
      ],
      links: [{ href: '/case-studies/magicbnb-seo-aeo', label: 'Read the MagicBNB case study' }],
      showClips: false,
    },
    notFit: [
      'You need pipeline this month. Posts build a record over months. We guarantee output, turnaround and revisions, not leads, followers or revenue.',
      'Your buyers are not on LinkedIn. A founder selling to consumers may reach them better with short video.',
      'You want a writer to invent your opinions. The interview is the raw material, and if you have no view on your market yet, the posts will be thin.',
    ],
    faq: [
      {
        q: 'Will the posts sound like me and not a generic ghostwriter?',
        a: 'They start from a recorded voice interview that pulls out your words, opinions and hot takes. Every writer reads the brief built from it before a draft. If the first batch does not sound like you, we redo it at no charge.',
      },
      {
        q: 'How much of my time does it take?',
        a: 'Plan on 2 to 3 hours a month after onboarding. That is one strategy call, batched approvals, and raw footage if you add video.',
      },
      {
        q: 'Is the writing done by AI?',
        a: 'AI helps with research, transcription and first-pass outlines. A person writes and reviews the final voice of every post against your brief. We do not sell AI-generated content as finished work.',
      },
      {
        q: 'I already have a freelancer. Can I add you for one channel?',
        a: 'Yes. Hand us the channel that eats the most time, such as LinkedIn or video, and expand once you have seen the work. You do not have to drop anyone to start.',
      },
      {
        q: 'Am I locked in?',
        a: `No. After the ${PILOT_P} Pilot, plans are month-to-month and you cancel with 14 days notice.`,
      },
    ],
    posts: [
      { slug: 'how-much-does-linkedin-ghostwriting-cost-2026', title: 'LinkedIn Ghostwriting Pricing: $500 to $15,000 a Month' },
      { slug: 'linkedin-post-openers-for-founders', title: '30 LinkedIn Post Openers for Founders (No Questions)' },
      { slug: 'personal-branding-agency-vs-ghostwriter', title: 'Personal Branding Agency vs Ghostwriter: Which to Hire' },
      { slug: 'linkedin-personal-profile-vs-company-page-2026', title: 'LinkedIn Personal Profile vs Company Page: Profiles Win' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7b. founders / personal-branding
  // No results, client names or testimonials: EchoPulse has no personal-brand
  // case study. The only checkable thing offered is the free sample.
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'founders',
    service: 'personal-branding',
    buyer: 'founders',
    serviceName: 'Personal branding',
    metaTitle: 'Personal Branding for Founders',
    metaDescription: `Personal branding for founders: LinkedIn posts, short videos and a tuned website, run by Lakshya Soni. Free 2-edit sample, ${PILOT_P} Pilot, from ${PRES_P} a month.`,
    capsule: `EchoPulse builds a founder's personal brand by writing LinkedIn posts and carousels from a recorded interview and editing short videos from footage you already have. Lakshya Soni, the founder, runs it with Shaurya on design and Aiman on delivery. Start with a free sample of 2 edits, then the ${PILOT_P} Pilot (14 days), ${PRES_P} a month for Presence Engine, or ${GROW_P} a month for Growth. Plans are month-to-month.`,
    getHeading: 'What you get',
    deliverables: [
      {
        title: 'Posts and carousels in your voice',
        body: 'Written from a recorded interview and a brand brief every writer reads first. Nothing goes out until you approve it. The Pilot has 2, Presence Engine has 8 a month, and Growth has 20 social posts a month.',
      },
      {
        title: 'Short videos from footage you already have',
        body: 'Talks, calls, podcasts or phone clips, cut with captions, hooks and music. Presence Engine has 8 to 9 a month, plus up to 5 extra clips.',
      },
      {
        title: 'A brand brief you keep',
        body: 'Your offer, who you are talking to, your stories and the phrases you never use. It is yours whether or not you keep working with us.',
      },
      {
        title: 'A website tune-up',
        body: 'Presence Engine includes a free website tune-up in month one, so the page people land on from your posts says the same thing you do.',
      },
      {
        title: 'A weekly call on Presence Engine',
        body: 'A 20 to 30 minute call every week to plan the week, go over the numbers and decide what to change.',
      },
    ],
    steps: [
      {
        title: 'Free sample',
        body: `Send footage you already have. 2 edited videos come back within ${T48}, with no card and no call. You keep the files.`,
      },
      {
        title: `${PILOT_P} Pilot`,
        body: '14 days of real work on your brand: a recorded onboarding session, a brand brief, 2 posts, 6 short-form edits, 1 blog, a content audit and a 30-day plan. You keep all of it.',
      },
      {
        title: `${PRES_P} a month`,
        body: 'Presence Engine, month-to-month. A calendar you approve, a weekly call, posts, videos and the website tune-up.',
      },
      {
        title: `${GROW_P} a month`,
        body: 'Growth, month-to-month. More of everything, including 4 SEO blogs a month and 6 ad creatives.',
      },
    ],
    ladder: {
      free: 'Not writing. 2 edited videos from footage you already have, so you can judge the work before paying.',
      pilot: '2 posts or carousels in your voice from a recorded onboarding session, 6 short-form edits, 1 sourced blog, a content audit and a 30-day plan, over 14 days.',
      presence: '8 to 9 short-form videos and 8 photo or carousel posts a month, a weekly call, a posting plan and a website tune-up in month one.',
      growth: '20 social posts, 4 SEO blogs, 12 short-form edits plus 12 clips, 6 ad creatives and a monthly review.',
      custom: 'More volume, podcast or YouTube editing at scale, or a build alongside. Scoped in writing with a fixed price before you pay.',
    },
    ladderNote: 'Prices are per month and you can cancel with 14 days notice after the Pilot.',
    proof: {
      heading: 'What we can and cannot show',
      paragraphs: [
        'We have no personal-branding case study yet, so this page claims no results and shows no testimonials. We do not guarantee followers, leads or revenue.',
        'What you can check yourself is the free sample: send footage, get 2 edited videos back, and judge the standard before you spend anything.',
      ],
      links: [{ href: '/free-edits', label: 'Get the 2 free edits' }],
      showClips: false,
    },
    notFit: [
      'You need new customers this month. Personal branding builds a record over months, and we guarantee output, turnaround and revisions, not leads or followers.',
      'You do not want to record, talk or review anything. The posts and videos start from you talking, so with no raw material the work is thin.',
      'You want someone to invent your opinions. We write down and tighten what you think, we do not supply a point of view.',
      'You want posts published for you without reading them first. Nothing goes out until you approve it.',
    ],
    faq: [
      {
        q: 'What do you mean by personal branding?',
        a: 'Content that comes from you and reaches the people who look you up: LinkedIn posts and carousels, short videos, and a website that matches. We make it from a recorded interview and footage you already have.',
      },
      {
        q: 'Who does the work?',
        a: 'Lakshya Soni, the founder, leads it. Shaurya handles design and Aiman handles delivery. AI helps with transcription and first outlines, and a person writes and reviews the final version against your brief.',
      },
      {
        q: 'What does it cost?',
        a: `The sample of 2 edited videos is free. The Pilot is ${PILOT_P} for 14 days, Presence Engine is ${PRES_P} a month and Growth is ${GROW_P} a month. Bigger scopes are quoted in writing first.`,
      },
      {
        q: 'Do I have to be on camera?',
        a: 'No. The posts come from a voice interview. Video is optional and cut from footage you already have, such as a talk, a call or a podcast.',
      },
      {
        q: 'Do you guarantee followers or leads?',
        a: 'No. We guarantee what we control: the number of deliverables, a 48 hour turnaround on short-form edits and re-dos until you would post it under your own name.',
      },
      {
        q: 'Am I locked in?',
        a: `No. After the ${PILOT_P} Pilot, plans are month-to-month and you cancel with 14 days notice.`,
      },
    ],
    posts: [
      { slug: 'personal-branding-agency-vs-ghostwriter', title: 'Personal Branding Agency vs Ghostwriter: Which to Hire' },
      { slug: 'linkedin-personal-profile-vs-company-page-2026', title: 'LinkedIn Personal Profile vs Company Page: Profiles Win' },
      { slug: 'how-much-does-linkedin-ghostwriting-cost-2026', title: 'LinkedIn Ghostwriting Pricing: $500 to $15,000 a Month' },
    ],
    serviceLink: { href: '/services/linkedin-ghostwriting', label: 'The LinkedIn and social service in full' },
    extraLinks: [{ href: '/pilot', label: `The ${PILOT_P} Pilot in detail` }],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 8. founders / video-editing
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'founders',
    service: 'video-editing',
    buyer: 'founders',
    serviceName: 'Video editing',
    metaTitle: 'Video Editing for Founders',
    metaDescription: `Talking-head clips, product demos and podcast highlights cut into captioned short-form video in 48 hours. 2 free edits, then ${PRES_P} a month for 8 to 9 videos.`,
    capsule: `EchoPulse edits a founder's talking-head clips, product demos and podcast highlights into short-form video with captions, hooks, pacing and music, each back within ${T48}. The first 2 edits are free, cut from footage you already have. After that, Presence Engine is ${PRES_P} a month for 8 to 9 videos, and the ${PILOT_P} Pilot adds 6 founder edits as a 14-day trial.`,
    getHeading: 'What a founder gets back',
    deliverables: [
      {
        title: 'Talking-head clips',
        body: 'Record one long take. We cut the clips worth posting, open each on its strongest line and caption it for people watching on mute.',
      },
      {
        title: 'Demo clips',
        body: 'A screen recording or a customer call, cut down to the part that shows what the product does.',
      },
      {
        title: 'Podcast highlights',
        body: 'An episode where you were guest or host becomes 8 to 12 short clips, plus a polished full episode if you want one.',
      },
      {
        title: 'YouTube long-form',
        body: 'Talks and educational videos cut for watch time. Growth includes 2 long-form edits a month.',
      },
    ],
    steps: [
      {
        title: 'Send a talk, a podcast or a demo',
        body: `Two short videos come back within ${T48}. No card, no call, and you keep the files.`,
      },
      {
        title: `${PILOT_P} Pilot`,
        body: '14 days: 6 founder short-form edits, 2 LinkedIn posts or carousels, 1 blog, a content audit and a 30-day plan.',
      },
      {
        title: `${PRES_P} a month`,
        body: 'Over four weeks, 8 to 9 videos is about two a week. You also get up to 5 extra clips cut free from talks you already have, a weekly call and a shot list.',
      },
      {
        title: 'Grow or stop',
        body: `Growth at ${GROW_P} a month adds 12 clips, 2 long-form edits, posts, blogs and ads. Everything is month-to-month.`,
      },
    ],
    ladder: {
      free: '2 short videos cut from a talk, podcast or demo you already have. Captions, hooks, pacing and music, ready to post.',
      pilot: '6 founder short-form edits (talking head, demo, podcast clip), 2 LinkedIn posts or carousels, 1 SEO blog, a content audit and a 30-day plan.',
      presence: '8 to 9 founder short-form videos a month, plus up to 5 extra clips cut free from talks, podcasts or demos you already have. Weekly call and shot list.',
      growth: '12 founder short-form edits, 12 clips and 2 long-form edits for YouTube or podcast, plus 20 social posts, 4 blogs and 6 ad creatives.',
      custom: 'Podcast or YouTube editing at volume, or a build alongside, with a written scope and fixed price before you pay.',
    },
    proof: {
      heading: 'What the numbers say, and what they do not',
      paragraphs: [
        'The one video number we have comes from MagicBNB, a software company where EchoPulse runs marketing. In the 90 days to 9 November 2026 its Instagram account published 69 Reels and 6 feed posts. The Reels reached 8,009 accounts and the feed posts reached 270.',
        'The account is small, at 573 followers on 9 November. One Reel reached 766 accounts and most reached under 200. The study prints that on purpose. It shows where the editing hours went, not that video wins every time.',
      ],
      links: [{ href: '/case-studies/magicbnb-seo-aeo', label: 'Read the MagicBNB case study' }],
      showClips: true,
      clipsNote: 'Founder talking-head and podcast edits from our work page.',
    },
    notFit: [
      'You have no footage and no time to record. We edit what you send. We can write a shot list and help with filming, but you are the one on camera.',
      'You want a whole YouTube channel produced at volume. Beyond the 2 long-form edits in Growth, that is Custom, scoped on a call.',
      'You want guaranteed views. Nobody can promise that, and we do not.',
    ],
    faq: [
      {
        q: 'How do I send footage?',
        a: 'We set up a shared Google Drive or Dropbox folder. Upload the raw files with a two-line note on the goal and we handle the rest.',
      },
      {
        q: 'Which formats do you deliver?',
        a: 'Reels, TikTok, YouTube Shorts, YouTube long-form, LinkedIn video and podcast video. Each export is sized for the place it will run.',
      },
      {
        q: 'How much of my time does it take?',
        a: 'Plan on 2 to 3 hours a month after onboarding. You record, we edit, and you approve in batches.',
      },
      {
        q: 'I already work with an editor. Can you take part of it?',
        a: 'Yes. Hand us the channel that eats the most time and expand once you have seen the work. You do not have to drop anyone to start.',
      },
      {
        q: 'What does a short-form editor cost me?',
        a: `The first 2 edits are free. The Pilot is ${PILOT_P} once. Presence Engine is ${PRES_P} a month for 8 to 9 videos. Our guide to short-form editing cost per video shows what other editors charge.`,
      },
    ],
    posts: [
      { slug: 'short-form-video-editing-cost-per-video', title: 'Short Form Video Editing Cost Per Video in 2026' },
      { slug: 'how-to-film-talking-head-on-phone', title: 'How to Film a Talking Head on a Phone: 2026 Setup' },
      { slug: 'short-form-video-hooks-for-founders', title: '25 Short Form Video Hooks for Founders (No Questions)' },
      { slug: 'b-roll-shot-list-talking-head-video', title: 'B-Roll Shot List for a Founder Talking Head Video' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 9. dtc / ad-creatives
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'dtc',
    service: 'ad-creatives',
    buyer: 'DTC brands',
    serviceName: 'Ad creatives',
    metaTitle: 'Ad Creatives for DTC and E-Commerce Brands',
    metaDescription: `6 ad creatives a month on Growth, 4 static and 2 video, each in 48 hours, with UGC-style cuts from your creator footage. Start with 2 free edits.`,
    capsule: `DTC brands fighting creative fatigue can get static and video ad creative from EchoPulse on a monthly plan: 6 a month on Growth at ${GROW_P}, 4 static and 2 video, each back within ${T48}. We cut UGC-style video from the product and creator footage you send. The first 2 edits are free, and the ${PILOT_P} Pilot comes before any monthly plan.`,
    getHeading: 'What a DTC brand gets each month',
    deliverables: [
      {
        title: 'Static ads',
        body: 'Single-image and carousel ads from your brand assets and product photos, sized for each platform. Growth includes 4 a month.',
      },
      {
        title: 'Video ads from your footage',
        body: 'UGC, creator clips and product footage cut into 15 to 60 second ads with a hook in the first seconds. Growth includes 2 a month.',
      },
      {
        title: 'New hooks on the winners',
        body: 'When an ad works, we cut more openings and angles of it, so the account has a fresh version before the first one fatigues.',
      },
      {
        title: 'Monthly kickoff and review',
        body: 'Each month starts with last month\'s top ads and the angles to try next, and ends with a review of what won and what to test.',
      },
    ],
    steps: [
      {
        title: 'Send raw footage',
        body: `Creator clips, UGC or product footage. The free sample is 2 short videos back within ${T48}, so you can compare the hooks and hook rate against what you run now.`,
      },
      {
        title: `${PILOT_P} Pilot`,
        body: '6 short-form edits you can run as video ads, 2 static or carousel posts, a content audit and a 30-day plan, before any monthly spend.',
      },
      {
        title: `Growth at ${GROW_P} a month`,
        body: '6 ad creatives a month plus 12 short-form edits and 12 clips. A kickoff on angles at the start and a performance review at the end.',
      },
      {
        title: 'You run the account, we refill it',
        body: 'You or your media buyer launch the ads and manage spend. Share what the numbers say, and the next batch is built on it.',
      },
    ],
    ladder: {
      free: '2 short videos cut from your UGC, creator or product footage. Run them as organic posts or as video ads.',
      pilot: '6 short-form edits you can run as video ads, 2 static or carousel posts, a content audit and a 30-day plan.',
      presence: 'No ad creatives in this plan. 8 to 9 edited videos a month and up to 5 extra clips that you can upload as video ads yourself, with a weekly call.',
      growth: '6 ad creatives a month, 4 static and 2 video, plus 12 short-form edits, 12 clips, 2 long-form edits, 20 social posts and 4 blogs.',
      custom: 'A larger creative engine across more channels, with a written scope and fixed price before you pay.',
    },
    ladderNote: 'Static ads are only in Growth. Under it, your ads are video.',
    proof: {
      heading: 'What we can and cannot show',
      paragraphs: [
        'EchoPulse has no ad-account results for any DTC brand, so there is no ROAS and no cost per purchase on this page.',
        'The one case study with ads is MagicBNB, a software company. It prints $2,211.87 of spend over 90 days and no return, so it does not prove an ad works. The free sample is how you check the hooks on your own product.',
      ],
      links: [
        { href: '/case-studies/magicbnb-seo-aeo', label: 'Read the MagicBNB case study' },
        { href: '/work?niche=dtc', label: 'See DTC clips' },
      ],
      showClips: true,
      clipsNote: 'Video edits from our work page, not ads with measured results.',
    },
    notFit: [
      'You need a media buyer. We own the creative. Budgets, targeting and the ad account stay with you or your buyer.',
      'You want 15 to 25 live variants per campaign. Six creatives a month will not feed that, so scope more volume on a call.',
      'You want us to find and pay creators. Sourcing creators is not in any plan. Send the footage you have and we cut it.',
    ],
    faq: [
      {
        q: 'How many ad variants do I get a month?',
        a: 'Growth includes 6 ad creatives a month, 4 static and 2 video. We also make new hook variations of ads that are working. If you need many more than that, it is a Custom scope.',
      },
      {
        q: 'Do you make UGC-style ads or only polished brand content?',
        a: 'Both. We lean toward UGC-style for performance, and your test results decide what scales. Send raw creator footage and we cut it into versions with different hooks.',
      },
      {
        q: 'Can you use footage from creators we already work with?',
        a: 'Yes. Send raw UGC, product footage or creator clips and we cut them into several ads with different hooks, captions and formats.',
      },
      {
        q: 'Do you manage the ad spend?',
        a: 'No. We work next to your media buyer, from your account data, and we do not run your ad account.',
      },
      {
        q: 'Which platforms do you export for?',
        a: `Meta (Facebook and Instagram), TikTok, Google Display, LinkedIn and Pinterest. Each ad is exported in the right specs and ratios, and standard turnaround is ${T48} per creative.`,
      },
    ],
    posts: [
      { slug: 'ad-creative-fatigue-meta-ads-2026', title: 'Meta Ad Creative Fatigue: How Many New Ads You Need a Month' },
      { slug: 'ad-creative-subscription-published-prices', title: 'Ad Creative Subscriptions: Who Publishes a Price' },
      { slug: 'why-paid-media-roi-is-declining-funnel-architecture-fix-2026', title: 'Ad Creative Pricing in 2026: What DTC Brands Pay' },
      { slug: 'ugc-ad-hook-scripts-by-product-category', title: '20 UGC Ad Hook Scripts by Product Category' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 10. dtc / video-editing
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'dtc',
    service: 'video-editing',
    buyer: 'DTC brands',
    serviceName: 'Video editing',
    metaTitle: 'Video Editing for DTC and E-Commerce Brands',
    metaDescription: `UGC and product footage edited into short-form video with hooks, captions and the right ratio per platform, back in 48 hours. 2 free edits, then ${PRES_P} a month.`,
    capsule: `EchoPulse edits UGC, creator clips and product footage for DTC brands into short-form video with a hook in the first seconds, captions and the right ratio for each platform. Each edit comes back within ${T48}, and the first 2 are free. After that, Presence Engine is ${PRES_P} a month for 8 to 9 videos and up to 5 extra clips.`,
    getHeading: 'What a DTC brand gets back',
    deliverables: [
      {
        title: 'UGC-style cuts from creator footage',
        body: 'Raw creator clips become several versions of one video with different hooks and captions, so you have something to test.',
      },
      {
        title: 'Product videos',
        body: 'Footage of a SKU cut for a feed with captions and music, or a longer brand cut if the product calls for one.',
      },
      {
        title: 'Organic Reels and TikToks',
        body: 'The same footage cut for the feed instead of an ad slot, with captions burned in.',
      },
      {
        title: 'Formats per platform',
        body: 'Vertical for Reels, TikTok and Shorts, with exports sized for each. We handle the ratios and the caption placement.',
      },
    ],
    steps: [
      {
        title: 'Send product and creator footage',
        body: `Drop raw clips in a shared folder with a two-line brief. 2 free edits come back within ${T48}, and you keep the files.`,
      },
      {
        title: `${PILOT_P} Pilot`,
        body: '6 short-form edits, 2 static or carousel posts, a content audit and a 30-day plan. A low-cost way to see a month of edits on your product.',
      },
      {
        title: `${PRES_P} a month`,
        body: '8 to 9 short-form videos a month and up to 5 extra clips cut free from footage you already have, plus a weekly call and a shot list.',
      },
      {
        title: 'Add ads when you need them',
        body: `Growth at ${GROW_P} a month includes 6 ad creatives, 4 static and 2 video, alongside the edits. Month-to-month, with 14 days notice.`,
      },
    ],
    ladder: {
      free: '2 short videos cut from UGC, creator clips or product footage you already have. Hooks, captions and pacing, ready to post.',
      pilot: '6 short-form edits, 2 static or carousel posts, 1 blog, a content audit and a 30-day plan.',
      presence: '8 to 9 short-form videos a month, plus up to 5 extra clips cut free from footage you already have. Weekly call and shot list.',
      growth: '12 short-form edits, 12 clips and 2 long-form edits, plus 6 ad creatives (4 static, 2 video), 20 social posts and 4 blogs.',
      custom: 'Bigger edit volume or a launch, with a written scope and fixed price before you pay.',
    },
    proof: {
      heading: 'What the clips show',
      paragraphs: [
        'EchoPulse has no published DTC brand result, so there are no sales figures here. The clips below show the cut and the pacing, not what a brand earned.',
        'The free sample is the real test. Send two of your own clips, see how they come back in 48 hours and compare them with what you post now.',
      ],
      links: [{ href: '/work?niche=dtc', label: 'See more DTC clips' }],
      showClips: true,
      clipsNote: 'Brand and talking-head edits from our work page.',
    },
    notFit: [
      'You want ads built and tested every month. That is the ad creatives service, which sits in Growth.',
      'You want product photography or a shoot. We edit footage and do not run shoots.',
      'You need three edits this month, not a plan. One-off edits are sold on the order page.',
    ],
    faq: [
      {
        q: 'Can you turn one creator video into several ads?',
        a: 'Yes. Send raw UGC or creator clips and we cut them into versions with different hooks, captions and formats for each platform.',
      },
      {
        q: 'What formats do you deliver?',
        a: 'Reels, TikTok and YouTube Shorts, with exports sized for each. Ratios and caption placement are handled for you.',
      },
      {
        q: 'What is the difference between this and your ad creatives?',
        a: 'Video editing cuts your footage into videos. Ad creatives is the monthly service that also covers static ads, hooks and a performance review, and it sits in Growth.',
      },
      {
        q: 'How fast is each edit?',
        a: `Within ${T48} per edit. If a drop date cannot move, say so before you send the footage.`,
      },
      {
        q: 'How do I send footage?',
        a: 'A shared Google Drive or Dropbox folder, set up for you. Upload raw footage with a two-line brief and we take it from there.',
      },
    ],
    posts: [
      { slug: 'ugc-creator-rates-vs-agency-cost', title: 'UGC Creator Rates vs Agency UGC: 2026 Costs' },
      { slug: 'ugc-creator-brief-template-fields', title: 'UGC Brief Template: Every Field, Copy and Paste' },
      { slug: 'ugc-ad-hook-scripts-by-product-category', title: '20 UGC Ad Hook Scripts by Product Category' },
      { slug: 'how-to-add-captions-reels-shorts-tiktok', title: 'How to Add Captions to Reels, Shorts and TikTok' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 11. business-owners / video-editing
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'business-owners',
    service: 'video-editing',
    buyer: 'business owners',
    serviceName: 'Video editing',
    metaTitle: 'Video Editing for Business Owners',
    metaDescription: `Job-site clips and talking-head videos of you and your work, edited with captions for social and your site in 48 hours. 2 free edits, then ${PRES_P} a month.`,
    capsule: `EchoPulse turns a business owner's phone footage, such as a job-site clip or a video of you answering what customers keep asking, into captioned short-form video for social and your website. Each edit comes back within ${T48}, and the first 2 are free. After that, Presence Engine is ${PRES_P} a month for 8 to 9 videos.`,
    getHeading: 'What an owner gets back',
    deliverables: [
      {
        title: 'Job-site clips',
        body: 'Phone footage of the work itself, cut into a captioned clip that shows what you do. Nobody has to talk.',
      },
      {
        title: 'You explaining it on camera',
        body: 'You, on your phone, answering what customers ask before they book an estimate. Cut tight, captioned and sized for a feed.',
      },
      {
        title: 'A brand film for the site',
        body: 'One longer video about the business for the home page or the about page.',
      },
      {
        title: 'Files that fit where they go',
        body: 'Vertical for social, horizontal for your site, delivered as MP4s. Tell us where each one is going.',
      },
    ],
    steps: [
      {
        title: 'Send a clip',
        body: `A job-site clip, a customer talk, a walk around the shop. 2 free edits come back within ${T48}, with no card and no call. You keep the files.`,
      },
      {
        title: `${PILOT_P} Pilot`,
        body: '14 days: 6 short-form edits, 2 posts, 1 blog, a content audit and a 30-day plan, after a recorded onboarding session.',
      },
      {
        title: `${PRES_P} a month`,
        body: 'A weekly call of 20 to 30 minutes, 8 to 9 short-form videos and up to 5 extra clips cut free from footage you already have. That is about two videos a week.',
      },
      {
        title: 'Cancel when it stops paying',
        body: 'Month-to-month, 14 days notice, and you keep everything made.',
      },
    ],
    ladder: {
      free: '2 short videos cut from a job-site clip or a talking-head recording you already have. Captions, pacing and music, ready to post.',
      pilot: '6 short-form edits, 2 posts, 1 SEO blog, a content audit and a 30-day plan. Includes a recorded onboarding session.',
      presence: '8 to 9 short-form videos a month, plus up to 5 extra clips cut free from footage you already have. Weekly call, shot list and a free website tune-up in month one.',
      growth: '12 short-form edits, 12 clips and 2 long-form edits, plus 20 social posts, 4 SEO blogs, 6 ad creatives and a site tuned every month.',
      custom: 'More video than Growth, or a site or build alongside, with a written scope and fixed price before you pay.',
    },
    proof: {
      heading: 'What the clips show',
      paragraphs: [
        'EchoPulse has no published result for a service business, so no lead numbers appear here.',
        'The better test is the free sample. Send two clips from your own phone and see what comes back in 48 hours.',
      ],
      links: [{ href: '/work?niche=business-owners', label: 'See more clips' }],
      showClips: true,
      clipsNote: 'Talking-head and brand edits from our work page.',
    },
    notFit: [
      'You can pay for one thing and you want inbound leads. Start with a fast site and search content, as on the business owners page, and add video after.',
      'You have nothing to film. Every plan edits footage you record, so if nobody can get a phone on a job site or in front of you, there is nothing to cut.',
      'You want a shoot with a crew. We edit footage and do not send a crew.',
    ],
    faq: [
      {
        q: 'Is phone footage good enough?',
        a: 'Yes. Upload what you have with a two-line note on the goal. We cut and caption it, and send a short shot list for the next round.',
      },
      {
        q: 'Do I have to be on camera?',
        a: 'No. Job-site clips need nobody to talk. Talking-head clips do, so you can start with one kind and add the other.',
      },
      {
        q: 'How fast is an edit?',
        a: `Within ${T48} per deliverable. If something has a real date on it, tell us before you send the footage.`,
      },
      {
        q: 'What does it cost for a business like mine?',
        a: `The first 2 edits are free. The Pilot is ${PILOT_P}, once. Presence Engine is ${PRES_P} a month. Our guide to video editing retainer cost shows what other providers charge.`,
      },
      {
        q: 'Who owns the videos?',
        a: 'You do. You keep everything we make, whether or not you continue.',
      },
    ],
    posts: [
      { slug: 'short-form-video-editing-cost-per-video', title: 'Short Form Video Editing Cost Per Video in 2026' },
      { slug: 'video-editing-retainer-cost-per-month', title: 'Video Editing Retainer Cost: $1,000 to $30,000 a Month' },
      { slug: 'how-to-film-talking-head-on-phone', title: 'How to Film a Talking Head on a Phone: 2026 Setup' },
      { slug: 'video-editing-turnaround-time', title: 'Same Day Video Turnaround: What Is Real and What Is Not' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 12. business-owners / websites-funnels
  // ─────────────────────────────────────────────────────────────────────────
  {
    icp: 'business-owners',
    service: 'websites-funnels',
    buyer: 'business owners',
    serviceName: 'Websites and funnels',
    metaTitle: 'Websites and Funnels for Business Owners',
    metaDescription:
      'A fast site for a service business with copy written by a person. A brand site takes 3 to 4 weeks, a landing page 1 to 2. Start with 2 free video edits.',
    capsule: `EchoPulse builds fast websites for service businesses, with the copy written by a person and a short lead form on every page that needs one. A brand site takes 3 to 4 weeks. The first 2 video edits are free, back within ${T48}, and Presence Engine at ${PRES_P} a month includes a free website tune-up in month one, plus Google Business Profile and structured data.`,
    getHeading: 'What an owner gets built',
    deliverables: [
      {
        title: 'A brand website',
        body: 'Home, about, services and contact pages built around what your customer is trying to decide. Built to load in under 2 seconds on mobile.',
      },
      {
        title: 'A short lead form',
        body: 'One clear action above the fold and a short form, so someone ready to book an estimate does not have to work for it.',
      },
      {
        title: 'Copy from a person',
        body: 'Every page is written for your business, with the copy and the layout built together.',
      },
      {
        title: 'Your tools connected',
        body: 'Calendar and CRM wired in, plus GA4, Meta Pixel and conversion events, so you can see which page produced a call.',
      },
      {
        title: 'Google Business Profile and structured data',
        body: 'Part of Presence Engine. It helps you show up on Google and in ChatGPT answers when people look for what you do in your service area.',
      },
    ],
    steps: [
      {
        title: 'A 15-minute walk through your site',
        body: 'We look at it with you, name what is costing you calls, and write a scope and fixed price. You keep the plan either way.',
      },
      {
        title: 'Strategy, copy and design',
        body: 'We pick the one thing a visitor should do, then write and lay out the pages together.',
      },
      {
        title: 'Build and launch',
        body: 'A brand site takes 3 to 4 weeks, a landing page 1 to 2, a custom Next.js build 4 to 6. We test on real phones before launch and watch conversion for 30 days.',
      },
      {
        title: 'Keep it working',
        body: `Presence Engine at ${PRES_P} a month includes a free website tune-up in month one, then upgrades. Growth at ${GROW_P} a month rebuilds the site in month one and tunes it every month.`,
      },
    ],
    ladder: {
      free: 'Not a site. The free sample is 2 video edits, and the clips can go on your new pages.',
      pilot: 'No site build. 6 short-form edits, 2 posts, 1 SEO blog, a content audit and a 30-day plan.',
      presence: 'A free website tune-up in month one, then ongoing upgrades. Pages, Google Business Profile and structured data, plus 8 to 9 videos a month.',
      growth: 'A site rebuilt in month one and tuned every month, funnel optimization with conversion tracking, plus 4 SEO blogs, 20 posts and 6 ad creatives.',
      custom: 'A stand-alone site or funnel build, with a written scope and fixed price before you pay. There is no published price for a stand-alone build.',
    },
    ladderNote: 'A stand-alone build is quoted on a call. The plans are for owners who also want content every month.',
    proof: {
      heading: 'The one published site rebuild',
      paragraphs: [
        'The rebuilt site for MagicBNB, a software company, went live on 5 May 2026. On 4 May it earned 13 Google impressions and on 5 May, 209. Daily impressions averaged 5.8 in April and 4,859 in the first 11 days of November.',
        'That is the result of the whole system, 219 articles and ads included, and the study says the site alone does not explain it. It also lists what is not working yet, such as a click-through rate under half a percent.',
      ],
      links: [{ href: '/case-studies/magicbnb-seo-aeo', label: 'Read the MagicBNB case study' }],
      showClips: false,
    },
    notFit: [
      'You need a site live this week. A brand website takes 3 to 4 weeks and a landing page 1 to 2.',
      'You sell products online and need a store. This page is for service businesses, so tell us on the call what you need.',
      'You want a site and nothing else for a small one-off fee. The plans assume content every month, and a stand-alone build is quoted on a call.',
    ],
    faq: [
      {
        q: 'How long does a website take?',
        a: 'A brand website takes 3 to 4 weeks, a landing page or funnel 1 to 2, and a custom Next.js build 4 to 6. The date is in writing before you pay.',
      },
      {
        q: 'Do you write the copy?',
        a: 'Yes. Conversion copywriting is part of every project, and we do not ship a good-looking site with weak copy.',
      },
      {
        q: 'Which platforms do you build on?',
        a: 'Next.js, Framer, Webflow, WordPress, Kajabi, GoHighLevel and ClickFunnels. We recommend one based on speed, how much you want to change yourself, and who will maintain it.',
      },
      {
        q: 'Why does the site matter if the content brings people in?',
        a: 'Content earns the visit, and the site has to turn it into an enquiry. A layout built around one action gives a ready visitor an obvious next step.',
      },
      {
        q: 'Who owns the site?',
        a: 'You do. You own the code and the domain.',
      },
    ],
    posts: [
      { slug: 'what-to-prepare-before-website-redesign', title: 'What to Prepare Before a Website Redesign: A Client Checklist' },
      { slug: 'inbound-leads-without-cold-outreach', title: 'How to Get Inbound Leads Without Cold Outreach' },
      { slug: 'google-business-profile-setup-checklist', title: 'Google Business Profile Setup Checklist (Official Rules)' },
      { slug: 'local-seo-pricing-for-service-businesses', title: 'Local SEO Pricing in 2026: What Agencies Actually Charge' },
    ],
  },
];

export const NICHE_PAGES: NichePage[] = RAW_PAGES.map((p) => ({ ...p, h1: nicheH1(p.icp, p.service) }));

export function getNichePage(icp: string, service: string): NichePage | undefined {
  return NICHE_PAGES.find((p) => p.icp === icp && p.service === service);
}

export function nichePagesForIcp(icp: string): NichePage[] {
  return NICHE_PAGES.filter((p) => p.icp === icp);
}

export function nichePagesForService(service: string): NichePage[] {
  return NICHE_PAGES.filter((p) => p.service === service);
}

export function nichePath(p: Pick<NichePage, 'icp' | 'service'>): string {
  return `/${p.icp}/${p.service}`;
}
