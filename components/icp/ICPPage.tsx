import Link from 'next/link';
import Nav, { type NavLink } from '@/components/Nav';
import Footer from '@/components/Footer';
import Pricing from '@/components/Pricing';
import GuidesSection from '@/components/GuidesSection';
import NicheLinks from '@/components/niche/NicheLinks';
import type { Guide } from '@/lib/blogLinks';
import { type IcpData, AGENCY_COMPARISON } from '@/lib/icpData';
import { type VideoEntry } from '@/lib/videos';
import { BOOK_CALL_LABEL_LONG, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';
import { PILOT, PROMISES } from '@/lib/pricing';
import Reveal from './Reveal';
import ICPBookButton from './ICPBookButton';
import ICPFaq from './ICPFaq';
import ICPWork from './ICPWork';
import ICPHeroDevice from './ICPHeroDevice';
import ICPAuthority from './ICPAuthority';
import Prose, { sentences } from './Prose';
import { FUNNEL_CSS, CHECK_PATH, ARROW_PATH } from './funnelStyles';
import { PAGES_UPDATED_LABEL, PAGES_UPDATED_ISO } from '@/lib/siteMeta';

const WEIGHT_LABEL: Record<IcpData['services'][number]['weight'], string> = {
  Core: 'Start here',
  High: 'High impact',
  Medium: 'Add as you scale',
};

// On-page nav for the ICP variant. All same-page anchors. Blog is intentionally
// omitted here (the homepage nav keeps it); these standalone pages have no blog
// section to route to.
const ICP_NAV_LINKS: NavLink[] = [
  { label: 'Work', href: '#work' },
  { label: 'Why now', href: '#why' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];
const ICP_SECTION_IDS = ['work', 'why', 'services', 'pricing', 'faq'];

// Facts only, each one already promised in the risk-reversal cards below and
// in lib/pricing.ts. Sits under the hero ask so the reassurance is in view at
// the moment of deciding, not five sections later.
const HERO_PROOF = ['48-hour turnaround', 'Month to month', 'Founder reviews every piece'];

/**
 * The service grid is three columns. Five services used to leave two cards
 * orphaned on the second row. The lead (Core) card now widens to fill the
 * gap, so every row is full whatever the count.
 */
function serviceSpans(n: number): { cols: 2 | 3; wideFirst: boolean; wideLast: boolean } {
  if (n === 4 || n === 2) return { cols: 2, wideFirst: false, wideLast: false };
  if (n % 3 === 2) return { cols: 3, wideFirst: true, wideLast: false };
  if (n % 3 === 1) return { cols: 3, wideFirst: true, wideLast: true };
  return { cols: 3, wideFirst: false, wideLast: false };
}

function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function ICPPage({ data, videos, guides = [] }: { data: IcpData; videos: VideoEntry[]; guides?: Guide[] }) {
  const accent = data.accentColor;
  // One statistics block per page. Where the education section carries its own
  // sourced figures, those are the ones shown and this band is skipped.
  const hasAuthorityStats = (data.authority.stats?.length ?? 0) > 0;
  const stats = hasAuthorityStats ? [] : data.stats.slice(0, 4);
  // Describes the animated pipeline for screen readers and crawlers.
  const deviceAlt = `How EchoPulse works for ${data.name.toLowerCase()}: ${data.pipeline.input.label.toLowerCase()}, and EchoPulse produces ${data.pipeline.outputs
    .map((o) => o.label.toLowerCase())
    .join(', ')}, driving ${data.pipeline.outcomes.join(', then ').toLowerCase()}.`;
  const svc = serviceSpans(data.services.length);
  // A hero sub of more than three sentences keeps its first two in the hero;
  // the rest, word for word, joins the services intro where it describes
  // what the plans include.
  const subParts = sentences(data.heroSub);
  const heroSub = subParts.length > 3 ? subParts.slice(0, 2).join(' ') : data.heroSub;
  const subRest = subParts.length > 3 ? subParts.slice(2).join(' ') : '';

  // Risk reversal. Prices and terms come from lib/pricing.ts.
  const risk = [
    { t: '2 free edits first', d: 'Send footage you already have and get 2 edited videos back within 48 hours. No card, no call. You keep them either way.', link: true },
    { t: `${PILOT.priceLabel} Pilot, 14 days`, d: 'Real deliverables on your brand before any monthly plan. You keep everything we make, whether you continue or not.' },
    { t: 'No contracts', d: 'Month to month after the Pilot, cancel with 14 days written notice. We have to earn the next month, every month.' },
    { t: 'Redone until right', d: 'If a deliverable does not sound like you, we redo it at no charge until you would post it under your own name.' },
    { t: '48-hour turnaround', d: 'Standard on short-form edits, with senior review before anything reaches you. Owner-operated, 3-hour replies in every workday.' },
    // Naming the three people who touch the work is verifiable and already
    // true, which is the strongest proof a studio without testimonials has.
    { t: 'You know who does the work', d: 'Lakshya Soni runs the studio and signs off on every deliverable before it ships. Shaurya leads design, Aiman leads delivery. Three named people, not a rotating account team you have to re-brief.' },
  ];

  return (
    <>
      <Nav links={ICP_NAV_LINKS} sectionIds={ICP_SECTION_IDS} observeCurrentPage />

      {/* id="main": target of the layout's skip-to-content link. */}
      <main id="main" className="fn icp" style={{ ['--fn-accent' as string]: accent }}>
        {/* ── 1. HERO (ink): one headline, one sub, one ask, the visual ── */}
        <section className="icp-hero fn-ink" data-dark-bg="true">
          <div aria-hidden="true" className="icp-hero-wash" style={{ background: `radial-gradient(ellipse 60% 55% at 78% 30%, ${accent}14 0%, ${accent}00 70%)` }} />
          <div className="fn-container icp-hero-grid">
            <div className="icp-hero-copy">
              {/* The audience phrase a buyer actually types, above an H1 that is
                  pure benefit copy. */}
              {data.eyebrow && (
                <p className="fn-eyebrow icp-hero-eyebrow" style={{ color: accent }}>
                  {data.eyebrow}
                </p>
              )}
              <h1 className="fn-h1 icp-h1">
                {data.heroHeadline}
                {data.heroHeadlineAccent && (
                  <> <span style={{ color: accent }}>{data.heroHeadlineAccent}</span></>
                )}
              </h1>
              <p className="fn-lead icp-hero-sub">{heroSub}</p>
              <div className="fn-actions icp-hero-actions">
                <ICPBookButton label={BOOK_CALL_LABEL_LONG} location="icp_hero" accent={accent} className="fn-btn" />
              </div>
              <p className="fn-alt-ask">
                Not ready for a call? <Link href={FREE_EDITS_URL}>{FREE_EDITS_LABEL}</Link> first, no card needed.
              </p>
              <ul className="fn-proof" aria-label="What every plan includes">
                {HERO_PROOF.map((p) => (
                  <li key={p}><Icon d={CHECK_PATH} />{p}</li>
                ))}
              </ul>
            </div>
            <div className="icp-hero-visual">
              <ICPHeroDevice accent={accent} alt={deviceAlt} pipeline={data.pipeline} />
            </div>
          </div>
        </section>

        {/* ── 2. WORK (ink), directly under the hero ── */}
        <section id="work" className="fn-ink icp-work" data-dark-bg="true">
          <div className="fn-container icp-work-head">
            <Reveal>
              <p className="fn-eyebrow">Work in this space</p>
              <h2 className="fn-h2">
                Edits we cut for <span style={{ color: accent }}>{data.name.toLowerCase()}</span>.
              </h2>
            </Reveal>
          </div>
          {videos.length > 0 ? (
            <ICPWork videos={videos} accent={accent} />
          ) : (
            <div className="fn-container">
              {/* Telling someone proof exists but they must book a call to see
                  it asks for commitment before giving evidence. Name the gap
                  and hand over the one real, permissioned case study. */}
              <div className="icp-work-placeholder">
                We have not published work for this segment yet, and we are not going to
                dress up someone else&apos;s as if we had.{' '}
                <Link href="/case-studies/magicbnb-seo-aeo" style={{ color: accent, fontWeight: 700 }}>
                  Read the MagicBNB case study
                </Link>
                , with a real Search Console export published with the client&apos;s permission,
                and the open problems still on the account listed at the bottom of it. It is a
                different industry, and you can judge the work on its own terms.
              </div>
            </div>
          )}
          {data.resource && (
            <div className="fn-container">
              <p className="icp-work-resource">
                {data.resource.text}{' '}
                <Link href={data.resource.href} style={{ color: accent }}>{data.resource.linkLabel}</Link>
              </p>
            </div>
          )}
        </section>

        {/* ── 3. WHY NOW (cream): heading left, short paragraphs right ── */}
        <section id="why" className="fn-section fn-cream">
          <div className="fn-container fn-split">
            <Reveal className="fn-split-sticky">
              <p className="fn-eyebrow" style={{ color: accent }}>Why this matters in 2026</p>
              <h2 className="fn-h2">
                {data.whyNow.headline}{' '}
                <span style={{ color: accent }}>{data.whyNow.headlineAccent}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <Prose paragraphs={data.whyNow.body} />
            </Reveal>
          </div>
        </section>

        {/* ── 4. MARKET FIGURES (ink), only where the education section has
             no sourced figures of its own ── */}
        {stats.length > 0 && (
          <section className="fn-section fn-ink" data-dark-bg="true">
            <div className="fn-container">
              <Reveal className="fn-head">
                <p className="fn-eyebrow">The market reality</p>
                <h2 className="fn-h2">
                  The numbers are already <span style={{ color: accent }}>on your side.</span>
                </h2>
              </Reveal>
              <Reveal>
                <div className={`icp-stat-grid icp-stat-grid-${stats.length}`}>
                  {stats.map((s) => (
                    <div key={s.label} className="icp-stat-block">
                      <div className="icp-stat-num" style={{ color: accent }}>{s.value}</div>
                      <div className="icp-stat-meaning">{s.label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <p className="fn-small icp-stat-note">
                These are industry figures showing the opportunity in your market. They are not results EchoPulse Media is claiming for a specific client.
              </p>
            </div>
          </section>
        )}

        {/* ── 5. EDUCATION (paper): reframe, sourced evidence, both sides,
             handed conclusion. The founder background closes it where one
             exists. ── */}
        <ICPAuthority
          data={data.authority}
          accent={accent}
          footer={
            data.founderStory ? (
              <div className="icp-founder">
                <div>
                  <p className="fn-eyebrow" style={{ color: accent }}>Who edits your work</p>
                  <h3 className="fn-h3 icp-founder-h">{data.founderStory.heading}</h3>
                </div>
                <div>
                  <p className="fn-body icp-founder-p">{data.founderStory.body}</p>
                  <Link href={data.founderStory.href} className="fn-textlink">
                    {data.founderStory.linkLabel}
                  </Link>
                </div>
              </div>
            ) : null
          }
        />

        {/* ── 6. SERVICES (cream), in priority order ── */}
        <section id="services" className="fn-section fn-cream">
          <div className="fn-container">
            <Reveal className="fn-head">
              <p className="fn-eyebrow" style={{ color: accent }}>What we run for you</p>
              <h2 className="fn-h2">One team. <span style={{ color: accent }}>Every channel you need.</span></h2>
              <p className="fn-lead">{subRest ? `${subRest} ` : ''}{data.starterStack}</p>
            </Reveal>
            <div className={`fn-grid fn-grid-${svc.cols}`}>
              {data.services.map((s, i) => {
                const core = s.weight === 'Core';
                const wide = (svc.wideFirst && i === 0) || (svc.wideLast && i === data.services.length - 1);
                return (
                  <Reveal key={s.slug} delay={Math.min(i * 0.05, 0.25)} className={wide ? 'fn-span-2' : undefined}>
                    <a
                      href={`/services/${s.slug}`}
                      className="fn-card icp-svc-card"
                      style={core ? { borderColor: `${accent}55`, background: `${accent}0a` } : undefined}
                    >
                      <span className="icp-svc-weight" style={{ color: core ? accent : '#6E6B63', borderColor: core ? `${accent}55` : 'rgba(12,12,11,0.14)' }}>
                        {WEIGHT_LABEL[s.weight]}
                      </span>
                      <h3 className="fn-h3">{s.name}</h3>
                      <p>{s.why}</p>
                      <span className="icp-svc-link">
                        How it works
                        <Icon d={ARROW_PATH} size={14} />
                      </span>
                    </a>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 7. WHAT YOU GET (ink), closed by the mid-page ask ── */}
        <section className="fn-section fn-ink" data-dark-bg="true">
          <div className="fn-container">
            <Reveal className="fn-head">
              <p className="fn-eyebrow">What paying us actually buys</p>
              <h2 className="fn-h2">What each piece of work <span style={{ color: accent }}>is there to do.</span></h2>
            </Reveal>
            <ol className="fn-rows">
              {data.deliverables.map((d, i) => (
                <Reveal as="li" key={d.title} delay={Math.min(i * 0.04, 0.2)}>
                  <span className="fn-num" style={{ color: accent }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="fn-h3" style={{ color: '#F2EEE7' }}>{d.title}</h3>
                  <p>{d.desc}</p>
                </Reveal>
              ))}
            </ol>
            <Reveal>
              <div className="icp-mid-ask">
                <p className="icp-mid-ask-text">
                  <strong>Want this running for you?</strong> 15 minutes with the founder, who tells you the first three things he would fix.
                </p>
                <ICPBookButton label={BOOK_CALL_LABEL_LONG} location="icp_mid" accent={accent} className="fn-btn" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 8. COMPARISON (cream) ── */}
        <section className="fn-section fn-cream">
          <div className="fn-container">
            <Reveal className="fn-head">
              <p className="fn-eyebrow" style={{ color: accent }}>EchoPulse Media vs a generic agency</p>
              <h2 className="fn-h2">The honest difference, <span style={{ color: accent }}>line by line.</span></h2>
            </Reveal>
            <Reveal>
              <div className="fn-cmp" role="table" aria-label="EchoPulse Media compared with a generic agency">
                <div className="fn-cmp-row fn-cmp-head" role="row">
                  <div role="columnheader">What matters</div>
                  <div role="columnheader" style={{ color: accent }}>EchoPulse Media</div>
                  <div role="columnheader">Generic agency</div>
                </div>
                {AGENCY_COMPARISON.map((row) => (
                  <div key={row.feature} className="fn-cmp-row" role="row">
                    <div className="fn-cmp-feature" role="rowheader">{row.feature}</div>
                    <div role="cell">
                      <span className="fn-cmp-mark" style={{ color: accent }} aria-hidden="true">✓</span>
                      <span><span className="icp-sr">EchoPulse Media: </span>{row.us}</span>
                    </div>
                    <div className="fn-cmp-them" role="cell">
                      <span className="fn-cmp-mark" style={{ color: '#B3412E' }} aria-hidden="true">✕</span>
                      <span><span className="icp-sr">Generic agency: </span>{row.them}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 9. RISK REVERSAL (paper): six cards, two full rows of three ── */}
        <section className="fn-section fn-paper">
          <div className="fn-container">
            <Reveal className="fn-head">
              <p className="fn-eyebrow" style={{ color: accent }}>Why trying us is safe</p>
              <h2 className="fn-h2">Built so the risk sits <span style={{ color: accent }}>on our side.</span></h2>
            </Reveal>
            <div className="fn-grid fn-grid-3">
              {risk.map((item, i) => (
                <Reveal key={item.t} delay={Math.min(i * 0.05, 0.2)}>
                  <div className="fn-card">
                    <span className="fn-num" style={{ color: accent }}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="fn-h3">{item.t}</h3>
                    <p>{item.d}</p>
                    {item.link && (
                      <Link href={FREE_EDITS_URL} className="fn-textlink icp-risk-link">
                        {FREE_EDITS_LABEL}
                      </Link>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. PRICING: the shared pricing component, segment copy ── */}
        <section id="pricing" className="icp-pricing-wrap">
          <Pricing pricingCopy={data.pricingCopy} />
        </section>

        {/* ── 11. GUIDES (ink) ── */}
        <GuidesSection
          dark
          heading={`Guides for ${data.name.toLowerCase()}`}
          intro="Pricing guides, comparisons and how-tos we wrote for this audience. Read them first; the call is shorter when you have."
          guides={guides}
        />

        {/* ── 12. FAQ (cream): heading left, answers right ── */}
        <section id="faq" className="fn-section fn-cream">
          <div className="fn-container fn-split">
            <Reveal className="fn-split-sticky">
              <p className="fn-eyebrow" style={{ color: accent }}>Questions, answered</p>
              <h2 className="fn-h2">The things buyers ask <span style={{ color: accent }}>before signing.</span></h2>
            </Reveal>
            <ICPFaq faq={data.faq} accent={accent} />
          </div>
        </section>

        {/* ── 13. BY SERVICE ── */}
        <NicheLinks mode="icp" value={data.key} />

        {/* ── 14. FINAL ASK (ink) ── */}
        <section className="fn-section fn-ink icp-final" data-dark-bg="true">
          <div aria-hidden="true" className="icp-hero-wash" style={{ background: `radial-gradient(ellipse 55% 60% at 50% 45%, ${accent}12 0%, ${accent}00 70%)` }} />
          <div className="fn-container fn-final">
            <Reveal>
              <h2 className="fn-h2">Ready to stop doing it all yourself?</h2>
              <p className="fn-lead">
                15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch.
              </p>
              <div className="fn-actions">
                <ICPBookButton label={BOOK_CALL_LABEL_LONG} location="icp_final" accent={accent} className="fn-btn" />
              </div>
              <p className="fn-alt-ask">
                Start with <Link href={FREE_EDITS_URL}>2 free edited videos</Link>, then a {PILOT.priceLabel} 14-day Pilot. {PROMISES.noContract}
              </p>
              <p className="fn-byline">
                Written and reviewed by <Link href="/about/lakshya-soni">Lakshya Soni</Link>, founder. Last updated{' '}
                <time dateTime={PAGES_UPDATED_ISO}>{PAGES_UPDATED_LABEL}</time>.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />

      <style>{FUNNEL_CSS}</style>
      <style>{`
        .icp-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

        /* Hero */
        .icp-hero { position: relative; overflow: hidden; padding: 152px 0 64px; }
        .icp-hero-wash { position: absolute; inset: 0; pointer-events: none; }
        .icp-hero-grid { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 64px; align-items: center; }
        .icp-h1 { max-width: 15ch; }
        .icp-hero-sub { margin-bottom: 40px; max-width: 34em; }
        .icp-hero-visual { width: 100%; max-width: 400px; justify-self: end; }

        /* Work strip, continuing the hero's dark field */
        .icp-work { padding: 64px 0 96px; scroll-margin-top: 96px; }
        .icp-work-head { margin-bottom: 40px; }
        .icp-work .icp-rail { padding-left: max(56px, calc((100vw - 1088px) / 2)) !important; padding-right: max(56px, calc((100vw - 1088px) / 2)) !important; }
        .icp-work-resource { margin: 16px 0 0; text-align: center; font-size: 15px; line-height: 1.6; color: rgba(242,238,231,0.66); }
        .icp-work-resource a { font-weight: 700; text-decoration: underline; text-underline-offset: 4px; display: inline-flex; min-height: 44px; align-items: center; }
        .icp-work-placeholder { border: 1px dashed rgba(242,238,231,0.25); border-radius: 16px; padding: 48px 32px; text-align: center; color: rgba(242,238,231,0.66); font-size: 16px; line-height: 1.65; max-width: 720px; margin: 0 auto; }

        /* Stats */
        .icp-stat-grid { display: grid; gap: 1px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; overflow: hidden; }
        .icp-stat-grid-4 { grid-template-columns: repeat(4, 1fr); }
        .icp-stat-grid-3 { grid-template-columns: repeat(3, 1fr); }
        .icp-stat-grid-2 { grid-template-columns: repeat(2, 1fr); }
        .icp-stat-block { background: #0C0C0B; padding: 40px 32px; height: 100%; }
        .icp-stat-num { font-size: clamp(40px, 4.4vw, 56px); font-weight: 900; letter-spacing: -0.04em; line-height: 1; margin-bottom: 16px; }
        .icp-stat-meaning { font-size: 15px; line-height: 1.55; color: rgba(242,238,231,0.66); }
        .icp-stat-note { margin: 24px 0 0; font-style: italic; max-width: 720px; }

        /* Founder background, closing the education section */
        .icp-founder { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 24px 80px; margin-top: 80px; padding-top: 48px; border-top: 1px solid rgba(12,12,11,0.12); }
        .icp-founder-h { font-size: 24px; margin: 0; max-width: 20ch; }
        .icp-founder-p { margin: 0 0 8px; }

        /* Services */
        .icp-svc-card { min-height: 240px; }
        .icp-svc-weight { align-self: flex-start; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; border: 1px solid; margin-bottom: 24px; white-space: nowrap; }
        .icp-svc-card p { flex: 1; margin-bottom: 24px; }
        .icp-svc-link { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #0C0C0B; }

        /* Mid-page ask */
        .icp-mid-ask { margin-top: 56px; padding: 32px 40px; border-radius: 16px; border: 1px solid rgba(242,238,231,0.14); background: rgba(255,255,255,0.035); display: flex; align-items: center; justify-content: space-between; gap: 24px 40px; flex-wrap: wrap; }
        .icp-mid-ask-text { margin: 0; font-size: 17px; line-height: 1.55; color: rgba(242,238,231,0.72); max-width: 52ch; }
        .icp-mid-ask-text strong { color: #F2EEE7; display: block; font-size: 20px; margin-bottom: 4px; letter-spacing: -0.01em; }

        .icp-risk-link { margin-top: 16px; }
        .icp-pricing-wrap { scroll-margin-top: 96px; background: #F2EEE7; }
        .icp-final { overflow: hidden; }
        .icp-final .fn-container { position: relative; z-index: 1; }

        /* The site swaps the system cursor for a custom dot only on a fine
           pointer; touch keeps its affordance. */
        @media (hover: hover) and (pointer: fine) {
          .icp-book-btn, .icp-faq-card, .icp-svc-card { cursor: none; }
        }

        @media (max-width: 1024px) {
          .icp-hero { padding: 136px 0 56px; }
          .icp-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 48px; }
          .icp-hero-visual { justify-self: start; max-width: 380px; }
          .icp-stat-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .icp-founder { grid-template-columns: minmax(0, 1fr); }
          .icp-work .icp-rail { padding-left: 40px !important; padding-right: 40px !important; }
        }
        @media (max-width: 768px) {
          /* globals.css forces section padding on phones; the hero states its
             own so the eyebrow clears the fixed nav pill. */
          .icp-hero { padding: 112px 0 48px !important; }
          .icp-work { padding: 48px 0 72px !important; }
          .icp-h1 { font-size: 36px; letter-spacing: -0.03em !important; line-height: 1.04 !important; }
          .icp-hero-sub { margin-bottom: 32px; }
          .icp-hero-visual { justify-self: center; max-width: 340px; }
          .fn-proof { margin-top: 24px; flex-direction: column; gap: 8px; }
          .icp-work .icp-rail { padding-left: 24px !important; padding-right: 24px !important; }
          .icp-work-head { margin-bottom: 32px; }
          .icp-stat-grid-2, .icp-stat-grid-3, .icp-stat-grid-4 { grid-template-columns: 1fr 1fr; }
          .icp-stat-grid > *:last-child:nth-child(odd) { grid-column: 1 / -1; }
          .icp-stat-block { padding: 24px 16px; }
          .icp-stat-meaning { font-size: 15px; }
          .icp-founder { margin-top: 56px; padding-top: 40px; }
          .icp-svc-card { min-height: 0; }
          .icp-mid-ask { padding: 24px; margin-top: 40px; }
          .icp-mid-ask .fn-btn { width: 100%; }
        }
        @media (max-width: 374px) {
          .icp-h1 { font-size: 32px; }
          .icp-work .icp-rail { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </>
  );
}
