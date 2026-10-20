"use client";

import { Check, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { ErrorNotice } from "@/components/oraculo/ErrorNotice";
import { Modal } from "@/components/oraculo/Modal";
import { ORACLE_TEXT, PROFILE_OPTIONS, type ErrorCode } from "@/lib/oraculo/config/textos";
import { audienceOf, type Profile } from "@/lib/oraculo/tipos";

interface ConsentDialogProps {
  /** Open while a profile is chosen and the session has not started. */
  profile: Profile | null;
  starting: boolean;
  error: ErrorCode | null;
  onBack: () => void;
  onStart: () => void;
}

/**
 * What the person must understand before talking, worded for who they said they are.
 * "Empezar" only works once they check it; closing the dialog goes back to the choice.
 */
export function ConsentDialog({ profile, ...props }: ConsentDialogProps) {
  return (
    <Modal open={profile !== null} onClose={props.onBack} labelledBy="autorizacion-titulo">
      {profile && <ConsentContent profile={profile} {...props} />}
    </Modal>
  );
}

function ConsentContent({ profile, starting, error, onBack, onStart }: ConsentDialogProps & { profile: Profile }) {
  const t = ORACLE_TEXT.consent;
  const { label, icon: Icon } = PROFILE_OPTIONS[profile];
  const [agreed, setAgreed] = useState(false);
  const checkId = useId();
  const student = audienceOf(profile) === "estudiante";

  return (
    <div className="p-5 sm:p-6">
      <span className="inline-flex items-center gap-2.5 rounded-full bg-green-bright/15 px-4 py-2 text-lg font-bold text-o-accent">
        <Icon aria-hidden="true" className="size-5" />
        {label}
      </span>

      <h2 id="autorizacion-titulo" className="mt-4 font-display text-2xl font-bold tracking-[-0.02em]">
        {t.title}
      </h2>

      <p className="mt-4 font-semibold">Entiendo que:</p>
      <ul className="mt-3 space-y-3">
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
        className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-o-line bg-o-raised p-4 font-semibold"
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

      {error && <ErrorNotice code={error} className="mt-4" />}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onBack} className="rounded-full border border-o-line px-5 py-3 font-semibold hover:bg-o-raised">
          {t.back}
        </button>
        <button
          type="button"
          onClick={onStart}
          disabled={!agreed || starting}
          className="rounded-full bg-green-bright px-6 py-3 font-bold text-navy-dark transition-[filter,opacity] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {starting ? t.starting : t.start}
        </button>
      </div>
    </div>
  );
}
