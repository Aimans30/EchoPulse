/**
 * Styles for the homepage hero stage (raw-to-ready frame, pipeline card,
 * MagicBNB card). One string rendered in a <style> tag by HeroStage, the same
 * pattern Hero.tsx uses, so the per-step keyframes can be generated here.
 *
 * Every class is prefixed `hs-`. The loop is 12 s; the pipeline keyframes are
 * plain CSS and only run while the stage carries `data-run` (set once the
 * first clip is playing and while the hero is on screen).
 *
 * The finished state (wipe at 80 percent, first lower third up, every step
 * ticked) is written once and applied two ways: under
 * prefers-reduced-motion before any JS runs, and under `[data-static]` for
 * Save-Data and very slow connections, which JS detects after hydration.
 */

export const PIPELINE_STEPS = [
  { name: 'Footage', sub: 'Send us what you film', icon: 'M3 7h12v10H3zM15 10l6-3v10l-6-3' },
  { name: 'Edit', sub: 'Cuts, captions, grade', icon: 'scissors' },
  { name: 'Post', sub: 'Reels, Shorts, LinkedIn', icon: 'M4 12l16-8-6 16-3-7z' },
  { name: 'Website', sub: 'Pages and blog kept fresh', icon: 'browser' },
  { name: 'Booked call', sub: 'Lands in your calendar', icon: 'calendar' },
] as const;

const T = 12;
const pct = (s: number) => ((s / T) * 100).toFixed(2);
/** When the pulse reaches step i: 0.8, 3.0, 5.2, 7.4, 9.6 s. */
const reach = (i: number) => 0.8 + i * 2.2;
/** Node centres inside the desktop pipeline card. */
const Y0 = 92;
const DY = 80;

const stepKeyframes = PIPELINE_STEPS.map(
  (_, i) => `@keyframes hs-tick${i}{0%,${pct(reach(i))}%{opacity:0;transform:scale(.5)}${pct(reach(i) + 0.3)}%,95%{opacity:1;transform:scale(1)}98.5%,100%{opacity:0;transform:scale(1)}}
@keyframes hs-lab${i}{0%,${pct(reach(i))}%{opacity:.45}${pct(reach(i) + 0.3)}%,95%{opacity:1}98.5%,100%{opacity:.45}}
.hs-node[data-i="${i}"] .hs-on{animation:hs-tick${i} var(--hs-T) cubic-bezier(.34,1.56,.64,1) infinite}
.hs-node[data-i="${i}"] .hs-tx{animation:hs-lab${i} var(--hs-T) linear infinite}`,
).join('\n');

/** The finished state, scoped by `p` (a selector prefix). */
const finished = (p: string) => `
${p} .hs-video,${p} .hs-canvas{display:none}
${p} .hs-ph{display:block!important}
${p} .hs-rawO{transform:translateX(80%)!important;opacity:1!important}
${p} .hs-rawI{transform:translateX(-80%)!important}
${p} .hs-hwrap{transform:translateX(80%)!important}
${p} .hs-handle{opacity:1!important}
${p} .hs-l3[data-slot="0"]{opacity:1!important;transform:none!important}
${p} .hs-state .r{opacity:0!important}
${p} .hs-state .e{opacity:1!important}
${p} .hs-bars span:first-child i{transform:none!important}
${p} .hs-rec{display:none}
${p} .hs-on{animation:none!important;opacity:1!important;transform:none!important}
${p} .hs-tx{animation:none!important;opacity:1!important}
${p} .hs-rail i{animation:none!important;transform:none!important}
${p} .hs-pulse{display:none}
${p} .hs-last .hs-c::after{animation:none!important}
`;

