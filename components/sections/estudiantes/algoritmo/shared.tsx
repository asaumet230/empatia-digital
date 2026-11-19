import type { ReactNode } from "react";
import { swapVariants } from "@/lib/animations";
import { ALGORITHM_GAME } from "@/lib/content/estudiantes";

/* ------------------------------------------------------------------ */
/*  Shared pieces of "Tú eres el algoritmo": game data, formatting,     */
/*  the step transition and the main button. Rules: lib/algoritmo.     */
/* ------------------------------------------------------------------ */

export const GAME = ALGORITHM_GAME;
export const ROUNDS = GAME.rounds;
/** How long a round's outcome stays on screen before the next round starts by itself. */
export const AUTO_NEXT_MS = 2500;

export const formatNumber = (n: number) => n.toLocaleString("es-CO");

export const swap = swapVariants(14, 10);

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
