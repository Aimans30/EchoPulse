import type { IcpKey } from './videos';

/**
 * Lean index of the 12 niche-plus-service pages: which combinations exist and
 * the H1 of each. Kept apart from lib/nicheServiceData.ts (the long copy) so
 * the link rows on the ICP and service pages can import it without pulling all
 * of that copy into the service page's client bundle.
 */

export type NicheServiceSlug =
  | 'video-editing'
  | 'linkedin-ghostwriting'
  | 'websites-funnels'
  | 'ad-creatives'
  | 'personal-branding';

export interface NicheIndexEntry {
  icp: IcpKey;
  service: NicheServiceSlug;
  /** The H1 of the page, in the searcher's words. Also the link text. */
  h1: string;
}

export const NICHE_INDEX: NicheIndexEntry[] = [
  { icp: 'real-estate', service: 'video-editing', h1: 'Video editing for real estate agents' },
  { icp: 'real-estate', service: 'websites-funnels', h1: 'Websites and lead pages for real estate agents' },
  { icp: 'real-estate', service: 'ad-creatives', h1: 'Ad creatives for real estate agents' },
  { icp: 'coaches', service: 'video-editing', h1: 'Video editing for coaches and course creators' },
  { icp: 'coaches', service: 'linkedin-ghostwriting', h1: 'LinkedIn ghostwriting for coaches' },
  { icp: 'coaches', service: 'websites-funnels', h1: 'Websites and funnels for coaches' },
  { icp: 'founders', service: 'linkedin-ghostwriting', h1: 'LinkedIn ghostwriting for founders' },
  { icp: 'founders', service: 'personal-branding', h1: 'Personal branding for founders' },
  { icp: 'founders', service: 'video-editing', h1: 'Video editing for founders' },
  { icp: 'dtc', service: 'ad-creatives', h1: 'Ad creatives for DTC brands' },
  { icp: 'dtc', service: 'video-editing', h1: 'Video editing for DTC and e-commerce brands' },
  { icp: 'business-owners', service: 'video-editing', h1: 'Video editing for business owners' },
  { icp: 'business-owners', service: 'websites-funnels', h1: 'Websites and funnels for business owners' },
];

export function nicheH1(icp: string, service: string): string {
  const hit = NICHE_INDEX.find((e) => e.icp === icp && e.service === service);
  if (!hit) throw new Error(`No niche page for ${icp}/${service}`);
  return hit.h1;
}

export function nicheEntriesForIcp(icp: string): NicheIndexEntry[] {
  return NICHE_INDEX.filter((e) => e.icp === icp);
}

export function nicheEntriesForService(service: string): NicheIndexEntry[] {
  return NICHE_INDEX.filter((e) => e.service === service);
}
