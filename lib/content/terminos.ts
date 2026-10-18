import type { PolicySection } from "@/lib/content/privacidad";

/* ------------------------------------------------------------------ */
/*  Términos y condiciones de uso del sitio EmpatIA Digital            */
/*  (/terminos). Versión final entregada por el usuario el            */
/*  2026-10-18, con cuatro correcciones: edad mínima de ChatGPT,      */
/*  permiso para copiar los prompts, marcas de terceros y sin marcas   */
/*  de borrador. El Oráculo tiene sus propios términos                 */
/*  (/oraculo/terminos).                                               */
/* ------------------------------------------------------------------ */

export const TERMS_META = {
  title: "Términos y condiciones de uso",
  version: "1.0",
  updated: "18 de octubre de 2026",
} as const;

/** Plain-language summary shown first. */
export const TERMS_SUMMARY: readonly string[] = [
  "EmpatIA Digital es un recurso educativo gratuito sobre convivencia, ciudadanía digital e inteligencia artificial.",
  "No es un canal de emergencias: ante un peligro, llama al 123; para proteger a un niño, niña o adolescente, al 141 del ICBF.",
  "Los resultados de las actividades no son diagnósticos: las decisiones las toman docentes, familias e instituciones.",
  "Puedes copiar y adaptar los prompts y materiales para fines educativos, citando a EmpatIA Digital.",
  "Las herramientas de IA de terceros tienen sus propias reglas y edades mínimas, y pueden equivocarse.",
];

