# EmpatIA Digital — Guía del proyecto y de la dinámica

Presentación web interactiva para la capacitación **EmpatIA Digital** (Alcaldía de Barranquilla).
No es un PowerPoint: es una página web por sesión, donde cada sección funciona como una "diapositiva"
y se avanza con scroll, con el teclado o con un presentador inalámbrico.

**Sitio publicado:** https://empatia-digital.vercel.app
**Repositorio:** https://github.com/asaumet230/empatia-digital

---

## 1. Cómo se accede

| Dirección | Para quién | Sesión |
|---|---|---|
| `/` | Todos | Inicio: "Elige tu sesión" |
| `/docentes` | Docentes | *Mediación tecnológica y diagnóstico del aula con IA* (2 h) |
| `/estudiantes` | Estudiantes | *Ciudadanía digital y creadores de paz con IA* (1 h, en construcción) |
| `/familias` | Padres, madres y acudientes | *Hogares conectados, familias empáticas* (2 h) |

- **Códigos QR:** en el inicio, cada tarjeta tiene su QR. En la sala de informática los asistentes lo
  escanean con el celular o escriben la dirección que aparece debajo. En celular el QR se oculta.
- **Selector de sesión (☰, arriba a la izquierda):** botón redondo que se expande al pasar el cursor
  (o con un toque en celular) y muestra **Inicio · Docentes · Familias**. Está en las tres páginas.
- **Pie de página:** al final de cada sesión, "Volver al inicio" e "Ir a la sesión de…".

---

## 2. Cómo se navega durante la presentación

| Acción | Cómo |
|---|---|
| Siguiente / anterior diapositiva | ↓ ↑, `PageDown` / `PageUp` (presentadores inalámbricos), barra espaciadora o scroll |
| Saltar la intro | `Esc` o "Saltar intro" |
| Ir a una diapositiva concreta | Índice lateral derecho (escritorio) |
| Avanzar dentro de "¿Cómo está construido este prompt?" | ← → (no interfieren con ↑ ↓) |
| Cerrar un panel o volver al resumen | `Esc` |

Con `prefers-reduced-motion` activado, la intro arranca en su estado final y las animaciones se reducen.

---

## 3. Estructura común a las dos sesiones

### 00 · Intro "Sistema iniciando"
Pantalla oscura → punto verde → "Iniciando EmpatÍA Digital" → barra de progreso con
**Conectando personas · Analizando palabras · Activando respeto** → la red de nodos converge →
título **EmpatIA DIGITAL** ("IA" en amarillo) → "Tecnología que conecta personas" → botón
"Comenzar experiencia". Aparece el logo de la Alcaldía.

### Bloque "La IA no es solamente ChatGPT" (8–15 min)
| # | Diapositiva | Qué hace |
|---|---|---|
| 01 | No solo ChatGPT | Título grande; del logo de ChatGPT salen las 6 categorías |
| 02 | Mapa de la IA | Mapa interactivo: 6 categorías alrededor de "IA". Al pasar el cursor brotan las herramientas con su logo; el panel muestra qué hace cada una y la frase "cómo explicarlo". Clic en una herramienta = abre su sitio oficial |
| 03 | La IA puede… | Resumen: conversar, crear imágenes, video, voces, programar, investigar, con sus herramientas y la frase de cierre |
| 04 | Acompañar | "Nuestros hijos probablemente utilizarán herramientas que nosotros todavía no conocemos…" y el puente: **La escuela** (docentes) o **El hogar** (familias) |

Herramientas del mapa: ChatGPT, Gemini, Claude, ChatGPT Images, Midjourney, Adobe Firefly, Google Veo,
Runway, ElevenLabs, GitHub Copilot, Claude Code, OpenAI Codex, Perplexity.

---

## 4. Sesión para docentes (`/docentes`)

Metodología central: **ROL + CONTEXTO + OBJETIVO + INSTRUCCIONES + LÍMITES + ACCIÓN**.
Cada ejercicio tiene la misma plantilla: *¿Para qué? · ¿Qué vas a obtener? · 3 pasos · botón
"Copiar prompt" · "Abrir en ChatGPT"* y dos pestañas con las dos versiones del prompt.

