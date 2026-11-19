import Link from 'next/link';
import Image from 'next/image';
import {
  type CaseStudy,
  CASE_STUDY_AUTHOR,
  CASE_STUDY_PUBLISHER,
  canonicalFor,
  citationFor,
  formatISODate,
} from '@/lib/caseStudyData';
import { getIcp } from '@/lib/icpData';
import {
  staticBookingUrl,
  BOOK_CALL_LABEL,
  BOOK_CALL_REASSURANCE,
  FREE_EDITS_LABEL,
  FREE_EDITS_URL,
} from '@/lib/links';
import { GROWTH, PILOT, PRESENCE } from '@/lib/pricing';
import { Rise, CountUp } from './motion';
import { BrowserFrame, PhoneFrame, Shot } from './Frames';
import Parallax from './Parallax';
import HeroCurve from './HeroCurve';
import MonthlyChart from './MonthlyChart';
import ImpressionChart from './ImpressionChart';
import CompareSlider from './CompareSlider';
import PageRail from './PageRail';
import DashboardMock from './DashboardMock';
import CostCompare from './CostCompare';
import BarChart from './BarChart';
import WorkTimeline from './WorkTimeline';
import CopyCitation from './CopyCitation';
import SectionNav, { type SectionNavItem } from './SectionNav';
import { CASE_STUDY_CSS } from './caseStudyStyles';
import ProductStory, { ProductHero } from './ProductStory';
import { PRODUCT_CSS } from './productStyles';

/**
 * Case study detail page. A server component: the copy, the tables, the
 * answer block and the citation are plain server HTML, and only the charts,
 * the slider, the rail, the dashboard tabs and the reveal wrappers hydrate.
 *
 * THE ARGUMENT THIS PAGE IS BUILT TO MAKE
 *
 * EchoPulse has no testimonials and few permissioned clients, so the page
 * makes claims that require nothing but checking: a named client with a live
 * URL, real captures of that site, a named instrument, an exact date window,
 * and a list of what is still broken.
 *
 * READING ORDER
 *
 * The result is shown before it is described: the hero is the chart, the
 * slider or the work itself. Then a short summary, the key facts table, the
 * evidence as visuals, the work as a timeline, and only then the method,
 * the open problems, the limits and the ask. Every long explanation is
 * still on the page, inside a <details>, so nothing that was published
 * before has been removed; it has been moved out of the reader's way.
 *
 * NO STICKY CTA. One ask, "Book a free 15-minute call", at three natural
 * decision points, with "See prices" as a text link next to it.
 */

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n);
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Result: text" becomes { label: 'Result', text: 'text' }. */
function splitLead(line: string): { label: string | null; text: string } {
  const i = line.indexOf(':');
  if (i > 0 && i <= 24) return { label: line.slice(0, i), text: line.slice(i + 1).trim() };
  return { label: null, text: line };
}

const ORIGIN = 'https://echopulse.media';

/** At-a-glance rows that the Key facts table already states. Not repeated. */
const GLANCE_COVERED = new Set([
  'Client',
  'Who',
  'Industry',
  'Starting point',
  'Date window',
  'Measured result',
  'How measured',
  'Last updated',
]);

