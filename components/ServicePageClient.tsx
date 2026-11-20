'use client';

import { useEffect, useState } from 'react';
import { trackCallClick, trackPilotClick } from '@/lib/analytics';
import GuidesSection from '@/components/GuidesSection';
import NicheLinks from '@/components/niche/NicheLinks';
import ICPWork from '@/components/icp/ICPWork';
import Reveal from '@/components/icp/Reveal';
import { sentences } from '@/components/icp/Prose';
import { FUNNEL_CSS, CHECK_PATH, ARROW_PATH } from '@/components/icp/funnelStyles';
import type { Guide } from '@/lib/blogLinks';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { type ServiceData, services as ALL_SERVICES } from '@/lib/serviceData';
import { videos as ALL_VIDEOS } from '@/lib/videos';
import { useGeoPrice } from '@/lib/useGeoPrice';
import Nav from './Nav';
import Footer from './Footer';
import { BOOK_CALL_LABEL, BOOK_CALL_REASSURANCE, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';
import { PROMISES } from '@/lib/pricing';
import { PAGES_UPDATED_LABEL, PAGES_UPDATED_ISO } from '@/lib/siteMeta';

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

/**
 * Zero-padded list index, 1-based.
 *
 * Four places built this as `0${i + 1}`, which is correct for the first nine
 * items and produces "010" and "011" for the tenth and eleventh. The FAQ on
 * apps-software has eleven entries, so the sequence shipped as 01 through 09,
 * 010, 011. padStart caps the padding at two characters instead of prefixing
 * a zero unconditionally.
 */
function ord(i: number): string {
  return String(i + 1).padStart(2, '0');
}

type ComparisonRow = { feature: string; us: string; them: string };

/**
 * Per-service comparison rows. Each service compares EchoPulse against the
 * relevant alternative for THAT service.
 *
 * EVERY SERVICE IN lib/serviceData.ts MUST HAVE AN ENTRY HERE.
 *
 * This used to end with `|| comparisonsByService['video-editing']`, and
 * apps-software was the one slug with no entry, so the software page spent
 * months telling buyers about shot grammar, colour grades, caption styling and
 * sound design. Nobody caught it because a silent fallback renders a perfectly
 * confident table of the wrong thing. The fallback is gone: a missing entry now
 * drops the section and shouts in the dev console instead of inventing content.
 */
const comparisonsByService: Record<string, ComparisonRow[]> = {
  'video-editing': [
    { feature: 'Turnaround',          us: '48 hours on short-form edits',                            them: '5 to 7 business days' },
    { feature: 'Shot grammar',        us: 'Retention-engineered, mobile-first',             them: 'Aesthetic-led, desktop preview' },
    { feature: 'Captions',            us: 'Burned-in, animated, brand-styled',              them: 'Auto-generated CapCut style' },
    { feature: 'Color grade',         us: 'Per-platform tuned LUT',                         them: 'Single grade for everything' },
    { feature: 'Sound design',        us: 'Music + SFX + audio mastering',                  them: 'Music drop, no mastering' },
    { feature: 'Format exports',      us: 'Reels + TikTok + Shorts + listing-site MP4',     them: 'One master file' },
    { feature: 'Revisions',           us: 'Unlimited until you are satisfied',              them: 'One round, then per-hour' },
    { feature: 'Onboarding',          us: 'Two-week paid Pilot, see work first',            them: 'Pay full retainer upfront' },
  ],
  'linkedin-ghostwriting': [
    { feature: 'Onboarding',          us: 'Recorded onboarding interview, about an hour',   them: 'Onboarding form, 5 questions' },
    { feature: 'Brief fidelity audit', us: 'Scored 8/10 minimum before ship',               them: 'No audit, no scoring' },
    { feature: 'Anti-AI tells',       us: 'Banned-phrase list, manual scrub on every post', them: '"Delve into the tapestry"' },
    { feature: 'Story sourcing',      us: 'Pulled from your story bank',                    them: 'Generic templates' },
    { feature: 'Engagement support',  us: '5 daily comment drafts in your style',           them: 'None' },
    { feature: 'Profile optimization', us: 'Headline + About + Featured refreshed quarterly', them: 'One-time setup' },
    { feature: 'Revisions',           us: 'Unlimited until you are satisfied',              them: 'One round, then per-post fees' },
    { feature: 'Pilot',               us: 'Two-week paid Pilot, see work first',            them: 'Pay full retainer upfront' },
  ],
  'seo-aeo': [
    { feature: 'Starting point',      us: 'Your pages, structured data and Google Business Profile', them: 'Blogs published onto an unchanged site' },
    { feature: 'Sources',             us: 'Working source link on every statistic',         them: 'Unsourced claims' },
    { feature: 'Editing',             us: 'A person edits every piece before you see it',   them: 'Unreviewed AI drafts' },
    { feature: 'Reporting',           us: 'Monthly review of impressions, clicks and positions', them: 'Rankings screenshot' },
    { feature: 'Guarantees',          us: 'The work, not a position or a citation count',   them: 'A promised page-one ranking' },
    { feature: 'Contract',            us: 'Month-to-month, 14 days notice',                 them: '6 to 12 month terms' },
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
    { feature: 'Output cadence',      us: '6 a month on Growth (4 static, 2 video)',        them: '2 to 3 per month' },
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
  // Every row below is drawn from this page's own steps, deliverables and FAQ.
  // Nothing here is a new claim.
  'apps-software': [
    { feature: 'Scoping',             us: 'Fixed price and delivery date in writing before work starts', them: 'Hourly billing, scope grows as it goes' },
    { feature: 'Build visibility',    us: 'Working screens you can click, every week',      them: 'Status decks and Figma mockups' },
    { feature: 'Feedback loop',       us: 'Slack, with updates shipped in days',            them: 'Weekly call, changes next sprint' },
    { feature: 'Code ownership',      us: 'Transferred to your GitHub on launch day',       them: 'Stays in the agency repo' },
    { feature: 'Hosting',             us: 'Your account, no lock-in, no monthly rent',      them: 'Their platform, monthly fee forever' },
    { feature: 'Post-launch',         us: '14 days of free fixes, then your call',          them: 'Handover, then per-hour support' },
    { feature: 'Honest scoping',      us: 'We say so when a build will not pay for itself', them: 'Quotes the biggest build the budget allows' },
    { feature: 'Handover pack',       us: 'Code, documentation, walkthrough video, team training', them: 'A login and a thank you' },
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
    // Scope mirrors PILOT.scope in lib/pricing.ts (6 edits, 2 posts, 1 blog,
    // onboarding session, audit and 30-day plan). Keep it in step with that file.
    body: 'Send footage and get 2 edited videos free within 48 hours. Then a two-week Pilot at __PILOT_PRICE__: an onboarding session, 6 short-form videos, 2 posts, 1 sourced SEO blog, a content audit and a 30-day plan. See the quality before any monthly plan.',
  },
];

/**
 * Pilot overrides for the two services where a content Pilot makes no sense.
 *
 * The default Pilot is the content Pilot (PILOT in lib/pricing.ts: 6 video edits,
 * 2 posts, 1 blog, a strategy session, an audit and a plan). Selling that to someone who
 * came to the page for an automation build or a custom app is answering a
 * question they did not ask, and it was the same block on all seven services.
 * Both of these describe the same $299, the same 14 days and the same
 * keep-it-either-way terms, applied to the thing that page is actually about.
 */
const pilotAutomations: Promise = {
  stat: '__PILOT_PRICE__',
  statLabel: 'Automation Audit to start',
  headline: 'Find the leaks before you commit.',
  body: 'A __PILOT_PRICE__ Automation Audit to start. We map your full lead flow end to end, show you every place a lead currently goes cold, and ship your first automation live within 14 days. You keep the blueprint whether you continue or not.',
};

const pilotApps: Promise = {
  stat: '__PILOT_PRICE__',
  statLabel: 'Build Blueprint to start',
  headline: 'Scope it properly before anyone writes code.',
  body: 'A __PILOT_PRICE__ Build Blueprint to start. A 30-minute scoping call, a written fixed-price scope with a delivery date, and clickable prototype direction within 14 days. You keep the spec whether you continue or not, and if a custom build is not right for your stage we will say so in it.',
};

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
    body: 'We build every site to load in under 2 seconds on mobile. A slow page loses visitors before they read a word, and Google treats page speed as one of its signals.',
  },
  {
    stat: '∞',
    statLabel: 'Revisions until you are happy',
    headline: 'We refine until you sign off.',
    body: 'No cap on rounds and no charge for the fifth. We keep working on the copy, layout, and flow until the site is the one you want. The build is done when you say it is done.',
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
  // Same three guarantees, service-appropriate fourth card. The default
  // fourth card sells the content Pilot, which is not what someone on the
  // automations or apps page is buying.
  if (slug === 'automations') return [...promisesDefault.slice(0, 3), pilotAutomations];
  if (slug === 'apps-software') return [...promisesDefault.slice(0, 3), pilotApps];
  return promisesDefault;
}


function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/**
 * Desktop-only floating pill once the hero has scrolled away. It carries the
 * page's own primary ask, so it never competes with the buttons in the page,
 * and hides when the final ask is on screen. Phones use MobileStickyCTA.
 */
function StickyBottomCTA({ accentColor, children }: { accentColor: string; children: React.ReactNode }) {
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

    let observer: IntersectionObserver | null = null;
    let retry: ReturnType<typeof setTimeout> | undefined;
    const attach = () => {
      const el = document.getElementById('final-cta');
      if (!el) {
        retry = setTimeout(attach, 200);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setFinalCtaInView(entry.isIntersecting),
        { threshold: 0, rootMargin: '0px 0px -20% 0px' },
      );
      observer.observe(el);
    };
    attach();

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
      if (retry) clearTimeout(retry);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const visible = show && !finalCtaInView;

  return (
    <motion.div
      className="svc-sticky-cta"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: visible ? 0 : 90, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: visible ? 'auto' : 'none', ['--fn-accent' as string]: accentColor }}
    >
      <span className="svc-sticky-text">Ready to start?</span>
      {children}
    </motion.div>
  );
}

