'use client';

import Link from 'next/link';

import { services } from '@/lib/serviceData';
import { icps } from '@/lib/icpData';

/**
 * Footer service links.
 *
 * These used to be a hardcoded string array where every single item linked to
 * `#services` — an anchor on the homepage. That meant our seven money pages
 * (/services/video-editing, /services/linkedin-ghostwriting, ...) had almost no
 * internal links pointing at them, so they inherited no authority from the
 * site's most-linked element. Google also can't rank an anchor as a page.
 *
 * Now derived from serviceData, so the footer always links to the real URLs and
 * stays in sync automatically when a service is added or renamed.
 */
const serviceLinks = services.map((s) => ({
  label: s.name,
  href: `/services/${s.slug}`,
}));

/**
 * Audience pages, derived from icpData the same way services are.
 *
 * These 5 pages are marked priority 0.9 in app/sitemap.ts and described there
 * as "the primary outbound conversion destinations", yet their only inbound
 * link anywhere on the site was one card grid on the homepage. Not the footer,
 * not the nav, not one of the 40+ blog posts. Pages built to rank for
 * "content agency for coaches" were receiving no internal link equity at all.
 *
 * The footer renders on the homepage, /about, the blog index and every blog
 * post, so adding them here gives each ICP page ~45 internal inbound links
 * where it previously had one.
 */
const audienceLinks = icps.map((i) => ({
  label: i.name,
  href: `/${i.key}`,
}));

export default function Footer() {
  return (
    <footer
      id="site-footer"
      style={{
        borderTop: '1px solid rgba(12,12,11,0.09)',
        padding: '72px 56px 48px',
        display: 'grid',
        // Five tracks, not four. Adding the "Who We Work With" column gave this
        // grid a fifth child against four declared tracks, so auto-placement
        // wrapped Contact onto its own row with three empty cells beside it.
        gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr',
        gap: '48px',
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
              className="footer-social"
              aria-label="EchoPulse on LinkedIn"
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
                // Cursor handled in CSS so it can be gated to hover devices.
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
            <li key={s.href}>
              <a
                href={s.href}
                style={{ color: '#6E6B63', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#0C0C0B')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#6E6B63')}
              >
                {s.label}
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
          Who We Work With
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {audienceLinks.map((a) => (
            <li key={a.href}>
              <a
                href={a.href}
                style={{ color: '#6E6B63', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#0C0C0B')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#6E6B63')}
              >
                {a.label}
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
            // "Order a service" (/order) was removed from site-wide nav. The
            // footer renders on blog posts too, so it was handing article
            // readers a direct route into card-entry checkout before they had
            // spoken to anyone. /order still exists and is still reachable
            // from the homepage Pilot card and the service pages; it is just
            // no longer promoted on every page of the site.
            // /about had ZERO inbound links anywhere on the site despite being
            // the #2 page by impressions and the page the Person schema points
            // at as the founder's canonical entity page. It was holding
            // position ~4 purely on Google's crawl memory with nothing
            // reinforcing it internally.
            { label: 'About', href: '/about' },
            { label: 'Work', href: '/work' },
            { label: 'Case studies', href: '/case-studies' },
            { label: 'See pricing', href: '/#pricing' },
            { label: 'FAQ', href: '/#faq' },
            { label: 'Blog', href: '/blog' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Privacy Policy', href: '/privacy' },
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
            // Was { label: 'echopulse.media', href: 'https://echopulse.media' },
            // a Contact column whose only entry linked back to the homepage
            // the reader was already on. The email existed on /about and
            // nowhere else, so anyone who wanted to write rather than book a
            // call had to go hunting for it from a column headed "Contact".
            { label: 'lakshya@echopulse.media', href: 'mailto:lakshya@echopulse.media' },
            { label: 'Lakshya on LinkedIn', href: 'https://www.linkedin.com/in/lakshyasoni/' },
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
        .site-footer .footer-social { cursor: pointer; }
        /* "cursor: none" only makes sense where a real cursor exists and the
           custom one replaces it. On touch it is a no-op at best. */
        @media (hover: hover) and (pointer: fine) {
          .site-footer .footer-social { cursor: none; }
        }
        @media (max-width: 1200px) { .site-footer { grid-template-columns: 1fr 1fr !important; gap: 40px !important; } }
        @media (max-width: 768px) {
          .site-footer {
            grid-template-columns: 1fr !important;
            /* Bottom padding clears BOTH the phone sticky CTA bar (globals.css
               reserves 96px for it) and the iPhone home indicator. Without the
               inset the last row of links sits under the gesture bar. */
            padding: 56px 22px calc(96px + env(safe-area-inset-bottom)) !important;
            gap: 36px !important;
          }
          /* Pad list-item links so the row meets a 44px tap target.
             The 8px gap matters as much as the 44px: at 4px two neighbouring
             hit areas were close enough for one thumb to cover both. */
          .site-footer ul { gap: 8px !important; }
          .site-footer ul li a {
            display: block !important;
            padding: 12px 0 !important;
            font-size: 15px !important;
            min-height: 44px !important;
            line-height: 1.3 !important;
          }
          /* Section heading spacing tightens */
          .site-footer h4 { margin-bottom: 10px !important; }
          /* Brand intro paragraph: at the 15px body floor, looser leading */
          .site-footer p { font-size: 15px !important; line-height: 1.65 !important; }
          /* Bottom bar — stack copyright + tagline so each reads cleanly */
          .site-footer > div:last-of-type {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
            padding-top: 24px !important;
          }
          .site-footer > div:last-of-type p { font-size: 13px !important; line-height: 1.5 !important; }
        }
        @media (max-width: 380px) {
          .site-footer {
            padding: 48px 16px calc(92px + env(safe-area-inset-bottom)) !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}
