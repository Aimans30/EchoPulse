# EchoPulse — Master Brief

*The single document that captures the vision, positioning, services, pricing, and operating system behind EchoPulse. Living reference — update as the business evolves.*

---

## 1. The One-Liner

**Marketing without the agency tax.**

One owner-operated studio. Video, content, ads, sites, and code — replied to in 3 hours, re-done until you'd ship it under your own name. Get 20 hours of your week back.

---

## 2. Founder

**Lakshya Soni.** Based in Bhopal, India. Operates EchoPulse solo.

Background that the studio is built on:

- Editing video professionally since age 18 — across formats, at a Canadian production studio
- Marketing lead at a Canadian SaaS company
- Frontend engineer shipping production code
- Multi-discipline operator: video, motion design, content strategy, ad creative, web, code

The pitch is honest about what this is: not a faceless agency, not a generic freelancer marketplace. One operator with five disciplines stacked on top of each other, deciding which one to deploy at any given moment for a given client.

---

## 3. Vision & Positioning

**The problem EchoPulse solves.** Founders, coaches, business owners, and real estate agents are losing 20 to 30 hours per week to content operations they shouldn't be doing themselves — editing clips, writing posts, briefing freelancers, rewriting drafts that still miss the mark, coordinating between five vendors who don't talk to each other.

**The angle.** Five vendors fired. One studio hired. The studio replaces the video editor, the social writer, the ad creative person, the web designer, and the developer with a single team that has all five disciplines under one roof and one bill.

**The promises that define the brand.**

The first is **owner-operated**. The person you book the call with is the person editing your reels, writing your launch page, and pushing your code. No account managers, no juniors, no "I'll check with the team."

The second is **3-hour replies**. Inside every working day. Not "we'll get back to you within 24-48 hours" — actual real-time responsiveness.

The third is **re-done until right**. Unlimited revisions are the standard, not the upsell. The bar isn't "client signed off" — it's "would you publish this under your own name without flinching."

The fourth is **no agency tax**. The standard agency markup (junior labor, account managers, project managers, office rent, sales commission) doesn't exist here, so the same quality work lands at less than half the price.

**The voice.** Direct. Confident. Not corporate, not bro-y, not faux-humble. Operator-to-operator: "I do this, here's what it costs, here's how fast, here's what you get." No fluff, no "let's hop on a discovery call." If anything is being sold, it's taste — and taste is shown, not described.

---

## 4. Who EchoPulse Serves

Four ICP segments, ranked by best-fit:

**Founders building a personal brand around their company.** SaaS founders, indie hackers, agency owners who realized their face/voice IS the GTM. They need a consistent flywheel of video + LinkedIn + blog + ads.

**Coaches scaling beyond 1-on-1.** Course creators, group programs, masterminds. Their offer lives or dies by content distribution, and they can't afford to write every post themselves anymore.

**Business owners running real operations.** E-commerce, services, local businesses doing 7-figures+ who need marketing without hiring an in-house team of 5.

**Real estate agents and brokerages.** Listing reels, agent personal brand, neighborhood content, lead magnets. A specific Pune-only on-site shoot tier exists for this segment.

---

## 5. The Seven Services

The site has seven dedicated service pages. Each runs the same engine — owner-operated, 3h replies, re-do until right — but applied to a specific discipline. URL slugs are listed for reference.

**1. Video Editing** — `/services/video-editing`. Short-form (Reels, TikToks, Shorts), long-form YouTube, podcast edits + highlights, course module editing, cinematic brand films, motion + sound design. 48h standard turnaround.

**2. LinkedIn Ghostwriting** — `/services/linkedin-ghostwriting`. 4–5 short-form posts per week, deep-dive carousels, brand brief document, engagement drafts, profile optimization, monthly performance review.

**3. Blog Production** — `/services/blog-production`. 1,500–3,000 word long-form blogs with real research and real source links. Source verification, SEO + meta pack, distribution pack (LinkedIn post, Twitter thread, newsletter blurb, cold email pitch, 3 quote graphics built from each blog).

**4. Ad Creatives** — `/services/ad-creatives`. Static creative, video ads, hook variants, landing-page-matched creative. Built for paid social — Meta, LinkedIn, TikTok, YouTube.

**5. Websites & Funnels** — `/services/websites-funnels`. Conversion-focused websites, landing pages, sales funnels. Custom design + build, not a Webflow drag-drop.

**6. Automations** — `/services/automations`. Zapier/Make/n8n flows, CRM wire-ups, lead routing, email sequences, internal ops automations.

**7. Apps & Software** — `/services/apps-software`. Custom web apps, internal tooling, MVPs. Lakshya ships production code in React/Next.js/TypeScript.

---

## 6. Pricing Architecture

EchoPulse has **three pricing models** running in parallel. All prices are USD anchors that auto-localize to the visitor's region.

### 6.1 The Pilot — $299

**14-day paid trial.** This is the front door. Designed so a prospect can taste the studio without committing to a retainer.

