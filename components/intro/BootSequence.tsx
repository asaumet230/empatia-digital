"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState, type Ref } from "react";
import { PulseDot } from "@/components/ui/PulseDot";
import { DURATION, EASE, fadeUp, transition } from "@/lib/animations";
import { BOOT_STEPS, BRAND } from "@/lib/constants";
import { INTRO_TIMELINE, isAtLeast } from "@/lib/intro-timeline";
import type { IntroPhase } from "@/types/presentation";

interface BootSequenceProps {
  phase: IntroPhase;
  /** Attached to the spark so the network wave can emanate from it. */
  sparkRef?: Ref<HTMLDivElement>;
}

/** Time the bar takes to fill: from "boot" until the network converges. */
const FILL_SECONDS = (INTRO_TIMELINE.converge - INTRO_TIMELINE.boot) / 1000;

/** A step resolves to a check shortly before the next step replaces it. */
const STEP_CHECK_MS = (INTRO_TIMELINE.analyze - INTRO_TIMELINE.connect) * 0.6;

/** Phases 1–2: spark, boot message, a continuous progress bar and one live status line. */
export function BootSequence({ phase, sparkRef }: BootSequenceProps) {
  const booting = isAtLeast(phase, "boot");

  // The index of the step currently running (-1 before the first one)
  const stepIndex = BOOT_STEPS.reduce((acc, step, i) => (isAtLeast(phase, step.id) ? i : acc), -1);
  const step = stepIndex >= 0 ? BOOT_STEPS[stepIndex] : null;

  return (
    <motion.div
      key="boot"
      className="relative flex w-full flex-col items-center px-6"
      exit={{
        opacity: 0,
        scale: 0.96,
        filter: "blur(12px)",
        transition: transition(DURATION.base, 0, EASE.inOutQuint),
      }}
    >
      {/* Spark */}
      <motion.div
        ref={sparkRef}
        initial={{ opacity: 0, scale: 0 }}
        animate={isAtLeast(phase, "spark") ? { opacity: 1, scale: 1 } : undefined}
        transition={transition(DURATION.slow)}
        className="mb-9 md:mb-12"
      >
        <PulseDot size={10} />
      </motion.div>

      <motion.div
        initial="hidden"
        animate={booting ? "visible" : "hidden"}
        variants={fadeUp}
        className="flex w-full flex-col items-center"
      >
        <h1 className="text-center font-display text-sm font-medium uppercase tracking-[0.32em] text-gray-light sm:text-base md:text-lg">
          {BRAND.bootMessage}
          <LoadingDots />
        </h1>

        <ProgressBar running={booting} />

        {/* One status line that updates in place */}
        <div
          className="mt-7 flex h-6 items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            {step && (
              <motion.p
                key={step.id}
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={transition(0.45, 0, EASE.outQuart)}
                className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.24em] sm:text-xs"
              >
                <StepMarker />
                <span className="text-gray-light">{step.label}</span>
                <span className="text-gray-muted">
                  {String(stepIndex + 1).padStart(2, "0")}/{String(BOOT_STEPS.length).padStart(2, "0")}
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Continuous, time-driven bar with a glowing head and live percentage. */
function ProgressBar({ running }: { running: boolean }) {
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (v) => `${String(Math.round(v * 100)).padStart(3, "0")}%`);
  const headX = useTransform(progress, (v) => `${v * 100}%`);

  useEffect(() => {
    if (!running) return;
    // Gentle ease-in-out so it reads as real work rather than a linear timer
    const controls = animate(progress, 1, { duration: FILL_SECONDS, ease: [0.4, 0.05, 0.3, 1] });
    return () => controls.stop();
  }, [running, progress]);

  return (
    <div className="mt-8 flex w-[min(30rem,82vw)] items-center gap-4">
      <div className="relative h-[3px] flex-1 rounded-full bg-white/10">
        <motion.div
          className="absolute inset-0 origin-left rounded-full bg-linear-to-r from-green to-green-bright shadow-[0_0_14px_rgb(53_201_94/0.55)]"
          style={{ scaleX: progress }}
        />
        {/* Glowing head */}
        <motion.div aria-hidden="true" className="absolute inset-0" style={{ x: headX }}>
          <span className="absolute left-0 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgb(53_201_94/0.8)]" />
        </motion.div>
      </div>
      <motion.span
        aria-hidden="true"
        className="w-12 text-right font-mono text-xs tabular-nums tracking-[0.12em] text-gray-light"
      >
        {percent}
      </motion.span>
    </div>
  );
}

/** Pulses while the step runs, then resolves into a check before the next one arrives. */
function StepMarker() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), STEP_CHECK_MS);
    return () => window.clearTimeout(t);
  }, []);

  return done ? (
    <span className="grid size-4 place-items-center rounded-full bg-green-bright text-navy-dark">
      <Check aria-hidden="true" strokeWidth={3} className="size-2.5" />
    </span>
  ) : (
    <PulseDot size={6} />
  );
}

function LoadingDots() {
  return (
    <span aria-hidden="true" className="inline-flex w-[1.5em] justify-start">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}
