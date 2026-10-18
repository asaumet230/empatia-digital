import type { Metadata } from "next";
import Link from "next/link";
import { DraftNotice, LegalSections } from "@/components/oraculo/LegalText";
import { OracleHeader } from "@/components/oraculo/OracleHeader";
import { PrintButton } from "@/components/oraculo/PrintButton";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { LEGAL, PRIVACY_POLICY, TERMS } from "@/lib/oraculo/config/legal";

export const metadata: Metadata = {
  title: "Privacidad y términos · Oráculo",
  description: "Política de privacidad y términos de uso del Oráculo de EmpatIA Digital.",
};

/** For families, schools and anyone who wants to know what happens with the messages. */
export default function PrivacidadPage() {
  return (
    <div className="min-h-dvh">
      <OracleHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
        <DraftNotice />
        <h1 className="mt-6 font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em]">
          Política de privacidad y términos de uso
        </h1>
        <p className="mt-3 text-sm text-o-muted">
          Versión {LEGAL.version} · Actualizada el {LEGAL.updated}
        </p>

        <nav aria-label="En esta página" className="mt-6 flex flex-wrap gap-2 print:hidden">
          <a href="#privacidad" className="rounded-full border border-o-line px-4 py-2 text-sm font-semibold hover:bg-o-raised">
            Privacidad
          </a>
          <a href="#terminos" className="rounded-full border border-o-line px-4 py-2 text-sm font-semibold hover:bg-o-raised">
            Términos de uso
          </a>
          <Link
            href="/oraculo/autorizacion"
            className="rounded-full border border-o-line px-4 py-2 text-sm font-semibold hover:bg-o-raised"
          >
            Formato de autorización para padres
          </Link>
        </nav>

        <article className="mt-4">
          <h2 id="privacidad" className="mt-10 scroll-mt-20 font-display text-2xl font-bold tracking-[-0.02em]">
            Política de privacidad
          </h2>
          <LegalSections sections={PRIVACY_POLICY} />

          <h2 id="terminos" className="mt-14 scroll-mt-20 font-display text-2xl font-bold tracking-[-0.02em]">
            Términos de uso
          </h2>
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
