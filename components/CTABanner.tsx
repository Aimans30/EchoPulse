'use client';

import { motion } from 'framer-motion';
import { BOOK_CALL_LABEL_LONG } from '@/lib/links';
import { trackCallClick } from '@/lib/analytics';

/**
 * CTABanner — clean dark card on its own.
 *
 * The painterly multi-color SVG background was removed (per user feedback —
 * the gradient slice bleeding past the top corner looked off). Back to the
 * original premium-agency pattern: solid dark surface, soft single-color
 * orange radial highlight in the back-right corner for warmth, generous
 * padding. No gradient strips, no painterly blobs, no glass card.
 */
export default function CTABanner() {
  return (
    <div
      id="book-call"
      className="cta-banner-wrap"
      style={{ margin: '64px 56px 128px', scrollMarginTop: '80px' }}
    >
      <motion.div
        className="cta-banner-inner"
        data-dark-bg="true"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#0C0C0B',
          borderRadius: '24px',
          padding: '96px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '48px',
          position: 'relative',
          overflow: 'hidden',
          flexWrap: 'wrap',
        }}
      >
        {/* Soft single-color radial glow back-right — the ONLY background
            effect. No multi-color blobs, no gradient strips, no painterly. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            // Explicitly sized so the glow reaches zero alpha INSIDE the box.
            // An unsized `ellipse at 70% 50%` runs to the farthest corner and is
            // still tinted at the element bounds, which clips into a visible
            // rectangle against the matching dark background behind it.
            background:
              'radial-gradient(ellipse 55% 70% at 68% 50%, rgba(232,84,26,0.12) 0%, rgba(232,84,26,0.05) 45%, rgba(232,84,26,0) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="cta-banner-text"
          style={{
            position: 'relative',
            zIndex: 1,
            flex: '1 1 520px',
            minWidth: 0,
            maxWidth: '880px',
          }}
        >
          <motion.div
            className="cta-banner-h"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(30px, 3.6vw, 52px)',
              fontWeight: 900,
              letterSpacing: '-1.4px',
              lineHeight: 1.06,
              color: '#F2EEE7',
            }}
          >
            <span style={{ display: 'block' }}>Get back 20 to 30 hours a week.</span>
            <span style={{ color: '#E8541A', display: 'block' }}>We run your content.</span>
            <span style={{ display: 'block' }}>You run your business.</span>
          </motion.div>
          <motion.p
            className="cta-banner-p"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              fontSize: '16px',
              color: 'rgba(242,238,231,0.55)',
              marginTop: '24px',
              maxWidth: '540px',
              lineHeight: 1.7,
            }}
          >
            That is what most founders, coaches, business owners, and real estate agents lose every week. Editing clips. Writing posts. Chasing freelancers. Reviewing drafts that still miss the mark. We handle all of it. Book a free 45-minute call. We will review what you are publishing today, map a 30-day plan, and put the numbers in writing.
          </motion.p>
        </div>

        <motion.div
          className="cta-banner-action"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.button
            type="button"
            className="cta-banner-btn"
            data-cursor-hover
            aria-label={BOOK_CALL_LABEL_LONG}
            onClick={() => {
              trackCallClick('cta_banner');
              (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
            }}
            whileHover={{ scale: 1.04, boxShadow: '0 16px 60px rgba(232,84,26,0.5)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: '#E8541A',
              color: '#fff',
              border: 'none',
              padding: '20px 44px',
              borderRadius: '100px',
              fontSize: '15px',
              fontWeight: 700,
              // Cursor handled in CSS below so it can be gated to hover devices.
              transition: 'background 0.3s',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 40px rgba(232,84,26,0.38)',
              minHeight: '48px',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = '#d94a14')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = '#E8541A')
            }
          >
            {BOOK_CALL_LABEL_LONG}
          </motion.button>
          <span
            style={{
              fontSize: '12px',
              color: 'rgba(242,238,231,0.28)',
              textAlign: 'center',
            }}
          >
            No credit card. No contracts. Just a conversation.
          </span>
        </motion.div>
      </motion.div>

      <style>{`
        .cta-banner-btn { cursor: pointer; }
        /* The native cursor is only worth hiding where the custom one runs. */
        @media (hover: hover) and (pointer: fine) {
          .cta-banner-btn { cursor: none; }
        }

        @media (max-width: 900px) {
          .cta-banner-inner { padding: 60px 48px !important; }
          .cta-banner-h { font-size: clamp(28px, 6vw, 44px) !important; letter-spacing: -1px !important; }
        }
        @media (max-width: 640px) {
          /* Bottom margin trimmed: the footer already reserves space for the
             sticky CTA bar, so 80px here was pure dead scroll on a phone. */
          .cta-banner-wrap { margin: 32px 16px 48px !important; }
          .cta-banner-inner { padding: 40px 22px !important; gap: 24px !important; }
          .cta-banner-h { font-size: 28px !important; letter-spacing: -0.8px !important; line-height: 1.1 !important; }
          .cta-banner-text { flex-basis: 100% !important; }
          .cta-banner-p { font-size: 15px !important; line-height: 1.65 !important; margin-top: 16px !important; }
          .cta-banner-action { width: 100% !important; align-items: stretch !important; }
          .cta-banner-btn { width: 100% !important; padding: 17px 24px !important; min-height: 54px !important; }
          /* The reassurance line under the CTA sat at 0.28 alpha on near-black,
             which is effectively invisible on a phone screen outdoors. */
          .cta-banner-action > span { color: rgba(242,238,231,0.5) !important; font-size: 12.5px !important; }
        }
        @media (max-width: 380px) {
          .cta-banner-wrap { margin: 28px 12px 44px !important; }
          .cta-banner-inner { padding: 32px 18px !important; }
          .cta-banner-h { font-size: 26px !important; }
        }
      `}</style>
    </div>
  );
}
