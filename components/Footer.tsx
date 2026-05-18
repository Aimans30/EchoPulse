'use client';

import Link from 'next/link';

const serviceLinks = [
  'Video Editing', 'LinkedIn Ghostwriting', 'Blog Production',
  'Ad Creatives', 'Websites & Funnels', 'Automations',
];

const companyLinks = ['About', 'Our Work', 'Results', 'Pricing', 'Contact'];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(12,12,11,0.09)',
        padding: '72px 56px 48px',
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
        gap: '56px',
      }}
      className="site-footer"
    >
      <div>
        <a
          href="/"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            marginBottom: '14px',
            textDecoration: 'none',
            color: '#0C0C0B',
            display: 'block',
          }}
        >
          Echo<span style={{ color: '#E8541A' }}>Pulse</span>
        </a>
        <p style={{ fontSize: '14px', color: '#6E6B63', lineHeight: 1.7, marginBottom: '28px', margin: '0 0 28px' }}>
          Full-stack content studio for premium founders and brands. Voice-driven video, LinkedIn ghostwriting, blogs, ad creatives, websites, and automations. Without the AI slop.
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a
            href="https://www.instagram.com/echopulse.media?igsh=bnY4Z2Zza2k4Njgw"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="EchoPulse on Instagram"
            style={{ display: 'inline-flex', width: '36px', height: '36px', borderRadius: 10, alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="#0C0C0B" strokeWidth="1" fill="none" />
              <path d="M12 7.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5z" stroke="#0C0C0B" strokeWidth="1" fill="none" />
              <circle cx="17" cy="7" r="0.8" fill="#0C0C0B" />
            </svg>
          </a>

          <a
            href="https://www.linkedin.com/company/echo-pulse-media/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="EchoPulse on LinkedIn"
            style={{ display: 'inline-flex', width: '36px', height: '36px', borderRadius: 10, alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5z" transform="translate(4 5)" stroke="#0C0C0B" strokeWidth="0.6" fill="none" />
              <rect x="2" y="3" width="3" height="8" rx="0.5" transform="translate(9 5)" stroke="#0C0C0B" strokeWidth="0.6" fill="none" />
              <path d="M2 3h3v8H2z" transform="translate(15 5)" stroke="#0C0C0B" strokeWidth="0.6" fill="none" />
            </svg>
          </a>
        </div>
      </div>

      <div>
        <h3
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#A8A49B',
            marginBottom: '20px',
          }}
        >
          Services
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {serviceLinks.map((s) => (
            <li key={s}>
              <a
                href="#services"
                style={{ color: '#6E6B63', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#0C0C0B')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#6E6B63')}
              >
                {s}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#A8A49B',
            marginBottom: '20px',
          }}
        >
          Company
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {companyLinks.map((c) => (
            <li key={c}>
              <a
                href={`#${c.toLowerCase()}`}
                style={{ color: '#6E6B63', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#0C0C0B')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#6E6B63')}
              >
                {c}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#A8A49B',
            marginBottom: '20px',
          }}
        >
          Contact
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'echopulse.media', href: 'https://echopulse.media' },
            { label: 'Instagram', href: '#' },
            { label: 'LinkedIn', href: '#' },
            { label: 'YouTube', href: '#' },
          ].map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{ color: '#6E6B63', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#0C0C0B')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#6E6B63')}
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          gridColumn: '1/-1',
          borderTop: '1px solid rgba(12,12,11,0.09)',
          paddingTop: '32px',
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p style={{ fontSize: '13px', color: '#A8A49B', margin: 0 }}>
          © 2026 EchoPulse. All rights reserved.
        </p>
        <p style={{ fontSize: '13px', color: '#A8A49B', margin: 0 }}>
          Voice-driven content. Engineered to convert.
        </p>
      </div>

      <style>{`
        @media (max-width: 1200px) { .site-footer { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 768px) { .site-footer { grid-template-columns: 1fr !important; padding: 56px 28px 32px !important; } }
      `}</style>
    </footer>
  );
}
