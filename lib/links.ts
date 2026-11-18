import { ALL_PLANS, type PlanKey } from './pricing';
import { getFirstTouch, mediumOf, sourceOf } from './attribution';

// Single source of truth for outbound conversion links.
// Every default CTA across the site reads from here.
//
// There is exactly ONE booking event. Every booking button on the site (the
// modal, the service pages, the blog footer) points at BOOK_CALL_URL below;
// there are no per-service overrides.

// One booking link everywhere (site, blog CTAs, outreach emails). 15 minutes.
// Decided 10 Nov 2026; the old marketing-agency event is retired.
export const BOOK_CALL_URL = 'https://cal.com/lakshya-soni-jvwfee/meeting-with-echopulse-team';

/**
 * CTA labels. THREE ONLY. Import from here, never hand-write a button label.
 *
 * A Sept 2026 audit counted nine different CTA labels across the site: Get a
 * free content audit, Book a Call, Book a Free Strategy Call (old label), Talk to Us,
 * Claim the Pilot, Start the Pilot, See how it works, Order this service, and
 * Let us build this for you. A visitor moving between three pages met three
 * different asks and had to work out whether they were the same thing.
 *
 * On "Get a free content audit": that label was chosen earlier because the
 * previous one described what the visitor gives up (their calendar) rather
 * than what they get. The objection to it is that clicking opens a CALL
 * booking modal, so the label and the next screen disagreed, and a promise the
 * following screen does not keep costs more trust than a flat label does
 * interest. Resolved in favour of matching the label to what happens, with
 * BOOK_CALL_REASSURANCE carrying the value that the old label was carrying.
 * Render that line under the button wherever there is room.
 */

/** Primary. Every booking CTA site-wide. */
export const BOOK_CALL_LABEL = 'Book a free 15-minute call';
/** Same action, used where the button has room for a possessive. */
export const BOOK_CALL_LABEL_LONG = 'Book your free 15-minute call';
/** Secondary. Scrolls or links to explanatory content, never to booking. */
export const SECONDARY_CTA_LABEL = 'See how it works';
/**
 * Paid step ONLY. Never use for a booking link.
 *
 * Safe to hard-code the price because Pilot pricing is flat USD worldwide as
 * of Oct 2026 (see the FLAT_USD note in lib/useGeoPrice.ts). While regional
 * pricing was live this had to be a function, or a UK visitor got "Start the
 * $299 Pilot" under a card reading £239.
 */
export const PILOT_CTA_LABEL = 'Start the $299 Pilot';

/**
 * Kept for the day regional pricing comes back. Pass the same localized string
 * the pricing card is rendering, and the label follows it instead of
 * contradicting it.
 */
export function pilotCtaLabel(localizedPrice: string): string {
  return `Start the ${localizedPrice} Pilot`;
}

/**
 * Sub-line under the CTA. Answers the two questions that stop the click: how
 * long this costs me, and whether I am about to be sold to.
 */
export const BOOK_CALL_REASSURANCE = '15 minutes with Lakshya, the founder. No pitch.';

// Anchor target for in-page CTAs that should scroll to the bottom CTA
// section instead of leaving the page.
export const BOOK_CALL_ANCHOR = '#book-call';

/**
 * The free sample. The lowest-friction ask on the site: send footage, get 2
 * edited videos back within 48 hours, no card, no call. Lives in lib/pricing.ts
 * as FREE_SAMPLE; these are the link and label every CTA uses. The URL is the
 * internal /free-edits page (app/free-edits), whose form posts to /api/lead.
 * It was a mailto: link until Nov 2026. Keep it an internal path: open it in
 * the same tab, no target="_blank".
 */
export const FREE_EDITS_LABEL = 'Get 2 free edits';
export const FREE_EDITS_URL = '/free-edits';

