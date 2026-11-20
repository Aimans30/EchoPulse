'use client';

import { useCallback, useRef, useState } from 'react';
import { Film } from 'lucide-react';
import { VisualFrame, StepMark, Clip, useVisual } from './VisualFrame';

/**
 * Video editing: a real edited reel from the portfolio plays in the editor
 * preview. The timeline under it is drawn from the same clip (its frames, its
 * motion graphic at 5 s and its caption beats), and the playhead follows the
 * video. On the right the edit pass ticks through, ending on "Ready to post".
 */

const CLOUD = 'https://res.cloudinary.com/du6yx2h01/video/upload';
const ID = 'patern_intrupt_sdrd8w';
const LEN = 8;
const START = 10;
const SRC = `${CLOUD}/so_${START},du_${LEN},c_scale,w_360,q_auto,f_mp4,ac_none/${ID}.mp4`;
const POSTER = `${CLOUD}/so_12.2,c_scale,w_360,q_auto,f_auto/${ID}.jpg`;
const frame = (t: number) => `${CLOUD}/so_${t},c_scale,w_72,q_auto,f_auto/${ID}.jpg`;

// The segment runs from 10 s to 18 s of the reel: talking head with captions,
// then a motion graphic from 5 s. Clip times below are relative to the segment.
const V1: { from: number; to: number; frames: number[] }[] = [
  { from: 0, to: 2.6, frames: [10.3, 11.4] },
  { from: 2.6, to: 5, frames: [12.8, 13.8] },
  { from: 5, to: 8, frames: [19.2, 19.8] },
];
const BROLL = { from: 5, to: 8, frames: [15.4, 16.6, 17.6] };
// Caption beats, read off the clip's burned-in captions.
const CAPTIONS: [number, number][] = [[0, 1.2], [1.3, 2.6], [2.7, 3.8], [3.9, 4.9]];
const WAVE = Array.from({ length: 64 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 1.7) * 0.6 + Math.sin(i * 0.45) * 0.4);
  return 0.18 + v * 0.82;
});

const PASS = [
  'Cut pauses and retakes',
  'Branded captions',
  'Motion graphics and b-roll',
  'Colour and sound mix',
  'Exports for every platform',
];
const STATUS = ['Cutting', 'Captions', 'Graphics', 'Mixing', 'Exporting', 'Ready to post'];
const DURATIONS = [1600, 1600, 1600, 1600, 1600, 4200] as const;

const pct = (t: number) => `${(t / LEN) * 100}%`;
const fmt = (t: number) => `0:0${Math.min(LEN, Math.floor(t))}`;

