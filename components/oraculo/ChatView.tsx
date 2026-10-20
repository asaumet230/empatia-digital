"use client";

import { ChevronDown, CircleCheck, UserRoundPen } from "lucide-react";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { Composer } from "@/components/oraculo/Composer";
import { ConsentDialog } from "@/components/oraculo/ConsentDialog";
import { ErrorNotice } from "@/components/oraculo/ErrorNotice";
import { cn } from "@/lib/cn";
import { FinishDialog } from "@/components/oraculo/FinishDialog";
import { MessageBubble, TypingIndicator } from "@/components/oraculo/MessageBubble";
import { OracleHeader } from "@/components/oraculo/OracleHeader";
import { OracleSplash } from "@/components/oraculo/OracleSplash";
import { SafetyPanel } from "@/components/oraculo/SafetyPanel";
import type { OracleControls } from "@/hooks/useOracle";
import { ORACLE_TEXT, PROFILE_OPTIONS } from "@/lib/oraculo/config/textos";
import { audienceOf, type Profile } from "@/lib/oraculo/tipos";

const t = ORACLE_TEXT.chat;

/** How far above the end the person must scroll before the "back to the end" button shows. */
const AWAY_PX = 200;

const distanceToEnd = () => document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);

function scrollToEnd() {
  const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: instant ? "auto" : "smooth" });
}

/** How long the Oráculo "types" its fixed opening lines: the greeting, then any retry. */
const GREETING_MS = 1600;
const RETRY_MS = 900;

/**
 * The conversation, from its first line: the Oráculo types a greeting and asks who is talking,
 * the person answers in their own words, the consent dialog opens over the chat, and then come
 * the fixed welcome, the messages and the help panels where the server asked for them.
 * Everything before the session is interface only.
 */
export function ChatView({ oracle }: { oracle: OracleControls }) {
  const { state, ask, introduce, nameSelf, back, start, send, finish, restart, dismissError } = oracle;
  const { profile } = state;
  const started = state.phase === "chat" && profile !== null;
  // The Oráculo owes a line in the opening: at the very start, after an answer it did not understand,
  // or the nickname question once the session starts
  const opening = state.phase === "perfil" || (started && !state.aliasDone);
  const asking = opening && state.intro.at(-1)?.role !== "oraculo";
  const open = started && state.aliasDone;
  const [confirming, setConfirming] = useState(false);
  const [away, setAway] = useState(false);
  const audience = profile ? audienceOf(profile) : "estudiante";
  const closing = state.busy === "close";

  useEffect(() => {
    if (!asking) return;
    const id = setTimeout(ask, state.intro.length === 0 ? GREETING_MS : RETRY_MS);
    return () => clearTimeout(id);
  }, [asking, ask, state.intro.length]);

  // Like a messaging app: anything new in the conversation brings it to the end
  useEffect(() => {
    scrollToEnd();
  }, [state.intro.length, state.history.length, state.pending, state.busy, state.locked, state.error, asking, started]);

  // Scrolled up to reread: offer a way back to the end
  useEffect(() => {
    const onScroll = () => setAway(distanceToEnd() > AWAY_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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
    <div className="oraculo-pattern flex min-h-dvh flex-col">
      <OracleHeader>
        {started && (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={closing}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-o-strong bg-o-surface px-2.5 text-sm font-semibold shadow-sm hover:bg-o-raised disabled:cursor-wait sm:gap-2 sm:px-4"
          >
            <CircleCheck aria-hidden="true" className="size-4 text-o-accent" />
            {t.finish}
          </button>
        )}
      </OracleHeader>

      <main className="flex-1">
        <div role="log" aria-live="polite" aria-label="Conversación" className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
          {state.intro.map((message, i) => (
            <MessageBubble key={i} {...message} />
          ))}
          {asking && <TypingIndicator />}
          {/* What the app understood from the answer; a wrong profile can be fixed until the first message */}
          {open && state.history.length === 0 && state.busy === null && (
            <ProfileBadge profile={profile} onChange={restart} />
          )}
          {open && (
            <MessageBubble
              role="oraculo"
              text={`${ORACLE_TEXT.intro.thanks(state.alias)} ${PROFILE_OPTIONS[profile].welcome}`}
            />
          )}
          {state.history.map((message, i) => (
            <Fragment key={i}>
              <MessageBubble {...message} />
              {panelsAfter(i)}
            </Fragment>
          ))}
          {state.pending && <MessageBubble role="usuario" text={state.pending} pending />}
          {state.busy === "send" && <TypingIndicator />}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-o-line bg-o-bar pb-[env(safe-area-inset-bottom)]">
        {/* Always rendered so it can fade and slide in; `invisible` takes it out of reach while hidden */}
        <button
          type="button"
          onClick={() => scrollToEnd()}
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

      {/* While the summary is written, the owl covers the chat, as on the way in */}
      {closing && (
        <OracleSplash
          title={ORACLE_TEXT.finish.working.title}
          text={ORACLE_TEXT.finish.working.text}
          className="fixed inset-0 z-50 bg-o-bg"
        />
      )}

      <ConsentDialog
        profile={state.phase === "consentimiento" ? profile : null}
        starting={state.busy === "start"}
        error={state.error}
        onBack={back}
        onStart={start}
      />

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

function ProfileBadge({ profile, onChange }: { profile: Profile; onChange: () => void }) {
  const { label, icon: Icon } = PROFILE_OPTIONS[profile];
  return (
    <div className="flex justify-end">
      <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-o-line bg-o-surface p-1 pl-3 text-sm shadow-sm">
        <Icon aria-hidden="true" className="size-4 text-o-accent" />
        <span className="font-semibold text-o-muted">{label}</span>
        <button
          type="button"
          onClick={onChange}
          className="inline-flex items-center gap-1.5 rounded-full bg-green-bright/15 px-3 py-1.5 font-semibold text-o-accent transition-colors hover:bg-green-bright/25"
        >
          <UserRoundPen aria-hidden="true" className="size-4" />
          {ORACLE_TEXT.intro.change}
        </button>
      </div>
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
