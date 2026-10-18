/* ------------------------------------------------------------------ */
/*  Política de privacidad del sitio EmpatIA Digital (/privacidad).    */
/*  Texto entregado por el usuario el 2026-10-18, con correcciones    */
/*  para que describa lo que la página hace de verdad: sin cookies    */
/*  de seguimiento, pretest y postest en Google Forms, votaciones en   */
/*  Mentimeter, alojamiento en Vercel. El Oráculo tiene su propia      */
/*  política (/oraculo/privacidad).                                    */
/* ------------------------------------------------------------------ */

/** A paragraph, or a list of short points. */
export type PolicyBlock = string | { list: readonly string[] };

export interface PolicySection {
  id: string;
  title: string;
  blocks: readonly PolicyBlock[];
}

export const PRIVACY_META = {
  title: "Política de privacidad y tratamiento de datos personales",
  version: "1.0",
  updated: "18 de octubre de 2026",
  site: "https://empatia-digital.vercel.app",
} as const;

/** Plain-language summary shown first: most readers are families and teachers. */
export const PRIVACY_SUMMARY: readonly string[] = [
  "Esta página web no pide registro, no usa cookies de seguimiento ni de publicidad y no guarda lo que haces en ella.",
  "Los únicos datos se recogen en los formularios del pretest y el postest (Google Forms), con la autorización que corresponda.",
  "Los datos se usan solo para el proyecto educativo y los informes se hacen con resultados generales, sin identificar a nadie.",
  "Los datos de niños, niñas y adolescentes tienen protección especial.",
  "Puedes consultar, corregir o pedir que se borren tus datos escribiendo a contacto@fporunasonrisa.com.",
];

