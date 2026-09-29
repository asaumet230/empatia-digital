"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, EASE, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { CAMPAIGN_PARTS, MIRADAS_PARTS, PROPONE_PARTS } from "@/lib/content/estudiantes";
import { ALERTAS_PARTS } from "@/lib/content/prompt-alertas";
import { PROMPT_BLOCK, PROMPT_PARTS, type PromptBlock, type PromptPart } from "@/lib/content/prompt-encuesta";
import { RUBRICA_PARTS } from "@/lib/content/prompt-rubrica";
import type { SectionProps } from "@/types/presentation";

const pad = (n: number) => String(n).padStart(2, "0");

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

  const goTo = (next: number | ((current: number) => number)) =>
    setState((s) => {
      const target = Math.max(0, Math.min(typeof next === "function" ? next(s.step) : next, last));
      return { step: target, direction: target >= s.step ? 1 : -1 };
    });

  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") goTo((s) => s + 1);
      if (e.key === "ArrowLeft") goTo((s) => s - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // goTo only uses the functional updater, so it is safe to leave out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

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
        <motion.h2
          variants={fadeUp}
          className="mt-5 font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]"
        >
          {PROMPT_BLOCK.partsTitle}
        </motion.h2>

        {/* Progress: the six parts, clickable */}
        <motion.ol variants={fadeUp} className="mt-8 grid grid-cols-6 gap-2 md:gap-3">
          {parts.map((p, i) => {
            const on = i === step;
            const seen = i <= step;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  aria-current={on ? "step" : undefined}
                  aria-label={`${pad(i + 1)} ${p.name}`}
                  onClick={() => goTo(i)}
                  className="group flex w-full flex-col gap-2 text-left"
                >
                  <span
                    className="h-1 w-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: seen ? p.color : "rgb(255 255 255 / 0.1)",
                      boxShadow: on ? `0 0 14px ${p.color}` : undefined,
                    }}
                  />
                  <span
                    className={cn(
                      "hidden font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors sm:block",
                      on ? "text-white" : "text-gray-muted group-hover:text-gray-text",
                    )}
                  >
                    {p.name}
                  </span>
                </button>
              </li>
            );
          })}
        </motion.ol>

        {/* The current part */}
        <motion.div variants={fadeUp} className="relative mt-8 min-h-[30rem] md:mt-10 md:min-h-[24rem]">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={part.id}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: 40 * d, filter: "blur(8px)" }),
                center: { opacity: 1, x: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
                leave: (d: number) => ({
                  opacity: 0,
                  x: -30 * d,
                  filter: "blur(8px)",
                  transition: transition(DURATION.fast, 0, EASE.inOutQuint),
                }),
              }}
              initial="enter"
              animate="center"
              exit="leave"
            >
              {/* Name on its own row: long words (INSTRUCCIONES) never run into the text */}
              <p className="font-mono text-sm tracking-[0.2em]" style={{ color: part.color }}>
                {pad(step + 1)} / {pad(parts.length)}
              </p>
              <p
                className="mt-2 break-words font-display text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold uppercase leading-none tracking-[-0.03em]"
                style={{ color: part.color }}
              >
                {part.name}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-14">
                <p
                  className="self-start border-l-2 pl-4 text-lg italic leading-snug text-gray-light md:text-xl"
                  style={{ borderColor: part.color }}
                >
                  “{part.quote}”
                </p>
                <div className="space-y-4 text-lg leading-relaxed text-gray-text md:text-xl">
                  {part.explain.map((block, k) => (
                    <Block key={k} block={block} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={fadeUp} className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
            aria-label="Parte anterior"
            className="grid size-12 place-items-center rounded-full border border-white/15 text-gray-light transition-colors hover:border-white/40 disabled:opacity-30"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(step + 1)}
            disabled={step === last}
            className="inline-flex h-12 items-center gap-3 rounded-full border px-6 font-semibold transition-colors disabled:opacity-30"
            style={{ borderColor: parts[Math.min(step + 1, last)].color }}
          >
            {step === last ? "Última parte" : `Siguiente: ${parts[step + 1].name}`}
            <ArrowRight aria-hidden="true" className="size-5" />
          </button>
          <span className="hud-label ml-2 hidden [@media(hover:hover)]:inline">o usa las flechas ← →</span>
        </motion.div>
      </motion.div>
    </Section>
  );
}

function Block({ block }: { block: PromptBlock }) {
  switch (block.kind) {
    case "text":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul className="space-y-1.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-green-bright" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "compare":
      return (
        <div className="grid gap-3 text-base md:text-lg">
          <p className="flex items-start gap-3 rounded-xl border border-white/10 px-4 py-3 text-gray-muted">
            <span aria-label="Menos claro" className="font-bold text-[#FF7A7A]">
              ✕
            </span>
            “{block.weak}”
          </p>
          <p className="flex items-start gap-3 rounded-xl border border-green-bright/40 bg-green/10 px-4 py-3 text-gray-light">
            <span aria-label="Más claro" className="font-bold text-green-bright">
              ✓
            </span>
            “{block.strong}”
          </p>
        </div>
      );
  }
}