/**
 * Per-plan booking calendars, used by the plan intake modal
 * (components/PlanIntakeModal.tsx) after a visitor picks a plan on a pricing
 * card and answers a few questions.
 *
 * OWNER: every plan points at the one booking event today. To send a plan to
 * its own Cal.com event (say a longer scoping call for Custom), paste that
 * event's URL in place of BOOK_CALL_URL on that plan's line. Nothing else
 * needs to change; the prefill and tracking parameters are added for you.
 */
export type BookablePlanKey = Exclude<PlanKey, 'free'>;

export const PLAN_BOOK_URLS: Record<BookablePlanKey, string> = {
  pilot: BOOK_CALL_URL, //    $299 Pilot
  presence: BOOK_CALL_URL, // $399/month Presence Engine
  growth: BOOK_CALL_URL, //   $1,997/month Growth
  full: BOOK_CALL_URL, //     Custom
};

/** "Pilot, $299 one-off, 14 days" / "Growth, $1,997/month, month-to-month" / "Custom, scoped on a call". */
export function planSummary(planKey: BookablePlanKey): string {
  const plan = ALL_PLANS.find((p) => p.key === planKey);
  if (!plan) return planKey;
  if (plan.priceUsd <= 0) return `${plan.name}, ${plan.per}`;
  return `${plan.name}, ${plan.priceLabel}${plan.per.startsWith('/') ? '' : ' '}${plan.per}`;
}

/** Cal.com shows the notes in a small field; keep what we prefill short. */
const BOOK_NOTES_MAX = 500;

/**
 * ONE BUILDER FOR EVERY CAL.COM LINK. Do not hand-write a Cal.com URL.
 *
 * What each parameter means on the booking (docs/tracking.md has the table):
 *   utm_source    where the visitor first came from: their utm_source, else
 *                 the referring host (google.com, chatgpt.com), else "direct"
 *   utm_medium    their utm_medium, else the kind of referrer
 *                 (search, ai, social, email, paid, referral, direct)
 *   utm_campaign  their utm_campaign, when they arrived with one
 *   utm_term      the page they first landed on
 *   utm_content   the button that was clicked (the `location`)
 *   metadata[ep_page]      the page the button was on
 *   metadata[ep_landing]   the landing page again, for the Cal.com webhook
 *   metadata[ep_source], metadata[ep_medium], metadata[ep_location], metadata[ep_plan]
 *
 * Three ways to use it:
 *   1. `bookingUrl({ location })` in the browser, in an event handler or an
 *      effect (iframes, window.open). Full attribution.
 *   2. `staticBookingUrl(location)` for the href of an anchor that is rendered
 *      on the server or during hydration. It is a real, working link with the
 *      button name in it; components/AttributionTracker upgrades it to (1) at
 *      the moment of the click, for every Cal.com anchor on the site.
 *   3. `decorateBookingUrl(href, location)` to upgrade an existing Cal.com URL
 *      that already carries its own campaign parameters (the blog links):
 *      their utm_* values are kept and only the metadata[...] fields are added.
 */
export interface BookingUrlOptions {
  /** Which button. snake_case, page first: "case_study_hero", "work_wall_lightbox". */
  location: string;
  /** A different Cal.com event URL. Defaults to BOOK_CALL_URL. */
  base?: string;
  /** Adds the modal's display parameters (15-minute slot, light theme, month view). */
  embed?: boolean;
  /** Plan key, when the booking follows a plan choice. */
  plan?: string;
  /** Cal.com prefills its form from these. Never sent to analytics. */
  prefill?: { name?: string; email?: string; notes?: string };
}

/** Shown in Cal.com when the real source is not known (no JavaScript, or a server render). */
const PLACEHOLDER_SOURCE = 'echopulse.media';

export function isBookingUrl(href: string): boolean {
  try {
    return /(^|\.)cal\.com$/.test(new URL(href, 'https://echopulse.media').hostname);
  } catch {
    return false;
  }
}

