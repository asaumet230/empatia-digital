import { Phone } from "lucide-react";
import { cn } from "@/lib/cn";
import type { HelpLine } from "@/lib/oraculo/config/lineas";

/** One tap starts the call on a phone. The first button of a panel is the most visible. */
export function HelpLineButton({ line, primary = false }: { line: HelpLine; primary?: boolean }) {
  return (
    <a
      href={line.href}
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4 transition-[filter,border-color] hover:brightness-105",
        primary ? "border-transparent bg-green-bright text-navy-dark" : "border-o-line bg-o-surface text-o-text hover:border-o-accent",
      )}
    >
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-full",
          primary ? "bg-navy-dark text-green-bright" : "bg-o-raised text-o-accent",
        )}
      >
        <Phone aria-hidden="true" className="size-5" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-xl font-bold tracking-[-0.02em]">{line.number}</span>
          <span className="text-sm font-semibold">{line.name}</span>
        </span>
        <span className={cn("mt-0.5 block text-sm leading-snug", primary ? "text-navy-dark/80" : "text-o-muted")}>
          {line.when} · {line.hours}
        </span>
      </span>
    </a>
  );
}
