import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  /** Accessible name of the slide. */
  label: string;
  children: ReactNode;
  className?: string;
  /** Leave room on the right for the progress index (default). The intro, centered and short, opts out. */
  gutter?: boolean;
}

/**
 * A "web slide": full viewport height, snap point, and a landmark for assistive tech.
 * Content that needs more room can grow past 100svh — snapping is set to "proximity".
 * On a phone a slide is only as tall as its content, so short slides leave no empty screen.
 * From `md` up, the right padding keeps the content clear of the progress index (`gutter`).
 */
export function Section({ id, label, children, className, gutter = true }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("relative isolate w-full snap-start md:min-h-svh", gutter && "md:pr-20 lg:pr-24", className)}
    >
      {children}
    </section>
  );
}
