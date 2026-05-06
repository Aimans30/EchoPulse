'use client';

import { useEffect, useState } from 'react';

export type Region = 'US' | 'CA' | 'EU' | 'UK' | 'OTHER';
export type CurrencyCode = 'USD' | 'CAD' | 'EUR' | 'GBP';

export interface GeoPricing {
  region: Region;
  currency: string;        // display symbol: '$', 'CA$', '€', '£'
  currencyCode: CurrencyCode;
  countryLabel: string;    // friendly label for UI hint
  prices: {
    pilot: string;          // promotional Founder Pilot price ($399 USD)
    pilotOriginal: string;  // original Pilot price (shown crossed out for anchoring)
    growth: string;
    full: string;
  };
  ready: boolean;          // true once region is detected on the client
}

interface RegionPricing {
  currency: string;
  currencyCode: CurrencyCode;
  countryLabel: string;
  pilot: string;
  pilotOriginal: string;
  growth: string;
  full: string;
}

// Founder Pilot is a no-brainer promo: was $599, now $299 (50% off)
// while we build the case-study list. Growth + Full positioned as the
// "premium agency at SaaS pricing" play.
const PRICING_BY_REGION: Record<Region, RegionPricing> = {
  US: {
    currency: '$',
    currencyCode: 'USD',
    countryLabel: 'US pricing',
    pilot: '299',
    pilotOriginal: '599',
    growth: '1,997',
    full: '4,997+',
  },
  CA: {
    currency: 'CA$',
    currencyCode: 'CAD',
    countryLabel: 'Canada pricing',
    pilot: '419',
    pilotOriginal: '839',
    growth: '2,747',
    full: '6,997+',
  },
  EU: {
    currency: '€',
    currencyCode: 'EUR',
    countryLabel: 'EU pricing',
    pilot: '279',
    pilotOriginal: '559',
    growth: '1,847',
    full: '4,597+',
  },
  UK: {
    currency: '£',
    currencyCode: 'GBP',
    countryLabel: 'UK pricing',
    pilot: '239',
    pilotOriginal: '479',
    growth: '1,597',
    full: '3,997+',
  },
  OTHER: {
    currency: '$',
    currencyCode: 'USD',
    countryLabel: 'USD pricing',
    pilot: '299',
    pilotOriginal: '599',
    growth: '1,997',
    full: '4,997+',
  },
};

// Comprehensive list of EU member-state primary timezones.
const EU_TIMEZONES = new Set([
  'Europe/Amsterdam', 'Europe/Andorra', 'Europe/Athens', 'Europe/Belgrade',
  'Europe/Berlin', 'Europe/Bratislava', 'Europe/Brussels', 'Europe/Bucharest',
  'Europe/Budapest', 'Europe/Busingen', 'Europe/Copenhagen', 'Europe/Dublin',
  'Europe/Gibraltar', 'Europe/Helsinki', 'Europe/Lisbon', 'Europe/Ljubljana',
  'Europe/Luxembourg', 'Europe/Madrid', 'Europe/Malta', 'Europe/Monaco',
  'Europe/Oslo', 'Europe/Paris', 'Europe/Podgorica', 'Europe/Prague',
  'Europe/Riga', 'Europe/Rome', 'Europe/San_Marino', 'Europe/Sarajevo',
  'Europe/Skopje', 'Europe/Sofia', 'Europe/Stockholm', 'Europe/Tallinn',
  'Europe/Tirane', 'Europe/Vaduz', 'Europe/Vatican', 'Europe/Vienna',
  'Europe/Vilnius', 'Europe/Warsaw', 'Europe/Zagreb', 'Europe/Zurich',
  'Atlantic/Madeira', 'Atlantic/Canary', 'Atlantic/Azores', 'Atlantic/Reykjavik',
]);

const CA_TIMEZONES = new Set([
  'America/Toronto', 'America/Vancouver', 'America/Edmonton', 'America/Winnipeg',
  'America/Halifax', 'America/Montreal', 'America/St_Johns', 'America/Regina',
  'America/Whitehorse', 'America/Yellowknife', 'America/Iqaluit', 'America/Moncton',
  'America/Goose_Bay', 'America/Cambridge_Bay', 'America/Inuvik', 'America/Dawson',
  'America/Dawson_Creek', 'America/Fort_Nelson', 'America/Atikokan', 'America/Glace_Bay',
  'America/Pangnirtung', 'America/Rainy_River', 'America/Resolute', 'America/Rankin_Inlet',
  'America/Thunder_Bay', 'America/Nipigon', 'America/Blanc-Sablon',
]);

const UK_TIMEZONES = new Set([
  'Europe/London', 'Europe/Belfast', 'Europe/Edinburgh', 'Europe/Guernsey',
  'Europe/Isle_of_Man', 'Europe/Jersey',
]);

function detectRegion(): Region {
  if (typeof window === 'undefined') return 'OTHER';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

    if (UK_TIMEZONES.has(tz)) return 'UK';
    if (CA_TIMEZONES.has(tz)) return 'CA';
    if (EU_TIMEZONES.has(tz)) return 'EU';

    // Any America/* that is not Canadian falls back to US pricing.
    if (tz.startsWith('America/')) return 'US';

    // Any Europe/* not specifically matched above falls back to EU pricing.
    if (tz.startsWith('Europe/')) return 'EU';

    return 'OTHER';
  } catch {
    return 'OTHER';
  }
}

/**
 * Client-side geo pricing hook. Detects user region from browser timezone
 * (no external API, no cookies, no IP lookup) and returns a localized
 * currency symbol plus regional prices.
 *
 * SSR-safe: returns USD pricing on first render, then hydrates to the
 * detected region after the component mounts.
 */
export function useGeoPrice(): GeoPricing {
  const [region, setRegion] = useState<Region>('OTHER');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRegion(detectRegion());
    setReady(true);
  }, []);

  const data = PRICING_BY_REGION[region];

  return {
    region,
    currency: data.currency,
    currencyCode: data.currencyCode,
    countryLabel: data.countryLabel,
    prices: {
      pilot: data.pilot,
      pilotOriginal: data.pilotOriginal,
      growth: data.growth,
      full: data.full,
    },
    ready,
  };
}
