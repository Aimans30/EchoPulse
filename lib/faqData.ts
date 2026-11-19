import { FREE_SAMPLE, PILOT, PRESENCE, GROWTH } from '@/lib/pricing';

/**
 * The one FAQ data set. components/FAQ.tsx (homepage section) and
 * app/faq/page.tsx (the full page) both import from here, so the two can never
 * drift. Every price and every Pilot scope line is built from lib/pricing.ts.
 *
 * Answer rules (see content/BLOG-ENGINE.md section 5):
 *   1. First sentence answers the question directly.
 *   2. Only numbers we can stand behind: our prices, our turnaround, the one
 *      published case study.
 *   3. No superlatives about EchoPulse, no invented clients or reviews.
 *   4. No em dashes or en dashes.
 *
 * `home` is the position of the item on the homepage section. Items without it
 * appear only on /faq.
 */

export interface FaqLink {
  href: string;
  label: string;
}

export interface FaqItem {
  q: string;
  a: string;
  /** Optional pointer rendered under the answer. Not part of the JSON-LD text. */
  link?: FaqLink;
  /** Position on the homepage FAQ section. Omit to keep the item off the homepage. */
  home?: number;
}

export interface FaqGroup {
  id: string;
  heading: string;
  items: FaqItem[];
}

const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** The first five Pilot scope lines (the deliverables), joined for a sentence. */
const PILOT_INCLUDES = PILOT.scope.slice(0, 5).map(lcFirst).join('; ');

