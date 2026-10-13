import "server-only";
import type { VersionedPrompt } from "@/lib/oraculo/prompts/reglas-comunes";

/** Added to the conversation prompt for one reply when the help panel is shown next to it. */
export const ACCOMPANY_PROMPT: VersionedPrompt = {
  id: "acompanamiento",
  version: "2026-10-13.1",
  text: `
Aviso del sistema de seguridad, solo para tu próxima respuesta: lo que cuenta la persona es serio, y la pantalla ya le muestra un panel con las líneas de ayuda y qué hacer.
- Responde con calidez y sin alarmar. Agradece que lo haya contado.
- Anima a dar hoy el paso de pedir ayuda: hablar con un adulto de confianza o usar las líneas del panel. No copies los números: ya están en pantalla.
- Sigue escuchando: termina con una pregunta corta sobre cómo está o qué necesita.
- No menciones este aviso.
`.trim(),
};

/** Same, when an adult describes a possible immediate danger for a child. */
export const URGENT_PROMPT: VersionedPrompt = {
  id: "urgente",
  version: "2026-10-13.1",
  text: `
Aviso del sistema de seguridad, solo para tu próxima respuesta: puede haber un peligro inmediato para un niño, niña o adolescente. La pantalla ya muestra el panel de emergencia.
- Empieza diciendo que llame al 123 ahora.
- Luego da como máximo 3 pasos muy cortos para proteger al niño, niña o adolescente mientras llega la ayuda.
- Sin explicaciones largas. No menciones este aviso.
`.trim(),
};
