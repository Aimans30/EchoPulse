'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import type { ServiceData } from '@/lib/serviceData';
import { BOOK_CALL_URL } from '@/lib/links';
import Nav from './Nav';

// ServiceHeroVisual is 2.4K lines of SVG / animation code per service.
// Lazy-loading it strips ~80KB of JS off the initial chunk so the route
// renders fast, then the visual fades in. A skeleton placeholder keeps
// layout stable during the swap.
const ServiceHeroVisual = dynamic(() => import('./ServiceHeroVisual'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: '380px',
        borderRadius: '20px',
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)',
        backgroundSize: '200% 100%',
        animation: 'svc-shimmer 1.4s ease-in-out infinite',
      }}
    />
  ),
});

gsap.registerPlugin(ScrollTrigger);

type ComparisonRow = { feature: string; us: string; them: string };

// Per-service comparison rows. Each service compares EchoPulse vs the relevant alternative for THAT service.
const comparisonsByService: Record<string, ComparisonRow[]> = {
  'video-editing': [
    { feature: 'Turnaround',          us: '48 hours standard',                              them: '5 to 7 business days' },
    { feature: 'Shot grammar',        us: 'Retention-engineered, mobile-first',             them: 'Aesthetic-led, desktop preview' },
    { feature: 'Captions',            us: 'Burned-in, animated, brand-styled',              them: 'Auto-generated CapCut style' },
    { feature: 'Color grade',         us: 'Per-platform tuned LUT',                         them: 'Single grade for everything' },
    { feature: 'Sound design',        us: 'Music + SFX + audio mastering',                  them: 'Music drop, no mastering' },
    { feature: 'Format exports',      us: 'Reels + TikTok + Shorts + listing-site MP4',     them: 'One master file' },
    { feature: 'Revisions',           us: 'Unlimited until you are satisfied',              them: 'One round, then per-hour' },
    { feature: 'Onboarding',          us: 'Two-week paid Pilot, see work first',            them: 'Pay full retainer upfront' },
  ],
  'linkedin-ghostwriting': [
    { feature: 'Voice capture',       us: '90-min recorded Voice Foundation interview',     them: 'Onboarding form, 5 questions' },
    { feature: 'Voice fidelity audit', us: 'Scored 8/10 minimum before ship',               them: 'No audit, no scoring' },
    { feature: 'Anti-AI tells',       us: 'Banned-phrase list, manual scrub on every post', them: '"Delve into the tapestry"' },
    { feature: 'Story sourcing',      us: 'Pulled from your story bank',                    them: 'Generic templates' },
    { feature: 'Engagement support',  us: '5 daily comment drafts in your voice',           them: 'None' },
    { feature: 'Profile optimization', us: 'Headline + About + Featured refreshed quarterly', them: 'One-time setup' },
    { feature: 'Revisions',           us: 'Unlimited until you are satisfied',              them: 'One round, then per-post fees' },
    { feature: 'Onboarding',          us: 'Two-week paid Pilot, see work first',            them: 'Pay full retainer upfront' },
  ],
  'blog-production': [
    { feature: 'Research depth',      us: 'Multi-agent + human source verification',        them: 'ChatGPT one-shot, no review' },
    { feature: 'Sources',             us: 'Real verifiable links on every stat',            them: 'Fabricated metrics' },
    { feature: 'Outline approval',    us: 'Required before drafting',                       them: 'Skipped. Drafts arrive cold' },
    { feature: 'Voice fidelity',      us: 'Scored 8/10 against Voice DNA',                  them: 'No fidelity audit' },
    { feature: 'Anti-AI tells',       us: '"Delve / navigate / tapestry" banned',           them: 'Industry standard' },
    { feature: 'Distribution pack',   us: 'LinkedIn + thread + newsletter + 3 quote graphics', them: 'Blog file only' },
    { feature: 'SEO + schema',        us: 'Full meta pack + structured data + internal links', them: 'Title and meta description' },
    { feature: 'Onboarding',          us: 'Two-week paid Pilot, see work first',            them: 'Pay full retainer upfront' },
  ],
  'ad-creatives': [
    { feature: 'Output cadence',      us: '8 to 12 fresh creatives per month',              them: '2 to 3 per month' },
    { feature: 'Refresh cycle',       us: 'Weekly hook variations',                         them: 'Every 4 to 6 weeks' },
    { feature: 'Hook variations',     us: '3 to 5 per top performer',                       them: 'None. One and done' },
    { feature: 'Turnaround',          us: '48 hours per creative',                          them: '5 to 14 days' },
    { feature: 'Cost model',          us: 'Flat monthly subscription',                      them: 'Per-piece + per-hour fees' },
    { feature: 'Performance review',  us: 'Monthly with iteration brief',                   them: 'None, or quarterly only' },
    { feature: 'Platforms covered',   us: 'Meta + TikTok + Google + LinkedIn + Pinterest',  them: 'One or two platforms' },
    { feature: 'Revisions',           us: 'Unlimited until you are satisfied',              them: 'One round per piece' },
  ],
  'websites-funnels': [
    { feature: 'Build time',          us: '3 to 4 weeks for a full site',                   them: '8 to 12 weeks' },
    { feature: 'Mobile load time',    us: 'Under 2 seconds',                                them: '4 to 6 seconds' },
    { feature: 'Copywriting',         us: 'Conversion copy included',                       them: 'Placeholder, you write' },
    { feature: 'Stack flexibility',   us: 'Next.js, Framer, Webflow, GoHighLevel, custom',  them: 'WordPress only' },
    { feature: 'Conversion tracking', us: 'GA4 + Meta Pixel + events configured',           them: 'Basic GA4 install' },
    { feature: 'Pre-launch QA',       us: 'Real-device testing + accessibility audit',      them: 'Desktop preview only' },
    { feature: 'Post-launch support', us: '30-day monitoring included',                     them: 'Not included' },
    { feature: 'Revisions',           us: 'Unlimited until you are satisfied',              them: 'One round, then per-hour' },
  ],
  'automations': [
    { feature: 'Setup time',          us: '10 to 14 business days',                         them: '30+ days' },
    { feature: 'Platforms covered',   us: 'Make + ManyChat + GoHighLevel + your CRM',       them: 'Zapier only' },
    { feature: 'Voice in messages',   us: 'Written from your Voice Foundation',             them: 'Robotic templates' },
    { feature: 'Lead qualification',  us: 'Scoring rules + filters built-in',               them: 'Extra setup fee' },
    { feature: 'Calendar integration', us: 'Two-way sync, qualified leads only',            them: 'One-way embed' },
    { feature: 'Performance dashboard', us: 'Live reporting included',                      them: 'Not included' },
    { feature: 'Maintenance',         us: 'Monthly tune-ups included',                      them: 'Separate retainer' },
    { feature: 'Onboarding',          us: 'Two-week paid Pilot, see work first',            them: 'Pay full setup upfront' },
  ],
};

