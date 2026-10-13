import { describe, expect, it } from "vitest";
import { createOpenAIClient } from "@/lib/oraculo/ia/openai";
import { RISK_BANK } from "@/lib/oraculo/riesgo/banco";
import { ModelRiskChecker } from "@/lib/oraculo/riesgo/clasificador";
import { CombinedRiskChecker } from "@/lib/oraculo/riesgo/combinado";
import { ModerationRiskChecker } from "@/lib/oraculo/riesgo/moderacion";
import { RISK_LEVELS, type Message, type RiskAssessment } from "@/lib/oraculo/tipos";

/*  Live evaluation against OpenAI (costs a little). `npm run eval:riesgo`.
    Same wiring as production: moderation filter + classifier, most serious wins. */

const MODEL = process.env.OPENAI_RISK_MODEL ?? "gpt-5.4-mini";
const BATCH = 8;

const rank = (level: string) => RISK_LEVELS.indexOf(level as RiskAssessment["level"]);

describe.skipIf(!process.env.OPENAI_API_KEY)(`banco de riesgo · ${MODEL}`, () => {
  it("no deja pasar ningún peligro", async () => {
    const client = createOpenAIClient(process.env.OPENAI_API_KEY!);
    const checker = new CombinedRiskChecker([new ModerationRiskChecker(client), new ModelRiskChecker(client, MODEL)]);

    const results: RiskAssessment[] = [];
    for (let i = 0; i < RISK_BANK.length; i += BATCH) {
      const batch = RISK_BANK.slice(i, i + BATCH).map(({ profile, before = [], text }) =>
        checker.assess({ profile, history: [...before, { role: "usuario", text } satisfies Message] }),
      );
      results.push(...(await Promise.all(batch)));
    }

    const missed: string[] = [];
    const alarms: string[] = [];
    RISK_BANK.forEach((c, i) => {
      const got = results[i];
      const line = `[${c.profile}] ${c.text}\n    → ${got.level}/${got.category} (esperado ${c.min}..${c.max})`;
      if (rank(got.level) < rank(c.min)) missed.push(line);
      else if (rank(got.level) > rank(c.max)) alarms.push(line);
    });

    const ok = RISK_BANK.length - missed.length - alarms.length;
    console.log(
      [
        `\nModelo ${MODEL}: ${ok}/${RISK_BANK.length} exactos · ${missed.length} peligros no detectados · ${alarms.length} falsas alarmas`,
        ...missed.map((m) => `❌ ${m}`),
        ...alarms.map((m) => `⚠️  ${m}`),
      ].join("\n"),
    );
    expect(missed, "peligros no detectados").toEqual([]);
  });
});
