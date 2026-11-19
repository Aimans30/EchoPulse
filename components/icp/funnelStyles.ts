/**
 * One design layer for every funnel page: the five audience pages, the niche
 * pages, the service pages, /free-edits and /pilot.
 *
 * These pages had drifted into five separate systems: containers of 860, 900,
 * 1040, 1100, 1180 and 1280px, section padding anywhere from 44px to 140px,
 * H2s from 26px to 110px and four different card treatments. Side by side they
 * read as assembled rather than designed. Everything below is on an 8px grid
 * and every funnel template injects this same block, so a change here moves
 * all of them together.
 *
 *   Container   1200px max, 56px gutter (40px tablet, 24px phone, 16px at 360)
 *   Sections    128px vertical (96px tablet, 72px phone)
 *   Type        H1 60/40, H2 46/30, H3 20, lead 19/17, body 17/16, small 14,
 *               label 12 (never smaller on a phone)
 *   Radii       16px cards, 12px inputs, pill buttons
 *   Tones       ink #0C0C0B, cream #F2EEE7, paper #F8F5EF; consecutive light
 *               sections alternate cream and paper so the rhythm stays visible
 *   Motion      transform and opacity only, reveal once, gated on
 *               prefers-reduced-motion and on a real hover pointer
 *
 * globals.css forces `section { padding: 56px 20px !important }` under 768px.
 * The section rules here restate their own padding with !important at that
 * width so the 24px gutter lives on .fn-container alone and is not doubled.
 */
