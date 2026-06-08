'use client';

import { useEffect, useState } from 'react';

/**
 * PuneInquiryModal — Pune on-site shoot inquiry form.
 *
 * Premium-feel redesign (replaces the earlier flat form):
 *   • Section-banded layout — "Contact" + "Shoot details" as distinct
 *     groups with subtle orange micro-dividers
 *   • Inline SVG icons next to every field label (no emoji rendering
 *     quirks across platforms)
 *   • Orange focus ring on every input, gradient hover on the CTA
 *   • Sticky top header keeps the section title in view while scrolling
 *     the form on mobile
 *   • Trust strip directly under the CTA — "4-hour reply · no charge
 *     until scope agreed · WhatsApp first" — kills the standard form
 *     fear-of-form-submission tax
 *   • Success state shows the founder avatar + a warmer "we got you"
 *     message with explicit next-step timing
 *
 * Wiring (unchanged): global window.openPuneInquiryModal(packageName)
 * opens the modal with the named package preselected; submission POSTs to
 * /api/pune-inquiry which creates an Asana card in Sales Pipeline →
 * Discovery Call Booked + pings Slack #pune-onsite.
 */

const PACKAGES = [
  'Short-Form Studio (monthly · 18-25 reels)',
  'Content Day (one-off · 12 reels)',
  'Property Reel (per listing)',
  'Realtor Pack (3 properties)',
  'Custom / off-menu',
];

/**
 * Map a package label to its sales-relevant blurb. Shown in the locked-in
 * "You picked" card at the top of the form so the buyer sees exactly what
 * they're inquiring about — anchor price + key descriptor — instead of
 * just the package name buried in a dropdown.
 */
const PACKAGE_META: Record<string, { price: string; descriptor: string }> = {
  'Short-Form Studio (monthly · 18-25 reels)': { price: '₹44,999/mo · starting', descriptor: '18-25 reels per month, two shoots, full edit suite' },
  'Content Day (one-off · 12 reels)':          { price: '₹15,999 · half day',    descriptor: '4-hour shoot, up to 12 finished reels' },
  'Property Reel (per listing)':               { price: '₹9,999 · per property', descriptor: 'Cinematic reel + 15 photos + drone exterior' },
  'Realtor Pack (3 properties)':               { price: '₹24,999 · flat',        descriptor: '3 full Property Reel packages, same shoot week' },
  'Custom / off-menu':                         { price: 'Quote on call',         descriptor: 'Wedding teaser, launch event, founder docu, multi-month' },
};

type Status = 'idle' | 'submitting' | 'done' | 'error';

