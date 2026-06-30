'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Rocket,
  GraduationCap,
  ShoppingBag,
  Briefcase,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import type { IcpData } from '@/lib/icpData';
import { previewMp4Src, type Orientation, type VideoEntry } from '@/lib/videos';
import { BOOK_CALL_LABEL_LONG } from '@/lib/links';
import { trackCallClick } from '@/lib/analytics';

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

// ─── Video carousel constants (mirrors OurWork sizing) ───────────────────────
const CARD_H = 360;
const CARD_W_VERTICAL = 203; // CARD_H * 9/16
const CARD_W_HORIZ = 640; // CARD_H * 16/9
const GAP = 14;

const cardWidth = (o?: Orientation) => (o === 'horizontal' ? CARD_W_HORIZ : CARD_W_VERTICAL);

function openBookCall(location: string) {
  trackCallClick(location);
  (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
}

// ─── Lightweight video modal (same behavior as OurWork's) ────────────────────
function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100001, padding: '24px' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Work sample video"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(1100px, 95vw)', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', position: 'relative' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          style={{ position: 'absolute', top: '12px', right: '12px', width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: '18px', cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >×</button>
        {src.includes('player.cloudinary.com/embed') ? (
          <iframe title="Work sample" src={src} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%', border: 0 }} />
        ) : (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={src} controls autoPlay playsInline style={{ width: '100%', height: '100%', display: 'block' }} />
        )}
      </div>
    </div>
  );
}

