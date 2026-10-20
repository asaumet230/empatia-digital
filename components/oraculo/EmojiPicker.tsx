"use client";

import { Smile } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/cn";
import { EMOJIS, ORACLE_TEXT } from "@/lib/oraculo/config/textos";

/**
 * A short set of feelings to add to a message, for when words are hard to find. It stays open
 * while picking, like a phone keyboard; a tap outside or Esc closes it.
 */
interface EmojiPickerProps {
  disabled: boolean;
  onPick: (emoji: string) => void;
  /** Where it sits; the panel opens upwards from its right edge. */
  className?: string;
}

export function EmojiPicker({ disabled, onPick, className }: EmojiPickerProps) {
  const t = ORACLE_TEXT.emojis;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  useDismiss(ref, open, () => setOpen(false));

  return (
    <div ref={ref} className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-label={t.open}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "grid size-10 place-items-center rounded-full! text-o-muted transition-colors hover:bg-o-raised hover:text-o-text disabled:cursor-not-allowed",
          open && "bg-o-raised text-o-text",
        )}
      >
        <Smile aria-hidden="true" className="size-6" />
      </button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={t.title}
          className="absolute bottom-full right-0 mb-3 w-[min(20rem,calc(100vw-2rem))] rounded-3xl border border-o-line bg-o-surface p-3 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.45)]"
        >
          <p className="px-1 pb-2 text-xs font-semibold text-o-muted">{t.title}</p>
          <div className="grid grid-cols-6 gap-1">
            {EMOJIS.map(({ emoji, label }) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onPick(emoji)}
                aria-label={label}
                title={label}
                className="grid aspect-square place-items-center rounded-xl! text-2xl transition-transform hover:scale-110 hover:bg-o-raised"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
