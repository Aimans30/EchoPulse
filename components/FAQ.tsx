'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'What is the Voice Foundation and why does every client get one?',
    a: 'A Voice Foundation is a 90-minute recorded interview we run with every founder before producing any LinkedIn post, blog, video script, or ad copy. We transcribe it, encode it into a structured Voice DNA document, and reference it on every deliverable. The result: content that sounds like you, not like ChatGPT or a junior copywriter. It is the single biggest reason our retention is high. Clients see their voice, not generic agency output.',
  },
  {
    q: 'Why EchoPulse instead of hiring 3 different agencies for video, LinkedIn, and ads?',
    a: 'Because most founders end up doing exactly that and managing the inconsistency between them. Our LinkedIn ghostwriter, blog writer, video editor, and ad creative team all reference the same Voice Foundation, the same brand pillars, and the same campaign goals. One studio means your message stays consistent across every channel without you playing project manager between vendors.',
  },
  {
    q: 'How fast is your turnaround?',
    a: '48 hours standard for individual deliverables (one LinkedIn post, one ad creative, one short-form video). Long-form blogs are 5 to 7 days end-to-end. Custom website projects are 3 to 4 weeks. Rush 24-hour delivery available for time-sensitive launches at a 30 percent surcharge.',
  },
  {
    q: 'Do you actually use AI, or do you avoid it?',
    a: 'We use AI as a tool, never as the writer. Every long-form piece runs through our multi-agent system for research and outline generation, but the final voice pass is human-edited against the Voice Foundation. The output gets scored against an Anti-AI-Tells checklist (banned words like "delve," "tapestry," "in today\'s fast-paced world") before it ships. Clients have called the result indistinguishable from their own writing.',
  },
  {
    q: 'Do you work with clients outside India?',
    a: 'Yes. Most of our work is for clients in Canada, the UK, USA, Western Europe, and Australia. The team operates from Bhopal, India, with strong time-zone overlap with European morning and Eastern North American morning. Async communication via Slack, Notion, and Loom keeps things tight regardless of geography.',
  },
  {
    q: 'What do you need from me to get started?',
    a: 'A 90-minute recorded interview for the Voice Foundation, your existing brand assets (logo, colors, fonts, any prior content you love), and a 30-minute strategy call to align on goals and ICP. After onboarding, the typical client spends 30 to 60 minutes per week reviewing drafts and approving deliverables. We handle the rest.',
  },
  {
    q: 'Are there long-term contracts?',
    a: 'No. Every retainer is month-to-month with 14-day cancellation notice. We start every relationship with a paid Founder Pilot at our intro price of $299 (two weeks, a curated mix of LinkedIn posts, a video edit, and a long-form blog plus the founder interview) so you can see our quality before committing to a monthly engagement.',
  },
  {
    q: 'Who owns the content you produce?',
    a: 'You do, in full. On delivery, all rights transfer to you including raw project files, source code, design assets, and master video files. No licensing fees, no usage restrictions, no surprise charges if you decide to leave.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" style={{ padding: '128px 56px', background: '#EAE5DC' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: '#6E6B63',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
        FAQ
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(36px, 4.5vw, 72px)',
          fontWeight: 900,
          letterSpacing: '-3px',
          margin: '0 0 8px',
          lineHeight: 1.05,
        }}
      >
        Questions <span style={{ color: '#E8541A' }}>answered.</span>
      </motion.h2>

      <div style={{ marginTop: '72px', maxWidth: '820px' }}>
        {faqs.map((faq, i) => (
          <motion.div
            key={faq.q}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            style={{ borderBottom: '1px solid rgba(12,12,11,0.09)' }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                outline: 'none',
                color: open === i ? '#E8541A' : '#0C0C0B',
                padding: '26px 0',
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                letterSpacing: '-0.3px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (open !== i) (e.currentTarget as HTMLElement).style.color = '#E8541A';
              }}
              onMouseLeave={(e) => {
                if (open !== i) (e.currentTarget as HTMLElement).style.color = '#0C0C0B';
              }}
            >
              {faq.q}
              <motion.div
                animate={{ rotate: open === i ? 45 : 0, background: open === i ? '#E8541A' : 'rgba(255,255,255,0.5)' }}
                transition={{ duration: 0.35 }}
                style={{
                  width: '28px',
                  height: '28px',
                  flexShrink: 0,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(12,12,11,0.09)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <line x1="5.5" y1="0" x2="5.5" y2="11" stroke={open === i ? '#fff' : '#0C0C0B'} strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="0" y1="5.5" x2="11" y2="5.5" stroke={open === i ? '#fff' : '#0C0C0B'} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <p
                    style={{
                      fontSize: '15px',
                      color: '#6E6B63',
                      lineHeight: 1.8,
                      paddingBottom: '28px',
                      maxWidth: '620px',
                      margin: 0,
                    }}
                  >
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
