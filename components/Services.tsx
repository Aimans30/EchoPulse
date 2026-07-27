'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MessageCircle,
  Target,
  Check,
  Clapperboard,
  PenLine,
  FileText,
  Globe,
  Settings,
  Code,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

/**
 * Per-service Lucide icon for the compact mobile tile list. Keyed by slug
 * so the rendering is data-driven and adding a new service is one line.
 */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  'video-editing':         Clapperboard,
  'linkedin-ghostwriting': PenLine,
  'blog-production':       FileText,
  'ad-creatives':          Target,
  'websites-funnels':      Globe,
  'automations':           Settings,
  'apps-software':         Code,
};

const services = [
  { num: '01', name: 'Video Editing',         slug: 'video-editing',         color: '#E8541A', desc: 'Retention-engineered short-form, long-form, brand films, and cinematic property reels.', pills: ['Cinematic', 'Short Form', 'Real Estate'] },
  { num: '02', name: 'LinkedIn & Social',     slug: 'linkedin-ghostwriting', color: '#8b5cf6', desc: 'Posts, carousels, and captions your buyers actually stop scrolling for. Written, scheduled, shipped.', pills: ['Posts', 'Carousels', 'Captions'] },
  { num: '03', name: 'Blog Production',       slug: 'blog-production',       color: '#f59e0b', desc: 'Long-form content with real research, real sources, ranks on Google, zero AI tells.', pills: ['Long-Form', 'SEO', 'Researched'] },
  { num: '04', name: 'Ad Creatives',          slug: 'ad-creatives',          color: '#3b82f6', desc: 'Static and video ads on a subscription. Fresh hooks before fatigue kills your CPA.', pills: ['Meta', 'TikTok', 'Static + Video'] },
  { num: '05', name: 'Websites & Funnels',    slug: 'websites-funnels',      color: '#10b981', desc: 'Conversion-engineered sites that earn their pixels. Sub-2-second mobile load.', pills: ['Websites', 'Funnels', 'Lead Pages'] },
  { num: '06', name: 'Automations',           slug: 'automations',           color: '#E8541A', desc: 'DM flows, email sequences, and CRM glue that catches every lead while you sleep.', pills: ['Make.com', 'ManyChat', 'CRM'] },
  { num: '07', name: 'Apps & Software',       slug: 'apps-software',         color: '#06b6d4', desc: 'Custom MVPs, immersive 3D Three.js websites, AI tools, client portals. Fixed price, code you own.', pills: ['MVPs', 'Three.js 3D', 'AI Tools'] },
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
    case 'apps-software':       return <AppsMini accent={accent} />;
    default:                    return null;
  }
}