### Ejemplo 1 — La encuesta (crearla y analizarla)
| # | Diapositiva | Detalle |
|---|---|---|
| 05 | **Crear un banco de preguntas** | Encuesta anónima de 10 preguntas sobre convivencia (salón, WhatsApp, redes). Pestañas **Sin Tally** (entrega todo listo para Google Forms, funciona en cualquier cuenta) y **Con Tally** (ChatGPT crea el formulario) |
| 06 | ¿Cómo está construido este prompt? | Las 6 partes, una a la vez, con ← → |
| 07 | La fórmula | Las 6 partes como tarjetas y la frase: *"Un buen prompt no tiene que sonar sofisticado…"* |
| 08 | **Alertas tempranas: analizar la encuesta** | Prompt de análisis en lenguaje sencillo (semáforo, lo que va bien, alertas, voces de los estudiantes, tres ideas). **Sin Tally** incluye las 7 respuestas de ejemplo al final del prompt; **Con Tally** lee el formulario "Convivencia en mi curso" |
| 09 | ¿Cómo está construido este prompt? | Las 6 partes del prompt de análisis |
| 10 | Semáforo de la encuesta | Informe interactivo con los datos de ejemplo (ver sección 6) |

**Conectar Tally:** en las pestañas "Con Tally" aparece el botón **"¿Cómo conectar Tally? · 2 videos"**:
- Paso 1 · Crea tu cuenta: si no tienes cuenta, Tally la crea, pero el complemento aún no queda instalado.
- Paso 2 · Instala y autoriza: Complementos → Tally → "Instalar complemento" → aceptar.
- Funciona con la cuenta **gratuita** de ChatGPT. Si ya tienes cuenta en Tally, empieza en el paso 2.

### Ejemplo 2 — La rúbrica socioemocional (crearla y analizarla)
| # | Diapositiva | Detalle |
|---|---|---|
| 11 | **Crear una rúbrica socioemocional** | 4 criterios (empatía, respeto, manejo de conflictos, convivencia digital), escala 1–4. Pestañas **Con Excel** (ChatGPT genera un .xlsx descargable con 3 hojas, validación 1–4, puntaje automático y colores; probado en cuenta gratuita) y **Con Google Drive** (requiere ChatGPT Plus). Botón "Descargar ejemplo de resultado" |
| 12 | ¿Cómo está construido este prompt? | Las 6 partes del prompt de la rúbrica |
| 13 | **Analizar la rúbrica** | Se adjunta el Excel con el clip 📎 y se pega el prompt. Pestañas **Con archivo de Excel** y **Con Google Drive**. Botón "Descargar rúbrica de ejemplo (15 estudiantes ficticios)" |
| 14 | Semáforo de la rúbrica | Informe interactivo con los datos de ejemplo (ver sección 6) |
| 15 | La idea clave | *"La IA encuentra patrones; el docente interpreta el contexto y decide qué hacer."* Qué hace la IA / qué hace el docente / lo que la IA no debe hacer |

**Privacidad:** los prompts y los avisos piden usar **códigos (E01, E02…) en lugar de nombres** de estudiantes.

---

## 5. Sesión para familias (`/familias`)

| # | Diapositiva | Detalle |
|---|---|---|
| 05 | Conflictos en casa | Los 6 conflictos más repetidos (pantallas, videojuegos y sueño, redes y privacidad, contenido compartido, ciberacoso, dificultad para hablar) y las 3 recomendaciones: **conversaciones frecuentes · tono no acusatorio · acuerdos claros** (con base en orientaciones de UNICEF, AAP y APA) |
| 06 | El simulador | 4 pasos y una conversación de ejemplo: al escribir **"Finaliza la simulación"**, la IA deja de ser el adolescente y explica qué hiciste bien, qué mejorar y cómo comunicarte mejor |
| 07 | **Elige tu caso** | 10 casos prácticos. Selector **Soy: Papá · Mamá · Acudiente** y **Hablo con: Mi hijo · Mi hija**, que ajusta el texto del prompt. Cada caso: 1) copiar el caso o abrirlo en ChatGPT, 2) copiar la frase para empezar, 3) "Finaliza la simulación" |
| 08 | La idea clave | *"La IA no viene a enseñar a criar a nuestros hijos. Puede funcionar como un simulador para practicar conversaciones difíciles antes de tenerlas en la vida real."* |

