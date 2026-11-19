import { CircleAlert, CircleCheck, ImageUp, RotateCcw } from "lucide-react";
import type { UploadPhase } from "@/hooks/useGalleryUpload";
import { UPLOAD_TEXT as t } from "@/lib/content/galeria";

/** While an image travels: its preview, which one of how many, and the progress bar. */
export function UploadProgress({ phase }: { phase: Extract<UploadPhase, { kind: "working" }> }) {
  const percent = Math.round(phase.progress * 100);

  return (
    <>
      {/* A local preview of the picked file; next/image cannot optimize object URLs */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={phase.preview} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline justify-between gap-3 font-display font-bold">
          <span>{phase.total > 1 ? t.status.uploadingMany(phase.current, phase.total) : t.status.uploading}</span>
          <span className="font-mono text-sm text-green-bright">{percent} %</span>
        </p>
        <div
          role="progressbar"
          aria-label={t.status.uploading}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="mt-3 h-3 overflow-hidden rounded-full bg-white/10"
        >
          <div
            className="h-full rounded-full bg-green-bright transition-[width] duration-300 ease-out"
            style={{ width: `${phase.progress * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-text">{t.status.wait}</p>
      </div>
    </>
  );
}

interface UploadResultProps {
  phase: Extract<UploadPhase, { kind: "done" }>;
  onAgain: () => void;
}

/** The outcome: how many images arrived and where, any error, and a button to upload more or retry. */
export function UploadResult({ phase, onAgain }: UploadResultProps) {
  const anyUploaded = phase.uploaded > 0;

  return (
    <>
      {anyUploaded && (
        <div className="flex items-center gap-4 rounded-3xl border border-green-bright/60 bg-green-bright/10 p-5">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-green-bright text-navy-dark">
            <CircleCheck aria-hidden="true" className="size-7" strokeWidth={2.5} />
          </span>
          <span>
            <span className="block font-display text-xl font-bold text-green-bright">{t.status.done(phase.uploaded)}</span>
            <span className="mt-1 block text-sm text-gray-light">{t.status.doneIn(phase.school)}</span>
          </span>
        </div>
      )}
      {phase.failed && (
        <div className="flex items-center gap-4 rounded-3xl border border-yellow/50 bg-yellow/6 p-5">
          <CircleAlert aria-hidden="true" className="size-7 shrink-0 text-yellow" />
          <span className="font-semibold text-yellow">{t.errors[phase.failed]}</span>
        </div>
      )}
      <button
        type="button"
        onClick={onAgain}
        className="flex w-full items-center justify-center gap-2.5 rounded-full bg-yellow px-6 py-4 font-display text-lg font-bold text-navy-dark shadow-lg shadow-yellow/20 transition-[filter,transform] hover:brightness-105 active:scale-[0.98]"
      >
        {anyUploaded ? (
          <ImageUp aria-hidden="true" className="size-6" strokeWidth={2.25} />
        ) : (
          <RotateCcw aria-hidden="true" className="size-6" strokeWidth={2.25} />
        )}
        {anyUploaded ? t.drop.another : t.drop.retry}
      </button>
    </>
  );
}
