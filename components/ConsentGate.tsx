'use client';

import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useGeoPrice } from '@/lib/useGeoPrice';

/**
 * Analytics tags, gated by region instead of by a banner.
 *
 * The cookie banner was removed on 10 Nov 2026 at Lakshya's request: a
 * consent card was the first thing a cold prospect saw, and on a site whose
 * whole pitch is "nothing to hide" it read as a warning. The legal reason it
 * existed still stands, so this is how both are satisfied:
 *
 *   - UK and EU visitors: no Google Analytics, no Clarity, nothing. Clarity is
 *     a session recorder and GA sets cookies, and both need prior consent
 *     under UK PECR and the ePrivacy rules. Rather than ask, we do not track
 *     these visitors at all. Server logs and host request metrics still work
 *     and need no consent.
 *   - Everyone else (US, Canada, India, rest of world): the tags load on
 *     page view. The privacy policy (/privacy) says so and explains how to opt
 *     out (Global Privacy Control, blocking the domains, or emailing us).
 *
 * Region comes from useGeoPrice: the ep_geo cookie set by the edge middleware
 * on the first request, then a timezone fallback, then an IP lookup. While
 * the region is still resolving (`ready === false`) nothing loads, so a UK
 * visitor is never tracked for the first few hundred milliseconds either.
 * Nothing renders on the server. lib/consent.ts is no longer used.
 */
const NO_TRACKING_REGIONS = new Set(['UK', 'EU']);

export default function ConsentGate({
  gaId,
  clarityId,
}: {
  gaId: string;
  /** Clarity project id. Pass an empty string to disable Clarity entirely. */
  clarityId: string;
}) {
  const { region, ready } = useGeoPrice();

  // Honour Global Privacy Control where the browser sends it. It is a legal
  // opt-out signal in California and Colorado and costs nothing to respect.
  const gpc =
    typeof navigator !== 'undefined' &&
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

  if (!ready || gpc || NO_TRACKING_REGIONS.has(region)) return null;

  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      {clarityId && (
        <Script id="clarity-init" strategy="lazyOnload">{`
          (function(c,l,a,r,i,t,y){
            if(c[a])return;
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `}</Script>
      )}
    </>
  );
}
