'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clapperboard,
  PenLine,
  FileText,
  Target,
  Globe,
  Settings,
  Mic,
  ClipboardList,
  Wrench,
  Eye,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { BOOK_CALL_LABEL_LONG } from '@/lib/links';
import { trackPilotClick, trackCallClick } from '@/lib/analytics';

type Service = { Icon: LucideIcon; name: string; tag: string; color: string };
type FlowStep = { n: string; Icon: LucideIcon; label: string; sub: string; color: string };

const services: Service[] = [
  { Icon: Clapperboard, name: 'Video Editing',         tag: 'Cinematic + Short-form', color: '#E8541A' },
  { Icon: PenLine,      name: 'LinkedIn & Social',     tag: 'Posts, carousels, copy', color: '#8b5cf6' },
  { Icon: FileText,     name: 'Blog Production',       tag: 'Long-form, SEO-built',   color: '#f59e0b' },
  { Icon: Target,       name: 'Ad Creatives',          tag: 'Meta · TikTok · Google', color: '#3b82f6' },
  { Icon: Globe,        name: 'Websites & Funnels',    tag: 'Conversion-engineered',  color: '#10b981' },
  { Icon: Settings,     name: 'Automations',           tag: 'Make · ManyChat · CRM',  color: '#E8541A' },
];

const flow: FlowStep[] = [
  { n: '01', Icon: Mic,           label: 'Discovery Call',    sub: 'We learn your business, audience, and offer', color: '#E8541A' },
  { n: '02', Icon: ClipboardList, label: 'Strategy & Brief',  sub: 'Topics, calendar, success metrics',           color: '#f59e0b' },
  { n: '03', Icon: Wrench,        label: 'We Produce',        sub: 'Video, content, ads, sites, software',        color: '#8b5cf6' },
  { n: '04', Icon: Eye,           label: 'You Review',        sub: 'Revisions until you are satisfied',           color: '#3b82f6' },
  { n: '05', Icon: Rocket,        label: 'Ship & Refine',     sub: 'Performance review, iterate monthly',         color: '#10b981' },
];

/* ──────────────────────────────────────────────────────────
   InteractiveGraphic — orbital system map
   Replaces the old tab panel with a living motion graphic
   that surfaces ALL services + workflow + stats in one view.
   ────────────────────────────────────────────────────────── */
/**
 * Build an SVG path between two points. When `amplitude` > 0 the path becomes
 * a sine wave that tapers smoothly to zero at both endpoints (so it joins the
 * core circle and the service node cleanly with no kink). Phase is animated
 * externally so the wave appears to travel down the line.
 */
function buildLinePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  phase: number,
  amplitude: number,
) {
  if (amplitude <= 0.05) return `M ${x1.toFixed(4)} ${y1.toFixed(4)} L ${x2.toFixed(4)} ${y2.toFixed(4)}`;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const ux = dx / len;
  const uy = dy / len;
  // Perpendicular unit vector
  const px = -uy;
  const py = ux;
  const segments = 28;
  let d = `M ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    // sin(πt) tapers to 0 at both ends — wave is biggest in the middle of the line
    const taper = Math.sin(t * Math.PI);
    const offset = Math.sin(t * Math.PI * 4 + phase) * amplitude * taper;
    const x = x1 + ux * len * t + px * offset;
    const y = y1 + uy * len * t + py * offset;
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

function InteractiveGraphic() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [angle, setAngle] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [wavePhase, setWavePhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Continuous orbit rotation — pauses when user hovers a node OR when the
  // user prefers reduced motion (a11y + battery saver on mobile).
  useEffect(() => {
    if (hovered !== null) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      setAngle((a) => (a + dt * 0.006) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovered]);

  // Wave-phase animation — only ticks while a service node is hovered.
  // Drives the sine wave that travels along the connection line. Also
  // skipped under prefers-reduced-motion.
  useEffect(() => {
    if (hovered === null) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      setWavePhase((p) => p + dt * 0.014);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovered]);

  // Mouse parallax tilt
  const onMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: nx * 10, y: ny * 10 });
  };
  const onLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(null);
  };

  const SIZE = 420;
  const center = SIZE / 2;
  const innerR = 132;  // service orbit radius
  const outerR = 188;  // workflow ring radius

  const r4 = (n: number) => Math.round(n * 1e4) / 1e4;

  const servicePositions = services.map((_, i) => {
    const a = ((i / services.length) * 360 + angle) * (Math.PI / 180);
    return { x: r4(center + Math.cos(a) * innerR), y: r4(center + Math.sin(a) * innerR) };
  });

  const flowPositions = flow.map((_, i) => {
    // Counter-rotate slower + offset so workflow waypoints don't sit on top of services
    const a = ((i / flow.length) * 360 - angle * 0.4 + 36) * (Math.PI / 180);
    return { x: r4(center + Math.cos(a) * outerR), y: r4(center + Math.sin(a) * outerR) };
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ width: '100%', position: 'relative' }}
    >

      {/* Main graphic — tilts subtly toward cursor for depth */}
      <motion.div
        animate={{ rotateX: -tilt.y, rotateY: tilt.x }}
        transition={{ type: 'spring', damping: 28, stiffness: 180 }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          width: '100%',
          aspectRatio: '1 / 1',
          maxWidth: '420px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          aria-label="Interactive system map of EchoPulse services and workflow"
        >
          <defs>
            <radialGradient id="ep-core-glow">
              <stop offset="0%"  stopColor="#E8541A" stopOpacity="0.30" />
              <stop offset="60%" stopColor="#E8541A" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#E8541A" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ep-core-fill">
              <stop offset="0%"   stopColor="#1A1916" />
              <stop offset="100%" stopColor="#0C0C0B" />
            </radialGradient>
            <filter id="ep-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Pulse rings — emanating from core every couple seconds */}
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={`pulse-${i}`}
              cx={center}
              cy={center}
              r={70}
              fill="none"
              stroke="#E8541A"
              strokeWidth={1.2}
              animate={{ r: [70, 200], opacity: [0.45, 0] }}
              transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}

          {/* Soft outer aura */}
          <circle cx={center} cy={center} r={120} fill="url(#ep-core-glow)" />

          {/* Concentric guide rings */}
          <circle cx={center} cy={center} r={outerR} fill="none" stroke="rgba(12,12,11,0.05)" />
          <circle cx={center} cy={center} r={innerR} fill="none" stroke="rgba(12,12,11,0.06)" strokeDasharray="2 6" />

          {/* Connection paths — service node back to core.
             When hovered, the path becomes a sine wave (tapered at both ends)
             with an animated phase, so the line feels like it's carrying live signal. */}
          {servicePositions.map((p, i) => {
            const isHovered = hovered === i;
            const d = buildLinePath(
              center,
              center,
              p.x,
              p.y,
              wavePhase,
              isHovered ? 4 : 0,
            );
            return (
              <path
                key={`ln-${i}`}
                d={d}
                fill="none"
                stroke={services[i].color}
                strokeOpacity={isHovered ? 0.78 : 0.18}
                strokeWidth={isHovered ? 2 : 1}
                strokeDasharray={isHovered ? '0' : '4 6'}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'stroke-opacity 0.3s, stroke-width 0.3s' }}
              />
            );
          })}

          {/* Data-flow particles — visualize work flowing into the core */}
          {servicePositions.map((p, i) => (
            <motion.circle
              key={`pt-${i}`}
              r={2.5}
              fill={services[i].color}
              animate={{
                cx: [p.x, center],
                cy: [p.y, center],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.4,
                delay: i * 0.4,
                repeat: Infinity,
                ease: 'easeIn',
              }}
            />
          ))}

          {/* Workflow waypoints (outer ring) — subtle pulse in sequence */}
          {flowPositions.map((p, i) => (
            <g key={`wf-${i}`}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill={flow[i].color}
                animate={{ opacity: [0.25, 1, 0.25], r: [4, 6, 4] }}
                transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <text
                x={p.x}
                y={p.y - 11}
                textAnchor="middle"
                fontSize="8"
                fontWeight="800"
                fill="#A8A49B"
                letterSpacing="1px"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {flow[i].n}
              </text>
            </g>
          ))}

          {/* Service nodes — interactive */}
          {servicePositions.map((p, i) => {
            const ServiceIcon = services[i].Icon;
            return (
              <g
                key={`svc-${i}`}
                transform={`translate(${p.x},${p.y})`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'none' }}
              >
                {hovered === i && (
                  <circle r={34} fill={services[i].color} fillOpacity={0.18} filter="url(#ep-soft-glow)" />
                )}
                <circle
                  r={hovered === i ? 26 : 22}
                  fill={services[i].color}
                  style={{
                    transition: 'r 0.3s cubic-bezier(0.16,1,0.3,1), filter 0.3s',
                    filter:
                      hovered === i
                        ? `drop-shadow(0 8px 22px ${services[i].color}aa)`
                        : `drop-shadow(0 2px 8px ${services[i].color}55)`,
                  }}
                />
                {/* invisible larger hit target */}
                <circle r={32} fill="transparent" />
                {/* Lucide icon — nested SVG positioned via outer <g> translate.
                   Using nested SVG (not foreignObject) for consistent rendering across browsers. */}
                <g style={{ pointerEvents: 'none' }} transform="translate(-10,-10)">
                  <ServiceIcon size={20} color="#fff" strokeWidth={2.2} aria-hidden="true" />
                </g>
              </g>
            );
          })}

          {/* Central core */}
          <circle cx={center} cy={center} r={56} fill="url(#ep-core-fill)" stroke="rgba(232,84,26,0.4)" strokeWidth={1} />
          <motion.circle
            cx={center}
            cy={center}
            r={56}
            fill="none"
            stroke="#E8541A"
            strokeOpacity={0.6}
            animate={{ r: [56, 66], opacity: [0.6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />

          <text
            x={center}
            y={center - 4}
            textAnchor="middle"
            fontSize="13"
            fontWeight="900"
            fill="#F2EEE7"
            letterSpacing="2.5px"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            ECHO
          </text>
          <text
            x={center}
            y={center + 12}
            textAnchor="middle"
            fontSize="13"
            fontWeight="900"
            fill="#E8541A"
            letterSpacing="2.5px"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            PULSE
          </text>
        </svg>

        {/* Hover tooltip — small glass chip that docks against the node's outer edge.
           Anchored AT the node, then translated cleanly to one of four sides
           so the tooltip never overlaps the icon. */}
        <AnimatePresence>
          {hovered !== null && (() => {
            const p = servicePositions[hovered];
            const vx = p.x - center;
            const gap = 38; // node radius + breathing room
            const HoveredIcon = services[hovered].Icon;

            // Horizontal-only placement — left for left-half nodes, right for right-half.
            // Avoids any case where vertical placement would push the chip across
            // the central ECHO·PULSE core.
            let translate: string;
            let origin: string;
            if (vx < 0) {
              // Node on LEFT half — chip sits to the LEFT of the node
              translate = `calc(-100% - ${gap}px), -50%`;
              origin = 'right center';
            } else {
              // Node on RIGHT half (or on-axis) — chip sits to the RIGHT
              translate = `${gap}px, -50%`;
              origin = 'left center';
            }

            return (
              <motion.div
                key={hovered}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  left: `${(p.x / SIZE) * 100}%`,
                  top: `${(p.y / SIZE) * 100}%`,
                  transform: `translate(${translate})`,
                  transformOrigin: origin,
                  zIndex: 5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '6px 11px 6px 8px',
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.85)',
                  borderRadius: 100,
                  boxShadow: '0 8px 28px rgba(12,12,11,0.12), inset 0 1px 0 rgba(255,255,255,0.95)',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, flexShrink: 0 }}>
                  <HoveredIcon size={14} color={services[hovered].color} strokeWidth={2.2} aria-hidden="true" />
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: services[hovered].color,
                    letterSpacing: '-0.1px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {services[hovered].name}
                </span>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   StatsBand — full-width ticker that lives BELOW the hero flex,
   not inside the orbital panel. All four stats are visible at once
   with a subtle "active" highlight that cycles through them.
   ────────────────────────────────────────────────────────── */
const BAND_STATS = [
  { value: '48h',     label: 'turnaround per deliverable' },
  { value: '7',       label: 'services under one roof' },
  { value: '∞',       label: 'revisions until satisfied' },
  { value: '20-30h',  label: 'back to you every week' },
];

function StatsBand() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % BAND_STATS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="stats-band"
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 56px 64px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          padding: '14px 28px',
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.85)',
          borderRadius: '100px',
          boxShadow: '0 8px 32px rgba(12,12,11,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
          flexWrap: 'wrap',
          // Centered: the "By the numbers" eyebrow + green dot were removed,
          // so the four remaining stats are the only thing in this pill.
          justifyContent: 'center',
        }}
      >
        <div className="stats-band-items" style={{ display: 'flex', alignItems: 'center', gap: '36px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          {BAND_STATS.map((s, i) => {
            const isActive = i === activeIdx;
            return (
              <motion.div
                key={s.label}
                animate={{
                  opacity: isActive ? 1 : 0.42,
                  scale: isActive ? 1.04 : 1,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '7px',
                  whiteSpace: 'nowrap',
                  transformOrigin: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '17px',
                    fontWeight: 900,
                    letterSpacing: '-0.5px',
                    color: isActive ? '#E8541A' : '#0C0C0B',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {s.value}
                </span>
                <span style={{ fontSize: '11px', color: '#6E6B63', fontWeight: 500 }}>
                  {s.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stats-band { padding: 0 24px 48px !important; }
          .stats-band > div { flex-direction: column; gap: 14px; padding: 18px 22px !important; border-radius: 24px !important; align-items: flex-start !important; }
          .stats-band-items { gap: 14px 22px !important; justify-content: flex-start !important; width: 100%; }
        }
        /* Hidden on phone — the hero stays clean. The stats reappear inside
           dedicated sections lower on the page anyway. */
        @media (max-width: 640px) {
          .stats-band { display: none !important; }
        }
      `}</style>
    </motion.div>
  );
}

