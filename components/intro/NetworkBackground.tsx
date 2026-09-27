"use client";

import { useEffect, useRef, type RefObject } from "react";
import { phaseIndex } from "@/lib/intro-timeline";
import type { IntroPhase } from "@/types/presentation";

/* ------------------------------------------------------------------ */
/*  A breathing field of nodes. Links form by proximity and fade with  */
/*  distance. A wave spreads from the spark and switches the network   */
/*  on ring by ring as the boot steps advance.                         */
/* ------------------------------------------------------------------ */

interface FieldNode {
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

const GREEN = "53 201 94";
const WHITE = "244 246 248";

/** How far (0..~1.2 of the half-diagonal) the wave has reached at each phase. */
const REVEAL: Record<IntroPhase, number> = {
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
function buildField(cols: number, rows: number) {
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

function makeGlowSprite(rgb: string) {
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

interface NetworkBackgroundProps {
  phase: IntroPhase;
  reducedMotion: boolean;
  /** Element the activation wave emanates from (the spark). Falls back to the center. */
  originRef?: RefObject<HTMLElement | null>;
}

export function NetworkBackground({ phase, reducedMotion, originRef }: NetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const measureOriginRef = useRef<() => void>(() => {});

  useEffect(() => {
    phaseRef.current = phase;
    measureOriginRef.current();
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    let width = 0;
    let height = 0;
    let linkDist = 140;
    let nodes: FieldNode[] = [];
    let layout = "";
    const glow = makeGlowSprite(GREEN);

    // Wave origin (px), eased toward its target
    const origin = { x: 0, y: 0, tx: 0, ty: 0 };
    const pointer = { x: -9999, y: -9999, on: 0, target: 0 };
    let reveal = 0;
    let dim = 1;
    let converge = 0;
    let raf = 0;
    let last = performance.now();
    let visible = true;

    const measureOrigin = () => {
      const el = originRef?.current;
      const canvasRect = canvas.getBoundingClientRect();
      if (el && phaseIndex(phaseRef.current) < phaseIndex("converge")) {
        const r = el.getBoundingClientRect();
        origin.tx = r.left + r.width / 2 - canvasRect.left;
        origin.ty = r.top + r.height / 2 - canvasRect.top;
      } else {
        origin.tx = width / 2;
        origin.ty = height / 2;
      }
    };
    measureOriginRef.current = measureOrigin;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Roughly one node per ~130px cell; fewer on small screens
      const cols = Math.max(5, Math.round(width / 135));
      const rows = Math.max(6, Math.round(height / 120));
      const key = `${cols}x${rows}`;
      if (key !== layout) {
        layout = key;
        nodes = buildField(cols, rows);
      }
      linkDist = Math.min(width / cols, height / rows) * 1.75;

      measureOrigin();
      if (!origin.x && !origin.y) {
        origin.x = origin.tx;
        origin.y = origin.ty;
      }
      if (reducedMotion) draw(0, 1);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.target = 1;
    };
    const onLeave = () => (pointer.target = 0);

    function draw(time: number, dt: number) {
      const phase = phaseRef.current;
      const pi = phaseIndex(phase);
      const spark = pi >= phaseIndex("spark");
      const converged = pi >= phaseIndex("converge");
      const branded = pi >= phaseIndex("brand");

      const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 3);
      const kWave = reducedMotion ? 1 : 1 - Math.exp(-dt * 1.3);

      const prevReveal = reveal;
      reveal += (REVEAL[phase] - reveal) * kWave;
      const waveSpeed = reducedMotion ? 0 : Math.min(Math.abs(reveal - prevReveal) / Math.max(dt, 1e-3), 1);
      dim += ((branded ? 0.5 : 1) - dim) * kWave;
      converge += ((converged ? 1 : 0) - converge) * kWave;
      origin.x += (origin.tx - origin.x) * k;
      origin.y += (origin.ty - origin.y) * k;
      pointer.on += (pointer.target - pointer.on) * k;

      const maxR = Math.hypot(width, height) / 2;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Update nodes
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

      // Text-safe zone: soften everything that passes behind the central copy
      const calm = (x: number, y: number) => {
        const ex = (x - cx) / (width * 0.3);
        const ey = (y - cy) / (height * 0.26);
        return 0.25 + 0.75 * smoothstep(0.55, 1.15, Math.hypot(ex, ey));
      };

      // Links
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (a.act < 0.05) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (b.act < 0.05) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (Math.abs(dx) > linkDist || Math.abs(dy) > linkDist) continue;
          const dist = Math.hypot(dx, dy);
          if (dist > linkDist) continue;
          const falloff = 1 - dist / linkDist;
          const strength = falloff * falloff * Math.min(a.act, b.act);
          const alpha =
            strength * (0.32 + 0.18 * converge) * dim * calm((a.x + b.x) / 2, (a.y + b.y) / 2);
          if (alpha < 0.008) continue;
          ctx.strokeStyle = `rgb(${GREEN} / ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        // Pointer links (desktop only)
        if (pointer.on > 0.01) {
          const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (pd < linkDist * 1.3) {
            const f = 1 - pd / (linkDist * 1.3);
            ctx.strokeStyle = `rgb(${WHITE} / ${f * f * 0.35 * a.act * pointer.on * dim})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      // Wave front: a faint ring that is only visible while the wave travels
      if (waveSpeed > 0.01 && spark) {
        const ringR = reveal * maxR;
        ctx.strokeStyle = `rgb(${GREEN} / ${Math.min(waveSpeed * 0.9, 0.22) * dim})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, ringR, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Nodes
      for (const n of nodes) {
        if (n.act < 0.02) continue;
        const c = calm(n.x, n.y);
        const breathe = reducedMotion ? 1 : 0.85 + 0.15 * Math.sin(time * 0.0016 * n.speed + n.seed);
        const alpha = n.act * dim * c * breathe;

        if (n.flash > 0 || n.r > 1.8) {
          const size = (n.r > 1.8 ? 22 : 10) + n.flash * 34;
          ctx.globalAlpha = Math.min(1, (n.r > 1.8 ? 0.45 : 0) * alpha + n.flash * 0.8 * c * dim);
          ctx.drawImage(glow, n.x - size / 2, n.y - size / 2, size, size);
          ctx.globalAlpha = 1;
        }

        ctx.fillStyle = n.flash > 0.4 ? `rgb(${WHITE} / ${alpha})` : `rgb(${GREEN} / ${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Convergence glow at the center
      if (converge > 0.01) {
        const size = Math.min(width, height) * 0.9;
        ctx.globalAlpha = 0.16 * converge * dim;
        ctx.drawImage(glow, cx - size / 2, cy - size / 2, size, size);
        ctx.globalAlpha = 1;
      }
    }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(now, dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reducedMotion || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion, originRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
