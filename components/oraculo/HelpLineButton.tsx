import { Phone } from "lucide-react";
import { cn } from "@/lib/cn";
import type { HelpLine } from "@/lib/oraculo/config/lineas";

interface HelpLineButtonProps {
  line: HelpLine;
  /** The first button of a panel is the most visible. */
  primary?: boolean;
  /** Smaller, so the full list fits on screen without scrolling (the help-lines dialog). */
  compact?: boolean;
}

/** One tap starts the call on a phone. */
export function HelpLineButton({ line, primary = false, compact = false }: HelpLineButtonProps) {
  return (
    <a
      href={line.href}
      className={cn(
        "flex items-center rounded-2xl border transition-[filter,border-color] hover:brightness-105",
        compact ? "gap-3 px-3 py-2.5" : "gap-4 p-4",
        primary ? "border-transparent bg-green-bright text-navy-dark" : "border-o-line bg-o-surface text-o-text hover:border-o-accent",
      )}
    >
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full",
          compact ? "size-9" : "size-11",
          primary ? "bg-navy-dark text-green-bright" : "bg-o-raised text-o-accent",
        )}
      >
        <Phone aria-hidden="true" className={compact ? "size-4" : "size-5"} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className={cn("whitespace-nowrap font-display font-bold tracking-[-0.02em]", compact ? "text-lg" : "text-xl")}>
            {line.number}
          </span>
          <span className={cn("font-semibold", compact ? "text-xs" : "text-sm")}>{line.name}</span>
        </span>
        <span
          className={cn(
            "mt-0.5 block leading-snug",
            compact ? "text-xs" : "text-sm",
            primary ? "text-navy-dark/80" : "text-o-muted",
          )}
        >
          {line.when} · {line.hours}
        </span>
      </span>
    </a>
  );
}
