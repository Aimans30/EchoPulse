'use client';

import { useState } from 'react';
import { ClaudeLogo, CursorLogo, OpenAILogo } from '@/components/AiToolLogos';

/**
 * One-sentence "install with your agent" pill: copies a single instruction
 * that points an AI agent at a markdown file with the real steps.
 *
 * `tone="dark"` is the variant for ink backgrounds (the Offcut hero): a paper
 * surface with the label and copy state on one row and the agent names as
 * marks underneath, so it stays one tidy button at any width.
 *
 * The agent marks (components/AiToolLogos.tsx) only say which tools it works
 * with; their names are in the button's aria-label and in a hover tooltip.
 */

const AGENTS = 'Claude, ChatGPT, Codex and Cursor';
export default function AgentCopyPill({
  label,
  instruction,
  fileLabel,
  tone = 'light',
}: {
  label: string;
  instruction: string;
  fileLabel: string;
  tone?: 'light' | 'dark';
}) {
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
    <div className={tone === 'dark' ? 'acp acp-dark' : 'acp'}>
      <button type="button" className="acp-pill" onClick={copy} aria-label={`${label}. Works with ${AGENTS}. Copy the instruction for your AI agent`}>
        <span className="acp-label">{label}</span>
        <span className="acp-agents" aria-hidden="true">
          <span className="acp-works">Works with</span>
          <span className="acp-logo" title="Claude"><ClaudeLogo size={20} /></span>
          <span className="acp-logo" title="ChatGPT and Codex (OpenAI)"><OpenAILogo size={20} name="ChatGPT and Codex" /></span>
          <span className="acp-logo" title="Cursor"><CursorLogo size={20} /></span>
        </span>
        <span className={done ? 'acp-copy acp-done' : 'acp-copy'} aria-live="polite">
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
        .acp-agents { display: flex; align-items: center; gap: 12px; flex-wrap: nowrap; color: #0C0C0B; }
        .acp-works { font-size: 12px; font-weight: 600; color: #625E56; white-space: nowrap; }
        .acp-logo { display: inline-grid; place-items: center; width: 22px; height: 22px; }
        .acp-logo svg { display: block; width: 20px; height: 20px; }
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

        /* Dark tone: paper button on ink. Label and copy state share the top
           row, the agent chips sit underneath. Grid areas keep the DOM order
           (label, agents, copy) that screen readers already announce. */
        .acp-dark .acp-pill { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "label copy" "agents agents"; align-items: center; gap: 16px 16px; max-width: 560px; padding: 20px 20px 20px 24px; border: 1px solid rgba(242,238,231,0.9); border-radius: 16px; background: #F2EEE7; box-shadow: 0 1px 0 rgba(255,255,255,0.4) inset, 0 24px 48px -24px rgba(0,0,0,0.7); transition: background-color .2s ease, transform .2s ease; }
        .acp-dark .acp-pill:hover { background: #FFFFFF; transform: translateY(-1px); box-shadow: 0 1px 0 rgba(255,255,255,0.4) inset, 0 28px 56px -24px rgba(0,0,0,0.75); }
        .acp-dark .acp-pill:focus-visible { outline: 3px solid #E8541A; outline-offset: 4px; }
        .acp-dark .acp-label { grid-area: label; white-space: normal; font-size: 18px; font-weight: 700; line-height: 1.3; letter-spacing: -0.015em; color: #0C0C0B; }
        .acp-dark .acp-agents { grid-area: agents; flex-wrap: wrap; gap: 16px; padding-top: 16px; border-top: 1px solid rgba(12,12,11,0.1); color: #0C0C0B; }
        .acp-dark .acp-works { font-size: 13px; }
        .acp-dark .acp-logo { width: 24px; height: 24px; }
        .acp-dark .acp-logo svg { width: 22px; height: 22px; }
        .acp-dark .acp-copy { grid-area: copy; height: 36px; padding: 0 14px; border: 0; border-radius: 999px; background: #0C0C0B; color: #F2EEE7; font-size: 12px; letter-spacing: 0.1em; }
        .acp-dark .acp-copy.acp-done { background: #E8541A; color: #FFFFFF; }
        .acp-dark .acp-note { margin: 12px 0 0 !important; font-size: 14px !important; line-height: 1.5 !important; color: rgba(242,238,231,0.6) !important; }
        .acp-dark .acp-note strong { color: #F2EEE7; font-weight: 600; overflow-wrap: anywhere; }
        @media (max-width: 900px) {
          .acp-dark .acp-pill { padding: 16px 16px 16px 20px; gap: 14px 12px; border-radius: 16px; }
          .acp-dark .acp-label { font-size: 17px; flex-basis: auto; }
          .acp-dark .acp-agents { padding-top: 14px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .acp-pill, .acp-dark .acp-pill { transition: none; }
          .acp-pill:hover, .acp-dark .acp-pill:hover { transform: none; }
        }
      `}</style>
    </div>
  );
}
