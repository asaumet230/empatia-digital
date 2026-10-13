import { describe, expect, it } from "vitest";
import { audienceOf, MessageSchema, RiskAssessmentSchema } from "@/lib/oraculo/tipos";

describe("tipos", () => {
  it("solo los estudiantes reciben el flujo protector", () => {
    expect(audienceOf("estudiante")).toBe("estudiante");
    expect(audienceOf("docente")).toBe("adulto");
    expect(audienceOf("familia")).toBe("adulto");
  });

  it("acepta una evaluación de riesgo bien formada", () => {
    const ok = RiskAssessmentSchema.safeParse({ level: "HIGH_RISK", category: "abuso", reason: "relato de abuso" });
    expect(ok.success).toBe(true);
  });

  it.each([
    { level: "PELIGRO", category: "abuso", reason: "" },
    { level: "SAFE", category: "otra", reason: "" },
    { level: "SAFE", category: "ninguna" },
    "SAFE",
  ])("rechaza una evaluación inválida: %j", (value) => {
    expect(RiskAssessmentSchema.safeParse(value).success).toBe(false);
  });

  it("rechaza mensajes vacíos o con un rol desconocido", () => {
    expect(MessageSchema.safeParse({ role: "usuario", text: "" }).success).toBe(false);
    expect(MessageSchema.safeParse({ role: "sistema", text: "hola" }).success).toBe(false);
  });
});
