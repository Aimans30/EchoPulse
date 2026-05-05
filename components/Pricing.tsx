'use client';

import { motion } from 'framer-motion';

const plans = [
  {
    tier: 'Starter',
    price: '$750',
    per: '/month',
    features: [
      '4 short-form videos/month',
      '1 long-form edit/month',
      'Basic automation setup',
      'Monthly strategy call',
      '48-hour turnaround',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    tier: 'Growth',
    price: '$2,500',
    per: '/month',
    badge: 'Most Popular',
    features: [
      '20 short-form videos/month',
      '4 long-form edits/month',
      'Full automation suite',
      'Personal branding package',
      'Weekly strategy sessions',
      '24-hour turnaround',
      'Lead gen system',
    ],
    cta: 'Book a Call',
    featured: true,
  },
  {
    tier: 'Full System',
    price: 'Custom',
    per: '/month',
    features: [
      'Unlimited video production',
      'Website and funnel builds',
      'Community management',
      'Full lead gen system',
      'Dedicated account team',
      'Priority turnaround',
      'Monthly performance reports',
    ],
    cta: 'Talk to Us',
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      style={{
        padding: '128px 56px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5f0e8 0%, #ede8df 40%, #f0e9e0 70%, #ede3d8 100%)',
      }}
    >
      {/* Soft color blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-8%',  left: '-4%',  width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,84,26,0.10) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-8%', right: '-2%', width: '460px', height: '460px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', top: '35%',  left: '42%',  width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#6E6B63', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
          Investment
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(36px, 4.5vw, 72px)', fontWeight: 900, letterSpacing: '-3px', margin: '0 0 14px', lineHeight: 1.05, color: '#0C0C0B' }}
        >
          Less than one <span style={{ color: '#E8541A' }}>in-house hire.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ color: '#6E6B63', fontSize: '17px', maxWidth: '500px', lineHeight: 1.7, margin: '0 0 72px' }}
        >
          A full team of editors, strategists, and automation specialists for a fraction of what one employee costs.
        </motion.p>

        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'center' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              data-cursor-hover
              style={{
                background: plan.featured
                  ? '#0C0C0B'
                  : 'rgba(255,255,255,0.62)',
                backdropFilter: 'blur(28px) saturate(160%)',
                WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                border: plan.featured
                  ? '1px solid rgba(255,255,255,0.07)'
                  : '1px solid rgba(255,255,255,0.88)',
                borderRadius: '24px',
                padding: '52px 44px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: plan.featured
                  ? '0 32px 80px rgba(12,12,11,0.28)'
                  : '0 4px 32px rgba(12,12,11,0.07), inset 0 1px 0 rgba(255,255,255,0.95)',
                transform: plan.featured ? 'scale(1.025)' : 'scale(1)',
                cursor: 'none',
              }}
            >
              {/* Inner top shine */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: plan.featured ? 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)' : 'linear-gradient(90deg,transparent,rgba(255,255,255,1),transparent)', pointerEvents: 'none' }} />

              {plan.badge && (
                <div style={{ display: 'inline-block', marginBottom: '20px', background: '#E8541A', color: '#fff', padding: '4px 14px', borderRadius: '100px', fontSize: '10px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px', color: plan.featured ? 'rgba(242,238,231,0.38)' : '#6E6B63' }}>
                {plan.tier}
              </div>

              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '58px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1, marginBottom: '6px', color: plan.featured ? '#F2EEE7' : '#0C0C0B' }}>
                {plan.price}
              </div>
              <div style={{ fontSize: '14px', color: plan.featured ? 'rgba(242,238,231,0.38)' : '#6E6B63', marginBottom: '40px' }}>
                {plan.per}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {plan.features.map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', lineHeight: 1.45, color: plan.featured ? 'rgba(242,238,231,0.8)' : '#0C0C0B' }}>
                    <span style={{ color: '#E8541A', fontWeight: 900, flexShrink: 0, fontSize: '13px' }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href="https://echopulse.media"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '16px',
                  borderRadius: '100px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'none',
                  transition: 'all 0.3s',
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'center',
                  textDecoration: 'none',
                  background: plan.featured ? '#E8541A' : 'transparent',
                  border: plan.featured ? 'none' : '1.5px solid rgba(12,12,11,0.15)',
                  color: plan.featured ? '#fff' : '#0C0C0B',
                  boxShadow: plan.featured ? '0 8px 30px rgba(232,84,26,0.4)' : 'none',
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
