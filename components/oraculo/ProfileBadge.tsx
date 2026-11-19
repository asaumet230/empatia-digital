import { UserRoundPen } from "lucide-react";
import { ORACLE_TEXT, PROFILE_OPTIONS } from "@/lib/oraculo/config/textos";
import type { Profile } from "@/lib/oraculo/tipos";

/** What the app understood from the answer, with a button to change it before the first message. */

export function ProfileBadge({ profile, onChange }: { profile: Profile; onChange: () => void }) {
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
