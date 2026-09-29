"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Info, PlayCircle, X } from "lucide-react";
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
          className="inline-flex items-center gap-2 rounded-full border border-yellow/50 bg-yellow/[0.06] px-4 py-2 text-sm font-semibold text-yellow transition-colors hover:bg-yellow/15"
        >
          <PlayCircle aria-hidden="true" className="size-4" strokeWidth={2} />
          {guide.button}
        </button>
        {guide.link && (
          <a
            href={guide.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-gray-light transition-colors hover:border-white/50 hover:text-white"
          >
            <ExternalLink aria-hidden="true" className="size-4" strokeWidth={2} />
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
        className="m-auto w-[min(68rem,calc(100%-2rem))] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-2xl border border-white/15 bg-navy-dark p-0 text-white shadow-2xl backdrop:bg-navy-deep/85 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="p-5 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <h2 id="video-guide-title" className="font-display text-xl font-bold tracking-[-0.02em] md:text-2xl">
                {guide.title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-gray-light transition-colors hover:border-white/40 hover:text-white"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <div role="tablist" aria-label="Pasos" className="mt-5 flex flex-wrap gap-2">
              {guide.steps.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  role="tab"
                  aria-selected={i === step}
                  onClick={() => setStep(i)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    i === step
                      ? "bg-green-bright text-navy-dark"
                      : "border border-white/15 text-gray-text hover:text-white",
                  )}
                >
                  {s.label}
                </button>
              ))}
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
                  className="mt-4 w-full rounded-xl border border-white/10 bg-black"
                />
              </motion.div>
            </AnimatePresence>

            <p className="mt-4 flex items-start gap-2 text-sm text-gray-muted">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-green-bright" />
              {guide.note}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
