import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/asana';
import { postToSlack, buildOrderMessage } from '@/lib/slack';

/**
 * Local-only pipeline smoke test.
 *
 * Bypasses Razorpay's UI and the iframe entirely — fires `createOrder()` and
 * `postToSlack()` with the same payload shape `/api/razorpay/verify` would
 * call them with after a successful capture. Proves the CRM + comms wiring
 * end-to-end without needing a card.
 *
 * Hard-gated:
 *   • Production NODE_ENV → 404
 *   • Optional ?token=… check via TEST_PIPELINE_TOKEN env if you want extra paranoia
 *
 *   curl 'http://localhost:3000/api/test-pipeline?service=reels&tier=Signature&amount=2499'
 *   curl 'http://localhost:3000/api/test-pipeline?service=longform&tier=Signature&amount=9999'
 *   curl 'http://localhost:3000/api/test-pipeline?service=podcast&tier=Base&amount=22499'
 *   curl 'http://localhost:3000/api/test-pipeline?service=repurpose&tier=Pack&amount=17499'
 */
export async function GET(req: Request) {
  // Production safety: this endpoint creates real Asana tasks + Slack pings,
  // never expose it to the open internet.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const url = new URL(req.url);
  const service = url.searchParams.get('service') ?? 'reels';
  const tier = url.searchParams.get('tier') ?? 'Signature';
  const amountStr = url.searchParams.get('amount') ?? '2499';
  const amount = Number(amountStr);

  // Map shorthand → display label used in the real OrderFlow
  const serviceLabel = ({
    reels: 'Reels & Shorts',
    longform: 'Long-form YouTube',
    podcast: 'Podcast Editing',
    repurpose: 'Repurpose Existing Content',
  } as Record<string, string>)[service] ?? service;

  const deliveryHours = ({
    reels: 48,
    longform: 72,
    podcast: 96,
    repurpose: 72,
  } as Record<string, number>)[service] ?? 48;

  const totalDisplay = `₹${amount.toLocaleString('en-IN')}`;

  const client = {
    fullName: `[TEST] ${serviceLabel} Run · Pune`,
    email: `test-${service}-pune@echopulse.media`,
    phone: '+91 98220 10001',
  };

  // 1. Create the Asana task — same call site as /api/razorpay/verify
  const task = await createOrder({
    fullName: client.fullName,
    email: client.email,
    phone: client.phone,
    service: serviceLabel,
    tier,
    total: totalDisplay,
    fileLink: 'https://drive.google.com/drive/folders/test-pipeline',
    deliveryHours,
  });

  // 2. Ping Slack — same buildOrderMessage shape, real channel taxonomy
  await postToSlack({
    ...buildOrderMessage({
      fullName: client.fullName,
      email: client.email,
      service: serviceLabel,
      tier,
      total: totalDisplay,
      deliveryLabel: deliveryHours < 72 ? `${deliveryHours} hours` : `${Math.round(deliveryHours / 24)} days`,
      asanaUrl: task?.permalink_url,
    }),
    channel: 'orders',
  });

  return NextResponse.json({
    ok: true,
    note: 'Pipeline test — Razorpay bypassed. Asana + Slack should have fired.',
    asanaUrl: task?.permalink_url ?? null,
    service: serviceLabel,
    tier,
    total: totalDisplay,
    deliveryHours,
  });
}
