import 'server-only';

/**
 * Email helper — stub for future confirmation emails.
 *
 * Right now this is a no-op that logs intent and returns true. When you're
 * ready to actually send emails, plug in your provider here:
 *
 *   • Resend          (https://resend.com) — recommended, simplest API
 *   • Postmark        (https://postmarkapp.com) — best deliverability
 *   • Mailgun         (https://mailgun.com) — most flexible
 *   • Amazon SES      (cheapest at scale, more setup)
 *
 * Recommended provider: Resend. Setup:
 *   1. Sign up at resend.com, verify your domain (echopulse.media)
 *   2. Add RESEND_API_KEY to .env.local
 *   3. Replace the no-op in sendEmail() with a fetch to Resend's API
 *
 * The Pune inquiry and Razorpay verify endpoints already call sendEmail()
 * with the right payload — flipping the implementation will just work.
 */

interface SendEmailOptions {
  /** Recipient email address. */
  to: string;
  /** Subject line. */
  subject: string;
  /** Plain-text fallback (always include for deliverability). */
  text: string;
  /** Optional HTML body. */
  html?: string;
  /** Optional friendly sender name. Defaults to "Lakshya at EchoPulse". */
  fromName?: string;
  /** Optional reply-to. Defaults to lakshya@echopulse.media. */
  replyTo?: string;
}

const FROM_EMAIL = 'lakshya@echopulse.media';
const FROM_NAME_DEFAULT = 'Lakshya · EchoPulse';

/**
 * Send an email. Returns true on success, false on any failure. Never
 * throws — callers can safely fire-and-forget.
 *
 * CURRENT BEHAVIOR (stub): logs the intended send to console and returns
 * true. The downstream caller proceeds as if the email was sent so the
 * rest of the pipeline (Asana + Slack) isn't blocked.
 *
 * TO ACTIVATE: replace the stub body with your provider's fetch call.
 * Example with Resend:
 *
 *   const res = await fetch('https://api.resend.com/emails', {
 *     method: 'POST',
 *     headers: {
 *       Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({
 *       from: `${opts.fromName ?? FROM_NAME_DEFAULT} <${FROM_EMAIL}>`,
 *       to: opts.to,
 *       reply_to: opts.replyTo ?? FROM_EMAIL,
 *       subject: opts.subject,
 *       text: opts.text,
 *       html: opts.html,
 *     }),
 *   });
 *   return res.ok;
 */
export async function sendEmail(opts: SendEmailOptions): Promise<boolean> {
  // Provider not wired yet — stub mode.
  if (!process.env.RESEND_API_KEY && !process.env.POSTMARK_API_KEY && !process.env.MAILGUN_API_KEY) {
    // eslint-disable-next-line no-console
    console.log('[email] (stub) would send:', {
      to: opts.to,
      subject: opts.subject,
      from: `${opts.fromName ?? FROM_NAME_DEFAULT} <${FROM_EMAIL}>`,
    });
    return true;
  }

  // ── Resend path ───────────────────────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${opts.fromName ?? FROM_NAME_DEFAULT} <${FROM_EMAIL}>`,
          to: opts.to,
          reply_to: opts.replyTo ?? FROM_EMAIL,
          subject: opts.subject,
          text: opts.text,
          html: opts.html,
        }),
      });
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error('[email] resend send failed:', res.status, await res.text().catch(() => ''));
        return false;
      }
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[email] resend send threw:', err);
      return false;
    }
  }

  // TODO: Postmark/Mailgun paths — wire when needed
  return false;
}

// ── Templates ─────────────────────────────────────────────────────────
// Single source of truth for transactional copy. Edit here, callers pick up.

/** Pune inquiry confirmation — sent the moment the form submits. */
export function buildPuneInquiryConfirmation(args: {
  fullName: string;
  pkg: string;
  preferredDates: string;
  bestTimeToCall?: string;
  phone: string;
}): SendEmailOptions {
  const firstName = args.fullName.split(' ')[0] || args.fullName;
  return {
    to: '', // caller fills
    subject: `${firstName}, we got your Pune shoot inquiry`,
    text: `Hey ${firstName},

Lakshya here from EchoPulse Media. Your Pune onsite shoot inquiry is in.

Here's what we have:
• Package interest: ${args.pkg}
• Preferred shoot dates: ${args.preferredDates}
${args.bestTimeToCall ? `• Best time to call: ${args.bestTimeToCall}\n` : ''}
What happens next:
1. WhatsApp ping from me within 4 work hours
2. 15-min call to confirm location, date, scope
3. Razorpay link sent once we agree the price

Anything urgent? WhatsApp me directly: ${args.phone} (yes I'll text you, you can save my number)

— Lakshya
EchoPulse Media · Pune onsite
`,
  };
}

/** Order confirmation — sent after Razorpay payment succeeds. */
export function buildOrderConfirmation(args: {
  fullName: string;
  service: string;
  total: string;
  deliveryHours: number;
}): SendEmailOptions {
  const firstName = args.fullName.split(' ')[0] || args.fullName;
  const deliveryLabel = args.deliveryHours < 72 ? `${args.deliveryHours} hours` : `${Math.round(args.deliveryHours / 24)} days`;
  return {
    to: '',
    subject: `${firstName}, your EchoPulse order is in production`,
    text: `Hey ${firstName},

Your order is locked in.

• Service: ${args.service}
• Total: ${args.total}
• Delivery: ${deliveryLabel} from now

Watch for the first deliverable in your inbox within ${deliveryLabel}. Reply to this email anytime — it comes straight to me.

— Lakshya
EchoPulse Media
`,
  };
}
