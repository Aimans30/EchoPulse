'use client';

import { useId, useState } from 'react';
import { trackLeadMagnetSubmit } from '@/lib/analytics';
import { getAttribution } from '@/lib/attribution';

const SOURCE = 'lead_magnet_offcut';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email signup on /resources/offcut: release and update notices for Offcut.
 * Posts to /api/lead like ShotListCapture, so it lands in Slack and email.
 * `ready` switches the copy between "tell me when it is out" and "send me
 * updates".
 */
export default function OffcutUpdatesCapture({ ready }: { ready: boolean }) {
  const uid = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === 'submitting') return;
    const v = email.trim();
    if (!EMAIL_RE.test(v)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Offcut signup',
          email: v,
          source: SOURCE,
          serviceInterest: 'Offcut (free Windows tool)',
          notes: ready ? 'Asked for Offcut update emails.' : 'Asked to be told when Offcut is available to download.',
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error('submit failed');
      trackLeadMagnetSubmit(SOURCE);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const inputId = `${uid}-email`;
  const errId = `${uid}-err`;

  return (
    <section className="slc" aria-labelledby={`${uid}-h`}>
      <h2 id={`${uid}-h`}>{ready ? 'Get an email when Offcut updates' : 'Get an email when Offcut is ready'}</h2>
      <p className="slc-copy">
        {ready
          ? 'New versions and new free tools for editors and creators. A few emails a year at most, and you can ask us to stop at any time.'
          : 'We will email you once, when the download is live. You can ask us to stop at any time.'}
      </p>
      {status === 'sent' ? (
        <p className="slc-ok" role="status">Done. You are on the list.</p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="slc-form">
          <label htmlFor={inputId} className="slc-sr">Email address</label>
          <input
            id={inputId}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            required
          />
          <button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Keep me posted'}
          </button>
        </form>
      )}
      {error && <p className="slc-err" id={errId}>{error}</p>}
      {status === 'error' && (
        <p className="slc-err" role="alert">
          That did not go through. Email <a href="mailto:lakshyasoni2703@gmail.com">lakshyasoni2703@gmail.com</a> and we will add you.
        </p>
      )}
      <style>{`
        /* Sits on the ink closing band of /resources/offcut. Doubled class
           beats the global phone padding on every <section>. */
        .slc.slc { box-sizing: border-box; max-width: 100%; margin: 0; padding: 32px !important; border: 1px solid rgba(242,238,231,0.12); border-radius: 16px; background: rgba(255,255,255,0.03); color: #F2EEE7; font-family: var(--font-inter), Inter, sans-serif; }
        .slc.slc h2 { margin: 0 0 8px; font-size: 24px !important; font-weight: 700; letter-spacing: -0.02em !important; line-height: 1.2 !important; color: #F2EEE7; }
        .slc .slc-copy { margin: 0 0 24px; font-size: 16px !important; line-height: 1.6 !important; color: rgba(242,238,231,0.68); max-width: 520px; }
        .slc-form { display: flex; gap: 8px; flex-wrap: wrap; }
        .slc-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .slc-form input { flex: 1 1 240px; min-width: 0; min-height: 52px; box-sizing: border-box; padding: 12px 20px; font: 400 16px var(--font-inter), Inter, sans-serif; color: #F2EEE7; background: rgba(255,255,255,0.05); border: 1px solid rgba(242,238,231,0.2); border-radius: 999px; transition: border-color .2s ease, background-color .2s ease; }
        .slc-form input:hover { border-color: rgba(242,238,231,0.34); }
        .slc-form input:focus { background: rgba(255,255,255,0.08); }
        .slc-form input::placeholder { color: rgba(242,238,231,0.42); }
        .slc-form input[aria-invalid="true"] { border-color: #FF8A5C; }
        .slc-form button { min-height: 52px; padding: 0 28px; border: none; border-radius: 999px; background: #E8541A; color: #fff; font: 700 16px var(--font-inter), Inter, sans-serif; cursor: pointer; transition: background-color .2s ease; }
        .slc-form button:hover { background: #D14812; }
        .slc-form button:disabled { opacity: 0.65; cursor: progress; }
        .slc-form input:focus-visible, .slc-form button:focus-visible, .slc a:focus-visible { outline: 3px solid #E8541A; outline-offset: 2px; }
        .slc .slc-ok { margin: 0; font-size: 17px; font-weight: 700; }
        .slc .slc-err { margin: 12px 0 0; font-size: 14px; line-height: 1.5; color: #FF8A5C; }
        .slc-err a { color: #F2EEE7; font-weight: 700; overflow-wrap: anywhere; }
        @media (max-width: 480px) { .slc.slc { padding: 24px 20px !important; } .slc-form button { width: 100%; } }
      `}</style>
    </section>
  );
}
