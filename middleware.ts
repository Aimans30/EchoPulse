import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge middleware — geo enrichment.
 *
 * Detect once at the edge, persist in a cookie, never block the page load.
 *
 *   1. Read platform geo headers (Vercel: x-vercel-ip-country / -city,
 *      Cloudflare: cf-ipcountry / cf-ipcity). Free, no API call.
 *   2. Forward as x-ep-country / x-ep-city for the server layout.
 *   3. Persist in ep_geo cookie (30 days) so repeat visits skip detection.
 */
export function middleware(req: NextRequest) {
  const fwd = new Headers(req.headers);
  const existing = req.cookies.get('ep_geo')?.value;
  let country = '';
  let city = '';

  // ── Query-string override ──────────────────────────────────────────────
  // Lets us preview geo-gated sections without spoofing IP:
  //   /?city=Pune&country=IN          → become a Pune user
  //   /?city=Mumbai                   → become a Mumbai user (country defaults to IN)
  //   /?city=                         → clears the override
  // The override sets the same ep_geo cookie real geo detection uses, so it
  // persists across page navigations. Delete the cookie to go back to real geo.
  const overrideCity = req.nextUrl.searchParams.get('city');
  const overrideCountry = req.nextUrl.searchParams.get('country');
  let cameFromOverride = false;
  if (overrideCity !== null) {
    city = (overrideCity || '').trim();
    country = (overrideCountry || (city ? 'IN' : '')).trim().toUpperCase();
    cameFromOverride = true;
  } else if (existing) {
    try {
      const [c, ct] = decodeURIComponent(existing).split('|');
      country = c || '';
      city = ct || '';
    } catch { /* fall through */ }
  }

  if (!country) {
    country = (
      req.headers.get('x-vercel-ip-country') ||
      req.headers.get('cf-ipcountry') ||
      ''
    ).toUpperCase();
  }
  if (!city) {
    const raw =
      req.headers.get('x-vercel-ip-city') ||
      req.headers.get('cf-ipcity') ||
      '';
    if (raw) {
      try { city = decodeURIComponent(raw).replace(/_/g, ' '); } catch { city = raw; }
    }
  }

  if (country) fwd.set('x-ep-country', country);
  if (city) fwd.set('x-ep-city', city);

  const res = NextResponse.next({ request: { headers: fwd } });

  // Write the cookie on first visit OR whenever the override changes it,
  // so refreshes after /?city=pune keep showing the Pune view.
  if ((cameFromOverride || !existing) && (country || city)) {
    res.cookies.set('ep_geo', encodeURIComponent(`${country}|${city}`), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      httpOnly: false,
    });
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
