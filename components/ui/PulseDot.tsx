import { cn } from "@/lib/cn";

interface PulseDotProps {
  size?: number;
  /** Show the expanding ring. */
  pulsing?: boolean;
  tone?: "green" | "yellow";
  className?: string;
}

/** Small luminous status dot with an optional expanding ring. */
export function PulseDot({ size = 8, pulsing = true, tone = "green", className }: PulseDotProps) {
  const color = tone === "green" ? "bg-green-bright" : "bg-yellow";
  const glow =
    tone === "green"
      ? "shadow-[0_0_12px_2px_rgb(53_201_94/0.7)]"
      : "shadow-[0_0_12px_2px_rgb(255_242_0/0.6)]";

  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {pulsing && <span className={cn("absolute inset-0 rounded-full animate-pulse-ring", color)} />}
      <span className={cn("relative inline-flex h-full w-full rounded-full", color, glow)} />
    </span>
  );
}
