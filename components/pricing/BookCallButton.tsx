'use client';

import { trackCallClick } from '@/lib/analytics';

/**
 * The closing ask on /pricing. Opens the site-wide booking modal
 * (components/BookCallModal.tsx registers window.openBookCallModal), the same
 * single booking path every other "Book a free 15-minute call" button uses.
 */
export default function BookCallButton({ label, location }: { label: string; location: string }) {
  return (
    <button
      type="button"
      data-cursor-hover
      data-track-location={location}
      className="ppg-book"
      onClick={() => {
        trackCallClick(location);
        (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
      }}
    >
      <span>{label}</span>
      <svg className="ppg-book-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}
