import type { IcpKey } from './videos';
import type { PricingCopy } from '@/components/Pricing';
import type { PipelineConfig } from '@/components/icp/ICPPipelineAnimation';

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

export interface IcpWhyNow {
  /** Section heading (two-tone: plain + accented clause). */
  headline: string;
  headlineAccent: string;
  /** 2–3 short paragraphs naming the pain + the market shift. Honest, not salesy. */
  body: string[];
}

export interface IcpDeliverable {
  title: string;
  desc: string;
}

// EchoPulse vs a generic marketing agency. Shared across every ICP page — the
// honest structural difference, not a strawman. Framed as "here's the real
// difference", never "agencies are evil".
export interface ComparisonRow {
  feature: string;
  us: string;
  them: string;
}

export const AGENCY_COMPARISON: ComparisonRow[] = [
  { feature: 'What you are buying', us: 'A full content pipeline, handled by one team', them: 'One channel, then upsells for the rest' },
  { feature: 'Who does the work',   us: 'The founder plus a small senior team',          them: 'Junior staff behind an account manager' },
  { feature: 'Who you talk to',     us: 'The person actually building it',                them: 'An account manager relaying messages' },
  { feature: 'Turnaround',          us: 'Days, not weeks',                                them: 'Stuck in queues and approval chains' },
  { feature: 'Revisions',           us: "Redone until you would post it under your own name", them: 'Limited rounds, extra rounds cost more' },
  { feature: 'Pricing',             us: 'Flat and predictable',                           them: 'Retainer plus scope creep and hidden fees' },
  { feature: 'Commitment',          us: 'Month to month, no lock-in',                     them: 'Long contracts' },
  { feature: 'Fit',                 us: 'Built around your specific world',               them: 'Generic templates reused across clients' },
];

/**
 * The "why a personal brand matters" education block. Optional per ICP.
 * Founders get the full, data-backed version; other segments can add their own
 * later. Every stat carries a real source string so nothing on the page is an
 * unverifiable claim.
 */
export interface AuthorityStat {
  value: string;
  label: string;
  source: string;
}
export interface AuthorityCase {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  /** 1-2 short intro paragraphs. */
  intro: string[];
  /** 3-4 hard, sourced stats. Omitted where we have no citable figure —
   *  we show mechanism rather than invent a number. */
  stats?: AuthorityStat[];
  /** Two audiences side by side, e.g. B2B vs B2C, each with 3 points. */
  split: {
    left: { tag: string; title: string; points: string[] };
    right: { tag: string; title: string; points: string[] };
  };
  /** The one-line takeaway that closes the section. */
  takeaway: string;
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
  /** Primary + secondary SEO keywords for this segment (woven into copy). */
  keywords: string[];
  /** "Why this matters in 2026" — the honest problem/market-shift section. */
  whyNow: IcpWhyNow;
  /** Up to 4 hard proof stats shown near the hero + in the market-reality band. */
  stats: IcpStat[];
  /**
   * Config for the animated hero explainer. Shows the whole offer in motion:
   * one input → the studio → four channels → how that compounds into revenue.
   * `count` values must stay true to the Growth retainer's real deliverables;
   * `outcomes` describe the MECHANISM only, never promised results.
   */
  pipeline: PipelineConfig;
  /** The "why this matters / why us" education block. Renders as its own section. */
  authority: AuthorityCase;
  /** Concrete deliverables list — what they actually receive. */
  deliverables: IcpDeliverable[];
  /** The before → after transformation, two short strings. */
  transformFrom: string;
  transformTo: string;
  /** Services in priority order — lead with Core, then Highs. */
  services: IcpService[];
  /** The recommended starting combination, plain sentence. */
  starterStack: string;
  /** 3–5 segment-specific FAQs (also emitted as FAQPage JSON-LD). */
  faq: { q: string; a: string }[];
  /**
   * Optional per-segment pricing feature copy. Same 3 tiers, same prices, same
   * deliverable counts — only the WORDING of each feature line changes to read
   * native to this audience. Omit it and the page renders the default homepage
   * copy. DTC + business-owners intentionally omit it for now.
   */
  pricingCopy?: PricingCopy;
}

