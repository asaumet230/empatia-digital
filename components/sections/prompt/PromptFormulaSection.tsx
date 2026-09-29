"use client";

import { motion, type Variants } from "framer-motion";
import { Plus } from "lucide-react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { PROMPT_BLOCK, PROMPT_PARTS } from "@/lib/content/prompt-encuesta";
import type { SectionProps } from "@/types/presentation";

const lightUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
};

/** ROL + CONTEXTO + OBJETIVO + INSTRUCCIONES + LÍMITES + ACCIÓN, lit one after another. */
export function PromptFormulaSection({ id, index, label }: SectionProps) {
  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy-dark">
      <motion.div
        className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 md:px-16 lg:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={staggerContainer(0.12)}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow index={index}>{label}</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-5 max-w-3xl font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]"
        >
          {PROMPT_BLOCK.formulaTitle}
        </motion.h2>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {PROMPT_PARTS.map((part, i) => (
            <motion.li
              key={part.id}
              variants={lightUp}
              className="relative flex flex-col rounded-2xl border border-white/10 bg-navy/60 p-5 md:p-6"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-5 top-0 h-0.5 rounded-full"
                style={{ backgroundColor: part.color, boxShadow: `0 0 16px ${part.color}` }}
              />
              <span className="font-mono text-[0.6875rem] tracking-[0.15em]" style={{ color: part.color }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-3 break-words font-display text-xl font-extrabold uppercase tracking-[0.01em] md:text-2xl">
                {part.name}
              </span>
              <span className="mt-3 text-base leading-snug text-gray-text">{part.example}</span>

              {/* "+" sits in the gap between cards of the same row (3 per row) */}
              {(i + 1) % 3 !== 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-[1.5rem] top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-navy-dark text-gray-muted lg:grid"
                >
                  <Plus className="size-3" strokeWidth={2.5} />
                </span>
              )}
            </motion.li>
          ))}
        </ol>

        <motion.blockquote
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0, transition: transition(DURATION.slow, 0.3) },
          }}
          className="mt-12 max-w-4xl border-l-2 border-yellow pl-6 text-xl leading-snug text-gray-light md:mt-14 md:text-[1.625rem]"
        >
          “{PROMPT_BLOCK.closing}”
        </motion.blockquote>
      </motion.div>
    </Section>
  );
}
