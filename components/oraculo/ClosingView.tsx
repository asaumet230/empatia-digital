"use client";

import { Printer, RotateCcw } from "lucide-react";
import { HelpLineButton } from "@/components/oraculo/HelpLineButton";
import { OracleHeader } from "@/components/oraculo/OracleHeader";
import { SafetyPanel } from "@/components/oraculo/SafetyPanel";
import { CopyButton } from "@/components/ui/CopyButton";
import type { OracleState } from "@/lib/oraculo/estado";
import { HELP_LINES, type HelpLineId } from "@/lib/oraculo/config/lineas";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";
import { audienceOf, type Profile } from "@/lib/oraculo/tipos";

const t = ORACLE_TEXT.closing;
const CLOSING_LINES: readonly HelpLineId[] = ["emergencias", "icbf", "lineaVida"];

/** End of the session: the summary to copy or print, or, after a stop, the help panel again. */
export function ClosingView({ profile, state, onRestart }: { profile: Profile; state: OracleState; onRestart: () => void }) {
  const summary = state.summary;

  return (
    <div className="min-h-dvh">
      <OracleHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
        {state.locked ? (
          <>
            <h1 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold tracking-[-0.03em]">{t.lockedTitle}</h1>
            <SafetyPanel safetyKey={state.locked} audience={audienceOf(profile)} className="mt-6" />
          </>
        ) : (
          <>
            <h1 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold tracking-[-0.03em]">{t.title}</h1>
            <article className="mt-6 rounded-3xl border border-o-line bg-o-surface p-6 text-base leading-relaxed shadow-sm print:border-0 print:p-0 print:shadow-none md:p-8">
              <p className="whitespace-pre-line">{summary ?? (state.closingFailed ? t.failed : t.empty)}</p>
              {summary && <p className="mt-6 text-sm text-o-muted">{t.note}</p>}
            </article>
          </>
        )}

        <div className="mt-6 flex flex-wrap gap-3 print:hidden">
          {summary && !state.locked && (
            <>
              <CopyButton text={summary} label={t.copy} tone="oraculo" />
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full border border-o-line px-5 py-3 font-semibold hover:bg-o-raised"
              >
                <Printer aria-hidden="true" className="size-4" />
                {t.print}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-full bg-green-bright px-5 py-3 font-bold text-navy-dark hover:brightness-105"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            {t.restart}
          </button>
        </div>

        {!state.locked && (
          <section aria-labelledby="cierre-ayuda" className="mt-12 print:hidden">
            <h2 id="cierre-ayuda" className="font-display text-lg font-bold tracking-[-0.02em]">
              {t.helpTitle}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {CLOSING_LINES.map((id) => (
                <HelpLineButton key={id} line={HELP_LINES[id]} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
