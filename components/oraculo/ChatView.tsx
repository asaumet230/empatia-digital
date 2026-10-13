"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Composer } from "@/components/oraculo/Composer";
import { ErrorNotice } from "@/components/oraculo/ErrorNotice";
import { FinishDialog } from "@/components/oraculo/FinishDialog";
import { MessageBubble, TypingIndicator } from "@/components/oraculo/MessageBubble";
import { OracleHeader } from "@/components/oraculo/OracleHeader";
import { SafetyPanel } from "@/components/oraculo/SafetyPanel";
import type { OracleControls } from "@/hooks/useOracle";
import { ORACLE_TEXT, PROFILE_OPTIONS } from "@/lib/oraculo/config/textos";
import { audienceOf, type Profile } from "@/lib/oraculo/tipos";

const t = ORACLE_TEXT.chat;

/** The conversation: fixed welcome, messages, help panels where the server asked for them. */
export function ChatView({ profile, oracle }: { profile: Profile; oracle: OracleControls }) {
  const { state, send, finish, restart, dismissError } = oracle;
  const [confirming, setConfirming] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const latest = useRef<HTMLDivElement>(null);
  const audience = audienceOf(profile);
  const closing = state.busy === "close";

  // While waiting, follow the bottom; when the answer (or a help panel) arrives, show it from its start
  useEffect(() => {
    if (state.pending) end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    else latest.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state.history.length, state.pending]);

  // Closing or reloading the tab mid-conversation asks first: after closing, nothing is left
  useEffect(() => {
    if (state.history.length === 0) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [state.history.length]);

  const panelsAfter = (i: number) =>
    state.panels
      .filter((p) => p.after === i)
      .map((p) => <SafetyPanel key={`${p.after}-${p.key}`} safetyKey={p.key} audience={audience} />);

  return (
    <div className="flex min-h-dvh flex-col">
      <OracleHeader>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={closing}
          className="h-10 rounded-full px-3 text-sm font-semibold text-o-muted hover:bg-o-raised hover:text-o-text disabled:opacity-50 sm:px-4"
        >
          {t.finish}
        </button>
      </OracleHeader>

      <main className="flex-1">
        <div role="log" aria-live="polite" aria-label="Conversación" className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
          <MessageBubble role="oraculo" text={PROFILE_OPTIONS[profile].welcome} />
          {state.history.map((message, i) => {
            const last = i === state.history.length - 1;
            // A stop has no reply: its panel is what must be read first
            const anchor = last && (message.role === "oraculo" || state.locked);
            return (
              <Fragment key={i}>
                {anchor && state.locked ? (
                  <>
                    <MessageBubble {...message} />
                    <div ref={latest} className="scroll-mt-20">
                      {panelsAfter(i)}
                    </div>
                  </>
                ) : (
                  <>
                    <div ref={anchor ? latest : undefined} className="scroll-mt-20">
                      <MessageBubble {...message} />
                    </div>
                    {panelsAfter(i)}
                  </>
                )}
              </Fragment>
            );
          })}
          {state.pending && <MessageBubble role="usuario" text={state.pending} pending />}
          {state.busy === "send" && <TypingIndicator />}
          <div ref={end} />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-o-line bg-o-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto max-w-3xl space-y-3 px-4 py-3 sm:px-6">
          {state.error && (
            <ErrorNotice
              code={state.error}
              action={
                state.error === "sesion_invalida" ? (
                  <FooterButton onClick={restart}>{ORACLE_TEXT.closing.restart}</FooterButton>
                ) : (
                  <FooterButton onClick={dismissError}>OK</FooterButton>
                )
              }
            />
          )}

          {closing ? (
            <p role="status" className="py-3 text-center text-sm font-semibold text-o-muted">
              {ORACLE_TEXT.finish.working}
            </p>
          ) : state.locked ? (
            <Notice title={ORACLE_TEXT.locked.title} text={ORACLE_TEXT.locked.text}>
              <FooterButton onClick={finish}>{t.finish}</FooterButton>
            </Notice>
          ) : state.limit ? (
            <Notice title={ORACLE_TEXT.limit[state.limit]} text={ORACLE_TEXT.limit.next}>
              <FooterButton primary onClick={finish}>
                {ORACLE_TEXT.closing.title}
              </FooterButton>
              <FooterButton onClick={restart}>{ORACLE_TEXT.closing.restart}</FooterButton>
            </Notice>
          ) : (
            <>
              <Composer disabled={state.busy !== null} onSend={send} />
              <p className="px-4 text-xs text-o-muted">{t.remaining(state.remaining)}</p>
            </>
          )}
        </div>
      </footer>

      <FinishDialog
        open={confirming}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          void finish();
        }}
      />
    </div>
  );
}

function Notice({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <div role="status" className="rounded-2xl border border-o-line bg-o-surface p-4">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-o-muted">{text}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FooterButton({ onClick, primary = false, children }: { onClick: () => void; primary?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        primary
          ? "rounded-full bg-green-bright px-4 py-2 text-sm font-bold text-navy-dark hover:brightness-105"
          : "rounded-full border border-o-line px-4 py-2 text-sm font-semibold hover:bg-o-raised"
      }
    >
      {children}
    </button>
  );
}
