/**
 * CSS for the customer app sections (AppStory) and the "Part of one system"
 * card, injected by CaseStudyPage after CASE_STUDY_CSS and PRODUCT_CSS, only
 * on studies with `app` or `partOf`. Every class is prefixed wba-, so nothing
 * here can reach the other studies.
 *
 * Motion: transform and opacity only, each plays once, and the reduced-motion
 * block at the end renders the finished state.
 */
export const APP_CSS = `
/* Phone frames for the 1:2 store screenshots, uncropped */
.wba-phone { border-radius: 26px; padding: 6px; }
.wba-phone .cs-phone-screen { aspect-ratio: 1 / 2; border-radius: 20px; background: #fff; }

/* Store link */
.wba-store { display: inline-flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 18px; border-radius: 12px; font-family: Inter, sans-serif; font-size: 14.5px; font-weight: 700; text-decoration: none; transition: transform 0.25s var(--cs-ease); }
.wba-store:hover { transform: translateY(-2px); }
.wba-store-dark { color: var(--cream); border: 1px solid rgba(242,238,231,0.32); background: rgba(242,238,231,0.05); }
.wba-store-dark svg { color: var(--orange); }
.wba-store-light { color: var(--cream); background: var(--black); }
.wba-store-light svg { color: var(--orange); }
.wba-hero-store { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; margin-top: 20px; }
.wba-hero-store > span { font-size: 13px; color: rgba(242,238,231,0.6); }

/* Hero: three overlapping phones */
.wba-hero { position: relative; }
.wba-hero-phones { position: relative; max-width: 560px; margin: 0 auto; padding: 8px 0 0; }
.wba-hero-phone { filter: drop-shadow(0 30px 40px rgba(0,0,0,0.5)); }
.wba-hero-centre { position: relative; z-index: 2; width: 44%; max-width: 250px; margin: 0 auto; animation: wba-up 0.9s var(--cs-ease) both; }
.wba-hero-left, .wba-hero-right { position: absolute; top: 13%; width: 35%; max-width: 200px; z-index: 1; opacity: 0.94; }
.wba-hero-left { left: 3%; transform: rotate(-7deg); animation: wba-left 1s var(--cs-ease) 0.12s both; }
.wba-hero-right { right: 3%; transform: rotate(7deg); animation: wba-right 1s var(--cs-ease) 0.12s both; }
.wba-hero-cap { text-align: center; }
@keyframes wba-up { from { opacity: 0; transform: translate3d(0, 28px, 0); } }
@keyframes wba-left { from { opacity: 0; transform: translate3d(40px, 20px, 0) rotate(0deg); } }
@keyframes wba-right { from { opacity: 0; transform: translate3d(-40px, 20px, 0) rotate(0deg); } }

/* Source reference chips */
.wba-refs { display: inline; white-space: nowrap; }
.wba-ref { position: relative; display: inline-grid; place-items: center; min-width: 22px; height: 22px; padding: 0 5px; margin-left: 5px; border-radius: 11px; background: rgba(12,12,11,0.07); color: var(--black); font: 700 12px/1 Inter, sans-serif; text-decoration: none; vertical-align: 1px; }
.wba-ref::after { content: ""; position: absolute; inset: -11px -4px; }
.wba-ref:hover { background: var(--orange); color: #0C0C0B; }
.cs-tone-ink .wba-ref { background: rgba(242,238,231,0.12); color: var(--cream); }

/* Part of one system */
.wba-part-section { background: var(--cream); padding: 24px 0 48px; }
.wba-part { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 32px 48px; align-items: center; background: #fff; border: 1px solid var(--cs-line); border-left: 4px solid var(--orange); border-radius: 24px; padding: 32px 36px; box-shadow: 0 30px 60px -40px rgba(12,12,11,0.35); }
.wba-part-k { font: 800 12px/1.2 Inter, sans-serif; letter-spacing: 0.16em; text-transform: uppercase; color: var(--cs-ink-orange); margin: 0 0 12px; }
.wba-part-h { font-family: Inter, sans-serif; font-size: clamp(22px, 2.4vw, 30px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; margin: 0 0 12px; text-wrap: balance; }
.wba-part-body { font-size: 15.5px; line-height: 1.65; color: var(--grey); margin: 0 0 14px; max-width: 60ch; }
.wba-part-link { display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 100px; background: var(--black); color: var(--cream); font: 700 14.5px/1.2 Inter, sans-serif; text-decoration: none; transition: transform 0.25s var(--cs-ease); }
.wba-part-link:hover { transform: translateY(-2px); }
.wba-part-pair { display: grid; gap: 0; }
.wba-part-node { display: grid; gap: 3px; padding: 16px 18px; border: 1px solid var(--cs-line); border-radius: 16px; background: var(--cs-paper); font-family: Inter, sans-serif; }
.wba-part-node strong { font-size: 17px; font-weight: 800; letter-spacing: -0.015em; }
.wba-part-node > span:last-child { font-size: 13.5px; line-height: 1.45; color: var(--grey); }
.wba-part-node.is-here { background: var(--black); color: var(--cream); border-color: var(--black); }
.wba-part-node.is-here > span:last-child { color: rgba(242,238,231,0.7); }
.wba-part-tag { font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--cs-ink-orange); }
.wba-part-node.is-here .wba-part-tag { color: var(--orange); }
.wba-part-wire { position: relative; height: 40px; display: flex; align-items: center; padding-left: 44px; }
.wba-part-wire i { position: absolute; left: 26px; top: 0; bottom: 0; width: 2px; background: repeating-linear-gradient(var(--orange) 0 6px, transparent 6px 11px); }
.wba-part-wire span { font: 700 12px/1.2 Inter, sans-serif; color: var(--grey); letter-spacing: 0.02em; }

/* How the app links the business together */
.wba-flow { display: grid; gap: 18px; }
.wba-flow-hq { position: relative; border: 1px dashed rgba(232,84,26,0.55); background: rgba(232,84,26,0.06); border-radius: 20px; padding: 20px 22px; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 24px; align-items: center; }
.wba-flow-panel { grid-column: 1 / -1; font: 800 12px/1.2 Inter, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: var(--orange); margin: 0 0 4px; }
.wba-flow-hq-title { font-family: Inter, sans-serif; font-size: 18px; font-weight: 800; letter-spacing: -0.015em; color: var(--cream); margin: 0; grid-column: 1; }
.wba-flow-hq-detail { grid-column: 1; font-size: 14.5px; line-height: 1.6; color: rgba(242,238,231,0.74); margin: 4px 0 0; max-width: 70ch; }
.wba-flow-back { grid-column: 2; grid-row: 2 / span 2; display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 100px; background: var(--orange); color: #0C0C0B; font: 800 12.5px/1 Inter, sans-serif; white-space: nowrap; }
.wba-flow-steps { list-style: none; margin: 0; padding: 26px 0 8px; position: relative; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 18px; }
.wba-flow-steps::before { content: ""; position: absolute; left: 21px; right: 10%; top: 47px; height: 2px; background: linear-gradient(90deg, var(--cream), var(--orange) 30%, var(--orange) 80%, rgba(232,84,26,0.2)); transform: scaleX(0); transform-origin: left center; transition: transform 1.4s var(--cs-ease) 0.2s; }
.wba-flow.is-in .wba-flow-steps::before { transform: none; }
.wba-flow-step { position: relative; min-width: 0; }
.wba-flow-dot { position: relative; z-index: 1; display: inline-grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: var(--orange); color: #0C0C0B; font: 800 14px/1 Inter, sans-serif; box-shadow: 0 0 0 6px var(--black); }
.wba-flow-step.is-app .wba-flow-dot { background: var(--cream); }
.wba-flow-where { font: 800 12px/1.3 Inter, sans-serif; letter-spacing: 0.12em; text-transform: uppercase; color: var(--orange); margin: 16px 0 6px; }
.wba-flow-title { font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.015em; line-height: 1.3; color: var(--cream); margin: 0 0 6px; }
.wba-flow-detail { font-size: 14.5px; line-height: 1.6; color: rgba(242,238,231,0.74); margin: 0; }
.wba-flow-cat { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 24px; align-items: center; border-radius: 20px; padding: 20px 22px; background: rgba(242,238,231,0.06); border: 1px solid var(--cs-dline); }
.wba-flow-cat-title { font-family: Inter, sans-serif; font-size: 18px; font-weight: 800; letter-spacing: -0.015em; color: var(--cream); margin: 0; }
.wba-flow-cat-detail { grid-column: 1; font-size: 14.5px; line-height: 1.6; color: rgba(242,238,231,0.74); margin: 0; }
.wba-flow-cat-chips { grid-column: 2; grid-row: 1 / span 2; list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.wba-flow-cat-chips li { font: 700 12.5px/1 Inter, sans-serif; color: var(--cream); padding: 9px 12px; border-radius: 100px; border: 1px solid rgba(242,238,231,0.24); }
.wba-flow-cat-chips li:last-child { border-color: var(--orange); color: var(--orange); }
.wba-flow-more { margin: 22px 0 0; }
.wba-flow-more a { display: inline-flex; align-items: center; min-height: 44px; font: 700 15px/1.4 Inter, sans-serif; color: var(--orange); text-underline-offset: 4px; }

/* Screen by screen */
.wba-first { margin: 8px 0 24px; }
.wba-first-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; }
.wba-first-item { min-width: 0; }
.wba-first-item .wba-screen-link { display: block; max-width: 200px; }
.wba-screen-link { text-decoration: none; display: block; }
.wba-screen-num { font: 800 12px/1 Inter, sans-serif; letter-spacing: 0.14em; color: var(--cs-ink-orange); margin: 18px 0 8px; }
.wba-first-title { font-family: Inter, sans-serif; font-size: 18px; font-weight: 800; letter-spacing: -0.015em; margin: 0 0 6px; }
.wba-first-detail { font-size: 14.5px; line-height: 1.6; color: #2b2925; margin: 0 0 8px; }
.wba-first-behind { font-size: 14px; line-height: 1.6; color: var(--grey); margin: 0; }
.wba-first-behind > span:first-child { font-weight: 700; color: var(--black); }
.wba-screens { list-style: none; margin: 0; padding: 0; }
.wba-screen { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 32px 64px; align-items: center; padding: 44px 0; border-top: 1px solid var(--cs-line); }
.wba-screen.is-flip { grid-template-columns: minmax(0, 1fr) 260px; }
.wba-screen.is-flip .wba-screen-fig { order: 2; }
.wba-screen.is-flip .wba-screen-text { justify-self: end; }
.wba-screen-fig { margin: 0; min-width: 0; }
.wba-screen-text { min-width: 0; max-width: 560px; }
.wba-screen-title { font-family: Inter, sans-serif; font-size: clamp(22px, 2.4vw, 28px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; margin: 0 0 18px; }
.wba-screen-dl { margin: 0; display: grid; gap: 12px; }
.wba-screen-dl > div { padding: 16px 18px; border-radius: 16px; border: 1px solid var(--cs-line); background: #fff; }
.wba-screen-dl > div.is-behind { background: var(--black); border-color: var(--black); }
.wba-screen-dl dt { font: 800 12px/1.2 Inter, sans-serif; letter-spacing: 0.12em; text-transform: uppercase; color: var(--grey); margin: 0 0 6px; }
.wba-screen-dl dd { margin: 0; font-size: 15.5px; line-height: 1.6; color: #2b2925; }
.wba-screen-dl .is-behind dt { color: var(--orange); }
.wba-screen-dl .is-behind dd { color: rgba(242,238,231,0.86); }
.wba-screen-dl .is-behind .wba-ref { background: rgba(242,238,231,0.14); color: var(--cream); }

/* The listing card */
.wba-listing { background: #fff; border: 1px solid var(--cs-line); border-radius: 24px; padding: 28px 30px; box-shadow: 0 30px 60px -44px rgba(12,12,11,0.35); }
.wba-listing-top { display: grid; grid-template-columns: 72px minmax(0, 1fr) auto; gap: 16px 20px; align-items: center; padding-bottom: 22px; border-bottom: 1px solid var(--cs-line); }
.wba-listing-icon { width: 72px; height: 72px; border-radius: 18px; border: 1px solid var(--cs-line); display: block; }
.wba-listing-name { font-family: Inter, sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 4px; }
.wba-listing-dev { font-size: 14px; color: var(--grey); margin: 0; }
.wba-listing-facts { margin: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-bottom: 1px solid var(--cs-line); }
.wba-listing-facts > div { padding: 18px 16px 18px 0; min-width: 0; }
.wba-listing-facts dt { font: 700 12px/1.2 Inter, sans-serif; letter-spacing: 0.08em; text-transform: uppercase; color: var(--grey); margin: 0 0 6px; }
.wba-listing-facts dd { margin: 0; font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.015em; }
.wba-listing-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 40px; padding-top: 6px; }
.wba-listing-h { font-family: Inter, sans-serif; font-size: 15px; font-weight: 800; margin: 18px 0 8px; }
.wba-listing-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.wba-listing-list li { position: relative; padding-left: 20px; font-size: 14.5px; line-height: 1.55; color: #2b2925; }
.wba-listing-list li::before { content: ""; position: absolute; left: 0; top: 8px; width: 8px; height: 8px; border-radius: 50%; background: var(--orange); }
.wba-listing-list.is-safety li::before { background: #2B8A6E; }
.wba-listing-new { font-size: 14.5px; line-height: 1.6; color: #2b2925; margin: 0; }
.wba-listing-note { font-size: 13px; line-height: 1.6; color: var(--grey); margin: 22px 0 0; padding-top: 16px; border-top: 1px solid var(--cs-line); }

/* For the customer, for the business */
.wba-gains { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.wba-gains-col { border: 1px solid var(--cs-dline); background: rgba(242,238,231,0.04); border-radius: 22px; padding: 28px 26px 12px; min-width: 0; }
.wba-gains-col.is-biz { border-color: rgba(232,84,26,0.45); }
.wba-gains-h { font-family: Inter, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: var(--cream); margin: 0 0 10px; }
.wba-gains-list { list-style: none; margin: 0; padding: 0; }
.wba-gains-list > li { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 12px; padding: 16px 0; border-top: 1px solid var(--cs-dline); }
.wba-gains-num { font: 800 13px/1.6 Inter, sans-serif; color: var(--orange); }
.wba-gains-title { font-family: Inter, sans-serif; font-size: 16.5px; font-weight: 800; letter-spacing: -0.015em; color: var(--cream); margin: 0 0 4px; }
.wba-gains-detail { font-size: 14.5px; line-height: 1.6; color: rgba(242,238,231,0.74); margin: 0; }

/* Build */
.wba-steps .wb-step:last-child { padding-bottom: 8px; }
.wba-stack { max-width: 780px; }
.wba-note { font-size: 14px; line-height: 1.6; color: var(--grey); margin: 16px 0 0; max-width: 72ch; }
.wba-fit-note { margin-top: 22px; padding: 16px 18px; border-radius: 16px; background: #fff; border: 1px solid var(--cs-line); color: #2b2925; }

@media (max-width: 1000px) {
  .wba-part { grid-template-columns: minmax(0, 1fr); padding: 28px 26px; }
  .wba-flow-steps { grid-template-columns: minmax(0, 1fr); gap: 0; padding: 8px 0 0; }
  .wba-flow-steps::before { left: 20px; right: auto; top: 30px; bottom: 30px; width: 2px; height: auto; background: linear-gradient(var(--cream), var(--orange) 25%, var(--orange) 80%, rgba(232,84,26,0.2)); transform: scaleY(0); transform-origin: center top; }
  .wba-flow-step { display: grid; grid-template-columns: 42px minmax(0, 1fr); gap: 0 18px; padding: 8px 0 22px; }
  .wba-flow-dot { grid-row: 1 / span 3; }
  .wba-flow-where { margin: 4px 0 4px; }
  .wba-flow-hq, .wba-flow-cat { grid-template-columns: minmax(0, 1fr); }
  .wba-flow-back, .wba-flow-cat-chips { grid-column: 1; grid-row: auto; justify-self: start; justify-content: flex-start; margin-top: 10px; }
  .wba-listing-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wba-gains { grid-template-columns: minmax(0, 1fr); }
  .wba-screen, .wba-screen.is-flip { grid-template-columns: 220px minmax(0, 1fr); gap: 32px; }
  .wba-screen.is-flip .wba-screen-fig { order: 0; }
  .wba-screen.is-flip .wba-screen-text { justify-self: stretch; }
}
@media (max-width: 760px) {
  .wba-hero-phones { max-width: 400px; }
  .wba-part-section { padding: 16px 0 32px; }
  .wba-part { padding: 24px 20px; border-radius: 20px; }
  .wba-part-link { width: 100%; justify-content: center; text-align: center; padding: 12px 18px; }
  .wba-flow-hq, .wba-flow-cat { padding: 18px; }
  .wba-first-list { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: 20px; gap: 16px; margin: 0 -20px; padding: 0 20px 8px; scrollbar-width: none; }
  .wba-first-list::-webkit-scrollbar { display: none; }
  .wba-first-item { flex: 0 0 68%; scroll-snap-align: start; }
  .wba-first-item .wba-screen-link { max-width: 170px; }
  .wba-screen, .wba-screen.is-flip { grid-template-columns: minmax(0, 1fr); gap: 22px; padding: 36px 0; }
  .wba-screen-fig { width: 62%; max-width: 250px; margin: 0 auto; }
  .wba-listing { padding: 22px 18px; border-radius: 20px; }
  .wba-listing-top { grid-template-columns: 60px minmax(0, 1fr); }
  .wba-listing-icon { width: 60px; height: 60px; border-radius: 15px; }
  .wba-listing-top .wba-store { grid-column: 1 / -1; justify-content: center; }
  .wba-listing-cols { grid-template-columns: minmax(0, 1fr); }
  .wba-gains-col { padding: 22px 18px 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .wba-hero-centre, .wba-hero-left, .wba-hero-right { animation: none; }
  .wba-flow-steps::before { transform: none; transition: none; }
  .wba-store, .wba-part-link { transition: none; }
  .wba-store:hover, .wba-part-link:hover { transform: none; }
}
`;
