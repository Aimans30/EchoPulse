'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PRICING_CARDS } from '@/lib/pricing';
import { planBookUrl, planSummary, type BookablePlanKey } from '@/lib/links';
import { getAttribution } from '@/lib/attribution';
import { trackPlanIntakeSubmit, trackPlanSelect } from '@/lib/analytics';

/**
 * Plan intake: opened by the button on a pricing card.
 *
 *   Step 1  pick a plan (the clicked card is preselected) and answer a few
 *           questions. Submitting posts the answers to /api/lead.
 *   Step 2  the booking calendar for that plan, with name, email and the
 *           answers already filled in (see planBookUrl in lib/links.ts).
 *
 * There is no checkout. Every plan starts with a free 15-minute intro call,
 * so "choosing" a plan here means telling us which one the call is about.
 *
 * The parent mounts this only while it is open (and re-keys it per open), so
 * mount = open and unmount = close. Answers are kept in a module variable so a
 * visitor who closes the modal and opens another card does not retype them.
 */

const BUSINESS_TYPES = ['Real estate', 'Coaching', 'Founder or SaaS', 'Home services', 'DTC', 'Other'] as const;
const HELP_OPTIONS = ['Short videos', 'LinkedIn posts', 'Blogs', 'Ad creative', 'Website or funnel', 'Not sure yet'] as const;

const PLANS = PRICING_CARDS.filter((p) => p.key !== 'free').map((p) => ({
  key: p.key as BookablePlanKey,
  name: p.name,
  price: p.priceLabel,
  per: p.per,
}));

interface Answers {
  name: string;
  email: string;
  business: string;
  website: string;
  help: string[];
  note: string;
}

type ErrorKey = 'name' | 'email' | 'business';
type Errors = Partial<Record<ErrorKey, string>>;

const EMPTY: Answers = { name: '', email: '', business: '', website: '', help: [], note: '' };

// Survives close/reopen within a page view. Never written to storage.
let draft: Answers = EMPTY;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(a: Answers): Errors {
  const e: Errors = {};
  if (!a.name.trim()) e.name = 'Enter your name.';
  if (!a.email.trim()) e.email = 'Enter your work email.';
  else if (!EMAIL_RE.test(a.email.trim())) e.email = 'That email does not look right. Check it and try again.';
  if (!a.business) e.business = 'Pick the closest match.';
  return e;
}

