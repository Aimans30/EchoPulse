'use client';

import { motion } from 'framer-motion';
import { trackPilotClick, trackCallClick } from '@/lib/analytics';
import { useGeoPrice } from '@/lib/useGeoPrice';
import { fadeUp, stagger, DUR, RISE } from '@/lib/motion';
import { MagneticButton, ShimmerText } from '@/components/ui/Premium';

/**
 * Closing CTA band on a blog post.
 *
 * Placement: rendered by app/blog/[slug]/page.tsx OUTSIDE the two-column grid,
 * after Related Articles, at the full 1180px content width. It used to sit
 * inside <article>, which is capped at 760px, so a wide dark card was wedged
 * into the prose column and read as cramped. This mirrors the MagicBnB blog,
 * where the closing CTA is a full-width band and Related Articles comes first.
 *
 * The old background was a single unsized radial gradient anchored off the
 * card's top-right corner. Because the card clips its own overflow, the soft
 * edge of that circle landed inside the visible area and drew a faint diagonal
 * seam across the panel. Fixed by using a linear base plus a radial that is
 * fully contained, so there is no visible terminator.
 *
 * Every claim below already exists elsewhere on the site:
 *   - $299 / $599 come from lib/useGeoPrice.ts, the same pair Pricing.tsx and
 *     the Offer schema render.
 *   - The deliverable lines are trimmed from Pricing.tsx DEFAULT_PILOT_FEATURES.
 *   - "Revisions until you are satisfied" and the 48-hour turnaround are the
 *     standing terms on every service page.
 * Nothing here is a new promise invented for the sake of the pitch.
 */
export default function BlogFooterCTA({ category }: { category?: string }) {
  const { currency, prices } = useGeoPrice();

  const REASONS = [
    'A 30-day content plan built around your business, yours to keep either way',
    '8 short-form videos and 5 long-form SEO blogs, written, edited, delivered',
    'Revisions until you would post it under your own name',
    'No contract, no retainer, no auto-renew. It ends on day 14 unless you say otherwise.',
  ];

  return (
    <div
      className="blog-cta"
      data-dark-bg="true"
    >
      <div className="blog-cta-inner">
        {/* Each block reveals on the shared scale rather than all at once.
            The order (chip, headline, sub, reasons, price, button) is the order
            a reader's eye takes anyway, so the motion follows attention instead
            of competing with it. */}
        <motion.span className="blog-cta-chip" {...fadeUp({ y: RISE.sm, duration: DUR.md })}>
          <span className="blog-cta-chip-dot" aria-hidden="true" />
          {category ? `${category} · 14-day Pilot` : '14-day Pilot'}
        </motion.span>

        <motion.h2 className="blog-cta-head" {...fadeUp({ delay: stagger(1) })}>
          Stop reading about content.
          <br />
          {/* The one shimmering element on the page. It works because it is
              rare and because it is the line the whole card turns on. */}
          <ShimmerText base="rgba(232,84,26,0.55)" highlight="#FF7A45">
            Go and look at yours.
          </ShimmerText>
        </motion.h2>

        <motion.p className="blog-cta-sub" {...fadeUp({ delay: stagger(2) })}>
          Most agencies ask you to sign a six-month retainer based on a slide deck.
          We would rather just do the work first and let you judge it. That is the
          entire idea behind the Pilot.
        </motion.p>

        <ul className="blog-cta-list">
          {REASONS.map((line, i) => (
            <motion.li key={line} {...fadeUp({ y: RISE.sm, duration: DUR.md, delay: stagger(i + 3) })}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#E8541A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{line}</span>
            </motion.li>
          ))}
        </ul>

        <motion.div className="blog-cta-price" {...fadeUp({ delay: stagger(7) })}>
          <span className="blog-cta-price-now">{currency}{prices.pilot}</span>
          <span className="blog-cta-price-was">{currency}{prices.pilotOriginal}</span>
          <span className="blog-cta-price-note">one time, not a subscription</span>
        </motion.div>

        {/* MagneticButton: drifts a few px toward the cursor. Deliberately
            subtle enough that most people never consciously notice it, which
            is the point. It reads as the interface being responsive rather
            than as an effect. No-ops on touch and under prefers-reduced-motion. */}
        <MagneticButton
          onClick={() => {
            trackCallClick('blog_footer');
            (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
          }}
          className="blog-cta-btn"
        >
          Book a free strategy call
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </MagneticButton>

        <p className="blog-cta-reassure">
          Free, 30 minutes, and you will get the plan whether or not you hire us.
        </p>

        <a
          href="/#pricing"
          onClick={() => trackPilotClick('blog_footer_pricing')}
          data-cursor-hover
          className="blog-cta-alt"
        >
          Or see what everything costs
        </a>
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
          box-shadow: 0 30px 80px -20px rgba(12,12,11,0.45);
        }
        .blog-cta-inner {
          position: relative;
          max-width: 620px;
          margin: 0 auto;
          padding: 56px 40px 48px;
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
        .blog-cta-head-accent { color: #E8541A; }
        .blog-cta-sub {
          font-size: 15.5px;
          line-height: 1.65;
          color: rgba(242,238,231,0.62);
          margin: 0 auto 28px;
          max-width: 500px;
        }
        .blog-cta-list {
          list-style: none;
          padding: 0;
          margin: 0 auto 30px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
          max-width: 460px;
        }
        .blog-cta-list li {
          display: flex;
          gap: 11px;
          align-items: flex-start;
          font-size: 14.5px;
          line-height: 1.5;
          color: rgba(242,238,231,0.88);
        }
        .blog-cta-list svg { flex-shrink: 0; margin-top: 2px; }
        .blog-cta-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 26px;
        }
        .blog-cta-price-now {
          font-size: 40px;
          font-weight: 900;
          letter-spacing: -1.4px;
          color: #F2EEE7;
          line-height: 1;
        }
        .blog-cta-price-was {
          font-size: 18px;
          color: rgba(242,238,231,0.35);
          text-decoration: line-through;
        }
        .blog-cta-price-note {
          font-size: 13px;
          color: rgba(242,238,231,0.5);
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
          box-shadow: 0 12px 30px rgba(232,84,26,0.32);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          touch-action: manipulation;
        }
        .blog-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 38px rgba(232,84,26,0.42);
        }
        .blog-cta-reassure {
          font-size: 12.5px;
          color: rgba(242,238,231,0.45);
          margin: 14px 0 0;
        }
        .blog-cta-alt {
          display: inline-block;
          margin-top: 16px;
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
          .blog-cta-inner { padding: 40px 22px 36px; }
          .blog-cta-head { font-size: 26px; letter-spacing: -0.8px; }
          .blog-cta-sub { font-size: 14.5px; margin-bottom: 24px; }
          .blog-cta-list li { font-size: 14px; }
          .blog-cta-price-now { font-size: 34px; }
          /* Full-width tap target on phones. */
          .blog-cta-btn { width: 100%; padding: 16px 22px; }
        }
      `}</style>
    </div>
  );
}
