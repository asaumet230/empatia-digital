"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { PointerEvent } from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { AI_BLOCK, AI_TOOLS, type AiCategory, type AiToolId } from "@/lib/content/ia-ecosistema";

const pad = (n: number) => String(n).padStart(2, "0");

const swap = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition(DURATION.base) },
  exit: { opacity: 0, y: -10, filter: "blur(6px)", transition: transition(DURATION.fast, 0, EASE.inOutQuint) },
};

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
    <div id="ia-map-panel" aria-live="polite" className="relative lg:min-h-[34rem]">
      <AnimatePresence mode="wait" initial={false}>
        {category ? (
          <motion.div key={category.id} {...swap}>
            <p className="hud-label flex items-center gap-3">
              <span>
                <span className="text-green-bright">{pad(index + 1)}</span> / {pad(categories.length)}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-gray-muted/50" />
              <span>{category.label}</span>
            </p>
            <h3 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.4rem)] font-bold leading-[1.08] tracking-[-0.02em]">
              {category.title}
            </h3>

            <ul className="mt-6 border-t border-line">
              {category.tools.map((t) => (
                <ToolRow
                  key={t.id}
                  id={t.id}
                  open={t.id === toolId}
                  description={t.description}
                  points={t.points}
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
                        {pad(i + 1)}
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

interface ToolRowProps {
  id: AiToolId;
  open: boolean;
  description?: string;
  points?: readonly string[];
  onSelect: (id: AiToolId) => void;
}

function ToolRow({ id, open, description, points, onSelect }: ToolRowProps) {
  const tool = AI_TOOLS[id];
  const select = () => onSelect(id);

  return (
    <li className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        onPointerEnter={(e: PointerEvent) => e.pointerType === "mouse" && select()}
        onClick={select}
        onFocus={select}
        className="group flex w-full items-center gap-4 py-3 text-left"
      >
        <BrandIcon
          src={tool.icon}
          color={open ? tool.color : "var(--gray-muted)"}
          className="size-5"
        />
        <span
          className={cn(
            "font-mono text-xs uppercase tracking-[0.16em] transition-colors sm:text-[0.8125rem]",
            open ? "text-white" : "text-gray-text group-hover:text-gray-light",
          )}
        >
          {tool.name}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "ml-auto h-px transition-all duration-500",
            open ? "w-8 bg-green-bright" : "w-4 bg-gray-muted/50",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition(DURATION.base, 0, EASE.outQuart)}
          >
            <div className="pb-4 pl-9 text-[0.9375rem] leading-relaxed text-gray-text md:text-base">
              {description && <p>{description}</p>}
              {points && (
                <ul className="mt-2 space-y-1.5">
                  {points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.6em] size-1 shrink-0 rounded-full bg-green-bright" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-green-bright transition-colors hover:text-white"
              >
                Visitar {tool.name}
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
                <span className="sr-only">(se abre en una pestaña nueva)</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
