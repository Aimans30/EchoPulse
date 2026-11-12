'use client';

/**
 * AnalyticsProvider — mounts in app/layout.tsx and handles cross-cutting
 * analytics signals that don't belong to any single component:
 *  • Scroll-depth milestones (25/50/75/100%)
 *  • Calendly book-confirmed via postMessage
 *  • Microsoft Clarity script loader (GA4 is loaded via @next/third-parties)
 *
 * Reads NEXT_PUBLIC_GA_ID and NEXT_PUBLIC_CLARITY_ID from env. Both are
 * optional — if either is unset the corresponding integration is skipped
 * silently so dev builds don't spam the network tab.
 */

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { trackCallBooked, trackScrollDepth } from '@/lib/analytics';


export default function AnalyticsProvider() {
  const firedMilestones = useRef<Set<number>>(new Set());
  // The scroll and booking effects below are left running regardless. Every
  // one of them ends at lib/analytics `track()`, which calls `window.gtag?.()`
  // with optional chaining, so with GA unloaded they are silent no-ops that
  // set no cookie and make no request. Gating them too would mean the
  // milestones a visitor crossed before clicking Allow are lost for no
  // privacy gain.

  // Scroll-depth tracker — fires once each at 25/50/75/100% per pageview
  useEffect(() => {
    const milestones = [25, 50, 75, 100] as const;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrolled = window.scrollY + window.innerHeight;
        const total = doc.scrollHeight;
        const pct = Math.min(100, Math.round((scrolled / total) * 100));
        for (const m of milestones) {
          if (pct >= m && !firedMilestones.current.has(m)) {
            firedMilestones.current.add(m);
            trackScrollDepth(m);
          }
        }
        raf = 0;
        // All four milestones are one-shot, so once the last one has fired
        // this handler can never do anything again. Detaching it stops a
        // rAF from being scheduled on every scroll frame for the rest of
        // the session, which on a phone is the difference between a
        // scroll that hands the main thread straight back to the
        // compositor and one that queues work behind every gesture.
        if (firedMilestones.current.size === milestones.length) {
          window.removeEventListener('scroll', onScroll);
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Booking confirmation.
  //
  // This used to listen for `calendly.event_scheduled`, but the site embeds
  // Cal.com, which never sends that message, so `call_booked` could not fire
  // and no booking was ever attributed to a page. Cal.com is now set to
  // redirect to /booked after a booking. When that page loads inside the
  // booking modal's iframe it posts `ep:call_booked` to this window, and the
  // event is recorded here with the page the visitor booked from. (Opened
  // directly in a tab, /booked records the event itself.)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string } | undefined;
      if (data && typeof data === 'object' && data.type === 'ep:call_booked') {
        trackCallBooked(window.location.pathname);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // No custom page_view: GA4 sends its own on every page, so the extra event
  // counted each view twice.

  return (
    <>
      {/* Microsoft Clarity — only when the env var is set AND the visitor has
          allowed analytics.
          This is the second of the two Clarity snippets that used to exist.
          The other one lived in app/layout.tsx with a hard-coded project id
          and has moved into components/ConsentGate.tsx; gating only that one
          would have left this path firing ungated whenever
          NEXT_PUBLIC_CLARITY_ID was set, which is the kind of half-fix that
          looks compliant and is not. The `if (c[a]) return` guard still
          de-dupes if both ever run.
          `lazyOnload` for the same reason as before: a session recorder has no
          business competing with hydration for main-thread time. */}
      {/* Clarity now loads from components/ConsentGate.tsx, gated by region
          (no banner). Kept out of here so it has exactly one owner. */}
    </>
  );
}
