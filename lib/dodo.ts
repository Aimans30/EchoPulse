import 'server-only';

/**
 * Dodo Payments client — Merchant-of-Record gateway for EchoPulse's
 * INTERNATIONAL clients (US, UK, EU, CA, AU, rest of world).
 *
 * Why Dodo and not Stripe direct:
 *   - Dodo is the Merchant of Record → they handle global VAT/sales-tax,
 *     refunds, chargebacks, currency conversion. EchoPulse just receives
 *     INR payouts to a local bank account.
 *   - Indian business + international customers = standard Stripe setup is
 *     painful (RBI rules, FEMA compliance). Dodo abstracts all of it.
 *   - Razorpay (used for India clients) only accepts INR cards reliably.
 *     Dodo accepts USD, EUR, GBP, CAD, AUD, and ~30 more.
 *
 * How the site routes:
 *   - Region IN  → Razorpay  (lib/razorpay client)
 *   - All others → Dodo      (this file)
 *
 * Env vars in .env.local:
 *   DODO_API_KEY=dodo_test_...   (server-side, never expose)
 *   DODO_WEBHOOK_SECRET=...      (for verifying webhook signatures)
 *   DODO_ENV=test | live          (defaults to test)
 *
 * Test card (Dodo dashboard documents these):
 *   4242 4242 4242 4242 · any CVV · any future expiry
 */

const DODO_API = (process.env.DODO_ENV === 'live'
  ? 'https://api.dodopayments.com'
  : 'https://test.dodopayments.com');

export interface DodoCheckoutInput {
  /** Amount in the smallest unit (cents/pence/etc) */
  amountSmallest: number;
  /** ISO currency code — must be supported by Dodo */
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  /** Human-readable line item name shown on the hosted checkout */
  productName: string;
  /** Short description that helps the buyer recognise the charge */
  productDescription: string;
  /** Buyer details — Dodo prefills these on hosted checkout */
  customer: {
    email: string;
    name: string;
    country?: string;     // ISO 3166-1 alpha-2 (e.g. 'US', 'GB')
  };
  /** Where Dodo redirects after success / cancellation */
  returnUrl: string;
  cancelUrl?: string;
  /** Arbitrary metadata Dodo echoes back in the webhook payload */
  metadata?: Record<string, string>;
}

export interface DodoCheckoutSession {
  id: string;
  /** URL the browser navigates to for the hosted payment page */
  payment_link: string;
  status: 'open' | 'completed' | 'expired' | 'cancelled';
}

/**
 * Create a hosted checkout session. Returns the payment_link the browser
 * navigates to. Server-only; never expose the API key client-side.
 */
export async function createDodoCheckout(input: DodoCheckoutInput): Promise<DodoCheckoutSession | null> {
  const key = process.env.DODO_API_KEY;
  if (!key) {
    // eslint-disable-next-line no-console
    console.warn('[dodo] DODO_API_KEY not set — skipping checkout creation');
    return null;
  }

  // Dodo's one-time-payment endpoint shape (matches their docs as of 2026).
  // If the API surface drifts, this is the only spot to update.
  const body = {
    payment_link: true,                   // request a hosted-page link back
    billing: {
      city: 'Unknown',
      country: input.customer.country || 'US',
      state: 'Unknown',
      street: 'Unknown',
      zipcode: '00000',
    },
    customer: {
      email: input.customer.email,
      name: input.customer.name,
    },
    product_cart: [
      {
        product_id: 'dynamic',            // dynamic-amount product mode
        quantity: 1,
        amount: input.amountSmallest,
        currency: input.currency,
        product_name: input.productName,
        product_description: input.productDescription,
      },
    ],
    return_url: input.returnUrl,
    metadata: input.metadata ?? {},
  };

  try {
    const res = await fetch(`${DODO_API}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error('[dodo] checkout create failed:', res.status, await res.text().catch(() => ''));
      return null;
    }
    const json = await res.json() as { id?: string; payment_link?: string; status?: string };
    if (!json.payment_link) return null;
    return {
      id: json.id ?? '',
      payment_link: json.payment_link,
      status: (json.status as DodoCheckoutSession['status']) ?? 'open',
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[dodo] checkout threw:', err);
    return null;
  }
}

/**
 * Verify the HMAC signature Dodo sends on every webhook. The shared secret
 * is configured per-webhook-endpoint in the Dodo dashboard and lives in
 * DODO_WEBHOOK_SECRET. Returns true if the signature matches.
 *
 * Dodo signs the raw request body using HMAC-SHA256 and base64-encodes
 * the result. The header `webhook-signature` carries the signature.
 */
export async function verifyDodoWebhook(rawBody: string, signature: string | null): Promise<boolean> {
  const secret = process.env.DODO_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  // Use Node's crypto in subtle-compat mode so this also runs on Edge.
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(rawBody));
  const expected = Buffer.from(sig).toString('base64');
  // Constant-time compare via length-equal + bitwise diff
  if (signature.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}
