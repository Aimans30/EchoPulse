import { NextResponse } from 'next/server';
import { createLead } from '@/lib/asana';
import { postToSlack, buildLeadMessage } from '@/lib/slack';
import { rateLimit } from '@/lib/rateLimit';

/**
 * Generic lead-capture endpoint.
 *
 * Wire any lead-magnet form, newsletter signup, or "talk to us" form on
 * the site to POST here. The handler:
 *   1. Creates a card in Asana → Sales Pipeline · New Lead
 *   2. Pings Slack → #leads (with Asana deep-link in the message)
 *   3. Returns { ok: true, asanaUrl } so the client can show success state
 *
 * Required body fields:  fullName, email, source
 * Optional body fields:  phone, company, serviceInterest, notes
 *
 * Source values to use:
 *   "Contact form" | "Lead magnet" | "Cal.com" | "WhatsApp" | "DM" |
 *   "Referral" | "Cold outbound reply" | "Footer newsletter"
 */
export async function POST(req: Request) {
  if (!rateLimit(req, 'lead', 6, 60_000)) {
    return NextResponse.json({ ok: false, error: 'too_many_requests' }, { status: 429 });
  }
  try {
    const body = await req.json();
    const { fullName, email, phone, company, serviceInterest, source, notes } = body ?? {};

    if (!fullName || !email || !source) {
      return NextResponse.json(
        { ok: false, error: 'fullName, email and source are required' },
        { status: 400 },
      );
    }

    // 1. Asana card (Sales Pipeline · New Lead)
    const asanaTask = await createLead({
      fullName, email, phone, company, serviceInterest, source, notes,
    });

    // 2. Slack ping (#leads channel — falls back to firehose)
    await postToSlack(
      buildLeadMessage({
        fullName, email, source,
        notes: notes ?? `${serviceInterest ? `Interest: ${serviceInterest}` : ''}${company ? ` · Company: ${company}` : ''}`,
        asanaTaskUrl: asanaTask?.permalink_url,
      }),
    );

    return NextResponse.json({
      ok: true,
      asanaUrl: asanaTask?.permalink_url ?? null,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[/api/lead] failed:', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
