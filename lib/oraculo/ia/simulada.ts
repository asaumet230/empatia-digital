import "server-only";
import { AiUnavailableError, type ChatModel } from "@/lib/oraculo/ia/modelo";
import type { RiskChecker } from "@/lib/oraculo/riesgo/evaluador";
import type { RiskAssessment } from "@/lib/oraculo/tipos";

/* ------------------------------------------------------------------ */
/*  Simulated AI for end-to-end tests: same contracts, no OpenAI, no   */
/*  cost, always the same answers. Tags in the message pick the risk:  */
/*  #peligro, #alto, #revisar, and #falla makes the model fail.        */
/*  Wired only when ORACULO_IA_SIMULADA=1, and never on Vercel.        */
/* ------------------------------------------------------------------ */

export const SIMULATED_REPLY = "Respuesta simulada: te escucho. ¿Qué pasó después?";
export const SIMULATED_SUMMARY = "Resumen simulado.\n\nPasos que decidiste considerar:\n- Hablar con un adulto de confianza.";

const lastUserText = (history: readonly { role: string; text: string }[]) =>
  [...history].reverse().find((m) => m.role === "usuario")?.text ?? "";

export class SimulatedChatModel implements ChatModel {
  async reply({ history }: Parameters<ChatModel["reply"]>[0]) {
    const text = lastUserText(history);
    if (text.includes("#falla")) throw new AiUnavailableError("caido");
    return text.startsWith("<conversacion>") ? SIMULATED_SUMMARY : SIMULATED_REPLY;
  }
}

export class TaggedRiskChecker implements RiskChecker {
  async assess({ history }: Parameters<RiskChecker["assess"]>[0]): Promise<RiskAssessment> {
    const text = lastUserText(history);
    if (text.includes("#peligro")) return { level: "IMMEDIATE_DANGER", category: "autolesion", reason: "simulado" };
    if (text.includes("#alto")) return { level: "HIGH_RISK", category: "acoso_grave", reason: "simulado" };
    if (text.includes("#revisar")) return { level: "REVIEW", category: "ninguna", reason: "simulado" };
    return { level: "SAFE", category: "ninguna", reason: "simulado" };
  }
}
