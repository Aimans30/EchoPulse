import Link from 'next/link';
import Image from 'next/image';
import type { CaseStudy } from '@/lib/caseStudyData';
import { staticBookingUrl, BOOK_CALL_LABEL, BOOK_CALL_REASSURANCE } from '@/lib/links';
import { Rise } from './motion';

/**
 * Case studies hub, laid out like a studio portfolio.
 *
 * The hero is short on purpose: one line of headline, one line of sub, and
 * the first card on screen at 1440x900 and inside the first screen on a
 * phone. Each card leads with a large real visual (the live site, the old
 * and new homepages side by side, or a still from the work), then the client,
 * three or four tags, the one headline result and a clear link.
 *
 * The honesty is kept, positively: every number links to the export or the
 * live site, and each study still ends with its open problems.
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

const parse = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/** A small static line of the monthly averages, drawn from the month table. */
function Sparkline({ study }: { study: CaseStudy }) {
  const months = study.months ?? [];
  if (months.length < 2) return null;
  const v = months.map((m) => parse(m.perDay));
  const max = Math.max(...v, 1);
  const pts = v.map((x, i) => `${((i / (v.length - 1)) * 200).toFixed(1)},${(60 - (x / max) * 54).toFixed(1)}`);
  return (
    <div className="csi-spark" aria-hidden="true">
      <p className="csi-spark-h">
        <span>Daily Google impressions</span>
        <strong>
          5.8 <em>&rarr;</em> 4,803
        </strong>
      </p>
      <svg viewBox="0 0 200 62" preserveAspectRatio="none">
        <polygon points={`0,62 ${pts.join(' ')} 200,62`} fill="rgba(232,84,26,0.22)" />
        <polyline points={pts.join(' ')} fill="none" stroke="#E8541A" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <p className="csi-spark-axis">
        <span>Apr 2026</span>
        <span>1 to 16 Nov 2026</span>
      </p>
    </div>
  );
}

function Visual({ study }: { study: CaseStudy }) {
  if (study.app) {
    const [a, b, c] = study.app.heroScreens;
    return (
      <div className="csi-vis csi-vis-app">
        {[a, b, c].map((m, i) =>
          m ? (
            <span key={m.src} className={`csi-app-phone csi-app-phone-${i}`}>
              <Image src={m.src} alt={i === 1 ? m.alt : ''} width={m.width} height={m.height} sizes="(max-width: 1000px) 30vw, 150px" className="csi-img" />
            </span>
          ) : null,
        )}
      </div>
    );
  }
  if (study.heroShot) {
    return (
      <div className="csi-vis csi-vis-shot">
        <div className="csi-browser">
          <span className="csi-browser-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <b>{study.heroShot.url}</b>
          </span>
          <Image
            src={study.heroShot.src}
            alt={study.heroShot.alt}
            width={study.heroShot.width}
            height={study.heroShot.height}
            sizes="(max-width: 1000px) 92vw, 600px"
            className="csi-img"
            loading="eager"
          />
        </div>
        <Sparkline study={study} />
        {study.product && (
          <span className="csi-phone">
            <Image
              src={study.product.heroPhone.src}
              alt=""
              width={study.product.heroPhone.width}
              height={study.product.heroPhone.height}
              sizes="96px"
              className="csi-img"
            />
          </span>
        )}
      </div>
    );
  }
  if (study.comparison?.afterSrc) {
    return (
      <div className="csi-vis csi-split">
        <div className="csi-split-half">
          <Image
            src={study.comparison.afterSrc}
            alt={study.comparison.afterAlt ?? ''}
            width={study.comparison.afterWidth ?? 1200}
            height={study.comparison.afterHeight ?? 2500}
            sizes="(max-width: 1000px) 50vw, 200px"
            className="csi-img"
            loading="eager"
          />
          <span className="csi-tag csi-tag-after">After</span>
        </div>
        <div className="csi-split-half csi-split-before">
          <Image
            src={study.comparison.beforeSrc}
            alt={study.comparison.beforeAlt}
            width={study.comparison.beforeWidth}
            height={study.comparison.beforeHeight}
            sizes="(max-width: 1000px) 50vw, 200px"
            className="csi-img"
            loading="eager"
          />
          <span className="csi-tag">Before</span>
        </div>
      </div>
    );
  }
  if (study.heroMedia) {
    const still = study.workstreams[0]?.media?.[0];
    return (
      <div className="csi-vis csi-vis-founder">
        <Image
          src={study.heroMedia.src}
          alt={study.heroMedia.alt}
          width={study.heroMedia.width}
          height={study.heroMedia.height}
          sizes="(max-width: 1000px) 92vw, 380px"
          className="csi-img csi-img-portrait"
          loading="eager"
        />
        {still && (
          <span className="csi-still">
            <Image src={still.src} alt={still.alt} width={still.width} height={still.height} sizes="90px" className="csi-img" />
          </span>
        )}
      </div>
    );
  }
  return null;
}

function StudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const founder = study.kind === 'founder';
  const lead = study.indexLead ?? study.heroMetrics[0];
  const tags = study.indexTags ?? study.services.slice(0, 4);
  return (
    <Link href={`/case-studies/${study.slug}`} className="csi-card">
      <Visual study={study} />
      <div className="csi-body">
        <p className="csi-meta">
          <span className="csi-num">{String(index + 1).padStart(2, '0')}</span>
          {founder ? <span className="csi-badge">{study.eyebrow}</span> : <span>{study.industry}</span>}
        </p>
        <h2 className="csi-client">{study.shortName}</h2>
        <ul className="csi-tags" aria-label="What we did">
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {lead && (
          <p className="csi-result">
            <strong>{lead.value}</strong>
            <span>{lead.label}</span>
          </p>
        )}
        <p className="csi-sentence">{study.indexResult}</p>
        {study.partOf && <p className="csi-pair">Part of one system with the {study.partOf.there.name.toLowerCase()} case study</p>}
        <span className="csi-cta">
          {founder ? 'Read the founder story' : 'Read the case study'}
          <span aria-hidden="true" className="csi-cta-arrow">
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function CaseStudyIndex({ studies }: { studies: CaseStudy[] }) {
  return (
    <main id="main" className="csi-root">
      <noscript>
        <style>{`.cs-rise{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <section className="csi-hero" data-dark-bg="true">
        <div className="csi-container">
          <nav className="csi-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Case studies</span>
          </nav>
          <div className="csi-hero-row">
            <Rise>
              <p className="csi-eyebrow">Case studies</p>
              <h1 className="csi-h1">
                Client results, <span className="csi-accent">with the receipts.</span>
              </h1>
            </Rise>
            <Rise delay={0.06}>
              <p className="csi-sub">
                Work for real businesses, named with their consent. Every number links to the export or the live site.
              </p>
              <a className="csi-jump" href="#studies">
                See the case studies <span aria-hidden="true">&darr;</span>
              </a>
            </Rise>
          </div>
        </div>
      </section>

      <section className="csi-studies" id="studies" aria-label="Published case studies">
        <div className="csi-container">
          <ol className="csi-grid" data-count={studies.length}>
            {studies.map((s, i) => (
              <Rise as="li" key={s.slug} delay={Math.min(i * 0.08, 0.24)} className="csi-cell">
                <StudyCard study={s} index={i} />
              </Rise>
            ))}
          </ol>
        </div>
      </section>

      <section className="csi-section csi-section-standards">
        <div className="csi-container">
          <Rise>
            <p className="csi-kicker">The standard</p>
            <h2 className="csi-h2">What has to be true before anything is published here.</h2>
          </Rise>
          <ol className="csi-standards">
            {STANDARDS.map((s, i) => (
              <Rise as="li" key={s.title} delay={Math.min(i * 0.05, 0.2)} className="csi-standard">
                <span className="csi-standard-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="csi-standard-title">{s.title}</h3>
                <p className="csi-standard-detail">{s.detail}</p>
              </Rise>
            ))}
          </ol>
        </div>
      </section>

      <section className="csi-close" id="book-call">
        <div className="csi-container">
          <Rise>
            <h2 className="csi-h2 csi-h2-light">
              Your site, read the same way <span className="csi-accent">on a 15 minute call.</span>
            </h2>
            <p className="csi-sub csi-sub-tight">
              We open your site and, where you have it, your Search Console, tell you what is structurally holding it back, and leave you with a 30 day plan. You keep the plan whether or not you hire us.
            </p>
            <div className="csi-close-cta">
              <a
                className="csi-btn"
                href={staticBookingUrl('case_study_index')}
                data-track="case_study_cta_click"
                data-track-location="case_study_index"
                target="_blank"
                rel="noopener"
              >
                {BOOK_CALL_LABEL}
              </a>
              <Link className="csi-textlink" href="/pricing">
                See prices
              </Link>
            </div>
            <p className="csi-reassure">{BOOK_CALL_REASSURANCE}</p>
          </Rise>
        </div>
      </section>

      <style>{`
        .csi-root { --csi-ink-orange: #B5400F; --cs-ease: cubic-bezier(0.16,1,0.3,1); --cs-max: 1100px; --cs-gutter: 100px; background: var(--cream); color: var(--black); overflow-x: clip; }
        @media (max-width: 900px) { .csi-root { --cs-gutter: 32px; } }
        @media (max-width: 760px) { .csi-root { --cs-gutter: 24px; } }
        @media (max-width: 380px) { .csi-root { --cs-gutter: 20px; } }
        .csi-root p { text-wrap: pretty; }
        .csi-root *, .csi-root *::before, .csi-root *::after { box-sizing: border-box; }
        .csi-root :focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; }
        /* Same box as the Nav pill and the case study pages (see caseStudyStyles.ts). */
        .csi-container { max-width: calc(var(--cs-max) + 2 * var(--cs-gutter)); margin: 0 auto; padding: 0 var(--cs-gutter); }
        .csi-accent { color: var(--orange); }
        .cs-rise { opacity: 0; transform: translate3d(0, 22px, 0); transition: opacity 0.7s ease, transform 0.9s var(--cs-ease); }
        .cs-rise.is-in { opacity: 1; transform: none; }
        .cs-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }

        /* Hero: short, so the work is on the first screen */
        .csi-hero { background: var(--black); color: var(--cream); padding: 112px 0 128px; }
        .csi-crumb { display: flex; gap: 10px; align-items: center; font-family: Inter, sans-serif; font-size: 13px; color: rgba(242,238,231,0.55); margin-bottom: 32px; }
        .csi-crumb a { color: rgba(242,238,231,0.75); text-decoration: none; display: inline-flex; min-height: 44px; align-items: center; }
        .csi-crumb a:hover { color: var(--orange); }
        .csi-hero-row { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr); gap: 24px 64px; align-items: end; }
        .csi-hero-row > * { min-width: 0; }
        .csi-eyebrow { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--orange); margin: 0 0 16px; }
        .csi-h1 { font-family: Inter, sans-serif; font-size: clamp(36px, 5vw, 64px); font-weight: 800; letter-spacing: -0.042em; line-height: 1; margin: 0; text-wrap: balance; }
        .csi-sub { font-size: 16.5px; line-height: 1.6; color: rgba(242,238,231,0.72); max-width: 44ch; margin: 0; }
        .csi-jump { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; margin-top: 8px; font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; color: var(--cream); text-decoration: none; }
        .csi-jump:hover { color: var(--orange); }

        /* Cards overlap the bottom of the hero */
        .csi-studies { margin-top: -96px; padding-bottom: 96px; scroll-margin-top: 80px; }
        .csi-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
        .csi-cell { min-width: 0; display: flex; }
        .csi-card { display: flex; flex-direction: column; width: 100%; background: #fff; color: var(--black); border: 1px solid rgba(12,12,11,0.1); border-radius: 24px; overflow: hidden; text-decoration: none; box-shadow: 0 30px 60px -36px rgba(12,12,11,0.35); transition: transform 0.45s var(--cs-ease), box-shadow 0.45s ease, border-color 0.3s ease; }
        .csi-card:hover, .csi-card:focus-visible { transform: translateY(-6px); box-shadow: 0 40px 70px -30px rgba(12,12,11,0.4); border-color: rgba(232,84,26,0.6); }

        .csi-vis { position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: #141413; }
        .csi-img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 0.8s var(--cs-ease); }
        .csi-card:hover .csi-img { transform: scale(1.035); }
        .csi-vis-shot { background: #ECE8F8; padding: 24px 24px 0; }
        .csi-browser { position: relative; border-radius: 10px 10px 0 0; overflow: hidden; background: #fff; box-shadow: 0 20px 40px -18px rgba(30,20,80,0.45); height: 100%; }
        .csi-browser-bar { display: flex; align-items: center; gap: 5px; height: 24px; padding: 0 10px; background: #F1EEE8; border-bottom: 1px solid rgba(12,12,11,0.07); }
        .csi-browser-bar i { width: 7px; height: 7px; border-radius: 50%; background: rgba(12,12,11,0.16); }
        .csi-browser-bar b { margin: 0 auto; padding-right: 26px; font: 500 10px Inter, sans-serif; color: rgba(12,12,11,0.55); }
        .csi-browser .csi-img { height: calc(100% - 24px); }
        .csi-spark { position: absolute; left: 16px; bottom: 16px; width: 58%; padding: 12px 14px 10px; border-radius: 12px; background: rgba(12,12,11,0.94); color: var(--cream); box-shadow: 0 16px 34px rgba(12,12,11,0.35); transition: transform 0.6s var(--cs-ease); }
        .csi-card:hover .csi-spark { transform: translateY(-4px); }
        .csi-spark-h { display: flex; flex-direction: column; gap: 2px; margin: 0 0 6px; font-family: Inter, sans-serif; }
        .csi-spark-h span { font-size: 10.5px; color: rgba(242,238,231,0.6); }
        .csi-spark-h strong { font-size: 18px; font-weight: 800; letter-spacing: -0.03em; color: var(--orange); }
        .csi-spark-h em { font-style: normal; color: rgba(242,238,231,0.6); }
        .csi-spark svg { display: block; width: 100%; height: 40px; }
        .csi-spark-axis { display: flex; justify-content: space-between; margin: 4px 0 0; font: 500 10px ui-monospace, monospace; color: rgba(242,238,231,0.5); }

        .csi-split { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; background: #0C0C0B; }
        .csi-split-half { position: relative; overflow: hidden; min-height: 0; }
        .csi-split-half .csi-img { position: absolute; inset: 0; }
        .csi-split-before .csi-img { filter: saturate(0.7) brightness(0.88); transition: transform 0.8s var(--cs-ease), filter 0.4s ease; }
        .csi-card:hover .csi-split-before .csi-img { filter: none; }
        .csi-tag { position: absolute; top: 12px; left: 12px; font-family: Inter, sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 6px 10px; border-radius: 100px; background: rgba(12,12,11,0.85); color: var(--cream); }
        .csi-tag-after { background: var(--orange); color: #0C0C0B; }

        .csi-phone { position: absolute; left: 14px; bottom: 14px; width: 92px; aspect-ratio: 9 / 19.5; border-radius: 14px; overflow: hidden; border: 3px solid #111; background: #000; box-shadow: 0 16px 34px rgba(12,12,11,0.45); transition: transform 0.6s var(--cs-ease); }
        .csi-card:hover .csi-phone { transform: translateY(-4px); }
        .csi-grid[data-count="4"] { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
        .csi-grid[data-count="4"] .csi-vis { aspect-ratio: 16 / 10; }
        @media (max-width: 1000px) { .csi-grid[data-count="4"] { grid-template-columns: minmax(0, 1fr); gap: 24px; } }
        .csi-vis-founder .csi-img-portrait { object-position: center 22%; }
        .csi-grid[data-count="5"] { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
        .csi-grid[data-count="5"] .csi-vis { aspect-ratio: 16 / 10; }
        .csi-grid[data-count="5"] > .csi-cell:first-child { grid-column: 1 / -1; }
        @media (min-width: 1001px) {
          .csi-grid[data-count="5"] > .csi-cell:first-child .csi-card { flex-direction: row; }
          .csi-grid[data-count="5"] > .csi-cell:first-child .csi-vis { flex: 0 0 56%; aspect-ratio: auto; min-height: 100%; }
        }
        @media (max-width: 1000px) { .csi-grid[data-count="5"] { grid-template-columns: minmax(0, 1fr); gap: 24px; } }
        .csi-vis-app { background: #DDEFF3; display: flex; align-items: flex-end; justify-content: center; padding: 24px 24px 0; overflow: hidden; }
        .csi-app-phone { position: relative; width: 30%; max-width: 150px; aspect-ratio: 1 / 2; border-radius: 18px 18px 0 0; overflow: hidden; border: 4px solid #111; border-bottom: 0; background: #fff; box-shadow: 0 20px 40px -18px rgba(12,12,11,0.5); transition: transform 0.6s var(--cs-ease); flex: none; }
        .csi-app-phone .csi-img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
        .csi-app-phone-0 { transform: translate(18%, 14%) rotate(-5deg); }
        .csi-app-phone-1 { z-index: 2; width: 36%; }
        .csi-app-phone-2 { transform: translate(-18%, 14%) rotate(5deg); }
        .csi-card:hover .csi-app-phone-1 { transform: translateY(-4px); }
        .csi-pair { margin: 10px 0 0; font-family: Inter, sans-serif; font-size: 13px; font-weight: 700; color: var(--csi-ink-orange); }
        .csi-still { position: absolute; right: 14px; bottom: 14px; width: 78px; aspect-ratio: 9 / 16; border-radius: 12px; overflow: hidden; border: 3px solid #111; box-shadow: 0 14px 30px rgba(0,0,0,0.45); transition: transform 0.6s var(--cs-ease); }
        .csi-card:hover .csi-still { transform: translateY(-4px) rotate(-2deg); }

        .csi-body { display: flex; flex-direction: column; flex: 1; padding: 24px 32px 32px; }
        .csi-meta { display: flex; align-items: center; gap: 12px; margin: 0 0 10px; font-family: Inter, sans-serif; font-size: 12.5px; color: var(--grey); min-height: 26px; }
        .csi-num { font: 700 12px ui-monospace, monospace; color: var(--csi-ink-orange); }
        .csi-badge { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--csi-ink-orange); border: 1px solid rgba(181,64,15,0.4); border-radius: 100px; padding: 4px 10px; }
        .csi-client { font-family: Inter, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin: 0 0 16px; }
        .csi-tags { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; padding: 0; margin: 0 0 24px; }
        .csi-tags li { font-family: Inter, sans-serif; font-size: 12px; font-weight: 600; color: #3d3a34; background: #F4F1EB; border-radius: 100px; padding: 5px 10px; }
        .csi-result { display: grid; gap: 8px; margin: 0 0 16px; padding-top: 24px; border-top: 1px solid rgba(12,12,11,0.1); }
        .csi-result strong { font-family: Inter, sans-serif; font-size: 30px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; color: var(--csi-ink-orange); }
        .csi-result span { font-size: 13.5px; line-height: 1.45; color: #3d3a34; }
        .csi-sentence { font-size: 13px; line-height: 1.55; color: var(--grey); margin: 0 0 16px; max-width: 68ch; }
        .csi-cta { margin-top: auto; padding-top: 8px; display: inline-flex; align-items: center; gap: 8px; min-height: 44px; font-family: Inter, sans-serif; font-size: 15px; font-weight: 700; color: var(--black); }
        .csi-cta-arrow { display: inline-block; color: var(--orange); transition: transform 0.35s var(--cs-ease); }
        .csi-card:hover .csi-cta-arrow { transform: translateX(5px); }

        /* Standards */
        .csi-section { padding: 0 0 96px; }
        .csi-kicker { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--csi-ink-orange); margin: 0 0 16px; }
        .csi-h2 { font-family: Inter, sans-serif; font-size: clamp(28px, 3.4vw, 42px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; margin: 0 0 48px; max-width: 22ch; text-wrap: balance; }
        .csi-h2-light { color: var(--cream); }
        /* Equal columns, dividers centred in the gap and clipped at the edges (same as the stat strip). */
        .csi-standards { --csi-gap: 48px; list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: var(--csi-gap); row-gap: 24px; padding: 0; margin: 0; border-top: 1px solid rgba(12,12,11,0.16); overflow-x: clip; }
        .csi-standard { position: relative; padding: 24px 0 0; min-width: 0; }
        .csi-standard::before { content: ""; position: absolute; top: 0; bottom: 0; left: calc(var(--csi-gap) / -2); width: 1px; background: rgba(12,12,11,0.12); }
        .csi-standard-num { font-family: ui-monospace, monospace; font-size: 13px; font-weight: 700; color: var(--csi-ink-orange); }
        .csi-standard-title { font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.015em; line-height: 1.25; margin: 16px 0 8px; text-wrap: balance; }
        .csi-standard-detail { font-size: 14.5px; line-height: 1.66; color: var(--grey); margin: 0; }

        /* Close */
        .csi-close { background: var(--black); color: var(--cream); padding: 96px 0; }
        .csi-sub-tight { margin-bottom: 32px; max-width: 60ch; }
        .csi-close-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 24px; }
        .csi-btn { display: inline-flex; align-items: center; min-height: 56px; background: var(--orange); color: #0C0C0B; font-family: Inter, sans-serif; font-size: 16px; font-weight: 700; border-radius: 100px; padding: 0 32px; text-decoration: none; transition: transform 0.25s var(--cs-ease), box-shadow 0.25s ease; }
        .csi-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(232,84,26,0.36); }
        .csi-btn:focus-visible { outline: 3px solid var(--cream); outline-offset: 4px; }
        .csi-reassure { font-size: 13.5px; color: rgba(242,238,231,0.6); margin: 16px 0 0; }
        .csi-textlink { display: inline-flex; align-items: center; min-height: 44px; color: var(--cream); font-family: Inter, sans-serif; font-size: 15px; font-weight: 700; text-decoration: underline; text-underline-offset: 5px; }
        .csi-textlink:hover { color: var(--orange); }

        @media (max-width: 1000px) {
          .csi-hero-row { grid-template-columns: minmax(0, 1fr); }
          .csi-grid { grid-template-columns: minmax(0, 1fr); gap: 24px; }
          .csi-standards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .csi-standard:nth-child(n+3)::after { content: ""; position: absolute; top: 0; height: 1px; left: calc(var(--csi-gap) / -2); right: calc(var(--csi-gap) / -2); background: rgba(12,12,11,0.12); }
        }
        @media (max-width: 760px) {
          .csi-hero { padding: 112px 0 96px; }
          .csi-crumb { margin-bottom: 16px; }
          .csi-h1 { font-size: clamp(32px, 9vw, 40px); }
          .csi-sub { font-size: 15.5px; }
          .csi-jump { display: none; }
          .csi-studies { margin-top: -72px; padding-bottom: 64px; }
          .csi-body { padding: 24px; }
          .csi-vis-shot { padding: 16px 16px 0; }
          .csi-spark { width: 64%; }
          .csi-section { padding-bottom: 64px; }
          .csi-h2 { margin-bottom: 32px; }
          .csi-standards { grid-template-columns: minmax(0, 1fr); row-gap: 0; }
          .csi-standard { padding: 24px 0; border-bottom: 1px solid rgba(12,12,11,0.12); }
          .csi-standard:nth-child(n+3)::after { content: none; }
          .csi-close { padding: 96px 0 64px; }
          .csi-btn { width: 100%; justify-content: center; }
        }
        /* Cancel the global !important section padding; gutters live on .csi-container. */
        .csi-root > section { padding-left: 0 !important; padding-right: 0 !important; }
        @media (max-width: 768px) {
          .csi-root > .csi-hero { padding-top: 112px !important; padding-bottom: 96px !important; }
          .csi-root > .csi-studies { padding-top: 0 !important; padding-bottom: 64px !important; }
          .csi-root > .csi-section { padding-top: 0 !important; padding-bottom: 64px !important; }
          .csi-root > .csi-close { padding-top: 96px !important; padding-bottom: 64px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-rise, .cs-rise.is-in { opacity: 1 !important; transform: none !important; transition: none !important; }
          .csi-root * { transition: none !important; }
          .csi-card:hover .csi-app-phone-1, .csi-card:hover, .csi-card:focus-visible, .csi-btn:hover, .csi-card:hover .csi-img, .csi-card:hover .csi-spark, .csi-card:hover .csi-still, .csi-card:hover .csi-phone, .csi-card:hover .csi-cta-arrow { transform: none; }
        }
      `}</style>
    </main>
  );
}
