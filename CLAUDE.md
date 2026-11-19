@AGENTS.md

# Guía para asistentes de IA

Instrucciones para asistentes de código (Claude Code y similares) que trabajen en este repositorio. La documentación del proyecto está en `docs/` y se importa abajo; leer solo los archivos que la tarea toque. La primera línea (`@AGENTS.md`) la mantiene `next dev`: no borrarla.

## Reglas

- **Next.js 16** trae cambios que no aparecen en la documentación antigua: antes de usar una API de Next, leer la guía en `node_modules/next/dist/docs/`.
- **Tipos:** revisar con `npx next build`. `tsc --noEmit` falla porque Next genera algunos tipos al compilar.
- **Secretos:** nunca leer ni mostrar `.env.local`. Las variables están documentadas en `.env.example`.
- **Publicación:** cada push a `main` despliega en producción. No hacer push ni unir a `main` sin permiso explícito.
- **Antes de dar algo por terminado:** `npm test`, `npm run lint` y `npm run build`. Si cambia la interfaz del Oráculo, también `npm run test:e2e`. Si cambia el prompt o el modelo de riesgo, `npm run eval:riesgo` (consume saldo de OpenAI).
- **Estilo:** seguir las convenciones de [docs/arquitectura.md](docs/arquitectura.md#reglas-del-código). Identificadores y comentarios en inglés; textos visibles en español, en `lib/content/` o `lib/oraculo/config/`.
- **Oráculo:** al cambiar un prompt o un mensaje de emergencia, subirle la `version`. Las decisiones de diseño de [docs/oraculo.md](docs/oraculo.md) ya están acordadas con PazLab; no cambiarlas sin pedirlo.
- **Documentación:** si el código deja de coincidir con `docs/`, corregir la guía en la misma tarea.

## Documentación

@docs/arquitectura.md
@docs/contenido.md
@docs/oraculo.md
@docs/galeria.md
@docs/mantenimiento.md