/** "Label: value" lines for every answered field (the plan line is added by the caller). */
function answerLines(a: Answers): string[] {
  const lines: string[] = [];
  if (a.business) lines.push(`Business type: ${a.business}`);
  if (a.website.trim()) lines.push(`Website or social: ${a.website.trim()}`);
  if (a.help.length) lines.push(`Wants help with: ${a.help.join(', ')}`);
  if (a.note.trim()) lines.push(`Note: ${a.note.trim()}`);
  return lines;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

export default function PlanIntakeModal({
  initialPlan,
  onClose,
}: {
  initialPlan: BookablePlanKey;
  onClose: () => void;
}) {
  const uid = useId();
  const id = (s: string) => `${uid}-${s}`;

  const [plan, setPlan] = useState<BookablePlanKey>(initialPlan);
  const [answers, setAnswers] = useState<Answers>(draft);
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [sending, setSending] = useState(false);
  // null = not sent yet, true = /api/lead confirmed, false = it failed.
  const [saved, setSaved] = useState<boolean | null>(null);
  const [bookUrl, setBookUrl] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const lastSent = useRef<string>('');
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const update = (patch: Partial<Answers>) => {
    setAnswers((prev) => {
      const next = { ...prev, ...patch };
      draft = next;
      return next;
    });
  };

  // Open/close lifecycle: lock page scroll, move focus in, trap Tab, close on
  // Escape, and hand focus back to the button that opened the modal.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const body = document.body;
    // globals.css forces `overflow-y: visible !important` on html and body
    // unless they carry .modal-open, and SmoothScroll clears a bare inline
    // overflow:hidden. The class is what makes the lock hold.
    html.classList.add('modal-open');
    body.classList.add('modal-open');
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    cardRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const card = cardRef.current;
      if (!card) return;
      const items = Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0,
      );
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !card.contains(active) || active === card) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);

    return () => {
      document.removeEventListener('keydown', onKey, true);
      html.classList.remove('modal-open');
      body.classList.remove('modal-open');
      html.style.overflow = '';
      body.style.overflow = '';
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, []);

  // Cal.com can be slow or blocked (ad blockers, strict networks). After a few
  // seconds, offer the same calendar in a new tab instead of an endless spinner.
  useEffect(() => {
    if (step !== 2 || loaded) return;
    const t = window.setTimeout(() => setSlow(true), 6000);
    return () => window.clearTimeout(t);
  }, [step, loaded]);

  const selected = PLANS.find((p) => p.key === plan) ?? PLANS[0];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const found = validate(answers);
    setErrors(found);
    const firstBad = (['name', 'email', 'business'] as ErrorKey[]).find((k) => found[k]);
    if (firstBad) {
      const target = document.getElementById(firstBad === 'business' ? id('business-0') : id(firstBad));
      target?.focus();
      return;
    }

    const lines = answerLines(answers);
    const payload = {
      fullName: answers.name.trim(),
      email: answers.email.trim(),
      source: 'plan_intake',
      serviceInterest: planSummary(plan),
      company: answers.business,
      notes: [`Plan: ${planSummary(plan)}`, ...lines, `Page: ${window.location.pathname}`].join('\n'),
      // Where this visitor first came from; /api/lead prints it on the lead.
      attribution: getAttribution(),
    };

    // Logging the request is ours to get right, not the visitor's problem: if
    // it fails or hangs they still go on to the calendar, and the answers ride
    // along in the booking notes. We just do not claim it was saved.
    setSending(true);
    const signature = JSON.stringify(payload);
    let ok = signature === lastSent.current;
    if (!ok) {
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), 8000);
      try {
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: signature,
          signal: ctrl.signal,
        });
        const json = res.ok ? await res.json().catch(() => null) : null;
        ok = !!json?.ok;
        if (ok) lastSent.current = signature;
      } catch {
        ok = false;
      } finally {
        window.clearTimeout(timer);
      }
    }

    setSaved(ok);
    // Plan key and whether we saved it. Never the name, email or answers.
    trackPlanIntakeSubmit(plan, ok);
    setBookUrl(planBookUrl(plan, { name: payload.fullName, email: payload.email, notes: lines.join('\n') }));
    setLoaded(false);
    setSlow(false);
    setSending(false);
    setStep(2);
    cardRef.current?.focus({ preventScroll: true });
  };

  const backToAnswers = () => {
    setStep(1);
    cardRef.current?.focus({ preventScroll: true });
  };

  const errProps = (key: ErrorKey) =>
    errors[key] ? { 'aria-invalid': true as const, 'aria-describedby': id(`${key}-err`) } : {};

  return createPortal(
    <div className="pim-overlay" data-step={step} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={cardRef}
        className="pim-card"
        data-step={step}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id('title')}
        aria-describedby={id('sub')}
        tabIndex={-1}
      >
        {/* Plain divs, not <header>/<footer>/<section>: globals.css adds phone
            padding to those elements site-wide. */}
        <div className="pim-header">
          <div className="pim-head-text">
            <div className="pim-steps" aria-hidden="true">
              <span data-on={step === 1}>1 Your plan</span>
              <span className="pim-steps-sep" />
              <span data-on={step === 2}>2 Pick a time</span>
            </div>
            <h2 id={id('title')} className="pim-title">
              {step === 1 ? 'Choose your plan' : 'Pick a time for your free 15-minute call'}
            </h2>
            <p id={id('sub')} className="pim-sub">
              {step === 1
                ? 'A few quick questions, then you pick a time for a free 15-minute intro call. No card needed to book.'
                : `About: ${planSummary(plan)}. Your name, email and answers are already filled in.`}
            </p>
          </div>
          <button type="button" className="pim-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {step === 1 ? (
          <form className="pim-form" onSubmit={onSubmit} noValidate>
            <div className="pim-body" data-lenis-prevent>
              <fieldset className="pim-plans">
                <legend className="pim-label">Plan</legend>
                <div className="pim-plan-list">
                  {PLANS.map((p) => (
                    <label key={p.key} className="pim-plan" data-checked={plan === p.key}>
                      <input
                        type="radio"
                        name={id('plan')}
                        value={p.key}
                        checked={plan === p.key}
                        onChange={() => { setPlan(p.key); trackPlanSelect(p.key, 'plan_intake_modal'); }}
                        className="pim-sr"
                      />
                      <span className="pim-plan-dot" aria-hidden="true" />
                      <span className="pim-plan-text">
                        <span className="pim-plan-name">{p.name}</span>
                        <span className="pim-plan-price">
                          {p.price === p.name ? p.per : (
                            <>
                              <strong>{p.price}</strong>
                              {p.per.startsWith('/') ? p.per : ` ${p.per}`}
                            </>
                          )}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                <p className="pim-plans-note">
                  Not sure? Pick the closest one. You can change it on the call. Plans after the Pilot are month to month.
                </p>
              </fieldset>

              <div className="pim-fields">
                <div className="pim-row">
                  <div className="pim-field">
                    <label className="pim-label" htmlFor={id('name')}>Name</label>
                    <input
                      id={id('name')}
                      className="pim-input"
                      type="text"
                      autoComplete="name"
                      required
                      value={answers.name}
                      onChange={(e) => { update({ name: e.target.value }); if (errors.name) setErrors((x) => ({ ...x, name: undefined })); }}
                      {...errProps('name')}
                    />
                    {errors.name && <p id={id('name-err')} className="pim-err" role="alert">{errors.name}</p>}
                  </div>
                  <div className="pim-field">
                    <label className="pim-label" htmlFor={id('email')}>Work email</label>
                    <input
                      id={id('email')}
                      className="pim-input"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      value={answers.email}
                      onChange={(e) => { update({ email: e.target.value }); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); }}
                      {...errProps('email')}
                    />
                    {errors.email && <p id={id('email-err')} className="pim-err" role="alert">{errors.email}</p>}
                  </div>
                </div>

                <fieldset
                  className="pim-group"
                  {...(errors.business ? { 'aria-invalid': true, 'aria-describedby': id('business-err') } : {})}
                >
                  <legend className="pim-label">Business type</legend>
                  <div className="pim-pills" data-invalid={!!errors.business}>
                    {BUSINESS_TYPES.map((b, i) => (
                      <label key={b} className="pim-pill" data-checked={answers.business === b}>
                        <input
                          id={id(`business-${i}`)}
                          type="radio"
                          name={id('business')}
                          value={b}
                          required
                          checked={answers.business === b}
                          onChange={() => { update({ business: b }); if (errors.business) setErrors((x) => ({ ...x, business: undefined })); }}
                          className="pim-sr"
                        />
                        {b}
                      </label>
                    ))}
                  </div>
                  {errors.business && <p id={id('business-err')} className="pim-err" role="alert">{errors.business}</p>}
                </fieldset>

                <fieldset className="pim-group">
                  <legend className="pim-label">
                    What do you want help with first? <span className="pim-opt">Pick any</span>
                  </legend>
                  <div className="pim-pills">
                    {HELP_OPTIONS.map((h) => {
                      const on = answers.help.includes(h);
                      return (
                        <label key={h} className="pim-pill" data-checked={on}>
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => update({ help: on ? answers.help.filter((x) => x !== h) : [...answers.help, h] })}
                            className="pim-sr"
                          />
                          {h}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="pim-row">
                  <div className="pim-field">
                    <label className="pim-label" htmlFor={id('website')}>
                      Website or social handle <span className="pim-opt">Optional</span>
                    </label>
                    <input
                      id={id('website')}
                      className="pim-input"
                      type="text"
                      inputMode="url"
                      autoCapitalize="none"
                      autoComplete="url"
                      spellCheck={false}
                      maxLength={120}
                      value={answers.website}
                      onChange={(e) => update({ website: e.target.value })}
                    />
                  </div>
                  <div className="pim-field">
                    <label className="pim-label" htmlFor={id('note')}>
                      Anything we should know? <span className="pim-opt">Optional</span>
                    </label>
                    <input
                      id={id('note')}
                      className="pim-input"
                      type="text"
                      maxLength={160}
                      value={answers.note}
                      onChange={(e) => update({ note: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pim-footer">
              <p className="pim-fine">
                Next you pick a time. The call is 15 minutes and free, and nothing is charged here.
              </p>
              <button type="submit" className="pim-submit" disabled={sending}>
                {sending ? 'One moment' : `Continue with ${selected.name}`}
                {!sending && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="pim-status" role="status">
              <span>
                {saved
                  ? 'Got your answers. Now pick a time below.'
                  : 'We could not save your answers on our side just now. They are in the booking notes below, so pick a time and nothing is lost.'}
              </span>
              <button type="button" className="pim-back" onClick={backToAnswers}>Change plan or answers</button>
            </div>
            <div className="pim-cal">
              {!loaded && (
                <div className="pim-cal-wait" role="status">
                  <div className="pim-spinner" aria-hidden="true" />
                  <span>Loading the calendar</span>
                  {slow && (
                    <a className="pim-cal-link" href={bookUrl} data-track-location={`plan_intake_${plan}_new_tab`} target="_blank" rel="noopener noreferrer">
                      Taking a while? Open the calendar in a new tab
                    </a>
                  )}
                </div>
              )}
              <iframe
                title={`Book a call about ${selected.name} · EchoPulse`}
                src={bookUrl}
                onLoad={() => setLoaded(true)}
                className="pim-iframe"
                style={{ opacity: loaded ? 1 : 0 }}
                allow="autoplay; fullscreen; clipboard-write"
                loading="eager"
              />
            </div>
          </>
        )}
      </div>

      <style>{`
        .pim-overlay {
          position: fixed; inset: 0; z-index: 99999;
          display: flex; align-items: center; justify-content: center;
          padding: 20px 16px;
          background: rgba(8,8,7,0.78);
          backdrop-filter: blur(14px) saturate(150%);
          -webkit-backdrop-filter: blur(14px) saturate(150%);
          overscroll-behavior: contain;
          animation: pim-fade 0.18s ease-out;
          font-family: Inter, system-ui, sans-serif;
          cursor: default;
        }
        /* The site hides the native cursor for its custom one, which sits
           below this overlay. Bring the native cursor back inside the modal. */
        .pim-overlay, .pim-overlay * { cursor: default !important; }
        .pim-overlay button, .pim-overlay a, .pim-overlay label, .pim-overlay label * { cursor: pointer !important; }
        .pim-overlay input[type="text"], .pim-overlay input[type="email"] { cursor: text !important; }
        .pim-overlay button[disabled] { cursor: progress !important; }

        /* The [role][aria-modal] part and the !important on width are there to
           out-rank a globals.css phone rule that forces every
           div[role="dialog"][aria-modal="true"] into a 420px-wide 9/14 box. */
        .pim-card[role="dialog"][aria-modal="true"] { width: min(960px, 100%) !important; aspect-ratio: auto !important; }
        .pim-card[role="dialog"][aria-modal="true"][data-step="2"] { width: min(1040px, 100%) !important; }
        .pim-card {
          max-height: min(94vh, 760px);
          display: flex; flex-direction: column;
          background: #F2EEE7; color: #0C0C0B;
          border-radius: 24px; overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(12,12,11,0.12);
          animation: pim-in 0.22s cubic-bezier(0.16,1,0.3,1);
          outline: none;
        }
        .pim-card[data-step="2"] { height: 100%; max-height: min(94vh, 860px); }

        .pim-header {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
          padding: 18px 24px 16px; background: #FBF9F5;
          border-bottom: 1px solid rgba(12,12,11,0.07); flex-shrink: 0;
        }
        .pim-head-text { min-width: 0; }
        .pim-steps {
          display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.4px; color: #8A867D;
        }
        .pim-steps [data-on="true"] { color: #E8541A; }
        .pim-steps-sep { width: 18px; height: 1px; background: rgba(12,12,11,0.2); }
        .pim-title { margin: 0 0 3px; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2; color: #0C0C0B; }
        .pim-sub { margin: 0; font-size: 13px; line-height: 1.45; color: #5F5C55; }
        .pim-close {
          width: 44px; height: 44px; flex-shrink: 0; margin: -4px -8px 0 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; border: 1.5px solid rgba(12,12,11,0.10);
          background: rgba(12,12,11,0.04); color: #0C0C0B;
          transition: background 0.15s ease;
        }
        .pim-close:hover { background: rgba(12,12,11,0.10); }

        .pim-form { display: flex; flex-direction: column; min-height: 0; flex: 1; margin: 0; }
        .pim-body {
          display: grid; grid-template-columns: 296px minmax(0, 1fr);
          min-height: 0; flex: 1; overflow-y: auto; overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
        .pim-plans, .pim-group { border: 0; margin: 0; padding: 0; min-width: 0; }
        .pim-plans { padding: 18px 18px 18px 24px; background: #EAE5DC; border-right: 1px solid rgba(12,12,11,0.06); }
        .pim-plan-list { display: flex; flex-direction: column; gap: 8px; }
        .pim-plan {
          display: flex; align-items: center; gap: 11px;
          min-height: 58px; padding: 9px 12px;
          background: rgba(255,255,255,0.6); border: 1.5px solid rgba(12,12,11,0.10);
          border-radius: 14px; transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pim-plan:hover { border-color: rgba(12,12,11,0.3); }
        .pim-plan[data-checked="true"] { background: #fff; border-color: #E8541A; box-shadow: 0 0 0 1px #E8541A, 0 6px 18px rgba(232,84,26,0.12); }
        .pim-plan-dot {
          width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
          border: 1.5px solid rgba(12,12,11,0.3); background: #fff;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .pim-plan[data-checked="true"] .pim-plan-dot { border-color: #E8541A; }
        .pim-plan[data-checked="true"] .pim-plan-dot::after { content: ''; width: 9px; height: 9px; border-radius: 50%; background: #E8541A; }
        .pim-plan-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .pim-plan-name { font-size: 14px; font-weight: 800; letter-spacing: -0.2px; line-height: 1.2; }
        .pim-plan-price { font-size: 12px; color: #5F5C55; line-height: 1.3; }
        .pim-plan-price strong { color: #0C0C0B; font-weight: 800; }
        .pim-plans-note { margin: 12px 2px 0; font-size: 12px; line-height: 1.5; color: #5F5C55; }

        .pim-fields { padding: 18px 24px 18px 22px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
        .pim-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pim-field { min-width: 0; }
        .pim-label {
          display: block; padding: 0; margin: 0 0 6px;
          font-size: 12.5px; font-weight: 700; color: #0C0C0B; line-height: 1.3;
        }
        /* A <legend> otherwise sits on the fieldset's top edge, outside its padding. */
        legend.pim-label { float: left; width: 100%; }
        legend.pim-label + * { clear: both; }
        .pim-opt { font-weight: 500; color: #7A766D; margin-left: 4px; }
        .pim-input {
          display: block; width: 100%; height: 44px; padding: 0 13px; box-sizing: border-box;
          font: inherit; font-size: 14px; color: #0C0C0B;
          background: #fff; border: 1.5px solid rgba(12,12,11,0.16); border-radius: 11px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .pim-input:hover { border-color: rgba(12,12,11,0.34); }
        .pim-input:focus { outline: none; border-color: #E8541A; box-shadow: 0 0 0 3px rgba(232,84,26,0.28); }
        .pim-input[aria-invalid="true"] { border-color: #B3261E; }
        .pim-input[aria-invalid="true"]:focus { box-shadow: 0 0 0 3px rgba(179,38,30,0.25); }
        .pim-err { margin: 5px 0 0; font-size: 12.5px; font-weight: 600; line-height: 1.35; color: #B3261E; }

        .pim-pills { display: flex; flex-wrap: wrap; gap: 7px; }
        .pim-pill {
          display: inline-flex; align-items: center; min-height: 44px; padding: 0 15px;
          font-size: 13px; font-weight: 600; color: #0C0C0B; white-space: nowrap;
          background: #fff; border: 1.5px solid rgba(12,12,11,0.16); border-radius: 100px;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
          user-select: none; -webkit-user-select: none;
        }
        .pim-pill:hover { border-color: rgba(12,12,11,0.4); }
        .pim-pill[data-checked="true"] { background: #0C0C0B; border-color: #0C0C0B; color: #F2EEE7; }
        .pim-pills[data-invalid="true"] .pim-pill:not([data-checked="true"]) { border-color: rgba(179,38,30,0.55); }

        /* Visually hidden native inputs keep radios/checkboxes keyboard and
           screen-reader operable; the label shows the focus ring. */
        .pim-sr {
          position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
          overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); border: 0; white-space: nowrap;
        }
        .pim-pill:has(input:focus-visible), .pim-plan:has(input:focus-visible) {
          outline: 2px solid #E8541A; outline-offset: 2px;
        }
        .pim-overlay button:focus-visible, .pim-overlay a:focus-visible {
          outline: 2px solid #E8541A; outline-offset: 2px; border-radius: 100px;
        }
        .pim-overlay .pim-close:focus-visible { border-radius: 50%; }

        .pim-footer {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 12px 24px; background: #FBF9F5;
          border-top: 1px solid rgba(12,12,11,0.07); flex-shrink: 0;
        }
        .pim-fine { margin: 0; font-size: 12.5px; line-height: 1.45; color: #5F5C55; }
        .pim-submit {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          min-height: 46px; padding: 0 24px; flex-shrink: 0;
          font: inherit; font-size: 14px; font-weight: 800; white-space: nowrap;
          color: #fff; background: #E8541A; border: 0; border-radius: 100px;
          box-shadow: 0 6px 22px rgba(232,84,26,0.32);
          transition: background 0.15s ease;
        }
        .pim-submit:hover { background: #d94a14; }
        .pim-submit[disabled] { opacity: 0.7; }

        .pim-status {
          display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
          padding: 4px 16px 4px 24px; background: #F2EEE7;
          border-bottom: 1px solid rgba(12,12,11,0.07); flex-shrink: 0;
          font-size: 13px; line-height: 1.45; color: #3B3934;
        }
        .pim-status > span { flex: 1 1 260px; padding: 6px 0; }
        .pim-back {
          min-height: 44px; padding: 0 12px; font: inherit; font-size: 13px; font-weight: 700;
          color: #0C0C0B; background: none; border: 0;
          text-decoration: underline; text-decoration-color: #E8541A; text-underline-offset: 4px;
        }
        .pim-cal { position: relative; flex: 1; min-height: 0; background: #F2EEE7; }
        .pim-iframe { width: 100%; height: 100%; border: 0; display: block; color-scheme: light; transition: opacity 0.3s ease; }
        .pim-cal-wait {
          position: absolute; inset: 0; z-index: 1; padding: 24px; text-align: center;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
          font-size: 14px; color: #4A4740; background: #F2EEE7;
        }
        .pim-spinner {
          width: 36px; height: 36px; border-radius: 50%;
          border: 3px solid rgba(12,12,11,0.1); border-top-color: #E8541A;
          animation: pim-spin 0.8s linear infinite;
        }
        .pim-cal-link {
          min-height: 44px; display: inline-flex; align-items: center;
          font-size: 14px; font-weight: 700; color: #0C0C0B;
          text-decoration: underline; text-decoration-color: #E8541A; text-underline-offset: 4px;
        }

        @keyframes pim-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pim-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pim-spin { to { transform: rotate(360deg); } }

        /* Mouse users on a laptop: slightly shorter pills so step 1 fits one
           screen. Touch screens keep the full 44px targets. */
        @media (hover: hover) and (pointer: fine) and (min-width: 761px) {
          .pim-pill { min-height: 38px; }
        }

        /* Narrow: one column. */
        @media (max-width: 760px) {
          .pim-body { display: block; }
          .pim-plans { padding: 16px 16px 14px; border-right: 0; border-bottom: 1px solid rgba(12,12,11,0.06); }
          .pim-plan-list { display: grid; grid-template-columns: 1fr 1fr; }
          .pim-plan { align-items: flex-start; padding: 10px; gap: 8px; }
          .pim-plan-dot { margin-top: 1px; }
          .pim-plans-note { margin-top: 10px; }
          .pim-fields { padding: 16px; gap: 16px; }
          .pim-row { grid-template-columns: 1fr; gap: 16px; }
          .pim-input { font-size: 16px; height: 48px; }
          .pim-label { font-size: 13.5px; }
          .pim-pill { font-size: 14px; }
        }

        /* Phone: the modal is the whole screen and scrolls inside itself. */
        @media (max-width: 640px) {
          .pim-overlay {
            padding: 0; align-items: stretch;
            background: #0C0C0B; backdrop-filter: none; -webkit-backdrop-filter: none;
          }
          .pim-card[role="dialog"][aria-modal="true"], .pim-card[role="dialog"][aria-modal="true"][data-step="2"] { width: 100% !important; }
          .pim-card, .pim-card[data-step="2"] {
            height: 100%; max-height: none; border-radius: 0; box-shadow: none;
          }
          .pim-header { padding: 12px 14px 12px 16px; gap: 10px; }
          .pim-title { font-size: 18px; }
          .pim-close { margin: 0; }
          .pim-footer {
            flex-direction: column; align-items: stretch; gap: 8px;
            padding: 10px 16px calc(12px + env(safe-area-inset-bottom, 0px));
          }
          .pim-fine { text-align: center; font-size: 12.5px; }
          .pim-submit { width: 100%; min-height: 52px; font-size: 15px; }
          .pim-status { padding: 2px 6px 2px 16px; flex-wrap: nowrap; font-size: 12.5px; }
          .pim-status > span { flex: 1 1 0; min-width: 0; }
          .pim-back { flex-shrink: 0; max-width: 46%; text-align: right; line-height: 1.3; }
          /* The calendar needs the height more than the header does. */
          .pim-card[data-step="2"] .pim-sub, .pim-card[data-step="2"] .pim-steps { display: none; }
          .pim-card[data-step="2"] .pim-title { font-size: 17px !important; line-height: 1.25 !important; letter-spacing: -0.3px !important; margin: 0; }
          .pim-card[data-step="2"] .pim-header { align-items: center; padding-top: 8px; padding-bottom: 8px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pim-overlay, .pim-card { animation: none !important; }
          .pim-spinner { animation-duration: 2.4s !important; }
          .pim-overlay *, .pim-iframe { transition: none !important; }
        }
      `}</style>
    </div>,
    document.body,
  );
}
