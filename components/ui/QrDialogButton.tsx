"use client";

import { QrCode as QrIcon } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { CloseButton, Dialog } from "@/components/ui/Dialog";

interface QrDialogButtonProps {
  /** Shown above the code, e.g. "Escanea para entrar". */
  title: string;
  /** The address the code opens, printed under it. */
  url: string;
  /** The QR itself, rendered on the server (`ui/QrCode`). */
  children: ReactNode;
}

/**
 * "QR" button that opens a big code in a modal, to project it and let the room scan it.
 * Native <dialog>: Esc and the close button close it, and so does a click on the backdrop.
 */
export function QrDialogButton({ title, url, children }: QrDialogButtonProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-gray-light transition-colors duration-300 hover:border-green-bright hover:text-green-bright"
      >
        <QrIcon aria-hidden="true" className="size-4" strokeWidth={2} />
        QR
      </button>

      <Dialog

        dialogRef={dialog}

        label={title}

        className="w-[min(calc(100vw-2rem),26rem)] backdrop:bg-black/70"

      >
        <div className="relative flex flex-col items-center p-6 text-center sm:p-8">
          <CloseButton onClick={() => dialog.current?.close()} className="absolute right-4 top-4 size-9" />
          <p className="font-display text-xl font-bold tracking-[-0.02em] sm:text-2xl">{title}</p>
          <div className="mt-6 w-full max-w-72">{children}</div>
          <p className="mt-5 break-all font-mono text-sm font-semibold text-green-bright">{url}</p>
        </div>
      </Dialog>
    </>
  );
}
