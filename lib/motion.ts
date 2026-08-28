/**
 * Motion tokens.
 *
 * WHY THIS EXISTS
 * An audit of the 22 files using framer-motion found the easing was already
 * near-perfectly consistent (50 of 53 uses were the same expo-out curve) but
 * the timing was not: 14+ ad-hoc durations (0.3, 0.32, 0.35, 0.4, 0.42, 0.45,
 * 0.5, 0.55, 0.6, 0.7, 0.8 ...) and 8 different delays, all chosen per-file.
 *
 * That is the thing that reads as "assembled" rather than "designed". When two
 * elements a reader sees together animate over 0.42s and 0.55s for no reason,
 * the eye registers it as sloppiness even when nobody can name what is wrong.
 * A small fixed scale is what makes motion feel intentional, and intentional is
 * what reads as premium.
 *
 * HOW TO USE
 *   import { DUR, EASE, fadeUp, viewportOnce, stagger } from '@/lib/motion';
 *
 *   <motion.div {...fadeUp()} />                 // standard reveal
 *   <motion.div {...fadeUp({ delay: DELAY.s })} />
 *   <motion.div transition={{ duration: DUR.md, ease: EASE.out }} />
 *
 * RULE: never hand-write a duration or a cubic-bezier in a component again.
 * If a value here does not fit, the scale is wrong, so change it here.
 */

/**
 * Easing.
 *
 * `out` is the house curve, an expo-out. It was already used in ~94% of the
 * codebase, so it is the standard rather than a new opinion. Motion starts
 * fast and settles slowly, which is what makes an element feel like it was
 * placed rather than dragged.
 *
 * Typed as mutable 4-tuples on purpose. `as const` would make them
 * `readonly [number, number, number, number]`, which framer-motion's `ease`
 * prop rejects. This exact mistake cost a debugging session earlier in this
 * project, so it is written down here.
 */
type Cubic = [number, number, number, number];

export const EASE: Record<'out' | 'inOut' | 'in', Cubic> = {
  /** Expo-out. The default for anything entering the screen. */
  out: [0.16, 1, 0.3, 1],
  /** Symmetric. For things that move between two on-screen states. */
  inOut: [0.65, 0, 0.35, 1],
  /** Accelerating. For things leaving the screen. */
  in: [0.5, 0, 0.75, 0],
};

/** CSS-string equivalents, so `<style>` blocks and JS animations agree. */
export const EASE_CSS = {
  out: `cubic-bezier(${EASE.out.join(',')})`,
  inOut: `cubic-bezier(${EASE.inOut.join(',')})`,
  in: `cubic-bezier(${EASE.in.join(',')})`,
} as const;

/**
 * Duration scale, in seconds.
 *
 * Five steps, roughly a 1.4x ratio, same idea as a type scale. Anything that
 * does not fit one of these is almost always a value someone nudged by eye.
 *
 *   xs  hover states, colour changes, small taps
 *   sm  buttons, chips, icon transitions
 *   md  the workhorse: most section and card reveals
 *   lg  hero elements, large panels, anything the eye tracks a long way
 *   xl  deliberate, cinematic. Use sparingly.
 */
export const DUR = {
  xs: 0.2,
  sm: 0.35,
  md: 0.5,
  lg: 0.7,
  xl: 1.0,
} as const;

/**
 * Delay scale, for sequencing a small group of elements by hand.
 * For lists, prefer `stagger()` below, which does the arithmetic for you.
 */
export const DELAY = {
  none: 0,
  xs: 0.06,
  sm: 0.12,
  md: 0.2,
  lg: 0.32,
} as const;

/**
 * Travel distance for entrance animations, in pixels.
 *
 * The audit found 8 different y-offsets (8, 10, 12, 14, 16, 20, 24, 30) doing
 * the same job. Three is enough: the distance should scale with how big the
 * thing is, not be picked per component.
 */
export const RISE = {
  /** Inline elements, list rows, chips. */
  sm: 12,
  /** Cards, paragraphs, most content blocks. */
  md: 20,
  /** Section headers, hero elements. */
  lg: 32,
} as const;

/**
 * The standard scroll-reveal viewport config.
 *
 * `once: true` everywhere. Re-animating on every scroll-past is the single
 * most common way a site starts feeling cheap, and the codebase already
 * agreed on this (61 of 62 uses).
 *
 * The negative margin means an element starts animating slightly BEFORE it
 * reaches the viewport edge, so by the time the reader's eye arrives it has
 * already begun. Revealing exactly at the boundary is what causes the
 * "everything pops in late" feeling.
 */
export const viewportOnce = { once: true, margin: '-80px' } as const;

/**
 * Standard scroll reveal. Covers the large majority of the site's animations.
 *
 * Returns the whole prop set, so a caller writes `{...fadeUp()}` rather than
 * repeating initial/whileInView/viewport/transition four lines at a time.
 */
export function fadeUp(opts?: {
  /** Travel distance. Defaults to RISE.md. */
  y?: number;
  /** Seconds. Defaults to DUR.lg. */
  duration?: number;
  /** Seconds. Defaults to none. */
  delay?: number;
}) {
  const { y = RISE.md, duration = DUR.lg, delay = DELAY.none } = opts ?? {};
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: viewportOnce,
    transition: { duration, delay, ease: EASE.out },
  };
}

/** Same as fadeUp but plays on mount rather than on scroll, for above-the-fold content. */
export function fadeUpOnMount(opts?: { y?: number; duration?: number; delay?: number }) {
  const { y = RISE.md, duration = DUR.lg, delay = DELAY.none } = opts ?? {};
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease: EASE.out },
  };
}

/** Opacity-only reveal, for when movement would be distracting (images, video, large media). */
export function fadeIn(opts?: { duration?: number; delay?: number }) {
  const { duration = DUR.md, delay = DELAY.none } = opts ?? {};
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: viewportOnce,
    transition: { duration, delay, ease: EASE.out },
  };
}

/**
 * Sequences a list. `stagger(i)` gives item `i` its delay.
 *
 * Capped deliberately: without a cap, the 12th card in a grid waits nearly a
 * second after the first, which reads as the page being slow rather than as a
 * choreographed reveal. Past the cap everything lands together, which nobody
 * notices, whereas the wait is very noticeable.
 */
export function stagger(index: number, step = DELAY.xs, max = 6) {
  return Math.min(index, max) * step;
}

/**
 * Parent/child variants for when a container should orchestrate its children
 * rather than each child carrying its own delay.
 */
export const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: DELAY.xs, delayChildren: DELAY.xs } },
} as const;

export const listItem = {
  hidden: { opacity: 0, y: RISE.sm },
  show: { opacity: 1, y: 0, transition: { duration: DUR.md, ease: EASE.out } },
} as const;

/**
 * Standard hover lift for interactive cards and buttons.
 *
 * Small on purpose. A 1 to 2px rise plus a shadow change is the difference
 * between "this responds to me" and "this is a toy". Large hover transforms
 * are the most common tell of an amateur site.
 */
export const hoverLift = {
  whileHover: { y: -2 },
  whileTap: { y: 0 },
  transition: { duration: DUR.xs, ease: EASE.out },
} as const;
