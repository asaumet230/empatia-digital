import { SCHOOLS_YEAR } from "@/lib/content/colegios";

/** What the server answers when an upload fails; each one has its message below. */
export type UploadErrorCode = "origen" | "colegio" | "tipo" | "tamano" | "no_configurada" | "fallo" | "sin_conexion";

/** Texts of the gallery upload (`/subir` and the button on the gallery slide). */
export const UPLOAD_TEXT = {
  path: "/subir",
  /** Where "Volver" goes: straight back to the gallery slide, without the intro. */
  back: "/estudiantes#paz-galeria",
  eyebrow: "Galería · Creadores de paz",
  title: "Sube tu imagen",
  lead: "Elige tu colegio y suelta aquí la imagen que creó tu equipo. Llega directo a la galería.",
  slideButton: "Subir imagen",

  school: {
    label: "¿De qué colegio eres?",
    placeholder: "Escribe el nombre, por ejemplo: José Martí",
    empty: "No encontramos ese colegio. Prueba con otra palabra del nombre.",
    pick: "Elige tu colegio de la lista para poder subir la imagen.",
    change: "Cambiar",
    source: `Colegios públicos de Barranquilla según el Ministerio de Educación (${SCHOOLS_YEAR}).`,
  },

  drop: {
    title: "Suelta aquí tu imagen",
    or: "o",
    button: "Elegir imagen",
    another: "Subir otra imagen",
    retry: "Intentar de nuevo",
    hint: "PNG, JPG o WEBP · hasta 15 MB",
    locked: "Primero elige tu colegio",
  },

  rule: "Sube solo la imagen que creó tu equipo con IA. No subas fotos de personas.",

  status: {
    uploading: "Subiendo tu imagen…",
    uploadingMany: (current: number, total: number) => `Subiendo imagen ${current} de ${total}…`,
    wait: "Puede tardar unos segundos. No cierres esta página.",
    done: (count: number) => (count === 1 ? "¡Imagen subida con éxito!" : `¡${count} imágenes subidas con éxito!`),
    doneIn: (school: string) => `Ya está en la galería de ${school}.`,
  },

  errors: {
    origen: "No se pudo subir desde esta página.",
    colegio: "Elige tu colegio de la lista.",
    tipo: "Ese archivo no es una imagen PNG, JPG o WEBP.",
    tamano: "La imagen es muy pesada. Prueba con una más pequeña.",
    no_configurada: "La galería todavía no está abierta. Pregúntale a tu profesor.",
    fallo: "No se pudo guardar la imagen. Inténtalo de nuevo.",
    sin_conexion: "Parece que no hay internet. Inténtalo de nuevo.",
  } satisfies Record<UploadErrorCode, string>,
} as const;
