"use client";

import { Modal } from "@/components/oraculo/Modal";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";

/** Asks before ending, so nobody loses the conversation by a stray tap. */
export function FinishDialog({ open, onCancel, onConfirm }: { open: boolean; onCancel: () => void; onConfirm: () => void }) {
  const t = ORACLE_TEXT.finish;
  return (
    <Modal open={open} onClose={onCancel} labelledBy="finalizar-titulo">
      <div className="p-6">
        <h2 id="finalizar-titulo" className="font-display text-xl font-bold tracking-[-0.02em]">
          {t.title}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-o-muted">{t.text}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-o-line px-5 py-3 font-semibold hover:bg-o-raised"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-green-bright px-5 py-3 font-bold text-navy-dark hover:brightness-105"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </Modal>
  );
}
