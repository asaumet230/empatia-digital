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
