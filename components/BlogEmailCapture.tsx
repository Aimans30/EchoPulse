'use client';

import { useId, useState } from 'react';
import { usePathname } from 'next/navigation';
import { trackLeadMagnetSubmit } from '@/lib/analytics';

const SOURCE = 'blog_newsletter';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BlogEmailCapture() {
  const uid = useId();
  const pathname = usePathname();
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
          fullName: 'Blog subscriber',
          email: v,
          source: SOURCE,
          serviceInterest: 'Weekly email',
          notes: `Signed up on ${pathname}`,
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
    <section className="bec" aria-labelledby={`${uid}-h`}>
      <h2 id={`${uid}-h`}>Get the weekly what&apos;s-working note</h2>
      <p className="bec-copy">
        One short email a week: what is working in content for small businesses right now. No spam, unsubscribe any time.
      </p>
      {status === 'sent' ? (
        <p className="bec-ok" role="status">You are on the list. The next note lands this week.</p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="bec-form">
          <label htmlFor={inputId} className="bec-sr">Email address</label>
          <input
            id={inputId}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            required
          />
          <button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send me the note'}
          </button>
        </form>
      )}
      {error && <p className="bec-err" id={errId}>{error}</p>}
      {status === 'error' && (
        <p className="bec-err" role="alert">
          That did not go through. Email <a href="mailto:lakshya@echopulse.media">lakshya@echopulse.media</a> and we will add you.
        </p>
      )}
      <style>{`
        .bec { box-sizing: border-box; max-width: 100%; margin: 48px 0 0; padding: 28px; border-radius: 20px; background: #0C0C0B; color: #F2EEE7; font-family: Inter, sans-serif; }
        .bec h2 { margin: 0 0 8px; font-size: 22px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.2; color: #F2EEE7; }
        .bec-copy { margin: 0 0 18px; font-size: 15px; line-height: 1.55; color: rgba(242,238,231,0.7); }
        .bec-form { display: flex; gap: 10px; flex-wrap: wrap; }
        .bec-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .bec-form input { flex: 1 1 220px; min-width: 0; min-height: 48px; box-sizing: border-box; padding: 11px 16px; font: 400 16px Inter, sans-serif; color: #F2EEE7; background: rgba(255,255,255,0.06); border: 1px solid rgba(242,238,231,0.22); border-radius: 100px; }
        .bec-form input::placeholder { color: rgba(242,238,231,0.4); }
        .bec-form input[aria-invalid="true"] { border-color: #FF8A5C; }
        .bec-form button { min-height: 48px; padding: 12px 24px; border: none; border-radius: 100px; background: #E8541A; color: #fff; font: 800 15px Inter, sans-serif; cursor: pointer; }
        .bec-form button:disabled { opacity: 0.65; cursor: progress; }
        .bec-form input:focus-visible, .bec-form button:focus-visible, .bec a:focus-visible { outline: 3px solid #E8541A; outline-offset: 2px; }
        .bec-ok { margin: 0; font-size: 16px; font-weight: 700; }
        .bec-err { margin: 10px 0 0; font-size: 13.5px; line-height: 1.5; color: #FF8A5C; }
        .bec-err a { color: #F2EEE7; font-weight: 700; overflow-wrap: anywhere; }
        @media (max-width: 480px) { .bec { padding: 22px 18px; } .bec-form button { width: 100%; } }
      `}</style>
    </section>
  );
}
