"use client";

import { motion } from "framer-motion";
import { DURATION, transition } from "@/lib/animations";
import { BRAND } from "@/lib/constants";
import { isAtLeast } from "@/lib/intro-timeline";
import type { IntroPhase } from "@/types/presentation";

interface IntroHudProps {
  phase: IntroPhase;
  onSkip: () => void;
}

/** Minimal corner interface: brand mark and skip control. */
export function IntroHud({ phase, onSkip }: IntroHudProps) {
  const visible = isAtLeast(phase, "boot");
  const ready = phase === "ready";

  const fade = {
    initial: { opacity: 0 },
    animate: { opacity: visible ? 1 : 0 },
    transition: transition(DURATION.slow, 0.2),
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <motion.div
        {...fade}
        className="absolute left-5 top-5 flex items-center gap-3 sm:left-8 sm:top-8 md:left-10 md:top-10"
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-green-bright" />
        <span className="hud-label text-gray-text">{BRAND.name}</span>
      </motion.div>

      {!ready && (
        <motion.button
          {...fade}
          type="button"
          onClick={onSkip}
          className="hud-label pointer-events-auto absolute bottom-3 right-3 px-2 py-2 transition-colors hover:text-gray-light sm:bottom-6 sm:right-6 md:bottom-8 md:right-8"
        >
          Saltar intro <span aria-hidden="true">→</span>
        </motion.button>
      )}
    </div>
  );
}
