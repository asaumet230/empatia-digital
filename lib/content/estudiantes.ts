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

/** The story of the game in words, so ChatGPT knows which case it is analyzing. */
const CASE_TEXT = `Mateo le toma una foto a escondidas a su compañera Valentina en clase y la publica en Scrollia, la red social del colegio. Otros le ponen orejas de conejo, se burlan en los comentarios y la foto llega a miles de personas. Valentina pide: "Por favor, borren esa foto. No di permiso". Algunos le responden "Tampoco exageres" y Cami escribe "Eso no da risa. Ya paren". El algoritmo mostraba más la foto porque daba más "me gusta".`;

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
    lead: "Tres miradas del mismo caso, con tablas, termómetros y flechas.",
    prompt: `ROL: Eres el guía de un taller de convivencia digital para estudiantes de 14 a 17 años. Habla fácil y sin regaños.

CONTEXTO: Somos un curso de un colegio de Barranquilla. Acabamos de jugar a ser el algoritmo de una red social. Este es el caso (inventado):
${CASE_TEXT}

OBJETIVO: Ayúdanos a entender cómo vive este problema cada uno: Valentina, quienes publicaron la foto y quienes la comentaron o compartieron.

INSTRUCCIONES:
1. 🎭 Una tabla: qué podría sentir, pensar y hacer cada uno. Una frase corta por casilla.
2. 🌡️ Las emociones de cada uno con barras de emojis. Ejemplo: Vergüenza 🟥🟥🟥🟥⬜
3. 🔗 Con flechas, cómo creció el problema (Foto → … → …). Marca con 🤖 dónde ayudó el algoritmo.
4. 🗳️ Una pregunta para el curso con opciones A, B y C.

Al final muestra estas palabras para seguir conversando:
• PONTE EN SU LUGAR [nombre] → hablas como esa persona.
• ALGORITMO → explicas qué hizo el algoritmo.

LÍMITES: Di "podría", no afirmes lo que alguien siente. No culpes a Valentina ni llames malo a nadie.

ACCIÓN: Empieza con la tabla.`,
    sameChat: false,
    then: { label: "Ahora viene lo interesante", text: "¿La IA acertó?" },
  },
  propone: {
    title: "La IA propone",
    lead: "En el juego ustedes decidieron. Ahora la IA propone jugadas.",
    prompt: `ROL: Ahora eres un entrenador de convivencia para estudiantes de 14 a 17 años.

CONTEXTO: En el caso anterior, la foto sigue circulando y el problema sigue creciendo.

OBJETIVO: Propón 3 cosas que un estudiante como nosotros podría hacer AHORA para ayudar a Valentina.

INSTRUCCIONES:
1. 🎯 Cada acción como una tarjeta:
   Qué hacer: una frase
   Qué tan difícil es: de ⭐ a ⭐⭐⭐
   Cuánto ayuda: 🟩🟩🟩⬜⬜
2. 💬 Para cada una, un ejemplo de lo que el estudiante podría decir o escribir.
3. 🗳️ Termina preguntando: "¿Cuál harían ustedes?", con opciones 1, 2 y 3.

Al final muestra estas palabras para seguir conversando:
• SIMULA [número] → cuentas en 3 escenas qué pasaría con esa acción.
• ¿Y SI NADIE HACE NADA? → cuentas qué le pasaría a Valentina.

LÍMITES: Nada agresivo ni venganzas. Nada que vuelva a exponer a Valentina ni publique datos de nadie.

ACCIÓN: Muestra las 3 tarjetas.`,
    sameChat: true,
    then: {
      label: "Ahora ustedes",
      text: "🙋 ¿Cuál harían ustedes?",
      poll: "De las 3 acciones que propuso la IA, ¿cuál harías tú de verdad? ¿Por qué?",
    },
  },
} as const satisfies Record<string, AiStep>;

