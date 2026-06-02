# Asana setup prompt — paste into Claude (browser extension)

Open Asana in a tab, make sure Claude in Chrome has access to the tab, then paste the entire block below.

---

## The prompt

You have full access to my Asana workspace via the browser tab. Build out my entire CRM operating system. I'm running EchoPulse — a content + marketing studio. Three operators: me (Lakshya Soni — founder, primary owner), Shaurya (design), Aiman (delivery). Treat me as the workspace admin.

**Build everything below in this exact order. After each project is created, summarize what you did, ask me to verify it visually, then continue.**

### Workspace setup

1. Confirm you're in the correct workspace. If multiple, ask me which one.
2. Make sure all three team members are added with Member access: Lakshya Soni, Shaurya (ask me for last name + email), Aiman (ask me for last name + email).
3. Create a Team called **"EchoPulse Studio"** — all 10 projects below go under this team.

### Global custom fields (do these BEFORE creating projects)

Create the following workspace-level custom fields so they can be reused. Each one's type is in parentheses. Set the dropdown values exactly as listed.

1. **Client** (single-select) — leave options empty for now, I'll fill from project 2
2. **Plan** (single-select) — Pilot, Growth, Full System, One-off, Pune Local
3. **Service type** (single-select) — Short-form video, LinkedIn post, Blog, Ad creative, Long-form video, Website page, Automation, Podcast
4. **Owner** (single-select) — Lakshya, Shaurya, Aiman
5. **Health score** (single-select) — Green, Yellow, Red
6. **MRR** (currency, INR default)
7. **Deal size** (currency, INR default)
8. **Hours spent** (number, integer)
9. **Revision round** (number, integer)
10. **Source** (single-select) — Website form, Cal.com booking, LinkedIn DM, Cold email, Referral, Inbound DM, Pune local
11. **Priority** (single-select) — P0 Urgent, P1 Important, P2 Nice-to-have
12. **Lead score** (number)
13. **Qualification stage** (single-select) — Unknown, Cold, Warm, Hot, Qualified, Disqualified
14. **Timeline** (single-select) — Now, 30 days, 60-90 days, Someday, No timeline

---

### PROJECT 1 — "Clients — Retainer Pipeline"

**View:** Board (Kanban). **Privacy:** Members. **Icon:** 🟢

**Sections (in order):**
- 🟡 Onboarding — Brief Pending
- 🟡 Onboarding — Brief Complete
- 🟢 Active — Month 1
- 🟢 Active — Stable (M2+)
- 🟠 Renewal Window (30d out)
- 🔴 At-Risk
- ⚫ Paused
- ⚫ Cancelled — This Month
- ⚪ Churned (Archive)

**Custom fields to add to this project:**
- Client, Plan, Owner, MRR, Health score
- Plus new project-specific fields: **Start date** (date), **Next renewal** (date), **Last shipped** (date), **Reply latency hrs** (number)

After creating, add 3 placeholder cards in different sections so I can see the structure live. Use names like "Sample Client A", "Sample Client B" etc.

---

### PROJECT 2 — "Clients — Profile Cards"

**View:** List. **Privacy:** Members. **Icon:** 👤

**Sections:**
- Active
- Paused
- Cancelled
- Archive

**Custom fields:**
- Client, Plan, Owner, MRR
- Plus: **Email** (text), **Phone** (text), **WhatsApp** (text), **LinkedIn URL** (text), **Company / Brand** (text), **Niche** (text), **Time zone** (text), **Preferred channel** (single-select: Slack / WhatsApp / Email / Phone), **First touch source** (Source field), **Drive folder URL** (text), **Notion folder URL** (text), **Start date** (date), **Next renewal** (date)

For each client card created here, add this **description template**:

```
## Onboarding Snapshot
- 

## Brand Brief
[link to brief doc]

## Their Voice / Style
- 

## What's Working
- 

## What's NOT Working
- 

## Goals — Q1
- 

## Goals — Q2
- 
```

Create the description as a TEMPLATE that any new task in this project inherits. If Asana doesn't support per-project description templates, save it as a task description in a hidden task called "TEMPLATE — do not edit" pinned at the top of the Archive section.

---

### PROJECT 3 — "Daily Board — Retainer Deliverables"

**View:** Board. **Privacy:** Members. **Icon:** ✏️

**Sections:**
- 📥 Backlog — This Week
- ✏️ In Production
- 👀 Internal Review
- 📨 Sent to Client
- 🔁 In Revision
- ✅ Shipped & Approved

**Custom fields:**
- Client, Service type, Owner, Revision round, Hours spent
- Plus: **Channel** (single-select: Instagram / LinkedIn / YouTube / TikTok / Blog / Email)

Set up a **default sort by Due date ascending**.

---