export const icps: IcpData[] = [
  // ── 1. Real Estate Agents — strongest data-backed segment ──────────────────
  {
    key: 'real-estate',
    name: 'Real Estate Agents',
    icon: 'home',
    accentColor: '#f59e0b',
    metaTitle: 'Real Estate Video Editing & Listing Reels',
    metaDescription:
      'Cinematic property reels, listing walkthroughs, and ads that book viewings. Listings with video get up to 403% more inquiries. You shoot, we edit.',
    eyebrow: 'For Real Estate Agents & Brokerages',
    // Hero rewrite: the old version led with an industry stat ("nine in ten
    // agents skip video"), which is interesting but not about them. This leads
    // with the moment the listing is actually won or lost — the seller deciding
    // who markets their home — because that's the decision the reader is in.
    heroHeadline: 'Sellers pick the agent who markets like a pro.',
    heroHeadlineAccent: 'We make you look like one.',
    heroSub:
      'Cinematic property reels, listing walkthroughs, personal-brand video, and Meta ads that book viewings instead of racking up views. You shoot on your phone or we direct the shoot. We edit. You list.',
    keywords: ['real estate video editing', 'property reels', 'listing video', 'real estate content marketing'],
    whyNow: {
      headline: 'Buyers tour online first.',
      headlineAccent: 'Most agents still show up with a phone photo.',
      body: [
        'The first showing now happens on a screen. Before a buyer ever books a walkthrough, they have scrolled your listing, watched (or not watched) the video, and decided whether you look like the agent who takes the property seriously. A carousel of static photos reads as the bare minimum. A cinematic reel reads as a professional who will market their home the same way.',
        'Here is the opening: almost every agent knows video works, and almost none of them actually ship it consistently. The ones who tried usually hired a videographer once, waited a week for the edit, and quietly gave up. That gap between what works and what agents actually do is the whole opportunity, and it is wide open right now.',
        'This does not stay open forever. Every quarter more agents figure out that listing video is how you win the listing and the buyer. The agents who build the habit now are the ones sellers call first.',
      ],
    },
    stats: [
      { value: '403%', label: 'more inquiries on listings marketed with video (NAR)' },
      { value: '58%', label: 'of buyers expect to see a video of a home listed online' },
      { value: '9%', label: 'of agents actually make listing videos. That gap is your edge.' },
      { value: '48 hr', label: 'standard edit turnaround per deliverable' },
    ],
    pipeline: {
      input: { label: 'You shoot the listing', detail: 'Phone footage, or we direct the shoot' },
      outputs: [
        { label: 'Property reels', benefit: 'Listings buyers actually watch', count: '12/mo', kind: 'reel' },
        { label: 'Listing walkthroughs', benefit: 'They tour before they call', count: '4/mo', kind: 'video' },
        { label: 'Personal-brand video', benefit: 'Sellers pick who they trust', count: '8/mo', kind: 'reel' },
        { label: 'Meta ads', benefit: 'Puts listings in front of buyers', count: '6/mo', kind: 'ad' },
      ],
      outcomes: ['Listing views', 'Enquiries', 'Booked viewings'],
    },
    authority: {
      eyebrow: 'Why your personal brand wins listings',
      headline: 'Sellers are not comparing houses.',
      headlineAccent: 'They are comparing agents.',
      intro: [
        'By the time a seller sits across from you, they have already looked you up. They have seen your last few listings, watched a video or scrolled past a carousel of photos, and formed an opinion about how their home will be marketed. That judgement happens before the listing appointment, not during it.',
        'This is why a personal brand is not vanity for an agent. It is the only asset that works while you sleep, and the only one a competing agent cannot copy. Your commission split, your brokerage, your CRM are all replicable. The reputation attached to your face is not.',
      ],
      stats: [
        { value: '403%', label: 'more inquiries on listings marketed with video', source: 'NAR' },
        { value: '58%', label: 'of buyers expect to see a video of a home listed online', source: 'Industry research, 2026' },
        { value: '9%', label: 'of agents actually produce listing-specific video', source: 'Industry research, 2026' },
        { value: '~6%', label: 'higher average sale price on homes marketed with video', source: 'Industry research, 2026' },
      ],
      split: {
        left: {
          tag: 'Winning the listing',
          title: 'The seller side',
          points: [
            'Your marketing IS the pitch. Showing a cinematic reel you made for another home does more than any listing presentation slide.',
            'Sellers assume the agent who markets well will also negotiate well. Production quality reads as competence.',
            'Personal-brand video makes you the known quantity before the appointment, so you are not starting from cold.',
          ],
        },
        right: {
          tag: 'Winning the buyer',
          title: 'The buyer side',
          points: [
            'The first showing now happens on a screen. A walkthrough video pre-qualifies buyers so the people who book are serious.',
            'Video listings surface further in social and portal feeds than static photo carousels.',
            'Fewer wasted weekend viewings, because buyers already toured the property before they called you.',
          ],
        },
      },
      takeaway:
        'Nine in ten agents still are not shipping listing video consistently. That gap is not permanent, and it is the cheapest edge available to you right now.',
    },
    deliverables: [
      { title: 'Win more listing appointments', desc: 'Cinematic property reels and walkthrough edits become your listing presentation. Sellers see how their home will be marketed before you say a word, and pick the agent who already looks like the professional.' },
      { title: 'Become the agent they remember', desc: 'Talking-head and agent-intro videos put your face in the feed weekly, so when someone in your farm area finally decides to sell, you are the name that comes to mind first.' },
      { title: 'Book viewings from serious buyers', desc: 'Walkthrough video lets buyers tour before they call. The ones who book have already sold themselves, so weekends stop going to lookers who were never going to offer.' },
      { title: 'One shoot works every channel', desc: 'We export vertical for Reels, TikTok, and Shorts, horizontal for YouTube and your site, and MLS-ready MP4s. You film once; the listing shows up everywhere your buyers are.' },
      { title: 'Hot listings go live hot', desc: 'Drop footage in a shared folder, get the edit back in 48 hours as standard. Momentum is everything in the first week of a listing, and slow edits waste it.' },
    ],
    transformFrom: 'You post the odd phone photo and hope the listing moves.',
    transformTo:
      'Every listing ships with a cinematic reel and an ad behind it, and viewings book while you are showing another house.',
    services: [
      { slug: 'video-editing',      name: 'Real Estate & Cinematic Video', why: 'Property reels, listing walkthroughs, and personal-brand video. The whole ballgame for agents.', weight: 'Core' },
      { slug: 'ad-creatives',       name: 'Ad Creatives',                  why: 'Turn the reels into Meta and Instagram ads that book viewings, not just collect views.',           weight: 'High' },
      { slug: 'linkedin-ghostwriting', name: 'Social & Personal Brand',     why: 'Consistent posting so you stay top-of-mind for referrals between listings.',                       weight: 'Medium' },
      { slug: 'websites-funnels',   name: 'Listing & Lead Pages',          why: 'A fast listing and lead-capture page. Most buyers start on mobile and bounce on slow sites.',     weight: 'Medium' },
      { slug: 'automations',        name: 'Lead Automations',              why: 'Inquiry-to-booked-viewing flows so leads never sit in a DM overnight.',                            weight: 'Medium' },
    ],
    starterStack: 'Start with Listing Video + Ad Creatives. Add personal-brand social once the listing flow is humming.',
    faq: [
      { q: 'Do I have to shoot the footage myself?', a: 'Either works. If you have a phone or a drone and a steady hand, shoot it and send us the raw clips, and we will guide you on what to capture. If you would rather not, we direct the shot list so a local videographer (or you) captures exactly what the edit needs. Then we handle the cinematic edit, captions, music, and exports.' },
      { q: 'How fast do I get a listing reel back?', a: 'Standard turnaround is 48 hours per deliverable. For a hot listing that needs to go live same-day, rush 24-hour delivery is available at a 30 percent surcharge.' },
      { q: 'Can you make ads from the listing videos too?', a: 'Yes. We cut the reel into Meta and Instagram ad variants built to book viewings, with proper aspect ratios, hooks in the first two seconds, and a clear call to action. Ads are a separate line item from the edit.' },
      { q: 'What formats do you deliver for?', a: 'Vertical reels for Instagram, TikTok, and YouTube Shorts; horizontal cuts for YouTube and listing-site embeds; and MLS/portal-ready MP4 exports. One shoot, every format you list on.' },
      { q: 'I tried a videographer once and the turnaround killed me. How is this different?', a: 'That is the exact frustration this is built for. You get a 48-hour standard cycle, a shared folder you drop footage into, revisions until you are satisfied, and one team that knows real estate shot grammar, not a one-off freelancer you have to re-brief every time.' },
    ],
    // Same 3 tiers, same prices, same counts as the default. Only the wording
    // reframes video toward listings/reels, blogs toward market-guide SEO,
    // social toward listing + agent-brand content, ads toward booking viewings.
    pricingCopy: {
      pilot: [
        '90-min onboarding strategy session + brand brief',
        '8 short-form + 2 static + 1 carousel + 5 clipped listing pieces',
        '5 long-form SEO blog drafts (neighborhood and market guides buyers actually search)',
        'Content audit + 30-day listing-content plan',
        'Curated to the channels your market actually uses',
        '48-hour turnaround per deliverable',
        'Revisions until you are satisfied',
        'Live Loom walkthrough on delivery',
        'No retainer commitment. See the work first.',
      ],
      growth: [
        'Onboarding strategy session + quarterly brand-brief refresh',
        '20 social posts per month (listings, market updates, personal-brand agent content)',
        '4 long-form SEO blogs per month (neighborhood and market guides, optimized for search and AI answer engines)',
        '12 property reels and listing cuts + 12 clipped pieces + 2 long-form (full walkthroughs, tours)',
        '6 ad creatives per month (4 listing ads + 2 lead-gen ads built to book viewings)',
        'Conversion-built listing or agent site, rebuilt in month one and tuned every month after',
        'Funnel optimization with lead tracking and A/B testing built in',
        'Monthly strategy call with a 30-day listing-content calendar mapped ahead',
        '48-hour turnaround on every deliverable, as standard',
        'Monthly performance review so you see which listings pull leads',
        '20% off any custom app or software build (IDX tools, lead portals, agent CRMs)',
      ],
      full: [
        'Everything in Growth, scaled for a full listing pipeline',
        'Long-form editing (full property tours, agent vlogs, market-update videos)',
        'Just-listed and just-sold cut packages for every property',
        'Personal-brand video library (agent intros, testimonials, area guides)',
        'Company process optimization (listing intake, shoot-to-publish workflows)',
        '30 social posts + 8 long-form market-guide blogs per month',
        'Full listing-ad engine across Meta, Instagram, YouTube, Google',
        'Custom listing or lead-capture site build each quarter (4 builds/year)',
        'One small custom app build per quarter included (up to $9,997 scope, IDX or lead tools) + 30% off larger builds',
        'Automation stack setup (lead routing, viewing bookings, CRM sync)',
        'Dedicated account lead + bi-weekly strategy session',
        'Live performance dashboard + monthly reporting',
      ],
    },
  },

  // ── 2. Founders & Operators — core segment ─────────────────────────────────
  {
    key: 'founders',
    name: 'Founders & Operators',
    icon: 'rocket',
    accentColor: '#E8541A',
    metaTitle: 'Done-For-You Content for Founders',
    metaDescription:
      'One team for your LinkedIn, short-form video, blogs, and ads. Founder-led content that builds pipeline while you run the company.',
    eyebrow: 'For SaaS, Agency & Consulting Founders',
    // Hero rewrite. The old line ("Stop reviewing five freelancers. Run the
    // business.") sold relief from admin — a real pain, but it frames us as a
    // convenience purchase, which is exactly the framing that gets a founder to
    // deprioritise the call. This version names the commercial stakes instead:
    // buyers now decide before they ever contact you, so being absent during
    // that window costs deals. That's a revenue problem, and founders take
    // revenue problems seriously.
    heroHeadline: 'Your buyers decide before they ever contact you.',
    heroHeadlineAccent: 'Be there when they do.',
    heroSub:
      'Most of the B2B decision happens before the first call: they read, they watch, they shortlist. We run the LinkedIn, video, blogs, and ads that put you in that window, as one team. You record once a month. We handle the rest.',
    keywords: ['done-for-you content studio', 'founder-led content', 'content for SaaS founders', 'LinkedIn content for founders'],
    whyNow: {
      headline: 'Your buyers decide before they ever call.',
      headlineAccent: 'The question is whether you were visible.',
      body: [
        'Most of the B2B buying decision now happens before a founder ever gets on a call. Buyers research quietly, read a few pieces of your content, check whether you sound like someone who knows the problem, and shortlist you (or not) long before they raise a hand. If you are not visible across that window, you are invisible during the exact stretch where the decision gets made.',
        'The trap is that content is the one thing that scales your presence without scaling your calendar, and it is also the first thing that falls off when you are running the company. So most founders end up as the content team: editing clips, writing posts, briefing an ads freelancer, stitching it together at night. You become the bottleneck for the thing that is supposed to grow the business.',
        'The founders winning right now are not the ones posting more. They are the ones who handed the pipeline to one team, kept their name on it, and got their evenings back. Founder-led content still works. Being the founder who personally produces all of it does not.',
      ],
    },
    stats: [
      // Sourced: 6sense 2024 Buyer Experience Report. Kept citable because this
      // page gets sent cold — a prospect who Googles the number should find it.
      { value: '70%', label: 'of the buying journey is done before a buyer contacts sales (6sense, 2024)' },
      { value: '81%', label: 'of buyers already have a preferred vendor at first contact (6sense, 2024)' },
      { value: '1', label: 'team and one bill, instead of five vendors you project-manage' },
      { value: '48 hr', label: 'standard turnaround on every deliverable' },
    ],
    pipeline: {
      input: { label: 'You record once', detail: 'One call, podcast, or 30 min to camera' },
      outputs: [
        { label: 'LinkedIn posts', benefit: 'Where founder pipeline starts', count: '20/mo', kind: 'post' },
        { label: 'Short-form video', benefit: 'Trust that closes long cycles', count: '12/mo', kind: 'reel' },
        { label: 'SEO blogs', benefit: 'Ranks and compounds', count: '4/mo', kind: 'doc' },
        { label: 'Ad creative', benefit: 'Amplifies what already works', count: '6/mo', kind: 'ad' },
      ],
      outcomes: ['Visibility', 'Inbound', 'Booked calls'],
    },
    authority: {
      eyebrow: 'Why a founder brand compounds',
      headline: 'Your name is the one asset',
      headlineAccent: 'a competitor cannot copy.',
      intro: [
        'A competitor can copy your pricing page in an afternoon, your feature set in a quarter, and your ad angles the moment they see them working. What they cannot copy is the founder whose thinking your buyers already trust. That is why founder-led content outperforms brand content on every platform that matters: people follow people.',
        'And the window where that trust gets built has moved. Buyers now do the majority of their evaluation before they ever raise a hand, which means the content published months before a deal is what shapes the shortlist. You are either present in that window or you are being compared to someone who was.',
      ],
      stats: [
        { value: '73%', label: 'say thought leadership is a more trustworthy basis for judging a company than its marketing materials', source: 'Edelman-LinkedIn B2B Thought Leadership Report, 2024' },
        { value: '75%', label: 'say a piece of thought leadership led them to research a product they were not considering', source: 'Edelman-LinkedIn, 2024' },
        { value: '60%', label: 'say they would pay a premium to work with an organisation that publishes valuable thought leadership', source: 'Edelman-LinkedIn, 2024' },
        { value: '90%', label: 'of decision-makers are more receptive to outreach from companies producing quality thought leadership', source: 'Edelman-LinkedIn, 2024' },
      ],
      split: {
        left: {
          tag: 'If you sell B2B',
          title: 'Long cycles, buying committees',
          points: [
            'Deals are decided by a committee you never meet. Your content is what gets forwarded internally by the one champion who does talk to you.',
            'Thought leadership is the cheapest way to enter an RFP you were not invited to, because it is what makes you a name worth adding.',
            'A visible founder shortens the trust curve on long cycles. The first call starts warm instead of at zero.',
          ],
        },
        right: {
          tag: 'If you sell B2C or creator-led',
          title: 'Attention, speed, and proof',
          points: [
            'Consumer buying is impulsive and social. The founder on camera is the single fastest trust signal you have.',
            'Founder-led short-form consistently out-distributes brand accounts, because platforms push people over logos.',
            'Your audience becomes an owned distribution channel, so every future launch does not start by renting attention from ads.',
          ],
        },
      },
      takeaway:
        'Founder-led content still works. Being the founder who personally produces all of it does not scale, and that is the only part we take off you.',
    },
    deliverables: [
      { title: 'Show up in your buyers’ research window', desc: 'LinkedIn posts written from a recorded interview, in your actual voice, shipped on cadence. When a buyer quietly evaluates you weeks before reaching out, there is a body of thinking for them to find.' },
      { title: 'Build trust before the first call', desc: 'Face-to-camera short-form cut for retention. Buyers who have watched you talk for weeks arrive at the first call already half-convinced, which is how long B2B cycles get shorter.' },
      { title: 'Get found when they Google you', desc: 'Researched, SEO-built articles that rank for your category and compound. Mid-cycle, every serious buyer searches your name and your space; this is what they land on.' },
      { title: 'Scale what already works', desc: 'Your best-performing organic posts get recut into static and video ads. You only pay to amplify content that proved itself, so ad spend stops being a guess.' },
      { title: 'Never leak an inbound lead', desc: 'DM and CRM automations route every reply and profile visit to a follow-up while you are heads-down running the company. Interest that used to evaporate becomes booked calls.' },
      { title: 'Spend 2-3 hours a month, not 20', desc: 'One strategy call and batched approvals is your entire involvement. You review, we produce, and the machine runs whether you posted that day or not.' },
    ],
    transformFrom: 'You are the content team, editor, ghostwriter, blogger, and ad guy, and you are burnt out.',
    transformTo:
      'One team ships your LinkedIn, video, blog, and ads. You review, you do not produce. The pipeline runs whether you post that day or not.',
    services: [
      { slug: 'linkedin-ghostwriting', name: 'LinkedIn & Social',  why: 'The engine. LinkedIn pushes personal profiles far harder than company pages, so founder-led content is where pipeline starts.', weight: 'Core' },
      { slug: 'video-editing',         name: 'Short-Form Video',   why: 'Face-to-camera clips build the trust that closes long B2B cycles, and video out-pulls text on the feed.',                weight: 'High' },
      { slug: 'blog-production',       name: 'Blog Production',     why: 'The SEO layer buyers hit when they research you mid-cycle. Ranks, compounds, feeds the pre-call research habit.',          weight: 'High' },
      { slug: 'automations',           name: 'Automations',        why: 'DM flows and CRM glue so inbound interest gets routed and nothing leaks.',                                              weight: 'High' },
      { slug: 'ad-creatives',          name: 'Ad Creatives',       why: 'Amplify the winners once organic proves what resonates.',                                                               weight: 'Medium' },
      { slug: 'websites-funnels',      name: 'Websites & Funnels', why: 'The destination that converts the attention into booked calls.',                                                        weight: 'Medium' },
    ],
    starterStack: 'Start with LinkedIn & Social + Short-Form Video + Blog. Add Automations once volume justifies it.',
    faq: [
      { q: 'Will the content actually sound like me, not a generic ghostwriter?', a: 'That is the whole point. We open with a 90-minute Voice Foundation interview to pull your actual words, opinions, and hot takes, then build a brand brief every writer and editor reads before touching a draft. If the first batch does not sound like you, we redo it at no charge.' },
      { q: 'I already work with a freelancer or two. Can you slot in?', a: 'Yes. Plenty of founders start by handing us the channel that is eating the most of their time, usually LinkedIn or video, and expand once they see the work. You do not have to fire anyone to start.' },
      { q: 'How much of my time does this take each month?', a: 'After onboarding, most founders spend 2 to 3 hours a month with us: one strategy call, batched approvals, and sending raw footage for video. The heavy lift is the onboarding interview up front. After that, you approve, we produce.' },
      { q: 'Do you lock me into a contract?', a: 'No. After the $299 14-day Pilot, plans are month-to-month, cancel with 30 days notice. We would rather earn the next month than trap you in it.' },
    ],
    // Closest to the default. Explicitly founder-voiced: LinkedIn-led personal
    // brand, category-authority SEO blogs, founder talking-head short-form,
    // inbound pipeline framing.
    pricingCopy: {
      pilot: [
        '90-min onboarding strategy session + brand brief',
        '8 short-form + 2 static + 1 carousel + 5 clipped content pieces (LinkedIn-led personal brand)',
        '5 long-form SEO blog drafts (thought-leadership for your category, optimized for search and AI answer engines)',
        'Content audit + 30-day inbound plan',
        'Curated to the channels your buyers actually use',
        '48-hour turnaround per deliverable',
        'Revisions until you are satisfied',
        'Live Loom walkthrough on delivery',
        'No retainer commitment. See the work first.',
      ],
      growth: [
        'Onboarding strategy session + quarterly brand-brief refresh',
        '20 social posts per month, LinkedIn-led personal brand across your channels',
        '4 long-form SEO authority blogs per month (own your category in search and AI answer engines)',
        '12 founder short-form edits + 12 clipped content pieces + 2 long-form (YouTube, podcast)',
        '6 ad creatives per month (4 static + 2 video) to amplify your best-performing posts',
        'Conversion-built site that turns profile visits into booked calls, tuned monthly',
        'Inbound funnel optimization with conversion tracking and A/B testing built in',
        'Monthly strategy call with a 30-day thought-leadership calendar mapped ahead',
        '48-hour turnaround on every deliverable, as standard',
        'Monthly performance review tied to inbound pipeline',
        '20% off any custom app or software build (MVPs, dashboards, internal tools)',
      ],
      full: [
        'Everything in Growth, scaled for category authority',
        'Long-form YouTube editing (founder vlogs, sponsored, educational deep-dives)',
        'Podcast editing: full episodes + 8 to 12 highlight cuts each',
        'Course or lead-magnet module editing (Kajabi, Teachable, Thinkific, Skool)',
        'Company process optimization (SOPs, workflows, internal automations)',
        '30 LinkedIn-led social posts + 8 long-form authority blogs per month',
        'Full ad creative engine across LinkedIn, Meta, YouTube, Google',
        'Custom website or inbound funnel build each quarter (4 builds/year)',
        'One small custom app build per quarter included (up to $9,997 scope) + 30% off larger builds',
        'Automation stack setup (Make.com, ManyChat, CRM lead routing)',
        'Dedicated account lead + bi-weekly strategy session',
        'Live performance dashboard + monthly reporting',
      ],
    },
  },

  // ── 3. Coaches & Course Creators ───────────────────────────────────────────
  {
    key: 'coaches',
    name: 'Coaches & Course Creators',
    icon: 'graduation',
    accentColor: '#8b5cf6',
    metaTitle: 'Content & Funnels for Coaches',
    metaDescription:
      'Pre-launch content, evergreen short-form, ad creative, and the funnel that nurtures and sells while you teach. Fill your cohort without living in the DMs.',
    eyebrow: 'For Coaches & Course Creators',
    heroHeadline: 'Fill your cohort',
    heroHeadlineAccent: 'without living in the DMs.',
    heroSub:
      'Pre-launch content, evergreen short-form, ad creative, and the funnel that nurtures and sells while you teach. The machine runs when your energy does not.',
    keywords: ['content for coaches', 'course launch content', 'evergreen short-form', 'funnel content for creators'],
    whyNow: {
      headline: 'Cold traffic to a sales page',
      headlineAccent: 'barely converts anymore.',
      body: [
        'The money was never in pointing an ad straight at your offer. It is in the warm middle: a lead magnet that earns the email, a nurture sequence that builds trust, then the offer to someone who already wants it. Warm, nurtured audiences convert at multiples of cold traffic hitting a sales page for the first time.',
        'The problem is that running that machine takes content volume and funnel plumbing most coaches do not have time to build. So the default becomes manual: live launches that drain you, DMs you answer one by one, revenue that swings with how much energy you had that month. You are either heads-down filming or heads-down selling, never both.',
        'Evergreen content and an automated funnel change the shape of the business. The top of funnel fills without you filming daily, the nurture sequence does the selling while you teach, and a launch becomes opening the cart to a primed list instead of starting from zero. The tooling to run this is cheaper and better than it has ever been. The coaches who set it up now stop trading energy for revenue.',
      ],
    },
    stats: [
      { value: '~2x', label: 'qualified leads from a lead-magnet funnel vs a plain landing page' },
      { value: 'Multiples', label: 'higher conversion from warm, nurtured audiences vs cold traffic' },
      { value: 'Evergreen', label: 'content fills the top of funnel without you filming daily' },
      { value: '48 hr', label: 'standard edit turnaround per deliverable' },
    ],
    pipeline: {
      input: { label: 'You teach one session', detail: 'A workshop, client call, or 30 min to camera' },
      outputs: [
        { label: 'Evergreen short-form', benefit: 'Fills the funnel daily', count: '12/mo', kind: 'reel' },
        { label: 'Nurture sequences', benefit: 'Sells while you teach', count: '8/mo', kind: 'mail' },
        { label: 'Lead magnet + funnel', benefit: 'Turns viewers into leads', count: 'Built', kind: 'funnel' },
        { label: 'Ad creative', benefit: 'Scales what converts', count: '6/mo', kind: 'ad' },
      ],
      outcomes: ['Audience', 'Applications', 'Enrolled'],
    },
    authority: {
      eyebrow: 'Why your face is the funnel',
      headline: 'People do not buy courses.',
      headlineAccent: 'They buy the person teaching.',
      intro: [
        'Every coach who out-earns you with a worse program is winning on one thing: trust at scale. A student cannot evaluate your curriculum before buying, so they evaluate you: how you explain things, whether your thinking feels worth paying for. Your content is the free sample of your teaching, and it is doing the selling long before your sales page does.',
        'The trap is that trust-building content takes exactly the energy your teaching already consumes. Launch months mean filming daily while running a cohort. So revenue swings with your energy, and the business never leaves survival mode. The fix is not more effort. It is a machine that keeps teaching-you visible when the real you is off.',
      ],
      split: {
        left: {
          tag: 'Before the sale',
          title: 'Filling the room',
          points: [
            'Evergreen short-form keeps discovery running daily without you filming daily. One workshop becomes weeks of clips.',
            'A lead magnet converts viewers into an email list you own, so the algorithm stops deciding your launch size.',
            'Nurture sequences build the trust that a cold sales page cannot, before the cart ever opens.',
          ],
        },
        right: {
          tag: 'After the sale',
          title: 'Keeping the room',
          points: [
            'Polished course modules make the program feel worth what they paid, which is what drives referrals and testimonials.',
            'Consistent content between cohorts keeps alumni engaged, and alumni are your cheapest future enrollments.',
            'A launch becomes opening the cart to a warm list instead of a sprint from zero every quarter.',
          ],
        },
      },
      takeaway:
        'Your energy should go into teaching. Ours goes into making sure a full room is watching when you do.',
    },
    deliverables: [
      { title: 'Own your audience, not rent it', desc: 'A complete lead-magnet funnel: magnet, opt-in page, and booking or sales page pouring warm leads into the platform you already use. Your launch size stops depending on what the algorithm felt like that week.' },
      { title: 'Stay visible without filming daily', desc: 'One workshop or session becomes weeks of evergreen clips. Discovery keeps running on your worst weeks, which is exactly when it used to stop.' },
      { title: 'Enroll students while you sleep', desc: 'Email and DM nurture sequences move a lead from curious to committed over a series of touches. The selling happens on autopilot; you find out when they enroll.' },
      { title: 'Make the course feel worth the price', desc: 'Polished module editing (lecture cuts, chapters, branded intros) for Kajabi, Teachable, Thinkific, or Skool. Production quality is what students screenshot, share, and refer.' },
      { title: 'Scale cold traffic safely', desc: 'Ad creative that drives strangers into the lead magnet instead of straight at your offer, so paid spend feeds the funnel that converts instead of burning on a cold pitch.' },
    ],
    transformFrom: 'Every launch is a manual sprint, heads-down filming or heads-down selling, never both, and revenue swings with your energy.',
    transformTo:
      'Evergreen content fills the funnel, the nurture sequence does the selling, and cohorts fill without you in the DMs.',
    services: [
      { slug: 'websites-funnels',      name: 'Funnels & Lead Pages', why: 'The core. Lead magnet to opt-in to nurture to booking page. This is what turns scattered content into enrolled students.', weight: 'Core' },
      { slug: 'video-editing',         name: 'Short-Form Video',     why: 'Evergreen clips that fill the top of funnel daily, without you filming daily.',                                       weight: 'High' },
      { slug: 'automations',           name: 'Automations',          why: 'Email nurture and DM flows. Warm audiences convert at multiples of cold, and it runs without you in the loop.',         weight: 'High' },
      { slug: 'ad-creatives',          name: 'Ad Creatives',         why: 'Drive cold traffic into the lead magnet, not straight at the offer.',                                                 weight: 'Medium' },
      { slug: 'linkedin-ghostwriting', name: 'Social & Authority',   why: 'Authority content and pre-launch warming so cohorts open to a primed audience.',                                       weight: 'Medium' },
      { slug: 'blog-production',       name: 'Blog Production',       why: 'Evergreen organic discovery for coaches who want SEO, not just paid.',                                                 weight: 'Medium' },
    ],
    starterStack: 'Start with Funnel + Automations (nurture) + Short-Form Video. Add Ad Creatives to scale once the funnel converts.',
    faq: [
      { q: 'I already have a course platform. Do you replace it?', a: 'No, we build the funnel that feeds it. Lead magnet, opt-in, nurture sequence, and booking or sales page that pours warm leads into the platform you already use (Kajabi, Teachable, Thinkific, Skool, and the rest).' },
      { q: 'Can you edit my course modules too, not just marketing content?', a: 'Yes. Module editing, including lecture cuts, lower thirds, chapter markers, and branded intros, is part of our video service, alongside the evergreen short-form that fills your funnel.' },
      { q: 'How does the nurture actually sell without me?', a: 'We map an email and DM sequence that warms a lead from the lead magnet to the offer over a series of touches. Warm, nurtured audiences convert several times higher than cold traffic hitting a sales page cold, and that sequence runs on autopilot while you teach.' },
      { q: 'I launch live a few times a year. Does this fit?', a: 'It makes live launches easier. Evergreen content and a nurture funnel keep the audience warm between launches, so when you open the cart you are selling to a primed list instead of starting from zero each time.' },
    ],
    // Same tiers and counts. Video reframed to course promo, testimonial and
    // results clips, and launch/webinar cuts; blogs to launch/nurture SEO;
    // social to authority and audience-nurture; ads to launch and lead-magnet.
    pricingCopy: {
      pilot: [
        '90-min onboarding strategy session + brand brief',
        '8 short-form + 2 static + 1 carousel + 5 clipped content pieces (authority and audience-nurture)',
        '5 long-form SEO blog drafts (problem-aware articles that feed your funnel, optimized for search and AI answer engines)',
        'Content audit + 30-day launch-content plan',
        'Curated to the channels your audience actually uses',
        '48-hour turnaround per deliverable',
        'Revisions until you are satisfied',
        'Live Loom walkthrough on delivery',
        'No retainer commitment. See the work first.',
      ],
      growth: [
        'Onboarding strategy session + quarterly brand-brief refresh',
        '20 nurture-and-authority social posts per month that fill cohorts',
        '4 long-form SEO blogs per month (launch and nurture content, optimized for search and AI answer engines)',
        '12 short-form edits + 12 clipped content pieces + 2 long-form (course promo, webinar and launch cuts)',
        '6 ad creatives per month (4 launch and lead-magnet ads + 2 webinar video ads)',
        'Conversion-built funnel and site, rebuilt in month one and tuned every month after',
        'Nurture funnel optimization with conversion tracking and A/B testing built in',
        'Monthly strategy call with a 30-day launch-content calendar mapped ahead',
        '48-hour turnaround on every deliverable, as standard',
        'Monthly performance review tied to opt-ins and enrollments',
        '20% off any custom app or software build (course platforms, membership portals, quiz funnels)',
      ],
      full: [
        'Everything in Growth, scaled for launches',
        'Long-form editing (full course modules, webinar replays, masterclass cuts)',
        'Podcast editing: full episodes + 8 to 12 highlight cuts each',
        'Course module editing (Kajabi, Teachable, Thinkific, Skool)',
        'Company process optimization (launch runbooks, nurture workflows, automations)',
        '30 nurture-and-authority social posts + 8 long-form funnel blogs per month',
        'Full launch-ad engine across Meta, Instagram, TikTok, YouTube',
        'Custom funnel or membership site build each quarter (4 builds/year)',
        'One small custom app build per quarter included (up to $9,997 scope, quiz or course tools) + 30% off larger builds',
        'Automation stack setup (email nurture, DM flows, CRM enrollment sync)',
        'Dedicated account lead + bi-weekly strategy session',
        'Live performance dashboard + monthly reporting',
      ],
    },
  },

  // ── 4. DTC & E-Commerce ────────────────────────────────────────────────────
  {
    key: 'dtc',
    name: 'DTC & E-Commerce',
    icon: 'shopping',
    accentColor: '#10b981',
    metaTitle: 'DTC Ad Creative on Subscription',
    metaDescription:
      'Fresh static and video ad creative every week on subscription, plus store, funnels, and email. Beat creative fatigue and keep your CPA sane.',
    eyebrow: 'For DTC & E-Commerce Brands',
    heroHeadline: 'Creative dies in days.',
    heroHeadlineAccent: 'We refill the tank on subscription.',
    heroSub:
      'Fresh static and video ads every week, plus the store, the funnels, and the email. Fatigue stops killing your CPA, so you test and the winners scale.',
    keywords: ['DTC ad creative', 'UGC video ads', 'ad creative subscription', 'ecommerce content'],
    whyNow: {
      headline: 'Creative fatigue is the bottleneck now.',
      headlineAccent: 'Not your budget.',
      body: [
        'You are not asking whether ads work. You are bleeding because creative dies faster than you can replace it. Ad performance decays in days, not weeks, and by the time you have briefed a new batch, the current one has already spiked your CPA. The account is not broken. The creative pipeline is.',
        'Traditional production cannot keep up with that clock. Brief, shoot, edit, wait a week or two, pay hundreds per asset, and you get two or three pieces right as the last batch fatigues. Meanwhile the teams winning on paid social are running fifteen to twenty-five active variants per campaign and refreshing constantly. Volume is the moat.',
        'A subscription is the literal fix. Fresh hooks and variants land on a cadence, you test, the winners scale, and CPA stays sane instead of climbing every two weeks. The brands that treat creative as a steady pipeline instead of a periodic project are the ones whose numbers hold.',
      ],
    },
    stats: [
      { value: '7-14 days', label: 'typical TikTok creative lifespan before fatigue sets in' },
      { value: '~3.0', label: 'ad frequency past this reliably drags CTR down' },
      { value: '15-25', label: 'active variants performance teams run per campaign' },
      { value: 'UGC', label: 'style ads consistently beat polished brand content on CPM' },
    ],
    pipeline: {
      input: { label: 'You send product and brief', detail: 'Product footage, UGC, or brand assets' },
      outputs: [
        { label: 'Static ad variants', benefit: 'Beats creative fatigue', count: '20/mo', kind: 'ad' },
        { label: 'Video ads', benefit: 'Stops the scroll', count: '12/mo', kind: 'reel' },
        { label: 'UGC-style edits', benefit: 'Converts colder traffic', count: '8/mo', kind: 'video' },
        { label: 'Landing pages', benefit: 'Protects the click you paid for', count: 'Ongoing', kind: 'site' },
      ],
      outcomes: ['Fresh creative', 'Lower CPA', 'More orders'],
    },
    authority: {
      eyebrow: 'Why creative is the lever',
      headline: 'Your ad account is fine.',
      headlineAccent: 'Your creative pipeline is not.',
      intro: [
        'Once targeting went algorithmic, creative became the last real lever in paid social. Meta and TikTok decide who sees the ad; the only input you still control is what the ad is. That is why two brands with identical budgets get wildly different CPAs. The difference is not media buying skill, it is how fast they replace fatigued creative with fresh angles.',
        'Most DTC brands lose this game on cadence, not talent. The designer is busy, the founder approves ads in batches when they can, and by the time a new variant ships the old one has been decaying for a week. Fatigue is not an accident in that system. It is the schedule.',
      ],
      stats: [
        { value: '7-14', label: 'days of typical TikTok creative lifespan before fatigue sets in', source: 'Industry benchmarks' },
        { value: '~3.0', label: 'ad frequency past which CTR reliably drags down', source: 'Industry benchmarks' },
        { value: '15-25', label: 'active variants performance teams keep in-market per campaign', source: 'Industry benchmarks' },
      ],
      split: {
        left: {
          tag: 'The fatigue cycle',
          title: 'What is happening now',
          points: [
            'A winning ad decays within two weeks, and CPA climbs while you wait on the next batch.',
            'One or two concepts in-market means the algorithm has nothing to optimise between.',
            'Every new batch is a fire drill: brief, wait, revise, ship late.',
          ],
        },
        right: {
          tag: 'The refill system',
          title: 'What changes with us',
          points: [
            'Fresh statics and video variants on a fixed weekly cadence, so replacements exist before fatigue hits.',
            'Multiple hooks and formats per concept, sized per platform, enough volume to actually test.',
            'The winner gets recut into new angles while it is still winning, not after it dies.',
          ],
        },
      },
      takeaway:
        'You cannot out-bid creative fatigue. You can only out-produce it, and that is a production problem. Our side of the table.',
    },
    deliverables: [
      { title: 'Stop CPA creep before it starts', desc: 'Fresh static and video variants ship weekly, so a replacement is live before the current winner fatigues. The account never coasts on decaying creative again.' },
      { title: 'Convert colder audiences', desc: 'UGC-style and creator-format edits, the look that consistently beats polished brand content on CPM and conversion, because it reads as a person and not an ad.' },
      { title: 'Give the algorithm enough to optimise', desc: 'Multiple hooks, captions, and platform-correct ratios per concept. Testing needs volume; one or two ads in-market is not a test, it is a coin flip.' },
      { title: 'Protect the click you paid for', desc: 'Landing pages and store sections built to convert the traffic your ads earn, so a rising ad budget stops leaking at the last step.' },
      { title: 'Recover the revenue you already earned', desc: 'Abandoned-cart and post-purchase email and SMS flows. This is the highest-margin revenue in DTC because the acquisition cost is already paid.' },
    ],
    transformFrom: 'You burn through creative every two weeks and scramble, and by the time you brief a new batch the current CPA has already spiked.',
    transformTo:
      'Fresh static and video variants land on a subscription. You test, the winners scale, and CPA stays sane.',
    services: [
      { slug: 'ad-creatives',     name: 'Ad Creatives (Subscription)', why: 'The core. Fresh hooks shipped before fatigue kills CPA. This segment exists for this service.', weight: 'Core' },
      { slug: 'video-editing',    name: 'UGC & Short-Form Video',      why: 'UGC-style variants that out-perform polished brand content on cost and conversion.',             weight: 'High' },
      { slug: 'websites-funnels', name: 'Store & Landing Pages',       why: "Post-click experience that does not waste the click you paid for.",                              weight: 'High' },
      { slug: 'automations',      name: 'Email & SMS Flows',           why: 'Abandoned cart and post-purchase flows where the real margin lives.',                            weight: 'Medium' },
      { slug: 'linkedin-ghostwriting', name: 'Brand & Social',         why: 'Organic presence and founder/brand story for brands that want it.',                              weight: 'Medium' },
      { slug: 'blog-production',  name: 'SEO Content',                 why: 'Product and education content for brands playing the organic long game.',                        weight: 'Medium' },
    ],
    starterStack: 'Start with the Ad Creatives subscription + Video Editing. Add Email/SMS automations to lift LTV.',
    faq: [
      { q: 'How many ad variants do I get per month?', a: 'It depends on the plan, but the model is built around volume. Performance teams typically run 15 to 25 active variants per campaign, and subscription production is what makes that cadence affordable. We agree on a monthly batch size up front and ship fresh hooks before the current ones fatigue.' },
      { q: 'Do you do UGC-style ads or only polished brand content?', a: 'Both, and we lean into UGC-style for performance because it consistently beats polished brand content on CPM and conversion. We mix formats and let the testing data decide what scales.' },
      { q: 'Can you edit the footage we already have from creators?', a: 'Yes. Send us raw UGC, product footage, or creator clips and we cut them into multiple ad variants with different hooks, captions, and formats for each platform.' },
      { q: 'Do you manage the ad spend too?', a: 'Our core is the creative engine, the assets that beat fatigue. We work alongside your media buyer (or can advise on structure), but the subscription is built to keep your creative pipeline full, not to run your ad account.' },
    ],
  },

  // ── 5. Business Owners ─────────────────────────────────────────────────────
  {
    key: 'business-owners',
    name: 'Business Owners',
    icon: 'briefcase',
    accentColor: '#3b82f6',
    metaTitle: 'Inbound Lead Content for Local Business',
    metaDescription:
      'SEO content that ranks, a conversion-built website, and automations that catch every lead. Get inbound leads instead of chasing cold ones.',
    eyebrow: 'For Local & Service Business Owners',
    heroHeadline: 'Get inbound leads',
    heroHeadlineAccent: 'instead of chasing cold ones.',
    heroSub:
      'Content that ranks, a site that converts, and automations that catch every lead, while you run the business instead of the outreach treadmill.',
    keywords: ['content marketing for local business', 'inbound lead content', 'content for service businesses', 'SEO lead generation'],
    whyNow: {
      headline: 'Outbound gets more expensive every year.',
      headlineAccent: 'Inbound is where the leads moved.',
      body: [
        'The cold-outreach math keeps getting worse. Lists decay, inboxes filter harder, and the cost of chasing a lead who never asked to hear from you climbs every year. Meanwhile inbound (content that ranks, a site that converts, a system that catches the lead) costs less per lead and closes far better, because the prospect found you and already trusts you before they reach out.',
        'The reason most owners stay stuck on the outreach treadmill is not that they think it works better. It is that inbound takes consistent content and a site built to convert, and there is never time to build either while running the business. So the phone stays quiet unless you are actively dialing.',
        'This is a compounding gap. Content published now ranks and keeps producing leads for years, while every cold-outreach lead has to be re-earned from scratch. The businesses that plant the inbound engine now are the ones whose phone rings on its own later.',
      ],
    },
    stats: [
      { value: '~60%', label: 'lower cost per lead from inbound vs outbound' },
      { value: '~3x', label: 'the leads from content marketing, at a fraction of the cost (CMI)' },
      { value: '14.6%', label: 'close rate on SEO leads vs 1-2% for cold outbound' },
      { value: '<2 sec', label: 'site load, where conversion meaningfully climbs' },
    ],
    pipeline: {
      input: { label: 'You answer our questions', detail: 'One 30-minute interview a month' },
      outputs: [
        { label: 'SEO blogs', benefit: 'Ranks for what buyers search', count: '4/mo', kind: 'doc' },
        { label: 'Social posts', benefit: 'Keeps you top of mind locally', count: '20/mo', kind: 'post' },
        { label: 'Short-form video', benefit: 'Puts a face to the business', count: '12/mo', kind: 'reel' },
        { label: 'Site and lead capture', benefit: 'Converts the traffic you earn', count: 'Ongoing', kind: 'site' },
      ],
      outcomes: ['Found in search', 'Enquiries', 'Booked work'],
    },
    authority: {
      eyebrow: 'Why inbound beats chasing',
      headline: 'The best client is the one',
      headlineAccent: 'who found you first.',
      intro: [
        'Think about the last client who came to you by referral: no price haggling, no convincing, already sold before the first conversation. Inbound content produces that same buyer at scale. Someone who reads your article or watches your video and then calls has pre-sold themselves. You are the expert they found, not a vendor they are comparing.',
        'Cold outreach does the opposite. It starts every relationship with you asking, which is why those leads negotiate hardest and churn fastest. The math backs the feeling: content-sourced leads close at multiples of cold ones and cost less each month, because content compounds while ads and cold lists reset to zero.',
      ],
      stats: [
        { value: '14.6%', label: 'close rate on SEO-sourced leads vs 1-2% for cold outreach', source: 'HubSpot research' },
        { value: '~3x', label: 'the leads from content marketing per dollar vs paid acquisition', source: 'Content Marketing Institute' },
        { value: '~60%', label: 'lower cost per lead from inbound vs outbound over time', source: 'HubSpot research' },
      ],
      split: {
        left: {
          tag: 'Chasing',
          title: 'Where your leads come from now',
          points: [
            'Cold calls and paid ads that stop producing the moment you stop paying.',
            'Prospects who see you as one quote among three, and negotiate like it.',
            'Feast-and-famine months, because lead flow depends on your outreach energy.',
          ],
        },
        right: {
          tag: 'Being found',
          title: 'Where they come from after',
          points: [
            'Articles that rank for what your buyers actually search, working around the clock.',
            'Prospects who arrive pre-sold because your content already answered their questions.',
            'A pipeline that builds on itself: every piece published keeps producing next year.',
          ],
        },
      },
      takeaway:
        'Every month you buy leads, the meter resets. Every month you build content, the asset grows. We build the asset.',
    },
    deliverables: [
      { title: 'Get found by people ready to buy', desc: 'Researched articles that rank for what your customers actually type into Google. Content-sourced leads close at multiples of cold ones, and every piece keeps working next year.' },
      { title: 'Turn visits into booked work', desc: 'A fast, conversion-built site so the traffic your content earns actually becomes enquiries, instead of bouncing off a slow page that undersells you.' },
      { title: 'Never miss another lead', desc: 'Every form fill, DM, and call gets captured and routed automatically. The lead that used to slip while you were on a job now gets a same-day follow-up.' },
      { title: 'Be the obvious choice locally', desc: 'Social and credibility content that keeps your name in front of your area, so prospects arrive already trusting you and negotiate like it.' },
      { title: 'Put a face to the business', desc: 'Short-form video of you and your work. People hire people, and the operator they have watched for a month beats the stranger with a nicer logo.' },
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
      { q: 'How long until SEO content actually brings in leads?', a: 'Honest answer: SEO and blogging typically take 3 to 6 months before meaningful organic traffic. That is industry standard, not something anyone can compress. The upside is it compounds: once it ranks, it brings leads month after month at a fraction of outbound cost. We set these timelines in writing before month one.' },
      { q: 'Why does the website matter so much?', a: 'Because content earns the click and the site has to convert it. Sites loading under two seconds convert meaningfully better, and a conversion-built layout turns the traffic your content earns into actual booked leads instead of bounces.' },
      { q: 'What does the automation actually do for me?', a: 'It catches and routes every inbound lead, whether a form fill, DM, or call, so nothing slips while you are busy running the business. Lead comes in, gets tagged and routed, you (or your team) get notified, and follow-up happens even when you are heads-down.' },
      { q: 'I am sick of paying for leads that do not close. How is this different?', a: 'Inbound leads close far better than cold ones. SEO leads close near 14.6 percent versus 1 to 2 percent for cold outbound, because they found you and already trust you before they reach out. We build the system that produces those warm leads instead of buying cold ones.' },
    ],
  },
];

export function getIcp(key: string): IcpData | undefined {
  return icps.find((i) => i.key === key);
}
