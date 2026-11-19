'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { track, trackFreeEditsSubmit } from '@/lib/analytics';
import { getAttribution } from '@/lib/attribution';

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
const STARTED_SOURCE = 'free_edits_started';
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

/** Adds https:// to a bare domain or path. Returns '' when it still is not a link. */
function normalizeUrl(v: string): string {
  const t = v.trim();
  if (!t) return '';
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t.replace(/^\/+/, '')}`;
  if (!isHttpUrl(withScheme)) return '';
  return new URL(withScheme).hostname.includes('.') ? withScheme : '';
}

export default function FreeEditsForm() {
  const uid = useId();
  const startedSent = useRef(false);
  const [noLink, setNoLink] = useState(false);
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
  const [step, setStep] = useState(0);
  // Each step replaces the one before it in place, so after Continue the
  // viewport is still where the previous step's button was: on a phone that
  // is the bottom of the new step, with its first (required) field scrolled
  // off the top. Bring the top of the form back under the nav on every step
  // change, but only when it is actually out of view.
  const formRef = useRef<HTMLFormElement>(null);
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) { firstStep.current = false; return; }
    const el = formRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top >= 76 && top < window.innerHeight * 0.5) return;
    window.scrollTo({ top: Math.max(0, window.scrollY + top - 84) });
  }, [step]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e.name = 'Enter your name.';
    if (!email.trim()) e.email = 'Enter your email.';
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address.';
    if (footage.trim()) {
      if (!normalizeUrl(footage)) e.footage = 'That does not look like a link. Try drive.google.com/your-folder';
    } else if (!noLink) e.footage = 'Paste a link to your footage, or tick the box below.';
    if (!business) e.business = 'Choose the closest match.';
    return e;
  };

  /** Which step each required field lives on. */
  const STEP_OF: Record<keyof Errors, number> = { name: 0, email: 0, business: 0, footage: 1 };

  const goNext = () => {
    const all = validate();
    const here = Object.fromEntries(Object.entries(all).filter(([k]) => STEP_OF[k as keyof Errors] === step)) as Errors;
    setErrors(here);
    if (Object.keys(here).length > 0) return;
    track('free_edits_step', { step: step + 1, source: SOURCE });
    if (step === 0 && !startedSent.current) {
      startedSent.current = true;
      // Non-blocking: save the lead now so it is not lost if they stop here.
      try {
        const line = (label: string, v: string) => (v.trim() ? `${label}: ${v.trim()}` : null);
        fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            fullName: name.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
            source: STARTED_SOURCE,
            serviceInterest: '2 free edits',
            company: business,
            notes: [line('Business type', business), line('Website or social', profile), line('Phone or WhatsApp', phone)].filter(Boolean).join('\n'),
            attribution: getAttribution(),
          }),
        }).catch(() => {});
      } catch { /* never block the form */ }
    }
    setStep((n) => Math.min(2, n + 1));
  };

  const skipAndSend = () => {
    track('free_edits_step', { step: 'skip', source: SOURCE });
    void submit();
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === 'submitting') return;
    // Enter inside an earlier step moves forward instead of submitting.
    if (step < 2) { goNext(); return; }
    void submit();
  };

  const submit = async () => {
    if (status === 'submitting') return;
    const e = validate();
    setErrors(e);
    const bad = Object.keys(e) as Array<keyof Errors>;
    if (bad.length > 0) {
      setStep(Math.min(...bad.map((k) => STEP_OF[k])));
      return;
    }

    setStatus('submitting');
    const line = (label: string, v: string) => (v.trim() ? `${label}: ${v.trim()}` : null);
    const notes = [
      footage.trim() ? `Footage: ${normalizeUrl(footage)}` : 'Footage: no link yet. Email them where to send it.',
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
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error('submit failed');
      trackFreeEditsSubmit(SOURCE);
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
    <form ref={formRef} className="fe-card" onSubmit={onSubmit} noValidate aria-label="Request 2 free edited videos">
      <ol className="fe-progress" aria-label="Progress">
        {['About you', 'Your footage', 'Editing style'].map((label, i) => (
          <li key={label} className={i === step ? 'is-on' : i < step ? 'is-done' : undefined} aria-current={i === step ? 'step' : undefined}>
            <button type="button" onClick={() => { if (i < step) setStep(i); }} disabled={i > step} aria-label={`Step ${i + 1}: ${label}`}>
              <span>{i + 1}</span> {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="fe-pane" hidden={step !== 0}>

      <div className="fe-row">
        <div className="fe-field">
          <label htmlFor={id('name')}>Name</label>
          <input id={id('name')} name="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required {...fieldProps('name')} />
          {errors.name && <p className="fe-err" id={id('name-err')}>{errors.name}</p>}
        </div>
        <div className="fe-field">
          <label htmlFor={id('email')}>Email</label>
          <input id={id('email')} name="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required {...fieldProps('email')} />
          {errors.email && <p className="fe-err" id={id('email-err')}>{errors.email}</p>}
        </div>
      </div>

      <div className="fe-row">
        <div className="fe-field">
          <label htmlFor={id('profile')}>Website or social <span className="fe-opt">(optional)</span></label>
          <input id={id('profile')} name="website_or_social" type="text" placeholder="@handle or yoursite.com" value={profile} onChange={(e) => setProfile(e.target.value)} />
        </div>
        <div className="fe-field">
          <label htmlFor={id('phone')}>Phone or WhatsApp <span className="fe-opt">(optional)</span></label>
          <input id={id('phone')} name="phone" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div>
        <Chips legend="What kind of business?" name={id('business')} options={BUSINESS_TYPES} value={business ? [business] : []} onChange={(v) => setBusiness(v[0] ?? '')} invalid={!!errors.business} />
        {errors.business && <p className="fe-err" id={id('business-err')} style={{ marginTop: 8 }}>{errors.business}</p>}
      </div>

      </div>

      <div className="fe-pane" hidden={step !== 1}>

      <div className="fe-field">
        <label htmlFor={id('footage')}>Link to your footage</label>
        <input id={id('footage')} name="footage_url" type="text" inputMode="url" autoCapitalize="none" autoCorrect="off" placeholder="https://drive.google.com/..." value={footage} onChange={(e) => setFootage(e.target.value)} required={!noLink} {...fieldProps('footage')} />
        <label className="fe-check">
          <input type="checkbox" checked={noLink} onChange={(e) => setNoLink(e.target.checked)} />
          I do not have a link yet. Email me where to send it.
        </label>
        <p className="fe-hint">Google Drive, Dropbox, WeTransfer or similar. Make sure the link is open to anyone with it.</p>
        {errors.footage && <p className="fe-err" id={id('footage-err')}>{errors.footage}</p>}
      </div>

      <Chips legend="What kind of video is it?" name={id('kinds')} options={VIDEO_KINDS} value={kinds} onChange={setKinds} multi />
      <Chips legend="Where will you post it?" name={id('platforms')} options={PLATFORMS} value={platforms} onChange={setPlatforms} multi />

      </div>

      <div className="fe-pane" hidden={step !== 2}>
        <p className="fe-hint">All optional. Skip anything you do not have a view on and we will decide.</p>

      <Chips legend="Editing style" name={id('style')} options={STYLES} value={style} onChange={setStyle} />
      <div className="fe-row">
        <Chips legend="Captions" name={id('captions')} options={CAPTIONS} value={captions} onChange={setCaptions} />
        <Chips legend="Music" name={id('music')} options={MUSIC} value={music} onChange={setMusic} />
      </div>

      <div className="fe-row">
        <div className="fe-field">
          <label htmlFor={id('reference')}>A video you like the editing of</label>
          <input id={id('reference')} name="reference_video_url" type="text" inputMode="url" placeholder="Link to a reel or video" value={reference} onChange={(e) => setReference(e.target.value)} />
        </div>
        <div className="fe-field">
          <label htmlFor={id('brand')}>Brand colours, fonts or logo</label>
          <input id={id('brand')} name="brand_details" type="text" placeholder="Hex codes or a brand kit link" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
      </div>

      <div className="fe-field">
        <label htmlFor={id('note')}>Anything else we should know? <span className="fe-opt">(optional)</span></label>
        <textarea id={id('note')} name="notes" rows={2} placeholder="The hook you want, parts to cut, a deadline, anything." value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      </div>

      <div className="fe-nav">
        {step > 0 && (
          <button type="button" className="fe-back" onClick={() => setStep((n) => n - 1)}>
            Back
          </button>
        )}
        {step < 2 ? (
          <button key="next" type="button" className="fe-btn" onClick={goNext}>
            Continue
          </button>
        ) : (
          <button key="send" type="submit" className="fe-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send my footage'}
          </button>
        )}
      </div>
      <p className="fe-hint fe-center">No card, no call. Two edited videos back within 48 hours.</p>
      {step === 0 && <p className="fe-hint fe-center fe-small">We save your details at this step so we can follow up if you get stuck.</p>}
      {step === 1 && (
        <button type="button" className="fe-skip" onClick={skipAndSend} disabled={status === 'submitting'}>
          Skip and send
        </button>
      )}

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
  .fe-card { background: #0C0C0B; color: #F2EEE7; border-radius: 24px; padding: 28px 30px; box-shadow: 0 30px 80px rgba(12,12,11,0.18); display: flex; flex-direction: column; gap: 18px; font-family: Inter, sans-serif; min-width: 0; }
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
  .fe-progress { list-style: none; margin: 0 0 4px; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .fe-progress button { width: 100%; display: flex; align-items: center; gap: 8px; padding: 0 0 10px; background: none; border: 0; border-bottom: 2px solid rgba(242,238,231,0.16); color: rgba(242,238,231,0.5); font: 700 12.5px Inter, sans-serif; text-align: left; cursor: default; white-space: nowrap; overflow: hidden; }
  .fe-progress button span { display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; width: 22px; height: 22px; border-radius: 50%; background: rgba(242,238,231,0.14); font-size: 12px; }
  .fe-progress .is-on button { color: #F2EEE7; border-bottom-color: #E8541A; }
  .fe-progress .is-on button span { background: #E8541A; color: #fff; }
  .fe-progress .is-done button { color: rgba(242,238,231,0.8); border-bottom-color: rgba(232,84,26,0.55); cursor: pointer; }
  .fe-progress .is-done button span { background: rgba(232,84,26,0.3); color: #fff; }
  .fe-progress button:focus-visible { outline: 3px solid #E8541A; outline-offset: 2px; }
  .fe-pane { display: flex; flex-direction: column; gap: 16px; min-width: 0; animation: fePane .28s cubic-bezier(.16,1,.3,1); }
  .fe-pane[hidden] { display: none; }
  @keyframes fePane { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
  .fe-nav { display: flex; gap: 10px; }
  .fe-nav .fe-btn { flex: 1 1 auto; }
  .fe-back { min-height: 54px; padding: 0 22px; border-radius: 100px; background: transparent; color: #F2EEE7; border: 1px solid rgba(242,238,231,0.28); font: 700 15px Inter, sans-serif; cursor: pointer; }
  .fe-back:hover { border-color: rgba(242,238,231,0.6); }
  .fe-back:focus-visible { outline: 3px solid #E8541A; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .fe-pane { animation: none; } }
  /* Phones: the step number sits above its label. Side by side, "Your footage"
     and "Editing style" were cut off mid-word at 360px and needed 11.5px type. */
  @media (max-width: 420px) { .fe-progress button { font-size: 12px; flex-direction: column; align-items: flex-start; gap: 6px; } }
  .fe-step { margin: 6px 0 -4px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: 12px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; color: #F2EEE7; }
  .fe-step:not(:first-child) { padding-top: 20px; border-top: 1px solid rgba(242,238,231,0.12); }
  .fe-step span { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #E8541A; color: #fff; font-size: 12px; letter-spacing: 0; }
  .fe-step em { font-style: normal; font-weight: 500; letter-spacing: 0; text-transform: none; color: rgba(242,238,231,0.55); font-size: 12.5px; }
  .fe-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; align-items: start; }
  .fe-chips { border: 0; padding: 0; margin: 0; min-width: 0; }
  .fe-chips legend { font-size: 14px; font-weight: 700; padding: 0; margin-bottom: 8px; }
  .fe-chips > div { display: flex; flex-wrap: wrap; gap: 8px; }
  .fe-chip { position: relative; display: inline-flex; align-items: center; min-height: 36px; padding: 6px 13px; border-radius: 100px; font-size: 14px; font-weight: 600; cursor: pointer; color: rgba(242,238,231,0.82); background: rgba(255,255,255,0.06); border: 1px solid rgba(242,238,231,0.22); transition: background .15s, color .15s, border-color .15s; }
  .fe-chip input { position: absolute; opacity: 0; width: 1px; height: 1px; min-height: 0; padding: 0; }
  .fe-chip.is-on { background: #F2EEE7; color: #0C0C0B; border-color: #F2EEE7; }
  .fe-chips[aria-invalid="true"] .fe-chip { border-color: #FF8A5C; }
  .fe-chip:hover { border-color: rgba(242,238,231,0.5); color: #F2EEE7; }
  .fe-chip:focus-within { outline: 3px solid #E8541A; outline-offset: 2px; }
  /* Touch screens: chips are the main input on steps 2 and 3, so they get a
     full 44px target instead of the 36px desktop pill. */
  @media (max-width: 640px) { .fe-chip { min-height: 44px; padding: 8px 15px; } }
  .fe-check { display: flex; align-items: center; gap: 10px; min-height: 44px; font-size: 14px; font-weight: 500 !important; color: rgba(242,238,231,0.82); cursor: pointer; }
  .fe-field .fe-check input { width: 20px; min-height: 20px; height: 20px; padding: 0; flex: 0 0 auto; accent-color: #E8541A; }
  .fe-small { font-size: 12.5px; margin-top: -10px; }
  .fe-skip { align-self: center; margin-top: -8px; min-height: 44px; padding: 0 12px; background: none; border: 0; color: rgba(242,238,231,0.6); font: 600 14px Inter, sans-serif; text-decoration: underline; cursor: pointer; }
  .fe-skip:hover { color: #F2EEE7; }
  .fe-skip:focus-visible { outline: 3px solid #E8541A; outline-offset: 2px; }
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
