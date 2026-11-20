'use client';

import { motion, LayoutGroup } from 'framer-motion';
import { Kanban, Search, CircleCheck, Plus } from 'lucide-react';
import { EASE } from '@/lib/motion';
import { VisualFrame, useVisual } from './VisualFrame';

/**
 * Apps and software: a calm custom CRM. A job moves from "Quote sent" to
 * "Won", the app drafts the invoice on its own, and a new enquiry lands in
 * "New". Jobs are generic trades work, no company names or amounts.
 */

type Card = { id: string; title: string; tag: string; who: string };
type Col = 'new' | 'quote' | 'won';

const CARDS: Record<string, Card> = {
  fence: { id: 'fence', title: 'Fencing', tag: 'Site visit', who: 'SP' },
  loft: { id: 'loft', title: 'Insulation', tag: 'Call back', who: 'AK' },
  kitchen: { id: 'kitchen', title: 'Kitchen', tag: 'Quote', who: 'MR' },
  garden: { id: 'garden', title: 'Garden room', tag: 'Quote', who: 'SP' },
  bath: { id: 'bath', title: 'Bathroom', tag: 'Booked', who: 'AK' },
  gutter: { id: 'gutter', title: 'Gutters', tag: 'Booked', who: 'MR' },
  deck: { id: 'deck', title: 'Decking', tag: 'Quote', who: 'AK' },
  boiler: { id: 'boiler', title: 'Boiler', tag: 'Web form', who: 'MR' },
};
const COLS: { key: Col; name: string }[] = [
  { key: 'new', name: 'New' },
  { key: 'quote', name: 'Quote sent' },
  { key: 'won', name: 'Won' },
];

// 0 board, 1 card lifts, 2 card lands in Won, 3 invoice drafted, 4 new enquiry
const DURATIONS = [1600, 700, 1500, 2200, 3600] as const;

function layout(step: number): Record<Col, string[]> {
  const moved = step >= 2;
  return {
    new: step >= 4 ? ['boiler', 'fence', 'loft'] : ['fence', 'loft'],
    quote: moved ? ['kitchen', 'deck'] : ['kitchen', 'garden', 'deck'],
    won: moved ? ['garden', 'bath', 'gutter'] : ['bath', 'gutter'],
  };
}

export default function AppsSoftwareVisual({ accent }: { accent: string }) {
  const v = useVisual(DURATIONS);
  const { step } = v;
  const board = layout(step);

  return (
    <VisualFrame
      accent={accent}
      frameRef={v.ref}
      title="Jobs, pipeline board"
      icon={<Kanban size={14} strokeWidth={2} />}
      status={step >= 4 ? 'New enquiry' : step >= 3 ? 'Invoice drafted' : 'Synced'}
      statusDone={step >= 3}
      flush
      label="A custom CRM pipeline board where a job moves to won, the invoice is drafted automatically and a new enquiry arrives."
    >
      <div className="ap">
        <div className="ap-main">
          <div className="ap-head">
            <span className="ap-h">Pipeline</span>
            <span className="ap-tabs"><span className="ap-tab-on">Board</span><span>List</span></span>
            <span className="ap-tools">
              <Search size={14} strokeWidth={2} />
              <span className="ap-new"><Plus size={12} strokeWidth={2.4} />New</span>
            </span>
          </div>

          <LayoutGroup id={`ap-${v.cycle}`}>
            <motion.div
              key={v.cycle}
              className="ap-board"
              initial={v.reduce || v.cycle === 0 ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {COLS.map((c) => (
                <div key={c.key} className="ap-col">
                  <div className="ap-col-head">
                    <i className={`ap-dot ap-dot-${c.key}`} />
                    <span>{c.name}</span>
                    <span className="ap-count">{board[c.key].length}</span>
                  </div>
                    {board[c.key].map((id) => {
                      const card = CARDS[id];
                      const lifted = id === 'garden' && step === 1;
                      const fresh = id === 'boiler';
                      return (
                        <motion.div
                          key={id}
                          layoutId={v.reduce ? undefined : `${v.cycle}-${id}`}
                          className={`ap-card${lifted ? ' ap-card-lift' : ''}${id === 'garden' && step >= 2 ? ' ap-card-won' : ''}`}
                          initial={fresh && !v.reduce ? { opacity: 0, y: -8 } : false}
                          animate={{ opacity: 1, y: 0, scale: lifted ? 1.04 : 1, rotate: lifted ? -2 : 0 }}
                          transition={{ layout: { duration: 0.7, ease: EASE.inOut }, duration: 0.35, ease: EASE.out }}
                        >
                          <span className="ap-card-title">{card.title}</span>
                          <span className="ap-card-meta">
                            <span className="ap-tag">{id === 'garden' && step >= 2 ? 'Won' : card.tag}</span>
                            <span className="ap-who">{card.who}</span>
                          </span>
                        </motion.div>
                      );
                    })}
                </div>
              ))}
            </motion.div>
          </LayoutGroup>

          <motion.div
            className="ap-toast"
            initial={false}
            animate={step === 3 || (step === 4 && v.reduce) ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: EASE.out }}
          >
            <CircleCheck size={16} strokeWidth={2} />
            <span>Invoice drafted for <b>Garden room</b></span>
          </motion.div>
        </div>
      </div>
      <style>{CSS}</style>
    </VisualFrame>
  );
}

