"use client";

import { SendHorizontal } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { EmojiPicker } from "@/components/oraculo/EmojiPicker";
import { cn } from "@/lib/cn";
import { LIMITS } from "@/lib/oraculo/config/limites";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";

interface ComposerProps {
  disabled: boolean;
  /** The field itself is off (the Oráculo is still speaking); when it turns on, it takes the focus. */
  locked?: boolean;
  /** Resolves true when the message got through; on false the text comes back to the field. */
  onSend: (text: string) => Promise<boolean>;
}

const MAX = LIMITS.maxMessageChars;

/** Where the person writes. Enter sends, Shift+Enter adds a line. A failed send gives the text back. */
export function Composer({ disabled, locked = false, onSend }: ComposerProps) {
  const t = ORACLE_TEXT.chat;
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const counterId = useId();
  const clean = text.trim();
  const tooLong = clean.length > MAX;
  const canSend = !disabled && !locked && clean.length > 0 && !tooLong;

  useEffect(() => {
    if (!locked) ref.current?.focus();
  }, [locked]);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;
    // Cleared right away, like any chat; restored only if the send fails (unless they typed again)
    setText("");
    if (!(await onSend(clean))) setText((current) => current || clean);
    ref.current?.focus();
  };

  /** Puts the emoji where the cursor is and leaves the cursor right after it. */
  const insert = (emoji: string) => {
    const field = ref.current;
    const at = field?.selectionStart ?? text.length;
    const to = field?.selectionEnd ?? text.length;
    setText(text.slice(0, at) + emoji + text.slice(to));
    requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(at + emoji.length, at + emoji.length);
    });
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
      <div className="flex items-end gap-3">
        <label htmlFor={`${counterId}-input`} className="sr-only">
          {t.inputLabel}
        </label>
        {/* The emoji button sits inside the field, at its right end */}
        <div className="relative flex min-w-0 flex-1">
          <textarea
            id={`${counterId}-input`}
            ref={ref}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            disabled={locked}
            placeholder={locked ? t.typing : t.placeholder}
            aria-describedby={nearLimit ? counterId : undefined}
            aria-invalid={tooLong}
            // 16px text keeps iOS from zooming in; the field grows with the text up to a few lines.
            // `!` keeps the rounded corners when focused (the global focus ring sets its own radius) and
            // the ring close to the field, so it never touches the send button.
            className="field-sizing-content max-h-40 min-h-12 w-full resize-none rounded-3xl! outline-offset-2! border border-o-line bg-o-surface py-3 pl-4 pr-13 text-base leading-snug text-o-text placeholder:text-o-muted focus-visible:border-o-accent disabled:cursor-not-allowed disabled:bg-o-raised"
          />
          <EmojiPicker disabled={locked} onPick={insert} className="absolute bottom-1 right-1" />
        </div>
        <button
          type="submit"
          disabled={!canSend}
          aria-label={t.send}
          className="grid size-12 shrink-0 place-items-center rounded-full! bg-green-bright text-navy-dark transition-[filter,opacity] hover:brightness-105 disabled:opacity-40"
        >
          <SendHorizontal aria-hidden="true" className="size-5" strokeWidth={2.25} />
        </button>
      </div>
    </form>
  );
}
