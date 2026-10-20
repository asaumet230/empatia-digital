# EmpatIA Digital

Presentación web interactiva para la capacitación **EmpatIA Digital** (Alcaldía de Barranquilla), con una
sesión para docentes, otra para estudiantes y otra para familias. Incluye el **Oráculo**, un chat de escucha
y orientación con IA (en desarrollo, sin publicar).

📘 **[CLAUDE.md](CLAUDE.md)**: la guía completa. Dinámica del taller, materiales, dónde se
cambia cada cosa, el Oráculo, decisiones e historial.

**Publicado:** https://empatia-digital.vercel.app (cada push a `main` publica)

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run lint
npm test             # pruebas unitarias (sin costo)
npm run test:e2e     # pruebas de punta a punta con IA simulada (sin costo)
npm run eval:riesgo  # banco de riesgo del Oráculo contra la IA real (gasta un poco de saldo)
```

El Oráculo necesita un archivo `.env.local` (no se sube a GitHub) con `OPENAI_API_KEY` y `ORACULO_SECRET`
(32+ caracteres al azar, por ejemplo `openssl rand -base64 48`). El Oráculo queda oculto salvo con
`ORACULO_ACTIVO=true` (`false` lo oculta): en `.env.local` para verlo en local y en Vercel, con redeploy, para publicarlo.

## Rutas

| Ruta | Sesión |
|---|---|
| `/` | Inicio: elige tu sesión (con QR) |
| `/docentes` | Mediación tecnológica y diagnóstico del aula con IA |
| `/estudiantes` | Ciudadanía digital y creadores de paz con IA |
| `/familias` | Hogares conectados, familias empáticas |
| `/oraculo` | Oráculo: chat de escucha y orientación con IA |
| `/oraculo/privacidad` · `/oraculo/terminos` · `/oraculo/autorizacion` | Privacidad, términos y autorización del Oráculo |
| `/privacidad` · `/terminos` | Privacidad y términos del sitio |

## Estructura

```
app/                      rutas, layout y tokens de diseño (globals.css); api/oraculo/ es el único backend
components/presentation/  la presentación: Presentation, Intro, Section, navegación
components/sections/      una "diapositiva" por archivo
components/oraculo/       interfaz del Oráculo
components/ui/            piezas reutilizables
hooks/                    useIntroTimeline, useActiveSection, useOracle, useDismiss
lib/content/              textos y datos de la presentación
lib/oraculo/              lógica del Oráculo (prompts, riesgo, pase firmado, OpenAI)
lib/sections.ts           el recorrido de cada sesión (TRACKS)
e2e/                      pruebas de punta a punta (Playwright)
public/assets/            logos, imágenes, videos y datos de ejemplo
```

## Agregar una diapositiva

1. Crea `components/sections/MiSeccion.tsx` que reciba `SectionProps` y envuelva su contenido en `<Section>`.
2. Añádela al recorrido que corresponda en `TRACKS` (`lib/sections.ts`).

La navegación, el progreso y el control por teclado (↑ ↓, PageUp/PageDown, espacio) se actualizan solos.
