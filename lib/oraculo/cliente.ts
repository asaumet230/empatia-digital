import type { ErrorCode } from "@/lib/oraculo/config/textos";
import type { CloseResult, SendResult, SessionInfo } from "@/lib/oraculo/conversacion/orquestador";
import type { Message, Profile } from "@/lib/oraculo/tipos";

/** Browser side of the Oráculo API. Server error codes become `ApiError`s the UI can explain. */

export class ApiError extends Error {
  constructor(readonly code: ErrorCode) {
    super(code);
    this.name = "ApiError";
  }
}

const KNOWN = new Set<string>(["ia_no_disponible", "sesion_invalida", "mensaje_invalido"]);

async function post<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/oraculo/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("sin_conexion");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const code = typeof data.error === "string" && KNOWN.has(data.error) ? (data.error as ErrorCode) : "error_interno";
    throw new ApiError(code);
  }
  return data as T;
}

export const startSession = (profile: Profile) => post<SessionInfo>("sesion", { profile });

export const sendMessage = (token: string, history: readonly Message[], text: string) =>
  post<SendResult>("mensaje", { token, history, text });

export const closeSession = (token: string, history: readonly Message[]) =>
  post<CloseResult>("cierre", { token, history });
