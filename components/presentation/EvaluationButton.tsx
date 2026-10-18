"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCheck, ExternalLink, X } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { DURATION, transition } from "@/lib/animations";
import { EVALUATION, type EvaluationForms } from "@/lib/content/evaluacion";

/**
 * Floating button, bottom-right: opens the pretest and postest in a centered modal, each with a QR
 * big enough to scan from the projected screen. Appears after the intro, like the rest of the chrome.
 * Native <dialog>: Esc, the close button or a click on the backdrop close it.
 */
export function EvaluationButton({ forms, visible }: { forms: EvaluationForms; visible: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    dialog.current?.showModal();
    setOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed bottom-3 right-3 z-50 sm:bottom-5 sm:right-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={transition(DURATION.slow, 0.2)}
          >
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={EVALUATION.button}
              onClick={show}
              className="group inline-flex items-center gap-2.5 rounded-full border border-green-bright bg-navy-deep p-1.5 md:pr-5 text-sm font-bold text-white shadow-[0_14px_40px_-10px_rgb(0_0_0/0.85)] transition-colors duration-300 hover:bg-green hover:text-white"
            >
              <span className="grid size-8 place-items-center rounded-full bg-green-bright text-navy-dark transition-colors duration-300 group-hover:bg-white/15 group-hover:text-white">
                <ClipboardCheck aria-hidden="true" className="size-4" strokeWidth={2.25} />
              </span>
              {/* On a phone, only the icon: the text would cover the content */}
              <span className="hidden md:inline">{EVALUATION.button}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <dialog
        ref={dialog}
        aria-label={EVALUATION.title}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto w-[min(calc(100vw-2rem),40rem)] rounded-3xl border border-white/10 bg-navy-deep p-0 text-white shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <p className="font-display text-xl font-bold tracking-[-0.02em] sm:text-2xl">{EVALUATION.button}</p>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => dialog.current?.close()}
              className="grid size-9 shrink-0 place-items-center rounded-full text-gray-light transition-colors hover:bg-white/10 hover:text-white"
            >
              <X aria-hidden="true" className="size-5" strokeWidth={2} />
            </button>
          </div>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {EVALUATION.forms.map(({ key, name, when }) => (
              <li key={key} className="flex flex-col rounded-2xl border border-white/10 bg-navy/70 p-4">
                <p className="hud-label">{when}</p>
                <p className="mt-1 font-display text-2xl font-bold tracking-[-0.02em]">{name}</p>
                {/* On a phone the link is enough; the QR only renders while the modal is open */}
                {open && <FormQr value={forms[key]} label={`Código QR del ${name.toLowerCase()}`} />}
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
        </div>
      </dialog>
    </>
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
      className="mt-4 hidden aspect-square w-full max-w-52 self-center overflow-hidden rounded-xl bg-white p-2 md:block [&>svg]:h-full [&>svg]:w-full"
      // Generated by the qrcode library from our own form links, never from user input
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
