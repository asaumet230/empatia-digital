import "server-only";
import type OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { asTranscript } from "@/lib/oraculo/conversacion/transcripcion";
import { toAiError } from "@/lib/oraculo/ia/openai";
import { RISK_PROMPT } from "@/lib/oraculo/prompts";
import type { RiskChecker } from "@/lib/oraculo/riesgo/evaluador";
import {
  RiskAssessmentSchema,
  RiskCategorySchema,
  RiskLevelSchema,
  type Message,
  type Profile,
  type RiskAssessment,
} from "@/lib/oraculo/tipos";

/** How far back the classifier looks: enough context for "lo que te conté de mi tío", not the whole session. */
const CONTEXT_MESSAGES = 8;

/** What we ask OpenAI to return. Kept plain; our own schema checks the result afterwards. */
const OutputSchema = z.object({ level: RiskLevelSchema, category: RiskCategorySchema, reason: z.string() });

/** Unreadable or inconsistent output never counts as safe: it asks for caution instead. */
const UNREADABLE: RiskAssessment = { level: "REVIEW", category: "ninguna", reason: "clasificador: respuesta no válida" };

/** Pure parsing, exported for tests. */
export function toAssessment(raw: string): RiskAssessment {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return UNREADABLE;
  }
  if (typeof json === "object" && json !== null && "reason" in json && typeof json.reason === "string") {
    json = { ...json, reason: json.reason.slice(0, 300) };
  }
  const parsed = RiskAssessmentSchema.safeParse(json);
  return parsed.success ? parsed.data : UNREADABLE;
}

/** Pure input building, exported for tests. */
export const classifierInput = (profile: Profile, history: readonly Message[]) =>
  `Perfil: ${profile}\n${asTranscript(history.slice(-CONTEXT_MESSAGES))}`;

/**
 * Our own classifier: a language model with the risk prompt. It reads context and teenage
 * language, which the moderation filter cannot. Its answer is validated, never trusted as is.
 */
export class ModelRiskChecker implements RiskChecker {
  constructor(
    private readonly client: OpenAI,
    private readonly model: string,
  ) {}

  async assess({ profile, history }: Parameters<RiskChecker["assess"]>[0]) {
    try {
      const response = await this.client.responses.create({
        model: this.model,
        instructions: RISK_PROMPT.text,
        input: classifierInput(profile, history),
        text: { format: zodTextFormat(OutputSchema, "evaluacion_riesgo") },
        reasoning: { effort: "low" },
        max_output_tokens: 1500,
        store: false,
      });
      return toAssessment(response.output_text);
    } catch (error) {
      throw toAiError(error);
    }
  }
}
