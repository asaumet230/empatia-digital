"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ClipboardPaste, Cloud, FileSpreadsheet, FileText, Link2, type LucideIcon } from "lucide-react";
import { PromptActions } from "@/components/sections/prompt/PromptActions";
import { PromptText } from "@/components/sections/prompt/PromptText";
import { DURATION, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { PromptVariant } from "@/lib/content/prompt-exercise";

interface PromptPreviewProps {
  /** Unique per exercise, so the tab underline never animates between sections. */
  layoutPrefix: string;
  variants: readonly PromptVariant[];
  variant: PromptVariant;
  onVariantChange: (variant: PromptVariant) => void;
}

/** One icon per version, so the tabs read at a glance: paste the data, connected Tally, an Excel file or Drive. */
const VARIANT_ICONS: Record<string, LucideIcon> = {
  "sin-tally": ClipboardPaste,
  tally: Link2,
  excel: FileSpreadsheet,
  drive: Cloud,
};

/** A short look at the prompt, with its two versions as tabs. The whole text opens from "Ver completo". */
export function PromptPreview({ layoutPrefix, variants, variant, onVariantChange }: PromptPreviewProps) {
  return (
    <div className={BOX}>
      {/* Header: the two versions as a segmented control */}
      <div className="border-b border-white/10 p-2">
        <div role="tablist" aria-label="Versión del prompt" className="grid grid-cols-2 gap-1 rounded-2xl bg-white/4 p-1">
          {variants.map((v) => {
            const on = v.id === variant.id;
            const Icon = VARIANT_ICONS[v.id] ?? FileText;
            return (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => onVariantChange(v)}
                className={cn(
                  "relative rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors md:text-[0.9375rem]",
                  on ? "text-white" : "text-gray-text hover:text-white",
                )}
              >
                {on && (
                  <motion.span
                    layoutId={`${layoutPrefix}-tab`}
                    className="absolute inset-0 rounded-xl border border-green-bright/50 bg-green-bright/15"
                    transition={transition(DURATION.base)}
                  />
                )}
                <span className="relative inline-flex items-center justify-center gap-2">
                  <Icon
                    aria-hidden="true"
                    className={cn("size-4 shrink-0", on ? "text-green-bright" : "text-gray-muted")}
                    strokeWidth={2}
                  />
                  {v.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={variant.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition(DURATION.fast)}
        >
          <PromptScroll text={variant.text} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const BOX = "relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-navy-deep to-navy-dark shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]";

/** The scrollable text (wheel, touch or keyboard) with its parts in green; the fade below hints there is more. */
function PromptScroll({ text, fit = false }: { text: string; fit?: boolean }) {
  return (
    <>
      <div
        tabIndex={0}
        aria-label="Vista previa del prompt"
        className={cn(
          fit ? "max-h-96 pb-5" : "h-96 pb-16",
          "overflow-y-auto overscroll-contain px-6 pt-5 text-[0.9375rem] leading-relaxed text-gray-light [scrollbar-color:rgb(255_255_255/0.2)_transparent] scrollbar-thin md:text-base",
        )}
      >
        <PromptText text={text} />
      </div>
      {!fit && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-navy-dark to-transparent"
        />
      )}
    </>
  );
}

/** A single prompt (no versions): the same box and actions as the docentes exercises. */
interface PromptBoxProps {
  text: string;
  title: string;
  sameChat?: boolean;
  /** Short prompt: the box is only as tall as the text (up to the usual height), without the fade. */
  fit?: boolean;
}

export function PromptBox({ text, title, sameChat = false, fit = false }: PromptBoxProps) {
  return (
    <div>
      <div className={BOX}>
        <PromptScroll text={text} fit={fit} />
      </div>
      <div className="mt-5">
        <PromptActions variant={{ text, label: title }} title={title} sameChat={sameChat} />
      </div>
    </div>
  );
}
