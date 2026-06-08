'use client';

import { useEffect, useState } from 'react';
import { useInitialGeo } from '@/components/GeoProvider';

/**
 * Geo + pricing detection.
 *
 * Architecture (inspired by Stripe / Linear / Notion):
 *   1. Edge middleware reads platform geo headers and writes them into a
 *      cookie + request headers. (see middleware.ts)
 *   2. The root layout reads the cookie/headers on the SERVER and pipes the
 *      result into <GeoProvider>. This means the first paint already has the
 *      right region — no flash, no client-side fetch.
 *   3. This hook reads the server geo on first render. When present (the
 *      production case), it's done. When absent (local dev), it falls back
 *      to a quick client-side detection: cookie -> sessionStorage -> ipapi.co.
 *
 * Pricing model: hand-tuned per market, not raw FX. India pricing in
 * particular is set against local agency rate cards rather than $1 = ₹83
 * conversion, which would price every package out of reach.
 */

export type Region = 'US' | 'CA' | 'EU' | 'UK' | 'IN' | 'OTHER';
export type CurrencyCode = 'USD' | 'CAD' | 'EUR' | 'GBP' | 'INR';

export interface GeoPricing {
  region: Region;
  currency: string;
  currencyCode: CurrencyCode;
  countryLabel: string;
  country: string | null;
  city: string | null;
  isPune: boolean;
  prices: {
    pilot: string;
    pilotOriginal: string;
    growth: string;
    full: string;
  };
  ready: boolean;
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

// PRICING MATRIX — single source of truth for every region's prices.
// Visible side-by-side at /pricing-matrix so Lakshya can sanity-check
// every market without poking through the codebase.
//
// Policy notes:
// • "Pilot" is the 1-month intro. Original is the strike-through anchor.
// • India numbers reset upward 2026-05-30 — ₹4,999 → ₹9,999. The earlier
//   number didn't survive the time-vs-revenue math after WhatsApp support,
//   3 revisions, and 5 deliverables. Floor is now ₹9K so a 4-short bundle
//   still delivers margin after editor pay.
// • OTHER (the catch-all for non-listed countries) defaults to USD pricing
//   — we don't discount unknown markets just because we don't recognize
//   their currency. If a real ask comes through that needs PPP, we add the
//   country here explicitly instead of auto-discounting.
const PRICING_BY_REGION: Record<Region, RegionPricing> = {
  US:    { currency: '$',   currencyCode: 'USD', countryLabel: 'US pricing',     pilot: '299',    pilotOriginal: '599',    growth: '1,997',  full: '4,997+'   },
  CA:    { currency: 'CA$', currencyCode: 'CAD', countryLabel: 'Canada pricing', pilot: '419',    pilotOriginal: '839',    growth: '2,747',  full: '6,997+'   },
  EU:    { currency: '€',   currencyCode: 'EUR', countryLabel: 'EU pricing',     pilot: '279',    pilotOriginal: '559',    growth: '1,847',  full: '4,597+'   },
  UK:    { currency: '£',   currencyCode: 'GBP', countryLabel: 'UK pricing',     pilot: '239',    pilotOriginal: '479',    growth: '1,597',  full: '3,997+'   },
  IN:    { currency: '₹',   currencyCode: 'INR', countryLabel: 'India pricing',  pilot: '9,999',  pilotOriginal: '19,999', growth: '34,999', full: '99,999+'  },
  OTHER: { currency: '$',   currencyCode: 'USD', countryLabel: 'USD pricing',    pilot: '299',    pilotOriginal: '599',    growth: '1,997',  full: '4,997+'   },
};

// Export for the /pricing-matrix admin page — single source of truth.
export const ALL_REGION_PRICING = PRICING_BY_REGION;

/**
 * Localize a USD-anchored à la carte / order-flow price to the user's region
 * with sales-friendly rounding ("99-ending", round numbers that read as deals).
 *
 * Different from PRICING_BY_REGION above — that one is the hand-tuned matrix
 * for Pilot/Growth/Full RETAINER tiers. This helper handles the per-service
 * USD prices in lib/orderData.ts (Reels $15-$100, Longform $49-$749, etc.)
 * plus any other USD-anchored numbers across the site (the "From $X" banner,
 * comparison tables, ad-hoc promo prices).
 *
 * Region multipliers + rounding:
 *   IN  → ×80, round to 99-ending in INR     ($15 → ₹1,499, $80 → ₹6,499)
 *   UK  → ×0.78, round to 9-ending in GBP    ($15 → £14, $80 → £69)
 *   EU  → ×0.92, round to 9-ending in EUR    ($15 → €14, $80 → €74)
 *   CA  → ×1.30, round to 9-ending in CAD    ($15 → CA$19, $80 → CA$99)
 *   US  → as-is                              ($15 → $15)
 *
 * High-PPP markets get a +15% premium on top of the regional multiplier:
 *   CH (Switzerland) → ×0.92 ×1.15 = ×1.06, displayed as CHF (not €)
 *   NO (Norway)      → ×0.92 ×1.15
 *   DK (Denmark)     → ×0.92 ×1.15
 *   LU (Luxembourg)  → ×0.92 ×1.15
 *
 * The "no-brainer deal" math: every number reads as a sales-friendly round.
 * Never a raw FX figure like ₹1,247 — always ₹1,499 or ₹1,299.
 */
export function localizeOrderPrice(
  usd: number,
  region: Region,
  country?: string | null,
): { display: string; raw: number; currency: string; currencyCode: CurrencyCode | 'CHF' } {
  const upperCountry = (country || '').toUpperCase();
  const isHighPPP = ['CH', 'NO', 'DK', 'LU', 'IS'].includes(upperCountry);

  // Round to the nearest sales-friendly tier (99-ending for premium feel)
  // small (< local 50): round to nearest 5 then subtract 1 → "9-ending"
  // medium (50–500):    round to nearest 10 then subtract 1 → "X9-ending"
  // large (500+):       round to nearest 100 then subtract 1 → "X99-ending"
  const salesRound = (n: number): number => {
    if (n < 50) return Math.max(9, Math.round(n / 5) * 5 - 1);
    if (n < 500) return Math.max(49, Math.round(n / 10) * 10 - 1);
    return Math.max(499, Math.round(n / 100) * 100 - 1);
  };
  const inrRound = (n: number): number => {
    // INR rounds to nearest hundred minus one (₹X99), with a minimum of ₹99
    if (n < 200) return Math.max(99, Math.round(n / 100) * 100 - 1);
    if (n < 5000) return Math.max(499, Math.round(n / 100) * 100 - 1);
    return Math.max(4999, Math.round(n / 500) * 500 - 1);
  };

  /**
   * India PPP curve — NOT a flat USD×80.
   *
   * The Indian market accepts low-anchor entry points happily but resists
   * mid/high USD tiers when translated linearly. This piecewise mapping
   * keeps small one-off services aspirational while compressing the
   * mid-tier ladder so a Signature Reel ≈ ₹2,500 and Elite ≈ ₹5,000.
   *
   *   USD ≤ 15     → ×80          ($15  → ₹1,199 — entry tier feels native)
   *   USD ≤ 80     → linear ramp  ($49  → ~₹1,899, $80 → ₹2,499)
   *   USD ≤ 100    → linear ramp  ($90  → ~₹3,799, $100 → ₹4,999)
   *   USD ≤ 350    → ×50          ($349 → ~₹17,499 — podcast premium)
   *   USD  > 350   → ×45          (gentler at the very top end)
   */
  const inrFromUsd = (usd: number): number => {
    if (usd <= 15) return usd * 80;
    if (usd <= 80) return 1199 + (usd - 15) * 20;          // 1199 → 2499
    if (usd <= 100) return 2499 + (usd - 80) * 125;        // 2499 → 4999
    if (usd <= 350) return 4999 + (usd - 100) * 50;        // 4999 → 17499
    return usd * 45;
  };

  switch (region) {
    case 'IN': {
      const rounded = inrRound(inrFromUsd(usd));
      return { display: `₹${rounded.toLocaleString('en-IN')}`, raw: rounded, currency: '₹', currencyCode: 'INR' };
    }
    case 'UK': {
      const rounded = salesRound(usd * 0.78);
      return { display: `£${rounded}`, raw: rounded, currency: '£', currencyCode: 'GBP' };
    }
    case 'EU': {
      const baseMultiplier = isHighPPP ? 0.92 * 1.15 : 0.92;
      const rounded = salesRound(usd * baseMultiplier);
      // Switzerland uses CHF, not Euro
      if (upperCountry === 'CH') {
        return { display: `CHF ${rounded}`, raw: rounded, currency: 'CHF ', currencyCode: 'CHF' };
      }
      // Norway uses NOK technically but EUR is acceptable for digital cross-border invoicing
      return { display: `€${rounded}`, raw: rounded, currency: '€', currencyCode: 'EUR' };
    }
    case 'CA': {
      const rounded = salesRound(usd * 1.3);
      return { display: `CA$${rounded}`, raw: rounded, currency: 'CA$', currencyCode: 'CAD' };
    }
    case 'US':
    case 'OTHER':
    default:
      return { display: `$${usd}`, raw: usd, currency: '$', currencyCode: 'USD' };
  }
}

const EU_TZ = new Set([
  'Europe/Amsterdam','Europe/Andorra','Europe/Athens','Europe/Belgrade','Europe/Berlin',
  'Europe/Bratislava','Europe/Brussels','Europe/Bucharest','Europe/Budapest','Europe/Copenhagen',
  'Europe/Dublin','Europe/Helsinki','Europe/Lisbon','Europe/Luxembourg','Europe/Madrid',
  'Europe/Malta','Europe/Oslo','Europe/Paris','Europe/Prague','Europe/Riga','Europe/Rome',
  'Europe/Sofia','Europe/Stockholm','Europe/Tallinn','Europe/Vienna','Europe/Vilnius',
  'Europe/Warsaw','Europe/Zagreb','Europe/Zurich','Atlantic/Reykjavik',
]);
const CA_TZ = new Set([
  'America/Toronto','America/Vancouver','America/Edmonton','America/Winnipeg','America/Halifax',
  'America/Montreal','America/St_Johns','America/Regina',
]);
const UK_TZ = new Set(['Europe/London','Europe/Belfast','Europe/Edinburgh']);
const IN_TZ = new Set(['Asia/Kolkata','Asia/Calcutta']);

const EU_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU',
  'MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','CH',
]);

