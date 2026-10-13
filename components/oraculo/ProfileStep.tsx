import { ArrowRight } from "lucide-react";
import { ORACLE_TEXT, PROFILE_OPTIONS } from "@/lib/oraculo/config/textos";
import { PROFILES, type Profile } from "@/lib/oraculo/tipos";

/** First screen: who is talking. It picks the prompt and the safety policy. */
export function ProfileStep({ onChoose }: { onChoose: (profile: Profile) => void }) {
  const t = ORACLE_TEXT.profile;
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 md:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-o-accent">{t.eyebrow}</p>
      <h1 className="mt-3 font-display text-[clamp(2rem,6vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]">
        {t.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-o-muted">{t.lead}</p>

      <ul className="mt-8 grid gap-3">
        {PROFILES.map((id) => {
          const { label, description, icon: Icon } = PROFILE_OPTIONS[id];
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChoose(id)}
                className="group flex w-full items-center gap-4 rounded-3xl border border-o-line bg-o-surface p-5 text-left shadow-sm transition-[border-color,transform] hover:-translate-y-0.5 hover:border-o-accent md:p-6"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-green-bright/15 text-o-accent">
                  <Icon aria-hidden="true" className="size-7" strokeWidth={1.75} />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-lg font-bold tracking-[-0.02em] md:text-xl">{label}</span>
                  <span className="mt-1 block text-base leading-snug text-o-muted">{description}</span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 shrink-0 text-o-muted transition-transform group-hover:translate-x-1 group-hover:text-o-accent"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
