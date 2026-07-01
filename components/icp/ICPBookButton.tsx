'use client';

import { trackCallClick } from '@/lib/analytics';

/**
 * ICPBookButton — the single booking path for ICP pages. Every CTA (nav, hero,
 * pricing, final) routes through the same global openBookCallModal() the rest
 * of the site uses, so there is never a second booking flow. Client island so
 * the surrounding section can stay server-rendered.
 */
export default function ICPBookButton({
  label,
  location,
  accent,
  variant = 'solid',
  size = 'md',
  fullWidthMobile = false,
}: {
  label: string;
  location: string;
  accent: string;
  variant?: 'solid' | 'light';
  size?: 'md' | 'lg';
  fullWidthMobile?: boolean;
}) {
  const pad = size === 'lg' ? '17px 34px' : '14px 28px';
  const fontSize = size === 'lg' ? 15 : 13;
  const solid = variant === 'solid';

  return (
    <button
      type="button"
      data-cursor-hover
      className={`icp-book-btn${fullWidthMobile ? ' icp-book-btn-fw' : ''}`}
      onClick={() => {
        trackCallClick(location);
        (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
      }}
      style={{
        background: solid ? accent : '#F2EEE7',
        color: solid ? '#fff' : '#0C0C0B',
        border: 'none',
        padding: pad,
        borderRadius: 100,
        fontSize,
        fontWeight: 700,
        fontFamily: 'Inter, sans-serif',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        cursor: 'none',
        boxShadow: solid ? `0 8px 32px ${accent}55` : '0 8px 28px rgba(0,0,0,0.18)',
        minHeight: 48,
        whiteSpace: 'nowrap',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
    >
      {label}
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
    </button>
  );
}
