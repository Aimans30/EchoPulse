'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HOME_FAQS, type FaqItem } from '@/lib/faqData';

/**
 * The homepage FAQ section.
 *
 * The questions and answers live in lib/faqData.ts and are shared with the
 * full /faq page, so the two can never drift. Prices and the Pilot scope in
 * those answers are built from lib/pricing.ts.
 *
 * Answer rules that get us cited, not just ranked:
 *   1. First sentence answers the question directly (extraction engines lift it).
 *   2. Concrete numbers we can honestly stand behind (our prices, our turnaround).
 *   3. No invented industry statistics (unsourced stats are a trust liability).
 */

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
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3) }}
      className={`faq-card${isOpen ? ' open' : ''}`}
      style={{
        background: isOpen
          ? 'linear-gradient(180deg, rgba(232,84,26,0.07) 0%, rgba(232,84,26,0.03) 100%)'
          : 'rgba(255,255,255,0.55)',
        border: `1px solid ${isOpen ? 'rgba(232,84,26,0.18)' : 'rgba(12,12,11,0.06)'}`,
        borderRadius: '18px',
        transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
        boxShadow: isOpen ? '0 10px 28px rgba(12,12,11,0.06)' : '0 1px 0 rgba(12,12,11,0.02)',
      }}
    >
      {/* The question is an <h3> wrapping a full-width toggle button.
          Heading = how Google and AI extraction identify a Q&A block; a styled
          <span> (the previous version) reads as decorative text. */}
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

          {/* Circular chip: + when closed, filled black circle with × when open. */}
          <motion.span
            className="faq-toggle"
            aria-hidden="true"
            animate={{
              background: isOpen ? '#0C0C0B' : 'rgba(255,255,255,0.85)',
              borderColor: isOpen ? '#0C0C0B' : 'rgba(12,12,11,0.10)',
            }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="faq-bar"
              style={{
                background: isOpen ? '#fff' : '#0C0C0B',
                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              }}
            />
            <span
              className="faq-bar"
              style={{
                background: isOpen ? '#fff' : '#0C0C0B',
                transform: isOpen ? 'rotate(-45deg)' : 'rotate(90deg)',
              }}
            />
          </motion.span>
        </button>
      </h3>

      {/*
        Answer stays MOUNTED whether open or closed — only collapsed to zero
        height. The earlier card version wrapped this in <AnimatePresence> and
        unmounted it on close, so the served HTML carried exactly ONE answer and
        crawlers never saw the rest, while the FAQPage schema claimed all of
        them. Collapsing by height keeps every answer in the DOM and crawlable.
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
        {faq.link && (
          <p className="faq-a faq-a-link">
            <Link href={faq.link.href} tabIndex={isOpen ? 0 : -1}>{faq.link.label}</Link>
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  // One flat list — no section grouping. The section labels ("Pricing &
  // comparison" / "Results & delivery") split 8 questions into two visually
  // disconnected blocks, which read as two separate FAQs rather than one.
  const flatFaqs = HOME_FAQS;

  // Split down the middle so the two columns fill evenly.
  const half = Math.ceil(flatFaqs.length / 2);
  const leftItems = flatFaqs.slice(0, half);
  const rightItems = flatFaqs.slice(half);

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
            What buyers actually ask before they hire a content agency. If yours isn&apos;t
            here, book a call and we&apos;ll answer it straight.
          </motion.p>
        </div>

        {/* One continuous 2-column card grid. Left column holds the first half,
           right column the second, so reading order stays top-to-bottom within
           each column and the two columns end level. */}
        <div className="faq-grid" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div className="faq-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leftItems.map((faq, i) => (
              <FaqCard key={faq.q} faq={faq} index={i} open={open} setOpen={setOpen} />
            ))}
          </div>
          <div className="faq-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rightItems.map((faq, i) => (
              <FaqCard key={faq.q} faq={faq} index={half + i} open={open} setOpen={setOpen} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .faq-q-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: none;
          border: none;
          text-align: left;
          padding: 22px 26px;
          cursor: pointer;
          font-family: inherit;
        }
        /* Custom-cursor treatment only where a pointer actually exists. */
        @media (hover: hover) and (pointer: fine) {
          .faq-q-btn { cursor: none; }
        }
        .faq-q {
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.2px;
          color: #0C0C0B;
          line-height: 1.4;
        }
        .faq-toggle {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(12,12,11,0.10);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .faq-bar {
          position: absolute;
          width: 11px;
          height: 1.8px;
          border-radius: 2px;
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .faq-q-btn:focus-visible {
          outline: 2px solid #E8541A;
          outline-offset: -4px;
          border-radius: 18px;
        }
        .faq-a {
          margin: 0 26px 22px;
          font-size: 14.5px;
          line-height: 1.7;
          color: #6E6B63;
          font-weight: 400;
        }

        .faq-a-link { margin-top: -10px; }
        .faq-a-link a { color: #0C0C0B; font-weight: 600; text-decoration: underline; text-decoration-color: #E8541A; text-underline-offset: 3px; }
        .faq-a-link a:hover { color: #E8541A; }

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
          section#faq { padding: 64px 18px !important; }
          .faq-header { gap: 12px !important; margin-bottom: 24px !important; }
          .faq-h2 { font-size: 38px !important; letter-spacing: -1.4px !important; }
          .faq-sub { font-size: 15px !important; line-height: 1.65 !important; }
          /* globals.css pads .faq-card itself below 480px, which would double up
             with the button's own padding and cost ~36px of usable width on a
             320px screen. The card is a frame; the button owns the inset. */
          .faq-card { padding: 0 !important; }
          .faq-q-btn { padding: 18px 16px !important; gap: 14px !important; min-height: 56px !important; }
          .faq-q { font-size: 15px !important; line-height: 1.45 !important; }
          /* Answers are the payload of this section. 15px floor, looser leading
             than desktop because the measure is much narrower. */
          .faq-a { font-size: 15px !important; line-height: 1.72 !important; margin: 0 16px 18px !important; }
          .faq-toggle { width: 34px !important; height: 34px !important; }
        }
        @media (max-width: 380px) {
          section#faq { padding: 56px 14px !important; }
          .faq-h2 { font-size: 32px !important; letter-spacing: -1.2px !important; }
          .faq-q-btn { padding: 16px 14px !important; gap: 10px !important; }
          .faq-a { margin: 0 14px 16px !important; }
        }
      `}</style>
    </section>
  );
}
