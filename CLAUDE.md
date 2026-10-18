@AGENTS.md

# EmpatIA Digital — contexto y reglas del proyecto

Claude Code carga este archivo en cada sesión. Es la fuente única de verdad del proyecto: lo que dice aquí
ya está verificado y **no hace falta volver a auditar la app** para empezar a trabajar. Reemplaza a
`GUIA.md` e `IMPLEMENTATION_PLAN.md`, que se eliminaron. La primera línea (`@AGENTS.md`) trae las reglas de
Next.js que mantiene `next dev`; no borrarla.

---

## 0. Reglas de trabajo (leer primero)

**Comunicación**
- Responder en español sencillo, corto y sin tecnicismos. El usuario prefiere decisiones claras con una
  recomendación, no listas largas de opciones.

**Contexto**
- Confiar en este archivo. Leer solo los archivos que la tarea toque; no recorrer todo el repositorio.
- Si algo de aquí ya no coincide con el código, corregir este archivo en la misma tarea.
- Al terminar un trabajo relevante, actualizar aquí el estado (§8.7), las decisiones y el historial (§10).

**Next.js 16**
- Esta versión trae cambios que no están en el entrenamiento: antes de usar una API de Next, leer la guía
  en `node_modules/next/dist/docs/` (ver `AGENTS.md`).
- `npx tsc --noEmit` falla con `LayoutProps` porque esos tipos se generan al compilar: para revisar tipos
  usar `npx next build`.
- El usuario suele tener `next dev` abierto en `localhost:3000`, y Next no permite otro `next dev` en la
  misma carpeta: usar el suyo o `next start` en otro puerto. **No cerrar su servidor.**

