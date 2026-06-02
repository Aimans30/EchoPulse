# EchoPulse — Agency Operations Playbook

> Goal: close **10 new clients/month** on retainers.
> System: Website → Cal.com → Asana → Slack → Closed.
> Last updated: 2026-05-30

---

## 1. The funnel math (work backward from 10)

| Stage | Conversion | Volume needed |
|---|---|---|
| Site visitors | — | 5,000/mo |
| Lead captures | 2% | 100 |
| Discovery calls booked | 30% of leads | 30 |
| Proposals sent | 70% of calls | 21 |
| **Closes** | **48% of proposals** | **10** |

If you're hitting fewer calls than 30/mo, the bottleneck is leads — not closing. If you're hitting 30 calls and closing fewer than 10, the bottleneck is the proposal/follow-up.

---

## 2. Where the 100 leads come from

| Channel | Target/mo | Where it lands |
|---|---|---|
| Inbound — site contact form | 25 | `/api/lead` → #leads |
| Inbound — Cal.com direct booking | 15 | `/api/cal-webhook` → #leads |
| Inbound — lead-magnet download | 20 | `/api/lead?source=lead-magnet` → #leads |
| Outbound — cold email | 25 | Manual → Asana Sales Pipeline · New Lead |
| Outbound — Instagram/LinkedIn DMs | 10 | Manual → Asana Sales Pipeline · New Lead |
| Referrals from existing clients | 5 | Asana with `source=Referral` (priority handling) |

**Every lead lands in two places:** Asana (Sales Pipeline · New Lead) + Slack #leads.

---

## 3. The 4 systems running in production

### System A — Lead capture
- `POST /api/lead` { fullName, email, source, ... }
- Creates Asana card, pings #leads
- Status: ✅ live

### System B — Meeting booking
- Cal.com webhook → `POST /api/cal-webhook`
- Creates Asana card with 7 pre-seeded prep subtasks
- Pings #leads with attendee + time
- Status: ✅ live (configure secret in cal.com settings)

### System C — One-off orders
- OrderFlow form → `POST /api/checkout`
- Creates Asana card with **48-hour clock** (due_at)
- Pings #orders
- Status: ✅ live

### System D — Retainer signup
- Razorpay/Stripe subscription webhook → calls `createRetainerClient()`
- Creates Retainer Pipeline card + Profile Card with 5 pre-filled subtasks
- Pings #wins
- Status: ⏸ awaiting Razorpay/Stripe wiring

---

## 4. The discovery call (45 min) — same every time

**Minutes 0-3 · Pace the room**
- "Tell me what you're working on right now — give me the messy version."
- Listen for: revenue stage, current content cadence, why now.

**Minutes 3-15 · Diagnose**
- Show me your last 5 posts (have their handle pulled up before the call)
- What's the goal? Leads / awareness / authority / sales
- Who's posting today? Time spent per week?

**Minutes 15-30 · Anchor the value**
- Tell the EchoPulse story (2 min — taste isn't an add-on, it's the job)
- Show 2 case studies that match their niche
- Diagnose their #1 gap in plain English

**Minutes 30-40 · Match a tier**
- Pilot → "if you want a low-risk way to feel us"
- Growth → "if you want consistency and you don't want to think about it"
- Full Studio → "if content IS your funnel and you need a real partner"

