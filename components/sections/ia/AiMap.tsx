"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, type MouseEvent, type PointerEvent } from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { DURATION, EASE, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { AI_TOOLS, type AiCategory, type AiToolId } from "@/lib/content/ia-ecosistema";

/* ------------------------------------------------------------------ */
/*  Radial map in three rings, so nothing collides:                    */
/*  labels on the spokes → category nodes → tools of the active one on */
/*  an outer arc. Geometry is in % of a square stage, shared by the    */
/*  SVG links (viewBox 0..100) and the DOM nodes.                      */
/* ------------------------------------------------------------------ */

const LABEL_RING = 15;
const ORBIT = 26;
const TOOL_RING = 45;
const TOOL_SPREAD = 24; // degrees between sibling tools on the outer ring

interface Point {
  x: number;
  y: number;
}

const polar = (deg: number, r: number): Point => {
  const a = (deg * Math.PI) / 180;
  return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r };
};

const categoryAngle = (i: number, total: number) => -90 + (360 / total) * i;

/** Tools fan out on the outer ring, centred on their category's angle. */
const toolPoint = (angle: number, j: number, count: number) =>
  polar(angle + (j - (count - 1) / 2) * TOOL_SPREAD, TOOL_RING);

const pct = (p: Point) => ({ left: `${p.x}%`, top: `${p.y}%` });

const onMouseEnter = (fn: () => void) => (e: PointerEvent) => {
  // Touch/pen select on tap instead, so a tap never toggles twice
  if (e.pointerType === "mouse") fn();
};

const reveal = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: transition(DURATION.slow, delay) },
});

const drawLine = (delay: number): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: transition(DURATION.slow, delay, EASE.outQuart) },
});

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
      className="relative mx-auto aspect-square w-full max-w-[26rem] sm:max-w-[32rem] lg:max-w-[min(100%,72svh)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      {/* Links */}
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
                "grid size-12 place-items-center rounded-full border backdrop-blur-sm transition-all duration-500 sm:size-16 lg:size-[4.5rem]",
                on
                  ? "scale-110 border-green-bright bg-green/20 text-green-bright shadow-[0_0_32px_rgb(53_201_94/0.45)]"
                  : "border-white/15 bg-navy/80 text-gray-light group-hover:border-green-bright/60",
                dimmed && "opacity-40",
              )}
            >
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 sm:size-6 lg:size-7" />
            </span>
          </motion.button>
        );
      })}

      {/* Category names sit on the spokes, masking the line behind them */}
      {categories.map((c, i) => {
        const on = c.id === activeId;
        return (
          <motion.span
            key={c.id}
            aria-hidden="true"
            style={pct(polar(categoryAngle(i, total), LABEL_RING))}
            className={cn(
              "pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-navy-dark px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] transition-all duration-500 sm:text-[0.6875rem]",
              on ? "text-green-bright" : "text-gray-text",
              activeId !== null && !on && "opacity-55",
            )}
            variants={reveal(0.6 + i * 0.08)}
          >
            {c.label}
          </motion.span>
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
                <span
                  className={cn(
                    "absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-full border bg-navy-dark/90 px-2.5 py-1 font-mono text-[0.6875rem] uppercase leading-none tracking-[0.14em] transition-colors duration-300 md:block",
                    on ? "border-white/30 text-white" : "border-white/10 text-gray-text",
                  )}
                >
                  {tool.name}
                  {on && <ArrowUpRight aria-hidden="true" className="-mr-1 ml-1 inline size-3 align-[-0.15em]" />}
                </span>
              </motion.a>
            );
          })}
      </AnimatePresence>
    </motion.div>
  );
}
