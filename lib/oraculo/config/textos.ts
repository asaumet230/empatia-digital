import { Backpack, GraduationCap, House, type LucideIcon } from "lucide-react";
import { LIMITS } from "@/lib/oraculo/config/limites";
import type { Profile } from "@/lib/oraculo/tipos";

/* ------------------------------------------------------------------ */
/*  Every word the Oráculo screens show, in one place. The welcome     */
/*  messages are fixed text, not AI: they are never sent to the model. */
/* ------------------------------------------------------------------ */

export interface ProfileOption {
  label: string;
  icon: LucideIcon;
  /** Oráculo message right after the person says who they are, shown by the interface. */
  welcome: string;
}

export const PROFILE_OPTIONS: Record<Profile, ProfileOption> = {
  estudiante: {
    label: "Soy estudiante",
    icon: Backpack,
    welcome:
      "Gracias por contarme. Aquí puedes hablar de lo que pasa con tus compañeros, en el colegio o en redes, a tu ritmo y sin decir nombres. ¿Qué te gustaría contarme?",
  },
  docente: {
    label: "Soy docente",
    icon: GraduationCap,
    welcome:
      "Gracias. Te oriento para manejar una situación de convivencia con tus estudiantes. Cuéntame qué pasó y qué te preocupa, sin nombres de estudiantes.",
  },
  familia: {
    label: "Soy padre, madre o cuidador",
    icon: House,
    welcome:
      "Gracias. Te oriento para acompañar a tu hijo o hija en temas de convivencia, acoso y redes. Cuéntame qué está pasando, sin nombres.",
  },
};

export const ORACLE_TEXT = {
  name: "Oráculo",
  brand: "EmpatIA Digital",
  back: "Volver a EmpatIA",
  /** Loading screen: a warm hello first, then what is happening. */
  loading: { title: "Me alegra que hayas venido", text: "Cargando…" },

  /** `hover` replaces the label (or `short`, on phones) while the pointer or a finger is on the button. */
  launcher: { label: "¿Necesitas hablar?", hover: "Hablemos, te escucho", short: "Oráculo" },

  /** Opening of the chat, before a session exists: the Oráculo asks who is talking. */
  intro: {
    greeting:
      "Hola, soy el Oráculo: una inteligencia artificial que escucha y orienta sobre convivencia escolar, acoso y ciberacoso. No pido tu nombre ni guardo la conversación.",
    question: "Antes de empezar, cuéntame: ¿quién eres?",
    choices: "¿Quién eres?",
    hint: "Elige una opción para empezar.",
    change: "Cambiar",
  },

  consent: {
    title: "Antes de empezar",
    back: "Volver",
    items: {
      estudiante: [
        "Hablo con una inteligencia artificial, no con una persona. Nadie está leyendo en tiempo real.",
        "Mis mensajes se envían a OpenAI para que el Oráculo pueda responder. EmpatIA Digital no los guarda.",
        "No debo escribir nombres, colegios ni datos personales.",
        "El Oráculo orienta, pero no reemplaza a mi familia, a mis profesores ni a un orientador.",
        "Si estoy en peligro, llamo al 123 o al 141.",
      ],
      adulto: [
        "Hablo con una inteligencia artificial, no con una persona. Nadie está leyendo en tiempo real.",
        "Mis mensajes se envían a OpenAI para que el Oráculo pueda responder. EmpatIA Digital no los guarda.",
        "No debo escribir nombres de niños, niñas o adolescentes, ni otros datos personales.",
        "El Oráculo orienta, pero no reemplaza al orientador, al comité de convivencia ni a las autoridades.",
        "Si un niño, niña o adolescente está en peligro, llamo al 123.",
      ],
    },
    studentNote: "Tu colegio y tu familia deben haber autorizado el uso de esta herramienta.",
    limits: `Cada conversación dura hasta ${LIMITS.maxSessionMinutes} minutos o ${LIMITS.maxUserMessages} mensajes. Al cerrar la pestaña se borra.`,
    check: "Entiendo y quiero empezar",
    privacy: "Política de privacidad y términos",
    start: "Empezar",
    starting: "Abriendo…",
  },

  chat: {
    you: "Tú",
    placeholder: "Escribe aquí…",
    inputLabel: "Tu mensaje",
    send: "Enviar",
    typing: "El Oráculo está escribiendo…",
    remaining: (n: number) => (n === 1 ? "Te queda 1 mensaje" : `Te quedan ${n} mensajes`),
    finish: "Finalizar",
    help: "Líneas de ayuda",
    retry: "Reintentar",
    tooLong: (max: number) => `Máximo ${max} caracteres.`,
  },

  finish: {
    title: "¿Finalizar la conversación?",
    text: "Verás un resumen para copiar o imprimir. Después, la conversación se borra de esta pantalla.",
    confirm: "Sí, finalizar",
    cancel: "Seguir hablando",
    working: "Preparando el resumen…",
  },

  limit: {
    mensajes: `Llegaste al límite de ${LIMITS.maxUserMessages} mensajes de esta conversación.`,
    tiempo: `Pasaron los ${LIMITS.maxSessionMinutes} minutos de esta conversación.`,
    next: "Puedes ver el resumen o empezar una nueva.",
  },

  locked: {
    title: "La conversación se pausó",
    text: "Lo más importante ahora es que estés a salvo. Usa los botones de arriba para pedir ayuda.",
  },

  closing: {
    title: "Resumen de la conversación",
    note: "Sin nombres ni datos personales. No es un diagnóstico.",
    empty: "No escribiste mensajes en esta conversación.",
    failed: "No se pudo preparar el resumen, pero puedes empezar una nueva conversación.",
    lockedTitle: "Busca ayuda ahora",
    copy: "Copiar",
    print: "Imprimir",
    restart: "Nueva conversación",
    helpTitle: "Si lo necesitas, aquí tienes ayuda",
  },

  helpDialog: {
    title: "Líneas de ayuda",
    lead: "Toca un número para llamar. Son gratuitas.",
    close: "Cerrar",
  },

  errors: {
    ia_no_disponible: "El Oráculo no pudo responder. Intenta de nuevo en un momento.",
    sesion_invalida: "Esta conversación ya no es válida. Empieza una nueva.",
    mensaje_invalido: `El mensaje debe tener entre 1 y ${LIMITS.maxMessageChars} caracteres.`,
    sin_conexion: "No hay conexión a internet. Revisa tu conexión e intenta de nuevo.",
    error_interno: "Algo salió mal. Intenta de nuevo en un momento.",
  },
} as const;

export type ErrorCode = keyof typeof ORACLE_TEXT.errors;
