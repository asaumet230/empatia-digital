"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { CONFLICTS_BLOCK } from "@/lib/content/familias";
import type { SectionProps } from "@/types/presentation";

/** What usually goes wrong at home, and the three things the recommendations agree on. */
export function ConflictsSection({ id, index, label }: SectionProps) {
  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy">
      <motion.div
        className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 md:px-16 lg:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.07)}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow index={index}>{label}</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-5 max-w-4xl font-display text-[clamp(1.75rem,3.8vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em]"
        >
          {CONFLICTS_BLOCK.title}
        </motion.h2>

        <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-4">
          {CONFLICTS_BLOCK.conflicts.map(({ label: conflict, icon: Icon }, i) => (
            <motion.li
              key={conflict}
              variants={fadeUp}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-navy-dark/60 p-4 md:gap-4 md:p-5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-gray-light md:size-12">
                <Icon aria-hidden="true" className="size-5 md:size-6" strokeWidth={1.5} />
              </span>
              <span className="text-[0.9375rem] font-semibold leading-snug text-gray-light md:text-lg">
                <span className="mr-2 font-mono text-xs text-gray-muted">{String(i + 1).padStart(2, "0")}</span>
                {conflict}
              </span>
            </motion.li>
          ))}
        </ul>
        <motion.p variants={fadeUp} className="mt-4 text-sm text-gray-muted">
          {CONFLICTS_BLOCK.source}
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0, transition: transition(DURATION.slow, 0.2) },
          }}
          className="mt-10 rounded-2xl border border-green-bright/30 bg-green/[0.08] p-6 md:mt-12 md:p-8"
        >
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-green-bright">
            {CONFLICTS_BLOCK.recommendationsTitle}
          </p>
          <ul className="mt-5 grid gap-4 md:grid-cols-3 md:gap-6">
            {CONFLICTS_BLOCK.recommendations.map(({ label: recommendation, icon: Icon }) => (
              <li key={recommendation} className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-green-bright text-navy-dark">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </span>
                <span className="font-display text-lg font-bold leading-tight md:text-xl">{recommendation}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base text-gray-light md:text-lg">{CONFLICTS_BLOCK.instead}</p>
        </motion.div>
      </motion.div>
    </Section>
  );
}
