"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  type CaseStudy,
  CASE_STUDY_AUTHOR,
  CASE_STUDY_PUBLISHER,
  canonicalFor,
  citationFor,
  formatISODate,
} from "@/lib/caseStudyData";
import { getIcp } from "@/lib/icpData";
import {
  staticBookingUrl,
  BOOK_CALL_LABEL,
  BOOK_CALL_REASSURANCE,
  FREE_EDITS_LABEL,
  FREE_EDITS_URL,
} from "@/lib/links";
import { GROWTH, PILOT, PRESENCE } from "@/lib/pricing";
import Reveal from "@/components/icp/Reveal";
import ImpressionChart from "./ImpressionChart";
import BeforeAfter from "./BeforeAfter";
import BarChart from "./BarChart";
import WorkstreamList from "./WorkstreamList";
import SectionNav, { type SectionNavItem } from "./SectionNav";
import { CASE_STUDY_CSS } from "./caseStudyStyles";

/**
 * Case study detail page.
 *
 * THE ARGUMENT THIS PAGE IS BUILT TO MAKE
 *
 * EchoPulse has no testimonials and one permissioned client. A studio in that
 * position cannot ask a stranger to trust its claims about itself, so this page
 * does not try. It makes claims that require nothing but checking: a named
 * client with a live URL, a named measurement instrument, an exact date window,
 * a chart drawn from the raw daily export with nothing smoothed, and a list of
 * what is still broken.
 *
 * SECTION ORDER IS DELIBERATE
 *
 * Result, then verification, then method, then failures, then limits, then ask.
 * A sceptical buyer wants to know whether the number is real before they will
 * spend attention on how it was produced, so the chart and the source caption
 * come before any description of the work. The open-problems section is given
 * the same visual weight as the results, not tucked into a footnote, because it
 * is the section that makes the results believable.
 *
 * WHY THERE IS NO STICKY CTA
 *
 * The mobile sticky CTA was removed from the blog for looking cheap, and the
 * same logic applies harder here: a page whose entire argument is restraint
 * should not chase the reader down the screen. Three CTAs sit at natural
 * decision points instead, after the proof, and at the end.
 */

const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];
const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n);
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Result: text" becomes { label: 'Result', text: 'text' }. */
function splitLead(line: string): { label: string | null; text: string } {
  const i = line.indexOf(":");
  if (i > 0 && i <= 24)
    return { label: line.slice(0, i), text: line.slice(i + 1).trim() };
  return { label: null, text: line };
}

/** Impressions strings look like "13,466". Anything unparseable draws no bar. */
const parseCount = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const ORIGIN = "https://echopulse.media";

/** At-a-glance rows that the Key facts table already states. Not repeated. */
const GLANCE_COVERED = new Set([
  "Client",
  "Who",
  "Industry",
  "Starting point",
  "Date window",
  "Measured result",
  "How measured",
  "Last updated",
]);

/**
 * Copy button for the citation. The citation text itself is rendered by the
 * page as plain server HTML; this only copies it. Fails silently where the
 * clipboard API is unavailable, because the text is selectable either way.
 */
function CopyCitation({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="cs-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard blocked: the text is on the page to select by hand */
        }
      }}
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy citation"}</span>
    </button>
  );
}

