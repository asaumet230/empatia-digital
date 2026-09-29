import type { PromptExercise, PromptVariant } from "@/lib/content/prompt-exercise";

/* ------------------------------------------------------------------ */
/*  Ejemplo 1 — Crear un banco de preguntas (encuesta de convivencia)  */
/*  El texto del prompt es exactamente lo que se copia.               */
/* ------------------------------------------------------------------ */

export type PromptPartId = "rol" | "contexto" | "objetivo" | "instrucciones" | "limites" | "accion";

export type PromptBlock =
  | { kind: "text"; text: string }
  | { kind: "list"; items: readonly string[] }
  | { kind: "compare"; weak: string; strong: string };

export interface PromptPart {
  id: PromptPartId;
  name: string;
  /** Fragmento del prompt que la representa. */
  quote: string;
  /** Explicación para los profesores. */
  explain: readonly PromptBlock[];
  /** Ejemplo corto para la diapositiva de la fórmula. */
  example: string;
  /** Color de la parte (subrayado en el prompt, acento en la fórmula). */
  color: string;
}

export const PROMPT_PARTS: readonly PromptPart[] = [
  {
    id: "rol",
    name: "Rol",
    quote: "Actúa como asistente de un docente…",
    explain: [
      { kind: "text", text: "Le decimos a la IA desde qué papel debe trabajar." },
      {
        kind: "text",
        text: "Esto ayuda a que no responda como psicólogo, abogado o investigador, sino pensando en las necesidades de un profesor.",
      },
    ],
    example: "Actúa como asistente de un docente.",
    color: "#35C95E",
  },
  {
    id: "contexto",
    name: "Contexto",
    quote: "Estudiantes de 13 a 16 años de secundaria en Barranquilla.",
    explain: [
      { kind: "text", text: "Le explicamos para quién se está creando. Esto hace que adapte:" },
      { kind: "list", items: ["el lenguaje;", "la dificultad;", "el tono;", "la duración."] },
    ],
    example: "Estudiantes de 13 a 16 años.",
    color: "#5AB8FF",
  },
  {
    id: "objetivo",
    name: "Objetivo",
    quote: "Conocer cómo perciben la convivencia dentro del curso.",
    explain: [
      { kind: "text", text: "Esta es probablemente la parte más importante." },
      { kind: "text", text: "La IA necesita saber para qué estamos haciendo la actividad. No es lo mismo pedir:" },
      {
        kind: "compare",
        weak: "Hazme diez preguntas sobre convivencia",
        strong: "Quiero conocer cómo perciben los estudiantes la convivencia de su curso.",
      },
    ],
    example: "Conocer el clima de convivencia.",
    color: "#FFF200",
  },
  {
    id: "instrucciones",
    name: "Instrucciones",
    quote: "10 preguntas breves, en lenguaje para adolescentes…",
    explain: [
      { kind: "text", text: "Aquí establecemos exactamente qué queremos:" },
      {
        kind: "list",
        items: [
          "10 preguntas;",
          "preguntas breves;",
          "lenguaje para adolescentes;",
          "incluir WhatsApp, exclusión, burlas, redes sociales, etc.",
        ],
      },
      { kind: "text", text: "Mientras más claras sean estas instrucciones, menos tendrá que adivinar la IA." },
    ],
    example: "Crea 10 preguntas sobre respeto, exclusión, WhatsApp, etc.",
    color: "#B69CFF",
  },
  {
    id: "limites",
    name: "Límites",
    quote: "Evita: pedir nombre, correo, teléfono…",
    explain: [
      { kind: "text", text: "También le decimos qué NO debe hacer. Por ejemplo:" },
      {
        kind: "list",
        items: ["No pedir nombres.", "No diagnosticar problemas psicológicos.", "No pedir que identifiquen compañeros."],
      },
      { kind: "text", text: "Esto es especialmente importante cuando trabajamos con menores de edad." },
    ],
    example: "No recopiles datos personales ni realices diagnósticos.",
    color: "#FF7A7A",
  },
  {
    id: "accion",
    name: "Acción",
    quote: "Crea el formulario directamente en Tally.",
    explain: [
      {
        kind: "text",
        text: "Esta es una de las grandes diferencias entre usar IA solamente para escribir y utilizarla como agente.",
      },
      { kind: "compare", weak: "Dame las preguntas.", strong: "Crea el formulario directamente en Tally." },
      { kind: "text", text: "Es decir: pensar → crear contenido → ejecutar la tarea." },
    ],
    example: "Crea el formulario en Tally.",
    color: "#FF9F43",
  },
];

