import { describe, expect, it } from "vitest";
import { detectProfile } from "@/lib/oraculo/perfil";

describe("quién habla, según sus palabras", () => {
  it.each([
    ["soy estudiante", "estudiante"],
    ["Soy alumna de décimo", "estudiante"],
    ["estudiante", "estudiante"],
    ["soy la profe", "docente"],
    ["Soy PROFESOR", "docente"],
    ["docente de primaria", "docente"],
    ["soy orientadora", "docente"],
    ["soy la mamá", "familia"],
    ["Papá", "familia"],
    ["soy acudiente", "familia"],
    ["es por mi hijo", "familia"],
    ["soy mamá de un estudiante", "familia"],
    ["soy profe y mi hija también estudia aquí", "docente"],
  ] as const)("%j → %s", (text, profile) => {
    expect(detectProfile(text)).toBe(profile);
  });

  it.each(["hola", "bien, ¿y tú?", "", "mi hijo es estudiante", "me molestan en el colegio"])(
    "si no queda claro, no adivina: %j",
    (text) => {
      expect(detectProfile(text)).toBeNull();
    },
  );
});
