/* ------------------------------------------------------------------ */
/*  Rúbrica de ejemplo — 15 estudiantes FICTICIOS, con códigos.        */
/*  Mismos datos que public/assets/data/rubrica-convivencia-ejemplo.xlsx */
/* ------------------------------------------------------------------ */

export const CRITERIA = ["Empatía", "Respeto", "Manejo de conflictos", "Convivencia digital"] as const;

export const LEVELS = [
  "1 · Requiere atención",
  "2 · Necesita acompañamiento",
  "3 · Adecuado",
  "4 · Fortaleza",
] as const;

export interface RubricStudent {
  code: string;
  /** Nivel 1–4 por criterio, en el orden de CRITERIA. */
  levels: readonly [number, number, number, number];
  note?: string;
}

export const RUBRIC_STUDENTS: readonly RubricStudent[] = [
  { code: "E01", levels: [4, 4, 3, 3], note: "Ayuda a los compañeros nuevos a integrarse al grupo." },
  { code: "E02", levels: [3, 3, 2, 2], note: "Discute en el chat del curso cuando no está de acuerdo." },
  {
    code: "E03",
    levels: [4, 3, 3, 1],
    note: "Compartió en el grupo de WhatsApp una foto de un compañero sin su permiso.",
  },
  { code: "E04", levels: [3, 4, 4, 3] },
  { code: "E05", levels: [2, 2, 2, 2], note: "Participó en burlas durante el descanso y en el grupo del curso." },
  { code: "E06", levels: [3, 3, 3, 2], note: "Responde de forma impulsiva en los chats del curso." },
  { code: "E07", levels: [4, 4, 4, 4], note: "Propone acuerdos cuando hay desacuerdos en el grupo." },
  { code: "E08", levels: [3, 3, 2, 3] },
  { code: "E09", levels: [3, 4, 3, 2], note: "Reenvía memes sobre compañeros sin pensar en cómo pueden sentirse." },
  { code: "E10", levels: [4, 3, 3, 3] },
  {
    code: "E11",
    levels: [2, 3, 1, 2],
    note: "En dos ocasiones un desacuerdo terminó en gritos y fue necesario intervenir.",
  },
  { code: "E12", levels: [3, 3, 3, 3] },
  { code: "E13", levels: [4, 4, 3, 4], note: "Orientó a un compañero sobre cómo reportar un mensaje ofensivo." },
  { code: "E14", levels: [3, 2, 2, 2], note: "Participa poco en los trabajos en grupo últimamente." },
  {
    code: "E15",
    levels: [4, 4, 4, 2],
    note: "Muy buen trato en clase; en redes ha publicado comentarios que incomodaron a otros.",
  },
];

/** How many students are at each level (1–4) for criterion `c` (0-based). */
export const countLevels = (c: number) =>
  [1, 2, 3, 4].map((level) => RUBRIC_STUDENTS.filter((s) => s.levels[c] === level).length);

/** Codes with level 1 or 2 in criterion `c`. */
export const needSupport = (c: number) => RUBRIC_STUDENTS.filter((s) => s.levels[c] <= 2).map((s) => s.code);

export const total = (s: RubricStudent) => s.levels.reduce((a, b) => a + b, 0);
