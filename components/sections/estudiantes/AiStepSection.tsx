"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/presentation/Section";
import { PollCard } from "@/components/sections/estudiantes/PollCard";
import { PromptBox } from "@/components/sections/prompt/PromptCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { AI_STEPS, type AiStep } from "@/lib/content/estudiantes";
import type { SectionProps } from "@/types/presentation";

export const AiPerspectivesSection = (props: SectionProps) => <AiStepSection {...props} step={AI_STEPS.miradas} />;
export const AiProposeSection = (props: SectionProps) => <AiStepSection {...props} step={AI_STEPS.propone} />;

/**
 * One live step with ChatGPT: the prompt to paste, and what the class does with the answer.
 * Steps that build on the previous answer only copy — a new chat would lose the context.
 */
function AiStepSection({ id, index, label, step }: SectionProps & { step: AiStep }) {
  const pollQuestion = step.then.poll;

  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy">
      <motion.div
        className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-6 py-20 sm:px-10 md:px-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12 lg:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.1)}
      >
        <div>
          <motion.div variants={fadeUp}>
            <Eyebrow index={index}>{label}</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-none tracking-[-0.04em]"
          >
            {step.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-text md:text-xl">
            {step.lead}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6">
            <PromptBox text={step.prompt} title={step.title} sameChat={step.sameChat} />
          </motion.div>
        </div>

        <div className="flex flex-col items-center text-center">
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-green-bright/40 bg-green-bright/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-green-bright"
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-green-bright" />
            {step.then.label}
          </motion.p>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: transition(DURATION.slow, 0.3) },
            }}
            className="mt-4 font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em]"
          >
            {step.then.text}
          </motion.p>
          {pollQuestion && (
            <PollCard poll={{ question: pollQuestion, options: [] }} className="mt-8 w-full" />
          )}
        </div>
      </motion.div>
    </Section>
  );
}
