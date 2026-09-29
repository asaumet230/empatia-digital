import {
  AudioLines,
  Clapperboard,
  CodeXml,
  ImageIcon,
  MessageSquareText,
  Search,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Bloque 3 — "La IA no es solamente ChatGPT"                         */
/*  Todo el texto del bloque vive aquí; los componentes solo lo pintan. */
/* ------------------------------------------------------------------ */

export interface AiTool {
  name: string;
  /** Nombre corto para el resumen. */
  short?: string;
  /** Ícono monocromo en `public/assets/logos/ia` (se pinta con máscara CSS). */
  icon: string;
  /** Color al activarse. Las marcas negras usan el verde de EmpatIA. */
  color: string;
  /** Sitio oficial (se abre en una pestaña nueva). */
  url: string;
}

const ICON = (file: string) => `/assets/logos/ia/${file}`;
const GREEN = "var(--green-bright)";

export const AI_TOOLS = {
  chatgpt: { name: "ChatGPT", icon: ICON("openai.svg"), color: GREEN, url: "https://chatgpt.com" },
  chatgptImages: { name: "ChatGPT Images", short: "ChatGPT", icon: ICON("openai.svg"), color: GREEN, url: "https://chatgpt.com" },
  codex: { name: "OpenAI Codex", short: "Codex", icon: ICON("openai.svg"), color: GREEN, url: "https://openai.com/codex" },
  gemini: { name: "Gemini", icon: ICON("gemini.svg"), color: "#4796E3", url: "https://gemini.google.com" },
  claude: { name: "Claude", icon: ICON("claude.svg"), color: "#D97757", url: "https://claude.ai" },
  claudeCode: { name: "Claude Code", icon: ICON("claude.svg"), color: "#D97757", url: "https://claude.com/product/claude-code" },
  midjourney: { name: "Midjourney", icon: ICON("midjourney.png"), color: "#F4F6F8", url: "https://www.midjourney.com" },
  firefly: { name: "Adobe Firefly", short: "Firefly", icon: ICON("firefly.svg"), color: "#EB1000", url: "https://firefly.adobe.com" },
  veo: { name: "Google Veo", short: "Veo", icon: ICON("veo.svg"), color: "#4285F4", url: "https://deepmind.google/models/veo/" },
  runway: { name: "Runway", icon: ICON("runway.svg"), color: GREEN, url: "https://runway.com" },
  elevenlabs: { name: "ElevenLabs", icon: ICON("elevenlabs.svg"), color: GREEN, url: "https://elevenlabs.io" },
  copilot: { name: "GitHub Copilot", icon: ICON("copilot.svg"), color: GREEN, url: "https://github.com/features/copilot" },
  perplexity: { name: "Perplexity", icon: ICON("perplexity.svg"), color: "#22B8CD", url: "https://www.perplexity.ai" },
} as const satisfies Record<string, AiTool>;

export type AiToolId = keyof typeof AI_TOOLS;

export interface AiCategoryTool {
  id: AiToolId;
  description?: string;
  /** Capacidades en lista, cuando el texto lo pide. */
  points?: readonly string[];
}

export interface AiCategory {
  id: string;
  /** Etiqueta corta del nodo en el mapa. */
  label: string;
  /** Título completo en la tarjeta. */
  title: string;
  /** Frase del resumen "La IA puede…". */
  can: string;
  icon: LucideIcon;
  tools: readonly AiCategoryTool[];
  /** Herramientas que aparecen en la diapositiva resumen. */
  summary: readonly AiToolId[];
  /** "Cómo explicarlo en el taller". */
  quote?: string;
}

export const AI_CATEGORIES: readonly AiCategory[] = [
  {
    id: "texto",
    label: "Texto",
    title: "Texto, conversación y razonamiento",
    can: "Conversar y razonar",
    icon: MessageSquareText,
    tools: [
      {
        id: "chatgpt",
        description:
          "Sirve para conversar, redactar, resumir, analizar documentos, trabajar con imágenes, investigar en Internet, analizar datos y crear contenido.",
      },
      {
        id: "gemini",
        description:
          "Es el asistente de Google. Puede conversar, analizar archivos e imágenes, investigar en Internet y conectarse con servicios del ecosistema Google. También integra capacidades de creación de imágenes y video.",
      },
      {
        id: "claude",
        description:
          "Es desarrollado por Anthropic. Está orientado especialmente a razonamiento, escritura, análisis de documentos, programación y trabajos complejos de larga duración.",
      },
    ],
    summary: ["chatgpt", "gemini", "claude"],
    quote:
      "Estas son como inteligencias de propósito general: pueden conversar con nosotros, analizar información, escribir, razonar y ayudarnos a resolver problemas.",
  },
  {
    id: "imagenes",
    label: "Imágenes",
    title: "Creación de imágenes",
    can: "Crear imágenes",
    icon: ImageIcon,
    tools: [
      {
        id: "chatgptImages",
        description:
          "Crea imágenes desde texto y también puede editar fotografías e imágenes existentes mediante instrucciones escritas.",
      },
      {
        id: "midjourney",
        description:
          "Está muy enfocada en creación visual y permite generar imágenes a partir de prompts, imágenes de referencia, estilos y composiciones.",
      },
      {
        id: "firefly",
        description:
          "Está orientada especialmente a creación profesional y diseño; trabaja con imágenes, video, audio y otros recursos creativos.",
      },
      {
        id: "gemini",
        description: "También permite generar y editar imágenes directamente dentro de la conversación.",
      },
    ],
    summary: ["chatgptImages", "midjourney", "firefly"],
    quote:
      "Antes necesitábamos una cámara o un diseñador para obtener una imagen. Hoy podemos describir una imagen que nunca existió y la IA puede crearla.",
  },
  {
    id: "video",
    label: "Video",
    title: "Generación de video",
    can: "Crear video",
    icon: Clapperboard,
    tools: [
      {
        id: "veo",
        description:
          "Puede generar video desde texto o imágenes. Veo 3.1 puede generar además audio, efectos ambientales y diálogo, y admite controles sobre personajes, estilos y movimientos de cámara.",
      },
      {
        id: "runway",
        description:
          "Es una plataforma especializada en creación y edición audiovisual con IA. Permite generar videos a partir de texto o de una imagen y controlar escenas y movimientos mediante prompts.",
      },
      {
        id: "firefly",
        description:
          "Permite convertir texto o imágenes en clips de video y posteriormente editarlos dentro del ecosistema Adobe.",
      },
    ],
    summary: ["veo", "runway", "firefly"],
    quote:
      "Hoy ya no solamente podemos crear una foto falsa. Podemos crear una escena completa que nunca ocurrió, con movimiento, personajes, cámaras e incluso sonido.",
  },
  {
    id: "voz",
    label: "Voz",
    title: "Generación y modificación de voz",
    can: "Crear y clonar voces",
    icon: AudioLines,
    tools: [
      {
        id: "elevenlabs",
        description: "Está especializada en IA de voz. Puede:",
        points: [
          "Convertir texto en voz realista.",
          "Crear voces artificiales.",
          "Clonar una voz a partir de grabaciones.",
          "Transformar una voz manteniendo emoción y forma de hablar.",
          "Generar voz en múltiples idiomas.",
        ],
      },
    ],
    summary: ["elevenlabs"],
    quote: "Una persona ya no necesariamente tuvo que decir algo para que exista un audio con su voz diciéndolo.",
  },
  {
    id: "programacion",
    label: "Código",
    title: "Programación",
    can: "Programar",
    icon: CodeXml,
    tools: [
      {
        id: "copilot",
        description:
          "Ayuda a los desarrolladores dentro de herramientas como Visual Studio Code. Puede completar código, explicarlo, modificar varios archivos, ejecutar tareas y trabajar con agentes de programación.",
      },
      {
        id: "claudeCode",
        description:
          "Es la herramienta de Anthropic enfocada en programación. Puede leer proyectos completos, modificar archivos, ejecutar comandos, probar código y resolver tareas complejas.",
      },
      {
        id: "codex",
        description:
          "Es un agente especializado en ingeniería de software. Puede desarrollar funciones, corregir errores, hacer cambios sobre proyectos y trabajar sobre tareas completas de programación.",
      },
    ],
    summary: ["codex", "claudeCode", "copilot"],
    quote:
      "En mi caso, como desarrollador, ya utilizamos IA no solamente para preguntarle cómo hacer código, sino para ayudarnos a analizar proyectos, detectar errores y construir funcionalidades.",
  },
  {
    id: "investigar",
    label: "Investigar",
    title: "Investigación y análisis de información",
    can: "Investigar",
    icon: Search,
    // Solo aparece en el resumen del material: sin descripciones propias todavía.
    tools: [{ id: "chatgpt" }, { id: "gemini" }, { id: "perplexity" }],
    summary: ["chatgpt", "gemini", "perplexity"],
  },
];

export const AI_BLOCK = {
  title: ["La IA", "no es solamente", "ChatGPT"],
  mapTitle: "Mapa actual de la Inteligencia Artificial",
  mapHint: { pointer: "Pasa el cursor por cada tipo de IA", touch: "Toca cada tipo de IA" },
  summaryTitle: "La IA puede…",
  closing:
    "Cuando hablamos de Inteligencia Artificial, no estamos hablando solamente de ChatGPT. Estamos hablando de un ecosistema enorme de herramientas capaces de escribir, crear imágenes, producir videos, imitar voces, programar e incluso investigar por nosotros.",
  adults: {
    lead: "Nuestros hijos probablemente utilizarán herramientas que nosotros todavía no conocemos.",
    body: "Por eso el objetivo no puede ser aprendernos todas las aplicaciones; tenemos que aprender cómo",
    emphasis: "acompañarlos en su uso.",
  },
  /** Bridge to the next block; each audience continues from its own place. */
  transition: {
    lead: "Ahora veamos esto desde",
    places: { escuela: "La escuela", hogar: "El hogar" },
  },
} as const;
