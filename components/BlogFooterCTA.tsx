'use client';

import { trackPilotClick, trackCallClick } from '@/lib/analytics';
import { useGeoPrice } from '@/lib/useGeoPrice';

/**
 * Blog post footer CTA — replaces the old static card.
 *
 * The old version: one vague headline ("Want your content to sound like
 * this?"), one soft hedge line ("before you commit to anything monthly"),
 * one button. No price anchor, no concrete deliverables, no secondary path
 * for someone not ready to spend $299 yet. Every lever direct-response copy
 * actually uses was sitting unused.
 *
 * This version applies the same two patterns already proven elsewhere in the
 * codebase rather than inventing new claims:
 *   - Price anchoring: the $599 struck-through original next to $299, same
 *     numbers Pricing.tsx and the Offer schema already use.
 *   - Primary/secondary CTA split: one loud action (the Pilot) plus one quiet
 *     low-friction one (a call), the same pairing MobileStickyCTA uses.
 * The three deliverable lines are trimmed straight from
 * Pricing.tsx's DEFAULT_PILOT_FEATURES, not new copy — nothing here is a
 * claim that isn't already live and sourced somewhere else on the site.
 */
export default function BlogFooterCTA({ category }: { category?: string }) {
  const { currency, prices } = useGeoPrice();

  return (
    <div
      className="blog-footer-cta"
      data-dark-bg="true"
      style={{
        marginTop: '72px',
        borderRadius: '20px',
        background: '#0C0C0B',
        color: '#F2EEE7',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 36px',
      }}
    >
      {/* Single warm highlight, contained by the card's own overflow:hidden —
          the pattern CTABanner already uses. A second nested glow is what
          caused the earlier clipping bug, so this stays the only one. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-15%',
          width: '60%',
          height: '160%',
          background: 'radial-gradient(circle, rgba(232,84,26,0.24) 0%, rgba(232,84,26,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        {/* Eyebrow chip — ties back to the post's own category when there is
            one, same orange-pill language as the cover art. */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(232,84,26,0.14)',
            border: '1px solid rgba(232,84,26,0.35)',
            color: '#F0763F',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: '100px',
            marginBottom: '18px',
          }}
        >
          {category ? `${category} · 14-Day Pilot` : '14-Day Pilot'}
        </div>

        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '26px',
            fontWeight: 800,
            letterSpacing: '-0.6px',
            lineHeight: 1.15,
            marginBottom: '10px',
          }}
        >
          See your brand producing content like this.
        </div>
        <p style={{ color: 'rgba(242,238,231,0.65)', margin: '0 0 24px', fontSize: '15px', lineHeight: 1.6 }}>
          The EchoPulse Pilot puts real, finished work in your hands in 14 days, not a sales deck.
        </p>

        {/* Deliverables — trimmed from Pricing.tsx's DEFAULT_PILOT_FEATURES,
            not new copy. Concrete beats vague: this is what actually lands
            the click, more than the headline does. */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: '9px',
            textAlign: 'left',
          }}
        >
          {[
            '8 short-form videos + 5 long-form SEO blogs, written and edited',
            'A 30-day content plan built around your brand',
            'No retainer. See the work before you commit to anything monthly.',
          ].map((line) => (
            <li key={line} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'rgba(242,238,231,0.85)', lineHeight: 1.5 }}>
              <span style={{ color: '#E8541A', fontWeight: 800, flexShrink: 0 }}>✓</span>
              {line}
            </li>
          ))}
        </ul>

        {/* Price anchor — same $599 → $299 pair Pricing.tsx and the Offer
            schema already show. Loss aversion works, but only because this
            is the site's one real price, not a made-up "discount". */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '10px', marginBottom: '22px' }}>
          <span style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', color: '#F2EEE7' }}>
            {currency}{prices.pilot}
          </span>
          <span style={{ fontSize: '17px', color: 'rgba(242,238,231,0.4)', textDecoration: 'line-through' }}>
            {currency}{prices.pilotOriginal}
          </span>
          <span style={{ fontSize: '13px', color: 'rgba(242,238,231,0.5)' }}>one-time</span>
        </div>

        <button
          type="button"
          onClick={() => {
            // Same routing as the Pricing.tsx Pilot card: straight to the
            // self-serve checkout, not the call modal. The call is the
            // lower-commitment SECONDARY path below, for anyone not ready to
            // buy yet — collapsing both into one button was losing that
            // distinction entirely.
            trackPilotClick('blog_footer');
            window.location.href = '/order';
          }}
          data-cursor-hover
          style={{
            display: 'inline-block',
            background: '#E8541A',
            color: '#fff',
            padding: '15px 32px',
            borderRadius: '100px',
            fontWeight: 700,
            fontSize: '14.5px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 28px rgba(232,84,26,0.28)',
          }}
        >
          Start the {currency}{prices.pilot} Pilot →
        </button>

        <div style={{ marginTop: '14px' }}>
          <button
            type="button"
            onClick={() => {
              trackCallClick('blog_footer_secondary');
              (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
            }}
            data-cursor-hover
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(242,238,231,0.55)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              padding: '6px',
            }}
          >
            Or book a free strategy call first
          </button>
        </div>
      </div>
    </div>
  );
}
