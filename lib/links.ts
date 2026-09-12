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
 * CTA labels.
 *
 * These changed from "Book a Free Call" / "Book a Free 45-min Call" because
 * both described what the VISITOR gives up (their calendar) and nothing about
 * what they get. "Free" was doing all the persuasive work, and free is not a
 * benefit when the cost the reader is actually weighing is being trapped on a
 * sales call.
 *
 * The booking modal already gets this right. Its subtitle reads
 * "45 min · Content audit + growth roadmap · No pitch unless you ask", which
 * names a concrete deliverable, states the time cost, and removes the fear
 * that stops most people clicking. The problem was that this framing only
 * appeared AFTER the click, so it did no work at the moment of hesitation.
 *
 * These labels pull that value forward to the button itself. Use
 * BOOK_CALL_REASSURANCE as the line directly underneath wherever there is room.
 */
export const BOOK_CALL_LABEL = 'Get a free content audit';
export const BOOK_CALL_LABEL_LONG = 'Get your free content audit';

/** Sub-line for under the CTA. The audit is yours either way is the point. */
export const BOOK_CALL_REASSURANCE = '45 minutes. You keep the roadmap whether or not you hire us.';

// Anchor target for in-page CTAs that should scroll to the bottom CTA
// section instead of leaving the page.
export const BOOK_CALL_ANCHOR = '#book-call';
