import { PlaceholderSection } from "@/components/sections/PlaceholderSection";
import type { SectionConfig } from "@/types/presentation";

/** The intro is always slide 00 and is rendered by <Presentation /> itself. */
export const INTRO_SECTION = { id: "inicio", label: "Inicio" } as const;

/**
 * The presentation, in order. To add a slide: create a component in
 * `components/sections/` that receives `SectionProps` and add an entry here.
 * Navigation, keyboard control and progress update automatically.
 */
export const SECTIONS: readonly SectionConfig[] = [
  { id: "seccion-01", label: "Próximamente", component: PlaceholderSection },
];
