import { X } from "lucide-react";
import type { KeyboardEvent, ReactNode, RefObject } from "react";
import { cn } from "@/lib/cn";

interface DialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  children: ReactNode;
  /** Accessible name; or `labelledBy` to point at the visible title. */
  label?: string;
  labelledBy?: string;
  onClose?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDialogElement>) => void;
  /** Width, height and backdrop shade. */
  className?: string;
}

/**
 * The presentation's modal window: a native <dialog> opened with `showModal()`. Esc, a close
 * button or a click on the backdrop close it.
 */
export function Dialog({ dialogRef, children, label, labelledBy, onClose, onKeyDown, className }: DialogProps) {
  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      className={cn(
        "m-auto rounded-3xl border border-white/10 bg-navy-deep p-0 text-white shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop:backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </dialog>
  );
}

/** The round "×" that closes a dialog. */
export function CloseButton({ onClick, className = "size-10" }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label="Cerrar"
      onClick={onClick}
      className={cn(
        "grid shrink-0 place-items-center rounded-full text-gray-light transition-colors hover:bg-white/10 hover:text-white",
        className,
      )}
    >
      <X aria-hidden="true" className="size-5" strokeWidth={2} />
    </button>
  );
}
