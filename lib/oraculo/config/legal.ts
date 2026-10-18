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
  version: "1.0",
  updated: "18 de octubre de 2026",
  approved: true,
  policyUrl: `${PUBLIC_SITE_URL}/oraculo/privacidad`,
} as const;

/** A paragraph, or a list of short points. */
export type LegalBlock = string | { list: readonly string[] };

export interface LegalSection {
  id: string;
  title: string;
  blocks: readonly LegalBlock[];
}

/**
 * Privacy policy of the Oráculo (/oraculo/privacidad). Final version delivered by the user on
 * 2026-10-18, corrected to match how the Oráculo works: the five help lines, the risk check also
 * goes to OpenAI, `store: false`, no messages in the server logs and no cookies.
 */
export const PRIVACY_META = { version: "1.0", updated: "18 de octubre de 2026" } as const;

export const PRIVACY_POLICY: readonly LegalSection[] = [
  {
    id: "presentacion",
    title: "1. Presentación y objeto",
    blocks: [
      "Oráculo de la Mediación, denominado en adelante «Oráculo», es una herramienta educativa de inteligencia artificial perteneciente a EmpatIA Digital, estrategia desarrollada en articulación con la Alcaldía Distrital de Barranquilla, a través de su Secretaría Distrital de Educación, y ejecutada por la Fundación Por Una Sonrisa.",
      "Oráculo ofrece un espacio digital de conversación y orientación sobre convivencia escolar, resolución pacífica de conflictos, acoso escolar, ciberacoso y uso responsable de las tecnologías.",
      "Esta política informa cómo se tratan los datos personales durante su utilización, cuáles son las medidas de protección adoptadas y cómo pueden ejercer sus derechos los usuarios.",
      "Se aplica especialmente la legislación colombiana sobre protección de datos personales y derechos de niños, niñas y adolescentes, incluyendo la Ley 1581 de 2012, el Decreto 1074 de 2015, la Ley 1098 de 2006, la Ley 1620 de 2013 y la Circular Externa 002 de 2024 de la Superintendencia de Industria y Comercio.",
      "La presente política complementa la Política de Privacidad general de EmpatIA Digital.",
    ],
  },
  {
    id: "responsable",
    title: "2. Identificación del responsable del tratamiento",
    blocks: [
      "Para los tratamientos de Oráculo cuyas finalidades y medios determina, la entidad responsable es:",
      {
        list: [
          CONTROLLERS.names,
          `${CONTROLLERS.ids}.`,
          "Domicilio: Barranquilla, Atlántico, Colombia.",
          "Dirección: Calle 75 #57-38, Barranquilla.",
          `Representante legal: ${CONTROLLERS.representative}.`,
          `Correo electrónico: ${CONTROLLERS.email}`,
          `Teléfono: ${CONTROLLERS.phone}.`,
          "Página web: https://fporunasonrisa.com",
        ],
      },
      "La Fundación administra y ejecuta la estrategia EmpatIA Digital dentro de las facultades otorgadas por la Alcaldía Distrital de Barranquilla. La atribución de responsabilidades relacionadas con otros tratamientos efectuados por la Alcaldía o las instituciones educativas se sujetará a las funciones efectivas de cada entidad y a los acuerdos aplicables.",
      "PazLab es un componente de mediación escolar de la estrategia y no se identifica en esta política como una persona jurídica independiente.",
    ],
  },
  {
    id: "naturaleza",
    title: "3. Naturaleza y alcance de Oráculo",
    blocks: [
      "Oráculo es un asistente conversacional basado en inteligencia artificial, diseñado para ofrecer escucha, información y orientación preventiva a estudiantes, docentes, padres, madres y cuidadores. Puede ayudar a reflexionar sobre situaciones de convivencia y sugerir alternativas pacíficas para abordar conflictos.",
      "Oráculo no es una persona, un psicólogo, un profesional de salud ni un servicio de atención de emergencias. Sus respuestas se generan automáticamente y pueden contener errores, interpretaciones incompletas o recomendaciones que no resulten adecuadas a todas las circunstancias.",
      "Oráculo no sustituye la orientación escolar, la atención profesional, el acompañamiento familiar ni las funciones de las autoridades competentes. No existe supervisión humana en tiempo real de las conversaciones.",
    ],
  },
  {
    id: "datos",
    title: "4. Datos personales objeto de tratamiento",
    blocks: [
      "Oráculo está diseñado para funcionar sin exigir la identificación directa de sus usuarios. Para iniciar una conversación no se solicita crear una cuenta ni suministrar nombres, documentos de identidad, correos electrónicos, teléfonos, direcciones o instituciones educativas.",
      "Durante su funcionamiento podrán tratarse las siguientes categorías de información:",
      {
        list: [
          "Contenido de las conversaciones: los mensajes enviados por el usuario y las respuestas generadas por la inteligencia artificial.",
          "Perfil seleccionado: la categoría de usuario elegida al ingresar (estudiante, docente, o padre, madre o cuidador).",
          "Información técnica: los datos necesarios para establecer y proteger la conexión, como la dirección IP, el tipo de navegador y los registros de seguridad del servicio de alojamiento.",
          "Datos personales y sensibles compartidos voluntariamente: los mensajes pueden contener información sobre circunstancias personales, familiares, educativas o de salud, así como situaciones de violencia, amenazas, abuso, acoso o ciberacoso.",
        ],
      },
      "La herramienta no solicita activamente estos datos para identificar al usuario, pero reconoce que pueden aparecer en las conversaciones. El suministro de datos sensibles es facultativo. Se recomienda evitar nombres completos, documentos, direcciones, números telefónicos y cualquier información que permita identificar innecesariamente al usuario o a terceras personas.",
      "La ausencia de un registro de identidad no significa que las conversaciones sean completamente anónimas.",
    ],
  },
  {
    id: "finalidades",
    title: "5. Finalidades del tratamiento",
    blocks: [
      "Los datos relacionados con Oráculo se tratarán exclusivamente para las siguientes finalidades:",
      {
        list: [
          "Procesar los mensajes y generar respuestas de orientación.",
          "Facilitar conversaciones sobre convivencia escolar y resolución pacífica de conflictos.",
          "Proporcionar información preventiva sobre acoso, ciberacoso y seguridad digital.",
          "Identificar automáticamente posibles señales de riesgo dentro de la conversación.",
          "Presentar recomendaciones de seguridad y canales oficiales de ayuda cuando corresponda.",
          "Elaborar, cuando el usuario lo solicite, un resumen de cierre que pueda copiar o imprimir.",
          "Mantener temporalmente el contexto necesario para responder de forma coherente.",
          "Proteger el funcionamiento del servicio frente a accesos no autorizados, abusos y utilización excesiva.",
          "Cumplir las obligaciones legales aplicables.",
        ],
      },
      "No se utilizarán las conversaciones para publicidad personalizada, comercialización de información ni evaluación académica individual de estudiantes. Las conversaciones no serán incorporadas a informes de convivencia escolar ni a expedientes disciplinarios.",
      "Cualquier finalidad adicional que implique tratamiento de datos personales deberá evaluarse e informarse antes de su implementación.",
    ],
  },
  {
    id: "conservacion",
    title: "6. Funcionamiento y conservación de las conversaciones",
    blocks: [
      "La conversación se guarda únicamente en la pestaña abierta del navegador del usuario, para mantener el contexto mientras dura la sesión. Al cerrar la pestaña, esa información se elimina.",
      "Las conversaciones no se almacenan en bases de datos de la Fundación, y los registros del servidor no guardan el contenido de los mensajes; esto se verifica con pruebas automáticas en cada versión del servicio.",
      `Cada conversación tiene un límite de ${LIMITS.maxUserMessages} mensajes o ${LIMITS.maxSessionMinutes} minutos.`,
      "Estos límites no significan que todos los datos procesados por proveedores externos desaparezcan al finalizar la sesión (ver el punto 7). La información que el usuario copie, imprima o conserve fuera de Oráculo permanecerá bajo su control o el del medio en que sea almacenada.",
      "Podrán existir registros técnicos de conexión o seguridad tratados por el proveedor de alojamiento, conforme a sus condiciones y a las obligaciones legales aplicables.",
    ],
  },
  {
    id: "proveedores",
    title: "7. Proveedores tecnológicos y procesamiento de información",
    blocks: [
      "Vercel: la página y el servidor de Oráculo se alojan en servicios de Vercel. Los datos técnicos necesarios para recibir solicitudes, operar la aplicación y proteger la infraestructura podrán ser tratados conforme a la configuración del servicio.",
      "OpenAI: cada mensaje enviado al chat se transmite desde el servidor de Oráculo a la API de OpenAI, L.L.C., en Estados Unidos, para tres funciones: revisarlo con su filtro de moderación, evaluar posibles señales de riesgo y generar la respuesta.",
      "Oráculo envía estas solicitudes con la opción de no almacenamiento de la API activada, de modo que OpenAI no guarda las conversaciones como datos de la aplicación. Según sus políticas vigentes, OpenAI no usa los datos enviados por su API para entrenar sus modelos y puede conservarlos hasta 30 días para vigilar abusos, salvo excepciones legales.",
      "La Fundación verificará los acuerdos de tratamiento de datos y las condiciones aplicables a los proveedores antes de la puesta en funcionamiento del servicio.",
    ],
  },
  {
    id: "internacional",
    title: "8. Tratamiento internacional de datos personales",
    blocks: [
      "La utilización de servicios internacionales de inteligencia artificial implica que los mensajes y algunos datos técnicos se procesan fuera del territorio colombiano, en Estados Unidos.",
      "Cuando OpenAI u otros proveedores actúen por cuenta del responsable y bajo sus instrucciones, se establecerán las garantías contractuales correspondientes a una transmisión internacional de datos personales. Si una operación constituye una transferencia internacional u otro tratamiento independiente, deberán cumplirse los requisitos legales específicamente aplicables.",
      "Estas operaciones se sujetarán a los principios de finalidad, necesidad, circulación restringida, seguridad y confidencialidad establecidos en la legislación colombiana.",
    ],
  },
  {
    id: "menores",
    title: "9. Protección de niños, niñas y adolescentes",
    blocks: [
      "Oráculo está dirigido, dentro del alcance educativo del proyecto, principalmente a estudiantes de 13 a 16 años, además de docentes y familias. El tratamiento de datos personales de menores se realizará respetando su interés superior, sus derechos fundamentales y su autonomía progresiva.",
      "Para el acceso de estudiantes menores de edad se exigirá:",
      {
        list: [
          "Autorización previa e informada del padre, madre o representante legal, cuando corresponda.",
          "Información comprensible sobre el funcionamiento de Oráculo y sus limitaciones.",
          "Consideración de la opinión del estudiante según su edad y madurez.",
          "Protección reforzada de cualquier dato personal o sensible compartido.",
          "Participación voluntaria, sin consecuencias académicas por decidir no utilizar la herramienta.",
          "Acceso a mecanismos humanos de orientación y apoyo alternativos.",
        ],
      },
      "La autorización se gestiona mediante el formato definido con las instituciones educativas. La aceptación del aviso de privacidad por parte del estudiante no reemplaza la autorización requerida de su representante legal.",
      "El tratamiento de información de menores de 13 años estará condicionado a la implementación de las salvaguardas legales y técnicas adicionales exigidas por el proveedor de inteligencia artificial, incluida la retención cero de datos cuando resulte obligatoria.",
      "Oráculo no realizará publicidad dirigida a menores ni utilizará sus conversaciones para elaborar perfiles comerciales.",
    ],
  },
  {
    id: "sensibles",
    title: "10. Tratamiento de datos sensibles",
    blocks: [
      "Durante una conversación, el usuario podría revelar información sobre salud física o mental, vida familiar, situaciones de violencia, abuso, discriminación o cualquier otra circunstancia protegida. La Fundación reconoce que estos contenidos pueden constituir datos sensibles.",
      "Su suministro no es obligatorio y el usuario podrá abstenerse de compartirlos. Su tratamiento se limitará a las finalidades informadas, únicamente cuando exista un fundamento jurídico válido y resulte necesario y proporcional para prestar el servicio. Se aplicarán medidas especiales de protección y se evitará utilizar esta información para decisiones disciplinarias, comerciales o de clasificación individual.",
      "La autorización para utilizar Oráculo no constituye una autorización ilimitada para tratar cualquier categoría de información personal.",
    ],
  },
  {
    id: "riesgo",
    title: "11. Situaciones de riesgo y protección de los usuarios",
    blocks: [
      "Oráculo revisa automáticamente cada mensaje, con el filtro de moderación de OpenAI y con un clasificador propio, para reconocer posibles expresiones relacionadas con autolesiones, abuso, violencia, amenazas, extorsión y otras situaciones que puedan comprometer la seguridad de una persona.",
      "Cuando detecta señales de riesgo, presenta mensajes de orientación y recomienda acudir a adultos de confianza, profesionales o autoridades competentes. Si un estudiante parece estar en peligro inmediato, la conversación se pausa y se priorizan los recursos de ayuda.",
      "Los canales de ayuda que muestra Oráculo son:",
      {
        list: [
          `${HELP_LINES.emergencias.number}: atención de emergencias.`,
          `${HELP_LINES.icbf.number}: línea del Instituto Colombiano de Bienestar Familiar (ICBF) para la protección de niños, niñas y adolescentes.`,
          `${HELP_LINES.lineaVida.number}: ${HELP_LINES.lineaVida.name}, para apoyo emocional.`,
          `${HELP_LINES.mujer.number}: orientación para mujeres y niñas víctimas de violencia.`,
          `${HELP_LINES.gaula.number}: GAULA, ante amenazas, extorsión o sextorsión.`,
        ],
      },
      "La detección automática de riesgo no equivale a una evaluación profesional ni garantiza identificar todas las situaciones de peligro.",
      "El Oráculo no contacta, alerta ni avisa a nadie: no realiza llamadas de emergencia ni envía alertas automáticas a colegios, familiares o autoridades.",
      "Lo anterior no excluye los deberes legales de protección, denuncia o colaboración con autoridades que puedan corresponder a las entidades participantes cuando tengan conocimiento efectivo de hechos que los requieran. La Fundación deberá contar con un protocolo institucional de atención y escalamiento de situaciones de riesgo, compatible con la naturaleza y las limitaciones técnicas del servicio.",
    ],
  },
  {
    id: "confidencialidad",
    title: "12. Confidencialidad y sus límites",
    blocks: [
      "Oráculo está diseñado para ofrecer un espacio de conversación privada, sin publicación de los mensajes ni supervisión humana en tiempo real. La Fundación no consulta el contenido de conversaciones individuales ni lo comparte con colegios o familiares.",
      "Sin embargo, no se promete anonimato absoluto ni confidencialidad ilimitada. Los proveedores tecnológicos pueden realizar determinados tratamientos de información conforme a sus contratos, condiciones de seguridad y obligaciones legales, y el cumplimiento de requerimientos válidos de autoridades competentes puede exigir actuaciones específicas dentro de las posibilidades jurídicas y técnicas del sistema.",
      "La falta de identificación del usuario impide localizarlo o prestarle asistencia individual directa. Por ello, Oráculo no debe utilizarse como único medio para solicitar ayuda ante una emergencia.",
    ],
  },
  {
    id: "seguridad",
    title: "13. Medidas de seguridad",
    blocks: [
      "La Fundación adopta medidas técnicas y organizativas proporcionales a los riesgos asociados con el uso de una herramienta de inteligencia artificial por menores de edad:",
      {
        list: [
          "Comunicación cifrada mediante HTTPS.",
          "Sesiones firmadas, que no pueden alterarse desde el navegador.",
          "Restricción de acceso a claves y credenciales.",
          `Límite de ${LIMITS.maxUserMessages} mensajes o ${LIMITS.maxSessionMinutes} minutos por conversación.`,
          "Protección frente al uso automatizado abusivo.",
          "Mínimos datos personales solicitados.",
          "Registros del servidor sin el contenido de los mensajes.",
          "Controles de acceso y configuración segura de proveedores.",
          "Procedimientos de atención de incidentes de seguridad.",
        ],
      },
      "Ningún sistema digital puede garantizar protección absoluta frente a todos los riesgos.",
    ],
  },
  {
    id: "derechos",
    title: "14. Derechos de los titulares",
    blocks: [
      "De conformidad con la Ley 1581 de 2012, los titulares podrán:",
      {
        list: [
          "Conocer, actualizar y rectificar sus datos personales.",
          "Solicitar prueba de las autorizaciones otorgadas cuando corresponda.",
          "Ser informados sobre el tratamiento de sus datos.",
          "Acceder gratuitamente a sus datos personales.",
          "Presentar consultas y reclamos.",
          "Solicitar la revocatoria de la autorización o la supresión de datos cuando sea legalmente procedente.",
          "Presentar quejas ante la Superintendencia de Industria y Comercio, una vez agotado el requisito legal de reclamación previa.",
        ],
      },
      "Los padres, madres o representantes legales podrán ejercer los derechos correspondientes a los menores conforme a la ley.",
      "Como Oráculo no almacena historiales propios ni los asocia a identidades, podría no ser técnicamente posible localizar una conversación específica. Cuando corresponda gestionar información conservada por proveedores, la Fundación tramitará las solicitudes conforme a sus posibilidades legales y técnicas, sin garantizar una recuperación o eliminación individual cuando no resulte viable.",
    ],
  },
  {
    id: "reclamos",
    title: "15. Procedimiento para consultas y reclamos",
    blocks: [
      `Las solicitudes relacionadas con el tratamiento de datos personales de Oráculo podrán dirigirse a la ${CONTROLLERS.names}:`,
      {
        list: [
          `Correo: ${CONTROLLERS.email}`,
          `Teléfono: ${CONTROLLERS.phone}`,
          "Dirección: Calle 75 #57-38, Barranquilla, Atlántico.",
        ],
      },
      "Las consultas serán atendidas dentro de los 10 días hábiles siguientes a su recepción. Cuando sea necesario ampliar el plazo, se informará al interesado y se responderá dentro de los 5 días hábiles adicionales permitidos por la ley.",
      "Los reclamos serán resueltos dentro de los 15 días hábiles siguientes al día posterior a su recepción completa. La prórroga legal máxima será de 8 días hábiles adicionales, previa comunicación al solicitante. Los requisitos, subsanaciones y demás etapas del procedimiento se sujetarán a la Ley 1581 de 2012.",
    ],
  },
  {
    id: "cookies",
    title: "16. Cookies y datos técnicos de navegación",
    blocks: [
      "Oráculo no usa cookies. La sesión se mantiene con un pase firmado que se guarda solo en la pestaña abierta del navegador.",
      "No se utilizan cookies publicitarias, seguimiento comercial ni herramientas de analítica destinadas a perfilar el comportamiento de los usuarios. Cualquier incorporación posterior de tecnologías de seguimiento deberá evaluarse e informarse previamente conforme a la legislación aplicable.",
      "El tratamiento de direcciones IP y otros datos técnicos necesarios para la seguridad de la infraestructura estará sujeto a los controles y periodos de conservación correspondientes.",
    ],
  },
  {
    id: "relacion",
    title: "17. Relación con la Política de Privacidad general",
    blocks: [
      "Esta política complementa la Política de Privacidad y Tratamiento de Datos Personales de EmpatIA Digital, disponible en https://empatia-digital.vercel.app/privacidad. Cuando una disposición de esta política regula específicamente el funcionamiento de Oráculo, se aplicará dicha disposición, sin desconocer las obligaciones legales generales.",
      "Los términos y condiciones de uso de Oráculo están disponibles en https://empatia-digital.vercel.app/oraculo/terminos.",
    ],
  },
  {
    id: "cambios",
    title: "18. Cambios y actualizaciones",
    blocks: [
      "La Fundación Por Una Sonrisa podrá actualizar esta política para reflejar modificaciones legales, técnicas, institucionales o cambios en los servicios tecnológicos utilizados. Los cambios sustanciales que afecten el tratamiento de datos personales serán informados oportunamente.",
      "Cuando una modificación implique nuevas finalidades o tratamientos que requieran autorización adicional, esta deberá obtenerse antes de iniciar dichos tratamientos. La versión vigente permanecerá disponible en https://empatia-digital.vercel.app/oraculo/privacidad.",
    ],
  },
  {
    id: "vigencia",
    title: "19. Vigencia",
    blocks: [
      "La presente política rige a partir de su publicación, el 18 de octubre de 2026. Versión 1.0.",
      "La conservación de información se sujetará a las finalidades informadas, las condiciones de los proveedores tecnológicos y las obligaciones legales aplicables.",
    ],
  },
];

