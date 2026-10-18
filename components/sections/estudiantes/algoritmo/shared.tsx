import type { ReactNode } from "react";
import { DURATION, EASE, transition } from "@/lib/animations";
import { ALGORITHM_GAME } from "@/lib/content/estudiantes";

/* ------------------------------------------------------------------ */
/*  Shared pieces of "Tú eres el algoritmo": game data, formatting,     */
/*  the step transition and the main button.                           */
/* ------------------------------------------------------------------ */

export const GAME = ALGORITHM_GAME;
export const ROUNDS = GAME.rounds;
/** How long a round's outcome stays on screen before the next round starts by itself. */
export const AUTO_NEXT_MS = 2500;

export const formatNumber = (n: number) => n.toLocaleString("es-CO");

/** How much the boosted posts hurt Valentina; picks her messages and the story's ending. */
export const harmLevel = (harm: number) =>
  harm >= GAME.valentina.high.min ? "high" : harm >= GAME.valentina.medium.min ? "medium" : "low";

export const swap = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
  exit: { opacity: 0, y: -10, filter: "blur(6px)", transition: transition(DURATION.fast, 0, EASE.inOutQuint) },
};

export function PrimaryButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 cursor-pointer items-center gap-3 rounded-full bg-green-bright px-6 py-3.5 text-base font-bold text-navy-dark transition-[filter] hover:brightness-110"
    >
      {children}
    </button>
  );
}
