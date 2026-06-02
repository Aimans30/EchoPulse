# EchoPulse — Master Workflow & Setup Plan

Everything needed to run EchoPulse end-to-end. This document ties together the site, the CRM (Asana), the comms layer (Slack), payments (Razorpay + Stripe), and your team operations into a single coherent system.

Read in this order. Each section ends with **action items** + **time to complete**.

---

## Part 1 — The four workflows your business actually runs on

Every dollar your business makes flows through one of these four pipes. Build them in order.

### Workflow A — Visitor → Lead (top of funnel)

How an unknown human becomes a tracked lead in your CRM.

```
Visitor lands on echopulse.media
  ↓
Reads hero / services / pricing
  ↓
ONE of these conversion events:
  • Clicks "Book a strategy call"   → BookCallModal opens
  • Clicks "Order this service"     → /order page
  • Clicks Cal.com link directly    → external Cal.com page
  • Submits future contact form     → /api/lead
  ↓
Cal.com sends webhook → /api/lead (Next.js)
  ↓
/api/lead does THREE things in parallel:
  1. Create card in Asana Project 5 (Sales) → section "Hot (Meeting Booked)"
  2. Post to Slack #alerts: "🔥 New lead: [name]"
  3. Send confirmation email to lead (via SendGrid or Resend)
```

**What you ship to make this work:**
- `app/api/lead/route.ts` — POST endpoint that takes form/booking data and forks 3 ways
- Cal.com webhook configured to POST to `https://echopulse.media/api/lead`
- Asana token + Sales project GID in env

**Time:** 2 hours

---

### Workflow B — Lead → Customer (closing)

How a tracked lead becomes a paying client.

```
Lead is in Project 5 → "Hot"
  ↓
You take the strategy call (Cal.com auto-booked it)
  ↓
After the call you manually update Project 5 card:
  • Lead score +20 (budget confirmed)
  • Move to "Proposal Sent"
  • Add subtask: "Sent proposal · [date]"
  ↓
Lead replies YES → you move card to "Negotiating"
  ↓
You agree on plan → move to "Won"
  ↓
ASANA RULE fires: "Won" → auto-creates cards in Project 1 (Retainer Pipeline)
                  AND Project 2 (Profile Card)
                  AND Project 10 (Asset Registry)
                  AND posts to Slack #client-wins
  ↓
You manually:
  • Click the Project 1 card → triggers payment flow
  • Send Razorpay/Stripe subscription link to client
  ↓
Client pays
  ↓
Webhook hits /api/payment-success
  ↓
/api/payment-success:
  1. Updates Project 1 card → "Onboarding — Brief Pending"
  2. Posts to Slack #client-wins: "💰 [Name] paid — [Plan]"
  3. Triggers welcome email via Resend
  4. Auto-schedules onboarding call (Cal.com API)
```

**What you ship:**
- `lib/payments.ts` — gateway picker (Razorpay for IN, Stripe for rest)
- `app/api/checkout/route.ts` — creates the checkout session, returns redirect URL
- `app/api/payment-success/route.ts` — webhook handler from Razorpay + Stripe
- Razorpay account + webhook URL configured
- Stripe account + webhook URL configured

**Time:** 4 hours

---

### Workflow C — Customer → Delivery (the actual work)

How committed work gets shipped.

```
Project 1 card → "Onboarding — Brief Complete"
  ↓
ASANA RULE fires: auto-generates the right templates from Project 13:
  • Video client → copies "TEMPLATE — Video Editing onboarding" subtasks
  • LinkedIn client → copies "TEMPLATE — LinkedIn onboarding"
  • Etc.
  ↓
Also creates first week's deliverables in Project 3:
  • Growth plan = 5 reels → 5 cards in Project 3 "Backlog — This Week"
  • Owner auto-assigned based on service type
  ↓
Owner moves card to "In Production" → does the work
  ↓
Moves to "Internal Review" → Lakshya or Shaurya QCs
  ↓
Moves to "Sent to Client" → client receives via email/Slack/WhatsApp
  ↓
Client approves → moves to "Shipped & Approved"
  ↓
ASANA RULE: "Shipped & Approved" → updates Project 1 card's "Last shipped" field
                                  → posts to Slack #daily-shipping
  ↓
Recurring tasks regenerate next week's deliverables automatically
```

