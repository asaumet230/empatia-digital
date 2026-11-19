"use client";

import { Download, ExternalLink, Maximize2, MessagesSquare } from "lucide-react";
import { useRef } from "react";
import { CopyPromptButton } from "@/components/sections/prompt/CopyPromptButton";
import { PromptDialog } from "@/components/sections/prompt/PromptDialog";
import { useCopy } from "@/hooks/useCopy";
import type { PromptVariant } from "@/lib/content/prompt-exercise";

interface PromptActionsProps {
  variant: Pick<PromptVariant, "text" | "label" | "download">;
  /** When another version has a file, keep its room so switching tabs never moves the slide. */
  reserveDownload?: boolean;
  /** Title of the "Ver completo" modal; defaults to "Prompt <version>". */
  title?: string;
  /** The prompt continues an open chat: instead of "Abrir en ChatGPT", a hint to paste it there. */
  sameChat?: boolean;
}

/**
 * Big, obvious actions: copy (primary), open in ChatGPT and read the whole prompt in a large
 * modal, plus an optional download.
 */
export function PromptActions({ variant, reserveDownload = false, title, sameChat = false }: PromptActionsProps) {
  const { text, download, label } = variant;
  const { copied, copy } = useCopy(text, 2500);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = title ?? `Prompt ${lowerFirst(label)}`;

  return (
    // Container query: the three buttons sit in a row only when their column has room for them
    <div className="@container">
      <div className="grid gap-3 @md:grid-cols-3">
        <CopyPromptButton copied={copied} onCopy={copy} className="px-3" />
        {sameChat ? (
          <p className="flex h-12 items-center gap-2.5 rounded-xl border border-yellow/40 bg-yellow/6 px-3 text-left">
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

      <PromptDialog dialogRef={dialog} heading={heading} text={text} copied={copied} onCopy={copy} />

      {/* When another version has a file, keep its room so switching tabs never moves the slide */}
      {download ? (
        <a
          href={download.href}
          download
          className="group mt-6 flex items-center gap-3 rounded-xl border border-dashed border-green-bright/40 bg-green-bright/4 px-4 py-3 text-sm font-semibold text-gray-light transition-colors hover:border-green-bright hover:bg-green-bright/10 hover:text-white"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-green-bright/15 text-green-bright">
            <Download aria-hidden="true" className="size-4" strokeWidth={2} />
          </span>
          {download.label}
        </a>
      ) : (
        reserveDownload && <div aria-hidden="true" className="mt-6 h-14.5" />
      )}
    </div>
  );
}

/** "Sin Tally" → "sin Tally", so it reads after "Prompt". */
const lowerFirst = (label: string) => label[0].toLowerCase() + label.slice(1);
