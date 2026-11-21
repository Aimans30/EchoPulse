'use client';

import { useEffect, useRef, useState } from 'react';
import { bookingUrl } from '@/lib/links';
import { track } from '@/lib/analytics';

/**
 * The Cal.com calendar, inline, for /book. Same URL builder and the same
 * loading and "open in a new tab" fallback as components/BookCallModal.tsx.
 *
 * The URL is built in an effect, not during render, because bookingUrl() reads
 * the visitor's first-touch attribution from the browser. The booking in
 * Cal.com records the button as "book_page".
 */
export default function BookPageEmbed() {
  const [url, setUrl] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    // Deferred one tick: the URL depends on browser-only state.
    const t = window.setTimeout(() => setUrl(bookingUrl({ location: 'book_page', embed: true })), 0);
    return () => window.clearTimeout(t);
  }, []);

  // Cal.com focuses a control inside its calendar when it loads, and the
  // browser scrolls the parent page to bring that control into view, which
  // pushes the headline up under the nav. Until the visitor scrolls, touches
  // or presses a key themselves, keep the page where it was.
  useEffect(() => {
    const y0 = window.scrollY;
    let userMoved = false;
    const mark = () => { userMoved = true; };
    const hold = () => { if (!userMoved && Math.abs(window.scrollY - y0) > 2) window.scrollTo({ top: y0, behavior: 'instant' }); };
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    events.forEach((n) => window.addEventListener(n, mark, { passive: true }));
    window.addEventListener('scroll', hold, { passive: true });
    const stop = window.setTimeout(() => { userMoved = true; }, 15000);
    return () => {
      events.forEach((n) => window.removeEventListener(n, mark));
      window.removeEventListener('scroll', hold);
      window.clearTimeout(stop);
    };
  }, []);

  // Cal.com can be slow or blocked (ad blockers, strict networks). After a few
  // seconds, offer the same calendar in a new tab instead of an endless spinner.
  useEffect(() => {
    if (loaded) return;
    const t = window.setTimeout(() => setSlow(true), 6000);
    return () => window.clearTimeout(t);
  }, [loaded]);

  return (
    <div className="bk-embed" id="book-calendar">
      {!loaded && (
        <div role="status" className="bk-loading">
          <div className="bk-spin" />
          <span>Loading the calendar</span>
          {slow && url && (
            <a href={url} data-no-modal data-track-location="book_page_slow_fallback" target="_blank" rel="noopener noreferrer" className="bk-link">
              Taking a while? Open the calendar in a new tab
            </a>
          )}
        </div>
      )}
      {url && (
        <iframe
          title="Book a call with EchoPulse Media"
          src={url}
          onLoad={() => {
            if (!loaded) track('book_call_calendar_loaded', { seconds: Math.round((Date.now() - startedAt.current) / 1000), surface: 'book_page' });
            setLoaded(true);
          }}
          allow="autoplay; fullscreen; clipboard-write"
          loading="eager"
          className="bk-frame"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
      {/* Always visible: a blocked iframe still fires onLoad with an empty page,
          so the spinner's slow fallback alone can miss it. */}
      {url && (
        <p className="bk-fallback">
          Calendar not showing?{' '}
          <a href={url} data-no-modal data-track-location="book_page_footer_fallback" target="_blank" rel="noopener noreferrer" className="bk-link">
            Open it in a new tab
          </a>
        </p>
      )}
      <style>{`
        .bk-embed { position: relative; }
        .bk-frame { display: block; width: 100%; height: 680px; border: 0; background: #F2EEE7; color-scheme: light; border-radius: 20px; transition: opacity 0.3s ease; }
        .bk-loading { position: absolute; top: 0; left: 0; right: 0; height: 680px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px; text-align: center; font-size: 14px; color: #4A4740; }
        .bk-spin { width: 36px; height: 36px; border-radius: 50%; border: 3px solid rgba(12,12,11,0.1); border-top-color: #E8541A; animation: bk-spin 0.8s linear infinite; }
        .bk-link { font-size: 14px; font-weight: 700; color: #0C0C0B; text-decoration: underline; text-decoration-color: #E8541A; text-underline-offset: 4px; min-height: 44px; display: inline-flex; align-items: center; }
        .bk-fallback { margin: 12px 0 0; text-align: center; font-size: 13px; color: #6E6B63; }
        .bk-fallback .bk-link { font-size: 13px; min-height: 0; }
        @keyframes bk-spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .bk-frame, .bk-loading { height: 880px; } }
      `}</style>
    </div>
  );
}
