'use client';

/**
 * PuneOffering — Pune-only section.
 *
 * Renders ONLY when the IP geolocation lookup places the visitor in Pune
 * (or its metro twin Pimpri-Chinchwad). Surfaces local-market services
 * that don't appear elsewhere on the site:
 *
 *   1. Short-form content shoot — monthly retainer (18-25 reels) +
 *      single-day option (12 reels per shoot)
 *   2. Property shoot — per-listing + a 3-property bundle
 *   3. Pune map + "Custom pitch" CTA for off-menu requests
 *
 * Layout is intentionally tight — headline + subhead + map + all four
 * packages fit one viewport on a 1440-wide laptop so a Pune visitor can
 * see the whole offer without scrolling.
 *
 * Pricing reset 2026-05-30 after Pune market re-check — local studios
 * still anchor ₹50K-80K/mo for the same monthly scope, so our ₹44,999 is
 * defensible AND profitable after the editor + camera op cuts.
 *
 * Booking goes to a Pune-specific Cal.com link that you can swap in
 * lib/links.ts at PUNE_BOOK_URL — for now it falls back to the default.
 */

import { motion } from 'framer-motion';
import { useGeoPrice } from '@/lib/useGeoPrice';
import { BOOK_CALL_URL } from '@/lib/links';
import { trackCallClick } from '@/lib/analytics';

type Pkg = {
  badge: string;
  name: string;
  price: string;
  per: string;
  market: string;       // anchor line — what Pune market typically charges
  bullets: string[];
  cta: string;
  featured?: boolean;
};

const SHORT_FORM_PACKAGES: Pkg[] = [
  {
    badge: 'Best value · Monthly',
    name: 'Short-Form Studio',
    price: '₹44,999',
    per: '/month · starting',
    market: 'Pune studios charge ₹60K–90K/mo for the same scope',
    bullets: [
      '18 – 25 short-form reels per month, fully shot + edited',
      'Two half-day shoots a month at your space or ours',
      'Hook + caption + posting-ready 9:16 / 1:1 / 16:9 cuts',
      'Music, captions, brand graphics baked in',
      '48-hour edit turnaround on every reel',
      'Monthly strategy review + light analytics',
    ],
    cta: 'Lock the studio',
    featured: true,
  },
  {
    badge: 'One-off · Day shoot',
    name: 'Content Day',
    price: '₹15,999',
    per: '/half-day shoot',
    market: 'Solo videographers charge ₹20K–30K for half that volume',
    bullets: [
      '4-hour shoot at your location',
      'Up to 12 finished short-form reels',
      'Cinematic camera + gimbal + lighting kit on-site',
      'Same edit standard as the monthly studio',
      '72-hour delivery, fully edited',
      'No commitment, no retainer math',
    ],
    cta: 'Book one day',
  },
];

const PROPERTY_PACKAGES: Pkg[] = [
  {
    badge: 'Per listing',
    name: 'Property Reel',
    price: '₹9,999',
    per: '/property',
    market: 'Local realtors quote ₹15K–20K for the same combo',
    bullets: [
      '60-second cinematic property reel',
      '15 high-res still photos (interior + exterior)',
      'Drone exterior shot (when accessible)',
      'Vertical + horizontal cuts for WhatsApp + portals',
      '3-day delivery from shoot date',
    ],
    cta: 'Book a property shoot',
  },
  {
    badge: 'Bundle · 3 properties',
    name: 'Realtor Pack',
    price: '₹24,999',
    per: 'flat',
    market: 'Same scope quoted ₹40K–55K à la carte',
    bullets: [
      'Three full Property Reel packages',
      'Same shoot week if locations are within Pune',
      'One shared planning call + shot list',
      '₹8,333 effective per property',
      'Priority editing queue',
    ],
    cta: 'Book the bundle',
    featured: true,
  },
];

