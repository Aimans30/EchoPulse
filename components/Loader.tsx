'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Loader({ onDone }: { onDone: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const letters = wordRef.current?.querySelectorAll('.l');
    if (!letters || !letters.length) return;

    const tl = gsap.timeline({
      onComplete: () => {
        const exit = gsap.timeline({
          onComplete: onDone,
        });
        exit.to(letters, {
          y: -16,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 0.5,
          stagger: 0.025,
          ease: 'power3.in',
        }, 0)
        .to(loaderRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        }, 0.2);
      },
    });

    // Letter blur reveal
    tl.fromTo(letters,
      { y: 28, opacity: 0, filter: 'blur(10px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.85,
        stagger: 0.045,
        ease: 'power3.out',
      }
    )
    // Progress bar fills while letters are settled
    .to(barRef.current, { width: '100%', duration: 0.9, ease: 'power2.inOut' }, '-=0.4');

    return () => {
      tl.kill();
    };
  }, [onDone]);

  const letters = 'EchoPulse'.split('');

  return (
    <div
      ref={loaderRef}
      data-loader="true"
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
        ref={wordRef}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '36px',
          fontWeight: 800,
          letterSpacing: '-1px',
          color: '#F2EEE7',
          display: 'flex',
          willChange: 'transform, opacity, filter',
        }}
      >
        {letters.map((char, i) => {
          const isOrange = i >= 4;
          return (
            <span
              key={i}
              className="l"
              style={{
                display: 'inline-block',
                color: isOrange ? '#E8541A' : '#F2EEE7',
                willChange: 'transform, opacity, filter',
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
      <div
        ref={barRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: '#E8541A',
          width: 0,
        }}
      />
    </div>
  );
}
