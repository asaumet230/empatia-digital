import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface BrandIconProps {
  /** Monochrome SVG/PNG; only its alpha is used. */
  src: string;
  /** Any CSS color. Defaults to the current text color. */
  color?: string;
  className?: string;
}

/**
 * Paints a logo with a CSS mask so it can take any color:
 * white at rest, brand color when active — same file, no duplicates.
 */
export function BrandIcon({ src, color, className }: BrandIconProps) {
  const mask = `url("${src}") center / contain no-repeat`;
  const style: CSSProperties = {
    WebkitMask: mask,
    mask,
    backgroundColor: color ?? "currentColor",
  };

  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 transition-[background-color] duration-500", className)}
      style={style}
    />
  );
}