function PackageCard({ p, index }: { p: Pkg; index: number }) {
  const onClick = () => {
    trackCallClick(`pune_${p.name.toLowerCase().replace(/\s+/g, '_')}`);
    // Open the booking modal that lives in the layout root.
    // Pune CTAs open the Pune-specific inquiry modal (phone required, no
    // Razorpay path, lands in #pune-onsite + Sales Pipeline · Discovery
    // Call Booked) instead of the generic Cal.com booking modal.
    (window as unknown as { openPuneInquiryModal?: (pkg?: string) => void }).openPuneInquiryModal?.(p.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="pune-card"
      style={{
        position: 'relative',
        background: p.featured
          ? 'linear-gradient(160deg, rgba(232,84,26,0.10), rgba(232,84,26,0.02) 45%, transparent)'
          : 'rgba(255,255,255,0.04)',
        border: p.featured
          ? '1px solid rgba(232,84,26,0.35)'
          : '1px solid rgba(255,255,255,0.10)',
        borderRadius: '18px',
        padding: '22px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: p.featured ? '#E8541A' : 'rgba(255,255,255,0.08)',
          color: p.featured ? '#fff' : 'rgba(242,238,231,0.8)',
          borderRadius: '100px',
          fontSize: '10px',
          fontWeight: 800,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          alignSelf: 'flex-start',
        }}
      >
        {p.badge}
      </div>

      <div>
        <h3 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '20px',
          fontWeight: 900,
          color: '#F2EEE7',
          letterSpacing: '-0.5px',
          margin: '0 0 4px',
        }}>
          {p.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '28px',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-1px',
          }}>
            {p.price}
          </span>
          <span style={{
            fontSize: '12.5px',
            color: 'rgba(242,238,231,0.55)',
            fontWeight: 500,
          }}>
            {p.per}
          </span>
        </div>
        <div style={{
          marginTop: '6px',
          fontSize: '11.5px',
          color: 'rgba(232,84,26,0.85)',
          fontWeight: 600,
          letterSpacing: '-0.1px',
        }}>
          {p.market}
        </div>
      </div>

      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: '2px 0 6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {p.bullets.map((b, i) => (
          <li key={i} style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            fontSize: '13px',
            color: 'rgba(242,238,231,0.78)',
            lineHeight: 1.45,
          }}>
            <span aria-hidden="true" style={{
              flexShrink: 0,
              width: '13px',
              height: '13px',
              borderRadius: '50%',
              background: p.featured ? 'rgba(232,84,26,0.20)' : 'rgba(255,255,255,0.08)',
              color: '#E8541A',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: 900,
              marginTop: '3px',
            }}>
              ✓
            </span>
            {b}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClick}
        data-cursor-hover
        style={{
          marginTop: 'auto',
          width: '100%',
          padding: '12px 18px',
          background: p.featured ? '#E8541A' : 'transparent',
          color: p.featured ? '#fff' : '#F2EEE7',
          border: p.featured ? 'none' : '1px solid rgba(255,255,255,0.20)',
          borderRadius: '11px',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.1px',
          cursor: 'none',
          fontFamily: 'Inter, sans-serif',
          transition: 'background 0.2s, border-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!p.featured) {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)';
          } else {
            (e.currentTarget as HTMLElement).style.background = '#d94a14';
          }
        }}
        onMouseLeave={(e) => {
          if (!p.featured) {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.20)';
          } else {
            (e.currentTarget as HTMLElement).style.background = '#E8541A';
          }
        }}
      >
        {p.cta} →
      </button>
    </motion.div>
  );
}

