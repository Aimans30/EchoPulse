# EchoPulse Slack Setup — Free Tier

Last updated: 2026-05-30

Everything below works on **Slack Free**. No Pro/Business needed.

---

## 1. Channel structure (create these)

In Slack: click **+ Add channels → Create new channel** and create each.
Keep all **public** unless noted.

| Channel | Purpose | Who's in it |
|---|---|---|
| `#all-echopulse-media` | Default firehose. Every automated event. | Everyone |
| `#leads` | New leads only. Low-noise. | You + sales help |
| `#orders` | New orders + the 48-hour clock alerts | You + production team |
| `#wins` | Retainer signings, testimonials, big invoices. The fun one. | Everyone |
| `#renewals` | 15-day renewal warnings, churn alerts | You + account managers |
| `#urgent` | Overdue tasks, refund requests, complaints | You + senior team |
| `#ops` | Internal standup, SOPs, weekly review | Everyone |
| `#client-{name}` | One per Slack-Connect retainer client | You + that client |

---

## 2. Create one Incoming Webhook per channel

You already have `SLACK_WEBHOOK_URL` set up for `#all-echopulse-media` — the firehose. Now you create 6 more (one per channel above).

### Steps (repeat per channel)

1. Go to <https://api.slack.com/apps>
2. Click the **"EchoPulse Webhooks"** app (or whichever app you created the original webhook under). If you don't have one, click **Create New App → From scratch**, name it `EchoPulse Webhooks`, pick the EchoPulse workspace.
3. In the left sidebar: **Incoming Webhooks**
4. Toggle **Activate Incoming Webhooks** to ON if it isn't already
5. Scroll down → **Add New Webhook to Workspace**
6. Pick the channel (e.g. `#leads`) → **Allow**
7. Copy the URL (format `https://hooks.slack.com/services/T.../B.../...`)
8. Paste into `.env.local` under the matching variable:

```
SLACK_WEBHOOK_LEADS=https://hooks.slack.com/services/...
SLACK_WEBHOOK_ORDERS=https://hooks.slack.com/services/...
SLACK_WEBHOOK_WINS=https://hooks.slack.com/services/...
SLACK_WEBHOOK_RENEWALS=https://hooks.slack.com/services/...
SLACK_WEBHOOK_URGENT=https://hooks.slack.com/services/...
SLACK_WEBHOOK_OPS=https://hooks.slack.com/services/...
```

9. Restart `npm run dev` so Next.js picks up the new env vars.

**You can skip any channel you don't want yet** — `lib/slack.ts` falls back to `SLACK_WEBHOOK_URL` (the firehose) when a channel-specific URL is missing. So everything still works during the rollout.

### Test it

```bash
curl http://localhost:3000/api/crm-test?type=lead
# → posts to #leads (or firehose if SLACK_WEBHOOK_LEADS is empty)

curl http://localhost:3000/api/crm-test?type=order
# → posts to #orders + creates Asana card with 48h clock

curl http://localhost:3000/api/crm-test?type=retainer
# → posts to #wins + creates Retainer + Profile cards in Asana
```

---

## 3. Wire the existing routes to use the right channel

Your code already routes correctly — `buildLeadMessage()` sends to `#leads`, `buildOrderMessage()` to `#orders`, etc. No further changes needed.

If you build new alert types, follow this pattern:

```ts
import { postToSlack } from '@/lib/slack';

await postToSlack({
  text: 'fallback text',
  channel: 'urgent', // ← pick: 'default' | 'leads' | 'orders' | 'wins' | 'renewals' | 'urgent' | 'ops'
  blocks: [...],
});
```

---

## 4. Can I use Slack to talk to clients? — Honest answer

Short answer: **yes, but only for high-value retainer clients, and you should pair it with WhatsApp/email for everyone else.**

### The Free-tier facts (as of 2026)

1. **90-day message history limit.** On Slack Free, messages older than 90 days are hidden (not deleted). Anything important needs to be copied to Asana or Notion within 90 days, or you lose visibility.
2. **Slack Connect IS available on Free.** You can share one channel with an external workspace (a client's Slack, or a Slack account you create for them). This is the cleanest way to do client comms.
3. **Single-Channel Guests are NOT on Free.** That feature (where you invite someone to ONE channel inside your workspace at no cost) is Pro+ only. If you try this on Free, your client takes a full member seat — not what you want.
4. **Direct DMs work fine.** A client with their own Slack account can DM you. Free.

### Recommended model

| Client type | Comms channel | Why |
|---|---|---|
| Pilot / one-off orders | Email + WhatsApp | Don't ask them to install Slack for a 48h job |
| Growth retainers | Slack Connect channel (`#client-{name}`) | They get a dedicated channel; clean handoffs from you to team |
| Full Studio | Slack Connect channel + WhatsApp for urgent | Multi-channel is fine when the relationship is deep |

### How to set up Slack Connect with a client (Free tier)

1. Create the channel `#client-acme` in your EchoPulse workspace
2. In the channel, click the channel name at the top → **Integrations → Add an app** is NOT it — instead click **Connect with another organization**
3. Enter the client's email → Slack sends them an invite
4. Once they accept, both sides can post in the channel; messages older than 90 days are hidden on Slack Free for both workspaces (advise the client to archive important docs in Drive/Notion within 90 days)

### What to tell clients about Slack Connect

> "We use a dedicated channel in Slack so you have my whole team in one place. Drag-drop footage there, ping anyone, get same-day replies. The channel lives in your Slack — no new app, no new account."

---

## 5. Slack Connect limitations to know about

- The Connect channel CANNOT be searched across your other channels (it's bridged, not native)
- You cannot post to it via incoming webhooks from your code (Slack blocks webhook → Connect for security)
- For automation INTO a client channel, use the bot/MCP approach OR just have a member post manually
- 1 Connect channel per external org on Free (you get 5 on Pro)

---

## 6. Next steps after webhooks

Once channels + webhooks are live, the production system is:

```
Website event             →  Asana                →  Slack
─────────────────────────────────────────────────────────────────
/api/lead (form/Cal.com)  →  Sales Pipeline card  →  #leads
/api/checkout (one-off)   →  Orders + 48h clock   →  #orders
/api/subscription (mo)    →  Retainer + Profile   →  #wins
Asana: renewal in 15d     →  Renewals Watch       →  #renewals (cron)
Asana: order overdue      →  Orders (red section) →  #urgent (cron)
```

A nightly cron (Vercel Cron or GitHub Actions) reads Asana for overdue + renewal-in-15d tasks and pings `#urgent` / `#renewals`. See `lib/asana.ts` for the query helpers when you're ready to wire that.
