import Link from 'next/link';
import { PRESENCE } from '@/lib/pricing';

/**
 * A short, topic-matched pointer from a blog post to one of the two search
 * landing pages. Those pages are not in the nav or footer on purpose, so these
 * contextual links are how they get internal links (and how a reader who wants
 * the thing done for them finds it). Only posts on the same topic get one.
 *
 * Copy must stay inside lib/pricing.ts and the owner-confirmed facts: approved
 * pieces are scheduled and posted for the client; comments and DMs are not
 * included (which is why the community manager post is not on either list).
 */

const PB = new Set([
  'best-personal-branding-agencies',
  'how-much-does-a-personal-branding-agency-cost',
  'how-to-choose-a-personal-branding-agency',
  'personal-branding-agency-vs-ghostwriter',
  'how-much-does-linkedin-ghostwriting-cost-2026',
  'ai-linkedin-tools-vs-ghostwriter-cost',
  'linkedin-personal-profile-vs-company-page-2026',
  'how-to-build-thought-leadership-system-high-ticket-clients-2026',
  'why-founders-get-brand-positioning-wrong-2026',
  'linkedin-headline-examples-for-founders',
  'linkedin-post-openers-for-founders',
]);

const SMM = new Set([
  'social-media-manager-cost',
  'what-does-a-social-media-manager-do',
  'done-for-you-content-agency-cost',
  'done-for-you-content-agency-explained',
  'content-agency-cost-per-month',
  'best-content-agency-for-startups-2026',
  'posting-content-vs-digital-presence',
  'real-estate-social-media-marketing-cost',
]);

const P = PRESENCE.priceLabel;

export default function BlogOfferNote({ slug }: { slug: string }) {
  const offer = PB.has(slug)
    ? {
        track: 'blog_offer_pb',
        lead: 'Want this done for you?',
        body: `We run personal branding for founders for ${P} a month: a weekly call, 8 to 9 short videos and 8 photo or carousel posts, scheduled and posted for you.`,
        href: '/affordable-personal-branding-for-founders',
        link: `See what ${P} covers and how it compares`,
      }
    : SMM.has(slug)
      ? {
          track: 'blog_offer_smm',
          lead: 'Want your social media handled?',
          body: `8 to 9 short videos and 8 photo or carousel posts a month, scheduled and posted for you, plus your website kept current. ${P} a month, month to month.`,
          href: '/done-for-you-social-media-management',
          link: 'See done-for-you social media management',
        }
      : null;
  if (!offer) return null;

  return (
    <aside className="blog-offer" aria-label="Done for you">
      <p>
        <b>{offer.lead}</b> {offer.body}{' '}
        <Link href={offer.href} data-track-location={offer.track}>{offer.link}</Link>
      </p>
      <style>{`
        .blog-offer { margin: 40px 0 0; padding: 20px 22px; border-radius: 16px; background: #FBEDE5; border: 1px solid rgba(232,84,26,0.25); }
        .blog-offer p { margin: 0; font-size: 15.5px; line-height: 1.6; color: #2C2A26; }
        .blog-offer b { color: #0C0C0B; }
        .blog-offer a { color: #C9440F; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; white-space: normal; }
      `}</style>
    </aside>
  );
}
