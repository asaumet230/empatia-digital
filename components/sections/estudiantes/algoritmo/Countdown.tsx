"use client";

import { Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { GAME } from "./shared";

/** Rounds get shorter; when time runs out the algorithm decides by itself. */
export function Countdown({ seconds, running, onTimeUp }: { seconds: number; running: boolean; onTimeUp: () => void }) {
  const [left, setLeft] = useState(seconds);
  const timeUp = useRef(onTimeUp);

  useEffect(() => {
    timeUp.current = onTimeUp;
  });

  useEffect(() => {
    if (!running || left === 0) return;
    const t = window.setTimeout(() => {
      setLeft(left - 1);
      if (left === 1) timeUp.current();
    }, 1000);
    return () => window.clearTimeout(t);
  }, [left, running]);

  const out = left === 0;
  return (
    <span
      aria-live={out ? "polite" : "off"}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 self-start rounded-full border-2 px-4 py-1.5 font-display text-2xl font-bold tabular-nums transition-colors duration-300 sm:self-auto",
        out && "border-[#FF6B6B] text-[#FF6B6B]",
        !out && !running && "border-white/15 text-gray-muted",
        !out && running && left > 5 && "border-white/30 text-white",
        !out && running && left <= 5 && "animate-pulse border-yellow text-yellow",
      )}
    >
      <Timer aria-hidden="true" className="size-6" strokeWidth={2.25} />
      {out ? GAME.timeUp : `${left} s`}
    </span>
  );
}
