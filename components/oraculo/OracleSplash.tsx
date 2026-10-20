import { OwlMascot } from "@/components/oraculo/OwlMascot";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";

/** Loading screen: the owl waves hello and blinks while the Oráculo opens (or, with other texts, while it works). */
export function OracleSplash({
  title = ORACLE_TEXT.loading.title,
  text = ORACLE_TEXT.loading.text,
  className = "",
}: {
  title?: string;
  text?: string;
  className?: string;
}) {
  return (
    <div role="status" className={`grid min-h-dvh place-content-center justify-items-center gap-6 px-4 ${className}`}>
      <OwlMascot className="size-40 sm:size-48" />
      <div className="text-center">
        <p className="font-display text-2xl font-bold tracking-[-0.02em]">{title}</p>
        <p className="mt-2 text-lg font-bold text-o-accent sm:text-xl">{text}</p>
      </div>
    </div>
  );
}
