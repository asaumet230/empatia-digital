"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { STUDENT_INTRO } from "@/lib/content/estudiantes";
import type { SectionProps } from "@/types/presentation";

/** Wraps each keyword of the answer in a highlight. */
function Highlighted({ text, keywords }: { text: string; keywords: readonly string[] }) {
  const pattern = new RegExp(`(${keywords.join("|")})`, "g");
  return text.split(pattern).map((part, i) =>
    keywords.includes(part) ? (
      <span key={i} className="font-semibold text-green-bright">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** The three ideas the session starts from: digital citizenship, cyberbullying, and how social media makes it bigger. */
export function StudentIntroSection({ id, index, label }: SectionProps) {
  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy">
      <motion.div
        className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 md:px-16 lg:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.12)}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow index={index}>{label}</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-5 font-display text-[clamp(2.25rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.04em]"
        >
          {STUDENT_INTRO.title}
        </motion.h2>

        <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
          {STUDENT_INTRO.concepts.map(({ question, answer, keywords, icon: Icon }, i) => (
            <motion.li
              key={question}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border border-white/10 bg-navy-dark/60 p-6 md:p-8"
            >
              <span className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-full bg-green/15 text-green-bright md:size-14">
                  <Icon aria-hidden="true" className="size-6 md:size-7" strokeWidth={1.5} />
                </span>
                <span className="font-mono text-xs tracking-[0.15em] text-gray-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <h3 className="mt-6 font-display text-xl font-bold leading-tight tracking-[-0.02em] md:text-2xl">
                {question}
              </h3>
              <p className="mt-4 text-base leading-snug text-gray-text md:text-lg">
                <Highlighted text={answer} keywords={keywords} />
              </p>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </Section>
  );
}
