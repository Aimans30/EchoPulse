/**
 * Copy for the two search landing pages. Every EchoPulse fact here comes
 * from lib/pricing.ts (prices and scope), the owner's answers of 25 Nov 2026
 * (we schedule and post approved pieces; comments and DMs are not included)
 * or the published case studies in lib/caseStudyData.ts. Competitor prices
 * in `compare` were read on the vendor's own page on the date in
 * `compare.checked`; re-check them before that date is 90 days old.
 *
 * No em or en dashes in copy (house style).
 */
import { PRESENCE, GROWTH, PILOT } from './pricing';

export type CompareRow = {
  name: string;
  bestFor: string;
  what: string;
  price: string;
  term: string;
  href?: string;
  /** EchoPulse's own row, visually marked. */
  ours?: boolean;
};

export type LandingPage = {
  slug: string;
  /** Prefix for analytics `location` values, e.g. "pb" gives pb_hero_primary. */
  track: string;
  metaTitle: string;
  metaDescription: string;
  serviceType: string;
  audience: string;
  hero: {
    eyebrow: string;
    line1: string;
    line2Plain: string;
    line2Accent: string;
    sub: string;
    subStrong: string;
    stats: { value: string; label: string }[];
  };
  answer: { question: string; text: string[] };
  getEyebrow: string;
  getHeading: string;
  gets: { title: string; body: string }[];
  notIncluded: string[];
  compare: {
    question: string;
    intro: string;
    checked: string;
    rows: CompareRow[];
    note: string;
  };
  steps: { title: string; body: string }[];
  proofHeading: string;
  proof: { label: string; title: string; body: string; href: string; link: string }[];
  proofNote: string;
  forYou: string[];
  notForYou: string[];
  faqHeading: string;
  faq: { q: string; a: string }[];
};

const P = PRESENCE.priceLabel; // $399
const G = GROWTH.priceLabel; // $1,997
const PI = PILOT.priceLabel; // $299

const echoRow: CompareRow = {
  name: 'EchoPulse Presence Engine',
  bestFor: 'Founders and owners who want it done every week',
  what: 'Done for you: plan, film with you, edit, write, post, website kept current',
  price: `${P} a month`,
  term: 'Month to month',
  ours: true,
};

const sharedSteps = [
  {
    title: 'See the work first',
    body: 'Send footage you already have and get 2 edited videos back within 48 hours of us receiving the footage, free, with no card. Or book 15 minutes with Lakshya, the founder.',
  },
  {
    title: 'A call every week',
    body: 'A 20 to 30 minute call plans the week, goes over the numbers and decides what to improve. You get a shot list for the week.',
  },
  {
    title: 'Every week after',
    body: 'You film from the list or send what you already recorded. We edit, write, schedule and post. You approve before anything goes out.',
  },
  {
    title: 'Between calls',
    body: 'Replies come within 3 hours in the workday, so a question never waits for the next call.',
  },
];

