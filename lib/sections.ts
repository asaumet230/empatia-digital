import { AlertKeyIdeaSection } from "@/components/sections/alertas/AlertKeyIdeaSection";
import {
  AiPerspectivesSection,
  AiProposeSection,
} from "@/components/sections/estudiantes/AiStepSection";
import { AlgorithmGameSection } from "@/components/sections/estudiantes/AlgorithmGameSection";
import { ClosingSection } from "@/components/sections/estudiantes/ClosingSection";
import { GallerySection } from "@/components/sections/estudiantes/GallerySection";
import { PeaceChallengeSection } from "@/components/sections/estudiantes/PeaceChallengeSection";
import { PromptBuilderSection } from "@/components/sections/estudiantes/PromptBuilderSection";
import { StudentIntroSection } from "@/components/sections/estudiantes/StudentIntroSection";
import { CasesSection } from "@/components/sections/familias/CasesSection";
import { ConflictsSection } from "@/components/sections/familias/ConflictsSection";
import { FamilyKeyIdeaSection } from "@/components/sections/familias/FamilyKeyIdeaSection";
import { SimulatorSection } from "@/components/sections/familias/SimulatorSection";
import { AiAccompanyHomeSection, AiAccompanySchoolSection } from "@/components/sections/ia/AiAccompanySection";
import { AiMapSection } from "@/components/sections/ia/AiMapSection";
import { AiOpeningSection } from "@/components/sections/ia/AiOpeningSection";
import { AiSummarySection } from "@/components/sections/ia/AiSummarySection";
import { PromptFormulaSection } from "@/components/sections/prompt/PromptFormulaSection";
import {
  AlertPartsSection,
  CampaignPartsSection,
  MiradasPartsSection,
  PromptPartsSection,
  ProponePartsSection,
  RubricPartsSection,
} from "@/components/sections/prompt/PromptPartsSection";
import {
  AlertPromptSection,
  PromptSection,
  RubricAnalysisPromptSection,
  RubricPromptSection,
} from "@/components/sections/prompt/PromptSection";
import { RubricReportSection, SurveyReportSection } from "@/components/sections/report/TrafficLightReport";
import type { SectionConfig } from "@/types/presentation";

/** The intro is always slide 00 and is rendered by <Presentation /> itself. */
export const INTRO_SECTION = { id: "inicio", label: "Inicio" } as const;

/** Shared by both audiences; only the closing bridge points to each one's place. */
const iaBlock = (bridge: SectionConfig["component"]): readonly SectionConfig[] => [
  { id: "ia-no-solo-chatgpt", label: "No solo ChatGPT", component: AiOpeningSection },
  { id: "ia-mapa", label: "Mapa de la IA", component: AiMapSection },
  { id: "ia-puede", label: "La IA puede…", component: AiSummarySection },
  { id: "ia-acompanar", label: "Acompañar", component: bridge },
];

/**
 * One presentation per audience, each served at its own route (`/docentes`, `/familias`).
 * To add a slide: create a component in `components/sections/` that receives `SectionProps`
 * and add an entry to the track(s) where it belongs. Navigation, keyboard control and
 * progress update automatically.
 */
export const TRACKS = {
  docentes: {
    title: "Docentes",
    sections: [
      ...iaBlock(AiAccompanySchoolSection),
      // Ejemplo 1 — La encuesta: crearla y analizarla (alertas tempranas)
      { id: "prompt-encuesta", label: "Ej. 1: encuesta", component: PromptSection },
      { id: "prompt-partes", label: "Las 6 partes", component: PromptPartsSection },
      { id: "prompt-formula", label: "La fórmula", component: PromptFormulaSection },
      { id: "alertas-prompt", label: "Ej. 1: análisis", component: AlertPromptSection },
      { id: "alertas-partes", label: "Partes: análisis", component: AlertPartsSection },
      { id: "alertas-resultado", label: "Semáforo: encuesta", component: SurveyReportSection },
      // Ejemplo 2 — La rúbrica: crearla y analizarla
      { id: "rubrica-prompt", label: "Ej. 2: rúbrica", component: RubricPromptSection },
      { id: "rubrica-partes", label: "Partes: rúbrica", component: RubricPartsSection },
      { id: "rubrica-analisis", label: "Ej. 2: análisis", component: RubricAnalysisPromptSection },
      { id: "rubrica-resultado", label: "Semáforo: rúbrica", component: RubricReportSection },
      { id: "alertas-idea", label: "La idea clave", component: AlertKeyIdeaSection },
    ],
  },
  estudiantes: {
    title: "Estudiantes",
    sections: [
      // The "Acompañar" bridge speaks to adults, so students only get the first part of the IA block
      ...iaBlock(AiAccompanySchoolSection).slice(0, 3),
      { id: "estudiantes-intro", label: "Antes de empezar", component: StudentIntroSection },
      // "¿Broma o problema?": jugar → IA → cuestionar a la IA
      { id: "algoritmo-juego", label: "El juego", component: AlgorithmGameSection },
      { id: "algoritmo-ia-miradas", label: "Pregunté a la IA", component: AiPerspectivesSection },
      { id: "algoritmo-ia-miradas-partes", label: "Partes: miradas", component: MiradasPartsSection },
      { id: "algoritmo-ia-propone", label: "La IA propone", component: AiProposeSection },
      { id: "algoritmo-ia-propone-partes", label: "Partes: propone", component: ProponePartsSection },
      { id: "algoritmo-cierre", label: "Tú decides", component: ClosingSection },
      // Sesión 2 — "Creadores de paz": campañas con ChatGPT
      { id: "paz-prompt", label: "Arma tu prompt", component: PromptBuilderSection },
      { id: "paz-partes", label: "Partes: campaña", component: CampaignPartsSection },
      { id: "paz-reto", label: "Creadores de paz", component: PeaceChallengeSection },
      { id: "paz-galeria", label: "Galería", component: GallerySection },
    ],
  },
  familias: {
    title: "Familias",
    sections: [
      ...iaBlock(AiAccompanyHomeSection),
      // Hogares conectados — simulación de conversaciones
      { id: "familias-conflictos", label: "Conflictos en casa", component: ConflictsSection },
      { id: "familias-simulador", label: "El simulador", component: SimulatorSection },
      { id: "familias-casos", label: "Elige tu caso", component: CasesSection },
      { id: "familias-idea", label: "La idea clave", component: FamilyKeyIdeaSection },
    ],
  },
} as const satisfies Record<string, { title: string; sections: readonly SectionConfig[] }>;

export type TrackId = keyof typeof TRACKS;
