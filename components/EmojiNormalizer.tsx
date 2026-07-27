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
    // Elements queued for a scoped re-parse. See the comment on the observer.
    let pending: Set<HTMLElement> = new Set();

    const parseNode = (node: HTMLElement) => {
      if (cancelled) return;
      if (!window.twemoji?.parse) return;
      if (!node.isConnected) return;
      try {
        window.twemoji.parse(node, {
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

    const parseAll = () => parseNode(document.body);

    const flush = () => {
      scheduled = false;
      const batch = pending;
      pending = new Set();
      for (const node of batch) parseNode(node);
    };

    const scheduleParse = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(flush);
    };

    const startObserving = () => {
      if (cancelled) return;
      // Initial parse covers everything currently rendered
      parseAll();
      // Watch for new nodes (tooltips, dynamic imports, etc.) and re-parse them.
      //
      // This used to re-run twemoji.parse(document.body) on EVERY batch of
      // added nodes, which means a full walk of every text node on the page.
      // On the homepage that is a long task, and the things that add nodes
      // are the things that add them constantly: the portfolio carousel, the
      // modals, framer-motion mounts. The result was a repeating main-thread
      // stall that landed squarely on INP. Parsing only the subtrees that
      // were actually added produces identical output for a fraction of the
      // work, because a node that was already parsed cannot have gained an
      // unparsed emoji without a mutation of its own.
      observer = new MutationObserver((muts) => {
        for (const m of muts) {
          for (const node of m.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              pending.add(node as HTMLElement);
            } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
              // A bare text node cannot be handed to twemoji.parse, so scope
              // to its parent element instead.
              pending.add(node.parentElement);
            }
          }
        }
        if (pending.size > 0) scheduleParse();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };

    // Load the (third-party, ~40KB) twemoji parser only once the browser is
    // genuinely idle. Emoji substitution is cosmetic and nothing above the
    // fold depends on it, but as written it competed for bandwidth and
    // main-thread time with hydration on the very connection where that
    // hurts most. requestIdleCallback with a hard timeout keeps the old
    // behaviour as a worst case while getting out of the way of LCP on 4G.
    const load = () => {
      if (cancelled) return;
      if (window.twemoji) {
        startObserving();
        return;
      }
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
    };

    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;
    const idleHandle = ric ? ric(load, { timeout: 3000 }) : window.setTimeout(load, 1200);

    return () => {
      cancelled = true;
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (ric && cic) cic(idleHandle);
      else window.clearTimeout(idleHandle);
      observer?.disconnect();
    };
  }, []);

  return null;
}
