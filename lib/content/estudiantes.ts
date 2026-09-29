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
const CASE_TEXT = `En Scrollia, la red social que usa todo el colegio, Mateo publica una foto de su compañera Valentina que le tomó a escondidas en clase. Tomás le pone orejas de conejo, los comentarios "Siempre en la suya 😂" se multiplican y alguien hace un remix que llega a miles de personas, incluso de otros colegios. Valentina escribe: "Por favor, borren esa foto. No di permiso". Algunos le responden "Tampoco exageres" y Cami escribe "Eso no da risa. Ya paren". Mientras tanto, el algoritmo de Scrollia mostraba más estas publicaciones porque eran las que más "me gusta" daban.`;

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
    prompt: `ROL: Actúa como facilitador de un taller de convivencia digital para estudiantes de 14 a 17 años. Hablas de forma cercana, clara y sin sermones.

CONTEXTO: Estamos en un colegio público de Barranquilla, Colombia. Acabamos de jugar un juego en el que fuimos el algoritmo de una red social. Este es el caso (ficticio):
${CASE_TEXT}

OBJETIVO: Ayudarnos a entender cómo se vive este conflicto desde 3 lugares: Valentina, quienes publicaron o editaron la foto, y quienes reaccionaron, comentaron o compartieron.

INSTRUCCIONES: Responde con este formato visual:
1. 🎭 Una tabla con 3 columnas (Valentina | Quienes publicaron | Quienes reaccionaron) y 3 filas: ¿Qué podría sentir? · ¿Qué podría pensar? · ¿Qué podría hacer ahora? Una frase corta por casilla.
2. 🌡️ Un termómetro de emociones para cada uno, hecho con emojis. Ejemplo: Vergüenza 🟥🟥🟥🟥⬜. Máximo 3 emociones por persona. Si puedes crear gráficas, haz además una gráfica de barras con estas emociones.
3. 🔗 Una cadena de causa y efecto con flechas que muestre cómo creció el conflicto (Foto → … → …). Marca con 🤖 los momentos en que el algoritmo lo hizo más grande.
4. 🔍 "Lo que casi nadie nota": un detalle de cada mirada que suele pasarse por alto.
5. 🗳️ Termina con una pregunta para el curso con opciones A, B y C, y espera nuestra respuesta antes de seguir.

Después muestra este menú y úsalo cuando escribamos una de estas palabras:
• PONTE EN SU LUGAR [nombre] → habla en primera persona como ese personaje, en 4 frases.
• ALGORITMO → explica con un diagrama de flechas qué hizo el algoritmo en este caso.
• ZOOM [persona] → profundiza en esa mirada.
• ¿Y SI…? [un cambio] → cuenta cómo habría cambiado la historia.

LÍMITES: Usa "podría" en lugar de afirmar lo que alguien siente. No culpes a Valentina. No etiquetes a nadie como malo ni hagas diagnósticos. Lenguaje sencillo y frases cortas.

ACCIÓN: Empieza ya con la tabla.`,
    sameChat: false,
    then: { label: "Ahora viene lo interesante", text: "¿La IA acertó?" },
  },
  propone: {
    title: "La IA propone",
    lead: "En el juego ustedes decidieron. Ahora la IA propone jugadas.",
    prompt: `ROL: Ahora actúa como un entrenador de convivencia que propone jugadas reales para estudiantes de 14 a 17 años.

CONTEXTO: En el caso anterior, el conflicto sigue creciendo y la foto sigue circulando.

OBJETIVO: Proponer 3 acciones que un estudiante podría hacer AHORA para detener el conflicto.

INSTRUCCIONES: Presenta cada acción como una tarjeta, así:
━━━━━━━━━━
🎯 ACCIÓN 1: nombre corto
📝 Qué hacer: una frase
⚡ Dificultad: de ⭐ a ⭐⭐⭐
💥 Impacto en el conflicto: 🟩🟩🟩⬜⬜
🛡️ Protege a Valentina: sí / en parte
━━━━━━━━━━
Después, una tabla que compare las 3 acciones: rapidez, riesgo y quién la puede hacer.
No digas cuál es la mejor ni cuáles son sus debilidades: el curso tiene la misión de encontrar qué podría salir mal.

Muestra este menú y úsalo cuando escribamos una de estas palabras:
• PISTA → da una pista sobre una debilidad, sin decirla completa.
• SIMULA [número] → cuenta en 3 escenas cortas, con emojis, qué pasaría si alguien hace esa acción.
• VISTA DE VALENTINA → cómo podría ver ella cada acción.
• MÁS OPCIONES → propone 2 acciones distintas.

LÍMITES: Acciones realistas y no agresivas. Nada que exponga otra vez a Valentina, ni venganzas, ni publicar datos de nadie.

ACCIÓN: Muestra ya las 3 tarjetas.`,
    sameChat: true,
    then: {
      label: "Su misión",
      text: "🚨 ¿Qué podría salir mal?",
      poll: "Si un estudiante hiciera exactamente lo que dice la IA, ¿qué podría salir mal?",
    },
  },
} as const satisfies Record<string, AiStep>;

