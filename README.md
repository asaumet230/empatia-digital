# EmpatIA Digital

Presentación web interactiva para la capacitación **EmpatIA Digital** (estudiantes de 13 a 16 años).

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

## Agregar una sección

1. Crea `components/sections/MiSeccion.tsx` que reciba `SectionProps` y envuelva su contenido en `<Section>`.
2. Añádela a `SECTIONS` en `lib/sections.ts`.

La navegación, el progreso y el control por teclado (↑ ↓, PageUp/PageDown, espacio) se actualizan solos.

## Intro

Los tiempos de cada fase se ajustan en `lib/intro-timeline.ts` (`INTRO_TIMELINE`).
`Esc` o "Saltar intro" la omite. Con `prefers-reduced-motion` arranca directamente en el estado final.
