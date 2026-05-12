'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BOOK_CALL_URL } from '@/lib/links';

const tabs = [
  { label: 'All', key: 'all' },
  { label: 'Cinematic', key: 'speed' },
  { label: 'Short Form', key: 'shortform' },
  { label: 'Talking Head', key: 'talking' },
  { label: 'Podcast Clips', key: 'podcast' },
  { label: 'Long Form', key: 'longform' },
  { label: 'Real Estate', key: 'course' },
];

const thumbGrads = [
  'linear-gradient(155deg,#1c0e00 0%,#3d2005 60%,#1a0a00 100%)',
  'linear-gradient(155deg,#0d0d0d 0%,#282828 60%,#111 100%)',
  'linear-gradient(155deg,#001408 0%,#063520 60%,#001a0a 100%)',
  'linear-gradient(155deg,#100012 0%,#310838 60%,#160018 100%)',
  'linear-gradient(155deg,#0e0e00 0%,#30300a 60%,#141400 100%)',
  'linear-gradient(155deg,#001520 0%,#073650 60%,#001825 100%)',
];

// `orientation` controls the card aspect ratio inside the slider.
//   - 'vertical'   (default): 9:16, like a Reel / Short / TikTok
//   - 'horizontal':           16:9, like a YouTube / podcast clip / brand film
// Card HEIGHT stays the same row-to-row; widths differ per orientation
// so vertical and horizontal cards can coexist in a single auto-scroll track.
type Orientation = 'vertical' | 'horizontal';
type VideoItem = {
  type: string;
  brand: string;
  label: string;
  grad: number;
  views: string;
  likes: string;
  orientation?: Orientation;
};

const videos: VideoItem[] = [
  { type: 'speed',     brand: 'Cinematic',     label: 'Property Tour',  grad: 0, views: 'Reel', likes: '60s' },
  { type: 'shortform', brand: 'LinkedIn',      label: 'Founder Post',   grad: 1, views: 'Post', likes: '4 min' },
  { type: 'talking',   brand: 'Founder Reel',  label: 'Talking Head',   grad: 2, views: 'IG',   likes: '45s' },
  { type: 'longform',  brand: 'Brand Film',    label: 'Long Form',      grad: 4, views: 'YT',   likes: '3 min', orientation: 'horizontal' },
  { type: 'speed',     brand: 'Listing Reel',  label: 'Speed Ramp',     grad: 4, views: 'Reel', likes: '60s' },
  { type: 'podcast',   brand: 'Podcast Clip',  label: 'Highlight Cut',  grad: 3, views: 'IG',   likes: '90s' },
  { type: 'shortform', brand: 'Ad Creative',   label: 'Meta Ad',        grad: 0, views: 'Ad',   likes: '30s' },
  { type: 'podcast',   brand: 'Podcast',       label: 'Full Episode',   grad: 5, views: 'YT',   likes: '12 min', orientation: 'horizontal' },
  { type: 'talking',   brand: 'B2B Brand',     label: 'Talking Head',   grad: 1, views: 'YT',   likes: '2 min' },
  { type: 'speed',     brand: 'Cinematic',     label: 'Property Tour',  grad: 2, views: 'Reel', likes: '60s' },
  { type: 'course',    brand: 'Real Estate',   label: 'Agent Reel',     grad: 5, views: 'Reel', likes: '45s' },
  { type: 'longform',  brand: 'Long Form',     label: 'Brand Film',     grad: 4, views: 'YT',   likes: '3 min', orientation: 'horizontal' },
  { type: 'shortform', brand: 'LinkedIn',      label: 'Carousel',       grad: 3, views: 'Post', likes: '8 slides' },
  { type: 'podcast',   brand: 'Podcast Clip',  label: 'Hook Cut',       grad: 5, views: 'IG',   likes: '60s' },
  { type: 'talking',   brand: 'Founder Reel',  label: 'Talking Head',   grad: 0, views: 'IG',   likes: '45s' },
  { type: 'speed',     brand: 'Cinematic',     label: 'Property Tour',  grad: 3, views: 'Reel', likes: '60s' },
  { type: 'course',    brand: 'Real Estate',   label: 'Listing Reel',   grad: 1, views: 'Reel', likes: '45s' },
];

const CARD_H = 408;
const CARD_W_VERTICAL = 230;                 // 9:16 portrait
const CARD_W_HORIZONTAL = 726;               // 16:9 landscape (CARD_H * 16/9)
const GAP = 12;
const SPEED = 0.55; // px per frame

const cardWidth = (o?: Orientation) =>
  o === 'horizontal' ? CARD_W_HORIZONTAL : CARD_W_VERTICAL;

