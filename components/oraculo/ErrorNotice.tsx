import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ORACLE_TEXT, type ErrorCode } from "@/lib/oraculo/config/textos";

/** A plain-language error, announced to screen readers, with an optional action. */
export function ErrorNotice({ code, action, className }: { code: ErrorCode; action?: ReactNode; className?: string }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-2xl border border-o-alert/40 bg-o-alert-soft px-4 py-3 text-sm font-medium",
        className,
      )}
    >
      <CircleAlert aria-hidden="true" className="size-5 shrink-0 text-o-alert" />
      <span className="flex-1">{ORACLE_TEXT.errors[code]}</span>
      {action}
    </div>
  );
}
