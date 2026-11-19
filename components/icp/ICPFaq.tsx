'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DUR, EASE } from '@/lib/motion';

/**
 * FAQ accordion for the 5 ICP landing pages.
 *
 * Rewritten to fix two defects that shipped together, both of which the
 * homepage equivalent (components/FAQ.tsx) had already solved:
 *
 * 1. KEYBOARD AND SCREEN READER ACCESS. The toggle was a bare
 *    `<div onClick>` with no role, no tabIndex, no key handler and no
 *    aria-expanded. Every one of these pages was therefore an FAQ that a
 *    keyboard-only or screen-reader visitor could see but could not open.
 *    It is now a real <button> inside the <h3>, which gets focus, Enter and
 *    Space for free and announces its own state.
 *
 * 2. CRAWLABILITY. Answers were wrapped in <AnimatePresence> and unmounted on
 *    close, so the served HTML contained exactly ONE answer while
 *    app/[icp]/page.tsx emits FAQPage JSON-LD listing all of them. Schema that
 *    contradicts the rendered page is ignored, so the markup was doing nothing.
 *    Answers now stay mounted and collapse by height, which is the pattern
 *    FAQ.tsx documents for exactly this reason.
 *
 * The card is no longer the click target. A whole-card handler meant the
 * answer text could not be selected without `stopPropagation` hacks, and it
 * gave assistive tech no sensible element to announce.
 */
export default function ICPFaq({ faq, accent }: { faq: { q: string; a: string }[]; accent: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="icp-faq" style={{ borderTop: '1px solid rgba(12,12,11,0.12)' }}>
      {faq.map((item, i) => {
        const isOpen = open === i;
        const panelId = `icp-faq-panel-${i}`;
        const buttonId = `icp-faq-button-${i}`;

        return (
          <div key={item.q} className="icp-faq-card" style={{ borderBottom: '1px solid rgba(12,12,11,0.12)' }}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                data-cursor-hover
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 24,
                  minHeight: 64,
                  padding: '20px 0',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  font: 'inherit',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: '#0C0C0B',
                  lineHeight: 1.4,
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: `1px solid ${isOpen ? accent : 'rgba(12,12,11,0.14)'}`,
                    background: isOpen ? accent : 'transparent',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s, border-color 0.2s',
                  }}
                >
                  <span style={{ position: 'absolute', width: 12, height: 2, background: isOpen ? '#fff' : '#0C0C0B', borderRadius: 2 }} />
                  <span style={{ position: 'absolute', width: 12, height: 2, background: isOpen ? '#fff' : '#0C0C0B', borderRadius: 2, transform: isOpen ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.3s' }} />
                </span>
              </button>
            </h3>

            {/* Always rendered, collapsed by height. This is what keeps every
                answer in the served HTML for crawlers and answer engines, and
                what makes the page's FAQPage schema truthful. */}
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: DUR.sm, ease: EASE.out }}
              style={{ overflow: 'hidden' }}
            >
              <p style={{ margin: 0, padding: '0 56px 24px 0', fontSize: 16, lineHeight: 1.7, color: '#3E3D3A', maxWidth: '68ch' }}>
                {item.a}
              </p>
            </motion.div>
          </div>
        );
      })}
      <style>{`
        @media (max-width: 768px) {
          .icp-faq button { font-size: 17px !important; }
          .icp-faq p { padding-right: 0 !important; }
        }
      `}</style>
    </div>
  );
}