function countryToRegion(c: string | null | undefined): Region {
  if (!c) return 'OTHER';
  const u = c.toUpperCase();
  if (u === 'US') return 'US';
  if (u === 'CA') return 'CA';
  if (u === 'GB' || u === 'UK') return 'UK';
  if (u === 'IN') return 'IN';
  if (EU_COUNTRIES.has(u)) return 'EU';
  return 'OTHER';
}

function regionFromTimezone(): Region {
  if (typeof window === 'undefined') return 'OTHER';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (UK_TZ.has(tz)) return 'UK';
    if (CA_TZ.has(tz)) return 'CA';
    if (EU_TZ.has(tz)) return 'EU';
    if (IN_TZ.has(tz)) return 'IN';
    if (tz.startsWith('America/')) return 'US';
    if (tz.startsWith('Europe/')) return 'EU';
    if (tz.startsWith('Asia/')) return 'OTHER';
    return 'OTHER';
  } catch { return 'OTHER'; }
}

function isPuneCity(city: string | null): boolean {
  if (!city) return false;
  const c = city.trim().toLowerCase();
  return c === 'pune' || c === 'poona' || c.includes('pimpri') || c.includes('chinchwad');
}

const COOKIE_NAME = 'ep_geo';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function readGeoCookie(): { country: string | null; city: string | null } | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]+)'));
  if (!m) return null;
  try {
    const decoded = decodeURIComponent(m[1]);
    const [country, city] = decoded.split('|');
    return { country: country || null, city: city || null };
  } catch { return null; }
}

