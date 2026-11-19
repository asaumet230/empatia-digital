"use client";

import { AnimatePresence, motion } from "framer-motion";
import { categoryAngle, drawLine, ORBIT, polar, TOOL_RING, toolPoint, type Point } from "@/components/sections/ia/mapa/geometry";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { AiCategory, AiToolId } from "@/lib/content/ia-ecosistema";

interface MapLinksProps {
  categories: readonly AiCategory[];
  activeId: string | null;
  toolId: AiToolId | null;
  active: AiCategory | null;
  activeAngle: number;
  activePoint: Point;
}

/** The lines of the map: both rings, a spoke per category and, for the active one, a line per tool. */
export function MapLinks({ categories, activeId, toolId, active, activeAngle, activePoint }: MapLinksProps) {
  const total = categories.length;
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
      <motion.circle
        cx={50}
        cy={50}
        r={ORBIT}
        fill="none"
        stroke="var(--line)"
        strokeWidth={0.2}
        variants={drawLine(0.2)}
      />
      <motion.circle
        cx={50}
        cy={50}
        r={TOOL_RING}
        fill="none"
        stroke="var(--line)"
        strokeWidth={0.15}
        strokeDasharray="0.4 1.2"
        className={cn("transition-opacity duration-700", active ? "opacity-100" : "opacity-40")}
        variants={drawLine(0.3)}
      />

      {categories.map((c, i) => {
        const p = polar(categoryAngle(i, total), ORBIT);
        const on = c.id === activeId;
        return (
          <motion.path
            key={c.id}
            d={`M50 50 L${p.x} ${p.y}`}
            fill="none"
            strokeLinecap="round"
            className={cn(
              "transition-[stroke,stroke-width] duration-500",
              on ? "animate-dash-flow stroke-green-bright" : "stroke-green-bright/25",
            )}
            strokeWidth={on ? 0.35 : 0.2}
            strokeDasharray={on ? "1 1.6" : undefined}
            variants={drawLine(0.35 + i * 0.08)}
          />
        );
      })}

      <AnimatePresence>
        {active &&
          active.tools.map((t, j) => {
            const p = toolPoint(activeAngle, j, active.tools.length);
            const on = t.id === toolId;
            return (
              <motion.path
                key={`${active.id}-${t.id}`}
                d={`M${activePoint.x} ${activePoint.y} L${p.x} ${p.y}`}
                fill="none"
                strokeLinecap="round"
                className={cn("transition-[stroke] duration-300", on ? "stroke-white/70" : "stroke-green-bright/45")}
                strokeWidth={0.22}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0, transition: transition(DURATION.fast) }}
                transition={transition(DURATION.base, 0.05 * j, EASE.outQuart)}
              />
            );
          })}
      </AnimatePresence>
    </svg>
  );
}
