'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { CaseStudy } from '@/lib/caseStudyData';
import { getIcp } from '@/lib/icpData';
import { BOOK_CALL_URL, BOOK_CALL_LABEL, BOOK_CALL_REASSURANCE } from '@/lib/links';
import Reveal from '@/components/icp/Reveal';
import ImpressionChart from './ImpressionChart';
import BeforeAfter from './BeforeAfter';

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

export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const icp = getIcp(study.icpKey);

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

          <Reveal>
            <p className="cs-eyebrow">{study.eyebrow}</p>
            <h1 className="cs-h1">
              {study.headline} <span className="cs-accent">{study.headlineAccent}</span>
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
              <a className="cs-verify" href={study.clientUrl} target="_blank" rel="noopener">
                Open {study.clientUrl.replace('https://', '')} and check
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <ul className="cs-services" aria-label="Services delivered">
              {study.services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Reveal>

          {/* Metric strip. This is the block an answer engine is most likely
              to lift, so every value carries its unit and its qualifier. */}
          <Reveal delay={0.16}>
            <div className="cs-metrics">
              {study.heroMetrics.map((m) => (
                <div className="cs-metric" key={m.label}>
                  <p className="cs-metric-value">{m.value}</p>
                  <p className="cs-metric-label">{m.label}</p>
                  {m.note && <p className="cs-metric-note">{m.note}</p>}
                </div>
              ))}
            </div>
          </Reveal>

          {/* The evidence block. A measured engagement gets the daily series;
              an engagement whose result is visible rather than measured gets
              the before and after. A study never gets both, and one of the two
              is always present, because a case study with no evidence above
              the fold is just a page of adjectives. */}
          {study.chart && (
            <Reveal delay={0.2}>
              <div className="cs-chartblock">
                <ImpressionChart chart={study.chart} />
                <p className="cs-chart-caption">{study.chart.caption}</p>
              </div>
            </Reveal>
          )}

          {study.comparison && (
            <Reveal delay={0.2}>
              <div className="cs-chartblock">
                <BeforeAfter data={study.comparison} />
              </div>
            </Reveal>
          )}

          <Reveal delay={0.24}>
            <div className="cs-hero-cta">
              <a className="cs-btn cs-btn-primary" href={BOOK_CALL_URL} target="_blank" rel="noopener">
                {BOOK_CALL_LABEL}
              </a>
              <p className="cs-reassure">{BOOK_CALL_REASSURANCE}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── At a glance ────────────────────────────────────────────────── */}
      <section className="cs-section cs-section-light">
        <div className="cs-container cs-container-narrow">
          <Reveal>
            <h2 className="cs-h2">At a glance</h2>
            <p className="cs-lead">
              The whole engagement in one table, including how every number on this page was measured.
            </p>
            <table className="cs-glance">
              <tbody>
                {study.atAGlance.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ── The situation ──────────────────────────────────────────────── */}
      <section className="cs-section cs-section-light">
        <div className="cs-container cs-container-narrow">
          <Reveal>
            <p className="cs-kicker">Where it started</p>
            <h2 className="cs-h2">{study.situation.headline}</h2>
            {study.situation.body.map((p) => (
              <p className="cs-body" key={p.slice(0, 40)}>
                {p}
              </p>
            ))}
          </Reveal>
          <div className="cs-fail-grid">
            {study.situation.failures.map((f, i) => (
              <Reveal key={f.title} delay={Math.min(i * 0.05, 0.2)}>
                <div className="cs-fail-card">
                  <h3 className="cs-fail-title">{f.title}</h3>
                  <p className="cs-fail-desc">{f.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we did ────────────────────────────────────────────────── */}
      <section className="cs-section cs-section-light">
        <div className="cs-container cs-container-narrow">
          <Reveal>
            <p className="cs-kicker">What we did</p>
            <h2 className="cs-h2">
              Six workstreams, <span className="cs-accent-dark">one team, one invoice.</span>
            </h2>
            <p className="cs-lead">
              Each of these is a service you can buy on its own. They are listed here in the order they were
              sequenced, because the order is most of why it worked.
            </p>
          </Reveal>

          <ol className="cs-work-list">
            {study.workstreams.map((w, i) => (
              <Reveal as="li" key={w.name} delay={Math.min(i * 0.04, 0.16)}>
                <article className="cs-work">
                  <div className="cs-work-head">
                    <span className="cs-work-num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="cs-work-title">{w.name}</h3>
                      <p className="cs-work-summary">{w.summary}</p>
                    </div>
                  </div>
                  <ul className="cs-work-points">
                    {w.points.map((p) => (
                      <li key={p.slice(0, 40)}>{p}</li>
                    ))}
                  </ul>
                  {w.serviceSlug && (
                    <Link className="cs-work-link" href={`/services/${w.serviceSlug}`}>
                      How this service works
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  )}
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Month by month ─────────────────────────────────────────────── */}
      {study.months && (
      <section className="cs-section cs-section-light">
        <div className="cs-container cs-container-narrow">
          <Reveal>
            <p className="cs-kicker">The curve, month by month</p>
            <h2 className="cs-h2">Every month in the window, including the two that produced nothing.</h2>
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
          </Reveal>

          {study.funnel && (
          <Reveal>
            <h3 className="cs-h3">The rest of the funnel</h3>
            <p className="cs-body">{study.funnel.intro}</p>
            <div className="cs-table-scroll">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">{study.funnel.beforeLabel ?? 'Prior 31 days'}</th>
                    <th scope="col">{study.funnel.afterLabel ?? 'Last 30 days'}</th>
                    <th scope="col">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {study.funnel.rows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row">{r.label}</th>
                      <td className="cs-num">{r.before}</td>
                      <td className="cs-num">{r.after}</td>
                      <td className={`cs-num cs-change cs-change-${r.direction}`}>{r.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="cs-body cs-reading">
              <strong>{study.funnel.readingLabel ?? 'Reading the two that moved the wrong way.'}</strong> {study.funnel.reading}
            </p>
          </Reveal>
          )}
        </div>
      </section>
      )}

      {/* ── Supporting screens ─────────────────────────────────────────── */}
      {study.gallery && (
        <section className="cs-section cs-section-light">
          <div className="cs-container cs-container-narrow">
            <Reveal>
              <p className="cs-kicker">The rest of it</p>
              <h2 className="cs-h2">{study.gallery.heading}</h2>
              <p className="cs-lead">{study.gallery.intro}</p>
            </Reveal>
            <div className="cs-gallery">
              {study.gallery.items.map((g, i) => (
                <Reveal key={g.src} delay={Math.min(i * 0.05, 0.2)}>
                  <figure className="cs-gal">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      width={g.width}
                      height={g.height}
                      sizes="(max-width: 760px) 100vw, 420px"
                    />
                    <figcaption>{g.caption}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Proof ──────────────────────────────────────────────────────── */}
      {study.proof.length > 0 && (
      <section className="cs-section cs-section-light">
        <div className="cs-container cs-container-narrow">
          <Reveal>
            <p className="cs-kicker">The export</p>
            <h2 className="cs-h2">The screen this all came from.</h2>
          </Reveal>
          {study.proof.map((p) => (
            <Reveal key={p.src}>
              <figure className="cs-proof">
                {/* Intrinsic size of the exported PNG, so the browser reserves
                    the right box and the section does not shift as it loads.
                    `quality` is pushed up because this is an evidence
                    screenshot full of small axis labels and dates a sceptical
                    reader will zoom into, and default compression softens
                    exactly that detail. */}
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  quality={92}
                  sizes="(max-width: 860px) 100vw, 860px"
                />
                <figcaption>{p.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
      )}

      {/* ── Mid-page CTA ───────────────────────────────────────────────────
          Lives in its own section rather than inside the proof block, because
          the proof block is conditional and the CTA is not. A study with no
          export still needs an ask at this point in the scroll. */}
      <section className="cs-section cs-section-light">
        <div className="cs-container cs-container-narrow">
          <Reveal>
            <div className="cs-midcta">
              <p className="cs-midcta-text">{study.midCtaText}</p>
              <a className="cs-btn cs-btn-primary" href={BOOK_CALL_URL} target="_blank" rel="noopener">
                {BOOK_CALL_LABEL}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Still broken ───────────────────────────────────────────────── */}
      <section className="cs-section cs-section-dark">
        <div className="cs-container cs-container-narrow">
          <Reveal>
            <p className="cs-kicker cs-kicker-light">Open problems</p>
            <h2 className="cs-h2 cs-h2-light">
              What is still broken, <span className="cs-accent">{study.openProblemsAccent}</span>
            </h2>
            <p className="cs-lead cs-lead-light">
              A case study that reports only wins is an advertisement. This is the current open list on this
              account. Publishing it is the reason the rest of the page is worth believing.
            </p>
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
      <section className="cs-section cs-section-light">
        <div className="cs-container cs-container-narrow">
          <Reveal>
            <p className="cs-kicker">Scope</p>
            <h2 className="cs-h2">When this approach is the wrong one.</h2>
            <p className="cs-lead">
              Four situations where the honest answer is that this programme does not fit, and we would say so
              on the call rather than after the invoice.
            </p>
          </Reveal>
          <div className="cs-limit-grid">
            {study.notApplicable.map((l, i) => (
              <Reveal key={l.title} delay={Math.min(i * 0.05, 0.2)}>
                <div className="cs-limit">
                  <h3 className="cs-limit-title">{l.title}</h3>
                  <p className="cs-limit-detail">{l.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Close ──────────────────────────────────────────────────────── */}
      <section className="cs-section cs-close" id="book-call">
        <div className="cs-container cs-container-narrow">
          <Reveal>
            <h2 className="cs-h2 cs-h2-light">
              This is one client, and we say so <span className="cs-accent">everywhere it matters.</span>
            </h2>
            <p className="cs-lead cs-lead-light">
              We are not going to tell you this happens every time, because we have published it once. What we
              will do on a call is look at your Search Console, tell you which of the four failures above your
              site has, and give you the 30 day plan either way.
            </p>
            <div className="cs-hero-cta">
              <a className="cs-btn cs-btn-primary cs-btn-lg" href={BOOK_CALL_URL} target="_blank" rel="noopener">
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

      <style>{`
        .cs-root { background: var(--cream); color: var(--black); }
        .cs-container { max-width: 1180px; margin: 0 auto; padding: 0 32px; }
        .cs-container-narrow { max-width: 860px; }

        .cs-section { padding: 88px 0; }
        .cs-section-light { background: var(--cream); }
        .cs-section-light + .cs-section-light { padding-top: 0; }
        .cs-section-dark { background: var(--black); color: var(--cream); }

        /* Hero */
        .cs-hero { background: var(--black); color: var(--cream); padding: 40px 0 88px; }
        .cs-crumb { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; font-family: Inter, sans-serif; font-size: 13px; color: rgba(242,238,231,0.5); margin-bottom: 44px; }
        .cs-crumb a { color: rgba(242,238,231,0.72); text-decoration: none; }
        .cs-crumb a:hover { color: var(--orange); }

        .cs-eyebrow { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--orange); margin: 0 0 20px; }
        .cs-h1 { font-family: Inter, sans-serif; font-size: clamp(38px, 6vw, 68px); font-weight: 800; letter-spacing: -2.2px; line-height: 1.04; margin: 0 0 24px; max-width: 16ch; }
        .cs-accent { color: var(--orange); }
        .cs-accent-dark { color: var(--orange); }
        .cs-summary { font-size: 18px; line-height: 1.66; color: rgba(242,238,231,0.74); max-width: 62ch; margin: 0 0 40px; }

        .cs-clientbar { display: flex; flex-wrap: wrap; gap: 20px 32px; align-items: flex-end; justify-content: space-between; border-top: 1px solid rgba(242,238,231,0.14); border-bottom: 1px solid rgba(242,238,231,0.14); padding: 22px 0; margin-bottom: 26px; }
        .cs-clientbar-main { max-width: 56ch; }
        .cs-client-name { font-family: Inter, sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 6px; }
        .cs-client-tag { font-size: 14.5px; line-height: 1.6; color: rgba(242,238,231,0.6); margin: 0; }
        .cs-verify { font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; color: var(--orange); text-decoration: none; white-space: nowrap; border-bottom: 1px solid rgba(232,84,26,0.4); padding-bottom: 2px; }
        .cs-verify:hover { border-bottom-color: var(--orange); }

        .cs-services { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; padding: 0; margin: 0 0 48px; }
        .cs-services li { font-family: Inter, sans-serif; font-size: 12.5px; font-weight: 600; letter-spacing: 0.2px; color: rgba(242,238,231,0.72); border: 1px solid rgba(242,238,231,0.18); border-radius: 100px; padding: 7px 14px; }

        /* Metric strip */
        .cs-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(242,238,231,0.14); border: 1px solid rgba(242,238,231,0.14); border-radius: 18px; overflow: hidden; margin-bottom: 40px; }
        .cs-metric { background: var(--black); padding: 28px 24px; }
        .cs-metric-value { font-family: Inter, sans-serif; font-size: clamp(24px, 2.6vw, 34px); font-weight: 800; letter-spacing: -1.2px; color: var(--orange); margin: 0 0 10px; line-height: 1.05; }
        .cs-metric-label { font-size: 13.5px; line-height: 1.5; color: rgba(242,238,231,0.82); margin: 0; }
        .cs-metric-note { font-size: 12px; line-height: 1.5; color: rgba(242,238,231,0.45); margin: 8px 0 0; }

        .cs-chartblock { border: 1px solid rgba(242,238,231,0.14); border-radius: 18px; padding: 24px 20px 20px; background: rgba(242,238,231,0.02); }
        .cs-chart-caption { font-size: 13px; line-height: 1.65; color: rgba(242,238,231,0.5); margin: 18px 0 0; max-width: 78ch; }

        .cs-hero-cta { margin-top: 40px; }
        .cs-btn { display: inline-block; font-family: Inter, sans-serif; font-size: 15px; font-weight: 700; letter-spacing: -0.2px; border-radius: 100px; padding: 16px 30px; text-decoration: none; transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease; }
        .cs-btn-lg { font-size: 16.5px; padding: 18px 36px; }
        .cs-btn-primary { background: var(--orange); color: #fff; }
        .cs-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(232,84,26,0.34); }
        .cs-reassure { font-size: 13.5px; color: rgba(242,238,231,0.55); margin: 14px 0 0; }
        .cs-section-light .cs-reassure { color: var(--grey); }

        /* Shared type */
        .cs-kicker { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--orange); margin: 0 0 16px; }
        .cs-kicker-light { color: var(--orange); }
        .cs-h2 { font-family: Inter, sans-serif; font-size: clamp(27px, 3.6vw, 40px); font-weight: 800; letter-spacing: -1.4px; line-height: 1.14; margin: 0 0 20px; max-width: 24ch; }
        .cs-h2-light { color: var(--cream); }
        .cs-h3 { font-family: Inter, sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.7px; margin: 56px 0 14px; }
        .cs-lead { font-size: 17px; line-height: 1.68; color: var(--grey); max-width: 62ch; margin: 0 0 32px; }
        .cs-lead-light { color: rgba(242,238,231,0.7); }
        .cs-body { font-size: 16.5px; line-height: 1.75; color: var(--grey); max-width: 66ch; margin: 0 0 20px; }
        .cs-reading { border-left: 2px solid var(--orange); padding-left: 20px; margin-top: 28px; }

        /* At a glance */
        .cs-glance { width: 100%; border-collapse: collapse; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .cs-glance th, .cs-glance td { text-align: left; padding: 15px 20px; font-size: 14.5px; line-height: 1.6; border-bottom: 1px solid var(--border); vertical-align: top; }
        .cs-glance tr:last-child th, .cs-glance tr:last-child td { border-bottom: none; }
        .cs-glance th { font-family: Inter, sans-serif; font-weight: 700; color: var(--black); width: 32%; background: rgba(12,12,11,0.025); }
        .cs-glance td { color: var(--grey); }

        /* Failure cards */
        .cs-fail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 36px; }
        .cs-fail-card { border: 1px solid var(--border); border-radius: 18px; background: rgba(255,255,255,0.5); padding: 26px 24px; height: 100%; }
        .cs-fail-title { font-family: Inter, sans-serif; font-size: 16.5px; font-weight: 800; letter-spacing: -0.4px; margin: 0 0 10px; }
        .cs-fail-desc { font-size: 14px; line-height: 1.65; color: var(--grey); margin: 0; }

        /* Workstreams */
        .cs-work-list { list-style: none; padding: 0; margin: 40px 0 0; display: grid; gap: 18px; }
        .cs-work { border: 1px solid var(--border); border-radius: 20px; background: rgba(255,255,255,0.55); padding: 30px 28px; }
        .cs-work-head { display: grid; grid-template-columns: 52px 1fr; gap: 16px; align-items: start; }
        .cs-work-num { font-family: ui-monospace, monospace; font-size: 13px; font-weight: 700; color: var(--orange); border: 1px solid rgba(232,84,26,0.3); border-radius: 8px; padding: 6px 0; text-align: center; }
        .cs-work-title { font-family: Inter, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.7px; margin: 0 0 10px; }
        .cs-work-summary { font-size: 15.5px; line-height: 1.68; color: var(--grey); margin: 0; }
        .cs-work-points { margin: 22px 0 0; padding: 0 0 0 0; list-style: none; display: grid; gap: 12px; }
        .cs-work-points li { position: relative; padding-left: 22px; font-size: 14.5px; line-height: 1.7; color: var(--grey); }
        .cs-work-points li::before { content: ""; position: absolute; left: 4px; top: 10px; width: 6px; height: 6px; border-radius: 50%; background: var(--orange); opacity: 0.55; }
        .cs-work-link { display: inline-block; margin-top: 20px; font-family: Inter, sans-serif; font-size: 13.5px; font-weight: 700; color: var(--black); text-decoration: none; border-bottom: 1px solid var(--border); padding-bottom: 2px; }
        .cs-work-link:hover { color: var(--orange); border-bottom-color: var(--orange); }

        /* Tables */
        .cs-table-scroll { overflow-x: auto; margin-top: 24px; }
        .cs-table { width: 100%; min-width: 560px; border-collapse: collapse; border: 1px solid var(--border); }
        .cs-table thead th { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase; color: var(--grey); text-align: left; padding: 13px 18px; background: rgba(12,12,11,0.035); border-bottom: 1px solid var(--border); }
        .cs-table tbody th, .cs-table tbody td { padding: 14px 18px; font-size: 14.5px; line-height: 1.55; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }
        .cs-table tbody tr:last-child th, .cs-table tbody tr:last-child td { border-bottom: none; }
        .cs-table tbody th { font-family: Inter, sans-serif; font-weight: 700; color: var(--black); white-space: nowrap; }
        .cs-table tbody td { color: var(--grey); }
        .cs-num { font-family: ui-monospace, monospace; font-variant-numeric: tabular-nums; }
        .cs-note { font-size: 13.5px; }
        .cs-change { font-weight: 700; }
        .cs-change-up { color: #1B7F4C; }
        /* The two rows that went the wrong way are coloured as such rather than
           rendered neutral. Hiding the direction is the tell this page exists
           to avoid. */
        .cs-change-down { color: #B4451F; }

        /* Proof */
        .cs-proof { margin: 32px 0 0; }
        .cs-proof img { width: 100%; height: auto; display: block; border: 1px solid var(--border); border-radius: 16px; background: #fff; }
        .cs-proof figcaption { font-size: 13px; line-height: 1.65; color: var(--grey); margin-top: 14px; max-width: 74ch; }

        /* Supporting screens */
        .cs-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 36px; align-items: start; }
        .cs-gal { margin: 0; }
        /* Capped height with a top-anchored crop. These are full-page captures
           of wildly different lengths, and letting them run full height would
           make one card six times taller than its neighbour. The top of a page
           is the part that carries the argument anyway. */
        .cs-gal img { width: 100%; height: 260px; object-fit: cover; object-position: top center; display: block; border: 1px solid var(--border); border-radius: 14px; background: #fff; }
        .cs-gal figcaption { font-size: 12.5px; line-height: 1.55; color: var(--grey); margin-top: 10px; }

        .cs-midcta { margin-top: 0; border: 1px solid var(--border); border-radius: 20px; background: rgba(255,255,255,0.6); padding: 32px 30px; display: flex; flex-wrap: wrap; gap: 22px; align-items: center; justify-content: space-between; }
        .cs-midcta-text { font-size: 16px; line-height: 1.66; color: var(--black); margin: 0; max-width: 46ch; }

        /* Open problems */
        .cs-problems { list-style: none; padding: 0; margin: 40px 0 0; display: grid; gap: 14px; counter-reset: prob; }
        .cs-problem { border: 1px solid rgba(242,238,231,0.14); border-radius: 18px; background: rgba(242,238,231,0.035); padding: 26px 26px; }
        .cs-problem-head { display: flex; flex-wrap: wrap; gap: 12px; align-items: baseline; justify-content: space-between; margin-bottom: 12px; }
        .cs-problem-title { font-family: Inter, sans-serif; font-size: 17.5px; font-weight: 800; letter-spacing: -0.5px; margin: 0; color: var(--cream); }
        .cs-status { font-family: Inter, sans-serif; font-size: 11.5px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--orange); border: 1px solid rgba(232,84,26,0.36); border-radius: 100px; padding: 5px 12px; white-space: nowrap; }
        .cs-problem-detail { font-size: 14.5px; line-height: 1.72; color: rgba(242,238,231,0.68); margin: 0; }

        /* Limits */
        .cs-limit-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 36px; }
        .cs-limit { border: 1px dashed rgba(12,12,11,0.18); border-radius: 18px; padding: 26px 24px; height: 100%; }
        .cs-limit-title { font-family: Inter, sans-serif; font-size: 16.5px; font-weight: 800; letter-spacing: -0.4px; margin: 0 0 10px; }
        .cs-limit-detail { font-size: 14px; line-height: 1.68; color: var(--grey); margin: 0; }

        /* Close */
        .cs-close { background: var(--black); color: var(--cream); }
        .cs-closelinks { display: flex; flex-wrap: wrap; gap: 26px; margin-top: 44px; padding-top: 28px; border-top: 1px solid rgba(242,238,231,0.14); }
        .cs-closelinks a { font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; color: rgba(242,238,231,0.8); text-decoration: none; }
        .cs-closelinks a:hover { color: var(--orange); }

        /* Responsive */
        @media (max-width: 1000px) {
          .cs-metrics { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 760px) {
          .cs-container { padding: 0 20px; }
          .cs-section { padding: 64px 0; }
          .cs-hero { padding: 28px 0 64px; }
          .cs-crumb { margin-bottom: 30px; }
          .cs-h1 { letter-spacing: -1.4px; max-width: none; }
          .cs-summary { font-size: 16.5px; }
          .cs-metrics { grid-template-columns: 1fr; }
          .cs-metric { padding: 22px 20px; }
          .cs-chartblock { padding: 16px 12px 14px; }
          .cs-fail-grid, .cs-limit-grid { grid-template-columns: 1fr; }
          .cs-gallery { grid-template-columns: 1fr 1fr; gap: 12px; }
          .cs-gal img { height: 180px; }
          .cs-work { padding: 26px 22px; }
          .cs-work-head { grid-template-columns: 44px 1fr; gap: 12px; }
          .cs-glance th, .cs-glance td { display: block; width: auto; }
          .cs-glance th { border-bottom: none; padding-bottom: 4px; }
          .cs-glance td { padding-top: 0; }
          .cs-midcta { padding: 26px 22px; }
          .cs-problem { padding: 22px 20px; }
        }
      `}</style>
    </main>
  );
}
