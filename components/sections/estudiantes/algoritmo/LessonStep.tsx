"use client";

import { motion } from "framer-motion";
import { ArrowDown, RotateCcw } from "lucide-react";
import { DURATION, transition } from "@/lib/animations";
import { GAME } from "./shared";

export function LessonStep({ onRestart }: { onRestart: () => void }) {
  const { lesson } = GAME;
  return (
    <div className="mx-auto max-w-5xl">
      <h3 className="font-display text-[clamp(1.75rem,4vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em]">
        {lesson.title}
      </h3>
      <ul className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
        {lesson.points.map(({ mark, text }, i) => (
          <motion.li
            key={text}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: transition(DURATION.base, 0.15 + i * 0.15) }}
            className="rounded-2xl border border-white/10 bg-navy/70 p-6"
          >
            <span aria-hidden="true" className="text-4xl leading-none">
              {mark}
            </span>
            <p className="mt-4 text-lg font-semibold leading-snug text-white">{text}</p>
          </motion.li>
        ))}
      </ul>
      <p className="mt-10 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight tracking-[-0.02em]">
        {lesson.question}
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex cursor-pointer items-center gap-3 self-start rounded-full border border-white/20 px-6 py-3.5 text-base font-semibold text-gray-light transition-colors hover:border-green-bright hover:text-white"
        >
          <RotateCcw aria-hidden="true" className="size-5" strokeWidth={2} />
          {lesson.restart}
        </button>
        <p className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-green-bright">
          {lesson.afterGame}
          <ArrowDown aria-hidden="true" className="size-4" strokeWidth={2} />
        </p>
      </div>
    </div>
  );
}
