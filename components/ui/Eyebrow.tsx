import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: ReactNode;
  /** Optional index rendered as "01". */
  index?: number;
  className?: string;
}

/** Small uppercase label that introduces a section or block. */
export function Eyebrow({ children, index, className }: EyebrowProps) {
  return (
    <p className={cn("hud-label flex items-center gap-3", className)}>
      {index !== undefined && (
        <span className="text-green-bright">{String(index).padStart(2, "0")}</span>
      )}
      <span aria-hidden="true" className="h-px w-8 bg-gray-muted/50" />
      <span>{children}</span>
    </p>
  );
}
