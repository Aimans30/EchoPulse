'use client';

import { useState, useRef, useEffect, useCallback, useMemo, useTransition } from 'react';
import { motion } from 'framer-motion';

// ─── Tab definitions ────────────────────────────────────────────────────────
const tabs = [
  { label: 'All',          key: 'all'      },
  { label: 'Talking Head', key: 'talking'  },
  { label: 'Podcast Clips',key: 'podcast'  },
  { label: 'Long Form',    key: 'longform' },
  { label: 'Real Estate',  key: 'realestate' },
];

type Orientation = 'vertical' | 'horizontal';
type VideoEntry = {
  url:          string;
  type:         string;
  brand:        string;
  label:        string;
  orientation?: Orientation;
};

// ─── Single source-of-truth video list ──────────────────────────────────────
const videos: VideoEntry[] = [
  // Longform
  { url: 'https://player.cloudinary.com/embed/?cloud_name=du6yx2h01&public_id=vsl1_1_aagaus',                                                                     type: 'longform', brand: 'Sales Video',    label: 'VSL',        orientation: 'horizontal' },
  { url: 'https://player.cloudinary.com/embed/?cloud_name=du6yx2h01&public_id=Untitled_video_-_Made_with_Clipchamp_1_1_spvlnf',                                   type: 'longform', brand: 'Brand Film',     label: 'Cinematic',  orientation: 'horizontal' },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/f_mp4,q_auto/fn_1_xy7wfm.mp4',                                                                        type: 'longform', brand: 'Founder Film',   label: 'Story',      orientation: 'horizontal' },
  // Podcast
  { url: 'https://player.cloudinary.com/embed/?cloud_name=du6yx2h01&public_id=17_feb_xngenr',                                                                     type: 'podcast',  brand: 'Podcast',        label: 'Episode'     },
  { url: 'https://res.cloudinary.com/du6yx2h01/video/upload/v1765363520/Ep1_Clip18_corrected_xn2szx.mp4',                                                         type: 'podcast',  brand: 'Podcast Clip',   label: 'Hook'        },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/f_mp4,q_auto/EP4_trailer_l6atpc.mp4',                                                                 type: 'podcast',  brand: 'Podcast',        label: 'Trailer',    orientation: 'horizontal' },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/f_mp4,q_auto/mian_hlymvc.mp4',                                                                        type: 'podcast',  brand: 'Podcast Clip',   label: 'Highlight',  orientation: 'horizontal' },
  { url: 'https://res.cloudinary.com/du6yx2h01/video/upload/v1779111471/Clip_2_sy4gp8.mp4',                                                                       type: 'podcast',  brand: 'Podcast Clip',   label: 'Highlight'   },
  // Talking head
  { url: 'https://player.cloudinary.com/embed/?cloud_name=du6yx2h01&public_id=patern_intrupt_sdrd8w',                                                             type: 'talking',  brand: 'Founder Reel',   label: 'Pattern Interrupt' },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/f_mp4,q_auto/sample_1_j1b05r.mp4',                                                                    type: 'talking',  brand: 'B2B Brand',      label: 'Talking Head' },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/f_mp4,q_auto/c5_p3qm4j.mp4',                                                                         type: 'talking',  brand: 'Founder Reel',   label: 'Story'        },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782370864/c4_auow1y.mp4',                                                                           type: 'talking',  brand: 'Founder Reel',   label: 'Talking Head' },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782370930/c3_d6b0yo.mp4',                                                                           type: 'talking',  brand: 'Founder Reel',   label: 'Talking Head' },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782370996/c2_xxusow.mp4',                                                                           type: 'talking',  brand: 'Founder Reel',   label: 'Talking Head' },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782371012/milo_6_jycqyj.mp4',                                                                       type: 'talking',  brand: 'Founder Reel',   label: 'Talking Head' },
  // Long form
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1761292978/_mediamen-26-11-2023-0001_sycb1h.mp4',                                                    type: 'longform', brand: 'Brand Film',     label: 'Cinematic',  orientation: 'horizontal' },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1761292973/_mediamen-26-11-2023-0002_hmkbwn.mp4',                                                    type: 'longform', brand: 'Brand Film',     label: 'Cinematic',  orientation: 'horizontal' },
  // Real estate
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782371049/2426_fn_e4yyrc.mp4',                                                                      type: 'realestate', brand: 'Listing Reel', label: 'Property' },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782371126/2458_fn_uphhrb.mp4',                                                                      type: 'realestate', brand: 'Listing Reel', label: 'Property' },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782372139/2438_fn_z6wry7.mp4',                                                                      type: 'realestate', brand: 'Listing Reel', label: 'Property' },
];

