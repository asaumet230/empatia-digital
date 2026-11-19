"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, type MouseEvent, type PointerEvent } from "react";
import { categoryAngle, onMouseEnter, ORBIT, pct, polar, reveal, toolPoint } from "@/components/sections/ia/mapa/geometry";
import { MapLinks } from "@/components/sections/ia/mapa/MapLinks";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { DURATION, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { AI_TOOLS, type AiCategory, type AiToolId } from "@/lib/content/ia-ecosistema";

/* ------------------------------------------------------------------ */
/*  Radial map in two rings: category nodes (name under each) and the  */
/*  tools of the active one on an outer arc. Only the selected tool    */
/*  shows its name, facing outwards, so nothing collides at any size.  */
/*  Geometry: mapa/geometry.ts · lines: mapa/MapLinks.tsx.             */
/* ------------------------------------------------------------------ */

interface AiMapProps {
  categories: readonly AiCategory[];
  activeId: string | null;
  toolId: AiToolId | null;
  onSelectCategory: (id: string) => void;
  onSelectTool: (id: AiToolId) => void;
  onReset: () => void;
}

export function AiMap({ categories, activeId, toolId, onSelectCategory, onSelectTool, onReset }: AiMapProps) {
  const total = categories.length;
  const activeIndex = categories.findIndex((c) => c.id === activeId);
  const active = activeIndex >= 0 ? categories[activeIndex] : null;
  const activeAngle = categoryAngle(activeIndex, total);
  const activePoint = polar(activeAngle, ORBIT);
  // Tools are links. With a mouse, hover shows the info and a click opens the site;
  // on touch there is no hover, so the first tap shows the info and the second opens it.
  const lastPointer = useRef("mouse");
  const onToolClick = (id: AiToolId, on: boolean) => (e: MouseEvent) => {
    const keyboard = e.detail === 0;
    if (!keyboard && lastPointer.current !== "mouse" && !on) {
      e.preventDefault();
      onSelectTool(id);
    }
  };

  return (
    <motion.div
      className="relative mx-auto aspect-square w-full max-w-104 sm:max-w-lg lg:max-w-[min(100%,72svh)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <MapLinks
        categories={categories}
        activeId={activeId}
        toolId={toolId}
        active={active}
        activeAngle={activeAngle}
        activePoint={activePoint}
      />

      {/* Hub */}
      <motion.button
        type="button"
        onClick={onReset}
        aria-label="Ver el mapa completo"
        style={pct({ x: 50, y: 50 })}
        className="group absolute -translate-x-1/2 -translate-y-1/2"
        variants={reveal(0)}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-yellow/40 animate-pulse-ring"
        />
        <span className="relative grid size-16 place-items-center rounded-full border border-yellow/50 bg-navy-dark font-display text-xl font-extrabold text-yellow text-glow-yellow shadow-[0_0_40px_rgb(255_242_0/0.15)] transition-transform duration-500 group-hover:scale-105 sm:size-20 sm:text-2xl">
          IA
        </span>
      </motion.button>

      {/* Categories */}
      {categories.map((c, i) => {
        const on = c.id === activeId;
        const dimmed = activeId !== null && !on;
        const Icon = c.icon;
        return (
          <motion.button
            key={c.id}
            type="button"
            aria-label={c.title}
            aria-pressed={on}
            aria-controls="ia-map-panel"
            onPointerEnter={onMouseEnter(() => onSelectCategory(c.id))}
            onClick={() => onSelectCategory(c.id)}
            onFocus={() => onSelectCategory(c.id)}
            style={pct(polar(categoryAngle(i, total), ORBIT))}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
            variants={reveal(0.45 + i * 0.08)}
          >
            <span
              className={cn(
                "relative grid size-12 place-items-center rounded-full border backdrop-blur-sm transition-all duration-500 sm:size-16 lg:size-18",
                on
                  ? "scale-110 border-green-bright bg-green/20 text-green-bright shadow-[0_0_32px_rgb(53_201_94/0.45)]"
                  : "border-white/15 bg-navy/80 text-gray-light group-hover:border-green-bright/60",
                dimmed && "opacity-40",
              )}
            >
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 sm:size-6 lg:size-7" />
            </span>
            {/* The name sits under the node; the active one hides it, its tools take that room */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-navy-dark px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-opacity duration-500 sm:text-[0.6875rem]",
                on ? "opacity-0" : "text-gray-text",
                dimmed && "opacity-55",
              )}
            >
              {c.label}
            </span>
          </motion.button>
        );
      })}

      {/* Tools of the active category */}
      <AnimatePresence>
        {active &&
          active.tools.map((t, j) => {
            const tool = AI_TOOLS[t.id];
            const on = t.id === toolId;
            const p = toolPoint(activeAngle, j, active.tools.length);
            return (
              <motion.a
                key={`${active.id}-${t.id}`}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${tool.name}: abrir su sitio web en una pestaña nueva`}
                onPointerDown={(e: PointerEvent) => (lastPointer.current = e.pointerType)}
                onPointerEnter={onMouseEnter(() => onSelectTool(t.id))}
                onClick={onToolClick(t.id, on)}
                onFocus={() => onSelectTool(t.id)}
                className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
                initial={{ ...pct(activePoint), opacity: 0, scale: 0.4 }}
                animate={{ ...pct(p), opacity: 1, scale: 1 }}
                exit={{ ...pct(activePoint), opacity: 0, scale: 0.4, transition: transition(DURATION.fast) }}
                transition={transition(DURATION.base, 0.05 * j)}
              >
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-full border bg-navy-dark transition-all duration-300 sm:size-12",
                    on ? "scale-110 border-white/60 shadow-[0_0_24px_rgb(244_246_248/0.2)]" : "border-white/15",
                  )}
                >
                  <BrandIcon
                    src={tool.icon}
                    color={on ? tool.color : "var(--gray-text)"}
                    className="size-5 sm:size-6"
                  />
                </span>
                {/* Only the selected tool is named here (the panel lists them all), away from the hub */}
                {on && (
                  <span
                    className={cn(
                      "absolute whitespace-nowrap rounded-full border border-white/30 bg-navy-dark/95 px-2.5 py-1 font-mono text-[0.625rem] uppercase leading-none tracking-[0.14em] text-white sm:text-[0.6875rem]",
                      p.y < 50 ? "bottom-full mb-2" : "top-full mt-2",
                      // Near a side edge the name grows inwards, so a small screen never cuts it
                      p.x < 30 ? "left-0" : p.x > 70 ? "right-0" : "left-1/2 -translate-x-1/2",
                    )}
                  >
                    {tool.name}
                    <ArrowUpRight aria-hidden="true" className="-mr-1 ml-1 inline size-3 align-[-0.15em]" />
                  </span>
                )}
              </motion.a>
            );
          })}
      </AnimatePresence>
    </motion.div>
  );
}
