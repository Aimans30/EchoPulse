import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ICPBookButton from '@/components/icp/ICPBookButton';
import { getIcp } from '@/lib/icpData';
import { wallClips } from '@/lib/videos';
import {
  BOOK_CALL_LABEL,
  BOOK_CALL_REASSURANCE,
  FREE_EDITS_LABEL,
  FREE_EDITS_URL,
} from '@/lib/links';
import { NICHE_PAGES, NICHE_PLAN_ROWS, NICHE_PROMISES, type NichePage as NichePageData } from '@/lib/nicheServiceData';
import { NICHE_PAGES_UPDATED_LABEL, NICHE_PAGES_UPDATED_ISO } from '@/lib/siteMeta';

const ACCENT = '#E8541A';
const INK = '#0C0C0B';

/**
 * Server component for /[icp]/[service]. Copy comes from lib/nicheServiceData.ts,
 * one hand-written entry per page. The look follows /what-is-echopulse-media:
 * cream and near-black, one orange accent, Inter, hairlines, real tables.
 * The only client code is the booking button.
 */
export default function NichePage({ page }: { page: NichePageData }) {
  const icp = getIcp(page.icp);
  const icpName = icp?.name ?? page.buyer;
  const location = `niche_${page.icp}_${page.service}`;

  // Poster stills for this audience. Declared-horizontal clips are skipped so
  // every tile is a clean 9:16 frame.
  const clips = page.proof.showClips
    ? wallClips()
        .filter((c) => c.icps.includes(page.icp) && c.orientation !== 'horizontal')
        .slice(0, 4)
    : [];

  const siblings = NICHE_PAGES.filter((p) => p.icp === page.icp && p.service !== page.service);

  return (
    <>
      <Nav />

      <main id="main" className="np-page">
        {/* ── Hero: H1 and the answer capsule ───────────────────────────── */}
        <section className="np-hero">
          <nav aria-label="Breadcrumb" className="np-crumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${page.icp}`}>{icpName}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.serviceName}</span>
          </nav>
          <p className="np-eyebrow">{page.serviceName} for {page.buyer}</p>
          <h1 className="np-h1">{page.h1}</h1>
          <p className="np-capsule">{page.capsule}</p>
          <div className="np-cta-row">
            <Link href={FREE_EDITS_URL} className="np-btn np-btn-primary" data-cursor-hover>
              {FREE_EDITS_LABEL}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <ICPBookButton label={BOOK_CALL_LABEL} location={location} accent={INK} size="lg" fullWidthMobile />
          </div>
          <p className="np-meta">
            Last updated <time dateTime={NICHE_PAGES_UPDATED_ISO}>{NICHE_PAGES_UPDATED_LABEL}</time>. Prices are in USD, the same
            worldwide.
          </p>
        </section>

        {/* ── What you get ──────────────────────────────────────────────── */}
        <section className="np-sec np-split" aria-labelledby="get-h">
          <div className="np-split-head">
            <p className="np-eyebrow">What you get</p>
            <h2 id="get-h" className="np-h2">{page.getHeading}</h2>
          </div>
          <ol className="np-rows">
            {page.deliverables.map((d, i) => (
              <li key={d.title}>
                <span className="np-row-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="np-sec" aria-labelledby="how-h">
          <p className="np-eyebrow">How it works</p>
          <h2 id="how-h" className="np-h2">From first clip to monthly plan</h2>
          <ol className="np-steps">
            {page.steps.map((s, i) => (
              <li key={s.title}>
                <span className="np-step-n" aria-hidden="true">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Price table ───────────────────────────────────────────────── */}
        <section className="np-sec" aria-labelledby="price-h">
          <p className="np-eyebrow">What it costs</p>
          <h2 id="price-h" className="np-h2">The price ladder, for {page.buyer}</h2>
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
          {page.ladderNote ? <p className="np-note">{page.ladderNote}</p> : null}
          <p className="np-note">
            {NICHE_PROMISES.map((t) => t.replace(/\.$/, '')).join('. ')}. <Link href="/pricing">See the full pricing page</Link>.
          </p>
        </section>

        {/* ── Proof ─────────────────────────────────────────────────────── */}
        <section className="np-sec" aria-labelledby="proof-h">
          <p className="np-eyebrow">Proof</p>
          <h2 id="proof-h" className="np-h2">{page.proof.heading}</h2>
          <div className="np-prose">
            {page.proof.paragraphs.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>

          {clips.length > 0 ? (
            <>
              <ul className="np-clips">
                {clips.map((c) => (
                  <li key={c.id}>
                    <Link href={`/work?niche=${page.icp}`} className="np-clip" aria-label={`${c.brand}, ${c.label}: open the work page`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.poster} alt={`Still from a ${c.brand.toLowerCase()} edit, ${c.label.toLowerCase()}`} loading="lazy" width={260} height={462} />
                      <span className="np-clip-cap">{c.brand}, {c.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {page.proof.clipsNote ? <p className="np-note">{page.proof.clipsNote}</p> : null}
            </>
          ) : null}

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
        </section>

        {/* ── When this is not a fit ────────────────────────────────────── */}
        <section className="np-dark" data-dark-bg="true" aria-labelledby="notfit-h">
          <div className="np-dark-in">
            <p className="np-eyebrow np-eyebrow-dark">Be honest with me</p>
            <h2 id="notfit-h" className="np-h2 np-h2-dark">When this is not a fit</h2>
            <ul className="np-notfit">
              {page.notFit.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="np-sec" aria-labelledby="faq-h">
          <p className="np-eyebrow">Questions</p>
          <h2 id="faq-h" className="np-h2">What {page.buyer} ask before they start</h2>
          <dl className="np-faq">
            {page.faq.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Links ─────────────────────────────────────────────────────── */}
        <section className="np-sec" aria-labelledby="more-h">
          <p className="np-eyebrow">Keep reading</p>
          <h2 id="more-h" className="np-h2">Related pages and guides</h2>
          <div className="np-more">
            <div>
              <h3>On this site</h3>
              <ul className="np-links">
                <li><Link href={`/${page.icp}`}>Everything we do for {icpName.toLowerCase()}</Link></li>
                <li><Link href={`/services/${page.service}`}>The {page.serviceName.toLowerCase()} service in full</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                {siblings.map((s) => (
                  <li key={s.service}><Link href={`/${s.icp}/${s.service}`}>{s.h1}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Guides we wrote</h3>
              <ul className="np-links">
                {page.posts.map((p) => (
                  <li key={p.slug}><Link href={`/blog/${p.slug}`}>{p.title}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="np-sec np-final" aria-labelledby="cta-h">
          <h2 id="cta-h" className="np-h2 np-final-h">Start with two edits you can judge yourself.</h2>
          <p className="np-final-p">
            Send footage you already have and get 2 edited videos back within 48 hours. No card, no call, and you keep the files. Or book 15 minutes and we will look at your situation together.
          </p>
          <div className="np-cta-row">
            <Link href={FREE_EDITS_URL} className="np-btn np-btn-primary" data-cursor-hover>
              {FREE_EDITS_LABEL}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <ICPBookButton label={BOOK_CALL_LABEL} location={`${location}_bottom`} accent={INK} size="lg" fullWidthMobile />
          </div>
          <p className="np-meta">{BOOK_CALL_REASSURANCE}</p>
        </section>

        <style>{`
          .np-page { background: #F2EEE7; color: ${INK}; font-family: Inter, sans-serif }
          .np-page p, .np-page li, .np-page dd, .np-page td { line-height: 1.7; color: #4A4740; font-size: 16px; }
          .np-page a { color: ${INK}; font-weight: 600; text-decoration: underline; text-decoration-color: ${ACCENT}; text-underline-offset: 3px; overflow-wrap: anywhere; }
          .np-page a:hover { color: ${ACCENT}; }
          .np-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

          .np-page > section { max-width: 1040px; margin: 0 auto; padding: 72px 24px; border-top: 1px solid rgba(12,12,11,0.1); }
          .np-page > section.np-hero { border-top: none; padding-top: 140px; padding-bottom: 64px; }
          .np-page > section.np-dark { max-width: none; background: ${INK}; border-top: none; padding: 0; }

          .np-eyebrow { font-size: 11px !important; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; color: ${ACCENT} !important; margin: 0 0 14px; line-height: 1.4 !important; }
          .np-eyebrow-dark { color: ${ACCENT} !important; }
          .np-h1 { font-size: clamp(38px, 6.6vw, 80px); font-weight: 900; letter-spacing: -0.045em; line-height: 0.98; margin: 0 0 28px; max-width: 940px; text-wrap: balance; }
          .np-h2 { font-size: clamp(26px, 3.6vw, 42px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; margin: 0 0 32px; max-width: 700px; text-wrap: balance; }
          .np-h2-dark { color: #F2EEE7; }

          .np-crumb { display: flex; flex-wrap: wrap; gap: 4px 10px; font-size: 13px; color: #6E6B63; margin-bottom: 36px; }
          .np-crumb a { color: #6E6B63; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; min-height: 32px; }
          .np-crumb a:hover { color: ${ACCENT}; }
          .np-crumb span[aria-current] { display: inline-flex; align-items: center; min-height: 32px; }

          .np-capsule { font-size: clamp(18px, 2vw, 22px) !important; line-height: 1.55 !important; color: #2E2C28 !important; max-width: 760px; margin: 0 0 32px; font-weight: 500; }
          .np-meta { font-size: 13.5px !important; color: #6E6B63 !important; margin: 22px 0 0; max-width: 640px; }

          .np-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 16px; }
          .np-btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 52px; padding: 17px 34px; border-radius: 100px; font-size: 15px; font-weight: 700; text-decoration: none !important; white-space: nowrap; touch-action: manipulation; transition: transform 0.2s; }
          .np-btn-primary { background: ${ACCENT}; color: #fff !important; box-shadow: 0 8px 32px ${ACCENT}55; }
          .np-btn-primary:hover { transform: translateY(-2px); color: #fff !important; }

          /* what you get */
          .np-split { display: grid; grid-template-columns: 5fr 7fr; gap: 24px 64px; align-items: start; }
          .np-split-head .np-h2 { margin-bottom: 0; }
          .np-rows { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(12,12,11,0.16); }
          .np-rows li { display: grid; grid-template-columns: 44px 1fr; gap: 6px; padding: 24px 0; border-bottom: 1px solid rgba(12,12,11,0.16); }
          .np-row-n { font-size: 13px; font-weight: 800; color: ${ACCENT}; letter-spacing: 1px; padding-top: 4px; }
          .np-rows h3 { font-size: 19px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25; margin: 0 0 8px; color: ${INK}; }
          .np-rows p { margin: 0; }

          /* how it works */
          .np-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0 32px; counter-reset: s; }
          .np-steps li { border-top: 3px solid ${INK}; padding: 18px 0 8px; }
          .np-step-n { display: block; font-size: 52px; font-weight: 900; letter-spacing: -0.05em; line-height: 1; color: ${ACCENT}; margin-bottom: 14px; }
          .np-steps h3 { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25; margin: 0 0 8px; color: ${INK}; }
          .np-steps p { margin: 0; font-size: 15px; }

          /* price table */
          .np-table { width: 100%; border-collapse: collapse; text-align: left; }
          .np-table thead th { font-size: 11px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: #6E6B63; padding: 0 16px 12px 0; border-bottom: 2px solid ${INK}; }
          .np-table tbody th, .np-table tbody td { padding: 20px 16px 20px 0; border-bottom: 1px solid rgba(12,12,11,0.14); vertical-align: top; }
          .np-table tbody th { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; color: ${INK}; width: 18%; }
          .np-table tbody td:nth-child(2) { width: 20%; }
          .np-table td { font-size: 15.5px; }
          .np-price { display: block; font-size: 22px; font-weight: 900; letter-spacing: -0.03em; color: ${INK}; line-height: 1.1; }
          .np-per { display: block; font-size: 13px; color: #6E6B63; margin-top: 4px; line-height: 1.4; }
          .np-feat th { box-shadow: inset 4px 0 0 ${ACCENT}; padding-left: 16px !important; }
          .np-feat { background: rgba(232,84,26,0.06); }
          .np-note { font-size: 14.5px !important; color: #4A4740; margin: 18px 0 0; max-width: 720px; }

          /* proof */
          .np-prose p { max-width: 720px; margin: 0 0 16px; }
          .np-clips { list-style: none; margin: 28px 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .np-clip { display: block; text-decoration: none !important; }
          .np-clip img { display: block; width: 100%; height: auto; aspect-ratio: 9 / 16; object-fit: cover; border-radius: 14px; background: #D9D4C9; }
          .np-clip-cap { display: block; font-size: 13px; font-weight: 600; color: #4A4740; margin-top: 8px; line-height: 1.4; }
          .np-links { list-style: none; margin: 24px 0 0; padding: 0; }
          .np-links li { margin: 0; }
          .np-links a { display: inline-flex; align-items: center; min-height: 44px; }

          /* not a fit */
          .np-dark-in { max-width: 1040px; margin: 0 auto; padding: 72px 24px; }
          .np-notfit { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(242,238,231,0.2); max-width: 760px; }
          .np-notfit li { color: rgba(242,238,231,0.86) !important; font-size: 17px; padding: 20px 0; border-bottom: 1px solid rgba(242,238,231,0.2); }

          /* faq */
          .np-faq { margin: 0; max-width: 760px; }
          .np-faq > div { padding: 22px 0; border-bottom: 1px solid rgba(12,12,11,0.14); }
          .np-faq > div:first-child { border-top: 1px solid rgba(12,12,11,0.14); }
          .np-faq dt { font-size: 19px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.3; margin: 0 0 8px; color: ${INK}; }
          .np-faq dd { margin: 0; }

          /* more */
          .np-more { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 64px; }
          .np-more h3 { font-size: 13px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: #6E6B63; margin: 0; }
          .np-more .np-links { margin-top: 8px; }

          /* final */
          .np-page > section.np-final { padding-bottom: 128px; }
          .np-final-h { max-width: 760px; }
          .np-final-p { max-width: 640px; margin: 0 0 28px; }

          @media (max-width: 900px) {
            .np-steps { grid-template-columns: 1fr 1fr; gap: 28px 28px; }
            .np-split { grid-template-columns: 1fr; }
            .np-clips { grid-template-columns: repeat(2, 1fr); }
            .np-more { grid-template-columns: 1fr; gap: 28px; }
          }
          @media (max-width: 640px) {
            .np-page > section { padding: 52px 20px; }
            .np-page > section.np-hero { padding-top: 112px; padding-bottom: 44px; }
            .np-dark-in { padding: 52px 20px; }
            .np-steps { grid-template-columns: 1fr; gap: 22px; }
            .np-step-n { font-size: 40px; margin-bottom: 8px; }
            .np-cta-row { flex-direction: column; align-items: stretch; }
            .np-btn, .np-cta-row .icp-book-btn { width: 100%; }
            .np-table, .np-table tbody, .np-table tr, .np-table th, .np-table td { display: block; width: auto !important; }
            .np-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
            .np-table tr { padding: 18px 0; border-bottom: 1px solid rgba(12,12,11,0.14); }
            .np-table tbody th, .np-table tbody td { padding: 0; border-bottom: none; }
            .np-table tbody th { font-size: 18px; display: inline-block; margin-right: 12px; }
            .np-table td:nth-child(2) { display: inline-block; vertical-align: baseline; }
            .np-table .np-price, .np-table .np-per { display: inline; }
            .np-table .np-price { font-size: 18px; }
            .np-table .np-per { margin-left: 8px; }
            .np-table td:nth-child(3) { margin-top: 8px; }
            .np-feat { padding-left: 12px !important; box-shadow: inset 4px 0 0 ${ACCENT}; }
            .np-feat th { box-shadow: none; padding-left: 0 !important; }
            .np-rows li { grid-template-columns: 34px 1fr; }
            .np-final-h { font-size: 28px; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
