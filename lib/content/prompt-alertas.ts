import { SURVEY_NAME, SURVEY_RESPONSES, surveyAsText } from "@/lib/content/encuesta-ejemplo";
import type { PromptExercise } from "@/lib/content/prompt-exercise";

/* ------------------------------------------------------------------ */
/*  Ejemplo 2 — Alertas tempranas: analizar las respuestas             */
/* ------------------------------------------------------------------ */

const ROLE = "Actúa como asistente de un docente de secundaria en Barranquilla, Colombia.";

const TASK_TALLY = `Tu tarea es acceder directamente, mediante la conexión disponible con Tally, al formulario llamado “${SURVEY_NAME}” y analizar todas las respuestas anónimas recibidas.`;

const TASK_PASTED = `Tu tarea es analizar todas las respuestas anónimas de la encuesta “${SURVEY_NAME}”, que encontrarás al final de este mensaje.`;

/** Everything after the task: identical in both versions. */
const ANALYSIS = `OBJETIVO

Identificar patrones que ayuden al docente a comprender de forma sencilla cómo perciben los estudiantes la convivencia dentro del curso, tanto en el colegio como en espacios digitales.
La IA debe organizar y mostrar los patrones encontrados, pero no reemplazar la interpretación profesional del docente.

ASPECTOS QUE DEBES ANALIZAR
Presta especial atención a:
* respeto entre compañeros;
* inclusión y posibles situaciones de exclusión;
* burlas o bromas que puedan generar incomodidad;
* convivencia en grupos de WhatsApp;
* comportamiento entre compañeros en redes sociales;
* compartir fotos, videos o mensajes sin permiso;
* señales relacionadas con posibles situaciones de ciberacoso;
* confianza para hablar con un adulto;
* conocimiento de a quién acudir para pedir ayuda.
Analiza también todas las respuestas abiertas y señala temas, preocupaciones o propuestas que aparezcan repetidamente.
No identifiques estudiantes ni intentes deducir quién escribió cada respuesta.

PRIMERO: EXPLICA LA MUESTRA
Antes del análisis indica claramente:
* cuántos estudiantes respondieron;
* qué porcentaje representa cada respuesta cuando sea útil;
* si la cantidad de respuestas es pequeña, aclara que los resultados son orientativos y no representan necesariamente a todo el curso.
PRESENTA LOS RESULTADOS DE FORMA MUY VISUAL INCLUYE GRAFICOS
Evita entregar únicamente párrafos largos.
1. Panorama general
Crea una visualización que permita ver cómo respondió el grupo en cada aspecto.
Para cada pregunta muestra claramente cuántos estudiantes respondieron:
* Nunca
* A veces
* Frecuentemente
* Siempre
Utiliza cantidades y porcentajes.
Ejemplo de formato:
Respeto entre compañeros
🔴 Nunca: 1 estudiante — 12,5 %
🟡 A veces: 4 estudiantes — 50 %
🟢 Frecuentemente: 2 estudiantes — 25 %
🟢 Siempre: 1 estudiante — 12,5 %
Después explica en 2 o 3 frases qué significa ese resultado en lenguaje sencillo.
2. Semáforo general de convivencia
Clasifica los aspectos del grupo utilizando este sistema:
🟢 Fortaleza: percepción mayoritariamente positiva.
🟡 Conviene observar: respuestas divididas o predominio de “A veces”.
🔴 Posible alerta temprana: concentración importante de respuestas “Nunca” o señales repetidas en las respuestas abiertas.
Aclara que el semáforo representa tendencias del grupo y no diagnósticos.
3. Fortalezas del grupo
Explica qué aspectos presentan mejores resultados.
Indica siempre los datos que justifican la conclusión.
Ejemplo:
“6 de los 8 estudiantes indican que frecuentemente o siempre saben a qué adulto acudir.”
4. Aspectos que conviene observar
Señala los temas donde las respuestas estén divididas o donde aparezca frecuentemente la opción “A veces”.
Explica qué podría significar esto en situaciones cotidianas del colegio.
5. Posibles alertas tempranas
Identifica únicamente señales que justifiquen una observación más cercana.
No afirmes que existe bullying, ciberacoso, víctima o agresor.
Utiliza expresiones como:
* “conviene explorar”;
* “aparece una señal”;
* “podría requerir acompañamiento”;
* “sería recomendable conversar sobre este tema”.
6. Respuestas abiertas: ¿qué están diciendo los estudiantes?
Agrupa las respuestas abiertas por temas.
Por ejemplo:
* WhatsApp;
* memes;
* fotos compartidas sin permiso;
* exclusión de grupos;
* bromas;
* miedo a pedir ayuda;
* respeto de las diferencias.
Indica cuántas respuestas mencionan cada tema cuando sea posible.
No muestres información que pueda permitir identificar a un estudiante.
7. Tres recomendaciones prácticas para el docente
Propón exactamente tres acciones concretas, sencillas y aplicables en el aula.
Cada recomendación debe explicar:
* qué hacer;
* por qué hacerlo según los resultados;
* un ejemplo sencillo de cómo implementarlo.
Prioriza actividades preventivas, conversación grupal, normas claras de convivencia digital y mecanismos seguros para pedir ayuda.
CIERRE
Finaliza con una conclusión sencilla de máximo cinco líneas que responda:
“¿Qué nos está diciendo esta encuesta sobre la convivencia del curso?”
LÍMITES IMPORTANTES
No realices diagnósticos psicológicos.
No identifiques estudiantes.
No determines quién es víctima, agresor o responsable.
No afirmes que existe bullying o ciberacoso únicamente por estas respuestas.
No exageres resultados obtenidos con pocas respuestas.
No presentes porcentajes sin explicar también cuántos estudiantes representan.
No utilices lenguaje técnico innecesario.
El informe debe poder ser entendido fácilmente por un docente que no sea experto en análisis de datos.`;

