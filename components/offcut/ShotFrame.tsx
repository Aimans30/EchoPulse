import Image from 'next/image';

/**
 * A REAL Offcut screenshot shown inside a skeleton context, drawn in HTML/CSS.
 *
 * The context (browser page with a video, browser page with a vertical reel,
 * or a desktop app window) is deliberately plain: neutral grey blocks, no
 * text, no logos and no copy of any real site's layout. The screenshot is the
 * only detailed thing in the frame. Without a screenshot the frame shows a
 * skeleton panel instead and is tagged "Sketch", so it never passes for a
 * real capture.
 *
 * Kinds:
 *   video    browser window, wide video block with a sidebar; shot floats in
 *            as the Offcut panel
 *   reel     browser window, vertical video block (desktop reels page);
 *            shot floats in beside it. Offcut runs on Windows, so this is a
 *            desktop browser on purpose, not a phone.
 *   split    app window; shot fills it (hook / body / call to action view)
 *   library  app window; shot fills it (saved scripts)
 *
 * Motion lives in CSS keyed off the `is-in` / `is-visible` classes that
 * <Reveal track> adds on a parent: panel slides in, skeleton lines appear one
 * by one, a soft shimmer runs only while the frame is on screen. Reduced
 * motion shows the final state with no shimmer.
 */

export type Shot = { src: string; alt: string; width: number; height: number };
export type FrameKind = 'video' | 'reel' | 'split' | 'library';

const lines = (n: number, widths: number[], start = 0) =>
  Array.from({ length: n }, (_, i) => (
    <span key={i} className="sf-line" style={{ width: `${widths[i % widths.length]}%`, ['--i' as string]: start + i }} />
  ));

function Panel({ shot }: { shot?: Shot }) {
  if (shot) {
    return (
      <div className="sf-panel sf-panel-shot">
        <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 860px) 60vw, 280px" />
      </div>
    );
  }
  return (
    <div className="sf-panel sf-panel-sk" aria-hidden="true">
      <span className="sf-panel-head"><i /><span className="sf-line" style={{ width: '46%', ['--i' as string]: 0 }} /></span>
      {lines(5, [92, 84, 96, 70, 58], 1)}
    </div>
  );
}

function BrowserBody({ kind, shot }: { kind: 'video' | 'reel'; shot?: Shot }) {
  return (
    <div className="sf-body">
      {kind === 'video' ? (
        <div className="sf-video" aria-hidden="true">
          <div className="sf-main">
            <span className="sf-block sf-player" />
            <span className="sf-bar" style={{ width: '72%' }} />
            <span className="sf-bar sf-bar-thin" style={{ width: '44%' }} />
            <span className="sf-row"><i className="sf-dot" /><span className="sf-bar sf-bar-thin" style={{ width: '30%' }} /></span>
          </div>
          <div className="sf-side">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="sf-thumbrow"><span className="sf-block sf-thumb" /><span className="sf-thumbtext"><span className="sf-bar sf-bar-thin" style={{ width: '90%' }} /><span className="sf-bar sf-bar-thin" style={{ width: '60%' }} /></span></span>
            ))}
          </div>
        </div>
      ) : (
        <div className="sf-reel" aria-hidden="true">
          <div className="sf-nav">
            {[60, 48, 54, 40].map((w, i) => <span key={i} className="sf-row"><i className="sf-dot sf-dot-s" /><span className="sf-bar sf-bar-thin" style={{ width: `${w}%` }} /></span>)}
          </div>
          <div className="sf-reelcol">
            <span className="sf-block sf-reelbox">
              <span className="sf-reelcap"><span className="sf-bar sf-bar-thin sf-bar-on" style={{ width: '70%' }} /><span className="sf-bar sf-bar-thin sf-bar-on" style={{ width: '46%' }} /></span>
            </span>
            <span className="sf-actions">{[0, 1, 2, 3].map((i) => <i key={i} className="sf-dot" />)}</span>
          </div>
        </div>
      )}
      <span className="sf-shimmer" aria-hidden="true" />
      <Panel shot={shot} />
    </div>
  );
}

