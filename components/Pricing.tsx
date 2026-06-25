'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGeoPrice } from '@/lib/useGeoPrice';
import { BOOK_CALL_URL } from '@/lib/links';
import { trackPilotClick, trackCallClick } from '@/lib/analytics';

/**
 * Drive the mobile swipe-carousel dots indicator. When the user swipes the
 * .pms-rail, whichever .pms-card is most visible inside the rail gets the
 * active state, and the matching .pms-dot flips on. IntersectionObserver
 * scoped to the rail so we don't fire on unrelated scrolling elsewhere.
 *
 * Runs once on mount, cleans up on unmount. Safe to no-op when the swipe
 * carousel isn't in the DOM (desktop viewport).
 */
function useMobilePricingDots() {
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>('.pricing-mobile-swipe .pms-rail');
    if (!rail) return;
    const cards = Array.from(rail.querySelectorAll<HTMLElement>('.pms-card'));
    const dots = Array.from(document.querySelectorAll<HTMLElement>('.pricing-mobile-swipe .pms-dot'));
    if (!cards.length || !dots.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio.
        let bestIdx = -1;
        let bestRatio = 0;
        entries.forEach(e => {
          const idx = Number((e.target as HTMLElement).dataset.index ?? -1);
          if (e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio;
            bestIdx = idx;
          }
        });
        if (bestIdx >= 0) {
          dots.forEach((d, i) => { d.dataset.active = i === bestIdx ? 'true' : 'false'; });
        }
      },
      { root: rail, threshold: [0.5, 0.7, 0.9] },
    );
    cards.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, []);
}

