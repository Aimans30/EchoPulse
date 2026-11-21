'use client';

import { useState } from 'react';

/**
 * Shows a value in a code box with a button that copies it to the clipboard.
 * `block` is for long text (a full prompt): a small header bar holds `title`
 * and the button, and the text scrolls underneath.
 */
export default function CopyText({
  value,
  label = 'Copy',
  block = false,
  title,
}: {
  value: string;
  label?: string;
  block?: boolean;
  title?: string;
}) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Older browsers: select-and-copy fallback.
      const t = document.createElement('textarea');
      t.value = value;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 2000);
  };
  const button = (
    <button type="button" onClick={copy} aria-live="polite" className={done ? 'ct-btn ct-done' : 'ct-btn'}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {done ? <path d="M20 6 9 17l-5-5" /> : <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>}
      </svg>
      {done ? 'Copied' : label}
    </button>
  );
  return (
    <div className={block ? 'ct ct-block' : 'ct'}>
      {block ? (
        <>
          <div className="ct-bar">
            <span className="ct-title">{title}</span>
            {button}
          </div>
          <pre tabIndex={0}>{value}</pre>
        </>
      ) : (
        <>
          <code>{value}</code>
          {button}
        </>
      )}
      <style>{`
        .ct { box-sizing: border-box; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 8px 8px 8px 16px; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; background: #161513; color: #F2EEE7; margin: 16px 0 0; }
        .ct code { flex: 1 1 120px; min-width: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 14px; line-height: 1.5; overflow-wrap: anywhere; color: #F2EEE7; }
        .ct-btn { flex: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 16px; border: 1px solid rgba(242,238,231,0.16); border-radius: 999px; background: rgba(242,238,231,0.08); color: #F2EEE7; font: 600 14px/1 var(--font-inter), Inter, sans-serif; cursor: pointer; transition: background-color .2s ease, border-color .2s ease; }
        .ct-btn:hover { background: rgba(242,238,231,0.14); border-color: rgba(242,238,231,0.28); }
        .ct-btn.ct-done { background: #E8541A; border-color: #E8541A; color: #FFFFFF; }
        .ct-btn:focus-visible { outline: 3px solid #E8541A; outline-offset: 2px; }
        .ct-block { flex-direction: column; align-items: stretch; gap: 0; padding: 0; overflow: hidden; }
        .ct-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 8px 8px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); }
        .ct-title { min-width: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(242,238,231,0.55); }
        .ct-block pre { margin: 0; padding: 16px; max-height: 320px; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.7; color: rgba(242,238,231,0.86); }
        .ct-block pre:focus-visible { outline: 2px solid #E8541A; outline-offset: -2px; }
      `}</style>
    </div>
  );
}