function VideoMini({ accent }: { accent: string }) {
  // A single clean video preview with a timeline scrub bar below.
  // The scrub bar has edit-cut markers and a playhead that animates across.
  // That whole composition reads as "video editing" the moment you see it.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: '100%', padding: '0 4px' }}>
      {/* Video preview frame */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(155deg, #1c0e00 0%, #2a1a08 50%, #3d2005 100%)',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          minHeight: '40px',
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

        {/* Play button center */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '22px', height: '22px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
        }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="#0C0C0B" style={{ marginLeft: '1.5px' }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Timecode top-right corner */}
        <div style={{
          position: 'absolute', top: '5px', right: '6px',
          fontSize: '6.5px', fontWeight: 700,
          color: 'rgba(255,255,255,0.55)',
          fontFamily: 'ui-monospace, Menlo, monospace',
          letterSpacing: '0.5px',
        }}>
          00:42
        </div>
      </div>

      {/* Timeline scrubber with edit-cut markers */}
      <div style={{
        position: 'relative',
        height: '12px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Edit cut markers — vertical lines at 4 spots */}
        {[18, 38, 58, 78].map((pos) => (
          <div key={pos} style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: `${pos}%`,
            width: '1px',
            background: 'rgba(255,255,255,0.18)',
          }} />
        ))}
        {/* Played progress fill */}
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0, left: 0,
          background: `linear-gradient(90deg, ${accent}88, ${accent})`,
          borderRadius: '4px 0 0 4px',
          animation: 'vid-mini-scrub 4.5s ease-in-out infinite',
        }} />
        {/* Playhead dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          width: '8px', height: '8px',
          borderRadius: '50%',
          background: '#fff',
          boxShadow: `0 0 0 2px ${accent}, 0 0 8px ${accent}`,
          transform: 'translate(-50%,-50%)',
          animation: 'vid-mini-playhead 4.5s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes vid-mini-scrub {
          0% { width: 8%; }
          50% { width: 72%; }
          100% { width: 8%; }
        }
        @keyframes vid-mini-playhead {
          0% { left: 8%; }
          50% { left: 72%; }
          100% { left: 8%; }
        }
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
        ON-BRAND
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
  // Clean 3-row stack: lead arrives → AI qualifies → call booked.
  // Reads top-to-bottom like a real automation log. A check icon fills in
  // on each row in sequence, like watching the system tick through.
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '5px',
        padding: '4px 6px',
        overflow: 'hidden',
      }}
    >
      {[
        { label: 'New lead in', Icon: MessageCircle as LucideIcon, delay: '0s' },
        { label: 'Qualified',   Icon: Target         as LucideIcon, delay: '1.2s' },
        { label: 'Call booked', Icon: Check          as LucideIcon, delay: '2.4s' },
      ].map((row, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            background: 'rgba(255,255,255,0.045)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Status dot — fades to brand color in sequence */}
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: accent,
            opacity: 0,
            animation: `auto-row-tick-${i} 3.6s ease-in-out ${row.delay} infinite`,
            flexShrink: 0,
          }} />
          {/* Icon */}
          <row.Icon size={11} color="rgba(242,238,231,0.7)" strokeWidth={2} aria-hidden="true" />
          {/* Label */}
          <span style={{
            fontSize: '9px',
            fontWeight: 600,
            color: 'rgba(242,238,231,0.78)',
            letterSpacing: '-0.1px',
          }}>
            {row.label}
          </span>
        </div>
      ))}

      {/* Single set of keyframes used by all rows with staggered delay */}
      <style>{`
        @keyframes auto-row-tick-0 { 0%,8% { opacity: 0 } 12%,80% { opacity: 1 } 92%,100% { opacity: 0 } }
        @keyframes auto-row-tick-1 { 0%,8% { opacity: 0 } 12%,80% { opacity: 1 } 92%,100% { opacity: 0 } }
        @keyframes auto-row-tick-2 { 0%,8% { opacity: 0 } 12%,80% { opacity: 1 } 92%,100% { opacity: 0 } }
      `}</style>
    </div>
  );
}

