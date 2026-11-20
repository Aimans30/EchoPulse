'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { EASE } from '@/lib/motion';
import { VisualFrame, TypeText, useVisual } from './VisualFrame';

/**
 * SEO and AI search: a buyer types a question, the results load with "your
 * site" fourth, it climbs to first, then an AI answer writes itself and cites
 * it. Generic domains only, and the answer panel is labelled as an
 * illustration so nothing reads as a client result.
 */

type Scene = {
  query: string;
  answer: string;
  others: { title: string; domain: string }[];
  you: { title: string; domain: string };
};

const SCENES: Scene[] = [
  {
    query: 'best physiotherapy clinic near me',
    answer: 'For sports injuries, look for same-week appointments and one named physio for every visit.',
    you: { title: 'Sports physio, same-week appointments', domain: 'yourclinic.com' },
    others: [
      { title: 'Top 10 physio clinics in the city', domain: 'listings-site.com' },
      { title: 'Physiotherapy: what to expect', domain: 'health-guide.org' },
      { title: 'Book a physio near you', domain: 'directory.io' },
    ],
  },
  {
    query: 'who builds a custom CRM for a small team',
    answer: 'Small teams often do better with a CRM built around their own pipeline than a large suite.',
    you: { title: 'Custom CRMs for teams of 5 to 50', domain: 'yourstudio.com' },
    others: [
      { title: 'The 12 best CRM tools compared', domain: 'software-reviews.com' },
      { title: 'Build or buy a CRM in 2026', domain: 'tech-weekly.net' },
      { title: 'CRM developers for hire', domain: 'freelance-market.io' },
    ],
  },
  {
    query: 'how much does a roof repair cost',
    answer: 'Minor repairs are priced by area and material. Ask for a written quote with photos first.',
    you: { title: 'Roof repair prices, with real quotes', domain: 'yourroofing.com' },
    others: [
      { title: 'Roof repair cost guide', domain: 'home-advice.com' },
      { title: 'Find roofers near you', domain: 'trades-directory.com' },
      { title: 'Should you repair or replace?', domain: 'diy-forum.net' },
    ],
  },
];

// 0 typing, 1 results with you fourth, 2 you climb to first, 3 answer writes, 4 cited
const DURATIONS = [1800, 1500, 1600, 2200, 3800] as const;
const STATUS = ['Searching', 'Ranked fourth', 'Ranked first', 'AI answer', 'Cited by AI'];

