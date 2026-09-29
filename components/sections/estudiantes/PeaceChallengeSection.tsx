"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dices } from "lucide-react";
import { useState } from "react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { PEACE, type CampaignFormat, type CampaignTopic } from "@/lib/content/estudiantes";
import type { SectionProps } from "@/types/presentation";

interface Draw {
  topic: CampaignTopic;
  format: CampaignFormat;
  /** Replays the entrance even when the same pair comes out twice. */
  n: number;
}

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** Session 2 opens here: the three topics, the three formats, and a draw for each team's challenge. */
export function PeaceChallengeSection({ id, index, label }: SectionProps) {
  const [draw, setDraw] = useState<Draw | null>(null);

  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgb(255_242_0/0.07)_0%,transparent_55%)]"
      />
      <motion.div
        className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 md:px-16 lg:py-12"
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
          className="mt-5 font-display text-[clamp(2.25rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.04em]"
        >
          🕊️ {PEACE.title}
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-5 max-w-3xl text-lg leading-snug text-gray-text md:text-2xl">
          {PEACE.lead}
        </motion.p>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
          <OptionList title={PEACE.topicsTitle} items={PEACE.topics} active={draw?.topic.id} />
          <OptionList title={PEACE.formatsTitle} items={PEACE.formats} active={draw?.format.id} />
        </div>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() =>
              setDraw((prev) => ({ topic: pick(PEACE.topics), format: pick(PEACE.formats), n: (prev?.n ?? 0) + 1 }))
            }
            className="inline-flex shrink-0 cursor-pointer items-center gap-3 self-start rounded-full bg-yellow px-7 py-4 text-lg font-bold text-navy-dark transition-[filter,transform] hover:scale-[1.03] hover:brightness-105"
          >
            <Dices aria-hidden="true" className="size-6" strokeWidth={2} />
            {draw ? PEACE.drawAgain : PEACE.draw}
          </button>
          <AnimatePresence mode="wait">
            {draw && (
              <motion.p
                key={draw.n}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0, transition: transition(DURATION.base) }}
                exit={{ opacity: 0, transition: transition(DURATION.fast) }}
                aria-live="polite"
                className="text-lg text-gray-text md:text-xl"
              >
                <span className="hud-label mr-3 text-yellow">{PEACE.drawnLabel}</span>
                <span className="font-bold text-white">{draw.topic.label}</span> ·{" "}
                <span className="font-bold text-white">{draw.format.label}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </Section>
  );
}

interface OptionListProps {
  title: string;
  items: readonly (CampaignTopic | CampaignFormat)[];
  active?: string;
}

function OptionList({ title, items, active }: OptionListProps) {
  return (
    <motion.div variants={fadeUp}>
      <p className="hud-label">{title}</p>
      <ul className="mt-4 grid gap-3">
        {items.map(({ id, label, icon: Icon }) => {
          const on = id === active;
          return (
            <li
              key={id}
              className={cn(
                "flex items-center gap-4 rounded-2xl border-2 p-4 transition-[border-color,background-color] duration-500",
                on ? "border-yellow bg-yellow/10" : "border-white/10 bg-navy/60",
              )}
            >
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-500",
                  on ? "bg-yellow text-navy-dark" : "bg-green/15 text-green-bright",
                )}
              >
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              <span className="font-display text-lg font-bold leading-tight tracking-[-0.01em] md:text-xl">
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
