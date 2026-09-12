/**
 * Shared JSON-LD fragments.
 *
 * These values were previously copy-pasted into three separate schema blocks
 * (the Organization node in app/layout.tsx, the Service node in
 * app/services/[slug]/page.tsx, and the Service node in app/[icp]/page.tsx)
 * and had already drifted: the Organization listed India, both Service nodes
 * did not. Stating "who we serve" three different ways across the same schema
 * graph is exactly the kind of inconsistency an entity-resolution system reads
 * as a contradiction, so it lives in one place now.
 */

/**
 * The markets EchoPulse sells into. Mirrors the stated served markets, and the
 * copy already on the site ("founders and operators across the US, UK, Canada,
 * Australia and Western Europe" in how-to-choose-a-personal-branding-agency).
 *
 * ─── India was REMOVED here in September 2026 ────────────────────────────────
 *
 * The previous note argued India belonged in this list because `IN` resolves to
 * the USD price tier in lib/useGeoPrice.ts rather than being refused. That
 * conflates two different claims. "We will take your money if you show up" is
 * not the same statement as `areaServed`, which tells Google and every answer
 * engine which markets to surface this business in. A 12-month Search Console
 * export showed what that mis-statement bought:
 *
 *   India       673 impressions /  23 clicks
 *   Bangladesh  383 impressions /  13 clicks
 *   Pakistan     60 impressions /   3 clicks
 *   -------------------------------------------
 *   39 of the site's 77 total clicks — 51% of ALL traffic — from a region
 *   that converts at zero, while the United States sat at 4,520 impressions
 *   and 11 clicks (0.24% CTR) and the UK at 395 impressions and 1 click
 *   (average position 29.2).
 *
 * Declaring India as served pulls the entity toward a South Asian service-area
 * cluster and competes for the same relevance budget the US and UK pages need.
 * Removing it is not a claim that Indian enquiries are refused; nothing in the
 * pricing or checkout path changes.
 *
 * India remains in the graph where it is actually TRUE: see BUSINESS_ADDRESS
 * below. Where the business is located and which markets it serves are
 * different properties, and keeping them separate is what makes both honest.
 */
export const AREA_SERVED = [
  { '@type': 'Country', name: 'United States' },
  { '@type': 'Country', name: 'Canada' },
  { '@type': 'Country', name: 'United Kingdom' },
  { '@type': 'Country', name: 'Australia' },
  { '@type': 'Place', name: 'Western Europe' },
] as const;

/**
 * Where the business actually operates from. EchoPulse is a sole proprietorship
 * operated by Lakshya Soni from Bhopal, India — the same facts app/terms/page.tsx
 * already states publicly (OPERATING_CITY = 'Bhopal', Indian law, exclusive
 * jurisdiction at Bhopal).
 *
 * This is the node that legitimately carries the India reference, and it is
 * deliberately NOT areaServed. An Organization with no address at all is a
 * weaker entity to an entity-resolution system than one with a truthful
 * address, and omitting it to look non-Indian while the Terms page says
 * otherwise would be the dishonest option.
 *
 * No streetAddress or postalCode: a remote-first studio has no verified public
 * premises, and inventing one to fill the shape would be worse than omitting
 * it. addressLocality + addressCountry is the accurate subset.
 */
export const BUSINESS_ADDRESS = {
  '@type': 'PostalAddress',
  addressLocality: 'Bhopal',
  addressRegion: 'Madhya Pradesh',
  addressCountry: 'IN',
} as const;
