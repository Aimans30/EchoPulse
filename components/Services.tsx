'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { PRESENCE, GROWTH } from '@/lib/pricing';

/**
 * Seven services as a plain list. The "Included from" line states only what
 * lib/pricing.ts supports: video, posts and website tune-ups are in
 * PRESENCE.scope; blogs and ad creatives are in GROWTH.scope; automations and
 * apps are not listed in any plan, so they are "scoped on a call" (Custom).
 *
 * Motion: rows are visible by default (no JS, reduced motion). On mount, rows
 * still below the fold get data-sv="wait" and an IntersectionObserver flips
 * them to "in" once, with a short stagger. Hover and focus effects are CSS
 * only and use transform and opacity.
 */
const services = [
  { name: 'Video Editing', slug: 'video-editing', desc: 'Send footage you already have. You get short-form videos, podcast clips and long-form edits back within 48 hours, with captions, hooks and music done. The first 2 edits are free.', from: `Included from Presence Engine, ${PRESENCE.priceLabel} a month` },
  { name: 'LinkedIn & Social', slug: 'linkedin-ghostwriting', desc: 'Posts and carousels written about your business, with the captions done. You read them, approve them and publish. Your pages stay active in the weeks you have no time to write.', from: `Included from Presence Engine, ${PRESENCE.priceLabel} a month` },
  { name: 'Blog Production', slug: 'blog-production', desc: 'Long blog posts on the questions your customers search for. Every statistic carries a working source link, and a person edits each post before you see it.', from: `Included from Growth, ${GROWTH.priceLabel} a month` },
  { name: 'Ad Creatives', slug: 'ad-creatives', desc: 'Static and video ads for your campaigns. New ones arrive every month, so your budget is not spent showing people an ad they have already seen.', from: `Included from Growth, ${GROWTH.priceLabel} a month` },
  { name: 'Websites & Funnels', slug: 'websites-funnels', desc: 'Tune-ups to the site you have now, or a new site and funnel built from scratch. The work is aimed at one thing: more visitors getting in touch.', from: `Tune-ups from Presence Engine, ${PRESENCE.priceLabel} a month. New builds are scoped on a call` },
  { name: 'Automations', slug: 'automations', desc: 'DM flows, email sequences and CRM connections. A new lead gets a reply while you are busy with a client, and their details are saved in your CRM.', from: 'Scoped on a call' },
  { name: 'Apps & Software', slug: 'apps-software', desc: 'Custom MVPs, AI tools and client portals, built at a fixed price. When the build is finished, you own the code.', from: 'Scoped on a call. 20% off on the Growth plan' },
];

