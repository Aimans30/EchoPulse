'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  { num: '01', name: 'Video Editing',         slug: 'video-editing',         color: '#E8541A', desc: 'Retention-engineered short-form, long-form, and cinematic property reels.', pills: ['Cinematic', 'Short Form', 'Real Estate'] },
  { num: '02', name: 'LinkedIn Ghostwriting', slug: 'linkedin-ghostwriting', color: '#8b5cf6', desc: 'Voice-driven posts your audience replies to. Captured in a 90-min interview.', pills: ['Voice DNA', 'Posts', 'Carousels'] },
  { num: '03', name: 'Blog Production',       slug: 'blog-production',       color: '#f59e0b', desc: 'Long-form content with real research, real sources, and zero AI tells.', pills: ['Long-Form', 'SEO', 'Voice-Matched'] },
  { num: '04', name: 'Ad Creatives',          slug: 'ad-creatives',          color: '#3b82f6', desc: 'Static and video ads on a subscription. Fresh hooks before fatigue hits.', pills: ['Meta', 'TikTok', 'Static + Video'] },
  { num: '05', name: 'Websites & Funnels',    slug: 'websites-funnels',      color: '#10b981', desc: 'Conversion-engineered sites that earn their pixels. Sub-2-second mobile.', pills: ['Websites', 'Funnels', 'Lead Pages'] },
  { num: '06', name: 'Automations',           slug: 'automations',           color: '#E8541A', desc: 'DM flows, email sequences, and CRM glue that catches every lead.', pills: ['Make.com', 'ManyChat', 'CRM'] },
];

/* ──────────────────────────────────────────────────────────
   Service mini-visuals — per-service graphic for each card
   ────────────────────────────────────────────────────────── */
function ServiceMiniVisual({ slug, accent }: { slug: string; accent: string }) {
  switch (slug) {
    case 'video-editing':       return <VideoMini accent={accent} />;
    case 'linkedin-ghostwriting': return <LinkedInMini accent={accent} />;
    case 'blog-production':     return <BlogMini accent={accent} />;
    case 'ad-creatives':        return <AdsMini accent={accent} />;
    case 'websites-funnels':    return <WebsiteMini accent={accent} />;
    case 'automations':         return <AutomationMini accent={accent} />;
    default:                    return null;
  }
}