export const TERMS: readonly PolicySection[] = [
  {
    id: "identificacion",
    title: "1. Identificación y alcance",
    blocks: [
      "EmpatIA Digital es una estrategia educativa desarrollada en articulación con la Alcaldía Distrital de Barranquilla, a través de la Secretaría Distrital de Educación, y ejecutada y administrada por la Fundación Por Una Sonrisa. Promueve la convivencia escolar, la resolución pacífica de conflictos, la ciudadanía digital y el uso ético y responsable de la inteligencia artificial.",
      {
        list: [
          "Entidad administradora: Fundación Por Una Sonrisa.",
          "NIT: 900.804.571-1.",
          "Domicilio: Barranquilla, Atlántico, Colombia.",
          "Dirección: Calle 75 #57-38, Barranquilla.",
          "Representante legal: Noris Osorio de Martínez.",
          "Correo de contacto: contacto@fporunasonrisa.com.",
          "Teléfono: +57 314 596 7994.",
        ],
      },
      "Estos términos regulan el acceso y uso de la plataforma general de EmpatIA Digital, sus materiales educativos, presentaciones, actividades y formularios. No sustituyen las condiciones específicas del chat Oráculo, disponibles en https://empatia-digital.vercel.app/oraculo/terminos.",
    ],
  },
  {
    id: "aceptacion",
    title: "2. Aceptación y acceso",
    blocks: [
      "Al utilizar la plataforma, el usuario debe respetar las condiciones aquí expuestas. Cuando una actividad requiera aceptación expresa, se solicitará mediante un mecanismo adecuado. La simple visita del sitio no sustituye las autorizaciones exigidas por la legislación para tratar datos personales ni la autorización del representante legal cuando corresponda.",
      "La consulta de materiales informativos es, en general, de acceso libre, salvo restricciones técnicas o pedagógicas expresamente informadas. La participación en actividades organizadas por instituciones educativas podrá estar sujeta a sus respectivos procedimientos y autorizaciones.",
    ],
  },
  {
    id: "menores",
    title: "3. Usuarios y protección de menores",
    blocks: [
      "La iniciativa está dirigida a estudiantes, principalmente de 13 a 16 años según la propuesta del proyecto, docentes y padres, madres o cuidadores. Las actividades que involucren a menores deben realizarse conforme a las indicaciones de la institución educativa y con las autorizaciones legalmente exigibles. Los menores deben recibir información comprensible y contar con mecanismos adecuados de acompañamiento.",
      "El acceso a contenidos educativos generales no debe confundirse con autorización para recopilar información personal, publicar imágenes o utilizar herramientas de terceros. El uso del chat Oráculo se sujeta a requisitos adicionales de autorización y protección indicados en sus documentos específicos.",
    ],
  },
  {
    id: "proposito",
    title: "4. Propósito y naturaleza educativa",
    blocks: [
      "La plataforma ofrece contenidos, presentaciones, recursos pedagógicos y actividades que buscan fortalecer el aprendizaje en convivencia digital y uso responsable de la IA. No garantiza resultados académicos individuales ni sustituye el criterio de docentes, orientadores escolares, profesionales de salud o autoridades competentes.",
      "Las explicaciones y ejemplos son educativos; pueden necesitar actualización y adaptación al contexto de cada institución.",
    ],
  },
  {
    id: "formularios",
    title: "5. Actividades, formularios y evaluaciones",
    blocks: [
      "La plataforma podrá enlazar o habilitar formularios de participación, encuestas, pretest y postest. Cada formulario deberá informar su finalidad, si la participación es obligatoria o voluntaria en el contexto de la actividad, qué datos solicita y cómo se tratarán. Cuando se soliciten datos personales o imágenes, se observará la Política de Privacidad y los mecanismos de autorización aplicables.",
      "Las respuestas y los resultados no constituyen por sí solos diagnósticos psicológicos, médicos ni determinaciones de responsabilidad por conductas de acoso o violencia. Las decisiones pedagógicas y de protección corresponden a personas e instituciones competentes.",
    ],
  },
  {
    id: "uso-responsable",
    title: "6. Uso responsable",
    blocks: [
      "Los usuarios se comprometen a utilizar la plataforma de forma respetuosa y conforme a la ley. No deberán emplearla para acosar, amenazar, discriminar, suplantar personas, divulgar información privada de terceros, publicar contenidos ilícitos, introducir software malicioso, interferir en el funcionamiento del sitio o intentar acceder sin autorización a sistemas y datos.",
      "No se deben ingresar datos sensibles ni información personal de otras personas en campos abiertos cuando no sean necesarios para la finalidad informada.",
    ],
  },
  {
    id: "ia",
    title: "7. Inteligencia artificial y servicios externos",
    blocks: [
      "Las actividades de EmpatIA Digital pueden explicar o demostrar herramientas de inteligencia artificial de terceros. Sus respuestas o resultados pueden contener errores, sesgos o información desactualizada y deben verificarse antes de utilizarse para tomar decisiones relevantes.",
      "El acceso a servicios externos está sujeto a las condiciones, edades mínimas y políticas de privacidad de cada proveedor. Por ejemplo, ChatGPT exige tener al menos 13 años y, para menores de 18, el permiso de su padre, madre o representante legal. Si un estudiante no cumple esos requisitos o no cuenta con el permiso, no debe usar la herramienta: el docente o el facilitador realiza la actividad desde su propia cuenta y la comparte con el grupo.",
      "La Fundación no presenta esos servicios como sustitutos de orientación profesional ni garantiza la disponibilidad o exactitud de plataformas ajenas.",
      "El chat Oráculo tiene reglas propias, incluidas advertencias sobre su naturaleza automatizada, privacidad y manejo de situaciones de riesgo: https://empatia-digital.vercel.app/oraculo/terminos y https://empatia-digital.vercel.app/oraculo/privacidad.",
    ],
  },
  {
    id: "riesgo",
    title: "8. Convivencia, protección y situaciones de riesgo",
    blocks: [
      "Los recursos de EmpatIA Digital buscan prevenir conflictos y promover la convivencia. No constituyen un canal de emergencias ni sustituyen la Ruta de Atención Integral para la Convivencia Escolar, la atención de profesionales o los servicios de protección.",
      "Ante una emergencia o peligro inmediato, debe acudirse a los canales oficiales, como la línea 123. Para orientación y protección de niños, niñas y adolescentes, puede contactarse al ICBF en la línea 141. Las instituciones educativas y demás actores deben cumplir las obligaciones de protección y reporte que les correspondan según la ley.",
    ],
  },
  {
    id: "propiedad",
    title: "9. Propiedad intelectual y uso de materiales",
    blocks: [
      "Los textos, diseños, presentaciones, gráficos y demás contenidos de la plataforma pueden estar protegidos por derechos de autor o licencias de terceros.",
      "Los prompts, ejemplos y materiales educativos de EmpatIA Digital pueden copiarse, usarse y adaptarse libremente con fines educativos y sin ánimo de lucro, citando a EmpatIA Digital como fuente.",
      "No se autoriza atribuirse la autoría de materiales ajenos, eliminar créditos, explotar comercialmente contenidos protegidos ni utilizar logotipos o signos institucionales de manera que sugiera respaldo no otorgado. Estos términos no restringen las excepciones y limitaciones a los derechos de autor reconocidas por la ley.",
      "Los nombres y logotipos de herramientas de terceros que aparecen en la plataforma (por ejemplo, ChatGPT, Gemini, Claude o Tally) son marcas de sus respectivos titulares. Se muestran solo con fines educativos e informativos y no implican que esos titulares respalden o patrocinen EmpatIA Digital.",
    ],
  },
  {
    id: "enlaces",
    title: "10. Enlaces a terceros",
    blocks: [
      "El sitio puede incluir enlaces a herramientas educativas, formularios, plataformas de IA y otros recursos externos. Cada servicio externo es responsable de sus propias condiciones y prácticas de tratamiento de datos. Cuando EmpatIA Digital integre directamente uno de esos servicios para ejecutar sus actividades, se aplicarán además los deberes que legalmente correspondan a la Fundación y a las demás entidades involucradas.",
    ],
  },
  {
    id: "privacidad",
    title: "11. Privacidad y datos personales",
    blocks: [
      "El tratamiento de datos personales se rige por la Política de Privacidad y Tratamiento de Datos Personales de EmpatIA Digital, disponible en https://empatia-digital.vercel.app/privacidad. El chat Oráculo tiene además una política específica en https://empatia-digital.vercel.app/oraculo/privacidad.",
      "Aceptar estos términos no equivale automáticamente a otorgar autorizaciones para tratamientos de datos que requieran un consentimiento separado, ni para la publicación de fotografías de menores.",
    ],
  },
  {
    id: "disponibilidad",
    title: "12. Disponibilidad y cambios del servicio",
    blocks: [
      "La Fundación procurará mantener la plataforma disponible y en condiciones razonables de funcionamiento. Podrá realizar mantenimiento, corregir contenidos, suspender funciones o limitar accesos por razones técnicas, pedagógicas, de seguridad o legales, procurando informar los cambios relevantes cuando sea razonablemente posible.",
      "No se garantiza funcionamiento continuo e ininterrumpido, especialmente respecto de servicios prestados por terceros.",
    ],
  },
  {
    id: "responsabilidad",
    title: "13. Responsabilidad",
    blocks: [
      "Los contenidos tienen finalidad educativa y deben interpretarse considerando las circunstancias de cada caso. La Fundación no garantiza que toda información presentada por herramientas automatizadas o externas esté libre de errores.",
      "Nada de estos términos exonera a la Fundación, a las instituciones educativas ni a otros actores de las obligaciones legales que les correspondan, ni limita los derechos irrenunciables de niños, niñas, adolescentes o demás usuarios.",
    ],
  },
  {
    id: "consultas",
    title: "14. Consultas y reclamaciones",
    blocks: [
      "Para consultas relacionadas con el uso de la plataforma, puede escribirse a contacto@fporunasonrisa.com o comunicarse al +57 314 596 7994.",
      "Las solicitudes relativas a datos personales se tramitarán de acuerdo con el procedimiento y los plazos previstos en la Política de Privacidad y la Ley 1581 de 2012.",
    ],
  },
  {
    id: "modificaciones",
    title: "15. Modificaciones a estos términos",
    blocks: [
      "La Fundación podrá actualizar estos términos por cambios en la plataforma, la operación del proyecto o las normas aplicables. Se indicará la fecha de la versión vigente y se informarán oportunamente las modificaciones sustanciales por medios apropiados. Si una modificación requiere autorización adicional, esta deberá obtenerse antes del tratamiento correspondiente.",
    ],
  },
  {
    id: "ley",
    title: "16. Ley aplicable",
    blocks: [
      "Estos términos se interpretan conforme a las leyes de la República de Colombia. Cualquier controversia se someterá a los mecanismos y autoridades competentes previstos por el ordenamiento jurídico colombiano, sin afectar los derechos de los consumidores o de los titulares de datos personales cuando resulten aplicables.",
    ],
  },
  {
    id: "vigencia",
    title: "17. Vigencia",
    blocks: [
      "Estos términos rigen a partir de su publicación en el sitio web, el 18 de octubre de 2026. Versión 1.0.",
    ],
  },
];
