import { SessionSwitcher } from "@/components/presentation/SessionSwitcher";
import { SiteFooter } from "@/components/ui/SiteFooter";
import type { PolicyBlock, PolicySection } from "@/lib/content/privacidad";

function Block({ block }: { block: PolicyBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  return (
    <ul className="space-y-1.5">
      {block.list.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-green-bright" />
          {item}
        </li>
      ))}
    </ul>
  );
}

interface PolicyPageProps {
  title: string;
  version: string;
  updated: string;
  summary: readonly string[];
  sections: readonly PolicySection[];
}

/** A legal page of the site: a plain-language summary first, then the full text with a table of contents. */
export function PolicyPage({ title, version, updated, summary, sections }: PolicyPageProps) {
  return (
    <>
      <main className="min-h-svh bg-navy-dark">
        <SessionSwitcher />
        <div className="mx-auto max-w-3xl px-6 pb-16 pt-24 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-green-bright">EmpatIA Digital</p>
          <h1 className="mt-4 font-display text-[clamp(1.75rem,4.5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em]">
            {title}
          </h1>
          <p className="mt-3 text-sm text-gray-text">
            Versión {version} · Actualizada el {updated}
          </p>

          <section
            aria-labelledby="resumen"
            className="mt-8 rounded-3xl border border-green-bright/30 bg-green-bright/[0.06] p-5 md:p-6"
          >
            <h2 id="resumen" className="font-display text-lg font-bold">
              En pocas palabras
            </h2>
            <ul className="mt-3 space-y-2 text-base leading-relaxed text-gray-light">
              {summary.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-green-bright" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label="Contenido" className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-light">Contenido</p>
            <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-gray-text transition-colors hover:text-green-bright">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="mt-4">
            {sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-titulo`} className="scroll-mt-20">
                <h2 id={`${section.id}-titulo`} className="mt-10 font-display text-xl font-bold tracking-[-0.02em]">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-base leading-relaxed text-gray-light">
                  {section.blocks.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
