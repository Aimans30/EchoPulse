'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOK_CALL_URL, BOOK_CALL_LABEL, BOOK_CALL_LABEL_LONG } from '@/lib/links';

const links = [
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#work' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Detect if a Loader is currently mounted (homepage). If so, hold the nav until it fades.
    const hasLoader = typeof document !== 'undefined' && document.querySelector('[data-loader="true"]') !== null;
    const delay = hasLoader ? 1.2 : 0.2;
    gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay });
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <style>{`
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
          /* Compact mobile pill — fits content instead of stretching across screen */
          .nav-pill {
            width: auto !important;
            min-width: 220px !important;
            max-width: calc(100% - 24px) !important;
            padding: 10px 14px 10px 20px !important;
            gap: 18px !important;
            border-radius: 100px !important;
            box-shadow: 0 4px 24px rgba(12,12,11,0.08), inset 0 1px 0 rgba(255,255,255,0.9) !important;
          }
          .nav-pill > a[href="/"] { font-size: 15px !important; }
          .nav-hamburger { width: 32px !important; height: 32px !important; }
          .nav-hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg) !important; }
          .nav-hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg) !important; }
        }
        @media (max-width: 380px) {
          .nav-pill {
            min-width: 200px !important;
            padding: 9px 12px 9px 18px !important;
            gap: 14px !important;
          }
          .nav-pill > a[href="/"] { font-size: 14px !important; }
        }

        /* Mobile dropdown menu */
        .mobile-nav-menu {
          position: fixed;
          top: 0; left: 0; right: 0;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border-bottom: 1px solid rgba(12,12,11,0.07);
          z-index: 499;
          padding: 84px 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          font-family: Inter, sans-serif;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.6px;
          color: #0C0C0B;
          text-decoration: none;
          border-bottom: 1px solid rgba(12,12,11,0.07);
          transition: color 0.2s;
        }
        .mobile-nav-link:last-of-type { border-bottom: none; }
        .mobile-nav-link:active { color: #E8541A; }
        .mobile-nav-cta {
          margin-top: 20px;
          display: block;
          text-align: center;
          background: #E8541A;
          color: #fff;
          padding: 18px 32px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          font-family: Inter, sans-serif;
          box-shadow: 0 8px 32px rgba(232,84,26,0.32);
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
              <motion.a
                key={link.label}
                href={link.href}
                className="mobile-nav-link"
                onClick={closeMobile}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {link.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8A49B" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </motion.a>
            ))}
            <a
              href={BOOK_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-nav-cta"
              onClick={closeMobile}
              aria-label={BOOK_CALL_LABEL_LONG}
            >
              {BOOK_CALL_LABEL_LONG}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        ref={navRef}
        className="nav-pill"
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
        {/* Logo */}
        <a
          href="/"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            textDecoration: 'none',
            color: '#0C0C0B',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Echo<span style={{ color: '#E8541A' }}>Pulse</span>
        </a>

        {/* Desktop links */}
        <ul className="nav-links-list" style={{ display: 'flex', gap: '28px', listStyle: 'none', margin: 0, padding: 0 }}>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href={BOOK_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta-btn nav-desktop-cta"
          aria-label={BOOK_CALL_LABEL_LONG}
          data-cursor-hover
        >
          <span>{BOOK_CALL_LABEL}</span>
        </a>

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
