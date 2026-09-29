/** Shape shared by every "copy this prompt" exercise (Ejemplo 1, Ejemplo 2…). */

export interface PromptVariant {
  id: string;
  /** Nombre de la pestaña. */
  label: string;
  /** Aclaración corta bajo los botones. */
  note: string;
  /** Exactamente lo que se copia. */
  text: string;
  /** Archivo opcional para descargar junto al prompt. */
  download?: { href: string; label: string };
  /** Videos opcionales con los pasos previos (p. ej. conectar Tally). */
  guide?: VideoGuide;
}

export interface VideoGuide {
  /** Texto del botón que abre la guía. */
  button: string;
  /** Enlace opcional junto al botón (p. ej. para crear la cuenta). */
  link?: { label: string; href: string };
  title: string;
  note: string;
  steps: readonly { label: string; text: string; src: string; poster: string }[];
}

export interface PromptExercise {
  /** Prefijo único para animaciones compartidas (pestañas). */
  id: string;
  eyebrow: string;
  title: string;
  purpose: readonly { label: string; text: string }[];
  steps: readonly string[];
  /** Aviso importante (p. ej. privacidad), visible junto a los botones. */
  notice?: string;
  variants: readonly PromptVariant[];
}
