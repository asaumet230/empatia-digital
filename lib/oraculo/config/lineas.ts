/* ------------------------------------------------------------------ */
/*  Help lines shown as one-tap call buttons. The only place to edit   */
/*  them. Last checked against official sources on 2026-10-13:         */
/*  CONFIRM EACH ONE BY PHONE BEFORE LAUNCH.                           */
/* ------------------------------------------------------------------ */

export type HelpLineId = "emergencias" | "icbf" | "lineaVida" | "mujer" | "gaula";

export interface HelpLine {
  name: string;
  /** As people read and dial it. */
  number: string;
  /** `tel:` link, so a tap starts the call on a phone. */
  href: `tel:${string}`;
  /** One plain line on when to call. */
  when: string;
  hours: string;
}

export const HELP_LINES: Record<HelpLineId, HelpLine> = {
  emergencias: {
    name: "Emergencias",
    number: "123",
    href: "tel:123",
    when: "Si tú u otra persona están en peligro ahora mismo.",
    hours: "24 horas",
  },
  icbf: {
    name: "ICBF · Línea 141",
    number: "141",
    href: "tel:141",
    when: "Maltrato, abuso o cualquier riesgo para un niño, niña o adolescente.",
    hours: "24 horas · gratis",
  },
  lineaVida: {
    name: "Línea de la Vida · Barranquilla",
    number: "(605) 339 9999",
    href: "tel:+576053399999",
    when: "Si te sientes muy mal, piensas en hacerte daño o necesitas que te escuchen.",
    hours: "24 horas · gratis",
  },
  mujer: {
    name: "Línea 155",
    number: "155",
    href: "tel:155",
    when: "Orientación para mujeres y niñas víctimas de violencia.",
    hours: "24 horas · gratis",
  },
  gaula: {
    name: "GAULA · Línea 165",
    number: "165",
    href: "tel:165",
    when: "Si alguien te amenaza o te pide dinero o fotos a cambio de no publicar algo.",
    hours: "24 horas",
  },
};
