"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Palette } from "lucide-react";
import { useState } from "react";
import { Section } from "@/components/presentation/Section";
import { PromptBox } from "@/components/sections/prompt/PromptCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { buildCampaignPrompt, PEACE, PROMPT_BUILDER } from "@/lib/content/estudiantes";
import type { SectionProps } from "@/types/presentation";

/** Each team picks topic, format, style and colors; the prompt is written for them with the formula. */
export function PromptBuilderSection({ id, index, label }: SectionProps) {
  const [topic, setTopic] = useState<(typeof PEACE.topics)[number]>(PEACE.topics[0]);
  const [format, setFormat] = useState<(typeof PEACE.formats)[number]>(PEACE.formats[0]);
  const [style, setStyle] = useState<(typeof PROMPT_BUILDER.styles)[number]>(PROMPT_BUILDER.styles[0]);
  const [colors, setColors] = useState<(typeof PROMPT_BUILDER.colors)[number]>(PROMPT_BUILDER.colors[0]);

  const parts = buildCampaignPrompt(
    topic,
    format,
    `${style.label.toLowerCase()} (${style.desc})`,
    PROMPT_BUILDER.colorText[colors.id],
  );
  const text = parts.map((p) => `${p.label.toUpperCase()}: ${p.text}`).join("\n\n");
  const { labels } = PROMPT_BUILDER;

  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy">
      <motion.div
        className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 px-6 py-20 lg:items-center sm:px-10 md:px-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.08)}
      >
        <div>
          <motion.div variants={fadeUp}>
            <Eyebrow index={index}>{label}</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-none tracking-[-0.04em]"
          >
            {PROMPT_BUILDER.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg leading-snug text-gray-text md:text-xl">
            {PROMPT_BUILDER.lead}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 grid grid-cols-1 gap-6">
            <Picker step={1} label={labels.topic} options={PEACE.topics} value={topic} onChange={setTopic} />
            <Picker step={2} label={labels.format} options={PEACE.formats} value={format} onChange={setFormat} />
            <StylePicker step={3} value={style} onChange={setStyle} />
            <Picker step={4} label={labels.colors} options={PROMPT_BUILDER.colors} value={colors} onChange={setColors} />
          </motion.div>
        </div>

        <motion.div variants={fadeUp}>
          <PromptBox text={text} title="Prompt de la campaña" />
        </motion.div>
      </motion.div>
    </Section>
  );
}

/** "1 Tema": a numbered step, so the class reads the choices in order. */
function StepLabel({ step, label }: { step: number; label: string }) {
  return (
    <p className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-gray-light">
      <span className="grid size-6 place-items-center rounded-full bg-green-bright/15 font-mono text-xs text-green-bright">
        {step}
      </span>
      {label}
    </p>
  );
}

interface PickerProps<T extends { id: string; label: string }> {
  step: number;
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

function Picker<T extends { id: string; label: string }>({ step, label, options, value, onChange }: PickerProps<T>) {
  return (
    <div role="radiogroup" aria-label={label}>
      <StepLabel step={step} label={label} />
      <div className="mt-3 flex flex-wrap gap-2">
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
                "inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors duration-300 md:text-base",
                on
                  ? "border-green-bright bg-green-bright/15 text-white"
                  : "border-white/15 bg-white/[0.03] text-gray-light hover:border-green-bright/50 hover:text-white",
              )}
            >
              {on && <Check aria-hidden="true" className="size-4 shrink-0 text-green-bright" strokeWidth={2.75} />}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type Style = (typeof PROMPT_BUILDER.styles)[number];

/** Twenty styles are too many for chips: the current one, and a grid to change it that opens in place. */
function StylePicker({ step, value, onChange }: { step: number; value: Style; onChange: (value: Style) => void }) {
  const [open, setOpen] = useState(false);
  const { labels } = PROMPT_BUILDER;

  return (
    <div onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <StepLabel step={step} label={labels.style} />
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mt-3 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-green-bright bg-green-bright/15 px-4 py-3 text-left transition-colors hover:bg-green-bright/20"
      >
        <Palette aria-hidden="true" className="size-5 shrink-0 text-green-bright" strokeWidth={2} />
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-white md:text-lg">{value.label}</span>
          <span className="block truncate text-sm text-gray-text">{value.desc}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-green-bright">
          {PROMPT_BUILDER.change}
          <span className="hidden sm:inline">
            · {PROMPT_BUILDER.styles.length} {PROMPT_BUILDER.stylesCount}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
            strokeWidth={2}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: transition(DURATION.base) }}
            exit={{ height: 0, opacity: 0, transition: transition(DURATION.fast) }}
            className="overflow-hidden"
          >
            <div
              role="radiogroup"
              aria-label={labels.style}
              className="mt-2 grid max-h-[42svh] gap-2 overflow-y-auto rounded-2xl border border-white/10 bg-navy-deep/80 p-2 sm:grid-cols-2"
            >
              {PROMPT_BUILDER.styles.map((style) => {
                const on = style.id === value.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => {
                      onChange(style);
                      setOpen(false);
                    }}
                    className={cn(
                      "cursor-pointer rounded-xl border p-3 text-left transition-colors duration-200",
                      on
                        ? "border-green-bright bg-green-bright/15"
                        : "border-white/10 bg-white/[0.03] hover:border-green-bright/50 hover:bg-white/[0.06]",
                    )}
                  >
                    <span className="block text-sm font-bold text-white md:text-base">{style.label}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-gray-text md:text-sm">{style.desc}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
