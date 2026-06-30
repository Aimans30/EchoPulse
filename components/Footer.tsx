'use client';

import Link from 'next/link';

const serviceLinks = [
  'Video Editing', 'LinkedIn & Social', 'Blog Production',
  'Ad Creatives', 'Websites & Funnels', 'Automations',
  'Apps & Software',
];

export default function Footer() {
  return (
    <footer
      id="site-footer"
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
        <Link
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
        </Link>
        <p style={{ fontSize: '14px', color: '#6E6B63', lineHeight: 1.7, marginBottom: '28px', margin: '0 0 28px' }}>
          Done-for-you marketing for serious businesses. Video, content, ads, websites, automations, and custom software for founders, coaches, business owners, and real estate agents. One team, one bill.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { label: 'in', href: 'https://www.linkedin.com/in/lakshyasoni/' },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'none',
                transition: 'all 0.25s',
                textDecoration: 'none',
                color: '#0C0C0B',
                boxShadow: '0 2px 8px rgba(12,12,11,0.07)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#0C0C0B';
                el.style.color = '#F2EEE7';
                el.style.borderColor = '#0C0C0B';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.55)';
                el.style.color = '#0C0C0B';
                el.style.borderColor = 'rgba(255,255,255,0.8)';
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4
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
        </h4>
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
        <h4
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#A8A49B',
            marginBottom: '20px',
          }}
        >
          Quick Links
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Order a service', href: '/order' },
            { label: 'See pricing', href: '/#pricing' },
            { label: 'FAQ', href: '/#faq' },
            { label: 'Blog', href: '/blog' },
            { label: 'Terms of Service', href: '/terms' },
          ].map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
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

      <div>
        <h4
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
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'echopulse.media', href: 'https://echopulse.media' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lakshyasoni/' },
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
          © 2026 EchoPulse Media. All rights reserved.
        </p>
        <p style={{ fontSize: '13px', color: '#A8A49B', margin: 0 }}>
          Done-for-you marketing. For serious businesses.
        </p>
      </div>

      <style>{`
        .site-footer a[href^="#"],
        .site-footer a[href^="http"] {
          display: inline-block;
        }
        @media (max-width: 1200px) { .site-footer { grid-template-columns: 1fr 1fr !important; gap: 40px !important; } }
        @media (max-width: 768px) {
          .site-footer {
            grid-template-columns: 1fr !important;
            padding: 56px 22px 32px !important;
            gap: 36px !important;
          }
          /* Pad list-item links so the row meets a 44px tap target */
          .site-footer ul { gap: 4px !important; }
          .site-footer ul li a {
            display: block !important;
            padding: 12px 0 !important;
            font-size: 15px !important;
            min-height: 44px !important;
            line-height: 1.3 !important;
          }
          /* Section heading spacing tightens */
          .site-footer h4 { margin-bottom: 10px !important; }
          /* Brand intro paragraph: snug font + spacing */
          .site-footer p { font-size: 14px !important; }
          /* Bottom bar — stack copyright + tagline so each reads cleanly */
          .site-footer > div:last-of-type {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
            padding-top: 24px !important;
          }
          .site-footer > div:last-of-type p { font-size: 12.5px !important; }
        }
        @media (max-width: 380px) {
          .site-footer { padding: 48px 16px 28px !important; gap: 32px !important; }
        }
      `}</style>
    </footer>
  );
}
