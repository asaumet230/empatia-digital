"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Section } from "@/components/presentation/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DURATION, fadeUp, staggerContainer, transition } from "@/lib/animations";
import { PROMPT_BLOCK, PROMPT_PARTS } from "@/lib/content/prompt-encuesta";
import type { SectionProps } from "@/types/presentation";

const lightUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
};

/** ROL + CONTEXTO + OBJETIVO + INSTRUCCIONES + LÍMITES + ACCIÓN, lit one after another. */
export function PromptFormulaSection({ id, index, label }: SectionProps) {
  // Phone: the six cards are a swipeable carousel with arrows; from sm up, a grid
  const track = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(0);
  const last = PROMPT_PARTS.length - 1;

  // Scrolls only the carousel, never the page
  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: "smooth" });
  };

  const onScroll = () => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    // One step = a card plus the 1rem gap
    setCurrent(Math.round(el.scrollLeft / (card.offsetWidth + 16)));
  };

  return (
    <Section id={id} label={label} className="grain flex items-center overflow-hidden bg-navy-dark">
      <motion.div
        className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 md:px-16 lg:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={staggerContainer(0.12)}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow index={index}>{label}</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-5 max-w-3xl font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]"
        >
          {PROMPT_BLOCK.formulaTitle}
        </motion.h2>

        <div className="relative mt-10 lg:mt-12">
        <ol
          ref={track}
          onScroll={onScroll}
          className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-6 [&::-webkit-scrollbar]:hidden"
        >
          {PROMPT_PARTS.map((part, i) => (
            <motion.li
              key={part.id}
              variants={lightUp}
              className="relative flex w-full shrink-0 snap-start flex-col rounded-2xl border border-white/10 bg-navy/60 p-5 sm:w-auto md:p-6"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-5 top-0 h-0.5 rounded-full"
                style={{ backgroundColor: part.color, boxShadow: `0 0 16px ${part.color}` }}
              />
              <span className="font-mono text-[0.6875rem] tracking-[0.15em]" style={{ color: part.color }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-3 break-words font-display text-xl font-extrabold uppercase tracking-[0.01em] md:text-2xl">
                {part.name}
              </span>
              <span className="mt-3 text-base leading-snug text-gray-text">{part.example}</span>

              {/* "+" sits in the gap between cards of the same row (3 per row) */}
              {(i + 1) % 3 !== 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-[2.25rem] top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-navy-dark text-gray-muted lg:grid"
                >
                  <Plus className="size-3" strokeWidth={2.5} />
                </span>
              )}
            </motion.li>
          ))}
        </ol>

        {/* Phone controls: arrows on the sides of the counter */}
        <div className="mt-5 flex items-center justify-between sm:hidden">
          <button
            type="button"
            aria-label="Parte anterior"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className="grid size-11 place-items-center rounded-full border border-white/15 text-gray-light transition-colors disabled:opacity-30"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </button>
          <span className="flex items-center gap-2" aria-live="polite">
            {PROMPT_PARTS.map((part, i) => (
              <span
                key={part.id}
                aria-hidden="true"
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === current ? 20 : 6, backgroundColor: i === current ? part.color : "rgb(255 255 255 / 0.2)" }}
              />
            ))}
            <span className="sr-only">
              Parte {current + 1} de {last + 1}
            </span>
          </span>
          <button
            type="button"
            aria-label="Parte siguiente"
            onClick={() => goTo(current + 1)}
            disabled={current === last}
            className="grid size-11 place-items-center rounded-full border border-green-bright text-green-bright transition-colors disabled:opacity-30"
          >
            <ArrowRight aria-hidden="true" className="size-5" />
          </button>
        </div>
        </div>

        <motion.blockquote
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0, transition: transition(DURATION.slow, 0.3) },
          }}
          className="mt-12 max-w-4xl border-l-2 border-yellow pl-6 text-xl leading-snug text-gray-light md:mt-14 md:text-[1.625rem]"
        >
          “{PROMPT_BLOCK.closing}”
        </motion.blockquote>
      </motion.div>
    </Section>
  );
}