// ─── Layout constants ────────────────────────────────────────────────────────
const CARD_H          = 408;
const CARD_W_VERTICAL = 230;
const CARD_W_HORIZ    = 726;   // CARD_H * 16/9
const GAP             = 12;
const SPEED           = 0.55; // px / frame

const cardWidth = (o?: Orientation) => o === 'horizontal' ? CARD_W_HORIZ : CARD_W_VERTICAL;

// ─── Cloudinary preview URL helper ──────────────────────────────────────────
// Converts embed-player links to direct .mp4 URLs sized for the card's display
// width (×2 for retina). Skips non-Cloudinary sources.
function previewMp4Src(src: string, orientation?: Orientation): string | null {
  const w = orientation === 'horizontal' ? 1500 : 700;

  if (src.includes('player.cloudinary.com/embed')) {
    try {
      const url      = new URL(src);
      const publicId = url.searchParams.get('public_id');
      const cloud    = url.searchParams.get('cloud_name') || 'du6yx2h01';
      if (publicId) return `https://res.cloudinary.com/${cloud}/video/upload/c_scale,w_${w},q_auto:good,f_auto/${publicId}.mp4`;
    } catch { return null; }
  }
  if (src.includes('res.cloudinary.com') && src.includes('/video/upload/')) {
    if (/[,/]w_\d+/.test(src)) return src;
    return src.replace('/video/upload/', `/video/upload/c_scale,w_${w},q_auto:good/`);
  }
  if (src.includes('.mp4')) return src;
  return null;
}

// ─── VideoModal — isolated so opening it doesn't re-render the carousel ─────
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
        onClick={e => e.stopPropagation()}
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

