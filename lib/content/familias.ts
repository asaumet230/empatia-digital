import {
  AtSign,
  Gamepad2,
  Handshake,
  HeartHandshake,
  ImageOff,
  LockKeyhole,
  MessageCircleOff,
  MessageSquareWarning,
  MessagesSquare,
  MonitorSmartphone,
  Moon,
  Repeat,
  Share2,
  ShieldAlert,
  Smartphone,
  UserX,
  Utensils,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Sesión para familias — "Hogares conectados, familias empáticas"    */
/* ------------------------------------------------------------------ */

export const CONFLICTS_BLOCK = {
  title: "Los conflictos que más se repiten en casa",
  source:
    "Con base en orientaciones de UNICEF, la Academia Americana de Pediatría (AAP) y la Asociación Americana de Psicología (APA).",
  conflicts: [
    { label: "Límites de pantalla", icon: MonitorSmartphone },
    { label: "Videojuegos y sueño", icon: Gamepad2 },
    { label: "Redes sociales y privacidad", icon: LockKeyhole },
    { label: "Contenido compartido", icon: Share2 },
    { label: "Ciberacoso", icon: ShieldAlert },
    { label: "Dificultad para hablar con los padres", icon: MessageCircleOff },
  ],
  recommendationsTitle: "Las recomendaciones coinciden en algo",
  recommendations: [
    { label: "Conversaciones frecuentes", icon: MessagesSquare },
    { label: "Tono no acusatorio", icon: HeartHandshake },
    { label: "Acuerdos claros", icon: Handshake },
  ],
  instead: "En lugar de reaccionar únicamente cuando ya existe un problema.",
} as const;

/* ------------------------------------------------------------------ */
/*  Personalización: quién habla y con quién.                          */
/*  Los textos usan marcadores que se reemplazan según la elección:    */
/*  {hijo} {un_hijo} {el} {lo} {Lo} {adulto} {seguro}                  */
/* ------------------------------------------------------------------ */

export const SPEAKERS = [
  { id: "papa", label: "Papá", adulto: "padre", seguro: "seguro" },
  { id: "mama", label: "Mamá", adulto: "madre", seguro: "segura" },
  { id: "acudiente", label: "Acudiente", adulto: "acudiente", seguro: "seguro(a)" },
] as const;

export const CHILDREN = [
  { id: "hijo", label: "Mi hijo", hijo: "hijo", un_hijo: "un hijo", el: "él", lo: "lo" },
  { id: "hija", label: "Mi hija", hijo: "hija", un_hijo: "una hija", el: "ella", lo: "la" },
] as const;

export type Speaker = (typeof SPEAKERS)[number];
export type Child = (typeof CHILDREN)[number];

export const personalize = (text: string, speaker: Speaker, child: Child) =>
  text
    .replaceAll("{un_hijo}", child.un_hijo)
    .replaceAll("{hijo}", child.hijo)
    .replaceAll("{el}", child.el)
    .replaceAll("{lo}", child.lo)
    .replaceAll("{Lo}", child.lo[0].toUpperCase() + child.lo.slice(1))
    .replaceAll("{adulto}", speaker.adulto)
    .replaceAll("{seguro}", speaker.seguro);

export const FINISH = "Finaliza la simulación";

/** Common ending of every scenario: the role-play and the feedback request. */
const ROLEPLAY = `Interpreta a mi {hijo} adolescente y responde como {el} mientras yo hago de {adulto}. Cuando yo diga: “${FINISH}”, dime qué hice bien, qué podría mejorar y cómo habría podido comunicarme mejor.`;

export interface FamilyCase {
  id: string;
  title: string;
  situation: string;
  /** Escenario para ChatGPT, sin la parte común del juego de roles. */
  scenario: string;
  /** "¿Cómo comienza el padre?" */
  opening: string;
  icon: LucideIcon;
}

export const FAMILY_CASES: readonly FamilyCase[] = [
  {
    id: "videojuegos",
    title: "No quiere dejar los videojuegos",
    situation: "No quiere dejar los videojuegos para hacer tareas u oficios.",
    scenario:
      "Tengo {un_hijo} de 15 años que se molesta cuando le pido que deje los videojuegos para hacer tareas u oficios de la casa. Quiero practicar cómo poner límites sin convertirlo en una pelea.",
    opening:
      "Sé que estás en una partida y entiendo que no quieres dejar a tu equipo. Cuando termines, necesitamos hablar de cómo vamos a organizar el tiempo para jugar y cumplir con tus responsabilidades.",
    icon: Gamepad2,
  },
  {
    id: "celular",
    title: "Demasiado tiempo con el celular",
    situation: "Pasa gran parte de su tiempo libre con el celular y discuten frecuentemente por este tema.",
    scenario:
      "Tengo {un_hijo} de 14 años que pasa gran parte de su tiempo libre con el celular y discutimos frecuentemente por este tema. Quiero hablar con {el} y establecer límites sin que sienta que solamente quiero quitarle el teléfono.",
    opening:
      "No quiero empezar esta conversación quitándote el teléfono. Quiero entender primero qué haces ahí y después mirar juntos cómo podemos organizar mejor el tiempo.",
    icon: Smartphone,
  },
  {
    id: "noche",
    title: "Celular hasta altas horas de la noche",
    situation: "Usa el teléfono hasta muy tarde y al día siguiente tiene dificultad para levantarse.",
    scenario:
      "Tengo {un_hijo} de 14 años que utiliza el celular hasta muy tarde y al día siguiente tiene dificultad para levantarse para estudiar. Quiero establecer horarios para el uso del teléfono sin convertir el tema en una pelea diaria.",
    opening:
      "He notado que últimamente estás usando el teléfono hasta muy tarde. No quiero regañarte; quiero que miremos juntos si esto está afectando tu descanso.",
    icon: Moon,
  },
  {
    id: "comidas",
    title: "Celular durante las comidas",
    situation: "Usa el celular durante las comidas y cada vez conversa menos con la familia.",
    scenario:
      "Tengo {un_hijo} de 14 años que utiliza el celular durante las comidas y cada vez conversa menos con la familia. Quiero establecer un acuerdo para tener momentos sin teléfonos en casa.",
    opening:
      "Me gustaría que recuperáramos un espacio para hablar como familia. ¿Qué te parecería que durante la comida todos, incluidos nosotros, dejemos los teléfonos a un lado?",
    icon: Utensils,
  },
  {
    id: "foto",
    title: "Compartió una foto sin permiso",
    situation: "Compartió una foto, video o mensaje de otra persona sin pedir permiso.",
    scenario:
      "Me enteré de que mi {hijo} adolescente compartió una foto, video o mensaje de un compañero sin pedirle permiso. Quiero hablar con {el} para que comprenda la importancia de la privacidad sin comenzar acusándo{lo}.",
    opening:
      "Quiero hablar contigo sobre algo que compartiste. Antes de sacar conclusiones, quiero entender qué ocurrió y qué pensabas cuando decidiste enviarlo.",
    icon: ImageOff,
  },
  {
    id: "memes",
    title: "Memes, bromas o burlas",
    situation: "Participa en memes, comentarios o bromas sobre otro compañero en un grupo digital.",
    scenario:
      "Descubrí que mi {hijo} adolescente ha participado en memes, comentarios o bromas sobre otro compañero en un grupo digital. Quiero conversar con {el} sobre cómo esas acciones pueden afectar a otra persona.",
    opening:
      "Vi que están circulando algunas bromas sobre un compañero. Quiero entender cómo empezó y cómo crees que podría sentirse esa persona al verlas.",
    icon: MessageSquareWarning,
  },
  {
    id: "no-quiere-hablar",
    title: "Algo ocurrió en redes, pero no quiere hablar",
    situation: "Cambia de ánimo después de mirar el celular y responde “nada” cuando le preguntan qué pasa.",
    scenario:
      "Mi {hijo} adolescente últimamente cambia de ánimo después de mirar el celular. Cuando le pregunto qué pasa responde “nada” y no quiere hablar. Quiero acercarme sin presionar{lo} ni interrogar{lo}.",
    opening:
      "He notado que después de mirar el teléfono quedas diferente. No tienes que contarme nada ahora, pero quiero que sepas que puedes hablar conmigo y voy a intentar escucharte antes de reaccionar.",
    icon: MessageCircleOff,
  },
  {
    id: "exclusion",
    title: "Exclusión o posible ciberacoso",
    situation: "{Lo} sacaron de un grupo de WhatsApp y algunos compañeros se burlan de {el} por redes sociales.",
    scenario:
      "Mi {hijo} adolescente me cuenta que {lo} sacaron de un grupo de WhatsApp y que algunos compañeros se burlan de {el} por redes sociales. Quiero saber cómo escuchar{lo} y acompañar{lo} antes de reaccionar o tomar decisiones.",
    opening:
      "Quiero entender bien lo que ocurrió. Cuéntame desde el principio y primero voy a escucharte. Después vemos juntos qué podemos hacer.",
    icon: UserX,
  },
  {
    id: "red-social",
    title: "Quiere una red social porque todos sus amigos la tienen",
    situation: "Quiere usar una red social porque dice que todos sus amigos ya la tienen.",
    scenario:
      "Mi {hijo} de 13 años quiere utilizar una red social porque dice que todos sus amigos ya la tienen. Se molesta cuando le digo que todavía no estoy {seguro} de permitírselo. Quiero conversar con {el} sobre riesgos, responsabilidades y límites sin responder simplemente “no”.",
    opening:
      "Antes de decirte que sí o que no, quiero entender por qué es importante para ti tenerla y qué hacen tus amigos allí.",
    icon: AtSign,
  },
  {
    id: "tu-tambien",
    title: "“Tú también estás todo el día con el celular”",
    situation: "Cuestiona las reglas porque los adultos de la casa también usan mucho el teléfono.",
    scenario:
      "Estoy intentando establecer reglas sobre el uso del celular con mi {hijo} adolescente, pero {el} me responde que los adultos de la casa también usamos demasiado el teléfono. Quiero conversar sin ponerme a la defensiva y construir reglas que puedan aplicar para todos.",
    opening:
      "Tienes razón en que nosotros también usamos mucho el teléfono. Si vamos a poner reglas, deberían aplicarnos a todos. Pensemos qué podemos cambiar como familia.",
    icon: Repeat,
  },
];

/** The full text to paste in ChatGPT for a case. */
export const casePrompt = (c: FamilyCase) => `${c.scenario} ${ROLEPLAY}`;

export const CASES_BLOCK = {
  title: "Elige un caso y practica",
  speakerLabel: "Soy",
  childLabel: "Hablo con",
  hint: "Escoge el caso que más se parezca a lo que vives en casa.",
  steps: {
    scenario: "Copia el caso y pégalo en ChatGPT",
    opening: "Empieza la conversación con esta frase",
    finish: "Cuando quieras terminar, escribe",
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Cómo funciona el simulador — conversación de muestra (ilustrativa) */
/* ------------------------------------------------------------------ */

export const SIMULATOR_BLOCK = {
  title: "Cómo funciona el simulador",
  steps: [
    "Escoge un caso",
    "Copia el escenario en ChatGPT",
    "Empieza la conversación con la frase sugerida",
    `Cuando quieras terminar, escribe “${FINISH}”`,
  ],
  sample: "Conversación de ejemplo",
  chat: [
    { from: "adult", text: FAMILY_CASES[0].opening },
    { from: "teen", text: "Ya voy… déjame terminar esta partida. Siempre me pides cosas justo cuando estoy jugando." },
    { from: "adult", text: "Te entiendo. Por eso quiero que acordemos juntos un horario que funcione para los dos." },
    { from: "adult", text: `${FINISH}.` },
  ],
  feedbackTitle: "La IA deja de ser el adolescente y te explica:",
  feedback: ["Qué hiciste bien", "Qué podrías mejorar", "Cómo habrías podido comunicarte mejor"],
} as const;

export const FAMILY_KEY_IDEA = {
  quote:
    "La IA no viene a enseñar a criar a nuestros hijos. Puede funcionar como un simulador para practicar conversaciones difíciles antes de tenerlas en la vida real.",
} as const;
