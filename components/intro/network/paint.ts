import { GREEN, WHITE, type FieldNode } from "@/components/intro/network/field";

/* ------------------------------------------------------------------ */
/*  One frame of the network, layer by layer: links, the wave front,   */
/*  the nodes and the convergence glow. Pure drawing: every value it   */
/*  needs comes in through `Frame`.                                    */
/* ------------------------------------------------------------------ */

export interface Frame {
  ctx: CanvasRenderingContext2D;
  nodes: readonly FieldNode[];
  glow: HTMLCanvasElement;
  time: number;
  reducedMotion: boolean;
  linkDist: number;
  /** 0..1: how much the network has gathered at the center. */
  converge: number;
  /** 0..1: overall brightness (dims once the brand appears). */
  dim: number;
  /** Softens whatever passes behind the central text. */
  calm: (x: number, y: number) => number;
  pointer: { x: number; y: number; on: number };
}

/** Lines between nearby active nodes, plus lines to the mouse pointer (desktop only). */
export function paintLinks({ ctx, nodes, linkDist, converge, dim, calm, pointer }: Frame) {
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
      const alpha = strength * (0.32 + 0.18 * converge) * dim * calm((a.x + b.x) / 2, (a.y + b.y) / 2);
      if (alpha < 0.008) continue;
      ctx.strokeStyle = `rgb(${GREEN} / ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

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
}

/** A faint ring at the wave front, only visible while the wave travels. */
export function paintWave(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number) {
  ctx.strokeStyle = `rgb(${GREEN} / ${alpha})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/** Each active node: it breathes, the big ones glow, and a freshly lit one sparkles white. */
export function paintNodes({ ctx, nodes, glow, time, reducedMotion, dim, calm }: Frame) {
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
}

/** The soft glow at the center once the network converges. */
export function paintConvergence({ ctx, glow, converge, dim }: Frame, cx: number, cy: number, size: number) {
  ctx.globalAlpha = 0.16 * converge * dim;
  ctx.drawImage(glow, cx - size / 2, cy - size / 2, size, size);
  ctx.globalAlpha = 1;
}
