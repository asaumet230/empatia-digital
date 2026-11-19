"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Composer } from "@/components/oraculo/Composer";
import { ErrorNotice } from "@/components/oraculo/ErrorNotice";
import type { OracleControls } from "@/hooks/useOracle";
import { cn } from "@/lib/cn";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";

const t = ORACLE_TEXT.chat;

interface ChatFooterProps {
  oracle: OracleControls;
  /** The session has begun (after the consent). */
  started: boolean;
  /** The Oráculo is "typing" one of its opening lines: the box waits. */
  asking: boolean;
  /** The person scrolled up: show the "back to the end" button. */
  away: boolean;
  onToEnd: () => void;
}

/**
 * The bar under the chat: the button back to the end, any error, and then the message box — or,
 * when the session is paused or used up, a notice with what to do next.
 */
export function ChatFooter({ oracle, started, asking, away, onToEnd }: ChatFooterProps) {
  const { state, introduce, nameSelf, send, finish, restart, dismissError } = oracle;

  return (
    <footer className="sticky bottom-0 border-t border-o-line bg-o-bar pb-[env(safe-area-inset-bottom)]">
      {/* Always rendered so it can fade and slide in; `invisible` takes it out of reach while hidden */}
      <button
        type="button"
        onClick={onToEnd}
        aria-label={t.toEnd}
        className={cn(
          "absolute -top-16 right-4 grid size-12 place-items-center rounded-full! bg-o-user/90 text-o-user-text shadow-[0_8px_24px_-6px_rgb(0_0_0/0.45)] transition-[opacity,translate,visibility,background-color] duration-300 ease-out hover:bg-o-user sm:right-6 print:hidden",
          away ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0",
        )}
      >
        <ChevronDown aria-hidden="true" className="size-6" strokeWidth={2.5} />
      </button>
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-3 sm:px-6">
        {started && state.error && (
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

        {!started ? (
          <Composer disabled={state.phase !== "perfil"} locked={asking} onSend={introduce} />
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
            <Composer disabled={state.busy !== null} locked={asking} onSend={state.aliasDone ? send : nameSelf} />
            <p className="px-4 text-xs text-o-muted">{t.remaining(state.remaining)}</p>
          </>
        )}
      </div>
    </footer>
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
