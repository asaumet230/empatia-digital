import { z } from "zod";
import { LIMITS } from "@/lib/oraculo/config/limites";
import { ORACLE_TEXT, type ErrorCode } from "@/lib/oraculo/config/textos";
import type { CloseResult, SendResult, SessionInfo } from "@/lib/oraculo/conversacion/orquestador";
import { MessageSchema, ProfileSchema, SafetyKeySchema, type Message, type Profile, type SafetyKey } from "@/lib/oraculo/tipos";

/* ------------------------------------------------------------------ */
/*  What the Oráculo screen remembers, as a pure reducer. The server   */
/*  decides; this only mirrors its answers. Kept in sessionStorage     */
/*  so a reload does not lose the talk, and gone when the tab closes.  */
/* ------------------------------------------------------------------ */

const PanelSchema = z.object({ after: z.number().int(), key: SafetyKeySchema });
export type Panel = z.infer<typeof PanelSchema>;

const StoredSchema = z.object({
  phase: z.enum(["perfil", "consentimiento", "chat", "cierre"]),
  profile: ProfileSchema.nullable(),
  token: z.string().nullable(),
  /** The opening, before the session: the Oráculo asks who is talking. Shown only, never sent to the AI. */
  intro: z.array(MessageSchema),
  history: z.array(MessageSchema),
  remaining: z.number().int(),
  /** Help panels shown in the chat, each anchored after a message of `history`. */
  panels: z.array(PanelSchema),
  locked: SafetyKeySchema.nullable(),
  limit: z.enum(["mensajes", "tiempo"]).nullable(),
  summary: z.string().nullable(),
  closingFailed: z.boolean(),
});
type Stored = z.infer<typeof StoredSchema>;

export interface OracleState extends Stored {
  busy: "start" | "send" | "close" | null;
  /** Text on its way to the server, shown right away. */
  pending: string | null;
  error: ErrorCode | null;
}

export type OracleAction =
  | { type: "oraculo_pregunta" }
  | { type: "presentarse"; text: string; profile: Profile | null }
  | { type: "volver" }
  | { type: "iniciando" }
  | { type: "iniciada"; info: SessionInfo }
  | { type: "enviando"; text: string }
  | { type: "resultado"; text: string; result: SendResult }
  | { type: "cerrando" }
  | { type: "cerrada"; result: CloseResult | null }
  | { type: "fallo"; error: ErrorCode }
  | { type: "descartar_error" }
  | { type: "reiniciar" };

export const INITIAL_STATE: OracleState = {
  phase: "perfil",
  profile: null,
  token: null,
  intro: [],
  history: [],
  remaining: LIMITS.maxUserMessages,
  panels: [],
  locked: null,
  limit: null,
  summary: null,
  closingFailed: false,
  busy: null,
  pending: null,
  error: null,
};

/** A panel is added unless the same one is already the latest: no repeats on every reply. */
const withPanel = (panels: readonly Panel[], after: number, key: SafetyKey | null): Panel[] =>
  key && panels.at(-1)?.key !== key ? [...panels, { after, key }] : [...panels];

function onResult(state: OracleState, text: string, result: SendResult): OracleState {
  const done = { ...state, busy: null, pending: null, error: null };
  switch (result.type) {
    case "respuesta": {
      const history: Message[] = [...state.history, { role: "usuario", text }, { role: "oraculo", text: result.reply }];
      return {
        ...done,
        history,
        token: result.token,
        remaining: result.remaining,
        panels: withPanel(state.panels, history.length - 1, result.safety),
      };
    }
    case "detenido": {
      const history: Message[] = [...state.history, { role: "usuario", text }];
      return {
        ...done,
        history,
        token: result.token,
        locked: result.safety,
        panels: withPanel(state.panels, history.length - 1, result.safety),
      };
    }
    case "limite":
      return { ...done, limit: result.reason };
  }
}

export function oracleReducer(state: OracleState, action: OracleAction): OracleState {
  switch (action.type) {
    case "oraculo_pregunta": {
      // The greeting first; after an answer that did not say who they are, the gentle retry
      if (state.phase !== "perfil") return state;
      const text = state.intro.length === 0 ? ORACLE_TEXT.intro.greeting : ORACLE_TEXT.intro.retry;
      return { ...state, intro: [...state.intro, { role: "oraculo", text }] };
    }
    case "presentarse": {
      if (state.phase !== "perfil") return state;
      const intro: Message[] = [...state.intro, { role: "usuario", text: action.text }];
      return action.profile ? { ...state, intro, phase: "consentimiento", profile: action.profile } : { ...state, intro };
    }
    case "volver":
      // Only the consent dialog goes back; its own closing when the chat starts must not undo that
      return state.phase === "consentimiento"
        ? { ...INITIAL_STATE, intro: [...state.intro, { role: "oraculo", text: ORACLE_TEXT.intro.again }] }
        : state;
    case "iniciando":
      return { ...state, busy: "start", error: null };
    case "iniciada":
      // The consent dialog may have been closed while the session was opening: stay where we are
      if (state.phase !== "consentimiento") return { ...state, busy: null };
      return { ...state, phase: "chat", busy: null, token: action.info.token, remaining: action.info.remaining };
    case "enviando":
      return { ...state, busy: "send", pending: action.text, error: null };
    case "resultado":
      return onResult(state, action.text, action.result);
    case "cerrando":
      return { ...state, busy: "close", error: null };
    case "cerrada": {
      const closed = { ...state, phase: "cierre" as const, busy: null, token: null };
      if (!action.result) return { ...closed, closingFailed: true };
      if (action.result.type === "detenido") return { ...closed, locked: action.result.safety };
      return { ...closed, summary: action.result.summary };
    }
    case "fallo":
      return { ...state, busy: null, pending: null, error: action.error };
    case "descartar_error":
      return { ...state, error: null };
    case "reiniciar":
      return { ...INITIAL_STATE };
  }
}

/** Only the durable part is stored; anything unreadable starts a fresh session. */
export const serialize = (state: OracleState): string => JSON.stringify(StoredSchema.parse(state));

export function deserialize(raw: string | null): OracleState {
  if (!raw) return INITIAL_STATE;
  try {
    const parsed = StoredSchema.safeParse(JSON.parse(raw));
    return parsed.success ? { ...INITIAL_STATE, ...parsed.data } : INITIAL_STATE;
  } catch {
    return INITIAL_STATE;
  }
}
