# Vercel

Todo lo que se configura en Vercel, el servicio donde está publicado el sitio, paso a paso.

Vercel publica el sitio solo cada vez que se sube un cambio a la rama `main` en GitHub. Lo que se explica aquí no está en el código: se hace en el panel de Vercel (https://vercel.com), dentro del proyecto **empatia-digital**.

## 1. Variables de entorno

Las claves y los interruptores del sitio. La explicación de cada una está en [`.env.example`](../.env.example).

**Dónde:** proyecto → **Settings** → **Environment Variables**.

**Cómo agregar o cambiar una:**

1. Escribe el nombre (por ejemplo, `GALERIA_SECRET`) y su valor.
2. Marca el entorno **Production**.
3. Guarda.
4. **Vuelve a publicar el sitio** (ver la sección 2). Sin este paso, el cambio no se aplica.

**Cuáles van en producción:**

| Variable | ¿Va en Vercel? | Para qué |
|---|---|---|
| `GALERIA_SCRIPT_URL` | Sí (ya está) | Dirección del script de Google Drive |
| `GALERIA_SECRET` | Sí (ya está) | Clave compartida con el script |
| `ORACULO_ACTIVO` | Solo al lanzar el Oráculo, con valor `true` | Enciende el Oráculo |
| `OPENAI_API_KEY` | Solo al lanzar el Oráculo | Clave de OpenAI |
| `ORACULO_SECRET` | Solo al lanzar el Oráculo. Crea una **nueva**, distinta de la de tu computador | Firma las sesiones del chat |
| `SITE_URL` | No hace falta | Solo si el dominio cambia |
| `ORACULO_IA_SIMULADA`, `GALERIA_SIMULADA` | **Nunca** | Son solo para pruebas |

Para crear una clave al azar, en la terminal: `openssl rand -base64 48`.

## 2. Volver a publicar (Redeploy)

Hace falta después de cambiar cualquier variable.

1. Proyecto → **Deployments**.
2. En la publicación más reciente de **Production**, abre el menú **⋯**.
3. Elige **Redeploy** y confirma.

En uno o dos minutos el sitio queda actualizado.

## 3. Límite por visitante (Firewall)

Evita que un programa haga miles de envíos seguidos. Sin este límite, alguien podría llenar el Drive de la Fundación con imágenes, o gastar el saldo de OpenAI con el Oráculo.

> **Importante:** en un colegio, todos los estudiantes salen a internet con **la misma dirección IP**. Para Vercel, una clase entera es un solo visitante. Por eso los límites de abajo son generosos.

### Cómo crear la regla

1. Proyecto → **Firewall** (en el menú de la izquierda).
2. Arriba a la derecha, **Configure** → **+ New Rule**.
3. Ponle un nombre, por ejemplo `Límite galería`.
4. En **If**, elige **Request Path**, luego **Equals**, y escribe la dirección (ver la tabla).
5. En **Then**, elige **Rate Limit**. La primera vez aparece un aviso de precios: elige **Continue**.
6. Elige **Fixed Window**, el tiempo (**Time Window**) y el número de envíos (**Request Limit**) de la tabla. Cuenta por **IP**.
7. Deja la acción **Too Many Requests (429)**.
8. Elige **Save Rule**.
9. Arriba a la derecha aparece **Review Changes**. Ábrelo, revisa y elige **Publish**. **Si no publicas, la regla no funciona.**

### Valores recomendados

| Para | Request Path (Equals) | Time Window | Request Limit |
|---|---|---|---|
| Galería | `/api/galeria` | 10 minutos | 60 |
| Oráculo, solo al lanzarlo | `/api/oraculo/mensaje` | 1 minuto | 60 |

Por qué estos números:

- **Galería:** una clase sube entre 10 y 30 imágenes en pocos minutos. 60 cada 10 minutos le alcanza a una clase, pero frena a un programa.
- **Oráculo:** cada mensaje es un envío. 60 por minuto aguanta a muchos estudiantes del mismo colegio escribiendo a la vez.

### Según el plan de Vercel

- **Plan Hobby (gratis):** solo permite **una** regla de límite. Haz la de la galería. Para el Oráculo, agrega a esa misma regla un segundo grupo de condiciones con **OR** y la ruta `/api/oraculo/mensaje`. Las dos rutas compartirán el mismo contador, así que en ese caso sube el límite a 120 cada 10 minutos.
- **Plan Pro:** permite hasta 40 reglas. Haz una por ruta, cada una con sus valores. Agrega también una para `/api/oraculo/cierre` (el resumen final, que también usa OpenAI), con 20 envíos por minuto.

### Antes de confiar en la regla

Si no estás seguro de los números, crea la regla primero con la acción **Log** en lugar de **Too Many Requests (429)**. Así solo anota, sin bloquear. Después de un taller, revisa en **Firewall** cuántos envíos hubo y ajusta.

## 4. Al lanzar el Oráculo

Esta es la parte de Vercel. La lista completa, con las aprobaciones, está en [oraculo.md](oraculo.md#cómo-lanzarlo).

1. Agrega `OPENAI_API_KEY` y un `ORACULO_SECRET` nuevo (sección 1).
2. Crea la regla de límite del Oráculo (sección 3).
3. Agrega `ORACULO_ACTIVO` con valor `true` (sección 1).
4. Vuelve a publicar (sección 2).
5. Prueba el chat en un iPhone y un Android de verdad.

Fuera de Vercel, pon también un **tope de gasto mensual en OpenAI**: platform.openai.com → **Settings** → **Limits**.

## Fuente

Los pasos del Firewall siguen la documentación oficial de Vercel: [WAF Rate Limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting). Si el panel cambia, revisa esa página.
