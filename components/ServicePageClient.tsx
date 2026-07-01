'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { type ServiceData, services as ALL_SERVICES } from '@/lib/serviceData';
import { useGeoPrice } from '@/lib/useGeoPrice';
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

/**
 * Emoji → inline SVG fallback for the Deliverables section icons.
 *
 * The service-data uses emoji strings (🎬, 📺, 🎙️, etc.) for fast authoring,
 * but emoji rendering is unreliable across the device fleet — older Android
 * devices, default Windows, and some Linux distros drop colored emoji and
 * render hollow boxes. Mapping to inline SVG guarantees every icon paints
 * with the same stroke + size on every device.
 *
 * Returns null if no mapping exists — the caller falls back to the raw
 * emoji character so we never render nothing.
 */
function deliverableIcon(emoji: string): React.ReactNode | null {
  const stroke = 'currentColor';
  const props = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (emoji.trim()) {
    case '🎬': return <svg {...props}><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M6 6l3-3M12 6l3-3M18 6l3-3" /></svg>;
    case '📺': return <svg {...props}><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M10 22h4M8 19v3M16 19v3" /></svg>;
    case '🎙️':
    case '🎙': return <svg {...props}><rect x="9" y="3" width="6" height="13" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v4M8 22h8" /></svg>;
    case '🎓': return <svg {...props}><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" /></svg>;
    case '🏠': return <svg {...props}><path d="M3 11l9-8 9 8M5 9v12h14V9" /></svg>;
    case '✨': return <svg {...props}><path d="M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4L12 3z" /><path d="M19 14l.6 1.7L21 16.5l-1.4.4-.6 1.6-.6-1.6-1.4-.4 1.4-.8z" /></svg>;
    case '✍️':
    case '✍': return <svg {...props}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>;
    case '📊': return <svg {...props}><path d="M3 21h18M7 17V9M12 17V5M17 17v-7" /></svg>;
    case '💬': return <svg {...props}><path d="M21 12c0 4.4-4 8-9 8a10 10 0 01-4-.8L3 21l1.8-5A8 8 0 013 12c0-4.4 4-8 9-8s9 3.6 9 8z" /></svg>;
    case '📝': return <svg {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></svg>;
    case '📈': return <svg {...props}><path d="M3 17l6-6 4 4 8-9" /><path d="M14 6h7v7" /></svg>;
    case '👥': return <svg {...props}><circle cx="9" cy="9" r="3" /><circle cx="17" cy="11" r="2.5" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3.5 3-3.5s4 1.5 4 3.5" /></svg>;
    case '🎯': return <svg {...props}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill={stroke} /></svg>;
    case '🔧':
    case '⚙️':
    case '⚙': return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z" /></svg>;
    default: return null;
  }
}

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
    { feature: 'Onboarding',          us: '90-min recorded brand brief interview',          them: 'Onboarding form, 5 questions' },
    { feature: 'Brief fidelity audit', us: 'Scored 8/10 minimum before ship',               them: 'No audit, no scoring' },
    { feature: 'Anti-AI tells',       us: 'Banned-phrase list, manual scrub on every post', them: '"Delve into the tapestry"' },
    { feature: 'Story sourcing',      us: 'Pulled from your story bank',                    them: 'Generic templates' },
    { feature: 'Engagement support',  us: '5 daily comment drafts in your style',           them: 'None' },
    { feature: 'Profile optimization', us: 'Headline + About + Featured refreshed quarterly', them: 'One-time setup' },
    { feature: 'Revisions',           us: 'Unlimited until you are satisfied',              them: 'One round, then per-post fees' },
    { feature: 'Pilot',               us: 'Two-week paid Pilot, see work first',            them: 'Pay full retainer upfront' },
  ],
  'blog-production': [
    { feature: 'Research depth',      us: 'Multi-agent + human source verification',        them: 'ChatGPT one-shot, no review' },
    { feature: 'Sources',             us: 'Real verifiable links on every stat',            them: 'Fabricated metrics' },
    { feature: 'Outline approval',    us: 'Required before drafting',                       them: 'Skipped. Drafts arrive cold' },
    { feature: 'Brief fidelity',      us: 'Scored 8/10 against brand brief',                them: 'No fidelity audit' },
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
    { feature: 'On-brand messages',   us: 'Written from your brand brief',                  them: 'Robotic templates' },
    { feature: 'Lead qualification',  us: 'Scoring rules + filters built-in',               them: 'Extra setup fee' },
    { feature: 'Calendar integration', us: 'Two-way sync, qualified leads only',            them: 'One-way embed' },
    { feature: 'Performance dashboard', us: 'Live reporting included',                      them: 'Not included' },
    { feature: 'Maintenance',         us: 'Monthly tune-ups included',                      them: 'Separate retainer' },
    { feature: 'Onboarding',          us: 'Two-week paid Pilot, see work first',            them: 'Pay full setup upfront' },
  ],
};