### PROJECT 4 — "Orders — One-off Pipeline"

**View:** Board. **Privacy:** Members. **Icon:** ⏱️

**Sections:**
- 🆕 New Order — Payment Received
- ⏱️ Brief Confirmed (Timer Started)
- ✏️ In Production
- 👀 Internal QC
- 📨 Delivered
- 🔁 In Revision
- ✅ Closed
- ❌ Refunded / Cancelled

**Custom fields:**
- Owner, Service type, Revision round, Hours spent
- Plus: **Order ID** (text), **Tier** (single-select: Lite / Signature / Elite), **Client name** (text), **Client email** (text), **Client phone** (text), **Order value** (currency INR), **48-hour deadline** (date), **Drive footage link** (text), **Has phone?** (single-select: Yes / No)

Default sort: **48-hour deadline ascending** (earliest deadline at top).

---

### PROJECT 5 — "Sales — Leads & Prospects"

**View:** Board. **Privacy:** Members. **Icon:** 🎯

**Sections:**
- ❄️ Cold (Outreach Sent)
- 🌡️ Warm (Replied / Engaged)
- 🔥 Hot (Meeting Booked)
- 📋 Proposal Sent
- 🤝 Negotiating
- ✅ Won — New Client
- ❌ Lost — Won't Reopen
- 🔄 Lost — Reopen in 90d

**Custom fields:**
- Owner, Source, Deal size, Lead score, Qualification stage, Timeline
- Plus: **Budget confirmed** (single-select: Yes / No / Unknown), **Decision-maker** (single-select: Yes / No / Influencer), **Pain identified** (single-select: Yes / No), **Source detail** (text), **Industry** (single-select: Real estate / SaaS / Coaching / E-comm / D2C / Other), **Company size** (single-select: Solo / 2-10 / 11-50 / 50+), **Last contact** (date), **Next follow-up** (date), **Disqualified reason** (single-select: No budget / Bad fit / Timing / Ghosted / Competitor / Other)

Default sort: **Lead score descending**.

---

### PROJECT 6 — "Content Calendar — Publishing"

**View:** Calendar (default) + List as secondary. **Privacy:** Members. **Icon:** 📅

**Sections (for the List view):**
- This Week
- Next Week
- Later This Month
- Future
- Published

**Custom fields:**
- Client, Channel (Instagram / LinkedIn / YouTube / TikTok / Blog), Owner, Service type
- Plus: **Topic / Hook** (text), **Status** (single-select: Drafted / Scheduled / Published / Promoted), **Performance — Impressions** (number), **Performance — Engagement** (number)

Tasks here use **Due date = publish date**.

---

### PROJECT 7 — "Renewals & Churn Risk"

**View:** List. **Privacy:** Members. **Icon:** 🛡️

**Sections:**
- Up for renewal — 30 days
- Up for renewal — 60-90 days
- At-Risk — Low replies
- At-Risk — Revision spikes
- At-Risk — Scope reduction
- Confirmed Renewal
- Cancelled

**Custom fields:**
- Client, Plan, MRR, Owner, Health score
- Plus: **Renewal date** (date), **Tenure months** (number), **Last reply days ago** (number), **Revisions this month** (number), **Renewal status** (single-select: Confirmed / At-risk / Negotiating / Cancelled), **Churn signal** (single-select: Low replies / Frequent revisions / Reduced scope / Quiet / None), **Save action** (text)

---

### PROJECT 8 — "Team — Capacity & Workload"

**View:** List. **Privacy:** Members. **Icon:** 👥

Create exactly 3 tasks, one per team member: "Lakshya Soni", "Shaurya", "Aiman".

**Custom fields:**
- Owner
- Plus: **Open deliverables** (number), **Due this week** (number), **Overdue** (number), **Hours this week** (number), **Capacity status** (single-select: Green <40h / Yellow 40-50h / Red >50h)

---

### PROJECT 9 — "Knowledge Base — Playbooks & SOPs"

**View:** List. **Privacy:** Members. **Icon:** 📚

**Sections:**
- Onboarding playbooks
- Production SOPs
- Revision protocols
- Sales playbooks
- Internal ops
- Templates

Create these placeholder tasks (just the names, no descriptions):
- "How to onboard a Video Editing retainer"
- "How to onboard a LinkedIn retainer"
- "How to onboard a Blog retainer"
- "How to brief a podcast clip edit"
- "How to handle a revision round professionally"
- "How to fire a client gracefully"
- "How to ask for a testimonial at month 6"
- "How to upsell from Pilot to Growth"
- "Cold DM template — Real Estate (v3)"
- "Cold DM template — SaaS (v2)"

---

### PROJECT 10 — "Assets — Brand & Raw"

**View:** List. **Privacy:** Members. **Icon:** 🎨

