import "server-only";
import type OpenAI from "openai";
import { toAiError } from "@/lib/oraculo/ia/openai";
import type { RiskChecker } from "@/lib/oraculo/riesgo/evaluador";
import type { RiskAssessment, RiskCategory, RiskLevel } from "@/lib/oraculo/tipos";

type Flags = Record<string, boolean>;

/**
 * OpenAI moderation categories → our levels, most serious first. The first match wins.
 * Never IMMEDIATE_DANGER: without context, a parent saying "my son says he wants to die" looks
 * the same as a student saying it. Telling them apart is the classifier's job.
 */
const RULES: readonly { flags: readonly string[]; level: RiskLevel; category: RiskCategory }[] = [
  { flags: ["self-harm/intent", "self-harm/instructions"], level: "HIGH_RISK", category: "autolesion" },
  { flags: ["sexual/minors"], level: "HIGH_RISK", category: "abuso" },
  { flags: ["self-harm"], level: "REVIEW", category: "autolesion" },
  { flags: ["violence/graphic", "harassment/threatening", "hate/threatening"], level: "HIGH_RISK", category: "violencia" },
  { flags: ["violence"], level: "REVIEW", category: "violencia" },
  { flags: ["harassment", "hate"], level: "REVIEW", category: "acoso_grave" },
];

/** Pure mapping, exported for tests. */
export function assessmentFromFlags(flags: Flags): RiskAssessment {
  const rule = RULES.find((r) => r.flags.some((f) => flags[f]));
  if (!rule) return { level: "SAFE", category: "ninguna", reason: "moderación: sin señales" };
  return { level: rule.level, category: rule.category, reason: `moderación: ${rule.flags.filter((f) => flags[f]).join(", ")}` };
}

/**
 * OpenAI's moderation filter: free and fast, an alarm that rarely misses obvious danger but
 * reads little context. It looks only at the latest message.
 */
export class ModerationRiskChecker implements RiskChecker {
  constructor(private readonly client: OpenAI) {}

  async assess({ history }: Parameters<RiskChecker["assess"]>[0]) {
    const last = history.at(-1);
    if (!last || last.role !== "usuario") return assessmentFromFlags({});
    try {
      const { results } = await this.client.moderations.create({ model: "omni-moderation-latest", input: last.text });
      return assessmentFromFlags(results[0]?.categories as unknown as Flags);
    } catch (error) {
      throw toAiError(error);
    }
  }
}
