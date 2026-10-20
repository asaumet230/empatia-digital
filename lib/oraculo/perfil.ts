import type { Profile } from "@/lib/oraculo/tipos";

/* ------------------------------------------------------------------ */
/*  Who is talking, from the person's own words ("soy la profe",       */
/*  "soy mamá"). Plain word matching in the browser, never AI: the     */
/*  profile picks the safety policy, so it must be predictable. When   */
/*  in doubt it answers null and the Oráculo asks again.               */
/* ------------------------------------------------------------------ */

const WORDS: Record<Profile, readonly string[]> = {
  estudiante: ["estudiante", "alumno", "alumna", "estudio"],
  docente: [
    "docente",
    "profe",
    "profesor",
    "profesora",
    "maestro",
    "maestra",
    "orientador",
    "orientadora",
    "coordinador",
    "coordinadora",
    "rector",
    "rectora",
    "educador",
    "educadora",
  ],
  familia: [
    "mama",
    "mami",
    "papa",
    "papi",
    "madre",
    "padre",
    "acudiente",
    "cuidador",
    "cuidadora",
    "abuela",
    "abuelo",
    "tia",
    "tio",
    "familia",
    "familiar",
    "hijo",
    "hija",
  ],
};

/** Words that may sit between "soy" and the role: "soy la mamá", "soy una profe". */
const FILLER = new Set(["el", "la", "un", "una", "su", "mi"]);

const words = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .split(/[^a-zñ]+/)
    .filter(Boolean);

const profileOf = (word: string) =>
  (Object.keys(WORDS) as Profile[]).find((profile) => WORDS[profile].includes(word)) ?? null;

export function detectProfile(text: string): Profile | null {
  const tokens = words(text);
  const found = new Set(tokens.map(profileOf).filter((p) => p !== null));
  if (found.size === 1) return [...found][0];
  if (found.size === 0) return null;

  // Several roles named ("soy mamá de un estudiante"): the one right after "soy" decides
  const soy = tokens.indexOf("soy");
  if (soy === -1) return null;
  const next = tokens.slice(soy + 1).find((w) => !FILLER.has(w));
  return next ? profileOf(next) : null;
}