export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const icp = getIcp(study.icpKey);
  const labels = study.labels ?? {};
  const isFounder = study.kind === "founder";
  const internalLink = study.clientUrl.startsWith(ORIGIN);
  const internalHref = study.clientUrl.slice(ORIGIN.length) || "/";
  const clientLinkLabel =
    labels.clientLinkLabel ??
    `Open ${study.clientUrl.replace("https://", "")} and check`;

  const situationKicker = labels.situationKicker ?? "Where it started";
  const workKicker = labels.workKicker ?? "What we did";
  const openKicker = labels.openProblemsKicker ?? "Open problems";
  const limitsKicker = labels.limitsKicker ?? "Scope";

  const hasNumbers = Boolean(
    (study.bars && study.bars.length) || study.months || study.funnel,
  );
  const maxImpressions = study.months
    ? Math.max(...study.months.map((m) => parseCount(m.impressions)), 1)
    : 1;
  const tldr = (study.tldr ?? []).map(splitLead);
  const heroMetricCount = study.heroMetrics.length;

  const tracking = study.tracking;
  const trackingScreens = tracking?.screens ?? [];

  const sections: SectionNavItem[] = [
    { id: "glance", label: "Key facts" },
    { id: "situation", label: situationKicker },
    { id: "work", label: workKicker },
    ...(hasNumbers ? [{ id: "numbers", label: "The numbers" }] : []),
    ...(tracking ? [{ id: "tracking", label: "Tracking" }] : []),
    ...(study.pairs ? [{ id: "pages", label: "Before and after" }] : []),
    ...(study.gallery ? [{ id: "screens", label: "Screens" }] : []),
    ...(study.proof.length > 0 ? [{ id: "export", label: "The export" }] : []),
    { id: "measured", label: "How measured" },
    { id: "open", label: openKicker },
    { id: "scope", label: limitsKicker },
    { id: "fit", label: "Right for you?" },
  ];

  /**
   * QUESTION HEADINGS
   *
   * Every section H2 is the question a buyer, or an answer engine on a buyer's
   * behalf, would actually ask. The original editorial headline is kept
   * directly underneath as the first line of the answer. The ids are stable
   * anchors: do not rename them, other pages and llms.txt link to them.
   */
  const who = study.shortName;
  const q = isFounder
    ? {
        situation: `Where did ${who} work before EchoPulse?`,
        work: "What did he edit for those agents?",
        numbers: "What are the numbers?",
        pages: "What changed on each page?",
        screens: "Which pages are new?",
        exportQ: "Where is the source export?",
        measured: "How was this measured?",
        open: "What does this page not claim?",
        scope: "What does EchoPulse do differently?",
        fit: "Is EchoPulse right for you?",
      }
    : {
        situation: `What was wrong at ${who} before the work started?`,
        work: `What did EchoPulse do for ${who}?`,
        numbers: `What were the results for ${who}?`,
        pages: "What changed on each page?",
        screens: "Which pages are new?",
        exportQ: "Where is the source export?",
        measured: "How was this measured?",
        open: "What is still not working?",
        scope: "When is this approach the wrong one?",
        fit: "Is this right for you?",
      };

  const canonical = canonicalFor(study);
  const citation = citationFor(study);
  const published = formatISODate(study.publishedISO);
  const updatedISO = study.updatedISO ?? study.publishedISO;
  const wasUpdated = updatedISO !== study.publishedISO;
  const glanceRest = study.atAGlance.filter(
    (row) => !GLANCE_COVERED.has(row.label),
  );
  const notFor =
    study.fit.notFor ?? study.notApplicable.map((n) => n.title);

  const clientLink = internalLink ? (
    <Link className="cs-verify" href={internalHref}>
      {clientLinkLabel}
      <span aria-hidden="true"> &rarr;</span>
    </Link>
  ) : (
    <a
      className="cs-verify"
      href={study.clientUrl}
      target="_blank"
      rel="noopener"
    >
      {clientLinkLabel}
      <span aria-hidden="true"> &rarr;</span>
    </a>
  );

  return (
    <main id="main" className="cs-root">
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
              <Reveal>
                <p className="cs-eyebrow">{study.eyebrow}</p>
                <h1 className="cs-h1">
                  {study.headline}{" "}
                  <span className="cs-accent">{study.headlineAccent}</span>
                </h1>
                {/* The answer block. Two or three sentences that can be
                    quoted alone: client, what was done, the result with its
                    unit and dates, and the source. Plain server HTML. */}
                <div className="cs-answer" id="answer">
                  <p className="cs-answer-result">{study.resultLine}</p>
                  <p className="cs-answer-text">{study.answer.join(" ")}</p>
                  <p className="cs-byline">
                    <span>
                      By{" "}
                      <Link href={CASE_STUDY_AUTHOR.path} rel="author">
                        {CASE_STUDY_AUTHOR.name}
                      </Link>
                      , {CASE_STUDY_PUBLISHER}
                    </span>
                    <span>
                      Published{" "}
                      <time dateTime={study.publishedISO}>{published}</time>
                    </span>
                    {wasUpdated && (
                      <span>
                        Updated{" "}
                        <time dateTime={updatedISO}>
                          {formatISODate(updatedISO)}
                        </time>
                      </span>
                    )}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="cs-clientbar">
                  <div className="cs-clientbar-main">
                    <p className="cs-client-name">{study.client}</p>
                    <p className="cs-client-tag">{study.clientTagline}</p>
                  </div>
                  {/* The verification link is the whole mechanism. A claim the
                      reader can check in one click is worth more than a
                      testimonial they cannot. */}
                  {clientLink}
                </div>
                <ul className="cs-services" aria-label="Services delivered">
                  {study.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="cs-hero-cta">
                  <a
                    className="cs-btn cs-btn-primary"
                    href={staticBookingUrl("case_study_hero")}
                    data-track="case_study_cta_click"
                    data-track-location="case_study_hero"
                    target="_blank"
                    rel="noopener"
                  >
                    {BOOK_CALL_LABEL}
                  </a>
                  <p className="cs-reassure">{BOOK_CALL_REASSURANCE}</p>
                  {study.slug !== "magicbnb-seo-aeo" && (
                    <Link className="cs-textlink cs-textlink-light" href="/pricing">
                      See prices
                    </Link>
                  )}
                  {study.slug === "magicbnb-seo-aeo" ? (
                    <p className="cs-reassure">
                      This is the search work in the Growth plan, {GROWTH.priceLabel} a month, month-to-month.{" "}
                      <Link href="/pricing">See prices</Link>.
                    </p>
                  ) : null}
                </div>
              </Reveal>
            </div>

            {/* The evidence block. A measured engagement gets the daily series;
                a visible-result engagement gets the before and after; a story
                with neither gets its photo. One visual is always present. */}
            <div className="cs-hero-visual">
              <Reveal delay={0.1}>
                {study.chart ? (
                  <div className="cs-chartblock">
                    <ImpressionChart chart={study.chart} />
                    <p className="cs-chart-caption">{study.chart.caption}</p>
                  </div>
                ) : study.comparison ? (
                  <div className="cs-chartblock">
                    <BeforeAfter data={study.comparison} />
                  </div>
                ) : study.heroMedia ? (
                  <figure className="cs-photo">
                    <div className="cs-photo-frame">
                      <Image
                        src={study.heroMedia.src}
                        alt={study.heroMedia.alt}
                        width={study.heroMedia.width}
                        height={study.heroMedia.height}
                        sizes="(max-width: 1000px) 100vw, 560px"
                        loading="eager"
                        fetchPriority="high"
                      />
                    </div>
                    {study.heroMedia.caption && (
                      <figcaption>{study.heroMedia.caption}</figcaption>
                    )}
                  </figure>
                ) : null}
              </Reveal>

              {/* Metric strip. This is the block an answer engine is most
                  likely to lift, so every value carries its unit and its
                  qualifier. */}
              <Reveal delay={0.16}>
                <ul className="cs-metrics" data-count={heroMetricCount}>
                  {study.heroMetrics.map((m) => (
                    <li className="cs-metric" key={m.label}>
                      <p className="cs-metric-value">{m.value}</p>
                      <p className="cs-metric-label">{m.label}</p>
                      {m.note && <p className="cs-metric-note">{m.note}</p>}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── TL;DR ──────────────────────────────────────────────────────── */}
      {tldr.length > 0 && (
        <section className="cs-tldr" aria-labelledby="cs-tldr-h">
          <div className="cs-container">
            <h2 className="cs-sr" id="cs-tldr-h">
              Summary
            </h2>
            <ul className="cs-tldr-grid">
              {tldr.map((t, i) => (
                <Reveal as="li" key={t.text.slice(0, 40)} delay={i * 0.06}>
                  <div className="cs-tldr-card">
                    {t.label && <p className="cs-tldr-label">{t.label}</p>}
                    <p className="cs-tldr-text">{t.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <SectionNav items={sections} />

      {/* ── At a glance ────────────────────────────────────────────────── */}
      <section className="cs-section cs-tone-cream" id="glance">
        <div className="cs-container">
          <Reveal>
            <div className="cs-section-head">
              <h2 className="cs-h2">Key facts</h2>
              <p className="cs-body">{study.summary}</p>
            </div>
            <div className="cs-table-scroll">
              <table className="cs-table cs-facts">
                <caption className="cs-sr">
                  Key facts: {study.client}
                </caption>
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
                            <Link href={row.href.slice(ORIGIN.length) || "/"}>
                              {row.value}
                            </Link>
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
                How this was measured
                <span aria-hidden="true"> &rarr;</span>
              </a>
              <a href="#cite">
                Cite this page
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </p>
            {glanceRest.length > 0 && (
              <div className="cs-sub" id="engagement">
                <h3 className="cs-h3">
                  {isFounder ? "More detail" : "The engagement in detail"}
                </h3>
                <dl className="cs-glance">
                  {glanceRest.map((row) => (
                    <div className="cs-glance-row" key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── The situation ──────────────────────────────────────────────── */}
      <section className="cs-section cs-tone-paper" id="situation">
        <div className="cs-container">
          <Reveal>
            <div className="cs-section-head" style={{ marginBottom: 0 }}>
              <p className="cs-kicker">{situationKicker}</p>
              <h2 className="cs-h2">{q.situation}</h2>
              <p className="cs-claim">{study.situation.headline}</p>
              {study.situation.body.map((p) => (
                <p className="cs-body" key={p.slice(0, 40)}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
          <ol className="cs-fail-grid">
            {study.situation.failures.map((f, i) => (
              <Reveal as="li" key={f.title} delay={Math.min(i * 0.05, 0.2)}>
                <div className="cs-fail-card">
                  <h3 className="cs-fail-title">{f.title}</h3>
                  <p className="cs-fail-desc">{f.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What we did ────────────────────────────────────────────────── */}
      <section className="cs-section cs-tone-cream" id="work">
        <div className="cs-container">
          <Reveal>
            <div className="cs-section-head">
              <p className="cs-kicker">{workKicker}</p>
              <h2 className="cs-h2">{q.work}</h2>
              <p className="cs-claim">
                {labels.workHeading ?? (
                  <>
                    {capital(numberWord(study.workstreams.length))} workstreams,{" "}
                    <span className="cs-ink-accent">
                      one team, one invoice.
                    </span>
                  </>
                )}
              </p>
              {!isFounder && (
                <p className="cs-lead">
                  Each of these is a service you can buy on its own. They are
                  listed here in the order they were sequenced, because the
                  order is most of why it worked.
                </p>
              )}
            </div>
          </Reveal>
          <WorkstreamList items={study.workstreams} />
        </div>
      </section>

      {/* ── Numbers ────────────────────────────────────────────────────── */}
      {hasNumbers && (
        <section className="cs-section cs-tone-paper" id="numbers">
          <div className="cs-container">
            <Reveal>
              <div className="cs-section-head" style={{ marginBottom: 28 }}>
                <p className="cs-kicker">The numbers</p>
                <h2 className="cs-h2">{q.numbers}</h2>
                <p className="cs-lead">{study.resultLine}</p>
              </div>
            </Reveal>

            {study.bars && study.bars.length > 0 && (
              <div className="cs-bars-grid">
                {study.bars.map((b, i) => (
                  <Reveal key={b.title} delay={Math.min(i * 0.06, 0.2)}>
                    <BarChart data={b} />
                  </Reveal>
                ))}
              </div>
            )}

            {study.months && (
              <Reveal>
                <div
                  id="timeline"
                  className={
                    study.bars && study.bars.length > 0
                      ? "cs-sub cs-anchor"
                      : "cs-anchor"
                  }
                >
                  <p className="cs-kicker">The curve, month by month</p>
                  <h3 className="cs-h3">How long did it take?</h3>
                  {study.timelineAnswer && (
                    <p className="cs-body">{study.timelineAnswer}</p>
                  )}
                  <p className="cs-claim cs-claim-sm">
                    Every month in the window, including the two that produced
                    nothing.
                  </p>
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
                        {study.months.map((m) => {
                          const w =
                            (parseCount(m.impressions) / maxImpressions) * 100;
                          return (
                            <tr key={m.month}>
                              <th scope="row">{m.month}</th>
                              <td className="cs-num cs-imp">
                                <span className="cs-imp-cell">
                                  <span className="cs-imp-num">
                                    {m.impressions}
                                  </span>
                                  <span
                                    className="cs-imp-bar"
                                    aria-hidden="true"
                                  >
                                    <i
                                      style={{
                                        width: `${w}%`,
                                        display: w > 0 ? "block" : "none",
                                      }}
                                    />
                                  </span>
                                </span>
                              </td>
                              <td className="cs-num">{m.perDay}</td>
                              <td className="cs-note">{m.note}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Reveal>
            )}

            {study.funnel && (
              <Reveal>
                <div className="cs-sub cs-anchor" id="funnel">
                  <p className="cs-kicker">The rest of the funnel</p>
                  <h3 className="cs-h3">Did sessions and clicks grow too?</h3>
                  <p className="cs-body">{study.funnel.intro}</p>
                  <div className="cs-table-scroll">
                    <table className="cs-table">
                      <thead>
                        <tr>
                          <th scope="col">Metric</th>
                          <th scope="col">
                            {study.funnel.beforeLabel ?? "Prior 31 days"}
                          </th>
                          <th scope="col">
                            {study.funnel.afterLabel ?? "Last 30 days"}
                          </th>
                          <th scope="col">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {study.funnel.rows.map((r) => (
                          <tr key={r.label}>
                            <th scope="row">{r.label}</th>
                            <td className="cs-num">{r.before}</td>
                            <td className="cs-num">{r.after}</td>
                            <td
                              className={`cs-num cs-change cs-change-${r.direction}`}
                            >
                              {r.change}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="cs-body cs-reading">
                    <strong>
                      {study.funnel.readingLabel ??
                        "Reading the two that moved the wrong way."}
                    </strong>{" "}
                    {study.funnel.reading}
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ── Tracking system ────────────────────────────────────────────────
          Only where one was built. The capability table is a real table so
          the source, the thing tracked and the decision stay together when
          the block is lifted. `screens` renders only when captures exist. */}
      {tracking && (
        <section className="cs-section cs-tone-cream" id="tracking">
          <div className="cs-container">
            <Reveal>
              <div className="cs-section-head">
                <p className="cs-kicker">Tracking</p>
                <h2 className="cs-h2">{tracking.heading}</h2>
                <p className="cs-claim">{tracking.claim}</p>
                {tracking.body.map((p) => (
                  <p className="cs-body" key={p.slice(0, 40)}>
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <div className="cs-table-scroll">
                <table className="cs-table cs-track">
                  <caption className="cs-sr">
                    What the {who} dashboard tracks and the decision each
                    source drives
                  </caption>
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
              <p className="cs-fineprint">{tracking.notPublished}</p>
            </Reveal>

            <Reveal>
              <div className="cs-sub">
                <h3 className="cs-h3">{tracking.whyHeading}</h3>
                <ul className="cs-why-grid">
                  {tracking.why.map((w) => (
                    <li className="cs-why" key={w.title}>
                      <h4 className="cs-why-title">{w.title}</h4>
                      <p className="cs-why-detail">{w.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <div className="cs-track-split cs-sub">
              <Reveal>
                <h3 className="cs-h3">What a client gets from it</h3>
                <ul className="cs-work-points">
                  {tracking.clientGets.map((c) => (
                    <li key={c.slice(0, 40)}>{c}</li>
                  ))}
                </ul>
              </Reveal>
              {tracking.examples.length > 0 && (
                <Reveal delay={0.06}>
                  <h3 className="cs-h3">Decisions the data drove</h3>
                  <ul className="cs-work-points">
                    {tracking.examples.map((e) => (
                      <li key={e.title}>
                        <strong>{e.title}.</strong> {e.detail}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>

            {trackingScreens.length > 0 && (
              <ul className="cs-gallery cs-sub">
                {trackingScreens.map((g) => (
                  <li key={g.src}>
                    <figure className="cs-gal">
                      <Image
                        src={g.src}
                        alt={g.alt}
                        width={g.width}
                        height={g.height}
                        sizes="(max-width: 760px) 50vw, 360px"
                      />
                      {g.caption && <figcaption>{g.caption}</figcaption>}
                    </figure>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* ── Page-by-page before and after ──────────────────────────────── */}
      {study.pairs && (
        <section className="cs-section cs-tone-cream" id="pages">
          <div className="cs-container">
            <Reveal>
              <div className="cs-section-head">
                <p className="cs-kicker">Before and after</p>
                <h2 className="cs-h2">{q.pages}</h2>
                <p className="cs-claim">{study.pairs.heading}</p>
                <p className="cs-lead">{study.pairs.intro}</p>
              </div>
            </Reveal>
            <ol className="cs-pairs">
              {study.pairs.items.map((pair, i) => (
                <Reveal as="li" key={pair.label} delay={Math.min(i * 0.05, 0.15)}>
                  <div className="cs-pair">
                    <div className="cs-pair-head">
                      <h3>{pair.label}</h3>
                      <p>{pair.note}</p>
                    </div>
                    <div className="cs-pair-shots">
                      <figure className="cs-pair-shot">
                        <span className="cs-pair-tag">Before</span>
                        <div className="cs-pair-frame" tabIndex={0} role="group" aria-label={`${pair.label}, old page. Scroll to see more.`}>
                          <Image src={pair.before.src} alt={pair.before.alt} width={pair.before.width} height={pair.before.height} sizes="(max-width: 760px) 92vw, 520px" />
                        </div>
                      </figure>
                      <figure className="cs-pair-shot">
                        <span className="cs-pair-tag cs-pair-tag-after">After</span>
                        <div className="cs-pair-frame" tabIndex={0} role="group" aria-label={`${pair.label}, new page. Scroll to see more.`}>
                          <Image src={pair.after.src} alt={pair.after.alt} width={pair.after.width} height={pair.after.height} sizes="(max-width: 760px) 92vw, 520px" />
                        </div>
                        <a className="cs-pair-link" href={pair.afterUrl} target="_blank" rel="noopener noreferrer">
                          Open the live page <span aria-hidden="true">&rarr;</span>
                        </a>
                      </figure>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── Supporting screens ─────────────────────────────────────────── */}
      {study.gallery && (
        <section className="cs-section cs-tone-cream" id="screens">
          <div className="cs-container">
            <Reveal>
              <div className="cs-section-head">
                <p className="cs-kicker">The rest of it</p>
                <h2 className="cs-h2">{q.screens}</h2>
                <p className="cs-claim">{study.gallery.heading}</p>
                <p className="cs-lead">{study.gallery.intro}</p>
              </div>
            </Reveal>
            <ul className="cs-gallery">
              {study.gallery.items.map((g, i) => (
                <Reveal as="li" key={g.src} delay={Math.min(i * 0.05, 0.2)}>
                  <figure className="cs-gal">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      width={g.width}
                      height={g.height}
                      sizes="(max-width: 760px) 50vw, 360px"
                    />
                    <figcaption>{g.caption}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Proof ──────────────────────────────────────────────────────── */}
      {study.proof.length > 0 && (
        <section
          className="cs-section cs-tone-cream"
          id="export"
          style={{ paddingTop: study.gallery ? 0 : undefined }}
        >
          <div className="cs-container">
            <Reveal>
              <div className="cs-section-head">
                <p className="cs-kicker">The export</p>
                <h2 className="cs-h2">{q.exportQ}</h2>
                <p className="cs-claim">The screen this all came from.</p>
              </div>
            </Reveal>
            {study.proof.map((p) => (
              <Reveal key={p.src}>
                <figure className="cs-proof">
                  {/* Intrinsic size of the exported PNG, so the browser
                      reserves the right box and the section does not shift
                      as it loads. `quality` is pushed up because this is an
                      evidence screenshot full of small axis labels and
                      dates a sceptical reader will zoom into. */}
                  <div className="cs-proof-scroll">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      width={p.width}
                      height={p.height}
                      quality={92}
                      sizes="(max-width: 1160px) 100vw, 1096px"
                    />
                  </div>
                  <figcaption>{p.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── How this was measured ──────────────────────────────────────────
          Tool, exact date ranges, what is and is not counted, and the open
          problems that bear on the numbers. Present on every study, including
          the ones where the honest answer is that nothing was measured. */}
      <section className="cs-section cs-tone-paper" id="measured">
        <div className="cs-container">
          <Reveal>
            <div className="cs-section-head">
              <p className="cs-kicker">Method</p>
              <h2 className="cs-h2">{q.measured}</h2>
            </div>
            <div className="cs-table-scroll">
              <table className="cs-table cs-facts">
                <caption className="cs-sr">
                  How the figures on this page were measured
                </caption>
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
                </tbody>
              </table>
            </div>
            <div className="cs-sub">
              <h3 className="cs-h3">
                {isFounder
                  ? "Limits stated on this page"
                  : "Open problems that affect these numbers"}
              </h3>
              <ul className="cs-work-points">
                {study.openProblems.map((p) => (
                  <li key={p.title}>
                    {p.title}{" "}
                    <span className="cs-openstatus">{p.status}</span>
                  </li>
                ))}
              </ul>
              <p className="cs-factlinks">
                <a href="#open">
                  Read each one in full
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Mid-page CTA ───────────────────────────────────────────────────
          Own section because the proof block is conditional and the ask is
          not. For the founder story the free edits link leads. */}
      <section className="cs-midcta-section">
        <div className="cs-container">
          <Reveal>
            <div className="cs-midcta">
              <p className="cs-midcta-text">{study.midCtaText}</p>
              <div className="cs-midcta-actions">
                <a
                  className="cs-btn cs-btn-primary"
                  href={staticBookingUrl("case_study_mid")}
                  data-track="case_study_cta_click"
                  data-track-location="case_study_mid"
                  target="_blank"
                  rel="noopener"
                >
                  {BOOK_CALL_LABEL}
                </a>
                {isFounder && (
                  <a
                    className="cs-textlink cs-textlink-light"
                    href={FREE_EDITS_URL}
                    data-track="case_study_cta_click"
                    data-track-location="case_study_mid_free_edits"
                  >
                    {FREE_EDITS_LABEL}
                  </a>
                )}
                <Link className="cs-textlink cs-textlink-light" href="/pricing">
                  See prices
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Still broken ───────────────────────────────────────────────── */}
      <section className="cs-section cs-section-dark" id="open">
        <div className="cs-container">
          <Reveal>
            <div className="cs-section-head">
              <p className="cs-kicker">{openKicker}</p>
              <h2 className="cs-h2 cs-h2-light">{q.open}</h2>
              <p className="cs-claim">
                {isFounder ? (
                  capital(study.openProblemsAccent)
                ) : (
                  <>
                    What is still broken,{" "}
                    <span className="cs-accent">
                      {study.openProblemsAccent}
                    </span>
                  </>
                )}
              </p>
              {!isFounder && (
                <p className="cs-lead cs-lead-light">
                  A case study that reports only wins is an advertisement. This
                  is the current open list on this account. Publishing it is the
                  reason the rest of the page is worth believing.
                </p>
              )}
            </div>
          </Reveal>
          <ol className="cs-problems">
            {study.openProblems.map((p, i) => (
              <Reveal as="li" key={p.title} delay={Math.min(i * 0.04, 0.16)}>
                <div className="cs-problem">
                  <div className="cs-problem-head">
                    <h3 className="cs-problem-title">{p.title}</h3>
                    <span className="cs-status">{p.status}</span>
                  </div>
                  <p className="cs-problem-detail">{p.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Limits ─────────────────────────────────────────────────────── */}
      <section className="cs-section cs-tone-cream" id="scope">
        <div className="cs-container">
          <Reveal>
            <div className="cs-section-head">
              <p className="cs-kicker">{limitsKicker}</p>
              <h2 className="cs-h2">{q.scope}</h2>
              {labels.limitsHeading && (
                <p className="cs-claim">{labels.limitsHeading}</p>
              )}
              {!isFounder && (
                <p className="cs-lead">
                  {capital(numberWord(study.notApplicable.length))} situations
                  where the honest answer is that this programme does not fit,
                  and we would say so on the call rather than after the invoice.
                </p>
              )}
            </div>
          </Reveal>
          <ul className="cs-limit-grid">
            {study.notApplicable.map((l, i) => (
              <Reveal as="li" key={l.title} delay={Math.min(i * 0.05, 0.2)}>
                <div className="cs-limit">
                  <h3 className="cs-limit-title">{l.title}</h3>
                  <p className="cs-limit-detail">{l.detail}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Cite, and who EchoPulse is ─────────────────────────────────────
          The citation line is plain server HTML; the button only copies it.
          The three sentences beside it say who the publisher is, what it
          sells and who it is for, in the same words as public/llms.txt, so a
          summary of this page can describe the studio correctly. */}
      <section className="cs-cite-section">
        <div className="cs-container">
          <div className="cs-cite-grid">
            <div className="cs-cite" id="cite">
              <h2 className="cs-cite-h">
                {isFounder ? "Cite this page" : "Cite this case study"}
              </h2>
              <p className="cs-cite-text">{citation}</p>
              <dl className="cs-cite-meta">
                <div>
                  <dt>Author</dt>
                  <dd>
                    <Link href={CASE_STUDY_AUTHOR.path}>
                      {CASE_STUDY_AUTHOR.name}
                    </Link>
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
                    <time dateTime={updatedISO}>
                      {formatISODate(updatedISO)}
                    </time>
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
                EchoPulse Media (echopulse.media) is a small, owner-operated,
                done-for-you content and website studio founded in 2025 by
                Lakshya Soni.
              </p>
              <p className="cs-cite-text">
                It sells a free sample of 2 edited videos, a {PILOT.priceLabel}{" "}
                Pilot ({PILOT.per}), Presence Engine at {PRESENCE.priceLabel} a
                month and Growth at {GROWTH.priceLabel} a month, both
                month-to-month, and quotes bigger scopes on a call.
              </p>
              <p className="cs-cite-text">
                It is for founders, coaches, real estate agents, home-service
                owners and DTC brands in the United States, United Kingdom,
                Canada, Australia and Western Europe.
              </p>
              <p className="cs-factlinks">
                <Link href="/what-is-echopulse-media">
                  What is EchoPulse Media
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
                <Link href="/pricing">
                  See prices
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Is this right for you ──────────────────────────────────────── */}
      <section className="cs-section cs-tone-paper" id="fit">
        <div className="cs-container">
          <Reveal>
            <div className="cs-section-head">
              <p className="cs-kicker">Fit</p>
              <h2 className="cs-h2">{q.fit}</h2>
            </div>
            <div className="cs-fit">
              <div className="cs-fit-col cs-fit-yes">
                <h3 className="cs-fit-h">It suits you if</h3>
                <ul>
                  {study.fit.suits.map((x) => (
                    <li key={x.slice(0, 40)}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="cs-fit-col cs-fit-no">
                <h3 className="cs-fit-h">It does not suit you if</h3>
                <ul>
                  {notFor.map((x) => (
                    <li key={x.slice(0, 40)}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Close ──────────────────────────────────────────────────────── */}
      <section className="cs-close" id="book-call">
        <div className="cs-container">
          <Reveal>
            {isFounder ? (
              <h2 className="cs-h2 cs-h2-light">
                Talk to <span className="cs-accent">EchoPulse.</span>
              </h2>
            ) : (
              <>
                <h2 className="cs-h2 cs-h2-light">
                  This is one client, and we say so{" "}
                  <span className="cs-accent">everywhere it matters.</span>
                </h2>
                <p className="cs-lead cs-lead-light">
                  We are not going to tell you this happens every time, because
                  we have published it once. What we will do on a call is look
                  at your {study.chart ? "Search Console" : "site"}, tell you
                  which of the {numberWord(study.situation.failures.length)}{" "}
                  problems above it has, and give you the 30 day plan either
                  way.
                </p>
              </>
            )}
            <div className="cs-close-cta">
              <a
                className="cs-btn cs-btn-primary cs-btn-lg"
                href={staticBookingUrl("case_study_close")}
                data-track="case_study_cta_click"
                data-track-location="case_study_close"
                target="_blank"
                rel="noopener"
              >
                {BOOK_CALL_LABEL}
              </a>
              <p className="cs-reassure">{BOOK_CALL_REASSURANCE}</p>
              <Link className="cs-textlink cs-textlink-light" href="/pricing">
                See prices
              </Link>
            </div>
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
                All case studies
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{CASE_STUDY_CSS}</style>
    </main>
  );
}
