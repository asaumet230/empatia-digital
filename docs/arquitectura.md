# Arquitectura

Cómo está organizado el código y qué reglas sigue. Es la primera guía que conviene leer.

## Las tres partes del proyecto

Todo vive en una sola aplicación de Next.js.

| Parte | Páginas | Cómo funciona |
|---|---|---|
| Presentación | `/`, `/docentes`, `/estudiantes`, `/familias` | Páginas estáticas. No llaman a ningún servidor |
| Galería | `/subir` | Envía cada imagen a `/api/galeria`, que la guarda en Google Drive |
| Oráculo | `/oraculo` | Habla con `/api/oraculo/…`, que consulta a OpenAI |

No hay base de datos, ni inicio de sesión, ni cookies.

La presentación solo enlaza a servicios externos: ChatGPT, Google Forms, Tally y los sitios de las herramientas de IA.

## Carpetas

```
app/                  páginas, diseño general y colores (globals.css)
  api/galeria/        recibe las imágenes de la galería
  api/oraculo/        sesión, mensaje y cierre del Oráculo

components/
  presentation/       el motor de la presentación: navegación, índice, intro, menú de sesiones
  intro/              la animación de inicio (network/ tiene el dibujo del fondo)
  sections/           las diapositivas, agrupadas por tema
  oraculo/            la interfaz del chat
  galeria/            la página de subida
  ui/                 piezas que se usan en todo el sitio

hooks/                lógica reutilizable con estado (carrusel, copiar, galería, Oráculo…)

lib/
  content/            todos los textos y datos de la presentación
  oraculo/            la lógica del Oráculo (ver oraculo.md)
  galeria/            revisión y envío de imágenes
  algoritmo/          reglas del juego "Tú eres el algoritmo" (puntaje, meta, daño, orden)
  sections.ts         el orden de las diapositivas de cada sesión

types/                tipos compartidos
e2e/                  pruebas de punta a punta
scripts/              utilidades: lista de colegios, fondo del chat, logos, script de Drive
public/assets/        imágenes, logos, videos y archivos de ejemplo
```

Cuando una diapositiva tiene varias piezas, van en una subcarpeta con su nombre. Por ejemplo: `sections/ia/mapa/`, `sections/familias/casos/`, `sections/estudiantes/algoritmo/`.

## Cómo funciona la presentación

Cada página de sesión muestra `<Presentation track="docentes">` (o `estudiantes`, `familias`).

El orden de las diapositivas está en `TRACKS`, dentro de `lib/sections.ts`. Cada diapositiva es una línea:

```ts
{ id: "ia-mapa", label: "Mapa de la IA", component: AiMapSection }
```

- `id` es el nombre de la diapositiva en la dirección. `/estudiantes#paz-galeria` abre directo en esa diapositiva y se salta la intro.
- `label` es el nombre que aparece en el índice.
- `component` es el componente que la dibuja.

`Presentation` se encarga del teclado, del índice lateral y de la barra de progreso.

### Agregar una diapositiva

1. Crea el componente en `components/sections/<tema>/`. Recibe `SectionProps` y devuelve un `<Section>`.
2. Pon sus textos en `lib/content/`.
3. Agrégala a `TRACKS` en la sesión que corresponda.

El índice, el progreso y el teclado se actualizan solos.

## Piezas que ya existen

Antes de escribir algo nuevo, revisa esta lista.

| Si necesitas… | Usa |
|---|---|
| El título de una diapositiva | `<SlideTitle>`, en tres tamaños: `large`, `medium`, `regular` |
| La etiqueta pequeña con número ("01 · …") | `<Eyebrow>` |
| Una ventana emergente con su botón de cerrar | `<Dialog>` y `<CloseButton>` |
| Tarjetas en carrusel en el celular y en cuadrícula en pantallas grandes | `useCarousel()` |
| Copiar al portapapeles y confirmar | `useCopy()` o `<CopyButton>` |
| Cerrar un menú al tocar afuera o con `Esc` | `useDismiss()` |
| Números de dos cifras ("01", "02") | `twoDigits()`, en `lib/format.ts` |
| Animaciones de entrada y de cambio | `fadeUp`, `staggerContainer` y `swap`, en `lib/animations.ts` |

## Reglas del código

- **Idiomas:** nombres y comentarios en inglés. Lo que ve el usuario, en español.
- **Textos aparte:** los textos visibles van en `lib/content/` (o en `lib/oraculo/config/` para el Oráculo), no dentro de los componentes.
- **Tipos estrictos:** TypeScript estricto y sin `any`.
- **Validar lo que llega de afuera:** peticiones, variables de entorno y datos del navegador se revisan con zod.
- **Reglas fuera de las pantallas:** la lógica que se puede probar (reglas de un juego, cálculos) va en `lib/`, con su archivo `.test.ts` al lado. Los componentes solo la usan.
- **Archivos cortos:** ninguno pasa de unas 200 líneas. Si un componente crece, sus partes van a una subcarpeta y la lógica a un hook.
- **Pocas dependencias:** se prefieren utilidades pequeñas propias. Por ejemplo, `cn()` en lugar de clsx.
- **Servicios externos detrás de interfaces:** la IA (`ChatModel`), la revisión de riesgo (`RiskChecker`) y el Drive (`GalleryStore`). Así se prueban con versiones falsas y se puede cambiar de proveedor sin tocar el resto.
- **Registros sin datos personales:** el servidor solo anota códigos de error, nunca lo que escribe el usuario.
- **Tailwind sin avisos:** usa las clases estándar de Tailwind (por ejemplo, `bg-white/5` y no `bg-white/[0.05]`).

## Diseño

- **Colores:** azul marino 60 %, blanco y gris 20 %, verde 15 %, amarillo 5 % (solo para destacar). Están en `app/globals.css`.
- **Letras:** Unbounded para los títulos, Manrope para el texto y Geist Mono para las etiquetas.
- **Movimiento:** framer-motion. Si la persona pidió menos movimiento en su equipo, se respeta.
- **Oráculo:** tiene su propio tema claro y oscuro, con colores `o-*` en `.oraculo-theme`.

## Seguridad

- Todas las páginas envían cabeceras de seguridad (`next.config.ts`). Otros sitios no pueden mostrarlas dentro de los suyos.
- Las APIs solo aceptan peticiones `POST` que vengan del mismo sitio (`lib/mismo-origen.ts`), y sus respuestas no se guardan en caché.
- Los detalles del Oráculo y de la galería están en sus guías.
