import { ArrowUpRight, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BackToTop } from "@/components/ui/BackToTop";
import { InstagramIcon } from "@/components/ui/footer/InstagramIcon";
import { SessionEnd } from "@/components/ui/footer/SessionEnd";
import { LOGOS } from "@/lib/constants";
import { SITE_FOOTER as F } from "@/lib/content/sitio";
import { CONTROLLERS } from "@/lib/oraculo/config/legal";
import { HELP_LINES } from "@/lib/oraculo/config/lineas";
import type { TrackId } from "@/lib/sections";

const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

const linkClass = "text-gray-text transition-colors hover:text-green-bright";

/**
 * Site-wide footer (home, sessions and the Oráculo's legal pages): legal pages, allies,
 * contact and the two emergency lines. Not shown inside the chat itself.
 * At the end of a session (`track`), it opens with the links to the home page and the other sessions.
 */
export function SiteFooter({ track }: { track?: TrackId }) {
  return (
    <footer className="border-t border-line bg-navy-deep pb-6 text-sm print:hidden">
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
                  className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/4 p-1.5 pr-4 transition-colors hover:border-green-bright hover:bg-green-bright/10"
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
              <li>
                <a
                  href={F.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram de la Fundación Por Una Sonrisa: ${F.instagram.handle} (se abre en una pestaña nueva)`}
                  className={`inline-flex items-center gap-2 break-all ${linkClass}`}
                >
                  <InstagramIcon />
                  {F.instagram.handle}
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
        <div className="mt-6 flex justify-center">
          <BackToTop />
        </div>
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