type Promise = { stat: string; statLabel: string; headline: string; body: string };

// Default promises used by most service pages (content retainers).
const promisesDefault: Promise[] = [
  {
    stat: '8/10',
    statLabel: 'Min brief fidelity',
    headline: 'Fits your business, or we rewrite.',
    body: 'Every deliverable is scored against your brand brief. Below 8 out of 10, we rewrite at no charge. No invoicing for our miss.',
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
    // Placeholder — the actual price token is patched per-locale by
    // localizePromises() at render time.
    stat: '__PILOT_PRICE__',
    statLabel: 'Pilot to start',
    headline: 'Try first. Commit when convinced.',
    body: 'Every relationship starts with a paid two-week Pilot at our intro price of __PILOT_PRICE__. 8 short-form and 5 clipped content pieces, 5 long-form blogs, the onboarding strategy session, and a content audit plus 30-day plan. See the quality before any monthly engagement.',
  },
];

/** Patch the __PILOT_PRICE__ placeholder so non-US visitors see the right currency. */
function localizePromises(list: Promise[], pilotPrice: string): Promise[] {
  return list.map((p) => ({
    ...p,
    stat: p.stat.replace(/__PILOT_PRICE__/g, pilotPrice),
    body: p.body.replace(/__PILOT_PRICE__/g, pilotPrice),
  }));
}

// Website builds are one-off projects, not content retainers. Generic
// promises (brief fidelity, monthly cancel, $299 content pilot) do not fit.
// Swapped for website-specific commitments that pull at the buyer's actual
// pain: pricing transparency, speed, no-cap iteration, post-launch safety.
const promisesWebsites: Promise[] = [
  {
    stat: '$699',
    statLabel: 'Fixed pricing, $699 to $1.5K',
    headline: 'You see the price before we start.',
    body: 'Quoted in writing before a single pixel moves. Sites start at $699 and cap at $1,500 for a full conversion-built marketing site. Dev agencies quote 8x that for the same scope and timeline. Same outcome, fraction of the cost, zero surprise invoices.',
  },
  {
    stat: '<2s',
    statLabel: 'Mobile load time',
    headline: 'Fast enough to keep buyers reading.',
    body: 'Sub-2-second mobile load on every site. That one number changes everything: visitors stay longer, Google ranks you higher, bounce rate drops. The difference between a site that books calls and a site that loads after they have closed the tab.',
  },
  {
    stat: '∞',
    statLabel: 'Revisions until it converts',
    headline: 'We refine until the site books calls.',
    body: 'Most agencies cap rounds and charge for the fifth. We do not. We iterate on copy, layout, and flow until the site looks the way you want and converts the way you need. The build is done when you say it is done.',
  },
  {
    stat: '14d',
    statLabel: 'Free fixes after launch',
    headline: 'We do not ghost after handoff.',
    body: 'Two weeks of free fixes after the site goes live so any rough edges get cleaned while you are still publishing. After that, hire any developer in the world to extend it, or keep us on a small monthly retainer. The code is yours from day one.',
  },
];

function getPromisesForSlug(slug: string): Promise[] {
  if (slug === 'websites-funnels') return promisesWebsites;
  return promisesDefault;
}

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

