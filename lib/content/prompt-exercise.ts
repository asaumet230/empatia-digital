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
}

export interface PromptExercise {
  /** Prefijo único para animaciones compartidas (pestañas). */
  id: string;
  eyebrow: string;
  title: string;
  purpose: readonly { label: string; text: string }[];
  steps: readonly string[];
  variants: readonly PromptVariant[];
}
