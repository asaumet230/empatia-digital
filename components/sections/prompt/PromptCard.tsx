"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Copy, Download, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DURATION, transition } from "@/lib/animations";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/cn";
import type { PromptVariant } from "@/lib/content/prompt-exercise";

/** Big, obvious actions: copy (primary) and open in ChatGPT, plus an optional download. */
export function PromptActions({ variant }: { variant: PromptVariant }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  const { text, download } = variant;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    if (!(await copyText(text))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copy}
          className={cn(
            "inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-base font-bold transition-[background-color,filter] duration-300 hover:brightness-110 md:text-lg",
            copied ? "bg-white text-navy-dark" : "bg-green-bright text-navy-dark",
          )}
        >
          {copied ? (
            <Check aria-hidden="true" className="size-5" strokeWidth={2.5} />
          ) : (
            <Copy aria-hidden="true" className="size-5" strokeWidth={2} />
          )}
          <span aria-live="polite">{copied ? "¡Copiado! Ahora pégalo en ChatGPT" : "Copiar prompt"}</span>
        </button>
        <a
          href={`https://chatgpt.com/?q=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 px-7 py-4 text-base font-semibold text-gray-light transition-colors hover:border-green-bright hover:text-white md:text-lg"
        >
          <ExternalLink aria-hidden="true" className="size-5" strokeWidth={2} />
          Abrir en ChatGPT
        </a>
      </div>
      {download && (
        <a
          href={download.href}
          download
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-bright underline decoration-green-bright/40 underline-offset-4 transition-colors hover:text-white"
        >
          <Download aria-hidden="true" className="size-4" strokeWidth={2} />
          {download.label}
        </a>
      )}
    </div>
  );
}

interface PromptPreviewProps {
  /** Unique per exercise, so the tab underline never animates between sections. */
  layoutPrefix: string;
  variants: readonly PromptVariant[];
  variant: PromptVariant;
  onVariantChange: (variant: PromptVariant) => void;
}

/** The prompt as plain, readable text, with its two versions as tabs; long, so it starts folded. */
export function PromptPreview({ layoutPrefix, variants, variant, onVariantChange }: PromptPreviewProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-deep/80">
      <div role="tablist" aria-label="Versión del prompt" className="grid grid-cols-2 border-b border-white/10">
        {variants.map((v) => {
          const on = v.id === variant.id;
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onVariantChange(v)}
              className={cn(
                "relative py-3.5 text-sm font-semibold transition-colors md:text-base",
                on ? "text-white" : "text-gray-muted hover:text-gray-text",
              )}
            >
              Prompt {v.label[0].toLowerCase() + v.label.slice(1)}
              {on && (
                <motion.span
                  layoutId={`${layoutPrefix}-tab`}
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-green-bright"
                  transition={transition(DURATION.base)}
                />
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.pre
          key={variant.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition(DURATION.fast)}
          className={cn(
            "whitespace-pre-wrap px-5 pt-5 font-sans text-[0.9375rem] leading-relaxed text-gray-text md:text-base",
            open ? "max-h-[55svh] overflow-y-auto pb-5" : "max-h-64 overflow-hidden",
          )}
        >
          {variant.text}
        </motion.pre>
      </AnimatePresence>

      {!open && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-12 h-24 bg-linear-to-t from-navy-deep to-transparent"
        />
      )}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-center gap-2 border-t border-white/10 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gray-text transition-colors hover:text-white"
      >
        {open ? "Ver menos" : "Ver el prompt completo"}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
        />
      </button>
    </div>
  );
}
