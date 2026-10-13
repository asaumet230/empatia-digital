import { describe, expect, it } from "vitest";
import { assessmentFromFlags } from "@/lib/oraculo/riesgo/moderacion";
import { decide } from "@/lib/oraculo/riesgo/politica";
import { PROFILES, RiskAssessmentSchema, type RiskAssessment } from "@/lib/oraculo/tipos";

const r = (level: RiskAssessment["level"], category: RiskAssessment["category"]): RiskAssessment => ({
  level,
  category,
  reason: "",
});

describe("política de riesgo", () => {
  it.each(PROFILES)("peligro inmediato detiene a %s", (profile) => {
    expect(decide(profile, r("IMMEDIATE_DANGER", "abuso"))).toEqual({ action: "detener", safety: "peligro_inmediato" });
  });

  it("alto riesgo detiene al estudiante con el mensaje de su categoría", () => {
    expect(decide("estudiante", r("HIGH_RISK", "autolesion"))).toEqual({ action: "detener", safety: "autolesion" });
  });

  it.each(["docente", "familia"] as const)("alto riesgo no detiene a %s: le acompaña con el panel", (profile) => {
    expect(decide(profile, r("HIGH_RISK", "abuso"))).toEqual({ action: "acompanar", safety: "abuso" });
  });

  it.each(PROFILES)("seguro y revisar siguen la conversación para %s", (profile) => {
    expect(decide(profile, r("SAFE", "ninguna"))).toEqual({ action: "continuar" });
    expect(decide(profile, r("REVIEW", "acoso_grave"))).toEqual({ action: "continuar" });
  });
});

describe("filtro de moderación", () => {
  it("sin señales es seguro", () => {
    expect(assessmentFromFlags({})).toMatchObject({ level: "SAFE", category: "ninguna" });
  });

  it("intención de hacerse daño es alto riesgo de autolesión", () => {
    expect(assessmentFromFlags({ "self-harm/intent": true })).toMatchObject({ level: "HIGH_RISK", category: "autolesion" });
  });

  it("contenido sexual con menores es alto riesgo de abuso, aunque haya otras señales", () => {
    expect(assessmentFromFlags({ harassment: true, "sexual/minors": true })).toMatchObject({
      level: "HIGH_RISK",
      category: "abuso",
    });
  });

  it("amenazas son alto riesgo de violencia; el acoso suelto solo pide revisar", () => {
    expect(assessmentFromFlags({ "harassment/threatening": true })).toMatchObject({ level: "HIGH_RISK", category: "violencia" });
    expect(assessmentFromFlags({ harassment: true })).toMatchObject({ level: "REVIEW", category: "acoso_grave" });
  });

  it("nunca declara peligro inmediato por sí solo (no ve el contexto)", () => {
    const all = Object.fromEntries(
      ["self-harm/intent", "self-harm/instructions", "self-harm", "sexual/minors", "violence", "violence/graphic"].map((f) => [
        f,
        true,
      ]),
    );
    expect(assessmentFromFlags(all).level).not.toBe("IMMEDIATE_DANGER");
  });

  it("siempre produce una evaluación válida", () => {
    for (const flags of [{}, { violence: true }, { "self-harm": true }, { hate: true }] as Record<string, boolean>[]) {
      expect(RiskAssessmentSchema.safeParse(assessmentFromFlags(flags)).success).toBe(true);
    }
  });
});
