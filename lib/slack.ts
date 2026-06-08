import 'server-only';

/**
 * Slack incoming-webhook helper with multi-channel routing.
 *
 * Server-only because webhook URLs are credentials. Never import from a
 * client component — even with `'use server'` we want this to error
 * loudly if it's reached client-side.
 *
 * Routing model: ONE webhook per channel. Each webhook posts to a single
 * channel decided when the webhook was created in Slack. To send to a
 * different channel, create a new webhook and add its URL to .env.local
 * under the matching env var below. The router picks the right URL based
 * on the `channel` argument and falls back to SLACK_WEBHOOK_URL.
 *
 * Channel taxonomy (matches SLACK-SETUP.md):
 *   #all-echopulse-media → default firehose (every event)
 *   #leads               → new leads only (low noise)
 *   #orders              → new orders + 48h overdue alerts
 *   #wins                → retainer signings, big deals, testimonials
 *   #renewals            → 15-day renewal reminders + churn alerts
 *   #urgent              → refunds, complaints, missed deadlines
 *   #ops                 → internal team standup, SOPs, internal tasks
 */

type SlackChannel =
  | 'default'
  | 'leads'
  | 'orders'
  | 'wins'
  | 'renewals'
  | 'urgent'
  | 'ops'
  // Pune-only on-site shoot inquiries (PuneInquiryModal → /api/pune-inquiry).
  // Falls back to firehose if SLACK_WEBHOOK_PUNE is unset.
  | 'pune';

interface SlackPostOptions {
  /** Plain-text fallback shown in notifications + when blocks fail to render. Always include. */
  text: string;
  /** Optional rich block layout — https://api.slack.com/block-kit */
  blocks?: SlackBlock[];
  /** Which channel to post to. Defaults to SLACK_WEBHOOK_URL (the firehose). */
  channel?: SlackChannel;
  /** Hard override — wins over `channel`. Use sparingly. */
  webhookUrl?: string;
}

type SlackBlock =
  | { type: 'header'; text: { type: 'plain_text'; text: string; emoji?: boolean } }
  | { type: 'section'; text: { type: 'mrkdwn' | 'plain_text'; text: string }; fields?: Array<{ type: 'mrkdwn' | 'plain_text'; text: string }> }
  | { type: 'divider' }
  | { type: 'context'; elements: Array<{ type: 'mrkdwn'; text: string }> }
  | { type: 'actions'; elements: Array<{ type: 'button'; text: { type: 'plain_text'; text: string }; url?: string; style?: 'primary' | 'danger' }> };

/**
 * Resolve which webhook URL to use for a given channel. Falls back through:
 *   1. Explicit `webhookUrl` override
 *   2. Channel-specific env var (e.g. SLACK_WEBHOOK_LEADS)
 *   3. SLACK_WEBHOOK_URL (default firehose — posts to #all-echopulse-media)
 *   4. null (skipped — `postToSlack` returns false)
 */
function resolveWebhookUrl(channel: SlackChannel = 'default', override?: string): string | null {
  if (override) return override;
  const envMap: Record<SlackChannel, string | undefined> = {
    default: process.env.SLACK_WEBHOOK_URL,
    leads: process.env.SLACK_WEBHOOK_LEADS || process.env.SLACK_WEBHOOK_URL,
    orders: process.env.SLACK_WEBHOOK_ORDERS || process.env.SLACK_WEBHOOK_URL,
    wins: process.env.SLACK_WEBHOOK_WINS || process.env.SLACK_WEBHOOK_URL,
    renewals: process.env.SLACK_WEBHOOK_RENEWALS || process.env.SLACK_WEBHOOK_URL,
    urgent: process.env.SLACK_WEBHOOK_URGENT || process.env.SLACK_WEBHOOK_URL,
    ops: process.env.SLACK_WEBHOOK_OPS || process.env.SLACK_WEBHOOK_URL,
    pune: process.env.SLACK_WEBHOOK_PUNE || process.env.SLACK_WEBHOOK_URL,
  };
  return envMap[channel] ?? null;
}

/**
 * Post a message to Slack. Returns true on success, false on any error.
 * Never throws — callers can safely fire-and-forget.
 */
export async function postToSlack(opts: SlackPostOptions): Promise<boolean> {
  const url = resolveWebhookUrl(opts.channel, opts.webhookUrl);
  if (!url) {
    // eslint-disable-next-line no-console
    console.warn(`[slack] no webhook URL for channel "${opts.channel ?? 'default'}" — skipping`);
    return false;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: opts.text,
        ...(opts.blocks ? { blocks: opts.blocks } : {}),
      }),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error('[slack] post failed:', res.status, await res.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[slack] post threw:', err);
    return false;
  }
}

/**
 * Build a "new order" Slack message — for the OrderFlow → /api/checkout path.
 * Routes to #orders.
 */
