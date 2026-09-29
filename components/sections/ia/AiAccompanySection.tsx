"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, House, School } from "lucide-react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, EASE, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { AI_BLOCK } from "@/lib/content/ia-ecosistema";
import type { SectionProps } from "@/types/presentation";

type Place = keyof typeof AI_BLOCK.transition.places;

const PLACE_ICONS = { escuela: School, hogar: House } as const;

const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: transition(DURATION.cinematic, 0.2, EASE.outExpo) },
};

export const AiAccompanySchoolSection = (props: SectionProps) => <AiAccompanySection {...props} place="escuela" />;
export const AiAccompanyHomeSection = (props: SectionProps) => <AiAccompanySection {...props} place="hogar" />;

/** The message for adults, and the bridge to the next block: the school or the home, per audience. */
function AiAccompanySection({ id, index, label, place }: SectionProps & { place: Place }) {
  const { adults, transition: next } = AI_BLOCK;
  const Icon = PLACE_ICONS[place];

  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgb(36_157_74/0.14)_0%,transparent_60%)]"
      />

      <motion.div
        className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 md:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer(0.14)}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow index={index}>{label}</Eyebrow>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-8 max-w-5xl font-display text-[clamp(1.75rem,4.4vw,3.75rem)] font-bold leading-[1.08] tracking-[-0.03em]"
        >
          {adults.lead}
        </motion.p>
        <motion.p variants={fadeUp} className="mt-6 max-w-3xl text-lg leading-snug text-gray-text md:mt-8 md:text-2xl">
          {adults.body} <span className="font-semibold text-green-bright text-glow-green">{adults.emphasis}</span>
        </motion.p>

        {/* Bridge to the next block */}
        <motion.div variants={fadeUp} className="mt-16 md:mt-24">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-0">
            <p className="text-lg text-gray-text md:text-xl">{next.lead}</p>
            <span aria-hidden="true" className="relative mx-6 hidden h-px w-16 sm:block md:w-28">
              <motion.span
                className="absolute inset-0 origin-left bg-linear-to-r from-green-bright/20 to-green-bright/80"
                variants={drawLine}
              />
              <ArrowRight className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 text-green-bright/80" />
            </span>
            <div className="flex items-center gap-4 rounded-full border border-green-bright/40 bg-green/10 py-3 pl-3 pr-6">
              <span className="grid size-10 place-items-center rounded-full bg-green-bright text-navy-dark">
                <Icon aria-hidden="true" strokeWidth={1.75} className="size-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-[-0.02em] md:text-2xl">
                {next.places[place]}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
