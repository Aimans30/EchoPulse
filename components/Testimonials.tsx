'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { BOOK_CALL_URL } from '@/lib/links';
import { trackCallClick } from '@/lib/analytics';

/**
 * Founder section ("Testimonials" by name — actually the founder POV).
 *
 * Editorial-letter redesign (replaces the earlier card-stack layout):
 *   • Decorative oversized quote mark behind the headline (magazine-style)
 *   • One headline line with a subtle vertical lockup
 *   • Founder signature as a single inline row (avatar · name · role · city)
 *     — replaces the previous boxy founder card
 *   • Trust principles collapsed from 3 separate cards into ONE inline strip
 *     ("Owner-operated · 3-hour replies · Re-do until right") — saves two
 *     full rows of mobile scroll AND reads as a tagline instead of a grid
 *   • Read-the-full-letter expand kept (curious visitors can dig in)
 *   • CTAs at the end: Talk to me · LinkedIn
 *
 * Mobile target: clean read at 360px, no horizontal scroll, every
 * interactive element ≥ 44px tap target.
 */
export default function Testimonials() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className="founder-section"
      data-dark-bg="true"
      style={{
        padding: '120px 0 112px',
        background: 'linear-gradient(160deg, #111110 0%, #0d0c0a 50%, #160e07 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,84,26,0.13) 0%, transparent 70%)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      </div>

      <div className="founder-container" style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 28px', position: 'relative', zIndex: 1 }}>
       <div className="founder-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '56px', alignItems: 'center' }}>
        <div className="founder-col-text" style={{ maxWidth: '720px', minWidth: 0 }}>

        {/* ── Editorial eyebrow ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'rgba(242,238,231,0.5)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ width: '28px', height: '1px', background: '#E8541A', display: 'block' }} />
          A letter from the founder
        </motion.div>

        {/* ── Quote-mark + headline lockup ─────────────────────────── */}
        <div className="founder-headline-wrap" style={{ position: 'relative', marginBottom: '32px' }}>
          {/* Giant decorative opening quote — sits behind the text, low opacity */}
          <div
            aria-hidden="true"
            className="founder-quote-mark"
            style={{
              position: 'absolute',
              top: '-22px',
              left: '-14px',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '150px',
              fontWeight: 900,
              lineHeight: 1,
              color: 'rgba(232,84,26,0.16)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            “
          </div>

          <motion.h2
            className="founder-h2"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(30px, 4.4vw, 56px)',
              fontWeight: 900,
              letterSpacing: 'clamp(-0.8px, -0.035em, -2px)',
              lineHeight: 1.08,
              color: '#F2EEE7',
              margin: 0,
              zIndex: 1,
            }}
          >
            I&apos;ve sat in every seat{' '}
            <span style={{ color: '#E8541A' }}>you&apos;re about to outsource.</span>
          </motion.h2>
        </div>

        {/* ── Founder signature row ────────────────────────────────────
            Single horizontal line: avatar + name + role + bio (one line).
            On mobile the bio drops to a second line under the name. */}
        <motion.div
          className="founder-sig"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '28px',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(232,84,26,0.16)',
          }}
        >
          {/* Avatar — smaller (52px) for signature feel */}
          <div
            className="founder-avatar"
            style={{
              width: '52px',
              height: '52px',
              flexShrink: 0,
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(232,84,26,0.18), rgba(139,92,246,0.10))',
              border: '1.5px solid rgba(232,84,26,0.45)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.32)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/founder.jpg"
              alt="Lakshya Soni, founder of EchoPulse"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          {/* Name + role inline. On mobile this stacks. */}
          <div className="founder-sig-meta" style={{ minWidth: 0, flex: 1, lineHeight: 1.35 }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px',
              flexWrap: 'wrap',
            }}>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15.5px',
                fontWeight: 800,
                color: '#F2EEE7',
                letterSpacing: '-0.3px',
              }}>
                Lakshya Soni
              </div>
              <div style={{
                fontSize: '12.5px',
                color: 'rgba(242,238,231,0.55)',
                fontWeight: 600,
                letterSpacing: '0.2px',
              }}>
                Founder · EchoPulse · Bhopal
              </div>
            </div>
            <div className="founder-sig-bio" style={{ fontSize: '12.5px', color: 'rgba(242,238,231,0.5)', marginTop: '4px' }}>
              Editor, marketer, and engineer · cut video professionally since 18 · marketing lead at a Canadian SaaS · writes the code this site runs on.
            </div>
          </div>
        </motion.div>

        {/* ── Inline trust strip — three principles as one tagline ───
            Replaces the previous 3-card grid. Reads as a tight line, fits
            in two rows max even at 360px viewport. */}
        <motion.div
          className="founder-trust"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.14 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px 14px',
            flexWrap: 'wrap',
            marginBottom: '32px',
          }}
        >
          {[
            { title: 'Owner-operated', body: 'You talk to the people building.' },
            { title: '3-hour replies',  body: 'Inside every workday.' },
            { title: 'Re-do until right', body: 'Until you’d post it under your own name.' },
          ].map((p, i, arr) => (
            <div key={p.title} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px 14px', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}>
                <span aria-hidden="true" style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#E8541A',
                  boxShadow: '0 0 8px rgba(232,84,26,0.6)',
                  display: 'inline-block',
                  transform: 'translateY(-2px)',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#F2EEE7',
                  letterSpacing: '-0.2px',
                }}>
                  {p.title}
                </span>
                <span className="founder-trust-body" style={{
                  fontSize: '12.5px',
                  color: 'rgba(242,238,231,0.55)',
                  fontWeight: 500,
                }}>
                  {p.body}
                </span>
              </div>
              {i < arr.length - 1 && (
                <span aria-hidden="true" className="founder-trust-sep" style={{
                  width: '1px',
                  height: '14px',
                  background: 'rgba(255,255,255,0.14)',
                  display: 'inline-block',
                }} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Supporting line — natural context for readers + crawlers. Works the
            primary keywords in without stuffing. */}
        <motion.p
          className="founder-support"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          style={{ fontSize: '13.5px', lineHeight: 1.7, color: 'rgba(242,238,231,0.6)', margin: '0 0 28px', maxWidth: '560px' }}
        >
          Most agencies are one discipline wearing a suit: an edit shop that outsources the writing, or a copy shop that outsources the video. I have done every seat. Years cutting video at a production studio, marketing lead at a Canadian SaaS where content had to produce pipeline and not just look good, and enough engineering to ship the code this site runs on. That is the whole reason EchoPulse works the way it does: the person reviewing your deliverable has actually cut the footage, written the hook, and run the ad. You are not explaining your business to an account manager who relays it, imperfectly, to someone you will never meet.
        </motion.p>

        {/* ── Read-the-full-letter expand ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
          style={{ marginBottom: '28px' }}
        >
          <button
            type="button"
            className="founder-expand-btn"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            data-cursor-hover
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '4px 0',
              background: 'transparent',
              border: 'none',
              color: 'rgba(242,238,231,0.72)',
              borderRadius: 0,
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'color 0.2s',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              minHeight: '44px',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = '#F2EEE7';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = 'rgba(242,238,231,0.72)';
            }}
          >
            {expanded ? 'Hide the full letter' : 'Read the full letter'}
            <ChevronDown
              size={13}
              strokeWidth={2.6}
              style={{
                transition: 'transform 0.2s',
                transform: expanded ? 'rotate(180deg)' : 'none',
              }}
            />
          </button>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                overflow: 'hidden',
                marginTop: '20px',
                fontSize: '15px',
                color: 'rgba(242,238,231,0.78)',
                lineHeight: 1.72,
              }}
            >
              <p style={{ margin: '0 0 14px' }}>
                I&apos;ve been editing video professionally since I was 18, run paid client work across motion design and brand films, lead marketing for a Canadian SaaS, and ship production code in their app. EchoPulse exists because I care how the work looks, reads, and lands.
              </p>
              <p style={{ margin: '0 0 14px' }}>
                Most high-ticket agencies pitch with portfolios that never match what they hand back. Three months in, you&apos;re paying $15K invoices for templated reels, captions written by ChatGPT, and decks for status meetings you didn&apos;t ask for. Their bar is &quot;ready to send.&quot; Ours is &quot;we&apos;d publish this under our own name.&quot;
              </p>
              <p style={{ margin: '0 0 14px' }}>
                We run small on purpose. <strong style={{ color: '#fff', fontWeight: 600 }}>Shaurya</strong> leads design. <strong style={{ color: '#fff', fontWeight: 600 }}>Aiman</strong> runs delivery. I&apos;m on every project. No account managers, no upsells, no surprise invoices.
              </p>
              <p style={{ margin: 0 }}>
                That&apos;s the deal. Disciplined, responsive, and proud of every deliverable.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ── CTAs ───────────────────────────────────────────────── */}
        <motion.div
          className="founder-ctas"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.22 }}
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => {
              trackCallClick('founder_letter');
              (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
            }}
            data-cursor-hover
            className="founder-cta founder-cta-primary"
            style={{
              background: '#E8541A',
              color: '#fff',
              padding: '13px 26px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 28px rgba(232,84,26,0.35)',
              transition: 'background 0.25s',
              minHeight: '44px',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#d94a14')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#E8541A')}
          >
            Talk to me
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a
            href="https://www.linkedin.com/in/lakshyasoni/"
            target="_blank"
            rel="noopener noreferrer"
            className="founder-cta founder-cta-secondary"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#F2EEE7',
              padding: '13px 22px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s',
              minHeight: '44px',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.10)';
              el.style.borderColor = 'rgba(255,255,255,0.22)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.05)';
              el.style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          >
            LinkedIn
          </a>
        </motion.div>
        </div>{/* /founder-col-text */}

        {/* ── Right-side media slot — founder portrait. Fills desktop dead
            space and reinforces the personal "letter" tone. Hidden on mobile
            (the signature row already carries the avatar). ── */}
        <motion.div
          className="founder-col-media"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative' }}
        >
          <div
            className="founder-portrait"
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              border: '1px solid rgba(232,84,26,0.22)',
              boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/founder.jpg"
              alt="Lakshya Soni, founder of EchoPulse Media, a done-for-you content studio for founder-led video and LinkedIn content"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 55%, rgba(13,12,10,0.55) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </motion.div>
       </div>{/* /founder-grid */}
      </div>

      <style>{`
        /* Desktop: 2-column letter + portrait. Portrait hidden below lg so
           mobile stays single-column (the signature row carries the avatar). */
        .founder-col-media { display: none; }
        @media (min-width: 1024px) {
          .founder-grid { grid-template-columns: 1.15fr 0.85fr !important; }
          .founder-col-media { display: block !important; }
        }

        /* ── Tablet ─────────────────────────────────────────────── */
        @media (max-width: 860px) {
          .founder-section { padding: 88px 0 !important; }
          .founder-grid { gap: 40px !important; }
          .founder-quote-mark {
            font-size: 130px !important;
            top: -16px !important;
            left: -12px !important;
          }
        }

        /* ── Phone ──────────────────────────────────────────────── */
        @media (max-width: 640px) {
          /* 72px top and bottom made this the tallest gap on the phone page
             (every neighbouring section sits at 40 to 56). Matching the rhythm
             pulls roughly a third of a screen of dead space out of the scroll
             between the hero and the pricing. */
          .founder-section { padding: 56px 0 48px !important; }
          .founder-container { padding: 0 20px !important; }
          .founder-quote-mark {
            font-size: 110px !important;
            top: -12px !important;
            left: -8px !important;
          }
          .founder-h2 {
            font-size: 27px !important;
            letter-spacing: -0.6px !important;
            line-height: 1.12 !important;
          }
          /* Signature: shrink avatar, allow name + meta to wrap */
          .founder-avatar { width: 44px !important; height: 44px !important; }
          .founder-sig-bio { display: none !important; }
          /* Trust strip: hide separators on phone so the three pills wrap cleanly,
             hide the body micro-copy (just keep the bold titles) for max density */
          .founder-trust-sep { display: none !important; }
          .founder-trust-body { display: none !important; }
          .founder-trust {
            gap: 8px 12px !important;
            padding: 12px 14px !important;
            background: rgba(255,255,255,0.035) !important;
            border: 1px solid rgba(255,255,255,0.07) !important;
            border-radius: 14px !important;
          }
          /* The letter is the longest read on the page. 13.5px was below the
             mobile body floor and the leading was tuned for a wider measure. */
          .founder-support {
            font-size: 15px !important;
            line-height: 1.72 !important;
          }
          /* Uppercase micro-label on a 44px target: give it enough size to
             read as the affordance it is. */
          .founder-expand-btn {
            font-size: 13px !important;
            min-height: 48px !important;
            padding: 6px 2px !important;
          }
          .founder-ctas {
            flex-direction: column !important;
            align-items: stretch !important;
            /* 10px keeps a clear thumb-width gap between two stacked CTAs. */
            gap: 10px !important;
          }
          .founder-cta {
            width: 100% !important;
            justify-content: center !important;
            min-height: 50px !important;
            font-size: 14px !important;
          }
        }

        /* ── Tiny phones (≤ 380px) ─────────────────────────────── */
        @media (max-width: 380px) {
          .founder-section { padding: 48px 0 40px !important; }
          .founder-container { padding: 0 16px !important; }
          .founder-quote-mark {
            font-size: 110px !important;
            top: -14px !important;
          }
          .founder-h2 { font-size: 24px !important; }
        }
      `}</style>
    </section>
  );
}
