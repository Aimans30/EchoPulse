import 'server-only';
import crypto from 'crypto';

/**
 * Razorpay server-side helper.
 *
 * Server-only because RAZORPAY_KEY_SECRET is a credential. Never import
 * from a client component. The public key (NEXT_PUBLIC_RAZORPAY_KEY_ID)
 * is fine on the client and is read directly by the Razorpay script tag
 * in OrderFlow.
 *
 * Two responsibilities:
 *   1. createRazorpayOrder() — server-side order creation. Returns the
 *      Razorpay order ID + amount, which the client then passes to the
 *      Razorpay Checkout SDK to actually open the payment dialog.
 *   2. verifyRazorpaySignature() — confirm the payment really happened
 *      on Razorpay's side before we mark the order as paid.
 *
 * Webhook handler lives at /api/razorpay/webhook.
 */

const RAZORPAY_API = 'https://api.razorpay.com/v1';

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

/**
 * Create an order on Razorpay. Amount is in the SMALLEST currency unit:
 *   INR → paise   (1 INR = 100 paise — pass 4999 to charge ₹49.99)
 *   USD → cents
 *
 * For an INR ₹4,999 charge: pass amountSmallest = 499900.
 * For an INR ₹999 charge:   pass amountSmallest = 99900.
 */
/**
 * Result type that ALSO returns the error payload so the API route can
 * surface it in dev mode for debugging. Don't ship raw Razorpay errors
 * to the client in production — they can leak details.
 */
export type RazorpayOrderResult =
  | { ok: true; order: RazorpayOrder }
  | { ok: false; reason: 'missing_env' | 'http_error' | 'exception'; status?: number; detail?: string };

export async function createRazorpayOrder(args: {
  amountSmallest: number;
  currency?: 'INR' | 'USD';
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrderResult> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    // eslint-disable-next-line no-console
    console.warn(
      '[razorpay] missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET — ' +
      'check .env.local and restart `npm run dev` (Next.js reads env vars once at server start)',
    );
    return { ok: false, reason: 'missing_env', detail: 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set on the server. Restart `npm run dev` after editing .env.local.' };
  }

  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  try {
    const res = await fetch(`${RAZORPAY_API}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: args.amountSmallest,
        currency: args.currency ?? 'INR',
        receipt: args.receipt,
        notes: args.notes ?? {},
      }),
    });
    const text = await res.text().catch(() => '');
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error('[razorpay] order create failed:', res.status, text);
      return { ok: false, reason: 'http_error', status: res.status, detail: text };
    }
    const order = JSON.parse(text) as RazorpayOrder;
    return { ok: true, order };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[razorpay] order create threw:', err);
    return { ok: false, reason: 'exception', detail: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Verify the payment signature returned by the Razorpay Checkout SDK.
 * The client posts { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * back to us. We hash (order_id + "|" + payment_id) with our secret and
 * confirm it matches the signature.
 *
 * RETURN TRUE only after this check. Do NOT trust the client.
 */
export function verifyRazorpayPaymentSignature(args: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${args.razorpayOrderId}|${args.razorpayPaymentId}`)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(args.razorpaySignature));
  } catch {
    return false;
  }
}

/**
 * Verify a Razorpay WEBHOOK signature (different format than payment sig).
 * Razorpay sends the signature in the `x-razorpay-signature` header; the
 * body is HMAC-SHA256'd with the webhook secret (set in dashboard).
 */
export function verifyRazorpayWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
