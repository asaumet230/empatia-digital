import { ArrowRight, Backpack, GraduationCap, House, ScanLine, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { SessionSwitcher } from "@/components/presentation/SessionSwitcher";
import { CopyButton } from "@/components/ui/CopyButton";
import { QrCode } from "@/components/ui/QrCode";
import { QrDialogButton } from "@/components/ui/QrDialogButton";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { BRAND, PUBLIC_SITE_URL, SITE_URL } from "@/lib/constants";

interface Audience {
  href: string;
  who: string;
  icon: LucideIcon;
}

/** The three audiences; each card opens its presentation. */
const AUDIENCES: readonly Audience[] = [
  {
    href: "/docentes",
    who: "Soy docente",
    icon: GraduationCap,
  },
  {
    href: "/estudiantes",
    who: "Soy estudiante",
    icon: Backpack,
  },
  {
    href: "/familias",
    who: "Soy padre",
    icon: House,
  },
];

/** Entry point: pick your session. Each audience has its own presentation, with a QR to open it on a phone. */
export default function Home() {
  return (
    <>
      <main className="grain relative isolate flex min-h-svh flex-col overflow-hidden bg-navy-dark">
        <SessionSwitcher />
        <div aria-hidden="true" className="tech-grid pointer-events-none absolute inset-0 opacity-50" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--navy)_0%,transparent_70%)]"
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
          <h1 className="font-display text-[clamp(2.75rem,10vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
            Empat<span className="text-yellow text-glow-yellow">IA</span>
            <span className="mt-3 block text-[0.3em] font-light uppercase tracking-[0.55em] text-gray-light [margin-right:-0.55em]">
              Digital
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-text md:text-xl">{BRAND.tagline}</p>

          {/* Big enough to read from the back of the room and copy by hand */}
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-green-bright/40 bg-navy/70 px-6 py-4 sm:flex-row sm:gap-5">
            <span className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-gray-light">Entra aquí</span>
            <span className="select-all break-all font-mono text-xl font-semibold text-green-bright md:text-3xl">
              {PUBLIC_SITE_URL.replace(/^https?:\/\//, "")}
            </span>
            <span className="flex items-center gap-2">
              <CopyButton text={PUBLIC_SITE_URL} />
              <QrDialogButton title="Escanea para entrar" url={PUBLIC_SITE_URL.replace(/^https?:\/\//, "")}>
                <QrCode value={PUBLIC_SITE_URL} label="Código QR para entrar a EmpatIA Digital" className="aspect-square w-full p-3" />
              </QrDialogButton>
            </span>
          </div>

          <h2 className="mt-14 font-display text-2xl font-bold tracking-[-0.02em] text-white md:text-4xl">
            Elige tu sesión
          </h2>
          <p className="mt-2 text-base text-gray-text md:text-lg">
            Toca tu tarjeta<span className="hidden md:inline"> o escanea su código con el celular</span>.
          </p>
          <span aria-hidden="true" className="mt-4 block h-0.5 w-12 rounded-full bg-green-bright" />

          <ul className="mt-8 grid w-full gap-4 md:gap-6 lg:grid-cols-3">
            {AUDIENCES.map(({ href, who, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-navy/70 p-6 text-left transition-[border-color,background-color,transform] duration-500 hover:-translate-y-1 hover:border-green-bright/60 hover:bg-navy md:p-7"
                >
                  <span className="flex items-center gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-green/15 text-green-bright transition-colors duration-500 group-hover:bg-green group-hover:text-white">
                      <Icon aria-hidden="true" className="size-6" strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0 flex-1 whitespace-nowrap font-display text-xl font-bold leading-tight tracking-[-0.02em] lg:text-[clamp(0.875rem,1.3vw,1.2rem)]">
                      {who}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-muted transition-[color,transform] duration-500 group-hover:translate-x-1 group-hover:text-green-bright"
                    />
                  </span>

                  {/* To open it on a phone in the computer lab; on a phone it is not needed */}
                  <span className="mt-6 hidden flex-col items-center border-t border-white/10 pt-6 text-center md:flex">
                    <QrCode
                      value={`${SITE_URL}${href}`}
                      label={`Código QR para abrir la sesión: ${who}`}
                      className="size-36 shrink-0 p-2"
                    />
                    <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-light">
                      <ScanLine aria-hidden="true" className="size-4 text-green-bright" />
                      Escanea con tu celular
                    </span>
                    <span className="mt-1 block break-all font-mono text-xs text-gray-muted">
                      {SITE_URL.replace(/^https?:\/\//, "")}
                      {href}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
