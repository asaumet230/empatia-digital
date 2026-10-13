import type { HelpLineId } from "@/lib/oraculo/config/lineas";
import type { Audience, SafetyKey } from "@/lib/oraculo/tipos";

/* ------------------------------------------------------------------ */
/*  Fixed safety messages. The AI never writes these: they are shown   */
/*  word for word when the risk layer stops or flags a conversation.   */
/*  DRAFT — they must be approved by the professionals designated by   */
/*  PazLab and Fundación Por Una Sonrisa before launch. Any change     */
/*  bumps `version`.                                                   */
/* ------------------------------------------------------------------ */

export interface SafetyMessage {
  title: string;
  /** Short paragraphs, in order. */
  body: readonly string[];
  /** What to do now, as a short checklist. */
  steps: readonly string[];
  /** Call buttons, most relevant first. */
  lines: readonly HelpLineId[];
}

/** Always true: this tool cannot alert anyone, and must never imply it did. */
const CANNOT_ALERT = "Este chat no puede avisarle a nadie ni llamar por ti.";

export const SAFETY_MESSAGES = {
  version: "2026-10-13.borrador",
  approved: false,
  messages: {
    peligro_inmediato: {
      estudiante: {
        title: "Tu seguridad es lo primero",
        body: [
          "Lo que cuentas suena a que tú u otra persona podrían estar en peligro ahora mismo.",
          `${CANNOT_ALERT} Por favor, llama ya al 123 o busca a un adulto que esté cerca.`,
        ],
        steps: [
          "Si puedes, aléjate del peligro.",
          "Busca a un adulto cerca de ti: un familiar, un vecino, un profesor.",
          "Llama al 123.",
        ],
        lines: ["emergencias", "icbf", "lineaVida"],
      },
      adulto: {
        title: "Puede ser una emergencia",
        body: [
          "Lo que describes podría ser un peligro inmediato para un niño, niña o adolescente.",
          `${CANNOT_ALERT} Llama al 123 ahora.`,
        ],
        steps: [
          "Llama al 123.",
          "Si es seguro hacerlo, quédate con el niño, niña o adolescente.",
          "Después, reporta el caso al ICBF en la línea 141.",
        ],
        lines: ["emergencias", "icbf"],
      },
    },
    autolesion: {
      estudiante: {
        title: "Gracias por contarlo",
        body: [
          "Lo que sientes importa, y no tienes que cargarlo solo o sola.",
          "Hay personas preparadas para escucharte ahora mismo, gratis y a cualquier hora.",
          `${CANNOT_ALERT} Llamar depende de ti, y es un paso valiente.`,
        ],
        steps: [
          "Llama a la Línea de la Vida o escríbele ahora a un adulto de confianza.",
          "Si sientes que puedes hacerte daño ya, llama al 123.",
          "No te quedes solo o sola: busca a alguien que te acompañe.",
        ],
        lines: ["lineaVida", "emergencias", "icbf"],
      },
      adulto: {
        title: "Necesita compañía y ayuda hoy",
        body: [
          "Una persona que habla de hacerse daño necesita compañía y ayuda profesional hoy, no después.",
          "Puedes seguir conversando conmigo para orientarte, pero busca ayuda primero.",
        ],
        steps: [
          "No lo dejes solo o sola.",
          "Pregúntale con calma cómo está. Hablar del tema no lo provoca.",
          "Si puedes, retira de su alcance medicamentos u objetos peligrosos.",
          "Llama a la Línea de la Vida para orientarte. Si hay riesgo inmediato, llama al 123.",
        ],
        lines: ["lineaVida", "emergencias"],
      },
    },
    abuso: {
      estudiante: {
        title: "No es tu culpa",
        body: [
          "Lo que cuentas es serio, y no es tu culpa.",
          "Nadie tiene derecho a tocarte, lastimarte o pedirte cosas que te hagan sentir mal.",
          `El ICBF puede protegerte: llama al 141, gratis y a cualquier hora. ${CANNOT_ALERT}`,
        ],
        steps: [
          "Cuéntale a un adulto en quien confíes: un familiar, un profesor o el orientador.",
          "Si la persona que te hace daño vive contigo o estás en peligro ahora, llama al 123.",
          "Si tienes mensajes o pruebas, guárdalas, pero no te pongas en riesgo para conseguirlas.",
        ],
        lines: ["icbf", "emergencias", "lineaVida"],
      },
      adulto: {
        title: "Cómo actuar ante una sospecha de abuso",
        body: [
          "Lo que hace el adulto en las primeras horas importa mucho.",
          "Puedes seguir conversando conmigo para orientarte, pero el reporte no puede esperar.",
        ],
        steps: [
          "Escucha con calma y créele. No lo interrogues ni le hagas repetir la historia.",
          "No le prometas guardar el secreto: dile que vas a buscar ayuda para protegerlo.",
          "No confrontes a la persona señalada.",
          "Reporta al ICBF en la línea 141. Si hay peligro hoy, llama al 123.",
          "Si hubo violencia sexual reciente, llévalo a urgencias: la atención es prioritaria y gratuita.",
        ],
        lines: ["icbf", "emergencias"],
      },
    },
    violencia: {
      estudiante: {
        title: "Nadie merece ser lastimado",
        body: [
          "Lo que cuentas puede ponerte en riesgo.",
          `Nadie merece ser golpeado ni amenazado. ${CANNOT_ALERT}`,
        ],
        steps: [
          "Si la amenaza es para hoy o estás en peligro, llama al 123.",
          "Cuéntale a un adulto de tu casa o del colegio lo que pasó.",
          "No respondas a las amenazas ni busques enfrentarte solo o sola.",
        ],
        lines: ["emergencias", "icbf"],
      },
      adulto: {
        title: "Protege primero",
        body: [
          "Lo que describes puede poner en riesgo a un niño, niña o adolescente.",
          "Puedes seguir conversando conmigo para orientarte.",
        ],
        steps: [
          "Si la amenaza es inminente, llama al 123.",
          "No lo dejes solo o sola mientras se resuelve.",
          "Reporta al ICBF en la línea 141. En el colegio, activa la ruta de convivencia.",
        ],
        lines: ["emergencias", "icbf"],
      },
    },
    extorsion: {
      estudiante: {
        title: "No estás solo o sola en esto",
        body: [
          "Si alguien te pide dinero, fotos o videos a cambio de no publicar algo, eso es un delito.",
          `La culpa es de esa persona, no tuya. ${CANNOT_ALERT}`,
        ],
        steps: [
          "No envíes nada más ni pagues.",
          "No borres los mensajes: toma capturas de pantalla.",
          "Después de guardar las pruebas, bloquea a la persona.",
          "Cuéntale a un adulto de confianza y llamen juntos al 165.",
        ],
        lines: ["gaula", "icbf", "emergencias"],
      },
      adulto: {
        title: "Es un delito, y tiene salida",
        body: [
          "Pedir dinero, fotos o videos a un menor bajo amenaza es un delito. El menor es la víctima.",
          "Puedes seguir conversando conmigo para orientarte.",
        ],
        steps: [
          "No paguen ni envíen nada.",
          "Guarden las pruebas: capturas, nombres de usuario y enlaces.",
          "No culpes al menor: necesita apoyo, no regaños.",
          "Llama al GAULA en la línea 165.",
        ],
        lines: ["gaula", "icbf", "emergencias"],
      },
    },
    acoso_grave: {
      estudiante: {
        title: "Esto no es una broma",
        body: [
          "Lo que vives no es una broma, y no es tu culpa.",
          `Cuando el acoso se repite o te deja sin salida, necesitas el apoyo de un adulto. ${CANNOT_ALERT}`,
        ],
        steps: [
          "Cuéntale al orientador, a un profesor o a un familiar.",
          "Guarda capturas de lo que pasa en redes o chats.",
          "Si sientes que no puedes más, llama a la Línea de la Vida.",
        ],
        lines: ["icbf", "lineaVida", "emergencias"],
      },
      adulto: {
        title: "El acoso persistente necesita acción",
        body: [
          "Cuando el acoso se repite, el daño crece. No es algo que se resuelva solo.",
          "Puedes seguir conversando conmigo para orientarte.",
        ],
        steps: [
          "Escucha sin minimizar ni culpar.",
          "Guarden capturas de lo que pasa en chats o redes.",
          "En el colegio, informa al orientador o al comité de convivencia.",
          "Si notas que piensa en hacerse daño, llama a la Línea de la Vida.",
        ],
        lines: ["icbf", "lineaVida"],
      },
    },
  },
} as const satisfies {
  version: string;
  approved: boolean;
  messages: Record<SafetyKey, Record<Audience, SafetyMessage>>;
};

export const safetyMessage = (key: SafetyKey, audience: Audience): SafetyMessage =>
  SAFETY_MESSAGES.messages[key][audience];
