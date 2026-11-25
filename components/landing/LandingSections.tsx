import Link from 'next/link';
import ICPBookButton from '@/components/icp/ICPBookButton';
import { BOOK_CALL_LABEL, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';
import type { LandingPage } from '@/lib/landingPages';

/**
 * Server-rendered middle sections for the search landing pages. Everything
 * a crawler or an AI answer needs (the direct answer, the price table, what
 * is and is not included, the FAQ) is in the HTML on first load.
 *
 * Tracking: every ask carries `data-track-location="<track>_<where>"`, and
 * book_call_click / booking_confirmed already report the page path, so a
 * booking from these pages shows in GA4 as booked_from = this path.
 */

const ACCENT = '#E8541A';

function Asks({ page, where }: { page: LandingPage; where: string }) {
  return (
    <div className="lp-asks">
      <ICPBookButton label={BOOK_CALL_LABEL} location={`${page.track}_${where}_book`} accent={ACCENT} className="lp-btn" />
      <a href={FREE_EDITS_URL} className="lp-btn-o" data-track-location={`${page.track}_${where}_free_edits`}>
        {FREE_EDITS_LABEL}
      </a>
    </div>
  );
}

export function LandingIntro({ page }: { page: LandingPage }) {
  const c = page.compare;
  return (
    <>
      <style>{CSS}</style>

      {/* The direct answer: the first thing an AI answer or a skimmer needs. */}
      <section className="lp-sec lp-answer" aria-labelledby="lp-answer-h">
        <div className="lp-wrap lp-narrow">
          <p className="lp-eyebrow">The short answer</p>
          <h2 id="lp-answer-h" className="lp-h2">{page.answer.question}</h2>
          {page.answer.text.map((t, i) => (
            <p key={i} className={i === 0 ? 'lp-lede' : 'lp-p'}>{t}</p>
          ))}
        </div>
      </section>

      {/* What you get. */}
      <section className="lp-sec" aria-labelledby="lp-get-h">
        <div className="lp-wrap">
          <p className="lp-eyebrow">{page.getEyebrow}</p>
          <h2 id="lp-get-h" className="lp-h2 lp-h2-wide">{page.getHeading}</h2>
          <ol className="lp-gets">
            {page.gets.map((g, i) => (
              <li key={g.title} className="lp-card">
                <span className="lp-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="lp-h3">{g.title}</h3>
                <p className="lp-p">{g.body}</p>
              </li>
            ))}
          </ol>
          <div className="lp-not">
            <h3 className="lp-h3">Not included, so nobody is surprised</h3>
            <ul>
              {page.notIncluded.map((n) => <li key={n}>{n}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* Comparison table with sources. */}
      <section className="lp-sec lp-compare" aria-labelledby="lp-compare-h">
        <div className="lp-wrap">
          <p className="lp-eyebrow">Compared on published prices</p>
          <h2 id="lp-compare-h" className="lp-h2 lp-h2-wide">{c.question}</h2>
          <p className="lp-p lp-intro">{c.intro}{c.checked ? ` Read on ${c.checked}.` : ''}</p>
          <div className="lp-table-wrap" role="region" aria-labelledby="lp-compare-h" tabIndex={0}>
            <table className="lp-table">
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Best for</th>
                  <th scope="col">What you get</th>
                  <th scope="col">Published price</th>
                  <th scope="col">Minimum term</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r) => (
                  <tr key={r.name} className={r.ours ? 'lp-ours' : undefined}>
                    <th scope="row">
                      {r.href ? <a href={r.href} target="_blank" rel="noopener nofollow">{r.name}</a> : r.name}
                      {r.ours && <span className="lp-tag">Us</span>}
                    </th>
                    <td data-label="Best for">{r.bestFor}</td>
                    <td data-label="What you get">{r.what}</td>
                    <td data-label="Published price" className="lp-price">{r.price}</td>
                    <td data-label="Minimum term">{r.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="lp-small">{c.note}</p>
          <Asks page={page} where="compare" />
        </div>
      </section>
    </>
  );
}

export function LandingDetails({ page }: { page: LandingPage }) {
  return (
    <>
      {/* How it runs. */}
      <section className="lp-sec" aria-labelledby="lp-steps-h">
        <div className="lp-wrap">
          <p className="lp-eyebrow">How it runs</p>
          <h2 id="lp-steps-h" className="lp-h2 lp-h2-wide">One call a week. Everything else is on us.</h2>
          <ol className="lp-steps">
            {page.steps.map((s, i) => (
              <li key={s.title}>
                <span className="lp-step-n" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="lp-h3">{s.title}</h3>
                  <p className="lp-p">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Proof that can be checked. */}
      <section className="lp-sec lp-proof" aria-labelledby="lp-proof-h">
        <div className="lp-wrap">
          <p className="lp-eyebrow">Proof</p>
          <h2 id="lp-proof-h" className="lp-h2 lp-h2-wide">{page.proofHeading}</h2>
          <div className="lp-proof-grid">
            {page.proof.map((p) => (
              <article key={p.href} className="lp-card lp-proof-card">
                <p className="lp-label">{p.label}</p>
                <h3 className="lp-h3">{p.title}</h3>
                <p className="lp-p">{p.body}</p>
                <Link href={p.href} className="lp-link" data-track-location={`${page.track}_proof`}>{p.link}</Link>
              </article>
            ))}
          </div>
          <p className="lp-small">{page.proofNote}</p>
        </div>
      </section>

      {/* Fit. */}
      <section className="lp-sec" aria-labelledby="lp-fit-h">
        <div className="lp-wrap">
          <p className="lp-eyebrow">Fit</p>
          <h2 id="lp-fit-h" className="lp-h2 lp-h2-wide">Who this is for, and who it is not for</h2>
          <div className="lp-fit">
            <div className="lp-card">
              <h3 className="lp-h3">A good fit if</h3>
              <ul className="lp-ticks">{page.forYou.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
            <div className="lp-card lp-card-muted">
              <h3 className="lp-h3">Not a fit if</h3>
              <ul className="lp-crosses">{page.notForYou.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ: visible, and the same text is in the FAQPage schema. */}
      <section className="lp-sec" aria-labelledby="lp-faq-h">
        <div className="lp-wrap lp-narrow">
          <p className="lp-eyebrow">Questions</p>
          <h2 id="lp-faq-h" className="lp-h2">{page.faqHeading}</h2>
          <div className="lp-faq">
            {page.faq.map((f) => (
              <div key={f.q} className="lp-faq-item">
                <h3 className="lp-faq-q">{f.q}</h3>
                <p className="lp-p">{f.a}</p>
              </div>
            ))}
          </div>
          <Asks page={page} where="faq" />
        </div>
      </section>
    </>
  );
}

const CSS = `
.lp-sec { padding: 96px 56px; background: #F2EEE7; color: #0C0C0B; }
.lp-sec + .lp-sec { padding-top: 24px; }
.lp-wrap { max-width: 1168px; margin: 0 auto; }
.lp-narrow { max-width: 780px; }
.lp-eyebrow { font-size: 10px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: #6E6B63; margin: 0 0 14px; display: flex; align-items: center; gap: 10px; }
.lp-eyebrow::before { content: ''; width: 18px; height: 1px; background: ${ACCENT}; }
.lp-h2 { font-family: Inter, sans-serif; font-size: clamp(28px, 3.4vw, 44px); font-weight: 900; letter-spacing: -0.035em; line-height: 1.08; margin: 0 0 22px; }
.lp-h2-wide { max-width: 860px; }
.lp-h3 { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25; margin: 0 0 8px; }
.lp-lede { font-size: clamp(18px, 1.6vw, 21px); line-height: 1.6; color: #0C0C0B; margin: 0 0 16px; font-weight: 500; }
.lp-p { font-size: 15.5px; line-height: 1.68; color: #4A4740; margin: 0; }
.lp-intro { max-width: 760px; margin-bottom: 28px; }
.lp-small { font-size: 13px; color: #6E6B63; margin: 18px 0 0; line-height: 1.55; }
.lp-answer .lp-wrap { background: rgba(255,255,255,0.62); border: 1px solid rgba(255,255,255,0.9); border-radius: 28px; padding: 44px 48px; box-shadow: 0 18px 60px rgba(12,12,11,0.06), inset 0 1px 0 #fff; }
.lp-gets { list-style: none; padding: 0; margin: 8px 0 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.lp-card { background: rgba(255,255,255,0.6); border: 1px solid rgba(12,12,11,0.08); border-radius: 22px; padding: 26px 26px 28px; box-shadow: 0 6px 24px rgba(12,12,11,0.04), inset 0 1px 0 rgba(255,255,255,0.95); min-width: 0; }
.lp-card-muted { background: rgba(12,12,11,0.03); }
.lp-num { display: inline-block; font-size: 12px; font-weight: 900; color: ${ACCENT}; letter-spacing: 1px; margin-bottom: 18px; }
.lp-not { margin-top: 18px; border: 1px dashed rgba(12,12,11,0.2); border-radius: 22px; padding: 22px 26px; }
.lp-not ul { margin: 6px 0 0; padding-left: 18px; color: #4A4740; font-size: 15px; line-height: 1.7; }
.lp-table-wrap { overflow-x: auto; border-radius: 22px; border: 1px solid rgba(12,12,11,0.1); background: rgba(255,255,255,0.7); }
.lp-table-wrap:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 3px; }
.lp-table { width: 100%; border-collapse: collapse; font-size: 14.5px; min-width: 820px; }
.lp-table th, .lp-table td { text-align: left; padding: 16px 18px; border-bottom: 1px solid rgba(12,12,11,0.08); vertical-align: top; line-height: 1.5; }
.lp-table thead th { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #6E6B63; font-weight: 800; background: rgba(12,12,11,0.03); }
.lp-table tbody tr:last-child th, .lp-table tbody tr:last-child td { border-bottom: none; }
.lp-table tbody th { font-weight: 800; color: #0C0C0B; min-width: 170px; }
.lp-table tbody th a { color: #0C0C0B; text-decoration: underline; text-decoration-color: rgba(12,12,11,0.25); text-underline-offset: 3px; }
.lp-table tbody th a:hover { color: #C9440F; }
.lp-price { font-weight: 800; color: #0C0C0B; white-space: nowrap; }
.lp-ours { background: rgba(232,84,26,0.07); }
.lp-tag { display: inline-block; margin-left: 8px; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #fff; background: #0C0C0B; padding: 3px 8px; border-radius: 100px; vertical-align: 2px; }
.lp-asks { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 30px; align-items: center; }
.lp-btn { background: #0C0C0B; color: #F2EEE7 !important; border: none; padding: 15px 28px; border-radius: 100px; font: 700 14px Inter, sans-serif; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; transition: background .25s, transform .25s; min-height: 48px; }
.lp-btn:hover { background: ${ACCENT}; transform: translateY(-1px); }
.lp-btn-o { display: inline-flex; align-items: center; min-height: 48px; padding: 0 26px; border-radius: 100px; border: 1px solid rgba(12,12,11,0.16); color: #0C0C0B; font: 700 14px Inter, sans-serif; text-decoration: none; transition: background .25s, color .25s; }
.lp-btn-o:hover { background: #0C0C0B; color: #F2EEE7; }
.lp-steps { list-style: none; padding: 0; margin: 8px 0 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; counter-reset: s; }
.lp-steps li { display: flex; flex-direction: column; gap: 16px; background: rgba(255,255,255,0.6); border: 1px solid rgba(12,12,11,0.08); border-radius: 22px; padding: 24px; }
.lp-step-n { width: 36px; height: 36px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; }
.lp-proof-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 8px; }
.lp-proof-card { display: flex; flex-direction: column; }
.lp-proof-card .lp-p { flex: 1; margin-bottom: 18px; }
.lp-label { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #C9440F; margin: 0 0 12px; }
.lp-link { color: #0C0C0B; font-weight: 700; font-size: 14.5px; text-decoration: underline; text-decoration-color: ${ACCENT}; text-underline-offset: 4px; min-height: 44px; display: inline-flex; align-items: center; }
.lp-link:hover { color: #C9440F; }
.lp-fit { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 8px; }
.lp-ticks, .lp-crosses { list-style: none; padding: 0; margin: 10px 0 0; display: grid; gap: 12px; }
.lp-ticks li, .lp-crosses li { position: relative; padding-left: 30px; font-size: 15.5px; line-height: 1.6; color: #2C2A26; }
.lp-ticks li::before, .lp-crosses li::before { position: absolute; left: 0; top: 2px; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; }
.lp-ticks li::before { content: '\\2713'; background: ${ACCENT}; color: #fff; }
.lp-crosses li::before { content: '\\2715'; background: rgba(12,12,11,0.12); color: #0C0C0B; }
.lp-faq { border-top: 1px solid rgba(12,12,11,0.12); margin-top: 8px; }
.lp-faq-item { padding: 22px 0; border-bottom: 1px solid rgba(12,12,11,0.12); }
.lp-faq-q { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 8px; }
@media (max-width: 1000px) {
  .lp-gets, .lp-proof-grid { grid-template-columns: 1fr 1fr; }
  .lp-steps { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 760px) {
  .lp-sec { padding: 64px 16px; }
  .lp-sec + .lp-sec { padding-top: 16px; }
  .lp-answer .lp-wrap { padding: 28px 22px; border-radius: 22px; }
  .lp-gets, .lp-proof-grid, .lp-steps, .lp-fit { grid-template-columns: 1fr; }
  .lp-asks { flex-direction: column; align-items: stretch; }
  .lp-btn, .lp-btn-o { justify-content: center; width: 100%; }
  /* The table becomes one card per service on phones: no sideways scroll. */
  .lp-table-wrap { overflow: visible; border: none; background: none; }
  .lp-table { min-width: 0; }
  .lp-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .lp-table, .lp-table tbody, .lp-table tr, .lp-table th, .lp-table td { display: block; width: 100%; }
  .lp-table tr { background: rgba(255,255,255,0.7); border: 1px solid rgba(12,12,11,0.1); border-radius: 18px; margin-bottom: 12px; padding: 6px 0; }
  .lp-table tr.lp-ours { background: #FBEDE5; }
  .lp-table tbody th { font-size: 16px; padding: 14px 18px 8px; border: none; }
  .lp-table td { border: none; padding: 6px 18px; }
  .lp-table td::before { content: attr(data-label); display: block; font-size: 10.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: #6E6B63; margin-bottom: 2px; }
  .lp-table tbody tr:last-child td:last-child, .lp-table td:last-child { padding-bottom: 14px; }
}
`;