const promises = [
  {
    stat: '8/10',
    statLabel: 'Min voice fidelity',
    headline: 'Sounds like you, or we rewrite.',
    body: 'Every deliverable is scored against your Voice Foundation. Below 8 out of 10, we rewrite at no charge. No invoicing for our miss.',
  },
  {
    stat: '∞',
    statLabel: 'Revisions until satisfied',
    headline: 'Refine until it is right.',
    body: 'No round caps. No per-hour invoicing. If it takes one revision or five, we keep going. We retain you on output we are proud of, not on a clock.',
  },
  {
    stat: '14d',
    statLabel: 'Cancel notice',
    headline: 'Month to month. No lock-in.',
    body: 'No 12-month minimums, no exit fees. We retain you on output, not contracts. If we are not delivering value you can see, you should walk.',
  },
  {
    stat: '$299',
    statLabel: 'Pilot to start',
    headline: 'Try first. Commit when convinced.',
    body: 'Every relationship starts with a paid two-week Pilot at our intro price of $299. 12 LinkedIn posts, 3 short-form video edits, 5 long-form blogs, the voice interview, and one strategic deliverable. See the quality before any monthly engagement.',
  },
];

function StickyProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #E8541A, #ff8c5a)',
        transformOrigin: 'left',
        zIndex: 600,
      }}
    />
  );
}

