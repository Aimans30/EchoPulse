'use client';

import { motion } from 'framer-motion';
import { FileText, Link2 } from 'lucide-react';
import { EASE } from '@/lib/motion';
import { VisualFrame, StepMark, TypeText, useVisual } from './VisualFrame';

/**
 * Blog production: an article moves from outline to draft, its sources are
 * attached to the claims, and it goes live on the client's own blog.
 */

const OUTLINE = ['Questions', 'Costs', 'Red flags', 'FAQ'];
const PARA = 'Ask who will treat you on every visit, and how soon you can be seen.';
const SOURCES = [
  { n: 1, text: 'physio-association.org' },
  { n: 2, text: 'Interview: lead physio' },
];
// Widths of the draft lines that follow the written paragraph.
const LINES = [[100, 72], [96, 58]];

// 0 outline, 1 writing, 2 body, 3 sources, 4 published
const DURATIONS = [1400, 2200, 1400, 1600, 4200] as const;
const STATUS = ['Outlining', 'Writing', 'Writing', 'Adding sources', 'Published'];

export default function BlogVisual({ accent }: { accent: string }) {
  const v = useVisual(DURATIONS);
  const { step } = v;
  const live = step === 4;

  return (
    <VisualFrame
      accent={accent}
      frameRef={v.ref}
      title="Article draft"
      icon={<FileText size={14} strokeWidth={2} />}
      status={STATUS[step]}
      statusDone={live}
      label="An article draft with its outline, sources attached to its claims, and a published state on your blog."
    >
      <div className="bl">
        <aside className="bl-outline">
          <div className="sv-label">Outline</div>
          <ol>
            {OUTLINE.map((o, i) => {
              const state = step >= 3 || (step === 2 && i < 2) ? 'done' : (step === 1 && i === 0) || (step === 2 && i === 2) ? 'busy' : 'idle';
              return (
                <motion.li
                  key={`${v.cycle}-${o}`}
                  className={state === 'idle' ? 'bl-oi bl-oi-idle' : 'bl-oi'}
                  initial={v.reduce ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.18, ease: EASE.out }}
                >
                  <StepMark state={live ? 'done' : state} />
                  <span>{o}</span>
                </motion.li>
              );
            })}
          </ol>
        </aside>

        <div className="bl-doc">
          <div className="bl-h1">Choosing a physio clinic</div>
          <div className="bl-h2">What to ask first</div>
          <div className="bl-p">
            <TypeText
              key={v.cycle}
              text={PARA}
              run={step >= 1}
              full={v.reduce}
              cps={70}
              suffix={<sup className={step >= 3 ? 'bl-ref bl-ref-on' : 'bl-ref'}>1</sup>}
            />
          </div>
          <Lines widths={LINES[0]} on={step >= 2} cycle={v.cycle} delay={0} />
          <motion.div
            className="bl-h2"
            initial={false}
            animate={{ opacity: step >= 2 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: step === 2 ? 0.3 : 0 }}
          >
            Costs, explained<sup className={step >= 3 ? 'bl-ref bl-ref-on' : 'bl-ref'}>2</sup>
          </motion.div>
          <Lines widths={LINES[1]} on={step >= 2} cycle={v.cycle} delay={0.4} />

          <div className="bl-sources">
            <div className="sv-label">Sources</div>
            {SOURCES.map((s, i) => (
              <motion.div
                key={s.n}
                className="bl-src"
                initial={false}
                animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 6 }}
                transition={{ duration: 0.35, delay: step === 3 ? i * 0.2 : 0, ease: EASE.out }}
              >
                <span className="bl-src-n">{s.n}</span>
                <Link2 size={13} strokeWidth={2} />
                <span className="bl-src-text">{s.text}</span>
              </motion.div>
            ))}
          </div>

          <div className={live ? 'bl-pub bl-pub-on' : 'bl-pub'}>
            <span className="bl-url">yoursite.com/blog/physio</span>
            <span className="bl-live">{live ? 'Live' : 'Draft'}</span>
          </div>
        </div>
      </div>
      <style>{CSS}</style>
    </VisualFrame>
  );
}

function Lines({ widths, on, cycle, delay }: { widths: number[]; on: boolean; cycle: number; delay: number }) {
  return (
    <div className="bl-lines">
      {widths.map((w, i) => (
        <motion.i
          key={`${cycle}-${i}`}
          initial={false}
          animate={{ scaleX: on ? 1 : 0 }}
          transition={{ duration: 0.5, delay: on ? delay + i * 0.12 : 0, ease: EASE.out }}
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

const CSS = `
.bl { display: flex; gap: 16px; height: 100%; }
.bl-outline { flex: none; width: 100px; padding-right: 12px; border-right: 1px solid var(--line); }
.bl-outline ol { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.bl-oi { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; font-size: 12px; line-height: 1.35; color: var(--ink); transition: color 0.3s; }
.bl-oi .sv-mark { margin-top: 0; width: 14px; height: 14px; }
.bl-oi-idle { color: var(--faint); }
.bl-doc { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.bl-h1 { font-size: 16px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; }
.bl-h2 { margin-top: 12px; font-size: 13px; font-weight: 600; }
.bl-p { margin-top: 4px; font-size: 12.5px; line-height: 1.55; color: var(--muted); }
.bl-ref {
  margin-left: 2px;
  font-size: 9.5px; font-weight: 700; line-height: 0;
  color: var(--acc);
  opacity: 0; transition: opacity 0.3s;
}
.bl-ref-on { opacity: 1; }
.bl-lines { display: flex; flex-direction: column; gap: 9px; margin-top: 10px; }
.bl-lines i { display: block; height: 6px; border-radius: 3px; background: rgba(242,238,231,0.1); transform-origin: left; }
.bl-sources { margin: 16px 0 12px; display: flex; flex-direction: column; gap: 6px; }
.bl-src {
  display: flex; align-items: center; gap: 8px;
  height: 28px; padding: 0 10px 0 4px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--raised);
  font-size: 12px; color: var(--ink);
}
.bl-src svg { flex: none; color: var(--faint); }
.bl-src-n {
  flex: none;
  width: 20px; height: 20px; border-radius: 6px;
  display: grid; place-items: center;
  font-size: 10.5px; font-weight: 700;
  color: #0C0C0B; background: var(--acc);
}
.bl-src-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bl-pub {
  margin-top: auto;
  display: flex; align-items: center; gap: 8px;
  height: 36px; padding: 0 6px 0 12px;
  border-radius: 10px;
  border: 1px dashed rgba(255,255,255,0.14);
  color: var(--faint);
  transition: all 0.4s;
}
.bl-pub-on {
  border-style: solid;
  border-color: color-mix(in srgb, var(--acc) 50%, transparent);
  background: color-mix(in srgb, var(--acc) 10%, transparent);
  color: var(--ink);
}
.bl-url { flex: 1; min-width: 0; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bl-live {
  flex: none;
  height: 24px; padding: 0 10px;
  display: grid; place-items: center;
  border-radius: 6px;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  background: var(--raised-2); color: var(--faint);
}
.bl-pub-on .bl-live { background: var(--acc); color: #0C0C0B; }
`;
