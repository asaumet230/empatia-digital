"use client";

import { Check, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { ErrorNotice } from "@/components/oraculo/ErrorNotice";
import { ORACLE_TEXT, PROFILE_OPTIONS, type ErrorCode } from "@/lib/oraculo/config/textos";
import { audienceOf, type Profile } from "@/lib/oraculo/tipos";

interface ConsentStepProps {
  profile: Profile;
  starting: boolean;
  error: ErrorCode | null;
  onBack: () => void;
  onStart: () => void;
}

/** What the person must understand before talking. "Empezar" only works once they check it. */
export function ConsentStep({ profile, starting, error, onBack, onStart }: ConsentStepProps) {
  const t = ORACLE_TEXT.consent;
  const { label, icon: Icon } = PROFILE_OPTIONS[profile];
  const [agreed, setAgreed] = useState(false);
  const checkId = useId();
  const student = audienceOf(profile) === "estudiante";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 md:py-14">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-green-bright/15 px-3 py-1.5 text-sm font-semibold text-o-accent">
          <Icon aria-hidden="true" className="size-4" />
          {label}
        </span>
        <button type="button" onClick={onBack} className="text-sm font-semibold text-o-muted underline-offset-4 hover:underline">
          {t.change}
        </button>
      </div>

      <h1 className="mt-6 font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em]">
        {t.title}
      </h1>

      <div className="mt-6 rounded-3xl border border-o-line bg-o-surface p-5 shadow-sm md:p-7">
        <p className="font-semibold">Entiendo que:</p>
        <ul className="mt-4 space-y-3">
          {t.items[student ? "estudiante" : "adulto"].map((item) => (
            <li key={item} className="flex gap-3 text-base leading-snug">
              <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-o-accent" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-5 flex gap-2 text-sm leading-snug text-o-muted">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            {student && `${t.studentNote} `}
            {t.limits}
          </span>
        </p>

        <Link
          href="/oraculo/privacidad"
          target="_blank"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-o-accent underline-offset-4 hover:underline"
        >
          {t.privacy}
          <ExternalLink aria-hidden="true" className="size-3.5" />
        </Link>

        <label
          htmlFor={checkId}
          className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl border border-o-line bg-o-raised p-4 font-semibold"
        >
          <input
            id={checkId}
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="size-6 shrink-0 accent-[var(--green)]"
          />
          {t.check}
        </label>
      </div>

      {error && <ErrorNotice code={error} className="mt-4" />}

      <button
        type="button"
        onClick={onStart}
        disabled={!agreed || starting}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-green-bright px-8 py-4 text-lg font-bold text-navy-dark transition-[filter,opacity] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {starting ? t.starting : t.start}
      </button>
    </div>
  );
}
