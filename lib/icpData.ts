import type { IcpKey } from './videos';

// ─── ICP landing-page data ───────────────────────────────────────────────────
// One entry per audience landing page (/real-estate, /founders, etc.). These
// are standalone outbound pages — you send a broker the /real-estate link, a
// SaaS founder the /founders link. Each is written to ONE specific pain, with
// hard, sourced industry stats near the hero (see echopulse-icp-service-mapping.md).
//
// Stats here are INDUSTRY figures showing the opportunity — never framed as
// "results we got you". Framing stays "here's what's true in your market".

export interface IcpStat {
  /** The big number, e.g. "403%" or "70%". */
  value: string;
  /** One-line context under the number. */
  label: string;
}

export interface IcpService {
  /** Matches a slug in lib/serviceData.ts so we can deep-link the service page. */
  slug: string;
  name: string;
  /** Why this service matters for THIS segment, one tight line. */
  why: string;
  /** 'Core' | 'High' | 'Medium' — drives the priority badge. */
  weight: 'Core' | 'High' | 'Medium';
}

export interface IcpData {
  key: IcpKey;
  /** Display name for breadcrumbs / schema. */
  name: string;
  /** Lucide icon name used on the page eyebrow (kept in client map). */
  icon: 'home' | 'rocket' | 'graduation' | 'shopping' | 'briefcase';
  accentColor: string;
  /** <title> + OG title. */
  metaTitle: string;
  /** <meta description>. SEO-optimized, keyword-rich, under ~158 chars. */
  metaDescription: string;
  /** Eyebrow above the hero headline. */
  eyebrow: string;
  /** H1 — written to the segment's specific frustration. */
  heroHeadline: string;
  /** Optional accented fragment shown in the brand orange within the H1. */
  heroHeadlineAccent?: string;
  /** Sub-headline under the H1. */
  heroSub: string;
  /** Up to 4 hard proof stats shown near the hero. */
  stats: IcpStat[];
  /** The before → after transformation, two short strings. */
  transformFrom: string;
  transformTo: string;
  /** Services in priority order — lead with Core, then Highs. */
  services: IcpService[];
  /** The recommended starting combination, plain sentence. */
  starterStack: string;
  /** 3–5 segment-specific FAQs (also emitted as FAQPage JSON-LD). */
  faq: { q: string; a: string }[];
}

