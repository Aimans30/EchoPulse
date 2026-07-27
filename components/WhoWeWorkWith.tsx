'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket,
  Home,
  GraduationCap,
  ShoppingBag,
  Briefcase,
  MessageCircle,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { BOOK_CALL_LABEL } from '@/lib/links';

type Card = {
  num: string;
  Icon: LucideIcon;
  title: string;
  desc: string;
  tag: string | null;
  tagColor: string;
  gradient: string | null;
  accentLine: string;
  /** Standalone ICP landing page this card links to. Omitted for the CTA card. */
  href?: string;
  dark?: boolean;
  cta?: boolean;
};

const cards: Card[] = [
  {
    num: '01', Icon: Rocket, title: 'Founders & Operators', href: '/founders',
    desc: 'SaaS, agency, and consulting founders who want LinkedIn, blogs, video, and ads handled by one team. So you can stop reviewing five freelancers and run the business.',
    tag: 'Our Core', tagColor: '#E8541A',
    gradient: 'radial-gradient(circle at 80% 20%, rgba(232,84,26,0.12) 0%, transparent 60%)',
    accentLine: '#E8541A',
  },
  {
    num: '02', Icon: Home, title: 'Real Estate Agents', href: '/real-estate',
    desc: 'Solo agents, brokerages, and short-term-rental operators who need cinematic property reels, personal-brand video, listing content, and ads that actually book viewings.',
    tag: 'Big Lift', tagColor: '#f59e0b',
    gradient: 'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.10) 0%, transparent 60%)',
    accentLine: '#f59e0b',
  },
  {
    num: '03', Icon: GraduationCap, title: 'Coaches & Course Creators', href: '/coaches',
    desc: 'Educators and coaches who need pre-launch content, evergreen short-form, ad creative, and funnels that fill cohorts and coaching slots without manual selling.',
    tag: 'High ROI', tagColor: '#8b5cf6',
    gradient: 'radial-gradient(circle at 80% 20%, rgba(139,92,246,0.10) 0%, transparent 60%)',
    accentLine: '#8b5cf6',
  },
  {
    num: '04', Icon: ShoppingBag, title: 'DTC & E-Commerce', href: '/dtc',
    desc: 'Brands burning through ad creative every two weeks. Fresh static + video ads on a subscription so fatigue stops killing your CPA. Plus the store, the funnels, the email.',
    tag: 'Subscription', tagColor: '#10b981',
    gradient: 'radial-gradient(circle at 80% 20%, rgba(16,185,129,0.10) 0%, transparent 60%)',
    accentLine: '#10b981',
  },
  {
    num: '05', Icon: Briefcase, title: 'Business Owners', href: '/business-owners',
    desc: 'Local businesses, service operators, agencies, and consultancies who need inbound leads from content instead of cold outreach. Plus a site that converts the traffic.',
    tag: 'Scaling', tagColor: '#3b82f6',
    gradient: 'radial-gradient(circle at 80% 20%, rgba(59,130,246,0.10) 0%, transparent 60%)',
    accentLine: '#3b82f6',
  },
  {
    num: '?', Icon: MessageCircle, title: 'Something Else?',
    desc: 'If you have an offer, an audience, and no time to chase five vendors, we can probably help. Tell us what you do and what you want to ship. We will give you a plan.',
    tag: null, tagColor: '#E8541A',
    gradient: null,
    accentLine: '#E8541A',
    dark: true, cta: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

// Stable component refs (created once at module scope — never recreate inside
// render/map or React remounts the subtree every frame).
const MotionLink = motion(Link);
const MotionDiv = motion.div;

export default function WhoWeWorkWith() {
  const gridRef = useRef<HTMLDivElement>(null);

  // Mobile-only slow auto-scroll. Drifts the card carousel rightward at ~12px/s,
  // loops cleanly by jumping back to start when end is reached. Pauses while
  // the user is touching the strip + for 2.5s after they let go — gives them
  // full agency without stealing it back too soon.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (typeof window === 'undefined') return;
    // Desktop: this carousel doesn't even render as a scroll strip — skip.
    if (window.innerWidth > 640) return;
    // Reduced-motion: respect the preference.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = performance.now();
    let paused = false;
    let resumeTimer: number | null = null;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (!paused) {
        const max = grid.scrollWidth - grid.clientWidth - 2;
        // ~12 px/sec — slow, easy to read, never feels like it's running away
        grid.scrollLeft += dt * 0.012;
        if (grid.scrollLeft >= max) grid.scrollLeft = 0; // loop
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pause = () => {
      paused = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
    };
    const scheduleResume = () => {
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => { paused = false; }, 2500);
    };
    grid.addEventListener('touchstart', pause, { passive: true });
    grid.addEventListener('touchend', scheduleResume, { passive: true });
    grid.addEventListener('mousedown', pause, { passive: true });
    grid.addEventListener('mouseup', scheduleResume, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimer) window.clearTimeout(resumeTimer);
      grid.removeEventListener('touchstart', pause);
      grid.removeEventListener('touchend', scheduleResume);
      grid.removeEventListener('mousedown', pause);
      grid.removeEventListener('mouseup', scheduleResume);
    };
  }, []);

  return (
    <section className="wwww-section" style={{ padding: '128px 56px', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,84,26,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <style>{`
        .wwww-card {
          position: relative;
          border-radius: 20px;
          padding: 40px 36px;
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .wwww-cta { cursor: pointer; }
        /* Only hide the native cursor where the custom one replaces it. */
        @media (hover: hover) and (pointer: fine) {
          .wwww-card, .wwww-cta { cursor: none; }
        }
        .wwww-card-link { text-decoration: none; color: inherit; display: block; }
        .wwww-card-link .wwww-view { opacity: 0.85; transition: gap 0.25s ease, opacity 0.25s ease; }
        .wwww-card-link:hover .wwww-view { opacity: 1; gap: 8px; }
        .wwww-card-light {
          background: rgba(255,255,255,0.58);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.82);
          box-shadow: 0 4px 24px rgba(12,12,11,0.06), 0 1px 0 rgba(255,255,255,0.95) inset;
        }
        .wwww-card-light:hover {
          box-shadow: 0 20px 60px rgba(12,12,11,0.11), 0 1px 0 rgba(255,255,255,0.95) inset;
        }
        .wwww-card-dark {
          background: rgba(12,12,11,0.88);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 32px rgba(12,12,11,0.28);
        }
        .wwww-card-dark:hover {
          box-shadow: 0 20px 60px rgba(12,12,11,0.4);
        }
        /* shimmer sweep */
        .wwww-card-light::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transition: left 0.7s ease;
          pointer-events: none;
        }
        .wwww-card-light:hover::after { left: 150%; }

        /* accent bottom bar */
        .wwww-accent-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 3px;
          transform: scaleX(0);
          transform-origin: left;
          border-radius: 0 0 20px 20px;
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .wwww-card:hover .wwww-accent-bar { transform: scaleX(1); }

        /* floating animation */
        @keyframes float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .float-a { animation: float-a 5s ease-in-out infinite; }
        .float-b { animation: float-b 6.5s ease-in-out 1s infinite; }

        .icp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 64px;
        }
        @media(max-width:1200px){ .icp-grid{ grid-template-columns:repeat(2,1fr)!important; } }

        /* Swipe cue — mobile only */
        .wwww-swipe-cue {
          display: none;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 14px;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(110,107,99,0.55);
          font-weight: 700;
        }
        .wwww-swipe-cue .dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(232,84,26,0.55);
          animation: wcue 1.6s ease-in-out infinite;
        }
        .wwww-swipe-cue .dot:nth-child(2) { animation-delay: 0.2s; }
        .wwww-swipe-cue .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes wcue { 0%,100% { opacity: 0.3 } 50% { opacity: 1 } }

        /* ── Mobile polish ──
           Scoped to .wwww-section so it doesn't accidentally restyle every
           other <section> on the site (the previous selector did). */
        @media(max-width:900px){
          .wwww-section { padding: 96px 28px !important; }
          .wwww-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .wwww-headline { font-size: clamp(32px, 7.5vw, 44px) !important; letter-spacing: -1.6px !important; }
          /* 13.5px here was smaller than the 14px desktop value. Same reasoning
             as the Services subhead: shorter viewing distance wants more type,
             not less. Hidden entirely below 640px. */
          .wwww-subhead { max-width: none !important; font-size: 15px !important; line-height: 1.65 !important; }
        }
        @media(max-width:640px){
          /* Tight section padding so headline + carousel both fit in one viewport */
          .wwww-section { padding: 40px 0 32px !important; }

          .icp-grid {
            display: grid !important;
            grid-auto-flow: column !important;
            grid-template-columns: none !important;
            grid-auto-columns: 68% !important;
            grid-template-rows: 1fr !important;
            gap: 10px !important;
            margin-top: 20px !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            padding: 4px 18px 12px !important;
          }
          .icp-grid::-webkit-scrollbar { display: none !important; }
          .icp-grid > * { scroll-snap-align: start !important; min-width: 0 !important; }

          /* Cards: tighter frame, but the copy inside stays readable.
             NOTE: the old rules here targeted .wwww-card h3 / .wwww-card p and
             matched nothing — the title and description both render as <div>.
             So the description was never clamped and never resized; it shipped
             at its inline 13px. Targeting the real elements now. */
          .wwww-card { padding: 16px 14px !important; border-radius: 14px !important; height: auto !important; }
          .wwww-card .wwww-title { font-size: 17px !important; letter-spacing: -0.3px !important; margin: 6px 0 6px !important; }
          .wwww-card .wwww-desc {
            font-size: 15px !important;
            line-height: 1.55 !important;
          }
          .wwww-card .wwww-num,
          .wwww-card > div:first-child { font-size: 9.5px !important; }
          /* Scoped to the icon chip: the blanket `svg` selector was also
             inflating the 13px "View page" arrow to 28px. */
          .wwww-card .wwww-icon { width: 32px !important; height: 32px !important; }

          /* Headline + subhead tightened so the carousel sits closer */
          .wwww-headline {
            font-size: 22px !important;
            letter-spacing: -0.8px !important;
            line-height: 1.08 !important;
            margin-bottom: 6px !important;
          }
          /* Subhead REMOVED on phone — the headline does the work; the
             3-line description was eating most of the viewport. */
          .wwww-subhead { display: none !important; }
          .wwww-eyebrow { margin-bottom: 8px !important; font-size: 9px !important; letter-spacing: 3px !important; }
          .wwww-header { margin-bottom: 14px !important; }
          /* Header column collapses so headline sits tight to the top */
          .wwww-header > div { gap: 8px !important; }
          /* Card width: the next card still peeks in (the affordance that the
             strip slides), but the card itself now has to hold a 15px
             paragraph, so it takes more of the viewport than the old 76%. */
          .icp-grid { grid-auto-columns: 82% !important; margin-top: 22px !important; }
          /* Disable the float animation on phones — saves paint and stops
             cards bobbing while the user is trying to read them. */
          .float-a, .float-b { animation: none !important; }

          .wwww-swipe-cue { display: flex !important; }

          /* Keep header text padded to the side — only the carousel goes edge-to-edge */
          .wwww-section > .wwww-eyebrow, .wwww-section > .wwww-header { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media(max-width:380px){
          .wwww-section { padding: 56px 0 40px !important; }
          /* Was 20px 18px, i.e. MORE inset than the 640px rule on a smaller
             screen. Keep the frame tight so the copy keeps its measure. */
          .wwww-card { padding: 16px 14px !important; }
          .wwww-headline { font-size: 28px !important; }
          .icp-grid { grid-auto-columns: 88% !important; padding: 4px 16px 16px !important; }
        }
      `}</style>

      {/* Header */}
      <motion.div
        className="wwww-eyebrow"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#6E6B63', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}
      >
        <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
        Who We Work With
      </motion.div>

      <motion.div
        className="wwww-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}
      >
        <h2 className="wwww-headline" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(36px, 4.5vw, 64px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.02, margin: 0 }}>
          Built for people who<br />
          <span style={{ color: '#E8541A' }}>have a business to run.</span>
        </h2>
        <p className="wwww-subhead" style={{ maxWidth: '290px', color: '#6E6B63', fontSize: '14px', lineHeight: 1.75, margin: 0 }}>
          Founders, coaches, business owners, real estate agents. If you sell something and you need to show up online, we run the content side so you can run the actual business.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        ref={gridRef}
        className="icp-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {cards.map((card, i) => {
          // Linked ICP cards render their whole surface as a Link to the
          // standalone landing page; the CTA card keeps its book-call button.
          const CardTag = card.href ? MotionLink : MotionDiv;
          const linkProps = card.href ? { href: card.href } : {};
          return (
          <CardTag
            key={card.num}
            {...linkProps}
            variants={cardVariants}
            className={`wwww-card ${card.dark ? 'wwww-card-dark float-b' : 'wwww-card-light float-a'}${card.href ? ' wwww-card-link' : ''}`}
            style={{ animationDelay: `${i * 0.3}s` }}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            data-cursor-hover
          >
            {/* Inner gradient radial */}
            {card.gradient && (
              <div style={{ position: 'absolute', inset: 0, background: card.gradient, pointerEvents: 'none', borderRadius: '20px' }} />
            )}
            {card.dark && (
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(232,84,26,0.08) 0%, transparent 60%)', pointerEvents: 'none', borderRadius: '20px' }} />
            )}

            {/* Accent bar */}
            <div className="wwww-accent-bar" style={{ background: `linear-gradient(90deg, ${card.accentLine}, ${card.accentLine}99)` }} />

            {/* Corner decoration */}
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: `${card.accentLine}10`, filter: 'blur(30px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: card.dark ? `${card.accentLine}60` : '#A8A49B', marginBottom: '24px', textTransform: 'uppercase' }}>
                {card.num}
              </div>
              <div
                className="wwww-icon"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: card.dark ? 'rgba(232,84,26,0.12)' : `${card.accentLine}12`,
                  border: `1px solid ${card.accentLine}30`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <card.Icon size={18} strokeWidth={1.6} color={card.accentLine} aria-hidden="true" />
              </div>
              <div className="wwww-title" style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.3px', color: card.dark ? '#F2EEE7' : '#0C0C0B' }}>
                {card.title}
              </div>
              <div className="wwww-desc" style={{ fontSize: '13px', color: card.dark ? 'rgba(242,238,231,0.45)' : '#6E6B63', lineHeight: 1.7 }}>
                {card.desc}
              </div>

              {card.tag && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', background: `${card.tagColor}15`, border: `1px solid ${card.tagColor}30`, borderRadius: '100px', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: card.tagColor }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: card.tagColor }} />
                    {card.tag}
                  </div>
                  {card.href && (
                    <span className="wwww-view" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: card.accentLine }}>
                      View page
                      <ArrowRight size={13} strokeWidth={2.4} aria-hidden="true" />
                    </span>
                  )}
                </div>
              )}

              {card.cta && (
                <button
                  type="button"
                  data-cursor-hover
                  aria-label={BOOK_CALL_LABEL}
                  onClick={() => {
                    (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
                  }}
                  className="wwww-cta"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px', background: '#E8541A', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, transition: 'all 0.3s', textDecoration: 'none', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 20px rgba(232,84,26,0.3)', minHeight: '44px' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#d94a14'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8541A'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                >
                  {BOOK_CALL_LABEL} →
                </button>
              )}
            </div>
          </CardTag>
          );
        })}
      </motion.div>

      {/* Swipe hint — mobile only via CSS */}
      <div className="wwww-swipe-cue" aria-hidden="true">
        <span className="dot" /><span className="dot" /><span className="dot" />
        <span style={{ marginLeft: 6 }}>Swipe</span>
      </div>
    </section>
  );
}
