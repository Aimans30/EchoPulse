import { NextResponse } from 'next/server';
import { verifyDodoWebhook } from '@/lib/dodo';
import { createOrder } from '@/lib/asana';
import { postToSlack, buildOrderMessage } from '@/lib/slack';

/**
 * Dodo Payments webhook receiver.
 *
 * Dodo POSTs here for every payment lifecycle event. We care about:
 *   - payment.succeeded → fires the Asana + Slack pipeline (same as
 *                         /api/razorpay/verify does for the India flow).
 *   - payment.failed    → optional: log to a #payment-failed Slack channel.
 *
 * Wire this URL into the Dodo dashboard → Webhooks → Add endpoint:
 *   https://echopulse.media/api/dodo/webhook
 *
 * Set the webhook secret in .env.local as DODO_WEBHOOK_SECRET so we can
 * verify signatures and reject forgeries.
 */
export async function POST(req: Request) {
  // 1. Verify signature on the RAW body before parsing JSON.
  const raw = await req.text();
  const signature = req.headers.get('webhook-signature');
  const verified = await verifyDodoWebhook(raw, signature);
  if (!verified) {
    // eslint-disable-next-line no-console
    console.warn('[dodo/webhook] signature mismatch — rejecting');
    return NextResponse.json({ ok: false, error: 'bad_signature' }, { status: 401 });
  }

  let payload: unknown;
  try { payload = JSON.parse(raw); } catch { return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 }); }

  const event = payload as {
    event_type?: string;
    type?: string;
    data?: {
      payment_id?: string;
      amount?: number;
      currency?: string;
      customer?: { name?: string; email?: string };
      metadata?: Record<string, string>;
    };
  };
  const eventType = event.event_type || event.type || '';

  // Only act on completed payments. Other lifecycle events (created,
  // processing) are no-ops on our side.
  if (eventType !== 'payment.succeeded' && eventType !== 'payment.completed') {
    return NextResponse.json({ ok: true, ignored: eventType });
  }

  const d = event.data ?? {};
  const meta = d.metadata ?? {};
  const service = meta.service ?? 'International order';
  const tier = meta.tier ?? '';
  const currencyDisplay = ({ USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$' } as Record<string, string>)[d.currency ?? 'USD'] ?? '$';
  // Dodo returns amounts in cents (or smallest unit) — convert to display.
  const amountDisplay = `${currencyDisplay}${((d.amount ?? 0) / 100).toFixed(2)}`;

  // 2. Asana task — same call site as Razorpay verify uses.
  const task = await createOrder({
    fullName: d.customer?.name ?? 'Unknown',
    email: d.customer?.email ?? 'unknown@unknown',
    service,
    tier,
    total: amountDisplay,
    fileLink: meta.fileLink,
    deliveryHours: Number(meta.deliveryHours) || 48,
  });

  // 3. Slack ping — #orders or firehose fallback.
  await postToSlack({
    ...buildOrderMessage({
      fullName: d.customer?.name ?? 'Unknown',
      email: d.customer?.email ?? 'unknown@unknown',
      service,
      tier,
      total: amountDisplay,
      deliveryHours: Number(meta.deliveryHours) || 48,
      asanaTaskUrl: task?.permalink_url,
    }),
    channel: 'orders',
  });

  return NextResponse.json({ ok: true, asanaUrl: task?.permalink_url ?? null });
}
