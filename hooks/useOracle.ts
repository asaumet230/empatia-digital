"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { ApiError, closeSession, sendMessage, startSession } from "@/lib/oraculo/cliente";
import { deserialize, oracleReducer, serialize, type OracleState } from "@/lib/oraculo/estado";
import type { Profile } from "@/lib/oraculo/tipos";

const STORAGE_KEY = "oraculo:sesion";

const errorCode = (error: unknown) => (error instanceof ApiError ? error.code : "error_interno");

/**
 * The Oráculo session in the browser: state, persistence in sessionStorage (never localStorage:
 * it must be gone when the tab closes) and the calls to the API. Needs `window`, so the screen
 * that uses it renders on the client only.
 */
export function useOracle() {
  const [state, dispatch] = useReducer(oracleReducer, undefined, () =>
    deserialize(sessionStorage.getItem(STORAGE_KEY)),
  );
  // Calls read the latest state without being recreated on every change
  const latest = useRef<OracleState>(state);

  useEffect(() => {
    latest.current = state;
    sessionStorage.setItem(STORAGE_KEY, serialize(state));
  }, [state]);

  const choose = useCallback((profile: Profile) => dispatch({ type: "elegir", profile }), []);
  const back = useCallback(() => dispatch({ type: "volver" }), []);
  const dismissError = useCallback(() => dispatch({ type: "descartar_error" }), []);

  const restart = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "reiniciar" });
  }, []);

  const start = useCallback(async () => {
    const { profile } = latest.current;
    if (!profile) return;
    dispatch({ type: "iniciando" });
    try {
      dispatch({ type: "iniciada", info: await startSession(profile) });
    } catch (error) {
      dispatch({ type: "fallo", error: errorCode(error) });
    }
  }, []);

  /** Resolves true when the message got through, so the composer knows to clear. */
  const send = useCallback(async (text: string) => {
    const { token, history } = latest.current;
    if (!token) return false;
    dispatch({ type: "enviando", text });
    try {
      dispatch({ type: "resultado", text, result: await sendMessage(token, history, text) });
      return true;
    } catch (error) {
      dispatch({ type: "fallo", error: errorCode(error) });
      return false;
    }
  }, []);

  const finish = useCallback(async () => {
    const { token, history } = latest.current;
    dispatch({ type: "cerrando" });
    try {
      dispatch({ type: "cerrada", result: token ? await closeSession(token, history) : null });
    } catch {
      dispatch({ type: "cerrada", result: null });
    }
  }, []);

  return { state, choose, back, start, send, finish, restart, dismissError };
}

export type OracleControls = ReturnType<typeof useOracle>;