export default function ICPPageClient({ data, videos }: { data: IcpData; videos: VideoEntry[] }) {
  const Icon = ICON_MAP[data.icon];
  const accent = data.accentColor;
  const [modalSrc, setModalSrc] = useState<string | null>(null);

  // ── Runtime orientation detection (same approach as OurWork) ──────────────
  const [detected, setDetected] = useState<Record<string, Orientation>>({});
  const handleMeta = useCallback((url: string, el: HTMLVideoElement) => {
    if (!el.videoWidth || !el.videoHeight) return;
    const next: Orientation = el.videoWidth >= el.videoHeight ? 'horizontal' : 'vertical';
    setDetected((prev) => (prev[url] === next ? prev : { ...prev, [url]: next }));
  }, []);
  const orientationOf = useCallback(
    (v: VideoEntry): Orientation => v.orientation ?? detected[v.url] ?? 'vertical',
    [detected],
  );

  // Center small sets instead of looping/tiling (matches the homepage fix).
  const railRef = useRef<HTMLDivElement>(null);
  const [centered, setCentered] = useState(true);
  useEffect(() => {
    const measure = () => {
      const rail = railRef.current;
      if (!rail) return;
      const total = videos.reduce((sum, v) => sum + cardWidth(orientationOf(v)) + GAP, 0);
      setCentered(total < rail.clientWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [videos, orientationOf]);

  const openModal = useCallback((src: string) => setModalSrc(src), []);
  const closeModal = useCallback(() => setModalSrc(null), []);

  // Stat count drives the grid layout (2 / 4 columns).
  const stats = useMemo(() => data.stats.slice(0, 4), [data.stats]);

  return (
    <div style={{ background: '#F2EEE7', minHeight: '100vh', color: '#0C0C0B' }}>
      {/* ── Minimal non-clickable logo bar + Book a Call ── */}
      <header className="icp-bar">
        <div className="icp-bar-logo" aria-label="EchoPulse Media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" aria-hidden="true" width={120} height={26} style={{ height: 26, width: 'auto', display: 'block', borderRadius: 7 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 800, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
            Echo<span style={{ color: '#E8541A' }}>Pulse</span> <span style={{ color: '#A8A49B', fontWeight: 700 }}>Media</span>
          </span>
        </div>
        <button type="button" className="icp-bar-cta" data-cursor-hover onClick={() => openBookCall('icp_bar')}>
          Book a Free Call
        </button>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="icp-hero">
          <div
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 80% 0%, ${accent}1f 0%, transparent 60%)`, pointerEvents: 'none' }}
          />
          <div className="icp-wrap" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="icp-eyebrow"
              style={{ color: '#6E6B63' }}
            >
              <span className="icp-eyebrow-icon" style={{ background: `${accent}14`, border: `1px solid ${accent}33` }}>
                <Icon size={15} strokeWidth={1.7} color={accent} aria-hidden="true" />
              </span>
              {data.eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="icp-h1"
            >
              {data.heroHeadline}
              {data.heroHeadlineAccent && (
                <>
                  {' '}
                  <span style={{ color: accent }}>{data.heroHeadlineAccent}</span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="icp-hero-sub"
            >
              {data.heroSub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="icp-hero-actions"
            >
              <button type="button" className="icp-btn-primary" data-cursor-hover onClick={() => openBookCall('icp_hero')} style={{ background: accent }}>
                {BOOK_CALL_LABEL_LONG}
                <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
              </button>
              <span className="icp-hero-note">No credit card. No contracts. Just a conversation.</span>
            </motion.div>

            {/* Proof stats */}
            <div className={`icp-stats icp-stats-${stats.length}`}>
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.07 }}
                  className="icp-stat"
                >
                  <div className="icp-stat-value" style={{ color: accent }}>{s.value}</div>
                  <div className="icp-stat-label">{s.label}</div>
                </motion.div>
              ))}
            </div>
            <p className="icp-stats-disclaimer">
              Industry figures showing the opportunity in your market — not results we are claiming for your account.
            </p>
          </div>
        </section>

        {/* ── TRANSFORMATION ── */}
        <section className="icp-wrap icp-transform">
          <div className="icp-transform-grid">
            <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="icp-transform-card icp-from">
              <div className="icp-transform-tag" style={{ color: '#9a958c' }}>Today</div>
              <p>{data.transformFrom}</p>
            </motion.div>
            <div className="icp-transform-arrow" aria-hidden="true">
              <ArrowRight size={22} strokeWidth={2.2} color={accent} />
            </div>
            <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="icp-transform-card icp-to" style={{ borderColor: `${accent}33`, background: `${accent}0a` }}>
              <div className="icp-transform-tag" style={{ color: accent }}>With EchoPulse Media</div>
              <p>{data.transformTo}</p>
            </motion.div>
          </div>
        </section>

        {/* ── VIDEO CAROUSEL ── */}
        {videos.length > 0 && (
          <section className="icp-work">
            <div className="icp-wrap">
              <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="icp-section-eyebrow" style={{ color: '#6E6B63' }}>
                <span style={{ width: 22, height: 1, background: accent, display: 'block' }} />
                Work in this space
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="icp-h2">
                Edits we cut for <span style={{ color: accent }}>{data.name.toLowerCase()}</span>.
              </motion.h2>
            </div>
            <div className="icp-rail-outer">
              <div ref={railRef} className={`icp-rail${centered ? ' icp-rail-centered' : ''}`}>
                {videos.map((video, i) => {
                  const orient = orientationOf(video);
                  const previewSrc = previewMp4Src(video.url, orient);
                  return (
                    <div
                      key={`${video.url}-${i}`}
                      className="icp-vid-card"
                      style={{ width: `${cardWidth(orient)}px`, height: `${CARD_H}px` }}
                      onClick={() => openModal(video.url)}
                      data-cursor-hover
                    >
                      {previewSrc ? (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <video
                          src={previewSrc}
                          muted
                          loop
                          playsInline
                          autoPlay
                          preload="metadata"
                          onLoadedMetadata={(e) => handleMeta(video.url, e.currentTarget)}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#0C0C0B' }}
                        />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, background: '#0C0C0B' }} />
                      )}
                      <div className="icp-vid-overlay" />
                      <div className="icp-vid-brand">{video.brand}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── SERVICES (priority order) ── */}
        <section className="icp-wrap icp-services">
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="icp-section-eyebrow" style={{ color: '#6E6B63' }}>
            <span style={{ width: 22, height: 1, background: accent, display: 'block' }} />
            How we solve it
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="icp-h2">
            One team. Every channel you need.
          </motion.h2>
          <p className="icp-services-sub">{data.starterStack}</p>

          <div className="icp-services-grid">
            {data.services.map((svc, i) => (
              <motion.a
                key={svc.slug}
                href={`/services/${svc.slug}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
                className={`icp-svc-card${svc.weight === 'Core' ? ' icp-svc-core' : ''}`}
                style={svc.weight === 'Core' ? { borderColor: `${accent}40`, background: `${accent}08` } : undefined}
                data-cursor-hover
              >
                <div className="icp-svc-head">
                  <span className="icp-svc-name">{svc.name}</span>
                  <span className="icp-svc-weight" style={{ color: svc.weight === 'Core' ? accent : '#9a958c', borderColor: svc.weight === 'Core' ? `${accent}40` : 'rgba(12,12,11,0.12)' }}>
                    {WEIGHT_LABEL[svc.weight]}
                  </span>
                </div>
                <p className="icp-svc-why">{svc.why}</p>
                <span className="icp-svc-link" style={{ color: accent }}>
                  See the service <ArrowRight size={13} strokeWidth={2.4} aria-hidden="true" />
                </span>
              </motion.a>
            ))}
          </div>
        </section>

        {/* ── "We do more" CTA → homepage services section ── */}
        <section className="icp-wrap">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="icp-more"
            data-dark-bg="true"
          >
            <div
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 75% 50%, ${accent}26 0%, transparent 65%)`, pointerEvents: 'none' }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="icp-more-h">We do more than {data.name.toLowerCase()} work.</h2>
              <p className="icp-more-p">
                Video, social, blogs, ad creative, websites, automations, and custom software — all under one roof, one bill. See the full menu.
              </p>
            </div>
            <a href="/#services" className="icp-more-btn" data-cursor-hover style={{ position: 'relative', zIndex: 1 }}>
              Explore all services
              <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
            </a>
          </motion.div>
        </section>

        {/* ── FAQ ── */}
        <section className="icp-wrap icp-faq">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="icp-h2" style={{ marginBottom: 32 }}>
            Questions, <span style={{ color: accent }}>answered.</span>
          </motion.h2>
          <IcpFaq faq={data.faq} accent={accent} />
        </section>

        {/* ── Final CTA ── */}
        <section className="icp-wrap" style={{ paddingBottom: 120 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="icp-final"
            data-dark-bg="true"
          >
            <h2 className="icp-final-h">
              Ready to stop doing it all yourself?
            </h2>
            <p className="icp-final-p">
              Book a free 45-minute call. We will review what you are publishing today, map a 30-day plan, and put the numbers in writing.
            </p>
            <button type="button" className="icp-btn-primary icp-final-btn" data-cursor-hover onClick={() => openBookCall('icp_final')} style={{ background: accent }}>
              {BOOK_CALL_LABEL_LONG}
              <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
            </button>
            <span className="icp-final-note">Starts with a $299 14-day Pilot. See the work before you commit.</span>
          </motion.div>
        </section>
      </main>

      <AnimatePresence>
        {modalSrc && <VideoModal src={modalSrc} onClose={closeModal} />}
      </AnimatePresence>

      <style>{`
        .icp-wrap { max-width: 1140px; margin: 0 auto; padding: 0 56px; }

        /* Logo bar */
        .icp-bar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 56px;
          background: rgba(242,238,231,0.82);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(12,12,11,0.06);
        }
        .icp-bar-logo { display: flex; align-items: center; gap: 9px; }
        .icp-bar-cta {
          background: #0C0C0B; color: #F2EEE7; border: none;
          padding: 11px 22px; border-radius: 100px;
          font-size: 13px; font-weight: 700; cursor: none;
          font-family: Inter, sans-serif; transition: background 0.25s; min-height: 42px;
        }
        .icp-bar-cta:hover { background: #E8541A; }

        /* Hero */
        .icp-hero { position: relative; padding: 96px 0 72px; overflow: hidden; }
        .icp-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 26px;
        }
        .icp-eyebrow-icon { width: 30px; height: 30px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; }
        .icp-h1 {
          font-family: Inter, sans-serif; font-weight: 900;
          font-size: clamp(40px, 6.2vw, 82px); letter-spacing: -3px; line-height: 0.98;
          margin: 0 0 24px; max-width: 16ch;
        }
        .icp-hero-sub { font-size: clamp(16px, 1.6vw, 20px); line-height: 1.6; color: #3E3D3A; max-width: 620px; margin: 0 0 32px; }
        .icp-hero-actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 64px; }
        .icp-btn-primary {
          display: inline-flex; align-items: center; gap: 9px;
          color: #fff; border: none; padding: 17px 34px; border-radius: 100px;
          font-size: 15px; font-weight: 700; cursor: none; font-family: Inter, sans-serif;
          box-shadow: 0 8px 36px rgba(12,12,11,0.18); transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap; min-height: 48px;
        }
        .icp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 44px rgba(12,12,11,0.26); }
        .icp-hero-note { font-size: 12.5px; color: #9a958c; }

        /* Stats */
        .icp-stats { display: grid; gap: 1px; background: rgba(12,12,11,0.08); border: 1px solid rgba(12,12,11,0.08); border-radius: 18px; overflow: hidden; }
        .icp-stats-4 { grid-template-columns: repeat(4, 1fr); }
        .icp-stats-3 { grid-template-columns: repeat(3, 1fr); }
        .icp-stats-2 { grid-template-columns: repeat(2, 1fr); }
        .icp-stat { background: rgba(255,255,255,0.6); padding: 26px 24px; }
        .icp-stat-value { font-family: Inter, sans-serif; font-size: clamp(28px, 3.4vw, 40px); font-weight: 900; letter-spacing: -1.5px; line-height: 1; margin-bottom: 10px; }
        .icp-stat-label { font-size: 12.5px; line-height: 1.5; color: #6E6B63; font-weight: 500; }
        .icp-stats-disclaimer { font-size: 11.5px; color: #A8A49B; margin: 14px 2px 0; font-style: italic; }

        /* Section shared */
        .icp-section-eyebrow { display: inline-flex; align-items: center; gap: 14px; font-size: 10px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 18px; }
        .icp-h2 { font-family: Inter, sans-serif; font-weight: 900; font-size: clamp(30px, 4vw, 56px); letter-spacing: -2px; line-height: 1.0; margin: 0; }

        /* Transformation */
        .icp-transform { padding: 56px 56px 16px; }
        .icp-transform-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: stretch; }
        .icp-transform-card { border-radius: 18px; padding: 30px 30px; border: 1px solid rgba(12,12,11,0.08); background: rgba(255,255,255,0.55); }
        .icp-transform-card p { margin: 0; font-size: 16px; line-height: 1.6; color: #3E3D3A; }
        .icp-from p { color: #6E6B63; }
        .icp-transform-tag { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; }
        .icp-transform-arrow { display: flex; align-items: center; justify-content: center; }

        /* Work / carousel */
        .icp-work { padding: 64px 0 8px; }
        .icp-work .icp-h2 { margin-bottom: 36px; }
        .icp-rail-outer { overflow: hidden; }
        .icp-rail { display: flex; gap: ${GAP}px; padding: 0 56px 8px; overflow-x: auto; scrollbar-width: none; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
        .icp-rail::-webkit-scrollbar { display: none; }
        .icp-rail-centered { justify-content: center; }
        .icp-vid-card { position: relative; flex-shrink: 0; border-radius: 16px; overflow: hidden; cursor: none; scroll-snap-align: start; box-shadow: 0 8px 30px rgba(12,12,11,0.10); }
        .icp-vid-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%); opacity: 0.7; transition: opacity 0.3s; pointer-events: none; }
        .icp-vid-card:hover .icp-vid-overlay { opacity: 1; }
        .icp-vid-brand { position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; color: #0C0C0B; z-index: 2; pointer-events: none; }

        /* Services */
        .icp-services { padding: 72px 56px 24px; }
        .icp-services .icp-h2 { margin-bottom: 14px; }
        .icp-services-sub { font-size: 15px; line-height: 1.65; color: #6E6B63; max-width: 640px; margin: 0 0 40px; }
        .icp-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .icp-svc-card {
          display: flex; flex-direction: column; text-decoration: none; color: inherit;
          border-radius: 18px; padding: 26px 26px 22px;
          border: 1px solid rgba(12,12,11,0.08); background: rgba(255,255,255,0.55);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s;
          cursor: none; min-height: 200px;
        }
        .icp-svc-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(12,12,11,0.1); }
        .icp-svc-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
        .icp-svc-name { font-family: Inter, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.25; }
        .icp-svc-weight { flex-shrink: 0; font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 4px 9px; border-radius: 100px; border: 1px solid; white-space: nowrap; }
        .icp-svc-why { font-size: 13.5px; line-height: 1.6; color: #6E6B63; margin: 0 0 18px; flex: 1; }
        .icp-svc-link { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 700; margin-top: auto; }

        /* "We do more" banner */
        .icp-more {
          position: relative; overflow: hidden;
          margin: 48px 0 0; padding: 48px 52px; border-radius: 24px;
          background: #0C0C0B; color: #F2EEE7;
          display: flex; align-items: center; justify-content: space-between; gap: 36px; flex-wrap: wrap;
        }
        .icp-more-h { font-family: Inter, sans-serif; font-size: clamp(22px, 2.6vw, 32px); font-weight: 800; letter-spacing: -0.8px; margin: 0 0 12px; line-height: 1.1; }
        .icp-more-p { font-size: 15px; line-height: 1.6; color: rgba(242,238,231,0.6); margin: 0; max-width: 540px; }
        .icp-more-btn {
          flex-shrink: 0; display: inline-flex; align-items: center; gap: 9px;
          background: #F2EEE7; color: #0C0C0B; text-decoration: none;
          padding: 16px 30px; border-radius: 100px; font-size: 14px; font-weight: 700;
          cursor: none; transition: transform 0.2s, background 0.25s; min-height: 48px; white-space: nowrap;
        }
        .icp-more-btn:hover { transform: translateY(-2px); background: #fff; }

        /* FAQ */
        .icp-faq { padding: 80px 56px 24px; }

        /* Final CTA */
        .icp-final {
          text-align: center; border-radius: 28px; padding: 72px 48px;
          background: #0C0C0B; color: #F2EEE7;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .icp-final-h { font-family: Inter, sans-serif; font-size: clamp(28px, 3.6vw, 48px); font-weight: 900; letter-spacing: -1.6px; line-height: 1.05; margin: 0; max-width: 18ch; }
        .icp-final-p { font-size: 16px; line-height: 1.65; color: rgba(242,238,231,0.6); margin: 0; max-width: 560px; }
        .icp-final-btn { margin-top: 12px; }
        .icp-final-note { font-size: 12.5px; color: rgba(242,238,231,0.4); }

        /* Responsive */
        @media (max-width: 900px) {
          .icp-wrap, .icp-services, .icp-transform, .icp-faq { padding-left: 28px; padding-right: 28px; }
          .icp-bar { padding: 14px 24px; }
          .icp-rail { padding-left: 24px; padding-right: 24px; }
          .icp-stats-4 { grid-template-columns: repeat(2, 1fr); }
          .icp-services-grid { grid-template-columns: repeat(2, 1fr); }
          .icp-transform-grid { grid-template-columns: 1fr; }
          .icp-transform-arrow { transform: rotate(90deg); }
          .icp-rail-centered { justify-content: flex-start; }
        }
        @media (max-width: 600px) {
          .icp-wrap, .icp-services, .icp-transform, .icp-faq { padding-left: 18px; padding-right: 18px; }
          .icp-bar { padding: 12px 16px; }
          .icp-bar-logo span { font-size: 14px; }
          .icp-hero { padding: 56px 0 48px; }
          .icp-h1 { font-size: 34px; letter-spacing: -1.6px; }
          .icp-stats-2, .icp-stats-3, .icp-stats-4 { grid-template-columns: 1fr 1fr; }
          .icp-services-grid { grid-template-columns: 1fr; }
          .icp-rail { padding-left: 16px; padding-right: 16px; }
          .icp-more { padding: 36px 28px; }
          .icp-more-btn { width: 100%; justify-content: center; }
          .icp-final { padding: 52px 24px; }
        }
      `}</style>
    </div>
  );
}

// ─── FAQ accordion (self-contained, mirrors FAQ.tsx card styling) ────────────
function IcpFaq({ faq, accent }: { faq: { q: string; a: string }[]; accent: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {faq.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            onClick={() => setOpen(isOpen ? null : i)}
            data-cursor-hover
            style={{
              background: isOpen ? `${accent}0d` : 'rgba(255,255,255,0.55)',
              border: `1px solid ${isOpen ? `${accent}30` : 'rgba(12,12,11,0.06)'}`,
              borderRadius: 18,
              padding: '22px 26px',
              cursor: 'none',
              transition: 'background 0.3s, border-color 0.3s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px', color: '#0C0C0B', lineHeight: 1.4 }}>
                {item.q}
              </span>
              <span aria-hidden="true" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', border: `1px solid ${isOpen ? accent : 'rgba(12,12,11,0.12)'}`, background: isOpen ? accent : 'transparent', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                <span style={{ position: 'absolute', width: 11, height: 1.8, background: isOpen ? '#fff' : '#0C0C0B', borderRadius: 2 }} />
                <span style={{ position: 'absolute', width: 11, height: 1.8, background: isOpen ? '#fff' : '#0C0C0B', borderRadius: 2, transform: isOpen ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.3s' }} />
              </span>
            </div>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden' }}>
                  <p onClick={(e) => e.stopPropagation()} style={{ margin: '16px 0 4px', fontSize: 14.5, lineHeight: 1.7, color: '#6E6B63' }}>
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