function AppsMini({ accent }: { accent: string }) {
  // Stylized browser window — code lines on top, working app dashboard
  // beneath, with a soft pulse on the primary "deploy" pill. Signals
  // "we ship code that becomes a working product."
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '92%',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 8px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
          <span
            style={{
              marginLeft: '8px',
              fontSize: '7px',
              fontFamily: 'ui-monospace, Menlo, monospace',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.4px',
            }}
          >
            app.yourbrand.com
          </span>
        </div>

        {/* App body — sidebar + main */}
        <div style={{ display: 'flex', flex: 1, gap: '6px', padding: '8px' }}>
          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '24%' }}>
            {[1, 0.55, 0.55, 0.55].map((opacity, i) => (
              <div
                key={i}
                style={{
                  height: '6px',
                  borderRadius: '2px',
                  background: i === 0 ? accent : 'rgba(255,255,255,0.12)',
                  opacity,
                }}
              />
            ))}
          </div>

          {/* Main panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div
              style={{
                height: '7px',
                width: '60%',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.22)',
              }}
            />
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ flex: 1, height: '20px', borderRadius: '4px', background: `linear-gradient(135deg, ${accent}30, ${accent}10)`, border: `1px solid ${accent}40` }} />
              <div style={{ flex: 1, height: '20px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }} />
            </div>
            <div style={{ height: '4px', width: '85%', borderRadius: '2px', background: 'rgba(255,255,255,0.10)' }} />
            <div style={{ height: '4px', width: '70%', borderRadius: '2px', background: 'rgba(255,255,255,0.08)' }} />

            {/* Pulsing deploy pill */}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <div
                className="apps-mini-pill"
                style={{
                  fontSize: '7px',
                  fontWeight: 800,
                  padding: '3px 7px',
                  borderRadius: '100px',
                  background: accent,
                  color: '#fff',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  boxShadow: `0 0 0 0 ${accent}80`,
                  animation: 'apps-mini-pulse 1.8s ease-in-out infinite',
                }}
              >
                Deployed
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes apps-mini-pulse {
            0%, 100% { box-shadow: 0 0 0 0 ${accent}80; }
            50%      { box-shadow: 0 0 0 8px ${accent}00; }
          }
        `}</style>
      </div>
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
    // Shery.js is loaded desktop-only, and makeMagnet is a cursor-proximity
    // effect that a finger cannot trigger. Without this guard every phone ran
    // 60 polls over 6 seconds for a library that is never coming, waking the
    // main thread 60 times during the most latency-sensitive part of the visit.
    if (window.matchMedia('(pointer: coarse)').matches) return;
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
        @media (max-width: 700px)  { .services-grid { grid-template-columns: repeat(2, 1fr) !important; } }

        /* The 7th service (Apps & Software) is the newest offering — promote
           it to a full-width "featured" card so the last row of the grid
           reads as intentional instead of an orphan. */
        .service-card-wide { grid-column: 1 / -1; }
        .service-card-wide .service-card-visual {
          /* On the wide card the visual sits beside the copy, not above. */
          aspect-ratio: 16 / 7;
          max-height: 220px;
        }

        .service-card {
          position: relative;
          padding: 14px 14px 16px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          min-height: 240px;
        }
        /* Hiding the pointer is only meaningful where the custom cursor runs. */
        @media (hover: hover) and (pointer: fine) {
          .service-card { cursor: none; }
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

        /* ── Mobile responsiveness ─────────────────────────────────── */
        @media (max-width: 900px) {
          #services { padding: 56px 24px 64px !important; }
          .services-shell { padding: 28px 20px 24px !important; border-radius: 22px !important; }
          .services-head { gap: 20px !important; margin-bottom: 24px !important; }
          .services-head h2 { font-size: 34px !important; letter-spacing: -1.2px !important; max-width: none !important; }
          /* Was 12.5px, i.e. SMALLER on a tablet than on desktop (13px inline).
             Type should get bigger as the reading distance shortens, not
             smaller. Phones hide this paragraph entirely below 700px. */
          .services-head p { max-width: none !important; font-size: 14.5px !important; line-height: 1.65 !important; }
        }
        @media (max-width: 700px) {
          #services { padding: 40px 0 48px !important; }
          .services-shell { padding: 16px 14px 16px !important; border-radius: 18px !important; margin: 0 12px !important; }
          .services-head { margin-bottom: 16px !important; gap: 8px !important; padding: 0 4px !important; }
          .services-head h2 { font-size: 22px !important; letter-spacing: -0.8px !important; line-height: 1.08 !important; }
          .services-head p { display: none !important; }
          /* Hide desktop grid, show mobile list */
          .services-grid { display: none !important; }
          .svc-mobile-list { display: flex !important; gap: 8px !important; }
          /* Fixed height clipped the label as soon as it wrapped; min-height
             keeps the 44px+ target and lets a long name breathe. */
          .svc-mobile-tile { height: auto !important; min-height: 56px !important; }
          .svc-mobile-tile-name { font-size: 15px !important; line-height: 1.25 !important; }
        }
        @media (max-width: 380px) {
          .services-head h2 { font-size: 20px !important; }
          .svc-mobile-tile { min-height: 54px !important; padding: 10px 12px !important; gap: 10px !important; }
          .svc-mobile-tile-name { font-size: 14.5px !important; }
        }
        /* Desktop: hide mobile list */
        .svc-mobile-list { display: none; }
        .services-swipe-cue { display: none; }
      `}</style>

      <motion.div
        className="services-shell"
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
          className="services-head"
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
            Seven services. One team.<br />
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
            // The 7th card (Apps & Software) spans full row — featured slot.
            className={service.slug === 'apps-software' ? 'service-card-wide' : undefined}
          >
            <Link
              href={`/services/${service.slug}`}
              style={{ display: 'block', textDecoration: 'none' }}
              data-dark-bg="true"
            >
              <div
                className="service-card service-magnet"
                data-dark-bg="true"
                style={{ ['--card-accent' as string]: service.color } as React.CSSProperties}
              >
                {/* Mobile-only icon — RAW inline SVG (no Lucide React).
                   Bypasses every cascade / Lucide-wrapping issue. The
                   service-card-mobile-icon container is shown only at
                   ≤640px via CSS, so this is mobile-only. */}
                <div
                  className="service-card-mobile-icon"
                  aria-hidden="true"
                  style={{ background: `${service.color}22`, border: `1px solid ${service.color}44` }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={service.color}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ display: 'block' }}
                  >
                    {service.slug === 'video-editing'         && <><rect x="2" y="2" width="20" height="20" rx="2.5" ry="2.5" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /></>}
                    {service.slug === 'linkedin-ghostwriting' && <><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></>}
                    {service.slug === 'blog-production'       && <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /></>}
                    {service.slug === 'ad-creatives'          && <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>}
                    {service.slug === 'websites-funnels'      && <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>}
                    {service.slug === 'automations'           && <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>}
                    {service.slug === 'apps-software'         && <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>}
                  </svg>
                </div>

                {/* Mini visual — hidden on mobile */}
                <div className="service-card-visual" data-dark-bg="true">
                  <ServiceMiniVisual slug={service.slug} accent={service.color} />
                </div>

                {/* Content */}
                <div className="service-card-content" style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
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

                {/* Arrow — desktop uses the up-right arrow as before;
                    mobile CSS swaps it for a chevron pill. */}
                <div className="service-card-arrow">
                  <svg className="svc-arrow-up" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(242,238,231,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                  {/* Mobile arrow — raw SVG so nothing in Lucide React's
                     internals can hide it. The wrapper class flips visibility
                     between desktop and mobile via CSS. */}
                  <svg
                    className="svc-arrow-mobile"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(242,238,231,0.7)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ display: 'block' }}
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>

                {/* Bottom rule reveal on hover */}
                <div className="service-card-bottom-rule" />
              </div>
            </Link>
          </motion.div>
        ))}
        </div>

        {/* Mobile-only list — completely separate from desktop grid, zero CSS conflict */}
        <div
          className="svc-mobile-list"
          style={{
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.slug];
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    height: '56px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxSizing: 'border-box',
                  }}
                  className="svc-mobile-tile"
                >
                  {/* Icon box */}
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '9px',
                      background: `${service.color}22`,
                      border: `1px solid ${service.color}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {Icon && <Icon size={16} color={service.color} strokeWidth={2} aria-hidden="true" />}
                  </div>

                  {/* Name */}
                  <span
                    className="svc-mobile-tile-name"
                    style={{
                      flex: 1,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 800,
                      color: '#F2EEE7',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {service.name}
                  </span>

                  {/* Arrow */}
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '100px',
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(242,238,231,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
