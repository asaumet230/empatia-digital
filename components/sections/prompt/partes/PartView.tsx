import { motion } from "framer-motion";
import { DURATION, EASE, transition } from "@/lib/animations";
import type { PromptBlock, PromptPart } from "@/lib/content/prompt-encuesta";
import { twoDigits } from "@/lib/format";

interface PartViewProps {
  part: PromptPart;
  step: number;
  total: number;
  /** 1 forward, -1 back: the part slides in from that side. */
  direction: number;
}

/** One part of the prompt, big: its number and name, an example line and the explanation. */
export function PartView({ part, step, total, direction }: PartViewProps) {
  return (
    <motion.div
      custom={direction}
      variants={{
        enter: (d: number) => ({ opacity: 0, x: 40 * d, filter: "blur(8px)" }),
        center: { opacity: 1, x: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
        leave: (d: number) => ({
          opacity: 0,
          x: -30 * d,
          filter: "blur(8px)",
          transition: transition(DURATION.fast, 0, EASE.inOutQuint),
        }),
      }}
      initial="enter"
      animate="center"
      exit="leave"
    >
      {/* Name on its own row: long words (INSTRUCCIONES) never run into the text */}
      <p className="font-mono text-sm tracking-[0.2em]" style={{ color: part.color }}>
        {twoDigits(step + 1)} / {twoDigits(total)}
      </p>
      <p
        className="mt-2 wrap-break-word font-display text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold uppercase leading-none tracking-[-0.03em]"
        style={{ color: part.color }}
      >
        {part.name}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-14">
        <p
          className="self-start border-l-2 pl-4 text-lg italic leading-snug text-gray-light md:text-xl"
          style={{ borderColor: part.color }}
        >
          “{part.quote}”
        </p>
        <div className="space-y-4 text-lg leading-relaxed text-gray-text md:text-xl">
          {part.explain.map((block, k) => (
            <Block key={k} block={block} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Block({ block }: { block: PromptBlock }) {
  switch (block.kind) {
    case "text":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul className="space-y-1.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-green-bright" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "compare":
      return (
        <div className="grid gap-3 text-base md:text-lg">
          <p className="flex items-start gap-3 rounded-xl border border-white/10 px-4 py-3 text-gray-muted">
            <span aria-label="Menos claro" className="font-bold text-[#FF7A7A]">
              ✕
            </span>
            “{block.weak}”
          </p>
          <p className="flex items-start gap-3 rounded-xl border border-green-bright/40 bg-green/10 px-4 py-3 text-gray-light">
            <span aria-label="Más claro" className="font-bold text-green-bright">
              ✓
            </span>
            “{block.strong}”
          </p>
        </div>
      );
  }
}
