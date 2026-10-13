import { cn } from "@/lib/cn";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";
import type { Message } from "@/lib/oraculo/tipos";

/** One message. The Oráculo on the left, the person on the right; who speaks is also said in text. */
export function MessageBubble({ role, text, pending = false }: Message & { pending?: boolean }) {
  const mine = role === "usuario";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-line rounded-3xl px-4 py-3 text-base leading-relaxed sm:max-w-[75%] md:px-5",
          mine
            ? "rounded-br-lg bg-o-user text-o-user-text"
            : "rounded-bl-lg border border-o-line bg-o-surface text-o-text shadow-sm",
          pending && "opacity-70",
        )}
      >
        <span className="sr-only">{mine ? ORACLE_TEXT.chat.you : ORACLE_TEXT.name}: </span>
        {text}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-3 rounded-3xl rounded-bl-lg border border-o-line bg-o-surface px-4 py-3 text-sm text-o-muted shadow-sm">
        <span aria-hidden="true" className="flex gap-1">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="size-1.5 animate-bounce rounded-full bg-o-muted"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
        {ORACLE_TEXT.chat.typing}
      </div>
    </div>
  );
}
