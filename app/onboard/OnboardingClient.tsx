'use client';

import { useEffect, useState } from 'react';

/**
 * Post-checkout kickoff page.
 *
 * Where every client lands the moment they submit an order or sign a
 * retainer. The page does three jobs:
 *
 *   1. CONFIRM — "you're in, here's what happens next"
 *   2. SET EXPECTATIONS — the 48-hour clock starts now / kickoff call in 24h
 *   3. CAPTURE THE BRIEF — niche, ICP, tone, assets, goals
 *
 * Submitting fires /api/onboard which creates a kickoff card in Asana
 * Profile Cards with the brief answers as subtasks and pings Slack #ops.
 */
export default function OnboardingClient() {
  const [step, setStep] = useState<'welcome' | 'brief' | 'done'>('welcome');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asanaUrl, setAsanaUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    niche: '',
    icp: '',
    tone: '',
    goals: '',
    brandAssets: '',
    references: '',
    handles: '',
    notes: '',
  });

  // Try to read the Asana order link from ?asana= so we can show the
  // client "you can see your order being tracked here".
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const asana = params.get('asana');
    if (asana) setAsanaUrl(decodeURIComponent(asana));
  }, []);

  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canSubmit = form.fullName.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.niche.trim().length > 1;

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Submission failed.');
      setStep('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setSubmitting(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg, #F7F4ED)',
      color: 'var(--ink, #0C0C0B)',
      padding: '64px 20px',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 720 }}>

        {step === 'welcome' && (
          <section style={{ animation: 'fadeIn 0.6s ease both' }}>
            <div style={{
              fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--accent, #FF5A1F)', marginBottom: 24,
            }}>
              ✓ Order received
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
              You&rsquo;re in.<br />The 48-hour clock starts now.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, opacity: 0.78, margin: '0 0 32px' }}>
              Production starts the moment you submit the kickoff brief below. We&rsquo;ll send the
              first draft directly to your email within 48 hours. Most clients get same-day replies
              from me personally to every message.
            </p>

            <div style={{
              background: '#fff',
              border: '1px solid rgba(12,12,11,0.08)',
              borderRadius: 16,
              padding: 24,
              margin: '0 0 32px',
            }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>What happens next</div>
              <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                <li>Fill the kickoff brief (3 minutes)</li>
                <li>You get a confirmation email + WhatsApp ping from me</li>
                <li>We deliver draft 1 within 48 hours</li>
                <li>Two rounds of revisions included &mdash; we redo until it&rsquo;s right</li>
              </ol>
            </div>

            {asanaUrl && (
              <div style={{ fontSize: 14, opacity: 0.6, marginBottom: 32 }}>
                Your order is tracked here: <a href={asanaUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent, #FF5A1F)' }}>open in Asana</a>
              </div>
            )}

            <button
              onClick={() => setStep('brief')}
              style={{
                background: 'var(--ink, #0C0C0B)',
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                padding: '16px 32px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 48,
              }}
            >
              Start the kickoff brief →
            </button>
          </section>
        )}

        {step === 'brief' && (
          <section style={{ animation: 'fadeIn 0.6s ease both' }}>
            <div style={{ fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent, #FF5A1F)', marginBottom: 12 }}>
              Step 2 of 2 · Kickoff brief
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 40px)', lineHeight: 1.1, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Tell us about you.
            </h2>
            <p style={{ fontSize: 16, opacity: 0.7, marginBottom: 32 }}>
              Three minutes. Everything below goes straight into your project file. Required fields marked <span style={{ color: 'var(--accent, #FF5A1F)' }}>*</span>.
            </p>

            <div style={{ display: 'grid', gap: 18 }}>
              <Field label="Full name *" value={form.fullName} onChange={(v) => set('fullName', v)} />
              <Field label="Email *" type="email" value={form.email} onChange={(v) => set('email', v)} />
              <Field
                label="Your niche / industry *"
                placeholder="e.g. B2B SaaS · Real estate · DTC skincare"
                value={form.niche}
                onChange={(v) => set('niche', v)}
              />
              <Field
                label="Who&rsquo;s the audience?"
                placeholder="VPs of marketing at Series B SaaS companies, etc."
                value={form.icp}
                onChange={(v) => set('icp', v)}
                textarea
              />
              <Field
                label="Tone of voice"
                placeholder="Sharp + analytical · Warm + founder-led · Bold + provocative · etc."
                value={form.tone}
                onChange={(v) => set('tone', v)}
              />
              <Field
                label="What does winning look like in 30 days?"
                placeholder="1,000 followers · 50 booked demos · 1 viral reel · etc."
                value={form.goals}
                onChange={(v) => set('goals', v)}
                textarea
              />
              <Field
                label="Brand assets — drop a Drive/Dropbox link"
                placeholder="Logo, fonts, colors, brand book (or write &lsquo;none yet&rsquo;)"
                value={form.brandAssets}
                onChange={(v) => set('brandAssets', v)}
              />
              <Field
                label="3 accounts you love (we&rsquo;ll use as taste reference)"
                placeholder="@handle1, @handle2, @handle3"
                value={form.references}
                onChange={(v) => set('references', v)}
              />
              <Field
                label="Your social handles"
                placeholder="@yourhandle · LinkedIn URL · YouTube channel"
                value={form.handles}
                onChange={(v) => set('handles', v)}
              />
              <Field
                label="Anything else we should know?"
                placeholder="Constraints, gotchas, brand mandates, fears, anything."
                value={form.notes}
                onChange={(v) => set('notes', v)}
                textarea
              />
            </div>

            {error && (
              <div style={{ color: '#B33A3A', marginTop: 20, fontSize: 14 }}>{error}</div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button
                onClick={() => setStep('welcome')}
                disabled={submitting}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(12,12,11,0.18)',
                  borderRadius: 999,
                  padding: '14px 24px',
                  fontSize: 15,
                  cursor: 'pointer',
                  minHeight: 48,
                  color: 'inherit',
                }}
              >
                ← Back
              </button>
              <button
                onClick={submit}
                disabled={!canSubmit || submitting}
                style={{
                  background: canSubmit ? 'var(--ink, #0C0C0B)' : 'rgba(12,12,11,0.25)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 999,
                  padding: '14px 32px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  minHeight: 48,
                  flex: 1,
                }}
              >
                {submitting ? 'Sending brief…' : 'Send brief & start production →'}
              </button>
            </div>
          </section>
        )}

        {step === 'done' && (
          <section style={{ animation: 'fadeIn 0.6s ease both', textAlign: 'center', paddingTop: 64 }}>
            <div style={{ fontSize: 56, marginBottom: 24 }}>✓</div>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.05, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Brief is in.<br />Production starts now.
            </h2>
            <p style={{ fontSize: 17, opacity: 0.75, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.55 }}>
              You&rsquo;ll get an email + WhatsApp ping from me within the hour confirming everything.
              Draft 1 lands within 48 hours. Replies happen within 3 hours during work days.
            </p>
            <a
              href="/"
              style={{
                display: 'inline-block',
                background: 'var(--ink, #0C0C0B)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 999,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Back to EchoPulse
            </a>
          </section>
        )}

        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          input:focus, textarea:focus { outline: 2px solid var(--accent, #FF5A1F); outline-offset: 2px; }
        `}</style>
      </div>
    </main>
  );
}

// ── Field — minimal labeled input ─────────────────────────────────────────
function Field({
  label, value, onChange, placeholder, type = 'text', textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, opacity: 0.85 }}
        dangerouslySetInnerHTML={{ __html: label }} />
      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          style={inputStyle}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  fontSize: 16,
  borderRadius: 10,
  border: '1px solid rgba(12,12,11,0.16)',
  background: '#fff',
  color: 'var(--ink, #0C0C0B)',
  fontFamily: 'inherit',
  resize: 'vertical' as const,
  minHeight: 48,
};
