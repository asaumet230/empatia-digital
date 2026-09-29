"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState, type PointerEvent } from "react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, EASE, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { ANSWERS, SURVEY_QUESTIONS, SURVEY_RESPONSES, countAnswers } from "@/lib/content/encuesta-ejemplo";
import {
  ANSWER_COLORS,
  REPORT_ASPECTS,
  REPORT_BLOCK,
  REPORT_THEMES,
  STATUS,
  type ReportAspect,
} from "@/lib/content/prompt-alertas";
import type { SectionProps } from "@/types/presentation";

const TOTAL = SURVEY_RESPONSES.length;
const percent = (n: number) => `${Math.round((n / TOTAL) * 100)} %`;
const students = (n: number) => `${n} ${n === 1 ? "estudiante" : "estudiantes"}`;

const swap = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
  exit: { opacity: 0, y: -8, filter: "blur(6px)", transition: transition(DURATION.fast, 0, EASE.inOutQuint) },
};

/**
 * "Así se ve el resultado" — the report a teacher gets, built from the sample answers:
 * a traffic light per topic; hovering a topic opens its numbers, reading and voices.
 */
export function AlertReportSection({ id, index, label }: SectionProps) {
  const [active, setActive] = useState<number | null>(null);
  const aspect = active === null ? null : REPORT_ASPECTS[active];

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
              <Eyebrow index={index}>{REPORT_BLOCK.eyebrow}</Eyebrow>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-5 font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]"
            >
              {REPORT_BLOCK.title}
            </motion.h2>
          </div>
          <motion.div variants={fadeUp} className="lg:text-right">
            <p className="inline-block rounded-full border border-white/15 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-gray-light">
              {REPORT_BLOCK.sample}
            </p>
            <p className="mt-2 text-sm text-gray-muted">{REPORT_BLOCK.caution}</p>
          </motion.div>
        </div>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
          {/* Traffic light */}
          <motion.div variants={fadeUp}>
            <Legend />
            <ul className="mt-4 border-t border-line">
              {REPORT_ASPECTS.map((a, i) => (
                <AspectRow
                  key={a.question}
                  aspect={a}
                  on={i === active}
                  dimmed={active !== null && i !== active}
                  onSelect={() => setActive(i)}
                />
              ))}
            </ul>
            <p className="hud-label mt-4">
              <span className="hidden [@media(hover:hover)]:inline">{REPORT_BLOCK.hint.pointer}</span>
              <span className="[@media(hover:hover)]:hidden">{REPORT_BLOCK.hint.touch}</span>
            </p>
          </motion.div>

          {/* Detail */}
          <motion.div variants={fadeUp} aria-live="polite" className="lg:min-h-[30rem]">
            <AnimatePresence mode="wait" initial={false}>
              {aspect ? (
                <motion.div key={aspect.question} {...swap}>
                  <AspectDetail aspect={aspect} onBack={() => setActive(null)} />
                </motion.div>
              ) : (
                <motion.div key="overview" {...swap}>
                  <Overview />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {ANSWERS.map((answer, i) => (
        <span key={answer} className="flex items-center gap-2 text-sm text-gray-text">
          <span aria-hidden="true" className="size-2.5 rounded-sm" style={{ backgroundColor: ANSWER_COLORS[i] }} />
          {answer}
        </span>
      ))}
    </div>
  );
}

interface AspectRowProps {
  aspect: ReportAspect;
  on: boolean;
  dimmed: boolean;
  onSelect: () => void;
}

function AspectRow({ aspect, on, dimmed, onSelect }: AspectRowProps) {
  const counts = countAnswers(aspect.question);
  const status = STATUS[aspect.status];

  return (
    <li className="border-b border-line">
      <button
        type="button"
        aria-pressed={on}
        aria-label={`${aspect.label}: ${status.label}`}
        onPointerEnter={(e: PointerEvent) => e.pointerType === "mouse" && onSelect()}
        onClick={onSelect}
        onFocus={onSelect}
        className={cn(
          "grid w-full grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 py-2.5 text-left transition-opacity duration-300 sm:grid-cols-[1.25rem_minmax(0,13rem)_minmax(0,1fr)]",
          dimmed && "opacity-45",
        )}
      >
        <span
          aria-hidden="true"
          className="size-3 rounded-full"
          style={{ backgroundColor: status.color, boxShadow: on ? `0 0 12px ${status.color}` : undefined }}
        />
        <span className={cn("text-[0.9375rem] font-semibold md:text-base", on ? "text-white" : "text-gray-light")}>
          {aspect.label}
        </span>
        <motion.span
          aria-hidden="true"
          className="col-start-2 flex h-2.5 origin-left overflow-hidden rounded-full sm:col-start-3"
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: transition(DURATION.slow, 0.2, EASE.outQuart) },
          }}
        >
          {counts.map((n, i) =>
            n > 0 ? (
              <span
                key={ANSWERS[i]}
                className="h-full border-r border-navy-dark last:border-r-0"
                style={{ width: `${(n / TOTAL) * 100}%`, backgroundColor: ANSWER_COLORS[i] }}
              />
            ) : null,
          )}
        </motion.span>
      </button>
    </li>
  );
}

