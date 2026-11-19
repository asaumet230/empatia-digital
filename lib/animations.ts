import type { Transition, Variants } from "framer-motion";

/** Shared easing curves — keep motion consistent across sections. */
export const EASE = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuint: [0.83, 0, 0.17, 1],
  outQuart: [0.25, 1, 0.5, 1],
} as const satisfies Record<string, [number, number, number, number]>;

export const DURATION = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
  cinematic: 1.6,
} as const;

export const transition = (
  duration: number = DURATION.base,
  delay = 0,
  ease: readonly number[] = EASE.outExpo,
): Transition => ({ duration, delay, ease: ease as Transition["ease"] });

/** Fade + lift + un-blur. The default "arrive" motion. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: transition(DURATION.base),
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(6px)",
    transition: transition(DURATION.fast, 0, EASE.inOutQuint),
  },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Per-character reveal used by large display titles. */
export const charReveal: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: transition(DURATION.slow),
  },
};

/** Content that replaces other content in place (tabs, selected item): rises in, leaves upward. */
export const swapVariants = (rise = 12, leave = 8) => ({
  initial: { opacity: 0, y: rise, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
  exit: { opacity: 0, y: -leave, filter: "blur(6px)", transition: transition(DURATION.fast, 0, EASE.inOutQuint) },
});

/** The usual swap, shared so every panel moves the same way. */
export const swap = swapVariants();
