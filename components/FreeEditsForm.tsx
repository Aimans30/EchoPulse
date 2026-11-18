'use client';

import { useId, useState } from 'react';
import { trackLeadMagnetSubmit } from '@/lib/analytics';

const BUSINESS_TYPES = ['Real estate', 'Coaching', 'Founder or SaaS', 'Home services', 'DTC', 'Other'] as const;
const VIDEO_KINDS = ['Short reel', 'Talking head', 'Podcast clips', 'Listing tour', 'Ad creative', 'Not sure'] as const;
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube Shorts', 'LinkedIn', 'Facebook'] as const;
const STYLES = ['Clean and minimal', 'Fast cuts, bold captions', 'Cinematic', 'Documentary', 'You decide'] as const;
const CAPTIONS = ['Yes, captions on', 'No captions', 'You decide'] as const;
const MUSIC = ['Upbeat', 'Calm', 'No music', 'You decide'] as const;

/** A row of pill choices. `multi` allows several; otherwise one (click again to clear). */
function Chips({
  legend, options, value, onChange, multi, name, invalid,
}: {
  invalid?: boolean;
  legend: string;
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
  multi?: boolean;
  name: string;
}) {
  const pick = (v: string) => {
    if (multi) onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    else onChange(value.includes(v) ? [] : [v]);
  };
  return (
    <fieldset className="fe-chips" aria-invalid={invalid ? true : undefined}>
      <legend>{legend}</legend>
      <div>
        {options.map((v) => (
          <label key={v} className={`fe-chip${value.includes(v) ? ' is-on' : ''}`}>
            <input type="checkbox" name={name} checked={value.includes(v)} onChange={() => pick(v)} />
            {v}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

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
  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState('');
  const [business, setBusiness] = useState('');
  const [footage, setFootage] = useState('');
  const [kinds, setKinds] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [style, setStyle] = useState<string[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [music, setMusic] = useState<string[]>([]);
  const [reference, setReference] = useState('');
  const [brand, setBrand] = useState('');
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
    if (Object.keys(e).length > 0) {
      // Bring the first problem into view; the required fields are at the top.
      document.querySelector('.fe-card [aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setStatus('submitting');
    const line = (label: string, v: string) => (v.trim() ? `${label}: ${v.trim()}` : null);
    const notes = [
      `Footage: ${footage.trim()}`,
      `Business type: ${business}`,
      line('Website or social', profile),
      line('Phone or WhatsApp', phone),
      line('Kind of video', kinds.join(', ')),
      line('Posting on', platforms.join(', ')),
      line('Editing style', style.join(', ')),
      line('Captions', captions.join(', ')),
      line('Music', music.join(', ')),
      line('Reference video they like', reference),
      line('Brand colours, fonts, logo', brand),
      line('Note', note),
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
          phone: phone.trim() || undefined,
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
        <p className="fe-hint">We reply from {CONTACT_EMAIL}. If the footage link needs access, we will ask there.</p>
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
      <p className="fe-step"><span>1</span> About you</p>

      <div className="fe-row">
        <div className="fe-field">
          <label htmlFor={id('name')}>Name</label>
          <input id={id('name')} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required {...fieldProps('name')} />
          {errors.name && <p className="fe-err" id={id('name-err')}>{errors.name}</p>}
        </div>
        <div className="fe-field">
          <label htmlFor={id('email')}>Email</label>
          <input id={id('email')} type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required {...fieldProps('email')} />
          {errors.email && <p className="fe-err" id={id('email-err')}>{errors.email}</p>}
        </div>
      </div>

      <div className="fe-row">
        <div className="fe-field">
          <label htmlFor={id('profile')}>Website or social <span className="fe-opt">(optional)</span></label>
          <input id={id('profile')} type="text" placeholder="@handle or yoursite.com" value={profile} onChange={(e) => setProfile(e.target.value)} />
        </div>
        <div className="fe-field">
          <label htmlFor={id('phone')}>Phone or WhatsApp <span className="fe-opt">(optional)</span></label>
          <input id={id('phone')} type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div>
        <Chips legend="What kind of business?" name={id('business')} options={BUSINESS_TYPES} value={business ? [business] : []} onChange={(v) => setBusiness(v[0] ?? '')} invalid={!!errors.business} />
        {errors.business && <p className="fe-err" id={id('business-err')} style={{ marginTop: 8 }}>{errors.business}</p>}
      </div>

      <p className="fe-step"><span>2</span> Your footage</p>

      <div className="fe-field">
        <label htmlFor={id('footage')}>Link to your footage</label>
        <input id={id('footage')} type="url" inputMode="url" placeholder="https://drive.google.com/..." value={footage} onChange={(e) => setFootage(e.target.value)} required {...fieldProps('footage')} />
        <p className="fe-hint">Google Drive, Dropbox, WeTransfer or similar. Make sure the link is open to anyone with it.</p>
        {errors.footage && <p className="fe-err" id={id('footage-err')}>{errors.footage}</p>}
      </div>

      <Chips legend="What kind of video is it?" name={id('kinds')} options={VIDEO_KINDS} value={kinds} onChange={setKinds} multi />
      <Chips legend="Where will you post it?" name={id('platforms')} options={PLATFORMS} value={platforms} onChange={setPlatforms} multi />

      <p className="fe-step"><span>3</span> How you want it edited <em>optional, skip what you like</em></p>

      <Chips legend="Editing style" name={id('style')} options={STYLES} value={style} onChange={setStyle} />
      <Chips legend="Captions" name={id('captions')} options={CAPTIONS} value={captions} onChange={setCaptions} />
      <Chips legend="Music" name={id('music')} options={MUSIC} value={music} onChange={setMusic} />

      <div className="fe-field">
        <label htmlFor={id('reference')}>A video whose editing you like <span className="fe-opt">(optional)</span></label>
        <input id={id('reference')} type="text" inputMode="url" placeholder="Link to a reel, short or video" value={reference} onChange={(e) => setReference(e.target.value)} />
        <p className="fe-hint">Yours or anyone else&apos;s. It is the fastest way to show us the look you want.</p>
      </div>

      <div className="fe-field">
        <label htmlFor={id('brand')}>Brand colours, fonts or logo <span className="fe-opt">(optional)</span></label>
        <input id={id('brand')} type="text" placeholder="Hex codes, font names, or a link to your brand kit" value={brand} onChange={(e) => setBrand(e.target.value)} />
      </div>

      <div className="fe-field">
        <label htmlFor={id('note')}>Anything else we should know? <span className="fe-opt">(optional)</span></label>
        <textarea id={id('note')} rows={3} placeholder="The hook you want, parts to cut, a deadline, anything." value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <button type="submit" className="fe-btn" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Send my footage'}
      </button>
      <p className="fe-hint fe-center">No card, no call. Two edited videos back within 48 hours.</p>

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
  .fe-card { background: #0C0C0B; color: #F2EEE7; border-radius: 24px; padding: 32px; box-shadow: 0 30px 80px rgba(12,12,11,0.18); display: flex; flex-direction: column; gap: 18px; font-family: Inter, sans-serif; min-width: 0; }
  .fe-field { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .fe-field label { font-size: 14px; font-weight: 700; }
  .fe-opt { font-weight: 500; color: rgba(242,238,231,0.55); }
  .fe-field input, .fe-field select, .fe-field textarea {
    width: 100%; box-sizing: border-box; min-height: 44px; padding: 11px 14px; font: 400 16px/1.4 Inter, sans-serif;
    color: #F2EEE7; background: rgba(255,255,255,0.06); border: 1px solid rgba(242,238,231,0.22); border-radius: 12px; transition: border-color .15s, background .15s;
  }
  .fe-field select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #F2EEE7 50%), linear-gradient(135deg, #F2EEE7 50%, transparent 50%); background-position: calc(100% - 20px) 50%, calc(100% - 14px) 50%; background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; padding-right: 40px; }
  .fe-field select option { color: #0C0C0B; background: #F2EEE7; }
  .fe-field textarea { resize: vertical; }
  .fe-field input:hover, .fe-field textarea:hover { border-color: rgba(242,238,231,0.42); }
  .fe-field input:focus, .fe-field textarea:focus { background: rgba(255,255,255,0.09); }
  .fe-field input::placeholder { color: rgba(242,238,231,0.4); }
  .fe-field [aria-invalid="true"] { border-color: #FF8A5C; }
  .fe-field input:focus-visible, .fe-field select:focus-visible, .fe-field textarea:focus-visible, .fe-btn:focus-visible, .fe-card a:focus-visible {
    outline: 3px solid #E8541A; outline-offset: 2px;
  }
  .fe-step { margin: 6px 0 -4px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: 12px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; color: #F2EEE7; }
  .fe-step:not(:first-child) { padding-top: 20px; border-top: 1px solid rgba(242,238,231,0.12); }
  .fe-step span { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #E8541A; color: #fff; font-size: 12px; letter-spacing: 0; }
  .fe-step em { font-style: normal; font-weight: 500; letter-spacing: 0; text-transform: none; color: rgba(242,238,231,0.55); font-size: 12.5px; }
  .fe-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; align-items: start; }
  .fe-chips { border: 0; padding: 0; margin: 0; min-width: 0; }
  .fe-chips legend { font-size: 14px; font-weight: 700; padding: 0; margin-bottom: 8px; }
  .fe-chips > div { display: flex; flex-wrap: wrap; gap: 8px; }
  .fe-chip { position: relative; display: inline-flex; align-items: center; min-height: 38px; padding: 8px 14px; border-radius: 100px; font-size: 14px; font-weight: 600; cursor: pointer; color: rgba(242,238,231,0.82); background: rgba(255,255,255,0.06); border: 1px solid rgba(242,238,231,0.22); transition: background .15s, color .15s, border-color .15s; }
  .fe-chip input { position: absolute; opacity: 0; width: 1px; height: 1px; min-height: 0; padding: 0; }
  .fe-chip.is-on { background: #F2EEE7; color: #0C0C0B; border-color: #F2EEE7; }
  .fe-chips[aria-invalid="true"] .fe-chip { border-color: #FF8A5C; }
  .fe-chip:hover { border-color: rgba(242,238,231,0.5); color: #F2EEE7; }
  .fe-chip:focus-within { outline: 3px solid #E8541A; outline-offset: 2px; }
  .fe-center { text-align: center; margin-top: -6px; }
  @media (max-width: 520px) { .fe-row { grid-template-columns: 1fr; } }
  .fe-hint { margin: 0; font-size: 13px; line-height: 1.5; color: rgba(242,238,231,0.6); }
  .fe-err { margin: 0; font-size: 13.5px; line-height: 1.5; color: #FF8A5C; }
  .fe-err a { color: #F2EEE7; font-weight: 700; overflow-wrap: anywhere; }
  .fe-fail { padding: 12px 14px; border: 1px solid rgba(255,138,92,0.5); border-radius: 12px; }
  .fe-btn { min-height: 54px; transition: background .2s, transform .15s; padding: 12px 26px; border: none; border-radius: 100px; background: #E8541A; color: #fff; font: 800 16px Inter, sans-serif; cursor: pointer; }
  .fe-btn:hover:not(:disabled) { background: #FF6A2B; transform: translateY(-1px); }
  .fe-btn:disabled { opacity: 0.65; cursor: progress; }
  .fe-success { margin: 0; font-size: 20px; font-weight: 800; line-height: 1.35; }
  @media (max-width: 480px) { .fe-card { padding: 22px 18px; border-radius: 18px; } }
`;
