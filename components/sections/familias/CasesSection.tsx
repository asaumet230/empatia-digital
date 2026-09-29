"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { Section } from "@/components/presentation/Section";
import { CopyButton } from "@/components/ui/CopyButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, EASE, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import {
  CASES_BLOCK,
  CHILDREN,
  FAMILY_CASES,
  FINISH,
  SPEAKERS,
  casePrompt,
  personalize,
  type Child,
  type FamilyCase,
  type Speaker,
} from "@/lib/content/familias";
import type { SectionProps } from "@/types/presentation";

const pad = (n: number) => String(n).padStart(2, "0");

const swap = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
  exit: { opacity: 0, y: -8, filter: "blur(6px)", transition: transition(DURATION.fast, 0, EASE.inOutQuint) },
};

/**
 * "Elige tu caso" — ten role-play scenarios. Who speaks (mamá/papá/acudiente) and with whom
 * (hijo/hija) is chosen once and rewrites every prompt, so nobody has to edit text by hand.
 */
export function CasesSection({ id, index, label }: SectionProps) {
  const [speaker, setSpeaker] = useState<Speaker>(SPEAKERS[0]);
  const [child, setChild] = useState<Child>(CHILDREN[0]);
  const [selected, setSelected] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const open = (i: number) => {
    setSelected(i);
    // On narrow screens the detail sits below the grid: bring it into view
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy">
      <motion.div
        className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 md:px-16 lg:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer(0.06)}
        onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.div variants={fadeUp}>
              <Eyebrow index={index}>{label}</Eyebrow>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-5 font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]"
            >
              {CASES_BLOCK.title}
            </motion.h2>
          </div>

          {/* Who is talking to whom */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <Choice label={CASES_BLOCK.speakerLabel} options={SPEAKERS} value={speaker} onChange={setSpeaker} />
            <Choice label={CASES_BLOCK.childLabel} options={CHILDREN} value={child} onChange={setChild} />
          </motion.div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
          {/* The ten cases */}
          <motion.ul variants={fadeUp} className="grid gap-2.5 sm:grid-cols-2">
            {FAMILY_CASES.map((c, i) => {
              const Icon = c.icon;
              const on = i === selected;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => open(i)}
                    className={cn(
                      "group flex h-full w-full items-center gap-3 rounded-xl border p-3 text-left transition-[border-color,background-color,opacity] duration-300 md:p-3.5",
                      on ? "border-green-bright bg-green/15" : "border-white/10 bg-navy-dark/50 hover:border-white/30",
                      selected !== null && !on && "opacity-60 hover:opacity-100",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300",
                        on ? "bg-green-bright text-navy-dark" : "bg-white/[0.06] text-gray-light",
                      )}
                    >
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
                    </span>
                    <span className="text-[0.9375rem] font-semibold leading-snug text-gray-light">
                      <span className="mr-1.5 font-mono text-xs text-gray-muted">{pad(i + 1)}</span>
                      {c.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>

          {/* The selected case, in three steps */}
          <motion.div ref={detailRef} variants={fadeUp} aria-live="polite" className="scroll-mt-6 lg:min-h-[34rem]">
            <AnimatePresence mode="wait" initial={false}>
              {selected === null ? (
                <motion.div
                  key="empty"
                  {...swap}
                  className="grid h-full place-items-center rounded-2xl border border-dashed border-white/15 p-8 text-center lg:min-h-[34rem]"
                >
                  <p className="flex items-center gap-3 text-lg text-gray-text">
                    <ArrowLeft aria-hidden="true" className="hidden size-5 lg:block" />
                    {CASES_BLOCK.hint}
                  </p>
                </motion.div>
              ) : (
                <motion.div key={FAMILY_CASES[selected].id} {...swap}>
                  <CaseDetail number={selected + 1} c={FAMILY_CASES[selected]} speaker={speaker} child={child} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}

interface ChoiceProps<T extends { id: string; label: string }> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

function Choice<T extends { id: string; label: string }>({ label, options, value, onChange }: ChoiceProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-3">
      <span className="hud-label w-16 shrink-0 sm:w-auto">{label}</span>
      <div className="flex rounded-full border border-white/15 p-1">
        {options.map((option) => {
          const on = option.id === value.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(option)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors duration-300",
                on ? "bg-green-bright text-navy-dark" : "text-gray-text hover:text-white",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CaseDetailProps {
  number: number;
  c: FamilyCase;
  speaker: Speaker;
  child: Child;
}

function CaseDetail({ number, c, speaker, child }: CaseDetailProps) {
  const prompt = personalize(casePrompt(c), speaker, child);

  return (
    <div className="rounded-2xl border border-white/10 bg-navy-dark/70 p-5 md:p-6">
      <p className="font-mono text-xs tracking-[0.16em] text-green-bright">CASO {pad(number)}</p>
      <h3 className="mt-2 font-display text-[clamp(1.375rem,2.2vw,1.875rem)] font-bold leading-[1.1] tracking-[-0.02em]">
        {c.title}
      </h3>
      <p className="mt-2 text-base text-gray-text">{personalize(c.situation, speaker, child)}</p>

      <ol className="mt-6 space-y-5">
        <Step n={1} title={CASES_BLOCK.steps.scenario}>
          <p className="max-h-32 overflow-y-auto rounded-xl bg-white/[0.04] p-3 text-sm leading-relaxed text-gray-text">
            {prompt}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text={prompt} label="Copiar caso" tone="primary" />
            <a
              href={`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-gray-light transition-colors hover:border-green-bright hover:text-white"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
              Abrir en ChatGPT
            </a>
          </div>
        </Step>

        <Step n={2} title={CASES_BLOCK.steps.opening}>
          <p className="border-l-2 border-yellow pl-4 text-lg leading-snug text-white md:text-xl">“{c.opening}”</p>
          <CopyButton text={c.opening} label="Copiar frase" className="mt-3" />
        </Step>

        <Step n={3} title={CASES_BLOCK.steps.finish}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-yellow/50 px-4 py-2 font-semibold text-yellow">“{FINISH}”</span>
            <CopyButton text={FINISH} />
          </div>
        </Step>
      </ol>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
      <span className="grid size-8 place-items-center rounded-full border border-green-bright/50 font-mono text-sm text-green-bright">
        {n}
      </span>
      <div>
        <p className="pt-1 font-semibold text-gray-light">{title}</p>
        <div className="mt-2.5">{children}</div>
      </div>
    </li>
  );
}
