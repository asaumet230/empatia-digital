import { audienceOf, type Profile, type RiskAssessment, type SafetyKey } from "@/lib/oraculo/tipos";

/**
 * What the conversation does with a risk assessment. Decided here, on the server, never by the
 * browser and never by the conversation model.
 *
 * - continuar: normal reply; `cautious` asks the model to check in gently (ambiguous signs).
 * - acompanar: reply AND show the safety panel next to it. Serious cases keep the conversation
 *   going: cutting off a child right after they tell about abuse can feel like rejection, and an
 *   adult facing an emergency still needs short, concrete steps.
 * - detener: no AI reply; show the emergency panel and lock the session for good. Only for a
 *   student in possible immediate danger.
 *
 * Agreed with PazLab on 2026-10-13; to be validated by the professionals before launch.
 */
export type RiskDecision =
  | { action: "continuar"; cautious: boolean }
  | { action: "acompanar"; safety: SafetyKey }
  | { action: "detener"; safety: SafetyKey };

export function decide(profile: Profile, { level, category }: RiskAssessment): RiskDecision {
  if (level === "IMMEDIATE_DANGER") {
    return audienceOf(profile) === "estudiante"
      ? { action: "detener", safety: "peligro_inmediato" }
      : { action: "acompanar", safety: "peligro_inmediato" };
  }
  if (level === "HIGH_RISK" && category !== "ninguna") return { action: "acompanar", safety: category };
  return { action: "continuar", cautious: level !== "SAFE" };
}
