import { ArrowRight, ArrowUpRight, Backpack, GraduationCap, House, LayoutGrid, Mail, Phone, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { LOGOS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { SITE_FOOTER as F } from "@/lib/content/sitio";
import { HELP_LINES } from "@/lib/oraculo/config/lineas";
import { CONTROLLERS } from "@/lib/oraculo/config/legal";
import { TRACKS, type TrackId } from "@/lib/sections";

const TRACK_ICONS: Record<TrackId, LucideIcon> = {
  docentes: GraduationCap,
  estudiantes: Backpack,
  familias: House,
};

const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

const linkClass = "text-gray-text transition-colors hover:text-green-bright";

/**
 * Site-wide footer (home, sessions and the Oráculo's legal pages): legal pages, allies,
 * contact and the two emergency lines. Not shown inside the chat itself.
 * At the end of a session (`track`), it opens with the links to the home page and the other sessions.
 * The bottom padding keeps it clear of the floating buttons.
 */
export function SiteFooter({ track }: { track?: TrackId }) {
  return (
    <footer className="border-t border-line bg-navy-deep pb-24 text-sm print:hidden">
      {track && <SessionEnd track={track} />}

      <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-12 sm:px-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src={LOGOS.alcaldia.src}
            alt={LOGOS.alcaldia.alt}
            width={LOGOS.alcaldia.width}
            height={LOGOS.alcaldia.height}
            className="h-auto w-56"
          />
          <p className="mt-5 max-w-xs leading-relaxed text-gray-text">{F.about}</p>

          <p className="mt-8 font-display text-base font-bold text-white">{F.helpTitle}</p>
          <ul className="mt-3 grid max-w-xs gap-2">
            {F.helpLines.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={HELP_LINES[id].href}
                  aria-label={`${F.call} ${HELP_LINES[id].number}, ${label}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] p-1.5 pr-4 transition-colors hover:border-green-bright hover:bg-green-bright/10"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-green-bright text-navy-dark transition-transform duration-300 group-hover:scale-105">
                    <Phone aria-hidden="true" className="size-4" strokeWidth={2} />
                  </span>
                  <span className="font-display text-base font-bold leading-none text-white">{HELP_LINES[id].number}</span>
                  <span className="text-xs text-gray-text">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {F.groups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <FooterHeading>{group.title}</FooterHeading>
            <ul className="mt-5 grid gap-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  {link.ready ? (
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  ) : (
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-muted">
                      {link.label}
                      <span className="whitespace-nowrap rounded-full border border-white/15 px-2 py-0.5 text-[0.6875rem]">
                        {F.soon}
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="grid content-start gap-9">
          <div>
            <FooterHeading>{F.contactTitle}</FooterHeading>
            <p className="mt-5 text-gray-muted">{F.contactNote}</p>
            <ul className="mt-3 grid gap-3">
              <li>
                <a href={telHref(CONTROLLERS.phone)} className={`inline-flex items-center gap-2 ${linkClass}`}>
                  <Phone aria-hidden="true" className="size-4 text-green-bright" />
                  {CONTROLLERS.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTROLLERS.email}`} className={`inline-flex items-center gap-2 break-all ${linkClass}`}>
                  <Mail aria-hidden="true" className="size-4 shrink-0 text-green-bright" />
                  {CONTROLLERS.email}
                </a>
              </li>
            </ul>
          </div>
          <nav aria-label={F.alliesTitle}>
            <FooterHeading>{F.alliesTitle}</FooterHeading>
            <ul className="mt-5 grid gap-3">
              {F.allies.map((ally) => (
                <li key={ally.href}>
                  <a
                    href={ally.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 ${linkClass}`}
                  >
                    {ally.label}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-6 pt-6 sm:px-10">
        <p className="text-center text-xs leading-relaxed text-gray-muted">
          © {new Date().getFullYear()} {F.project}. {F.disclaimer}
        </p>
      </div>
    </footer>
  );
}

/** Column title: white and bold, with a short green line under it. */
function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-sm font-bold uppercase tracking-[0.08em] text-white">
      {children}
      <span aria-hidden="true" className="mt-2.5 block h-0.5 w-8 rounded-full bg-green-bright" />
    </h2>
  );
}

/** End of a presentation: back to the home page or straight to another session. */
function SessionEnd({ track }: { track: TrackId }) {
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
          : "border-white/15 text-white hover:border-green-bright hover:bg-white/[0.04]",
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          primary ? "bg-navy-dark/15" : "bg-white/[0.06] text-green-bright",
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
