"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { DURATION, EASE, transition } from "@/lib/animations";
import { formatNumber, GAME, PrimaryButton } from "./shared";

export function ResultStep({ likes, onNext }: { likes: number; onNext: () => void }) {
  const won = likes >= GAME.goal;
  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, transition: transition(DURATION.base, 0.1) }}
        className="font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold tracking-[-0.03em]"
      >
        {won ? GAME.result.win : GAME.result.lose}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: transition(DURATION.slow, 0.4, EASE.outExpo) }}
        className="mt-4 font-display text-[clamp(4rem,12vw,9rem)] font-extrabold leading-none tabular-nums text-yellow text-glow-yellow"
      >
        {formatNumber(likes)}
      </motion.p>
      <p className="mt-2 flex items-center gap-2 text-xl font-semibold text-gray-light">
        <Heart aria-hidden="true" className="size-5 fill-[#FF6B6B] text-[#FF6B6B]" /> {GAME.likesLabel}
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: transition(DURATION.base, 1.4) }}
        className="mt-10"
      >
        <PrimaryButton onClick={onNext}>
          {GAME.result.reveal}
          <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2} />
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
