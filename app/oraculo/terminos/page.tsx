import type { Metadata } from "next";
import Link from "next/link";
import { DraftNotice, LegalSections } from "@/components/oraculo/LegalText";
import { OracleHeader } from "@/components/oraculo/OracleHeader";
import { PrintButton } from "@/components/oraculo/PrintButton";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { LEGAL, TERMS } from "@/lib/oraculo/config/legal";

export const metadata: Metadata = {
  title: "Términos de uso · Oráculo",
  description: "Términos y condiciones de uso del Oráculo de EmpatIA Digital.",
};

/** The Oráculo's terms of use, on their own page (the privacy policy is at /oraculo/privacidad). */
export default function TerminosPage() {
  return (
    <div className="min-h-dvh">
      <OracleHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
        <DraftNotice />
        <h1 className="mt-6 font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em]">
          Términos de uso
        </h1>
        <p className="mt-3 text-sm text-o-muted">
          Versión {LEGAL.version} · Actualizada el {LEGAL.updated}
        </p>

        <nav aria-label="Documentos del Oráculo" className="mt-6 flex flex-wrap gap-2 print:hidden">
          <Link
            href="/oraculo/privacidad"
            className="rounded-full border border-o-line px-4 py-2 text-sm font-semibold hover:bg-o-raised"
          >
            Política de privacidad
          </Link>
          <Link
            href="/oraculo/autorizacion"
            className="rounded-full border border-o-line px-4 py-2 text-sm font-semibold hover:bg-o-raised"
          >
            Formato de autorización para padres
          </Link>
        </nav>

        <article className="mt-4">
          <LegalSections sections={TERMS} />
        </article>

        <div className="mt-12">
          <PrintButton label="Imprimir" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
