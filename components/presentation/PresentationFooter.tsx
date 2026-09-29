import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LOGOS } from "@/lib/constants";
import { TRACKS, type TrackId } from "@/lib/sections";

/**
 * End of every presentation: back to the home page (to switch sessions) or straight to
 * the other audience. Not a slide, so it stays out of the progress navigation.
 */
export function PresentationFooter({ track }: { track: TrackId }) {
  const other = (Object.keys(TRACKS) as TrackId[]).find((t) => t !== track);

  return (
    <footer className="relative border-t border-line bg-navy-deep">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14 text-center sm:px-10 md:py-16">
        <p className="hud-label">Fin de la sesión · {TRACKS[track].title}</p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full bg-green-bright px-7 py-4 text-base font-bold text-navy-dark transition-[filter] hover:brightness-110 md:text-lg"
          >
            <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={2} />
            Volver al inicio
          </Link>
          {other && (
            <Link
              href={`/${other}`}
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-base font-semibold text-gray-light transition-colors hover:border-green-bright hover:text-white md:text-lg"
            >
              Ir a la sesión de {TRACKS[other].title.toLowerCase()}
              <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2} />
            </Link>
          )}
        </div>

        <Image
          src={LOGOS.alcaldia.src}
          alt={LOGOS.alcaldia.alt}
          width={LOGOS.alcaldia.width}
          height={LOGOS.alcaldia.height}
          className="h-auto w-36 opacity-70 sm:w-40"
        />
      </div>
    </footer>
  );
}
