import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/* Guard rails for privacy: nothing in the Oráculo's server code may log or store a message. */

const ROOTS = ["lib/oraculo", "app/api/oraculo", "hooks/useOracle.ts", "components/oraculo"];

function files(path: string): string[] {
  if (statSync(path).isFile()) return [path];
  return readdirSync(path).flatMap((name) => files(join(path, name)));
}

const sources = ROOTS.flatMap(files).filter((f) => /\.tsx?$/.test(f) && !/\.(test|eval)\.tsx?$/.test(f));
const read = (f: string) => readFileSync(f, "utf8");

describe("privacidad en el código", () => {
  it("solo dos sitios escriben en el registro, y ninguno con datos de la conversación", () => {
    const logging = sources.filter((f) => /console\.\w+\(/.test(read(f)));
    expect(logging.sort()).toEqual(["lib/oraculo/http.ts", "lib/oraculo/servidor.ts"]);

    const calls = logging.flatMap((f) => read(f).match(/console\.\w+\([^;]*\);/g) ?? []);
    for (const call of calls) expect(call).not.toMatch(/\b(text|history|token|reply|summary|body|message)\b/);
  });

  it("no usa localStorage ni cookies para la conversación", () => {
    for (const f of sources) {
      expect(read(f), f).not.toMatch(/\blocalStorage\.|document\.cookie/);
    }
  });

  it("le pide a OpenAI no guardar las respuestas para consultarlas después", () => {
    const calls = ["lib/oraculo/ia/openai.ts", "lib/oraculo/riesgo/clasificador.ts"].map(read);
    for (const code of calls) expect(code).toContain("store: false");
  });
});
