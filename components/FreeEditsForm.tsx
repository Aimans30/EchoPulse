'use client';

import { useId, useState } from 'react';
import { trackLeadMagnetSubmit } from '@/lib/analytics';

const BUSINESS_TYPES = ['Real estate', 'Coaching', 'Founder or SaaS', 'Home services', 'DTC', 'Other'] as const;
const SOURCE = 'free_edits_form';
const CONTACT_EMAIL = 'lakshya@echopulse.media';

type Status = 'idle' | 'submitting' | 'sent' | 'error';
type Errors = Partial<Record<'name' | 'email' | 'footage' | 'business', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function FreeEditsForm() {
  const uid = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [footage, setFootage] = useState('');
  const [business, setBusiness] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const validate = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e.name = 'Enter your name.';
    if (!email.trim()) e.email = 'Enter your email.';
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address.';
    if (!footage.trim()) e.footage = 'Paste a link to your footage.';
    else if (!isHttpUrl(footage.trim())) e.footage = 'Enter a full link starting with https://';
    if (!business) e.business = 'Choose the closest match.';
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === 'submitting') return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus('submitting');
    const notes = [
      `Footage: ${footage.trim()}`,
      `Business type: ${business}`,
      note.trim() ? `Note: ${note.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim(),
          source: SOURCE,
          serviceInterest: '2 free edits',
          company: business,
          notes,
        }),
      });
      if (!res.ok) throw new Error('submit failed');
      trackLeadMagnetSubmit(SOURCE);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="fe-card" role="status">
        <p className="fe-success">Got it. Two edited videos will be back within 48 hours of the footage arriving.</p>
        <style>{styles}</style>
      </div>
    );
  }

  const id = (k: string) => `${uid}-${k}`;
  const fieldProps = (k: keyof Errors) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? id(`${k}-err`) : undefined,
  });

  return (
    <form className="fe-card" onSubmit={onSubmit} noValidate>
      <div className="fe-field">
        <label htmlFor={id('name')}>Name</label>
        <input
          id={id('name')}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          {...fieldProps('name')}
        />
        {errors.name && <p className="fe-err" id={id('name-err')}>{errors.name}</p>}
      </div>

      <div className="fe-field">
        <label htmlFor={id('email')}>Email</label>
        <input
          id={id('email')}
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          {...fieldProps('email')}
        />
        {errors.email && <p className="fe-err" id={id('email-err')}>{errors.email}</p>}
      </div>

      <div className="fe-field">
        <label htmlFor={id('footage')}>Link to your footage</label>
        <input
          id={id('footage')}
          type="url"
          inputMode="url"
          placeholder="https://drive.google.com/..."
          value={footage}
          onChange={(e) => setFootage(e.target.value)}
          required
          {...fieldProps('footage')}
        />
        <p className="fe-hint">Google Drive, Dropbox, WeTransfer or similar. Make sure the link is open to anyone with it.</p>
        {errors.footage && <p className="fe-err" id={id('footage-err')}>{errors.footage}</p>}
      </div>

      <div className="fe-field">
        <label htmlFor={id('business')}>What kind of business?</label>
        <select
          id={id('business')}
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          required
          {...fieldProps('business')}
        >
          <option value="" disabled>Choose one</option>
          {BUSINESS_TYPES.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        {errors.business && <p className="fe-err" id={id('business-err')}>{errors.business}</p>}
      </div>

      <div className="fe-field">
        <label htmlFor={id('note')}>Anything we should know? <span className="fe-opt">(optional)</span></label>
        <textarea id={id('note')} rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <button type="submit" className="fe-btn" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Get 2 free edits'}
      </button>

      {status === 'error' && (
        <p className="fe-err fe-fail" role="alert">
          That did not go through. Please email your footage link to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will take it from there.
        </p>
      )}

      <style>{styles}</style>
    </form>
  );
}

const styles = `
  .fe-card { background: #0C0C0B; color: #F2EEE7; border-radius: 22px; padding: 28px; display: flex; flex-direction: column; gap: 18px; font-family: Inter, sans-serif; min-width: 0; }
  .fe-field { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .fe-field label { font-size: 14px; font-weight: 700; }
  .fe-opt { font-weight: 500; color: rgba(242,238,231,0.55); }
  .fe-field input, .fe-field select, .fe-field textarea {
    width: 100%; box-sizing: border-box; min-height: 44px; padding: 11px 14px; font: 400 16px/1.4 Inter, sans-serif;
    color: #F2EEE7; background: rgba(255,255,255,0.06); border: 1px solid rgba(242,238,231,0.22); border-radius: 12px;
  }
  .fe-field select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #F2EEE7 50%), linear-gradient(135deg, #F2EEE7 50%, transparent 50%); background-position: calc(100% - 20px) 50%, calc(100% - 14px) 50%; background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; padding-right: 40px; }
  .fe-field select option { color: #0C0C0B; background: #F2EEE7; }
  .fe-field textarea { resize: vertical; }
  .fe-field input::placeholder { color: rgba(242,238,231,0.4); }
  .fe-field [aria-invalid="true"] { border-color: #FF8A5C; }
  .fe-field input:focus-visible, .fe-field select:focus-visible, .fe-field textarea:focus-visible, .fe-btn:focus-visible, .fe-card a:focus-visible {
    outline: 3px solid #E8541A; outline-offset: 2px;
  }
  .fe-hint { margin: 0; font-size: 13px; line-height: 1.5; color: rgba(242,238,231,0.6); }
  .fe-err { margin: 0; font-size: 13.5px; line-height: 1.5; color: #FF8A5C; }
  .fe-err a { color: #F2EEE7; font-weight: 700; overflow-wrap: anywhere; }
  .fe-fail { padding: 12px 14px; border: 1px solid rgba(255,138,92,0.5); border-radius: 12px; }
  .fe-btn { min-height: 48px; padding: 12px 26px; border: none; border-radius: 100px; background: #E8541A; color: #fff; font: 800 16px Inter, sans-serif; cursor: pointer; }
  .fe-btn:disabled { opacity: 0.65; cursor: progress; }
  .fe-success { margin: 0; font-size: 20px; font-weight: 800; line-height: 1.35; }
  @media (max-width: 480px) { .fe-card { padding: 22px 18px; border-radius: 18px; } }
`;