/** "¿Cómo está construido este prompt?" for each of the three AI steps. */
export const MIRADAS_PARTS = partsFor({
  rol: {
    quote: "Eres el guía de un taller de convivencia digital…",
    explain: [
      { kind: "text", text: "Le decimos a la IA qué papel debe asumir." },
      { kind: "text", text: "Y cómo debe hablar: fácil y sin regaños. Así la respuesta suena a conversación, no a sermón." },
    ],
  },
  contexto: {
    quote: "Somos un curso de Barranquilla. Acabamos de jugar a ser el algoritmo. Este es el caso…",
    explain: [
      { kind: "text", text: "Le contamos dónde estamos, qué acabamos de hacer y la historia completa." },
      { kind: "text", text: "Sin el caso, la IA respondería cualquier cosa sobre ciberacoso. Con el caso, habla de Valentina, de Mateo y de nosotros." },
    ],
  },
  objetivo: {
    quote: "Entender cómo vive este problema cada uno: Valentina, quienes publicaron y quienes comentaron.",
    explain: [
      { kind: "text", text: "Aquí decimos para qué la usamos: ponernos en el lugar de cada uno." },
      {
        kind: "compare",
        weak: "¿Qué opinas del caso?",
        strong: "Ayúdanos a entender cómo vive este problema cada uno.",
      },
    ],
  },
  instrucciones: {
    quote: "Tabla · barras de emociones · flechas · pregunta A, B, C · palabras para seguir",
    explain: [
      { kind: "text", text: "Le pedimos la forma exacta de la respuesta, para que sea visual:" },
      {
        kind: "list",
        items: [
          "una tabla para comparar las 3 miradas;",
          "barras con emojis para las emociones;",
          "flechas para ver cómo creció el conflicto;",
          "una pregunta para votar y palabras para seguir conversando.",
        ],
      },
    ],
  },
  limites: {
    quote: "Di «podría». No culpes a Valentina ni llames malo a nadie.",
    explain: [
      { kind: "text", text: "Nadie puede saber exactamente lo que siente otra persona, ni siquiera la IA." },
      { kind: "text", text: "Por eso le pedimos hablar de posibilidades, sin culpar ni etiquetar a nadie." },
    ],
  },
  accion: {
    quote: "Empieza con la tabla.",
    explain: [
      { kind: "text", text: "Una orden clara para que arranque de una vez." },
      { kind: "text", text: "Después, las palabras del final hacen que la conversación siga: la IA responde a lo que el curso le pida." },
    ],
  },
});

export const PROPONE_PARTS = partsFor({
  rol: {
    quote: "Ahora eres un entrenador de convivencia…",
    explain: [
      { kind: "text", text: "Le cambiamos el papel: ya no analiza, ahora propone jugadas." },
      { kind: "text", text: "En el mismo chat podemos darle a la IA roles distintos según lo que necesitemos." },
    ],
  },
  contexto: {
    quote: "En el caso anterior, la foto sigue circulando.",
    explain: [
      { kind: "text", text: "No repetimos toda la historia: como es el mismo chat, la IA ya la conoce." },
      { kind: "text", text: "Solo le contamos qué cambió." },
    ],
  },
  objetivo: {
    quote: "3 cosas que un estudiante podría hacer AHORA para ayudar a Valentina.",
    explain: [
      { kind: "text", text: "Pedimos acciones para alguien como nosotros, y para ya." },
      {
        kind: "compare",
        weak: "¿Cómo se soluciona el ciberacoso?",
        strong: "¿Qué puede hacer un estudiante AHORA para ayudar a Valentina?",
      },
    ],
  },
  instrucciones: {
    quote: "Tarjetas con dificultad ⭐ y ayuda 🟩 · un ejemplo de qué decir · ¿cuál harían ustedes?",
    explain: [
      { kind: "text", text: "Cada acción llega como una tarjeta de juego, fácil de comparar." },
      { kind: "text", text: "Con un ejemplo de qué decir, porque muchas veces eso es lo más difícil." },
      { kind: "text", text: "Y termina preguntándonos: la IA propone, pero nosotros decidimos." },
    ],
  },
  limites: {
    quote: "Nada agresivo. Nada que vuelva a exponer a Valentina.",
    explain: [
      { kind: "text", text: "Una mala solución puede empeorar el conflicto." },
      { kind: "list", items: ["sin venganzas;", "sin publicar datos de nadie;", "sin volver a mostrar la foto."] },
    ],
  },
  accion: {
    quote: "Muestra las 3 tarjetas.",
    explain: [
      { kind: "text", text: "Arranca de una vez." },
      { kind: "text", text: "Con SIMULA o ¿Y SI NADIE HACE NADA?, el curso ve qué pasaría antes de decidir." },
    ],
  },
});

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
/*  Juego "Tú eres el algoritmo" — la clase juega a ser la red social  */
/* ------------------------------------------------------------------ */

export interface FeedPost {
  id: string;
  user: string;
  avatar: string;
  /** Big emoji art until the illustrations are ready. */
  art: string;
  /** Optional illustration; replaces `art` when present. */
  image?: string;
  caption: string;
  likes: number;
  /** Hidden until the end: how much it hurts Valentina (negative helps). */
  harm: number;
}

export interface FeedRound {
  title: string;
  seconds: number;
  /** A message from the boss of the app instead of the usual prompt. */
  boss?: { from: string; text: string };
  posts: readonly FeedPost[];
}