**Git y publicación**
- `main` se publica sola en Vercel (https://empatia-digital.vercel.app) con cada push. **No unir a `main`
  ni hacer push sin permiso explícito.**
- El Oráculo vive en la rama `feature/oraculo`. **No publicarlo ni configurar Vercel hasta que el usuario
  lo pida** (decisión del 2026-10-13).
- Commits solo cuando el usuario lo pide, uno por paso, con mensaje en español.

**Secretos**
- `.env.local` tiene `OPENAI_API_KEY` y `ORACULO_SECRET`. Nunca leerlo ni mostrarlo; como mucho comprobar
  su formato sin imprimir el valor. Está en `.gitignore`.

**Antes de dar algo por terminado**
- `npm test` · `npx eslint .` · `npx next build`.
- Si cambió la interfaz del Oráculo: `npm run test:e2e`.
- Si cambió el prompt de riesgo o el modelo de riesgo: `npm run eval:riesgo` (gasta un poco de saldo).
- Para ver la interfaz: Playwright sin ventana (ya instalado, con Chromium y WebKit). La extensión de
  Chrome no siempre está conectada.

**Estilo de código** (seguir lo que ya existe)
- Identificadores y comentarios en inglés; textos visibles en español, separados del código en
  `lib/content/` (presentación) y `lib/oraculo/config/` (Oráculo).
- Sin dependencias innecesarias (por ejemplo, `cn()` propio en lugar de clsx).
- Al cambiar un prompt o un mensaje de emergencia del Oráculo, subirle la `version`.

---

## 1. Qué es

Presentación web interactiva para la capacitación **EmpatIA Digital** (Alcaldía de Barranquilla). No es un
PowerPoint: es una página web por sesión, donde cada sección es una "diapositiva" y se avanza con scroll,
teclado o un presentador inalámbrico. Incluye el **Oráculo** (§8), un chat con IA de PazLab y la Fundación
Por Una Sonrisa, todavía sin publicar.

- **Publicado:** https://empatia-digital.vercel.app · **Repositorio:** https://github.com/asaumet230/empatia-digital
- **Stack:** Next.js 16.3 (App Router, Turbopack) · React 19.2 · TypeScript estricto · Tailwind CSS 4 ·
  framer-motion · lucide-react · qrcode. Oráculo: openai 7 · zod 4. Pruebas: Vitest 4 y Playwright.

| Ruta | Para quién | Sesión |
|---|---|---|
| `/` | Todos | Inicio: dirección pública, "Elige tu sesión" con QR por tarjeta |
| `/docentes` | Docentes | *Mediación tecnológica y diagnóstico del aula con IA* (2 h) |
| `/estudiantes` | Estudiantes | *Ciudadanía digital y creadores de paz con IA* (1 h, terminada) |
| `/familias` | Padres, madres y acudientes | *Hogares conectados, familias empáticas* (2 h) |
| `/oraculo` | Estudiantes, docentes, familias | Oráculo (rama `feature/oraculo`) |
| `/oraculo/privacidad`, `/oraculo/autorizacion` | Familias y colegios | Textos legales del Oráculo (borrador) |

---

## 2. Arquitectura

```
app/                      rutas, layout, fuentes y tokens de diseño (globals.css)
  api/oraculo/            único backend: sesion, mensaje, cierre (POST)
components/presentation/  Presentation (raíz), Intro, Section, ProgressNavigation, SessionSwitcher,
                          EvaluationButton (pretest/postest), PresentationFooter
components/intro/         BootSequence, BrandReveal, NetworkBackground (canvas), IntroHud
components/sections/      una diapositiva por archivo (ia/, prompt/, report/, familias/, estudiantes/, alertas/)
components/ui/            piezas reutilizables (Eyebrow, PulseDot, CopyButton, QrCode, BrandIcon, VideoGuide)
components/oraculo/       interfaz del Oráculo
hooks/                    useIntroTimeline, useActiveSection, useOracle
lib/                      constants, animations, intro-timeline, sections (TRACKS), cn, clipboard
lib/content/              todos los textos y datos de la presentación
lib/oraculo/              lógica del Oráculo (§8.3)
e2e/                      pruebas de punta a punta (Playwright)
public/assets/            logos, imágenes, videos y datos de ejemplo (se referencian como /assets/...)
```

- **Cómo funciona la presentación:** cada ruta renderiza `<Presentation track="…">`. El recorrido de cada
  audiencia está en `TRACKS` (`lib/sections.ts`); cada diapositiva recibe `SectionProps` y se envuelve en
  `<Section>`. Para **agregar una diapositiva**: crear el componente y sumarlo a `TRACKS`. La navegación,
  el progreso y el teclado se actualizan solos.
- **Datos:** la presentación es 100 % estática. No tiene base de datos, autenticación (no usa Auth.js),
  cookies ni localStorage. Los "modelos" son constantes tipadas en `lib/content/` (prompts, casos,
  encuesta y rúbrica ficticias, semáforos, juego). Solo enlaza a servicios externos (ChatGPT con
  `?q=`, Google Forms, Tally, sitios de herramientas de IA); no llama a ninguna API.
- **Diseño:** azul marino 60 %, blanco y gris 20 %, verde 15 %, amarillo 5 % (solo impacto). Fuentes:
  Unbounded (títulos), Manrope (texto) y Geist Mono (etiquetas). Respeta `prefers-reduced-motion`.

---

## 3. Navegación durante la presentación

| Acción | Cómo |
|---|---|
| Siguiente / anterior | ↓ ↑, `PageDown` / `PageUp` (presentadores inalámbricos), espacio o scroll |
| Saltar la intro | `Esc` o "Saltar intro" |
| Ir a una diapositiva | Índice lateral derecho (escritorio) |
| Avanzar en "¿Cómo está construido este prompt?" | ← → (no interfieren con ↑ ↓) |
| Cerrar un panel o volver al resumen | `Esc` |

Elementos fijos: menú de sesiones ☰ (arriba a la izquierda, con Inicio, Docentes, Estudiantes y
Familias), botón **Pretest y postest** (abajo a la derecha; enlaces en `lib/content/evaluacion.ts`),
índice lateral y, en la rama del Oráculo, el botón **"¿Necesitas hablar?"** (abajo a la izquierda).
Todos aparecen después de la intro.

---

## 4. Las sesiones

### Común: intro y bloque "La IA no es solamente ChatGPT"
- **Intro "Sistema iniciando":** punto verde → "Iniciando EmpatÍA Digital" → *Conectando personas ·
  Analizando palabras · Activando respeto* → la red converge → **EmpatIA DIGITAL** → "Comenzar experiencia".
  Tiempos en `lib/intro-timeline.ts`.
- **Bloque de IA (8–15 min):** 01 No solo ChatGPT · 02 Mapa interactivo de 6 categorías (clic en una
  herramienta abre su sitio) · 03 La IA puede… · 04 Acompañar (puente a **La escuela** o **El hogar**;
  estudiantes no la ven). Herramientas: ChatGPT, Gemini, Claude, ChatGPT Images, Midjourney, Adobe
  Firefly, Google Veo, Runway, ElevenLabs, GitHub Copilot, Claude Code, OpenAI Codex, Perplexity.

### Docentes (`/docentes`)
Metodología: **ROL + CONTEXTO + OBJETIVO + INSTRUCCIONES + LÍMITES + ACCIÓN**. Cada ejercicio: ¿Para qué? ·
¿Qué obtienes? · 3 pasos · "Copiar prompt" · "Abrir en ChatGPT", con dos pestañas (dos versiones del prompt).
- **Ejemplo 1, la encuesta:** 05 crear un banco de 10 preguntas (pestañas **Sin Tally** para Google Forms /
  **Con Tally**) · 06 las 6 partes (← →) · 07 la fórmula · 08 analizar la encuesta (semáforo, voces, ideas;
  sin Tally se adjunta el CSV) · 09 partes del análisis · 10 semáforo interactivo.
- **Conectar Tally:** botón "¿Cómo conectar Tally? · 2 videos" (crear cuenta → Complementos → Tally →
  instalar). Funciona con ChatGPT gratis.
- **Ejemplo 2, la rúbrica:** 11 crear una rúbrica socioemocional de 4 criterios, escala 1–4 (**Con Excel**,
  .xlsx descargable, cuenta gratis / **Con Google Drive**, requiere Plus) · 12 partes · 13 analizarla
  (adjuntar el Excel) · 14 semáforo · 15 idea clave: *"La IA encuentra patrones; el docente interpreta el
  contexto y decide qué hacer."*
- Siempre **códigos (E01, E02…) en lugar de nombres**.

### Familias (`/familias`)
05 Conflictos en casa (6 conflictos; recomendaciones: conversaciones frecuentes, tono no acusatorio,
acuerdos claros, según UNICEF, AAP y APA) · 06 El simulador (al escribir **"Finaliza la simulación"** la IA
deja de ser el adolescente y da retroalimentación) · 07 Elige tu caso (10 casos; selector **Soy: Papá ·
Mamá · Acudiente** y **Hablo con: Mi hijo · Mi hija**) · 08 idea clave: *"La IA no viene a enseñar a criar…
puede funcionar como un simulador para practicar conversaciones difíciles."*

### Estudiantes (`/estudiantes`, 1 h)
Primeras tres diapositivas del bloque de IA → **"Antes de empezar"** (ciudadanía digital, ciberacoso).
- **"¿Broma o problema?" (~20 min):**
  - 0–9 min **Tú eres el algoritmo**: la clase es el algoritmo de "Scrollia". Debe llegar a 40.000
    «me gusta» en 6 rondas cada vez más rápidas (20 → 8 s). Burlarse de Valentina siempre da más; si se
    acaba el tiempo, elige solo la que más da. Al final: puntaje, mensajes de Valentina, la historia en
    6 imágenes (← →, `public/assets/images/historia/`) y cómo funciona un algoritmo real. **No adelantar
    la lección.**
  - 9–12 Pregunté a la IA (prompt 1).
  - 12–16 La IA propone (prompt 2, **en el mismo chat**; por eso no tiene "Abrir en ChatGPT").
  - 18–20 Tú decides.
  - Cada prompt tiene su diapositiva de 6 partes.
- **"Creadores de paz" (~25 min):** 0–3 Arma tu prompt (tema, formato, estilo, colores) · 3–6 partes ·
  6–8 "Sortear reto" por equipo · 8–20 crear en ChatGPT y editar en Canva · 20–25 Galería y votación.
  **Plan B:** si ChatGPT gratis limita las imágenes, el presentador las genera desde su cuenta.
- Textos en `lib/content/estudiantes.ts`. Votaciones: Mentimeter o a mano alzada (no hay integración).

---

## 5. Materiales y datos de ejemplo (todos ficticios)

| Archivo | Uso |
|---|---|
| `public/assets/data/convivencia-en-mi-curso.csv` | 7 respuestas de la encuesta (de Tally, sin IDs ni la respuesta "prueba") |
| `public/assets/data/rubrica-convivencia-escolar.xlsx` | Rúbrica vacía (ejemplo de resultado) |
| `public/assets/data/rubrica-convivencia-ejemplo.xlsx` | Rúbrica con 15 estudiantes (E01–E15) para practicar |
| `public/assets/videos/tally-*.mp4` | Guía en video de Tally |

Lo que el análisis debe encontrar:
- **Encuesta:** 🟢 saber a quién acudir (6 de 7) · 🔴 respeto en redes (3 de 7 "nunca"), fotos sin permiso,
  pedir ayuda ante el ciberacoso. Hallazgo: *saben a quién acudir, pero no siempre se atreven*.
- **Rúbrica:** 🟢 empatía y respeto (13 de 15) · 🟡 conflictos (5 de 15) · 🔴 convivencia digital (8 de 15).
  Casos que enseñan: **E15** (14 puntos, pero baja en lo digital) y **E03** (un 1 en lo digital).

**Antes de dar el taller:** proyectar el inicio con los QR · probar internet y ChatGPT en la sala · tener el
complemento de Tally y el formulario "Convivencia en mi curso" con las 7 respuestas · Google Drive requiere
ChatGPT Plus · recordar "códigos, no nombres" y que el semáforo no es un diagnóstico · si "Abrir en ChatGPT"
falla por lo largo del prompt, usar "Copiar prompt".

---

## 6. Dónde se cambia cada cosa (presentación)

| Qué | Archivo |
|---|---|
| Orden y diapositivas de cada sesión | `lib/sections.ts` (`TRACKS`) |
| Bloque de IA y herramientas del mapa | `lib/content/ia-ecosistema.ts` |
| Prompt de la encuesta / su análisis y semáforo | `lib/content/prompt-encuesta.ts` / `lib/content/prompt-alertas.ts` |
| Prompts de la rúbrica, análisis y semáforo | `lib/content/prompt-rubrica.ts` |
| Datos de ejemplo | `lib/content/encuesta-ejemplo.ts`, `lib/content/rubrica-ejemplo.ts` |
| Familias / estudiantes | `lib/content/familias.ts` / `lib/content/estudiantes.ts` |
| Pretest y postest | `lib/content/evaluacion.ts` |
| Videos de Tally | `lib/content/tally-guia.ts` |
| Dirección pública (QR) | `SITE_URL` en `lib/constants.ts` o variable de entorno `SITE_URL` |
| Tiempos de la intro | `lib/intro-timeline.ts` |
| Logos de IA | `public/assets/logos/ia/` (monocromos, coloreados con máscara CSS); `scripts/logo-to-white.py` |

---

## 7. Deuda técnica conocida (auditoría del 2026-10-13)

- `components/sections/estudiantes/AlgorithmGameSection.tsx` tiene ~650 líneas y 8 subcomponentes: conviene dividirlo.
- Código y logos sin usar: eliminados el 2026-10-18 (los originales de los logos de IA siguen en el historial de git).
- `npm ls` marca 6 paquetes de `sharp` (wasm) como sobrantes; `npm prune` no los quita y no afectan.
- `PresentationFooter` solo enlaza a la *primera* otra sesión (desde estudiantes y familias lleva a docentes).
- La lógica de "cerrar al tocar afuera" se repite en `EvaluationButton` y `SessionSwitcher`.
- eslint 9.39 ya no tiene soporte (aviso de npm).
- En desarrollo, el ícono "N" de Next.js tapa el botón del Oráculo; en producción no aparece.

---

## 8. Oráculo: chat de escucha y orientación (`/oraculo`)

> **Estado:** Pasos 1 a 6 terminados en `feature/oraculo`, **sin publicar**. Los mensajes de emergencia, la
> política de riesgo, el banco de pruebas y los textos legales son **borradores**: no usar con estudiantes
> hasta que los aprueben los profesionales designados y un abogado.

Chat con IA (OpenAI) sobre convivencia, acoso y ciberacoso. Responsables de los datos: **PazLab** y
**Fundación Por Una Sonrisa** (+57 314 596 7994 · contacto@fporunasonrisa.com). Nace de un prompt de PazLab
("Oráculo de la Mediación") que se adaptó con el usuario.

### 8.1 Decisiones tomadas (no volver a discutirlas)
- **Dentro de EmpatIA Digital:** botón flotante "¿Necesitas hablar?" (abajo a la izquierda) en todas las
  páginas, que abre la página propia `/oraculo` (no un panel). Se esconde durante la intro y en `/oraculo`.
- **Sin mediación entre dos estudiantes:** es una conversación privada de **una persona**. Tres perfiles:
  **estudiante** (escucha y orientación), **docente** (cómo manejar un caso, ruta de la Ley 1620) y
  **padre, madre o cuidador** (cómo acompañar, incluidos casos de abuso: ICBF, Comisaría, Policía de
  Infancia y Adolescencia).
- **No guarda nada:** ni conversaciones ni contadores. Es una herramienta de ayuda, no de vigilancia. El
  navegador guarda la conversación en `sessionStorage` (se borra al cerrar la pestaña); el servidor firma
  un **pase** con el contador y la hora de inicio. Límites: **30 mensajes o 60 minutos**.
- **Consentimiento:** el colegio recoge el permiso firmado de los padres (formato en `/oraculo/autorizacion`)
  y en la app hay un check "Entiendo que…" antes de empezar.
- **Riesgo, dos revisiones en paralelo** (gana la más grave): filtro de moderación de OpenAI + clasificador
  propio. Política acordada: **solo un estudiante en peligro inmediato corta la conversación**. Alto riesgo
  (cualquier perfil) y peligro inmediato contado por un adulto → la IA sigue respondiendo y aparece el panel
  de ayuda. "Revisar" → la IA pregunta con cuidado.
- **Mensajes de emergencia fijos** (no los escribe la IA), con botones que llaman de un toque (`tel:`).
- **Modelos:** conversación `gpt-5.6-luna` (pedido del usuario, más económico); riesgo `gpt-5.4-mini`
  (sin fallos en el banco; con el prompt actual luna también pasa).
- **Diseño:** claro por defecto y oscuro si el dispositivo lo está, con la marca de EmpatIA.
- **Se va a lanzar** para uso real, no solo como piloto, una vez aprobado. Pero **no publicar todavía** en
  Vercel (decisión del 2026-10-13).

### 8.2 Líneas de ayuda (`lib/oraculo/config/lineas.ts`)
123 Emergencias · 141 ICBF · (605) 339 9999 Línea de la Vida Barranquilla · 155 mujeres · 165 GAULA
(extorsión y sextorsión). Elegidas por tener respaldo oficial; **falta confirmarlas por teléfono**.
Descartadas: 192 opción 4 (era de la pandemia) y el WhatsApp del ICBF (inestable). Sin confirmar:
CHATLemos 318 804 4000 y Secretaría de Educación 195.

### 8.3 Cómo está hecho

```
app/oraculo/                    page (flujo), layout (tema), privacidad/, autorizacion/
app/api/oraculo/                sesion · mensaje · cierre (solo POST desde el mismo sitio, sin caché)
lib/oraculo/
  tipos.ts                      contratos zod: perfiles, etapas, niveles y categorías de riesgo, mensajes
  config/                       limites, lineas, mensajes-seguridad, textos (pantallas), legal
  prompts/                      reglas-comunes + estudiante, docente, familia, riesgo, cierre,
                                cautela, acompanamiento/urgente (solo servidor, con versión)
  pase/pase.ts                  pase firmado (HMAC) que fija el historial por hash
  riesgo/                       evaluador (interfaz), moderacion, clasificador, combinado,
                                politica (qué hacer con cada nivel), banco (frases de prueba)
  ia/                           modelo (interfaz), openai (única parte que habla con OpenAI), simulada (pruebas)
  conversacion/                 orquestador (decide todo en el servidor), transcripcion, respuesta
  servidor.ts                   arma las piezas reales con las variables de entorno
  http.ts                       validación, mismo origen, errores; los logs solo llevan un código
  cliente.ts · estado.ts        lado del navegador: llamadas a la API y estado (reducer)
hooks/useOracle.ts              estado + sessionStorage + llamadas
components/oraculo/             ProfileStep, ConsentStep, ChatView, Composer, MessageBubble, SafetyPanel,
                                HelpLineButton, HelpDialog, FinishDialog, ClosingView, OracleLauncher, LegalText…
```

- El orquestador solo conoce el modelo y el evaluador de riesgo por sus interfaces: en las pruebas se usan
  versiones falsas, y cambiar de proveedor solo toca `ia/`.
- Variables de entorno: `OPENAI_API_KEY`, `ORACULO_SECRET` (32+ caracteres), `OPENAI_MODEL` y
  `OPENAI_RISK_MODEL` (opcionales). `ORACULO_IA_SIMULADA=1` activa la IA simulada (solo pruebas; en Vercel
  se ignora). En la IA simulada, las etiquetas `#peligro`, `#alto`, `#revisar` y `#falla` eligen el caso.
- Llamadas a OpenAI con `store: false` y razonamiento `low`. OpenAI no entrena con datos de la API y los
  conserva hasta 30 días para vigilar abusos (salvo retención cero aprobada).
- **Límite conocido del diseño sin almacenamiento:** el servidor no recuerda pases viejos, así que alguien
  con conocimientos técnicos podría reusar uno anterior (o abrir otra sesión) para saltarse un bloqueo o el
  límite. La interfaz nunca lo hace. Las protecciones reales son el límite por visitante de Vercel y el
  tope de gasto en OpenAI.

### 8.4 Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Números de ayuda | `lib/oraculo/config/lineas.ts` |
| Mensajes de emergencia | `lib/oraculo/config/mensajes-seguridad.ts` (`approved: false`) |
| Textos de las pantallas | `lib/oraculo/config/textos.ts` |
| Límites | `lib/oraculo/config/limites.ts` |
| Prompts | `lib/oraculo/prompts/` (subir `version`) |
| Qué hacer con cada nivel de riesgo | `lib/oraculo/riesgo/politica.ts` |
| Frases de prueba de riesgo | `lib/oraculo/riesgo/banco.ts` |
| Política, términos y autorización | `lib/oraculo/config/legal.ts` (`approved: false`; faltan NIT y domicilio, marcados `[Completar: …]`) |
| Colores del tema | `.oraculo-theme` en `app/globals.css` (tokens `o-*`; al imprimir se fuerza papel blanco) |

### 8.5 Pruebas

| Comando | Qué revisa | ¿Gasta saldo? |
|---|---|---|
| `npm test` | 135 pruebas: reglas, pase, riesgo, orquestador, estado, textos legales y guardas de privacidad del código | No |
| `npm run test:e2e` | 49 pruebas en computador, iPhone (WebKit) y Android con IA simulada: flujo completo, panel, pausa, errores, límite 31, origen y pase falsos, accesibilidad (axe) claro y oscuro, y que ningún mensaje llegue al registro del servidor | No |
| `npm run eval:riesgo` | Banco de 51 frases contra la IA real; falla si se escapa un peligro | Sí, poco |

Resultado del banco: 0 peligros sin detectar en 6 corridas. Quedan 2 falsas alarmas del filtro de OpenAI
("jajaja me quiero morir, mañana hay examen" muestra el panel; "mamadera de gallo" pide cautela).

### 8.6 Para publicarlo (cuando el usuario lo decida)
1. Completar NIT y domicilio en `legal.ts` y obtener la aprobación del abogado (`LEGAL.approved = true`).
2. Aprobación profesional de mensajes, política y banco (`SAFETY_MESSAGES.approved = true`).
3. Confirmar por teléfono los números de `lineas.ts`.
4. OpenAI: tope de gasto mensual (Settings → Limits) y, si se puede, pedir la retención cero; si la
   aprueban, actualizar la política.
5. Vercel → Environment Variables (Production): `OPENAI_API_KEY` y un `ORACULO_SECRET` **nuevo**
   (`openssl rand -base64 48`). Nunca `ORACULO_IA_SIMULADA`.
6. Vercel → Firewall: límite por visitante para `/api/oraculo/` (por ejemplo, 20 por minuto por IP).
7. Unir `feature/oraculo` a `main` y probar en un iPhone y un Android reales: un caso normal, uno serio
   (sale el panel) y uno de peligro (se pausa).

### 8.7 Avance

| Paso | Estado | Commit |
|---|---|---|
| 0 · Decisiones, clave, rama | ✅ | — |
| 1 · Tipos, límites, líneas, mensajes y prompts | ✅ | `c1c1ca4` |
| 2 · Servidor, pase firmado, OpenAI, límites | ✅ | `0df5ea2` |
| 3 · Clasificador, política, banco de riesgo | ✅ | `508e6eb` |
| 4 · Interfaz (botón, perfil, chat, panel, cierre) | ✅ | `0872fd9` |
| 5 · Privacidad, términos y autorización | ✅ | `90f4133` |
| 6 · Pruebas de punta a punta, accesibilidad, privacidad, guía | ✅ (local; publicación pospuesta) | `838dfe6` |
| 7 · Aprobaciones externas y lanzamiento | ⏳ depende de PazLab | — |

Ideas pendientes de bajo riesgo: tras un caso de acoso, la IA a veces pregunta "¿te sientes a salvo esta
noche?" aunque el mensaje siguiente sea tranquilo (se puede suavizar en el aviso de acompañamiento).

---

## 9. Decisiones de la presentación
- **Dos versiones de cada prompt** (una para cualquier cuenta y otra con conexión) para que nadie se quede
  sin resultado en la sala.
- **Una idea por pantalla:** los prompts largos se copian con un botón; la explicación va en otra diapositiva.
- **Análisis en lenguaje cotidiano:** "3 de 7 estudiantes" en lugar de porcentajes.
- **Ética:** sin diagnósticos, sin etiquetas, sin identificar estudiantes; códigos en lugar de nombres.

---

## 10. Historial

| Commit | Qué se hizo |
|---|---|
| `2a905e7` | Intro "Sistema iniciando" y arquitectura base |
| `9bb0522` | Logos, ícono y carpeta de assets |
| `e7acf81` | Bloque "La IA no es solo ChatGPT" y ejemplos para docentes |
| `e69cbae` | Rutas por audiencia, familias y rúbrica |
| `59f0f21` | Códigos QR en el inicio |
| `321c031` | Guía en video de Tally |
| `f875756` | Guía del proyecto (hoy fusionada en este archivo) |
| `b8f2712` · `7d9cb55` · `70a7083` | Sesión de estudiantes y juego "Tú eres el algoritmo" |
| `8aeafcc` | Prompts más cortos, juego automático y ajustes por sesión |
| `504497e` | Dirección pública, historia de Valentina en imágenes, pretest y postest |
| `c1c1ca4` → `838dfe6` | Oráculo, pasos 1 a 6 (rama `feature/oraculo`, §8.7) |