export default function SeoAeoVisual({ accent }: { accent: string }) {
  const v = useVisual(DURATIONS);
  const scene = SCENES[v.cycle % SCENES.length];
  const { step } = v;
  const showResults = step >= 1;
  const youOnTop = step >= 2;
  const rows = youOnTop
    ? [{ ...scene.you, you: true }, ...scene.others.map((o) => ({ ...o, you: false }))]
    : [...scene.others.map((o) => ({ ...o, you: false })), { ...scene.you, you: true }];

  return (
    <VisualFrame
      accent={accent}
      frameRef={v.ref}
      title="Search results"
      icon={<Search size={14} strokeWidth={2} />}
      status={STATUS[step]}
      statusDone={step === 4}
      label="A search for a local service where your site climbs from fourth to first, then an AI answer cites your site as its source."
    >
      <div className="seo">
        <div className="seo-bar">
          <Search size={14} strokeWidth={2.2} />
          <TypeText key={v.cycle} className="seo-query" text={scene.query} run={step === 0} full={v.reduce} cps={40} />
        </div>

        <div className="seo-results">
          <AnimatePresence mode="popLayout">
            {showResults &&
              rows.map((r, i) => (
                <motion.div
                  key={`${v.cycle}-${r.domain}`}
                  layout
                  initial={v.reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{
                    layout: { duration: 0.7, ease: EASE.out },
                    opacity: { duration: 0.3, delay: step === 1 ? i * 0.06 : 0 },
                    y: { duration: 0.3, delay: step === 1 ? i * 0.06 : 0 },
                  }}
                  className={r.you ? 'seo-row seo-row-you' : 'seo-row'}
                >
                  <span className="seo-pos">{i + 1}</span>
                  <span className="seo-row-body">
                    <span className="seo-domain">{r.domain}</span>
                    <span className="seo-title">{r.title}</span>
                  </span>
                  {r.you && <span className="seo-tag">Your site</span>}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        <div className={step >= 3 ? 'seo-ai sv-panel seo-ai-on' : 'seo-ai sv-panel'}>
          <div className="seo-ai-head">
            <Sparkles size={14} strokeWidth={2} />
            <span className="sv-label">AI answer</span>
            <span className="seo-note">Illustration</span>
          </div>
          <TypeText key={v.cycle} className="seo-answer" text={scene.answer} run={step >= 3} full={v.reduce} cps={80} />
          <div className="seo-sources">
            <span className={step >= 4 ? 'seo-src seo-src-you seo-src-on' : 'seo-src seo-src-you'}>
              <span className="seo-src-n">1</span>
              {scene.you.domain}
            </span>
            <span className={step >= 4 ? 'seo-src seo-src-on' : 'seo-src'}>
              <span className="seo-src-n">2</span>
              {scene.others[1].domain}
            </span>
          </div>
        </div>
      </div>
      <style>{CSS}</style>
    </VisualFrame>
  );
}

const CSS = `
.seo { display: flex; flex-direction: column; height: 100%; }
.seo-bar {
  flex: none;
  display: flex; align-items: center; gap: 8px;
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: var(--raised-2);
  border: 1px solid var(--border);
  color: var(--faint);
}
.seo-query { flex: 1; min-width: 0; color: var(--ink); white-space: nowrap; overflow: hidden; }
.seo-query .sv-type-ghost, .seo-query .sv-type-live { white-space: nowrap; }
.seo-results { display: flex; flex-direction: column; gap: 4px; margin-top: 12px; height: 168px; flex: none; }
.seo-row {
  display: flex; align-items: center; gap: 12px;
  height: 39px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: #1A1917;
}
.seo-row-you {
  position: relative;
  z-index: 1;
  background: color-mix(in srgb, var(--acc) 10%, #161513);
  border-color: color-mix(in srgb, var(--acc) 45%, transparent);
}
.seo-pos { flex: none; width: 12px; font-size: 12px; font-weight: 700; color: var(--faint); font-variant-numeric: tabular-nums; }
.seo-row-you .seo-pos { color: var(--acc); }
.seo-row-body { display: flex; flex-direction: column; min-width: 0; flex: 1; line-height: 1.3; }
.seo-domain { font-size: 10.5px; color: var(--faint); }
.seo-title { font-size: 12.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.seo-tag {
  flex: none;
  font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  color: #0C0C0B; background: var(--acc);
  padding: 3px 8px; border-radius: 999px;
}
.seo-ai { margin-top: auto; padding: 12px 14px; opacity: 0.4; transition: opacity 0.4s; }
.seo-ai-on { opacity: 1; }
.seo-ai-head { display: flex; align-items: center; gap: 8px; color: var(--acc); }
.seo-note { margin-left: auto; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--faint); }
.seo-answer { margin: 8px 0 12px; font-size: 13px; line-height: 1.5; color: var(--ink); }
.seo-sources { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 12px; border-top: 1px solid var(--line); }
.seo-src {
  display: inline-flex; align-items: center; gap: 6px;
  height: 26px;
  padding: 0 10px 0 4px;
  border-radius: 999px;
  font-size: 11.5px; font-weight: 600;
  background: var(--raised-2);
  border: 1px solid var(--border);
  opacity: 0.35;
  transition: opacity 0.4s, border-color 0.4s, background-color 0.4s;
}
.seo-src-on { opacity: 0.75; }
.seo-src-you.seo-src-on { opacity: 1; border-color: var(--acc); background: color-mix(in srgb, var(--acc) 14%, transparent); }
.seo-src-n {
  display: inline-grid; place-items: center;
  width: 18px; height: 18px; border-radius: 999px;
  font-size: 10px; font-weight: 700;
  background: rgba(255,255,255,0.1);
}
.seo-src-you .seo-src-n { background: var(--acc); color: #0C0C0B; }
`;