/** Todo lo anterior a la acción: idéntico en ambas versiones. */
const BODY = `Actúa como asistente de un docente de secundaria en Barranquilla, Colombia.

Tu tarea es diseñar una encuesta breve y anónima para estudiantes de 13 a 16 años, cuyo objetivo sea conocer cómo perciben la convivencia dentro de su curso, tanto en el colegio como en espacios digitales, colócale de nombre “Encuesta Empatía Digital”.

Crea 10 preguntas claras, breves, neutrales y respetuosas, utilizando un lenguaje fácil de comprender para adolescentes.

Las preguntas deben abordar estos temas:
- respeto entre compañeros;
- inclusión y exclusión;
- burlas y bromas que puedan incomodar;
- convivencia en grupos de WhatsApp;
- comportamiento en redes sociales;
- compartir fotos, videos o mensajes sin permiso;
- ciberacoso;
- confianza para hablar con un adulto;
- conocimiento de a quién pedir ayuda;
- propuestas de los estudiantes para mejorar la convivencia.

Para las preguntas 1 a 9 utiliza respuestas de selección única:
Nunca / A veces / Frecuentemente / Siempre.

La pregunta 10 debe ser abierta y permitir que el estudiante escriba libremente qué podría hacerse para mejorar la convivencia.

Evita:
- pedir nombre, correo, teléfono u otros datos personales;
- preguntas que diagnostiquen ansiedad, depresión u otros problemas psicológicos;
- preguntas acusatorias;
- pedir que el estudiante identifique a otros compañeros;
- lenguaje técnico o difícil.

Antes de comenzar la encuesta incluye este texto:

“Este formulario es anónimo. No hay respuestas buenas ni malas. Queremos conocer cómo percibes la convivencia en tu curso, tanto en el colegio como en espacios digitales. Tus respuestas nos ayudarán a identificar oportunidades para mejorar la convivencia.”

Al finalizar muestra:

“Gracias por participar. Tus respuestas son anónimas y nos ayudarán a construir un mejor ambiente para todos.”

`;

const VARIANTS: readonly PromptVariant[] = [
  {
    id: "sin-tally",
    label: "Sin Tally",
    note: "Funciona en cualquier cuenta de ChatGPT, incluso la gratuita. El formulario se arma en Google Forms.",
    text: `${BODY}Finalmente, entrégame todo listo para copiar y pegar en Google Forms:
1. el nombre del formulario;
2. una breve descripción;
3. el texto de introducción;
4. las 10 preguntas con sus opciones de respuesta, indicando cuáles son obligatorias (todas excepto la pregunta abierta final);
5. el mensaje final;
6. una explicación sencilla, paso a paso, de cómo crear el formulario en Google Forms; cómo configurarlo para que sea anónimo, no solicite inicio de sesión ni recopile correos; cómo compartirlo mediante enlace o código QR, y dónde podrá el profesor consultar las respuestas.`,
  },
  {
    id: "tally",
    label: "Con Tally",
    note: "ChatGPT crea el formulario por ti. Necesita el plugin de Tally conectado en ChatGPT.",
    text: `${BODY}Después de diseñar las preguntas, crea el formulario directamente en Tally usando la conexión disponible.

Configúralo para que:
- sea anónimo;
- no solicite inicio de sesión;
- no recopile correo electrónico;
- muestre una pregunta de manera clara;
- tenga todas las preguntas como obligatorias, excepto la pregunta abierta final;
- esté listo para compartir mediante enlace o código QR.

Finalmente, entrégame:
1. el nombre del formulario;
2. una breve descripción;
3. las preguntas formuladas;
4. el enlace para responderlo;
5. una explicación sencilla de dónde podrá el profesor consultar las respuestas.`,
  },
];

export const ENCUESTA_EXERCISE: PromptExercise = {
  id: "encuesta",
  eyebrow: "Ejemplo 1",
  title: "Crear un banco de preguntas",
  /** Propósito del ejercicio: diagnóstico del clima de aula (sin diagnósticos psicológicos). */
  purpose: [
    {
      label: "¿Para qué?",
      text: "Para conocer cómo se vive la convivencia en tu curso, en el salón y en WhatsApp o redes sociales, y detectar a tiempo señales de alerta como la exclusión, las burlas o el ciberacoso.",
    },
    {
      label: "¿Qué vas a obtener?",
      text: "Una encuesta anónima de 10 preguntas, lista para aplicar a tus estudiantes con un enlace o un código QR.",
    },
  ],
  steps: ["Copia el prompt", "Pégalo en ChatGPT y envíalo", "Lee lo que te responde"],
  variants: VARIANTS,
};

export const PROMPT_BLOCK = {
  partsTitle: "¿Cómo está construido este prompt?",
  formulaTitle: "Una fórmula sencilla para crear prompts",
  closing:
    "Un buen prompt no tiene que sonar sofisticado; tiene que darle suficiente contexto a la IA para que no tenga que adivinar lo que queremos.",
} as const;
