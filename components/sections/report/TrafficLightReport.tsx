"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, MousePointerClick } from "lucide-react";
import { useState, type PointerEvent } from "react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, EASE, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { SURVEY_REPORT } from "@/lib/content/prompt-alertas";
import { RUBRIC_REPORT } from "@/lib/content/prompt-rubrica";
import { SCALE_COLORS, STATUS, type Report, type ReportRow } from "@/lib/content/report";
import type { SectionProps } from "@/types/presentation";

const swap = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
  exit: { opacity: 0, y: -8, filter: "blur(6px)", transition: transition(DURATION.fast, 0, EASE.inOutQuint) },
};

export const SurveyReportSection = (props: SectionProps) => <TrafficLightReport {...props} report={SURVEY_REPORT} />;
export const RubricReportSection = (props: SectionProps) => <TrafficLightReport {...props} report={RUBRIC_REPORT} />;

/**
 * "Así se ve el resultado" — the report a teacher gets back, as an interactive traffic light:
 * one row per topic; hovering a row opens its numbers, a plain reading and the voices behind it.
 */
function TrafficLightReport({ id, index, label, report }: SectionProps & { report: Report }) {
  const [active, setActive] = useState<number | null>(null);
  const row = active === null ? null : report.rows[active];

  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy-dark">
      <motion.div
        className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 md:px-16 lg:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.08)}
        onKeyDown={(e) => e.key === "Escape" && setActive(null)}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.div variants={fadeUp}>
              <Eyebrow index={index}>{report.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-5 font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]"
            >
              {report.title}
            </motion.h2>
          </div>
          <motion.div variants={fadeUp} className="lg:max-w-sm lg:text-right">
            <p className="inline-block rounded-full border border-white/15 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-gray-light">
              {report.sample}
            </p>
            <p className="mt-2 text-sm text-gray-muted">{report.caution}</p>
          </motion.div>
        </div>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
          {/* Traffic light */}
          <motion.div variants={fadeUp}>
            <Legend scale={report.scale} />
            <ul className="mt-4 border-t border-line">
              {report.rows.map((r, i) => (
                <Row
                  key={r.key}
                  row={r}
                  total={report.total}
                  on={i === active}
                  dimmed={active !== null && i !== active}
                  onSelect={() => setActive(i)}
                />
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-sm text-gray-text">
              <MousePointerClick aria-hidden="true" className="size-4 shrink-0 text-green-bright" />
              <span className="hidden [@media(hover:hover)]:inline">{report.hint.pointer}</span>
              <span className="[@media(hover:hover)]:hidden">{report.hint.touch}</span>
            </p>
          </motion.div>

          {/* Detail */}
          <motion.div variants={fadeUp} aria-live="polite" className="lg:min-h-[30rem]">
            <AnimatePresence mode="wait" initial={false}>
              {row ? (
                <motion.div key={row.key} {...swap}>
                  <Detail row={row} report={report} onBack={() => setActive(null)} />
                </motion.div>
              ) : (
                <motion.div key="overview" {...swap}>
                  <Overview report={report} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}

function Legend({ scale }: { scale: readonly string[] }) {
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

function Row({ row, total, on, dimmed, onSelect }: RowProps) {
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
          "-mx-2 grid w-[calc(100%+1rem)] grid-cols-[minmax(0,1fr)] gap-2 rounded-xl px-2 py-3 text-left transition-[opacity,background-color] duration-300 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:items-center sm:gap-4",
          on && "bg-white/[0.04]",
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

function Detail({ row, report, onBack }: { row: ReportRow; report: Report; onBack: () => void }) {
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

function Overview({ report }: { report: Report }) {
  const tally = (Object.keys(STATUS) as (keyof typeof STATUS)[]).map((key) => ({
    ...STATUS[key],
    key,
    count: report.rows.filter((r) => r.status === key).length,
  }));
  const maxWeight = Math.max(1, ...report.list.items.map((item) => item.weight ?? 0));

  return (
    <div>
      <ul className="grid grid-cols-3 gap-3">
        {tally.map((t) => (
          <li key={t.key} className="rounded-xl border border-white/10 bg-navy/50 p-3 md:p-4">
            <span className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-extrabold md:text-4xl" style={{ color: t.color }}>
                {t.count}
              </span>
              <span className="text-sm text-gray-text">de {report.rows.length}</span>
            </span>
            <span className="mt-1 block text-xs leading-tight text-gray-text md:text-sm">{t.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-yellow/30 bg-yellow/[0.04] p-4 md:p-5">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-yellow">{report.keyReading.title}</p>
        <p className="mt-2 text-base leading-snug text-gray-light md:text-lg">{report.keyReading.text}</p>
      </div>

      <p className="mt-7 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gray-muted">{report.list.title}</p>
      <ul className="mt-3 space-y-2.5">
        {report.list.items.map((item) =>
          item.weight !== undefined ? (
            <li
              key={item.label}
              className="grid grid-cols-[minmax(0,1fr)_6rem_auto] items-center gap-3 text-sm md:text-[0.9375rem]"
            >
              <span className="text-gray-light">{item.label}</span>
              <span className="h-2 overflow-hidden rounded-full bg-white/5">
                <span
                  className="block h-full rounded-full bg-green-bright/70"
                  style={{ width: `${(item.weight / maxWeight) * 100}%` }}
                />
              </span>
              <span className="tabular-nums text-gray-text">{item.value}</span>
            </li>
          ) : (
            <li key={item.label} className="flex items-start gap-3 text-sm">
              <span className="w-12 shrink-0 rounded-md bg-white/10 py-0.5 text-center font-mono text-xs font-semibold tracking-[0.06em] text-white">
                {item.label}
              </span>
              <span className="flex flex-wrap gap-1.5">
                {item.value.split(", ").map((part) => (
                  <span key={part} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-gray-light">
                    {part}
                  </span>
                ))}
              </span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
