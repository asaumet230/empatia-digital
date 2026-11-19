import { ArrowRight, Backpack, GraduationCap, House, LayoutGrid, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { SITE_FOOTER as F } from "@/lib/content/sitio";
import { TRACKS, type TrackId } from "@/lib/sections";

const TRACK_ICONS: Record<TrackId, LucideIcon> = {
  docentes: GraduationCap,
  estudiantes: Backpack,
  familias: House,
};

/** End of a presentation: back to the home page or straight to another session. */
export function SessionEnd({ track }: { track: TrackId }) {
  const { session } = F;
  const others = (Object.keys(TRACKS) as TrackId[]).filter((t) => t !== track);

  return (
    <div className="mx-auto max-w-6xl px-6 pt-12 sm:px-10">
      <nav
        aria-label={session.label}
        className="rounded-3xl border border-white/10 bg-navy/60 p-6 md:p-8"
      >
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-green-bright">
            {session.eyebrow}
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-white md:text-3xl">
            {session.title(TRACKS[track].title)}
          </p>
          <p className="mt-1.5 text-base text-gray-text">{session.question}</p>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          <li>
            <SessionLink href="/" icon={LayoutGrid} small={session.homeSmall} label={session.home} primary />
          </li>
          {others.map((t) => (
            <li key={t}>
              <SessionLink href={`/${t}`} icon={TRACK_ICONS[t]} small={session.otherSmall} label={TRACKS[t].title} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

interface SessionLinkProps {
  href: string;
  icon: LucideIcon;
  small: string;
  label: string;
  primary?: boolean;
}

function SessionLink({ href, icon: Icon, small, label, primary = false }: SessionLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full items-center gap-3 rounded-2xl border px-4 py-3.5 transition-[border-color,background-color,filter]",
        primary
          ? "border-green-bright bg-green-bright text-navy-dark hover:brightness-110"
          : "border-white/15 text-white hover:border-green-bright hover:bg-white/4",
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          primary ? "bg-navy-dark/15" : "bg-white/6 text-green-bright",
        )}
      >
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-xs", primary ? "text-navy-dark/75" : "text-gray-muted")}>{small}</span>
        <span className="block font-display text-base font-bold leading-tight">{label}</span>
      </span>
      <ArrowRight
        aria-hidden="true"
        className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
        strokeWidth={2}
      />
    </Link>
  );
}
