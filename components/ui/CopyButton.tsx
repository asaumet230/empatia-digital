"use client";

import { Check, Copy } from "lucide-react";
import { useCopy } from "@/hooks/useCopy";
import { cn } from "@/lib/cn";

interface CopyButtonProps {
  text: string;
  label?: string;
  /** "oraculo" follows the Oráculo light/dark theme. */
  tone?: "primary" | "ghost" | "oraculo";
  className?: string;
}

/** Copies `text` and confirms in place for a moment. */
export function CopyButton({ text, label = "Copiar", tone = "ghost", className }: CopyButtonProps) {
  const { copied, copy } = useCopy(text);

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,border-color,color,filter] duration-300",
        tone === "primary"
          ? cn("px-5 py-2.5 text-navy-dark hover:brightness-110", copied ? "bg-white" : "bg-green-bright")
          : tone === "oraculo"
            ? cn("border px-5 py-3", copied ? "border-o-accent text-o-accent" : "border-o-line text-o-text hover:bg-o-raised")
            : cn(
              "border px-4 py-2 text-sm",
              copied
                ? "border-green-bright text-green-bright"
                : "border-white/20 text-gray-light hover:border-green-bright hover:text-green-bright",
            ),
        className,
      )}
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
      ) : (
        <Copy aria-hidden="true" className="size-4" strokeWidth={2} />
      )}
      <span aria-live="polite">{copied ? "¡Copiado!" : label}</span>
    </button>
  );
}
