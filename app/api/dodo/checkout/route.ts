import { NextResponse } from 'next/server';
import { createDodoCheckout } from '@/lib/dodo';
import { rateLimit } from '@/lib/rateLimit';

/**
 * Dodo Payments checkout endpoint.
 *
 * Called from OrderFlow when the visitor's region is NOT 'IN'. Creates a
 * hosted-checkout session on Dodo and returns the payment_link URL — the
 * client then redirects (window.location.href = paymentLink).
 *
 * Required body:
 *   amountSmallest:  number   (already converted to cents/pence/etc client-side
 *                              via useGeoPrice → localizeOrderPrice)
 *   currency:        'USD'|'EUR'|'GBP'|'CAD'|'AUD'
 *   service:         string   (e.g. "Reels & Shorts")
 *   tier:            string   (e.g. "Signature")
 *   client.fullName, client.email, client.country?
 *   returnUrl:       string   (e.g. "https://echopulse.media/onboard?from=dodo")
 */
export async function POST(req: Request) {
  // Same rate limit as Razorpay flow — payment retries are legitimate.
  if (!rateLimit(req, 'dodo-checkout', 30, 60_000)) {
    return NextResponse.json({ ok: false, error: 'too_many_requests' }, { status: 429 });
  }
  try {
    const body = await req.json();
    const {
      amountSmallest, currency, service, tier, client, returnUrl, cancelUrl, metadata,
    } = body ?? {};

    if (!amountSmallest || !currency || !service || !client?.email || !returnUrl) {
      return NextResponse.json(
        { ok: false, error: 'Missing required: amountSmallest, currency, service, client.email, returnUrl' },
        { status: 400 },
      );
    }

    const session = await createDodoCheckout({
      amountSmallest,
      currency,
      productName: tier ? `${service} — ${tier}` : service,
      productDescription: `EchoPulse one-off order: ${service}${tier ? ` (${tier})` : ''}`,
      customer: {
        email: client.email,
        name: client.fullName ?? client.email,
        country: client.country,
      },
      returnUrl,
      cancelUrl,
      metadata: {
        source: 'echopulse-orderflow',
        service,
        tier: tier ?? '',
        ...(metadata ?? {}),
      },
    });

    if (!session) {
      return NextResponse.json(
        { ok: false, error: 'Could not create checkout — check DODO_API_KEY and dashboard logs.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, paymentLink: session.payment_link, sessionId: session.id });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[/api/dodo/checkout] failed:', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
