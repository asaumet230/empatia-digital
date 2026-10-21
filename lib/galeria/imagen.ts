/* ------------------------------------------------------------------ */
/*  Gallery upload: what counts as an image. Shared by the browser     */
/*  (to warn early) and the server (which decides).                    */
/* ------------------------------------------------------------------ */

/** Vercel accepts request bodies up to 4.5 MB; the image must fit with room for the form. */
export const MAX_IMAGE_BYTES = 4_000_000;

/** Raster formats only: SVG can carry scripts and is never accepted. */
export const IMAGE_TYPES = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
} as const;
export type ImageKind = keyof typeof IMAGE_TYPES;

const startsWith = (bytes: Uint8Array, signature: readonly number[], offset = 0) =>
  signature.every((byte, i) => bytes[offset + i] === byte);

/**
 * The real type of a file, read from its first bytes (its "magic number"). The name and the
 * type the browser reports can be faked; these bytes cannot without breaking the image.
 */
export function detectImage(bytes: Uint8Array): ImageKind | null {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "jpeg";
  // "RIFF" + 4 size bytes + "WEBP"
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) return "webp";
  return null;
}
