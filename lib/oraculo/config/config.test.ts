import { describe, expect, it } from "vitest";
import { HELP_LINES, type HelpLineId } from "@/lib/oraculo/config/lineas";
import { LIMITS } from "@/lib/oraculo/config/limites";
import { SAFETY_MESSAGES, safetyMessage } from "@/lib/oraculo/config/mensajes-seguridad";
import { RISK_CATEGORIES, SAFETY_KEYS, type Audience } from "@/lib/oraculo/tipos";

const KEYS = SAFETY_KEYS;
const AUDIENCES: Audience[] = ["estudiante", "adulto"];
const every = KEYS.flatMap((key) => AUDIENCES.map((audience) => ({ key, audience })));

describe("líneas de ayuda", () => {
  it.each(Object.entries(HELP_LINES))("%s tiene un enlace para llamar con solo dígitos", (_, line) => {
    expect(line.href).toMatch(/^tel:\+?\d{3,15}$/);
    expect(line.when.length).toBeGreaterThan(0);
  });

  it("el número visible coincide con el enlace", () => {
    for (const line of Object.values(HELP_LINES)) {
      const digits = line.number.replace(/\D/g, "");
      expect(line.href.replace(/\D/g, "")).toContain(digits);
    }
  });
});

describe("mensajes de seguridad", () => {
  it("hay una clave por cada categoría de riesgo, más peligro inmediato", () => {
    const categories = RISK_CATEGORIES.filter((c) => c !== "ninguna");
    expect([...SAFETY_KEYS].sort()).toEqual([...categories, "peligro_inmediato"].sort());
  });

  it("existe un mensaje para cada situación y cada público", () => {
    for (const { key, audience } of every) expect(safetyMessage(key, audience)).toBeDefined();
  });

  it.each(every)("$key / $audience está completo y sus líneas existen", ({ key, audience }) => {
    const msg = safetyMessage(key, audience);
    expect(msg.title).not.toBe("");
    expect(msg.body.length).toBeGreaterThan(0);
    expect(msg.steps.length).toBeGreaterThan(0);
    expect(msg.lines.length).toBeGreaterThan(0);
    expect(new Set(msg.lines).size).toBe(msg.lines.length);
    for (const id of msg.lines) expect(HELP_LINES[id as HelpLineId]).toBeDefined();
  });

  it("ante peligro inmediato el primer botón es el 123", () => {
    for (const audience of AUDIENCES) expect(safetyMessage("peligro_inmediato", audience).lines[0]).toBe("emergencias");
  });

  it("a los estudiantes siempre se les dice que el chat no avisa a nadie", () => {
    for (const key of KEYS) {
      expect(safetyMessage(key, "estudiante").body.join(" ")).toContain("no puede avisarle a nadie");
    }
  });

  it("ningún mensaje afirma que se alertó a alguien", () => {
    const all = every.map(({ key, audience }) => JSON.stringify(safetyMessage(key, audience))).join(" ");
    expect(all).not.toMatch(/(hemos|he|ya) (avisado|alertado|notificado|reportado)/i);
  });

  it("está versionado y marcado como no aprobado hasta la revisión profesional", () => {
    expect(SAFETY_MESSAGES.version).toMatch(/^\d{4}-\d{2}-\d{2}\./);
    expect(SAFETY_MESSAGES.approved).toBe(false);
  });
});

describe("límites", () => {
  it("coinciden con lo acordado", () => {
    expect(LIMITS.maxUserMessages).toBe(30);
    expect(LIMITS.maxSessionMinutes).toBe(60);
    expect(LIMITS.maxMessageChars).toBeGreaterThan(0);
  });
});
