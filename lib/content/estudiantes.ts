import {
  HeartHandshake,
  Megaphone,
  RectangleVertical,
  ShieldCheck,
  Square,
  Sticker,
  UserX,
  Users,
  type LucideIcon,
} from "lucide-react";
import { partsFor } from "@/lib/content/prompt-encuesta";

/* ------------------------------------------------------------------------ */
/*  Sesión para estudiantes — "Ciudadanía digital y creadores de paz con IA" */
/* ------------------------------------------------------------------------ */

export interface IntroConcept {
  question: string;
  answer: string;
  /** Words of the answer to highlight. */
  keywords: readonly string[];
  icon: LucideIcon;
}

export const STUDENT_INTRO = {
  title: "Antes de empezar",
  concepts: [
    {
      question: "¿Qué es ciudadanía digital?",
      answer: "Es aprender a usar Internet, redes sociales y tecnología de forma responsable, respetuosa y segura.",
      keywords: ["responsable", "respetuosa", "segura"],
      icon: ShieldCheck,
    },
    {
      question: "¿Qué es ciberacoso?",
      answer:
        "Es cuando una persona utiliza chats, redes sociales o medios digitales para molestar, humillar, amenazar o excluir repetidamente a otra persona.",
      keywords: ["repetidamente"],
      icon: UserX,
    },
    {
      question: "¿Cómo las redes pueden agrandar un problema?",
      answer:
        "Porque una foto, comentario o burla puede compartirse rápidamente, llegar a muchas personas y continuar incluso después de que alguien pida que se detenga.",
      keywords: ["rápidamente", "muchas personas", "continuar"],
      icon: Megaphone,
    },
  ] satisfies IntroConcept[],
} as const;

/* ------------------------------------------------------------------ */
/*  "¿Broma o problema?" — votaciones y prompts alrededor del juego    */
/* ------------------------------------------------------------------ */

export interface Poll {
  question: string;
  /** Emoji or letter shown before each option. */
  options: readonly { mark: string; text: string }[];
}

/** Where the class votes: Mentimeter, or hands up if the connection fails. */
export const POLL_HINT = "Vota en Mentimeter · o a mano alzada";

/** The story in words, so ChatGPT knows which case it is analyzing. */
const CASE_TEXT = `En el grupo de chat de un curso de noveno grado, Mateo comparte una foto que le tomó a su compañera Valentina sin que ella se diera cuenta. Otro compañero le pone orejas de conejo a la foto y varios escriben burlas y emojis de risa. Después, alguien toma una captura y la publica en una red social de videos cortos con el texto "Siempre en la suya… 😂". En menos de una hora tiene cientos de comentarios y la han compartido más de 300 veces. Valentina escribe en el grupo que no dio permiso, que se siente muy incómoda y pide que lo borren. Varios le responden: "Era solo una broma" y "No exageres".`;

export interface AiStep {
  title: string;
  lead: string;
  prompt: string;
  /** Prompts that continue the same conversation can't be opened in a new ChatGPT chat. */
  sameChat: boolean;
  /** What happens once ChatGPT answers. */
  then: { label: string; text: string; poll?: string };
}

export const AI_STEPS = {
  miradas: {
    title: "Le preguntamos a la IA",
    lead: "Tres puntos de vista del mismo caso.",
    prompt: `Este es un caso ficticio de un colegio:

${CASE_TEXT}

Analiza este caso desde 3 puntos de vista:
1. la persona afectada,
2. quien publicó la imagen,
3. quienes comentaron o compartieron.

Para cada uno dime en una frase:
- qué podría estar sintiendo,
- qué podría estar pensando,
- qué podría hacer ahora.

No asumas que sabes exactamente lo que sienten. Usa un lenguaje sencillo, para estudiantes de 14 a 17 años.`,
    sameChat: false,
    then: { label: "Ahora viene lo interesante", text: "¿La IA acertó?" },
  },
  propone: {
    title: "La IA propone",
    lead: "En el juego ustedes decidieron. Ahora veamos qué propone la IA.",
    prompt: `En el caso anterior, el conflicto sigue creciendo.

Propón 3 acciones que un estudiante de 14 a 17 años podría hacer AHORA para detenerlo.

Las acciones deben ser realistas, no agresivas y no exponer nuevamente a la persona afectada.
Explica cada una en máximo una frase.`,
    sameChat: true,
    then: {
      label: "Su misión",
      text: "🚨 ¿Qué podría salir mal?",
      poll: "Si un estudiante hiciera exactamente lo que dice la IA, ¿qué podría salir mal?",
    },
  },
  mejora: {
    title: "La IA mejora",
    lead: "Le devolvemos a la IA lo que ustedes encontraron.",
    prompt: `Los estudiantes detectaron estos problemas en tus soluciones:

[PEGA AQUÍ 2 O 3 RESPUESTAS DE LOS ESTUDIANTES]

Mejora tus 3 soluciones teniendo en cuenta esas críticas.
Hazlas más realistas para adolescentes y evita que la intervención empeore el conflicto.`,
    sameChat: true,
    then: { label: "Lo que acaba de pasar", text: "La IA propuso. Ustedes cuestionaron. Y ahora la IA mejoró." },
  },
} as const satisfies Record<string, AiStep>;

