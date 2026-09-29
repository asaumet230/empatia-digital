"use client";

import { motion, type Variants } from "framer-motion";
import { Section } from "@/components/presentation/Section";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, EASE, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { AI_BLOCK, AI_CATEGORIES, AI_TOOLS } from "@/lib/content/ia-ecosistema";
import type { SectionProps } from "@/types/presentation";

const RADIUS = 38;

const point = (i: number) => {
  const a = ((-90 + (360 / AI_CATEGORIES.length) * i) * Math.PI) / 180;
  return { x: 50 + Math.cos(a) * RADIUS, y: 50 + Math.sin(a) * RADIUS };
};

/** Categories burst out of "ChatGPT" once the title has landed. */
const burst = (i: number): Variants => ({
  hidden: { opacity: 0, scale: 0.4, left: "50%", top: "50%" },
  visible: {
    opacity: 1,
    scale: 1,
    left: `${point(i).x}%`,
    top: `${point(i).y}%`,
    transition: transition(DURATION.slow, 1.1 + i * 0.07),
  },
});

const link = (i: number): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: transition(DURATION.slow, 1.1 + i * 0.07, EASE.outQuart) },
});

/** "La IA no es solamente ChatGPT" — the block opener. */
export function AiOpeningSection({ id, index, label }: SectionProps) {
  const [lineA, lineB, chatgpt] = AI_BLOCK.title;

  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy">
      <motion.div
        className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-20 sm:px-10 md:px-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer(0.12)}
      >
        <div>
          <motion.div variants={fadeUp}>
            <Eyebrow index={index}>{label}</Eyebrow>
          </motion.div>
          <h2 className="mt-8 font-display text-[clamp(2.5rem,7.5vw,6.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
            <motion.span variants={fadeUp} className="block">
              {lineA}
            </motion.span>
            <motion.span variants={fadeUp} className="block font-light text-gray-text">
              {lineB}
            </motion.span>
            <motion.span variants={fadeUp} className="block text-green-bright text-glow-green">
              {chatgpt}
            </motion.span>
          </h2>
        </div>

        {/* ChatGPT at the center, the rest of the ecosystem around it */}
        <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[26rem]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
            {AI_CATEGORIES.map((c, i) => {
              const p = point(i);
              return (
                <motion.path
                  key={c.id}
                  d={`M50 50 L${p.x} ${p.y}`}
                  fill="none"
                  strokeWidth={0.3}
                  className="stroke-green-bright/35"
                  variants={link(i)}
                />
              );
            })}
          </svg>

          <motion.div
            className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-green-bright/60 bg-navy-dark shadow-[0_0_40px_rgb(53_201_94/0.3)] sm:size-24"
            variants={{
              hidden: { opacity: 0, scale: 0.5 },
              visible: { opacity: 1, scale: 1, transition: transition(DURATION.slow, 0.5) },
            }}
          >
            <BrandIcon src={AI_TOOLS.chatgpt.icon} className="size-9 text-white sm:size-11" />
          </motion.div>

          {AI_CATEGORIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.id}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                variants={burst(i)}
              >
                <span className="grid size-11 place-items-center rounded-full border border-white/15 bg-navy-dark text-gray-light sm:size-14">
                  <Icon strokeWidth={1.5} className="size-5 sm:size-6" />
                </span>
                <span className="hud-label whitespace-nowrap">{c.label}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}