function AspectDetail({ aspect, onBack }: { aspect: ReportAspect; onBack: () => void }) {
  const counts = countAnswers(aspect.question);
  const status = STATUS[aspect.status];

  return (
    <div>
      <span
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-navy-dark"
        style={{ backgroundColor: status.color }}
      >
        {status.label}
      </span>
      <h3 className="mt-4 font-display text-[clamp(1.375rem,2.4vw,2rem)] font-bold leading-[1.1] tracking-[-0.02em]">
        {aspect.label}
      </h3>
      <p className="mt-2 text-sm italic text-gray-muted">
        Pregunta {aspect.question + 1}: “{SURVEY_QUESTIONS[aspect.question]}”
      </p>

      <ul className="mt-5 space-y-2">
        {ANSWERS.map((answer, i) => (
          <li
            key={answer}
            className="grid grid-cols-[7.5rem_minmax(0,1fr)_auto] items-center gap-3 text-sm md:text-[0.9375rem]"
          >
            <span className="text-gray-light">{answer}</span>
            <span className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.span
                className="block h-full origin-left rounded-full"
                style={{ width: `${(counts[i] / TOTAL) * 100}%`, backgroundColor: ANSWER_COLORS[i] }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={transition(DURATION.base, 0.05 * i, EASE.outQuart)}
              />
            </span>
            <span className="tabular-nums text-gray-text">
              {students(counts[i])} — {percent(counts[i])}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-base leading-relaxed text-gray-light md:text-lg">{aspect.reading}</p>

      {aspect.quotes && (
        <div className="mt-5 space-y-2">
          {aspect.quotes.map((q) => (
            <p
              key={q}
              className="border-l-2 border-white/20 pl-3 text-sm italic leading-snug text-gray-text md:text-[0.9375rem]"
            >
              “{SURVEY_RESPONSES[q].open}”
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

function Overview() {
  const tally = (Object.keys(STATUS) as (keyof typeof STATUS)[]).map((key) => ({
    ...STATUS[key],
    key,
    count: REPORT_ASPECTS.filter((a) => a.status === key).length,
  }));
  const maxTheme = Math.max(...REPORT_THEMES.map((t) => t.responses.length));

  return (
    <div>
      <ul className="grid grid-cols-3 gap-3">
        {tally.map((t) => (
          <li key={t.key} className="rounded-xl border border-white/10 bg-navy/50 p-3 md:p-4">
            <span className="font-display text-3xl font-extrabold md:text-4xl" style={{ color: t.color }}>
              {t.count}
            </span>
            <span className="mt-1 block text-xs leading-tight text-gray-text md:text-sm">{t.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-yellow/30 bg-yellow/[0.04] p-4 md:p-5">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-yellow">
          {REPORT_BLOCK.keyReading.title}
        </p>
        <p className="mt-2 text-base leading-snug text-gray-light md:text-lg">{REPORT_BLOCK.keyReading.text}</p>
      </div>

      <p className="mt-7 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gray-muted">
        {REPORT_BLOCK.themesTitle}
      </p>
      <ul className="mt-3 space-y-2.5">
        {REPORT_THEMES.map((theme) => (
          <li
            key={theme.label}
            className="grid grid-cols-[minmax(0,1fr)_6rem_auto] items-center gap-3 text-sm md:text-[0.9375rem]"
          >
            <span className="text-gray-light">{theme.label}</span>
            <span className="h-2 overflow-hidden rounded-full bg-white/5">
              <span
                className="block h-full rounded-full bg-green-bright/70"
                style={{ width: `${(theme.responses.length / maxTheme) * 100}%` }}
              />
            </span>
            <span className="tabular-nums text-gray-text">
              {theme.responses.length} {theme.responses.length === 1 ? "respuesta" : "respuestas"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
