import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/cn";

/** Title sizes shared by the slides, from the biggest (opening slides) to the regular one. */
const SIZES = {
  large: "text-[clamp(2rem,5.2vw,4.25rem)] font-extrabold leading-none tracking-[-0.04em]",
  medium: "text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-none tracking-[-0.04em]",
  regular: "text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]",
} as const;

interface SlideTitleProps {
  children: ReactNode;
  size?: keyof typeof SIZES;
  /** Spacing and width; the size and font come from `size`. */
  className?: string;
}

/** A slide's main heading. Arrives with the shared `fadeUp` motion inside a stagger container. */
export function SlideTitle({ children, size = "regular", className }: SlideTitleProps) {
  return (
    <motion.h2 variants={fadeUp} className={cn(className, "font-display", SIZES[size])}>
      {children}
    </motion.h2>
  );
}
