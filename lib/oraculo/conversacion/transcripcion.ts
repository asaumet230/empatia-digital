import type { Message } from "@/lib/oraculo/tipos";

const SPEAKER = { usuario: "Persona", oraculo: "Oráculo" } as const;

/**
 * The conversation as one block of data, for prompts that analyze it (risk, closing).
 * Tags in the text are neutralized so a message cannot fake the end of the block.
 */
export const asTranscript = (history: readonly Message[]) =>
  [
    "<conversacion>",
    ...history.map(({ role, text }) => `${SPEAKER[role]}: ${text.replace(/<\/?conversacion>/gi, "")}`),
    "</conversacion>",
  ].join("\n");
