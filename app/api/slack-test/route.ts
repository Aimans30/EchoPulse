import { NextResponse } from 'next/server';
import { postToSlack, buildOrderMessage, buildLeadMessage } from '@/lib/slack';

/**
 * Local test endpoint for the Slack integration.
 *
 *   curl http://localhost:3000/api/slack-test           → simple text
 *   curl http://localhost:3000/api/slack-test?type=order
 *   curl http://localhost:3000/api/slack-test?type=lead
 *
 * Remove this route before deploying to production.
 */
export async function GET(req: Request) {
  // ── Production gate ──────────────────────────────────────────────
  // Posts to Slack on every call. Without this, anyone can curl the
  // route from production and flood #all-echopulse-media. In prod the
  // token must match SLACK_TEST_TOKEN env var; otherwise return 404.
  if (process.env.NODE_ENV === 'production') {
    const token = new URL(req.url).searchParams.get('token');
    if (!process.env.SLACK_TEST_TOKEN || token !== process.env.SLACK_TEST_TOKEN) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }
  }

  const url = new URL(req.url);
  const type = url.searchParams.get('type');

  if (!process.env.SLACK_WEBHOOK_URL) {
    return NextResponse.json(
      { ok: false, error: 'SLACK_WEBHOOK_URL not set in .env.local' },
      { status: 500 },
    );
  }

  let opts;
  if (type === 'order') {
    opts = buildOrderMessage({
      fullName: 'Test Client',
      email: 'test@example.com',
      phone: '+91 9XXXX XXXXX',
      service: 'Reels',
      tier: 'Signature',
      total: '₹4,999',
      fileLink: 'https://drive.google.com/test',
    });
  } else if (type === 'lead') {
    opts = buildLeadMessage({
      fullName: 'Test Lead',
      email: 'lead@example.com',
      source: 'Cal.com booking',
      notes: 'Wants help with LinkedIn content for a B2B SaaS',
    });
  } else {
    opts = { text: ':rocket: EchoPulse Slack integration is live — this is a test message.' };
  }

  const ok = await postToSlack(opts);
  return NextResponse.json({ ok, posted: opts });
}
