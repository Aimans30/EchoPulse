# EchoPulse — Asana CRM Architecture

Complete operating system in Asana. Built around three realities of your business:

1. **Retainer clients** (recurring revenue, monthly deliverables, can churn)
2. **One-off orders** (deadline-sensitive, 48-hour SLAs, never repeat)
3. **A small operator team** (you + Shaurya + Aiman) that needs visibility, not bureaucracy

10 projects, ~25 custom fields, ~15 automation rules. Setup time: ~3 hours. Pays you back in the first month.

---

## Project structure — at a glance

| # | Project name | View | Purpose |
|---|---|---|---|
| 1 | **Clients — Retainer Pipeline** | Board (Kanban) | Where every retainer client lives across their lifecycle |
| 2 | **Clients — Profile Cards** | List | One task per client = their full profile + history |
| 3 | **Daily Board — Retainer Deliverables** | Board | What we ship to each retainer client every day |
| 4 | **Orders — One-off Pipeline** | Board | Site orders with 48h timers, separate from retainers |
| 5 | **Sales — Leads & Prospects** | Board | Top of funnel — before they become a client |
| 6 | **Content Calendar — Publishing** | Calendar | All client posts/videos by date for visibility |
| 7 | **Renewals & Churn Risk** | List | Early warning + renewal pipeline |
| 8 | **Team — Capacity & Workload** | List | Who's loaded, who has bandwidth |
| 9 | **Knowledge Base — Playbooks & SOPs** | List | Reusable processes per service |
| 10 | **Assets — Brand & Raw** | List | Per-client asset registry (logins, brand kits, footage) |

---

## 1. Clients — Retainer Pipeline (Kanban Board)

**Sections (columns) =** lifecycle stages a retainer client moves through.

| Section | Definition |
|---|---|
| **🟡 Onboarding — Brief Pending** | Signed up, payment captured, waiting for the 90-min onboarding call to happen |
| **🟡 Onboarding — Brief Complete** | Call done, brand brief written, waiting to ship first deliverable |
| **🟢 Active — Month 1** | First month of work shipping. Watch retention closely |
| **🟢 Active — Stable (M2+)** | Settled into the rhythm. Predictable cadence |
| **🟠 Renewal Window (30d out)** | Auto-moves here 30 days before subscription renews |
| **🔴 At-Risk** | Manual flag — missed replies, revision spikes, contract questions |
| **⚫ Paused** | Client paused service for X reason; resume date noted |
| **⚫ Cancelled — This Month** | Cancelled within last 30 days; opportunity to win back |
| **⚪ Churned (Archive)** | Cancelled >30 days ago. Reference only |

**Custom fields on each card:**
- **Plan** (Pilot / Growth / Full System) — single select
- **Start date** — date
- **Next renewal** — date (auto-feeds the 30d-out trigger)
- **MRR** — currency
- **Owner** (Lakshya / Shaurya / Aiman) — single select
- **Last shipped** — date (auto-updated when a deliverable in project 3 is marked done)
- **Reply latency** — number (avg hours, populated by automation)
- **Health score** — single select (Green / Yellow / Red) — based on the above

**Automation rules:**
- When card moves to "Onboarding — Brief Complete" → create 5 tasks in project 3 for week 1
- When "Next renewal" is within 30 days → move card to "Renewal Window"
- When "Last shipped" > 7 days ago AND status = Active → set Health Score = Yellow
- When card moves to "Cancelled" → create a follow-up task 14 days out: "Win-back check-in"

---

## 2. Clients — Profile Cards (List View)

**One task per client. The card IS their profile.**

Custom fields:
- **Email**, **Phone**, **WhatsApp**, **LinkedIn URL**
- **Company / Brand**, **Niche / Industry**
- **Time zone**, **Preferred channel** (Slack / WhatsApp / Email)
- **Plan**, **Start date**, **Next renewal**, **MRR**
- **Owner**, **Notion / Drive folder URL**
- **First touch source** (Website / Referral / LinkedIn / Inbound DM)
- **Tags** — multi-select for special context (Pune local, US East Coast, etc.)

