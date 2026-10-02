"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCheck, ExternalLink, X } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { DURATION, EASE, transition } from "@/lib/animations";
import { EVALUATION, EVALUATION_FORMS } from "@/lib/content/evaluacion";
import type { TrackId } from "@/lib/sections";

/**
 * Floating button, bottom-right: opens the pretest and postest of this audience, each with a QR
 * big enough to scan from the projected screen. Appears after the intro, like the rest of the chrome.
 */
export function EvaluationButton({ track, visible }: { track: TrackId; visible: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const forms = EVALUATION_FORMS[track];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          className="fixed bottom-3 right-3 z-50 flex flex-col items-end gap-3 sm:bottom-5 sm:right-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={transition(DURATION.slow, 0.2)}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                id="evaluacion-panel"
                role="dialog"
                aria-label={EVALUATION.title}
                className="w-[min(calc(100vw-1.5rem),34rem)] rounded-3xl border border-white/10 bg-navy-deep/95 p-4 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.7)] backdrop-blur-md sm:p-5"
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                transition={transition(DURATION.base, 0, EASE.outQuart)}
              >
                <ul className="grid gap-3 sm:grid-cols-2">
                  {EVALUATION.forms.map(({ key, name, when }) => (
                    <li key={key} className="flex flex-col rounded-2xl border border-white/10 bg-navy/70 p-4">
                      <p className="hud-label">{when}</p>
                      <p className="mt-1 font-display text-2xl font-bold tracking-[-0.02em]">{name}</p>
                      {/* On a phone the link is enough */}
                      <FormQr value={forms[key]} label={`Código QR del ${name.toLowerCase()}`} />
                      <span className="mt-3 break-all font-mono text-xs text-gray-muted">
                        {forms[key].replace(/^https?:\/\//, "")}
                      </span>
                      <a
                        href={forms[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-green-bright px-4 py-2.5 text-sm font-bold text-navy-dark transition-[filter] hover:brightness-110"
                      >
                        {EVALUATION.open}
                        <ExternalLink aria-hidden="true" className="size-4" strokeWidth={2} />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="evaluacion-panel"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-green-bright/50 bg-navy-deep/85 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] backdrop-blur-md transition-colors hover:border-green-bright"
          >
            {open ? (
              <X aria-hidden="true" className="size-4 text-green-bright" strokeWidth={2} />
            ) : (
              <ClipboardCheck aria-hidden="true" className="size-4 text-green-bright" strokeWidth={2} />
            )}
            {EVALUATION.button}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Client-side QR (the server one in `ui/QrCode` cannot live inside this client component). */
function FormQr({ value, label }: { value: string; label: string }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let alive = true;
    QRCode.toString(value, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0F1F2C", light: "#FFFFFF" },
    }).then((s) => alive && setSvg(s));
    return () => {
      alive = false;
    };
  }, [value]);

  return (
    <span
      role="img"
      aria-label={label}
      className="mt-4 hidden aspect-square w-full max-w-48 self-center overflow-hidden rounded-xl bg-white p-2 md:block [&>svg]:h-full [&>svg]:w-full"
      // Generated by the qrcode library from our own form links, never from user input
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
