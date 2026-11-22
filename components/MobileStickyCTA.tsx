'use client';

/**
 * Mobile sticky CTA — softer redesign.
 *
 *  Old version: two competing buttons ("$299 Pilot →" and "Book call") fighting
 *  for attention. Felt like a brutal hard-sell stacked on top of the content.
 *
 *  New version: ONE clear primary action ("Book a strategy call") that opens
 *  the in-page BookCallModal. Underneath sits one quiet secondary link to the
 *  free sample ("Or get 2 free edits", /free-edits), informative, not pushy.
 *  Smaller overall footprint, calmer presence.
 *
 *  Also: auto-hides when the user scrolls UP (means they're reading, not
 *  shopping — no need to interrupt) and reappears when they scroll DOWN
 *  (means they're moving through the page actively). This makes the bar feel
 *  like a helpful companion, not a constant heckler.
 */

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { track, trackCallClick } from '@/lib/analytics';
import { BOOK_CALL_LABEL, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';

const SCROLL_TRIGGER_PX = 600;
const KEYBOARD_HEIGHT_THRESHOLD = 0.75;

/**
 * Routes this bar must never appear on.
 *
 * An article reader arrived from
 * search to read something, and a permanent sales bar pinned over the bottom
 * of the text is an interruption rather than an offer. It also competes with
 * the closing CTA the post already ends with (components/BlogFooterCTA.tsx),
 * which is the right place to make the ask because the reader has finished by
 * then. On a phone the bar covers a meaningful share of the screen, so on the
 * one page type where the whole goal is reading, it costs more than it earns.
 */
/*
 * The form and checkout routes are suppressed for a different reason: the
 * visitor is already doing the thing the bar asks for. At 390px the bar sat on
 * top of the /free-edits "Continue" button while the form was being filled in,
 * and its second line would link to the page the visitor is on.
 */
const SUPPRESSED_PREFIXES = ['/blog', '/free-edits', '/order', '/onboard', '/booked', '/book'];

export default function MobileStickyCTA() {
  const pathname = usePathname();
  const suppressed = SUPPRESSED_PREFIXES.some(
    (p) => pathname === p || pathname?.startsWith(`${p}/`)
  );
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Bail on suppressed routes too, not just desktop. Without this a blog
    // post still attaches a scroll listener and runs a rAF tick on every
    // frame of every scroll for a bar that is never going to render.
    if (suppressed) return;
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
  }, [isMobile, suppressed]);

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

  // Returned before the bar renders AND before the body-padding <style> below
  // is emitted, so a blog post gets neither the bar nor the reserved gap at the
  // bottom of the page that the bar would otherwise need.
  if (suppressed) return null;
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
          /* The footer also reserves 96px for this bar (Footer.tsx and
             globals.css). With the body padding above that was the room
             reserved twice: about 200px of blank page under the last line.
             Where this bar is mounted the body padding is the reservation,
             so the footer goes back to ordinary spacing. Routes where the
             bar is suppressed (the blog, which has its own bar) keep the
             footer's 96px. */
          body footer.site-footer { padding-bottom: calc(40px + env(safe-area-inset-bottom)) !important; }
        }
      `}</style>
    )}
    <div
      ref={barRef}
      aria-hidden={!visible}
      // inert takes the hidden bar's links out of the tab order too, so it is
      // never "hidden but focusable" (an accessibility failure).
      inert={!visible}
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
        aria-label={BOOK_CALL_LABEL}
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
          fontSize: '15px',
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
        {BOOK_CALL_LABEL}
        <span aria-hidden="true" style={{ fontSize: '12px', opacity: 0.85 }}>→</span>
      </button>

      {/* SECONDARY: the free sample, the lowest-friction ask on the site.
          It was "Or see the $299 14-day Pilot" until Nov 2026, which pointed
          a first-time visitor at the paid step. Label and URL come from
          lib/links.ts so this never drifts from the hero and pricing CTAs.
          A plain same-tab link to the internal /free-edits page. */}
      <Link
        href={FREE_EDITS_URL}
        onClick={() => track('cta_free_edits_click', { location: 'mobile_sticky_secondary' })}
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: '#6E6B63',
          textDecoration: 'none',
          letterSpacing: '0.1px',
          // A real second action, so it gets a full 44px thumb band. The
          // negative bottom margin keeps the bar's overall height where it was.
          padding: '0 16px',
          minHeight: '44px',
          margin: '-6px 0 -6px',
          display: 'inline-flex',
          alignItems: 'center',
          touchAction: 'manipulation',
        }}
      >
        Or <span style={{ color: '#C2410C', fontWeight: 700, marginLeft: 4 }}>{FREE_EDITS_LABEL.charAt(0).toLowerCase() + FREE_EDITS_LABEL.slice(1)}</span>
      </Link>
    </div>
    </>
  );
}