function StickyBottomCTA({ accentColor, bookCall }: { accentColor: string; bookCall: () => void }) {
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
      className="svc-sticky-cta"
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
      <button
        type="button"
        onClick={() => {
          bookCall();
        }}
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
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Book a Call
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </button>
    </motion.div>
  );
}

function SectionLabel({ left, right }: { left: string; right?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="svc-section-label"
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
      <span className="svc-label-right">{right}</span>
    </motion.div>
  );
}


/**
 * RelatedServices — cross-link card grid.
 *
 * Picks the next three services in the canonical order (wrapping around)
 * so every service page becomes a hub linking to siblings. Keeps each page
 * from being a conversion dead-end and strengthens topical authority via
 * internal-link equity flow.
 */
function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const list = ALL_SERVICES.filter((s) => s.slug !== currentSlug).slice(0, 3);
  return (
    <div
      className="svc-related"
      style={{
        marginTop: '88px',
        paddingTop: '48px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: 'rgba(242,238,231,0.45)',
          marginBottom: '20px',
        }}
      >
        While we have you · related services
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
        }}
      >
        {list.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            data-cursor-hover
            style={{
              display: 'block',
              padding: '22px 22px 24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px',
              textDecoration: 'none',
              transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.05)';
              el.style.borderColor = s.accentColor + '55';
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.03)';
              el.style.borderColor = 'rgba(255,255,255,0.08)';
              el.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: s.accentColor,
                marginBottom: '14px',
                boxShadow: `0 0 14px ${s.accentColor}aa`,
              }}
            />
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '17px',
                fontWeight: 800,
                color: '#F2EEE7',
                letterSpacing: '-0.4px',
                marginBottom: '6px',
              }}
            >
              {s.name}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(242,238,231,0.55)',
                lineHeight: 1.5,
              }}
            >
              {s.tagline}
            </div>
            <div
              style={{
                marginTop: '14px',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '0.6px',
                color: s.accentColor,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              See this service
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
      <style>{`
        @media (max-width: 760px) {
          .svc-related { margin-top: 56px !important; padding-top: 32px !important; }
          .svc-related > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function ServicePageClient({ service }: { service: ServiceData }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

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

  // Localized promise list — patches the __PILOT_PRICE__ placeholder with the
  // visitor's region-appropriate Pilot price ($299 / £239 / ₹4,999 / etc).
  const { currency: localCurrency, prices: localPrices } = useGeoPrice();
  const localizedPromises = localizePromises(
    getPromisesForSlug(service.slug),
    `${localCurrency}${localPrices.pilot}`,
  );

  // Service-aware booking trigger. If the service has its own Cal.com URL
  // set (e.g. a dedicated "Website Strategy Call" event), open it in a new
  // tab so it pre-fills the right event type. Otherwise fall back to the
  // global modal which uses the default call URL from lib/links.ts.
  const bookCall = () => {
    if (service.bookCallUrl) {
      window.open(service.bookCallUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
  };

  return (
    <>
      {/* Fixed-position elements — must stay outside the slide wrapper so they anchor to viewport, not the animating container */}
      <StickyProgress />
      <Nav />
      <StickyBottomCTA accentColor={service.accentColor} bookCall={bookCall} />

      {/* ── Mobile app-UI tightening across every service-page section ──
         Sections were authored with 120px top/bottom padding for desktop.
         On mobile that's a third of the viewport burnt before any content.
         This single rule compresses every section, headline, and inter-block
         margin to app-feel proportions. Per-section overrides below still
         win where they need finer control. */}
      <style jsx global>{`
        @media (max-width: 768px) {
          main section { padding-top: 48px !important; padding-bottom: 48px !important; }
          main section h2 { font-size: clamp(26px, 7vw, 38px) !important; letter-spacing: -1.1px !important; line-height: 1.05 !important; margin-bottom: 18px !important; }
          main section .section-label,
          main section [class*="eyebrow"] { margin-bottom: 10px !important; font-size: 9.5px !important; letter-spacing: 2.5px !important; }
          .deliverable-row { padding: 14px 0 !important; gap: 14px !important; }
          .deliverable-row h3 { font-size: 15px !important; }
        }
        @media (max-width: 380px) {
          main section { padding-top: 36px !important; padding-bottom: 36px !important; }
          main section h2 { font-size: 24px !important; }
        }
      `}</style>

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
        className="svc-hero"
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

          {/* Hero split: editorial text + service-specific visual.
              Balanced 1:1 grid so the visual sits beside the text instead of
              being shoved to the right edge. Headline clamp tightened so
              longer taglines (3+ short phrases) don't blow out the layout. */}
          <div className="hero-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <h1
                ref={titleRef}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(34px, 3.8vw, 58px)',
                  fontWeight: 900,
                  letterSpacing: '-2px',
                  lineHeight: 1.04,
                  color: '#F2EEE7',
                  margin: '0 0 24px',
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
                className="svc-hero-actions"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}
              >
                <button
                  type="button"
                  onClick={() => {
                    bookCall();
                  }}
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
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Book a Free Strategy Call
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
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

            {/* Per-service custom visual. Centered in its column so it sits
                next to the text instead of bleeding off the right edge. */}
            <div className="hero-visual" style={{ width: '100%', maxWidth: '480px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ServiceHeroVisual slug={service.slug} accent={service.accentColor} />
            </div>
          </div>

          <style>{`
            @media (max-width: 900px) {
              .hero-split { grid-template-columns: 1fr !important; gap: 32px !important; }
              .hero-visual { display: none !important; }
            }

            /* ── Mobile-only refinements for the service-page hero ──────
               The desktop layout uses 64px horizontal padding which eats
               most of a phone's viewport. The headline clamp scales it
               smaller, but other section paddings (top 120px + bottom 80px)
               still leave too much dead space. This block tightens the
               whole hero so it reads cleanly on a phone screen. */
            @media (max-width: 768px) {
              .svc-hero {
                min-height: auto !important;
                padding: 96px 18px 56px !important;
                justify-content: flex-start !important;
              }
              .svc-hero h1 {
                font-size: clamp(28px, 8vw, 38px) !important;
                letter-spacing: -1.2px !important;
                line-height: 1.08 !important;
                margin-bottom: 18px !important;
              }
              .svc-hero p {
                font-size: 14.5px !important;
                line-height: 1.6 !important;
                margin-bottom: 28px !important;
              }
              .svc-hero-actions {
                flex-direction: column !important;
                align-items: stretch !important;
                gap: 10px !important;
                width: 100%;
              }
              .svc-hero-actions > * {
                width: 100% !important;
                justify-content: center !important;
                padding: 14px 20px !important;
                font-size: 14px !important;
                min-height: 48px !important;
                box-sizing: border-box !important;
              }
            }
            @media (max-width: 380px) {
              .svc-hero { padding: 88px 14px 48px !important; }
              .svc-hero h1 { font-size: 26px !important; }
            }

            /* ── Mobile padding/typography pass on every section below the hero
               Reduces the desktop 120px×56px section frames to phone-friendly
               sizes so the page does not feel like all whitespace. */
            @media (max-width: 768px) {
              #deliverables { padding: 64px 18px 48px !important; }
              #deliverables h2 { font-size: clamp(28px, 7vw, 40px) !important; letter-spacing: -1.2px !important; line-height: 1.05 !important; margin-bottom: 36px !important; }
              #deliverables .deliverable-row { padding: 18px 0 !important; gap: 14px !important; }
              #final-cta { padding: 72px 18px 64px !important; }
              #final-cta h2 { font-size: clamp(28px, 7.5vw, 44px) !important; letter-spacing: -1.3px !important; }
            }
            @media (max-width: 380px) {
              #deliverables { padding: 56px 14px 44px !important; }
              #final-cta { padding: 64px 14px 56px !important; }
            }
          `}</style>
        </div>

        {/* Bottom signature row */}
      </section>

      {/* DELIVERABLES — editorial list */}
      <section id="deliverables" style={{ padding: '120px 56px 80px', background: '#F2EEE7', color: '#0C0C0B' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionLabel left={`Things We Do`} />

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
                <div style={{ textAlign: 'right', lineHeight: 1, color: '#0C0C0B' }} aria-hidden="true">
                  {/* Map emoji → inline SVG so icons render reliably on every
                      device (some Android/Windows builds drop colored emoji,
                      leaving empty boxes). Falls back to the original emoji
                      character if we don't have a match. */}
                  {deliverableIcon(d.icon) ?? <span style={{ fontSize: '24px' }}>{d.icon}</span>}
                </div>
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
        className="svc-comparison-section"
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
            className="cmp-container"
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
            {/* Header row */}
            <div className="cmp-grid cmp-header-row" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="cmp-header-cell" style={{ padding: '18px 24px', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.4)' }}>
                Feature
              </div>
              <div className="cmp-header-cell" style={{ padding: '18px 24px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.2px', color: service.accentColor, borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: service.accentColor, flexShrink: 0, boxShadow: `0 0 10px ${service.accentColor}` }} />
                EchoPulse
              </div>
              <div className="cmp-header-cell" style={{ padding: '18px 24px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.2px', color: 'rgba(242,238,231,0.45)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
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
                <div className="cmp-feature-cell" style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#F2EEE7' }}>
                  {row.feature}
                </div>
                <div className="cmp-us-cell" style={{ padding: '16px 24px', fontSize: '13px', color: 'rgba(242,238,231,0.85)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: service.accentColor, fontWeight: 800, flexShrink: 0 }}>✓</span>
                  {row.us}
                </div>
                <div className="cmp-them-cell" style={{ padding: '16px 24px', fontSize: '13px', color: 'rgba(242,238,231,0.4)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: 'rgba(239,68,68,0.6)', fontWeight: 800, flexShrink: 0 }}>✗</span>
                  {row.them}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <style>{`
          /* ── Comparison table — Mobile card layout ────────────────
             The 3-column grid is cramped at phone width and the desktop
             font shrinks were unreadable on real devices. Mobile gets a
             completely different IA: each comparison becomes its own card
             with the feature name as an orange header strip and us/them
             side-by-side underneath (so the comparison is still visual).
             Reads cleanly from 320px up.
          ─────────────────────────────────────────────────────────── */
          @media (max-width: 768px) {
            .svc-comparison-section { padding: 56px 16px !important; }
            .svc-comparison-section h2 { font-size: clamp(28px, 7vw, 42px) !important; letter-spacing: -1.2px !important; margin-bottom: 24px !important; }

            /* Wrap the table in a scrollable container */
            .cmp-container {
              overflow-x: auto !important;
              -webkit-overflow-scrolling: touch !important;
              border-radius: 16px !important;
            }

            /* Fix column widths so they don't collapse — table scrolls horizontally */
            .cmp-header-row,
            .cmp-grid {
              grid-template-columns: 120px 160px 160px !important;
              min-width: 440px !important;
            }

            .cmp-header-cell { padding: 12px 14px !important; font-size: 10px !important; }
            .cmp-feature-cell { padding: 14px 14px !important; font-size: 12px !important; }
            .cmp-us-cell { padding: 14px 14px !important; font-size: 12px !important; line-height: 1.45 !important; }
            .cmp-them-cell { padding: 14px 14px !important; font-size: 12px !important; line-height: 1.45 !important; }
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
                  className="process-num"
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

          {/* Stat-led data cards. Award-site style: huge light-weight stat + clean type, no glass overload.
              Cards are pulled per-slug so websites can show $699 starting + speed promises instead of
              the generic $299 content Pilot. */}
          <div className="promise-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {localizedPromises.map((p, i) => (
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
            className="svc-promise-strip"
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
            <button
              type="button"
              onClick={() => {
                bookCall();
              }}
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
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Book a Call →
            </button>
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

          <div className="svc-final-actions" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {/* PRIMARY — order this service directly (deep-links the OrderFlow to the right service slug) */}
            <Link
              href={`/order?service=${service.slug}`}
              data-cursor-hover
              style={{
                background: service.accentColor,
                color: '#fff',
                padding: '20px 40px',
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
              Order this service
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            {/* WARM — talk it through first (opens BookCallModal, respects per-service Cal.com URL) */}
            <button
              type="button"
              onClick={() => bookCall()}
              data-cursor-hover
              style={{
                background: 'transparent',
                color: '#F2EEE7',
                padding: '20px 36px',
                borderRadius: '100px',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid rgba(255,255,255,0.18)',
                cursor: 'pointer',
              }}
            >
              Or book a strategy call
            </button>
            <Link
              href="/#services"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(242,238,231,0.55)',
                padding: '20px 30px',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              All services
            </Link>
          </div>

          {/* ─── Related services — cross-link 3 other services so each page is a hub ─── */}
          <RelatedServices currentSlug={service.slug} />
        </div>
      </section>

      <style>{`
        /* ─── SERVICE PAGE MOBILE OVERRIDES ──────────────────────────── */

        /* Hide the desktop floating pill CTA on phones — MobileStickyCTA handles it */
        @media (max-width: 768px) {
          .svc-sticky-cta { display: none !important; }
        }

        /* SectionLabel — hide the long right-hand text on narrow phones to
           prevent overflow. The left text (section number + name) is enough. */
        @media (max-width: 540px) {
          .svc-label-right { display: none !important; }
          .svc-section-label { justify-content: flex-start !important; }
        }

        /* HERO section ─── */
        @media (max-width: 900px) {
          .hero-split { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-visual { display: none !important; }
        }
        @media (max-width: 768px) {
          /* Stack hero CTAs and make them full-width */
          .svc-hero-actions {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .svc-hero-actions > * {
            width: 100% !important;
            justify-content: center !important;
            text-align: center !important;
          }
          /* Tighten the bottom signature bar */
          .svc-hero-meta {
            margin-top: 32px !important;
            flex-direction: column !important;
            gap: 6px !important;
            align-items: flex-start !important;
          }
          .svc-hero-meta > span:not(:first-child) { display: none !important; } /* hide middle-dot separators */
        }

        /* DELIVERABLES section ─── */
        @media (max-width: 768px) {
          .deliverable-row {
            grid-template-columns: 44px 1fr 36px !important;
            gap: 16px !important;
            padding: 20px 0 !important;
          }
          .deliverable-row > p { display: none !important; }
        }

        /* COMPARISON section ─── */
        @media (max-width: 768px) {
          .cmp-grid { grid-template-columns: 1fr !important; }
          .cmp-grid > div { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.06); }
          /* Pad the header row cells a bit more so they read clearly when stacked */
          .cmp-grid > div:first-child { border-top: none !important; }
        }

        /* PROCESS section ─── */
        @media (max-width: 768px) {
          .process-row {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            padding: 32px 0 !important;
          }
          /* Shrink the huge step number so it doesn't eat the whole screen */
          .process-row .process-num {
            font-size: clamp(52px, 14vw, 80px) !important;
            letter-spacing: -3px !important;
            line-height: 0.9 !important;
          }
        }

        /* PROMISE GRID section ─── */
        @media (max-width: 1100px) {
          .promise-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .promise-card { min-height: 320px !important; }
        }
        @media (max-width: 640px) {
          .promise-grid { grid-template-columns: 1fr !important; }
          .promise-card { min-height: auto !important; padding: 28px 20px !important; }
          .promise-stat { font-size: clamp(52px, 14vw, 80px) !important; }
          /* CTA strip at bottom of promise — stack on mobile */
          .svc-promise-strip {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .svc-promise-strip button {
            width: 100% !important;
          }
        }

        /* FINAL CTA ACTIONS ─── */
        @media (max-width: 768px) {
          .svc-final-actions {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
            align-items: center !important;
          }
          .svc-final-actions > * {
            padding: 12px 20px !important;
            font-size: 13px !important;
            flex: 0 0 auto !important;
            width: auto !important;
          }
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
          animate={{ rotate: open ? 45 : 0, background: open ? color : 'rgba(0,0,0,0)' }}
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
        <p style={{ fontSize: '15px', color: 'rgba(12,12,11,0.7)', lineHeight: 1.7, margin: 0, paddingBottom: '20px', maxWidth: '780px' }}>
          {item.a}
        </p>
      </motion.div>
    </motion.div>
  );
}