function AppBody({ kind, shot }: { kind: 'split' | 'library'; shot?: Shot }) {
  return (
    <div className="sf-body">
      {kind === 'split' ? (
        <div className="sf-split" aria-hidden="true">
          <span className="sf-bar sf-title" style={{ width: '52%' }} />
          {[
            { c: 'hook', n: 2, w: [88, 54] },
            { c: 'body', n: 3, w: [94, 86, 62] },
            { c: 'cta', n: 2, w: [80, 40] },
          ].map((s, k) => (
            <span key={s.c} className={`sf-seg sf-seg-${s.c}`}>{lines(s.n, s.w, k * 3)}</span>
          ))}
        </div>
      ) : (
        <div className="sf-lib" aria-hidden="true">
          <div className="sf-list">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={i === 1 ? 'sf-item sf-item-on' : 'sf-item'}><span className="sf-bar sf-bar-thin" style={{ width: `${[78, 66, 84, 58, 72][i]}%` }} /><span className="sf-bar sf-bar-thin sf-bar-faint" style={{ width: '40%' }} /></span>
            ))}
          </div>
          <div className="sf-read">
            <span className="sf-bar sf-title" style={{ width: '60%' }} />
            {lines(7, [96, 90, 94, 72, 88, 92, 50], 0)}
          </div>
        </div>
      )}
      <span className="sf-shimmer" aria-hidden="true" />
      {shot && (
        <div className="sf-fill">
          <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 860px) 92vw, 560px" />
        </div>
      )}
    </div>
  );
}

export default function ShotFrame({ kind, shot }: { kind: FrameKind; shot?: Shot }) {
  const browser = kind === 'video' || kind === 'reel';
  return (
    <div className={`sf sf--${kind}${shot ? ' sf-has-shot' : ''}`}>
      <div className="sf-chrome" aria-hidden="true">
        <span className="sf-dots"><i /><i /><i /></span>
        {browser ? <span className="sf-addr" /> : <span className="sf-apptitle" />}
        <span className="sf-tag">{shot ? 'Real app, sample data' : 'Sketch'}</span>
      </div>
      {browser ? <BrowserBody kind={kind} shot={shot} /> : <AppBody kind={kind} shot={shot} />}
      <style href="offcut-shotframe" precedence="default">{SHOTFRAME_CSS}</style>
    </div>
  );
}

