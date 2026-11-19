import type { PointerEvent } from "react";
import type { Variants } from "framer-motion";
import { DURATION, EASE, transition } from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  Geometry of the radial map, in % of a square stage: shared by the  */
/*  SVG links (viewBox 0..100) and the DOM nodes.                      */
/* ------------------------------------------------------------------ */

export const ORBIT = 26;
export const TOOL_RING = 45;
const TOOL_SPREAD = 24; // degrees between sibling tools on the outer ring

export interface Point {
  x: number;
  y: number;
}

export const polar = (deg: number, r: number): Point => {
  const a = (deg * Math.PI) / 180;
  return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r };
};

export const categoryAngle = (i: number, total: number) => -90 + (360 / total) * i;

/** Tools fan out on the outer ring, centred on their category's angle. */
export const toolPoint = (angle: number, j: number, count: number) =>
  polar(angle + (j - (count - 1) / 2) * TOOL_SPREAD, TOOL_RING);

export const pct = (p: Point) => ({ left: `${p.x}%`, top: `${p.y}%` });

export const onMouseEnter = (fn: () => void) => (e: PointerEvent) => {
  // Touch/pen select on tap instead, so a tap never toggles twice
  if (e.pointerType === "mouse") fn();
};

export const reveal = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: transition(DURATION.slow, delay) },
});

export const drawLine = (delay: number): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: transition(DURATION.slow, delay, EASE.outQuart) },
});
