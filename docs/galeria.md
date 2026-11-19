# Galería

En la actividad "Creadores de paz", cada equipo sube su imagen desde `/subir`. Las imágenes llegan al Google Drive de la Fundación Por Una Sonrisa, en una carpeta por colegio.

## Cómo viaja una imagen

1. **En el navegador.** El equipo elige su colegio de la lista y suelta o elige sus imágenes. El navegador vuelve a dibujar cada imagen: así se comprueba que es una imagen de verdad, se le quitan los datos ocultos (como la ubicación GPS del celular) y se reduce a 2048 px y menos de 4 MB.
2. **En nuestro servidor** (`/api/galeria`). Se revisa todo otra vez: que venga de nuestro sitio, que el colegio exista, el tamaño y el tipo real del archivo. Solo se aceptan PNG, JPEG y WEBP. SVG nunca.
3. **En Google.** Un script de Google guarda la imagen en la carpeta del colegio. Si la carpeta no existe, la crea.

El nombre de cada archivo es la fecha y la hora de Bogotá más 4 letras al azar. Por ejemplo: `2026-11-19 10.30.15 a3f9.webp`.

El límite de 4 MB existe porque Vercel no acepta envíos de más de 4,5 MB.

## Dónde está el código

| Qué | Archivo |
|---|---|
| La página de subida | `components/galeria/` |
| La lógica de la subida y la barra de progreso | `hooks/useGalleryUpload.ts` |
| Preparar la imagen en el navegador | `lib/galeria/cliente.ts` |
| Reconocer el tipo real del archivo | `lib/galeria/imagen.ts` |
| La API | `app/api/galeria/route.ts` |
| La conexión con Google | `lib/galeria/destino.ts` |
| El script de Google | `scripts/galeria-drive.gs` |

Sin `GALERIA_SCRIPT_URL` ni `GALERIA_SECRET`, la página avisa que la subida no está abierta. Para probar en tu computador sin Drive, usa `GALERIA_SIMULADA=1`: acepta las imágenes pero no las guarda.

## La lista de colegios

`lib/content/colegios.ts` tiene los 158 colegios públicos de Barranquilla, según el directorio del Ministerio de Educación (2025).

Ese archivo se genera con `node scripts/colegios.mjs`. Dentro del script hay dos listas que se editan a mano:

- `RENAMED`: colegios con el nombre corregido.
- `MERGED`: colegios que se unieron con otro.

Los nombres solo pueden tener letras, números, espacios y puntos, porque se usan como nombre de carpeta en Drive.

## Cómo configurar el script de Google

1. En el Drive de la Fundación, crea la carpeta **"Galería EmpatIA"**. Copia su código: es la última parte de la dirección de la carpeta.
2. Entra a script.google.com, crea un proyecto nuevo y pega el contenido de `scripts/galeria-drive.gs`.
3. Ve a Configuración del proyecto → Propiedades del script y agrega dos:
   - `SECRET`: una clave al azar de 32 caracteres o más.
   - `FOLDER_ID`: el código de la carpeta.
4. Ve a Implementar → Nueva implementación → **Aplicación web**. Elige "Ejecutar como: Yo" y "Quién tiene acceso: Cualquier usuario".
5. Copia la dirección que termina en `/exec`.
6. En `.env.local` y en Vercel, pon esa dirección en `GALERIA_SCRIPT_URL` y la misma clave en `GALERIA_SECRET`. En Vercel, vuelve a publicar.

Si cambias el código del script, crea una **versión nueva** de la implementación. La dirección `/exec` sigue siendo la misma.

## Pendientes

- **Límite por visitante** en Vercel → Firewall para `/api/galeria`. El chequeo de origen frena a otros sitios web, pero no a un programa, que podría llenar el Drive (15 GB). Paso a paso en [vercel.md](vercel.md#3-límite-por-visitante-firewall).
- **Política de privacidad:** agregar en `lib/content/privacidad.ts` una línea sobre las imágenes de la galería y sobre Google Drive. Debe revisarla el abogado.
