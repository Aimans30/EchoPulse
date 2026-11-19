'use client';

import type { ReactNode } from 'react';
import type { AuthorityCase } from '@/lib/icpData';
import Reveal from './Reveal';
import Prose from './Prose';

/**
 * ICPAuthority: the education section of each audience page.
 *
 * The psychology runs in order: reframe (heading and intro), sourced evidence
 * (stats), completeness (both sides of the buyer's world) and closure (one
 * takeaway line). Laid out on the shared funnel grid: heading left and short
 * paragraphs right, then the figures, the two sides and the takeaway at full
 * container width. Styling comes from FUNNEL_CSS, injected by the page.
 */
export default function ICPAuthority({
  data,
  accent,
  footer,
}: {
  data: AuthorityCase;
  accent: string;
  /** Optional block closing the section (the real estate founder background). */
  footer?: ReactNode;
}) {
  return (
    <section className="fn-section fn-paper auth">
      <div className="fn-container">
        <div className="fn-split">
          <Reveal className="fn-split-sticky">
            <p className="fn-eyebrow" style={{ color: accent }}>{data.eyebrow}</p>
            <h2 className="fn-h2">
              {data.headline} <span style={{ color: accent }}>{data.headlineAccent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <Prose paragraphs={data.intro} />
          </Reveal>
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

        <div className={`fn-grid fn-grid-2 auth-split${data.stats && data.stats.length > 0 ? '' : ' auth-split-solo'}`}>
          {[data.split.left, data.split.right].map((side, i) => (
            <Reveal key={side.tag} delay={0.06 * i}>
              <div className="fn-card" style={i === 1 ? { borderColor: `${accent}40`, background: `${accent}08` } : undefined}>
                <span className="auth-side-tag" style={{ color: i === 1 ? accent : '#6E6B63' }}>
                  {side.tag}
                </span>
                <h3 className="fn-h3 auth-side-title">{side.title}</h3>
                <ul className="auth-points">
                  {side.points.map((pt) => (
                    <li key={pt}>
                      <span className="auth-point-dot" style={{ background: i === 1 ? accent : 'rgba(12,12,11,0.3)' }} aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="auth-takeaway" style={{ borderLeftColor: accent }}>
            {data.takeaway}
          </p>
        </Reveal>

        {footer ? <Reveal>{footer}</Reveal> : null}
      </div>

      <style>{`
        .auth-stats { display: grid; gap: 1px; margin-top: 80px; background: rgba(12,12,11,0.12); border: 1px solid rgba(12,12,11,0.12); border-radius: 16px; overflow: hidden; }
        .auth-stats-2 { grid-template-columns: repeat(2, 1fr); }
        .auth-stats-3 { grid-template-columns: repeat(3, 1fr); }
        .auth-stats-4 { grid-template-columns: repeat(4, 1fr); }
        .auth-stat { background: #fff; padding: 32px; }
        .auth-stat-num { font-weight: 900; font-size: clamp(36px, 3.6vw, 48px); letter-spacing: -0.04em; line-height: 1; margin-bottom: 16px; }
        .auth-stat-label { font-size: 15px; line-height: 1.5; color: #3E3D3A; }
        .auth-stat-src { font-size: 12px; line-height: 1.4; color: #8B8780; margin-top: 8px; }

        .auth-split { margin-top: 16px; }
        .auth-split-solo { margin-top: 80px; }
        .auth-side-tag { font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
        .auth-side-title { margin: 8px 0 24px; }
        .auth-points { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
        .auth-points li { display: flex; gap: 12px; align-items: flex-start; font-size: 16px; line-height: 1.6; color: #3E3D3A; }
        .auth-point-dot { flex-shrink: 0; width: 6px; height: 6px; border-radius: 50%; margin-top: 10px; display: block; }

        .auth-takeaway { margin: 56px 0 0; max-width: 760px; padding-left: 24px; border-left: 3px solid; font-size: clamp(18px, 1.8vw, 22px); font-weight: 700; letter-spacing: -0.01em; line-height: 1.5; color: #0C0C0B; }

        @media (max-width: 1024px) {
          .auth-stats-4 { grid-template-columns: repeat(2, 1fr); }
          .auth-stats { margin-top: 56px; }
          .auth-split-solo { margin-top: 56px; }
        }
        @media (max-width: 768px) {
          .auth-stats-3, .auth-stats-4 { grid-template-columns: 1fr 1fr; }
          .auth-stat { padding: 24px 16px; }
          .auth-stats > *:last-child:nth-child(odd) { grid-column: 1 / -1; }
          .auth-points li { font-size: 15px; }
          .auth-takeaway { margin-top: 40px; padding-left: 16px; }
        }
      `}</style>
    </section>
  );
}