/**
 * Terms of use of the Oráculo (/oraculo/terminos). Final version delivered by the user on
 * 2026-10-18, corrected to match the app: the five help lines, the limits as they are, no copies
 * of the summaries, and the parents' authorization collected by the schools.
 */
export const TERMS_META = { version: "1.0", updated: "18 de octubre de 2026" } as const;

export const TERMS: readonly LegalSection[] = [
  {
    id: "identificacion",
    title: "1. Identificación del servicio",
    blocks: [
      "Oráculo de la Mediación, en adelante «Oráculo», es una herramienta digital de inteligencia artificial integrada a EmpatIA Digital, estrategia educativa desarrollada en articulación con la Alcaldía Distrital de Barranquilla, a través de su Secretaría Distrital de Educación. Su ejecución y administración está a cargo de:",
      {
        list: [
          CONTROLLERS.names,
          `${CONTROLLERS.ids}.`,
          "Domicilio: Barranquilla, Atlántico, Colombia.",
          "Dirección: Calle 75 #57-38, Barranquilla.",
          `Representante legal: ${CONTROLLERS.representative}.`,
          `Correo electrónico: ${CONTROLLERS.email}`,
          `Teléfono: ${CONTROLLERS.phone}.`,
          "Sitio web: https://fporunasonrisa.com",
        ],
      },
    ],
  },
  {
    id: "objeto",
    title: "2. Objeto del servicio",
    blocks: [
      "Oráculo es un asistente virtual basado en inteligencia artificial cuyo propósito es ofrecer orientación educativa y preventiva sobre:",
      {
        list: [
          "Convivencia escolar.",
          "Resolución pacífica de conflictos.",
          "Acoso escolar y ciberacoso.",
          "Respeto, empatía y comunicación.",
          "Uso responsable de internet y redes sociales.",
          "Prevención de situaciones de violencia digital.",
        ],
      },
      "Su funcionamiento está orientado a promover la reflexión, el diálogo y la búsqueda de soluciones pacíficas. El servicio es gratuito para sus usuarios en el marco de EmpatIA Digital.",
    ],
  },
  {
    id: "naturaleza",
    title: "3. Naturaleza y limitaciones de la inteligencia artificial",
    blocks: [
      "Oráculo utiliza inteligencia artificial para interpretar mensajes y generar respuestas automáticas. El usuario reconoce que:",
      {
        list: [
          "Oráculo no es una persona.",
          "Sus respuestas son generadas automáticamente.",
          "Puede cometer errores o interpretar incorrectamente una situación.",
          "Sus orientaciones tienen carácter informativo, educativo y preventivo.",
          "No realiza diagnósticos médicos ni psicológicos.",
          "No presta terapia ni asesoría jurídica profesional.",
          "No determina responsabilidades disciplinarias o penales.",
          "No sustituye a docentes orientadores, psicólogos, familiares o autoridades competentes.",
        ],
      },
      "Las sugerencias de Oráculo deben valorarse teniendo en cuenta las circunstancias particulares de cada situación.",
    ],
  },
  {
    id: "usuarios",
    title: "4. Usuarios autorizados",
    blocks: [
      "Oráculo está dirigido a estudiantes de instituciones educativas participantes en EmpatIA Digital, docentes y orientadores escolares, y padres, madres y cuidadores. La población estudiantil prevista comprende principalmente adolescentes entre los 13 y 16 años.",
      "Los estudiantes menores de edad deberán contar con la autorización previa de su padre, madre o representante legal. El uso de la herramienta es voluntario: ningún estudiante recibirá sanciones académicas ni restricciones para acceder a los servicios ordinarios de orientación escolar por decidir no utilizar Oráculo.",
      "El acceso de menores de 13 años estará condicionado a la implementación y verificación de las salvaguardas legales y técnicas adicionales que correspondan.",
    ],
  },
  {
    id: "autorizacion",
    title: "5. Autorización para menores de edad",
    blocks: [
      "Antes de utilizar Oráculo, los estudiantes menores de edad deberán contar con la autorización de su padre, madre o representante legal. La autorización se recoge en el colegio con el formato disponible en https://empatia-digital.vercel.app/oraculo/autorizacion, que informa, entre otros aspectos:",
      {
        list: [
          "La naturaleza de la herramienta.",
          "Las finalidades del tratamiento de datos personales.",
          "La participación de proveedores tecnológicos de inteligencia artificial.",
          "Las limitaciones de privacidad y confidencialidad.",
          "Los riesgos asociados con la utilización del servicio.",
          "Los derechos de los titulares de datos personales.",
        ],
      },
      "Como Oráculo no pide nombres ni crea cuentas, la aplicación no puede verificar por sí misma esa autorización: la recogen y verifican las instituciones educativas con la Fundación, procurando minimizar los datos personales recopilados.",
      "Antes de iniciar una conversación, el estudiante lee un aviso en lenguaje claro y apropiado para su edad, y lo acepta marcando «Entiendo y quiero empezar». Esa aceptación no reemplaza la autorización exigida a su representante legal.",
    ],
  },
  {
    id: "acceso",
    title: "6. Condiciones de acceso",
    blocks: [
      "Oráculo funciona sin crear una cuenta personal y no solicita nombres, documentos de identidad, correos electrónicos ni números telefónicos para iniciar una conversación. Al ingresar, el usuario selecciona su perfil: estudiante, docente, o padre, madre o cuidador.",
      "Para utilizar el servicio se requiere:",
      {
        list: [
          "Acceso a internet.",
          "Un dispositivo y navegador compatibles.",
          "Aceptar el aviso que se muestra antes de empezar.",
          "En el caso de estudiantes menores de edad, contar con la autorización de su representante legal.",
        ],
      },
      "El usuario podrá finalizar la conversación cuando lo desee. La disponibilidad del servicio dependerá de las condiciones técnicas de la plataforma y sus proveedores.",
    ],
  },
  {
    id: "uso-responsable",
    title: "7. Reglas de uso responsable",
    blocks: [
      "Los usuarios deberán utilizar Oráculo de manera respetuosa, responsable y de buena fe. No está permitido:",
      {
        list: [
          "Utilizar el servicio para amenazar, acosar, discriminar o intimidar a otras personas.",
          "Compartir información personal de terceros sin justificación legítima.",
          "Intentar obtener información confidencial o acceder a sistemas sin autorización.",
          "Manipular deliberadamente la herramienta para eludir sus mecanismos de seguridad.",
          "Utilizar Oráculo para promover violencia, explotación, extorsión o actividades ilícitas.",
          "Realizar solicitudes automatizadas que afecten injustificadamente la disponibilidad del servicio.",
          "Utilizar las respuestas de Oráculo para humillar, señalar públicamente o perjudicar a otras personas.",
        ],
      },
      "Se recomienda evitar compartir nombres completos, direcciones, documentos de identidad, teléfonos, contraseñas u otros datos que permitan identificar innecesariamente a personas involucradas en un conflicto.",
      "Estas reglas no impiden que un usuario solicite legítimamente orientación sobre situaciones difíciles, amenazas, abuso o vulneraciones de derechos.",
    ],
  },
  {
    id: "privacidad",
    title: "8. Privacidad y tratamiento de datos personales",
    blocks: [
      "Oráculo está diseñado para reducir la recopilación de información personal. Las conversaciones se guardan solo en la pestaña abierta del navegador del usuario y no se almacenan en bases de datos de la Fundación.",
      "Los mensajes son procesados mediante servicios de OpenAI para revisar posibles señales de riesgo y generar las respuestas.",
      "El tratamiento de datos personales, incluidos los datos que puedan ser sensibles, se regula en la Política de Privacidad de Oráculo, disponible en https://empatia-digital.vercel.app/oraculo/privacidad. Los usuarios deberán consultarla antes de comenzar a utilizar Oráculo.",
      "El uso de la herramienta no implica que las conversaciones sean completamente anónimas ni que los proveedores tecnológicos carezcan de acceso técnico a la información necesaria para prestar el servicio.",
    ],
  },
  {
    id: "confidencialidad",
    title: "9. Confidencialidad de las conversaciones",
    blocks: [
      "Oráculo está diseñado como un espacio de conversación privada. No existe supervisión humana en tiempo real de las conversaciones, y la herramienta no envía el contenido de los mensajes a docentes, familiares, instituciones educativas o autoridades.",
      "Sin embargo, la confidencialidad no es absoluta. Determinados tratamientos pueden ser realizados por proveedores tecnológicos conforme a sus contratos y obligaciones legales, y podrán existir deberes legales de protección, denuncia o colaboración con autoridades competentes cuando las entidades responsables tengan conocimiento efectivo de hechos que los requieran.",
      "La Fundación no puede identificar ni contactar individualmente a usuarios que no proporcionan datos de identificación.",
    ],
  },
  {
    id: "riesgo",
    title: "10. Situaciones de riesgo y emergencia",
    blocks: [
      "Oráculo incluye mecanismos automáticos destinados a reconocer posibles señales de autolesiones o riesgo suicida, abuso o explotación, violencia física o psicológica, amenazas graves, extorsión, y acoso escolar o ciberacoso.",
      "Cuando se identifiquen posibles situaciones de riesgo, Oráculo muestra mensajes de orientación preventiva y recomienda acudir a un adulto de confianza, orientador escolar, profesional o autoridad competente. Si un estudiante parece estar en peligro inmediato, la conversación se pausa y se priorizan las instrucciones de seguridad.",
      "Oráculo no es un servicio de emergencias. No realiza llamadas, rescates, denuncias ni notificaciones automáticas a las autoridades.",
      "En caso de emergencia, los usuarios pueden acudir a los siguientes canales:",
      {
        list: [
          `${HELP_LINES.emergencias.number}: línea de emergencias.`,
          `${HELP_LINES.icbf.number}: línea del Instituto Colombiano de Bienestar Familiar (ICBF) para la protección de niños, niñas y adolescentes.`,
          `${HELP_LINES.lineaVida.number}: ${HELP_LINES.lineaVida.name}, para apoyo emocional.`,
          `${HELP_LINES.mujer.number}: orientación para mujeres y niñas víctimas de violencia.`,
          `${HELP_LINES.gaula.number}: GAULA, ante amenazas, extorsión o sextorsión.`,
        ],
      },
      "La identificación automática de riesgos puede presentar errores y no sustituye la evaluación humana. Quien enfrente un peligro inmediato debe buscar asistencia de los servicios de emergencia y de personas adultas o profesionales capacitados, sin depender exclusivamente de Oráculo.",
    ],
  },
  {
    id: "decisiones",
    title: "11. Orientación y decisiones personales",
    blocks: [
      "Las respuestas de Oráculo tienen finalidad educativa y preventiva. El usuario conserva su autonomía para valorar las recomendaciones, solicitar ayuda humana y decidir cómo actuar, de acuerdo con su edad y circunstancias. En el caso de estudiantes menores de edad, se promoverá el acompañamiento de adultos de confianza y profesionales competentes.",
      "Oráculo no reemplaza los procedimientos institucionales de convivencia escolar ni la Ruta de Atención Integral prevista en la legislación colombiana. No determina quién es víctima, agresor o responsable de un conflicto, ni adopta decisiones disciplinarias, académicas, médicas o judiciales.",
    ],
  },
  {
    id: "limites",
    title: "12. Duración y límites de las conversaciones",
    blocks: [
      `Cada conversación tiene un máximo de ${LIMITS.maxSessionMinutes} minutos o ${LIMITS.maxUserMessages} mensajes, y cada mensaje puede tener hasta ${LIMITS.maxMessageChars.toLocaleString("es-CO")} caracteres. El servicio finaliza la sesión cuando se alcanza alguno de estos límites.`,
      "También podrán aplicarse restricciones técnicas para proteger la disponibilidad, seguridad y funcionamiento de la herramienta. El usuario puede finalizar voluntariamente su conversación antes de alcanzar estos límites.",
    ],
  },
  {
    id: "resumenes",
    title: "13. Resúmenes y contenido generado",
    blocks: [
      "Al finalizar, Oráculo ofrece al usuario un resumen de cierre que puede copiar o imprimir.",
      "Las respuestas y resúmenes producidos mediante inteligencia artificial pueden contener errores, omisiones o interpretaciones incompletas. El usuario deberá verificar su contenido antes de utilizarlo en decisiones relevantes.",
      "La Fundación no conserva copias de los resúmenes ni de las conversaciones. Lo que el usuario guarde por sus propios medios queda bajo su control. Se recomienda no divulgar públicamente contenidos que puedan afectar la privacidad, seguridad o reputación de terceras personas.",
    ],
  },
  {
    id: "disponibilidad",
    title: "14. Disponibilidad y modificaciones del servicio",
    blocks: [
      "La Fundación Por Una Sonrisa procurará mantener Oráculo disponible y en condiciones adecuadas de funcionamiento. No obstante, podrán producirse interrupciones derivadas de:",
      {
        list: [
          "Mantenimiento técnico.",
          "Actualizaciones de seguridad.",
          "Fallas de conectividad.",
          "Problemas con proveedores tecnológicos.",
          "Uso excesivo o indebido.",
          "Situaciones de fuerza mayor.",
        ],
      },
      "La Fundación podrá introducir cambios técnicos o funcionales necesarios para mejorar la seguridad, accesibilidad y calidad del servicio. Las modificaciones que afecten significativamente las condiciones de uso o el tratamiento de datos personales serán informadas mediante los mecanismos correspondientes.",
    ],
  },
  {
    id: "propiedad",
    title: "15. Propiedad intelectual",
    blocks: [
      "El diseño, contenidos institucionales, elementos gráficos, identidad visual y demás componentes originales de Oráculo están protegidos por las disposiciones aplicables sobre propiedad intelectual. Los derechos sobre materiales creados por terceros se regirán por las licencias y autorizaciones correspondientes.",
      "El usuario podrá utilizar las orientaciones generadas para fines personales, educativos y legítimos, sin que ello implique autorización para vulnerar derechos de terceros. El uso de contenidos generados mediante inteligencia artificial deberá respetar la legislación aplicable y las condiciones contractuales pertinentes.",
    ],
  },
  {
    id: "responsabilidad",
    title: "16. Responsabilidades y limitaciones",
    blocks: [
      "La Fundación Por Una Sonrisa asume las obligaciones legales que le correspondan como entidad encargada de la ejecución y administración de Oráculo. La herramienta se ofrece como recurso complementario de orientación educativa y no como sustituto de servicios profesionales o institucionales.",
      "Las respuestas generadas automáticamente pueden contener errores o limitaciones. La Fundación adoptará medidas razonables y proporcionales para reducir los riesgos asociados con su utilización, especialmente cuando participen menores de edad.",
      "Ninguna disposición de estos términos excluye, restringe o elimina responsabilidades que resulten obligatorias conforme a la legislación colombiana, ni limita los derechos fundamentales de los usuarios ni los derechos de niños, niñas y adolescentes.",
    ],
  },
  {
    id: "restriccion",
    title: "17. Suspensión o restricción de acceso",
    blocks: [
      "La Fundación podrá establecer restricciones técnicas proporcionadas cuando sean necesarias para:",
      {
        list: [
          "Proteger la integridad de la plataforma.",
          "Prevenir ataques informáticos.",
          "Evitar usos automatizados abusivos.",
          "Cumplir obligaciones legales.",
          "Reducir riesgos graves relacionados con el funcionamiento del servicio.",
        ],
      },
      "Las restricciones deberán aplicarse respetando los derechos de los usuarios y evitando medidas discriminatorias. Cuando sea posible, se informará sobre las condiciones generales de disponibilidad y acceso.",
    ],
  },
  {
    id: "consultas",
    title: "18. Consultas, solicitudes y reclamaciones",
    blocks: [
      `Las personas que tengan inquietudes sobre el funcionamiento, uso o condiciones de Oráculo pueden comunicarse con la ${CONTROLLERS.names}:`,
      {
        list: [
          `Correo electrónico: ${CONTROLLERS.email}`,
          `Teléfono: ${CONTROLLERS.phone}.`,
          "Dirección: Calle 75 #57-38, Barranquilla, Atlántico.",
          "Sitio web: https://fporunasonrisa.com",
        ],
      },
      "Las solicitudes relacionadas con datos personales se atenderán conforme a los procedimientos y plazos establecidos en la Política de Privacidad de Oráculo y la Ley 1581 de 2012.",
    ],
  },
  {
    id: "legislacion",
    title: "19. Legislación aplicable",
    blocks: [
      "Los presentes Términos y Condiciones se interpretarán conforme a la legislación de la República de Colombia. Serán especialmente relevantes:",
      {
        list: [
          "La Constitución Política de Colombia.",
          "La Ley 1581 de 2012 y sus disposiciones reglamentarias.",
          "La Ley 1098 de 2006, Código de Infancia y Adolescencia.",
          "La Ley 1620 de 2013 y las disposiciones sobre convivencia escolar.",
          "Las demás normas colombianas aplicables a servicios digitales, protección de menores y derechos fundamentales.",
        ],
      },
      "Las controversias se tramitarán ante las autoridades competentes, de acuerdo con la legislación aplicable.",
    ],
  },
  {
    id: "vigencia",
    title: "20. Modificaciones y vigencia",
    blocks: [
      "La Fundación Por Una Sonrisa podrá actualizar estos términos cuando existan cambios normativos, técnicos o institucionales. Las modificaciones sustanciales serán comunicadas oportunamente. La versión vigente permanecerá disponible en https://empatia-digital.vercel.app/oraculo/terminos.",
      "Estos términos rigen a partir de su publicación, el 18 de octubre de 2026. Versión 1.0.",
    ],
  },
];