// ─── Main component ──────────────────────────────────────────────────────────
export default function OurWork() {
  const [activeTab,  setActiveTab ] = useState('all');
  // Tab-pill animation runs at high priority. The heavy carousel re-filter
  // (changing the doubled array → re-rendering 60+ video DOM nodes → tearing
  // down + recreating the IntersectionObserver) gets deferred via React 18's
  // useTransition so the pill spring lands in its first frame, smooth.
  const [, startTransition] = useTransition();
  const [pendingTab, setPendingTab] = useState('all');
  const [modalSrc,   setModalSrc  ] = useState<string | null>(null);

  // ── Auto-orientation detection ──────────────────────────────────────────
  // Adding a new video should be one line: paste { url, type, brand, label }
  // and forget. We read the real videoWidth/videoHeight from the file as
  // soon as metadata loads, then update the card width to match. The manual
  // `orientation` field on VideoEntry stays supported as an override for
  // first-paint (so the initial card doesn't flash at the wrong size).
  //
  // Stored URL → 'horizontal' | 'vertical' for every clip that has reported.
  // useRef + force-update so reading the map doesn't trigger a re-render
  // until we actually flip an orientation.
  const [detected, setDetected] = useState<Record<string, Orientation>>({});
  const handleVideoMetadata = useCallback((url: string, el: HTMLVideoElement) => {
    if (!el.videoWidth || !el.videoHeight) return;
    const next: Orientation = el.videoWidth >= el.videoHeight ? 'horizontal' : 'vertical';
    setDetected(prev => (prev[url] === next ? prev : { ...prev, [url]: next }));
  }, []);
  // Resolve the orientation to use for a given video:
  //   1. Manual override on the data entry wins (no flash)
  //   2. Otherwise, use the runtime-detected aspect from videoWidth/Height
  //   3. Final fallback: assume vertical (most common content type — keeps
  //      the carousel dense before metadata loads)
  const orientationOf = useCallback(
    (v: VideoEntry): Orientation => v.orientation ?? detected[v.url] ?? 'vertical',
    [detected],
  );

  // Outer clip container — used as IntersectionObserver root so only cards
  // actually visible inside the carousel rect trigger play/pause.
  const trackRef  = useRef<HTMLDivElement>(null);
  // Inner flex row — receives translateX from the RAF loop (GPU composited).
  const innerRef  = useRef<HTMLDivElement>(null);

  const pauseRef    = useRef(false);
  const rafRef      = useRef<number | undefined>(undefined);
  const xOffsetRef  = useRef(0);

  // ── Stable filtered / doubled arrays ──────────────────────────────────────
  // useMemo prevents new array references on every render, which would force
  // video card reconciliation even when nothing actually changed.
  // `pendingTab` lags behind `activeTab` by one transition — it's what the
  // heavy carousel uses for filtering. The pill animation, label color,
  // etc. are driven by `activeTab` and stay snappy.
  const filtered = useMemo(
    () => pendingTab === 'all' ? videos : videos.filter(v => v.type === pendingTab),
    [pendingTab],
  );
  const doubled = useMemo(() => [...filtered, ...filtered], [filtered]);

  // ── IntersectionObserver: play only cards visible inside the track ─────────
  // We use root=trackRef so the carrier div (overflow:hidden) acts as the
  // viewport. Cards translated beyond its edge have 0% intersection and get
  // paused — dramatically cutting GPU/CPU load compared to all-autoplay.
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;

    // Small delay so React has finished painting the cards before we observe.
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const video = entry.target.querySelector<HTMLVideoElement>('video');
            if (!video) return;
            if (entry.isIntersecting && !pauseRef.current) {
              video.play().catch(() => { /* autoplay blocked — silent */ });
            } else {
              video.pause();
            }
          });
        },
        {
          root,
          // Cards need to be at least 20% inside the carrier to start playing.
          // This gives a comfortable lead-in before the card fully enters view.
          threshold: 0.2,
        },
      );

      root.querySelectorAll<HTMLElement>('.vid-card').forEach(card => observer.observe(card));

      (root as HTMLElement & { _vidObserver?: IntersectionObserver })._vidObserver = observer;
    }, 80);

    return () => {
      clearTimeout(timer);
      const obs = (root as HTMLElement & { _vidObserver?: IntersectionObserver })._vidObserver;
      obs?.disconnect();
    };
  // Re-run when the carousel actually swaps in new cards (pendingTab,
  // not activeTab) — that's when the DOM has new .vid-card nodes to observe.
  }, [pendingTab]);

  // Also pause ALL inline videos when modal is open / closed.
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;
    if (modalSrc) {
      root.querySelectorAll<HTMLVideoElement>('video').forEach(v => v.pause());
    } else {
      // Modal closed — re-trigger intersection so visible cards resume.
      const obs = (root as HTMLElement & { _vidObserver?: IntersectionObserver })._vidObserver;
      obs?.disconnect();
      const timer = setTimeout(() => {
        if (!root) return;
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              const video = entry.target.querySelector<HTMLVideoElement>('video');
              if (!video) return;
              if (entry.isIntersecting) video.play().catch(() => {});
              else video.pause();
            });
          },
          { root, threshold: 0.2 },
        );
        root.querySelectorAll<HTMLElement>('.vid-card').forEach(card => observer.observe(card));
        (root as HTMLElement & { _vidObserver?: IntersectionObserver })._vidObserver = observer;
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [modalSrc]);

  // ── RAF auto-scroll ────────────────────────────────────────────────────────
  const startRAF = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const tick = () => {
      if (!pauseRef.current) {
        xOffsetRef.current += SPEED;
        const loopAt = inner.scrollWidth / 2;
        if (loopAt > 0 && xOffsetRef.current >= loopAt) {
          xOffsetRef.current -= loopAt;
        }
        inner.style.transform = `translateX(-${xOffsetRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    // Don't reset position or pause between tab switches — keeps the RAF
    // loop running continuously so the carousel never visibly stops. The
    // doubled array means the loop math is self-correcting at any offset.
    if (!rafRef.current) startRAF();
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    };
  }, [startRAF]);

  // When the card set changes (tab switch), just refresh the loop bounds.
  // No reset, no pause — visual continuity. xOffsetRef is clamped against
  // the new scrollWidth inside the tick so it can't run past the new content.
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const halfWidth = inner.scrollWidth / 2;
    if (halfWidth > 0 && xOffsetRef.current >= halfWidth) {
      xOffsetRef.current = xOffsetRef.current % halfWidth;
    }
  }, [filtered.length]);

  const scrollBy = (dir: number) => {
    pauseRef.current = true;
    xOffsetRef.current = Math.max(0, xOffsetRef.current + dir * (CARD_W_VERTICAL + GAP));
    setTimeout(() => { pauseRef.current = false; }, 1400);
  };

  const openModal = useCallback((src: string) => {
    pauseRef.current = true;
    setModalSrc(src);
  }, []);

  const closeModal = useCallback(() => {
    setModalSrc(null);
    pauseRef.current = false;
  }, []);

  return (
    <section id="work" style={{ padding: '140px 0 100px', scrollMarginTop: '80px', background: '#F2EEE7', overflow: 'hidden' }}>
      <style>{`
        .work-track-outer { overflow: hidden; position: relative; }
        .work-track {
          display: flex;
          gap: ${GAP}px;
          padding: 0 56px;
          will-change: transform;
        }
        .vid-card {
          position: relative; border-radius: 16px; overflow: hidden;
          flex-shrink: 0; height: ${CARD_H}px;
          cursor: none;
          /* Promote each card to its own compositor layer so video
             decode and CSS transitions don't fight the RAF scroll. */
          will-change: transform;
          transform: translateZ(0);
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
          pointer-events: none;
        }
        .vid-card:hover .vid-play { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        .vid-brand {
          position: absolute; top: 10px; left: 10px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.95);
          padding: 3px 9px; border-radius: 6px;
          font-size: 10px; font-weight: 700; color: #0C0C0B;
          z-index: 2; letter-spacing: -0.1px;
          pointer-events: none;
        }
        .vid-tag {
          position: absolute; bottom: 30px; left: 10px;
          background: #E8541A;
          padding: 3px 9px; border-radius: 5px;
          font-size: 9px; font-weight: 800; letter-spacing: 1.5px;
          text-transform: uppercase; color: #fff; z-index: 2;
          opacity: 0; transform: translateY(4px);
          transition: opacity 0.3s, transform 0.3s;
          pointer-events: none;
        }
        .vid-card:hover .vid-tag { opacity: 1; transform: translateY(0); }

        /* Arrow nav */
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
        .work-arrow-left  { left: 12px; }
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
        .tab-btn-label { position: relative; z-index: 1; display: inline-flex; align-items: center; }
        .tab-pill-bg {
          position: absolute; inset: 0;
          background: #0C0C0B;
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(12,12,11,0.22);
          z-index: 0;
          /* Pre-promote to its own compositor layer so the framer-motion
             FLIP animation (transform under the hood) runs on the GPU
             with zero paint cost — pure transform interpolation. */
          will-change: transform;
          transform: translateZ(0);
        }
      `}</style>

      {/* ── Header ── */}
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

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p style={{ color: '#6E6B63', fontSize: '14px', lineHeight: 1.75, margin: '0 0 20px', maxWidth: '270px' }}>
              Cinematic edits, motion graphics, talking-head reels, podcast cuts, and ad creative. Real samples coming as we ship paid client work.
            </p>
            <div className="work-stats" style={{ display: 'flex', gap: '28px' }}>
              {[{ n: '48hrs', l: 'Standard turnaround' }, { n: '6', l: 'Service formats' }].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: 'Inter', fontSize: '22px', fontWeight: 900, letterSpacing: '-1px', color: '#0C0C0B' }}>{s.n}</div>
                  <div style={{ fontSize: '10px', color: '#A8A49B', marginTop: '2px', fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Tabs ── */}
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
                onClick={() => {
                  // Snap the pill instantly (high-priority sync update)
                  setActiveTab(tab.key);
                  // Defer the heavy carousel re-filter so React can land
                  // the pill animation first, then swap content next frame.
                  startTransition(() => setPendingTab(tab.key));
                }}
                data-cursor-hover
              >
                {isActive && (
                  <motion.span
                    layoutId="active-tab-pill"
                    className="tab-pill-bg"
                    // Snappier spring — less mass, more stiffness = lands in
                    // ~180ms instead of the old ~320ms. Reads as instant.
                    transition={{ type: 'spring', stiffness: 700, damping: 38, mass: 0.5 }}
                  />
                )}
                <span className="tab-btn-label">
                  {tab.label}
                  {tab.key !== 'all' && (
                    <span className="tab-count" style={{ marginLeft: '5px', fontSize: '9px', opacity: 0.5, fontWeight: 600 }}>
                      {videos.filter(v => v.type === tab.key).length}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Carousel ── */}
      <div style={{ position: 'relative' }}>
        <button className="work-arrow work-arrow-left" onClick={() => scrollBy(-1)} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2EEE7" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>

        {/* Outer clip container — IntersectionObserver root */}
        <div
          ref={trackRef}
          className="work-track-outer"
          onMouseEnter={() => { pauseRef.current = true; }}
          onMouseLeave={() => { pauseRef.current = false; }}
          onTouchStart={() => { pauseRef.current = true; }}
          onTouchEnd={() => { pauseRef.current = false; }}
        >
          {/* Inner flex row — translated by RAF, never scrolled */}
          <div ref={innerRef} className="work-track">
            {doubled.map((video, i) => {
              // Resolve orientation through manual override → runtime-detected
              // → vertical-fallback so newly-added videos auto-fit their cards.
              const orient = orientationOf(video);
              const previewSrc = previewMp4Src(video.url, orient);
              // Duplicate items (second half) use preload="none" — browser
              // caches the src from the first copy so playback is instant.
              const isFirstCopy = i < filtered.length;
              return (
                <div
                  key={`${video.url}-${i}`}
                  className={`vid-card${orient === 'horizontal' ? ' vid-card-h' : ''}`}
                  style={{ width: `${cardWidth(orient)}px` }}
                  onClick={() => openModal(video.url)}
                >
                  <div className="vid-inner">
                    {previewSrc ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video
                        src={previewSrc}
                        muted
                        loop
                        playsInline
                        // NO autoPlay — IntersectionObserver handles play/pause
                        // based on actual visibility inside the carousel rect.
                        // This keeps concurrent decode threads at ~3 max instead
                        // of all 22 fighting for GPU simultaneously.
                        preload={isFirstCopy ? 'metadata' : 'none'}
                        // Reads videoWidth/videoHeight as soon as the file
                        // header lands → tells the parent to flip the card
                        // size if our manual orientation hint was missing or
                        // wrong. Only fires once per clip.
                        onLoadedMetadata={(e) => handleVideoMetadata(video.url, e.currentTarget)}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#0C0C0B' }}
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, background: '#0C0C0B' }} />
                    )}
                  </div>

                  <div className="vid-overlay" />
                  <div className="vid-play">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0C0C0B" style={{ marginLeft: '3px' }}><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <div className="vid-brand">{video.brand}</div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="work-arrow work-arrow-right" onClick={() => scrollBy(1)} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2EEE7" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* ── Video modal — rendered OUTSIDE the carousel so opening it
           doesn't trigger a re-render / reconciliation of the card list ── */}
      {modalSrc && <VideoModal src={modalSrc} onClose={closeModal} />}

      {/* ── Bottom CTA ── */}
      <motion.div
        className="work-cta-wrap"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ display: 'flex', justifyContent: 'center', marginTop: '48px', gap: '16px', flexWrap: 'wrap', alignItems: 'center', padding: '0 56px' }}
      >
        <button
          type="button"
          onClick={() => (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.()}
          data-cursor-hover
          aria-label="Book a call to see more work"
          style={{ background: '#0C0C0B', color: '#F2EEE7', padding: '14px 32px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, cursor: 'none', transition: 'all 0.3s', border: 'none', fontFamily: 'Inter, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '8px', minHeight: '44px' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8541A'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0C0C0B'; }}
        >
          Book a Call to See More
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </motion.div>

      {/* ── Responsive overrides ── */}
      <style>{`
        @media(max-width:900px) {
          #work { padding: 80px 0 70px !important; }
        }
        /* ── Mobile app-UI tightening ─────────────────────────────
           Goal: section fits ~one viewport on a 375×800 phone.
           Headline shrunk to 44px (was 72px) so the headline + paragraph
           + tab pills + the top of the first work card all fit above the
           fold. Cards shrunk to 180px so 2 fit horizontally pre-scroll.
        ─────────────────────────────────────────────────────────── */
        @media(max-width:640px) {
          #work { padding: 48px 0 44px !important; }
          .work-arrow { display:none !important; }

          .work-tabs { padding: 0 14px !important; margin-bottom: 16px !important; }
          .work-tabs .tab-bar {
            display: flex !important; width: 100% !important;
            max-width: 100% !important; box-sizing: border-box !important;
            padding: 3px !important; gap: 1px !important;
            overflow: hidden !important; border-radius: 10px !important;
          }
          .tab-btn {
            flex: 1 1 0 !important; min-width: 0 !important;
            padding: 6px 2px !important; font-size: 9.5px !important;
            letter-spacing: 0px !important; text-align: center !important;
            white-space: nowrap !important; overflow: hidden !important;
            border-radius: 7px !important;
          }
          .tab-pill-bg { border-radius: 7px !important; }
          .tab-count   { display: none !important; }

          .work-track { padding: 0 16px !important; }
          .vid-card                   { height: 180px !important; }
          .vid-card:not(.vid-card-h)  { width: calc(180px * 9 / 16) !important; }
          .vid-card-h                 { width: calc(180px * 16 / 9) !important; }

          /* ── App-UI: tighter header block ─────────────────────── */
          .work-header { padding: 0 20px !important; margin-bottom: 20px !important; }
          .work-header > div { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .work-header > div > div > div:first-child { margin-bottom: 12px !important; } /* eyebrow margin */
          .work-header h2 { font-size: 44px !important; letter-spacing: -1.6px !important; line-height: 0.95 !important; }
          .work-header p  { max-width: none !important; font-size: 13px !important; line-height: 1.5 !important; margin-top: 12px !important; }
          .work-stats     { display: none !important; }
          .work-cta-wrap  { margin-top: 24px !important; padding: 0 20px !important; }

          .work-modal       { padding: 12px !important; }
          .work-modal-frame {
            width: 100% !important; max-width: 100% !important;
            aspect-ratio: auto !important;
            height: 86vh !important; max-height: 86vh !important;
            border-radius: 14px !important;
          }
        }
        @media(max-width:380px) {
          #work { padding: 40px 0 36px !important; }
          .work-header h2           { font-size: 38px !important; letter-spacing: -1.3px !important; }
          .work-header { margin-bottom: 16px !important; }
          .tab-btn                  { font-size: 8.5px !important; }
          .vid-card                 { height: 168px !important; }
          .vid-card:not(.vid-card-h){ width: calc(168px * 9 / 16) !important; }
          .vid-card-h               { width: calc(168px * 16 / 9) !important; }
        }
      `}</style>
    </section>
  );
}
