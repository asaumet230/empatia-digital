import { PUBLIC_SITE_URL } from "@/lib/constants";
import { HELP_LINES } from "@/lib/oraculo/config/lineas";
import { LIMITS } from "@/lib/oraculo/config/limites";

/* ------------------------------------------------------------------ */
/*  Legal texts of the Oráculo: privacy policy, terms of use and the   */
/*  parents' authorization form. DRAFT — written to follow Ley 1581   */
/*  de 2012 and Decreto 1377 de 2013 (compiled in Decreto 1074 de      */
/*  2015), but they must be reviewed and approved by a lawyer before   */
/*  launch. A `[Completar: …]` in a text marks missing data; the pages */
/*  highlight it. Any change bumps `version`.                          */
/* ------------------------------------------------------------------ */

export const CONTROLLERS = {
  names: "Fundación Por Una Sonrisa",
  phone: "+57 314 596 7994",
  email: "contacto@fporunasonrisa.com",
  ids: "NIT 900.804.571-1",
  address: "Calle 75 #57-38, Barranquilla, Atlántico, Colombia",
  representative: "Noris Osorio de Martínez",
} as const;

export const LEGAL = {
  version: "2026-10-18.borrador",
  updated: "18 de octubre de 2026",
  approved: false,
  draftNotice: "Borrador pendiente de revisión jurídica. No usar con estudiantes hasta su aprobación.",
  policyUrl: `${PUBLIC_SITE_URL}/oraculo/privacidad`,
} as const;

/** A paragraph, or a list of short points. */
export type LegalBlock = string | { list: readonly string[] };

export interface LegalSection {
  id: string;
  title: string;
  blocks: readonly LegalBlock[];
}

