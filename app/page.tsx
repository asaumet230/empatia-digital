import { ArrowRight, GraduationCap, House, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SessionSwitcher } from "@/components/presentation/SessionSwitcher";
import { BRAND, LOGOS } from "@/lib/constants";

interface Audience {
  href: string;
  who: string;
  session: string;
  icon: LucideIcon;
}

/** Session names as they appear in the training program. */
const AUDIENCES: readonly Audience[] = [
  {
    href: "/docentes",
    who: "Soy docente",
    session: "Mediación tecnológica y diagnóstico del aula con IA",
    icon: GraduationCap,
  },
  {
    href: "/familias",
    who: "Soy padre, madre o acudiente",
    session: "Hogares conectados, familias empáticas",
    icon: House,
  },
];

/** Entry point: pick your session. Each audience has its own presentation. */
export default function Home() {
  return (
    <main className="grain relative isolate flex min-h-svh flex-col overflow-hidden bg-navy-dark">
      <SessionSwitcher />
      <div aria-hidden="true" className="tech-grid pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--navy)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <h1 className="font-display text-[clamp(2.75rem,10vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
          Empat<span className="text-yellow text-glow-yellow">IA</span>
          <span className="mt-3 block text-[0.3em] font-light uppercase tracking-[0.55em] text-gray-light [margin-right:-0.55em]">
            Digital
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-text md:text-xl">{BRAND.tagline}</p>

        <p className="hud-label mt-14">Elige tu sesión</p>
        <ul className="mt-5 grid w-full gap-4 md:grid-cols-2 md:gap-6">
          {AUDIENCES.map(({ href, who, session, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full items-center gap-5 rounded-2xl border border-white/10 bg-navy/70 p-6 text-left transition-[border-color,background-color,transform] duration-500 hover:-translate-y-1 hover:border-green-bright/60 hover:bg-navy md:p-8"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-green/15 text-green-bright transition-colors duration-500 group-hover:bg-green-bright group-hover:text-navy-dark md:size-16">
                  <Icon aria-hidden="true" className="size-7" strokeWidth={1.5} />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-xl font-bold leading-tight tracking-[-0.02em] md:text-2xl">
                    {who}
                  </span>
                  <span className="mt-2 block text-sm leading-snug text-gray-text md:text-base">{session}</span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-6 shrink-0 text-gray-muted transition-[color,transform] duration-500 group-hover:translate-x-1 group-hover:text-green-bright"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <footer className="relative flex justify-center pb-8">
        <Image
          src={LOGOS.alcaldia.src}
          alt={LOGOS.alcaldia.alt}
          width={LOGOS.alcaldia.width}
          height={LOGOS.alcaldia.height}
          className="h-auto w-36 opacity-85 sm:w-44"
        />
      </footer>
    </main>
  );
}
