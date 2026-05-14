'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  // ── Top 3: objection-handlers, ordered the way buyers actually hesitate ──
  {
    q: "You're new. Why should I trust you with my brand?",
    a: "Because we don't ask you to. Every engagement opens with a paid $299 Pilot — 14 days, real deliverables, no contract. You see the work, then decide. If it's not what you'd publish, you keep what we made and walk away. On top of that: I spent years editing professional video at a Canadian production studio, ran paid client work in motion and content, and lead marketing at a Canadian SaaS today. The shop is new. The hands aren't.",
  },
  {
    q: 'Will it actually sound like me, or like every other agency?',
    a: "That's what the Voice Foundation exists to fix. We record a 90-minute interview, pull your phrasing, your beliefs, the stories you already tell, and turn it into a Voice DNA document. Every draft gets scored against it before it ships. Below an 8/10 match, it doesn't go out.",
  },
  {
    q: "What if I don't like the work?",
    a: 'Unlimited revisions during the Pilot. Retainers cancel with 14 days notice — no contract, no clawback, no recovery fees. You own every file we make from day one.',
  },
  // ── Existing FAQs continue below, original order preserved ──
  {
    q: 'What is the Voice Foundation?',
    a: "A 90-minute recorded interview every client does before we write a word. We transcribe it, extract your vocabulary, opinions, stories, and rhythm, and build a Voice DNA doc. Every writer and editor on the team references it on every deliverable. It's the single reason our work sounds like you instead of like a content mill.",
  },
  {
    q: 'Why EchoPulse instead of three separate agencies?',
    a: "Because three agencies means three different voices on your channels and you stuck in the middle managing the inconsistency. Our LinkedIn writer, blog writer, video editor, and ad creative all work off the same Voice Foundation. One brain, one voice, every channel.",
  },
  {
    q: 'How fast do you ship?',
    a: '48 hours on individual deliverables — a LinkedIn post, a short-form edit, an ad creative. Long-form blogs land in 5 to 7 days. Website builds run 3 to 4 weeks. Need a 24-hour rush? +30%.',
  },
  {
    q: 'Do you use AI, or avoid it?',
    a: 'We use AI as a research and outline tool, never as the writer. The final pass is always human, scored against your Voice Foundation. If a draft reads like ChatGPT, we cut it. Clients regularly tell us they cannot tell which posts they wrote and which we wrote.',
  },
  {
    q: 'Where is your team based?',
    a: "Remote and async, working across North American and European time zones. Most of our clients are in Canada, the US, the UK, and Western Europe. Communication runs through Slack, Notion, and Loom — you get same-day responses inside normal working hours, and weekly Loom walkthroughs on every batch we ship.",
  },
  {
    q: 'What do you need from me to start?',
    a: "Three things: 90 minutes for the Voice Foundation interview, your existing brand assets (logo, colors, anything you've published you like), and a 30-minute kickoff to align on goals and audience. After onboarding, plan on 30 to 60 minutes a week reviewing drafts. We handle the rest.",
  },
  {
    q: 'Are there long-term contracts?',
    a: "No. Every retainer is month-to-month with 14 days notice to cancel. We open with a $299 Pilot — 14 days, 12 LinkedIn posts, 3 short-form edits, 5 long-form blog drafts, the voice interview, and one strategic deliverable — so you see the work before you commit to anything monthly.",
  },
  {
    q: 'Who owns what we produce?',
    a: "You do, fully. On delivery, every file transfers to you — raw project files, design source, master video files, code. No licensing fees, no usage caps, no surprise invoice if you ever stop working with us.",
  },
];

// Split into 2 columns: first half on the left, second half on the right.
// Top 3 (objection-handlers) live at the top of the left column where the eye lands first.
const HALF = Math.ceil(faqs.length / 2);
const leftItems = faqs.slice(0, HALF);
const rightItems = faqs.slice(HALF);

type FaqItem = (typeof faqs)[number];

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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <span
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
          .faq-header { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
          .faq-sub { flex-basis: auto !important; max-width: 560px; }
        }
        @media (max-width: 640px) {
          section#faq { padding: 80px 20px !important; }
          .faq-h2 { font-size: 40px !important; letter-spacing: -1.5px !important; }
          .faq-card { padding: 18px 20px !important; }
        }
      `}</style>
    </section>
  );
}
