# Payments setup — Razorpay (live wire-up checklist)

Last updated: 2026-05-30

The Razorpay test keys are wired and `OrderFlow.tsx` already opens the real
Razorpay checkout dialog. This doc covers (a) testing it RIGHT NOW with test
cards, and (b) flipping to live mode when you're ready to charge real money.

---

## 1. Test the integration right now (60 seconds)

1. `npm run dev` from the project root
2. Open `http://localhost:3000/order`
3. Pick any service → fill the client details → click **Proceed**
4. Razorpay dialog opens (the orange-branded one from the test creds)
5. Use these test creds:
   - **Card:** `4111 1111 1111 1111`  ·  CVV `123`  ·  Expiry `12/26`  ·  Name anything
   - **UPI:**  `test@razorpay`
   - **Netbanking:** any bank → "Success" button on the simulator page
6. Payment succeeds → you're redirected to `/onboard`
7. Check:
   - Asana → Project 4 "One-Off Orders" → the card should be in **🆕 New Order (0–6h)** with a 48h `due_at`
   - Slack → `#orders` channel → "🆕 New Order" message with an "Open in Asana" button

If any of those four checks fail, see §4 below.

---

## 2. Go live (when ready)

1. Complete Razorpay KYC at <https://dashboard.razorpay.com> (PAN, bank account, GST if applicable)
2. Once approved, switch to **Live mode** in the dashboard
3. Go to **Account & Settings → API Keys → Generate Live Key**
4. Replace in `.env.local`:
   ```
   RAZORPAY_KEY_ID=rzp_live_XXXXXXXXX
   RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXX
   ```
5. **Also set these in Vercel/Netlify production env** — never commit live keys to git
6. Set up the webhook:
   - Dashboard → **Settings → Webhooks → Add New Webhook**
   - URL: `https://echopulse.media/api/razorpay/webhook`
   - Secret: generate a strong random string → paste here AND into `.env.local` as `RAZORPAY_WEBHOOK_SECRET`
   - Events to subscribe to:
     - ✅ `payment.captured` (the redundant backup to /verify)
     - ✅ `payment.failed` (alerts #urgent)
     - ✅ `subscription.activated` (for retainer signups)
     - ✅ `subscription.charged` (monthly renewal hits)
     - ✅ `subscription.cancelled` (move card to Churned)

---

## 3. The three endpoints

| Route | Purpose |
|---|---|
| `POST /api/razorpay/order` | Client calls this to start checkout — server creates the Razorpay order, returns `orderId + amount + currency + keyId` |
| `POST /api/razorpay/verify` | Client calls this AFTER the checkout dialog returns success — server HMAC-verifies the signature, then fires Asana + Slack |
| `POST /api/razorpay/webhook` | Razorpay calls this server-to-server — redundant backup that catches payments even if the user closes their browser |

`lib/razorpay.ts` holds the shared logic:
- `createRazorpayOrder()` — server-side order create
- `verifyRazorpayPaymentSignature()` — HMAC check for payment handler
- `verifyRazorpayWebhookSignature()` — HMAC check for webhook receiver

---

## 4. If something doesn't work

| Symptom | Most likely cause |
|---|---|
| "Razorpay script failed to load" | Ad-blocker. Try incognito. |
| Dialog opens but says "Invalid amount" | `amountSmallest` is < 100. Check that `total` is at least ₹1. |
| Payment succeeds but no Asana card | Check `ASANA_TOKEN` in `.env.local` — `/api/razorpay/verify` logs the error |
| Payment succeeds but no Slack message | Check `SLACK_WEBHOOK_URL` (or `SLACK_WEBHOOK_ORDERS` if you've split channels) |
| `Invalid signature` from /verify | Wrong `RAZORPAY_KEY_SECRET`. Copy fresh from the Razorpay dashboard. |
| Webhook 401s | Wrong `RAZORPAY_WEBHOOK_SECRET`. Must match what's in the dashboard webhook config. |

---

## 5. Retainer subscriptions (Pilot/Growth/Full Studio)

The one-off path above handles single orders. For monthly retainers we'll use
**Razorpay Subscriptions** (separate API). Setup when you're ready to bill:

1. Dashboard → **Subscriptions → Plans → Create Plan** — one plan per tier per currency
2. Save the plan IDs to `.env.local` (e.g. `RAZORPAY_PLAN_PILOT_INR=plan_xxxxx`)
3. Add a `RazorpaySubscribe` button to `Pricing.tsx` that calls `/api/razorpay/subscribe`
4. `/api/razorpay/subscribe` creates a subscription, returns a short link
5. The `subscription.activated` webhook in `/api/razorpay/webhook` fires → `createRetainerClient()`
   → both Retainer Pipeline AND Profile Card created in Asana, `#wins` ping in Slack

That's a separate ticket — current scope is the one-off `/order` flow.

---

## 6. Stripe (international clients)

When non-India clients want to buy:
1. Sign up at <https://dashboard.stripe.com>
2. Add `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` to `.env.local`
3. Mirror the Razorpay structure: `/api/stripe/checkout` + `/api/stripe/webhook`
4. Route by `useGeoPrice().region` — `IN` → Razorpay, everything else → Stripe

Out of scope for today. The current build serves India 100% via Razorpay.
