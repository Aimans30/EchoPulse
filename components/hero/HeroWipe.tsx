'use client';

import { useEffect, useRef } from 'react';
import { heroSegments, heroSegmentSrc, type HeroSegment } from '@/lib/videos';

/**
 * "Raw to ready": one vertical frame that wipes from the raw clip to the
 * finished edit, for a founder reel, a podcast clip and a listing reel in turn.
 *
 * One <video> per segment, and the raw side is a <canvas> that copies the
 * current video frame, so raw and edited are always frame-locked and no clip
 * is ever decoded twice. At most two videos play at once (the current one and
 * the next during its 0.6 s hand-off); the previous one is paused.
 *
 * The timeline is read off the playing video's own clock rather than a timer,
 * so the wipe, labels and lower thirds never drift from the picture and the
 * code never has to seek a playing video (which is what causes visible jumps).
 * If the next clip is not ready in time the edited state simply holds.
 *
 * Each 4 s slot: 0 to 0.5 raw hold, 0.5 to 1.7 wipe, 1.7 to 3.4 edited hold
 * with lower third (and captions on the listing), 3.4 to 4.0 the next clip
 * fades in, already raw, over the finished edit.
 *
 * Modes (chosen by HeroStage): `full` plays all three, `single` only the
 * founder clip (narrow phones, 3G), `static` and `pending` render no video at
 * all, only the still. Reduced motion and `static` show the finished state in
 * CSS (see heroStyles.ts).
 */

export type WipeMode = 'pending' | 'full' | 'single' | 'static';

type Slot = {
  seg: HeroSegment;
  type: string;
  l3a: string;
  l3b: string;
  /** Captions: [from ms, to ms, plain word(s), highlighted word(s)]. */
  caps?: [number, number, string, string][];
};

const seg = (id: HeroSegment['id']) => heroSegments.find((s) => s.id === id)!;

const SLOTS: Slot[] = [
  { seg: seg('founder'), type: 'Founder reel', l3a: 'Your name', l3b: 'Founder, your company' },
  { seg: seg('podcast'), type: 'Podcast clip', l3a: 'Your show', l3b: 'Episode clip, your guest' },
  {
    seg: seg('listing'), type: 'Listing reel', l3a: 'Listing tour', l3b: 'Your name, your brokerage',
    caps: [[1900, 2650, 'Step', 'inside'], [2650, 3380, 'Room to', 'breathe']],
  },
];

const SLOT = 4000; // ms per clip
const XS = 3400; // the next clip starts its cross-fade here
const LEAD = 600; // ms of each clip played during the previous slot's hand-off

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

const STILL = SLOTS[0].seg;
const STILL_SRC = heroSegmentSrc(STILL, 'still', 720);
const STILL_SRCSET = `${heroSegmentSrc(STILL, 'still', 400)} 400w, ${STILL_SRC} 720w`;

