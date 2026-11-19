import type { ReactNode } from "react";
import { PromptBox } from "@/components/sections/prompt/PromptCard";
import {
  CASES_BLOCK,
  casePrompt,
  FAMILY_CASES,
  FINISH,
  personalize,
  type Child,
  type FamilyCase,
  type Speaker,
} from "@/lib/content/familias";
import { twoDigits } from "@/lib/format";

interface CaseDetailProps {
  number: number;
  c: FamilyCase;
  speaker: Speaker;
  child: Child;
}

/** The chosen case in three steps: the scenario prompt, the opening line and how to finish. */
export function CaseDetail({ number, c, speaker, child }: CaseDetailProps) {
  const prompt = personalize(casePrompt(c), speaker, child);

  return (
    <div className="rounded-3xl border border-white/10 bg-navy-dark/70 p-5 md:p-6">
      <span className="inline-flex items-center rounded-full bg-green-bright/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-green-bright">
        {CASES_BLOCK.caseLabel} {twoDigits(number)} de {twoDigits(FAMILY_CASES.length)}
      </span>
      <h3 className="mt-3 font-display text-[clamp(1.375rem,2.2vw,1.875rem)] font-bold leading-[1.1] tracking-[-0.02em]">
        {c.title}
      </h3>
      <p className="mt-2 text-base text-gray-text">{personalize(c.situation, speaker, child)}</p>

      <ol className="mt-6 space-y-5">
        <Step
          n={1}
          title={CASES_BLOCK.steps.scenario}
          hint={personalize(CASES_BLOCK.stepHints.scenario, speaker, child)}
        >
          <PromptBox fit text={prompt} title={`Caso ${twoDigits(number)} · ${c.title}`} />
        </Step>

        <Step n={2} title={CASES_BLOCK.steps.opening} hint={CASES_BLOCK.stepHints.opening}>
          <p className="border-l-2 border-yellow pl-4 text-lg leading-snug text-white md:text-xl">“{c.opening}”</p>
        </Step>

        <Step n={3} title={CASES_BLOCK.steps.finish} hint={CASES_BLOCK.stepHints.finish}>
          <span className="inline-block rounded-xl border border-yellow/50 bg-yellow/10 px-4 py-2 font-semibold text-yellow">
            “{FINISH}”
          </span>
        </Step>
      </ol>
    </div>
  );
}

function Step({ n, title, hint, children }: { n: number; title: string; hint: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
      <span className="grid size-9 place-items-center rounded-full bg-green-bright text-navy-dark font-display text-base font-bold">
        {n}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-bright">Paso {n} de 3</p>
        <p className="mt-0.5 font-display text-lg font-bold leading-tight text-white md:text-xl">{title}</p>
        <p className="mt-1 text-sm leading-snug text-gray-text">{hint}</p>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  );
}
