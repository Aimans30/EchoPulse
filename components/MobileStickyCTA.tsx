'use client';

/**
 * Mobile sticky CTA bar — pinned to the bottom of the viewport on small screens.
 *
 * Visibility rules:
 *  • Only on screens < 768px
 *  • Hidden until the user scrolls past the hero (>600px) so it doesn't compete
 *    with the hero's own CTAs above the fold
 *  • Hidden when the virtual keyboard is open (visualViewport.height < 75% of window.innerHeight)
 *    so it doesn't sit on top of an active input on mobile
 *
 * Mounted globally in app/layout.tsx so it appears across the whole site.
 */

import { useEffect, useState } from 'react';
import { BOOK_CALL_URL } from '@/lib/links';
import { trackPilotClick, trackCallClick } from '@/lib/analytics';

const SCROLL_TRIGGER_PX = 600;
const KEYBOARD_HEIGHT_THRESHOLD = 0.75;

export default function MobileStickyCTA() {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
        setScrolledPast(window.scrollY > SCROLL_TRIGGER_PX);
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

  // Detect virtual keyboard via visualViewport. iOS + Android both shrink
  // visualViewport.height when the soft keyboard appears.
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
  const visible = scrolledPast && !keyboardOpen;

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 800,
        padding: '12px 14px calc(12px + env(safe-area-inset-bottom)) 14px',
        background: 'rgba(242, 238, 231, 0.78)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid rgba(12, 12, 11, 0.08)',
        boxShadow: '0 -6px 28px rgba(12, 12, 11, 0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <a
        href="#pricing"
        aria-label="Start the $299 Pilot"
        onClick={() => trackPilotClick('mobile_sticky')}
        style={{
          flex: '1 1 0',
          minWidth: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '14px 18px',
          background: '#E8541A',
          color: '#fff',
          borderRadius: '100px',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '-0.1px',
          textDecoration: 'none',
          fontFamily: 'Inter, sans-serif',
          minHeight: '44px',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 14px rgba(232, 84, 26, 0.32)',
        }}
      >
        $299 Pilot
        <span aria-hidden="true">→</span>
      </a>
      <a
        href={BOOK_CALL_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book a strategy call"
        onClick={() => trackCallClick('mobile_sticky')}
        style={{
          flex: '0 0 auto',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 18px',
          background: 'transparent',
          color: '#0C0C0B',
          border: '1.5px solid rgba(12, 12, 11, 0.18)',
          borderRadius: '100px',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '-0.1px',
          textDecoration: 'none',
          fontFamily: 'Inter, sans-serif',
          minHeight: '44px',
          whiteSpace: 'nowrap',
        }}
      >
        Book call
      </a>
    </div>
  );
}
