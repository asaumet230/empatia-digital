"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { SectionProps } from "@/types/presentation";

/** Temporary slide. Replace with real content as each section is built. */
export function PlaceholderSection({ id, index, label }: SectionProps) {
  const number = String(index).padStart(2, "0");

  return (
    <Section id={id} label={label} className="flex items-center bg-navy">
      {/* Large index watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[0.08em] bottom-[-0.18em] select-none font-display text-[clamp(12rem,42vw,34rem)] font-extrabold leading-none text-white/[0.03]"
      >
        {number}
      </span>

      <motion.div
        className="relative mx-auto w-full max-w-6xl px-6 sm:px-10 md:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer(0.1)}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow index={index}>{label}</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-6 max-w-3xl font-display text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em]"
        >
          Sección en construcción
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-6 max-w-md text-base text-gray-text md:text-lg">
          Espacio reservado para el contenido de la capacitación.
        </motion.p>
      </motion.div>
    </Section>
  );
}