export const PERSONAL_BRANDING: LandingPage = {
  slug: 'affordable-personal-branding-for-founders',
  track: 'pb',
  metaTitle: `Affordable Personal Branding for Founders: ${P} a Month`,
  metaDescription: `Done-for-you personal branding for founders at ${P} a month: weekly videos, photo and carousel posts, posting and your website kept current. Month to month. Start with 2 free edits.`,
  serviceType: 'Personal branding for founders',
  audience: 'Founders, coaches and business owners',
  hero: {
    eyebrow: 'Affordable personal branding for founders',
    line1: 'Personal branding',
    line2Plain: 'for founders, ',
    line2Accent: `${P} a month.`,
    sub: 'Every week we plan what you film, edit it, write your posts, publish them and keep your website current.',
    subStrong: 'Start with 2 free edits.',
    stats: [
      { value: P, label: 'a month, month to month' },
      { value: '8 to 9', label: 'short videos a month' },
      { value: '8', label: 'photo or carousel posts a month' },
      { value: '3h', label: 'reply window every workday' },
    ],
  },
  answer: {
    question: 'What does affordable personal branding for a founder cost?',
    text: [
      `Of the founder branding services we found that publish a price, the lowest monthly plan was $650 (Windmill Growth), ongoing programmes started at $2,000 to $5,000 a month (Brand of a Leader, Sculpt, whose full-service social programmes start at $10,000), and strategy projects started at $15,000 (Sculpt) and $21,000 (SimplyBe). EchoPulse's Presence Engine is ${P} a month, month to month. Prices read on 25 November 2026.`,
      `The gap is mostly scope. The higher prices buy strategy, PR, speaking or outbound. ${P} buys the weekly work that makes a founder visible: a planning call, 8 to 9 short videos, 8 photo or carousel posts, posting, and a website that is kept current.`,
    ],
  },
  getEyebrow: `What ${P} a month covers`,
  getHeading: 'The whole job, every week, by one team.',
  gets: [
    { title: 'A weekly call', body: '20 to 30 minutes to plan the week, go over the numbers and decide what to change.' },
    { title: 'What to film, decided for you', body: 'A monthly content calendar, a weekly shot list and help filming, so you never sit in front of a camera wondering what to say.' },
    { title: '8 to 9 short videos', body: 'Short-form videos edited to perform, every month. Plus up to 5 extra clips a month cut from footage you already have, free.' },
    { title: '8 photo or carousel posts', body: 'Photo or carousel posts with captions ready, so your feed is not only video.' },
    { title: 'Posted for you', body: 'A posting plan for what goes where and when, and we schedule and post every piece you approve. You do not touch a scheduler.' },
    { title: 'Your website and Google profile', body: 'A free website tune-up in month one, then ongoing upgrades, plus pages, your Google Business Profile and structured data so you show up on Google and ChatGPT.' },
  ],
  notIncluded: [
    'Replying to comments and DMs. Those conversations are yours.',
    'PR, press placements and speaking bookings.',
    `Long-form blogs and ad creative. Those start in Growth at ${G} a month.`,
  ],
  compare: {
    question: 'How do personal branding services for founders compare on price?',
    intro: 'Prices below were read on each company\'s own website. Where a company does not publish a price, the table says so instead of guessing.',
    checked: '25 November 2026',
    rows: [
      { name: 'Windmill Growth', bestFor: 'Founders who want LinkedIn engagement and outbound handled', what: 'Growth ($650): inbound and outbound engagement, a success manager and monthly analytics. LinkedIn Outbound is $999. Founder OS ($3,999 a month) adds up to 5 posts a week and inbox management', price: 'From $650 a month', term: 'Not published', href: 'https://windmillgrowth.com/' },
      { name: 'Brand of a Leader', bestFor: 'Founders and executives who want coaching on their brand', what: 'Thought leadership visibility programme. LinkedIn profile rebrand $1,000 one-off', price: '$2,000 a month', term: 'Not published', href: 'https://www.brandofaleader.com/' },
      { name: 'Sculpt', bestFor: 'B2B companies with an executive programme', what: 'Executive strategy enablement: consulting and thought leadership content support', price: 'From $5,000 a month', term: 'Not published', href: 'https://wearesculpt.com/services/social-media-marketing/' },
      { name: 'Prestidge Group', bestFor: 'C-level executives who want press and speaking', what: 'Executive visibility. The figure is a budget floor in its enquiry form, not a price list', price: 'Budget above $4,000 a month', term: 'Not published', href: 'https://prestidgegroup.com/packages' },
      { name: 'SimplyBe', bestFor: 'Leaders who want a strategy roadmap and have in-house staff to carry it out', what: 'Strategy project, 6 to 12 weeks', price: 'From $21,000 per project', term: 'Project', href: 'https://simplybeagency.com/about' },
      { name: 'Claire Bahn Group', bestFor: 'C-suite leaders and investors', what: 'Executive branding services', price: 'Not published', term: '3 months', href: 'https://clairebahn.com/executive-branding-services/' },
      { ...echoRow, what: 'Done for you: weekly call, 8 to 9 short videos, 8 photo or carousel posts, scheduled and posted, website kept current' },
    ],
    note: 'EchoPulse is on this list and competes with the others. Every other row links to the page the figure came from, so you can check it.',
  },
  steps: sharedSteps,
  proofHeading: 'What is public, so you can check us',
  proof: [
    {
      label: 'Founder story',
      title: 'Edited for 200+ Canadian real estate agents',
      body: 'Before EchoPulse, Lakshya was an editor at a Canadian real estate media company, cutting listing tours and agent personal brand videos for more than 200 agents. A background, not a client result.',
      href: '/case-studies/founder-200-real-estate-agents',
      link: 'Read the founder story',
    },
    {
      label: 'MagicBNB, SaaS',
      title: '5.8 to 4,803 Google impressions a day',
      body: 'Average daily impressions went from 5.8 in April 2026 to 4,803 in early November, with the Search Console export on the page and what did not work.',
      href: '/case-studies/magicbnb-seo-aeo',
      link: 'Read the MagicBNB case study',
    },
    {
      label: 'Working With God, coaching',
      title: 'A coach\'s site, rebuilt and owned',
      body: 'Moved off a shared platform onto a site the coach owns. The monthly platform bill went from $50 to $60 down to $0, for a one-time $599.',
      href: '/case-studies/working-with-god-rebuild',
      link: 'Read the case study',
    },
  ],
  proofNote: 'No public reviews yet. We would rather say that than invent them.',
  forYou: [
    'You sell something people buy because they trust you: a service, a practice, a product you founded.',
    'You can give one call a week and some footage, and want everything else handled.',
    'You want to show up every week on the platforms your buyers use, not in bursts.',
  ],
  notForYou: [
    'You want PR, press features or a speaking agent.',
    'You want a strategy deck and will do the work yourself.',
    'You want someone to answer your DMs and comments for you.',
  ],
  faqHeading: 'Questions founders ask before they start',
  faq: [
    {
      q: `Is ${P} a month really enough for personal branding?`,
      a: `For showing up every week, yes: ${P} covers the weekly call, 8 to 9 short videos, 8 photo or carousel posts, posting and your website. It does not cover PR, ads or replying to comments, which are not part of this plan.`,
    },
    {
      q: 'Do I have to be on camera?',
      a: 'Video works best with your face in it, and we plan and help with every shoot. If you are not ready, up to 5 extra clips a month can come from podcasts, talks or calls you already recorded, and the 8 posts need no filming.',
    },
    {
      q: 'Do you post it for me?',
      a: 'Yes. We schedule and post every piece you approve, on a plan we agree on the first call. Nothing goes out without your approval.',
    },
    {
      q: 'Is there a contract?',
      a: 'No contract. The Presence Engine is month to month.',
    },
    {
      q: 'How is this different from hiring a LinkedIn ghostwriter?',
      a: 'A ghostwriter writes posts. This covers the posts, the short videos, the filming plan, the posting and your website, run by one team with one weekly call.',
    },
    {
      q: 'What if I need more than this?',
      a: `Growth at ${G} a month adds 20 social posts, 4 long-form blogs, 12 short-form edits plus 12 clips and 2 long-form edits, and 6 ad creatives a month.`,
    },
    {
      q: 'How do I start?',
      a: `Get 2 free edits from footage you already have, book a free 15-minute call, or run the ${PI} Pilot for 14 days and keep everything made.`,
    },
  ],
};

