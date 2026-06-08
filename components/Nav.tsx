'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOK_CALL_URL, BOOK_CALL_LABEL, BOOK_CALL_LABEL_LONG } from '@/lib/links';

const links = [
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#work' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/#faq' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Tracks which on-page section is currently in view. Drives both
  // aria-current on the nav link and a subtle visual highlight.
  const [activeSection, setActiveSection] = useState<string>('');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which homepage section is in view so the nav can show an
  // active state on the matching link. Skipped entirely on non-homepage
  // routes since there are no section anchors to watch there.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Only run on the homepage (single trailing slash or root).
    if (window.location.pathname !== '/') return;

    const targets = ['services', 'work', 'pricing', 'faq']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that's currently intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  // Adaptive theming: when the nav is overlapping a section marked
  // `data-dark-bg="true"`, switch to the dark-glass variant. We sample the
  // pixel right under the nav's vertical center via the ancestor data attribute
  // on every scroll/resize. rAF-throttled so it stays cheap.
  useEffect(() => {
    let raf = 0;
    let queued = false;
    const sample = () => {
      queued = false;
      const navEl = navRef.current;
      if (!navEl) return;
      const rect = navEl.getBoundingClientRect();
      const probeY = rect.top + rect.height / 2;
      // Sample slightly inside from the left so we don't pick up the page bg
      // through the nav's transparent rounded corner.
      const probeX = Math.max(20, rect.left + 8);
      const el = document.elementFromPoint(probeX, probeY);
      if (!el) return;
      let node: Element | null = el;
      let depth = 0;
      while (node && node !== document.documentElement && depth < 12) {
        if ((node as HTMLElement).dataset?.darkBg === 'true') {
          setOnDark(true);
          return;
        }
        node = (node as HTMLElement).parentElement;
        depth++;
      }
      setOnDark(false);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(sample);
    };
    sample();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    // Detect if a Loader is currently mounted (homepage). If so, hold the nav until it fades.
    const hasLoader = typeof document !== 'undefined' && document.querySelector('[data-loader="true"]') !== null;
    const delay = hasLoader ? 1.2 : 0.2;
    gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay });
  }, []);

  const closeMobile = () => setMobileOpen(false);

  // Lock body scroll while the mobile dropdown is open so the page underneath
  // doesn't move around when the user scrolls inside the menu (or accidentally).
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  // Close the mobile menu on Escape — small a11y nicety that also helps when
  // testing on desktop at narrow widths.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <>
      <style>{`
        .nav-link.is-active { color: #E8541A; }
        .nav-link.is-active::after { width: 100% !important; }
        .nav-link {
          color: #6E6B63;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: #E8541A;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 2px;
        }
        .nav-link:hover { color: #0C0C0B; }
        .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }

        /* Dark-section variant: when the nav is over a section marked
           data-dark-bg="true", flip the glass to dark with cream text so
           the pill stays legible. Smooth transition handled by the
           existing transition rule on .nav-pill. */
        .nav-pill.nav-on-dark {
          background: rgba(12,12,11,0.55) !important;
          border: 1px solid rgba(255,255,255,0.10) !important;
          box-shadow: 0 12px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }
        .nav-pill.nav-on-dark .nav-link { color: rgba(242,238,231,0.7); }
        .nav-pill.nav-on-dark .nav-link:hover { color: #F2EEE7; }
        .nav-pill.nav-on-dark .nav-link::after { background: #E8541A; }
        /* Logo text gets cream tint on dark; the orange "Pulse" half stays orange */
        .nav-pill.nav-on-dark a[href="/"] > span { color: #F2EEE7 !important; }
        .nav-pill.nav-on-dark a[href="/"] > span span { color: #E8541A !important; }
        /* CTA pill stays the same dark fill but gains a thin cream border so
           it doesn't disappear into the now-also-dark pill behind it. */
        .nav-pill.nav-on-dark .nav-cta-btn {
          background: #E8541A;
          border: none;
        }
        .nav-pill.nav-on-dark .nav-cta-btn::before { background: #0C0C0B; }
        /* Hamburger lines turn cream */
        .nav-pill.nav-on-dark .nav-hamburger span { background: #F2EEE7; }
        .nav-cta-btn {
          background: #0C0C0B;
          color: #F2EEE7;
          border: none;
          padding: 10px 22px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          cursor: none;
          font-family: Inter, sans-serif;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s;
        }
        .nav-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #E8541A;
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-cta-btn:hover::before { transform: translateX(0); }
        .nav-cta-btn:hover { transform: scale(1.03); }
        .nav-cta-btn span { position: relative; z-index: 1; }

        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 10px;
          transition: background 0.2s;
        }
        .nav-hamburger:hover { background: rgba(12,12,11,0.06); }
        .nav-hamburger span {
          display: block;
          width: 18px;
          height: 1.5px;
          background: #0C0C0B;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        @media (max-width: 900px) {
          .nav-links-list { display: none !important; }
          .nav-desktop-cta { display: none !important; }
          .nav-hamburger { display: flex !important; }
          /* Cleaner mobile pill — full-width-minus-margin with breathing room.
             Centered, not floating-narrow. Reads as a real nav bar, not a
             cramped widget. */
          .nav-pill {
            width: calc(100% - 24px) !important;
            max-width: 540px !important;
            padding: 9px 8px 9px 18px !important;
            gap: 12px !important;
            border-radius: 100px !important;
            box-shadow: 0 6px 28px rgba(12,12,11,0.10), inset 0 1px 0 rgba(255,255,255,0.92) !important;
            justify-content: space-between !important;
          }
          /* Hide the image logo on phone to free up space; text logo stays */
          .nav-pill > a[href="/"] > img { display: none !important; }
          .nav-pill > a[href="/"] > span { font-size: 15px !important; }
          .nav-pill > a[href="/"] { gap: 0 !important; }
          .nav-hamburger {
            width: 44px !important;
            height: 44px !important;
            flex-shrink: 0 !important;
            border-radius: 50% !important;
            background: rgba(12,12,11,0.05) !important;
          }
          .nav-pill.nav-on-dark .nav-hamburger {
            background: rgba(255,255,255,0.08) !important;
          }
          .nav-hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg) !important; }
          .nav-hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg) !important; }
        }
        @media (max-width: 380px) {
          .nav-pill {
            width: calc(100% - 16px) !important;
            padding: 7px 6px 7px 16px !important;
            gap: 10px !important;
          }
          .nav-pill > a[href="/"] > span { font-size: 14px !important; }
          .nav-hamburger { width: 42px !important; height: 42px !important; }
        }

        /* Mobile dropdown menu — full-height so the page underneath is hidden,
           with a clear "Menu" eyebrow so users know what they're looking at.
           Respects iOS safe area at the bottom. */
        .mobile-nav-menu {
          position: fixed;
          top: 0; left: 0; right: 0;
          bottom: 0;
          background: rgba(242,238,231,0.98);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border-bottom: 1px solid rgba(12,12,11,0.07);
          z-index: 499;
          padding: 96px 24px calc(28px + env(safe-area-inset-bottom));
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 4px;
          font-family: Inter, sans-serif;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.6px;
          color: #0C0C0B;
          text-decoration: none;
          border-bottom: 1px solid rgba(12,12,11,0.08);
          transition: color 0.2s;
          min-height: 56px;
        }
        .mobile-nav-link:last-of-type { border-bottom: none; }
        .mobile-nav-link:active { color: #E8541A; }
        .mobile-nav-cta {
          margin-top: 28px;
          display: block;
          width: 100%;
          text-align: center;
          background: #0C0C0B;
          color: #F2EEE7;
          padding: 18px 32px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          font-family: Inter, sans-serif;
          box-shadow: 0 10px 30px rgba(12,12,11,0.22);
          min-height: 54px;
          box-sizing: border-box;
        }
        @media (max-width: 380px) {
          .mobile-nav-menu { padding: 88px 20px calc(24px + env(safe-area-inset-bottom)); }
          .mobile-nav-link { font-size: 21px; padding: 16px 4px; }
        }
      `}</style>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {links.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={closeMobile}
                  scroll={true}
                >
                  {link.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8A49B" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </motion.div>
            ))}
            <button
              type="button"
              className="mobile-nav-cta"
              onClick={() => {
                closeMobile();
                (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
              }}
              aria-label={BOOK_CALL_LABEL_LONG}
              style={{ border: 'none', cursor: 'pointer' }}
            >
              {BOOK_CALL_LABEL_LONG}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        ref={navRef}
        className={`nav-pill${onDark ? ' nav-on-dark' : ''}`}
        style={{
          position: 'fixed',
          top: scrolled ? '12px' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
          padding: '14px 24px',
          background: 'rgba(255,255,255,0.60)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.75)',
          borderRadius: '100px',
          boxShadow: scrolled
            ? '0 12px 60px rgba(12,12,11,0.14), inset 0 1px 0 rgba(255,255,255,0.9)'
            : '0 8px 40px rgba(12,12,11,0.09), inset 0 1px 0 rgba(255,255,255,0.9)',
          width: 'calc(100% - 80px)',
          maxWidth: '1160px',
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          opacity: 0,
        }}
      >
        {/* Logo — image with text fallback. If /logo.png loads, the text is hidden
           via onLoad; if it errors (404, slow connection), text stays visible. */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
            textDecoration: 'none',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            width={126}
            height={28}
            style={{
              height: 28,
              width: 'auto',
              display: 'block',
              // Rounded corners on the dark pill background of the logo png
              // so it matches the overall nav-pill / button language on the
              // site (rounded glass surfaces everywhere). 8px is the "card"
              // radius standard; bump to 14 (= half height) for a full pill.
              borderRadius: 8,
            }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            color: '#0C0C0B',
            whiteSpace: 'nowrap',
          }}>
            Echo<span style={{ color: '#E8541A' }}>Pulse</span>
          </span>
        </Link>

        {/* Desktop links — Link gives soft client-side nav back to / + hash scroll,
           so jumping back from /services/* doesn't trigger a full reload. */}
        <ul className="nav-links-list" style={{ display: 'flex', gap: '28px', listStyle: 'none', margin: 0, padding: 0 }}>
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`nav-link ${activeSection && link.href === `/#${activeSection}` ? 'is-active' : ''}`}
                aria-current={activeSection && link.href === `/#${activeSection}` ? 'page' : undefined}
                scroll={true}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA — opens the in-page BookCallModal (iframe Calendly) so
           users stay on the site instead of leaving for a new tab. */}
        <button
          type="button"
          onClick={() => (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.()}
          className="nav-cta-btn nav-desktop-cta"
          aria-label={BOOK_CALL_LABEL_LONG}
          data-cursor-hover
        >
          <span>{BOOK_CALL_LABEL}</span>
        </button>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </>
  );
}
