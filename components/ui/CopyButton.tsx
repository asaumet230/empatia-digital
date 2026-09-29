"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/cn";

interface CopyButtonProps {
  text: string;
  label?: string;
  tone?: "primary" | "ghost";
  className?: string;
}

/** Copies `text` and confirms in place for a moment. */
export function CopyButton({ text, label = "Copiar", tone = "ghost", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    if (!(await copyText(text))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,border-color,color,filter] duration-300",
        tone === "primary"
          ? cn("px-5 py-2.5 text-navy-dark hover:brightness-110", copied ? "bg-white" : "bg-green-bright")
          : cn(
              "border px-4 py-2 text-sm",
              copied
                ? "border-green-bright text-green-bright"
                : "border-white/20 text-gray-light hover:border-white/50",
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