export function buildOrderMessage(args: {
  fullName: string;
  email: string;
  phone?: string;
  service: string;
  tier?: string;
  total: string;
  fileLink?: string;
  asanaTaskUrl?: string;
  /** Delivery promise in HOURS — drives the "starts now" line. Default 48h. */
  deliveryHours?: number;
}): SlackPostOptions {
  const hours = args.deliveryHours && args.deliveryHours > 0 ? args.deliveryHours : 48;
  const deliveryLabel = hours < 72 ? `${hours}-hour` : `${Math.round(hours / 24)}-day`;

  const lines = [
    `*Client:* ${args.fullName}  (${args.email})`,
    args.phone ? `*Phone:* ${args.phone}` : null,
    `*Service:* ${args.service}${args.tier ? ` — ${args.tier}` : ''}`,
    `*Total:* ${args.total}`,
    `*Delivery promise:* ${deliveryLabel}`,
    args.fileLink ? `*Footage:* ${args.fileLink}` : null,
  ].filter(Boolean).join('\n');

  return {
    text: `🆕 New order from ${args.fullName} — ${args.total}`,
    channel: 'orders',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: '🆕 New Order', emoji: true } },
      { type: 'section', text: { type: 'mrkdwn', text: lines } },
      ...(args.asanaTaskUrl ? [{
        type: 'actions' as const,
        elements: [{ type: 'button' as const, text: { type: 'plain_text' as const, text: 'Open in Asana' }, url: args.asanaTaskUrl, style: 'primary' as const }],
      }] : []),
      { type: 'context', elements: [{ type: 'mrkdwn' as const, text: `${deliveryLabel} delivery clock starts now · ${new Date().toLocaleString()}` }] },
    ],
  };
}

/**
 * Build a "new lead" Slack message — for the Cal.com booking webhook + contact form.
 * Routes to #leads.
 */
export function buildLeadMessage(args: {
  fullName: string;
  email: string;
  source: string;
  notes?: string;
  asanaTaskUrl?: string;
}): SlackPostOptions {
  return {
    text: `🔥 New lead: ${args.fullName} (${args.source})`,
    channel: 'leads',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: '🔥 New Lead', emoji: true } },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${args.fullName}*  ·  ${args.email}\n*Source:* ${args.source}${args.notes ? `\n*Notes:* ${args.notes}` : ''}`,
        },
      },
      ...(args.asanaTaskUrl ? [{
        type: 'actions' as const,
        elements: [{ type: 'button' as const, text: { type: 'plain_text' as const, text: 'Open in Asana' }, url: args.asanaTaskUrl, style: 'primary' as const }],
      }] : []),
    ],
  };
}

/**
 * Build a "retainer signed" celebration message. Routes to #wins.
 */
export function buildRetainerWinMessage(args: {
  fullName: string;
  tier: string;
  monthlyAmount: string;
  renewsOn: string;
  asanaTaskUrl?: string;
}): SlackPostOptions {
  return {
    text: `🎉 New retainer — ${args.fullName} · ${args.tier} · ${args.monthlyAmount}/mo`,
    channel: 'wins',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: '🎉 New Retainer Signed', emoji: true } },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Client:* ${args.fullName}\n*Tier:* ${args.tier} · ${args.monthlyAmount}/mo\n*Renews:* ${args.renewsOn}`,
        },
      },
      ...(args.asanaTaskUrl ? [{
        type: 'actions' as const,
        elements: [{ type: 'button' as const, text: { type: 'plain_text' as const, text: 'Open Pipeline Card' }, url: args.asanaTaskUrl, style: 'primary' as const }],
      }] : []),
    ],
  };
}

/**
 * Build a renewal-reminder message. Routes to #renewals.
 */
export function buildRenewalReminderMessage(args: {
  clientName: string;
  tier: string;
  renewsOn: string;
  daysOut: number;
}): SlackPostOptions {
  return {
    text: `⏰ Renewal in ${args.daysOut} days — ${args.clientName} (${args.tier})`,
    channel: 'renewals',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: '⏰ Renewal Reminder', emoji: true } },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${args.clientName}* renews in *${args.daysOut} days* (${args.renewsOn}).\nTier: ${args.tier}\n\nReach out to confirm scope, surface upsell, or address concerns.`,
        },
      },
    ],
  };
}

/**
 * Build an overdue/urgent alert. Routes to #urgent.
 */
export function buildUrgentMessage(args: {
  title: string;
  body: string;
  asanaTaskUrl?: string;
}): SlackPostOptions {
  return {
    text: `🚨 ${args.title}`,
    channel: 'urgent',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `🚨 ${args.title}`, emoji: true } },
      { type: 'section', text: { type: 'mrkdwn', text: args.body } },
      ...(args.asanaTaskUrl ? [{
        type: 'actions' as const,
        elements: [{ type: 'button' as const, text: { type: 'plain_text' as const, text: 'Open in Asana' }, url: args.asanaTaskUrl, style: 'danger' as const }],
      }] : []),
    ],
  };
}
