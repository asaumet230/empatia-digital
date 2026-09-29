import { partsFor } from "@/lib/content/prompt-encuesta";
import type { PromptExercise } from "@/lib/content/prompt-exercise";
import type { Report, ReportRow, Status } from "@/lib/content/report";
import { CRITERIA, LEVELS, RUBRIC_STUDENTS, countLevels, needSupport } from "@/lib/content/rubrica-ejemplo";

/* ------------------------------------------------------------------ */
/*  Ejemplo 2 — Rúbrica socioemocional: crearla y analizarla           */
/*  Sin Google Drive (solo en ChatGPT Plus), ChatGPT genera un Excel.  */
/* ------------------------------------------------------------------ */

const FILE_NAME = "Rúbrica de Convivencia Escolar";

const DESIGN = `Actúa como asistente de un docente de secundaria en Barranquilla, Colombia.

Diseña una rúbrica sencilla para observar la convivencia de estudiantes de 13 a 16 años.

OBJETIVO
Ver fortalezas y aspectos que necesitan acompañamiento, en el colegio y en lo digital.

LA RÚBRICA
Criterios: empatía, respeto, manejo de conflictos y convivencia digital.
Escala:
   1 = Requiere atención
   2 = Necesita acompañamiento
   3 = Adecuado
   4 = Fortaleza
En cada nivel, describe un comportamiento que el docente pueda ver en el salón o en chats y redes.

LÍMITES
Sin diagnósticos, términos clínicos, etiquetas ni información médica. Es una guía para observar, no para diagnosticar.`;

/** The three sheets, identical for Excel and Google Sheets. */
const SHEETS = `1. “Rúbrica”: la tabla con los 4 criterios y sus 4 niveles.
2. “Registro de estudiantes”: columnas Estudiante, Empatía, Respeto, Manejo de conflictos, Convivencia digital, Puntaje total y Observaciones.
   - 40 filas vacías.
   - Los criterios solo aceptan valores de 1 a 4.
   - El puntaje total se suma solo.
   - Códigos (E01, E02…) en lugar de nombres.
3. “Interpretación”:
   4 a 7 puntos: varias áreas requieren atención
   8 a 11: aspectos que necesitan acompañamiento
   12 a 14: convivencia adecuada
   15 a 16: fortalezas claras
   Aclara que conviene mirar cada criterio, no solo el total, y que no es un diagnóstico.

Colorea los niveles 1 a 4 para diferenciarlos.`;