function VideoMini({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '100%', padding: '0 4px' }}>
      {[
        { h: 70, gradient: '#1c0e00,#3d2005' },
        { h: 100, gradient: '#0a0f1a,#1a2238' },
        { h: 80, gradient: '#001408,#063520' },
      ].map((tile, i) => (
        <div
          key={i}
          className="vid-mini-tile"
          style={{
            flex: 1,
            height: `${tile.h}%`,
            background: `linear-gradient(155deg, ${tile.gradient.split(',').join(',')})`,
            borderRadius: '10px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Top accent bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

          {/* Center play button */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="#0C0C0B" style={{ marginLeft: '1.5px' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      ))}

      <style>{`
        .service-card:hover .vid-mini-tile { transform: translateY(-4px); }
        .service-card:hover .vid-mini-tile:nth-child(2) { transform: translateY(-8px); }
      `}</style>
    </div>
  );
}

function LinkedInMini({ accent }: { accent: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.92)',
        borderRadius: '10px',
        padding: '14px',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(12,12,11,0.85)', width: '70%' }} />
          <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(12,12,11,0.25)', width: '40%', marginTop: '4px' }} />
        </div>
      </div>

      {/* Body lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
        {[100, 88, 72, 50].map((w, i) => (
          <div key={i} style={{ height: '5px', borderRadius: '2px', background: 'rgba(12,12,11,0.15)', width: `${w}%` }} />
        ))}
      </div>

      {/* Engagement row */}
      <div className="li-mini-engage" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '8px', borderTop: '1px solid rgba(12,12,11,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: accent }} />
          <div style={{ width: '18px', height: '5px', borderRadius: '2px', background: 'rgba(12,12,11,0.2)' }} />
        </div>
        <div style={{ width: '22px', height: '5px', borderRadius: '2px', background: 'rgba(12,12,11,0.2)' }} />
        <div style={{ width: '16px', height: '5px', borderRadius: '2px', background: 'rgba(12,12,11,0.2)' }} />
      </div>
    </div>
  );
}

function BlogMini({ accent }: { accent: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.92)',
        borderRadius: '10px',
        padding: '16px 18px',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

      {/* Tag pill */}
      <div
        style={{
          display: 'inline-block',
          fontSize: '7px',
          fontWeight: 800,
          letterSpacing: '1.2px',
          padding: '3px 8px',
          borderRadius: '100px',
          background: `${accent}1c`,
          color: accent,
          marginBottom: '10px',
        }}
      >
        VOICE FOUNDATION
      </div>

      {/* Title */}
      <div style={{ height: '8px', borderRadius: '2px', background: 'rgba(12,12,11,0.8)', width: '85%', marginBottom: '4px' }} />
      <div style={{ height: '8px', borderRadius: '2px', background: 'rgba(12,12,11,0.8)', width: '60%', marginBottom: '12px' }} />

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {[100, 95, 88, 70, 92, 50].map((w, i) => (
          <div key={i} style={{ height: '4px', borderRadius: '2px', background: 'rgba(12,12,11,0.18)', width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function AdsMini({ accent }: { accent: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        height: '100%',
      }}
    >
      {[
        { gradient: '#1c0e00,#3d2005' },
        { gradient: '#0a0a14,#1a1a2e' },
        { gradient: '#001a14,#003d2e' },
        { gradient: '#1a000d,#3d001f' },
      ].map((ad, i) => (
        <div
          key={i}
          className="ad-mini-tile"
          style={{
            position: 'relative',
            background: `linear-gradient(155deg, ${ad.gradient.split(',').join(',')})`,
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
          <div
            style={{
              position: 'absolute',
              bottom: '6px',
              left: '6px',
              right: '6px',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255,255,255,0.25)',
            }}
          />
        </div>
      ))}

      <style>{`
        .service-card:hover .ad-mini-tile:nth-child(1) { transform: scale(1.04); }
        .service-card:hover .ad-mini-tile:nth-child(2) { transform: scale(1.04); transition-delay: 0.05s; }
        .service-card:hover .ad-mini-tile:nth-child(3) { transform: scale(1.04); transition-delay: 0.1s; }
        .service-card:hover .ad-mini-tile:nth-child(4) { transform: scale(1.04); transition-delay: 0.15s; }
      `}</style>
    </div>
  );
}

function WebsiteMini({ accent }: { accent: string }) {
  return (
    <div
      style={{
        background: 'rgba(15,15,20,0.92)',
        borderRadius: '10px',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '7px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {[1, 2, 3].map(i => (
          <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />
        ))}
        <div
          style={{
            flex: 1,
            marginLeft: '8px',
            height: '12px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '14px' }}>
        <div
          style={{
            display: 'inline-block',
            height: '4px',
            width: '40px',
            borderRadius: '2px',
            background: accent,
            marginBottom: '8px',
          }}
        />
        <div style={{ height: '10px', borderRadius: '3px', background: 'rgba(255,255,255,0.85)', width: '90%', marginBottom: '4px' }} />
        <div style={{ height: '10px', borderRadius: '3px', background: 'rgba(255,255,255,0.85)', width: '60%', marginBottom: '12px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '12px' }}>
          {[100, 75, 50].map((w, i) => (
            <div key={i} style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)', width: `${w}%` }} />
          ))}
        </div>

        <div
          style={{
            display: 'inline-block',
            padding: '5px 12px',
            borderRadius: '100px',
            background: accent,
            fontSize: '7px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.5px',
          }}
        >
          Book a Call →
        </div>
      </div>
    </div>
  );
}

function AutomationMini({ accent }: { accent: string }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Connecting lines */}
        <line x1="20" y1="30" x2="50" y2="20" stroke={accent} strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="50" y1="20" x2="80" y2="30" stroke={accent} strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="20" y1="30" x2="50" y2="65" stroke={accent} strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="80" y1="30" x2="50" y2="65" stroke={accent} strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="50" y1="65" x2="50" y2="92" stroke={accent} strokeOpacity="0.6" strokeWidth="0.6" />
      </svg>

      {[
        { x: 20, y: 30, icon: '💬', label: 'DM' },
        { x: 50, y: 20, icon: '🎯', label: 'Qualify' },
        { x: 80, y: 30, icon: '📧', label: 'Email' },
        { x: 50, y: 65, icon: '📅', label: 'Cal' },
        { x: 50, y: 92, icon: '✓',  label: 'Done', primary: true },
      ].map((node, i) => (
        <div
          key={i}
          className="auto-mini-node"
          style={{
            position: 'absolute',
            top: `${node.y}%`,
            left: `${node.x}%`,
            transform: 'translate(-50%, -50%)',
            padding: '5px 9px',
            borderRadius: '8px',
            background: node.primary ? accent : 'rgba(255,255,255,0.06)',
            border: node.primary ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '8px',
            fontWeight: 700,
            color: node.primary ? '#fff' : 'rgba(242,238,231,0.85)',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <span style={{ fontSize: '9px', lineHeight: 1 }}>{node.icon}</span>
          <span>{node.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Services section
   ────────────────────────────────────────────────────────── */
export default function Services() {
  // Apply Shery.js makeMagnet to service cards once the library is loaded.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let attempts = 0;
    let cancelled = false;
    const tryInit = () => {
      if (cancelled) return;
      const Shery = (window as unknown as { Shery?: { makeMagnet?: (sel: string, opts?: Record<string, unknown>) => void } }).Shery;
      if (Shery && typeof Shery.makeMagnet === 'function') {
        try {
          Shery.makeMagnet('.service-magnet', { ease: 'cubic-bezier(0.16,1,0.3,1)', duration: 1 });
        } catch {
          // ignore
        }
      } else if (attempts < 60) {
        attempts++;
        setTimeout(tryInit, 100);
      }
    };
    tryInit();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="services" data-dark-bg="true" style={{ padding: '64px 56px 72px', background: '#0C0C0B', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,84,26,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 1100px) { .services-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 700px)  { .services-grid { grid-template-columns: 1fr !important; } }

        .service-card {
          position: relative;
          padding: 14px 14px 16px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          cursor: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          min-height: 240px;
        }
        .service-card:hover {
          background: rgba(255,255,255,0.045);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-4px);
        }

        .service-card-visual {
          height: 92px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          padding: 10px;
          background: linear-gradient(155deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.06);
        }

        .service-card-num {
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: rgba(242,238,231,0.4);
        }
        .service-card-title {
          font-family: Inter, sans-serif;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.3px;
          color: #F2EEE7;
          margin: 0;
          line-height: 1.15;
          transition: color 0.25s;
        }
        .service-card:hover .service-card-title { color: var(--card-accent, #F2EEE7); }
        .service-card-desc {
          font-size: 11.5px;
          color: rgba(242,238,231,0.55);
          line-height: 1.5;
          margin: 0;
        }
        .service-card-pills {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .service-card-pill {
          font-size: 9px;
          font-weight: 600;
          padding: 2.5px 8px;
          border-radius: 100px;
          background: rgba(255,255,255,0.05);
          color: rgba(242,238,231,0.55);
          letter-spacing: 0.2px;
        }
        .service-card-arrow {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          z-index: 2;
        }
        .service-card:hover .service-card-arrow {
          background: var(--card-accent, #E8541A);
          border-color: var(--card-accent, #E8541A);
          transform: rotate(-45deg);
        }
        .service-card:hover .service-card-arrow svg { stroke: #fff; width: 12px; height: 12px; }

        .service-card-bottom-rule {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--card-accent, #E8541A);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .service-card:hover .service-card-bottom-rule { transform: scaleX(1); }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '28px',
          padding: '36px 32px 32px',
          boxShadow: '0 12px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '32px',
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(28px, 3.4vw, 48px)', fontWeight: 900, letterSpacing: '-1.8px', lineHeight: 1, color: '#F2EEE7', maxWidth: '520px', margin: 0 }}
          >
            Six services. One team.<br />
            <span style={{ color: '#E8541A' }}>Zero</span> AI slop.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ maxWidth: '300px', color: 'rgba(242,238,231,0.45)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}
          >
            Click into any service. Each page shows the workflow, deliverables, and what makes it different.
          </motion.p>
        </div>

        <div className="services-grid">
        {services.map((service, i) => (
          <motion.div
            key={service.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            data-dark-bg="true"
          >
            <Link href={`/services/${service.slug}`} style={{ display: 'block', textDecoration: 'none' }} data-dark-bg="true">
              <div
                className="service-card service-magnet"
                data-dark-bg="true"
                style={{ ['--card-accent' as string]: service.color } as React.CSSProperties}
              >
                {/* Mini visual */}
                <div className="service-card-visual" data-dark-bg="true">
                  <ServiceMiniVisual slug={service.slug} accent={service.color} />
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  <div className="service-card-num">{service.num}</div>
                  <h3 className="service-card-title">{service.name}</h3>
                  <p className="service-card-desc">{service.desc}</p>
                </div>

                {/* Pills */}
                <div className="service-card-pills">
                  {service.pills.map(pill => (
                    <span key={pill} className="service-card-pill">{pill}</span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="service-card-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(242,238,231,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </div>

                {/* Bottom rule reveal on hover */}
                <div className="service-card-bottom-rule" />
              </div>
            </Link>
          </motion.div>
        ))}
        </div>
      </motion.div>
    </section>
  );
}