export const icps: IcpData[] = [
  // ── 1. Real Estate Agents — strongest data-backed segment ──────────────────
  {
    key: 'real-estate',
    name: 'Real Estate Agents',
    icon: 'home',
    accentColor: '#f59e0b',
    metaTitle: 'Real Estate Video Editing & Listing Marketing | EchoPulse Media',
    metaDescription:
      'Cinematic property reels, listing walkthroughs, personal-brand video, and ads that book viewings. Listings with video get up to 403% more inquiries. You shoot, we edit, you list.',
    eyebrow: 'For Real Estate Agents & Brokerages',
    heroHeadline: 'Nine in ten agents skip video.',
    heroHeadlineAccent: 'Be the one who does.',
    heroSub:
      'Cinematic property reels, listing walkthroughs, personal-brand video, and Meta ads that book viewings — not just rack up views. You shoot or we direct, we edit, you list.',
    stats: [
      { value: '403%', label: 'more inquiries on listings marketed with video (NAR)' },
      { value: '73%', label: 'of sellers prefer an agent who uses video — up from 63% in 2021' },
      { value: '1 in 10', label: 'agents actually create listing videos. That gap is your edge.' },
      { value: '48 hr', label: 'standard edit turnaround per deliverable' },
    ],
    transformFrom: 'You post the odd phone photo and hope the listing moves.',
    transformTo:
      'Every listing ships with a cinematic reel and an ad behind it — and viewings book while you are showing another house.',
    services: [
      { slug: 'video-editing',      name: 'Real Estate & Cinematic Video', why: 'Property reels, listing walkthroughs, and personal-brand video. The whole ballgame for agents.', weight: 'Core' },
      { slug: 'ad-creatives',       name: 'Ad Creatives',                  why: 'Turn the reels into Meta and Instagram ads that book viewings, not just collect views.',           weight: 'High' },
      { slug: 'linkedin-ghostwriting', name: 'Social & Personal Brand',     why: 'Consistent posting so you stay top-of-mind for referrals between listings.',                       weight: 'Medium' },
      { slug: 'websites-funnels',   name: 'Listing & Lead Pages',          why: 'A fast listing and lead-capture page — most buyers start on mobile and bounce on slow sites.',     weight: 'Medium' },
      { slug: 'automations',        name: 'Lead Automations',              why: 'Inquiry-to-booked-viewing flows so leads never sit in a DM overnight.',                            weight: 'Medium' },
    ],
    starterStack: 'Start with Listing Video + Ad Creatives. Add personal-brand social once the listing flow is humming.',
    faq: [
      { q: 'Do I have to shoot the footage myself?', a: 'Either works. If you have a phone or a drone and a steady hand, shoot it and send us the raw clips — we will guide you on what to capture. If you would rather not, we direct the shot list so a local videographer (or you) captures exactly what the edit needs. Then we handle the cinematic edit, captions, music, and exports.' },
      { q: 'How fast do I get a listing reel back?', a: 'Standard turnaround is 48 hours per deliverable. For a hot listing that needs to go live same-day, rush 24-hour delivery is available at a 30 percent surcharge.' },
      { q: 'Can you make ads from the listing videos too?', a: 'Yes. We cut the reel into Meta and Instagram ad variants built to book viewings — proper aspect ratios, hooks in the first two seconds, and a clear call to action. Ads are a separate line item from the edit.' },
      { q: 'What formats do you deliver for?', a: 'Vertical reels for Instagram, TikTok, and YouTube Shorts; horizontal cuts for YouTube and listing-site embeds; and MLS/portal-ready MP4 exports. One shoot, every format you list on.' },
      { q: 'I tried a videographer once and the turnaround killed me. How is this different?', a: 'That is the exact frustration this is built for. You get a 48-hour standard cycle, a shared folder you drop footage into, revisions until you are satisfied, and one team that knows real estate shot grammar — not a one-off freelancer you have to re-brief every time.' },
    ],
  },

  // ── 2. Founders & Operators — core segment ─────────────────────────────────
  {
    key: 'founders',
    name: 'Founders & Operators',
    icon: 'rocket',
    accentColor: '#E8541A',
    metaTitle: 'Founder-Led Content Agency: LinkedIn, Video & Blogs | EchoPulse Media',
    metaDescription:
      'One team for your LinkedIn, short-form video, blogs, and ads. Founder-led content that builds pipeline while you run the company. Stop managing five freelancers.',
    eyebrow: 'For SaaS, Agency & Consulting Founders',
    heroHeadline: 'Stop reviewing five freelancers.',
    heroHeadlineAccent: 'Run the business.',
    heroSub:
      'We handle your LinkedIn, short-form video, blog, and ads as one team. You stay the founder — not the production manager stitching it together at 11pm.',
    stats: [
      { value: '70%', label: 'of the B2B buy is complete before a buyer talks to sales' },
      { value: '3+', label: 'pieces of content consumed before a buyer books a call' },
      { value: '1', label: 'team, one bill — instead of five vendors you project-manage' },
      { value: '20–30 hrs', label: 'a week back, off the content treadmill' },
    ],
    transformFrom: 'You are the content team — editor, ghostwriter, blogger, ad guy — and you are burnt out.',
    transformTo:
      'One team ships your LinkedIn, video, blog, and ads. You review, you do not produce. The pipeline runs whether you post that day or not.',
    services: [
      { slug: 'linkedin-ghostwriting', name: 'LinkedIn & Social',  why: "The engine. LinkedIn pushes personal profiles far harder than company pages — founder-led content is where pipeline starts.", weight: 'Core' },
      { slug: 'video-editing',         name: 'Short-Form Video',   why: 'Face-to-camera clips build the trust that closes long B2B cycles, and video out-pulls text on the feed.',                weight: 'High' },
      { slug: 'blog-production',       name: 'Blog Production',     why: 'The SEO layer buyers hit when they research you mid-cycle. Ranks, compounds, feeds the pre-call research habit.',          weight: 'High' },
      { slug: 'automations',           name: 'Automations',        why: 'DM flows and CRM glue so inbound interest gets routed and nothing leaks.',                                              weight: 'High' },
      { slug: 'ad-creatives',          name: 'Ad Creatives',       why: 'Amplify the winners once organic proves what resonates.',                                                               weight: 'Medium' },
      { slug: 'websites-funnels',      name: 'Websites & Funnels', why: 'The destination that converts the attention into booked calls.',                                                        weight: 'Medium' },
    ],
    starterStack: 'Start with LinkedIn & Social + Short-Form Video + Blog. Add Automations once volume justifies it.',
    faq: [
      { q: 'Will the content actually sound like me, not a generic ghostwriter?', a: 'That is the whole point. We open with a 90-minute Voice Foundation interview to pull your actual words, opinions, and hot takes, then build a brand brief every writer and editor reads before touching a draft. If the first batch does not sound like you, we redo it — no charge.' },
      { q: 'I already work with a freelancer or two. Can you slot in?', a: 'Yes. Plenty of founders start by handing us the channel that is eating the most of their time — usually LinkedIn or video — and expand once they see the work. You do not have to fire anyone to start.' },
      { q: 'How much of my time does this take each month?', a: 'After onboarding, most founders spend 2 to 3 hours a month with us: one strategy call, batched approvals, and sending raw footage for video. The heavy lift is the onboarding interview up front. After that, you approve, we produce.' },
      { q: 'Do you lock me into a contract?', a: 'No. After the $299 14-day Pilot, plans are month-to-month — cancel with 30 days notice. We would rather earn the next month than trap you in it.' },
    ],
  },

  // ── 3. Coaches & Course Creators ───────────────────────────────────────────
  {
    key: 'coaches',
    name: 'Coaches & Course Creators',
    icon: 'graduation',
    accentColor: '#8b5cf6',
    metaTitle: 'Content & Funnels for Coaches & Course Creators | EchoPulse Media',
    metaDescription:
      'Pre-launch content, evergreen short-form, ad creative, and the funnel that nurtures and sells while you teach. Fill your cohort without living in the DMs.',
    eyebrow: 'For Coaches & Course Creators',
    heroHeadline: 'Fill your cohort',
    heroHeadlineAccent: 'without living in the DMs.',
    heroSub:
      'Pre-launch content, evergreen short-form, ad creative, and the funnel that nurtures and sells while you teach. The machine runs when your energy does not.',
    stats: [
      { value: '~2x', label: 'qualified leads from a lead-magnet funnel vs a plain landing page' },
      { value: 'Multiples', label: 'higher conversion from warm, nurtured audiences vs cold traffic' },
      { value: 'Evergreen', label: 'content fills the top of funnel without you filming daily' },
      { value: '48 hr', label: 'standard edit turnaround per deliverable' },
    ],
    transformFrom: 'Every launch is a manual sprint — heads-down filming or heads-down selling, never both — and revenue swings with your energy.',
    transformTo:
      'Evergreen content fills the funnel, the nurture sequence does the selling, and cohorts fill without you in the DMs.',
    services: [
      { slug: 'websites-funnels',      name: 'Funnels & Lead Pages', why: 'The core. Lead magnet → opt-in → nurture → booking page. This is what turns scattered content into enrolled students.', weight: 'Core' },
      { slug: 'video-editing',         name: 'Short-Form Video',     why: 'Evergreen clips that fill the top of funnel daily — without you filming daily.',                                       weight: 'High' },
      { slug: 'automations',           name: 'Automations',          why: 'Email nurture and DM flows. Warm audiences convert at multiples of cold, and it runs without you in the loop.',         weight: 'High' },
      { slug: 'ad-creatives',          name: 'Ad Creatives',         why: 'Drive cold traffic into the lead magnet — not straight at the offer.',                                                 weight: 'Medium' },
      { slug: 'linkedin-ghostwriting', name: 'Social & Authority',   why: 'Authority content and pre-launch warming so cohorts open to a primed audience.',                                       weight: 'Medium' },
      { slug: 'blog-production',       name: 'Blog Production',       why: 'Evergreen organic discovery for coaches who want SEO, not just paid.',                                                 weight: 'Medium' },
    ],
    starterStack: 'Start with Funnel + Automations (nurture) + Short-Form Video. Add Ad Creatives to scale once the funnel converts.',
    faq: [
      { q: 'I already have a course platform. Do you replace it?', a: 'No — we build the funnel that feeds it. Lead magnet, opt-in, nurture sequence, and booking or sales page that pours warm leads into the platform you already use (Kajabi, Teachable, Thinkific, Skool, and the rest).' },
      { q: 'Can you edit my course modules too, not just marketing content?', a: 'Yes. Module editing — lecture cuts, lower thirds, chapter markers, branded intros — is part of our video service, alongside the evergreen short-form that fills your funnel.' },
      { q: 'How does the nurture actually sell without me?', a: 'We map an email and DM sequence that warms a lead from the lead magnet to the offer over a series of touches. Warm, nurtured audiences convert several times higher than cold traffic hitting a sales page cold — that sequence runs on autopilot while you teach.' },
      { q: 'I launch live a few times a year. Does this fit?', a: 'It makes live launches easier. Evergreen content and a nurture funnel keep the audience warm between launches, so when you open the cart you are selling to a primed list instead of starting from zero each time.' },
    ],
  },

  // ── 4. DTC & E-Commerce ────────────────────────────────────────────────────
  {
    key: 'dtc',
    name: 'DTC & E-Commerce',
    icon: 'shopping',
    accentColor: '#10b981',
    metaTitle: 'Subscription Ad Creative for DTC & E-Commerce | EchoPulse Media',
    metaDescription:
      'Fresh static and video ad creative every week on subscription, plus store, funnels, and email. Beat creative fatigue and keep your CPA sane.',
    eyebrow: 'For DTC & E-Commerce Brands',
    heroHeadline: 'Creative dies in days.',
    heroHeadlineAccent: 'We refill the tank on subscription.',
    heroSub:
      'Fresh static and video ads every week, plus the store, the funnels, and the email. Fatigue stops killing your CPA — you test, the winners scale.',
    stats: [
      { value: '7–14 days', label: 'typical TikTok creative lifespan before fatigue sets in' },
      { value: '~3.0', label: 'ad frequency past this reliably drags CTR down' },
      { value: '15–25', label: 'active variants performance teams run per campaign' },
      { value: 'UGC', label: 'style ads consistently beat polished brand content on CPM' },
    ],
    transformFrom: 'You burn through creative every two weeks and scramble — by the time you brief a new batch, the current CPA has already spiked.',
    transformTo:
      'Fresh static and video variants land on a subscription. You test, the winners scale, and CPA stays sane.',
    services: [
      { slug: 'ad-creatives',     name: 'Ad Creatives (Subscription)', why: 'The core. Fresh hooks shipped before fatigue kills CPA — this segment exists for this service.', weight: 'Core' },
      { slug: 'video-editing',    name: 'UGC & Short-Form Video',      why: 'UGC-style variants that out-perform polished brand content on cost and conversion.',             weight: 'High' },
      { slug: 'websites-funnels', name: 'Store & Landing Pages',       why: "Post-click experience that does not waste the click you paid for.",                              weight: 'High' },
      { slug: 'automations',      name: 'Email & SMS Flows',           why: 'Abandoned cart and post-purchase flows where the real margin lives.',                            weight: 'Medium' },
      { slug: 'linkedin-ghostwriting', name: 'Brand & Social',         why: 'Organic presence and founder/brand story for brands that want it.',                              weight: 'Medium' },
      { slug: 'blog-production',  name: 'SEO Content',                 why: 'Product and education content for brands playing the organic long game.',                        weight: 'Medium' },
    ],
    starterStack: 'Start with the Ad Creatives subscription + Video Editing. Add Email/SMS automations to lift LTV.',
    faq: [
      { q: 'How many ad variants do I get per month?', a: 'It depends on the plan, but the model is built around volume — performance teams typically run 15 to 25 active variants per campaign, and subscription production is what makes that cadence affordable. We agree on a monthly batch size up front and ship fresh hooks before the current ones fatigue.' },
      { q: 'Do you do UGC-style ads or only polished brand content?', a: 'Both — and we lean into UGC-style for performance because it consistently beats polished brand content on CPM and conversion. We mix formats and let the testing data decide what scales.' },
      { q: 'Can you edit the footage we already have from creators?', a: 'Yes. Send us raw UGC, product footage, or creator clips and we cut them into multiple ad variants with different hooks, captions, and formats for each platform.' },
      { q: 'Do you manage the ad spend too?', a: 'Our core is the creative engine — the assets that beat fatigue. We work alongside your media buyer (or can advise on structure), but the subscription is built to keep your creative pipeline full, not to run your ad account.' },
    ],
  },

  // ── 5. Business Owners ─────────────────────────────────────────────────────
  {
    key: 'business-owners',
    name: 'Business Owners',
    icon: 'briefcase',
    accentColor: '#3b82f6',
    metaTitle: 'Inbound Lead Generation for Local & Service Businesses | EchoPulse Media',
    metaDescription:
      'SEO content that ranks, a conversion-built website, and automations that catch every lead. Get inbound leads instead of chasing cold ones.',
    eyebrow: 'For Local & Service Business Owners',
    heroHeadline: 'Get inbound leads',
    heroHeadlineAccent: 'instead of chasing cold ones.',
    heroSub:
      'Content that ranks, a site that converts, and automations that catch every lead — while you run the business instead of the outreach treadmill.',
    stats: [
      { value: '~60%', label: 'lower cost per lead from inbound vs outbound' },
      { value: '~3x', label: 'the leads from content marketing, at a fraction of the cost (CMI)' },
      { value: '14.6%', label: 'close rate on SEO leads vs ~1–2% for cold outbound' },
      { value: '<2 sec', label: 'site load — where conversion meaningfully climbs' },
    ],
    transformFrom: 'You chase leads with cold outreach and a site that does not convert the few who show up.',
    transformTo:
      'Content brings them in already warm, the site converts them, and the system captures every single lead.',
    services: [
      { slug: 'blog-production',       name: 'Blog Production (SEO)', why: 'The inbound engine. Ranks, compounds, and is the highest-ROI channel for this segment.',          weight: 'Core' },
      { slug: 'websites-funnels',      name: 'Websites & Funnels',    why: 'A fast, conversion-built site that turns the traffic content earns into actual leads.',            weight: 'High' },
      { slug: 'automations',           name: 'Automations',           why: 'Capture and route every inbound lead so nothing slips while you are running the business.',         weight: 'High' },
      { slug: 'linkedin-ghostwriting', name: 'Social & Credibility',  why: 'Local visibility and the credibility that makes the phone ring with warm prospects.',               weight: 'Medium' },
      { slug: 'video-editing',         name: 'Short-Form Video',      why: 'Trust-building short-form to feed social and put a face to the business.',                          weight: 'Medium' },
      { slug: 'ad-creatives',          name: 'Ad Creatives',          why: 'Paid to accelerate once the organic base is proven.',                                              weight: 'Medium' },
    ],
    starterStack: 'Start with Blog/SEO + Websites & Funnels + Automations.',
    faq: [
      { q: 'How long until SEO content actually brings in leads?', a: 'Honest answer: SEO and blogging typically take 3 to 6 months before meaningful organic traffic — that is industry standard, not something anyone can compress. The upside is it compounds: once it ranks, it brings leads month after month at a fraction of outbound cost. We set these timelines in writing before month one.' },
      { q: 'Why does the website matter so much?', a: 'Because content earns the click and the site has to convert it. Sites loading under two seconds convert meaningfully better, and a conversion-built layout turns the traffic your content earns into actual booked leads instead of bounces.' },
      { q: 'What does the automation actually do for me?', a: 'It catches and routes every inbound lead — form fill, DM, or call — so nothing slips while you are busy running the business. Lead comes in, gets tagged and routed, you (or your team) get notified, and follow-up happens even when you are heads-down.' },
      { q: 'I am sick of paying for leads that do not close. How is this different?', a: 'Inbound leads close far better than cold ones — SEO leads close near 14.6 percent versus 1 to 2 percent for cold outbound — because they found you and already trust you before they reach out. We build the system that produces those warm leads instead of buying cold ones.' },
    ],
  },
];

export function getIcp(key: string): IcpData | undefined {
  return icps.find((i) => i.key === key);
}
