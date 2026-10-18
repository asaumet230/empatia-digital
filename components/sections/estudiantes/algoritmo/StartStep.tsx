"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { DURATION, transition } from "@/lib/animations";
import { GAME } from "./shared";

export function StartStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center text-center">
      <button
        type="button"
        onClick={onStart}
        className="inline-flex cursor-pointer items-center gap-4 rounded-full bg-green-bright px-10 py-5 font-display text-2xl font-bold text-navy-dark shadow-[0_0_40px_rgb(53_201_94/0.35)] transition-[filter,transform] hover:scale-[1.03] hover:brightness-110 md:text-3xl"
      >
        <Play aria-hidden="true" className="size-7 fill-current" strokeWidth={2} />
        {GAME.start}
      </button>
      <div className="mt-10 w-full max-w-3xl text-left">
        <p className="hud-label text-center">{GAME.howToTitle}</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {GAME.howTo.map(({ mark, text }, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: transition(DURATION.base, 0.2 + i * 0.1) }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-navy/70 p-4"
            >
              <span aria-hidden="true" className="text-3xl leading-none">
                {mark}
              </span>
              <span className="text-base font-semibold leading-snug text-gray-light md:text-lg">{text}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
