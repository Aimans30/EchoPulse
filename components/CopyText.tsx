'use client';

import { useState } from 'react';

/** Shows a value in a code box with a button that copies it to the clipboard. */
export default function CopyText({ value, label = 'Copy', block = false }: { value: string; label?: string; block?: boolean }) {
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
  return (
    <div className={block ? 'ct ct-block' : 'ct'}>
      {block ? <pre>{value}</pre> : <code>{value}</code>}
      <button type="button" onClick={copy} aria-live="polite">{done ? 'Copied' : label}</button>
      <style>{`
        .ct { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 12px 12px 12px 18px; border-radius: 12px; background: #0C0C0B; color: #F2EEE7; margin: 8px 0 4px; }
        .ct code { flex: 1 1 220px; min-width: 0; font-size: 15px; overflow-wrap: anywhere; color: #F2EEE7; }
        .ct-block { flex-direction: column; align-items: stretch; padding: 18px; }
        .ct-block pre { margin: 0; max-height: 340px; overflow: auto; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #F2EEE7; }
        .ct-block button { align-self: flex-start; }
        .ct button { min-height: 40px; padding: 0 18px; border: 0; border-radius: 100px; background: #E8541A; color: #fff; font: 800 14px Inter, sans-serif; cursor: pointer; }
        .ct button:focus-visible { outline: 3px solid #F2EEE7; outline-offset: 2px; }
      `}</style>
    </div>
  );
}
