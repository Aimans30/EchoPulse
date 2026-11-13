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
 * Layout: the first study is a large featured card (text left, evidence chart
 * right). Every other study is an image-led card in a two column grid. If the
 * remaining count is odd, the last card spans both columns in a horizontal
 * layout so the grid never ends on an orphan gap.
 *
 * The standards panel states the rules every entry has to meet before it is
 * published here.
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

const CLIENT_CTA = 'Read the full case study, including the open problems';
const FOUNDER_CTA = 'Read the founder story';

type Visual = { src: string; alt: string; width: number; height: number; tag?: string; position: string };

function visualFor(s: CaseStudy): Visual | null {
  if (s.comparison) {
    return {
      src: s.comparison.beforeSrc,
      alt: s.comparison.beforeAlt,
      width: s.comparison.beforeWidth,
      height: s.comparison.beforeHeight,
      tag: s.comparison.beforeLabel,
      position: 'top center',
    };
  }
  if (s.heroMedia) {
    return {
      src: s.heroMedia.src,
      alt: s.heroMedia.alt,
      width: s.heroMedia.width,
      height: s.heroMedia.height,
      position: '50% 48%',
    };
  }
  return null;
}

function Metrics({ study }: { study: CaseStudy }) {
  const items = study.heroMetrics.slice(0, 3);
  if (items.length === 0) return null;
  return (
    <dl className="csi-metrics">
      {items.map((m) => (
        <div key={m.label} className="csi-metric">
          <dd className="csi-metric-value">{m.value}</dd>
          <dt className="csi-metric-label">{m.label}</dt>
        </div>
      ))}
    </dl>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="csi-chips">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

function Cta({ study }: { study: CaseStudy }) {
  return (
    <span className="csi-cta">
      {study.kind === 'founder' ? FOUNDER_CTA : CLIENT_CTA}
      <span aria-hidden="true" className="csi-cta-arrow"> &rarr;</span>
    </span>
  );
}

function Featured({ study }: { study: CaseStudy }) {
  const visual = study.chart ? null : visualFor(study);
  return (
    <Link href={`/case-studies/${study.slug}`} className="csi-card csi-featured">
      <div className="csi-featured-text">
        <div className="csi-meta">
          <div>
            <p className="csi-client">{study.client}</p>
            <p className="csi-industry">{study.industry}</p>
          </div>
          <span className="csi-window">{study.windowLabel}</span>
        </div>
        <h2 className="csi-title csi-title-lg">
          {study.headline} <span className="csi-accent">{study.headlineAccent}</span>
        </h2>
        <Metrics study={study} />
        <Chips items={study.services} />
        <Cta study={study} />
      </div>
      <div className="csi-featured-visual">
        {study.chart && (
          <div className="csi-chart" aria-hidden="true">
            <ImpressionChart chart={study.chart} />
          </div>
        )}
        {visual && (
          <div className="csi-media csi-media-fill">
            <Image
              src={visual.src}
              alt={visual.alt}
              width={visual.width}
              height={visual.height}
              sizes="(max-width: 900px) 100vw, 560px"
              style={{ objectPosition: visual.position }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}

function StudyCard({ study, wide }: { study: CaseStudy; wide: boolean }) {
  const visual = visualFor(study);
  const founder = study.kind === 'founder';
  const eyebrow = study.labels?.eyebrowIndex ?? (founder ? study.eyebrow : study.client);
  return (
    <Link href={`/case-studies/${study.slug}`} className={`csi-card csi-study${wide ? ' is-wide' : ''}`}>
      {visual && (
        <div className="csi-media">
          <Image
            src={visual.src}
            alt={visual.alt}
            width={visual.width}
            height={visual.height}
            sizes={wide ? '(max-width: 900px) 100vw, 520px' : '(max-width: 900px) 100vw, 580px'}
            style={{ objectPosition: visual.position }}
          />
          {visual.tag && <span className="csi-tag">{visual.tag}</span>}
        </div>
      )}
      <div className="csi-study-body">
        {founder ? (
          <p className="csi-badge">{eyebrow}</p>
        ) : (
          <>
            <p className="csi-client">{study.client}</p>
            <p className="csi-industry">{study.industry}</p>
          </>
        )}
        <h2 className="csi-title">
          {study.headline} <span className="csi-accent">{study.headlineAccent}</span>
        </h2>
        <Metrics study={study} />
        <Chips items={study.services} />
        <Cta study={study} />
      </div>
    </Link>
  );
}

export default function CaseStudyIndex({ studies }: { studies: CaseStudy[] }) {
  const [first, ...rest] = studies;
  const oddRest = rest.length % 2 === 1;
  const lead = studies[0]?.heroMetrics[0];

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
              One case study per client, only with their consent, and only where the claim can be checked: an
              export we still hold, or a live site you can open right now. There are not many yet. Each one
              ends with what is still wrong.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <dl className="csi-proof">
              {lead && (
                <div>
                  <dd className="csi-proof-value">{lead.value}</dd>
                  <dt className="csi-proof-label">{lead.label}</dt>
                </div>
              )}
              <div>
                <dd className="csi-proof-value">{studies.length}</dd>
                <dt className="csi-proof-label">studies published</dt>
              </div>
              <div>
                <dd className="csi-proof-value">Real</dd>
                <dt className="csi-proof-label">exports published</dt>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="csi-section" aria-label="Published studies">
        <div className="csi-container">
          {first && (
            <Reveal>
              <Featured study={first} />
            </Reveal>
          )}
          {rest.length > 0 && (
            <div className="csi-grid">
              {rest.map((s, i) => (
                <Reveal
                  key={s.slug}
                  delay={Math.min(i * 0.07, 0.2)}
                  className={`csi-cell${oddRest && i === rest.length - 1 ? ' is-wide' : ''}`}
                >
                  <StudyCard study={s} wide={oddRest && i === rest.length - 1} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="csi-section csi-section-standards">
        <div className="csi-container">
          <Reveal>
            <p className="csi-kicker">The standard</p>
            <h2 className="csi-h2">What has to be true before anything is published here.</h2>
          </Reveal>
          <ol className="csi-standards">
            {STANDARDS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={Math.min(i * 0.05, 0.2)} className="csi-standard-cell">
                <div className="csi-standard">
                  <span className="csi-standard-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="csi-standard-title">{s.title}</h3>
                  <p className="csi-standard-detail">{s.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>
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
        .csi-root { --csi-ink-orange: #B5400F; background: var(--cream); color: var(--black); overflow-x: clip; }
        .csi-container { max-width: 1180px; margin: 0 auto; padding: 0 32px; }
        .csi-accent { color: var(--orange); }

        /* Hero */
        .csi-hero { background: var(--black); color: var(--cream); padding: 40px 0 72px; }
        .csi-crumb { display: flex; gap: 10px; align-items: center; font-family: Inter, sans-serif; font-size: 13px; color: rgba(242,238,231,0.6); margin-bottom: 44px; }
        .csi-crumb a { color: rgba(242,238,231,0.78); text-decoration: none; }
        .csi-crumb a:hover { color: var(--orange); }
        .csi-eyebrow { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--orange); margin: 0 0 20px; }
        .csi-h1 { font-family: Inter, sans-serif; font-size: clamp(34px, 5.4vw, 60px); font-weight: 800; letter-spacing: -2px; line-height: 1.06; margin: 0 0 24px; max-width: 20ch; }
        .csi-sub { font-size: 17px; line-height: 1.65; color: rgba(242,238,231,0.74); max-width: 60ch; margin: 0; }
        .csi-sub-tight { margin-bottom: 34px; }

        .csi-proof { display: grid; grid-template-columns: repeat(3, auto); justify-content: start; gap: 0; margin: 44px 0 0; padding: 0; border-top: 1px solid rgba(242,238,231,0.14); }
        .csi-proof > div { padding: 22px 40px 0 0; margin-right: 40px; border-right: 1px solid rgba(242,238,231,0.14); }
        .csi-proof > div:last-child { border-right: 0; margin-right: 0; padding-right: 0; }
        .csi-proof-value { font-family: Inter, sans-serif; font-size: clamp(22px, 2.6vw, 30px); font-weight: 800; letter-spacing: -1px; color: var(--cream); margin: 0 0 6px; }
        .csi-proof > div:first-child .csi-proof-value { color: var(--orange); }
        .csi-proof-label { font-size: 13px; line-height: 1.45; color: rgba(242,238,231,0.7); margin: 0; max-width: 22ch; }

        .csi-section { padding: 72px 0; }
        .csi-section-standards { padding-top: 8px; }

        /* Cards */
        .csi-card { display: block; position: relative; background: var(--black); color: var(--cream); border: 1px solid rgba(242,238,231,0.1); border-radius: 26px; text-decoration: none; overflow: hidden; height: 100%;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.25s ease, box-shadow 0.35s ease; }
        .csi-card:hover, .csi-card:focus-visible { transform: translateY(-4px); border-color: var(--orange); box-shadow: 0 22px 52px rgba(12,12,11,0.2); }
        .csi-card:focus-visible { outline: 3px solid var(--orange); outline-offset: 4px; }
        .csi-card:hover .csi-cta-arrow, .csi-card:focus-visible .csi-cta-arrow { transform: translateX(4px); }
        .csi-card:hover .csi-media img { transform: scale(1.03); }

        .csi-client { font-family: Inter, sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 4px; }
        .csi-industry { font-size: 13.5px; line-height: 1.45; color: rgba(242,238,231,0.64); margin: 0; }
        .csi-window { font-family: ui-monospace, monospace; font-size: 12.5px; color: rgba(242,238,231,0.64); }
        .csi-title { font-family: Inter, sans-serif; font-size: clamp(22px, 2.3vw, 27px); font-weight: 800; letter-spacing: -0.9px; line-height: 1.16; margin: 18px 0 0; }
        .csi-title-lg { font-size: clamp(28px, 3.3vw, 42px); letter-spacing: -1.4px; line-height: 1.1; margin: 28px 0 0; }

        .csi-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin: 26px 0 0; padding: 22px 0 0; border-top: 1px solid rgba(242,238,231,0.14); }
        .csi-metric { min-width: 0; }
        .csi-metric-value { font-family: Inter, sans-serif; font-size: clamp(18px, 1.9vw, 24px); font-weight: 800; letter-spacing: -0.8px; line-height: 1.1; color: var(--orange); margin: 0 0 8px; overflow-wrap: anywhere; }
        .csi-metric-label { font-size: 12.5px; line-height: 1.45; color: rgba(242,238,231,0.72); margin: 0; }
        .csi-metrics { margin-left: 0; }
        .csi-metric dd, .csi-metric dt { margin-left: 0; }
        .csi-metric { display: flex; flex-direction: column; }
        .csi-metric > dd { order: 1; }
        .csi-metric > dt { order: 2; }

        .csi-chips { list-style: none; display: flex; flex-wrap: wrap; gap: 7px; padding: 0; margin: 24px 0 0; }
        .csi-chips li { font-family: Inter, sans-serif; font-size: 12px; font-weight: 600; color: rgba(242,238,231,0.74); border: 1px solid rgba(242,238,231,0.2); border-radius: 100px; padding: 6px 12px; }

        .csi-cta { display: inline-block; margin-top: 26px; font-family: Inter, sans-serif; font-size: 14.5px; font-weight: 700; color: var(--orange); }
        .csi-cta-arrow { display: inline-block; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }

        /* Featured */
        .csi-featured { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 44px; padding: 44px; align-items: center; }
        .csi-meta { display: flex; flex-wrap: wrap; gap: 10px 24px; justify-content: space-between; align-items: baseline; padding-bottom: 20px; border-bottom: 1px solid rgba(242,238,231,0.14); }
        .csi-featured-visual { min-width: 0; }
        .csi-chart { border: 1px solid rgba(242,238,231,0.12); border-radius: 18px; padding: 18px 14px 12px; background: rgba(242,238,231,0.03); }

        /* Media (screenshots and photos) */
        .csi-media { position: relative; overflow: hidden; background: #1a1a18; aspect-ratio: 16 / 10; }
        .csi-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .csi-media-fill { border-radius: 18px; }
        .csi-tag { position: absolute; top: 14px; left: 14px; font-family: Inter, sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; padding: 6px 12px; border-radius: 100px; background: rgba(12,12,11,0.82); color: rgba(242,238,231,0.95); border: 1px solid rgba(242,238,231,0.24); }

        /* Grid of remaining studies */
        .csi-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin-top: 24px; }
        .csi-cell { min-width: 0; }
        .csi-cell.is-wide { grid-column: 1 / -1; }
        .csi-study { display: flex; flex-direction: column; }
        .csi-study-body { padding: 30px 32px 34px; display: flex; flex-direction: column; flex: 1; }
        .csi-study-body .csi-cta { margin-top: auto; padding-top: 26px; }
        .csi-study .csi-media { aspect-ratio: 16 / 9; }
        .csi-study.is-wide { flex-direction: row; }
        .csi-study.is-wide .csi-media { flex: 0 0 44%; aspect-ratio: auto; min-height: 320px; }
        .csi-badge { align-self: flex-start; font-family: Inter, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1.3px; text-transform: uppercase; color: var(--orange); border: 1px solid rgba(232,84,26,0.6); border-radius: 100px; padding: 6px 12px; margin: 0; }

        /* Standards */
        .csi-kicker { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--csi-ink-orange); margin: 0 0 16px; }
        .csi-h2 { font-family: Inter, sans-serif; font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -1.3px; line-height: 1.14; margin: 0 0 36px; max-width: 22ch; }
        .csi-h2-light { color: var(--cream); }
        .csi-standards { list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0; padding: 0; margin: 0; border-top: 1px solid rgba(12,12,11,0.16); }
        .csi-standard-cell { min-width: 0; }
        .csi-standard { padding: 26px 26px 8px 0; height: 100%; }
        .csi-standard-cell + .csi-standard-cell .csi-standard { padding-left: 26px; border-left: 1px solid rgba(12,12,11,0.12); }
        .csi-standard-num { font-family: ui-monospace, monospace; font-size: 13px; font-weight: 700; color: var(--csi-ink-orange); }
        .csi-standard-title { font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.25; margin: 14px 0 12px; }
        .csi-standard-detail { font-size: 14px; line-height: 1.66; color: var(--grey); margin: 0; }

        /* Close */
        .csi-close { background: var(--black); color: var(--cream); padding: 84px 0; }
        .csi-btn { display: inline-block; background: var(--orange); color: #fff; font-family: Inter, sans-serif; font-size: 16px; font-weight: 700; border-radius: 100px; padding: 17px 34px; text-decoration: none; transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease; }
        .csi-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(232,84,26,0.34); }
        .csi-btn:focus-visible { outline: 3px solid var(--cream); outline-offset: 4px; }
        .csi-reassure { font-size: 13.5px; color: rgba(242,238,231,0.64); margin: 14px 0 0; }

        @media (max-width: 1000px) {
          .csi-featured { grid-template-columns: 1fr; gap: 32px; padding: 34px; }
          .csi-standards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .csi-standard-cell:nth-child(odd) .csi-standard { padding-left: 0; border-left: 0; }
          .csi-standard-cell:nth-child(n+3) { border-top: 1px solid rgba(12,12,11,0.12); }
          .csi-standard-cell:nth-child(even) .csi-standard { padding-left: 26px; border-left: 1px solid rgba(12,12,11,0.12); }
        }
        @media (max-width: 860px) {
          .csi-grid { grid-template-columns: 1fr; gap: 20px; }
          .csi-study.is-wide { flex-direction: column; }
          .csi-study.is-wide .csi-media { flex: none; aspect-ratio: 16 / 9; min-height: 0; }
        }
        @media (max-width: 760px) {
          .csi-container { padding: 0 20px; }
          .csi-hero { padding: 28px 0 52px; }
          .csi-section { padding: 52px 0; }
          .csi-close { padding: 64px 0; }
          .csi-h1 { letter-spacing: -1.3px; max-width: none; }
          .csi-proof { grid-template-columns: 1fr 1fr; gap: 22px 0; margin-top: 36px; }
          .csi-proof > div { padding: 0 16px 0 0; margin-right: 0; border-right: 0; }
          .csi-proof > div:first-child { grid-column: 1 / -1; padding-top: 22px; }
          .csi-card { border-radius: 20px; }
          .csi-featured { padding: 24px 20px; gap: 26px; }
          .csi-chart { padding: 12px 8px 8px; }
          .csi-metrics { grid-template-columns: 1fr; gap: 16px; }
          .csi-study-body { padding: 24px 20px 28px; }
          .csi-standards { grid-template-columns: 1fr; }
          .csi-standard-cell + .csi-standard-cell { border-top: 1px solid rgba(12,12,11,0.12); }
          .csi-standard-cell .csi-standard, .csi-standard-cell:nth-child(even) .csi-standard { padding: 22px 0 8px; border-left: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .csi-card, .csi-media img, .csi-cta-arrow, .csi-btn { transition: none; }
          .csi-card:hover, .csi-card:focus-visible, .csi-btn:hover, .csi-card:hover .csi-media img, .csi-card:hover .csi-cta-arrow { transform: none; }
        }
      `}</style>
    </main>
  );
}
