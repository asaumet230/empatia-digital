"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Info, PlayCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DURATION, transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { VideoGuide as Guide } from "@/lib/content/prompt-exercise";

/**
 * A button that opens a step-by-step video guide in a native modal <dialog>
 * (focus trap and Esc for free). Keys pressed inside never reach the slide navigation.
 */
export function VideoGuide({ guide }: { guide: Guide }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const current = guide.steps[step];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    // The page behind stays still while the guide is open
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => void (document.documentElement.style.overflow = "");
  }, [open]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setOpen(true);
          }}
          className="group inline-flex h-12 items-center gap-3 rounded-xl border border-yellow/50 bg-yellow/10 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-yellow transition-colors hover:border-yellow hover:bg-yellow hover:text-navy-dark"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-yellow/15 transition-colors group-hover:bg-navy-dark/15">
            <PlayCircle aria-hidden="true" className="size-5" strokeWidth={2} />
          </span>
          {guide.button}
        </button>
        {guide.link && (
          <a
            href={guide.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-12 items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] py-1.5 pr-4 pl-1.5 text-sm font-semibold text-gray-light transition-colors hover:border-green-bright hover:bg-green-bright/10 hover:text-green-bright"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] transition-colors group-hover:bg-green-bright/15">
              <ExternalLink aria-hidden="true" className="size-5" strokeWidth={2} />
            </span>
            {guide.link.label}
          </a>
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="video-guide-title"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        onKeyDown={(e) => e.stopPropagation()}
        className="m-auto w-[min(calc(100vw-1.5rem),64rem)] max-h-[min(92svh,60rem)] overflow-y-auto rounded-3xl border border-white/10 bg-navy-deep p-0 text-white shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
              <h2 id="video-guide-title" className="font-display text-lg font-bold tracking-[-0.02em] sm:text-2xl">
                {guide.title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="grid size-10 shrink-0 place-items-center rounded-full text-gray-light transition-colors hover:bg-white/10 hover:text-white"
              >
                <X aria-hidden="true" className="size-5" strokeWidth={2} />
              </button>
            </div>

            <div className="px-5 py-6 sm:px-8">
              {/* Steps as a segmented control, like the prompt tabs */}
              <div role="tablist" aria-label="Pasos" className="grid gap-3 sm:grid-cols-2">
                {/* Each step as a card: a big number, "Paso N" and what you do, so it reads at a glance */}
                {guide.steps.map((s, i) => {
                  const on = i === step;
                  const done = i < step;
                  const [, title = s.label] = s.label.split(" · ");
                  return (
                    <button
                      key={s.src}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setStep(i)}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border p-3 text-left transition-colors sm:p-4",
                        on
                          ? "border-green-bright bg-green-bright/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/30",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-full font-display text-lg font-bold",
                          on ? "bg-green-bright text-navy-dark" : "border border-white/20 text-gray-light",
                        )}
                      >
                        {done ? <Check aria-hidden="true" className="size-5" strokeWidth={2.5} /> : i + 1}
                      </span>
                      <span>
                        <span
                          className={cn(
                            "block text-xs font-semibold uppercase tracking-[0.12em]",
                            on ? "text-green-bright" : "text-gray-text",
                          )}
                        >
                          Paso {i + 1} de {guide.steps.length}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block text-base font-semibold md:text-lg",
                            on ? "text-white" : "text-gray-light",
                          )}
                        >
                          {title}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.src}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={transition(DURATION.fast)}
                >
                  <p className="mt-4 max-w-3xl text-base leading-snug text-gray-light md:text-lg">{current.text}</p>
                  <video
                    src={current.src}
                    poster={current.poster}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="mt-4 max-h-[55svh] w-full rounded-2xl border border-white/10 bg-black object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <p className="flex max-w-xl items-start gap-2 text-sm text-gray-text">
                  <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-green-bright" />
                  {guide.note}
                </p>
                {/* Plain next/back, so nobody has to guess where to click */}
                {step < guide.steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-green-bright/50 bg-green-bright/10 px-5 text-sm font-semibold text-green-bright transition-colors hover:bg-green-bright hover:text-navy-dark"
                  >
                    Ir al paso {step + 2}
                    <ArrowRight aria-hidden="true" className="size-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-gray-light transition-colors hover:border-white/40 hover:text-white"
                  >
                    <ArrowLeft aria-hidden="true" className="size-5" />
                    Volver al paso {step}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