One task per client. Custom fields:
- Client, Owner
- Plus: **Brand colors** (text — hex codes), **Brand fonts** (text), **Tone / Voice doc** (text — link), **Drive — Raw footage** (text — link), **Drive — Final deliverables** (text — link), **Password vault link** (text), **Logo usage rules** (text — long)

For logos and brand kits, attach files directly to each task.

---

### PROJECT 11 — "Internal Tasks & Admin"

**View:** Board. **Privacy:** Members. **Icon:** 📋

**Sections:**
- 📋 Inbox
- 📌 This Week
- 🚧 In Progress
- ⏸️ Waiting On
- ✅ Done This Week
- 🗑️ Won't Do

**Custom fields:**
- Owner, Priority
- Plus: **Effort** (single-select: 15 min / 1 hr / Half day / Full day), **Category** (single-select: Sales ops / Tooling / Hiring / Finance / Marketing / Personal admin / Misc), **Linked client** (Client field)

---

### PROJECT 12 — "Sales Activity Tracker"

**View:** List + Calendar. **Privacy:** Members. **Icon:** 📞

**Sections:**
- 🔥 Today
- 🟡 Tomorrow
- 📅 This Week
- 🗓️ Next Week
- ❄️ Pending — Action TBD

**Custom fields:**
- Owner, Lead (Client field — actually a Lead field, single-select)
- Plus: **Action type** (single-select: Cold DM / Follow-up / Discovery call / Proposal send / Negotiation call / Contract send / Other), **Channel** (single-select: LinkedIn / WhatsApp / Email / Call / Video / In-person), **Done** (checkbox), **Outcome** (text — long)

---

### PROJECT 13 — "Onboarding Checklists (Templates)"

**View:** List. **Privacy:** Members. **Icon:** ✅

Create 4 template tasks, each with subtasks (the actual onboarding checklist). Make these task templates so I can duplicate them when a new client joins.

**Template 1 — "TEMPLATE — Video Editing onboarding"** (subtasks):
1. Send welcome email + onboarding form
2. Schedule 90-min onboarding call
3. Run onboarding call (audience / voice / brand brief / reference examples)
4. Get Drive folder access (raw footage + finals)
5. Pull 3 reference edits from their channel + 3 they admire
6. Write brand brief doc — share with team
7. Identify hook style + pacing preference
8. Ship first edit within 48h of call
9. Internal review before client sees it
10. Send first edit + ask for feedback signal

**Template 2 — "TEMPLATE — LinkedIn onboarding"** (subtasks):
1. Send welcome email
2. Get access to LinkedIn (collab post or scheduled posting tool)
3. Audit their existing voice + top 5 performing posts
4. Define their POV pillars (3-5 themes)
5. Build content calendar for month 1
6. Write first 3 posts in their voice
7. Internal voice-check review
8. Send 3 drafts, ask which feels most "them"
9. Calibrate from feedback
10. Schedule first post

**Template 3 — "TEMPLATE — Blog onboarding"** (subtasks):
1. Send welcome email + topic brief form
2. Audit their existing content + SEO baseline
3. Keyword research for month 1
4. Define editorial standards (tone, length, structure)
5. Build 4-week topic calendar
6. Write first blog (full long-form)
7. Internal review against brief
8. Send for client approval
9. Publish + index
10. Build month 2 calendar

**Template 4 — "TEMPLATE — Pune local shoot client onboarding"** (subtasks):
1. Confirm shoot date + location
2. Send pre-shoot brief form (looks / props / outfits)
3. Confirm crew (Lakshya / Shaurya)
4. Scout location virtually
5. Send shot list for approval
6. Run shoot (full day)
7. Upload + back up footage same day
8. Rough cut within 48h
9. Send for review
10. Final + deliver

---

### PROJECT 14 — "Quarterly Business Reviews"

**View:** List. **Privacy:** Members. **Icon:** 📊