export const PRIVACY_POLICY: readonly PolicySection[] = [
  {
    id: "presentacion",
    title: "1. Presentación y objetivo",
    blocks: [
      "EmpatIA Digital es una estrategia educativa desarrollada en articulación con la Alcaldía Distrital de Barranquilla, a través de su Secretaría Distrital de Educación, y ejecutada por la Fundación Por Una Sonrisa.",
      "Su propósito es promover la convivencia escolar, la resolución pacífica de conflictos, la ciudadanía digital y el uso ético, crítico y responsable de la inteligencia artificial entre estudiantes, docentes y familias.",
      "La Fundación Por Una Sonrisa reconoce la importancia de proteger la privacidad, la intimidad y los datos personales de todas las personas que participan en esta iniciativa, especialmente de los niños, niñas y adolescentes.",
      "La presente Política de Privacidad y Tratamiento de Datos Personales establece las condiciones bajo las cuales se recopila, utiliza, almacena, consulta, transmite, protege y elimina la información personal relacionada con EmpatIA Digital.",
      "Esta política se fundamenta en:",
      {
        list: [
          "Artículo 15 de la Constitución Política de Colombia.",
          "Ley Estatutaria 1581 de 2012.",
          "Decreto 1074 de 2015.",
          "Ley 1098 de 2006, Código de Infancia y Adolescencia.",
          "Ley 1620 de 2013, sobre convivencia escolar.",
          "Circular Externa 002 de 2024 de la Superintendencia de Industria y Comercio, sobre tratamiento de datos personales en sistemas de inteligencia artificial.",
          "Demás disposiciones aplicables.",
        ],
      },
    ],
  },
  {
    id: "responsable",
    title: "2. Responsable del tratamiento de datos personales",
    blocks: [
      "Para los tratamientos respecto de los cuales determina las finalidades y los medios, la entidad responsable es:",
      {
        list: [
          "Fundación Por Una Sonrisa",
          "NIT: 900.804.571-1",
          "Domicilio: Barranquilla, Atlántico, Colombia.",
          "Dirección: Calle 75 #57-38, Barranquilla.",
          "Representante legal: Noris Osorio de Martínez.",
          "Correo electrónico: contacto@fporunasonrisa.com",
          "Teléfono: +57 314 596 7994.",
          "Sitio web: https://fporunasonrisa.com",
        ],
      },
      "La Fundación Por Una Sonrisa ejerce las funciones de ejecución y administración de EmpatIA Digital en el marco de las facultades otorgadas por la Alcaldía Distrital de Barranquilla.",
      "La Secretaría Distrital de Educación participa como entidad institucional articuladora de la estrategia.",
      "Las responsabilidades que legalmente correspondan a la Alcaldía, las instituciones educativas u otras entidades respecto de tratamientos específicos se determinarán conforme a sus funciones efectivas y los acuerdos aplicables.",
    ],
  },
  {
    id: "ambito",
    title: "3. Ámbito de aplicación",
    blocks: [
      "Esta política se aplica a los datos personales tratados en el marco de EmpatIA Digital, particularmente mediante:",
      {
        list: [
          "La plataforma web oficial (https://empatia-digital.vercel.app).",
          "Las actividades educativas dirigidas a estudiantes.",
          "Las capacitaciones para docentes.",
          "Las actividades formativas para padres, madres y cuidadores.",
          "Los formularios de pretest y postest.",
          "Las votaciones en clase, cuando se hagan con herramientas digitales.",
          "Las actividades de formación y socialización del proyecto.",
          "Los canales institucionales de contacto.",
          "Los procesos de gestión administrativa y seguimiento educativo relacionados con la estrategia.",
        ],
      },
      "La política comprende tanto el tratamiento realizado en medios digitales como aquel efectuado en documentos físicos, cuando corresponda a la ejecución de EmpatIA Digital.",
      "Tratamiento especial del chat Oráculo: el componente denominado Oráculo, que utiliza inteligencia artificial para orientar conversaciones sobre convivencia escolar, acoso y ciberacoso, dispone de una política de privacidad específica que complementa el presente documento, disponible en https://empatia-digital.vercel.app/oraculo/privacidad.",
    ],
  },
  {
    id: "que-recoge-el-sitio",
    title: "4. Qué datos recoge esta página web",
    blocks: [
      "La página web de EmpatIA Digital es una presentación educativa. No pide registro ni inicio de sesión, no tiene formularios propios, no usa cookies de analítica, publicidad o seguimiento y no guarda en el navegador lo que la persona hace en ella.",
      "Como cualquier sitio en Internet, el servicio de alojamiento (Vercel) registra de forma automática datos técnicos mínimos —como la dirección IP, el tipo de navegador y la hora de la visita— para que la página funcione y se mantenga segura. Estos registros no se usan para identificar ni hacer seguimiento a las personas.",
      "La página contiene enlaces a sitios de terceros, como ChatGPT, Gemini, Claude, Tally y otras herramientas de inteligencia artificial. Al abrirlos, la persona sale de EmpatIA Digital y se aplican las políticas de privacidad de cada uno de esos sitios, que la Fundación no controla.",
    ],
  },
  {
    id: "datos",
    title: "5. Datos personales que pueden ser tratados",
    blocks: [
      "Fuera de la página web, en los formularios y actividades del proyecto, la Fundación Por Una Sonrisa podrá tratar las siguientes categorías de información, solo en la medida en que cada formulario o actividad lo pida y con las autorizaciones correspondientes.",
      "Datos de identificación:",
      {
        list: [
          "Nombres y apellidos, cuando sean necesarios.",
          "Institución educativa.",
          "Rol del participante: estudiante, docente, padre, madre o cuidador.",
          "Grado escolar, cuando corresponda.",
          "Edad o rango de edad.",
        ],
      },
      "Datos de contacto, cuando sean necesarios: correo electrónico, número telefónico e información de contacto de padres, madres o representantes legales.",
      "Datos relacionados con actividades educativas:",
      {
        list: [
          "Respuestas a los formularios de pretest y postest.",
          "Información sobre participación en actividades formativas.",
          "Percepciones sobre convivencia escolar y ciudadanía digital.",
          "Resultados de actividades pedagógicas.",
          "Información necesaria para evaluar el impacto de la estrategia.",
        ],
      },
      "Datos sensibles: algunas actividades relacionadas con convivencia escolar podrían involucrar información que revele aspectos sensibles de la vida personal de los participantes. El suministro de datos sensibles es facultativo. Ninguna persona estará obligada a proporcionar esta información como condición para acceder a los contenidos educativos. Cuando su tratamiento resulte necesario y legalmente procedente, se implementarán garantías reforzadas de confidencialidad, seguridad, proporcionalidad y protección de los derechos de los titulares.",
    ],
  },
  {
    id: "finalidades",
    title: "6. Finalidades del tratamiento",
    blocks: [
      "La información personal será utilizada exclusivamente para finalidades legítimas, específicas e informadas relacionadas con EmpatIA Digital:",
      {
        list: [
          "Gestionar la participación de estudiantes, docentes y familias en las actividades de la estrategia.",
          "Desarrollar experiencias educativas sobre convivencia escolar, ciudadanía digital e inteligencia artificial.",
          "Aplicar los formularios de pretest y postest.",
          "Evaluar los conocimientos adquiridos y los resultados de las intervenciones pedagógicas.",
          "Elaborar estadísticas, informes de gestión y reportes de resultados del proyecto.",
          "Presentar resultados educativos e institucionales a las entidades competentes, conforme a las obligaciones aplicables.",
          "Facilitar la comunicación relacionada con actividades, convocatorias y participación.",
          "Garantizar el funcionamiento, mantenimiento y seguridad de la plataforma.",
          "Atender consultas, solicitudes y reclamaciones de los titulares.",
          "Cumplir obligaciones legales, administrativas y contractuales relacionadas con la ejecución del proyecto.",
        ],
      },
      "Siempre que sea posible, los informes estadísticos y de resultados utilizarán datos agregados o debidamente anonimizados.",
      "La información personal no será vendida, comercializada ni utilizada para publicidad.",
    ],
  },
  {
    id: "autorizacion",
    title: "7. Autorización para el tratamiento",
    blocks: [
      "Cuando sea legalmente necesaria, la Fundación Por Una Sonrisa solicitará autorización previa, expresa e informada para el tratamiento de datos personales, mediante formularios físicos, electrónicos u otros mecanismos que permitan conservar prueba de su otorgamiento.",
      "Antes de recopilar información, se comunicará al titular:",
      {
        list: [
          "La identidad del responsable del tratamiento.",
          "Las finalidades para las cuales se utilizarán sus datos.",
          "Sus derechos como titular.",
          "Los canales para presentar consultas y reclamos.",
          "El carácter facultativo de proporcionar datos sensibles.",
          "Las condiciones especiales aplicables al tratamiento de datos de menores de edad.",
        ],
      },
      "Cuando exista una excepción legal al requisito de autorización, se observarán igualmente los principios y deberes aplicables en materia de protección de datos personales.",
    ],
  },
  {
    id: "menores",
    title: "8. Protección especial de niños, niñas y adolescentes",
    blocks: [
      "EmpatIA Digital está dirigida, entre otros participantes, a estudiantes de instituciones educativas de Barranquilla, principalmente adolescentes entre los 13 y 16 años. Sus datos personales requieren medidas especiales de protección, por lo que su tratamiento respetará:",
      {
        list: [
          "La prevalencia del interés superior del menor.",
          "La protección de sus derechos fundamentales.",
          "El respeto de su intimidad y privacidad.",
          "La recolección de la información estrictamente necesaria.",
          "El acceso restringido a personas autorizadas.",
          "La seguridad y confidencialidad.",
          "El respeto de su autonomía progresiva.",
        ],
      },
      "Cuando corresponda, se obtendrá la autorización previa del padre, madre o representante legal y se tendrá en cuenta la opinión del menor de acuerdo con su edad y madurez.",
      "Los datos personales de estudiantes no serán utilizados para crear perfiles comerciales, dirigir publicidad ni adoptar decisiones discriminatorias. Los resultados de los formularios o evaluaciones no serán divulgados públicamente de manera que permitan identificar individualmente a menores de edad.",
      "La participación en el Oráculo estará sujeta, además, a los mecanismos específicos de autorización y protección establecidos para dicho servicio.",
    ],
  },
  {
    id: "pretest",
    title: "9. Pretest, postest y votaciones en clase",
    blocks: [
      "El pretest y el postest son formularios de Google Forms que se responden antes y después de la sesión, para evaluar conocimientos y percepciones sobre la convivencia escolar y el uso responsable de la inteligencia artificial. Sus respuestas se usarán para:",
      {
        list: [
          "Identificar necesidades formativas.",
          "Evaluar los resultados de las capacitaciones.",
          "Comparar resultados generales antes y después de las intervenciones.",
          "Elaborar informes educativos y estadísticos.",
          "Proponer acciones de fortalecimiento de la convivencia escolar.",
        ],
      },
      "El tratamiento de las respuestas se limitará a estas finalidades. Cuando los formularios sean anónimos, no se solicitarán datos de identificación directa y se adoptarán medidas para evitar la reidentificación de los participantes. Si una evaluación requiere relacionar respuestas individuales entre el pretest y el postest, se informará previamente y se implementarán medidas de protección apropiadas.",
      "En algunas actividades el curso vota con Mentimeter. Las votaciones son anónimas y no piden datos personales; también se puede votar a mano alzada.",
    ],
  },
  {
    id: "imagenes",
    title: "10. Registro fotográfico y audiovisual",
    blocks: [
      "Durante las actividades presenciales podrán realizarse registros fotográficos o audiovisuales para documentar la ejecución del proyecto, elaborar informes institucionales y socializar sus resultados. Cuando las imágenes permitan identificar personas, se considerarán datos personales y su captura, uso, conservación y publicación deberán contar con el fundamento jurídico correspondiente.",
      "En el caso de niños, niñas y adolescentes se aplicarán garantías especiales, incluida la autorización del representante legal cuando corresponda y la consideración de la opinión del menor.",
      "La autorización para participar en una actividad educativa no implica autorización para divulgar públicamente imágenes, videos o testimonios identificables. Su publicación en páginas web, redes sociales o materiales promocionales estará sujeta a las autorizaciones y demás condiciones legales correspondientes.",
    ],
  },
  {
    id: "proveedores",
    title: "11. Proveedores tecnológicos",
    blocks: [
      "EmpatIA Digital usa los siguientes proveedores tecnológicos:",
      {
        list: [
          "Vercel Inc.: aloja la página web.",
          "Google LLC (Google Forms): recibe y guarda las respuestas del pretest y el postest.",
          "Mentimeter AB: votaciones anónimas en clase, cuando se usan.",
          "OpenAI: procesa las conversaciones del Oráculo, según se describe en su política específica.",
        ],
      },
      "Cuando estos proveedores tengan acceso a datos personales, la Fundación establecerá las condiciones y medidas de protección aplicables, de acuerdo con las funciones que desempeñen. Los datos personales no serán comunicados a proveedores para finalidades incompatibles con las informadas a los titulares.",
    ],
  },
  {
    id: "internacional",
    title: "12. Transmisión y transferencia internacional de datos",
    blocks: [
      "Algunos de estos proveedores procesan información fuera de Colombia: Vercel, Google y OpenAI en Estados Unidos, y Mentimeter en la Unión Europea.",
      "Las transmisiones internacionales se sujetarán a las obligaciones y garantías contractuales correspondientes, y las transferencias internacionales se efectuarán únicamente cuando exista una condición legal que las permita. En todos los casos se procurará que los proveedores apliquen medidas apropiadas de confidencialidad, seguridad y protección de los derechos de los titulares.",
    ],
  },
  {
    id: "seguridad",
    title: "13. Seguridad de la información",
    blocks: [
      "La Fundación Por Una Sonrisa adoptará medidas técnicas, administrativas y organizativas proporcionales a los riesgos del tratamiento, que comprenderán, según corresponda:",
      {
        list: [
          "Conexiones seguras (HTTPS) en la página web.",
          "Controles de acceso a los formularios y a sus respuestas.",
          "Gestión de permisos y credenciales.",
          "Restricciones para consultar información de menores.",
          "Procedimientos para la gestión de incidentes de seguridad.",
          "Eliminación segura de información cuando corresponda.",
          "Controles sobre los proveedores tecnológicos.",
        ],
      },
      "En caso de incidentes que comprometan información personal, se adoptarán las medidas correctivas y las notificaciones exigidas por la legislación aplicable.",
    ],
  },
  {
    id: "conservacion",
    title: "14. Conservación de datos personales",
    blocks: [
      "Los datos personales se conservarán durante el tiempo necesario para cumplir las finalidades informadas y las obligaciones legales, administrativas o contractuales correspondientes, según la categoría de información.",
      "Una vez cumplidas las finalidades, y siempre que no exista una obligación legítima de conservación, los datos serán eliminados o anonimizados conforme a los procedimientos legalmente establecidos.",
    ],
  },
  {
    id: "derechos",
    title: "15. Derechos de los titulares",
    blocks: [
      "De acuerdo con la Ley 1581 de 2012, los titulares de datos personales podrán:",
      {
        list: [
          "Conocer, actualizar y rectificar sus datos personales.",
          "Solicitar prueba de la autorización otorgada, salvo las excepciones legales.",
          "Ser informados acerca del uso de sus datos.",
          "Acceder gratuitamente a los datos personales objeto de tratamiento.",
          "Presentar consultas y reclamos.",
          "Solicitar la revocatoria de la autorización o la supresión de información cuando legalmente proceda.",
          "Presentar quejas ante la Superintendencia de Industria y Comercio, una vez cumplido el requisito legal de reclamación previa.",
        ],
      },
      "En el caso de menores de edad, estos derechos podrán ejercerse mediante sus representantes legales, respetando las disposiciones aplicables y su autonomía progresiva.",
    ],
  },
  {
    id: "consultas",
    title: "16. Atención de consultas y reclamos",
    blocks: [
      "Los titulares o sus representantes legales podrán presentar solicitudes relacionadas con sus datos personales a la Fundación Por Una Sonrisa:",
      {
        list: [
          "Correo electrónico: contacto@fporunasonrisa.com",
          "Teléfono: +57 314 596 7994.",
          "Dirección: Calle 75 #57-38, Barranquilla, Atlántico.",
        ],
      },
      "Las solicitudes deberán describir claramente la petición y aportar la información necesaria para verificar la identidad o representación del solicitante, sin exigir datos innecesarios.",
      "Consultas: serán atendidas dentro de los diez (10) días hábiles siguientes a su recepción. Cuando no sea posible responder en ese plazo, se informarán los motivos y la nueva fecha de respuesta, que no podrá exceder cinco (5) días hábiles adicionales.",
      "Reclamos: se atenderán dentro de los quince (15) días hábiles siguientes al día posterior a su recepción completa. Cuando no sea posible responder dentro de ese término, se informará al solicitante y se señalará una nueva fecha, que no podrá superar ocho (8) días hábiles adicionales. Los reclamos incompletos y las demás etapas del procedimiento se tramitarán conforme a la Ley 1581 de 2012.",
    ],
  },
  {
    id: "cookies",
    title: "17. Cookies y tecnologías similares",
    blocks: [
      "La página web de EmpatIA Digital no usa cookies de analítica, publicidad ni seguimiento, y no guarda información de la persona en su navegador.",
      "El chat Oráculo guarda la conversación solo en la pestaña abierta del navegador, mientras dura la sesión, según se explica en su política específica.",
      "Si en el futuro se incorporan herramientas de analítica o seguimiento, se informará previamente y se solicitarán las autorizaciones correspondientes.",
    ],
  },
  {
    id: "resultados",
    title: "18. Publicación de información y resultados",
    blocks: [
      "Los informes de resultados de EmpatIA Digital podrán compartirse con las entidades vinculadas al proyecto y utilizarse para evaluar el cumplimiento de sus objetivos educativos. Siempre que sea posible, se emplearán resultados agregados o debidamente anonimizados.",
      "La publicación de fotografías, testimonios o información que permita identificar participantes requerirá un fundamento jurídico válido y garantías especiales cuando involucre menores de edad. La información no se divulgará públicamente para finalidades incompatibles con las autorizadas o legalmente permitidas.",
    ],
  },
  {
    id: "modificaciones",
    title: "19. Modificaciones de la política",
    blocks: [
      "La Fundación Por Una Sonrisa podrá actualizar esta política cuando se presenten modificaciones normativas, institucionales o tecnológicas, o cambios en las finalidades del tratamiento. Las modificaciones sustanciales se comunicarán oportunamente antes de implementar los tratamientos afectados.",
      "La versión vigente puede consultarse en https://empatia-digital.vercel.app/privacidad.",
    ],
  },
  {
    id: "vigencia",
    title: "20. Vigencia",
    blocks: [
      "La presente política rige a partir de su publicación, el 18 de octubre de 2026. Versión 1.0.",
      "La vigencia de las bases de datos se determinará conforme a las finalidades y los periodos de conservación definidos por la Fundación y las obligaciones legales o contractuales aplicables.",
    ],
  },
];
