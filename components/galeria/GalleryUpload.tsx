"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, ImageUp, RotateCcw, ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { SchoolPicker } from "@/components/galeria/SchoolPicker";
import { DURATION, EASE } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { School } from "@/lib/content/colegios";
import { UPLOAD_TEXT, type UploadErrorCode } from "@/lib/content/galeria";
import { IMAGE_TYPES } from "@/lib/galeria/imagen";
import { prepareImage, UploadError, uploadImage } from "@/lib/galeria/cliente";

const t = UPLOAD_TEXT;
const ACCEPT = Object.values(IMAGE_TYPES).join(",");

/**
 * How the bar fills: preparing the image is quick (up to 10 %), sending it to our server is
 * measured (up to 70 %), and then the server waits for Drive, which reports nothing: the bar
 * creeps towards 95 % so it never looks stuck, and jumps to 100 % when Drive answers.
 */
const STEP = { prepared: 0.1, sent: 0.7, waiting: 0.95 } as const;

/** One step on screen at a time: the drop box, the progress bar or the result. */
type Phase =
  | { kind: "idle" }
  | { kind: "working"; current: number; total: number; progress: number; preview: string }
  | { kind: "done"; uploaded: number; failed: UploadErrorCode | null; school: string };

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE.outQuart } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/** Pick the school, then drop or choose one or more images; a progress bar follows them to Drive. */
export function GalleryUpload() {
  const [school, setSchool] = useState<School | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [dragging, setDragging] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const creep = useRef(0);

  // Free the preview and the creeping timer when they are no longer needed
  useEffect(() => () => window.clearInterval(creep.current), []);
  const preview = phase.kind === "working" ? phase.preview : null;
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const progress = (value: number) =>
    setPhase((p) => (p.kind === "working" ? { ...p, progress: Math.max(p.progress, value) } : p));

  const waitForDrive = () => {
    window.clearInterval(creep.current);
    creep.current = window.setInterval(
      () =>
        setPhase((p) => (p.kind === "working" ? { ...p, progress: p.progress + (STEP.waiting - p.progress) * 0.08 } : p)),
      300,
    );
  };

  const send = async (files: readonly File[]) => {
    if (!school || files.length === 0) return;
    let uploaded = 0;
    let failed: UploadErrorCode | null = null;

    for (const [i, file] of files.entries()) {
      setPhase({ kind: "working", current: i + 1, total: files.length, progress: 0, preview: URL.createObjectURL(file) });
      try {
        const image = await prepareImage(file);
        progress(STEP.prepared);
        await uploadImage(school.dane, image, (sent) => {
          progress(STEP.prepared + sent * (STEP.sent - STEP.prepared));
          if (sent === 1) waitForDrive();
        });
        window.clearInterval(creep.current);
        progress(1);
        uploaded++;
        // Let the full bar show for a moment before the next step
        await new Promise((resolve) => setTimeout(resolve, 400));
      } catch (error) {
        window.clearInterval(creep.current);
        failed = error instanceof UploadError ? error.code : "fallo";
      }
    }
    setPhase({ kind: "done", uploaded, failed, school: school.name });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void send([...e.dataTransfer.files]);
  };

  const locked = !school;

  return (
    <div className="space-y-6">
      {/* Changing school mid-upload would mix folders, so the picker waits for the result */}
      <div className={cn(phase.kind === "working" && "pointer-events-none opacity-60")}>
        <SchoolPicker value={school} onChange={setSchool} />
      </div>

      <input
        ref={picker}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        onChange={(e) => {
          void send([...(e.target.files ?? [])]);
          e.target.value = "";
        }}
      />

      <AnimatePresence mode="wait" initial={false}>
        {phase.kind === "idle" && (
          <motion.div key="idle" {...fade} className="space-y-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                if (!locked) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={locked ? (e) => e.preventDefault() : onDrop}
              className={cn(
                "flex flex-col items-center rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-colors md:py-14",
                locked
                  ? "border-white/10 bg-white/[0.02] opacity-60"
                  : dragging
                    ? "border-green-bright bg-green-bright/10"
                    : "border-green-bright/40 bg-green-bright/[0.04]",
              )}
            >
              <span
                className={cn(
                  "grid size-16 place-items-center rounded-full",
                  locked ? "bg-white/5 text-gray-text" : "bg-green-bright/15 text-green-bright",
                )}
              >
                <ImageUp aria-hidden="true" className="size-8" strokeWidth={1.75} />
              </span>
              <p className="mt-4 font-display text-xl font-bold">{locked ? t.drop.locked : t.drop.title}</p>
              {!locked && <p className="mt-1 text-sm text-gray-text">{t.drop.or}</p>}
              <button
                type="button"
                disabled={locked}
                onClick={() => picker.current?.click()}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-bright px-6 py-3 font-bold text-navy-dark transition-[filter,opacity] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ImageUp aria-hidden="true" className="size-5" />
                {t.drop.button}
              </button>
              <p className="mt-3 text-xs text-gray-text">{t.drop.hint}</p>
            </div>

            <p className="flex items-start gap-2.5 rounded-2xl border border-yellow/30 bg-yellow/[0.05] px-4 py-3 text-sm text-gray-light">
              <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-yellow" />
              {t.rule}
            </p>
          </motion.div>
        )}

        {phase.kind === "working" && (
          <motion.div
            key="working"
            {...fade}
            role="status"
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-navy/70 p-5"
          >
            {/* A local preview of the picked file; next/image cannot optimize object URLs */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={phase.preview} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline justify-between gap-3 font-display font-bold">
                <span>{phase.total > 1 ? t.status.uploadingMany(phase.current, phase.total) : t.status.uploading}</span>
                <span className="font-mono text-sm text-green-bright">{Math.round(phase.progress * 100)} %</span>
              </p>
              <div
                role="progressbar"
                aria-label={t.status.uploading}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(phase.progress * 100)}
                className="mt-3 h-3 overflow-hidden rounded-full bg-white/10"
              >
                <div
                  className="h-full rounded-full bg-green-bright transition-[width] duration-300 ease-out"
                  style={{ width: `${phase.progress * 100}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-text">{t.status.wait}</p>
            </div>
          </motion.div>
        )}

        {phase.kind === "done" && (
          <motion.div key="done" {...fade} aria-live="polite" className="space-y-4">
            {phase.uploaded > 0 && (
              <div className="flex items-center gap-4 rounded-3xl border border-green-bright/60 bg-green-bright/10 p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-green-bright text-navy-dark">
                  <CircleCheck aria-hidden="true" className="size-7" strokeWidth={2.5} />
                </span>
                <span>
                  <span className="block font-display text-xl font-bold text-green-bright">
                    {t.status.done(phase.uploaded)}
                  </span>
                  <span className="mt-1 block text-sm text-gray-light">{t.status.doneIn(phase.school)}</span>
                </span>
              </div>
            )}
            {phase.failed && (
              <div className="flex items-center gap-4 rounded-3xl border border-yellow/50 bg-yellow/[0.06] p-5">
                <CircleAlert aria-hidden="true" className="size-7 shrink-0 text-yellow" />
                <span className="font-semibold text-yellow">{t.errors[phase.failed]}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setPhase({ kind: "idle" })}
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-yellow px-6 py-4 font-display text-lg font-bold text-navy-dark shadow-lg shadow-yellow/20 transition-[filter,transform] hover:brightness-105 active:scale-[0.98]"
            >
              {phase.uploaded > 0 ? (
                <ImageUp aria-hidden="true" className="size-6" strokeWidth={2.25} />
              ) : (
                <RotateCcw aria-hidden="true" className="size-6" strokeWidth={2.25} />
              )}
              {phase.uploaded > 0 ? t.drop.another : t.drop.retry}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