export const HERO_STAGE_CSS = `
.hs-wrap{--s:1;--hs-T:${T}s;--hs-accent:#E8541A;--hs-ink:#0C0C0B;--hs-muted:#6E6B63;position:relative;flex:0 0 auto;width:calc(600px * var(--s));height:calc(640px * var(--s))}
.hs-stage{position:absolute;left:0;top:0;width:600px;height:640px;transform-origin:0 0;transform:scale(var(--s))}
.hs-stage:not([data-run]) .hs-anim,.hs-stage:not([data-run]) .hs-anim *{animation-play-state:paused!important}
.hs-frame{position:absolute;left:0;top:0;width:360px;height:640px;border-radius:20px;overflow:hidden;clip-path:inset(0 round 20px);background:#141413;
  box-shadow:0 32px 64px -24px rgba(12,12,11,.28),0 8px 24px -8px rgba(12,12,11,.10),0 0 0 1px rgba(12,12,11,.05)}
.hs-side{position:absolute;left:384px;top:0;width:216px;height:640px}
.hs-card{position:absolute;left:0;width:216px;border-radius:20px;background:#fff;overflow:hidden;
  box-shadow:0 16px 40px -16px rgba(12,12,11,.22),0 2px 8px rgba(12,12,11,.06),0 0 0 1px rgba(12,12,11,.05)}
.hs-kick{font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--hs-muted)}

/* ── wipe ── */
.hs-wipe{position:absolute;inset:0;overflow:hidden;background:#141413;border-radius:inherit;isolation:isolate;font-family:Inter,system-ui,sans-serif}
.hs-wipe .hs-video,.hs-wipe .hs-ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.hs-wipe .hs-video{opacity:0;background:transparent}
.hs-wipe[data-live] .hs-ph{display:none}
.hs-ed .hs-video,.hs-ed .hs-ph{filter:saturate(1.14) contrast(1.06) brightness(1.02)}
.hs-grade{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 80% at 50% 40%,rgba(0,0,0,0) 55%,rgba(0,0,0,.28) 100%),linear-gradient(180deg,rgba(12,12,11,.38) 0%,rgba(12,12,11,0) 18%,rgba(12,12,11,0) 72%,rgba(12,12,11,.42) 100%)}
.hs-rawO{position:absolute;inset:-1px;overflow:hidden;will-change:transform}
.hs-rawI{position:absolute;inset:-1px;will-change:transform;background:#141413}
.hs-canvas,.hs-rawI .hs-ph{position:absolute;inset:0;width:100%;height:100%;filter:saturate(.18) contrast(.74) brightness(1.06)}
.hs-rawI::after{content:'';position:absolute;inset:0;background:rgba(128,124,116,.14);mix-blend-mode:screen;pointer-events:none}
.hs-guides{position:absolute;inset:16px;z-index:1;pointer-events:none}
.hs-guides i{position:absolute;width:16px;height:16px;border:0 solid rgba(255,255,255,.7)}
.hs-guides i:nth-child(1){left:0;top:40px;border-left-width:1.5px;border-top-width:1.5px}
.hs-guides i:nth-child(2){right:0;top:40px;border-right-width:1.5px;border-top-width:1.5px}
.hs-guides i:nth-child(3){left:0;bottom:0;border-left-width:1.5px;border-bottom-width:1.5px}
.hs-guides i:nth-child(4){right:0;bottom:0;border-right-width:1.5px;border-bottom-width:1.5px}
.hs-rec{position:absolute;left:28px;bottom:26px;z-index:2;display:flex;align-items:center;gap:6px;font:600 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;color:rgba(255,255,255,.82);text-transform:uppercase}
.hs-rec b{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.75)}
.hs-hwrap{position:absolute;inset:0;z-index:5;pointer-events:none;will-change:transform}
.hs-handle{position:absolute;left:0;top:0;bottom:0;width:2px;margin-left:-1px;background:#fff;box-shadow:0 0 16px rgba(0,0,0,.35);opacity:0;will-change:opacity}
.hs-knob{position:absolute;left:-19px;top:50%;width:40px;height:40px;margin-top:-20px;border-radius:50%;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.3);display:grid;place-items:center}
.hs-top{position:absolute;left:16px;right:16px;top:14px;z-index:6}
.hs-bars{display:flex;gap:4px;height:3px;margin-bottom:12px}
.hs-bars span{flex:1;border-radius:2px;background:rgba(255,255,255,.32);overflow:hidden;position:relative}
.hs-bars span i{position:absolute;inset:0;background:#fff;transform-origin:left;transform:scaleX(0)}
.hs-row{display:flex;justify-content:space-between;align-items:center}
.hs-type{position:relative;height:28px;min-width:120px}
.hs-type span{position:absolute;left:0;top:0;height:28px;padding:0 12px;border-radius:999px;background:rgba(255,255,255,.94);color:var(--hs-ink);font-size:12px;font-weight:700;letter-spacing:-.1px;display:flex;align-items:center;gap:6px;white-space:nowrap;opacity:0;transition:opacity .35s ease;box-shadow:0 4px 16px rgba(0,0,0,.18)}
.hs-type span::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--hs-accent)}
.hs-type span[data-on]{opacity:1}
.hs-state{position:relative;height:24px;width:72px}
.hs-state span{position:absolute;right:0;top:0;height:24px;padding:0 10px;border-radius:999px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;display:flex;align-items:center;white-space:nowrap;transition:opacity .3s ease}
.hs-state .r{background:rgba(12,12,11,.55);color:rgba(255,255,255,.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.hs-state .e{background:var(--hs-accent);color:#fff;opacity:0}
.hs-l3{position:absolute;left:16px;bottom:16px;z-index:3;display:flex;align-items:center;gap:10px;height:48px;padding:0 16px 0 0;border-radius:10px;background:rgba(255,255,255,.95);box-shadow:0 12px 32px rgba(0,0,0,.28);overflow:hidden;opacity:0;will-change:transform,opacity}
.hs-l3 i{width:4px;align-self:stretch;background:var(--hs-accent)}
.hs-l3 strong{display:block;font-size:13px;font-weight:800;letter-spacing:-.2px;color:var(--hs-ink);white-space:nowrap;line-height:1.25}
.hs-l3 small{display:block;font-size:11px;font-weight:500;color:var(--hs-muted);margin-top:2px;white-space:nowrap;line-height:1.25}
.hs-cap{position:absolute;left:0;right:0;top:56%;z-index:3;display:flex;justify-content:center;opacity:0;will-change:transform,opacity}
.hs-cap span{font-size:30px;font-weight:900;line-height:1;letter-spacing:-.02em;text-transform:uppercase;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.35),0 8px 24px rgba(0,0,0,.45);white-space:nowrap}
.hs-cap span b{color:#fff;background:var(--hs-accent);padding:2px 8px 4px;border-radius:6px;margin-left:6px;text-shadow:none;display:inline-block;transform:rotate(-2deg)}

/* ── pipeline card ── */
.hs-pipe{top:0;height:448px;padding:20px}
.hs-hd{display:flex;justify-content:space-between;align-items:center}
.hs-hd em{font-style:normal;font-size:10px;font-weight:700;color:var(--hs-accent);background:rgba(232,84,26,.12);height:20px;padding:0 8px;border-radius:999px;display:flex;align-items:center}
.hs-nodes{position:absolute;inset:0}
.hs-rail{position:absolute;left:38px;top:${Y0}px;width:2px;height:${4 * DY}px;margin-left:-1px;background:#ECE7DE;border-radius:2px;overflow:hidden}
.hs-rail i{position:absolute;inset:0;background:var(--hs-accent);transform-origin:top;transform:scaleY(0);animation:hs-rail var(--hs-T) linear infinite}
@keyframes hs-rail{0%,${pct(reach(0))}%{transform:scaleY(0)}${pct(reach(4))}%,95%{transform:scaleY(1);opacity:1}98.5%,100%{transform:scaleY(1);opacity:0}}
@keyframes hs-railx{0%,${pct(reach(0))}%{transform:scaleX(0)}${pct(reach(4))}%,95%{transform:scaleX(1);opacity:1}98.5%,100%{transform:scaleX(1);opacity:0}}
.hs-pulse{position:absolute;left:32px;top:${Y0 - 6}px;width:12px;height:12px;border-radius:50%;background:var(--hs-accent);box-shadow:0 0 0 5px rgba(232,84,26,.18),0 0 14px rgba(232,84,26,.55);z-index:2;opacity:0;animation:hs-pulse var(--hs-T) linear infinite}
@keyframes hs-pulse{0%,${pct(reach(0))}%{transform:translateY(0);opacity:0}${pct(reach(0) + 0.2)}%{opacity:1}${pct(reach(4))}%{transform:translateY(${4 * DY}px);opacity:1}${pct(reach(4) + 0.4)}%,100%{transform:translateY(${4 * DY}px);opacity:0}}
.hs-node{position:absolute;left:20px;right:16px;top:calc(${Y0}px + var(--i) * ${DY}px);height:40px;margin-top:-20px;display:flex;align-items:center;gap:12px}
.hs-c{position:relative;flex:0 0 36px;width:36px;height:36px;border-radius:50%;background:#F6F3EE;box-shadow:inset 0 0 0 1px rgba(12,12,11,.08);display:grid;place-items:center;color:var(--hs-ink);z-index:3}
.hs-c svg.hs-ic{width:16px;height:16px}
.hs-on{position:absolute;inset:0;border-radius:50%;background:var(--hs-accent);display:grid;place-items:center;opacity:0}
.hs-on svg{width:14px;height:14px}
.hs-tx{min-width:0;opacity:.45}
.hs-tx strong{display:block;font-size:13px;font-weight:800;letter-spacing:-.2px;color:var(--hs-ink);line-height:1.25}
.hs-tx small{display:block;font-size:11px;color:var(--hs-muted);margin-top:2px;white-space:nowrap;line-height:1.25}
.hs-last .hs-c{background:var(--hs-ink);color:#fff}
.hs-last .hs-c::after{content:'';position:absolute;inset:-5px;border-radius:50%;box-shadow:0 0 0 2px var(--hs-accent);opacity:0;animation:hs-ring var(--hs-T) ease-out infinite}
@keyframes hs-ring{0%,${pct(reach(4))}%{opacity:0;transform:scale(.8)}${pct(reach(4) + 0.3)}%{opacity:1;transform:scale(1)}${pct(reach(4) + 1.6)}%,100%{opacity:0;transform:scale(1.35)}}
${stepKeyframes}

/* ── MagicBNB card ── */
.hs-result{top:464px;height:176px;padding:20px}
.hs-num{display:block;font-size:30px;font-weight:900;letter-spacing:-.04em;line-height:1;margin:16px 0 8px;white-space:nowrap;color:var(--hs-ink);word-spacing:-.18em}
.hs-num span{color:var(--hs-accent);font-weight:800}
.hs-lab{display:block;font-size:13px;font-weight:600;color:var(--hs-ink);line-height:1.35}
.hs-src{display:block;font-size:11px;color:var(--hs-muted);margin-top:4px;line-height:1.4}
.hs-fig-tx{display:block}
.hs-sep{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.hs-sp{position:absolute;right:20px;top:16px;width:56px;height:24px}

/* ── sizes: scale the whole 600 x 640 stage down with the column ── */
@media (max-width:1359.98px){.hs-wrap{--s:.9}}
@media (max-width:1199.98px){.hs-wrap{--s:.8}}
@media (max-width:1099.98px){.hs-wrap{--s:.68}}

/* ── stacked (tablet and phone): frame full width up to 360px, pipeline as a
   horizontal five-step rail, MagicBNB as an inline chip ── */
@media (max-width:959.98px){
  /* The MagicBNB pill under the buttons already shows this figure on phones. */
  .hs-result{display:none !important}
  .hs-wrap{width:100%;max-width:360px;height:auto;margin:0 auto;text-align:left}
  .hs-stage{position:relative;width:100%;height:auto;transform:none;display:flex;flex-direction:column;gap:12px}
  .hs-frame{position:relative;width:100%;height:auto;aspect-ratio:9/16}
  .hs-side{position:static;width:100%;height:auto;display:flex;flex-direction:column;gap:12px}
  .hs-card{position:relative;left:auto;top:auto;width:100%;height:auto;border-radius:16px}
  .hs-pipe{padding:14px 12px 14px}
  .hs-hd{padding:0 4px}
  .hs-nodes{position:relative;inset:auto;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));margin-top:14px}
  .hs-rail{left:10%;right:10%;top:17px;width:auto;height:2px;margin:0}
  .hs-rail i{transform-origin:left;transform:scaleX(0);animation-name:hs-railx}
  .hs-pulse{display:none}
  .hs-node{position:relative;left:auto;right:auto;top:auto;height:auto;margin:0;flex-direction:column;gap:6px;text-align:center}
  .hs-c{flex:0 0 auto;width:34px;height:34px}
  .hs-tx strong{font-size:11.5px;letter-spacing:-.1px}
  .hs-tx small{display:none}
  .hs-result{display:grid;grid-template-columns:auto 1fr;column-gap:14px;align-items:center;padding:12px 16px}
  .hs-result .hs-kick{grid-column:1 / -1;margin-bottom:4px}
  .hs-sp{display:none}
  .hs-num{margin:0;font-size:22px}
  .hs-fig-tx{font-size:12px;line-height:1.4}
  .hs-lab,.hs-src{display:inline;font-size:12px;margin:0;font-weight:500;color:var(--hs-muted)}
  .hs-lab{color:var(--hs-ink);font-weight:600}
  .hs-sep{position:static;width:auto;height:auto;overflow:visible;clip:auto}
  .hs-br{display:none}
}

/* ── finished state ── */
@media (prefers-reduced-motion: reduce){${finished('.hs-wrap')}}
${finished('.hs-wrap[data-static]')}
`;