/**
 * Cross-links to three sibling services, so no service page is a dead end.
 */
function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const list = ALL_SERVICES.filter((s) => s.slug !== currentSlug).slice(0, 3);
  return (
    <div className="svc-related">
      <p className="fn-eyebrow">Related services</p>
      <div className="fn-grid fn-grid-3">
        {list.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`} data-cursor-hover className="fn-card svc-related-card">
            <span className="svc-related-dot" style={{ background: s.accentColor }} aria-hidden="true" />
            <h3 className="fn-h3">{s.name}</h3>
            <p>{s.tagline}</p>
            <span className="svc-related-more" style={{ color: s.accentColor }}>
              See this service <Icon d={ARROW_PATH} size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Vertical work samples for the video editing page's strip, one per file. */
function workSamples() {
  const seen = new Set<string>();
  return ALL_VIDEOS.filter((v) => {
    if (v.orientation === 'horizontal' || seen.has(v.url)) return false;
    seen.add(v.url);
    return true;
  }).slice(0, 10);
}

export default function ServicePageClient({ service, guides = [] }: { service: ServiceData; guides?: Guide[] }) {
  const accent = service.accentColor;
  // No fallback. A service with no rows of its own renders no comparison
  // section, which is a visible gap someone will fix, rather than a confident
  // table about a different service.
  const comparisonRows = comparisonsByService[service.slug];
  if (process.env.NODE_ENV !== 'production' && !comparisonRows) {
    console.error(
      `[ServicePageClient] No comparison rows for service "${service.slug}". ` +
        'Add an entry to comparisonsByService in this file. The section is being skipped.',
    );
  }

  // Patches the __PILOT_PRICE__ placeholder from useGeoPrice so the promise
  // card never drifts from the pricing section.
  const { currency: localCurrency, prices: localPrices } = useGeoPrice();
  const localizedPromises = localizePromises(
    getPromisesForSlug(service.slug),
    `${localCurrency}${localPrices.pilot}`,
  );

  // Every booking button opens the same booking modal (BookCallModal).
  const bookCall = (where: string) => {
    trackCallClick(`service_${service.slug}${where ? `_${where}` : ''}`);
    (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
  };

  // The free sample is two edited videos, so it is the primary ask only on the
  // two services where that is what the visitor came for. Everywhere else the
  // call is. Whichever it is, it is the same ask at the hero, mid-page and end.
  const offersFreeEdits = service.slug === 'video-editing' || service.slug === 'ad-creatives';

  // Hero: the first sentence or two of the sub, the rest opens the deliverables.
  const subSentences = sentences(service.heroSub);
  let heroCount = 1;
  if (subSentences.length > 1 && (subSentences[0] + subSentences[1]).length < 170) heroCount = 2;
  const heroSub = subSentences.slice(0, heroCount).join(' ');
  const subRest = subSentences.slice(heroCount).join(' ');

  const words = service.tagline.split(' ');
  const samples = service.slug === 'video-editing' ? workSamples() : [];

  const primary = (where: string, className = 'fn-btn') =>
    offersFreeEdits ? (
      <Link
        href={FREE_EDITS_URL}
        data-cursor-hover
        className={className}
        onClick={() => trackPilotClick(`service_${service.slug}_${where}_free_edits`)}
      >
        {FREE_EDITS_LABEL}
        <Icon d={ARROW_PATH} size={15} />
      </Link>
    ) : (
      <button type="button" data-cursor-hover className={className} onClick={() => bookCall(where)}>
        {BOOK_CALL_LABEL}
        <Icon d={ARROW_PATH} size={15} />
      </button>
    );

  const altAsk = (where: string) =>
    offersFreeEdits ? (
      <p className="fn-alt-ask">
        Prefer to talk first?{' '}
        <button type="button" data-cursor-hover onClick={() => bookCall(where)}>
          {BOOK_CALL_LABEL}
        </button>
      </p>
    ) : (
      <p className="fn-alt-ask">{BOOK_CALL_REASSURANCE}</p>
    );

  return (
    <div className="fn svc" style={{ ['--fn-accent' as string]: accent }}>
      <Nav />
      <StickyBottomCTA accentColor={accent}>{primary('sticky', 'fn-btn svc-sticky-btn')}</StickyBottomCTA>

      {/* ── HERO (ink) ── */}
      <section data-dark-bg="true" className="svc-hero fn-ink">
        <div aria-hidden="true" className="svc-wash" style={{ background: `radial-gradient(ellipse 60% 55% at 78% 30%, ${accent}14 0%, ${accent}00 70%)` }} />
        <div className="fn-container svc-hero-grid">
          <div>
            <p className="fn-eyebrow" style={{ color: accent }}>{service.name}</p>
            <h1 className="fn-h1 svc-h1">
              {/* Visually hidden service keyword so the H1 names the service. */}
              <span className="svc-sr">{service.name}: </span>
              {words.slice(0, -1).join(' ')}{' '}
              <span style={{ color: accent }}>{words[words.length - 1]}</span>
            </h1>
            <p className="fn-lead svc-sub">{heroSub}</p>
            <div className="fn-actions">{primary('hero')}</div>
            {altAsk('hero')}
            <ul className="fn-proof" aria-label="On every plan">
              <li><Icon d={CHECK_PATH} />{service.slug === 'apps-software' || service.slug === 'websites-funnels' ? 'Fixed price in writing' : 'Month to month'}</li>
              <li><Icon d={CHECK_PATH} />Revised until right</li>
              <li><Icon d={CHECK_PATH} />Founder reviews every piece</li>
            </ul>
          </div>
          <div className="svc-hero-visual">
            <ServiceHeroVisual slug={service.slug} accent={accent} />
          </div>
        </div>
      </section>

      {/* ── WORK (ink), straight under the hero, where there is work to show ── */}
      {samples.length > 0 ? (
        <section data-dark-bg="true" className="svc-work fn-ink" aria-labelledby="svc-work-h">
          <div className="fn-container svc-work-head">
            <h2 id="svc-work-h" className="svc-work-h">Edits we have cut</h2>
            <Link href="/work" className="fn-textlink">See all work</Link>
          </div>
          <ICPWork videos={samples} accent={accent} />
        </section>
      ) : null}
      {service.slug === 'seo-aeo' ? (
        <section data-dark-bg="true" className="svc-work fn-ink">
          <div className="fn-container">
            <div className="svc-proof-card">
              <p className="fn-eyebrow" style={{ color: accent }}>Proof you can check</p>
              <p className="svc-proof-text">
                The MagicBNB case study publishes a real Search Console export with the client&apos;s permission, and lists the problems still open on the account.
              </p>
              <Link href="/case-studies/magicbnb-seo-aeo" className="fn-textlink">Read the MagicBNB case study</Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── DELIVERABLES (cream) ── */}
      <section id="deliverables" className="fn-section fn-cream">
        <div className="fn-container fn-split">
          <Reveal className="fn-split-sticky">
            <p className="fn-eyebrow" style={{ color: accent }}>What you get</p>
            <h2 className="fn-h2">Every piece you receive, <span style={{ color: accent }}>built to ship.</span></h2>
            {subRest ? <p className="fn-body svc-sub-rest">{subRest}</p> : null}
          </Reveal>
          <ol className="fn-rows fn-rows-2">
            {service.deliverables.map((d, i) => (
              <Reveal as="li" key={d.title} delay={Math.min(i * 0.04, 0.2)}>
                <span className="fn-num" style={{ color: accent }}>{ord(i)}</span>
                <div>
                  <h3 className="fn-h3">{d.title}</h3>
                  <p>{d.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── COMPARISON (paper), only where this service has its own rows ── */}
      {comparisonRows && (
        <section className="fn-section fn-paper">
          <div className="fn-container">
            <Reveal className="fn-head">
              <p className="fn-eyebrow" style={{ color: accent }}>EchoPulse vs a generic agency</p>
              <h2 className="fn-h2">The difference, line by <span style={{ color: accent }}>line.</span></h2>
            </Reveal>
            <Reveal>
              <div className="fn-cmp" role="table" aria-label="EchoPulse compared with a generic agency">
                <div className="fn-cmp-row fn-cmp-head" role="row">
                  <div role="columnheader">Feature</div>
                  <div role="columnheader" style={{ color: accent }}>EchoPulse</div>
                  <div role="columnheader">Generic agency</div>
                </div>
                {comparisonRows.map((row) => (
                  <div key={row.feature} className="fn-cmp-row" role="row">
                    <div className="fn-cmp-feature" role="rowheader">{row.feature}</div>
                    <div role="cell">
                      <span className="fn-cmp-mark" style={{ color: accent }} aria-hidden="true">✓</span>
                      <span><span className="svc-sr">EchoPulse: </span>{row.us}</span>
                    </div>
                    <div className="fn-cmp-them" role="cell">
                      <span className="fn-cmp-mark" style={{ color: '#B3412E' }} aria-hidden="true">✕</span>
                      <span><span className="svc-sr">Generic agency: </span>{row.them}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── METHOD (ink) ── */}
      <section data-dark-bg="true" className="fn-section fn-ink">
        <div className="fn-container">
          <Reveal className="fn-head">
            <p className="fn-eyebrow">{`Method: ${service.steps.length} steps, ${service.methodTimeline.toLowerCase()}`}</p>
            <h2 className="fn-h2">From brief to <span style={{ color: accent }}>shipped.</span></h2>
          </Reveal>
          <ol className={`fn-grid fn-grid-${service.steps.length === 4 ? 4 : 3} svc-steps`}>
            {service.steps.map((step, i) => (
              <Reveal as="li" key={step.num} delay={Math.min(i * 0.06, 0.24)}>
                <div className="fn-card">
                  <span className="svc-step-n" style={{ color: accent }}>{ord(i)}</span>
                  <h3 className="fn-h3">{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── PROMISE (cream), closed by the mid-page ask ── */}
      <section className="fn-section fn-cream">
        <div className="fn-container">
          <Reveal className="fn-head">
            <p className="fn-eyebrow" style={{ color: accent }}>Our promise</p>
            <h2 className="fn-h2">If you are not delighted, <span style={{ color: accent }}>you do not pay</span> for the rework.</h2>
            <p className="fn-lead">Four commitments that come with the work, at no extra cost.</p>
          </Reveal>
          <div className="fn-grid fn-grid-4">
            {localizedPromises.map((p, i) => (
              <Reveal key={p.stat} delay={Math.min(i * 0.06, 0.24)}>
                <div className="fn-card svc-promise">
                  <span className="svc-promise-stat" style={{ color: accent }}>{p.stat}</span>
                  <span className="svc-promise-label">{p.statLabel}</span>
                  <h3 className="fn-h3">{p.headline}</h3>
                  <p>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="svc-mid-ask">
              <p className="svc-mid-text">
                {offersFreeEdits ? (
                  <><strong>Judge the work first.</strong> Send footage you already have and get 2 edited videos back within 48 hours, free. No card, no call.</>
                ) : (
                  <><strong>Free 15-minute call.</strong> Lakshya looks at your site and your last few posts and tells you the first three things he would fix, whether or not you hire us.</>
                )}
              </p>
              {primary('mid')}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── GUIDES ── */}
      <GuidesSection
        heading={`Guides on ${service.name.toLowerCase()}`}
        intro="What it costs, how to choose, and how we do it. Sourced and dated."
        guides={guides}
      />

      {/* ── FAQ (cream): native accordions keep every answer in the HTML,
           which is what the page's FAQPage schema describes ── */}
      <section className="fn-section fn-cream">
        <div className="fn-container fn-split">
          <Reveal className="fn-split-sticky">
            <p className="fn-eyebrow" style={{ color: accent }}>{`FAQ: ${service.faq.length} answers`}</p>
            <h2 className="fn-h2">Things to know.</h2>
          </Reveal>
          <div className="fn-faq">
            {service.faq.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary className="svc-faq-toggle">{item.q}</summary>
                <div><p>{item.a}</p></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR YOUR NICHE ── */}
      <NicheLinks mode="service" value={service.slug} />

      {/* ── FINAL ASK (ink) ── */}
      <section id="final-cta" data-dark-bg="true" className="fn-section fn-ink svc-final">
        <div aria-hidden="true" className="svc-wash" style={{ background: `radial-gradient(ellipse 55% 60% at 50% 35%, ${accent}12 0%, ${accent}00 70%)` }} />
        <div className="fn-container">
          <Reveal className="fn-final">
            <h2 className="fn-h2">Let us build this <span style={{ color: accent }}>for you.</span></h2>
            <p className="fn-lead">
              {offersFreeEdits
                ? 'Send footage you already have and get 2 edited videos back within 48 hours, free. No card, no call.'
                : '15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch.'}
            </p>
            <div className="fn-actions">{primary('final')}</div>
            {offersFreeEdits ? altAsk('final') : (
              <p className="fn-alt-ask">
                {PROMISES.noContract} <Link href="/#services">Or see all services</Link>.
              </p>
            )}
          </Reveal>
          <RelatedServices currentSlug={service.slug} />
          <p className="fn-byline">
            Written and reviewed by <Link href="/about/lakshya-soni">Lakshya Soni</Link>, founder. Last updated{' '}
            <time dateTime={PAGES_UPDATED_ISO}>{PAGES_UPDATED_LABEL}</time>.
          </p>
        </div>
      </section>

      {/* Service pages ended at the final band with no footer, the only
          funnel template without the site's links, contact and legal row. */}
      <Footer />

      <style>{FUNNEL_CSS}</style>
      <style>{`
        .svc-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .svc-wash { position: absolute; inset: 0; pointer-events: none; }

        /* Hero */
        .svc-hero { position: relative; overflow: hidden; padding: 152px 0 96px; }
        .svc-hero-grid { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 64px; align-items: center; }
        .svc-h1 { max-width: 15ch; }
        .svc-sub { margin-bottom: 40px; max-width: 34em; }
        .svc-hero-visual { width: 100%; max-width: 460px; justify-self: end; }

        /* Work and proof strips continue the hero's dark field */
        .svc-work { padding: 0 0 96px; }
        .svc-work-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding-top: 48px; border-top: 1px solid rgba(242,238,231,0.14); margin-bottom: 24px; }
        .svc-work-head::before { content: none; }
        .svc-work-h { margin: 0; font-size: 20px !important; line-height: 1.3 !important; font-weight: 800; letter-spacing: -0.015em !important; }
        .svc-work .icp-rail { padding-left: max(56px, calc((100vw - 1088px) / 2)) !important; padding-right: max(56px, calc((100vw - 1088px) / 2)) !important; }
        .svc-work .icp-work-all { display: none; }
        .svc-proof-card { padding: 32px 40px; border-radius: 16px; border: 1px solid rgba(242,238,231,0.14); background: rgba(255,255,255,0.035); }
        .svc-proof-text { margin: 0 0 8px; font-size: 17px; line-height: 1.6; color: rgba(242,238,231,0.78); max-width: 64ch; }

        .svc-sub-rest { margin: 24px 0 0; font-size: 16px; color: #6E6B63; max-width: 40ch; }
        .svc-steps { list-style: none; margin: 0; padding: 0; }
        .svc-step-n { display: block; font-size: 40px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; margin-bottom: 24px; font-variant-numeric: tabular-nums; }

        .svc-promise-stat { display: block; font-size: 40px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; }
        .svc-promise-label { display: block; font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #6E6B63; margin: 12px 0 24px; padding-bottom: 24px; border-bottom: 1px solid rgba(12,12,11,0.12); }
        .svc-promise p { font-size: 15px; }

        .svc-mid-ask { margin-top: 40px; padding: 32px 40px; border-radius: 16px; background: #0C0C0B; color: #F2EEE7; display: flex; align-items: center; justify-content: space-between; gap: 24px 40px; flex-wrap: wrap; }
        .svc-mid-text { margin: 0; font-size: 17px; line-height: 1.55; color: rgba(242,238,231,0.72); max-width: 56ch; }
        .svc-mid-text strong { color: #F2EEE7; display: block; font-size: 20px; margin-bottom: 4px; letter-spacing: -0.01em; }

        .svc .fn .guides-section, .svc .guides-section { background: #F8F5EF !important; }

        .svc-final { overflow: hidden; }
        .svc-final .fn-container { position: relative; z-index: 1; }
        .svc-related { margin-top: 96px; padding-top: 48px; border-top: 1px solid rgba(242,238,231,0.14); }
        .svc-related-card p { flex: 1; margin-bottom: 24px; }
        .svc-related-card .fn-h3 { color: #F2EEE7; }
        .svc-related-dot { width: 10px; height: 10px; border-radius: 50%; margin-bottom: 16px; }
        .svc-related-more { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; }

        .svc-sticky-cta { position: fixed; bottom: 24px; left: 0; right: 0; margin: 0 auto; width: max-content; max-width: calc(100vw - 32px); z-index: 480; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 8px 8px 8px 24px; background: #0C0C0B; border: 1px solid rgba(255,255,255,0.12); border-radius: 999px; box-shadow: 0 16px 48px rgba(12,12,11,0.4); }
        .svc-sticky-text { font-size: 14px; font-weight: 600; color: #F2EEE7; white-space: nowrap; }
        .svc-sticky-btn { min-height: 44px !important; padding: 0 20px !important; font-size: 14px !important; box-shadow: none !important; }

        @media (hover: hover) and (pointer: fine) {
          .svc-faq-toggle { cursor: none; }
        }
        @media (max-width: 1024px) {
          .svc-hero { padding: 136px 0 72px; }
          .svc-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 48px; }
          .svc-hero-visual { justify-self: start; }
          .svc-work .icp-rail { padding-left: 40px !important; padding-right: 40px !important; }
        }
        @media (max-width: 768px) {
          .svc-hero { padding: 112px 0 56px !important; }
          .svc-h1 { font-size: 36px; }
          .svc-sub { margin-bottom: 32px; }
          /* The service mock-ups are dense product UIs whose labels drop to
             7 to 9px at phone width. On a phone the hero ends at the ask and
             the work or deliverables follow straight after. */
          .svc-hero-visual { display: none; }
          .svc-work { padding: 0 0 72px !important; }
          .svc-work-head { padding-top: 40px; }
          .svc-work .icp-rail { padding-left: 24px !important; padding-right: 24px !important; }
          .svc-proof-card { padding: 24px; }
          .svc-step-n { font-size: 32px; margin-bottom: 16px; }
          .svc-mid-ask { padding: 24px; }
          .svc-mid-ask .fn-btn { width: 100%; }
          .svc-related { margin-top: 64px; padding-top: 40px; }
          /* Phones get MobileStickyCTA instead of the floating pill. */
          .svc-sticky-cta { display: none !important; }
        }
        @media (max-width: 374px) {
          .svc-h1 { font-size: 32px; }
          .svc-work .icp-rail { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  );
}