export const FUNNEL_CSS = `
.fn { --fn-ink: #0C0C0B; --fn-cream: #F2EEE7; --fn-paper: #F8F5EF; --fn-text: #3E3D3A; --fn-muted: #6E6B63; --fn-line: rgba(12,12,11,0.12); --fn-line-dark: rgba(242,238,231,0.14); font-family: Inter, sans-serif; color: var(--fn-ink); background: var(--fn-cream); }
.fn *, .fn *::before, .fn *::after { box-sizing: border-box; }

.fn-container { width: 100%; max-width: 1200px; margin: 0 auto; padding-left: 56px; padding-right: 56px; }
.fn-narrow { max-width: 880px; }

.fn-section { padding: 128px 0; scroll-margin-top: 96px; position: relative; }
.fn-tight-top { padding-top: 0 !important; }
.fn-ink { background: var(--fn-ink); color: #F2EEE7; }
.fn-cream { background: var(--fn-cream); color: var(--fn-ink); }
.fn-paper { background: var(--fn-paper); color: var(--fn-ink); }

/* Type */
.fn-eyebrow { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; line-height: 1.4; color: var(--fn-muted); margin: 0 0 16px; }
.fn-ink .fn-eyebrow { color: rgba(242,238,231,0.6); }
.fn-h1 { font-size: clamp(40px, 4.2vw, 60px); font-weight: 900; letter-spacing: -0.035em; line-height: 1.02; margin: 0 0 24px; text-wrap: balance; }
.fn-h2 { font-size: clamp(30px, 3.2vw, 46px); font-weight: 900; letter-spacing: -0.03em; line-height: 1.06; margin: 0; text-wrap: balance; }
.fn-h3 { font-size: 20px; font-weight: 800; letter-spacing: -0.015em; line-height: 1.3; margin: 0 0 8px; }
.fn-lead { font-size: 19px; line-height: 1.6; color: var(--fn-text); margin: 0; max-width: 60ch; }
.fn-ink .fn-lead { color: rgba(242,238,231,0.72); }
.fn-body { font-size: 17px; line-height: 1.65; color: var(--fn-text); }
.fn-ink .fn-body { color: rgba(242,238,231,0.72); }
.fn-small { font-size: 14px; line-height: 1.55; color: var(--fn-muted); }
.fn-ink .fn-small { color: rgba(242,238,231,0.55); }
.fn-prose p { font-size: 17px; line-height: 1.7; color: var(--fn-text); margin: 0 0 16px; max-width: 64ch; }
.fn-prose p:last-child { margin-bottom: 0; }
.fn-prose strong { color: var(--fn-ink); font-weight: 700; }
.fn-ink .fn-prose p { color: rgba(242,238,231,0.72); }
.fn-ink .fn-prose strong { color: #F2EEE7; }

/* Section heads: label + heading stacked, optional intro beside on desktop */
.fn-head { margin-bottom: 56px; max-width: 760px; }
.fn-head .fn-lead { margin-top: 16px; }
.fn-split { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 32px 80px; align-items: start; }
.fn-split-sticky { position: sticky; top: 112px; }

/* Buttons and asks */
.fn-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 24px; }
.fn-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 56px; padding: 0 32px; border-radius: 999px; border: 0; background: var(--fn-accent, #E8541A); color: #fff !important; font: 700 16px/1 Inter, sans-serif; text-decoration: none !important; white-space: nowrap; cursor: pointer; touch-action: manipulation; box-shadow: 0 8px 24px rgba(12,12,11,0.16); transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s; }
.fn-btn:focus-visible, .fn-textlink:focus-visible, .fn-card-link:focus-visible { outline: 3px solid var(--fn-accent, #E8541A); outline-offset: 3px; }
.fn-btn svg { flex-shrink: 0; }
.fn-textlink { display: inline-flex; align-items: center; min-height: 44px; font-size: 15px; font-weight: 600; color: inherit !important; text-decoration: underline; text-decoration-color: currentColor; text-decoration-thickness: 1px; text-underline-offset: 4px; background: none; border: 0; padding: 0; cursor: pointer; font-family: Inter, sans-serif; }
.fn-alt-ask { margin: 16px 0 0; font-size: 15px; line-height: 1.5; color: var(--fn-muted); }
.fn-ink .fn-alt-ask { color: rgba(242,238,231,0.6); }
.fn-alt-ask a, .fn-alt-ask button { color: inherit; font: inherit; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; background: none; border: 0; padding: 0; cursor: pointer; }
.fn-ink .fn-alt-ask a, .fn-ink .fn-alt-ask button { color: #F2EEE7; }
/* Inline asks sit inside a sentence, so they stay inline; vertical padding
   cancelled by a negative margin gives each a 44px tap area without moving
   the line. */
.fn-alt-ask a, .fn-alt-ask button { display: inline; padding: 12px 0; margin: -12px 0; line-height: 20px; }

/* Proof row near the hero ask */
.fn-proof { list-style: none; margin: 32px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px 24px; }
.fn-proof li { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--fn-muted); }
.fn-ink .fn-proof li { color: rgba(242,238,231,0.7); }
.fn-proof svg { flex-shrink: 0; color: var(--fn-accent, #E8541A); }

/* Cards */
.fn-card { position: relative; display: flex; flex-direction: column; height: 100%; padding: 32px; border-radius: 16px; background: rgba(255,255,255,0.62); border: 1px solid var(--fn-line); color: inherit; text-decoration: none; transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s, border-color .3s; }
.fn-paper .fn-card { background: #fff; }
.fn-ink .fn-card { background: rgba(255,255,255,0.035); border-color: var(--fn-line-dark); }
.fn-card p { margin: 0; font-size: 16px; line-height: 1.6; color: var(--fn-muted); }
.fn-ink .fn-card p { color: rgba(242,238,231,0.62); }
.fn-num { display: block; font-size: 14px; font-weight: 800; letter-spacing: 0.06em; color: var(--fn-accent, #E8541A); margin-bottom: 16px; font-variant-numeric: tabular-nums; }
.fn-grid { display: grid; gap: 16px; }
.fn-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.fn-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.fn-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.fn-span-2 { grid-column: span 2; }

/* Ruled rows (deliverables, steps) */
.fn-rows { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--fn-line); }
.fn-ink .fn-rows { border-top-color: var(--fn-line-dark); }
.fn-rows > li { display: grid; grid-template-columns: 56px minmax(0, 1fr) minmax(0, 1.4fr); gap: 8px 32px; padding: 32px 0; border-bottom: 1px solid var(--fn-line); align-items: baseline; }
.fn-ink .fn-rows > li { border-bottom-color: var(--fn-line-dark); }
.fn-rows .fn-num { margin: 0; }
.fn-rows .fn-h3 { margin: 0; }
.fn-rows p { margin: 0; font-size: 16px; line-height: 1.65; color: var(--fn-muted); }
.fn-ink .fn-rows p { color: rgba(242,238,231,0.66); }
.fn-rows-2 > li { grid-template-columns: 56px minmax(0, 1fr); }
.fn-rows-2 > li > div > p { margin-top: 8px; }

/* Accordions: native <details>, so every answer is in the served HTML */
.fn-faq { border-top: 1px solid var(--fn-line); }
.fn-faq details { border-bottom: 1px solid var(--fn-line); }
.fn-faq summary { list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 64px; padding: 20px 0; cursor: pointer; font-size: 18px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.4; color: var(--fn-ink); touch-action: manipulation; }
.fn-faq summary::-webkit-details-marker { display: none; }
.fn-faq summary:focus-visible { outline: 3px solid var(--fn-accent, #E8541A); outline-offset: 2px; }
.fn-faq summary::after { content: ''; flex: 0 0 32px; height: 32px; border-radius: 50%; border: 1px solid var(--fn-line); background: linear-gradient(currentColor, currentColor) center / 12px 2px no-repeat, linear-gradient(currentColor, currentColor) center / 2px 12px no-repeat; transition: transform .3s cubic-bezier(.16,1,.3,1), background-color .2s; }
.fn-faq details[open] summary::after { transform: rotate(45deg); }
.fn-faq details > div { padding: 0 56px 24px 0; }
.fn-faq details > div p { margin: 0 0 12px; font-size: 16px; line-height: 1.7; color: var(--fn-text); max-width: 68ch; }
.fn-faq details > div p:last-child { margin-bottom: 0; }

/* Comparison table */
.fn-cmp { border: 1px solid var(--fn-line); border-radius: 16px; overflow: hidden; background: rgba(255,255,255,0.62); }
.fn-paper .fn-cmp { background: #fff; }
.fn-ink .fn-cmp { background: rgba(255,255,255,0.03); border-color: var(--fn-line-dark); }
.fn-cmp-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1.3fr); border-top: 1px solid var(--fn-line); }
.fn-ink .fn-cmp-row { border-top-color: var(--fn-line-dark); }
.fn-cmp-row:first-child { border-top: 0; }
.fn-cmp-row > div { padding: 16px 24px; font-size: 15px; line-height: 1.5; display: flex; gap: 8px; align-items: flex-start; }
.fn-cmp-row > div + div { border-left: 1px solid var(--fn-line); }
.fn-ink .fn-cmp-row > div + div { border-left-color: var(--fn-line-dark); }
.fn-cmp-feature { font-weight: 700; }
.fn-cmp-them { color: var(--fn-muted); }
.fn-ink .fn-cmp-them { color: rgba(242,238,231,0.5); }
.fn-cmp-head > div { font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; padding-top: 16px; padding-bottom: 16px; }
.fn-cmp-head { background: rgba(12,12,11,0.03); }
.fn-ink .fn-cmp-head { background: rgba(255,255,255,0.03); }
.fn-cmp-mark { flex-shrink: 0; font-weight: 900; width: 16px; }

/* Final ask band */
.fn-final { text-align: center; }
.fn-final .fn-h2 { max-width: 18ch; margin: 0 auto; }
.fn-final .fn-lead { margin: 24px auto 0; }
.fn-final .fn-actions { justify-content: center; margin-top: 40px; }
.fn-final .fn-alt-ask { text-align: center; }
.fn-byline { margin: 64px 0 0; font-size: 13px; line-height: 1.5; color: rgba(242,238,231,0.5); }
.fn-byline a { color: rgba(242,238,231,0.78); text-decoration: underline; text-underline-offset: 3px; }

/* The shared guides block (components/GuidesSection.tsx) brings its own
   1180px container and 72px rhythm. On funnel pages it is pulled onto this
   grid from the outside, so its left edge lines up with every other section. */
.fn .guides-section { padding: 128px 0 !important; }
.fn .guides-section > div { max-width: 1200px !important; padding: 0 56px; }
.fn .guides-section .gd-eyebrow { font-size: 12px !important; letter-spacing: 0.14em !important; margin-bottom: 16px !important; }
.fn .guides-section h2 { font-size: clamp(30px, 3.2vw, 46px) !important; letter-spacing: -0.03em !important; margin-bottom: 16px !important; }
.fn .guides-section ul { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 16px !important; margin-top: 40px !important; }
.fn .guides-section ul a { padding: 24px !important; }
.fn .guides-section .gd-excerpt { font-size: 15px !important; margin-top: 8px; }
.fn .guides-section .gd-more { font-size: 14px !important; margin-top: 16px !important; }

/* The shared pricing block's region note is 10.5px inline; funnel pages
   hold it to the 12px label floor. */
.fn .pricing-region, .fn section#pricing .pricing-region { font-size: 12px !important; }

/* Hover lift, only where there is a real pointer and motion is welcome */
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .fn-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(12,12,11,0.22); }
  a.fn-card:hover, .fn-card-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(12,12,11,0.10); }
  .fn-ink a.fn-card:hover { box-shadow: 0 16px 40px rgba(0,0,0,0.4); border-color: rgba(242,238,231,0.26); }
}

@media (max-width: 1024px) {
  .fn-container { padding-left: 40px; padding-right: 40px; }
  .fn-section { padding: 96px 0; }
  .fn-split { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  .fn-split-sticky { position: static; }
  .fn-grid-3, .fn-grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .fn-rows > li { grid-template-columns: 48px minmax(0, 1fr); }
  .fn-rows > li > p { grid-column: 2; }
  .fn .guides-section { padding: 96px 0 !important; }
  .fn .guides-section > div { padding: 0 40px; }
  .fn .guides-section ul { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
}
@media (max-width: 768px) {
  .fn-section { padding: 72px 0 !important; }
  .fn-section.fn-tight-top { padding-top: 0 !important; }
  .fn-container { padding-left: 24px; padding-right: 24px; }
  .fn-head { margin-bottom: 40px; }
  .fn-lead { font-size: 17px; }
  .fn-body, .fn-prose p { font-size: 16px; }
  .fn-grid-2, .fn-grid-3, .fn-grid-4 { grid-template-columns: minmax(0, 1fr); }
  .fn-span-2 { grid-column: auto; }
  .fn-card { padding: 24px; }
  .fn-rows > li { grid-template-columns: 40px minmax(0, 1fr); padding: 24px 0; }
  .fn-actions { flex-direction: column; align-items: stretch; }
  .fn-actions .fn-btn, .fn-actions .icp-book-btn { width: 100%; }
  .fn-faq summary { font-size: 17px; }
  .fn-faq details > div { padding-right: 0; }
  .fn-cmp-row { grid-template-columns: minmax(0, 1fr); }
  .fn-cmp-row > div + div { border-left: 0; padding-top: 0; }
  .fn-cmp-row > .fn-cmp-feature { padding-bottom: 8px; }
  .fn-cmp-head { display: none; }
  .fn-cmp-row:nth-child(2) { border-top: 0; }
  .fn-byline { margin-top: 48px; }
  .fn .guides-section { padding: 72px 0 !important; }
  .fn .guides-section > div { padding: 0 24px; }
  .fn .guides-section ul { grid-template-columns: minmax(0, 1fr) !important; margin-top: 32px !important; }
}
@media (max-width: 374px) {
  .fn-container { padding-left: 16px; padding-right: 16px; }
  .fn .guides-section > div { padding: 0 16px; }
  .fn-btn { padding: 0 20px; font-size: 15px; }
}
`;

/** Small check mark used in proof rows and lists. */
export const CHECK_PATH = 'M20 6L9 17l-5-5';
export const ARROW_PATH = 'M5 12h14M12 5l7 7-7 7';