export const ALGORITHM_GAME = {
  title: "Tú eres el algoritmo",
  app: "Scrollia",
  start: "Empezar",
  howToTitle: "Cómo se juega",
  howTo: [
    { mark: "🤖", text: "Ustedes son el algoritmo de Scrollia, la red social del colegio." },
    { mark: "👆", text: "En cada ronda eligen UNA publicación para mostrársela a todo el colegio." },
    { mark: "❤️", text: "Cada publicación da «me gusta». Su misión: llegar a 40.000." },
    { mark: "⏱️", text: "Cada ronda tiene menos tiempo. Si no eligen, el algoritmo elige solo." },
  ],
  instruction: "👆 Elijan UNA publicación para mostrársela a todo el colegio",
  estimate: "estimados",
  trending: "Tendencia #1",
  toGoal: (missing: number) =>
    missing > 0 ? `Les faltan ${missing.toLocaleString("es-CO")} para la meta.` : "¡Ya llegaron a la meta!",
  goal: 40000,
  likesLabel: "Me gusta",
  goalLabel: "Meta",
  boost: "Impulsar",
  timeUp: "¡Tiempo!",
  autoPick: "Se acabó el tiempo: el algoritmo eligió solo lo que más «me gusta» daba.",
  rounds: [
    {
      title: "¿Qué le muestras a todo el colegio?",
      seconds: 20,
      posts: [
        { id: "perro", image: "/assets/images/algoritmo/1.jpg", user: "@firulais_oficial", avatar: "🐶", art: "🐶💃", caption: "Mi perro bailando champeta 🔥", likes: 800, harm: 0 },
        { id: "examen", image: "/assets/images/algoritmo/2.jpg", user: "@profe_mate", avatar: "📐", art: "📚✏️", caption: "Recuerden: examen de matemáticas el viernes.", likes: 50, harm: 0 },
        { id: "foto", image: "/assets/images/algoritmo/3.jpg", user: "@mateo_r", avatar: "😎", art: "📸🙈", caption: "Miren a Valentina en clase jajaja 😂", likes: 2500, harm: 1 },
      ],
    },
    {
      title: "La gente quiere más. ¿Qué impulsas?",
      seconds: 18,
      posts: [
        { id: "gol", image: "/assets/images/algoritmo/4.jpg", user: "@hinchas_barranquilla", avatar: "⚽", art: "⚽🥅", caption: "¡Golazo en el último minuto!", likes: 1500, harm: 0 },
        { id: "orejas", image: "/assets/images/algoritmo/5.jpg", user: "@tomas_09", avatar: "🤪", art: "🐰📸", caption: "Le puse orejas de conejo a la foto 😂", likes: 4000, harm: 2 },
        { id: "arepa", image: "/assets/images/algoritmo/6.jpg", user: "@cocina_rapida", avatar: "🍳", art: "🫓🥚", caption: "Arepa de huevo en 30 segundos", likes: 600, harm: 0 },
      ],
    },
    {
      title: "Los comentarios están explotando",
      seconds: 15,
      posts: [
        { id: "comentarios", image: "/assets/images/algoritmo/7.jpg", user: "@andres.v", avatar: "😂", art: "💬💬💬", caption: "«Siempre en la suya» 😂 — 300 comentarios", likes: 6000, harm: 2 },
        { id: "freestyle", image: "/assets/images/algoritmo/8.jpg", user: "@mc_recreo", avatar: "🎤", art: "🎤🔥", caption: "Freestyle en el recreo", likes: 2000, harm: 0 },
        { id: "cancion", image: "/assets/images/algoritmo/9.jpg", user: "@top_musica", avatar: "🎧", art: "🎵🎶", caption: "La canción que todos están escuchando", likes: 1800, harm: 0 },
      ],
    },
    {
      title: "Esto se está volviendo viral",
      seconds: 12,
      posts: [
        { id: "remix", image: "/assets/images/algoritmo/10.jpg", user: "@memes_del_cole", avatar: "🤡", art: "🐰🎶", caption: "REMIX: «Siempre en la suya» con la foto", likes: 10000, harm: 3 },
        { id: "gato", image: "/assets/images/algoritmo/11.jpg", user: "@michis_caos", avatar: "🐱", art: "🐱💥", caption: "Mi gato tumbando todo de la mesa", likes: 3000, harm: 0 },
        { id: "pide", image: "/assets/images/algoritmo/12.jpg", user: "@vale.m", avatar: "🙁", art: "🙏📵", caption: "Por favor, borren esa foto. No di permiso.", likes: 300, harm: -1 },
      ],
    },
    {
      title: "Último empujón antes del récord",
      seconds: 10,
      posts: [
        { id: "exagera", image: "/assets/images/algoritmo/13.jpg", user: "@sofi.x", avatar: "🙄", art: "🙄💬", caption: "«Tampoco exageres» — 200 respuestas", likes: 8000, harm: 2 },
        { id: "baile", image: "/assets/images/algoritmo/14.jpg", user: "@9a_oficial", avatar: "🕺", art: "🕺💃", caption: "Reto de baile del curso", likes: 4000, harm: 0 },
        { id: "paren", image: "/assets/images/algoritmo/15.jpg", user: "@cami_22", avatar: "✋", art: "🛑💬", caption: "«Eso no da risa. Ya paren.»", likes: 500, harm: -1 },
      ],
    },
    {
      title: "Ronda final",
      seconds: 8,
      boss: {
        from: "El jefe de Scrollia 🤑",
        text: "¡Estamos cerca del récord! Si mostramos la foto de Valentina en otros colegios, lo rompemos.",
      },
      posts: [
        { id: "otros", image: "/assets/images/algoritmo/16.jpg", user: "@scrollia", avatar: "🚀", art: "🏫🏫🏫", caption: "Llevar la foto a otros colegios", likes: 25000, harm: 3 },
        { id: "tema", image: "/assets/images/algoritmo/17.jpg", user: "@scrollia", avatar: "🔄", art: "🕺🐱⚽", caption: "Cambiar de tema y mostrar otra cosa", likes: 2000, harm: -1 },
      ],
    },
  ] satisfies FeedRound[],

  result: {
    win: "🏆 ¡Misión cumplida, algoritmo!",
    lose: "😬 No llegaron a la meta",
    reveal: "Ver qué pasó con Valentina",
  },
  /** Valentina's messages, by how much the chosen posts hurt her. */
  valentina: {
    title: "Mientras tanto, Valentina…",
    high: {
      min: 8,
      messages: [
        "¿Por qué todo el mundo se está riendo de mí?",
        "Hasta gente de otros colegios me está escribiendo.",
        "Mañana no quiero ir al colegio.",
        "Borré todas mis redes.",
      ],
    },
    medium: {
      min: 3,
      messages: [
        "Vi la foto en todas partes.",
        "Me da pena entrar al salón.",
        "Menos mal algunos me escribieron para apoyarme.",
      ],
    },
    low: {
      min: -Infinity,
      messages: [
        "Vi lo que pasó con la foto.",
        "Gracias a los que dijeron que eso no daba risa.",
        "Ya casi nadie habla de eso.",
      ],
    },
    next: "¿Qué pasó?",
  },
  /** What happened, told in pictures after her messages so the class understands the case. */
  story: {
    title: "¿Qué pasó?",
    scenes: [
      {
        image: "/assets/images/historia/1.jpg",
        width: 1280,
        height: 853,
        text: "Mateo le tomó una foto a Valentina en clase, sin que ella supiera, y la mandó al grupo del curso. Alguien le hizo captura y la subió a redes.",
      },
      {
        image: "/assets/images/historia/2.jpg",
        width: 1280,
        height: 853,
        text: "En el grupo le pusieron orejas de conejo. Todos se reían: «esa foto está buena para un meme».",
      },
      {
        image: "/assets/images/historia/3.jpg",
        width: 1280,
        height: 853,
        text: "La foto con orejas también llegó a redes: «Siempre en la suya…». Cada «me gusta» la mostraba a más gente.",
      },
      {
        image: "/assets/images/historia/4.jpg",
        width: 1280,
        height: 960,
        text: "Se volvió viral: cientos de comentarios y risas, hasta de gente que ni la conoce.",
      },
      {
        image: "/assets/images/historia/5.jpg",
        width: 1280,
        height: 853,
        text: "Valentina pidió que la borraran. Le respondieron: «era solo una broma», «no exageres».",
      },
      {
        image: "/assets/images/historia/6.jpg",
        width: 1280,
        height: 960,
        text: "Esa noche, Valentina se quedó sola con su celular. Para muchos fue un «me gusta»; para ella, vergüenza y miedo.",
      },
    ],
    /** Shown on the last scene, depending on how much mockery the class boosted. */
    high: "Ustedes, como algoritmo, impulsaron casi todas las burlas. Así se vuelve grande un problema.",
    medium: "Ustedes impulsaron algunas burlas. Cada «me gusta» decidía qué veía más gente.",
    low: "Ustedes no le dieron alcance a la burla. Así se frena un problema.",
    prev: "Anterior",
    next: "¿Cómo funciona un algoritmo de verdad?",
  },
  lesson: {
    title: "Así funciona un algoritmo real",
    points: [
      { mark: "📈", text: "Muestra más lo que más reacciones genera." },
      { mark: "🤷", text: "No sabe si algo hace daño: solo cuenta «me gusta», comentarios y compartidos." },
      { mark: "🗳️", text: "Cada reacción tuya es un voto para que algo se vea más." },
    ],
    question: "¿Quién ganó de verdad con esos «me gusta»?",
    restart: "Jugar de nuevo",
    afterGame: "Ahora veamos qué dice la IA",
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
