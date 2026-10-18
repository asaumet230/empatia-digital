"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Closes a floating menu or panel while it is open: on a tap or click outside `ref`, or on `Esc`.
 * Shared by the session menu and the pretest/postest button.
 */
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, onDismiss: () => void) {
  const dismiss = useRef(onDismiss);

  useEffect(() => {
    dismiss.current = onDismiss;
  });

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) dismiss.current();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss.current();
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, ref]);
}
