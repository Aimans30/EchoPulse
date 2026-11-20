'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Workflow, Inbox, Tags, Database, Mail, Bell } from 'lucide-react';
import { EASE } from '@/lib/motion';
import { VisualFrame, StepMark, useVisual } from './VisualFrame';

/**
 * Automations: one workflow, from a website enquiry to a booked reply and a
 * heads-up for the team, runs step by step. No counters or timings, only what
 * each step does.
 */

const STEPS = [
  { icon: Inbox, title: 'When a form is sent', detail: 'Website contact form', kind: 'Trigger' },
  { icon: Tags, title: 'Sort and tag it', detail: 'Roof repair, marked urgent', kind: 'Rules' },
  { icon: Database, title: 'Add it to the CRM', detail: 'New deal, owner assigned', kind: 'CRM' },
  { icon: Mail, title: 'Reply to the customer', detail: 'Booking link sent', kind: 'Email' },
  { icon: Bell, title: 'Tell the team', detail: 'Message in the sales channel', kind: 'Chat' },
];

// 0 waiting, 1..5 each step runs, 6 done
const DURATIONS = [1200, 1000, 1000, 1000, 1000, 1000, 4000] as const;
const STATUS = ['Waiting', 'Running', 'Running', 'Running', 'Running', 'Running', 'Done'];

export default function AutomationVisual({ accent }: { accent: string }) {
  const v = useVisual(DURATIONS);
  const { step } = v;
  // Steps 1..5 mark node index 0..4 busy; everything before it is done.
  const done = step === 6;

  return (
    <VisualFrame
      accent={accent}
      frameRef={v.ref}
      title="New enquiry workflow"
      icon={<Workflow size={14} strokeWidth={2} />}
      status={STATUS[step]}
      statusDone={done}
      label="An automated workflow: a website enquiry is tagged, added to the CRM, answered with a booking link and shared with the team."
    >
      <div className="au">
        <div className="au-flow">
          {STEPS.map((s, i) => {
            const state = done || step > i + 1 ? 'done' : step === i + 1 ? 'busy' : 'idle';
            return (
              <Fragment key={s.title}>
              {i > 0 && (
                <span className="au-link">
                  <motion.i
                    initial={false}
                    animate={{ scaleY: done || step >= i + 1 ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: EASE.out }}
                  />
                </span>
              )}
              <div className={`au-node au-node-${state}`}>
                <span className="au-icon"><s.icon size={16} strokeWidth={1.9} /></span>
                <span className="au-text">
                  <span className="au-title">{s.title}</span>
                  <span className="au-detail">{s.detail}</span>
                </span>
                <span className="au-kind">{s.kind}</span>
                <StepMark state={state} />
              </div>
              </Fragment>
            );
          })}
        </div>
        <div className={done ? 'au-foot au-foot-on' : 'au-foot'}>
          Runs on every enquiry. Nobody copies anything by hand.
        </div>
      </div>
      <style>{CSS}</style>
    </VisualFrame>
  );
}

const CSS = `
.au { display: flex; flex-direction: column; height: 100%; }
.au-flow { position: relative; display: flex; flex-direction: column; }
.au-link { position: relative; display: block; height: 12px; margin-left: 30px; width: 2px; background: rgba(255,255,255,0.08); }
.au-link i { position: absolute; inset: 0; background: var(--acc); transform-origin: top; }
.au-node {
  position: relative;
  display: flex; align-items: center; gap: 12px;
  height: 56px; padding: 0 14px 0 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #1A1917;
  transition: border-color 0.35s, background-color 0.35s;
}
.au-node-busy { border-color: color-mix(in srgb, var(--acc) 55%, transparent); background: color-mix(in srgb, var(--acc) 7%, #1A1917); }
.au-icon {
  flex: none;
  width: 36px; height: 36px; border-radius: 10px;
  display: grid; place-items: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  color: var(--faint);
  transition: color 0.35s, background-color 0.35s;
}
.au-node-busy .au-icon, .au-node-done .au-icon { color: var(--acc); background: color-mix(in srgb, var(--acc) 12%, transparent); }
.au-text { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.35; }
.au-title { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.au-detail { font-size: 12px; color: var(--faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.au-node-idle .au-title { color: var(--muted); }
.au-kind { flex: none; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--faint); }
.au-foot {
  margin-top: auto;
  font-size: 12px; color: var(--faint);
  text-align: center;
  transition: color 0.4s;
}
.au-foot-on { color: var(--muted); }
`;
