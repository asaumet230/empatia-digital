import type { IntroPhase } from "@/types/presentation";

/** Ordered phases of the intro. Index comparisons ("is at least X") drive every visual. */
export const INTRO_PHASES: readonly IntroPhase[] = [
  "void",
  "spark",
  "boot",
  "connect",
  "analyze",
  "activate",
  "converge",
  "brand",
  "ready",
];

/**
 * When each phase starts, in ms from mount. Tune the whole intro from here.
 * Total ≈ 9s until the CTA is available.
 */
export const INTRO_TIMELINE: Record<IntroPhase, number> = {
  void: 0,
  spark: 500,
  boot: 1300,
  connect: 2700,
  analyze: 3700,
  activate: 4700,
  converge: 5900,
  brand: 6600,
  ready: 8600,
};

export const phaseIndex = (phase: IntroPhase) => INTRO_PHASES.indexOf(phase);

export const isAtLeast = (current: IntroPhase, target: IntroPhase) =>
  phaseIndex(current) >= phaseIndex(target);
