"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { CONFLICTS_BLOCK, FAMILY_KEY_IDEA } from "@/lib/content/familias";
import type { SectionProps } from "@/types/presentation";

/** Closing idea for families, with the three recommendations as a reminder. */
export function FamilyKeyIdeaSection({ id, index, label }: SectionProps) {
  const [first, ...rest] = FAMILY_KEY_IDEA.quote.split(/(?<=\.)\s/);

  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgb(36_157_74/0.14)_0%,transparent_60%)]"
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
        <blockquote className="mt-8 max-w-5xl font-display text-[clamp(1.75rem,4.2vw,3.75rem)] font-bold leading-[1.1] tracking-[-0.03em]">
          <motion.span variants={fadeUp} className="block text-gray-text">
            “{first}
          </motion.span>
          <motion.span variants={fadeUp} className="mt-4 block">
            {rest.join(" ")}”
          </motion.span>
        </blockquote>

        <motion.ul
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: transition(DURATION.slow, 0.3) },
          }}
          className="mt-12 flex flex-wrap gap-3 md:mt-16"
        >
          {CONFLICTS_BLOCK.recommendations.map(({ label: recommendation, icon: Icon }) => (
            <li
              key={recommendation}
              className="flex items-center gap-2.5 rounded-full border border-green-bright/40 bg-green/10 py-2 pl-2 pr-5"
            >
              <span className="grid size-8 place-items-center rounded-full bg-green-bright text-navy-dark">
                <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </span>
              <span className="font-semibold text-gray-light">{recommendation}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </Section>
  );
}
