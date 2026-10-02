/**
 * Public address (QR codes, metadata). `SITE_URL` overrides it, e.g. for a custom domain.
 * While developing (`npm run dev`) it points to the local server.
 */
/** Published address, shown on the home page so attendees can type it even while presenting from localhost. */
export const PUBLIC_SITE_URL = "https://empatia-digital.vercel.app";
const DEFAULT_SITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : PUBLIC_SITE_URL;
export const SITE_URL = (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "");

export const BRAND = {
  name: "EmpatIA Digital",
  tagline: "Tecnología que conecta personas.",
  bootMessage: "Iniciando EmpatÍA Digital",
  cta: "Comenzar experiencia",
  scrollHint: "Desliza para comenzar",
} as const;

/** Files live in `public/assets/logos`. */
export const LOGOS = {
  alcaldia: {
    src: "/assets/logos/alcaldia-barranquilla-blanco.png",
    alt: "Alcaldía de Barranquilla",
    width: 354,
    height: 58,
  },
} as const;

export const COLORS = {
  navy: "#142738",
  navyDark: "#0F1F2C",
  green: "#249D4A",
  greenBright: "#35C95E",
  yellow: "#FFF200",
  white: "#FFFFFF",
  grayLight: "#F4F6F8",
  grayText: "#C9D1D9",
} as const;

export interface BootStep {
  id: "connect" | "analyze" | "activate";
  label: string;
}

/** The three boot states, shown in order under the progress bar. */
export const BOOT_STEPS: readonly BootStep[] = [
  { id: "connect", label: "Conectando personas" },
  { id: "analyze", label: "Analizando palabras" },
  { id: "activate", label: "Activando respeto" },
];
