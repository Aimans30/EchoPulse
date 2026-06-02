'use client';

/**
 * Mobile sticky CTA — softer redesign.
 *
 *  Old version: two competing buttons ("$299 Pilot →" and "Book call") fighting
 *  for attention. Felt like a brutal hard-sell stacked on top of the content.
 *
 *  New version: ONE clear primary action ("Book a strategy call") that opens
 *  the in-page BookCallModal. The Pilot reference becomes a tiny secondary
 *  hint underneath ("Or see the $299 14-day Pilot") — informative, not pushy.
 *  Smaller overall footprint, calmer presence.
 *
 *  Also: auto-hides when the user scrolls UP (means they're reading, not
 *  shopping — no need to interrupt) and reappears when they scroll DOWN
 *  (means they're moving through the page actively). This makes the bar feel
 *  like a helpful companion, not a constant heckler.
 */

import { useEffect, useState, useRef } from 'react';
import { trackPilotClick, trackCallClick } from '@/lib/analytics';
import { useGeoPrice } from '@/lib/useGeoPrice';

const SCROLL_TRIGGER_PX = 600;
const KEYBOARD_HEIGHT_THRESHOLD = 0.75;

export default function MobileStickyCTA() {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastY = useRef(0);
  const { currency, prices } = useGeoPrice();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolledPast(y > SCROLL_TRIGGER_PX);
        // Direction tracking — debounced via the rAF tick itself
        const delta = y - lastY.current;
        if (Math.abs(delta) > 4) {
          setScrollingDown(delta > 0);
          lastY.current = y;
        }
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isMobile]);

  // Detect virtual keyboard so the bar doesn't sit on top of an active input
  useEffect(() => {
    if (!isMobile) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      const ratio = vv.height / window.innerHeight;
      setKeyboardOpen(ratio < KEYBOARD_HEIGHT_THRESHOLD);
    };
    onResize();
    vv.addEventListener('resize', onResize);
    return () => vv.removeEventListener('resize', onResize);
  }, [isMobile]);

  if (!isMobile) return null;
  const visible = scrolledPast && !keyboardOpen && scrollingDown;

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 800,
        padding: '12px 16px calc(10px + env(safe-area-inset-bottom)) 16px',
        background: 'rgba(242, 238, 231, 0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid rgba(12, 12, 11, 0.07)',
        boxShadow: '0 -10px 36px rgba(12, 12, 11, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '7px',
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* PRIMARY — the only visually loud element. Opens the Calendly modal. */}
      <button
        type="button"
        aria-label="Book a free strategy call"
        onClick={() => {
          trackCallClick('mobile_sticky');
          (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
        }}
        style={{
          width: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '14px 22px',
          background: '#0C0C0B',
          color: '#F2EEE7',
          border: 'none',
          borderRadius: '100px',
          fontSize: '14.5px',
          fontWeight: 700,
          letterSpacing: '-0.15px',
          fontFamily: 'Inter, sans-serif',
          minHeight: '48px',
          whiteSpace: 'nowrap',
          boxShadow: '0 10px 28px rgba(12,12,11,0.22)',
          cursor: 'pointer',
        }}
      >
        Book a free strategy call
        <span aria-hidden="true" style={{ fontSize: '12px', opacity: 0.85 }}>→</span>
      </button>

      {/* SECONDARY — tiny, quiet, optional. Reads like a helpful hint, not a pitch. */}
      <a
        href="#pricing"
        onClick={() => trackPilotClick('mobile_sticky_secondary')}
        style={{
          fontSize: '11.5px',
          fontWeight: 500,
          color: '#6E6B63',
          textDecoration: 'none',
          letterSpacing: '0.1px',
          padding: '4px 8px',
          minHeight: '24px',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        Or see the <span style={{ color: '#E8541A', fontWeight: 700, marginLeft: 4 }}>{currency}{prices.pilot} 14-day Pilot</span>
      </a>
    </div>
  );
}
