'use client';

import { motion } from 'framer-motion';
import { BOOK_CALL_URL } from '@/lib/links';

export default function Testimonials() {
  return (
    <section
      className="founder-section"
      data-dark-bg="true"
      style={{
        padding: '128px 0',
        background: 'linear-gradient(160deg, #111110 0%, #0d0c0a 50%, #160e07 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,84,26,0.15) 0%, transparent 70%)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: '460px', height: '460px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      </div>

      <div className="founder-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 56px', position: 'relative', zIndex: 1 }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'rgba(242,238,231,0.35)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
          From the Founder
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="founder-h2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(32px, 4.5vw, 64px)',
            fontWeight: 900,
            letterSpacing: 'clamp(-1px, -0.04em, -3px)',
            lineHeight: 1.05,
            color: '#F2EEE7',
            margin: '0 0 36px',
          }}
        >
          No fake testimonials.<br />
          <span style={{ color: '#E8541A' }}>Just the truth.</span>
        </motion.h2>

        {/* Letter card */}
        <motion.div
          className="founder-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '48px 56px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #E8541A, transparent)' }} />

          {/* Accent bar */}
          <div style={{ width: '32px', height: '2px', background: '#E8541A', marginBottom: '24px', borderRadius: '2px' }} />

          {/* Letter body */}
          <div className="founder-body" style={{ fontSize: '17px', color: 'rgba(242,238,231,0.85)', lineHeight: 1.85, fontWeight: 400 }}>
            <p style={{ margin: '0 0 22px' }}>
              I&apos;m Lakshya. I started EchoPulse because every &quot;AI content agency&quot; I saw was charging premium prices for ChatGPT slop. Clients kept paying for it because they didn&apos;t know better.
            </p>
            <p style={{ margin: '0 0 22px' }}>
              Before this, I edited 200+ real estate videos at a Canadian production company, ran 4 years of freelance motion design on Upwork, and now lead marketing for <strong style={{ color: '#fff', fontWeight: 600 }}>MagicBNB</strong>, a Canadian SaaS for short-term rental operators. That mix of production craft, B2B founder work, and SaaS marketing is the lens we apply to every client.
            </p>
            <p style={{ margin: '0 0 22px' }}>
              What makes EchoPulse different is the <strong style={{ color: '#fff', fontWeight: 600 }}>Voice Foundation</strong>. A 90-minute interview we run with every founder before we write a single word or cut a single frame. We capture your stories, your contrarian beliefs, your signature phrases. Then we build a Voice DNA document that every writer and editor on our team references on every deliverable.
            </p>
            <p style={{ margin: '0 0 22px' }}>
              The result is content that sounds like <em>you</em>. Not like ChatGPT. Not like a junior copywriter. Not like every other agency shipping &quot;delve into the tapestry of synergy&quot; garbage.
            </p>
            <p style={{ margin: 0 }}>
              We&apos;re six months old as EchoPulse. We don&apos;t have a glossy list of $80K case studies yet, and we won&apos;t pretend to. What we have is sharp craft, a system most agencies haven&apos;t built, and a willingness to start every relationship with a paid two-week Pilot so you see the work before committing. If that sounds like your kind of partner, let&apos;s talk.
            </p>
          </div>

          {/* Signature */}
          <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #E8541A, #d94a14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              LS
            </div>
            <div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '15px', color: '#F2EEE7' }}>Lakshya Soni</div>
              <div style={{ fontSize: '12px', color: 'rgba(242,238,231,0.5)', marginTop: '2px' }}>
                Founder, EchoPulse · Marketing Manager, MagicBNB
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}
        >
          <button
            onClick={() => (window as any).openBookCallModal && (window as any).openBookCallModal()}
            data-cursor-hover
            style={{
              background: '#E8541A',
              color: '#fff',
              padding: '15px 32px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'none',
              transition: 'all 0.3s',
              boxShadow: '0 8px 32px rgba(232,84,26,0.4)',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#d94a14')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#E8541A')}
          >
            Book a 45-Minute Strategy Call
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a
            href="https://www.linkedin.com/in/lakshyasoni/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.13)',
              color: '#F2EEE7',
              padding: '15px 28px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif',
              cursor: 'none',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.12)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.07)';
            }}
          >
            Connect on LinkedIn →
          </a>
        </motion.div>
      </div>

      <style>{`
        /* ── Mobile fix for the founder section ──
           Strip the nested padding (section + container + card) so paragraphs
           don't collapse to 3-words-per-line on phones. Tighten typography
           so the wall-of-text actually reads naturally. */
        @media (max-width: 768px) {
          .founder-section { padding: 64px 0 !important; }
          .founder-container { padding: 0 16px !important; }
          .founder-h2 {
            font-size: 30px !important;
            letter-spacing: -0.8px !important;
            line-height: 1.1 !important;
            margin-bottom: 24px !important;
          }
          .founder-card {
            padding: 28px 22px !important;
            border-radius: 18px !important;
          }
          .founder-body {
            font-size: 15px !important;
            line-height: 1.7 !important;
          }
          .founder-body p {
            margin-bottom: 16px !important;
          }
          /* Trim ambient blobs that bleed off-screen and cause horizontal scroll */
          .founder-section > div[style*="pointerEvents"] > div { width: 280px !important; height: 280px !important; }
        }
        @media (max-width: 380px) {
          .founder-h2 { font-size: 26px !important; }
          .founder-card { padding: 22px 16px !important; }
          .founder-body { font-size: 14.5px !important; line-height: 1.65 !important; }
        }
      `}</style>
    </section>
  );
}
