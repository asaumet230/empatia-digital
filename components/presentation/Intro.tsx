"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { BootSequence } from "@/components/intro/BootSequence";
import { BrandReveal } from "@/components/intro/BrandReveal";
import { IntroHud } from "@/components/intro/IntroHud";
import { NetworkBackground } from "@/components/intro/NetworkBackground";
import { Section } from "@/components/presentation/Section";
import { DURATION, EASE, transition } from "@/lib/animations";
import { isAtLeast } from "@/lib/intro-timeline";
import type { IntroPhase } from "@/types/presentation";

interface IntroProps {
  id: string;
  phase: IntroPhase;
  reducedMotion: boolean;
  onSkip: () => void;
  onStart: () => void;
}

/**
 * "Sistema iniciando" — the opening sequence.
 * Layers (back → front): grid · network canvas · illumination · content · HUD.
 */
export function Intro({ id, phase, reducedMotion, onSkip, onStart }: IntroProps) {
  const converged = isAtLeast(phase, "converge");
  const branded = isAtLeast(phase, "brand");
  const sparkRef = useRef<HTMLDivElement>(null);

  return (
    <Section id={id} label="Inicio" className="grain overflow-hidden bg-navy-dark">
      {/* Technical grid, only surfaces once the network connects */}
      <motion.div
        aria-hidden="true"
        className="tech-grid absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: converged ? 0.6 : 0 }}
        transition={transition(DURATION.cinematic)}
      />

      <NetworkBackground phase={phase} reducedMotion={reducedMotion} originRef={sparkRef} />

      {/* The screen lights up slightly when the network converges */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--navy)_0%,transparent_70%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: converged ? 1 : 0 }}
        transition={transition(2, 0, EASE.outQuart)}
      />

      {/* One-shot pulse from the hub at the moment of convergence */}
      {converged && !reducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-bright/40"
          initial={{ scale: 0.1, opacity: 0.9 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={transition(1.8, 0, EASE.outExpo)}
        />
      )}

      {/* Edge vignette keeps the focus in the center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(10_22_32/0.85)_100%)]"
      />

      <div className="relative z-10 flex min-h-svh items-center justify-center py-24">
        <AnimatePresence mode="wait">
          {branded ? (
            <BrandReveal key="brand" ready={phase === "ready"} onStart={onStart} />
          ) : (
            !converged && <BootSequence key="boot" phase={phase} sparkRef={sparkRef} />
          )}
        </AnimatePresence>
      </div>

      <IntroHud phase={phase} onSkip={onSkip} />
    </Section>
  );
}
