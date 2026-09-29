import { partsFor } from "@/lib/content/prompt-encuesta";
import type { PromptExercise } from "@/lib/content/prompt-exercise";
import type { Report, ReportRow, Status } from "@/lib/content/report";
import { CRITERIA, LEVELS, RUBRIC_STUDENTS, countLevels, needSupport } from "@/lib/content/rubrica-ejemplo";

/* ------------------------------------------------------------------ */
/*  Ejemplo 2 — Rúbrica socioemocional: crearla y analizarla           */
/*  Sin Google Drive (solo en ChatGPT Plus), ChatGPT genera un Excel.  */
/* ------------------------------------------------------------------ */

const FILE_NAME = "Rúbrica de Convivencia Escolar";

const PRIVACY =
  "Usa códigos (E01, E02, E03…) en la columna Estudiante en lugar de nombres, para proteger la privacidad de los estudiantes.";

const DESIGN = `Actúa como asistente de un docente de secundaria en Barranquilla, Colombia.

Tu tarea es diseñar una rúbrica sencilla de observación de convivencia escolar para estudiantes de 13 a 16 años.

El objetivo es ayudar al docente a observar fortalezas y aspectos que requieren acompañamiento en la convivencia escolar, tanto presencial como digital.

Evalúa estos cuatro criterios:

- Empatía.
- Respeto.
- Manejo de conflictos.
- Convivencia digital.

Utiliza una escala de 1 a 4:

1 = Requiere atención.
2 = Necesita acompañamiento.
3 = Adecuado.
4 = Fortaleza.

Para cada criterio, describe claramente qué comportamiento observable corresponde a cada nivel.

Los comportamientos deben ser:

- claros;
- fáciles de observar por un docente;
- apropiados para estudiantes de secundaria;
- neutrales y respetuosos;
- relacionados con situaciones reales del colegio y los espacios digitales.

Evita:

- diagnosticar problemas psicológicos;
- utilizar términos clínicos;
- etiquetar al estudiante;
- sacar conclusiones sobre su personalidad;
- utilizar información médica o sensible.

La rúbrica debe servir como herramienta pedagógica de observación, no como instrumento de diagnóstico psicológico.`;

/** The three sheets, identical for Excel and Google Sheets. */
const SHEETS = (tool: "Excel" | "Google Sheets") => `Crea tres hojas:

HOJA 1: “Rúbrica”

Incluye una tabla con:

- Criterio.
- Nivel 1 — Requiere atención.
- Nivel 2 — Necesita acompañamiento.
- Nivel 3 — Adecuado.
- Nivel 4 — Fortaleza.

Incluye los cuatro criterios: empatía, respeto, manejo de conflictos y convivencia digital.

HOJA 2: “Registro de estudiantes”

Crea estas columnas:

- Estudiante.
- Empatía.
- Respeto.
- Manejo de conflictos.
- Convivencia digital.
- Puntaje total.
- Observaciones.

${PRIVACY}

Deja al menos 40 filas listas para registrar estudiantes.

Configura las cuatro columnas de evaluación para aceptar únicamente valores del 1 al 4.

Configura automáticamente la columna Puntaje total para sumar los cuatro criterios.

HOJA 3: “Interpretación”

Incluye esta guía:

- 4 a 7 puntos: varias áreas requieren atención.
- 8 a 11 puntos: existen aspectos que necesitan acompañamiento.
- 12 a 14 puntos: convivencia generalmente adecuada.
- 15 a 16 puntos: fortalezas claras en convivencia.

Agrega también esta aclaración:

“El puntaje total ofrece una visión general. Los puntajes individuales permiten identificar específicamente qué aspecto necesita acompañamiento.”

Incluye otra nota:

“Esta herramienta es una guía de observación pedagógica y no constituye un diagnóstico psicológico.”

${tool === "Excel" ? "Agrega" : "Si Google Sheets lo permite, agrega"} formato visual sencillo para diferenciar los niveles 1, 2, 3 y 4 con colores.`;

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

Después de diseñar la rúbrica, crea un archivo de Excel (.xlsx) descargable llamado “${FILE_NAME}”.

${SHEETS("Excel")}

Finalmente, entrégame:

1. el enlace para descargar el archivo de Excel;
2. una explicación sencilla de cómo debe utilizarlo el profesor;
3. una explicación sencilla de cómo interpretar los resultados;
4. cómo abrir el archivo en Google Sheets si el profesor prefiere usarlo ahí.`,
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

Después de diseñar la rúbrica, crea directamente un archivo en Google Sheets utilizando la conexión disponible.

El archivo debe llamarse:

“${FILE_NAME}”

${SHEETS("Google Sheets")}

Finalmente, entrégame:

1. el nombre del archivo;
2. el enlace de Google Sheets;
3. una explicación sencilla de cómo debe utilizarlo el profesor;
4. una explicación sencilla de cómo interpretar los resultados.`,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Análisis de la rúbrica ya diligenciada                             */
/* ------------------------------------------------------------------ */

const ANALYSIS = `OBJETIVO

Ayudar al docente a identificar de forma sencilla las fortalezas del curso y los aspectos que podrían necesitar acompañamiento, tanto a nivel grupal como individual.
La IA debe organizar y mostrar los patrones encontrados, pero no reemplazar el criterio profesional del docente.

CÓMO QUIERO EL INFORME
Escríbelo como si se lo explicaras a un colega docente que no sabe de estadística:
* frases cortas y lenguaje cotidiano;
* di “8 de 15 estudiantes” en lugar de porcentajes; no uses promedios ni decimales;
* en lugar de números de nivel, describe el comportamiento con palabras;
* usa 🟢 🟡 🔴 para que se entienda de un vistazo;
* que se pueda leer en menos de dos minutos.

ESTRUCTURA
1. En una frase: cuántos estudiantes se analizaron. Si son pocos, aclara que es solo una orientación.
2. El semáforo del curso: una línea por criterio, con su color y una frase sencilla.
Ejemplo: 🔴 Convivencia digital: 8 de 15 estudiantes necesitan apoyo en cómo se comportan en chats y redes.
Usa 🟢 si la mayoría está en los niveles 3 y 4, 🟡 si varios están en el nivel 2 y 🔴 si muchos están en los niveles 1 y 2.
Incluye un gráfico de barras sencillo con los cuatro criterios.
3. Lo que va bien: máximo tres frases.
4. A quién conviene acompañar: los códigos de la columna “Estudiante” y, en palabras sencillas, en qué aspecto.
Señala si alguno tiene buen puntaje total pero un aspecto bajo.
5. Lo que dicen tus observaciones: los temas que se repiten, en pocas líneas.
6. Tres ideas para esta semana: cada una en máximo dos frases, con un ejemplo.
CIERRE: en máximo tres líneas, ¿qué nos dice esta rúbrica sobre la convivencia del curso?

LÍMITES IMPORTANTES
No realices diagnósticos psicológicos.
No utilices términos clínicos.
No etiquetes a los estudiantes ni saques conclusiones sobre su personalidad.
No determines quién es víctima, agresor o responsable.
Utiliza expresiones como “podría requerir acompañamiento” o “conviene observar”.
Aclara que el semáforo muestra tendencias del grupo y no diagnósticos.`;

const ROLE = "Actúa como asistente de un docente de secundaria en Barranquilla, Colombia.";

const SCALE =
  "donde el docente registró sus observaciones de convivencia con una escala de 1 a 4 en cuatro criterios: empatía, respeto, manejo de conflictos y convivencia digital.";

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

Tu tarea es analizar el archivo de Excel adjunto “${FILE_NAME}”, específicamente la hoja “Registro de estudiantes”, ${SCALE}

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

Tu tarea es acceder directamente, mediante la conexión disponible con Google Drive, al archivo de Google Sheets “${FILE_NAME}” y analizar la hoja “Registro de estudiantes”, ${SCALE}

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
    quote: "Docentes de secundaria en Barranquilla. Estudiantes de 13 a 16 años.",
    explain: [
      { kind: "text", text: "Le explicamos dónde y con quién vamos a utilizar la herramienta." },
      { kind: "text", text: "Eso ayuda a adaptar el lenguaje y las situaciones." },
    ],
  },
  objetivo: {
    quote: "Observar fortalezas y aspectos que requieren acompañamiento en la convivencia escolar.",
    explain: [
      { kind: "text", text: "Aquí le decimos para qué queremos la rúbrica. Esto es fundamental." },
      {
        kind: "compare",
        weak: "Hazme una rúbrica.",
        strong: "Quiero observar fortalezas y aspectos que requieren acompañamiento en la convivencia escolar.",
      },
    ],
  },
  instrucciones: {
    quote: "4 criterios, escala del 1 al 4, comportamientos observables…",
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
    quote: "Evita: diagnosticar problemas psicológicos…",
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