What's included:
- Onboarding interview (90 min, recorded)
- 12 social posts
- 3 short-form video edits
- 5 long-form blogs
- 1 strategic deliverable (chosen with you on the call)

Pilot pricing renders the localized cheapest-tier figure in the homepage popup and bottom of pricing — "Pilot starts at ₹9,999" for an India visitor.

### 6.2 Retainers — Monthly

Two retainer tiers for clients who want the studio running their content engine ongoing.

**Growth Retainer — $1,997/mo.** Covers social, blogs, short + long-form video, ad creatives, website optimization, and monthly strategy review.

**Full System — $4,997/mo.** All-in plan: 30 social posts, 8 long-form blogs, full ad engine, podcast editing, course modules, automations, and a quarterly custom website build.

### 6.3 One-Off Orders — `/order` route

For clients who don't want a retainer but need a specific deliverable. Self-serve, no sales call needed. Four service types:

**Reels & Shorts** — Three tiers:
- Essential ($15) — clean cut, captions, background music
- Signature ($80) — adds B-roll, motion graphics, sound design, color grade
- Elite ($100) — heavy motion graphics, animated captions, premium VFX
- Quantity multiplier (up to 4 per order on Essential/Signature, 1 on Elite)
- 48h turnaround

**Long-form YouTube** — Tier × duration matrix. Starts at $49 for 5-min Essential, scales to higher tiers and durations. 3 to 5 day turnaround depending on tier.

**Podcast Editing** — Base ($450) for full episode edit. Optional addons: Episode trailer ($99), Up to 14 short-form clips ($249), or Trailer + 14 clips bundle ($299 — saves $49 vs à la carte).

**Repurpose Existing Content** — $349 fixed price. Turn an existing long-form asset into a 14-piece content pack.

### 6.4 Geo-Localized Pricing

Prices auto-adjust based on visitor region detected via middleware (server-side IP geo lookup, falls back to client timezone if unavailable). The math is region-aware all the way through — what the visitor sees on the tier card equals what the OrderFlow sidebar totals equal what Razorpay/Stripe charges. No FX surprises at checkout.

The curve per region:

**India (IN)** — Piecewise PPP curve, not a flat ×80 multiplier. Low-anchor entry tiers stay aspirational ($15 → ₹1,199), mid/high tiers compress so they land at sales-friendly Indian price points ($80 → ₹2,499, $100 → ₹4,999). Premium services like podcast ($450) land around ₹22,500.

**United Kingdom (UK)** — ×0.78 with 9-ending rounds. $80 → £59, $100 → £79.

**Europe (EU)** — ×0.92, in EUR. ×1.15 multiplier on top for high-PPP countries (CH, NO, DK, LU, IS). Switzerland uses CHF symbol.

**Canada (CA)** — ×1.30 in CA$, with 9-ending rounds.

**United States (US) and OTHER** — Raw USD. Vietnam, SE Asia, LATAM currently fall through to USD with no PPP relief (gap noted in roadmap).

The unit-times-quantity math is computed in **local currency space**, not USD. So 2× Essential Reels for an Indian client = ₹1,199 × 2 = ₹2,398 exactly, never the weird FX-rounded number you'd get from localizing the USD total.

### 6.5 Pune On-Site Shoot Service

A geo-gated offering visible only to Pune (Maharashtra) visitors. Bookable through a dedicated Apple-glass modal that's separate from the main retainer/order flow.

What it is: in-person production day in Pune — listings, agent reels, brand films, podcast video — with Lakshya or a trusted local crew on the ground.

How it differs from online services: phone is required (we call back within 4 work hours), no Razorpay charge at this stage (price is confirmed on the call after scope is set), lead lands in Asana Sales Pipeline → Discovery Call Booked with a `📞 Call …` action-prefix title and pings the dedicated `#pune-onsite` Slack channel.

---

## 7. Operating Infrastructure

The site is wired into a working CRM + comms stack so that every paid action automatically updates the right place.

### 7.1 Asana CRM (10-project system)

Free-tier compatible. Ten projects organized by lifecycle stage:

1. **Clients · Retainer Pipeline** — active retainer clients, statused (Active / Churned / Paused / At-Risk)
2. **Clients · Profile Cards** — one card per client with all their context
3. **Daily Board · Retainer Deliverables** — what's shipping today
4. **⏱ One-Off Orders (48h Clock)** — every Razorpay-paid order lands here with a due_at clock that drives Asana's overdue badge
5. **Leads · Sales Pipeline** — discovery calls, proposals, Pune on-site inquiries
6. **Internal · Team Tasks (assign + deadlines)** — admin work
7. **Templates · Onboarding Playbooks** — reusable
8. **Renewals & Churn Watch** — retainer renewal radar
9. **Knowledge Base · SOPs & Playbooks** — internal docs
10. **Tooling, Subscriptions & Renewals** — vendor management

