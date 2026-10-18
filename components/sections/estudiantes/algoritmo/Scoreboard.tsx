"use client";

import { animate, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { formatNumber, GAME, ROUNDS } from "./shared";

/** The score the class is chasing: animated «me gusta» and how close they are to the goal. */
export function LikesCard({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const controls = animate(from.current, value, {
      duration: DURATION.slow,
      ease: EASE.outExpo,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    from.current = value;
    return () => controls.stop();
  }, [value]);

  const progress = Math.min(1, value / GAME.goal);

  return (
    <div className="min-w-60 rounded-xl border-2 border-white/20 bg-white/[0.06] px-4 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-bold uppercase tracking-[0.08em] text-white md:text-sm">
          <Heart aria-hidden="true" className="size-4 fill-[#FF6B6B] text-[#FF6B6B]" strokeWidth={2} />
          {GAME.likesLabel}
        </span>
        <motion.span
          key={value}
          aria-live="polite"
          initial={{ scale: 1.3 }}
          animate={{ scale: 1, transition: transition(DURATION.base) }}
          className="origin-right whitespace-nowrap font-display text-2xl font-extrabold tabular-nums"
        >
          {formatNumber(shown)}
        </motion.span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-yellow to-[#FF6B6B]"
          animate={{ width: `${progress * 100}%` }}
          transition={transition(DURATION.slow)}
        />
      </div>
      <p className="mt-1 text-right font-mono text-[0.625rem] uppercase tracking-[0.14em] text-gray-muted">
        {GAME.goalLabel} {formatNumber(GAME.goal)}
      </p>
    </div>
  );
}

export function RoundProgress({ current }: { current: number }) {
  return (
    <div className="hidden w-36 sm:block">
      <p className="hud-label text-right">
        Ronda {current + 1} de {ROUNDS.length}
      </p>
      <ol className="mt-2 flex gap-1.5" aria-hidden="true">
        {ROUNDS.map((round, i) => (
          <li
            key={round.title}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-500",
              i < current ? "bg-green-bright" : i === current ? "bg-white/60" : "bg-white/12",
            )}
          />
        ))}
      </ol>
    </div>
  );
}
