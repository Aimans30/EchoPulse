'use client';

import type { ReactNode } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { DUR, EASE, RISE, viewportOnce } from '@/lib/motion';

const TAGS = {
  div: motion.div,
  article: motion.article,
  li: motion.li,
} as const;

/**
 * One-time rise-in for a block on /pricing, with an optional hover lift for
 * cards. Transform and opacity only.
 *
 * reducedMotion="user": when the visitor asks for reduced motion, framer drops
 * every transform (no rise, no lift) and keeps only a short opacity fade. The
 * server markup is the same either way, so there is no hydration mismatch.
 *
 * whileHover ignores touch pointers, so a tap on a phone never leaves a card
 * stuck half-lifted.
 */
export default function Rise({
  as = 'div',
  className,
  id,
  delay = 0,
  lift = false,
  labelledBy,
  children,
}: {
  as?: keyof typeof TAGS;
  className?: string;
  id?: string;
  delay?: number;
  lift?: boolean;
  labelledBy?: string;
  children: ReactNode;
}) {
  const Tag = TAGS[as];
  return (
    <MotionConfig reducedMotion="user">
      <Tag
        className={className}
        id={id}
        aria-labelledby={labelledBy}
        initial={{ opacity: 0, y: RISE.md }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: DUR.lg, delay, ease: EASE.out }}
        whileHover={lift ? { y: -4, transition: { duration: DUR.xs, ease: EASE.out } } : undefined}
      >
        {children}
      </Tag>
    </MotionConfig>
  );
}
