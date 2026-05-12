/**
 * Lead-magnet endpoint — stub.
 *
 * Logs the email + source to server console for now.
 * TODO: replace the body of POST() with a real ESP integration:
 *   • MailerLite: https://developers.mailerlite.com (POST /subscribers)
 *   • ConvertKit: https://developer.convertkit.com (POST /forms/:id/subscribe)
 *   • Beehiiv:   https://developers.beehiiv.com (POST /publications/:id/subscriptions)
 *
 * Add the API key to .env.local under MAILERLITE_API_KEY (or equivalent),
 * then uncomment one of the integration blocks below.
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const email = (body.email ?? '').trim();
  const source = (body.source ?? 'unknown').trim();

  // Basic format guard — full RFC validation isn't worth the bytes
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  // ── STUB ──────────────────────────────────────────────────────
  // eslint-disable-next-line no-console
  console.log('[lead-magnet]', { email, source, ts: new Date().toISOString() });
  // ──────────────────────────────────────────────────────────────

  // ── ESP INTEGRATION (uncomment + fill when ready) ────────────
  // const apiKey = process.env.MAILERLITE_API_KEY;
  // if (apiKey) {
  //   await fetch('https://connect.mailerlite.com/api/subscribers', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${apiKey}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       email,
  //       fields: { source },
  //       groups: ['linkedin_playbook'],
  //     }),
  //   });
  // }
  // ──────────────────────────────────────────────────────────────

  return NextResponse.json({ ok: true });
}