/** Server-safe href: a working booking link that names the button. Pure, so it never causes a hydration mismatch. */
export function staticBookingUrl(location: string, base: string = BOOK_CALL_URL): string {
  const q = `utm_source=${PLACEHOLDER_SOURCE}&utm_medium=website&utm_content=${encodeURIComponent(location)}`;
  return `${base}${base.includes('?') ? '&' : '?'}${q}`;
}

/** Add first-touch attribution to any Cal.com URL. Browser only; on the server it returns the URL unchanged. */
export function decorateBookingUrl(href: string, location: string): string {
  if (typeof window === 'undefined') return href;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  const touch = getFirstTouch();
  const page = window.location.pathname;
  const source = touch ? sourceOf(touch) : 'direct';
  const medium = touch ? mediumOf(touch) : 'direct';
  const landing = touch?.landing_path || page;
  const q = url.searchParams;

  // A link that arrives with its own campaign tagging (lib/blogLinks.ts tags
  // per post) keeps it. Only our own placeholder is replaced.
  const ownTagging = q.has('utm_source') && q.get('utm_source') !== PLACEHOLDER_SOURCE;
  if (!ownTagging) {
    q.set('utm_source', source);
    q.set('utm_medium', medium);
    if (touch?.utm_campaign) q.set('utm_campaign', touch.utm_campaign);
    q.set('utm_term', landing);
    q.set('utm_content', location);
  }
  q.set('metadata[ep_source]', source);
  q.set('metadata[ep_medium]', medium);
  q.set('metadata[ep_landing]', landing);
  q.set('metadata[ep_page]', page);
  q.set('metadata[ep_location]', location);
  return url.toString();
}

/** The booking URL for a button, with everything known about where the visitor came from. */
export function bookingUrl(opts: BookingUrlOptions): string {
  const base = opts.base ?? BOOK_CALL_URL;
  const params: Array<[string, string]> = [];
  const name = (opts.prefill?.name ?? '').trim();
  const email = (opts.prefill?.email ?? '').trim();
  const notes = (opts.prefill?.notes ?? '').trim();
  if (name) params.push(['name', name]);
  if (email) params.push(['email', email]);
  if (notes) params.push(['notes', notes]);
  // duration=15 preselects the 15-minute slot. The Cal.com event offers
  // several lengths and defaulted to 20, which contradicted every page that
  // promises a 15-minute call.
  if (opts.embed) params.push(['duration', '15'], ['theme', 'light'], ['layout', 'month_view']);
  if (opts.plan) params.push(['metadata[ep_plan]', opts.plan]);
  const query = params.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  const withQuery = query ? `${base}${base.includes('?') ? '&' : '?'}${query}` : base;
  return decorateBookingUrl(staticBookingUrl(opts.location, withQuery), opts.location);
}

/**
 * Booking URL for a plan, with the visitor's details prefilled.
 *
 * Cal.com reads `name`, `email` and `notes` from the query string and fills
 * the booking form with them. The notes always start with "Plan: <name>" so
 * the booking itself says which plan the call is about. Everything else (the
 * 15-minute slot, the display settings and the attribution parameters) comes
 * from bookingUrl above, with the button recorded as plan_intake_<plan>.
 */
export function planBookUrl(
  planKey: BookablePlanKey,
  prefill: { name?: string; email?: string; notes?: string } = {},
): string {
  let notes = `Plan: ${planSummary(planKey)}`;
  const extra = (prefill.notes ?? '').trim();
  if (extra) notes += `\n${extra}`;
  if (notes.length > BOOK_NOTES_MAX) notes = `${notes.slice(0, BOOK_NOTES_MAX - 3).trimEnd()}...`;

  return bookingUrl({
    location: `plan_intake_${planKey}`,
    base: PLAN_BOOK_URLS[planKey] ?? BOOK_CALL_URL,
    embed: true,
    plan: planKey,
    prefill: { name: prefill.name, email: prefill.email, notes },
  });
}
