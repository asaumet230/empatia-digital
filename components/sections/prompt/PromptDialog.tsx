import { MessageSquareText } from "lucide-react";
import type { RefObject } from "react";
import { CopyPromptButton } from "@/components/sections/prompt/CopyPromptButton";
import { PromptText } from "@/components/sections/prompt/PromptText";
import { CloseButton, Dialog } from "@/components/ui/Dialog";

interface PromptDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  heading: string;
  text: string;
  copied: boolean;
  onCopy: () => void;
}

/**
 * The whole prompt in a large modal (native <dialog>: Esc, the close button or a click on the
 * backdrop close it), with its own copy button.
 */
export function PromptDialog({ dialogRef, heading, text, copied, onCopy }: PromptDialogProps) {
  const close = () => dialogRef.current?.close();

  return (
    <Dialog
      dialogRef={dialogRef}
      label={heading}
      className="h-[min(92svh,60rem)] w-[min(calc(100vw-1.5rem),64rem)] backdrop:bg-black/75"
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
          <CloseButton onClick={close} />
        </div>
        {/* Focusable so the long text can be scrolled with the keyboard */}
        <div tabIndex={0} className="min-h-0 flex-1 overflow-y-auto px-5 py-6 text-base leading-relaxed text-gray-light sm:px-8 md:text-lg">
          <PromptText text={text} />
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-5 py-4 sm:px-8">
          <CopyPromptButton copied={copied} onCopy={onCopy} className="px-5" />
        </div>
      </div>
    </Dialog>
  );
}
