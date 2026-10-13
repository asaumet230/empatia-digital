import { describe, expect, it } from "vitest";
import { AiUnavailableError } from "@/lib/oraculo/ia/modelo";
import { classifierInput, toAssessment } from "@/lib/oraculo/riesgo/clasificador";
import { CombinedRiskChecker, mostSevere } from "@/lib/oraculo/riesgo/combinado";
import type { RiskChecker } from "@/lib/oraculo/riesgo/evaluador";
import type { RiskAssessment } from "@/lib/oraculo/tipos";

const a = (level: RiskAssessment["level"], category: RiskAssessment["category"] = "ninguna"): RiskAssessment => ({
  level,
  category,
  reason: "",
});
const fixed = (r: RiskAssessment): RiskChecker => ({ assess: async () => r });
const broken: RiskChecker = { assess: async () => Promise.reject(new AiUnavailableError("caido")) };
const input = { profile: "estudiante" as const, history: [{ role: "usuario" as const, text: "hola" }] };

describe("riesgo combinado", () => {
  it("gana la evaluación más grave", () => {
    expect(mostSevere([a("SAFE"), a("HIGH_RISK", "abuso"), a("REVIEW", "violencia")])).toMatchObject({
      level: "HIGH_RISK",
      category: "abuso",
    });
  });

  it("en un empate gana la que nombra una categoría", () => {
    expect(mostSevere([a("REVIEW"), a("REVIEW", "autolesion")]).category).toBe("autolesion");
  });

  it("si el filtro no ve nada pero el clasificador sí, cuenta el clasificador", async () => {
    const checker = new CombinedRiskChecker([fixed(a("SAFE")), fixed(a("HIGH_RISK", "violencia"))]);
    expect(await checker.assess(input)).toMatchObject({ level: "HIGH_RISK", category: "violencia" });
  });

  it("si un evaluador falla, el resultado nunca es 'seguro'", async () => {
    const checker = new CombinedRiskChecker([fixed(a("SAFE")), broken]);
    expect((await checker.assess(input)).level).toBe("REVIEW");
  });

  it("si un evaluador falla, un riesgo alto del otro se mantiene", async () => {
    const checker = new CombinedRiskChecker([broken, fixed(a("IMMEDIATE_DANGER", "autolesion"))]);
    expect((await checker.assess(input)).level).toBe("IMMEDIATE_DANGER");
  });

  it("si todos fallan, no se responde", async () => {
    await expect(new CombinedRiskChecker([broken, broken]).assess(input)).rejects.toThrow(AiUnavailableError);
  });
});

describe("clasificador propio", () => {
  it("lee una respuesta válida", () => {
    expect(toAssessment('{"level":"HIGH_RISK","category":"extorsion","reason":"pide fotos"}')).toEqual({
      level: "HIGH_RISK",
      category: "extorsion",
      reason: "pide fotos",
    });
  });

  it.each([
    "no es json",
    '{"level":"MUY_ALTO","category":"abuso","reason":""}',
    '{"level":"HIGH_RISK","category":"ninguna","reason":""}',
    '{"level":"SAFE"}',
  ])("una respuesta ilegible o incoherente pide cautela, nunca es 'seguro': %s", (raw) => {
    expect(toAssessment(raw).level).toBe("REVIEW");
  });

  it("recorta un motivo demasiado largo en lugar de descartarlo", () => {
    const raw = JSON.stringify({ level: "HIGH_RISK", category: "abuso", reason: "x".repeat(1000) });
    expect(toAssessment(raw)).toMatchObject({ level: "HIGH_RISK", category: "abuso" });
  });

  it("ve el perfil y solo los últimos mensajes", () => {
    const history = Array.from({ length: 20 }, (_, i) => ({ role: "usuario" as const, text: `m${i}` }));
    const text = classifierInput("familia", history);
    expect(text).toMatch(/^Perfil: familia\n<conversacion>/);
    expect(text).toContain("m19");
    expect(text).not.toContain("m11\n");
  });
});
