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
 * Pricing model: hand-tuned per market, not raw FX.
 *
 * INDIA PRICING WAS REMOVED (2026-07). Previously visitors from IN saw a
 * separate INR rate card (₹9,999 / ₹34,999 / ₹99,999+) priced against local
 * agency rates — roughly 40% of the US price for the same scope. Since the
 * business is now positioned at US/UK/global founders, there is one price
 * everywhere: India resolves to 'OTHER', which is USD.
 *
 * Knock-on effects, so nobody is surprised later:
 *   • Checkout for Indian buyers now routes to Dodo (USD) instead of Razorpay.
 *     The Razorpay API routes still exist but nothing calls them.
 *   • The Pune-gated on-site section and inquiry modal were removed with it.
 */

export type Region = 'US' | 'CA' | 'EU' | 'UK' | 'OTHER';
export type CurrencyCode = 'USD' | 'CAD' | 'EUR' | 'GBP';

export interface GeoPricing {
  region: Region;
  currency: string;
  currencyCode: CurrencyCode;
  countryLabel: string;
  country: string | null;
  city: string | null;
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
// • OTHER (the catch-all for non-listed countries, now including India)
//   defaults to USD pricing — we don't discount unknown markets just because
//   we don't recognize their currency. If a real ask comes through that needs
//   PPP, add the country here explicitly instead of auto-discounting.
const PRICING_BY_REGION: Record<Region, RegionPricing> = {
  US:    { currency: '$',   currencyCode: 'USD', countryLabel: 'US pricing',     pilot: '299', pilotOriginal: '599', growth: '1,997', full: '4,997+' },
  CA:    { currency: 'CA$', currencyCode: 'CAD', countryLabel: 'Canada pricing', pilot: '419', pilotOriginal: '839', growth: '2,747', full: '6,997+' },
  EU:    { currency: '€',   currencyCode: 'EUR', countryLabel: 'EU pricing',     pilot: '279', pilotOriginal: '559', growth: '1,847', full: '4,597+' },
  UK:    { currency: '£',   currencyCode: 'GBP', countryLabel: 'UK pricing',     pilot: '239', pilotOriginal: '479', growth: '1,597', full: '3,997+' },
  OTHER: { currency: '$',   currencyCode: 'USD', countryLabel: 'USD pricing',    pilot: '299', pilotOriginal: '599', growth: '1,997', full: '4,997+' },
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
 *   UK  → ×0.78, round to 9-ending in GBP    ($15 → £14, $80 → £69)
 *   EU  → ×0.92, round to 9-ending in EUR    ($15 → €14, $80 → €74)
 *   CA  → ×1.30, round to 9-ending in CAD    ($15 → CA$19, $80 → CA$99)
 *   US  → as-is                              ($15 → $15)
 *
 * India used to have its own piecewise INR curve here (a PPP ramp, not a flat
 * ×80). Removed 2026-07 along with the INR rate card — IN now falls through to
 * the USD default like any other unlisted market.
 *
 * High-PPP markets get a +15% premium on top of the regional multiplier:
 *   CH (Switzerland) → ×0.92 ×1.15 = ×1.06, displayed as CHF (not €)
 *   NO (Norway)      → ×0.92 ×1.15
 *   DK (Denmark)     → ×0.92 ×1.15
 *   LU (Luxembourg)  → ×0.92 ×1.15
 *
 * The "no-brainer deal" math: every number reads as a sales-friendly round.
 * Never a raw FX figure like €13.80 — always €14 or €74.
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
  switch (region) {
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
  // 'IN' deliberately falls through to OTHER (USD) — see the header note.
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
    if (tz.startsWith('America/')) return 'US';
    if (tz.startsWith('Europe/')) return 'EU';
    if (tz.startsWith('Asia/')) return 'OTHER';
    return 'OTHER';
  } catch { return 'OTHER'; }
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
    prices: {
      pilot: data.pilot,
      pilotOriginal: data.pilotOriginal,
      growth: data.growth,
      full: data.full,
    },
    ready,
  };
}
