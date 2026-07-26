'use client';

import type { AuthorityCase } from '@/lib/icpData';
import Reveal from './Reveal';

/**
 * ICPAuthority — the education + persuasion section of each outreach page.
 *
 * The psychology this section runs, in order:
 *   1. Reframe (intro): shift how the reader sees their problem — the sale
 *      happens in the reframe, not the pitch.
 *   2. Evidence (stats): sourced numbers only. A stat with a named source
 *      raises trust; an unsourced one lowers it. Some segments have no
 *      citable figure, so `stats` is optional and the layout holds without it.
 *   3. Completeness (split): two-column "both sides of your world" framing —
 *      seller/buyer, before/after, chasing/found. Shows we understand the
 *      whole job, not just the deliverable.
 *   4. Closure (takeaway): one line that hands them the conclusion.
 *
 * Mobile-first: single column by default, the split stacks, stats go 2-up.
 * The two-column desktop layout is applied at ≥820px, not the reverse.
 */
export default function ICPAuthority({
  data,
  accent,
}: {
  data: AuthorityCase;
  accent: string;
}) {
  return (
    <section className="auth-section">
      <div className="auth-container">
        <Reveal>
          <div className="auth-eyebrow">
            <span className="auth-eyebrow-rule" style={{ background: accent }} />
            {data.eyebrow}
          </div>
          <h2 className="auth-h2">
            {data.headline} <span style={{ color: accent }}>{data.headlineAccent}</span>
          </h2>
        </Reveal>

        <div className="auth-intro">
          {data.intro.map((p, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <p className="auth-p">{p}</p>
            </Reveal>
          ))}
        </div>

        {data.stats && data.stats.length > 0 && (
          <Reveal>
            <div className={`auth-stats auth-stats-${data.stats.length}`}>
              {data.stats.map((s) => (
                <div key={s.label} className="auth-stat">
                  <div className="auth-stat-num" style={{ color: accent }}>{s.value}</div>
                  <div className="auth-stat-label">{s.label}</div>
                  <div className="auth-stat-src">{s.source}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <div className="auth-split">
          {[data.split.left, data.split.right].map((side, i) => (
            <Reveal key={side.tag} delay={0.06 * i}>
              <div className="auth-side" style={i === 1 ? { borderColor: `${accent}33`, background: `${accent}07` } : undefined}>
                <span className="auth-side-tag" style={{ color: i === 1 ? accent : '#8b8780' }}>
                  {side.tag}
                </span>
                <h3 className="auth-side-title">{side.title}</h3>
                <ul className="auth-points">
                  {side.points.map((pt) => (
                    <li key={pt}>
                      <span className="auth-point-dot" style={{ background: i === 1 ? accent : 'rgba(12,12,11,0.25)' }} aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="auth-takeaway">
            <span className="auth-takeaway-rule" style={{ background: accent }} aria-hidden="true" />
            {data.takeaway}
          </p>
        </Reveal>
      </div>

      <style>{`
        .auth-section { background: #F2EEE7; color: #0C0C0B; padding: 72px 0; }
        .auth-container { max-width: 1180px; margin: 0 auto; padding: 0 20px; }

        .auth-eyebrow {
          display: inline-flex; align-items: center; gap: 14px;
          font-size: 10px; font-weight: 600; letter-spacing: 4px;
          text-transform: uppercase; color: #6E6B63; margin-bottom: 18px;
        }
        .auth-eyebrow-rule { width: 22px; height: 1px; display: block; }
        .auth-h2 {
          font-family: Inter, sans-serif; font-weight: 900;
          font-size: clamp(30px, 4.4vw, 58px);
          letter-spacing: -0.035em; line-height: 1.02; margin: 0;
        }

        .auth-intro { margin-top: 28px; max-width: 820px; }
        .auth-p {
          font-size: clamp(15.5px, 1.5vw, 18px); line-height: 1.75;
          color: #3E3D3A; margin: 0 0 18px;
        }

        .auth-stats {
          display: grid; gap: 1px; margin: 36px 0 8px;
          background: rgba(12,12,11,0.10);
          border: 1px solid rgba(12,12,11,0.10);
          border-radius: 18px; overflow: hidden;
        }
        .auth-stats-3 { grid-template-columns: repeat(3, 1fr); }
        .auth-stats-4 { grid-template-columns: repeat(4, 1fr); }
        .auth-stat { background: #F2EEE7; padding: 26px 22px; }
        .auth-stat-num {
          font-family: Inter, sans-serif; font-weight: 900;
          font-size: clamp(30px, 3.4vw, 44px); letter-spacing: -1.5px;
          line-height: 1; margin-bottom: 10px;
        }
        .auth-stat-label { font-size: 13px; line-height: 1.5; color: #4A4740; }
        .auth-stat-src { font-size: 10.5px; color: #A8A49B; margin-top: 8px; }

        .auth-split { display: grid; grid-template-columns: 1fr; gap: 14px; margin-top: 36px; }
        .auth-side {
          border: 1px solid rgba(12,12,11,0.10); border-radius: 18px;
          background: rgba(255,255,255,0.5); padding: 26px 24px; height: 100%;
        }
        .auth-side-tag {
          font-size: 10px; font-weight: 800; letter-spacing: 2px;
          text-transform: uppercase;
        }
        .auth-side-title {
          font-family: Inter, sans-serif; font-size: 19px; font-weight: 800;
          letter-spacing: -0.4px; margin: 10px 0 16px;
        }
        .auth-points { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 13px; }
        .auth-points li {
          display: flex; gap: 11px; align-items: flex-start;
          font-size: 14px; line-height: 1.6; color: #4A4740;
        }
        .auth-point-dot {
          flex-shrink: 0; width: 6px; height: 6px; border-radius: 50%;
          margin-top: 7px; display: block;
        }

        .auth-takeaway {
          display: flex; gap: 16px; align-items: flex-start;
          margin: 40px 0 0; max-width: 760px;
          font-family: Inter, sans-serif;
          font-size: clamp(16.5px, 1.8vw, 21px); font-weight: 700;
          letter-spacing: -0.4px; line-height: 1.5; color: #0C0C0B;
        }
        .auth-takeaway-rule {
          flex-shrink: 0; width: 3px; border-radius: 3px; align-self: stretch;
        }

        /* ── Desktop enhancements (mobile is the default) ── */
        @media (min-width: 820px) {
          .auth-section { padding: 104px 0; }
          .auth-container { padding: 0 56px; }
          .auth-split { grid-template-columns: 1fr 1fr; gap: 16px; }
          .auth-side { padding: 32px 30px; }
        }
        @media (max-width: 640px) {
          .auth-stats-3, .auth-stats-4 { grid-template-columns: 1fr 1fr; }
          .auth-stat { padding: 20px 16px; }
        }
      `}</style>
    </section>
  );
}
