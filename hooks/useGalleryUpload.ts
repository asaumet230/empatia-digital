"use client";

import { useEffect, useRef, useState } from "react";
import type { School } from "@/lib/content/colegios";
import type { UploadErrorCode } from "@/lib/content/galeria";
import { prepareImage, UploadError, uploadImage } from "@/lib/galeria/cliente";

/**
 * How the bar fills: preparing the image is quick (up to 10 %), sending it to our server is
 * measured (up to 70 %), and then the server waits for Drive, which reports nothing: the bar
 * creeps towards 95 % so it never looks stuck, and jumps to 100 % when Drive answers.
 */
const STEP = { prepared: 0.1, sent: 0.7, waiting: 0.95 } as const;

/** One step on screen at a time: the drop box, the progress bar or the result. */
export type UploadPhase =
  | { kind: "idle" }
  | { kind: "working"; current: number; total: number; progress: number; preview: string }
  | { kind: "done"; uploaded: number; failed: UploadErrorCode | null; school: string };

/** Uploads the chosen images one after another to the school's folder, reporting progress. */
export function useGalleryUpload(school: School | null) {
  const [phase, setPhase] = useState<UploadPhase>({ kind: "idle" });
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

  const reset = () => setPhase({ kind: "idle" });

  return { phase, send, reset };
}