export const RUBRICA_EXERCISE: PromptExercise = {
  id: "rubrica",
  eyebrow: "Ejemplo 2",
  title: "Crear una rúbrica socioemocional",
  purpose: [
    {
      label: "¿Para qué?",
      text: "Para observar, estudiante por estudiante, la empatía, el respeto, el manejo de conflictos y la convivencia digital con criterios claros y comunes.",
    },
    {
      label: "¿Qué vas a obtener?",
      text: "Un archivo de Excel listo para usar: la rúbrica, un registro que suma el puntaje solo y una guía para interpretar los resultados.",
    },
  ],
  steps: ["Copia el prompt", "Pégalo en ChatGPT y envíalo", "Descarga el archivo que te entrega"],
  notice: "Usa códigos (E01, E02…) en lugar de nombres: así proteges la privacidad de tus estudiantes.",
  variants: [
    {
      id: "excel",
      label: "Con Excel",
      note: "Funciona en cualquier cuenta de ChatGPT. El archivo también se puede abrir en Google Sheets.",
      text: `${DESIGN}

EL ARCHIVO
Crea un archivo de Excel (.xlsx) descargable llamado “${FILE_NAME}” con tres hojas:
${SHEETS}

AL FINAL ENTRÉGAME
El enlace de descarga y, en pocas frases, cómo usarlo, cómo leer los resultados y cómo abrirlo en Google Sheets.`,
      download: {
        href: "/assets/data/rubrica-convivencia-escolar.xlsx",
        label: "Descargar ejemplo de resultado (Excel)",
      },
    },
    {
      id: "drive",
      label: "Con Google Drive",
      note: "ChatGPT crea el archivo directamente en tu Google Drive. Necesita ChatGPT Plus con Google Drive conectado.",
      text: `${DESIGN}

EL ARCHIVO
Con la conexión disponible, crea en mi Google Drive un archivo de Google Sheets llamado “${FILE_NAME}” con tres hojas:
${SHEETS}

AL FINAL ENTRÉGAME
El enlace del archivo y, en pocas frases, cómo usarlo y cómo leer los resultados.`,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Análisis de la rúbrica ya diligenciada                             */
/* ------------------------------------------------------------------ */

const ANALYSIS = `OBJETIVO
Ayúdame a ver las fortalezas del curso y a quién conviene acompañar. Tú muestras los patrones; yo interpreto y decido.

CÓMO QUIERO EL INFORME
Lenguaje sencillo y frases cortas.
Nada de porcentajes ni promedios: di “8 de 15 estudiantes”.
Describe con palabras, no con números de nivel.

El informe debe tener:
1. Cuántos estudiantes se analizaron.
2. Un semáforo por criterio:
   🟢 la mayoría en nivel 3 o 4
   🟡 varios en nivel 2
   🔴 muchos en nivel 1 o 2
3. Un gráfico de barras sencillo.
4. Lo que va bien.
5. A quién conviene acompañar: su código y en qué aspecto. Señala si alguien tiene buen total pero un aspecto bajo.
6. Lo que se repite en mis observaciones.
7. Tres ideas para esta semana, con un ejemplo.

LÍMITES
No hagas diagnósticos ni uses términos clínicos, no etiquetes a los estudiantes y no digas quién es víctima o agresor. Usa frases como “conviene observar”. Si son pocos estudiantes, aclara que es solo una orientación. El semáforo muestra tendencias, no diagnósticos.`;

const ROLE = "Actúa como asistente de un docente de secundaria en Barranquilla, Colombia.";

const SCALE =
  "Ahí registré cómo veo a cada estudiante, de 1 a 4, en empatía, respeto, manejo de conflictos y convivencia digital.";

export const RUBRICA_ANALISIS_EXERCISE: PromptExercise = {
  id: "rubrica-analisis",
  eyebrow: "Ejemplo 2 · Análisis",
  title: "Analizar la rúbrica",
  purpose: [
    {
      label: "¿Para qué?",
      text: "Para ver en minutos qué aspectos de convivencia son fortaleza del curso y en qué criterio específico conviene acompañar a algunos estudiantes.",
    },
    {
      label: "¿Qué vas a obtener?",
      text: "Un informe con el semáforo por criterio, los rangos de puntaje, los códigos que podrían necesitar acompañamiento y tres recomendaciones para el aula.",
    },
  ],
  steps: ["Descarga la rúbrica de ejemplo", "Adjúntala en ChatGPT con el clip 📎", "Pega el prompt y envíalo"],
  notice:
    "La rúbrica de ejemplo usa códigos (E01 a E15) y datos ficticios. Con tu curso real, usa códigos, nunca nombres.",
  variants: [
    {
      id: "excel",
      label: "Con archivo de Excel",
      note: "Funciona en cualquier cuenta de ChatGPT: solo adjunta el archivo antes de enviar el prompt.",
      text: `${ROLE}

Analiza el archivo de Excel adjunto “${FILE_NAME}”, hoja “Registro de estudiantes”. ${SCALE}

${ANALYSIS}`,
      download: {
        href: "/assets/data/rubrica-convivencia-ejemplo.xlsx",
        label: "Descargar rúbrica de ejemplo (15 estudiantes ficticios)",
      },
    },
    {
      id: "drive",
      label: "Con Google Drive",
      note: "ChatGPT lee el archivo directamente de tu Google Drive. Necesita ChatGPT Plus con Google Drive conectado.",
      text: `${ROLE}

Entra a Google Drive con la conexión disponible, abre el archivo de Google Sheets “${FILE_NAME}” y analiza la hoja “Registro de estudiantes”. ${SCALE}

${ANALYSIS}`,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Semáforo de la rúbrica de ejemplo                                  */
/* ------------------------------------------------------------------ */

const note = (code: string) => {
  const student = RUBRIC_STUDENTS.find((s) => s.code === code);
  return `${code} · ${student?.note}`;
};

const criterionRow = (c: number, status: Status, reading: string, notes: readonly string[]): ReportRow => ({
  key: `c${c + 1}`,
  label: CRITERIA[c],
  status,
  counts: countLevels(c),
  reading,
  people: needSupport(c),
  quotes: notes.map(note),
});

/** Every code with a level 1–2 somewhere, and in which criteria, in plain words. */
const followUp = RUBRIC_STUDENTS.map((s) => ({
  code: s.code,
  criteria: CRITERIA.filter((_, c) => s.levels[c] <= 2).map((name) => name.toLowerCase()),
})).filter((s) => s.criteria.length > 0);

export const RUBRIC_REPORT: Report = {
  eyebrow: "Así se ve el resultado",
  title: "Semáforo de la rúbrica",
  sample: `Datos de ejemplo · ${RUBRIC_STUDENTS.length} estudiantes`,
  caution: "Observación del docente, no diagnóstico. Los códigos protegen la identidad de cada estudiante.",
  hint: { pointer: "Pasa el cursor por cada criterio", touch: "Toca cada criterio" },
  total: RUBRIC_STUDENTS.length,
  scale: LEVELS,
  rows: [
    criterionRow(
      0,
      "fortaleza",
      "13 de 15 estudiantes muestran consideración por los demás. Es una fortaleza del curso.",
      ["E05", "E11"],
    ),
    criterionRow(1, "fortaleza", "13 de 15 mantienen un trato respetuoso. Solo 2 necesitan recordatorios frecuentes.", [
      "E05",
    ]),
    criterionRow(
      2,
      "observar",
      "5 de 15 podrían requerir acompañamiento para manejar desacuerdos sin que crezcan. En un caso fue necesario intervenir.",
      ["E02", "E11"],
    ),
    criterionRow(
      3,
      "alerta",
      "8 de 15 podrían requerir apoyo en su trato en chats, grupos y redes. Es el aspecto que más conviene trabajar con todo el curso.",
      ["E03", "E09", "E15"],
    ),
  ],
  keyReading: {
    title: "Lo que más llama la atención",
    text: "Un buen total puede esconder algo: E15 suma 14 de 16 puntos, pero en convivencia digital necesita acompañamiento.",
  },
  list: {
    title: "A quién conviene acompañar",
    items: followUp.map((s) => ({ label: s.code, value: s.criteria.join(", ") })),
  },
};

/* ------------------------------------------------------------------ */
/*  ¿Cómo está construido este prompt? — explicación para docentes     */
/* ------------------------------------------------------------------ */

export const RUBRICA_PARTS = partsFor({
  rol: {
    quote: "Actúa como asistente de un docente…",
    explain: [
      { kind: "text", text: "Le estamos diciendo a la IA desde qué papel debe trabajar." },
      {
        kind: "text",
        text: "No queremos que responda como psicólogo o médico. Queremos que piense como una herramienta de apoyo para un profesor.",
      },
    ],
  },
  contexto: {
    quote: "Un docente de secundaria en Barranquilla. Estudiantes de 13 a 16 años.",
    explain: [
      { kind: "text", text: "Le explicamos dónde y con quién vamos a utilizar la herramienta." },
      { kind: "text", text: "Eso ayuda a adaptar el lenguaje y las situaciones." },
    ],
  },
  objetivo: {
    quote: "Ver fortalezas y aspectos que necesitan acompañamiento, en el colegio y en lo digital.",
    explain: [
      { kind: "text", text: "Aquí le decimos para qué queremos la rúbrica. Esto es fundamental." },
      {
        kind: "compare",
        weak: "Hazme una rúbrica.",
        strong: "Quiero ver fortalezas y aspectos que necesitan acompañamiento, en el colegio y en lo digital.",
      },
    ],
  },
  instrucciones: {
    quote: "4 criterios, escala de 1 a 4 y un comportamiento que se pueda ver en cada nivel…",
    explain: [
      { kind: "text", text: "Le decimos exactamente qué queremos:" },
      {
        kind: "list",
        items: [
          "4 criterios;",
          "escala del 1 al 4;",
          "comportamientos observables;",
          "tabla clara;",
          "registro de estudiantes;",
          "puntaje automático;",
          "interpretación de resultados.",
        ],
      },
      { kind: "text", text: "La IA tiene menos cosas que adivinar." },
    ],
  },
  limites: {
    quote: "Sin diagnósticos, términos clínicos, etiquetas ni información médica.",
    explain: [
      { kind: "text", text: "También establecemos lo que no queremos:" },
      {
        kind: "list",
        items: [
          "No diagnosticar.",
          "No etiquetar estudiantes.",
          "No utilizar información médica.",
          "No sacar conclusiones psicológicas.",
        ],
      },
      { kind: "text", text: "Esto es especialmente importante cuando trabajamos con estudiantes." },
    ],
  },
  accion: {
    quote: "Crea el archivo de Excel (o de Google Sheets) listo para usar.",
    explain: [
      { kind: "text", text: "No terminamos pidiendo que nos muestre la rúbrica:" },
      { kind: "compare", weak: "Muéstrame la rúbrica.", strong: "Crea directamente el archivo." },
      { kind: "text", text: "Es decir: pensar → diseñar → estructurar → ejecutar." },
    ],
  },
});
