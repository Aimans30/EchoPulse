import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createLead, addAsanaSubtask } from '@/lib/asana';
import { postToSlack } from '@/lib/slack';

/**
 * Cal.com webhook receiver — fires when someone books / cancels / reschedules.
 *
 * SETUP (one-time):
 *   1. cal.com → Settings → Developer → Webhooks → New
 *   2. Subscriber URL:  https://YOUR-DOMAIN/api/cal-webhook
 *   3. Secret:          generate a random string, paste here AND into
 *                       .env.local as CAL_WEBHOOK_SECRET
 *   4. Events:          ✓ BOOKING_CREATED   ✓ BOOKING_CANCELLED
 *                       ✓ BOOKING_RESCHEDULED
 *   5. Save → click "Ping test" to verify
 *
 * WHAT IT DOES on BOOKING_CREATED:
 *   • Creates a lead in Asana → Sales Pipeline · Discovery Call Booked
 *     (with subtasks for: call prep, follow-up email, proposal)
 *   • Pings Slack with attendee name, email, time, and Asana deep-link
 *   • You walk into the call knowing exactly who's on the line
 *
 * On CANCELLED or RESCHEDULED — pings Slack so you don't show up to a
 * dead meeting.
 */

interface CalWebhookPayload {
  triggerEvent: 'BOOKING_CREATED' | 'BOOKING_CANCELLED' | 'BOOKING_RESCHEDULED' | 'MEETING_ENDED' | string;
  createdAt: string;
  payload: {
    title?: string;
    type?: string;
    startTime?: string;
    endTime?: string;
    organizer?: { name?: string; email?: string; timeZone?: string };
    attendees?: Array<{ name?: string; email?: string; timeZone?: string }>;
    responses?: Record<string, { label?: string; value?: unknown }>;
    bookingId?: number;
    rescheduleUid?: string;
    uid?: string;
    location?: string;
    additionalNotes?: string;
  };
}

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-cal-signature-256');
  const secret = process.env.CAL_WEBHOOK_SECRET;

  // Signature is optional in dev (no secret set) but REQUIRED in prod.
  if (secret && !verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });
  }

  let event: CalWebhookPayload;
  try {
    event = JSON.parse(rawBody) as CalWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const p = event.payload ?? {};
  const attendee = p.attendees?.[0] ?? {};
  const startTime = p.startTime ? new Date(p.startTime) : null;
  const startStr = startTime ? startTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : 'unknown time';
  const eventTypeName = p.title ?? p.type ?? 'Discovery call';
  const fullName = attendee.name ?? 'Unknown attendee';
  const email = attendee.email ?? 'no-email@unknown';
  const notes = p.additionalNotes ?? '';

  // ── BOOKING_CREATED — the meaty path ─────────────────────────────────
  if (event.triggerEvent === 'BOOKING_CREATED') {
    const asanaTask = await createLead({
      fullName, email,
      source: 'Cal.com',
      serviceInterest: eventTypeName,
      notes: `Meeting: ${eventTypeName}\nWhen: ${startStr}\n${notes ? `Notes from attendee: ${notes}` : ''}`,
    });

    // Pre-seed prep subtasks so the call doesn't ambush you
    if (asanaTask) {
      await Promise.all([
        addAsanaSubtask(asanaTask.gid, `📋 Pre-call: research ${fullName} / company (15 min before)`),
        addAsanaSubtask(asanaTask.gid, '🎯 Pre-call: skim their website + LinkedIn'),
        addAsanaSubtask(asanaTask.gid, '📞 Run discovery call (45m)'),
        addAsanaSubtask(asanaTask.gid, '✍️ Post-call: send recap email within 2h'),
        addAsanaSubtask(asanaTask.gid, '💬 Post-call: send proposal within 24h'),
        addAsanaSubtask(asanaTask.gid, '🔁 Day 3: follow up if no reply'),
        addAsanaSubtask(asanaTask.gid, '🔁 Day 7: final nudge before "no" close'),
      ]);
    }

    await postToSlack({
      text: `📞 Meeting booked: ${fullName} — ${startStr}`,
      channel: 'leads',
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: '📞 Meeting Booked', emoji: true } },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${fullName}*  ·  ${email}\n*When:* ${startStr} (IST)\n*Type:* ${eventTypeName}${notes ? `\n*Notes:* ${notes}` : ''}`,
          },
        },
        ...(asanaTask ? [{
          type: 'actions' as const,
          elements: [{ type: 'button' as const, text: { type: 'plain_text' as const, text: 'Open Pipeline Card' }, url: asanaTask.permalink_url, style: 'primary' as const }],
        }] : []),
        { type: 'context', elements: [{ type: 'mrkdwn' as const, text: '✅ Prep checklist pre-seeded in Asana — 15min before, do the research subtask.' }] },
      ],
    });

    return NextResponse.json({ ok: true, asanaUrl: asanaTask?.permalink_url ?? null });
  }

  // ── CANCELLED — don't show up to a dead meeting ──────────────────────
  if (event.triggerEvent === 'BOOKING_CANCELLED') {
    await postToSlack({
      text: `🚫 Meeting cancelled: ${fullName} (${startStr})`,
      channel: 'leads',
      blocks: [
        { type: 'section', text: { type: 'mrkdwn', text: `🚫 *Cancelled:* ${fullName} — ${startStr}\nFollow up in 7 days with a "still interested?" check-in.` } },
      ],
    });
    return NextResponse.json({ ok: true });
  }

  // ── RESCHEDULED — quietly update Slack ───────────────────────────────
  if (event.triggerEvent === 'BOOKING_RESCHEDULED') {
    await postToSlack({
      text: `📅 Meeting rescheduled: ${fullName} → ${startStr}`,
      channel: 'leads',
    });
    return NextResponse.json({ ok: true });
  }

  // Unknown event — accept it so Cal.com doesn't retry forever.
  return NextResponse.json({ ok: true, ignored: event.triggerEvent });
}
