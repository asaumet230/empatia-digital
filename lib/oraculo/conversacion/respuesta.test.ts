import { describe, expect, it } from "vitest";
import { cleanReply } from "@/lib/oraculo/conversacion/respuesta";
import { AiUnavailableError } from "@/lib/oraculo/ia/modelo";

describe("limpieza de respuestas", () => {
  it("quita negritas, títulos y viñetas de markdown", () => {
    expect(cleanReply("## Qué hacer\n* **Créele** siempre\n• No la dejes sola")).toBe(
      "Qué hacer\n- Créele siempre\n- No la dejes sola",
    );
  });

  it("deja intacto el texto plano y los guiones", () => {
    expect(cleanReply("Te escucho.\n- Guarda capturas")).toBe("Te escucho.\n- Guarda capturas");
  });

  it("una respuesta vacía cuenta como fallo de la IA", () => {
    expect(() => cleanReply("  ** **  ")).toThrow(AiUnavailableError);
  });
});