export default function PuneOffering() {
  const { isPune, ready } = useGeoPrice();

  // Render nothing for non-Pune visitors. We deliberately wait for `ready`
  // so the section doesn't briefly flash for everyone on first paint.
  if (!ready || !isPune) return null;

  const openBookModal = () => {
    trackCallClick('pune_custom_pitch');
    // "Pitch a custom shoot" button preselects the Custom / off-menu option
    // in the Pune inquiry modal (separate from the 4 package buttons above).
    (window as unknown as { openPuneInquiryModal?: (pkg?: string) => void }).openPuneInquiryModal?.('Custom');
  };

  return (
    <section
      id="pune"
      data-dark-bg="true"
      style={{
        // Tighter padding so the whole offer fits inside a single viewport
        // on standard laptops — visitor lands here and sees everything.
        padding: '72px 56px 64px',
        background: 'linear-gradient(160deg, #100f0d 0%, #0c0c0a 50%, #170e07 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient orb */}
      <div style={{
        position: 'absolute',
        top: '-12%',
        right: '-5%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,84,26,0.10) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header row: eyebrow + headline (left)  ·  Pune map (right) ── */}
        <div className="pune-header" style={{
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 14px 6px 10px',
                background: 'rgba(232,84,26,0.10)',
                border: '1px solid rgba(232,84,26,0.30)',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1.6px',
                color: '#E8541A',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#E8541A', boxShadow: '0 0 10px #E8541A',
              }} />
              For Pune · In-person shoots
            </motion.div>

            <motion.h2
              className="pune-h2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(28px, 3.4vw, 44px)',
                fontWeight: 900,
                letterSpacing: '-0.025em',
                lineHeight: 1.05,
                color: '#F2EEE7',
                margin: '0 0 12px',
              }}
            >
              Your space. Our cameras.{' '}
              <span style={{ color: '#E8541A' }}>All in Pune.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              style={{
                fontSize: '14.5px',
                color: 'rgba(242,238,231,0.66)',
                lineHeight: 1.55,
                maxWidth: '540px',
                margin: '0',
              }}
            >
              Pick from four in-person shoots below — local crew, local rates,
              edits the same week, no agency markup and no studio-tier monthly bill.
            </motion.p>
          </div>

          {/* Pune location map — embeds a live Google Maps tile so visitors
              instantly recognize the city. The dark gradient blends it into
              the section without an API key or styling overrides. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="pune-map"
            style={{
              position: 'relative',
              height: '220px',
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid rgba(232,84,26,0.30)',
              boxShadow: '0 14px 60px rgba(232,84,26,0.18)',
            }}
          >
            <iframe
              title="Pune service area map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d242131.0!2d73.7929!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v0"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(0.4) brightness(0.78) saturate(1.1)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Pune pin badge overlay */}
            <div style={{
              position: 'absolute',
              top: 14, left: 14,
              padding: '6px 12px 6px 10px',
              background: 'rgba(12,12,11,0.78)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(232,84,26,0.40)',
              borderRadius: 100,
              color: '#F2EEE7',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              textTransform: 'uppercase',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#E8541A',
                boxShadow: '0 0 8px #E8541A',
              }} />
              Pune · Pimpri-Chinchwad
            </div>
          </motion.div>
        </div>

        {/* ── Two 2-col grids stacked, compact ────────────────────────── */}
        <div style={{ marginBottom: '24px' }}>
          <SectionLabel index="01" label="Short-form content shoots" />
          <div className="pune-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '14px',
          }}>
            {SHORT_FORM_PACKAGES.map((p, i) => (
              <PackageCard key={p.name} p={p} index={i} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <SectionLabel index="02" label="Property shoots for realtors" />
          <div className="pune-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '14px',
          }}>
            {PROPERTY_PACKAGES.map((p, i) => (
              <PackageCard key={p.name} p={p} index={i} />
            ))}
          </div>
        </div>

        {/* ── Custom pitch + outside-Pune callout (combined row) ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          style={{
            marginTop: '24px',
            padding: '20px 24px',
            background: 'linear-gradient(120deg, rgba(232,84,26,0.08), rgba(255,255,255,0.03))',
            border: '1px solid rgba(232,84,26,0.22)',
            borderRadius: '18px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: '20px',
          }}
          className="pune-custom"
        >
          <div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 16,
              fontWeight: 800,
              color: '#F2EEE7',
              marginBottom: 4,
              letterSpacing: '-0.25px',
            }}>
              Something off-menu? Let&rsquo;s scope it together.
            </div>
            <div style={{
              fontSize: 13.5,
              color: 'rgba(242,238,231,0.7)',
              lineHeight: 1.5,
            }}>
              Wedding teaser · launch event film · founder docu-style · custom property bundles
              · multi-month retainers — 15-minute call, no scripts, real pricing on the line.
              <span style={{ color: 'rgba(242,238,231,0.45)', marginLeft: 6 }}>
                Outside Pune but inside Maharashtra? Same packages, travel quoted before the shoot.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={openBookModal}
            data-cursor-hover
            style={{
              padding: '13px 22px',
              background: '#E8541A',
              border: 'none',
              color: '#fff',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 0.2,
              cursor: 'none',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 28px rgba(232,84,26,0.38)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#d94a14'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8541A'; }}
          >
            Pitch a custom shoot →
          </button>
          <a
            href={BOOK_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'none' }}
            aria-hidden="true"
          >
            fallback link
          </a>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1060px) {
          .pune-header { grid-template-columns: 1fr !important; gap: 22px !important; }
          .pune-map { height: 190px !important; }
        }
        @media (max-width: 860px) {
          #pune { padding: 56px 22px !important; }
          .pune-grid { grid-template-columns: 1fr !important; }
          .pune-h2 { font-size: clamp(24px, 6vw, 36px) !important; }
          .pune-custom { grid-template-columns: 1fr !important; }
          .pune-custom button { width: 100%; }
        }
        @media (max-width: 480px) {
          #pune { padding: 48px 16px !important; }
          .pune-map { height: 160px !important; }
        }
      `}</style>
    </section>
  );
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        fontWeight: 800,
        letterSpacing: '2px',
        color: 'rgba(232,84,26,0.7)',
      }}>
        {index}
      </span>
      <span style={{
        width: '22px',
        height: '1px',
        background: 'rgba(232,84,26,0.5)',
      }} />
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        fontWeight: 700,
        color: '#F2EEE7',
        letterSpacing: '-0.2px',
      }}>
        {label}
      </span>
    </motion.div>
  );
}
