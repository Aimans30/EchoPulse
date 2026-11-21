'use client';

import { useState } from 'react';

/**
 * One-sentence "install with your agent" pill: copies a single instruction
 * that points an AI agent at a markdown file with the real steps.
 */
export default function AgentCopyPill({ label, instruction, fileLabel }: { label: string; instruction: string; fileLabel: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(instruction);
    } catch {
      const t = document.createElement('textarea');
      t.value = instruction;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 2200);
  };
  return (
    <div className="acp">
      <button type="button" className="acp-pill" onClick={copy} aria-label={`${label}. Copy the instruction for your AI agent`}>
        <span className="acp-label">{label}</span>
        <span className="acp-agents" aria-hidden="true">
          <span>Claude</span><span>ChatGPT</span><span>Cursor</span><span>Codex</span>
        </span>
        <span className="acp-copy" aria-live="polite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {done ? <path d="M20 6 9 17l-5-5" /> : <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>}
          </svg>
          {done ? 'COPIED' : 'COPY'}
        </span>
      </button>
      <p className="acp-note">
        That is the whole instruction. Your agent reads <strong>{fileLabel}</strong> and takes it from there.
      </p>
      <style>{`
        .acp { margin: 0 0 8px; }
        .acp-pill { display: flex; align-items: center; gap: 14px; flex-wrap: nowrap; width: 100%; max-width: 820px; padding: 16px 22px 16px 26px; border: 1px solid rgba(12,12,11,0.08); border-radius: 999px; background: #FFFFFF; box-shadow: 0 18px 50px -18px rgba(232,84,26,0.45), 0 2px 6px rgba(12,12,11,0.06); cursor: pointer; text-align: left; font-family: Inter, sans-serif; transition: transform .2s ease, box-shadow .2s ease; }
        .acp-pill:hover { transform: translateY(-1px); box-shadow: 0 22px 56px -16px rgba(232,84,26,0.55), 0 2px 6px rgba(12,12,11,0.06); }
        .acp-pill:focus-visible { outline: 3px solid #E8541A; outline-offset: 3px; }
        .acp-label { flex: 1 1 auto; white-space: nowrap; font-size: 19px; font-weight: 700; color: #0C0C0B; letter-spacing: -0.01em; }
        .acp-agents { display: flex; gap: 6px; flex-wrap: nowrap; }
        .acp-agents span { font-size: 12px; font-weight: 700; color: #4A4740; padding: 5px 10px; border-radius: 999px; background: #F2EEE7; }
        .acp-copy { flex: none; white-space: nowrap; display: inline-flex; align-items: center; gap: 8px; padding-left: 18px; border-left: 1px solid rgba(12,12,11,0.1); font-size: 14px; font-weight: 800; letter-spacing: 0.12em; color: #E8541A; }
        .acp-note { margin: 12px 0 0 !important; font-size: 14px !important; color: #6E6B63 !important; }
        .acp-note strong { color: #0C0C0B; }
        @media (max-width: 900px) {
          .acp-pill { flex-wrap: wrap; border-radius: 24px; padding: 18px; gap: 12px; }
          .acp-agents { flex-wrap: wrap; }
          .acp-label { white-space: normal; }
          .acp-label { font-size: 17px; flex-basis: 100%; }
          .acp-copy { border-left: 0; padding-left: 0; }
        }
      `}</style>
    </div>
  );
}
