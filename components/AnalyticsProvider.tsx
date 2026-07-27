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
import { track, trackCallBooked, trackScrollDepth } from '@/lib/analytics';

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function AnalyticsProvider() {
  const firedMilestones = useRef<Set<number>>(new Set());

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

  // Calendly post-message listener — fires call_booked when a visitor
  // confirms a booking inside an embedded Calendly widget
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as { event?: string } | undefined;
      if (!data || typeof data !== 'object') return;
      if (data.event === 'calendly.event_scheduled') {
        trackCallBooked();
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Track the initial pageview as a custom event so it lines up with the
  // rest of the funnel even if GA's automatic pageview is blocked
  useEffect(() => {
    track('page_view', { path: window.location.pathname });
  }, []);

  return (
    <>
      {/* Microsoft Clarity — only when env var is set.
          IMPORTANT: app/layout.tsx also ships a Clarity snippet with a
          hard-coded project id. Whenever NEXT_PUBLIC_CLARITY_ID is set in the
          environment BOTH used to run, so the tag was fetched and the page
          instrumented twice: two sets of DOM-mutation and input listeners on
          every interaction, which is paid for directly in INP. The
          `if (c[a]) return` guard (mirrored in layout.tsx) makes whichever
          one boots first the only one that boots.
          `lazyOnload` for the same reason as layout.tsx: a session recorder
          has no business competing with hydration for main-thread time. */}
      {CLARITY_ID && (
        <Script
          id="ms-clarity"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                if(c[a])return;
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `,
          }}
        />
      )}
    </>
  );
}
