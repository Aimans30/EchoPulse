'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeoPrice } from '@/lib/useGeoPrice';

/**
 * Build the grouped FAQ sections. Takes the localized price tokens
 * (e.g. "$299" / "$1,997" or "₹9,999" / "₹34,999") so India / EU / etc.
 * visitors see answer copy whose prices match their own tier cards instead
 * of hardcoded US dollars.
 */
const buildFaqSections = (pilotPrice: string, growthPrice: string) => [
  {
    section: 'Before you sign anything',
    items: [
      {
        q: 'How do I know the content will actually sound like me?',
        a: "This is the real fear behind most \"do you use AI?\" questions — and it's fair. The Pilot opens with a 90-minute onboarding interview where we pull your actual words, phrases, opinions, and hot takes. We build a brand brief from that session, not from your website copy. Every writer and editor on your account reads that brief before touching a single draft. If the first batch doesn't sound like you, we redo it — no arguments, no charge. Voice match is non-negotiable because generic content doesn't convert, and you'd know immediately if it was off.",
      },
      {
        q: 'Do you actually have experience in my industry, or will I be educating you?',
        a: "We work across four main verticals: founders/startups, coaches, business owners, and real estate agents. We've written listing tour scripts, coach authority content, B2B LinkedIn posts, and founder newsletters. That said, you know your niche better than we do, and we'll always say so. The onboarding interview exists so you can transfer that knowledge in one structured session rather than correcting us for six months. We come in knowing the vocabulary. You fill in the nuance.",
      },
      {
        q: "Can I see work you've done for someone in my situation before committing?",
        a: `Yes — book a free call and we'll pull samples closest to your use case. We can show edited Reels, LinkedIn post series, blog drafts, and ad creative. If we don't have a close match in our portfolio, we'll say so honestly. The ${pilotPrice} Pilot exists precisely for that situation: instead of asking you to trust samples from someone else's brand, we show you what we'd produce for yours. Real work on your content in 14 days. Then you decide.`,
      },
      {
        q: "I've been burned by agencies before. What's different here?",
        a: "The most common agency complaints we hear: work gets handed to junior staff after the sales call, you're locked into 6-month contracts before you see anything, communication disappears after onboarding. We address all three. Senior eyes on every deliverable — this is owner-operated, not account-managed. No contracts — month-to-month after the Pilot, cancel with 30 days' notice. 3-hour reply window during business hours, every time. The Pilot exists specifically because we'd rather prove it than ask you to believe it.",
      },
    ],
  },
  {
    section: 'Results & timelines',
    items: [
      {
        q: 'How long before I actually see results from the content?',
        a: "Honest answer: it depends on the channel. LinkedIn and short-form video can generate inbound DMs and profile visits within 2–4 weeks if the content lands. SEO and blogging typically takes 3–6 months before meaningful organic traffic — that's industry-standard, not something we can compress. Ad creative produces data in the first week but needs 2–4 weeks to optimise. We set these expectations in writing before month one, and include monthly reporting so you can see what's moving. We'd rather you know upfront than overpromise.",
      },
      {
        q: 'What does "results" actually mean — can you guarantee leads or sales?',
        a: "We won't guarantee leads or sales — and any agency that does is lying to you. What we can control and guarantee: output quality, turnaround speed, revision responsiveness, and strategic direction. What we can measure and report: profile views, engagement rate, post reach, website traffic from content, and time-on-page for blogs. We track metrics that are meaningful proxies for pipeline growth, and we flag when something isn't performing so we can adjust — not just keep producing content in the wrong direction.",
      },
      {
        q: 'How do you measure whether the content is working?',
        a: 'Every Growth and Full System client gets a monthly performance review. We track platform-by-platform: LinkedIn impressions, engagement rate, and follower growth; blog sessions, average time on page, and organic rankings; video views and watch time; ad creative CTR and cost per click. We compare month-over-month and flag what to change. You get a written summary — not just a dashboard you have to interpret yourself.',
      },
      {
        q: 'Will this work if I have a small following or no audience yet?',
        a: "Yes — and starting from a small base is often easier than inheriting a large audience built on inconsistent content. We build from the right foundation: clear positioning, a content strategy matched to where your buyers actually are, and output that compounds over time. The clients who see the fastest growth are usually the ones with 200 followers who commit to 90 days of consistent, targeted content — not the ones with 5,000 followers who post randomly. We'll tell you honestly if a channel isn't worth your investment at your current stage.",
      },
    ],
  },
  {
    section: 'Pricing & commitment',
    items: [
      {
        q: `Why is the Pilot ${pilotPrice} and not free?`,
        a: `Free trials attract tire-kickers and produce low-quality work because neither side is invested. At ${pilotPrice}, you get a team that's committed to delivering real work, and you signal that you're a serious buyer. The ${pilotPrice} covers a portion of actual production cost — 10 deliverables in 14 days at this level requires real time from senior people. And unlike a free sample, you keep everything we produce whether you continue or not. If you don't see value in the work, you've spent ${pilotPrice} to find that out instead of ${growthPrice}+. That's a cheap discovery cost.`,
      },
      {
        q: "What happens if I want to pause for a month — do I lose my spot?",
        a: "We don't do lock-in and we don't penalise pauses. If you need to step back, give us 30 days' notice and we'll pause your retainer. When you're ready to restart, we pick up from the brand brief and strategy already in place — no repeat onboarding. We'd rather have clients who return because the work was good than clients who stay because they're contractually obligated.",
      },
    ],
  },
];

