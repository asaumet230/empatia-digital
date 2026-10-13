import { LifeBuoy, ShieldAlert } from "lucide-react";
import { HelpLineButton } from "@/components/oraculo/HelpLineButton";
import { cn } from "@/lib/cn";
import { HELP_LINES } from "@/lib/oraculo/config/lineas";
import { safetyMessage } from "@/lib/oraculo/config/mensajes-seguridad";
import type { Audience, SafetyKey } from "@/lib/oraculo/tipos";

interface SafetyPanelProps {
  safetyKey: SafetyKey;
  audience: Audience;
  className?: string;
}

/**
 * The fixed safety message for a situation, word for word, with its call buttons.
 * Calm but impossible to miss; immediate danger gets the alert color.
 */
export function SafetyPanel({ safetyKey, audience, className }: SafetyPanelProps) {
  const msg = safetyMessage(safetyKey, audience);
  const urgent = safetyKey === "peligro_inmediato";
  const Icon = urgent ? ShieldAlert : LifeBuoy;
  const titleId = `panel-${safetyKey}`;

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "rounded-3xl border-2 p-5 md:p-6",
        urgent ? "border-o-alert bg-o-alert-soft" : "border-o-help/50 bg-o-help-soft",
        className,
      )}
    >
      <h2 id={titleId} className="flex items-center gap-3 font-display text-xl font-bold tracking-[-0.02em]">
        <Icon aria-hidden="true" className={cn("size-6 shrink-0", urgent ? "text-o-alert" : "text-o-help")} />
        {msg.title}
      </h2>
      <div className="mt-3 space-y-2 text-base leading-relaxed">
        {msg.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <ol className="mt-4 space-y-2">
        {msg.steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-base leading-snug">
            <span
              aria-hidden="true"
              className="grid size-6 shrink-0 place-items-center rounded-full bg-o-surface font-mono text-xs font-bold"
            >
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {msg.lines.map((id, i) => (
          <HelpLineButton key={id} line={HELP_LINES[id]} primary={i === 0} />
        ))}
      </div>
    </section>
  );
}
