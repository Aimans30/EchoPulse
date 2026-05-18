'use client';

import { motion } from 'framer-motion';
import { BOOK_CALL_URL, BOOK_CALL_LABEL_LONG } from '@/lib/links';

export default function CTABanner() {
  return (
    <div id="book-call" className="cta-banner-wrap" style={{ margin: '0 56px 128px', scrollMarginTop: '80px' }}>
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 70% 50%, rgba(232,84,26,0.12) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(36px, 4.5vw, 68px)',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              lineHeight: 1.02,
              color: '#F2EEE7',
            }}
          >
            You build the business.
            <span style={{ color: '#E8541A', display: 'block' }}>We make it sound like you.</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              fontSize: '16px',
              color: 'rgba(242,238,231,0.4)',
              marginTop: '20px',
              maxWidth: '500px',
              lineHeight: 1.7,
            }}
          >
            Free 45-minute strategy call. We audit your current content, run a 10-minute Voice Foundation preview, and send you a custom plan for video, LinkedIn, blogs, and ad creative. Whether or not you ever hire us.
          </motion.p>
        </div>

        <motion.div
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
            onClick={() => (window as any).openBookCallModal && (window as any).openBookCallModal()}
            data-cursor-hover
            aria-label={BOOK_CALL_LABEL_LONG}
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
              cursor: 'none',
              transition: 'background 0.3s',
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'none',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 40px rgba(232,84,26,0.38)',
              minHeight: '48px',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#d94a14')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#E8541A')}
          >
            {BOOK_CALL_LABEL_LONG}
          </motion.button>
          <span style={{ fontSize: '12px', color: 'rgba(242,238,231,0.28)', textAlign: 'center' }}>
            No credit card. No contracts. Just a conversation.
          </span>
        </motion.div>
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .cta-banner-inner { padding: 60px 48px !important; }
        }
        @media (max-width: 640px) {
          .cta-banner-wrap { margin: 0 16px 80px !important; }
          .cta-banner-inner { padding: 48px 28px !important; }
        }
      `}</style>
    </div>
  );
}