**What you ship:**
- All 4 onboarding templates created in Project 13 (one-time, manual in Asana)
- Asana Rules for template auto-copy + deliverable generation
- Slack #daily-shipping channel + Asana integration

**Time:** 1 hour (mostly clicking in Asana)

---

### Workflow D — Customer → Renewal or Churn

How you keep clients and spot when they're leaving.

```
ASANA RULE (daily): scan Project 1 for cards where "Next renewal" is within 30 days
  → moves matching cards to "Renewal Window"
  → posts to Slack #renewals: "🔄 [Client] renews in [N] days"
  ↓
You decide: reach out now, propose upsell, or just confirm
  ↓
PATH A — Confirms renewal: card stays Active, "Next renewal" + 30/90 days
PATH B — Cancels: client moves card to "Cancelled — This Month"
  → ASANA RULE: scheduled task created in Project 5
                "Win-back check-in with [Client]" — due 14 days out
  → Slack #churn-risk post
  ↓
PARALLEL CHURN SIGNALS — running constantly:
  • Last shipped > 7 days ago → Health score = Yellow
  • Revisions this month > 3 → Health score = Yellow
  • Reply latency > 48h → Health score = Yellow
  • Any Yellow flag stays 14+ days → Health score = Red
  ↓
Yellow / Red triggers post to Slack #churn-risk
  ↓
You intervene before it becomes a cancellation
```

**What you ship:**
- Asana Rules for renewal window + health score logic
- Slack channel mappings

**Time:** 30 minutes

---

## Part 2 — Site flow: every conversion event mapped

Every interactive element on the site, what it does, where it ends up.

| Trigger | Frontend | Backend | CRM result |
|---|---|---|---|
| Nav "Book a Free Call" button | Opens BookCallModal | Cal.com iframe | Cal.com webhook → /api/lead → Project 5 + Slack |
| Hero "Book a strategy call" | Opens BookCallModal | Cal.com iframe | Same as above |
| Pricing "Claim the Pilot" | Opens BookCallModal | Cal.com iframe | Same as above |
| Pricing "Book a Call" (Growth) | Cal.com link | Cal.com webhook | Project 5 + Slack |
| Pricing "Talk to Us" (Full) | Cal.com link | Cal.com webhook | Project 5 + Slack |
| Pricing "Order a service" | Navigates to /order | OrderFlow component | After submit → /api/checkout |
| Service page "Order this service" | `/order?service=[slug]` | OrderFlow pre-filled | Same as above |
| Service page "Or book a strategy call" | Opens BookCallModal | Cal.com iframe | Project 5 + Slack |
| PuneOffering "Book a strategy call" | Opens BookCallModal (Pune-tagged) | Cal.com iframe | Project 5 + Slack, tagged "Pune Local" |
| Footer LinkedIn link | External | n/a | n/a |
| MobileStickyCTA bar | Opens BookCallModal | Cal.com iframe | Project 5 + Slack |
| FAQ section | n/a | n/a | n/a |

**Every conversion path lands a card in Project 5 (Sales) within ~5 seconds of the user's action.** No leads ever fall through the cracks.

---

## Part 3 — The 6 API routes you need to build

This is your server-side glue layer.

### 3.1 — `/api/lead` (POST)

Receives lead captures from Cal.com webhook AND from a future contact form.

**Inputs:**
- `name`, `email`, `phone?`, `company?`, `source` (Cal.com / Contact form / etc.), `notes?`

**Outputs:**
1. Creates Asana task in Project 5 (Sales) → "Hot" section if from Cal.com, "Warm" if contact form
2. Posts to Slack #alerts (or #leads if you create one)
3. Sends confirmation email via Resend (optional)
4. Returns 200 OK to Cal.com so they don't retry

### 3.2 — `/api/checkout` (POST)

Receives order submissions from OrderFlow. Decides which payment gateway based on geo, creates a checkout session.

**Inputs:**
- `selection` (service, tier, addons), `client` (full ClientDetails from form), `total`, `currency`

**Outputs:**
1. Calls `getServerGeo()` → if IN, use Razorpay; else Stripe
2. Creates pending checkout session with gateway
3. Creates Asana task in Project 4 → "New Order — Payment Received" with all client fields populated, status = pending
4. Posts to Slack #alerts: "⏳ Pending order from [name] — [total]"
5. Returns `{ redirectUrl }` so frontend can `window.location = redirectUrl`

