"use client";

import { motion } from "framer-motion";
import { Cpu, GraduationCap, X, type LucideIcon } from "lucide-react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { KEY_IDEA } from "@/lib/content/prompt-alertas";
import type { SectionProps } from "@/types/presentation";

const ROLE_ICONS: readonly LucideIcon[] = [Cpu, GraduationCap];

/** "La IA encuentra patrones; el docente decide" — who does what, and what the AI must not do. */
export function AlertKeyIdeaSection({ id, index, label }: SectionProps) {
  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy">
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
          className="mt-6 max-w-5xl font-display text-[clamp(1.75rem,4vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em]"
        >
          {KEY_IDEA.title}
        </motion.h2>

        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
          {KEY_IDEA.roles.map((role, i) => {
            const Icon = ROLE_ICONS[i];
            const teacher = i === 1;
            return (
              <motion.div
                key={role.who}
                variants={fadeUp}
                className={cn(
                  "rounded-2xl border p-6 md:p-7",
                  teacher ? "border-green-bright/40 bg-green/10" : "border-white/10 bg-navy-dark/60",
                )}
              >
                <p className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-full",
                      teacher ? "bg-green-bright text-navy-dark" : "bg-white/10 text-gray-light",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-display text-xl font-bold md:text-2xl">{role.who}</span>
                </p>
                <ul className="mt-5 space-y-2.5">
                  {role.does.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-lg text-gray-light md:text-xl">
                      <span
                        aria-hidden="true"
                        className={cn("size-1.5 shrink-0 rounded-full", teacher ? "bg-green-bright" : "bg-gray-muted")}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: transition(DURATION.slow, 0.2) },
          }}
          className="mt-10 md:mt-12"
        >
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gray-muted">
            {KEY_IDEA.limitsTitle}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {KEY_IDEA.limits.map((limit) => (
              <li
                key={limit}
                className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-gray-text md:text-base"
              >
                <X aria-hidden="true" className="size-4 text-[#FF6B6B]" strokeWidth={2.5} />
                {limit}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </Section>
  );
}
