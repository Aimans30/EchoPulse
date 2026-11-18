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
  /** The big number, e.g. "73%" or "70%". */
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
   * `count` values must stay true to the plan they describe (see lib/pricing.ts);
   * `outcomes` describe the MECHANISM only, never promised results.
   */
  pipeline: PipelineConfig;
  /** The "why this matters / why us" education block. Renders as its own section. */
  authority: AuthorityCase;
  /** Optional compact founder-background block rendered just under the authority section. */
  founderStory?: { heading: string; body: string; linkLabel: string; href: string };
  /** Optional one-line pointer to a free resource, shown under the work strip. */
  resource?: { text: string; linkLabel: string; href: string };
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
      'Listing reels, agent clips and market updates cut from your phone footage in 48 hours. First 2 edits free, then $399 a month.',
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
      { value: '73%', label: 'of homeowners prefer an agent who uses video (NAR, 2025)' },
      { value: '26%', label: 'of agents use video on every listing. That gap is your edge.' },
      { value: '48 hr', label: 'turnaround on short-form edits' },
      { value: '2', label: 'free edits to start, no card' },
    ],
    pipeline: {
      input: { label: 'You shoot the listing', detail: 'Phone footage, or we direct the shoot' },
      outputs: [
        { label: 'Listing videos', benefit: 'Listings buyers actually watch', count: '8-9/mo', kind: 'reel' },
        { label: 'Just-listed and market posts', benefit: 'Sellers see you every week', count: '8/mo', kind: 'post' },
        { label: 'Extra clips from tours', benefit: 'Up to 5 a month, free', count: '5/mo', kind: 'video' },
        { label: 'Site and Google profile', benefit: 'Found when sellers search', count: 'Month one', kind: 'site' },
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
      // Every figure here traces to a named NAR report. The previous version
      // carried three stats sourced to "Industry research, 2026", which is not
      // a source anyone can check. One of them ("9% of agents produce listing
      // video") was also contradicted by NAR's own Real Estate in a Digital Age
      // data, which puts consistent video use at 26%. The replacements make the
      // same argument and survive being fact-checked.
      stats: [
        { value: '73%', label: 'of homeowners are more likely to list with an agent who uses video', source: 'NAR Profile of Home Buyers and Sellers, 2025' },
        { value: '26%', label: 'of agents consistently use video on every listing. That gap is your edge.', source: 'NAR, Real Estate in a Digital Age, 2025' },
        // Replaces an inquiries-uplift figure attributed to NAR that could not
        // be traced to a NAR report. This one is ours and checkable.
        { value: '48 hr', label: 'turnaround on short-form edits', source: 'EchoPulse Media, every plan' },
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
    founderStory: {
      heading: 'Edited for 200+ Canadian real estate agents before EchoPulse',
      body: "Before starting EchoPulse, founder Lakshya Soni edited listing tours, agent brand videos and ads for more than 200 Canadian agents as an editor at a real estate media company. Those were that company's clients, not EchoPulse clients.",
      linkLabel: 'Read the founder story',
      href: '/case-studies/founder-200-real-estate-agents',
    },
    resource: {
      text: 'Filming a listing this week?',
      linkLabel: 'Use the room-by-room listing video shot list',
      href: '/resources/listing-video-shot-list',
    },
    faq: [
      { q: 'Do I have to shoot the footage myself?', a: 'Either works. If you have a phone or a drone and a steady hand, shoot it and send us the raw clips, and we will guide you on what to capture. If you would rather not, we direct the shot list so a local videographer (or you) captures exactly what the edit needs. Then we handle the cinematic edit, captions, music, and exports.' },
      // These were two FAQs asking the same question. One covered turnaround,
      // the other covered weekends, and both repeated the 48 hours, the rush
      // path and the 30 percent surcharge. To an agent already suspicious of
      // marketers, near-identical answers two rows apart read as padding.
      // Merged into one, which freed a slot for the question he actually had.
      { q: 'How fast do I get a listing reel back, including on a weekend?', a: 'Standard turnaround is 48 hours per deliverable, and a listing that goes live on a Saturday is part of that conversation rather than excluded from it. When one cannot wait, message us directly and we will confirm whether 24 hours is possible that week before you send the footage. Rush carries a 30 percent surcharge and is arranged with us directly, not through the order page.' },
      // Every persona who read this page asked what it costs them in hours and
      // could not find an answer. The founders page has carried this reassurance
      // for months; an agent working evenings and weekends needs it more.
      { q: 'How much of my time does this actually take each month?', a: 'Roughly 2 to 3 hours after onboarding. You shoot listing footage on your phone during walkthroughs you are already doing, we send a short shot list so you are not guessing, and the rest is batched approvals. If you would rather not shoot at all, we direct the shoot instead.' },
      { q: 'Can you make ads from the listing videos too?', a: 'Yes. We cut the reel into Meta and Instagram ad variants built to book viewings, with proper aspect ratios, hooks in the first two seconds, and a clear call to action. Ads are part of the Growth plan, which includes 6 ad creatives a month. The Presence Engine does not include ads.' },
      { q: 'What formats do you deliver for?', a: 'Vertical reels for Instagram, TikTok, and YouTube Shorts; horizontal cuts for YouTube and listing-site embeds; and MLS/portal-ready MP4 exports. One shoot, every format you list on.' },
      { q: 'I tried a videographer once and the turnaround killed me. How is this different?', a: 'That is the exact frustration this is built for. You get a 48-hour standard cycle, a shared folder you drop footage into, revisions until you are satisfied, and one team that knows real estate shot grammar, not a one-off freelancer you have to re-brief every time.' },
    ],
    // Same 3 tiers, same prices, same counts as the default. Only the wording
    // reframes video toward listings/reels, blogs toward market-guide SEO,
    // social toward listing + agent-brand content, ads toward booking viewings.
    pricingCopy: {
      pilot: [
        'Onboarding strategy session (60 min, recorded) + brand brief',
        '6 listing or agent-brand reels, edited to perform',
        '2 static or carousel posts (just listed, just sold, market update), captions ready',
        '1 long-form SEO blog (a neighborhood or market guide buyers search for)',
        'Content audit + 30-day listing-content plan',
        '48-hour turnaround on short-form edits, revised until you are happy',
        'No retainer commitment. You keep everything made.',
      ],
      presence: [
        'A 20 to 30 minute call every week: plan the week, go over the numbers, decide what to improve',
        'Monthly content calendar, weekly shot list and help filming walkthroughs on your phone',
        '8 to 9 listing walkthroughs, neighborhood videos and market updates a month, edited to perform',
        '8 photo or carousel posts a month (just listed, just sold, area guides), captions ready',
        'Up to 5 extra clips a month cut from listing tours you already have, free',
        'A posting plan: what goes where and when',
        'Free website tune-up in month one, then ongoing upgrades',
        'Neighborhood and bio pages, Google Business Profile and structured data so sellers find you on Google and ChatGPT',
        'Replies within 3 hours in the workday',
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
      'Most of the B2B decision happens before the first call: they read, they watch, they shortlist. We edit the video and write the LinkedIn posts that put you in that window, as one team. Blogs and ad creative come with the Growth plan. You record, we handle the rest.',
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
        { label: 'LinkedIn posts', benefit: 'Where founder pipeline starts', count: '8/mo', kind: 'post' },
        { label: 'Short-form video', benefit: 'Trust that closes long cycles', count: '8-9/mo', kind: 'reel' },
        { label: 'Extra clips from talks', benefit: 'Up to 5 a month, free', count: '5/mo', kind: 'video' },
        { label: 'Site tune-up', benefit: 'Turns profile visits into calls', count: 'Month one', kind: 'site' },
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
      { q: 'Will the content actually sound like me, not a generic ghostwriter?', a: 'That is the whole point. We open with a recorded onboarding session of about an hour to pull your actual words, opinions, and hot takes, then build a brand brief every writer and editor reads before touching a draft. If the first batch does not sound like you, we redo it at no charge.' },
      { q: 'Can three people actually handle a full content pipeline?', a: 'The studio is owner-operated. Lakshya Soni runs it, Shaurya leads design, Aiman leads delivery, and every deliverable gets senior review before it reaches you. The volume in Growth is scoped to what that team ships on a 48-hour cycle, not stretched past what three people can actually review.' },
      { q: 'I already work with a freelancer or two. Can you slot in?', a: 'Yes. Plenty of founders start by handing us the channel that is eating the most of their time, usually LinkedIn or video, and expand once they see the work. You do not have to fire anyone to start.' },
      { q: 'How much of my time does this take each month?', a: 'After onboarding, most founders spend 2 to 3 hours a month with us: one strategy call, batched approvals, and sending raw footage for video. The heavy lift is the onboarding interview up front. After that, you approve, we produce.' },
      { q: 'Do you lock me into a contract?', a: 'No. After the $299 14-day Pilot, plans are month-to-month, cancel with 14 days written notice. We would rather earn the next month than trap you in it.' },
    ],
    // Closest to the default. Explicitly founder-voiced: LinkedIn-led personal
    // brand, category-authority SEO blogs, founder talking-head short-form,
    // inbound pipeline framing.
    pricingCopy: {
      pilot: [
        'Onboarding strategy session (60 min, recorded) + brand brief',
        '6 founder short-form edits (talking head, demo, podcast clip)',
        '2 LinkedIn posts or carousels in your voice, ready to post',
        '1 long-form SEO blog (category authority, sourced)',
        'Content audit + 30-day inbound plan',
        '48-hour turnaround on short-form edits, revised until you are happy',
        'No retainer commitment. You keep everything made.',
      ],
      presence: [
        'A 20 to 30 minute call every week: plan the week, go over the numbers, decide what to improve',
        'Monthly content calendar, weekly shot list and help filming',
        '8 to 9 founder short-form videos a month (talking head, demo, podcast clips), edited to perform',
        '8 LinkedIn posts or carousels a month in your voice, ready to post',
        'Up to 5 extra clips a month cut from talks, podcasts or demos you already have, free',
        'A posting plan: what goes where and when',
        'Free website tune-up in month one, then ongoing upgrades',
        'Comparison and use-case pages plus structured data so buyers find you on Google and ChatGPT',
        'Replies within 3 hours in the workday',
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
    },
  },

  // ── 3. Coaches & Course Creators ───────────────────────────────────────────
  {
    key: 'coaches',
    name: 'Coaches & Course Creators',
    icon: 'graduation',
    accentColor: '#8b5cf6',
    // "Cohort", "pre-launch" and "while you teach" all assume a course with
    // an intake date. A fitness coach running an ongoing program read the
    // page and said none of it was his business. "Roster" covers a running
    // client list, a membership and a cohort without coining a new term, and
    // the sub now names all three models outright.
    metaTitle: 'Content & Funnels for Coaches',
    metaDescription:
      'Evergreen short-form, ad creative, and a nurture funnel that sells for cohorts, ongoing programs and memberships alike. Fill your roster, not your DMs.',
    eyebrow: 'For Coaches & Course Creators',
    heroHeadline: 'Fill your roster',
    heroHeadlineAccent: 'without living in the DMs.',
    heroSub:
      'Content that fills the top of your funnel, ad creative that scales what works, and the nurture sequence that sells whether you run cohorts, an ongoing coaching program, or a membership. The machine runs when your energy does not.',
    keywords: ['content for coaches', 'course launch content', 'evergreen short-form', 'funnel content for creators'],
    whyNow: {
      headline: 'Cold traffic to a sales page',
      headlineAccent: 'barely converts anymore.',
      body: [
        'The money was never in pointing an ad straight at your offer. It is in the warm middle: a lead magnet that earns the email, a nurture sequence that builds trust, then the offer to someone who already wants it. Warm, nurtured audiences convert at multiples of cold traffic hitting a sales page for the first time.',
        'The problem is that running that machine takes content volume and funnel plumbing most coaches do not have time to build. So the default becomes manual: pushes that drain you, DMs you answer one by one, revenue that swings with how much energy you had that month. You are either heads-down filming or heads-down selling, never both.',
        'Evergreen content and an automated funnel change the shape of the business. The top of funnel fills without you filming daily, the nurture sequence does the selling while you coach, and signing someone becomes an offer to a primed list instead of starting from zero. The tooling to run this is cheaper and better than it has ever been. The coaches who set it up now stop trading energy for revenue.',
      ],
    },
    // "~2x qualified leads" and "Multiples higher conversion" were removed.
    // Neither carried a source, and "Multiples" is a hedge word standing in
    // for a number nobody could produce. A hype-literate course creator in
    // the buyer panel spotted both instantly and said they fired her
    // funnel-trick radar, which is the precise opposite of what a stat block
    // is for. Replaced with mechanism and with facts we can actually stand
    // behind, which is the same call already made on the DTC page.
    stats: [
      { value: 'Own it', label: 'an email list is yours, the algorithm is not' },
      { value: 'Evergreen', label: 'content fills the top of funnel without you filming daily' },
      { value: '48 hr', label: 'turnaround on short-form edits' },
      { value: '$299', label: 'Pilot, and you keep everything we make' },
    ],
    pipeline: {
      input: { label: 'You teach one session', detail: 'A workshop, client call, or 30 min to camera' },
      outputs: [
        { label: 'Evergreen short-form', benefit: 'Fills the funnel every week', count: '8-9/mo', kind: 'reel' },
        { label: 'Photo and carousel posts', benefit: 'Keeps you in the feed', count: '8/mo', kind: 'post' },
        { label: 'Extra clips from sessions', benefit: 'Up to 5 a month, free', count: '5/mo', kind: 'video' },
        { label: 'Site tune-up', benefit: 'Turns viewers into leads', count: 'Month one', kind: 'site' },
      ],
      outcomes: ['Audience', 'Applications', 'Enrolled'],
    },
    authority: {
      eyebrow: 'Why your face is the funnel',
      // Was "People do not buy courses." The page had already been widened at
      // the headline and the FAQ to cover ongoing programs and memberships,
      // then told the coach two sections later that this is about courses
      // after all. A fitness coach running rolling enrolment stopped reading
      // here. "The program" covers a course, a cohort, a membership and a
      // one-to-one roster without inventing a word for them.
      headline: 'People do not buy the program.',
      headlineAccent: 'They buy the person teaching it.',
      intro: [
        'Every coach who out-earns you with a worse program is winning on one thing: trust at scale. A buyer cannot evaluate what you actually teach before paying for it, so they evaluate you: how you explain things, whether your thinking feels worth paying for. Your content is the free sample of your coaching, and it is doing the selling long before your sales page does.',
        'The trap is that trust-building content takes exactly the energy your coaching already consumes. A full week of clients means filming happens at night or not at all. So revenue swings with your energy, and the business never leaves survival mode. The fix is not more effort. It is a machine that keeps teaching-you visible when the real you is off.',
      ],
      split: {
        left: {
          tag: 'Before the sale',
          title: 'Filling the room',
          points: [
            'Evergreen short-form keeps discovery running daily without you filming daily. One workshop becomes weeks of clips.',
            'A lead magnet converts viewers into an email list you own, so the algorithm stops deciding how many people hear your offer.',
            'Nurture sequences build the trust that a cold sales page cannot, before the cart ever opens.',
          ],
        },
        right: {
          tag: 'After the sale',
          title: 'Keeping the room',
          points: [
            'Polished session and module edits make the program feel worth what they paid, which is what drives referrals and testimonials.',
            'Consistent content keeps past clients engaged, and a past client is your cheapest future one.',
            'Signing someone becomes an offer to a warm list instead of a sprint from zero every quarter.',
          ],
        },
      },
      takeaway:
        'Your energy should go into teaching. Ours goes into making sure a full room is watching when you do.',
    },
    deliverables: [
      { title: 'Own your audience, not rent it', desc: 'A complete lead-magnet funnel: magnet, opt-in page, and booking or sales page pouring warm leads into the platform you already use. How many people hear your offer stops depending on what the algorithm felt like that week.' },
      { title: 'Stay visible without filming daily', desc: 'One workshop or session becomes weeks of evergreen clips. Discovery keeps running on your worst weeks, which is exactly when it used to stop.' },
      { title: 'Enroll clients while you sleep', desc: 'Email and DM nurture sequences move a lead from curious to committed over a series of touches. The selling happens on autopilot; you find out when they sign up.' },
      { title: 'Make the program feel worth the price', desc: 'Polished session and module editing (lecture cuts, chapters, branded intros), including Kajabi, Teachable, Thinkific and Skool if you run a course or membership. Production quality is what clients screenshot, share, and refer.' },
      { title: 'Scale cold traffic safely', desc: 'Ad creative that drives strangers into the lead magnet instead of straight at your offer, so paid spend feeds the funnel that converts instead of burning on a cold pitch.' },
    ],
    transformFrom: 'Filling the roster is a manual sprint, heads-down filming or heads-down selling, never both, and revenue swings with your energy.',
    transformTo:
      'Evergreen content fills the funnel, the nurture sequence does the selling, and your roster fills without you in the DMs.',
    services: [
      { slug: 'websites-funnels',      name: 'Funnels & Lead Pages', why: 'The core. Lead magnet to opt-in to nurture to booking page. This is what turns scattered content into signed clients.', weight: 'Core' },
      { slug: 'video-editing',         name: 'Short-Form Video',     why: 'Evergreen clips that fill the top of funnel daily, without you filming daily.',                                       weight: 'High' },
      { slug: 'automations',           name: 'Automations',          why: 'Email nurture and DM flows. Warm audiences convert at multiples of cold, and it runs without you in the loop.',         weight: 'High' },
      { slug: 'ad-creatives',          name: 'Ad Creatives',         why: 'Drive cold traffic into the lead magnet, not straight at the offer.',                                                 weight: 'Medium' },
      { slug: 'linkedin-ghostwriting', name: 'Social & Authority',   why: 'Authority content that keeps the audience warm, whether enrolment is rolling or opens on a date.',                     weight: 'Medium' },
      { slug: 'blog-production',       name: 'Blog Production',       why: 'Evergreen organic discovery for coaches who want SEO, not just paid.',                                                 weight: 'Medium' },
    ],
    starterStack: 'Start with Funnel + Automations (nurture) + Short-Form Video. Add Ad Creatives to scale once the funnel converts.',
    faq: [
      { q: 'I already have a course or coaching platform. Do you replace it?', a: 'No, we build the funnel that feeds it. Lead magnet, opt-in, nurture sequence, and booking or sales page that pour warm leads into whatever you already run on, whether that is a cohort platform, an ongoing coaching program, or a membership (Kajabi, Teachable, Thinkific, Skool, and the rest).' },
      { q: 'Can you edit my course modules too, not just marketing content?', a: 'Yes. Module editing, including lecture cuts, lower thirds, chapter markers, and branded intros, is part of our video service, alongside the evergreen short-form that fills your funnel.' },
      { q: 'How does the nurture actually sell without me?', a: 'We map an email and DM sequence that warms a lead from the lead magnet to the offer over a series of touches. Warm, nurtured audiences convert several times higher than cold traffic hitting a sales page cold, and that sequence runs on autopilot while you teach.' },
      // Reframed from "I launch live a few times a year" so it answers the
      // coach running rolling enrollment first, then covers launches second.
      // A fitness coach with an ongoing program read this page and concluded
      // none of it was his business, because every question assumed a cart
      // that opens and closes.
      { q: 'I run an ongoing program rather than launching a few times a year. Does this fit?', a: 'Yes. Evergreen content and a nurture sequence keep new leads warming toward your program on rolling enrollment, with no cart-open date required. If you do run the occasional live launch as well, the same warmed audience is already primed for it instead of starting from zero.' },
      // Answers the objection a hype-literate coach raises but rarely says out
      // loud: that automated nurture will feel manipulative to an audience
      // built on trust.
      { q: 'Will the nurture automation feel fake or manipulative to my audience?', a: 'Only if a stranger writes it. We build the sequence from your own voice and the way you already talk to clients, so a message triggered by an email open reads like a personal follow-up rather than a drip campaign. You approve the sequence before it goes live and can pull any message that does not sound like you.' },
    ],
    // Same tiers and counts. Video reframed to course promo, testimonial and
    // results clips, and launch/webinar cuts; blogs to launch/nurture SEO;
    // social to authority and audience-nurture; ads to launch and lead-magnet.
    pricingCopy: {
      pilot: [
        'Onboarding strategy session (60 min, recorded) + brand brief',
        '6 short-form edits from your talks, sessions or episodes',
        '2 authority posts or carousels, captions ready',
        '1 long-form SEO blog (a problem-aware article that feeds your funnel)',
        'Content audit + 30-day content plan',
        '48-hour turnaround on short-form edits, revised until you are happy',
        'No retainer commitment. You keep everything made.',
      ],
      presence: [
        'A 20 to 30 minute call every week: plan the week, go over the numbers, decide what to improve',
        'Monthly content calendar, weekly shot list and help filming',
        '8 to 9 short-form videos a month from your talks, episodes and sessions, edited to perform',
        '8 authority posts or carousels a month, captions ready',
        'Up to 5 extra clips a month cut from talks and episodes you already have, free',
        'A posting plan: what goes where and when',
        'Free website tune-up in month one, then ongoing upgrades',
        'Program and topic pages plus structured data so clients find you on Google and ChatGPT',
        'Replies within 3 hours in the workday',
      ],
      growth: [
        'Onboarding strategy session + quarterly brand-brief refresh',
        '20 nurture-and-authority social posts per month that fill your roster',
        '4 long-form SEO blogs per month (problem-aware and nurture content, optimized for search and AI answer engines)',
        '12 short-form edits + 12 clipped content pieces + 2 long-form (program promo, webinar and session cuts)',
        '6 ad creatives per month (4 lead-magnet and offer ads + 2 webinar video ads)',
        'Conversion-built funnel and site, rebuilt in month one and tuned every month after',
        'Nurture funnel optimization with conversion tracking and A/B testing built in',
        'Monthly strategy call with a 30-day content calendar mapped ahead',
        '48-hour turnaround on every deliverable, as standard',
        'Monthly performance review tied to opt-ins and enrollments',
        '20% off any custom app or software build (course platforms, membership portals, quiz funnels)',
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
        // Counts corrected September 2026. These read 20/mo, 12/mo and 8/mo,
        // which totalled 40 assets, while the Growth tier rendered directly
        // below on the same page says "6 ad creatives per month (4 static + 2
        // video)". A DTC founder in a buyer panel caught the gap on a single
        // scroll and called it a bait and switch, which is exactly what a
        // roughly 85% shortfall between the pitch and the contract is.
        // The pricing was the truth and the pipeline was aspirational, so the
        // pipeline came down rather than the price going up.
        { label: 'Static ad variants', benefit: 'Growth plan. Beats creative fatigue', count: '4/mo', kind: 'ad' },
        { label: 'Video ads', benefit: 'Growth plan. Stops the scroll', count: '2/mo', kind: 'reel' },
        { label: 'Short-form edits', benefit: 'Growth plan. Converts colder traffic', count: '12/mo', kind: 'video' },
        { label: 'Landing pages', benefit: 'Growth plan. Protects the click you paid for', count: 'Ongoing', kind: 'site' },
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
      // `stats` deliberately omitted. The three figures that used to sit here
      // (7-14 day creative lifespan, ~3.0 frequency ceiling, 15-25 active
      // variants) were all sourced to "Industry benchmarks", which is not a
      // source a reader can check. Per the note on AuthorityStat above, the
      // rule is to show mechanism rather than invent a number, which is what
      // the coaches segment already does. The intro and the split below make
      // the argument on their own without asking anyone to trust an
      // unverifiable statistic.
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
      { q: 'Do you actually understand performance marketing, or are you just editors?', a: 'We are not media buyers and we do not run your ad account. That stays with you or your buyer. What we own is the creative pipeline: the hooks, formats and variants built around what performs on Meta and TikTok rather than what looks good in a portfolio. We work from your account data and test results, not guesses.' },
      { q: 'Do you manage the ad spend too?', a: 'Our core is the creative engine, the assets that beat fatigue. We work alongside your media buyer (or can advise on structure), but the subscription is built to keep your creative pipeline full, not to run your ad account.' },
    ],
  },

  // ── 5. Business Owners ─────────────────────────────────────────────────────
  {
    key: 'business-owners',
    name: 'Business Owners',
    icon: 'briefcase',
    accentColor: '#3b82f6',
    // "Local" was the first word a reader saw in both the eyebrow and the
    // meta title. A Toronto consultancy owner selling $40k engagements read
    // it and concluded the page was not written for her, which is a real
    // loss because the rest of the copy fits her exactly. Widened to cover a
    // national consultancy without losing the local operator, who is still
    // named first.
    metaTitle: 'Inbound Lead Content for Service Businesses',
    metaDescription:
      'SEO content that ranks, a conversion-built website, and automations that catch every lead. Built for service businesses, local shops and national firms alike.',
    eyebrow: 'For Local and National Service Businesses',
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
      input: { label: 'You answer our questions', detail: 'A weekly call of 20 to 30 minutes' },
      outputs: [
        { label: 'Short-form video', benefit: 'Puts a face to the business', count: '8-9/mo', kind: 'reel' },
        { label: 'Photo and carousel posts', benefit: 'Keeps you top of mind with buyers', count: '8/mo', kind: 'post' },
        { label: 'Extra clips from your footage', benefit: 'Up to 5 a month, free', count: '5/mo', kind: 'video' },
        { label: 'Site, Google profile, structured data', benefit: 'Found when buyers search', count: 'Ongoing', kind: 'site' },
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
      // The meta tags were de-localised so a national consultancy would not
      // bounce, but this card and the Social service line below still said
      // "your area", which put the geography back three sections later. A
      // reader who judges a vendor on whether its own copy is precise reads
      // that as evidence, not as an oversight.
      { title: 'Be the obvious choice in your market', desc: 'Social and credibility content that keeps your name in front of the buyers you want, whether that is one city or a national category, so prospects arrive already trusting you and negotiate like it.' },
      { title: 'Put a face to the business', desc: 'Short-form video of you and your work. People hire people, and the operator they have watched for a month beats the stranger with a nicer logo.' },
    ],
    transformFrom: 'You chase leads with cold outreach and a site that does not convert the few who show up.',
    transformTo:
      'Content brings them in already warm, the site converts them, and the system captures every single lead.',
    services: [
      { slug: 'blog-production',       name: 'Blog Production (SEO)', why: 'The inbound engine. Ranks, compounds, and is the highest-ROI channel for this segment.',          weight: 'Core' },
      { slug: 'websites-funnels',      name: 'Websites & Funnels',    why: 'A fast, conversion-built site that turns the traffic content earns into actual leads.',            weight: 'High' },
      { slug: 'automations',           name: 'Automations',           why: 'Capture and route every inbound lead so nothing slips while you are running the business.',         weight: 'High' },
      { slug: 'linkedin-ghostwriting', name: 'Social & Credibility',  why: 'Visibility in your market and the credibility that makes the phone ring with warm prospects.',      weight: 'Medium' },
      { slug: 'video-editing',         name: 'Short-Form Video',      why: 'Trust-building short-form to feed social and put a face to the business.',                          weight: 'Medium' },
      { slug: 'ad-creatives',          name: 'Ad Creatives',          why: 'Paid to accelerate once the organic base is proven.',                                              weight: 'Medium' },
    ],
    starterStack: 'Start with Blog/SEO + Websites & Funnels + Automations.',
    faq: [
      { q: 'How long until SEO content actually brings in leads?', a: 'Honest answer: SEO and blogging typically take 3 to 6 months before meaningful organic traffic. That is industry standard, not something anyone can compress. The upside is it compounds: once it ranks, it brings leads month after month at a fraction of outbound cost. We set these timelines in writing before month one.' },
      { q: 'Will this work with the CRM and tools I already use?', a: 'Usually yes. Automations route leads into the CRM, calendar or job-management tool you already run on rather than forcing you onto new software. Tell us your stack on the onboarding call. If a direct integration does not exist we build a bridge with Zapier, Make or a webhook so leads still land where your team actually works.' },
      { q: 'Why does the website matter so much?', a: 'Because content earns the click and the site has to convert it. Sites loading under two seconds convert meaningfully better, and a conversion-built layout turns the traffic your content earns into actual booked leads instead of bounces.' },
      { q: 'What does the automation actually do for me?', a: 'It catches and routes every inbound lead, whether a form fill, DM, or call, so nothing slips while you are busy running the business. Lead comes in, gets tagged and routed, you (or your team) get notified, and follow-up happens even when you are heads-down.' },
      { q: 'I am sick of paying for leads that do not close. How is this different?', a: 'Inbound leads close far better than cold ones. SEO leads close near 14.6 percent versus 1 to 2 percent for cold outbound, because they found you and already trust you before they reach out. We build the system that produces those warm leads instead of buying cold ones.' },
    ],
  },
];

export function getIcp(key: string): IcpData | undefined {
  return icps.find((i) => i.key === key);
}
