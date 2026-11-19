'use client';

import { useEffect, useRef, useState } from 'react';
import { PRESENCE, PROMISES } from '@/lib/pricing';

/**
 * "How it works in one week". Three facts a buyer can check, taken from
 * lib/pricing.ts: the counts are PRESENCE.scope, the reply time is PROMISES.
 * If those change, change this. Each card carries a small looping visual of
 * the step (files going in, pieces coming back, the 48-hour clock) and the
 * whole row reveals once, left to right, when it scrolls into view.
 * The export keeps the name Manifesto so HomeClient's import still works.
 */
export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0, rootMargin: '0px 0px -18% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`mf-section${seen ? ' is-in' : ''}`} aria-labelledby="mf-heading">
      <style>{`
        .mf-section { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; padding: 84px 24px 80px; overflow: hidden; }
        .mf-wrap { max-width: 1120px; margin: 0 auto; }
        .mf-eyebrow { margin: 0 0 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #B23A0C; }
        .mf-h2 { font-size: clamp(30px, 4.2vw, 48px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; margin: 0 0 40px; max-width: 20ch; }

        .mf-rail { position: relative; height: 2px; background: rgba(12,12,11,0.1); margin: 0 0 -1px; border-radius: 2px; }
        .mf-rail i { position: absolute; inset: 0; background: #E8541A; border-radius: 2px; transform: scaleX(0); transform-origin: 0 50%; transition: transform 1.5s cubic-bezier(.16,1,.3,1) .15s; }
        .is-in .mf-rail i { transform: scaleX(1); }

        .mf-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .mf-item { position: relative; padding-top: 30px; opacity: 0; transform: translateY(26px); transition: opacity .7s ease, transform .8s cubic-bezier(.16,1,.3,1); }
        .mf-item:nth-child(1) { transition-delay: .1s; } .mf-item:nth-child(2) { transition-delay: .32s; } .mf-item:nth-child(3) { transition-delay: .54s; }
        .is-in .mf-item { opacity: 1; transform: none; }
        .mf-dot { position: absolute; left: 22px; top: -7px; width: 14px; height: 14px; border-radius: 50%; background: #F2EEE7; border: 2px solid #E8541A; transform: scale(0); transition: transform .5s cubic-bezier(.34,1.56,.64,1); transition-delay: inherit; }
        .is-in .mf-dot { transform: scale(1); }

        .mf-card { height: 100%; background: #fff; border: 1px solid rgba(12,12,11,0.08); border-radius: 22px; overflow: hidden; display: flex; flex-direction: column; transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s ease, border-color .35s ease; }
        .mf-card:hover { transform: translateY(-5px); box-shadow: 0 24px 50px -24px rgba(12,12,11,0.28); border-color: rgba(232,84,26,0.35); }
        .mf-vis { position: relative; height: 148px; background: linear-gradient(160deg, #FAF6EF, #F1E9DD); border-bottom: 1px solid rgba(12,12,11,0.06); overflow: hidden; }
        .mf-body { padding: 20px 22px 24px; }
        .mf-num { font-size: 12px; font-weight: 800; letter-spacing: 0.08em; color: #B23A0C; margin: 0 0 6px; }
        .mf-title { font-size: 21px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 10px; }
        .mf-line { font-size: 15px; line-height: 1.55; color: #45423C; margin: 0 0 8px; }
        .mf-line:last-child { margin-bottom: 0; }
        .mf-line b { color: #0C0C0B; font-weight: 700; }

        /* 01: files drifting into the inbox */
        .mf-file { position: absolute; left: 50%; display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px 7px 8px; border-radius: 100px; background: #fff; border: 1px solid rgba(12,12,11,0.1); box-shadow: 0 6px 16px -8px rgba(12,12,11,0.3); font-size: 12px; font-weight: 700; white-space: nowrap; animation: mf-drop 5.4s cubic-bezier(.4,0,.2,1) infinite both; }
        .mf-file i { width: 18px; height: 18px; border-radius: 6px; background: #0C0C0B; flex: 0 0 auto; position: relative; }
        .mf-file i::after { content: ''; position: absolute; left: 7px; top: 5px; border-left: 6px solid #fff; border-top: 4px solid transparent; border-bottom: 4px solid transparent; }
        .mf-file.b i { background: #E8541A; } .mf-file.c i { background: #6E6B63; }
        .mf-file.a { margin-left: -118px; animation-delay: 0s; } .mf-file.b { margin-left: -20px; animation-delay: 1.8s; } .mf-file.c { margin-left: -74px; animation-delay: 3.6s; }
        .mf-tray { position: absolute; left: 50%; bottom: 16px; width: 190px; margin-left: -95px; height: 34px; border-radius: 12px; border: 1.5px dashed rgba(12,12,11,0.28); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #6E6B63; background: rgba(255,255,255,0.5); }
        @keyframes mf-drop {
          0% { opacity: 0; transform: translateY(-14px) scale(.94); top: 14px; }
          12%, 55% { opacity: 1; transform: none; top: 22px; }
          78% { opacity: 1; transform: scale(.9); top: 82px; }
          88%, 100% { opacity: 0; transform: scale(.6); top: 96px; }
        }

        /* 02: the month's pieces popping in */
        .mf-pieces { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .mf-piece { position: relative; border-radius: 9px; background: #0C0C0B; animation: mf-pop 5s cubic-bezier(.34,1.56,.64,1) infinite both; }
        .mf-piece.v { width: 46px; height: 82px; background: linear-gradient(170deg, #2A2623, #0C0C0B); }
        .mf-piece.p { width: 58px; height: 58px; background: linear-gradient(150deg, #F08A5A, #E8541A); }
        .mf-piece.v::before { content: ''; position: absolute; left: 50%; top: 50%; margin: -6px 0 0 -4px; border-left: 10px solid rgba(255,255,255,.9); border-top: 6px solid transparent; border-bottom: 6px solid transparent; }
        .mf-piece.p::before { content: ''; position: absolute; left: 10px; right: 10px; bottom: 10px; height: 4px; border-radius: 4px; background: rgba(255,255,255,.85); box-shadow: 0 -9px 0 rgba(255,255,255,.5); }
        .mf-piece::after { content: ''; position: absolute; right: -5px; top: -5px; width: 16px; height: 16px; border-radius: 50%; background: #1F9D55 url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M4.5 8.2l2.3 2.3 4.7-5' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/></svg>") center/contain no-repeat; border: 2px solid #F6F0E7; animation: mf-tick 5s ease infinite both; animation-delay: inherit; }
        .mf-piece:nth-child(1) { animation-delay: 0s; } .mf-piece:nth-child(2) { animation-delay: .35s; } .mf-piece:nth-child(3) { animation-delay: .7s; } .mf-piece:nth-child(4) { animation-delay: 1.05s; } .mf-piece:nth-child(5) { animation-delay: 1.4s; }
        @keyframes mf-pop { 0% { opacity: 0; transform: translateY(14px) scale(.7); } 10%, 86% { opacity: 1; transform: none; } 96%, 100% { opacity: 0; transform: translateY(-8px) scale(.94); } }
        @keyframes mf-tick { 0%, 16% { transform: scale(0); } 24%, 100% { transform: scale(1); } }

        /* 03: the 48-hour clock */
        .mf-clock { position: absolute; inset: 0; padding: 0 26px; display: flex; flex-direction: column; justify-content: center; gap: 12px; }
        .mf-track { position: relative; height: 8px; border-radius: 8px; background: rgba(12,12,11,0.09); }
        .mf-track i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 8px; background: linear-gradient(90deg, #F08A5A, #E8541A); animation: mf-fill 5s cubic-bezier(.45,0,.2,1) infinite; }
        .mf-track i::after { content: ''; position: absolute; right: -7px; top: -4px; width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 3px solid #E8541A; box-shadow: 0 0 0 0 rgba(232,84,26,.5); animation: mf-ping 1.4s ease-out infinite; }
        .mf-ends { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #6E6B63; }
        .mf-ends b { color: #0C0C0B; }
        .mf-reply { align-self: flex-start; display: inline-flex; align-items: center; gap: 7px; padding: 6px 12px 6px 9px; border-radius: 14px 14px 14px 4px; background: #0C0C0B; color: #fff; font-size: 12px; font-weight: 700; animation: mf-reply 5s ease infinite both; }
        .mf-reply i { width: 7px; height: 7px; border-radius: 50%; background: #3DDC84; }
        @keyframes mf-fill { 0% { width: 4%; } 70%, 92% { width: 100%; } 100% { width: 4%; } }
        @keyframes mf-ping { to { box-shadow: 0 0 0 9px rgba(232,84,26,0); } }
        @keyframes mf-reply { 0%, 14% { opacity: 0; transform: translateY(8px) scale(.9); } 22%, 90% { opacity: 1; transform: none; } 100% { opacity: 0; } }

        .mf-section:not(.is-in) .mf-vis * { animation-play-state: paused; }

        @media (max-width: 860px) {
          .mf-section { padding: 60px 16px 60px; }
          .mf-h2 { margin-bottom: 28px; }
          .mf-rail { display: none; }
          .mf-list { grid-template-columns: 1fr; gap: 14px; }
          .mf-item { padding-top: 0; }
          .mf-dot { display: none; }
          .mf-vis { height: 132px; }
          .mf-body { padding: 18px 18px 20px; }
          .mf-tray, .mf-ends { font-size: 12px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mf-item, .mf-dot, .mf-rail i { transition: none; opacity: 1; transform: none; }
          .mf-vis *, .mf-vis *::before, .mf-vis *::after { animation: none !important; }
          .mf-file { top: 22px; position: absolute; } .mf-file.b, .mf-file.c { display: none; }
          .mf-track i { width: 100%; }
        }
      `}</style>
      <div className="mf-wrap">
        <p className="mf-eyebrow">The process</p>
        <h2 id="mf-heading" className="mf-h2">How it works in one week</h2>
        <div className="mf-rail" aria-hidden="true"><i /></div>
        <ol className="mf-list">
          <li className="mf-item">
            <span className="mf-dot" aria-hidden="true" />
            <div className="mf-card">
              <div className="mf-vis" aria-hidden="true">
                <span className="mf-file a"><i />phone_clip.mp4</span>
                <span className="mf-file b"><i />Drive link</span>
                <span className="mf-file c"><i />10 min voice note</span>
                <span className="mf-tray">Drop it here</span>
              </div>
              <div className="mf-body">
                <p className="mf-num">01</p>
                <h3 className="mf-title">What you send</h3>
                <p className="mf-line">Raw footage from your phone, a link, or <b>10 minutes of your time</b>.</p>
                <p className="mf-line">On the monthly plan, add a 20 to 30 minute call each week.</p>
              </div>
            </div>
          </li>
          <li className="mf-item">
            <span className="mf-dot" aria-hidden="true" />
            <div className="mf-card">
              <div className="mf-vis" aria-hidden="true">
                <div className="mf-pieces">
                  <span className="mf-piece v" /><span className="mf-piece v" /><span className="mf-piece p" /><span className="mf-piece v" /><span className="mf-piece p" />
                </div>
              </div>
              <div className="mf-body">
                <p className="mf-num">02</p>
                <h3 className="mf-title">What comes back</h3>
                <p className="mf-line">Each month on the {PRESENCE.priceLabel} plan: <b>8 to 9 short-form videos</b>, <b>8 photo or carousel posts</b> and up to 5 extra clips cut from footage you already have.</p>
                <p className="mf-line">A website tune-up in month one, then upgrades.</p>
              </div>
            </div>
          </li>
          <li className="mf-item">
            <span className="mf-dot" aria-hidden="true" />
            <div className="mf-card">
              <div className="mf-vis" aria-hidden="true">
                <div className="mf-clock">
                  <span className="mf-reply"><i />Reply in under 3 hours</span>
                  <div className="mf-track"><i /></div>
                  <div className="mf-ends"><span>Footage in</span><b>Edit back, 48h</b></div>
                </div>
              </div>
              <div className="mf-body">
                <p className="mf-num">03</p>
                <h3 className="mf-title">When</h3>
                <p className="mf-line"><b>Short-form edits back in 48 hours.</b> Long-form depends on the length of the video.</p>
                <p className="mf-line">{PROMISES.replies}.</p>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
