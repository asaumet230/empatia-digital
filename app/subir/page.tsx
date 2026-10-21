import type { Metadata } from "next";
import { GalleryUpload } from "@/components/galeria/GalleryUpload";
import { SessionSwitcher } from "@/components/presentation/SessionSwitcher";
import { BackButton } from "@/components/ui/BackButton";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { UPLOAD_TEXT } from "@/lib/content/galeria";

export const metadata: Metadata = {
  title: "Sube tu imagen · EmpatIA Digital",
  description: "Sube a la galería la imagen que creó tu equipo en Creadores de paz.",
};

/** Short address the students type on their phones to send their team's image to the gallery. */
export default function SubirPage() {
  return (
    <>
      <main className="min-h-svh bg-navy-dark">
        <SessionSwitcher />
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-24 sm:px-6">
          <BackButton href={UPLOAD_TEXT.back} />
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-green-bright">{UPLOAD_TEXT.eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,6vw,3.25rem)] font-extrabold leading-none tracking-[-0.04em]">
            {UPLOAD_TEXT.title}
          </h1>
          <p className="mt-4 text-lg leading-snug text-gray-text">{UPLOAD_TEXT.lead}</p>
          <div className="mt-8">
            <GalleryUpload />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
