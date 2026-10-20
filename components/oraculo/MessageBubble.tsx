import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";
import type { Message } from "@/lib/oraculo/tipos";

/** The Oráculo side: the owl's face, like a profile picture, next to a teal-tinted bubble. */
function OracleSide({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start justify-start gap-2">
      <Image src="/assets/logos/oraculo.png" alt="" width={32} height={32} className="mt-1 size-8 shrink-0" />
      <div className="max-w-[85%] rounded-3xl rounded-tl-lg border border-o-bot-line bg-o-bot px-4 py-3 text-base leading-relaxed text-o-text shadow-sm sm:max-w-[75%] md:px-5">
        {children}
      </div>
    </div>
  );
}

/** One message. The Oráculo on the left, the person on the right; who speaks is also said in text. */
export function MessageBubble({ role, text, pending = false }: Message & { pending?: boolean }) {
  if (role === "oraculo") {
    return (
      <OracleSide>
        <p className="whitespace-pre-line">
          <span className="sr-only">{ORACLE_TEXT.name}: </span>
          {text}
        </p>
      </OracleSide>
    );
  }
  return (
    <div className="flex justify-end">
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-line rounded-3xl rounded-br-lg bg-o-user px-4 py-3 text-base leading-relaxed text-o-user-text sm:max-w-[75%] md:px-5",
          pending && "opacity-70",
        )}
      >
        <span className="sr-only">{ORACLE_TEXT.chat.you}: </span>
        {text}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <OracleSide>
      <span className="flex items-center gap-3 text-sm text-o-muted">
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
      </span>
    </OracleSide>
  );
}
