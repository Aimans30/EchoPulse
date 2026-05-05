'use client';

import { motion } from 'framer-motion';

export default function CTABanner() {
  return (
    <div className="cta-banner-wrap" style={{ margin: '0 56px 128px' }}>
      <motion.div
        className="cta-banner-inner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
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
        {/* Glow */}
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
            You have a brand to build.
            <span style={{ color: '#E8541A', display: 'block' }}>Let us handle the content.</span>
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
              maxWidth: '480px',
              lineHeight: 1.7,
            }}
          >
            Book a free 45-minute strategy call. We'll map out exactly what your content system needs to start attracting the right people — no obligation, no pressure.
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
          <motion.a
            href="https://echopulse.media"
            target="_blank"
            rel="noopener noreferrer"
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
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#d94a14')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#E8541A')}
          >
            Book Your Free Strategy Call
          </motion.a>
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
