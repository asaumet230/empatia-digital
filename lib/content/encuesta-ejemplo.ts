/* ------------------------------------------------------------------ */
/*  Encuesta "Convivencia en mi curso" — respuestas FICTICIAS          */
/*  Exportadas de Tally (sin IDs, fechas ni la respuesta de prueba).  */
/*  Misma fuente que public/assets/data/convivencia-en-mi-curso.csv.  */
/* ------------------------------------------------------------------ */

export const ANSWERS = ["Nunca", "A veces", "Frecuentemente", "Siempre"] as const;
export type Answer = (typeof ANSWERS)[number];

export const SURVEY_NAME = "Convivencia en mi curso";

/** Preguntas 1–9 (selección única) y 10 (abierta), tal como están en el formulario. */
export const SURVEY_QUESTIONS = [
  "En mi curso, los compañeros se tratan con respeto.",
  "En mi curso, todos tienen la oportunidad de participar y sentirse incluidos.",
  "Las bromas o burlas entre compañeros se hacen sin incomodar ni hacer sentir mal a otros.",
  "En los grupos de WhatsApp del curso, los compañeros se comunican de forma respetuosa.",
  "En redes sociales, los compañeros del curso suelen tratarse con respeto.",
  "En el curso se respeta el permiso de los demás antes de compartir fotos, videos o mensajes sobre ellos.",
  "Cuando ocurre una situación de ciberacoso o maltrato en internet, los estudiantes saben que deben buscar ayuda.",
  "Me siento con confianza para hablar con un adulto del colegio si algo relacionado con la convivencia me preocupa.",
  "Sé a qué adulto del colegio puedo acudir si necesito ayuda por una situación de convivencia o ciberacoso.",
  "¿Qué crees que podría hacerse para mejorar la convivencia en tu curso, tanto en el colegio como en espacios digitales?",
] as const;

export interface SurveyResponse {
  /** Respuestas a las preguntas 1–9, en orden. */
  answers: readonly Answer[];
  /** Pregunta 10, abierta. */
  open: string;
}

export const SURVEY_RESPONSES: readonly SurveyResponse[] = [
  {
    answers: [
      "Nunca",
      "A veces",
      "A veces",
      "Frecuentemente",
      "Nunca",
      "Frecuentemente",
      "A veces",
      "Frecuentemente",
      "Siempre",
    ],
    open: "nose",
  },
  {
    answers: [
      "A veces",
      "Frecuentemente",
      "Frecuentemente",
      "Frecuentemente",
      "A veces",
      "Frecuentemente",
      "A veces",
      "A veces",
      "Siempre",
    ],
    open: "Que dejen de hacer memes de los compañeros y que los profesores escuchen antes de castigar.",
  },
  {
    answers: [
      "A veces",
      "Frecuentemente",
      "Siempre",
      "Frecuentemente",
      "Frecuentemente",
      "Frecuentemente",
      "Frecuentemente",
      "Nunca",
      "A veces",
    ],
    open: "Hay personas que no dicen nada porque después se burlan más. Debería haber una forma de pedir ayuda sin que todos se enteren",
  },
  {
    answers: [
      "Frecuentemente",
      "A veces",
      "Frecuentemente",
      "A veces",
      "A veces",
      "A veces",
      "A veces",
      "Frecuentemente",
      "Siempre",
    ],
    open: "Hablar más sobre lo que pasa en los grupos de WhatsApp porque muchas peleas empiezan ahí.",
  },
  {
    answers: [
      "A veces",
      "Siempre",
      "Frecuentemente",
      "Siempre",
      "Frecuentemente",
      "Siempre",
      "Frecuentemente",
      "A veces",
      "Frecuentemente",
    ],
    open: "No deberían sacar a personas de los grupos ni compartir fotos para hacerles bromas",
  },
  {
    answers: [
      "Frecuentemente",
      "A veces",
      "A veces",
      "A veces",
      "Nunca",
      "A veces",
      "Nunca",
      "Frecuentemente",
      "Siempre",
    ],
    open: "Hacer actividades para que todos se conozcan mejor y respeten las diferencias",
  },
  {
    answers: ["Siempre", "Nunca", "A veces", "Nunca", "Nunca", "Nunca", "Nunca", "Siempre", "Siempre"],
    open: "Recordar las reglas para usar bien los grupos y no compartir cosas de otros sin permis",
  },
];

/** How many students chose each answer for question `q` (0-based). */
export const countAnswers = (q: number) =>
  ANSWERS.map((answer) => SURVEY_RESPONSES.filter((r) => r.answers[q] === answer).length);

/** The responses as plain text, to paste after a prompt. */
export const surveyAsText = () => {
  const questions = SURVEY_QUESTIONS.map((q, i) => `P${i + 1}. ${q}`).join("\n");
  const answers = SURVEY_RESPONSES.map(
    (r, i) => `Respuesta ${i + 1}: ${r.answers.map((a, q) => `P${q + 1} ${a}`).join(" · ")} · P10 “${r.open}”`,
  ).join("\n");
  return `RESPUESTAS DE LA ENCUESTA “${SURVEY_NAME}” (${SURVEY_RESPONSES.length} estudiantes, anónimas)\n\nPreguntas:\n${questions}\n\nRespuestas (una línea por estudiante):\n${answers}`;
};
