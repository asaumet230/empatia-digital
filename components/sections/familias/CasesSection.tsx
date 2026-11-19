"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, MousePointerClick } from "lucide-react";
import { useRef, useState } from "react";
import { Section } from "@/components/presentation/Section";
import { CaseDetail } from "@/components/sections/familias/casos/CaseDetail";
import { CaseList } from "@/components/sections/familias/casos/CaseList";
import { RoleChoice } from "@/components/sections/familias/casos/RoleChoice";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SlideTitle } from "@/components/ui/SlideTitle";
import { fadeUp, staggerContainer, swap } from "@/lib/animations";
import { CASES_BLOCK, CHILDREN, FAMILY_CASES, SPEAKERS, type Child, type Speaker } from "@/lib/content/familias";
import type { SectionProps } from "@/types/presentation";

/**
 * "Elige tu caso" — ten role-play scenarios. Who speaks (mamá/papá/acudiente) and with whom
 * (hijo/hija) is chosen once and rewrites every prompt, so nobody has to edit text by hand.
 */
export function CasesSection({ id, index, label }: SectionProps) {
  const [speaker, setSpeaker] = useState<Speaker>(SPEAKERS[0]);
  const [child, setChild] = useState<Child>(CHILDREN[0]);
  const [selected, setSelected] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const open = (i: number) => {
    setSelected(i);
    // On narrow screens the detail sits below the grid: bring it into view
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  return (
    <Section id={id} label={label} className="flex items-center overflow-hidden bg-navy">
      <motion.div
        className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 md:px-16 lg:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer(0.06)}
        onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.div variants={fadeUp}>
              <Eyebrow index={index}>{label}</Eyebrow>
            </motion.div>
            <SlideTitle className="mt-5">{CASES_BLOCK.title}</SlideTitle>
          </div>
        </div>

        {/* Who is talking to whom: its own bar, so the choices never wrap into the title */}
        <motion.div
          variants={fadeUp}
          className="mt-6 grid gap-5 rounded-3xl border border-white/10 bg-white/3 p-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-8 md:p-5"
        >
          <RoleChoice step={1} label={CASES_BLOCK.speakerLabel} options={SPEAKERS} value={speaker} onChange={setSpeaker} />
          <RoleChoice step={2} label={CASES_BLOCK.childLabel} options={CHILDREN} value={child} onChange={setChild} />
        </motion.div>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:items-stretch lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
          <motion.div variants={fadeUp} className="min-w-0">
            <CaseList selected={selected} onOpen={open} />
          </motion.div>

          {/* The selected case, in three steps */}
          <motion.div ref={detailRef} variants={fadeUp} aria-live="polite" className="scroll-mt-6">
            <AnimatePresence mode="wait" initial={false}>
              {selected === null ? (
                <motion.div
                  key="empty"
                  {...swap}
                  className="grid h-full place-items-center rounded-3xl border border-dashed border-white/15 bg-white/2 p-8 text-center"
                >
                  <div className="flex max-w-sm flex-col items-center gap-4">
                    <span className="grid size-14 place-items-center rounded-2xl bg-green-bright/15 text-green-bright">
                      <MousePointerClick aria-hidden="true" className="size-7" strokeWidth={1.75} />
                    </span>
                    <p className="text-lg leading-snug text-gray-light">{CASES_BLOCK.hint}</p>
                    <p className="flex items-center gap-2 text-sm font-semibold text-green-bright">
                      <ArrowLeft aria-hidden="true" className="hidden size-4 lg:block" />
                      Toca uno de los 10 casos
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key={FAMILY_CASES[selected].id} {...swap}>
                  <CaseDetail number={selected + 1} c={FAMILY_CASES[selected]} speaker={speaker} child={child} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
