"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MousePointerClick } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { Section } from "@/components/presentation/Section";
import { PromptBox } from "@/components/sections/prompt/PromptCard";
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

/** One color per case (the prompt-part palette), so the list reads at a glance. */
const CASE_COLORS = ["#35C95E", "#5AB8FF", "#FFD23F", "#B69CFF", "#FF7A7A", "#FF9F43"];
const caseColor = (i: number) => CASE_COLORS[i % CASE_COLORS.length];

/** A face per option, so "who talks to whom" reads at a glance. */
const FACES: Record<string, string> = { papa: "👨", mama: "👩", acudiente: "🧓", hijo: "👦", hija: "👧" };

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
  // Phone: the ten cases are a swipeable carousel with arrows; from sm up, a grid
  const track = useRef<HTMLUListElement>(null);
  const [slide, setSlide] = useState(0);

  // Scrolls only the carousel, never the page
  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card)
      el.scrollTo({
        left: card.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft),
        behavior: "smooth",
      });
  };

  const onScroll = () => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    // One step = a card plus the 0.625rem gap
    setSlide(Math.round(el.scrollLeft / (card.offsetWidth + 10)));
  };

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
        </div>

        {/* Who is talking to whom: its own bar, so the choices never wrap into the title */}
        <motion.div
          variants={fadeUp}
          className="mt-6 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-8 md:p-5"
        >
          <Choice step={1} label={CASES_BLOCK.speakerLabel} options={SPEAKERS} value={speaker} onChange={setSpeaker} />
          <Choice step={2} label={CASES_BLOCK.childLabel} options={CHILDREN} value={child} onChange={setChild} />
        </motion.div>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:items-stretch lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
          {/* The ten cases */}
          <motion.div variants={fadeUp} className="min-w-0">
            <ul
              ref={track}
              onScroll={onScroll}
              className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-2.5 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {FAMILY_CASES.map((c, i) => {
                const Icon = c.icon;
                const on = i === selected;
                return (
                  <li key={c.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => open(i)}
                      className={cn(
                        "group flex h-full min-h-28 w-full items-center gap-3 rounded-2xl border p-3 text-left sm:min-h-0 transition-[border-color,background-color,opacity] duration-300 md:p-3.5",
                        on
                          ? "border-green-bright bg-green-bright/10"
                          : "border-white/10 bg-white/[0.03] hover:border-green-bright/50 hover:bg-white/[0.05]",
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
                      <span
                        className={cn(
                          "text-[0.9375rem] font-semibold leading-snug",
                          on ? "text-white" : "text-gray-light",
                        )}
                      >
                        <span className={cn("mr-1.5 font-mono text-xs", on ? "text-green-bright" : "text-gray-text")}>
                          {pad(i + 1)}
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
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/[0.06] px-4 font-semibold text-white transition-colors disabled:opacity-30"
              >
                <ArrowLeft aria-hidden="true" className="size-5" />
                Anterior
              </button>
              <span className="font-mono text-sm text-gray-light" aria-live="polite">
                {pad(slide + 1)} / {pad(FAMILY_CASES.length)}
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
          </motion.div>

          {/* The selected case, in three steps */}
          <motion.div ref={detailRef} variants={fadeUp} aria-live="polite" className="scroll-mt-6">
            <AnimatePresence mode="wait" initial={false}>
              {selected === null ? (
                <motion.div
                  key="empty"
                  {...swap}
                  className="grid h-full place-items-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center"
                >
                  <div className="flex max-w-sm flex-col items-center gap-4">
                    <span className="grid size-14 place-items-center rounded-2xl bg-green-bright/15 text-green-bright">
                      <MousePointerClick aria-hidden="true" className="size-7" strokeWidth={1.75} />
                    </span>
                    <p className="text-lg leading-snug text-gray-light">{CASES_BLOCK.hint}</p>
                    <p className="flex items-center gap-2 text-sm font-semibold text-green-bright">
                      <ArrowLeft aria-hidden="true" className="hidden size-4 lg:block" />
                      Toca uno de los 10 casos
                    </p>
                  </div>
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
  step: number;
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

function Choice<T extends { id: string; label: string }>({ step, label, options, value, onChange }: ChoiceProps<T>) {
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-gray-light">
        <span className="grid size-6 place-items-center rounded-full bg-green-bright/15 font-mono text-xs text-green-bright">
          {step}
        </span>
        {label}
      </p>
      {/* Equal tiles: a big face, then the name */}
      <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
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
                "relative flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-sm font-semibold transition-colors duration-300",
                on
                  ? "border-green-bright bg-green-bright/10 text-white"
                  : "border-white/10 bg-navy-dark/40 text-gray-light hover:border-green-bright/50 hover:text-white",
              )}
            >
              {on && (
                <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-green-bright text-navy-dark">
                  <Check aria-hidden="true" className="size-3" strokeWidth={3.5} />
                </span>
              )}
              <span aria-hidden="true" className="text-3xl leading-none">
                {FACES[option.id]}
              </span>
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
    <div className="rounded-3xl border border-white/10 bg-navy-dark/70 p-5 md:p-6">
      <span className="inline-flex items-center rounded-full bg-green-bright/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-green-bright">
        {CASES_BLOCK.caseLabel} {pad(number)} de {pad(FAMILY_CASES.length)}
      </span>
      <h3 className="mt-3 font-display text-[clamp(1.375rem,2.2vw,1.875rem)] font-bold leading-[1.1] tracking-[-0.02em]">
        {c.title}
      </h3>
      <p className="mt-2 text-base text-gray-text">{personalize(c.situation, speaker, child)}</p>

      <ol className="mt-6 space-y-5">
        <Step
          n={1}
          title={CASES_BLOCK.steps.scenario}
          hint={personalize(CASES_BLOCK.stepHints.scenario, speaker, child)}
        >
          <PromptBox fit text={prompt} title={`Caso ${pad(number)} · ${c.title}`} />
        </Step>

        <Step n={2} title={CASES_BLOCK.steps.opening} hint={CASES_BLOCK.stepHints.opening}>
          <p className="border-l-2 border-yellow pl-4 text-lg leading-snug text-white md:text-xl">“{c.opening}”</p>
        </Step>

        <Step n={3} title={CASES_BLOCK.steps.finish} hint={CASES_BLOCK.stepHints.finish}>
          <span className="inline-block rounded-xl border border-yellow/50 bg-yellow/10 px-4 py-2 font-semibold text-yellow">
            “{FINISH}”
          </span>
        </Step>
      </ol>
    </div>
  );
}

function Step({ n, title, hint, children }: { n: number; title: string; hint: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
      <span className="grid size-9 place-items-center rounded-full bg-green-bright text-navy-dark font-display text-base font-bold">
        {n}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-bright">Paso {n} de 3</p>
        <p className="mt-0.5 font-display text-lg font-bold leading-tight text-white md:text-xl">{title}</p>
        <p className="mt-1 text-sm leading-snug text-gray-text">{hint}</p>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  );
}
