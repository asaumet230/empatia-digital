"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, PlayCircle, X } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { AI_BLOCK, AI_TOOLS, type AiCategory, type AiCategoryTool, type AiToolId } from "@/lib/content/ia-ecosistema";

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
    <div id="ia-map-panel" aria-live="polite" className="relative lg:flex lg:min-h-[34rem] lg:flex-col lg:justify-center">
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
  example?: AiCategoryTool["example"];
  onSelect: (id: AiToolId) => void;
}

function ToolRow({ id, open, description, points, example, onSelect }: ToolRowProps) {
  const tool = AI_TOOLS[id];
  const select = () => onSelect(id);

  return (
    <li
      className={cn(
        "rounded-2xl border transition-colors duration-300",
        open ? "border-green-bright/35 bg-white/[0.04]" : "border-transparent",
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
            open ? "bg-white/10" : "bg-white/[0.04] group-hover:bg-white/[0.08]",
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
            <div className="px-3 pb-4 text-[0.9375rem] leading-relaxed text-gray-light sm:pl-[4.125rem] md:text-base">
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

/**
 * "Ver ejemplo": a video made with the tool, in a large modal like the other ones
 * (native <dialog>: Esc, the close button or a click on the backdrop close it). The video only
 * plays when the viewer presses play, and pauses when the modal closes.
 */
function ExampleVideo({ example }: { example: NonNullable<AiCategoryTool["example"]> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);


  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#B69CFF]/50 bg-[#B69CFF]/10 px-4 py-2 text-sm font-semibold text-[#CDBBFF] transition-colors hover:border-[#7A5CE0] hover:bg-[#7A5CE0] hover:text-white"
      >
        <PlayCircle aria-hidden="true" className="size-4" strokeWidth={2} />
        Ver ejemplo
      </button>

      <dialog
        ref={dialog}
        aria-label={example.title}
        onClose={() => video.current?.pause()}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto w-[min(calc(100vw-1.5rem),64rem)] rounded-3xl border border-white/10 bg-navy-deep p-0 text-white shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
          <p className="flex items-center gap-3 font-display text-lg font-bold tracking-[-0.02em] sm:text-2xl">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#B69CFF]/15 text-[#CDBBFF]">
              <PlayCircle aria-hidden="true" className="size-5" strokeWidth={2} />
            </span>
            {example.title}
          </p>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => dialog.current?.close()}
            className="grid size-10 shrink-0 place-items-center rounded-full text-gray-light transition-colors hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={2} />
          </button>
        </div>
        <div className="p-5 sm:p-8">
          <video
            ref={video}
            src={example.src}
            poster={example.poster}
            controls
            playsInline
            preload="metadata"
            className="max-h-[70svh] w-full rounded-2xl border border-white/10 bg-black object-contain"
          />
        </div>
      </dialog>
    </>
  );
}
