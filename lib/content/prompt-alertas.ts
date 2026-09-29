import {
  ANSWERS,
  SURVEY_NAME,
  SURVEY_QUESTIONS,
  SURVEY_RESPONSES,
  countAnswers,
  questionsAsText,
} from "@/lib/content/encuesta-ejemplo";
import { partsFor } from "@/lib/content/prompt-encuesta";
import { TALLY_GUIDE } from "@/lib/content/tally-guia";
import type { PromptExercise } from "@/lib/content/prompt-exercise";
import type { Report, ReportRow, Status } from "@/lib/content/report";

/* ------------------------------------------------------------------ */
/*  Ejemplo 1 · Análisis — Alertas tempranas: analizar la encuesta    */
/* ------------------------------------------------------------------ */

const ROLE = "Actúa como asistente de un docente de secundaria en Barranquilla, Colombia.";

const TASK_TALLY = `Entra a Tally con la conexión disponible, abre el formulario “${SURVEY_NAME}” y analiza todas sus respuestas anónimas.`;

const TASK_PASTED = `Analiza el archivo CSV adjunto con las respuestas anónimas de la encuesta “${SURVEY_NAME}”. Las preguntas están al final de este mensaje.`;

/** Everything after the task: identical in both versions. */
const ANALYSIS = `OBJETIVO
Ayúdame a entender cómo viven la convivencia mis estudiantes, en el colegio y en lo digital. Tú muestras los patrones; yo interpreto y decido.

CÓMO QUIERO EL INFORME
Lenguaje sencillo y frases cortas.
Nada de porcentajes: di “3 de 7 estudiantes”.

El informe debe tener:
1. Cuántos estudiantes respondieron.
2. Un semáforo por tema:
   🟢 va bien
   🟡 a veces
   🔴 varios dicen “Nunca”
3. Un gráfico de barras sencillo.
4. Lo que va bien.
5. Señales para observar.
6. Lo que más piden los estudiantes.
7. Tres ideas para esta semana, con un ejemplo.

LÍMITES
No hagas diagnósticos, no identifiques estudiantes, no digas quién es víctima o agresor y no afirmes que hay ciberacoso solo por estas respuestas. Si hay pocas respuestas, aclara que es solo una orientación. El semáforo muestra tendencias, no diagnósticos.`;

