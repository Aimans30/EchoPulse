"use client";

import { useEffect, useState } from 'react';
import { BOOK_CALL_URL } from '@/lib/links';

export default function BookCallModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Expose a global opener for existing UI to call
    (window as any).openBookCallModal = () => setOpen(true);
    (window as any).closeBookCallModal = () => setOpen(false);
    return () => {
      try {
        delete (window as any).openBookCallModal;
        delete (window as any).closeBookCallModal;
      } catch (e) {}
    };
  }, []);

  if (!open) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(1100px, 95vw)', aspectRatio: '16 / 9', background: '#fff', borderRadius: 10, overflow: 'hidden' }}
      >
        <iframe
          title="Book a call"
          src={BOOK_CALL_URL}
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </div>
    </div>
  );
}
