import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** A face per option, so "who talks to whom" reads at a glance. */
const FACES: Record<string, string> = { papa: "👨", mama: "👩", acudiente: "🧓", hijo: "👦", hija: "👧" };

interface RoleChoiceProps<T extends { id: string; label: string }> {
  step: number;
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

/** One step of "who talks to whom": equal tiles with a big face, one of them chosen. */
export function RoleChoice<T extends { id: string; label: string }>({
  step,
  label,
  options,
  value,
  onChange,
}: RoleChoiceProps<T>) {
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-gray-light">
        <span className="grid size-6 place-items-center rounded-full bg-green-bright/15 font-mono text-xs text-green-bright">
          {step}
        </span>
        {label}
      </p>
      <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => {
          const on = option.id === value.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(option)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-sm font-semibold transition-colors duration-300",
                on
                  ? "border-green-bright bg-green-bright/10 text-white"
                  : "border-white/10 bg-navy-dark/40 text-gray-light hover:border-green-bright/50 hover:text-white",
              )}
            >
              {on && (
                <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-green-bright text-navy-dark">
                  <Check aria-hidden="true" className="size-3" strokeWidth={3.5} />
                </span>
              )}
              <span aria-hidden="true" className="text-3xl leading-none">
                {FACES[option.id]}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
