import { NextResponse } from 'next/server';
import { addAsanaSubtask, createAsanaTask } from '@/lib/asana';
import { postToSlack } from '@/lib/slack';

/**
 * Kickoff-brief submission endpoint.
 *
 * Fires when the client fills out the /onboard form after checkout. It:
 *   1. Creates a new "Kickoff Brief — {clientName}" task in Asana
 *      → Profile Cards · Active Clients
 *   2. Adds the brief answers as subtasks (one per question) so the
 *      production team sees a clean checklist
 *   3. Pings Slack #ops so the team knows the brief is in
 *
 * Required body fields:  fullName, email
 * All other fields are stored as subtasks if present.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, ...answers } = body ?? {};

    if (!fullName || !email) {
      return NextResponse.json(
        { ok: false, error: 'fullName and email are required' },
        { status: 400 },
      );
    }

    const briefNotes = [
      `Brief from: ${fullName}  (${email})`,
      '',
      ...Object.entries(answers)
        .filter(([, v]) => v && String(v).trim().length > 0)
        .map(([k, v]) => `${k}: ${String(v)}`),
    ].join('\n');

    // 1. New task in Profile Cards · Active Clients
    const card = await createAsanaTask({
      projectId: process.env.ASANA_PROFILE_PROJECT_GID!,
      sectionId: process.env.ASANA_SEC_PROFILE_ACTIVE,
      name: `Kickoff Brief — ${fullName}`,
      notes: briefNotes,
    });

    // 2. One subtask per answered field so the team has a clean checklist
    if (card) {
      const subtasks = [
        answers.niche ? `🎯 Niche / industry: ${answers.niche}` : null,
        answers.icp ? `👥 ICP / target audience: ${answers.icp}` : null,
        answers.tone ? `🗣️ Tone of voice: ${answers.tone}` : null,
        answers.goals ? `📈 30-day goals: ${answers.goals}` : null,
        answers.brandAssets ? `🎨 Brand assets: ${answers.brandAssets}` : null,
        answers.references ? `🔗 Reference accounts: ${answers.references}` : null,
        answers.handles ? `📱 Their handles: ${answers.handles}` : null,
        answers.notes ? `📝 Anything else: ${answers.notes}` : null,
      ].filter(Boolean) as string[];

      await Promise.all(subtasks.map((t) => addAsanaSubtask(card.gid, t)));
    }

    // 3. Slack ping — to #ops so production sees brief is in
    await postToSlack({
      text: `📋 Kickoff brief received from ${fullName}`,
      channel: 'ops',
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: '📋 Kickoff Brief Received', emoji: true } },
        { type: 'section', text: { type: 'mrkdwn', text: `*From:* ${fullName}\n*Email:* ${email}\n\nProduction can start. Full brief is in the Asana subtasks.` } },
        ...(card ? [{
          type: 'actions' as const,
          elements: [{ type: 'button' as const, text: { type: 'plain_text' as const, text: 'Open Brief in Asana' }, url: card.permalink_url, style: 'primary' as const }],
        }] : []),
      ],
    });

    return NextResponse.json({ ok: true, asanaUrl: card?.permalink_url ?? null });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[/api/onboard] failed:', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