### 3.3 — `/api/webhook/razorpay` (POST)

Receives Razorpay's "payment.captured" webhook.

**Verifies HMAC signature** (Razorpay sends `x-razorpay-signature` header).

**Updates:**
1. Find pending Project 4 task with matching `order_id` field
2. Move to "Brief Confirmed (Timer Started)" — sets 48-hour deadline
3. Updates "Payment status" custom field to "Paid"
4. Post to Slack #client-wins: "💰 [Name] paid ₹[amount] — 48h timer starts now"
5. If it's a subscription event (retainer), update Project 1 + Project 2 cards

### 3.4 — `/api/webhook/stripe` (POST)

Same shape as Razorpay handler but for Stripe `checkout.session.completed` event.

**Verifies signature** with `stripe.webhooks.constructEvent` using `STRIPE_WEBHOOK_SECRET`.

### 3.5 — `/api/payment-success` (GET — redirect target)

Where Razorpay/Stripe send the user after payment.

**Renders:** `/order/success?session_id=...` page with confirmation copy + next steps.

Doesn't do CRM work — that's the webhook's job (webhooks are more reliable than redirects).

### 3.6 — `/api/lead-magnet` (POST) — already stubbed

When the lead-magnet form exists, it lands here. Adds to ESP (Mailerlite/ConvertKit) + Project 5 (Cold section).

---

## Part 4 — Complete credentials checklist

Everything you need to gather. Cross off as you collect.

### Asana
- [ ] **Personal Access Token** — `https://app.asana.com/0/my-apps` → New Access Token
- [ ] **Workspace GID** — visible in app URL
- [ ] **Project 1 GID** (Retainer Pipeline)
- [ ] **Project 2 GID** (Profile Cards)
- [ ] **Project 4 GID** (Orders)
- [ ] **Project 5 GID** (Sales)
- [ ] **Project 11 GID** (Internal Tasks)

### Slack (you already have one)
- [x] **Webhook URL** for `#all-echopulse-media` — already in `.env.local` ✓
- [ ] Optional: separate webhooks per channel (alerts, wins, daily-shipping, renewals, churn-risk)
- [ ] Optional: Slack bot token if you want richer interactions (in-channel buttons)

### Razorpay (India payments)
- [ ] Sign up at `https://dashboard.razorpay.com` — needs PAN + business verification (1 day)
- [ ] **Key ID** (`rzp_test_...` for test mode)
- [ ] **Key Secret**
- [ ] **Webhook URL** added pointing to `https://echopulse.media/api/webhook/razorpay`
- [ ] **Webhook secret** for HMAC verification

### Stripe (International payments)
- [ ] Sign up at `https://dashboard.stripe.com` — needs business details (1-2 days for activation)
- [ ] **Publishable Key** (`pk_test_...`) — used client-side
- [ ] **Secret Key** (`sk_test_...`)
- [ ] **Webhook URL** added pointing to `https://echopulse.media/api/webhook/stripe`
- [ ] **Webhook signing secret** (`whsec_...`)

### Cal.com
- [x] Account already exists (Lakshya Soni)
- [ ] **Webhook configured** — Settings → Developer → Webhooks → POST to `https://echopulse.media/api/lead`
- [ ] Event types covered: BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED
- [ ] Optional: **Cal.com API key** for programmatic booking creation

### Resend (transactional emails — optional but recommended)
- [ ] Sign up at `https://resend.com`
- [ ] **API key** (`re_...`)
- [ ] Verify your sending domain (`echopulse.media`)

---

## Part 5 — Asana setup detailed timing

Estimated time **per project**, from clicking "Create Project" to "this is ready to use":

