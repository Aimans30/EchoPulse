/**
 * Analytics wrapper — thin façade so we can swap providers without touching
 * call-sites. Currently routes to GA4 (via window.gtag, loaded by
 * @next/third-parties/google in app/layout.tsx) and Microsoft Clarity
 * (via window.clarity).
 *
 * Standard event names used across the site:
 *   cta_pilot_click       → Pilot CTAs (hero, pricing, sticky bar, ribbon)
 *   cta_call_click        → Strategy-call CTAs (BOOK_CALL_URL anywhere)
 *   lead_magnet_submit    → Lead magnet email form
 *   call_booked           → Calendly post-message confirmation
 *   scroll_depth          → 25 / 50 / 75 / 100% scroll milestones
 *   demo_open             → Hero "Watch a 2-min demo" modal opens
 */

type EventProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      action: string,
      params?: Record<string, unknown>,
    ) => void;
    clarity?: (action: string, ...args: unknown[]) => void;
  }
}

export function track(event: string, props?: EventProps) {
  if (typeof window === 'undefined') return;
  // GA4
  try {
    window.gtag?.('event', event, props ?? {});
  } catch { /* non-fatal */ }
  // Clarity — pass event as a custom tag so it shows up on session recordings
  try {
    if (props) {
      Object.entries(props).forEach(([k, v]) => {
        if (v !== undefined) window.clarity?.('set', k, String(v));
      });
    }
    window.clarity?.('event', event);
  } catch { /* non-fatal */ }
  // Dev-only console echo so you can see events firing locally
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[analytics]', event, props ?? {});
  }
}

/** CTA helpers — call from onClick handlers across the site */
export const trackPilotClick = (location: string) =>
  track('cta_pilot_click', { location });

export const trackCallClick = (location: string) =>
  track('cta_call_click', { location });

export const trackLeadMagnetSubmit = (source: string) =>
  track('lead_magnet_submit', { source });

export const trackCallBooked = () => track('call_booked');

export const trackDemoOpen = (location: string) =>
  track('demo_open', { location });

export const trackScrollDepth = (percent: 25 | 50 | 75 | 100) =>
  track('scroll_depth', { percent });
