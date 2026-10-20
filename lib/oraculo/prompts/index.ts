import "server-only";
import { ACCOMPANY_PROMPT, URGENT_PROMPT } from "@/lib/oraculo/prompts/acompanamiento";
import { ALIAS_PROMPT } from "@/lib/oraculo/prompts/apodo";
import { CAUTION_PROMPT } from "@/lib/oraculo/prompts/cautela";
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

export { ACCOMPANY_PROMPT, ALIAS_PROMPT, CAUTION_PROMPT, CLOSING_PROMPT, RISK_PROMPT, URGENT_PROMPT };
export type { VersionedPrompt };
