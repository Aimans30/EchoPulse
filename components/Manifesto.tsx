import { PRESENCE, PROMISES } from '@/lib/pricing';

/**
 * "How it works in one week". Replaces the four slogan lines that used to sit
 * here. Three facts a buyer can check, taken from lib/pricing.ts: the counts
 * are PRESENCE.scope, the timings are PROMISES. If those change, change this.
 * The export keeps the name Manifesto so HomeClient's import still works.
 */
const columns = [
  {
    title: 'What you send',
    lines: [
      'Raw footage from your phone, a link, or 10 minutes of your time.',
      'On the monthly plan, add a 20 to 30 minute call each week.',
    ],
  },
  {
    title: 'What comes back',
    lines: [
      'Each month on the ' + PRESENCE.priceLabel + ' plan: 8 to 9 short-form videos, 8 photo or carousel posts and up to 5 extra clips cut from footage you already have.',
      'A website tune-up in month one, then upgrades.',
    ],
  },
  {
    title: 'When',
    lines: [
      PROMISES.turnaround + '.',
      PROMISES.replies + '.',
    ],
  },
];

export default function Manifesto() {
  return (
    <section className="mf-section" aria-labelledby="mf-heading">
      <style>{`
        .mf-section { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; padding: 72px 24px 64px; }
        .mf-wrap { max-width: 1120px; margin: 0 auto; }
        .mf-h2 { font-size: clamp(30px, 4.2vw, 48px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; margin: 0 0 32px; max-width: 20ch; }
        .mf-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .mf-item { border-top: 2px solid #0C0C0B; padding: 20px 8px 0 0; }
        .mf-num { font-size: 13px; font-weight: 700; letter-spacing: 0.04em; color: #B23A0C; margin: 0 0 8px; }
        .mf-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; }
        .mf-item p.mf-line { font-size: 16px; line-height: 1.6; color: #2E2C28; margin: 0 0 8px; max-width: 62ch; }
        @media (max-width: 800px) {
          .mf-section { padding: 56px 16px 56px; }
          .mf-h2 { margin-bottom: 28px; }
          .mf-list { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>
      <div className="mf-wrap">
        <h2 id="mf-heading" className="mf-h2">How it works in one week</h2>
        <ol className="mf-list">
          {columns.map((c, i) => (
            <li key={c.title} className="mf-item">
              <p className="mf-num">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mf-title">{c.title}</h3>
              {c.lines.map((l) => (
                <p key={l} className="mf-line">{l}</p>
              ))}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
