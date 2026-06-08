import { NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay';
import { postToSlack } from '@/lib/slack';

/**
 * Razorpay webhook receiver — the redundant backup to /verify.
 *
 * SETUP:
 *   dashboard.razorpay.com → Settings → Webhooks → Add New Webhook
 *   URL:    https://YOUR-DOMAIN/api/razorpay/webhook
 *   Secret: generate random string, paste into RAZORPAY_WEBHOOK_SECRET
 *   Events: ✓ payment.captured  ✓ payment.failed  ✓ subscription.activated
 *           ✓ subscription.charged  ✓ subscription.cancelled
 *
 * Even if the user closes their browser after paying, this fires server-to-server
 * and we still get the confirmation. Idempotency: Razorpay may retry on failure;
 * use payment_id as the dedup key when wiring real persistence.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });
  }

  let event: { event: string; payload: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  // For now: just ping Slack #urgent on payment.failed so we catch them
  // fast. Successful payments are already handled by /api/razorpay/verify
  // (called from the client immediately after checkout closes).
  if (event.event === 'payment.failed') {
    const payment = (event.payload as { payment?: { entity?: Record<string, unknown> } })?.payment?.entity ?? {};
    await postToSlack({
      text: `🔴 Payment failed — investigate`,
      channel: 'urgent',
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: '🔴 Payment Failed', emoji: true } },
        { type: 'section', text: { type: 'mrkdwn', text: `*Payment ID:* ${String(payment.id ?? 'unknown')}\n*Amount:* ${String(payment.amount ?? 'unknown')}\n*Method:* ${String(payment.method ?? 'unknown')}\n*Reason:* ${String(payment.error_description ?? 'unknown')}` } },
      ],
    });
  }

  // Subscription events — wire createRetainerClient() here when monthly
  // retainer plans go live on Razorpay Subscriptions.
  if (event.event === 'subscription.activated' || event.event === 'subscription.charged') {
    // TODO: extract subscriber details + tier from event.payload.subscription
    // Then call createRetainerClient() + buildRetainerWinMessage to fire to #wins
  }

  return NextResponse.json({ ok: true, event: event.event });
}