**Minutes 40-45 · The close**
- "Want me to send a one-pager with exactly what we'd do in month 1?"
- 95% say yes. The proposal goes out within 2 hours (subtask #4 in Asana fires the reminder).

---

## 5. The proposal (one page, sent within 2h)

Markdown template — paste into Notion or email. Use the Asana Profile Card subtask "Proposal sent" with the link.

```
Hi {{ name }},

Recap of what we discussed — and what I'd do in month 1.

WHERE YOU ARE
• {{ their current state — 1 line }}
• {{ the gap — 1 line }}

WHAT I'D DO IN MONTH 1
• Week 1: {{ deliverable }}
• Week 2: {{ deliverable }}
• Week 3: {{ deliverable }}
• Week 4: {{ deliverable }}

PRICING
{{ Tier — Pilot/Growth/Full }} · {{ INR amount }}/mo
No annual contract. Cancel anytime. Same-day replies.

NEXT STEP
Reply "go" and I'll send the contract + payment link by EOD.

— Lakshya
```

---

## 6. The follow-up sequence (3 messages over 7 days)

Each is a separate subtask on the Asana card. They auto-surface on due dates.

- **Day 3 — "checking in"** · short, no pressure, asks if they have questions
- **Day 5 — "case study"** · share one matched-niche client win with the result
- **Day 7 — "close or close"** · "want to lock in this month's pilot slot or should I follow up Q3?"

After day 7 with no reply → move card to "Closed Lost (no reply)" and add to cold-nurture (revisit in 90 days).

---

## 7. The closing day (when they say yes)

1. Send contract via email (use Razorpay payment link or Stripe checkout)
2. The subscription webhook fires → `createRetainerClient()` runs
3. Profile Card created in Asana with 5 subtasks pre-seeded
4. Slack #wins gets the celebration ping
5. Within 1h: send welcome email + Cal.com kickoff link
6. Within 48h: kickoff call
7. Within 7d: first deliverable

Everything from step 2 onward is automated. You only handle steps 1, 5, 6, 7.

---

## 8. Daily cadence (15 min/day)

**8:30 am · Check Slack** — look at overnight #leads + #orders
**9:00 am · Daily briefing pings #ops** (automated — see scheduled-tasks)
- Yesterday's signups
- Open leads needing follow-up today
- Asana cards due today
- Pipeline temperature
**9:15 am · Pick your top 3 client-work items**
**9:30 am · Pick your top 3 sales actions** — follow-ups, outbound, proposals
**6:00 pm · Close out the day** — move Asana cards, ping #ops with EOD summary

---

## 9. Weekly cadence (45 min Monday)

- Review Asana Sales Pipeline board
- Move stuck deals (>14 days same stage = at-risk)
- Pick this week's outbound 25 (LinkedIn + cold email)
- Pick this week's 2 content-marketing pieces (one carousel, one reel for OUR brand)
- Check #renewals — anyone in the 15-day window?
- Update forecast in the Asana Knowledge Base

---

## 10. Slack channel etiquette

| Channel | Post here when… | Don't post here |
|---|---|---|
| #all-echopulse-media | Default fallback. Everything auto-routes here if no specific channel matches. | — |
| #leads | New leads, Cal.com bookings, follow-up reminders | Internal jokes, deliverable proofs |
| #orders | New orders, 48h clock, delivery confirmations | Sales pipeline noise |
| #wins | Retainer signings, testimonials, big invoices, brag-worthy work | Day-to-day deliverables |
| #renewals | Renewal warnings, churn alerts | New leads |
| #urgent | Refund requests, missed deadlines, angry clients, broken site | Anything that can wait 2 hours |
| #ops | Internal standup, SOPs, weekly review, daily briefings | Client comms |
| #client-{name} | Talking to ONE specific client (Slack Connect) | Anything that should be private |

---

## 11. What's automated vs manual

| Automated | Manual |
|---|---|
| Lead → Asana card + Slack ping | Discovery call |
| Booking → prep subtasks pre-seeded | Proposal writing (template helps) |
| Order → 48h clock + Slack alert | Cold outbound |
| Retainer signup → Profile + Pipeline card | Building the relationship |
| Renewal in 15 days → calendar reminder | Negotiating renewals |
| Daily briefing at 9am | Doing the work the briefing surfaces |

The system catches the boring stuff so you can spend your time on the 3 things that close deals: **research before calls**, **showing taste in your work**, **replying within 3 hours**.

---

## 12. When something breaks

- Slack webhook fails → check #all-echopulse-media (default fallback) and `.env.local` SLACK_WEBHOOK_URL
- Asana task creation fails → check `ASANA_TOKEN` and the project GIDs
- Cal.com webhook fails → cal.com → Settings → Developer → Webhooks → click your webhook → see delivery history
- Site form 500s → `vercel logs --follow` or check `/api/lead` route in dev

---

## 13. The 4 metrics that matter

Track these weekly in the Asana Knowledge Base · Sales SOPs section.

| Metric | Why it matters | Target |
|---|---|---|
| Leads/week | Top of funnel health | 25 |
| Booked calls/week | Lead quality + funnel mid | 7-8 |
| Proposals → close % | Sales process quality | 48%+ |
| MRR added/month | The only real number | ₹2L+ |

If any of these drop two weeks in a row, that's the metric you fix next week.
