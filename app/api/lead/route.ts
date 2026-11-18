import { NextResponse } from 'next/server';
import { createLead } from '@/lib/asana';
import { postToSlack, buildLeadMessage } from '@/lib/slack';
import { rateLimit } from '@/lib/rateLimit';
import { countryFromHeaders, formatCameFromLine, formatOriginNotes, sanitizeAttribution } from '@/lib/attribution';

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
 * Optional body fields:  phone, company, serviceInterest, notes, attribution
 *
 * `attribution` is the object from getAttribution() in lib/attribution.ts:
 * where the visitor first landed, the referring host, UTM values and the
 * pages seen this visit. It is validated here (known keys, strings only,
 * length caps) and printed as a "Came from" line in Slack and a short block
 * in the Asana notes, together with the visitor's country from the platform's
 * geo header. The IP address is never read, logged or stored by this route.
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
    const attribution = sanitizeAttribution(body?.attribution);
    const country = countryFromHeaders(req.headers);
    const cameFrom = formatCameFromLine(attribution, country);
    const originNotes = formatOriginNotes(attribution, country);

    if (!fullName || !email || !source) {
      return NextResponse.json(
        { ok: false, error: 'fullName, email and source are required' },
        { status: 400 },
      );
    }

    const started = source === 'free_edits_started';
    const leadNotes = started
      ? `Started, not finished: they passed step 1 of the free edits form but have not sent footage yet.${notes ? `\n${notes}` : ''}`
      : notes;

    // 1. Asana card (Sales Pipeline · New Lead)
    const asanaTask = await createLead({
      fullName, email, phone, company, serviceInterest, source, notes: leadNotes, originNotes,
      titleOverride: started ? `${fullName} · 2 free edits · started, not finished` : undefined,
    });

    // 2. Slack ping (#leads channel — falls back to firehose)
    await postToSlack(
      buildLeadMessage({
        fullName, email, source,
        notes: leadNotes ?? `${serviceInterest ? `Interest: ${serviceInterest}` : ''}${company ? ` · Company: ${company}` : ''}`,
        cameFrom,
        asanaTaskUrl: asanaTask?.permalink_url,
        title: started ? '🟡 Free edits started (not finished)' : source === 'free_edits_form' ? '🎬 Free edits request' : source === 'plan_intake' ? '📦 Plan request' : undefined,
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