function BookButton({ location, large = false }: { location: string; large?: boolean }) {
  return (
    <a
      className={`cs-btn cs-btn-primary${large ? ' cs-btn-lg' : ''}`}
      href={staticBookingUrl(location)}
      data-track="case_study_cta_click"
      data-track-location={location}
      target="_blank"
      rel="noopener"
    >
      {BOOK_CALL_LABEL}
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function SectionHead({
  kicker,
  question,
  claim,
  light = false,
  children,
}: {
  kicker: string;
  question: string;
  claim?: React.ReactNode;
  light?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Rise className="cs-head">
      <p className="cs-kicker">{kicker}</p>
      <h2 className={`cs-h2${light ? ' cs-h2-light' : ''}`}>{question}</h2>
      {claim && <p className="cs-claim">{claim}</p>}
      {children}
    </Rise>
  );
}

export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const icp = getIcp(study.icpKey);
  const labels = study.labels ?? {};
  const isFounder = study.kind === 'founder';
  const internalLink = study.clientUrl.startsWith(ORIGIN);
  const internalHref = study.clientUrl.slice(ORIGIN.length) || '/';
  const clientLinkLabel = labels.clientLinkLabel ?? `Open ${study.clientUrl.replace('https://', '')} and check`;

  const situationKicker = labels.situationKicker ?? 'Where it started';
  const workKicker = labels.workKicker ?? 'What we did';
  const openKicker = labels.openProblemsKicker ?? 'Open problems';
  const limitsKicker = labels.limitsKicker ?? 'Scope';

  const monthlyBars = study.bars?.find((b) => b.replacedByMonthly);
  const otherBars = (study.bars ?? []).filter((b) => !b.replacedByMonthly);
  const hasNumbers = Boolean(otherBars.length || study.months || study.funnel);
  const tldr = (study.tldr ?? []).map(splitLead);
  const tracking = study.tracking;
  const trackingScreens = tracking?.screens ?? [];
  const isRebuild = Boolean(study.comparison);
  const isProduct = Boolean(study.product);

  const hasOpen = study.openProblems.length > 0;
  const callLine = study.callLine ?? BOOK_CALL_REASSURANCE;
  const product = study.product;
  const sections: SectionNavItem[] = product
    ? [
        { id: 'glance', label: 'Key facts' },
        ...(product.about ? [{ id: 'about-client', label: 'The client' }] : []),
        ...(product.marketing ? [] : [{ id: 'outlets', label: 'Outlets' }]),
        { id: 'tour', label: 'The product' },
        { id: 'assistant', label: 'Brighty' },
        ...(product.marketing ? [{ id: 'marketing', label: 'Marketing' }] : [{ id: 'website', label: 'Website' }]),
        ...(product.build ? [{ id: 'build', label: 'How we build' }] : []),
        ...(product.next ? [{ id: 'next', label: 'Next' }] : []),
        ...(product.buyerFit ? [{ id: 'your-business', label: 'Your business' }] : []),
        ...(product.faq?.length ? [{ id: 'faq', label: 'FAQ' }] : []),
        ...(hasOpen ? [{ id: 'open', label: openKicker }] : []),
      ]
    : [
    { id: 'glance', label: 'Key facts' },
    ...(hasNumbers ? [{ id: 'numbers', label: 'The numbers' }] : []),
    ...(isRebuild ? [{ id: 'cost', label: 'The cost' }] : []),
    ...(study.pairs ? [{ id: 'pages', label: 'Before and after' }] : []),
    { id: 'work', label: workKicker },
    ...(tracking ? [{ id: 'tracking', label: 'Tracking' }] : []),
    { id: 'open', label: openKicker },
    { id: 'fit', label: 'Right for you?' },
  ].slice(0, 6);

  /**
   * QUESTION HEADINGS. Every section H2 is the question a buyer, or an answer
   * engine on a buyer's behalf, would ask. The ids are stable anchors: other
   * pages and llms.txt link to them, so do not rename them.
   */
  const who = study.shortName;
  const q = isFounder
    ? {
        situation: `Where did ${who} work before EchoPulse?`,
        work: 'What did he edit for those agents?',
        numbers: 'What are the numbers?',
        pages: 'What changed on each page?',
        screens: 'Which pages are new?',
        exportQ: 'Where is the source export?',
        measured: 'How was this measured?',
        open: 'What does this page not claim?',
        scope: 'What does EchoPulse do differently?',
        fit: 'Is EchoPulse right for you?',
      }
    : {
        situation: `What was wrong at ${who} before the work started?`,
        work: `What did EchoPulse do for ${who}?`,
        numbers: `What were the results for ${who}?`,
        pages: 'What changed on each page?',
        screens: 'Which pages are new?',
        exportQ: 'Where is the source export?',
        measured: 'How was this measured?',
        open: 'What is still not working?',
        scope: 'When is this approach the wrong one?',
        fit: 'Is this right for you?',
      };

  const canonical = canonicalFor(study);
  const citation = citationFor(study);
  const published = formatISODate(study.publishedISO);
  const updatedISO = study.updatedISO ?? study.publishedISO;
  const wasUpdated = updatedISO !== study.publishedISO;
  const glanceRest = study.atAGlance.filter((row) => !GLANCE_COVERED.has(row.label));
  const notFor = study.fit.notFor ?? study.notApplicable.map((n) => n.title);

  const clientLink = internalLink ? (
    <Link className="cs-verify" href={internalHref}>
      {clientLinkLabel}
      <span aria-hidden="true"> &rarr;</span>
    </Link>
  ) : (
    <a className="cs-verify" href={study.clientUrl} target="_blank" rel="noopener">
      {clientLinkLabel}
      <span aria-hidden="true"> &rarr;</span>
    </a>
  );

  /* ── Hero visual, one per kind of study ───────────────────────────── */
  let heroVisual: React.ReactNode = null;
  if (isProduct) {
    heroVisual = <ProductHero study={study} />;
  } else if (study.chart && study.months && study.heroShot) {
    const floor = study.months.findIndex((m) => m.month.startsWith('April'));
    const launch = study.months.findIndex((m) => m.month.startsWith('May'));
    heroVisual = (
      <div className="cs-hero-stage cs-hero-stage-chart">
        <Parallax className="cs-hero-shot" range={2}>
          <BrowserFrame url={study.heroShot.url} tone="dark">
            <Shot media={study.heroShot} sizes="(max-width: 1000px) 92vw, 560px" priority />
          </BrowserFrame>
        </Parallax>
        <div className="cs-hero-chartcard">
          <p className="cs-hero-chartcard-h">
            Average daily Google impressions, by month
            <span>Google Search Console, magicbnb.io</span>
          </p>
          <HeroCurve
            months={study.months}
            startIndex={floor < 0 ? 0 : floor}
            launchIndex={launch < 1 ? 1 : launch}
            launchLabel="5 May: rebuilt site live"
            startValue="5.8 a day"
            endValue="4,803 a day"
            startCaption="April 2026"
            endCaption="1 to 16 Nov 2026"
            ariaLabel="Average daily Google search impressions for magicbnb.io by month, February to 16 November 2026. 5.8 a day in April 2026, the floor, then the rebuilt site went live on 5 May 2026, and 4,803 a day in 1 to 16 November 2026."
          />
        </div>
      </div>
    );
  } else if (study.comparison?.slider) {
    heroVisual = (
      <div className="cs-hero-stage">
        <CompareSlider
          before={study.comparison.slider.before}
          after={study.comparison.slider.after}
          beforeLabel={study.comparison.beforeLabel}
          afterLabel={study.comparison.afterLabel}
          url={study.comparison.liveUrl.replace('https://', '')}
        />
        <p className="cs-hero-cap">
          {study.comparison.caption}{' '}
          <a href={study.comparison.liveUrl} target="_blank" rel="noopener">
            Open the live site <span aria-hidden="true">&rarr;</span>
          </a>
        </p>
      </div>
    );
  } else if (study.heroMedia) {
    const stills = (study.workstreams[0]?.media ?? []).slice(0, 2);
    heroVisual = (
      <div className="cs-hero-stage cs-hero-stage-founder">
        <figure className="cs-portrait">
          <Parallax range={2}>
            <Image
              src={study.heroMedia.src}
              alt={study.heroMedia.alt}
              width={study.heroMedia.width}
              height={study.heroMedia.height}
              sizes="(max-width: 1000px) 80vw, 440px"
              loading="eager"
              fetchPriority="high"
              className="cs-shot"
            />
          </Parallax>
          {study.heroMedia.caption && <figcaption className="cs-sr">{study.heroMedia.caption}</figcaption>}
        </figure>
        {stills.length > 0 && (
          <ul className="cs-founder-stills" aria-label="Frames from listing reels">
            {stills.map((m) => (
              <li key={m.src}>
                <PhoneFrame>
                  <Image src={m.src} alt={m.alt} width={m.width} height={m.height} sizes="150px" className="cs-shot" />
                </PhoneFrame>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <main id="main" className={`cs-root cs-kind-${isFounder ? 'founder' : isProduct ? 'product' : isRebuild ? 'rebuild' : 'measured'}`}>
      <noscript>
        <style>{`.cs-rise{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="cs-hero" data-dark-bg="true">
        <div className="cs-container">
          <nav className="cs-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/case-studies">Case studies</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{study.client}</span>
          </nav>

          <div className="cs-hero-grid">
            <div className="cs-hero-copy">
              <Rise>
                <p className="cs-eyebrow">
                  <span>{study.eyebrow}</span>
                  <span className="cs-eyebrow-sep" aria-hidden="true" />
                  <span>{isFounder ? study.shortName : study.client}</span>
                </p>
                <h1 className="cs-h1">
                  {study.headline} <span className="cs-accent">{study.headlineAccent}</span>
                </h1>
                {study.heroLede && <p className="cs-lede">{study.heroLede}</p>}
              </Rise>
              <Rise delay={0.08}>
                <div className="cs-hero-cta">
                  <BookButton location="case_study_hero" />
                  <Link className="cs-textlink cs-textlink-light" href="/pricing">
                    See prices
                  </Link>
                </div>
                <p className="cs-reassure">{callLine}</p>
                <p className="cs-hero-client">
                  <span className="cs-hero-client-name">{study.client}</span>
                  {clientLink}
                </p>
              </Rise>
            </div>
            <Rise className="cs-hero-visual" delay={0.05}>
              {heroVisual}
            </Rise>
          </div>

          {/* Metric strip. Every value carries its unit and its qualifier,
              because this is the block an answer engine is most likely to
              lift. Values count up once; the final text is in the HTML. */}
          <ul className="cs-stats" data-count={study.heroMetrics.length}>
            {study.heroMetrics.map((m, i) => (
              <Rise as="li" className="cs-stat" key={m.label} delay={0.12 + i * 0.06}>
                <p className="cs-stat-value">
                  <CountUp value={m.value} />
                </p>
                <p className="cs-stat-label">{m.label}</p>
                {m.note && <p className="cs-stat-note">{m.note}</p>}
              </Rise>
            ))}
          </ul>
          {study.heroNote && <p className="cs-hero-note">{study.heroNote}</p>}
        </div>
      </section>

      {/* ── In short: the answer block ─────────────────────────────────────
          Two or three sentences that can be quoted alone, as plain server
          HTML, directly under the hero. */}
      <section className="cs-short" aria-labelledby="cs-short-h">
        <div className="cs-container cs-short-grid">
          <Rise className="cs-answer-wrap">
            <p className="cs-kicker" id="cs-short-h">
              In short
            </p>
            <div className="cs-answer" id="answer">
              {!isFounder && <p className="cs-answer-result">{study.resultLine}</p>}
              {study.answer.map((a) => (
                <p className="cs-answer-text" key={a.slice(0, 40)}>
                  {a}
                </p>
              ))}
              <p className="cs-byline">
                <span>
                  By{' '}
                  <Link href={CASE_STUDY_AUTHOR.path} rel="author">
                    {CASE_STUDY_AUTHOR.name}
                  </Link>
                  , {CASE_STUDY_PUBLISHER}
                </span>
                <span>
                  Published <time dateTime={study.publishedISO}>{published}</time>
                </span>
                {wasUpdated && (
                  <span>
                    Updated <time dateTime={updatedISO}>{formatISODate(updatedISO)}</time>
                  </span>
                )}
              </p>
              {study.credits && study.credits.length > 0 && (
                <div className="cs-builtby">
                  <p className="cs-builtby-k">Built and run by</p>
                  <ul className="cs-builtby-list">
                    {study.credits.map((c) => (
                      <li key={c.name}>
                        {c.href ? (
                          <Link className="cs-builtby-name" href={c.href} rel={c.isAuthor ? 'author' : undefined}>
                            {c.name}
                          </Link>
                        ) : (
                          <span className="cs-builtby-name">{c.name}</span>
                        )}
                        <span className="cs-builtby-role">{c.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Rise>
          <Rise className="cs-short-side" delay={0.08}>
            {tldr.length > 0 && (
              <ul className="cs-tldr">
                {tldr.map((t) => (
                  <li key={t.text.slice(0, 40)}>
                    {t.label && <strong>{t.label}.</strong>} {capital(t.text)}
                  </li>
                ))}
              </ul>
            )}
            <div className="cs-clientcard">
              <p className="cs-clientcard-name">{study.client}</p>
              <p className="cs-clientcard-tag">{study.clientTagline}</p>
              <ul className="cs-services" aria-label="Services delivered">
                {study.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </Rise>
        </div>
      </section>

      <SectionNav items={sections} />

      {/* ── Key facts ──────────────────────────────────────────────────── */}
      <section className="cs-section" id="glance">
        <div className="cs-container">
          <SectionHead kicker="At a glance" question="Key facts" />
          <Rise>
            <div className="cs-table-scroll">
              <table className="cs-table cs-facts">
                <caption className="cs-sr">Key facts: {study.client}</caption>
                <thead>
                  <tr>
                    <th scope="col">Fact</th>
                    <th scope="col">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {study.keyFacts.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td>
                        {row.href ? (
                          row.href.startsWith(ORIGIN) ? (
                            <Link href={row.href.slice(ORIGIN.length) || '/'}>{row.value}</Link>
                          ) : (
                            <a href={row.href} target="_blank" rel="noopener">
                              {row.value}
                            </a>
                          )
                        ) : (
                          row.value
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="cs-factlinks">
              {study.relatedService && (
                <Link href={`/services/${study.relatedService.slug}`}>
                  {study.relatedService.label}
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              )}
              <a href="#measured">
                How this was measured<span aria-hidden="true"> &rarr;</span>
              </a>
              <a href="#cite">
                Cite this page<span aria-hidden="true"> &rarr;</span>
              </a>
            </p>
            <details className="cs-more cs-more-wide" id="engagement">
              <summary>
                <span>{isFounder ? 'More detail, and the story in one paragraph' : 'The engagement in detail, and the story in one paragraph'}</span>
              </summary>
              <div className="cs-more-body">
                <p className="cs-body">{study.summary}</p>
                {glanceRest.length > 0 && (
                  <dl className="cs-glance">
                    {glanceRest.map((row) => (
                      <div className="cs-glance-row" key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </details>
          </Rise>
        </div>
      </section>

      {/* ── Numbers (measured work) ────────────────────────────────────── */}
      {hasNumbers && (
        <section className="cs-section cs-tone-paper" id="numbers">
          <div className="cs-container">
            <SectionHead kicker="The numbers" question={q.numbers} claim="Every month in the window, including the two that produced nothing." />

            {study.months && (
              <div className="cs-anchor" id="timeline">
                <div className="cs-split">
                  <Rise className="cs-split-text">
                    <h3 className="cs-h3">How long did it take?</h3>
                    {study.timelineAnswer && <p className="cs-body">{study.timelineAnswer}</p>}
                    <p className="cs-hint">Hover or tap a month for its total and what was happening.</p>
                  </Rise>
                  <Rise className="cs-split-visual" delay={0.06}>
                    <MonthlyChart months={study.months} caption={monthlyBars?.caption ?? ''} />
                  </Rise>
                </div>

                {study.chart && (
                  <Rise className="cs-daily">
                    <div className="cs-daily-head">
                      <h3 className="cs-h3 cs-h3-light">Every day, straight from the export</h3>
                      <p>{study.chart.daily.length} daily values. Nothing smoothed.</p>
                    </div>
                    <ImpressionChart chart={study.chart} />
                    <p className="cs-caption cs-caption-light">{study.chart.caption}</p>
                  </Rise>
                )}

                <details className="cs-more cs-more-wide">
                  <summary>
                    <span>Every month in the window, as a table</span>
                    <span className="cs-more-count">{study.months.length} months</span>
                  </summary>
                  <div className="cs-more-body">
                    <div className="cs-table-scroll">
                      <table className="cs-table">
                        <thead>
                          <tr>
                            <th scope="col">Month</th>
                            <th scope="col">Impressions</th>
                            <th scope="col">Per day</th>
                            <th scope="col">What was happening</th>
                          </tr>
                        </thead>
                        <tbody>
                          {study.months.map((m) => (
                            <tr key={m.month}>
                              <th scope="row">{m.month}</th>
                              <td className="cs-num">{m.impressions}</td>
                              <td className="cs-num">{m.perDay}</td>
                              <td className="cs-note">{m.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </details>
              </div>
            )}

            {study.funnel && (
              <div className="cs-sub cs-anchor" id="funnel">
                <Rise>
                  <p className="cs-kicker">The rest of the funnel</p>
                  <h3 className="cs-h3">Did sessions and clicks grow too?</h3>
                  <p className="cs-body">{study.funnel.intro}</p>
                </Rise>
                <ul className="cs-funnel">
                  {study.funnel.rows.map((r, i) => (
                    <Rise as="li" key={r.label} className="cs-funnel-tile" delay={Math.min(i * 0.05, 0.2)}>
                      <p className="cs-funnel-label">{r.label}</p>
                      <p className={`cs-funnel-change cs-change-${r.direction}`}>
                        <CountUp value={r.change} />
                      </p>
                      <p className="cs-funnel-ba">
                        <span>
                          <em>{study.funnel?.beforeLabel ?? 'Prior 31 days'}</em>
                          {r.before}
                        </span>
                        <span aria-hidden="true" className="cs-funnel-arrow">
                          &rarr;
                        </span>
                        <span>
                          <em>{study.funnel?.afterLabel ?? 'Last 30 days'}</em>
                          {r.after}
                        </span>
                      </p>
                    </Rise>
                  ))}
                </ul>
                <Rise>
                  <p className="cs-body cs-reading">
                    <strong>{study.funnel.readingLabel ?? 'Reading the two that moved the wrong way.'}</strong> {study.funnel.reading}
                  </p>
                </Rise>
              </div>
            )}

            {otherBars.length > 0 && (
              <div className="cs-bars-grid cs-sub">
                {otherBars.map((b, i) => (
                  <Rise key={b.title} delay={Math.min(i * 0.06, 0.2)}>
                    <BarChart data={b} />
                  </Rise>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Cost (rebuilds) ────────────────────────────────────────────── */}
      {isRebuild && (
        <section className="cs-section cs-tone-paper" id="cost">
          <div className="cs-container">
            <SectionHead kicker="The cost" question="What does the site cost to run now?" claim={capital(study.resultLine.replace(/^Result:\s*/, ''))} />
            <CostCompare />
          </div>
        </section>
      )}

      {/* ── Software builds: the product, screen by screen ──────────────── */}
      {isProduct && <ProductStory study={study} />}

      {/* ── The situation ──────────────────────────────────────────────── */}
      {!isProduct && (
      <section className="cs-section" id="situation">
        <div className="cs-container">
          <div className="cs-split cs-split-top">
            <SectionHead kicker={situationKicker} question={q.situation} claim={study.situation.headline}>
              {study.situation.body.map((p) => (
                <p className="cs-body" key={p.slice(0, 40)}>
                  {p}
                </p>
              ))}
            </SectionHead>
            <ol className="cs-fail-list">
              {study.situation.failures.map((f, i) => (
                <Rise as="li" key={f.title} delay={Math.min(i * 0.06, 0.24)} className="cs-fail">
                  <span className="cs-fail-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="cs-fail-title">{f.title}</h3>
                    <p className="cs-fail-desc">{f.detail}</p>
                  </div>
                </Rise>
              ))}
            </ol>
          </div>
        </div>
      </section>
      )}

      {/* ── Page by page (rebuilds) ────────────────────────────────────── */}
      {study.pairs && (
        <section className="cs-section cs-tone-ink" id="pages">
          <div className="cs-container">
            <SectionHead kicker="Before and after" question={q.pages} claim={study.pairs.heading} light>
              <p className="cs-lead cs-lead-light">{study.pairs.intro}</p>
            </SectionHead>
          </div>
          <div className="cs-container cs-container-bleed">
            <PageRail items={study.pairs.items} />
          </div>
        </section>
      )}

      {/* ── The live site, in device frames ────────────────────────────── */}
      {study.siteShots && (
        <section className="cs-section cs-tone-paper" id="site">
          <div className="cs-container">
            <SectionHead kicker="The live site" question={isRebuild ? 'What does the new site look like?' : `What does ${who} look like now?`} claim={study.siteShots.heading}>
              <p className="cs-lead">{study.siteShots.intro}</p>
            </SectionHead>
            <div className={`cs-devices${study.siteShots.desktop.length > 1 ? ' is-multi' : ''}`}>
              <div className="cs-devices-desk">
                {study.siteShots.desktop.map((s, i) => (
                  <Rise as="figure" key={s.src} className="cs-device-fig" delay={Math.min(i * 0.06, 0.18)}>
                    <Parallax range={1.5}>
                      <BrowserFrame url={s.url}>
                        <Shot media={s} sizes="(max-width: 1000px) 92vw, 760px" />
                      </BrowserFrame>
                    </Parallax>
                    {s.caption && <figcaption className="cs-caption">{s.caption}</figcaption>}
                  </Rise>
                ))}
              </div>
              {study.siteShots.phone && (
                <Rise as="figure" className="cs-device-fig cs-devices-phone" delay={0.1}>
                  <PhoneFrame>
                    <Shot media={study.siteShots.phone} sizes="(max-width: 760px) 60vw, 280px" />
                  </PhoneFrame>
                  {study.siteShots.phone.caption && <figcaption className="cs-caption">{study.siteShots.phone.caption}</figcaption>}
                </Rise>
              )}
            </div>

            {study.gallery && (
              <div className="cs-sub" id="screens">
                <Rise>
                  <p className="cs-kicker">The rest of it</p>
                  <h3 className="cs-h3">{q.screens}</h3>
                  <p className="cs-claim cs-claim-sm">{study.gallery.heading}</p>
                  <p className="cs-lead">{study.gallery.intro}</p>
                </Rise>
                <ul className="cs-newpages">
                  {study.gallery.items.map((g, i) => (
                    <Rise as="li" key={g.src} delay={Math.min(i * 0.07, 0.21)}>
                      <figure className="cs-newpage">
                        <BrowserFrame url="workingwithgod.live">
                          <div className="cs-pg-view cs-pg-view-sm" tabIndex={0} aria-label={`${g.caption.split('.')[0]}. Hover or focus to scroll the capture.`}>
                            <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes="(max-width: 760px) 86vw, 360px" className="cs-pg-img" />
                          </div>
                        </BrowserFrame>
                        <figcaption className="cs-caption">{g.caption}</figcaption>
                      </figure>
                    </Rise>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── What we did, as a timeline (software builds render it inside
          ProductStory, under the stack) ───────────────────────────────── */}
      {!isProduct && (
      <section className="cs-section" id="work">
        <div className="cs-container">
          <SectionHead
            kicker={workKicker}
            question={q.work}
            claim={
              labels.workHeading ?? (
                <>
                  {capital(numberWord(study.workstreams.length))} workstreams, <span className="cs-ink-accent">one team, one invoice.</span>
                </>
              )
            }
          >
            {!isFounder && (
              <p className="cs-lead">
                Each of these is a service you can buy on its own. They are listed in the order they were sequenced, because the order is most of why it worked.
              </p>
            )}
          </SectionHead>
          <WorkTimeline items={study.workstreams} />
        </div>
      </section>
      )}

      {/* ── Tracking system ──────────────────────────────────────────────── */}
      {tracking && (
        <section className="cs-section cs-tone-paper" id="tracking">
          <div className="cs-container">
            <SectionHead kicker="Tracking" question={tracking.heading} claim={tracking.claim}>
              {tracking.body[0] && <p className="cs-body">{tracking.body[0]}</p>}
            </SectionHead>
            <Rise>
              <DashboardMock rows={tracking.rows} client={who} />
              <p className="cs-caption">
                A picture of the dashboard&apos;s layout, built only from the table below. {tracking.notPublished}
              </p>
            </Rise>
            <Rise>
              <details className="cs-more cs-more-wide">
                <summary>
                  <span>Every source, what it tracks and the decision it drives</span>
                  <span className="cs-more-count">{tracking.rows.length} sources</span>
                </summary>
                <div className="cs-more-body">
                  <div className="cs-table-scroll">
                    <table className="cs-table cs-track">
                      <caption className="cs-sr">What the {who} dashboard tracks and the decision each source drives</caption>
                      <thead>
                        <tr>
                          <th scope="col">Source</th>
                          <th scope="col">What is tracked</th>
                          <th scope="col">Decision it drives</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tracking.rows.map((r) => (
                          <tr key={r.source}>
                            <th scope="row">{r.source}</th>
                            <td>{r.tracked}</td>
                            <td>{r.decision}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>
              {tracking.body.length > 1 && (
                <details className="cs-more cs-more-wide">
                  <summary>
                    <span>How the dashboard and the MCP server work</span>
                    <span className="cs-more-count">{tracking.body.length - 1} paragraphs</span>
                  </summary>
                  <div className="cs-more-body">
                    {tracking.body.slice(1).map((p) => (
                      <p className="cs-body" key={p.slice(0, 40)}>
                        {p}
                      </p>
                    ))}
                  </div>
                </details>
              )}
            </Rise>

            <div className="cs-sub">
              <Rise>
                <h3 className="cs-h3">{tracking.whyHeading}</h3>
              </Rise>
              <ol className="cs-why">
                {tracking.why.map((w, i) => (
                  <Rise as="li" key={w.title} delay={Math.min(i * 0.05, 0.2)}>
                    <span className="cs-why-num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h4 className="cs-why-title">{w.title}</h4>
                    <p className="cs-why-detail">{w.detail}</p>
                  </Rise>
                ))}
              </ol>
            </div>

            <div className="cs-track-split cs-sub">
              <Rise>
                <h3 className="cs-h3">What a client gets from it</h3>
                <ul className="cs-points">
                  {tracking.clientGets.map((c) => (
                    <li key={c.slice(0, 40)}>{c}</li>
                  ))}
                </ul>
              </Rise>
              {tracking.examples.length > 0 && (
                <Rise delay={0.06}>
                  <h3 className="cs-h3">Decisions the data drove</h3>
                  <ul className="cs-points">
                    {tracking.examples.map((e) => (
                      <li key={e.title}>
                        <strong>{e.title}.</strong> {e.detail}
                      </li>
                    ))}
                  </ul>
                </Rise>
              )}
            </div>

            {trackingScreens.length > 0 && (
              <ul className="cs-newpages cs-sub">
                {trackingScreens.map((g) => (
                  <li key={g.src}>
                    <figure className="cs-newpage">
                      <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes="(max-width: 760px) 90vw, 360px" />
                      {g.caption && <figcaption className="cs-caption">{g.caption}</figcaption>}
                    </figure>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* ── Proof: the export ──────────────────────────────────────────── */}
      {study.proof.length > 0 && (
        <section className="cs-section" id="export">
          <div className="cs-container">
            <SectionHead kicker="The export" question={q.exportQ} claim="The screens this all came from." />
            <div className="cs-proofs">
              {study.proof.map((p, i) => (
                <Rise as="figure" key={p.src} className="cs-proof" delay={i * 0.06}>
                  <BrowserFrame url="search.google.com/search-console">
                    <a href={p.src} target="_blank" rel="noopener" className="cs-proof-link" aria-label="Open the full-size screenshot">
                      <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(max-width: 1000px) 92vw, 560px" />
                    </a>
                  </BrowserFrame>
                  <figcaption className="cs-caption">
                    {p.caption}{' '}
                    <a href={p.src} target="_blank" rel="noopener">
                      Open full size
                    </a>
                  </figcaption>
                </Rise>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How this was measured ────────────────────────────────────────── */}
      <section className="cs-section cs-tone-paper" id="measured">
        <div className="cs-container">
          <SectionHead kicker="Method" question={q.measured}>
            {isFounder && <p className="cs-claim cs-claim-sm">{study.resultLine}</p>}
          </SectionHead>
          <Rise>
            <div className="cs-table-scroll">
              <table className="cs-table cs-facts">
                <caption className="cs-sr">How the figures on this page were measured</caption>
                <tbody>
                  <tr>
                    <th scope="row">Tool</th>
                    <td>{study.measurement.tool}</td>
                  </tr>
                  <tr>
                    <th scope="row">Date ranges</th>
                    <td>{study.measurement.dateRanges}</td>
                  </tr>
                  <tr>
                    <th scope="row">What is counted</th>
                    <td>{study.measurement.counted}</td>
                  </tr>
                  <tr>
                    <th scope="row">What is not counted</th>
                    <td>{study.measurement.notCounted}</td>
                  </tr>
                  {study.measurement.extra?.map((r) => (
                    <tr key={r.label}>
                      <th scope="row">{r.label}</th>
                      <td>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasOpen && (
            <div className="cs-sub cs-sub-tight">
              <h3 className="cs-h3">{isFounder ? 'Limits stated on this page' : 'Open problems that affect these numbers'}</h3>
              <ul className="cs-openlist">
                {study.openProblems.map((p) => (
                  <li key={p.title}>
                    <span>{p.title}</span> <span className="cs-openstatus">{p.status}</span>
                  </li>
                ))}
              </ul>
              <p className="cs-factlinks">
                <a href="#open">
                  Read each one in full<span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            </div>
            )}
          </Rise>
        </div>
      </section>

      {/* ── Mid-page ask ─────────────────────────────────────────────────── */}
      <section className="cs-midcta-section">
        <div className="cs-container">
          <Rise>
            <div className="cs-midcta">
              <div>
                <p className="cs-midcta-text">{study.midCtaText}</p>
                {study.slug === 'magicbnb-seo-aeo' && (
                  <p className="cs-midcta-fine">
                    This is the search work in the Growth plan, {GROWTH.priceLabel} a month, month-to-month.
                  </p>
                )}
              </div>
              <div className="cs-midcta-actions">
                <BookButton location="case_study_mid" />
                {isFounder && (
                  <a className="cs-textlink cs-textlink-light" href={FREE_EDITS_URL} data-track="case_study_cta_click" data-track-location="case_study_mid_free_edits">
                    {FREE_EDITS_LABEL}
                  </a>
                )}
                <Link className="cs-textlink cs-textlink-light" href="/pricing">
                  See prices
                </Link>
              </div>
            </div>
          </Rise>
        </div>
      </section>

      {/* ── Still broken (hidden when a study has nothing open) ─────────── */}
      {hasOpen && (
      <section className="cs-section cs-section-dark" id="open">
        <div className="cs-container">
          <SectionHead
            kicker={openKicker}
            question={q.open}
            light
            claim={
              isFounder ? (
                capital(study.openProblemsAccent)
              ) : (
                <>
                  What is still broken, <span className="cs-accent">{study.openProblemsAccent}</span>
                </>
              )
            }
          >
            {!isFounder && (
              <p className="cs-lead cs-lead-light">
                A case study that reports only wins is an advertisement. This is the current open list on this account. Publishing it is the reason the rest of the page is worth believing.
              </p>
            )}
          </SectionHead>
          <ol className="cs-problems">
            {study.openProblems.map((p, i) => (
              <Rise as="li" key={p.title} delay={Math.min(i * 0.04, 0.16)} className="cs-problem">
                <span className="cs-status">{p.status}</span>
                <h3 className="cs-problem-title">{p.title}</h3>
                <p className="cs-problem-detail">{p.detail}</p>
              </Rise>
            ))}
          </ol>
        </div>
      </section>
      )}

      {/* ── Limits ─────────────────────────────────────────────────────── */}
      <section className="cs-section" id="scope">
        <div className="cs-container">
          <SectionHead kicker={limitsKicker} question={q.scope} claim={labels.limitsHeading}>
            {!isFounder && (
              <p className="cs-lead">
                {capital(numberWord(study.notApplicable.length))} situations where the honest answer is that this programme does not fit, and we would say so on the call rather than after the invoice.
              </p>
            )}
          </SectionHead>
          <ul className="cs-limit-grid">
            {study.notApplicable.map((l, i) => (
              <Rise as="li" key={l.title} delay={Math.min(i * 0.05, 0.2)} className="cs-limit">
                <h3 className="cs-limit-title">{l.title}</h3>
                <p className="cs-limit-detail">{l.detail}</p>
              </Rise>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Cite, and who EchoPulse is ─────────────────────────────────────
          The citation line is plain server HTML; the button only copies it.
          The publisher sentences match public/llms.txt. */}
      <section className="cs-cite-section">
        <div className="cs-container">
          <div className="cs-cite-grid">
            <div className="cs-cite" id="cite">
              <h2 className="cs-cite-h">{isFounder ? 'Cite this page' : 'Cite this case study'}</h2>
              <p className="cs-cite-text">{citation}</p>
              <dl className="cs-cite-meta">
                <div>
                  <dt>Author</dt>
                  <dd>
                    <Link href={CASE_STUDY_AUTHOR.path}>{CASE_STUDY_AUTHOR.name}</Link>
                  </dd>
                </div>
                <div>
                  <dt>Publisher</dt>
                  <dd>{CASE_STUDY_PUBLISHER}</dd>
                </div>
                <div>
                  <dt>Published</dt>
                  <dd>
                    <time dateTime={study.publishedISO}>{published}</time>
                  </dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>
                    <time dateTime={updatedISO}>{formatISODate(updatedISO)}</time>
                  </dd>
                </div>
                <div>
                  <dt>URL</dt>
                  <dd>{canonical}</dd>
                </div>
              </dl>
              <CopyCitation text={citation} />
            </div>
            <div className="cs-cite" id="about-echopulse">
              <h2 className="cs-cite-h">Who is EchoPulse Media?</h2>
              <p className="cs-cite-text">
                EchoPulse Media (echopulse.media) is a small, owner-operated, done-for-you content and website studio founded in 2025 by Lakshya Soni.
              </p>
              <p className="cs-cite-text">
                It sells a free sample of 2 edited videos, a {PILOT.priceLabel} Pilot ({PILOT.per}), Presence Engine at {PRESENCE.priceLabel} a month and Growth at {GROWTH.priceLabel} a month, both month-to-month, and quotes bigger scopes on a call.
              </p>
              <p className="cs-cite-text">
                It is for founders, coaches, real estate agents, home-service owners and DTC brands in the United States, United Kingdom, Canada, Australia and Western Europe.
              </p>
              <p className="cs-factlinks">
                <Link href="/what-is-echopulse-media">
                  What is EchoPulse Media<span aria-hidden="true"> &rarr;</span>
                </Link>
                <Link href="/pricing">
                  See prices<span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Is this right for you ──────────────────────────────────────── */}
      <section className="cs-section cs-tone-paper" id="fit">
        <div className="cs-container">
          <SectionHead kicker="Fit" question={q.fit} />
          <div className="cs-fit">
            <Rise className="cs-fit-col cs-fit-yes">
              <h3 className="cs-fit-h">It suits you if</h3>
              <ul>
                {study.fit.suits.map((x) => (
                  <li key={x.slice(0, 40)}>{x}</li>
                ))}
              </ul>
            </Rise>
            <Rise className="cs-fit-col cs-fit-no" delay={0.08}>
              <h3 className="cs-fit-h">It does not suit you if</h3>
              <ul>
                {notFor.map((x) => (
                  <li key={x.slice(0, 40)}>{x}</li>
                ))}
              </ul>
            </Rise>
          </div>
        </div>
      </section>

      {/* ── Close ──────────────────────────────────────────────────────── */}
      <section className="cs-close" id="book-call">
        <div className="cs-container">
          <Rise>
            {isFounder ? (
              <h2 className="cs-h2 cs-h2-light cs-close-h">
                Talk to <span className="cs-accent">EchoPulse.</span>
              </h2>
            ) : (
              <>
                <h2 className="cs-h2 cs-h2-light cs-close-h">
                  This is one client, and we say so <span className="cs-accent">everywhere it matters.</span>
                </h2>
                <p className="cs-lead cs-lead-light">
                  {study.closeText ?? (
                    <>
                      We are not going to tell you this happens every time, because we have published it once. What we will do on a call is look at your {study.chart ? 'Search Console' : 'site'}, tell you which of the {numberWord(study.situation.failures.length)} problems above it has, and give you the 30 day plan either way.
                    </>
                  )}
                </p>
              </>
            )}
            <div className="cs-close-cta">
              <BookButton location="case_study_close" large />
              <Link className="cs-textlink cs-textlink-light" href="/pricing">
                See prices
              </Link>
            </div>
            <p className="cs-reassure">{callLine}</p>
            <div className="cs-closelinks">
              {study.relatedService && (
                <Link href={`/services/${study.relatedService.slug}`}>
                  {study.relatedService.label}
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              )}
              {icp && (
                <Link href={`/${icp.key}`}>
                  Content and funnels for {icp.name.toLowerCase()}
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              )}
              <Link href="/case-studies">
                All case studies<span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </Rise>
        </div>
      </section>

      <style>{CASE_STUDY_CSS}</style>
      {isProduct && <style>{PRODUCT_CSS}</style>}
    </main>
  );
}
