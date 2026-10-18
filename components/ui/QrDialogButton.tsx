"use client";

import { QrCode as QrIcon, X } from "lucide-react";
import { useRef, type ReactNode } from "react";

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

      <dialog
        ref={dialog}
        aria-label={title}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto w-[min(calc(100vw-2rem),26rem)] rounded-3xl border border-white/10 bg-navy-deep p-0 text-white shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative flex flex-col items-center p-6 text-center sm:p-8">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => dialog.current?.close()}
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-gray-light transition-colors hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={2} />
          </button>
          <p className="font-display text-xl font-bold tracking-[-0.02em] sm:text-2xl">{title}</p>
          <div className="mt-6 w-full max-w-72">{children}</div>
          <p className="mt-5 break-all font-mono text-sm font-semibold text-green-bright">{url}</p>
        </div>
      </dialog>
    </>
  );
}