| Project | Setup time | Notes |
|---|---|---|
| Global custom fields (do first) | 25 min | 14 fields, ~2 min each |
| 1 — Retainer Pipeline | 12 min | 9 sections, 4 custom fields |
| 2 — Profile Cards | 18 min | Big description template |
| 3 — Daily Board | 10 min | Just sections + fields |
| 4 — Orders | 12 min | 8 sections + timer fields |
| 5 — Sales | 15 min | Lots of custom fields |
| 6 — Content Calendar | 8 min | Calendar view + fields |
| 7 — Renewals | 10 min | Multi-section + fields |
| 8 — Team Capacity | 5 min | Tiny — 3 tasks |
| 9 — Knowledge Base | 12 min | 10 starter tasks |
| 10 — Asset Registry | 8 min | Card-per-client structure |
| 11 — Internal Tasks | 10 min | |
| 12 — Sales Activity | 8 min | |
| 13 — Onboarding Templates | 25 min | 4 templates × 10 subtasks |
| 14 — QBR Templates | 10 min | |
| 15 — Testimonials | 8 min | |
| 16 — Tooling Renewals | 15 min | Pre-create 13 tasks |
| **Rules + Slack mappings** | 30 min | |
| **Asana Forms** | 20 min | 3 forms |
| **TOTAL** | **~4 hours** | Spread over a day |

**Or run the Claude prompt in `ASANA-CLAUDE-PROMPT.md`** and it does most of this autonomously while you supervise. Estimated supervised time: 90 minutes.

---

## Part 6 — Implementation order (chronological)

The smart sequence to roll out so each piece works the moment it's built.

### Day 1 (90 min) — Foundation

1. ✅ Slack webhook in `.env.local` — **done**
2. ✅ `lib/slack.ts` helper + `/api/slack-test` route — **done**
3. ✅ Phone field in OrderFlow — **done**
4. Test Slack works: `curl http://localhost:3000/api/slack-test`
5. Build Asana skeleton (run the Claude prompt in your Chrome extension) — 90 min supervised

**End of Day 1:** Slack pings work. Asana has projects, sections, custom fields, and is empty but ready.

### Day 2 (2 hours) — Wiring

6. Add `ASANA_TOKEN` + 5 project GIDs to `.env.local`
7. I build `lib/asana.ts` — helper with `createTask`, `moveTask`, `updateTaskField` functions
8. I build `app/api/lead/route.ts` — Cal.com webhook handler
9. Configure Cal.com webhook → `/api/lead`
10. Test end-to-end: book a fake call → see card in Project 5 + Slack ping

**End of Day 2:** Every booking auto-creates a CRM card.

### Day 3 (3 hours) — Payments

11. Sign up Razorpay (test mode) → grab keys → add to `.env.local`
12. I build `lib/payments.ts` + `lib/razorpay.ts`
13. I build `app/api/checkout/route.ts` — geo-aware gateway selection
14. I build `app/api/webhook/razorpay/route.ts` — payment confirmation
15. I build `app/order/success/page.tsx` + `app/order/cancel/page.tsx`
16. Wire OrderFlow's "Proceed to payment" button → `/api/checkout` → redirect
17. Test with Razorpay test cards
18. Repeat 11–17 for Stripe (if doing international Day 3)

**End of Day 3:** Real money flows. CRM auto-updates. Slack pings.

### Day 4 (1 hour) — Polish

19. Add Resend for transactional emails (order confirmation, welcome, payment failure)
20. Build the contact form on the site (if not already)
21. Wire form → `/api/lead`
22. Final smoke test on every path

**End of Day 4:** Production-ready end-to-end flow.

---

## Part 7 — Production deployment

Before going live:

### Vercel environment variables

Copy every value from `.env.local` into Vercel's env config:
- Settings → Environment Variables
- Add each for "Production" environment
- Plus add for "Preview" so PR builds work

### Switch payment gateways from test → live

Once you've tested 5+ real transactions in test mode:
1. Razorpay: complete KYC, switch to live mode, swap `rzp_test_...` for `rzp_live_...`
2. Stripe: activate live mode, swap `sk_test_...` for `sk_live_...`
3. Update webhook URLs in both dashboards

### Final checks before announcing

- [ ] All 6 API routes return 200 on test invocations
- [ ] Webhooks verify signatures (security: anyone could POST fake events otherwise)
- [ ] Asana tasks created in correct sections
- [ ] Slack pings hit correct channels
- [ ] Email confirmations send + arrive
- [ ] Mobile flow works end-to-end on a real phone (not just devtools)
- [ ] Test order completes → real money moves → real card appears
- [ ] Refund flow tested in both gateways

---

## Part 8 — Monitoring & maintenance