/** "¿Cómo está construido este prompt?" for each of the three AI steps. */
export const MIRADAS_PARTS = partsFor({
  rol: {
    quote: "Actúa como facilitador de un taller de convivencia digital…",
    explain: [
      { kind: "text", text: "Le decimos a la IA qué papel debe asumir." },
      { kind: "text", text: "Y cómo debe hablar: cercana, clara y sin sermones. Así la respuesta suena a conversación, no a regaño." },
    ],
  },
  contexto: {
    quote: "Colegio de Barranquilla. Acabamos de jugar a ser el algoritmo. Este es el caso…",
    explain: [
      { kind: "text", text: "Le contamos dónde estamos, qué acabamos de hacer y la historia completa." },
      { kind: "text", text: "Sin el caso, la IA respondería cualquier cosa sobre ciberacoso. Con el caso, habla de Valentina, de Mateo y de nosotros." },
    ],
  },
  objetivo: {
    quote: "Entender el conflicto desde 3 lugares: Valentina, quienes publicaron y quienes reaccionaron.",
    explain: [
      { kind: "text", text: "Aquí decimos para qué la usamos: ponernos en el lugar de cada uno." },
      {
        kind: "compare",
        weak: "¿Qué opinas del caso?",
        strong: "Ayúdanos a entender el conflicto desde 3 lugares distintos.",
      },
    ],
  },
  instrucciones: {
    quote: "Tabla · termómetro de emociones · cadena de flechas · pregunta A, B, C · menú de palabras",
    explain: [
      { kind: "text", text: "Le pedimos la forma exacta de la respuesta, para que sea visual:" },
      {
        kind: "list",
        items: [
          "una tabla para comparar las 3 miradas;",
          "barras con emojis para las emociones;",
          "flechas para ver cómo creció el conflicto;",
          "una pregunta para votar y un menú para seguir jugando.",
        ],
      },
    ],
  },
  limites: {
    quote: "Usa «podría». No culpes a Valentina. No etiquetes a nadie.",
    explain: [
      { kind: "text", text: "Nadie puede saber exactamente lo que siente otra persona, ni siquiera la IA." },
      { kind: "text", text: "Por eso le pedimos hablar de posibilidades, sin culpar ni etiquetar a nadie." },
    ],
  },
  accion: {
    quote: "Empieza ya con la tabla.",
    explain: [
      { kind: "text", text: "Una orden clara para que arranque de una vez." },
      { kind: "text", text: "Después, el menú de palabras hace que la conversación siga: la IA responde a lo que el curso le pida." },
    ],
  },
});

