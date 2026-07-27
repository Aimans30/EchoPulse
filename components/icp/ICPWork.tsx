'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { previewMp4Src, type Orientation, type VideoEntry } from '@/lib/videos';

// Card sizing (mirrors OurWork proportions, slightly smaller for the ICP rail).
const CARD_H = 360;
const CARD_W_VERTICAL = 203; // CARD_H * 9/16
const CARD_W_HORIZ = 640; // CARD_H * 16/9
const GAP = 14;
const SPEED = 0.5; // px / frame

const cardWidth = (o?: Orientation) => (o === 'horizontal' ? CARD_W_HORIZ : CARD_W_VERTICAL);

function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="icp-vid-modal" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100001, padding: 24 }} onClick={onClose} role="dialog" aria-modal="true" aria-label="Work sample video">
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(1100px, 95vw)', aspectRatio: '16/9', background: '#000', borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', position: 'relative' }}>
        {/* 44px, not 34px: on a phone this sits over moving video and is the
            only way out of a full-screen overlay. */}
        <button type="button" onClick={onClose} aria-label="Close video" style={{ position: 'absolute', top: 12, right: 12, width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 22, lineHeight: 1, cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation' }}>×</button>
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

/**
 * ICPWork — the per-segment portfolio rail. Small enough sets are centered and
 * frozen; larger sets auto-scroll as a seamless marquee. Client island (needs
 * window + RAF); the section heading around it stays server-rendered.
 */
export default function ICPWork({ videos, accent }: { videos: VideoEntry[]; accent: string }) {
  const [modalSrc, setModalSrc] = useState<string | null>(null);
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

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef(false);
  const rafRef = useRef<number | undefined>(undefined);
  const xOffsetRef = useRef(0);

  const [scrolls, setScrolls] = useState(false);
  const scrollsRef = useRef(false);
  useEffect(() => { scrollsRef.current = scrolls; }, [scrolls]);

  /**
   * On a touchscreen the marquee is worse than useless. The outer wrapper is
   * `overflow: hidden`, so a phone user cannot swipe the rail: the only way to
   * reach card five is to sit and wait for the auto-scroll to bring it round,
   * while a requestAnimationFrame transform runs every single frame of the
   * session on the device with the smallest battery. Native horizontal scroll
   * does the same job with momentum, is what a thumb expects, and costs zero
   * frames when nobody is touching it. Desktop keeps the marquee unchanged.
   */
  const [swipeRail, setSwipeRail] = useState(false);
  useEffect(() => {
    setSwipeRail(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (swipeRail) {
      setScrolls(false);
      // The marquee may have applied a translate during the first frame,
      // before the pointer test resolved. Clear it or the swipeable rail
      // starts a few pixels off its origin.
      xOffsetRef.current = 0;
      if (innerRef.current) innerRef.current.style.transform = '';
      return;
    }
    const measure = () => {
      const outer = outerRef.current;
      if (!outer) return;
      const oneSet = videos.reduce((sum, v) => sum + cardWidth(orientationOf(v)) + GAP, 0) + 112;
      const willScroll = oneSet >= outer.clientWidth;
      setScrolls(willScroll);
      if (!willScroll) xOffsetRef.current = 0;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [videos, orientationOf, swipeRail]);

  useEffect(() => {
    if (swipeRail) return;
    const inner = innerRef.current;
    if (!inner) return;
    const tick = () => {
      if (!pauseRef.current && scrollsRef.current) {
        xOffsetRef.current += SPEED;
        const loopAt = inner.scrollWidth / 2;
        if (loopAt > 0 && xOffsetRef.current >= loopAt) xOffsetRef.current -= loopAt;
        inner.style.transform = `translateX(-${xOffsetRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    };
  }, [scrolls, swipeRail]);

  const railVideos = scrolls ? [...videos, ...videos] : videos;
  const openModal = useCallback((src: string) => { pauseRef.current = true; setModalSrc(src); }, []);
  const closeModal = useCallback(() => { setModalSrc(null); pauseRef.current = false; }, []);

  return (
    <>
      <div
        ref={outerRef}
        className="icp-rail-outer"
        style={
          swipeRail
            ? { overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', overscrollBehaviorX: 'contain' }
            : { overflow: 'hidden' }
        }
        onMouseEnter={() => { pauseRef.current = true; }}
        onMouseLeave={() => { if (!modalSrc) pauseRef.current = false; }}
        onTouchStart={() => { pauseRef.current = true; }}
        onTouchEnd={() => { if (!modalSrc) pauseRef.current = false; }}
      >
        <div
          ref={innerRef}
          className="icp-rail"
          style={{
            display: 'flex',
            gap: GAP,
            padding: '0 56px 8px',
            // Centring a flex row that overflows makes the left-hand overflow
            // physically unreachable in a scroll container, so a swipeable rail
            // must start at flex-start even when the cards would have fitted.
            justifyContent: scrolls || swipeRail ? 'flex-start' : 'center',
            willChange: swipeRail ? 'auto' : 'transform',
          }}
        >
          {railVideos.map((video, i) => {
            const orient = orientationOf(video);
            const previewSrc = previewMp4Src(video.url, orient);
            return (
              <div
                key={`${video.url}-${i}`}
                className="icp-vid-card"
                style={{ width: cardWidth(orient), height: CARD_H, position: 'relative', flexShrink: 0, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 8px 30px rgba(12,12,11,0.10)' }}
                onClick={() => openModal(video.url)}
                data-cursor-hover
              >
                {previewSrc ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video src={previewSrc} muted loop playsInline autoPlay preload="metadata" onLoadedMetadata={(e) => handleMeta(video.url, e.currentTarget)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#0C0C0B' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: '#0C0C0B' }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, color: '#0C0C0B', pointerEvents: 'none' }}>
                  {video.brand}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <AnimatePresence>
        {modalSrc && <VideoModal src={modalSrc} onClose={closeModal} />}
      </AnimatePresence>
      <style>{`
        /* Only where the custom dot cursor actually mounts. */
        @media (hover: hover) and (pointer: fine) {
          .icp-vid-card { cursor: none; }
        }
        /* A scrollbar under an auto-height video rail would sit on top of the
           last card on desktop-class touch devices. Momentum scrolling still
           works, and the partially visible next card is the affordance. */
        .icp-rail-outer::-webkit-scrollbar { display: none; }
        @media (max-width: 640px) {
          .icp-rail { padding-left: 18px !important; padding-right: 18px !important; }
          /* globals.css pins EVERY open dialog to \`width: min(95vw, 420px)\`
             and a 9/14 aspect-ratio on phones. That rule was written for the
             booking modal but catches this fixed inset:0 video overlay too,
             leaving a strip of the page showing down one side. Three
             attributes out-specify its two. */
          .icp-vid-modal[role="dialog"][aria-modal="true"] {
            width: 100% !important;
            max-width: none !important;
            aspect-ratio: auto !important;
          }
        }
      `}</style>
      {/* accent kept referenced for future themed play buttons */}
      <span aria-hidden="true" data-accent={accent} style={{ display: 'none' }} />
    </>
  );
}