export const PRIVACY_POLICY: readonly LegalSection[] = [
  {
    id: "responsables",
    title: "1. Quién es el responsable",
    blocks: [
      `El Oráculo es una herramienta de EmpatIA Digital. El responsable del tratamiento de los datos es la ${CONTROLLERS.names}, que ejecuta y administra EmpatIA Digital en articulación con la Alcaldía Distrital de Barranquilla.`,
      {
        list: [
          `Identificación: ${CONTROLLERS.ids}.`,
          `Domicilio: ${CONTROLLERS.address}.`,
          `Representante legal: ${CONTROLLERS.representative}.`,
          `Teléfono y WhatsApp: ${CONTROLLERS.phone}.`,
          `Correo: ${CONTROLLERS.email}.`,
        ],
      },
    ],
  },
  {
    id: "que-es",
    title: "2. Qué es el Oráculo y qué no es",
    blocks: [
      "Es un chat con inteligencia artificial que escucha y orienta sobre convivencia escolar, acoso y ciberacoso, a estudiantes, docentes y familias.",
      "No es una persona, ni un servicio de psicología, salud, emergencias o atención legal. No reemplaza al orientador escolar, a la familia ni a las autoridades. Nadie lee las conversaciones en tiempo real.",
    ],
  },
  {
    id: "datos",
    title: "3. Qué datos se tratan",
    blocks: [
      {
        list: [
          "Los mensajes que la persona escribe y las respuestas del Oráculo, solo mientras dura la conversación.",
          "El perfil que elige al entrar: estudiante, docente o padre, madre o cuidador.",
          "Datos técnicos de la conexión, como la dirección IP y el tipo de navegador, que el proveedor de alojamiento procesa para la seguridad del sitio y para limitar el uso excesivo.",
        ],
      },
      "El Oráculo no pide nombre, documento, correo, teléfono, colegio ni dirección, y no requiere crear una cuenta. Se pide expresamente no escribir datos personales. No se usan cookies de seguimiento ni herramientas de analítica.",
      "Si la persona decide contar en sus mensajes información sensible (por ejemplo, sobre su salud o sobre situaciones de violencia), lo hace de forma voluntaria: nadie está obligado a entregar datos sensibles.",
    ],
  },
  {
    id: "finalidades",
    title: "4. Para qué se usan",
    blocks: [
      {
        list: [
          "Responder la conversación y orientar sobre convivencia escolar.",
          "Detectar posibles situaciones de riesgo y mostrar mensajes de seguridad y líneas de ayuda.",
          "Preparar el resumen de cierre que la persona puede copiar o imprimir.",
          "Proteger el servicio contra el abuso y controlar su costo.",
        ],
      },
    ],
  },
  {
    id: "no-hacemos",
    title: "5. Lo que no se hace con los datos",
    blocks: [
      {
        list: [
          "Las conversaciones no se guardan en ninguna base de datos del responsable.",
          "Los mensajes no se registran en los registros técnicos (logs) del servidor.",
          "No se venden ni se comparten con terceros, salvo el proveedor de inteligencia artificial descrito abajo.",
          "No se crean perfiles de las personas ni se usan con fines comerciales.",
          "El Oráculo no contacta, alerta ni avisa a nadie: no informa al colegio, a la familia ni a las autoridades.",
        ],
      },
    ],
  },
  {
    id: "recorrido",
    title: "6. Por dónde pasan los mensajes",
    blocks: [
      "Mientras la pestaña está abierta, la conversación se guarda solo en el navegador de la persona y se borra al cerrar la pestaña.",
      "Cada mensaje viaja cifrado (HTTPS) al servidor del sitio, alojado en Vercel, y de ahí a OpenAI, L.L.C., en Estados Unidos, que genera las respuestas como encargado del tratamiento. Esto es una transmisión internacional de datos, que se hace con base en la autorización descrita en esta política.",
      "Según sus políticas vigentes, OpenAI no usa los datos enviados por su API para entrenar sus modelos y puede conservarlos hasta 30 días para vigilar abusos, salvo que la ley le exija conservarlos más tiempo. Los responsables pueden solicitar a OpenAI la modalidad de retención cero; mientras no esté aprobada, aplica el plazo de 30 días.",
    ],
  },
  {
    id: "menores",
    title: "7. Niños, niñas y adolescentes",
    blocks: [
      "De acuerdo con el artículo 7 de la Ley 1581 de 2012, el tratamiento de datos de niños, niñas y adolescentes respeta su interés superior y sus derechos fundamentales.",
      {
        list: [
          "Los estudiantes solo pueden usar el Oráculo con la autorización previa de su padre, madre o representante legal, que recoge la institución educativa con el formato de autorización.",
          "Antes de empezar, el estudiante confirma que entiende cómo funciona la herramienta; su opinión se tiene en cuenta según su edad y madurez.",
          "El uso es voluntario y puede dejarse en cualquier momento.",
        ],
      },
    ],
  },
  {
    id: "seguridad",
    title: "8. Seguridad",
    blocks: [
      `Las comunicaciones van cifradas, cada sesión está firmada para que no pueda alterarse, y las conversaciones tienen un límite de ${LIMITS.maxUserMessages} mensajes o ${LIMITS.maxSessionMinutes} minutos. Ningún sistema es infalible, ni siquiera la detección de riesgo: por eso el Oráculo siempre recomienda acudir a un adulto de confianza.`,
    ],
  },
  {
    id: "derechos",
    title: "9. Derechos de los titulares",
    blocks: [
      "Según el artículo 8 de la Ley 1581 de 2012, el titular de los datos, o su representante legal si es menor de edad, puede:",
      {
        list: [
          "Conocer, actualizar y rectificar sus datos.",
          "Pedir prueba de la autorización otorgada.",
          "Ser informado sobre el uso que se ha dado a sus datos.",
          "Revocar la autorización y pedir la supresión de los datos.",
          "Acceder gratis a sus datos.",
          "Presentar quejas ante la Superintendencia de Industria y Comercio, después de haber agotado el trámite ante el responsable.",
        ],
      },
      "Como las conversaciones no se guardan, el responsable no tiene copias que consultar o corregir. Si hace falta, gestionará ante OpenAI la supresión de lo que aún conserve.",
    ],
  },
  {
    id: "consultas",
    title: "10. Cómo hacer consultas y reclamos",
    blocks: [
      `Escriba a ${CONTROLLERS.email} o comuníquese al ${CONTROLLERS.phone}, indicando quién es, qué solicita y un medio de respuesta.`,
      {
        list: [
          "Consultas: se responden en máximo 10 días hábiles, prorrogables 5 días hábiles más, avisando el motivo.",
          "Reclamos: se responden en máximo 15 días hábiles, prorrogables 8 días hábiles más, avisando el motivo.",
        ],
      },
    ],
  },
  {
    id: "vigencia",
    title: "11. Vigencia y cambios",
    blocks: [
      `Versión ${LEGAL.version}, del ${LEGAL.updated}. Los cambios importantes se publicarán en esta página antes de aplicarse.`,
    ],
  },
];

