"use client";

import { X } from "lucide-react";
import { HelpLineButton } from "@/components/oraculo/HelpLineButton";
import { Modal } from "@/components/oraculo/Modal";
import { HELP_LINES } from "@/lib/oraculo/config/lineas";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";

/** Every help line, reachable from any Oráculo screen. */
export function HelpDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = ORACLE_TEXT.helpDialog;
  return (
    <Modal open={open} onClose={onClose} labelledBy="ayuda-titulo">
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="ayuda-titulo" className="font-display text-lg font-bold tracking-[-0.02em]">
              {t.title}
            </h2>
            <p className="mt-1 text-sm text-o-muted">{t.lead}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="grid size-9 shrink-0 place-items-center rounded-full! border border-o-line hover:bg-o-raised"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="mt-4 grid gap-2">
          {Object.entries(HELP_LINES).map(([id, line], i) => (
            <HelpLineButton key={id} line={line} primary={i === 0} compact />
          ))}
        </div>
      </div>
    </Modal>
  );
}
