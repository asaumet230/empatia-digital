"use client";

import { motion } from "framer-motion";
import type { PointerEvent } from "react";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { SCALE_COLORS, STATUS, type ReportRow } from "@/lib/content/report";

/* The traffic light itself: what each color means, and one bar per topic. */

export function Legend({ scale }: { scale: readonly string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-navy/40 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-text">Cada color de la barra es un nivel</p>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
        {scale.map((step, i) => (
          <span key={step} className="flex items-center gap-2 text-sm text-gray-light">
            <span aria-hidden="true" className="size-3 rounded-sm" style={{ backgroundColor: SCALE_COLORS[i] }} />
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

interface RowProps {
  row: ReportRow;
  total: number;
  on: boolean;
  dimmed: boolean;
  onSelect: () => void;
}

export function Row({ row, total, on, dimmed, onSelect }: RowProps) {
  const status = STATUS[row.status];

  return (
    <li className="border-b border-line">
      <button
        type="button"
        aria-pressed={on}
        aria-label={`${row.label}: ${status.label}`}
        onPointerEnter={(e: PointerEvent) => e.pointerType === "mouse" && onSelect()}
        onClick={onSelect}
        onFocus={onSelect}
        className={cn(
          "-mx-4 grid w-[calc(100%+2rem)] grid-cols-[minmax(0,1fr)] gap-2 rounded-xl px-4 py-3 text-left transition-[opacity,background-color] duration-300 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:items-center sm:gap-4",
          on && "bg-white/4",
          dimmed && "opacity-45",
        )}
      >
        <span className="flex flex-col gap-1">
          <span className={cn("text-[0.9375rem] font-semibold md:text-base", on ? "text-white" : "text-gray-light")}>
            {row.label}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: status.color }}>
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: status.color, boxShadow: on ? `0 0 10px ${status.color}` : undefined }}
            />
            {status.label}
          </span>
        </span>
        <motion.span
          aria-hidden="true"
          className="flex h-6 origin-left overflow-hidden rounded-lg"
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: transition(DURATION.slow, 0.2, EASE.outQuart) },
          }}
        >
          {row.counts.map((n, i) =>
            n > 0 ? (
              <span
                key={i}
                className="grid h-full place-items-center border-r-2 border-navy-dark text-xs font-bold tabular-nums text-navy-dark last:border-r-0"
                style={{ width: `${(n / total) * 100}%`, backgroundColor: SCALE_COLORS[i] }}
              >
                {n}
              </span>
            ) : null,
          )}
        </motion.span>
      </button>
    </li>
  );
}
