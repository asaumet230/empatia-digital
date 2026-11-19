"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { PointerEvent } from "react";
import { ExampleVideo } from "@/components/sections/ia/mapa/ExampleVideo";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { AI_TOOLS, type AiCategoryTool, type AiToolId } from "@/lib/content/ia-ecosistema";

interface ToolRowProps {
  id: AiToolId;
  open: boolean;
  description?: string;
  points?: readonly string[];
  example?: AiCategoryTool["example"];
  onSelect: (id: AiToolId) => void;
}

/** A tool of the open category; when expanded, what it does, a link to its site and an optional example. */
export function ToolRow({ id, open, description, points, example, onSelect }: ToolRowProps) {
  const tool = AI_TOOLS[id];
  const select = () => onSelect(id);

  return (
    <li
      className={cn(
        "rounded-2xl border transition-colors duration-300",
        open ? "border-green-bright/35 bg-white/4" : "border-transparent",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onPointerEnter={(e: PointerEvent) => e.pointerType === "mouse" && select()}
        onClick={select}
        onFocus={select}
        className="group flex w-full items-center gap-3.5 rounded-2xl px-3 py-2.5 text-left focus-visible:outline-offset-0"
      >
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
            open ? "bg-white/10" : "bg-white/4 group-hover:bg-white/8",
          )}
        >
          <BrandIcon src={tool.icon} color={open ? tool.color : "var(--gray-text)"} className="size-5" />
        </span>
        <span
          className={cn(
            "font-display text-base font-semibold tracking-[-0.01em] transition-colors md:text-lg",
            open ? "text-white" : "text-gray-light group-hover:text-white",
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
            <div className="px-3 pb-4 text-[0.9375rem] leading-relaxed text-gray-light sm:pl-16.5 md:text-base">
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
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-green-bright/50 px-4 py-2 text-sm font-semibold text-green-bright transition-colors hover:bg-green hover:text-white"
                >
                  Visitar {tool.name}
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
                {example && <ExampleVideo example={example} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
