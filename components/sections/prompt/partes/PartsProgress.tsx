import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { PromptPart } from "@/lib/content/prompt-encuesta";
import { twoDigits } from "@/lib/format";

interface PartsProgressProps {
  parts: readonly PromptPart[];
  step: number;
  onSelect: (i: number) => void;
}

/** A bar per part, lit up to the current one; each bar jumps to its part. Arrives with `fadeUp`. */
export function PartsProgress({ parts, step, onSelect }: PartsProgressProps) {
  return (
    <motion.ol variants={fadeUp} className="mt-8 grid grid-cols-6 gap-2 md:gap-3">
      {parts.map((p, i) => {
        const on = i === step;
        const seen = i <= step;
        return (
          <li key={p.id}>
            <button
              type="button"
              aria-current={on ? "step" : undefined}
              aria-label={`${twoDigits(i + 1)} ${p.name}`}
              onClick={() => onSelect(i)}
              className="group flex w-full flex-col gap-2 text-left"
            >
              <span
                className="h-1 w-full rounded-full transition-all duration-500"
                style={{
                  backgroundColor: seen ? p.color : "rgb(255 255 255 / 0.1)",
                  boxShadow: on ? `0 0 14px ${p.color}` : undefined,
                }}
              />
              <span
                className={cn(
                  "hidden font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors sm:block",
                  on ? "font-bold" : "text-gray-text group-hover:text-white",
                )}
                style={on ? { color: p.color } : undefined}
              >
                {p.name}
              </span>
            </button>
          </li>
        );
      })}
    </motion.ol>
  );
}