Los 10 casos: videojuegos · demasiado tiempo con el celular · celular hasta tarde · celular en las comidas ·
compartió una foto sin permiso · memes y burlas · algo pasó en redes y no quiere hablar · exclusión o posible
ciberacoso · quiere una red social · "tú también estás todo el día con el celular".

---

## 5b. Sesión para estudiantes (`/estudiantes`) — 1 hora, en construcción

Comparte las tres primeras diapositivas del bloque de IA (sin "Acompañar", que le habla a los adultos).

**"Antes de empezar":** ciudadanía digital, ciberacoso y cómo las redes agrandan un problema.

**Actividad "¿Broma o problema?" (20 min):** 1 votación (Mentimeter o a mano alzada) y 2 prompts de ChatGPT.
El prompt 2 se pega **en el mismo chat** del prompt 1 (por eso no tienen "Abrir en ChatGPT").
Cada prompt pide una respuesta visual (tablas, barras con emojis, flechas) y trae un menú de palabras clave para seguir la conversación (p. ej. PONTE EN SU LUGAR, SIMULA, MENSAJE). Después de cada uno hay una diapositiva "¿Cómo está construido este prompt?" con sus 6 partes.

| Min | Diapositiva | Qué dice o hace el presentador |
|---|---|---|
| 0–9 | Tú eres el algoritmo | Pulsar "Empezar". La clase es el algoritmo de una red inventada (Scrollia) y debe llegar a 40.000 «me gusta». En 6 rondas, cada vez más rápidas (20 → 8 s), elige qué publicación impulsar; burlarse de Valentina siempre da más. Si se acaba el tiempo, el algoritmo elige solo la que más da. Al final: el puntaje, los mensajes de Valentina según lo impulsado y cómo funciona un algoritmo real. **No adelantar la lección** |
| 9–12 | Pregunté a la IA | Prompt 1 (ya trae el caso). "Ahora viene lo interesante: ¿la IA acertó?" |
| 12–16 | La IA propone | Prompt 2. Votación (abierta): "¿Qué podría salir mal?" Leer máximo 3 respuestas |
| 18–20 | Tú decides | "¿Qué aprendimos?" (dos respuestas) y la frase final |

**Sesión 2 · "Creadores de paz" (~25 min):** en equipos crean una pieza de campaña con ChatGPT (textos e imagen).

| Min | Diapositiva | Qué dice o hace el presentador |
|---|---|---|
| 0–3 | Arma tu prompt | Mostrar el armador: se eligen tema, formato, estilo y colores y el prompt se arma solo con la fórmula |
| 3–6 | ¿Cómo está construido? | Las 6 partes del prompt de la campaña, una a la vez con ← → |
| 6–8 | Creadores de paz | Armar equipos. "Sortear reto" le da a cada equipo un tema y un formato; cada equipo vuelve al armador, arma su prompt y lo copia |
| 8–20 | Crea y mejora | ChatGPT propone 3 frases, eligen una y crea la imagen. Luego piden un cambio con los prompts de mejora |
| 20–25 | Galería | 30 segundos por equipo y votación: "¿Qué pieza usarían en el colegio?" |

Crear imágenes en ChatGPT gratis tiene un límite diario y puede pedir iniciar sesión. **Plan B:** los equipos arman el prompt y el presentador genera las imágenes desde su cuenta.

Por ahora las publicaciones del juego usan emojis; cada una acepta una imagen (`image`). Textos: `lib/content/estudiantes.ts`.

---

## 6. Materiales y datos de ejemplo (todos ficticios)

| Archivo | Uso |
|---|---|
| `public/assets/data/convivencia-en-mi-curso.csv` | 7 respuestas de la encuesta (exportadas de Tally, sin IDs, fechas ni la respuesta "prueba") |
| `public/assets/data/rubrica-convivencia-escolar.xlsx` | Rúbrica vacía generada por ChatGPT (ejemplo de resultado) |
| `public/assets/data/rubrica-convivencia-ejemplo.xlsx` | Rúbrica llena con 15 estudiantes (E01–E15) para practicar el análisis |
| `public/assets/videos/tally-*.mp4` | Guía en video para conectar Tally |

**Patrones que se deben encontrar (para comprobar el análisis):**
- **Encuesta:** 🟢 saber a quién acudir (6 de 7) · 🔴 respeto en redes (3 de 7 dicen "nunca"),
  fotos sin permiso, buscar ayuda ante el ciberacoso · hallazgo: *saben a quién acudir, pero no siempre se atreven*.
