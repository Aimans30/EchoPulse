import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';

/**
 * Create a Razorpay order so the client can open the checkout dialog.
 *
 * Client flow:
 *   1. User clicks "Pay" in OrderFlow
 *   2. Client POSTs to /api/razorpay/order with { amountSmallest, receipt }
 *   3. We create a Razorpay order server-side (using the secret key)
 *   4. Return { orderId, amount, currency, keyId } to the client
 *   5. Client passes those to window.Razorpay() to open the modal
 *   6. After payment, client POSTs the signature to /api/razorpay/verify
 *
 * Amount is in SMALLEST currency unit (paise for INR, cents for USD).
 * For ₹4,999 → pass 499900.
 *
 * Error surfacing: in dev mode the actual Razorpay error message is
 * passed through so the user can see WHY the order failed (missing env,
 * invalid keys, bad amount, etc.). In prod we return a generic message
 * — never leak Razorpay's raw error to the client.
 */
export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV !== 'production';
  try {
    const body = await req.json();
    const { amountSmallest, currency = 'INR', receipt, notes } = body ?? {};

    if (!amountSmallest || amountSmallest < 100) {
      return NextResponse.json(
        { ok: false, error: 'amountSmallest must be at least 100 (₹1 / $0.01)' },
        { status: 400 },
      );
    }

    const result = await createRazorpayOrder({
      amountSmallest: Number(amountSmallest),
      currency,
      receipt: receipt ?? `rcpt_${Date.now()}`,
      notes,
    });

    if (!result.ok) {
      // Map internal reasons to client-facing messages.
      const userMsg = (() => {
        switch (result.reason) {
          case 'missing_env':
            return 'Payment system not configured. Please contact support.';
          case 'http_error':
            return result.status === 401
              ? 'Payment system authentication failed. Please contact support.'
              : 'Razorpay rejected the order. Please try again.';
          case 'exception':
            return 'Could not reach the payment system. Check your connection and try again.';
        }
      })();

      return NextResponse.json({
        ok: false,
        error: userMsg,
        // Only leak the raw detail in dev mode — never in production
        ...(isDev ? { _debug: { reason: result.reason, status: result.status, detail: result.detail } } : {}),
      }, { status: 502 });
    }

    const { order } = result;
    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[/api/razorpay/order] failed:', err);
    return NextResponse.json({
      ok: false,
      error: 'internal',
      ...(isDev ? { _debug: { message: err instanceof Error ? err.message : String(err) } } : {}),
    }, { status: 500 });
  }
}
