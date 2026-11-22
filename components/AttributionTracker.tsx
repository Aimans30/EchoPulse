'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent } from '@/lib/consent';
import { captureAttribution } from '@/lib/attribution';
import { decorateBookingUrl, isBookingUrl, FREE_EDITS_URL } from '@/lib/links';
import { firedRecently, track, trackCallClick, trackFreeEditsClick, trackPilotClick } from '@/lib/analytics';

/**
 * Mounted once, from components/AnalyticsProvider (which app/layout.tsx
 * already renders). Renders nothing. Two jobs:
 *
 * 1. FIRST-TOUCH ATTRIBUTION. On every route change it calls
 *    captureAttribution(), which stores where this visit came from
 *    (lib/attribution.ts).
 *
 * 2. ONE LISTENER FOR EVERY CONVERSION LINK. Many booking and free-edits
 *    links are plain anchors in server components, which cannot carry an
 *    onClick. Instead of turning each into a client component, this listens
 *    at the document:
 *      - any link to cal.com gets the visitor's attribution written into its
 *        href just before the browser follows it (so it stays a real anchor
 *        with a working static href), and fires `book_call_click`
 *      - any link to /free-edits fires `free_edits_click`
 *      - any element with data-track="event_name" fires that event too
 *    Components that already track their own click are not double counted:
 *    the check is deferred until their handler has run, and firedRecently()
 *    sees it.
 *
 *    Markup contract for a tracked link:
 *      data-track-location="case_study_hero"   which button (recommended)
 *      data-track="case_study_cta_click"       an extra page-level event (optional)
 *    Without data-track-location the location is derived from the link's own
 *    parameters or the nearest element with an id.
 */

/** UK and EU visitors are asked before anything is kept beyond the visit. */
function needsConsent(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    return tz.startsWith('Europe/') || tz.startsWith('Atlantic/') || tz === 'Arctic/Longyearbyen';
  } catch {
    return true;
  }
}

function gpc(): boolean {
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

function slug(v: string): string {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);
}

function locationFor(a: HTMLAnchorElement): string {
  const tagged = a.closest<HTMLElement>('[data-track-location]')?.dataset.trackLocation;
  if (tagged) return tagged;
  if (isBookingUrl(a.href)) {
    // Links that tag themselves (the blog cards use utm_medium=blog_inline etc.).
    try {
      const q = new URL(a.href).searchParams;
      const own =
        q.get('metadata[ep_location]') ||
        (q.get('utm_source') === 'echopulse.media' ? q.get('utm_content') : q.get('utm_medium'));
      if (own) return slug(own);
    } catch { /* fall through */ }
  }
  const page = slug(window.location.pathname) || 'home';
  const anchor = a.closest<HTMLElement>('[id]:not(main):not(body)');
  const region = a.closest('footer') ? 'footer' : a.closest('nav, header') ? 'nav' : anchor ? slug(anchor.id) : 'link';
  return `${page}_${region}`;
}

function anchorOf(e: Event): HTMLAnchorElement | null {
  const t = e.target;
  return t instanceof Element ? t.closest<HTMLAnchorElement>('a[href]') : null;
}

export default function AttributionTracker() {
  const pathname = usePathname();
  const choice = useConsent();

  // The 90-day copy is only written when the visitor has allowed analytics,
  // or lives where no prior consent is required and has not declined.
  useEffect(() => {
    const persist = !gpc() && (choice === 'granted' || (choice === 'unknown' && !needsConsent()));
    captureAttribution(persist);
  }, [pathname, choice]);

  useEffect(() => {
    // Capture phase, before the browser acts on the link: write attribution
    // into the href. pointerdown and contextmenu cover middle-click, long
    // press and "open in new tab", which never produce a click event.
    const decorate = (e: Event) => {
      const a = anchorOf(e);
      if (!a || !isBookingUrl(a.href)) return;
      try {
        const next = decorateBookingUrl(a.href, locationFor(a));
        if (next !== a.href) a.href = next;
      } catch { /* leave the working static href alone */ }
    };

    // Also registered in the capture phase, because some components stop the
    // click from bubbling (the work-wall lightbox does), which would hide it
    // from a bubble listener. The work is deferred one tick so any React
    // onClick on the link has already run and recorded its own event.
    const record = (e: Event) => {
      if (e.type === 'auxclick' && (e as MouseEvent).button !== 1) return;
      const a = anchorOf(e);
      if (!a) return;
      window.setTimeout(() => recordLink(a), 0);
    };
    const recordLink = (a: HTMLAnchorElement) => {
      const booking = isBookingUrl(a.href);
      let freeEdits = false;
      let pilot = false;
      if (!booking) {
        try {
          const u = new URL(a.href);
          const same = u.origin === window.location.origin;
          freeEdits = same && u.pathname === FREE_EDITS_URL;
          pilot = same && u.pathname === '/pilot';
        } catch { /* not a URL we track */ }
      }
      const extra = a.closest<HTMLElement>('[data-track]')?.dataset.track;
      if (!booking && !freeEdits && !pilot && !extra) return;
      const location = locationFor(a);
      if (pilot && !firedRecently('cta_pilot_click')) trackPilotClick(location);
      if (booking && !firedRecently('book_call_click')) trackCallClick(location);
      if (freeEdits && !firedRecently('free_edits_click')) trackFreeEditsClick(location);
      if (extra && /^[a-z0-9_]{3,40}$/.test(extra) && !firedRecently(extra)) {
        track(extra, {
          location,
          ...(booking ? { cta: 'book_call' } : freeEdits ? { cta: 'free_edits' } : {}),
          page: window.location.pathname.slice(0, 100),
        });
      }
    };

    // A plain click on any cal.com link opens the calendar in the on-site
    // modal instead of leaving the site. Modifier clicks, middle clicks and
    // links marked data-no-modal (the modal's own "open in a new tab"
    // fallback) keep normal link behaviour, and if the modal is not mounted
    // the link simply works as a link. Registered after `record`, and the
    // modal opens a tick later, so the click is tracked first and the modal
    // names the button that opened it.
    const intercept = (e: Event) => {
      const me = e as MouseEvent;
      if (me.defaultPrevented || me.button !== 0 || me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return;
      const a = anchorOf(e);
      if (!a || !isBookingUrl(a.href) || a.closest('[data-no-modal]')) return;
      const w = window as unknown as { openBookCallModal?: () => void };
      if (typeof w.openBookCallModal !== 'function') return;
      e.preventDefault();
      window.setTimeout(() => w.openBookCallModal?.(), 0);
    };

    const captureEvents = ['pointerdown', 'click', 'auxclick', 'contextmenu', 'keydown'] as const;
    captureEvents.forEach((n) => document.addEventListener(n, decorate, true));
    document.addEventListener('click', record, true);
    document.addEventListener('click', intercept, true);
    document.addEventListener('auxclick', record, true);
    return () => {
      captureEvents.forEach((n) => document.removeEventListener(n, decorate, true));
      document.removeEventListener('click', record, true);
      document.removeEventListener('click', intercept, true);
      document.removeEventListener('auxclick', record, true);
    };
  }, []);

  return null;
}