- **Rúbrica:** 🟢 empatía y respeto (13 de 15) · 🟡 manejo de conflictos (5 de 15) · 🔴 convivencia digital
  (8 de 15) · casos que enseñan: **E15** (14 puntos, pero convivencia digital baja) y **E03** (un 1 en lo digital).

---

## 7. Antes de dar el taller (lista para presentadores)

- [ ] Abrir la sesión correcta y proyectar el inicio con los QR.
- [ ] Probar internet en la sala y que ChatGPT abra en los equipos.
- [ ] Tener tu cuenta de ChatGPT con el **complemento de Tally** instalado para la demostración "Con Tally".
- [ ] Tener en Tally el formulario **"Convivencia en mi curso"** con las 7 respuestas ficticias (sin la de "prueba").
- [ ] Para "Con Google Drive" se necesita ChatGPT Plus; si no, usar las versiones sin Drive.
- [ ] Recordar a los asistentes: **códigos en lugar de nombres**, y que el semáforo **no es un diagnóstico**.
- [ ] El botón "Abrir en ChatGPT" en el análisis de la encuesta sin Tally puede fallar por lo largo del
  prompt; en ese caso usar "Copiar prompt".

---

## 8. Mantenimiento (para quien edite la web)

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · framer-motion ·
lucide-react · qrcode. Desplegado en Vercel (cada `git push` a `main` publica).

```bash
npm run dev     # http://localhost:3000
npm run build   # lo mismo que ejecuta Vercel
npm run lint
```

| Quiero cambiar… | Archivo |
|---|---|
| El orden o las diapositivas de cada sesión | `lib/sections.ts` (`TRACKS`) |
| Textos del bloque de IA y herramientas del mapa | `lib/content/ia-ecosistema.ts` |
| Prompt y explicación de la encuesta | `lib/content/prompt-encuesta.ts` |
| Prompt del análisis de la encuesta y su semáforo | `lib/content/prompt-alertas.ts` |
| Prompts de la rúbrica, su análisis y su semáforo | `lib/content/prompt-rubrica.ts` |
| Datos de ejemplo | `lib/content/encuesta-ejemplo.ts`, `lib/content/rubrica-ejemplo.ts` |
| Casos y textos de familias | `lib/content/familias.ts` |
| Videos de Tally | `lib/content/tally-guia.ts` |
| Dirección pública (QR) | `SITE_URL` en `lib/constants.ts` o variable de entorno `SITE_URL` |
| Tiempos de la intro | `lib/intro-timeline.ts` |

**Agregar una diapositiva:** crear un componente en `components/sections/` que reciba `SectionProps` y
agregarlo al recorrido correspondiente en `TRACKS`. La navegación y el progreso se actualizan solos.

**Logos de herramientas de IA:** `public/assets/logos/ia/` (monocromos, se colorean con máscara CSS;
los originales están en `ia/originales/`). `scripts/logo-to-white.py` convierte logos a blanco sobre transparente.

---

## 9. Historial de trabajo

| Commit | Qué se hizo |
|---|---|
| `2a905e7` | Intro "Sistema iniciando" y arquitectura base de la presentación |
| `9bb0522` | Logos institucionales, ícono de la app y carpeta de assets |
| `e7acf81` | Bloque "La IA no es solo ChatGPT" (mapa interactivo) y ejemplos para docentes |
| `e69cbae` | Rutas por audiencia, sesión de familias, rúbrica, semáforos y prompts simplificados |
| `59f0f21` | Códigos QR en el inicio |
| `321c031` | Guía en video para conectar Tally a ChatGPT |

Decisiones importantes tomadas en el camino:
- **Dos versiones de cada prompt** (una que funciona en cualquier cuenta y otra con conexión) para que nadie
  se quede sin resultado en la sala.
- **Una idea por pantalla:** los prompts largos se copian con un botón; la explicación va en otra diapositiva.
- **Prompts de análisis en lenguaje cotidiano:** "3 de 7 estudiantes" en lugar de porcentajes y promedios.
- **Ética:** sin diagnósticos, sin etiquetas, sin identificar estudiantes; códigos en lugar de nombres.
