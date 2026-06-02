import 'server-only';
import { headers, cookies } from 'next/headers';

/** Read geo set by middleware.ts — headers first, then ep_geo cookie. */
export async function getServerGeo(): Promise<{ country: string | null; city: string | null }> {
  const h = await headers();
  const hc = h.get('x-ep-country');
  const hcity = h.get('x-ep-city');
  if (hc) return { country: hc, city: hcity || null };

  try {
    const ck = await cookies();
    const raw = ck.get('ep_geo')?.value;
    if (raw) {
      const [country, city] = decodeURIComponent(raw).split('|');
      return { country: country || null, city: city || null };
    }
  } catch { /* streaming cookie read can throw */ }
  return { country: null, city: null };
}
