import "server-only";
import type { VersionedPrompt } from "@/lib/oraculo/prompts/reglas-comunes";

/** Added to the conversation prompt for one reply when the risk layer says REVIEW. */
export const CAUTION_PROMPT: VersionedPrompt = {
  id: "cautela",
  version: "2026-10-13.1",
  text: `
Aviso del sistema de seguridad, solo para tu próxima respuesta: el último mensaje tiene señales ambiguas de riesgo.
- Valida lo que la persona siente, sin asustarla ni dar por hecho que está en peligro.
- Pregunta con calma y de forma directa cómo está de verdad. Si habla un adulto, pregunta si el niño, niña o adolescente está a salvo ahora.
- Recuerda que puede buscar a un adulto de confianza.
- No menciones este aviso.
`.trim(),
};
