import Image from 'next/image';
import Link from 'next/link';
import type { CaseStudy, CaseStudyApp, CaseStudyAppScreen } from '@/lib/caseStudyData';
import { Rise } from './motion';
import { PhoneFrame } from './Frames';

/**
 * The sections of a customer mobile app case study, rendered by CaseStudyPage
 * only when `study.app` is set. A server component: only the reveal wrappers
 * hydrate. Every line comes from the study data, which cites the store
 * listing, the client's site and the linked operating system study by source
 * id; the ids render as small numbered links to the Sources list.
 */

const pad = (n: number) => String(n).padStart(2, '0');

function Head({
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

function PlayIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M5 3.6v16.8c0 .5.5.8.9.6l14.4-8.4a.7.7 0 0 0 0-1.2L5.9 3c-.4-.2-.9.1-.9.6z" fill="currentColor" />
    </svg>
  );
}

/** The store link, used in the hero and in the listing card. */
export function StoreLink({ app, tone = 'dark' }: { app: CaseStudyApp; tone?: 'dark' | 'light' }) {
  return (
    <a
      className={`wba-store wba-store-${tone}`}
      href={app.storeUrl}
      target="_blank"
      rel="noopener"
      data-track="case_study_store_click"
      data-track-location="case_study_app"
    >
      <PlayIcon />
      <span>{app.storeLabel}</span>
    </a>
  );
}

/** Hero stage: three listing screenshots in overlapping phone frames. */
export function AppHero({ study }: { study: CaseStudy }) {
  const app = study.app;
  if (!app) return null;
  const [left, centre, right] = app.heroScreens;
  return (
    <div className="cs-hero-stage wba-hero">
      <div className="wba-hero-phones">
        {left && (
          <div className="wba-hero-phone wba-hero-left">
            <PhoneFrame className="wba-phone">
              <Image src={left.src} alt={left.alt} width={left.width} height={left.height} sizes="(max-width: 760px) 34vw, 200px" loading="eager" />
            </PhoneFrame>
          </div>
        )}
        {right && (
          <div className="wba-hero-phone wba-hero-right">
            <PhoneFrame className="wba-phone">
              <Image src={right.src} alt={right.alt} width={right.width} height={right.height} sizes="(max-width: 760px) 34vw, 200px" loading="eager" />
            </PhoneFrame>
          </div>
        )}
        {centre && (
          <div className="wba-hero-phone wba-hero-centre">
            <PhoneFrame className="wba-phone">
              <Image
                src={centre.src}
                alt={centre.alt}
                width={centre.width}
                height={centre.height}
                sizes="(max-width: 760px) 44vw, 250px"
                loading="eager"
                fetchPriority="high"
              />
            </PhoneFrame>
          </div>
        )}
      </div>
      <p className="cs-hero-cap wba-hero-cap">{app.heroCaption}</p>
    </div>
  );
}

/** Numbered links to the Sources list for one line. */
function Refs({ ids, index }: { ids: string[]; index: Map<string, number> }) {
  const known = ids.filter((id) => index.has(id));
  if (!known.length) return null;
  return (
    <span className="wba-refs">
      {known.map((id) => (
        <a key={id} href={`#wba-src-${id}`} className="wba-ref" aria-label={`Source ${index.get(id)}`}>
          {index.get(id)}
        </a>
      ))}
    </span>
  );
}

function ScreenRow({ s, i, index }: { s: CaseStudyAppScreen; i: number; index: Map<string, number> }) {
  return (
    <Rise as="li" className={`wba-screen${i % 2 ? ' is-flip' : ''}`}>
      <figure className="wba-screen-fig">
        <a href={s.src} target="_blank" rel="noopener" className="wba-screen-link" aria-label={`${s.title}: open the full-size screenshot`}>
          <PhoneFrame className="wba-phone">
            <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 760px) 62vw, 250px" />
          </PhoneFrame>
        </a>
      </figure>
      <div className="wba-screen-text">
        <p className="wba-screen-num">{pad(i + 4)}</p>
        <h3 className="wba-screen-title">{s.title}</h3>
        <dl className="wba-screen-dl">
          <div>
            <dt>In the app</dt>
            <dd>{s.customer}</dd>
          </div>
          <div className="is-behind">
            <dt>Behind the scenes</dt>
            <dd>
              {s.behind}
              <Refs ids={s.sources} index={index} />
            </dd>
          </div>
        </dl>
      </div>
    </Rise>
  );
}

