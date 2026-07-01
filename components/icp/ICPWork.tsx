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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100001, padding: 24 }} onClick={onClose} role="dialog" aria-modal="true" aria-label="Work sample video">
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(1100px, 95vw)', aspectRatio: '16/9', background: '#000', borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', position: 'relative' }}>
        <button type="button" onClick={onClose} aria-label="Close video" style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 18, cursor: 'pointer', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
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

  useEffect(() => {
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
  }, [videos, orientationOf]);

  useEffect(() => {
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
  }, [scrolls]);

  const railVideos = scrolls ? [...videos, ...videos] : videos;
  const openModal = useCallback((src: string) => { pauseRef.current = true; setModalSrc(src); }, []);
  const closeModal = useCallback(() => { setModalSrc(null); pauseRef.current = false; }, []);

  return (
    <>
      <div
        ref={outerRef}
        className="icp-rail-outer"
        style={{ overflow: 'hidden' }}
        onMouseEnter={() => { pauseRef.current = true; }}
        onMouseLeave={() => { if (!modalSrc) pauseRef.current = false; }}
        onTouchStart={() => { pauseRef.current = true; }}
        onTouchEnd={() => { if (!modalSrc) pauseRef.current = false; }}
      >
        <div
          ref={innerRef}
          className="icp-rail"
          style={{ display: 'flex', gap: GAP, padding: '0 56px 8px', justifyContent: scrolls ? 'flex-start' : 'center', willChange: 'transform' }}
        >
          {railVideos.map((video, i) => {
            const orient = orientationOf(video);
            const previewSrc = previewMp4Src(video.url, orient);
            return (
              <div
                key={`${video.url}-${i}`}
                className="icp-vid-card"
                style={{ width: cardWidth(orient), height: CARD_H, position: 'relative', flexShrink: 0, borderRadius: 16, overflow: 'hidden', cursor: 'none', boxShadow: '0 8px 30px rgba(12,12,11,0.10)' }}
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
        @media (max-width: 640px) {
          .icp-rail { padding-left: 18px !important; padding-right: 18px !important; }
        }
      `}</style>
      {/* accent kept referenced for future themed play buttons */}
      <span aria-hidden="true" data-accent={accent} style={{ display: 'none' }} />
    </>
  );
}
