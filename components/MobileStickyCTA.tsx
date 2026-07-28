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
  // Measured, not guessed: the bar's own height is what the page has to
  // reserve at the bottom, and it changes with the geo price string and with
  // font scaling. See the reserve-space effect below.
  const [barHeight, setBarHeight] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
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

  // Reserve the bar's height at the bottom of the document.
  //
  // The bar is position:fixed, so without this it parks on top of whatever
  // ends the page: the footer's last links, a form's submit button, the final
  // CTA. <body> ships a flat `pb-20` (80px) utility, which is short of what
  // this bar actually measures once the price line wraps. Measuring means the
  // reservation is always exactly right instead of a magic number that rots.
  useEffect(() => {
    if (!isMobile) return;
    const el = barRef.current;
    if (!el) return;
    const measure = () => setBarHeight(Math.round(el.getBoundingClientRect().height));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  if (!isMobile) return null;
  const visible = scrolledPast && !keyboardOpen && scrollingDown;

  return (
    <>
    {/* The measured height already contains env(safe-area-inset-bottom),
        because the bar's own bottom padding does, so this must NOT add it a
        second time. Padding stays applied whether or not the bar is currently
        on screen: it can reappear on any downward scroll, and a padding that
        toggled would reflow the page mid-scroll. 767px matches Tailwind's md
        breakpoint, so desktop keeps its `md:pb-0`. */}
    {barHeight > 0 && (
      <style>{`
        @media (max-width: 767px) {
          body { padding-bottom: ${barHeight}px !important; }
        }
      `}</style>
    )}
    <div
      ref={barRef}
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 800,
        padding: '12px 16px calc(10px + env(safe-area-inset-bottom)) 16px',
        // Solid, not translucent-plus-blur. This component only ever renders
        // under 768px, so the old `blur(24px) saturate(180%)` was a permanent
        // full-width backdrop filter on the one class of device least able to
        // afford it: the compositor re-samples everything behind the bar on
        // every scroll frame, for a session-long element. A flat cream fill
        // reads the same at arm's length and costs nothing per frame.
        background: '#F2EEE7',
        borderTop: '1px solid rgba(12, 12, 11, 0.10)',
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
          // Kills the 300ms double-tap-zoom wait on the primary conversion tap.
          touchAction: 'manipulation',
        }}
      >
        Book a free strategy call
        <span aria-hidden="true" style={{ fontSize: '12px', opacity: 0.85 }}>→</span>
      </button>

      {/* SECONDARY — tiny, quiet, optional. Reads like a helpful hint, not a pitch. */}
      {/* href is the absolute `/#pricing` so this never dead-ends: only the
          homepage and the ICP pages actually contain an `id="pricing"`, and on
          a blog post or /about a bare `#pricing` scrolls nowhere and looks
          broken. When the section IS on the current page we intercept and
          smooth-scroll to it instead of doing a full navigation. */}
      <a
        href="/#pricing"
        onClick={(e) => {
          trackPilotClick('mobile_sticky_secondary');
          const local = document.getElementById('pricing');
          if (local) {
            e.preventDefault();
            local.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        style={{
          fontSize: '11.5px',
          fontWeight: 500,
          color: '#6E6B63',
          textDecoration: 'none',
          letterSpacing: '0.1px',
          // 8px of vertical padding turns an 11.5px line of text into a ~32px
          // strip. globals.css exempts `span a` / `p a` from its 44px touch
          // floor, and this link sits inside neither, but it is a real second
          // action, so it gets a thumb-sized band of its own.
          padding: '8px 12px',
          minHeight: '32px',
          display: 'inline-flex',
          alignItems: 'center',
          touchAction: 'manipulation',
        }}
      >
        Or see the <span style={{ color: '#E8541A', fontWeight: 700, marginLeft: 4 }}>{currency}{prices.pilot} 14-day Pilot</span>
      </a>
    </div>
    </>
  );
}
