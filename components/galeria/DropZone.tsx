"use client";

import { ImageUp, ShieldAlert } from "lucide-react";
import { useState, type DragEvent } from "react";
import { cn } from "@/lib/cn";
import { UPLOAD_TEXT as t } from "@/lib/content/galeria";

interface DropZoneProps {
  /** No school chosen yet: the box is greyed out and accepts nothing. */
  locked: boolean;
  onFiles: (files: File[]) => void;
  onPick: () => void;
}

/** The dashed box to drop images on (or open the file picker), with the rule about what to upload. */
export function DropZone({ locked, onFiles, onPick }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    onFiles([...e.dataTransfer.files]);
  };

  return (
    <>
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
            ? "border-white/10 bg-white/2 opacity-60"
            : dragging
              ? "border-green-bright bg-green-bright/10"
              : "border-green-bright/40 bg-green-bright/4",
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
          onClick={onPick}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-bright px-6 py-3 font-bold text-navy-dark transition-[filter,opacity] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ImageUp aria-hidden="true" className="size-5" />
          {t.drop.button}
        </button>
        <p className="mt-3 text-xs text-gray-text">{t.drop.hint}</p>
      </div>

      <p className="flex items-start gap-2.5 rounded-2xl border border-yellow/30 bg-yellow/5 px-4 py-3 text-sm text-gray-light">
        <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-yellow" />
        {t.rule}
      </p>
    </>
  );
}