**Card body (description) sections** — template:
```
## Onboarding Snapshot
[bullet points from the 90-min call]

## Brand Brief
[link to brief doc]

## Their Voice / Style
[notes on how they talk, edits they don't like, brands they admire]

## What's Working
[winning content types, engagement patterns]

## What's NOT Working
[things to avoid, past misses]

## Goals (Q1 / Q2 / Q3 / Q4)
[quarterly goals they shared]
```

**Subtasks** = meeting transcripts, one subtask per call:
- 2026-01-15 — Onboarding Interview (link to recording, transcript pasted)
- 2026-01-30 — Strategy Review (notes)
- 2026-02-28 — Monthly Check-in (notes)

**Comments** = ongoing notes about decisions, preferences, ideas.

This becomes your single source of truth for "who is this client and what do they want."

---

## 3. Daily Board — Retainer Deliverables (Board View)

**The daily-execution layer.** What needs to ship today, for whom.

**Sections:**
- **📥 Backlog — This Week** (planned but not started)
- **✏️ In Production** (someone's actively building it)
- **👀 Internal Review** (Lakshya / Shaurya quality-check before client sees it)
- **📨 Sent to Client** (waiting on approval / revisions)
- **🔁 In Revision** (client asked for changes)
- **✅ Shipped & Approved** (closed, archive after 7 days)

**Custom fields on every deliverable card:**
- **Client** (single-select linked to project 1)
- **Service type** (Short-form video / LinkedIn post / Blog / Ad creative / Long-form / Website page / Automation)
- **Owner** (Lakshya / Shaurya / Aiman)
- **Due date** + **time**
- **Revision round** (number, default 0, increment on each "In Revision" move)
- **Hours spent** (number — track for profitability)

**Recurring tasks** — set up templates so the same monthly deliverables auto-generate:
- "Growth Retainer — 5 short-form videos per week" → 5 cards generated every Monday
- "Full System — 8 blogs per month" → 2 cards generated every Monday
- Each auto-created card already has the right client, owner, due date

**Automation rules:**
- When card moves to "Shipped & Approved" → write back to project 1's "Last shipped" field
- When card sits in "In Revision" → 24h reminder for owner
- When revision round hits 3+ → notify Lakshya (could mean brief was wrong)

---

## 4. Orders — One-off Pipeline (Board View)

**Separate universe from retainers.** Site-form orders with hard 48-hour SLAs.

**Sections:**
- **🆕 New Order — Payment Received**
- **⏱️ Brief Confirmed (Timer Started)**
- **✏️ In Production**
- **👀 Internal QC**
- **📨 Delivered**
- **🔁 In Revision**
- **✅ Closed**
- **❌ Refunded / Cancelled**

**Custom fields:**
- **Order ID** (from the website's order system)
- **Service** (Reels / Long-form / Podcast / Repurpose)
- **Tier** (Lite / Signature / Elite)
- **Client name + email + phone** (from the form)
- **Order value** (currency)
- **48-hour deadline** (date + time — auto-set when "Timer Started")
- **Time remaining** (number — automation updates every hour)
- **Owner**
- **Drive link to footage** (from form's Google Drive field)
- **Has phone?** (yes/no — affects how we reach them on blockers)

**Automation rules — CRITICAL:**
- When order arrives via API → card auto-created in "New Order" with all fields populated
- When "Timer Started" → 48-hour deadline auto-set
- **At 24h remaining** → Slack ping to owner
- **At 12h remaining** → Slack ping to owner + Lakshya
- **At 4h remaining** → URGENT Slack ping to entire team
- **Past deadline** → card turns red, escalation to Lakshya
- When delivered → freeze the timer

This is your SLA enforcement. Nothing slips.

---

## 5. Sales — Leads & Prospects (Board View) — THINGS YOU DIDN'T ASK FOR

**Top of funnel BEFORE they become a client.** Critical for predictable revenue.

**Sections:**
- **❄️ Cold (Outreach Sent)**
- **🌡️ Warm (Replied / Engaged)**
- **🔥 Hot (Meeting Booked)**
- **📋 Proposal Sent**
- **🤝 Negotiating**
- **✅ Won → New Client** (auto-creates retainer pipeline card)
- **❌ Lost — Won't Reopen**
- **🔄 Lost — Reopen in 90d**

**Custom fields:**
- **Source** (LinkedIn / Cold email / Referral / Inbound form / Pune local)
- **First touch date**
- **Last touch date**
- **Estimated deal size**
- **Probability** (10% / 30% / 60% / 90%)
- **Weighted value** = deal size × probability (auto-formula)
- **Owner**
- **Next action** (text) + **Next action date** (date)

**Pipeline visibility:** sum of weighted value across all sections = your forecast.

---

## 6. Content Calendar — Publishing (Calendar View) — THINGS YOU DIDN'T ASK FOR

**Visual calendar of every post going out, for every client.**

Each task = one piece of content, scheduled by publish date.

- Filter by client → see one client's month at a glance
- Filter by service type → see all video this week vs all blogs
- Filter by owner → see Aiman's week

**Custom fields:**
- **Client** | **Service type** | **Channel** (Instagram / LinkedIn / YouTube / Blog) | **Status** (Drafted / Scheduled / Published / Promoted)
- **Topic / Hook**
- **Performance metrics** (impressions, engagement, conversions — filled in after publish)

This becomes your editorial brain. When you're in a planning call, you pull this up.

---

## 7. Renewals & Churn Risk (List View) — THINGS YOU DIDN'T ASK FOR

**Two purposes:**
1. **Renewals** — who's up for renewal in the next 30 / 60 / 90 days
2. **Churn signals** — clients showing early warning signs

**Custom fields:**
- **Renewal date** | **MRR** | **Tenure (months)**
- **Last reply (days ago)** | **Last revision round** | **Revisions this month**
- **Renewal status** (Confirmed / At-risk / Negotiating / Cancelled)
- **Churn signal** (Low replies / Frequent revisions / Reduced scope / Quiet)
- **Save action** (text — what you're going to do about it)

Pre-built filtered views:
- "Up for renewal in 30 days" → call them
- "At-risk this month" → personal Lakshya intervention
- "MRR > ₹50K and renewal in 60d" → priority list

---

## 8. Team — Capacity & Workload (List View)

**Live snapshot of who's loaded.**

Tasks = team members (3 tasks: Lakshya / Shaurya / Aiman).

**Custom fields (auto-calculated via formulas):**
- **Open deliverables** (count of cards assigned in projects 3 + 4)
- **Due this week** (count due within 7 days)
- **Overdue** (count past due)
- **Hours this week** (sum of "Hours spent" field across their tasks)
- **Capacity status** (Green <40h / Yellow 40-50h / Red >50h)

When you're about to take on a new client, glance here to know who has room.

---

## 9. Knowledge Base — Playbooks & SOPs (List View) — THINGS YOU DIDN'T ASK FOR

**Reusable processes so you stop reinventing the wheel.**

Per-service playbooks (one task each):
- "How to onboard a Video Editing retainer"
- "How to brief a podcast clip edit"
- "How to handle a revision round professionally"
- "How to fire a client gracefully"
- "How to ask for a testimonial in month 6"
- "How to upsell from Pilot to Growth"

Each playbook = step-by-step checklist. New team members can self-serve.

---

## 10. Assets — Brand & Raw (List View) — THINGS YOU DIDN'T ASK FOR

**Centralized asset registry per client.**

One task per client. Custom fields:
- **Logo file** (attachment)
- **Brand colors** (text — hex codes)
- **Brand fonts** (text)
- **Tone / Voice doc** (link)
- **Drive folder — Raw footage** (link)
- **Drive folder — Final deliverables** (link)
- **Login credentials vault** (link to 1Password / Bitwarden — NEVER paste here)
- **Logo usage rules** (description)

Stop hunting through email for the logo. It's here.

---

## Custom fields used across multiple projects — set up GLOBALLY

Asana lets you create custom fields at the workspace level and reuse them across projects. Set these up once:

| Field | Type | Used in |
|---|---|---|
| Client | Single-select (linked to client list) | 3, 4, 6, 7, 10 |
| Plan | Single-select (Pilot / Growth / Full / One-off) | 1, 2, 7 |
| Service type | Single-select | 3, 4, 6, 9 |
| Owner | Single-select (Lakshya / Shaurya / Aiman) | every project |
| Health score | Single-select (Green / Yellow / Red) | 1, 7 |
| MRR | Currency | 1, 2, 7 |
| Deal size | Currency | 5 |
| Hours spent | Number | 3, 4 |
| Revision round | Number | 3, 4 |
| Source | Single-select | 2, 5 |

---

## Forms — let prospects come into Asana directly

Asana Forms can replace ad-hoc lead capture. Build:

**Form 1 — "Talk to us"** (linked from website)
- Name, email, phone (optional), company, what they need help with, deal size estimate
- Submission → auto-creates a card in project 5 (Sales) under "Hot (Meeting Booked)"

**Form 2 — Internal "Add a client"**
- Use after a verbal yes — captures retainer details into project 1 + 2 in one go

**Form 3 — "Revision request"** (for clients to fill out)
- Client name, deliverable, what to change, urgency
- Submission → auto-creates a card in project 3 under "In Revision"

---

## Automations / Rules — the magic layer

Asana's Rules tab lets you wire all this together. Top 10 rules to set up:

1. **Order arrives via website** → create card in project 4, set 48h timer
2. **Onboarding card moves to "Brief Complete"** → generate first week's deliverables in project 3
3. **Deliverable shipped** → update last-shipped date in project 1
4. **Renewal date <30 days** → move client card to "Renewal Window"
5. **Last shipped >7 days ago** → flag health score Yellow
6. **Order timer at 24h remaining** → Slack ping to owner
7. **Card sits in "In Revision" for >24h** → Slack ping to owner
8. **Sales card moves to "Won"** → auto-create matching cards in projects 1 + 2 + 10
9. **Client cancelled** → schedule a "Win-back check-in" task 14 days out
10. **Monthly recurring** → auto-generate next month's deliverables for every active retainer

---

## Slack integration — see the right thing at the right time

Asana has a native Slack integration. Set up these notifications:

- `#alerts` channel — order timer warnings (24h, 12h, 4h)
- `#client-wins` channel — every "Won" deal posts here
- `#daily-shipping` channel — every "Shipped & Approved" deliverable posts here
- `#renewals` channel — every renewal-window entry
- `#churn-risk` channel — every Yellow/Red health score change

You'll know what matters without opening Asana.

---

## Setup order — the fastest path to live

**Day 1 (90 min):**
1. Create the 10 projects (empty)
2. Create the global custom fields
3. Create your 3 team members in Asana
4. Set up the Slack integration with the 5 channels above

**Day 2 (90 min):**
5. Build project 1 sections + create profile cards (project 2) for your current clients
6. Migrate active retainer deliverables into project 3
7. Build project 4 sections + the order-form intake

**Week 1:**
8. Build the recurring monthly deliverable templates
9. Wire the top 10 automation rules
10. Build the 3 Asana Forms

**Week 2:**
11. Build project 5 (Sales pipeline) — migrate any current leads
12. Build project 9 (Knowledge base) — write the first 5 playbooks
13. Build project 10 (Assets registry)

By end of week 2 you have a real CRM running.

---

## Additional ideas worth thinking about (longer term)

1. **Referral tracker** — note in profile cards which client referred which. Reward both.
2. **Testimonial pipeline** — auto-flag clients at month 6 to ask for testimonial.
3. **Case study queue** — clients with measurable wins → case study pipeline → site/social.
4. **Profitability scorecard** — hours spent / revenue per client. Identify low-margin clients you should reprice or fire.
5. **Quarterly business review (QBR)** template — for retainer clients, structured 30-min review every quarter.
6. **Upsell trigger board** — "Video client doesn't have LinkedIn" → opportunity card.
7. **Vendor / contractor tracker** — if you ever bring in a contract editor, track them here.
8. **Equipment / tooling subscription tracker** — Adobe / Cloudinary / Cal.com / Razorpay renewal dates so you don't get caught off-guard.

---

## What I'll wire up on the site once your Asana is live

Once you share `ASANA_TOKEN` + the GIDs for projects 1, 2, 4, 5 in `.env.local`, I'll build:

- `app/api/lead/route.ts` — every Cal.com booking + form submission → creates a card in project 5 (Sales) with all the form data prefilled
- `app/api/order/route.ts` — every checkout completion → creates a card in project 4 (Orders) with payment confirmed, 48h timer started
- `app/api/onboarding/route.ts` — when you mark a deal "Won" in Asana → triggers welcome email + adds card to projects 1 + 2
- Each automation also pings the relevant Slack channel

Tell me when you have the project GIDs and `ASANA_TOKEN`, and I'll wire it. Until then this doc is your build guide.
