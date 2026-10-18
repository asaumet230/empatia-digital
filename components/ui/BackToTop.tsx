"use client";

import { ArrowUp } from "lucide-react";

/** Up-arrow button at the end of the footer (named "Volver arriba" for screen readers): smooth unless the user prefers reduced motion. */
export function BackToTop() {
  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Volver arriba"
      title="Volver arriba"
      className="group grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-gray-light transition-colors hover:border-green-bright hover:bg-green hover:text-white"
    >
      <ArrowUp aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={2.25} />
    </button>
  );
}
