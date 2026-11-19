"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ToolRow } from "@/components/sections/ia/mapa/ToolRow";
import { DURATION, swapVariants, transition } from "@/lib/animations";
import { AI_BLOCK, type AiCategory, type AiToolId } from "@/lib/content/ia-ecosistema";
import { twoDigits } from "@/lib/format";

const swap = swapVariants(14, 10);

interface AiMapPanelProps {
  categories: readonly AiCategory[];
  activeId: string | null;
  toolId: AiToolId | null;
  onSelectCategory: (id: string) => void;
  onSelectTool: (id: AiToolId) => void;
}

/** The information card: category, its tools (one expanded at a time) and the key phrase. */
export function AiMapPanel({ categories, activeId, toolId, onSelectCategory, onSelectTool }: AiMapPanelProps) {
  const index = categories.findIndex((c) => c.id === activeId);
  const category = index >= 0 ? categories[index] : null;

  return (
    <div id="ia-map-panel" aria-live="polite" className="relative lg:flex lg:min-h-136 lg:flex-col lg:justify-center">
      <AnimatePresence mode="wait" initial={false}>
        {category ? (
          <motion.div key={category.id} {...swap}>
            <p className="hud-label flex items-center gap-3">
              <span>
                <span className="text-green-bright">{twoDigits(index + 1)}</span> / {twoDigits(categories.length)}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-gray-muted/50" />
              <span>{category.label}</span>
            </p>
            <h3 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.4rem)] font-bold leading-[1.08] tracking-[-0.02em]">
              {category.title}
            </h3>

            <ul className="mt-6 space-y-1.5">
              {category.tools.map((t) => (
                <ToolRow
                  key={t.id}
                  id={t.id}
                  open={t.id === toolId}
                  description={t.description}
                  points={t.points}
                  example={t.example}
                  onSelect={onSelectTool}
                />
              ))}
            </ul>

            {category.quote && (
              <motion.blockquote
                className="mt-8 border-l-2 border-yellow pl-5 text-base leading-snug text-gray-light md:text-lg"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0, transition: transition(DURATION.base, 0.25) }}
              >
                “{category.quote}”
              </motion.blockquote>
            )}
          </motion.div>
        ) : (
          <motion.div key="idle" {...swap}>
            <p className="hud-label">
              <span className="hidden [@media(hover:hover)]:inline">{AI_BLOCK.mapHint.pointer}</span>
              <span className="[@media(hover:hover)]:hidden">{AI_BLOCK.mapHint.touch}</span>
            </p>
            <ul className="mt-6 border-t border-line">
              {categories.map((c, i) => {
                const Icon = c.icon;
                return (
                  <li key={c.id} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => onSelectCategory(c.id)}
                      className="group flex w-full items-center gap-4 py-3.5 text-left"
                    >
                      <span className="font-mono text-[0.6875rem] tracking-[0.15em] text-green-bright">
                        {twoDigits(i + 1)}
                      </span>
                      <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 text-gray-muted transition-colors group-hover:text-green-bright" />
                      <span className="font-display text-lg font-medium transition-colors group-hover:text-white md:text-xl">
                        {c.can}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ml-auto h-px w-4 bg-gray-muted/50 transition-all duration-500 group-hover:w-8 group-hover:bg-green-bright"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
