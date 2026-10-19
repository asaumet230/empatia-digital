import type { HelpLineId } from "@/lib/oraculo/config/lineas";

/* ------------------------------------------------------------------ */
/*  Site-wide footer: legal pages, allies, contact and help lines.     */
/*  A link with `ready: false` is shown as "Próximamente" until its    */
/*  page exists, so the footer never leads to a missing page.          */
/* ------------------------------------------------------------------ */

export interface FooterLink {
  label: string;
  href: string;
  ready: boolean;
}

export interface FooterGroup {
  title: string;
  links: readonly FooterLink[];
}

export const SITE_FOOTER = {
  /** End of a presentation: links to the home page and the other sessions. */
  session: {
    label: "Cambiar de sesión",
    eyebrow: "Fin de la sesión",
    title: (track: string) => `Terminaste la sesión de ${track.toLowerCase()}`,
    question: "¿Quieres ver otra sesión?",
    homeSmall: "Volver al",
    home: "Inicio",
    otherSmall: "Sesión de",
  },
  about: "Capacitación de la Alcaldía de Barranquilla sobre convivencia y uso responsable de la inteligencia artificial.",
  groups: [
    {
      title: "EmpatIA Digital",
      links: [
        { label: "Política de privacidad", href: "/privacidad", ready: true },
        { label: "Términos y condiciones", href: "/terminos", ready: true },
      ],
    },
    {
      title: "Oráculo",
      links: [
        { label: "Política de privacidad", href: "/oraculo/privacidad", ready: true },
        { label: "Términos y condiciones", href: "/oraculo/terminos", ready: true },
        { label: "Autorización para padres", href: "/oraculo/autorizacion", ready: true },
      ],
    },
  ] satisfies readonly FooterGroup[],
  soon: "Próximamente",
  alliesTitle: "Aliados",
  allies: [
    { label: "Alcaldía de Barranquilla", href: "https://www.barranquilla.gov.co" },
    { label: "Fundación Por Una Sonrisa", href: "https://fporunasonrisa.com" },
  ],
  contactTitle: "Contacto",
  contactNote: "Consultas y reclamos sobre datos personales",
  instagram: { handle: "@fundacion.porunasonrisa", href: "https://www.instagram.com/fundacion.porunasonrisa" },
  helpTitle: "¿Necesitas ayuda ya?",
  /** The number comes from the Oráculo's help lines; `label` is the short name under it. */
  helpLines: [
    { id: "emergencias", label: "Emergencias" },
    { id: "icbf", label: "ICBF · Niñez" },
  ] satisfies readonly { id: HelpLineId; label: string }[],
  call: "Llamar al",
  project: "PazLab · EmpatIA Digital",
  disclaimer: "Contenido educativo - no reemplaza la orientación de un profesional. Los datos de ejemplo son ficticios.",
} as const;