export default function VideoEditingVisual({ accent }: { accent: string }) {
  const v = useVisual(DURATIONS);
  const playheadRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(2.2);

  const onTime = useCallback((cur: number, dur: number) => {
    const x = Math.min(1, cur / Math.min(dur, LEN));
    if (playheadRef.current) playheadRef.current.style.left = `${x * 100}%`;
    setT((prev) => (Math.abs(prev - cur) > 0.2 ? cur : prev));
  }, []);

  const done = v.step === PASS.length;

  return (
    <VisualFrame
      accent={accent}
      frameRef={v.ref}
      title="Founder reel, cut 3"
      icon={<Film size={14} strokeWidth={2} />}
      status={STATUS[v.step]}
      statusDone={done}
      label="A video editor playing a finished vertical reel with captions, its timeline, and an edit checklist ending in ready to post."
    >
      <div className="ve">
        <div className="ve-top">
          <div className="ve-preview">
            <Clip className="ve-video" src={SRC} poster={POSTER} play={v.active} reduce={v.reduce} onTime={onTime} />
            <span className="ve-tc">{fmt(t)} / 0:0{LEN}</span>
          </div>

          <div className="ve-pass sv-panel">
            <div className="sv-label">Edit pass</div>
            <ul>
              {PASS.map((p, i) => {
                const state = i < v.step ? 'done' : i === v.step ? 'busy' : 'idle';
                return (
                  <li key={p} className={state === 'idle' ? 've-row ve-row-idle' : 've-row'}>
                    <StepMark state={state} />
                    <span>{p}</span>
                  </li>
                );
              })}
            </ul>
            <div className="ve-formats">
              {['9:16', '1:1', '16:9'].map((f) => (
                <span key={f} className={done ? 've-fmt ve-fmt-on' : 've-fmt'}>{f}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="ve-tl">
          <div className="ve-ruler">
            <span className="ve-tag" />
            <div className="ve-lane">
              {[0, 2, 4, 6, 8].map((s) => (
                <span key={s} className="ve-tick" style={{ left: pct(s) }}>{s}s</span>
              ))}
            </div>
          </div>
          <div className="ve-track ve-track-v2">
            <span className="ve-tag">V2</span>
            <div className="ve-lane">
              <div className="ve-clip ve-broll" style={{ left: pct(BROLL.from), width: pct(BROLL.to - BROLL.from) }}>
                {BROLL.frames.map((f) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={f} src={frame(f)} alt="Frame from a founder reel edit" loading="lazy" decoding="async" />
                ))}
              </div>
            </div>
          </div>
          <div className="ve-track ve-track-v1">
            <span className="ve-tag">V1</span>
            <div className="ve-lane">
              {V1.map((c) => (
                <div key={c.from} className="ve-clip" style={{ left: pct(c.from), width: `calc(${pct(c.to - c.from)} - 2px)` }}>
                  {c.frames.map((f) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={f} src={frame(f)} alt="Frame from a founder reel edit" loading="lazy" decoding="async" />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="ve-track ve-track-cc">
            <span className="ve-tag">CC</span>
            <div className="ve-lane">
              {CAPTIONS.map(([a, b]) => (
                <span
                  key={a}
                  className={t >= a && t < b ? 've-cap ve-cap-on' : 've-cap'}
                  style={{ left: pct(a), width: `calc(${pct(b - a)} - 2px)` }}
                />
              ))}
            </div>
          </div>
          <div className="ve-track ve-track-a1">
            <span className="ve-tag">A1</span>
            <div className="ve-lane ve-wave">
              {WAVE.map((h, i) => (
                <i key={i} style={{ height: `${h * 100}%` }} />
              ))}
            </div>
          </div>
          <div className="ve-playhead-lane">
            <div ref={playheadRef} className="ve-playhead" style={{ left: pct(2.2) }} />
          </div>
        </div>
      </div>
      <style>{CSS}</style>
    </VisualFrame>
  );
}

const CSS = `
.ve { display: flex; flex-direction: column; gap: 12px; height: 100%; }
.ve-top { display: flex; gap: 12px; height: 232px; flex: none; }
.ve-preview {
  position: relative;
  flex: none;
  height: 100%;
  aspect-ratio: 9 / 16;
  border-radius: 10px;
  overflow: hidden;
  background: #0C0C0B;
  border: 1px solid var(--border);
}
.ve-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.ve-tc {
  position: absolute; left: 8px; bottom: 8px;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(12,12,11,0.72);
  font-size: 10.5px; font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}
.ve-pass { flex: 1; min-width: 0; padding: 12px; display: flex; flex-direction: column; }
.ve-pass ul { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.ve-row {
  display: flex; align-items: center; gap: 8px;
  min-height: 30px;
  font-size: 12.5px; line-height: 1.3;
  color: var(--ink);
  transition: color 0.3s;
}
.ve-row-idle { color: var(--faint); }
.ve-formats { margin-top: auto; display: flex; gap: 6px; }
.ve-fmt {
  flex: 1;
  height: 24px;
  display: grid; place-items: center;
  border-radius: 6px;
  border: 1px solid var(--border);
  font-size: 11px; font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--faint);
  transition: all 0.4s;
}
.ve-fmt-on { color: var(--ink); border-color: color-mix(in srgb, var(--acc) 50%, transparent); background: color-mix(in srgb, var(--acc) 12%, transparent); }

.ve-tl { position: relative; flex: 1; display: flex; flex-direction: column; gap: 4px; padding-top: 12px; border-top: 1px solid var(--line); }
.ve-ruler, .ve-track { display: flex; align-items: stretch; gap: 8px; }
.ve-tag { flex: none; width: 20px; font-size: 10px; font-weight: 600; letter-spacing: 0.06em; color: var(--faint); display: flex; align-items: center; }
.ve-lane { position: relative; flex: 1; }
.ve-ruler { height: 14px; }
.ve-tick { position: absolute; top: 0; font-size: 10px; color: var(--faint); font-variant-numeric: tabular-nums; transform: translateX(-50%); }
.ve-tick:first-child { transform: none; }
.ve-tick:last-child { transform: translateX(-100%); }
.ve-track-v2 { height: 20px; }
.ve-track-v1 { height: 30px; }
.ve-track-cc { height: 10px; }
.ve-track-a1 { height: 18px; }
.ve-clip {
  position: absolute; top: 0; bottom: 0;
  display: flex;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--acc) 55%, transparent);
  background: #0C0C0B;
}
.ve-clip img { flex: 1; min-width: 0; height: 100%; object-fit: cover; display: block; opacity: 0.85; }
.ve-broll { border-color: rgba(242,238,231,0.35); }
.ve-cap {
  position: absolute; top: 0; bottom: 0;
  border-radius: 3px;
  background: color-mix(in srgb, var(--acc) 32%, transparent);
  transition: background-color 0.2s;
}
.ve-cap-on { background: var(--acc); }
.ve-wave { display: flex; align-items: center; gap: 2px; }
.ve-wave i { flex: 1; min-width: 1px; border-radius: 1px; background: rgba(242,238,231,0.22); }
.ve-playhead-lane { position: absolute; top: 12px; bottom: 0; left: 28px; right: 0; pointer-events: none; }
.ve-playhead { position: absolute; top: 0; bottom: 0; width: 1.5px; margin-left: -0.75px; background: var(--ink); box-shadow: 0 0 8px rgba(0,0,0,0.6); }
.ve-playhead::before { content: ''; position: absolute; top: 0; left: -3.5px; width: 8px; height: 8px; border-radius: 2px; background: var(--ink); }
`;
