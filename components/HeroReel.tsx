'use client';

import Link from 'next/link';
import { videos } from '@/lib/videos';

/**
 * Hero visual: a real edit playing, plus the one number the studio can prove.
 *
 * Replaced the orbital "system map" graphic (Nov 2026). Buyers asked the
 * same thing in every review: "show me the work". So the right column of the
 * hero now plays one of the studio's own vertical edits, muted and looping,
 * with the MagicBNB case-study number underneath it. Both are checkable:
 * the clip is in the portfolio below and the number links to the case study,
 * which publishes the Search Console export it comes from.
 *
 * Picks the first vertical clip that is a direct .mp4 (player embeds cannot
 * autoplay inline). Hidden on phones by the existing `.hero-right` rule, where
 * the mobile hero shows its own trust strip instead.
 */
const REEL =
  videos.find((v) => v.orientation === 'vertical' && v.url.endsWith('.mp4')) ??
  videos.find((v) => v.url.endsWith('.mp4'));

export default function HeroReel() {
  return (
    <div className="hero-reel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div
        className="hero-reel-frame"
        style={{
          width: 250,
          aspectRatio: '9 / 16',
          borderRadius: 28,
          overflow: 'hidden',
          background: '#0C0C0B',
          border: '1px solid rgba(12,12,11,0.12)',
          boxShadow: '0 30px 80px rgba(12,12,11,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
          position: 'relative',
        }}
      >
        {REEL ? (
          <video
            src={REEL.url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${REEL.label}: a short-form edit by EchoPulse`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : null}
        <span
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            padding: '4px 9px',
            borderRadius: 100,
            background: 'rgba(12,12,11,0.65)',
            color: '#F2EEE7',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          Cut by Lakshya
        </span>
      </div>

      <Link
        href="/case-studies/magicbnb-seo-aeo"
        data-cursor-hover
        style={{
          display: 'block',
          width: 300,
          padding: '12px 14px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.85)',
          boxShadow: '0 8px 30px rgba(12,12,11,0.06)',
          textDecoration: 'none',
          color: '#0C0C0B',
        }}
      >
        <span style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: '#6E6B63', marginBottom: 4 }}>
          Case study: MagicBNB
        </span>
        <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 900, letterSpacing: '-0.6px', lineHeight: 1.1 }}>
          5.8 <span aria-hidden="true">&rarr;</span> 1,574 <span style={{ fontSize: 13, fontWeight: 600, color: '#6E6B63' }}>daily Google impressions</span>
        </span>
        <span style={{ display: 'block', fontSize: 12, color: '#6E6B63', marginTop: 3 }}>
          April to August average, best day 2,398. Real export inside <span style={{ color: '#E8541A', fontWeight: 700 }}>&rarr;</span>
        </span>
      </Link>
    </div>
  );
}
