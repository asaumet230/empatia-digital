"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { DURATION, EASE, transition } from "@/lib/animations";
import { SCALE_COLORS, STATUS, type Report, type ReportRow } from "@/lib/content/report";

/** One topic opened: its numbers per level, a plain reading, who to accompany and the voices behind it. */

export function ReportDetail({ row, report, onBack }: { row: ReportRow; report: Report; onBack: () => void }) {
  const status = STATUS[row.status];

  return (
    <div>
      <span
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-navy-dark"
        style={{ backgroundColor: status.color }}
      >
        {status.label}
      </span>
      <h3 className="mt-4 font-display text-[clamp(1.375rem,2.4vw,2rem)] font-bold leading-[1.1] tracking-[-0.02em]">
        {row.label}
      </h3>
      {row.source && <p className="mt-2 text-sm italic text-gray-muted">{row.source}</p>}

      <ul className="mt-5 space-y-2">
        {report.scale.map((step, i) => (
          <li
            key={step}
            className="grid grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)_auto] items-center gap-3 text-sm md:text-[0.9375rem]"
          >
            <span className="text-gray-light">{step}</span>
            <span className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.span
                className="block h-full origin-left rounded-full"
                style={{ width: `${(row.counts[i] / report.total) * 100}%`, backgroundColor: SCALE_COLORS[i] }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={transition(DURATION.base, 0.05 * i, EASE.outQuart)}
              />
            </span>
            <span className="tabular-nums text-gray-text">
              {row.counts[i]} de {report.total}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-base leading-relaxed text-gray-light md:text-lg">{row.reading}</p>

      {row.people && row.people.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-muted">Conviene acompañar:</span>
          {row.people.map((code) => (
            <span
              key={code}
              className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-xs tracking-[0.08em] text-gray-light"
            >
              {code}
            </span>
          ))}
        </div>
      )}

      {row.quotes && row.quotes.length > 0 && (
        <div className="mt-5 space-y-2">
          {row.quotes.map((quote) => (
            <p
              key={quote}
              className="border-l-2 border-white/20 pl-3 text-sm italic leading-snug text-gray-text md:text-[0.9375rem]"
            >
              {quote}
            </p>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="mt-6 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gray-muted transition-colors hover:text-white"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Ver el resumen
      </button>
    </div>
  );
}
