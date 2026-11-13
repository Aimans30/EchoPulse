"use client";

import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/lib/caseStudyData";
import { getIcp } from "@/lib/icpData";
import {
  BOOK_CALL_URL,
  BOOK_CALL_LABEL,
  BOOK_CALL_REASSURANCE,
  FREE_EDITS_LABEL,
  FREE_EDITS_URL,
} from "@/lib/links";
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
  const limitsHeading =
    labels.limitsHeading ?? "When this approach is the wrong one.";

  const hasNumbers = Boolean(
    (study.bars && study.bars.length) || study.months || study.funnel,
  );
  const maxImpressions = study.months
    ? Math.max(...study.months.map((m) => parseCount(m.impressions)), 1)
    : 1;
  const tldr = (study.tldr ?? []).map(splitLead);
  const heroMetricCount = study.heroMetrics.length;

  const sections: SectionNavItem[] = [
    { id: "glance", label: "At a glance" },
    { id: "situation", label: situationKicker },
    { id: "work", label: workKicker },
    ...(hasNumbers ? [{ id: "numbers", label: "The numbers" }] : []),
    ...(study.gallery ? [{ id: "screens", label: "Screens" }] : []),
    ...(study.proof.length > 0 ? [{ id: "export", label: "The export" }] : []),
    { id: "open", label: openKicker },
    { id: "scope", label: limitsKicker },
  ];

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
    <main className="cs-root">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="cs-hero">
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
                <p className="cs-summary">{study.summary}</p>
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
                    href={BOOK_CALL_URL}
                    target="_blank"
                    rel="noopener"
                  >
                    {BOOK_CALL_LABEL}
                  </a>
                  <p className="cs-reassure">{BOOK_CALL_REASSURANCE}</p>
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
              <h2 className="cs-h2">At a glance</h2>
              {!isFounder && (
                <p className="cs-lead">
                  The whole engagement in one table, including how every number
                  on this page was measured.
                </p>
              )}
            </div>
            <dl className="cs-glance">
              {study.atAGlance.map((row) => (
                <div className="cs-glance-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── The situation ──────────────────────────────────────────────── */}
      <section className="cs-section cs-tone-paper" id="situation">
        <div className="cs-container">
          <Reveal>
            <div className="cs-section-head" style={{ marginBottom: 0 }}>
              <p className="cs-kicker">{situationKicker}</p>
              <h2 className="cs-h2">{study.situation.headline}</h2>
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
              <h2 className="cs-h2">
                {labels.workHeading ?? (
                  <>
                    {capital(numberWord(study.workstreams.length))} workstreams,{" "}
                    <span className="cs-ink-accent">
                      one team, one invoice.
                    </span>
                  </>
                )}
              </h2>
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
                <h2 className="cs-h2">The numbers</h2>
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
                  className={
                    study.bars && study.bars.length > 0 ? "cs-sub" : undefined
                  }
                >
                  <p className="cs-kicker">The curve, month by month</p>
                  <h3 className="cs-h3">
                    Every month in the window, including the two that produced
                    nothing.
                  </h3>
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
                <div className="cs-sub">
                  <h3 className="cs-h3">The rest of the funnel</h3>
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

      {/* ── Supporting screens ─────────────────────────────────────────── */}
      {study.gallery && (
        <section className="cs-section cs-tone-cream" id="screens">
          <div className="cs-container">
            <Reveal>
              <div className="cs-section-head">
                <p className="cs-kicker">The rest of it</p>
                <h2 className="cs-h2">{study.gallery.heading}</h2>
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
                <h2 className="cs-h2">The screen this all came from.</h2>
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

      {/* ── Mid-page CTA ───────────────────────────────────────────────────
          Own section because the proof block is conditional and the ask is
          not. For the founder story the free edits link leads. */}
      <section className="cs-midcta-section">
        <div className="cs-container">
          <Reveal>
            <div className="cs-midcta">
              <p className="cs-midcta-text">{study.midCtaText}</p>
              <div className="cs-midcta-actions">
                {isFounder && (
                  <a className="cs-btn cs-btn-primary" href={FREE_EDITS_URL}>
                    {FREE_EDITS_LABEL}
                  </a>
                )}
                <a
                  className={`cs-btn ${isFounder ? "cs-btn-ghost" : "cs-btn-primary"}`}
                  href={BOOK_CALL_URL}
                  target="_blank"
                  rel="noopener"
                >
                  {BOOK_CALL_LABEL}
                </a>
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
              <h2 className="cs-h2 cs-h2-light">
                {labels.openProblemsHeading ?? (
                  <>
                    What is still broken,{" "}
                    <span className="cs-accent">
                      {study.openProblemsAccent}
                    </span>
                  </>
                )}
              </h2>
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
              <h2 className="cs-h2">{limitsHeading}</h2>
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
                  at your Search Console, tell you which of the{" "}
                  {numberWord(study.situation.failures.length)} failures above
                  your site has, and give you the 30 day plan either way.
                </p>
              </>
            )}
            <div className="cs-close-cta">
              <a
                className="cs-btn cs-btn-primary cs-btn-lg"
                href={BOOK_CALL_URL}
                target="_blank"
                rel="noopener"
              >
                {BOOK_CALL_LABEL}
              </a>
              <p className="cs-reassure">{BOOK_CALL_REASSURANCE}</p>
            </div>
            <div className="cs-closelinks">
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