const SHOTFRAME_CSS = `
.sf { --sk: rgba(12,12,11,0.07); --sk-2: rgba(12,12,11,0.045); --sk-line: rgba(12,12,11,0.1);
  position: relative; border-radius: 12px; border: 1px solid rgba(12,12,11,0.1); background: #FFFFFF; overflow: hidden;
  box-shadow: 0 1px 2px rgba(12,12,11,0.04); }
.sf *, .sf *::before, .sf *::after { box-sizing: border-box; }
.sf i { display: block; font-style: normal; }
.sf-chrome { display: flex; align-items: center; gap: 12px; height: 36px; padding: 0 12px; border-bottom: 1px solid rgba(12,12,11,0.07); background: #FBF9F5; }
.sf-dots { display: flex; gap: 5px; flex: none; }
.sf-dots i { width: 8px; height: 8px; border-radius: 50%; background: rgba(12,12,11,0.12); }
.sf-addr { flex: 1; max-width: 260px; height: 18px; border-radius: 999px; background: var(--sk-2); }
.sf-apptitle { flex: 1; max-width: 90px; height: 8px; border-radius: 999px; background: var(--sk); }
.sf-tag { flex: none; margin-left: auto; height: 20px; padding: 0 8px; display: inline-flex; align-items: center; border-radius: 999px; border: 1px solid rgba(12,12,11,0.12); font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #625E56; white-space: nowrap; }
.sf-has-shot .sf-tag { color: #0C0C0B; border-color: rgba(232,84,26,0.5); }
.sf-body { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: #FFFFFF; }

.sf-block { display: block; border-radius: 8px; background: var(--sk); }
.sf-bar { display: block; height: 8px; border-radius: 999px; background: var(--sk); }
.sf-bar-thin { height: 6px; }
.sf-bar-faint { background: var(--sk-2); }
.sf-bar-on { background: rgba(255,255,255,0.55); }
.sf-row { display: flex; align-items: center; gap: 8px; }
.sf-dot { flex: none; width: 18px; height: 18px; border-radius: 50%; background: var(--sk); }
.sf-dot-s { width: 12px; height: 12px; }
.sf-line { display: block; height: 6px; border-radius: 999px; background: var(--sk-line); }

/* video */
.sf-video { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 3fr); gap: 4%; padding: 4%; }
.sf-main { display: grid; align-content: start; gap: 8px; }
.sf-player { aspect-ratio: 16 / 9; margin-bottom: 4px; }
.sf-side { display: grid; align-content: start; gap: 8px; }
.sf-thumbrow { display: grid; grid-template-columns: 46% minmax(0, 1fr); gap: 6px; }
.sf-thumb { aspect-ratio: 16 / 9; border-radius: 4px; }
.sf-thumbtext { display: grid; align-content: start; gap: 4px; padding-top: 2px; }
.sf-thumbtext .sf-bar-thin { height: 4px; }

/* reel */
.sf-reel { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 7fr); gap: 4%; padding: 4%; }
.sf-nav { display: grid; align-content: start; gap: 12px; padding-top: 4px; }
.sf-reelcol { display: flex; align-items: flex-end; gap: 10px; height: 100%; }
.sf-reelbox { position: relative; height: 100%; aspect-ratio: 9 / 16; border-radius: 10px; background: rgba(12,12,11,0.11); }
.sf-reelcap { position: absolute; left: 10%; right: 10%; bottom: 7%; display: grid; gap: 5px; }
.sf-actions { display: grid; gap: 10px; padding-bottom: 6%; }

/* app: split */
.sf-split { position: absolute; inset: 0; display: grid; align-content: center; gap: 10px; padding: 5% 6%; }
.sf-title { height: 10px; margin-bottom: 4px; background: rgba(12,12,11,0.12); }
.sf-seg { position: relative; display: grid; gap: 7px; padding: 10px 12px 10px 16px; border-radius: 8px; border: 1px solid rgba(12,12,11,0.06); background: #FBF9F5; }
.sf-seg::before { content: ""; position: absolute; left: 0; top: 10px; bottom: 10px; width: 3px; border-radius: 0 3px 3px 0; }
.sf-seg-hook::before { background: #E8541A; }
.sf-seg-body::before { background: rgba(12,12,11,0.25); }
.sf-seg-cta::before { background: #0C0C0B; }

/* app: library */
.sf-lib { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); }
.sf-list { display: grid; align-content: start; gap: 4px; padding: 10px 8px; border-right: 1px solid rgba(12,12,11,0.06); background: #FBF9F5; }
.sf-item { display: grid; gap: 5px; padding: 8px; border-radius: 6px; }
.sf-item-on { background: #FFFFFF; box-shadow: inset 2px 0 0 #E8541A, 0 0 0 1px rgba(12,12,11,0.06); }
.sf-read { display: grid; align-content: start; gap: 9px; padding: 7% 8%; }

/* Offcut panel over the browser page */
.sf-panel { position: absolute; z-index: 2; right: 4%; bottom: 6%; width: 44%; border-radius: 10px; background: #FFFFFF; border: 1px solid rgba(12,12,11,0.12); box-shadow: 0 18px 40px -16px rgba(12,12,11,0.35), 0 2px 6px rgba(12,12,11,0.06); overflow: hidden; }
.sf-reel ~ .sf-panel { right: 4%; width: 40%; }
.sf-panel-sk { display: grid; gap: 8px; padding: 12px; }
.sf-panel-head { display: flex; align-items: center; gap: 8px; padding-bottom: 8px; margin-bottom: 2px; border-bottom: 1px solid rgba(12,12,11,0.06); }
.sf-panel-head i { width: 8px; height: 8px; border-radius: 50%; background: #E8541A; flex: none; }
.sf-panel-head .sf-line { height: 7px; background: rgba(12,12,11,0.16); }
.sf-panel-shot { max-height: 88%; }
.sf-panel-shot img, .sf-fill img { display: block; width: 100%; height: auto; }
.sf-fill { position: absolute; inset: 0; z-index: 2; background: #141312; }
.sf-fill img { height: 100%; object-fit: contain; object-position: center; }

/* shimmer: one compositor-only band per frame, only while on screen */
.sf-shimmer { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: linear-gradient(100deg, transparent 35%, rgba(255,255,255,0.7) 50%, transparent 65%); transform: translate3d(-100%, 0, 0); }
.is-visible .sf-shimmer { animation: sf-shimmer 2.8s ease-in-out 0.8s infinite; }
@keyframes sf-shimmer { 0% { transform: translate3d(-100%, 0, 0); } 60%, 100% { transform: translate3d(100%, 0, 0); } }

/* entrance: lines appear in order, the panel slides in */
.rv .sf-line { opacity: 0; transform: translate3d(-6px, 0, 0); }
.rv.is-in .sf-line { animation: sf-line .5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: calc(var(--i, 0) * 80ms + 350ms); }
.rv .sf-panel { opacity: 0; transform: translate3d(0, 12px, 0); }
.rv.is-in .sf-panel { animation: sf-panel .6s cubic-bezier(0.16, 1, 0.3, 1) .25s forwards; }
@keyframes sf-line { to { opacity: 1; transform: none; } }
@keyframes sf-panel { to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) {
  .is-visible .sf-shimmer { animation: none; }
  .rv .sf-line, .rv .sf-panel, .rv.is-in .sf-line, .rv.is-in .sf-panel { opacity: 1; transform: none; animation: none; }
}
@media (max-width: 480px) {
  .sf-chrome { height: 32px; }
  .sf-tag { font-size: 9px; }
  .sf-panel-sk { gap: 6px; padding: 10px; }
}
`;
