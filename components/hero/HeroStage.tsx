'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import HeroWipe, { type WipeMode } from './HeroWipe';
import PipelineCard from './PipelineCard';
import ResultCard from './ResultCard';
import { HERO_STAGE_CSS } from './heroStyles';

/**
 * Homepage hero graphic: the raw-to-ready frame, the weekly pipeline and the
 * MagicBNB result. Desktop lays it out as a fixed 600 x 640 stage scaled to
 * the column; below 960px it stacks (frame up to 360px wide, pipeline as a
 * horizontal rail, MagicBNB as a chip). All of that is CSS (heroStyles.ts).
 *
 * This component decides how much to play:
 *   static  reduced motion, Save-Data, or a 2G connection: the finished state,
 *           no video at all
 *   single  under 400px wide or on 3G: only the founder clip
 *   full    all three clips
 * and pauses everything while the hero is off screen or the tab is hidden.
 */

type NetInfo = { saveData?: boolean; effectiveType?: string; addEventListener?: (t: string, cb: () => void) => void; removeEventListener?: (t: string, cb: () => void) => void };
const conn = (): NetInfo | undefined => (navigator as Navigator & { connection?: NetInfo }).connection;

const RM = '(prefers-reduced-motion: reduce)';
const NARROW = '(max-width: 399.98px)';

function getMode(): WipeMode {
  const c = conn();
  if (window.matchMedia(RM).matches || c?.saveData || /(^|-)2g$/.test(c?.effectiveType ?? '')) return 'static';
  if (window.matchMedia(NARROW).matches || c?.effectiveType === '3g') return 'single';
  return 'full';
}

function subscribe(cb: () => void) {
  const mqs = [window.matchMedia(RM), window.matchMedia(NARROW)];
  mqs.forEach((m) => m.addEventListener('change', cb));
  const c = conn();
  c?.addEventListener?.('change', cb);
  return () => {
    mqs.forEach((m) => m.removeEventListener('change', cb));
    c?.removeEventListener?.('change', cb);
  };
}

export default function HeroStage() {
  const mode = useSyncExternalStore<WipeMode>(subscribe, getMode, () => 'pending');
  const wrapRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = wrapRef.current!;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    const vis = () => setTabVisible(document.visibilityState === 'visible');
    vis();
    document.addEventListener('visibilitychange', vis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  const active = onScreen && tabVisible;
  const onLive = useCallback(() => setLive(true), []);
  const animate = mode === 'full' || mode === 'single';

  return (
    <div className="hs-wrap" ref={wrapRef} data-static={mode === 'static' ? '' : undefined} aria-hidden="true">
      <style>{HERO_STAGE_CSS}</style>
      <div className="hs-stage" data-run={animate && live && active ? '' : undefined}>
        <div className="hs-frame">
          <HeroWipe mode={mode} active={active} onLive={onLive} />
        </div>
        <div className="hs-side">
          <PipelineCard />
          <ResultCard />
        </div>
      </div>
    </div>
  );
}
