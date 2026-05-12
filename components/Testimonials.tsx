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

      <div className="founder-container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 56px', position: 'relative', zIndex: 1 }}>
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

        {/* Letter card — 2-column on desktop: portrait photo + signature on the left,
           letter body on the right. Stacks on mobile. */}
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

          <div className="founder-card-grid" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
            {/* LEFT — portrait photo + signature block */}
            <div className="founder-portrait-col" style={{ flex: '0 0 240px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                className="founder-portrait-frame"
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 5',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(232,84,26,0.18), rgba(139,92,246,0.10))',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
                }}
              >
                {/* Photo — drop your image into /public/founder.jpg and it appears here.
                   If the file is missing the gradient + initials fallback shows through. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/founder.jpg"
                  alt="Lakshya Soni, founder of EchoPulse"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                {/* Subtle bottom shade for legibility of caption */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)', pointerEvents: 'none' }} />
                {/* Name plate */}
                <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '14px', color: '#F2EEE7', letterSpacing: '-0.2px' }}>Lakshya Soni</div>
                  <div style={{ fontSize: '11px', color: 'rgba(242,238,231,0.78)', marginTop: '2px', fontWeight: 500 }}>Founder, EchoPulse</div>
                </div>
              </div>

              {/* Quick stats — give the portrait some weight */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '6px' }}>
                {[
                  // Stack highlights the four disciplines the founder brings —
                  // applies whether the client is a founder, coach, business
                  // owner, or creator. No specific niche language here.
                  { n: 'Scripts', l: 'For the people on camera' },
                  { n: 'Direction', l: 'Brand films + campaigns' },
                  { n: '4 yrs+', l: 'Across every format' },
                ].map((s) => (
                  <div key={s.l} style={{ display: 'flex', alignItems: 'baseline', gap: '10px', paddingLeft: '14px', borderLeft: '2px solid rgba(232,84,26,0.65)' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '15px', color: '#F2EEE7', letterSpacing: '-0.3px' }}>{s.n}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(242,238,231,0.55)', fontWeight: 500 }}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — letter body */}
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              {/* Accent bar */}
              <div style={{ width: '32px', height: '2px', background: '#E8541A', marginBottom: '24px', borderRadius: '2px' }} />

              <div className="founder-body" style={{ fontSize: '17px', color: 'rgba(242,238,231,0.85)', lineHeight: 1.85, fontWeight: 400 }}>
                <p style={{ margin: '0 0 22px' }}>
                  I&apos;m Lakshya. I&apos;ve spent years working the full content stack &mdash; cutting video across formats at a Canadian production studio, <strong style={{ color: '#fff', fontWeight: 600 }}>writing scripts the people on camera actually wanted to deliver</strong>, leading <strong style={{ color: '#fff', fontWeight: 600 }}>creative direction</strong> on brand films and campaigns across industries, running four years of freelance motion design on Upwork, and today running marketing for a SaaS company.
                </p>
                <p style={{ margin: '0 0 22px' }}>
                  Editor, writer, creative director, marketer. That combined lens is what gets brought to every EchoPulse client &mdash; the script is written by someone who&apos;s edited the cut, the cut is shaped by someone who&apos;s briefed the campaign, the campaign is built by someone who&apos;s sat in the marketing seat.
                </p>
                <p style={{ margin: '0 0 22px' }}>
                  I started EchoPulse because I kept seeing the same thing: agencies charging serious money and delivering garbage. No strategy, no craft, no accountability. Just deliverables for the sake of deliverables. Clients deserved actual work, not invoices dressed up as output.
                </p>
                <p style={{ margin: '0 0 22px' }}>
                  What makes us different is the <strong style={{ color: '#fff', fontWeight: 600 }}>Voice Foundation</strong>: a 90-minute interview every client does before we write a word. We capture your stories, your beliefs, the phrases you actually use, and turn it into a Voice DNA doc every writer and editor on the team references on every deliverable.
                </p>
                <p style={{ margin: '0 0 22px' }}>
                  The result is content that sounds like <em>you</em>. Not a content mill. Not a junior copywriter. Not every other agency on the internet.
                </p>
                <p style={{ margin: 0 }}>
                  We&apos;re a young studio. We don&apos;t carry a glossy list of $80K case studies and we won&apos;t pretend to. What we do carry is years of craft across every format you need, a system most agencies haven&apos;t built, and a paid two-week Pilot so you see the work before you commit. If that sounds like your kind of partner, let&apos;s talk.
                </p>
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
          <a
            href={BOOK_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
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
          </a>
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
        @media (max-width: 900px) {
          /* Stack portrait + letter on tablets and below */
          .founder-card-grid { flex-direction: column !important; gap: 28px !important; }
          .founder-portrait-col { flex: 0 0 auto !important; width: 100% !important; max-width: 340px; align-self: center; }
        }
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