const CSS = `
.ap { display: flex; height: 100%; }
.ap-main { position: relative; flex: 1; min-width: 0; display: flex; flex-direction: column; padding: 16px 16px 0; }
.ap-head { display: flex; align-items: center; gap: 12px; height: 28px; }
.ap-h { font-size: 15px; font-weight: 700; letter-spacing: -0.01em; }
.ap-tabs { display: flex; gap: 2px; padding: 2px; border-radius: 8px; background: var(--raised-2); font-size: 11.5px; color: var(--faint); }
.ap-tabs span { padding: 3px 8px; border-radius: 6px; }
.ap-tabs .ap-tab-on { color: var(--ink); background: rgba(255,255,255,0.08); }
.ap-tools { margin-left: auto; display: flex; align-items: center; gap: 10px; color: var(--faint); }
.ap-new { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 8px; border-radius: 6px; font-size: 11.5px; font-weight: 600; color: #0C0C0B; background: var(--acc); }
.ap-board { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 16px -4px 0; flex: 1; min-height: 0; }
.ap-col { display: flex; flex-direction: column; gap: 6px; min-width: 0; padding: 8px; border-radius: 10px; background: rgba(255,255,255,0.02); }
.ap-col-head { display: flex; align-items: center; gap: 6px; height: 20px; margin-bottom: 2px; font-size: 11.5px; font-weight: 600; color: var(--muted); white-space: nowrap; }
.ap-dot { width: 6px; height: 6px; border-radius: 50%; flex: none; }
.ap-dot-new { background: rgba(242,238,231,0.4); }
.ap-dot-quote { background: #E0A526; }
.ap-dot-won { background: var(--acc); }
.ap-count { margin-left: auto; font-size: 10.5px; font-variant-numeric: tabular-nums; color: var(--faint); }
.ap-card {
  position: relative;
  display: flex; flex-direction: column; gap: 8px;
  padding: 10px 9px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #1E1D1A;
  box-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.ap-card-lift { z-index: 2; box-shadow: 0 16px 32px rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.16); }
.ap-card-won { border-color: color-mix(in srgb, var(--acc) 45%, transparent); }
.ap-card-title { font-size: 12px; font-weight: 600; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ap-card-meta { display: flex; align-items: center; gap: 6px; min-width: 0; }
.ap-tag { flex: none; height: 18px; padding: 0 6px; display: grid; place-items: center; border-radius: 5px; font-size: 10px; font-weight: 600; color: var(--muted); background: var(--raised-2); white-space: nowrap; }
.ap-card-won .ap-tag { color: #0C0C0B; background: var(--acc); }
.ap-who { margin-left: auto; flex: none; width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; font-size: 9px; font-weight: 700; color: var(--ink); background: rgba(255,255,255,0.1); }
.ap-toast {
  position: absolute; left: 16px; right: 16px; bottom: 16px;
  display: flex; align-items: center; gap: 10px;
  height: 40px; padding: 0 14px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--acc) 40%, transparent);
  background: #1E1D1A;
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  font-size: 12.5px; color: var(--muted);
}
.ap-toast svg { color: var(--acc); flex: none; }
.ap-toast b { color: var(--ink); font-weight: 600; }
`;
