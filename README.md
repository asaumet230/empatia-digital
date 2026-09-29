# EmpatIA Digital

Presentación web interactiva para la capacitación **EmpatIA Digital**, con una sesión para docentes y otra para familias.

📘 **[GUIA.md](GUIA.md)**: la dinámica completa del taller, los materiales y cómo mantener la web.

```bash
npm run dev     # http://localhost:3000
npm run build
```

## Estructura

```
app/                      layout, fuentes y tokens globales (globals.css)
components/presentation/  Presentation (raíz), Intro, Section, ProgressNavigation
components/intro/         BootSequence, BrandReveal, NetworkBackground (canvas), IntroHud
components/sections/      una "diapositiva" por archivo
components/ui/            piezas reutilizables (Eyebrow, PulseDot)
hooks/                    useIntroTimeline, useActiveSection
lib/                      constants, animations, intro-timeline, sections
types/                    tipos compartidos
public/assets/logos/      logos (originales + versiones adaptadas)
public/assets/images/     imágenes para las secciones
scripts/                  utilidades (p. ej. logo-to-white.py)
```

Los archivos de `public/assets` se referencian desde la raíz: `/assets/logos/archivo.png`.

## Rutas

| Ruta | Sesión |
|---|---|
| `/` | Inicio: elige tu sesión |
| `/docentes` | Mediación tecnológica y diagnóstico del aula con IA |
| `/familias` | Hogares conectados, familias empáticas |

Cada ruta es una presentación con su propio recorrido (`TRACKS` en `lib/sections.ts`);
ambas comparten la intro y el bloque "La IA no es solamente ChatGPT".
Los textos de cada bloque viven en `lib/content/`.

## Agregar una sección

1. Crea `components/sections/MiSeccion.tsx` que reciba `SectionProps` y envuelva su contenido en `<Section>`.
2. Añádela al recorrido que corresponda en `TRACKS` (`lib/sections.ts`).

La navegación, el progreso y el control por teclado (↑ ↓, PageUp/PageDown, espacio) se actualizan solos.

## Intro

Los tiempos de cada fase se ajustan en `lib/intro-timeline.ts` (`INTRO_TIMELINE`).
`Esc` o "Saltar intro" la omite. Con `prefers-reduced-motion` arranca directamente en el estado final.
