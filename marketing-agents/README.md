# EchoPulse Marketing OS

A three-agent operating system for shipping content that earns followers, gets saved, gets shared, and gets pushed by both LinkedIn's algorithm and Google's index.

---

## Why this exists

The LinkedIn Post Playbook (the 20-archetype doc) is strong as a tactical reference, but it's a *catalog*, not a *system*. A solo founder running an agency cannot ship great content from a catalog alone. They need three specialists with clear roles and a coordination layer:

1. **The Viral Post Writer** — ships hook-engineered LinkedIn posts that earn distribution
2. **The Value Content Creator** — produces high-utility, evergreen content (blogs, carousels, frameworks) that earns saves, shares, and Google index
3. **The Marketing Head** — analyzes everything, picks topics, monitors competitors, sets the weekly thesis, and decides what to scale, kill, or repurpose

Each is a self-contained playbook in this folder. Use them as:
- Reference docs for yourself when planning content
- System prompts when delegating to Claude / ChatGPT
- Onboarding briefs for any team member or freelancer who joins

---

## Review of the existing LinkedIn Post Playbook (8.5/10)

### What I'm keeping (because it works)

| Element | Why I'm keeping it |
|---|---|
| 6 foundational rules | Data-backed, tactical, easy to enforce |
| 20-archetype catalog | Range gives you 6+ weeks of structure variety |
| Why-it-works annotations on each archetype | Teaches the *system* behind the post, not just the form |
| EchoPulse drafts | Gets you 70% of the way to a final post on every archetype |
| First-hour reply protocol | Single highest-impact post-publish lever |
| Save + DM tracking over likes | Correct measurement instinct |
| Mon/Wed/Fri archetype rotation | Prevents repetitive feel |

### What I'm fixing or adding

| Gap | Fix |
|---|---|
| INR-localized drafts | Each archetype now has US/global variants alongside the originals |
| Pure text-only focus | Added carousel + native-video formats for the same archetypes |
| Missing bottom-of-funnel posts | Added 5 new archetypes for warm-buyer content (case studies framed as POV, "what working with us looks like", anti-positioning posts) |
| No comment-engagement playbook | Added a Reply Lab with templated openers + tone guardrails |
| No competitor monitoring loop | Marketing Head agent runs this weekly |
| No measurement dashboard | Marketing Head defines a 7-tier post grading rubric |
| No content recycling pipeline | Every Tier-A post gets remixed into 4 derivative formats automatically |
| No Google-index lens | Value Content Creator owns SEO-paired companion blogs for every recurring theme |

---

## How the three agents work together

```
                        ┌──────────────────────────────┐
                        │   MARKETING HEAD / ANALYST   │
                        │  (The brain · weekly thesis) │
                        └──────────┬───────────────────┘
                                   │
                  Topic queue + format calls + measurement
                                   │
                ┌──────────────────┴──────────────────┐
                ▼                                      ▼
   ┌────────────────────────┐            ┌────────────────────────┐
   │  VIRAL POST WRITER     │            │  VALUE CONTENT CREATOR │
   │  (LinkedIn distribution)│            │  (Evergreen + Google)  │
   │  • Hooks + archetypes  │            │  • Frameworks          │
   │  • 700-1500 char posts │            │  • Long-form blogs     │
   │  • Comment engagement  │            │  • Carousels           │
   │  • Mon/Wed/Fri cadence │            │  • Templates / cheats  │
   └────────────────────────┘            └────────────────────────┘
                │                                      │
                └─────────────── shipped ──────────────┘
                                   │
                                   ▼
                ┌──────────────────────────────────────┐
                │  Performance feeds back to the Head  │
                │  (saves · DMs · time-on-page · Google│
                │   impressions · backlinks · replies) │
                └──────────────────────────────────────┘
```

The Marketing Head is the only agent that *decides*. The other two execute.

The Viral Post Writer never asks "should we post about X?" — they're handed a topic and an archetype by the Head and they ship a great post. The Value Content Creator never asks "is this worth a 2,000-word blog?" — the Head has already decided based on search volume and topic authority potential.

This separation is critical because the failure mode of solo content operations is *context-switching*. When the same brain is deciding strategy AND writing copy AND analyzing performance, all three suffer. With these agents, you can sit in one role at a time.

---

## Weekly operating rhythm

**Monday morning (45 min) — Marketing Head session**
- Review last week's posts (saves, DMs, Google impressions, follower delta)
- Run the competitor scan (5 specific accounts in your niche)
- Pick this week's 3 LinkedIn topics + 1 long-form companion
- Hand topics + archetypes to the writer agents

**Tuesday + Thursday (60-75 min each) — Viral Post Writer session**
- Hook lab (5-7 hook variations, pick 1)
- Draft, red-team, polish
- Schedule for Wed / Fri (Mon's post written previous week)

**Wednesday afternoon (90 min) — Value Content Creator session**
- Long-form blog or carousel from this week's "anchor" topic
- Cross-link to LinkedIn posts where relevant
- Format for SEO + LinkedIn carousel + email simultaneously

**Friday afternoon (30 min) — Marketing Head measurement**
- Tier-grade each post (see Marketing Head doc, "7-tier post rubric")
- Decide what to repurpose, scale, or kill next week
- Update the topic backlog

That's roughly 4-5 hours a week of focused content work, producing:
- 3 LinkedIn text posts
- 1 long-form blog
- 1 carousel (derivative of the blog)
- 5+ days of comment engagement on 5 niche accounts each

---

## Files in this folder

| File | Owner | Purpose |
|---|---|---|
| `01_VIRAL_POST_WRITER.md` | The Writer | Operational playbook for shipping LinkedIn posts that earn distribution |
| `02_VALUE_CONTENT_CREATOR.md` | The Creator | Operational playbook for evergreen, save-worthy, Google-indexed content |
| `03_MARKETING_HEAD_ANALYST.md` | The Head | Operational playbook for analysis, thesis-setting, and orchestration |
| `README.md` | (this file) | The system overview |

---

## How to use these agents

### Option A — As reference for yourself
Open the relevant agent doc when you sit down to do that role's work. Each doc includes the SOP, the templates, the decision criteria, and worked examples.

### Option B — As a system prompt for an LLM
Copy the contents of any agent file into a Claude / ChatGPT system prompt. Then give the model a topic and an archetype, and it will produce output following that agent's specific style and constraints.

### Option C — As an onboarding doc for a hire
When you bring on a content writer or marketing assistant, hand them the relevant agent doc. It defines the *what*, the *how*, and the *what done looks like* — which is the gap most agencies leave open and pay for in revision cycles.

---

## One opinion before you read on

The LinkedIn algorithm in 2026 doesn't reward "good content" — it rewards *content that holds attention long enough to validate the post for further distribution*. That's the actual job. Saves are the strongest signal. Comments in the first hour are the second strongest. Time spent reading (dwell) is the third. Likes are the weakest signal we measure but the easiest to get — which is why most people optimize for them and stay small.

These three agents are designed around saves, dwell, and DMs — not likes. If a post gets 800 likes and 2 saves, it's a vanity post. If a post gets 60 likes and 40 saves, it's a business post. We're building the second kind.
