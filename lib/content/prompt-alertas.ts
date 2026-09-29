import {
  ANSWERS,
  SURVEY_NAME,
  SURVEY_QUESTIONS,
  SURVEY_RESPONSES,
  countAnswers,
  surveyAsText,
} from "@/lib/content/encuesta-ejemplo";
import { partsFor } from "@/lib/content/prompt-encuesta";
import { TALLY_GUIDE } from "@/lib/content/tally-guia";
import type { PromptExercise } from "@/lib/content/prompt-exercise";
import type { Report, ReportRow, Status } from "@/lib/content/report";

/* ------------------------------------------------------------------ */
/*  Ejemplo 1 · Análisis — Alertas tempranas: analizar la encuesta    */
/* ------------------------------------------------------------------ */

const ROLE = "Actúa como asistente de un docente de secundaria en Barranquilla, Colombia.";

const TASK_TALLY = `Tu tarea es acceder directamente, mediante la conexión disponible con Tally, al formulario llamado “${SURVEY_NAME}” y analizar todas las respuestas anónimas recibidas.`;

const TASK_PASTED = `Tu tarea es analizar todas las respuestas anónimas de la encuesta “${SURVEY_NAME}”, que encontrarás al final de este mensaje.`;

/** Everything after the task: identical in both versions. */
const ANALYSIS = `OBJETIVO

Identificar patrones que ayuden al docente a comprender de forma sencilla cómo perciben los estudiantes la convivencia dentro del curso, tanto en el colegio como en espacios digitales.
La IA debe organizar y mostrar los patrones encontrados, pero no reemplazar la interpretación profesional del docente.

ASPECTOS QUE DEBES ANALIZAR
* respeto entre compañeros;
* inclusión y posibles situaciones de exclusión;
* burlas o bromas que puedan generar incomodidad;
* convivencia en grupos de WhatsApp;
* comportamiento entre compañeros en redes sociales;
* compartir fotos, videos o mensajes sin permiso;
* señales relacionadas con posibles situaciones de ciberacoso;
* confianza para hablar con un adulto;
* conocimiento de a quién acudir para pedir ayuda.
Analiza también todas las respuestas abiertas.
No identifiques estudiantes ni intentes deducir quién escribió cada respuesta.

CÓMO QUIERO EL INFORME
Escríbelo como si se lo explicaras a un colega docente que no sabe de estadística:
* frases cortas y lenguaje cotidiano;
* di “3 de 7 estudiantes” en lugar de porcentajes; no uses promedios ni decimales;
* usa 🟢 🟡 🔴 para que se entienda de un vistazo;
* que se pueda leer en menos de dos minutos.

ESTRUCTURA
1. En una frase: cuántos estudiantes respondieron. Si son pocos, aclara que es solo una orientación y no representa necesariamente a todo el curso.
2. El semáforo del curso: una línea por aspecto, con su color y una frase sencilla.
Ejemplo: 🔴 Respeto en redes sociales: 3 de 7 estudiantes dicen que en redes nunca se tratan con respeto.
Usa 🟢 si la mayoría responde de forma positiva, 🟡 si las respuestas están divididas o predomina “A veces” y 🔴 si varios responden “Nunca” o el tema se repite en las respuestas abiertas.
Incluye un gráfico de barras sencillo con todos los aspectos.
3. Lo que va bien: máximo tres frases.
4. Posibles alertas tempranas: solo las señales que justifiquen una observación más cercana. Usa expresiones como “conviene explorar”, “aparece una señal” o “sería recomendable conversar sobre este tema”.
5. Lo que dicen los estudiantes: los temas que se repiten en las respuestas abiertas y cuántas respuestas los mencionan.
6. Tres ideas para esta semana: cada una en máximo dos frases, con un ejemplo. Prioriza conversaciones grupales, acuerdos de convivencia digital y formas seguras de pedir ayuda.
CIERRE: en máximo tres líneas, ¿qué nos está diciendo esta encuesta sobre la convivencia del curso?

LÍMITES IMPORTANTES
No realices diagnósticos psicológicos.
No identifiques estudiantes.
No determines quién es víctima, agresor o responsable.
No afirmes que existe bullying o ciberacoso únicamente por estas respuestas.
No exageres resultados obtenidos con pocas respuestas.
Aclara que el semáforo muestra tendencias del grupo y no diagnósticos.`;

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
      note: `Incluye las ${SURVEY_RESPONSES.length} respuestas de ejemplo (ficticias), así funciona en cualquier cuenta de ChatGPT.`,
      text: `${ROLE}\n${TASK_PASTED}\n${ANALYSIS}\n\n${surveyAsText()}`,
      download: { href: "/assets/data/convivencia-en-mi-curso.csv", label: "Descargar respuestas de ejemplo (CSV)" },
    },
    {
      id: "tally",
      label: "Con Tally",
      note: `ChatGPT lee las respuestas directamente de Tally. Para analizar tu propio formulario, cambia “${SURVEY_NAME}” por su nombre.`,
      guide: TALLY_GUIDE,
      text: `${ROLE}\n${TASK_TALLY}\n${ANALYSIS}`,
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
    quote: "Identificar patrones que ayuden al docente a comprender cómo perciben la convivencia.",
    explain: [
      { kind: "text", text: "No le pedimos solo un resumen. Le pedimos patrones que ayuden a decidir." },
      {
        kind: "compare",
        weak: "Resume las respuestas de la encuesta.",
        strong: "Identifica patrones que me ayuden a entender cómo perciben la convivencia.",
      },
      { kind: "text", text: "Y dejamos claro que la IA organiza, pero no reemplaza la mirada del docente." },
    ],
  },
  instrucciones: {
    quote: "Escríbelo como si se lo explicaras a un colega docente…",
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
    quote: "No afirmes que existe bullying o ciberacoso únicamente por estas respuestas.",
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
    quote: "Accede directamente al formulario en Tally y analiza todas las respuestas.",
    explain: [
      {
        kind: "text",
        text: "Con Tally conectado, la IA va sola a buscar las respuestas: no hay que copiar ni pegar nada.",
      },
      {
        kind: "compare",
        weak: "Te voy a pegar las respuestas.",
        strong: "Accede al formulario y analiza todas las respuestas.",
      },
      { kind: "text", text: "Es decir: leer los datos → encontrar patrones → entregar un informe." },
    ],
  },
});
