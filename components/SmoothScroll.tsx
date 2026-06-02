'use client';

import { useEffect } from 'react';

/**
 * SmoothScroll — Lenis-based smooth-scroll wrapper, now DISABLED.
 *
 * Why disabled:
 *   Lenis kept getting wedged in a `.lenis-stopped` state — a CSS rule in
 *   globals.css (.lenis.lenis-stopped { overflow: hidden }) locks the page
 *   when that class is on <html>. The stuck-class condition kept reappearing
 *   after modal interactions, dynamic-loaded section mounts, and ScrollTrigger
 *   refreshes. The net effect for the user was a page that wouldn't scroll
 *   at all on desktop.
 *
 *   Native browser scroll is reliable, smooth enough on modern browsers
 *   (CSS `scroll-behavior: smooth` from globals.css line 20 still applies),
 *   and immune to library state bugs. So we trade the silky-smooth inertial
 *   feel for a page that always scrolls. Easy call.
 *
 * Safety effect: on mount, sanitize any leftover Lenis classes that could
 * have been left on <html> from a previous Lenis session (hot reload, etc.).
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    const clearLocks = () => {
      html.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
      // Belt-and-suspenders: clear inline overflow:hidden that any modal,
      // popup, or stale Lenis teardown might have left behind on body/html.
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
      }
      if (html.style.overflow === 'hidden') {
        html.style.overflow = '';
      }
    };
    clearLocks();

    // Check for a TRULY OPEN modal — one that's visible, not just mounted
    // with display:none. A persistently-mounted modal (like BookCallModal,
    // which keeps its iframe alive between opens) has aria-modal but its
    // display flips to none when closed — those don't count as "open".
    const hasVisibleModal = () => {
      const candidates = document.querySelectorAll('[aria-modal="true"]');
      for (let i = 0; i < candidates.length; i++) {
        const el = candidates[i] as HTMLElement;
        if (!el.offsetParent && el.tagName !== 'BODY') continue; // display:none / not in flow
        const cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        return true;
      }
      return false;
    };

    const maybeUnlock = () => {
      if (
        document.body.style.overflow === 'hidden' &&
        !document.body.classList.contains('modal-open') &&
        !hasVisibleModal()
      ) {
        document.body.style.overflow = '';
      }
      if (
        html.style.overflow === 'hidden' &&
        !document.body.classList.contains('modal-open') &&
        !hasVisibleModal()
      ) {
        html.style.overflow = '';
      }
    };

    // Watch for the lock reappearing. The MutationObserver covers every
    // attribute change on <html> and <body> — that's the only way `overflow:
    // hidden` or `lenis-stopped` can land in the first place. The previous
    // 1.5-second setInterval polling loop was a belt-and-braces hack that
    // ran forever for the entire session, masking the true bug AND showing
    // up as a recurring "scroll glitch" because the periodic forced unlock
    // raced with modal-open handlers. Dropped. The observer is sufficient.
    const obs = new MutationObserver(maybeUnlock);
    obs.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    obs.observe(html, { attributes: true, attributeFilter: ['style', 'class'] });

    return () => {
      obs.disconnect();
    };
  }, []);

  return <>{children}</>;
}
