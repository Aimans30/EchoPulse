# EchoPulse — Client Onboarding Kit

Everything you need to onboard a new client smoothly. Copy-paste-and-edit these templates.

Updated: 2026-05-30

---

## The onboarding sequence (every client, every time)

| Hour | Channel | Action | Template |
|---|---|---|---|
| 0 | System | Order/signup webhook fires → Asana card + Slack ping | (automated) |
| 0 | Site | Client redirected to `/onboard` → fills kickoff brief | (automated) |
| 0:30 | Email | Welcome + kickoff confirmation | §1 below |
| 0:30 | WhatsApp | Personal ping from Lakshya | §2 below |
| 24h | Email | Kickoff brief reminder if not filled | §3 below |
| 48h | Email | Draft 1 delivery | §4 below |
| Draft 1 + 24h | Email | Revision check-in | §5 below |
| Post-delivery + 7d | Email | Testimonial ask | §6 below |
| Pre-renewal -15d | Email | Renewal reminder + scope check | §7 below |

---

## §1 — Welcome email (sent within 30 min of order/signup)

**Subject:** You're in. Here's exactly what happens next.

```
Hey {{firstName}},

Lakshya here — founder of EchoPulse Media. Your order is locked in and the
48-hour clock has officially started.

WHAT HAPPENS NEXT
• Within the hour: a quick WhatsApp ping from me personally
• Within 24 hours: your draft is in production
• Within 48 hours: your draft 1 lands in this inbox

ONE QUICK THING
If you haven't already, please fill the kickoff brief — it takes 3 minutes
and ensures we're aimed at the right target from minute one:
{{onboardLink}}

WHAT TO EXPECT FROM ME
• Replies within 3 hours during work days
• Two rounds of revisions on every deliverable
• Re-do until it's right — no nickel-and-diming
• Direct WhatsApp access for anything urgent: {{phoneNumber}}

That's it. Production has started. See you in 48 hours.

— Lakshya
EchoPulse Media · Bhopal
```

---

## §2 — WhatsApp ping template (manual, within 30 min)

Send via WhatsApp Business (web link: `https://wa.me/91XXXXXXXXXX?text=...`)

```
Hey {{firstName}} — Lakshya from EchoPulse here 👋

Got your order. Production starts the moment you fill the kickoff brief.
Link: {{onboardLink}}

Reply anytime — this is my actual number, not a bot.
```

---

## §3 — Kickoff brief reminder (24h, if brief still empty)

**Subject:** {{firstName}}, we're paused on you

```
Hey {{firstName}},

Quick nudge — we can't start the work until the kickoff brief is in.
It takes 3 minutes:
{{onboardLink}}

If anything in the brief is unclear or you'd rather walk it through on a
call, just hit reply and we'll set up 15 minutes.

— Lakshya
```

---

## §4 — Draft 1 delivery email (48h)

**Subject:** Draft 1 — {{deliverableTitle}}

```
Hey {{firstName}},

Draft 1 is in. Three things to know:

WHAT'S ATTACHED / LINKED
{{deliverableLinks}}

WHAT I'M SHOWING YOU
{{1-line about approach — "leaning into your founder-led angle to keep it personal"}}

WHAT I NEED FROM YOU
A "yes, go" or specific notes. The fastest way to revisions is the
voice-memo route — fire one to {{whatsAppNumber}} or reply with timestamps.

Standard turnaround on revisions: 24 hours.

— Lakshya
```

---

## §5 — Revision check-in (24h after draft 1 if no reply)

**Subject:** Quick — what landed, what didn't?

```
Hey {{firstName}},

Wanted to check in on draft 1. Even a "still digesting" is helpful — I'd
rather know we have your attention than wonder.

If something's off, the fastest fix is usually a 60-second voice memo
to {{whatsAppNumber}}.

— Lakshya
```

---

## §6 — Testimonial ask (7 days post final delivery)

**Subject:** One small ask — would you do this?

```
Hey {{firstName}},

It's been a week since we shipped {{deliverableTitle}}. Hope it's landing.

I'd love a one-line testimonial we can share on the site. Something like:
"EchoPulse {{verb}}'d our {{thing}} and {{outcome}}."

Or if a longer line lands easier — your call. Anything you'd be okay
seeing on echopulse.media.

If it's a no, that's totally fine — just say "skip" and I won't ask again.

— Lakshya
```

---

## §7 — Renewal reminder (15 days before renewal)

**Subject:** Renewal in 15 days — quick scope check

```
Hey {{firstName}},

Your retainer renews on {{renewalDate}}. Wanted to flag it early so we
have time to:

• Confirm the scope is still right for you (any tier change, more/less volume?)
• Lock in next month's content themes
• Catch anything that's bugging you while there's time to fix it

15 min call this week? Cal link: {{calLink}}

Or just reply with thoughts — easier for both of us.

— Lakshya
```

---

## What production sees in Asana (auto-created)

When a client submits the kickoff brief at `/onboard`, the system creates:

1. **Profile Card** in `Clients · Profile Cards → Active Clients` with title `Kickoff Brief — {Name}` and the full brief in the description
2. **Subtasks**, one per brief field, so production has a clean checklist:
   - 🎯 Niche / industry
   - 👥 ICP / target audience
   - 🗣️ Tone of voice
   - 📈 30-day goals
   - 🎨 Brand assets
   - 🔗 Reference accounts
   - 📱 Their handles
   - 📝 Anything else
3. **Slack #ops ping** with a link to the brief

Production picks it up from there and starts the deliverable on the Daily Board.

---

## Client expectations document (paste in welcome email or share as link)

```
WHAT TO EXPECT FROM ECHOPULSE

Reply speed     · 3 hours during work days (Mon–Sat, 9am–8pm IST)
Revisions       · 2 rounds included; we re-do until it's right
Delivery        · 48h for one-off · monthly cadence for retainers
Communication   · WhatsApp primary · email for formal · Slack Connect for retainers
File handoff    · Drive/Dropbox links · we don't host your raw footage
Payment         · Razorpay (IN) · Stripe (intl) · monthly billing
Cancellation    · Cancel anytime · no contracts · no auto-renew traps
```

---

## When something goes sideways

| Situation | What to do |
|---|---|
| Client misses kickoff brief | Send §3 at 24h, then a WhatsApp at 48h |
| Client ghosts after draft 1 | Send §5 at 24h, then a WhatsApp at 72h |
| Client asks for refund | Move to `Sales Pipeline · Closed Lost`, send refund within 4h, post-mortem in Asana Knowledge Base |
| Client requests a 3rd revision round | Have an explicit conversation about scope creep — either add a billable round (½ tier price) or recommit to making round 2 the final |
| Renewal fails to charge | Don't pause work yet — send §7 a week early next time, check payment method, give 7-day grace |
| Client expands scope mid-month | Quote the upgrade against the next month's tier, don't try to backfill the current month |

---

## The 3 things that make onboarding feel premium

1. **Personal WhatsApp from Lakshya within 30 min of signup** — sets the relationship tone better than any automation
2. **48h draft promise hit consistently** — under-promise on day 2 first by saying "by day 3" is bad. Hit 48h on the dot.
3. **No back-and-forth on the brief** — the form catches 90% of what we need. The other 10% gets a 5-min call, not a 3-email thread.
