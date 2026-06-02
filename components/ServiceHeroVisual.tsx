'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Per-service hero visual. Each service gets a distinct mockup so the pages
 * don't all feel like the same template with text swapped.
 */
export default function ServiceHeroVisual({ slug, accent }: { slug: string; accent: string }) {
  switch (slug) {
    case 'video-editing':
      return <VideoEditingVisual accent={accent} />;
    case 'linkedin-ghostwriting':
      return <LinkedInVisual accent={accent} />;
    case 'blog-production':
      return <BlogVisual accent={accent} />;
    case 'ad-creatives':
      return <AdCreativesVisual accent={accent} />;
    case 'websites-funnels':
      return <WebsiteVisual accent={accent} />;
    case 'automations':
      return <AutomationVisual accent={accent} />;
    case 'apps-software':
      return <GradientVisual accent={accent} />;
    default:
      return <GradientVisual accent={accent} />;
  }
}

/**
 * Minimal animated gradient panel. Used as the hero visual for Apps & Software
 * (where any literal product mockup would be misleading — we build dozens of
 * different things) and as a sane default for any service that doesn't have a
 * bespoke visual yet. Pure CSS animation, no JS — looks expensive, runs cheap.
 */
function GradientVisual({ accent }: { accent: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '420px',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#0C0C0B',
      }}
    >
      {/* Primary accent blob — drifts slowly */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}aa 0%, ${accent}00 70%)`,
          filter: 'blur(60px)',
          animation: 'grad-drift-a 14s ease-in-out infinite alternate',
        }}
      />
      {/* Secondary cool-tone blob — counter-orbits */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '65%',
          height: '65%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(139,92,246,0) 70%)',
          filter: 'blur(70px)',
          animation: 'grad-drift-b 18s ease-in-out infinite alternate',
        }}
      />
      {/* Subtle highlight blob, very low opacity, slow pulse */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '40%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(40px)',
          animation: 'grad-pulse 9s ease-in-out infinite',
        }}
      />
      {/* Fine grain noise overlay so the gradient doesn't look flat / banded */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
          opacity: 0.6,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />
      <style>{`
        @keyframes grad-drift-a {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(8%, 6%) scale(1.08); }
        }
        @keyframes grad-drift-b {
          0%   { transform: translate(0, 0) scale(1.05); }
          100% { transform: translate(-6%, -8%) scale(1); }
        }
        @keyframes grad-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-hidden="true"] [style*="grad-drift"],
          [aria-hidden="true"] [style*="grad-pulse"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

const cardBase = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(28px) saturate(180%)',
  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
};

/* ──────────────────────────────────────────────────────────
   VIDEO EDITING — full editing timeline mockup with playhead
   scrubbing, clips, audio waveform, and effects appearing.
   Seamless 6-second loop. Like watching someone edit.
   ────────────────────────────────────────────────────────── */
