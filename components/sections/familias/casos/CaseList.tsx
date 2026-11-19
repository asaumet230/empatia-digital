"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCarousel } from "@/hooks/useCarousel";
import { cn } from "@/lib/cn";
import { FAMILY_CASES } from "@/lib/content/familias";
import { twoDigits } from "@/lib/format";

/** One color per case (the prompt-part palette), so the list reads at a glance. */
const CASE_COLORS = ["#35C95E", "#5AB8FF", "#FFD23F", "#B69CFF", "#FF7A7A", "#FF9F43"];
const caseColor = (i: number) => CASE_COLORS[i % CASE_COLORS.length];

interface CaseListProps {
  selected: number | null;
  onOpen: (i: number) => void;
}

/** The ten cases: a swipeable carousel with arrows on phones, a two-column grid from `sm` up. */
export function CaseList({ selected, onOpen }: CaseListProps) {
  const { track, current: slide, goTo, onScroll } = useCarousel<HTMLUListElement>();

  return (
    <>
      <ul
        ref={track}
        onScroll={onScroll}
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-2.5 overflow-x-auto px-6 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {FAMILY_CASES.map((c, i) => {
          const Icon = c.icon;
          const on = i === selected;
          return (
            <li key={c.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onOpen(i)}
                className={cn(
                  "group flex h-full min-h-28 w-full items-center gap-3 rounded-2xl border p-3 text-left sm:min-h-0 transition-[border-color,background-color,opacity] duration-300 md:p-3.5",
                  on
                    ? "border-green-bright bg-green-bright/10"
                    : "border-white/10 bg-white/3 hover:border-green-bright/50 hover:bg-white/5",
                  selected !== null && !on && "opacity-60 hover:opacity-100",
                )}
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-300",
                    on && "bg-green-bright text-navy-dark",
                  )}
                  style={on ? undefined : { color: caseColor(i), backgroundColor: `${caseColor(i)}26` }}
                >
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </span>
                <span className={cn("text-[0.9375rem] font-semibold leading-snug", on ? "text-white" : "text-gray-light")}>
                  <span className={cn("mr-1.5 font-mono text-xs", on ? "text-green-bright" : "text-gray-text")}>
                    {twoDigits(i + 1)}
                  </span>
                  {c.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Phone controls: arrows on the sides of the counter */}
      <div className="mt-4 flex items-center justify-between gap-3 sm:hidden">
        <button
          type="button"
          aria-label="Caso anterior"
          onClick={() => goTo(slide - 1)}
          disabled={slide === 0}
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/6 px-4 font-semibold text-white transition-colors disabled:opacity-30"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
          Anterior
        </button>
        <span className="font-mono text-sm text-gray-light" aria-live="polite">
          {twoDigits(slide + 1)} / {twoDigits(FAMILY_CASES.length)}
        </span>
        <button
          type="button"
          aria-label="Caso siguiente"
          onClick={() => goTo(slide + 1)}
          disabled={slide === FAMILY_CASES.length - 1}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-green-bright px-4 font-bold text-navy-dark transition-opacity disabled:opacity-30"
        >
          Siguiente
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
      </div>
    </>
  );
}
