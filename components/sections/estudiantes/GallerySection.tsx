"use client";

import { motion } from "framer-motion";
import { ImageUp, Vote } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import { GALLERY, POLL_HINT } from "@/lib/content/estudiantes";
import { UPLOAD_TEXT } from "@/lib/content/galeria";
import type { SectionProps } from "@/types/presentation";

/** Each team shows its piece; the class votes with three simple criteria, then the closing line. */
export function GallerySection({ id, index, label }: SectionProps) {
  const [first, second] = GALLERY.closing;

  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgb(36_157_74/0.16)_0%,transparent_60%)]"
      />
      <motion.div
        className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 md:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.1)}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow index={index}>{label}</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-5 font-display text-[clamp(2rem,5.2vw,4.25rem)] font-extrabold leading-none tracking-[-0.04em]"
        >
          🖼️ {GALLERY.title}
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-5 text-lg leading-snug text-gray-text md:text-2xl">
          {GALLERY.lead}
        </motion.p>

        {/* The students type this short address on their phones; the button opens it here, and
            its "Volver" comes back to this slide */}
        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={UPLOAD_TEXT.path}
            className="inline-flex items-center gap-3 rounded-full bg-yellow px-7 py-3.5 font-display text-lg font-bold text-navy-dark shadow-lg shadow-yellow/25 transition-[filter,transform] hover:brightness-105 active:scale-[0.98] md:px-8 md:py-4 md:text-xl"
          >
            <ImageUp aria-hidden="true" className="size-6" strokeWidth={2.25} />
            {UPLOAD_TEXT.slideButton}
          </Link>
          <span className="font-mono text-base text-gray-light md:text-lg">
            {new URL(PUBLIC_SITE_URL).host}
            <span className="text-green-bright">{UPLOAD_TEXT.path}</span>
          </span>
        </motion.div>

        <ul className="mt-8 grid gap-3 md:grid-cols-3 md:gap-5">
          {GALLERY.criteria.map(({ mark, text }) => (
            <motion.li
              key={text}
              variants={fadeUp}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-navy/70 p-5 md:flex-col md:items-start md:p-6"
            >
              <span aria-hidden="true" className="text-4xl leading-none">
                {mark}
              </span>
              <span className="font-display text-lg font-bold leading-tight md:text-xl">{text}</span>
            </motion.li>
          ))}
        </ul>

        <motion.div
          variants={fadeUp}
          className="mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-yellow/30 bg-yellow/[0.04] px-5 py-4"
        >
          <span className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-yellow">
            <Vote aria-hidden="true" className="size-4" strokeWidth={1.75} />
            {POLL_HINT}
          </span>
          <span className="font-display text-lg font-bold md:text-xl">{GALLERY.poll}</span>
        </motion.div>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0, transition: transition(DURATION.slow, 0.4) },
          }}
          className="mt-12 font-display text-[clamp(1.375rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em]"
        >
          {first}
          <span className="block text-green-bright text-glow-green">{second}</span>
        </motion.p>
      </motion.div>
    </Section>
  );
}
