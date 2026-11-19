import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import ICPHeroDevice from '@/components/icp/ICPHeroDevice';
import Reveal from '@/components/icp/Reveal';
import Prose, { sentences } from '@/components/icp/Prose';
import { FUNNEL_CSS, CHECK_PATH, ARROW_PATH } from '@/components/icp/funnelStyles';
import { getIcp } from '@/lib/icpData';
import { wallClips } from '@/lib/videos';
import {
  BOOK_CALL_LABEL,
  BOOK_CALL_REASSURANCE,
  FREE_EDITS_LABEL,
  FREE_EDITS_URL,
} from '@/lib/links';
import { PROMISES } from '@/lib/pricing';
import { NICHE_PAGES, NICHE_PLAN_ROWS, NICHE_PROMISES, type NichePage as NichePageData } from '@/lib/nicheServiceData';
import { NICHE_PAGES_UPDATED_LABEL, NICHE_PAGES_UPDATED_ISO } from '@/lib/siteMeta';

const ACCENT = '#E8541A';

function Arrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d={ARROW_PATH} /></svg>
  );
}

/**
 * Server component for /[icp]/[service]. Copy comes from lib/nicheServiceData.ts,
 * one hand-written entry per page. Built on the shared funnel layer
 * (components/icp/funnelStyles.ts) so it lines up with the audience and
 * service pages: one container, one type scale, one primary ask (the free
 * sample) repeated at the hero, mid-page and the end. The booking call is
 * offered as the quiet alternative, never as a second button beside it.
 */
