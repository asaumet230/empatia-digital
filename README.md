# EmpatIA Digital

Presentación web para la capacitación **EmpatIA Digital** de la Alcaldía de Barranquilla.

Cada sesión es una página. Cada sección de la página es una diapositiva. Se avanza con el scroll, el teclado o un presentador inalámbrico.

**Sitio publicado:** https://www.empatia-digital.com

## Qué incluye

| Parte | Qué es | Estado |
|---|---|---|
| Sesiones | Tres presentaciones: docentes, estudiantes y familias | Publicadas |
| Galería | Los estudiantes suben sus imágenes al Drive de la Fundación | Publicada |
| Oráculo | Chat con IA de escucha y orientación sobre convivencia y ciberacoso | Oculto hasta su aprobación |

## Cómo arrancarlo

Necesitas Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

Las sesiones funcionan sin configurar nada más. El Oráculo y la galería necesitan claves: copia `.env.example` como `.env.local` y complétalo. Cada variable está explicada ahí.

## Comandos

| Comando | Para qué sirve |
|---|---|
| `npm run dev` | Abre el sitio en modo desarrollo |
| `npm run build` | Compila el sitio como en producción. También revisa los tipos |
| `npm run lint` | Revisa el estilo del código |
| `npm test` | Pruebas rápidas. No usan internet ni gastan saldo |
| `npm run test:e2e` | Prueba el Oráculo en computador, iPhone y Android, con una IA falsa |
| `npm run eval:riesgo` | Prueba la detección de riesgo con la IA real. Gasta un poco de saldo de OpenAI |

Dos detalles:

- Para revisar los tipos usa `npm run build`. El comando `tsc --noEmit` falla porque Next crea algunos tipos al compilar.
- Antes de la primera vez de `npm run test:e2e`, instala los navegadores de prueba: `npx playwright install chromium webkit`.

## Páginas del sitio

| Dirección | Qué muestra |
|---|---|
| `/` | Inicio: elegir la sesión, con códigos QR |
| `/docentes` | Sesión para docentes (2 horas) |
| `/estudiantes` | Sesión para estudiantes (1 hora) |
| `/familias` | Sesión para familias (2 horas) |
| `/subir` | Subir imágenes a la galería |
| `/oraculo` | El Oráculo. Muestra "no encontrado" mientras esté oculto |
| `/privacidad`, `/terminos` | Política de privacidad y términos del sitio |
| `/oraculo/privacidad`, `/oraculo/terminos`, `/oraculo/autorizacion` | Textos legales del Oráculo |

## Guías

Lee primero la de arquitectura. Las demás, según lo que vayas a tocar.

| Guía | Léela si vas a… |
|---|---|
| [Arquitectura](docs/arquitectura.md) | Entender cómo está organizado el código o agregar una diapositiva |
| [Contenido y sesiones](docs/contenido.md) | Cambiar textos, prompts o materiales, o preparar un taller |
| [Oráculo](docs/oraculo.md) | Trabajar en el chat o prepararlo para su lanzamiento |
| [Galería](docs/galeria.md) | Configurar o cambiar la subida de imágenes |
| [Publicación y mantenimiento](docs/mantenimiento.md) | Publicar cambios o revisar los pendientes |

## Tecnología

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · framer-motion · zod · OpenAI · Vitest · Playwright.

Next.js 16 cambió varias cosas respecto a versiones anteriores. Su documentación está dentro del proyecto, en `node_modules/next/dist/docs/`.

## Responsable

**Fundación Por Una Sonrisa** (NIT 900.804.571-1) es la responsable de los datos. Contacto: contacto@fporunasonrisa.com.