function VideoEditingVisual({ accent }: { accent: string }) {
  // Pre-computed waveform pattern so SSR matches client (no Math.random)
  const waveBars = [0.4, 0.7, 0.5, 0.85, 0.6, 0.45, 0.72, 0.38, 0.92, 0.55, 0.68, 0.42, 0.78, 0.5, 0.88, 0.62, 0.4, 0.75, 0.55, 0.7, 0.45, 0.82, 0.6, 0.5, 0.38, 0.65, 0.48, 0.78, 0.55, 0.42];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '440px',
        borderRadius: '16px',
        background: 'linear-gradient(165deg, #131316, #0a0a0c)',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-20%',
          width: '320px',
          height: '320px',
          background: `radial-gradient(circle, ${accent}1c 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top window header — like a video editor app chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          color: 'rgba(242,238,231,0.5)',
          textTransform: 'uppercase',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />
          ))}
          <span style={{ marginLeft: '8px' }}>EP / TIMELINE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}
          />
          <span style={{ color: '#fff' }}>EDITING</span>
        </div>
      </div>

      {/* Preview window */}
      <div style={{ padding: '14px 14px 0', position: 'relative' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '180px',
            borderRadius: '10px',
            overflow: 'hidden',
            background: `linear-gradient(155deg, #1c0e00, #3d2005, #1a0a00)`,
          }}
        >
          {/* Top accent strip */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />

          {/* Soft vignette so subject pops */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.35) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Talking-head silhouette — professional subject framed for camera.
             Outer wrapper handles centering (left/top + translate); inner motion.div
             handles the subtle bob so the centering transform isn't overwritten. */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -38%)',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.45))',
            }}
          >
            <motion.div
              animate={{ y: [0, -1.2, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {/* Head */}
              <div
                style={{
                  position: 'relative',
                  width: '52px',
                  height: '54px',
                  zIndex: 2,
                }}
              >
                {/* Skin — radial gradient with key light from upper-left */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '48% 48% 46% 46%',
                    background:
                      'radial-gradient(circle at 32% 28%, #f5d6ad 0%, #dcb286 55%, #9c7349 100%)',
                    boxShadow:
                      'inset -3px -5px 10px rgba(80,40,20,0.30), inset 3px 3px 7px rgba(255,240,220,0.35)',
                  }}
                />
                {/* Hair — top cap with a clean hairline */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '3px',
                    right: '3px',
                    height: '22px',
                    background:
                      'linear-gradient(180deg, #1d1310 0%, #2a1d15 70%, transparent 100%)',
                    borderRadius: '50% 50% 35% 35% / 80% 80% 30% 30%',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                  }}
                />
                {/* Subtle ear hint — left */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-2px',
                    top: '24px',
                    width: '5px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'linear-gradient(90deg, #b88d61 0%, #d6a877 100%)',
                  }}
                />
                {/* Subtle ear hint — right */}
                <div
                  style={{
                    position: 'absolute',
                    right: '-2px',
                    top: '24px',
                    width: '5px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'linear-gradient(270deg, #a37f55 0%, #c89a6c 100%)',
                  }}
                />
                {/* Mouth — animates as if speaking */}
                <motion.div
                  animate={{ scaleX: [0.6, 1, 0.7, 1.1, 0.6], opacity: [0.5, 0.85, 0.6, 0.9, 0.5] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '70%',
                    transform: 'translateX(-50%)',
                    width: '8px',
                    height: '2px',
                    background: '#5a2e1a',
                    borderRadius: '2px',
                  }}
                />
              </div>

              {/* Neck — short connector under chin */}
              <div
                style={{
                  width: '16px',
                  height: '8px',
                  marginTop: '-2px',
                  background: 'linear-gradient(180deg, #b88a5d 0%, #6f4d2f 100%)',
                  borderRadius: '0 0 6px 6px',
                  zIndex: 1,
                }}
              />

              {/* Body — blazer/jacket with collar V */}
              <div
                style={{
                  position: 'relative',
                  width: '140px',
                  height: '78px',
                  marginTop: '-3px',
                  borderRadius: '70px 70px 0 0',
                  background:
                    'linear-gradient(180deg, #1f2733 0%, #161c26 50%, #0c0f17 100%)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.06), inset -8px 0 18px rgba(0,0,0,0.25), 0 -2px 8px rgba(0,0,0,0.35)',
                }}
              >
                {/* Collar V — darker triangle hinting at a shirt opening */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '9px solid transparent',
                    borderRight: '9px solid transparent',
                    borderTop: '15px solid #07090e',
                  }}
                />
                {/* Subtle shirt collar peek — inside the V */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '8px solid #d6cfc1',
                    opacity: 0.55,
                  }}
                />
                {/* Left shoulder rim highlight */}
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    left: '12px',
                    width: '34px',
                    height: '1.5px',
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
                    borderRadius: '50%',
                    transform: 'rotate(-10deg)',
                  }}
                />
                {/* Right shoulder rim highlight */}
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '12px',
                    width: '34px',
                    height: '1.5px',
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 50%, transparent 100%)',
                    borderRadius: '50%',
                    transform: 'rotate(10deg)',
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* "REC" badge in corner — completes the "live take" feel */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 7px',
              background: 'rgba(0,0,0,0.55)',
              borderRadius: '4px',
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}
            />
            REC
          </div>

          {/* Slow-moving preview scrubber at bottom — 12s loop, linear */}
          <div
            style={{
              position: 'absolute',
              left: '12px',
              right: '12px',
              bottom: '36px',
              height: '3px',
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${accent}99, ${accent})`,
                boxShadow: `0 0 8px ${accent}cc`,
                borderRadius: '2px',
              }}
            />
          </div>

          {/* Scrubber handle — moves with the slider */}
          <motion.div
            animate={{ left: ['12px', 'calc(100% - 12px)'] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              bottom: '34px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#fff',
              boxShadow: `0 0 0 3px ${accent}55, 0 2px 6px rgba(0,0,0,0.4)`,
              transform: 'translateX(-50%)',
            }}
          />

          {/* Time counter — animated, looks like real preview time */}
          <motion.div
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              fontSize: '10px',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.92)',
              background: 'rgba(0,0,0,0.6)',
              padding: '3px 8px',
              borderRadius: '4px',
              letterSpacing: '0.5px',
            }}
          >
            <AnimatedTimeCode />
          </motion.div>

          {/* Resolution pill */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              fontSize: '9px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.6)',
              background: 'rgba(0,0,0,0.4)',
              padding: '3px 7px',
              borderRadius: '4px',
              letterSpacing: '0.4px',
            }}
          >
            4K · 24FPS
          </div>
        </div>
      </div>

      {/* Toolbar between preview and timeline */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '10px 16px',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '1px',
          color: 'rgba(242,238,231,0.45)',
          textTransform: 'uppercase',
        }}
      >
        <motion.span
          animate={{ color: ['rgba(242,238,231,0.45)', accent, 'rgba(242,238,231,0.45)'] }}
          transition={{ duration: 6, repeat: Infinity, times: [0, 0.5, 1] }}
        >
          ✂ Cut
        </motion.span>
        <span>○ Trim</span>
        <motion.span
          animate={{ color: ['rgba(242,238,231,0.45)', accent, 'rgba(242,238,231,0.45)'] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2, times: [0, 0.5, 1] }}
        >
          ⚡ Speed Ramp
        </motion.span>
        <span>◐ Color</span>
        <motion.span
          animate={{ color: ['rgba(242,238,231,0.45)', accent, 'rgba(242,238,231,0.45)'] }}
          transition={{ duration: 6, repeat: Infinity, delay: 4, times: [0, 0.5, 1] }}
        >
          ♪ Audio
        </motion.span>
      </div>

      {/* TIMELINE — multi-track */}
      <div
        style={{
          position: 'relative',
          margin: '0 14px 14px',
          padding: '14px 12px 16px',
          borderRadius: '10px',
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Track labels and content */}
        <Track label="V1" accent={accent}>
          {/* Video clips with cut points */}
          <Clip left="0%" width="22%" color={accent} delay={0} />
          <Clip left="22.5%" width="18%" color="#5b6f8e" delay={0.4} />
          <Clip left="41%" width="14%" color={accent} delay={0.8} />
          <Clip left="55.5%" width="26%" color="#5b6f8e" delay={1.2} />
          <Clip left="82%" width="16%" color={accent} delay={1.6} />
        </Track>

        {/* V2 — motion graphics layer (lower thirds, callouts, kinetic text) */}
        <Track label="V2" accent={accent}>
          <Clip left="6%" width="10%" color="#8b5cf6" delay={0.2} />
          <Clip left="38%" width="14%" color="#8b5cf6" delay={0.7} />
          <Clip left="68%" width="9%" color="#8b5cf6" delay={1.1} />
          {/* Tiny "MG" label drifting on first clip so it reads as motion graphics */}
          <motion.span
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 12, repeat: Infinity, times: [0, 0.05, 0.15, 0.18] }}
            style={{
              position: 'absolute',
              left: '8%',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '7px',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '0.5px',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            MG
          </motion.span>
        </Track>

        <Track label="A1" accent={accent}>
          {/* Audio waveform */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '1.5px',
              padding: '0 2px',
            }}
          >
            {waveBars.map((h, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [h, h * 1.3, h * 0.7, h] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.04, ease: 'easeInOut' }}
                style={{
                  flex: 1,
                  height: '70%',
                  background: `linear-gradient(to top, ${accent}99, ${accent}44)`,
                  borderRadius: '1px',
                  transformOrigin: 'center',
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        </Track>

        {/* SFX — sparse hit markers (whoosh, impact, transition stings) */}
        <Track label="SFX" accent={accent}>
          {[
            { left: '14%', color: '#10b981', delay: 0.3 },
            { left: '29%', color: '#f59e0b', delay: 0.8 },
            { left: '46%', color: '#10b981', delay: 1.3 },
            { left: '63%', color: '#3b82f6', delay: 1.8 },
            { left: '79%', color: '#f59e0b', delay: 2.3 },
            { left: '92%', color: '#10b981', delay: 2.8 },
          ].map((hit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 1, 0.4], scale: [0, 1.2, 1, 1] }}
              transition={{ duration: 1.2, delay: hit.delay, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                left: hit.left,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '8px',
                height: '14px',
                background: hit.color,
                borderRadius: '2px',
                boxShadow: `0 0 6px ${hit.color}aa`,
              }}
            />
          ))}
        </Track>

        <Track label="FX" accent={accent}>
          {/* Effect badges that fade in/out as playhead passes */}
          <FxBadge left="8%" label="Hook" color={accent} fadeStart={0.05} />
          <FxBadge left="32%" label="Speed" color="#8b5cf6" fadeStart={0.3} />
          <FxBadge left="58%" label="Color" color="#10b981" fadeStart={0.55} />
          <FxBadge left="84%" label="Caption" color="#f59e0b" fadeStart={0.8} />
        </Track>

        {/* Time ruler ticks */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: '36px',
            paddingTop: '6px',
            fontSize: '8px',
            fontWeight: 600,
            color: 'rgba(242,238,231,0.3)',
            fontFamily: 'monospace',
            letterSpacing: '0.3px',
          }}
        >
          <span>0:00</span>
          <span>0:15</span>
          <span>0:30</span>
          <span>0:45</span>
          <span>1:00</span>
        </div>

        {/* Playhead — vertical line scrubbing left to right.
           12s loop, synced with the preview scrubber so they feel like one timeline. */}
        <motion.div
          animate={{ left: ['4%', '98%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: '8px',
            bottom: '24px',
            width: '2px',
            background: accent,
            boxShadow: `0 0 10px ${accent}, 0 0 20px ${accent}`,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* Playhead head triangle */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '0',
              height: '0',
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: `7px solid ${accent}`,
            }}
          />
        </motion.div>

        {/* Cut flash effect — happens once per loop, synced with 12s playhead */}
        <motion.div
          animate={{ opacity: [0, 0, 1, 0, 0, 0] }}
          transition={{ duration: 12, repeat: Infinity, times: [0, 0.4, 0.42, 0.46, 0.5, 1] }}
          style={{
            position: 'absolute',
            top: '4px',
            bottom: '24px',
            left: '40%',
            width: '3px',
            background: '#fff',
            boxShadow: '0 0 20px #fff',
            pointerEvents: 'none',
            zIndex: 11,
          }}
        />
      </div>

      {/* Live cut indicator — pulses when a cut happens */}
      <motion.div
        animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
        transition={{ duration: 12, repeat: Infinity, times: [0, 0.4, 0.42, 0.55, 0.58, 1] }}
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          padding: '4px 10px',
          borderRadius: '100px',
          background: accent,
          fontSize: '9px',
          fontWeight: 800,
          letterSpacing: '1px',
          color: '#fff',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        ✂ Cut
      </motion.div>
    </div>
  );
}

/* Helper: animated timecode that ticks like a real preview */
function AnimatedTimeCode() {
  const [time, setTime] = useState('0:00 / 1:00');

  useEffect(() => {
    let frame = 0;
    const id = setInterval(() => {
      // 6 second loop — represents a 1:00 timeline
      const elapsed = (frame % 60) / 60; // 0 to 1
      const seconds = Math.floor(elapsed * 60);
      const display = `0:${seconds.toString().padStart(2, '0')} / 1:00`;
      setTime(display);
      frame++;
    }, 100);
    return () => clearInterval(id);
  }, []);

  return <span>{time}</span>;
}

/* Helper: a single track with label */
function Track({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '6px',
      }}
    >
      <div
        style={{
          width: '28px',
          fontSize: '9px',
          fontWeight: 800,
          letterSpacing: '0.5px',
          color: 'rgba(242,238,231,0.45)',
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: '24px',
          position: 'relative',
          background: 'rgba(255,255,255,0.025)',
          borderRadius: '4px',
          border: `1px solid rgba(255,255,255,0.04)`,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* Helper: animated clip on a track */
function Clip({ left, width, color, delay }: { left: string; width: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        top: '2px',
        bottom: '2px',
        left,
        width,
        background: `linear-gradient(180deg, ${color}, ${color}cc)`,
        borderRadius: '3px',
        transformOrigin: 'left',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15)`,
      }}
    />
  );
}