export default function NichePage({ page }: { page: NichePageData }) {
  const icp = getIcp(page.icp);
  const icpName = icp?.name ?? page.buyer;
  const location = `niche_${page.icp}_${page.service}`;

  // Poster stills for this audience, shown as the work strip under the hero.
  // Declared-horizontal clips are skipped so every tile is a clean 9:16 frame.
  const clips = page.proof.showClips
    ? wallClips()
        .filter((c) => c.icps.includes(page.icp) && c.orientation !== 'horizontal')
        .slice(0, 6)
    : [];

  // Same rule as the service pages: the free sample is two edited videos, so
  // it is the primary ask only where video is what the visitor came for. On
  // the writing, website and branding pages the call leads and the free edits
  // are the quieter alternative.
  const videoFirst = page.service === 'video-editing' || page.service === 'ad-creatives';
  const freeEdits = (where: string) => (
    <Link href={FREE_EDITS_URL} data-track-location={where} className="fn-btn" data-cursor-hover>
      {FREE_EDITS_LABEL}
      <Arrow />
    </Link>
  );
  const primary = (where: string) =>
    videoFirst ? freeEdits(`niche_${where}`) : (
      <ICPBookButton label={BOOK_CALL_LABEL} location={`${location}_${where}`} accent={ACCENT} className="fn-btn" />
    );

  const siblings = NICHE_PAGES.filter((p) => p.icp === page.icp && p.service !== page.service);

  // The capsule is the paragraph answer engines quote. Its first sentence is
  // the self-contained answer and leads the hero; the rest (prices, terms)
  // opens the "what you get" section directly below, so no fact is lost and
  // the hero stays one short line.
  const capsule = sentences(page.capsule);
  const heroSub = capsule[0];
  const capsuleRest = capsule.slice(1).join(' ');

  const deviceAlt = icp
    ? `How EchoPulse works for ${icp.name.toLowerCase()}: ${icp.pipeline.input.label.toLowerCase()}, and EchoPulse produces ${icp.pipeline.outputs
        .map((o) => o.label.toLowerCase())
        .join(', ')}.`
    : '';

  return (
    <>
      <Nav />

      <main id="main" className="fn np" style={{ ['--fn-accent' as string]: ACCENT }}>
        {/* ── Hero (ink): H1, one-line answer, one ask, the visual ── */}
        <section className="np-hero fn-ink" data-dark-bg="true">
          <div className="fn-container np-hero-grid">
            <div>
              <nav aria-label="Breadcrumb" className="np-crumb">
                <Link href="/">Home</Link>
                <span aria-hidden="true">/</span>
                <Link href={`/${page.icp}`}>{icpName}</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{page.serviceName}</span>
              </nav>
              <p className="fn-eyebrow" style={{ color: ACCENT }}>{page.serviceName} for {page.buyer}</p>
              <h1 className="fn-h1 np-h1">{page.h1}</h1>
              <p className="fn-lead np-sub">{heroSub}</p>
              <div className="fn-actions">{primary('hero')}</div>
              {videoFirst ? (
                <p className="fn-alt-ask">
                  Prefer to talk first?{' '}
                  <ICPBookButton label={BOOK_CALL_LABEL} location={location} accent={ACCENT} className="np-text-ask" plain />
                </p>
              ) : (
                <p className="fn-alt-ask">
                  Want to judge our editing first? <Link href={FREE_EDITS_URL} data-track-location="niche_hero">{FREE_EDITS_LABEL}</Link>, no card needed.
                </p>
              )}
              <ul className="fn-proof" aria-label="On every plan">
                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d={CHECK_PATH} /></svg>{videoFirst ? 'No card for the free edits' : 'Month to month, no contract'}</li>
                <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d={CHECK_PATH} /></svg>{PROMISES.turnaround}</li>
              </ul>
            </div>
            {icp ? (
              <div className="np-hero-visual">
                <ICPHeroDevice accent={ACCENT} alt={deviceAlt} pipeline={icp.pipeline} />
              </div>
            ) : null}
          </div>
        </section>

        {/* ── Work strip (ink), straight under the hero ── */}
        {clips.length > 0 ? (
          <section className="np-work fn-ink" data-dark-bg="true" aria-labelledby="work-h">
            <div className="fn-container">
              <div className="np-work-head">
                <h2 id="work-h" className="np-work-h">Edits from our work page</h2>
                <Link href={`/work?niche=${page.icp}`} className="fn-textlink">Watch the clips</Link>
              </div>
              <ul className="np-clips">
                {clips.map((c) => (
                  <li key={c.id}>
                    <Link href={`/work?niche=${page.icp}`} className="np-clip" aria-label={`${c.brand}, ${c.label}: open the work page`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.poster} srcSet={`${c.posterSm} 320w, ${c.poster} 520w`} sizes="(max-width: 768px) 160px, 180px" alt={`Still from a ${c.brand.toLowerCase()} edit, ${c.label.toLowerCase()}`} loading="lazy" width={260} height={462} />
                      <span className="np-clip-cap">{c.brand}, {c.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {page.proof.clipsNote ? <p className="fn-small np-clips-note">{page.proof.clipsNote}</p> : null}
            </div>
          </section>
        ) : null}

        {/* ── What you get (cream) ── */}
        <section className="fn-section fn-cream" aria-labelledby="get-h">
          <div className="fn-container fn-split">
            <Reveal className="fn-split-sticky">
              <p className="fn-eyebrow" style={{ color: ACCENT }}>What you get</p>
              <h2 id="get-h" className="fn-h2">{page.getHeading}</h2>
              {capsuleRest ? <p className="fn-body np-capsule-rest">{capsuleRest}</p> : null}
            </Reveal>
            <ol className="fn-rows fn-rows-2">
              {page.deliverables.map((d, i) => (
                <Reveal as="li" key={d.title} delay={Math.min(i * 0.04, 0.2)}>
                  <span className="fn-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="fn-h3">{d.title}</h3>
                    <p>{d.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── How it works (paper) ── */}
        <section className="fn-section fn-paper" aria-labelledby="how-h">
          <div className="fn-container">
            <Reveal className="fn-head">
              <p className="fn-eyebrow" style={{ color: ACCENT }}>How it works</p>
              <h2 id="how-h" className="fn-h2">From first clip to monthly plan</h2>
            </Reveal>
            <ol className={`fn-grid fn-grid-${Math.min(page.steps.length, 4)} np-steps`}>
              {page.steps.map((s, i) => (
                <Reveal as="li" key={s.title} delay={Math.min(i * 0.06, 0.24)}>
                  <div className="fn-card">
                    <span className="np-step-n" aria-hidden="true">{i + 1}</span>
                    <h3 className="fn-h3">{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Price table (cream), closed by the mid-page ask ── */}
        <section className="fn-section fn-cream" aria-labelledby="price-h">
          <div className="fn-container">
            <Reveal className="fn-head">
              <p className="fn-eyebrow" style={{ color: ACCENT }}>What it costs</p>
              <h2 id="price-h" className="fn-h2">The price ladder, for {page.buyer}</h2>
            </Reveal>
            <Reveal>
              <table className="np-table">
                <caption className="np-sr">Plans and prices with what each includes for {page.buyer}</caption>
                <thead>
                  <tr>
                    <th scope="col">Plan</th>
                    <th scope="col">Price</th>
                    <th scope="col">What it includes for you</th>
                  </tr>
                </thead>
                <tbody>
                  {NICHE_PLAN_ROWS.map(({ plan, key }) => (
                    <tr key={plan.key} className={plan.featured ? 'np-feat' : undefined}>
                      <th scope="row" data-label="Plan">{plan.name}</th>
                      <td data-label="Price">
                        {plan.key === 'full' ? null : <span className="np-price">{plan.priceLabel}</span>}
                        <span className="np-per">{plan.per}</span>
                      </td>
                      <td data-label="Includes">{page.ladder[key]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
            <div className="np-price-foot">
              <div className="np-price-notes">
                {page.ladderNote ? <p className="fn-small">{page.ladderNote}</p> : null}
                <p className="fn-small">
                  {NICHE_PROMISES.map((t) => t.replace(/\.$/, '')).join('. ')}. Prices are in USD, the same worldwide.{' '}
                  <Link href="/pricing" className="np-inline">See the full pricing page</Link>.
                </p>
              </div>
              {primary('mid')}
            </div>
          </div>
        </section>

        {/* ── Proof (paper) ── */}
        <section className="fn-section fn-paper" aria-labelledby="proof-h">
          <div className="fn-container fn-split">
            <Reveal className="fn-split-sticky">
              <p className="fn-eyebrow" style={{ color: ACCENT }}>Proof</p>
              <h2 id="proof-h" className="fn-h2">{page.proof.heading}</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <Prose paragraphs={page.proof.paragraphs} />
              <ul className="np-links">
                {clips.length > 0 ? (
                  <li><Link href={`/work?niche=${page.icp}`}>Watch the clips on the work page</Link></li>
                ) : null}
                {page.proof.links
                  .filter((l) => !l.href.startsWith('/work'))
                  .map((l) => (
                    <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                  ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ── When this is not a fit (ink) ── */}
        <section className="fn-section fn-ink" data-dark-bg="true" aria-labelledby="notfit-h">
          <div className="fn-container fn-split">
            <Reveal>
              <p className="fn-eyebrow" style={{ color: ACCENT }}>Be honest with me</p>
              <h2 id="notfit-h" className="fn-h2">When this is not a fit</h2>
            </Reveal>
            <ul className="np-notfit">
              {page.notFit.map((t, i) => (
                <Reveal as="li" key={t} delay={Math.min(i * 0.05, 0.2)}>
                  <span className="np-notfit-x" aria-hidden="true">✕</span>
                  <span>{t}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ (cream): native accordions, every answer in the HTML ── */}
        <section className="fn-section fn-cream" aria-labelledby="faq-h">
          <div className="fn-container fn-split">
            <Reveal className="fn-split-sticky">
              <p className="fn-eyebrow" style={{ color: ACCENT }}>Questions</p>
              <h2 id="faq-h" className="fn-h2">What {page.buyer} ask before they start</h2>
            </Reveal>
            <div className="fn-faq">
              {page.faq.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>{f.q}</summary>
                  <div><p>{f.a}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Keep reading (paper) ── */}
        <section className="fn-section fn-paper" aria-labelledby="more-h">
          <div className="fn-container">
            <Reveal className="fn-head">
              <p className="fn-eyebrow" style={{ color: ACCENT }}>Keep reading</p>
              <h2 id="more-h" className="fn-h2">Related pages and guides</h2>
            </Reveal>
            <div className="fn-grid fn-grid-2 np-more">
              <div>
                <h3 className="np-more-h">On this site</h3>
                <ul className="np-links np-links-ruled">
                  <li><Link href={`/${page.icp}`}>Everything we do for {icpName.toLowerCase()}</Link></li>
                  <li><Link href={page.serviceLink?.href ?? `/services/${page.service}`}>{page.serviceLink?.label ?? `The ${page.serviceName.toLowerCase()} service in full`}</Link></li>
                  {page.extraLinks?.map((l) => (
                    <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                  ))}
                  <li><Link href="/pricing">Pricing</Link></li>
                  {siblings.map((s) => (
                    <li key={s.service}><Link href={`/${s.icp}/${s.service}`}>{s.h1}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="np-more-h">Guides we wrote</h3>
                <ul className="np-links np-links-ruled">
                  {page.posts.map((p) => (
                    <li key={p.slug}><Link href={`/blog/${p.slug}`}>{p.title}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final ask (ink) ── */}
        <section className="fn-section fn-ink" data-dark-bg="true" aria-labelledby="cta-h">
          <div className="fn-container fn-final">
            <Reveal>
              {videoFirst ? (
                <>
                  <h2 id="cta-h" className="fn-h2">Start with two edits you can judge yourself.</h2>
                  <p className="fn-lead">
                    Send footage you already have and get 2 edited videos back within 48 hours. No card, no call, and you keep the files.
                  </p>
                  <div className="fn-actions">{freeEdits('niche_final')}</div>
                  <p className="fn-alt-ask">
                    Or book 15 minutes and we will look at your situation together:{' '}
                    <ICPBookButton label={BOOK_CALL_LABEL} location={`${location}_bottom`} accent={ACCENT} className="np-text-ask" plain />
                    . {BOOK_CALL_REASSURANCE}
                  </p>
                </>
              ) : (
                <>
                  <h2 id="cta-h" className="fn-h2">Talk it through in 15 minutes.</h2>
                  <p className="fn-lead">
                    Book 15 minutes and we will look at your situation together. {BOOK_CALL_REASSURANCE}
                  </p>
                  <div className="fn-actions">
                    <ICPBookButton label={BOOK_CALL_LABEL} location={`${location}_bottom`} accent={ACCENT} className="fn-btn" />
                  </div>
                  <p className="fn-alt-ask">
                    Or send footage you already have and get 2 edited videos back within 48 hours:{' '}
                    <Link href={FREE_EDITS_URL} data-track-location="niche_final">{FREE_EDITS_LABEL}</Link>. No card, no call, and you keep the files.
                  </p>
                </>
              )}
              <p className="fn-byline">
                Last updated <time dateTime={NICHE_PAGES_UPDATED_ISO}>{NICHE_PAGES_UPDATED_LABEL}</time>. Prices are in USD, the same worldwide.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />

      <style>{FUNNEL_CSS}</style>
      <style>{`
        .np-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .np :where(a:not(.fn-btn):not(.np-clip):not(.fn-textlink)) { color: inherit; font-weight: 600; text-decoration: underline; text-decoration-color: ${ACCENT}; text-underline-offset: 4px; text-decoration-thickness: 1px; overflow-wrap: anywhere; }
        .np :where(a:not(.fn-btn):not(.np-clip)):hover { color: ${ACCENT}; }
        .np-text-ask { display: inline; padding: 12px 0; margin: -12px 0; line-height: 20px; min-height: 0; background: none; border: 0; color: #F2EEE7; font: inherit; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; cursor: pointer; }
        .np-text-ask:focus-visible { outline: 3px solid ${ACCENT}; outline-offset: 3px; }

        /* Hero */
        .np-hero { padding: 144px 0 80px; position: relative; }
        .np-hero-grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 64px; align-items: center; }
        .np-hero-visual { width: 100%; max-width: 380px; justify-self: end; }
        .np-crumb { display: flex; flex-wrap: wrap; align-items: center; gap: 0 8px; font-size: 14px; color: rgba(242,238,231,0.5); margin-bottom: 32px; }
        .np .np-crumb a { color: rgba(242,238,231,0.66); text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; min-height: 32px; }
        .np .np-crumb a:hover { color: #F2EEE7; }
        .np-crumb span[aria-current] { color: rgba(242,238,231,0.85); display: inline-flex; align-items: center; min-height: 32px; }
        .np-h1 { max-width: 14ch; }
        .np-sub { margin-bottom: 40px; max-width: 34em; }

        /* Work strip */
        .np-work { padding: 0 0 96px; }
        .np-work-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding-top: 48px; border-top: 1px solid rgba(242,238,231,0.14); margin-bottom: 24px; }
        .np-work-head .fn-textlink { white-space: nowrap; }
        .np-work-h { margin: 0; font-size: 20px !important; line-height: 1.3 !important; font-weight: 800; letter-spacing: -0.015em !important; }
        .np-clips { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 16px; }
        .np-clip { display: block; text-decoration: none !important; }
        .np-clip img { display: block; width: 100%; height: auto; aspect-ratio: 9 / 16; object-fit: cover; border-radius: 12px; background: #1d1b19; transition: transform .3s cubic-bezier(.16,1,.3,1); }
        .np-clip-cap { display: block; font-size: 13px; font-weight: 600; color: rgba(242,238,231,0.66); margin-top: 8px; line-height: 1.4; }
        .np-clips-note { margin: 24px 0 0; }
        @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) { .np-clip:hover img { transform: translateY(-4px); } }

        .np-capsule-rest { margin: 24px 0 0; font-size: 16px; color: #6E6B63; max-width: 40ch; }
        .np-step-n { display: block; font-size: 48px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; color: ${ACCENT}; margin-bottom: 24px; }
        .np-steps { list-style: none; margin: 0; padding: 0; }

        /* Price table */
        .np-table { width: 100%; border-collapse: collapse; text-align: left; background: rgba(255,255,255,0.62); border: 1px solid rgba(12,12,11,0.12); border-radius: 16px; overflow: hidden; border-spacing: 0; }
        .np-table thead th { font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #6E6B63; padding: 16px 24px; border-bottom: 1px solid rgba(12,12,11,0.12); background: rgba(12,12,11,0.03); }
        .np-table tbody th, .np-table tbody td { padding: 24px; border-bottom: 1px solid rgba(12,12,11,0.1); vertical-align: top; }
        .np-table tbody tr:last-child th, .np-table tbody tr:last-child td { border-bottom: 0; }
        .np-table tbody th { font-size: 17px; font-weight: 800; color: #0C0C0B; width: 20%; }
        .np-table tbody td:nth-child(2) { width: 20%; }
        .np-table td { font-size: 16px; line-height: 1.6; color: #3E3D3A; }
        .np-price { display: block; font-size: 24px; font-weight: 900; letter-spacing: -0.03em; color: #0C0C0B; line-height: 1.1; }
        .np-per { display: block; font-size: 14px; color: #6E6B63; margin-top: 4px; line-height: 1.4; }
        .np-feat { background: rgba(232,84,26,0.06); }
        .np-feat th { box-shadow: inset 4px 0 0 ${ACCENT}; }
        .np-price-foot { display: flex; align-items: center; justify-content: space-between; gap: 24px 48px; margin-top: 32px; flex-wrap: wrap; }
        .np-price-notes { max-width: 64ch; }
        .np-price-notes p { margin: 0 0 8px; }
        .np-price-notes p:last-child { margin: 0; }

        /* Links */
        .np-links { list-style: none; margin: 32px 0 0; padding: 0; }
        .np-links li { margin: 0; }
        .np-links a { display: inline-flex; align-items: center; min-height: 44px; font-size: 16px; }
        .np-links-ruled { margin-top: 16px; border-top: 1px solid rgba(12,12,11,0.12); }
        .np-links-ruled li { border-bottom: 1px solid rgba(12,12,11,0.12); padding: 8px 0; }
        .np-more-h { font-size: 12px !important; line-height: 1.4 !important; font-weight: 800; letter-spacing: 0.12em !important; text-transform: uppercase; color: #6E6B63; margin: 0; }

        /* Not a fit */
        .np-notfit { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(242,238,231,0.14); }
        .np-notfit li { display: flex; gap: 16px; align-items: flex-start; font-size: 17px; line-height: 1.6; color: rgba(242,238,231,0.82); padding: 24px 0; border-bottom: 1px solid rgba(242,238,231,0.14); }
        .np-notfit-x { flex-shrink: 0; color: ${ACCENT}; font-weight: 900; width: 16px; }

        @media (max-width: 1024px) {
          .np-hero { padding: 136px 0 64px; }
          .np-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 48px; }
          .np-hero-visual { justify-self: start; }
          .np-clips { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 768px) {
          .np-hero { padding: 112px 0 48px !important; }
          .np-h1 { font-size: 36px; }
          .np-sub { margin-bottom: 32px; }
          .np-crumb { margin-bottom: 16px; }
          .np .np-crumb a, .np-crumb span[aria-current] { min-height: 44px; }
          .np-hero-visual { justify-self: center; max-width: 340px; }
          .np-work { padding: 0 0 72px !important; }
          .np-work-head { padding-top: 40px; }
          /* Phone: a swipeable strip of 160px tiles rather than a tall grid. */
          .np-clips { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 24px; gap: 12px; margin: 0 -24px; padding: 0 24px 8px; scrollbar-width: none; }
          .np-clips::-webkit-scrollbar { display: none; }
          .np-clips li { flex: 0 0 160px; scroll-snap-align: start; }
          .np-step-n { font-size: 40px; margin-bottom: 16px; }
          .np-table, .np-table tbody, .np-table tr, .np-table th, .np-table td { display: block; width: auto !important; }
          .np-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
          .np-table tr { padding: 24px; border-bottom: 1px solid rgba(12,12,11,0.1); }
          .np-table tbody tr:last-child { border-bottom: 0; }
          .np-table tbody th, .np-table tbody td { padding: 0; border-bottom: 0; }
          .np-table tbody th { font-size: 18px; display: inline-block; margin-right: 8px; }
          .np-table td:nth-child(2) { display: inline; }
          .np-table .np-price, .np-table .np-per { display: inline; }
          .np-table .np-price { font-size: 18px; }
          .np-table .np-per { margin-left: 8px; }
          .np-table td:nth-child(3) { margin-top: 8px; font-size: 15px; }
          .np-feat { box-shadow: inset 4px 0 0 ${ACCENT}; }
          .np-feat th { box-shadow: none; }
          .np-price-foot .fn-btn { width: 100%; }
          .np-notfit li { font-size: 16px; }
        }
        @media (max-width: 374px) {
          .np-h1 { font-size: 32px; }
          .np-clips { margin: 0 -16px; padding: 0 16px 8px; scroll-padding: 0 16px; }
        }
      `}</style>
    </>
  );
}