function writeGeoCookie(country: string | null, city: string | null): void {
  if (typeof document === 'undefined') return;
  const val = encodeURIComponent(`${country || ''}|${city || ''}`);
  document.cookie = `${COOKIE_NAME}=${val}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}

async function fetchGeoFromIp(signal: AbortSignal): Promise<{ country: string | null; city: string | null } | null> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal });
    if (!res.ok) return null;
    const data = (await res.json()) as { country_code?: string; city?: string };
    return { country: data.country_code ?? null, city: data.city ?? null };
  } catch { return null; }
}

export function useGeoPrice(): GeoPricing {
  const { initialCountry, initialCity } = useInitialGeo();
  const hasServerGeo = initialCountry !== null;

  const [region, setRegion] = useState<Region>(countryToRegion(initialCountry));
  const [country, setCountry] = useState<string | null>(initialCountry);
  const [city, setCity] = useState<string | null>(initialCity);
  const [ready, setReady] = useState(hasServerGeo);

  useEffect(() => {
    if (hasServerGeo) return;
    const ctrl = new AbortController();
    queueMicrotask(() => {
      if (ctrl.signal.aborted) return;
      const cookie = readGeoCookie();
      if (cookie && cookie.country) {
        setCountry(cookie.country);
        setCity(cookie.city);
        setRegion(countryToRegion(cookie.country));
        setReady(true);
        return;
      }
      setRegion(regionFromTimezone());
      setReady(true);
      void (async () => {
        const geo = await fetchGeoFromIp(ctrl.signal);
        if (!geo || ctrl.signal.aborted) return;
        writeGeoCookie(geo.country, geo.city);
        setCountry(geo.country);
        setCity(geo.city);
        setRegion(countryToRegion(geo.country));
      })();
    });
    return () => ctrl.abort();
  }, [hasServerGeo]);

  const data = PRICING_BY_REGION[region];
  return {
    region,
    currency: data.currency,
    currencyCode: data.currencyCode,
    countryLabel: data.countryLabel,
    country,
    city,
    isPune: isPuneCity(city),
    prices: {
      pilot: data.pilot,
      pilotOriginal: data.pilotOriginal,
      growth: data.growth,
      full: data.full,
    },
    ready,
  };
}