export default function Services() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Only rows that are still below the fold opt in, so nothing that the
    // visitor can already see is hidden and shown again.
    const fold = window.innerHeight * 0.92;
    const items = Array.from(list.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el.getBoundingClientRect().top > fold,
    );
    if (items.length === 0) return;
    items.forEach((el) => el.setAttribute('data-sv', 'wait'));

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.style.setProperty('--sv-delay', `${Math.min(n, 6) * 60}ms`);
          el.setAttribute('data-sv', 'in');
          io.unobserve(el);
          n += 1;
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
    items.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      items.forEach((el) => el.removeAttribute('data-sv'));
    };
  }, []);

  return (
    <section id="services" data-dark-bg="true" className="sv-section" aria-labelledby="sv-heading">
      <style>{`
        .sv-section { --sv-ease: cubic-bezier(.16,1,.3,1); background: #0C0C0B; color: #F2EEE7; font-family: Inter, sans-serif; padding: 72px 24px; overflow-x: clip; }
        .sv-wrap { max-width: 1120px; margin: 0 auto; }
        .sv-head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px 48px; align-items: end; margin: 0 0 36px; }
        .sv-h2 { font-size: clamp(30px, 4.2vw, 48px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; margin: 0; max-width: 16ch; }
        .sv-lede { font-size: 16px; line-height: 1.6; color: #D9D4CA; margin: 0; max-width: 52ch; }
        .sv-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(242,238,231,0.18); }
        .sv-item[data-sv="wait"] { opacity: 0; transform: translate3d(0, 14px, 0); }
        .sv-item[data-sv="in"] { opacity: 1; transform: none; transition: opacity 0.6s var(--sv-ease) var(--sv-delay, 0ms), transform 0.6s var(--sv-ease) var(--sv-delay, 0ms); }
        .sv-row { position: relative; display: grid; grid-template-columns: 48px minmax(0, 1fr) minmax(0, 1.6fr) minmax(0, 1.2fr) 24px; gap: 24px; align-items: start; padding: 20px 8px; border-bottom: 1px solid rgba(242,238,231,0.18); color: inherit; text-decoration: none; transition: opacity 0.28s var(--sv-ease); }
        .sv-row::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px; background: #E8541A; transform: scaleX(0); transform-origin: left center; transition: transform 0.28s var(--sv-ease); }
        .sv-row:focus-visible { outline: 3px solid #E8541A; outline-offset: -3px; }
        .sv-num { font-size: 13px; font-weight: 700; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; color: #F08A5D; padding-top: 4px; transition: transform 0.28s var(--sv-ease); }
        .sv-name { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25; margin: 0; transition: transform 0.28s var(--sv-ease); }
        .sv-desc { font-size: 15.5px; line-height: 1.6; color: #D9D4CA; margin: 0; max-width: 62ch; }
        .sv-from { font-size: 14px; line-height: 1.5; color: #B8B2A6; margin: 0; }
        .sv-arrow { justify-self: end; width: 20px; height: 20px; margin-top: 3px; color: #E8541A; opacity: 0; transform: translate3d(-10px, 0, 0); transition: opacity 0.28s var(--sv-ease), transform 0.28s var(--sv-ease); }
        .sv-arrow svg { display: block; width: 100%; height: 100%; }
        .sv-row:focus-visible::after, .sv-row:active::after { transform: scaleX(1); }
        .sv-row:focus-visible .sv-num, .sv-row:focus-visible .sv-name { transform: translate3d(6px, 0, 0); }
        .sv-row:focus-visible .sv-arrow { opacity: 1; transform: none; }
        .sv-list:has(.sv-row:focus-visible) .sv-row:not(:focus-visible) { opacity: 0.55; }
        @media (hover: hover) and (pointer: fine) {
          .sv-row:hover::after { transform: scaleX(1); }
          .sv-row:hover .sv-num, .sv-row:hover .sv-name { transform: translate3d(6px, 0, 0); }
          .sv-row:hover .sv-arrow { opacity: 1; transform: none; }
          .sv-list:has(.sv-row:hover) .sv-row:not(:hover):not(:focus-visible) { opacity: 0.55; }
        }
        @media (max-width: 900px) {
          .sv-head { grid-template-columns: minmax(0, 1fr); margin-bottom: 28px; }
          .sv-row { grid-template-columns: 40px minmax(0, 1fr) 20px; gap: 4px 12px; padding: 20px 0; min-height: 44px; }
          .sv-num { grid-row: 1; grid-column: 1; }
          .sv-name, .sv-desc, .sv-from { grid-column: 2; }
          .sv-desc { margin-top: 4px; }
          .sv-from { margin-top: 8px; }
          .sv-arrow { grid-row: 1; grid-column: 3; width: 18px; height: 18px; margin-top: 4px; opacity: 0.7; transform: none; }
        }
        @media (max-width: 640px) { .sv-section { padding: 56px 16px; } }
        @media (prefers-reduced-motion: reduce) {
          .sv-item[data-sv] { opacity: 1; transform: none; }
          .sv-row:hover .sv-num, .sv-row:hover .sv-name, .sv-row:focus-visible .sv-num, .sv-row:focus-visible .sv-name { transform: none; }
        }
      `}</style>
      <div className="sv-wrap">
        <div className="sv-head">
          <h2 id="sv-heading" className="sv-h2">Seven services. Three people do the work.</h2>
          <p className="sv-lede">Lakshya handles strategy, editing, writing and builds. Shaurya designs. Aiman runs delivery. Each row says what you receive and which plan includes it.</p>
        </div>
        <ul className="sv-list" ref={listRef}>
          {services.map((s, i) => (
            <li key={s.slug} className="sv-item">
              <Link href={`/services/${s.slug}`} className="sv-row">
                <span className="sv-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sv-name">{s.name}</h3>
                <p className="sv-desc">{s.desc}</p>
                <p className="sv-from">{s.from}</p>
                <span className="sv-arrow" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M11 5l5 5-5 5" /></svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
