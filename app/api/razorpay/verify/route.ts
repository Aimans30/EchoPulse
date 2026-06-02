import { NextResponse } from 'next/server';
import { verifyRazorpayPaymentSignature } from '@/lib/razorpay';
import { createOrder } from '@/lib/asana';
import { postToSlack, buildOrderMessage } from '@/lib/slack';

/**
 * Verify a Razorpay payment + fire the order pipeline.
 *
 * After Razorpay's checkout dialog closes successfully, the client posts
 * { razorpay_order_id, razorpay_payment_id, razorpay_signature } to us.
 * We HMAC-verify the signature with our secret. If valid → we treat it
 * as a confirmed payment, create the Asana card with the 48h clock, and
 * ping Slack #orders.
 *
 * This is the ONLY trusted source of payment confirmation from the
 * client side. The webhook at /api/razorpay/webhook is the redundant
 * backup that fires even if the user closes their browser after paying.
 *
 * Body shape:
 *   {
 *     razorpay_order_id, razorpay_payment_id, razorpay_signature,
 *     client: { fullName, email, phone, service, tier, total, fileLink }
 *   }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, client } = body ?? {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ ok: false, error: 'missing payment fields' }, { status: 400 });
    }

    const valid = verifyRazorpayPaymentSignature({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });
    if (!valid) {
      return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });
    }

    // Payment confirmed — fire the order pipeline. The client passes the
    // resolved deliveryHours (48 / 72 / 96 / 120) from getDeliveryHours()
    // so the server doesn't need to re-derive the per-tier delivery rule.
    if (client?.fullName && client?.email && client?.service) {
      const deliveryHours = Number(client.deliveryHours) || 48;
      const asanaTask = await createOrder({
        fullName: client.fullName,
        email: client.email,
        phone: client.phone,
        service: client.service,
        tier: client.tier,
        total: String(client.total),
        fileLink: client.fileLink,
        deliveryHours,
      });

      await postToSlack(
        buildOrderMessage({
          fullName: client.fullName,
          email: client.email,
          phone: client.phone,
          service: client.service,
          tier: client.tier,
          total: String(client.total),
          fileLink: client.fileLink,
          asanaTaskUrl: asanaTask?.permalink_url,
          deliveryHours,
        }),
      );

      return NextResponse.json({
        ok: true,
        paymentId: razorpay_payment_id,
        asanaUrl: asanaTask?.permalink_url ?? null,
      });
    }

    // Payment valid but missing client info — still acknowledge
    return NextResponse.json({ ok: true, paymentId: razorpay_payment_id });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[/api/razorpay/verify] failed:', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
