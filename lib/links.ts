import { ALL_PLANS, type PlanKey } from './pricing';

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
 * free content audit, Book a Call, Book a Free Strategy Call, Talk to Us,
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
export const BOOK_CALL_LABEL = 'Book a free strategy call';
/** Same action, used where the button has room for a possessive. */
export const BOOK_CALL_LABEL_LONG = 'Book your free strategy call';
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
export const BOOK_CALL_REASSURANCE = 'No pitch. You keep the roadmap whether or not you hire us.';

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
 * Booking URL for a plan, with the visitor's details prefilled.
 *
 * Cal.com reads `name`, `email` and `notes` from the query string and fills
 * the booking form with them. The notes always start with "Plan: <name>" so
 * the booking itself says which plan the call is about. The rest matches what
 * BookCallModal sends: the 15-minute slot, light theme, month view and the UTM
 * parameters (utm_content = the page path), plus utm_campaign = the plan.
 */
export function planBookUrl(
  planKey: BookablePlanKey,
  prefill: { name?: string; email?: string; notes?: string } = {},
): string {
  const base = PLAN_BOOK_URLS[planKey] ?? BOOK_CALL_URL;
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  let notes = `Plan: ${planSummary(planKey)}`;
  const extra = (prefill.notes ?? '').trim();
  if (extra) notes += `\n${extra}`;
  if (notes.length > BOOK_NOTES_MAX) notes = `${notes.slice(0, BOOK_NOTES_MAX - 3).trimEnd()}...`;

  const params: Array<[string, string]> = [];
  const name = (prefill.name ?? '').trim();
  const email = (prefill.email ?? '').trim();
  if (name) params.push(['name', name]);
  if (email) params.push(['email', email]);
  params.push(
    ['notes', notes],
    ['duration', '15'],
    ['theme', 'light'],
    ['layout', 'month_view'],
    ['utm_source', 'echopulse.media'],
    ['utm_medium', 'booking_modal'],
    ['utm_campaign', `plan_${planKey}`],
    ['utm_content', path],
  );
  const query = params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  return `${base}${base.includes('?') ? '&' : '?'}${query}`;
}
