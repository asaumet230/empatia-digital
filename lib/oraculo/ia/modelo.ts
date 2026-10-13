import type { Message } from "@/lib/oraculo/tipos";

/**
 * What the conversation needs from a language model. The orchestrator depends on this, not on
 * OpenAI: tests pass a fake, and a different provider only needs a new implementation.
 */
export interface ChatModel {
  reply(input: { instructions: string; history: readonly Message[] }): Promise<string>;
}

/** The model could not answer (down, timed out, rate limited, empty reply). Safe to retry later. */
export class AiUnavailableError extends Error {
  constructor(readonly kind: "timeout" | "limite" | "caido" | "vacio") {
    super(`IA no disponible: ${kind}`);
    this.name = "AiUnavailableError";
  }
}
