"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Section } from "@/components/presentation/Section";
import { PartsProgress } from "@/components/sections/prompt/partes/PartsProgress";
import { PartView } from "@/components/sections/prompt/partes/PartView";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SlideTitle } from "@/components/ui/SlideTitle";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { CAMPAIGN_PARTS, MIRADAS_PARTS, PROPONE_PARTS } from "@/lib/content/estudiantes";
import { ALERTAS_PARTS } from "@/lib/content/prompt-alertas";
import { PROMPT_BLOCK, PROMPT_PARTS, type PromptPart } from "@/lib/content/prompt-encuesta";
import { RUBRICA_PARTS } from "@/lib/content/prompt-rubrica";
import type { SectionProps } from "@/types/presentation";

/**
 * "¿Cómo está construido?" — one part of the prompt at a time, big, so the presenter
 * can explain it at their own pace. ← → (free: slides use ↑ ↓) move between parts.
 */
export const PromptPartsSection = (props: SectionProps) => <PartsStepper {...props} parts={PROMPT_PARTS} />;
export const AlertPartsSection = (props: SectionProps) => <PartsStepper {...props} parts={ALERTAS_PARTS} />;
export const RubricPartsSection = (props: SectionProps) => <PartsStepper {...props} parts={RUBRICA_PARTS} />;
export const CampaignPartsSection = (props: SectionProps) => <PartsStepper {...props} parts={CAMPAIGN_PARTS} />;
export const MiradasPartsSection = (props: SectionProps) => <PartsStepper {...props} parts={MIRADAS_PARTS} />;
export const ProponePartsSection = (props: SectionProps) => <PartsStepper {...props} parts={PROPONE_PARTS} />;

function PartsStepper({ id, index, label, parts }: SectionProps & { parts: readonly PromptPart[] }) {
  // Direction travels with the step so the slide-in animation knows where it came from
  const [{ step, direction }, setState] = useState({ step: 0, direction: 1 });
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const part = parts[step];
  const last = parts.length - 1;

  const goTo = useCallback(
    (next: number | ((current: number) => number)) =>
      setState((s) => {
        const target = Math.max(0, Math.min(typeof next === "function" ? next(s.step) : next, last));
        return { step: target, direction: target >= s.step ? 1 : -1 };
      }),
    [last],
  );

  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") goTo((s) => s + 1);
      if (e.key === "ArrowLeft") goTo((s) => s - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, goTo]);

  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy-dark">
      <motion.div
        ref={ref}
        className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 md:px-16 lg:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer(0.1)}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow index={index}>{label}</Eyebrow>
        </motion.div>
        <SlideTitle className="mt-5">{PROMPT_BLOCK.partsTitle}</SlideTitle>

        {/* Progress: the six parts, clickable */}
        <PartsProgress parts={parts} step={step} onSelect={goTo} />

        {/* The current part */}
        <motion.div variants={fadeUp} className="relative mt-8 md:mt-10">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <PartView key={part.id} part={part} step={step} total={parts.length} direction={direction} />
          </AnimatePresence>
        </motion.div>

        {/* Navigation: back on the left, the next part (filled with its color) on the right */}
        <motion.div
          variants={fadeUp}
          className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-6"
        >
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
            aria-label="Parte anterior"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-4 font-semibold text-gray-light transition-colors hover:border-white/50 hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:px-5"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
            <span className="hidden sm:inline">Anterior</span>
          </button>
          <span className="hidden text-sm text-gray-text [@media(hover:hover)]:inline">o usa las flechas ← →</span>
          <button
            type="button"
            onClick={() => goTo(step === last ? 0 : step + 1)}
            className="inline-flex h-12 items-center gap-2 rounded-full px-5 font-bold text-navy-dark transition-[filter] hover:brightness-110 sm:px-6"
            style={{ backgroundColor: step === last ? "var(--gray-light)" : parts[step + 1].color }}
          >
            {step === last ? (
              "Ver desde el inicio"
            ) : (
              <>
                <span className="font-semibold opacity-75">Siguiente:</span> {parts[step + 1].name}
              </>
            )}
            <ArrowRight aria-hidden="true" className="size-5" />
          </button>
        </motion.div>
      </motion.div>
    </Section>
  );
}

