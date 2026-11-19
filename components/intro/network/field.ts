import type { IntroPhase } from "@/types/presentation";

/* ------------------------------------------------------------------ */
/*  The node field behind the intro: its data, how it is laid out and  */
/*  the small math helpers the drawing uses. No React, no DOM state.   */
/* ------------------------------------------------------------------ */

export interface FieldNode {
  bx: number; // base position, normalized 0..1
  by: number;
  r: number;
  seed: number;
  speed: number;
  act: number; // 0..1 activation
  flash: number; // 0..1 decaying sparkle when first activated
  lit: boolean;
  x: number; // current px position (per frame)
  y: number;
}

export const GREEN = "53 201 94";
export const WHITE = "244 246 248";

/** How far (0..~1.2 of the half-diagonal) the wave has reached at each phase. */
export const REVEAL: Record<IntroPhase, number> = {
  void: 0,
  spark: 0,
  boot: 0.1,
  connect: 0.4,
  analyze: 0.68,
  activate: 0.96,
  converge: 1.3,
  brand: 1.3,
  ready: 1.3,
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Jittered grid: even coverage without looking like a grid. */
export function buildField(cols: number, rows: number) {
  const rand = mulberry32(1618);
  const nodes: FieldNode[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const big = rand() > 0.9;
      nodes.push({
        bx: (col + 0.5 + (rand() - 0.5) * 0.85) / cols,
        by: (row + 0.5 + (rand() - 0.5) * 0.85) / rows,
        r: big ? 1.8 + rand() * 0.8 : 0.7 + rand() * 0.9,
        seed: rand() * 1000,
        speed: 0.6 + rand() * 0.8,
        act: 0,
        flash: 0,
        lit: false,
        x: 0,
        y: 0,
      });
    }
  }
  return nodes;
}

export function makeGlowSprite(rgb: string) {
  const size = 96;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgb(${rgb} / 0.9)`);
  grad.addColorStop(0.2, `rgb(${rgb} / 0.4)`);
  grad.addColorStop(1, `rgb(${rgb} / 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
};

interface Motion {
  time: number;
  dt: number;
  /** Easing factor for this frame (0..1). */
  k: number;
  width: number;
  height: number;
  /** Where the activation wave starts, in px. */
  origin: { x: number; y: number };
  /** Distance that counts as "the whole screen" for the wave. */
  maxR: number;
  /** How far the wave has reached (see REVEAL). */
  reveal: number;
  /** False before the spark: the field stays dark. */
  spark: boolean;
  reducedMotion: boolean;
}

/** One step of the field: nodes drift a little, switch on as the wave passes and sparkle once. */
export function moveNodes(nodes: FieldNode[], { time, dt, k, width, height, origin, maxR, reveal, spark, reducedMotion }: Motion) {
  for (const n of nodes) {
    const t = time * 0.00018 * n.speed;
    n.x = n.bx * width + (reducedMotion ? 0 : Math.sin(t + n.seed) * 10);
    n.y = n.by * height + (reducedMotion ? 0 : Math.cos(t * 0.9 + n.seed * 1.3) * 10);

    const d = Math.hypot(n.x - origin.x, n.y - origin.y) / maxR;
    const target = spark ? Math.max(0.06, smoothstep(d - 0.02, d + 0.1, reveal)) : 0;
    n.act += (target - n.act) * k;

    if (!n.lit && n.act > 0.5) {
      n.lit = true;
      n.flash = 1;
    }
    n.flash = reducedMotion ? 0 : Math.max(0, n.flash - dt * 0.9);
  }
}

/** Text-safe zone: a factor that softens everything passing behind the central copy. */
export function calmZone(width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  return (x: number, y: number) => {
    const ex = (x - cx) / (width * 0.3);
    const ey = (y - cy) / (height * 0.26);
    return 0.25 + 0.75 * smoothstep(0.55, 1.15, Math.hypot(ex, ey));
  };
}
