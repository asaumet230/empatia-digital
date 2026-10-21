import type { UploadErrorCode } from "@/lib/content/galeria";
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/galeria/imagen";

/* ------------------------------------------------------------------ */
/*  Browser side of the gallery upload. Before sending, the image is   */
/*  drawn again on a canvas: a file that is not really an image fails  */
/*  right there, the hidden data (like a phone's GPS location) is      */
/*  dropped, and the size shrinks to fit the server's limit.           */
/* ------------------------------------------------------------------ */

/** Biggest file the person may pick; it is made smaller before it leaves the device. */
export const MAX_PICK_BYTES = 15_000_000;
/** Longest side after resizing: plenty for a report or a projector. */
const MAX_SIDE = 2048;
const QUALITIES = [0.9, 0.8, 0.7, 0.6];

export class UploadError extends Error {
  constructor(readonly code: UploadErrorCode) {
    super(code);
    this.name = "UploadError";
  }
}

/** Only the formats the server accepts; checked again there by the file's real bytes. */
export const isAcceptedType = (type: string) => (Object.values(IMAGE_TYPES) as string[]).includes(type);

const toBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

/** Re-draws the image as WEBP (JPEG where the browser cannot write WEBP, like older Safari). */
export async function prepareImage(file: File): Promise<Blob> {
  if (!isAcceptedType(file.type)) throw new UploadError("tipo");
  if (file.size > MAX_PICK_BYTES) throw new UploadError("tamano");

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new UploadError("tipo");

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const draw = (background?: string) => {
    const context = canvas.getContext("2d")!;
    if (background) {
      context.fillStyle = background;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  };

  try {
    draw();
    let type = "image/webp";
    for (const quality of QUALITIES) {
      let blob = await toBlob(canvas, type, quality);
      if (blob && blob.type !== type) {
        // No WEBP here: JPEG has no transparency, so stickers get a white background
        type = "image/jpeg";
        draw("#ffffff");
        blob = await toBlob(canvas, type, quality);
      }
      if (blob && blob.size <= MAX_IMAGE_BYTES) return blob;
    }
    throw new UploadError("tamano");
  } finally {
    bitmap.close();
  }
}

/**
 * Sends one prepared image with the school's DANE code. XMLHttpRequest instead of fetch: it is the
 * one that reports upload progress, for the progress bar (`onProgress` gets 0 to 1).
 */
export function uploadImage(school: string, image: Blob, onProgress: (sent: number) => void): Promise<void> {
  const form = new FormData();
  form.append("colegio", school);
  form.append("imagen", image, image.type === "image/webp" ? "imagen.webp" : "imagen.jpg");

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", "/api/galeria");
    request.responseType = "json";
    request.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    request.onerror = () => reject(new UploadError("sin_conexion"));
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) return resolve();
      const code = (request.response as { error?: unknown } | null)?.error;
      reject(new UploadError(typeof code === "string" ? (code as UploadErrorCode) : "fallo"));
    };
    request.send(form);
  });
}
