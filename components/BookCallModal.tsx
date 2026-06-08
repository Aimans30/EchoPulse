'use client';

import { useEffect, useState } from 'react';
import { BOOK_CALL_URL } from '@/lib/links';

function calUrl(base: string): string {
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}theme=light&layout=month_view`;
}

export default function BookCallModal() {
  const [open, setOpen] = useState(false);
  // Once mounted, never unmount — the iframe stays in the DOM (hidden via
  // display:none) so re-opening is instant. We pay the Cal.com load cost
  // ONCE per session.
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (window as unknown as { openBookCallModal?: () => void; closeBookCallModal?: () => void }).openBookCallModal = () => { setMounted(true); setOpen(true); };
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
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  // Idle-time prefetch — warms the browser cache 3s after first paint so
  // the iframe boots fast when the user actually clicks.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    const run = () => {
      try {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = calUrl(BOOK_CALL_URL);
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
        animation: open ? 'bcm-fade 0.22s ease-out' : undefined,
      }}
      aria-modal={open ? true : undefined}
      aria-hidden={!open}
      aria-label="Book a strategy call"
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,84,26,0.22) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,84,26,0.14) 0%, transparent 70%)', bottom: '10%', right: '15%', filter: 'blur(50px)' }} />
      </div>

      <div
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
          boxShadow: '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(232,84,26,0.28), 0 0 80px rgba(232,84,26,0.15)',
          animation: open ? 'bcm-pop 0.36s cubic-bezier(0.16,1,0.3,1)' : undefined,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent 0%, #E8541A 30%, #FF7A45 50%, #E8541A 70%, transparent 100%)', zIndex: 3 }} />

        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px 18px', borderBottom: '1px solid rgba(12,12,11,0.07)', background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF8F4 100%)', flexShrink: 0, gap: '16px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#0C0C0B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 16px rgba(12,12,11,0.25)' }} aria-hidden="true">
              <span style={{ color: '#E8541A', fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 900, letterSpacing: '-0.5px' }}>E</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 800, color: '#0C0C0B', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                  Book a Strategy Call
                </span>
                <span style={{ background: 'linear-gradient(135deg, #E8541A, #FF7A45)', color: '#fff', fontSize: '9.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', letterSpacing: '0.4px', textTransform: 'uppercase', flexShrink: 0 }}>Free</span>
              </div>
              <div style={{ fontSize: '12px', color: '#8A877F', lineHeight: 1.4 }}>
                45 min · Content audit + growth roadmap · No pitch unless you ask
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close booking modal"
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid rgba(12,12,11,0.10)', background: 'rgba(12,12,11,0.04)', color: '#0C0C0B', fontSize: '18px', fontWeight: 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s ease', lineHeight: 1 }}
          >×</button>
        </header>

        <div style={{ flex: 1, minHeight: 0, background: '#F2EEE7', position: 'relative' }}>
          {!loaded && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: '#F2EEE7', zIndex: 1 }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '3px solid rgba(232,84,26,0.15)', borderTop: '3px solid #E8541A', animation: 'bcm-spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '13px', color: '#8A877F', fontFamily: 'Inter, sans-serif' }}>Loading calendar…</span>
            </div>
          )}
          <iframe
            title="Book a call · EchoPulse"
            src={calUrl(BOOK_CALL_URL)}
            onLoad={() => setLoaded(true)}
            style={{ width: '100%', height: '100%', border: 0, display: 'block', colorScheme: 'light', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            allow="autoplay; fullscreen; clipboard-write"
            loading="eager"
          />
        </div>

        <div style={{ background: 'linear-gradient(135deg, #FAF8F4, #F2EEE7)', borderTop: '1px solid rgba(12,12,11,0.05)', padding: '10px 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexShrink: 0 }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#E8541A', opacity: 0.7 }} />
          <span style={{ fontSize: '10.5px', color: '#A09D96', fontFamily: 'Inter, sans-serif', letterSpacing: '0.2px' }}>
            EchoPulse · All meetings are free &amp; no-obligation
          </span>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#E8541A', opacity: 0.7 }} />
        </div>
      </div>

      <style>{`
        @keyframes bcm-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bcm-pop { from { opacity: 0; transform: scale(0.94) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes bcm-spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          div[aria-modal="true"] { padding: 12px 8px !important; align-items: flex-end !important; }
        }
      `}</style>
    </div>
  );
}
