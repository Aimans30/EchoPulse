'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, Trophy } from 'lucide-react';
import { EASE } from '@/lib/motion';
import { VisualFrame, Clip, useVisual } from './VisualFrame';

/**
 * Ad creatives: four real ads from the portfolio, one offer with four hooks,
 * run as a test. The example hold-rate bars fill, one variant is marked the
 * winner and plays, and the next round is briefed from it. The bars carry no
 * numbers and are labelled as example data.
 */

type Variant = { hook: string; angle: string; cloud: string; id: string; still: number; hold: number; winner?: boolean };

const VARIANTS: Variant[] = [
  { hook: 'Bold claim', angle: 'Number first', cloud: 'dkzhqy2od', id: 'c8_xe62qr', still: 4, hold: 0.52 },
  { hook: 'Talking head', angle: 'To camera', cloud: 'dkzhqy2od', id: 'ugc_sample_1_m8mnqj', still: 1, hold: 0.86, winner: true },
  { hook: 'Problem', angle: 'Pain first', cloud: 'dkzhqy2od', id: 'c13_ttg4ix', still: 1, hold: 0.64 },
  { hook: 'Lifestyle', angle: 'The outcome', cloud: 'dkzhqy2od', id: 'c16_h5bzrt', still: 4, hold: 0.41 },
];
const base = (v: Variant) => `https://res.cloudinary.com/${v.cloud}/video/upload`;
const poster = (v: Variant) => `${base(v)}/so_${v.still},c_scale,w_240,q_auto,f_auto/${v.id}.jpg`;
const preview = (v: Variant) => `${base(v)}/so_0,du_6,c_scale,w_240,q_auto:low,f_mp4,ac_none/${v.id}.mp4`;
const LETTERS = ['A', 'B', 'C', 'D'];
const WINNER = VARIANTS.findIndex((x) => x.winner);

// 0 variants in, 1 bars fill, 2 winner, 3 next round
const DURATIONS = [1400, 2000, 3600, 3000] as const;
const STATUS = ['Testing', 'Testing', 'Winner: B', 'Next round'];
const FOOT = [
  'Same offer and budget for all four',
  'Same offer and budget for all four',
  'B keeps viewers watching longest',
  'Next round: three new cuts of hook B',
];

export default function AdCreativesVisual({ accent }: { accent: string }) {
  const v = useVisual(DURATIONS);
  const { step } = v;
  const decided = step >= 2;

  return (
    <VisualFrame
      accent={accent}
      frameRef={v.ref}
      title="Hook test, one offer"
      icon={<LayoutGrid size={14} strokeWidth={2} />}
      status={STATUS[step]}
      statusDone={decided}
      label="Four ad variants of one offer with different hooks, tested side by side, with one marked as the winner."
    >
      <div className="ad">
        <div className="ad-grid">
          {VARIANTS.map((x, i) => {
            const win = decided && x.winner;
            const dim = decided && !x.winner;
            return (
              <motion.div
                key={x.id}
                className="ad-cell"
                initial={v.reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: dim ? 0.45 : 1, y: 0 }}
                transition={{ duration: 0.5, delay: step === 0 ? i * 0.08 : 0, ease: EASE.out }}
              >
                <div className={win ? 'ad-tile ad-tile-win' : 'ad-tile'}>
                  {x.winner ? (
                    <Clip className="ad-media" src={preview(x)} poster={poster(x)} play={v.active && decided} reduce={v.reduce} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="ad-media" src={poster(x)} alt="" loading="lazy" decoding="async" />
                  )}
                  <span className="ad-letter">{LETTERS[i]}</span>
                  {win && (
                    <motion.span
                      className="ad-win"
                      initial={v.reduce ? false : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease: EASE.out }}
                    >
                      <Trophy size={11} strokeWidth={2.4} />
                      Winner
                    </motion.span>
                  )}
                </div>
                <span className="ad-hook">
                  <span>{x.hook}</span>
                  <span className="ad-angle">{x.angle}</span>
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="ad-panel sv-panel">
          <div className="ad-panel-head">
            <span className="sv-label">3-second hold</span>
            <span className="ad-example">Example data</span>
          </div>
          {VARIANTS.map((x, i) => (
            <div key={x.id} className={decided && i === WINNER ? 'ad-bar-row ad-bar-row-win' : 'ad-bar-row'}>
              <span className="ad-bar-l">{LETTERS[i]}</span>
              <span className="ad-bar-track">
                <motion.i
                  key={v.cycle}
                  initial={v.reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: step >= 1 ? x.hold : 0 }}
                  transition={{ duration: 1.2, delay: step === 1 ? i * 0.1 : 0, ease: EASE.out }}
                />
              </span>
            </div>
          ))}
          <div className="ad-foot">{FOOT[step]}</div>
        </div>
      </div>
      <style>{CSS}</style>
    </VisualFrame>
  );
}

const CSS = `
.ad { display: flex; flex-direction: column; gap: 12px; height: 100%; }
.ad-grid { flex: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
.ad-cell { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.ad-tile {
  position: relative;
  aspect-ratio: 9 / 16;
  max-height: 184px;
  border-radius: 10px;
  overflow: hidden;
  background: #0C0C0B;
  border: 1px solid var(--border);
  transition: box-shadow 0.4s, border-color 0.4s;
}
.ad-tile-win { border-color: var(--acc); box-shadow: 0 0 0 2px color-mix(in srgb, var(--acc) 35%, transparent); }
.ad-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.ad-letter {
  position: absolute; top: 6px; left: 6px;
  width: 20px; height: 20px; border-radius: 6px;
  display: grid; place-items: center;
  font-size: 10.5px; font-weight: 700;
  color: var(--ink); background: rgba(12,12,11,0.72);
}
.ad-win {
  position: absolute; left: 6px; right: 6px; bottom: 6px;
  height: 22px;
  display: flex; align-items: center; justify-content: center; gap: 4px;
  border-radius: 6px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  color: #0C0C0B; background: var(--acc);
}
.ad-hook { display: flex; flex-direction: column; font-size: 12px; font-weight: 600; line-height: 1.35; min-width: 0; }
.ad-hook span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ad-hook .ad-angle { font-size: 11px; font-weight: 400; color: var(--faint); }
.ad-foot { margin-top: 3px; padding-top: 8px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); }
.ad-panel { margin-top: auto; padding: 12px 14px; display: flex; flex-direction: column; gap: 5px; }
.ad-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1px; }
.ad-example { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--faint); }
.ad-bar-row { display: flex; align-items: center; gap: 10px; height: 12px; }
.ad-bar-l { width: 12px; font-size: 11px; font-weight: 700; color: var(--faint); }
.ad-bar-track { position: relative; flex: 1; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.05); overflow: hidden; }
.ad-bar-track i { position: absolute; inset: 0; border-radius: 3px; background: rgba(242,238,231,0.32); transform-origin: left; }
.ad-bar-row-win .ad-bar-l { color: var(--acc); }
.ad-bar-row-win .ad-bar-track i { background: var(--acc); }
`;