export default function Hero() {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const headlineRef  = useRef<HTMLHeadingElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const actionsRef   = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lines = headlineRef.current?.querySelectorAll('.hl-inner');
    // SHORT timeline — total play time ~0.85s. Starts immediately on mount
    // so by the time the loader (1.4s) is done, the Hero animation has
    // finished. The page is in its final settled state when revealed.
    const tl = gsap.timeline();
    tl.fromTo('#grid-bg',      { opacity: 0 }, { opacity: 1, duration: 0.6 })
      .fromTo(eyebrowRef.current,  { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.5')
      .fromTo(lines ?? [],         { y: '105%' },          { y: '0%', duration: 0.5, ease: 'power3.out', stagger: 0.05 }, '-=0.25')
      .fromTo([subRef.current, actionsRef.current], { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.06 }, '-=0.25')
      .fromTo(rightRef.current,    { x: 16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.55');
    return () => { tl.kill(); };
  }, []);

  return (
    <>
      <style>{`
        #grid-bg {
          position: absolute; inset: 0; opacity: 0; pointer-events: none;
          background-image: linear-gradient(rgba(12,12,11,0.03) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(12,12,11,0.03) 1px,transparent 1px);
          background-size: 68px 68px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 0%,black 20%,transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 0%,black 20%,transparent 100%);
        }
        .hero-badge { display:inline-flex;align-items:center;gap:7px;padding:5px 14px 5px 8px;background:rgba(232,84,26,0.09);border:1px solid rgba(232,84,26,0.22);border-radius:100px;font-size:11px;font-weight:700;color:#E8541A; }
        .badge-dot  { width:6px;height:6px;border-radius:50%;background:#E8541A;animation:bdot 2s ease-in-out infinite; }
        @keyframes bdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.6)}}

        .hl-wrap  { display:block; overflow:hidden; padding-top:0.12em; margin-top:-0.12em; padding-bottom:0.18em; margin-bottom:-0.18em; }
        .hl-inner { display:block; }

        .btn-p { background:#0C0C0B;color:#F2EEE7;border:none;padding:15px 28px;border-radius:100px;font-size:13px;font-weight:700;cursor:none;text-decoration:none;display:inline-flex;align-items:center;gap:8px;font-family:Inter,sans-serif;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden; }
        .btn-p::before{content:'';position:absolute;inset:0;background:#E8541A;transform:translateX(-101%);transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);z-index:0;}
        .btn-p:hover::before{transform:translateX(0);}
        .btn-p:hover{transform:scale(1.03);box-shadow:0 8px 30px rgba(232,84,26,0.28);}
        .btn-p span,.btn-p svg{position:relative;z-index:1;}
        .btn-o{background:rgba(255,255,255,0.55);backdrop-filter:blur(12px);color:#0C0C0B;border:1px solid rgba(12,12,11,0.13);padding:15px 28px;border-radius:100px;font-size:13px;font-weight:700;cursor:none;text-decoration:none;display:inline-block;font-family:Inter,sans-serif;transition:all 0.3s;}
        .btn-o:hover{background:#0C0C0B;color:#F2EEE7;border-color:#0C0C0B;}
        .scroll-hint{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;color:#A8A49B;font-size:9px;letter-spacing:3px;text-transform:uppercase;font-weight:600;}
        .scroll-line{width:1px;height:28px;background:linear-gradient(to bottom,#E8541A,transparent);animation:sline 1.8s ease-in-out infinite;}
        @keyframes sline{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
        /* Mobile-only elements are hidden on desktop by default */
        .hero-mobile-only { display: none; }
        /* Tablet: stack vertically — text on top, orbital graphic below, both centered */
        @media(max-width:860px){
          .hero-inner{flex-direction:column!important;gap:36px!important;align-items:stretch!important;}
          .hero-right{width:100%!important;display:flex!important;justify-content:center!important;}
        }
        /* ── Phone redesign ──
           Below 640px the hero is rebuilt for portrait-touch context. We tighten
           the type stack, restructure the headline into clean 2-line form, swap
           the orbital graphic for a native mobile service grid + trust strip,
           and give CTAs full-width tap targets. */
        @media(max-width:640px){
          .hero-inner{
            /* Center-aligned mobile hero, inspired by editorial portfolio
               sites (illustrate.framer.website pattern). Generous vertical
               padding lets the headline breathe, single-column stack reads
               cleanly on portrait. */
            padding: 84px 24px 48px !important;
            gap: 0 !important;
            text-align: center !important;
            align-items: center !important;
          }
          /* The text column inside .hero-inner — center its children too */
          .hero-inner > div:first-child{
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }
          .hero-eyebrow-m{
            display:inline-flex !important;
            align-items:center;
            gap:8px;
            padding:6px 14px 6px 10px;
            background:rgba(12,12,11,0.05);
            border:1px solid rgba(12,12,11,0.10);
            border-radius:100px;
            font-family:Inter,sans-serif;
            font-size:11px;
            font-weight:600;
            letter-spacing:0.2px;
            color:rgba(12,12,11,0.65);
            margin: 0 auto 24px !important;
          }
          .hero-eyebrow-m .ep-pulse{
            width:6px;height:6px;border-radius:50%;background:#10b981;
            box-shadow:0 0 8px rgba(16,185,129,0.6);
            animation:bdot 2s ease-in-out infinite;
          }
          /* Restructure h1 into a clean 2-line stack: we hide the original
             3-span layout and render a mobile-native 2-line version inside
             .hero-h1-mobile (just below). */
          .hero-h1-desktop{ display:none !important; }
          .hero-h1-mobile{
            display:block !important;
            font-family:Inter,sans-serif;
            font-weight:800;
            font-size: clamp(28px, 8vw, 38px) !important;
            line-height: 1.12 !important;
            letter-spacing: -0.6px !important;
            color:#0C0C0B;
            margin: 0 auto 20px !important;
            max-width: 340px !important;
            text-align: center !important;
          }
          .hero-h1-mobile .accent{
            color:#E8541A;
            font-style:italic;
          }
          .hero-sub{
            font-size: 14.5px !important;
            line-height: 1.55 !important;
            color:#6B675E !important;
            margin: 0 auto 28px !important;
            max-width: 300px !important;
            text-align: center !important;
            font-weight: 400 !important;
          }
          .hero-sub strong{
            font-weight: 600 !important;
            color: #0C0C0B !important;
          }
          .hero-sub .desktop-only{ display:none; }
          /* CTA stack — centered as a row on phone, both buttons compact
             pills. Primary stays solid black, secondary is a clean text
             link with subtle underline-on-hover (less visual weight than
             the old outlined pill — keeps the focus on the primary). */
          .hero-actions{
            gap:14px !important;
            margin: 0 auto !important;
            width:auto !important;
            flex-direction:row !important;
            align-items:center !important;
            justify-content:center !important;
            flex-wrap:wrap !important;
          }
          .hero-actions .btn-p{
            width:auto !important;
            flex:0 0 auto !important;
            justify-content:center !important;
            padding:14px 26px !important;
            font-size:13.5px !important;
            min-height:46px !important;
            box-sizing:border-box !important;
            border-radius:100px !important;
            display:inline-flex !important;
            align-items:center !important;
            gap:8px !important;
            font-weight:700 !important;
          }
          .hero-actions .btn-o{
            background: transparent !important;
            border: 1px solid rgba(12,12,11,0.14) !important;
            color: #0C0C0B !important;
            padding:14px 22px !important;
            font-size:13.5px !important;
            font-weight:600 !important;
            min-height:46px !important;
            border-radius:100px !important;
            display:inline-flex !important;
            align-items:center !important;
            gap:6px !important;
          }
          .scroll-hint{ display:none !important; }
          /* Hide the orbital entirely — replaced by mobile service grid below */
          .hero-right{ display:none !important; }

          /* Mobile-only blocks: service chips + trust strip */
          .hero-mobile-only{ display:block; }

          .hero-trust-strip{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-top:24px;
            padding:14px 14px;
            background:rgba(255,255,255,0.55);
            backdrop-filter: blur(14px) saturate(180%);
            -webkit-backdrop-filter: blur(14px) saturate(180%);
            border:1px solid rgba(12,12,11,0.08);
            border-radius:14px;
            box-shadow:0 4px 18px rgba(12,12,11,0.04), inset 0 1px 0 rgba(255,255,255,0.9);
          }
          .hero-trust-item{
            display:flex; flex-direction:column; align-items:center; gap:2px;
            flex:1 1 0;
            min-width:0;
            text-align:center;
          }
          .hero-trust-item .v{
            font-family:Inter,sans-serif;
            font-size:15px;
            font-weight:900;
            letter-spacing:-0.4px;
            color:#0C0C0B;
          }
          .hero-trust-item .v.accent{ color:#E8541A; }
          .hero-trust-item .k{
            font-size:9.5px;
            font-weight:700;
            letter-spacing:0.8px;
            text-transform:uppercase;
            color:#8A857B;
            white-space:nowrap;
          }
          .hero-trust-sep{
            width:1px;
            height:28px;
            background:rgba(12,12,11,0.08);
            flex-shrink:0;
          }

          /* Service grid — 2 columns × 3 rows of premium-feeling chips */
          .hero-services-label{
            display:flex;
            align-items:center;
            gap:10px;
            margin: 28px 0 12px;
            font-family:Inter,sans-serif;
            font-size:10px;
            font-weight:800;
            letter-spacing:2.5px;
            text-transform:uppercase;
            color:#8A857B;
          }
          .hero-services-label::before{
            content:'';
            width:18px; height:1px; background:#E8541A;
            display:block;
          }
          .hero-services-grid{
            display:grid;
            grid-template-columns: repeat(2, 1fr);
            gap:10px;
          }
          .hero-svc-chip{
            display:flex;
            align-items:center;
            gap:10px;
            padding:13px 12px;
            background:rgba(255,255,255,0.5);
            border:1px solid rgba(12,12,11,0.08);
            border-radius:14px;
            transition: transform 0.2s, border-color 0.2s, background 0.2s;
          }
          .hero-svc-chip:active{
            transform: scale(0.98);
            background:rgba(255,255,255,0.75);
            border-color: rgba(232,84,26,0.30);
          }
          .hero-svc-chip .svc-ico{
            width:34px; height:34px; border-radius:10px;
            display:flex; align-items:center; justify-content:center;
            flex-shrink:0;
          }
          .hero-svc-chip .svc-text{
            display:flex; flex-direction:column; gap:1px;
            min-width:0; flex:1;
          }
          .hero-svc-chip .svc-name{
            font-family:Inter,sans-serif;
            font-size:12.5px;
            font-weight:800;
            color:#0C0C0B;
            letter-spacing:-0.2px;
            line-height:1.1;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }
          .hero-svc-chip .svc-tag{
            font-size:10px;
            color:#8A857B;
            font-weight:500;
            line-height:1.2;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }
        }
        @media(max-width:380px){
          .hero-inner{ padding:76px 20px 40px !important; }
          .hero-h1-mobile{
            font-size: 27px !important;
            letter-spacing: -0.5px !important;
            line-height: 1.14 !important;
            max-width: 290px !important;
          }
          .hero-sub{
            font-size: 13.5px !important;
            line-height: 1.55 !important;
            margin: 0 auto 24px !important;
            max-width: 280px !important;
          }
          .hero-actions{ gap: 12px !important; }
          .hero-actions .btn-p{ padding: 12px 22px !important; font-size: 13px !important; min-height: 44px !important; }
          .hero-actions .btn-o{ padding: 12px 18px !important; font-size: 13px !important; min-height: 44px !important; }
          .hero-trust-item .v{ font-size:13.5px !important; }
          .hero-trust-item .k{ font-size:8.5px !important; letter-spacing:0.6px !important; }
          .hero-services-grid{ gap:8px !important; }
          .hero-svc-chip{ padding:11px 10px !important; }
          .hero-svc-chip .svc-ico{ width:30px; height:30px; }
          .hero-svc-chip .svc-name{ font-size:11.5px !important; }
          .hero-svc-chip .svc-tag{ font-size:9.5px !important; }
        }
      `}</style>

      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'clip' }}>
        <div id="grid-bg" />

        <div
          ref={wrapRef}
          className="hero-inner"
          style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '120px 56px 72px', display: 'flex', alignItems: 'center', gap: '64px', position: 'relative', zIndex: 1, flex: '1 1 auto' }}
        >
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <div ref={eyebrowRef} />

            {/* Desktop headline — original 3-line stacked structure. Hidden on phone. */}
            <h1
              ref={headlineRef}
              className="hero-h1 hero-h1-desktop"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(36px, 4.4vw, 64px)', fontWeight: 900, lineHeight: 1.04, letterSpacing: 'clamp(-1px, -0.035em, -2.4px)', margin: '0 0 24px' }}
            >
              {[
                <>You run the business.</>,
                <>We run <span style={{ color: '#E8541A', fontStyle: 'italic' }}>the content.</span></>,
              ].map((line, i) => (
                <span key={i} className="hl-wrap">
                  <span className="hl-inner">{line}</span>
                </span>
              ))}
            </h1>

            {/* Mobile headline — clean 2-line structure that reads naturally at 375px.
                Each line is its own block so the italic accent on line 2 doesn't
                pull the baseline of line 1, which made the headline look slightly
                misaligned at the 375px viewport. */}
            <h1 className="hero-h1-mobile hero-mobile-only" aria-hidden="true">
              <span style={{ display: 'block' }}>You run the business.</span>
              <span style={{ display: 'block' }}>We run <span className="accent">the content.</span></span>
            </h1>

            <p ref={subRef} className="hero-sub" style={{ fontSize: '16px', color: '#6E6B63', maxWidth: '540px', lineHeight: 1.7, fontWeight: 400, margin: '0 0 36px' }}>
              <span>Everything you publish, handled by one studio.</span>{' '}
              <strong style={{ color: '#0C0C0B', fontWeight: 600 }}>You hit record, we do the rest.</strong>
            </p>

            <div ref={actionsRef} className="hero-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '0', alignItems: 'center' }}>
              {/* PRIMARY — opens the BookCallModal (Calendly iframe) so visitors
                 stay on the page instead of getting yanked to a new tab. */}
              <button
                type="button"
                className="btn-p"
                aria-label={BOOK_CALL_LABEL_LONG}
                data-cursor-hover
                onClick={() => {
                  trackCallClick('hero_primary');
                  (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
                }}
                style={{ border: 'none', cursor: 'none' }}
              >
                <span>Book a strategy call</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              {/* WARM — explore packages */}
              <a
                href="#work"
                className="btn-o"
                aria-label="See work"
                data-cursor-hover
                onClick={() => trackPilotClick('hero_secondary_see_work')}
              >
                See work
              </a>
            </div>

          </div>

          <div ref={rightRef} className="hero-right" style={{ flexShrink: 0, width: '420px' }}>
            <InteractiveGraphic />
          </div>
        </div>

        {/* Full-width stats band */}
        <StatsBand />
      </section>

    </>
  );
}