/** "Part of one system": the card that links the two halves of one system. */
export function PartOfSystem({ study }: { study: CaseStudy }) {
  const po = study.partOf;
  if (!po) return null;
  return (
    <section className="wba-part-section" aria-labelledby="wba-part-h">
      <div className="cs-container">
        <Rise className="wba-part">
          <div className="wba-part-copy">
            <p className="wba-part-k">Part of one system</p>
            <h2 className="wba-part-h" id="wba-part-h">
              {po.heading}
            </h2>
            <p className="wba-part-body">{po.body}</p>
            <Link className="wba-part-link" href={po.href}>
              {po.linkLabel}
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
          <div className="wba-part-pair" aria-hidden="true">
            <div className="wba-part-node is-here">
              <span className="wba-part-tag">This page</span>
              <strong>{po.here.name}</strong>
              <span>{po.here.detail}</span>
            </div>
            <div className="wba-part-wire">
              <i />
              <span>orders, prices, offers</span>
            </div>
            <div className="wba-part-node">
              <span className="wba-part-tag">Case study</span>
              <strong>{po.there.name}</strong>
              <span>{po.there.detail}</span>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}

export default function AppStory({ study }: { study: CaseStudy }) {
  const app = study.app;
  if (!app) return null;
  const index = new Map(app.sources.map((s, i) => [s.id, i + 1]));
  const f = app.flow;
  const l = app.listing;
  const b = app.build;
  const fit = app.buyerFit;
  const wk = app.working;
  const osHref = study.partOf?.href;

  return (
    <>
      {/* ── How the app links the business together ─────────────────── */}
      <section className="cs-section cs-tone-ink" id="system">
        <div className="cs-container">
          <Head kicker="The link" question="How does the app link the business together?" claim={f.heading} light>
            <p className="cs-lead cs-lead-light">{f.intro}</p>
          </Head>

          <Rise className="wba-flow">
            <div className="wba-flow-hq">
              <p className="wba-flow-panel">HQ panel</p>
              <h3 className="wba-flow-hq-title">{f.hq.title}</h3>
              <p className="wba-flow-hq-detail">
                {f.hq.detail}
                <Refs ids={f.hq.sources} index={index} />
              </p>
              <span className="wba-flow-back" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M19 12H6m5-5l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to the customer
              </span>
            </div>
            <ol className="wba-flow-steps" aria-label="An app order, step by step">
              {f.steps.map((st, i) => (
                <li key={st.title} className={`wba-flow-step${i === 0 ? ' is-app' : ''}`} style={{ ['--i' as string]: i }}>
                  <span className="wba-flow-dot" aria-hidden="true">
                    {i + 1}
                  </span>
                  <p className="wba-flow-where">{st.where}</p>
                  <h3 className="wba-flow-title">{st.title}</h3>
                  <p className="wba-flow-detail">
                    {st.detail}
                    <Refs ids={st.sources} index={index} />
                  </p>
                </li>
              ))}
            </ol>
            <div className="wba-flow-cat">
              <h3 className="wba-flow-cat-title">{f.catalogue.title}</h3>
              <p className="wba-flow-cat-detail">
                {f.catalogue.detail}
                <Refs ids={f.catalogue.sources} index={index} />
              </p>
              <ul className="wba-flow-cat-chips" aria-label="Who reads the catalogue">
                <li>Customer app</li>
                <li>Counter</li>
                <li>Brighty</li>
                <li>HQ edits</li>
              </ul>
            </div>
          </Rise>
          {osHref && (
            <p className="wba-flow-more">
              <Link href={osHref}>
                See the store panel, the HQ panel and Brighty in the operating system case study
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* ── Screen by screen ─────────────────────────────────────────── */}
      <section className="cs-section cs-tone-paper" id="tour">
        <div className="cs-container">
          <Head kicker="The app" question="What does the customer see, screen by screen?" claim="Eight screens from the Google Play listing, and what each one sets moving in the shop.">
            <p className="cs-lead">{app.tour.intro}</p>
          </Head>

          <div className="wba-first">
            <Rise>
              <h3 className="cs-h3">First open</h3>
            </Rise>
            <ol className="wba-first-list">
              {app.tour.intro3.map((s, i) => (
                <Rise as="li" key={s.src} className="wba-first-item" delay={Math.min(i * 0.07, 0.21)}>
                  <a href={s.src} target="_blank" rel="noopener" className="wba-screen-link" aria-label={`${s.title}: open the full-size screenshot`}>
                    <PhoneFrame className="wba-phone">
                      <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 760px) 30vw, 200px" />
                    </PhoneFrame>
                  </a>
                  <p className="wba-screen-num">{pad(i + 1)}</p>
                  <h4 className="wba-first-title">{s.title}</h4>
                  <p className="wba-first-detail">{s.customer}</p>
                  <p className="wba-first-behind">
                    <span>Behind it:</span> {s.behind}
                    <Refs ids={s.sources} index={index} />
                  </p>
                </Rise>
              ))}
            </ol>
          </div>

          <ol className="wba-screens">
            {app.tour.screens.map((s, i) => (
              <ScreenRow key={s.src} s={s} i={i} index={index} />
            ))}
          </ol>
        </div>
      </section>

      {/* ── The Google Play listing ──────────────────────────────────── */}
      <section className="cs-section" id="listing">
        <div className="cs-container">
          <Head kicker="On Google Play" question={l.heading} claim={l.intro} />
          <Rise className="wba-listing">
            <div className="wba-listing-top">
              <Image src={app.icon.src} alt={app.icon.alt} width={app.icon.width} height={app.icon.height} sizes="72px" className="wba-listing-icon" />
              <div className="wba-listing-id">
                <h3 className="wba-listing-name">{l.name}</h3>
                <p className="wba-listing-dev">{l.developer}</p>
              </div>
              <StoreLink app={app} tone="light" />
            </div>
            <dl className="wba-listing-facts">
              {l.facts.map((fx) => (
                <div key={fx.label}>
                  <dt>{fx.label}</dt>
                  <dd>{fx.value}</dd>
                </div>
              ))}
            </dl>
            <div className="wba-listing-cols">
              <div>
                <h4 className="wba-listing-h">What the listing says it does</h4>
                <ul className="wba-listing-list">
                  {l.features.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="wba-listing-h">Data safety, as declared</h4>
                <ul className="wba-listing-list is-safety">
                  {l.dataSafety.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <h4 className="wba-listing-h">What&apos;s new in 1.3.1</h4>
                <p className="wba-listing-new">{l.whatsNew}</p>
              </div>
            </div>
            <p className="wba-listing-note">
              Read on {l.read}. {l.note}
            </p>
          </Rise>
        </div>
      </section>

      {/* ── What it does for the customer and the business ───────────── */}
      <section className="cs-section cs-tone-ink" id="benefits">
        <div className="cs-container">
          <Head kicker="What it changes" question="What does the app do for the customer, and for the business?" claim="Two sides of the same order." light />
          <div className="wba-gains">
            {(
              [
                ['For the customer', app.gains.customer],
                ['For the business', app.gains.business],
              ] as const
            ).map(([name, items], ci) => (
              <Rise key={name} className={`wba-gains-col${ci ? ' is-biz' : ''}`} delay={ci * 0.08}>
                <h3 className="wba-gains-h">{name}</h3>
                <ol className="wba-gains-list">
                  {items.map((g, i) => (
                    <li key={g.title}>
                      <span className="wba-gains-num">{pad(i + 1)}</span>
                      <div>
                        <h4 className="wba-gains-title">{g.title}</h4>
                        <p className="wba-gains-detail">
                          {g.detail}
                          <Refs ids={g.sources} index={index} />
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* ── How EchoPulse built it ───────────────────────────────────── */}
      <section className="cs-section" id="build">
        <div className="cs-container cs-anchor" id="work">
          <Head kicker="How we built it" question={`How did EchoPulse build the ${study.shortName}?`} claim={b.heading}>
            <p className="cs-lead">{b.intro}</p>
          </Head>
          <ol className="wb-steps wba-steps">
            {b.steps.map((st, i) => (
              <Rise as="li" key={st.title} className="wb-step" delay={Math.min(i * 0.03, 0.12)}>
                <span className="wb-step-num" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <div className="wb-step-body">
                  <h3 className="wb-step-title">{st.title}</h3>
                  <p className="wb-step-detail">{st.detail}</p>
                </div>
              </Rise>
            ))}
          </ol>
          <div className="cs-sub cs-anchor" id="stack">
            <Rise>
              <h3 className="cs-h3">What it runs on, as far as is published</h3>
            </Rise>
            <Rise className="wb-stack-group wba-stack">
              <dl className="wb-stack-list">
                {b.facts.map((it) => (
                  <div key={it.name}>
                    <dt>{it.name}</dt>
                    <dd>{it.detail}</dd>
                  </div>
                ))}
              </dl>
            </Rise>
            <p className="wba-note">{b.note}</p>
          </div>
        </div>
      </section>

      {/* ── Could an app like this work for your business? ───────────── */}
      <section className="cs-section cs-tone-paper" id="your-business">
        <div className="cs-container">
          <Head kicker="Your business" question="Could an app like this work for your business?" claim={fit.heading}>
            <p className="cs-lead">{fit.intro}</p>
          </Head>
          <div className="wb-fit">
            <ul className="wb-fit-biz">
              {fit.businesses.map((bz, i) => (
                <Rise as="li" key={bz.title} className="wb-fit-card" delay={Math.min(i * 0.04, 0.2)}>
                  <h3 className="wb-fit-title">{bz.title}</h3>
                  <p className="wb-fit-detail">{bz.detail}</p>
                </Rise>
              ))}
            </ul>
            <Rise className="wb-signs">
              <h3 className="wb-signs-title">Signs you need it</h3>
              <ul>
                {fit.signs.map((sg) => (
                  <li key={sg.slice(0, 40)}>{sg}</li>
                ))}
              </ul>
            </Rise>
          </div>
          <Rise>
            <p className="wba-note wba-fit-note">{fit.note}</p>
          </Rise>
        </div>
      </section>

      {/* ── What working with EchoPulse is like ──────────────────────── */}
      <section className="cs-section" id="working">
        <div className="cs-container">
          <Head kicker="Working with us" question="What is working with EchoPulse like?" claim={wk.heading}>
            <p className="cs-lead">{wk.intro}</p>
          </Head>
          <ol className="wb-work">
            {wk.steps.map((st, i) => (
              <Rise as="li" key={st.title} className="wb-work-step" delay={Math.min(i * 0.05, 0.2)}>
                <span className="wb-work-num">{pad(i + 1)}</span>
                <h3 className="wb-work-title">{st.title}</h3>
                <p className="wb-work-detail">{st.detail}</p>
              </Rise>
            ))}
          </ol>
          <div className="cs-sub">
            <Rise>
              <h3 className="cs-h3">Why it is a safe bet</h3>
            </Rise>
            <ul className="wb-gets wb-risks">
              {wk.risks.map((r, i) => (
                <Rise as="li" key={r.title} className="wb-get" delay={Math.min(i * 0.05, 0.2)}>
                  <h4 className="wb-get-title">{r.title}</h4>
                  <p className="wb-get-detail">{r.detail}</p>
                </Rise>
              ))}
            </ul>
            <p className="cs-factlinks">
              <Link href={wk.source.href}>
                {wk.source.label}
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ and sources ──────────────────────────────────────────── */}
      <section className="cs-section cs-tone-paper" id="faq">
        <div className="cs-container">
          <Head kicker="FAQ" question={`Questions about the ${study.shortName}`} />
          <dl className="wb-faq">
            {app.faq.map((q) => (
              <Rise key={q.q} className="wb-faq-item">
                <dt>{q.q}</dt>
                <dd>{q.a}</dd>
              </Rise>
            ))}
          </dl>
          <Rise className="wb-sources" id="sources">
            <h3 className="wb-sources-title">Sources</h3>
            <ol className="wb-sources-list">
              {app.sources.map((src) => (
                <li key={src.id} id={`wba-src-${src.id}`}>
                  {src.href.startsWith('/') ? (
                    <Link href={src.href}>{src.label}</Link>
                  ) : (
                    <a href={src.href} target="_blank" rel="noopener">
                      {src.label}
                    </a>
                  )}
                  <span className="wb-sources-read">, read {src.read}</span>
                </li>
              ))}
            </ol>
            <p className="wb-sources-note">{app.sourcesNote}</p>
          </Rise>
        </div>
      </section>
    </>
  );
}
