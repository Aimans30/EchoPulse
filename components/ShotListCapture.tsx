'use client';

import { useId, useState } from 'react';
import { trackLeadMagnetSubmit } from '@/lib/analytics';
import { getAttribution } from '@/lib/attribution';

const SOURCE = 'lead_magnet_listing_shot_list';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email capture for the listing video shot list. Posts to /api/lead the same
 * way BlogEmailCapture and FreeEditsForm do. The PDF is sent by hand for now,
 * so the success copy promises "shortly" and nothing about instant delivery.
 */
export default function ShotListCapture() {
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
          fullName: 'Shot list download',
          email: v,
          source: SOURCE,
          serviceInterest: 'Listing video shot list',
          notes: 'Asked for the printable PDF of the listing video shot list. Send it by hand.',
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
      <h2 id={`${uid}-h`}>Get the printable PDF version by email</h2>
      <p className="slc-copy">
        The same shots on one sheet you can take to the property. We email it to you. No spam, and you can ask us to stop at any time.
      </p>
      {status === 'sent' ? (
        <p className="slc-ok" role="status">Done. The PDF will be emailed to you shortly.</p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="slc-form">
          <label htmlFor={inputId} className="slc-sr">Email address</label>
          <input
            id={inputId}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@brokerage.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            required
          />
          <button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Email me the PDF'}
          </button>
        </form>
      )}
      {error && <p className="slc-err" id={errId}>{error}</p>}
      {status === 'error' && (
        <p className="slc-err" role="alert">
          That did not go through. Email <a href="mailto:lakshyasoni2703@gmail.com">lakshyasoni2703@gmail.com</a> and we will send it.
        </p>
      )}
      <style>{`
        .slc { box-sizing: border-box; max-width: 100%; padding: 32px; border-radius: 20px; background: #0C0C0B; color: #F2EEE7; font-family: Inter, sans-serif; }
        .slc h2 { margin: 0 0 10px; font-size: clamp(22px, 3vw, 28px); font-weight: 800; letter-spacing: -0.02em; line-height: 1.15; color: #F2EEE7; }
        .slc-copy { margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: rgba(242,238,231,0.72); max-width: 560px; }
        .slc-form { display: flex; gap: 10px; flex-wrap: wrap; }
        .slc-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .slc-form input { flex: 1 1 240px; min-width: 0; min-height: 48px; box-sizing: border-box; padding: 11px 18px; font: 400 16px Inter, sans-serif; color: #F2EEE7; background: rgba(255,255,255,0.06); border: 1px solid rgba(242,238,231,0.22); border-radius: 100px; }
        .slc-form input::placeholder { color: rgba(242,238,231,0.4); }
        .slc-form input[aria-invalid="true"] { border-color: #FF8A5C; }
        .slc-form button { min-height: 48px; padding: 12px 26px; border: none; border-radius: 100px; background: #E8541A; color: #fff; font: 800 15px Inter, sans-serif; cursor: pointer; }
        .slc-form button:disabled { opacity: 0.65; cursor: progress; }
        .slc-form input:focus-visible, .slc-form button:focus-visible, .slc a:focus-visible { outline: 3px solid #E8541A; outline-offset: 2px; }
        .slc-ok { margin: 0; font-size: 17px; font-weight: 700; }
        .slc-err { margin: 10px 0 0; font-size: 14px; line-height: 1.5; color: #FF8A5C; }
        .slc-err a { color: #F2EEE7; font-weight: 700; overflow-wrap: anywhere; }
        @media (max-width: 480px) { .slc { padding: 24px 18px; } .slc-form button { width: 100%; } }
      `}</style>
    </section>
  );
}
