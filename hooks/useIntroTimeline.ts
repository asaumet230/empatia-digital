"use client";

import { useCallback, useEffect, useState } from "react";
import { INTRO_PHASES, INTRO_TIMELINE } from "@/lib/intro-timeline";
import type { IntroPhase } from "@/types/presentation";

/**
 * Drives the intro phase machine with plain timers (no rAF, nothing on the main thread
 * between phases). With reduced motion the intro starts directly at "ready".
 */
export function useIntroTimeline(reducedMotion: boolean) {
  const [phase, setPhase] = useState<IntroPhase>("void");
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (reducedMotion || skipped) return;
    const timers = INTRO_PHASES.slice(1).map((p) =>
      window.setTimeout(() => setPhase(p), INTRO_TIMELINE[p]),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [reducedMotion, skipped]);

  const skip = useCallback(() => {
    setSkipped(true);
    setPhase("ready");
  }, []);

  return { phase: reducedMotion ? "ready" : phase, skip, skipped: skipped || reducedMotion };
}
