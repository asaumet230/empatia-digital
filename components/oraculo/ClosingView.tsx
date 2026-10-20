"use client";

import { LifeBuoy, Phone, Printer, RotateCcw, ShieldCheck } from "lucide-react";
import { OracleHeader } from "@/components/oraculo/OracleHeader";
import { SafetyPanel } from "@/components/oraculo/SafetyPanel";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/lib/cn";
import type { OracleState } from "@/lib/oraculo/estado";
import { HELP_LINES, type HelpLineId } from "@/lib/oraculo/config/lineas";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";
import { audienceOf, type Profile } from "@/lib/oraculo/tipos";

const t = ORACLE_TEXT.closing;
const CLOSING_LINES: readonly HelpLineId[] = ["emergencias", "icbf", "lineaVida"];

/** Secondary actions on the summary: same look for copy and print. */
const SECONDARY = "bg-o-raised hover:border-o-accent";

/** End of the session: the summary to copy or print, or, after a stop, the help panel again. */
export function ClosingView({ profile, state, onRestart }: { profile: Profile; state: OracleState; onRestart: () => void }) {
  const summary = state.summary;

  return (
    <div className="min-h-dvh">
      <OracleHeader />
      {/* On wide screens the summary and the help lines sit side by side, so both fit without scrolling */}
      <main
        className={cn(
          "mx-auto px-4 py-10 sm:px-6 md:py-14",
          state.locked
            ? "max-w-3xl"
            : "max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-10 lg:py-10 print:block",
        )}
      >
        <div>
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
                {summary && (
                  <footer className="mt-6 flex flex-col gap-4 border-t border-o-line pt-5 sm:flex-row sm:items-center sm:justify-between print:border-0">
                    <p className="flex items-center gap-2 text-sm text-o-muted">
                      <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-o-accent" />
                      {t.note}
                    </p>
                    <div className="flex gap-2 print:hidden">
                      <CopyButton text={summary} label={t.copy} tone="oraculo" className={SECONDARY} />
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border border-o-line px-5 py-3 font-semibold transition-[background-color,border-color]",
                          SECONDARY,
                        )}
                      >
                        <Printer aria-hidden="true" className="size-4" />
                        {t.print}
                      </button>
                    </div>
                  </footer>
                )}
              </article>
            </>
          )}

          <button
            type="button"
            onClick={onRestart}
            className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-green-bright px-7 py-3.5 text-lg font-bold text-navy-dark shadow-lg shadow-green-bright/20 transition-[filter,transform] hover:brightness-105 active:scale-[0.98] sm:w-auto print:hidden"
          >
            <RotateCcw aria-hidden="true" className="size-5" strokeWidth={2.5} />
            {t.restart}
          </button>
        </div>

        {!state.locked && (
          <section
            aria-labelledby="cierre-ayuda"
            className="mt-12 rounded-3xl border border-o-line bg-o-surface p-5 shadow-sm print:hidden lg:mt-0"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-bright/15 text-o-accent">
                <LifeBuoy aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 id="cierre-ayuda" className="font-display text-base font-bold leading-tight tracking-[-0.02em]">
                  {t.helpTitle}
                </h2>
                <p className="text-sm text-o-muted">{t.helpLead}</p>
              </div>
            </div>

            <ul className="mt-4 divide-y divide-o-line border-t border-o-line">
              {CLOSING_LINES.map((id) => {
                const line = HELP_LINES[id];
                return (
                  <li key={id}>
                    <a href={line.href} className="group flex items-center gap-3 py-3.5">
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-xl font-bold tracking-[-0.02em] text-o-text">
                          {line.number}
                        </span>
                        <span className="block text-sm font-semibold">{line.name}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-o-muted">
                          {line.when} · {line.hours}
                        </span>
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-bright px-3.5 py-2 text-sm font-bold text-navy-dark transition-[filter] group-hover:brightness-105">
                        <Phone aria-hidden="true" className="size-4" strokeWidth={2.5} />
                        {t.call}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
