/**
 * All CSS for the case study detail page, kept in one string so the page
 * component stays readable. Injected once by CaseStudyPage via <style>.
 *
 * Colour notes
 *   --cs-ink-orange is a darker orange for TEXT on cream or white. The brand
 *   orange (#E8541A) is only 3.2:1 on cream, which fails for small text, so
 *   brand orange is reserved for dark surfaces, large type, bars and borders.
 */
export const CASE_STUDY_CSS = `
.cs-root { --cs-ink-orange: #B23A0C; --cs-paper: #F8F5EF; --cs-card: #FFFFFF; --cs-line: rgba(12,12,11,0.1); background: var(--cream); color: var(--black); overflow-x: clip; }
.cs-root *, .cs-root *::before, .cs-root *::after { box-sizing: border-box; }
.cs-root :focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; border-radius: 6px; }
.cs-container { max-width: 1160px; margin: 0 auto; padding: 0 32px; }
.cs-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* Section rhythm: one padding, soft tonal alternation, dark only where it earns it. */
.cs-section { padding: 52px 0; scroll-margin-top: 130px; }
.cs-tone-cream { background: var(--cream); }
.cs-tone-paper { background: var(--cs-paper); }
.cs-section-dark { background: var(--black); color: var(--cream); }
.cs-section-head { max-width: 68ch; margin-bottom: 36px; }

/* Type */
.cs-kicker { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--cs-ink-orange); margin: 0 0 14px; }
.cs-section-dark .cs-kicker, .cs-hero .cs-kicker { color: var(--orange); }
.cs-h2 { font-family: Inter, sans-serif; font-size: clamp(27px, 3.4vw, 40px); font-weight: 800; letter-spacing: -1.4px; line-height: 1.12; margin: 0 0 18px; max-width: 26ch; text-wrap: balance; }
.cs-h2-light { color: var(--cream); }
.cs-h3 { font-family: Inter, sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.7px; line-height: 1.2; margin: 0 0 14px; max-width: 34ch; }
.cs-accent { color: var(--orange); }
.cs-ink-accent { color: var(--cs-ink-orange); }
.cs-lead { font-size: 17px; line-height: 1.68; color: var(--grey); max-width: 62ch; margin: 0; }
.cs-lead-light { color: rgba(242,238,231,0.76); }
.cs-body { font-size: 16.5px; line-height: 1.75; color: var(--grey); max-width: 68ch; margin: 0 0 18px; }
.cs-reading { border-left: 3px solid var(--orange); padding-left: 20px; margin-top: 24px; }
.cs-sub { margin-top: 48px; }
.cs-sub .cs-kicker { margin-bottom: 12px; }

/* Hero */
.cs-hero { background: var(--black); color: var(--cream); padding: 100px 0 48px; position: relative; overflow: hidden; }
.cs-hero::before { content: ""; position: absolute; top: -220px; right: -160px; width: 640px; height: 640px; border-radius: 50%; background: radial-gradient(closest-side, rgba(232,84,26,0.2), rgba(232,84,26,0)); pointer-events: none; }
.cs-hero .cs-container { position: relative; }
.cs-crumb { display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: center; font-family: Inter, sans-serif; font-size: 13px; color: rgba(242,238,231,0.62); margin-bottom: 40px; }
.cs-crumb > * { white-space: nowrap; }
.cs-crumb > [aria-current] { white-space: normal; }
.cs-crumb a { color: rgba(242,238,231,0.8); text-decoration: none; }
.cs-crumb a:hover { color: var(--orange); }
.cs-hero-grid { display: grid; grid-template-columns: minmax(0, 1.02fr) minmax(0, 1fr); gap: 56px; align-items: center; }
.cs-hero-copy { min-width: 0; }
.cs-eyebrow { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--orange); margin: 0 0 18px; }
.cs-h1 { font-family: Inter, sans-serif; font-size: clamp(36px, 4.4vw, 60px); font-weight: 800; letter-spacing: -2px; line-height: 1.04; margin: 0 0 22px; text-wrap: balance; }
.cs-summary { font-size: 17px; line-height: 1.68; color: rgba(242,238,231,0.8); max-width: 60ch; margin: 0 0 30px; }
.cs-clientbar { display: flex; flex-wrap: wrap; gap: 14px 24px; align-items: center; justify-content: space-between; border-top: 1px solid rgba(242,238,231,0.14); border-bottom: 1px solid rgba(242,238,231,0.14); padding: 18px 0; margin-bottom: 22px; }
.cs-clientbar-main { max-width: 44ch; min-width: 0; }
.cs-client-name { font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.4px; margin: 0 0 4px; }
.cs-client-tag { font-size: 14px; line-height: 1.55; color: rgba(242,238,231,0.7); margin: 0; }
.cs-verify { font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; color: var(--orange); text-decoration: none; border-bottom: 1px solid rgba(232,84,26,0.45); padding-bottom: 2px; }
.cs-verify:hover { border-bottom-color: var(--orange); }
.cs-services { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; padding: 0; margin: 0 0 30px; }
.cs-services li { font-family: Inter, sans-serif; font-size: 12.5px; font-weight: 600; color: rgba(242,238,231,0.82); border: 1px solid rgba(242,238,231,0.2); border-radius: 100px; padding: 6px 13px; }
.cs-hero-cta { display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; }
.cs-reassure { font-size: 13.5px; color: rgba(242,238,231,0.7); margin: 0; }

.cs-btn { display: inline-flex; align-items: center; justify-content: center; font-family: Inter, sans-serif; font-size: 15px; font-weight: 700; letter-spacing: -0.2px; border-radius: 100px; padding: 15px 28px; text-decoration: none; min-height: 48px; transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease, background 0.2s ease; }
.cs-btn-lg { font-size: 16.5px; padding: 18px 36px; }
.cs-btn-primary { background: var(--orange); color: #0C0C0B; }
.cs-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(232,84,26,0.34); }
.cs-btn-ghost { border: 1px solid rgba(242,238,231,0.32); color: var(--cream); }
.cs-btn-ghost:hover { border-color: var(--cream); transform: translateY(-2px); }

/* Hero visual */
.cs-hero-visual { min-width: 0; display: grid; gap: 16px; }
.cs-chartblock { border: 1px solid rgba(242,238,231,0.14); border-radius: 22px; padding: 22px 18px 18px; background: rgba(242,238,231,0.03); min-width: 0; }
.cs-chartblock .ba-frame { max-height: 560px; }
.cs-chartblock .ba-solo { max-height: 560px; overflow: hidden; }
.cs-chartblock .ba-solo img { object-fit: cover; object-position: top center; }
.cs-chart-caption { font-size: 12.5px; line-height: 1.6; color: rgba(242,238,231,0.68); margin: 14px 0 0; }
.cs-photo { margin: 0; }
.cs-photo-frame { position: relative; border-radius: 22px; overflow: hidden; aspect-ratio: 1 / 1; background: #1a1a18; border: 1px solid rgba(242,238,231,0.14); }
.cs-photo-frame img { width: 100%; height: 100%; object-fit: cover; object-position: center 22%; display: block; }
.cs-photo figcaption { font-size: 12.5px; line-height: 1.6; color: rgba(242,238,231,0.68); margin-top: 12px; }

/* Metric strip */
.cs-metrics { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: rgba(242,238,231,0.14); border: 1px solid rgba(242,238,231,0.14); border-radius: 18px; overflow: hidden; }
.cs-metrics[data-count="3"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.cs-metric { background: #131312; padding: 18px 18px 16px; min-width: 0; }
.cs-metric-value { font-family: Inter, sans-serif; font-size: clamp(22px, 2.3vw, 30px); font-weight: 800; letter-spacing: -1px; color: var(--orange); margin: 0 0 6px; line-height: 1.05; overflow-wrap: anywhere; }
.cs-metric-label { font-size: 13px; line-height: 1.45; color: rgba(242,238,231,0.9); margin: 0; }
.cs-metric-note { font-size: 12px; line-height: 1.45; color: rgba(242,238,231,0.62); margin: 6px 0 0; }

/* TL;DR */
.cs-tldr { padding: 36px 0 0; background: var(--cream); }
.cs-tldr-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.cs-tldr-card { background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 20px; padding: 22px 22px 24px; height: 100%; position: relative; overflow: hidden; }
.cs-tldr-card::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--orange); }
.cs-tldr-label { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 1.6px; text-transform: uppercase; color: var(--cs-ink-orange); margin: 0 0 10px; }
.cs-tldr-text { font-size: 15px; line-height: 1.62; color: var(--black); margin: 0; }

/* Sticky section nav (desktop only) */
.cs-secnav-wrap { position: sticky; top: 76px; z-index: 40; height: 0; pointer-events: none; display: flex; justify-content: center; align-items: flex-start; }
.cs-secnav { pointer-events: auto; margin-top: 18px; max-width: calc(100% - 64px); display: flex; gap: 4px; padding: 5px; border-radius: 100px; background: rgba(12,12,11,0.88); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: 0 10px 34px rgba(12,12,11,0.2); overflow-x: auto; scrollbar-width: none; }
.cs-secnav::-webkit-scrollbar { display: none; }
.cs-secnav a { white-space: nowrap; font-family: Inter, sans-serif; font-size: 12.5px; font-weight: 600; color: rgba(242,238,231,0.86); text-decoration: none; padding: 7px 14px; border-radius: 100px; }
.cs-secnav a:hover { background: rgba(242,238,231,0.12); color: #fff; }
.cs-secnav a:focus-visible { outline-offset: -2px; }

/* At a glance */
.cs-glance { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 40px; margin: 0; border-top: 1px solid var(--cs-line); }
.cs-glance-row { display: grid; grid-template-columns: 9.5rem minmax(0, 1fr); gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--cs-line); align-items: baseline; }
.cs-glance dt { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--black); margin: 0; }
.cs-glance dd { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--grey); overflow-wrap: anywhere; }

/* Situation */
.cs-fail-grid { list-style: none; padding: 0; margin: 40px 0 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; counter-reset: fail; }
.cs-fail-card { counter-increment: fail; background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 20px; padding: 24px 22px; height: 100%; }
.cs-fail-card::before { content: counter(fail, decimal-leading-zero); display: inline-block; font-family: ui-monospace, monospace; font-size: 13px; font-weight: 700; color: var(--cs-ink-orange); border: 1px solid rgba(178,58,12,0.35); border-radius: 8px; padding: 4px 9px; margin-bottom: 14px; }
.cs-fail-title { font-family: Inter, sans-serif; font-size: 16.5px; font-weight: 800; letter-spacing: -0.4px; margin: 0 0 8px; line-height: 1.3; }
.cs-fail-desc { font-size: 14px; line-height: 1.65; color: var(--grey); margin: 0; }

/* Workstreams */
.cs-work-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.cs-work { background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 20px; overflow: hidden; transition: box-shadow 0.25s ease, border-color 0.25s ease; }
.cs-work[open] { border-color: rgba(232,84,26,0.45); box-shadow: 0 14px 40px rgba(12,12,11,0.07); }
.cs-work-sum { list-style: none; cursor: pointer; display: grid; grid-template-columns: 44px minmax(0, 1fr) auto 28px; grid-template-areas: "num title stat chev" "num sum stat chev"; gap: 4px 18px; align-items: center; padding: 14px 22px; }
.cs-work-sum .cs-work-num { grid-area: num; align-self: start; }
.cs-work-sum .cs-work-title { grid-area: title; align-self: end; }
.cs-work-sum .cs-work-summary { grid-area: sum; align-self: start; }
.cs-work-sum .cs-stat { grid-area: stat; }
.cs-work-sum .cs-chev { grid-area: chev; }
.cs-work-sum::-webkit-details-marker { display: none; }
.cs-work-sum:hover .cs-work-title { color: var(--cs-ink-orange); }
.cs-work-sum:focus-visible { outline-offset: -3px; border-radius: 20px; }
.cs-work-num { font-family: ui-monospace, monospace; font-size: 13px; font-weight: 700; color: var(--cs-ink-orange); border: 1px solid rgba(178,58,12,0.35); border-radius: 8px; padding: 6px 0; text-align: center; }
.cs-work-title { font-family: Inter, sans-serif; font-size: 18.5px; font-weight: 800; letter-spacing: -0.6px; line-height: 1.25; margin: 0; transition: color 0.2s ease; }
.cs-work-summary { display: block; font-size: 14px; line-height: 1.55; color: var(--grey); margin: 0; max-width: 84ch; }
.cs-stat { background: var(--black); color: var(--cream); border-radius: 14px; padding: 10px 16px; width: 220px; }
.cs-stat-value { display: block; font-family: Inter, sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.8px; line-height: 1.1; color: var(--orange); overflow-wrap: anywhere; }
.cs-stat-label { display: block; font-size: 11.5px; line-height: 1.35; color: rgba(242,238,231,0.82); margin-top: 4px; }
.cs-chev { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--cs-line); position: relative; transition: transform 0.25s ease, background 0.2s ease; }
.cs-chev::before { content: ""; position: absolute; left: 50%; top: 50%; width: 7px; height: 7px; border-right: 2px solid var(--black); border-bottom: 2px solid var(--black); transform: translate(-50%, -70%) rotate(45deg); }
.cs-work[open] .cs-chev { transform: rotate(180deg); background: var(--black); }
.cs-work[open] .cs-chev::before { border-color: var(--cream); }
.cs-work-body { display: grid; grid-template-columns: minmax(0, 1fr); gap: 22px 32px; padding: 4px 22px 26px 84px; }
.cs-work-body[data-media="true"] { grid-template-columns: minmax(0, 1fr) auto; }
.cs-work-points { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; max-width: 76ch; }
.cs-work-points li { position: relative; padding-left: 20px; font-size: 14.5px; line-height: 1.68; color: var(--grey); }
.cs-work-points li::before { content: ""; position: absolute; left: 3px; top: 10px; width: 7px; height: 7px; border-radius: 50%; background: var(--orange); }
.cs-work-link { display: inline-block; margin-top: 18px; font-family: Inter, sans-serif; font-size: 13.5px; font-weight: 700; color: var(--black); text-decoration: none; border-bottom: 1px solid rgba(12,12,11,0.3); padding-bottom: 2px; }
.cs-work-link:hover { color: var(--cs-ink-orange); border-bottom-color: var(--cs-ink-orange); }
.cs-work-media { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 138px); gap: 10px; align-content: start; }
.cs-work-media figure { margin: 0; }
.cs-work-media .cs-still { aspect-ratio: 9 / 16; border-radius: 14px; overflow: hidden; border: 1px solid var(--cs-line); background: #e9e4da; }
.cs-work-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cs-work-media figcaption { font-size: 11.5px; line-height: 1.4; color: var(--grey); margin-top: 6px; }

/* Numbers */
.cs-bars-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; align-items: start; }
.cs-bars { margin: 0; background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 20px; padding: 22px 22px 20px; height: 100%; }
.cs-bars-title { font-family: Inter, sans-serif; font-size: 16px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.3; margin: 0 0 16px; }
.cs-bars-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.cs-bars-row { display: grid; grid-template-columns: minmax(3.4rem, 7.2rem) minmax(0, 1fr) auto; gap: 12px; align-items: center; font-size: 13.5px; }
.cs-bars-label { color: var(--black); line-height: 1.3; }
.cs-bars-track { height: 10px; border-radius: 100px; background: rgba(12,12,11,0.07); overflow: hidden; }
.cs-bars-fill { display: block; height: 100%; min-width: 3px; border-radius: 100px; background: var(--orange); }
.cs-bars-val { font-family: ui-monospace, monospace; font-variant-numeric: tabular-nums; font-weight: 700; color: var(--black); text-align: right; min-width: 3.2rem; }
.cs-bars-caption { font-size: 12.5px; line-height: 1.55; color: var(--grey); margin: 16px 0 0; }

.cs-table-scroll { overflow-x: auto; margin-top: 8px; border: 1px solid var(--cs-line); border-radius: 16px; background: var(--cs-card); }
.cs-table { width: 100%; min-width: 560px; border-collapse: collapse; }
.cs-table thead th { font-family: Inter, sans-serif; font-size: 11.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: var(--grey); text-align: left; padding: 12px 16px; background: rgba(12,12,11,0.035); border-bottom: 1px solid var(--cs-line); }
.cs-table tbody th, .cs-table tbody td { padding: 7px 16px; font-size: 14px; line-height: 1.5; border-bottom: 1px solid var(--cs-line); text-align: left; vertical-align: middle; }
.cs-table tbody tr:last-child th, .cs-table tbody tr:last-child td { border-bottom: none; }
.cs-table tbody th { font-family: Inter, sans-serif; font-weight: 700; color: var(--black); white-space: nowrap; }
.cs-table tbody td { color: var(--grey); }
.cs-num { font-family: ui-monospace, monospace; font-variant-numeric: tabular-nums; white-space: nowrap; }
.cs-note { font-size: 13px; }
.cs-imp { min-width: 220px; }
.cs-imp-cell { display: flex; align-items: center; gap: 12px; }
.cs-imp-num { color: var(--black); font-weight: 700; min-width: 4.2rem; }
.cs-imp-bar { display: block; flex: 1; height: 6px; border-radius: 100px; background: rgba(12,12,11,0.07); overflow: hidden; }
.cs-imp-bar i { display: block; height: 100%; min-width: 2px; background: var(--orange); border-radius: 100px; }
.cs-change { font-weight: 700; }
.cs-change-up { color: #17653D; }
.cs-change-down { color: #A23A12; }

/* Gallery, comparison, proof */
.cs-gallery { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; align-items: start; }
.cs-gal { margin: 0; }
.cs-gal img { width: 100%; height: 260px; object-fit: cover; object-position: top center; display: block; border: 1px solid var(--cs-line); border-radius: 16px; background: #fff; }
.cs-gal figcaption { font-size: 12.5px; line-height: 1.55; color: var(--grey); margin-top: 10px; }
.cs-proof { margin: 0; max-width: 880px; }
.cs-proof + .cs-proof { margin-top: 28px; }
.cs-proof img { width: 100%; height: auto; display: block; border: 1px solid var(--cs-line); border-radius: 18px; background: #fff; }
.cs-proof figcaption { font-size: 13px; line-height: 1.65; color: var(--grey); margin-top: 12px; max-width: 74ch; }

/* Mid CTA */
.cs-midcta-section { padding: 0 0 52px; background: var(--cs-paper); }
.cs-midcta { border-radius: 26px; background: var(--black); color: var(--cream); padding: 40px 44px; display: flex; flex-wrap: wrap; gap: 24px 36px; align-items: center; justify-content: space-between; position: relative; overflow: hidden; }
.cs-midcta::after { content: ""; position: absolute; right: -90px; top: -120px; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(closest-side, rgba(232,84,26,0.28), rgba(232,84,26,0)); pointer-events: none; }
.cs-midcta-text { font-size: 17px; line-height: 1.62; color: var(--cream); margin: 0; max-width: 50ch; position: relative; z-index: 1; }
.cs-midcta-actions { display: flex; flex-wrap: wrap; gap: 12px; position: relative; z-index: 1; }

/* Open problems + limits */
.cs-problems { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.cs-problem { border: 1px solid rgba(242,238,231,0.16); border-radius: 20px; background: rgba(242,238,231,0.04); padding: 22px 22px 24px; height: 100%; }
.cs-problem-head { display: flex; flex-direction: column-reverse; gap: 10px; align-items: flex-start; margin-bottom: 10px; }
.cs-problem-title { font-family: Inter, sans-serif; font-size: 16.5px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.3; margin: 0; color: var(--cream); }
.cs-status { font-family: Inter, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--orange); border: 1px solid rgba(232,84,26,0.5); border-radius: 100px; padding: 4px 11px; }
.cs-problem-detail { font-size: 14px; line-height: 1.68; color: rgba(242,238,231,0.78); margin: 0; }
.cs-limit-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.cs-limit { border: 1px dashed rgba(12,12,11,0.28); border-radius: 18px; padding: 20px 22px 22px; height: 100%; background: rgba(255,255,255,0.35); }
.cs-limit-title { font-family: Inter, sans-serif; font-size: 16px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.3; margin: 0 0 8px; }
.cs-limit-detail { font-size: 14px; line-height: 1.65; color: var(--grey); margin: 0; }

/* Close */
.cs-close { background: var(--black); color: var(--cream); padding: 68px 0; }
.cs-closelinks { display: flex; flex-wrap: wrap; gap: 14px 28px; margin-top: 40px; padding-top: 26px; border-top: 1px solid rgba(242,238,231,0.14); }
.cs-closelinks a { font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; color: rgba(242,238,231,0.86); text-decoration: none; }
.cs-closelinks a:hover { color: var(--orange); }
.cs-close-cta { display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; margin-top: 30px; }

/* Responsive */
@media (max-width: 1000px) {
  .cs-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 40px; }
  .cs-secnav-wrap { display: none; }
  .cs-tldr-grid { grid-template-columns: minmax(0, 1fr); }
  .cs-glance { grid-template-columns: minmax(0, 1fr); }
  .cs-limit-grid { grid-template-columns: minmax(0, 1fr); }
  .cs-problems { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cs-section { scroll-margin-top: 90px; }
}
@media (max-width: 760px) {
  .cs-container { padding: 0 20px; }
  .cs-section { padding: 56px 0; }
  .cs-hero { padding: 96px 0 56px; }
  .cs-crumb { margin-bottom: 28px; }
  .cs-h1 { letter-spacing: -1.3px; }
  .cs-summary { font-size: 16px; }
  .cs-chartblock { padding: 16px 12px 14px; }
  .cs-chartblock .ba-frame, .cs-chartblock .ba-solo { max-height: 440px; }
  .cs-metrics, .cs-metrics[data-count="3"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cs-metrics[data-count="3"] .cs-metric:first-child { grid-column: 1 / -1; }
  .cs-metric { padding: 16px 14px; }
  .cs-photo-frame { aspect-ratio: 4 / 4.4; }
  .cs-glance-row { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 14px 0; }
  .cs-work-sum { grid-template-columns: 38px minmax(0, 1fr) 28px; grid-template-areas: "num title chev" "num sum sum" "num stat stat"; padding: 16px 16px; gap: 6px 12px; align-items: start; }
  .cs-work-sum .cs-stat { justify-self: start; width: auto; max-width: 100%; margin-top: 6px; }
  .cs-work-sum .cs-chev { align-self: start; }
  .cs-work-num { padding: 5px 0; }
  .cs-work-body, .cs-work-body[data-media="true"] { grid-template-columns: minmax(0, 1fr); padding: 2px 16px 22px 16px; }
  .cs-work-media { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .cs-bars-grid { grid-template-columns: minmax(0, 1fr); }
  .cs-table { min-width: 480px; }
  .cs-imp { min-width: 150px; }
  .cs-proof-scroll { overflow-x: auto; border-radius: 18px; }
  .cs-proof-scroll img { min-width: 720px; }
  .cs-problems { grid-template-columns: minmax(0, 1fr); }
  .cs-gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .cs-gal img { height: 190px; }
  .cs-midcta-section { padding-bottom: 56px; }
  .cs-midcta { padding: 28px 22px; border-radius: 22px; }
  .cs-midcta-actions { width: 100%; }
  .cs-midcta-actions .cs-btn { flex: 1 1 100%; }
  .cs-close { padding: 64px 0; }
  .cs-sub { margin-top: 48px; }
}
@media (prefers-reduced-motion: reduce) {
  .cs-root * { transition: none !important; animation: none !important; }
  .cs-btn-primary:hover, .cs-btn-ghost:hover { transform: none; }
}
`;
