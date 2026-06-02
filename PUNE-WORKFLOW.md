# Pune Onsite Workflow

Last updated: 2026-05-30

The Pune funnel is **separate** from the standard online retainer / one-off
order flow. This doc covers the full pipeline from a Pune visitor landing on
the site to a confirmed in-person shoot.

---

## Why Pune is different

| Standard online flow | Pune onsite flow |
|---|---|
| OrderFlow + Razorpay checkout | PuneInquiryModal — no charge upfront |
| Phone optional | **Phone REQUIRED** |
| Asana → One-Off Orders (48h clock) | Asana → Sales Pipeline · Discovery Call Booked |
| Slack → `#orders` | Slack → `#pune-onsite` |
| Delivery in 48h-5d auto | Scope confirmed on call, then Razorpay link |
| Async work | In-person logistics: parking, access, crew routing |

The reason: an onsite shoot involves coordinating physical access, equipment
routing, and parking — things that need a real conversation before money
moves. We confirm scope first, send a Razorpay link after.

---

## The funnel (step by step)

### 1. Visitor lands on site as a Pune user
- Geo-detected via Vercel `x-vercel-ip-city: Pune` OR via the dev override `?city=Pune&country=IN`
- PuneOffering section renders above the Pricing block (only for Pune visitors)

### 2. Visitor sees the four Pune packages
- **Short-Form Studio** — ₹44,999/mo, 18-25 reels
- **Content Day** — ₹15,999, 12 reels per day
- **Property Reel** — ₹9,999 per listing
- **Realtor Pack** — ₹24,999 for 3 properties
- Plus a "Pitch a custom shoot" row for off-menu requests

### 3. Visitor clicks any Pune CTA
- All Pune CTAs open `PuneInquiryModal` (NOT BookCallModal or Razorpay checkout)
- The clicked package is preselected in the modal's dropdown

### 4. Visitor fills the inquiry form
Form fields (required marked with *):
- **Full name** *
- **Email** *
- **Phone** * (WhatsApp-friendly — used for the callback)
- **Package interest** * (dropdown, preselected from the CTA they clicked)
- **Preferred shoot dates** * (text, e.g. "weekend of Jun 20-21")
- **Best time to call** (text, e.g. "weekdays after 6 pm IST")
- **Anything we should know?** (notes — location, brand context, budget feel)

### 5. Visitor hits "Send inquiry → we call you back"
Client POSTs to `/api/pune-inquiry`. Server-side, that handler:

1. **Validates** that fullName, email, phone, and preferredDates are all present
2. **Creates an Asana task** in `Sales Pipeline → Discovery Call Booked` with:
   - Title: `[PUNE] {Name} · Pune onsite form · {Package}`
   - Notes: full inquiry payload with `📍 PUNE ONSITE INQUIRY` header + the
     line `NEXT STEP: WhatsApp/call within 4 work hours to confirm shoot.`
3. **Pings Slack** `#pune-onsite` with:
   - Header: `📍 New Pune Onsite Inquiry`
   - Section: Name, email, phone (with "call them — they expect it within 4h"
     hint), package, preferred dates, best time to call, notes
   - Action button: "Open in Asana" (deep link)
   - Context line: timestamped reminder for Lakshya/Aiman

### 6. Visitor sees the success state
- Inquiry modal flips to the success state:
  > ✓ You're on the list. We'll call you on {phone} {time}.
- They can close the modal — no further site action expected from them

### 7. Operator (Lakshya / Aiman) reaches out within 4 work hours
- Pick up from Slack `#pune-onsite` ping OR Asana card
- WhatsApp first (faster, more personal), call as fallback
- Confirm: exact shoot date + location + scope + final price

### 8. Operator sends a Razorpay link
- Generated manually for now (in `dashboard.razorpay.com → Payment Links`)
- Once paid, manually move the Asana card from `Discovery Call Booked` →
  `Closed Won → move to Retainer/Order`, then manually create a card in
  the Daily Board for shoot logistics

> Future automation: when /api/razorpay/webhook receives `payment.captured`
> tied to a Pune inquiry, auto-move the card and seed the Daily Board entry.
> Currently manual to keep MVP shipping.

---

## Slack message structure (#pune-onsite)

```
📍 New Pune Onsite Inquiry

*Name:* Anita Sharma
*Email:* anita@punehomes.in
*Phone:* +91 9XXX XXXXX  (call them — they expect it within 4h)
*Package:* Realtor Pack (3 properties)
*Preferred shoot dates:* June 20-21 weekend
*Best time to call:* weekdays after 6 pm IST

*Notes:* Three flats in Hinjewadi + Wakad. All vacant — easy access.

[ Open in Asana ]

Lakshya/Aiman: pick this up and call within 4 work hours · 30/05/2026, 18:22
```

---

## Asana card structure (Sales Pipeline · Discovery Call Booked)

Title: `[PUNE] Anita Sharma · Pune onsite form · Realtor Pack (3 properties)`

Notes:
```
📍 PUNE ONSITE INQUIRY

Package interest: Realtor Pack (3 properties)
Preferred shoot dates: June 20-21 weekend
Best time to call: weekdays after 6 pm IST

Notes from prospect:
Three flats in Hinjewadi + Wakad. All vacant — easy access.

———
NEXT STEP: WhatsApp/call within 4 work hours to confirm shoot.
```

Production team uses the `[PUNE]` prefix to filter the board.

---

## Setup checklist (one-time)

1. ✅ `PuneInquiryModal.tsx` mounted in `app/layout.tsx`
2. ✅ `/api/pune-inquiry` route handler in place
3. ✅ `lib/slack.ts` understands `channel: 'pune'`
4. ✅ `.env.local` has `SLACK_WEBHOOK_PUNE=` placeholder
5. ⏳ **You:** create `#pune-onsite` channel in Slack (or let Claude drive it)
6. ⏳ **You:** create an Incoming Webhook for `#pune-onsite` at
   <https://api.slack.com/apps> and paste the URL into `SLACK_WEBHOOK_PUNE`
   in `.env.local`
7. ⏳ **You:** restart `npm run dev` so the new env vars load
8. ⏳ **You:** test the flow at `localhost:3000/?city=Pune&country=IN` → click a Pune CTA → submit form → confirm Asana card + Slack ping land

Until step 6 is done, Pune inquiries fall back to the default firehose
webhook (`#all-echopulse-media`) so nothing breaks — you just see them in
the noisier channel instead of the dedicated one.

---

## Why phone is REQUIRED for Pune (and optional elsewhere)

The standard `/order` flow ships deliverables to the client's inbox; no
need to physically meet. The Pune flow involves driving to the client's
location with camera kit and a crew. We need to reach them by phone the
same day to:

1. **Confirm address + parking + access** (apartment buzzer code, gate
   security, lift access for equipment)
2. **Time the visit** around their schedule (real estate showings don't
   pause for a content shoot)
3. **Discuss scope verbally** — what they thought they wanted vs. what's
   actually shootable in 4 hours

Email-only would mean a 2-day async ping-pong before the shoot lands.
Phone collapses that to one 15-minute call.

---

## When Slack `#pune-onsite` isn't created yet

The fallback chain in `lib/slack.ts` is:
```
channel: 'pune'
  → process.env.SLACK_WEBHOOK_PUNE          (if set)
  → process.env.SLACK_WEBHOOK_URL           (firehose fallback)
  → null  (skip — log a warning)
```

So you can ship the form before the channel exists; Pune pings just go to
the firehose until you wire the dedicated webhook.
