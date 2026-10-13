"use client";

import { SendHorizontal } from "lucide-react";
import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { LIMITS } from "@/lib/oraculo/config/limites";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";

interface ComposerProps {
  disabled: boolean;
  /** Resolves true when the message got through; only then the text is cleared. */
  onSend: (text: string) => Promise<boolean>;
}

const MAX = LIMITS.maxMessageChars;

/** Where the person writes. Enter sends, Shift+Enter adds a line. A failed send keeps the text. */
export function Composer({ disabled, onSend }: ComposerProps) {
  const t = ORACLE_TEXT.chat;
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const counterId = useId();
  const clean = text.trim();
  const tooLong = clean.length > MAX;
  const canSend = !disabled && clean.length > 0 && !tooLong;

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;
    if (await onSend(clean)) setText("");
    ref.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void submit();
    }
  };

  const nearLimit = clean.length >= MAX * 0.8;

  return (
    <form onSubmit={submit}>
      {nearLimit && (
        <p id={counterId} className={cn("px-4 pb-1 text-xs", tooLong ? "text-o-alert" : "text-o-muted")}>
          {tooLong ? t.tooLong(MAX) : `${clean.length}/${MAX}`}
        </p>
      )}
      <div className="flex items-end gap-2">
        <label htmlFor={`${counterId}-input`} className="sr-only">
          {t.inputLabel}
        </label>
        <textarea
          id={`${counterId}-input`}
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={t.placeholder}
          aria-describedby={nearLimit ? counterId : undefined}
          aria-invalid={tooLong}
          // 16px text keeps iOS from zooming in; the field grows with the text up to a few lines
          className="field-sizing-content max-h-40 min-h-12 flex-1 resize-none rounded-3xl border border-o-line bg-o-surface px-4 py-3 text-base leading-snug text-o-text placeholder:text-o-muted focus-visible:border-o-accent"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label={t.send}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-green-bright text-navy-dark transition-[filter,opacity] hover:brightness-105 disabled:opacity-40"
        >
          <SendHorizontal aria-hidden="true" className="size-5" strokeWidth={2.25} />
        </button>
      </div>
    </form>
  );
}
