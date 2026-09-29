"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Section } from "@/components/presentation/Section";
import { AiMap } from "@/components/sections/ia/AiMap";
import { AiMapPanel } from "@/components/sections/ia/AiMapPanel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { AI_BLOCK, AI_CATEGORIES, type AiToolId } from "@/lib/content/ia-ecosistema";
import type { SectionProps } from "@/types/presentation";

/** The first tool opens by default, so the card is never empty. */
const defaultTool = (id: string) => AI_CATEGORIES.find((c) => c.id === id)?.tools[0]?.id ?? null;

/**
 * "Mapa actual de la IA". Selection is sticky: hovering (or tapping, or focusing) a node
 * keeps it active until another one is chosen, so the pointer can travel to the tools.
 */
export function AiMapSection({ id, index, label }: SectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toolId, setToolId] = useState<AiToolId | null>(null);

  const selectCategory = (next: string) => {
    if (next === activeId) return;
    setActiveId(next);
    setToolId(defaultTool(next));
  };

  const reset = () => {
    setActiveId(null);
    setToolId(null);
  };

  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy-dark">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,var(--navy)_0%,transparent_65%)]"
      />

      <div
        className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 md:px-16 lg:py-16"
        onKeyDown={(e) => e.key === "Escape" && reset()}
      >
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={staggerContainer(0.1)}
        >
          <motion.div variants={fadeUp}>
            <Eyebrow index={index}>{label}</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-5 max-w-3xl font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          >
            {AI_BLOCK.mapTitle}
          </motion.h2>
        </motion.header>

        <div className="mt-10 grid items-center gap-12 lg:mt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <AiMap
            categories={AI_CATEGORIES}
            activeId={activeId}
            toolId={toolId}
            onSelectCategory={selectCategory}
            onSelectTool={setToolId}
            onReset={reset}
          />
          <AiMapPanel
            categories={AI_CATEGORIES}
            activeId={activeId}
            toolId={toolId}
            onSelectCategory={selectCategory}
            onSelectTool={setToolId}
          />
        </div>
      </div>
    </Section>
  );
}
