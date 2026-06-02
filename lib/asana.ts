import 'server-only';

/**
 * Asana CRM helper.
 *
 * Server-only because ASANA_TOKEN is a credential. Never import from a
 * client component — even with `'use server'` we want this to error
 * loudly if it's reached client-side.
 *
 * Every site event that should land in the CRM flows through here:
 *   • /api/lead         → createLead()
 *   • /api/checkout     → createOrder()
 *   • /api/subscription → createRetainerClient() + createProfileCard()
 *   • Anything internal → createInternalTask()
 *
 * Free-tier note: Asana Free has no custom fields and no rules. We encode
 * everything in the task NAME (status flags, tier, amount), section
 * placement (lifecycle stage), and subtasks (transcripts, links, notes).
 * The 48-hour delivery clock for orders uses Asana's native due_at, which
 * IS available on Free — Asana shows overdue badges automatically.
 */

const ASANA_API = 'https://app.asana.com/api/1.0';

/**
 * Resolve an Asana GID from env, returning null + logging a warning if it's
 * missing. Replaces the bare `process.env.X!` non-null asserts that used to
 * litter this file — those silently produced `projects: [undefined]` payloads
 * which Asana rejects with 400, AND the createAsanaTask() catch swallowed the
 * error so the caller saw `ok: true` with `permalink: null` and no clue why.
 *
 * Now: missing env → console.warn once + return null all the way up the call
 * chain. Vercel logs make the misconfiguration obvious.
 */
const warnedKeys = new Set<string>();
function gid(envKey: string): string | null {
  const v = process.env[envKey];
  if (!v) {
    if (!warnedKeys.has(envKey)) {
      // eslint-disable-next-line no-console
      console.warn(`[asana] env var ${envKey} is missing — task will not be created. Set it in .env.local (dev) or Vercel project settings (prod).`);
      warnedKeys.add(envKey);
    }
    return null;
  }
  return v;
}

interface AsanaTaskInput {
  /** Project GID to drop the task into (required). */
  projectId: string;
  /** Section GID inside that project (optional but recommended). */
  sectionId?: string;
  /** Task title — keep it self-describing; sections can't carry data on Free tier. */
  name: string;
  /** Plain-text description body. Prefer this over htmlNotes for simplicity. */
  notes?: string;
  /** Due date (YYYY-MM-DD). For end-of-day deadlines. */
  dueOn?: string;
  /** Precise deadline (ISO 8601). Use this for the 48-hour order clock. */
  dueAt?: string;
  /** Assignee — pass an email, GID, or 'me' (the token owner). */
  assignee?: string;
  /** Followers — comma-separated emails/GIDs. */
  followers?: string;
}

interface AsanaResponse<T> {
  data: T;
}

interface AsanaTask {
  gid: string;
  name: string;
  permalink_url: string;
}

/**
 * Create a task in Asana. Returns the created task (with permalink_url
 * so you can deep-link from Slack) or null on any error. Never throws —
 * the caller can safely await this without try/catch.
 */
