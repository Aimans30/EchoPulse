import { Home, Rocket, GraduationCap, ShoppingBag, Briefcase, type LucideIcon } from 'lucide-react';
import Nav, { type NavLink } from '@/components/Nav';
import Footer from '@/components/Footer';
import Pricing from '@/components/Pricing';
import { type IcpData, AGENCY_COMPARISON } from '@/lib/icpData';
import { type VideoEntry } from '@/lib/videos';
import { BOOK_CALL_LABEL_LONG } from '@/lib/links';
import Reveal from './Reveal';
import ICPBookButton from './ICPBookButton';
import ICPFaq from './ICPFaq';
import ICPWork from './ICPWork';
import ICPHeroDevice from './ICPHeroDevice';
import ICPAuthority from './ICPAuthority';

const ICON_MAP: Record<IcpData['icon'], LucideIcon> = {
  home: Home,
  rocket: Rocket,
  graduation: GraduationCap,
  shopping: ShoppingBag,
  briefcase: Briefcase,
};

const WEIGHT_LABEL: Record<IcpData['services'][number]['weight'], string> = {
  Core: 'Start here',
  High: 'High impact',
  Medium: 'Add as you scale',
};

// On-page nav for the ICP variant. All same-page anchors. Blog is intentionally
// omitted here (the homepage nav keeps it); these standalone pages have no blog
// section to route to.
const ICP_NAV_LINKS: NavLink[] = [
  { label: 'Why now', href: '#why' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];
const ICP_SECTION_IDS = ['why', 'services', 'work', 'pricing', 'faq'];

// Eyebrow badge: icon tile + uppercase label, matching the service-page voice.
function Eyebrow({ label, accent, Icon, onDark = false }: { label: string; accent: string; Icon: LucideIcon; onDark?: boolean }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: onDark ? 'rgba(242,238,231,0.6)' : '#6E6B63' }}>
      <span style={{ width: 30, height: 30, borderRadius: 9, background: `${accent}${onDark ? '22' : '14'}`, border: `1px solid ${accent}${onDark ? '44' : '33'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={15} strokeWidth={1.7} color={accent} aria-hidden="true" />
      </span>
      {label}
    </div>
  );
}

export default function ICPPage({ data, videos }: { data: IcpData; videos: VideoEntry[] }) {
  const accent = data.accentColor;
  const Icon = ICON_MAP[data.icon];
  const stats = data.stats.slice(0, 4);
  // Describes the animated pipeline for screen readers and crawlers: what the
  // client supplies, what EchoPulse produces, and how it compounds.
  const deviceAlt = `How EchoPulse works for ${data.name.toLowerCase()}: ${data.pipeline.input.label.toLowerCase()}, and EchoPulse produces ${data.pipeline.outputs
    .map((o) => o.label.toLowerCase())
    .join(', ')} — driving ${data.pipeline.outcomes.join(', then ').toLowerCase()}.`;

  return (
    <>
      <Nav links={ICP_NAV_LINKS} sectionIds={ICP_SECTION_IDS} observeCurrentPage />

      <main style={{ background: '#F2EEE7', color: '#0C0C0B' }}>
        {/* ── 1. HERO (dark) — the page's single <h1> ── */}
        <section className="icp-hero" data-dark-bg="true">
          {/* Fades through the accent's OWN alpha (…22 → …00), not the CSS
              `transparent` keyword. `transparent` resolves to transparent-black,
              so a warm accent fading to it crosses grey and bands visibly on
              dark backgrounds. Extra mid-stop keeps the falloff smooth. */}
          <div aria-hidden="true" className="icp-hero-glow" style={{ background: `radial-gradient(ellipse 70% 60% at 75% 25%, ${accent}22 0%, ${accent}0d 38%, ${accent}00 68%)` }} />
          <div className="icp-container icp-hero-grid">
            <div>
              <h1 className="icp-h1">
                {data.heroHeadline}
                {data.heroHeadlineAccent && (
                  <> <span style={{ color: accent }}>{data.heroHeadlineAccent}</span></>
                )}
              </h1>
              <p className="icp-hero-sub">{data.heroSub}</p>
              <div className="icp-hero-actions">
                <ICPBookButton label={BOOK_CALL_LABEL_LONG} location="icp_hero" accent={accent} size="lg" fullWidthMobile />
                <a href="#services" className="icp-hero-secondary">See how it works</a>
              </div>
            </div>
            <div className="icp-hero-visual">
              <ICPHeroDevice accent={accent} alt={deviceAlt} pipeline={data.pipeline} />
            </div>
          </div>
        </section>

        {/* ── 2. WHY NOW (light) ── */}
        <section id="why" className="icp-section icp-section-light">
          <div className="icp-container icp-narrow">
            <Reveal>
              <Eyebrow label="Why this matters in 2026" accent={accent} Icon={Icon} />
              <h2 className="icp-h2">
                {data.whyNow.headline}{' '}
                <span style={{ color: accent }}>{data.whyNow.headlineAccent}</span>
              </h2>
            </Reveal>
            <div className="icp-why-body">
              {data.whyNow.body.map((para, i) => (
                <Reveal key={i} as="span" delay={0.05 * i}>
                  <p className="icp-why-p">{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. THE MARKET REALITY (dark) — big stat blocks ── */}
        <section className="icp-section icp-section-dark" data-dark-bg="true">
          <div className="icp-container">
            <Reveal>
              <div className="icp-eyebrow-line" style={{ color: 'rgba(242,238,231,0.55)' }}>
                <span style={{ width: 22, height: 1, background: accent, display: 'block' }} />
                The market reality
              </div>
              <h2 className="icp-h2" style={{ color: '#F2EEE7', maxWidth: 900 }}>
                The numbers are already <span style={{ color: accent }}>on your side.</span>
              </h2>
            </Reveal>
            <div className={`icp-stat-grid icp-stat-grid-${stats.length}`}>
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={0.06 * i}>
                  <div className="icp-stat-block">
                    <div className="icp-stat-num" style={{ color: accent }}>{s.value}</div>
                    <div className="icp-stat-meaning">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="icp-stat-note">
              These are industry figures showing the opportunity in your market. They are not results EchoPulse Media is claiming for a specific client.
            </p>
          </div>
        </section>

        {/* ── 3b. THE EDUCATION (light) — why this matters to THEM, with the
             psychology sequence: reframe → sourced evidence → both-sides
             completeness → handed conclusion. Sits before the services so the
             reader wants the thing before we show them the thing. ── */}
        <ICPAuthority data={data.authority} accent={accent} />

        {/* ── 4. THE SOLUTION (light) — services in priority order ── */}
        <section id="services" className="icp-section icp-section-light" style={{ paddingTop: 0 }}>
          <div className="icp-container">
            <Reveal>
              <Eyebrow label="What we run for you" accent={accent} Icon={Icon} />
              <h2 className="icp-h2">One team. <span style={{ color: accent }}>Every channel you need.</span></h2>
              <p className="icp-lead">{data.starterStack}</p>
            </Reveal>
            <div className="icp-svc-grid">
              {data.services.map((svc, i) => {
                const core = svc.weight === 'Core';
                return (
                  <Reveal key={svc.slug} delay={Math.min(i * 0.05, 0.3)}>
                    <a
                      href={`/services/${svc.slug}`}
                      className={`icp-svc-card${core ? ' icp-svc-core' : ''}`}
                      style={core ? { borderColor: `${accent}40`, background: `${accent}08` } : undefined}
                    >
                      <div className="icp-svc-head">
                        <h3 className="icp-svc-name">{svc.name}</h3>
                        <span className="icp-svc-weight" style={{ color: core ? accent : '#9a958c', borderColor: core ? `${accent}40` : 'rgba(12,12,11,0.12)' }}>
                          {WEIGHT_LABEL[svc.weight]}
                        </span>
                      </div>
                      <p className="icp-svc-why">{svc.why}</p>
                      {/* No "See the service →" push. These pages exist to book
                          the call, not to fan traffic out to service pages —
                          the card itself still links for whoever wants depth,
                          but the visible affordance is informational. */}
                      <span className="icp-svc-link" style={{ color: '#9a958c' }}>
                        Included in your plan
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                      </span>
                    </a>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. WHAT YOU GET (dark) — deliverables ── */}
        <section className="icp-section icp-section-dark" data-dark-bg="true">
          <div className="icp-container">
            <Reveal>
              <div className="icp-eyebrow-line" style={{ color: 'rgba(242,238,231,0.55)' }}>
                <span style={{ width: 22, height: 1, background: accent, display: 'block' }} />
                What paying us actually buys
              </div>
              <h2 className="icp-h2" style={{ color: '#F2EEE7' }}>Not deliverables. <span style={{ color: accent }}>Outcomes with receipts.</span></h2>
            </Reveal>
            <div className="icp-deliv-list">
              {data.deliverables.map((d, i) => (
                <Reveal key={d.title} delay={Math.min(i * 0.05, 0.3)}>
                  <div className="icp-deliv-row">
                    <div className="icp-deliv-num" style={{ color: accent }}>{`0${i + 1}`}</div>
                    <h3 className="icp-deliv-title">{d.title}</h3>
                    <p className="icp-deliv-desc">{d.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. COMPARISON (light) — EchoPulse vs generic agency ── */}
        <section className="icp-section icp-section-light">
          <div className="icp-container">
            <Reveal>
              <Eyebrow label="EchoPulse Media vs a generic agency" accent={accent} Icon={Icon} />
              <h2 className="icp-h2">The honest difference, <span style={{ color: accent }}>line by line.</span></h2>
            </Reveal>
            <Reveal>
              <div className="icp-cmp">
                <div className="icp-cmp-row icp-cmp-head">
                  <div className="icp-cmp-feature">What matters</div>
                  <div className="icp-cmp-us" style={{ color: accent }}>
                    <span className="icp-cmp-dot" style={{ background: accent }} /> EchoPulse Media
                  </div>
                  <div className="icp-cmp-them">Generic agency</div>
                </div>
                {AGENCY_COMPARISON.map((row) => (
                  <div key={row.feature} className="icp-cmp-row">
                    <div className="icp-cmp-feature">{row.feature}</div>
                    <div className="icp-cmp-us">
                      <span className="icp-cmp-check" style={{ color: accent }} aria-hidden="true">✓</span>
                      {row.us}
                    </div>
                    <div className="icp-cmp-them">
                      <span className="icp-cmp-x" aria-hidden="true">✕</span>
                      {row.them}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 7. WORK (dark) — real tagged clips, or a labeled placeholder ── */}
        <section id="work" className="icp-section icp-section-dark icp-work-section" data-dark-bg="true">
          <div className="icp-container">
            <Reveal>
              <div className="icp-eyebrow-line" style={{ color: 'rgba(242,238,231,0.55)' }}>
                <span style={{ width: 22, height: 1, background: accent, display: 'block' }} />
                Work in this space
              </div>
              <h2 className="icp-h2" style={{ color: '#F2EEE7' }}>
                Edits we cut for <span style={{ color: accent }}>{data.name.toLowerCase()}</span>.
              </h2>
            </Reveal>
          </div>
          {videos.length > 0 ? (
            <ICPWork videos={videos} accent={accent} />
          ) : (
            <div className="icp-container">
              <div className="icp-work-placeholder">
                Sample work for this segment is being produced. Book a call and we will walk you through the closest examples from our portfolio.
              </div>
            </div>
          )}
        </section>

        {/* ── 7b. RISK REVERSAL (light) — the strongest close available without
             published client metrics. Loss-aversion runs the decision at this
             point in the page, so every line removes a specific downside:
             money (small pilot, keep the work), lock-in (month to month),
             quality (redo until right), attention (owner-operated, 48h). ── */}
        <section className="icp-section icp-section-light" style={{ paddingTop: 0 }}>
          <div className="icp-container">
            <Reveal>
              <Eyebrow label="Why trying us is safe" accent={accent} Icon={Icon} />
              <h2 className="icp-h2">Built so the risk sits <span style={{ color: accent }}>on our side.</span></h2>
            </Reveal>
            <div className="icp-risk-grid">
              {[
                { t: '$299 Pilot, 14 days', d: 'Real deliverables on your brand before any retainer. You keep everything we make, whether you continue or not.' },
                { t: 'No contracts', d: 'Month to month after the Pilot, cancel with 30 days notice. We have to earn the next month, every month.' },
                { t: 'Redone until right', d: 'If a deliverable does not sound like you, we redo it at no charge until you would post it under your own name.' },
                { t: '48-hour turnaround', d: 'Standard on every deliverable, with senior review before anything reaches you. Owner-operated, 3-hour replies in every workday.' },
              ].map((item, i) => (
                <Reveal key={item.t} delay={Math.min(i * 0.05, 0.2)}>
                  <div className="icp-risk-card">
                    <span className="icp-risk-num" style={{ color: accent }}>{`0${i + 1}`}</span>
                    <h3 className="icp-risk-title">{item.t}</h3>
                    <p className="icp-risk-desc">{item.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. PRICING (light) — reuse the homepage Pricing component, with
             this segment's tailored feature copy. Falls back to default copy
             when the segment supplies no pricingCopy (e.g. dtc, business-owners). ── */}
        <section id="pricing" className="icp-pricing-wrap">
          <Pricing pricingCopy={data.pricingCopy} />
        </section>

        {/* ── 9. FAQ (light) ── */}
        <section id="faq" className="icp-section icp-section-light">
          <div className="icp-container">
            <Reveal>
              <Eyebrow label="Questions, answered" accent={accent} Icon={Icon} />
              <h2 className="icp-h2" style={{ marginBottom: 36 }}>The things buyers ask <span style={{ color: accent }}>before signing.</span></h2>
            </Reveal>
            <ICPFaq faq={data.faq} accent={accent} />
          </div>
        </section>

        {/* ── 10. FINAL CTA (dark) ── */}
        <section
          className="icp-section icp-section-dark"
          data-dark-bg="true"
          style={{ paddingBottom: 120, position: 'relative', overflow: 'hidden' }}
        >
          {/* The glow lives on the SECTION, not inside the CTA card. Inside the
              card it was clipped by the card's bounds/radius, which drew a
              visible rectangle against the identical dark section behind it.
              At section level it spans the full viewport width and fades into
              the section's own background with no edge to clip against. */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse 60% 55% at 50% 55%, ${accent}1e 0%, ${accent}0a 50%, ${accent}00 100%)`,
              pointerEvents: 'none',
            }}
          />
          <div className="icp-container" style={{ position: 'relative', zIndex: 1 }}>
            <Reveal>
              <div className="icp-final" style={{ background: 'transparent' }}>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <h2 className="icp-final-h">Ready to stop doing it all yourself?</h2>
                  <p className="icp-final-p">
                    Book a free 45-minute call. We will review what you are publishing today, map a 30-day plan, and put the numbers in writing.
                  </p>
                  <div style={{ marginTop: 12 }}>
                    <ICPBookButton label={BOOK_CALL_LABEL_LONG} location="icp_final" accent={accent} size="lg" />
                  </div>
                  <span className="icp-final-note">Starts with a $299 14-day Pilot. See the work before you commit.</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        /* Layout */
        .icp-container { max-width: 1180px; margin: 0 auto; padding: 0 56px; }
        .icp-narrow { max-width: 860px; }
        .icp-section { padding: 104px 0; scroll-margin-top: 96px; }
        .icp-section-light { background: #F2EEE7; color: #0C0C0B; }
        .icp-section-dark { background: #0C0C0B; color: #F2EEE7; }

        /* Shared headings */
        .icp-h2 { font-family: Inter, sans-serif; font-weight: 900; font-size: clamp(32px, 4.4vw, 60px); letter-spacing: -2px; line-height: 1.0; margin: 0; }
        .icp-lead { font-size: 15px; line-height: 1.65; color: #6E6B63; max-width: 640px; margin: 18px 0 0; }
        .icp-eyebrow-line { display: inline-flex; align-items: center; gap: 14px; font-size: 10px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 18px; }

        /* Hero */
        .icp-hero { position: relative; overflow: hidden; background: #0C0C0B; color: #F2EEE7; padding: 132px 0 96px; scroll-margin-top: 96px; }
        .icp-hero-glow { position: absolute; inset: 0; pointer-events: none; }
        .icp-hero-grid { position: relative; z-index: 1; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 56px; align-items: center; }
        .icp-h1 { font-family: Inter, sans-serif; font-weight: 900; font-size: clamp(38px, 5.6vw, 76px); letter-spacing: -3px; line-height: 0.98; margin: 0 0 24px; }
        .icp-hero-sub { font-size: clamp(16px, 1.6vw, 20px); line-height: 1.6; color: rgba(242,238,231,0.66); max-width: 560px; margin: 0 0 32px; }
        .icp-hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .icp-hero-secondary { color: #F2EEE7; text-decoration: none; font-size: 13px; font-weight: 700; padding: 15px 26px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.18); font-family: Inter, sans-serif; transition: border-color 0.2s, background 0.2s; }
        .icp-hero-secondary:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); }

        /* Why now */
        .icp-why-body { margin-top: 32px; display: flex; flex-direction: column; gap: 4px; }
        .icp-why-p { font-size: clamp(16px, 1.5vw, 19px); line-height: 1.7; color: #3E3D3A; margin: 0 0 20px; }

        /* Stats */
        .icp-stat-grid { display: grid; gap: 1px; background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.10); border-radius: 20px; overflow: hidden; margin-top: 48px; }
        .icp-stat-grid-4 { grid-template-columns: repeat(4, 1fr); }
        .icp-stat-grid-3 { grid-template-columns: repeat(3, 1fr); }
        .icp-stat-grid-2 { grid-template-columns: repeat(2, 1fr); }
        .icp-stat-block { background: #0C0C0B; padding: 40px 30px; height: 100%; }
        .icp-stat-num { font-family: Inter, sans-serif; font-size: clamp(40px, 5vw, 64px); font-weight: 900; letter-spacing: -2.5px; line-height: 0.95; margin-bottom: 16px; }
        .icp-stat-meaning { font-size: 13.5px; line-height: 1.55; color: rgba(242,238,231,0.6); }
        .icp-stat-note { font-size: 12px; color: rgba(242,238,231,0.4); margin: 20px 2px 0; font-style: italic; max-width: 720px; }

        /* Services */
        .icp-svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 44px; }
        .icp-svc-card { display: flex; flex-direction: column; text-decoration: none; color: inherit; border-radius: 18px; padding: 26px 26px 22px; border: 1px solid rgba(12,12,11,0.08); background: rgba(255,255,255,0.55); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s; min-height: 200px; }
        .icp-svc-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(12,12,11,0.1); }
        .icp-svc-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
        .icp-svc-name { font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.25; margin: 0; }
        .icp-svc-weight { flex-shrink: 0; font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 4px 9px; border-radius: 100px; border: 1px solid; white-space: nowrap; }
        .icp-svc-why { font-size: 13.5px; line-height: 1.6; color: #6E6B63; margin: 0 0 18px; flex: 1; }
        .icp-svc-link { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 700; margin-top: auto; }

        /* Deliverables */
        .icp-deliv-list { margin-top: 44px; border-top: 1px solid rgba(255,255,255,0.10); }
        .icp-deliv-row { display: grid; grid-template-columns: 70px 1.1fr 1.6fr; gap: 28px; padding: 26px 0; border-bottom: 1px solid rgba(255,255,255,0.10); align-items: baseline; }
        .icp-deliv-num { font-family: Inter, sans-serif; font-size: 20px; font-weight: 300; }
        .icp-deliv-title { font-family: Inter, sans-serif; font-size: clamp(17px, 1.7vw, 22px); font-weight: 800; letter-spacing: -0.5px; color: #F2EEE7; margin: 0; }
        .icp-deliv-desc { font-size: 14px; line-height: 1.65; color: rgba(242,238,231,0.6); margin: 0; }

        /* Comparison */
        .icp-cmp { margin-top: 44px; border: 1px solid rgba(12,12,11,0.1); border-radius: 20px; overflow: hidden; background: rgba(255,255,255,0.5); }
        .icp-cmp-row { display: grid; grid-template-columns: 1.2fr 1.3fr 1.3fr; border-bottom: 1px solid rgba(12,12,11,0.08); }
        .icp-cmp-row:last-child { border-bottom: none; }
        .icp-cmp-head { background: rgba(12,12,11,0.03); }
        .icp-cmp-head > div { font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 16px 22px; }
        .icp-cmp-feature { padding: 18px 22px; font-size: 13.5px; font-weight: 700; color: #0C0C0B; }
        .icp-cmp-us { padding: 18px 22px; font-size: 13.5px; color: #0C0C0B; border-left: 1px solid rgba(12,12,11,0.08); display: flex; gap: 9px; align-items: flex-start; }
        .icp-cmp-them { padding: 18px 22px; font-size: 13.5px; color: #8b8780; border-left: 1px solid rgba(12,12,11,0.08); display: flex; gap: 9px; align-items: flex-start; }
        .icp-cmp-head .icp-cmp-us { padding: 16px 22px; align-items: center; }
        .icp-cmp-check { font-weight: 900; flex-shrink: 0; }
        .icp-cmp-x { color: #c0392b; opacity: 0.55; font-weight: 900; flex-shrink: 0; }
        .icp-cmp-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 6px; }

        /* Work */
        .icp-work-section .icp-container { margin-bottom: 40px; }
        .icp-work-placeholder { border: 1px dashed rgba(242,238,231,0.25); border-radius: 18px; padding: 48px 32px; text-align: center; color: rgba(242,238,231,0.6); font-size: 15px; line-height: 1.6; max-width: 720px; margin: 0 auto; }

        /* Risk reversal */
        .icp-risk-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 44px; }
        .icp-risk-card { border: 1px solid rgba(12,12,11,0.10); border-radius: 18px; background: rgba(255,255,255,0.55); padding: 26px 24px; height: 100%; }
        .icp-risk-num { font-family: Inter, sans-serif; font-size: 13px; font-weight: 800; letter-spacing: 1px; }
        .icp-risk-title { font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.4px; margin: 10px 0 10px; }
        .icp-risk-desc { font-size: 13.5px; line-height: 1.62; color: #6E6B63; margin: 0; }

        /* Pricing wrap — the homepage Pricing brings its own section padding */
        .icp-pricing-wrap { scroll-margin-top: 96px; background: #F2EEE7; }

        /* Final CTA */
        .icp-final { position: relative; overflow: hidden; border-radius: 28px; padding: 72px 48px; text-align: center; color: #F2EEE7; }
        .icp-final-h { font-family: Inter, sans-serif; font-size: clamp(28px, 3.6vw, 48px); font-weight: 900; letter-spacing: -1.6px; line-height: 1.05; margin: 0; max-width: 18ch; }
        .icp-final-p { font-size: 16px; line-height: 1.65; color: rgba(242,238,231,0.6); margin: 0; max-width: 560px; }
        .icp-final-note { font-size: 12.5px; color: rgba(242,238,231,0.4); }

        /* Responsive */
        @media (max-width: 1000px) {
          .icp-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .icp-hero-visual { max-width: 340px; }
          .icp-svc-grid { grid-template-columns: repeat(2, 1fr); }
          .icp-risk-grid { grid-template-columns: repeat(2, 1fr); }
          .icp-stat-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .icp-cmp-row { grid-template-columns: 1fr 1fr; }
          .icp-cmp-feature { grid-column: 1 / -1; border-bottom: 1px solid rgba(12,12,11,0.06); background: rgba(12,12,11,0.02); }
          .icp-cmp-head .icp-cmp-feature { display: none; }
          .icp-deliv-row { grid-template-columns: 44px 1fr; }
          .icp-deliv-desc { grid-column: 2; }
        }
        @media (max-width: 640px) {
          .icp-container { padding: 0 20px; }
          .icp-section { padding: 64px 0; }
          .icp-hero { padding: 104px 0 64px; }
          .icp-h1 { font-size: 34px; letter-spacing: -1.6px; }
          /* The animation used to be display:none on phones — indefensible for
             an outreach page where most cold clicks ARE on phones. The visual
             that explains the entire offer must be the thing mobile visitors
             see right after the headline. Centered, slightly narrower, after
             the copy in source order so the CTA stays above it. */
          .icp-hero-visual { display: block; max-width: 320px; margin: 8px auto 0; }
          .icp-hero-sub { font-size: 15.5px; }
          .icp-hero-actions { flex-direction: column; align-items: stretch; }
          .icp-hero-secondary { text-align: center; }
          .icp-svc-grid { grid-template-columns: 1fr; }
          .icp-risk-grid { grid-template-columns: 1fr; gap: 12px; }
          .icp-risk-card { padding: 22px 20px; }
          .icp-stat-grid-2, .icp-stat-grid-3, .icp-stat-grid-4 { grid-template-columns: 1fr 1fr; }
          .icp-stat-block { padding: 26px 18px; }
          .icp-cmp-row { grid-template-columns: 1fr; }
          .icp-cmp-us { border-left: none; }
          .icp-cmp-them { border-left: none; border-top: 1px dashed rgba(12,12,11,0.08); }
          .icp-final { padding: 48px 24px; }
        }
      `}</style>
    </>
  );
}
