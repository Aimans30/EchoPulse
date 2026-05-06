'use client';

/**
 * EmojiNormalizer — replaces every emoji in the DOM with an Apple-emoji image.
 *
 * Strategy: Twemoji's parser does the DOM walking (finds emoji codepoints
 * in text nodes, splits text, inserts <img> elements, MutationObserver-watches
 * for new ones). We override its URL builder via the `callback` option so the
 * generated <img> points to the Elk emoji CDN proxy with `?style=apple`, which
 * serves the actual Apple Color Emoji image set.
 *
 * Apple Color Emoji is proprietary raster (PNG) — there is no clean SVG source.
 * The Elk CDN is the standard third-party proxy used widely (Mastodon clients,
 * blog platforms, etc.) for cross-platform Apple-emoji rendering.
 *
 * Each emoji renders as a tiny inline <img class="apple-emoji"> sized to 1em
 * via CSS, baseline-aligned with surrounding text.
 */

import { useEffect } from 'react';

declare global {
  interface Window {
    twemoji?: {
      parse: (
        node: HTMLElement | string,
        options?: {
          callback?: (icon: string, options: { base: string; size: string; ext: string }) => string | false;
          className?: string;
          attributes?: () => Record<string, string>;
        },
      ) => string | void;
    };
  }
}

const TWEMOJI_SRC = 'https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js';

/** Convert a Twemoji codepoint string ("1f3ac" or "1f1fa-1f1f8") back to the actual emoji character. */
function codepointToEmoji(codepoint: string): string {
  return codepoint
    .split('-')
    .map((c) => String.fromCodePoint(parseInt(c, 16)))
    .join('');
}

export default function EmojiNormalizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    let observer: MutationObserver | null = null;
    let scheduled = false;

    const parseAll = () => {
      if (cancelled) return;
      if (!window.twemoji?.parse) return;
      try {
        window.twemoji.parse(document.body, {
          className: 'apple-emoji',
          callback: (icon) => {
            try {
              const emoji = codepointToEmoji(icon);
              return `https://emojicdn.elk.sh/${encodeURIComponent(emoji)}?style=apple`;
            } catch {
              return false; // skip — Twemoji will leave native glyph
            }
          },
        });
      } catch {
        /* non-fatal */
      }
    };

    const scheduleParse = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        parseAll();
      });
    };

    const startObserving = () => {
      if (cancelled) return;
      // Initial parse covers everything currently rendered
      parseAll();
      // Watch for new nodes (tooltips, dynamic imports, etc.) and re-parse them
      observer = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.addedNodes.length > 0) {
            scheduleParse();
            return;
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };

    // Load script if not already loaded
    if (window.twemoji) {
      startObserving();
    } else {
      const existing = document.querySelector(`script[src="${TWEMOJI_SRC}"]`) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', startObserving, { once: true });
      } else {
        const s = document.createElement('script');
        s.src = TWEMOJI_SRC;
        s.async = true;
        s.crossOrigin = 'anonymous';
        s.addEventListener('load', startObserving, { once: true });
        document.head.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  return null;
}
