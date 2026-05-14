'use client';

import { motion } from 'framer-motion';
import { useGeoPrice } from '@/lib/useGeoPrice';
import { BOOK_CALL_URL } from '@/lib/links';
import { trackPilotClick, trackCallClick } from '@/lib/analytics';

export default function Pricing() {
  const { currency, prices, countryLabel, ready } = useGeoPrice();

  const plans = [
    {
      tier: 'Pilot',
      price: `${currency}${prices.pilot}`,
      originalPrice: `${currency}${prices.pilotOriginal}`,
      per: 'one-off / 2 weeks',
      badge: 'Try us out · $299',
      tagline: 'See real work in 14 days before you sign anything.',
      features: [
        '90-min recorded voice interview (your Voice DNA)',
        '12 LinkedIn posts: 8 short-form + 2 long-form story posts + 2 carousels',
        '3 short-form video edits (Reels / TikToks / Shorts)',
        '5 long-form blog drafts (1,500 words each, fully researched)',
        'One strategic deliverable: voice audit of your last 10 posts, or a 30-day content thesis',
        'Curated to where your business actually needs content',
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
        'Voice interview + quarterly Voice DNA refresh',
        '20 LinkedIn posts per month (5/week)',
        '4 long-form blogs per month (1,500 to 2,500 words each)',
        '12 short-form video edits + 2 long-form (YouTube, podcast highlights)',
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
        'Long-form YouTube editing (vlogs, sponsored content, educational)',
        'Podcast editing: full episodes + 8 to 12 highlight cuts each',
        'Course module editing (Kajabi, Teachable, Thinkific, Skool)',
        'Company process optimization (SOPs, workflows, internal automations)',
        '30 LinkedIn posts + 8 long-form blogs per month',
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
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(28px, 3.4vw, 48px)', fontWeight: 900, letterSpacing: '-1.8px', margin: '0 0 10px', lineHeight: 1, color: '#0C0C0B' }}
          >
            See real work in 14 days for <span style={{ color: '#E8541A' }}>$299.</span><br />
            Decide retainer after.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ color: '#6E6B63', fontSize: '13.5px', maxWidth: '620px', lineHeight: 1.6, margin: '0 0 16px' }}
          >
            We&apos;re running the Pilot <strong style={{ color: '#0C0C0B', fontWeight: 700 }}>at cost</strong> while we build out our first 50 case studies. <span style={{ textDecoration: 'line-through', color: '#A8A49B' }}>{currency}{prices.pilotOriginal}</span> down to <strong style={{ color: '#0C0C0B', fontWeight: 700 }}>{currency}{prices.pilot}</strong> for two weeks of real work: 12 LinkedIn posts, 3 short-form video edits, 5 long-form blogs, the voice interview, and one strategic deliverable. You decide if it earns a retainer. Cancel anytime.
          </motion.p>

          {/* Region indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.85)', borderRadius: '100px', fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.3px', color: '#6E6B63', marginBottom: '28px' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
            Showing {countryLabel}. Same scope worldwide.
          </motion.div>

          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.tier}
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

              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px', color: plan.featured ? 'rgba(242,238,231,0.38)' : '#6E6B63' }}>
                {plan.tier}
              </div>

              {'tagline' in plan && plan.tagline && (
                <div
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
                  <div style={{ height: '18px', marginBottom: '2px', position: 'relative' }}>
                    <motion.div
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
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '36px', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '4px', color: plan.featured ? '#F2EEE7' : '#0C0C0B' }}>
                    {plan.price}
                  </div>
                  <div style={{ fontSize: '12px', color: plan.featured ? 'rgba(242,238,231,0.38)' : '#6E6B63', marginBottom: '20px' }}>
                    {plan.per}
                  </div>
                </>
              )}

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {plan.features.map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', lineHeight: 1.45, color: plan.featured ? 'rgba(242,238,231,0.8)' : '#0C0C0B' }}>
                    <span style={{ color: '#E8541A', fontWeight: 900, flexShrink: 0, fontSize: '11px' }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>

              <a
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

        {/* Add-ons row — sits under the 3 cards, inside the same rounded panel.
           Spun out of Full System so the core tier stays focused on content
           production and ops; community work is its own thing. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            marginTop: '20px',
            padding: '16px 22px',
            background: 'rgba(12,12,11,0.04)',
            border: '1px solid rgba(12,12,11,0.06)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: '#6E6B63',
              flexShrink: 0,
            }}
          >
            Add-ons
          </span>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: '12.5px',
              color: '#0C0C0B',
              lineHeight: 1.55,
            }}
          >
            <strong style={{ fontWeight: 700 }}>Community moderation</strong>
            <span style={{ color: '#6E6B63' }}> · Skool, Discord, or your existing forum · daytime member responses, weekly programming, sentiment reports</span>
          </span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 900,
              color: '#E8541A',
              letterSpacing: '-0.3px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            +{currency}799/mo
          </span>
        </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-grid > * { transform: scale(1) !important; }
        }
      `}</style>
    </section>
  );
}
