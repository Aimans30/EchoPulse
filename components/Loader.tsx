'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Loader — branded intro splash with richer motion.
 *
 * Animation timeline:
 *   1. Backdrop fades in (very fast, ~0.2s) — sets dark stage
 *   2. Orbital ring + ambient glow pulse in behind the wordmark
 *   3. Letters reveal one-by-one with blur + lift
 *   4. Progress bar fills across the bottom edge
 *   5. Wordmark exits up with blur, ring contracts, backdrop fades out
 *
 * Concurrency: the parent <Home> mounts the real page content BEHIND the
 * loader at the same time (opacity 0). That means every dynamic-import
 * chunk and image is downloading WHILE this animation plays — so by the
 * time the loader exits, the page is already fully prepared. Zero wait
 * after the splash.
 *
 * Safety:
 *   - Failsafe timer force-completes after 4.5s if GSAP hangs
 *   - Loader sets pointer-events:none during exit so it can't block scroll
 *   - Forcibly clears any inherited body overflow:hidden on unmount
 */
/**
 * True when this splash is not actually on screen: phones and anyone who
 * asked for reduced motion.
 *
 * app/globals.css hides `[data-loader="true"]` under exactly the same
 * conditions so the page can paint from static HTML before hydration (see
 * the long comment there). This is the JS half of that pair: without it the
 * component would happily build and run a full GSAP timeline, tweening
 * letters, a blurred glow and two SVG rings, for an element with
 * `display: none`. Keep the two conditions in sync.
 */
function isSplashHidden(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      window.matchMedia('(max-width: 767.98px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  } catch {
    return false;
  }
}

export default function Loader({ onDone }: { onDone: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Keep `onDone` fresh without retriggering the animation effect.
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  // Failsafe: hide loader after 4.5s no matter what.
  useEffect(() => {
    // Skip on hidden-splash devices: there is nothing to fail safe against,
    // and holding a 3.5s timer alive keeps this whole component (and its
    // GSAP refs) retained on a memory-constrained phone for no reason.
    if (isSplashHidden()) return;
    const failsafe = window.setTimeout(() => { onDoneRef.current?.(); }, 3500);
    return () => window.clearTimeout(failsafe);
  }, []);

  // Belt-and-suspenders: when this component unmounts, clear any
  // overflow:hidden that may have been left on body. Prevents a stuck-scroll
  // state if a modal/popup happened to set it during the loader window.
  useEffect(() => () => {
    if (typeof document !== 'undefined') {
      if (document.body.style.overflow === 'hidden') document.body.style.overflow = '';
      if (document.documentElement.style.overflow === 'hidden') document.documentElement.style.overflow = '';
    }
  }, []);

  useEffect(() => {
    // Phone / reduced motion: the splash is display:none, so hand off
    // immediately instead of animating an invisible element. This fires the
    // `ep:loaded` handoff a full frame earlier than app/page.tsx's own
    // mobile skip does, and it never creates the timeline in the first
    // place, so no GSAP tick ever competes with hydration on a phone.
    if (isSplashHidden()) {
      onDoneRef.current?.();
      return;
    }

    const letters = wordRef.current?.querySelectorAll('.l');
    if (!letters || !letters.length) {
      onDoneRef.current?.();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Exit sequence — block pointer events so the (about to fade) overlay
        // can never trap a click during its 0.5s exit.
        if (loaderRef.current) loaderRef.current.style.pointerEvents = 'none';

        const exit = gsap.timeline({
          onComplete: () => onDoneRef.current?.(),
        });
        exit
          .to(letters, {
            y: -20,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.55,
            stagger: 0.022,
            ease: 'power3.in',
          }, 0)
          .to(ringRef.current, {
            scale: 0.6,
            opacity: 0,
            duration: 0.55,
            ease: 'power2.in',
          }, 0)
          .to(glowRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          }, 0)
          .to(loaderRef.current, {
            opacity: 0,
            duration: 0.55,
            ease: 'power2.inOut',
          }, 0.15);
      },
    });

    // ── Intro ──
    tl
      // Glow ambience first
      .fromTo(glowRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' },
        0,
      )
      // Orbital ring scales + fades in
      .fromTo(ringRef.current,
        { opacity: 0, scale: 0.6, rotate: -40 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: 'power3.out' },
        0.05,
      )
      // Letter blur reveal — staggered
      .fromTo(letters,
        { y: 24, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.035,
          ease: 'power3.out',
        },
        0.05,
      )
      // Subtle settle bounce on the orange half ("Pulse") to land the brand
      .to('.l-pulse', {
        y: -3,
        duration: 0.18,
        ease: 'power1.out',
        yoyo: true,
        repeat: 1,
      }, '-=0.15')
      // Progress bar fills
      .to(barRef.current, { width: '100%', duration: 0.8, ease: 'power2.inOut' }, '-=0.4');

    return () => { tl.kill(); };
  }, []);

  const letters = 'EchoPulse'.split('');

  return (
    <div
      ref={loaderRef}
      data-loader="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, #14120F 0%, #0C0C0B 60%, #050505 100%)',
        zIndex: 8000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow behind the wordmark */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,84,26,0.18) 0%, rgba(232,84,26,0.05) 35%, transparent 70%)',
          filter: 'blur(40px)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />

      {/* Orbital ring — two dashed circles with a tiny rotating marker */}
      <svg
        ref={ringRef}
        viewBox="0 0 400 400"
        width="380"
        height="380"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {/* Outer faint ring */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="rgba(242,238,231,0.06)"
          strokeWidth="1"
        />
        {/* Inner dashed orange ring with continuous rotation */}
        <g style={{ transformOrigin: '200px 200px', animation: 'epRingSpin 9s linear infinite' }}>
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="rgba(232,84,26,0.45)"
            strokeWidth="1.5"
            strokeDasharray="2 12"
            strokeLinecap="round"
          />
          {/* Orbiting orange dot */}
          <circle cx="350" cy="200" r="4" fill="#E8541A">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Second counter-rotating dashed ring */}
        <g style={{ transformOrigin: '200px 200px', animation: 'epRingSpinR 14s linear infinite' }}>
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="rgba(242,238,231,0.08)"
            strokeWidth="1"
            strokeDasharray="1 6"
          />
        </g>
      </svg>

      {/* Wordmark */}
      <div
        ref={wordRef}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '44px',
          fontWeight: 800,
          letterSpacing: '-1.5px',
          color: '#F2EEE7',
          display: 'flex',
          position: 'relative',
          zIndex: 1,
          willChange: 'transform, opacity, filter',
        }}
      >
        {letters.map((char, i) => {
          const isOrange = i >= 4;
          return (
            <span
              key={i}
              className={`l ${isOrange ? 'l-pulse' : ''}`}
              style={{
                display: 'inline-block',
                color: isOrange ? '#E8541A' : '#F2EEE7',
                textShadow: isOrange ? '0 0 24px rgba(232,84,26,0.35)' : 'none',
                willChange: 'transform, opacity, filter',
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Progress bar at bottom edge */}
      <div
        ref={barRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #E8541A, #ff7a3c)',
          width: 0,
          boxShadow: '0 0 12px rgba(232,84,26,0.6)',
        }}
      />

      {/* Animation keyframes for the SVG rings */}
      <style>{`
        @keyframes epRingSpin   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes epRingSpinR  { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  );
}