What to watch after launch.

### Daily (2 min)
- Slack `#alerts` channel — any 4h-deadline warnings on Project 4?
- Asana My Tasks view — anything overdue?

### Weekly (15 min)
- Review Project 1 health scores — any new Yellow/Red?
- Review Project 5 → Lost section — any patterns in disqualified reasons?
- Review #daily-shipping count vs goal

### Monthly (30 min)
- Source ROI analysis (Project 5) — which channels convert?
- Renewals coming up — Project 7
- Subscription renewals — Project 16

### Quarterly (60 min)
- QBR every active client (Project 14)
- Refresh Knowledge Base playbooks (Project 9)
- Review pricing across geo tiers — any adjustments?

---

## Part 9 — What I'll build for you (in detail)

When you give me `ASANA_TOKEN` + 5 project GIDs, here's the exact code I'll write:

### `lib/asana.ts` — ~150 lines
- `createTask({ projectGid, sectionGid?, name, notes, customFields? })`
- `moveTaskToSection({ taskGid, sectionGid })`
- `updateTaskCustomField({ taskGid, fieldGid, value })`
- `addSubtask({ parentTaskGid, name, notes })`
- `getSectionGids({ projectGid })` — lookup helper

### `app/api/lead/route.ts` — ~80 lines
- POST handler
- Validates payload
- Extracts source from referrer or explicit field
- Calls `createTask` in Project 5
- Posts to Slack via `postToSlack`
- Returns 200

### `app/api/checkout/route.ts` — ~120 lines
- POST handler
- Calls `getServerGeo()`
- Routes to `createRazorpaySession` or `createStripeSession`
- Creates Asana task in Project 4 with payment status "pending"
- Returns redirect URL

### `lib/razorpay.ts` — ~80 lines
- `createOrder({ amount, currency, notes })` — returns order ID + checkout URL
- `verifyWebhookSignature({ body, signature })` — HMAC check

### `lib/stripe.ts` — ~80 lines
- `createCheckoutSession({ priceId or amount, customer, metadata })` — returns session URL
- Webhook signature verification via `stripe.webhooks.constructEvent`

### `app/api/webhook/razorpay/route.ts` — ~100 lines
### `app/api/webhook/stripe/route.ts` — ~100 lines

### `app/order/success/page.tsx` + `app/order/cancel/page.tsx` — small UI pages

**Total new code: ~750 lines.** Lint clean. TypeScript strict. Server-only where credentials are involved.

---

## Part 10 — Risk + edge cases I've designed around

Things that will happen, and how the system handles them.

| Risk | Handler |
|---|---|
| Cal.com webhook fails to deliver | Cal.com retries automatically; if all fail, lead is still in Cal.com — manually import |
| Razorpay payment captured but webhook fails | Razorpay retries 5 times over 24h; cron checks Asana for pending orders >2h old |
| Webhook signature spoofed | All webhook handlers verify signatures BEFORE doing CRM work |
| Asana API down | `postToSlack` still works; lead lands in Slack so it's not lost; we add it to Asana when service recovers |
| Slack webhook URL leaked | Rotate immediately in Slack; old URL invalidated; update `.env.local` |
| Client double-submits form | Idempotency key on `/api/checkout`; same client+timestamp = same Asana card |
| Refund processed | Webhook from gateway → moves Project 4 card to "Refunded" → posts to Slack |
| Subscription cancelled mid-cycle | Webhook from gateway → Project 1 card → "Cancelled — This Month" |
| You make a manual change in Asana | No reverse sync — the site is the source of truth for transactional events; Asana is the source of truth for status |

---

## Action items — what to do RIGHT NOW

In this order:

1. **Restart `npm run dev`** — pick up the Slack URL
2. **Visit `localhost:3000/api/slack-test`** — verify Slack works
3. **Visit `localhost:3000/api/slack-test?type=order`** — verify the order format looks good in your channel
4. **Open `ASANA-CLAUDE-PROMPT.md`** — paste into Claude in Chrome with Asana access
5. **Supervise Claude through the Asana build** (~90 min)
6. **At the end, Claude reports project GIDs** — paste them into `.env.local`
7. **Ping me** — I'll write all the API routes + payment integrations on Day 2

That's the path. Everything is documented and waiting.
