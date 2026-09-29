"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { Section } from "@/components/presentation/Section";
import { CopyButton } from "@/components/ui/CopyButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { CREATE } from "@/lib/content/estudiantes";
import type { SectionProps } from "@/types/presentation";

/** The three steps with ChatGPT, and ready-made follow-ups to improve the first result. */
export function CreateImproveSection({ id, index, label }: SectionProps) {
  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy-dark">
      <motion.div
        className="relative mx-auto grid w-full max-w-7xl items-start gap-10 px-6 py-20 sm:px-10 md:px-16 lg:grid-cols-2 lg:gap-14 lg:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.08)}
      >
        <div>
          <motion.div variants={fadeUp}>
            <Eyebrow index={index}>{label}</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-none tracking-[-0.04em]"
          >
            {CREATE.title}
          </motion.h2>

          <ol className="mt-8 grid gap-3">
            {CREATE.steps.map(({ title, text }, i) => (
              <motion.li
                key={title}
                variants={fadeUp}
                className="flex gap-4 rounded-2xl border border-white/10 bg-navy/70 p-5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-bright font-display text-lg font-bold text-navy-dark">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-display text-lg font-bold leading-tight md:text-xl">{title}</span>
                  <span className="mt-1 block text-base leading-snug text-gray-text md:text-lg">{text}</span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>

        <div>
          <motion.p variants={fadeUp} className="font-display text-2xl font-bold leading-tight md:text-3xl">
            ✏️ {CREATE.improveTitle}
          </motion.p>
          <motion.p variants={fadeUp} className="mt-3 text-base leading-snug text-gray-text md:text-lg">
            {CREATE.improveLead}
          </motion.p>
          <ul className="mt-6 grid gap-3">
            {CREATE.improvements.map((prompt) => (
              <motion.li
                key={prompt}
                variants={fadeUp}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-navy-deep/80 p-4"
              >
                <span className="text-[0.9375rem] leading-snug text-gray-light md:text-base">{prompt}</span>
                <CopyButton text={prompt} className="cursor-pointer" />
              </motion.li>
            ))}
          </ul>
          <motion.p
            variants={fadeUp}
            className="mt-6 flex gap-2.5 rounded-xl bg-yellow/[0.06] p-4 text-sm leading-snug text-gray-light md:text-base"
          >
            <Lightbulb aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-yellow" strokeWidth={2} />
            {CREATE.tip}
          </motion.p>
        </div>
      </motion.div>
    </Section>
  );
}
