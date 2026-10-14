import { describe, expect, it } from "vitest";
import { AUTHORIZATION_FORM, CONTROLLERS, LEGAL, PRIVACY_POLICY, TERMS } from "@/lib/oraculo/config/legal";

const text = (sections: typeof PRIVACY_POLICY) => JSON.stringify(sections);

describe("textos legales", () => {
  it("cada sección tiene título y contenido, y los ids no se repiten", () => {
    for (const doc of [PRIVACY_POLICY, TERMS]) {
      expect(new Set(doc.map((s) => s.id)).size).toBe(doc.length);
      for (const s of doc) {
        expect(s.title).not.toBe("");
        expect(s.blocks.length).toBeGreaterThan(0);
      }
    }
  });

  it("la política cubre lo que exige la Ley 1581: responsables, finalidades, derechos y plazos", () => {
    const policy = text(PRIVACY_POLICY);
    expect(policy).toContain(CONTROLLERS.email);
    expect(policy).toContain(CONTROLLERS.phone);
    expect(policy).toMatch(/artículo 8 de la Ley 1581/);
    expect(policy).toMatch(/artículo 7 de la Ley 1581/);
    expect(policy).toMatch(/Superintendencia de Industria y Comercio/);
    expect(policy).toMatch(/10 días hábiles/);
    expect(policy).toMatch(/15 días hábiles/);
  });

  it("dice con claridad que los mensajes van a OpenAI y qué hace con ellos", () => {
    const policy = text(PRIVACY_POLICY);
    expect(policy).toMatch(/OpenAI, L\.L\.C\., en Estados Unidos/);
    expect(policy).toMatch(/hasta 30 días/);
    expect(policy).toMatch(/no usa los datos enviados por su API para entrenar/);
  });

  it("nunca promete que el Oráculo avisa a alguien", () => {
    const all = text(PRIVACY_POLICY) + text(TERMS) + JSON.stringify(AUTHORIZATION_FORM);
    expect(all).toMatch(/no contacta, alerta ni avisa a nadie/);
    expect(all).not.toMatch(/(avisaremos|alertaremos|notificaremos)/i);
  });

  it("la autorización pide el permiso del representante y el asentimiento del estudiante", () => {
    expect(AUTHORIZATION_FORM.grant).toContain(CONTROLLERS.names);
    expect(AUTHORIZATION_FORM.grant).toMatch(/previa, expresa e informada/);
    expect(AUTHORIZATION_FORM.assent.fields).toContain("Firma del estudiante");
    expect(AUTHORIZATION_FORM.intro).toContain(LEGAL.policyUrl);
  });

  it("sigue marcada como borrador hasta la revisión jurídica", () => {
    expect(LEGAL.approved).toBe(false);
  });
});
