"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import { useState } from "react";
import { Section } from "@/components/presentation/Section";
import { ReportDetail } from "@/components/sections/report/ReportDetail";
import { ReportOverview } from "@/components/sections/report/ReportOverview";
import { Legend, Row } from "@/components/sections/report/ReportRows";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SlideTitle } from "@/components/ui/SlideTitle";
import { fadeUp, staggerContainer, swap } from "@/lib/animations";
import { SURVEY_REPORT } from "@/lib/content/prompt-alertas";
import { RUBRIC_REPORT } from "@/lib/content/prompt-rubrica";
import type { Report } from "@/lib/content/report";
import type { SectionProps } from "@/types/presentation";

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
            <SlideTitle className="mt-5">{report.title}</SlideTitle>
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
          <motion.div variants={fadeUp} aria-live="polite" className="lg:min-h-120">
            <AnimatePresence mode="wait" initial={false}>
              {row ? (
                <motion.div key={row.key} {...swap}>
                  <ReportDetail row={row} report={report} onBack={() => setActive(null)} />
                </motion.div>
              ) : (
                <motion.div key="overview" {...swap}>
                  <ReportOverview report={report} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
