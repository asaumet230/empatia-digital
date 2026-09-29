/* ------------------------------------------------------------------ */
/*  "Semáforo" reports: what a teacher gets back from the AI, shown    */
/*  as an interactive traffic light. Shared by the survey and rubric.  */
/* ------------------------------------------------------------------ */

export type Status = "fortaleza" | "observar" | "alerta";

export const STATUS = {
  fortaleza: { label: "Fortaleza", color: "#35C95E" },
  observar: { label: "Conviene observar", color: "#FFD23F" },
  alerta: { label: "Posible alerta temprana", color: "#FF6B6B" },
} as const satisfies Record<Status, { label: string; color: string }>;

/** Four-step scales, worst to best (Nunca → Siempre, Nivel 1 → Nivel 4). */
export const SCALE_COLORS = ["#FF6B6B", "#FFD23F", "#7ED99A", "#35C95E"] as const;

export interface ReportRow {
  key: string;
  label: string;
  status: Status;
  /** How many students chose each step of the scale. */
  counts: readonly number[];
  /** Small line under the title (e.g. the survey question). */
  source?: string;
  reading: string;
  /** Codes worth following up on this row. */
  people?: readonly string[];
  /** Voices: open answers or teacher notes. */
  quotes?: readonly string[];
}

export interface Report {
  eyebrow: string;
  title: string;
  sample: string;
  caution: string;
  hint: { pointer: string; touch: string };
  total: number;
  /** Legend of the scale, same order as `counts`. */
  scale: readonly string[];
  rows: readonly ReportRow[];
  keyReading: { title: string; text: string };
  list: {
    title: string;
    items: readonly { label: string; value: string; weight?: number }[];
  };
}
