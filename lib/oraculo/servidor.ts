import "server-only";
import { z } from "zod";
import { createOracle, type Oracle } from "@/lib/oraculo/conversacion/orquestador";
import { createOpenAIClient, OpenAIChatModel } from "@/lib/oraculo/ia/openai";
import { ModerationRiskChecker } from "@/lib/oraculo/riesgo/moderacion";

/**
 * Model choice: a small, economical model fits this job. Replies are short and warm, need little
 * reasoning, and must arrive fast on a school connection. Chosen over gpt-5.4-mini after running
 * the same test conversations on both. Override with OPENAI_MODEL without touching code.
 */
const DEFAULT_MODEL = "gpt-5.6-luna";

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().startsWith("sk-"),
  /** Signs session passes. At least 32 random characters; changing it ends all open sessions. */
  ORACULO_SECRET: z.string().min(32),
  OPENAI_MODEL: z.string().min(1).default(DEFAULT_MODEL),
});

let oracle: Oracle | undefined;

/** Composition root: the only place that wires real implementations together. */
export function getOracle(): Oracle {
  if (oracle) return oracle;
  const env = EnvSchema.parse(process.env);
  const client = createOpenAIClient(env.OPENAI_API_KEY);
  oracle = createOracle({
    model: new OpenAIChatModel(client, env.OPENAI_MODEL),
    risk: new ModerationRiskChecker(client),
    secret: env.ORACULO_SECRET,
  });
  return oracle;
}
