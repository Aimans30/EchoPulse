'use client';

import { useEffect, useState } from 'react';
import { track, trackCallClick } from '@/lib/analytics';

/**
 * Phone-only bar on blog posts (max-width 860px).
 *
 * One line fixed to the bottom of the screen: the same single button the
 * in-article card carries, plus a close control. It stays hidden for the first
 * half of the post, which is the part most readers came for, and slides in
 * once the reader is past 50% of the page. Before this a phone reader had no
 * way to act between the first card and the end of the post: the site-wide
 * sticky bar is suppressed on /blog and the side rail is desktop only.
 *
 * It is a bar, not a popup: no overlay, no focus trap, nothing is covered
 * except its own 56px strip, and it steps aside while the closing card (same
 * button) is on screen. Closing it keeps it closed for the rest of the
 * browser session. The link is in the server-rendered HTML; only the show and
 * hide is client-side. With prefers-reduced-motion the bar still appears, it
 * just does not slide.
 */
const DISMISS_KEY = 'ep_blog_bar_closed';

export default function BlogStickyBar({
  kind,
  label,
  href,
}: {
  kind: 'sample' | 'call';
  label: string;
  href: string;
}) {
  const [shown, setShown] = useState(false);
  const [closed, setClosed] = useState(false);
  // True while the closing card is on screen: it carries the same button, so
  // the bar steps aside rather than sit on top of it.
  const [atClosingCard, setAtClosingCard] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch { /* private mode: treat as not dismissed */ }
    if (dismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads sessionStorage, which only exists after mount
      setClosed(true);
      return;
    }
    let ticking = false;
    const measure = () => {
      ticking = false;
      const room = document.documentElement.scrollHeight - window.innerHeight;
      setShown(room > 0 && window.scrollY / room >= 0.5);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const card = document.querySelector('.blog-cta');
    const io =
      card && 'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => setAtClosingCard(entry.isIntersecting))
        : null;
    if (card && io) io.observe(card);
    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const close = () => {
    setClosed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1');
    } catch { /* non-fatal */ }
  };

  const visible = shown && !closed && !atClosingCard;
  const external = kind === 'call';

  return (
    <div className={`blog-bar${visible ? ' is-on' : ''}`} data-ask={kind}>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onClick={() =>
          external ? trackCallClick('blog_sticky_bar') : track('cta_free_edits_click', { location: 'blog_sticky_bar' })
        }
        className="blog-bar-btn"
      >
        {label}
      </a>
      <button type="button" onClick={close} className="blog-bar-x" aria-label="Hide this bar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <style>{`
        .blog-bar { display: none; }
        @media (max-width: 860px) {
          .blog-bar {
            display: flex;
            align-items: center;
            gap: 4px;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 90;
            box-sizing: border-box;
            padding: 6px 6px calc(6px + env(safe-area-inset-bottom, 0px)) 14px;
            background: rgba(12,12,11,0.96);
            border-top: 1px solid rgba(255,255,255,0.10);
            transform: translateY(100%);
            visibility: hidden;
            transition: transform 0.28s ease, visibility 0s linear 0.28s;
          }
          .blog-bar.is-on {
            transform: translateY(0);
            visibility: visible;
            transition: transform 0.28s ease, visibility 0s;
          }
          .blog-bar-btn {
            flex: 1 1 auto;
            min-width: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
            box-sizing: border-box;
            padding: 8px 16px;
            border-radius: 100px;
            background: #E8541A;
            color: #fff;
            font-family: Inter, sans-serif;
            font-size: 14.5px;
            font-weight: 700;
            text-decoration: none;
            white-space: nowrap;
            touch-action: manipulation;
          }
          .blog-bar-x {
            flex: 0 0 44px;
            width: 44px;
            height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: 0;
            padding: 0;
            color: rgba(242,238,231,0.7);
            cursor: pointer;
            touch-action: manipulation;
          }
          @media (prefers-reduced-motion: reduce) {
            .blog-bar, .blog-bar.is-on { transition: none; }
          }
        }
      `}</style>
    </div>
  );
}