export default function Pricing() {
  const { currency, prices, countryLabel, ready } = useGeoPrice();
  // (Old `mobileSelectedTier` picker state was removed when the mobile UX
  // changed from a tier-picker row to a horizontal swipe carousel. Cards
  // are equal-weight peers in the carousel — none is "selected" globally.)

  // Desktop-only: which plan card's expanded feature list is open. Cards
  // start collapsed showing the headline benefits; tap the row to expand.
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  // Mobile swipe carousel — update dots indicator from scroll position.
  useMobilePricingDots();

  const plans = [
    {
      tier: 'Pilot',
      price: `${currency}${prices.pilot}`,
      originalPrice: `${currency}${prices.pilotOriginal}`,
      per: 'one-off / 2 weeks',
      badge: `Try us out · ${currency}${prices.pilot}`,
      tagline: 'See real work in 14 days before you sign anything.',
      features: [
        '90-min onboarding interview + brand brief',
        '12 social posts: 8 short-form + 2 story posts + 2 carousels',
        '3 short-form video edits (Reels / TikToks / Shorts / property cuts)',
        '5 long-form blog drafts (1,500 words each, fully researched)',
        'One strategic deliverable: content audit, or a 30-day plan',
        'Curated to the channels your business actually needs',
        '48-hour turnaround per deliverable',
        'Revisions until you are satisfied',
        'Live Loom walkthrough on delivery',
        'No retainer commitment. See the work first.',
      ],
      cta: 'Claim the Pilot',
      featured: true,
    },
    {
      tier: 'Growth',
      price: `${currency}${prices.growth}`,
      per: '/month',
      badge: 'Monthly · Most Popular',
      tagline: 'The retainer most clients pick. One team, every channel, every month.',
      features: [
        'Onboarding interview + quarterly brand-brief refresh',
        '20 social posts per month (5/week — LinkedIn, Instagram, or wherever your buyers are)',
        '4 long-form blogs per month (1,500 to 2,500 words each)',
        '12 short-form video edits + 2 long-form (YouTube, podcast, listing tours)',
        '6 ad creatives per month (static + video)',
        'Full website revamp + ongoing optimization (rebuilt for conversions in month one, tuned monthly after)',
        'Funnel optimization with conversion tracking + A/B tests',
        'Monthly strategy call + 30-day content calendar',
        '48-hour standard turnaround on every deliverable',
        'Performance review with monthly reporting',
        '20% off any custom app or software build (MVPs, dashboards, course platforms, client portals)',
      ],
      cta: 'Book a Call',
      featured: false,
    },
    {
      tier: 'Full System',
      price: `${currency}${prices.full}`,
      per: '/month',
      badge: 'All-in. Fixed scope.',
      tagline: 'For operators going all-in on content. Locked package, no upsells, no scaling tricks.',
      features: [
        'Everything in Growth, scaled',
        'Long-form YouTube editing (vlogs, sponsored content, educational, listing tours)',
        'Podcast editing: full episodes + 8 to 12 highlight cuts each',
        'Course module editing (Kajabi, Teachable, Thinkific, Skool)',
        'Company process optimization (SOPs, workflows, internal automations)',
        '30 social posts + 8 long-form blogs per month',
        'Full ad creative engine across Meta, TikTok, YouTube, Google',
        'Custom website or funnel build each quarter (4 builds/year)',
        'One small custom app build per quarter included (up to $9,997 scope) + 30% off larger app builds',
        'Automation stack setup (Make.com, ManyChat, CRM)',
        'Dedicated account lead + bi-weekly strategy session',
        'Live performance dashboard + monthly reporting',
      ],
      cta: 'Talk to Us',
      featured: false,
    },
  ] as const;

  return (
    <section
      id="pricing"
      style={{
        padding: '64px 56px 72px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5f0e8 0%, #ede8df 40%, #f0e9e0 70%, #ede3d8 100%)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-8%',  left: '-4%',  width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,84,26,0.09) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-8%', right: '-2%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', margin: '0 auto' }}>
        {/* Outer rounded panel — contains headline + cards as one unit */}
        <motion.div
          className="pricing-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'rgba(255,255,255,0.32)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.7)',
            borderRadius: '28px',
            padding: '40px 36px 36px',
            boxShadow: '0 8px 40px rgba(12,12,11,0.04), inset 0 1px 0 rgba(255,255,255,0.95)',
          }}
        >
          <motion.h2
            className="pricing-h2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(28px, 3.4vw, 48px)', fontWeight: 900, letterSpacing: '-1.6px', margin: '0 0 14px', lineHeight: 1.05, color: '#0C0C0B' }}
          >
            Simple pricing. <span style={{ color: '#E8541A' }}>Real work upfront.</span>
          </motion.h2>
          <motion.p
            className="pricing-sub"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ color: '#6E6B63', fontSize: '14px', maxWidth: '620px', lineHeight: 1.6, margin: '0 0 16px' }}
          >
            Owner-operated, with senior eyes on every deliverable.{' '}
            <strong style={{ color: '#0C0C0B', fontWeight: 700 }}>3-hour replies, re-dos until it&apos;s right, and no surprise invoices</strong>
            {' '}— which is why we ship sharper than agencies twice our size,
            and at a fraction of the retainer.
          </motion.p>

          {/* Region indicator */}
          <motion.div
            className="pricing-region"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.85)', borderRadius: '100px', fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.3px', color: '#6E6B63', marginBottom: '28px' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
            Showing {countryLabel}. Same scope worldwide.
          </motion.div>

          {/* ── Mobile-only swipeable pricing carousel ─────────────────
             Reference: workout-analytics card with a BEST VALUE badge,
             big price, green-check feature list, and a single CTA. On
             phone we render full plan cards in a horizontal scroll-snap
             strip with the FEATURED plan (Pilot) first, followed by
             Growth and Full System. User swipes left/right; the next
             card's edge peeks in so they know there's more to see.

             Dots indicator at the bottom shows which card is centered,
             driven by IntersectionObserver attached to each card.

             The old `.pricing-mobile-app` tier-picker row was replaced
             with this layout per user request — single-card focus, no
             tap-to-swap, just swipe-through.
          */}
          <div
            className="pricing-mobile-swipe"
            style={{ display: 'none' /* shown only via @media (max-width: 640px) below */ }}
          >
            <div className="pms-rail" role="region" aria-label="Pricing plans">
              {plans.map((plan, i) => (
                <article
                  key={plan.tier}
                  className="pms-card"
                  data-featured={plan.featured ? 'true' : 'false'}
                  data-index={i}
                  aria-roledescription="slide"
                  aria-label={`${plan.tier} plan ${i + 1} of ${plans.length}`}
                >
                  {plan.featured && (
                    <span className="pms-badge">Best Value</span>
                  )}

                  <h3 className="pms-name">{plan.tier}</h3>

                  <div className="pms-price-row">
                    <span className="pms-price">{plan.price}</span>
                    <span className="pms-per">{plan.per}</span>
                  </div>

                  {plan.tagline && (
                    <p className="pms-tagline">{plan.tagline}</p>
                  )}

                  <ul className="pms-feature-list">
                    {plan.features.slice(0, 6).map((f, j) => (
                      <li key={j} className="pms-feature-row">
                        <span className="pms-check" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        </span>
                        <span className="pms-feature-text">{f}</span>
                      </li>
                    ))}
                    {plan.features.length > 6 && (
                      <li className="pms-feature-more">
                        +{plan.features.length - 6} more in this plan
                      </li>
                    )}
                  </ul>

                  <button
                    type="button"
                    className="pms-cta"
                    data-cursor-hover
                    onClick={() => {
                      trackPilotClick(`pricing_mobile_swipe_${plan.tier.toLowerCase()}`);
                      if (plan.featured) {
                        // Pilot → /order self-serve checkout
                        window.location.href = '/order';
                      } else {
                        trackCallClick(`pricing_mobile_swipe_${plan.tier.toLowerCase()}`);
                        (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
                      }
                    }}
                  >
                    {plan.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>

                  <p className="pms-cta-fine">No card. No contracts. Cancel anytime.</p>
                </article>
              ))}
            </div>

            {/* Dots indicator — visual cue that there are more cards to swipe to.
                Updated by IntersectionObserver in the effect below. */}
            <div className="pms-dots" aria-hidden="true">
              {plans.map((p, i) => (
                <span key={p.tier} className="pms-dot" data-active={i === 0 ? 'true' : 'false'} />
              ))}
            </div>
          </div>

          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.tier}
              className="pricing-card"
              data-featured={plan.featured ? 'true' : 'false'}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              data-cursor-hover
              style={{
                background: plan.featured ? '#0C0C0B' : 'rgba(255,255,255,0.62)',
                backdropFilter: 'blur(28px) saturate(160%)',
                WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                border: plan.featured ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(255,255,255,0.88)',
                borderRadius: '18px',
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: plan.featured
                  ? '0 20px 56px rgba(12,12,11,0.22)'
                  : '0 2px 20px rgba(12,12,11,0.05), inset 0 1px 0 rgba(255,255,255,0.95)',
                cursor: 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: plan.featured ? 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)' : 'linear-gradient(90deg,transparent,rgba(255,255,255,1),transparent)', pointerEvents: 'none' }} />

              {plan.badge && (
                <div
                  className="tier-badge"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    alignSelf: 'flex-start',
                    marginBottom: '14px',
                    // Tier-specific badge treatment so positioning reads at a glance:
                    //  • Pilot   → solid orange (entry / try us)
                    //  • Growth  → solid black w/ orange dot (the default — earns the strongest visual weight)
                    //  • Full    → outlined orange (serious, restrained, fixed scope)
                    background:
                      plan.tier === 'Growth'
                        ? '#0C0C0B'
                        : plan.tier === 'Full System'
                        ? 'transparent'
                        : '#E8541A',
                    color:
                      plan.tier === 'Full System' ? '#E8541A' : '#fff',
                    border:
                      plan.tier === 'Full System'
                        ? '1px solid rgba(232,84,26,0.55)'
                        : '1px solid transparent',
                    padding: '5px 13px',
                    borderRadius: '100px',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    letterSpacing: '1.4px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {plan.tier === 'Growth' && (
                    <span
                      aria-hidden="true"
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#E8541A',
                        boxShadow: '0 0 0 2px rgba(232,84,26,0.22)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {plan.badge}
                </div>
              )}

              <div className="tier-name" style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px', color: plan.featured ? 'rgba(242,238,231,0.38)' : '#6E6B63' }}>
                {plan.tier}
              </div>

              {'tagline' in plan && plan.tagline && (
                <div
                  className="plan-tagline"
                  style={{
                    fontSize: '12.5px',
                    lineHeight: 1.5,
                    color: plan.featured ? 'rgba(242,238,231,0.62)' : '#6E6B63',
                    margin: '0 0 14px',
                    maxWidth: '320px',
                  }}
                >
                  {plan.tagline}
                </div>
              )}

              {/* Price block — single fluid timeline, no dead time:
                  • $599 visible big at price slot (initial)
                  • Strike line draws across WHILE shrink begins (overlap)
                  • Shrink completes as $299 starts fading in (overlap)
                  • Save pill + Limited-time mark fade in last
                  All motions overlap so it reads as one continuous reveal. */}
              {'originalPrice' in plan && plan.originalPrice ? (
                <>
                  {/* Reserved 18px slot — original price renders here, transforms to look big initially */}
                  <div className="tier-original-slot" style={{ height: '18px', marginBottom: '2px', position: 'relative' }}>
                    <motion.div
                      className="tier-original"
                      initial={{ scale: 2.55, y: 24 }}
                      whileInView={{ scale: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.6, delay: 0.55, ease: [0.5, 0, 0.2, 1] }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        display: 'inline-block',
                        fontSize: '14px',
                        fontWeight: 700,
                        letterSpacing: '-0.3px',
                        fontFamily: 'Inter, sans-serif',
                        color: plan.featured ? 'rgba(242,238,231,0.55)' : '#A8A49B',
                        transformOrigin: 'top left',
                        whiteSpace: 'nowrap',
                        willChange: 'transform',
                      }}
                    >
                      {plan.originalPrice}
                      {/* Strike line draws across while $599 is still big (overlaps with shrink start) */}
                      <motion.span
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.32, delay: 0.30, ease: [0.65, 0, 0.35, 1] }}
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: '54%',
                          height: '1.5px',
                          background: '#E8541A',
                          transformOrigin: 'left',
                          pointerEvents: 'none',
                          willChange: 'transform',
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Big discounted price + Save pill — fade in as the shrink finishes */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px', minHeight: '36px' }}>
                    <motion.div
                      className="tier-price"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.5, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '36px',
                        fontWeight: 900,
                        letterSpacing: '-1.5px',
                        lineHeight: 1,
                        color: plan.featured ? '#F2EEE7' : '#0C0C0B',
                        willChange: 'transform, opacity',
                      }}
                    >
                      {plan.price}
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.38, delay: 1.20, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        background: '#E8541A',
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: 800,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '100px',
                        flexShrink: 0,
                        willChange: 'transform, opacity',
                      }}
                    >
                      Save 50%
                    </motion.span>
                  </div>

                  <motion.div
                    className="tier-per"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.4, delay: 1.10, ease: 'easeOut' }}
                    style={{ fontSize: '12px', color: plan.featured ? 'rgba(242,238,231,0.38)' : '#6E6B63', marginBottom: '8px' }}
                  >
                    {plan.per}
                  </motion.div>

                  {/* "For a limited time only" mark — fades in last */}
                  <motion.div
                    className="tier-limited"
                    initial={{ opacity: 0, y: 4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.4, delay: 1.40, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      marginBottom: '20px',
                      background: plan.featured ? 'rgba(232,84,26,0.18)' : 'rgba(232,84,26,0.10)',
                      border: '1px solid rgba(232,84,26,0.32)',
                      borderRadius: '100px',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      color: '#E8541A',
                      alignSelf: 'flex-start',
                    }}
                  >
                    <motion.span
                      animate={{ opacity: [0.45, 1, 0.45] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#E8541A',
                      }}
                    />
                    For a limited time only
                  </motion.div>
                </>
              ) : (
                <>
                  <div className="tier-price" style={{ fontFamily: 'Inter, sans-serif', fontSize: '36px', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '4px', color: plan.featured ? '#F2EEE7' : '#0C0C0B' }}>
                    {plan.price}
                  </div>
                  <div className="tier-per" style={{ fontSize: '12px', color: plan.featured ? 'rgba(242,238,231,0.38)' : '#6E6B63', marginBottom: '20px' }}>
                    {plan.per}
                  </div>
                </>
              )}

              {/* Mobile: compact feature count + tap-to-expand toggle */}
              <button
                className="tier-expand-btn"
                type="button"
                onClick={() => setExpandedPlan(expandedPlan === plan.tier ? null : plan.tier)}
                style={{ display: 'none' /* shown via CSS on mobile */ }}
              >
                <span style={{ color: '#E8541A', fontWeight: 800 }}>✓</span>
                {plan.features.length} included
                <span className="tier-expand-chevron" style={{ marginLeft: 'auto', fontSize: '10px', transition: 'transform 0.2s', display: 'inline-block', transform: expandedPlan === plan.tier ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
              </button>

              <ul
                className={`tier-features${expandedPlan === plan.tier ? ' tier-features-open' : ''}`}
                style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}
              >
                {plan.features.map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', lineHeight: 1.45, color: plan.featured ? 'rgba(242,238,231,0.8)' : '#0C0C0B' }}>
                    <span style={{ color: '#E8541A', fontWeight: 900, flexShrink: 0, fontSize: '11px' }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                className="tier-cta"
                href={BOOK_CALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${plan.cta}, ${plan.tier} plan`}
                onClick={() =>
                  plan.tier === 'Pilot'
                    ? trackPilotClick(`pricing_${plan.tier.toLowerCase().replace(/\s+/g, '_')}`)
                    : trackCallClick(`pricing_${plan.tier.toLowerCase().replace(/\s+/g, '_')}`)
                }
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '100px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'none',
                  transition: 'all 0.3s',
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'center',
                  textDecoration: 'none',
                  background: plan.featured ? '#E8541A' : 'transparent',
                  border: plan.featured ? 'none' : '1.5px solid rgba(12,12,11,0.15)',
                  color: plan.featured ? '#fff' : '#0C0C0B',
                  boxShadow: plan.featured ? '0 6px 24px rgba(232,84,26,0.35)' : 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (plan.featured) { el.style.background = '#d94a14'; }
                  else { el.style.background = '#0C0C0B'; el.style.color = '#F2EEE7'; el.style.borderColor = '#0C0C0B'; }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (plan.featured) { el.style.background = '#E8541A'; }
                  else { el.style.background = 'transparent'; el.style.color = '#0C0C0B'; el.style.borderColor = 'rgba(12,12,11,0.15)'; }
                }}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
          .pricing-grid > * { transform: scale(1) !important; }
        }

        /* ── Mobile pricing: SWIPE CAROUSEL ──────────────────────────
           Reference: workout-analytics card with a BEST VALUE badge,
           big price, green checks, and a single primary CTA. Featured
           plan (Pilot) renders first; user swipes right to reveal
           Growth and Full System. Scroll-snap so each card centres
           cleanly. Dots indicator below shows position in the strip.
        ────────────────────────────────────────────────────────── */
        @media (max-width: 640px) {
          section#pricing { padding: 24px 0 36px !important; }
          section#pricing > div:not(.pricing-mobile-swipe) { padding-left: 12px; padding-right: 12px; }

          /* Swap the layouts: hide the stacked cards + old picker, show the swipe rail. */
          section#pricing .pricing-grid { display: none !important; }
          section#pricing .pricing-mobile-app { display: none !important; }
          section#pricing .pricing-mobile-swipe { display: block !important; padding: 4px 0 8px; }

          /* ── Horizontal scroll rail ── */
          .pms-rail {
            display: flex;
            gap: 14px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding: 8px 16px 18px;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .pms-rail::-webkit-scrollbar { display: none; }

          /* ── Plan card ── */
          .pms-card {
            flex: 0 0 86%;
            max-width: 360px;
            scroll-snap-align: center;
            scroll-snap-stop: always;
            background: #FFFFFF;
            border: 1px solid rgba(12,12,11,0.08);
            border-radius: 22px;
            padding: 22px 20px 22px;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 4px 18px rgba(12,12,11,0.06);
            font-family: Inter, sans-serif;
            color: #0C0C0B;
          }
          /* Featured card — warm amber gradient like the iOS reference card. */
          .pms-card[data-featured="true"] {
            background: linear-gradient(180deg, #FFEACC 0%, #FFCFA0 100%);
            border-color: rgba(232,84,26,0.35);
            box-shadow: 0 14px 36px rgba(232,84,26,0.22), inset 0 1px 0 rgba(255,255,255,0.7);
          }

          .pms-badge {
            display: inline-block;
            align-self: flex-start;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.4px;
            color: #2A56FF;
            background: rgba(42,86,255,0.10);
            padding: 4px 10px;
            border-radius: 100px;
            text-transform: uppercase;
            margin-bottom: 10px;
          }

          .pms-name {
            font-size: 17px;
            font-weight: 700;
            margin: 0 0 8px;
            color: rgba(12,12,11,0.78);
            letter-spacing: -0.2px;
          }

          .pms-price-row {
            display: flex;
            align-items: baseline;
            gap: 6px;
            margin-bottom: 4px;
          }
          .pms-price {
            font-size: 34px;
            font-weight: 800;
            letter-spacing: -1px;
            color: #0C0C0B;
            line-height: 1;
          }
          .pms-per {
            font-size: 12.5px;
            color: rgba(12,12,11,0.55);
            font-weight: 600;
          }

          .pms-tagline {
            font-size: 12.5px;
            color: rgba(12,12,11,0.55);
            margin: 6px 0 16px;
            line-height: 1.45;
          }

          .pms-feature-list {
            list-style: none;
            margin: 0 0 18px;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex: 1;
          }
          .pms-feature-row {
            display: grid;
            grid-template-columns: 20px 1fr;
            gap: 10px;
            align-items: start;
            font-size: 13.5px;
            line-height: 1.4;
            color: rgba(12,12,11,0.84);
          }
          .pms-check {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #22C55E;
            color: #FFFFFF;
            flex-shrink: 0;
            margin-top: 1px;
          }
          .pms-feature-more {
            font-size: 12px;
            color: rgba(12,12,11,0.5);
            font-style: italic;
            padding-left: 30px;
          }

          .pms-cta {
            background: #2A56FF;
            color: #FFFFFF;
            border: none;
            border-radius: 100px;
            padding: 15px 22px;
            font-size: 15px;
            font-weight: 700;
            font-family: Inter, sans-serif;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-height: 50px;
            width: 100%;
            box-shadow: 0 10px 24px rgba(42,86,255,0.32);
          }
          /* Featured card flips the CTA to brand orange so the recommended plan
             reads as the visual primary on its own card. */
          .pms-card[data-featured="true"] .pms-cta {
            background: #E8541A;
            box-shadow: 0 12px 28px rgba(232,84,26,0.42);
          }

          .pms-cta-fine {
            font-size: 11.5px;
            color: rgba(12,12,11,0.5);
            text-align: center;
            margin: 10px 0 0;
          }

          /* ── Dots indicator ── */
          .pms-dots {
            display: flex;
            justify-content: center;
            gap: 7px;
            margin-top: 6px;
          }
          .pms-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: rgba(12,12,11,0.18);
            transition: background 0.2s, width 0.2s;
          }
          .pms-dot[data-active="true"] {
            background: #E8541A;
            width: 22px;
            border-radius: 4px;
          }

          /* ── Tier picker row (top of card) ── */
          .pma-tier-row {
            display: grid;
            grid-template-columns: 1fr 1.12fr 1fr;
            gap: 8px;
            margin-bottom: 18px;
            align-items: stretch;
          }
          .pma-tier-card {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            gap: 4px;
            padding: 14px 8px 12px;
            background: #FFFFFF;
            border: 1px solid rgba(12,12,11,0.08);
            border-radius: 16px;
            cursor: pointer;
            font-family: Inter, sans-serif;
            text-align: center;
            box-shadow: 0 2px 6px rgba(12,12,11,0.03);
            transition: transform 0.18s, box-shadow 0.18s, background 0.18s, border-color 0.18s;
            min-height: 96px;
          }
          .pma-tier-card[data-active="true"] {
            background: linear-gradient(180deg, #FFF4E6 0%, #FFE5C7 100%);
            border-color: rgba(232,84,26,0.55);
            box-shadow: 0 8px 22px rgba(232,84,26,0.18), inset 0 1px 0 rgba(255,255,255,0.6);
            transform: translateY(-2px);
          }
          .pma-tier-card[data-active="true"] .pma-tier-name { color: #0C0C0B; }
          .pma-tier-card[data-active="true"] .pma-tier-price { color: #0C0C0B; }
          .pma-popular-pill {
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            padding: 2px 9px;
            background: #E8541A;
            color: #fff;
            border-radius: 100px;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            white-space: nowrap;
            box-shadow: 0 4px 10px rgba(232,84,26,0.4);
          }
          .pma-tier-name {
            font-size: 12px;
            font-weight: 800;
            color: #6E6B63;
            letter-spacing: -0.2px;
            margin-bottom: 1px;
            line-height: 1;
          }
          .pma-tier-price {
            font-size: 18px;
            font-weight: 900;
            color: #0C0C0B;
            letter-spacing: -0.8px;
            line-height: 1;
          }
          .pma-tier-per {
            font-size: 9.5px;
            color: rgba(110,107,99,0.85);
            font-weight: 500;
            letter-spacing: -0.05px;
          }

          /* ── Benefits panel (below picker) ── */
          .pma-benefits {
            background: #FFFFFF;
            border: 1px solid rgba(12,12,11,0.06);
            border-radius: 20px;
            padding: 18px 16px 16px;
            box-shadow: 0 4px 14px rgba(12,12,11,0.04);
          }
          .pma-benefits-head {
            display: flex;
            align-items: baseline;
            gap: 6px;
            margin-bottom: 14px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(12,12,11,0.06);
          }
          .pma-benefits-label {
            font-size: 11px;
            font-weight: 700;
            color: #6E6B63;
            letter-spacing: 0.2px;
          }
          .pma-benefits-tier {
            font-size: 14px;
            font-weight: 900;
            color: #0C0C0B;
            letter-spacing: -0.3px;
          }
          .pma-feature-list {
            list-style: none;
            padding: 0;
            margin: 0 0 16px;
            display: flex;
            flex-direction: column;
            gap: 9px;
          }
          .pma-feature-row {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 12.5px;
            color: #2A2924;
            line-height: 1.45;
          }
          .pma-check {
            flex-shrink: 0;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: rgba(16,185,129,0.12);
            color: #10b981;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-top: 1px;
          }
          .pma-feature-text { flex: 1; }

          /* ── Sticky bottom CTA ── */
          .pma-cta {
            width: 100%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: linear-gradient(180deg, #F36835 0%, #E8541A 100%);
            color: #fff;
            border: none;
            border-radius: 100px;
            padding: 13px 22px;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 0.1px;
            cursor: pointer;
            font-family: Inter, sans-serif;
            min-height: 48px;
            box-shadow: 0 8px 24px rgba(232,84,26,0.30), inset 0 1px 0 rgba(255,255,255,0.18);
            transition: filter 0.15s, transform 0.15s;
          }
          .pma-cta:active { transform: scale(0.98); }
          .pma-cta:hover { filter: brightness(1.06); }

          .pma-cta-fine {
            margin: 9px 0 0;
            text-align: center;
            font-size: 10.5px;
            color: rgba(110,107,99,0.75);
            font-weight: 500;
          }
        }
        @media (max-width: 380px) {
          .pma-tier-card { padding: 12px 6px 10px; min-height: 90px; }
          .pma-tier-price { font-size: 16.5px; }
          .pma-tier-per { font-size: 9px; }
          .pma-feature-row { font-size: 12px; }
          .pma-benefits { padding: 16px 14px 14px; }
        }

        /* ── Original mobile pricing header — still active to compress
           the eyebrow/headline/region pill above the new app pattern ── */
        @media (max-width: 640px) {

          section#pricing .pricing-panel {
            padding: 14px 14px 10px !important;
            border-radius: 18px !important;
          }
          section#pricing .pricing-h2 {
            font-size: 20px !important;
            letter-spacing: -0.5px !important;
            line-height: 1.1 !important;
            margin-bottom: 6px !important;
          }
          section#pricing .pricing-sub {
            font-size: 11.5px !important;
            line-height: 1.45 !important;
            margin-bottom: 8px !important;
          }
          section#pricing .pricing-region {
            font-size: 9px !important;
            padding: 3px 9px !important;
            gap: 5px !important;
            margin-bottom: 10px !important;
          }

          /* Clean stacked tier cards — visual style modeled on premium
             subscription paywalls (Apple One, Spotify Family, etc.). Three
             rows share rounded outer corners and a unified container. */
          .pricing-grid {
            grid-template-columns: 1fr !important;
            display: grid !important;
            gap: 6px !important;
            overflow: visible !important;
          }

          .pricing-card {
            padding: 20px 18px 18px !important;
            border-radius: 18px !important;
            flex: none !important;
            max-width: none !important;
            position: relative !important;
            border: 1px solid rgba(12,12,11,0.07) !important;
            background: #FAF7F1 !important;
            box-shadow: 0 2px 8px rgba(12,12,11,0.03) !important;
          }
          /* Featured (Pilot) card — dark dominant tier, strong orange ring,
             plays the role of the highlighted "Yearly" tier in the reference */
          .pricing-card[data-featured="true"] {
            background: #0C0C0B !important;
            border: 1.5px solid rgba(232,84,26,0.55) !important;
            box-shadow:
              0 12px 28px rgba(232,84,26,0.18),
              0 0 0 4px rgba(232,84,26,0.10) !important;
          }
          /* Title color on the featured dark card */
          .pricing-card[data-featured="true"] .tier-name,
          .pricing-card[data-featured="true"] .tier-price,
          .pricing-card[data-featured="true"] .plan-tagline,
          .pricing-card[data-featured="true"] .tier-features li {
            color: #F2EEE7 !important;
          }
          .pricing-card[data-featured="true"] .tier-per { color: rgba(242,238,231,0.55) !important; }

          /* Keep the tagline — it's helpful at full card width */
          .pricing-card .plan-tagline {
            display: block !important;
            font-size: 12.5px !important;
            line-height: 1.5 !important;
            margin: 4px 0 12px !important;
          }
          /* Hide the "was X" original price on mobile to reduce noise */
          .pricing-card .tier-original-slot { display: none !important; }
          .pricing-card .tier-limited { display: none !important; }

          /* Top badge — only on featured, cleaner pill */
          .pricing-card .tier-badge {
            display: inline-block !important;
            font-size: 9.5px !important;
            font-weight: 700 !important;
            letter-spacing: 1.2px !important;
            padding: 4px 10px !important;
            margin-bottom: 10px !important;
            white-space: nowrap !important;
            line-height: 1.3 !important;
            border-radius: 100px !important;
            background: rgba(232,84,26,0.18) !important;
            color: #E8541A !important;
            border: 1px solid rgba(232,84,26,0.35) !important;
          }
          .pricing-card[data-featured="true"] .tier-badge {
            background: rgba(232,84,26,0.20) !important;
          }

          /* Tier name — large like a section heading */
          .pricing-card .tier-name {
            font-size: 22px !important;
            font-weight: 900 !important;
            letter-spacing: -0.5px !important;
            margin-bottom: 4px !important;
            text-transform: none !important;
          }
          /* Tagline — single line, smaller */
          .pricing-card .plan-tagline {
            display: block !important;
            font-size: 12px !important;
            line-height: 1.5 !important;
            margin: 0 0 12px !important;
            color: #6E6B63 !important;
          }
          .pricing-card[data-featured="true"] .plan-tagline {
            color: rgba(242,238,231,0.55) !important;
          }

          /* Price row — price + "Save X%" inline like the reference */
          .pricing-card .tier-price {
            font-size: 38px !important;
            font-weight: 900 !important;
            letter-spacing: -1.6px !important;
            line-height: 1 !important;
            margin-bottom: 4px !important;
          }
          .pricing-card .tier-per {
            font-size: 12.5px !important;
            margin-bottom: 16px !important;
          }
          /* Save 50% badge sits beside the price */
          .pricing-card .tier-save {
            display: inline-block !important;
            margin-left: 10px !important;
            padding: 4px 8px !important;
            font-size: 10px !important;
            font-weight: 800 !important;
            letter-spacing: 0.5px !important;
            background: rgba(232,84,26,0.20) !important;
            color: #E8541A !important;
            border-radius: 6px !important;
            vertical-align: middle !important;
          }

          /* Full feature list on mobile — readers scrolling want to see what
             they get before they commit. No collapse, no expand button. */
          .pricing-card .tier-features {
            display: flex !important;
            flex-direction: column !important;
            margin: 0 0 16px !important;
            gap: 8px !important;
          }
          .pricing-card .tier-features li {
            font-size: 13px !important;
            line-height: 1.45 !important;
            gap: 9px !important;
            display: flex !important;
            align-items: flex-start !important;
          }
          .pricing-card .tier-features li span { font-size: 11px !important; }

          /* Hide the expand button — was rendering as an orphan ✓ between
             the price and the feature list since features are now always shown. */
          .pricing-card .tier-expand-btn { display: none !important; }

          /* CTA — pill-shaped, full-width, prominent. Cream pill on dark
             featured card (high contrast), orange pill on cream cards. */
          .pricing-card .tier-cta {
            padding: 14px 20px !important;
            font-size: 14px !important;
            font-weight: 800 !important;
            min-height: 48px !important;
            border-radius: 100px !important;
            letter-spacing: 0.1px !important;
            width: 100% !important;
            justify-content: center !important;
            background: #E8541A !important;
            color: #F2EEE7 !important;
            border: none !important;
            transition: transform 0.2s, background 0.2s !important;
          }
          .pricing-card .tier-cta:active { transform: scale(0.97) !important; }
          .pricing-card[data-featured="true"] .tier-cta {
            background: #F2EEE7 !important;
            color: #0C0C0B !important;
          }

        }

        @media (max-width: 380px) {
          section#pricing { padding: 36px 10px 44px !important; }
          section#pricing .pricing-panel { padding: 18px 10px 16px !important; }
          section#pricing .pricing-h2 { font-size: 20px !important; }
          .pricing-card { padding: 8px 6px 10px !important; }
          .pricing-card .tier-price { font-size: 16px !important; }
          .pricing-card .tier-cta { font-size: 9px !important; padding: 8px 3px !important; }
        }
      `}</style>
    </section>
  );
}
