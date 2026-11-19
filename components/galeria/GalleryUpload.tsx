"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { DropZone } from "@/components/galeria/DropZone";
import { SchoolPicker } from "@/components/galeria/SchoolPicker";
import { UploadProgress, UploadResult } from "@/components/galeria/UploadStatus";
import { useGalleryUpload } from "@/hooks/useGalleryUpload";
import { DURATION, EASE } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { School } from "@/lib/content/colegios";
import { IMAGE_TYPES } from "@/lib/galeria/imagen";

const ACCEPT = Object.values(IMAGE_TYPES).join(",");

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE.outQuart } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/** Pick the school, then drop or choose one or more images; a progress bar follows them to Drive. */
export function GalleryUpload() {
  const [school, setSchool] = useState<School | null>(null);
  const { phase, send, reset } = useGalleryUpload(school);
  const picker = useRef<HTMLInputElement>(null);

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
            <DropZone locked={!school} onFiles={(files) => void send(files)} onPick={() => picker.current?.click()} />
          </motion.div>
        )}

        {phase.kind === "working" && (
          <motion.div
            key="working"
            {...fade}
            role="status"
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-navy/70 p-5"
          >
            <UploadProgress phase={phase} />
          </motion.div>
        )}

        {phase.kind === "done" && (
          <motion.div key="done" {...fade} aria-live="polite" className="space-y-4">
            <UploadResult phase={phase} onAgain={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
