"use client";

import { ChatView } from "@/components/oraculo/ChatView";
import { ClosingView } from "@/components/oraculo/ClosingView";
import { ConsentStep } from "@/components/oraculo/ConsentStep";
import { OracleHeader } from "@/components/oraculo/OracleHeader";
import { ProfileStep } from "@/components/oraculo/ProfileStep";
import { useEffect } from "react";
import { useOracle } from "@/hooks/useOracle";

/** The Oráculo flow: profile → consent → chat → closing. Each screen only renders; the hook decides. */
export default function OracleApp() {
  const oracle = useOracle();
  const { state } = oracle;
  const { profile } = state;

  // Every screen starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.phase]);

  if (state.phase === "chat" && profile) return <ChatView profile={profile} oracle={oracle} />;
  if (state.phase === "cierre" && profile) return <ClosingView profile={profile} state={state} onRestart={oracle.restart} />;

  return (
    <div className="min-h-dvh">
      <OracleHeader />
      <main>
        {state.phase === "consentimiento" && profile ? (
          <ConsentStep
            profile={profile}
            starting={state.busy === "start"}
            error={state.error}
            onBack={oracle.back}
            onStart={oracle.start}
          />
        ) : (
          <ProfileStep onChoose={oracle.choose} />
        )}
      </main>
    </div>
  );
}
