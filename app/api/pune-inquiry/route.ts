import { NextResponse } from 'next/server';
import { createLead } from '@/lib/asana';
import { postToSlack } from '@/lib/slack';
import { sendEmail, buildPuneInquiryConfirmation } from '@/lib/email';
import { rateLimit } from '@/lib/rateLimit';

/**
 * Pune onsite shoot inquiry endpoint.
 *
 * Fires when a Pune visitor submits the PuneInquiryModal form. Pune leads
 * follow a different lifecycle from the standard online retainer / one-off
 * path because the shoot needs in-person coordination. Specifically:
 *
 *   • Phone is REQUIRED (we'll call/WhatsApp within hours of inquiry).
 *   • No Razorpay charge at this stage — scope + pricing confirmed on call.
 *   • Lands in Asana Sales Pipeline → "Discovery Call Booked" with a
 *     `[PUNE]` prefix so production sees the in-person nature at a glance.
 *   • Pings the dedicated #pune-onsite Slack channel (configured via
 *     SLACK_WEBHOOK_PUNE; falls back to firehose if unset).
 *
 * Required body fields:  fullName, email, phone, preferredDates
 * Optional body fields:  pkg, bestTimeToCall, notes
 */
export async function POST(req: Request) {
  // Block curl-loop spam — 6 hits per minute per IP is well above any
  // legitimate human filling a form, and below the threshold where a bot
  // could flood Asana + Slack + email.
  if (!rateLimit(req, 'pune-inquiry', 6, 60_000)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Try again in a minute.' },
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const {
      fullName, email, phone, pkg, preferredDates, bestTimeToCall, notes,
    } = body ?? {};

    // ── Required-field validation ──────────────────────────────
    if (!fullName || !email || !phone || !preferredDates) {
      return NextResponse.json(
        { ok: false, error: 'fullName, email, phone and preferredDates are required for Pune inquiries' },
        { status: 400 },
      );
    }

    // ── 1. Asana ── Sales Pipeline · Discovery Call Booked ────────
    // Title leads with the action verb so it's unmissable in the board
    // view: "📞 Call {Name}". Followers come from ASANA_PUNE_TEAM_FOLLOWERS
    // (comma-separated emails) so all three of us get pinged the moment
    // the task lands — once Aiman + Shaurya are invited to the workspace,
    // their emails go in that env var and tagging just works.
    const cleanPkg = (pkg ?? 'Pune onsite').replace(/\s*\([^)]+\)\s*/g, '').trim();
    const asanaTask = await createLead({
      fullName,
      email,
      phone,
      serviceInterest: pkg || 'Pune onsite (no package)',
      source: 'Pune · onsite form',
      followers: process.env.ASANA_PUNE_TEAM_FOLLOWERS,
      titleOverride: `📞 Call ${fullName} · Pune onsite · ${cleanPkg}`,
      notes: [
        `📍 PUNE ONSITE INQUIRY — ACTION: CALL THIS LEAD`,
        '',
        `Package interest: ${pkg ?? 'not specified'}`,
        `Preferred shoot dates: ${preferredDates}`,
        bestTimeToCall ? `Best time to call: ${bestTimeToCall}` : null,
        '',
        notes ? `Notes from prospect:\n${notes}` : null,
        '',
        '———',
        'NEXT STEP: WhatsApp or call within 4 work hours to confirm shoot scope, location, and final price. Then move card to Closed Won.',
      ].filter(Boolean).join('\n'),
    });

    // ── 2. Slack — #pune-onsite ───────────────────────────────
    await postToSlack({
      text: `📍 New Pune onsite inquiry — ${fullName} (${pkg ?? 'no pkg'})`,
      channel: 'pune',
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: '📍 New Pune Onsite Inquiry', emoji: true } },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: [
              `*Name:* ${fullName}`,
              `*Email:* ${email}`,
              `*Phone:* ${phone}  _(call them, they expect it within 4h)_`,
              `*Package:* ${pkg ?? '—'}`,
              `*Preferred shoot dates:* ${preferredDates}`,
              bestTimeToCall ? `*Best time to call:* ${bestTimeToCall}` : null,
              notes ? `\n*Notes:* ${notes}` : null,
            ].filter(Boolean).join('\n'),
          },
        },
        ...(asanaTask ? [{
          type: 'actions' as const,
          elements: [{
            type: 'button' as const,
            text: { type: 'plain_text' as const, text: 'Open in Asana' },
            url: asanaTask.permalink_url,
            style: 'primary' as const,
          }],
        }] : []),
        { type: 'context', elements: [{ type: 'mrkdwn' as const, text: `Lakshya/Aiman: pick this up and call within 4 work hours · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}` }] },
      ],
    });

    // ── 3. Confirmation email to the prospect ──────────────────
    // Right now this is a no-op stub that logs the intended send. When
    // RESEND_API_KEY (or POSTMARK/MAILGUN) lands in .env.local, the same
    // call will actually deliver. See lib/email.ts for the wire-up.
    await sendEmail({
      ...buildPuneInquiryConfirmation({
        fullName, pkg: pkg ?? 'Pune onsite', preferredDates,
        bestTimeToCall, phone,
      }),
      to: email,
    });

    return NextResponse.json({ ok: true, asanaUrl: asanaTask?.permalink_url ?? null });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[/api/pune-inquiry] failed:', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
