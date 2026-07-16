'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGeoPrice } from '@/lib/useGeoPrice';

/**
 * Build the grouped FAQ sections. Takes the localized price tokens
 * (e.g. "$299" / "$1,997", or "£239" / "£1,597" in the UK) so visitors see
 * answer copy whose prices match their own tier cards instead of hardcoded
 * US dollars.
 *
 * ─── Why these questions and not the old ones ────────────────────────────────
 *
 * The previous set was written as sales objections ("I've been burned by
 * agencies before. What's different here?"). Good instincts, wrong format:
 * nobody types that into Google, and AI assistants only quote a Q&A when the
 * question matches something a real person actually asked.
 *
 * So every question below is phrased the way a buyer phrases it in a search bar
 * or to ChatGPT — "how much does a video editing agency cost", "freelance video
 * editor vs agency", "do content agencies use AI". The objection-handling still
 * happens; it just happens inside the answer, under a heading that can rank.
 *
 * Answer rules (these are what get you cited, not just ranked):
 *   1. First sentence answers the question directly. Extraction engines lift
 *      the opening line — if it's throat-clearing, you don't get quoted.
 *   2. Concrete numbers wherever we honestly have them. Our own prices and
 *      turnaround times are facts we can stand behind.
 *   3. No invented industry statistics. Every unsourced "74% of brands..." stat
 *      is a trust liability with both Google's raters and LLMs.
 */
