import { audienceOf, type Profile, type RiskAssessment, type SafetyKey } from "@/lib/oraculo/tipos";

/**
 * What the conversation does with a risk assessment. Decided here, on the server, never by the
 * browser and never by the conversation model.
 *
 * - continuar: normal reply.
 * - acompanar: reply AND show the safety panel next to it (adults asking how to act).
 * - detener: no AI reply; show the safety panel and lock the session for good.
 */
export type RiskDecision =
  | { action: "continuar" }
  | { action: "acompanar"; safety: SafetyKey }
  | { action: "detener"; safety: SafetyKey };

export function decide(profile: Profile, { level, category }: RiskAssessment): RiskDecision {
  if (level === "IMMEDIATE_DANGER") return { action: "detener", safety: "peligro_inmediato" };
  if (level !== "HIGH_RISK" || category === "ninguna") return { action: "continuar" };
  return audienceOf(profile) === "estudiante"
    ? { action: "detener", safety: category }
    : { action: "acompanar", safety: category };
}
