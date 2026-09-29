"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/presentation/Section";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { AI_BLOCK, AI_CATEGORIES, AI_TOOLS, type AiTool } from "@/lib/content/ia-ecosistema";
import type { SectionProps } from "@/types/presentation";

const shortName = (tool: AiTool) => tool.short ?? tool.name;

/** "La IA puede…" — one row per capability, then the closing phrase. */
export function AiSummarySection({ id, index, label }: SectionProps) {
  // The first sentence of the closing is the idea to remember; it gets full contrast
  const [first, ...rest] = AI_BLOCK.closing.split(/(?<=\.)\s/);

  return (
    <Section id={id} label={label} className="flex items-center bg-navy">
      <motion.div
        className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 md:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.08)}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow index={index}>{label}</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-6 font-display text-[clamp(2.25rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.04em]"
        >
          {AI_BLOCK.summaryTitle}
        </motion.h2>

        <ul className="mt-10 border-t border-line md:mt-12">
          {AI_CATEGORIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.li
                key={c.id}
                variants={fadeUp}
                className="group grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-b border-line py-4 md:grid-cols-[2.5rem_minmax(0,1fr)_auto] md:gap-x-6 md:py-5"
              >
                <span className="font-mono text-[0.6875rem] tracking-[0.15em] text-green-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-3 font-display text-xl font-bold tracking-[-0.02em] md:text-[1.75rem]">
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-5 shrink-0 text-gray-muted transition-colors duration-500 group-hover:text-green-bright md:size-6"
                  />
                  {c.can}
                </span>
                <span className="col-start-2 flex flex-wrap items-center gap-x-5 gap-y-2 md:col-start-auto md:justify-end">
                  {c.summary.map((toolId) => {
                    const tool = AI_TOOLS[toolId];
                    return (
                      <span
                        key={toolId}
                        className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-gray-text transition-colors duration-500 group-hover:text-white sm:text-xs"
                      >
                        <BrandIcon src={tool.icon} className="size-4" />
                        {shortName(tool)}
                      </span>
                    );
                  })}
                </span>
              </motion.li>
            );
          })}
        </ul>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0, transition: transition(DURATION.slow, 0.4) },
          }}
          className="mt-10 max-w-4xl text-lg leading-snug text-gray-text md:mt-14 md:text-2xl"
        >
          <span className="text-white">{first}</span> {rest.join(" ")}
        </motion.p>
      </motion.div>
    </Section>
  );
}
