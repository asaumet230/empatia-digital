"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { parseAlias } from "@/lib/oraculo/apodo";
import { ApiError, closeSession, sendMessage, startSession } from "@/lib/oraculo/cliente";
import { deserialize, oracleReducer, serialize, type OracleState } from "@/lib/oraculo/estado";
import { detectProfile } from "@/lib/oraculo/perfil";

const STORAGE_KEY = "oraculo:sesion";

/**
 * sessionStorage can throw (storage blocked, e.g. Chrome with all cookies blocked, or full). The
 * chat must still work: it just won't survive a reload in that browser.
 */
const storage = {
  read: () => {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  write: (value: string) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Blocked or full: keep going without saving
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Blocked: nothing was saved
    }
  },
};

const errorCode = (error: unknown) => (error instanceof ApiError ? error.code : "error_interno");

/**
 * The Oráculo session in the browser: state, persistence in sessionStorage (never localStorage:
 * it must be gone when the tab closes) and the calls to the API. Needs `window`, so the screen
 * that uses it renders on the client only.
 */
export function useOracle() {
  const [state, dispatch] = useReducer(oracleReducer, undefined, () =>
    deserialize(storage.read()),
  );
  // Calls read the latest state without being recreated on every change
  const latest = useRef<OracleState>(state);

  useEffect(() => {
    latest.current = state;
    storage.write(serialize(state));
  }, [state]);

  /** The Oráculo's next fixed line in the opening (greeting or retry); the screen times it. */
  const ask = useCallback(() => dispatch({ type: "oraculo_pregunta" }), []);

  /** The person says who they are, in their own words. Recognised in the browser, never by the AI. */
  const introduce = useCallback(async (text: string) => {
    dispatch({ type: "presentarse", text, profile: detectProfile(text) });
    return true;
  }, []);
  /** The optional nickname, read in the browser; anything that is not one means "no nickname". */
  const nameSelf = useCallback(async (text: string) => {
    dispatch({ type: "apodo", text, alias: parseAlias(text) });
    return true;
  }, []);

  const back = useCallback(() => dispatch({ type: "volver" }), []);
  const dismissError = useCallback(() => dispatch({ type: "descartar_error" }), []);

  const restart = useCallback(() => {
    storage.clear();
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
    const { token, history, alias } = latest.current;
    if (!token) return false;
    dispatch({ type: "enviando", text });
    try {
      dispatch({ type: "resultado", text, result: await sendMessage(token, history, text, alias) });
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

  return { state, ask, introduce, nameSelf, back, start, send, finish, restart, dismissError };
}

export type OracleControls = ReturnType<typeof useOracle>;