export const PROPONE_PARTS = partsFor({
  rol: {
    quote: "Ahora actúa como un entrenador de convivencia…",
    explain: [
      { kind: "text", text: "Le cambiamos el papel: ya no analiza, ahora propone jugadas." },
      { kind: "text", text: "En el mismo chat podemos darle a la IA roles distintos según lo que necesitemos." },
    ],
  },
  contexto: {
    quote: "En el caso anterior, el conflicto sigue creciendo.",
    explain: [
      { kind: "text", text: "No repetimos toda la historia: como es el mismo chat, la IA ya la conoce." },
      { kind: "text", text: "Solo le contamos qué cambió." },
    ],
  },
  objetivo: {
    quote: "3 acciones que un estudiante podría hacer AHORA.",
    explain: [
      { kind: "text", text: "Pedimos acciones para alguien como nosotros, y para ya." },
      {
        kind: "compare",
        weak: "¿Cómo se soluciona el ciberacoso?",
        strong: "¿Qué puede hacer un estudiante AHORA para detener este conflicto?",
      },
    ],
  },
  instrucciones: {
    quote: "Tarjetas con dificultad ⭐ e impacto 🟩 · tabla comparativa · no digas cuál es la mejor",
    explain: [
      { kind: "text", text: "Cada acción llega como una tarjeta de juego, fácil de comparar." },
      {
        kind: "text",
        text: "Y le pedimos que NO diga cuál es la mejor ni sus debilidades: esa es la misión del curso.",
      },
    ],
  },
  limites: {
    quote: "Nada agresivo. Nada que exponga otra vez a Valentina.",
    explain: [
      { kind: "text", text: "Una mala solución puede empeorar el conflicto." },
      { kind: "list", items: ["sin venganzas;", "sin publicar datos de nadie;", "sin volver a mostrar la foto."] },
    ],
  },
  accion: {
    quote: "Muestra ya las 3 tarjetas.",
    explain: [
      { kind: "text", text: "Arranca de una vez." },
      { kind: "text", text: "Con PISTA o SIMULA, el curso puede poner a prueba cada acción antes de criticarla." },
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
  next: "Siguiente ronda",
  finish: "Ver resultado",
  timeUp: "¡Tiempo!",
  autoPick: "Se acabó el tiempo: el algoritmo eligió solo lo que más «me gusta» daba.",
  rounds: [
    {
      title: "¿Qué le muestras a todo el colegio?",
      seconds: 20,
      posts: [
        { id: "perro", user: "@firulais_oficial", avatar: "🐶", art: "🐶💃", caption: "Mi perro bailando champeta 🔥", likes: 800, harm: 0 },
        { id: "examen", user: "@profe_mate", avatar: "📐", art: "📚✏️", caption: "Recuerden: examen de matemáticas el viernes.", likes: 50, harm: 0 },
        { id: "foto", user: "@mateo_r", avatar: "😎", art: "📸🙈", caption: "Miren a Valentina en clase jajaja 😂", likes: 2500, harm: 1 },
      ],
    },
    {
      title: "La gente quiere más. ¿Qué impulsas?",
      seconds: 18,
      posts: [
        { id: "gol", user: "@hinchas_barranquilla", avatar: "⚽", art: "⚽🥅", caption: "¡Golazo en el último minuto!", likes: 1500, harm: 0 },
        { id: "orejas", user: "@tomas_09", avatar: "🤪", art: "🐰📸", caption: "Le puse orejas de conejo a la foto 😂", likes: 4000, harm: 2 },
        { id: "arepa", user: "@cocina_rapida", avatar: "🍳", art: "🫓🥚", caption: "Arepa de huevo en 30 segundos", likes: 600, harm: 0 },
      ],
    },
    {
      title: "Los comentarios están explotando",
      seconds: 15,
      posts: [
        { id: "comentarios", user: "@andres.v", avatar: "😂", art: "💬💬💬", caption: "«Siempre en la suya» 😂 — 300 comentarios", likes: 6000, harm: 2 },
        { id: "freestyle", user: "@mc_recreo", avatar: "🎤", art: "🎤🔥", caption: "Freestyle en el recreo", likes: 2000, harm: 0 },
        { id: "cancion", user: "@top_musica", avatar: "🎧", art: "🎵🎶", caption: "La canción que todos están escuchando", likes: 1800, harm: 0 },
      ],
    },
    {
      title: "Esto se está volviendo viral",
      seconds: 12,
      posts: [
        { id: "remix", user: "@memes_del_cole", avatar: "🤡", art: "🐰🎶", caption: "REMIX: «Siempre en la suya» con la foto", likes: 10000, harm: 3 },
        { id: "gato", user: "@michis_caos", avatar: "🐱", art: "🐱💥", caption: "Mi gato tumbando todo de la mesa", likes: 3000, harm: 0 },
        { id: "pide", user: "@vale.m", avatar: "🙁", art: "🙏📵", caption: "Por favor, borren esa foto. No di permiso.", likes: 300, harm: -1 },
      ],
    },
    {
      title: "Último empujón antes del récord",
      seconds: 10,
      posts: [
        { id: "exagera", user: "@sofi.x", avatar: "🙄", art: "🙄💬", caption: "«Tampoco exageres» — 200 respuestas", likes: 8000, harm: 2 },
        { id: "baile", user: "@9a_oficial", avatar: "🕺", art: "🕺💃", caption: "Reto de baile del curso", likes: 4000, harm: 0 },
        { id: "paren", user: "@cami_22", avatar: "✋", art: "🛑💬", caption: "«Eso no da risa. Ya paren.»", likes: 500, harm: -1 },
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
        { id: "otros", user: "@scrollia", avatar: "🚀", art: "🏫🏫🏫", caption: "Llevar la foto a otros colegios", likes: 25000, harm: 3 },
        { id: "tema", user: "@scrollia", avatar: "🔄", art: "🕺🐱⚽", caption: "Cambiar de tema y mostrar otra cosa", likes: 2000, harm: -1 },
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
