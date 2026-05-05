'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Loader({ onDone }: { onDone: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: onDone,
        });
      },
    });

    tl.to(barRef.current, { width: '100%', duration: 0.9, ease: 'power2.inOut' })
      .to(logoRef.current, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, '-=0.1');
  }, [onDone]);

  return (
    <div
      ref={loaderRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0C0C0B',
        zIndex: 8000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={logoRef}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '36px',
          fontWeight: 800,
          color: '#F2EEE7',
          letterSpacing: '-1px',
        }}
      >
        Echo<span style={{ color: '#E8541A' }}>Pulse</span>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: '#E8541A',
          width: 0,
        }}
        ref={barRef}
      />
    </div>
  );
}