export default function HeroWipe({
  mode,
  active,
  onLive,
}: {
  mode: WipeMode;
  /** On screen and tab visible. */
  active: boolean;
  /** Called once, when the first clip is on screen and playing. */
  onLive?: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const vidRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const onLiveRef = useRef(onLive);
  useEffect(() => {
    onLiveRef.current = onLive;
  }, [onLive]);

  const playing = mode === 'full' || mode === 'single';
  const slots = mode === 'single' ? SLOTS.slice(0, 1) : SLOTS;
  const n = slots.length;

  // Timeline state lives in a ref: it changes every frame and React never
  // needs to see it.
  const st = useRef({ k: 0, crossing: false, live: false, w: 360, h: 640, dpr: 1 });

  // ── loading: clip 1 right after hydration, the rest once it can play through ──
  useEffect(() => {
    if (!playing) return;
    const vids = vidRefs.current.slice(0, n) as HTMLVideoElement[];
    vids.forEach((v) => {
      v.muted = true;
      v.playsInline = true;
      v.loop = false;
    });
    vids[0].preload = 'auto';
    vids[0].src = heroSegmentSrc(slots[0].seg);
    if (n === 1) return;

    let i = 1;
    let idleId: number | undefined;
    const loadNext = () => {
      if (i >= n) return;
      const v = vids[i];
      v.preload = 'auto';
      v.src = heroSegmentSrc(slots[i].seg);
      i++;
      v.addEventListener('canplaythrough', loadNext, { once: true });
    };
    let kicked = false;
    const kick = () => {
      if (kicked) return;
      kicked = true;
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(loadNext, { timeout: 1500 });
      else loadNext();
    };
    vids[0].addEventListener('canplaythrough', kick, { once: true });
    // Some browsers never fire canplaythrough for a short muted clip.
    const timer = setTimeout(kick, 4000);
    return () => {
      vids[0].removeEventListener('canplaythrough', kick);
      clearTimeout(timer);
      const w = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      vids.forEach((v) => v.removeEventListener('canplaythrough', loadNext));
    };
    // slots is derived from mode; n covers it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, n]);

  // ── canvas size follows the frame ──
  useEffect(() => {
    if (!playing) return;
    const root = rootRef.current!;
    const cv = root.querySelector<HTMLCanvasElement>('canvas')!;
    const size = () => {
      const s = st.current;
      s.w = root.clientWidth || 360;
      s.h = root.clientHeight || 640;
      s.dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(s.w * s.dpr);
      cv.height = Math.round(s.h * s.dpr);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(root);
    return () => ro.disconnect();
  }, [playing]);

  // ── the loop: one rAF, only while on screen and the tab is visible ──
  useEffect(() => {
    if (!playing) return;
    const root = rootRef.current!;
    const vids = vidRefs.current.slice(0, n) as HTMLVideoElement[];
    const s = st.current;
    if (s.k >= n) {
      s.k = 0;
      s.crossing = false;
    }

    if (!active) {
      vids.forEach((v) => v.pause());
      return;
    }

    const q = <E extends Element>(sel: string) => [...root.querySelectorAll<E>(sel)];
    const ctx = root.querySelector('canvas')!.getContext('2d');
    const rawO = root.querySelector<HTMLElement>('[data-raw-o]')!;
    const rawI = root.querySelector<HTMLElement>('[data-raw-i]')!;
    const hwrap = root.querySelector<HTMLElement>('[data-hwrap]')!;
    const handle = root.querySelector<HTMLElement>('[data-handle]')!;
    const types = q<HTMLElement>('[data-type]');
    const stR = root.querySelector<HTMLElement>('[data-state="r"]')!;
    const stE = root.querySelector<HTMLElement>('[data-state="e"]')!;
    const l3s = q<HTMLElement>('[data-l3]');
    const caps = q<HTMLElement>('[data-cap]');
    const bars = q<HTMLElement>('[data-bar]');

    const show = (k: number) => vids.forEach((v, i) => (v.style.opacity = i === k ? '1' : '0'));
    show(s.k);

    const play = (v: HTMLVideoElement) => {
      if (v.paused && v.src) v.play().catch(() => {});
    };
    play(vids[s.k]);
    if (s.crossing && n > 1) play(vids[(s.k + 1) % n]);

    const draw = (v: HTMLVideoElement) => {
      if (!ctx || v.readyState < 2 || !v.videoWidth) return false;
      const { w, h, dpr } = s;
      const sc = Math.max(w / v.videoWidth, h / v.videoHeight);
      const dw = v.videoWidth * sc;
      const dh = v.videoHeight * sc;
      ctx.drawImage(v, ((w - dw) / 2) * dpr, ((h - dh) / 2) * dpr, dw * dpr, dh * dpr);
      return true;
    };

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      let v = vids[s.k];
      let t = 0; // ms into the current slot

      if (!s.crossing) {
        t = Math.max(0, v.currentTime * 1000 - LEAD);
        if (t >= XS) {
          if (n === 1) s.crossing = true;
          else {
            const nv = vids[(s.k + 1) % n];
            if (nv.readyState >= 3) {
              nv.currentTime = 0;
              play(nv);
              s.crossing = true;
            } else t = XS - 1; // next clip not ready: hold the finished edit
          }
        } else if (v.paused && !v.ended) play(v);
      }
      if (s.crossing) {
        if (n === 1) {
          t = v.currentTime * 1000 - LEAD;
          if (v.ended || t >= SLOT) {
            // Same clip again: the cut happens under the fully faded-in raw layer.
            v.currentTime = LEAD / 1000;
            play(v);
            s.crossing = false;
            t = 0;
          }
        } else {
          const nx = (s.k + 1) % n;
          const nv = vids[nx];
          t = XS + nv.currentTime * 1000;
          if (t >= SLOT) {
            v.pause();
            s.k = nx;
            s.crossing = false;
            show(nx);
            v = nv;
            t = Math.max(0, nv.currentTime * 1000 - LEAD);
          }
        }
      }

      const k = s.k;
      const nx = (k + 1) % n;
      const crossing = s.crossing;

      // wipe position p (0 raw, 1 edited) and raw layer opacity
      let p: number;
      let ro = 1;
      if (crossing) {
        p = 0;
        ro = 0.5 - 0.5 * Math.cos((Math.PI * clamp((t - XS) / (SLOT - XS))));
      } else if (t < 500) p = 0;
      else if (t < 1700) p = easeInOut((t - 500) / 1200);
      else p = 1;

      const pc = (p * 100).toFixed(3);
      rawO.style.transform = `translateX(${pc}%)`;
      rawI.style.transform = `translateX(-${pc}%)`;
      rawO.style.opacity = ro.toFixed(3);
      hwrap.style.transform = `translateX(${pc}%)`;
      if (p < 1 && ro > 0) {
        const drawn = draw(crossing ? vids[nx] : v);
        if (drawn && !s.live) {
          s.live = true;
          root.setAttribute('data-live', '');
          onLiveRef.current?.();
        }
      }
      const ho = crossing ? 0 : t < 380 ? 0 : t < 520 ? (t - 380) / 140 : t < 1700 ? 1 : t < 1860 ? 1 - (t - 1700) / 160 : 0;
      handle.style.opacity = ho.toFixed(3);

      const rawish = (crossing && t >= XS + 150) || p < 0.5;
      stR.style.opacity = rawish ? '1' : '0';
      stE.style.opacity = rawish ? '0' : '1';
      const ti = crossing && t >= XS + 150 ? nx : k;
      types.forEach((el, i) => el.toggleAttribute('data-on', i === ti));
      bars.forEach((b, i) => {
        const f = i < k ? 1 : i === k ? Math.min(1, t / SLOT) : 0;
        b.style.transform = `scaleX(${f.toFixed(4)})`;
      });
      l3s.forEach((el, i) => {
        const a = i === k ? clamp((t - 1850) / 380) * (1 - clamp((t - 3200) / 220)) : 0;
        el.style.opacity = a.toFixed(3);
        el.style.transform = `translateY(${((1 - easeOut(a)) * 12).toFixed(2)}px)`;
      });
      caps.forEach((el) => {
        const si = Number(el.dataset.slot);
        const c = slots[si]?.caps?.[Number(el.dataset.cap)];
        let a = 0;
        if (c && si === k && t >= c[0] && t < c[1]) a = Math.min(clamp((t - c[0]) / 180), clamp((c[1] - t) / 160));
        el.style.opacity = a.toFixed(3);
        el.style.transform = `scale(${(0.9 + 0.1 * easeOut(a)).toFixed(3)})`;
      });
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      vids.forEach((v) => v.pause());
    };
    // slots is derived from mode; n covers it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, active, n]);

  return (
    <div className="hs-wipe" ref={rootRef}>
      <div className="hs-ed">
        {playing &&
          slots.map((s, i) => (
            <video
              key={s.seg.id}
              className="hs-video"
              ref={(el) => {
                vidRefs.current[i] = el;
              }}
              muted
              playsInline
              preload="none"
              disablePictureInPicture
              disableRemotePlayback
            />
          ))}
        {/* LCP image. The same URL is reused by the raw layer, so it is fetched once. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hs-ph"
          src={STILL_SRC}
          srcSet={STILL_SRCSET}
          sizes="360px"
          width={360}
          height={640}
          alt="Founder talking to camera in a vertical reel edited by EchoPulse Media"
          fetchPriority="high"
          loading="eager"
        />
        <div className="hs-grade" />
        {slots.map((s, i) =>
          (s.caps ?? []).map(([, , a, b], j) => (
            <div key={`${i}-${j}`} className="hs-cap" data-cap={j} data-slot={i}>
              <span>
                {a}
                <b>{b}</b>
              </span>
            </div>
          )),
        )}
        {slots.map((s, i) => (
          <div key={s.seg.id} className="hs-l3" data-l3 data-slot={i}>
            <i />
            <span>
              <strong>{s.l3a}</strong>
              <small>{s.l3b}</small>
            </span>
          </div>
        ))}
      </div>
      <div className="hs-rawO" data-raw-o>
        <div className="hs-rawI" data-raw-i>
          {playing && <canvas className="hs-canvas" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hs-ph" src={STILL_SRC} srcSet={STILL_SRCSET} sizes="360px" width={360} height={640} alt="Still from a founder reel edited by EchoPulse Media" />
          <div className="hs-guides">
            <i />
            <i />
            <i />
            <i />
          </div>
          <span className="hs-rec">
            <b />
            Raw clip
          </span>
        </div>
      </div>
      <div className="hs-hwrap" data-hwrap>
        <div className="hs-handle" data-handle>
          <div className="hs-knob">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0C0C0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="hs-top">
        <div className="hs-bars">
          {slots.map((s) => (
            <span key={s.seg.id}>
              <i data-bar />
            </span>
          ))}
        </div>
        <div className="hs-row">
          <div className="hs-type">
            {slots.map((s, i) => (
              <span key={s.seg.id} data-type data-on={i === 0 ? '' : undefined}>
                {s.type}
              </span>
            ))}
          </div>
          <div className="hs-state">
            <span className="r" data-state="r">Raw</span>
            <span className="e" data-state="e">Edited</span>
          </div>
        </div>
      </div>
    </div>
  );
}
