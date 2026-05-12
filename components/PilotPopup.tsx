'use client';

/**
 * PilotPopup — single-shot teaser toast.
 *
 * Behavior the brief asked for:
 *  • Tiny. One line of copy. No big card.
 *  • Appears once on load, ~2.5s in.
 *  • Stays visible for ~6s, then fades on its own. No close button needed.
 *  • Once it's been shown this tab session, it's done — sessionStorage flag
 *    means nav between routes doesn't re-trigger it.
 *  • Hidden under 480px (the mobile sticky bar covers that audience).
 *
 * Mounts globally in app/layout.tsx so it surfaces on first page-load
 * regardless of which page the visitor lands on.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackPilotClick } from '@/lib/analytics';

const SESSION_KEY = 'ep_pilot_teaser_v2';
const SHOW_DELAY_MS = 2500;
const VISIBLE_MS = 6000;
const MIN_VIEWPORT_WIDTH = 480;

export default function PilotPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < MIN_VIEWPORT_WIDTH) return;
    if (sessionStorage.getItem(SESSION_KEY) === '1') return;

    const showTimer = setTimeout(() => {
      setVisible(true);
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* private mode */ }
    }, SHOW_DELAY_MS);

    const hideTimer = setTimeout(() => setVisible(false), SHOW_DELAY_MS + VISIBLE_MS);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#pricing"
          onClick={() => { trackPilotClick('teaser_toast'); setVisible(false); }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Pilot offer"
          style={{
            position: 'fixed',
            left: '24px',
            bottom: '24px',
            zIndex: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 16px 9px 12px',
            background: 'rgba(12,12,11,0.92)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '100px',
            boxShadow: '0 12px 32px rgba(12,12,11,0.30)',
            color: '#F2EEE7',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12.5px',
            fontWeight: 500,
            letterSpacing: '-0.1px',
            textDecoration: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            maxWidth: 'calc(100vw - 48px)',
            overflow: 'hidden',
          }}
        >
          {/* Pulse dot */}
          <motion.span
            aria-hidden="true"
            animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.18, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#E8541A',
              boxShadow: '0 0 0 3px rgba(232,84,26,0.22)',
              flexShrink: 0,
            }}
          />

          <span style={{ color: '#E8541A', fontWeight: 700 }}>$299</span>
          <span style={{ color: 'rgba(242,238,231,0.85)' }}>· 12 LinkedIn posts + 5 blogs in 14 days</span>
          <span aria-hidden="true" style={{ color: 'rgba(242,238,231,0.55)', marginLeft: '2px' }}>→</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