function StickyBottomCTA({ accentColor }: { accentColor: string }) {
  const [show, setShow] = useState(false);
  const [finalCtaInView, setFinalCtaInView] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setShow(window.scrollY > 700);
        raf = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Watch the final CTA section — hide bubble once it scrolls into view
    // (it has its own Book a Call so the floating duplicate is redundant)
    let observer: IntersectionObserver | null = null;
    const attach = () => {
      const el = document.getElementById('final-cta');
      if (!el) {
        // Section not mounted yet — try once more shortly
        setTimeout(attach, 200);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setFinalCtaInView(entry.isIntersecting),
        { threshold: 0, rootMargin: '0px 0px -20% 0px' }
      );
      observer.observe(el);
    };
    attach();

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const visible = show && !finalCtaInView;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0, scale: 0.92 }}
      animate={{
        y: visible ? 0 : 90,
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.85,
      }}
      transition={{
        duration: visible ? 0.55 : 0.7,
        ease: visible ? [0.16, 1, 0.3, 1] : [0.7, 0, 0.84, 0],
      }}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 480,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '10px 14px 10px 24px',
        background: 'rgba(12,12,11,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '100px',
        boxShadow: '0 16px 48px rgba(12,12,11,0.45)',
        pointerEvents: visible ? 'auto' : 'none',
        transformOrigin: 'bottom center',
        willChange: 'transform, opacity',
      }}
    >
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#F2EEE7', whiteSpace: 'nowrap' }}>
        Ready to start?
      </span>
      <a
        href={BOOK_CALL_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: accentColor,
          color: '#fff',
          padding: '10px 22px',
          borderRadius: '100px',
          fontSize: '12px',
          fontWeight: 700,
          textDecoration: 'none',
          fontFamily: 'Inter,sans-serif',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: `0 6px 20px ${accentColor}55`,
        }}
      >
        Book a Call
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </a>
    </motion.div>
  );
}

function SectionLabel({ left, right }: { left: string; right: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: 'currentColor',
        opacity: 0.5,
        paddingBottom: '20px',
      }}
    >
      <span>{left}</span>
      <span>{right}</span>
    </motion.div>
  );
}

