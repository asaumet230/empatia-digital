"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ClipboardPaste,
  Cloud,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Link2,
  Maximize2,
  MessageSquareText,
  MessagesSquare,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PromptText } from "@/components/sections/prompt/PromptText";
import { DURATION, transition } from "@/lib/animations";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/cn";
import type { PromptVariant } from "@/lib/content/prompt-exercise";

/**
 * Big, obvious actions: copy (primary), open in ChatGPT and read the whole prompt in a large
 * modal (native <dialog>: Esc, the close button or a click on the backdrop close it),
 * plus an optional download.
 */
interface PromptActionsProps {
  variant: Pick<PromptVariant, "text" | "label" | "download">;
  /** When another version has a file, keep its room so switching tabs never moves the slide. */
  reserveDownload?: boolean;
  /** Title of the "Ver completo" modal; defaults to "Prompt <version>". */
  title?: string;
  /** The prompt continues an open chat: instead of "Abrir en ChatGPT", a hint to paste it there. */
  sameChat?: boolean;
}

export function PromptActions({ variant, reserveDownload = false, title, sameChat = false }: PromptActionsProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const { text, download, label } = variant;
  const heading = title ?? `Prompt ${lowerFirst(label)}`;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    if (!(await copyText(text))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    // Container query: the three buttons sit in a row only when their column has room for them
    <div className="@container">
      <div className="grid gap-3 @md:grid-cols-3">
        <button
          type="button"
          onClick={copy}
          className={cn(
            "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-3 text-sm font-semibold transition-colors duration-300",
            copied
              ? "border-green bg-green text-white"
              : "border-green-bright/50 bg-green-bright/10 text-green-bright hover:border-green hover:bg-green hover:text-white",
          )}
        >
          {copied ? (
            <Check aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.5} />
          ) : (
            <Copy aria-hidden="true" className="size-5 shrink-0" strokeWidth={2} />
          )}
          <span aria-live="polite">{copied ? "¡Copiado!" : "Copiar prompt"}</span>
        </button>
        {sameChat ? (
          <p className="flex h-12 items-center gap-2.5 rounded-xl border border-yellow/40 bg-yellow/[0.06] px-3 text-left">
            <MessagesSquare aria-hidden="true" className="size-5 shrink-0 text-yellow" strokeWidth={2} />
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-yellow">En el mismo chat</span>
              <span className="block text-xs text-gray-text">No abras uno nuevo</span>
            </span>
          </p>
        ) : (
          <a
            href={`https://chatgpt.com/?q=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#5AB8FF]/50 bg-[#5AB8FF]/10 px-3 text-sm font-semibold text-[#8FCDFF] transition-colors hover:border-[#2D7FD3] hover:bg-[#2D7FD3] hover:text-white"
          >
            <ExternalLink aria-hidden="true" className="size-5 shrink-0" strokeWidth={2} />
            Abrir en ChatGPT
          </a>
        )}
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => dialog.current?.showModal()}
          className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#B69CFF]/50 bg-[#B69CFF]/10 px-3 text-sm font-semibold text-[#CDBBFF] transition-colors hover:border-[#7A5CE0] hover:bg-[#7A5CE0] hover:text-white"
        >
          <Maximize2 aria-hidden="true" className="size-5 shrink-0" strokeWidth={2} />
          Ver completo
        </button>
      </div>

      <dialog
        ref={dialog}
        aria-label={heading}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto h-[min(92svh,60rem)] w-[min(calc(100vw-1.5rem),64rem)] rounded-3xl border border-white/10 bg-navy-deep p-0 text-white shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
            <p className="flex items-center gap-3 font-display text-lg font-bold tracking-[-0.02em] sm:text-2xl">
              {/* What this is at a glance: a message to paste into the AI */}
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-green-bright/15 text-green-bright">
                <MessageSquareText aria-hidden="true" className="size-5" strokeWidth={2} />
              </span>
              {heading}
            </p>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => dialog.current?.close()}
              className="grid size-10 shrink-0 place-items-center rounded-full text-gray-light transition-colors hover:bg-white/10 hover:text-white"
            >
              <X aria-hidden="true" className="size-5" strokeWidth={2} />
            </button>
          </div>
          {/* Focusable so the long text can be scrolled with the keyboard */}
          <div tabIndex={0} className="min-h-0 flex-1 overflow-y-auto px-5 py-6 text-base leading-relaxed text-gray-light sm:px-8 md:text-lg">
            <PromptText text={text} />
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={copy}
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-5 text-sm font-semibold transition-colors duration-300",
                copied
                  ? "border-green bg-green text-white"
                  : "border-green-bright/50 bg-green-bright/10 text-green-bright hover:border-green hover:bg-green hover:text-white",
              )}
            >
              {copied ? (
                <Check aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.5} />
              ) : (
                <Copy aria-hidden="true" className="size-5 shrink-0" strokeWidth={2} />
              )}
              {copied ? "¡Copiado!" : "Copiar prompt"}
            </button>
          </div>
        </div>
      </dialog>

      {/* When another version has a file, keep its room so switching tabs never moves the slide */}
      {download ? (
        <a
          href={download.href}
          download
          className="group mt-6 flex items-center gap-3 rounded-xl border border-dashed border-green-bright/40 bg-green-bright/[0.04] px-4 py-3 text-sm font-semibold text-gray-light transition-colors hover:border-green-bright hover:bg-green-bright/10 hover:text-white"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-green-bright/15 text-green-bright">
            <Download aria-hidden="true" className="size-4" strokeWidth={2} />
          </span>
          {download.label}
        </a>
      ) : (
        reserveDownload && <div aria-hidden="true" className="mt-6 h-[3.625rem]" />
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
        <div role="tablist" aria-label="Versión del prompt" className="grid grid-cols-2 gap-1 rounded-2xl bg-white/[0.04] p-1">
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
          "overflow-y-auto overscroll-contain px-6 pt-5 text-[0.9375rem] leading-relaxed text-gray-light [scrollbar-color:rgb(255_255_255/0.2)_transparent] [scrollbar-width:thin] md:text-base",
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

/** "Sin Tally" → "sin Tally", so it reads after "Prompt". */
const lowerFirst = (label: string) => label[0].toLowerCase() + label.slice(1);