export const CLOSING = {
  steps: [
    { mark: "🤖", text: "La IA propone" },
    { mark: "🧠", text: "Tú cuestionas" },
    { mark: "❤️", text: "Tú decides" },
  ],
  question: "¿Qué aprendimos?",
  idea: "La IA puede ayudarnos a ver otras perspectivas, pero no puede decidir por nosotros cómo tratar a otra persona.",
  final: ["El algoritmo busca reacciones.", "Nosotros elegimos las acciones."],
} as const;

/* ------------------------------------------------------------------ */
/*  Juego "El algoritmo del conflicto" — decisiones con costo          */
/* ------------------------------------------------------------------ */

/** How a decision lands on Valentina: it keeps her company, changes nothing, or hurts. */
export type Feeling = "acompana" | "igual" | "duele";

export const FEELINGS = {
  acompana: { emoji: "❤️", label: "Valentina se siente acompañada" },
  igual: { emoji: "➖", label: "Para Valentina nada cambia" },
  duele: { emoji: "💔", label: "Valentina se siente peor" },
} as const satisfies Record<Feeling, { emoji: string; label: string }>;

export interface GameOption {
  text: string;
  /** What happens next — every option has a cost or a catch; none is "the right one". */
  consequence: string;
  /** People who start (or stop) seeing the photo. */
  reach: number;
  feeling: Feeling;
  /** Keeping a copy: it comes back later in the story. */
  keepsCopy?: boolean;
}

export interface GameScene {
  title: string;
  /** Who you are in this scene. */
  role: string;
  situation: string;
  question: string;
  image: { src: string; alt: string };
  options: readonly GameOption[];
  /** "Para pensar", shown after choosing. */
  insight?: string;
}

