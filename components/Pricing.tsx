'use client';

import { motion } from 'framer-motion';
import { useGeoPrice } from '@/lib/useGeoPrice';
import { BOOK_CALL_URL } from '@/lib/links';

export default function Pricing() {
  const { currency, prices, countryLabel, ready } = useGeoPrice();

  const plans = [
    {
      tier: 'Founder Pilot',
      price: `${currency}${prices.pilot}`,
      originalPrice: `${currency}${prices.pilotOriginal}`,
      per: 'one-off / 2 weeks',
      badge: 'Limited · 50% off',
      features: [
        'Founder interview (90-min recorded session)',
        'Up to 5 LinkedIn posts written in your voice',
        'Up to 5 short-form video edits (Reels / TikToks / Shorts)',
        'Up to 4 long-form blog drafts (1,500 words each, fully researched)',
        'Curated to what your business actually needs',
        '48-hour turnaround per deliverable',
        'Revisions until you are satisfied',
        'Live Loom walkthrough on delivery',
        'No retainer commitment. See the work first.',
      ],
      cta: 'Claim the Pilot',
      featured: false,
    },
    {
      tier: 'Growth',
      price: `${currency}${prices.growth}`,
      per: '/month',
      badge: 'Most Popular',
      features: [
        'Founder interview + quarterly Voice DNA refresh',
        '20 LinkedIn posts per month (5/week)',
        '4 long-form blogs per month (1,500 to 2,500 words each)',
        '12 short-form video edits + 2 long-form (YouTube, podcast highlights)',
        '6 ad creatives per month (static + video)',
        'Website management + quarterly upgrades to your existing site',
        'Funnel optimization with conversion tracking + A/B tests',
        'Monthly strategy call + 30-day content calendar',
        '48-hour standard turnaround on every deliverable',
        'Performance review with monthly reporting',
      ],
      cta: 'Book a Call',
      featured: true,
    },
    {
      tier: 'Full System',
      price: `${currency}${prices.full}`,
      per: '/month',
      badge: 'All-round for any profession',
      features: [
        'Everything in Growth, scaled and unlimited within scope',
        'Long-form YouTube editing (vlogs, sponsored content, educational)',
        'Podcast editing — full episodes + 8 to 12 highlight cuts each',
        'Course module editing (Kajabi, Teachable, Thinkific, Skool)',
        'Skool / Discord community management + moderation support',
        'Company process optimization (SOPs, workflows, internal automations)',
        'Unlimited LinkedIn posts + 8 long-form blogs per month',
        'Full ad creative engine across Meta, TikTok, YouTube, Google',
        'Custom website / funnel build (one per quarter)',
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
            Pilot first. <span style={{ color: '#E8541A' }}>Retainer when ready.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ color: '#6E6B63', fontSize: '13.5px', maxWidth: '620px', lineHeight: 1.6, margin: '0 0 16px' }}
          >
            Founder Pilot is 50% off — <span style={{ textDecoration: 'line-through', color: '#A8A49B' }}>{currency}{prices.pilotOriginal}</span> to <strong style={{ color: '#0C0C0B', fontWeight: 700 }}>{currency}{prices.pilot}</strong> for a limited time while we build out our case studies. Two weeks, a curated mix of LinkedIn posts, a video edit, and a long-form blog plus the founder interview. You decide if it earns a retainer. Cancel anytime.
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
                <div style={{ display: 'inline-block', alignSelf: 'flex-start', marginBottom: '14px', background: '#E8541A', color: '#fff', padding: '3px 11px', borderRadius: '100px', fontSize: '9px', fontWeight: 800, letterSpacing: '1.8px', textTransform: 'uppercase' }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px', color: plan.featured ? 'rgba(242,238,231,0.38)' : '#6E6B63' }}>
                {plan.tier}
              </div>

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

              <button
                onClick={() => (window as any).openBookCallModal && (window as any).openBookCallModal()}
                aria-label={`${plan.cta} — ${plan.tier} plan`}
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
              </button>
            </motion.div>
          ))}
        </div>
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