/* Helper: FX badge that fades in as playhead passes */
function FxBadge({ left, label, color, fadeStart }: { left: string; label: string; color: string; fadeStart: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        times: [0, fadeStart, fadeStart + 0.05, fadeStart + 0.2, fadeStart + 0.25, 1],
      }}
      style={{
        position: 'absolute',
        top: '50%',
        left,
        transform: 'translateY(-50%)',
        background: color,
        padding: '3px 8px',
        borderRadius: '4px',
        fontSize: '8.5px',
        fontWeight: 800,
        letterSpacing: '0.5px',
        color: '#fff',
        whiteSpace: 'nowrap',
        boxShadow: `0 2px 10px ${color}66`,
      }}
    >
      {label}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   LINKEDIN GHOSTWRITING — mock LinkedIn post UI
   ────────────────────────────────────────────────────────── */
function LinkedInVisual({ accent }: { accent: string }) {
  return <LinkedInPostBuilder accent={accent} />;
}

/**
 * Personas — the buyers EchoPulse writes for. The animation cycles through
 * each one, demonstrating "we capture the voice of founders like you, agency
 * owners like you, creators like you" instead of broadcasting Lakshya.
 *
 * Each persona has the full content for one cycle: 3 hook variations (with
 * the middle one always being the "winner"), a body drafted in their voice,
 * a target voice-fidelity score, and post-publish engagement numbers.
 */