export const GAME = {
  title: "El algoritmo del conflicto",
  reachLabel: "Personas viendo la foto",
  start: "Empezar",
  startNote: "5 escenas · 40 segundos para decidir cada una",
  secondsPerDecision: 40,
  timeUp: "¡Tiempo!",
  randomPick: "Se acabó el tiempo: el juego eligió al azar.",
  startReach: 23,
  next: "Siguiente escena",
  finish: "Ver cómo terminó",
  restart: "Jugar de nuevo",
  afterGame: "Ahora veamos qué dice la IA",
  scenes: [
    {
      title: "Una foto sin permiso",
      role: "Eres un compañero del grupo",
      situation: "Mateo le tomó una foto a Valentina sin que ella se diera cuenta. Ahora la subió al grupo del curso.",
      question: "¿Qué haces?",
      image: {
        src: "/assets/images/algoritmo/escena-1.jpg",
        alt: "Un estudiante le toma una foto a escondidas a una compañera y la manda al grupo del curso con el mensaje «Miren esta foto».",
      },
      options: [
        {
          text: "Reaccionas con 😂 para no quedar de amargado.",
          consequence: "Otros seis se ríen también. Mateo cree que la foto fue un éxito.",
          reach: 15,
          feeling: "duele",
        },
        {
          text: "Escribes: «Jaja, bórrala».",
          consequence: "Parece un chiste y nadie te hace caso. Pero Mateo se queda pensando.",
          reach: 0,
          feeling: "igual",
        },
        {
          text: "Le cuentas a Valentina por privado.",
          consequence: "Le duele saberlo. Pero ahora puede defenderse.",
          reach: 0,
          feeling: "acompana",
        },
        {
          text: "Guardas la foto en tu celular.",
          consequence: "Por ahora no pasa nada…",
          reach: 0,
          feeling: "igual",
          keepsCopy: true,
        },
      ],
    },
    {
      title: "Empieza la burla",
      role: "Ahora eres Mateo",
      situation: "Tomás le puso orejas de conejo a la foto que subiste. Todo el grupo se está riendo.",
      question: "Tú la subiste. ¿Qué haces?",
      image: {
        src: "/assets/images/algoritmo/escena-2.jpg",
        alt: "En el chat del curso la foto aparece con orejas de conejo y varios compañeros escriben burlas y emojis de risa.",
      },
      options: [
        {
          text: "Te ríes con ellos.",
          consequence: "La foto pasa al grupo de otro curso.",
          reach: 80,
          feeling: "duele",
        },
        {
          text: "No dices nada. Las orejas no las pusiste tú.",
          consequence: "Nadie la frena y se sigue compartiendo.",
          reach: 40,
          feeling: "duele",
        },
        {
          text: "Le pides a Tomás por privado que la borre.",
          consequence: "Tomás la borra. Pero Andrés ya le había tomado una captura.",
          reach: 10,
          feeling: "igual",
        },
        {
          text: "Borras la foto y pides disculpas en el grupo.",
          consequence: "Tomás se burla de ti. Pero en el grupo la foto deja de circular.",
          reach: 0,
          feeling: "acompana",
        },
      ],
      insight: "Incluso la mejor opción llegó tarde: alguien ya tenía una copia.",
    },
    {
      title: "Llega a la red social",
      role: "Eres la mejor amiga de Valentina",
      situation: "Alguien subió la foto a una red social de videos. Ya tiene miles de «me gusta». Valentina todavía no lo sabe.",
      question: "¿Qué haces?",
      image: {
        src: "/assets/images/algoritmo/escena-3.jpg",
        alt: "Alguien toma una captura del chat y la foto burlona aparece publicada en una red social de videos con miles de «me gusta».",
      },
      options: [
        {
          text: "Comentas en el video que eso no da risa.",
          consequence: "Otros te apoyan. Pero cada comentario hace que el video le salga a más gente.",
          reach: 2000,
          feeling: "acompana",
        },
        {
          text: "Reportas el video sin decirle nada a ella.",
          consequence: "El reporte tarda. Ella se entera por otra persona y te pregunta por qué no le dijiste.",
          reach: 800,
          feeling: "igual",
        },
        {
          text: "Le cuentas a Valentina de una vez.",
          consequence: "Le duele saberlo. Pero no está sola: lo reportan juntas.",
          reach: 300,
          feeling: "acompana",
        },
        {
          text: "Le escribes a Mateo que lo borre o le cuentas a la profe.",
          consequence: "Mateo lo borra asustado. Pero ya hay copias por todos lados.",
          reach: 500,
          feeling: "igual",
        },
      ],
      insight: "Defenderla en público es valiente. Pero la red no distingue: cada comentario hace que muestre el video a más gente.",
    },
    {
      title: "Ella pide que lo borren",
      role: "Otra vez eres el compañero de la escena 1",
      situation: "Valentina escribe en el grupo que no dio permiso y pide que lo borren. Varios le contestan: «Era solo una broma».",
      question: "¿Qué haces?",
      image: {
        src: "/assets/images/algoritmo/escena-4.jpg",
        alt: "La estudiante, triste, pide en el grupo que borren el video; varios compañeros le responden que era solo un chiste.",
      },
      options: [
        {
          text: "Le dices que tranquila, que eso pasa rápido.",
          consequence: "Lo dices para ayudar. Pero ella siente que nadie la entiende.",
          reach: 0,
          feeling: "igual",
        },
        {
          text: "Escribes en el grupo que no es broma si a ella le duele.",
          consequence: "Te dicen «sapo». Pero Sofía te apoya y dos personas dejan de burlarse.",
          reach: -100,
          feeling: "acompana",
        },
        {
          text: "Le escribes por privado que estás con ella.",
          consequence: "Ella se siente acompañada. Pero en el grupo nadie lo sabe.",
          reach: 0,
          feeling: "acompana",
        },
        {
          text: "No respondes para no meterte en problemas.",
          consequence: "Nadie la defiende en el grupo.",
          reach: 0,
          feeling: "duele",
        },
      ],
    },
    {
      title: "El curso decide",
      role: "Votación de todo el curso",
      situation: "La foto sigue circulando y algunos siguen diciendo que era una broma. Ahora decide todo el curso.",
      question: "¿Qué hacen?",
      image: {
        src: "/assets/images/algoritmo/escena-5.jpg",
        alt: "El video sigue publicado con cientos de comentarios mientras la estudiante lee mensajes que dicen «no exageres» y pide otra vez que lo borren.",
      },
      options: [
        {
          text: "Seguir compartiéndola.",
          consequence: "El video llega a otros colegios.",
          reach: 1500,
          feeling: "duele",
        },
        {
          text: "Borrar la foto y escuchar a Valentina.",
          consequence: "Las copias del curso desaparecen y ella puede contar cómo se siente. Lo que ya salió del curso tarda más en irse.",
          reach: -300,
          feeling: "acompana",
        },
        {
          text: "Esperar a que todos se olviden.",
          consequence: "En internet nada se olvida solo. Mientras tanto, el video suma vistas y ella lo vive sola.",
          reach: 600,
          feeling: "duele",
        },
        {
          text: "Pedirle ayuda a un adulto.",
          consequence: "Algunos dicen «sapos». Pero un adulto puede pedir que borren el video y hablar con los involucrados. El video deja de crecer.",
          reach: -1000,
          feeling: "acompana",
        },
      ],
    },
  ] satisfies GameScene[],

  /** Only if someone kept a copy in scene 1: it comes back after scene 4. */
  twist: {
    afterScene: 3,
    title: "La foto que guardaste",
    message: { from: "Andrés", text: "Pásame la foto que ya la borraron 😂" },
    question: "¿Qué haces?",
    options: [
      { text: "Se la mandas.", consequence: "La foto vuelve a circular justo cuando la estaban borrando.", reach: 500, feeling: "duele" },
      { text: "Le dices que no.", consequence: "Andrés insiste y después se cansa. Pero la foto sigue en tu celular.", reach: 0, feeling: "igual" },
      {
        text: "La borras y le dices que no.",
        consequence: "Andrés te dice aburrido. Pero esa copia ya no existe.",
        reach: 0,
        feeling: "acompana",
      },
    ] satisfies GameOption[],
  },

  result: {
    title: "Así terminó",
    now: "personas seguían viendo la foto",
    peak: "En el peor momento la vieron",
    valentina: "¿Cómo se sintió Valentina?",
    scale: ["Sola", "Con algo de apoyo", "Acompañada"],
    note: "Son posibilidades: no podemos saber exactamente lo que siente otra persona.",
    twist: "⏳ La foto que guardaste en la escena 1 volvió.",
    question: "¿Qué decisión cambiarían si jugaran otra vez?",
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Sesión 2 — "Creadores de paz": campañas con IA generativa          */
/* ------------------------------------------------------------------ */

export interface CampaignTopic {
  id: string;
  label: string;
  /** The core idea the piece has to get across. */
  idea: string;
  icon: LucideIcon;
}

export interface CampaignFormat {
  id: string;
  label: string;
  /** As it reads in the objective, e.g. "un afiche para el pasillo del colegio". */
  name: string;
  /** How ChatGPT should compose the image. */
  spec: string;
  maxWords: number;
  icon: LucideIcon;
}

export const PEACE = {
  title: "Creadores de paz",
  lead: "En equipos van a crear una pieza para una campaña en su colegio, con ChatGPT.",
  topicsTitle: "El tema",
  formatsTitle: "El formato",
  draw: "Sortear reto",
  drawAgain: "Sortear otro",
  drawnLabel: "Su reto",
  topics: [
    {
      id: "empatia",
      label: "Empatía digital",
      idea: "Antes de publicar, comentar o compartir, piensa cómo se va a sentir la otra persona.",
      icon: HeartHandshake,
    },
    {
      id: "diversidad",
      label: "Respeto a la diversidad",
      idea: "Todos somos diferentes y todos merecemos respeto, en el salón y en las redes.",
      icon: Users,
    },
    {
      id: "ciberacoso",
      label: "Frenar el ciberacoso",
      idea: "Si ves ciberacoso, no lo compartas ni te rías: frénalo o pide ayuda.",
      icon: ShieldCheck,
    },
  ] satisfies CampaignTopic[],
  formats: [
    {
      id: "afiche",
      label: "Afiche para el pasillo",
      name: "un afiche para el pasillo del colegio",
      spec: "un afiche vertical (formato 2:3) para pegar en el pasillo del colegio; la frase se debe leer desde lejos",
      maxWords: 8,
      icon: RectangleVertical,
    },
    {
      id: "post",
      label: "Publicación para redes",
      name: "una publicación para redes sociales",
      spec: "una publicación cuadrada (formato 1:1) para redes sociales",
      maxWords: 10,
      icon: Square,
    },
    {
      id: "sticker",
      label: "Sticker para el grupo del curso",
      name: "un sticker para el grupo de chat del curso",
      spec: "un sticker con fondo blanco, un solo personaje o ícono grande y trazos gruesos",
      maxWords: 4,
      icon: Sticker,
    },
  ] satisfies CampaignFormat[],
} as const;

export const PROMPT_BUILDER = {
  title: "Arma tu prompt",
  lead: "Elijan tema, formato, estilo y colores. El prompt se arma solo con la fórmula.",
  labels: { topic: "Tema", format: "Formato", style: "Estilo", colors: "Colores" },
  stylesCount: "estilos",
  change: "Cambiar",
  /** Styles ChatGPT can draw; `desc` is shown to the team and goes into the prompt. */
  styles: [
    { id: "caricatura", label: "Caricatura juvenil", desc: "personajes ilustrados, expresivos y coloridos" },
    { id: "comic", label: "Cómic", desc: "viñetas, globos de texto, onomatopeyas y mucha energía visual" },
    { id: "ilustracion", label: "Ilustración moderna", desc: "limpia, actual y más seria que una caricatura" },
    { id: "minimalista", label: "Minimalista", desc: "pocos elementos, mucho espacio y un mensaje fuerte" },
    { id: "editorial", label: "Editorial", desc: "estilo de revista o campaña institucional moderna" },
    { id: "collage", label: "Collage digital", desc: "recortes, stickers, fotos, texturas y elementos superpuestos" },
    { id: "tipografico", label: "Tipográfico", desc: "el texto es el protagonista, con letras grandes e impactantes" },
    { id: "flat", label: "Flat design", desc: "formas simples, colores planos e íconos claros" },
    { id: "3d", label: "3D", desc: "objetos, emojis, teléfonos o elementos con volumen y profundidad" },
    { id: "fotografico", label: "Fotográfico", desc: "apariencia de fotografía real o editorial" },
    { id: "cine", label: "Cinematográfico", desc: "iluminación dramática, profundidad y aspecto de película" },
    { id: "pop", label: "Pop art", desc: "colores intensos, contrastes fuertes y estilo juvenil" },
    { id: "urbano", label: "Graffiti / urbano", desc: "letras pintadas, texturas de pared y estética callejera" },
    { id: "anime", label: "Anime / manga", desc: "personajes y composición inspirados en la animación japonesa" },
    { id: "infografia", label: "Infografía visual", desc: "imagen, íconos y pequeños mensajes educativos" },
    { id: "retro", label: "Retro digital", desc: "estética de internet antiguo, píxeles y elementos tecnológicos" },
    { id: "neon", label: "Neón futurista", desc: "luces, pantallas, colores brillantes y ambiente tecnológico" },
    { id: "poster", label: "Póster escolar moderno", desc: "composición clara e impactante, pensada para imprimir" },
    { id: "sticker", label: "Sticker style", desc: "íconos y elementos tipo pegatina, muy visual y juvenil" },
    { id: "mixed", label: "Mixed media", desc: "mezcla de fotografía, ilustración, tipografía y texturas" },
  ],
  colors: [
    { id: "vivos", label: "Vivos" },
    { id: "pastel", label: "Pastel" },
    { id: "caribe", label: "Caribe" },
    { id: "contraste", label: "Blanco y negro + un color" },
  ],
  /** How each color choice reads inside the prompt. */
  colorText: {
    vivos: "colores vivos y alegres",
    pastel: "colores pastel",
    caribe: "colores del Caribe: azul mar, amarillo sol y verde",
    contraste: "blanco y negro con un solo color fuerte para resaltar",
  } as Record<string, string>,
} as const;

/** The formula, filled in with the team's choices. Each part is shown with its name. */
export function buildCampaignPrompt(
  topic: CampaignTopic,
  format: CampaignFormat,
  style: string,
  colors: string,
): { label: string; text: string }[] {
  return [
    {
      label: "Rol",
      text: "Actúa como diseñador gráfico y creativo publicitario experto en campañas para adolescentes.",
    },
    {
      label: "Contexto",
      text: "Somos un equipo de estudiantes de bachillerato de un colegio público de Barranquilla, Colombia. Estamos creando una campaña para nuestro colegio.",
    },
    {
      label: "Objetivo",
      text: `Crear ${format.name} sobre ${topic.label.toLowerCase()}. La idea central es: ${topic.idea}`,
    },
    {
      label: "Instrucciones",
      text: `1. Propón 3 frases para la campaña, de máximo ${format.maxWords} palabras cada una, en español y con lenguaje juvenil.
2. Espera a que elijamos una.
3. Después crea la imagen: ${format.spec}. Estilo: ${style}. Colores: ${colors}. La frase debe aparecer escrita exactamente igual, grande y fácil de leer.`,
    },
    {
      label: "Límites",
      text: "No uses nombres ni fotos de personas reales. No te burles de nadie ni muestres a alguien humillado. No uses logos de marcas ni de redes sociales. Si aparecen personas, que sean estudiantes diversos.",
    },
    { label: "Acción", text: "Empieza ya con las 3 frases." },
  ];
}

export const CREATE = {
  title: "Crea y mejora",
  steps: [
    { title: "Peguen el prompt", text: "ChatGPT les va a proponer 3 frases." },
    { title: "Escojan una frase", text: "Respóndanle, por ejemplo: «Usamos la frase 2»." },
    { title: "Revisen la imagen", text: "¿Se entiende en 3 segundos? ¿La frase está bien escrita?" },
  ],
  improveTitle: "Pídanle un cambio",
  improveLead: "La IA propone, ustedes corrigen. Copien uno y cambien lo que está entre corchetes.",
  improvements: [
    "Haz la imagen más llamativa y que la frase se lea desde lejos.",
    "La frase de la imagen tiene errores. Escríbela exactamente así: «[NUESTRA FRASE]».",
    "Cambia el estilo a [OTRO ESTILO] y mantén la misma frase.",
    "Muestra estudiantes más diversos: diferentes tonos de piel, estilos y formas de ser.",
  ],
  tip: "Si la frase sigue saliendo mal escrita, pidan la imagen sin texto y escriban la frase aparte.",
} as const;

export const GALLERY = {
  title: "Galería",
  lead: "Cada equipo muestra su pieza en 30 segundos. Después, el curso vota.",
  criteria: [
    { mark: "⚡", text: "¿Se entiende en 3 segundos?" },
    { mark: "🤝", text: "¿Respeta a todos?" },
    { mark: "📣", text: "¿Dan ganas de hacer lo que dice?" },
  ],
  poll: "¿Qué pieza usarían en el colegio?",
  closing: ["Lo que creamos y compartimos", "también construye el colegio que queremos."],
} as const;

/** "¿Cómo está construido este prompt?" for the campaign prompt, in the students' words. */
export const CAMPAIGN_PARTS = partsFor({
  rol: {
    quote: "Actúa como diseñador gráfico y creativo publicitario…",
    explain: [
      { kind: "text", text: "Le decimos a la IA qué papel debe asumir." },
      {
        kind: "text",
        text: "No queremos que responda como un buscador. Queremos que piense como alguien que hace campañas.",
      },
    ],
  },
  contexto: {
    quote: "Somos estudiantes de bachillerato de un colegio público de Barranquilla.",
    explain: [
      { kind: "text", text: "Le contamos quiénes somos y para quién es la campaña. Eso cambia:" },
      { kind: "list", items: ["el lenguaje;", "el estilo de las imágenes;", "el tipo de frases."] },
    ],
  },
  objetivo: {
    quote: "Crear un afiche sobre empatía digital. La idea central es…",
    explain: [
      { kind: "text", text: "Aquí respondemos: ¿para qué es la pieza?" },
      {
        kind: "compare",
        weak: "Hazme un afiche.",
        strong: "Crea un afiche para el pasillo que invite a pensar antes de compartir.",
      },
    ],
  },
  instrucciones: {
    quote: "Propón 3 frases, espera a que elijamos una y después crea la imagen…",
    explain: [
      { kind: "text", text: "Le decimos exactamente qué hacer y en qué orden:" },
      {
        kind: "list",
        items: [
          "3 frases cortas;",
          "esperar a que elijamos una;",
          "el formato, el estilo y los colores;",
          "la frase escrita exactamente igual.",
        ],
      },
      { kind: "text", text: "Mientras más claro, menos cosas inventa la IA." },
    ],
  },
  limites: {
    quote: "No uses personas reales. No te burles de nadie. No uses logos.",
    explain: [
      { kind: "text", text: "También le decimos qué no puede hacer." },
      {
        kind: "text",
        text: "Es una campaña contra el ciberacoso: no puede terminar burlándose de alguien ni usando la cara de un compañero.",
      },
    ],
  },
  accion: {
    quote: "Empieza ya con las 3 frases.",
    explain: [
      { kind: "text", text: "Terminamos con una orden clara." },
      { kind: "text", text: "Así la IA no nos responde con más preguntas: arranca de una vez." },
    ],
  },
});
