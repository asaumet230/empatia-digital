import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

interface CopyPromptButtonProps {
  copied: boolean;
  onCopy: () => void;
  className?: string;
}

/** The green "Copiar prompt" button; turns solid and says "¡Copiado!" for a moment after copying. */
export function CopyPromptButton({ copied, onCopy, className }: CopyPromptButtonProps) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-semibold transition-colors duration-300",
        className,
        copied
          ? "border-green bg-green text-white"
          : "border-green-bright/50 bg-green-bright/10 text-green-bright hover:border-green hover:bg-green hover:text-white",
      )}
    >
      {copied ? (
        <Check aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.5} />
      ) : (
        <Copy aria-hidden="true" className="size-5 shrink-0" strokeWidth={2} />
      )}
      <span aria-live="polite">{copied ? "¡Copiado!" : "Copiar prompt"}</span>
    </button>
  );
}
