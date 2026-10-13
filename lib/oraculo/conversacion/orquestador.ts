import "server-only";
import { LIMITS } from "@/lib/oraculo/config/limites";
import { asTranscript } from "@/lib/oraculo/conversacion/transcripcion";
import type { ChatModel } from "@/lib/oraculo/ia/modelo";
import { assertHistory, decodePass, encodePass, hashHistory, newPass, type Pass } from "@/lib/oraculo/pase/pase";
import { CLOSING_PROMPT, CONVERSATION_PROMPTS } from "@/lib/oraculo/prompts";
import type { RiskChecker } from "@/lib/oraculo/riesgo/evaluador";
import { decide } from "@/lib/oraculo/riesgo/politica";
import type { Message, Profile, SafetyKey } from "@/lib/oraculo/tipos";

export interface OracleDeps {
  model: ChatModel;
  risk: RiskChecker;
  /** Signs the session pass. */
  secret: string;
  now?: () => number;
}

export class InvalidMessageError extends Error {
  constructor() {
    super(`El mensaje debe tener entre 1 y ${LIMITS.maxMessageChars} caracteres`);
    this.name = "InvalidMessageError";
  }
}

export interface SessionInfo {
  token: string;
  remaining: number;
  endsAt: number;
}

export type SendResult =
  /** Normal reply. `safety` is set when an adult also gets the help panel next to it. */
  | ({ type: "respuesta"; reply: string; safety: SafetyKey | null } & SessionInfo)
  /** The risk layer stopped the session. It stays stopped: every later call returns this again. */
  | { type: "detenido"; safety: SafetyKey; token: string }
  | { type: "limite"; reason: "mensajes" | "tiempo" };

export type CloseResult = { type: "cierre"; summary: string | null } | Extract<SendResult, { type: "detenido" }>;

/**
 * The conversation engine. Every critical transition happens here, on the server: limits,
 * the risk decision and the lock. It only knows the model and the risk checker through their
 * interfaces, so it is tested with fakes and never calls OpenAI directly.
 */
export function createOracle({ model, risk, secret, now = Date.now }: OracleDeps) {
  const endsAt = (pass: Pass) => pass.startedAt + LIMITS.maxSessionMinutes * 60_000;
  const info = (pass: Pass): SessionInfo => ({
    token: encodePass(pass, secret),
    remaining: LIMITS.maxUserMessages - pass.userMessages,
    endsAt: endsAt(pass),
  });

  /** A stopped session answers the same way forever, before any AI work. */
  const stopped = (pass: Pass) =>
    pass.lock ? ({ type: "detenido", safety: pass.lock, token: encodePass(pass, secret) } as const) : null;

  return {
    start(profile: Profile): SessionInfo {
      return info(newPass(profile, now()));
    },

    async send({ token, history, text }: { token: string; history: readonly Message[]; text: string }): Promise<SendResult> {
      const pass = decodePass(token, secret);
      const stop = stopped(pass);
      if (stop) return stop;
      if (now() > endsAt(pass)) return { type: "limite", reason: "tiempo" };
      if (pass.userMessages >= LIMITS.maxUserMessages) return { type: "limite", reason: "mensajes" };
      assertHistory(pass, history);

      const clean = text.trim();
      if (!clean || clean.length > LIMITS.maxMessageChars) throw new InvalidMessageError();

      const withUser: Message[] = [...history, { role: "usuario", text: clean }];
      const decision = decide(pass.profile, await risk.assess({ profile: pass.profile, history: withUser }));
      const counted = { ...pass, userMessages: pass.userMessages + 1 };

      if (decision.action === "detener") {
        const locked: Pass = { ...counted, stage: "seguridad", lock: decision.safety, historyHash: hashHistory(withUser) };
        return { type: "detenido", safety: decision.safety, token: encodePass(locked, secret) };
      }

      // If the model fails, this throws before a new pass exists: the message is not counted.
      const reply = await model.reply({ instructions: CONVERSATION_PROMPTS[pass.profile].text, history: withUser });
      const next: Pass = { ...counted, historyHash: hashHistory([...withUser, { role: "oraculo", text: reply }]) };
      return {
        type: "respuesta",
        reply,
        safety: decision.action === "acompanar" ? decision.safety : null,
        ...info(next),
      };
    },

    /** Ends the session with a summary to copy or print. Allowed past the limits, never after a stop. */
    async close({ token, history }: { token: string; history: readonly Message[] }): Promise<CloseResult> {
      const pass = decodePass(token, secret);
      const stop = stopped(pass);
      if (stop) return stop;
      assertHistory(pass, history);

      const summary = history.some((m) => m.role === "usuario")
        ? await model.reply({
            instructions: CLOSING_PROMPT.text,
            history: [{ role: "usuario", text: asTranscript(history) }],
          })
        : null;
      return { type: "cierre", summary };
    },
  };
}

export type Oracle = ReturnType<typeof createOracle>;