const PRESENCE_PRICE = PRESENCE.priceLabel;
const GROWTH_PRICE = GROWTH.priceLabel;
const PILOT_PRICE = PILOT.priceLabel;

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'pricing',
    heading: 'Pricing',
    items: [
      {
        home: 0,
        q: 'How much does a content agency cost per month?',
        a: `Ours runs ${PRESENCE_PRICE} a month for the Presence Engine (8 to 9 edited videos, 8 posts, a weekly call and your website looked after) or ${GROWTH_PRICE} a month for Growth, both month to month with 14 days notice to cancel. Most content agencies price one of three ways: per deliverable (cheapest headline, most expensive in practice once revisions stack up), per hour (you pay for their inefficiency), or a flat monthly retainer covering a defined output, which is what we do. Before either, you can run the ${PILOT_PRICE} 14-day Pilot: ${PILOT_INCLUDES}. You keep everything whether you continue or not, so you are comparing actual output, not sales decks.`,
        link: { href: '/pricing', label: 'See every price and what each plan includes' },
      },
      {
        q: 'What is the best content agency under $500 a month?',
        a: `We cannot say which agency is best, and we do not claim to be, but EchoPulse's Presence Engine is ${PRESENCE_PRICE} a month, so it is one option under $500. It includes a 20 to 30 minute call every week, 8 to 9 short-form videos, 8 photo or carousel posts, up to 5 extra clips from footage you already have, a posting plan and website upkeep. It does not include blogs or ad creative, which start in Growth at ${GROWTH_PRICE} a month. Whichever agency you compare, ask for the monthly deliverable count in numbers, who does the work, and how much notice you need to cancel.`,
        link: { href: '/pricing', label: 'See what the Presence Engine includes' },
      },
      {
        home: 2,
        q: 'What is included in a monthly content retainer?',
        a: `Two options. The Presence Engine at ${PRESENCE_PRICE} a month: a 20 to 30 minute call every week, 8 to 9 short videos, 8 posts, up to 5 free clips from footage you already have, a posting plan, and your website tuned up and kept current. Growth at ${GROWTH_PRICE} a month covers a bigger defined output across video, social, blogs and ads (20 social posts, 4 long-form blogs, 12 short-form edits plus 12 clips plus 2 long-form edits, and 6 ad creatives), plus strategy and monthly reporting. What is fixed on both: review before anything reaches you, a reply within 3 hours in the workday, and re-dos until you would post it under your own name. Book a free 15-minute call and we will say which one fits your channels.`,
      },
      {
        home: 1,
        q: 'Is it cheaper to hire a freelance video editor or an agency?',
        a: "A freelancer is cheaper per edit. An agency is cheaper per outcome, and the gap widens as volume grows. One freelancer gives you one skill, one timezone, and one point of failure: when they take a holiday, your content stops. You also stay the project manager, writing briefs, chasing revisions, and stitching together an editor, a writer, and a designer who have never spoken. If you publish two videos a month and enjoy managing it, hire a freelancer. That is an honest answer, not a pitch.",
      },
      {
        q: 'How much does a LinkedIn ghostwriter for coaches cost?',
        a: `At EchoPulse, LinkedIn posts for coaches come inside a plan rather than as a separate ghostwriting fee, and the entry price is ${PRESENCE_PRICE} a month. The Presence Engine includes 8 photo or carousel posts a month alongside 8 to 9 short videos, and Growth at ${GROWTH_PRICE} a month includes 20 social posts and 4 long-form blogs. The ${PILOT_PRICE} Pilot includes 2 posts if you want to see the writing first. Posts are built from a recorded onboarding session so they sound like you, and for what other ghostwriters charge we have a sourced guide.`,
        link: { href: '/blog/how-much-does-linkedin-ghostwriting-cost-2026', label: 'LinkedIn ghostwriting pricing guide' },
      },
      {
        q: 'How much does real estate video editing cost per video?',
        a: `On the Presence Engine, ${PRESENCE_PRICE} a month covers 8 to 9 edited videos, which works out to under $50 a video, and that price also includes 8 posts, a weekly call and website upkeep. The ${PILOT_PRICE} Pilot has 6 video edits but is a package with posts, a blog, a strategy session and a 30-day plan, so it is not a per-video price. The free sample is 2 edited videos from footage you already have, at no charge. For what other editors and agencies charge per video, see our sourced cost guide.`,
        link: { href: '/blog/real-estate-video-editing-cost', label: 'Real estate video editing cost guide' },
      },
    ],
  },
  {
    id: 'free-sample-and-pilot',
    heading: 'The free sample and the Pilot',
    items: [
      {
        home: 8,
        q: 'Is the free sample really free?',
        a: `Yes. Send 1 or 2 pieces of footage you already have (a talk, a podcast episode, a listing tour, a job-site clip) and you get 2 edited short videos back within 48 hours. ${FREE_SAMPLE.per.charAt(0).toUpperCase() + FREE_SAMPLE.per.slice(1)}, and you keep the files whether or not you hire us. It is the fastest way to judge the quality, so we would rather start there than with a pitch.`,
        link: { href: '/free-edits', label: 'Get 2 free edits' },
      },
      {
        q: 'Do I need to be on a call to get the free sample?',
        a: 'No. You send footage you already have through the free sample form and 2 edited short videos come back within 48 hours. There is no card and no call required, and you keep the files whether or not you hire us. A call is there if you would rather talk first, and it is optional.',
        link: { href: '/free-edits', label: 'Get 2 free edits' },
      },
      {
        q: `What is included in the ${PILOT_PRICE} Pilot?`,
        a: `The Pilot is ${PILOT_PRICE} one-off for 14 days and includes ${PILOT_INCLUDES}. Short-form edits have a 48-hour turnaround, and every deliverable is revised until you are happy. There is no retainer, nothing recurring behind the payment, and you keep everything we make.`,
        link: { href: '/pilot', label: 'See the Pilot' },
      },
      {
        q: 'What happens on the call?',
        a: '15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch. If you want to know which step fits (the free sample, the Pilot or a monthly plan), ask him then.',
      },
    ],
  },
  {
    id: 'how-the-work-happens',
    heading: 'How the work happens',
    items: [
      {
        home: 4,
        q: 'What is a done-for-you content agency?',
        a: "A done-for-you content agency handles the pipeline from raw footage to published post, so the only thing you do is show up and record. In practice you send a video call recording, a podcast episode, or 30 minutes of talking to your phone, and you get back edited short-form video, posts, blog articles and ad creative built from it. The difference from a normal agency is scope: most do one channel and hand you the rest. EchoPulse covers video editing, LinkedIn ghostwriting, blogs, ads, websites and automations under one team and one invoice.",
      },
      {
        home: 5,
        q: 'How fast is the turnaround on video edits?',
        a: `48 hours for short-form edits. Long-form video takes longer, depending on its length. The free sample (2 edited videos) is back within 48 hours of receiving your footage, and the Pilot's 6 video edits, 2 posts and 1 blog land inside its 14 days. Late content is content that missed its moment, so if a deadline is genuinely at risk we tell you before it slips, not after.`,
      },
      {
        home: 3,
        q: 'Do content agencies use AI to write the content?',
        a: "Many do, and most will not tell you. We use AI for research, transcription, and first-pass structuring. We do not use it to generate the final voice of your content, because AI writes in the average of everyone, and the point of founder-led content is that it sounds like one specific person. Every deliverable is written and reviewed by a human who has read your brand brief.",
      },
      {
        q: 'Is there a contract, and who owns the content?',
        a: 'There is no contract. Plans are month to month and you cancel with 14 days notice, and the Pilot is a one-off payment. You keep everything we make, whether or not you continue. Anything that is not right is re-done until you would post it under your own name.',
        link: { href: '/pricing', label: 'Billing and cancellation on the pricing page' },
      },
    ],
  },
  {
    id: 'who-we-are',
    heading: 'Who we are',
    items: [
      {
        q: 'Is EchoPulse Media legit?',
        a: 'EchoPulse Media is a small studio run by Lakshya Soni from Bhopal, India, with Shaurya on design and Aiman on delivery. It has one published case study, MagicBNB, with the Search Console export on the page, and it has no customer reviews yet and says so rather than inventing any. Some directory listings carry old or wrong details that EchoPulse does not claim: no 500+ videos, 10M+ views or 98 percent figure, and no brokerage clients. The free sample, 2 edited videos with no card and no call, is the cheapest way to check the work yourself.',
        link: { href: '/what-is-echopulse-media', label: 'EchoPulse Media facts in one table' },
      },
      {
        home: 9,
        q: 'Where is the team based, and what hours do you actually cover?',
        a: "EchoPulse is run from Bhopal, India, by Lakshya Soni, with Shaurya on design and Aiman on delivery; the About page lists the team. Our working day overlaps comfortably with UK and Western European mornings and with US East Coast mornings. Replies come within 3 hours in the workday, and a message sent late on a US evening is answered the next morning your time. Turnaround is counted in calendar hours, so a 48-hour deliverable is 48 hours regardless of the gap. If you need someone reachable in your own timezone at 5pm on a Friday, say so on the call and we will tell you honestly whether we are the right fit.",
        link: { href: '/about', label: 'Meet the team' },
      },
    ],
  },
  {
    id: 'results',
    heading: 'Results',
    items: [
      {
        q: 'What results has EchoPulse published?',
        a: 'One case study, MagicBNB, which EchoPulse runs end to end. Between 19 February and 11 November 2026 the site went from an average of 5.8 Google impressions a day in April to an average of 4,859 a day in the first 11 days of November, after a site rebuild and more than 200 articles. The Search Console export is on the case study page, along with what is still not working.',
        link: { href: '/case-studies/magicbnb-seo-aeo', label: 'Read the MagicBNB case study' },
      },
      {
        home: 6,
        q: 'How long does it take to see results from content marketing?',
        a: "It depends on the channel, and any agency giving you one number is guessing. LinkedIn and short-form video can produce inbound DMs and profile visits within 2 to 4 weeks when the content lands. Ad creative generates usable data in week one but needs 2 to 4 weeks to optimise. SEO and blogging realistically take 3 to 6 months before meaningful organic traffic, and nobody can compress that. We put these expectations in writing before month one.",
      },
      {
        home: 7,
        q: 'Can a content agency guarantee leads or sales?',
        a: "No, and any agency that guarantees leads is either lying or about to redefine the word 'lead'. Too much of the outcome sits outside our control: your offer, your pricing, your sales calls, your market. What we do guarantee is what we control, which is output quality, turnaround speed, and revision responsiveness. We report profile views, engagement rate, reach, content-driven website traffic and blog time-on-page monthly, and when something is not performing we flag it and change direction.",
      },
    ],
  },
];

/** Every FAQ item in page order, for /faq and its JSON-LD. */
export const ALL_FAQS: FaqItem[] = FAQ_GROUPS.flatMap((g) => g.items);

/** The homepage subset, in homepage order. */
export const HOME_FAQS: FaqItem[] = ALL_FAQS.filter((f) => f.home !== undefined).sort(
  (a, b) => (a.home as number) - (b.home as number),
);