export default function ServicePageClient({ service }: { service: ServiceData }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const [serviceNumber, setServiceNumber] = useState('01');

  useEffect(() => {
    // Find this service's index in the master list to display "01", "02", etc.
    const slugs = ['video-editing', 'linkedin-ghostwriting', 'blog-production', 'ad-creatives', 'websites-funnels', 'automations'];
    const idx = slugs.indexOf(service.slug);
    setServiceNumber(`0${idx >= 0 ? idx + 1 : 1}`);
  }, [service.slug]);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(titleRef.current?.querySelectorAll('.word') ?? [],
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.06 })
      .fromTo(subRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.3');

    return () => { tl.kill(); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const words = service.tagline.split(' ');
  const comparisonRows = comparisonsByService[service.slug] || comparisonsByService['video-editing'];

  return (
    <>
      {/* Fixed-position elements — must stay outside the slide wrapper so they anchor to viewport, not the animating container */}
      <StickyProgress />
      <Nav />
      <StickyBottomCTA accentColor={service.accentColor} />

      {/* Clean fade-up entrance — minimal, professional. Replaces the previous
         horizontal slide which read as too theatrical for a content agency
         site. Opacity does the heavy lifting; the 8px y travel just gives
         the page a sense of "arriving" without any sideways motion. */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: '#F2EEE7', minHeight: '100vh', position: 'relative' }}
      >

      {/* HERO — editorial, contained */}
      <section
        ref={heroRef}
        data-dark-bg="true"
        style={{
          minHeight: '100vh',
          padding: '120px 64px 80px',
          background: '#0C0C0B',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 70% 30%, ${service.accentColor}1c 0%, transparent 60%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1180px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>

          {/* Hero split: editorial text + service-specific visual */}
          <div className="hero-split" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '56px', alignItems: 'center' }}>
            <div>
              <h1
                ref={titleRef}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(38px, 4.6vw, 72px)',
                  fontWeight: 900,
                  letterSpacing: '-2.5px',
                  lineHeight: 1.04,
                  color: '#F2EEE7',
                  margin: '0 0 28px',
                  paddingBottom: '0.06em',
                  overflow: 'visible',
                }}
              >
                {words.map((w, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      overflow: 'hidden',
                      marginRight: '0.18em',
                      paddingBottom: '0.18em',
                      marginBottom: '-0.12em',
                      verticalAlign: 'top',
                    }}
                  >
                    <span className="word" style={{ display: 'inline-block', color: i === words.length - 1 ? service.accentColor : '#F2EEE7' }}>
                      {w}
                    </span>
                  </span>
                ))}
              </h1>

              <p
                ref={subRef}
                style={{
                  fontSize: 'clamp(15px, 1.3vw, 18px)',
                  color: 'rgba(242,238,231,0.62)',
                  maxWidth: '500px',
                  lineHeight: 1.65,
                  margin: '0 0 40px',
                  fontWeight: 400,
                  opacity: 0,
                }}
              >
                {service.heroSub}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}
              >
                <a
                  href={BOOK_CALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: service.accentColor,
                    color: '#fff',
                    padding: '15px 28px',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontFamily: 'Inter, sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: `0 8px 32px ${service.accentColor}55`,
                  }}
                >
                  Book a Free Strategy Call
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
                <a
                  href="#deliverables"
                  style={{
                    background: 'transparent',
                    color: '#F2EEE7',
                    padding: '15px 28px',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontFamily: 'Inter, sans-serif',
                    border: '1px solid rgba(255,255,255,0.18)',
                  }}
                >
                  See Deliverables
                </a>
              </motion.div>
            </div>

            {/* Per-service custom visual */}
            <div className="hero-visual" style={{ width: '100%', maxWidth: '500px', marginLeft: 'auto' }}>
              <ServiceHeroVisual slug={service.slug} accent={service.accentColor} />
            </div>
          </div>

          <style>{`
            @media (max-width: 900px) {
              .hero-split { grid-template-columns: 1fr !important; gap: 32px !important; }
              .hero-visual { display: none !important; }
            }
          `}</style>
        </div>

        {/* Bottom signature row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          style={{
            maxWidth: '1280px',
            margin: '60px auto 0',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(242,238,231,0.4)',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <span>48-HR Turnaround</span>
          <span>·</span>
          <span>Two Revision Rounds</span>
          <span>·</span>
          <span>14-Day Cancel</span>
          <span>·</span>
          <span>Voice Foundation Per Client</span>
        </motion.div>
      </section>

      {/* DELIVERABLES — editorial list */}
      <section id="deliverables" style={{ padding: '120px 56px 80px', background: '#F2EEE7', color: '#0C0C0B' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionLabel left={`01 / Deliverables`} right={`${service.deliverables.length} ITEMS INCLUDED`} />

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              lineHeight: 1,
              margin: '20px 0 64px',
              maxWidth: '900px',
            }}
          >
            Every piece you receive,<br />
            <span style={{ color: service.accentColor }}>built to ship.</span>
          </motion.h2>

          <div style={{ borderTop: '1px solid rgba(12,12,11,0.12)' }}>
            {service.deliverables.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ x: 8 }}
                className="deliverable-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1.2fr 1.5fr 60px',
                  gap: '32px',
                  padding: '28px 0',
                  borderBottom: '1px solid rgba(12,12,11,0.12)',
                  alignItems: 'center',
                  cursor: 'none',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 300, color: '#A8A49B', letterSpacing: '-1px' }}>
                  {`0${i + 1}`}
                </div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(18px, 1.8vw, 24px)', fontWeight: 800, letterSpacing: '-0.6px', color: '#0C0C0B', margin: 0 }}>
                  {d.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#6E6B63', lineHeight: 1.6, margin: 0, maxWidth: '480px' }}>
                  {d.desc}
                </p>
                <div style={{ fontSize: '24px', textAlign: 'right', lineHeight: 1 }}>{d.icon}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          .deliverable-row:hover h3 { color: #E8541A !important; }
          @media (max-width: 768px) {
            .deliverable-row { grid-template-columns: 50px 1fr 40px !important; }
            .deliverable-row > p { display: none !important; }
          }
        `}</style>
      </section>

      {/* COMPARISON — kept, refined */}
      <section
        data-dark-bg="true"
        style={{
          padding: '120px 56px',
          background: '#0C0C0B',
          color: '#F2EEE7',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '900px', height: '700px', borderRadius: '50%', background: `radial-gradient(circle, ${service.accentColor}06 0%, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1180px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <SectionLabel left={`02 / Why Us`} right="ECHOPULSE VS GENERIC AGENCY" />

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              lineHeight: 1,
              margin: '20px 0 56px',
              maxWidth: '900px',
            }}
          >
            The difference,<br />
            line by <span style={{ color: service.accentColor }}>line.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              overflow: 'hidden',
            }}
          >
            <div className="cmp-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ padding: '18px 24px', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.4)' }}>
                Feature
              </div>
              <div style={{ padding: '18px 24px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.2px', color: service.accentColor, borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: service.accentColor, boxShadow: `0 0 10px ${service.accentColor}` }} />
                EchoPulse
              </div>
              <div style={{ padding: '18px 24px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.2px', color: 'rgba(242,238,231,0.45)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                Generic Agency
              </div>
            </div>

            {comparisonRows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="cmp-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1fr 1fr',
                  borderBottom: i < comparisonRows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <div style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#F2EEE7' }}>
                  {row.feature}
                </div>
                <div style={{ padding: '16px 24px', fontSize: '13px', color: 'rgba(242,238,231,0.85)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: service.accentColor, fontWeight: 800, flexShrink: 0 }}>✓</span>
                  {row.us}
                </div>
                <div style={{ padding: '16px 24px', fontSize: '13px', color: 'rgba(242,238,231,0.4)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: 'rgba(239,68,68,0.6)', fontWeight: 800, flexShrink: 0 }}>✗</span>
                  {row.them}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .cmp-grid { grid-template-columns: 1fr !important; }
            .cmp-grid > div { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.06); }
          }
        `}</style>
      </section>

      {/* PROCESS — editorial big numbers */}
      <section style={{ padding: '120px 56px', background: '#F2EEE7', color: '#0C0C0B' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionLabel left="03 / Method" right={`${service.steps.length} STEPS / ${service.steps.length * 2}–7 DAYS`} />

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              lineHeight: 1,
              margin: '20px 0 80px',
              maxWidth: '900px',
            }}
          >
            From brief to <span style={{ color: service.accentColor }}>shipped.</span>
          </motion.h2>

          <div>
            {service.steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr 2fr',
                  gap: '40px',
                  padding: '60px 0',
                  borderTop: i === 0 ? '1px solid rgba(12,12,11,0.12)' : 'none',
                  borderBottom: '1px solid rgba(12,12,11,0.12)',
                  alignItems: 'flex-start',
                }}
                className="process-row"
              >
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(72px, 10vw, 140px)',
                    fontWeight: 100,
                    letterSpacing: '-6px',
                    lineHeight: 0.85,
                    color: service.accentColor,
                  }}
                >
                  {`0${i + 1}`}
                </div>
                <h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(24px, 2.6vw, 36px)',
                    fontWeight: 800,
                    letterSpacing: '-1px',
                    lineHeight: 1.1,
                    color: '#0C0C0B',
                    margin: 0,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#6E6B63',
                    lineHeight: 1.7,
                    margin: 0,
                    maxWidth: '520px',
                  }}
                >
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .process-row { grid-template-columns: 1fr !important; gap: 16px !important; padding: 40px 0 !important; }
          }
        `}</style>
      </section>

      {/* OUR PROMISE — Customer Satisfaction */}
      <section
        data-dark-bg="true"
        style={{
          padding: '120px 56px',
          background: 'linear-gradient(180deg, #0C0C0B 0%, #14110d 50%, #0C0C0B 100%)',
          color: '#F2EEE7',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '20%', right: '-15%', width: '700px', height: '700px', borderRadius: '50%', background: `radial-gradient(circle, ${service.accentColor}10 0%, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <SectionLabel left="04 / Our Promise" right="SATISFACTION GUARANTEED" />

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              lineHeight: 1,
              margin: '20px 0 28px',
              maxWidth: '1000px',
            }}
          >
            If you are not delighted,<br />
            <span style={{ color: service.accentColor }}>you do not pay</span> for the rework.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ fontSize: '16px', color: 'rgba(242,238,231,0.55)', lineHeight: 1.7, maxWidth: '600px', margin: '0 0 64px' }}
          >
            Premium output is the bar. We back it with four standing commitments. None of these are upsells, all of them are the standard.
          </motion.p>

          {/* Stat-led data cards. Award-site style: huge light-weight stat + clean type, no glass overload. */}
          <div className="promise-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {promises.map((p, i) => (
              <motion.div
                key={p.stat}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="promise-card"
                style={{
                  position: 'relative',
                  padding: '40px 28px 32px',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '380px',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {/* Index badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '24px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    color: 'rgba(242,238,231,0.3)',
                  }}
                >
                  {`0${i + 1} / 04`}
                </div>

                {/* Massive light-weight stat — the hero element */}
                <div
                  className="promise-stat"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(64px, 6vw, 92px)',
                    fontWeight: 200,
                    letterSpacing: '-4px',
                    lineHeight: 0.9,
                    color: service.accentColor,
                    marginTop: '20px',
                    marginBottom: '18px',
                  }}
                >
                  {p.stat}
                </div>

                {/* Stat label with accent rule */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                  <div style={{ width: '20px', height: '1px', background: service.accentColor }} />
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '2.5px',
                      textTransform: 'uppercase',
                      color: 'rgba(242,238,231,0.55)',
                    }}
                  >
                    {p.statLabel}
                  </div>
                </div>

                {/* Headline */}
                <h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(17px, 1.5vw, 22px)',
                    fontWeight: 800,
                    letterSpacing: '-0.4px',
                    lineHeight: 1.2,
                    color: '#F2EEE7',
                    margin: '0 0 14px',
                  }}
                >
                  {p.headline}
                </h3>

                {/* Body */}
                <p
                  style={{
                    fontSize: '13px',
                    color: 'rgba(242,238,231,0.55)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {p.body}
                </p>

                {/* Bottom accent indicator */}
                <div
                  className="promise-bottom-rule"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: service.accentColor,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
              </motion.div>
            ))}
          </div>

          <style>{`
            .promise-card:hover {
              background: rgba(255,255,255,0.045) !important;
              border-color: rgba(255,255,255,0.16) !important;
              transform: translateY(-4px);
            }
            .promise-card:hover .promise-bottom-rule { transform: scaleX(1) !important; }
            @media (max-width: 1100px) {
              .promise-grid { grid-template-columns: repeat(2, 1fr) !important; }
              .promise-card { min-height: 340px !important; }
            }
            @media (max-width: 600px) {
              .promise-grid { grid-template-columns: 1fr !important; }
              .promise-card { min-height: auto !important; }
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              marginTop: '64px',
              padding: '24px 28px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${service.accentColor}30`,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.5)' }}>
                Now booking strategy calls
              </span>
            </div>
            <span style={{ fontSize: '14px', color: 'rgba(242,238,231,0.7)', flex: 1, lineHeight: 1.5 }}>
              Free 45-minute call. No commitment. We send a custom plan whether or not you ever hire us.
            </span>
            <a
              href={BOOK_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: service.accentColor,
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
              }}
            >
              Book a Call →
            </a>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .promise-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* FAQ */}
      <section style={{ padding: '120px 56px', background: '#F2EEE7', color: '#0C0C0B' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <SectionLabel left="05 / FAQ" right={`${service.faq.length} ANSWERS`} />

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              lineHeight: 1,
              margin: '20px 0 56px',
            }}
          >
            Things to know.
          </motion.h2>

          <div>
            {service.faq.map((item, i) => (
              <FAQItem key={i} item={item} i={i} color={service.accentColor} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        id="final-cta"
        data-dark-bg="true"
        style={{
          padding: '140px 56px',
          background: '#0C0C0B',
          color: '#F2EEE7',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${service.accentColor}14 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <SectionLabel left="06 / Next Step" right="ECHOPULSE / 2026" />

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(48px, 7vw, 110px)',
              fontWeight: 900,
              letterSpacing: '-4px',
              lineHeight: 1.04,
              margin: '20px 0 36px',
              maxWidth: '1000px',
              paddingBottom: '0.04em',
            }}
          >
            Let us build this <span style={{ color: service.accentColor }}>for you.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ fontSize: '17px', color: 'rgba(242,238,231,0.5)', lineHeight: 1.7, maxWidth: '600px', margin: '0 0 56px' }}
          >
            Free 45-minute strategy call. We map your {service.name.toLowerCase()} system end to end and send a plan you can use, with us or without.
          </motion.p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href={BOOK_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: service.accentColor,
                color: '#fff',
                padding: '20px 44px',
                borderRadius: '100px',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: `0 14px 44px ${service.accentColor}55`,
              }}
            >
              Book a Free Strategy Call
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <Link
              href="/#services"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(242,238,231,0.7)',
                padding: '20px 36px',
                borderRadius: '100px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              All Services
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          section { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
      </motion.div>
    </>
  );
}

function FAQItem({ item, i, color }: { item: { q: string; a: string }; i: number; color: string }) {
  const [open, setOpen] = useState(i === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: i * 0.05 }}
      style={{ borderTop: i === 0 ? '1px solid rgba(12,12,11,0.12)' : 'none', borderBottom: '1px solid rgba(12,12,11,0.12)' }}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          outline: 'none',
          padding: '28px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          cursor: 'none',
          fontFamily: 'Inter,sans-serif',
          fontSize: 'clamp(16px, 1.6vw, 20px)',
          fontWeight: 700,
          color: open ? color : '#0C0C0B',
          transition: 'color 0.2s',
          letterSpacing: '-0.3px',
        }}
      >
        <span>
          <span style={{ fontWeight: 300, color: '#A8A49B', marginRight: '16px', fontSize: '0.85em' }}>{`0${i + 1}`}</span>
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0, background: open ? color : 'transparent' }}
          transition={{ duration: 0.3 }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1.5px solid rgba(12,12,11,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <line x1="5.5" y1="0" x2="5.5" y2="11" stroke={open ? '#fff' : '#0C0C0B'} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="0" y1="5.5" x2="11" y2="5.5" stroke={open ? '#fff' : '#0C0C0B'} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <p style={{ fontSize: '15px', color: '#6E6B63', lineHeight: 1.75, paddingBottom: '28px', paddingLeft: '40px', margin: 0, maxWidth: '720px' }}>
          {item.a}
        </p>
      </motion.div>
    </motion.div>
  );
}