export const ALERTAS_EXERCISE: PromptExercise = {
  id: "alertas",
  eyebrow: "Ejemplo 1 · Análisis",
  title: "Alertas tempranas: analizar la encuesta",
  purpose: [
    {
      label: "¿Para qué?",
      text: "Para leer en minutos lo que respondió tu curso y saber en qué temas de convivencia conviene poner atención.",
    },
    {
      label: "¿Qué vas a obtener?",
      text: "Un informe sencillo con un semáforo de convivencia, las fortalezas del grupo, las posibles alertas y tres recomendaciones para el aula.",
    },
  ],
  steps: ["Copia el prompt", "Pégalo en ChatGPT y envíalo", "Lee el informe que te entrega"],
  variants: [
    {
      id: "sin-tally",
      label: "Sin Tally",
      note: "Descarga el CSV de ejemplo, adjúntalo en ChatGPT con el clip 📎 y pega el prompt. Funciona en cualquier cuenta de ChatGPT.",
      text: `${ROLE}\n\n${TASK_PASTED}\n\n${ANALYSIS}\n\n${questionsAsText()}`,
      download: { href: "/assets/data/convivencia-en-mi-curso.csv", label: "Descargar respuestas de ejemplo (CSV)" },
    },
    {
      id: "tally",
      label: "Con Tally",
      note: `ChatGPT lee las respuestas directamente de Tally. Para analizar tu propio formulario, cambia “${SURVEY_NAME}” por su nombre.`,
      guide: TALLY_GUIDE,
      text: `${ROLE}\n\n${TASK_TALLY}\n\n${ANALYSIS}`,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Informe de ejemplo: lo que el docente recibirá, con los datos de   */
/*  arriba. Los conteos se calculan; la lectura es editorial y usa el  */
/*  lenguaje prudente que pide el prompt.                              */
/* ------------------------------------------------------------------ */

const TOTAL = SURVEY_RESPONSES.length;
const open = (i: number) => `“${SURVEY_RESPONSES[i].open}”`;

const row = (
  question: number,
  label: string,
  status: Status,
  reading: string,
  quotes: readonly number[] = [],
): ReportRow => ({
  key: `p${question + 1}`,
  label,
  status,
  counts: countAnswers(question),
  source: `Pregunta ${question + 1}: “${SURVEY_QUESTIONS[question]}”`,
  reading,
  quotes: quotes.map(open),
});

export const SURVEY_REPORT: Report = {
  eyebrow: "Así se ve el resultado",
  title: "Semáforo de la encuesta",
  sample: `Datos de ejemplo · ${TOTAL} estudiantes`,
  caution: "Pocas respuestas: los resultados son orientativos y no son diagnósticos.",
  hint: { pointer: "Pasa el cursor por cada tema", touch: "Toca cada tema" },
  total: TOTAL,
  scale: ANSWERS,
  rows: [
    row(
      0,
      "Respeto entre compañeros",
      "observar",
      "3 de 7 sienten que el respeto se da solo a veces y 1 dice que nunca. Hay respeto, pero no de forma constante.",
    ),
    row(
      1,
      "Inclusión",
      "observar",
      "Solo 3 de 7 sienten que todos participan frecuentemente o siempre. Conviene observar quién se queda por fuera.",
      [5],
    ),
    row(
      2,
      "Bromas y burlas",
      "observar",
      "Nadie respondió “Nunca”, pero 3 de 7 dicen que las bromas solo a veces se hacen sin incomodar.",
      [1],
    ),
    row(
      3,
      "Grupos de WhatsApp",
      "observar",
      "4 de 7 perciben un trato respetuoso, pero 3 respuestas abiertas hablan de peleas, personas sacadas de los grupos y falta de reglas.",
      [3, 4, 6],
    ),
    row(
      4,
      "Respeto en redes sociales",
      "alerta",
      "3 de 7 dicen que en redes sociales nunca se tratan con respeto. Es el tema con más “Nunca”: conviene explorar qué está pasando ahí.",
    ),
    row(
      5,
      "Fotos y videos sin permiso",
      "alerta",
      "Aunque 4 de 7 dicen que se pide permiso, 3 respuestas abiertas hablan de memes o fotos compartidas para hacer bromas. Aparece una señal.",
      [1, 4, 6],
    ),
    row(
      6,
      "Buscar ayuda ante el ciberacoso",
      "alerta",
      "Solo 2 de 7 creen que se busca ayuda frecuentemente o siempre, y 2 dicen que nunca. Podría requerir acompañamiento.",
      [2],
    ),
    row(
      7,
      "Confianza con un adulto",
      "observar",
      "4 de 7 sienten confianza para hablar con un adulto, pero 3 no siempre. Una respuesta abierta ayuda a entender por qué.",
      [2],
    ),
    row(
      8,
      "Saber a quién acudir",
      "fortaleza",
      "6 de 7 saben a qué adulto acudir. Es la principal fortaleza del grupo.",
    ),
  ],
  keyReading: {
    title: "Lo que más llama la atención",
    text: "Saben a quién acudir (6 de 7), pero no siempre se atreven: solo 2 de 7 creen que se busca ayuda ante el ciberacoso.",
  },
  list: {
    title: "¿Qué están diciendo los estudiantes?",
    items: [
      { label: "Grupos de WhatsApp", value: "3 respuestas", weight: 3 },
      { label: "Fotos, memes o bromas compartidas", value: "3 respuestas", weight: 3 },
      { label: "Pedir ayuda sin exponerse", value: "2 respuestas", weight: 2 },
      { label: "Conocerse y respetar las diferencias", value: "1 respuesta", weight: 1 },
    ],
  },
};

export const KEY_IDEA = {
  title: "La IA encuentra patrones; el docente interpreta el contexto y decide qué hacer.",
  roles: [
    { who: "La IA", does: ["Cuenta las respuestas", "Encuentra patrones", "Agrupa lo que dicen los estudiantes"] },
    { who: "El docente", does: ["Interpreta el contexto", "Conversa con el grupo", "Decide qué hacer"] },
  ],
  limitsTitle: "Lo que la IA no debe hacer",
  limits: [
    "Hacer diagnósticos psicológicos.",
    "Identificar estudiantes.",
    "Decidir quién es víctima, agresor o responsable.",
    "Afirmar que hay bullying o ciberacoso solo por estas respuestas.",
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  ¿Cómo está construido este prompt? — explicación para docentes     */
/* ------------------------------------------------------------------ */

export const ALERTAS_PARTS = partsFor({
  rol: {
    quote: "Actúa como asistente de un docente…",
    explain: [
      { kind: "text", text: "Otra vez le decimos desde qué papel debe trabajar." },
      {
        kind: "text",
        text: "La IA es un apoyo para el docente: no es un psicólogo ni alguien que juzga a los estudiantes.",
      },
    ],
  },
  contexto: {
    quote: `Las respuestas anónimas de la encuesta “${SURVEY_NAME}”.`,
    explain: [
      { kind: "text", text: "Le decimos qué información va a analizar y de dónde viene:" },
      {
        kind: "list",
        items: [
          "respuestas anónimas;",
          "de estudiantes de un mismo curso;",
          "sobre convivencia en el colegio y en lo digital.",
        ],
      },
      { kind: "text", text: "Así entiende que trabaja con temas sensibles." },
    ],
  },
  objetivo: {
    quote: "Ayúdame a entender cómo viven la convivencia mis estudiantes.",
    explain: [
      { kind: "text", text: "No le pedimos solo un resumen. Le pedimos patrones que ayuden a decidir." },
      {
        kind: "compare",
        weak: "Resume las respuestas de la encuesta.",
        strong: "Ayúdame a entender cómo viven la convivencia mis estudiantes.",
      },
      { kind: "text", text: "Y dejamos claro quién hace qué: “Tú muestras los patrones; yo interpreto y decido”." },
    ],
  },
  instrucciones: {
    quote: "Lenguaje sencillo y frases cortas.",
    explain: [
      { kind: "text", text: "Le decimos cómo queremos el informe:" },
      {
        kind: "list",
        items: [
          "lenguaje sencillo, sin porcentajes ni promedios;",
          "un semáforo 🟢 🟡 🔴 por tema;",
          "lo que va bien y las posibles alertas;",
          "lo que dicen los estudiantes;",
          "tres ideas para esta semana.",
        ],
      },
      { kind: "text", text: "Así el resultado se entiende en menos de dos minutos." },
    ],
  },
  limites: {
    quote: "No afirmes que hay ciberacoso solo por estas respuestas.",
    explain: [
      { kind: "text", text: "Aquí los límites son todavía más importantes, porque hablamos de alertas:" },
      {
        kind: "list",
        items: [
          "No hacer diagnósticos.",
          "No identificar estudiantes.",
          "No decidir quién es víctima o agresor.",
          "No exagerar resultados con pocas respuestas.",
        ],
      },
      { kind: "text", text: "Por eso la IA habla de “señales” y de temas que “conviene explorar”." },
    ],
  },
  accion: {
    quote: "Entra a Tally, abre el formulario y analiza todas sus respuestas.",
    explain: [
      {
        kind: "text",
        text: "Con Tally conectado, la IA va sola a buscar las respuestas: no hay que copiar ni pegar nada.",
      },
      {
        kind: "compare",
        weak: "Te voy a pegar las respuestas.",
        strong: "Entra a Tally, abre el formulario y analiza todas sus respuestas.",
      },
      { kind: "text", text: "Sin Tally, adjuntas el CSV con las respuestas. En los dos casos: leer los datos → encontrar patrones → entregar un informe." },
    ],
  },
});
