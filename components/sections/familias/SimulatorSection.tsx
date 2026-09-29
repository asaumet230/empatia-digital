"use client";

import { motion, type Variants } from "framer-motion";
import { Bot, CheckCircle2, User } from "lucide-react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { FINISH, SIMULATOR_BLOCK } from "@/lib/content/familias";
import type { SectionProps } from "@/types/presentation";

/** Messages arrive one by one, like a real chat. */
const bubble: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: transition(DURATION.base) },
};

/**
 * "Cómo funciona el simulador" — the steps next to a sample chat that shows the key moment:
 * after "Finaliza la simulación", the AI stops playing the teenager and gives feedback.
 */
export function SimulatorSection({ id, index, label }: SectionProps) {
  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy-dark">
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 sm:px-10 md:px-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-12">
        <motion.div
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
            className="mt-5 font-display text-[clamp(1.75rem,3.8vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          >
            {SIMULATOR_BLOCK.title}
          </motion.h2>
          <motion.ol variants={fadeUp} className="mt-8 space-y-4">
            {SIMULATOR_BLOCK.steps.map((step, i) => (
              <li key={step} className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-green-bright/50 font-mono text-sm text-green-bright">
                  {i + 1}
                </span>
                <span className="pt-1.5 text-lg font-semibold leading-snug text-gray-light md:text-xl">{step}</span>
              </li>
            ))}
          </motion.ol>
        </motion.div>

        {/* Sample chat */}
        <motion.div
          className="rounded-2xl border border-white/10 bg-navy/70 p-5 md:p-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer(0.7, 0.3)}
        >
          <p className="hud-label">{SIMULATOR_BLOCK.sample}</p>
          <div className="mt-4 space-y-3">
            {SIMULATOR_BLOCK.chat.map((message, i) => {
              const adult = message.from === "adult";
              const finish = message.text.startsWith(FINISH);
              return (
                <motion.div
                  key={i}
                  variants={bubble}
                  className={cn("flex items-end gap-2.5", adult ? "flex-row-reverse" : "flex-row")}
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full",
                      adult ? "bg-white/10 text-gray-light" : "bg-green/25 text-green-bright",
                    )}
                  >
                    {adult ? (
                      <User aria-hidden="true" className="size-4" />
                    ) : (
                      <Bot aria-hidden="true" className="size-4" />
                    )}
                  </span>
                  <p
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-snug md:text-base",
                      adult ? "rounded-br-sm bg-white/[0.08] text-gray-light" : "rounded-bl-sm bg-green/15 text-white",
                      finish && "border border-yellow/60 font-semibold text-yellow",
                    )}
                  >
                    <span className="sr-only">{adult ? "Tú: " : "Adolescente (IA): "}</span>
                    {message.text}
                  </p>
                </motion.div>
              );
            })}

            <motion.div variants={bubble} className="rounded-2xl border border-green-bright/40 bg-green/10 p-4 md:p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-green-bright md:text-base">
                <Bot aria-hidden="true" className="size-4" />
                {SIMULATOR_BLOCK.feedbackTitle}
              </p>
              <ul className="mt-3 space-y-2">
                {SIMULATOR_BLOCK.feedback.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-base text-gray-light md:text-lg">
                    <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-green-bright" strokeWidth={1.75} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
