# Publicación y mantenimiento

Cómo se publica el sitio, cómo se configura y qué queda pendiente.

## Cómo se publica

El sitio está en **Vercel**. Cada vez que se sube un cambio a la rama `main` en GitHub, Vercel lo publica solo en https://www.empatia-digital.com.

Repositorio: https://github.com/asaumet230/empatia-digital

Antes de subir cambios a `main`, corre:

```bash
npm test
npm run lint
npm run build
```

Y además:

- si cambiaste el chat del Oráculo: `npm run test:e2e`;
- si cambiaste la detección de riesgo: `npm run eval:riesgo` (gasta un poco de saldo).

## Revisión automática en GitHub

Cada vez que se sube un cambio a `main`, o se abre un pull request, GitHub revisa el proyecto solo (`.github/workflows/ci.yml`).

Hace dos revisiones al mismo tiempo:

1. **Estilo, pruebas y compilación:** `npm run lint` (sin ningún aviso), `npm test` y `npm run build`.
2. **Pruebas de punta a punta:** `npm run test:e2e` en Chromium y WebKit.

El resultado aparece junto a cada cambio en GitHub: ✅ si todo pasó, ❌ si algo falló. Si fallan las pruebas de punta a punta, el detalle se guarda 7 días en la pestaña **Actions**, dentro de esa revisión.

La revisión no publica nada (eso lo hace Vercel) y no usa claves: el Oráculo se prueba con la IA falsa.

## Variables de entorno

Todas están explicadas en [`.env.example`](../.env.example). Cómo cambiarlas en Vercel y volver a publicar: [vercel.md](vercel.md).

Así está producción hoy:

| Variable | Estado | Efecto |
|---|---|---|
| `GALERIA_SCRIPT_URL` y `GALERIA_SECRET` | Puestas | La galería funciona |
| `ORACULO_ACTIVO` | Sin poner | El Oráculo está oculto |
| `OPENAI_API_KEY` y `ORACULO_SECRET` | Sin poner | Se ponen al lanzar el Oráculo |
| `SITE_URL` | Sin poner | Se usa la dirección de siempre |
| `ORACULO_IA_SIMULADA` y `GALERIA_SIMULADA` | **Nunca ponerlas** | Son solo para pruebas; en Vercel no tienen efecto |

Las claves nunca se suben a GitHub: `.env.local` está excluido en `.gitignore`.

## Trabajar en tu computador

- Next no deja abrir dos `npm run dev` en la misma carpeta. Si necesitas un segundo servidor, usa `npm run build` y luego `npx next start -p 3001`.
- Para ver el Oráculo, pon `ORACULO_ACTIVO=true` en `.env.local` y reinicia `npm run dev`.
- El ícono de Next que aparece en desarrollo está arriba a la derecha para no tapar el botón del Oráculo.

## Pendientes

| Qué falta | Dónde se hace |
|---|---|
| Límite por visitante para `/api/galeria` (y para `/api/oraculo/mensaje` al lanzarlo) | Vercel → Firewall. Paso a paso en [vercel.md](vercel.md#3-límite-por-visitante-firewall) |
| Borrar las imágenes de la galería 90 días después de subidas, como promete la política de privacidad | Drive de la Fundación, o una tarea automática en el script (ver [galeria.md](galeria.md#pendientes)) |
| Aprobaciones para lanzar el Oráculo | Ver [oraculo.md](oraculo.md#cómo-lanzarlo) |
| Actualizar algunas librerías a versiones menores (`openai`, `lucide-react`, `playwright`, `vitest`, `tailwindcss`) | `package.json` |

## Notas para quien mantenga el proyecto

- `npm audit` muestra avisos moderados, pero solo en herramientas de prueba que no llegan al sitio publicado. `npm audit --omit=dev` está limpio.
- `npm ls` marca algunos paquetes opcionales de `sharp` como sobrantes. No afectan.
- ESLint 9 ya no recibe soporte. Se puede pasar a ESLint 10 cuando se quiera.
- Next.js está fijo en 16.4.6, que corrige los avisos de seguridad de la 16.4.5.
