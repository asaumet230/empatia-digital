"use client";

import { ChatView } from "@/components/oraculo/ChatView";
import { ClosingView } from "@/components/oraculo/ClosingView";
import { OracleSplash } from "@/components/oraculo/OracleSplash";
import { useEffect, useState } from "react";
import { useOracle } from "@/hooks/useOracle";

/** How long the welcome owl stays on screen: a short greeting, not a real wait. */
const SPLASH_MS = 1200;

/** The Oráculo flow: the chat (who are you → consent → talk), then the closing. The hook decides. */
export default function OracleApp() {
  const oracle = useOracle();
  const [greeted, setGreeted] = useState(false);
  const { state } = oracle;
  const { profile } = state;

  // The closing screen starts at the top
  useEffect(() => {
    if (state.phase === "cierre") window.scrollTo(0, 0);
  }, [state.phase]);

  useEffect(() => {
    const id = setTimeout(() => setGreeted(true), SPLASH_MS);
    return () => clearTimeout(id);
  }, []);

  if (!greeted) return <OracleSplash />;
  if (state.phase === "cierre" && profile) return <ClosingView profile={profile} state={state} onRestart={oracle.restart} />;
  return <ChatView oracle={oracle} />;
}
