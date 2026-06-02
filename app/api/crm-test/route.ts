import { NextResponse } from 'next/server';
import { postToSlack, buildOrderMessage, buildLeadMessage } from '@/lib/slack';
import { createOrder, createLead, createRetainerClient } from '@/lib/asana';

/**
 * End-to-end CRM pipeline test.
 *
 *   curl http://localhost:3000/api/crm-test?type=lead
 *   curl http://localhost:3000/api/crm-test?type=order
 *   curl http://localhost:3000/api/crm-test?type=retainer
 *
 * Each type:
 *   1. Creates the matching task in Asana (Sales Pipeline / One-Off Orders / Retainer Pipeline)
 *   2. Posts the matching alert to Slack (#all-echopulse-media)
 *   3. Returns the Asana permalink so you can verify it landed
 *
 * Use this after setting ASANA_TOKEN to confirm both integrations work
 * before pointing real forms at /api/lead, /api/checkout, etc.
 *
 * Remove this route before deploying to production (or gate it behind
 * a secret query param).
 */
export async function GET(req: Request) {
  // ── Production gate ──────────────────────────────────────────────
  // This route writes to Asana + Slack on every call. Without a gate,
  // anyone could curl it from production and spam your CRM + flood
  // #all-echopulse-media. Two layers of defence:
  //   1. Block any production hit without a matching CRM_TEST_TOKEN
  //   2. Even in dev, optionally require the token if it's set
  if (process.env.NODE_ENV === 'production') {
    const token = new URL(req.url).searchParams.get('token');
    if (!process.env.CRM_TEST_TOKEN || token !== process.env.CRM_TEST_TOKEN) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }
  }

  const url = new URL(req.url);
  const type = url.searchParams.get('type') ?? 'lead';

  // ── Lead path ────────────────────────────────────────────────
  if (type === 'lead') {
    const asanaTask = await createLead({
      fullName: 'Test Lead — CRM Pipeline',
      email: 'test-lead@example.com',
      phone: '+91 9XXXX XXXXX',
      company: 'GreenLeaf SaaS',
      serviceInterest: 'Growth retainer',
      source: 'Cal.com',
      notes: 'This is a /api/crm-test ping — safe to delete.',
    });

    const slackOk = await postToSlack(
      buildLeadMessage({
        fullName: 'Test Lead — CRM Pipeline',
        email: 'test-lead@example.com',
        source: 'Cal.com',
        notes: 'Pipeline smoke test — see Asana for the matching card.',
        asanaTaskUrl: asanaTask?.permalink_url,
      }),
    );

    return NextResponse.json({
      type,
      asana: asanaTask ? { ok: true, url: asanaTask.permalink_url, gid: asanaTask.gid } : { ok: false },
      slack: { ok: slackOk },
    });
  }

  // ── Order path ───────────────────────────────────────────────
  if (type === 'order') {
    const asanaTask = await createOrder({
      fullName: 'Test Client — CRM Pipeline',
      email: 'test-order@example.com',
      phone: '+91 9XXXX XXXXX',
      service: 'Reels',
      tier: 'Signature',
      total: '₹4,999',
      fileLink: 'https://drive.google.com/test',
    });

    const slackOk = await postToSlack(
      buildOrderMessage({
        fullName: 'Test Client — CRM Pipeline',
        email: 'test-order@example.com',
        phone: '+91 9XXXX XXXXX',
        service: 'Reels',
        tier: 'Signature',
        total: '₹4,999',
        fileLink: 'https://drive.google.com/test',
        asanaTaskUrl: asanaTask?.permalink_url,
      }),
    );

    return NextResponse.json({
      type,
      asana: asanaTask ? { ok: true, url: asanaTask.permalink_url, gid: asanaTask.gid } : { ok: false },
      slack: { ok: slackOk },
      note: 'Asana task has due_at = NOW + 48h. Asana will flag it overdue automatically when that clock expires.',
    });
  }

  // ── Retainer path ────────────────────────────────────────────
  if (type === 'retainer') {
    const today = new Date();
    const renews = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
      .toISOString().slice(0, 10);

    const { retainer, profile } = await createRetainerClient({
      fullName: 'Test Retainer — CRM Pipeline',
      email: 'test-retainer@example.com',
      phone: '+91 9XXXX XXXXX',
      company: 'TestCo',
      tier: 'Growth',
      monthlyAmount: '₹24,999',
      renewsOn: renews,
      paymentMethod: 'Razorpay',
    });

    const slackOk = await postToSlack({
      text: `🎉 New retainer signed — Test Retainer (Growth) · ₹24,999/mo · renews ${renews}`,
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: '🎉 New Retainer', emoji: true } },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Client:* Test Retainer\n*Tier:* Growth · ₹24,999/mo\n*Renews:* ${renews}`,
          },
        },
        ...(retainer ? [{
          type: 'actions' as const,
          elements: [{ type: 'button' as const, text: { type: 'plain_text' as const, text: 'Open Pipeline Card' }, url: retainer.permalink_url, style: 'primary' as const }],
        }] : []),
      ],
    });

    return NextResponse.json({
      type,
      asana: {
        retainer: retainer ? { ok: true, url: retainer.permalink_url, gid: retainer.gid } : { ok: false },
        profile: profile ? { ok: true, url: profile.permalink_url, gid: profile.gid } : { ok: false },
      },
      slack: { ok: slackOk },
      note: 'Created BOTH a retainer pipeline card AND a profile card with 5 pre-filled subtasks.',
    });
  }

  return NextResponse.json(
    { ok: false, error: 'Unknown type. Try ?type=lead | ?type=order | ?type=retainer' },
    { status: 400 },
  );
}
