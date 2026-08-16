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
 *
 * India is included deliberately. The India rate card was retired in July 2026,
 * but IN still resolves to the USD price tier in lib/useGeoPrice.ts rather than
 * being refused, so the country is genuinely served.
 */
export const AREA_SERVED = [
  { '@type': 'Country', name: 'United States' },
  { '@type': 'Country', name: 'Canada' },
  { '@type': 'Country', name: 'United Kingdom' },
  { '@type': 'Country', name: 'Australia' },
  { '@type': 'Country', name: 'India' },
  { '@type': 'Place', name: 'Western Europe' },
] as const;
