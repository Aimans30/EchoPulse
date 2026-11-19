/**
 * All CSS for the case study detail page, injected once by CaseStudyPage.
 *
 * Colour notes
 *   --cs-ink-orange is a darker orange for TEXT on cream or white. The brand
 *   orange (#E8541A) is only 3.2:1 on cream, which fails for small text, so
 *   brand orange is reserved for dark surfaces, large type, bars and borders.
 *
 * Motion notes
 *   Everything that moves animates transform or opacity only. Every animation
 *   plays once. The reduced-motion block at the end renders finished states.
 *
 * Type scale (desktop): 64 / 44 / 24 / 19 / 16.5 / 14 / 12.
 */
export const CASE_STUDY_CSS = `
.cs-root { --cs-ink-orange: #B23A0C; --cs-paper: #F8F5EF; --cs-card: #FFFFFF; --cs-line: rgba(12,12,11,0.1); --cs-dline: rgba(242,238,231,0.14); --cs-ease: cubic-bezier(0.16,1,0.3,1); background: var(--cream); color: var(--black); overflow-x: clip; }
.cs-root *, .cs-root *::before, .cs-root *::after { box-sizing: border-box; }
.cs-root :focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; border-radius: 6px; }
.cs-container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.cs-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* Reveal */
.cs-rise { opacity: 0; transform: translate3d(0, 22px, 0); transition: opacity 0.7s ease, transform 0.9s var(--cs-ease); }
.cs-rise.is-in { opacity: 1; transform: none; }

/* Count up: a hidden copy sizes the box so the live number never shifts layout */
.cs-count { display: inline-grid; }
.cs-count > .cs-count-ghost, .cs-count > .cs-count-live { grid-area: 1 / 1; }
.cs-count-ghost { visibility: hidden; }
.cs-count-live { font-variant-numeric: tabular-nums; }

/* Section rhythm */
.cs-section { padding: 104px 0; scroll-margin-top: 110px; }
.cs-tone-paper { background: var(--cs-paper); }
.cs-tone-ink, .cs-section-dark { background: var(--black); color: var(--cream); }
.cs-head { max-width: 64ch; margin-bottom: 48px; }
.cs-sub { margin-top: 72px; }
.cs-sub-tight { margin-top: 40px; }
.cs-anchor { scroll-margin-top: 110px; }

/* Type */
.cs-kicker { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--cs-ink-orange); margin: 0 0 16px; }
.cs-tone-ink .cs-kicker, .cs-section-dark .cs-kicker, .cs-hero .cs-kicker { color: var(--orange); }
.cs-h2 { font-family: Inter, sans-serif; font-size: clamp(30px, 3.6vw, 46px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.06; margin: 0 0 20px; max-width: 22ch; text-wrap: balance; }
.cs-h2-light { color: var(--cream); }
.cs-h3 { font-family: Inter, sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.2; margin: 0 0 14px; max-width: 34ch; text-wrap: balance; }
.cs-h3-light { color: var(--cream); }
.cs-claim { font-family: Inter, sans-serif; font-size: 19px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.45; color: #2b2925; margin: 0 0 16px; max-width: 48ch; text-wrap: pretty; }
.cs-claim-sm { font-size: 16.5px; }
.cs-tone-ink .cs-claim, .cs-section-dark .cs-claim { color: var(--cream); }
.cs-accent { color: var(--orange); }
.cs-ink-accent { color: var(--cs-ink-orange); }
.cs-lead { font-size: 17px; line-height: 1.7; color: var(--grey); max-width: 60ch; margin: 0; }
.cs-lead-light { color: rgba(242,238,231,0.72); }
.cs-body { font-size: 16.5px; line-height: 1.75; color: var(--grey); max-width: 66ch; margin: 0 0 16px; }
.cs-body:last-child { margin-bottom: 0; }
.cs-hint { font-size: 13.5px; color: var(--grey); margin: 18px 0 0; }
.cs-caption { font-size: 13px; line-height: 1.6; color: var(--grey); margin: 14px 0 0; max-width: 72ch; }
.cs-caption a { color: var(--cs-ink-orange); font-weight: 700; }
.cs-caption-light { color: rgba(242,238,231,0.62); }
.cs-reading { border-left: 3px solid var(--orange); padding-left: 20px; margin-top: 32px; }
.cs-reading strong { color: var(--black); }

/* Buttons and links */
.cs-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: Inter, sans-serif; font-size: 15px; font-weight: 700; letter-spacing: -0.01em; border-radius: 100px; padding: 0 26px; min-height: 52px; text-decoration: none; transition: transform 0.25s var(--cs-ease), box-shadow 0.25s ease; }
.cs-btn svg { transition: transform 0.25s var(--cs-ease); }
.cs-btn-lg { font-size: 16.5px; min-height: 60px; padding: 0 34px; }
.cs-btn-primary { background: var(--orange); color: #0C0C0B; }
.cs-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(232,84,26,0.36); }
.cs-btn-primary:hover svg { transform: translate(2px, -2px); }
.cs-textlink { display: inline-flex; align-items: center; min-height: 44px; font-family: Inter, sans-serif; font-size: 15px; font-weight: 700; color: var(--black); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 5px; }
.cs-textlink-light { color: var(--cream); }
.cs-textlink:hover { color: var(--orange); }
.cs-verify { display: inline-flex; align-items: center; gap: 0.3em; min-height: 44px; font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; color: var(--orange); text-decoration: none; }
.cs-verify:hover { text-decoration: underline; text-underline-offset: 4px; }
.cs-arrowlink { display: inline-flex; align-items: center; gap: 0.3em; min-height: 44px; margin-top: 8px; font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; color: var(--black); text-decoration: none; border-bottom: 1px solid rgba(12,12,11,0.3); }
.cs-arrowlink:hover { color: var(--cs-ink-orange); border-color: var(--cs-ink-orange); }

/* ── Hero ── */
.cs-hero { background: var(--black); color: var(--cream); padding: 112px 0 72px; position: relative; overflow: hidden; }
.cs-hero::before { content: ""; position: absolute; inset: 0; background: radial-gradient(60% 50% at 85% 10%, rgba(232,84,26,0.16), transparent 70%); pointer-events: none; }
.cs-hero .cs-container { position: relative; }
.cs-crumb { display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: center; font-family: Inter, sans-serif; font-size: 13px; color: rgba(242,238,231,0.55); margin-bottom: 48px; }
.cs-crumb > * { white-space: nowrap; }
.cs-crumb > [aria-current] { white-space: normal; color: rgba(242,238,231,0.8); }
.cs-crumb a { color: rgba(242,238,231,0.72); text-decoration: none; display: inline-flex; min-height: 28px; align-items: center; }
.cs-crumb a:hover { color: var(--orange); }
.cs-hero-grid { display: grid; grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr); gap: 64px; align-items: center; }
.cs-kind-founder .cs-hero-grid { grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr); align-items: start; }
.cs-hero-copy { min-width: 0; }
.cs-eyebrow { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--orange); margin: 0 0 22px; }
.cs-eyebrow span:last-child { color: rgba(242,238,231,0.6); }
.cs-eyebrow-sep { width: 22px; height: 1px; background: rgba(242,238,231,0.3); }
.cs-h1 { font-family: Inter, sans-serif; font-size: clamp(40px, 5vw, 66px); font-weight: 800; letter-spacing: -0.042em; line-height: 1.0; margin: 0 0 24px; text-wrap: balance; }
.cs-kind-founder .cs-h1 { font-size: clamp(36px, 4vw, 54px); line-height: 1.04; text-wrap: pretty; }
.cs-kind-rebuild .cs-hero-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; }
.cs-kind-rebuild .cs-h1 { font-size: clamp(40px, 4.6vw, 60px); text-wrap: pretty; }
.cs-lede { font-size: 18px; line-height: 1.6; color: rgba(242,238,231,0.76); max-width: 46ch; margin: 0 0 32px; text-wrap: pretty; }
.cs-hero-cta { display: flex; flex-wrap: wrap; gap: 10px 26px; align-items: center; }
.cs-reassure { font-size: 13.5px; color: rgba(242,238,231,0.6); margin: 12px 0 0; }
.cs-hero-client { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 16px; margin: 30px 0 0; padding-top: 18px; border-top: 1px solid var(--cs-dline); font-family: Inter, sans-serif; }
.cs-hero-client-name { font-size: 14px; font-weight: 700; color: var(--cream); }
.cs-hero-visual { min-width: 0; }
.cs-hero-cap { font-size: 12.5px; line-height: 1.6; color: rgba(242,238,231,0.58); margin: 14px 0 0; }
.cs-hero-cap a { color: var(--orange); font-weight: 700; white-space: nowrap; }
.cs-hero-note { font-size: 14px; line-height: 1.6; color: rgba(242,238,231,0.62); margin: 20px 0 0; }

/* Hero stage: measured (screenshot + chart card) */
.cs-hero-stage-chart { position: relative; padding-bottom: 250px; }
.cs-hero-shot { width: 88%; margin-left: auto; }
.cs-hero-chartcard { position: absolute; left: 0; bottom: 0; width: 80%; background: #141413; border: 1px solid rgba(242,238,231,0.16); border-radius: 18px; padding: 18px 18px 12px; box-shadow: 0 30px 70px rgba(0,0,0,0.55); }
.cs-hero-chartcard-h { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2px 12px; font-family: Inter, sans-serif; font-size: 13px; font-weight: 700; color: var(--cream); margin: 0 0 6px; }
.cs-hero-chartcard-h span { font-weight: 500; color: rgba(242,238,231,0.5); font-size: 12px; }

/* Hero stage: founder (portrait + reel stills) */
.cs-hero-stage-founder { position: relative; padding: 0 0 40px 56px; }
.cs-portrait { margin: 0; border-radius: 22px; overflow: hidden; aspect-ratio: 4 / 4.6; background: #1a1a18; border: 1px solid var(--cs-dline); }
.cs-portrait img { width: 100%; height: 104%; object-fit: cover; object-position: center 20%; display: block; }
.cs-founder-stills { list-style: none; margin: 0; padding: 0; position: absolute; left: 0; bottom: 0; display: flex; gap: 12px; }
.cs-founder-stills li { width: 104px; }
.cs-founder-stills li:nth-child(2) { margin-top: 36px; }

/* Stat tiles */
.cs-stats { list-style: none; padding: 0; margin: 64px 0 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid var(--cs-dline); }
.cs-stats[data-count="3"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.cs-stat { padding: 26px 28px 0 0; min-width: 0; }
.cs-stat + .cs-stat { padding-left: 28px; border-left: 1px solid var(--cs-dline); }
.cs-stat-value { font-family: Inter, sans-serif; font-size: clamp(28px, 3vw, 42px); font-weight: 800; letter-spacing: -0.04em; line-height: 1; color: var(--orange); margin: 0 0 12px; }
.cs-stat-label { font-size: 14px; line-height: 1.45; color: rgba(242,238,231,0.88); margin: 0; }
.cs-stat-note { font-size: 12.5px; line-height: 1.45; color: rgba(242,238,231,0.52); margin: 6px 0 0; }

/* Device frames */
.cs-browser { border-radius: 14px; overflow: hidden; background: #fff; border: 1px solid rgba(12,12,11,0.12); box-shadow: 0 1px 0 rgba(255,255,255,0.4) inset, 0 30px 60px -20px rgba(12,12,11,0.28), 0 12px 24px -12px rgba(12,12,11,0.18); }
.cs-browser-dark { background: #1b1b19; border-color: rgba(242,238,231,0.14); box-shadow: 0 40px 80px -24px rgba(0,0,0,0.7); }
.cs-browser-bar { display: flex; align-items: center; gap: 14px; height: 36px; padding: 0 14px; background: #F1EEE8; border-bottom: 1px solid rgba(12,12,11,0.08); }
.cs-browser-dark .cs-browser-bar { background: #222220; border-bottom-color: rgba(242,238,231,0.08); }
.cs-browser-dots { display: inline-flex; gap: 6px; flex: none; }
.cs-browser-dots i { width: 10px; height: 10px; border-radius: 50%; background: rgba(12,12,11,0.16); }
.cs-browser-dark .cs-browser-dots i { background: rgba(242,238,231,0.18); }
.cs-browser-url { flex: 1; min-width: 0; display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 22px; margin-right: 52px; border-radius: 6px; background: rgba(12,12,11,0.05); font-family: Inter, sans-serif; font-size: 11.5px; color: rgba(12,12,11,0.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cs-browser-dark .cs-browser-url { background: rgba(242,238,231,0.06); color: rgba(242,238,231,0.6); }
.cs-browser-view { position: relative; }
.cs-shot { display: block; width: 100%; height: auto; }
.cs-phone { border-radius: 30px; padding: 7px; background: #111110; box-shadow: 0 0 0 1px rgba(242,238,231,0.08) inset, 0 30px 60px -20px rgba(12,12,11,0.45); }
.cs-phone-screen { border-radius: 24px; overflow: hidden; background: #000; aspect-ratio: 9 / 19.5; position: relative; }
.cs-phone-screen img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }

/* Compare slider */
.cs-cmp-urls { gap: 8px; }
.cs-cmp-urls span { transition: opacity 0.2s ease; }
.cs-cmp-frame { position: relative; aspect-ratio: 16 / 10; overflow: hidden; container-type: inline-size; touch-action: pan-y; cursor: ew-resize; user-select: none; -webkit-user-select: none; background: #0b0f3a; }
.cs-cmp-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; pointer-events: none; }
.cs-cmp-before { position: absolute; inset: 0; overflow: hidden; will-change: transform; }
.cs-cmp-before-inner { position: absolute; inset: 0; will-change: transform; }
.cs-cmp-tag { position: absolute; top: 14px; z-index: 2; padding: 6px 11px; border-radius: 100px; font: 800 10.5px/1 Inter, sans-serif; letter-spacing: 0.12em; text-transform: uppercase; pointer-events: none; transition: opacity 0.2s ease; }
.cs-cmp-short { display: none; }
.cs-cmp-tag-before { left: 14px; background: rgba(12,12,11,0.82); color: var(--cream); }
.cs-cmp-tag-after { right: 14px; background: var(--orange); color: #0C0C0B; }
.cs-cmp-seam { position: absolute; top: 0; bottom: 0; left: 0; width: 0; z-index: 3; will-change: transform; }
.cs-cmp-seam::before { content: ""; position: absolute; top: 0; bottom: 0; left: -1px; width: 2px; background: #fff; box-shadow: 0 0 0 1px rgba(12,12,11,0.15), 0 0 18px rgba(0,0,0,0.35); }
.cs-cmp-handle { position: absolute; top: 50%; left: -24px; width: 48px; height: 48px; margin-top: -24px; border-radius: 50%; background: #fff; color: #0C0C0B; display: grid; place-items: center; box-shadow: 0 8px 24px rgba(0,0,0,0.35); cursor: grab; transition: transform 0.2s var(--cs-ease); }
.cs-cmp-handle:hover { transform: scale(1.06); }
.cs-cmp-handle:focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; border-radius: 50%; }

/* Hero curve */
.cs-hc { position: relative; padding: 18px 0 0; }
.cs-hc-plot { position: relative; height: 230px; }
.cs-hc-grid { position: absolute; left: 0; right: 0; height: 1px; background: rgba(242,238,231,0.08); }
.cs-hc-grid em { position: absolute; right: 0; bottom: 4px; font: 500 10.5px/1 ui-monospace, monospace; font-style: normal; color: rgba(242,238,231,0.38); }
.cs-hc-wipe { position: absolute; inset: 0; overflow: hidden; transform: translate3d(-100%,0,0); }
.cs-hc-inner { position: absolute; inset: 0; transform: translate3d(100%,0,0); }
.cs-hc.is-drawn .cs-hc-wipe, .cs-hc.is-drawn .cs-hc-inner { transform: none; transition: transform 1.8s cubic-bezier(0.65,0,0.35,1) 0.3s; }
.cs-hc-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; overflow: visible; }
.cs-hc-launch { position: absolute; top: 0; bottom: 0; border-left: 1px dashed rgba(242,238,231,0.45); }
.cs-hc-launch em { position: absolute; top: -18px; left: 8px; font: 600 11px/1.2 Inter, sans-serif; font-style: normal; color: rgba(242,238,231,0.75); white-space: nowrap; }
.cs-hc-dot { position: absolute; width: 7px; height: 7px; margin: -3.5px 0 0 -3.5px; border-radius: 50%; background: #141413; border: 1.5px solid var(--orange); opacity: 0; transition: opacity 0.4s ease; }
.cs-hc-dot.is-key { width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px; background: var(--orange); box-shadow: 0 0 0 5px rgba(232,84,26,0.2); }
.cs-hc.is-drawn .cs-hc-dot { opacity: 1; }
.cs-hc-label { position: absolute; display: flex; flex-direction: column; gap: 3px; font-family: Inter, sans-serif; opacity: 0; transition: opacity 0.5s ease 1.6s, transform 0.6s var(--cs-ease) 1.6s; pointer-events: none; }
.cs-hc-label strong { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; color: var(--cream); white-space: nowrap; }
.cs-hc-label small { font-size: 11px; color: rgba(242,238,231,0.55); white-space: nowrap; }
.cs-hc-label-start { transform: translate(calc(-100% + 18px), calc(-100% - 20px)); text-align: right; align-items: flex-end; }
.cs-hc-label-end { transform: translate(calc(-100% - 20px), -14px); text-align: right; align-items: flex-end; }
.cs-hc-label-end strong { font-size: 22px; color: var(--orange); }
.cs-hc.is-drawn .cs-hc-label { opacity: 1; }
.cs-hc-axis { position: relative; height: 16px; margin-top: 8px; }
.cs-hc-axis span { position: absolute; top: 0; transform: translateX(-50%); font: 500 10.5px/1 ui-monospace, monospace; color: rgba(242,238,231,0.4); }
.cs-hc-axis span:first-child { transform: none; }
.cs-hc-axis span:last-child { transform: translateX(-100%); }

/* ── In short ── */
.cs-short { padding: 88px 0 24px; background: var(--cream); }
.cs-short-grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: 72px; align-items: start; }
.cs-answer { scroll-margin-top: 110px; }
.cs-answer-result { font-family: Inter, sans-serif; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.38; color: var(--black); margin: 0 0 20px; max-width: 40ch; text-wrap: pretty; }
.cs-answer-text { font-size: 16.5px; line-height: 1.72; color: #3d3a34; margin: 0 0 14px; max-width: 64ch; }
.cs-byline { display: flex; flex-wrap: wrap; gap: 4px 18px; font-size: 13px; line-height: 1.5; color: var(--grey); margin: 20px 0 0; padding-top: 16px; border-top: 1px solid var(--cs-line); }
.cs-byline a { color: var(--black); font-weight: 700; text-underline-offset: 3px; }
.cs-short-side { display: grid; gap: 22px; }
.cs-tldr { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; border-top: 1px solid var(--cs-line); }
.cs-tldr li { padding: 16px 0; border-bottom: 1px solid var(--cs-line); font-size: 15px; line-height: 1.6; color: #3d3a34; }
.cs-tldr strong { color: var(--black); font-family: Inter, sans-serif; }
.cs-clientcard { background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 18px; padding: 22px; }
.cs-clientcard-name { font-family: Inter, sans-serif; font-size: 16px; font-weight: 800; margin: 0 0 6px; }
.cs-clientcard-tag { font-size: 14px; line-height: 1.55; color: var(--grey); margin: 0 0 16px; }
.cs-services { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; padding: 0; margin: 0; }
.cs-services li { font-family: Inter, sans-serif; font-size: 12px; font-weight: 600; color: #3d3a34; background: var(--cs-paper); border: 1px solid var(--cs-line); border-radius: 100px; padding: 5px 11px; }

/* Section nav (desktop only) */
.cs-secnav-wrap { position: relative; z-index: 2; padding: 56px 0 0; display: flex; justify-content: center; background: var(--cream); }
.cs-secnav { max-width: calc(100% - 64px); display: flex; gap: 2px; padding: 5px; border-radius: 100px; background: var(--black); overflow-x: auto; scrollbar-width: none; }
.cs-secnav::-webkit-scrollbar { display: none; }
.cs-secnav a { white-space: nowrap; font-family: Inter, sans-serif; font-size: 13px; font-weight: 600; color: rgba(242,238,231,0.82); text-decoration: none; padding: 9px 16px; border-radius: 100px; transition: background 0.2s ease, color 0.2s ease; }
.cs-secnav a:hover { background: rgba(242,238,231,0.12); color: #fff; }
.cs-secnav a:focus-visible { outline-offset: -2px; }

/* Details accordions */
.cs-more { margin-top: 18px; border-top: 1px solid var(--cs-line); border-bottom: 1px solid var(--cs-line); }
.cs-more + .cs-more { margin-top: 0; border-top: 0; }
.cs-more > summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 14px; min-height: 56px; padding: 10px 0; font-family: Inter, sans-serif; font-size: 15px; font-weight: 700; color: var(--black); }
.cs-more > summary::-webkit-details-marker { display: none; }
.cs-more > summary::after { content: ""; flex: none; margin-left: auto; width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(12,12,11,0.2); background: no-repeat center / 12px 12px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M6 1v10M1 6h10' stroke='%230C0C0B' stroke-width='1.6'/%3E%3C/svg%3E"); transition: transform 0.3s var(--cs-ease), background-color 0.2s ease; }
.cs-more[open] > summary::after { transform: rotate(45deg); background-color: var(--cs-card); }
.cs-more > summary:hover { color: var(--cs-ink-orange); }
.cs-more > summary:focus-visible { outline-offset: 2px; }
.cs-more-count { font-size: 12px; font-weight: 600; color: var(--grey); background: rgba(12,12,11,0.05); border-radius: 100px; padding: 3px 9px; }
.cs-more-body { padding: 4px 0 26px; }
.cs-more-wide { margin-top: 28px; }
.cs-tone-ink .cs-more, .cs-section-dark .cs-more { border-color: var(--cs-dline); }

/* Points */
.cs-points { margin: 0; padding: 0; list-style: none; display: grid; gap: 12px; max-width: 72ch; }
.cs-points li { position: relative; padding-left: 22px; font-size: 15px; line-height: 1.68; color: #3d3a34; }
.cs-points li::before { content: ""; position: absolute; left: 2px; top: 10px; width: 8px; height: 2px; background: var(--orange); }
.cs-points strong { color: var(--black); }

/* Key facts */
.cs-table-scroll { overflow-x: auto; border: 1px solid var(--cs-line); border-radius: 16px; background: var(--cs-card); }
.cs-table { width: 100%; min-width: 560px; border-collapse: collapse; }
.cs-table thead th { font-family: Inter, sans-serif; font-size: 11.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--grey); text-align: left; padding: 13px 18px; background: rgba(12,12,11,0.03); border-bottom: 1px solid var(--cs-line); }
.cs-table tbody th, .cs-table tbody td { padding: 12px 18px; font-size: 14.5px; line-height: 1.55; border-bottom: 1px solid var(--cs-line); text-align: left; vertical-align: top; }
.cs-table tbody tr:last-child th, .cs-table tbody tr:last-child td { border-bottom: none; }
.cs-table tbody th { font-family: Inter, sans-serif; font-weight: 700; color: var(--black); white-space: nowrap; }
.cs-table tbody td { color: #3d3a34; }
.cs-facts { min-width: 0; }
.cs-facts tbody th { white-space: normal; width: 12rem; }
.cs-facts tbody td { overflow-wrap: anywhere; }
.cs-facts tbody td a { color: var(--cs-ink-orange); font-weight: 700; text-underline-offset: 3px; }
.cs-num { font-family: ui-monospace, monospace; font-variant-numeric: tabular-nums; white-space: nowrap; }
.cs-note { font-size: 13.5px; }
.cs-track { min-width: 680px; }
.cs-track tbody th { white-space: normal; width: 12rem; }
.cs-factlinks { display: flex; flex-wrap: wrap; gap: 4px 28px; margin: 14px 0 0; }
.cs-factlinks a { display: inline-block; padding: 12px 0; min-height: 44px; font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; color: var(--black); text-decoration: none; }
.cs-factlinks a:hover { color: var(--cs-ink-orange); }
.cs-glance { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 40px; margin: 20px 0 0; border-top: 1px solid var(--cs-line); }
.cs-glance-row { display: grid; grid-template-columns: 9.5rem minmax(0, 1fr); gap: 16px; padding: 13px 0; border-bottom: 1px solid var(--cs-line); align-items: baseline; }
.cs-glance dt { font-family: Inter, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--black); margin: 0; }
.cs-glance dd { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--grey); overflow-wrap: anywhere; }

/* Split layout */
.cs-split { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 64px; align-items: center; }
.cs-split-top { align-items: start; }
.cs-split-text, .cs-split-visual { min-width: 0; }
.cs-split-top .cs-head { margin-bottom: 0; }

/* Monthly chart */
.cs-mc { margin: 0; }
.cs-mc-chart { position: relative; padding-top: 128px; }
.cs-mc-tip { position: absolute; top: 0; width: 230px; padding: 12px 14px; border-radius: 12px; background: var(--black); color: var(--cream); display: grid; gap: 3px; transition: left 0.35s var(--cs-ease); pointer-events: none; z-index: 2; }
.cs-mc-tip-center { transform: translateX(-50%); }
.cs-mc-tip-start { transform: translateX(-12%); }
.cs-mc-tip-end { transform: translateX(-88%); }
.cs-mc-tip-month { font: 700 11px/1.3 Inter, sans-serif; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(242,238,231,0.6); }
.cs-mc-tip-value { font: 800 24px/1.1 Inter, sans-serif; letter-spacing: -0.03em; color: var(--orange); }
.cs-mc-tip-value small { font-size: 13px; font-weight: 600; color: rgba(242,238,231,0.7); letter-spacing: 0; }
.cs-mc-tip-total { font-size: 12.5px; color: rgba(242,238,231,0.85); }
.cs-mc-tip-note { font-size: 12.5px; line-height: 1.45; color: rgba(242,238,231,0.6); }
.cs-mc-cols { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(10, minmax(0, 1fr)); gap: 8px; height: 260px; border-bottom: 1px solid rgba(12,12,11,0.25); }
.cs-mc-cols li { min-width: 0; height: 100%; }
.cs-mc-col { all: unset; box-sizing: border-box; cursor: pointer; display: flex; flex-direction: column; height: calc(100% + 30px); width: 100%; min-height: 44px; }
.cs-mc-bar-wrap { flex: 1; display: flex; align-items: flex-end; height: calc(100% - 30px); }
.cs-mc-bar { display: block; width: 100%; min-height: 2px; border-radius: 6px 6px 0 0; background: rgba(232,84,26,0.35); transform: scaleY(0); transform-origin: bottom; transition: transform 1s var(--cs-ease), background-color 0.2s ease; }
.cs-mc-chart.is-grown .cs-mc-bar { transform: none; }
.cs-mc-col:hover .cs-mc-bar, .cs-mc-col.is-active .cs-mc-bar { background: var(--orange); }
.cs-mc-label { display: block; height: 30px; padding-top: 10px; text-align: center; font: 600 11.5px/1 Inter, sans-serif; color: var(--grey); }
.cs-mc-col.is-active .cs-mc-label { color: var(--black); }
.cs-mc-col:focus-visible { outline: 3px solid var(--orange); outline-offset: 2px; border-radius: 6px; }
.cs-mc .cs-caption { margin-top: 44px; }

/* Daily chart card */
.cs-daily { margin-top: 64px; background: var(--black); border-radius: 22px; padding: 30px 28px 24px; color: var(--cream); }
.cs-daily-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 6px 20px; margin-bottom: 26px; }
.cs-daily-head .cs-h3 { margin: 0; }
.cs-daily-head p { font-size: 13px; color: rgba(242,238,231,0.55); margin: 0; }

/* Funnel tiles */
.cs-funnel { list-style: none; margin: 32px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.cs-funnel-tile { background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 18px; padding: 22px 22px 20px; min-width: 0; }
.cs-funnel-label { font-family: Inter, sans-serif; font-size: 13.5px; font-weight: 700; color: var(--black); margin: 0 0 10px; }
.cs-funnel-change { font-family: Inter, sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; margin: 0 0 16px; }
.cs-change-up { color: #17653D; }
.cs-change-down { color: #A23A12; }
.cs-funnel-ba { display: flex; align-items: flex-end; gap: 10px; margin: 0; padding-top: 14px; border-top: 1px solid var(--cs-line); font-family: ui-monospace, monospace; font-size: 15px; font-weight: 700; color: var(--black); font-variant-numeric: tabular-nums; }
.cs-funnel-ba > span:not(.cs-funnel-arrow) { display: grid; gap: 4px; }
.cs-funnel-ba em { font: 500 11px/1.2 Inter, sans-serif; font-style: normal; color: var(--grey); }
.cs-funnel-arrow { color: var(--grey); padding-bottom: 1px; }

/* Bars */
.cs-bars-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: stretch; }
.cs-bars-grid > * { min-width: 0; }
.cs-bars { margin: 0; background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 18px; padding: 24px; height: 100%; }
.cs-bars-title { font-family: Inter, sans-serif; font-size: 16px; font-weight: 800; letter-spacing: -0.01em; line-height: 1.3; margin: 0 0 18px; }
.cs-bars-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.cs-bars-row { display: grid; grid-template-columns: minmax(3.4rem, 8rem) minmax(0, 1fr) auto; gap: 12px; align-items: center; font-size: 13.5px; }
.cs-bars-label { color: var(--black); line-height: 1.3; }
.cs-bars-track { height: 10px; border-radius: 100px; background: rgba(12,12,11,0.06); overflow: hidden; }
.cs-bars-fill { display: block; height: 100%; border-radius: 100px; background: var(--orange); transform: scaleX(0); transform-origin: left; transition: transform 1.1s var(--cs-ease); }
.cs-bars.is-grown .cs-bars-fill { transform: none; }
.cs-bars-val { font-family: ui-monospace, monospace; font-variant-numeric: tabular-nums; font-weight: 700; color: var(--black); text-align: right; min-width: 3.2rem; }

/* Cost comparison */
.cs-cost { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.cs-cost-col { border-radius: 22px; padding: 30px 30px 26px; min-width: 0; }
.cs-cost-old { background: var(--cs-card); border: 1px solid var(--cs-line); }
.cs-cost-new { background: var(--black); color: var(--cream); }
.cs-cost-kicker { font: 800 12px/1.3 Inter, sans-serif; letter-spacing: 0.12em; text-transform: uppercase; color: var(--grey); margin: 0 0 14px; }
.cs-cost-new .cs-cost-kicker { color: rgba(242,238,231,0.6); }
.cs-cost-big { font-family: Inter, sans-serif; font-size: clamp(36px, 4.4vw, 56px); font-weight: 800; letter-spacing: -0.045em; line-height: 1; margin: 0 0 12px; }
.cs-cost-big small { font-size: 16px; font-weight: 600; letter-spacing: 0; color: var(--grey); }
.cs-cost-new .cs-cost-big { color: var(--orange); }
.cs-cost-new .cs-cost-big small { color: rgba(242,238,231,0.7); }
.cs-cost-sub { font-size: 15px; line-height: 1.6; color: var(--grey); margin: 0 0 28px; max-width: 40ch; }
.cs-cost-new .cs-cost-sub { color: rgba(242,238,231,0.78); }
.cs-cost-year { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 5px; align-items: end; height: 56px; }
.cs-cost-year li { height: 100%; border-radius: 4px; background: #9C988F; transform: scaleY(0); transform-origin: bottom; transition: transform 0.6s var(--cs-ease); }
.cs-cost-year li.is-once { background: var(--orange); }
.cs-cost-year li.is-empty { height: 3px; background: rgba(242,238,231,0.2); }
.cs-rise.is-in .cs-cost-year li { transform: none; }
.cs-cost-axis { display: flex; justify-content: space-between; margin: 10px 0 0; font: 500 11.5px/1 ui-monospace, monospace; color: var(--grey); }
.cs-cost-new .cs-cost-axis { color: rgba(242,238,231,0.55); }

/* Situation */
.cs-fail-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; border-top: 1px solid var(--cs-line); }
.cs-fail { display: grid; grid-template-columns: 52px minmax(0, 1fr); gap: 12px; padding: 26px 0; border-bottom: 1px solid var(--cs-line); }
.cs-fail-num { font: 700 13px/1.6 ui-monospace, monospace; color: var(--cs-ink-orange); }
.cs-fail-title { font-family: Inter, sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.3; margin: 0 0 8px; }
.cs-fail-desc { font-size: 15px; line-height: 1.68; color: var(--grey); margin: 0; max-width: 60ch; }

/* Page rail */
.cs-container-bleed { max-width: none; padding: 0; }
.cs-rail-wrap { max-width: 1200px; margin: 0 auto; }
.cs-rail-ctrl { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 40px 22px; }
.cs-rail-hint { font-size: 13.5px; color: rgba(242,238,231,0.6); margin: 0; }
.cs-rail-btns { display: flex; gap: 8px; }
.cs-rail-btn { width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(242,238,231,0.25); background: transparent; color: var(--cream); display: grid; place-items: center; cursor: pointer; transition: background 0.2s ease, border-color 0.2s ease; }
.cs-rail-btn:hover { background: rgba(242,238,231,0.1); border-color: var(--cream); }
.cs-rail { list-style: none; margin: 0; padding: 4px 40px 28px; display: grid; grid-auto-flow: column; grid-auto-columns: min(640px, 82%); gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 40px; overscroll-behavior-x: contain; scrollbar-width: thin; scrollbar-color: rgba(242,238,231,0.3) transparent; }
.cs-rail-slide { scroll-snap-align: start; min-width: 0; }
.cs-pg { margin: 0; }
.cs-pg-stage { position: relative; padding: 0 0 36px 0; }
.cs-pg-view { position: relative; height: 420px; overflow: hidden; background: #fff; outline-offset: -3px; }
.cs-pg-view-sm { height: 360px; }
.cs-pg-img { display: block; width: 100%; height: auto; transform: translate3d(0,0,0); transition: transform 5s cubic-bezier(0.45,0,0.3,1); }
.cs-pg-view:hover .cs-pg-img, .cs-pg-view:focus-visible .cs-pg-img { transform: translate3d(0, calc(-100% + 420px), 0); transition-duration: 6s; }
.cs-pg-view-sm:hover .cs-pg-img, .cs-pg-view-sm:focus-visible .cs-pg-img { transform: translate3d(0, calc(-100% + 360px), 0); }
.cs-pg-old { position: absolute; right: -10px; bottom: 0; width: 26%; max-width: 150px; aspect-ratio: 3 / 4; border-radius: 10px; overflow: hidden; border: 3px solid #2a2a27; background: #fff; box-shadow: 0 18px 36px rgba(0,0,0,0.5); filter: grayscale(0.6) brightness(0.82); transition: filter 0.3s ease, transform 0.4s var(--cs-ease); }
.cs-pg-old:hover { filter: none; transform: translateY(-4px); }
.cs-pg-old img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
.cs-pg-old-tag { position: absolute; left: 6px; top: 6px; z-index: 1; padding: 4px 7px; border-radius: 100px; background: rgba(12,12,11,0.85); color: var(--cream); font: 800 9.5px/1 Inter, sans-serif; letter-spacing: 0.1em; text-transform: uppercase; }
.cs-pg-cap { display: grid; grid-template-columns: 36px minmax(0, 1fr); gap: 4px 8px; margin-top: 6px; padding-right: 24%; }
.cs-pg-num { font: 700 12.5px/1.7 ui-monospace, monospace; color: var(--orange); }
.cs-pg-text { font-size: 14.5px; line-height: 1.6; color: rgba(242,238,231,0.72); }
.cs-pg-text strong { color: var(--cream); }
.cs-pg-link { grid-column: 2; display: inline-flex; align-items: center; gap: 0.3em; min-height: 44px; font: 700 13.5px Inter, sans-serif; color: var(--orange); text-decoration: none; justify-self: start; }
.cs-pg-link:hover { text-decoration: underline; text-underline-offset: 4px; }

/* Devices */
.cs-devices { display: grid; grid-template-columns: minmax(0, 1fr) 270px; gap: 48px 40px; align-items: start; }
.cs-devices-desk { display: grid; gap: 48px 32px; min-width: 0; }
.cs-devices.is-multi { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 270px; }
.cs-devices.is-multi .cs-devices-desk { display: contents; }
.cs-devices.is-multi .cs-devices-desk > :first-child { grid-column: 1 / 3; grid-row: 1; }
.cs-devices.is-multi .cs-devices-phone { grid-column: 3; grid-row: 1; }
.cs-device-fig { margin: 0; min-width: 0; }
.cs-devices-phone { align-self: center; }
.cs-newpages { list-style: none; margin: 32px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.cs-newpages > li { min-width: 0; }
.cs-newpage { margin: 0; }

/* Timeline */
.cs-tl { list-style: none; margin: 0; padding: 0; position: relative; display: grid; gap: 0; }
.cs-tl::before { content: ""; position: absolute; left: 21px; top: 8px; bottom: 8px; width: 1px; background: linear-gradient(var(--orange), rgba(12,12,11,0.12) 30%); }
.cs-tl-step { position: relative; display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 28px; padding: 0 0 52px; }
.cs-tl-step:last-child { padding-bottom: 0; }
.cs-tl-marker { position: relative; z-index: 1; width: 44px; height: 44px; border-radius: 50%; background: var(--black); color: var(--orange); display: grid; place-items: center; box-shadow: 0 0 0 6px var(--cream); }
.cs-tl-body { min-width: 0; padding-top: 2px; }
.cs-tl-when { display: flex; flex-wrap: wrap; gap: 6px 14px; margin: 0 0 10px; font: 600 12px/1.6 ui-monospace, monospace; color: var(--cs-ink-orange); }
.cs-tl-when span + span { color: var(--grey); }
.cs-tl-main { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px 40px; align-items: start; }
.cs-tl-main.has-stat { grid-template-columns: minmax(0, 1fr) 240px; }
.cs-tl-title { font-family: Inter, sans-serif; font-size: 23px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.22; margin: 0 0 10px; }
.cs-tl-summary { font-size: 16px; line-height: 1.7; color: var(--grey); margin: 0; max-width: 62ch; }
.cs-tl-stat { margin: 0; padding: 16px 18px; border-radius: 14px; background: var(--cs-card); border: 1px solid var(--cs-line); display: grid; gap: 6px; }
.cs-tl-stat strong { font-family: Inter, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.05; color: var(--cs-ink-orange); overflow-wrap: anywhere; }
.cs-tl-stat span { font-size: 12.5px; line-height: 1.4; color: var(--grey); }
.cs-tl-media { list-style: none; margin: 22px 0 0; padding: 0; display: grid; grid-template-columns: minmax(0, 420px); gap: 14px; }
.cs-tl-media.is-tall { grid-template-columns: repeat(3, 150px); }
.cs-tl-media figure { margin: 0; }
.cs-tl-still { border-radius: 14px; overflow: hidden; border: 1px solid var(--cs-line); max-height: 320px; }
.cs-tl-media .cs-caption { font-size: 12px; margin-top: 8px; }
.cs-tl .cs-more { margin-top: 18px; }

/* Dashboard illustration */
.cs-dash { border-radius: 18px; overflow: hidden; background: #121211; color: var(--cream); border: 1px solid rgba(12,12,11,0.2); box-shadow: 0 40px 80px -30px rgba(12,12,11,0.45); }
.cs-dash-top { display: flex; align-items: center; gap: 14px; height: 44px; padding: 0 16px; border-bottom: 1px solid var(--cs-dline); }
.cs-dash-top .cs-browser-dots i { background: rgba(242,238,231,0.18); }
.cs-dash-title { font: 700 13px Inter, sans-serif; color: rgba(242,238,231,0.85); }
.cs-dash-pill { margin-left: auto; font: 600 11px Inter, sans-serif; color: #7fd1a2; border: 1px solid rgba(127,209,162,0.35); border-radius: 100px; padding: 4px 10px; }
.cs-dash-body { display: grid; grid-template-columns: 240px minmax(0, 1fr); min-height: 420px; }
.cs-dash-nav { display: flex; flex-direction: column; gap: 2px; padding: 12px; border-right: 1px solid var(--cs-dline); background: #0e0e0d; }
.cs-dash-tab { all: unset; box-sizing: border-box; display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 6px 12px; border-radius: 8px; font: 500 13px/1.3 Inter, sans-serif; color: rgba(242,238,231,0.65); cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.cs-dash-tab:hover { background: rgba(242,238,231,0.06); color: var(--cream); }
.cs-dash-tab.is-on { background: rgba(232,84,26,0.14); color: var(--cream); }
.cs-dash-tab:focus-visible { outline: 2px solid var(--orange); outline-offset: -2px; }
.cs-dash-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(242,238,231,0.25); flex: none; }
.cs-dash-tab.is-on .cs-dash-dot { background: var(--orange); }
.cs-dash-panel { padding: 30px 34px; animation: cs-fade 0.35s ease; min-width: 0; }
@keyframes cs-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.cs-dash-kicker { font: 700 11px/1 Inter, sans-serif; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(242,238,231,0.45); margin: 0 0 10px; }
.cs-dash-source { font: 800 28px/1.15 Inter, sans-serif; letter-spacing: -0.03em; margin: 0 0 28px; }
.cs-dash-chips { list-style: none; margin: 0 0 28px; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.cs-dash-chips li { font-size: 13px; line-height: 1.3; padding: 8px 12px; border-radius: 8px; background: rgba(242,238,231,0.06); border: 1px solid var(--cs-dline); }
.cs-dash-decision { font-size: 17px; line-height: 1.55; color: var(--cream); margin: 0; padding-left: 16px; border-left: 2px solid var(--orange); max-width: 52ch; }
.cs-dash-foot { font-size: 12px; color: rgba(242,238,231,0.42); margin: 28px 0 0; }

.cs-why { list-style: none; margin: 8px 0 0; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0; border-top: 1px solid var(--cs-line); }
.cs-why > li { padding: 22px 20px 0 0; min-width: 0; }
.cs-why > li + li { padding-left: 20px; border-left: 1px solid var(--cs-line); }
.cs-why-num { font: 700 12px/1 ui-monospace, monospace; color: var(--cs-ink-orange); }
.cs-why-title { font-family: Inter, sans-serif; font-size: 16px; font-weight: 800; letter-spacing: -0.015em; line-height: 1.3; margin: 12px 0 8px; }
.cs-why-detail { font-size: 14px; line-height: 1.62; color: var(--grey); margin: 0; }
.cs-track-split { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 64px; align-items: start; }

/* Proof */
.cs-proofs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; align-items: start; }
.cs-proof { margin: 0; min-width: 0; }
.cs-proof-link { display: block; }
.cs-proof img { width: 100%; height: auto; display: block; }

/* Measured */
.cs-openlist { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 32px; border-top: 1px solid var(--cs-line); }
.cs-openlist li { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 13px 0; border-bottom: 1px solid var(--cs-line); font-size: 14.5px; line-height: 1.5; color: #3d3a34; }
.cs-openstatus { flex: none; font-family: Inter, sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--cs-ink-orange); border: 1px solid rgba(178,58,12,0.35); border-radius: 100px; padding: 3px 9px; white-space: nowrap; }

/* Mid CTA */
.cs-midcta-section { padding: 0 0 104px; background: var(--cs-paper); }
.cs-midcta { border-radius: 26px; background: var(--black); color: var(--cream); padding: 44px 48px; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 24px 48px; align-items: center; }
.cs-midcta-text { font-family: Inter, sans-serif; font-size: 21px; font-weight: 600; letter-spacing: -0.015em; line-height: 1.45; color: var(--cream); margin: 0; max-width: 46ch; }
.cs-midcta-fine { font-size: 14px; color: rgba(242,238,231,0.6); margin: 12px 0 0; }
.cs-midcta-actions { display: flex; flex-wrap: wrap; gap: 8px 24px; align-items: center; }

/* Open problems */
.cs-problems { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.cs-problem { border: 1px solid rgba(242,238,231,0.14); border-radius: 18px; background: rgba(242,238,231,0.03); padding: 24px; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.cs-problem-title { font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.015em; line-height: 1.3; margin: 0; color: var(--cream); }
.cs-status { font-family: Inter, sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--orange); border: 1px solid rgba(232,84,26,0.5); border-radius: 100px; padding: 4px 10px; }
.cs-problem-detail { font-size: 14.5px; line-height: 1.68; color: rgba(242,238,231,0.72); margin: 0; }

/* Limits */
.cs-limit-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 48px; border-top: 1px solid var(--cs-line); }
.cs-limit { padding: 24px 0; border-bottom: 1px solid var(--cs-line); }
.cs-limit-title { font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.015em; line-height: 1.3; margin: 0 0 8px; }
.cs-limit-detail { font-size: 15px; line-height: 1.66; color: var(--grey); margin: 0; }

/* Cite */
.cs-cite-section { background: var(--cream); padding: 0 0 104px; }
.cs-cite-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: stretch; }
.cs-cite { background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 20px; padding: 28px; min-width: 0; scroll-margin-top: 110px; }
.cs-cite-h { font-family: Inter, sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25; margin: 0 0 12px; }
.cs-cite-text { font-size: 14.5px; line-height: 1.68; color: #3d3a34; margin: 0 0 10px; overflow-wrap: anywhere; }
.cs-cite-meta { display: grid; margin: 16px 0 18px; border-top: 1px solid var(--cs-line); }
.cs-cite-meta > div { display: grid; grid-template-columns: 6.5rem minmax(0, 1fr); gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--cs-line); }
.cs-cite-meta dt { font-family: Inter, sans-serif; font-size: 11.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--black); margin: 0; padding-top: 2px; }
.cs-cite-meta dd { margin: 0; font-size: 13.5px; line-height: 1.5; color: var(--grey); overflow-wrap: anywhere; }
.cs-cite-meta a { color: var(--cs-ink-orange); font-weight: 700; }
.cs-copy { font-family: Inter, sans-serif; font-size: 13.5px; font-weight: 700; color: var(--black); background: transparent; border: 1px solid rgba(12,12,11,0.32); border-radius: 100px; padding: 0 20px; min-height: 44px; cursor: pointer; transition: border-color 0.2s ease, color 0.2s ease; }
.cs-copy:hover { border-color: var(--cs-ink-orange); color: var(--cs-ink-orange); }

/* Fit */
.cs-fit { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.cs-fit-col { border-radius: 22px; padding: 30px; background: var(--cs-card); border: 1px solid var(--cs-line); min-width: 0; }
.cs-fit-no { background: transparent; border: 1px dashed rgba(12,12,11,0.28); }
.cs-fit-h { font-family: Inter, sans-serif; font-size: 18px; font-weight: 800; letter-spacing: -0.015em; margin: 0 0 18px; }
.cs-fit-col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.cs-fit-col li { position: relative; padding-left: 30px; font-size: 15px; line-height: 1.62; color: #3d3a34; }
.cs-fit-yes li::before { content: ""; position: absolute; left: 0; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: var(--orange) no-repeat center / 10px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 6.5l2.5 2.5L10 3.5' fill='none' stroke='%230C0C0B' stroke-width='2'/%3E%3C/svg%3E"); }
.cs-fit-no li::before { content: ""; position: absolute; left: 0; top: 3px; width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid rgba(12,12,11,0.4); background: no-repeat center / 8px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 2l8 8M10 2l-8 8' stroke='%235A574F' stroke-width='2'/%3E%3C/svg%3E"); }

/* Close */
.cs-close { background: var(--black); color: var(--cream); padding: 120px 0 72px; position: relative; overflow: hidden; }
.cs-close::before { content: ""; position: absolute; inset: 0; background: radial-gradient(50% 60% at 10% 0%, rgba(232,84,26,0.14), transparent 70%); pointer-events: none; }
.cs-close .cs-container { position: relative; }
.cs-close-h { font-size: clamp(34px, 4.6vw, 60px); max-width: 18ch; }
.cs-close-cta { display: flex; flex-wrap: wrap; gap: 10px 28px; align-items: center; margin-top: 36px; }
.cs-closelinks { display: flex; flex-wrap: wrap; gap: 4px 28px; margin-top: 72px; padding-top: 22px; border-top: 1px solid var(--cs-dline); }
.cs-closelinks a { display: inline-block; padding: 12px 0; min-height: 44px; font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; color: rgba(242,238,231,0.8); text-decoration: none; }
.cs-closelinks a:hover { color: var(--orange); }

/* ── Responsive ── */
@media (max-width: 1100px) {
  .cs-why { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 24px; }
  .cs-why > li:nth-child(4) { padding-left: 0; border-left: 0; }
}
@media (max-width: 1000px) {
  .cs-container { padding: 0 32px; }
  .cs-hero-grid, .cs-kind-founder .cs-hero-grid, .cs-kind-rebuild .cs-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 48px; }
  .cs-stats, .cs-stats[data-count="3"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cs-stat:nth-child(odd) { padding-left: 0; border-left: 0; }
  .cs-stat:nth-child(n+3) { padding-top: 22px; margin-top: 22px; border-top: 1px solid var(--cs-dline); }
  .cs-stats[data-count="3"] .cs-stat:first-child { grid-column: 1 / -1; }
  .cs-stats[data-count="3"] .cs-stat:nth-child(2) { padding-left: 0; border-left: 0; padding-top: 22px; margin-top: 22px; border-top: 1px solid var(--cs-dline); }
  .cs-stats[data-count="3"] .cs-stat:nth-child(3) { padding-left: 28px; border-left: 1px solid var(--cs-dline); padding-top: 22px; margin-top: 22px; border-top: 1px solid var(--cs-dline); }
  .cs-hero-stage-founder { max-width: 520px; }
  .cs-short-grid, .cs-split { grid-template-columns: minmax(0, 1fr); gap: 40px; }
  .cs-split-top .cs-head { position: static; }
  .cs-secnav-wrap { display: none; }
  .cs-funnel { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cs-problems { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cs-devices, .cs-devices.is-multi { grid-template-columns: minmax(0, 1fr) 200px; gap: 32px 24px; }
  .cs-devices.is-multi .cs-devices-desk > :first-child { grid-column: 1; }
  .cs-devices.is-multi .cs-devices-phone { grid-column: 2; }
  .cs-devices.is-multi .cs-devices-desk > :nth-child(n+2) { grid-column: 1 / -1; }
  .cs-cite-grid, .cs-track-split { grid-template-columns: minmax(0, 1fr); }
  .cs-dash-body { grid-template-columns: 200px minmax(0, 1fr); }
  .cs-midcta { grid-template-columns: minmax(0, 1fr); }
  .cs-section, .cs-anchor, .cs-answer, .cs-cite { scroll-margin-top: 90px; }
}
@media (max-width: 760px) {
  .cs-container { padding: 0 20px; }
  .cs-section { padding: 72px 0; }
  .cs-head { margin-bottom: 32px; }
  .cs-sub { margin-top: 56px; }
  .cs-root .cs-hero { padding: 112px 0 52px; }
  .cs-crumb { margin-bottom: 28px; }
  .cs-h1 { font-size: clamp(34px, 9.4vw, 44px); letter-spacing: -0.035em; }
  .cs-kind-founder .cs-h1 { font-size: clamp(30px, 8.4vw, 38px); }
  .cs-lede { font-size: 16.5px; margin-bottom: 26px; }
  .cs-hero-cta .cs-btn { width: 100%; }
  .cs-hero-cta .cs-textlink { width: 100%; justify-content: center; }
  .cs-reassure { text-align: center; }
  .cs-hero-cta + .cs-reassure { margin-top: 2px; }
  .cs-hero-stage-chart { padding-bottom: 0; display: flex; flex-direction: column-reverse; gap: 16px; }
  .cs-hero-shot { width: 100%; }
  .cs-hero-chartcard { position: relative; width: 100%; padding: 16px 14px 10px; }
  .cs-hc-plot { height: 190px; }
  .cs-hc-label strong { font-size: 15px; }
  .cs-hc-label-end strong { font-size: 18px; }
  .cs-hero-stage-founder { padding-left: 34px; }
  .cs-founder-stills li { width: 84px; }
  .cs-stats { margin-top: 44px; }
  .cs-stat, .cs-stat + .cs-stat { padding-right: 12px; }
  .cs-stat:nth-child(even) { padding-left: 16px; }
  .cs-stats[data-count="3"] .cs-stat:nth-child(3) { padding-left: 16px; }
  .cs-stat-value { font-size: 28px; }
  .cs-stat-label { font-size: 13px; }
  .cs-browser-bar { height: 30px; padding: 0 10px; gap: 10px; }
  .cs-browser-dots i { width: 8px; height: 8px; }
  .cs-browser-url { margin-right: 0; font-size: 10.5px; height: 20px; }
  .cs-cmp-handle { width: 44px; height: 44px; left: -22px; margin-top: -22px; }
  .cs-cmp-tag { top: 10px; font-size: 9.5px; padding: 5px 9px; }
  .cs-cmp-tag-before { left: 10px; }
  .cs-cmp-long { display: none; }
  .cs-cmp-short { display: inline; }
  .cs-cmp-tag-after { right: 10px; }
  .cs-short { padding: 64px 0 8px; }
  .cs-answer-result { font-size: 19px; }
  .cs-answer-text { font-size: 16px; }
  .cs-glance { grid-template-columns: minmax(0, 1fr); }
  .cs-glance-row { grid-template-columns: minmax(0, 1fr); gap: 4px; }
  .cs-facts tbody th { width: 6.8rem; }
  .cs-facts tbody th, .cs-facts tbody td { padding: 11px 12px; font-size: 13.5px; }
  .cs-table { min-width: 480px; }
  .cs-track { min-width: 620px; }
  .cs-mc-chart { padding-top: 136px; }
  .cs-mc-tip { width: 210px; }
  .cs-mc-cols { gap: 4px; height: 220px; }
  .cs-mc-label { font-size: 10px; }
  .cs-daily { padding: 22px 14px 18px; border-radius: 18px; margin-top: 48px; }
  .cs-funnel { grid-template-columns: minmax(0, 1fr); }
  .cs-funnel-change { font-size: 28px; }
  .cs-bars-grid { grid-template-columns: minmax(0, 1fr); }
  .cs-bars { padding: 20px 18px; }
  .cs-cost { grid-template-columns: minmax(0, 1fr); }
  .cs-cost-col { padding: 24px 20px 22px; }
  .cs-fail { grid-template-columns: 40px minmax(0, 1fr); padding: 22px 0; }
  .cs-fail-title { font-size: 17.5px; }
  .cs-rail-ctrl { padding: 0 20px 18px; }
  .cs-rail-btns { display: none; }
  .cs-rail { padding: 4px 20px 24px; grid-auto-columns: 86%; gap: 14px; scroll-padding: 0 20px; }
  .cs-pg-view { height: 360px; }
  .cs-pg-view:hover .cs-pg-img, .cs-pg-view:focus-visible .cs-pg-img { transform: translate3d(0, calc(-100% + 360px), 0); }
  .cs-pg-old { right: 8px; width: 30%; }
  .cs-pg-cap { padding-right: 0; grid-template-columns: 28px minmax(0, 1fr); }
  .cs-devices, .cs-devices.is-multi { grid-template-columns: minmax(0, 1fr); }
  .cs-devices.is-multi .cs-devices-desk > *, .cs-devices.is-multi .cs-devices-phone { grid-column: 1; grid-row: auto; }
  .cs-devices-phone { width: 62%; max-width: 260px; margin: 0 auto; }
  .cs-newpages { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  .cs-tl::before { left: 17px; }
  .cs-tl-step { grid-template-columns: 36px minmax(0, 1fr); gap: 16px; padding-bottom: 44px; }
  .cs-tl-marker { width: 36px; height: 36px; }
  .cs-tl-marker svg { width: 16px; height: 16px; }
  .cs-tl-main.has-stat { grid-template-columns: minmax(0, 1fr); gap: 16px; }
  .cs-tl-title { font-size: 20px; }
  .cs-tl-summary { font-size: 15.5px; }
  .cs-tl-media.is-tall { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .cs-dash-body { grid-template-columns: minmax(0, 1fr); min-height: 0; }
  .cs-dash-nav { flex-direction: row; overflow-x: auto; border-right: 0; border-bottom: 1px solid var(--cs-dline); scrollbar-width: none; scroll-snap-type: x proximity; }
  .cs-dash-nav::-webkit-scrollbar { display: none; }
  .cs-dash-tab { flex: none; white-space: nowrap; min-height: 44px; }
  .cs-dash-panel { padding: 22px 18px 24px; }
  .cs-dash-source { font-size: 22px; margin-bottom: 20px; }
  .cs-dash-pill { display: none; }
  .cs-why { grid-template-columns: minmax(0, 1fr); }
  .cs-why > li, .cs-why > li + li { padding: 18px 0; border-left: 0; border-bottom: 1px solid var(--cs-line); }
  .cs-proofs { grid-template-columns: minmax(0, 1fr); }
  .cs-openlist { grid-template-columns: minmax(0, 1fr); }
  .cs-midcta-section { padding-bottom: 72px; }
  .cs-midcta { padding: 28px 22px; border-radius: 22px; }
  .cs-midcta-text { font-size: 18px; }
  .cs-midcta-actions .cs-btn { width: 100%; }
  .cs-problems { grid-template-columns: minmax(0, 1fr); }
  .cs-limit-grid { grid-template-columns: minmax(0, 1fr); }
  .cs-cite-section { padding-bottom: 72px; }
  .cs-cite { padding: 22px 18px; }
  .cs-cite-meta > div { grid-template-columns: 5.4rem minmax(0, 1fr); }
  .cs-fit { grid-template-columns: minmax(0, 1fr); }
  .cs-fit-col { padding: 22px 20px; }
  .cs-close { padding: 80px 0 56px; }
  .cs-close-cta .cs-btn { width: 100%; }
  .cs-closelinks { margin-top: 48px; }
}
@media (max-width: 760px) {
  .cs-hc-axis span, .cs-hc-grid em, .cs-mc-label, .cs-table thead th, .cs-cite-meta dt, .cs-status, .cs-openstatus, .cs-cmp-tag, .cs-browser-url, .cs-tl-when, .cs-cost-axis, .cs-mc-tip-month, .cs-dash-kicker, .cs-hc-label small { font-size: 12px; }
  .cs-cite-meta a, .cs-byline a { display: inline-flex; align-items: center; min-height: 44px; }
  .cs-byline { row-gap: 0; }
}
@media (max-width: 380px) {
  .cs-container { padding: 0 16px; }
  .cs-stat-value { font-size: 25px; }
  .cs-mc-tip { width: 190px; }
}
@media (hover: none) {
  .cs-pg-img { transition-duration: 7s; }
}
/* The global stylesheet forces padding on every <section> under 1024px with
   !important. These sections manage their own gutters through .cs-container,
   so that padding is cancelled here, and the phone rhythm is restated. */
.cs-root > section { padding-left: 0 !important; padding-right: 0 !important; }
@media (max-width: 768px) {
  .cs-root > .cs-hero { padding-top: 112px !important; padding-bottom: 52px !important; }
  .cs-root > .cs-short { padding-top: 64px !important; padding-bottom: 8px !important; }
  .cs-root > .cs-section { padding-top: 72px !important; padding-bottom: 72px !important; }
  .cs-root > .cs-midcta-section, .cs-root > .cs-cite-section { padding-top: 0 !important; padding-bottom: 72px !important; }
  .cs-root > .cs-close { padding-top: 80px !important; padding-bottom: 56px !important; }
  .cs-hc-axis span:nth-child(even):not(:last-child) { display: none; }
  .cs-ch-axis span:nth-child(2) { display: none; }
  .cs-root .cs-cite-h { font-size: 19px !important; }
  .cs-crumb a { min-height: 44px; }
  .cs-crumb { margin-bottom: 16px; }
  .cs-funnel { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .cs-funnel-tile { padding: 16px 14px 14px; }
  .cs-funnel-label { font-size: 13px; min-height: 2.6em; }
  .cs-funnel-change { font-size: 24px; margin-bottom: 12px; }
  .cs-funnel-ba { flex-direction: column; align-items: flex-start; gap: 6px; font-size: 14px; }
  .cs-funnel-arrow { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .cs-rise, .cs-rise.is-in { opacity: 1 !important; transform: none !important; transition: none !important; }
  .cs-root *, .cs-root *::before, .cs-root *::after { transition: none !important; animation: none !important; }
  .cs-hc-wipe, .cs-hc-inner, .cs-mc-bar, .cs-bars-fill, .cs-cost-year li { transform: none !important; }
  .cs-hc-dot, .cs-hc-label { opacity: 1 !important; }
  .cs-pg-view:hover .cs-pg-img, .cs-pg-view:focus-visible .cs-pg-img { transform: none !important; }
  .cs-btn-primary:hover, .cs-cmp-handle:hover, .cs-pg-old:hover { transform: none; }
}
`;