Auth is via Personal Access Token stored in `.env.local` as `ASANA_TOKEN`. The site's `lib/asana.ts` exposes high-level helpers — `createLead()`, `createOrder()` — that pick the right project, the right section, and the right followers automatically based on the source endpoint.

### 7.2 Slack channels

Webhook-driven notifications, routed by topic:

- `#all-echopulse-media` — firehose: every order, every lead, every event
- `#orders` — paid one-off orders specifically
- `#leads` — new leads from contact forms + Cal.com
- `#pune-onsite` — Pune on-site shoot inquiries (separate workflow)
- `#wins` — closed-won announcements
- `#renewals` — retainer renewal radar
- `#urgent` — manual escalation channel
- `#ops` — internal ops + errors

Each webhook URL lives in `.env.local` under a `SLACK_WEBHOOK_*` env var. The router in `lib/slack.ts` falls back to the firehose if a topic channel isn't configured.

### 7.3 Payments — Razorpay (India)

Razorpay handles all paid charges. Test mode currently in setup phase. Production live mode requires Indian business KYC (PAN, Aadhaar, bank account, registered address proof, optional GSTIN).

Test card: `4111 1111 1111 1111` / CVV `123` / Expiry `12/26`.

Razorpay is INR-only, which is fine for India clients and acceptable for international clients paying via international card. International expansion to Stripe/Paddle is on the roadmap for currency-native charging.

### 7.4 Email confirmations

Stub currently logs intended sends. Production wire-up pending — will use Resend or Postmark. Templates already exist for: order confirmation, Pune inquiry confirmation, onboarding kickoff.

---

## 8. The Site

Built on **Next.js 16.2.4** (App Router + Turbopack) with React 19 and TypeScript. Smooth scroll via Lenis. Motion via Framer Motion + GSAP for the hero sequence. Tailwind for layout. Custom inline SVGs replace icon libraries for fast first paint.

Key routes:

- `/` — Homepage (hero, services, OurWork showcase, Manifesto, Process, Pricing, Testimonials/Founder, CTABanner, FAQ, Footer)
- `/services/[slug]` — 7 service detail pages
- `/order` — Self-serve one-off order flow with 4 steps (pick service → configure → details → review + Razorpay checkout)
- `/onboard` — Post-purchase onboarding brief (asks for assets, brand voice, deadlines, contacts)
- `/pricing-matrix` — Admin reference showing every region's localized price for every tier
- `/blog/[slug]` — Blog posts
- `/terms` — Terms of Service
- `/api/*` — Razorpay order/verify, Pune inquiry, lead capture, Cal.com webhook, onboarding, CRM test

Mobile is treated as the primary canvas — every section is tightened so the viewer never has to scroll a lot within one section. iOS-style pricing card with tier picker on mobile.

---

## 9. Brand Identity

**Primary color** — `#E8541A` (orange). Used for accents, CTAs, the brand "echo" word in the logo, headline accents.

**Background** — `#F2EEE7` (warm cream) on light surfaces. `#0C0C0B` (near-black) on dark surfaces.

**Foreground text** — `#0C0C0B` on light, `#F2EEE7` on dark. `#6E6B63` for muted/subhead text.

**Typography** — Inter (font weights 400, 500, 600, 700, 800, 900). Display:swap for fast first paint.

**Logo** — Three orange horizontal bars on dark rounded square. Bars echo the "pulse" idea (sound wave / rhythm) and form a stylized "E" letterform.

**Voice rules** — direct, confident, taste-led. No corporate hedging. No emoji except where they're functional (icon labels). No "let's hop on a call" — say "book a call." No "synergy," no "leverage," no "circle back." Numbers and specifics over adjectives.

---

## 10. Roadmap

**Phase 1 — Test mode payments working end-to-end** (current). Fresh Razorpay test keys from friend → restart dev server → run full payment sweep (Reels, Long-form, Podcast, Repurpose) → verify Asana + Slack pipeline fires on each.

**Phase 2 — Production payments live.** Complete Razorpay KYC (1-5 business days), grab live keys, deploy to Vercel with production env vars, set up webhook endpoint at `/api/razorpay/webhook` for `payment.captured` + `order.paid` events.

**Phase 3 — International payments.** Add Stripe (or Paddle) for currency-native charging in UK/EU/CA/US. Razorpay stays for India.

**Phase 4 — Vietnam + SE Asia PPP.** Add a "low-PPP belt" pricing curve for VN, ID, PH, TH, BD, PK, EG, BR, MX so they're not stuck seeing raw USD anchors.

**Phase 5 — Email + WhatsApp wire-up.** Replace the email stub with Resend/Postmark. Add WhatsApp Business API for the Pune flow (currently relies on manual outreach within 4h).

**Phase 6 — Asana team scale-up.** Invite Shaurya + Aiman as workspace members. Set `ASANA_PUNE_TEAM_FOLLOWERS` so all three of us get auto-tagged on Pune inquiries.

---

*Last updated: June 1, 2026. Author: Lakshya Soni + Claude.*
