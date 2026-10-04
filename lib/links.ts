// Single source of truth for outbound conversion links.
// Every default CTA across the site reads from here.
//
// Service-specific override: components/ServicePageClient.tsx checks
// service.bookCallUrl (set in lib/serviceData.ts) before falling back to
// this URL. The Websites service currently uses a dedicated event:
//   https://cal.com/lakshya-soni-jvwfee/echopulse-website-strategy-call (30m)
// All other services use the default below.

export const BOOK_CALL_URL = 'https://cal.com/lakshya-soni-jvwfee/echopulse-marketing-agency-call';

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