Create a **recurring template task** for each retainer client (you'll add these as clients sign up). Each recurring task fires every 90 days with these subtasks:

1. Pull engagement metrics for the quarter
2. Pull conversion data (if measurable)
3. Identify 2 wins + 1 miss
4. Identify Q+1 goals
5. Schedule the 30-min call
6. Run the call
7. Send summary doc within 24h of call
8. Update profile card (project 2) with new goals
9. Update health score

**Custom fields:**
- Client, Owner
- Plus: **Quarter** (single-select: Q1 / Q2 / Q3 / Q4), **Year** (number), **Health going in** (Health score), **Health going out** (Health score)

---

### PROJECT 15 — "Testimonial / Case Study Pipeline"

**View:** Board. **Privacy:** Members. **Icon:** 🌟

**Sections:**
- 🌱 Possible
- 🙏 Asked
- ✍️ Drafted
- ✅ Live
- 📊 With Metrics

**Custom fields:**
- Client, Owner
- Plus: **Type** (single-select: Text quote / Video testimonial / Full case study / Logo only), **Permission to use** (single-select: Yes / Yes with edits / No), **Where used** (text), **Asked-by** (date), **Delivered-by** (date)

---

### PROJECT 16 — "Subscription / Tooling Renewals"

**View:** List. **Privacy:** Members. **Icon:** 🔄

Pre-create tasks for these tools (I'll fill in dates later):
- Cloudinary
- Adobe Creative Cloud
- Cal.com (Pro)
- Vercel
- Sanity
- Domain (echopulse.media)
- Razorpay (if subscription tier)
- Stripe (if subscription tier)
- Slack (if paid plan)
- Notion (if paid plan)
- Asana (this account)
- Google Workspace
- Inter font commercial license (if applicable)

**Custom fields:**
- Owner, Priority
- Plus: **Annual cost** (currency INR), **Renews on** (date), **Card on file last 4** (text), **Critical?** (single-select: Yes / No), **Alternative if cancelled** (text)

Set sort: **Renews on ascending**.

---

### Automation rules — set these up in Asana Rules

For each rule, navigate to the relevant project → Customize → Rules → New Rule.

1. **In Project 1 (Retainer Pipeline):** When a card moves to "Onboarding — Brief Complete", create 5 tasks in Project 3 (Daily Board) under "Backlog — This Week" with this card's Client field.

2. **In Project 1:** When the "Next renewal" field is within 30 days of today, move the card to "Renewal Window (30d out)" section.

3. **In Project 1:** When the "Last shipped" field is more than 7 days ago AND the card is in any Active section, set Health score = Yellow.

4. **In Project 3:** When a card moves to "Shipped & Approved", update the related Project 1 client card's "Last shipped" field to today.

5. **In Project 4 (Orders):** When a card is created with a "48-hour deadline" field, schedule a notification 24h before that deadline, addressed to the Owner.

6. **In Project 4:** When the "48-hour deadline" is within 12 hours, send Slack notification to entire team via the workspace's Slack integration.

7. **In Project 4:** When a card moves past its "48-hour deadline" while still in production, escalate by assigning to Lakshya Soni and adding tag "OVERDUE".

8. **In Project 5 (Sales):** When a card moves to "Won — New Client", create matching cards in Projects 1 + 2 + 10 with the same Client name + Source.

9. **In Project 5:** When a card has been in the same section for 14+ days, ping the Owner with a reminder.

10. **In Project 11 (Internal):** When a card with Priority = P0 is created, Slack DM the Owner immediately.

---

### Slack integration

Connect Asana to my Slack workspace. Create these channel mappings:

- `#alerts` ← Project 4 order deadline warnings
- `#client-wins` ← Project 5 cards moving to "Won"
- `#daily-shipping` ← Project 3 cards moving to "Shipped & Approved"
- `#renewals` ← Project 1 cards entering "Renewal Window"
- `#churn-risk` ← Project 1 health score going Yellow or Red

If those channels don't exist yet in Slack, create them.

---

### Asana Forms

Create 3 Forms:

**Form 1 — "Talk to us"** (linked to Project 5):
- Name (required)
- Email (required)
- Phone (optional, note: "Gives us a direct line for the fastest follow-up")
- Company / Brand (optional)
- What you need help with (long text, required)
- Estimated monthly budget (single-select: <₹25K / ₹25-50K / ₹50K-1L / ₹1L-2L / ₹2L+)
- How urgent (single-select: Now / 30 days / 60-90 days / Just exploring)

Submission lands in Project 5 → "Hot (Meeting Booked)" section.

**Form 2 — "Add a client"** (internal, linked to Project 2 + 1):
- All the fields from a profile card

**Form 3 — "Revision request"** (linked to Project 3):
- Client (single-select — list of active clients)
- Deliverable name (text)
- What to change (long text)
- Urgency (single-select)

Submission creates a card in Project 3 → "In Revision".

---

### Final check

After everything is built:

1. Show me a screenshot or summary of every project's structure (sections + custom fields).
2. Show me the rules you've set up.
3. Tell me which steps you couldn't complete (Asana's free tier limits rules, custom fields per project, etc.) so I can decide whether to upgrade.
4. Give me the **project GIDs** for projects 1, 2, 4, 5, 11 — I need them to put in my website's .env.local file.

To get a project GID: open the project in Asana, look at the URL. It's the long number in `https://app.asana.com/0/<PROJECT_GID>/list`.

When you're done, summarize the complete setup in a single response so I can confirm everything before I start using it.

---

Begin now. Start with workspace + team + global custom fields. Stop after each major milestone (every 3 projects) and confirm with me before continuing.
