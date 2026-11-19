import Link from 'next/link';
import { FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';
import { PILOT, PRESENCE } from '@/lib/pricing';

/**
 * "How the first 14 days go". Steps mirror lib/pricing.ts: FREE_SAMPLE (2
 * edits in 48 hours), PILOT (14 days, exact scope counts), then PRESENCE or
 * stop. One button only, FREE_EDITS_LABEL.
 */
const steps = [
  {
    when: 'Within 48 hours',
    title: 'Send footage, get 2 edits back',
    body: 'Send a talk, a podcast, a listing tour or a phone clip. You get 2 edited short-form videos back within 48 hours. No card, no call, and you keep the files.',
  },
  {
    when: '14 days',
    title: `The ${PILOT.priceLabel} Pilot`,
    body: 'A recorded 60 minute onboarding session, then 6 short-form video edits, 2 static or carousel posts and 1 long-form SEO blog of 1,500 words. You also get a content audit and a 30-day plan. Short-form edits come back in 48 hours.',
  },
  {
    when: 'After day 14',
    title: 'Continue or stop',
    body: `Move to the Presence Engine from ${PRESENCE.priceLabel} a month, month to month. Or stop. You keep everything we made either way.`,
  },
];

export default function Process() {
  return (
    <section className="pr-section" aria-labelledby="pr-heading">
      <style>{`
        .pr-section { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; padding: 72px 24px; }
        .pr-wrap { max-width: 1120px; margin: 0 auto; }
        .pr-h2 { font-size: clamp(30px, 4.2vw, 48px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; margin: 0 0 32px; max-width: 20ch; }
        .pr-list { list-style: none; margin: 0; padding: 0; border-top: 2px solid #0C0C0B; }
        .pr-step { display: grid; grid-template-columns: 48px 200px minmax(0, 1fr); gap: 24px; padding: 20px 0; border-bottom: 1px solid rgba(12,12,11,0.14); }
        .pr-num { font-size: 13px; font-weight: 700; letter-spacing: 0.04em; color: #B23A0C; padding-top: 6px; }
        .pr-when { font-size: 14px; font-weight: 700; color: #4A4740; padding-top: 5px; }
        .pr-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25; margin: 0 0 8px; }
        .pr-body { font-size: 16px; line-height: 1.6; color: #2E2C28; margin: 0; max-width: 62ch; }
        .pr-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 26px; margin-top: 28px; border-radius: 100px; background: #0C0C0B; color: #F2EEE7; border: 1px solid #0C0C0B; font-size: 14px; font-weight: 700; text-decoration: none; transition: background 0.2s ease, color 0.2s ease; }
        .pr-btn:hover { background: #E8541A; border-color: #E8541A; color: #0C0C0B; }
        .pr-btn:focus-visible { outline: 3px solid #E8541A; outline-offset: 3px; }
        @media (max-width: 760px) {
          .pr-section { padding: 56px 16px; }
          .pr-h2 { margin-bottom: 28px; }
          .pr-step { grid-template-columns: 40px minmax(0, 1fr); gap: 4px 12px; padding: 24px 0; }
          .pr-when, .pr-content { grid-column: 2; }
          .pr-when { padding-top: 0; }
          .pr-num { grid-row: 1; }
        }
        @media (prefers-reduced-motion: reduce) { .pr-btn { transition: none; } }
      `}</style>
      <div className="pr-wrap">
        <h2 id="pr-heading" className="pr-h2">How the first 14 days go</h2>
        <ol className="pr-list">
          {steps.map((s, i) => (
            <li key={s.title} className="pr-step">
              <span className="pr-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="pr-when">{s.when}</span>
              <div className="pr-content">
                <h3 className="pr-title">{s.title}</h3>
                <p className="pr-body">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link href={FREE_EDITS_URL} data-track-location="process_section" className="pr-btn">{FREE_EDITS_LABEL}</Link>
      </div>
    </section>
  );
}
