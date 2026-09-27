import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  /** Accessible name of the slide. */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * A "web slide": full viewport height, snap point, and a landmark for assistive tech.
 * Content that needs more room can grow past 100svh — snapping is set to "proximity".
 */
export function Section({ id, label, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("relative isolate min-h-svh w-full snap-start", className)}
    >
      {children}
    </section>
  );
}
