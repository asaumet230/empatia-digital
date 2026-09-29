import { AlertKeyIdeaSection } from "@/components/sections/alertas/AlertKeyIdeaSection";
import { AlertReportSection } from "@/components/sections/alertas/AlertReportSection";
import { AiAccompanySection } from "@/components/sections/ia/AiAccompanySection";
import { AiMapSection } from "@/components/sections/ia/AiMapSection";
import { AiOpeningSection } from "@/components/sections/ia/AiOpeningSection";
import { AiSummarySection } from "@/components/sections/ia/AiSummarySection";
import { PromptFormulaSection } from "@/components/sections/prompt/PromptFormulaSection";
import { PromptPartsSection } from "@/components/sections/prompt/PromptPartsSection";
import { AlertPromptSection, PromptSection } from "@/components/sections/prompt/PromptSection";
import type { SectionConfig } from "@/types/presentation";

/** The intro is always slide 00 and is rendered by <Presentation /> itself. */
export const INTRO_SECTION = { id: "inicio", label: "Inicio" } as const;

/**
 * The presentation, in order. To add a slide: create a component in
 * `components/sections/` that receives `SectionProps` and add an entry here.
 * Navigation, keyboard control and progress update automatically.
 */
export const SECTIONS: readonly SectionConfig[] = [
  // Bloque 3 — La IA no es solamente ChatGPT
  { id: "ia-no-solo-chatgpt", label: "No solo ChatGPT", component: AiOpeningSection },
  { id: "ia-mapa", label: "Mapa de la IA", component: AiMapSection },
  { id: "ia-puede", label: "La IA puede…", component: AiSummarySection },
  { id: "ia-acompanar", label: "Acompañar", component: AiAccompanySection },
  // Ejemplo 1 — Crear un banco de preguntas
  { id: "prompt-encuesta", label: "Ejemplo 1: el prompt", component: PromptSection },
  { id: "prompt-partes", label: "Las 6 partes", component: PromptPartsSection },
  { id: "prompt-formula", label: "La fórmula", component: PromptFormulaSection },
  // Ejemplo 2 — Alertas tempranas
  { id: "alertas-prompt", label: "Ejemplo 2: alertas", component: AlertPromptSection },
  { id: "alertas-resultado", label: "El resultado", component: AlertReportSection },
  { id: "alertas-idea", label: "La idea clave", component: AlertKeyIdeaSection },
];