export const SOCIAL_MEDIA: LandingPage = {
  slug: 'done-for-you-social-media-management',
  track: 'smm',
  metaTitle: `Done-for-You Social Media Management: ${P} a Month`,
  metaDescription: `Done-for-you social media management for ${P} a month: 8 to 9 short videos and 8 photo or carousel posts, scheduled and posted for you, plus your website kept current. Month to month.`,
  serviceType: 'Done-for-you social media management',
  audience: 'Business owners, founders and coaches',
  hero: {
    eyebrow: 'Done-for-you social media management',
    line1: 'Your social media,',
    line2Plain: 'handled. ',
    line2Accent: `${P} a month.`,
    sub: 'We plan it, help you film it, edit it, write it and post it. 8 to 9 short videos and 8 posts every month, plus your website kept current. Month to month.',
    subStrong: 'Start with 2 free edits.',
    stats: [
      { value: P, label: 'a month, month to month' },
      { value: '8 to 9', label: 'short videos posted a month' },
      { value: '8', label: 'photo or carousel posts' },
      { value: '3h', label: 'reply window every workday' },
    ],
  },
  answer: {
    question: 'How much does done-for-you social media management cost?',
    text: [
      `Of the services we found that publish a monthly price, done-for-you social media management ran from $99 a month for 10 posts on one channel ($99 Social) to $3,150 a month and up (WebFX). The cheapest package we found that bundles edited reels with posting was $499 (255 Advertising). $99 Social also sells short videos as an add-on, 4 a month from $99. Prices read on 25 November 2026.`,
      `EchoPulse is ${P} a month, month to month, for 8 to 9 short videos and 8 photo or carousel posts, scheduled and posted for you, plus your website kept current. Replying to comments and DMs is not included.`,
    ],
  },
  getEyebrow: `What ${P} a month covers`,
  getHeading: 'From an idea to a posted video, without you in the middle.',
  gets: [
    { title: 'A plan every month', body: 'A monthly content calendar and a weekly shot list, so every week starts with a plan instead of a blank page.' },
    { title: 'Help filming', body: 'The weekly shot list says what to film, and we help you film it. You do not have to work out what to say.' },
    { title: '8 to 9 short videos', body: 'Short-form videos edited to perform, every month. Plus up to 5 extra clips a month cut from footage you already have, free.' },
    { title: '8 photo or carousel posts', body: 'Photo or carousel posts with captions ready, so the feed is not only video.' },
    { title: 'Scheduled and posted', body: 'We schedule and post every piece you approve, on a posting plan that says what goes where and when.' },
    { title: 'Your website kept current', body: 'A free tune-up in month one and ongoing upgrades, plus your Google Business Profile, so people who find you on social find a site that works.' },
  ],
  notIncluded: [
    'Replying to comments and DMs (community management). Those stay with you.',
    'Running or managing paid ads.',
    `Long-form blogs and ad creative. Those start in Growth at ${G} a month.`,
  ],
  compare: {
    question: 'How do done-for-you social media management prices compare?',
    intro: 'Monthly package prices below were read on each company\'s own website. Check what each includes: some count every platform separately, some include replying to comments, some lock you in.',
    checked: '25 November 2026',
    rows: [
      { name: '$99 Social', bestFor: 'Tight budgets that want static posts on one channel', what: '10 posts a month on 1 channel, scheduled and posted. Extra channels $10 each', price: '$99 a month (30 posts: $279)', term: 'No contract, 7 days notice to cancel', href: 'https://www.99dollarsocial.com/pricing' },
      { name: 'DreamHost Pro Services', bestFor: 'Small businesses posting to Facebook, Twitter and Instagram', what: 'Startup: 10 posts each on Facebook, Twitter and Instagram, published for you. Business ($599) adds 10 LinkedIn posts, 20 Instagram Stories and 5 GIFs and videos', price: 'From $399 a month', term: 'Not stated', href: 'https://www.dreamhost.com/pro-services/marketing/social-media-marketing/' },
      { name: '255 Advertising', bestFor: 'Local businesses that also want Meta ads', what: 'Starter: 6 custom designs, 2 professional and 2 edited reels, scheduling and publishing, Meta ads campaign setup and management', price: 'From $499 a month', term: 'Month to month', href: 'https://www.255adv.com/services/social-media-management/pricing' },
      { name: 'Design for Online (UK)', bestFor: 'UK businesses that want comments handled', what: '3 posts a week on 2 channels, with community management', price: '£365 a month', term: 'Price card says a 3-month initial term; its FAQ says month to month', href: 'https://designforonline.com/social-media-management/social-management-pricing/' },
      { name: 'WebFX', bestFor: 'Larger companies that want an account team', what: 'Social post creation, custom graphics and a dedicated account manager', price: 'From $3,150 a month', term: 'Not stated', href: 'https://www.webfx.com/social-media/pricing/' },
      { ...echoRow, bestFor: 'Owners who want video-led social run every week', what: '8 to 9 short videos and 8 photo or carousel posts, scheduled and posted, website kept current. Comments and DMs stay with you' },
    ],
    note: 'EchoPulse is on this list and competes with the others. Every other row links to the page the figure came from.',
  },
  steps: sharedSteps,
  proofHeading: 'What is public, so you can check us',
  proof: [
    {
      label: 'Whites & Brights, laundry chain',
      title: 'Reels and posts for a laundry chain',
      body: 'EchoPulse runs the Instagram and Facebook content for a multi-outlet laundry chain in Patna: AI-generated video reels, animated explainers and campaign posts, each one ending on WhatsApp and the website. Disclosure: an EchoPulse partner is a director of the client company.',
      href: '/case-studies/whites-and-brights-operating-system',
      link: 'See the work and the disclosure',
    },
    {
      label: 'Founder story',
      title: 'Edited for 200+ Canadian real estate agents',
      body: 'Before EchoPulse, Lakshya was an editor at a Canadian real estate media company, cutting listing tours and agent personal brand videos for more than 200 agents. A background, not a client result.',
      href: '/case-studies/founder-200-real-estate-agents',
      link: 'Read the founder story',
    },
  ],
  proofNote: 'No public reviews yet. We would rather say that than invent them.',
  forYou: [
    'You run a business and know you should post every week, but it keeps slipping.',
    'You can spare a few minutes of filming and one short call a week.',
    'You want one team for the videos, the posts and the website, not three freelancers.',
  ],
  notForYou: [
    'You need someone to reply to every comment and DM.',
    'You want paid ads run and optimised. That is a different job.',
    'You want 30 posts a day across ten accounts.',
  ],
  faqHeading: 'Questions owners ask before handing over their social media',
  faq: [
    {
      q: 'Do you actually post for us?',
      a: 'Yes. We schedule and post every piece you approve, on the posting plan we agree. Nothing goes out without your approval.',
    },
    {
      q: 'Do you reply to comments and DMs?',
      a: 'No. Community management is not included. Replies to your buyers should come from you, and we would rather say so up front.',
    },
    {
      q: 'How much content do we get each month?',
      a: '8 to 9 short videos and 8 photo or carousel posts, plus up to 5 extra clips cut from footage you already have.',
    },
    {
      q: 'Do we need to film?',
      a: 'A little, most weeks. You get a shot list and help, and extra clips can come from footage you already have.',
    },
    {
      q: 'Is there a contract?',
      a: 'No contract. It is month to month.',
    },
    {
      q: 'What if we need more?',
      a: `Growth at ${G} a month adds 20 social posts, 4 long-form blogs, 12 short-form edits plus 12 clips and 2 long-form edits, and 6 ad creatives a month.`,
    },
    {
      q: 'How do we start?',
      a: `Get 2 free edits from footage you already have, book a free 15-minute call, or run the ${PI} Pilot for 14 days and keep everything made.`,
    },
  ],
};
