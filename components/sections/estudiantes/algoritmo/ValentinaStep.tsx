"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DURATION, EASE, transition } from "@/lib/animations";
import { GAME, harmLevel, PrimaryButton } from "./shared";

/** The twist: her messages, one by one, depending on how much the boosted posts hurt her. */
export function ValentinaStep({ harm, onNext }: { harm: number; onNext: () => void }) {
  const { valentina } = GAME;
  const level = valentina[harmLevel(harm)];
  const delay = (i: number) => 0.6 + i * 1.4;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-center font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold tracking-[-0.03em]">
        {valentina.title}
      </p>
      <div className="mt-8 rounded-3xl border border-white/10 bg-navy/80 p-5 md:p-7">
        <p className="flex items-center gap-3 border-b border-white/10 pb-4 text-sm font-bold text-gray-light">
          <span className="grid size-10 place-items-center rounded-full bg-white/10 text-xl">🙁</span>
          @vale.m
        </p>
        <ul className="mt-5 grid gap-3">
          {level.messages.map((message, i) => (
            <motion.li
              key={message}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: transition(DURATION.base, delay(i), EASE.outExpo) }}
              className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-5 py-3 text-lg font-medium leading-snug text-navy-dark md:text-xl"
            >
              {message}
            </motion.li>
          ))}
        </ul>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: transition(DURATION.base, delay(level.messages.length) + 0.4) }}
        className="mt-8 flex justify-center"
      >
        <PrimaryButton onClick={onNext}>
          {valentina.next}
          <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2} />
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