export const ALERTAS_EXERCISE: PromptExercise = {
  id: "alertas",
  eyebrow: "Ejemplo 2",
  title: "Alertas tempranas",
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
      text: `${ROLE}\n${TASK_TALLY}\n${ANALYSIS}`,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Informe de ejemplo: lo que el docente recibirá, con los datos de   */
/*  arriba. Los conteos se calculan; la lectura es editorial y usa el  */
/*  lenguaje prudente que pide el prompt.                              */
/* ------------------------------------------------------------------ */

export type Status = "fortaleza" | "observar" | "alerta";

export const STATUS = {
  fortaleza: { label: "Fortaleza", color: "#35C95E" },
  observar: { label: "Conviene observar", color: "#FFD23F" },
  alerta: { label: "Posible alerta temprana", color: "#FF6B6B" },
} as const satisfies Record<Status, { label: string; color: string }>;

/** Colors of the four answers (all questions are phrased positively: "Nunca" is the worrying one). */
export const ANSWER_COLORS = ["#FF6B6B", "#FFD23F", "#7ED99A", "#35C95E"] as const;

export interface ReportAspect {
  /** Pregunta (0-based) en SURVEY_QUESTIONS. */
  question: number;
  label: string;
  status: Status;
  reading: string;
  /** Respuestas abiertas relacionadas (índices en SURVEY_RESPONSES). */
  quotes?: readonly number[];
}

export const REPORT_ASPECTS: readonly ReportAspect[] = [
  {
    question: 0,
    label: "Respeto entre compañeros",
    status: "observar",
    reading:
      "3 de 7 estudiantes sienten que el respeto se da solo a veces y 1 dice que nunca. Hay respeto, pero no de forma constante.",
  },
  {
    question: 1,
    label: "Inclusión",
    status: "observar",
    reading:
      "Solo 3 de 7 sienten que todos participan frecuentemente o siempre. Conviene observar quién se queda por fuera en las actividades.",
    quotes: [5],
  },
  {
    question: 2,
    label: "Bromas y burlas",
    status: "observar",
    reading:
      "Nadie respondió “Nunca”, pero 3 de 7 dicen que las bromas solo a veces se hacen sin incomodar. Hay bromas que a algunos les molestan.",
    quotes: [1],
  },
  {
    question: 3,
    label: "Grupos de WhatsApp",
    status: "observar",
    reading:
      "4 de 7 perciben un trato respetuoso, pero 3 respuestas abiertas hablan de los grupos: peleas, personas sacadas de los grupos y la necesidad de reglas.",
    quotes: [3, 4, 6],
  },
  {
    question: 4,
    label: "Respeto en redes sociales",
    status: "alerta",
    reading:
      "3 de 7 estudiantes (43 %) dicen que en redes sociales nunca se tratan con respeto. Es el aspecto con más respuestas “Nunca”: conviene explorar qué está pasando ahí.",
  },
  {
    question: 5,
    label: "Fotos y videos sin permiso",
    status: "alerta",
    reading:
      "Aunque 4 de 7 dicen que se pide permiso, 3 respuestas abiertas mencionan memes o fotos compartidas para hacer bromas. Aparece una señal que sería recomendable conversar con el grupo.",
    quotes: [1, 4, 6],
  },
  {
    question: 6,
    label: "Buscar ayuda ante el ciberacoso",
    status: "alerta",
    reading:
      "Solo 2 de 7 creen que los estudiantes buscan ayuda frecuentemente o siempre, y 2 dicen que nunca. Podría requerir acompañamiento para que pedir ayuda se sienta seguro.",
    quotes: [2],
  },
  {
    question: 7,
    label: "Confianza con un adulto",
    status: "observar",
    reading:
      "4 de 7 sienten confianza para hablar con un adulto, pero 3 no siempre. Una respuesta abierta ayuda a entender por qué.",
    quotes: [2],
  },
  {
    question: 8,
    label: "Saber a quién acudir",
    status: "fortaleza",
    reading:
      "6 de 7 estudiantes (86 %) saben frecuentemente o siempre a qué adulto acudir. Es la principal fortaleza del grupo.",
  },
];

/** Temas de las respuestas abiertas (índices en SURVEY_RESPONSES). */
export const REPORT_THEMES = [
  { label: "Grupos de WhatsApp", responses: [3, 4, 6] },
  { label: "Fotos, memes o bromas compartidas", responses: [1, 4, 6] },
  { label: "Pedir ayuda sin exponerse", responses: [1, 2] },
  { label: "Conocerse y respetar las diferencias", responses: [5] },
] as const;

export const REPORT_BLOCK = {
  eyebrow: "Así se ve el resultado",
  title: "Semáforo de convivencia",
  sample: `Datos de ejemplo · ${SURVEY_RESPONSES.length} estudiantes`,
  caution: "Pocas respuestas: los resultados son orientativos y no son diagnósticos.",
  hint: { pointer: "Pasa el cursor por cada tema", touch: "Toca cada tema" },
  keyReading: {
    title: "Lo que más llama la atención",
    text: "Saben a quién acudir (6 de 7), pero no siempre se atreven: solo 2 de 7 creen que se busca ayuda ante el ciberacoso.",
  },
  themesTitle: "¿Qué están diciendo los estudiantes?",
} as const;

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
