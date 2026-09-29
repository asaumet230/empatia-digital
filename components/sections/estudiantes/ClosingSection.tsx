"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { CLOSING } from "@/lib/content/estudiantes";
import type { SectionProps } from "@/types/presentation";

/** IA propone · tú cuestionas · tú decides — and the line to take home. */
export function ClosingSection({ id, index, label }: SectionProps) {
  const [first, second] = CLOSING.final;

  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgb(36_157_74/0.16)_0%,transparent_60%)]"
      />
      <motion.div
        className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 md:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer(0.16)}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow index={index}>{label}</Eyebrow>
        </motion.div>

        <ul className="mt-8 grid gap-3 md:grid-cols-3 md:gap-5">
          {CLOSING.steps.map(({ mark, text }) => (
            <motion.li
              key={text}
              variants={fadeUp}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-navy/70 px-5 py-5 font-display text-[clamp(1.25rem,2.2vw,1.875rem)] font-extrabold leading-tight tracking-[-0.02em] md:flex-col md:items-start md:gap-4 md:px-7 md:py-6"
            >
              <span aria-hidden="true" className="text-4xl leading-none md:text-5xl">
                {mark}
              </span>
              <span className="whitespace-nowrap">{text}</span>
            </motion.li>
          ))}
        </ul>

        <motion.p variants={fadeUp} className="mt-12 hud-label">
          {CLOSING.question}
        </motion.p>
        <motion.p variants={fadeUp} className="mt-4 max-w-4xl text-lg leading-snug text-gray-text md:text-2xl">
          {CLOSING.idea}
        </motion.p>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0, transition: transition(DURATION.slow, 0.4) },
          }}
          className="mt-14 font-display text-[clamp(1.75rem,4.4vw,3.75rem)] font-bold leading-[1.1] tracking-[-0.03em]"
        >
          {first}
          <span className="block text-green-bright text-glow-green">{second}</span>
        </motion.p>
      </motion.div>
    </Section>
  );
}
