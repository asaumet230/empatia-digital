"use client";

import { PlayCircle } from "lucide-react";
import { useRef } from "react";
import { CloseButton, Dialog } from "@/components/ui/Dialog";
import type { AiCategoryTool } from "@/lib/content/ia-ecosistema";

/**
 * "Ver ejemplo": a video made with the tool, in a large modal like the other ones
 * (native <dialog>: Esc, the close button or a click on the backdrop close it). The video only
 * plays when the viewer presses play, and pauses when the modal closes.
 */
export function ExampleVideo({ example }: { example: NonNullable<AiCategoryTool["example"]> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#B69CFF]/50 bg-[#B69CFF]/10 px-4 py-2 text-sm font-semibold text-[#CDBBFF] transition-colors hover:border-[#7A5CE0] hover:bg-[#7A5CE0] hover:text-white"
      >
        <PlayCircle aria-hidden="true" className="size-4" strokeWidth={2} />
        Ver ejemplo
      </button>

      <Dialog

        dialogRef={dialog}

        label={example.title}

        onClose={() => video.current?.pause()}

        className="w-[min(calc(100vw-1.5rem),64rem)] backdrop:bg-black/75"

      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
          <p className="flex items-center gap-3 font-display text-lg font-bold tracking-[-0.02em] sm:text-2xl">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#B69CFF]/15 text-[#CDBBFF]">
              <PlayCircle aria-hidden="true" className="size-5" strokeWidth={2} />
            </span>
            {example.title}
          </p>
          <CloseButton onClick={() => dialog.current?.close()} />
        </div>
        <div className="p-5 sm:p-8">
          <video
            ref={video}
            src={example.src}
            poster={example.poster}
            controls
            playsInline
            preload="metadata"
            className="max-h-[70svh] w-full rounded-2xl border border-white/10 bg-black object-contain"
          />
        </div>
      </Dialog>
    </>
  );
}
