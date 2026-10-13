# Oráculo — plan de implementación

Chatbot de escucha y orientación sobre convivencia escolar dentro de EmpatIA Digital.
Responsables de los datos: **PazLab** y **Fundación Por Una Sonrisa**
(+57 314 596 7994 · contacto@fporunasonrisa.com).

> No apto para uso real con menores hasta que profesionales designados aprueben los mensajes
> de seguridad, los protocolos de riesgo y los textos legales.

## Decisiones

- Botón flotante en todas las páginas que abre `/oraculo` (página propia, no un panel).
- Conversación privada de una sola persona. Tres perfiles: estudiante, docente, familia.
- No se guarda nada: ni conversaciones ni contadores. Límites (30 mensajes / 60 min) con un
  pase firmado por el servidor; abuso con el límite por visitante de Vercel; presupuesto con
  el tope de gasto de OpenAI.
- Riesgo: filtro de moderación de OpenAI + clasificador propio. Estudiante en riesgo → se
  pausa y aparece el panel de emergencia. Adulto contando un caso → se le orienta.
  Peligro inmediato → se corta en todos los perfiles.
- Mensajes de emergencia fijos y versionados; botones `tel:` a las líneas de ayuda.
- Tema claro por defecto, oscuro si el dispositivo está en modo oscuro.
- Consentimiento: permiso firmado de los padres (lo recoge el colegio) + check en la app.

## Estructura

```
app/oraculo/              páginas: inicio (perfil + check), chat, privacidad, autorización
app/api/oraculo/          servidor
lib/oraculo/
  tipos.ts                contratos (zod)
  config/                 límites, líneas de ayuda, mensajes de seguridad
  prompts/                un prompt por perfil + riesgo + cierre (solo servidor)
  pase/                   pase firmado
  riesgo/                 moderación + clasificador + reglas por perfil
  ia/                     única parte que habla con OpenAI
  conversacion/           orquestador
components/oraculo/       interfaz
```

## Avance

- [x] **Paso 0 — Decisiones.** Responsables, contacto, clave de OpenAI en `.env.local`, rama `feature/oraculo`.
  - [ ] Confirmar por teléfono las líneas de `lib/oraculo/config/lineas.ts`.
- [x] **Paso 1 — Base.** Tipos, límites, líneas, mensajes de seguridad (borrador) y prompts versionados.
  - Hecho cuando: `npm test` valida que la configuración está completa y es coherente. ✅
- [x] **Paso 2 — Servidor.** Pase firmado, endpoint, adaptador de OpenAI, límites, errores y timeouts.
  - Hecho cuando: una conversación completa funciona sin interfaz y el mensaje 31 se rechaza. ✅
  - Endpoints (POST, solo desde el mismo sitio): `/api/oraculo/sesion`, `/api/oraculo/mensaje`, `/api/oraculo/cierre`.
  - Variables de entorno: `OPENAI_API_KEY`, `ORACULO_SECRET` (32+ caracteres al azar),
    `OPENAI_MODEL` (opcional, por defecto `gpt-5.6-luna`).
  - Riesgo provisional: solo el filtro de moderación de OpenAI. En la prueba real no detectó
    "su padrastro le pega y le da miedo volver a la casa": por eso el Paso 3 es obligatorio.
  - Límite conocido del diseño sin almacenamiento: el servidor no recuerda pases viejos, así que
    alguien con conocimientos técnicos podría reusar un pase anterior (o abrir una sesión nueva)
    para saltarse un bloqueo o el límite de mensajes. La interfaz nunca lo hará sola. Las
    protecciones reales contra abuso son el límite por visitante de Vercel y el tope de gasto.
- [ ] **Paso 3 — Seguridad.** Moderación + clasificador + reglas por perfil; banco de frases de prueba
  (jerga adolescente, casos ambiguos, intentos de inyección).
  - Hecho cuando: las frases de peligro activan el panel y las bromas no.
- [ ] **Paso 4 — Interfaz.** Botón flotante, perfil, consentimiento, chat, panel de emergencia, cierre;
  claro/oscuro, teclado, lector de pantalla, celular.
  - Hecho cuando: se prueba completo en iPhone, Android y computador.
- [ ] **Paso 5 — Páginas legales.** Privacidad, términos y formato de autorización (borrador para abogado).
- [ ] **Paso 6 — Pruebas finales y publicación.** Playwright, variables en Vercel, límite por visitante,
  tope de gasto en OpenAI, ningún mensaje en los logs.
- [ ] **Paso 7 — Aprobación y lanzamiento.** Revisión profesional de mensajes y pruebas de riesgo.
