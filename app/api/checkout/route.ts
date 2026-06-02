import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/asana';
import { postToSlack, buildOrderMessage } from '@/lib/slack';
import { rateLimit } from '@/lib/rateLimit';

/**
 * One-off order checkout endpoint.
 *
 * Called from the OrderFlow component's final "Submit Order" button.
 * For the FREE phase (no payment integration yet) this simply:
 *   1. Creates the Asana order card with due_at = NOW + 48 hours
 *   2. Pings Slack → #orders so production sees it immediately
 *   3. Returns the Asana permalink so the UI can show success
 *
 * When Razorpay/Stripe lands, this same route handles the post-payment
 * webhook — verify the signature, then call the same Asana+Slack pair.
 *
 * Required body fields:  fullName, email, service, total
 * Optional body fields:  phone, tier, fileLink
 */
export async function POST(req: Request) {
  // Higher limit than the lead/inquiry forms — Razorpay payment retries are
  // legitimate and a paying customer shouldn't get blocked mid-checkout.
  if (!rateLimit(req, 'checkout', 30, 60_000)) {
    return NextResponse.json({ ok: false, error: 'too_many_requests' }, { status: 429 });
  }
  try {
    const body = await req.json();
    const { fullName, email, phone, service, tier, total, fileLink, deliveryHours } = body ?? {};

    if (!fullName || !email || !service || !total) {
      return NextResponse.json(
        { ok: false, error: 'fullName, email, service and total are required' },
        { status: 400 },
      );
    }

    // 1. Asana Order card with the per-service delivery clock
    //    (48h reels / 72h longform Essential+Signature / 96h podcast /
    //     72h repurpose / 120h longform Elite)
    const hours = Number(deliveryHours) || 48;
    const asanaTask = await createOrder({
      fullName, email, phone, service, tier, total: String(total), fileLink,
      deliveryHours: hours,
    });

    // 2. Slack alert (#orders channel)
    await postToSlack(
      buildOrderMessage({
        fullName, email, phone, service, tier, total: String(total), fileLink,
        asanaTaskUrl: asanaTask?.permalink_url,
        deliveryHours: hours,
      }),
    );

    return NextResponse.json({
      ok: true,
      asanaUrl: asanaTask?.permalink_url ?? null,
      message: 'Order received. We will deliver within 48 hours.',
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[/api/checkout] failed:', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
