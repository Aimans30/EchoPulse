'use client';

import { PenLine, ThumbsUp, MessageSquare, Repeat2, Send, Globe, CalendarClock } from 'lucide-react';
import { VisualFrame, StepMark, TypeText, useVisual } from './VisualFrame';

/**
 * LinkedIn ghostwriting: a post drafts itself in a dark LinkedIn-style
 * composer, in the founder's own plain voice, then passes the review we run on
 * every post before it is scheduled. Generic name, no counts.
 */

const POST = `We lost our biggest client in March.
It was not the work. I had stopped calling them.

Now every client gets a call once a month, even when nothing is wrong.`;

const CHECKS: { label: string; note: string }[] = [
  { label: 'Sounds like you', note: 'Matched to your call notes' },
  { label: 'No AI phrases', note: 'Read line by line' },
  { label: 'Facts checked with you', note: 'Story confirmed on the call' },
];

// 0 blank, 1 writing, 2..4 checks, 5 scheduled
const DURATIONS = [700, 2600, 1000, 1000, 1000, 4200] as const;
const STATUS = ['Drafting', 'Drafting', 'In review', 'In review', 'In review', 'Scheduled'];

export default function LinkedInVisual({ accent }: { accent: string }) {
  const v = useVisual(DURATIONS);
  const { step } = v;
  const scheduled = step === 5;

  return (
    <VisualFrame
      accent={accent}
      frameRef={v.ref}
      title="Jordan, Tuesday post"
      icon={<PenLine size={14} strokeWidth={2} />}
      status={STATUS[step]}
      statusDone={scheduled}
      label="A LinkedIn post drafted in a founder's voice, passing a review checklist before it is scheduled."
    >
      <div className="li">
        <div className="li-post sv-panel">
          <div className="li-head">
            <span className="li-avatar">JL</span>
            <span className="li-who">
              <span className="li-name">Jordan Lee</span>
              <span className="li-role">
                Founder, B2B software
                <Globe size={11} strokeWidth={2} />
              </span>
            </span>
          </div>
          <TypeText key={v.cycle} className="li-text" text={POST} run={step >= 1} full={v.reduce} cps={80} />
          <div className="li-actions">
            <span><ThumbsUp size={14} strokeWidth={1.8} />Like</span>
            <span><MessageSquare size={14} strokeWidth={1.8} />Comment</span>
            <span><Repeat2 size={14} strokeWidth={1.8} />Repost</span>
            <span><Send size={14} strokeWidth={1.8} />Send</span>
          </div>
        </div>

        <ul className="li-checks">
          {CHECKS.map((c, i) => {
            const at = i + 2;
            const state = step > at || scheduled ? 'done' : step === at ? 'busy' : 'idle';
            return (
              <li key={c.label} className={state === 'idle' ? 'li-check li-check-idle' : 'li-check'}>
                <StepMark state={state} />
                <span className="li-check-label">{c.label}</span>
                <span className="li-check-note">{c.note}</span>
              </li>
            );
          })}
        </ul>

        <div className={scheduled ? 'li-sched li-sched-on' : 'li-sched'}>
          <CalendarClock size={14} strokeWidth={2} />
          <span className="li-sched-text">{scheduled ? 'Approved by Jordan. Posts Tuesday, 8:30 am' : 'Waiting for your approval'}</span>
        </div>
      </div>
      <style>{CSS}</style>
    </VisualFrame>
  );
}

const CSS = `
.li { display: flex; flex-direction: column; gap: 10px; height: 100%; }
.li > * { flex-shrink: 0; }
.li-post { padding: 14px 16px; display: flex; flex-direction: column; }
.li-head { display: flex; align-items: center; gap: 12px; }
.li-avatar {
  flex: none;
  width: 36px; height: 36px; border-radius: 50%;
  display: grid; place-items: center;
  font-size: 12px; font-weight: 700; letter-spacing: 0.02em;
  color: var(--ink);
  background: linear-gradient(135deg, color-mix(in srgb, var(--acc) 70%, #161513), color-mix(in srgb, var(--acc) 25%, #161513));
}
.li-who { display: flex; flex-direction: column; line-height: 1.35; min-width: 0; }
.li-name { font-size: 13px; font-weight: 600; }
.li-role { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--faint); }
.li-text { margin: 12px 0 0; font-size: 13px; line-height: 1.5; color: var(--ink); }
.li-actions {
  display: flex; justify-content: space-between;
  margin-top: 10px; padding-top: 8px;
  border-top: 1px solid var(--line);
  font-size: 12px; font-weight: 500; color: var(--faint);
}
.li-actions span { display: inline-flex; align-items: center; gap: 6px; }
.li-checks { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.li-check {
  display: flex; align-items: center; gap: 10px;
  height: 30px; padding: 0 12px;
  border-radius: 8px;
  background: var(--raised);
  transition: color 0.3s;
}
.li-check-label { font-size: 12.5px; font-weight: 600; white-space: nowrap; }
.li-check-note { margin-left: auto; font-size: 11.5px; color: var(--faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.li-check-idle .li-check-label { color: var(--faint); }
.li-sched {
  margin-top: auto;
  display: flex; align-items: center; gap: 8px;
  height: 36px; padding: 0 12px;
  border-radius: 10px;
  border: 1px dashed rgba(255,255,255,0.14);
  font-size: 12px; color: var(--faint);
  transition: all 0.4s;
}
.li-sched svg { flex: none; }
.li-sched-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.li-sched-on {
  border-style: solid;
  border-color: color-mix(in srgb, var(--acc) 50%, transparent);
  background: color-mix(in srgb, var(--acc) 10%, transparent);
  color: var(--ink);
}
.li-sched-on svg { color: var(--acc); }
`;
