import "server-only";
import { CLOSING_PROMPT } from "@/lib/oraculo/prompts/cierre";
import { TEACHER_PROMPT } from "@/lib/oraculo/prompts/docente";
import { STUDENT_PROMPT } from "@/lib/oraculo/prompts/estudiante";
import { FAMILY_PROMPT } from "@/lib/oraculo/prompts/familia";
import type { VersionedPrompt } from "@/lib/oraculo/prompts/reglas-comunes";
import { RISK_PROMPT } from "@/lib/oraculo/prompts/riesgo";
import type { Profile } from "@/lib/oraculo/tipos";

/** One conversation prompt per profile. A new profile = a new prompt here + its entry in `PROFILES`. */
export const CONVERSATION_PROMPTS: Record<Profile, VersionedPrompt> = {
  estudiante: STUDENT_PROMPT,
  docente: TEACHER_PROMPT,
  familia: FAMILY_PROMPT,
};

export { CLOSING_PROMPT, RISK_PROMPT };
export type { VersionedPrompt };
