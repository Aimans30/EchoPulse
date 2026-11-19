'use client';

import { useEffect, useRef, useState } from 'react';
import { BOOK_CALL_URL, bookingUrl, staticBookingUrl } from '@/lib/links';
import { lastBookingClick } from '@/lib/attribution';
import { track } from '@/lib/analytics';

/**
 * Cal.com URLs come from bookingUrl() in lib/links.ts, the one builder every
 * booking link uses. It adds the 15-minute slot and display settings (embed)
 * and the visitor's first-touch source, landing page and the button they
 * clicked, so the booking in Cal.com says where it came from.
 */

export default function BookCallModal() {
  const [open, setOpen] = useState(false);
  // Once mounted, never unmount — the iframe stays in the DOM (hidden via
  // display:none) so re-opening is instant. We pay the Cal.com load cost
  // ONCE per session.
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // Cal.com can be slow or blocked (ad blockers, strict networks). After a few
  // seconds of waiting, offer the same calendar in a new tab instead of an
  // endless spinner.
  const [slow, setSlow] = useState(false);
  // Built when the modal opens, so it names the button that opened it (the
  // click every opener records through trackCallClick) and the page it was
  // on. The iframe is kept between opens and only reloads when the URL
  // changes (a different button or page).
  const [url, setUrl] = useState('');
  const openedAt = useRef(0);
  const wasOpen = useRef(false);
  const loadedRef = useRef(false);
  const urlRef = useRef('');
  const closeRef = useRef<HTMLButtonElement>(null);

  // Closed without the calendar ever appearing is a different failure from
  // closed after looking at the slots, so the close event says which.
  useEffect(() => {
    if (open) { wasOpen.current = true; return; }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    track('book_call_modal_close', { calendar_loaded: loadedRef.current });
  }, [open]);

  useEffect(() => {
    (window as unknown as { openBookCallModal?: () => void; closeBookCallModal?: () => void }).openBookCallModal = () => {
      const click = lastBookingClick();
      // Only trust a click from the last few seconds: an opener that forgot to
      // track must not inherit the name of an older button.
      const location = click && Date.now() - click.at < 5000 ? click.location : 'unknown';
      // A reopen from the same button on the same page keeps the loaded
      // calendar. A different button or page gets its own URL, so Cal.com's
      // booking record names the button that was actually used; the iframe
      // reloads once for that, behind the same loading state as a first open.
      const next = bookingUrl({ location: `${location}_modal`, embed: true });
      if (next !== urlRef.current) {
        urlRef.current = next;
        loadedRef.current = false;
        setLoaded(false);
        setSlow(false);
        setUrl(next);
      }
      openedAt.current = Date.now();
      setMounted(true);
      setOpen(true);
    };
    (window as unknown as { openBookCallModal?: () => void; closeBookCallModal?: () => void }).closeBookCallModal = () => setOpen(false);
    return () => {
      try {
        delete (window as unknown as { openBookCallModal?: unknown }).openBookCallModal;
        delete (window as unknown as { closeBookCallModal?: unknown }).closeBookCallModal;
      } catch { /* noop */ }
    };
  }, []);

  // Body-scroll lock — locked only while open, ALWAYS force-cleared on close
  // (don't restore a captured `prev`, which could itself have been 'hidden').
  //
  // <html> is locked alongside <body> because mobile Safari happily keeps
  // scrolling the document when only body has overflow:hidden, which on a
  // phone reads as the page sliding around underneath the calendar. Both
  // elements are the exact pair SmoothScroll's MutationObserver watches and
  // auto-clears, so a stuck lock still cannot survive a close.
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      return;
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    // Keep keyboard focus in this document, on the close button, so Escape
    // reaches the listener above. Once someone clicks inside the calendar,
    // focus is in Cal.com's cross-origin iframe and its key presses can never
    // be seen from here; the close button is the way out from that point.
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      // Hand focus back to the button that opened the modal.
      if (opener?.isConnected) opener.focus({ preventScroll: true });
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open || loaded) return;
    const t = window.setTimeout(() => setSlow(true), 6000);
    return () => window.clearTimeout(t);
  }, [open, loaded]);

  // Idle-time prefetch — warms the browser cache 3s after first paint so
  // the iframe boots fast when the user actually clicks.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    const run = () => {
      try {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        // Warms the connection and the HTML only; the real URL is built on open.
        link.href = staticBookingUrl('prefetch', `${BOOK_CALL_URL}?duration=15&theme=light&layout=month_view`);
        link.as = 'document';
        document.head.appendChild(link);
      } catch { /* noop */ }
    };
    const id = idle ? idle(run, { timeout: 5000 }) : window.setTimeout(run, 3000);
    return () => {
      if (idle) (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="bcm-overlay"
      onClick={() => setOpen(false)}
      role="dialog"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,8,7,0.82)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        display: open ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px 16px',
        // Stops a flick inside the calendar from chaining out to the document
        // once the iframe hits its own scroll end.
        overscrollBehavior: 'contain',
        animation: open ? 'bcm-fade 0.22s ease-out' : undefined,
      }}
      aria-modal={open ? true : undefined}
      aria-hidden={!open}
      aria-label="Book a free 15-minute call"
    >
      <div className="bcm-decor" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,84,26,0.22) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,84,26,0.14) 0%, transparent 70%)', bottom: '10%', right: '15%', filter: 'blur(50px)' }} />
      </div>

      <div
        className="bcm-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(1040px, 100%)',
          maxHeight: 'min(94vh, 860px)',
          height: '100%',
          background: '#F2EEE7',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(12,12,11,0.12)',
          animation: open ? 'bcm-pop 0.36s cubic-bezier(0.16,1,0.3,1)' : undefined,
        }}
      >

        <header className="bcm-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px 18px', borderBottom: '1px solid rgba(12,12,11,0.07)', background: '#FBF9F5', flexShrink: 0, gap: '16px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="bcm-mark"
              src="/logo-128.png"
              alt=""
              width={40}
              height={40}
              style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0, display: 'block' }}
            />
            <div style={{ minWidth: 0 }}>
              <div id="bcm-title" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 800, color: '#0C0C0B', letterSpacing: '-0.3px', lineHeight: 1.25, marginBottom: '3px' }}>
                Book a free 15-minute call
              </div>
              <div className="bcm-sub" style={{ fontSize: '12.5px', color: '#6E6B63', lineHeight: 1.45 }}>
                15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch.
              </div>
            </div>
          </div>

          <button
            type="button"
            ref={closeRef}
            className="bcm-close"
            onClick={() => setOpen(false)}
            aria-label="Close booking modal"
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid rgba(12,12,11,0.10)', background: 'rgba(12,12,11,0.04)', color: '#0C0C0B', fontSize: '18px', fontWeight: 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s ease', lineHeight: 1 }}
          >×</button>
        </header>

        <div style={{ flex: 1, minHeight: 0, background: '#F2EEE7', position: 'relative' }}>
          {!loaded && (
            <div role="status" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '24px', textAlign: 'center', background: '#F2EEE7', zIndex: 1 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid rgba(12,12,11,0.1)', borderTop: '3px solid #E8541A', animation: 'bcm-spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '14px', color: '#4A4740', fontFamily: 'Inter, sans-serif' }}>Loading the calendar</span>
              {slow && (
                <a
                  href={url}
                  data-track-location="book_modal_slow_fallback"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '14px', fontWeight: 700, color: '#0C0C0B', textDecoration: 'underline', textDecorationColor: '#E8541A', textUnderlineOffset: '4px', minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
                >
                  Taking a while? Open the calendar in a new tab
                </a>
              )}
            </div>
          )}
          <iframe
            title="Book a call · EchoPulse"
            src={url}
            onLoad={() => {
              if (!loaded) track('book_call_calendar_loaded', { seconds: Math.round((Date.now() - openedAt.current) / 1000) });
              loadedRef.current = true;
              setLoaded(true);
            }}
            style={{ width: '100%', height: '100%', border: 0, display: 'block', colorScheme: 'light', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            allow="autoplay; fullscreen; clipboard-write"
            loading="eager"
          />
        </div>

        <div className="bcm-footer" style={{ background: '#FBF9F5', borderTop: '1px solid rgba(12,12,11,0.06)', padding: '10px 28px', textAlign: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '12px', color: '#6E6B63', fontFamily: 'Inter, sans-serif' }}>
            No pitch. You keep the notes whether or not you hire us.
          </span>
        </div>
      </div>

      <style>{`
        @keyframes bcm-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bcm-pop { from { opacity: 0; transform: scale(0.94) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes bcm-spin { to { transform: rotate(360deg); } }

        /* ── Phone: the calendar takes the whole screen ──────────────────
           The previous rule here was \`div[aria-modal="true"] { … }\`, an
           unscoped global selector that also caught every OTHER dialog on the
           site (the ICP work-sample video modal, for one). Everything below is
           scoped to .bcm-* so it can only ever restyle this modal.

           An embedded scheduler needs vertical room above everything else:
           inside a 12px-inset rounded card the Cal.com month grid loses ~90px
           to chrome that buys the user nothing, and the date picker is the
           whole conversion. So on a phone the card goes edge to edge, the
           header shrinks, and the close control grows to a real 44px target
           (there is no backdrop left to tap, so it is the ONLY way out). */
        @media (max-width: 640px) {
          .bcm-overlay {
            padding: 0 !important;
            align-items: stretch !important;
            /* A full-bleed card covers the backdrop anyway, so a full-screen
               blur+saturate filter is paid for on the GPU and never seen. */
            background: #0C0C0B !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          /* globals.css pins every open dialog to \`width: min(95vw, 420px)\`
             and a 9/14 aspect-ratio on phones, which squeezes this fixed
             inset:0 overlay off-centre. Three attributes out-specify that
             two-attribute selector so the override lands without editing a
             global sheet other components depend on. */
          .bcm-overlay[role="dialog"][aria-modal="true"] {
            width: 100% !important;
            max-width: none !important;
            aspect-ratio: auto !important;
          }
          .bcm-decor { display: none !important; }
          .bcm-card {
            width: 100% !important;
            max-width: none !important;
            max-height: none !important;
            height: 100% !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            animation: none !important;
          }
          .bcm-header { padding: 12px 14px !important; gap: 10px !important; }
          .bcm-mark { width: 34px !important; height: 34px !important; border-radius: 10px !important; }
          .bcm-sub { font-size: 11px !important; }
          .bcm-close {
            width: 44px !important;
            height: 44px !important;
            font-size: 24px !important;
          }
          .bcm-footer { padding: 8px 14px !important; }
        }
      `}</style>
    </div>
  );
}