const LI_PERSONAS = [
  {
    initials: 'MR',
    name: 'Maya Reddy',
    role: 'Founder, SyncFlow · Ops platform · Series A',
    color: '#8b5cf6',
    hooks: [
      { text: 'Our customers don\'t want better dashboards. They want fewer of them.', score: 7 },
      { text: 'Most ops software is built for the buyer. Not the person using it daily.', score: 9 },
      { text: 'We rebuilt our onboarding from scratch this quarter. Here\'s why.', score: 8 },
    ],
    body:
      'Three things every B2B SaaS founder gets wrong about their product:\n' +
      '1. Building for the buyer, not the daily user\n' +
      '2. Treating onboarding as setup, not the first product moment\n' +
      '3. Adding features instead of removing friction\n\n' +
      'Fix one and watch activation triple.',
    voiceTarget: 9.1,
    engagement: { likes: 412, comments: 87, reposts: 32 },
    replyRate: '+428%',
  },
  {
    initials: 'JK',
    name: 'James Kim',
    role: 'Owner, Northwind Studio · Brand design for DTC',
    color: '#E8541A',
    hooks: [
      { text: 'I just lost a $40K client. The relief was the lesson.', score: 8 },
      { text: 'Our highest-margin client this year paid us 60% less than our cheapest one.', score: 9 },
      { text: 'Three years of running an agency. Three things I wish I\'d cut sooner.', score: 7 },
    ],
    body:
      'Why fit beats budget every time:\n' +
      '1. The cheapest client we ever fired had the largest creative scope\n' +
      '2. The retainer we almost rejected became 40% of our revenue\n' +
      '3. Saying no to revenue we want is the only growth lever solo agencies have\n\n' +
      'Capacity is the moat. Fit is how you protect it.',
    voiceTarget: 8.7,
    engagement: { likes: 318, comments: 64, reposts: 28 },
    replyRate: '+289%',
  },
  {
    initials: 'AP',
    name: 'Anya Patel',
    role: 'Creator, The Pricing Vault · 12K founders subscribed',
    color: '#10b981',
    hooks: [
      { text: 'I redesigned my course 3 times before I stopped redesigning the course.', score: 7 },
      { text: 'My students don\'t need more lessons. They need fewer decisions.', score: 9 },
      { text: 'After 600 founders went through my pricing course, I rebuilt module 1.', score: 8 },
    ],
    body:
      'What course creators get wrong about teaching:\n' +
      '1. We add modules when the issue is decision fatigue\n' +
      '2. We over-explain the framework and under-deliver the example\n' +
      '3. We ship a curriculum when the student wanted a checklist\n\n' +
      'Cut half the content. Watch completion double.',
    voiceTarget: 8.9,
    engagement: { likes: 524, comments: 112, reposts: 47 },
    replyRate: '+361%',
  },
];