export async function createAsanaTask(input: AsanaTaskInput): Promise<AsanaTask | null> {
  const token = process.env.ASANA_TOKEN;
  if (!token) {
    // eslint-disable-next-line no-console
    console.warn('[asana] ASANA_TOKEN not set — skipping task creation');
    return null;
  }
  // Guard against the helper having resolved an empty projectId via gid().
  // The previous behaviour was to POST { projects: [undefined] } which Asana
  // 400s and the caller sees a silent null, with no clear root cause.
  if (!input.projectId) {
    // eslint-disable-next-line no-console
    console.warn('[asana] createAsanaTask called with empty projectId — env var missing? skipping');
    return null;
  }

  const body: Record<string, unknown> = {
    data: {
      name: input.name,
      projects: [input.projectId],
      ...(input.sectionId ? { memberships: [{ project: input.projectId, section: input.sectionId }] } : {}),
      ...(input.notes ? { notes: input.notes } : {}),
      ...(input.dueOn ? { due_on: input.dueOn } : {}),
      ...(input.dueAt ? { due_at: input.dueAt } : {}),
      ...(input.assignee ? { assignee: input.assignee } : {}),
      ...(input.followers ? { followers: input.followers.split(',').map((s) => s.trim()) } : {}),
    },
  };

  try {
    const res = await fetch(`${ASANA_API}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error('[asana] task create failed:', res.status, await res.text().catch(() => ''));
      return null;
    }
    const json = (await res.json()) as AsanaResponse<AsanaTask>;
    return json.data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[asana] task create threw:', err);
    return null;
  }
}

/**
 * Add a subtask under a parent task. Use for: transcripts, brand assets,
 * notes, decision history — anything you want nested under a profile card.
 */
export async function addAsanaSubtask(parentTaskId: string, name: string, notes?: string): Promise<AsanaTask | null> {
  const token = process.env.ASANA_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(`${ASANA_API}/tasks/${parentTaskId}/subtasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { name, ...(notes ? { notes } : {}) } }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as AsanaResponse<AsanaTask>;
    return json.data;
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────────
// HIGH-LEVEL HELPERS — one per site workflow
// ────────────────────────────────────────────────────────────────

/**
 * New lead from Cal.com booking or /api/lead. Lands in Sales Pipeline ·
 * "New Lead" with the source baked into the title.
 *
 * Title format: "Name · Company · Service · Source"
 */
export async function createLead(args: {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  source: 'Cal.com' | 'Contact form' | 'WhatsApp' | 'DM' | 'Referral' | string;
  notes?: string;
  /** Comma-separated emails/GIDs to tag as followers on the task. */
  followers?: string;
  /** Override the auto-generated title (used by Pune flow to make it actionable: "📞 Call ..."). */
  titleOverride?: string;
}): Promise<AsanaTask | null> {
  const titleParts = [
    args.fullName,
    args.company,
    args.serviceInterest,
    args.source,
  ].filter(Boolean);

  const notesBody = [
    `Email: ${args.email}`,
    args.phone ? `Phone: ${args.phone}` : null,
    args.company ? `Company: ${args.company}` : null,
    args.serviceInterest ? `Service interest: ${args.serviceInterest}` : null,
    `Source: ${args.source}`,
    '',
    args.notes ?? '',
  ].filter(Boolean).join('\n');

  return createAsanaTask({
    projectId: gid('ASANA_SALES_PROJECT_GID') ?? '',
    sectionId: gid('ASANA_SEC_SALES_NEW_LEAD') ?? undefined,
    name: args.titleOverride ?? titleParts.join(' · '),
    notes: notesBody,
    followers: args.followers,
  });
}

/**
 * New one-off order from /api/checkout (or /api/razorpay/verify after a
 * successful payment). Lands in One-Off Orders · "New Order" with due_at
 * computed from the per-service delivery promise:
 *   Reels      → 48h
 *   Longform   → 72h (Essential/Signature) or 120h (Elite)
 *   Podcast    → 96h
 *   Repurpose  → 72h
 * Asana shows the overdue badge automatically the moment that clock expires.
 *
 * Title format: "[T-Xh] Service · Tier · Client · ₹Amount"  (h ≤ 72)
 *           or: "[T-Xd] Service · Tier · Client · ₹Amount"  (otherwise)
 */
export async function createOrder(args: {
  fullName: string;
  email: string;
  phone?: string;
  service: string;
  tier?: string;
  total: string;
  fileLink?: string;
  /** Delivery promise in HOURS. Defaults to 48 if omitted (back-compat). */
  deliveryHours?: number;
}): Promise<AsanaTask | null> {
  const hours = args.deliveryHours && args.deliveryHours > 0 ? args.deliveryHours : 48;
  const dueAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  const promiseLabel = hours < 72 ? `${hours}h` : `${Math.round(hours / 24)}d`;
  const dueCopy = hours < 72 ? `${hours} hours from order` : `${Math.round(hours / 24)} days from order`;

  const titleParts = [
    `[T-${promiseLabel}]`,
    args.service,
    args.tier,
    args.fullName,
    args.total,
  ].filter(Boolean);

  const notesBody = [
    `🕒 Due: ${new Date(dueAt).toLocaleString()}  (${dueCopy})`,
    '',
    `Client: ${args.fullName}`,
    `Email: ${args.email}`,
    args.phone ? `Phone: ${args.phone}` : null,
    '',
    `Service: ${args.service}${args.tier ? ` — ${args.tier}` : ''}`,
    `Total: ${args.total}`,
    args.fileLink ? `Assets: ${args.fileLink}` : null,
  ].filter(Boolean).join('\n');

  return createAsanaTask({
    projectId: gid('ASANA_ORDER_PROJECT_GID') ?? '',
    sectionId: gid('ASANA_SEC_ORDER_NEW') ?? undefined,
    name: titleParts.join(' · '),
    notes: notesBody,
    dueAt,
    // Auto-tag the team on every new order. Set in .env.local:
    //   ASANA_ORDER_FOLLOWERS=lakshya@..., aiman@..., shaurya@...
    // so all three of us get a notification the second a card lands. Same
    // pattern Pune-inquiry already uses.
    followers: process.env.ASANA_ORDER_FOLLOWERS,
  });
}

/**
 * New retainer client from Stripe/Razorpay subscription webhook. Creates
 * BOTH the lifecycle card (Retainer Pipeline) AND the profile card
 * (Profile Cards). Returns both GIDs so the caller can ping Slack with
 * deep links.
 *
 * Retainer title:  "Client · Tier · Renews YYYY-MM-DD"
 * Profile title:   "Client · Tier"
 */
export async function createRetainerClient(args: {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  tier: 'Pilot' | 'Growth' | 'Full Studio' | string;
  monthlyAmount: string;
  renewsOn: string;            // YYYY-MM-DD
  paymentMethod?: 'Razorpay' | 'Stripe';
}): Promise<{ retainer: AsanaTask | null; profile: AsanaTask | null }> {
  const retainerName = `${args.fullName} · ${args.tier} · Renews ${args.renewsOn}`;
  const profileName = `${args.fullName} · ${args.tier}`;

  const sharedNotes = [
    `Client: ${args.fullName}`,
    `Email: ${args.email}`,
    args.phone ? `Phone: ${args.phone}` : null,
    args.company ? `Company: ${args.company}` : null,
    '',
    `Tier: ${args.tier}`,
    `MRR: ${args.monthlyAmount}`,
    `Renews: ${args.renewsOn}`,
    args.paymentMethod ? `Payment: ${args.paymentMethod}` : null,
  ].filter(Boolean).join('\n');

  const [retainer, profile] = await Promise.all([
    createAsanaTask({
      projectId: gid('ASANA_RETAINER_PROJECT_GID') ?? '',
      sectionId: gid('ASANA_SEC_RETAINER_ONBOARDING_PENDING') ?? undefined,
      name: retainerName,
      notes: sharedNotes,
      dueOn: args.renewsOn,
    }),
    createAsanaTask({
      projectId: gid('ASANA_PROFILE_PROJECT_GID') ?? '',
      sectionId: gid('ASANA_SEC_PROFILE_ACTIVE') ?? undefined,
      name: profileName,
      notes: sharedNotes,
    }),
  ]);

  // Wire up standard profile-card subtasks so the structure is consistent.
  if (profile) {
    await Promise.all([
      addAsanaSubtask(profile.gid, '📞 Meeting transcripts'),
      addAsanaSubtask(profile.gid, '🎨 Brand assets (logo, fonts, colors)'),
      addAsanaSubtask(profile.gid, '🔗 Important links'),
      addAsanaSubtask(profile.gid, '📝 Internal notes & decisions'),
      addAsanaSubtask(profile.gid, '💬 Feedback history'),
    ]);
  }

  return { retainer, profile };
}

/**
 * Drop an internal task on a teammate's plate. Lands in Internal · Backlog.
 */
export async function createInternalTask(args: {
  title: string;
  assignee: string; // email or GID
  dueOn?: string;
  notes?: string;
}): Promise<AsanaTask | null> {
  return createAsanaTask({
    projectId: gid('ASANA_INTERNAL_PROJECT_GID') ?? '',
    sectionId: gid('ASANA_SEC_INTERNAL_BACKLOG') ?? undefined,
    name: args.title,
    assignee: args.assignee,
    dueOn: args.dueOn,
    notes: args.notes,
  });
}

/**
 * Schedule a renewal reminder 15 days before the actual renewal date.
 * Calendar view of Renewals & Churn Watch shows the upcoming wave.
 */
export async function createRenewalReminder(args: {
  clientName: string;
  tier: string;
  renewsOn: string; // YYYY-MM-DD
}): Promise<AsanaTask | null> {
  // 15 days before the renewal
  const renew = new Date(args.renewsOn + 'T00:00:00Z');
  const reminderAt = new Date(renew.getTime() - 15 * 24 * 60 * 60 * 1000);
  const dueOn = reminderAt.toISOString().slice(0, 10);

  return createAsanaTask({
    projectId: gid('ASANA_RENEWALS_PROJECT_GID') ?? '',
    name: `Follow up · ${args.clientName} · ${args.tier} — renews ${args.renewsOn}`,
    notes: `Reach out 15 days before renewal. Confirm scope for next cycle, check satisfaction, surface upsell.`,
    dueOn,
  });
}
