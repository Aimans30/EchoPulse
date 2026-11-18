'use client';

import { FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';
import { PROMISES } from '@/lib/pricing';
import { trackPilotClick } from '@/lib/analytics';

/**
 * The founder's note. (File keeps the name Testimonials because the homepage
 * imports it under that name; there are no testimonials on the site and this
 * section is what sits in their place.)
 *
 * Rewritten November 2026. The old version was a dark slab with an oversized
 * photo in which the founder's face was not visible, a headline in quotation
 * marks, a paragraph attacking "most agencies" with figures nobody could
 * source, and a "read the full letter" toggle hiding the rest. It read as a
 * template, and it sat directly under another dark section.
 *
 * This one is a short letter on a plain card: who is writing, what he did
 * before, what he saw, the growth-partner role he built because of it, and
 * one next step (a single button: the owner asked for no rows of three). Every claim is the founder's own account of his work history and is
 * repeated, with its caveats, on /case-studies/founder-200-real-estate-agents.
 * No toggle: the whole letter is on the page, so readers and crawlers see the
 * same thing.
 */
export default function Testimonials() {
  const promises = [PROMISES.replies, PROMISES.turnaround, PROMISES.noContract];

  return (
    <section className="fl-section" aria-labelledby="fl-heading">
      <div className="fl-wrap">
        <p className="fl-eyebrow">From the founder</p>
        <h2 id="fl-heading" className="fl-h2">
          A growth partner, <span className="fl-accent">not another vendor.</span>
        </h2>

        <article className="fl-card">
          <header className="fl-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/founder-avatar.jpg"
              alt="Lakshya Soni, founder of EchoPulse Media"
              width={64}
              height={64}
              className="fl-avatar"
              loading="lazy"
            />
            <div>
              <p className="fl-name">Lakshya Soni</p>
              <p className="fl-role">Founder and growth partner, EchoPulse Media</p>
            </div>
          </header>

          <div className="fl-body">
            <p>
              Before EchoPulse, I was the editor. I cut listing tours, agent videos and ads for more than
              200 Canadian real estate agents at a media company they had hired.
            </p>
            <p>
              From the editing desk I could see two things the clients could not: what they paid, and what
              was sent. The prices were premium. The edits were rushed, because another batch was always
              waiting.
            </p>
            <p>
              So I built the partner I would want to hire. Not someone who hands over files and disappears,
              but someone who sits with you every week and works on the whole thing: the content plan, the
              videos and posts, your personal brand, the website, and the funnel that turns attention into
              booked calls.
            </p>
            <p>
              In practice that means a weekly call where we look at the numbers together, decide what to make
              next, fix what is leaking on the site or in the funnel, and plan the month around what is
              working. The price is on the page. The person you talk to is the person doing the work.
            </p>
            <p>
              There are three of us. I lead strategy, edit, write and build. Shaurya designs. Aiman runs
              delivery. There is no account manager between you and the work.
            </p>
            <p>
              You do not have to take my word for it. Send footage you already have and I will send two
              edited videos back within 48 hours, free. If they are not better than what you post now, you
              have lost nothing.
            </p>
          </div>

          <p className="fl-sign">Lakshya</p>

          <ul className="fl-promises">
            {promises.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>

          <div className="fl-actions">
            <a
              href={FREE_EDITS_URL}
              className="fl-btn fl-btn-primary"
              data-cursor-hover
              onClick={() => trackPilotClick('founder_letter_free_edits')}
            >
              {FREE_EDITS_LABEL}
            </a>
          </div>
        </article>
      </div>

      <style>{`
        .fl-section { background: #F2EEE7; color: #0C0C0B; padding: 112px 24px; font-family: Inter, sans-serif; }
        .fl-wrap { max-width: 820px; margin: 0 auto; }
        .fl-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #B23A0C; margin: 0 0 16px; }
        .fl-h2 { font-size: clamp(30px, 4.2vw, 48px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; margin: 0 0 40px; max-width: 18ch; }
        .fl-accent { color: #E8541A; }

        .fl-card { background: #FBF9F5; border: 1px solid rgba(12,12,11,0.1); border-radius: 24px; padding: 44px 48px 40px; box-shadow: 0 24px 60px rgba(12,12,11,0.06); }
        .fl-head { display: flex; align-items: center; gap: 16px; padding-bottom: 24px; margin-bottom: 28px; border-bottom: 1px solid rgba(12,12,11,0.08); }
        .fl-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; flex: 0 0 64px; }
        .fl-name { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 2px; }
        .fl-role { font-size: 14px; color: #6E6B63; margin: 0; }

        .fl-body p { font-size: 18px; line-height: 1.7; color: #2E2C28; margin: 0 0 18px; max-width: 62ch; }
        .fl-body p:last-child { margin-bottom: 0; }
        .fl-sign { font-size: 26px; font-weight: 800; font-style: italic; letter-spacing: -0.03em; margin: 28px 0 0; }

        .fl-promises { list-style: none; padding: 24px 0 0; margin: 28px 0 0; border-top: 1px solid rgba(12,12,11,0.08); display: flex; flex-wrap: wrap; gap: 8px 28px; }
        .fl-promises li { font-size: 13.5px; font-weight: 600; color: #4A4740; padding-left: 14px; position: relative; }
        .fl-promises li::before { content: ''; position: absolute; left: 0; top: 0.55em; width: 6px; height: 6px; border-radius: 50%; background: #E8541A; }

        .fl-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 18px; margin-top: 28px; }
        .fl-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 26px; border-radius: 100px; font-family: inherit; font-size: 14px; font-weight: 700; text-decoration: none; cursor: pointer; transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
        .fl-btn-primary { background: #0C0C0B; color: #F2EEE7; border: 1px solid #0C0C0B; }
        .fl-btn-primary:hover { background: #E8541A; border-color: #E8541A; color: #0C0C0B; }
        .fl-btn:focus-visible { outline: 2px solid #E8541A; outline-offset: 3px; }

        @media (max-width: 640px) {
          .fl-section { padding: 72px 16px; }
          .fl-h2 { margin-bottom: 28px; }
          .fl-card { padding: 28px 22px 26px; border-radius: 20px; }
          .fl-body p { font-size: 17px; }
          .fl-actions { flex-direction: column; align-items: stretch; }
          .fl-btn { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) { .fl-btn { transition: none; } }
      `}</style>
    </section>
  );
}
