# EchoPulse — Asana CRM, More Ideas

Companion to **ASANA-CRM-SETUP.md**. This adds the three things you specifically asked for + a wide net of "stuff a real agency CRM should have."

---

## 1. Project 11 — Internal Tasks & Admin (Board)

**The "everything else" board.** Anything that's not a client deliverable but still has to ship.

**Sections:**
- **📋 Inbox** — anything you or anyone drops in for triage
- **📌 This Week** — committed to do this week
- **🚧 In Progress** — actively being worked on
- **⏸️ Waiting On** — blocked on someone else
- **✅ Done This Week** — archive after 7 days
- **🗑️ Won't Do** — explicitly killed; better than letting things rot

**Custom fields:**
- **Owner** (Lakshya / Shaurya / Aiman) — required
- **Priority** (P0 urgent / P1 important / P2 nice-to-have)
- **Due date** + **time**
- **Effort** (15 min / 1 hr / Half day / Full day) — single-select
- **Category** (Sales ops / Tooling / Hiring / Finance / Marketing / Personal admin / Misc)
- **Linked client** (optional — if it's a one-off about a client)
- **Linked project** (optional — if part of a bigger initiative)

**Examples that live here:**
- "Renew Cloudinary subscription before May 30"
- "Write founder LinkedIn post about new pricing"
- "Sign contract with new freelance editor"
- "Reorder team-name brand templates"
- "Q1 financial reconciliation"
- "Set up Razorpay sandbox account"

**Critical Asana feature for this:** the **"My Tasks"** view. Every team member sees their assigned tasks across ALL projects in one personal inbox. You assign a task here, Aiman sees it in her My Tasks. No emails.

**Automation:**
- When you create a P0 task → Slack DM to the owner
- When due date is tomorrow and not yet "In Progress" → Slack DM reminder
- When overdue → escalate to Lakshya

---

## 2. Project 5 (Sales) — Deepened into a real lead-tracking system

You already have project 5 from the original doc. Make it 3x better with these additions.

### Custom fields to ADD (on top of what's there):

| Field | Type | Use |
|---|---|---|
| **Lead score** | Number 1-100 | Auto-calculated from the criteria below |
| **Qualification stage** | Single-select (Unknown / Cold / Warm / Hot / Qualified / Disqualified) | Where they are in your funnel |
| **Budget confirmed** | Yes / No / Unknown | Do they have money to spend |
| **Decision-maker** | Yes / No / Influencer | Are we talking to the right person |
| **Timeline** | Single-select (Now / 30 days / 60-90 days / Someday / No timeline) | When they'd start |
| **Pain identified** | Yes / No | Do they know they have a problem |
| **Source detail** | Text | "LinkedIn DM after seeing my reel about real estate" |
| **Source ROI** | Single-select (High / Medium / Low / TBD) | Track which sources convert |
| **Industry** | Single-select | Real estate / SaaS / Coaching / E-comm / Other |
| **Company size** | Single-select | Solo / 2-10 / 11-50 / 50+ |
| **Last contact** | Date | Auto-updates when you log an activity |
| **Next follow-up** | Date | When you owe them an action |
| **Sequence stage** | Single-select | Where they are in your outreach cadence |
| **Disqualified reason** | Single-select (No budget / Bad fit / Timing / Ghosted / Competitor / Other) | For lost-deal analysis |

### Lead Score formula (suggested):
```
+20 if Budget confirmed = Yes
+20 if Decision-maker = Yes
+15 if Timeline = Now or 30 days
+15 if Pain identified = Yes
+10 if Industry in your ICP (real estate, SaaS, coaching)
+10 if Company size in your sweet spot (2-50)
+10 if Source = Referral or Inbound form
```

Anyone scoring **70+** = drop everything and chase. **40-70** = nurture. **<40** = back-burner.

### Activity Log per lead

Use **subtasks** as activity entries. One subtask per touchpoint:

```
2026-04-12 — Cold DM sent on LinkedIn (template: real-estate-v3)
2026-04-15 — Replied, asked for pricing
2026-04-16 — Sent pricing doc + Loom (link)
2026-04-19 — Booked discovery call for 4/22 at 3pm IST
2026-04-22 — Discovery call done — notes in description, deal size ₹40K/mo
2026-04-23 — Sent proposal
2026-04-26 — Follow-up: not heard back
2026-05-01 — Won. Moved to Clients.
```

Every interaction logged → you never wonder "did I follow up?" → you have data to refine your outreach.

### Lost-deal analysis

Once a month, filter project 5 → "Lost" sections → group by "Disqualified reason":
- 6 lost to "No budget" → pricing might be wrong for that segment
- 4 lost to "Ghosted" → your follow-up cadence might be too aggressive (or not aggressive enough)
- 3 lost to "Competitor" → who? Why?

This is how you sharpen sales.

### Source ROI

End of each quarter, count won vs lost per source. The losers go. The winners get more budget.

Example output:
- LinkedIn DMs → 24 leads, 4 won, ₹160K ARR — strong
- Cold email → 60 leads, 1 won, ₹24K ARR — weak, kill it
- Referrals → 8 leads, 5 won, ₹400K ARR — double down, build a referral program

---

## 3. NEW Project 12 — Sales Activity Tracker (List + Calendar)

**Lighter than project 5 — this is the "what am I doing today on sales" view.**

Tasks here = next sales actions for each lead. One actionable item per task.

**Sections:**
- **🔥 Today**
- **🟡 Tomorrow**
- **📅 This Week**
- **🗓️ Next Week**
- **❄️ Pending — Action TBD**

**Custom fields:**
- **Lead** (linked to a card in project 5)
- **Action type** (Cold DM / Follow-up / Discovery call / Proposal send / Negotiation call / Contract send)
- **Channel** (LinkedIn / WhatsApp / Email / Call / Video / In-person)
- **Owner**
- **Done** (checkbox)
- **Outcome** (text — pasted in after action is taken)

Set up a **calendar view** filtered to this project. You see every sales action by date at a glance — no double-booking, no missed follow-ups.

**Automation:** When marked Done → auto-create a subtask in the related lead's project 5 card with the outcome ("2026-04-22 — discovery call done, ₹40K deal").

---

## 4. NEW Project 13 — Onboarding Checklists (Template + Tasks)

**Different services need different onboarding.** Don't try to cram all of it into the retainer pipeline cards.

For each service, create a **task template**:

### Video Editing onboarding (10 subtasks):
1. ☐ Send welcome email + onboarding form
2. ☐ Schedule 90-min onboarding call
3. ☐ Run onboarding call (covers: audience, voice, brand brief, examples they love)
4. ☐ Get Drive folder access (raw footage + finals)
5. ☐ Pull 3 reference edits from their channel + 3 they admire
6. ☐ Write brand brief doc — share with team
7. ☐ Identify hook style + pacing preference
8. ☐ Ship first edit within 48h of call
9. ☐ Internal review before client sees it
10. ☐ Send first edit + ask for feedback signal

### LinkedIn onboarding (different list)
### Blog onboarding (different list)
### Etc.

When a new client comes in via project 1, copy the right template. Every onboarding hits the same quality bar. New team members can run onboarding without you babysitting.

---

## 5. NEW Project 14 — Quarterly Business Reviews (Recurring)

**Every retainer client gets a 30-min QBR every 90 days.**

This is what separates a vendor from a partner.

One recurring task per client, fires every 90 days. Subtasks:

1. ☐ Pull engagement metrics for the quarter
2. ☐ Pull conversion data (if measurable)
3. ☐ Identify 2 wins + 1 miss
4. ☐ Identify Q+1 goals
5. ☐ Schedule the 30-min call
6. ☐ Run the call
7. ☐ Send summary doc within 24h of call
8. ☐ Update their profile card (project 2) with new goals
9. ☐ Update health score

**Result:** clients feel cared for. You spot churn signals 60 days early. You upsell organically.

---

## 6. NEW Project 15 — Testimonial / Case Study Pipeline

**Social proof is your cheapest lead source. Manage it like a pipeline.**

**Sections:**
- **🌱 Possible** — clients who could provide one (default for anyone past month 3)
- **🙏 Asked** — request sent, waiting
- **✍️ Drafted** — they sent something, you're polishing
- **✅ Live** — published on site / LinkedIn / case study page
- **📊 With Metrics** — has numbers (best kind)

**Per task (one per client):**
- **Type** (Text quote / Video testimonial / Full case study / Logo only)
- **Permission to use** (Yes / Yes with edits / No)
- **Where used** (homepage / service page / sales doc / LinkedIn post)
- **Asked-by** (date)
- **Delivered-by** (date)

**Rule:** at month 6 of any retainer, auto-create a task here "Ask CLIENT for testimonial." You'll never miss the right moment.

---

## 7. NEW Project 16 — Hire / Contractor Pipeline

If you ever bring in a contract editor, copywriter, or VA — track them.

**Sections:** Sourcing → Trial Project → Hired → Active → Off-boarded

**Custom fields:** Role, Rate, Currency, Time zone, Skills, Trial outcome, Reliability score.

When you're slammed and need a freelancer, you have a roster instead of starting from scratch.

---

## 8. NEW Project 17 — Subscription / Tooling Renewals

**Stops you from getting blindsided by auto-charges.**

One task per tool. Fields:

- **Tool name** (Adobe Creative Cloud / Cloudinary / Cal.com / Razorpay / Stripe / Vercel / Sanity / Domain / etc.)
- **Annual cost**
- **Renews on** (date)
- **Card on file** (last 4 digits, no full number)
- **Critical?** (Yes / No — what breaks if it lapses)
- **Alternative if cancelled** (text)

Set Asana to remind you 14 days before each renewal. Decide once a year if it's still worth it.

---

## 9. Bigger ideas — for when you're past 20 clients

- **OKR / Goals project** — set quarterly OKRs (revenue, new clients, NPS) and track tasks against them
- **Win-back automation board** — every cancelled client gets a structured 6-month follow-up cadence
- **Partnership / Affiliate tracker** — who sends you leads, who you send leads to
- **Equipment / Asset tracker** — physical gear (cameras, lights) per team member
- **Compliance / Legal tracker** — NDAs signed, GDPR docs, terms updated
- **Content repurposing pipeline** — "this case study → 4 LinkedIn posts → 2 reels → 1 blog"
- **Internal "show and tell" wins board** — every week share a great deliverable in `#daily-shipping` Slack channel + tag it for portfolio

---

## How to use this for personal task management (Lakshya specifically)

You need a way to see ONLY what matters to you, across all 15+ projects.

**Asana's "My Tasks" view** is your daily dashboard:
- **Today** — what's due today, across every project
- **Upcoming** — next 7 days
- **Later** — everything else assigned to you

**Custom rule:** assign yourself as a collaborator on every Lakshya-relevant client card in projects 1, 2, 5, 7 — you'll see all client activity flow into "My Tasks → Recent."

**Daily routine (5 minutes):**
1. Open My Tasks → Today
2. Glance at project 4 → any timer at <12h?
3. Glance at project 1 → any "At-risk" or "Renewal Window"?
4. Glance at project 5 → any "Hot" lead I owe an action?
5. Anything left? Triage to a date.

That's your daily standup, solo.

---

## What you'd implement in Asana FIRST if you want to ship in 1 hour

If 90 min of setup feels heavy, here's the MVP order:

1. **Project 11 (Internal Tasks)** — needs zero custom fields. Just start dropping tasks. 5 min.
2. **Project 5 (Sales) with the basic 4 fields** — Source, Stage, Owner, Next action date. 10 min.
3. **Project 4 (Orders)** — even just manual cards with a Due date for now. Wire automation later. 10 min.
4. **Project 1 (Retainer Pipeline)** — 8 sections, drag your current clients into them. 15 min.
5. **My Tasks routine** — assign yourself as collaborator everywhere. 5 min.

That's 45 min to a working baseline. Build the rest as you go.

---

## What I'll wire on the website to feed all this

Once you have Asana set up, give me:
- `ASANA_TOKEN` (personal access token)
- `ASANA_RETAINER_PROJECT_GID` (project 1)
- `ASANA_PROFILE_PROJECT_GID` (project 2)
- `ASANA_ORDER_PROJECT_GID` (project 4)
- `ASANA_SALES_PROJECT_GID` (project 5)
- `ASANA_INTERNAL_PROJECT_GID` (project 11)

And I'll build:
1. **Cal.com booking webhook** → creates card in project 5, section "Hot (Meeting Booked)", auto-populates lead details from Cal.com payload
2. **OrderFlow submit** → creates card in project 4, starts 48h timer, attaches Drive link
3. **Contact form (future)** → creates card in project 5, section "Warm"
4. **Razorpay/Stripe webhook on payment success** → adds card to project 1 + project 2 + sends welcome email
5. **Subscription cancellation webhook** → moves project 1 card to "Cancelled — This Month"
6. **Slack** — every above event also pings the right channel

Tell me when you're ready with the tokens.
