'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from './motion';

/**
 * A very small scroll parallax for screenshots: the content drifts at most
 * `range` percent of its own height as it passes through the viewport.
 * Transform only. Off under reduced motion.
 */
export default function Parallax({
  children,
  range = 3,
  className,
}: {
  children: React.ReactNode;
  range?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Not framer's useReducedMotion: that reads the media query during the
  // first client render and so mismatches the server HTML on hydration.
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${range}%`, `${-range}%`]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
