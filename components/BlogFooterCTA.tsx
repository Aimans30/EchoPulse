'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { track, trackCallClick } from '@/lib/analytics';
import { fadeUp, stagger, DUR, RISE } from '@/lib/motion';
import { FREE_EDITS_URL } from '@/lib/links';
import type { BlogAsk } from '@/lib/blogLinks';

/**
 * Closing card on a blog post.
 *
 * One offer per card, and the button does what the copy says. The old card had
 * a "14-day Pilot" chip, a Pilot deliverables list and a $299 price block over
 * a button that booked a free call, so the reader could not tell what a click
 * would do. Now the copy comes from blogAskFor (lib/blogLinks.ts): video and
 * ad posts get the free sample, every other post gets the 15-minute call. Under
 * the button sits one text link (the call, the MagicBNB case study, prices or
 * the Pilot, by service).
 *
 * Placement: the last thing inside <article>, above the newsletter form and
 * Related Articles, because the newsletter is the weaker ask. It used to be
 * the final block on the page (y=17,316 on a phone). The card is short now, so
 * it sits comfortably in the 760px prose column.
 *
 * This is a client component only for the click events. The page works the
 * ask out on the server and passes it in as plain props, so lib/blogLinks.ts
 * (which imports the Sanity client) stays out of the browser bundle, and both
 * links are in the server-rendered HTML.
 */
export default function BlogFooterCTA({
  ask,
  bookUrl,
  category,
}: {
  ask: BlogAsk;
  /** Booking link already UTM-tagged for this post (blogBookUrl). */
  bookUrl: string;
  category?: string;
}) {
  const sample = ask.kind === 'sample';
  const chip = sample ? 'Free sample' : '15 minutes, free';
  const arrow = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );

  return (
    <div className="blog-cta" data-dark-bg="true" data-ask={ask.kind}>
      <div className="blog-cta-inner">
        <motion.span className="blog-cta-chip" {...fadeUp({ y: RISE.sm, duration: DUR.md })}>
          <span className="blog-cta-chip-dot" aria-hidden="true" />
          {category ? `${category} · ${chip}` : chip}
        </motion.span>

        <motion.h2 className="blog-cta-head" {...fadeUp({ delay: stagger(1) })}>
          {ask.closeHead}
        </motion.h2>

        <motion.p className="blog-cta-sub" {...fadeUp({ delay: stagger(2) })}>
          {ask.closeSub}
        </motion.p>

        {sample ? (
          <a
            href={FREE_EDITS_URL}
            onClick={() => track('cta_free_edits_click', { location: 'blog_footer' })}
            data-cursor-hover
            className="blog-cta-btn"
          >
            {ask.buttonLabel}
            {arrow}
          </a>
        ) : (
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCallClick('blog_footer')}
            data-cursor-hover
            className="blog-cta-btn"
          >
            {ask.buttonLabel}
            {arrow}
          </a>
        )}

        {ask.linkIsCall ? (
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCallClick('blog_footer_link')}
            data-cursor-hover
            className="blog-cta-alt"
          >
            {ask.linkLabel}
          </a>
        ) : (
          <Link href={ask.linkHref} data-cursor-hover className="blog-cta-alt">
            {ask.linkLabel}
          </Link>
        )}
      </div>

      <style>{`
        .blog-cta {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          background:
            radial-gradient(120% 120% at 88% 8%, rgba(232,84,26,0.30) 0%, rgba(232,84,26,0) 55%),
            linear-gradient(135deg, #14110F 0%, #0C0C0B 55%, #17110D 100%);
          color: #F2EEE7;
          border: 1px solid rgba(232,84,26,0.18);
          margin: 56px 0 0;
          box-shadow: 0 30px 80px -20px rgba(12,12,11,0.45);
        }
        .blog-cta-inner {
          position: relative;
          max-width: 620px;
          margin: 0 auto;
          padding: 44px 36px 38px;
          text-align: center;
        }
        .blog-cta-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(232,84,26,0.13);
          border: 1px solid rgba(232,84,26,0.32);
          color: #F0763F;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          padding: 7px 15px;
          border-radius: 100px;
          margin-bottom: 22px;
        }
        .blog-cta-chip-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #E8541A;
          flex-shrink: 0;
        }
        .blog-cta-head {
          font-family: Inter, sans-serif;
          font-size: 34px;
          font-weight: 900;
          letter-spacing: -1.1px;
          line-height: 1.1;
          margin: 0 0 16px;
          color: #F2EEE7;
        }
        .blog-cta-sub {
          font-size: 15.5px;
          line-height: 1.65;
          color: rgba(242,238,231,0.62);
          margin: 0 auto 26px;
          max-width: 500px;
        }
        .blog-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          background: #E8541A;
          color: #fff;
          padding: 16px 34px;
          border-radius: 100px;
          font-family: Inter, sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.1px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 12px 30px rgba(232,84,26,0.32);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          touch-action: manipulation;
        }
        .blog-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 38px rgba(232,84,26,0.42);
        }
        .blog-cta-alt {
          display: block;
          width: fit-content;
          margin: 14px auto 0;
          font-size: 13px;
          font-weight: 500;
          color: rgba(242,238,231,0.5);
          text-decoration: underline;
          text-underline-offset: 3px;
          padding: 6px;
        }
        .blog-cta-alt:hover { color: rgba(242,238,231,0.8); }

        @media (max-width: 720px) {
          .blog-cta { border-radius: 20px; }
          .blog-cta { margin-top: 44px; }
          .blog-cta-inner { padding: 34px 20px 30px; }
          .blog-cta-head { font-size: 26px; letter-spacing: -0.8px; }
          .blog-cta-sub { font-size: 14.5px; margin-bottom: 24px; }
          /* Full-width tap target on phones. */
          .blog-cta-btn { width: 100%; padding: 16px 22px; }
        }
      `}</style>
    </div>
  );
}
