'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ICPFaq — the interactive accordion. The questions + answers are ALSO rendered
 * by the server section as an SEO-visible <details>-free list is not needed here
 * because the raw text lives in this component's initial render (the <span>/<p>
 * for the open item and all questions are in the HTML), and the page route
 * emits a matching FAQPage JSON-LD block. Mirrors the visual language of the
 * main FAQ component.
 */
export default function ICPFaq({ faq, accent }: { faq: { q: string; a: string }[]; accent: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 860, margin: '0 auto' }}>
      {faq.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="icp-faq-card"
            onClick={() => setOpen(isOpen ? null : i)}
            data-cursor-hover
            style={{
              background: isOpen ? `${accent}0d` : 'rgba(255,255,255,0.55)',
              border: `1px solid ${isOpen ? `${accent}30` : 'rgba(12,12,11,0.06)'}`,
              borderRadius: 18,
              // The whole card is the toggle, so 22px of block padding around a
              // 16px question is already a ~66px tap row. Keeping it and only
              // trimming the side inset on phones (see ICPPage's stylesheet)
              // buys back measure without shrinking the target.
              padding: '22px 26px',
              // Gated to (hover: hover) and (pointer: fine) in ICPPage's
              // stylesheet: on a touchscreen the custom dot cursor never
              // mounts, so `cursor: none` only removes an affordance.
              cursor: 'pointer',
              touchAction: 'manipulation',
              transition: 'background 0.3s, border-color 0.3s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px', color: '#0C0C0B', lineHeight: 1.4, margin: 0 }}>
                {item.q}
              </h3>
              <span aria-hidden="true" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', border: `1px solid ${isOpen ? accent : 'rgba(12,12,11,0.12)'}`, background: isOpen ? accent : 'transparent', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                <span style={{ position: 'absolute', width: 11, height: 1.8, background: isOpen ? '#fff' : '#0C0C0B', borderRadius: 2 }} />
                <span style={{ position: 'absolute', width: 11, height: 1.8, background: isOpen ? '#fff' : '#0C0C0B', borderRadius: 2, transform: isOpen ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.3s' }} />
              </span>
            </div>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden' }}>
                  <p onClick={(e) => e.stopPropagation()} style={{ margin: '16px 0 4px', fontSize: 14.5, lineHeight: 1.7, color: '#6E6B63' }}>
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
