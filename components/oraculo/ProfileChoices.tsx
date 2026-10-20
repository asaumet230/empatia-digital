import { ORACLE_TEXT, PROFILE_OPTIONS } from "@/lib/oraculo/config/textos";
import { PROFILES, type Profile } from "@/lib/oraculo/tipos";

/**
 * Quick replies under the Oráculo's first question: who is talking. Buttons, never free text,
 * because the profile picks the prompt and the safety policy.
 */
export function ProfileChoices({ onChoose }: { onChoose: (profile: Profile) => void }) {
  return (
    <ul aria-label={ORACLE_TEXT.intro.choices} className="flex flex-col items-end gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
      {PROFILES.map((id) => {
        const { label, icon: Icon } = PROFILE_OPTIONS[id];
        return (
          <li key={id}>
            <button
              type="button"
              onClick={() => onChoose(id)}
              className="inline-flex items-center gap-2 rounded-full border border-o-accent/60 bg-o-surface px-4 py-2.5 text-base font-semibold shadow-sm transition-[border-color,transform] hover:-translate-y-0.5 hover:border-o-accent"
            >
              <Icon aria-hidden="true" className="size-5 shrink-0 text-o-accent" strokeWidth={1.75} />
              {label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