function LinkedInPostBuilder({ accent }: { accent: string }) {
  const [personaIdx, setPersonaIdx] = useState(0);
  const [phase, setPhase] = useState<'hooks' | 'drafting' | 'scoring' | 'live'>('hooks');
  const [activeHook, setActiveHook] = useState(0);
  const [bodyChars, setBodyChars] = useState(0);
  const [engagement, setEngagement] = useState({ likes: 0, comments: 0, reposts: 0 });
  const [voiceScore, setVoiceScore] = useState(0);

  const persona = LI_PERSONAS[personaIdx];
  const hooks = persona.hooks;
  const bodyText = persona.body;

  // Master timeline — single rAF-style state machine that drives every phase
  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const cycleHooks = (i: number) => {
      if (cancelled) return;
      setActiveHook(i);
      if (i < hooks.length - 1) {
        timers.push(setTimeout(() => cycleHooks(i + 1), 800));
      } else {
        // Hold on the winner for 600ms, then start drafting
        timers.push(setTimeout(() => setPhase('drafting'), 800));
      }
    };

    const startDraft = () => {
      if (cancelled) return;
      let i = 0;
      const typeNext = () => {
        if (cancelled) return;
        i += 2; // Type 2 chars per tick — feels like fast confident drafting
        setBodyChars(Math.min(i, bodyText.length));
        if (i < bodyText.length) {
          timers.push(setTimeout(typeNext, 28));
        } else {
          // Draft complete — pause briefly, then start voice scoring
          timers.push(setTimeout(() => setPhase('scoring'), 350));
        }
      };
      typeNext();
    };

    const startScore = () => {
      if (cancelled) return;
      // Animate voice score from 0 → persona.voiceTarget over ~900ms
      const target = persona.voiceTarget;
      let v = 0;
      const tick = () => {
        if (cancelled) return;
        v += target / 20;
        if (v >= target) {
          setVoiceScore(target);
          timers.push(setTimeout(() => setPhase('live'), 700));
        } else {
          setVoiceScore(v);
          timers.push(setTimeout(tick, 50));
        }
      };
      tick();
    };

    const startLive = () => {
      if (cancelled) return;
      // Count engagement up — targets come from this persona's engagement object
      const targets = persona.engagement;
      const duration = 1600;
      const start = performance.now();
      const tick = () => {
        if (cancelled) return;
        const t = Math.min((performance.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setEngagement({
          likes: Math.floor(targets.likes * eased),
          comments: Math.floor(targets.comments * eased),
          reposts: Math.floor(targets.reposts * eased),
        });
        if (t < 1) {
          timers.push(setTimeout(tick, 32));
        } else {
          // Hold on the live state for 3.0s, then rotate to next persona
          timers.push(setTimeout(() => {
            if (cancelled) return;
            setActiveHook(0);
            setBodyChars(0);
            setVoiceScore(0);
            setEngagement({ likes: 0, comments: 0, reposts: 0 });
            setPersonaIdx((i) => (i + 1) % LI_PERSONAS.length);
            setPhase('hooks');
          }, 3000));
        }
      };
      tick();
    };

    if (phase === 'hooks') cycleHooks(0);
    else if (phase === 'drafting') startDraft();
    else if (phase === 'scoring') startScore();
    else if (phase === 'live') startLive();

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [phase]);

  const winningHook = hooks[1]; // Index 1 ("9/10") is the winner that stays
  const visibleBody = bodyText.slice(0, bodyChars);

  return (
    <div style={{ position: 'relative', width: '100%', height: '460px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '340px',
          height: '340px',
          background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* The card — composes its content based on the current phase */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -6 }}
        style={{
          position: 'relative',
          width: '420px',
          maxWidth: '92%',
          padding: '22px 24px 20px',
          borderRadius: '14px',
          ...cardBase,
          background: 'rgba(255,255,255,0.96)',
          color: '#0C0C0B',
          zIndex: 2,
          minHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Status bar — shows current phase */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(12,12,11,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background:
                  phase === 'hooks'
                    ? '#f59e0b'
                    : phase === 'drafting'
                    ? accent
                    : phase === 'scoring'
                    ? '#8b5cf6'
                    : '#10b981',
                boxShadow: `0 0 8px ${
                  phase === 'hooks'
                    ? '#f59e0b'
                    : phase === 'drafting'
                    ? accent
                    : phase === 'scoring'
                    ? '#8b5cf6'
                    : '#10b981'
                }`,
              }}
            />
            <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#6E6B63' }}>
              {phase === 'hooks' && 'Hook Lab'}
              {phase === 'drafting' && 'Drafting'}
              {phase === 'scoring' && 'Voice Scoring'}
              {phase === 'live' && 'Live'}
            </span>
          </div>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#A8A49B', letterSpacing: '1px' }}>
            {phase === 'live' ? 'PUBLISHED' : 'COMPOSING'}
          </span>
        </div>

        {/* PHASE 1 — Hook Lab: 3 hook variations cycling */}
        <AnimatePresence mode="wait">
          {phase === 'hooks' && (
            <motion.div
              key="hooks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#A8A49B', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 6px' }}>
                Testing 3 hooks
              </p>
              {hooks.map((h, i) => {
                const isActive = i === activeHook;
                const isWinner = i === 1 && activeHook === hooks.length - 1;
                return (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: isActive ? 1 : 0.35,
                      scale: isActive ? 1 : 0.97,
                      borderColor: isWinner ? '#10b981' : isActive ? accent : 'rgba(12,12,11,0.10)',
                    }}
                    transition={{ duration: 0.28 }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid rgba(12,12,11,0.10)',
                      background: isWinner ? 'rgba(16,185,129,0.06)' : isActive ? `${accent}08` : 'rgba(12,12,11,0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: '#0C0C0B', fontWeight: 500, lineHeight: 1.45 }}>
                      {h.text}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        color: isWinner ? '#10b981' : isActive ? accent : '#A8A49B',
                        letterSpacing: '0.3px',
                        flexShrink: 0,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {h.score}/10
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* PHASE 2-4 — Header + Body + Engagement (live post composition) */}
          {phase !== 'hooks' && (
            <motion.div
              key="post"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              {/* Author header — persona-driven so the visitor sees diverse buyers */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <motion.div
                  key={`avatar-${personaIdx}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${persona.color}, ${persona.color}cc)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#fff',
                    flexShrink: 0,
                    boxShadow: `0 4px 14px ${persona.color}55`,
                  }}
                >
                  {persona.initials}
                </motion.div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0C0C0B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {persona.name}
                    <span style={{ fontSize: '10px', color: 'rgba(12,12,11,0.4)', fontWeight: 500 }}>· Client</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'rgba(12,12,11,0.5)' }}>
                    {persona.role} · {phase === 'live' ? 'just now' : 'editing…'}
                  </div>
                </div>
              </div>

              {/* Hook (the winning hook stays anchored at the top) */}
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0C0C0B', lineHeight: 1.45, marginBottom: '10px' }}>
                {winningHook.text}
              </div>

              {/* Typed body */}
              <div
                style={{
                  fontSize: '11.5px',
                  color: 'rgba(12,12,11,0.78)',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  flex: 1,
                  position: 'relative',
                }}
              >
                {visibleBody}
                {phase === 'drafting' && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    style={{
                      display: 'inline-block',
                      width: '1.5px',
                      height: '13px',
                      background: accent,
                      verticalAlign: 'middle',
                      marginLeft: '1px',
                    }}
                  />
                )}
              </div>

              {/* Voice score badge (Phase 3+) */}
              {(phase === 'scoring' || phase === 'live') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    marginTop: '10px',
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '5px 10px',
                    borderRadius: '100px',
                    background: phase === 'live' ? 'rgba(16,185,129,0.10)' : 'rgba(139,92,246,0.10)',
                    border: `1px solid ${phase === 'live' ? 'rgba(16,185,129,0.35)' : 'rgba(139,92,246,0.35)'}`,
                  }}
                >
                  {phase === 'live' ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        border: '1.5px solid #8b5cf6',
                        borderTopColor: 'transparent',
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: phase === 'live' ? '#10b981' : '#8b5cf6',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Voice fidelity {voiceScore.toFixed(1)}/10
                  </span>
                </motion.div>
              )}

              {/* Engagement bar (Phase 4) */}
              {phase === 'live' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '14px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(12,12,11,0.08)',
                    fontSize: '10.5px',
                    color: 'rgba(12,12,11,0.55)',
                    fontWeight: 600,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: accent, fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      👍
                    </div>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{engagement.likes}</span>
                  </div>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{engagement.comments} comments</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{engagement.reposts} reposts</span>
                </motion.div>
              )}

              {/* Reply-rate lift pill — inline inside the post card so it always renders cleanly */}
              {phase === 'live' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    marginTop: '10px',
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 11px',
                    borderRadius: '100px',
                    background: `${persona.color}12`,
                    border: `1px solid ${persona.color}40`,
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 900, color: persona.color, letterSpacing: '-0.3px' }}>
                    {persona.replyRate}
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(12,12,11,0.55)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Reply rate vs avg
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Reply-rate stat — docked as a corner badge on the post card itself
         so it never overlaps the card content or gets clipped by the container. */}

      {/* Persona indicator — tiny dots showing "we do this for X kinds of founders" */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 3,
        }}
      >
        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: 'rgba(242,238,231,0.45)', textTransform: 'uppercase' }}>
          Written for
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {LI_PERSONAS.map((p, i) => {
            const isActive = i === personaIdx;
            return (
              <motion.div
                key={p.initials}
                animate={{
                  width: isActive ? '24px' : '6px',
                  background: isActive ? p.color : 'rgba(242,238,231,0.18)',
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '6px',
                  borderRadius: '3px',
                  boxShadow: isActive ? `0 0 8px ${p.color}88` : 'none',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   BLOG PRODUCTION — mock article preview
   ────────────────────────────────────────────────────────── */
function BlogVisual({ accent }: { accent: string }) {
  return <BlogRecognitionPipeline accent={accent} />;
}

/**
 * The Recognition Pipeline — visualizes the modern blog → revenue funnel:
 *  Stage 1 — WRITTEN: We ship the blog
 *  Stage 2 — INDEXED: Google + ChatGPT + Claude + Perplexity pick it up
 *  Stage 3 — DISCOVERED: Customer asks AI a question, AI cites your blog
 *  Stage 4 — CONVERTED: Inbound lead lands in your DMs
 *
 * Each stage activates in sequence. After all 4 are lit, the connectors pulse
 * to signal the full pipeline is running. Loops at ~10s.
 */
function BlogRecognitionPipeline({ accent }: { accent: string }) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const cycle = () => {
      if (cancelled) return;
      setActiveStage(0);
      timers.push(setTimeout(() => !cancelled && setActiveStage(1), 600));
      timers.push(setTimeout(() => !cancelled && setActiveStage(2), 2200));
      timers.push(setTimeout(() => !cancelled && setActiveStage(3), 3900));
      timers.push(setTimeout(() => !cancelled && setActiveStage(4), 5800));
      timers.push(setTimeout(() => !cancelled && setActiveStage(5), 7600)); // "all glowing"
      timers.push(setTimeout(cycle, 10500));
    };
    cycle();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  // Stage helpers — a stage is "active" the moment its number is reached, "lit" if reached or past
  const isLit = (n: number) => activeStage >= n;
  const allLit = activeStage >= 5;

  const stageColors = {
    1: '#f59e0b', // brand orange-amber for the blog itself
    2: '#8b5cf6', // purple for AI distribution
    3: '#3b82f6', // blue for customer discovery
    4: '#10b981', // green for conversion
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '460px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '380px',
          height: '380px',
          background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '430px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          zIndex: 2,
        }}
      >
        {/* ── STAGE 1 — WRITTEN ── */}
        <PipelineStage
          n="01"
          label="Written"
          color={stageColors[1]}
          active={isLit(1)}
          flashing={activeStage === 1}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '40px',
                borderRadius: '4px',
                background: 'linear-gradient(180deg, #FFFFFF, #F2EEE7)',
                position: 'relative',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ position: 'absolute', top: 5, left: 4, right: 4, height: '2px', background: '#0C0C0B', borderRadius: '1px', opacity: 0.7 }} />
              <div style={{ position: 'absolute', top: 11, left: 4, right: 8, height: '1.5px', background: '#0C0C0B', borderRadius: '1px', opacity: 0.4 }} />
              <div style={{ position: 'absolute', top: 16, left: 4, right: 4, height: '1.5px', background: '#0C0C0B', borderRadius: '1px', opacity: 0.4 }} />
              <div style={{ position: 'absolute', top: 21, left: 4, right: 12, height: '1.5px', background: '#0C0C0B', borderRadius: '1px', opacity: 0.4 }} />
              <div style={{ position: 'absolute', top: 26, left: 4, right: 6, height: '1.5px', background: '#0C0C0B', borderRadius: '1px', opacity: 0.4 }} />
              <div style={{ position: 'absolute', top: 31, left: 4, right: 14, height: '1.5px', background: '#0C0C0B', borderRadius: '1px', opacity: 0.4 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#F2EEE7', letterSpacing: '-0.1px', marginBottom: '2px' }}>
                Your best blog post
              </div>
              <div style={{ fontSize: '9.5px', color: 'rgba(242,238,231,0.55)', display: 'flex', gap: '10px' }}>
                <span>2,400 words</span>
                <span>·</span>
                <span style={{ color: stageColors[1] }}>✓ Voice 8.7</span>
              </div>
            </div>
          </div>
        </PipelineStage>

        <Connector active={isLit(2)} flashing={activeStage === 2 || allLit} color={stageColors[2]} />

        {/* ── STAGE 2 — INDEXED ── */}
        <PipelineStage
          n="02"
          label="Indexed"
          color={stageColors[2]}
          active={isLit(2)}
          flashing={activeStage === 2}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(242,238,231,0.55)', whiteSpace: 'nowrap' }}>Picked up by</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { name: 'Google', delay: 0.0, color: '#4285F4' },
                { name: 'ChatGPT', delay: 0.15, color: '#10a37f' },
                { name: 'Claude', delay: 0.3, color: '#cc785c' },
                { name: 'Perplexity', delay: 0.45, color: '#20808d' },
              ].map((p) => (
                <motion.span
                  key={p.name}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: isLit(2) ? 1 : 0,
                    scale: isLit(2) ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.35, delay: isLit(2) ? p.delay : 0, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '3px 7px',
                    borderRadius: '100px',
                    background: `${p.color}22`,
                    color: p.color,
                    border: `1px solid ${p.color}55`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.name}
                </motion.span>
              ))}
            </div>
          </div>
        </PipelineStage>

        <Connector active={isLit(3)} flashing={activeStage === 3 || allLit} color={stageColors[3]} />

        {/* ── STAGE 3 — DISCOVERED ── */}
        <PipelineStage
          n="03"
          label="Discovered"
          color={stageColors[3]}
          active={isLit(3)}
          flashing={activeStage === 3}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isLit(3) ? 1 : 0, x: isLit(3) ? 0 : -8 }}
              transition={{ duration: 0.3, delay: isLit(3) ? 0 : 0 }}
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                padding: '4px 9px',
                borderRadius: '10px 10px 10px 2px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.10)',
                fontSize: '10px',
                color: 'rgba(242,238,231,0.85)',
                maxWidth: '100%',
              }}
            >
              "Who's the best at this?"
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: isLit(3) ? 1 : 0, x: isLit(3) ? 0 : 8 }}
              transition={{ duration: 0.3, delay: isLit(3) ? 0.35 : 0 }}
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-end',
                padding: '4px 9px',
                borderRadius: '10px 10px 2px 10px',
                background: `${stageColors[3]}22`,
                border: `1px solid ${stageColors[3]}55`,
                fontSize: '10px',
                color: '#F2EEE7',
                maxWidth: '100%',
              }}
            >
              Your business · the cited authority. <span style={{ color: stageColors[3], fontWeight: 700 }}>[1]</span>
            </motion.div>
          </div>
        </PipelineStage>

        <Connector active={isLit(4)} flashing={activeStage === 4 || allLit} color={stageColors[4]} />

        {/* ── STAGE 4 — CONVERTED ── */}
        <PipelineStage
          n="04"
          label="Converted"
          color={stageColors[4]}
          active={isLit(4)}
          flashing={activeStage === 4}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <motion.div
              animate={{
                scale: isLit(4) ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 1.2, repeat: isLit(4) ? Infinity : 0, ease: 'easeInOut' }}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: `${stageColors[4]}25`,
                border: `1.5px solid ${stageColors[4]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stageColors[4]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </motion.div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#F2EEE7', marginBottom: '1px' }}>
                New inbound · ready to buy
              </div>
              <div style={{ fontSize: '9.5px', color: 'rgba(242,238,231,0.55)' }}>
                Found you through AI · wants to talk
              </div>
            </div>
            <motion.div
              animate={{ opacity: isLit(4) ? [0, 1, 1, 0] : 0 }}
              transition={{ duration: 2, repeat: isLit(4) ? Infinity : 0 }}
              style={{
                fontSize: '11px',
                fontWeight: 900,
                color: stageColors[4],
                letterSpacing: '-0.3px',
              }}
            >
              +1
            </motion.div>
          </div>
        </PipelineStage>
      </div>
    </div>
  );
}

/** A single pipeline stage card — dim when inactive, lit + colored border when active */
function PipelineStage({
  n,
  label,
  color,
  active,
  flashing,
  children,
}: {
  n: string;
  label: string;
  color: string;
  active: boolean;
  flashing: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{
        scale: flashing ? [1, 1.015, 1] : 1,
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        padding: '12px 14px',
        borderRadius: '12px',
        background: active ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)',
        border: `1px solid ${active ? `${color}55` : 'rgba(255,255,255,0.06)'}`,
        boxShadow: active ? `0 8px 28px ${color}22, inset 0 1px 0 rgba(255,255,255,0.04)` : 'none',
        transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
      }}
    >
      {/* Stage number + label header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <span
          style={{
            fontSize: '8.5px',
            fontWeight: 800,
            letterSpacing: '2px',
            color: active ? color : 'rgba(242,238,231,0.30)',
            transition: 'color 0.3s',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {n}
        </span>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: active ? '#F2EEE7' : 'rgba(242,238,231,0.40)',
            transition: 'color 0.3s',
          }}
        >
          {label}
        </span>
        {active && (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 6px ${color}`,
              marginLeft: 'auto',
            }}
          />
        )}
      </div>

      {/* Stage content */}
      <div style={{ opacity: active ? 1 : 0.45, transition: 'opacity 0.3s' }}>
        {children}
      </div>
    </motion.div>
  );
}

/** Vertical connector between two pipeline stages — dot travels down when active */
function Connector({ active, flashing, color }: { active: boolean; flashing: boolean; color: string }) {
  return (
    <div
      style={{
        position: 'relative',
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Static line */}
      <div
        style={{
          width: '2px',
          height: '100%',
          background: active ? `${color}66` : 'rgba(255,255,255,0.08)',
          transition: 'background 0.4s',
          borderRadius: '1px',
        }}
      />

      {/* Animated traveling dot — only when stage flashes */}
      {flashing && (
        <motion.div
          initial={{ top: '-2px', opacity: 0 }}
          animate={{ top: '20px', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   AD CREATIVES — grid of 4 ad mocks
   ────────────────────────────────────────────────────────── */
function AdCreativesVisual({ accent }: { accent: string }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '460px' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '340px',
          height: '340px',
          background: `radial-gradient(circle, ${accent}28 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          width: '380px',
        }}
      >
        {[
          { gradient: '#1c0e00,#3d2005', label: 'STATIC', hook: 'New hook · Day 4' },
          { gradient: '#0a0a14,#1a1a2e', label: 'VIDEO',  hook: 'Speed ramp · 0:15' },
          { gradient: '#001a14,#003d2e', label: 'STATIC', hook: 'Variant B · Best CPA' },
          { gradient: '#1a000d,#3d001f', label: 'MOTION', hook: 'Kinetic text · 0:30' },
        ].map((ad, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.04 }}
            style={{
              position: 'relative',
              aspectRatio: '4 / 5',
              borderRadius: '12px',
              overflow: 'hidden',
              background: `linear-gradient(155deg, ${ad.gradient.split(',').join(',')})`,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
              cursor: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                fontSize: '8px',
                fontWeight: 800,
                letterSpacing: '1.5px',
                color: accent,
                background: 'rgba(0,0,0,0.5)',
                padding: '3px 7px',
                borderRadius: '4px',
              }}
            >
              {ad.label}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                right: '8px',
                fontSize: '9px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              {ad.hook}
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Subscription pill */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          borderRadius: '100px',
          ...cardBase,
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'rgba(242,238,231,0.85)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, boxShadow: `0 0 10px ${accent}` }} />
        12 / month · refreshed weekly
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   WEBSITES & FUNNELS — browser frame mockup
   ────────────────────────────────────────────────────────── */
function WebsiteVisual({ accent }: { accent: string }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '460px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '380px',
          height: '320px',
          background: `radial-gradient(circle, ${accent}28 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -6, scale: 1.02 }}
        style={{
          position: 'relative',
          width: '460px',
          maxWidth: '92%',
          borderRadius: '14px',
          overflow: 'hidden',
          ...cardBase,
          background: 'rgba(15,15,20,0.92)',
          zIndex: 2,
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {[1, 2, 3].map(i => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
          ))}
          <div
            style={{
              flex: 1,
              marginLeft: '12px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.06)',
              fontSize: '10px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.2px',
            }}
          >
            echopulse.media
          </div>
          <div style={{ fontSize: '9px', color: accent, fontWeight: 700 }}>1.4s</div>
        </div>

        {/* Site content */}
        <div style={{ padding: '32px 28px' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '2px',
              color: accent,
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}
          >
            Conversion ↑ 2.4×
          </div>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '22px',
              fontWeight: 900,
              letterSpacing: '-0.6px',
              color: '#F2EEE7',
              lineHeight: 1.1,
              marginBottom: '12px',
            }}
          >
            Built to convert.<br />
            <span style={{ color: accent }}>Not just to impress.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '18px' }}>
            {[100, 80, 65].map((w, i) => (
              <div key={i} style={{ height: '6px', borderRadius: '3px', width: `${w}%`, background: 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div
              style={{
                background: accent,
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: '10px',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              Book a Call →
            </div>
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: '10px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              Learn more
            </div>
          </div>
        </div>

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
      </motion.div>

      {/* Mini metric badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        style={{
          position: 'absolute',
          right: '8%',
          bottom: '15%',
          padding: '14px 16px',
          borderRadius: '12px',
          ...cardBase,
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '20px', fontWeight: 900, color: accent, lineHeight: 1 }}>
          &lt;2s
        </div>
        <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.6)', marginTop: '4px' }}>
          Mobile load
        </div>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   AUTOMATIONS — live activity feed showing AI agents working
   ────────────────────────────────────────────────────────── */
function AutomationVisual({ accent }: { accent: string }) {
  return <AutomationActivityFeed accent={accent} />;
}

type AutomationEvent = {
  time: string;
  text: string;
  agent: 'claude' | 'system' | 'human' | 'success';
  icon: string;
};

const AUTOMATION_EVENTS: AutomationEvent[] = [
  { time: '2:34', text: 'New DM from @maya · founder',         agent: 'system',  icon: '💬' },
  { time: '2:34', text: 'Claude agent qualified · score 8/10', agent: 'claude',  icon: '🤖' },
  { time: '2:35', text: 'Auto-reply sent with intake link',    agent: 'system',  icon: '⚡' },
  { time: '2:38', text: 'Form submitted · added to CRM',       agent: 'system',  icon: '📋' },
  { time: '2:40', text: 'Calendar booked · Thu 3pm',           agent: 'success', icon: '📅' },
  { time: '2:41', text: 'Slack pinged · Lakshya notified',     agent: 'system',  icon: '🔔' },
  { time: '2:45', text: 'New DM from @james · agency',         agent: 'system',  icon: '💬' },
  { time: '2:45', text: 'Claude agent qualified · score 9/10', agent: 'claude',  icon: '🤖' },
  { time: '2:47', text: 'Email sent · meeting prep brief',     agent: 'system',  icon: '📧' },
  { time: '2:51', text: 'Calendar booked · Fri 10am',          agent: 'success', icon: '📅' },
];

function AutomationActivityFeed({ accent }: { accent: string }) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [stats, setStats] = useState({ leads: 0, booked: 0, hours: 0 });

  // Stream events in one at a time — when full, restart
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const cycle = () => {
      if (cancelled) return;
      setVisibleCount(0);
      let i = 1;
      const showNext = () => {
        if (cancelled) return;
        setVisibleCount(i);
        if (i < AUTOMATION_EVENTS.length) {
          i++;
          timers.push(setTimeout(showNext, 700));
        } else {
          // pause then restart
          timers.push(setTimeout(cycle, 3500));
        }
      };
      showNext();
    };
    cycle();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  // Animate the stats counters up to their targets
  useEffect(() => {
    const targets = { leads: 247, booked: 18, hours: 14 };
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setStats({
        leads: Math.floor(targets.leads * eased),
        booked: Math.floor(targets.booked * eased),
        hours: Math.floor(targets.hours * eased),
      });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const visibleEvents = AUTOMATION_EVENTS.slice(0, visibleCount);
  const claude = '#8b5cf6';
  const success = '#10b981';

  const colorFor = (a: AutomationEvent['agent']) =>
    a === 'claude' ? claude : a === 'success' ? success : accent;

  return (
    <div style={{ position: 'relative', width: '100%', height: '460px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '380px',
          height: '380px',
          background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 2,
        }}
      >
        {/* Stats row — three counters that animate up */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}
        >
          {[
            { value: stats.leads, label: 'Leads caught', color: accent },
            { value: stats.booked, label: 'Booked this week', color: success },
            { value: `${stats.hours}h`, label: 'Time saved', color: claude },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '20px',
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  color: s.color,
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: '8.5px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'rgba(242,238,231,0.45)',
                  marginTop: '4px',
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI agent header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${claude}18 0%, rgba(255,255,255,0.04) 100%)`,
            border: `1px solid ${claude}40`,
          }}
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 0 0 0 ${claude}88`,
                `0 0 0 6px ${claude}00`,
              ],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${claude}, ${claude}cc)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
          </motion.div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#F2EEE7', letterSpacing: '-0.1px' }}>
              Claude Code agent
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(242,238,231,0.5)' }}>
              Listening · qualifying · routing · 24/7
            </div>
          </div>
          <span
            style={{
              fontSize: '8.5px',
              fontWeight: 800,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: success,
              background: `${success}1a`,
              padding: '3px 8px',
              borderRadius: '100px',
              border: `1px solid ${success}40`,
            }}
          >
            ● LIVE
          </span>
        </motion.div>

        {/* Activity feed — events stream in */}
        <div
          style={{
            position: 'relative',
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.05)',
            minHeight: '200px',
            maxHeight: '210px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {/* Top fade */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '20px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          <AnimatePresence initial={false}>
            {visibleEvents.slice(-6).map((evt, i) => {
              const realIdx = visibleEvents.length - (visibleEvents.slice(-6).length - i);
              return (
                <motion.div
                  key={`${realIdx}-${evt.time}-${evt.text}`}
                  initial={{ opacity: 0, x: -12, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '7px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.025)',
                    border: `1px solid ${colorFor(evt.agent)}25`,
                    overflow: 'hidden',
                  }}
                >
                  <span style={{ fontSize: '11px', flexShrink: 0 }}>{evt.icon}</span>
                  <span
                    style={{
                      fontSize: '8.5px',
                      fontWeight: 700,
                      color: 'rgba(242,238,231,0.4)',
                      fontFamily: 'monospace',
                      flexShrink: 0,
                    }}
                  >
                    {evt.time}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'rgba(242,238,231,0.85)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {evt.text}
                  </span>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: colorFor(evt.agent),
                      boxShadow: `0 0 6px ${colorFor(evt.agent)}`,
                      flexShrink: 0,
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
