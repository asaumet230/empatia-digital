import "server-only";
import { z } from "zod";
import { createOracle, type Oracle } from "@/lib/oraculo/conversacion/orquestador";
import { createOpenAIClient, OpenAIChatModel } from "@/lib/oraculo/ia/openai";
import { SimulatedChatModel, TaggedRiskChecker } from "@/lib/oraculo/ia/simulada";
import { ModelRiskChecker } from "@/lib/oraculo/riesgo/clasificador";
import { CombinedRiskChecker } from "@/lib/oraculo/riesgo/combinado";
import { ModerationRiskChecker } from "@/lib/oraculo/riesgo/moderacion";

/**
 * Model choice: a small, economical model fits this job. Replies are short and warm, need little
 * reasoning, and must arrive fast on a school connection. Chosen over gpt-5.4-mini after running
 * the same test conversations on both. Override with OPENAI_MODEL without touching code.
 */
const DEFAULT_MODEL = "gpt-5.6-luna";

/**
 * The risk classifier is chosen for what it catches, not for price: on the same test bank
 * gpt-5.4-mini missed no danger while gpt-5.6-luna missed one, and each call is tiny.
 * Run `npm run eval:riesgo` before changing it (OPENAI_RISK_MODEL).
 */
const DEFAULT_RISK_MODEL = "gpt-5.4-mini";

/** End-to-end tests only. Ignored on Vercel, so a stray variable can never reach real users. */
const simulated = () => process.env.ORACULO_IA_SIMULADA === "1" && !process.env.VERCEL;

const SimulatedEnvSchema = z.object({ ORACULO_SECRET: z.string().min(32) });

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().startsWith("sk-"),
  /** Signs session passes. At least 32 random characters; changing it ends all open sessions. */
  ORACULO_SECRET: z.string().min(32),
  OPENAI_MODEL: z.string().min(1).default(DEFAULT_MODEL),
  OPENAI_RISK_MODEL: z.string().min(1).default(DEFAULT_RISK_MODEL),
});

let oracle: Oracle | undefined;

/** Composition root: the only place that wires real implementations together. */
export function getOracle(): Oracle {
  if (oracle) return oracle;
  if (simulated()) {
    console.warn("[oraculo] IA simulada: solo para pruebas");
    oracle = createOracle({
      model: new SimulatedChatModel(),
      risk: new TaggedRiskChecker(),
      secret: SimulatedEnvSchema.parse(process.env).ORACULO_SECRET,
    });
    return oracle;
  }
  const env = EnvSchema.parse(process.env);
  const client = createOpenAIClient(env.OPENAI_API_KEY);
  oracle = createOracle({
    model: new OpenAIChatModel(client, env.OPENAI_MODEL),
    // Two independent checks; the most serious answer wins
    risk: new CombinedRiskChecker([
      new ModerationRiskChecker(client),
      new ModelRiskChecker(client, env.OPENAI_RISK_MODEL),
    ]),
    secret: env.ORACULO_SECRET,
  });
  return oracle;
}