/**
 * The paper form schools hand out to parents (/oraculo/autorizacion): two sheets, in plain words.
 * Sheet 1 says what to know, with QR codes to the full texts; sheet 2 holds one decision and the
 * signatures. One authorization only: the risk check must read sensitive messages, so a separate
 * "no to sensitive data" could not be honored by an anonymous chat.
 */
export const AUTHORIZATION_FORM = {
  title: "Autorización para el uso del Oráculo",
  subtitle: "Padre, madre o representante legal de un estudiante menor de edad",
  guardianTitle: "Datos del padre, madre o representante legal",
  guardianFields: ["Nombre completo", "Documento de identidad", "Teléfono", "Parentesco (madre, padre o representante legal)"],
  studentTitle: "Datos del estudiante",
  studentFields: ["Nombre completo", "Edad", "Grado", "Institución educativa"],
  studentNote: "Estos datos solo sirven para dejar constancia de la autorización. No se escriben en el chat ni se juntan con las conversaciones.",
  pointsTitle: "Lo que debe saber",
  intro: `Lea estos puntos antes de firmar. El detalle completo está en la política de privacidad (${LEGAL.policyUrl}) y en los términos del Oráculo.`,
  points: [
    "El Oráculo es un chat con inteligencia artificial que orienta sobre convivencia escolar, acoso y ciberacoso.",
    "No es una persona, ni un psicólogo, ni un servicio de emergencias. Puede equivocarse.",
    "Usarlo es voluntario. Si su hijo o hija no lo usa, no pasa nada en el colegio.",
    "No pide nombre ni crea cuentas. Es mejor no escribir nombres, direcciones ni teléfonos.",
    "Su hijo o hija puede contar temas delicados (salud, familia, violencia). Para responder y detectar riesgos, el Oráculo procesa también esa información.",
    "Los mensajes se envían a OpenAI, en Estados Unidos, para generar las respuestas. OpenAI no los usa para entrenar su IA y puede guardarlos hasta 30 días para vigilar abusos.",
    `La conversación no se guarda: se borra al cerrar la pestaña. Dura máximo ${LIMITS.maxUserMessages} mensajes o ${LIMITS.maxSessionMinutes} minutos.`,
    "Nadie lee las conversaciones, y el Oráculo no contacta, alerta ni avisa a nadie: ni al colegio, ni a la familia, ni a las autoridades.",
    `Si detecta riesgo, muestra líneas de ayuda: ${HELP_LINES.emergencias.number} (emergencias), ${HELP_LINES.icbf.number} (ICBF), ${HELP_LINES.lineaVida.number} (Línea de la Vida), ${HELP_LINES.mujer.number} (mujeres) y ${HELP_LINES.gaula.number} (GAULA).`,
    `Puede retirar esta autorización cuando quiera, escribiendo a ${CONTROLLERS.email}.`,
  ],
  qrTitle: "Escanee para leer los textos completos",
  qr: [
    { label: "Política de privacidad", path: "/oraculo/privacidad" },
    { label: "Términos de uso", path: "/oraculo/terminos" },
  ],
  decisionTitle: "Decisión",
  grant: `Leí los puntos anteriores. Autorizo de manera previa, expresa e informada a la ${CONTROLLERS.names} para que trate los datos que mi hijo o hija escriba en el Oráculo, incluidos los temas delicados (datos sensibles) que decida contar, y los envíe a OpenAI, con las finalidades descritas en la política de privacidad del Oráculo.`,
  choice: ["Sí autorizo", "No autorizo"],
  signatureFields: ["Firma", "Documento de identidad", "Fecha", "Ciudad"],
  assent: {
    title: "Opinión del estudiante",
    text: "Me explicaron qué es el Oráculo, que puede equivocarse y que usarlo es voluntario.",
    options: ["Quiero usarlo", "No quiero usarlo", "Necesito más información"],
    fields: ["Firma del estudiante", "Fecha"],
    note: "Esto deja constancia de la opinión del estudiante. No reemplaza la autorización de su padre, madre o representante legal.",
  },
  school: {
    title: "Recepción en el colegio",
    fields: ["Institución educativa", "Recibido por (nombre o cargo)", "Fecha", "Firma"],
    note: "Guarde este formato con acceso restringido. No lo junte con el contenido de las conversaciones.",
  },
  contact: `Consultas y reclamos: ${CONTROLLERS.email} · ${CONTROLLERS.phone}`,
} as const;
