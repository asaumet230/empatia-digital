# Contenido y sesiones

Qué tiene cada sesión y en qué archivo se cambia cada texto. También sirve para preparar un taller.

## Cómo se maneja la presentación

| Para… | Usa |
|---|---|
| Avanzar o retroceder | Flechas ↓ ↑, `PageDown` / `PageUp` (presentadores inalámbricos), espacio o scroll |
| Saltar la intro | `Esc` o el botón "Saltar intro" |
| Ir a una diapositiva | El índice de la derecha (computador) o el índice del celular |
| Recorrer las partes de un prompt | Flechas ← → |
| Cerrar un panel | `Esc` |
| Abrir directo en una diapositiva | La dirección con `#` y el nombre, por ejemplo `/estudiantes#paz-galeria` |

Después de la intro aparecen:

- el menú de sesiones (arriba a la izquierda);
- el índice;
- el botón **Pretest y postest** (solo en estudiantes);
- el botón del Oráculo (abajo a la izquierda, solo si está encendido).

## Las sesiones

### Partes comunes

**Intro "Sistema iniciando".** Un punto verde, el mensaje "Iniciando EmpatÍA Digital", una red que se une, la marca y el botón "Comenzar experiencia". Los tiempos están en `lib/intro-timeline.ts`.

**Bloque "La IA no es solamente ChatGPT"** (8 a 15 minutos):

1. No solo ChatGPT.
2. Un mapa de 6 categorías de herramientas. Al tocar una herramienta se abre su sitio.
3. Lo que la IA puede hacer.
4. Un puente a la escuela o al hogar (los estudiantes no lo ven).

Herramientas del mapa: ChatGPT, Gemini, Claude, ChatGPT Images, Midjourney, Adobe Firefly, Google Veo, Runway, ElevenLabs, GitHub Copilot, Claude Code, OpenAI Codex y Perplexity.

### Docentes (`/docentes`, 2 horas)

Enseña a escribir prompts con seis partes: **ROL + CONTEXTO + OBJETIVO + INSTRUCCIONES + LÍMITES + ACCIÓN**.

Cada ejercicio muestra para qué sirve, qué se obtiene y los pasos. Tiene los botones "Copiar prompt" y "Abrir en ChatGPT", y dos versiones del prompt: una para cualquier cuenta y otra conectada a otra herramienta.

- **Ejemplo 1, la encuesta.** Crear las preguntas (en Google Forms o en Tally), ver las partes del prompt, analizar las respuestas y leer el semáforo de resultados.
- **Ejemplo 2, la rúbrica.** Crear una rúbrica socioemocional de 4 criterios con escala de 1 a 4 (en Excel o en Google Drive), analizarla y leer su semáforo.
- **Idea clave:** *"La IA encuentra patrones; el docente interpreta el contexto y decide qué hacer."*

Siempre se usan códigos (E01, E02…), nunca nombres de estudiantes.

### Familias (`/familias`, 2 horas)

1. Conflictos frecuentes en casa, con recomendaciones de UNICEF, AAP y APA.
2. Un simulador de conversaciones difíciles. La IA hace de adolescente. Al escribir "Finaliza la simulación", deja el papel y da su opinión.
3. Diez casos para practicar. Se elige quién habla (papá, mamá o acudiente) y con quién (hijo o hija), y el prompt se ajusta solo.

### Estudiantes (`/estudiantes`, 1 hora)

**"¿Broma o problema?"** (unos 20 minutos)

- **Juego "Tú eres el algoritmo"** (minutos 0 a 9). La clase hace de algoritmo de "Scrollia", una red social inventada. Debe juntar 40.000 «me gusta» en 6 rondas cada vez más rápidas: 10, 8, 6, 4, 4 y 4 segundos. Burlarse de Valentina siempre da más puntos. Si se acaba el tiempo, el juego elige solo la publicación que más da. En el celular, las publicaciones aparecen en carrusel.
- **Las reglas del juego** están en `lib/algoritmo/reglas.ts` y tienen pruebas. Si alguien cambia los datos del juego y la lección deja de funcionar (por ejemplo, si no burlarse también llega a la meta), `npm test` lo avisa.
- **Al terminar** se ven el puntaje, los mensajes de Valentina, su historia en 6 imágenes y cómo funciona un algoritmo real. Quien presenta no debe adelantar la lección.
- **Después**, dos prompts que se usan en el mismo chat y una decisión final.