export const TERMS: readonly LegalSection[] = [
  {
    id: "uso",
    title: "1. Uso de la herramienta",
    blocks: [
      {
        list: [
          "El Oráculo orienta; no diagnostica, no da terapia, no impone sanciones ni decide quién tiene la razón.",
          "Las decisiones las toma siempre la persona, de preferencia acompañada de un adulto de confianza.",
          "Es una inteligencia artificial: puede equivocarse o no entender bien una situación.",
          "No hay supervisión humana en tiempo real.",
        ],
      },
    ],
  },
  {
    id: "emergencias",
    title: "2. No es un servicio de emergencias",
    blocks: [
      `Si alguien está en peligro, llame al ${HELP_LINES.emergencias.number}. Para proteger a un niño, niña o adolescente, llame al ${HELP_LINES.icbf.number} (ICBF). Para salud mental en Barranquilla, llame a la ${HELP_LINES.lineaVida.name}, ${HELP_LINES.lineaVida.number}.`,
      "Ante señales de riesgo, el Oráculo muestra mensajes de seguridad y líneas de ayuda, y puede pausar la conversación. No llama ni avisa a nadie.",
    ],
  },
  {
    id: "responsable",
    title: "3. Uso responsable",
    blocks: [
      {
        list: [
          "No escriba nombres ni datos personales, propios ni de otras personas.",
          "No use el Oráculo para molestar, amenazar o exponer a nadie.",
          "No intente cambiar sus reglas ni usarlo para fines distintos a la convivencia.",
          "Los estudiantes solo pueden usarlo con la autorización de su familia y su colegio.",
        ],
      },
    ],
  },
  {
    id: "limites",
    title: "4. Límites y disponibilidad",
    blocks: [
      `Cada conversación dura hasta ${LIMITS.maxSessionMinutes} minutos o ${LIMITS.maxUserMessages} mensajes. El servicio puede no estar disponible en algunos momentos, o limitarse para evitar el abuso.`,
    ],
  },
];

/** The paper form schools hand out to parents. It is filled in and signed by hand. */
export const AUTHORIZATION_FORM = {
  title: "Autorización de padre, madre o representante legal",
  subtitle: "Uso del Oráculo de EmpatIA Digital por estudiantes",
  intro: `Yo, el abajo firmante, declaro que me informaron sobre el Oráculo y que leí la política de privacidad y los términos de uso publicados en ${LEGAL.policyUrl}. Entiendo que:`,
  points: [
    "El Oráculo es un chat con inteligencia artificial que escucha y orienta sobre convivencia escolar, acoso y ciberacoso. No es una persona ni un servicio de salud o de emergencias.",
    "No pide nombres ni crea cuentas, y las conversaciones no se guardan en ninguna base de datos del responsable.",
    "Los mensajes se envían a OpenAI (Estados Unidos) para generar las respuestas. OpenAI puede conservarlos hasta 30 días para vigilar abusos y no los usa para entrenar sus modelos.",
    "Si mi hijo o hija cuenta una situación de riesgo, el Oráculo le mostrará líneas de ayuda, pero no avisará al colegio, a la familia ni a las autoridades.",
    "El uso es voluntario, y puedo revocar esta autorización en cualquier momento.",
  ],
  grant: `Autorizo de manera previa, expresa e informada a la ${CONTROLLERS.names} para el tratamiento de los datos que mi hijo o hija escriba en el Oráculo, incluidos los datos sensibles que decida compartir, y su transmisión a OpenAI, con las finalidades descritas en la política de privacidad.`,
  choice: ["Sí autorizo", "No autorizo"],
  guardianFields: [
    "Nombre del padre, madre o representante legal",
    "Tipo y número de documento",
    "Parentesco",
    "Nombre del estudiante",
    "Grado",
    "Institución educativa",
  ],
  signatureFields: ["Firma", "Fecha"],
  assent: {
    title: "Asentimiento del estudiante",
    text: "Me explicaron qué es el Oráculo, qué hace con mis mensajes y que no reemplaza a mi familia ni a mis profesores. Quiero usarlo.",
    fields: ["Firma del estudiante", "Fecha"],
  },
  school: {
    title: "Para uso de la institución",
    fields: ["Recibido por", "Cargo", "Fecha"],
  },
  contact: `Consultas y reclamos: ${CONTROLLERS.email} · ${CONTROLLERS.phone}`,
} as const;
