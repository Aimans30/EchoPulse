'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeoPrice } from '@/lib/useGeoPrice';

/**
 * Build the FAQ list. Takes the localized pilot price token (e.g. "$299"
 * or "₹4,999") so India / EU / etc. visitors see the same answer copy
 * with their currency rendered in place of the US default.
 */
const buildFaqs = (pilotPrice: string) => [
  // ── Top 3: objection-handlers, ordered the way buyers actually hesitate ──
  {
    q: "You're new. Why should I trust you with my brand?",
    a: `Because we do not ask you to. Every engagement opens with a paid ${pilotPrice} Pilot — 14 days, real deliverables, no contract. You see the work, then decide. If it is not what you would publish, you keep what we made and walk away. The studio is young, but the operators are not. The team has shipped paid work across video, content, ads, and code for years before this.`,
  },
  {
    q: 'How do you make work that actually fits my business?',
    a: "We start with a 90-minute onboarding interview that covers your offer, your buyer, your competitors, and the way you already talk about what you do. That becomes a brand brief every writer, editor, and designer on the team references on every deliverable. Below an 8/10 fit against the brief, the work does not ship.",
  },
  {
    q: "What if I don't like the work?",
    a: 'Unlimited revisions during the Pilot. Retainers cancel with 14 days notice — no contract, no clawback, no recovery fees. You own every file we make from day one.',
  },
  // ── Existing FAQs continue below, original order preserved ──
  {
    q: 'What is the onboarding interview?',
    a: "A 90-minute recorded session every client does before we touch the work. We cover your business model, your offer, your audience, your competitors, and the way you already talk about what you do. That gets compiled into a brand brief the whole team works from. It is the single reason our work fits your business instead of feeling like generic agency output.",
  },
  {
    q: 'Why EchoPulse instead of three separate agencies?',
    a: "Three agencies means three different reads of your brand on your channels, and you stuck in the middle managing the inconsistency. Our editors, writers, designers, and engineers all work off the same brief. One team, one direction, every channel. One invoice instead of five.",
  },
  {
    q: 'How fast do you ship?',
    a: '48 hours on individual deliverables — a LinkedIn post, a short-form edit, an ad creative, a property reel. Long-form blogs land in 5 to 7 days. Website builds run 3 to 4 weeks. Need a 24-hour rush? +30%.',
  },
  {
    q: 'Do you use AI, or avoid it?',
    a: 'We use AI as a research and outline tool, never as the final writer or editor. The last pass is always human, scored against your brand brief. If a draft reads like ChatGPT, we cut it. The bar is work you would happily publish under your own name.',
  },
  {
    q: 'Where is your team based?',
    a: "Remote and async, working across North American and European time zones. Most clients are in Canada, the US, the UK, India, and Western Europe. Communication runs through Slack, Notion, and Loom — you get same-day responses inside working hours, and weekly Loom walkthroughs on every batch we ship.",
  },
  {
    q: 'What do you need from me to start?',
    a: "Three things: 90 minutes for the onboarding interview, your existing brand assets (logo, colors, photos, anything you have published that you liked), and a 30-minute kickoff to align on goals and audience. After onboarding, plan on 30 to 60 minutes a week reviewing drafts. We handle the rest.",
  },
  {
    q: 'Do you work with real estate agents and local businesses?',
    a: "Yes. Real estate agents, brokerages, and short-term-rental operators are a core audience. Local businesses and service operators too. The deliverables shift — listing reels, agent-brand video, geo-targeted ads, local SEO content, booking funnels — but the model is the same. One team handles every channel.",
  },
  {
    q: 'Are there long-term contracts?',
    a: `No. Every retainer is month-to-month with 14 days notice to cancel. We open with a ${pilotPrice} Pilot — 14 days, real deliverables across the channels that fit your business, the onboarding interview, and one strategic asset — so you see the work before you commit to anything monthly.`,
  },
  {
    q: 'Who owns what we produce?',
    a: "You do, fully. On delivery, every file transfers to you — raw project files, design source, master video files, code, ad accounts. No licensing fees, no usage caps, no surprise invoice if you ever stop working with us.",
  },
];

type FaqItem = ReturnType<typeof buildFaqs>[number];

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

  // Compose the per-locale FAQ list. Memoization isn't worth it — the array
  // is tiny and only rebuilds when geo flips (once per session).
  const faqs = buildFaqs(`${currency}${prices.pilot}`);
  const HALF = Math.ceil(faqs.length / 2);
  const leftItems = faqs.slice(0, HALF);
  const rightItems = faqs.slice(HALF);

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
            mainEntity: faqs.map((faq) => ({
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

        {/* 2-column card grid */}
        <div className="faq-grid" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div className="faq-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leftItems.map((faq, i) => (
              <FaqCard key={faq.q} faq={faq} index={i} open={open} setOpen={setOpen} />
            ))}
          </div>
          <div className="faq-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rightItems.map((faq, i) => (
              <FaqCard key={faq.q} faq={faq} index={HALF + i} open={open} setOpen={setOpen} />
            ))}
          </div>
        </div>
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
          .faq-header { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; margin-bottom: 40px !important; }
          .faq-sub { flex-basis: auto !important; max-width: 560px; }
        }
        @media (max-width: 640px) {
          section#faq { padding: 72px 18px !important; }
          .faq-h2 { font-size: 38px !important; letter-spacing: -1.4px !important; }
          .faq-sub { font-size: 14px !important; line-height: 1.6 !important; }
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
