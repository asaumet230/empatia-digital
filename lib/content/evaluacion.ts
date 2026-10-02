import type { TrackId } from "@/lib/sections";

/** Google Forms that measure what each audience knows about AI before and after the talk. */
export const EVALUATION_FORMS: Record<TrackId, { pre: string; post: string }> = {
  docentes: {
    pre: "https://forms.gle/ofK8YGJXodJjkGWZ8",
    post: "https://forms.gle/c2LN9eavTNBDAuFM7",
  },
  estudiantes: {
    pre: "https://forms.gle/jLm4kAkR5FYWQUg77",
    post: "https://forms.gle/EdnVJeZMt79bfJ8J8",
  },
  familias: {
    pre: "https://forms.gle/5L6eppGFyNSMdhjj8",
    post: "https://forms.gle/B2qaE9uZLXUgdn568",
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
