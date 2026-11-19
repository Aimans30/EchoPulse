import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import type { CaseStudy, CaseStudyCreative, CaseStudyProduct, CaseStudyScreen } from '@/lib/caseStudyData';
import { Rise } from './motion';
import { BrowserFrame, PhoneFrame, Shot } from './Frames';
import Parallax from './Parallax';
import WorkTimeline from './WorkTimeline';

/**
 * The sections of a software-build case study: the product itself, shown
 * screen by screen. A server component like the page around it; only the
 * reveal wrappers and the parallax hydrate.
 *
 * Rendered by CaseStudyPage only when `study.product` is set, between the key
 * facts and the method, in place of the generic situation and work sections.
 * Every claim here comes from the study data, which in turn cites the
 * delivered product and the client's live site.
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

/** Hero stage: the main product screen in a browser frame, a phone over it. */
export function ProductHero({ study }: { study: CaseStudy }) {
  const p = study.product;
  const shot = study.heroShot;
  if (!p || !shot) return null;
  return (
    <div className="cs-hero-stage wb-hero-stage">
      <Parallax className="wb-hero-shot" range={2}>
        <BrowserFrame url={shot.url} tone="dark">
          <Shot media={shot} sizes="(max-width: 1000px) 92vw, 600px" priority />
        </BrowserFrame>
      </Parallax>
      <div className="wb-hero-phone">
        <PhoneFrame>
          <Image src={p.heroPhone.src} alt={p.heroPhone.alt} width={p.heroPhone.width} height={p.heroPhone.height} sizes="(max-width: 760px) 32vw, 170px" loading="eager" />
        </PhoneFrame>
      </div>
      <p className="cs-hero-cap wb-hero-cap">{shot.caption} Phone: the store dashboard.</p>
    </div>
  );
}

