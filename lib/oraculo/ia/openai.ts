import "server-only";
import OpenAI, { APIConnectionTimeoutError, RateLimitError } from "openai";
import { LIMITS } from "@/lib/oraculo/config/limites";
import { AiUnavailableError, type ChatModel } from "@/lib/oraculo/ia/modelo";

/** The only place that creates an OpenAI client. Timeouts and retries come from `LIMITS`. */
export const createOpenAIClient = (apiKey: string) =>
  new OpenAI({ apiKey, timeout: LIMITS.requestTimeoutMs, maxRetries: LIMITS.maxRetries });

/** Maps any SDK failure to our own error, so callers never depend on OpenAI's error classes. */
export function toAiError(error: unknown): AiUnavailableError {
  if (error instanceof AiUnavailableError) return error;
  if (error instanceof APIConnectionTimeoutError) return new AiUnavailableError("timeout");
  if (error instanceof RateLimitError) return new AiUnavailableError("limite");
  return new AiUnavailableError("caido");
}

export class OpenAIChatModel implements ChatModel {
  constructor(
    private readonly client: OpenAI,
    private readonly model: string,
  ) {}

  async reply({ instructions, history }: Parameters<ChatModel["reply"]>[0]) {
    try {
      const response = await this.client.responses.create({
        model: this.model,
        instructions,
        input: history.map(({ role, text }) => ({
          role: role === "usuario" ? ("user" as const) : ("assistant" as const),
          content: text,
        })),
        max_output_tokens: LIMITS.maxOutputTokens,
        // Short, warm replies need little reasoning; it keeps latency and cost down.
        reasoning: { effort: "low" },
        // Do not keep the conversation on OpenAI's side for later retrieval.
        store: false,
      });
      const text = response.output_text.trim();
      if (!text) throw new AiUnavailableError("vacio");
      return text;
    } catch (error) {
      throw toAiError(error);
    }
  }
}