type FaqSection = ReturnType<typeof buildFaqSections>[number];
type FaqItem = FaqSection['items'][number];

function FaqCard({
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3) }}
      className={`faq-card${isOpen ? ' open' : ''}`}
      onClick={() => setOpen(isOpen ? null : index)}
      data-cursor-hover
      style={{
        background: isOpen
          ? 'linear-gradient(180deg, rgba(232,84,26,0.07) 0%, rgba(232,84,26,0.03) 100%)'
          : 'rgba(255,255,255,0.55)',
        border: `1px solid ${isOpen ? 'rgba(232,84,26,0.18)' : 'rgba(12,12,11,0.06)'}`,
        borderRadius: '18px',
        padding: '22px 26px',
        cursor: 'none',
        transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
        boxShadow: isOpen ? '0 10px 28px rgba(12,12,11,0.06)' : '0 1px 0 rgba(12,12,11,0.02)',
      }}
    >
      {/* Question row */}
      <div
        className="faq-q-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <span
          className="faq-q"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '-0.2px',
            color: '#0C0C0B',
            lineHeight: 1.4,
          }}
        >
          {faq.q}
        </span>

        {/* Toggle — circle with + when closed, filled black circle with × when open */}
        <motion.span
          className="faq-toggle"
          aria-hidden="true"
          animate={{
            background: isOpen ? '#0C0C0B' : 'rgba(255,255,255,0.85)',
            borderColor: isOpen ? '#0C0C0B' : 'rgba(12,12,11,0.10)',
          }}
          transition={{ duration: 0.3 }}
          style={{
            flexShrink: 0,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(12,12,11,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Plus / cross — two crossing lines, the vertical one rotates out on open */}
          <span
            style={{
              position: 'absolute',
              width: '11px',
              height: '1.8px',
              background: isOpen ? '#fff' : '#0C0C0B',
              borderRadius: '2px',
              transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease, background 0.3s ease',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '11px',
              height: '1.8px',
              background: isOpen ? '#fff' : '#0C0C0B',
              borderRadius: '2px',
              transform: isOpen ? 'rotate(-45deg)' : 'rotate(90deg)',
              transition: 'transform 0.3s ease, background 0.3s ease',
            }}
          />
        </motion.span>
      </div>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p
              className="faq-a"
              style={{
                margin: '16px 0 4px',
                fontSize: '14.5px',
                lineHeight: 1.7,
                color: '#6E6B63',
                fontWeight: 400,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { currency, prices } = useGeoPrice();

  // Compose the per-locale, grouped FAQ sections. Memoization isn't worth it —
  // the array is tiny and only rebuilds when geo flips (once per session).
  const faqSections = buildFaqSections(`${currency}${prices.pilot}`, `${currency}${prices.growth}`);

  // Flatten for the structured-data block and to assign each card a stable,
  // unique index across all sections (drives the single shared `open` state).
  const flatFaqs = faqSections.flatMap((s) => s.items);

  let runningIndex = 0;

  return (
    <section id="faq" style={{ padding: '128px 56px', background: '#F2EEE7' }}>
      {/* FAQPage structured data — Google + AI agents read this and can surface
         the Q&A as a rich result or quote it in summaries. Mirrors the visible
         FAQ list one-to-one. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: flatFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header row — eyebrow + headline on the left, description on the right */}
        <div className="faq-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '48px', marginBottom: '64px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 460px', minWidth: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: '#6E6B63',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
              FAQ
            </motion.div>

            <motion.h2
              className="faq-h2"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(40px, 5.5vw, 84px)',
                fontWeight: 900,
                letterSpacing: 'clamp(-1.5px, -0.045em, -3.5px)',
                lineHeight: 0.98,
                margin: 0,
                color: '#0C0C0B',
              }}
            >
              Questions <span style={{ color: '#E8541A' }}>answered.</span>
            </motion.h2>
          </div>

          <motion.p
            className="faq-sub"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              flex: '0 0 320px',
              fontSize: '15px',
              lineHeight: 1.7,
              color: '#6E6B63',
              margin: '0 0 8px',
              fontWeight: 400,
            }}
          >
            Real questions buyers ask before signing on. If yours isn&apos;t here, book a call and we&apos;ll answer it directly.
          </motion.p>
        </div>

        {/* Grouped sections — each renders a muted section label followed by
           its own 2-column card grid. Index counter stays continuous across
           sections so the single `open` state addresses every card uniquely. */}
        {faqSections.map((section) => {
          const HALF = Math.ceil(section.items.length / 2);
          const leftItems = section.items.slice(0, HALF);
          const rightItems = section.items.slice(HALF);
          const leftStart = runningIndex;
          const rightStart = runningIndex + HALF;
          runningIndex += section.items.length;

          return (
            <div key={section.section} className="faq-section-group" style={{ marginBottom: '40px' }}>
              <motion.div
                className="faq-section-label"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#A8A49B',
                  marginBottom: '16px',
                }}
              >
                {section.section}
              </motion.div>

              <div className="faq-grid" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div className="faq-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {leftItems.map((faq, i) => (
                    <FaqCard key={faq.q} faq={faq} index={leftStart + i} open={open} setOpen={setOpen} />
                  ))}
                </div>
                <div className="faq-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {rightItems.map((faq, i) => (
                    <FaqCard key={faq.q} faq={faq} index={rightStart + i} open={open} setOpen={setOpen} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .faq-card:hover {
          background: rgba(255,255,255,0.85) !important;
          border-color: rgba(12,12,11,0.10) !important;
          box-shadow: 0 6px 18px rgba(12,12,11,0.05) !important;
        }
        .faq-card.open:hover {
          background: linear-gradient(180deg, rgba(232,84,26,0.09) 0%, rgba(232,84,26,0.04) 100%) !important;
        }

        @media (max-width: 900px) {
          .faq-grid { flex-direction: column !important; gap: 12px !important; }
          .faq-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; margin-bottom: 28px !important; }
          .faq-header > div { flex: none !important; min-width: 0 !important; width: 100% !important; }
          .faq-sub { flex: none !important; flex-basis: auto !important; max-width: 560px; }
        }
        @media (max-width: 640px) {
          section#faq { padding: 72px 18px !important; }
          .faq-header { gap: 12px !important; margin-bottom: 24px !important; }
          .faq-h2 { font-size: 38px !important; letter-spacing: -1.4px !important; }
          .faq-sub { font-size: 14px !important; line-height: 1.6 !important; }
          .faq-section-group { margin-bottom: 28px !important; }
          .faq-section-label { font-size: 10px !important; margin-bottom: 12px !important; }
          .faq-card { padding: 18px 18px !important; border-radius: 16px !important; }
          .faq-card .faq-q-row { gap: 14px !important; }
          .faq-card .faq-q { font-size: 15px !important; line-height: 1.4 !important; }
          .faq-card .faq-a { font-size: 14px !important; line-height: 1.65 !important; margin-top: 14px !important; }
          /* Toggle — keep 32px visual but expand tap area via padding-around-padding using an outer wrap */
          .faq-card .faq-toggle {
            width: 36px !important;
            height: 36px !important;
          }
        }
        @media (max-width: 380px) {
          section#faq { padding: 60px 14px !important; }
          .faq-h2 { font-size: 34px !important; letter-spacing: -1.2px !important; }
          .faq-card { padding: 16px 16px !important; }
          .faq-card .faq-q { font-size: 14.5px !important; }
        }
      `}</style>
    </section>
  );
}