export default function OurWork() {
  const [activeTab, setActiveTab] = useState('all');
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef(false);
  const rafRef = useRef<number | undefined>(undefined);

  const filtered = activeTab === 'all' ? videos : videos.filter(v => v.type === activeTab);
  // Duplicate for seamless loop
  const doubled = [...filtered, ...filtered];

  // Mixed orientations → sum each card's width, don't multiply.
  const halfWidth = filtered.reduce(
    (sum, v) => sum + cardWidth(v.orientation) + GAP,
    0
  );

  const startRAF = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const tick = () => {
      if (!pauseRef.current) {
        track.scrollLeft += SPEED;
        if (track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [halfWidth]);

  useEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollLeft = 0;
    setPlayingIdx(null);
    startRAF();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [filtered.length, startRAF]);

  const scrollBy = (dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    pauseRef.current = true;
    // Step by the smallest card width so vertical cards never skip past.
    const step = CARD_W_VERTICAL + GAP;
    const target = track.scrollLeft + dir * step;
    track.scrollTo({ left: target, behavior: 'smooth' });
    setTimeout(() => { pauseRef.current = false; }, 1400);
  };

  return (
    <section id="work" style={{ padding: '140px 0 100px', scrollMarginTop: '80px', background: '#F2EEE7', overflow: 'hidden' }}>
      <style>{`
        .work-track { display: flex; gap: ${GAP}px; overflow-x: hidden; padding: 0 56px; }
        .work-track::-webkit-scrollbar { display: none; }

        .vid-card {
          position: relative; border-radius: 16px; overflow: hidden;
          flex-shrink: 0; height: ${CARD_H}px;
          /* width comes from inline style — varies per orientation */
          cursor: none;
        }
        .vid-inner {
          position: absolute; inset: 0;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .vid-card:hover .vid-inner { transform: scale(1.06); }

        .vid-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 55%, transparent 100%);
          opacity: 0.65; transition: opacity 0.3s;
        }
        .vid-card:hover .vid-overlay { opacity: 1; }

        .vid-play {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%) scale(0.75);
          width: 52px; height: 52px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 4px 24px rgba(0,0,0,0.35); z-index: 3;
        }
        .vid-card:hover .vid-play { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        .vid-card.playing .vid-play { opacity: 1; transform: translate(-50%,-50%) scale(1); background: #E8541A; }

        .vid-brand {
          position: absolute; top: 10px; left: 10px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.95);
          padding: 3px 9px; border-radius: 6px;
          font-size: 10px; font-weight: 700; color: #0C0C0B;
          z-index: 2; letter-spacing: -0.1px;
        }
        .vid-tag {
          position: absolute; bottom: 30px; left: 10px;
          background: #E8541A;
          padding: 3px 9px; border-radius: 5px;
          font-size: 9px; font-weight: 800; letter-spacing: 1.5px;
          text-transform: uppercase; color: #fff; z-index: 2;
          opacity: 0; transform: translateY(4px);
          transition: opacity 0.3s, transform 0.3s;
        }
        .vid-card:hover .vid-tag { opacity: 1; transform: translateY(0); }
        .vid-stats {
          position: absolute; bottom: 10px; left: 10px; right: 10px;
          display: flex; align-items: center; justify-content: space-between;
          z-index: 2; opacity: 0; transform: translateY(6px);
          transition: opacity 0.3s, transform 0.3s;
        }
        .vid-card:hover .vid-stats { opacity: 1; transform: translateY(0); }
        .vid-stat { font-size: 10px; color: rgba(255,255,255,0.75); font-weight: 600; display: flex; align-items: center; gap: 3px; }

        /* Arrow buttons */
        .work-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 48px; height: 48px; border-radius: 50%;
          background: #0C0C0B; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: none; z-index: 10;
          box-shadow: 0 4px 24px rgba(12,12,11,0.2);
          transition: background 0.25s, transform 0.25s;
        }
        .work-arrow:hover { background: #E8541A; transform: translateY(-50%) scale(1.08); }
        .work-arrow-left { left: 12px; }
        .work-arrow-right { right: 12px; }

        /* Tab bar */
        .tab-bar {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.82);
          border-radius: 14px; padding: 5px;
          display: inline-flex; gap: 2px;
          box-shadow: 0 4px 20px rgba(12,12,11,0.07), inset 0 1px 0 rgba(255,255,255,0.9);
          max-width: 100%; overflow-x: auto; scrollbar-width: none;
        }
        .tab-bar::-webkit-scrollbar { display: none; }
        .tab-btn {
          position: relative;
          background: none; border: none; color: #6E6B63;
          padding: 9px 18px; font-size: 11px; font-weight: 700;
          cursor: none; border-radius: 10px;
          transition: color 0.22s ease;
          white-space: nowrap; letter-spacing: 1.5px; text-transform: uppercase;
          font-family: Inter, sans-serif;
          isolation: isolate;
        }
        .tab-btn.active { color: #F2EEE7; }
        .tab-btn:not(.active):hover { color: #0C0C0B; }
        .tab-btn-label {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
        }
        .tab-pill-bg {
          position: absolute;
          inset: 0;
          background: #0C0C0B;
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(12,12,11,0.22);
          z-index: 0;
        }
      `}</style>

      {/* Header */}
      <div className="work-header" style={{ padding: '0 56px', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#6E6B63', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}
            >
              <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
              Portfolio
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(64px, 9vw, 120px)', fontWeight: 900, letterSpacing: '-4px', lineHeight: 0.88, margin: 0 }}
            >
              The<br />
              <span style={{ color: '#E8541A' }}>Craft.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p style={{ color: '#6E6B63', fontSize: '14px', lineHeight: 1.75, margin: '0 0 20px', maxWidth: '270px' }}>
              Cinematic edits, motion graphics, talking-head reels, podcast cuts, and ad creative. Real samples coming as we ship paid client work.
            </p>
            <div style={{ display: 'flex', gap: '28px' }}>
              {[{ n: '48hrs', l: 'Standard turnaround' }, { n: '6', l: 'Service formats' }].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: 'Inter', fontSize: '22px', fontWeight: 900, letterSpacing: '-1px', color: '#0C0C0B' }}>
                    {s.n}
                  </div>
                  <div style={{ fontSize: '10px', color: '#A8A49B', marginTop: '2px', fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="work-tabs"
        style={{ padding: '0 56px', marginBottom: '28px' }}
      >
        <div className="tab-bar">
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                className={`tab-btn${isActive ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                data-cursor-hover
              >
                {/* Magnetic pill — single shared motion.div that flies between buttons via layoutId.
                   Spring physics give the satisfying bounce when the active tab changes. */}
                {isActive && (
                  <motion.span
                    layoutId="active-tab-pill"
                    className="tab-pill-bg"
                    transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.9 }}
                  />
                )}
                <span className="tab-btn-label">
                  {tab.label}
                  {tab.key !== 'all' && (
                    <span style={{ marginLeft: '5px', fontSize: '9px', opacity: 0.5, fontWeight: 600 }}>
                      {videos.filter(v => v.type === tab.key).length}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Slider */}
      <div style={{ position: 'relative' }}>
        {/* Left arrow */}
        <button className="work-arrow work-arrow-left" onClick={() => scrollBy(-1)} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2EEE7" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Track */}
        <div
          ref={trackRef}
          className="work-track"
          onMouseEnter={() => { pauseRef.current = true; }}
          onMouseLeave={() => { pauseRef.current = false; }}
        >
          {doubled.map((video, i) => (
            <div
              key={i}
              className={`vid-card${playingIdx === i ? ' playing' : ''}${video.orientation === 'horizontal' ? ' vid-card-h' : ''}`}
              style={{ width: `${cardWidth(video.orientation)}px` }}
              onClick={() => setPlayingIdx(playingIdx === i ? null : i)}
            >
              <div className="vid-inner">
                <div style={{ position: 'absolute', inset: 0, background: thumbGrads[video.grad] }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                {/* Playing pulse */}
                {playingIdx === i && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '32px' }}>
                      {[0, 1, 2, 3].map(b => (
                        <div key={b} style={{ width: '3px', background: '#fff', borderRadius: '2px', animation: `waveBar 0.8s ease-in-out ${b * 0.15}s infinite alternate`, height: '100%' }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="vid-overlay" />

              <div className="vid-play">
                {playingIdx === i
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="#0C0C0B" style={{ marginLeft: '3px' }}><path d="M8 5v14l11-7z" /></svg>
                }
              </div>

              <div className="vid-brand">{video.brand}</div>
              <div className="vid-tag">{video.label}</div>

              <div className="vid-stats">
                <span className="vid-stat">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  {video.views}
                </span>
                <span className="vid-stat">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  {video.likes}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button className="work-arrow work-arrow-right" onClick={() => scrollBy(1)} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2EEE7" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ display: 'flex', justifyContent: 'center', marginTop: '48px', gap: '16px', flexWrap: 'wrap', alignItems: 'center', padding: '0 56px' }}
      >
        <a
          href={BOOK_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          aria-label="Book a call to see more work"
          style={{ background: '#0C0C0B', color: '#F2EEE7', padding: '14px 32px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, cursor: 'none', transition: 'all 0.3s', textDecoration: 'none', fontFamily: 'Inter, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '8px', minHeight: '44px' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8541A'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0C0C0B'; }}
        >
          Book a Call to See More
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </motion.div>

      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.2); }
          to   { transform: scaleY(1); }
        }
        @media(max-width:640px) {
          .work-arrow { display:none !important; }
          .work-track { padding: 0 16px !important; }
          .work-header { padding: 0 24px !important; }
          .work-tabs { padding: 0 16px !important; }
        }
      `}</style>
    </section>
  );
}
