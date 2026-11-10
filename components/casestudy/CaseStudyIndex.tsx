'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { CaseStudy } from '@/lib/caseStudyData';
import { BOOK_CALL_URL, BOOK_CALL_LABEL, BOOK_CALL_REASSURANCE } from '@/lib/links';
import Reveal from '@/components/icp/Reveal';
import ImpressionChart from './ImpressionChart';

/**
 * Case studies hub.
 *
 * THE n=1 PROBLEM
 *
 * There is one published case study. A conventional three-up card grid with a
 * single card in it reads as an abandoned section and costs more trust than it
 * earns. So the layout does not pretend to be a grid: the one study is a full
 * width feature carrying its actual chart, and the space underneath is used to
 * state the standard every entry has to meet before it is published here.
 *
 * That panel is doing real work rather than filling space. It tells a reader
 * who has been shown fake numbers before exactly what rules this page follows,
 * which is the claim a studio with one client can actually support. When the
 * second and third studies land, the feature becomes a list and the standards
 * panel moves below it without needing a redesign.
 */

const STANDARDS = [
  {
    title: 'The client is named and linked',
    detail:
      'Every case study names the company and links the live site. Anonymous case studies exist because the numbers cannot survive being checked.',
  },
  {
    title: 'Every claim is checkable, or it is not made',
    detail:
      'A figure traces to a named instrument, a date window and an export we still hold. Where an engagement produced no measurement, the study says so plainly instead of reaching for a number.',
  },
  {
    title: 'The metrics that went the wrong way are printed too',
    detail:
      'Where a number moved against us inside the window, it is in the table with the others and explained rather than left out.',
  },
  {
    title: 'Every study carries its open problems',
    detail:
      'The current broken list on the account is published at the bottom of the page. It is the section that makes the rest of it believable.',
  },
];

