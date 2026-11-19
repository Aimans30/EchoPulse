/**
 * CSS for the software-build sections (ProductStory), injected by
 * CaseStudyPage after CASE_STUDY_CSS and only on studies with `product`.
 * Every class is prefixed wb- or scoped to [data-count="5"], so nothing here
 * can reach the other studies.
 *
 * Same rules as the base sheet: transform and opacity only, every animation
 * plays once, and the reduced-motion block in the base sheet already turns
 * all transitions and animations off under .cs-root.
 */
export const PRODUCT_CSS = `
/* Five stat tiles */
@media (min-width: 1001px) {
  .cs-stats[data-count="5"] { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .cs-stats[data-count="5"] .cs-stat { padding-right: 20px; }
  .cs-stats[data-count="5"] .cs-stat + .cs-stat { padding-left: 24px; }
}
@media (max-width: 1000px) {
  .cs-stats[data-count="5"] .cs-stat:nth-child(5) { grid-column: 1 / -1; }
}

/* Hero: product screen with a phone over it */
.wb-hero-stage { position: relative; padding-bottom: 8px; }
.wb-hero-shot { width: 90%; margin-left: auto; }
.wb-hero-phone { position: absolute; left: 0; bottom: 44px; width: 26%; max-width: 172px; z-index: 2; filter: drop-shadow(0 30px 40px rgba(0,0,0,0.55)); }
.wb-hero-cap { padding-left: 30%; }

/* Rails: a grid on desktop, a swipeable row on phones */
.wb-rail { list-style: none; margin: 0; padding: 0; }
.wb-rail > li { min-width: 0; }
.wb-swipe-hint { display: none; }

/* Challenge */
.wb-challenge { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.wb-challenge-card { background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 22px; padding: 28px 26px 30px; min-width: 0; }
.wb-challenge-card.is-pain { background: var(--black); color: var(--cream); border-color: transparent; }
.wb-challenge-num { font: 700 12.5px/1 ui-monospace, monospace; color: var(--cs-ink-orange); }
.is-pain .wb-challenge-num { color: var(--orange); }
.wb-challenge-title { font-family: Inter, sans-serif; font-size: 21px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; margin: 16px 0 12px; }
.wb-challenge-body { font-size: 15.5px; line-height: 1.7; color: #3d3a34; margin: 0; }
.is-pain .wb-challenge-body { color: rgba(242,238,231,0.8); }

/* Outlet map */
.wb-map-grid { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 36px; align-items: start; }
.wb-map { margin: 0; min-width: 0; }
.wb-map-stage { position: relative; border-radius: 22px; overflow: hidden; border: 1px solid var(--cs-dline); background: #151513; aspect-ratio: 1600 / 1055; }
.wb-map-canvas { position: absolute; inset: 0; }
.wb-map-canvas, .wb-map-canvas > img { max-width: none !important; }
.wb-map-img { display: block; width: 100%; height: 100%; object-fit: cover; }
.wb-map-stage::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(60% 70% at 32% 55%, transparent 40%, rgba(12,12,11,0.45)); }
.wb-pin { position: absolute; width: 0; height: 0; z-index: 2; }
.wb-pin > *, .wb-ref > * { max-width: none !important; }
.wb-pin-dot { position: absolute; left: -15px; top: -15px; width: 30px; height: 30px; border-radius: 50%; background: var(--orange); color: #0C0C0B; display: grid; place-items: center; font: 800 13px/1 Inter, sans-serif; box-shadow: 0 0 0 6px rgba(232,84,26,0.22), 0 10px 22px rgba(0,0,0,0.55); }
.wb-pin-label { position: absolute; top: -15px; height: 30px; display: inline-flex; align-items: center; white-space: nowrap; padding: 0 12px; border-radius: 100px; background: rgba(12,12,11,0.88); border: 1px solid rgba(242,238,231,0.18); color: var(--cream); font: 700 13px/1 Inter, sans-serif; }
.wb-pin-right .wb-pin-label { left: 24px; }
.wb-pin-left .wb-pin-label { right: 24px; }
.cs-rise.is-in .wb-pin-dot { animation: wb-drop 0.7s cubic-bezier(0.16,1,0.3,1) both; animation-delay: inherit; }
.cs-rise.is-in .wb-pin-label { animation: wb-fade 0.6s ease both; animation-delay: inherit; }
.cs-rise.is-in .wb-pin { animation-fill-mode: both; }
@keyframes wb-drop { from { opacity: 0; transform: translate3d(0, -16px, 0) scale(0.6); } to { opacity: 1; transform: none; } }
@keyframes wb-fade { from { opacity: 0; transform: translate3d(0, 4px, 0); } to { opacity: 1; transform: none; } }
.wb-ref { position: absolute; width: 0; height: 0; z-index: 1; }
.wb-ref i { position: absolute; left: -6px; top: -6px; width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(242,238,231,0.55); background: #151513; }
.wb-ref em { position: absolute; top: 12px; left: 0; transform: translateX(-50%); white-space: nowrap; font: 600 12px/1.2 Inter, sans-serif; font-style: normal; color: rgba(242,238,231,0.62); }
.wb-map-cap { font-size: 13px; line-height: 1.6; color: rgba(242,238,231,0.6); margin: 14px 0 0; }
.wb-map-cap a { color: var(--orange); font-weight: 700; }
.wb-outlets { list-style: none; margin: 0; padding: 0; display: grid; border-top: 1px solid var(--cs-dline); }
.wb-outlet { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 14px; padding: 22px 0 14px; border-bottom: 1px solid var(--cs-dline); }
.wb-outlet-num { width: 30px; height: 30px; border-radius: 50%; background: var(--orange); color: #0C0C0B; display: grid; place-items: center; font: 800 13px/1 Inter, sans-serif; }
.wb-outlet-name { font-family: Inter, sans-serif; font-size: 18px; font-weight: 800; letter-spacing: -0.015em; line-height: 1.3; margin: 2px 0 6px; color: var(--cream); }
.wb-outlet-addr { font-size: 14.5px; line-height: 1.55; color: rgba(242,238,231,0.74); margin: 0 0 4px; }
.wb-outlet-meta { font-size: 13px; color: rgba(242,238,231,0.55); margin: 0; }
.wb-outlet-link { display: inline-flex; align-items: center; gap: 0.3em; min-height: 44px; font: 700 14px Inter, sans-serif; color: var(--orange); text-decoration: none; }
.wb-outlet-link:hover { text-decoration: underline; text-underline-offset: 4px; }

/* System diagram */
.wb-sys-top { display: flex; align-items: flex-start; gap: 18px; background: var(--black); color: var(--cream); border-radius: 22px; padding: 24px 26px; position: relative; overflow: hidden; }
.wb-sys-top::before { content: ""; position: absolute; inset: 0; background: radial-gradient(50% 120% at 0% 0%, rgba(232,84,26,0.2), transparent 70%); pointer-events: none; }
.wb-sys-top > * { position: relative; }
.wb-sys-icon { flex: none; width: 46px; height: 46px; border-radius: 14px; background: rgba(232,84,26,0.16); color: var(--orange); display: grid; place-items: center; }
.wb-sys-top-name { font-family: Inter, sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -0.015em; margin: 2px 0 6px; }
.wb-sys-top-body { font-size: 15px; line-height: 1.62; color: rgba(242,238,231,0.76); margin: 0; max-width: 78ch; }
.wb-sys-key { flex: none; margin-left: auto; font: 700 12px/1 ui-monospace, monospace; color: rgba(242,238,231,0.82); border: 1px solid rgba(242,238,231,0.22); border-radius: 8px; padding: 8px 10px; }
.wb-sys-wires { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; height: 34px; }
.wb-sys-wires i { justify-self: center; width: 2px; height: 100%; background: linear-gradient(var(--orange), rgba(232,84,26,0.18)); transform: scaleY(0); transform-origin: top; transition: transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s; }
.cs-rise.is-in .wb-sys-wires i { transform: none; }
.wb-sys-cols { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.wb-sys-col { background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 18px; padding: 22px 20px 12px; min-width: 0; }
.wb-sys-hq { background: #1b1b19; color: var(--cream); border-color: transparent; }
.wb-sys-panel { display: none; font: 800 12px/1.2 Inter, sans-serif; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cs-ink-orange); margin: 0 0 8px; }
.wb-sys-hq .wb-sys-panel { color: var(--orange); }
.wb-sys-name { font-family: Inter, sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; }
.wb-sys-items { list-style: none; margin: 0; padding: 0; }
.wb-sys-items li { padding: 10px 0; border-top: 1px solid var(--cs-line); font-size: 14.5px; line-height: 1.45; color: #3d3a34; }
.wb-sys-hq .wb-sys-items li { border-color: var(--cs-dline); color: rgba(242,238,231,0.82); }
.wb-sys-brackets { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-top: 14px; }
.wb-sys-bracket { position: relative; padding-top: 16px; text-align: center; font: 700 13px/1.3 Inter, sans-serif; color: var(--grey); }
.wb-sys-bracket::before { content: ""; position: absolute; top: 0; left: 8px; right: 8px; height: 9px; border: 1.5px solid rgba(12,12,11,0.25); border-top: 0; border-radius: 0 0 10px 10px; }
.wb-sys-bracket-store { grid-column: 1 / 4; }
.wb-sys-bracket-hq { grid-column: 4; }

/* Screenshot tour */
.wb-tour { display: grid; gap: 80px; }
.wb-tour-head { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 16px; align-items: baseline; margin-bottom: 26px; padding-top: 22px; border-top: 1px solid var(--cs-line); }
.wb-tour-num { font: 700 13px/1 ui-monospace, monospace; color: var(--cs-ink-orange); }
.wb-tour-name { font-family: Inter, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; margin: 0; }
.wb-tour-sum { grid-column: 2; font-size: 15.5px; line-height: 1.6; color: var(--grey); margin: 0; }
.wb-tour-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 44px 28px; }
.wb-screen { margin: 0; }
.wb-screen-link { display: block; border-radius: 14px; transition: transform 0.45s cubic-bezier(0.16,1,0.3,1); }
.wb-screen-link:hover { transform: translate3d(0, -4px, 0); }
.wb-screen-link:focus-visible { outline-offset: 4px; }
.wb-screen-title { font-family: Inter, sans-serif; font-size: 18px; font-weight: 800; letter-spacing: -0.015em; margin: 20px 0 10px; }
.wb-screen-points { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.wb-screen-points li { position: relative; padding-left: 20px; font-size: 14.5px; line-height: 1.6; color: #3d3a34; }
.wb-screen-points li::before { content: ""; position: absolute; left: 2px; top: 10px; width: 8px; height: 2px; background: var(--orange); }
.wb-points-light li { color: rgba(242,238,231,0.78); font-size: 15px; }

/* Brighty */
.wb-queries { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; }
.wb-query { display: flex; flex-direction: column; align-items: center; text-align: center; }
.wb-query-bubble { margin: 0 0 20px; padding: 11px 18px; border-radius: 20px 20px 6px 20px; background: var(--orange); color: #0C0C0B; font: 700 16px/1.3 Inter, sans-serif; letter-spacing: -0.01em; box-shadow: 0 14px 30px rgba(232,84,26,0.22); }
.wb-query-phone { width: 80%; max-width: 250px; }
.wb-query-what { font-size: 14.5px; line-height: 1.62; color: rgba(242,238,231,0.72); margin: 20px 0 0; max-width: 34ch; }
.wb-caps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.wb-cap { border: 1px solid rgba(242,238,231,0.14); border-radius: 18px; background: rgba(242,238,231,0.03); padding: 22px 20px; min-width: 0; }
.wb-cap-num { font: 700 12px/1 ui-monospace, monospace; color: var(--orange); }
.wb-cap-title { font-family: Inter, sans-serif; font-size: 16.5px; font-weight: 800; letter-spacing: -0.015em; line-height: 1.3; color: var(--cream); margin: 12px 0 8px; }
.wb-cap-detail { font-size: 14px; line-height: 1.6; color: rgba(242,238,231,0.7); margin: 0; }
.wb-more { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 16px; }
.wb-more figure { margin: 0; }
.wb-more figcaption { font-family: Inter, sans-serif; font-size: 13px; font-weight: 600; line-height: 1.4; color: rgba(242,238,231,0.75); text-align: center; margin: 12px 0 0; }
.wb-split { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr); gap: 48px; align-items: center; }
.wb-split-visual, .wb-split-text { min-width: 0; }
.wb-nobill { margin-top: 72px; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 24px 48px; align-items: center; padding: 38px 42px; border-radius: 26px; border: 1px solid rgba(232,84,26,0.45); background: radial-gradient(80% 140% at 0% 0%, rgba(232,84,26,0.16), transparent 60%), rgba(242,238,231,0.02); }
.wb-nobill-figure { margin: 0; font-family: Inter, sans-serif; font-size: clamp(64px, 8vw, 108px); font-weight: 800; letter-spacing: -0.05em; line-height: 0.9; color: var(--orange); }
.wb-nobill-figure small { display: block; margin-top: 12px; font-size: 15px; font-weight: 600; letter-spacing: 0; color: rgba(242,238,231,0.6); }
.wb-nobill-title { font-family: Inter, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.025em; color: var(--cream); margin: 0 0 12px; }
.wb-nobill-body { font-size: 15.5px; line-height: 1.66; color: rgba(242,238,231,0.78); margin: 0 0 8px; max-width: 64ch; }
.wb-nobill-body:last-child { margin-bottom: 0; }

/* HQ */
.wb-split-wide { grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr); }
.wb-hq-grid { margin-top: 32px; }

/* Phone */
.wb-phone-split { display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); gap: 56px; align-items: center; }
.wb-phone-split .cs-head { margin-bottom: 0; }
.wb-phone-points { list-style: none; margin: 22px 0 0; padding: 0; display: grid; gap: 0; border-top: 1px solid var(--cs-line); }
.wb-phone-points li { padding: 13px 0; border-bottom: 1px solid var(--cs-line); font-size: 15px; line-height: 1.6; color: var(--grey); }
.wb-phone-points strong { color: var(--black); font-family: Inter, sans-serif; }
.wb-phones { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; align-items: start; }
.wb-phones-item:nth-child(2) { margin-top: 56px; }
.wb-phones figure { margin: 0; }
.wb-phones figcaption { font-family: Inter, sans-serif; font-size: 13px; font-weight: 600; color: var(--grey); text-align: center; margin: 12px 0 0; }

/* Website */
.wb-site-stage { position: relative; margin-bottom: 30px; }
.wb-site-desk { width: 84%; }
.wb-site-phone { position: absolute; right: 2%; bottom: -30px; width: 21%; max-width: 230px; filter: drop-shadow(0 30px 40px rgba(12,12,11,0.35)); }
.wb-built { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0 32px; border-top: 1px solid var(--cs-line); }
.wb-built-item { padding: 22px 0; border-bottom: 1px solid var(--cs-line); min-width: 0; }
.wb-built-num { font: 700 12px/1 ui-monospace, monospace; color: var(--cs-ink-orange); }
.wb-built-title { font-family: Inter, sans-serif; font-size: 16.5px; font-weight: 800; letter-spacing: -0.015em; margin: 12px 0 6px; }
.wb-built-detail { font-size: 14.5px; line-height: 1.62; color: var(--grey); margin: 0; }
.wb-site-more { margin-top: 56px; }
.wb-site-note { margin: 40px 0 0; padding-left: 18px; border-left: 3px solid var(--orange); font-size: 14.5px; line-height: 1.65; color: var(--grey); max-width: 70ch; }
.wb-proof { margin-top: 48px; background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 22px; padding: 28px; }
.wb-proof-figure { font: 800 40px/1 Inter, sans-serif; letter-spacing: -0.04em; color: var(--cs-ink-orange); margin: 0 0 8px; }
.wb-proof-period { font-size: 15px; color: var(--black); margin: 0; }

/* Stack */
.wb-stack { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.wb-stack-group { background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 22px; padding: 26px 24px 10px; min-width: 0; }
.wb-stack-h { font: 800 12px/1.2 Inter, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: var(--cs-ink-orange); margin: 0 0 8px; }
.wb-stack-list { margin: 0; }
.wb-stack-list > div { padding: 15px 0; border-top: 1px solid var(--cs-line); }
.wb-stack-list dt { font-family: Inter, sans-serif; font-size: 16px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 4px; }
.wb-stack-list dd { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--grey); }

/* Benefits */
.wb-benefits { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.wb-benefit { border: 1px solid rgba(242,238,231,0.14); border-radius: 18px; padding: 22px 20px 24px; background: rgba(242,238,231,0.03); min-width: 0; }
.wb-benefit-num { font: 700 12px/1 ui-monospace, monospace; color: var(--orange); }
.wb-benefit-title { font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.015em; line-height: 1.3; color: var(--cream); margin: 12px 0 8px; }
.wb-benefit-detail { font-size: 14.5px; line-height: 1.62; color: rgba(242,238,231,0.72); margin: 0; }

/* ── Responsive ── */
@media (max-width: 1000px) {
  .wb-challenge { grid-template-columns: minmax(0, 1fr); }
  .wb-map-grid { grid-template-columns: minmax(0, 1fr); gap: 28px; }
  .wb-sys-wires, .wb-sys-brackets { display: none; }
  .wb-sys-top { margin-bottom: 16px; }
  .wb-sys-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wb-sys-panel { display: block; }
  .wb-caps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wb-more { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 28px; }
  .wb-split, .wb-split-wide, .wb-phone-split { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  .wb-built { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wb-stack { grid-template-columns: minmax(0, 1fr); }
  .wb-benefits { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wb-nobill { grid-template-columns: minmax(0, 1fr); padding: 30px 28px; }
}
@media (max-width: 760px) {
  .wb-hero-phone { width: 29%; bottom: 52px; }
  .wb-hero-cap { padding-left: 32%; }
  .wb-rail { display: grid; grid-auto-flow: column; grid-template-columns: none; grid-auto-columns: 84%; gap: 14px; overflow-x: auto; scroll-snap-type: x mandatory; margin-left: -20px; margin-right: -20px; padding: 4px 20px 18px; scroll-padding: 0 20px; overscroll-behavior-x: contain; scrollbar-width: none; }
  .wb-rail::-webkit-scrollbar { display: none; }
  .wb-rail > li { scroll-snap-align: start; }
  .wb-swipe-hint { display: block; font-size: 13px; color: var(--grey); margin: 20px 0 0; }
  .wb-tour { gap: 56px; }
  .wb-tour-name { font-size: 22px; }
  .wb-tour-grid { gap: 14px; }
  .wb-pin-label { display: none; }
  .wb-pin-dot { left: -13px; top: -13px; width: 26px; height: 26px; font-size: 12px; }
  .wb-map-stage { border-radius: 16px; aspect-ratio: 1 / 1.05; }
  /* Zoom to the west of the city on phones so the Danapur pins separate. */
  .wb-map-canvas { right: auto; bottom: auto; width: 168%; aspect-ratio: 1600 / 1055; left: -12%; top: -3%; }
  .wb-ref { display: none; }
  .wb-outlet-name { font-size: 17px; }
  .wb-challenge-card { padding: 24px 20px; }
  .wb-challenge-title { font-size: 19px; }
  .wb-sys-top { flex-wrap: wrap; padding: 20px; }
  .wb-sys-key { display: none; }
  .wb-sys-cols { gap: 10px; }
  .wb-sys-col { padding: 16px 14px 8px; border-radius: 16px; }
  .wb-sys-name { font-size: 17px; }
  .wb-sys-items li { font-size: 13.5px; padding: 8px 0; }
  .wb-queries { grid-auto-columns: 74%; }
  .wb-query-phone { width: 82%; }
  .wb-caps { grid-template-columns: minmax(0, 1fr); gap: 10px; }
  .wb-more { grid-auto-columns: 46%; row-gap: 0; }
  .wb-phones { grid-auto-columns: 56%; align-items: start; }
  .wb-phones-item:nth-child(2) { margin-top: 0; }
  .wb-site-desk { width: 100%; }
  .wb-site-phone { width: 30%; right: -4px; bottom: -36px; }
  .wb-site-stage { margin-bottom: 44px; }
  .wb-built { grid-template-columns: minmax(0, 1fr); }
  .wb-site-more { margin-top: 40px; }
  .wb-benefits { grid-template-columns: minmax(0, 1fr); gap: 10px; }
  .wb-nobill { padding: 26px 20px; margin-top: 56px; border-radius: 22px; }
  .wb-nobill-title { font-size: 22px; }
}
@media (max-width: 380px) {
  .wb-rail { margin-left: -16px; margin-right: -16px; padding-left: 16px; padding-right: 16px; scroll-padding: 0 16px; }
  .wb-sys-cols { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .wb-sys-wires i { transform: none !important; }
  .wb-screen-link:hover { transform: none; }
}
`;