const buildFaqSections = (pilotPrice: string, growthPrice: string) => [
  {
    section: 'Pricing & cost',
    items: [
      {
        q: 'How much does a content agency cost per month?',
        a: `Ours runs ${growthPrice} per month for the Growth retainer, with no contract. Most content agencies price one of three ways: per deliverable (cheapest headline, most expensive in practice once revisions stack up), per hour (you pay for their inefficiency), or a flat monthly retainer covering a defined output (what we do). Before that, you can run a ${pilotPrice} 14-day Pilot: real work on your brand, 10 deliverables, and you keep everything whether you continue or not. That way you're comparing actual output, not sales decks.`,
      },
      {
        q: 'Is it cheaper to hire a freelance video editor or an agency?',
        a: "A freelancer is cheaper per edit. An agency is cheaper per outcome, and the gap widens as volume grows. One freelancer gives you one skill, one timezone, and one point of failure: when they take a holiday, your content stops. You also stay the project manager, writing briefs, chasing revisions, and stitching together an editor, a writer, and a designer who have never spoken. We're the alternative when the coordination cost has started to exceed the production cost. If you publish two videos a month and enjoy managing it, hire a freelancer. That's an honest answer, not a pitch.",
      },
      {
        q: 'Do I have to sign a long-term contract?',
        a: "No. After the Pilot it's month-to-month, cancel with 30 days' notice. Six and twelve-month lock-ins exist to protect the agency from its own churn, not to serve you. If you need to pause, give us 30 days and we'll hold your brand brief and strategy so there's no repeat onboarding when you come back. We'd rather keep clients because the work is good than because the paperwork says so.",
      },
      {
        q: `Why is the Pilot ${pilotPrice} instead of free?`,
        a: `Because free trials produce work neither side is invested in. At ${pilotPrice} you get senior people producing 10 real deliverables in 14 days, and you signal you're a serious buyer rather than a tire-kicker. It covers a portion of genuine production cost, not the full amount. And unlike a free sample, you keep everything we make. If the work isn't for you, you spent ${pilotPrice} to learn that instead of ${growthPrice} a month.`,
      },
    ],
  },
  {
    section: 'What you actually get',
    items: [
      {
        q: 'What is a done-for-you content agency?',
        a: "A done-for-you content agency handles the entire pipeline from raw footage to published post, so the only thing you do is show up and record. In practice that means: you send us a video call recording, a podcast episode, or 30 minutes of talking to your phone, and we return edited short-form video, LinkedIn posts, blog articles, and ad creative built from it. The distinction from a normal agency is scope. Most agencies do one channel and hand you the rest. EchoPulse covers video editing, LinkedIn ghostwriting, blogs, ads, websites, and automations under one team and one invoice.",
      },
      {
        q: 'What is included in a monthly content retainer?',
        a: `The Growth retainer at ${growthPrice} a month covers a defined output across video, social, and written content, plus strategy and monthly reporting. The exact mix is set during onboarding, because a real estate agent needs listing videos and a SaaS founder needs LinkedIn essays, and pretending those are the same package would be dishonest. What is fixed regardless of mix: senior review on every deliverable, a 3-hour reply window during business hours, and unlimited revisions within scope. Book a call and we'll spec the exact deliverable count for your channels.`,
      },
      {
        q: 'How fast is the turnaround on video edits?',
        a: "48 to 72 hours for short-form edits in a standard week, and the Pilot delivers 10 assets inside 14 days. Turnaround is the metric we hold ourselves to hardest, because content that arrives late is content that missed its moment. If a deadline is genuinely at risk we tell you before it slips, not after.",
      },
    ],
  },
  {
    section: 'Quality & AI',
    items: [
      {
        q: 'Do content agencies use AI to write the content?',
        a: "Many do, and most will not tell you. Here is our position, stated plainly: we use AI for research, transcription, and first-pass structuring. We do not use it to generate the final voice of your content, because AI writes in the average of everyone, and the entire point of founder-led content is that it sounds like one specific person. Every deliverable is written and reviewed by a human who has read your brand brief. If you can tell a post was machine-written, so can your buyer, and so can the algorithm that decides whether to distribute it.",
      },
      {
        q: 'How do you make the content actually sound like me?',
        a: "We build a brand brief from a 90-minute onboarding interview, not from your website copy. In that session we pull your actual phrases, opinions, and the hot takes you'd only say out loud. Every writer and editor on your account reads that brief before touching a draft. If the first batch doesn't sound like you, we redo it, no charge and no argument. Voice match isn't a nice-to-have. Generic content doesn't convert, and you'd spot it immediately.",
      },
      {
        q: 'Do you have experience in my industry?',
        a: "We work across four verticals: founders and startups, coaches, business owners, and real estate agents. We've produced listing tour scripts, coach authority content, B2B LinkedIn posts, and founder newsletters. But you know your niche better than we do, and we'll say so rather than pretend otherwise. The onboarding interview exists so you transfer that knowledge in one structured session instead of correcting us for six months. We arrive knowing the vocabulary. You supply the nuance.",
      },
    ],
  },
  {
    section: 'Results & timelines',
    items: [
      {
        q: 'How long does it take to see results from content marketing?',
        a: "It depends on the channel, and any agency giving you one number is guessing. LinkedIn and short-form video can produce inbound DMs and profile visits within 2 to 4 weeks when the content lands. Ad creative generates usable data in week one but needs 2 to 4 weeks to optimise. SEO and blogging realistically take 3 to 6 months before meaningful organic traffic, and nobody can compress that. We put these expectations in writing before month one, because setting them honestly is cheaper for both of us than resetting them in month three.",
      },
      {
        q: 'Can a content agency guarantee leads or sales?',
        a: "No, and any agency that guarantees leads is either lying or about to redefine the word 'lead'. Too much of the outcome sits outside our control: your offer, your pricing, your sales calls, your market. What we do guarantee is what we control, which is output quality, turnaround speed, and revision responsiveness. What we measure and report monthly: profile views, engagement rate, reach, content-driven website traffic, and blog time-on-page. When something isn't performing we flag it and change direction, rather than quietly producing more of it.",
      },
      {
        q: 'Does content marketing work if I have a small following?',
        a: "Yes, and starting small is often easier than inheriting a large audience built on inconsistent content. The clients who grow fastest are usually the ones with 200 followers who commit to 90 days of targeted, consistent output, not the ones with 5,000 followers who post at random. You need the right foundation first: clear positioning, a channel choice matched to where your buyers actually spend time, and output that compounds. We'll tell you honestly if a channel isn't worth your money at your current stage.",
      },
    ],
  },
];

