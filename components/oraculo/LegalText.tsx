import { TriangleAlert } from "lucide-react";
import { Fragment } from "react";
import { LEGAL, type LegalBlock, type LegalSection } from "@/lib/oraculo/config/legal";

/** Highlights "[Completar: …]" so missing data cannot go unnoticed. */
export function WithPending({ text }: { text: string }) {
  return text.split(/(\[Completar:[^\]]*\])/).map((part, i) =>
    part.startsWith("[Completar:") ? (
      <mark key={i} className="rounded bg-yellow px-1 text-navy-dark">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") {
    return (
      <p>
        <WithPending text={block} />
      </p>
    );
  }
  return (
    <ul className="list-disc space-y-1.5 pl-6 marker:text-o-accent">
      {block.list.map((item) => (
        <li key={item}>
          <WithPending text={item} />
        </li>
      ))}
    </ul>
  );
}

/** A legal document as plain sections: readable on a phone and printable. */
export function LegalSections({ sections }: { sections: readonly LegalSection[] }) {
  return sections.map((section) => (
    <section key={section.id} id={section.id} aria-labelledby={`${section.id}-titulo`} className="scroll-mt-20">
      <h3 id={`${section.id}-titulo`} className="mt-8 font-display text-lg font-bold tracking-[-0.02em]">
        {section.title}
      </h3>
      <div className="mt-3 space-y-3 text-base leading-relaxed">
        {section.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </section>
  ));
}

/** Shown until a lawyer approves the texts (`LEGAL.approved`). */
export function DraftNotice() {
  if (LEGAL.approved) return null;
  return (
    <p
      role="note"
      className="flex items-start gap-3 rounded-2xl border border-o-help/50 bg-o-help-soft px-4 py-3 text-sm font-semibold print:border-black"
    >
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-o-help" />
      {LEGAL.draftNotice}
    </p>
  );
}