export default function PuneInquiryModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // When the user opens the modal from a specific package CTA we LOCK
  // the package selection visually — we show a "You picked: X" card
  // instead of a dropdown, so it's crystal clear what they're inquiring
  // about. They can still tap "Change package" to switch.
  const [packageLocked, setPackageLocked] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    pkg: PACKAGES[0],
    preferredDates: '',
    bestTimeToCall: '',
    notes: '',
  });

  // Expose openPuneInquiryModal globally so any CTA can call it with a
  // package name. Mirrors the BookCallModal pattern.
  useEffect(() => {
    const openModal = (preselectedPkg?: string) => {
      if (preselectedPkg) {
        const matched = PACKAGES.find(p => p.toLowerCase().includes(preselectedPkg.toLowerCase()));
        if (matched) {
          setForm(f => ({ ...f, pkg: matched }));
          // Lock the package visually so the buyer sees "You picked: X"
          // instead of a generic dropdown — unless they opened via the
          // "Pitch a custom shoot" button (then they're explicitly
          // browsing, leave the dropdown open).
          setPackageLocked(!preselectedPkg.toLowerCase().includes('custom'));
        } else {
          setPackageLocked(false);
        }
      } else {
        setPackageLocked(false);
      }
      setStatus('idle');
      setErrorMsg(null);
      setOpen(true);
    };
    const close = () => setOpen(false);
    type W = { openPuneInquiryModal?: (pkg?: string) => void; closePuneInquiryModal?: () => void };
    (window as unknown as W).openPuneInquiryModal = openModal;
    (window as unknown as W).closePuneInquiryModal = close;
    return () => {
      try {
        delete (window as unknown as { openPuneInquiryModal?: unknown }).openPuneInquiryModal;
        delete (window as unknown as { closePuneInquiryModal?: unknown }).closePuneInquiryModal;
      } catch { /* noop */ }
    };
  }, []);

  // Body-scroll lock + Esc to close. Always force-clear overflow on close
  // so a refresh mid-modal doesn't strand the body in overflow:hidden.
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const set = <K extends keyof typeof form>(k: K, v: string) => setForm(f => ({ ...f, [k]: v }));

  // Phone REQUIRED — Pune onsite needs WhatsApp/call access
  const phoneOk = /^[+\d][\d\s\-()]{7,}$/.test(form.phone.trim());
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const canSubmit = form.fullName.trim().length > 1 && emailOk && phoneOk && form.preferredDates.trim().length > 1 && status !== 'submitting';

  const submit = async () => {
    if (!canSubmit) return;
    setStatus('submitting');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/pune-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Something went sideways. Please try again or WhatsApp lakshya@echopulse.media.');
      setStatus('done');
    } catch (e) {
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong.');
    }
  };

  return (
    <div
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Pune onsite shoot inquiry"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,8,7,0.84)',
        backdropFilter: 'blur(22px) saturate(160%)',
        WebkitBackdropFilter: 'blur(22px) saturate(160%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9000,
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pune-modal-card"
        style={{
          position: 'relative',
          // Apple-style glass: translucent dark base + heavy backdrop blur
          // + subtle inner-top highlight for the inset-glass look
          background: 'linear-gradient(180deg, rgba(22,20,17,0.78) 0%, rgba(12,11,9,0.85) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 24,
          width: '100%',
          maxWidth: 540,
          maxHeight: 'calc(100dvh - 40px)',
          overflow: 'hidden',
          color: '#F2EEE7',
          fontFamily: 'Inter, sans-serif',
          boxShadow: [
            '0 32px 120px rgba(0,0,0,0.7)',                   // ambient drop
            '0 0 0 1px rgba(232,84,26,0.10)',                  // brand ring
            'inset 0 1px 0 rgba(255,255,255,0.10)',            // top highlight (Apple inset)
            'inset 0 -1px 0 rgba(0,0,0,0.4)',                  // bottom shadow line
          ].join(', '),
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Decorative ambient glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: -120, right: -60, width: 360, height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,84,26,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        {/* Close button */}
        <button
          type="button"
          aria-label="Close inquiry form"
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            width: 34, height: 34, borderRadius: 100,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(12,12,11,0.6)',
            backdropFilter: 'blur(8px)',
            color: '#F2EEE7',
            fontSize: 18, fontWeight: 500, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, fontFamily: 'inherit',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(232,84,26,0.18)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,84,26,0.45)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(12,12,11,0.6)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.10)';
          }}
        >×</button>

        {status === 'done' ? (
          <SuccessView form={form} onClose={() => setOpen(false)} />
        ) : (
          <>
            {/* Sticky header — section badge + headline stay in view while scrolling form */}
            <div className="pune-modal-header" style={{
              position: 'sticky', top: 0, zIndex: 1,
              padding: '24px 28px 16px',
              background: 'linear-gradient(180deg, rgba(12,11,9,0.92) 0%, rgba(12,11,9,0.78) 100%)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '4px 11px 4px 9px',
                background: 'rgba(232,84,26,0.10)',
                border: '1px solid rgba(232,84,26,0.30)',
                borderRadius: 100,
                fontSize: 10.5, fontWeight: 800, letterSpacing: 1.4,
                color: '#E8541A', textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8541A', boxShadow: '0 0 8px #E8541A' }} />
                Pune · Onsite shoot
              </div>

              <h2 className="pune-h2" style={{
                fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px',
                lineHeight: 1.15, margin: '0 0 4px',
              }}>
                Three minutes. We handle the rest.
              </h2>
              <p style={{
                fontSize: 13, color: 'rgba(242,238,231,0.6)',
                lineHeight: 1.5, margin: 0,
              }}>
                Drop your contact + when you&rsquo;d like to shoot. We call you back within 4 work hours.
              </p>
            </div>

            {/* Scrollable form body */}
            <div className="pune-modal-body" style={{
              flex: '1 1 auto',
              overflowY: 'auto',
              padding: '20px 28px 8px',
              display: 'flex', flexDirection: 'column', gap: 22,
            }}>

              <Section
                label="Your contact"
                hint="We&rsquo;ll WhatsApp the same day."
              >
                <Field
                  icon={<IconUser />}
                  label="Full name"
                  required
                  value={form.fullName}
                  onChange={v => set('fullName', v)}
                  placeholder="Your full name"
                />
                <Field
                  icon={<IconMail />}
                  label="Email"
                  required
                  type="email"
                  value={form.email}
                  onChange={v => set('email', v)}
                  placeholder="you@brand.com"
                />
                <Field
                  icon={<IconPhone />}
                  label="Phone (WhatsApp-friendly)"
                  required
                  value={form.phone}
                  onChange={v => set('phone', v)}
                  placeholder="+91 9XXXX XXXXX"
                  hint="We&rsquo;ll WhatsApp first, then call if no reply within an hour."
                />
              </Section>

              <Section
                label="Shoot details"
                hint="Tell us what you want and when."
              >
                {packageLocked ? (
                  <PickedPackageCard
                    pkg={form.pkg}
                    onChange={() => setPackageLocked(false)}
                  />
                ) : (
                  <SelectField
                    icon={<IconTarget />}
                    label="What we&rsquo;re crafting for you"
                    required
                    value={form.pkg}
                    onChange={v => set('pkg', v)}
                    options={PACKAGES}
                  />
                )}
                <Field
                  icon={<IconCalendar />}
                  label="Preferred shoot dates"
                  required
                  value={form.preferredDates}
                  onChange={v => set('preferredDates', v)}
                  placeholder="e.g. weekend of Jun 20-21 · or 'flexible, next 10 days'"
                  textarea
                />
                <Field
                  icon={<IconClock />}
                  label="Best time to call you"
                  value={form.bestTimeToCall}
                  onChange={v => set('bestTimeToCall', v)}
                  placeholder="weekdays after 6 pm · IST"
                />
                <Field
                  icon={<IconNote />}
                  label="Anything we should know?"
                  value={form.notes}
                  onChange={v => set('notes', v)}
                  placeholder="Location, brand context, budget feel, must-haves"
                  textarea
                />
              </Section>

              {errorMsg && (
                <div role="alert" style={{
                  padding: '11px 14px',
                  background: 'rgba(179,58,58,0.14)',
                  border: '1px solid rgba(179,58,58,0.32)',
                  borderRadius: 12, color: '#FFB3B3',
                  fontSize: 13, lineHeight: 1.5,
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <span aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>⚠</span>
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Sticky footer — CTA + trust strip */}
            <div style={{
              position: 'sticky', bottom: 0, zIndex: 1,
              padding: '14px 28px 22px',
              background: 'linear-gradient(0deg, #0C0B09 0%, rgba(12,11,9,0.94) 80%, transparent 100%)',
              borderTop: '1px solid rgba(255,255,255,0.04)',
            }}>
              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                className="pune-submit-btn"
                style={{
                  width: '100%',
                  background: canSubmit
                    ? 'linear-gradient(180deg, #F36835 0%, #E8541A 100%)'
                    : 'rgba(232,84,26,0.22)',
                  color: '#fff',
                  border: 'none', borderRadius: 100,
                  padding: '15px 24px',
                  fontSize: 14.5, fontWeight: 800, letterSpacing: 0.2,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  minHeight: 50,
                  transition: 'all 0.2s',
                  boxShadow: canSubmit
                    ? '0 12px 38px rgba(232,84,26,0.42), inset 0 1px 0 rgba(255,255,255,0.18)'
                    : 'none',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  fontFamily: 'inherit',
                }}
              >
                {status === 'submitting' ? (
                  <>
                    <Spinner /> Sending inquiry…
                  </>
                ) : (
                  <>
                    Send inquiry. We call you back.
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              <div className="pune-trust" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px 14px', flexWrap: 'wrap',
                marginTop: 12,
                fontSize: 11, color: 'rgba(242,238,231,0.5)',
                fontWeight: 600, letterSpacing: 0.15,
              }}>
                <span style={trustItem}>✓ 4-hour reply</span>
                <span style={dotSep} />
                <span style={trustItem}>No charge until scope is agreed</span>
                <span style={dotSep} />
                <span style={trustItem}>WhatsApp first</span>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .pune-modal-card input::placeholder,
        .pune-modal-card textarea::placeholder {
          color: rgba(242,238,231,0.32);
        }
        /* Belt-and-braces: force the typing caret to brand orange even
           if some other rule (e.g. globals.css) tries to override it.
           Without this, the backdrop-filter layer on the inputs can make
           the caret invisible on some Chromium builds. */
        .pune-modal-card input,
        .pune-modal-card textarea {
          caret-color: #E8541A !important;
        }
        .pune-modal-card input:focus,
        .pune-modal-card textarea:focus,
        .pune-modal-card select:focus {
          outline: none;
          border-color: rgba(232,84,26,0.55) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 0 0 3px rgba(232,84,26,0.14);
        }
        /* CRITICAL: the open dropdown menu of a native <select> is painted
           by the OS, NOT by our CSS background rules above. Without these
           two declarations, options render white-on-white and become
           unreadable. Both Chromium and Safari respect them. */
        .pune-modal-card select option {
          background-color: #14110D;
          color: #F2EEE7;
          padding: 10px 12px;
        }
        .pune-modal-card select option:checked,
        .pune-modal-card select option:hover {
          background: linear-gradient(0deg, rgba(232,84,26,0.95), rgba(232,84,26,0.95)), #14110D;
          color: #fff;
        }
        .pune-modal-card .pune-submit-btn:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
        @media (max-width: 520px) {
          .pune-modal-card { border-radius: 20px !important; }
          .pune-modal-header { padding: 20px 20px 14px !important; }
          .pune-modal-body { padding: 18px 20px 6px !important; gap: 18px !important; }
          .pune-modal-card .pune-h2 { font-size: 20px !important; }
          .pune-trust { font-size: 10.5px !important; gap: 4px 10px !important; }
        }
      `}</style>
    </div>
  );
}

// ── Reusable sub-components ────────────────────────────────────────────

function Section({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <section>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 10,
        marginBottom: 12,
      }}>
        <span style={{
          fontSize: 10.5, fontWeight: 800, letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: 'rgba(232,84,26,0.85)',
        }}>{label}</span>
        <span style={{
          flex: 1, height: 1,
          background: 'linear-gradient(90deg, rgba(232,84,26,0.32) 0%, rgba(232,84,26,0) 100%)',
        }} />
        {hint && <span style={{
          fontSize: 10.5, color: 'rgba(242,238,231,0.4)', fontWeight: 500,
        }} dangerouslySetInnerHTML={{ __html: hint }} />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </section>
  );
}

function Field({
  icon, label, required, value, onChange, placeholder, type = 'text', textarea = false, hint,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 6,
        fontSize: 12, fontWeight: 700, color: 'rgba(242,238,231,0.82)',
        letterSpacing: 0.1,
      }}>
        <span aria-hidden="true" style={{ display: 'inline-flex', color: 'rgba(232,84,26,0.7)' }}>{icon}</span>
        <span>{label}</span>
        {required && <span aria-label="required" style={{ color: '#E8541A', fontWeight: 800 }}>*</span>}
      </div>
      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
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
      {hint && <div style={{ fontSize: 11, color: 'rgba(242,238,231,0.42)', marginTop: 5, lineHeight: 1.45 }}
        dangerouslySetInnerHTML={{ __html: hint }} />}
    </label>
  );
}

function SelectField({
  icon, label, required, value, onChange, options,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 6,
        fontSize: 12, fontWeight: 700, color: 'rgba(242,238,231,0.82)',
        letterSpacing: 0.1,
      }}>
        <span aria-hidden="true" style={{ display: 'inline-flex', color: 'rgba(232,84,26,0.7)' }}>{icon}</span>
        <span>{label}</span>
        {required && <span aria-label="required" style={{ color: '#E8541A', fontWeight: 800 }}>*</span>}
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {options.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    </label>
  );
}

/**
 * Featured card shown at the top of "Shoot details" when the buyer opened
 * the modal from a specific package CTA. Replaces the dropdown with a
 * prominent "You picked: X" treatment so the preselection is unmissable.
 * "Change package" link reveals the dropdown if the buyer changes their mind.
 */
function PickedPackageCard({ pkg, onChange }: { pkg: string; onChange: () => void }) {
  const meta = PACKAGE_META[pkg] ?? { price: '', descriptor: '' };
  // Strip the "(monthly · 18-25 reels)" suffix from the name for cleaner display
  const cleanName = pkg.replace(/\s*\([^)]+\)\s*/g, '').trim();

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 6,
        fontSize: 12, fontWeight: 700, color: 'rgba(242,238,231,0.82)',
        letterSpacing: 0.1,
      }}>
        <span aria-hidden="true" style={{ display: 'inline-flex', color: 'rgba(232,84,26,0.7)' }}><IconTarget /></span>
        <span>What we&rsquo;re crafting for you</span>
        <span aria-label="required" style={{ color: '#E8541A', fontWeight: 800 }}>*</span>
      </div>

      <div style={{
        position: 'relative',
        padding: '14px 16px',
        background: 'linear-gradient(120deg, rgba(232,84,26,0.16) 0%, rgba(232,84,26,0.04) 60%, transparent 100%)',
        border: '1px solid rgba(232,84,26,0.42)',
        borderRadius: 14,
        boxShadow: '0 6px 20px rgba(232,84,26,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>
        {/* Subtle checkmark badge to make the lock-in feel deliberate */}
        <div style={{
          position: 'absolute', top: -8, right: 12,
          padding: '2px 10px 2px 7px',
          background: '#E8541A',
          borderRadius: 100,
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 9.5, fontWeight: 800, letterSpacing: 0.8,
          color: '#fff', textTransform: 'uppercase',
          boxShadow: '0 4px 12px rgba(232,84,26,0.4)',
        }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12l5 5L20 7" />
          </svg>
          You picked
        </div>

        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 16, fontWeight: 800,
          color: '#F2EEE7',
          letterSpacing: '-0.3px',
          lineHeight: 1.2,
          marginTop: 2,
          marginBottom: 4,
        }}>
          {cleanName}
        </div>

        {meta.price && (
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 12.5, fontWeight: 700,
            color: '#E8541A',
            marginBottom: 4,
            letterSpacing: '-0.1px',
          }}>
            {meta.price}
          </div>
        )}

        {meta.descriptor && (
          <div style={{
            fontSize: 12, color: 'rgba(242,238,231,0.65)',
            lineHeight: 1.5,
          }}>
            {meta.descriptor}
          </div>
        )}

        <button
          type="button"
          onClick={onChange}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            marginTop: 10,
            padding: '4px 0',
            background: 'transparent', border: 'none',
            color: 'rgba(242,238,231,0.7)',
            fontSize: 11.5, fontWeight: 700,
            letterSpacing: 0.2,
            cursor: 'pointer',
            fontFamily: 'inherit',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            textDecorationColor: 'rgba(242,238,231,0.3)',
          }}
        >
          Change package
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function SuccessView({ form, onClose }: { form: { fullName: string; phone: string; bestTimeToCall: string }; onClose: () => void }) {
  return (
    <div style={{ padding: '40px 28px 32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      {/* Founder avatar - warmer success */}
      <div style={{
        width: 76, height: 76, borderRadius: '50%',
        margin: '0 auto 18px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(232,84,26,0.20), rgba(139,92,246,0.10))',
        border: '2px solid rgba(232,84,26,0.55)',
        boxShadow: '0 12px 32px rgba(232,84,26,0.25)',
        position: 'relative',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/founder.jpg"
          alt="Lakshya Soni"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 22, height: 22, borderRadius: '50%',
          background: '#10b981',
          border: '3px solid #0C0B09',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 900, color: '#fff',
        }}>✓</div>
      </div>

      <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 8 }}>
        You&rsquo;re in, {form.fullName.split(' ')[0]}.
      </div>
      <p style={{ fontSize: 14, color: 'rgba(242,238,231,0.7)', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 24px' }}>
        I&rsquo;ll WhatsApp <strong style={{ color: '#F2EEE7' }}>{form.phone}</strong>
        {form.bestTimeToCall ? ` around ${form.bestTimeToCall}` : ' within 4 work hours'} to
        lock the shoot details. Email confirmation is on its way too.
      </p>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        padding: '14px 16px',
        maxWidth: 380, margin: '0 auto 22px',
        textAlign: 'left',
        fontSize: 12.5, color: 'rgba(242,238,231,0.7)',
        lineHeight: 1.5,
      }}>
        <NextStep n={1} text="WhatsApp ping from Lakshya (within 4 work hours)" />
        <NextStep n={2} text="15-min call to confirm date, location + scope" />
        <NextStep n={3} text="Razorpay link sent → shoot locked" />
      </div>

      <button
        type="button"
        onClick={onClose}
        style={{
          background: '#E8541A', color: '#fff', border: 'none',
          borderRadius: 100, padding: '13px 28px', fontSize: 14,
          fontWeight: 800, cursor: 'pointer', minHeight: 46,
          boxShadow: '0 8px 28px rgba(232,84,26,0.35)',
          fontFamily: 'inherit',
        }}
      >
        Got it
      </button>
    </div>
  );
}

function NextStep({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{
        flexShrink: 0,
        width: 20, height: 20, borderRadius: '50%',
        background: 'rgba(232,84,26,0.18)',
        color: '#E8541A',
        fontSize: 11, fontWeight: 900,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 1,
      }}>{n}</span>
      <span>{text}</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ animation: 'pune-spin 0.7s linear infinite' }}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <style>{`@keyframes pune-spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

// ── Inline SVG icons (no emoji rendering quirks) ──────────────────────

function IconUser() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>; }
function IconMail() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>; }
function IconPhone() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>; }
function IconTarget() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>; }
function IconCalendar() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>; }
function IconClock() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>; }
function IconNote() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12c0 4.4-4 8-9 8a10 10 0 01-4-.8L3 21l1.8-5A8 8 0 013 12c0-4.4 4-8 9-8s9 3.6 9 8z" /></svg>; }

// ── Shared styles ─────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  fontSize: 14.5,
  borderRadius: 12,
  // Apple glass field: translucent fill + backdrop blur + inset highlight
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.2)',
  color: '#F2EEE7',
  // Brand-orange typing caret. Browser default is `auto` which inherits
  // the text color, but the `backdrop-filter: blur` above causes some
  // Chromium builds to render the caret behind the glass layer and it
  // disappears. Explicit caret-color forces the browser to draw it on
  // top of every layer.
  caretColor: '#E8541A',
  fontFamily: 'inherit',
  resize: 'vertical' as const,
  minHeight: 46,
  transition: 'border-color 0.18s, box-shadow 0.18s, background 0.18s',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  // Tell the browser to render native UI chrome (the open dropdown menu)
  // in dark mode so options aren't invisible white-on-white
  colorScheme: 'dark' as const,
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'7\' viewBox=\'0 0 10 7\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%23E8541A\' fill=\'none\' stroke-width=\'1.8\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 34,
  cursor: 'pointer',
};

const trustItem: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  whiteSpace: 'nowrap',
};

const dotSep: React.CSSProperties = {
  width: 3, height: 3, borderRadius: '50%',
  background: 'rgba(232,84,26,0.4)',
};
