"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Section } from "@/components/presentation/Section";
import { PromptActions, PromptPreview } from "@/components/sections/prompt/PromptCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { VideoGuide } from "@/components/ui/VideoGuide";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { ShieldCheck } from "lucide-react";
import { ALERTAS_EXERCISE } from "@/lib/content/prompt-alertas";
import { ENCUESTA_EXERCISE } from "@/lib/content/prompt-encuesta";
import type { PromptExercise } from "@/lib/content/prompt-exercise";
import { RUBRICA_ANALISIS_EXERCISE, RUBRICA_EXERCISE } from "@/lib/content/prompt-rubrica";
import type { SectionProps } from "@/types/presentation";

export const PromptSection = (props: SectionProps) => <PromptExerciseSection {...props} exercise={ENCUESTA_EXERCISE} />;

export const AlertPromptSection = (props: SectionProps) => (
  <PromptExerciseSection {...props} exercise={ALERTAS_EXERCISE} />
);

export const RubricPromptSection = (props: SectionProps) => (
  <PromptExerciseSection {...props} exercise={RUBRICA_EXERCISE} />
);

export const RubricAnalysisPromptSection = (props: SectionProps) => (
  <PromptExerciseSection {...props} exercise={RUBRICA_ANALISIS_EXERCISE} />
);

/**
 * A "copy this prompt" slide — just the doing: why, what you get, three steps, one big
 * copy button. Two versions of the prompt: without Tally (anyone) and with Tally.
 */
function PromptExerciseSection({ id, index, label, exercise }: SectionProps & { exercise: PromptExercise }) {
  const [variant, setVariant] = useState(exercise.variants[0]);

  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy">
      <motion.div
        className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-20 sm:px-10 md:px-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer(0.1)}
      >
        <div>
          <motion.div variants={fadeUp}>
            <Eyebrow index={index}>{exercise.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-[clamp(2rem,4.4vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.03em]"
          >
            {exercise.title}
          </motion.h2>
          <motion.dl variants={fadeUp} className="mt-8 max-w-xl space-y-5">
            {exercise.purpose.map((item) => (
              <div key={item.label} className="border-l-2 border-green-bright/60 pl-4">
                <dt className="font-mono text-xs uppercase tracking-[0.16em] text-green-bright">{item.label}</dt>
                <dd className="mt-1.5 text-lg leading-snug text-gray-light md:text-xl">{item.text}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.ol variants={fadeUp} className="mt-10 space-y-4">
            {exercise.steps.map((step, i) => (
              <li key={step} className="flex items-center gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-green-bright/50 font-mono text-sm text-green-bright">
                  {i + 1}
                </span>
                <span className="text-lg font-semibold text-gray-light md:text-xl">{step}</span>
              </li>
            ))}
          </motion.ol>

          <motion.div variants={fadeUp} className="mt-10">
            <PromptActions variant={variant} />
            <p className="mt-5 max-w-xl text-sm text-gray-muted">{variant.note}</p>
            {variant.guide && (
              <div className="mt-4">
                <VideoGuide guide={variant.guide} />
              </div>
            )}
            {exercise.notice && (
              <p className="mt-4 flex max-w-xl items-start gap-3 rounded-xl border border-yellow/40 bg-yellow/[0.05] px-4 py-3 text-sm leading-snug text-gray-light md:text-base">
                <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-yellow" strokeWidth={1.75} />
                {exercise.notice}
              </p>
            )}
          </motion.div>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: transition(DURATION.slow, 0.3) },
          }}
        >
          <PromptPreview
            layoutPrefix={exercise.id}
            variants={exercise.variants}
            variant={variant}
            onVariantChange={setVariant}
          />
        </motion.div>
      </motion.div>
    </Section>
  );
}
