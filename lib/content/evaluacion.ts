import type { TrackId } from "@/lib/sections";

export interface EvaluationForms {
  pre: string;
  post: string;
}

/**
 * Google Forms that measure what the audience knows about AI before and after the talk.
 * Only the students' session uses them; a session without forms shows no button.
 */
export const EVALUATION_FORMS: Partial<Record<TrackId, EvaluationForms>> = {
  estudiantes: {
    pre: "https://forms.gle/jLm4kAkR5FYWQUg77",
    post: "https://forms.gle/EdnVJeZMt79bfJ8J8",
  },
};

export const EVALUATION = {
  button: "Pretest y postest",
  title: "Formularios",
  forms: [
    { key: "pre", name: "Pretest", when: "Antes de la charla" },
    { key: "post", name: "Postest", when: "Al terminar la charla" },
  ],
  open: "Abrir formulario",
} as const;