**"Creadores de paz"** (unos 25 minutos)

Cada equipo arma un prompt para una campaña, sortea un reto, crea la imagen con IA y la edita en Canva. Al final, la sube a la galería y se vota.

## Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Orden de las diapositivas | `lib/sections.ts` |
| Bloque de IA y herramientas del mapa | `lib/content/ia-ecosistema.ts` |
| Prompt de la encuesta | `lib/content/prompt-encuesta.ts` |
| Análisis y semáforo de la encuesta | `lib/content/prompt-alertas.ts` |
| Prompts, análisis y semáforo de la rúbrica | `lib/content/prompt-rubrica.ts` |
| Datos de ejemplo | `lib/content/encuesta-ejemplo.ts` y `lib/content/rubrica-ejemplo.ts` |
| Sesión de familias | `lib/content/familias.ts` |
| Sesión de estudiantes | `lib/content/estudiantes.ts` |
| Pretest y postest | `lib/content/evaluacion.ts` |
| Textos de la galería | `lib/content/galeria.ts` |
| Lista de colegios | `lib/content/colegios.ts` (se genera con `node scripts/colegios.mjs`) |
| Pie de página | `lib/content/sitio.ts` |
| Política de privacidad y términos del sitio | `lib/content/privacidad.ts` y `lib/content/terminos.ts` |
| Videos de la guía de Tally | `lib/content/tally-guia.ts` |
| Dirección pública de los QR | `PUBLIC_SITE_URL` en `lib/constants.ts` |
| Tiempos de la intro | `lib/intro-timeline.ts` |
| Logos de las herramientas de IA | `public/assets/logos/ia/` |
| Textos del Oráculo | Ver [oraculo.md](oraculo.md) |

En el pie de página, un enlace con `ready: false` se muestra como "Próximamente".

## Materiales de ejemplo

Todos los datos son inventados.

| Archivo | Para qué |
|---|---|
| `public/assets/data/convivencia-en-mi-curso.csv` | 7 respuestas de la encuesta |
| `public/assets/data/rubrica-convivencia-escolar.xlsx` | Rúbrica vacía |
| `public/assets/data/rubrica-convivencia-ejemplo.xlsx` | Rúbrica con 15 estudiantes (E01 a E15) |
| `public/assets/videos/tally-*.mp4` | Videos de cómo conectar Tally |
| `public/assets/videos/runway-ejemplo.mp4` | Ejemplo de video hecho con Runway |

**Lo que el análisis de la encuesta debería encontrar:**

- 🟢 Saben a quién acudir (6 de 7).
- 🔴 Respeto en redes (3 de 7 responden "nunca"), fotos sin permiso y pedir ayuda ante el ciberacoso.
- Conclusión: *saben a quién acudir, pero no siempre se atreven*.

**Lo que el análisis de la rúbrica debería encontrar:**

- 🟢 Empatía y respeto (13 de 15).
- 🟡 Manejo de conflictos (5 de 15).
- 🔴 Convivencia digital (8 de 15).
- Casos para comentar: **E15** (14 puntos, pero bajo en lo digital) y **E03** (un 1 en lo digital).

## Antes de dar un taller

- Proyecta el inicio con los códigos QR.
- Prueba internet y ChatGPT en la sala.
- Ten listo el complemento de Tally y el formulario de ejemplo con sus 7 respuestas.
- Recuerda que usar Google Drive en ChatGPT exige la cuenta Plus.
- Si "Abrir en ChatGPT" falla porque el prompt es muy largo, usa "Copiar prompt".
- Si ChatGPT gratis limita las imágenes, genéralas tú desde tu cuenta.

## Principios del contenido

- **Dos versiones de cada prompt**, para que nadie se quede sin resultado.
- **Una idea por pantalla.** Los prompts largos se copian con un botón y se explican en otra diapositiva.
- **Lenguaje cotidiano:** "3 de 7 estudiantes" en lugar de porcentajes.
- **Ética:** sin diagnósticos, sin etiquetas y sin identificar a nadie. El semáforo no es un diagnóstico.