export default function CaseStudyIndex({ studies }: { studies: CaseStudy[] }) {
  return (
    <main className="csi-root">
      <section className="csi-hero">
        <div className="csi-container">
          <nav className="csi-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Case studies</span>
          </nav>
          <Reveal>
            <p className="csi-eyebrow">Case studies</p>
            <h1 className="csi-h1">
              Named clients, real exports, <span className="csi-accent">and the parts that are still broken.</span>
            </h1>
            <p className="csi-sub">
              We publish one case study per client, only with their consent, and only where the claim is
              something you can check: an export we still hold, or a live site you can open right now. There
              are not many of them yet. The ones here are real, and each one ends with what is still wrong.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Every study gets the same full-width treatment, stacked.
          A feature-plus-grid layout looks deliberate at four studies and
          broken at one or two, because the grid always has an orphan in it.
          Stacking never has that problem at any count, and it lets each card
          show the evidence it actually has: the impressions curve where one
          was measured, the old screen where the result is something you look
          at instead. */}
      <section className="csi-section">
        <div className="csi-container">
          <div className="csi-stack">
            {studies.map((s, i) => (
              <Reveal key={s.slug} delay={Math.min(i * 0.06, 0.2)}>
                <Link href={`/case-studies/${s.slug}`} className="csi-feature">
                  <div className="csi-feature-head">
                    <div>
                      <p className="csi-feature-client">{s.client}</p>
                      <p className="csi-feature-industry">{s.industry}</p>
                    </div>
                    <span className="csi-feature-window">{s.windowLabel}</span>
                  </div>

                  <h2 className="csi-feature-title">
                    {s.headline} <span className="csi-accent">{s.headlineAccent}</span>
                  </h2>

                  {s.chart && (
                    <div className="csi-feature-chart" aria-hidden="true">
                      <ImpressionChart chart={s.chart} />
                    </div>
                  )}

                  {!s.chart && s.comparison && (
                    <div className="csi-feature-shot">
                      <Image
                        src={s.comparison.beforeSrc}
                        alt={s.comparison.beforeAlt}
                        width={s.comparison.beforeWidth}
                        height={s.comparison.beforeHeight}
                        sizes="(max-width: 760px) 100vw, 1100px"
                      />
                      <span className="csi-shot-tag">{s.comparison.beforeLabel}</span>
                    </div>
                  )}

                  <div className="csi-feature-metrics">
                    {s.heroMetrics.slice(0, 3).map((m) => (
                      <div key={m.label}>
                        <p className="csi-metric-value">{m.value}</p>
                        <p className="csi-metric-label">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <ul className="csi-feature-services">
                    {s.services.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>

                  <span className="csi-feature-cta">
                    Read the full case study, including the open problems
                    <span aria-hidden="true"> &rarr;</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="csi-section csi-section-standards">
        <div className="csi-container">
          <Reveal>
            <p className="csi-kicker">The standard</p>
            <h2 className="csi-h2">What has to be true before anything is published here.</h2>
          </Reveal>
          <div className="csi-standards">
            {STANDARDS.map((s, i) => (
              <Reveal key={s.title} delay={Math.min(i * 0.05, 0.2)}>
                <div className="csi-standard">
                  <span className="csi-standard-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="csi-standard-title">{s.title}</h3>
                  <p className="csi-standard-detail">{s.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="csi-close" id="book-call">
        <div className="csi-container">
          <Reveal>
            <h2 className="csi-h2 csi-h2-light">
              Your site, read the same way <span className="csi-accent">on a 15 minute call.</span>
            </h2>
            <p className="csi-sub csi-sub-tight">
              We open your Search Console, tell you what is structurally stopping the site from ranking, and
              leave you with a 30 day plan. You keep the plan whether or not you hire us.
            </p>
            <a className="csi-btn" href={BOOK_CALL_URL} target="_blank" rel="noopener">
              {BOOK_CALL_LABEL}
            </a>
            <p className="csi-reassure">{BOOK_CALL_REASSURANCE}</p>
          </Reveal>
        </div>
      </section>

      <style>{`
        .csi-root { background: var(--cream); color: var(--black); }
        .csi-container { max-width: 1180px; margin: 0 auto; padding: 0 32px; }

        .csi-hero { background: var(--black); color: var(--cream); padding: 40px 0 76px; }
        .csi-crumb { display: flex; gap: 10px; align-items: center; font-family: Inter, sans-serif; font-size: 13px; color: rgba(242,238,231,0.5); margin-bottom: 44px; }
        .csi-crumb a { color: rgba(242,238,231,0.72); text-decoration: none; }
        .csi-crumb a:hover { color: var(--orange); }
        .csi-eyebrow { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--orange); margin: 0 0 20px; }
        .csi-h1 { font-family: Inter, sans-serif; font-size: clamp(34px, 5.4vw, 60px); font-weight: 800; letter-spacing: -2px; line-height: 1.06; margin: 0 0 24px; max-width: 20ch; }
        .csi-accent { color: var(--orange); }
        .csi-sub { font-size: 17.5px; line-height: 1.68; color: rgba(242,238,231,0.72); max-width: 62ch; margin: 0; }
        .csi-sub-tight { margin-bottom: 34px; }

        .csi-section { padding: 76px 0; }
        .csi-section-standards { padding-top: 0; }

        /* Featured study */
        .csi-feature { display: block; border: 1px solid var(--border); border-radius: 26px; background: var(--black); padding: 36px 34px; text-decoration: none; color: var(--cream); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease; }
        .csi-feature:hover { transform: translateY(-3px); box-shadow: 0 18px 46px rgba(12,12,11,0.16); }
        .csi-feature-head { display: flex; flex-wrap: wrap; gap: 14px 28px; align-items: baseline; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid rgba(242,238,231,0.14); }
        .csi-feature-client { font-family: Inter, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.6px; margin: 0 0 5px; }
        .csi-feature-industry { font-size: 13.5px; color: rgba(242,238,231,0.55); margin: 0; }
        .csi-feature-window { font-family: ui-monospace, monospace; font-size: 12.5px; color: rgba(242,238,231,0.5); white-space: nowrap; }
        .csi-feature-title { font-family: Inter, sans-serif; font-size: clamp(26px, 3.4vw, 40px); font-weight: 800; letter-spacing: -1.4px; line-height: 1.12; margin: 28px 0 28px; max-width: 18ch; }
        .csi-feature-chart { border: 1px solid rgba(242,238,231,0.12); border-radius: 16px; padding: 16px 12px 10px; background: rgba(242,238,231,0.02); }

        /* Cropped to a band rather than shown whole. These are full-page
           captures 1600px tall; at card width the whole thing would be a
           postage stamp. The top of the page is the part being argued about. */
        .csi-feature-shot { position: relative; border: 1px solid rgba(242,238,231,0.12); border-radius: 16px; overflow: hidden; height: 260px; background: #fff; }
        .csi-feature-shot img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
        .csi-shot-tag { position: absolute; top: 14px; left: 14px; font-family: Inter, sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; padding: 6px 12px; border-radius: 100px; background: rgba(12,12,11,0.78); color: rgba(242,238,231,0.92); border: 1px solid rgba(242,238,231,0.22); }

        .csi-stack { display: grid; gap: 22px; }

        .csi-feature-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 28px 0 0; padding-top: 26px; border-top: 1px solid rgba(242,238,231,0.14); }
        .csi-metric-value { font-family: Inter, sans-serif; font-size: clamp(20px, 2.2vw, 28px); font-weight: 800; letter-spacing: -1px; color: var(--orange); margin: 0 0 8px; }
        .csi-metric-label { font-size: 13px; line-height: 1.5; color: rgba(242,238,231,0.7); margin: 0; }

        .csi-feature-services { list-style: none; display: flex; flex-wrap: wrap; gap: 7px; padding: 0; margin: 26px 0 0; }
        .csi-feature-services li { font-family: Inter, sans-serif; font-size: 12px; font-weight: 600; color: rgba(242,238,231,0.66); border: 1px solid rgba(242,238,231,0.16); border-radius: 100px; padding: 6px 12px; }

        .csi-feature-cta { display: inline-block; margin-top: 28px; font-family: Inter, sans-serif; font-size: 14.5px; font-weight: 700; color: var(--orange); }

        /* Additional studies, used once there is more than one */
        .csi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
        .csi-card { display: block; border: 1px solid var(--border); border-radius: 20px; background: rgba(255,255,255,0.55); padding: 28px 26px; text-decoration: none; color: var(--black); height: 100%; transition: transform 0.25s cubic-bezier(0.16,1,0.3,1); }
        .csi-card:hover { transform: translateY(-3px); }
        .csi-card-client { font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 5px; }
        .csi-card-industry { font-size: 13px; color: var(--grey); margin: 0 0 18px; }
        .csi-card-title { font-family: Inter, sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -0.6px; line-height: 1.24; margin: 0 0 16px; }
        .csi-card-window { font-family: ui-monospace, monospace; font-size: 12px; color: var(--grey2); margin: 0; }

        /* Standards */
        .csi-kicker { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--orange); margin: 0 0 16px; }
        .csi-h2 { font-family: Inter, sans-serif; font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -1.3px; line-height: 1.14; margin: 0 0 32px; max-width: 22ch; }
        .csi-h2-light { color: var(--cream); }
        .csi-standards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .csi-standard { border: 1px solid var(--border); border-radius: 18px; background: rgba(255,255,255,0.5); padding: 26px 24px; height: 100%; }
        .csi-standard-num { font-family: ui-monospace, monospace; font-size: 12.5px; font-weight: 700; color: var(--orange); }
        .csi-standard-title { font-family: Inter, sans-serif; font-size: 16px; font-weight: 800; letter-spacing: -0.4px; margin: 12px 0 10px; }
        .csi-standard-detail { font-size: 13.5px; line-height: 1.66; color: var(--grey); margin: 0; }

        /* Close */
        .csi-close { background: var(--black); color: var(--cream); padding: 84px 0; }
        .csi-btn { display: inline-block; background: var(--orange); color: #fff; font-family: Inter, sans-serif; font-size: 16px; font-weight: 700; border-radius: 100px; padding: 17px 34px; text-decoration: none; transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease; }
        .csi-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(232,84,26,0.34); }
        .csi-reassure { font-size: 13.5px; color: rgba(242,238,231,0.55); margin: 14px 0 0; }

        @media (max-width: 1000px) {
          .csi-standards { grid-template-columns: repeat(2, 1fr); }
          .csi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 760px) {
          .csi-container { padding: 0 20px; }
          .csi-hero { padding: 28px 0 56px; }
          .csi-section { padding: 56px 0; }
          .csi-close { padding: 64px 0; }
          .csi-h1 { letter-spacing: -1.3px; max-width: none; }
          .csi-feature { padding: 26px 22px; border-radius: 20px; }
          .csi-feature-chart { padding: 12px 8px 8px; }
          .csi-feature-metrics { grid-template-columns: 1fr; gap: 16px; }
          .csi-standards, .csi-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
