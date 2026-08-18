'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trackPilotClick } from '@/lib/analytics';
import { useGeoPrice } from '@/lib/useGeoPrice';

const SESSION_KEY = 'ep_pilot_teaser_v6';
const SHOW_DELAY_MS = 2000;
const AUTO_DISMISS_MS = 4_000;
// Desktop-only — popup never shows on phones (the MobileStickyCTA handles
// the same conversion path with a thumb-friendly bottom bar instead).
const MIN_VIEWPORT_WIDTH = 768;

/**
 * Routes this popup must never appear on.
 *
 * A reader who arrived on an article from search is mid-sentence, not
 * shopping. Interrupting that with a sales card is the fastest way to send
 * them back to the results page, and it works against the whole point of the
 * blog, which is to earn trust before asking for anything. The article already
 * ends with its own contextual CTA (components/BlogFooterCTA.tsx), which is
 * the right place to make the ask.
 */
const SUPPRESSED_PREFIXES = ['/blog'];

export default function PilotPopup() {
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const { currency, prices } = useGeoPrice();
  const dismissTimer = useRef<number | null>(null);
  const pathname = usePathname();
  const suppressed = SUPPRESSED_PREFIXES.some(
    (p) => pathname === p || pathname?.startsWith(`${p}/`)
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (suppressed) return;
    if (window.innerWidth < MIN_VIEWPORT_WIDTH) return;
    // Width alone is not a phone test. A modern handset in landscape reports
    // 850-950px and would have sailed past MIN_VIEWPORT_WIDTH, which is
    // exactly the case Google's intrusive-interstitial rule is written about
    // (it evaluates the mobile rendering, not the CSS breakpoint we chose).
    // A coarse pointer is the honest signal for "this is a touchscreen", and
    // it also covers tablets, where an auto-appearing card is equally rude.
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (sessionStorage.getItem(SESSION_KEY) === '1') return;
    // Respect reduced-motion preference — keyboard / a11y users don't want a
    // popup animating in either. Skip showing the notification entirely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [suppressed]);

  // Belt and braces: if a client-side navigation lands on a suppressed route
  // while the card is already on screen, take it down immediately rather than
  // waiting for the auto-dismiss timer.
  useEffect(() => {
    if (suppressed) setVisible(false);
  }, [suppressed]);

  const dismiss = () => {
    setVisible(false);
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* private mode */ }
  };

  useEffect(() => {
    if (!visible || paused) {
      if (dismissTimer.current) {
        window.clearTimeout(dismissTimer.current);
        dismissTimer.current = null;
      }
      return;
    }
    const id = window.setTimeout(() => {
      setVisible(false);
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* private mode */ }
    }, AUTO_DISMISS_MS);
    dismissTimer.current = id;
    return () => window.clearTimeout(id);
  }, [visible, paused]);

  const onClickCta = () => {
    trackPilotClick('teaser_card');
    dismiss();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="ep-pilot-glass"
          role="dialog"
          aria-label="EchoPulse Pilot"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="ep-pilot-close"
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
              <line x1="1" y1="1" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="1" x2="1" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="ep-pilot-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
              className="ep-pilot-mark"
            />
            <div className="ep-pilot-text">
              <div className="ep-pilot-brand">EchoPulse</div>
              <div className="ep-pilot-headline">
                Pilot starts at {currency}{prices.pilot}
              </div>
              <div className="ep-pilot-sub">
                See real work in 14 days. No retainer commitment.
              </div>
            </div>
          </div>

          {/* Absolute "/#pricing", not a bare "#pricing". Only the homepage and
              the ICP pages contain that id, so on any other route the bare
              fragment scrolled nowhere and the button silently did nothing. */}
          <a
            href="/#pricing"
            onClick={onClickCta}
            data-cursor-hover
            className="ep-pilot-cta"
          >
            <span>See the Pilot</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Pure CSS countdown bar — animation paused when user hovers card. */}
          <div
            aria-hidden="true"
            className={`ep-pilot-bar ${paused ? 'is-paused' : ''}`}
            key={visible ? 'on' : 'off'}
          />

          <style>{`
            .ep-pilot-glass {
              position: fixed;
              right: 24px;
              bottom: 24px;
              z-index: 700;
              width: 360px;
              max-width: calc(100vw - 32px);
              background: rgba(255, 255, 255, 0.55);
              backdrop-filter: blur(28px) saturate(180%);
              -webkit-backdrop-filter: blur(28px) saturate(180%);
              border: 1px solid rgba(255, 255, 255, 0.85);
              border-radius: 18px;
              padding: 14px 14px 14px;
              box-shadow:
                0 20px 60px -10px rgba(12,12,11,0.25),
                0 8px 24px -6px rgba(12,12,11,0.12),
                inset 0 1px 0 rgba(255,255,255,0.85),
                inset 0 -1px 0 rgba(12,12,11,0.04);
              font-family: Inter, sans-serif;
              overflow: hidden;
            }
            .ep-pilot-close {
              position: absolute;
              top: 10px;
              right: 10px;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: rgba(12,12,11,0.04);
              border: 1px solid rgba(12,12,11,0.06);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              color: rgba(12,12,11,0.5);
              padding: 0;
              z-index: 2;
              transition: color 0.2s, background 0.2s;
              touch-action: manipulation;
            }
            /* The visible dot stays 22px so the card looks the same, but the
               hit area is pushed out to ~44px. Dismissing has to be the
               easiest thing on this card, and a 22px target is a miss-tap on
               any hybrid touch laptop that still reports a fine pointer. */
            .ep-pilot-close::before {
              content: "";
              position: absolute;
              top: -11px;
              right: -11px;
              bottom: -11px;
              left: -11px;
            }
            .ep-pilot-close:hover {
              color: #0C0C0B;
              background: rgba(12,12,11,0.08);
            }
            .ep-pilot-row {
              display: flex;
              gap: 12px;
              align-items: flex-start;
              padding-right: 20px;
            }
            .ep-pilot-mark {
              width: 40px;
              height: 40px;
              flex-shrink: 0;
              border-radius: 10px;
              background: linear-gradient(135deg, rgba(232,84,26,0.95), rgba(232,84,26,0.75));
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-weight: 900;
              font-size: 13px;
              letter-spacing: -0.5px;
              box-shadow: 0 4px 12px rgba(232,84,26,0.35), inset 0 1px 0 rgba(255,255,255,0.4);
            }
            .ep-pilot-text { min-width: 0; flex: 1; }
            .ep-pilot-brand {
              font-size: 11px;
              font-weight: 700;
              color: rgba(12,12,11,0.5);
              letter-spacing: -0.1px;
              margin-bottom: 2px;
            }
            .ep-pilot-headline {
              font-size: 13.5px;
              font-weight: 700;
              color: #0C0C0B;
              letter-spacing: -0.2px;
              line-height: 1.35;
              margin-bottom: 2px;
            }
            .ep-pilot-sub {
              font-size: 12px;
              color: rgba(12,12,11,0.6);
              line-height: 1.45;
              margin-bottom: 12px;
            }
            .ep-pilot-cta {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 9px 14px;
              background: rgba(12,12,11,0.92);
              color: #F2EEE7;
              border-radius: 10px;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.1px;
              text-decoration: none;
              transition: background 0.2s;
              position: relative;
              z-index: 1;
            }
            .ep-pilot-cta:hover { background: #E8541A; }

            /* Countdown progress bar: pure CSS animation, paused via class. */
            .ep-pilot-bar {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              height: 2px;
              background: linear-gradient(90deg, #E8541A, rgba(232,84,26,0.4));
              transform-origin: left;
              opacity: 0.7;
              animation: ep-pilot-countdown ${AUTO_DISMISS_MS}ms linear forwards;
            }
            .ep-pilot-bar.is-paused { animation-play-state: paused; }
            @keyframes ep-pilot-countdown {
              from { transform: scaleX(1); }
              to   { transform: scaleX(0); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
