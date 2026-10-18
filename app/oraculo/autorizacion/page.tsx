import type { Metadata } from "next";
import { OracleHeader } from "@/components/oraculo/OracleHeader";
import { PrintButton } from "@/components/oraculo/PrintButton";
import { QrCode } from "@/components/ui/QrCode";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { PUBLIC_SITE_URL } from "@/lib/constants";
import { AUTHORIZATION_FORM as F, CONTROLLERS, LEGAL } from "@/lib/oraculo/config/legal";

export const metadata: Metadata = {
  title: "Autorización para padres · Oráculo",
  description: "Formato de autorización de padres, madres o representantes legales para el uso del Oráculo.",
};

/** A blank line to fill in by hand. */
function Field({ label }: { label: string }) {
  return (
    <div>
      <div className="h-9 border-b border-o-text/40 print:h-6 print:border-black" />
      <p className="mt-1 text-xs text-o-muted print:text-black">{label}</p>
    </div>
  );
}

/** A box to tick by hand. */
function Box({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-semibold">
      <span aria-hidden="true" className="inline-block size-5 rounded border-2 border-o-text print:border-black" />
      {label}
    </span>
  );
}

function Title({ children }: { children: string }) {
  return <h2 className="font-display text-lg font-bold">{children}</h2>;
}

/**
 * Printable two-sheet form: the school prints it, parents fill it in and sign it by hand.
 * Sheet 1 is what to know (with QR codes to the full texts); sheet 2, the decision and signatures.
 */
export default function AutorizacionPage() {
  const sheet =
    "rounded-3xl border border-o-line bg-o-surface p-6 shadow-sm md:p-10 print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none";

  return (
    <div className="min-h-dvh print:bg-white print:text-black">
      <OracleHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14 print:max-w-none print:p-0 print:text-[9.5pt]">
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <p className="max-w-md text-sm text-o-muted">
            Imprímelo (2 hojas), entrégalo a las familias y guarda en el colegio las copias firmadas.
          </p>
          <PrintButton label="Imprimir formato" />
        </div>

        {/* Sheet 1 — what to know */}
        <article className={`mt-6 ${sheet}`}>
          <header className="border-b border-o-line pb-4 print:border-black print:pb-2">
            <p className="text-sm font-semibold">
              {CONTROLLERS.names} · {CONTROLLERS.ids} · EmpatIA Digital
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em]">{F.title}</h1>
            <p className="mt-1 text-o-muted print:text-black">{F.subtitle}</p>
          </header>

          <section className="mt-5 print:mt-3">
            <Title>{F.guardianTitle}</Title>
            <div className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2 print:grid-cols-2">
              {F.guardianFields.map((label) => (
                <Field key={label} label={label} />
              ))}
            </div>
          </section>

          <section className="mt-5 print:mt-3">
            <Title>{F.studentTitle}</Title>
            <div className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2 print:grid-cols-2">
              {F.studentFields.map((label) => (
                <Field key={label} label={label} />
              ))}
            </div>
            <p className="mt-2 text-xs text-o-muted print:text-black">{F.studentNote}</p>
          </section>

          <section className="mt-6 print:mt-3">
            <Title>{F.pointsTitle}</Title>
            <p className="mt-1 text-sm text-o-muted print:text-black">{F.intro}</p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-6 leading-snug print:mt-1.5 print:space-y-0.5">
              {F.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ol>
          </section>

          <section className="mt-6 break-inside-avoid print:mt-3">
            <p className="text-sm font-semibold">{F.qrTitle}</p>
            <div className="mt-3 flex flex-wrap gap-6">
              {F.qr.map(({ label, path }) => (
                <div key={path} className="flex items-center gap-3">
                  <QrCode value={`${PUBLIC_SITE_URL}${path}`} label={`Código QR: ${label}`} className="size-24 p-1 print:size-20" />
                  <span className="text-sm">
                    <span className="block font-semibold">{label}</span>
                    <span className="break-all text-xs text-o-muted print:text-black">
                      {PUBLIC_SITE_URL.replace(/^https?:\/\//, "")}
                      {path}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* Sheet 2 — decision and signatures, always on its own page when printed */}
        <article className={`mt-6 print:mt-0 print:break-before-page ${sheet}`}>
          <section>
            <Title>{F.decisionTitle}</Title>
            <p className="mt-2 font-semibold leading-relaxed">{F.grant}</p>
            <div className="mt-4 flex flex-wrap gap-8">
              {F.choice.map((option) => (
                <Box key={option} label={option} />
              ))}
            </div>
            <div className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2 print:grid-cols-2">
              {F.signatureFields.map((label) => (
                <Field key={label} label={label} />
              ))}
            </div>
          </section>

          <section className="mt-8 border-t border-o-line pt-5 print:border-black">
            <Title>{F.assent.title}</Title>
            <p className="mt-2 leading-relaxed">{F.assent.text}</p>
            <div className="mt-3 flex flex-wrap gap-6">
              {F.assent.options.map((option) => (
                <Box key={option} label={option} />
              ))}
            </div>
            <div className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 print:grid-cols-2">
              {F.assent.fields.map((label) => (
                <Field key={label} label={label} />
              ))}
            </div>
            <p className="mt-2 text-xs text-o-muted print:text-black">{F.assent.note}</p>
          </section>

          <section className="mt-8 border-t border-o-line pt-5 print:border-black">
            <Title>{F.school.title}</Title>
            <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 print:grid-cols-2">
              {F.school.fields.map((label) => (
                <Field key={label} label={label} />
              ))}
            </div>
            <p className="mt-2 text-xs text-o-muted print:text-black">{F.school.note}</p>
          </section>

          <footer className="mt-8 border-t border-o-line pt-4 text-xs text-o-muted print:border-black print:text-black">
            <p>{F.contact}</p>
            <p className="mt-1">
              {CONTROLLERS.ids} · {CONTROLLERS.address} · Versión {LEGAL.version}
            </p>
          </footer>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
