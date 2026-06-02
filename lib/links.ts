// Single source of truth for outbound conversion links.
// Every default CTA across the site reads from here.
//
// Service-specific override: components/ServicePageClient.tsx checks
// service.bookCallUrl (set in lib/serviceData.ts) before falling back to
// this URL. The Websites service currently uses a dedicated event:
//   https://cal.com/lakshya-soni-jvwfee/echopulse-website-strategy-call (30m)
// All other services use the default below.

export const BOOK_CALL_URL = 'https://cal.com/lakshya-soni-jvwfee/echopulse-marketing-agency-call';
export const BOOK_CALL_LABEL = 'Book a Free Call';
export const BOOK_CALL_LABEL_LONG = 'Book a Free 45-min Call';

// Anchor target for in-page CTAs that should scroll to the bottom CTA
// section instead of leaving the page.
export const BOOK_CALL_ANCHOR = '#book-call';
