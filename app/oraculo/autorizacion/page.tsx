import type { Metadata } from "next";
import { DraftNotice, WithPending } from "@/components/oraculo/LegalText";
import { OracleHeader } from "@/components/oraculo/OracleHeader";
import { PrintButton } from "@/components/oraculo/PrintButton";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { AUTHORIZATION_FORM as F, CONTROLLERS, LEGAL } from "@/lib/oraculo/config/legal";

export const metadata: Metadata = {
  title: "Autorización para padres · Oráculo",
  description: "Formato de autorización de padres, madres o representantes legales para el uso del Oráculo.",
};

/** A blank line to fill in by hand. */
function Field({ label, wide = false }: { label: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <div className="h-9 border-b border-o-text/40 print:border-black" />
      <p className="mt-1 text-xs text-o-muted print:text-black">{label}</p>
    </div>
  );
}

/** Printable form: the school prints it, parents fill it in and sign it by hand. Nothing is typed online. */
export default function AutorizacionPage() {
  return (
    <div className="min-h-dvh print:bg-white print:text-black">
      <OracleHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14 print:max-w-none print:p-0 print:text-[11pt]">
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <p className="max-w-md text-sm text-o-muted">
            Imprímelo, entrégalo a las familias y guarda en el colegio las copias firmadas.
          </p>
          <PrintButton label="Imprimir formato" />
        </div>

        <div className="mt-6">
          <DraftNotice />
        </div>

        <article className="mt-6 rounded-3xl border border-o-line bg-o-surface p-6 shadow-sm md:p-10 print:mt-0 print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none">
          <header className="border-b border-o-line pb-4 print:border-black">
            <p className="text-sm font-semibold">{CONTROLLERS.names} · EmpatIA Digital</p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em]">{F.title}</h1>
            <p className="mt-1 text-o-muted print:text-black">{F.subtitle}</p>
          </header>

          <div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2 print:grid-cols-2">
            {F.guardianFields.map((label, i) => (
              <Field key={label} label={label} wide={i === 0} />
            ))}
          </div>

          <p className="mt-6 leading-relaxed">{F.intro}</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-6 leading-relaxed">
            {F.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ol>

          {/* The consent, the choice and the signature stay on the same sheet */}
          <div className="break-inside-avoid">
            <p className="mt-5 font-semibold leading-relaxed">{F.grant}</p>

            <div className="mt-4 flex flex-wrap gap-8">
              {F.choice.map((option) => (
                <span key={option} className="inline-flex items-center gap-2 font-semibold">
                  <span aria-hidden="true" className="inline-block size-5 rounded border-2 border-o-text print:border-black" />
                  {option}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 print:grid-cols-2">
              {F.signatureFields.map((label) => (
                <Field key={label} label={label} />
              ))}
            </div>
          </div>

          <section className="mt-8 border-t border-o-line pt-5 print:border-black">
            <h2 className="font-display text-lg font-bold">{F.assent.title}</h2>
            <p className="mt-2 leading-relaxed">{F.assent.text}</p>
            <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2 print:grid-cols-2">
              {F.assent.fields.map((label) => (
                <Field key={label} label={label} />
              ))}
            </div>
          </section>

          <section className="mt-8 border-t border-o-line pt-5 print:border-black">
            <h2 className="font-display text-lg font-bold">{F.school.title}</h2>
            <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-3 print:grid-cols-3">
              {F.school.fields.map((label) => (
                <Field key={label} label={label} />
              ))}
            </div>
          </section>

          <footer className="mt-8 border-t border-o-line pt-4 text-xs text-o-muted print:border-black print:text-black">
            <p>{F.contact}</p>
            <p className="mt-1">
              <WithPending text={`${CONTROLLERS.ids} · ${CONTROLLERS.address}`} />
            </p>
            <p className="mt-1">Versión {LEGAL.version}</p>
          </footer>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