type FaqSection = ReturnType<typeof buildFaqSections>[number];
type FaqItem = FaqSection['items'][number];

function FaqRow({
  faq,
  index,
  open,
  setOpen,
}: {
  faq: FaqItem;
  index: number;
  open: number | null;
  setOpen: (i: number | null) => void;
}) {
  const isOpen = open === index;
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.24) }}
      className={`faq-row${isOpen ? ' open' : ''}`}
    >
      {/* The question is an <h3>, not a <span>.
          Headings are how both Google and AI extraction engines identify a Q&A
          block. A styled <span> reads as decorative text and carries no weight. */}
      <h3 style={{ margin: 0 }}>
        <button
          id={buttonId}
          type="button"
          className="faq-q-btn"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setOpen(isOpen ? null : index)}
          data-cursor-hover
        >
          <span className="faq-q">{faq.q}</span>

          {/* Plus / minus — the vertical stroke rotates flat on open. */}
          <span className="faq-toggle" aria-hidden="true">
            <span className="faq-bar" />
            <span className={`faq-bar faq-bar-v${isOpen ? ' flat' : ''}`} />
          </span>
        </button>
      </h3>

      {/*
        The answer stays MOUNTED whether open or closed — it is only collapsed
        to zero height. The previous version wrapped this in <AnimatePresence>
        and unmounted it on close, which meant the served HTML contained exactly
        ONE answer (the open one) and crawlers never saw the other eleven. The
        FAQPage schema claimed twelve Q&As the visible page couldn't back up.
        Collapsing with height keeps every answer in the DOM and crawlable.
      */}
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <p className="faq-a">{faq.a}</p>
      </motion.div>
    </motion.div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { currency, prices } = useGeoPrice();

  const faqSections = buildFaqSections(`${currency}${prices.pilot}`, `${currency}${prices.growth}`);
  const flatFaqs = faqSections.flatMap((s) => s.items);

  let runningIndex = 0;

  return (
    <section id="faq" style={{ padding: '128px 56px', background: '#F2EEE7' }}>
      {/* FAQPage structured data — mirrors the visible list one-to-one, which is
         the point: schema that contradicts the rendered page gets ignored. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: flatFaqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Header — centred over a single column now, instead of a split row. */}
        <div className="faq-header">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="faq-eyebrow"
          >
            <span className="faq-eyebrow-rule" />
            FAQ
          </motion.div>

          <motion.h2
            className="faq-h2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Questions <span style={{ color: '#E8541A' }}>answered.</span>
          </motion.h2>

          <motion.p
            className="faq-sub"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            What buyers actually ask before they hire a content agency. If yours isn&apos;t
            here, book a call and we&apos;ll answer it straight.
          </motion.p>
        </div>

        {/*
          Single column, divider-separated list.

          The old layout split each section into two side-by-side columns, so
          cards of different heights left ragged gaps and the reading order
          jumped left-right-left. A stacked list reads top to bottom, keeps every
          question the same width, and matches the vertical rhythm crawlers and
          humans both prefer.
        */}
        {faqSections.map((section) => {
          const start = runningIndex;
          runningIndex += section.items.length;

          return (
            <div key={section.section} className="faq-section-group">
              <motion.div
                className="faq-section-label"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
              >
                {section.section}
              </motion.div>

              <div className="faq-list">
                {section.items.map((faq, i) => (
                  <FaqRow
                    key={faq.q}
                    faq={faq}
                    index={start + i}
                    open={open}
                    setOpen={setOpen}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        /* ── Header ─────────────────────────────────────────────────────── */
        .faq-header { margin-bottom: 56px; }
        .faq-eyebrow {
          font-size: 10px; font-weight: 600; letter-spacing: 4px;
          text-transform: uppercase; color: #6E6B63; margin-bottom: 18px;
          display: flex; align-items: center; gap: 14px;
        }
        .faq-eyebrow-rule { width: 22px; height: 1px; background: #E8541A; display: block; }
        .faq-h2 {
          font-family: Inter, sans-serif;
          font-size: clamp(40px, 5.5vw, 72px);
          font-weight: 900; letter-spacing: -0.045em; line-height: 0.98;
          margin: 0 0 20px; color: #0C0C0B;
        }
        .faq-sub {
          font-size: 15px; line-height: 1.7; color: #6E6B63;
          margin: 0; font-weight: 400; max-width: 520px;
        }

        /* ── Section grouping ───────────────────────────────────────────── */
        .faq-section-group { margin-bottom: 44px; }
        .faq-section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #A8A49B;
          padding-bottom: 12px; margin-bottom: 4px;
          border-bottom: 1px solid rgba(12,12,11,0.10);
        }

        /* ── Rows: hairline dividers, no cards ──────────────────────────── */
        .faq-list { display: flex; flex-direction: column; }
        .faq-row { border-bottom: 1px solid rgba(12,12,11,0.07); }
        .faq-row:last-child { border-bottom: none; }

        .faq-q-btn {
          width: 100%; display: flex; align-items: center;
          justify-content: space-between; gap: 24px;
          background: none; border: none; text-align: left;
          padding: 22px 4px; cursor: none; font-family: inherit;
          transition: opacity 0.25s ease;
        }
        .faq-q-btn:hover { opacity: 0.58; }
        .faq-q-btn:focus-visible {
          outline: 2px solid #E8541A; outline-offset: 4px; border-radius: 6px;
        }
        .faq-q {
          font-family: Inter, sans-serif;
          font-size: 17px; font-weight: 600; letter-spacing: -0.2px;
          color: #0C0C0B; line-height: 1.45;
        }
        .faq-row.open .faq-q { color: #0C0C0B; }

        /* Toggle: bare +/- glyph. The circular chip read as a button on a card;
           without the card it just adds noise. */
        .faq-toggle {
          flex-shrink: 0; position: relative;
          width: 16px; height: 16px;
          display: flex; align-items: center; justify-content: center;
        }
        .faq-bar {
          position: absolute; width: 14px; height: 1.6px;
          background: #0C0C0B; border-radius: 2px;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s ease;
        }
        .faq-bar-v { transform: rotate(90deg); }
        .faq-bar-v.flat { transform: rotate(0deg); }
        .faq-row.open .faq-bar { background: #E8541A; }

        .faq-a {
          margin: 0 0 24px; padding-right: 40px;
          font-size: 15px; line-height: 1.75; color: #6E6B63; font-weight: 400;
        }

        /* ── Mobile ─────────────────────────────────────────────────────── */
        @media (max-width: 640px) {
          section#faq { padding: 72px 18px !important; }
          .faq-header { margin-bottom: 32px; }
          .faq-h2 { font-size: 38px; letter-spacing: -1.4px; }
          .faq-sub { font-size: 14px; line-height: 1.6; }
          .faq-section-group { margin-bottom: 32px; }
          .faq-section-label { font-size: 10px; }
          .faq-q-btn { padding: 18px 0; gap: 16px; }
          .faq-q { font-size: 15.5px; }
          .faq-a { font-size: 14.5px; line-height: 1.7; padding-right: 0; margin-bottom: 20px; }
        }
        @media (max-width: 380px) {
          section#faq { padding: 60px 14px !important; }
          .faq-h2 { font-size: 34px; letter-spacing: -1.2px; }
          .faq-q { font-size: 15px; }
        }
      `}</style>
    </section>
  );
}