function ScreenCard({ s, panel, sizes }: { s: CaseStudyScreen; panel: string; sizes: string }) {
  return (
    <figure className="wb-screen">
      <a href={s.src} target="_blank" rel="noopener" className="wb-screen-link" aria-label={`${s.title}: open the full-size screenshot`}>
        <BrowserFrame url={`${panel} · ${s.title}`}>
          <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes={sizes} className="cs-shot" />
        </BrowserFrame>
      </a>
      <figcaption>
        <h4 className="wb-screen-title">{s.title}</h4>
        <ul className="wb-screen-points">
          {s.points.map((pt) => (
            <li key={pt.slice(0, 40)}>{pt}</li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

function OutletMap({ o }: { o: CaseStudyProduct['outlets'] }) {
  return (
    <div className="wb-map-grid">
      <Rise as="figure" className="wb-map">
        <div className="wb-map-stage">
          <div className="wb-map-canvas">
          <Image src={o.map.src} alt={o.map.alt} width={o.map.width} height={o.map.height} sizes="(max-width: 1000px) 100vw, 760px" className="wb-map-img" />
          {o.reference && (
            <span className="wb-ref" style={{ left: `${o.reference.x}%`, top: `${o.reference.y}%` }} aria-hidden="true">
              <i />
              <em>{o.reference.name}</em>
            </span>
          )}
          {o.items.map((it, i) => (
            <span
              key={it.name}
              className={`wb-pin wb-pin-${it.labelSide ?? 'right'}`}
              style={{ left: `${it.x}%`, top: `${it.y}%`, animationDelay: `${0.25 + i * 0.15}s` }}
              aria-hidden="true"
            >
              <span className="wb-pin-dot">{i + 1}</span>
              <span className="wb-pin-label">{it.name}</span>
            </span>
          ))}
          </div>
          <p className="cs-sr">
            Map of Patna with {o.items.length} pins: {o.items.map((it, i) => `${i + 1}, ${it.name}`).join('; ')}.
          </p>
        </div>
        <figcaption className="wb-map-cap">
          {o.note}{' '}
          <a href={o.attribution.href} target="_blank" rel="noopener">
            {o.attribution.label}
          </a>
          .
        </figcaption>
      </Rise>
      <ol className="wb-outlets">
        {o.items.map((it, i) => (
          <Rise as="li" key={it.name} className="wb-outlet" delay={Math.min(i * 0.06, 0.18)}>
            <span className="wb-outlet-num" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h3 className="wb-outlet-name">{it.name}</h3>
              <p className="wb-outlet-addr">{it.address}</p>
              <p className="wb-outlet-meta">
                {it.hours}
                {it.approximate ? ' · Pin approximate' : ''}
              </p>
              <a className="wb-outlet-link" href={it.mapsUrl} target="_blank" rel="noopener">
                Open in Google Maps <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </Rise>
        ))}
      </ol>
    </div>
  );
}

/** A public post as a captured still inside a phone, styled like the feed. */
function CreativeCard({ c, handle }: { c: CaseStudyCreative; handle: string }) {
  const shape = c.height > c.width * 1.2 ? 'tall' : c.width > c.height * 1.2 ? 'wide' : 'square';
  return (
    <figure className="wb-cr">
      <a className="wb-cr-link" href={c.href} target="_blank" rel="noopener" aria-label={`${c.title}: open the ${c.platform.toLowerCase()} on Instagram`}>
        <PhoneFrame className="wb-cr-phone">
          <div className={`wb-ig wb-ig-${shape}`}>
            <p className="wb-ig-top" aria-hidden="true">
              <i />
              <span>{handle}</span>
            </p>
            <div className="wb-ig-media">
              <Image src={c.src} alt={c.alt} width={c.width} height={c.height} sizes="(max-width: 760px) 60vw, 240px" />
              {c.kind === 'reel' && (
                <span className="wb-ig-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                  </svg>
                </span>
              )}
            </div>
            {c.hook && (
              <p className="wb-ig-cap" lang={c.hookLang}>
                {c.hook}
              </p>
            )}
          </div>
        </PhoneFrame>
      </a>
      <figcaption>
        <p className="wb-cr-meta">
          {c.platform} · {c.posted}
        </p>
        <h4 className="wb-cr-title">{c.title}</h4>
        <p className="wb-cr-detail">{c.detail}</p>
        <a className="wb-cr-open" href={c.href} target="_blank" rel="noopener">
          Open on Instagram <span aria-hidden="true">&rarr;</span>
        </a>
      </figcaption>
    </figure>
  );
}

export default function ProductStory({ study }: { study: CaseStudy }) {
  const p = study.product;
  if (!p) return null;
  const a = p.assistant;
  const w = p.website;
  const who = study.shortName;
  const m = p.marketing;
  const b = p.build;
  const fit = p.buyerFit;
  const wk = p.working;

  return (
    <>
      {/* ── The client and the challenge ─────────────────────────────── */}
      <section className="cs-section cs-tone-paper" id="situation">
        <div className="cs-container">
          <Head kicker="The client and the challenge" question={`What was wrong at ${who} before the work started?`} claim={study.situation.headline} />
          <ol className="wb-challenge">
            {p.challenge.map((c, i) => (
              <Rise as="li" key={c.title} className={`wb-challenge-card${i === 1 ? ' is-pain' : ''}`} delay={Math.min(i * 0.07, 0.21)}>
                <span className="wb-challenge-num">{pad(i + 1)}</span>
                <h3 className="wb-challenge-title">{c.title}</h3>
                <p className="wb-challenge-body">{c.body}</p>
              </Rise>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Outlets on a map ─────────────────────────────────────────── */}
      <section className="cs-section cs-tone-ink" id="outlets">
        <div className="cs-container">
          <Head kicker="Outlets" question={p.outlets.heading} light>
            <p className="cs-lead cs-lead-light">{p.outlets.intro}</p>
          </Head>
          <OutletMap o={p.outlets} />
        </div>
      </section>

      {/* ── How the product fits together ────────────────────────────── */}
      <section className="cs-section" id="system">
        <div className="cs-container">
          <Head kicker="The system" question="How does the product fit together?" claim={p.system.intro} />
          <Rise className="wb-sys">
            <div className="wb-sys-top">
              <span className="wb-sys-icon" aria-hidden="true">
                <Sparkles size={20} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="wb-sys-top-name">{p.system.assistant.name}</h3>
                <p className="wb-sys-top-body">{p.system.assistant.body}</p>
              </div>
              <span className="wb-sys-key" aria-hidden="true">
                Ctrl + J
              </span>
            </div>
            <div className="wb-sys-wires" aria-hidden="true">
              {p.system.columns.map((c) => (
                <i key={c.name} />
              ))}
            </div>
            <ul className="wb-sys-cols">
              {p.system.columns.map((c) => (
                <li key={c.name} className={`wb-sys-col wb-sys-${c.panel}`}>
                  <p className="wb-sys-panel">{c.panel === 'hq' ? 'HQ panel' : 'Store panel'}</p>
                  <h3 className="wb-sys-name">{c.name}</h3>
                  <ul className="wb-sys-items">
                    {c.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <div className="wb-sys-brackets" aria-hidden="true">
              <span className="wb-sys-bracket wb-sys-bracket-store">Store panel, one per outlet</span>
              <span className="wb-sys-bracket wb-sys-bracket-hq">HQ panel, every outlet live</span>
            </div>
          </Rise>
        </div>
      </section>

      {/* ── Screenshot tour ──────────────────────────────────────────── */}
      <section className="cs-section cs-tone-paper" id="tour">
        <div className="cs-container">
          <Head kicker="The store panel" question="What does each outlet work in all day?" claim="Every job in the shop, from the first bill to the last delivery, on one screen each.">
            <p className="cs-lead">{p.tour.intro}</p>
          </Head>
          <div className="wb-tour">
            {p.tour.groups.map((g, gi) => (
              <div className="wb-tour-group" key={g.name}>
                <Rise className="wb-tour-head">
                  <span className="wb-tour-num">{pad(gi + 1)}</span>
                  <h3 className="wb-tour-name">{g.name}</h3>
                  <p className="wb-tour-sum">{g.summary}</p>
                </Rise>
                <ul className={`wb-rail wb-tour-grid${g.screens.length === 1 ? ' is-single' : ''}`}>
                  {g.screens.map((s, i) => (
                    <Rise as="li" key={s.src} delay={Math.min(i * 0.06, 0.18)}>
                      <ScreenCard s={s} panel="Store panel" sizes="(max-width: 760px) 84vw, (max-width: 1000px) 46vw, 540px" />
                    </Rise>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="wb-swipe-hint" aria-hidden="true">
            Swipe each row for more screens.
          </p>
        </div>
      </section>

      {/* ── Brighty ──────────────────────────────────────────────────── */}
      <section className="cs-section cs-tone-ink" id="assistant">
        <div className="cs-container">
          <Head kicker={a.name} question={`What does ${a.name} do for counter staff?`} claim="Staff ask Brighty, not the owner." light>
            <p className="cs-lead cs-lead-light">{a.intro}</p>
          </Head>

          <ul className="wb-rail wb-queries">
            {a.queries.map((qy, i) => (
              <Rise as="li" key={qy.q} className="wb-query" delay={Math.min(i * 0.08, 0.24)}>
                <p className="wb-query-bubble">
                  <span className="cs-sr">Staff typed: </span>
                  {qy.q}
                </p>
                <div className="wb-query-phone">
                  <PhoneFrame>
                    <Image src={qy.shot.src} alt={qy.shot.alt} width={qy.shot.width} height={qy.shot.height} sizes="(max-width: 760px) 62vw, 260px" />
                  </PhoneFrame>
                </div>
                <p className="wb-query-what">{qy.what}</p>
              </Rise>
            ))}
          </ul>

          <div className="cs-sub">
            <Rise>
              <h3 className="cs-h3 cs-h3-light">Seven things it does</h3>
            </Rise>
            <ol className="wb-caps">
              {a.capabilities.map((c, i) => (
                <Rise as="li" key={c.title} className="wb-cap" delay={Math.min(i * 0.04, 0.2)}>
                  <span className="wb-cap-num">{pad(i + 1)}</span>
                  <h4 className="wb-cap-title">{c.title}</h4>
                  <p className="wb-cap-detail">{c.detail}</p>
                </Rise>
              ))}
            </ol>
          </div>

          <div className="cs-sub">
            <Rise>
              <h3 className="cs-h3 cs-h3-light">More of what it answers</h3>
            </Rise>
            <ul className="wb-rail wb-more">
              {a.more.map((m, i) => (
                <Rise as="li" key={m.src} className="wb-more-item" delay={Math.min(i * 0.05, 0.25)}>
                  <figure>
                    <PhoneFrame>
                      <Image src={m.src} alt={m.alt} width={m.width} height={m.height} sizes="(max-width: 760px) 44vw, 180px" />
                    </PhoneFrame>
                    <figcaption>{m.title}</figcaption>
                  </figure>
                </Rise>
              ))}
            </ul>
          </div>

          <div className="cs-sub wb-split">
            <Rise className="wb-split-visual">
              <a href={a.counter.src} target="_blank" rel="noopener" className="wb-screen-link" aria-label={`${a.counter.title}: open the full-size screenshot`}>
                <BrowserFrame url={`Store panel · Point of Sale`} tone="dark">
                  <Image src={a.counter.src} alt={a.counter.alt} width={a.counter.width} height={a.counter.height} sizes="(max-width: 1000px) 92vw, 640px" className="cs-shot" />
                </BrowserFrame>
              </a>
            </Rise>
            <Rise className="wb-split-text" delay={0.06}>
              <h3 className="cs-h3 cs-h3-light">{a.counter.title}</h3>
              <ul className="wb-screen-points wb-points-light">
                {a.counter.points.map((pt) => (
                  <li key={pt.slice(0, 40)}>{pt}</li>
                ))}
              </ul>
            </Rise>
          </div>

          <Rise className="wb-nobill">
            <p className="wb-nobill-figure" aria-hidden="true">
              ₹0
              <small>a month</small>
            </p>
            <div>
              <h3 className="wb-nobill-title">{a.noBill.title}</h3>
              {a.noBill.body.map((b) => (
                <p className="wb-nobill-body" key={b.slice(0, 40)}>
                  {b}
                </p>
              ))}
            </div>
          </Rise>
        </div>
      </section>

      {/* ── HQ command centre and Brighty training ───────────────────── */}
      <section className="cs-section cs-tone-paper" id="hq">
        <div className="cs-container">
          <Head kicker="Head office" question="What does head office see?" claim={p.hq.intro} />
          {p.hq.screens[0] && (
            <div className="wb-split wb-split-wide">
              <Rise className="wb-split-visual">
                <a href={p.hq.screens[0].src} target="_blank" rel="noopener" className="wb-screen-link" aria-label={`${p.hq.screens[0].title}: open the full-size screenshot`}>
                  <BrowserFrame url={`HQ panel · ${p.hq.screens[0].title}`}>
                    <Image src={p.hq.screens[0].src} alt={p.hq.screens[0].alt} width={p.hq.screens[0].width} height={p.hq.screens[0].height} sizes="(max-width: 1000px) 92vw, 680px" className="cs-shot" />
                  </BrowserFrame>
                </a>
              </Rise>
              <Rise className="wb-split-text" delay={0.06}>
                <h3 className="cs-h3">{p.hq.screens[0].title}</h3>
                <ul className="wb-screen-points">
                  {p.hq.screens[0].points.map((pt) => (
                    <li key={pt.slice(0, 40)}>{pt}</li>
                  ))}
                </ul>
              </Rise>
            </div>
          )}
          <div className="cs-sub">
            <Rise>
              <h3 className="cs-h3">Training and watching Brighty</h3>
              <p className="cs-lead">Head office answers a question once, and every outlet benefits from then on.</p>
            </Rise>
            <ul className="wb-rail wb-tour-grid wb-hq-grid">
              {p.hq.screens.slice(1).map((s, i) => (
                <Rise as="li" key={s.src} delay={Math.min(i * 0.06, 0.18)}>
                  <ScreenCard s={s} panel="HQ panel" sizes="(max-width: 760px) 84vw, (max-width: 1000px) 46vw, 540px" />
                </Rise>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Phone ────────────────────────────────────────────────────── */}
      <section className="cs-section" id="phone">
        <div className="cs-container">
          <div className="wb-phone-split">
            <Head kicker="Mobile" question="Does it work on a phone?" claim={p.phone.intro}>
              <ul className="wb-phone-points">
                {p.phone.points.map((pt) => (
                  <li key={pt.title}>
                    <strong>{pt.title}.</strong> {pt.detail}
                  </li>
                ))}
              </ul>
            </Head>
            <ul className="wb-rail wb-phones">
              {p.phone.shots.map((s, i) => (
                <Rise as="li" key={s.src} delay={Math.min(i * 0.08, 0.24)} className="wb-phones-item">
                  <figure>
                    <PhoneFrame>
                      <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 760px) 52vw, 220px" />
                    </PhoneFrame>
                    {s.caption && <figcaption>{s.caption}</figcaption>}
                  </figure>
                </Rise>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Website ──────────────────────────────────────────────────── */}
      <section className="cs-section cs-tone-paper" id="website">
        <div className="cs-container">
          <Head kicker="The website" question={`What did EchoPulse build for ${who} on the web?`} claim={w.heading}>
            <p className="cs-lead">{w.intro}</p>
          </Head>
          <Rise className="wb-site-stage">
            <Parallax className="wb-site-desk" range={1.5}>
              <BrowserFrame url={w.hero.url}>
                <Shot media={w.hero} sizes="(max-width: 1000px) 92vw, 860px" />
              </BrowserFrame>
            </Parallax>
            <div className="wb-site-phone">
              <PhoneFrame>
                <Image src={w.phone.src} alt={w.phone.alt} width={w.phone.width} height={w.phone.height} sizes="(max-width: 760px) 34vw, 220px" />
              </PhoneFrame>
            </div>
          </Rise>
          <p className="cs-caption">
            {w.hero.caption} {w.phone.caption}{' '}
            <a href={w.url} target="_blank" rel="noopener">
              Open {w.url.replace('https://', '')} <span aria-hidden="true">&rarr;</span>
            </a>
          </p>

          <div className="cs-sub">
            <Rise>
              <h3 className="cs-h3">What is on the live site</h3>
            </Rise>
            <ol className="wb-built">
              {w.built.map((b, i) => (
                <Rise as="li" key={b.title} className="wb-built-item" delay={Math.min(i * 0.05, 0.2)}>
                  <span className="wb-built-num">{pad(i + 1)}</span>
                  <h4 className="wb-built-title">{b.title}</h4>
                  <p className="wb-built-detail">{b.detail}</p>
                </Rise>
              ))}
            </ol>
          </div>

          <ul className="wb-rail cs-newpages wb-site-more">
            {w.more.map((s, i) => (
              <Rise as="li" key={s.src} delay={Math.min(i * 0.07, 0.21)}>
                <figure className="cs-newpage">
                  <BrowserFrame url={s.url}>
                    <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 760px) 84vw, 360px" className="cs-shot" />
                  </BrowserFrame>
                  {s.caption && <figcaption className="cs-caption">{s.caption}</figcaption>}
                </figure>
              </Rise>
            ))}
          </ul>

          {/* Verified enquiry figures. Renders nothing until the owner's
              dated evidence is in the data; see `enquiryProof`. */}
          {p.enquiryProof && (
            <Rise className="wb-proof">
              <p className="wb-proof-figure">{p.enquiryProof.figure}</p>
              <p className="wb-proof-period">{p.enquiryProof.period}</p>
              <p className="cs-caption">{p.enquiryProof.source}</p>
              {p.enquiryProof.screenshot && (
                <BrowserFrame url="Enquiries">
                  <Image
                    src={p.enquiryProof.screenshot.src}
                    alt={p.enquiryProof.screenshot.alt}
                    width={p.enquiryProof.screenshot.width}
                    height={p.enquiryProof.screenshot.height}
                    sizes="(max-width: 1000px) 92vw, 760px"
                    className="cs-shot"
                  />
                </BrowserFrame>
              )}
            </Rise>
          )}

          <Rise>
            <p className="wb-site-note">{w.note}</p>
          </Rise>
        </div>
      </section>

      {/* ── Marketing ────────────────────────────────────────────────── */}
      {m && (
        <section className="cs-section cs-tone-ink" id="marketing">
          <div className="cs-container">
            <Head kicker="Marketing" question={`How does EchoPulse run marketing for ${who}?`} claim={m.heading} light>
              <p className="cs-lead cs-lead-light">{m.intro}</p>
            </Head>

            <Rise className="wb-pipe">
              <ol className="wb-pipe-list" aria-label="The content pipeline">
                {m.pipeline.map((st, i) => (
                  <li key={st.title} className="wb-pipe-step">
                    <span className="wb-pipe-num">{pad(i + 1)}</span>
                    <h3 className="wb-pipe-title">{st.title}</h3>
                    <p className="wb-pipe-detail">{st.detail}</p>
                  </li>
                ))}
              </ol>
            </Rise>

            <div className="cs-sub">
              <Rise>
                <h3 className="cs-h3 cs-h3-light">The creatives, as posted</h3>
                <p className="cs-lead cs-lead-light">AI-generated reels and Hindi campaign posters from the brand&apos;s public Instagram. Each theme goes out as a reel and a matching post.</p>
              </Rise>
              <ul className="wb-rail wb-crs">
                {m.creatives.map((c, i) => (
                  <Rise as="li" key={c.href} delay={Math.min(i * 0.05, 0.25)}>
                    <CreativeCard c={c} handle="whitesandbrights.in" />
                  </Rise>
                ))}
              </ul>
              <p className="wb-swipe-hint" aria-hidden="true">
                Swipe for more creatives.
              </p>
              <p className="wb-cr-note">{m.creativesNote}</p>
              <ul className="wb-cr-profiles">
                {m.profiles.map((pr) => (
                  <li key={pr.href}>
                    <a href={pr.href} target="_blank" rel="noopener">
                      {pr.label} <span aria-hidden="true">&rarr;</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cs-sub">
              <Rise>
                <h3 className="cs-h3 cs-h3-light">What the marketing covers</h3>
              </Rise>
              <ol className="wb-caps wb-mk">
                {m.cards.map((c, i) => (
                  <Rise as="li" key={c.title} className="wb-cap" delay={Math.min(i * 0.04, 0.2)}>
                    <span className="wb-cap-num">{pad(i + 1)}</span>
                    <h4 className="wb-cap-title">{c.title}</h4>
                    <p className="wb-cap-detail">{c.detail}</p>
                  </Rise>
                ))}
              </ol>
            </div>

            <Rise className="wb-loop">
              <div className="wb-loop-head">
                <h3 className="wb-loop-title">Where marketing meets the operating system</h3>
                <p className="wb-loop-intro">{m.loop.intro}</p>
              </div>
              <ul className="wb-loop-list">
                {m.loop.items.map((it) => (
                  <li key={it.title}>
                    <strong>{it.title}.</strong> {it.detail}
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </section>
      )}

      {/* ── How we build custom software ─────────────────────────────── */}
      <section className="cs-section" id="build">
        <div className="cs-container cs-anchor" id="work">
          <Head kicker="How we build custom software" question={`How did EchoPulse build the ${who} system?`} claim={b?.heading ?? p.approach.heading}>
            <p className="cs-lead">{b?.intro ?? p.approach.intro}</p>
          </Head>
          {b ? (
            <ol className="wb-steps">
              {b.steps.map((st, i) => (
                <Rise as="li" key={st.title} className="wb-step" delay={Math.min(i * 0.03, 0.12)}>
                  <span className="wb-step-num" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <div className="wb-step-body">
                    <h3 className="wb-step-title">{st.title}</h3>
                    <p className="wb-step-detail">{st.detail}</p>
                    <ul className="wb-screen-points">
                      {st.points.map((pt) => (
                        <li key={pt.slice(0, 40)}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </Rise>
              ))}
            </ol>
          ) : (
            <WorkTimeline items={study.workstreams} />
          )}

          <div className="cs-sub cs-anchor" id="stack">
            <Rise>
              <h3 className="cs-h3">What it is built on</h3>
              <p className="cs-lead">Proven parts, and one unusual one: the assistant runs in the browser.</p>
            </Rise>
            <ul className="wb-stack">
              {p.stack.map((g, gi) => (
                <Rise as="li" key={g.group} className="wb-stack-group" delay={Math.min(gi * 0.07, 0.21)}>
                  <p className="wb-stack-h">{g.group}</p>
                  <dl className="wb-stack-list">
                    {g.items.map((it) => (
                      <div key={it.name}>
                        <dt>{it.name}</dt>
                        <dd>{it.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </Rise>
              ))}
            </ul>
          </div>

          {b && (
            <div className="cs-sub">
              <Rise>
                <h3 className="cs-h3">What a business gets</h3>
              </Rise>
              <ul className="wb-gets">
                {b.gets.map((g, i) => (
                  <Rise as="li" key={g.title} className="wb-get" delay={Math.min(i * 0.05, 0.2)}>
                    <h4 className="wb-get-title">{g.title}</h4>
                    <p className="wb-get-detail">{g.detail}</p>
                  </Rise>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────── */}
      <section className="cs-section cs-tone-ink" id="benefits">
        <div className="cs-container">
          <Head kicker="What it changes" question={`What does ${who} get from it?`} claim="What the delivered product does, in the shop's terms." light>
            {p.benefitsLead && <p className="cs-lead cs-lead-light">{p.benefitsLead}</p>}
          </Head>
          <ol className="wb-benefits">
            {p.benefits.map((bn, i) => (
              <Rise as="li" key={bn.title} className="wb-benefit" delay={Math.min(i * 0.04, 0.2)}>
                <span className="wb-benefit-num">{pad(i + 1)}</span>
                <h3 className="wb-benefit-title">{bn.title}</h3>
                <p className="wb-benefit-detail">{bn.detail}</p>
              </Rise>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Could this work for your business? ───────────────────────── */}
      {fit && (
        <section className="cs-section cs-tone-paper" id="your-business">
          <div className="cs-container">
            <Head kicker="Your business" question="Could this work for your business?" claim={fit.heading}>
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
          </div>
        </section>
      )}

      {/* ── What working with EchoPulse is like ──────────────────────── */}
      {wk && (
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
                <a href={wk.source.href}>
                  {wk.source.label}
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ (always open, plain HTML) ─────────────────────────────── */}
      {p.faq && p.faq.length > 0 && (
        <section className="cs-section cs-tone-paper" id="faq">
          <div className="cs-container">
            <Head kicker="FAQ" question={`Questions about the ${who} project`} />
            <dl className="wb-faq">
              {p.faq.map((f) => (
                <Rise key={f.q} className="wb-faq-item">
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </Rise>
              ))}
            </dl>
          </div>
        </section>
      )}
    </>
  );
}
