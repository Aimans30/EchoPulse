'use client';

import { useState } from 'react';

/**
 * Copy button for the citation. The citation itself is plain server HTML on
 * the page; this only copies it. Fails silently where the clipboard API is
 * unavailable, because the text is selectable either way.
 */
export default function CopyCitation({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="cs-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard blocked: the text is on the page to select by hand */
        }
      }}
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy citation'}</span>
    </button>
  );
}
