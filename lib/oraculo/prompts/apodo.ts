import "server-only";
import type { VersionedPrompt } from "@/lib/oraculo/prompts/reglas-comunes";

/** Added to every reply when the person chose a nickname. `{apodo}` is only letters and spaces (AliasSchema). */
export const ALIAS_PROMPT: VersionedPrompt = {
  id: "apodo",
  version: "2026-10-19.1",
  text: `
La persona eligió que la llames "{apodo}". Es un apodo para esta conversación, no un dato personal que debas evitar:
- Úsalo de vez en cuando y con naturalidad, no en cada respuesta.
- Nunca le pidas su nombre real ni otros datos.
`.trim(),
};
