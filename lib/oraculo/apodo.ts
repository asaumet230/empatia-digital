import { AliasSchema, type Alias } from "@/lib/oraculo/tipos";

/* ------------------------------------------------------------------ */
/*  The optional nickname, from the person's answer ("llámame Lu",     */
/*  "Sol", "sigamos"). Read in the browser, never by the AI. Only      */
/*  letters and spaces get through, so nothing but a name can reach    */
/*  the prompt. Anything else means: carry on without one.             */
/* ------------------------------------------------------------------ */

/** Answers that mean "no nickname". */
const SKIP = new Set(["no", "nada", "ninguno", "ninguna", "sigamos", "sigue", "seguir", "paso", "prefiero no", "no gracias", "no quiero"]);

/** Lead-ins people use before the nickname. */
const LEAD_IN = /^(me puedes llamar|puedes llamarme|me puedes decir|puedes decirme|llamame|llámame|dime|me dicen|me llaman|me llamo|soy)\s+/i;

export function parseAlias(answer: string): Alias | null {
  const plain = answer
    .trim()
    .replace(/[^\p{L}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (SKIP.has(plain.toLowerCase())) return null;

  const name = plain.replace(LEAD_IN, "");
  const alias = name.charAt(0).toLocaleUpperCase("es") + name.slice(1);
  const parsed = AliasSchema.safeParse(alias);
  return parsed.success ? parsed.data : null;
}
