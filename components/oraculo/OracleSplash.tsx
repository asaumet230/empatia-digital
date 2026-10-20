import { OwlMascot } from "@/components/oraculo/OwlMascot";
import { ORACLE_TEXT } from "@/lib/oraculo/config/textos";

/** Loading screen: the owl waves hello and blinks while the Oráculo opens. */
export function OracleSplash() {
  return (
    <div role="status" className="grid min-h-dvh place-content-center justify-items-center gap-6 px-4">
      <OwlMascot className="size-40 sm:size-48" />
      <div className="text-center">
        <p className="font-display text-2xl font-bold tracking-[-0.02em]">{ORACLE_TEXT.loading.title}</p>
        <p className="mt-2 text-base text-o-muted">{ORACLE_TEXT.loading.text}</p>
      </div>
    </div>
  );
}
