/**
 * Analytics wrapper — thin façade so we can swap providers without touching
 * call-sites. Currently routes to GA4 (via window.gtag, loaded by
 * @next/third-parties/google in app/layout.tsx) and Microsoft Clarity
 * (via window.clarity).
 *
 * EVENT NAMES (the full table with parameters is in docs/tracking.md)
 *   free_edits_click      a "Get 2 free edits" button or link        {location, page}
 *   free_edits_submit     the free-edits form was sent                {source, ft_*}
 *   book_call_click       any booking button or Cal.com link          {location, page}
 *   plan_select           a plan was chosen                           {plan, location, page}
 *   plan_intake_submit    the plan questions were submitted           {plan, saved, ft_*}
 *   booking_confirmed     /booked loaded after a Cal.com booking      {via, booked_from, location, ft_*}
 *   case_study_cta_click  a button on a case study page               {location, cta, page}
 *   work_wall_cta_click   a button on the work wall                   {location, cta, page}
 *   work_video_open       a work-wall video was opened                {video, brand, page}
 *   newsletter_submit     a newsletter signup                         {source, ft_*}
 *   lead_magnet_submit    any other email capture (shot list, PDF)    {source, ft_*}
 *   cta_pilot_click       Pilot buttons that are not a plan choice    {location}
 *   scroll_depth          25 / 50 / 75 / 100% scroll milestones       {percent}
 *   demo_open             hero demo modal                             {location}
 *
 * RULES
 *   - No personal data in any parameter: no names, emails, phone numbers or
 *     free text a visitor typed.
 *   - `location` is which button, snake_case; `page` is the path it was on.
 *   - Old names still passed by components this file does not own are
 *     translated in track() (see RENAMED), so GA4 only ever sees the names
 *     above.
 */

import { firstTouchParams, lastBookingClick, rememberBookingClick } from './attribution';

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

/** Names that were in use before Nov 2026, and what they are now. */
const RENAMED: Record<string, string> = {
  cta_call_click: 'book_call_click',
  cta_free_edits_click: 'free_edits_click',
  call_booked: 'booking_confirmed',
};

/** Event name -> when it last fired. Lets the site-wide link listener skip a click a component already recorded. */
const lastFired = new Map<string, number>();

/** True when `event` was tracked within the last `ms` milliseconds. */
export function firedRecently(event: string, ms = 150): boolean {
  const t = lastFired.get(event);
  return t !== undefined && Date.now() - t < ms;
}

const pagePath = () => (typeof window === 'undefined' ? '' : window.location.pathname.slice(0, 100));

export function track(rawEvent: string, rawProps?: EventProps) {
  if (typeof window === 'undefined') return;
  let event = RENAMED[rawEvent] ?? rawEvent;
  let props = rawProps;
  // Free-edits buttons used to be reported as Pilot clicks
  // (cta_pilot_click {location: 'hero_secondary_free_edits'}). The Pilot and
  // the free sample are different steps, so they are split here for every
  // caller at once.
  if (event === 'cta_pilot_click' && typeof props?.location === 'string' && props.location.includes('free_edits')) {
    event = 'free_edits_click';
  }
  if ((event === 'book_call_click' || event === 'free_edits_click') && props && props.page === undefined) {
    props = { ...props, page: pagePath() };
  }
  if (event === 'book_call_click' && typeof props?.location === 'string') rememberBookingClick(props.location);
  lastFired.set(event, Date.now());
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

/** Any booking button or Cal.com link. Also remembers the click for /booked. */
export const trackCallClick = (location: string) =>
  track('book_call_click', { location, page: pagePath() });
export const trackBookCallClick = trackCallClick;

export const trackFreeEditsClick = (location: string) =>
  track('free_edits_click', { location, page: pagePath() });

/** A plan was chosen: a pricing card button, or a switch inside the intake modal. */
export const trackPlanSelect = (plan: string, location: string) =>
  track('plan_select', { plan, location, page: pagePath() });

/** The plan questions were submitted. `saved` = /api/lead confirmed it. */
export function trackPlanIntakeSubmit(plan: string, saved: boolean) {
  // The calendar that follows is a booking step too, so /booked can credit it.
  rememberBookingClick(`plan_intake_${plan}`);
  track('plan_intake_submit', { plan, saved, page: pagePath(), ...firstTouchParams() });
}

/** The free-edits form was sent. Its own conversion, not a lead magnet. */
export const trackFreeEditsSubmit = (source = 'free_edits_form') =>
  track('free_edits_submit', { source, page: pagePath(), ...firstTouchParams() });

export const trackNewsletterSubmit = (source: string) =>
  track('newsletter_submit', { source, page: pagePath(), ...firstTouchParams() });

/**
 * Email captures. Kept as the one entry point the forms already call, and
 * routed by source so each kind of signup is its own event:
 *   free_edits_form      -> free_edits_submit
 *   *newsletter*         -> newsletter_submit
 *   anything else        -> lead_magnet_submit
 */
export function trackLeadMagnetSubmit(source: string) {
  if (source === 'free_edits_form' || source.startsWith('free_edits')) return trackFreeEditsSubmit(source);
  if (source.includes('newsletter')) return trackNewsletterSubmit(source);
  track('lead_magnet_submit', { source, page: pagePath(), ...firstTouchParams() });
}

export const trackCaseStudyCta = (location: string, cta: 'book_call' | 'free_edits') =>
  track('case_study_cta_click', { location, cta, page: pagePath() });

export const trackWorkWallCta = (location: string, cta: 'book_call' | 'free_edits') =>
  track('work_wall_cta_click', { location, cta, page: pagePath() });

export const trackWorkVideoOpen = (video: string, brand: string) =>
  track('work_video_open', { video: video.slice(0, 80), brand: brand.slice(0, 60), page: pagePath() });

/**
 * A booking was confirmed (/booked loaded after Cal.com's redirect).
 *
 * `via` is "modal" when /booked loaded inside a booking iframe and "new_tab"
 * when Cal.com was opened in its own tab. Either way `booked_from` is the page
 * whose button was clicked, taken from the click remembered by
 * book_call_click, never "/booked". First-touch fields ride along.
 */
export function trackBookingConfirmed(via: 'modal' | 'new_tab', fallbackPage?: string) {
  const click = lastBookingClick();
  track('booking_confirmed', {
    via,
    booked_from: click?.page ?? fallbackPage ?? 'unknown',
    location: click?.location ?? 'unknown',
    ...firstTouchParams(),
  });
}

export const trackDemoOpen = (location: string) =>
  track('demo_open', { location });

export const trackScrollDepth = (percent: 25 | 50 | 75 | 100) =>
  track('scroll_depth', { percent });
