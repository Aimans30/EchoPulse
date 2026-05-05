'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Why EchoPulse instead of hiring in-house?',
    a: 'An in-house video editor in the US costs $60K–$80K per year before benefits. With EchoPulse you get a full team — editors, strategists, automation specialists, and a brand consultant — for a fraction of that. No hiring, no training, no HR overhead.',
  },
  {
    q: 'How fast will I see results?',
    a: 'Most clients see meaningful engagement growth within 30 days and measurable lead flow increases within 60–90 days. Clients who commit to consistent content and follow our strategy framework see the strongest results.',
  },
  {
    q: 'Do you work with clients outside the US?',
    a: 'Yes. We actively work with clients in the USA, UK, UAE, Australia, Canada, and Singapore. Our team is fully remote and timezone-flexible. Geography is never a barrier.',
  },
  {
    q: 'What do you need from me to get started?',
    a: 'Primarily your raw footage and a brief for each piece of content. After the onboarding call, we create brief templates so it takes less than 10 minutes per week on your side. We handle everything from there.',
  },
  {
    q: 'Are there long-term contracts?',
    a: 'No. We work month-to-month because our results should keep clients with us — not a contract. That said, most of our clients have been with us for 6 months or more.',
  },
  {
    q: 'Who owns the content you produce?',
    a: 'You do, 100%. Upon delivery, all content is yours to use however and wherever you want. No licensing fees, no restrictions.',
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
