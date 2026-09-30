'use client';

import { useSyncExternalStore } from 'react';

/**
 * Analytics consent.
 *
 * WHY THIS EXISTS
 *
 * Google Analytics and Microsoft Clarity both fired on every page load for
 * every visitor, with no banner and no way to decline. Clarity is a session
 * recorder: it captures scroll, clicks, input interaction and replays the
 * session. The site names the UK and Western Europe as served markets, so
 * that is a GDPR problem rather than a stylistic one, and consent has to be
 * collected BEFORE the tags load, not alongside them.
 *
 * WHY useSyncExternalStore
 *
 * The obvious version reads localStorage in a useEffect and calls setState,
 * which trips react-hooks/set-state-in-effect and forces a second render on
 * every mount. useSyncExternalStore is the right primitive: it subscribes
 * properly, it keeps multiple mounted readers in sync, and its third argument
 * is the server snapshot. That has to be 'unknown' so the server HTML and the
 * first client render agree and hydration does not warn, which also means the
 * banner is never in the server HTML and cannot be scraped into a page
 * snapshot or flash before JavaScript runs.
 */

export type ConsentChoice = 'unknown' | 'granted' | 'denied';

const KEY = 'ep-analytics-consent';
/** Fired on the window when the choice changes, so every reader re-renders. */
const EVENT = 'ep-consent-change';

function read(): ConsentChoice {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : 'unknown';
  } catch {
    // Private mode, disabled storage, or a locked-down browser. Treat an
    // unreadable store as no consent given, never as consent granted.
    return 'unknown';
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  // 'storage' covers the same visitor choosing in another tab.
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function useConsent(): ConsentChoice {
  return useSyncExternalStore(subscribe, read, () => 'unknown' as const);
}

export function setConsent(choice: Exclude<ConsentChoice, 'unknown'>) {
  try {
    window.localStorage.setItem(KEY, choice);
  } catch {
    /* Choice will not persist, but the current page still honours it. */
  }
  window.dispatchEvent(new Event(EVENT));
}
